import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, expect, test } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "src", "js", "modules", "group-state.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function createService(deps = {}) {
    const globalPatches = {
        window: globalThis,
        console
    };
    const keys = ["window", "console", "GTVGroupState", ...Object.keys(globalPatches)];
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

    return (globalThis.window?.GTVGroupState || globalThis.GTVGroupState).createService(deps);
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
    let counter = 0;
    return {
        sanitizeTimezoneId(value) {
            const raw = (typeof value === "string") ? value.trim() : "";
            if (!raw || raw.toLowerCase() === "utc") return "";
            return raw;
        },
        createUniqueTimezoneId(prefix) {
            counter += 1;
            return `${prefix}-${counter}`;
        },
        normalizeCustomAbbr(value) {
            return String(value || "").trim().toUpperCase();
        },
        normalizeZoneAbbreviation(value) {
            return String(value || "").trim().toUpperCase();
        },
        t(key) {
            if (key === "label_custom") return "Custom";
            if (key === "default_group_name") return "Group";
            return key;
        },
        sanitizeBaseTimezoneId(value) {
            const raw = (typeof value === "string") ? value.trim() : "";
            return raw || "utc";
        },
        sanitizeUtcRowOrder(value) {
            const n = Number(value);
            return Number.isFinite(n) && n >= 0 ? Math.trunc(n) : 0;
        },
        sanitizeMultiSubgroupId(value) {
            return (typeof value === "string") ? value.trim() : "";
        },
        sanitizeFixedTimes(value) {
            return Array.isArray(value) ? value.slice(0, 5) : [];
        },
        ensureGroupMultiSubgroups(group) {
            if (!Array.isArray(group.multiSubgroups) || group.multiSubgroups.length === 0) {
                group.multiSubgroups = [{ id: "default", name: "Default" }];
                group.activeMultiSubgroupId = "default";
            }
        }
    };
}

test("sanitizeGroup normalizes duplicate ids, legacy UTC zone, and base timezone", () => {
    const service = createService(createDepsStub());
    const group = service.sanitizeGroup({
        name: "",
        baseTimezoneId: "missing-id",
        showUtcRow: false,
        utcRowOrder: -2,
        fixedTimes: [{ id: "ft-1", name: "Daily", time: "09:00" }],
        zones: [
            { id: "dup", type: "standard", zone: "Asia/Seoul", name_en: "Seoul" },
            { id: "dup", type: "standard", zone: "UTC", name_en: "UTC" },
            { id: "dup", type: "custom", abbr: "kst", offH: "9", offM: "0" }
        ]
    }, 0);

    expect(group).toBeTruthy();
    expect(group.name).toBe("Group 1");
    expect(group.baseTimezoneId).toBe("utc");
    expect(group.showUtcRow).toBe(true);
    expect(group.utcRowOrder).toBe(0);
    expect(group.fixedTimes.length).toBe(1);
    expect(group.zones.length).toBe(2);
    expect(new Set(group.zones.map((z) => z.id)).size).toBe(2);
    expect(group.zones.some((z) => z.type === "standard" && z.zone === "UTC")).toBe(false);
    expect(group.multiSubgroups.length).toBeGreaterThan(0);
});

test("sanitizeGroup keeps valid per-group day/night hours and drops invalid ones", () => {
    const service = createService(createDepsStub());
    const base = { name: "G", zones: [] };
    expect(service.sanitizeGroup({ ...base, dayStartHour: 8, nightStartHour: 20 }, 0)).toMatchObject({ dayStartHour: 8, nightStartHour: 20 });
    for (const [day, night] of [[20, 8], [8, 8], [8.5, 20], [-1, 20], [8, 24], [undefined, undefined]]) {
        const group = service.sanitizeGroup({ ...base, dayStartHour: day, nightStartHour: night }, 0);
        expect(group.dayStartHour).toBeUndefined();
        expect(group.nightStartHour).toBeUndefined();
    }
});

test("sanitizeGroup survives missing dependency functions", () => {
    const service = createService({});
    const group = service.sanitizeGroup({
        zones: [{ type: "custom", offH: "2", offM: "30" }]
    }, 1);

    expect(group).toBeTruthy();
    expect(group.name).toBe("Group 2");
    expect(group.baseTimezoneId).toBe("utc");
    expect(group.zones.length).toBe(1);
    expect(group.zones[0].type).toBe("custom");
    expect(group.zones[0].id.startsWith("tz-c-")).toBe(true);
});

test("sanitizeTimezoneZone rejects invalid standard zone names", () => {
    const service = createService(createDepsStub());
    const sanitized = service.sanitizeTimezoneZone({
        id: "x",
        type: "standard",
        zone: "Invalid/Zone_Name"
    });
    expect(sanitized).toBe(null);
});

