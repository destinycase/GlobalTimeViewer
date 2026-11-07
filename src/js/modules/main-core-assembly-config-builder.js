(function initGtvMainCoreAssemblyConfigBuilder(globalObj) {
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

        function bindFacade(d, getter, methodName) {
            if (typeof d.bindFacadeMethod !== "function") return () => undefined;
            return d.bindFacadeMethod(getter, methodName);
        }

        function deferDynamic(d, getter) {
            if (typeof d.deferDynamicCall !== "function") return () => undefined;
            return d.deferDynamicCall(getter);
        }

        function callOrNull(fn) {
            return (typeof fn === "function") ? fn() : null;
        }

        function buildMainCoreAssemblyConfig(deps = {}) {
            const d = resolveDeps(deps);
            return {
                ...pickDeps(d,
                    "GTV_MAIN_SERVICE_METHOD_BRIDGE",
                    "GTV_MAIN_DIRECT_STATE_PATCH",
                    "GTV_MAIN_APP_STATE_BRIDGE",
                    "GTV_MAIN_PATCHED_STATE_SELECTORS",
                    "GTV_MAIN_SHARED_UTILS",
                    "GTV_MAIN_TIMEZONE_RUNTIME_BRIDGE",
                    "GTV_MAIN_TIMEZONE_RUNTIME_SERVICES",
                    "GTV_MAIN_FORMAT_PROFILE_FACADE",
                    "GTV_MAIN_TIMEZONE_FACADE",
                    "GTV_MAIN_BASE_TIMEZONE_SERVICES",
                    "GTV_MAIN_TIMEZONE_MUTATION_SERVICES",
                    "GTV_MAIN_TIMEZONE_TABLE_FACADE",
                    "GTV_MAIN_TIME_ADJUST_FACADE",
                    "GTV_MAIN_FIXED_TIME_TAB_FACADE",
                    "GTV_MAIN_FIXED_TIME_FACADE",
                    "GTV_MAIN_TIMELINE_FACADE",
                    "GTV_MAIN_MULTI_RANGE_TAB_FACADE",
                    "GTV_MAIN_GROUP_LOCALIZATION_SERVICES",
                    "GTV_MAIN_ORCHESTRATION_FLOW_SERVICES",
                    "GTV_MAIN_SELECT_SERVICES",
                    "GTV_TIMEZONE_SEARCH",
                    "GTV_SNAPSHOT_FORMAT",
                    "GTV_TIME_INPUT_MUTATIONS",
                    "GTV_MAIN_ROW_ORDER_SERVICES",
                    "GTV_MAIN_ROW_VIEW_SERVICES",
                    "GTV_TABLE_RENDER",
                    "GTV_MAIN_IMAGE_EXPORT_BRIDGE_PROXY",
                    "GTV_MAIN_IMAGE_RUNTIME_SERVICES",
                    "GTV_MAIN_FIXED_TIME_SERVICES",
                    "GTV_MAIN_MULTI_RANGE_SERVICES",
                    "GTV_MAIN_TIME_ADJUST_SERVICES",
                    "GTV_MAIN_TAB_SERVICES",
                    "GTV_MAIN_GROUP_STATE_SERVICES",
                    "GTV_MAIN_IMAGE_EXPORT_NAMING_PROXY",
                    "GTV_MAIN_IMAGE_EXPORT_SERVICES",
                    "GTV_MAIN_APP_STATE_SERVICES",
                    "GTV_MAIN_PERSISTENCE_COMPOSITION_SERVICES",
                    "GTV_MAIN_RUNTIME_COMPOSITION_SERVICES",
                    "GTV_MAIN_APP_BOOTSTRAP",
                ),
                onWarnMissingMethod: (serviceName, methodName) => {
                    if (typeof d.consoleWarn === "function") {
                        d.consoleWarn(`[GTV] ${serviceName}.${methodName} is unavailable. Fallback path will be used.`);
                    }
                },
                onMissingFeature: (featureKey) => {
                    if (typeof d.showMissingFeatureToastOnce === "function") {
                        d.showMissingFeatureToastOnce(featureKey);
                    }
                },
                ...pickAliasedDeps(d, {
                    "stateSetters": "directStateSetters",
                }),
                ...pickDeps(d,
                    "setIsRealtimeState",
                    "callServiceMethod",
                ),
                ...pickAliasedDeps(d, {
                    "getAppStatePatcherService": "getAppStatePatcherServiceRef",
                    "getAppPersistenceStateService": "getAppPersistenceStateServiceRef",
                }),
                ...pickDeps(d, "applyDirectStatePatch"),
                ...pickAliasedDeps(d, {
                    "serviceMethodMissingToken": "SERVICE_METHOD_MISSING",
                    "getPatchedStateFallback": "buildPatchedStateFallbackSnapshot",
                    "tableImageExportWidth": "TABLE_IMAGE_EXPORT_WIDTH",
                    "createCanvas": "createCanvasSafely",
                    "getMainTimezoneRuntimeBridgeService": "getMainTimezoneRuntimeBridgeServiceRef",
                    "getMainTimezoneRuntimeService": "getMainTimezoneRuntimeServiceRef",
                    "getMainBaseTimezoneService": "getMainBaseTimezoneServiceRef",
                    "getMainTimezoneMutationService": "getMainTimezoneMutationServiceRef",
                    "getTimezoneSearchService": "getTimezoneSearchServiceRef",
                    "getTimeCore": "getTimeCoreRef",
                    "getBaseTime": "getBaseTimeSnapshot",
                    "getZoneMap": "getZoneMapRef",
                    "getTzDatabase": "getTzDatabaseRef",
                    "getTimeService": "getTimeServiceRef",
                }),
                ...pickDeps(d, "formatUtcOffsetLabel"),
                resolveLocalizedTZLabel: bindFacade(d, d.getMainTimezoneFacadeServiceRef, "getLocalizedTZLabel"),
                ...pickDeps(d,
                    "timezoneOffsetCache",
                    "timezoneDstCache",
                    "zoneAbbrCache",
                    "getCurrentGroupBaseTimezoneId",
                ),
                sanitizeTimezoneId: bindFacade(d, d.getMainTimezoneFacadeServiceRef, "sanitizeTimezoneId"),
                getNextTimezoneIdSeed: bindFacade(d, d.getMainTimezoneFacadeServiceRef, "getNextTimezoneIdSeed"),
                ...pickAliasedDeps(d, {
                    "getRandomUUID": "getRandomUUIDSafely",
                    "getRandom": "getRandomValue",
                    "getGroupStateService": "getGroupStateServiceRef",
                }),
                ...pickDeps(d, "normalizeCustomAbbr"),
                sanitizeBaseTimezoneId: bindFacade(d, d.getMainTimezoneFacadeServiceRef, "sanitizeBaseTimezoneId"),
                renderList: deferDynamic(d, d.getRenderListRef),
                ...pickAliasedDeps(d, {
                    "getTableRenderService": "getTableRenderServiceRef",
                    "getMainTimezoneFacadeService": "getMainTimezoneFacadeServiceRef",
                    "getCopyActionsService": "getCopyActionsServiceRef",
                }),
                ...pickDeps(d,
                    "isFixedTimeTab",
                    "renderFixedTimeTab",
                ),
                ...pickAliasedDeps(d, {
                    "getTimeAdjustUiService": "getTimeAdjustUiServiceRef",
                    "getTimeAdjustActionsService": "getTimeAdjustActionsServiceRef",
                    "getMultiBulkToolsService": "getMultiBulkToolsServiceRef",
                }),
                ...pickDeps(d,
                    "getTimeAdjustDayStepBySlotSnapshot",
                    "setTimeAdjustDayStepBySlotState",
                ),
                ...pickAliasedDeps(d, {
                    "defaultTimeAdjustDayStep": "DEFAULT_TIME_ADJUST_DAY_STEP",
                    "minTimeAdjustDayStep": "MIN_TIME_ADJUST_DAY_STEP",
                    "maxTimeAdjustDayStep": "MAX_TIME_ADJUST_DAY_STEP",
                    "getFixedTimeTableService": "getFixedTimeTableServiceRef",
                }),
                ...pickDeps(d,
                    "getCurrentGroup",
                    "ensureGroupFixedTimes",
                    "refreshFixedTimeSlotCountControls",
                    "getCurrentGroupFixedTimeShowLiveNow",
                ),
                ...pickAliasedDeps(d, {
                    "getDocumentRef": "getDocumentRefOrNull",
                    "renderBaseTimeSelect": "invokeRenderBaseTimeSelect",
                    "getMultiRangeRenderService": "getMultiRangeRenderServiceRef",
                    "getMultiRangeCopyService": "getMultiRangeCopyServiceRef",
                    "getMultiStateService": "getMultiStateServiceRef",
                    "getMultiRangeStateSnapshot": "getCurrentMultiRangeStateSnapshot",
                }),
                ...pickDeps(d,
                    "setMultiRangeState",
                    "sanitizeMultiRangeCount",
                    "sanitizeMultiRangeTitle",
                    "ensureMultiRangeState",
                    "refreshMultiRangeControls",
                ),
                ...pickAliasedDeps(d, {
                    "now": "getRuntimeNowMs",
                    "getMainClockOrchestratorService": "getMainClockOrchestratorServiceRef",
                    "getMainPersistenceSnapshotService": "getMainPersistenceSnapshotServiceRef",
                }),
                ...pickDeps(d, "warnMissingServiceMethod"),
                ...pickAliasedDeps(d, {
                    "getFixedTimeCoreService": "getFixedTimeCoreServiceRef",
                    "getFixedTimeActionsService": "getFixedTimeActionsServiceRef",
                }),
                ...pickDeps(d,
                    "getPatchedCopyFormatOrderState",
                    "getPatchedCopyFormatEnabledState",
                    "getPatchedCopyTimePartsEnabledState",
                ),
                sanitizeCopyFormatOrderForContext: deferDynamic(d, d.getSanitizeCopyFormatOrderForContextRef),
                sanitizeCopyFormatEnabledForContext: deferDynamic(d, d.getSanitizeCopyFormatEnabledForContextRef),
                sanitizeTimePartsEnabledForContext: deferDynamic(d, d.getSanitizeTimePartsEnabledForContextRef),
                ...pickAliasedDeps(d, {
                    "getWindowRef": "getWindowRefOrNull",
                    "getTimelineFrameService": "getTimelineFrameServiceRef",
                    "getFixedTimeTimelineService": "getFixedTimeTimelineServiceRef",
                    "getMainTabState": "getPatchedMainTabState",
                    "getShowTimelineState": "getShowTimelineStateRef",
                }),
                ...pickDeps(d, "getGlobalTimeState"),
                ...pickAliasedDeps(d, {
                    "getFixedTimeSlotCountForGroup": "getFixedTimeSlotCountForGroupRef",
                }),
                ...pickDeps(d, "getFixedTimeSlotHeaderLabel"),
                ...pickAliasedDeps(d, {
                    "getSlotCountState": "getPatchedSlotCountState",
                }),
                ...pickDeps(d,
                    "GTV_GROUP_CONTEXT_STATE",
                    "GTV_FORMAT_PROFILE_STATE",
                    "GTV_MULTI_RANGE_STATE",
                    "GTV_FIXED_TIME_SLOT_UTILS",
                    "GTV_FIXED_TIME_STATE",
                    "GTV_UI_PREFERENCES_STATE",
                    "GTV_TIMER_ENGINE",
                    "GTV_TIME_SERVICE",
                    "MAIN_TABS",
                    "getGroupsStateSnapshot",
                    "getPatchedActiveFormatProfileContextState",
                    "getPatchedMainTabState",
                    "getPatchedActiveGroupIdState",
                    "getActiveGroupIdByMainTabStateSnapshot",
                    "patchPrimaryState",
                    "getUTCRef",
                ),
                sanitizeUtcRowOrder: bindFacade(d, d.getTimeCoreRef, "sanitizeUtcRowOrder"),
                ...pickDeps(d,
                    "COPY_FORMAT_KEYS",
                    "TIME_PART_KEYS",
                    "FORMAT_PROFILE_CONTEXT_KEYS",
                    "DEFAULT_DISPLAY_FORMAT_ENABLED",
                    "DEFAULT_COPY_FORMAT_ENABLED",
                    "DEFAULT_DISPLAY_TIME_PARTS_ENABLED",
                    "DEFAULT_COPY_TIME_PARTS_ENABLED",
                    "sanitizeMainTab",
                ),
                ...pickAliasedDeps(d, {
                    "getDisplayFormatOrderState": "getDisplayFormatOrderStateRef",
                    "getDisplayFormatEnabledState": "getDisplayFormatEnabledStateRef",
                    "getDisplayTimePartsEnabledState": "getDisplayTimePartsEnabledStateRef",
                    "getCopyFormatOrderState": "getCopyFormatOrderStateRef",
                    "getCopyFormatEnabledState": "getCopyFormatEnabledStateRef",
                    "getCopyTimePartsEnabledState": "getCopyTimePartsEnabledStateRef",
                    "getFormatProfilesState": "getFormatProfilesStateRef",
                    "getActiveFormatProfileContextState": "getActiveFormatProfileContextStateRef",
                }),
                ...pickDeps(d,
                    "getPatchedSlotCountState",
                    "patchAppState",
                    "MIN_MULTI_RANGE_COUNT",
                    "MAX_MULTI_RANGE_COUNT",
                    "DEFAULT_MULTI_RANGE_TITLE",
                ),
                ...pickAliasedDeps(d, {
                    "t": "gtvT",
                }),
                showToast: deferDynamic(d, d.getShowToastRef),
                sanitizeUtcMs: bindFacade(d, d.getTimeCoreRef, "sanitizeUtcMs"),
                ...pickDeps(d,
                    "getGlobalTimesState",
                    "getCurrentMultiRangeStateSnapshot",
                    "isMultiTab",
                    "renderMultiRangesSafely",
                    "updateTimeAdjustPanelSafely",
                    "savePersistenceSafely",
                    "MIN_FIXED_TIME_SLOT_COUNT",
                    "MAX_FIXED_TIME_SLOT_COUNT",
                    "DEFAULT_FIXED_TIME_VALUE",
                ),
                pad: bindFacade(d, d.getTimeCoreRef, "pad"),
                ...pickDeps(d,
                    "parseDateTimeParts",
                    "buildStrictUtcDateFromParts",
                    "getNextFixedTimeSeed",
                    "sanitizeFixedDateValue",
                    "sanitizeFixedTimeShowLiveNow",
                    "sanitizeFixedTimeSlotCount",
                ),
                renderTimelineFrame: deferDynamic(d, d.getRenderTimelineFrameRef),
                ...pickDeps(d,
                    "createUniqueFixedTimeId",
                    "createDefaultFixedTimeSlot",
                    "MIN_UI_SCALE_PERCENT",
                    "MAX_UI_SCALE_PERCENT",
                    "DEFAULT_UI_SCALE_PERCENT",
                    "UI_SCALE_PERCENT_OPTIONS",
                    "DEFAULT_DAY_START_HOUR",
                    "DEFAULT_NIGHT_START_HOUR",
                    "DAY_NIGHT_HOUR_OPTIONS",
                    "THEME_LIST",
                    "THEME_STORAGE_KEY",
                    "UI_SCALE_STORAGE_KEY",
                ),
                ...pickAliasedDeps(d, {
                    "I18N_DATA": "MAIN_I18N_DATA",
                }),
                getStorageValue: bindFacade(d, d.getPersistenceServiceRef, "getStorageValue"),
                setStorageValue: bindFacade(d, d.getPersistenceServiceRef, "setStorageValue"),
                ...pickDeps(d, "getUiScaleState"),
                ...pickAliasedDeps(d, {
                    "getCurrentThemeState": "getCurrentThemeStateRef",
                    "getDayStartHourState": "getDayStartHourStateRef",
                    "getNightStartHourState": "getNightStartHourStateRef",
                    "getRuntimeCurrentLangState": "getPatchedCurrentLangState",
                    "getCurrentLangState": "getCurrentLangStateRef",
                }),
                ...pickDeps(d,
                    "setUiPreferencesState",
                    "DEFAULT_REALTIME_TICK_MS",
                    "getIsRealtimeState",
                    "shouldRunRealtimeTick",
                    "setGlobalTimeState",
                ),
                ...pickAliasedDeps(d, {
                    "maxRuntimeCacheSize": "MAX_RUNTIME_CACHE_SIZE",
                }),
                updateClocks: deferDynamic(d, d.getUpdateClocksRef),
                ...pickAliasedDeps(d, {
                    "setIntervalFn": "setRuntimeInterval",
                    "clearIntervalFn": "clearRuntimeInterval",
                }),
                luxon: callOrNull(d.getLuxonGlobalRef)
            };
        }

        function buildMainFoundationConfig(deps = {}) {
            const d = resolveDeps(deps);
            return {
                ...pickDeps(d,
                    "GTV_SERVICE_BOOTSTRAP",
                    "GTV_PERSISTENCE_SERVICE_BUNDLE",
                    "GTV_MAIN_UI_UTILS",
                    "GTV_APP_FEEDBACK",
                    "GTV_CALCULATOR_ACTIONS",
                    "GTV_TAB_UI",
                    "GTV_TAB_ORCHESTRATOR",
                    "GTV_GROUP_STATE",
                    "GTV_STATE_PERSISTENCE",
                    "GTV_SETTINGS_IO",
                    "GTV_DATA_TRANSFER",
                    "GTV_UI_SETTINGS_ACTIONS",
                    "GTV_CALCULATOR",
                    "PERIOD_RESULT_IDS",
                ),
                ...pickAliasedDeps(d, {
                    "t": "gtvT",
                }),
                showToast: deferDynamic(d, d.getShowToastRef),
                ...pickAliasedDeps(d, {
                    "getPersistenceService": "getPersistenceServiceRef",
                    "confirmFn": "confirmRuntime",
                    "logError": "consoleError",
                }),
                locationRef: callOrNull(d.getLocationRefOrNull),
                documentRef: callOrNull(d.getDocumentRefOrNull)
            };
        }

        return Object.freeze({
            buildMainCoreAssemblyConfig,
            buildMainFoundationConfig
        });
    }

    globalObj.GTVMainCoreAssemblyConfigBuilder = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
