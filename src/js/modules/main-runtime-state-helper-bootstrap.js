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

        function pickDeps(depNames = []) {
            const resolved = {};
            depNames.forEach((depName) => {
                resolved[depName] = safeDeps[depName];
            });
            return resolved;
        }

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
            ...pickDeps([
                "runtimeStateHelperAliasesModule",
                "runtimeStateHelpersModule",
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

        const mainRuntimeStateHelperAccessorService = createAccessorService({
            ...pickDeps([
                "runtimeStateHelperAccessorProxiesModule"
            ]),
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
