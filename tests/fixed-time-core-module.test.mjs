import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "fixed-time-core.js");

function loadFixedTimeCoreModule(options = {}) {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = {
        window: {},
        globalThis: {},
        Date,
        console: options.console || console
    };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/fixed-time-core.js" });
    return sandbox.window.GTVFixedTimeCore || sandbox.GTVFixedTimeCore || sandbox.globalThis.GTVFixedTimeCore;
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
});

