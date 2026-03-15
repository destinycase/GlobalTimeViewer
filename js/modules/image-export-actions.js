(function initGtvImageExportActions(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        let boundImageExportService = null;

        function getImageExportApi() {
            if (safeDeps.imageExportApi && typeof safeDeps.imageExportApi === "object") return safeDeps.imageExportApi;
            if (globalObj && typeof globalObj.GTVImageExport === "object") return globalObj.GTVImageExport;
            return null;
        }

        function getImageExportDeps() {
            return {
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
            };
        }

        function getBoundImageExportService() {
            if (boundImageExportService) return boundImageExportService;
            const api = getImageExportApi();
            if (!api || typeof api.createService !== "function") return null;
            try {
                boundImageExportService = api.createService(getImageExportDeps());
            } catch (err) {
                console.warn("[GTVImageExportActions] Failed to create bound image export service.", err);
                boundImageExportService = null;
            }
            return boundImageExportService;
        }

        async function callImageExport(methodName, ...args) {
            const bound = getBoundImageExportService();
            if (bound && typeof bound[methodName] === "function") {
                return await bound[methodName](...args);
            }

            const api = getImageExportApi();
            if (api && typeof api[methodName] === "function") {
                return await api[methodName](getImageExportDeps(), ...args);
            }

            console.error(`[GTVImageExportActions] Missing image export method: ${methodName}`);
            return undefined;
        }

        return Object.freeze({
            getImageExportDeps,
            saveTimezoneTableImage: () => callImageExport("saveTimezoneTableImage"),
            saveMultiRangeTitlesImage: () => callImageExport("saveMultiRangeTitlesImage"),
            saveMultiRangeAllImage: () => callImageExport("saveMultiRangeAllImage"),
            saveMultiRangeSingleImage: (rangeIdx) => callImageExport("saveMultiRangeSingleImage", rangeIdx)
        });
    }

    globalObj.GTVImageExportActions = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
