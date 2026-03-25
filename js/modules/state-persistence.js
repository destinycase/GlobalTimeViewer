(function initGtvStatePersistence(globalObj) {
    "use strict";

    function createService(deps) {
        let lastPersistenceErrorToastAt = 0;
        let persistenceWriteQueue = Promise.resolve();
        let persistenceRevision = 0;
        const PERSISTENCE_ENVELOPE_VERSION = 1;
        const confirmFn = (typeof deps.confirmFn === "function")
            ? deps.confirmFn
            : ((message) => {
                if (typeof confirm === "function") return confirm(message);
                return true;
            });

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
            deps.showToast(deps.t(isQuotaExceededError(err) ? "toast_storage_quota_exceeded" : "toast_storage_save_failed"));
        }

        function hasChromeStorage() {
            try {
                if (typeof chrome === "undefined" || !chrome) return false;
                if (typeof chrome.storage === "undefined" || !chrome.storage) return false;
                return !!chrome.storage.local;
            } catch (e) {
                return false;
            }
        }

        function getStorageLocal() {
            try {
                return hasChromeStorage() ? chrome.storage.local : null;
            } catch (e) {
                return null;
            }
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
            try {
                return localStorage.getItem(key) ?? fallback;
            } catch (e) {
                console.warn(`localStorage.getItem("${key}") failed.`, e);
                return fallback;
            }
        }

        function safeLocalStorageSet(key, value) {
            try {
                localStorage.setItem(key, value);
                return true;
            } catch (e) {
                console.warn(`localStorage.setItem("${key}") failed.`, e);
                return false;
            }
        }

        function safeLocalStorageRemove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.warn(`localStorage.removeItem("${key}") failed.`, e);
                return false;
            }
        }

        async function setStorageValue(key, value, options = {}) {
            const { suppressToast = false } = options;
            let lastError = null;
            try {
                const storage = getStorageLocal();
                if (storage) {
                    try {
                        await storage.set({ [key]: value });
                        return { ok: true, error: null };
                    } catch (err) {
                        lastError = err;
                        console.warn(`chrome.storage.set("${key}") failed. Falling back to localStorage.`, err);
                    }
                }
                const ok = safeLocalStorageSet(key, value);
                if (!ok) throw (lastError || new Error(`Failed to write localStorage key "${key}".`));
                return { ok: true, error: null };
            } catch (err) {
                const finalError = lastError || err;
                console.error(`Failed to write storage key "${key}".`, finalError);
                if (!suppressToast) showPersistenceErrorToast(finalError);
                return { ok: false, error: finalError };
            }
        }

        async function getStorageValue(key, fallback = null) {
            try {
                const storage = getStorageLocal();
                if (storage) {
                    const data = await storage.get(key);
                    if (data && data[key] !== undefined) return data[key];
                }
                return safeLocalStorageGet(key, fallback);
            } catch (err) {
                console.warn(`Failed to read storage key "${key}". Falling back to safeLocalStorageGet.`, err);
                return safeLocalStorageGet(key, fallback);
            }
        }

        function persistStorageSnapshot(snapshot, options = {}) {
            let serialized = "";
            try {
                const nextRevision = persistenceRevision + 1;
                const envelopedSnapshot = createPersistenceEnvelope(snapshot, nextRevision);
                serialized = JSON.stringify(envelopedSnapshot);
            } catch (err) {
                console.error("Failed to serialize persistence snapshot.", err);
                if (!options?.suppressToast) showPersistenceErrorToast(err);
                return { ok: false, error: err };
            }
            return setStorageValue(deps.STORAGE_KEY, serialized, options).then((result) => {
                if (result?.ok) {
                    persistenceRevision += 1;
                }
                return result;
            });
        }

        function enqueuePersistenceWrite(taskFn) {
            const nextWrite = persistenceWriteQueue.then(taskFn, taskFn);
            // 쓰기 1건이 실패해도 큐가 끊기지 않도록 유지한다.
            persistenceWriteQueue = nextWrite.catch(() => false);
            return nextWrite;
        }

        async function savePersistence(options = {}) {
            return enqueuePersistenceWrite(async () => {
                try {
                    const snapshot = deps.getPersistenceSnapshot();
                    const result = await persistStorageSnapshot(snapshot, options);
                    return !!result?.ok;
                } catch (err) {
                    console.error("savePersistence failed during snapshot generation.", err);
                    if (!options?.suppressToast) showPersistenceErrorToast(err);
                    return false;
                }
            });
        }

        function getDefaultGroups() {
            const defaultGroup = {
                name: deps.t("default_group_name"),
                zones: [],
                baseTimezoneId: "utc",
                showUtcRow: true,
                utcRowOrder: 0,
                fixedDate: (typeof deps.getDefaultFixedDate === "function")
                    ? deps.getDefaultFixedDate()
                    : "",
                fixedTimes: (typeof deps.getDefaultFixedTimes === "function")
                    ? deps.getDefaultFixedTimes()
                    : []
            };
            deps.ensureGroupMultiSubgroups(defaultGroup);
            return [defaultGroup];
        }

        function clampGroupIndex(index, groupsLength) {
            const maxIndex = Math.max(0, groupsLength - 1);
            const parsed = parseInt(index, 10);
            if (!Number.isFinite(parsed)) return 0;
            return Math.min(Math.max(parsed, 0), maxIndex);
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
                timeAdjustDayStepBySlot: [deps.DEFAULT_TIME_ADJUST_DAY_STEP, deps.DEFAULT_TIME_ADJUST_DAY_STEP],
                displayFormatOrder: [...deps.COPY_FORMAT_KEYS],
                displayFormatEnabled: deps.sanitizeCopyFormatEnabled(null, "display"),
                displayTimePartsEnabled: deps.sanitizeTimePartsEnabled(null, "display"),
                copyFormatOrder: [...deps.COPY_FORMAT_KEYS],
                copyFormatEnabled: deps.sanitizeCopyFormatEnabled(null, "copy"),
                copyTimePartsEnabled: deps.sanitizeTimePartsEnabled(null, "copy"),
                isRealtime: true
            };
            if (typeof deps.sanitizeFormatProfiles === "function") {
                baseState.formatProfiles = deps.sanitizeFormatProfiles(null, null);
            }
            if (includeMultiState) {
                baseState.multiRangeCount = deps.MIN_MULTI_RANGE_COUNT;
                baseState.multiRangeTitle = deps.t("placeholder_range_title");
                baseState.multiRanges = [];
                baseState.multiRangeCollapsed = [];
                baseState.multiRangeStartEditEnabled = [];
                baseState.multiRangeEndEditEnabled = [];
            }
            deps.setState(baseState);
            deps.loadCurrentMultiStateFromActiveSubgroup();
        }

        async function syncUiAfterSettingsReset() {
            const currentTheme = await deps.loadThemePreference();
            const nextLangRaw = await getStorageValue(deps.LANG_STORAGE_KEY, "ko");
            const nextLang = (typeof nextLangRaw === "string") ? nextLangRaw : "ko";
            const currentLang = deps.I18N_DATA[nextLang] ? nextLang : "ko";

            deps.setState({
                currentTheme,
                currentLang
            });
            deps.applyTheme(currentTheme, false);

            const uiScale = await deps.loadUiScalePreference();
            deps.applyUiScale(uiScale, false);
            deps.applyTranslations();
            deps.applyVersionBranding();

            const langSelect = document.getElementById("lang-select");
            if (langSelect) langSelect.value = currentLang;
            const themeSelect = document.getElementById("theme-select");
            if (themeSelect) themeSelect.value = currentTheme;
            const uiScaleSelect = document.getElementById("ui-scale-select");
            if (uiScaleSelect) {
                deps.populateUiScaleSelect(uiScaleSelect);
                uiScaleSelect.value = String(deps.getCurrentUiScalePercent());
            }

            deps.refreshMultiRangeControls();
            deps.updateTZDropdown();
            deps.refreshSelectWidths();
            deps.switchMainTab("live");
            await savePersistence();
        }

        function normalizeParsedPersistenceState(parsed) {
            const legacyGlobalMultiState = deps.sanitizeMultiStatePayload({
                multiRangeCount: parsed?.multiRangeCount,
                multiRanges: parsed?.multiRanges,
                multiRangeCollapsed: parsed?.multiRangeCollapsed,
                multiRangeStartEditEnabled: parsed?.multiRangeStartEditEnabled,
                multiRangeEndEditEnabled: parsed?.multiRangeEndEditEnabled
            }, null);
            legacyGlobalMultiState.multiRangeTitle = deps.sanitizeMultiRangeTitle(parsed?.multiRangeTitle);

            const parsedGroups = Array.isArray(parsed?.groups)
                ? parsed.groups.map((group, idx) => deps.sanitizeGroup(group, idx, legacyGlobalMultiState)).filter(Boolean)
                : [];
            const groups = parsedGroups.length ? parsedGroups : getDefaultGroups();
            const rawGroups = Array.isArray(parsed?.groups) ? parsed.groups : [];
            const legacyGlobalBaseTimezoneId = deps.sanitizeBaseTimezoneId(parsed?.baseTimezoneId);
            groups.forEach((group, idx) => {
                const rawGroup = rawGroups[idx];
                const hasGroupSpecificBase = typeof rawGroup?.baseTimezoneId === "string" && rawGroup.baseTimezoneId.trim();
                if (hasGroupSpecificBase || legacyGlobalBaseTimezoneId === "utc") return;
                group.baseTimezoneId = group.zones.some((zone) => zone.id === legacyGlobalBaseTimezoneId) ? legacyGlobalBaseTimezoneId : "utc";
            });

            let activeGroupId = clampGroupIndex(parsed?.activeGroupId, groups.length);
            const currentMainTab = deps.sanitizeMainTab(parsed?.currentMainTab);

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
            const rawTimeAdjustStep = Array.isArray(parsed?.timeAdjustDayStepBySlot) ? parsed.timeAdjustDayStepBySlot : [];
            const timeAdjustDayStepBySlot = [
                deps.sanitizeTimeAdjustDayStep(rawTimeAdjustStep[0]),
                deps.sanitizeTimeAdjustDayStep(rawTimeAdjustStep[1])
            ];
            const hasDisplayOrder = Array.isArray(parsed?.displayFormatOrder);
            const hasDisplayEnabled = !!(parsed?.displayFormatEnabled && typeof parsed.displayFormatEnabled === "object");
            const rawDisplayEnabled = hasDisplayEnabled ? parsed.displayFormatEnabled : parsed?.copyFormatEnabled;
            const fallbackCopyOrder = deps.sanitizeCopyFormatOrder(parsed?.copyFormatOrder);
            const fallbackCopyEnabled = deps.sanitizeCopyFormatEnabled(parsed?.copyFormatEnabled, "copy");

            const displayFormatOrder = deps.sanitizeCopyFormatOrder(hasDisplayOrder ? parsed.displayFormatOrder : parsed?.copyFormatOrder);
            const displayFormatEnabled = deps.sanitizeCopyFormatEnabled(rawDisplayEnabled, "display");
            let displayTimePartsEnabled = deps.sanitizeTimePartsEnabled(parsed?.displayTimePartsEnabled, "display");
            if (!parsed?.displayTimePartsEnabled) {
                displayTimePartsEnabled = deps.deriveTimePartsFromLegacyEnabled(rawDisplayEnabled, "display");
            }
            const copyFormatOrder = fallbackCopyOrder;
            const copyFormatEnabled = fallbackCopyEnabled;
            let copyTimePartsEnabled = deps.sanitizeTimePartsEnabled(parsed?.copyTimePartsEnabled, "copy");
            if (!parsed?.copyTimePartsEnabled) {
                copyTimePartsEnabled = deps.deriveTimePartsFromLegacyEnabled(parsed?.copyFormatEnabled, "copy");
            }
            const legacyFormatProfileState = {
                displayFormatOrder,
                displayFormatEnabled,
                displayTimePartsEnabled,
                copyFormatOrder,
                copyFormatEnabled,
                copyTimePartsEnabled
            };
            const formatProfiles = (typeof deps.sanitizeFormatProfiles === "function")
                ? deps.sanitizeFormatProfiles(parsed?.formatProfiles, legacyFormatProfileState)
                : null;
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
                multiRangeCount: deps.MIN_MULTI_RANGE_COUNT,
                multiRangeTitle: deps.t("placeholder_range_title"),
                multiRanges: [],
                multiRangeCollapsed: [],
                multiRangeStartEditEnabled: [],
                multiRangeEndEditEnabled: [],
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
            const baseTimezoneId = deps.sanitizeBaseTimezoneId(activeGroup?.baseTimezoneId);

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
                multiRangeCount: deps.MIN_MULTI_RANGE_COUNT,
                multiRangeTitle: deps.t("placeholder_range_title"),
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
                if (hasChromeStorage()) {
                    const data = await chrome.storage.local.get(deps.STORAGE_KEY);
                    const chromeSerialized = data[deps.STORAGE_KEY];
                    const localSerialized = safeLocalStorageGet(deps.STORAGE_KEY);
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
                console.warn("Chrome storage error during loadPersistence. Falling back to localStorage.", err);
            }

            if (!serialized) {
                serialized = safeLocalStorageGet(deps.STORAGE_KEY);
                selectedCandidate = parseSerializedPersistencePayload(serialized, "local");
            }

            const legacyFallbackKeys = Array.isArray(deps.LEGACY_STORAGE_FALLBACK_KEYS)
                ? deps.LEGACY_STORAGE_FALLBACK_KEYS
                : deps.LEGACY_STORAGE_KEYS;
            if (!serialized) {
                for (const key of legacyFallbackKeys) {
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
                deps.setState(nextState);

                deps.loadCurrentMultiStateFromActiveSubgroup();
                deps.ensureBaseTimezoneSelection();

                persistenceRevision = Math.max(
                    persistenceRevision,
                    sanitizePersistenceRevision(selectedCandidate?.revision)
                );

                if (selectedCandidate?.source === "local" && hasChromeStorage()) {
                    void setStorageValue(deps.STORAGE_KEY, selectedCandidate.serialized, { suppressToast: true });
                }
            } catch (err) {
                console.warn("Failed to parse persisted data. Falling back to defaults.", err);
                applyDefaultPersistenceState();
                await savePersistence();
            }
        }

        async function resetAllSettings() {
            if (!confirmFn(deps.t("confirm_reset_all_settings"))) return;

            const keysToRemove = [
                deps.STORAGE_KEY,
                deps.THEME_STORAGE_KEY,
                deps.LANG_STORAGE_KEY,
                deps.UI_SCALE_STORAGE_KEY,
                ...deps.LEGACY_STORAGE_KEYS
            ];

            try {
                const storage = getStorageLocal();
                if (storage) {
                    await storage.remove(keysToRemove);
                }
            } catch (err) {
                console.warn("Chrome storage remove error.", err);
            }
            keysToRemove.forEach((key) => safeLocalStorageRemove(key));
            applyDefaultPersistenceState({ includeMultiState: true });
            await syncUiAfterSettingsReset();
        }

        async function resetExceptGroupsAndTimezones() {
            if (!confirmFn(deps.t("confirm_reset_except_group_tz"))) return;

            deps.syncCurrentMultiStateToActiveSubgroup();
            const currentState = (typeof deps.getState === "function") ? (deps.getState() || {}) : {};
            const sourceGroups = Array.isArray(currentState.groups) ? currentState.groups : [];
            const preservedGroups = sourceGroups
                .map((group, idx) => {
                    try {
                        return deps.sanitizeGroup({
                            name: group?.name,
                            zones: group?.zones,
                            baseTimezoneId: group?.baseTimezoneId,
                            showUtcRow: group?.showUtcRow,
                            utcRowOrder: group?.utcRowOrder,
                            fixedDate: group?.fixedDate,
                            fixedTimes: group?.fixedTimes
                        }, idx, null);
                    } catch (err) {
                        console.warn("sanitizeGroup failed during resetExceptGroupsAndTimezones.", err);
                        return null;
                    }
                })
                .filter(Boolean);

            const groups = preservedGroups.length ? preservedGroups : getDefaultGroups();
            groups.forEach((group) => deps.ensureGroupMultiSubgroups(group));

            deps.setState({
                groups,
                activeGroupId: 0,
                currentMainTab: "live",
                activeGroupIdByMainTab: { live: 0, fixed: 0 },
                activeFormatProfileContext: "live",
                slotCount: 1,
                showCopyFormat: false,
                showTimeline: false,
                timeAdjustDayStepBySlot: [deps.DEFAULT_TIME_ADJUST_DAY_STEP, deps.DEFAULT_TIME_ADJUST_DAY_STEP],
                displayFormatOrder: [...deps.COPY_FORMAT_KEYS],
                displayFormatEnabled: deps.sanitizeCopyFormatEnabled(null, "display"),
                displayTimePartsEnabled: deps.sanitizeTimePartsEnabled(null, "display"),
                copyFormatOrder: [...deps.COPY_FORMAT_KEYS],
                copyFormatEnabled: deps.sanitizeCopyFormatEnabled(null, "copy"),
                copyTimePartsEnabled: deps.sanitizeTimePartsEnabled(null, "copy"),
                multiRangeCount: deps.MIN_MULTI_RANGE_COUNT,
                multiRangeTitle: deps.t("placeholder_range_title"),
                multiRanges: [],
                multiRangeCollapsed: [],
                multiRangeStartEditEnabled: [],
                multiRangeEndEditEnabled: [],
                isRealtime: true
            });
            if (typeof deps.sanitizeFormatProfiles === "function") {
                deps.setState({
                    formatProfiles: deps.sanitizeFormatProfiles(null, null)
                });
            }
            deps.loadCurrentMultiStateFromActiveSubgroup();

            const keysToRemove = [
                deps.THEME_STORAGE_KEY,
                deps.LANG_STORAGE_KEY,
                deps.UI_SCALE_STORAGE_KEY,
                ...deps.LEGACY_STORAGE_KEYS
            ];

            try {
                const storage = getStorageLocal();
                if (storage) {
                    await storage.remove(keysToRemove);
                    await storage.remove([deps.STORAGE_KEY]);
                }
            } catch (err) {
                console.warn("Chrome storage remove error.", err);
            }
            keysToRemove.forEach((key) => safeLocalStorageRemove(key));
            safeLocalStorageRemove(deps.STORAGE_KEY);
            await syncUiAfterSettingsReset();
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
