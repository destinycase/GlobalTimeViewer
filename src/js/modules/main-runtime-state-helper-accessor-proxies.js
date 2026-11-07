(function initGtvMainRuntimeStateHelperAccessorProxies(globalObj) {
    "use strict";

    function resolveInvoker(safeDeps, getterKey, directKey, fallbackFactory = null) {
        const getter = (typeof safeDeps[getterKey] === "function")
            ? safeDeps[getterKey]
            : null;
        const direct = (typeof safeDeps[directKey] === "function")
            ? safeDeps[directKey]
            : null;
        return function invokeResolved(...args) {
            if (getter) {
                const resolved = getter();
                if (typeof resolved === "function") {
                    return resolved(...args);
                }
            }
            if (direct) {
                return direct(...args);
            }
            return (typeof fallbackFactory === "function") ? fallbackFactory() : undefined;
        };
    }

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const invokeParseDateTimeParts = resolveInvoker(
            safeDeps,
            "getParseDateTimePartsViaRuntimeStateHelpers",
            "parseDateTimePartsViaRuntimeStateHelpers",
            () => null
        );
        const invokeGetTimeAdjustDayStepBySlotSnapshot = resolveInvoker(
            safeDeps,
            "getGetTimeAdjustDayStepBySlotSnapshotViaRuntimeStateHelpers",
            "getTimeAdjustDayStepBySlotSnapshotViaRuntimeStateHelpers",
            () => []
        );
        const invokeSetTimeAdjustDayStepBySlotState = resolveInvoker(
            safeDeps,
            "getSetTimeAdjustDayStepBySlotStateViaRuntimeStateHelpers",
            "setTimeAdjustDayStepBySlotStateViaRuntimeStateHelpers",
            () => []
        );
        const invokeUpdateTimeAdjustPanelSafely = resolveInvoker(
            safeDeps,
            "getUpdateTimeAdjustPanelSafelyViaRuntimeStateHelpers",
            "updateTimeAdjustPanelSafelyViaRuntimeStateHelpers"
        );
        const invokeGetUTCRef = resolveInvoker(
            safeDeps,
            "getGetUTCRefViaRuntimeStateHelpers",
            "getUTCRefViaRuntimeStateHelpers",
            () => null
        );
        const invokeGetCurrentGroup = resolveInvoker(
            safeDeps,
            "getGetCurrentGroupViaRuntimeStateHelpers",
            "getCurrentGroupViaRuntimeStateHelpers",
            () => null
        );
        const invokeGetCurrentGroupZones = resolveInvoker(
            safeDeps,
            "getGetCurrentGroupZonesViaRuntimeStateHelpers",
            "getCurrentGroupZonesViaRuntimeStateHelpers",
            () => []
        );
        const invokeGetCurrentGroupBaseTimezoneId = resolveInvoker(
            safeDeps,
            "getGetCurrentGroupBaseTimezoneIdViaRuntimeStateHelpers",
            "getCurrentGroupBaseTimezoneIdViaRuntimeStateHelpers",
            () => "utc"
        );
        const invokeGetBaseTimezoneRef = resolveInvoker(
            safeDeps,
            "getGetBaseTimezoneRefViaRuntimeStateHelpers",
            "getBaseTimezoneRefViaRuntimeStateHelpers",
            () => null
        );
        const invokeEnsureBaseTimezoneSelection = resolveInvoker(
            safeDeps,
            "getEnsureBaseTimezoneSelectionViaRuntimeStateHelpers",
            "ensureBaseTimezoneSelectionViaRuntimeStateHelpers",
            () => "utc"
        );
        const invokeFormatUtcOffsetLabel = resolveInvoker(
            safeDeps,
            "getFormatUtcOffsetLabelViaRuntimeStateHelpers",
            "formatUtcOffsetLabelViaRuntimeStateHelpers",
            () => "+00:00"
        );
        const invokeNormalizeCustomAbbr = resolveInvoker(
            safeDeps,
            "getNormalizeCustomAbbrViaRuntimeStateHelpers",
            "normalizeCustomAbbrViaRuntimeStateHelpers",
            () => ""
        );
        const invokeGetCurrentMultiRangeStateSnapshot = resolveInvoker(
            safeDeps,
            "getGetCurrentMultiRangeStateSnapshotViaRuntimeStateHelpers",
            "getCurrentMultiRangeStateSnapshotViaRuntimeStateHelpers",
            () => null
        );
        const invokeGetGroupsStateSnapshot = resolveInvoker(
            safeDeps,
            "getGetGroupsStateSnapshotViaRuntimeStateHelpers",
            "getGroupsStateSnapshotViaRuntimeStateHelpers",
            () => []
        );
        const invokeGetActiveGroupIdByMainTabStateSnapshot = resolveInvoker(
            safeDeps,
            "getGetActiveGroupIdByMainTabStateSnapshotViaRuntimeStateHelpers",
            "getActiveGroupIdByMainTabStateSnapshotViaRuntimeStateHelpers",
            () => ({})
        );
        const invokePatchPrimaryState = resolveInvoker(
            safeDeps,
            "getPatchPrimaryStateViaRuntimeStateHelpers",
            "patchPrimaryStateViaRuntimeStateHelpers"
        );
        const invokeSetCurrentMainTabState = resolveInvoker(
            safeDeps,
            "getSetCurrentMainTabStateViaRuntimeStateHelpers",
            "setCurrentMainTabStateViaRuntimeStateHelpers"
        );
        const invokeSetActiveGroupIdState = resolveInvoker(
            safeDeps,
            "getSetActiveGroupIdStateViaRuntimeStateHelpers",
            "setActiveGroupIdStateViaRuntimeStateHelpers"
        );
        const invokeSetActiveGroupIdByMainTabState = resolveInvoker(
            safeDeps,
            "getSetActiveGroupIdByMainTabStateViaRuntimeStateHelpers",
            "setActiveGroupIdByMainTabStateViaRuntimeStateHelpers"
        );
        const invokeGetActiveGroupNameSnapshot = resolveInvoker(
            safeDeps,
            "getGetActiveGroupNameSnapshotViaRuntimeStateHelpers",
            "getActiveGroupNameSnapshotViaRuntimeStateHelpers",
            () => ""
        );

        function parseDateTimeParts(val, inputMode) {
            return invokeParseDateTimeParts(val, inputMode);
        }

        function getTimeAdjustDayStepBySlotSnapshot() {
            return invokeGetTimeAdjustDayStepBySlotSnapshot();
        }

        function setTimeAdjustDayStepBySlotState(nextValues = []) {
            return invokeSetTimeAdjustDayStepBySlotState(nextValues);
        }

        function updateTimeAdjustPanelSafely() {
            return invokeUpdateTimeAdjustPanelSafely();
        }

        function getUTCRef() {
            return invokeGetUTCRef();
        }

        function getCurrentGroup() {
            return invokeGetCurrentGroup();
        }

        function getCurrentGroupZones() {
            return invokeGetCurrentGroupZones();
        }

        function getCurrentGroupBaseTimezoneId() {
            return invokeGetCurrentGroupBaseTimezoneId();
        }

        function getBaseTimezoneRef() {
            return invokeGetBaseTimezoneRef();
        }

        function ensureBaseTimezoneSelection() {
            return invokeEnsureBaseTimezoneSelection();
        }

        function formatUtcOffsetLabel(totalMinutes = 0) {
            return invokeFormatUtcOffsetLabel(totalMinutes);
        }

        function normalizeCustomAbbr(value) {
            return invokeNormalizeCustomAbbr(value);
        }

        function getCurrentMultiRangeStateSnapshot() {
            return invokeGetCurrentMultiRangeStateSnapshot();
        }

        function getGroupsStateSnapshot() {
            return invokeGetGroupsStateSnapshot();
        }

        function getActiveGroupIdByMainTabStateSnapshot() {
            return invokeGetActiveGroupIdByMainTabStateSnapshot();
        }

        function patchPrimaryState(next = {}) {
            return invokePatchPrimaryState(next);
        }

        function setCurrentMainTabState(nextTab) {
            return invokeSetCurrentMainTabState(nextTab);
        }

        function setActiveGroupIdState(nextId) {
            return invokeSetActiveGroupIdState(nextId);
        }

        function setActiveGroupIdByMainTabState(nextMap) {
            return invokeSetActiveGroupIdByMainTabState(nextMap);
        }

        function getActiveGroupNameSnapshot() {
            return invokeGetActiveGroupNameSnapshot();
        }

        return Object.freeze({
            parseDateTimeParts,
            getTimeAdjustDayStepBySlotSnapshot,
            setTimeAdjustDayStepBySlotState,
            updateTimeAdjustPanelSafely,
            getUTCRef,
            getCurrentGroup,
            getCurrentGroupZones,
            getCurrentGroupBaseTimezoneId,
            getBaseTimezoneRef,
            ensureBaseTimezoneSelection,
            formatUtcOffsetLabel,
            normalizeCustomAbbr,
            getCurrentMultiRangeStateSnapshot,
            getGroupsStateSnapshot,
            getActiveGroupIdByMainTabStateSnapshot,
            patchPrimaryState,
            setCurrentMainTabState,
            setActiveGroupIdState,
            setActiveGroupIdByMainTabState,
            getActiveGroupNameSnapshot
        });
    }

    globalObj.GTVMainRuntimeStateHelperAccessorProxies = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
