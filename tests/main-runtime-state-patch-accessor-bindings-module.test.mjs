import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-state-patch-accessor-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

const REQUIRED_METHODS = [
    "applyDirectStatePatch",
    "buildPatchedStateFallbackSnapshot"
];

function loadMainRuntimeStatePatchAccessorBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeStatePatchAccessorBindings", ...Object.keys(globalPatches)];
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
        globalThis.window?.GTVMainRuntimeStatePatchAccessorBindings
        || globalThis.GTVMainRuntimeStatePatchAccessorBindings
    );
}

function createProxyService() {
    return REQUIRED_METHODS.reduce((acc, methodName) => {
        acc[methodName] = vi.fn(() => undefined);
        return acc;
    }, {});
}

describe("GTV main runtime state patch accessor bindings module", () => {
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

    it("creates runtime state patch accessor bindings from delegated module", () => {
        const moduleApi = loadMainRuntimeStatePatchAccessorBindingsModule();
        const delegateService = createProxyService();
        const runtimeStatePatchAccessorProxiesModule = {
            createService: vi.fn(() => delegateService)
        };

        const service = moduleApi.createService({
            runtimeStatePatchAccessorProxiesModule,
            getDirectStateSetters: () => ({})
        });

        expect(runtimeStatePatchAccessorProxiesModule.createService).toHaveBeenCalledWith({
            getDirectStateSetters: expect.any(Function)
        });
        expect(service.applyDirectStatePatch).toBe(delegateService.applyDirectStatePatch);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing module api and invalid result", () => {
        const moduleApi = loadMainRuntimeStatePatchAccessorBindingsModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainRuntimeStatePatchAccessorProxies.createService"
        );
        expect(() => moduleApi.createService({
            runtimeStatePatchAccessorProxiesModule: { createService: () => null }
        })).toThrow("Invalid main runtime state patch accessor proxies service");
        expect(() => moduleApi.createService({
            runtimeStatePatchAccessorProxiesModule: { createService: () => ({}) }
        })).toThrow("Invalid main runtime state patch accessor proxies service");
    });
});
