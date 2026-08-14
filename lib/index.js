// @ts-check
/**
 * dsh-plugin-balance — host half.
 *
 * Registers two exact routes on the dsh web server:
 *
 *   GET /api/dsh-balance
 *     Reads the DeepSeek API key (the same `DEEPSEEK_API_KEY` credential the
 *     llm-deepseek provider uses, or the ambient environment) and proxies the
 *     DeepSeek balance endpoint, returning a sanitized JSON envelope so the
 *     API key never reaches the browser.
 *
 *   GET /api/dsh-pricing
 *     Serves the official DeepSeek V4 price table, periodically fetched from
 *     https://api-docs.deepseek.com/zh-cn/quick_start/pricing/ (a static page
 *     with ETag support, so refreshes are conditional and near-zero cost when
 *     nothing changed). On fetch/parse failure the last good table is kept;
 *     before the first successful fetch the built-in fallback table is used.
 *
 * The balance base URL honors the same `DEEPSEEK_BASE_URL` environment override
 * as the llm-deepseek provider, defaulting to the public https://api.deepseek.com.
 *
 * The host half has ZERO npm dependencies on purpose: `dsh plugin add` runs pnpm,
 * and pnpm does not install the dependencies of file:/tarball packages, so any
 * `@deepseek-ai/*` import would break fresh installs. The two helpers that would
 * otherwise come from @deepseek-ai/dsh-credentials and
 * @deepseek-ai/dsh-launch-environment are inlined below (they are trivial and
 * stable; the credentials "ref" is just a validated env-var name string).
 */

/** Cordis plugin name. */
export const name = "dsh-balance";

/** Services required before this plugin activates. */
export const inject = ["webServer"];

/** Credential reference the DeepSeek provider stores its key under. */
const API_KEY_REF = "DEEPSEEK_API_KEY";
/** Environment override naming this provider's endpoint (shared with llm-deepseek). */
const BASE_URL_ENV = "DEEPSEEK_BASE_URL";
/** Public API default; the internal endpoint comes from $DEEPSEEK_BASE_URL. */
const PUBLIC_BASE_URL = "https://api.deepseek.com";
/** The route this plugin owns for balance. */
const ROUTE = "/api/dsh-balance";
/** The route this plugin owns for pricing. */
const PRICING_ROUTE = "/api/dsh-pricing";
/** Official pricing page (static HTML, ETag-supported). */
const PRICING_URL = "https://api-docs.deepseek.com/zh-cn/quick_start/pricing/";
/** How often to re-validate the price table (ETag conditional GET). */
const PRICING_REFRESH_MS = 6 * 60 * 60 * 1000;
/** Per-request timeout for the upstream pricing page. */
const PRICING_FETCH_TIMEOUT_MS = 15 * 1000;

/**
 * Inline equivalent of @deepseek-ai/dsh-credentials' `credentialRef`: validate a
 * POSIX shell identifier and return it as-is (the runtime value is a plain string).
 * @param value - candidate reference such as `DEEPSEEK_API_KEY`.
 * @returns the validated reference string.
 */
function credentialRef(value) {
	const pattern = /^[A-Za-z_][A-Za-z0-9_]*$/;
	if (!pattern.test(value)) throw new TypeError(`credential ref "${value}" must match ${String(pattern)}`);
	return value;
}

/**
 * Inline equivalent of @deepseek-ai/dsh-launch-environment's `launchEnvironmentOf(ctx).get`:
 * read a launch-environment value (launcher snapshot when present, otherwise the
 * inherited process environment), returning undefined when unset or empty.
 * @param ctx - plugin context.
 * @param name - environment variable name.
 * @returns the value, or undefined.
 */
function launchEnvGet(ctx, name) {
	const snapshot = ctx.get("launchEnvironment");
	if (snapshot !== void 0) {
		const hit = snapshot.get(name);
		if (hit !== void 0 && hit.value.length > 0) return hit.value;
	}
	const ambient = process.env[name];
	return ambient !== void 0 && ambient.length > 0 ? ambient : void 0;
}

/**
 * Built-in fallback price table, CNY per million tokens, matching the official
 * rates as of 2026-08-14 (used only until the first successful fetch).
 * `legacy` = flat price before the peak/off-peak schedule takes effect;
 * `peak`/`offpeak` = the schedule applied after `effectiveFromUtc`.
 */
