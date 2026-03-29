(function initGtvMainRuntimeStateHelperBootstrap(globalObj) {
    "use strict";

    function requireFunction(value, label) {
        if (typeof value !== "function") {
            throw new Error(`Missing required dependency: ${label}`);
        }
        return value;
    }

    function requireObject(value, label) {
        if (!value || typeof value !== "object") {
            throw new Error(`Missing required dependency: ${label}`);
        }
        return value;
    }

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const runtimeStateHelperAliasesBindings = requireObject(
            safeDeps.runtimeStateHelperAliasesBindings,
            "runtimeStateHelperAliasesBindings"
        );
        const runtimeStateHelperAccessorBindings = requireObject(
            safeDeps.runtimeStateHelperAccessorBindings,
            "runtimeStateHelperAccessorBindings"
        );

        const createAliasesService = requireFunction(
            runtimeStateHelperAliasesBindings.createService,
            "runtimeStateHelperAliasesBindings.createService"
        );
        const createAccessorService = requireFunction(
            runtimeStateHelperAccessorBindings.createService,
            "runtimeStateHelperAccessorBindings.createService"
        );

        const {
            parseDateTimePartsViaRuntimeStateHelpers,
            getTimeAdjustDayStepBySlotSnapshotViaRuntimeStateHelpers,
            setTimeAdjustDayStepBySlotStateViaRuntimeStateHelpers,
            updateTimeAdjustPanelSafelyViaRuntimeStateHelpers,
            getUTCRefViaRuntimeStateHelpers,
            getCurrentGroupViaRuntimeStateHelpers,
            getCurrentGroupZonesViaRuntimeStateHelpers,
            getCurrentGroupBaseTimezoneIdViaRuntimeStateHelpers,
            getBaseTimezoneRefViaRuntimeStateHelpers,
            ensureBaseTimezoneSelectionViaRuntimeStateHelpers,
            formatUtcOffsetLabelViaRuntimeStateHelpers,
            normalizeCustomAbbrViaRuntimeStateHelpers,
            getCurrentMultiRangeStateSnapshotViaRuntimeStateHelpers,
            getGroupsStateSnapshotViaRuntimeStateHelpers,
            getActiveGroupIdByMainTabStateSnapshotViaRuntimeStateHelpers,
            patchPrimaryStateViaRuntimeStateHelpers,
            setCurrentMainTabStateViaRuntimeStateHelpers,
            setActiveGroupIdStateViaRuntimeStateHelpers,
            setActiveGroupIdByMainTabStateViaRuntimeStateHelpers,
            getActiveGroupNameSnapshotViaRuntimeStateHelpers
        } = createAliasesService({
            runtimeStateHelperAliasesModule: safeDeps.runtimeStateHelperAliasesModule,
            runtimeStateHelpersModule: safeDeps.runtimeStateHelpersModule,
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

        const mainRuntimeStateHelperAccessorService = createAccessorService({
            runtimeStateHelperAccessorProxiesModule: safeDeps.runtimeStateHelperAccessorProxiesModule,
            getParseDateTimePartsViaRuntimeStateHelpers: () => parseDateTimePartsViaRuntimeStateHelpers,
            getGetTimeAdjustDayStepBySlotSnapshotViaRuntimeStateHelpers: () => getTimeAdjustDayStepBySlotSnapshotViaRuntimeStateHelpers,
            getSetTimeAdjustDayStepBySlotStateViaRuntimeStateHelpers: () => setTimeAdjustDayStepBySlotStateViaRuntimeStateHelpers,
            getUpdateTimeAdjustPanelSafelyViaRuntimeStateHelpers: () => updateTimeAdjustPanelSafelyViaRuntimeStateHelpers,
            getGetUTCRefViaRuntimeStateHelpers: () => getUTCRefViaRuntimeStateHelpers,
            getGetCurrentGroupViaRuntimeStateHelpers: () => getCurrentGroupViaRuntimeStateHelpers,
            getGetCurrentGroupZonesViaRuntimeStateHelpers: () => getCurrentGroupZonesViaRuntimeStateHelpers,
            getGetCurrentGroupBaseTimezoneIdViaRuntimeStateHelpers: () => getCurrentGroupBaseTimezoneIdViaRuntimeStateHelpers,
            getGetBaseTimezoneRefViaRuntimeStateHelpers: () => getBaseTimezoneRefViaRuntimeStateHelpers,
            getEnsureBaseTimezoneSelectionViaRuntimeStateHelpers: () => ensureBaseTimezoneSelectionViaRuntimeStateHelpers,
            getFormatUtcOffsetLabelViaRuntimeStateHelpers: () => formatUtcOffsetLabelViaRuntimeStateHelpers,
            getNormalizeCustomAbbrViaRuntimeStateHelpers: () => normalizeCustomAbbrViaRuntimeStateHelpers,
            getGetCurrentMultiRangeStateSnapshotViaRuntimeStateHelpers: () => getCurrentMultiRangeStateSnapshotViaRuntimeStateHelpers,
            getGetGroupsStateSnapshotViaRuntimeStateHelpers: () => getGroupsStateSnapshotViaRuntimeStateHelpers,
            getGetActiveGroupIdByMainTabStateSnapshotViaRuntimeStateHelpers: () => getActiveGroupIdByMainTabStateSnapshotViaRuntimeStateHelpers,
            getPatchPrimaryStateViaRuntimeStateHelpers: () => patchPrimaryStateViaRuntimeStateHelpers,
            getSetCurrentMainTabStateViaRuntimeStateHelpers: () => setCurrentMainTabStateViaRuntimeStateHelpers,
            getSetActiveGroupIdStateViaRuntimeStateHelpers: () => setActiveGroupIdStateViaRuntimeStateHelpers,
            getSetActiveGroupIdByMainTabStateViaRuntimeStateHelpers: () => setActiveGroupIdByMainTabStateViaRuntimeStateHelpers,
            getGetActiveGroupNameSnapshotViaRuntimeStateHelpers: () => getActiveGroupNameSnapshotViaRuntimeStateHelpers
        });

        return Object.freeze({
            mainRuntimeStateHelperAccessorService
        });
    }

    globalObj.GTVMainRuntimeStateHelperBootstrap = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
