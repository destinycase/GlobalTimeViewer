(function initGtvPersistenceServiceBundle(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function resolveModuleApi(moduleName) {
            const api = safeDeps[moduleName];
            if (!api || typeof api.createService !== "function") {
                throw new Error(`Missing required module API: ${moduleName}.createService`);
            }
            return api;
        }

        const statePersistenceApi = resolveModuleApi("GTV_STATE_PERSISTENCE");
        const settingsIoApi = resolveModuleApi("GTV_SETTINGS_IO");
        const dataTransferApi = resolveModuleApi("GTV_DATA_TRANSFER");
        const uiSettingsActionsApi = resolveModuleApi("GTV_UI_SETTINGS_ACTIONS");

        function createBundle(config = {}) {
            const cfg = (config && typeof config === "object") ? config : {};

            const persistenceService = statePersistenceApi.createService({
                STORAGE_KEY: cfg.STORAGE_KEY,
                THEME_STORAGE_KEY: cfg.THEME_STORAGE_KEY,
                LANG_STORAGE_KEY: cfg.LANG_STORAGE_KEY,
                UI_SCALE_STORAGE_KEY: cfg.UI_SCALE_STORAGE_KEY,
                LEGACY_STORAGE_KEYS: cfg.LEGACY_STORAGE_KEYS,
                LEGACY_STORAGE_FALLBACK_KEYS: cfg.LEGACY_STORAGE_FALLBACK_KEYS,
                COPY_FORMAT_KEYS: cfg.COPY_FORMAT_KEYS,
                DEFAULT_TIME_ADJUST_DAY_STEP: cfg.DEFAULT_TIME_ADJUST_DAY_STEP,
                MIN_MULTI_RANGE_COUNT: cfg.MIN_MULTI_RANGE_COUNT,
                I18N_DATA: cfg.I18N_DATA,
                getDefaultFixedTimes: cfg.getDefaultFixedTimes,
                getState: cfg.getState,
                setState: cfg.setState,
                getPersistenceSnapshot: cfg.getPersistenceSnapshot,
                ensureGroupMultiSubgroups: cfg.ensureGroupMultiSubgroups,
                sanitizeGroup: cfg.sanitizeGroup,
                sanitizeBaseTimezoneId: cfg.sanitizeBaseTimezoneId,
                sanitizeMainTab: cfg.sanitizeMainTab,
                sanitizeTimeAdjustDayStep: cfg.sanitizeTimeAdjustDayStep,
                sanitizeCopyFormatOrder: cfg.sanitizeCopyFormatOrder,
                sanitizeCopyFormatEnabled: cfg.sanitizeCopyFormatEnabled,
                sanitizeTimePartsEnabled: cfg.sanitizeTimePartsEnabled,
                sanitizeFormatProfiles: cfg.sanitizeFormatProfiles,
                deriveTimePartsFromLegacyEnabled: cfg.deriveTimePartsFromLegacyEnabled,
                sanitizeMultiStatePayload: cfg.sanitizeMultiStatePayload,
                sanitizeMultiRangeTitle: cfg.sanitizeMultiRangeTitle,
                getDefaultFixedDate: cfg.getDefaultFixedDate,
                loadCurrentMultiStateFromActiveSubgroup: cfg.loadCurrentMultiStateFromActiveSubgroup,
                ensureBaseTimezoneSelection: cfg.ensureBaseTimezoneSelection,
                syncCurrentMultiStateToActiveSubgroup: cfg.syncCurrentMultiStateToActiveSubgroup,
                loadThemePreference: cfg.loadThemePreference,
                applyTheme: cfg.applyTheme,
                loadUiScalePreference: cfg.loadUiScalePreference,
                applyUiScale: cfg.applyUiScale,
                populateUiScaleSelect: cfg.populateUiScaleSelect,
                getCurrentUiScalePercent: cfg.getCurrentUiScalePercent,
                refreshMultiRangeControls: cfg.refreshMultiRangeControls,
                updateTZDropdown: cfg.updateTZDropdown,
                refreshSelectWidths: cfg.refreshSelectWidths,
                switchMainTab: cfg.switchMainTab,
                showToast: cfg.showToast,
                t: cfg.t,
                applyVersionBranding: cfg.applyVersionBranding,
                applyTranslations: cfg.applyTranslations
            });

            const settingsIoService = settingsIoApi.createService({
                I18N_DATA: cfg.I18N_DATA,
                THEME_STORAGE_KEY: cfg.THEME_STORAGE_KEY,
                LANG_STORAGE_KEY: cfg.LANG_STORAGE_KEY,
                UI_SCALE_STORAGE_KEY: cfg.UI_SCALE_STORAGE_KEY,
                t: cfg.t,
                getGroups: cfg.getGroups,
                getCurrentTheme: cfg.getCurrentTheme,
                getCurrentLang: cfg.getCurrentLang,
                getCurrentMainTab: cfg.getCurrentMainTab,
                getDefaultFixedTimes: cfg.getDefaultFixedTimes,
                getDefaultFixedDate: cfg.getDefaultFixedDate,
                sanitizeGroup: cfg.sanitizeGroup,
                sanitizeMainTab: cfg.sanitizeMainTab,
                sanitizeBaseTimezoneId: cfg.sanitizeBaseTimezoneId,
                sanitizeUtcRowOrder: cfg.sanitizeUtcRowOrder,
                sanitizeMultiStatePayload: cfg.sanitizeMultiStatePayload,
                sanitizeMultiRangeTitle: cfg.sanitizeMultiRangeTitle,
                normalizeImportedPayload: (payload = null) => persistenceService.normalizeImportedPayload(payload),
                persistStorageSnapshot: (snapshot, options = {}) => persistenceService.persistStorageSnapshot(snapshot, options),
                getStorageValue: (key, fallback = null) => persistenceService.getStorageValue(key, fallback),
                setStorageValue: (key, value, options = {}) => persistenceService.setStorageValue(key, value, options),
                sanitizeTheme: cfg.sanitizeTheme,
                sanitizeUiScalePercent: cfg.sanitizeUiScalePercent,
                setCurrentLang: cfg.setCurrentLang,
                loadPersistence: cfg.loadPersistence,
                localizeAutoGeneratedNamesForCurrentLanguage: cfg.localizeAutoGeneratedNamesForCurrentLanguage,
                savePersistence: (options = {}) => persistenceService.savePersistence(options),
                applyTheme: cfg.applyTheme,
                loadThemePreference: cfg.loadThemePreference,
                applyUiScale: cfg.applyUiScale,
                loadUiScalePreference: cfg.loadUiScalePreference,
                applyTranslations: cfg.applyTranslations,
                applyVersionBranding: cfg.applyVersionBranding,
                populateUiScaleSelect: cfg.populateUiScaleSelect,
                getCurrentUiScalePercent: cfg.getCurrentUiScalePercent,
                refreshMultiRangeControls: cfg.refreshMultiRangeControls,
                updateTZDropdown: cfg.updateTZDropdown,
                refreshSelectWidths: cfg.refreshSelectWidths,
                switchMainTab: cfg.switchMainTab
            });

            const dataTransferService = dataTransferApi.createService({
                VERSION: cfg.VERSION,
                MIN_MULTI_RANGE_COUNT: cfg.MIN_MULTI_RANGE_COUNT,
                I18N_DATA: cfg.I18N_DATA,
                getGroups: cfg.getGroups,
                getActiveGroupId: cfg.getActiveGroupId,
                getCurrentTheme: cfg.getCurrentTheme,
                getCurrentLang: cfg.getCurrentLang,
                getPersistenceSnapshot: cfg.getPersistenceSnapshot,
                getCurrentUiScalePercent: cfg.getCurrentUiScalePercent,
                sanitizeTheme: cfg.sanitizeTheme,
                sanitizeFilenamePart: cfg.sanitizeFilenamePart,
                pad: cfg.pad,
                syncCurrentMultiStateToActiveSubgroup: cfg.syncCurrentMultiStateToActiveSubgroup,
                ensureGroupMultiSubgroups: cfg.ensureGroupMultiSubgroups,
                sanitizeGroup: cfg.sanitizeGroup,
                loadCurrentMultiStateFromActiveSubgroup: cfg.loadCurrentMultiStateFromActiveSubgroup,
                savePersistence: (options = {}) => persistenceService.savePersistence(options),
                renderGroups: cfg.renderGroups,
                renderMultiSubgroups: cfg.renderMultiSubgroups,
                renderBaseTimeSelect: cfg.renderBaseTimeSelect,
                renderMultiRanges: cfg.renderMultiRanges,
                renderList: cfg.renderList,
                isMultiTab: cfg.isMultiTab,
                sanitizeMultiSubgroupId: cfg.sanitizeMultiSubgroupId,
                sanitizeMultiSubgroupName: cfg.sanitizeMultiSubgroupName,
                getDefaultMultiSubgroupName: cfg.getDefaultMultiSubgroupName,
                sanitizeMultiStatePayload: cfg.sanitizeMultiStatePayload,
                getCurrentMultiSubgroup: cfg.getCurrentMultiSubgroup,
                applyImportedSettings: (importedRoot) => settingsIoService.applyImportedSettings(importedRoot),
                isQuotaExceededError: (err) => persistenceService.isQuotaExceededError(err),
                showToast: cfg.showToast,
                t: cfg.t,
                tFormat: cfg.tFormat
            });

            const uiSettingsActionsService = uiSettingsActionsApi.createService({
                document: cfg.document,
                exportSettingsToJSON: () => dataTransferService.exportSettingsToJSON(),
                handleSettingsImportFile: (event) => dataTransferService.handleSettingsImportFile(event),
                handleGroupImportFile: (event) => dataTransferService.handleGroupImportFile(event),
                handleSubgroupImportFile: (event) => dataTransferService.handleSubgroupImportFile(event),
                resetExceptGroupsAndTimezones: () => persistenceService.resetExceptGroupsAndTimezones(),
                resetAllSettings: () => persistenceService.resetAllSettings()
            });

            return Object.freeze({
                persistenceService,
                settingsIoService,
                dataTransferService,
                uiSettingsActionsService
            });
        }

        return Object.freeze({
            createBundle
        });
    }

    globalObj.GTVPersistenceServiceBundle = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