const BUILTIN_PRICING = {
	models: {
		"deepseek-v4-flash": {
			legacy: { hit: 0.02, miss: 1, out: 2 },
			peak: { hit: 0.1, miss: 3, out: 9 },
			offpeak: { hit: 0.05, miss: 1.5, out: 4.5 }
		},
		"deepseek-v4-pro": {
			legacy: { hit: 0.025, miss: 3, out: 6 },
			peak: { hit: 0.3, miss: 9, out: 27 },
			offpeak: { hit: 0.15, miss: 4.5, out: 13.5 }
		}
	},
	effectiveFromUtc: Date.UTC(2026, 7, 16, 16, 0, 0),
	peakWindows: [[9, 12], [14, 18]]
};

/** Live pricing state: last good table + fetch metadata. */
const pricingState = {
	fetchedAt: 0,
	etag: null,
	source: "fallback",
	data: BUILTIN_PRICING
};
/** Guards against overlapping background refreshes. */
let refreshing = false;

/** Write a JSON response with no-store caching. */
function writeJson(res, status, payload) {
	const body = JSON.stringify(payload);
	res.writeHead(status, {
		"Content-Type": "application/json; charset=utf-8",
		"Cache-Control": "no-store"
	});
	res.end(body);
}

/**
 * Resolve the DeepSeek API key: the credentials service first (the web Models
 * page writes it there), then the launching environment as fallback.
 * @param ctx - plugin context.
 * @returns the resolved key, or undefined when absent everywhere.
 */
async function resolveApiKey(ctx) {
	const credentials = ctx.get("credentials");
	if (credentials !== void 0) {
		const hit = await credentials.resolve(credentialRef(API_KEY_REF)).catch(() => void 0);
		if (hit !== void 0 && hit.value.length > 0) return hit.value;
	}
	const ambient = launchEnvGet(ctx, API_KEY_REF);
	if (ambient !== void 0) return ambient;
	return void 0;
}

//#region pricing fetch + parse
/** Flatten HTML tags into pipe separators so table cells stay addressable. */
function flattenHtml(html) {
	return html.replace(/<[^>]+>/g, "|").replace(/\s+/g, " ");
}

/**
 * Parse the official pricing page into the same shape as BUILTIN_PRICING.
 * Recognizes the peak/off-peak table, the legacy flat-price table, the
 * effective date (CST), and the peak windows. Returns null when the page does
 * not contain the expected structure (keeps the previous table).
 * @param html - raw pricing page HTML.
 */
