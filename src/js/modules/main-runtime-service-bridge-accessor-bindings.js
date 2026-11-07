(function initGtvMainRuntimeServiceBridgeAccessorBindings(globalObj) {
    "use strict";

    const REQUIRED_METHODS = Object.freeze([
        "warnMissingServiceMethod",
        "showMissingFeatureToastOnce",
        "getServiceMethod",
        "callServiceMethod",
        "savePersistenceSafely",
        "renderMultiRangesSafely"
    ]);

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { runtimeServiceBridgeAccessorProxiesModule, ...forwardDeps } = safeDeps;
        if (
            !runtimeServiceBridgeAccessorProxiesModule
            || typeof runtimeServiceBridgeAccessorProxiesModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainRuntimeServiceBridgeAccessorProxies.createService");
        }

        const mainRuntimeServiceBridgeAccessorProxiesService = (
            runtimeServiceBridgeAccessorProxiesModule.createService(forwardDeps)
        );
        if (
            !mainRuntimeServiceBridgeAccessorProxiesService
            || typeof mainRuntimeServiceBridgeAccessorProxiesService !== "object"
        ) {
            throw new Error("Invalid main runtime service bridge accessor proxies service");
        }
        const hasMissingMethod = REQUIRED_METHODS.some((methodName) => (
            typeof mainRuntimeServiceBridgeAccessorProxiesService[methodName] !== "function"
        ));
        if (hasMissingMethod) {
            throw new Error("Invalid main runtime service bridge accessor proxies service");
        }

        return Object.freeze({
            ...mainRuntimeServiceBridgeAccessorProxiesService
        });
    }

    globalObj.GTVMainRuntimeServiceBridgeAccessorBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
