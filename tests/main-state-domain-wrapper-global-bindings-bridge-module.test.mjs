import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-state-domain-wrapper-global-bindings-bridge.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainStateDomainWrapperGlobalBindingsBridgeModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainStateDomainWrapperGlobalBindingsBridge", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainStateDomainWrapperGlobalBindingsBridge
        || globalThis.GTVMainStateDomainWrapperGlobalBindingsBridge;
}

describe("GTV main state domain wrapper global bindings bridge module", () => {
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

    it("creates global bindings bridge service from delegated module", () => {
        const moduleApi = loadMainStateDomainWrapperGlobalBindingsBridgeModule();
        const globalBindingsService = {
            applyBindings: vi.fn(() => 2)
        };
        const stateDomainWrapperGlobalBindingsModule = {
            createService: vi.fn(() => globalBindingsService)
        };

        const service = moduleApi.createService({
            stateDomainWrapperGlobalBindingsModule,
            getGlobalRoot: () => ({})
        });

        expect(stateDomainWrapperGlobalBindingsModule.createService).toHaveBeenCalledWith({
            getGlobalRoot: expect.any(Function)
        });
        expect(service.mainStateDomainWrapperGlobalBindingsService).toBe(globalBindingsService);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing module api and invalid result", () => {
        const moduleApi = loadMainStateDomainWrapperGlobalBindingsBridgeModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainStateDomainWrapperGlobalBindings.createService"
        );
        expect(() => moduleApi.createService({
            stateDomainWrapperGlobalBindingsModule: { createService: () => null }
        })).toThrow("Invalid main state domain wrapper global bindings service");
    });
});
