(function initGtvMainRuntimeHostUtilsBindings(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { runtimeHostUtilsModule, ...forwardDeps } = safeDeps;
        if (
            !runtimeHostUtilsModule
            || typeof runtimeHostUtilsModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainRuntimeHostUtils.createService");
        }

        const mainRuntimeHostUtilsService = runtimeHostUtilsModule.createService(forwardDeps);
        if (!mainRuntimeHostUtilsService || typeof mainRuntimeHostUtilsService !== "object") {
            throw new Error("Invalid main runtime host utils service");
        }

        return Object.freeze({
            mainRuntimeHostUtilsService
        });
    }

    globalObj.GTVMainRuntimeHostUtilsBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
