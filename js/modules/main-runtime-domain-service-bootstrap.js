(function initGtvMainRuntimeDomainServiceBootstrap(globalObj) {
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

        function pickDeps(source, ...depNames) {
            if (Array.isArray(source)) { depNames = source; source = safeDeps; }
            const resolved = {};
            depNames.forEach((depName) => { resolved[depName] = source[depName]; });
            return resolved;
        }

        function resolveDeps(overrides = {}) {
            return (overrides && typeof overrides === "object") ? overrides : {};
        }

        function pickAliasedDeps(d, aliasMap = {}) {
            const resolved = {};
            Object.keys(aliasMap).forEach((targetKey) => { resolved[targetKey] = d[aliasMap[targetKey]]; });
            return resolved;
        }

        function deferDynamic(d, getter) {
            if (typeof d.deferDynamicCall !== "function") return () => undefined;
            return d.deferDynamicCall(getter);
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









        const mainCoreServices = requireObject(safeDeps.mainCoreServices, "mainCoreServices");

        const createMainFixedTimeServices = requireFunction(
            mainCoreServices.createMainFixedTimeServices,
            "mainCoreServices.createMainFixedTimeServices"
        );
        const createMainMultiRangeServices = requireFunction(
            mainCoreServices.createMainMultiRangeServices,
            "mainCoreServices.createMainMultiRangeServices"
        );
        const createMainTimeAdjustServices = requireFunction(
            mainCoreServices.createMainTimeAdjustServices,
            "mainCoreServices.createMainTimeAdjustServices"
        );

        const createMainGroupStateServices = requireFunction(
            mainCoreServices.createMainGroupStateServices,
            "mainCoreServices.createMainGroupStateServices"
        );




        const mainFixedTimeServicesConfig = buildMainFixedTimeServicesConfig({
            ...pickDeps([
                "GTV_FIXED_TIME_CORE",
                "GTV_FIXED_TIME_TIMELINE",
                "GTV_FIXED_TIME_ACTIONS",
                "DEFAULT_FIXED_TIME_VALUE",
                "MIN_FIXED_TIME_SLOT_COUNT",
                "TIMELINE_TOTAL_SECONDS",
                "MAIN_I18N_DATA",
                "gtvT",
                "getPatchedCurrentLangState",
                "sanitizeFixedTimeValue",
                "getFixedOffsetForDisplayAtDate",
                "getLocalPartsByTimezone",
                "getUTCDateFromLocalParts",
                "pad",
                "sanitizeTimePartsEnabledForContext",
                "getPatchedDisplayTimePartsEnabledState",
                "getDefaultFixedTimeName",
                "sanitizeFixedTimeName",
                "getFixedDatePartsFromGroup",
                "getDayNightMarkerByHour",
                "getCurrentGroup",
                "ensureGroupFixedTimes",
                "getGlobalTimeState",
                "resolveFixedTimeSlotUtcDate",
                "clampNumber",
                "getFixedTimeSlotCount",
                "sanitizeFixedTimeId",
                "getFixedTimeSlotHeaderLabel",
                "sanitizeCopyFormatOrderForContext",
                "sanitizeCopyFormatEnabledForContext",
                "getPatchedCopyFormatOrderState",
                "getPatchedCopyFormatEnabledState",
                "getPatchedCopyTimePartsEnabledState",
                "buildTimezoneComputedSnapshotForDatesViaSnapshotService",
                "formatSnapshotTextViaSnapshotService",
                "getBaseTimezoneRef",
                "getRenderableTimezoneRowsFromTableRender",
                "parseDateTimeParts",
                "deferDynamicCall",
                "getShowToastRef",
                "writeClipboardText",
                "buildFixedTimeDisplayPayloadAtUtc",
                "getRenderFixedTimeTabRef",
                "getRenderTimelineFrameRef",
                "getSavePersistenceSafelyRef",
                "setFixedTimeSlotCount",
                "getRefreshFixedTimeSlotCountControlsRef",
            ]),
        });
        const mainFixedTimeServices = createMainFixedTimeServices(mainFixedTimeServicesConfig);
        const fixedTimeCoreService = mainFixedTimeServices.fixedTimeCoreService;
        const fixedTimeTimelineService = mainFixedTimeServices.fixedTimeTimelineService;
        const fixedTimeActionsService = mainFixedTimeServices.fixedTimeActionsService;

        const mainMultiRangeServicesConfig = buildMainMultiRangeServicesConfig({
            ...pickDeps([
                "GTV_MULTI_RANGE_RENDER",
                "GTV_MULTI_RANGE_COPY",
                "GTV_COPY_ACTIONS",
                "MAIN_I18N_DATA",
                "gtvT",
                "getPatchedCurrentLangState",
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
                "sanitizeMultiSubgroupNameViaState",
                "getCurrentMultiSubgroupName",
                "sanitizeMultiRangeTitle",
                "getPatchedMultiRangeTitleState",
                "buildStaticRowCellFromTableRender",
                "buildDynamicRowCellFromTableRender",
                "isMultiRangeStartEditEnabled",
                "isMultiRangeEndEditEnabled",
                "handleMultiRangeTimeChange",
                "copyMultiRangeRow",
                "hideFloatingTooltip",
                "ensureMultiRangeState",
                "refreshMultiRangeControls",
                "renderMultiBulkToolSets",
                "getBaseTimezoneRef",
                "escapeHtmlViaSharedUtils",
                "getDisplayColumns",
                "getRenderableTimezoneRowsFromTableRender",
                "getPatchedMultiRangesState",
                "getPatchedMultiRangeCollapsedState",
                "getPatchedMultiRangeCountState",
                "buildTimezoneComputedSnapshotForDatesViaSnapshotService",
                "saveMultiRangeSingleImage",
                "setMultiRangesCollapsedBelow",
                "toggleMultiRangeCollapsed",
                "renderTimeAdjustSet",
                "applyMultiRangeTimeAdjustAction",
                "attachTimeAdjustToggleLabel",
                "setMultiRangeStartEditEnabled",
                "setMultiRangeEndEditEnabled",
                "getMultiDisplayColumnHeaderFromTableRender",
                "updateTimeAdjustPanelSafely",
                "updateCopyFormatPreview",
                "upgradeNativeTitleTooltips",
                "deferDynamicCall",
                "getShowToastRef",
                "getTimezoneRefByIdFromSnapshotService",
                "buildTimezoneComputedSnapshotForRange",
                "formatSnapshotText",
                "getPatchedCopyFormatOrderState",
                "getPatchedCopyFormatEnabledState",
                "getPatchedCopyTimePartsEnabledState",
                "writeClipboardText",
                "getPatchedShowCopyFormatState",
                "isMultiTab",
                "isFixedTimeTab",
                "getRowFormattedTextViaSnapshotService",
                "getRowCopyTextViaSnapshotService",
                "getFixedTimePreviewCopyText",
                "getAllFixedTimeRowsCopyText",
                "copyAllMultiRangeTimezones",
            ]),
        });
        const mainMultiRangeServices = createMainMultiRangeServices(mainMultiRangeServicesConfig);
        const multiRangeRenderService = mainMultiRangeServices.multiRangeRenderService;
        const multiRangeCopyService = mainMultiRangeServices.multiRangeCopyService;
        const copyActionsService = mainMultiRangeServices.copyActionsService;

        const mainTimeAdjustServicesConfig = buildMainTimeAdjustServicesConfig({
            ...pickDeps([
                "GTV_TIME_ADJUST_UI",
                "GTV_MULTI_BULK_TOOLS",
                "GTV_TIME_ADJUST_ACTIONS",
                "MIN_TIME_ADJUST_DAY_STEP",
                "MAX_TIME_ADJUST_DAY_STEP",
                "DEFAULT_TIME_ADJUST_DAY_STEP",
                "gtvT",
                "savePersistenceSafely",
                "applyTimeAdjustAction",
                "getPatchedMainTabState",
                "getIsRealtimeState",
                "getPatchedSlotCountState",
                "getTimeAdjustDayStepValue",
                "getTimeAdjustDayStepBySlotSnapshot",
                "setTimeAdjustDayStepBySlotState",
                "upgradeNativeTitleTooltips",
                "getPatchedMultiRangeCountState",
                "applyBulkRangeAllAction",
                "applyFirstRangeStartAdjustAction",
                "setAllMultiRangeStartEditEnabled",
                "setAllMultiRangeEndEditEnabled",
                "getGlobalTimesState",
                "deferDynamicCall",
                "getUpdateClocksRef",
                "getBaseTimezoneRef",
                "getFixedOffsetForDisplay",
                "getFixedOffsetForDisplayAtDate",
                "getCustomOffsetMinutes",
                "getTimeAdjustDayStep",
                "timeService",
                "sanitizeUtcMsViaTimeCore",
                "ensureMultiRangeState",
                "getPatchedMultiRangesState",
                "isMultiRangeStartLinked",
                "isMultiTab",
                "renderMultiRangesSafely",
                "isMultiRangeStartEditEnabled",
                "isMultiRangeEndEditEnabled",
                "syncLinkedRangesFrom",
                "getMultiRangeSlotDate",
                "setMultiRangeSlotDate",
                "syncFollowingRangesByDuration",
                "syncMultiRangeStartLinks",
            ]),
        });
        const mainTimeAdjustServices = createMainTimeAdjustServices(mainTimeAdjustServicesConfig);
        const timeAdjustUiService = mainTimeAdjustServices.timeAdjustUiService;
        const multiBulkToolsService = mainTimeAdjustServices.multiBulkToolsService;
        const timeAdjustActionsService = mainTimeAdjustServices.timeAdjustActionsService;







        const mainGroupStateServicesConfig = buildMainGroupStateServicesConfig({
            ...pickDeps([
                "GTV_MULTI_STATE",
                "serviceBootstrap",
                "MIN_MULTI_RANGE_COUNT",
                "gtvT",
                "getGroupsStateSnapshot",
                "getDefaultMultiRangeBounds",
                "sanitizeMultiRangeCount",
                "sanitizeMultiRangeItem",
                "sanitizeUtcMsViaTimeCore",
                "sanitizeTimezoneId",
                "createUniqueTimezoneId",
                "normalizeCustomAbbr",
                "normalizeZoneAbbreviationViaSearch",
                "sanitizeBaseTimezoneId",
                "sanitizeUtcRowOrderViaTimeCore",
                "sanitizeFixedTimes",
                "sanitizeFixedDateValue",
                "sanitizeFixedTimeShowLiveNow",
            ]),
        });
        const mainGroupStateServices = createMainGroupStateServices(mainGroupStateServicesConfig);
        const multiStateService = mainGroupStateServices.multiStateService;
        const groupStateService = mainGroupStateServices.groupStateService;















        return Object.freeze({
            fixedTimeCoreService,
            fixedTimeTimelineService,
            fixedTimeActionsService,
            multiRangeRenderService,
            multiRangeCopyService,
            copyActionsService,
            timeAdjustUiService,
            multiBulkToolsService,
            timeAdjustActionsService,
            multiStateService,
            groupStateService,
        });
    }

    globalObj.GTVMainRuntimeDomainServiceBootstrap = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
