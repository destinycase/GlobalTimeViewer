import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-day-night-range-utils.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainDayNightRangeUtilsModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainDayNightRangeUtils", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainDayNightRangeUtils || globalThis.GTVMainDayNightRangeUtils;
}

describe("GTV main day/night range utils module", () => {
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

    it("sanitizes day/night hour values with nearest valid option", () => {
        const moduleApi = loadMainDayNightRangeUtilsModule();
        const service = moduleApi.createService({
            defaultDayStartHour: 6,
            defaultNightStartHour: 18,
            dayNightHourOptions: Array.from({ length: 24 }, (_, hour) => hour)
        });

        expect(service.sanitizeDayNightHourValue("7", 6)).toBe(7);
        expect(service.sanitizeDayNightHourValue("99", 6)).toBe(23);
        expect(service.sanitizeDayNightHourValue("bad", 6)).toBe(6);
    });

    it("normalizes invalid day/night ranges back to defaults", () => {
        const moduleApi = loadMainDayNightRangeUtilsModule();
        const service = moduleApi.createService({
            defaultDayStartHour: 6,
            defaultNightStartHour: 18,
            dayNightHourOptions: Array.from({ length: 24 }, (_, hour) => hour)
        });

        expect(service.normalizeDayNightRangeValues(8, 20)).toEqual({
            dayStartHour: 8,
            nightStartHour: 20
        });
        expect(service.normalizeDayNightRangeValues(20, 8)).toEqual({
            dayStartHour: 6,
            nightStartHour: 18
        });
    });
});
