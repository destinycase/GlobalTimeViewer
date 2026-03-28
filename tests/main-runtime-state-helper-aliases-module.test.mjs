import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-state-helper-aliases.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeStateHelperAliasesModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeStateHelperAliases", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainRuntimeStateHelperAliases || globalThis.GTVMainRuntimeStateHelperAliases;
}

describe("GTV main runtime state helper aliases module", () => {
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

    it("maps runtime state helper service methods to stable alias names", () => {
        const moduleApi = loadMainRuntimeStateHelperAliasesModule();
        const runtimeStateHelpersService = {
            parseDateTimeParts: vi.fn(),
            getTimeAdjustDayStepBySlotSnapshot: vi.fn(),
            setTimeAdjustDayStepBySlotState: vi.fn(),
            updateTimeAdjustPanelSafely: vi.fn(),
            getUTCRef: vi.fn(),
            getCurrentGroup: vi.fn(),
            getCurrentGroupZones: vi.fn(),
            getCurrentGroupBaseTimezoneId: vi.fn(),
            getBaseTimezoneRef: vi.fn(),
            ensureBaseTimezoneSelection: vi.fn(),
            formatUtcOffsetLabel: vi.fn(),
            normalizeCustomAbbr: vi.fn(),
            getCurrentMultiRangeStateSnapshot: vi.fn(),
            getGroupsStateSnapshot: vi.fn(),
            getActiveGroupIdByMainTabStateSnapshot: vi.fn(),
            patchPrimaryState: vi.fn(),
            setCurrentMainTabState: vi.fn(),
            setActiveGroupIdState: vi.fn(),
            setActiveGroupIdByMainTabState: vi.fn(),
            getActiveGroupNameSnapshot: vi.fn()
        };
        const runtimeStateHelpersModule = {
            createService: vi.fn(() => runtimeStateHelpersService)
        };
        const deps = {
            runtimeStateHelpersModule,
            getMainSharedUtilsService: () => ({}),
            getPatchedTimeAdjustDayStepBySlotState: () => [],
            getPatchAppState: () => (() => undefined),
            getUpdateTimeAdjustPanel: () => (() => undefined),
            getTranslator: () => (() => "x"),
            getGroupContextStateService: () => ({}),
            getTimezoneSearchService: () => ({}),
            getPatchedMultiRangeCountState: () => 1,
            getPatchedMultiRangesState: () => [],
            getPatchedMultiRangeCollapsedState: () => [],
            getPatchedArrayStateValue: () => [],
            getMultiRangeStartEditEnabledState: () => [],
            getMultiRangeEndEditEnabledState: () => [],
            getPatchedMultiRangeTitleState: () => "",
            getPersistenceState: () => ({}),
            getGroupsState: () => [],
            getActiveGroupIdByMainTabState: () => ({}),
            getPatchedActiveGroupIdState: () => 0
        };

        const service = moduleApi.createService(deps);

        expect(runtimeStateHelpersModule.createService).toHaveBeenCalledWith({
            getMainSharedUtilsService: deps.getMainSharedUtilsService,
            getPatchedTimeAdjustDayStepBySlotState: deps.getPatchedTimeAdjustDayStepBySlotState,
            getPatchAppState: deps.getPatchAppState,
            getUpdateTimeAdjustPanel: deps.getUpdateTimeAdjustPanel,
            getTranslator: deps.getTranslator,
            getGroupContextStateService: deps.getGroupContextStateService,
            getTimezoneSearchService: deps.getTimezoneSearchService,
            getPatchedMultiRangeCountState: deps.getPatchedMultiRangeCountState,
            getPatchedMultiRangesState: deps.getPatchedMultiRangesState,
            getPatchedMultiRangeCollapsedState: deps.getPatchedMultiRangeCollapsedState,
            getPatchedArrayStateValue: deps.getPatchedArrayStateValue,
            getMultiRangeStartEditEnabledState: deps.getMultiRangeStartEditEnabledState,
            getMultiRangeEndEditEnabledState: deps.getMultiRangeEndEditEnabledState,
            getPatchedMultiRangeTitleState: deps.getPatchedMultiRangeTitleState,
            getPersistenceState: deps.getPersistenceState,
            getGroupsState: deps.getGroupsState,
            getActiveGroupIdByMainTabState: deps.getActiveGroupIdByMainTabState,
            getPatchedActiveGroupIdState: deps.getPatchedActiveGroupIdState
        });
        expect(service.parseDateTimePartsViaRuntimeStateHelpers).toBe(runtimeStateHelpersService.parseDateTimeParts);
        expect(service.getCurrentGroupViaRuntimeStateHelpers).toBe(runtimeStateHelpersService.getCurrentGroup);
        expect(service.patchPrimaryStateViaRuntimeStateHelpers).toBe(runtimeStateHelpersService.patchPrimaryState);
    });

    it("throws explicit errors for missing runtime state helper dependencies", () => {
        const moduleApi = loadMainRuntimeStateHelperAliasesModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainRuntimeStateHelpers.createService"
        );
        expect(() => moduleApi.createService({
            runtimeStateHelpersModule: { createService: () => null }
        })).toThrow("Invalid runtime state helpers service");
    });
});
