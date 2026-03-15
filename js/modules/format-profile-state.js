(function initGtvFormatProfileState(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const COPY_FORMAT_KEYS = Array.isArray(safeDeps.COPY_FORMAT_KEYS) ? [...safeDeps.COPY_FORMAT_KEYS] : [];
        const TIME_PART_KEYS = Array.isArray(safeDeps.TIME_PART_KEYS) ? [...safeDeps.TIME_PART_KEYS] : [];
        const FORMAT_PROFILE_CONTEXT_KEYS = Array.isArray(safeDeps.FORMAT_PROFILE_CONTEXT_KEYS)
            ? [...safeDeps.FORMAT_PROFILE_CONTEXT_KEYS]
            : ["live"];
        const DEFAULT_DISPLAY_FORMAT_ENABLED = (safeDeps.DEFAULT_DISPLAY_FORMAT_ENABLED && typeof safeDeps.DEFAULT_DISPLAY_FORMAT_ENABLED === "object")
            ? { ...safeDeps.DEFAULT_DISPLAY_FORMAT_ENABLED }
            : {};
        const DEFAULT_COPY_FORMAT_ENABLED = (safeDeps.DEFAULT_COPY_FORMAT_ENABLED && typeof safeDeps.DEFAULT_COPY_FORMAT_ENABLED === "object")
            ? { ...safeDeps.DEFAULT_COPY_FORMAT_ENABLED }
            : {};
        const DEFAULT_DISPLAY_TIME_PARTS_ENABLED = (safeDeps.DEFAULT_DISPLAY_TIME_PARTS_ENABLED && typeof safeDeps.DEFAULT_DISPLAY_TIME_PARTS_ENABLED === "object")
            ? { ...safeDeps.DEFAULT_DISPLAY_TIME_PARTS_ENABLED }
            : {};
        const DEFAULT_COPY_TIME_PARTS_ENABLED = (safeDeps.DEFAULT_COPY_TIME_PARTS_ENABLED && typeof safeDeps.DEFAULT_COPY_TIME_PARTS_ENABLED === "object")
            ? { ...safeDeps.DEFAULT_COPY_TIME_PARTS_ENABLED }
            : {};

        function getState() {
            if (typeof safeDeps.getState !== "function") return {};
            const state = safeDeps.getState();
            return (state && typeof state === "object") ? state : {};
        }

        function patchState(next = {}) {
            if (typeof safeDeps.setState !== "function") return;
            if (!next || typeof next !== "object") return;
            safeDeps.setState(next);
        }

        function sanitizeMainTab(tab) {
            if (typeof safeDeps.sanitizeMainTab === "function") return safeDeps.sanitizeMainTab(tab);
            return (typeof tab === "string" && tab.trim()) ? tab.trim() : "live";
        }

        function getDefaultFormatEnabled(mode = "display") {
            return mode === "copy" ? { ...DEFAULT_COPY_FORMAT_ENABLED } : { ...DEFAULT_DISPLAY_FORMAT_ENABLED };
        }

        function getDefaultTimePartsEnabled(mode = "display") {
            return mode === "copy" ? { ...DEFAULT_COPY_TIME_PARTS_ENABLED } : { ...DEFAULT_DISPLAY_TIME_PARTS_ENABLED };
        }

        function normalizeCopyFormatKey(rawKey) {
            let normalizedKey = rawKey === "period" ? "period_days" : rawKey;
            if (normalizedKey === "time_day" || normalizedKey === "date_day" || normalizedKey === "date") {
                normalizedKey = "time";
            }
            return normalizedKey;
        }

        function sanitizeCopyFormatOrder(order) {
            const safeOrder = [];
            if (Array.isArray(order)) {
                order.forEach((key) => {
                    const normalizedKey = normalizeCopyFormatKey(key);
                    if (COPY_FORMAT_KEYS.includes(normalizedKey) && !safeOrder.includes(normalizedKey)) safeOrder.push(normalizedKey);
                });
            }
            COPY_FORMAT_KEYS.forEach((key) => {
                if (!safeOrder.includes(key)) safeOrder.push(key);
            });
            return safeOrder;
        }

        function sanitizeCopyFormatEnabled(enabled, mode = "display") {
            const safe = getDefaultFormatEnabled(mode);
            COPY_FORMAT_KEYS.forEach((key) => {
                if (enabled && typeof enabled === "object") {
                    if (Object.prototype.hasOwnProperty.call(enabled, key)) {
                        safe[key] = !!enabled[key];
                        return;
                    }
                    if (key === "time") {
                        const hasLegacyTime = !!enabled.time_day || !!enabled.date_day || !!enabled.date;
                        if (hasLegacyTime) {
                            safe[key] = true;
                            return;
                        }
                    }
                    if (key === "period_days" && Object.prototype.hasOwnProperty.call(enabled, "period")) {
                        safe[key] = !!enabled.period;
                        return;
                    }
                }
            });
            return safe;
        }

        function sanitizeTimePartsEnabled(parts, mode = "display") {
            const safe = getDefaultTimePartsEnabled(mode);
            if (!parts || typeof parts !== "object") return safe;
            TIME_PART_KEYS.forEach((key) => {
                if (Object.prototype.hasOwnProperty.call(parts, key)) {
                    safe[key] = !!parts[key];
                }
            });
            return safe;
        }

        function deriveTimePartsFromLegacyEnabled(_legacyEnabled, mode = "display") {
            return sanitizeTimePartsEnabled(null, mode);
        }

        function sanitizeFormatProfileContext(context) {
            if (typeof context !== "string") return "live";
            const safeContext = context.trim();
            return FORMAT_PROFILE_CONTEXT_KEYS.includes(safeContext) ? safeContext : "live";
        }

        function getFormatProfileAllowedKeys(context = getState().activeFormatProfileContext) {
            const safeContext = sanitizeFormatProfileContext(context);
            if (safeContext === "multi" || safeContext === "fixed-extra") {
                return [...COPY_FORMAT_KEYS];
            }
            return COPY_FORMAT_KEYS.filter((key) => key !== "period_days" && key !== "period_time");
        }

        function getFormatProfileAllowedTimePartKeys(context = getState().activeFormatProfileContext) {
            const safeContext = sanitizeFormatProfileContext(context);
            if (safeContext === "fixed-time") {
                return TIME_PART_KEYS.filter((key) => key !== "date");
            }
            return [...TIME_PART_KEYS];
        }

        function sanitizeCopyFormatOrderForContext(order, context = getState().activeFormatProfileContext) {
            const allowedKeys = getFormatProfileAllowedKeys(context);
            const allowedSet = new Set(allowedKeys);
            const safeOrder = sanitizeCopyFormatOrder(order).filter((key) => allowedSet.has(key));
            allowedKeys.forEach((key) => {
                if (!safeOrder.includes(key)) safeOrder.push(key);
            });
            return safeOrder;
        }

        function getDefaultFormatEnabledForContext(mode = "display", context = getState().activeFormatProfileContext) {
            const allowedKeys = getFormatProfileAllowedKeys(context);
            const allowedSet = new Set(allowedKeys);
            const safe = getDefaultFormatEnabled(mode);
            COPY_FORMAT_KEYS.forEach((key) => {
                if (!allowedSet.has(key)) {
                    safe[key] = false;
                }
            });
            if (allowedSet.has("period_days")) safe.period_days = true;
            if (allowedSet.has("period_time")) safe.period_time = true;
            return safe;
        }

        function sanitizeCopyFormatEnabledForContext(enabled, mode = "display", context = getState().activeFormatProfileContext) {
            const safe = getDefaultFormatEnabledForContext(mode, context);
            if (!enabled || typeof enabled !== "object") return safe;
            const allowedKeys = getFormatProfileAllowedKeys(context);
            const normalized = sanitizeCopyFormatEnabled(enabled, mode);
            allowedKeys.forEach((key) => {
                safe[key] = !!normalized[key];
            });
            return safe;
        }

        function sanitizeTimePartsEnabledForContext(parts, mode = "display", context = getState().activeFormatProfileContext) {
            const safe = sanitizeTimePartsEnabled(parts, mode);
            const allowedKeys = new Set(getFormatProfileAllowedTimePartKeys(context));
            TIME_PART_KEYS.forEach((key) => {
                if (!allowedKeys.has(key)) {
                    safe[key] = false;
                }
            });
            return safe;
        }

        function createDefaultFormatProfile(context = "live") {
            const safeContext = sanitizeFormatProfileContext(context);
            return {
                displayFormatOrder: sanitizeCopyFormatOrderForContext(COPY_FORMAT_KEYS, safeContext),
                displayFormatEnabled: getDefaultFormatEnabledForContext("display", safeContext),
                displayTimePartsEnabled: sanitizeTimePartsEnabledForContext(null, "display", safeContext),
                copyFormatOrder: sanitizeCopyFormatOrderForContext(COPY_FORMAT_KEYS, safeContext),
                copyFormatEnabled: getDefaultFormatEnabledForContext("copy", safeContext),
                copyTimePartsEnabled: sanitizeTimePartsEnabledForContext(null, "copy", safeContext)
            };
        }

        function sanitizeFormatProfile(profile, context = getState().activeFormatProfileContext) {
            const safeContext = sanitizeFormatProfileContext(context);
            const source = (profile && typeof profile === "object") ? profile : {};
            return {
                displayFormatOrder: sanitizeCopyFormatOrderForContext(source.displayFormatOrder, safeContext),
                displayFormatEnabled: sanitizeCopyFormatEnabledForContext(source.displayFormatEnabled, "display", safeContext),
                displayTimePartsEnabled: sanitizeTimePartsEnabledForContext(source.displayTimePartsEnabled, "display", safeContext),
                copyFormatOrder: sanitizeCopyFormatOrderForContext(source.copyFormatOrder, safeContext),
                copyFormatEnabled: sanitizeCopyFormatEnabledForContext(source.copyFormatEnabled, "copy", safeContext),
                copyTimePartsEnabled: sanitizeTimePartsEnabledForContext(source.copyTimePartsEnabled, "copy", safeContext)
            };
        }

        function sanitizeFormatProfiles(rawProfiles = null, legacyProfile = null) {
            const safeProfiles = (rawProfiles && typeof rawProfiles === "object") ? rawProfiles : {};
            const safeLegacy = (legacyProfile && typeof legacyProfile === "object") ? legacyProfile : null;
            const nextProfiles = {};
            FORMAT_PROFILE_CONTEXT_KEYS.forEach((contextKey) => {
                const rawProfile = safeProfiles[contextKey];
                const sourceProfile = (rawProfile && typeof rawProfile === "object") ? rawProfile : safeLegacy;
                nextProfiles[contextKey] = sanitizeFormatProfile(sourceProfile, contextKey);
            });
            return nextProfiles;
        }

        function getCurrentFormatProfileState() {
            const state = getState();
            return {
                displayFormatOrder: state.displayFormatOrder,
                displayFormatEnabled: state.displayFormatEnabled,
                displayTimePartsEnabled: state.displayTimePartsEnabled,
                copyFormatOrder: state.copyFormatOrder,
                copyFormatEnabled: state.copyFormatEnabled,
                copyTimePartsEnabled: state.copyTimePartsEnabled
            };
        }

        function resolveFormatProfileContext(tab = getState().currentMainTab, effectiveSlotCount = getState().slotCount) {
            const safeTab = sanitizeMainTab(tab);
            if (safeTab === "multi") return "multi";
            if (safeTab === "fixed-time") return "fixed-time";
            if (safeTab === "fixed") return Number(effectiveSlotCount) > 1 ? "fixed-extra" : "fixed";
            if (safeTab === "live") return "live";
            return sanitizeFormatProfileContext(getState().activeFormatProfileContext);
        }

        function ensureFormatProfiles(legacyProfile = null) {
            const state = getState();
            const nextProfiles = sanitizeFormatProfiles(state.formatProfiles, legacyProfile);
            const patch = { formatProfiles: nextProfiles };
            if (!FORMAT_PROFILE_CONTEXT_KEYS.includes(state.activeFormatProfileContext)) {
                patch.activeFormatProfileContext = resolveFormatProfileContext(state.currentMainTab, state.slotCount);
            }
            patchState(patch);
        }

        function applyFormatProfileState(profile, context = getState().activeFormatProfileContext) {
            const safeProfile = sanitizeFormatProfile(profile, context);
            patchState({
                displayFormatOrder: [...safeProfile.displayFormatOrder],
                displayFormatEnabled: { ...safeProfile.displayFormatEnabled },
                displayTimePartsEnabled: { ...safeProfile.displayTimePartsEnabled },
                copyFormatOrder: [...safeProfile.copyFormatOrder],
                copyFormatEnabled: { ...safeProfile.copyFormatEnabled },
                copyTimePartsEnabled: { ...safeProfile.copyTimePartsEnabled }
            });
        }

        function syncActiveFormatProfileFromState() {
            ensureFormatProfiles(getCurrentFormatProfileState());
            const state = getState();
            const safeContext = sanitizeFormatProfileContext(state.activeFormatProfileContext);
            const nextProfiles = { ...(state.formatProfiles || {}) };
            nextProfiles[safeContext] = sanitizeFormatProfile(getCurrentFormatProfileState(), safeContext);
            patchState({ formatProfiles: nextProfiles });
            applyFormatProfileState(nextProfiles[safeContext], safeContext);
        }

        function activateFormatProfileContext(context, options = {}) {
            const { syncCurrent = true } = options;
            if (syncCurrent) syncActiveFormatProfileFromState();
            ensureFormatProfiles(getCurrentFormatProfileState());

            const nextContext = sanitizeFormatProfileContext(context);
            const current = getState();
            const nextProfiles = { ...(current.formatProfiles || {}) };
            const nextProfile = sanitizeFormatProfile(nextProfiles[nextContext], nextContext);
            nextProfiles[nextContext] = nextProfile;

            patchState({
                activeFormatProfileContext: nextContext,
                formatProfiles: nextProfiles
            });
            applyFormatProfileState(nextProfile, nextContext);
            return nextContext;
        }

        function activateFormatProfileForCurrentContext(options = {}) {
            const state = getState();
            const nextContext = resolveFormatProfileContext(state.currentMainTab, state.slotCount);
            return activateFormatProfileContext(nextContext, options);
        }

        function resetDisplayFormatForActiveContext() {
            const state = getState();
            const defaults = createDefaultFormatProfile(state.activeFormatProfileContext);
            patchState({
                displayFormatOrder: [...defaults.displayFormatOrder],
                displayFormatEnabled: { ...defaults.displayFormatEnabled },
                displayTimePartsEnabled: { ...defaults.displayTimePartsEnabled }
            });
            syncActiveFormatProfileFromState();
        }

        function resetCopyFormatForActiveContext() {
            const state = getState();
            const defaults = createDefaultFormatProfile(state.activeFormatProfileContext);
            patchState({
                copyFormatOrder: [...defaults.copyFormatOrder],
                copyFormatEnabled: { ...defaults.copyFormatEnabled },
                copyTimePartsEnabled: { ...defaults.copyTimePartsEnabled }
            });
            syncActiveFormatProfileFromState();
        }

        function initialize(legacyProfile = null) {
            ensureFormatProfiles(legacyProfile);
            activateFormatProfileForCurrentContext({ syncCurrent: false });
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
            resetCopyFormatForActiveContext,
            initialize
        });
    }

    globalObj.GTVFormatProfileState = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
