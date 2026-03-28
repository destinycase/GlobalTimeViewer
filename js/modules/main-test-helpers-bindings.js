(function initGtvMainTestHelpersBindings(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { testHelpersModule, ...forwardDeps } = safeDeps;
        if (
            !testHelpersModule
            || typeof testHelpersModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainTestHelpers.createService");
        }

        const mainTestHelpersService = testHelpersModule.createService(forwardDeps);
        if (!mainTestHelpersService || typeof mainTestHelpersService !== "object") {
            throw new Error("Invalid main test helpers service");
        }

        return Object.freeze({
            mainTestHelpersService
        });
    }

    globalObj.GTVMainTestHelpersBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
