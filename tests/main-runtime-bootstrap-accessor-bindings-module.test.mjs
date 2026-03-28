import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-bootstrap-accessor-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

const REQUIRED_METHODS = [
    "initApp",
    "startBootstrapOnDomReady"
];

function loadMainRuntimeBootstrapAccessorBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeBootstrapAccessorBindings", ...Object.keys(globalPatches)];
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
        globalThis.window?.GTVMainRuntimeBootstrapAccessorBindings
        || globalThis.GTVMainRuntimeBootstrapAccessorBindings
    );
}

function createProxyService() {
    return REQUIRED_METHODS.reduce((acc, methodName) => {
        acc[methodName] = vi.fn(() => undefined);
        return acc;
    }, {});
}

describe("GTV main runtime bootstrap accessor bindings module", () => {
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

    it("creates runtime bootstrap accessor bindings from delegated module", () => {
        const moduleApi = loadMainRuntimeBootstrapAccessorBindingsModule();
        const delegateService = createProxyService();
        const runtimeBootstrapAccessorProxiesModule = {
            createService: vi.fn(() => delegateService)
        };

        const service = moduleApi.createService({
            runtimeBootstrapAccessorProxiesModule,
            getMainAppBootstrapService: () => ({})
        });

        expect(runtimeBootstrapAccessorProxiesModule.createService).toHaveBeenCalledWith({
            getMainAppBootstrapService: expect.any(Function)
        });
        expect(service.initApp).toBe(delegateService.initApp);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing module api and invalid result", () => {
        const moduleApi = loadMainRuntimeBootstrapAccessorBindingsModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainRuntimeBootstrapAccessorProxies.createService"
        );
        expect(() => moduleApi.createService({
            runtimeBootstrapAccessorProxiesModule: { createService: () => null }
        })).toThrow("Invalid main runtime bootstrap accessor proxies service");
        expect(() => moduleApi.createService({
            runtimeBootstrapAccessorProxiesModule: { createService: () => ({}) }
        })).toThrow("Invalid main runtime bootstrap accessor proxies service");
    });
});
