(function initGtvMainPersistenceServices(globalObj) {
    "use strict";

    function requireBundleFactory(bundleFactory) {
        if (!bundleFactory || typeof bundleFactory.createBundle !== "function") {
            throw new Error("Missing required module API: persistenceServiceBundleFactory.createBundle");
        }
        return bundleFactory;
    }

    function resolveDocumentRef(explicitDocument) {
        if (explicitDocument) return explicitDocument;
        if (typeof document === "object" && document) return document;
        return null;
    }

    function resolveApplyTranslations(explicitApplyTranslations) {
        if (typeof explicitApplyTranslations === "function") return explicitApplyTranslations;
        if (typeof globalThis !== "undefined" && typeof globalThis.applyTranslations === "function") {
            return globalThis.applyTranslations.bind(globalThis);
        }
        return null;
    }

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const bundleFactory = requireBundleFactory(safeDeps.persistenceServiceBundleFactory);
        const applyTranslationsFn = resolveApplyTranslations(safeDeps.applyTranslations);
        const documentRef = resolveDocumentRef(safeDeps.document);

        const persistenceServices = bundleFactory.createBundle({
            STORAGE_KEY: safeDeps.STORAGE_KEY,
            THEME_STORAGE_KEY: safeDeps.THEME_STORAGE_KEY,
            LANG_STORAGE_KEY: safeDeps.LANG_STORAGE_KEY,
            UI_SCALE_STORAGE_KEY: safeDeps.UI_SCALE_STORAGE_KEY,
            LEGACY_STORAGE_KEYS: safeDeps.LEGACY_STORAGE_KEYS,
            LEGACY_STORAGE_FALLBACK_KEYS: safeDeps.LEGACY_STORAGE_FALLBACK_KEYS,
            COPY_FORMAT_KEYS: safeDeps.COPY_FORMAT_KEYS,
            DEFAULT_TIME_ADJUST_DAY_STEP: safeDeps.DEFAULT_TIME_ADJUST_DAY_STEP,
            MIN_MULTI_RANGE_COUNT: safeDeps.MIN_MULTI_RANGE_COUNT,
            I18N_DATA: safeDeps.I18N_DATA,
            VERSION: safeDeps.VERSION,
            getDefaultFixedTimes: safeDeps.getDefaultFixedTimes,
            getDefaultFixedDate: safeDeps.getDefaultFixedDate,
            getState: safeDeps.getState,
            setState: safeDeps.setState,
            getPersistenceSnapshot: safeDeps.getPersistenceSnapshot,
            ensureGroupMultiSubgroups: (group, options = {}) => safeDeps.ensureGroupMultiSubgroups(group, options),
            sanitizeGroup: safeDeps.sanitizeGroup,
            sanitizeBaseTimezoneId: safeDeps.sanitizeBaseTimezoneId,
            sanitizeMainTab: safeDeps.sanitizeMainTab,
            sanitizeTimeAdjustDayStep: safeDeps.sanitizeTimeAdjustDayStep,
            sanitizeCopyFormatOrder: safeDeps.sanitizeCopyFormatOrder,
            sanitizeCopyFormatEnabled: safeDeps.sanitizeCopyFormatEnabled,
            sanitizeTimePartsEnabled: safeDeps.sanitizeTimePartsEnabled,
            sanitizeFormatProfiles: safeDeps.sanitizeFormatProfiles,
            deriveTimePartsFromLegacyEnabled: safeDeps.deriveTimePartsFromLegacyEnabled,
            sanitizeMultiStatePayload: (rawState = null, fallbackState = null) =>
                safeDeps.sanitizeMultiStatePayload(rawState, fallbackState),
            sanitizeMultiRangeTitle: safeDeps.sanitizeMultiRangeTitle,
            loadCurrentMultiStateFromActiveSubgroup: safeDeps.loadCurrentMultiStateFromActiveSubgroup,
            ensureBaseTimezoneSelection: safeDeps.ensureBaseTimezoneSelection,
            syncCurrentMultiStateToActiveSubgroup: safeDeps.syncCurrentMultiStateToActiveSubgroup,
            loadThemePreference: safeDeps.loadThemePreference,
            applyTheme: safeDeps.applyTheme,
            loadUiScalePreference: safeDeps.loadUiScalePreference,
            applyUiScale: safeDeps.applyUiScale,
            populateUiScaleSelect: safeDeps.populateUiScaleSelect,
            getCurrentUiScalePercent: safeDeps.getCurrentUiScalePercent,
            refreshMultiRangeControls: safeDeps.refreshMultiRangeControls,
            updateTZDropdown: safeDeps.updateTZDropdown,
            refreshSelectWidths: safeDeps.refreshSelectWidths,
            switchMainTab: safeDeps.switchMainTab,
            showToast: safeDeps.showToast,
            t: safeDeps.t,
            confirmFn: safeDeps.confirmFn,
            tFormat: safeDeps.tFormat,
            applyVersionBranding: safeDeps.applyVersionBranding,
            applyTranslations: () => {
                if (applyTranslationsFn) applyTranslationsFn();
            },
            getGroups: safeDeps.getGroups,
            getCurrentTheme: safeDeps.getCurrentTheme,
            getCurrentLang: safeDeps.getCurrentLang,
            getCurrentMainTab: safeDeps.getCurrentMainTab,
            sanitizeUtcRowOrder: safeDeps.sanitizeUtcRowOrder,
            sanitizeTheme: safeDeps.sanitizeTheme,
            sanitizeUiScalePercent: safeDeps.sanitizeUiScalePercent,
            setCurrentLang: safeDeps.setCurrentLang,
            loadPersistence: safeDeps.loadPersistence,
            localizeAutoGeneratedNamesForCurrentLanguage: safeDeps.localizeAutoGeneratedNamesForCurrentLanguage,
            getActiveGroupId: safeDeps.getActiveGroupId,
            sanitizeFilenamePart: safeDeps.sanitizeFilenamePart,
            pad: safeDeps.pad,
            renderGroups: safeDeps.renderGroups,
            renderMultiSubgroups: safeDeps.renderMultiSubgroups,
            renderBaseTimeSelect: safeDeps.renderBaseTimeSelect,
            renderMultiRanges: safeDeps.renderMultiRanges,
            renderList: safeDeps.renderList,
            isMultiTab: safeDeps.isMultiTab,
            sanitizeMultiSubgroupId: safeDeps.sanitizeMultiSubgroupId,
            sanitizeMultiSubgroupName: safeDeps.sanitizeMultiSubgroupName,
            getDefaultMultiSubgroupName: safeDeps.getDefaultMultiSubgroupName,
            getCurrentMultiSubgroup: safeDeps.getCurrentMultiSubgroup,
            document: documentRef
        });

        return Object.freeze({
            persistenceServices,
            persistenceService: persistenceServices.persistenceService,
            settingsIoService: persistenceServices.settingsIoService,
            dataTransferService: persistenceServices.dataTransferService,
            uiSettingsActionsService: persistenceServices.uiSettingsActionsService
        });
    }

    globalObj.GTVMainPersistenceServices = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
