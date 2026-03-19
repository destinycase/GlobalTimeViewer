import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "fixed-time-slot-utils.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);

let restoreGlobals = null;

function installGlobalScaffold() {
    const keys = ["window", "GTVFixedTimeSlotUtils"];
    const previous = new Map();
    keys.forEach((key) => {
        previous.set(key, Object.prototype.hasOwnProperty.call(globalThis, key) ? globalThis[key] : undefined);
    });

    globalThis.window = globalThis;

    return () => {
        keys.forEach((key) => {
            const value = previous.get(key);
            if (value === undefined) {
                delete globalThis[key];
                return;
            }
            globalThis[key] = value;
        });
    };
}

function loadFixedTimeSlotUtilsModule() {
    delete require.cache[MODULE_ID];
    require(MODULE_PATH);
    return globalThis.GTVFixedTimeSlotUtils;
}

function buildDateDeps() {
    return {
        parseDateTimeParts: (source, mode) => {
            if (mode !== "date" || typeof source !== "string") return null;
            const match = source.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
            if (!match) return null;
            return [match[1], match[2], match[3]];
        },
        buildStrictUtcDateFromParts: ({ year, month, day, hour = 0, minute = 0, second = 0 }) => {
            if (month < 1 || month > 12 || day < 1 || day > 31) return null;
            const utc = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
            if (utc.getUTCFullYear() !== year || utc.getUTCMonth() + 1 !== month || utc.getUTCDate() !== day) {
                return null;
            }
            return utc;
        }
    };
}

describe("GTV fixed time slot utils module", () => {
    beforeEach(() => {
        restoreGlobals = installGlobalScaffold();
    });

    afterEach(() => {
        if (typeof restoreGlobals === "function") restoreGlobals();
    });

    it("sanitizes fixed time primitives and generates default slot values", () => {
        const moduleApi = loadFixedTimeSlotUtilsModule();
        const service = moduleApi.createService({
            MIN_FIXED_TIME_SLOT_COUNT: 2,
            MAX_FIXED_TIME_SLOT_COUNT: 4,
            DEFAULT_FIXED_TIME_VALUE: " 08:30 ",
            t: (key) => (key === "label_fixed_time_default" ? " Fixed Slot " : ""),
            pad: (value) => String(value).padStart(2, "0"),
            ...buildDateDeps()
        });

        expect(service.getDefaultFixedTimeName()).toBe("Fixed Slot");
        expect(service.getDefaultFixedDate(new Date("2026-01-02T10:00:00.000Z"))).toBe("2026-01-02");
        expect(service.getDefaultFixedTimes()).toEqual([{ id: "", name: "Fixed Slot", time: "08:30" }]);

        expect(service.sanitizeFixedTimeSlotCount("99")).toBe(4);
        expect(service.sanitizeFixedTimeSlotCount("0")).toBe(2);
        expect(service.sanitizeFixedTimeSlotCount("not-a-number")).toBe(2);

        expect(service.sanitizeFixedTimeId("  abc  ")).toBe("abc");
        expect(service.sanitizeFixedTimeId(10)).toBe("");

        expect(service.sanitizeFixedTimeName("  ", "Fallback Name")).toBe("Fallback Name");
        expect(service.sanitizeFixedTimeName("x".repeat(60), "Fallback")).toBe("x".repeat(40));

        expect(service.sanitizeFixedTimeValue("9:7", "10:00")).toBe("09:07");
        expect(service.sanitizeFixedTimeValue("25:00", "10:00")).toBe("10:00");

        expect(service.sanitizeFixedDateValue("2026-03-07", "")).toBe("2026-03-07");
        expect(service.sanitizeFixedDateValue("2026-13-07", "fallback")).toBe("fallback");
        expect(service.sanitizeFixedDateValue("invalid", "fallback")).toBe("fallback");

        expect(service.createDefaultFixedTimeSlot(" custom-id ")).toEqual({
            id: "custom-id",
            name: "Fixed Slot",
            time: "08:30"
        });
    });

    it("normalizes fixed-time collections, group date parsing, and unique id generation", () => {
        const moduleApi = loadFixedTimeSlotUtilsModule();
        let seed = 0;
        const service = moduleApi.createService({
            MIN_FIXED_TIME_SLOT_COUNT: 2,
            MAX_FIXED_TIME_SLOT_COUNT: 3,
            DEFAULT_FIXED_TIME_VALUE: "09:00",
            t: () => "Fixed Time",
            getNextFixedTimeSeed: () => {
                seed += 1;
                return seed;
            },
            ...buildDateDeps()
        });

        const sanitized = service.sanitizeFixedTimes([
            { id: "ft-1", name: "First", time: "08:00" },
            { id: "ft-1", name: "", time: "99:99" },
            { id: "   ", name: "Third", time: "12:15" },
            { id: "ft-4", name: "Extra", time: "14:00" }
        ]);

        expect(sanitized).toHaveLength(3);
        expect(sanitized[0]).toEqual({ id: "ft-1", name: "First", time: "08:00" });
        expect(sanitized[1].id).toBe("ft-2");
        expect(sanitized[1].name).toBe("Fixed Time");
        expect(sanitized[1].time).toBe("09:00");
        expect(sanitized[2].name).toBe("Third");

        const group = {
            fixedDate: "2026-03-07",
            fixedTimes: [{ id: "a", name: "One", time: "01:10" }]
        };
        service.ensureGroupFixedTimes(group);
        expect(group.fixedTimes).toHaveLength(2);
        expect(group.fixedDate).toBe("2026-03-07");

        expect(service.getFixedDatePartsFromGroup(group)).toEqual({ year: 2026, month: 3, day: 7 });
        expect(service.getFixedDatePartsFromGroup({ fixedDate: "invalid" })).toBeNull();

        const nextUnique = service.createUniqueFixedTimeId({
            fixedTimes: [{ id: "ft-1" }, { id: "ft-2" }]
        });
        expect(nextUnique).toBe("ft-3");
    });
});
