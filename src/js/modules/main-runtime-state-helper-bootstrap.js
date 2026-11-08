(function initGtvMainRuntimeStateHelperBootstrap(globalObj) {
    "use strict";

    // The state helper accessors are the runtime state helpers service's own methods. They used to
    // pass through a rename layer (main-runtime-state-helper-aliases.js) and an accessor proxy
    // (main-runtime-state-helper-accessor-proxies.js) with the same signatures and defaults.
    const STATE_HELPER_METHODS = Object.freeze([
        "parseDateTimeParts",
        "getTimeAdjustDayStepBySlotSnapshot",
        "setTimeAdjustDayStepBySlotState",
        "updateTimeAdjustPanelSafely",
        "getUTCRef",
        "getCurrentGroup",
        "getCurrentGroupZones",
        "getCurrentGroupBaseTimezoneId",
        "getBaseTimezoneRef",
        "ensureBaseTimezoneSelection",
        "formatUtcOffsetLabel",
        "normalizeCustomAbbr",
        "getCurrentMultiRangeStateSnapshot",
        "getGroupsStateSnapshot",
        "getActiveGroupIdByMainTabStateSnapshot",
        "patchPrimaryState",
        "setCurrentMainTabState",
        "setActiveGroupIdState",
        "setActiveGroupIdByMainTabState",
        "getActiveGroupNameSnapshot"
    ]);

    const STATE_HELPER_DEP_KEYS = Object.freeze([
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
    ]);

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const serviceInvokeUtils = globalObj?.GTVServiceInvokeUtils || globalThis.GTVServiceInvokeUtils;
        if (!serviceInvokeUtils || typeof serviceInvokeUtils.createRequiredModuleService !== "function") {
            throw new Error("Missing required module API: GTVServiceInvokeUtils.createRequiredModuleService");
        }

        const helperDeps = STATE_HELPER_DEP_KEYS.reduce((acc, key) => {
            acc[key] = safeDeps[key];
            return acc;
        }, {});
        const runtimeStateHelpersService = serviceInvokeUtils.createRequiredModuleService(
            safeDeps.runtimeStateHelpersModule,
            "GTVMainRuntimeStateHelpers",
            helperDeps,
            STATE_HELPER_METHODS,
            "Invalid runtime state helpers service"
        );

        const mainRuntimeStateHelperAccessorService = Object.freeze(Object.fromEntries(
            STATE_HELPER_METHODS.map((methodName) => [methodName, runtimeStateHelpersService[methodName]])
        ));

        return Object.freeze({
            mainRuntimeStateHelperAccessorService
        });
    }

    globalObj.GTVMainRuntimeStateHelperBootstrap = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
