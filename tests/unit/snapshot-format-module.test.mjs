import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, expect, test } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "src", "js", "modules", "snapshot-format.js");
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

test("buildTimezoneComputedSnapshotForDates honors injected day/night marker resolver", () => {
    const service = createService({
        ...createDepsStub(),
        getDayNightMarkerByHour: () => "NIGHT"
    });
    const tz = { id: "base", type: "standard", zone: "Asia/Seoul", name_en: "Seoul" };

    const snapshot = service.buildTimezoneComputedSnapshotForDates(tz, [new Date("2026-01-01T00:00:00Z")]);

    expect(snapshot.dayNightIcons[0]).toBe("NIGHT");
});

test("getTimezoneRefById resolves utc, base and group zones", () => {
    const service = createService(createDepsStub());
    expect(service.getTimezoneRefById("")).toBe(null);
    expect(service.getTimezoneRefById("utc").zone).toBe("UTC");
    expect(service.getTimezoneRefById("base").zone).toBe("Asia/Seoul");
    expect(service.getTimezoneRefById("team").zone).toBe("Asia/Tokyo");
    expect(service.getTimezoneRefById("missing")).toBe(null);

    const noZones = createService({ ...createDepsStub(), getCurrentGroupZones: () => "bad", getUTCRef: () => undefined });
    expect(noZones.getTimezoneRefById("team")).toBe(null);
    expect(noZones.getTimezoneRefById("utc")).toBe(null);
});

test("buildTimezoneComputedSnapshot uses one slot in realtime and the slot count otherwise", () => {
    const fixed = createService(createDepsStub()).buildTimezoneComputedSnapshot("base");
    expect(fixed.times).toEqual(["2026-01-01 09:00:00", "2026-01-02 09:00:00"]);
    expect(fixed.offset).toBe("UTC+09:00");
    expect(fixed.periodDays).toBe("2d");
    expect(fixed.periodTime).toBe("1d 0h 0m");
    expect(fixed.dayNames).toEqual(["Thu", "Fri"]);

    const realtime = createService({ ...createDepsStub(), isRealtime: () => true }).buildTimezoneComputedSnapshot("base");
    expect(realtime.times).toHaveLength(1);
    expect(realtime.periodDays).toBe("");

    const fillsMissingSlot = createService({
        ...createDepsStub(),
        getGlobalTimes: () => [new Date("2026-03-01T00:00:00Z"), "not a date"],
        getSlotCount: () => "x"
    }).buildTimezoneComputedSnapshot("utc");
    expect(fillsMissingSlot.times).toEqual(["2026-03-01 00:00:00"]);
    expect(createService(createDepsStub()).buildTimezoneComputedSnapshot("nope")).toBe(null);
});

test("snapshot offsets honor fixed display offsets, negative offsets and missing parts", () => {
    const deps = createDepsStub();
    const service = createService(deps);
    const tz = { id: "ny", type: "standard", zone: "America/New_York", name_en: "New York" };
    const snapshot = service.buildTimezoneComputedSnapshotForDates(tz, [new Date("2026-01-01T12:00:00Z")], {
        fixedDisplayOffsetMinutes: -330
    });
    expect(snapshot.offset).toBe("UTC-05:30");
    expect(snapshot.clocks).toEqual(["06:30:00"]);
    expect(snapshot.dayNightIcons).toEqual(["DAY"]);

    const noParts = createService({
        ...deps,
        timeService: { resolveLocalDateParts: () => null, toDateTime: () => ({ offset: "bad" }) }
    }).buildTimezoneComputedSnapshotForDates(tz, ["bad date"]);
    expect(noParts.offset).toBe("UTC+00:00");
    expect(noParts.times).toEqual([]);
    expect(service.buildTimezoneComputedSnapshotForDates(null)).toBe(null);
});

test("day/night falls back to hour ranges and weekday handles defaults", () => {
    const service = createService({
        ...createDepsStub(),
        getDayNightMarkerByHour: (hour) => (hour === 3 ? "moon" : "?"),
        getCurrentLang: () => "  ",
        timeService: {
            resolveLocalDateParts: (date) => ({ H: date.getUTCHours(), Y: 2024, M: 2, D: 29 }),
            toDateTime: () => ({ offset: 0 })
        }
    });
    const tz = { id: "utc", type: "standard", zone: "UTC" };
    const snapshot = service.buildTimezoneComputedSnapshotForDates(tz, [
        new Date("2024-02-29T03:00:00Z"),
        new Date("2024-02-29T07:00:00Z"),
        new Date("2024-02-29T20:00:00Z")
    ]);
    expect(snapshot.dayNightIcons).toEqual(["NIGHT", "DAY", "NIGHT"]);
    expect(snapshot.clocks).toEqual(["03:00:00", "07:00:00", "20:00:00"]);
    expect(snapshot.dayNames[0]).toBe("Thu");
});

