(function initGtvMainStateDomainWrapperGlobalBindingsBridge(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { stateDomainWrapperGlobalBindingsModule, ...forwardDeps } = safeDeps;
        if (
            !stateDomainWrapperGlobalBindingsModule
            || typeof stateDomainWrapperGlobalBindingsModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainStateDomainWrapperGlobalBindings.createService");
        }

        const mainStateDomainWrapperGlobalBindingsService = stateDomainWrapperGlobalBindingsModule.createService(forwardDeps);
        if (
            !mainStateDomainWrapperGlobalBindingsService
            || typeof mainStateDomainWrapperGlobalBindingsService !== "object"
        ) {
            throw new Error("Invalid main state domain wrapper global bindings service");
        }

        return Object.freeze({
            mainStateDomainWrapperGlobalBindingsService
        });
    }

    globalObj.GTVMainStateDomainWrapperGlobalBindingsBridge = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
