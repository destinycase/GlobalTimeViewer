(function initGtvMainPatchedStateAccessorBindings(globalObj) {
    "use strict";

    const REQUIRED_PROXY_METHODS = Object.freeze([
        "getPatchedAppStateSnapshot",
        "patchAppState",
        "getPatchedStateValue",
        "getPatchedIntegerStateValue",
        "getPatchedBooleanStateValue",
        "getPatchedStringStateValue",
        "getPatchedArrayStateValue",
        "getPatchedObjectStateValue",
        "getPatchedMainTabState",
        "getPatchedSlotCountState",
        "setPatchedSlotCountState",
        "getPatchedShowCopyFormatState",
        "setPatchedShowCopyFormatState",
        "getPatchedShowTimelineState",
        "setPatchedShowTimelineState",
        "getPatchedCurrentThemeState",
        "getPatchedDayStartHourState",
        "getPatchedNightStartHourState",
        "getPatchedCurrentLangState",
        "getPatchedDisplayFormatOrderState",
        "getPatchedDisplayFormatEnabledState",
        "getPatchedDisplayTimePartsEnabledState",
        "getPatchedCopyFormatOrderState",
        "getPatchedCopyFormatEnabledState",
        "getPatchedCopyTimePartsEnabledState",
        "getPatchedActiveFormatProfileContextState",
        "getPatchedActiveGroupIdState",
        "getPatchedMultiRangeCountState",
        "getPatchedMultiRangesState",
        "getPatchedMultiRangeCollapsedState",
        "getPatchedTimeAdjustDayStepBySlotState",
        "getPatchedMultiRangeTitleState"
    ]);

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { patchedStateAccessorProxiesModule, ...forwardDeps } = safeDeps;
        if (
            !patchedStateAccessorProxiesModule
            || typeof patchedStateAccessorProxiesModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainPatchedStateAccessorProxies.createService");
        }

        const mainPatchedStateAccessorProxiesService = patchedStateAccessorProxiesModule.createService(forwardDeps);
        if (
            !mainPatchedStateAccessorProxiesService
            || typeof mainPatchedStateAccessorProxiesService !== "object"
        ) {
            throw new Error("Invalid main patched state accessor proxies service");
        }
        const hasMissingMethod = REQUIRED_PROXY_METHODS.some((methodName) => (
            typeof mainPatchedStateAccessorProxiesService[methodName] !== "function"
        ));
        if (hasMissingMethod) {
            throw new Error("Invalid main patched state accessor proxies service");
        }

        return Object.freeze({
            ...mainPatchedStateAccessorProxiesService
        });
    }

    globalObj.GTVMainPatchedStateAccessorBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
