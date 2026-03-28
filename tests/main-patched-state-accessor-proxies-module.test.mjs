import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-patched-state-accessor-proxies.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainPatchedStateAccessorProxiesModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainPatchedStateAccessorProxies", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainPatchedStateAccessorProxies || globalThis.GTVMainPatchedStateAccessorProxies;
}

describe("GTV main patched state accessor proxies module", () => {
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

    it("proxies app-state bridge and patched-state selector methods", () => {
        const moduleApi = loadMainPatchedStateAccessorProxiesModule();
        const bridgeService = {
            getPatchedAppStateSnapshot: vi.fn(() => ({ a: 1 })),
            patchAppState: vi.fn((next) => next),
            getPatchedStateValue: vi.fn((key, fallback) => fallback),
            getPatchedIntegerStateValue: vi.fn((_key, fallback = 0) => fallback),
            getPatchedBooleanStateValue: vi.fn((_key, fallback = false) => fallback),
            getPatchedStringStateValue: vi.fn((_key, fallback = "") => fallback),
            getPatchedArrayStateValue: vi.fn((_key, fallback = []) => fallback),
            getPatchedObjectStateValue: vi.fn((_key, fallback = {}) => fallback)
        };
        const selectorService = {
            getPatchedMainTabState: vi.fn(() => "live"),
            getPatchedSlotCountState: vi.fn(() => 2),
            setPatchedSlotCountState: vi.fn(() => undefined),
            getPatchedShowCopyFormatState: vi.fn(() => false),
            setPatchedShowCopyFormatState: vi.fn(() => undefined),
            getPatchedShowTimelineState: vi.fn(() => true),
            setPatchedShowTimelineState: vi.fn(() => undefined),
            getPatchedCurrentThemeState: vi.fn(() => "dark"),
            getPatchedDayStartHourState: vi.fn(() => 6),
            getPatchedNightStartHourState: vi.fn(() => 18),
            getPatchedCurrentLangState: vi.fn(() => "ko"),
            getPatchedDisplayFormatOrderState: vi.fn(() => []),
            getPatchedDisplayFormatEnabledState: vi.fn(() => ({})),
            getPatchedDisplayTimePartsEnabledState: vi.fn(() => ({})),
            getPatchedCopyFormatOrderState: vi.fn(() => []),
            getPatchedCopyFormatEnabledState: vi.fn(() => ({})),
            getPatchedCopyTimePartsEnabledState: vi.fn(() => ({})),
            getPatchedActiveFormatProfileContextState: vi.fn(() => "live"),
            getPatchedActiveGroupIdState: vi.fn(() => 0),
            getPatchedMultiRangeCountState: vi.fn(() => 1),
            getPatchedMultiRangesState: vi.fn(() => []),
            getPatchedMultiRangeCollapsedState: vi.fn(() => []),
            getPatchedTimeAdjustDayStepBySlotState: vi.fn(() => [1, 1]),
            getPatchedMultiRangeTitleState: vi.fn(() => "Range")
        };

        const service = moduleApi.createService({
            getMainAppStateBridgeService: () => bridgeService,
            getMainPatchedStateSelectorsService: () => selectorService
        });

        expect(service.getPatchedAppStateSnapshot()).toEqual({ a: 1 });
        expect(service.patchAppState({ x: 1 })).toEqual({ x: 1 });
        expect(service.getPatchedMainTabState()).toBe("live");
        service.setPatchedSlotCountState(3);
        expect(selectorService.setPatchedSlotCountState).toHaveBeenCalledWith(3);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors when delegated services are missing", () => {
        const moduleApi = loadMainPatchedStateAccessorProxiesModule();
        const service = moduleApi.createService({});

        expect(() => service.getPatchedAppStateSnapshot()).toThrow(
            "Missing required module API: mainAppStateBridgeService.getPatchedAppStateSnapshot"
        );
        expect(() => service.getPatchedMainTabState()).toThrow(
            "Missing required module API: mainPatchedStateSelectorsService.getPatchedMainTabState"
        );
    });
});
