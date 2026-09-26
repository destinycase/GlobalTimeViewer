(function initGtvPersistenceStateNormalizer(globalObj) {
    "use strict";

    const DEFAULT_TIME_PARTS_ENABLED = Object.freeze({
        dn: false,
        date: true,
        time: true,
        weekday: false
    });

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const copyFormatKeys = Array.isArray(safeDeps.COPY_FORMAT_KEYS)
            ? safeDeps.COPY_FORMAT_KEYS.map((key) => (typeof key === "string" ? key.trim() : "")).filter(Boolean)
            : [];
        const minMultiRangeCount = Number.isFinite(Number(safeDeps.MIN_MULTI_RANGE_COUNT))
            ? Math.max(1, Number.parseInt(safeDeps.MIN_MULTI_RANGE_COUNT, 10)) : 1;
        const defaultTimeAdjustDayStep = Number.isFinite(Number(safeDeps.DEFAULT_TIME_ADJUST_DAY_STEP))
            ? Number(safeDeps.DEFAULT_TIME_ADJUST_DAY_STEP) : 1;
        const translate = (typeof safeDeps.t === "function") ? safeDeps.t : ((key) => String(key ?? ""));
        const getDefaultFixedDate = (typeof safeDeps.getDefaultFixedDate === "function") ? safeDeps.getDefaultFixedDate : (() => "");
        const getDefaultFixedTimes = (typeof safeDeps.getDefaultFixedTimes === "function") ? safeDeps.getDefaultFixedTimes : (() => []);
        const ensureGroupMultiSubgroupsSafe = (typeof safeDeps.ensureGroupMultiSubgroupsSafe === "function")
            ? safeDeps.ensureGroupMultiSubgroupsSafe : (() => undefined);

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


            return Object.freeze({
            sanitizeCopyFormatOrder, sanitizeCopyFormatEnabled, sanitizeTimePartsEnabled,
            deriveTimePartsFromLegacyEnabled, sanitizeMultiStatePayload, sanitizeMultiRangeTitle,
            sanitizeGroup, sanitizeBaseTimezoneId, isSupportedMainTab, sanitizeMainTab,
            sanitizeTimeAdjustDayStep, sanitizeFormatProfiles, getDefaultGroups, clampGroupIndex,
            getDefaultDayStartHour, getDefaultNightStartHour, sanitizeDayNightHour, normalizeDayNightRange,
            normalizeParsedPersistenceState, normalizeImportedPayload
        });
    }

    globalObj.GTVPersistenceStateNormalizer = Object.freeze({ createService });
})(typeof window !== "undefined" ? window : globalThis);
