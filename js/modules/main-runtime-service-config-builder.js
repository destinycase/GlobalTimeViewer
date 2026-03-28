(function initGtvMainRuntimeServiceConfigBuilder(globalObj) {
    "use strict";

    function createService() {
        function deferDynamic(d, getter) {
            if (typeof d.deferDynamicCall !== "function") return () => undefined;
            return d.deferDynamicCall(getter);
        }

        function bindFacade(d, getter, methodName) {
            if (typeof d.bindFacadeMethod !== "function") return () => undefined;
            return d.bindFacadeMethod(getter, methodName);
        }

        function buildMainSelectServicesConfig(deps = {}) {
            const d = (deps && typeof deps === "object") ? deps : {};
            return {
                getDocumentRef: d.getDocumentRefOrNull,
                getComputedStyle: d.getComputedStyleSafely,
                ensureBaseTimezoneSelection: d.ensureBaseTimezoneSelection,
                getCurrentGroupBaseTimezoneId: d.getCurrentGroupBaseTimezoneId,
                isCurrentGroupUtcRowVisible: d.isCurrentGroupUtcRowVisible,
                getCurrentGroupZones: d.getCurrentGroupZones,
                getZoneAbbreviation: d.getZoneAbbreviation,
                getZoneDisplayName: d.getZoneDisplayName,
                setCurrentGroupBaseTimezoneId: d.setCurrentGroupBaseTimezoneId,
                savePersistence: d.savePersistenceSafely,
                t: d.gtvT
            };
        }

        function buildTimezoneSearchConfig(deps = {}) {
            const d = (deps && typeof deps === "object") ? deps : {};
            return {
                TZ_DATABASE: d.TZ_DATABASE,
                getZoneMap: d.getZoneMapRef,
                t: d.gtvT,
                getCurrentLang: d.getPatchedCurrentLangState,
                getBetterAbbr: d.getBetterAbbr,
                getTimezoneOffset: d.getTimezoneOffset,
                getLocalizedTZLabel: d.getLocalizedTZLabel,
                adjustSelectWidthForContent: d.adjustSelectWidthForContent,
                getCurrentGroup: d.getCurrentGroup,
                savePersistence: d.savePersistenceSafely,
                renderList: deferDynamic(d, d.getRenderListRef),
                addTimezone: d.addTimezone,
                createUniqueTimezoneId: d.createUniqueTimezoneId
            };
        }

        function buildSnapshotFormatConfig(deps = {}) {
            const d = (deps && typeof deps === "object") ? deps : {};
            return {
                DEFAULT_COPY_TIME_PARTS_ENABLED: d.DEFAULT_COPY_TIME_PARTS_ENABLED,
                I18N_DATA: d.MAIN_I18N_DATA,
                t: d.gtvT,
                getCurrentLang: d.getPatchedCurrentLangState,
                getUTCRef: d.getUTCRef,
                getBaseTimezoneRef: d.getBaseTimezoneRef,
                getCurrentGroupZones: d.getCurrentGroupZones,
                getGlobalTimes: d.getGlobalTimesState,
                getSlotCount: d.getPatchedSlotCountState,
                isRealtime: d.getIsRealtimeState,
                getDayNightMarkerByHour: d.getDayNightMarkerByHour,
                getFixedOffsetForDisplay: d.getFixedOffsetForDisplay,
                normalizeCustomAbbr: d.normalizeCustomAbbr,
                getCustomOffsetMinutes: d.getCustomOffsetMinutes,
                pad: d.pad,
                getZoneAbbreviation: d.getZoneAbbreviation,
                getZoneDisplayName: d.getZoneDisplayName,
                getSignedInclusiveDaySpan: d.getSignedInclusiveDaySpan,
                getSignedDurationDayHourMinute: d.getSignedDurationDayHourMinute,
                sanitizeTimePartsEnabled: d.sanitizeTimePartsEnabled,
                sanitizeCopyFormatOrder: d.sanitizeCopyFormatOrder,
                timeService: d.timeService
            };
        }

        function buildTimeInputMutationsConfig(deps = {}) {
            const d = (deps && typeof deps === "object") ? deps : {};
            return {
                t: deferDynamic(d, d.getTranslatorRef),
                showToast: deferDynamic(d, d.getShowToastRef),
                isRealtime: d.getIsRealtimeState,
                isMultiTab: d.isMultiTab,
                isMultiRangeStartEditEnabled: d.isMultiRangeStartEditEnabled,
                isMultiRangeEndEditEnabled: d.isMultiRangeEndEditEnabled,
                ensureMultiRangeState: d.ensureMultiRangeState,
                getMultiRanges: d.getPatchedMultiRangesState,
                getMultiRangeSlotDate: d.getMultiRangeSlotDate,
                setMultiRangeSlotDate: d.setMultiRangeSlotDate,
                syncFollowingRangesByDuration: d.syncFollowingRangesByDuration,
                syncMultiRangeStartLinks: d.syncMultiRangeStartLinks,
                parseDateTimeParts: d.parseDateTimeParts,
                getCurrentGroupZones: d.getCurrentGroupZones,
                getCustomOffsetMinutes: d.getCustomOffsetMinutes,
                getFixedOffsetForDisplayAtDate: d.getFixedOffsetForDisplayAtDate,
                getTimezoneOffset: d.getTimezoneOffset,
                resolveLocalDateParts: d.resolveLocalDatePartsViaTimeService,
                buildStrictUtcDateFromParts: d.buildStrictUtcDateFromPartsViaCore,
                getGlobalTime: d.getGlobalTimeState,
                setGlobalTime: d.setGlobalTimeValue,
                updateClocks: deferDynamic(d, d.getUpdateClocksRef),
                renderList: deferDynamic(d, d.getRenderListRef),
                renderMultiRanges: d.renderMultiRangesSafely,
                savePersistence: deferDynamic(d, d.getSavePersistenceSafelyRef)
            };
        }

        function buildMainRowOrderConfig(deps = {}) {
            const d = (deps && typeof deps === "object") ? deps : {};
            return {
                requestUiFrame: d.requestUiFrame,
                cancelUiFrame: d.cancelUiFrame,
                getGroups: d.getGroupsStateSnapshot,
                getActiveGroupId: d.getPatchedActiveGroupIdState,
                getCurrentGroupBaseTimezoneId: d.getCurrentGroupBaseTimezoneId,
                getPersistenceService: d.getPersistenceServiceRef,
                getDocumentRef: d.getDocumentRefOrNull,
                NodeCtor: d.NodeCtor
            };
        }

        function buildMainRowViewConfig(deps = {}) {
            const d = (deps && typeof deps === "object") ? deps : {};
            return {
                rowViewCache: d.rowViewCache,
                maxRuntimeCacheSize: d.MAX_RUNTIME_CACHE_SIZE,
                getDocumentRef: d.getDocumentRefOrNull,
                getSnapshotFormatService: d.getSnapshotFormatServiceRef,
                getGlobalTime: d.getGlobalTimeState,
                getZoneDisplayName: d.getZoneDisplayName,
                getZoneDisplayNameForUiAtDate: d.getZoneDisplayNameForUiAtDate,
                getCurrentLang: d.getPatchedCurrentLangState,
                getI18nData: d.getI18nDataRef,
                isRealtime: d.getIsRealtimeState,
                getSlotCount: d.getPatchedSlotCountState,
                normalizeDayNightMarker: d.normalizeDayNightMarker,
                getDayNightGlyph: d.getDayNightGlyph,
                t: d.gtvT
            };
        }

        function buildTableRenderConfig(deps = {}) {
            const d = (deps && typeof deps === "object") ? deps : {};
            return {
                t: d.gtvT,
                sanitizeCopyFormatOrder: d.sanitizeCopyFormatOrder,
                getDisplayFormatOrder: d.getPatchedDisplayFormatOrderState,
                getDisplayFormatEnabled: d.getPatchedDisplayFormatEnabledState,
                getDisplayTimePartsEnabled: d.getPatchedDisplayTimePartsEnabledState,
                isRealtime: d.getIsRealtimeState,
                getSlotCount: d.getPatchedSlotCountState,
                isMultiTab: d.isMultiTab,
                renderMultiRanges: d.renderMultiRangesSafely,
                getBaseTimezoneRef: d.getBaseTimezoneRef,
                getGlobalTime: d.getGlobalTimeState,
                escapeHtml: d.escapeHtmlViaSharedUtils,
                getZoneDisplayName: d.getZoneDisplayName,
                getZoneDisplayNameForUiAtDate: d.getZoneDisplayNameForUiAtDate,
                removeTimezone: d.removeTimezone,
                handleTimeChange: d.handleTimeChange,
                saveOrder: d.saveOrder,
                getCurrentGroupZones: d.getCurrentGroupZones,
                isCurrentGroupUtcRowVisible: d.isCurrentGroupUtcRowVisible,
                getCurrentGroupUtcRowOrder: d.getCurrentGroupUtcRowOrder,
                getUTCRef: d.getUTCRef,
                renderBaseTimeSelect: d.renderBaseTimeSelect,
                updateTimeAdjustPanel: d.updateTimeAdjustPanelSafely,
                updateClocks: deferDynamic(d, d.getUpdateClocksRef),
                hideFloatingTooltip: d.hideFloatingTooltip,
                upgradeNativeTitleTooltips: d.upgradeNativeTitleTooltips,
                createDragGhostFromRow: d.createDragGhostFromRow,
                clearDragGhost: d.clearDragGhost,
                copyRow: bindFacade(d, d.getCopyActionsServiceRef, "copyRow")
            };
        }

        function buildMainImageExportBridgeProxyConfig(deps = {}) {
            const d = (deps && typeof deps === "object") ? deps : {};
            return {
                getImageExportBridgeService: d.getImageExportBridgeServiceRef,
                getDefaultTableExportContext: d.createDefaultTableExportContext
            };
        }

        function buildMainImageRuntimeServicesConfig(deps = {}) {
            const d = (deps && typeof deps === "object") ? deps : {};
            return {
                GTV_IMAGE_CLONE: d.GTV_IMAGE_CLONE,
                GTV_IMAGE_FOREIGN_RENDER: d.GTV_IMAGE_FOREIGN_RENDER,
                GTV_IMAGE_EXPORT_BRIDGE: d.GTV_IMAGE_EXPORT_BRIDGE,
                GTV_TABLE_IMAGE_RENDER: d.GTV_TABLE_IMAGE_RENDER,
                GTV_MULTI_RANGE_IMAGE_RENDER: d.GTV_MULTI_RANGE_IMAGE_RENDER,
                TABLE_IMAGE_EXPORT_WIDTH: d.TABLE_IMAGE_EXPORT_WIDTH,
                EXPORT_MONO_FONT_FAMILY: d.EXPORT_MONO_FONT_FAMILY,
                document: (typeof d.getDocumentRefOrNull === "function") ? d.getDocumentRefOrNull() : null,
                getCanUseForeignObjectRenderer: d.getCanUseForeignObjectRendererRef,
                setCanUseForeignObjectRenderer: d.setCanUseForeignObjectRenderer,
                getImageExportActionsService: d.getImageExportActionsServiceRef,
                getDefaultTableExportContext: d.createDefaultTableExportContext,
                isFixedTimeTab: d.isFixedTimeTab,
                waitForDocumentFontsReady: d.waitForDocumentFontsReady,
                prepareExportCanvas: d.prepareExportCanvas,
                drawExportCellText: d.drawExportCellText,
                cloneTableForImageExport: d.cloneTableForImageExport,
                renderElementWithForeignObjectToPngDataUrl: d.renderElementWithForeignObjectToPngDataUrl,
                t: d.gtvT,
                ensureMultiRangeState: d.ensureMultiRangeState,
                getBaseTimezoneRef: d.getBaseTimezoneRef,
                getMultiRanges: d.getPatchedMultiRangesState,
                getMultiRangeTitleText: d.getMultiRangeTitleTextFromRenderService,
                cloneMultiRangeBlockForImageExport: d.cloneMultiRangeBlockForImageExport,
                extractTableCellText: d.extractTableCellText
            };
        }

        function buildMainFixedTimeServicesConfig(deps = {}) {
            const d = (deps && typeof deps === "object") ? deps : {};
            return {
                GTV_FIXED_TIME_CORE: d.GTV_FIXED_TIME_CORE,
                GTV_FIXED_TIME_TIMELINE: d.GTV_FIXED_TIME_TIMELINE,
                GTV_FIXED_TIME_ACTIONS: d.GTV_FIXED_TIME_ACTIONS,
                DEFAULT_FIXED_TIME_VALUE: d.DEFAULT_FIXED_TIME_VALUE,
                MIN_FIXED_TIME_SLOT_COUNT: d.MIN_FIXED_TIME_SLOT_COUNT,
                TIMELINE_TOTAL_SECONDS: d.TIMELINE_TOTAL_SECONDS,
                I18N_DATA: d.MAIN_I18N_DATA,
                t: d.gtvT,
                getCurrentLang: d.getPatchedCurrentLangState,
                sanitizeFixedTimeValue: d.sanitizeFixedTimeValue,
                getFixedOffsetForDisplayAtDate: d.getFixedOffsetForDisplayAtDate,
                getLocalPartsByTimezone: d.getLocalPartsByTimezone,
                getUTCDateFromLocalParts: d.getUTCDateFromLocalParts,
                pad: d.pad,
                sanitizeTimePartsEnabledForContext: d.sanitizeTimePartsEnabledForContext,
                getDisplayTimePartsEnabled: d.getPatchedDisplayTimePartsEnabledState,
                getDefaultFixedTimeName: d.getDefaultFixedTimeName,
                sanitizeFixedTimeName: d.sanitizeFixedTimeName,
                getFixedDateParts: d.getFixedDatePartsFromGroup,
                getDayNightMarkerByHour: d.getDayNightMarkerByHour,
                getCurrentGroup: d.getCurrentGroup,
                ensureGroupFixedTimes: d.ensureGroupFixedTimes,
                getGlobalTime: d.getGlobalTimeState,
                resolveFixedTimeSlotUtcDate: d.resolveFixedTimeSlotUtcDate,
                clampNumber: d.clampNumber,
                getFixedTimeSlotCount: d.getFixedTimeSlotCount,
                sanitizeFixedTimeId: d.sanitizeFixedTimeId,
                getFixedTimeSlotHeaderLabel: d.getFixedTimeSlotHeaderLabel,
                sanitizeCopyFormatOrderForContext: d.sanitizeCopyFormatOrderForContext,
                sanitizeCopyFormatEnabledForContext: d.sanitizeCopyFormatEnabledForContext,
                getCopyFormatOrder: d.getPatchedCopyFormatOrderState,
                getCopyFormatEnabled: d.getPatchedCopyFormatEnabledState,
                getCopyTimePartsEnabled: d.getPatchedCopyTimePartsEnabledState,
                buildTimezoneComputedSnapshotForDates: d.buildTimezoneComputedSnapshotForDatesViaSnapshotService,
                formatSnapshotText: d.formatSnapshotTextViaSnapshotService,
                getBaseTimezoneRef: d.getBaseTimezoneRef,
                getRenderableTimezoneRows: d.getRenderableTimezoneRowsFromTableRender,
                parseDateTimeParts: d.parseDateTimeParts,
                showToast: deferDynamic(d, d.getShowToastRef),
                writeClipboard: d.writeClipboardText,
                buildFixedTimeDisplayPayloadAtUtc: d.buildFixedTimeDisplayPayloadAtUtc,
                renderFixedTimeTab: deferDynamic(d, d.getRenderFixedTimeTabRef),
                renderTimelineFrame: deferDynamic(d, d.getRenderTimelineFrameRef),
                savePersistence: deferDynamic(d, d.getSavePersistenceSafelyRef),
                setFixedTimeSlotCount: d.setFixedTimeSlotCount,
                refreshFixedTimeSlotCountControls: deferDynamic(d, d.getRefreshFixedTimeSlotCountControlsRef)
            };
        }

        function buildMainMultiRangeServicesConfig(deps = {}) {
            const d = (deps && typeof deps === "object") ? deps : {};
            return {
                GTV_MULTI_RANGE_RENDER: d.GTV_MULTI_RANGE_RENDER,
                GTV_MULTI_RANGE_COPY: d.GTV_MULTI_RANGE_COPY,
                GTV_COPY_ACTIONS: d.GTV_COPY_ACTIONS,
                I18N_DATA: d.MAIN_I18N_DATA,
                t: d.gtvT,
                getCurrentLang: d.getPatchedCurrentLangState,
                pad: d.pad,
                getDayNightMarkerByHour: d.getDayNightMarkerByHour,
                getCustomOffsetMinutes: d.getCustomOffsetMinutes,
                getFixedOffsetForDisplayAtDate: d.getFixedOffsetForDisplayAtDate,
                normalizeCustomAbbr: d.normalizeCustomAbbr,
                getZoneAbbreviation: d.getZoneAbbreviation,
                getSignedInclusiveDaySpan: d.getSignedInclusiveDaySpan,
                getSignedDurationDayHourMinute: d.getSignedDurationDayHourMinute,
                getZoneDisplayName: d.getZoneDisplayName,
                getZoneDisplayNameForUiAtDate: d.getZoneDisplayNameForUiAtDate,
                sanitizeMultiSubgroupName: d.sanitizeMultiSubgroupNameViaState,
                getCurrentMultiSubgroupName: d.getCurrentMultiSubgroupName,
                sanitizeMultiRangeTitle: d.sanitizeMultiRangeTitle,
                getMultiRangeTitle: d.getPatchedMultiRangeTitleState,
                buildStaticRowCell: d.buildStaticRowCellFromTableRender,
                buildDynamicRowCell: d.buildDynamicRowCellFromTableRender,
                isMultiRangeStartEditEnabled: d.isMultiRangeStartEditEnabled,
                isMultiRangeEndEditEnabled: d.isMultiRangeEndEditEnabled,
                handleMultiRangeTimeChange: d.handleMultiRangeTimeChange,
                copyMultiRangeRow: d.copyMultiRangeRow,
                hideFloatingTooltip: d.hideFloatingTooltip,
                ensureMultiRangeState: d.ensureMultiRangeState,
                refreshMultiRangeControls: d.refreshMultiRangeControls,
                renderMultiBulkToolSets: d.renderMultiBulkToolSets,
                getBaseTimezoneRef: d.getBaseTimezoneRef,
                escapeHtml: d.escapeHtmlViaSharedUtils,
                getDisplayColumns: d.getDisplayColumns,
                getRenderableTimezoneRows: d.getRenderableTimezoneRowsFromTableRender,
                getMultiRanges: d.getPatchedMultiRangesState,
                getMultiRangeCollapsed: d.getPatchedMultiRangeCollapsedState,
                getMultiRangeCount: d.getPatchedMultiRangeCountState,
                buildTimezoneComputedSnapshotForDates: d.buildTimezoneComputedSnapshotForDatesViaSnapshotService,
                saveMultiRangeSingleImage: d.saveMultiRangeSingleImage,
                setMultiRangesCollapsedBelow: d.setMultiRangesCollapsedBelow,
                toggleMultiRangeCollapsed: d.toggleMultiRangeCollapsed,
                renderTimeAdjustSet: d.renderTimeAdjustSet,
                applyMultiRangeTimeAdjustAction: d.applyMultiRangeTimeAdjustAction,
                attachTimeAdjustToggleLabel: d.attachTimeAdjustToggleLabel,
                setMultiRangeStartEditEnabled: d.setMultiRangeStartEditEnabled,
                setMultiRangeEndEditEnabled: d.setMultiRangeEndEditEnabled,
                getMultiDisplayColumnHeader: d.getMultiDisplayColumnHeaderFromTableRender,
                updateTimeAdjustPanel: d.updateTimeAdjustPanelSafely,
                updateCopyFormatPreview: d.updateCopyFormatPreview,
                upgradeNativeTitleTooltips: d.upgradeNativeTitleTooltips,
                showToast: deferDynamic(d, d.getShowToastRef),
                getTimezoneRefById: d.getTimezoneRefByIdFromSnapshotService,
                buildTimezoneComputedSnapshotForRange: d.buildTimezoneComputedSnapshotForRange,
                formatSnapshotText: d.formatSnapshotText,
                getCopyFormatOrder: d.getPatchedCopyFormatOrderState,
                getCopyFormatEnabled: d.getPatchedCopyFormatEnabledState,
                getCopyTimePartsEnabled: d.getPatchedCopyTimePartsEnabledState,
                writeClipboard: d.writeClipboardText,
                isShowCopyFormat: d.getPatchedShowCopyFormatState,
                isMultiTab: d.isMultiTab,
                isFixedTimeTab: d.isFixedTimeTab,
                getRowFormattedText: d.getRowFormattedTextViaSnapshotService,
                getRowCopyText: d.getRowCopyTextViaSnapshotService,
                getFixedTimePreviewCopyText: d.getFixedTimePreviewCopyText,
                getAllFixedTimeRowsCopyText: d.getAllFixedTimeRowsCopyText,
                copyAllMultiRangeTimezones: d.copyAllMultiRangeTimezones
            };
        }

        function buildMainTimeAdjustServicesConfig(deps = {}) {
            const d = (deps && typeof deps === "object") ? deps : {};
            return {
                GTV_TIME_ADJUST_UI: d.GTV_TIME_ADJUST_UI,
                GTV_MULTI_BULK_TOOLS: d.GTV_MULTI_BULK_TOOLS,
                GTV_TIME_ADJUST_ACTIONS: d.GTV_TIME_ADJUST_ACTIONS,
                MIN_TIME_ADJUST_DAY_STEP: d.MIN_TIME_ADJUST_DAY_STEP,
                MAX_TIME_ADJUST_DAY_STEP: d.MAX_TIME_ADJUST_DAY_STEP,
                DEFAULT_TIME_ADJUST_DAY_STEP: d.DEFAULT_TIME_ADJUST_DAY_STEP,
                t: d.gtvT,
                savePersistence: d.savePersistenceSafely,
                applyTimeAdjustAction: d.applyTimeAdjustAction,
                getCurrentMainTab: d.getPatchedMainTabState,
                isRealtime: d.getIsRealtimeState,
                getSlotCount: d.getPatchedSlotCountState,
                getTimeAdjustDayStepValue: d.getTimeAdjustDayStepValue,
                setTimeAdjustDayStepValue: (slotIdx, value) => {
                    const daySteps = [...(typeof d.getTimeAdjustDayStepBySlotSnapshot === "function"
                        ? d.getTimeAdjustDayStepBySlotSnapshot()
                        : [])];
                    daySteps[slotIdx] = value;
                    if (typeof d.setTimeAdjustDayStepBySlotState === "function") {
                        d.setTimeAdjustDayStepBySlotState(daySteps);
                    }
                },
                upgradeNativeTitleTooltips: d.upgradeNativeTitleTooltips,
                getMultiRangeCount: d.getPatchedMultiRangeCountState,
                applyBulkRangeAllAction: d.applyBulkRangeAllAction,
                applyFirstRangeStartAdjustAction: d.applyFirstRangeStartAdjustAction,
                setAllMultiRangeStartEditEnabled: d.setAllMultiRangeStartEditEnabled,
                setAllMultiRangeEndEditEnabled: d.setAllMultiRangeEndEditEnabled,
                getGlobalTimes: d.getGlobalTimesState,
                updateClocks: deferDynamic(d, d.getUpdateClocksRef),
                getBaseTimezoneRef: d.getBaseTimezoneRef,
                getFixedOffsetForDisplay: d.getFixedOffsetForDisplay,
                getFixedOffsetForDisplayAtDate: d.getFixedOffsetForDisplayAtDate,
                getCustomOffsetMinutes: d.getCustomOffsetMinutes,
                getTimeAdjustDayStep: d.getTimeAdjustDayStep,
                timeService: d.timeService,
                sanitizeUtcMs: d.sanitizeUtcMsViaTimeCore,
                ensureMultiRangeState: d.ensureMultiRangeState,
                getMultiRanges: d.getPatchedMultiRangesState,
                isMultiRangeStartLinked: d.isMultiRangeStartLinked,
                isMultiTab: d.isMultiTab,
                renderMultiRanges: d.renderMultiRangesSafely,
                savePersistenceForce: d.savePersistenceSafely,
                isMultiRangeStartEditEnabled: d.isMultiRangeStartEditEnabled,
                isMultiRangeEndEditEnabled: d.isMultiRangeEndEditEnabled,
                syncLinkedRangesFrom: d.syncLinkedRangesFrom,
                getMultiRangeSlotDate: d.getMultiRangeSlotDate,
                setMultiRangeSlotDate: d.setMultiRangeSlotDate,
                syncFollowingRangesByDuration: d.syncFollowingRangesByDuration,
                syncMultiRangeStartLinks: d.syncMultiRangeStartLinks
            };
        }

        function buildMainGroupStateServicesConfig(deps = {}) {
            const d = (deps && typeof deps === "object") ? deps : {};
            return {
                GTV_MULTI_STATE: d.GTV_MULTI_STATE,
                serviceBootstrap: d.serviceBootstrap,
                MIN_MULTI_RANGE_COUNT: d.MIN_MULTI_RANGE_COUNT,
                t: d.gtvT,
                getGroups: d.getGroupsStateSnapshot,
                getDefaultMultiRangeBounds: d.getDefaultMultiRangeBounds,
                sanitizeMultiRangeCount: d.sanitizeMultiRangeCount,
                sanitizeMultiRangeItem: d.sanitizeMultiRangeItem,
                sanitizeUtcMs: d.sanitizeUtcMsViaTimeCore,
                sanitizeTimezoneId: d.sanitizeTimezoneId,
                createUniqueTimezoneId: d.createUniqueTimezoneId,
                normalizeCustomAbbr: d.normalizeCustomAbbr,
                normalizeZoneAbbreviation: d.normalizeZoneAbbreviationViaSearch,
                sanitizeBaseTimezoneId: d.sanitizeBaseTimezoneId,
                sanitizeUtcRowOrder: d.sanitizeUtcRowOrderViaTimeCore,
                sanitizeFixedTimes: d.sanitizeFixedTimes,
                sanitizeFixedDateValue: d.sanitizeFixedDateValue,
                sanitizeFixedTimeShowLiveNow: d.sanitizeFixedTimeShowLiveNow
            };
        }

        function buildMainImageExportNamingProxyConfig(deps = {}) {
            const d = (deps && typeof deps === "object") ? deps : {};
            return {
                getImageExportNamingService: d.getImageExportNamingServiceRef,
                getCustomOffsetMinutes: d.getCustomOffsetMinutes,
                pad: d.pad,
                timeService: d.timeService,
                getBaseTimezoneRef: d.getBaseTimezoneRef,
                getGroups: d.getGroupsStateSnapshot,
                getActiveGroupId: d.getPatchedActiveGroupIdState,
                t: d.gtvT,
                getZoneAbbreviation: d.getZoneAbbreviation,
                getBaseTime: d.getBaseTimeSnapshot,
                sanitizeMultiSubgroupName: d.sanitizeMultiSubgroupNameForExport,
                getCurrentMultiSubgroupName: d.getCurrentMultiSubgroupName
            };
        }

        function buildMainImageExportServicesConfig(deps = {}) {
            const d = (deps && typeof deps === "object") ? deps : {};
            return {
                GTV_IMAGE_EXPORT_NAMING: d.GTV_IMAGE_EXPORT_NAMING,
                GTV_IMAGE_EXPORT_ACTIONS: d.GTV_IMAGE_EXPORT_ACTIONS,
                imageExportApi: d.GTV_IMAGE_EXPORT,
                t: d.gtvT,
                pad: d.pad,
                timeService: d.timeService,
                getCustomOffsetMinutes: d.getCustomOffsetMinutes,
                getBaseTimezoneRef: d.getBaseTimezoneRef,
                getBaseTime: d.getBaseTimeSnapshot,
                getActiveGroupName: d.getActiveGroupNameSnapshot,
                getZoneAbbreviation: d.getZoneAbbreviation,
                sanitizeMultiSubgroupName: d.sanitizeMultiSubgroupNameForExport,
                getCurrentMultiSubgroupName: d.getCurrentMultiSubgroupName,
                showToast: deferDynamic(d, d.getShowToastRef),
                isMultiTab: d.isMultiTab,
                ensureMultiRangeState: d.ensureMultiRangeState,
                detectForeignObjectRendererSupport: d.detectForeignObjectRendererSupport,
                renderTimezoneTableToPngDataUrl: d.renderTimezoneTableToPngDataUrl,
                renderTimezoneTableFallbackDataUrl: d.renderTimezoneTableFallbackDataUrl,
                renderMultiRangesToPngDataUrl: d.renderMultiRangesToPngDataUrl,
                renderMultiRangeSingleToPngDataUrl: d.renderMultiRangeSingleToPngDataUrl,
                renderMultiRangesFallbackDataUrl: d.renderMultiRangesFallbackDataUrl,
                renderMultiRangeTitlesToPngDataUrl: d.renderMultiRangeTitlesToPngDataUrl,
                getTimezoneTableImageFilename: d.getTimezoneTableImageFilename,
                getMultiRangeTableImageFilename: d.getMultiRangeTableImageFilename,
                getMultiRangeTitlesImageFilename: d.getMultiRangeTitlesImageFilename,
                getMultiRanges: d.getPatchedMultiRangesState,
                isDomExceptionLike: d.isDomExceptionLike,
                setCanUseForeignObjectRenderer: d.setCanUseForeignObjectRenderer
            };
        }

        function buildMainTabServicesConfig(deps = {}) {
            const d = (deps && typeof deps === "object") ? deps : {};
            return {
                GTV_FORMAT_CONTROLS: d.GTV_FORMAT_CONTROLS,
                serviceBootstrap: d.serviceBootstrap,
                COPY_FORMAT_KEYS: d.COPY_FORMAT_KEYS,
                TIME_PART_KEYS: d.TIME_PART_KEYS,
                t: d.gtvT,
                sanitizeCopyFormatOrder: d.sanitizeCopyFormatOrder,
                renderList: deferDynamic(d, d.getRenderListRef),
                updateCopyFormatPreview: d.updateCopyFormatPreview,
                savePersistence: d.savePersistenceSafely,
                upgradeNativeTitleTooltips: d.upgradeNativeTitleTooltips,
                isShowCopyFormat: d.getPatchedShowCopyFormatState,
                getDisplayFormatOrder: d.getPatchedDisplayFormatOrderState,
                setDisplayFormatOrder: (next) => {
                    const context = d.getPatchedActiveFormatProfileContextState();
                    d.patchAppState({
                        displayFormatOrder: d.sanitizeCopyFormatOrderForContext(next, context)
                    });
                    d.syncActiveFormatProfileFromState();
                },
                getDisplayFormatEnabled: d.getPatchedDisplayFormatEnabledState,
                setDisplayFormatEnabled: (next) => {
                    const context = d.getPatchedActiveFormatProfileContextState();
                    d.patchAppState({
                        displayFormatEnabled: d.sanitizeCopyFormatEnabledForContext(next, "display", context)
                    });
                    d.syncActiveFormatProfileFromState();
                },
                getDisplayTimePartsEnabled: d.getPatchedDisplayTimePartsEnabledState,
                setDisplayTimePartsEnabled: (next) => {
                    const context = d.getPatchedActiveFormatProfileContextState();
                    d.patchAppState({
                        displayTimePartsEnabled: d.sanitizeTimePartsEnabledForContext(next, "display", context)
                    });
                    d.syncActiveFormatProfileFromState();
                },
                getCopyFormatOrder: d.getPatchedCopyFormatOrderState,
                setCopyFormatOrder: (next) => {
                    const context = d.getPatchedActiveFormatProfileContextState();
                    d.patchAppState({
                        copyFormatOrder: d.sanitizeCopyFormatOrderForContext(next, context)
                    });
                    d.syncActiveFormatProfileFromState();
                },
                getCopyFormatEnabled: d.getPatchedCopyFormatEnabledState,
                setCopyFormatEnabled: (next) => {
                    const context = d.getPatchedActiveFormatProfileContextState();
                    d.patchAppState({
                        copyFormatEnabled: d.sanitizeCopyFormatEnabledForContext(next, "copy", context)
                    });
                    d.syncActiveFormatProfileFromState();
                },
                getCopyTimePartsEnabled: d.getPatchedCopyTimePartsEnabledState,
                setCopyTimePartsEnabled: (next) => {
                    const context = d.getPatchedActiveFormatProfileContextState();
                    d.patchAppState({
                        copyTimePartsEnabled: d.sanitizeTimePartsEnabledForContext(next, "copy", context)
                    });
                    d.syncActiveFormatProfileFromState();
                },
                getActiveCopyFormatKeys: d.getActiveCopyFormatKeysForCurrentContext,
                getActiveTimePartKeys: d.getActiveTimePartKeysForCurrentContext,
                sanitizeMainTab: d.sanitizeMainTab,
                clampGroupIndex: d.clampGroupIndex,
                normalizeGroupTabState: d.normalizeGroupTabState,
                isMultiTab: d.isMultiTab,
                isFixedTimeTab: d.isFixedTimeTab,
                getSlotCount: d.getPatchedSlotCountState,
                getShowTimeline: d.getPatchedShowTimelineState,
                getIsRealtime: d.getIsRealtimeState,
                setIsRealtime: d.setIsRealtimeState,
                syncRealtimeNow: () => {
                    if (typeof d.setGlobalTimeState === "function") {
                        d.setGlobalTimeState(0, new Date());
                    }
                },
                getCurrentMainTab: d.getPatchedMainTabState,
                setCurrentMainTab: d.setCurrentMainTabState,
                getActiveGroupId: d.getPatchedActiveGroupIdState,
                setActiveGroupId: d.setActiveGroupIdState,
                getActiveGroupIdByMainTab: d.getActiveGroupIdByMainTabStateSnapshot,
                setActiveGroupIdByMainTab: d.setActiveGroupIdByMainTabState,
                hideFloatingTooltip: d.hideFloatingTooltip,
                syncCurrentMultiStateToActiveSubgroup: d.syncCurrentMultiStateToActiveSubgroup,
                refreshMultiRangeControls: d.refreshMultiRangeControls,
                renderBaseTimeSelect: d.renderBaseTimeSelect,
                loadCurrentMultiStateFromActiveSubgroup: d.loadCurrentMultiStateFromActiveSubgroup,
                renderGroups: bindFacade(d, d.getGroupTabsServiceRef, "renderGroups"),
                renderMultiSubgroups: bindFacade(d, d.getGroupTabsServiceRef, "renderMultiSubgroups"),
                renderMultiRanges: d.renderMultiRangesSafely,
                renderFixedTimeTab: d.renderFixedTimeTab,
                renderTimelineFrame: deferDynamic(d, d.getRenderTimelineFrameRef),
                updateTimeAdjustPanel: d.updateTimeAdjustPanelSafely,
                syncActiveFormatProfileFromState: d.syncActiveFormatProfileFromState,
                resolveFormatProfileContext: d.resolveFormatProfileContext,
                activateFormatProfileContext: d.activateFormatProfileContext
            };
        }

        function buildMainAppStateServicesConfig(deps = {}) {
            const d = (deps && typeof deps === "object") ? deps : {};
            return {
                GTV_APP_STATE_PATCHER: d.GTV_APP_STATE_PATCHER,
                GTV_APP_PERSISTENCE_STATE: d.GTV_APP_PERSISTENCE_STATE,
                getStateSource: d.getMainAppStateSource,
                stateSetters: d.directStateSetters,
                setIsRealtimeState: d.setIsRealtimeState,
                syncActiveFormatProfileFromState: d.syncActiveFormatProfileFromState,
                ensureFormatProfiles: d.ensureFormatProfiles,
                getCurrentFormatProfileState: d.getCurrentFormatProfileState,
                resolveFormatProfileContext: d.resolveFormatProfileContext,
                applyFormatProfileState: d.applyFormatProfileState
            };
        }

        function buildMainAppBootstrapConfig(deps = {}) {
            const d = (deps && typeof deps === "object") ? deps : {};
            return {
                assertRequiredServices: d.assertRequiredServices,
                loadPersistence: d.loadPersistence,
                localizeAutoGeneratedNamesForCurrentLanguage: d.localizeAutoGeneratedNamesForCurrentLanguage,
                savePersistenceSafely: d.savePersistenceSafely,
                loadCurrentMultiStateFromActiveSubgroup: d.loadCurrentMultiStateFromActiveSubgroup,
                loadThemePreference: d.loadThemePreference,
                applyTheme: d.applyTheme,
                loadUiScalePreference: d.loadUiScalePreference,
                applyUiScale: d.applyUiScale,
                applyTranslations: d.applyTranslations,
                applyVersionBranding: d.applyVersionBranding,
                initUI: bindFacade(d, d.getMainUiInitServiceRef, "initUI"),
                bindFloatingTooltipEvents: d.bindFloatingTooltipEvents,
                initDragAndDrop: d.initDragAndDrop,
                initSearchAndSelect: bindFacade(d, d.getTimezoneSearchServiceRef, "initSearchAndSelect"),
                initCalculators: d.initCalculators,
                startRealtimeTicker: bindFacade(d, d.getTimerEngineServiceRef, "startRealtimeTicker"),
                switchMainTab: d.switchMainTab,
                getCurrentMainTab: d.getPatchedMainTabState,
                updateClocks: deferDynamic(d, d.getUpdateClocksRef),
                showFatalError: d.showFatalError
            };
        }

        return Object.freeze({
            buildMainSelectServicesConfig,
            buildTimezoneSearchConfig,
            buildSnapshotFormatConfig,
            buildTimeInputMutationsConfig,
            buildMainRowOrderConfig,
            buildMainRowViewConfig,
            buildTableRenderConfig,
            buildMainImageExportBridgeProxyConfig,
            buildMainImageRuntimeServicesConfig,
            buildMainFixedTimeServicesConfig,
            buildMainMultiRangeServicesConfig,
            buildMainTimeAdjustServicesConfig,
            buildMainGroupStateServicesConfig,
            buildMainImageExportNamingProxyConfig,
            buildMainImageExportServicesConfig,
            buildMainTabServicesConfig,
            buildMainAppStateServicesConfig,
            buildMainAppBootstrapConfig
        });
    }

    globalObj.GTVMainRuntimeServiceConfigBuilder = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
