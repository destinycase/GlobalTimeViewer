(function initGtvMainRuntimeServiceConfigBuilder(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const baseDeps = (deps && typeof deps === "object") ? deps : {};

        function resolveDeps(overrides = {}) {
            const overrideDeps = (overrides && typeof overrides === "object") ? overrides : {};
            return { ...baseDeps, ...overrideDeps };
        }

        function pickDeps(d, ...depNames) {
            const resolved = {};
            depNames.forEach((depName) => {
                resolved[depName] = d[depName];
            });
            return resolved;
        }

        function pickAliasedDeps(d, aliasMap = {}) {
            const resolved = {};
            Object.keys(aliasMap).forEach((targetKey) => {
                resolved[targetKey] = d[aliasMap[targetKey]];
            });
            return resolved;
        }

        function deferDynamic(d, getter) {
            if (typeof d.deferDynamicCall !== "function") return () => undefined;
            return d.deferDynamicCall(getter);
        }

        function bindFacade(d, getter, methodName) {
            if (typeof d.bindFacadeMethod !== "function") return () => undefined;
            return d.bindFacadeMethod(getter, methodName);
        }

        function createContextStateSetter(d, stateKey, resolver) {
            return (next) => {
                const context = d.getPatchedActiveFormatProfileContextState();
                d.patchAppState({
                    [stateKey]: resolver(next, context)
                });
                d.syncActiveFormatProfileFromState();
            };
        }

        function buildMainSelectServicesConfig(deps = {}) {
            const d = resolveDeps(deps);
            return {
                ...pickAliasedDeps(d, {
                    "getDocumentRef": "getDocumentRefOrNull",
                    "getComputedStyle": "getComputedStyleSafely",
                }),
                ...pickDeps(d,
                    "ensureBaseTimezoneSelection",
                    "getCurrentGroupBaseTimezoneId",
                    "isCurrentGroupUtcRowVisible",
                    "getCurrentGroupZones",
                    "getZoneAbbreviation",
                    "getZoneDisplayName",
                    "setCurrentGroupBaseTimezoneId",
                ),
                ...pickAliasedDeps(d, {
                    "savePersistence": "savePersistenceSafely",
                    "t": "gtvT",
                }),
            };
        }

        function buildTimezoneSearchConfig(deps = {}) {
            const d = resolveDeps(deps);
            return {
                ...pickDeps(d, "TZ_DATABASE"),
                ...pickAliasedDeps(d, {
                    "getZoneMap": "getZoneMapRef",
                    "t": "gtvT",
                    "getCurrentLang": "getPatchedCurrentLangState",
                }),
                ...pickDeps(d,
                    "getBetterAbbr",
                    "getTimezoneOffset",
                    "getLocalizedTZLabel",
                    "adjustSelectWidthForContent",
                    "getCurrentGroup",
                ),
                ...pickAliasedDeps(d, {
                    "savePersistence": "savePersistenceSafely",
                }),
                renderList: deferDynamic(d, d.getRenderListRef),
                ...pickDeps(d, "addTimezone"),
                ...pickDeps(d, "createUniqueTimezoneId")
            };
        }

        function buildSnapshotFormatConfig(deps = {}) {
            const d = resolveDeps(deps);
            return {
                ...pickDeps(d, "DEFAULT_COPY_TIME_PARTS_ENABLED"),
                ...pickAliasedDeps(d, {
                    "I18N_DATA": "MAIN_I18N_DATA",
                    "t": "gtvT",
                    "getCurrentLang": "getPatchedCurrentLangState",
                }),
                ...pickDeps(d,
                    "getUTCRef",
                    "getBaseTimezoneRef",
                    "getCurrentGroupZones",
                ),
                ...pickAliasedDeps(d, {
                    "getGlobalTimes": "getGlobalTimesState",
                    "getSlotCount": "getPatchedSlotCountState",
                    "isRealtime": "getIsRealtimeState",
                }),
                ...pickDeps(d,
                    "getDayNightMarkerByHour",
                    "getFixedOffsetForDisplay",
                    "normalizeCustomAbbr",
                    "getCustomOffsetMinutes",
                    "pad",
                    "getZoneAbbreviation",
                    "getZoneDisplayName",
                    "getSignedInclusiveDaySpan",
                    "getSignedDurationDayHourMinute",
                    "sanitizeTimePartsEnabled",
                    "sanitizeCopyFormatOrder",
                ),
                ...pickDeps(d, "timeService")
            };
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

        function buildMainFixedTimeServicesConfig(deps = {}) {
            const d = resolveDeps(deps);
            return {
                ...pickDeps(d,
                    "GTV_FIXED_TIME_CORE",
                    "GTV_FIXED_TIME_TIMELINE",
                    "GTV_FIXED_TIME_ACTIONS",
                    "DEFAULT_FIXED_TIME_VALUE",
                    "MIN_FIXED_TIME_SLOT_COUNT",
                    "TIMELINE_TOTAL_SECONDS",
                ),
                ...pickAliasedDeps(d, {
                    "I18N_DATA": "MAIN_I18N_DATA",
                    "t": "gtvT",
                    "getCurrentLang": "getPatchedCurrentLangState",
                }),
                ...pickDeps(d,
                    "sanitizeFixedTimeValue",
                    "getFixedOffsetForDisplayAtDate",
                    "getLocalPartsByTimezone",
                    "getUTCDateFromLocalParts",
                    "pad",
                    "sanitizeTimePartsEnabledForContext",
                ),
                ...pickAliasedDeps(d, {
                    "getDisplayTimePartsEnabled": "getPatchedDisplayTimePartsEnabledState",
                }),
                ...pickDeps(d,
                    "getDefaultFixedTimeName",
                    "sanitizeFixedTimeName",
                ),
                ...pickAliasedDeps(d, {
                    "getFixedDateParts": "getFixedDatePartsFromGroup",
                }),
                ...pickDeps(d,
                    "getDayNightMarkerByHour",
                    "getCurrentGroup",
                    "ensureGroupFixedTimes",
                ),
                ...pickAliasedDeps(d, {
                    "getGlobalTime": "getGlobalTimeState",
                }),
                ...pickDeps(d,
                    "resolveFixedTimeSlotUtcDate",
                    "clampNumber",
                    "getFixedTimeSlotCount",
                    "sanitizeFixedTimeId",
                    "getFixedTimeSlotHeaderLabel",
                    "sanitizeCopyFormatOrderForContext",
                    "sanitizeCopyFormatEnabledForContext",
                ),
                ...pickAliasedDeps(d, {
                    "getCopyFormatOrder": "getPatchedCopyFormatOrderState",
                    "getCopyFormatEnabled": "getPatchedCopyFormatEnabledState",
                    "getCopyTimePartsEnabled": "getPatchedCopyTimePartsEnabledState",
                    "buildTimezoneComputedSnapshotForDates": "buildTimezoneComputedSnapshotForDatesViaSnapshotService",
                    "formatSnapshotText": "formatSnapshotTextViaSnapshotService",
                }),
                ...pickDeps(d, "getBaseTimezoneRef"),
                ...pickAliasedDeps(d, {
                    "getRenderableTimezoneRows": "getRenderableTimezoneRowsFromTableRender",
                }),
                ...pickDeps(d, "parseDateTimeParts"),
                showToast: deferDynamic(d, d.getShowToastRef),
                ...pickAliasedDeps(d, {
                    "writeClipboard": "writeClipboardText",
                }),
                ...pickDeps(d, "buildFixedTimeDisplayPayloadAtUtc"),
                renderFixedTimeTab: deferDynamic(d, d.getRenderFixedTimeTabRef),
                renderTimelineFrame: deferDynamic(d, d.getRenderTimelineFrameRef),
                savePersistence: deferDynamic(d, d.getSavePersistenceSafelyRef),
                ...pickDeps(d, "setFixedTimeSlotCount"),
                refreshFixedTimeSlotCountControls: deferDynamic(d, d.getRefreshFixedTimeSlotCountControlsRef)
            };
        }

        function buildMainMultiRangeServicesConfig(deps = {}) {
            const d = resolveDeps(deps);
            return {
                ...pickDeps(d,
                    "GTV_MULTI_RANGE_RENDER",
                    "GTV_MULTI_RANGE_COPY",
                    "GTV_COPY_ACTIONS",
                ),
                ...pickAliasedDeps(d, {
                    "I18N_DATA": "MAIN_I18N_DATA",
                    "t": "gtvT",
                    "getCurrentLang": "getPatchedCurrentLangState",
                }),
                ...pickDeps(d,
                    "pad",
                    "getDayNightMarkerByHour",
                    "getCustomOffsetMinutes",
                    "getFixedOffsetForDisplayAtDate",
                    "normalizeCustomAbbr",
                    "getZoneAbbreviation",
                    "getSignedInclusiveDaySpan",
                    "getSignedDurationDayHourMinute",
                    "getZoneDisplayName",
                    "getZoneDisplayNameForUiAtDate",
                ),
                ...pickAliasedDeps(d, {
                    "sanitizeMultiSubgroupName": "sanitizeMultiSubgroupNameViaState",
                }),
                ...pickDeps(d,
                    "getCurrentMultiSubgroupName",
                    "sanitizeMultiRangeTitle",
                ),
                ...pickAliasedDeps(d, {
                    "getMultiRangeTitle": "getPatchedMultiRangeTitleState",
                    "buildStaticRowCell": "buildStaticRowCellFromTableRender",
                    "buildDynamicRowCell": "buildDynamicRowCellFromTableRender",
                }),
                ...pickDeps(d,
                    "isMultiRangeStartEditEnabled",
                    "isMultiRangeEndEditEnabled",
                    "handleMultiRangeTimeChange",
                    "copyMultiRangeRow",
                    "hideFloatingTooltip",
                    "ensureMultiRangeState",
                    "refreshMultiRangeControls",
                    "renderMultiBulkToolSets",
                    "getBaseTimezoneRef",
                ),
                ...pickAliasedDeps(d, {
                    "escapeHtml": "escapeHtmlViaSharedUtils",
                }),
                ...pickDeps(d, "getDisplayColumns"),
                ...pickAliasedDeps(d, {
                    "getRenderableTimezoneRows": "getRenderableTimezoneRowsFromTableRender",
                    "getMultiRanges": "getPatchedMultiRangesState",
                    "getMultiRangeCollapsed": "getPatchedMultiRangeCollapsedState",
                    "getMultiRangeCount": "getPatchedMultiRangeCountState",
                    "buildTimezoneComputedSnapshotForDates": "buildTimezoneComputedSnapshotForDatesViaSnapshotService",
                }),
                ...pickDeps(d,
                    "saveMultiRangeSingleImage",
                    "setMultiRangesCollapsedBelow",
                    "toggleMultiRangeCollapsed",
                    "renderTimeAdjustSet",
                    "applyMultiRangeTimeAdjustAction",
                    "attachTimeAdjustToggleLabel",
                    "setMultiRangeStartEditEnabled",
                    "setMultiRangeEndEditEnabled",
                ),
                ...pickAliasedDeps(d, {
                    "getMultiDisplayColumnHeader": "getMultiDisplayColumnHeaderFromTableRender",
                    "updateTimeAdjustPanel": "updateTimeAdjustPanelSafely",
                }),
                ...pickDeps(d,
                    "updateCopyFormatPreview",
                    "upgradeNativeTitleTooltips",
                ),
                showToast: deferDynamic(d, d.getShowToastRef),
                ...pickAliasedDeps(d, {
                    "getTimezoneRefById": "getTimezoneRefByIdFromSnapshotService",
                }),
                ...pickDeps(d,
                    "buildTimezoneComputedSnapshotForRange",
                    "formatSnapshotText",
                ),
                ...pickAliasedDeps(d, {
                    "getCopyFormatOrder": "getPatchedCopyFormatOrderState",
                    "getCopyFormatEnabled": "getPatchedCopyFormatEnabledState",
                    "getCopyTimePartsEnabled": "getPatchedCopyTimePartsEnabledState",
                    "writeClipboard": "writeClipboardText",
                    "isShowCopyFormat": "getPatchedShowCopyFormatState",
                }),
                ...pickDeps(d,
                    "isMultiTab",
                    "isFixedTimeTab",
                ),
                ...pickAliasedDeps(d, {
                    "getRowFormattedText": "getRowFormattedTextViaSnapshotService",
                    "getRowCopyText": "getRowCopyTextViaSnapshotService",
                }),
                ...pickDeps(d,
                    "getFixedTimePreviewCopyText",
                    "getAllFixedTimeRowsCopyText",
                ),
                ...pickDeps(d, "copyAllMultiRangeTimezones")
            };
        }

        function buildMainTimeAdjustServicesConfig(deps = {}) {
            const d = resolveDeps(deps);
            return {
                ...pickDeps(d,
                    "GTV_TIME_ADJUST_UI",
                    "GTV_MULTI_BULK_TOOLS",
                    "GTV_TIME_ADJUST_ACTIONS",
                    "MIN_TIME_ADJUST_DAY_STEP",
                    "MAX_TIME_ADJUST_DAY_STEP",
                    "DEFAULT_TIME_ADJUST_DAY_STEP",
                ),
                ...pickAliasedDeps(d, {
                    "t": "gtvT",
                    "savePersistence": "savePersistenceSafely",
                }),
                ...pickDeps(d, "applyTimeAdjustAction"),
                ...pickAliasedDeps(d, {
                    "getCurrentMainTab": "getPatchedMainTabState",
                    "isRealtime": "getIsRealtimeState",
                    "getSlotCount": "getPatchedSlotCountState",
                }),
                ...pickDeps(d, "getTimeAdjustDayStepValue"),
                setTimeAdjustDayStepValue: (slotIdx, value) => {
                    const daySteps = [...(typeof d.getTimeAdjustDayStepBySlotSnapshot === "function"
                        ? d.getTimeAdjustDayStepBySlotSnapshot()
                        : [])];
                    daySteps[slotIdx] = value;
                    if (typeof d.setTimeAdjustDayStepBySlotState === "function") {
                        d.setTimeAdjustDayStepBySlotState(daySteps);
                    }
                },
                ...pickDeps(d, "upgradeNativeTitleTooltips"),
                ...pickAliasedDeps(d, {
                    "getMultiRangeCount": "getPatchedMultiRangeCountState",
                }),
                ...pickDeps(d,
                    "applyBulkRangeAllAction",
                    "applyFirstRangeStartAdjustAction",
                    "setAllMultiRangeStartEditEnabled",
                    "setAllMultiRangeEndEditEnabled",
                ),
                ...pickAliasedDeps(d, {
                    "getGlobalTimes": "getGlobalTimesState",
                }),
                updateClocks: deferDynamic(d, d.getUpdateClocksRef),
                ...pickDeps(d,
                    "getBaseTimezoneRef",
                    "getFixedOffsetForDisplay",
                    "getFixedOffsetForDisplayAtDate",
                    "getCustomOffsetMinutes",
                    "getTimeAdjustDayStep",
                    "timeService",
                ),
                ...pickAliasedDeps(d, {
                    "sanitizeUtcMs": "sanitizeUtcMsViaTimeCore",
                }),
                ...pickDeps(d, "ensureMultiRangeState"),
                ...pickAliasedDeps(d, {
                    "getMultiRanges": "getPatchedMultiRangesState",
                }),
                ...pickDeps(d,
                    "isMultiRangeStartLinked",
                    "isMultiTab",
                ),
                ...pickAliasedDeps(d, {
                    "renderMultiRanges": "renderMultiRangesSafely",
                    "savePersistenceForce": "savePersistenceSafely",
                }),
                ...pickDeps(d,
                    "isMultiRangeStartEditEnabled",
                    "isMultiRangeEndEditEnabled",
                    "syncLinkedRangesFrom",
                    "getMultiRangeSlotDate",
                    "setMultiRangeSlotDate",
                    "syncFollowingRangesByDuration",
                ),
                ...pickDeps(d, "syncMultiRangeStartLinks")
            };
        }

        function buildMainGroupStateServicesConfig(deps = {}) {
            const d = resolveDeps(deps);
            return {
                ...pickDeps(d,
                    "GTV_MULTI_STATE",
                    "serviceBootstrap",
                    "MIN_MULTI_RANGE_COUNT",
                ),
                ...pickAliasedDeps(d, {
                    "t": "gtvT",
                    "getGroups": "getGroupsStateSnapshot",
                }),
                ...pickDeps(d,
                    "getDefaultMultiRangeBounds",
                    "sanitizeMultiRangeCount",
                    "sanitizeMultiRangeItem",
                ),
                ...pickAliasedDeps(d, {
                    "sanitizeUtcMs": "sanitizeUtcMsViaTimeCore",
                }),
                ...pickDeps(d,
                    "sanitizeTimezoneId",
                    "createUniqueTimezoneId",
                    "normalizeCustomAbbr",
                ),
                ...pickAliasedDeps(d, {
                    "normalizeZoneAbbreviation": "normalizeZoneAbbreviationViaSearch",
                }),
                ...pickDeps(d, "sanitizeBaseTimezoneId"),
                ...pickAliasedDeps(d, {
                    "sanitizeUtcRowOrder": "sanitizeUtcRowOrderViaTimeCore",
                }),
                ...pickDeps(d,
                    "sanitizeFixedTimes",
                    "sanitizeFixedDateValue",
                ),
                ...pickDeps(d, "sanitizeFixedTimeShowLiveNow")
            };
        }

        function buildMainImageExportNamingProxyConfig(deps = {}) {
            const d = resolveDeps(deps);
            return {
                ...pickAliasedDeps(d, {
                    "getImageExportNamingService": "getImageExportNamingServiceRef",
                }),
                ...pickDeps(d,
                    "getCustomOffsetMinutes",
                    "pad",
                    "timeService",
                    "getBaseTimezoneRef",
                ),
                ...pickAliasedDeps(d, {
                    "getGroups": "getGroupsStateSnapshot",
                    "getActiveGroupId": "getPatchedActiveGroupIdState",
                    "t": "gtvT",
                }),
                ...pickDeps(d, "getZoneAbbreviation"),
                ...pickAliasedDeps(d, {
                    "getBaseTime": "getBaseTimeSnapshot",
                    "sanitizeMultiSubgroupName": "sanitizeMultiSubgroupNameForExport",
                }),
                ...pickDeps(d, "getCurrentMultiSubgroupName")
            };
        }

        function buildMainImageExportServicesConfig(deps = {}) {
            const d = resolveDeps(deps);
            return {
                ...pickDeps(d,
                    "GTV_IMAGE_EXPORT_NAMING",
                    "GTV_IMAGE_EXPORT_ACTIONS",
                ),
                ...pickAliasedDeps(d, {
                    "imageExportApi": "GTV_IMAGE_EXPORT",
                    "t": "gtvT",
                }),
                ...pickDeps(d,
                    "pad",
                    "timeService",
                    "getCustomOffsetMinutes",
                    "getBaseTimezoneRef",
                ),
                ...pickAliasedDeps(d, {
                    "getBaseTime": "getBaseTimeSnapshot",
                    "getActiveGroupName": "getActiveGroupNameSnapshot",
                }),
                ...pickDeps(d, "getZoneAbbreviation"),
                ...pickAliasedDeps(d, {
                    "sanitizeMultiSubgroupName": "sanitizeMultiSubgroupNameForExport",
                }),
                ...pickDeps(d, "getCurrentMultiSubgroupName"),
                showToast: deferDynamic(d, d.getShowToastRef),
                ...pickDeps(d,
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
                ),
                ...pickAliasedDeps(d, {
                    "getMultiRanges": "getPatchedMultiRangesState",
                }),
                ...pickDeps(d, "isDomExceptionLike"),
                ...pickDeps(d, "setCanUseForeignObjectRenderer")
            };
        }

        function buildMainTabServicesConfig(deps = {}) {
            const d = resolveDeps(deps);
            return {
                ...pickDeps(d,
                    "GTV_FORMAT_CONTROLS",
                    "serviceBootstrap",
                    "COPY_FORMAT_KEYS",
                    "TIME_PART_KEYS",
                ),
                ...pickAliasedDeps(d, {
                    "t": "gtvT",
                }),
                ...pickDeps(d, "sanitizeCopyFormatOrder"),
                renderList: deferDynamic(d, d.getRenderListRef),
                ...pickDeps(d, "updateCopyFormatPreview"),
                ...pickAliasedDeps(d, {
                    "savePersistence": "savePersistenceSafely",
                }),
                ...pickDeps(d, "upgradeNativeTitleTooltips"),
                ...pickAliasedDeps(d, {
                    "isShowCopyFormat": "getPatchedShowCopyFormatState",
                    "getDisplayFormatOrder": "getPatchedDisplayFormatOrderState",
                    "getActiveFormatProfileContext": "getPatchedActiveFormatProfileContextState",
                }),
                ...pickDeps(d,
                    "patchAppState",
                    "sanitizeCopyFormatOrderForContext",
                    "syncActiveFormatProfileFromState"
                ),
                setDisplayFormatOrder: createContextStateSetter(
                    d,
                    "displayFormatOrder",
                    (next, context) => d.sanitizeCopyFormatOrderForContext(next, context)
                ),
                ...pickAliasedDeps(d, {
                    "getDisplayFormatEnabled": "getPatchedDisplayFormatEnabledState",
                }),
                setDisplayFormatEnabled: createContextStateSetter(
                    d,
                    "displayFormatEnabled",
                    (next, context) => d.sanitizeCopyFormatEnabledForContext(next, "display", context)
                ),
                ...pickAliasedDeps(d, {
                    "getDisplayTimePartsEnabled": "getPatchedDisplayTimePartsEnabledState",
                }),
                setDisplayTimePartsEnabled: createContextStateSetter(
                    d,
                    "displayTimePartsEnabled",
                    (next, context) => d.sanitizeTimePartsEnabledForContext(next, "display", context)
                ),
                ...pickAliasedDeps(d, {
                    "getCopyFormatOrder": "getPatchedCopyFormatOrderState",
                }),
                setCopyFormatOrder: createContextStateSetter(
                    d,
                    "copyFormatOrder",
                    (next, context) => d.sanitizeCopyFormatOrderForContext(next, context)
                ),
                ...pickAliasedDeps(d, {
                    "getCopyFormatEnabled": "getPatchedCopyFormatEnabledState",
                }),
                setCopyFormatEnabled: createContextStateSetter(
                    d,
                    "copyFormatEnabled",
                    (next, context) => d.sanitizeCopyFormatEnabledForContext(next, "copy", context)
                ),
                ...pickAliasedDeps(d, {
                    "getCopyTimePartsEnabled": "getPatchedCopyTimePartsEnabledState",
                }),
                setCopyTimePartsEnabled: createContextStateSetter(
                    d,
                    "copyTimePartsEnabled",
                    (next, context) => d.sanitizeTimePartsEnabledForContext(next, "copy", context)
                ),
                ...pickAliasedDeps(d, {
                    "getActiveCopyFormatKeys": "getActiveCopyFormatKeysForCurrentContext",
                    "getActiveTimePartKeys": "getActiveTimePartKeysForCurrentContext",
                }),
                ...pickDeps(d,
                    "sanitizeMainTab",
                    "clampGroupIndex",
                    "normalizeGroupTabState",
                    "isMultiTab",
                    "isFixedTimeTab",
                ),
                ...pickAliasedDeps(d, {
                    "getSlotCount": "getPatchedSlotCountState",
                    "getShowCopyFormat": "getPatchedShowCopyFormatState",
                    "getShowTimeline": "getPatchedShowTimelineState",
                    "getIsRealtime": "getIsRealtimeState",
                    "setIsRealtime": "setIsRealtimeState",
                }),
                syncRealtimeNow: () => {
                    if (typeof d.setGlobalTimeState === "function") {
                        d.setGlobalTimeState(0, new Date());
                    }
                },
                ...pickAliasedDeps(d, {
                    "getCurrentMainTab": "getPatchedMainTabState",
                    "setCurrentMainTab": "setCurrentMainTabState",
                    "getActiveGroupId": "getPatchedActiveGroupIdState",
                    "setActiveGroupId": "setActiveGroupIdState",
                    "getActiveGroupIdByMainTab": "getActiveGroupIdByMainTabStateSnapshot",
                    "setActiveGroupIdByMainTab": "setActiveGroupIdByMainTabState",
                }),
                ...pickDeps(d,
                    "hideFloatingTooltip",
                    "syncCurrentMultiStateToActiveSubgroup",
                    "refreshMultiRangeControls",
                    "renderBaseTimeSelect",
                    "loadCurrentMultiStateFromActiveSubgroup",
                ),
                renderGroups: bindFacade(d, d.getGroupTabsServiceRef, "renderGroups"),
                renderMultiSubgroups: bindFacade(d, d.getGroupTabsServiceRef, "renderMultiSubgroups"),
                ...pickAliasedDeps(d, {
                    "renderMultiRanges": "renderMultiRangesSafely",
                }),
                ...pickDeps(d, "renderFixedTimeTab"),
                renderTimelineFrame: deferDynamic(d, d.getRenderTimelineFrameRef),
                ...pickAliasedDeps(d, {
                    "updateTimeAdjustPanel": "updateTimeAdjustPanelSafely",
                }),
                ...pickDeps(d,
                    "resolveFormatProfileContext",
                ),
                ...pickDeps(d, "activateFormatProfileContext")
            };
        }

        function buildMainAppStateServicesConfig(deps = {}) {
            const d = resolveDeps(deps);
            return {
                ...pickDeps(d,
                    "GTV_APP_STATE_PATCHER",
                    "GTV_APP_PERSISTENCE_STATE",
                ),
                ...pickAliasedDeps(d, {
                    "getStateSource": "getMainAppStateSource",
                    "stateSetters": "directStateSetters",
                }),
                ...pickDeps(d,
                    "setIsRealtimeState",
                    "syncActiveFormatProfileFromState",
                    "ensureFormatProfiles",
                    "getCurrentFormatProfileState",
                    "resolveFormatProfileContext",
                ),
                ...pickDeps(d, "applyFormatProfileState")
            };
        }

        function buildMainAppBootstrapConfig(deps = {}) {
            const d = resolveDeps(deps);
            return {
                ...pickDeps(d,
                    "assertRequiredServices",
                    "loadPersistence",
                    "localizeAutoGeneratedNamesForCurrentLanguage",
                    "savePersistenceSafely",
                    "loadCurrentMultiStateFromActiveSubgroup",
                    "loadThemePreference",
                    "applyTheme",
                    "loadUiScalePreference",
                    "applyUiScale",
                    "applyTranslations",
                    "applyVersionBranding",
                ),
                initUI: bindFacade(d, d.getMainUiInitServiceRef, "initUI"),
                ...pickDeps(d,
                    "bindFloatingTooltipEvents",
                    "initDragAndDrop",
                ),
                initSearchAndSelect: bindFacade(d, d.getTimezoneSearchServiceRef, "initSearchAndSelect"),
                ...pickDeps(d, "initCalculators"),
                startRealtimeTicker: bindFacade(d, d.getTimerEngineServiceRef, "startRealtimeTicker"),
                ...pickDeps(d, "switchMainTab"),
                ...pickAliasedDeps(d, {
                    "getCurrentMainTab": "getPatchedMainTabState",
                }),
                updateClocks: deferDynamic(d, d.getUpdateClocksRef),
                ...pickDeps(d, "showFatalError")
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
