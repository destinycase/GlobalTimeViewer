(function initGtvMainRuntimeLocalStateAccessorBindings(globalObj) {
    "use strict";

    const REQUIRED_METHODS = Object.freeze([
        "setMultiRangeState",
        "getNextFixedTimeSeed",
        "setUiPreferencesState",
        "getBaseTimeSnapshot",
        "getFixedTimeSlotCountForGroupRef",
        "confirmRuntime",
        "getActiveCopyFormatKeysForCurrentContext",
        "getActiveTimePartKeysForCurrentContext",
        "getCurrentUiScalePercent",
        "getFixedTimeSlotCountForCurrentGroup",
        "getCurrentGroupFixedTimeShowLiveNow",
        "shouldRunRealtimeTick",
        "getTimeAdjustDayStepValue"
    ]);

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { runtimeLocalStateAccessorProxiesModule, ...forwardDeps } = safeDeps;
        if (
            !runtimeLocalStateAccessorProxiesModule
            || typeof runtimeLocalStateAccessorProxiesModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainRuntimeLocalStateAccessorProxies.createService");
        }

        const mainRuntimeLocalStateAccessorProxiesService = (
            runtimeLocalStateAccessorProxiesModule.createService(forwardDeps)
        );
        if (
            !mainRuntimeLocalStateAccessorProxiesService
            || typeof mainRuntimeLocalStateAccessorProxiesService !== "object"
        ) {
            throw new Error("Invalid main runtime local state accessor proxies service");
        }
        const hasMissingMethod = REQUIRED_METHODS.some((methodName) => (
            typeof mainRuntimeLocalStateAccessorProxiesService[methodName] !== "function"
        ));
        if (hasMissingMethod) {
            throw new Error("Invalid main runtime local state accessor proxies service");
        }

        return Object.freeze({
            ...mainRuntimeLocalStateAccessorProxiesService
        });
    }

    globalObj.GTVMainRuntimeLocalStateAccessorBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
