(function initGtvMainRuntimeBridgeProxyBindings(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { runtimeBridgeProxiesModule, ...forwardDeps } = safeDeps;
        if (
            !runtimeBridgeProxiesModule
            || typeof runtimeBridgeProxiesModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainRuntimeBridgeProxies.createService");
        }

        const mainRuntimeBridgeProxiesService = runtimeBridgeProxiesModule.createService(forwardDeps);
        if (!mainRuntimeBridgeProxiesService || typeof mainRuntimeBridgeProxiesService !== "object") {
            throw new Error("Invalid main runtime bridge proxies service");
        }

        return Object.freeze({
            mainRuntimeBridgeProxiesService,
            ...mainRuntimeBridgeProxiesService
        });
    }

    globalObj.GTVMainRuntimeBridgeProxyBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
