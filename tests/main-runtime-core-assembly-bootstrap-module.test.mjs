import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-core-assembly-bootstrap.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeCoreAssemblyBootstrapModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeCoreAssemblyBootstrap", ...Object.keys(globalPatches)];
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
        globalThis.window?.GTVMainRuntimeCoreAssemblyBootstrap
        || globalThis.GTVMainRuntimeCoreAssemblyBootstrap
    );
}

describe("GTV main runtime core assembly bootstrap module", () => {
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

    it("builds main core assembly config from module refs + accessor services", () => {
        const moduleApi = loadMainRuntimeCoreAssemblyBootstrapModule();
        const buildMainCoreAssemblyConfig = vi.fn(() => ({ id: "main-core-assembly-config" }));
        const serviceMethodMissingToken = Symbol("missing");

        const service = moduleApi.createService({
            mainCoreAssemblyConfigBuilderService: {
                buildMainCoreAssemblyConfig
            },
            moduleRefs: {
                GTV_MAIN_SERVICE_METHOD_BRIDGE: { kind: "service-method-bridge-module" }
            },
            runtimeReferenceAccessorService: {
                getAppStatePatcherServiceRef: () => "patcher-ref",
                getAppPersistenceStateServiceRef: () => "persistence-ref",
                getPatchedMainTabState: () => "live"
            },
            patchedStateAccessorService: {
                getPatchedMainTabState: () => "live"
            },
            SERVICE_METHOD_MISSING: serviceMethodMissingToken,
            gtvT: () => "ok"
        });

        expect(buildMainCoreAssemblyConfig).toHaveBeenCalledTimes(1);
        expect(buildMainCoreAssemblyConfig.mock.calls[0][0]).toEqual(expect.objectContaining({
            GTV_MAIN_SERVICE_METHOD_BRIDGE: { kind: "service-method-bridge-module" },
            getAppStatePatcherServiceRef: expect.any(Function),
            getPatchedMainTabState: expect.any(Function),
            SERVICE_METHOD_MISSING: serviceMethodMissingToken
        }));
        expect(service.mainCoreAssemblyConfig).toEqual({ id: "main-core-assembly-config" });
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit dependency errors for missing required dependencies", () => {
        const moduleApi = loadMainRuntimeCoreAssemblyBootstrapModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required dependency: mainCoreAssemblyConfigBuilderService"
        );
        expect(() => moduleApi.createService({
            mainCoreAssemblyConfigBuilderService: {},
            moduleRefs: {},
            runtimeReferenceAccessorService: {},
            patchedStateAccessorService: {}
        })).toThrow(
            "Missing required dependency: mainCoreAssemblyConfigBuilderService.buildMainCoreAssemblyConfig"
        );
    });
});