test("copy field text wraps, trims and skips empty or placeholder values", () => {
    const service = createService(createDepsStub());
    const snapshot = {
        timezone: " KST ",
        region: " Seoul ",
        offset: "[UTC+09:00]",
        dates: ["2026-01-01"],
        clocks: ["09:00:00"],
        dayNames: ["Thu"],
        dayNightIcons: ["DAY"],
        periodDays: "-",
        periodTime: " 1d 0h 0m "
    };
    expect(service.getCopyFieldText(snapshot, "timezone")).toBe("[KST]");
    expect(service.getCopyFieldText({ timezone: "[UTC]" }, "timezone")).toBe("[UTC]");
    expect(service.getCopyFieldText({ timezone: " " }, "timezone")).toBe("");
    expect(service.getCopyFieldText(snapshot, "region")).toBe("Seoul");
    expect(service.getCopyFieldText(snapshot, "offset")).toBe("[UTC+09:00]");
    expect(service.getCopyFieldText({ offset: "UTC" }, "offset")).toBe("[UTC]");
    expect(service.getCopyFieldText({}, "offset")).toBe("");
    expect(service.getCopyFieldText(snapshot, "period_days")).toBe("");
    expect(service.getCopyFieldText({ periodDays: "3d" }, "period_days")).toBe("[3d]");
    expect(service.getCopyFieldText(snapshot, "period_time")).toBe("[1d 0h 0m]");
    expect(service.getCopyFieldText({ periodTime: "-" }, "period_time")).toBe("");
    expect(service.getCopyFieldText(snapshot, "time")).toBe("DAY 2026-01-01 09:00:00");
    expect(service.getCopyFieldText(snapshot, "unknown")).toBe("");
    expect(service.getCopyFieldText(null, "time")).toBe("");
});

test("time text uses default parts when the sanitizer fails and joins slots", () => {
    const warnings = [];
    const service = createService({
        ...createDepsStub(),
        sanitizeTimePartsEnabled: () => { throw new Error("bad parts"); },
        logWarn: (...args) => warnings.push(args[0])
    });
    const text = service.formatTimeTextByParts({
        dates: ["2026-01-01", "2026-01-02"],
        clocks: ["09:00:00"],
        dayNames: ["Thu", "Fri"],
        dayNightIcons: "bad"
    });
    expect(text).toBe("2026-01-01 09:00:00 (Thu) ~ 2026-01-02 (Fri)");
    expect(warnings).toEqual(['[GTVSnapshotFormat] Dependency "sanitizeTimePartsEnabled" threw.']);
});

test("row copy text resolves rows by element id and skips disabled fields", () => {
    const service = createService(createDepsStub());
    const options = { order: ["timezone", "region", "offset"], enabled: { timezone: true, offset: true } };
    expect(service.getRowCopyText({ id: "tz-row-base" }, options)).toBe("[KST] [UTC+09:00]");
    expect(service.getRowCopyText("team", { ...options, enabled: { region: true } })).toBe("Tokyo");
    expect(service.getRowCopyText({ id: "" }, options)).toBe("");
    expect(service.getRowCopyText("missing", options)).toBe("");
    expect(service.formatSnapshotText(null, [], {})).toBe("");

    const badOrder = createService({ ...createDepsStub(), sanitizeCopyFormatOrder: () => "nope" });
    expect(badOrder.formatSnapshotText({ timezone: "KST" }, ["timezone"], { timezone: true })).toBe("");
});

test("missing pad and logger fall back to built-in padding and console", () => {
    const { pad: _pad, ...deps } = createDepsStub();
    const service = createService({ ...deps, consoleWarn: undefined });
    const snapshot = service.buildTimezoneComputedSnapshotForDates(
        { id: "c", type: "custom", abbr: " jst ", offset: 540 },
        [new Date("2026-01-01T00:00:00Z")]
    );
    expect(snapshot.timezone).toBe("JST");
    expect(snapshot.offset).toBe("UTC+09:00");
    expect(snapshot.times).toEqual(["2026-01-01 09:00:00"]);
});
