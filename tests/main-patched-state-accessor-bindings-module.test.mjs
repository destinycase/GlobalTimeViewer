import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-patched-state-accessor-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

const REQUIRED_METHODS = [
    "getPatchedAppStateSnapshot",
    "patchAppState",
    "getPatchedStateValue",
    "getPatchedIntegerStateValue",
    "getPatchedBooleanStateValue",
    "getPatchedStringStateValue",
    "getPatchedArrayStateValue",
    "getPatchedObjectStateValue",
    "getPatchedMainTabState",
    "getPatchedSlotCountState",
    "setPatchedSlotCountState",
    "getPatchedShowCopyFormatState",
    "setPatchedShowCopyFormatState",
    "getPatchedShowTimelineState",
    "setPatchedShowTimelineState",
    "getPatchedCurrentThemeState",
    "getPatchedDayStartHourState",
    "getPatchedNightStartHourState",
    "getPatchedCurrentLangState",
    "getPatchedDisplayFormatOrderState",
    "getPatchedDisplayFormatEnabledState",
    "getPatchedDisplayTimePartsEnabledState",
    "getPatchedCopyFormatOrderState",
    "getPatchedCopyFormatEnabledState",
    "getPatchedCopyTimePartsEnabledState",
    "getPatchedActiveFormatProfileContextState",
    "getPatchedActiveGroupIdState",
    "getPatchedMultiRangeCountState",
    "getPatchedMultiRangesState",
    "getPatchedMultiRangeCollapsedState",
    "getPatchedTimeAdjustDayStepBySlotState",
    "getPatchedMultiRangeTitleState"
];

function loadMainPatchedStateAccessorBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainPatchedStateAccessorBindings", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainPatchedStateAccessorBindings || globalThis.GTVMainPatchedStateAccessorBindings;
}

function createProxyService() {
    return REQUIRED_METHODS.reduce((acc, methodName) => {
        acc[methodName] = vi.fn(() => undefined);
        return acc;
    }, {});
}

describe("GTV main patched state accessor bindings module", () => {
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

    it("creates patched state accessor bindings from delegated module", () => {
        const moduleApi = loadMainPatchedStateAccessorBindingsModule();
        const delegateService = createProxyService();
        const patchedStateAccessorProxiesModule = {
            createService: vi.fn(() => delegateService)
        };

        const service = moduleApi.createService({
            patchedStateAccessorProxiesModule,
            getMainAppStateBridgeService: () => ({}),
            getMainPatchedStateSelectorsService: () => ({})
        });

        expect(patchedStateAccessorProxiesModule.createService).toHaveBeenCalledWith({
            getMainAppStateBridgeService: expect.any(Function),
            getMainPatchedStateSelectorsService: expect.any(Function)
        });
        expect(service.getPatchedMainTabState).toBe(delegateService.getPatchedMainTabState);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing module api and invalid result", () => {
        const moduleApi = loadMainPatchedStateAccessorBindingsModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainPatchedStateAccessorProxies.createService"
        );
        expect(() => moduleApi.createService({
            patchedStateAccessorProxiesModule: { createService: () => null }
        })).toThrow("Invalid main patched state accessor proxies service");
        expect(() => moduleApi.createService({
            patchedStateAccessorProxiesModule: { createService: () => ({}) }
        })).toThrow("Invalid main patched state accessor proxies service");
    });
});