test("sanitizeTimezoneZone ignores non-numeric fixed offsets instead of coercing them to zero", () => {
    const service = createService(createDepsStub());
    const sanitized = service.sanitizeTimezoneZone({
        id: "x",
        type: "standard",
        zone: "Asia/Seoul",
        fixedOffsetMinutes: false,
        fixedAbbr: "KST"
    });

    expect(sanitized).toBeTruthy();
    expect(sanitized.fixedOffsetMinutes).toBe(null);
});

test("isValidTimeZone evicts oldest cache entries when max size is reached", () => {
    const originalDateTimeFormat = Intl.DateTimeFormat;
    let validationCalls = 0;
    Intl.DateTimeFormat = function patchedDateTimeFormat(locale, options) {
        if (options && typeof options === "object" && typeof options.timeZone === "string") {
            validationCalls += 1;
        }
        return new originalDateTimeFormat(locale, options);
    };
    Intl.DateTimeFormat.prototype = originalDateTimeFormat.prototype;

    try {
        const service = createService({
            ...createDepsStub(),
            MAX_TIMEZONE_VALIDATION_CACHE_SIZE: 2
        });
        expect(service.isValidTimeZone("UTC")).toBe(true);
        expect(service.isValidTimeZone("Asia/Seoul")).toBe(true);
        expect(service.isValidTimeZone("UTC")).toBe(true);
        expect(service.isValidTimeZone("Europe/London")).toBe(true);
        expect(service.isValidTimeZone("UTC")).toBe(true);
        expect(validationCalls).toBe(4);
    } finally {
        Intl.DateTimeFormat = originalDateTimeFormat;
    }
});

test("sanitizeTimezoneZone turns old fixed DST-city variants back into rule-following cities", () => {
    const service = createService(createDepsStub());
    const city = (zone, fixedOffsetMinutes, fixedAbbr) => service.sanitizeTimezoneZone({
        id: `tz-${zone}-${fixedOffsetMinutes}`,
        type: "standard",
        zone,
        name_ko: "도시",
        name_en: "City",
        fixedOffsetMinutes,
        fixedAbbr
    });

    // Saved by the old country list as "Los Angeles [PDT]" / "[PST]" (northern hemisphere).
    expect(city("America/Los_Angeles", -420, "PDT")).toMatchObject({ zone: "America/Los_Angeles", fixedOffsetMinutes: null, fixedAbbr: "" });
    expect(city("America/Los_Angeles", -480, "PST")).toMatchObject({ fixedOffsetMinutes: null, fixedAbbr: "" });
    // Southern hemisphere: January is daylight time.
    expect(city("Australia/Sydney", 660, "AEDT")).toMatchObject({ fixedOffsetMinutes: null, fixedAbbr: "" });
    expect(city("Australia/Sydney", 600, "AEST")).toMatchObject({ fixedOffsetMinutes: null, fixedAbbr: "" });
    // A city without DST whose fixed offset equals its only offset follows the zone as well.
    expect(city("Asia/Seoul", 540, "KST")).toMatchObject({ fixedOffsetMinutes: null, fixedAbbr: "" });
});

test("sanitizeTimezoneZone keeps fixed offsets that are not an old city variant", () => {
    const service = createService(createDepsStub());

    // Offset-list entry ("UTC-07:00 Standard Time") is stored with zone UTC and stays fixed.
    const offsetEntry = service.sanitizeTimezoneZone({
        id: "tz-std",
        type: "standard",
        zone: "UTC",
        name_ko: "UTC-07:00 표준시",
        fixedOffsetMinutes: -420,
        fixedAbbr: "UTC-07:00"
    });
    expect(offsetEntry.fixedOffsetMinutes).toBe(-420);
    expect(offsetEntry.fixedAbbr).toBe("UTC-07:00");

    // An offset that matches neither of the city's seasons is kept.
    const unrelated = service.sanitizeTimezoneZone({
        id: "tz-odd",
        type: "standard",
        zone: "America/Los_Angeles",
        fixedOffsetMinutes: -300,
        fixedAbbr: "XYZ"
    });
    expect(unrelated.fixedOffsetMinutes).toBe(-300);

    // Rule-following entries and custom zones are unchanged.
    expect(service.sanitizeTimezoneZone({ id: "tz-ny", type: "standard", zone: "America/New_York", fixedOffsetMinutes: null })
        .fixedOffsetMinutes).toBe(null);
    expect(service.sanitizeTimezoneZone({ id: "tz-c", type: "custom", abbr: "ABC", name: "Custom", offH: -7, offM: 0 }))
        .toMatchObject({ type: "custom", offH: -7, offM: 0 });
});
