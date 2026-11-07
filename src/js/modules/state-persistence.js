(function initGtvStatePersistence(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        let lastPersistenceErrorToastAt = 0;
        let persistenceWriteQueue = Promise.resolve();
        let persistenceRevision = 0;
        const PERSISTENCE_ENVELOPE_VERSION = 1;
        const logger = Object.freeze({
            warn: (typeof safeDeps.logWarn === "function")
                ? safeDeps.logWarn
                : ((...args) => {
                    if (typeof globalObj?.console?.warn === "function") {
                        globalObj.console.warn(...args);
                        return;
                    }
                    if (typeof console === "object" && console && typeof console.warn === "function") {
                        console.warn(...args);
                    }
                }),
            error: (typeof safeDeps.logError === "function")
                ? safeDeps.logError
                : ((...args) => {
                    if (typeof globalObj?.console?.error === "function") {
                        globalObj.console.error(...args);
                        return;
                    }
                    if (typeof console === "object" && console && typeof console.error === "function") {
                        console.error(...args);
                    }
                })
        });
        const confirmFn = (typeof safeDeps.confirmFn === "function")
            ? safeDeps.confirmFn
            : ((message) => {
                if (typeof safeDeps.confirm === "function") return safeDeps.confirm(message);
                if (typeof globalObj?.confirm === "function") return globalObj.confirm(message);
                if (typeof confirm === "function") return confirm(message);
                return true;
            });
        const storageKey = (typeof safeDeps.STORAGE_KEY === "string" && safeDeps.STORAGE_KEY.trim())
            ? safeDeps.STORAGE_KEY.trim()
            : "GTV_STORAGE_KEY";
        const themeStorageKey = (typeof safeDeps.THEME_STORAGE_KEY === "string" && safeDeps.THEME_STORAGE_KEY.trim())
            ? safeDeps.THEME_STORAGE_KEY.trim()
            : "GTV_THEME";
        const langStorageKey = (typeof safeDeps.LANG_STORAGE_KEY === "string" && safeDeps.LANG_STORAGE_KEY.trim())
            ? safeDeps.LANG_STORAGE_KEY.trim()
            : "GTV_LANG";
        const uiScaleStorageKey = (typeof safeDeps.UI_SCALE_STORAGE_KEY === "string" && safeDeps.UI_SCALE_STORAGE_KEY.trim())
            ? safeDeps.UI_SCALE_STORAGE_KEY.trim()
            : "GTV_UI_SCALE";
        const copyFormatKeys = Array.isArray(safeDeps.COPY_FORMAT_KEYS)
            ? safeDeps.COPY_FORMAT_KEYS
                .map((key) => (typeof key === "string" ? key.trim() : ""))
                .filter(Boolean)
            : [];
        const legacyStorageKeys = Array.isArray(safeDeps.LEGACY_STORAGE_KEYS)
            ? safeDeps.LEGACY_STORAGE_KEYS
                .map((key) => (typeof key === "string" ? key.trim() : ""))
                .filter(Boolean)
            : [];
        const explicitLegacyFallbackReadKeys = Array.isArray(safeDeps.LEGACY_STORAGE_FALLBACK_KEYS)
            ? safeDeps.LEGACY_STORAGE_FALLBACK_KEYS
                .map((key) => (typeof key === "string" ? key.trim() : ""))
                .filter(Boolean)
            : [];
        const defaultTimeAdjustDayStep = Number.isFinite(Number(safeDeps.DEFAULT_TIME_ADJUST_DAY_STEP))
            ? Number(safeDeps.DEFAULT_TIME_ADJUST_DAY_STEP)
            : 1;
        const minMultiRangeCount = Number.isFinite(Number(safeDeps.MIN_MULTI_RANGE_COUNT))
            ? Math.max(1, Number.parseInt(safeDeps.MIN_MULTI_RANGE_COUNT, 10))
            : 1;
        const i18nData = (safeDeps.I18N_DATA && typeof safeDeps.I18N_DATA === "object")
            ? safeDeps.I18N_DATA
            : {};

        function toSafeCallable(depName, depFn) {
            if (typeof depFn !== "function") return () => undefined;
            return (...args) => {
                try {
                    return depFn(...args);
                } catch (err) {
                    logger.warn(`[GTVStatePersistence] Dependency "${depName}" threw.`, err);
                    return undefined;
                }
            };
        }

        function pickSafeCallables(keys) {
            return keys.reduce((acc, key) => {
                acc[key] = toSafeCallable(key, safeDeps[key]);
                return acc;
            }, {});
        }

        const dep = Object.freeze({
            ...pickSafeCallables([
                "t",
                "getState",
                "setState",
                "getDefaultFixedDate",
                "getDefaultFixedTimes",
                "loadThemePreference",
                "loadUiScalePreference",
                "getCurrentUiScalePercent",
                "showToast",
                "ensureGroupMultiSubgroups",
                "loadCurrentMultiStateFromActiveSubgroup",
                "applyTheme",
                "applyUiScale",
                "applyTranslations",
                "applyVersionBranding",
                "populateUiScaleSelect",
                "refreshMultiRangeControls",
                "updateTZDropdown",
                "refreshSelectWidths",
                "switchMainTab",
                "ensureBaseTimezoneSelection",
                "syncCurrentMultiStateToActiveSubgroup"
            ])
        });

        function ensureGroupMultiSubgroupsSafe(group) {
            return dep.ensureGroupMultiSubgroups(group);
        }

        function translate(key, fallbackText = "") {
            const translated = dep.t(key);
            if (typeof translated === "string" && translated.trim()) return translated;
            return String(fallbackText || key || "");
        }

        function getDocumentRef() {
            if (typeof safeDeps.getDocumentRef === "function") {
                const injected = safeDeps.getDocumentRef();
                if (injected && typeof injected.getElementById === "function") {
                    return injected;
                }
            }
            if (typeof safeDeps.getDocumentRefOrNull === "function") {
                const injected = safeDeps.getDocumentRefOrNull();
                if (injected && typeof injected.getElementById === "function") {
                    return injected;
                }
            }
            if (safeDeps.documentRef && typeof safeDeps.documentRef.getElementById === "function") {
                return safeDeps.documentRef;
            }
            if (safeDeps.document && typeof safeDeps.document.getElementById === "function") {
                return safeDeps.document;
            }
            if (globalObj?.document && typeof globalObj.document.getElementById === "function") {
                return globalObj.document;
            }
            return (typeof document === "object" && document) ? document : null;
        }

        function getLocalStorageRef() {
            if (
                safeDeps.localStorageRef
                && typeof safeDeps.localStorageRef.getItem === "function"
                && typeof safeDeps.localStorageRef.setItem === "function"
                && typeof safeDeps.localStorageRef.removeItem === "function"
            ) {
                return safeDeps.localStorageRef;
            }
            if (
                safeDeps.storageRef
                && typeof safeDeps.storageRef.getItem === "function"
                && typeof safeDeps.storageRef.setItem === "function"
                && typeof safeDeps.storageRef.removeItem === "function"
            ) {
                return safeDeps.storageRef;
            }
            if (
                safeDeps.localStorage
                && typeof safeDeps.localStorage.getItem === "function"
                && typeof safeDeps.localStorage.setItem === "function"
                && typeof safeDeps.localStorage.removeItem === "function"
            ) {
                return safeDeps.localStorage;
            }
            if (
                globalObj?.localStorage
                && typeof globalObj.localStorage.getItem === "function"
                && typeof globalObj.localStorage.setItem === "function"
                && typeof globalObj.localStorage.removeItem === "function"
            ) {
                return globalObj.localStorage;
            }
            if (
                typeof localStorage === "object"
                && localStorage
                && typeof localStorage.getItem === "function"
                && typeof localStorage.setItem === "function"
                && typeof localStorage.removeItem === "function"
            ) {
                return localStorage;
            }
            return null;
        }

        function isChromeStorageLocalRef(value) {
            return !!(
                value
                && typeof value === "object"
                && (
                    typeof value.get === "function"
                    || typeof value.set === "function"
                    || typeof value.remove === "function"
                )
            );
        }

        function getChromeStorageLocal() {
            if (isChromeStorageLocalRef(safeDeps.chromeStorageLocalRef)) {
                return safeDeps.chromeStorageLocalRef;
            }
            if (isChromeStorageLocalRef(safeDeps.chromeStorageRef?.local)) {
                return safeDeps.chromeStorageRef.local;
            }
            if (isChromeStorageLocalRef(safeDeps.chromeRef?.storage?.local)) {
                return safeDeps.chromeRef.storage.local;
            }
            if (isChromeStorageLocalRef(globalObj?.chrome?.storage?.local)) {
                return globalObj.chrome.storage.local;
            }
            if (isChromeStorageLocalRef(globalThis?.chrome?.storage?.local)) {
                return globalThis.chrome.storage.local;
            }
            return null;
        }

        function hasChromeStorage() {
            return !!getChromeStorageLocal();
        }

        const stateNormalizerModule = safeDeps.stateNormalizerModule || globalObj?.GTVPersistenceStateNormalizer;
        if (!stateNormalizerModule || typeof stateNormalizerModule.createService !== "function") {
            throw new Error("Missing required module API: GTVPersistenceStateNormalizer.createService");
        }
        const stateNormalizer = stateNormalizerModule.createService({
            ...safeDeps,
            t: translate,
            getDefaultFixedDate,
            getDefaultFixedTimes,
            ensureGroupMultiSubgroupsSafe
        });
        const {
            sanitizeCopyFormatEnabled, sanitizeTimePartsEnabled,
            sanitizeGroup, sanitizeFormatProfiles, getDefaultGroups,
            getDefaultDayStartHour, getDefaultNightStartHour, normalizeDayNightRange,
            normalizeParsedPersistenceState, normalizeImportedPayload
        } = stateNormalizer;

        function getStateSnapshot() {
            const state = dep.getState();
            return (state && typeof state === "object") ? state : {};
        }

        function setState(nextState) {
            if (!nextState || typeof nextState !== "object") return;
            dep.setState(nextState);
        }

        function getDefaultFixedDate() {
            const value = dep.getDefaultFixedDate();
            return (typeof value === "string") ? value : "";
        }

        function getDefaultFixedTimes() {
            const value = dep.getDefaultFixedTimes();
            return Array.isArray(value) ? value : [];
        }

        async function loadThemePreference() {
            const value = await dep.loadThemePreference();
            return (typeof value === "string" && value.trim()) ? value : "dark";
        }

        async function loadUiScalePreference() {
            const value = await dep.loadUiScalePreference();
            const parsed = Number.parseInt(value, 10);
            return Number.isFinite(parsed) ? parsed : 100;
        }

        function getCurrentUiScalePercent() {
            const value = dep.getCurrentUiScalePercent();
            const parsed = Number.parseInt(value, 10);
            return Number.isFinite(parsed) ? parsed : 100;
        }

        function getPersistenceSnapshot() {
            if (typeof safeDeps.getPersistenceSnapshot !== "function") return {};
            return safeDeps.getPersistenceSnapshot();
        }

        function isQuotaExceededError(err) {
            if (!err || typeof err !== "object") return false;
            const code = Number(err.code);
            const name = (typeof err.name === "string") ? err.name : "";
            return code === 22 || code === 1014 || name === "QuotaExceededError" || name === "NS_ERROR_DOM_QUOTA_REACHED";
        }

        function showPersistenceErrorToast(err) {
            const now = Date.now();
            if (now - lastPersistenceErrorToastAt < 2500) return;
            lastPersistenceErrorToastAt = now;
            dep.showToast(
                translate(isQuotaExceededError(err) ? "toast_storage_quota_exceeded" : "toast_storage_save_failed")
            );
        }

        function sanitizePersistenceRevision(value) {
            const parsed = Number.parseInt(value, 10);
            if (!Number.isFinite(parsed) || parsed < 0) return 0;
            return parsed;
        }

        function parsePersistenceUpdatedAtMs(value) {
            const asMs = Number(value);
            if (Number.isFinite(asMs) && asMs > 0) return asMs;
            const parsed = Date.parse(value || "");
            if (Number.isFinite(parsed) && parsed > 0) return parsed;
            return 0;
        }

        function createPersistenceEnvelope(snapshot, revision = 0) {
            return {
                __gtvStorageEnvelope: PERSISTENCE_ENVELOPE_VERSION,
                meta: {
                    revision: sanitizePersistenceRevision(revision),
                    updatedAt: new Date().toISOString()
                },
                data: snapshot
            };
        }

        function unwrapPersistenceEnvelope(parsed) {
            if (!parsed || typeof parsed !== "object") return null;

            if (
                parsed.__gtvStorageEnvelope === PERSISTENCE_ENVELOPE_VERSION
                && parsed.data
                && typeof parsed.data === "object"
            ) {
                return {
                    snapshot: parsed.data,
                    revision: sanitizePersistenceRevision(parsed?.meta?.revision),
                    updatedAtMs: parsePersistenceUpdatedAtMs(parsed?.meta?.updatedAt),
                    hasEnvelope: true
                };
            }

            return {
                snapshot: parsed,
                revision: 0,
                updatedAtMs: 0,
                hasEnvelope: false
            };
        }

        function parseSerializedPersistencePayload(serialized, source = "unknown") {
            if (typeof serialized !== "string" || !serialized.trim()) return null;
            try {
                const parsed = JSON.parse(serialized);
                const unwrapped = unwrapPersistenceEnvelope(parsed);
                if (!unwrapped || !unwrapped.snapshot || typeof unwrapped.snapshot !== "object") return null;
                return {
                    source,
                    serialized,
                    snapshot: unwrapped.snapshot,
                    revision: unwrapped.revision,
                    updatedAtMs: unwrapped.updatedAtMs,
                    hasEnvelope: unwrapped.hasEnvelope
                };
            } catch (_err) {
                return null;
            }
        }

        function choosePreferredPersistenceCandidate(primaryCandidate, secondaryCandidate) {
            if (primaryCandidate && secondaryCandidate) {
                if (primaryCandidate.revision !== secondaryCandidate.revision) {
                    return primaryCandidate.revision > secondaryCandidate.revision
                        ? primaryCandidate
                        : secondaryCandidate;
                }
                if (primaryCandidate.updatedAtMs !== secondaryCandidate.updatedAtMs) {
                    return primaryCandidate.updatedAtMs > secondaryCandidate.updatedAtMs
                        ? primaryCandidate
                        : secondaryCandidate;
                }
                if (primaryCandidate.hasEnvelope !== secondaryCandidate.hasEnvelope) {
                    return primaryCandidate.hasEnvelope ? primaryCandidate : secondaryCandidate;
                }
                return primaryCandidate;
            }
            return primaryCandidate || secondaryCandidate || null;
        }

        function safeLocalStorageGet(key, fallback = null) {
            const localStorageRef = getLocalStorageRef();
            if (!localStorageRef) return fallback;
            try {
                return localStorageRef.getItem(key) ?? fallback;
            } catch (err) {
                logger.warn(`localStorage.getItem("${key}") failed.`, err);
                return fallback;
            }
        }

        function safeLocalStorageSet(key, value) {
            const localStorageRef = getLocalStorageRef();
            if (!localStorageRef) return false;
            try {
                localStorageRef.setItem(key, value);
                return true;
            } catch (err) {
                logger.warn(`localStorage.setItem("${key}") failed.`, err);
                return false;
            }
        }

        function safeLocalStorageRemove(key) {
            const localStorageRef = getLocalStorageRef();
            if (!localStorageRef) return false;
            try {
                localStorageRef.removeItem(key);
                return true;
            } catch (err) {
                logger.warn(`localStorage.removeItem("${key}") failed.`, err);
                return false;
            }
        }

        async function setStorageValue(key, value, options = {}) {
            const { suppressToast = false } = options;
            let lastError = null;
            try {
                const storage = getChromeStorageLocal();
                if (storage && typeof storage.set === "function") {
                    try {
                        await storage.set({ [key]: value });
                        return { ok: true, error: null };
                    } catch (err) {
                        lastError = err;
                        logger.warn(`chrome.storage.set("${key}") failed. Falling back to localStorage.`, err);
                    }
                }
                const ok = safeLocalStorageSet(key, value);
                if (!ok) throw (lastError || new Error(`Failed to write localStorage key "${key}".`));
                return { ok: true, error: null };
            } catch (err) {
                const finalError = lastError || err;
                logger.error(`Failed to write storage key "${key}".`, finalError);
                if (!suppressToast) showPersistenceErrorToast(finalError);
                return { ok: false, error: finalError };
            }
        }

        async function getStorageValue(key, fallback = null) {
            try {
                const storage = getChromeStorageLocal();
                if (storage && typeof storage.get === "function") {
                    const data = await storage.get(key);
                    if (data && data[key] !== undefined) return data[key];
                }
                return safeLocalStorageGet(key, fallback);
            } catch (err) {
                logger.warn(`Failed to read storage key "${key}". Falling back to safeLocalStorageGet.`, err);
                return safeLocalStorageGet(key, fallback);
            }
        }

        async function persistStorageSnapshotNow(snapshot, options = {}) {
            let serialized = "";
            try {
                const nextRevision = persistenceRevision + 1;
                const envelopedSnapshot = createPersistenceEnvelope(snapshot, nextRevision);
                serialized = JSON.stringify(envelopedSnapshot);
            } catch (err) {
                logger.error("Failed to serialize persistence snapshot.", err);
                if (!options?.suppressToast) showPersistenceErrorToast(err);
                return { ok: false, error: err };
            }
            const result = await setStorageValue(storageKey, serialized, options);
            if (result?.ok) {
                persistenceRevision += 1;
            }
            return result;
        }

        function enqueuePersistenceWrite(taskFn) {
            const nextWrite = persistenceWriteQueue.then(taskFn, taskFn);
            // 쓰기 1건이 실패해도 큐가 끊기지 않도록 유지한다.
            persistenceWriteQueue = nextWrite.catch(() => false);
            return nextWrite;
        }

        function persistStorageSnapshot(snapshot, options = {}) {
            return enqueuePersistenceWrite(() => persistStorageSnapshotNow(snapshot, options));
        }

        async function savePersistence(options = {}) {
            return enqueuePersistenceWrite(async () => {
                try {
                    const snapshot = getPersistenceSnapshot();
                    const result = await persistStorageSnapshotNow(snapshot, options);
                    return !!result?.ok;
                } catch (err) {
                    logger.error("savePersistence failed during snapshot generation.", err);
                    if (!options?.suppressToast) showPersistenceErrorToast(err);
                    return false;
                }
            });
        }

        function applyDefaultPersistenceState({ includeMultiState = false } = {}) {
            const baseState = {
                groups: getDefaultGroups(),
                activeGroupId: 0,
                currentMainTab: "live",
                activeGroupIdByMainTab: { live: 0, fixed: 0 },
                activeFormatProfileContext: "live",
                slotCount: 1,
                showCopyFormat: false,
                showTimeline: false,
                timeAdjustDayStepBySlot: [defaultTimeAdjustDayStep, defaultTimeAdjustDayStep],
                displayFormatOrder: [...copyFormatKeys],
                displayFormatEnabled: sanitizeCopyFormatEnabled(null, "display"),
                displayTimePartsEnabled: sanitizeTimePartsEnabled(null, "display"),
                copyFormatOrder: [...copyFormatKeys],
                copyFormatEnabled: sanitizeCopyFormatEnabled(null, "copy"),
                copyTimePartsEnabled: sanitizeTimePartsEnabled(null, "copy"),
                dayStartHour: getDefaultDayStartHour(),
                nightStartHour: getDefaultNightStartHour(),
                isRealtime: true
            };
            const sanitizedProfiles = sanitizeFormatProfiles(null, null);
            if (sanitizedProfiles && typeof sanitizedProfiles === "object") {
                baseState.formatProfiles = sanitizedProfiles;
            }
            if (includeMultiState) {
                baseState.multiRangeCount = minMultiRangeCount;
                baseState.multiRangeTitle = translate("placeholder_range_title");
                baseState.multiRanges = [];
                baseState.multiRangeCollapsed = [];
                baseState.multiRangeStartEditEnabled = [];
                baseState.multiRangeEndEditEnabled = [];
            }
            setState(baseState);
            dep.loadCurrentMultiStateFromActiveSubgroup();
        }

        async function syncUiAfterSettingsReset() {
            const currentTheme = await loadThemePreference();
            const nextLangRaw = await getStorageValue(langStorageKey, "ko");
            const nextLang = (typeof nextLangRaw === "string") ? nextLangRaw : "ko";
            const currentLang = i18nData[nextLang] ? nextLang : "ko";

            setState({
                currentTheme,
                currentLang
            });
            dep.applyTheme(currentTheme, false);

            const uiScale = await loadUiScalePreference();
            dep.applyUiScale(uiScale, false);
            dep.applyTranslations();
            dep.applyVersionBranding();

            const documentRef = getDocumentRef();
            const langSelect = documentRef?.getElementById?.("lang-select");
            if (langSelect) langSelect.value = currentLang;
            const themeSelect = documentRef?.getElementById?.("theme-select");
            if (themeSelect) themeSelect.value = currentTheme;
            const uiScaleSelect = documentRef?.getElementById?.("ui-scale-select");
            if (uiScaleSelect) {
                dep.populateUiScaleSelect(uiScaleSelect);
                uiScaleSelect.value = String(getCurrentUiScalePercent());
            }
            const currentState = getStateSnapshot();
            const dayNightRange = normalizeDayNightRange(
                currentState.dayStartHour,
                currentState.nightStartHour
            );
            const dayStartSelect = documentRef?.getElementById?.("day-start-select");
            if (dayStartSelect) dayStartSelect.value = String(dayNightRange.dayStartHour);
            const nightStartSelect = documentRef?.getElementById?.("night-start-select");
            if (nightStartSelect) nightStartSelect.value = String(dayNightRange.nightStartHour);

            dep.refreshMultiRangeControls();
            dep.updateTZDropdown();
            dep.refreshSelectWidths();
            dep.switchMainTab("live");
            await savePersistence();
        }

        async function loadPersistence() {
            let serialized = null;
            let selectedCandidate = null;

            try {
                const storage = getChromeStorageLocal();
                if (storage && typeof storage.get === "function") {
                    const data = await storage.get(storageKey);
                    const chromeSerialized = data[storageKey];
                    const localSerialized = safeLocalStorageGet(storageKey);
                    const chromeCandidate = parseSerializedPersistencePayload(chromeSerialized, "chrome");
                    const localCandidate = parseSerializedPersistencePayload(localSerialized, "local");
                    selectedCandidate = choosePreferredPersistenceCandidate(chromeCandidate, localCandidate);
                    if (selectedCandidate?.serialized) {
                        serialized = selectedCandidate.serialized;
                    } else if (chromeSerialized) {
                        serialized = chromeSerialized;
                    } else if (localSerialized) {
                        serialized = localSerialized;
                    }
                }
            } catch (err) {
                logger.warn("Chrome storage error during loadPersistence. Falling back to localStorage.", err);
            }

            if (!serialized) {
                serialized = safeLocalStorageGet(storageKey);
                selectedCandidate = parseSerializedPersistencePayload(serialized, "local");
            }

            const legacyReadKeys = explicitLegacyFallbackReadKeys.length
                ? explicitLegacyFallbackReadKeys
                : legacyStorageKeys;
            const dedupedLegacyReadKeys = [...new Set(legacyReadKeys)];
            if (!serialized) {
                for (const key of dedupedLegacyReadKeys) {
                    const legacy = safeLocalStorageGet(key);
                    if (legacy) {
                        serialized = legacy;
                        break;
                    }
                }
            }

            if (!serialized) {
                applyDefaultPersistenceState();
                return;
            }

            try {
                let parsedPayload = null;
                if (selectedCandidate && selectedCandidate.serialized === serialized) {
                    parsedPayload = selectedCandidate.snapshot;
                } else {
                    const parsedCandidate = parseSerializedPersistencePayload(serialized, "unknown");
                    if (parsedCandidate) {
                        selectedCandidate = parsedCandidate;
                        parsedPayload = parsedCandidate.snapshot;
                    } else {
                        parsedPayload = JSON.parse(serialized);
                    }
                }
                const nextState = normalizeParsedPersistenceState(parsedPayload);
                setState(nextState);

                dep.loadCurrentMultiStateFromActiveSubgroup();
                dep.ensureBaseTimezoneSelection();

                persistenceRevision = Math.max(
                    persistenceRevision,
                    sanitizePersistenceRevision(selectedCandidate?.revision)
                );

                if (selectedCandidate?.source === "local" && hasChromeStorage()) {
                    void setStorageValue(storageKey, selectedCandidate.serialized, { suppressToast: true });
                }
            } catch (err) {
                logger.warn("Failed to parse persisted data. Falling back to defaults.", err);
                applyDefaultPersistenceState();
                await savePersistence();
            }
        }

        async function resetAllSettings() {
            if (!confirmFn(translate("confirm_reset_all_settings"))) return false;

            const keysToRemove = [
                storageKey,
                themeStorageKey,
                langStorageKey,
                uiScaleStorageKey,
                ...legacyStorageKeys
            ];

            try {
                const storage = getChromeStorageLocal();
                if (storage && typeof storage.remove === "function") {
                    await storage.remove(keysToRemove);
                }
            } catch (err) {
                logger.warn("Chrome storage remove error.", err);
            }
            keysToRemove.forEach((key) => safeLocalStorageRemove(key));
            applyDefaultPersistenceState({ includeMultiState: true });
            await syncUiAfterSettingsReset();
            return true;
        }

        async function resetExceptGroupsAndTimezones() {
            if (!confirmFn(translate("confirm_reset_except_group_tz"))) return false;

            dep.syncCurrentMultiStateToActiveSubgroup();
            const currentState = getStateSnapshot();
            const sourceGroups = Array.isArray(currentState.groups) ? currentState.groups : [];
            const preservedGroups = sourceGroups
                .map((group, idx) => {
                    try {
                        return sanitizeGroup({
                            name: group?.name,
                            zones: group?.zones,
                            baseTimezoneId: group?.baseTimezoneId,
                            showUtcRow: group?.showUtcRow,
                            utcRowOrder: group?.utcRowOrder,
                            fixedDate: group?.fixedDate,
                            fixedTimeShowLiveNow: group?.fixedTimeShowLiveNow,
                            fixedTimes: group?.fixedTimes
                        }, idx, null);
                    } catch (err) {
                        logger.warn("sanitizeGroup failed during resetExceptGroupsAndTimezones.", err);
                        return null;
                    }
                })
                .filter(Boolean);

            const groups = preservedGroups.length ? preservedGroups : getDefaultGroups();
            groups.forEach((group) => ensureGroupMultiSubgroupsSafe(group));

            setState({
                groups,
                activeGroupId: 0,
                currentMainTab: "live",
                activeGroupIdByMainTab: { live: 0, fixed: 0 },
                activeFormatProfileContext: "live",
                slotCount: 1,
                showCopyFormat: false,
                showTimeline: false,
                timeAdjustDayStepBySlot: [defaultTimeAdjustDayStep, defaultTimeAdjustDayStep],
                displayFormatOrder: [...copyFormatKeys],
                displayFormatEnabled: sanitizeCopyFormatEnabled(null, "display"),
                displayTimePartsEnabled: sanitizeTimePartsEnabled(null, "display"),
                copyFormatOrder: [...copyFormatKeys],
                copyFormatEnabled: sanitizeCopyFormatEnabled(null, "copy"),
                copyTimePartsEnabled: sanitizeTimePartsEnabled(null, "copy"),
                dayStartHour: getDefaultDayStartHour(),
                nightStartHour: getDefaultNightStartHour(),
                multiRangeCount: minMultiRangeCount,
                multiRangeTitle: translate("placeholder_range_title"),
                multiRanges: [],
                multiRangeCollapsed: [],
                multiRangeStartEditEnabled: [],
                multiRangeEndEditEnabled: [],
                isRealtime: true
            });
            const resetFormatProfiles = sanitizeFormatProfiles(null, null);
            if (resetFormatProfiles && typeof resetFormatProfiles === "object") {
                setState({
                    formatProfiles: resetFormatProfiles
                });
            }
            dep.loadCurrentMultiStateFromActiveSubgroup();

            const keysToRemove = [
                themeStorageKey,
                langStorageKey,
                uiScaleStorageKey,
                ...legacyStorageKeys
            ];

            try {
                const storage = getChromeStorageLocal();
                if (storage && typeof storage.remove === "function") {
                    await storage.remove(keysToRemove);
                    await storage.remove([storageKey]);
                }
            } catch (err) {
                logger.warn("Chrome storage remove error.", err);
            }
            keysToRemove.forEach((key) => safeLocalStorageRemove(key));
            safeLocalStorageRemove(storageKey);
            await syncUiAfterSettingsReset();
            return true;
        }

        return Object.freeze({
            isQuotaExceededError,
            setStorageValue,
            getStorageValue,
            persistStorageSnapshot,
            savePersistence,
            resetAllSettings,
            resetExceptGroupsAndTimezones,
            getDefaultGroups,
            normalizeImportedPayload,
            loadPersistence
        });
    }

    globalObj.GTVStatePersistence = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
