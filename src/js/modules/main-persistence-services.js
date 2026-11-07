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

    function resolveWindowRef(explicitWindow) {
        if (
            explicitWindow
            && typeof explicitWindow.addEventListener === "function"
            && typeof explicitWindow.removeEventListener === "function"
        ) {
            return explicitWindow;
        }
        if (
            typeof window === "object"
            && window
            && typeof window.addEventListener === "function"
            && typeof window.removeEventListener === "function"
        ) {
            return window;
        }
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

        function pickDeps(depNames = []) {
            const resolved = {};
            depNames.forEach((depName) => {
                resolved[depName] = safeDeps[depName];
            });
            return resolved;
        }

        const bundleFactory = requireBundleFactory(safeDeps.persistenceServiceBundleFactory);
        const applyTranslationsFn = resolveApplyTranslations(safeDeps.applyTranslations);
        const documentRef = resolveDocumentRef(safeDeps.document);
        const windowRef = resolveWindowRef(safeDeps.window);

        const persistenceServices = bundleFactory.createBundle({
            ...pickDeps([
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
                "I18N_DATA",
                "VERSION",
                "getDefaultFixedTimes",
                "getDefaultFixedDate",
                "getState",
                "setState",
                "getPersistenceSnapshot"
            ]),
            ensureGroupMultiSubgroups: (group, options = {}) => safeDeps.ensureGroupMultiSubgroups(group, options),
            ...pickDeps([
                "sanitizeGroup",
                "sanitizeBaseTimezoneId",
                "sanitizeMainTab",
                "sanitizeTimeAdjustDayStep",
                "sanitizeCopyFormatOrder",
                "sanitizeCopyFormatEnabled",
                "sanitizeTimePartsEnabled",
                "sanitizeFormatProfiles",
                "deriveTimePartsFromLegacyEnabled"
            ]),
            sanitizeMultiStatePayload: (rawState = null, fallbackState = null) =>
                safeDeps.sanitizeMultiStatePayload(rawState, fallbackState),
            ...pickDeps([
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
                "updateTZDropdown",
                "refreshSelectWidths",
                "switchMainTab",
                "showToast",
                "t",
                "confirmFn",
                "tFormat",
                "applyVersionBranding"
            ]),
            applyTranslations: () => {
                if (applyTranslationsFn) applyTranslationsFn();
            },
            ...pickDeps([
                "getGroups",
                "getCurrentTheme",
                "getCurrentLang",
                "getCurrentMainTab",
                "sanitizeUtcRowOrder",
                "sanitizeTheme",
                "sanitizeUiScalePercent",
                "populateDayNightHourSelect",
                "getDayStartHour",
                "getNightStartHour",
                "setCurrentLang",
                "loadPersistence",
                "localizeAutoGeneratedNamesForCurrentLanguage",
                "getActiveGroupId",
                "sanitizeFilenamePart",
                "pad",
                "renderGroups",
                "renderMultiSubgroups",
                "renderBaseTimeSelect",
                "renderMultiRanges",
                "renderList",
                "isMultiTab",
                "sanitizeMultiSubgroupId",
                "sanitizeMultiSubgroupName",
                "getDefaultMultiSubgroupName",
                "getCurrentMultiSubgroup"
            ]),
            documentRef,
            windowRef,
            document: documentRef,
            window: windowRef
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
