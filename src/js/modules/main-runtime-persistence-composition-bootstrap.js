(function initGtvMainRuntimePersistenceCompositionBootstrap(globalObj) {
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


        function pickAliasedDeps(aliasMap = {}) {
            const resolved = {};
            Object.keys(aliasMap).forEach((targetKey) => {
                resolved[targetKey] = safeDeps[aliasMap[targetKey]];
            });
            return resolved;
        }

        const mainCompositionConfigBuilderService = requireObject(
            safeDeps.mainCompositionConfigBuilderService,
            "mainCompositionConfigBuilderService"
        );
        const mainCoreServices = requireObject(safeDeps.mainCoreServices, "mainCoreServices");

        const buildPersistenceCompositionConfig = requireFunction(
            mainCompositionConfigBuilderService.buildPersistenceCompositionConfig,
            "mainCompositionConfigBuilderService.buildPersistenceCompositionConfig"
        );
        const createMainPersistenceCompositionServices = requireFunction(
            mainCoreServices.createMainPersistenceCompositionServices,
            "mainCoreServices.createMainPersistenceCompositionServices"
        );

        const mainPersistenceCompositionConfig = buildPersistenceCompositionConfig({
            ...pickDeps([
                "GTV_MAIN_GROUP_TABS_SERVICE",
                "GTV_MAIN_PERSISTENCE_SNAPSHOT_SERVICES",
                "GTV_MAIN_PERSISTENCE_SERVICES",
                "GTV_GROUP_TABS",
            ]),
            ...pickAliasedDeps({
                "t": "gtvT"
            }),
            ...pickDeps([
                "deferDynamicCall",
                "getShowToastRef",
                "confirmFnViaMainFoundation",
                "promptFnViaMainFoundation",
                "getPersistenceState",
                "setPersistenceState",
                "isMultiTab",
                "getCurrentGroup",
                "isFixedTimeTab",
                "ensureGroupMultiSubgroupsViaState",
                "normalizeGroupTabState",
                "syncCurrentMultiStateToActiveSubgroup",
                "loadCurrentMultiStateFromActiveSubgroup",
                "renderBaseTimeSelect",
                "renderMultiRangesSafely",
                "renderFixedTimeTab",
                "getRenderListRef",
                "getRenderTimelineFrameRef",
                "setCustomTooltip",
                "hideFloatingTooltip",
                "upgradeNativeTitleTooltips",
                "getDefaultMultiSubgroupNameViaState",
                "getDefaultFixedTimes",
                "getDefaultFixedDate",
                "createMultiSubgroupStateViaState",
                "sanitizeMultiSubgroupNameViaState",
                "sanitizeMultiRangeTitle",
                "getPatchedActiveGroupIdState",
                "getPatchedAppStateSnapshot",
                "patchAppState",
                "sanitizeMainTab",
                "syncActiveFormatProfileFromState",
                "ensureMultiRangeState",
                "getGroupsStateSnapshot",
                "ensureGroupFixedTimes",
                "sanitizeFormatProfiles",
                "getCurrentFormatProfileState",
                "getCurrentGroupBaseTimezoneId",
                "sanitizeCopyFormatOrder",
                "sanitizeCopyFormatEnabled",
                "sanitizeTimePartsEnabled",
                "getTimeAdjustDayStep",
                "sanitizeMultiRangeCount",
                "DEFAULT_DAY_START_HOUR",
                "DEFAULT_NIGHT_START_HOUR",
                "sanitizeDayNightHourValue",
                "getCurrentMultiSubgroupName",
                "sanitizeUtcMsViaTimeCore",
                "getRuntimeNowMs",
                "persistenceServiceBundleFactory",
                "STORAGE_KEY",
                "THEME_STORAGE_KEY",
                "LANG_STORAGE_KEY",
                "UI_SCALE_STORAGE_KEY",
                "LEGACY_STORAGE_KEYS",
                "LEGACY_STORAGE_FALLBACK_KEYS",
                "COPY_FORMAT_KEYS",
                "DEFAULT_TIME_ADJUST_DAY_STEP",
                "MIN_MULTI_RANGE_COUNT",
                "MAIN_I18N_DATA",
                "VERSION",
                "getPersistenceSnapshot",
                "sanitizeGroup",
                "sanitizeBaseTimezoneId",
                "sanitizeTimeAdjustDayStep",
                "deriveTimePartsFromLegacyEnabled",
                "sanitizeMultiStatePayloadViaState",
                "ensureBaseTimezoneSelection",
                "loadThemePreference",
                "applyTheme",
                "loadUiScalePreference",
                "applyUiScale",
                "populateUiScaleSelect",
                "getCurrentUiScalePercent",
                "refreshMultiRangeControls",
                "bindFacadeMethod",
                "getTimezoneSearchServiceRef",
                "refreshSelectWidths",
                "switchMainTab",
                "tFormat",
                "applyVersionBranding",
                "getPatchedCurrentThemeState",
                "getPatchedCurrentLangState",
                "getPatchedMainTabState",
                "sanitizeUtcRowOrderViaTimeCore",
                "sanitizeTheme",
                "sanitizeUiScalePercent",
                "populateDayNightHourSelect",
                "getPatchedDayStartHourState",
                "getPatchedNightStartHourState",
                "setCurrentLang",
                "loadPersistence",
                "localizeAutoGeneratedNamesForCurrentLanguage",
                "sanitizeFilenamePart",
                "pad",
                "sanitizeMultiSubgroupIdViaState",
                "getCurrentMultiSubgroup",
                "getDocumentRefOrNull",
            ]),
        });
        const mainPersistenceCompositionServices = createMainPersistenceCompositionServices(
            mainPersistenceCompositionConfig
        );

        return Object.freeze({
            mainGroupTabsService: mainPersistenceCompositionServices.mainGroupTabsService,
            groupTabsService: mainPersistenceCompositionServices.groupTabsService,
            mainPersistenceSnapshotService: mainPersistenceCompositionServices.mainPersistenceSnapshotService,
            mainPersistenceServices: mainPersistenceCompositionServices.mainPersistenceServices,
            persistenceServices: mainPersistenceCompositionServices.persistenceServices,
            persistenceService: mainPersistenceCompositionServices.persistenceService,
            settingsIoService: mainPersistenceCompositionServices.settingsIoService,
            dataTransferService: mainPersistenceCompositionServices.dataTransferService,
            uiSettingsActionsService: mainPersistenceCompositionServices.uiSettingsActionsService
        });
    }

    globalObj.GTVMainRuntimePersistenceCompositionBootstrap = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
