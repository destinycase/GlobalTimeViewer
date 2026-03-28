import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-state-domain-wrapper-bridge-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainStateDomainWrapperBridgeBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainStateDomainWrapperBridgeBindings", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainStateDomainWrapperBridgeBindings || globalThis.GTVMainStateDomainWrapperBridgeBindings;
}

describe("GTV main state domain wrapper bridge bindings module", () => {
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

    it("creates state domain wrapper bridge bindings from delegated module", () => {
        const moduleApi = loadMainStateDomainWrapperBridgeBindingsModule();
        const wrapperBridgeService = {
            getDefaultFixedTimeName: vi.fn(() => "Slot 1"),
            sanitizeFixedTimeSlotCount: vi.fn((value) => value)
        };
        const stateDomainWrapperBridgeModule = {
            createService: vi.fn(() => wrapperBridgeService)
        };

        const service = moduleApi.createService({
            stateDomainWrapperBridgeModule,
            defaultFixedTimeValue: "1970-01-01 00:00:00"
        });

        expect(stateDomainWrapperBridgeModule.createService).toHaveBeenCalledWith({
            defaultFixedTimeValue: "1970-01-01 00:00:00"
        });
        expect(service.mainStateDomainWrapperBridgeService).toBe(wrapperBridgeService);
        expect(service.getDefaultFixedTimeName()).toBe("Slot 1");
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing module api and invalid result", () => {
        const moduleApi = loadMainStateDomainWrapperBridgeBindingsModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainStateDomainWrapperBridge.createService"
        );
        expect(() => moduleApi.createService({
            stateDomainWrapperBridgeModule: { createService: () => null }
        })).toThrow("Invalid main state domain wrapper bridge service");
    });
});
