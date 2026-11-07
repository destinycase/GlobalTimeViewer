(function initGtvMainRuntimeOperationAccessorBindings(globalObj) {
    "use strict";

    const REQUIRED_METHODS = Object.freeze([
        "updateClocks",
        "resolveLocalDatePartsByTimezoneAtDate",
        "resolveLocalDatePartsByTimezone",
        "buildStrictUtcDateFromParts",
        "handleTimeChange",
        "handleMultiRangeTimeChange",
        "formatTimeTextByParts",
        "formatSnapshotText",
        "initCalculators",
        "copyText",
        "getPersistenceSnapshot",
        "sanitizeGroup",
        "loadPersistence"
    ]);

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { runtimeOperationAccessorProxiesModule, ...forwardDeps } = safeDeps;
        if (
            !runtimeOperationAccessorProxiesModule
            || typeof runtimeOperationAccessorProxiesModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainRuntimeOperationAccessorProxies.createService");
        }

        const mainRuntimeOperationAccessorProxiesService = (
            runtimeOperationAccessorProxiesModule.createService(forwardDeps)
        );
        if (
            !mainRuntimeOperationAccessorProxiesService
            || typeof mainRuntimeOperationAccessorProxiesService !== "object"
        ) {
            throw new Error("Invalid main runtime operation accessor proxies service");
        }
        const hasMissingMethod = REQUIRED_METHODS.some((methodName) => (
            typeof mainRuntimeOperationAccessorProxiesService[methodName] !== "function"
        ));
        if (hasMissingMethod) {
            throw new Error("Invalid main runtime operation accessor proxies service");
        }

        return Object.freeze({
            ...mainRuntimeOperationAccessorProxiesService
        });
    }

    globalObj.GTVMainRuntimeOperationAccessorBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
