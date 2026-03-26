import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "fixed-time-core.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadFixedTimeCoreModule(options = {}) {
    const globalPatches = {
        window: options.window || {},
        Date,
        console: options.console || console
    };
    const keys = ["window", "Date", "console", "GTVFixedTimeCore", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVFixedTimeCore || globalThis.GTVFixedTimeCore;
}

function buildTimezoneDeps() {
    return {
        getFixedOffsetForDisplayAtDate: (tz) => {
            if (tz?.zone === "Asia/Seoul") return 540;
            return 0;
        },
        getLocalPartsByTimezone: (utcDate, _tz, offsetMinutes) => {
            const shifted = new Date(utcDate.getTime() + (offsetMinutes * 60000));
            return {
                year: shifted.getUTCFullYear(),
                month: shifted.getUTCMonth() + 1,
                day: shifted.getUTCDate(),
                hour: shifted.getUTCHours(),
                minute: shifted.getUTCMinutes(),
                second: shifted.getUTCSeconds()
            };
        },
        getUTCDateFromLocalParts: (parts, _tz, offsetMinutes) => {
            const utcMs = Date.UTC(
                parts.year,
                parts.month - 1,
                parts.day,
                parts.hour,
                parts.minute,
                parts.second || 0
            ) - (offsetMinutes * 60000);
            return new Date(utcMs);
        }
    };
}

