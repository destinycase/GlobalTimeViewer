(function initGtvMainRuntimeLocalStateHelpersBindings(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { runtimeLocalStateHelpersModule, ...forwardDeps } = safeDeps;
        if (
            !runtimeLocalStateHelpersModule
            || typeof runtimeLocalStateHelpersModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainRuntimeLocalStateHelpers.createService");
        }

        const mainRuntimeLocalStateHelpersService = runtimeLocalStateHelpersModule.createService(forwardDeps);
        if (
            !mainRuntimeLocalStateHelpersService
            || typeof mainRuntimeLocalStateHelpersService !== "object"
        ) {
            throw new Error("Invalid main runtime local state helpers service");
        }

        return Object.freeze({
            mainRuntimeLocalStateHelpersService
        });
    }

    globalObj.GTVMainRuntimeLocalStateHelpersBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
