(function initGtvMainRuntimeStateHelperAccessorBindings(globalObj) {
    "use strict";

    const REQUIRED_METHODS = Object.freeze([
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

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { runtimeStateHelperAccessorProxiesModule, ...forwardDeps } = safeDeps;
        if (
            !runtimeStateHelperAccessorProxiesModule
            || typeof runtimeStateHelperAccessorProxiesModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainRuntimeStateHelperAccessorProxies.createService");
        }

        const mainRuntimeStateHelperAccessorProxiesService = (
            runtimeStateHelperAccessorProxiesModule.createService(forwardDeps)
        );
        if (
            !mainRuntimeStateHelperAccessorProxiesService
            || typeof mainRuntimeStateHelperAccessorProxiesService !== "object"
        ) {
            throw new Error("Invalid main runtime state helper accessor proxies service");
        }
        const hasMissingMethod = REQUIRED_METHODS.some((methodName) => (
            typeof mainRuntimeStateHelperAccessorProxiesService[methodName] !== "function"
        ));
        if (hasMissingMethod) {
            throw new Error("Invalid main runtime state helper accessor proxies service");
        }

        return Object.freeze({
            ...mainRuntimeStateHelperAccessorProxiesService
        });
    }

    globalObj.GTVMainRuntimeStateHelperAccessorBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
