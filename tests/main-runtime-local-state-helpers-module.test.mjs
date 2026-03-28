import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-local-state-helpers.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeLocalStateHelpersModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeLocalStateHelpers", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainRuntimeLocalStateHelpers || globalThis.GTVMainRuntimeLocalStateHelpers;
}

describe("GTV main runtime local state helpers module", () => {
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

    it("patches state and increments fixed time seed", () => {
        const moduleApi = loadMainRuntimeLocalStateHelpersModule();
        const patchAppState = vi.fn();
        let seed = 7;
        const service = moduleApi.createService({
            getPatchAppState: () => patchAppState,
            getFixedTimeIdSeed: () => seed,
            setFixedTimeIdSeed: (next) => { seed = next; }
        });

        service.setMultiRangeState({ multiRangeCount: 2 });
        expect(patchAppState).toHaveBeenCalledWith({ multiRangeCount: 2 });

        expect(service.getNextFixedTimeSeed()).toBe(8);
        expect(seed).toBe(8);
    });

    it("updates ui preferences with day-night normalization and language sync", () => {
        const moduleApi = loadMainRuntimeLocalStateHelpersModule();
        let uiScale = 1;
        let currentTheme = "dark";
        let dayStartHour = 6;
        let nightStartHour = 18;
        const syncCurrentLang = vi.fn();
        const service = moduleApi.createService({
            getUiScale: () => uiScale,
            setUiScale: (next) => { uiScale = next; },
            getCurrentTheme: () => currentTheme,
            setCurrentTheme: (next) => { currentTheme = next; },
            getDayStartHour: () => dayStartHour,
            setDayStartHour: (next) => { dayStartHour = next; },
            getNightStartHour: () => nightStartHour,
            setNightStartHour: (next) => { nightStartHour = next; },
            sanitizeDayNightHourValue: (value) => Number(value),
            normalizeDayNightRangeValues: (_day, _night) => ({ dayStartHour: 7, nightStartHour: 19 }),
            syncCurrentLang
        });

        service.setUiPreferencesState({
            uiScale: 1.25,
            currentTheme: "light",
            dayStartHour: 5,
            nightStartHour: 20,
            currentLang: "en"
        });

        expect(uiScale).toBe(1.25);
        expect(currentTheme).toBe("light");
        expect(dayStartHour).toBe(7);
        expect(nightStartHour).toBe(19);
        expect(syncCurrentLang).toHaveBeenCalledWith("en");
    });

    it("calculates active keys and realtime tick conditions", () => {
        const moduleApi = loadMainRuntimeLocalStateHelpersModule();
        const fixedTimeStateService = {
            getCurrentGroupFixedTimeShowLiveNow: vi.fn(() => true)
        };
        const service = moduleApi.createService({
            getGlobalTimeState: () => new Date("2026-03-28T00:00:00.000Z"),
            getFixedTimeSlotCount: () => 3,
            getConfirm: () => true,
            getFormatProfileAllowedKeys: () => ["time", "date"],
            getFormatProfileAllowedTimePartKeys: () => ["hour", "minute"],
            getPatchedActiveFormatProfileContextState: () => "fixed",
            getUiScaleState: () => 1.1,
            getCurrentGroup: () => ({ fixedTimeShowLiveNow: false }),
            getFixedTimeStateService: () => fixedTimeStateService,
            getIsRealtimeState: () => false,
            isFixedTimeTab: () => true,
            getTimeAdjustDayStepBySlotSnapshot: () => [1, 2]
        });

        expect(service.getBaseTimeSnapshot().toISOString()).toBe("2026-03-28T00:00:00.000Z");
        expect(service.getFixedTimeSlotCountForGroupRef({})).toBe(3);
        expect(service.confirmRuntime("ok")).toBe(true);
        expect(service.getActiveCopyFormatKeysForCurrentContext()).toEqual(["time", "date"]);
        expect(service.getActiveTimePartKeysForCurrentContext()).toEqual(["hour", "minute"]);
        expect(service.getCurrentUiScalePercent()).toBe(110);
        expect(service.getFixedTimeSlotCountForCurrentGroup()).toBe(3);
        expect(service.getCurrentGroupFixedTimeShowLiveNow()).toBe(true);
        expect(service.shouldRunRealtimeTick()).toBe(true);
        expect(service.getTimeAdjustDayStepValue(1)).toBe(2);
    });
});
