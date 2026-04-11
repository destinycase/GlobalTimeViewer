(function initGtvMainRuntimeTableImageBootstrap(globalObj) {
    "use strict";

    function requireFunction(value, label) {
        if (typeof value !== "function") {
            throw new Error(`Missing required dependency: ${label}`);
        }
        return value;
    }

    function requireObject(value, label) {
        if (!value || typeof value !== "object") {
            throw new Error(`Missing required dependency: ${label}`);
        }
        return value;
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

        const mainRuntimeServiceConfigBuilderService = requireObject(
            safeDeps.mainRuntimeServiceConfigBuilderService,
            "mainRuntimeServiceConfigBuilderService"
        );
        const mainCoreServices = requireObject(safeDeps.mainCoreServices, "mainCoreServices");

        const buildTimeInputMutationsConfig = requireFunction(
            mainRuntimeServiceConfigBuilderService.buildTimeInputMutationsConfig,
            "mainRuntimeServiceConfigBuilderService.buildTimeInputMutationsConfig"
        );
        const buildMainRowOrderConfig = requireFunction(
            mainRuntimeServiceConfigBuilderService.buildMainRowOrderConfig,
            "mainRuntimeServiceConfigBuilderService.buildMainRowOrderConfig"
        );
        const buildMainRowViewConfig = requireFunction(
            mainRuntimeServiceConfigBuilderService.buildMainRowViewConfig,
            "mainRuntimeServiceConfigBuilderService.buildMainRowViewConfig"
        );
        const buildTableRenderConfig = requireFunction(
            mainRuntimeServiceConfigBuilderService.buildTableRenderConfig,
            "mainRuntimeServiceConfigBuilderService.buildTableRenderConfig"
        );
        const buildMainImageExportBridgeProxyConfig = requireFunction(
            mainRuntimeServiceConfigBuilderService.buildMainImageExportBridgeProxyConfig,
            "mainRuntimeServiceConfigBuilderService.buildMainImageExportBridgeProxyConfig"
        );
        const buildMainImageRuntimeServicesConfig = requireFunction(
            mainRuntimeServiceConfigBuilderService.buildMainImageRuntimeServicesConfig,
            "mainRuntimeServiceConfigBuilderService.buildMainImageRuntimeServicesConfig"
        );
        const createTimeInputMutationsService = requireFunction(
            mainCoreServices.createTimeInputMutationsService,
            "mainCoreServices.createTimeInputMutationsService"
        );
        const createMainRowOrderServices = requireFunction(
            mainCoreServices.createMainRowOrderServices,
            "mainCoreServices.createMainRowOrderServices"
        );
        const createMainRowViewServices = requireFunction(
            mainCoreServices.createMainRowViewServices,
            "mainCoreServices.createMainRowViewServices"
        );
        const createTableRenderService = requireFunction(
            mainCoreServices.createTableRenderService,
            "mainCoreServices.createTableRenderService"
        );
        const createMainImageExportBridgeProxy = requireFunction(
            mainCoreServices.createMainImageExportBridgeProxy,
            "mainCoreServices.createMainImageExportBridgeProxy"
        );
        const createMainImageRuntimeServices = requireFunction(
            mainCoreServices.createMainImageRuntimeServices,
            "mainCoreServices.createMainImageRuntimeServices"
        );

        const timeInputMutationsConfig = buildTimeInputMutationsConfig({
            ...pickDeps([
                "deferDynamicCall",
                "getTranslatorRef",
                "getShowToastRef",
                "getIsRealtimeState",
                "isMultiTab",
                "isMultiRangeStartEditEnabled",
                "isMultiRangeEndEditEnabled",
                "ensureMultiRangeState",
                "getPatchedMultiRangesState",
                "getMultiRangeSlotDate",
                "setMultiRangeSlotDate",
                "syncFollowingRangesByDuration",
                "syncMultiRangeStartLinks",
                "parseDateTimeParts",
                "getCurrentGroupZones",
                "getCustomOffsetMinutes",
                "getFixedOffsetForDisplayAtDate",
                "getTimezoneOffset",
                "resolveLocalDatePartsViaTimeService",
                "buildStrictUtcDateFromPartsViaCore",
                "getGlobalTimeState",
                "setGlobalTimeValue",
                "getUpdateClocksRef",
                "getRenderListRef",
                "renderMultiRangesSafely",
                "getSavePersistenceSafelyRef",
            ]),
        });
        const timeInputMutationsService = createTimeInputMutationsService(timeInputMutationsConfig);

        const mainRowOrderConfig = buildMainRowOrderConfig({
            ...pickDeps([
                "requestUiFrame",
                "cancelUiFrame",
                "getGroupsStateSnapshot",
                "getPatchedActiveGroupIdState",
                "getCurrentGroupBaseTimezoneId",
                "getPersistenceServiceRef",
                "getDocumentRefOrNull",
                "NodeCtor",
            ]),
        });
        const mainRowOrderServices = createMainRowOrderServices(mainRowOrderConfig);
        const {
            bindRowContainerDragAndDrop,
            initDragAndDrop,
            captureReorderableRowRects,
            animateReorderTransition,
            getAfter,
            saveOrderForContainer,
            saveOrder
        } = mainRowOrderServices;

        const mainRowViewConfig = buildMainRowViewConfig({
            ...pickDeps([
                "rowViewCache",
                "MAX_RUNTIME_CACHE_SIZE",
                "getDocumentRefOrNull",
                "getSnapshotFormatServiceRef",
                "getGlobalTimeState",
                "getZoneDisplayName",
                "getZoneDisplayNameForUiAtDate",
                "getPatchedCurrentLangState",
                "getI18nDataRef",
                "getIsRealtimeState",
                "getPatchedSlotCountState",
                "normalizeDayNightMarker",
                "getDayNightGlyph",
                "gtvT",
            ]),
        });
        const mainRowViewServices = createMainRowViewServices(mainRowViewConfig);
        const { updateRow } = mainRowViewServices;

        const tableRenderConfig = buildTableRenderConfig({
            ...pickDeps([
                "gtvT",
                "sanitizeCopyFormatOrder",
                "getPatchedDisplayFormatOrderState",
                "getPatchedDisplayFormatEnabledState",
                "getPatchedDisplayTimePartsEnabledState",
                "getIsRealtimeState",
                "getPatchedSlotCountState",
                "isMultiTab",
                "renderMultiRangesSafely",
                "getBaseTimezoneRef",
                "getGlobalTimeState",
                "escapeHtmlViaSharedUtils",
                "getZoneDisplayName",
                "getZoneDisplayNameForUiAtDate",
                "removeTimezone",
                "handleTimeChange",
            ]),
            saveOrder,
            ...pickDeps([
                "getCurrentGroupZones",
                "isCurrentGroupUtcRowVisible",
                "getCurrentGroupUtcRowOrder",
                "getUTCRef",
                "renderBaseTimeSelect",
                "updateTimeAdjustPanelSafely",
                "deferDynamicCall",
                "getUpdateClocksRef",
                "hideFloatingTooltip",
                "upgradeNativeTitleTooltips",
                "createDragGhostFromRow",
                "clearDragGhost",
                "bindFacadeMethod",
                "getCopyActionsServiceRef",
            ]),
        });
        const tableRenderService = createTableRenderService(tableRenderConfig);

        const mainImageExportBridgeProxyConfig = buildMainImageExportBridgeProxyConfig({
            ...pickDeps([
                "getImageExportBridgeServiceRef",
                "createDefaultTableExportContext",
            ]),
        });
        const mainImageExportBridgeProxy = createMainImageExportBridgeProxy(mainImageExportBridgeProxyConfig);
        const {
            collectDocumentCssText,
            cloneTableForImageExport,
            cloneMultiRangeBlockForImageExport,
            renderElementWithForeignObjectToPngDataUrl,
            loadImageElement,
            waitForDocumentFontsReady,
            isDomExceptionLike,
            detectForeignObjectRendererSupport,
            extractTableCellText,
            extractTableHeaderText,
            getActiveTableExportContext,
            renderTimezoneTableFallbackDataUrl,
            renderTimezoneTableToPngDataUrl,
            renderMultiRangesFallbackDataUrl,
            renderMultiRangesToPngDataUrl,
            renderMultiRangeSingleToPngDataUrl,
            renderMultiRangeTitlesToPngDataUrl,
            saveTimezoneTableImage,
            saveMultiRangeTitlesImage,
            saveMultiRangeSingleImage,
            getImageExportDeps
        } = mainImageExportBridgeProxy;

        const mainImageRuntimeServicesConfig = buildMainImageRuntimeServicesConfig({
            ...pickDeps([
                "GTV_IMAGE_CLONE",
                "GTV_IMAGE_FOREIGN_RENDER",
                "GTV_IMAGE_EXPORT_BRIDGE",
                "GTV_TABLE_IMAGE_RENDER",
                "GTV_MULTI_RANGE_IMAGE_RENDER",
                "TABLE_IMAGE_EXPORT_WIDTH",
                "EXPORT_MONO_FONT_FAMILY",
                "getDocumentRefOrNull",
                "getCanUseForeignObjectRendererRef",
                "setCanUseForeignObjectRenderer",
                "getImageExportActionsServiceRef",
                "createDefaultTableExportContext",
                "isFixedTimeTab",
            ]),
            waitForDocumentFontsReady,
            ...pickDeps([
                "prepareExportCanvas",
                "drawExportCellText",
            ]),
            cloneTableForImageExport,
            renderElementWithForeignObjectToPngDataUrl,
            ...pickDeps([
                "gtvT",
                "ensureMultiRangeState",
                "getBaseTimezoneRef",
                "getPatchedMultiRangesState",
                "getMultiRangeTitleTextFromRenderService",
            ]),
            cloneMultiRangeBlockForImageExport,
            extractTableCellText
        });
        const mainImageRuntimeServices = createMainImageRuntimeServices(mainImageRuntimeServicesConfig);
        const imageCloneService = mainImageRuntimeServices.imageCloneService;
        const imageForeignRenderService = mainImageRuntimeServices.imageForeignRenderService;
        const imageExportBridgeService = mainImageRuntimeServices.imageExportBridgeService;
        const tableImageRenderService = mainImageRuntimeServices.tableImageRenderService;
        const multiRangeImageRenderService = mainImageRuntimeServices.multiRangeImageRenderService;

        return Object.freeze({
            timeInputMutationsService,
            bindRowContainerDragAndDrop,
            initDragAndDrop,
            captureReorderableRowRects,
            animateReorderTransition,
            getAfter,
            saveOrderForContainer,
            saveOrder,
            updateRow,
            tableRenderService,
            collectDocumentCssText,
            cloneTableForImageExport,
            cloneMultiRangeBlockForImageExport,
            renderElementWithForeignObjectToPngDataUrl,
            loadImageElement,
            waitForDocumentFontsReady,
            isDomExceptionLike,
            detectForeignObjectRendererSupport,
            extractTableCellText,
            extractTableHeaderText,
            getActiveTableExportContext,
            renderTimezoneTableFallbackDataUrl,
            renderTimezoneTableToPngDataUrl,
            renderMultiRangesFallbackDataUrl,
            renderMultiRangesToPngDataUrl,
            renderMultiRangeSingleToPngDataUrl,
            renderMultiRangeTitlesToPngDataUrl,
            saveTimezoneTableImage,
            saveMultiRangeTitlesImage,
            saveMultiRangeSingleImage,
            getImageExportDeps,
            imageCloneService,
            imageForeignRenderService,
            imageExportBridgeService,
            tableImageRenderService,
            multiRangeImageRenderService
        });
    }

    globalObj.GTVMainRuntimeTableImageBootstrap = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
