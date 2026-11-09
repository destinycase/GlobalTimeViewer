import path from "node:path";
import { createRequire } from "node:module";

import { DateTime } from "luxon";
import { afterEach, expect, test } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "src", "js", "modules", "time-service.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function createService(deps = {}) {
    const globalPatches = {
        window: globalThis,
        console
    };
    const keys = ["window", "console", "GTVTimeService", ...Object.keys(globalPatches)];
    const previous = new Map();
    keys.forEach((key) => {
        previous.set(key, {
            exists: Object.prototype.hasOwnProperty.call(globalThis, key),
            value: globalThis[key]
        });
    });

    Object.entries(globalPatches).forEach(([key, value]) => {
        globalThis[key] = value;
    });

    delete require.cache[MODULE_ID];
    require(MODULE_PATH);
    moduleCleanupStack.push(() => {
        delete require.cache[MODULE_ID];
        keys.forEach((key) => {
            const entry = previous.get(key);
            if (!entry || !entry.exists) {
                delete globalThis[key];
                return;
            }
            globalThis[key] = entry.value;
        });
    });

    return (globalThis.window?.GTVTimeService || globalThis.GTVTimeService).createService(deps);
}

afterEach(() => {
    while (moduleCleanupStack.length) {
        const cleanup = moduleCleanupStack.pop();
        try {
            cleanup();
        } catch {
            // Ignore cleanup failures in tests.
        }
    }
});

test("formatDuration renders Korean label correctly", () => {
    const service = createService({ luxon: { DateTime } });
    const startMs = Date.parse("2026-01-01T00:00:00Z");
    const endMs = Date.parse("2026-01-02T02:03:00Z");
    expect(service.formatDuration(startMs, endMs, "ko")).toBe("1일 2시간 3분");
});

test("formatDuration truncates negative spans the same way as positive spans", () => {
    const service = createService({ luxon: { DateTime } });
    const laterMs = Date.parse("2026-01-01T10:00:30Z");
    const earlierMs = Date.parse("2026-01-01T10:00:00Z");
    expect(service.formatDuration(earlierMs, laterMs, "en")).toBe("0d 0h 0m");
    expect(service.formatDuration(laterMs, earlierMs, "en")).toBe("-0d 0h 0m");
    expect(service.formatDuration(
        Date.parse("2026-01-02T02:03:40Z"),
        Date.parse("2026-01-01T00:00:00Z"),
        "en"
    )).toBe("-1d 2h 3m");
});

test("unsupported zones fall back to UTC instead of invalid dates", () => {
    const service = createService({ luxon: { DateTime } });
    const instant = new Date("2026-03-03T12:34:56Z");

    const parts = service.resolveLocalDateParts(instant, "Not/AZone");
    expect(parts).toEqual({ Y: 2026, M: 3, D: 3, H: 12, min: 34, S: 56 });

    const adjusted = service.adjustDate(instant, "sharp_hour", "Not/AZone");
    expect(adjusted.toISOString()).toBe("2026-03-03T12:00:00.000Z");

    const utc = service.fromLocalPartsToUtc(
        { year: 2026, month: 3, day: 3, hour: 1, minute: 2, second: 3 },
        "Not/AZone"
    );
    expect(utc.toISOString()).toBe("2026-03-03T01:02:03.000Z");
});

test("getDaySpan returns null on invalid inputs", () => {
    const service = createService({ luxon: { DateTime } });
    expect(service.getDaySpan(null, "2026-01-01")).toBe(null);
    expect(service.getDaySpan("2026-01-01", undefined)).toBe(null);
    expect(service.getDaySpan("bad-value", "2026-01-01")).toBe(null);
});

test("fallback mode without luxon still shifts and converts custom offset times", () => {
    const service = createService({});
    const baseDate = new Date("2026-01-01T00:00:00Z");
    const shifted = service.shiftDate(baseDate, { days: 1 }, "CUSTOM", 540);
    expect(shifted.toISOString()).toBe("2026-01-02T00:00:00.000Z");

    const utcDate = service.fromLocalPartsToUtc(
        { year: 2026, month: 1, day: 1, hour: 9, minute: 0, second: 0 },
        "CUSTOM",
        540
    );
    expect(utcDate.toISOString()).toBe("2026-01-01T00:00:00.000Z");
});

test("adjustDate now action returns current Date object", () => {
    const service = createService({});
    const result = service.adjustDate(new Date("2026-01-01T00:00:00Z"), "now");
    expect(result instanceof Date).toBe(true);
    expect(Number.isFinite(result.getTime())).toBe(true);
});

const ADJUST_EXPECTATIONS = [
    ["midnight", "2026-03-10T00:00:00.000Z"],
    ["sharp_hour", "2026-03-10T13:00:00.000Z"],
    ["plus_hour", "2026-03-10T14:25:30.000Z"],
    ["minus_hour", "2026-03-10T12:25:30.000Z"],
    ["plus_day", "2026-03-11T13:25:30.000Z"],
    ["minus_day", "2026-03-09T13:25:30.000Z"],
    ["plus_week", "2026-03-17T13:25:30.000Z"],
    ["minus_week", "2026-03-03T13:25:30.000Z"],
    ["plus_four_weeks", "2026-04-07T13:25:30.000Z"],
    ["minus_four_weeks", "2026-02-10T13:25:30.000Z"],
    ["plus_custom_days", "2026-03-13T13:25:30.000Z"],
    ["minus_custom_days", "2026-03-07T13:25:30.000Z"]
];

