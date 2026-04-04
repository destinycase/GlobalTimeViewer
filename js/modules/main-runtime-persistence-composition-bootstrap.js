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
            GTV_MAIN_GROUP_TABS_SERVICE: safeDeps.GTV_MAIN_GROUP_TABS_SERVICE,
            GTV_MAIN_PERSISTENCE_SNAPSHOT_SERVICES: safeDeps.GTV_MAIN_PERSISTENCE_SNAPSHOT_SERVICES,
            GTV_MAIN_PERSISTENCE_SERVICES: safeDeps.GTV_MAIN_PERSISTENCE_SERVICES,
            GTV_GROUP_TABS: safeDeps.GTV_GROUP_TABS,
            t: safeDeps.gtvT,
            deferDynamicCall: safeDeps.deferDynamicCall,
            getShowToastRef: safeDeps.getShowToastRef,
            confirmFnViaMainFoundation: safeDeps.confirmFnViaMainFoundation,
            promptFnViaMainFoundation: safeDeps.promptFnViaMainFoundation,
            getPersistenceState: safeDeps.getPersistenceState,
            setPersistenceState: safeDeps.setPersistenceState,
            isMultiTab: safeDeps.isMultiTab,
            getCurrentGroup: safeDeps.getCurrentGroup,
            isFixedTimeTab: safeDeps.isFixedTimeTab,
            ensureGroupMultiSubgroupsViaState: safeDeps.ensureGroupMultiSubgroupsViaState,
            normalizeGroupTabState: safeDeps.normalizeGroupTabState,
            syncCurrentMultiStateToActiveSubgroup: safeDeps.syncCurrentMultiStateToActiveSubgroup,
            loadCurrentMultiStateFromActiveSubgroup: safeDeps.loadCurrentMultiStateFromActiveSubgroup,
            renderBaseTimeSelect: safeDeps.renderBaseTimeSelect,
            renderMultiRangesSafely: safeDeps.renderMultiRangesSafely,
            renderFixedTimeTab: safeDeps.renderFixedTimeTab,
            getRenderListRef: safeDeps.getRenderListRef,
            getRenderTimelineFrameRef: safeDeps.getRenderTimelineFrameRef,
            setCustomTooltip: safeDeps.setCustomTooltip,
            hideFloatingTooltip: safeDeps.hideFloatingTooltip,
            upgradeNativeTitleTooltips: safeDeps.upgradeNativeTitleTooltips,
            getDefaultMultiSubgroupNameViaState: safeDeps.getDefaultMultiSubgroupNameViaState,
            getDefaultFixedTimes: safeDeps.getDefaultFixedTimes,
            getDefaultFixedDate: safeDeps.getDefaultFixedDate,
            createMultiSubgroupStateViaState: safeDeps.createMultiSubgroupStateViaState,
            sanitizeMultiSubgroupNameViaState: safeDeps.sanitizeMultiSubgroupNameViaState,
            sanitizeMultiRangeTitle: safeDeps.sanitizeMultiRangeTitle,
            getPatchedActiveGroupIdState: safeDeps.getPatchedActiveGroupIdState,
            getPatchedAppStateSnapshot: safeDeps.getPatchedAppStateSnapshot,
            patchAppState: safeDeps.patchAppState,
            sanitizeMainTab: safeDeps.sanitizeMainTab,
            syncActiveFormatProfileFromState: safeDeps.syncActiveFormatProfileFromState,
            ensureMultiRangeState: safeDeps.ensureMultiRangeState,
            getGroupsStateSnapshot: safeDeps.getGroupsStateSnapshot,
            ensureGroupFixedTimes: safeDeps.ensureGroupFixedTimes,
            sanitizeFormatProfiles: safeDeps.sanitizeFormatProfiles,
            getCurrentFormatProfileState: safeDeps.getCurrentFormatProfileState,
            getCurrentGroupBaseTimezoneId: safeDeps.getCurrentGroupBaseTimezoneId,
            sanitizeCopyFormatOrder: safeDeps.sanitizeCopyFormatOrder,
            sanitizeCopyFormatEnabled: safeDeps.sanitizeCopyFormatEnabled,
            sanitizeTimePartsEnabled: safeDeps.sanitizeTimePartsEnabled,
            getTimeAdjustDayStep: safeDeps.getTimeAdjustDayStep,
            sanitizeMultiRangeCount: safeDeps.sanitizeMultiRangeCount,
            DEFAULT_DAY_START_HOUR: safeDeps.DEFAULT_DAY_START_HOUR,
            DEFAULT_NIGHT_START_HOUR: safeDeps.DEFAULT_NIGHT_START_HOUR,
            sanitizeDayNightHourValue: safeDeps.sanitizeDayNightHourValue,
            getCurrentMultiSubgroupName: safeDeps.getCurrentMultiSubgroupName,
            sanitizeUtcMsViaTimeCore: safeDeps.sanitizeUtcMsViaTimeCore,
            getRuntimeNowMs: safeDeps.getRuntimeNowMs,
            persistenceServiceBundleFactory: safeDeps.persistenceServiceBundleFactory,
            STORAGE_KEY: safeDeps.STORAGE_KEY,
            THEME_STORAGE_KEY: safeDeps.THEME_STORAGE_KEY,
            LANG_STORAGE_KEY: safeDeps.LANG_STORAGE_KEY,
            UI_SCALE_STORAGE_KEY: safeDeps.UI_SCALE_STORAGE_KEY,
            LEGACY_STORAGE_KEYS: safeDeps.LEGACY_STORAGE_KEYS,
            LEGACY_STORAGE_FALLBACK_KEYS: safeDeps.LEGACY_STORAGE_FALLBACK_KEYS,
            COPY_FORMAT_KEYS: safeDeps.COPY_FORMAT_KEYS,
            DEFAULT_TIME_ADJUST_DAY_STEP: safeDeps.DEFAULT_TIME_ADJUST_DAY_STEP,
            MIN_MULTI_RANGE_COUNT: safeDeps.MIN_MULTI_RANGE_COUNT,
            MAIN_I18N_DATA: safeDeps.MAIN_I18N_DATA,
            VERSION: safeDeps.VERSION,
            getPersistenceSnapshot: safeDeps.getPersistenceSnapshot,
            sanitizeGroup: safeDeps.sanitizeGroup,
            sanitizeBaseTimezoneId: safeDeps.sanitizeBaseTimezoneId,
            sanitizeTimeAdjustDayStep: safeDeps.sanitizeTimeAdjustDayStep,
            deriveTimePartsFromLegacyEnabled: safeDeps.deriveTimePartsFromLegacyEnabled,
            sanitizeMultiStatePayloadViaState: safeDeps.sanitizeMultiStatePayloadViaState,
            ensureBaseTimezoneSelection: safeDeps.ensureBaseTimezoneSelection,
            loadThemePreference: safeDeps.loadThemePreference,
            applyTheme: safeDeps.applyTheme,
            loadUiScalePreference: safeDeps.loadUiScalePreference,
            applyUiScale: safeDeps.applyUiScale,
            populateUiScaleSelect: safeDeps.populateUiScaleSelect,
            getCurrentUiScalePercent: safeDeps.getCurrentUiScalePercent,
            refreshMultiRangeControls: safeDeps.refreshMultiRangeControls,
            bindFacadeMethod: safeDeps.bindFacadeMethod,
            getTimezoneSearchServiceRef: safeDeps.getTimezoneSearchServiceRef,
            refreshSelectWidths: safeDeps.refreshSelectWidths,
            switchMainTab: safeDeps.switchMainTab,
            tFormat: safeDeps.tFormat,
            applyVersionBranding: safeDeps.applyVersionBranding,
            getPatchedCurrentThemeState: safeDeps.getPatchedCurrentThemeState,
            getPatchedCurrentLangState: safeDeps.getPatchedCurrentLangState,
            getPatchedMainTabState: safeDeps.getPatchedMainTabState,
            sanitizeUtcRowOrderViaTimeCore: safeDeps.sanitizeUtcRowOrderViaTimeCore,
            sanitizeTheme: safeDeps.sanitizeTheme,
            sanitizeUiScalePercent: safeDeps.sanitizeUiScalePercent,
            populateDayNightHourSelect: safeDeps.populateDayNightHourSelect,
            getPatchedDayStartHourState: safeDeps.getPatchedDayStartHourState,
            getPatchedNightStartHourState: safeDeps.getPatchedNightStartHourState,
            setCurrentLang: safeDeps.setCurrentLang,
            loadPersistence: safeDeps.loadPersistence,
            localizeAutoGeneratedNamesForCurrentLanguage: safeDeps.localizeAutoGeneratedNamesForCurrentLanguage,
            sanitizeFilenamePart: safeDeps.sanitizeFilenamePart,
            pad: safeDeps.pad,
            sanitizeMultiSubgroupIdViaState: safeDeps.sanitizeMultiSubgroupIdViaState,
            getCurrentMultiSubgroup: safeDeps.getCurrentMultiSubgroup,
            getDocumentRefOrNull: safeDeps.getDocumentRefOrNull
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
