(function initGtvMainRuntimePatchedStateFallbackBindings(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { runtimePatchedStateFallbackModule, ...forwardDeps } = safeDeps;
        if (
            !runtimePatchedStateFallbackModule
            || typeof runtimePatchedStateFallbackModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainRuntimePatchedStateFallback.createService");
        }

        const mainRuntimePatchedStateFallbackService = runtimePatchedStateFallbackModule.createService(forwardDeps);
        if (
            !mainRuntimePatchedStateFallbackService
            || typeof mainRuntimePatchedStateFallbackService !== "object"
        ) {
            throw new Error("Invalid main runtime patched state fallback service");
        }

        return Object.freeze({
            mainRuntimePatchedStateFallbackService
        });
    }

    globalObj.GTVMainRuntimePatchedStateFallbackBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
