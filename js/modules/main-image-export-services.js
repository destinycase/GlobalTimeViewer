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
        const imageExportNamingApi = requireCreateServiceModule(safeDeps.GTV_IMAGE_EXPORT_NAMING, "GTVImageExportNaming");
        const imageExportActionsApi = requireCreateServiceModule(safeDeps.GTV_IMAGE_EXPORT_ACTIONS, "GTVImageExportActions");

        const imageExportNamingService = imageExportNamingApi.createService({
            t: safeDeps.t,
            pad: safeDeps.pad,
            timeService: safeDeps.timeService,
            getCustomOffsetMinutes: safeDeps.getCustomOffsetMinutes,
            getBaseTimezoneRef: safeDeps.getBaseTimezoneRef,
            getBaseTime: safeDeps.getBaseTime,
            getActiveGroupName: safeDeps.getActiveGroupName,
            getZoneAbbreviation: safeDeps.getZoneAbbreviation,
            sanitizeMultiSubgroupName: safeDeps.sanitizeMultiSubgroupName,
            getCurrentMultiSubgroupName: safeDeps.getCurrentMultiSubgroupName
        });

        const imageExportActionsService = imageExportActionsApi.createService({
            imageExportApi: safeDeps.imageExportApi,
            t: safeDeps.t,
            showToast: safeDeps.showToast,
            isMultiTab: safeDeps.isMultiTab,
            ensureMultiRangeState: safeDeps.ensureMultiRangeState,
            detectForeignObjectRendererSupport: safeDeps.detectForeignObjectRendererSupport,
            renderTimezoneTableToPngDataUrl: safeDeps.renderTimezoneTableToPngDataUrl,
            renderTimezoneTableFallbackDataUrl: safeDeps.renderTimezoneTableFallbackDataUrl,
            renderMultiRangesToPngDataUrl: safeDeps.renderMultiRangesToPngDataUrl,
            renderMultiRangeSingleToPngDataUrl: safeDeps.renderMultiRangeSingleToPngDataUrl,
            renderMultiRangesFallbackDataUrl: safeDeps.renderMultiRangesFallbackDataUrl,
            renderMultiRangeTitlesToPngDataUrl: safeDeps.renderMultiRangeTitlesToPngDataUrl,
            getTimezoneTableImageFilename: safeDeps.getTimezoneTableImageFilename,
            getMultiRangeTableImageFilename: safeDeps.getMultiRangeTableImageFilename,
            getMultiRangeTitlesImageFilename: safeDeps.getMultiRangeTitlesImageFilename,
            getMultiRanges: safeDeps.getMultiRanges,
            isDomExceptionLike: safeDeps.isDomExceptionLike,
            setCanUseForeignObjectRenderer: safeDeps.setCanUseForeignObjectRenderer
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
