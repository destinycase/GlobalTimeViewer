(function initGtvStatePersistence(globalObj) {
    "use strict";

    function createService(deps) {
        let lastPersistenceErrorToastAt = 0;

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

        async function setStorageValue(key, value, options = {}) {
            const { suppressToast = false } = options;
            try {
                const storage = getStorageLocal();
                if (storage) {
                    await storage.set({ [key]: value });
                } else {
                    localStorage.setItem(key, value);
                }
                return { ok: true, error: null };
            } catch (err) {
                console.error(`Failed to write storage key "${key}".`, err);
                if (!suppressToast) showPersistenceErrorToast(err);
                return { ok: false, error: err };
            }
        }

        async function getStorageValue(key, fallback = null) {
            try {
                const storage = getStorageLocal();
                if (storage) {
                    const data = await storage.get(key);
                    if (data && data[key] !== undefined) return data[key];
                }
                return localStorage.getItem(key) ?? fallback;
            } catch (err) {
                console.warn(`Failed to read storage key "${key}". Falling back to localStorage.`, err);
                return localStorage.getItem(key) ?? fallback;
            }
        }

        function persistStorageSnapshot(snapshot, options = {}) {
            let serialized = "";
            try {
                serialized = JSON.stringify(snapshot);
            } catch (err) {
                console.error("Failed to serialize persistence snapshot.", err);
                if (!options?.suppressToast) showPersistenceErrorToast(err);
                return { ok: false, error: err };
            }
            return setStorageValue(deps.STORAGE_KEY, serialized, options);
        }

        async function savePersistence(options = {}) {
            const snapshot = deps.getPersistenceSnapshot();
            const result = await persistStorageSnapshot(snapshot, options);
            return result.ok;
        }

        function getDefaultGroups() {
            const defaultGroup = {
                name: deps.t("default_group_name"),
                zones: [],
                baseTimezoneId: "utc",
                showUtcRow: true,
                utcRowOrder: 0
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

        async function loadPersistence() {
            let serialized = null;

            try {
                if (hasChromeStorage()) {
                    const data = await chrome.storage.local.get(deps.STORAGE_KEY);
                    serialized = data[deps.STORAGE_KEY];
                }
            } catch (err) {
                console.warn("Chrome storage error during loadPersistence. Falling back to localStorage.", err);
            }

            if (!serialized) {
                serialized = localStorage.getItem(deps.STORAGE_KEY);
            }

            const legacyFallbackKeys = Array.isArray(deps.LEGACY_STORAGE_FALLBACK_KEYS)
                ? deps.LEGACY_STORAGE_FALLBACK_KEYS
                : deps.LEGACY_STORAGE_KEYS;
            if (!serialized) {
                for (const key of legacyFallbackKeys) {
                    const legacy = localStorage.getItem(key);
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
                const parsed = JSON.parse(serialized);
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

                if (currentMainTab === "live" || currentMainTab === "fixed") {
                    activeGroupId = activeGroupIdByMainTab[currentMainTab];
                }

                deps.setState({
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
                });

                deps.loadCurrentMultiStateFromActiveSubgroup();
                deps.ensureBaseTimezoneSelection();
            } catch (err) {
                console.warn("Failed to parse persisted data. Falling back to defaults.", err);
                applyDefaultPersistenceState();
                savePersistence();
            }
        }

        async function resetAllSettings() {
            if (!confirm(deps.t("confirm_reset_all_settings"))) return;

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
            keysToRemove.forEach((key) => localStorage.removeItem(key));
            location.reload();
        }

        async function resetExceptGroupsAndTimezones() {
            if (!confirm(deps.t("confirm_reset_except_group_tz"))) return;

            deps.syncCurrentMultiStateToActiveSubgroup();
            const currentState = deps.getState();
            const preservedGroups = currentState.groups
                .map((group, idx) => deps.sanitizeGroup({
                    name: group?.name,
                    zones: group?.zones,
                    baseTimezoneId: group?.baseTimezoneId,
                    showUtcRow: group?.showUtcRow,
                    utcRowOrder: group?.utcRowOrder
                }, idx, null))
                .filter(Boolean);

            const groups = preservedGroups.length ? preservedGroups : getDefaultGroups();
            groups.forEach((group) => deps.ensureGroupMultiSubgroups(group));

            deps.setState({
                groups,
                activeGroupId: 0,
                currentMainTab: "live",
                activeGroupIdByMainTab: { live: 0, fixed: 0 },
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
            keysToRemove.forEach((key) => localStorage.removeItem(key));
            localStorage.removeItem(deps.STORAGE_KEY);

            const currentTheme = await deps.loadThemePreference();
            let nextLang = "ko";

            try {
                const storage = getStorageLocal();
                if (storage) {
                    const d = await storage.get(deps.LANG_STORAGE_KEY);
                    nextLang = d[deps.LANG_STORAGE_KEY] || localStorage.getItem(deps.LANG_STORAGE_KEY) || "ko";
                } else {
                    nextLang = localStorage.getItem(deps.LANG_STORAGE_KEY) || "ko";
                }
            } catch (e) {
                nextLang = localStorage.getItem(deps.LANG_STORAGE_KEY) || "ko";
            }

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
            savePersistence();
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
            loadPersistence
        });
    }

    globalObj.GTVStatePersistence = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
