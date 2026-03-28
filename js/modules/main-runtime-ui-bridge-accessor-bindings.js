(function initGtvMainRuntimeUiBridgeAccessorBindings(globalObj) {
    "use strict";

    const REQUIRED_METHODS = Object.freeze([
        "showFatalError",
        "showToast",
        "switchMainTab",
        "refreshOptionToggleDividers",
        "getCopyFieldLabel",
        "getTimePartLabel",
        "getDisplayColumns",
        "getDisplayTimeInputMode",
        "buildRowActionCells",
        "renderList",
        "renderTimelineFrame",
        "resolveFixedTimeSlotUtcDate",
        "getFixedTimeSlotHeaderLabel",
        "renderFixedTimeTab"
    ]);

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { runtimeUiBridgeAccessorProxiesModule, ...forwardDeps } = safeDeps;
        if (
            !runtimeUiBridgeAccessorProxiesModule
            || typeof runtimeUiBridgeAccessorProxiesModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainRuntimeUiBridgeAccessorProxies.createService");
        }

        const mainRuntimeUiBridgeAccessorProxiesService = (
            runtimeUiBridgeAccessorProxiesModule.createService(forwardDeps)
        );
        if (
            !mainRuntimeUiBridgeAccessorProxiesService
            || typeof mainRuntimeUiBridgeAccessorProxiesService !== "object"
        ) {
            throw new Error("Invalid main runtime UI bridge accessor proxies service");
        }
        const hasMissingMethod = REQUIRED_METHODS.some((methodName) => (
            typeof mainRuntimeUiBridgeAccessorProxiesService[methodName] !== "function"
        ));
        if (hasMissingMethod) {
            throw new Error("Invalid main runtime UI bridge accessor proxies service");
        }

        return Object.freeze({
            ...mainRuntimeUiBridgeAccessorProxiesService
        });
    }

    globalObj.GTVMainRuntimeUiBridgeAccessorBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
