(function initGtvMainFoundationServicesBindings(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const {
            foundationServicesModule,
            mainFoundationConfig
        } = safeDeps;
        if (
            !foundationServicesModule
            || typeof foundationServicesModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainFoundationServices.createService");
        }

        const mainFoundationServices = foundationServicesModule.createService(mainFoundationConfig);
        if (!mainFoundationServices || typeof mainFoundationServices !== "object") {
            throw new Error("Invalid main foundation services");
        }

        return Object.freeze({
            mainFoundationServices
        });
    }

    globalObj.GTVMainFoundationServicesBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
