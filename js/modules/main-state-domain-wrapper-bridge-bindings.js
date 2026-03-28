(function initGtvMainStateDomainWrapperBridgeBindings(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { stateDomainWrapperBridgeModule, ...forwardDeps } = safeDeps;
        if (
            !stateDomainWrapperBridgeModule
            || typeof stateDomainWrapperBridgeModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainStateDomainWrapperBridge.createService");
        }

        const mainStateDomainWrapperBridgeService = stateDomainWrapperBridgeModule.createService(forwardDeps);
        if (!mainStateDomainWrapperBridgeService || typeof mainStateDomainWrapperBridgeService !== "object") {
            throw new Error("Invalid main state domain wrapper bridge service");
        }

        return Object.freeze({
            mainStateDomainWrapperBridgeService,
            ...mainStateDomainWrapperBridgeService
        });
    }

    globalObj.GTVMainStateDomainWrapperBridgeBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