describe("GTV fixed time core module", () => {
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

    it("normalizes day/night markers and glyphs", () => {
        const module = loadFixedTimeCoreModule();
        const service = module.createService({});

        expect(service.normalizeDayNightMarker("sun")).toBe("");
        expect(service.normalizeDayNightMarker("day")).toBe("DAY");
        expect(service.getDayNightGlyph("NIGHT")).toBe("\uD83C\uDF19");
    });

    it("resolves fixed-time UTC date by base timezone", () => {
        const module = loadFixedTimeCoreModule();
        const timezoneDeps = buildTimezoneDeps();
        const service = module.createService({
            DEFAULT_FIXED_TIME_VALUE: "09:00",
            sanitizeFixedTimeValue: (value, fallback) => value || fallback,
            ...timezoneDeps
        });
        const slot = { id: "ft-1", time: "09:00" };
        const anchorDate = new Date("2026-03-07T00:00:00.000Z");
        const utcBase = { zone: "UTC" };
        const seoulBase = { zone: "Asia/Seoul" };

        const utcBased = service.resolveFixedTimeSlotUtcDate(slot, utcBase, anchorDate);
        const seoulBased = service.resolveFixedTimeSlotUtcDate(slot, seoulBase, anchorDate);

        expect(utcBased.toISOString()).toBe("2026-03-07T09:00:00.000Z");
        expect(seoulBased.toISOString()).toBe("2026-03-07T00:00:00.000Z");
    });

    it("builds display payload with localized weekday and clock text", () => {
        const module = loadFixedTimeCoreModule();
        const timezoneDeps = buildTimezoneDeps();
        const service = module.createService({
            I18N_DATA: {
                en: { days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }
            },
            getCurrentLang: () => "en",
            pad: (value) => String(value).padStart(2, "0"),
            ...timezoneDeps
        });
        const utcDate = new Date("2026-03-07T00:00:00.000Z");
        const payload = service.buildFixedTimeDisplayPayloadAtUtc(utcDate, { zone: "Asia/Seoul" });

        expect(payload.clock).toBe("09:00:00");
        expect(payload.dayNightMarker).toBe("DAY");
        expect(payload.dayName).toBe("Sat");
    });

    it("computes fixed-time display part flags from context sanitization", () => {
        const module = loadFixedTimeCoreModule();
        const service = module.createService({
            getDisplayTimePartsEnabled: () => ({ dn: true, date: true, time: false, weekday: true }),
            sanitizeTimePartsEnabledForContext: (enabled) => enabled
        });

        expect(service.getFixedTimeDisplayPartsEnabled()).toEqual({
            dn: true,
            time: false,
            weekday: true
        });
    });

    it("builds slot header labels with fallback numbering", () => {
        const module = loadFixedTimeCoreModule();
        const service = module.createService({
            t: (key) => (key === "th_fixed_time" ? "Fixed Time" : key),
            getDefaultFixedTimeName: () => "Fixed Time",
            sanitizeFixedTimeName: (value, fallback) => (String(value || "").trim() || fallback)
        });

        expect(service.getFixedTimeSlotHeaderLabel({ name: "Release" }, 0, 2)).toBe("Release");
        expect(service.getFixedTimeSlotHeaderLabel({ name: "" }, 1, 2)).toBe("Fixed Time 2");
    });

    it("exposes localized weekday fallback and timeline indicator palette wrapping", () => {
        const module = loadFixedTimeCoreModule();
        const service = module.createService({
            I18N_DATA: {
                en: { days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }
            }
        });

        expect(service.getLocalizedWeekdayNameByIndex(0)).toBe("Sun");
        expect(service.getLocalizedWeekdayNameByIndex(10)).toBe("");
        expect(service.getFixedTimeTimelineIndicatorColor(0)).toBe("#ff4d4d");
        expect(service.getFixedTimeTimelineIndicatorColor(5)).toBe("#ff4d4d");
    });

    it("parses slot parts and handles invalid slot time values", () => {
        const module = loadFixedTimeCoreModule();
        const service = module.createService({
            DEFAULT_FIXED_TIME_VALUE: "09:00",
            sanitizeFixedTimeValue: (value, fallback) => value || fallback
        });

        expect(service.getFixedTimeSlotParts({ time: "13:45" })).toEqual({ hour: 13, minute: 45 });
        expect(service.getFixedTimeSlotParts({ time: "invalid" })).toBe(null);
    });

    it("resolveFixedTimeSlotUtcDate returns null for invalid inputs and dependency failures", () => {
        const module = loadFixedTimeCoreModule();
        const service = module.createService({
            DEFAULT_FIXED_TIME_VALUE: "09:00",
            sanitizeFixedTimeValue: () => "09:00",
            getFixedOffsetForDisplayAtDate: () => 0,
            getLocalPartsByTimezone: () => ({ year: 2026, month: 3, day: 7 }),
            getUTCDateFromLocalParts: () => new Date("invalid")
        });

        expect(service.resolveFixedTimeSlotUtcDate(null, { zone: "UTC" })).toBe(null);
        expect(service.resolveFixedTimeSlotUtcDate({ time: "09:00" }, null)).toBe(null);
        expect(service.resolveFixedTimeSlotUtcDate({ time: "09:00" }, { zone: "UTC" })).toBe(null);

        const throwService = module.createService({
            DEFAULT_FIXED_TIME_VALUE: "09:00",
            sanitizeFixedTimeValue: () => "09:00",
            getFixedOffsetForDisplayAtDate: () => {
                throw new Error("offset failure");
            }
        });
        expect(throwService.resolveFixedTimeSlotUtcDate({ time: "09:00" }, { zone: "UTC" })).toBe(null);
    });

    it("resolveFixedTimeSlotUtcDate prefers fixed date parts over anchor local date", () => {
        const module = loadFixedTimeCoreModule();
        const captured = [];
        const service = module.createService({
            DEFAULT_FIXED_TIME_VALUE: "09:00",
            sanitizeFixedTimeValue: (value, fallback) => value || fallback,
            getFixedOffsetForDisplayAtDate: () => 0,
            getLocalPartsByTimezone: () => ({ year: 2026, month: 3, day: 7 }),
            getFixedDateParts: () => ({ year: 2027, month: 4, day: 8 }),
            getUTCDateFromLocalParts: (parts) => {
                captured.push(parts);
                return new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second));
            }
        });

        const result = service.resolveFixedTimeSlotUtcDate(
            { time: "10:11" },
            { zone: "UTC" },
            new Date("2026-03-07T00:00:00.000Z")
        );

        expect(result.toISOString()).toBe("2027-04-08T10:11:00.000Z");
        expect(captured[0]).toMatchObject({ year: 2027, month: 4, day: 8, hour: 10, minute: 11, second: 0 });
    });

    it("builds payload/night marker and handles payload formatting fallback", () => {
        const module = loadFixedTimeCoreModule();
        const service = module.createService({
            I18N_DATA: {
                en: { days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }
            },
            getCurrentLang: () => "en",
            ...buildTimezoneDeps()
        });
        const nightUtc = new Date("2026-03-07T20:00:00.000Z");
        const payload = service.buildFixedTimeDisplayPayloadAtUtc(nightUtc, { zone: "UTC" });

        expect(payload.dayNightMarker).toBe("NIGHT");
        expect(payload.dayNightGlyph).toBe("\uD83C\uDF19");
        expect(service.formatFixedTimeForTimezoneAtUtc(nightUtc, { zone: "UTC" })).toMatch(/^\d{2}:\d{2}:\d{2}$/);
        expect(service.formatFixedTimeForTimezoneAtUtc(new Date("invalid"), { zone: "UTC" })).toBe("--:--:--");
    });

    it("uses injected day/night marker resolver when provided", () => {
        const module = loadFixedTimeCoreModule();
        const service = module.createService({
            I18N_DATA: {
                en: { days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }
            },
            getCurrentLang: () => "en",
            getDayNightMarkerByHour: (hour) => (Number(hour) === 9 ? "NIGHT" : "DAY"),
            ...buildTimezoneDeps()
        });

        const utcDate = new Date("2026-03-07T00:00:00.000Z");
        const payload = service.buildFixedTimeDisplayPayloadAtUtc(utcDate, { zone: "Asia/Seoul" });
        expect(payload.dayNightMarker).toBe("NIGHT");
    });

    it("handles unknown marker glyphs and display part defaults", () => {
        const module = loadFixedTimeCoreModule();
        const service = module.createService({
            sanitizeTimePartsEnabledForContext: () => null,
            getDisplayTimePartsEnabled: () => null
        });

        expect(service.getDayNightGlyph("custom")).toBe("custom");
        expect(service.getFixedTimeDisplayPartsEnabled()).toEqual({
            dn: false,
            time: false,
            weekday: false
        });
    });
});
