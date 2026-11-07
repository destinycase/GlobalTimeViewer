(function initGtvMainRuntimeServiceBridgeHelperBindings(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { runtimeServiceBridgeHelpersModule, ...forwardDeps } = safeDeps;
        if (
            !runtimeServiceBridgeHelpersModule
            || typeof runtimeServiceBridgeHelpersModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainRuntimeServiceBridgeHelpers.createService");
        }

        const mainRuntimeServiceBridgeHelpersService = runtimeServiceBridgeHelpersModule.createService(forwardDeps);
        if (!mainRuntimeServiceBridgeHelpersService || typeof mainRuntimeServiceBridgeHelpersService !== "object") {
            throw new Error("Invalid main runtime service bridge helpers service");
        }

        return Object.freeze({
            mainRuntimeServiceBridgeHelpersService
        });
    }

    globalObj.GTVMainRuntimeServiceBridgeHelperBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
