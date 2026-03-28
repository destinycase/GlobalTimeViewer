(function initGtvMainFormatProfileFacadeBindings(globalObj) {
    "use strict";

    const METHOD_NAMES = Object.freeze([
        "getDefaultFormatEnabled",
        "getDefaultTimePartsEnabled",
        "normalizeCopyFormatKey",
        "sanitizeCopyFormatOrder",
        "sanitizeCopyFormatEnabled",
        "sanitizeTimePartsEnabled",
        "deriveTimePartsFromLegacyEnabled",
        "sanitizeFormatProfileContext",
        "getFormatProfileAllowedKeys",
        "getFormatProfileAllowedTimePartKeys",
        "sanitizeCopyFormatOrderForContext",
        "getDefaultFormatEnabledForContext",
        "sanitizeCopyFormatEnabledForContext",
        "sanitizeTimePartsEnabledForContext",
        "createDefaultFormatProfile",
        "sanitizeFormatProfile",
        "sanitizeFormatProfiles",
        "getCurrentFormatProfileState",
        "resolveFormatProfileContext",
        "ensureFormatProfiles",
        "applyFormatProfileState",
        "syncActiveFormatProfileFromState",
        "activateFormatProfileContext",
        "activateFormatProfileForCurrentContext",
        "resetDisplayFormatForActiveContext",
        "resetCopyFormatForActiveContext"
    ]);

    function resolveGlobalRoot(explicitRoot) {
        if (explicitRoot && (typeof explicitRoot === "object" || typeof explicitRoot === "function")) {
            return explicitRoot;
        }
        if (typeof window !== "undefined" && window) return window;
        if (typeof globalThis === "object" && globalThis) return globalThis;
        return null;
    }

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const formatProfileFacadeService = safeDeps.formatProfileFacadeService;
        if (!formatProfileFacadeService || typeof formatProfileFacadeService !== "object") {
            throw new Error("Missing dependency: formatProfileFacadeService");
        }

        const bindings = {};
        METHOD_NAMES.forEach((methodName) => {
            bindings[methodName] = formatProfileFacadeService[methodName];
        });

        const shouldExposeToGlobal = safeDeps.exposeToGlobal !== false;
        const globalRoot = resolveGlobalRoot(safeDeps.globalRoot);
        if (shouldExposeToGlobal && globalRoot) {
            Object.assign(globalRoot, bindings);
        }

        return Object.freeze(bindings);
    }

    globalObj.GTVMainFormatProfileFacadeBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
