(function initGtvMainRuntimeReferenceAccessorBindings(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { runtimeReferenceAccessorsModule, ...forwardDeps } = safeDeps;
        if (
            !runtimeReferenceAccessorsModule
            || typeof runtimeReferenceAccessorsModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainRuntimeReferenceAccessors.createService");
        }

        const runtimeReferenceAccessorsService = runtimeReferenceAccessorsModule.createService(forwardDeps);
        if (!runtimeReferenceAccessorsService || typeof runtimeReferenceAccessorsService !== "object") {
            throw new Error("Invalid runtime reference accessors service");
        }

        return Object.freeze({
            ...runtimeReferenceAccessorsService
        });
    }

    globalObj.GTVMainRuntimeReferenceAccessorBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
