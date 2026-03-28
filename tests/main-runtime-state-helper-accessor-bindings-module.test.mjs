import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-state-helper-accessor-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

const REQUIRED_METHODS = [
    "parseDateTimeParts",
    "getTimeAdjustDayStepBySlotSnapshot",
    "setTimeAdjustDayStepBySlotState",
    "updateTimeAdjustPanelSafely",
    "getUTCRef",
    "getCurrentGroup",
    "getCurrentGroupZones",
    "getCurrentGroupBaseTimezoneId",
    "getBaseTimezoneRef",
    "ensureBaseTimezoneSelection",
    "formatUtcOffsetLabel",
    "normalizeCustomAbbr",
    "getCurrentMultiRangeStateSnapshot",
    "getGroupsStateSnapshot",
    "getActiveGroupIdByMainTabStateSnapshot",
    "patchPrimaryState",
    "setCurrentMainTabState",
    "setActiveGroupIdState",
    "setActiveGroupIdByMainTabState",
    "getActiveGroupNameSnapshot"
];

function loadMainRuntimeStateHelperAccessorBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeStateHelperAccessorBindings", ...Object.keys(globalPatches)];
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
        globalThis.window?.GTVMainRuntimeStateHelperAccessorBindings
        || globalThis.GTVMainRuntimeStateHelperAccessorBindings
    );
}

function createProxyService() {
    return REQUIRED_METHODS.reduce((acc, methodName) => {
        acc[methodName] = vi.fn(() => undefined);
        return acc;
    }, {});
}

describe("GTV main runtime state helper accessor bindings module", () => {
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

    it("creates runtime state helper accessor bindings from delegated module", () => {
        const moduleApi = loadMainRuntimeStateHelperAccessorBindingsModule();
        const delegateService = createProxyService();
        const runtimeStateHelperAccessorProxiesModule = {
            createService: vi.fn(() => delegateService)
        };

        const service = moduleApi.createService({
            runtimeStateHelperAccessorProxiesModule,
            getParseDateTimePartsViaRuntimeStateHelpers: () => null
        });

        expect(runtimeStateHelperAccessorProxiesModule.createService).toHaveBeenCalledWith({
            getParseDateTimePartsViaRuntimeStateHelpers: expect.any(Function)
        });
        expect(service.getUTCRef).toBe(delegateService.getUTCRef);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing module api and invalid result", () => {
        const moduleApi = loadMainRuntimeStateHelperAccessorBindingsModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainRuntimeStateHelperAccessorProxies.createService"
        );
        expect(() => moduleApi.createService({
            runtimeStateHelperAccessorProxiesModule: { createService: () => null }
        })).toThrow("Invalid main runtime state helper accessor proxies service");
        expect(() => moduleApi.createService({
            runtimeStateHelperAccessorProxiesModule: { createService: () => ({}) }
        })).toThrow("Invalid main runtime state helper accessor proxies service");
    });
});
