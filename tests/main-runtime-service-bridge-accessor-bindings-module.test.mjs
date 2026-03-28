import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-service-bridge-accessor-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

const REQUIRED_METHODS = [
    "warnMissingServiceMethod",
    "showMissingFeatureToastOnce",
    "getServiceMethod",
    "callServiceMethod",
    "savePersistenceSafely",
    "renderMultiRangesSafely"
];

function loadMainRuntimeServiceBridgeAccessorBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeServiceBridgeAccessorBindings", ...Object.keys(globalPatches)];
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
        globalThis.window?.GTVMainRuntimeServiceBridgeAccessorBindings
        || globalThis.GTVMainRuntimeServiceBridgeAccessorBindings
    );
}

function createProxyService() {
    return REQUIRED_METHODS.reduce((acc, methodName) => {
        acc[methodName] = vi.fn(() => undefined);
        return acc;
    }, {});
}

describe("GTV main runtime service bridge accessor bindings module", () => {
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

    it("creates runtime service bridge accessor bindings from delegated module", () => {
        const moduleApi = loadMainRuntimeServiceBridgeAccessorBindingsModule();
        const delegateService = createProxyService();
        const runtimeServiceBridgeAccessorProxiesModule = {
            createService: vi.fn(() => delegateService)
        };

        const service = moduleApi.createService({
            runtimeServiceBridgeAccessorProxiesModule,
            getMainRuntimeServiceBridgeHelpersService: () => ({})
        });

        expect(runtimeServiceBridgeAccessorProxiesModule.createService).toHaveBeenCalledWith({
            getMainRuntimeServiceBridgeHelpersService: expect.any(Function)
        });
        expect(service.callServiceMethod).toBe(delegateService.callServiceMethod);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing module api and invalid result", () => {
        const moduleApi = loadMainRuntimeServiceBridgeAccessorBindingsModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainRuntimeServiceBridgeAccessorProxies.createService"
        );
        expect(() => moduleApi.createService({
            runtimeServiceBridgeAccessorProxiesModule: { createService: () => null }
        })).toThrow("Invalid main runtime service bridge accessor proxies service");
        expect(() => moduleApi.createService({
            runtimeServiceBridgeAccessorProxiesModule: { createService: () => ({}) }
        })).toThrow("Invalid main runtime service bridge accessor proxies service");
    });
});
