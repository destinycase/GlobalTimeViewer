import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, expect, test } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "snapshot-format.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function createService(deps = {}) {
    const globalPatches = {
        window: globalThis,
        console
    };
    const keys = ["window", "console", "GTVSnapshotFormat", ...Object.keys(globalPatches)];
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

    return (globalThis.window?.GTVSnapshotFormat || globalThis.GTVSnapshotFormat).createService(deps);
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

function createDepsStub() {
    return {
        DEFAULT_COPY_TIME_PARTS_ENABLED: { dn: true, date: true, time: true, weekday: true },
        I18N_DATA: {
            en: { days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }
        },
        getCurrentLang: () => "en",
        getUTCRef: () => ({ id: "utc", type: "standard", zone: "UTC", name_en: "UTC" }),
        getBaseTimezoneRef: () => ({ id: "base", type: "standard", zone: "Asia/Seoul", name_en: "Seoul" }),
        getCurrentGroupZones: () => [{ id: "team", type: "standard", zone: "Asia/Tokyo", name_en: "Tokyo" }],
        pad: (value) => String(Math.max(0, Math.trunc(Number(value) || 0))).padStart(2, "0"),
        getCustomOffsetMinutes: () => 540,
        getFixedOffsetForDisplay: () => null,
        normalizeCustomAbbr: (abbr) => String(abbr || "").trim().toUpperCase(),
        getZoneAbbreviation: () => "KST",
        getZoneDisplayName: (tz) => tz.name_en || tz.zone || "",
        getGlobalTimes: () => [new Date("2026-01-01T00:00:00Z"), new Date("2026-01-02T00:00:00Z")],
        isRealtime: () => false,
        getSlotCount: () => 2,
        sanitizeTimePartsEnabled: (_value, _scope) => ({ dn: true, date: true, time: true, weekday: false }),
        sanitizeCopyFormatOrder: (order) => Array.isArray(order) ? order : [],
        getSignedInclusiveDaySpan: () => 2,
        getSignedDurationDayHourMinute: () => "1d 0h 0m",
        t: (key) => key === "unit_days_suffix" ? "d" : key,
        timeService: {
            resolveLocalDateParts(date, zone, timezoneId, fixedOffsetMinutes) {
                let offset = 0;
                if (typeof fixedOffsetMinutes === "number") {
                    offset = fixedOffsetMinutes;
                } else if (zone === "Asia/Seoul") {
                    offset = 540;
                }
                const d = new Date(date.getTime() + (offset * 60000));
                return {
                    Y: d.getUTCFullYear(),
                    M: d.getUTCMonth() + 1,
                    D: d.getUTCDate(),
                    H: d.getUTCHours(),
                    min: d.getUTCMinutes(),
                    S: d.getUTCSeconds()
                };
            },
            toDateTime(date) {
                const d = new Date(date.getTime() + (9 * 60 * 60000));
                const jsWeekday = d.getUTCDay();
                return {
                    offset: 540,
                    weekday: jsWeekday === 0 ? 7 : jsWeekday
                };
            }
        }
    };
}

test("buildTimezoneComputedSnapshotForDates creates timezone snapshot safely", () => {
    const service = createService(createDepsStub());
    const tz = { id: "base", type: "standard", zone: "Asia/Seoul", name_en: "Seoul" };
    const snapshot = service.buildTimezoneComputedSnapshotForDates(tz, [new Date("2026-01-01T00:00:00Z"), new Date("2026-01-02T00:00:00Z")]);

    expect(snapshot).toBeTruthy();
    expect(snapshot.timezone).toBe("KST");
    expect(snapshot.offset).toBe("UTC+09:00");
    expect(snapshot.region).toBe("Seoul");
    expect(snapshot.times.length).toBe(2);
    expect(snapshot.periodDays).toBe("2d");
});

test("formatSnapshotText wraps timezone/offset and respects order", () => {
    const service = createService(createDepsStub());
    const snapshot = {
        timezone: "KST",
        region: "Seoul",
        offset: "UTC+09:00",
        dates: ["2026-01-01"],
        clocks: ["09:00:00"],
        dayNames: ["Thu"],
        dayNightIcons: ["DAY"],
        periodDays: "2d",
        periodTime: "1d 0h 0m"
    };
    const text = service.formatSnapshotText(
        snapshot,
        ["timezone", "region", "offset", "time", "period_days"],
        { timezone: true, region: true, offset: true, time: true, period_days: true },
        { dn: false, date: true, time: true, weekday: false }
    );

    expect(text.includes("[KST]")).toBe(true);
    expect(text.includes("Seoul")).toBe(true);
    expect(text.includes("[UTC+09:00]")).toBe(true);
    expect(text.includes("[2d]")).toBe(true);
});

test("getRowFormattedText returns empty text with missing dependencies", () => {
    const service = createService({});
    const text = service.getRowFormattedText("utc", ["timezone"], { timezone: true });
    expect(text).toBe("");
});

test("buildTimezoneComputedSnapshotForDates correctly applies custom timezone offset", () => {
    const service = createService(createDepsStub());
    const customTz = { id: "custom1", type: "custom", abbr: "MYTZ" };
    
    const snapshot = service.buildTimezoneComputedSnapshotForDates(customTz, [new Date("2026-01-01T00:00:00Z")]);

    expect(snapshot).toBeTruthy();
    expect(snapshot.timezone).toBe("MYTZ");
    expect(snapshot.offset).toBe("UTC+09:00");
    expect(snapshot.times[0]).toBe("2026-01-01 09:00:00");
});
