import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-host-accessor-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

const REQUIRED_METHODS = [
    "applyVersionBranding",
    "createCanvasSafely",
    "getRandomUUIDSafely",
    "getDocumentRefOrNull",
    "getWindowRefOrNull",
    "getLocationRefOrNull",
    "getGlobalThisRefOrNull",
    "getLuxonGlobalRef",
    "getComputedStyleSafely",
    "getRuntimeNowMs",
    "setRuntimeInterval",
    "clearRuntimeInterval",
    "deferDynamicCall"
];

function loadMainRuntimeHostAccessorBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeHostAccessorBindings", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainRuntimeHostAccessorBindings || globalThis.GTVMainRuntimeHostAccessorBindings;
}

function createProxyService() {
    return REQUIRED_METHODS.reduce((acc, methodName) => {
        acc[methodName] = vi.fn(() => undefined);
        return acc;
    }, {});
}

describe("GTV main runtime host accessor bindings module", () => {
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

    it("creates runtime host accessor bindings from delegated module", () => {
        const moduleApi = loadMainRuntimeHostAccessorBindingsModule();
        const delegateService = createProxyService();
        const runtimeHostAccessorProxiesModule = {
            createService: vi.fn(() => delegateService)
        };

        const service = moduleApi.createService({
            runtimeHostAccessorProxiesModule,
            getMainRuntimeHostUtilsService: () => ({})
        });

        expect(runtimeHostAccessorProxiesModule.createService).toHaveBeenCalledWith({
            getMainRuntimeHostUtilsService: expect.any(Function)
        });
        expect(service.applyVersionBranding).toBe(delegateService.applyVersionBranding);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing module api and invalid result", () => {
        const moduleApi = loadMainRuntimeHostAccessorBindingsModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainRuntimeHostAccessorProxies.createService"
        );
        expect(() => moduleApi.createService({
            runtimeHostAccessorProxiesModule: { createService: () => null }
        })).toThrow("Invalid main runtime host accessor proxies service");
        expect(() => moduleApi.createService({
            runtimeHostAccessorProxiesModule: { createService: () => ({}) }
        })).toThrow("Invalid main runtime host accessor proxies service");
    });
});
