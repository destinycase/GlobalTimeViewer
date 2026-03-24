import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-patched-state-selectors.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainPatchedStateSelectorsModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainPatchedStateSelectors", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainPatchedStateSelectors || globalThis.GTVMainPatchedStateSelectors;
}

describe("GTV main patched state selectors module", () => {
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
    it("reads patched values with fallback behavior and normalizes number bounds", () => {
        const moduleApi = loadMainPatchedStateSelectorsModule();
        const service = moduleApi.createService({
            getPatchedStateValue: (_key, fallbackValue) => fallbackValue,
            getPatchedIntegerStateValue: (key, fallbackValue) => {
                if (key === "slotCount") return 0;
                if (key === "activeGroupId") return -3;
                if (key === "multiRangeCount") return -1;
                return fallbackValue;
            },
            getPatchedBooleanStateValue: (_key, fallbackValue) => fallbackValue,
            getPatchedStringStateValue: (key, fallbackValue) => {
                if (key === "currentMainTab") return "fixed";
                if (key === "currentTheme") return "light";
                if (key === "currentLang") return "en";
                return fallbackValue;
            },
            getPatchedArrayStateValue: (_key, fallbackValue) => fallbackValue,
            getPatchedObjectStateValue: (_key, fallbackValue) => fallbackValue,
            getFallbackState: () => ({
                currentMainTab: "live",
                slotCount: 2,
                showCopyFormat: false,
                showTimeline: false,
                currentTheme: "dark",
                currentLang: "ko",
                activeGroupId: 1,
                multiRangeCount: 2,
                multiRangeTitle: "Range"
            })
        });

        expect(service.getPatchedMainTabState()).toBe("fixed");
        expect(service.getPatchedSlotCountState()).toBe(1);
        expect(service.getPatchedActiveGroupIdState()).toBe(0);
        expect(service.getPatchedMultiRangeCountState()).toBe(1);
        expect(service.getPatchedCurrentThemeState()).toBe("light");
        expect(service.getPatchedCurrentLangState()).toBe("en");
    });

    it("writes patched state using normalized payloads", () => {
        const moduleApi = loadMainPatchedStateSelectorsModule();
        const patches = [];
        const service = moduleApi.createService({
            getPatchedStateValue: (_key, fallbackValue) => fallbackValue,
            getPatchedIntegerStateValue: (_key, fallbackValue) => fallbackValue,
            getPatchedBooleanStateValue: (_key, fallbackValue) => fallbackValue,
            getPatchedStringStateValue: (_key, fallbackValue) => fallbackValue,
            getPatchedArrayStateValue: (_key, fallbackValue) => fallbackValue,
            getPatchedObjectStateValue: (_key, fallbackValue) => fallbackValue,
            patchAppState: (next) => { patches.push(next); },
            getFallbackState: () => ({})
        });

        service.setPatchedSlotCountState("2.9");
        service.setPatchedSlotCountState("invalid");
        service.setPatchedShowCopyFormatState(1);
        service.setPatchedShowTimelineState(0);

        expect(patches).toEqual([
            { slotCount: 2 },
            { showCopyFormat: true },
            { showTimeline: false }
        ]);
    });

    it("uses default dependency fallbacks when deps are missing", () => {
        const moduleApi = loadMainPatchedStateSelectorsModule();
        const service = moduleApi.createService(null);

        expect(service.getPatchedMainTabState()).toBe("live");
        expect(service.getPatchedSlotCountState()).toBe(1);
        expect(service.getPatchedShowCopyFormatState()).toBe(false);
        expect(service.getPatchedShowTimelineState()).toBe(false);
        expect(service.getPatchedCurrentThemeState()).toBe("dark");
        expect(service.getPatchedCurrentLangState()).toBe("ko");
        expect(service.getPatchedDisplayFormatOrderState()).toEqual([]);
        expect(service.getPatchedDisplayFormatEnabledState()).toEqual({});
        expect(service.getPatchedCopyFormatEnabledState()).toEqual({});
        expect(service.getPatchedActiveGroupIdState()).toBe(0);
        expect(service.getPatchedMultiRangeCountState()).toBe(1);
        expect(service.getPatchedMultiRangesState()).toEqual([]);
        expect(service.getPatchedTimeAdjustDayStepBySlotState()).toEqual([]);
        expect(service.getPatchedMultiRangeTitleState()).toBe("");

        expect(() => service.setPatchedSlotCountState("invalid")).not.toThrow();
        expect(() => service.setPatchedShowCopyFormatState(true)).not.toThrow();
        expect(() => service.setPatchedShowTimelineState(true)).not.toThrow();
    });
});
