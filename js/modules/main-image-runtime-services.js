(function initGtvMainImageRuntimeServices(globalObj) {
    "use strict";

    function requireCreateServiceModule(moduleApi, label) {
        if (!moduleApi || typeof moduleApi.createService !== "function") {
            throw new Error(`Missing required module API: ${label}.createService`);
        }
        return moduleApi;
    }

    function resolveDocumentRef(explicitDocument) {
        if (explicitDocument) return explicitDocument;
        if (typeof document === "object" && document) return document;
        return null;
    }

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const imageCloneApi = requireCreateServiceModule(safeDeps.GTV_IMAGE_CLONE, "GTVImageClone");
        const imageForeignRenderApi = requireCreateServiceModule(safeDeps.GTV_IMAGE_FOREIGN_RENDER, "GTVImageForeignRender");
        const imageExportBridgeApi = requireCreateServiceModule(safeDeps.GTV_IMAGE_EXPORT_BRIDGE, "GTVImageExportBridge");
        const tableImageRenderApi = requireCreateServiceModule(safeDeps.GTV_TABLE_IMAGE_RENDER, "GTVTableImageRender");
        const multiRangeImageRenderApi = requireCreateServiceModule(safeDeps.GTV_MULTI_RANGE_IMAGE_RENDER, "GTVMultiRangeImageRender");

        const imageCloneService = imageCloneApi.createService({
            document: resolveDocumentRef(safeDeps.document)
        });

        const imageForeignRenderService = imageForeignRenderApi.createService({
            TABLE_IMAGE_EXPORT_WIDTH: safeDeps.TABLE_IMAGE_EXPORT_WIDTH,
            getCanUseForeignObjectRenderer: safeDeps.getCanUseForeignObjectRenderer,
            setCanUseForeignObjectRenderer: safeDeps.setCanUseForeignObjectRenderer
        });

        let tableImageRenderService = null;
        let multiRangeImageRenderService = null;

        const imageExportBridgeService = imageExportBridgeApi.createService({
            getImageCloneService: () => imageCloneService,
            getImageForeignRenderService: () => imageForeignRenderService,
            getTableImageRenderService: () => tableImageRenderService,
            getMultiRangeImageRenderService: () => multiRangeImageRenderService,
            getImageExportActionsService: safeDeps.getImageExportActionsService,
            getDefaultTableExportContext: safeDeps.getDefaultTableExportContext
        });

        tableImageRenderService = tableImageRenderApi.createService({
            EXPORT_MONO_FONT_FAMILY: safeDeps.EXPORT_MONO_FONT_FAMILY,
            isFixedTimeTab: safeDeps.isFixedTimeTab,
            waitForDocumentFontsReady: safeDeps.waitForDocumentFontsReady,
            prepareExportCanvas: safeDeps.prepareExportCanvas,
            drawExportCellText: safeDeps.drawExportCellText,
            cloneTableForImageExport: safeDeps.cloneTableForImageExport,
            renderElementWithForeignObjectToPngDataUrl: safeDeps.renderElementWithForeignObjectToPngDataUrl
        });

        multiRangeImageRenderService = multiRangeImageRenderApi.createService({
            EXPORT_MONO_FONT_FAMILY: safeDeps.EXPORT_MONO_FONT_FAMILY,
            t: safeDeps.t,
            waitForDocumentFontsReady: safeDeps.waitForDocumentFontsReady,
            ensureMultiRangeState: safeDeps.ensureMultiRangeState,
            getBaseTimezoneRef: safeDeps.getBaseTimezoneRef,
            getMultiRanges: safeDeps.getMultiRanges,
            getMultiRangeTitleText: safeDeps.getMultiRangeTitleText,
            cloneMultiRangeBlockForImageExport: safeDeps.cloneMultiRangeBlockForImageExport,
            prepareExportCanvas: safeDeps.prepareExportCanvas,
            drawExportCellText: safeDeps.drawExportCellText,
            extractTableCellText: (cell) =>
                tableImageRenderService && typeof tableImageRenderService.extractTableCellText === "function"
                    ? tableImageRenderService.extractTableCellText(cell)
                    : (typeof safeDeps.extractTableCellText === "function" ? safeDeps.extractTableCellText(cell) : "")
        });

        return Object.freeze({
            imageCloneService,
            imageForeignRenderService,
            imageExportBridgeService,
            tableImageRenderService,
            multiRangeImageRenderService
        });
    }

    globalObj.GTVMainImageRuntimeServices = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
