(function initGtvMainRuntimeBootstrapAccessorBindings(globalObj) {
    "use strict";

    const REQUIRED_METHODS = Object.freeze([
        "initApp",
        "startBootstrapOnDomReady"
    ]);

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { runtimeBootstrapAccessorProxiesModule, ...forwardDeps } = safeDeps;
        if (
            !runtimeBootstrapAccessorProxiesModule
            || typeof runtimeBootstrapAccessorProxiesModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainRuntimeBootstrapAccessorProxies.createService");
        }

        const mainRuntimeBootstrapAccessorProxiesService = (
            runtimeBootstrapAccessorProxiesModule.createService(forwardDeps)
        );
        if (
            !mainRuntimeBootstrapAccessorProxiesService
            || typeof mainRuntimeBootstrapAccessorProxiesService !== "object"
        ) {
            throw new Error("Invalid main runtime bootstrap accessor proxies service");
        }
        const hasMissingMethod = REQUIRED_METHODS.some((methodName) => (
            typeof mainRuntimeBootstrapAccessorProxiesService[methodName] !== "function"
        ));
        if (hasMissingMethod) {
            throw new Error("Invalid main runtime bootstrap accessor proxies service");
        }

        return Object.freeze({
            ...mainRuntimeBootstrapAccessorProxiesService
        });
    }

    globalObj.GTVMainRuntimeBootstrapAccessorBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