function parsePricing(html) {
	const t = flattenHtml(html);
	const cell = "([\\d.]+)\\s*元";
	const parseModel = (name) => {
		// deepseek-v4-flash | 空闲时段 | <hit>元 | <miss>元 | <out>元 | 高峰时段 | <hit>元 | <miss>元 | <out>元
		const m = t.match(new RegExp(
			`${name}\\s*\\|+\\s*空闲时段\\s*\\|+\\s*${cell}\\s*\\|+\\s*${cell}\\s*\\|+\\s*${cell}\\s*\\|+\\s*高峰时段\\s*\\|+\\s*${cell}\\s*\\|+\\s*${cell}\\s*\\|+\\s*${cell}`
		));
		if (m === null) return null;
		return {
			offpeak: { hit: parseFloat(m[1]), miss: parseFloat(m[2]), out: parseFloat(m[3]) },
			peak: { hit: parseFloat(m[4]), miss: parseFloat(m[5]), out: parseFloat(m[6]) }
		};
	};
	// Legacy flat table: 百万tokens输入（缓存命中）| <flash>元 | <pro>元 | 百万tokens输入（缓存未命中）| <flash>元 | <pro>元 | 百万tokens输出 | <flash>元 | <pro>元
	const legacy = t.match(new RegExp(
		`百万tokens输入（缓存命中）\\s*\\|+\\s*${cell}\\s*\\|+\\s*${cell}\\s*\\|+\\s*百万tokens输入（缓存未命中）\\s*\\|+\\s*${cell}\\s*\\|+\\s*${cell}\\s*\\|+\\s*百万tokens输出\\s*\\|+\\s*${cell}\\s*\\|+\\s*${cell}`
	));
	const flash = parseModel("deepseek-v4-flash");
	const pro = parseModel("deepseek-v4-pro");
	if (flash === null || pro === null) return null;
	// Effective date: 北京时间 2026 年 8 月 17 日 00:00 → UTC
	const epoch = t.match(/北京时间\s*(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日\s*(\d{1,2}):(\d{2})/);
	let effectiveFromUtc = BUILTIN_PRICING.effectiveFromUtc;
	if (epoch !== null) {
		effectiveFromUtc = Date.UTC(Number(epoch[1]), Number(epoch[2]) - 1, Number(epoch[3]), Number(epoch[4]) - 8, Number(epoch[5]));
	}
	// Peak windows: 高峰时段为北京时间 9:00 - 12:00、14:00 - 18:00
	const peak = t.match(/高峰时段为北京时间\s*(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})\s*、\s*(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
	let peakWindows = BUILTIN_PRICING.peakWindows;
	if (peak !== null) {
		peakWindows = [[Number(peak[1]), Number(peak[3])], [Number(peak[5]), Number(peak[7])]];
	}
	return {
		models: {
			"deepseek-v4-flash": {
				legacy: legacy !== null
					? { hit: parseFloat(legacy[1]), miss: parseFloat(legacy[3]), out: parseFloat(legacy[5]) }
					: flash.offpeak,
				...flash
			},
			"deepseek-v4-pro": {
				legacy: legacy !== null
					? { hit: parseFloat(legacy[2]), miss: parseFloat(legacy[4]), out: parseFloat(legacy[6]) }
					: pro.offpeak,
				...pro
			}
		},
		effectiveFromUtc,
		peakWindows
	};
}

/**
 * Re-validate the price table against the official page using an ETag
 * conditional request; a 304 keeps the current table and only refreshes the
 * timestamp. Never throws — failures keep the last good state.
 * @returns true when the table is considered fresh after this call.
 */
async function refreshPricing() {
	const headers = { "Accept-Language": "zh-CN" };
	if (pricingState.etag !== null) headers["If-None-Match"] = pricingState.etag;
	let response;
	try {
		response = await fetch(PRICING_URL, { headers, signal: AbortSignal.timeout(PRICING_FETCH_TIMEOUT_MS) });
	} catch {
		return false;
	}
	if (response.status === 304) {
		pricingState.fetchedAt = Date.now();
		return true;
	}
	if (!response.ok) return false;
	let html;
	try {
		html = await response.text();
	} catch {
		return false;
	}
	const data = parsePricing(html);
	if (data === null) return false;
	pricingState.data = data;
	pricingState.etag = response.headers.get("etag") ?? null;
	pricingState.fetchedAt = Date.now();
	pricingState.source = "official";
	return true;
}

/** Kick a background refresh when the cached table is stale (never blocks). */
function refreshIfStale() {
	if (refreshing) return;
	if (Date.now() - pricingState.fetchedAt < PRICING_REFRESH_MS) return;
	refreshing = true;
	refreshPricing().finally(() => {
		refreshing = false;
	});
}
//#endregion

/**
 * Plugin body: mount the balance route, the pricing route, and the pricing
 * refresh loop for the lifetime of this fiber.
 * @param ctx - plugin context.
 */
export function apply(ctx) {
	ctx.effect(() => ctx.webServer.register({
		kind: "exact",
		path: ROUTE,
		handler: async (_req, res) => {
			const baseURL = launchEnvGet(ctx, BASE_URL_ENV) ?? PUBLIC_BASE_URL;
			const apiKey = await resolveApiKey(ctx);
			if (apiKey === void 0) {
				writeJson(res, 200, {
					ok: false,
					code: "NO_API_KEY",
					message: `未配置 DeepSeek API Key（${API_KEY_REF}）`
				});
				return;
			}
			try {
				const upstream = await fetch(`${baseURL}/user/balance`, {
					headers: {
						Authorization: `Bearer ${apiKey}`,
						Accept: "application/json"
					}
				});
				const text = await upstream.text();
				let data = null;
				try {
					data = JSON.parse(text);
				} catch {
					/* non-JSON upstream body — reported below */
				}
				if (!upstream.ok) {
					writeJson(res, 200, {
						ok: false,
						code: `HTTP_${upstream.status}`,
						status: upstream.status,
						message: data?.error?.message ?? text.slice(0, 200)
					});
					return;
				}
				writeJson(res, 200, { ok: true, data });
			} catch (error) {
				writeJson(res, 200, {
					ok: false,
					code: "NETWORK",
					message: String(error?.message ?? error)
				});
			}
		}
	}), "dsh-balance: balance route");

	ctx.effect(() => ctx.webServer.register({
		kind: "exact",
		path: PRICING_ROUTE,
		handler: async (_req, res) => {
			refreshIfStale();
			writeJson(res, 200, {
				ok: true,
				data: pricingState.data,
				fetchedAt: pricingState.fetchedAt,
				source: pricingState.source
			});
		}
	}), "dsh-balance: pricing route");

	ctx.effect(() => {
		refreshPricing().catch(() => {});
		const timer = setInterval(() => {
			refreshIfStale();
		}, PRICING_REFRESH_MS);
		return () => clearInterval(timer);
	}, "dsh-balance: pricing refresh loop");
}
