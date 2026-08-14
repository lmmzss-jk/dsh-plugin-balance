window.__ModuleLoader__.load({
	id: "dsh-plugin-balance",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		//#region styles
		const css = [
			"[data-dsh-balance-root]{--db-bg:var(--dsw-specific-menu,var(--dsw-alias-bg-base));--db-brd:var(--dsw-alias-border-l2);--db-fg:var(--dsw-alias-label-primary);--db-fg2:var(--dsw-alias-label-secondary);--db-fg3:var(--dsw-alias-label-tertiary);--db-ok:var(--dsw-alias-state-success-primary);--db-warn:var(--dsw-alias-state-warn-primary);--db-err:var(--dsw-alias-state-error-primary);--db-hover:var(--dsw-alias-interactive-bg-hover);--db-floating:var(--dsw-alias-button-floating-fill);--db-floating-hover:var(--dsw-alias-button-floating-hover);--db-shadow:var(--dsw-shadow-lv3);--db-font:Inter,var(--dsw-font-family,system-ui);all:initial;box-sizing:border-box;font-family:var(--db-font);position:relative;display:inline-flex;line-height:1.4;z-index:30}",
			"[data-dsh-balance-root] *,[data-dsh-balance-root] *:before,[data-dsh-balance-root] *:after{box-sizing:border-box}",
			"[data-dsh-balance-root][hidden]{display:none!important}",
			".db-btn{display:inline-flex;align-items:center;gap:6px;height:32px;max-width:230px;padding:6px 12px;border:1px solid var(--db-brd);border-radius:18px;background:var(--db-floating);color:var(--db-fg);font-family:var(--db-font);font-size:13px;font-weight:400;line-height:20px;cursor:pointer;white-space:nowrap;overflow:hidden;transition:background .15s var(--ds-ease-in-out, ease),border-color .15s var(--ds-ease-in-out, ease);user-select:none}",
			".db-btn:hover{background:var(--db-floating-hover);border-color:var(--dsw-alias-border-l3,var(--db-brd))}",
			".db-btn:focus-visible{outline:2px solid var(--db-fg3);outline-offset:2px}",
			".db-btn[data-tone=warn]{border-color:var(--db-warn);color:var(--db-warn)}",
			".db-btn[data-tone=err]{border-color:var(--db-err);color:var(--db-err)}",
			".db-btn .db-label{overflow:hidden;text-overflow:ellipsis}",
			".db-btn .db-dot{width:6px;height:6px;border-radius:50%;background:currentColor;flex:none}",
			".db-ico{display:inline-flex;flex:none;color:inherit}",
			".db-spin{animation:db-spin 1s linear infinite}@keyframes db-spin{to{transform:rotate(360deg)}}",
			".db-panel{position:absolute;top:calc(100% + 8px);right:0;width:320px;max-width:calc(100vw - 32px);background:var(--db-bg);border:1px solid var(--dsw-alias-border-inverted,var(--db-brd));border-radius:12px;box-shadow:var(--db-shadow);color:var(--db-fg);font-size:13px;overflow:hidden;z-index:2147483000}",
			".db-panel-head{display:flex;align-items:center;gap:8px;padding:12px 14px 8px}",
			".db-panel-title{font-size:13px;font-weight:600;color:var(--db-fg);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
			".db-refresh{display:inline-grid;place-items:center;width:26px;height:26px;border:0;border-radius:999px;background:transparent;color:var(--db-fg2);cursor:pointer;padding:0}",
			".db-refresh:hover{background:var(--db-hover)}",
			".db-refresh:disabled{opacity:.45;cursor:default}",
			".db-body{padding:0 14px 12px}",
			".db-section+.db-section{margin-top:12px;padding-top:12px;border-top:1px solid var(--db-brd)}",
			".db-section-label{font-size:11px;font-weight:600;color:var(--db-fg3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px}",
			".db-empty{padding:18px 0;text-align:center;color:var(--db-fg3)}",
			".db-sess-row{display:flex;justify-content:space-between;align-items:center;gap:12px;font-size:12px;color:var(--db-fg2);padding:2px 0}",
			".db-sess-row .db-sess-val{font-variant-numeric:tabular-nums;color:var(--db-fg);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
			".db-sess-model{font-weight:500}",
			".db-hitrate{display:flex;justify-content:space-between;align-items:center;gap:12px;font-size:12px;color:var(--db-fg2);padding:6px 0 2px}",
			".db-hitrate .db-hitrate-pct{font-variant-numeric:tabular-nums;font-weight:600;color:var(--db-ok)}",
			".db-hitbar{background:var(--db-hover);border-radius:999px;height:4px;margin:4px 0 2px;overflow:hidden}",
			".db-hitbar>span{display:block;background:var(--db-ok);border-radius:999px;height:100%;transition:width .3s var(--ds-ease-in-out, ease)}",
			".db-sess-cost{display:flex;align-items:baseline;gap:6px;padding:8px 0 2px;margin-top:4px;border-top:1px dashed var(--db-brd)}",
			".db-sess-cost .db-cost-amount{font-size:20px;font-weight:700;font-variant-numeric:tabular-nums;color:var(--db-fg)}",
			".db-sess-cost .db-cost-hint{font-size:11px;color:var(--db-fg3)}",
			".db-statusline{display:flex;align-items:center;gap:8px;font-size:12px;margin-bottom:10px}",
			".db-avail{display:inline-flex;align-items:center;gap:5px;font-weight:600;font-size:12px}",
			".db-avail[data-v=true]{color:var(--db-ok)}.db-avail[data-v=false]{color:var(--db-err)}",
			".db-avail .db-dot{width:7px;height:7px}",
			".db-errbox{display:flex;gap:8px;align-items:flex-start;padding:10px 12px;border:1px solid color-mix(in srgb,var(--db-err) 35%,transparent);border-radius:10px;background:color-mix(in srgb,var(--db-err) 8%,transparent);color:var(--db-fg);font-size:12px;line-height:1.5}",
			".db-errbox .db-ico{margin-top:1px;color:var(--db-err)}",
			".db-errbox .db-msg{min-width:0;word-break:break-word}",
			".db-errbox .db-msg b{display:block;font-weight:600;color:var(--db-err);font-size:12px}",
			".db-currencies{display:flex;flex-direction:column;gap:10px}",
			".db-currency{border:1px solid var(--db-brd);border-radius:10px;padding:10px 12px}",
			".db-currency-head{display:flex;align-items:baseline;gap:8px}",
			".db-currency-code{font-size:11px;font-weight:600;color:var(--db-fg3);text-transform:uppercase;letter-spacing:.04em}",
			".db-currency-total{font-size:22px;font-weight:700;font-variant-numeric:tabular-nums;color:var(--db-fg);margin-left:auto}",
			".db-currency-total[data-low=true]{color:var(--db-warn)}",
			".db-currency-total[data-zero=true]{color:var(--db-err)}",
			".db-rows{margin-top:8px;border-top:1px solid var(--db-brd);padding-top:6px;display:flex;flex-direction:column;gap:2px}",
			".db-row{display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--db-fg2)}",
			".db-row dd{margin:0;font-variant-numeric:tabular-nums;color:var(--db-fg)}",
			".db-foot{display:flex;align-items:center;gap:8px;padding:8px 14px 12px}",
			".db-updated{font-size:11px;color:var(--db-fg3);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
			".db-link{font-size:12px;color:var(--db-fg2);text-decoration:none;display:inline-flex;align-items:center;gap:4px;border:0;background:transparent;cursor:pointer;padding:2px 4px;border-radius:6px}",
			".db-link:hover{color:var(--db-fg);background:var(--db-hover)}",
			".db-link .db-ico{color:var(--db-fg3)}",
			".db-hint{font-size:12px;color:var(--db-fg3);margin:0 14px 12px;line-height:1.5}"
		].join("\n");
		const tagId = "dsh-plugin-balance/styles.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-plugin-balance";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region i18n
		function currentLang() {
			const el = typeof document !== "undefined" ? document.documentElement?.getAttribute("lang") : void 0;
			const raw = el || (typeof navigator !== "undefined" ? navigator.language : "") || "";
			return raw.toLowerCase().startsWith("zh") ? "zh" : "en";
		}
		const DICT = {
			zh: {
				button: "余额",
				title: "DeepSeek 账户余额",
				refresh: "刷新",
				loading: "查询中…",
				noKeyTitle: "未配置 API Key",
				noKeyBody: "插件复用 DeepSeek 的 DEEPSEEK_API_KEY。请在设置 → 模型中配置，或设置环境变量。",
				openSettings: "打开设置",
				unauthorized: "API Key 无效或已过期，请到设置 → 模型重新配置。",
				network: "网络请求失败，请检查本机网络后重试。",
				upstream: "上游返回错误",
				unknown: "未知错误",
				available: "账户可用",
				unavailable: "账户不可用或余额不足",
				low: "余额较低，请注意用量",
				zero: "余额不足，可能无法继续使用",
				toppedUp: "充值余额",
				granted: "赠送余额",
				updated: "更新于",
				platform: "DeepSeek 平台",
				multiCurrency: "多币种",
				noData: "暂无余额数据",
				sessionSection: "当前会话（实时）",
				cacheHitRate: "缓存命中率",
				cacheHitRateHint: "命中 / (命中 + 未命中)",
				noInput: "—",
				model: "模型",
				tokens: "Tokens",
				tokenInputMiss: "输入 · 未命中缓存",
				tokenInputHit: "输入 · 命中缓存",
				tokenCacheWrite: "缓存写入",
				tokenOutput: "输出",
				cost: "约",
				priceOfficial: "官方价目表",
				pricePeak: "官方价 · 高峰",
				priceOffpeak: "官方价 · 空闲",
				noUsage: "当前会话暂无用量",
				unknownModel: "未知模型"
			},
			en: {
				button: "Balance",
				title: "DeepSeek Account Balance",
				refresh: "Refresh",
				loading: "Loading…",
				noKeyTitle: "No API key configured",
				noKeyBody: "This plugin reuses DeepSeek's DEEPSEEK_API_KEY. Configure it in Settings → Models, or set the environment variable.",
				openSettings: "Open Settings",
				unauthorized: "The API key is invalid or expired. Reconfigure it in Settings → Models.",
				network: "Network request failed. Check your connection and retry.",
				upstream: "Upstream error",
				unknown: "Unknown error",
				available: "Account available",
				unavailable: "Account unavailable or insufficient balance",
				low: "Balance is low",
				zero: "Insufficient balance",
				toppedUp: "Topped up",
				granted: "Granted",
				updated: "Updated",
				platform: "DeepSeek platform",
				multiCurrency: "Multi-currency",
				noData: "No balance data",
				sessionSection: "Current session (live)",
				cacheHitRate: "Cache hit rate",
				cacheHitRateHint: "hit / (hit + miss)",
				noInput: "—",
				model: "Model",
				tokens: "Tokens",
				tokenInputMiss: "Input · cache miss",
				tokenInputHit: "Input · cache hit",
				tokenCacheWrite: "Cache write",
				tokenOutput: "Output",
				cost: "≈",
				priceOfficial: "official rates",
				pricePeak: "official · peak",
				priceOffpeak: "official · off-peak",
				noUsage: "No usage in this session yet",
				unknownModel: "Unknown model"
			}
		};
		function t(key) {
			return DICT[currentLang()][key] ?? key;
		}
		//#endregion
		//#region balance model
		const CURRENCY_SYMBOL = { CNY: "¥", USD: "$", EUR: "€", JPY: "¥" };
		function currencySymbol(code) {
			return CURRENCY_SYMBOL[code] ?? "";
		}
		/**
		 * Fetch the balance from the host proxy. Module-level cache: the widget
		 * survives session switches, and a stale cache lets the button show a
		 * number without a request on every mount.
		 */
		const cache = { at: 0, value: null };
		const CACHE_TTL_MS = 60 * 1000;
		const REQUEST_TIMEOUT_MS = 10 * 1000;
		async function fetchBalance(force) {
			const now = Date.now();
			if (!force && cache.value !== null && now - cache.at < CACHE_TTL_MS) return cache.value;
			const controller = new AbortController();
			const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
			try {
				const response = await fetch(`/api/dsh-balance?t=${now}`, {
					signal: controller.signal,
					headers: { Accept: "application/json" }
				});
				let payload = null;
				try {
					payload = await response.json();
				} catch {
					/* non-JSON — treated as unknown */
				}
				const result = {
					ok: Boolean(payload?.ok),
					code: payload?.code ?? "UNKNOWN",
					message: typeof payload?.message === "string" ? payload.message : "",
					data: payload?.data ?? null,
					at: now
				};
				if (result.ok) {
					cache.at = now;
					cache.value = result;
				}
				return result;
			} catch (error) {
				return {
					ok: false,
					code: "NETWORK",
					message: error?.name === "AbortError" ? "timeout" : String(error?.message ?? error),
					data: null,
					at: now
				};
			} finally {
				clearTimeout(timer);
			}
		}
		//#endregion
		//#region session usage model
		/**
		 * Built-in fallback price table, CNY per million tokens, matching the
		 * official rates as of 2026-08-14. The live table comes from the host
		 * `/api/dsh-pricing` endpoint (fetched from the official docs page on a
		 * ~6h cycle with ETag revalidation); this constant is used only until the
		 * first successful fetch. `legacy` = flat price before the peak/off-peak
		 * schedule takes effect; `peak`/`offpeak` apply after `effectiveFromUtc`.
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
		/** Live pricing served by the host; replaced after the first fetch. */
		const livePricing = { data: null, fetchedAt: 0, source: "fallback" };
		const PRICING_CACHE_TTL_MS = 12 * 60 * 60 * 1000;
		/** Fetch the host's pricing snapshot (cached 12h; never throws). */
		async function fetchPricing(force) {
			const now = Date.now();
			if (!force && livePricing.data !== null && now - livePricing.fetchedAt < PRICING_CACHE_TTL_MS) return livePricing;
			try {
				const response = await fetch("/api/dsh-pricing", { headers: { Accept: "application/json" } });
				const payload = await response.json();
				if (payload?.ok === true && payload.data !== null && payload.data !== void 0) {
					livePricing.data = payload.data;
					livePricing.fetchedAt = typeof payload.fetchedAt === "number" ? payload.fetchedAt : Date.now();
					livePricing.source = payload.source === "official" ? "official" : "fallback";
				}
			} catch {
				/* keep the previous table */
			}
			return livePricing;
		}
		/** The price table in force (live when available, built-in otherwise). */
		function pricingTable() {
			return livePricing.data ?? BUILTIN_PRICING;
		}
		/** Beijing-time hour/minute from any Date (independent of browser timezone). */
		function beijingTime(now) {
			const parts = new Intl.DateTimeFormat("en-US", {
				timeZone: "Asia/Shanghai",
				hour12: false,
				hour: "2-digit",
				minute: "2-digit"
			}).formatToParts(now);
			const pick = (type) => Number(parts.find((p) => p.type === type)?.value ?? 0);
			return { hour: pick("hour") % 24, minute: pick("minute") };
		}
		/** Peak-window check against the table's windows (default DeepSeek: 09-12, 14-18). */
		function isPeakWindow(now, windows = [[9, 12], [14, 18]]) {
			const { hour, minute } = beijingTime(now);
			const t = hour * 60 + minute;
			return windows.some(([sh, eh]) => t >= sh * 60 && t < eh * 60);
		}
		/** Resolve the price tier in force for a model at a given instant. */
		function pricingOf(modelId, now = new Date()) {
			const table = pricingTable();
			const plan = table.models[modelId] ?? table.models["deepseek-v4-flash"];
			if (now.getTime() < table.effectiveFromUtc) return { ...plan.legacy, tier: "legacy" };
			const peak = isPeakWindow(now, table.peakWindows);
			return { ...(peak ? plan.peak : plan.offpeak), tier: peak ? "peak" : "offpeak" };
		}
		/** Estimate the CNY cost of one session's token totals at the current official rates. */
		function estimateCost(modelId, usage, now = new Date()) {
			if (usage === null || usage === void 0) return null;
			const p = pricingOf(modelId, now);
			const input = (usage.uncachedInputTokens ?? 0) * p.miss + (usage.cacheReadTokens ?? 0) * p.hit + (usage.cacheWriteTokens ?? 0) * p.miss;
			const output = (usage.outputTokens ?? 0) * p.out;
			return (input + output) / 1e6;
		}
		/** Price-tier key for the cost hint (resolved through t()). */
		function priceTierLabel(now = new Date()) {
			const table = pricingTable();
			if (now.getTime() < table.effectiveFromUtc) return "priceOfficial";
			return isPeakWindow(now, table.peakWindows) ? "pricePeak" : "priceOffpeak";
		}
		/** Compact number formatting: 1234 → "1.23k". */
		function formatTokens(value) {
			if (value === void 0 || value === null) return "0";
			if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
			if (value >= 1e3) return `${(value / 1e3).toFixed(1)}k`;
			return String(value);
		}
		/** Money formatting: ¥0.045, ¥123.45. */
		function formatMoney(value, symbol = "¥") {
			if (value === null || value === void 0) return "—";
			const fixed = value >= 100 ? value.toFixed(2) : value >= 1 ? value.toFixed(3) : value.toFixed(4);
			return `${symbol}${fixed.replace(/0+$/, "").replace(/\.$/, "")}`;
		}
		//#endregion
		//#region icons
		function WalletIcon() {
			return (0, react_jsx_runtime.jsx)("svg", {
				className: "db-ico",
				width: "14",
				height: "14",
				viewBox: "0 0 16 16",
				fill: "none",
				"aria-hidden": "true",
				children: (0, react_jsx_runtime.jsx)("path", {
					d: "M2.5 4.5A1.5 1.5 0 0 1 4 3h7.5a1 1 0 0 1 0 2H4a.5.5 0 0 0 0 1h8a1 1 0 0 1 1 1v5.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 12.5v-8Zm8 5.25a.75.75 0 1 0 0 1.5h.01a.75.75 0 0 0 0-1.5H10.5Z",
					fill: "currentColor"
				})
			});
		}
		function RefreshIcon() {
			return (0, react_jsx_runtime.jsx)("svg", {
				className: "db-ico",
				width: "14",
				height: "14",
				viewBox: "0 0 16 16",
				fill: "none",
				"aria-hidden": "true",
				children: (0, react_jsx_runtime.jsx)("path", {
					d: "M8 2a6 6 0 1 0 5.2 3.1.75.75 0 1 0-1.28-.78A4.5 4.5 0 1 1 8 3.5V5.1c0 .45.5.71.86.45L11.5 3.7a.55.55 0 0 0 0-.9L8.86.45A.54.54 0 0 0 8 .9V2Z",
					fill: "currentColor"
				})
			});
		}
		function WarnIcon() {
			return (0, react_jsx_runtime.jsx)("svg", {
				className: "db-ico",
				width: "14",
				height: "14",
				viewBox: "0 0 16 16",
				fill: "none",
				"aria-hidden": "true",
				children: (0, react_jsx_runtime.jsx)("path", {
					d: "M8 1.5a1 1 0 0 1 .87.5l5.9 10.53A1 1 0 0 1 13.9 14H2.1a1 1 0 0 1-.87-1.47L7.13 2A1 1 0 0 1 8 1.5ZM8 5.25a.75.75 0 0 0-.75.75v3a.75.75 0 0 0 1.5 0V6a.75.75 0 0 0-.75-.75ZM8 11.5a.9.9 0 1 0 0-1.8.9.9 0 0 0 0 1.8Z",
					fill: "currentColor"
				})
			});
		}
		function ExtIcon() {
			return (0, react_jsx_runtime.jsx)("svg", {
				className: "db-ico",
				width: "12",
				height: "12",
				viewBox: "0 0 16 16",
				fill: "none",
				"aria-hidden": "true",
				children: (0, react_jsx_runtime.jsx)("path", {
					d: "M5.5 3a.75.75 0 0 0 0 1.5h4.69l-6.1 6.1a.75.75 0 1 0 1.06 1.06l6.1-6.1V10a.75.75 0 0 0 1.5 0V3.75A.75.75 0 0 0 11.75 3H5.5Z",
					fill: "currentColor"
				})
			});
		}
		//#endregion
		//#region widget
		/** Detect the settings modal (the app renders exactly one [role=dialog][aria-modal=true]). */
		function detectSettingsOpen() {
			return typeof document !== "undefined" && document.querySelector('[role="dialog"][aria-modal="true"]') !== null;
		}
		/** Try to open the app's settings modal by clicking its sidebar trigger. */
		function openSettings() {
			const trigger = document.querySelector('button[aria-haspopup="dialog"]');
			if (trigger instanceof HTMLElement) trigger.click();
		}
		/** Format an amount with its currency. */
		function formatAmount(balanceInfo) {
			const symbol = currencySymbol(balanceInfo.currency);
			const amount = String(balanceInfo.total_balance ?? "0");
			return `${symbol}${amount}`;
		}
		/** Parse a numeric balance string. */
		function parseAmount(value) {
			const n = Number.parseFloat(value);
			return Number.isFinite(n) ? n : 0;
		}
		/**
		 * Header-docked balance widget. Registered into the session-scoped
		 * `conversation.session.header.utilities` list slot, so it sits inline in
		 * the conversation header (left of the native Session log button) and
		 * follows the session layout — present while a session is open.
		 *
		 * Props arrive from the framework's session standard kit: `sessionId`
		 * (always set) and `useProjection` (key-addressed session projection
		 * reader — `tokenUsage` is provided by the token-meter plugin and updates
		 * live as the agent streams).
		 */
		function BalanceWidget({ sessionId, useProjection }) {
			const [open, setOpen] = (0, react.useState)(false);
			const [settingsOpen, setSettingsOpen] = (0, react.useState)(detectSettingsOpen);
			const [result, setResult] = (0, react.useState)(cache.value);
			const [loading, setLoading] = (0, react.useState)(false);
			const [updatedAt, setUpdatedAt] = (0, react.useState)(cache.value?.at ?? null);
			const [modelInfo, setModelInfo] = (0, react.useState)(null);
			const [modelError, setModelError] = (0, react.useState)(false);
			const rootRef = (0, react.useRef)(null);
			const openRef = (0, react.useRef)(false);
			openRef.current = open;
			const loadRef = (0, react.useRef)(null);
			loadRef.current = async (force) => {
				setLoading(true);
				const next = await fetchBalance(force);
				setResult(next);
				setUpdatedAt(next.at);
				setLoading(false);
			};
			// Session projection: live per-session token totals (auto-subscribed,
			// re-renders on every token-meter fold — including mid-stream usage chunks).
			const usage = useProjection("tokenUsage");
			// Current model selection for this session (refreshed on open).
			(0, react.useEffect)(() => {
				let cancelled = false;
				setModelError(false);
				setModelInfo(null);
				(async () => {
					try {
						const api = sessionApi;
						if (api === void 0) return;
						const { result: res } = await api.models({ sessionId });
						if (cancelled) return;
						if (res.ok) {
							const { current, groups } = res.value;
							const group = (groups ?? []).find((g) => g.id === current?.provider);
							const model = group?.models.find((m) => m.id === current?.model);
							setModelInfo({
								id: current?.model ?? null,
								display: model?.name ?? current?.model ?? null,
								provider: current?.provider ?? null
							});
						} else {
							console.error("[dsh-plugin-balance] session.models failed:", res.error);
							setModelError(true);
						}
					} catch (error) {
						console.error("[dsh-plugin-balance] session.models threw:", error);
						if (!cancelled) setModelError(true);
					}
				})();
				return () => {
					cancelled = true;
				};
			}, [sessionId, open]);
			// Settings-modal observer: hide the widget while the settings page is up.
			(0, react.useEffect)(() => {
				const check = () => setSettingsOpen(detectSettingsOpen());
				check();
				const observer = new MutationObserver(check);
				observer.observe(document.body, { childList: true, subtree: true });
				return () => observer.disconnect();
			}, []);
			// First load: warm the balance cache so the button can show a number.
			(0, react.useEffect)(() => {
				if (cache.value === null) {
					loadRef.current(false);
				}
				return () => {};
			}, []);
			// Pull the official price table from the host when the panel opens.
			(0, react.useEffect)(() => {
				if (!open) return;
				fetchPricing(false);
			}, [open]);
			// Auto-refresh balance while the panel is open.
			(0, react.useEffect)(() => {
				if (!open) return;
				const timer = setInterval(() => loadRef.current(true), CACHE_TTL_MS);
				return () => clearInterval(timer);
			}, [open]);
			// Escape + outside-click close.
			(0, react.useEffect)(() => {
				if (!open) return;
				const onKeyDown = (event) => {
					if (event.key === "Escape") setOpen(false);
				};
				const onPointerDown = (event) => {
					const root = rootRef.current;
					if (root === null) return;
					if (root.contains(event.target)) return;
					setOpen(false);
				};
				document.addEventListener("keydown", onKeyDown);
				document.addEventListener("pointerdown", onPointerDown);
				return () => {
					document.removeEventListener("keydown", onKeyDown);
					document.removeEventListener("pointerdown", onPointerDown);
				};
			}, [open]);
			const handleRefresh = (0, react.useCallback)(() => {
				loadRef.current(true);
				fetchPricing(true);
			}, []);
			if (settingsOpen) {
				return (0, react_jsx_runtime.jsx)("div", {
					"data-dsh-balance-root": "",
					hidden: true
				});
			}
			// ── button presentation ──
			const info = result?.ok === true && result.data !== null ? result.data : null;
			const infos = Array.isArray(info?.balance_infos) ? info.balance_infos : [];
			const first = infos[0];
			const buttonText = loading && !open ? t("loading") : first !== void 0 ? formatAmount(first) : t("button");
			const anyLow = infos.some((entry) => parseAmount(entry.total_balance) > 0 && parseAmount(entry.total_balance) < 10);
			const anyZero = infos.some((entry) => parseAmount(entry.total_balance) <= 0);
			const tone = result === null ? void 0 : result.ok ? anyZero ? "err" : anyLow ? "warn" : void 0 : "warn";
			// ── session usage presentation ──
			const usageActive = usage !== null && usage !== void 0;
			const cost = usageActive ? estimateCost(modelInfo !== null && modelInfo.id !== null ? modelInfo.id : null, usage) : null;
			const tokenRows = usageActive ? [
				{ key: "tokenInputMiss", value: usage.uncachedInputTokens ?? 0 },
				{ key: "tokenInputHit", value: usage.cacheReadTokens ?? 0 },
				{ key: "tokenCacheWrite", value: usage.cacheWriteTokens ?? 0 },
				{ key: "tokenOutput", value: usage.outputTokens ?? 0 }
			] : [];
			// Cache hit ratio over ALL input tokens (hit / (hit + miss)) — exact arithmetic on reported tokens.
			const inputTotal = usageActive ? (usage.uncachedInputTokens ?? 0) + (usage.cacheReadTokens ?? 0) : 0;
			const hitRate = usageActive && inputTotal > 0 ? (usage.cacheReadTokens ?? 0) / inputTotal : null;
			return (0, react_jsx_runtime.jsxs)("div", {
				"data-dsh-balance-root": "",
				ref: rootRef,
				children: [
					(0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: "db-btn",
						"data-tone": tone,
						"aria-haspopup": "true",
						"aria-expanded": open || void 0,
						title: t("title"),
						onClick: () => setOpen((value) => !value),
						children: (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, {
							children: [
								(0, react_jsx_runtime.jsx)(WalletIcon, {}),
								(0, react_jsx_runtime.jsx)("span", {
									className: "db-label",
									children: buttonText
								}),
								tone !== void 0 && (0, react_jsx_runtime.jsx)("span", { className: "db-dot" })
							]
						})
					}),
					open && (0, react_jsx_runtime.jsx)("div", {
						className: "db-panel",
						role: "dialog",
						"aria-label": t("title"),
						children: (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, {
							children: [
								(0, react_jsx_runtime.jsxs)("div", {
									className: "db-panel-head",
									children: [
										(0, react_jsx_runtime.jsx)("div", {
											className: "db-panel-title",
											children: t("title")
										}),
										(0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: "db-refresh",
											title: t("refresh"),
											"aria-label": t("refresh"),
											disabled: loading,
											onClick: handleRefresh,
											children: (0, react_jsx_runtime.jsx)("span", {
												className: loading ? "db-spin" : void 0,
												children: (0, react_jsx_runtime.jsx)(RefreshIcon, {})
											})
										})
									]
								}),
								(0, react_jsx_runtime.jsx)("div", {
									className: "db-body",
									children: loading && result === null ? (0, react_jsx_runtime.jsx)("div", {
										className: "db-empty",
										children: t("loading")
									}) : result === null ? (0, react_jsx_runtime.jsx)("div", {
										className: "db-empty",
										children: t("loading")
									}) : !result.ok ? (0, react_jsx_runtime.jsxs)("div", {
										className: "db-errbox",
										children: [
											(0, react_jsx_runtime.jsx)(WarnIcon, {}),
											(0, react_jsx_runtime.jsx)("div", {
												className: "db-msg",
												children: (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, {
													children: [
														(0, react_jsx_runtime.jsx)("b", {
															children: result.code === "NO_API_KEY" ? t("noKeyTitle") : result.code === "HTTP_401" ? t("unauthorized") : result.code === "NETWORK" ? t("network") : t("upstream")
														}),
														(0, react_jsx_runtime.jsx)("span", {
															children: result.code === "NO_API_KEY" ? t("noKeyBody") : result.code === "HTTP_401" ? t("unauthorized") : result.code === "NETWORK" ? t("network") : result.message || t("unknown")
														})
													]
												})
											})
										]
									}) : (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, {
										children: [
											// ── current-session usage (live) ──
											(0, react_jsx_runtime.jsxs)("div", {
												className: "db-section",
												children: [
													(0, react_jsx_runtime.jsx)("div", {
														className: "db-section-label",
														children: t("sessionSection")
													}),
													!usageActive ? (0, react_jsx_runtime.jsx)("div", {
														className: "db-empty",
														children: t("noUsage")
													}) : (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, {
														children: [
															(0, react_jsx_runtime.jsxs)("div", {
																className: "db-sess-row",
																children: [
																	(0, react_jsx_runtime.jsx)("span", { children: t("model") }),
																	(0, react_jsx_runtime.jsx)("span", {
																		className: "db-sess-val db-sess-model",
																		children: modelInfo !== null && modelInfo.display !== null ? modelInfo.display : modelError ? t("unknownModel") : t("loading")
																	})
																]
															}),
															(0, react_jsx_runtime.jsx)("div", {
																className: "db-rows",
																children: tokenRows.map((row) => (0, react_jsx_runtime.jsxs)("div", {
																	className: "db-row",
																	children: [
																		(0, react_jsx_runtime.jsx)("dt", { children: t(row.key) }),
																		(0, react_jsx_runtime.jsx)("dd", { children: formatTokens(row.value) })
																	]
																}, row.key))
															}),
															hitRate !== null && (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, {
																children: [
																	(0, react_jsx_runtime.jsxs)("div", {
																		className: "db-hitrate",
																		children: [
																			(0, react_jsx_runtime.jsx)("span", { children: t("cacheHitRate") }),
																			(0, react_jsx_runtime.jsx)("span", {
																				className: "db-hitrate-pct",
																				children: `${(hitRate * 100).toFixed(1)}%`
																			})
																		]
																	}),
																	(0, react_jsx_runtime.jsx)("div", {
																		className: "db-hitbar",
																		"aria-hidden": "true",
																		children: (0, react_jsx_runtime.jsx)("span", {
																			style: { width: `${Math.round(hitRate * 100)}%` }
																		})
																	})
																]
															}),
															(0, react_jsx_runtime.jsxs)("div", {
																className: "db-sess-cost",
																children: [
																	(0, react_jsx_runtime.jsx)("span", {
																		className: "db-cost-amount",
																		children: formatMoney(cost)
																	}),
																	(0, react_jsx_runtime.jsx)("span", {
																		className: "db-cost-hint",
																		children: modelInfo !== null && modelInfo.id !== null ? `${t(priceTierLabel())} · ${modelInfo.id}` : t(priceTierLabel())
																	})
																]
															})
														]
													})
												]
											}),
											// ── account balance ──
											(0, react_jsx_runtime.jsxs)("div", {
												className: "db-section",
												children: [
													(0, react_jsx_runtime.jsx)("div", {
														className: "db-statusline",
														children: (0, react_jsx_runtime.jsxs)("span", {
															className: "db-avail",
															"data-v": info?.is_available !== false,
															children: [
																(0, react_jsx_runtime.jsx)("span", { className: "db-dot" }),
																info?.is_available === false ? t("unavailable") : t("available")
															]
														})
													}),
													infos.length === 0 ? (0, react_jsx_runtime.jsx)("div", {
														className: "db-empty",
														children: t("noData")
													}) : (0, react_jsx_runtime.jsx)("div", {
														className: "db-currencies",
														children: infos.map((entry) => {
															const total = parseAmount(entry.total_balance);
															return (0, react_jsx_runtime.jsxs)("div", {
																className: "db-currency",
																children: [
																	(0, react_jsx_runtime.jsxs)("div", {
																		className: "db-currency-head",
																		children: [
																			(0, react_jsx_runtime.jsx)("span", {
																				className: "db-currency-code",
																				children: entry.currency
																			}),
																			(0, react_jsx_runtime.jsx)("span", {
																				className: "db-currency-total",
																				"data-low": total > 0 && total < 10 || void 0,
																				"data-zero": total <= 0 || void 0,
																				children: formatAmount(entry)
																			})
																		]
																	}),
																	(0, react_jsx_runtime.jsx)("dl", {
																		className: "db-rows",
																		children: (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, {
																			children: [
																				(0, react_jsx_runtime.jsxs)("div", {
																					className: "db-row",
																					children: [
																						(0, react_jsx_runtime.jsx)("dt", { children: t("toppedUp") }),
																						(0, react_jsx_runtime.jsx)("dd", {
																							children: `${currencySymbol(entry.currency)}${entry.topped_up_balance ?? "0"}`
																						})
																					]
																				}),
																				(0, react_jsx_runtime.jsxs)("div", {
																					className: "db-row",
																					children: [
																						(0, react_jsx_runtime.jsx)("dt", { children: t("granted") }),
																						(0, react_jsx_runtime.jsx)("dd", {
																							children: `${currencySymbol(entry.currency)}${entry.granted_balance ?? "0"}`
																						})
																					]
																				})
																			]
																		})
																	})
																]
															}, entry.currency);
														})
													}),
													(anyLow || anyZero) && (0, react_jsx_runtime.jsx)("p", {
														className: "db-hint",
														children: anyZero ? t("zero") : t("low")
													})
												]
											})
										]
									})
								}),
								(0, react_jsx_runtime.jsxs)("div", {
									className: "db-foot",
									children: [
										(0, react_jsx_runtime.jsx)("span", {
											className: "db-updated",
											children: updatedAt !== null ? `${t("updated")} ${new Date(updatedAt).toLocaleTimeString(currentLang() === "zh" ? "zh-CN" : void 0, { hour: "2-digit", minute: "2-digit" })}` : ""
										}),
										(0, react_jsx_runtime.jsx)("a", {
											className: "db-link",
											href: "https://platform.deepseek.com/usage",
											target: "_blank",
											rel: "noreferrer",
											children: (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, {
												children: [
													t("platform"),
													(0, react_jsx_runtime.jsx)(ExtIcon, {})
												]
											})
										})
									]
								}),
								!result.ok && result.code === "NO_API_KEY" && (0, react_jsx_runtime.jsx)("div", {
									className: "db-foot",
									children: (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: "db-link",
										onClick: openSettings,
										children: (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, {
											children: [
												(0, react_jsx_runtime.jsx)(WalletIcon, {}),
												t("openSettings")
											]
										})
									})
								})
							]
						})
					})
				]
			});
		}
		//#endregion
		//#region plugin
		/** Required services: the slot registry and the connection wire (session.models RPC). */
		const inject = ["slots", "connection"];
		/** The session wire face (api.sessions), captured once from the connection service. */
		let sessionApi = null;
		/**
		 * Client plugin body: mount the balance widget into the session header
		 * utilities seat (left of the native Session log button). The slot is
		 * declared by ui-conversation, so we wait for the declaration via
		 * slots.inject before registering.
		 */
		function apply(ctx) {
			sessionApi = ctx.get("connection").api.sessions;
			ctx.effect(() => ctx.slots.inject("conversation.session.header.utilities", () => ctx.slots.register({
				name: "conversation.session.header.utilities",
				id: "dsh-balance",
				order: -10
			}, BalanceWidget)), "dsh-plugin-balance: header utilities widget");
		}
		//#endregion
		exports.inject = inject;
		exports.apply = apply;
		return module.exports;
	}
});
