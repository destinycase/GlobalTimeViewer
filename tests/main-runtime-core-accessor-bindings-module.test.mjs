import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-core-accessor-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

const REQUIRED_METHODS = [
    "syncRealtimeFlagToGlobal",
    "getRuntimeCurrentLangValue",
    "syncCurrentLang",
    "sanitizeDayNightHourValue",
    "normalizeDayNightRangeValues",
    "assertRequiredServices"
];

function loadMainRuntimeCoreAccessorBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeCoreAccessorBindings", ...Object.keys(globalPatches)];
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
        globalThis.window?.GTVMainRuntimeCoreAccessorBindings
        || globalThis.GTVMainRuntimeCoreAccessorBindings
    );
}

function createProxyService() {
    return REQUIRED_METHODS.reduce((acc, methodName) => {
        acc[methodName] = vi.fn(() => undefined);
        return acc;
    }, {});
}

describe("GTV main runtime core accessor bindings module", () => {
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

    it("creates runtime core accessor bindings from delegated module", () => {
        const moduleApi = loadMainRuntimeCoreAccessorBindingsModule();
        const delegateService = createProxyService();
        const runtimeCoreAccessorProxiesModule = {
            createService: vi.fn(() => delegateService)
        };

        const service = moduleApi.createService({
            runtimeCoreAccessorProxiesModule,
            getMainRuntimeLangStateService: () => ({})
        });

        expect(runtimeCoreAccessorProxiesModule.createService).toHaveBeenCalledWith({
            getMainRuntimeLangStateService: expect.any(Function)
        });
        expect(service.syncRealtimeFlagToGlobal).toBe(delegateService.syncRealtimeFlagToGlobal);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing module api and invalid result", () => {
        const moduleApi = loadMainRuntimeCoreAccessorBindingsModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainRuntimeCoreAccessorProxies.createService"
        );
        expect(() => moduleApi.createService({
            runtimeCoreAccessorProxiesModule: { createService: () => null }
        })).toThrow("Invalid main runtime core accessor proxies service");
        expect(() => moduleApi.createService({
            runtimeCoreAccessorProxiesModule: { createService: () => ({}) }
        })).toThrow("Invalid main runtime core accessor proxies service");
    });
});
