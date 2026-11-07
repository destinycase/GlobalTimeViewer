(function initGtvMainImageRuntimeServices(globalObj) {
    "use strict";

    function requireCreateServiceModule(moduleApi, label) {
        if (!moduleApi || typeof moduleApi.createService !== "function") {
            throw new Error(`Missing required module API: ${label}.createService`);
        }
        return moduleApi;
    }

    function resolveDocumentRef(explicitDocument, fallbackDocument = null) {
        if (explicitDocument) return explicitDocument;
        if (fallbackDocument) return fallbackDocument;
        if (globalObj?.document) return globalObj.document;
        if (typeof document === "object" && document) return document;
        return null;
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

        const imageCloneApi = requireCreateServiceModule(safeDeps.GTV_IMAGE_CLONE, "GTVImageClone");
        const imageForeignRenderApi = requireCreateServiceModule(safeDeps.GTV_IMAGE_FOREIGN_RENDER, "GTVImageForeignRender");
        const imageExportBridgeApi = requireCreateServiceModule(safeDeps.GTV_IMAGE_EXPORT_BRIDGE, "GTVImageExportBridge");
        const tableImageRenderApi = requireCreateServiceModule(safeDeps.GTV_TABLE_IMAGE_RENDER, "GTVTableImageRender");
        const multiRangeImageRenderApi = requireCreateServiceModule(safeDeps.GTV_MULTI_RANGE_IMAGE_RENDER, "GTVMultiRangeImageRender");

        const imageCloneService = imageCloneApi.createService({
            documentRef: resolveDocumentRef(safeDeps.documentRef, safeDeps.document),
            document: resolveDocumentRef(safeDeps.documentRef, safeDeps.document)
        });

        const imageForeignRenderService = imageForeignRenderApi.createService({
            ...pickDeps([
                "TABLE_IMAGE_EXPORT_WIDTH",
                "getCanUseForeignObjectRenderer",
                "setCanUseForeignObjectRenderer"
            ])
        });

        let tableImageRenderService = null;
        let multiRangeImageRenderService = null;

        const imageExportBridgeService = imageExportBridgeApi.createService({
            getImageCloneService: () => imageCloneService,
            getImageForeignRenderService: () => imageForeignRenderService,
            getTableImageRenderService: () => tableImageRenderService,
            getMultiRangeImageRenderService: () => multiRangeImageRenderService,
            ...pickDeps([
                "getImageExportActionsService",
                "getDefaultTableExportContext"
            ])
        });

        tableImageRenderService = tableImageRenderApi.createService({
            ...pickDeps([
                "EXPORT_MONO_FONT_FAMILY",
                "isFixedTimeTab",
                "waitForDocumentFontsReady",
                "prepareExportCanvas",
                "drawExportCellText",
                "cloneTableForImageExport",
                "renderElementWithForeignObjectToPngDataUrl"
            ])
        });

        multiRangeImageRenderService = multiRangeImageRenderApi.createService({
            ...pickDeps([
                "EXPORT_MONO_FONT_FAMILY",
                "t",
                "waitForDocumentFontsReady",
                "ensureMultiRangeState",
                "getBaseTimezoneRef",
                "getMultiRanges",
                "getMultiRangeTitleText",
                "cloneMultiRangeBlockForImageExport",
                "prepareExportCanvas",
                "drawExportCellText"
            ]),
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
