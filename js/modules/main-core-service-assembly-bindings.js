(function initGtvMainCoreServiceAssemblyBindings(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const {
            coreServiceAssemblyModule,
            mainCoreAssemblyConfig
        } = safeDeps;
        if (
            !coreServiceAssemblyModule
            || typeof coreServiceAssemblyModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainCoreServiceAssembly.createService");
        }

        const mainCoreServices = coreServiceAssemblyModule.createService(mainCoreAssemblyConfig);
        if (!mainCoreServices || typeof mainCoreServices !== "object") {
            throw new Error("Invalid main core services");
        }

        return Object.freeze({
            mainCoreServices
        });
    }

    globalObj.GTVMainCoreServiceAssemblyBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
