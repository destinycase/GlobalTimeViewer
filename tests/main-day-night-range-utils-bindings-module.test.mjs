import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-day-night-range-utils-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainDayNightRangeUtilsBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainDayNightRangeUtilsBindings", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainDayNightRangeUtilsBindings || globalThis.GTVMainDayNightRangeUtilsBindings;
}

describe("GTV main day night range utils bindings module", () => {
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

    it("creates day night range utils bindings from delegated module", () => {
        const moduleApi = loadMainDayNightRangeUtilsBindingsModule();
        const mainDayNightRangeUtilsService = {
            sanitizeDayNightHourValue: vi.fn(() => 6),
            normalizeDayNightRangeValues: vi.fn((dayStartHour, nightStartHour) => ({
                dayStartHour,
                nightStartHour
            }))
        };
        const dayNightRangeUtilsModule = {
            createService: vi.fn(() => mainDayNightRangeUtilsService)
        };

        const service = moduleApi.createService({
            dayNightRangeUtilsModule,
            defaultDayStartHour: 6,
            defaultNightStartHour: 18
        });

        expect(dayNightRangeUtilsModule.createService).toHaveBeenCalledWith({
            defaultDayStartHour: 6,
            defaultNightStartHour: 18
        });
        expect(service.mainDayNightRangeUtilsService).toBe(mainDayNightRangeUtilsService);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing module api and invalid result", () => {
        const moduleApi = loadMainDayNightRangeUtilsBindingsModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainDayNightRangeUtils.createService"
        );
        expect(() => moduleApi.createService({
            dayNightRangeUtilsModule: { createService: () => null }
        })).toThrow("Invalid main day night range utils service");
    });
});
