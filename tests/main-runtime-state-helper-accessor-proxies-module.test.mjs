import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-state-helper-accessor-proxies.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeStateHelperAccessorProxiesModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeStateHelperAccessorProxies", ...Object.keys(globalPatches)];
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
        globalThis.window?.GTVMainRuntimeStateHelperAccessorProxies
        || globalThis.GTVMainRuntimeStateHelperAccessorProxies
    );
}

describe("GTV main runtime state helper accessor proxies module", () => {
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

    it("creates runtime accessor wrappers delegating to alias helpers", () => {
        const moduleApi = loadMainRuntimeStateHelperAccessorProxiesModule();
        const delegate = {
            parseDateTimePartsViaRuntimeStateHelpers: (val, mode) => `${val}:${mode}`,
            getTimeAdjustDayStepBySlotSnapshotViaRuntimeStateHelpers: () => [1, 2],
            setTimeAdjustDayStepBySlotStateViaRuntimeStateHelpers: (next) => [...next],
            updateTimeAdjustPanelSafelyViaRuntimeStateHelpers: () => "updated",
            getUTCRefViaRuntimeStateHelpers: () => ({ zone: "UTC" }),
            getCurrentGroupViaRuntimeStateHelpers: () => ({ id: "g1" }),
            getCurrentGroupZonesViaRuntimeStateHelpers: () => [{ id: "tz1" }],
            getCurrentGroupBaseTimezoneIdViaRuntimeStateHelpers: () => "tz1",
            getBaseTimezoneRefViaRuntimeStateHelpers: () => ({ id: "tz1" }),
            ensureBaseTimezoneSelectionViaRuntimeStateHelpers: () => "tz1",
            formatUtcOffsetLabelViaRuntimeStateHelpers: (offset) => `UTC${offset}`,
            normalizeCustomAbbrViaRuntimeStateHelpers: (value) => String(value).trim().toUpperCase(),
            getCurrentMultiRangeStateSnapshotViaRuntimeStateHelpers: () => ({ count: 1 }),
            getGroupsStateSnapshotViaRuntimeStateHelpers: () => [{ id: "g1" }],
            getActiveGroupIdByMainTabStateSnapshotViaRuntimeStateHelpers: () => ({ live: "g1" }),
            patchPrimaryStateViaRuntimeStateHelpers: (next) => ({ ...next, patched: true }),
            setCurrentMainTabStateViaRuntimeStateHelpers: (nextTab) => nextTab,
            setActiveGroupIdStateViaRuntimeStateHelpers: (nextId) => nextId,
            setActiveGroupIdByMainTabStateViaRuntimeStateHelpers: (nextMap) => ({ ...nextMap }),
            getActiveGroupNameSnapshotViaRuntimeStateHelpers: () => "Group-1"
        };

        const service = moduleApi.createService({
            getParseDateTimePartsViaRuntimeStateHelpers: () => delegate.parseDateTimePartsViaRuntimeStateHelpers,
            getGetTimeAdjustDayStepBySlotSnapshotViaRuntimeStateHelpers: () => delegate.getTimeAdjustDayStepBySlotSnapshotViaRuntimeStateHelpers,
            getSetTimeAdjustDayStepBySlotStateViaRuntimeStateHelpers: () => delegate.setTimeAdjustDayStepBySlotStateViaRuntimeStateHelpers,
            getUpdateTimeAdjustPanelSafelyViaRuntimeStateHelpers: () => delegate.updateTimeAdjustPanelSafelyViaRuntimeStateHelpers,
            getGetUTCRefViaRuntimeStateHelpers: () => delegate.getUTCRefViaRuntimeStateHelpers,
            getGetCurrentGroupViaRuntimeStateHelpers: () => delegate.getCurrentGroupViaRuntimeStateHelpers,
            getGetCurrentGroupZonesViaRuntimeStateHelpers: () => delegate.getCurrentGroupZonesViaRuntimeStateHelpers,
            getGetCurrentGroupBaseTimezoneIdViaRuntimeStateHelpers: () => delegate.getCurrentGroupBaseTimezoneIdViaRuntimeStateHelpers,
            getGetBaseTimezoneRefViaRuntimeStateHelpers: () => delegate.getBaseTimezoneRefViaRuntimeStateHelpers,
            getEnsureBaseTimezoneSelectionViaRuntimeStateHelpers: () => delegate.ensureBaseTimezoneSelectionViaRuntimeStateHelpers,
            getFormatUtcOffsetLabelViaRuntimeStateHelpers: () => delegate.formatUtcOffsetLabelViaRuntimeStateHelpers,
            getNormalizeCustomAbbrViaRuntimeStateHelpers: () => delegate.normalizeCustomAbbrViaRuntimeStateHelpers,
            getGetCurrentMultiRangeStateSnapshotViaRuntimeStateHelpers: () => delegate.getCurrentMultiRangeStateSnapshotViaRuntimeStateHelpers,
            getGetGroupsStateSnapshotViaRuntimeStateHelpers: () => delegate.getGroupsStateSnapshotViaRuntimeStateHelpers,
            getGetActiveGroupIdByMainTabStateSnapshotViaRuntimeStateHelpers: () => delegate.getActiveGroupIdByMainTabStateSnapshotViaRuntimeStateHelpers,
            getPatchPrimaryStateViaRuntimeStateHelpers: () => delegate.patchPrimaryStateViaRuntimeStateHelpers,
            getSetCurrentMainTabStateViaRuntimeStateHelpers: () => delegate.setCurrentMainTabStateViaRuntimeStateHelpers,
            getSetActiveGroupIdStateViaRuntimeStateHelpers: () => delegate.setActiveGroupIdStateViaRuntimeStateHelpers,
            getSetActiveGroupIdByMainTabStateViaRuntimeStateHelpers: () => delegate.setActiveGroupIdByMainTabStateViaRuntimeStateHelpers,
            getGetActiveGroupNameSnapshotViaRuntimeStateHelpers: () => delegate.getActiveGroupNameSnapshotViaRuntimeStateHelpers
        });

        expect(service.parseDateTimeParts("x", "datetime")).toBe("x:datetime");
        expect(service.getTimeAdjustDayStepBySlotSnapshot()).toEqual([1, 2]);
        expect(service.setTimeAdjustDayStepBySlotState([9])).toEqual([9]);
        expect(service.updateTimeAdjustPanelSafely()).toBe("updated");
        expect(service.getUTCRef()).toEqual({ zone: "UTC" });
        expect(service.getCurrentGroup()).toEqual({ id: "g1" });
        expect(service.getCurrentGroupZones()).toEqual([{ id: "tz1" }]);
        expect(service.getCurrentGroupBaseTimezoneId()).toBe("tz1");
        expect(service.getBaseTimezoneRef()).toEqual({ id: "tz1" });
        expect(service.ensureBaseTimezoneSelection()).toBe("tz1");
        expect(service.formatUtcOffsetLabel(9)).toBe("UTC9");
        expect(service.normalizeCustomAbbr(" kst ")).toBe("KST");
        expect(service.getCurrentMultiRangeStateSnapshot()).toEqual({ count: 1 });
        expect(service.getGroupsStateSnapshot()).toEqual([{ id: "g1" }]);
        expect(service.getActiveGroupIdByMainTabStateSnapshot()).toEqual({ live: "g1" });
        expect(service.patchPrimaryState({ foo: 1 })).toEqual({ foo: 1, patched: true });
        expect(service.setCurrentMainTabState("fixed")).toBe("fixed");
        expect(service.setActiveGroupIdState("g2")).toBe("g2");
        expect(service.setActiveGroupIdByMainTabState({ live: "g2" })).toEqual({ live: "g2" });
        expect(service.getActiveGroupNameSnapshot()).toBe("Group-1");
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("returns safe defaults when delegates are missing", () => {
        const moduleApi = loadMainRuntimeStateHelperAccessorProxiesModule();
        const service = moduleApi.createService({});

        expect(service.parseDateTimeParts("x", "datetime")).toBe(null);
        expect(service.getTimeAdjustDayStepBySlotSnapshot()).toEqual([]);
        expect(service.setTimeAdjustDayStepBySlotState()).toEqual([]);
        expect(service.getCurrentGroupZones()).toEqual([]);
        expect(service.getCurrentGroupBaseTimezoneId()).toBe("utc");
        expect(service.ensureBaseTimezoneSelection()).toBe("utc");
        expect(service.formatUtcOffsetLabel(120)).toBe("+00:00");
        expect(service.normalizeCustomAbbr(" kst ")).toBe("");
        expect(service.getGroupsStateSnapshot()).toEqual([]);
        expect(service.getActiveGroupIdByMainTabStateSnapshot()).toEqual({});
        expect(service.getActiveGroupNameSnapshot()).toBe("");
    });
});
