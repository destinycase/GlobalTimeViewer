import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-operation-accessor-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

const REQUIRED_METHODS = [
    "updateClocks",
    "resolveLocalDatePartsByTimezoneAtDate",
    "resolveLocalDatePartsByTimezone",
    "buildStrictUtcDateFromParts",
    "handleTimeChange",
    "handleMultiRangeTimeChange",
    "formatTimeTextByParts",
    "formatSnapshotText",
    "initCalculators",
    "copyText",
    "getPersistenceSnapshot",
    "sanitizeGroup",
    "loadPersistence"
];

function loadMainRuntimeOperationAccessorBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeOperationAccessorBindings", ...Object.keys(globalPatches)];
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
        globalThis.window?.GTVMainRuntimeOperationAccessorBindings
        || globalThis.GTVMainRuntimeOperationAccessorBindings
    );
}

function createProxyService() {
    return REQUIRED_METHODS.reduce((acc, methodName) => {
        acc[methodName] = vi.fn(() => undefined);
        return acc;
    }, {});
}

describe("GTV main runtime operation accessor bindings module", () => {
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

    it("creates runtime operation accessor bindings from delegated module", () => {
        const moduleApi = loadMainRuntimeOperationAccessorBindingsModule();
        const delegateService = createProxyService();
        const runtimeOperationAccessorProxiesModule = {
            createService: vi.fn(() => delegateService)
        };

        const service = moduleApi.createService({
            runtimeOperationAccessorProxiesModule,
            callServiceMethod: () => undefined
        });

        expect(runtimeOperationAccessorProxiesModule.createService).toHaveBeenCalledWith({
            callServiceMethod: expect.any(Function)
        });
        expect(service.updateClocks).toBe(delegateService.updateClocks);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing module api and invalid result", () => {
        const moduleApi = loadMainRuntimeOperationAccessorBindingsModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainRuntimeOperationAccessorProxies.createService"
        );
        expect(() => moduleApi.createService({
            runtimeOperationAccessorProxiesModule: { createService: () => null }
        })).toThrow("Invalid main runtime operation accessor proxies service");
        expect(() => moduleApi.createService({
            runtimeOperationAccessorProxiesModule: { createService: () => ({}) }
        })).toThrow("Invalid main runtime operation accessor proxies service");
    });
});
