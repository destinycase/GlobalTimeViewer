(function initGtvMainRuntimeStatePatchAccessorBindings(globalObj) {
    "use strict";

    const REQUIRED_METHODS = Object.freeze([
        "applyDirectStatePatch",
        "buildPatchedStateFallbackSnapshot"
    ]);

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { runtimeStatePatchAccessorProxiesModule, ...forwardDeps } = safeDeps;
        if (
            !runtimeStatePatchAccessorProxiesModule
            || typeof runtimeStatePatchAccessorProxiesModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainRuntimeStatePatchAccessorProxies.createService");
        }

        const mainRuntimeStatePatchAccessorProxiesService = (
            runtimeStatePatchAccessorProxiesModule.createService(forwardDeps)
        );
        if (
            !mainRuntimeStatePatchAccessorProxiesService
            || typeof mainRuntimeStatePatchAccessorProxiesService !== "object"
        ) {
            throw new Error("Invalid main runtime state patch accessor proxies service");
        }
        const hasMissingMethod = REQUIRED_METHODS.some((methodName) => (
            typeof mainRuntimeStatePatchAccessorProxiesService[methodName] !== "function"
        ));
        if (hasMissingMethod) {
            throw new Error("Invalid main runtime state patch accessor proxies service");
        }

        return Object.freeze({
            ...mainRuntimeStatePatchAccessorProxiesService
        });
    }

    globalObj.GTVMainRuntimeStatePatchAccessorBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
