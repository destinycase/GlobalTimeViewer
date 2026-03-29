import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-state-helper-bootstrap.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeStateHelperBootstrapModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeStateHelperBootstrap", ...Object.keys(globalPatches)];
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
        globalThis.window?.GTVMainRuntimeStateHelperBootstrap
        || globalThis.GTVMainRuntimeStateHelperBootstrap
    );
}

function buildAliasService() {
    return {
        parseDateTimePartsViaRuntimeStateHelpers: () => "parse",
        getTimeAdjustDayStepBySlotSnapshotViaRuntimeStateHelpers: () => [],
        setTimeAdjustDayStepBySlotStateViaRuntimeStateHelpers: () => undefined,
        updateTimeAdjustPanelSafelyViaRuntimeStateHelpers: () => undefined,
        getUTCRefViaRuntimeStateHelpers: () => "utc",
        getCurrentGroupViaRuntimeStateHelpers: () => ({ id: "g1" }),
        getCurrentGroupZonesViaRuntimeStateHelpers: () => [],
        getCurrentGroupBaseTimezoneIdViaRuntimeStateHelpers: () => "UTC",
        getBaseTimezoneRefViaRuntimeStateHelpers: () => "UTC",
        ensureBaseTimezoneSelectionViaRuntimeStateHelpers: () => undefined,
        formatUtcOffsetLabelViaRuntimeStateHelpers: () => "+00:00",
        normalizeCustomAbbrViaRuntimeStateHelpers: (value) => value,
        getCurrentMultiRangeStateSnapshotViaRuntimeStateHelpers: () => [],
        getGroupsStateSnapshotViaRuntimeStateHelpers: () => [],
        getActiveGroupIdByMainTabStateSnapshotViaRuntimeStateHelpers: () => ({ live: "g1" }),
        patchPrimaryStateViaRuntimeStateHelpers: () => undefined,
        setCurrentMainTabStateViaRuntimeStateHelpers: () => undefined,
        setActiveGroupIdStateViaRuntimeStateHelpers: () => undefined,
        setActiveGroupIdByMainTabStateViaRuntimeStateHelpers: () => undefined,
        getActiveGroupNameSnapshotViaRuntimeStateHelpers: () => "Group"
    };
}

describe("GTV main runtime state helper bootstrap module", () => {
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

    it("wires alias/accessor bindings and returns frozen accessor service container", () => {
        const moduleApi = loadMainRuntimeStateHelperBootstrapModule();
        const aliasService = buildAliasService();
        const accessorService = { parseDateTimeParts: vi.fn(() => "ok") };
        const aliasesCreateService = vi.fn(() => aliasService);
        const accessorCreateService = vi.fn(() => accessorService);

        const service = moduleApi.createService({
            runtimeStateHelperAliasesBindings: { createService: aliasesCreateService },
            runtimeStateHelperAccessorBindings: { createService: accessorCreateService },
            runtimeStateHelperAliasesModule: { kind: "aliases-module" },
            runtimeStateHelpersModule: { kind: "helpers-module" },
            runtimeStateHelperAccessorProxiesModule: { kind: "accessor-proxies-module" },
            getMainSharedUtilsService: () => ({}),
            getPatchedTimeAdjustDayStepBySlotState: () => [],
            getPatchAppState: () => undefined,
            getUpdateTimeAdjustPanel: () => undefined,
            getTranslator: () => ((key) => String(key ?? "")),
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
            getActiveGroupIdByMainTabState: () => ({ live: 0 }),
            getPatchedActiveGroupIdState: () => 0
        });

        expect(aliasesCreateService).toHaveBeenCalledTimes(1);
        expect(accessorCreateService).toHaveBeenCalledTimes(1);
        expect(accessorCreateService.mock.calls[0][0]).toEqual(
            expect.objectContaining({
                runtimeStateHelperAccessorProxiesModule: { kind: "accessor-proxies-module" }
            })
        );
        expect(service.mainRuntimeStateHelperAccessorService).toBe(accessorService);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit dependency errors for missing bindings modules", () => {
        const moduleApi = loadMainRuntimeStateHelperBootstrapModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required dependency: runtimeStateHelperAliasesBindings"
        );
        expect(() => moduleApi.createService({
            runtimeStateHelperAliasesBindings: {},
            runtimeStateHelperAccessorBindings: {}
        })).toThrow(
            "Missing required dependency: runtimeStateHelperAliasesBindings.createService"
        );
    });
});
