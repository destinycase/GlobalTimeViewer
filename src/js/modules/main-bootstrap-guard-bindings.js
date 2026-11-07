(function initGtvMainBootstrapGuardBindings(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { bootstrapGuardModule, ...forwardDeps } = safeDeps;
        if (
            !bootstrapGuardModule
            || typeof bootstrapGuardModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainBootstrapGuard.createService");
        }

        const mainBootstrapGuardService = bootstrapGuardModule.createService(forwardDeps);
        if (
            !mainBootstrapGuardService
            || typeof mainBootstrapGuardService !== "object"
            || typeof mainBootstrapGuardService.assertRequiredServices !== "function"
        ) {
            throw new Error("Invalid main bootstrap guard service");
        }

        return Object.freeze({
            mainBootstrapGuardService
        });
    }

    globalObj.GTVMainBootstrapGuardBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
