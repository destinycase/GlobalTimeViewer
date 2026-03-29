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
            deferDynamicCall: safeDeps.deferDynamicCall,
            getTranslatorRef: safeDeps.getTranslatorRef,
            getShowToastRef: safeDeps.getShowToastRef,
            getIsRealtimeState: safeDeps.getIsRealtimeState,
            isMultiTab: safeDeps.isMultiTab,
            isMultiRangeStartEditEnabled: safeDeps.isMultiRangeStartEditEnabled,
            isMultiRangeEndEditEnabled: safeDeps.isMultiRangeEndEditEnabled,
            ensureMultiRangeState: safeDeps.ensureMultiRangeState,
            getPatchedMultiRangesState: safeDeps.getPatchedMultiRangesState,
            getMultiRangeSlotDate: safeDeps.getMultiRangeSlotDate,
            setMultiRangeSlotDate: safeDeps.setMultiRangeSlotDate,
            syncFollowingRangesByDuration: safeDeps.syncFollowingRangesByDuration,
            syncMultiRangeStartLinks: safeDeps.syncMultiRangeStartLinks,
            parseDateTimeParts: safeDeps.parseDateTimeParts,
            getCurrentGroupZones: safeDeps.getCurrentGroupZones,
            getCustomOffsetMinutes: safeDeps.getCustomOffsetMinutes,
            getFixedOffsetForDisplayAtDate: safeDeps.getFixedOffsetForDisplayAtDate,
            getTimezoneOffset: safeDeps.getTimezoneOffset,
            resolveLocalDatePartsViaTimeService: safeDeps.resolveLocalDatePartsViaTimeService,
            buildStrictUtcDateFromPartsViaCore: safeDeps.buildStrictUtcDateFromPartsViaCore,
            getGlobalTimeState: safeDeps.getGlobalTimeState,
            setGlobalTimeValue: safeDeps.setGlobalTimeValue,
            getUpdateClocksRef: safeDeps.getUpdateClocksRef,
            getRenderListRef: safeDeps.getRenderListRef,
            renderMultiRangesSafely: safeDeps.renderMultiRangesSafely,
            getSavePersistenceSafelyRef: safeDeps.getSavePersistenceSafelyRef
        });
        const timeInputMutationsService = createTimeInputMutationsService(timeInputMutationsConfig);

        const mainRowOrderConfig = buildMainRowOrderConfig({
            requestUiFrame: safeDeps.requestUiFrame,
            cancelUiFrame: safeDeps.cancelUiFrame,
            getGroupsStateSnapshot: safeDeps.getGroupsStateSnapshot,
            getPatchedActiveGroupIdState: safeDeps.getPatchedActiveGroupIdState,
            getCurrentGroupBaseTimezoneId: safeDeps.getCurrentGroupBaseTimezoneId,
            getPersistenceServiceRef: safeDeps.getPersistenceServiceRef,
            getDocumentRefOrNull: safeDeps.getDocumentRefOrNull,
            NodeCtor: safeDeps.NodeCtor
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
            rowViewCache: safeDeps.rowViewCache,
            MAX_RUNTIME_CACHE_SIZE: safeDeps.MAX_RUNTIME_CACHE_SIZE,
            getDocumentRefOrNull: safeDeps.getDocumentRefOrNull,
            getSnapshotFormatServiceRef: safeDeps.getSnapshotFormatServiceRef,
            getGlobalTimeState: safeDeps.getGlobalTimeState,
            getZoneDisplayName: safeDeps.getZoneDisplayName,
            getZoneDisplayNameForUiAtDate: safeDeps.getZoneDisplayNameForUiAtDate,
            getPatchedCurrentLangState: safeDeps.getPatchedCurrentLangState,
            getI18nDataRef: safeDeps.getI18nDataRef,
            getIsRealtimeState: safeDeps.getIsRealtimeState,
            getPatchedSlotCountState: safeDeps.getPatchedSlotCountState,
            normalizeDayNightMarker: safeDeps.normalizeDayNightMarker,
            getDayNightGlyph: safeDeps.getDayNightGlyph,
            gtvT: safeDeps.gtvT
        });
        const mainRowViewServices = createMainRowViewServices(mainRowViewConfig);
        const { updateRow } = mainRowViewServices;

        const tableRenderConfig = buildTableRenderConfig({
            gtvT: safeDeps.gtvT,
            sanitizeCopyFormatOrder: safeDeps.sanitizeCopyFormatOrder,
            getPatchedDisplayFormatOrderState: safeDeps.getPatchedDisplayFormatOrderState,
            getPatchedDisplayFormatEnabledState: safeDeps.getPatchedDisplayFormatEnabledState,
            getPatchedDisplayTimePartsEnabledState: safeDeps.getPatchedDisplayTimePartsEnabledState,
            getIsRealtimeState: safeDeps.getIsRealtimeState,
            getPatchedSlotCountState: safeDeps.getPatchedSlotCountState,
            isMultiTab: safeDeps.isMultiTab,
            renderMultiRangesSafely: safeDeps.renderMultiRangesSafely,
            getBaseTimezoneRef: safeDeps.getBaseTimezoneRef,
            getGlobalTimeState: safeDeps.getGlobalTimeState,
            escapeHtmlViaSharedUtils: safeDeps.escapeHtmlViaSharedUtils,
            getZoneDisplayName: safeDeps.getZoneDisplayName,
            getZoneDisplayNameForUiAtDate: safeDeps.getZoneDisplayNameForUiAtDate,
            removeTimezone: safeDeps.removeTimezone,
            handleTimeChange: safeDeps.handleTimeChange,
            saveOrder,
            getCurrentGroupZones: safeDeps.getCurrentGroupZones,
            isCurrentGroupUtcRowVisible: safeDeps.isCurrentGroupUtcRowVisible,
            getCurrentGroupUtcRowOrder: safeDeps.getCurrentGroupUtcRowOrder,
            getUTCRef: safeDeps.getUTCRef,
            renderBaseTimeSelect: safeDeps.renderBaseTimeSelect,
            updateTimeAdjustPanelSafely: safeDeps.updateTimeAdjustPanelSafely,
            deferDynamicCall: safeDeps.deferDynamicCall,
            getUpdateClocksRef: safeDeps.getUpdateClocksRef,
            hideFloatingTooltip: safeDeps.hideFloatingTooltip,
            upgradeNativeTitleTooltips: safeDeps.upgradeNativeTitleTooltips,
            createDragGhostFromRow: safeDeps.createDragGhostFromRow,
            clearDragGhost: safeDeps.clearDragGhost,
            bindFacadeMethod: safeDeps.bindFacadeMethod,
            getCopyActionsServiceRef: safeDeps.getCopyActionsServiceRef
        });
        const tableRenderService = createTableRenderService(tableRenderConfig);

        const mainImageExportBridgeProxyConfig = buildMainImageExportBridgeProxyConfig({
            getImageExportBridgeServiceRef: safeDeps.getImageExportBridgeServiceRef,
            createDefaultTableExportContext: safeDeps.createDefaultTableExportContext
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
            GTV_IMAGE_CLONE: safeDeps.GTV_IMAGE_CLONE,
            GTV_IMAGE_FOREIGN_RENDER: safeDeps.GTV_IMAGE_FOREIGN_RENDER,
            GTV_IMAGE_EXPORT_BRIDGE: safeDeps.GTV_IMAGE_EXPORT_BRIDGE,
            GTV_TABLE_IMAGE_RENDER: safeDeps.GTV_TABLE_IMAGE_RENDER,
            GTV_MULTI_RANGE_IMAGE_RENDER: safeDeps.GTV_MULTI_RANGE_IMAGE_RENDER,
            TABLE_IMAGE_EXPORT_WIDTH: safeDeps.TABLE_IMAGE_EXPORT_WIDTH,
            EXPORT_MONO_FONT_FAMILY: safeDeps.EXPORT_MONO_FONT_FAMILY,
            getDocumentRefOrNull: safeDeps.getDocumentRefOrNull,
            getCanUseForeignObjectRendererRef: safeDeps.getCanUseForeignObjectRendererRef,
            setCanUseForeignObjectRenderer: safeDeps.setCanUseForeignObjectRenderer,
            getImageExportActionsServiceRef: safeDeps.getImageExportActionsServiceRef,
            createDefaultTableExportContext: safeDeps.createDefaultTableExportContext,
            isFixedTimeTab: safeDeps.isFixedTimeTab,
            waitForDocumentFontsReady,
            prepareExportCanvas: safeDeps.prepareExportCanvas,
            drawExportCellText: safeDeps.drawExportCellText,
            cloneTableForImageExport,
            renderElementWithForeignObjectToPngDataUrl,
            gtvT: safeDeps.gtvT,
            ensureMultiRangeState: safeDeps.ensureMultiRangeState,
            getBaseTimezoneRef: safeDeps.getBaseTimezoneRef,
            getPatchedMultiRangesState: safeDeps.getPatchedMultiRangesState,
            getMultiRangeTitleTextFromRenderService: safeDeps.getMultiRangeTitleTextFromRenderService,
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
