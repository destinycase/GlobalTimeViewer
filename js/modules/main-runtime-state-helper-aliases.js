(function initGtvMainRuntimeStateHelperAliases(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const runtimeStateHelpersModule = safeDeps.runtimeStateHelpersModule;
        if (!runtimeStateHelpersModule || typeof runtimeStateHelpersModule.createService !== "function") {
            throw new Error("Missing required module API: GTVMainRuntimeStateHelpers.createService");
        }

        const runtimeStateHelpersService = runtimeStateHelpersModule.createService({
            getMainSharedUtilsService: safeDeps.getMainSharedUtilsService,
            getPatchedTimeAdjustDayStepBySlotState: safeDeps.getPatchedTimeAdjustDayStepBySlotState,
            getPatchAppState: safeDeps.getPatchAppState,
            getUpdateTimeAdjustPanel: safeDeps.getUpdateTimeAdjustPanel,
            getTranslator: safeDeps.getTranslator,
            getGroupContextStateService: safeDeps.getGroupContextStateService,
            getTimezoneSearchService: safeDeps.getTimezoneSearchService,
            getPatchedMultiRangeCountState: safeDeps.getPatchedMultiRangeCountState,
            getPatchedMultiRangesState: safeDeps.getPatchedMultiRangesState,
            getPatchedMultiRangeCollapsedState: safeDeps.getPatchedMultiRangeCollapsedState,
            getPatchedArrayStateValue: safeDeps.getPatchedArrayStateValue,
            getMultiRangeStartEditEnabledState: safeDeps.getMultiRangeStartEditEnabledState,
            getMultiRangeEndEditEnabledState: safeDeps.getMultiRangeEndEditEnabledState,
            getPatchedMultiRangeTitleState: safeDeps.getPatchedMultiRangeTitleState,
            getPersistenceState: safeDeps.getPersistenceState,
            getGroupsState: safeDeps.getGroupsState,
            getActiveGroupIdByMainTabState: safeDeps.getActiveGroupIdByMainTabState,
            getPatchedActiveGroupIdState: safeDeps.getPatchedActiveGroupIdState
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
