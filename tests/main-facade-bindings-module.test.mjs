import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-facade-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainFacadeBindingsModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainFacadeBindings", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainFacadeBindings || globalThis.GTVMainFacadeBindings;
}

describe("GTV main facade bindings module", () => {
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

    it("creates all expected facade bindings from getter groups", () => {
        const moduleApi = loadMainFacadeBindingsModule();
        const calls = [];
        const service = moduleApi.createService({
            bindFacadeMethod: (getFacade, methodName) => {
                calls.push({ getFacade, methodName });
                return () => `${getFacade()}:${methodName}`;
            },
            getMainTimezoneFacadeServiceRef: () => "tz",
            getMainTimeAdjustFacadeServiceRef: () => "adjust",
            getMainTimezoneTableFacadeServiceRef: () => "tz-table",
            getMainTimelineFacadeServiceRef: () => "timeline",
            getMainFixedTimeFacadeServiceRef: () => "fixed",
            getMainFixedTimeTabFacadeServiceRef: () => "fixed-tab",
            getMainMultiRangeTabFacadeServiceRef: () => "multi-range"
        });

        expect(typeof service.getTimezoneOffset).toBe("function");
        expect(typeof service.renderFixedTimeTable).toBe("function");
        expect(typeof service.copyAllMultiRangeTimezones).toBe("function");
        expect(service.getTimezoneOffset()).toBe("tz:getTimezoneOffset");
        expect(service.renderFixedTimeTable()).toBe("fixed-tab:renderFixedTimeTable");
        expect(service.copyAllMultiRangeTimezones()).toBe("multi-range:copyAllMultiRangeTimezones");
        expect(calls.length).toBe(Object.keys(service).length);
    });
});
