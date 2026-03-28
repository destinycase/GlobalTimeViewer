(function initGtvMainRuntimePrimaryStateBindings(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { runtimePrimaryStateModule, ...forwardDeps } = safeDeps;
        if (
            !runtimePrimaryStateModule
            || typeof runtimePrimaryStateModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainRuntimePrimaryState.createService");
        }

        const mainRuntimePrimaryStateService = runtimePrimaryStateModule.createService(forwardDeps);
        if (!mainRuntimePrimaryStateService || typeof mainRuntimePrimaryStateService !== "object") {
            throw new Error("Invalid main runtime primary state service");
        }

        return Object.freeze({
            mainRuntimePrimaryStateService
        });
    }

    globalObj.GTVMainRuntimePrimaryStateBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
