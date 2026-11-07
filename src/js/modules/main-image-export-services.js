(function initGtvMainImageExportServices(globalObj) {
    "use strict";

    function requireCreateServiceModule(moduleApi, label) {
        if (!moduleApi || typeof moduleApi.createService !== "function") {
            throw new Error(`Missing required module API: ${label}.createService`);
        }
        return moduleApi;
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

        const imageExportNamingApi = requireCreateServiceModule(safeDeps.GTV_IMAGE_EXPORT_NAMING, "GTVImageExportNaming");
        const imageExportActionsApi = requireCreateServiceModule(safeDeps.GTV_IMAGE_EXPORT_ACTIONS, "GTVImageExportActions");

        const imageExportNamingService = imageExportNamingApi.createService({
            ...pickDeps([
                "t",
                "pad",
                "timeService",
                "getCustomOffsetMinutes",
                "getBaseTimezoneRef",
                "getBaseTime",
                "getActiveGroupName",
                "getZoneAbbreviation",
                "sanitizeMultiSubgroupName",
                "getCurrentMultiSubgroupName"
            ])
        });

        const imageExportActionsService = imageExportActionsApi.createService({
            ...pickDeps([
                "imageExportApi",
                "t",
                "showToast",
                "isMultiTab",
                "ensureMultiRangeState",
                "detectForeignObjectRendererSupport",
                "renderTimezoneTableToPngDataUrl",
                "renderTimezoneTableFallbackDataUrl",
                "renderMultiRangesToPngDataUrl",
                "renderMultiRangeSingleToPngDataUrl",
                "renderMultiRangesFallbackDataUrl",
                "renderMultiRangeTitlesToPngDataUrl",
                "getTimezoneTableImageFilename",
                "getMultiRangeTableImageFilename",
                "getMultiRangeTitlesImageFilename",
                "getMultiRanges",
                "isDomExceptionLike",
                "setCanUseForeignObjectRenderer"
            ])
        });

        return Object.freeze({
            imageExportNamingService,
            imageExportActionsService
        });
    }

    globalObj.GTVMainImageExportServices = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
