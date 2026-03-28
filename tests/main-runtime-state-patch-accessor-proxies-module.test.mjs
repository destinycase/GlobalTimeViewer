import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-state-patch-accessor-proxies.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeStatePatchAccessorProxiesModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeStatePatchAccessorProxies", ...Object.keys(globalPatches)];
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
        globalThis.window?.GTVMainRuntimeStatePatchAccessorProxies
        || globalThis.GTVMainRuntimeStatePatchAccessorProxies
    );
}

describe("GTV main runtime state patch accessor proxies module", () => {
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

    it("delegates to direct patch and patched fallback services when available", () => {
        const moduleApi = loadMainRuntimeStatePatchAccessorProxiesModule();
        const applyDirectStatePatch = vi.fn(() => "patched");
        const buildPatchedStateFallbackSnapshot = vi.fn(() => ({ from: "fallback-service" }));
        const service = moduleApi.createService({
            getMainDirectStatePatchService: () => ({ applyDirectStatePatch }),
            getMainRuntimePatchedStateFallbackService: () => ({ buildPatchedStateFallbackSnapshot })
        });

        expect(service.applyDirectStatePatch({ a: 1 })).toBe("patched");
        expect(applyDirectStatePatch).toHaveBeenCalledWith({ a: 1 });
        expect(service.buildPatchedStateFallbackSnapshot()).toEqual({ from: "fallback-service" });
        expect(buildPatchedStateFallbackSnapshot).toHaveBeenCalledTimes(1);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("applies local fallback patching and fallback snapshot composition", () => {
        const moduleApi = loadMainRuntimeStatePatchAccessorProxiesModule();
        let dayStartHour = 5;
        let nightStartHour = 21;
        let showTimeline = false;
        let customValue = 0;
        let isRealtimeValue = true;
        const service = moduleApi.createService({
            getDirectStateSetters: () => ({
                showTimeline: (next) => { showTimeline = next; },
                customValue: (next) => { customValue = Number(next) || 0; }
            }),
            getNormalizeDayNightRangeValues: () => (nextDay, nextNight) => ({
                dayStartHour: Number(nextDay) + 1,
                nightStartHour: Number(nextNight) + 1
            }),
            getDayStartHour: () => dayStartHour,
            setDayStartHour: (next) => { dayStartHour = next; },
            getNightStartHour: () => nightStartHour,
            setNightStartHour: (next) => { nightStartHour = next; },
            getSetIsRealtimeState: () => (next) => { isRealtimeValue = !!next; },
            getRuntimeCurrentLangValue: () => "ko",
            getCurrentMainTab: () => "fixed-time",
            getSlotCount: () => 2,
            getShowCopyFormat: () => true,
            getShowTimeline: () => showTimeline,
            getCurrentTheme: () => "dark",
            getDisplayFormatOrder: () => ["timezone", "time_main"],
            getDisplayFormatEnabled: () => ({ timezone: true }),
            getDisplayTimePartsEnabled: () => ({ hour: true }),
            getCopyFormatOrder: () => ["timezone"],
            getCopyFormatEnabled: () => ({ timezone: true }),
            getCopyTimePartsEnabled: () => ({ hour: true }),
            getActiveFormatProfileContext: () => "fixed-time",
            getActiveGroupId: () => 3,
            getMultiRangeCount: () => 1,
            getMultiRanges: () => [{ start: "09:00", end: "10:00" }],
            getMultiRangeCollapsed: () => [false],
            getTimeAdjustDayStepBySlot: () => [1, 1],
            getMultiRangeTitle: () => "Range"
        });

        service.applyDirectStatePatch({
            showTimeline: "yes",
            customValue: 7,
            dayStartHour: 8,
            isRealtime: 0
        });

        expect(showTimeline).toBe(true);
        expect(customValue).toBe(7);
        expect(dayStartHour).toBe(6);
        expect(nightStartHour).toBe(22);
        expect(isRealtimeValue).toBe(false);

        const snapshot = service.buildPatchedStateFallbackSnapshot();
        expect(snapshot.currentMainTab).toBe("fixed-time");
        expect(snapshot.slotCount).toBe(2);
        expect(snapshot.showTimeline).toBe(true);
        expect(snapshot.currentLang).toBe("ko");
        expect(snapshot.dayStartHour).toBe(7);
        expect(snapshot.nightStartHour).toBe(23);
    });
});
