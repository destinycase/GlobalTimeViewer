(function initGtvMainCompositionConfigBuilder(globalObj) {
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

        function callOrNull(fn) {
            return (typeof fn === "function") ? fn() : null;
        }

        function buildPersistenceCompositionConfig(deps = {}) {
            const d = resolveDeps(deps);
            return {
                ...pickDeps(d,
                    "GTV_MAIN_GROUP_TABS_SERVICE",
                    "GTV_MAIN_PERSISTENCE_SNAPSHOT_SERVICES",
                    "GTV_MAIN_PERSISTENCE_SERVICES",
                ),
                groupTabsConfig: {
                    ...pickDeps(d,
                        "GTV_GROUP_TABS",
                        "t",
                    ),
                    showToast: deferDynamic(d, d.getShowToastRef),
                    ...pickAliasedDeps(d, {
                        "confirmFn": "confirmFnViaMainFoundation",
                        "promptFn": "promptFnViaMainFoundation",
                        "getState": "getPersistenceState",
                        "setState": "setPersistenceState",
                    }),
                    ...pickDeps(d,
                        "isMultiTab",
                        "getCurrentGroup",
                        "isFixedTimeTab",
                    ),
                    ...pickAliasedDeps(d, {
                        "ensureGroupMultiSubgroups": "ensureGroupMultiSubgroupsViaState",
                    }),
                    ...pickDeps(d,
                        "normalizeGroupTabState",
                        "syncCurrentMultiStateToActiveSubgroup",
                        "loadCurrentMultiStateFromActiveSubgroup",
                        "renderBaseTimeSelect",
                    ),
                    ...pickAliasedDeps(d, {
                        "renderMultiRanges": "renderMultiRangesSafely",
                    }),
                    ...pickDeps(d, "renderFixedTimeTab"),
                    renderList: deferDynamic(d, d.getRenderListRef),
                    renderTimelineFrame: deferDynamic(d, d.getRenderTimelineFrameRef),
                    ...pickDeps(d,
                        "setCustomTooltip",
                        "hideFloatingTooltip",
                        "upgradeNativeTitleTooltips",
                    ),
                    ...pickAliasedDeps(d, {
                        "getDefaultMultiSubgroupName": "getDefaultMultiSubgroupNameViaState",
                    }),
                    ...pickDeps(d,
                        "getDefaultFixedTimes",
                        "getDefaultFixedDate",
                    ),
                    ...pickAliasedDeps(d, {
                        "createMultiSubgroupState": "createMultiSubgroupStateViaState",
                        "sanitizeMultiSubgroupName": "sanitizeMultiSubgroupNameViaState",
                        "getActiveGroupId": "getPatchedActiveGroupIdState",
                    }),
                    ...pickDeps(d, "sanitizeMultiRangeTitle"),
                },
                snapshotConfig: {
                    ...pickAliasedDeps(d, {
                        "getState": "getPatchedAppStateSnapshot",
                        "setState": "patchAppState",
                    }),
                    ...pickDeps(d,
                        "sanitizeMainTab",
                        "syncActiveFormatProfileFromState",
                        "syncCurrentMultiStateToActiveSubgroup",
                        "normalizeGroupTabState",
                        "ensureMultiRangeState",
                    ),
                    ...pickAliasedDeps(d, {
                        "getGroups": "getGroupsStateSnapshot",
                    }),
                    ...pickDeps(d, "ensureGroupFixedTimes"),
                    ...pickAliasedDeps(d, {
                        "ensureGroupMultiSubgroups": "ensureGroupMultiSubgroupsViaState",
                    }),
                    ...pickDeps(d,
                        "sanitizeFormatProfiles",
                        "getCurrentFormatProfileState",
                        "getCurrentGroupBaseTimezoneId",
                        "sanitizeCopyFormatOrder",
                        "sanitizeCopyFormatEnabled",
                        "sanitizeTimePartsEnabled",
                        "getTimeAdjustDayStep",
                        "sanitizeMultiRangeCount",
                        "sanitizeMultiRangeTitle",
                        "DEFAULT_DAY_START_HOUR",
                        "DEFAULT_NIGHT_START_HOUR",
                    ),
                    ...pickAliasedDeps(d, {
                        "sanitizeDayNightHour": "sanitizeDayNightHourValue",
                    }),
                    ...pickDeps(d, "getCurrentMultiSubgroupName"),
                    ...pickAliasedDeps(d, {
                        "sanitizeUtcMs": "sanitizeUtcMsViaTimeCore",
                        "now": "getRuntimeNowMs",
                    }),
                },
                persistenceConfig: {
                    ...pickDeps(d,
                        "persistenceServiceBundleFactory",
                        "STORAGE_KEY",
                        "THEME_STORAGE_KEY",
                        "LANG_STORAGE_KEY",
                        "UI_SCALE_STORAGE_KEY",
                        "DEFAULT_DAY_START_HOUR",
                        "DEFAULT_NIGHT_START_HOUR",
                        "LEGACY_STORAGE_KEYS",
                        "LEGACY_STORAGE_FALLBACK_KEYS",
                        "COPY_FORMAT_KEYS",
                        "DEFAULT_TIME_ADJUST_DAY_STEP",
                        "MIN_MULTI_RANGE_COUNT",
                    ),
                    ...pickAliasedDeps(d, {
                        "I18N_DATA": "MAIN_I18N_DATA",
                    }),
                    ...pickDeps(d,
                        "VERSION",
                        "getDefaultFixedTimes",
                        "getDefaultFixedDate",
                    ),
                    ...pickAliasedDeps(d, {
                        "getState": "getPersistenceState",
                        "setState": "setPersistenceState",
                    }),
                    ...pickDeps(d, "getPersistenceSnapshot"),
                    ...pickAliasedDeps(d, {
                        "ensureGroupMultiSubgroups": "ensureGroupMultiSubgroupsViaState",
                    }),
                    ...pickDeps(d,
                        "sanitizeGroup",
                        "sanitizeBaseTimezoneId",
                        "sanitizeMainTab",
                        "sanitizeTimeAdjustDayStep",
                        "sanitizeCopyFormatOrder",
                        "sanitizeCopyFormatEnabled",
                        "sanitizeTimePartsEnabled",
                        "sanitizeFormatProfiles",
                        "deriveTimePartsFromLegacyEnabled",
                    ),
                    ...pickAliasedDeps(d, {
                        "sanitizeMultiStatePayload": "sanitizeMultiStatePayloadViaState",
                    }),
                    ...pickDeps(d,
                        "sanitizeMultiRangeTitle",
                        "loadCurrentMultiStateFromActiveSubgroup",
                        "ensureBaseTimezoneSelection",
                        "syncCurrentMultiStateToActiveSubgroup",
                        "loadThemePreference",
                        "applyTheme",
                        "loadUiScalePreference",
                        "applyUiScale",
                        "populateUiScaleSelect",
                        "getCurrentUiScalePercent",
                        "refreshMultiRangeControls",
                    ),
                    updateTZDropdown: bindFacade(d, d.getTimezoneSearchServiceRef, "updateTZDropdown"),
                    ...pickDeps(d,
                        "refreshSelectWidths",
                        "switchMainTab",
                    ),
                    showToast: deferDynamic(d, d.getShowToastRef),
                    ...pickDeps(d, "t"),
                    ...pickAliasedDeps(d, {
                        "confirmFn": "confirmFnViaMainFoundation",
                    }),
                    ...pickDeps(d,
                        "tFormat",
                        "applyVersionBranding",
                    ),
                    ...pickAliasedDeps(d, {
                        "getGroups": "getGroupsStateSnapshot",
                        "getCurrentTheme": "getPatchedCurrentThemeState",
                        "getCurrentLang": "getPatchedCurrentLangState",
                        "getCurrentMainTab": "getPatchedMainTabState",
                        "sanitizeUtcRowOrder": "sanitizeUtcRowOrderViaTimeCore",
                    }),
                    ...pickDeps(d,
                        "sanitizeTheme",
                        "sanitizeUiScalePercent",
                        "populateDayNightHourSelect",
                    ),
                    ...pickAliasedDeps(d, {
                        "getDayStartHour": "getPatchedDayStartHourState",
                        "getNightStartHour": "getPatchedNightStartHourState",
                    }),
                    ...pickDeps(d,
                        "setCurrentLang",
                        "loadPersistence",
                        "localizeAutoGeneratedNamesForCurrentLanguage",
                    ),
                    ...pickAliasedDeps(d, {
                        "getActiveGroupId": "getPatchedActiveGroupIdState",
                    }),
                    ...pickDeps(d,
                        "sanitizeFilenamePart",
                        "pad",
                        "renderBaseTimeSelect",
                    ),
                    ...pickAliasedDeps(d, {
                        "renderMultiRanges": "renderMultiRangesSafely",
                    }),
                    renderList: deferDynamic(d, d.getRenderListRef),
                    ...pickDeps(d, "isMultiTab"),
                    ...pickAliasedDeps(d, {
                        "sanitizeMultiSubgroupId": "sanitizeMultiSubgroupIdViaState",
                        "sanitizeMultiSubgroupName": "sanitizeMultiSubgroupNameViaState",
                        "getDefaultMultiSubgroupName": "getDefaultMultiSubgroupNameViaState",
                    }),
                    ...pickDeps(d, "getCurrentMultiSubgroup"),
                    document: callOrNull(d.getDocumentRefOrNull)
                }
            };
        }

        function buildRuntimeCompositionConfig(deps = {}) {
            const d = resolveDeps(deps);
            return {
                ...pickDeps(d,
                    "GTV_MAIN_UI_RUNTIME_SERVICES",
                    "GTV_MAIN_CLOCK_ORCHESTRATOR_SERVICES",
                ),
                moduleDeps: {
                    ...pickDeps(d,
                        "GTV_TIMELINE_FRAME",
                        "GTV_FIXED_TIME_TABLE",
                    ),
                    ...pickDeps(d, "GTV_MAIN_UI_INIT")
                },
                timelineConfig: {
                    ...pickDeps(d,
                        "TIMELINE_TOTAL_HOURS",
                        "TIMELINE_TOTAL_SECONDS",
                        "requestUiFrame",
                    ),
                    ...pickDeps(d, "cancelUiFrame")
                },
                state: {
                    ...pickAliasedDeps(d, {
                        "getCurrentMainTab": "getPatchedMainTabState",
                        "getIsRealtime": "getIsRealtimeState",
                        "getSlotCount": "getPatchedSlotCountState",
                        "getGlobalTime": "getGlobalTimeState",
                        "setGlobalTime": "setGlobalTimeState",
                        "getCurrentLang": "getPatchedCurrentLangState",
                        "getCurrentTheme": "getPatchedCurrentThemeState",
                        "getUiScale": "getUiScaleState",
                        "getDayStartHour": "getPatchedDayStartHourState",
                        "getNightStartHour": "getPatchedNightStartHourState",
                        "getMultiRangeCount": "getPatchedMultiRangeCountState",
                        "getShowCopyFormat": "getPatchedShowCopyFormatState",
                        "setShowCopyFormat": "setPatchedShowCopyFormatState",
                        "getShowTimeline": "getPatchedShowTimelineState",
                        "setShowTimeline": "setPatchedShowTimelineState",
                        "getSlotCountState": "getPatchedSlotCountState",
                        "setSlotCount": "setPatchedSlotCountState",
                    }),
                },
                services: {
                    ...pickAliasedDeps(d, {
                        "getPersistenceService": "getPersistenceServiceRef",
                        "getTableRenderService": "getTableRenderServiceRef",
                        "getFormatControlsService": "getFormatControlsServiceRef",
                        "getGroupTabsService": "getGroupTabsServiceRef",
                        "getMultiRangeRenderService": "getMultiRangeRenderServiceRef",
                        "getTimezoneSearchService": "getTimezoneSearchServiceRef",
                        "getTimeAdjustUiService": "getTimeAdjustUiServiceRef",
                        "getTabUiService": "getTabUiServiceRef",
                        "getUiSettingsActionsService": "getUiSettingsActionsServiceRef",
                    }),
                },
                actions: {
                    ...pickDeps(d,
                        "t",
                        "isMultiTab",
                        "isFixedTimeTab",
                        "getBaseTimezoneRef",
                        "getCurrentGroupZones",
                        "isCurrentGroupUtcRowVisible",
                        "getCurrentGroupUtcRowOrder",
                        "getUTCRef",
                        "resolveFixedTimeTimelineSourceDate",
                        "applyFixedTimeSlotTimelineRatio",
                        "getFixedTimeTimelineSlots",
                        "getFixedTimeTimelineSlotCount",
                        "getFixedTimeTimelineIndicatorToken",
                        "getFixedTimeSlotTimelineLabel",
                        "getZoneDisplayName",
                        "getZoneDisplayNameForUiAtDate",
                        "getFixedOffsetForDisplayAtDate",
                        "getLocalPartsByTimezone",
                        "getDayNightMarkerByHour",
                        "getUTCDateFromLocalParts",
                        "clampNumber",
                        "pad",
                    ),
                    updateClocks: deferDynamic(d, d.getUpdateClocksRef),
                    ...pickDeps(d,
                        "getCurrentGroup",
                        "ensureGroupFixedTimes",
                        "getFixedTimeDisplayPartsEnabled",
                    ),
                    ...pickAliasedDeps(d, {
                        "getDisplayFormatOrder": "getPatchedDisplayFormatOrderState",
                        "getDisplayFormatEnabled": "getPatchedDisplayFormatEnabledState",
                    }),
                    ...pickDeps(d,
                        "sanitizeCopyFormatOrderForContext",
                        "sanitizeCopyFormatEnabledForContext",
                        "resolveFixedTimeSlotUtcDate",
                        "getFixedTimeTimelineIndicatorColor",
                        "getFixedTimeSlotHeaderLabel",
                        "renameFixedTimeSlot",
                        "copyFixedTimeSlotColumn",
                        "getZoneAbbreviation",
                        "formatUtcOffsetLabel",
                        "getCustomOffsetMinutes",
                        "getTimezoneOffset",
                        "buildFixedTimeDisplayPayloadAtUtc",
                        "bindCustomDatePickerForInput",
                        "buildFixedTimeCellInputValue",
                        "applyFixedTimeSlotByTimezoneInput",
                        "copyFixedTimeCellByTimezone",
                        "upgradeNativeTitleTooltips",
                        "switchMainTab",
                        "populateUiScaleSelect",
                        "populateDayNightHourSelect",
                        "applyUiScale",
                        "setDayNightRange",
                        "setMultiRangeCount",
                        "refreshMultiRangeControls",
                        "getFixedTimeSlotCountForCurrentGroup",
                        "setFixedTimeSlotCount",
                        "refreshFixedTimeSlotCountControls",
                        "setCurrentGroupFixedDate",
                        "getCurrentGroupFixedTimeShowLiveNow",
                        "setCurrentGroupFixedTimeShowLiveNow",
                        "sanitizeFixedDateValue",
                    ),
                    showToast: deferDynamic(d, d.getShowToastRef),
                    ...pickDeps(d,
                        "normalizeCustomAbbr",
                        "addTimezone",
                        "createUniqueTimezoneId",
                        "syncActiveFormatProfileFromState",
                        "activateFormatProfileForCurrentContext",
                    ),
                    renderList: deferDynamic(d, d.getRenderListRef),
                    ...pickDeps(d, "updateCopyFormatPreview"),
                    renderTimelineFrame: deferDynamic(d, d.getRenderTimelineFrameRef),
                    ...pickDeps(d,
                        "resetDisplayFormatForActiveContext",
                        "resetCopyFormatForActiveContext",
                        "applyCurrentGroupBaseTimezoneId",
                        "copyAllTimezones",
                        "saveTimezoneTableImage",
                        "saveMultiRangeTitlesImage",
                        "applyTheme",
                        "hideFloatingTooltip",
                        "localizeAutoGeneratedNamesForCurrentLanguage",
                        "applyVersionBranding",
                        "refreshSelectWidths",
                        "renderBaseTimeSelect",
                        "updateRow",
                    ),
                    ...pickDeps(d, "renderFixedTimeTab")
                },
                environment: {
                    ...pickAliasedDeps(d, {
                        "getDocumentRef": "getDocumentRefOrNull",
                        "getWindowRef": "getWindowRefOrNull",
                        "getGlobalThisRef": "getGlobalThisRefOrNull",
                    }),
                }
            };
        }

        return Object.freeze({
            buildPersistenceCompositionConfig,
            buildRuntimeCompositionConfig
        });
    }

    globalObj.GTVMainCompositionConfigBuilder = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
