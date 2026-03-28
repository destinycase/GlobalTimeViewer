(function initGtvMainFacadeBridgeBindings(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { facadeBridgeModule, ...forwardDeps } = safeDeps;
        if (
            !facadeBridgeModule
            || typeof facadeBridgeModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainFacadeBridge.createService");
        }

        const facadeBridgeService = facadeBridgeModule.createService(forwardDeps);
        if (!facadeBridgeService || typeof facadeBridgeService !== "object") {
            throw new Error("Invalid facade bridge service");
        }

        return Object.freeze({
            ...facadeBridgeService
        });
    }

    globalObj.GTVMainFacadeBridgeBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