for (const [label, deps] of [["luxon", () => ({ luxon: { DateTime } })], ["fallback", () => ({})]]) {
    test(`adjustDate applies every action in UTC (${label})`, () => {
        const service = createService(deps());
        const base = new Date("2026-03-10T13:25:30.000Z");
        for (const [action, expected] of ADJUST_EXPECTATIONS) {
            expect(service.adjustDate(base, action, "UTC", null, 3).toISOString(), action).toBe(expected);
        }
        expect(service.adjustDate(base, "unknown-action", "UTC").toISOString()).toBe(base.toISOString());
    });

    test(`adjustDate keeps custom-offset wall clock semantics (${label})`, () => {
        const service = createService(deps());
        // 2026-03-10T22:25:30Z is 2026-03-11 07:25:30 at UTC+09:00.
        const base = new Date("2026-03-10T22:25:30.000Z");
        expect(service.adjustDate(base, "midnight", "CUSTOM", 540).toISOString()).toBe("2026-03-10T15:00:00.000Z");
        expect(service.adjustDate(base, "sharp_hour", "CUSTOM", 540).toISOString()).toBe("2026-03-10T22:00:00.000Z");
        expect(service.adjustDate(base, "plus_day", "CUSTOM", 540).toISOString()).toBe("2026-03-11T22:25:30.000Z");
        expect(service.adjustDate(base, "minus_custom_days", "CUSTOM", 540, -2).toISOString()).toBe("2026-03-08T22:25:30.000Z");
    });

    test(`shiftDate moves by hours, days and weeks (${label})`, () => {
        const service = createService(deps());
        const base = new Date("2026-03-10T13:00:00.000Z");
        expect(service.shiftDate(base, { hours: 5 }).toISOString()).toBe("2026-03-10T18:00:00.000Z");
        expect(service.shiftDate(base, { days: -1, weeks: 1 }).toISOString()).toBe("2026-03-16T13:00:00.000Z");
        expect(service.shiftDate(base, { days: 1 }, "CUSTOM", -300).toISOString()).toBe("2026-03-11T13:00:00.000Z");
        expect(service.shiftDate(base, {}).toISOString()).toBe(base.toISOString());
    });

    test(`resolveLocalDateParts and fromLocalPartsToUtc round-trip fixed offsets (${label})`, () => {
        const service = createService(deps());
        const instant = new Date("2026-12-31T20:30:15.000Z");
        expect(service.resolveLocalDateParts(instant, "CUSTOM", null, 330)).toEqual({ Y: 2027, M: 1, D: 1, H: 2, min: 0, S: 15 });
        expect(service.resolveLocalDateParts(instant, "UTC")).toEqual({ Y: 2026, M: 12, D: 31, H: 20, min: 30, S: 15 });
        const parts = { year: 2027, month: 1, day: 1, hour: 2, minute: 0, second: 15 };
        expect(service.fromLocalPartsToUtc(parts, "CUSTOM", 330).toISOString()).toBe(instant.toISOString());
        expect(service.fromLocalPartsToUtc({ year: 2026, month: 12, day: 31, hour: 20, minute: 30, second: 15 }, "UTC").toISOString())
            .toBe(instant.toISOString());
    });

    test(`getDaySpan counts inclusive days in both directions (${label})`, () => {
        const service = createService(deps());
        expect(service.getDaySpan("2026-03-01", "2026-03-01")).toBe(1);
        expect(service.getDaySpan("2026-03-01 10:00:00", "2026-03-10")).toBe(10);
        expect(service.getDaySpan("2026-03-10", "2026-03-01")).toBe(-10);
        expect(service.getDaySpan("2026-02-30x", "2026-03-01")).toBe(null);
    });

    test(`formatDuration formats spans and rejects non-numbers (${label})`, () => {
        const service = createService(deps());
        const start = Date.parse("2026-03-01T00:00:00Z");
        expect(service.formatDuration(start, start + (26 * 3600000) + (5 * 60000), "en")).toBe("1d 2h 5m");
        expect(service.formatDuration(start + (90 * 60000), start, "ko")).toBe("-0일 1시간 30분");
        expect(service.formatDuration("x", start)).toBe("");
    });
}

test("formatDuration is real elapsed time with 24-hour days, whatever the viewer's zone", () => {
    const service = createService({ luxon: { DateTime } });
    // 2 minutes across the New York DST end (05:59Z -> 06:01Z on 2026-11-01).
    expect(service.formatDuration(Date.UTC(2026, 10, 1, 5, 59), Date.UTC(2026, 10, 1, 6, 1), "en")).toBe("0d 0h 2m");
    // 25 real hours stay 1 day 1 hour (no calendar-day shortcut in any local zone).
    expect(service.formatDuration(Date.UTC(2026, 10, 1, 4, 0), Date.UTC(2026, 10, 2, 5, 0), "en")).toBe("1d 1h 0m");
    expect(service.formatDuration(Date.UTC(2026, 10, 1, 6, 1), Date.UTC(2026, 10, 1, 5, 59), "ko")).toBe("-0일 0시간 2분");
    expect(service.formatDuration("x", 0, "en")).toBe("");
});
