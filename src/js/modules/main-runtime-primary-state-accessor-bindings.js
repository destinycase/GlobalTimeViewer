(function initGtvMainRuntimePrimaryStateAccessorBindings(globalObj) {
    "use strict";

    const REQUIRED_METHODS = Object.freeze([
        "setIsRealtimeState",
        "getIsRealtimeState",
        "getGlobalTimesState",
        "getGlobalTimeState",
        "setGlobalTimeState",
        "getUiScaleState"
    ]);

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { runtimePrimaryStateAccessorProxiesModule, ...forwardDeps } = safeDeps;
        if (
            !runtimePrimaryStateAccessorProxiesModule
            || typeof runtimePrimaryStateAccessorProxiesModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainRuntimePrimaryStateAccessorProxies.createService");
        }

        const mainRuntimePrimaryStateAccessorProxiesService = (
            runtimePrimaryStateAccessorProxiesModule.createService(forwardDeps)
        );
        if (
            !mainRuntimePrimaryStateAccessorProxiesService
            || typeof mainRuntimePrimaryStateAccessorProxiesService !== "object"
        ) {
            throw new Error("Invalid main runtime primary state accessor proxies service");
        }
        const hasMissingMethod = REQUIRED_METHODS.some((methodName) => (
            typeof mainRuntimePrimaryStateAccessorProxiesService[methodName] !== "function"
        ));
        if (hasMissingMethod) {
            throw new Error("Invalid main runtime primary state accessor proxies service");
        }

        return Object.freeze({
            ...mainRuntimePrimaryStateAccessorProxiesService
        });
    }

    globalObj.GTVMainRuntimePrimaryStateAccessorBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
