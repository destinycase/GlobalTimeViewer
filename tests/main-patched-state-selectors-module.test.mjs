import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-patched-state-selectors.js");

function loadMainPatchedStateSelectorsModule() {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = { window: {}, globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/main-patched-state-selectors.js" });
    return sandbox.window.GTVMainPatchedStateSelectors
        || sandbox.GTVMainPatchedStateSelectors
        || sandbox.globalThis.GTVMainPatchedStateSelectors;
}

describe("GTV main patched state selectors module", () => {
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
