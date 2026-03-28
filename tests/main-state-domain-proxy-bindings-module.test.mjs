import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-state-domain-proxy-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainStateDomainProxyBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainStateDomainProxyBindings", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainStateDomainProxyBindings || globalThis.GTVMainStateDomainProxyBindings;
}

describe("GTV main state domain proxy bindings module", () => {
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

    it("creates state domain proxy bindings from delegated module", () => {
        const moduleApi = loadMainStateDomainProxyBindingsModule();
        const expectedService = { getFixedTimes: vi.fn(() => []) };
        const stateDomainProxiesModule = {
            createService: vi.fn(() => expectedService)
        };

        const service = moduleApi.createService({
            stateDomainProxiesModule,
            fixedTimeSlotUtilsService: {},
            multiRangeStateService: {},
            fixedTimeStateService: {},
            uiPreferencesStateService: {},
            groupContextStateService: {},
            mainAppStateBridgeService: {},
            getPatchedMainTabState: () => "live",
            getCurrentGroup: () => null,
            defaultFixedTimeValue: "1970-01-01 00:00:00"
        });

        expect(stateDomainProxiesModule.createService).toHaveBeenCalledWith({
            fixedTimeSlotUtilsService: {},
            multiRangeStateService: {},
            fixedTimeStateService: {},
            uiPreferencesStateService: {},
            groupContextStateService: {},
            mainAppStateBridgeService: {},
            getPatchedMainTabState: expect.any(Function),
            getCurrentGroup: expect.any(Function),
            defaultFixedTimeValue: "1970-01-01 00:00:00"
        });
        expect(service.mainStateDomainProxiesService).toBe(expectedService);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing module api or invalid result", () => {
        const moduleApi = loadMainStateDomainProxyBindingsModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainStateDomainProxies.createService"
        );
        expect(() => moduleApi.createService({
            stateDomainProxiesModule: { createService: () => null }
        })).toThrow("Invalid main state domain proxies service");
    });
});
