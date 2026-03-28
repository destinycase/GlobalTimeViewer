import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-local-state-accessor-proxies.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeLocalStateAccessorProxiesModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeLocalStateAccessorProxies", ...Object.keys(globalPatches)];
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
        globalThis.window?.GTVMainRuntimeLocalStateAccessorProxies
        || globalThis.GTVMainRuntimeLocalStateAccessorProxies
    );
}

describe("GTV main runtime local state accessor proxies module", () => {
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

    it("delegates local state helper methods to runtime service", () => {
        const moduleApi = loadMainRuntimeLocalStateAccessorProxiesModule();
        const delegateService = {
            setMultiRangeState: vi.fn(() => undefined),
            getNextFixedTimeSeed: vi.fn(() => 7),
            setUiPreferencesState: vi.fn(() => undefined),
            getBaseTimeSnapshot: vi.fn(() => new Date("2026-03-29T00:00:00.000Z")),
            getFixedTimeSlotCountForGroupRef: vi.fn(() => 3),
            confirmRuntime: vi.fn(() => true),
            getActiveCopyFormatKeysForCurrentContext: vi.fn(() => ["time"]),
            getActiveTimePartKeysForCurrentContext: vi.fn(() => ["hour"]),
            getCurrentUiScalePercent: vi.fn(() => 110),
            getFixedTimeSlotCountForCurrentGroup: vi.fn(() => 2),
            getCurrentGroupFixedTimeShowLiveNow: vi.fn(() => true),
            shouldRunRealtimeTick: vi.fn(() => false),
            getTimeAdjustDayStepValue: vi.fn(() => 2)
        };
        const service = moduleApi.createService({
            getMainRuntimeLocalStateHelpersService: () => delegateService
        });

        service.setMultiRangeState({ multiRangeCount: 2 });
        service.setUiPreferencesState({ uiScale: 1.2 });
        expect(service.getNextFixedTimeSeed()).toBe(7);
        expect(service.getBaseTimeSnapshot().toISOString()).toBe("2026-03-29T00:00:00.000Z");
        expect(service.getFixedTimeSlotCountForGroupRef({ id: "g1" })).toBe(3);
        expect(service.confirmRuntime("ok")).toBe(true);
        expect(service.getActiveCopyFormatKeysForCurrentContext()).toEqual(["time"]);
        expect(service.getActiveTimePartKeysForCurrentContext()).toEqual(["hour"]);
        expect(service.getCurrentUiScalePercent()).toBe(110);
        expect(service.getFixedTimeSlotCountForCurrentGroup()).toBe(2);
        expect(service.getCurrentGroupFixedTimeShowLiveNow()).toBe(true);
        expect(service.shouldRunRealtimeTick()).toBe(false);
        expect(service.getTimeAdjustDayStepValue(1)).toBe(2);
        expect(delegateService.setMultiRangeState).toHaveBeenCalledWith({ multiRangeCount: 2 });
        expect(delegateService.setUiPreferencesState).toHaveBeenCalledWith({ uiScale: 1.2 });
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("uses fallback behavior when runtime service is unavailable", () => {
        const moduleApi = loadMainRuntimeLocalStateAccessorProxiesModule();
        let fixedTimeIdSeed = 10;
        let uiScale = 1;
        let currentTheme = "dark";
        let dayStartHour = 6;
        let nightStartHour = 18;
        const patchAppState = vi.fn();
        const syncCurrentLang = vi.fn();
        const service = moduleApi.createService({
            getPatchAppState: () => patchAppState,
            getFixedTimeIdSeed: () => fixedTimeIdSeed,
            setFixedTimeIdSeed: (next) => { fixedTimeIdSeed = next; },
            getUiScale: () => uiScale,
            setUiScale: (next) => { uiScale = next; },
            getCurrentTheme: () => currentTheme,
            setCurrentTheme: (next) => { currentTheme = next; },
            getDayStartHour: () => dayStartHour,
            setDayStartHour: (next) => { dayStartHour = next; },
            getNightStartHour: () => nightStartHour,
            setNightStartHour: (next) => { nightStartHour = next; },
            sanitizeDayNightHourValue: (value) => Number(value),
            normalizeDayNightRangeValues: () => ({ dayStartHour: 7, nightStartHour: 19 }),
            syncCurrentLang,
            getGlobalTimeState: () => new Date("2026-03-29T01:00:00.000Z"),
            getFixedTimeSlotCount: () => 4,
            getConfirm: () => false,
            getFormatProfileAllowedKeys: () => ["date"],
            getFormatProfileAllowedTimePartKeys: () => ["minute"],
            getPatchedActiveFormatProfileContextState: () => "fixed",
            getUiScaleState: () => 1.25,
            getCurrentGroup: () => ({ fixedTimeShowLiveNow: true }),
            getFixedTimeStateService: () => null,
            getIsRealtimeState: () => false,
            isFixedTimeTab: () => true,
            getTimeAdjustDayStepBySlotSnapshot: () => [1, 3]
        });

        service.setMultiRangeState({ multiRangeCount: 5 });
        expect(patchAppState).toHaveBeenCalledWith({ multiRangeCount: 5 });
        expect(service.getNextFixedTimeSeed()).toBe(11);

        service.setUiPreferencesState({
            uiScale: 1.1,
            currentTheme: "light",
            dayStartHour: 5,
            nightStartHour: 20,
            currentLang: "en"
        });
        expect(uiScale).toBe(1.1);
        expect(currentTheme).toBe("light");
        expect(dayStartHour).toBe(7);
        expect(nightStartHour).toBe(19);
        expect(syncCurrentLang).toHaveBeenCalledWith("en");
        expect(service.getBaseTimeSnapshot().toISOString()).toBe("2026-03-29T01:00:00.000Z");
        expect(service.getFixedTimeSlotCountForGroupRef({})).toBe(4);
        expect(service.confirmRuntime("ok")).toBe(false);
        expect(service.getActiveCopyFormatKeysForCurrentContext()).toEqual(["date"]);
        expect(service.getActiveTimePartKeysForCurrentContext()).toEqual(["minute"]);
        expect(service.getCurrentUiScalePercent()).toBe(125);
        expect(service.getFixedTimeSlotCountForCurrentGroup()).toBe(4);
        expect(service.getCurrentGroupFixedTimeShowLiveNow()).toBe(true);
        expect(service.shouldRunRealtimeTick()).toBe(true);
        expect(service.getTimeAdjustDayStepValue(1)).toBe(3);
    });
});
