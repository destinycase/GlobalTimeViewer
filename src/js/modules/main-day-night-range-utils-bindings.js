(function initGtvMainDayNightRangeUtilsBindings(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { dayNightRangeUtilsModule, ...forwardDeps } = safeDeps;
        if (
            !dayNightRangeUtilsModule
            || typeof dayNightRangeUtilsModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainDayNightRangeUtils.createService");
        }

        const mainDayNightRangeUtilsService = dayNightRangeUtilsModule.createService(forwardDeps);
        if (
            !mainDayNightRangeUtilsService
            || typeof mainDayNightRangeUtilsService !== "object"
            || typeof mainDayNightRangeUtilsService.sanitizeDayNightHourValue !== "function"
            || typeof mainDayNightRangeUtilsService.normalizeDayNightRangeValues !== "function"
        ) {
            throw new Error("Invalid main day night range utils service");
        }

        return Object.freeze({
            mainDayNightRangeUtilsService
        });
    }

    globalObj.GTVMainDayNightRangeUtilsBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
