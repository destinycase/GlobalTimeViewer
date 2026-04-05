import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, expect, test } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "group-state.js");
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
