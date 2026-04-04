import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-facade-bridge.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainFacadeBridgeModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainFacadeBridge", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainFacadeBridge || globalThis.GTVMainFacadeBridge;
}

describe("GTV main facade bridge module", () => {
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

    it("merges core facade bindings with timezone/time-core adapters", () => {
        const moduleApi = loadMainFacadeBridgeModule();
        const bindFacadeMethod = vi.fn((_getter, methodName) => `bound:${methodName}`);
        const facadeBindingsModule = {
            createService: vi.fn(() => ({
                addTimezone: () => "ok",
                getUtcMinuteCacheKey: () => "cache"
            }))
        };
        const getMainTimezoneFacadeServiceRef = () => ({});
        const getMainTimeAdjustFacadeServiceRef = () => ({});
        const getMainTimezoneTableFacadeServiceRef = () => ({});
        const getMainTimelineFacadeServiceRef = () => ({});
        const getMainFixedTimeFacadeServiceRef = () => ({});
        const getMainFixedTimeTabFacadeServiceRef = () => ({});
        const getMainMultiRangeTabFacadeServiceRef = () => ({});
        const getTimeCoreRef = () => ({});
        const getMainFoundationServicesRef = () => ({});

        const service = moduleApi.createService({
            facadeBindingsModule,
            bindFacadeMethod,
            getTimeCoreRef,
            getMainFoundationServicesRef,
            getMainTimezoneFacadeServiceRef,
            getMainTimeAdjustFacadeServiceRef,
            getMainTimezoneTableFacadeServiceRef,
            getMainTimelineFacadeServiceRef,
            getMainFixedTimeFacadeServiceRef,
            getMainFixedTimeTabFacadeServiceRef,
            getMainMultiRangeTabFacadeServiceRef
        });

        expect(service.sanitizeUtcRowOrderViaTimeCore).toBe("bound:sanitizeUtcRowOrder");
        expect(service.sanitizeUtcMsViaTimeCore).toBe("bound:sanitizeUtcMs");
        expect(service.confirmFnViaMainFoundation).toBe("bound:confirmFn");
        expect(service.promptFnViaMainFoundation).toBe("bound:promptFn");
        expect(service.addTimezone()).toBe("ok");
        expect(service.getUtcMinuteCacheKey()).toBe("cache");
        expect(bindFacadeMethod).toHaveBeenCalledTimes(4);
        expect(facadeBindingsModule.createService).toHaveBeenCalledWith({
            bindFacadeMethod,
            getMainTimezoneFacadeServiceRef,
            getMainTimeAdjustFacadeServiceRef,
            getMainTimezoneTableFacadeServiceRef,
            getMainTimelineFacadeServiceRef,
            getMainFixedTimeFacadeServiceRef,
            getMainFixedTimeTabFacadeServiceRef,
            getMainMultiRangeTabFacadeServiceRef
        });
    });

    it("throws explicit errors when required dependencies are missing", () => {
        const moduleApi = loadMainFacadeBridgeModule();

        expect(() => moduleApi.createService({ bindFacadeMethod: () => {} })).toThrow(
            "Missing required module API: GTVMainFacadeBindings.createService"
        );
        expect(() => moduleApi.createService({
            facadeBindingsModule: { createService: () => ({}) }
        })).toThrow("Missing dependency: bindFacadeMethod");
    });
});
