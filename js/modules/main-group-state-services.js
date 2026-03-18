(function initGtvMainGroupStateServices(globalObj) {
    "use strict";

    function requireCreateServiceModule(moduleApi, label) {
        if (!moduleApi || typeof moduleApi.createService !== "function") {
            throw new Error(`Missing required module API: ${label}.createService`);
        }
        return moduleApi;
    }

    function requireGroupStateFactory(serviceBootstrap) {
        if (!serviceBootstrap || typeof serviceBootstrap.createGroupStateService !== "function") {
            throw new Error("Missing required module API: serviceBootstrap.createGroupStateService");
        }
        return serviceBootstrap;
    }

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const multiStateApi = requireCreateServiceModule(safeDeps.GTV_MULTI_STATE, "GTVMultiState");
        const groupStateFactory = requireGroupStateFactory(safeDeps.serviceBootstrap);

        const multiStateService = multiStateApi.createService({
            MIN_MULTI_RANGE_COUNT: safeDeps.MIN_MULTI_RANGE_COUNT,
            t: safeDeps.t,
            getGroups: safeDeps.getGroups,
            getDefaultMultiRangeBounds: safeDeps.getDefaultMultiRangeBounds,
            sanitizeMultiRangeCount: safeDeps.sanitizeMultiRangeCount,
            sanitizeMultiRangeItem: safeDeps.sanitizeMultiRangeItem,
            sanitizeUtcMs: safeDeps.sanitizeUtcMs
        });

        const groupStateService = groupStateFactory.createGroupStateService({
            t: safeDeps.t,
            sanitizeTimezoneId: safeDeps.sanitizeTimezoneId,
            createUniqueTimezoneId: safeDeps.createUniqueTimezoneId,
            normalizeCustomAbbr: safeDeps.normalizeCustomAbbr,
            normalizeZoneAbbreviation: safeDeps.normalizeZoneAbbreviation,
            sanitizeBaseTimezoneId: safeDeps.sanitizeBaseTimezoneId,
            sanitizeUtcRowOrder: safeDeps.sanitizeUtcRowOrder,
            sanitizeMultiSubgroupId: (value) => multiStateService.sanitizeMultiSubgroupId(value),
            sanitizeFixedTimes: safeDeps.sanitizeFixedTimes,
            sanitizeFixedDateValue: safeDeps.sanitizeFixedDateValue,
            ensureGroupMultiSubgroups: (group, options = {}) =>
                multiStateService.ensureGroupMultiSubgroups(group, options)
        });

        return Object.freeze({
            multiStateService,
            groupStateService
        });
    }

    globalObj.GTVMainGroupStateServices = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
