(function initGtvMainStateInitializerBindings(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { stateInitializerModule, ...forwardDeps } = safeDeps;
        if (
            !stateInitializerModule
            || typeof stateInitializerModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainStateInitializer.createService");
        }

        const mainStateInitializerService = stateInitializerModule.createService(forwardDeps);
        if (
            !mainStateInitializerService
            || typeof mainStateInitializerService !== "object"
            || typeof mainStateInitializerService.deriveInitialState !== "function"
        ) {
            throw new Error("Invalid main state initializer service");
        }

        return Object.freeze({
            mainStateInitializerService
        });
    }

    globalObj.GTVMainStateInitializerBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
