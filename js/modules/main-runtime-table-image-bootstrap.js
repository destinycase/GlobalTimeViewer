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

        function resolveDeps(overrides = {}) {
            return (overrides && typeof overrides === "object") ? overrides : {};
        }

        function pickDeps(source, ...depNames) {
            if (Array.isArray(source)) {
                depNames = source;
                source = safeDeps;
            } else if (!source || typeof source !== "object") {
                source = safeDeps;
            }
            const resolved = {};
            depNames.forEach((depName) => {
                resolved[depName] = source[depName];
            });
            return resolved;
        }

        function pickAliasedDeps(source, aliasMap = {}) {
            const resolved = {};
            Object.keys(aliasMap).forEach((targetKey) => {
                resolved[targetKey] = source[aliasMap[targetKey]];
            });
            return resolved;
        }

        function deferDynamic(source, getter) {
            if (typeof source.deferDynamicCall !== "function") return () => undefined;
            return source.deferDynamicCall(getter);
        }

        function bindFacade(source, getter, methodName) {
            if (typeof source.bindFacadeMethod !== "function") return () => undefined;
            return source.bindFacadeMethod(getter, methodName);
        }

        function buildTimeInputMutationsConfig(deps = {}) {
            const d = resolveDeps(deps);
            return {
                t: deferDynamic(d, d.getTranslatorRef),
                showToast: deferDynamic(d, d.getShowToastRef),
                ...pickAliasedDeps(d, {
                    "isRealtime": "getIsRealtimeState",
                }),
                ...pickDeps(d,
                    "isMultiTab",
                    "isMultiRangeStartEditEnabled",
                    "isMultiRangeEndEditEnabled",
                    "ensureMultiRangeState",
                ),
                ...pickAliasedDeps(d, {
                    "getMultiRanges": "getPatchedMultiRangesState",
                }),
                ...pickDeps(d,
                    "getMultiRangeSlotDate",
                    "setMultiRangeSlotDate",
                    "syncFollowingRangesByDuration",
                    "syncMultiRangeStartLinks",
                    "parseDateTimeParts",
                    "getCurrentGroupZones",
                    "getCustomOffsetMinutes",
                    "getFixedOffsetForDisplayAtDate",
                    "getTimezoneOffset",
                ),
                ...pickAliasedDeps(d, {
                    "resolveLocalDateParts": "resolveLocalDatePartsViaTimeService",
                    "buildStrictUtcDateFromParts": "buildStrictUtcDateFromPartsViaCore",
                    "getGlobalTime": "getGlobalTimeState",
                    "setGlobalTime": "setGlobalTimeValue",
                }),
                updateClocks: deferDynamic(d, d.getUpdateClocksRef),
                renderList: deferDynamic(d, d.getRenderListRef),
                ...pickAliasedDeps(d, {
                    "renderMultiRanges": "renderMultiRangesSafely",
                }),
                savePersistence: deferDynamic(d, d.getSavePersistenceSafelyRef)
            };
        }

        function buildMainRowOrderConfig(deps = {}) {
            const d = resolveDeps(deps);
            return {
                ...pickDeps(d,
                    "requestUiFrame",
                    "cancelUiFrame",
                ),
                ...pickAliasedDeps(d, {
                    "getGroups": "getGroupsStateSnapshot",
                    "getActiveGroupId": "getPatchedActiveGroupIdState",
                }),
                ...pickDeps(d, "getCurrentGroupBaseTimezoneId"),
                ...pickAliasedDeps(d, {
                    "getPersistenceService": "getPersistenceServiceRef",
                    "getDocumentRef": "getDocumentRefOrNull",
                }),
                ...pickDeps(d, "NodeCtor")
            };
        }

        function buildMainRowViewConfig(deps = {}) {
            const d = resolveDeps(deps);
            return {
                ...pickDeps(d, "rowViewCache"),
                ...pickAliasedDeps(d, {
                    "maxRuntimeCacheSize": "MAX_RUNTIME_CACHE_SIZE",
                    "getDocumentRef": "getDocumentRefOrNull",
                    "getSnapshotFormatService": "getSnapshotFormatServiceRef",
                    "getGlobalTime": "getGlobalTimeState",
                }),
                ...pickDeps(d,
                    "getZoneDisplayName",
                    "getZoneDisplayNameForUiAtDate",
                ),
                ...pickAliasedDeps(d, {
                    "getCurrentLang": "getPatchedCurrentLangState",
                    "getI18nData": "getI18nDataRef",
                    "isRealtime": "getIsRealtimeState",
                    "getSlotCount": "getPatchedSlotCountState",
                }),
                ...pickDeps(d,
                    "normalizeDayNightMarker",
                    "getDayNightGlyph",
                ),
                ...pickAliasedDeps(d, {
                    "t": "gtvT",
                }),
            };
        }

        function buildTableRenderConfig(deps = {}) {
            const d = resolveDeps(deps);
            return {
                ...pickAliasedDeps(d, {
                    "t": "gtvT",
                }),
                ...pickDeps(d, "sanitizeCopyFormatOrder"),
                ...pickAliasedDeps(d, {
                    "getDisplayFormatOrder": "getPatchedDisplayFormatOrderState",
                    "getDisplayFormatEnabled": "getPatchedDisplayFormatEnabledState",
                    "getDisplayTimePartsEnabled": "getPatchedDisplayTimePartsEnabledState",
                    "isRealtime": "getIsRealtimeState",
                    "getSlotCount": "getPatchedSlotCountState",
                }),
                ...pickDeps(d, "isMultiTab"),
                ...pickAliasedDeps(d, {
                    "renderMultiRanges": "renderMultiRangesSafely",
                }),
                ...pickDeps(d, "getBaseTimezoneRef"),
                ...pickAliasedDeps(d, {
                    "getGlobalTime": "getGlobalTimeState",
                    "escapeHtml": "escapeHtmlViaSharedUtils",
                }),
                ...pickDeps(d,
                    "getZoneDisplayName",
                    "getZoneDisplayNameForUiAtDate",
                    "removeTimezone",
                    "handleTimeChange",
                    "saveOrder",
                    "getCurrentGroupZones",
                    "isCurrentGroupUtcRowVisible",
                    "getCurrentGroupUtcRowOrder",
                    "getUTCRef",
                    "renderBaseTimeSelect",
                ),
                ...pickAliasedDeps(d, {
                    "updateTimeAdjustPanel": "updateTimeAdjustPanelSafely",
                }),
                updateClocks: deferDynamic(d, d.getUpdateClocksRef),
                ...pickDeps(d,
                    "hideFloatingTooltip",
                    "upgradeNativeTitleTooltips",
                    "createDragGhostFromRow",
                    "clearDragGhost",
                ),
                copyRow: bindFacade(d, d.getCopyActionsServiceRef, "copyRow")
            };
        }

        function buildMainImageExportBridgeProxyConfig(deps = {}) {
            const d = resolveDeps(deps);
            return {
                ...pickAliasedDeps(d, {
                    "getImageExportBridgeService": "getImageExportBridgeServiceRef",
                    "getDefaultTableExportContext": "createDefaultTableExportContext",
                }),
            };
        }

        function buildMainImageRuntimeServicesConfig(deps = {}) {
            const d = resolveDeps(deps);
            return {
                ...pickDeps(d,
                    "GTV_IMAGE_CLONE",
                    "GTV_IMAGE_FOREIGN_RENDER",
                    "GTV_IMAGE_EXPORT_BRIDGE",
                    "GTV_TABLE_IMAGE_RENDER",
                    "GTV_MULTI_RANGE_IMAGE_RENDER",
                    "TABLE_IMAGE_EXPORT_WIDTH",
                    "EXPORT_MONO_FONT_FAMILY",
                ),
                document: (typeof d.getDocumentRefOrNull === "function") ? d.getDocumentRefOrNull() : null,
                ...pickAliasedDeps(d, {
                    "getCanUseForeignObjectRenderer": "getCanUseForeignObjectRendererRef",
                }),
                ...pickDeps(d, "setCanUseForeignObjectRenderer"),
                ...pickAliasedDeps(d, {
                    "getImageExportActionsService": "getImageExportActionsServiceRef",
                    "getDefaultTableExportContext": "createDefaultTableExportContext",
                }),
                ...pickDeps(d,
                    "isFixedTimeTab",
                    "waitForDocumentFontsReady",
                    "prepareExportCanvas",
                    "drawExportCellText",
                    "cloneTableForImageExport",
                    "renderElementWithForeignObjectToPngDataUrl",
                ),
                ...pickAliasedDeps(d, {
                    "t": "gtvT",
                }),
                ...pickDeps(d,
                    "ensureMultiRangeState",
                    "getBaseTimezoneRef",
                ),
                ...pickAliasedDeps(d, {
                    "getMultiRanges": "getPatchedMultiRangesState",
                    "getMultiRangeTitleText": "getMultiRangeTitleTextFromRenderService",
                }),
                ...pickDeps(d, "cloneMultiRangeBlockForImageExport"),
                ...pickDeps(d, "extractTableCellText")
            };
        }

        const mainCoreServices = requireObject(safeDeps.mainCoreServices, "mainCoreServices");
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
