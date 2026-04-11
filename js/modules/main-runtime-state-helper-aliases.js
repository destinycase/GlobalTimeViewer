(function initGtvMainRuntimeStateHelperAliases(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function pickDeps(depNames = []) {
            const resolved = {};
            depNames.forEach((depName) => {
                resolved[depName] = safeDeps[depName];
            });
            return resolved;
        }

        const runtimeStateHelpersModule = safeDeps.runtimeStateHelpersModule;
        if (!runtimeStateHelpersModule || typeof runtimeStateHelpersModule.createService !== "function") {
            throw new Error("Missing required module API: GTVMainRuntimeStateHelpers.createService");
        }

        const runtimeStateHelpersService = runtimeStateHelpersModule.createService({
            ...pickDeps([
                "getMainSharedUtilsService",
                "getPatchedTimeAdjustDayStepBySlotState",
                "getPatchAppState",
                "getUpdateTimeAdjustPanel",
                "getTranslator",
                "getGroupContextStateService",
                "getTimezoneSearchService",
                "getPatchedMultiRangeCountState",
                "getPatchedMultiRangesState",
                "getPatchedMultiRangeCollapsedState",
                "getPatchedArrayStateValue",
                "getMultiRangeStartEditEnabledState",
                "getMultiRangeEndEditEnabledState",
                "getPatchedMultiRangeTitleState",
                "getPersistenceState",
                "getGroupsState",
                "getActiveGroupIdByMainTabState",
                "getPatchedActiveGroupIdState"
            ])
        });

        if (!runtimeStateHelpersService || typeof runtimeStateHelpersService !== "object") {
            throw new Error("Invalid runtime state helpers service");
        }

        return Object.freeze({
            parseDateTimePartsViaRuntimeStateHelpers: runtimeStateHelpersService.parseDateTimeParts,
            getTimeAdjustDayStepBySlotSnapshotViaRuntimeStateHelpers: runtimeStateHelpersService.getTimeAdjustDayStepBySlotSnapshot,
            setTimeAdjustDayStepBySlotStateViaRuntimeStateHelpers: runtimeStateHelpersService.setTimeAdjustDayStepBySlotState,
            updateTimeAdjustPanelSafelyViaRuntimeStateHelpers: runtimeStateHelpersService.updateTimeAdjustPanelSafely,
            getUTCRefViaRuntimeStateHelpers: runtimeStateHelpersService.getUTCRef,
            getCurrentGroupViaRuntimeStateHelpers: runtimeStateHelpersService.getCurrentGroup,
            getCurrentGroupZonesViaRuntimeStateHelpers: runtimeStateHelpersService.getCurrentGroupZones,
            getCurrentGroupBaseTimezoneIdViaRuntimeStateHelpers: runtimeStateHelpersService.getCurrentGroupBaseTimezoneId,
            getBaseTimezoneRefViaRuntimeStateHelpers: runtimeStateHelpersService.getBaseTimezoneRef,
            ensureBaseTimezoneSelectionViaRuntimeStateHelpers: runtimeStateHelpersService.ensureBaseTimezoneSelection,
            formatUtcOffsetLabelViaRuntimeStateHelpers: runtimeStateHelpersService.formatUtcOffsetLabel,
            normalizeCustomAbbrViaRuntimeStateHelpers: runtimeStateHelpersService.normalizeCustomAbbr,
            getCurrentMultiRangeStateSnapshotViaRuntimeStateHelpers: runtimeStateHelpersService.getCurrentMultiRangeStateSnapshot,
            getGroupsStateSnapshotViaRuntimeStateHelpers: runtimeStateHelpersService.getGroupsStateSnapshot,
            getActiveGroupIdByMainTabStateSnapshotViaRuntimeStateHelpers: runtimeStateHelpersService.getActiveGroupIdByMainTabStateSnapshot,
            patchPrimaryStateViaRuntimeStateHelpers: runtimeStateHelpersService.patchPrimaryState,
            setCurrentMainTabStateViaRuntimeStateHelpers: runtimeStateHelpersService.setCurrentMainTabState,
            setActiveGroupIdStateViaRuntimeStateHelpers: runtimeStateHelpersService.setActiveGroupIdState,
            setActiveGroupIdByMainTabStateViaRuntimeStateHelpers: runtimeStateHelpersService.setActiveGroupIdByMainTabState,
            getActiveGroupNameSnapshotViaRuntimeStateHelpers: runtimeStateHelpersService.getActiveGroupNameSnapshot
        });
    }

    globalObj.GTVMainRuntimeStateHelperAliases = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
