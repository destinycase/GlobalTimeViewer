import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-local-state-accessor-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

const REQUIRED_METHODS = [
    "setMultiRangeState",
    "getNextFixedTimeSeed",
    "setUiPreferencesState",
    "getBaseTimeSnapshot",
    "getFixedTimeSlotCountForGroupRef",
    "confirmRuntime",
    "getActiveCopyFormatKeysForCurrentContext",
    "getActiveTimePartKeysForCurrentContext",
    "getCurrentUiScalePercent",
    "getFixedTimeSlotCountForCurrentGroup",
    "getCurrentGroupFixedTimeShowLiveNow",
    "shouldRunRealtimeTick",
    "getTimeAdjustDayStepValue"
];

function loadMainRuntimeLocalStateAccessorBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeLocalStateAccessorBindings", ...Object.keys(globalPatches)];
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

    return (
        globalThis.window?.GTVMainRuntimeLocalStateAccessorBindings
        || globalThis.GTVMainRuntimeLocalStateAccessorBindings
    );
}

function createProxyService() {
    return REQUIRED_METHODS.reduce((acc, methodName) => {
        acc[methodName] = vi.fn(() => undefined);
        return acc;
    }, {});
}

describe("GTV main runtime local state accessor bindings module", () => {
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

    it("creates runtime local state accessor bindings from delegated module", () => {
        const moduleApi = loadMainRuntimeLocalStateAccessorBindingsModule();
        const delegateService = createProxyService();
        const runtimeLocalStateAccessorProxiesModule = {
            createService: vi.fn(() => delegateService)
        };

        const service = moduleApi.createService({
            runtimeLocalStateAccessorProxiesModule,
            getMainRuntimeLocalStateHelpersService: () => ({})
        });

        expect(runtimeLocalStateAccessorProxiesModule.createService).toHaveBeenCalledWith({
            getMainRuntimeLocalStateHelpersService: expect.any(Function)
        });
        expect(service.setMultiRangeState).toBe(delegateService.setMultiRangeState);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing module api and invalid result", () => {
        const moduleApi = loadMainRuntimeLocalStateAccessorBindingsModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainRuntimeLocalStateAccessorProxies.createService"
        );
        expect(() => moduleApi.createService({
            runtimeLocalStateAccessorProxiesModule: { createService: () => null }
        })).toThrow("Invalid main runtime local state accessor proxies service");
        expect(() => moduleApi.createService({
            runtimeLocalStateAccessorProxiesModule: { createService: () => ({}) }
        })).toThrow("Invalid main runtime local state accessor proxies service");
    });
});
