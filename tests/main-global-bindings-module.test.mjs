import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-global-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainGlobalBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainGlobalBindings", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainGlobalBindings || globalThis.GTVMainGlobalBindings;
}

describe("GTV main global bindings module", () => {
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

    it("maps configured global module references and exposes required bootstrap specs", () => {
        const moduleApi = loadMainGlobalBindingsModule();
        const runtimeGlobalRef = {
            GTVMainBootstrapGuard: { name: "bootstrap-guard" },
            GTVMainRuntimeCoreAccessorBindings: { createService: () => ({}) },
            GTVMainRuntimePublicApiBindings: { createService: () => ({}) },
            GTVMainPatchedStateAccessorBindings: { createService: () => ({}) }
        };

        const service = moduleApi.createService({
            globalRef: runtimeGlobalRef
        });

        expect(service.GTV_MAIN_BOOTSTRAP_GUARD).toBe(runtimeGlobalRef.GTVMainBootstrapGuard);
        expect(service.GTV_MAIN_RUNTIME_CORE_ACCESSOR_BINDINGS).toBe(runtimeGlobalRef.GTVMainRuntimeCoreAccessorBindings);
        expect(service.GTV_MAIN_RUNTIME_PUBLIC_API_BINDINGS).toBe(runtimeGlobalRef.GTVMainRuntimePublicApiBindings);
        expect(service.GTV_MAIN_PATCHED_STATE_ACCESSOR_BINDINGS).toBe(runtimeGlobalRef.GTVMainPatchedStateAccessorBindings);
        expect(Array.isArray(service.REQUIRED_BOOTSTRAP_SPECS)).toBe(true);
        expect(service.REQUIRED_BOOTSTRAP_SPECS.length).toBe(12);
        expect(service.REQUIRED_BOOTSTRAP_SPECS[0]).toEqual({
            serviceName: "persistenceService",
            methodName: "loadPersistence"
        });
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("falls back to runtime global when globalRef is omitted", () => {
        const moduleApi = loadMainGlobalBindingsModule();
        const globalRef = globalThis.window;
        globalRef.GTVMainRuntimeBridgeProxies = { createService: () => ({}) };

        const service = moduleApi.createService();

        expect(service.GTV_MAIN_RUNTIME_BRIDGE_PROXIES).toBe(globalRef.GTVMainRuntimeBridgeProxies);
    });
});
