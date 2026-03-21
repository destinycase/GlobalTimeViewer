(function initGtvMainFormatProfileFacade(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const getFormatProfileStateService = (typeof safeDeps.getFormatProfileStateService === "function")
            ? safeDeps.getFormatProfileStateService
            : (() => null);
        const getActiveFormatProfileContextState = (typeof safeDeps.getActiveFormatProfileContextState === "function")
            ? safeDeps.getActiveFormatProfileContextState
            : (() => "live");
        const getMainTabState = (typeof safeDeps.getMainTabState === "function")
            ? safeDeps.getMainTabState
            : (() => "live");
        const getSlotCountState = (typeof safeDeps.getSlotCountState === "function")
            ? safeDeps.getSlotCountState
            : (() => 1);

        function callFormatProfileStateMethod(methodName, args = [], fallbackFactory = null) {
            const service = getFormatProfileStateService();
            if (service && typeof service[methodName] === "function") {
                return service[methodName](...args);
            }
            if (typeof fallbackFactory === "function") return fallbackFactory();
            return fallbackFactory;
        }

        function getDefaultFormatEnabled(mode = "display") {
            return callFormatProfileStateMethod("getDefaultFormatEnabled", [mode], () => ({}));
        }

        function getDefaultTimePartsEnabled(mode = "display") {
            return callFormatProfileStateMethod("getDefaultTimePartsEnabled", [mode], () => ({}));
        }

        function normalizeCopyFormatKey(rawKey) {
            return callFormatProfileStateMethod("normalizeCopyFormatKey", [rawKey], "");
        }

        function sanitizeCopyFormatOrder(order) {
            return callFormatProfileStateMethod("sanitizeCopyFormatOrder", [order], () => []);
        }

        function sanitizeCopyFormatEnabled(enabled, mode = "display") {
            return callFormatProfileStateMethod("sanitizeCopyFormatEnabled", [enabled, mode], () => ({}));
        }

        function sanitizeTimePartsEnabled(parts, mode = "display") {
            return callFormatProfileStateMethod("sanitizeTimePartsEnabled", [parts, mode], () => ({}));
        }

        function deriveTimePartsFromLegacyEnabled(legacyEnabled, mode = "display") {
            return callFormatProfileStateMethod(
                "deriveTimePartsFromLegacyEnabled",
                [legacyEnabled, mode],
                () => ({})
            );
        }

        function sanitizeFormatProfileContext(context) {
            return callFormatProfileStateMethod(
                "sanitizeFormatProfileContext",
                [context],
                () => {
                    const normalized = (typeof context === "string") ? context.trim() : "";
                    return normalized || "live";
                }
            );
        }

        function getFormatProfileAllowedKeys(context = getActiveFormatProfileContextState()) {
            return callFormatProfileStateMethod("getFormatProfileAllowedKeys", [context], () => []);
        }

        function getFormatProfileAllowedTimePartKeys(context = getActiveFormatProfileContextState()) {
            return callFormatProfileStateMethod("getFormatProfileAllowedTimePartKeys", [context], () => []);
        }

        function sanitizeCopyFormatOrderForContext(order, context = getActiveFormatProfileContextState()) {
            return callFormatProfileStateMethod(
                "sanitizeCopyFormatOrderForContext",
                [order, context],
                () => sanitizeCopyFormatOrder(order)
            );
        }

        function getDefaultFormatEnabledForContext(mode = "display", context = getActiveFormatProfileContextState()) {
            return callFormatProfileStateMethod(
                "getDefaultFormatEnabledForContext",
                [mode, context],
                () => getDefaultFormatEnabled(mode)
            );
        }

        function sanitizeCopyFormatEnabledForContext(
            enabled,
            mode = "display",
            context = getActiveFormatProfileContextState()
        ) {
            return callFormatProfileStateMethod(
                "sanitizeCopyFormatEnabledForContext",
                [enabled, mode, context],
                () => sanitizeCopyFormatEnabled(enabled, mode)
            );
        }

        function sanitizeTimePartsEnabledForContext(parts, mode = "display", context = getActiveFormatProfileContextState()) {
            return callFormatProfileStateMethod(
                "sanitizeTimePartsEnabledForContext",
                [parts, mode, context],
                () => sanitizeTimePartsEnabled(parts, mode)
            );
        }

        function createDefaultFormatProfile(context = "live") {
            return callFormatProfileStateMethod(
                "createDefaultFormatProfile",
                [context],
                () => ({
                    order: [],
                    enabled: {},
                    timePartsEnabled: {}
                })
            );
        }

        function sanitizeFormatProfile(profile, context = getActiveFormatProfileContextState()) {
            return callFormatProfileStateMethod(
                "sanitizeFormatProfile",
                [profile, context],
                () => createDefaultFormatProfile(context)
            );
        }

        function sanitizeFormatProfiles(rawProfiles = null, legacyProfile = null) {
            return callFormatProfileStateMethod("sanitizeFormatProfiles", [rawProfiles, legacyProfile], () => ({}));
        }

        function getCurrentFormatProfileState() {
            const context = getActiveFormatProfileContextState();
            return callFormatProfileStateMethod(
                "getCurrentFormatProfileState",
                [],
                () => createDefaultFormatProfile(context)
            );
        }

        function resolveFormatProfileContext(tab = getMainTabState(), effectiveSlotCount = getSlotCountState()) {
            return callFormatProfileStateMethod(
                "resolveFormatProfileContext",
                [tab, effectiveSlotCount],
                () => sanitizeFormatProfileContext(tab)
            );
        }

        function ensureFormatProfiles(legacyProfile = null) {
            return callFormatProfileStateMethod("ensureFormatProfiles", [legacyProfile], undefined);
        }

        function applyFormatProfileState(profile, context = getActiveFormatProfileContextState()) {
            return callFormatProfileStateMethod("applyFormatProfileState", [profile, context], undefined);
        }

        function syncActiveFormatProfileFromState() {
            return callFormatProfileStateMethod("syncActiveFormatProfileFromState", [], undefined);
        }

        function activateFormatProfileContext(context, options = {}) {
            return callFormatProfileStateMethod(
                "activateFormatProfileContext",
                [context, options],
                () => sanitizeFormatProfileContext(context)
            );
        }

        function activateFormatProfileForCurrentContext(options = {}) {
            return callFormatProfileStateMethod("activateFormatProfileForCurrentContext", [options], undefined);
        }

        function resetDisplayFormatForActiveContext() {
            return callFormatProfileStateMethod("resetDisplayFormatForActiveContext", [], undefined);
        }

        function resetCopyFormatForActiveContext() {
            return callFormatProfileStateMethod("resetCopyFormatForActiveContext", [], undefined);
        }

        return Object.freeze({
            getDefaultFormatEnabled,
            getDefaultTimePartsEnabled,
            normalizeCopyFormatKey,
            sanitizeCopyFormatOrder,
            sanitizeCopyFormatEnabled,
            sanitizeTimePartsEnabled,
            deriveTimePartsFromLegacyEnabled,
            sanitizeFormatProfileContext,
            getFormatProfileAllowedKeys,
            getFormatProfileAllowedTimePartKeys,
            sanitizeCopyFormatOrderForContext,
            getDefaultFormatEnabledForContext,
            sanitizeCopyFormatEnabledForContext,
            sanitizeTimePartsEnabledForContext,
            createDefaultFormatProfile,
            sanitizeFormatProfile,
            sanitizeFormatProfiles,
            getCurrentFormatProfileState,
            resolveFormatProfileContext,
            ensureFormatProfiles,
            applyFormatProfileState,
            syncActiveFormatProfileFromState,
            activateFormatProfileContext,
            activateFormatProfileForCurrentContext,
            resetDisplayFormatForActiveContext,
            resetCopyFormatForActiveContext
        });
    }

    globalObj.GTVMainFormatProfileFacade = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
