import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-patched-state-fallback.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimePatchedStateFallbackModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimePatchedStateFallback", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainRuntimePatchedStateFallback || globalThis.GTVMainRuntimePatchedStateFallback;
}

describe("GTV main runtime patched-state fallback module", () => {
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

    it("builds patched fallback snapshot with normalized day-night range", () => {
        const moduleApi = loadMainRuntimePatchedStateFallbackModule();
        const service = moduleApi.createService({
            getNormalizeDayNightRangeValues: () => ({ dayStartHour: 7, nightStartHour: 19 }),
            getRuntimeCurrentLangValue: () => "ko",
            getCurrentMainTab: () => "live",
            getSlotCount: () => 2,
            getShowCopyFormat: () => true,
            getShowTimeline: () => false,
            getCurrentTheme: () => "light",
            getDayStartHour: () => 6,
            getNightStartHour: () => 18,
            getDisplayFormatOrder: () => ["time"],
            getDisplayFormatEnabled: () => ({ time: true }),
            getDisplayTimePartsEnabled: () => ({ second: false }),
            getCopyFormatOrder: () => ["time"],
            getCopyFormatEnabled: () => ({ time: true }),
            getCopyTimePartsEnabled: () => ({ second: true }),
            getActiveFormatProfileContext: () => "fixed",
            getActiveGroupId: () => 3,
            getMultiRangeCount: () => 1,
            getMultiRanges: () => [{ startMs: 1, endMs: 2 }],
            getMultiRangeCollapsed: () => [false],
            getTimeAdjustDayStepBySlot: () => [1, 2],
            getMultiRangeTitle: () => "Range A"
        });

        expect(service.buildPatchedStateFallbackSnapshot()).toEqual({
            currentMainTab: "live",
            slotCount: 2,
            showCopyFormat: true,
            showTimeline: false,
            currentTheme: "light",
            dayStartHour: 7,
            nightStartHour: 19,
            currentLang: "ko",
            displayFormatOrder: ["time"],
            displayFormatEnabled: { time: true },
            displayTimePartsEnabled: { second: false },
            copyFormatOrder: ["time"],
            copyFormatEnabled: { time: true },
            copyTimePartsEnabled: { second: true },
            activeFormatProfileContext: "fixed",
            activeGroupId: 3,
            multiRangeCount: 1,
            multiRanges: [{ startMs: 1, endMs: 2 }],
            multiRangeCollapsed: [false],
            timeAdjustDayStepBySlot: [1, 2],
            multiRangeTitle: "Range A"
        });
    });
});
