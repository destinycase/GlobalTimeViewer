import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-state-helpers.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeStateHelpersModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeStateHelpers", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainRuntimeStateHelpers || globalThis.GTVMainRuntimeStateHelpers;
}

describe("GTV main runtime state helpers module", () => {
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

    it("delegates parse/group/timezone helpers and keeps UTC formatting", () => {
        const moduleApi = loadMainRuntimeStateHelpersModule();
        const parseSpy = vi.fn(() => [2026, 3, 28, 9, 30, 0]);
        const groupContextStateService = {
            getCurrentGroup: vi.fn(() => ({ id: 1, name: "G1" })),
            getCurrentGroupZones: vi.fn(() => [{ id: "utc", zone: "UTC" }]),
            getCurrentGroupBaseTimezoneId: vi.fn(() => "utc"),
            getBaseTimezoneRef: vi.fn(() => ({ id: "utc", zone: "UTC" })),
            ensureBaseTimezoneSelection: vi.fn(() => ({ id: "utc", zone: "UTC" }))
        };
        const timezoneSearchService = {
            formatUtcOffsetLabel: vi.fn(() => "UTC+09:00")
        };

        const service = moduleApi.createService({
            getMainSharedUtilsService: () => ({ parseDateTimeParts: parseSpy }),
            getGroupContextStateService: () => groupContextStateService,
            getTimezoneSearchService: () => timezoneSearchService,
            getTranslator: () => ((key) => (key === "label_custom" ? "Custom" : key))
        });

        expect(service.parseDateTimeParts("2026-03-28 09:30:00", "datetime")).toEqual([2026, 3, 28, 9, 30, 0]);
        expect(service.getCurrentGroup()).toEqual({ id: 1, name: "G1" });
        expect(service.getCurrentGroupZones()).toEqual([{ id: "utc", zone: "UTC" }]);
        expect(service.getCurrentGroupBaseTimezoneId()).toBe("utc");
        expect(service.getBaseTimezoneRef()).toEqual({ id: "utc", zone: "UTC" });
        expect(service.ensureBaseTimezoneSelection()).toEqual({ id: "utc", zone: "UTC" });
        expect(service.getUTCRef()).toEqual({ id: "utc", type: "standard", zone: "UTC", name: "utc_name" });
        expect(service.formatUtcOffsetLabel(540)).toBe("UTC+09:00");
        expect(service.normalizeCustomAbbr("  z9  ")).toBe("Z9");
        expect(service.normalizeCustomAbbr("")).toBe("Custom");
    });

    it("uses patched state selectors and patch bridge for snapshots and state writes", () => {
        const moduleApi = loadMainRuntimeStateHelpersModule();
        const patchAppState = vi.fn();
        const updateTimeAdjustPanel = vi.fn(() => "ok");
        const service = moduleApi.createService({
            getPatchedTimeAdjustDayStepBySlotState: () => [1, 2],
            getPatchAppState: () => patchAppState,
            getUpdateTimeAdjustPanel: () => updateTimeAdjustPanel,
            getPatchedMultiRangeCountState: () => 2,
            getPatchedMultiRangesState: () => [{ startMs: 1, endMs: 2 }],
            getPatchedMultiRangeCollapsedState: () => [false],
            getPatchedArrayStateValue: (_key, fallback) => fallback,
            getMultiRangeStartEditEnabledState: () => [true],
            getMultiRangeEndEditEnabledState: () => [false],
            getPatchedMultiRangeTitleState: () => "R",
            getPersistenceState: () => ({ groups: [{ name: "Persisted" }], activeGroupIdByMainTab: { live: 0 } }),
            getGroupsState: () => [{ name: "Fallback" }],
            getActiveGroupIdByMainTabState: () => ({ fixed: 1 }),
            getPatchedActiveGroupIdState: () => 0
        });

        expect(service.getTimeAdjustDayStepBySlotSnapshot()).toEqual([1, 2]);
        service.setTimeAdjustDayStepBySlotState([3, 4]);
        expect(patchAppState).toHaveBeenCalledWith({ timeAdjustDayStepBySlot: [3, 4] });
        expect(service.updateTimeAdjustPanelSafely()).toBe("ok");

        expect(service.getCurrentMultiRangeStateSnapshot()).toEqual({
            multiRangeCount: 2,
            multiRanges: [{ startMs: 1, endMs: 2 }],
            multiRangeCollapsed: [false],
            multiRangeStartEditEnabled: [true],
            multiRangeEndEditEnabled: [false],
            multiRangeTitle: "R"
        });
        expect(service.getGroupsStateSnapshot()).toEqual([{ name: "Persisted" }]);
        expect(service.getActiveGroupIdByMainTabStateSnapshot()).toEqual({ live: 0 });
        expect(service.getActiveGroupNameSnapshot()).toBe("Persisted");

        service.patchPrimaryState({ currentMainTab: "fixed" });
        service.setCurrentMainTabState("multi");
        service.setActiveGroupIdState(2);
        service.setActiveGroupIdByMainTabState({ live: 2 });
        expect(patchAppState).toHaveBeenCalledWith({ currentMainTab: "fixed" });
        expect(patchAppState).toHaveBeenCalledWith({ currentMainTab: "multi" });
        expect(patchAppState).toHaveBeenCalledWith({ activeGroupId: 2 });
        expect(patchAppState).toHaveBeenCalledWith({ activeGroupIdByMainTab: { live: 2 } });
    });

    it("falls back to built-in UTC offset formatting without timezone search service", () => {
        const moduleApi = loadMainRuntimeStateHelpersModule();
        const service = moduleApi.createService();

        expect(service.formatUtcOffsetLabel(0)).toBe("UTC+00:00");
        expect(service.formatUtcOffsetLabel(-330)).toBe("UTC-05:30");
        expect(service.formatUtcOffsetLabel(570)).toBe("UTC+09:30");
    });
});
