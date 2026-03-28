(function initGtvMainStateDomainProxyBindings(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { stateDomainProxiesModule, ...forwardDeps } = safeDeps;
        if (
            !stateDomainProxiesModule
            || typeof stateDomainProxiesModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainStateDomainProxies.createService");
        }

        const mainStateDomainProxiesService = stateDomainProxiesModule.createService(forwardDeps);
        if (!mainStateDomainProxiesService || typeof mainStateDomainProxiesService !== "object") {
            throw new Error("Invalid main state domain proxies service");
        }

        return Object.freeze({
            mainStateDomainProxiesService
        });
    }

    globalObj.GTVMainStateDomainProxyBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
