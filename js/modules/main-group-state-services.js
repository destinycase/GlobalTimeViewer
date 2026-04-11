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

        function pickDeps(depNames = []) {
            const resolved = {};
            depNames.forEach((depName) => {
                resolved[depName] = safeDeps[depName];
            });
            return resolved;
        }

        const multiStateApi = requireCreateServiceModule(safeDeps.GTV_MULTI_STATE, "GTVMultiState");
        const groupStateFactory = requireGroupStateFactory(safeDeps.serviceBootstrap);

        const multiStateService = multiStateApi.createService({
            ...pickDeps([
                "MIN_MULTI_RANGE_COUNT",
                "t",
                "getGroups",
                "getDefaultMultiRangeBounds",
                "sanitizeMultiRangeCount",
                "sanitizeMultiRangeItem",
                "sanitizeUtcMs"
            ])
        });

        const groupStateService = groupStateFactory.createGroupStateService({
            ...pickDeps([
                "t",
                "sanitizeTimezoneId",
                "createUniqueTimezoneId",
                "normalizeCustomAbbr",
                "normalizeZoneAbbreviation",
                "sanitizeBaseTimezoneId",
                "sanitizeUtcRowOrder"
            ]),
            sanitizeMultiSubgroupId: (value) => multiStateService.sanitizeMultiSubgroupId(value),
            ...pickDeps([
                "sanitizeFixedTimes",
                "sanitizeFixedDateValue",
                "sanitizeFixedTimeShowLiveNow"
            ]),
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
