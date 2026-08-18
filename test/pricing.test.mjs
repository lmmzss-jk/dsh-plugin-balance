// @ts-check
/**
 * Regression tests for the pricing/cost math used by lib/client.js.
 *
 * The client bundle is a self-contained `window.__ModuleLoader__` module and
 * cannot import local files, so the pricing logic lives inline in client.js.
 * This file mirrors that logic (marked `CLIENT-MIRROR`) so CI can pin the
 * behavior: if client.js is ever changed, update the mirror here too.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

// CLIENT-MIRROR: BUILTIN_PRICING from lib/client.js
const BUILTIN_PRICING = {
	models: {
		'deepseek-v4-flash': {
			legacy: { hit: 0.02, miss: 1, out: 2 },
			peak: { hit: 0.1, miss: 3, out: 9 },
			offpeak: { hit: 0.05, miss: 1.5, out: 4.5 }
		},
		'deepseek-v4-pro': {
			legacy: { hit: 0.025, miss: 3, out: 6 },
			peak: { hit: 0.3, miss: 9, out: 27 },
			offpeak: { hit: 0.15, miss: 4.5, out: 13.5 }
		}
	},
	effectiveFromUtc: Date.UTC(2026, 7, 16, 16, 0, 0),
	peakWindows: [[9, 12], [14, 18]]
};

// CLIENT-MIRROR: beijingTime / isPeakWindow / pricingOf / estimateCost from lib/client.js
function beijingTime(now) {
	const parts = new Intl.DateTimeFormat('en-US', {
		timeZone: 'Asia/Shanghai',
		hour12: false,
		hour: '2-digit',
		minute: '2-digit'
	}).formatToParts(now);
	const pick = (type) => Number(parts.find((p) => p.type === type)?.value ?? 0);
	return { hour: pick('hour') % 24, minute: pick('minute') };
}

function isPeakWindow(now, windows = [[9, 12], [14, 18]]) {
	const { hour, minute } = beijingTime(now);
	const t = hour * 60 + minute;
	return windows.some(([sh, eh]) => t >= sh * 60 && t < eh * 60);
}

function pricingOf(modelId, now = new Date()) {
	const table = BUILTIN_PRICING;
	const plan = table.models[modelId] ?? table.models['deepseek-v4-flash'];
	if (now.getTime() < table.effectiveFromUtc) return { ...plan.legacy, tier: 'legacy' };
	const peak = isPeakWindow(now, table.peakWindows);
	return { ...(peak ? plan.peak : plan.offpeak), tier: peak ? 'peak' : 'offpeak' };
}

function estimateCost(modelId, usage, now = new Date()) {
	if (usage === null || usage === undefined) return null;
	const p = pricingOf(modelId, now);
	const input = (usage.uncachedInputTokens ?? 0) * p.miss + (usage.cacheReadTokens ?? 0) * p.hit + (usage.cacheWriteTokens ?? 0) * p.miss;
	const output = (usage.outputTokens ?? 0) * p.out;
	return (input + output) / 1e6;
}

// CLIENT-MIRROR: formatTokens / formatMoney from lib/client.js
function formatTokens(value) {
	if (value === undefined || value === null) return '0';
	if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
	if (value >= 1e3) return `${(value / 1e3).toFixed(1)}k`;
	return String(value);
}

function formatMoney(value, symbol = '¥') {
	if (value === null || value === undefined) return '—';
	const fixed = value >= 100 ? value.toFixed(2) : value >= 1 ? value.toFixed(3) : value.toFixed(4);
	return `${symbol}${fixed.replace(/0+$/, '').replace(/\.$/, '')}`;
}

// The user-verified example: 133.1k miss + 22.52M hit + 116.2k out ≈ ¥0.82 at legacy rates.
const USER_EXAMPLE = { uncachedInputTokens: 133100, cacheReadTokens: 22520000, cacheWriteTokens: 0, outputTokens: 116200 };

test('legacy pricing applies before the peak/off-peak epoch', () => {
	const before = new Date(Date.UTC(2026, 7, 14, 8, 0, 0));
	assert.deepEqual(pricingOf('deepseek-v4-flash', before), { hit: 0.02, miss: 1, out: 2, tier: 'legacy' });
});

test('peak/off-peak pricing applies after the epoch', () => {
	const offpeak = new Date(Date.UTC(2026, 7, 18, 5, 0, 0)); // 13:00 CST off-peak
	const peak = new Date(Date.UTC(2026, 7, 18, 1, 30, 0)); // 09:30 CST peak
	assert.equal(pricingOf('deepseek-v4-flash', offpeak).tier, 'offpeak');
	assert.equal(pricingOf('deepseek-v4-flash', peak).tier, 'peak');
	assert.equal(pricingOf('deepseek-v4-flash', peak).miss, 3);
});

test('beijing peak windows are 09:00-12:00 and 14:00-18:00', () => {
	// Beijing times
	const cases = [
		[8, 59, false],
		[9, 0, true],
		[11, 59, true],
		[12, 0, false],
		[13, 59, false],
		[14, 0, true],
		[17, 59, true],
		[18, 0, false]
	];
	for (const [h, m, expected] of cases) {
		// Convert Beijing time to a UTC instant (China = UTC+8, no DST)
		const now = new Date(Date.UTC(2026, 7, 18, h - 8, m));
		assert.equal(isPeakWindow(now), expected, `Beijing ${h}:${String(m).padStart(2, '0')}`);
	}
});

test('estimateCost matches the user-verified example (~¥0.82 at legacy rates)', () => {
	const before = new Date(Date.UTC(2026, 7, 14, 8, 0, 0));
	const cost = estimateCost('deepseek-v4-flash', USER_EXAMPLE, before);
	assert.ok(Math.abs(cost - 0.816) < 0.01, `got ${cost}`);
});

test('estimateCost with hit-heavy usage is dominated by the cheap cache-hit rate', () => {
	const before = new Date(Date.UTC(2026, 7, 14, 8, 0, 0));
	const hitHeavy = { uncachedInputTokens: 1000, cacheReadTokens: 10000000, cacheWriteTokens: 0, outputTokens: 5000 };
	const cost = estimateCost('deepseek-v4-flash', hitHeavy, before);
	// 10M hits × ¥0.02/M = ¥0.2; 1k miss × ¥1/M ≈ ¥0.001; 5k out × ¥2/M = ¥0.01
	assert.ok(cost > 0.2 && cost < 0.25, `got ${cost}`);
});

test('estimateCost returns null for missing usage', () => {
	assert.equal(estimateCost('deepseek-v4-flash', null), null);
	assert.equal(estimateCost('deepseek-v4-flash', undefined), null);
});

test('unknown models fall back to the flash (chat-class) pricing', () => {
	const before = new Date(Date.UTC(2026, 7, 14, 8, 0, 0));
	assert.deepEqual(pricingOf('some-future-model', before), { hit: 0.02, miss: 1, out: 2, tier: 'legacy' });
});

test('formatTokens handles k / M / plain', () => {
	assert.equal(formatTokens(84), '84');
	assert.equal(formatTokens(8800), '8.8k');
	assert.equal(formatTokens(22520000), '22.52M');
	assert.equal(formatTokens(0), '0');
});

test('formatMoney trims trailing zeros but keeps small precision', () => {
	assert.equal(formatMoney(0.00224), '¥0.0022');
	assert.equal(formatMoney(123.45), '¥123.45');
	assert.equal(formatMoney(null), '—');
});
