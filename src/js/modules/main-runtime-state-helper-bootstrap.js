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

        const createAliasesService = requireFunction(
            runtimeStateHelperAliasesBindings.createService,
            "runtimeStateHelperAliasesBindings.createService"
        );
        const serviceInvokeUtils = globalObj?.GTVServiceInvokeUtils || globalThis.GTVServiceInvokeUtils;
        if (!serviceInvokeUtils || typeof serviceInvokeUtils.createRequiredModuleService !== "function") {
            throw new Error("Missing required module API: GTVServiceInvokeUtils.createRequiredModuleService");
        }
        // Accessor proxy services are created directly (formerly one *-bindings module each) and
        // exposed as frozen copies, as the bindings did. The proxies module key is not forwarded.
        const ACCESSOR_SPECS = Object.freeze({
            StateHelper: {
                moduleKey: "runtimeStateHelperAccessorProxiesModule",
                moduleName: "GTVMainRuntimeStateHelperAccessorProxies",
                invalidMessage: "Invalid main runtime state helper accessor proxies service",
                requiredMethods: ["parseDateTimeParts","getTimeAdjustDayStepBySlotSnapshot","setTimeAdjustDayStepBySlotState","updateTimeAdjustPanelSafely","getUTCRef","getCurrentGroup","getCurrentGroupZones","getCurrentGroupBaseTimezoneId","getBaseTimezoneRef","ensureBaseTimezoneSelection","formatUtcOffsetLabel","normalizeCustomAbbr","getCurrentMultiRangeStateSnapshot","getGroupsStateSnapshot","getActiveGroupIdByMainTabStateSnapshot","patchPrimaryState","setCurrentMainTabState","setActiveGroupIdState","setActiveGroupIdByMainTabState","getActiveGroupNameSnapshot"]
            }
        });
        function createProxyAccessorService(kind, accessorDeps = {}) {
            const spec = ACCESSOR_SPECS[kind];
            const { [spec.moduleKey]: proxiesModule, ...forwardDeps } = accessorDeps;
            return Object.freeze({
                ...serviceInvokeUtils.createRequiredModuleService(
                    proxiesModule,
                    spec.moduleName,
                    forwardDeps,
                    spec.requiredMethods,
                    spec.invalidMessage
                )
            });
        }

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

        const mainRuntimeStateHelperAccessorService = createProxyAccessorService("StateHelper", {
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
