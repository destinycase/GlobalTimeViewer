import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-constants-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainConstantsBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainConstantsBindings", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainConstantsBindings || globalThis.GTVMainConstantsBindings;
}

describe("GTV main constants bindings module", () => {
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

    it("normalizes constant values from constants module", () => {
        const moduleApi = loadMainConstantsBindingsModule();
        const service = moduleApi.createService({
            constantsModule: {
                COPY_FORMAT_KEYS: ["time"],
                TIME_PART_KEYS: ["hour24"],
                PERIOD_RESULT_IDS: ["x"],
                TIMELINE_TOTAL_HOURS: 48,
                DEFAULT_TIME_ADJUST_DAY_STEP: 2,
                DEFAULT_DAY_START_HOUR: 7,
                DEFAULT_NIGHT_START_HOUR: 19,
                DEFAULT_MULTI_RANGE_TITLE: "Range",
                DEFAULT_DISPLAY_FORMAT_ENABLED: { time: true }
            }
        });

        expect(service.COPY_FORMAT_KEYS).toEqual(["time"]);
        expect(service.TIME_PART_KEYS).toEqual(["hour24"]);
        expect(service.PERIOD_RESULT_IDS.has("x")).toBe(true);
        expect(service.TIMELINE_TOTAL_HOURS).toBe(48);
        expect(service.DEFAULT_TIME_ADJUST_DAY_STEP).toBe(2);
        expect(service.DEFAULT_DAY_START_HOUR).toBe(7);
        expect(service.DEFAULT_NIGHT_START_HOUR).toBe(19);
        expect(service.DEFAULT_DISPLAY_FORMAT_ENABLED).toEqual({ time: true });
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit error when constants module is missing", () => {
        const moduleApi = loadMainConstantsBindingsModule();
        expect(() => moduleApi.createService({})).toThrow("Missing required module: GTVMainConstants");
    });
});
