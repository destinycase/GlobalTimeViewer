(function initGtvStatePersistence(globalObj) {
    "use strict";

    const DEFAULT_TIME_PARTS_ENABLED = Object.freeze({
        dn: false,
        date: true,
        time: true,
        weekday: false
    });

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

        function toSafeCallable(depFn) {
            if (typeof depFn !== "function") return () => undefined;
            return (...args) => {
                try {
                    return depFn(...args);
                } catch (_err) {
                    return undefined;
                }
            };
        }

        const dep = Object.freeze({
            t: toSafeCallable(safeDeps.t),
            getState: toSafeCallable(safeDeps.getState),
            setState: toSafeCallable(safeDeps.setState),
            getDefaultFixedDate: toSafeCallable(safeDeps.getDefaultFixedDate),
            getDefaultFixedTimes: toSafeCallable(safeDeps.getDefaultFixedTimes),
            loadThemePreference: toSafeCallable(safeDeps.loadThemePreference),
            loadUiScalePreference: toSafeCallable(safeDeps.loadUiScalePreference),
            getCurrentUiScalePercent: toSafeCallable(safeDeps.getCurrentUiScalePercent),
            showToast: toSafeCallable(safeDeps.showToast),
            ensureGroupMultiSubgroups: toSafeCallable(safeDeps.ensureGroupMultiSubgroups),
            loadCurrentMultiStateFromActiveSubgroup: toSafeCallable(safeDeps.loadCurrentMultiStateFromActiveSubgroup),
            applyTheme: toSafeCallable(safeDeps.applyTheme),
            applyUiScale: toSafeCallable(safeDeps.applyUiScale),
            applyTranslations: toSafeCallable(safeDeps.applyTranslations),
            applyVersionBranding: toSafeCallable(safeDeps.applyVersionBranding),
            populateUiScaleSelect: toSafeCallable(safeDeps.populateUiScaleSelect),
            refreshMultiRangeControls: toSafeCallable(safeDeps.refreshMultiRangeControls),
            updateTZDropdown: toSafeCallable(safeDeps.updateTZDropdown),
            refreshSelectWidths: toSafeCallable(safeDeps.refreshSelectWidths),
            switchMainTab: toSafeCallable(safeDeps.switchMainTab),
            ensureBaseTimezoneSelection: toSafeCallable(safeDeps.ensureBaseTimezoneSelection),
            syncCurrentMultiStateToActiveSubgroup: toSafeCallable(safeDeps.syncCurrentMultiStateToActiveSubgroup)
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
            return !!(value && typeof value === "object");
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

        function getDefaultCopyFormatEnabled() {
            return copyFormatKeys.reduce((acc, key) => {
                acc[key] = true;
                return acc;
            }, {});
        }

        function getDefaultTimePartsEnabled() {
            return { ...DEFAULT_TIME_PARTS_ENABLED };
        }

        function sanitizeCopyFormatOrder(value) {
            if (typeof safeDeps.sanitizeCopyFormatOrder === "function") {
                const sanitized = safeDeps.sanitizeCopyFormatOrder(value);
                if (Array.isArray(sanitized)) return sanitized;
            }
            if (Array.isArray(value)) {
                return value
                    .map((key) => (typeof key === "string" ? key.trim() : ""))
                    .filter(Boolean);
            }
            return [...copyFormatKeys];
        }

        function sanitizeCopyFormatEnabled(value, mode = "display") {
            if (typeof safeDeps.sanitizeCopyFormatEnabled === "function") {
                const sanitized = safeDeps.sanitizeCopyFormatEnabled(value, mode);
                if (sanitized && typeof sanitized === "object") return sanitized;
            }
            if (value && typeof value === "object") {
                return {
                    ...getDefaultCopyFormatEnabled(),
                    ...value
                };
            }
            return getDefaultCopyFormatEnabled();
        }

        function sanitizeTimePartsEnabled(value, mode = "display") {
            if (typeof safeDeps.sanitizeTimePartsEnabled === "function") {
                const sanitized = safeDeps.sanitizeTimePartsEnabled(value, mode);
                if (sanitized && typeof sanitized === "object") return sanitized;
            }
            if (value && typeof value === "object") {
                return {
                    ...getDefaultTimePartsEnabled(),
                    ...value
                };
            }
            return getDefaultTimePartsEnabled();
        }

        function deriveTimePartsFromLegacyEnabled(value, mode = "display") {
            if (typeof safeDeps.deriveTimePartsFromLegacyEnabled === "function") {
                const derived = safeDeps.deriveTimePartsFromLegacyEnabled(value, mode);
                if (derived && typeof derived === "object") return derived;
            }
            return getDefaultTimePartsEnabled();
        }

        function sanitizeMultiStatePayload(rawState = null, fallbackState = null) {
            if (typeof safeDeps.sanitizeMultiStatePayload === "function") {
                const sanitized = safeDeps.sanitizeMultiStatePayload(rawState, fallbackState);
                if (sanitized && typeof sanitized === "object") return sanitized;
            }
            return {
                multiRangeCount: minMultiRangeCount,
                multiRangeTitle: "",
                multiRanges: [],
                multiRangeCollapsed: [],
                multiRangeStartEditEnabled: [],
                multiRangeEndEditEnabled: []
            };
        }

        function sanitizeMultiRangeTitle(value) {
            if (typeof safeDeps.sanitizeMultiRangeTitle === "function") {
                const sanitized = safeDeps.sanitizeMultiRangeTitle(value);
                if (typeof sanitized === "string") return sanitized;
            }
            return (typeof value === "string") ? value : "";
        }

        function sanitizeGroup(group, idx, legacyMultiState = null) {
            if (typeof safeDeps.sanitizeGroup === "function") {
                return safeDeps.sanitizeGroup(group, idx, legacyMultiState);
            }
            if (!group || typeof group !== "object") return null;
            return {
                name: (typeof group.name === "string" && group.name.trim()) ? group.name : `Group ${idx + 1}`,
                zones: Array.isArray(group.zones) ? group.zones : [],
                baseTimezoneId: sanitizeBaseTimezoneId(group.baseTimezoneId),
                showUtcRow: group.showUtcRow !== false,
                utcRowOrder: Number.isFinite(Number(group.utcRowOrder)) ? Number.parseInt(group.utcRowOrder, 10) : 0,
                fixedDate: (typeof group.fixedDate === "string") ? group.fixedDate : "",
                fixedTimeShowLiveNow: !!group.fixedTimeShowLiveNow,
                fixedTimes: Array.isArray(group.fixedTimes) ? group.fixedTimes : []
            };
        }

        function sanitizeBaseTimezoneId(value) {
            if (typeof safeDeps.sanitizeBaseTimezoneId === "function") {
                const sanitized = safeDeps.sanitizeBaseTimezoneId(value);
                if (typeof sanitized === "string" && sanitized.trim()) return sanitized;
            }
            return (typeof value === "string" && value.trim()) ? value.trim() : "utc";
        }

        function isSupportedMainTab(tab) {
            return tab === "live"
                || tab === "fixed"
                || tab === "multi"
                || tab === "fixed-time"
                || tab === "calc";
        }

        function sanitizeMainTab(value) {
            if (typeof safeDeps.sanitizeMainTab === "function") {
                const sanitized = safeDeps.sanitizeMainTab(value);
                if (isSupportedMainTab(sanitized)) return sanitized;
            }
            return isSupportedMainTab(value) ? value : "live";
        }

        function sanitizeTimeAdjustDayStep(value) {
            if (typeof safeDeps.sanitizeTimeAdjustDayStep === "function") {
                const sanitized = safeDeps.sanitizeTimeAdjustDayStep(value);
                if (Number.isFinite(Number(sanitized))) return Number(sanitized);
            }
            return Number.isFinite(Number(value)) ? Number(value) : defaultTimeAdjustDayStep;
        }

        function sanitizeFormatProfiles(formatProfiles, legacyState) {
            if (typeof safeDeps.sanitizeFormatProfiles !== "function") return null;
            const sanitized = safeDeps.sanitizeFormatProfiles(formatProfiles, legacyState);
            return (sanitized && typeof sanitized === "object") ? sanitized : null;
        }

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

        function getDefaultGroups() {
            const defaultGroup = {
                name: translate("default_group_name"),
                zones: [],
                baseTimezoneId: "utc",
                showUtcRow: true,
                utcRowOrder: 0,
                fixedDate: getDefaultFixedDate(),
                fixedTimeShowLiveNow: false,
                fixedTimes: getDefaultFixedTimes()
            };
            ensureGroupMultiSubgroupsSafe(defaultGroup);
            return [defaultGroup];
        }

        function clampGroupIndex(index, groupsLength) {
            const maxIndex = Math.max(0, groupsLength - 1);
            const parsed = parseInt(index, 10);
            if (!Number.isFinite(parsed)) return 0;
            return Math.min(Math.max(parsed, 0), maxIndex);
        }

        function getDefaultDayStartHour() {
            const parsed = Number.parseInt(safeDeps.DEFAULT_DAY_START_HOUR, 10);
            if (!Number.isFinite(parsed)) return 6;
            return Math.min(23, Math.max(0, parsed));
        }

        function getDefaultNightStartHour() {
            const parsed = Number.parseInt(safeDeps.DEFAULT_NIGHT_START_HOUR, 10);
            if (!Number.isFinite(parsed)) return 18;
            return Math.min(23, Math.max(0, parsed));
        }

        function sanitizeDayNightHour(value, fallbackHour) {
            const parsed = Number.parseInt(value, 10);
            const fallback = Number.parseInt(fallbackHour, 10);
            const base = Number.isFinite(parsed)
                ? parsed
                : (Number.isFinite(fallback) ? fallback : 0);
            return Math.min(23, Math.max(0, base));
        }

        function normalizeDayNightRange(dayStartHourInput, nightStartHourInput) {
            const defaultDayStartHour = getDefaultDayStartHour();
            const defaultNightStartHour = getDefaultNightStartHour();
            const dayStartHour = sanitizeDayNightHour(dayStartHourInput, defaultDayStartHour);
            const nightStartHour = sanitizeDayNightHour(nightStartHourInput, defaultNightStartHour);
            if (nightStartHour <= dayStartHour) {
                return {
                    dayStartHour: defaultDayStartHour,
                    nightStartHour: defaultNightStartHour
                };
            }
            return { dayStartHour, nightStartHour };
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

        function normalizeParsedPersistenceState(parsed) {
            const legacyGlobalMultiState = sanitizeMultiStatePayload({
                multiRangeCount: parsed?.multiRangeCount,
                multiRanges: parsed?.multiRanges,
                multiRangeCollapsed: parsed?.multiRangeCollapsed,
                multiRangeStartEditEnabled: parsed?.multiRangeStartEditEnabled,
                multiRangeEndEditEnabled: parsed?.multiRangeEndEditEnabled
            }, null);
            legacyGlobalMultiState.multiRangeTitle = sanitizeMultiRangeTitle(parsed?.multiRangeTitle);

            const parsedGroups = Array.isArray(parsed?.groups)
                ? parsed.groups.map((group, idx) => sanitizeGroup(group, idx, legacyGlobalMultiState)).filter(Boolean)
                : [];
            const groups = parsedGroups.length ? parsedGroups : getDefaultGroups();
            const rawGroups = Array.isArray(parsed?.groups) ? parsed.groups : [];
            const legacyGlobalBaseTimezoneId = sanitizeBaseTimezoneId(parsed?.baseTimezoneId);
            groups.forEach((group, idx) => {
                const rawGroup = rawGroups[idx];
                const hasGroupSpecificBase = typeof rawGroup?.baseTimezoneId === "string" && rawGroup.baseTimezoneId.trim();
                if (hasGroupSpecificBase || legacyGlobalBaseTimezoneId === "utc") return;
                group.baseTimezoneId = group.zones.some((zone) => zone.id === legacyGlobalBaseTimezoneId) ? legacyGlobalBaseTimezoneId : "utc";
            });

            let activeGroupId = clampGroupIndex(parsed?.activeGroupId, groups.length);
            const currentMainTab = sanitizeMainTab(parsed?.currentMainTab);

            const rawGroupMap = (parsed?.activeGroupIdByMainTab && typeof parsed.activeGroupIdByMainTab === "object")
                ? parsed.activeGroupIdByMainTab
                : null;
            const fallbackGroupId = activeGroupId;
            const mapLive = parseInt(rawGroupMap?.live, 10);
            const mapFixed = parseInt(rawGroupMap?.fixed, 10);
            const activeGroupIdByMainTab = {
                live: clampGroupIndex(Number.isFinite(mapLive) ? mapLive : fallbackGroupId, groups.length),
                fixed: clampGroupIndex(Number.isFinite(mapFixed) ? mapFixed : fallbackGroupId, groups.length)
            };

            const parsedSlotCount = parseInt(parsed?.slotCount, 10);
            const slotCount = Math.min(2, Math.max(1, Number.isFinite(parsedSlotCount) ? parsedSlotCount : 1));

            const showCopyFormat = !!parsed?.showCopyFormat;
            const showTimeline = !!parsed?.showTimeline;
            const dayNightRange = normalizeDayNightRange(parsed?.dayStartHour, parsed?.nightStartHour);
            const rawTimeAdjustStep = Array.isArray(parsed?.timeAdjustDayStepBySlot) ? parsed.timeAdjustDayStepBySlot : [];
            const timeAdjustDayStepBySlot = [
                sanitizeTimeAdjustDayStep(rawTimeAdjustStep[0]),
                sanitizeTimeAdjustDayStep(rawTimeAdjustStep[1])
            ];
            const hasDisplayOrder = Array.isArray(parsed?.displayFormatOrder);
            const hasDisplayEnabled = !!(parsed?.displayFormatEnabled && typeof parsed.displayFormatEnabled === "object");
            const rawDisplayEnabled = hasDisplayEnabled ? parsed.displayFormatEnabled : parsed?.copyFormatEnabled;
            const fallbackCopyOrder = sanitizeCopyFormatOrder(parsed?.copyFormatOrder);
            const fallbackCopyEnabled = sanitizeCopyFormatEnabled(parsed?.copyFormatEnabled, "copy");

            const displayFormatOrder = sanitizeCopyFormatOrder(hasDisplayOrder ? parsed.displayFormatOrder : parsed?.copyFormatOrder);
            const displayFormatEnabled = sanitizeCopyFormatEnabled(rawDisplayEnabled, "display");
            let displayTimePartsEnabled = sanitizeTimePartsEnabled(parsed?.displayTimePartsEnabled, "display");
            if (!parsed?.displayTimePartsEnabled) {
                displayTimePartsEnabled = deriveTimePartsFromLegacyEnabled(rawDisplayEnabled, "display");
            }
            const copyFormatOrder = fallbackCopyOrder;
            const copyFormatEnabled = fallbackCopyEnabled;
            let copyTimePartsEnabled = sanitizeTimePartsEnabled(parsed?.copyTimePartsEnabled, "copy");
            if (!parsed?.copyTimePartsEnabled) {
                copyTimePartsEnabled = deriveTimePartsFromLegacyEnabled(parsed?.copyFormatEnabled, "copy");
            }
            const legacyFormatProfileState = {
                displayFormatOrder,
                displayFormatEnabled,
                displayTimePartsEnabled,
                copyFormatOrder,
                copyFormatEnabled,
                copyTimePartsEnabled
            };
            const formatProfiles = sanitizeFormatProfiles(parsed?.formatProfiles, legacyFormatProfileState);
            const activeFormatProfileContext = (typeof parsed?.activeFormatProfileContext === "string")
                ? parsed.activeFormatProfileContext
                : null;

            if (currentMainTab === "live" || currentMainTab === "fixed") {
                activeGroupId = activeGroupIdByMainTab[currentMainTab];
            }

            const nextState = {
                groups,
                activeGroupId,
                currentMainTab,
                activeGroupIdByMainTab,
                slotCount,
                showCopyFormat,
                showTimeline,
                timeAdjustDayStepBySlot,
                displayFormatOrder,
                displayFormatEnabled,
                displayTimePartsEnabled,
                copyFormatOrder,
                copyFormatEnabled,
                copyTimePartsEnabled,
                multiRangeCount: minMultiRangeCount,
                multiRangeTitle: translate("placeholder_range_title"),
                multiRanges: [],
                multiRangeCollapsed: [],
                multiRangeStartEditEnabled: [],
                multiRangeEndEditEnabled: [],
                dayStartHour: dayNightRange.dayStartHour,
                nightStartHour: dayNightRange.nightStartHour,
                isRealtime: (currentMainTab === "live")
            };
            if (formatProfiles && typeof formatProfiles === "object") {
                nextState.formatProfiles = formatProfiles;
            }
            if (activeFormatProfileContext) {
                nextState.activeFormatProfileContext = activeFormatProfileContext;
            }
            return nextState;
        }

        function normalizeImportedPayload(payload = null) {
            const parsed = (payload && typeof payload === "object") ? payload : {};
            const normalizedState = normalizeParsedPersistenceState(parsed);
            const groups = Array.isArray(normalizedState.groups) && normalizedState.groups.length
                ? normalizedState.groups
                : getDefaultGroups();
            const activeGroupId = clampGroupIndex(normalizedState.activeGroupId, groups.length);
            const activeGroup = groups[activeGroupId] || groups[0] || null;
            const baseTimezoneId = sanitizeBaseTimezoneId(activeGroup?.baseTimezoneId);

            const snapshot = {
                groups,
                activeGroupId,
                currentMainTab: normalizedState.currentMainTab,
                activeGroupIdByMainTab: normalizedState.activeGroupIdByMainTab,
                slotCount: normalizedState.slotCount,
                baseTimezoneId,
                showCopyFormat: normalizedState.showCopyFormat,
                showTimeline: normalizedState.showTimeline,
                displayFormatOrder: normalizedState.displayFormatOrder,
                displayFormatEnabled: normalizedState.displayFormatEnabled,
                displayTimePartsEnabled: normalizedState.displayTimePartsEnabled,
                copyFormatOrder: normalizedState.copyFormatOrder,
                copyFormatEnabled: normalizedState.copyFormatEnabled,
                copyTimePartsEnabled: normalizedState.copyTimePartsEnabled,
                timeAdjustDayStepBySlot: normalizedState.timeAdjustDayStepBySlot,
                dayStartHour: normalizedState.dayStartHour,
                nightStartHour: normalizedState.nightStartHour,
                multiRangeCount: minMultiRangeCount,
                multiRangeTitle: translate("placeholder_range_title"),
                multiRanges: [],
                multiRangeCollapsed: [],
                multiRangeStartEditEnabled: [],
                multiRangeEndEditEnabled: []
            };
            if (normalizedState.formatProfiles && typeof normalizedState.formatProfiles === "object") {
                snapshot.formatProfiles = normalizedState.formatProfiles;
            }
            if (normalizedState.activeFormatProfileContext) {
                snapshot.activeFormatProfileContext = normalizedState.activeFormatProfileContext;
            }
            return snapshot;
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
