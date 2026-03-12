window.isRealtime = true;
let isRealtime = window.isRealtime;
let globalTimes = [new Date(), new Date()];
let slotCount = 1;
let uiScale = 1.0;
let showCopyFormat = false;
let showTimeline = false;
const COPY_FORMAT_KEYS = ["timezone", "region", "offset", "time", "period_days", "period_time"];
const TIME_PART_KEYS = ["dn", "date", "time", "weekday"];
const PERIOD_RESULT_IDS = new Set(["period-res", "period-hour-res", "period-min-res", "period-sec-res"]);
const MAIN_TABS = ["live", "fixed", "multi", "calc"];
const TIMELINE_TOTAL_HOURS = 24;
const TIMELINE_TOTAL_SECONDS = 24 * 60 * 60;
const requestUiFrame = (typeof requestAnimationFrame === "function")
    ? requestAnimationFrame.bind(globalThis)
    : ((cb) => setTimeout(cb, 16));
const cancelUiFrame = (typeof cancelAnimationFrame === "function")
    ? cancelAnimationFrame.bind(globalThis)
    : ((id) => clearTimeout(id));
const MIN_TIME_ADJUST_DAY_STEP = 1;
const MAX_TIME_ADJUST_DAY_STEP = 36500;
const DEFAULT_TIME_ADJUST_DAY_STEP = 1;
const MIN_MULTI_RANGE_COUNT = 1;
const MAX_MULTI_RANGE_COUNT = 12;
const DEFAULT_MULTI_RANGE_TITLE = "Range";
const DEFAULT_DISPLAY_FORMAT_ENABLED = {
    timezone: true,
    region: true,
    offset: true,
    time: true,
    period_days: false,
    period_time: true
};
const DEFAULT_COPY_FORMAT_ENABLED = {
    timezone: true,
    region: true,
    offset: true,
    time: true,
    period_days: false,
    period_time: true
};
const DEFAULT_DISPLAY_TIME_PARTS_ENABLED = {
    dn: true,
    date: true,
    time: true,
    weekday: true
};
const DEFAULT_COPY_TIME_PARTS_ENABLED = {
    dn: false,
    date: true,
    time: true,
    weekday: false
};
let displayFormatOrder = [...COPY_FORMAT_KEYS];
let displayFormatEnabled = { ...DEFAULT_DISPLAY_FORMAT_ENABLED };
let copyFormatOrder = [...COPY_FORMAT_KEYS];
let copyFormatEnabled = { ...DEFAULT_COPY_FORMAT_ENABLED };
let displayTimePartsEnabled = { ...DEFAULT_DISPLAY_TIME_PARTS_ENABLED };
let copyTimePartsEnabled = { ...DEFAULT_COPY_TIME_PARTS_ENABLED };
let timeAdjustDayStepBySlot = [DEFAULT_TIME_ADJUST_DAY_STEP, DEFAULT_TIME_ADJUST_DAY_STEP];
let multiRangeCount = 1;
let multiRangeTitle = t("placeholder_range_title");
let multiRanges = [];
let multiRangeCollapsed = [];
let multiRangeStartEditEnabled = [];
let multiRangeEndEditEnabled = [];
let currentMainTab = "live";
let activeGroupIdByMainTab = { live: 0, fixed: 0 };
let currentTheme = "dark";
let canUseForeignObjectRenderer = null;
let timezoneIdSeed = 0;
let floatingTooltipEl = null;
let floatingTooltipTarget = null;
let floatingTooltipBound = false;
let timelineDragState = null;
let dragGhostEl = null;
const GTV_TIME_CORE = (typeof window !== "undefined" ? window.GTVTimeCore : globalThis.GTVTimeCore);
const GTV_CALCULATOR = (typeof window !== "undefined" ? window.GTVCalculator : globalThis.GTVCalculator);
const GTV_MULTI_STATE = (typeof window !== "undefined" ? window.GTVMultiState : globalThis.GTVMultiState);
const GTV_IMAGE_EXPORT = (typeof window !== "undefined" ? window.GTVImageExport : globalThis.GTVImageExport);
const GTV_GROUP_STATE = (typeof window !== "undefined" ? window.GTVGroupState : globalThis.GTVGroupState);
const GTV_GROUP_TABS = (typeof window !== "undefined" ? window.GTVGroupTabs : globalThis.GTVGroupTabs);
const GTV_TIMEZONE_SEARCH = (typeof window !== "undefined" ? window.GTVTimezoneSearch : globalThis.GTVTimezoneSearch);
const GTV_SNAPSHOT_FORMAT = (typeof window !== "undefined" ? window.GTVSnapshotFormat : globalThis.GTVSnapshotFormat);
const GTV_TABLE_RENDER = (typeof window !== "undefined" ? window.GTVTableRender : globalThis.GTVTableRender);
const GTV_MULTI_RANGE_RENDER = (typeof window !== "undefined" ? window.GTVMultiRangeRender : globalThis.GTVMultiRangeRender);
const GTV_MULTI_RANGE_COPY = (typeof window !== "undefined" ? window.GTVMultiRangeCopy : globalThis.GTVMultiRangeCopy);
const GTV_COPY_ACTIONS = (typeof window !== "undefined" ? window.GTVCopyActions : globalThis.GTVCopyActions);
const GTV_TIME_ADJUST_UI = (typeof window !== "undefined" ? window.GTVTimeAdjustUI : globalThis.GTVTimeAdjustUI);
const GTV_FORMAT_CONTROLS = (typeof window !== "undefined" ? window.GTVFormatControls : globalThis.GTVFormatControls);
const GTV_TAB_UI = (typeof window !== "undefined" ? window.GTVTabUI : globalThis.GTVTabUI);
const GTV_STATE_PERSISTENCE = (typeof window !== "undefined" ? window.GTVStatePersistence : globalThis.GTVStatePersistence);
const GTV_SETTINGS_IO = (typeof window !== "undefined" ? window.GTVSettingsIO : globalThis.GTVSettingsIO);
const GTV_DATA_TRANSFER = (typeof window !== "undefined" ? window.GTVDataTransfer : globalThis.GTVDataTransfer);
const GTV_APP_CONFIG = (typeof window !== "undefined" ? window.GTVAppConfig : globalThis.GTVAppConfig);
if (!GTV_TIME_CORE) {
    throw new Error("Missing required module: GTVTimeCore");
}
if (!GTV_IMAGE_EXPORT) {
    throw new Error("Missing required module: GTVImageExport");
}
if (!GTV_MULTI_STATE || typeof GTV_MULTI_STATE.createService !== "function") {
    throw new Error("Missing required module API: GTVMultiState.createService");
}
if (!GTV_GROUP_STATE || typeof GTV_GROUP_STATE.createService !== "function") {
    throw new Error("Missing required module API: GTVGroupState.createService");
}
if (!GTV_GROUP_TABS || typeof GTV_GROUP_TABS.createService !== "function") {
    throw new Error("Missing required module API: GTVGroupTabs.createService");
}
if (!GTV_TIMEZONE_SEARCH || typeof GTV_TIMEZONE_SEARCH.createService !== "function") {
    throw new Error("Missing required module API: GTVTimezoneSearch.createService");
}
if (!GTV_SNAPSHOT_FORMAT || typeof GTV_SNAPSHOT_FORMAT.createService !== "function") {
    throw new Error("Missing required module API: GTVSnapshotFormat.createService");
}
if (!GTV_TABLE_RENDER || typeof GTV_TABLE_RENDER.createService !== "function") {
    throw new Error("Missing required module API: GTVTableRender.createService");
}
if (!GTV_MULTI_RANGE_RENDER || typeof GTV_MULTI_RANGE_RENDER.createService !== "function") {
    throw new Error("Missing required module API: GTVMultiRangeRender.createService");
}
if (!GTV_MULTI_RANGE_COPY || typeof GTV_MULTI_RANGE_COPY.createService !== "function") {
    throw new Error("Missing required module API: GTVMultiRangeCopy.createService");
}
if (!GTV_COPY_ACTIONS || typeof GTV_COPY_ACTIONS.createService !== "function") {
    throw new Error("Missing required module API: GTVCopyActions.createService");
}
if (!GTV_TIME_ADJUST_UI || typeof GTV_TIME_ADJUST_UI.createService !== "function") {
    throw new Error("Missing required module API: GTVTimeAdjustUI.createService");
}
if (!GTV_FORMAT_CONTROLS || typeof GTV_FORMAT_CONTROLS.createService !== "function") {
    throw new Error("Missing required module API: GTVFormatControls.createService");
}
if (!GTV_TAB_UI || typeof GTV_TAB_UI.createService !== "function") {
    throw new Error("Missing required module API: GTVTabUI.createService");
}
if (!GTV_STATE_PERSISTENCE || typeof GTV_STATE_PERSISTENCE.createService !== "function") {
    throw new Error("Missing required module API: GTVStatePersistence.createService");
}
if (!GTV_SETTINGS_IO || typeof GTV_SETTINGS_IO.createService !== "function") {
    throw new Error("Missing required module API: GTVSettingsIO.createService");
}
if (!GTV_DATA_TRANSFER || typeof GTV_DATA_TRANSFER.createService !== "function") {
    throw new Error("Missing required module API: GTVDataTransfer.createService");
}
if (!GTV_APP_CONFIG) {
    throw new Error("Missing required module: GTVAppConfig");
}

const VERSION = GTV_APP_CONFIG.VERSION;
const STORAGE_KEY = GTV_APP_CONFIG.STORAGE_KEY;
const THEME_STORAGE_KEY = GTV_APP_CONFIG.THEME_STORAGE_KEY;
const LANG_STORAGE_KEY = GTV_APP_CONFIG.LANG_STORAGE_KEY;
const UI_SCALE_STORAGE_KEY = GTV_APP_CONFIG.UI_SCALE_STORAGE_KEY;
const MIN_UI_SCALE_PERCENT = GTV_APP_CONFIG.MIN_UI_SCALE_PERCENT;
const MAX_UI_SCALE_PERCENT = GTV_APP_CONFIG.MAX_UI_SCALE_PERCENT;
const DEFAULT_UI_SCALE_PERCENT = GTV_APP_CONFIG.DEFAULT_UI_SCALE_PERCENT;
const UI_SCALE_PERCENT_OPTIONS = [...GTV_APP_CONFIG.UI_SCALE_PERCENT_OPTIONS];
const LEGACY_STORAGE_KEYS = [...GTV_APP_CONFIG.LEGACY_STORAGE_KEYS];
const LEGACY_STORAGE_FALLBACK_KEYS = [...GTV_APP_CONFIG.LEGACY_STORAGE_FALLBACK_KEYS];
const THEME_LIST = [...GTV_APP_CONFIG.THEME_LIST];
const TABLE_IMAGE_EXPORT_WIDTH = GTV_APP_CONFIG.TABLE_IMAGE_EXPORT_WIDTH;
const EXPORT_MONO_FONT_FAMILY = GTV_APP_CONFIG.EXPORT_MONO_FONT_FAMILY;

function applyVersionBranding() {
    const titleText = `Global Time v${VERSION}`;
    document.title = titleText;
    const badge = document.getElementById("version-badge");
    if (badge) badge.textContent = `ver ${VERSION}`;
}

function setCustomTooltip(el, text) {
    if (!(el instanceof Element)) return;
    const tooltip = (typeof text === "string") ? text.trim() : "";
    if (!tooltip) {
        el.removeAttribute("data-tooltip");
        if (!el.classList.contains("info-tip")) el.classList.remove("custom-tooltip");
        el.removeAttribute("title");
        return;
    }
    el.setAttribute("data-tooltip", tooltip);
    el.setAttribute("aria-label", tooltip);
    el.removeAttribute("title");
    if (!el.classList.contains("info-tip")) el.classList.add("custom-tooltip");
}

function upgradeNativeTitleTooltips(root = document) {
    if (!root) return;
    const candidates = root.querySelectorAll(
        'button.copy-row-btn[title], button.remove-row-btn[title]'
    );
    candidates.forEach((el) => {
        const text = (el.getAttribute("title") || "").trim();
        if (!text) {
            el.removeAttribute("title");
            return;
        }
        setCustomTooltip(el, text);
    });
}

function ensureFloatingTooltipElement() {
    if (floatingTooltipEl && floatingTooltipEl.isConnected) return floatingTooltipEl;
    const tooltip = document.createElement("div");
    tooltip.className = "app-floating-tooltip";
    tooltip.id = "app-floating-tooltip";
    document.body.appendChild(tooltip);
    floatingTooltipEl = tooltip;
    return tooltip;
}

function hideFloatingTooltip() {
    if (floatingTooltipEl) floatingTooltipEl.classList.remove("visible");
    floatingTooltipTarget = null;
}

function positionFloatingTooltip() {
    if (!floatingTooltipEl || !floatingTooltipTarget) return;
    if (!(floatingTooltipTarget instanceof Element) || !floatingTooltipTarget.isConnected) {
        hideFloatingTooltip();
        return;
    }

    const targetRect = floatingTooltipTarget.getBoundingClientRect();
    floatingTooltipEl.style.left = "0px";
    floatingTooltipEl.style.top = "0px";
    const tooltipRect = floatingTooltipEl.getBoundingClientRect();
    const viewportPadding = 8;
    const offset = 10;

    let left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
    left = Math.min(
        window.innerWidth - tooltipRect.width - viewportPadding,
        Math.max(viewportPadding, left)
    );

    let top = targetRect.top - tooltipRect.height - offset;
    if (top < viewportPadding) {
        top = targetRect.bottom + offset;
    }
    top = Math.min(
        window.innerHeight - tooltipRect.height - viewportPadding,
        Math.max(viewportPadding, top)
    );

    floatingTooltipEl.style.left = `${Math.round(left)}px`;
    floatingTooltipEl.style.top = `${Math.round(top)}px`;
}

function showFloatingTooltip(target) {
    if (!(target instanceof Element)) {
        hideFloatingTooltip();
        return;
    }
    const text = (target.getAttribute("data-tooltip") || "").trim();
    if (!text) {
        hideFloatingTooltip();
        return;
    }

    const tooltip = ensureFloatingTooltipElement();
    tooltip.textContent = text;
    floatingTooltipTarget = target;
    tooltip.classList.add("visible");
    positionFloatingTooltip();
}

function clearDragGhost() {
    if (!dragGhostEl) return;
    if (dragGhostEl.parentNode) {
        dragGhostEl.parentNode.removeChild(dragGhostEl);
    }
    dragGhostEl = null;
}

function createDragGhostFromRow(row) {
    if (!(row instanceof HTMLElement)) return null;
    clearDragGhost();

    const ghostTable = document.createElement("table");
    ghostTable.className = "data-table drag-ghost-table";
    ghostTable.setAttribute("aria-hidden", "true");

    const ghostBody = document.createElement("tbody");
    const ghostRow = row.cloneNode(true);
    if (ghostRow instanceof HTMLElement) {
        ghostRow.classList.remove("dragging");
        ghostRow.classList.add("drag-ghost-row");
        const sourceInputs = [...row.querySelectorAll(".time-input")];
        ghostRow.querySelectorAll(".time-input").forEach((input, idx) => {
            const sourceValue = sourceInputs[idx]?.value;
            if (typeof sourceValue === "string") input.value = sourceValue;
            input.setAttribute("readonly", "readonly");
        });
    }
    ghostBody.appendChild(ghostRow);
    ghostTable.appendChild(ghostBody);

    const rect = row.getBoundingClientRect();
    ghostTable.style.width = `${Math.max(420, Math.round(rect.width))}px`;
    ghostTable.style.position = "fixed";
    ghostTable.style.left = "-10000px";
    ghostTable.style.top = "-10000px";
    ghostTable.style.pointerEvents = "none";
    ghostTable.style.zIndex = "10000";

    document.body.appendChild(ghostTable);
    dragGhostEl = ghostTable;
    return ghostTable;
}

function bindFloatingTooltipEvents() {
    if (floatingTooltipBound) return;
    floatingTooltipBound = true;

    document.addEventListener("pointerenter", (e) => {
        const target = e.target instanceof Element ? e.target.closest("[data-tooltip]") : null;
        if (!target) return;
        showFloatingTooltip(target);
    }, true);

    document.addEventListener("pointerleave", (e) => {
        const target = e.target instanceof Element ? e.target.closest("[data-tooltip]") : null;
        if (!target) return;
        const relatedTarget = e.relatedTarget;
        if (relatedTarget instanceof Element && target.contains(relatedTarget)) return;
        if (floatingTooltipTarget === target) hideFloatingTooltip();
    }, true);

    document.addEventListener("focusin", (e) => {
        const target = e.target instanceof Element ? e.target.closest("[data-tooltip]") : null;
        if (!target) return;
        showFloatingTooltip(target);
    }, true);

    document.addEventListener("focusout", (e) => {
        const target = e.target instanceof Element ? e.target.closest("[data-tooltip]") : null;
        if (!target) return;
        const relatedTarget = e.relatedTarget;
        if (relatedTarget instanceof Element && target.contains(relatedTarget)) return;
        if (floatingTooltipTarget === target) hideFloatingTooltip();
    }, true);

    window.addEventListener("scroll", positionFloatingTooltip, true);
    window.addEventListener("resize", positionFloatingTooltip, true);
    document.addEventListener("pointerdown", hideFloatingTooltip, true);
    document.addEventListener("keydown", hideFloatingTooltip, true);
}

// --- ???袁⒲?筌띾뙫怨롪뗄?샕 ?怨쀬뵠??(Extensive Mapping for Abbr) ---
const TZ_DATABASE = [
    { zone: "Asia/Seoul", name: "대한민국", city: "서울", name_en: "South Korea", city_en: "Seoul" },
    { zone: "Asia/Tokyo", name: "일본", city: "도쿄", name_en: "Japan", city_en: "Tokyo" },
    { zone: "Asia/Shanghai", name: "중국", city: "상하이", name_en: "China", city_en: "Shanghai" },
    { zone: "Asia/Hong_Kong", name: "홍콩", city: "홍콩", name_en: "Hong Kong", city_en: "Hong Kong" },
    { zone: "Asia/Singapore", name: "싱가포르", city: "싱가포르", name_en: "Singapore", city_en: "Singapore" },
    { zone: "Asia/Taipei", name: "대만", city: "타이베이", name_en: "Taiwan", city_en: "Taipei" },
    { zone: "Asia/Bangkok", name: "태국", city: "방콕", name_en: "Thailand", city_en: "Bangkok" },
    { zone: "Asia/Ho_Chi_Minh", name: "베트남", city: "호치민", name_en: "Vietnam", city_en: "Ho Chi Minh" },
    { zone: "Asia/Jakarta", name: "인도네시아", city: "자카르타", name_en: "Indonesia", city_en: "Jakarta" },
    { zone: "Asia/Dubai", name: "아랍에미리트", city: "두바이", name_en: "UAE", city_en: "Dubai" },
    { zone: "Asia/Kolkata", name: "인도", city: "뉴델리", name_en: "India", city_en: "New Delhi" },
    { zone: "Europe/London", name: "영국", city: "런던", name_en: "UK", city_en: "London" },
    { zone: "Europe/Paris", name: "프랑스", city: "파리", name_en: "France", city_en: "Paris" },
    { zone: "Europe/Berlin", name: "독일", city: "베를린", name_en: "Germany", city_en: "Berlin" },
    { zone: "Europe/Moscow", name: "러시아", city: "모스크바", name_en: "Russia", city_en: "Moscow" },
    { zone: "Europe/Istanbul", name: "튀르키예", city: "이스탄불", name_en: "Turkey", city_en: "Istanbul" },
    { zone: "America/New_York", name: "미국", city: "뉴욕", name_en: "USA", city_en: "New York" },
    { zone: "America/Chicago", name: "미국", city: "시카고", name_en: "USA", city_en: "Chicago" },
    { zone: "America/Los_Angeles", name: "미국", city: "로스앤젤레스", name_en: "USA", city_en: "Los Angeles" },
    { zone: "America/Mexico_City", name: "멕시코", city: "멕시코시티", name_en: "Mexico", city_en: "Mexico City" },
    { zone: "America/Sao_Paulo", name: "브라질", city: "상파울루", name_en: "Brazil", city_en: "Sao Paulo" },
    { zone: "Australia/Sydney", name: "호주", city: "시드니", name_en: "Australia", city_en: "Sydney" },
    { zone: "Australia/Perth", name: "호주", city: "퍼스", name_en: "Australia", city_en: "Perth" },
    { zone: "Pacific/Auckland", name: "뉴질랜드", city: "오클랜드", name_en: "New Zealand", city_en: "Auckland" }
];

function getLocalizedTZLabel(tzData) {
    if (currentLang === "en") {
        return `${tzData.name_en} - ${tzData.city_en}`;
    }
    return `${tzData.name} - ${tzData.city}`;
}

function formatUtcOffsetLabel(totalMinutes = 0) {
    return timezoneSearchService.formatUtcOffsetLabel(totalMinutes);
}

function normalizeZoneAbbreviation(value) {
    return timezoneSearchService.normalizeZoneAbbreviation(value);
}

function getAllSupportedTimezoneNames() {
    return timezoneSearchService.getAllSupportedTimezoneNames();
}

function getSelectableTZEntries() {
    return timezoneSearchService.getSelectableTZEntries();
}

function getStandardTimezoneEntries() {
    return timezoneSearchService.getStandardTimezoneEntries();
}

function queueStandardTimezoneWarmup() {
    return timezoneSearchService.queueStandardTimezoneWarmup();
}

function getTimezoneEntryTitle(entry) {
    return timezoneSearchService.getTimezoneEntryTitle(entry);
}

function getSelectableTZEntryByKey(entryKey) {
    return timezoneSearchService.getSelectableTZEntryByKey(entryKey);
}

function getSelectableTZOptionLabel(entry) {
    return timezoneSearchService.getSelectableTZOptionLabel(entry);
}

function sanitizeFullTimezoneOverlayTab(value) {
    return timezoneSearchService.sanitizeFullTimezoneOverlayTab(value);
}

function renderFullTimezoneOverlayList() {
    return timezoneSearchService.renderFullTimezoneOverlayList();
}

function updateFullTimezoneOverlayTabButtons() {
    return timezoneSearchService.updateFullTimezoneOverlayTabButtons();
}

function setFullTimezoneOverlayTab(value) {
    return timezoneSearchService.setFullTimezoneOverlayTab(value);
}

function normalizeCustomAbbr(value) {
    const trimmed = (value || "").trim();
    if (!trimmed) return t("label_custom");
    return trimmed.toUpperCase().slice(0, 12);
}

function getCurrentGroup() {
    return groups[activeGroupId] || null;
}

function sanitizeTimezoneId(value) {
    return GTV_TIME_CORE.sanitizeTimezoneId(value);
}

function sanitizeBaseTimezoneId(value) {
    return GTV_TIME_CORE.sanitizeBaseTimezoneId(value);
}

function sanitizeUtcRowOrder(value) {
    return GTV_TIME_CORE.sanitizeUtcRowOrder(value);
}

function getCurrentGroupBaseTimezoneId() {
    const group = getCurrentGroup();
    if (!group) return "utc";
    return sanitizeBaseTimezoneId(group.baseTimezoneId);
}

function setCurrentGroupBaseTimezoneId(value) {
    const group = getCurrentGroup();
    if (!group) return false;
    group.baseTimezoneId = sanitizeBaseTimezoneId(value);
    return true;
}

function getCurrentGroupZones() {
    return getCurrentGroup()?.zones || [];
}

function getUsedTimezoneIds() {
    const usedIds = new Set(["utc"]);
    groups.forEach((group) => {
        if (!group || !Array.isArray(group.zones)) return;
        group.zones.forEach((zone) => {
            const zoneId = sanitizeTimezoneId(zone?.id);
            if (zoneId) usedIds.add(zoneId);
        });
    });
    return usedIds;
}

function createUniqueTimezoneId(prefix = "tz") {
    const normalizedPrefix = (typeof prefix === "string" && prefix.trim()) ? prefix.trim() : "tz";
    const usedIds = getUsedTimezoneIds();

    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        const uuidId = `${normalizedPrefix}-${crypto.randomUUID()}`;
        if (!usedIds.has(uuidId)) return uuidId;
    }

    for (let attempt = 0; attempt < 10000; attempt++) {
        timezoneIdSeed = (timezoneIdSeed + 1) % 1000000;
        const candidate = `${normalizedPrefix}-${Date.now()}-${timezoneIdSeed}`;
        if (!usedIds.has(candidate)) return candidate;
    }

    return `${normalizedPrefix}-${Date.now()}-${Math.floor(Math.random() * 1000000000)}`;
}

function sanitizeMultiSubgroupId(value) {
    return multiStateService.sanitizeMultiSubgroupId(value);
}

function sanitizeMultiSubgroupName(value, fallback = "") {
    return multiStateService.sanitizeMultiSubgroupName(value, fallback);
}

function getDefaultMultiSubgroupName(index = 0) {
    return multiStateService.getDefaultMultiSubgroupName(index);
}

function parseAutoGeneratedIndexedName(name, baseCandidates = []) {
    const text = (typeof name === "string") ? name.trim() : "";
    if (!text) return { matched: false, number: null };

    for (const base of baseCandidates) {
        const safeBase = String(base || "").trim();
        if (!safeBase) continue;
        if (text === safeBase) {
            return { matched: true, number: null };
        }
        const escapedBase = safeBase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const matched = text.match(new RegExp(`^${escapedBase}\\s+(\\d+)$`));
        if (matched) {
            return { matched: true, number: parseInt(matched[1], 10) };
        }
    }
    return { matched: false, number: null };
}

function localizeAutoGeneratedNamesForCurrentLanguage() {
    if (!Array.isArray(groups) || !groups.length) return false;
    let changed = false;

    const groupBaseCandidates = ["Default Group", "湲곕낯 洹몃９"];
    const subgroupBaseCandidates = ["Subgroup", "Aux Group", "?쒕툕 洹몃９", "蹂댁“ 洹몃９"];
    const nextGroupBase = t("default_group_name");
    const nextSubgroupBase = t("default_subgroup_name");

    groups.forEach((group, groupIdx) => {
        if (!group || typeof group !== "object") return;
        const parsedGroup = parseAutoGeneratedIndexedName(group.name, groupBaseCandidates);
        if (parsedGroup.matched) {
            const nextGroupName = Number.isFinite(parsedGroup.number)
                ? `${nextGroupBase} ${parsedGroup.number}`
                : nextGroupBase;
            if (group.name !== nextGroupName) {
                group.name = nextGroupName;
                changed = true;
            }
        }

        ensureGroupMultiSubgroups(group);
        group.multiSubgroups.forEach((subgroup, subgroupIdx) => {
            const parsedSubgroup = parseAutoGeneratedIndexedName(subgroup?.name, subgroupBaseCandidates);
            if (!parsedSubgroup.matched) return;
            const nextSubgroupName = Number.isFinite(parsedSubgroup.number)
                ? `${nextSubgroupBase} ${parsedSubgroup.number}`
                : `${nextSubgroupBase} ${subgroupIdx + 1}`;
            if (subgroup.name !== nextSubgroupName) {
                subgroup.name = nextSubgroupName;
                changed = true;
            }
        });
    });

    return changed;
}

function getUsedMultiSubgroupIds() {
    return multiStateService.getUsedMultiSubgroupIds();
}

function createUniqueMultiSubgroupId(prefix = "subgroup") {
    return multiStateService.createUniqueMultiSubgroupId(prefix);
}

function sanitizeMultiStatePayload(rawState = null, fallbackState = null) {
    return multiStateService.sanitizeMultiStatePayload(rawState, fallbackState);
}

function createMultiSubgroupState(name = "", index = 0, state = null) {
    return multiStateService.createMultiSubgroupState(name, index, state);
}

function ensureGroupMultiSubgroups(group, options = {}) {
    return multiStateService.ensureGroupMultiSubgroups(group, options);
}

function getCurrentGroupMultiSubgroups() {
    const group = getCurrentGroup();
    if (!group) return [];
    ensureGroupMultiSubgroups(group);
    return group.multiSubgroups;
}

function getCurrentMultiSubgroup() {
    const group = getCurrentGroup();
    if (!group) return null;
    ensureGroupMultiSubgroups(group);
    return group.multiSubgroups.find((subgroup) => subgroup.id === group.activeMultiSubgroupId) || group.multiSubgroups[0] || null;
}

function getCurrentMultiSubgroupName() {
    const subgroup = getCurrentMultiSubgroup();
    return sanitizeMultiSubgroupName(subgroup?.name, getDefaultMultiSubgroupName(0));
}

function syncCurrentMultiStateToActiveSubgroup() {
    const group = getCurrentGroup();
    if (!group) return;
    ensureGroupMultiSubgroups(group);
    ensureMultiRangeState();

    const subgroup = getCurrentMultiSubgroup();
    if (!subgroup) return;

    subgroup.name = sanitizeMultiSubgroupName(subgroup.name, getDefaultMultiSubgroupName(0));
    subgroup.multiRangeCount = sanitizeMultiRangeCount(multiRangeCount);
    subgroup.multiRanges = multiRanges.map((range) => ({
        startUtcMs: sanitizeUtcMs(range.startUtcMs, Date.now()),
        endUtcMs: sanitizeUtcMs(range.endUtcMs, Date.now())
    }));
    subgroup.multiRangeCollapsed = multiRangeCollapsed.map((flag) => !!flag);
    subgroup.multiRangeStartEditEnabled = multiRangeStartEditEnabled.map((flag) => !!flag);
    subgroup.multiRangeEndEditEnabled = multiRangeEndEditEnabled.map((flag) => !!flag);
}

function loadCurrentMultiStateFromActiveSubgroup() {
    const subgroup = getCurrentMultiSubgroup();
    const normalized = sanitizeMultiStatePayload(subgroup, null);
    multiRangeCount = normalized.multiRangeCount;
    multiRanges = normalized.multiRanges;
    multiRangeCollapsed = normalized.multiRangeCollapsed;
    multiRangeStartEditEnabled = normalized.multiRangeStartEditEnabled;
    multiRangeEndEditEnabled = normalized.multiRangeEndEditEnabled;
    multiRangeTitle = sanitizeMultiRangeTitle(getCurrentMultiSubgroupName());
    ensureMultiRangeState();
    refreshMultiRangeControls();
}

function isCurrentGroupUtcRowVisible() {
    const group = getCurrentGroup();
    if (!group) return true;
    return group.showUtcRow !== false;
}

function getCurrentGroupUtcRowOrder() {
    const group = getCurrentGroup();
    if (!group) return 0;
    return sanitizeUtcRowOrder(group.utcRowOrder);
}

function getZoneDisplayName(tz) {
    if (!tz) return "";

    // Custom timezone: always use the user-defined name
    if (tz.type === "custom") {
        return tz.name_ko || tz.name || tz.name_en || tz.zone || "";
    }

    // Fixed offset standard time (e.g., "UTC+09:00 Standard Time" or "UTC+09:00 표준시")
    if (tz.fixedOffsetMinutes !== undefined && tz.fixedOffsetMinutes !== null) {
        const nameFallback = tz.name_ko || tz.name || tz.name_en || "";
        if (nameFallback.includes("표준시") || nameFallback.toLowerCase().includes("standard time")) {
            const offsetLabel = formatUtcOffsetLabel(tz.fixedOffsetMinutes);
            return currentLang === "en" ? `${offsetLabel} Standard Time` : `${offsetLabel} 표준시`;
        }
    }

    if (tz.zone === "UTC") return t("utc_name");

    // Standard IANA timezone
    if (tz.zone && tz.zone !== "UTC") {
        // Find matching entry in TZ_DATABASE
        const dbEntry = TZ_DATABASE.find(entry => entry.zone === tz.zone);
        if (dbEntry) {
            return getLocalizedTZLabel(dbEntry);
        }
    }

    // Fallback to stored names if all dynamic localization attempts fail
    if (currentLang === "en") return tz.name_en || tz.name || tz.name_ko || tz.zone || "";
    return tz.name_ko || tz.name || tz.name_en || tz.zone || "";
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function getZoneAbbreviation(tz, date = globalTimes[0]) {
    if (!tz) return "";
    if (tz.zone === "UTC") return "UTC";
    if (tz.type === "custom") return normalizeCustomAbbr(tz.abbr);
    const fixedAbbr = normalizeZoneAbbreviation(tz.fixedAbbr);
    if (fixedAbbr) return fixedAbbr;
    return getBetterAbbr(tz.zone, date);
}

function ensureBaseTimezoneSelection() {
    const group = getCurrentGroup();
    if (!group) return;
    const currentBaseTimezoneId = getCurrentGroupBaseTimezoneId();
    if (currentBaseTimezoneId === "utc") {
        group.baseTimezoneId = "utc";
        return;
    }
    const exists = (group.zones || []).some(z => z.id === currentBaseTimezoneId);
    if (!exists) group.baseTimezoneId = "utc";
}

function getUTCRef() {
    return { id: "utc", type: "standard", zone: "UTC", name: t("utc_name") };
}

function getBaseTimezoneRef() {
    ensureBaseTimezoneSelection();
    const currentBaseTimezoneId = getCurrentGroupBaseTimezoneId();
    if (currentBaseTimezoneId === "utc") return getUTCRef();
    const tz = getCurrentGroupZones().find(z => z.id === currentBaseTimezoneId);
    if (!tz) return getUTCRef();
    return tz;
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
        order.forEach(key => {
            const normalizedKey = normalizeCopyFormatKey(key);
            if (COPY_FORMAT_KEYS.includes(normalizedKey) && !safeOrder.includes(normalizedKey)) safeOrder.push(normalizedKey);
        });
    }
    COPY_FORMAT_KEYS.forEach(key => {
        if (!safeOrder.includes(key)) safeOrder.push(key);
    });
    return safeOrder;
}

function sanitizeCopyFormatEnabled(enabled, mode = "display") {
    const safe = getDefaultFormatEnabled(mode);
    COPY_FORMAT_KEYS.forEach(key => {
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

function deriveTimePartsFromLegacyEnabled(legacyEnabled, mode = "display") {
    return sanitizeTimePartsEnabled(null, mode);
}

function isMultiTab() {
    return currentMainTab === "multi";
}

function sanitizeMultiRangeCount(value) {
    const parsed = parseInt(value, 10);
    if (!Number.isFinite(parsed)) return MIN_MULTI_RANGE_COUNT;
    return Math.min(MAX_MULTI_RANGE_COUNT, Math.max(MIN_MULTI_RANGE_COUNT, parsed));
}

function sanitizeMultiRangeTitle(value) {
    const text = (typeof value === "string") ? value.trim() : "";
    if (!text) return t("placeholder_range_title");
    return text.slice(0, 40);
}

function sanitizeUtcMs(value, fallbackMs) {
    return GTV_TIME_CORE.sanitizeUtcMs(value, fallbackMs);
}

function getDefaultMultiRangeBounds() {
    const nowMs = Date.now();
    const startMs = sanitizeUtcMs(globalTimes[0]?.getTime?.(), nowMs);
    const endMs = sanitizeUtcMs(globalTimes[1]?.getTime?.(), startMs);
    return { startMs, endMs };
}

function sanitizeMultiRangeItem(rawRange, fallbackStartMs, fallbackEndMs) {
    if (!rawRange || typeof rawRange !== "object") {
        return { startUtcMs: fallbackStartMs, endUtcMs: fallbackEndMs };
    }
    const startUtcMs = sanitizeUtcMs(rawRange.startUtcMs, fallbackStartMs);
    const endUtcMs = sanitizeUtcMs(rawRange.endUtcMs, fallbackEndMs);
    return { startUtcMs, endUtcMs };
}

function isMultiRangeStartEditEnabled(rangeIdx) {
    if (!Number.isInteger(rangeIdx) || rangeIdx <= 0) return false;
    return !!multiRangeStartEditEnabled[rangeIdx];
}

function isMultiRangeEndEditEnabled(rangeIdx) {
    if (!Number.isInteger(rangeIdx) || rangeIdx < 0) return false;
    return !!multiRangeEndEditEnabled[rangeIdx];
}

function isMultiRangeStartLinked(rangeIdx) {
    return rangeIdx > 0 && !isMultiRangeStartEditEnabled(rangeIdx);
}

function ensureMultiRangeState() {
    multiRangeCount = sanitizeMultiRangeCount(multiRangeCount);
    multiRangeTitle = sanitizeMultiRangeTitle(multiRangeTitle);
    const defaults = getDefaultMultiRangeBounds();
    const normalized = Array.isArray(multiRanges)
        ? multiRanges.map((item) => sanitizeMultiRangeItem(item, defaults.startMs, defaults.endMs))
        : [];
    const normalizedCollapsed = Array.isArray(multiRangeCollapsed)
        ? multiRangeCollapsed.map((flag) => !!flag)
        : [];
    const normalizedStartEdit = Array.isArray(multiRangeStartEditEnabled)
        ? multiRangeStartEditEnabled.map((flag) => !!flag)
        : [];
    const normalizedEndEdit = Array.isArray(multiRangeEndEditEnabled)
        ? multiRangeEndEditEnabled.map((flag) => !!flag)
        : [];

    let nextRanges = normalized.slice(0, multiRangeCount);
    if (!nextRanges.length) {
        nextRanges = [{
            startUtcMs: defaults.startMs,
            endUtcMs: defaults.endMs
        }];
    }

    const firstDuration = nextRanges[0].endUtcMs - nextRanges[0].startUtcMs;
    while (nextRanges.length < multiRangeCount) {
        const prev = nextRanges[nextRanges.length - 1];
        const startUtcMs = prev.endUtcMs;
        nextRanges.push({
            startUtcMs,
            endUtcMs: startUtcMs + firstDuration
        });
    }

    const nextStartEditEnabled = Array.from({ length: multiRangeCount }, (_, idx) => (idx === 0 ? false : !!normalizedStartEdit[idx]));
    const nextEndEditEnabled = Array.from({ length: multiRangeCount }, (_, idx) =>
        (normalizedEndEdit[idx] === undefined ? true : !!normalizedEndEdit[idx])
    );
    nextRanges[0].startUtcMs = sanitizeUtcMs(nextRanges[0].startUtcMs, defaults.startMs);
    nextRanges[0].endUtcMs = sanitizeUtcMs(nextRanges[0].endUtcMs, defaults.endMs);
    for (let i = 1; i < nextRanges.length; i++) {
        nextRanges[i].startUtcMs = sanitizeUtcMs(nextRanges[i].startUtcMs, nextRanges[i - 1].endUtcMs);
        if (!nextStartEditEnabled[i]) {
            nextRanges[i].startUtcMs = nextRanges[i - 1].endUtcMs;
        }
        nextRanges[i].endUtcMs = sanitizeUtcMs(nextRanges[i].endUtcMs, nextRanges[i].startUtcMs);
    }

    multiRanges = nextRanges;
    multiRangeCollapsed = Array.from({ length: multiRangeCount }, (_, idx) => !!normalizedCollapsed[idx]);
    multiRangeStartEditEnabled = nextStartEditEnabled;
    multiRangeEndEditEnabled = nextEndEditEnabled;
}

function setMultiRangeStartEditEnabled(rangeIdx, enabled, options = {}) {
    const { persist = true, rerender = true } = options;
    ensureMultiRangeState();
    if (!Number.isInteger(rangeIdx) || rangeIdx <= 0 || rangeIdx >= multiRangeCount) return false;

    const nextEnabled = !!enabled;
    multiRangeStartEditEnabled[rangeIdx] = nextEnabled;
    if (!nextEnabled) {
        multiRanges[rangeIdx].startUtcMs = multiRanges[rangeIdx - 1].endUtcMs;
    }

    if (rerender && isMultiTab()) renderMultiRanges();
    if (persist) savePersistence();
    return true;
}

function setMultiRangeEndEditEnabled(rangeIdx, enabled, options = {}) {
    const { persist = true, rerender = true } = options;
    ensureMultiRangeState();
    if (!Number.isInteger(rangeIdx) || rangeIdx < 0 || rangeIdx >= multiRangeCount) return false;

    multiRangeEndEditEnabled[rangeIdx] = !!enabled;

    if (rerender && isMultiTab()) renderMultiRanges();
    if (persist) savePersistence();
    return true;
}

function setAllMultiRangeStartEditEnabled(enabled, options = {}) {
    const { persist = true, rerender = true } = options;
    ensureMultiRangeState();
    const next = !!enabled;

    for (let idx = 1; idx < multiRangeCount; idx++) {
        multiRangeStartEditEnabled[idx] = next;
        if (!next) {
            multiRanges[idx].startUtcMs = multiRanges[idx - 1].endUtcMs;
        }
    }

    if (rerender && isMultiTab()) renderMultiRanges();
    if (persist) savePersistence();
    return true;
}

function setAllMultiRangeEndEditEnabled(enabled, options = {}) {
    const { persist = true, rerender = true } = options;
    ensureMultiRangeState();
    const next = !!enabled;

    for (let idx = 0; idx < multiRangeCount; idx++) {
        multiRangeEndEditEnabled[idx] = next;
    }

    if (rerender && isMultiTab()) renderMultiRanges();
    if (persist) savePersistence();
    return true;
}

function refreshMultiRangeControls() {
    const countInput = document.getElementById("multi-range-count-input");
    if (countInput) countInput.value = String(multiRangeCount);

    const decreaseBtn = document.getElementById("multi-range-count-decrease");
    const increaseBtn = document.getElementById("multi-range-count-increase");
    if (decreaseBtn) decreaseBtn.disabled = multiRangeCount <= MIN_MULTI_RANGE_COUNT;
    if (increaseBtn) increaseBtn.disabled = multiRangeCount >= MAX_MULTI_RANGE_COUNT;

}

function renderMultiBulkToolSets() {
    const startTools = document.getElementById("multi-bulk-start-tools");
    const allTools = document.getElementById("multi-bulk-all-tools");
    if (!allTools) return;

    const hasRanges = multiRangeCount > 0;
    allTools.textContent = "";
    if (startTools) {
        startTools.textContent = "";
        startTools.style.display = "none";
    }
    allTools.style.display = "flex";
    allTools.style.flexDirection = "column";
    allTools.style.alignItems = "flex-start";
    allTools.style.gap = "8px";

    const bulkSet = renderTimeAdjustSet(1, {
        labelText: t("label_range_bulk"),
        disabled: !hasRanges,
        onAction: applyBulkRangeAllAction,
        includeFixedActions: false
    });
    const zeroDayBtn = createTimeAdjustActionButton("btn_set_zero_day", 1, "set_zero_day", applyBulkRangeAllAction, !hasRanges);
    zeroDayBtn.classList.add("time-adjust-bulk-zero-btn");
    const firstActionNode = [...bulkSet.children].find((node, idx) => idx > 0);
    if (firstActionNode) {
        bulkSet.insertBefore(zeroDayBtn, firstActionNode);
        bulkSet.insertBefore(createTimeAdjustDivider(), firstActionNode);
    } else {
        bulkSet.appendChild(zeroDayBtn);
    }
    const bulkToolBlock = document.createElement("div");
    bulkToolBlock.className = "multi-tool-block";
    bulkToolBlock.appendChild(bulkSet);

    const createBulkToggleButton = (buttonText, onClick) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "sm-btn time-adjust-bulk-toggle-btn";
        button.textContent = buttonText;
        button.disabled = !hasRanges;
        button.addEventListener("click", () => {
            if (button.disabled) return;
            onClick();
        });
        return button;
    };

    const bulkToggleSet = document.createElement("div");
    bulkToggleSet.className = "time-adjust-set";
    const bulkToggleLabel = document.createElement("span");
    bulkToggleLabel.className = "time-adjust-set-label";
    bulkToggleLabel.textContent = t("label_all_range_time_adjust");
    bulkToggleSet.appendChild(bulkToggleLabel);
    bulkToggleSet.appendChild(createBulkToggleButton(
        t("btn_enable_all_start_time_adjust"),
        () => setAllMultiRangeStartEditEnabled(true, { persist: true, rerender: true })
    ));
    bulkToggleSet.appendChild(createBulkToggleButton(
        t("btn_disable_all_start_time_adjust"),
        () => setAllMultiRangeStartEditEnabled(false, { persist: true, rerender: true })
    ));
    bulkToggleSet.appendChild(createTimeAdjustDivider());
    bulkToggleSet.appendChild(createBulkToggleButton(
        t("btn_enable_all_end_time_adjust"),
        () => setAllMultiRangeEndEditEnabled(true, { persist: true, rerender: true })
    ));
    bulkToggleSet.appendChild(createBulkToggleButton(
        t("btn_disable_all_end_time_adjust"),
        () => setAllMultiRangeEndEditEnabled(false, { persist: true, rerender: true })
    ));
    const toggleToolBlock = document.createElement("div");
    toggleToolBlock.className = "multi-tool-block";
    toggleToolBlock.appendChild(bulkToggleSet);
    allTools.appendChild(toggleToolBlock);
    allTools.appendChild(bulkToolBlock);

    const syncZeroButtonWidth = () => {
        const bulkZeroBtn = allTools.querySelector(".time-adjust-bulk-zero-btn");
        if (!bulkZeroBtn) return;
        const rangeButtons = [...document.querySelectorAll('.multi-range-adjust-row [data-action="set_zero_day"], .multi-range-adjust-row [data-action="sync_prev_end"]')];
        const targetButtons = [bulkZeroBtn, ...rangeButtons].filter((btn) => btn instanceof HTMLElement);
        if (!targetButtons.length) return;

        targetButtons.forEach((btn) => {
            btn.style.width = "";
            btn.style.minWidth = "";
            btn.style.justifyContent = "";
            btn.style.textAlign = "";
        });

        const firstRangeStartSet = document.querySelector('.multi-range-adjust-row .time-adjust-set [data-action="now"]')?.closest(".time-adjust-set");
        let desiredSpanToDivider = 0;
        if (firstRangeStartSet) {
            const nowBtn = firstRangeStartSet.querySelector('[data-action="now"]');
            const firstDivider = firstRangeStartSet.querySelector(".time-adjust-divider");
            if (nowBtn && firstDivider) {
                const nowRect = nowBtn.getBoundingClientRect();
                const dividerRect = firstDivider.getBoundingClientRect();
                desiredSpanToDivider = Math.round(dividerRect.left - nowRect.left);
            }
        }

        if (desiredSpanToDivider > 0) {
            targetButtons.forEach((btn) => {
                const set = btn.closest(".time-adjust-set");
                const setStyle = set ? window.getComputedStyle(set) : null;
                const gap = setStyle ? (parseFloat(setStyle.columnGap || setStyle.gap || "0") || 0) : 0;
                const btnStyle = window.getComputedStyle(btn);
                const marginRight = parseFloat(btnStyle.marginRight || "0") || 0;
                const nextWidth = Math.max(150, Math.round(desiredSpanToDivider - marginRight - gap));
                const widthPx = `${nextWidth}px`;
                btn.style.width = widthPx;
                btn.style.minWidth = widthPx;
            });
            return;
        }

        const fallbackWidth = Math.max(
            180,
            ...targetButtons.map((btn) => Math.ceil(btn.getBoundingClientRect().width)),
            ...targetButtons.map((btn) => Math.ceil(btn.scrollWidth + 18))
        );
        if (fallbackWidth <= 0) return;
        const widthPx = `${fallbackWidth}px`;
        targetButtons.forEach((btn) => {
            btn.style.width = widthPx;
            btn.style.minWidth = widthPx;
        });
    };

    if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
        window.requestAnimationFrame(syncZeroButtonWidth);
    } else {
        syncZeroButtonWidth();
    }
    upgradeNativeTitleTooltips(allTools);
}

function syncMultiRangeStartLinks(startIdx = 1) {
    ensureMultiRangeState();
    for (let idx = Math.max(1, startIdx); idx < multiRanges.length; idx++) {
        if (!isMultiRangeStartLinked(idx)) continue;
        multiRanges[idx].startUtcMs = multiRanges[idx - 1].endUtcMs;
    }
}

function syncFollowingRangesByDuration(changedRangeIdx) {
    if (!Number.isInteger(changedRangeIdx) || changedRangeIdx < 0 || changedRangeIdx >= multiRanges.length) return;
    if (changedRangeIdx >= multiRanges.length - 1) return;

    const fallbackNow = Date.now();
    const durations = multiRanges.map((range) => {
        const startUtcMs = sanitizeUtcMs(range?.startUtcMs, fallbackNow);
        const endUtcMs = sanitizeUtcMs(range?.endUtcMs, startUtcMs);
        return endUtcMs - startUtcMs;
    });

    let cursor = sanitizeUtcMs(multiRanges[changedRangeIdx]?.endUtcMs, fallbackNow);
    for (let idx = changedRangeIdx + 1; idx < multiRanges.length; idx++) {
        const duration = durations[idx] ?? 0;
        if (isMultiRangeStartLinked(idx)) {
            multiRanges[idx].startUtcMs = cursor;
            multiRanges[idx].endUtcMs = cursor + duration;
        } else {
            multiRanges[idx].startUtcMs = sanitizeUtcMs(multiRanges[idx].startUtcMs, cursor);
            multiRanges[idx].endUtcMs = sanitizeUtcMs(multiRanges[idx].endUtcMs, multiRanges[idx].startUtcMs);
        }
        cursor = sanitizeUtcMs(multiRanges[idx].endUtcMs, cursor);
    }
}

function syncLinkedRangesFrom(rangeIdx, options = {}) {
    const { includeCurrent = true, stopAtFirstUnlocked = true, baseDurations = null } = options;
    ensureMultiRangeState();
    if (!Number.isInteger(rangeIdx) || rangeIdx < 0 || rangeIdx >= multiRanges.length) return;

    const fallbackNow = Date.now();
    const durations = Array.isArray(baseDurations) && baseDurations.length
        ? baseDurations
        : multiRanges.map((range) => {
            const startUtcMs = sanitizeUtcMs(range?.startUtcMs, fallbackNow);
            const endUtcMs = sanitizeUtcMs(range?.endUtcMs, startUtcMs);
            return endUtcMs - startUtcMs;
        });

    let anchorIdx = rangeIdx;
    if (includeCurrent) {
        const startUtcMs = sanitizeUtcMs(multiRanges[anchorIdx]?.startUtcMs, fallbackNow);
        multiRanges[anchorIdx].startUtcMs = startUtcMs;
        multiRanges[anchorIdx].endUtcMs = startUtcMs + (durations[anchorIdx] ?? 0);
    }

    let cursor = sanitizeUtcMs(multiRanges[anchorIdx]?.endUtcMs, fallbackNow);
    for (let idx = anchorIdx + 1; idx < multiRanges.length; idx++) {
        if (!isMultiRangeStartLinked(idx)) {
            if (stopAtFirstUnlocked) break;
            cursor = sanitizeUtcMs(multiRanges[idx]?.endUtcMs, cursor);
            continue;
        }
        multiRanges[idx].startUtcMs = cursor;
        multiRanges[idx].endUtcMs = cursor + (durations[idx] ?? 0);
        cursor = sanitizeUtcMs(multiRanges[idx].endUtcMs, cursor);
    }
}

function setMultiRangeCount(value, options = {}) {
    const { persist = true, rerender = true, showBoundaryToast = false } = options;
    const parsed = parseInt(value, 10);
    const nextCount = sanitizeMultiRangeCount(value);

    if (showBoundaryToast && Number.isFinite(parsed)) {
        if (parsed >= MAX_MULTI_RANGE_COUNT) {
            showToast(t("toast_range_count_max"));
        } else if (parsed <= MIN_MULTI_RANGE_COUNT) {
            showToast(t("toast_range_count_min"));
        }
    }

    multiRangeCount = nextCount;
    ensureMultiRangeState();
    refreshMultiRangeControls();

    if (rerender && isMultiTab()) renderMultiRanges();
    if (persist) savePersistence();
}

function setMultiRangeTitle(value, options = {}) {
    const { persist = true, rerender = true } = options;
    const subgroup = getCurrentMultiSubgroup();
    if (subgroup) {
        subgroup.name = sanitizeMultiSubgroupName(value, subgroup.name || getDefaultMultiSubgroupName(0));
        multiRangeTitle = sanitizeMultiRangeTitle(subgroup.name);
    } else {
        multiRangeTitle = sanitizeMultiRangeTitle(value);
    }
    ensureMultiRangeState();
    refreshMultiRangeControls();

    if (rerender && isMultiTab()) renderMultiRanges();
    if (persist) savePersistence();
}

function toggleMultiRangeCollapsed(rangeIdx) {
    ensureMultiRangeState();
    if (!Number.isInteger(rangeIdx) || rangeIdx < 0 || rangeIdx >= multiRangeCollapsed.length) return;
    multiRangeCollapsed[rangeIdx] = !multiRangeCollapsed[rangeIdx];
    if (isMultiTab()) renderMultiRanges();
    savePersistence();
}

function setAllMultiRangesCollapsed(collapsed) {
    ensureMultiRangeState();
    const next = !!collapsed;
    multiRangeCollapsed = Array.from({ length: multiRangeCount }, () => next);
    if (isMultiTab()) renderMultiRanges();
    savePersistence();
}

function setMultiRangesCollapsedBelow(rangeIdx, collapsed) {
    ensureMultiRangeState();
    if (!Number.isInteger(rangeIdx) || rangeIdx < 0 || rangeIdx >= multiRangeCount) return;

    const startIdx = rangeIdx; // "below ranges": include current range
    if (startIdx >= multiRangeCount) return;

    const next = !!collapsed;
    for (let idx = startIdx; idx < multiRangeCount; idx++) {
        multiRangeCollapsed[idx] = next;
    }

    if (isMultiTab()) renderMultiRanges();
    savePersistence();
}

function getMultiRangeSlotDate(rangeIdx, slotIdx) {
    ensureMultiRangeState();
    const range = multiRanges[rangeIdx];
    if (!range) return new Date();
    const utcMs = slotIdx === 0 ? range.startUtcMs : range.endUtcMs;
    return new Date(utcMs);
}

function setMultiRangeSlotDate(rangeIdx, slotIdx, nextDate) {
    ensureMultiRangeState();
    const range = multiRanges[rangeIdx];
    if (!range || !(nextDate instanceof Date) || !Number.isFinite(nextDate.getTime())) return false;
    const nextMs = nextDate.getTime();
    if (slotIdx === 0) range.startUtcMs = nextMs;
    else range.endUtcMs = nextMs;
    return true;
}

function sanitizeUiScalePercent(value) {
    const parsed = parseInt(value, 10);
    if (!Number.isFinite(parsed)) return DEFAULT_UI_SCALE_PERCENT;
    const clamped = Math.min(MAX_UI_SCALE_PERCENT, Math.max(MIN_UI_SCALE_PERCENT, parsed));
    return UI_SCALE_PERCENT_OPTIONS.reduce((closest, percent) => (
        Math.abs(percent - clamped) < Math.abs(closest - clamped) ? percent : closest
    ), UI_SCALE_PERCENT_OPTIONS[0]);
}

function getCurrentUiScalePercent() {
    return Math.round(uiScale * 100);
}

async function applyUiScale(scalePercent, persist = true) {
    const safePercent = sanitizeUiScalePercent(scalePercent);
    uiScale = safePercent / 100;

    if (document.documentElement) {
        document.documentElement.style.setProperty("--ui-zoom", uiScale.toFixed(2));
        document.documentElement.style.zoom = String(uiScale);
        document.documentElement.style.overflow = "hidden";
    }
    if (document.body) {
        document.body.style.overflow = "hidden";
    }

    if (persist) {
        await setStorageValue(UI_SCALE_STORAGE_KEY, String(safePercent));
    }
}

async function loadUiScalePreference() {
    const val = await getStorageValue(UI_SCALE_STORAGE_KEY, DEFAULT_UI_SCALE_PERCENT);
    return sanitizeUiScalePercent(val);
}

function populateUiScaleSelect(selectEl) {
    if (!selectEl) return;

    selectEl.textContent = "";
    UI_SCALE_PERCENT_OPTIONS.forEach((percent) => {
        const option = document.createElement("option");
        option.value = String(percent);
        option.textContent = `${percent}%`;
        selectEl.appendChild(option);
    });
}

function sanitizeTheme(theme) {
    return THEME_LIST.includes(theme) ? theme : "dark";
}

async function applyTheme(theme, persist = true) {
    currentTheme = sanitizeTheme(theme);
    if (document.documentElement) {
        document.documentElement.setAttribute("data-theme", currentTheme);
    }
    if (persist) {
        await setStorageValue(THEME_STORAGE_KEY, currentTheme);
    }
}

async function loadThemePreference() {
    const val = await getStorageValue(THEME_STORAGE_KEY, "dark");
    return sanitizeTheme(val);
}

function setCurrentLang(lang) {
    currentLang = I18N_DATA[lang] ? lang : "ko";
    if (document.documentElement) {
        document.documentElement.lang = currentLang;
    }
}

function sanitizeMainTab(tab) {
    return MAIN_TABS.includes(tab) ? tab : "live";
}

function clampGroupIndex(index) {
    const maxIndex = Math.max(0, groups.length - 1);
    const parsed = parseInt(index, 10);
    if (!Number.isFinite(parsed)) return 0;
    return Math.min(Math.max(parsed, 0), maxIndex);
}

function normalizeGroupTabState() {
    activeGroupId = clampGroupIndex(activeGroupId);
    activeGroupIdByMainTab = {
        live: clampGroupIndex(activeGroupIdByMainTab?.live),
        fixed: clampGroupIndex(activeGroupIdByMainTab?.fixed)
    };
}

// --- Group Data Structure ---
let groups = [];
let activeGroupId = 0;
const timezoneSearchService = GTV_TIMEZONE_SEARCH.createService({
    TZ_DATABASE,
    getZoneMap: () => ZONE_MAP,
    t,
    getCurrentLang: () => currentLang,
    getBetterAbbr,
    getTimezoneOffset,
    getLocalizedTZLabel,
    adjustSelectWidthForContent,
    getCurrentGroup,
    savePersistence,
    renderList,
    addTimezone,
    createUniqueTimezoneId
});

const snapshotFormatService = GTV_SNAPSHOT_FORMAT.createService({
    DEFAULT_COPY_TIME_PARTS_ENABLED,
    I18N_DATA,
    t,
    getCurrentLang: () => currentLang,
    getUTCRef,
    getBaseTimezoneRef,
    getCurrentGroupZones,
    getGlobalTimes: () => globalTimes,
    getSlotCount: () => slotCount,
    isRealtime: () => isRealtime,
    getFixedOffsetForDisplay,
    normalizeCustomAbbr,
    getCustomOffsetMinutes,
    pad,
    getZoneAbbreviation,
    getZoneDisplayName,
    getSignedInclusiveDaySpan,
    getSignedDurationDayHourMinute,
    sanitizeTimePartsEnabled,
    sanitizeCopyFormatOrder
});

const tableRenderService = GTV_TABLE_RENDER.createService({
    t,
    sanitizeCopyFormatOrder,
    getDisplayFormatOrder: () => displayFormatOrder,
    getDisplayFormatEnabled: () => displayFormatEnabled,
    getDisplayTimePartsEnabled: () => displayTimePartsEnabled,
    isRealtime: () => isRealtime,
    getSlotCount: () => slotCount,
    isMultiTab,
    renderMultiRanges,
    getBaseTimezoneRef,
    escapeHtml,
    getZoneDisplayName,
    copyRow,
    removeTimezone,
    handleTimeChange,
    saveOrder,
    getCurrentGroupZones,
    isCurrentGroupUtcRowVisible,
    getCurrentGroupUtcRowOrder,
    getUTCRef,
    renderBaseTimeSelect,
    updateTimeAdjustPanel,
    updateClocks,
    hideFloatingTooltip,
    upgradeNativeTitleTooltips,
    createDragGhostFromRow,
    clearDragGhost
});

const multiRangeRenderService = GTV_MULTI_RANGE_RENDER.createService({
    I18N_DATA,
    t,
    getCurrentLang: () => currentLang,
    pad,
    getCustomOffsetMinutes,
    getFixedOffsetForDisplayAtDate,
    normalizeCustomAbbr,
    getZoneAbbreviation,
    getSignedInclusiveDaySpan,
    getSignedDurationDayHourMinute,
    getZoneDisplayName,
    sanitizeMultiSubgroupName,
    getCurrentMultiSubgroupName,
    sanitizeMultiRangeTitle,
    getMultiRangeTitle: () => multiRangeTitle,
    buildStaticRowCell,
    buildDynamicRowCell,
    isMultiRangeStartEditEnabled,
    isMultiRangeEndEditEnabled,
    handleMultiRangeTimeChange,
    copyMultiRangeRow,
    hideFloatingTooltip,
    ensureMultiRangeState,
    refreshMultiRangeControls,
    renderMultiBulkToolSets,
    getBaseTimezoneRef,
    escapeHtml,
    getDisplayColumns,
    getRenderableTimezoneRows,
    getMultiRanges: () => multiRanges,
    getMultiRangeCollapsed: () => multiRangeCollapsed,
    getMultiRangeCount: () => multiRangeCount,
    copyWholeMultiRange,
    setMultiRangesCollapsedBelow,
    toggleMultiRangeCollapsed,
    renderTimeAdjustSet,
    applyMultiRangeTimeAdjustAction,
    attachTimeAdjustToggleLabel,
    setMultiRangeStartEditEnabled,
    setMultiRangeEndEditEnabled,
    getMultiDisplayColumnHeader,
    updateTimeAdjustPanel,
    updateCopyFormatPreview,
    upgradeNativeTitleTooltips,
    saveMultiRangeSingleImage
});

const multiRangeCopyService = GTV_MULTI_RANGE_COPY.createService({
    t,
    showToast,
    ensureMultiRangeState,
    getMultiRanges: () => multiRanges,
    getBaseTimezoneRef,
    getRenderableTimezoneRows,
    getTimezoneRefById,
    buildTimezoneComputedSnapshotForRange,
    formatSnapshotText,
    getMultiRangeTitleText,
    getCopyFormatOrder: () => copyFormatOrder,
    getCopyFormatEnabled: () => copyFormatEnabled,
    getCopyTimePartsEnabled: () => copyTimePartsEnabled,
    writeClipboard: async (text) => navigator.clipboard.writeText(text)
});

const copyActionsService = GTV_COPY_ACTIONS.createService({
    t,
    showToast,
    isShowCopyFormat: () => showCopyFormat,
    isMultiTab,
    ensureMultiRangeState,
    getMultiRanges: () => multiRanges,
    getBaseTimezoneRef,
    buildTimezoneComputedSnapshotForRange,
    formatSnapshotText,
    getCopyFormatOrder: () => copyFormatOrder,
    getCopyFormatEnabled: () => copyFormatEnabled,
    getCopyTimePartsEnabled: () => copyTimePartsEnabled,
    getRowFormattedText,
    getRowCopyText,
    copyAllMultiRangeTimezones,
    writeClipboard: async (text) => navigator.clipboard.writeText(text)
});

const timeAdjustUiService = GTV_TIME_ADJUST_UI.createService({
    MIN_TIME_ADJUST_DAY_STEP,
    MAX_TIME_ADJUST_DAY_STEP,
    DEFAULT_TIME_ADJUST_DAY_STEP,
    t,
    savePersistence,
    applyTimeAdjustAction,
    getCurrentMainTab: () => currentMainTab,
    isRealtime: () => isRealtime,
    getSlotCount: () => slotCount,
    getTimeAdjustDayStepValue: (slotIdx) => timeAdjustDayStepBySlot[slotIdx],
    setTimeAdjustDayStepValue: (slotIdx, value) => {
        timeAdjustDayStepBySlot[slotIdx] = value;
    },
    upgradeNativeTitleTooltips
});

const formatControlsService = GTV_FORMAT_CONTROLS.createService({
    COPY_FORMAT_KEYS,
    TIME_PART_KEYS,
    t,
    sanitizeCopyFormatOrder,
    renderList,
    updateCopyFormatPreview,
    savePersistence,
    upgradeNativeTitleTooltips,
    isShowCopyFormat: () => showCopyFormat,
    getDisplayFormatOrder: () => displayFormatOrder,
    setDisplayFormatOrder: (next) => { displayFormatOrder = next; },
    getDisplayFormatEnabled: () => displayFormatEnabled,
    setDisplayFormatEnabled: (next) => { displayFormatEnabled = next; },
    getDisplayTimePartsEnabled: () => displayTimePartsEnabled,
    setDisplayTimePartsEnabled: (next) => { displayTimePartsEnabled = next; },
    getCopyFormatOrder: () => copyFormatOrder,
    setCopyFormatOrder: (next) => { copyFormatOrder = next; },
    getCopyFormatEnabled: () => copyFormatEnabled,
    setCopyFormatEnabled: (next) => { copyFormatEnabled = next; },
    getCopyTimePartsEnabled: () => copyTimePartsEnabled,
    setCopyTimePartsEnabled: (next) => { copyTimePartsEnabled = next; }
});

const tabUiService = GTV_TAB_UI.createService({
    t,
    sanitizeMainTab,
    clampGroupIndex,
    normalizeGroupTabState,
    isMultiTab,
    getSlotCount: () => slotCount,
    getShowCopyFormat: () => showCopyFormat,
    getShowTimeline: () => showTimeline,
    getIsRealtime: () => isRealtime,
    setIsRealtime: (next) => {
        isRealtime = !!next;
        window.isRealtime = isRealtime;
    },
    syncRealtimeNow: () => {
        globalTimes[0] = new Date();
    },
    getCurrentMainTab: () => currentMainTab,
    setCurrentMainTab: (next) => { currentMainTab = next; },
    getActiveGroupId: () => activeGroupId,
    setActiveGroupId: (next) => { activeGroupId = next; },
    getActiveGroupIdByMainTab: () => activeGroupIdByMainTab,
    setActiveGroupIdByMainTab: (next) => { activeGroupIdByMainTab = next; },
    hideFloatingTooltip,
    syncCurrentMultiStateToActiveSubgroup,
    refreshMultiRangeControls,
    renderBaseTimeSelect,
    loadCurrentMultiStateFromActiveSubgroup,
    renderGroups,
    renderMultiSubgroups,
    renderMultiRanges,
    renderList,
    renderTimelineFrame,
    updateTimeAdjustPanel,
    renderCopyFormatControls,
    savePersistence
});

const multiStateService = GTV_MULTI_STATE.createService({
    MIN_MULTI_RANGE_COUNT,
    t,
    getGroups: () => groups,
    getDefaultMultiRangeBounds,
    sanitizeMultiRangeCount,
    sanitizeMultiRangeItem,
    sanitizeUtcMs
});

const groupStateService = GTV_GROUP_STATE.createService({
    t,
    sanitizeTimezoneId,
    createUniqueTimezoneId,
    normalizeCustomAbbr,
    normalizeZoneAbbreviation,
    sanitizeBaseTimezoneId,
    sanitizeUtcRowOrder,
    sanitizeMultiSubgroupId,
    ensureGroupMultiSubgroups
});

const groupTabsService = GTV_GROUP_TABS.createService({
    t,
    showToast,
    getState: getPersistenceState,
    setState: setPersistenceState,
    isMultiTab,
    getCurrentGroup,
    ensureGroupMultiSubgroups,
    normalizeGroupTabState,
    syncCurrentMultiStateToActiveSubgroup,
    loadCurrentMultiStateFromActiveSubgroup,
    savePersistence,
    renderGroups,
    renderMultiSubgroups,
    renderBaseTimeSelect,
    renderMultiRanges,
    renderList,
    setCustomTooltip,
    hideFloatingTooltip,
    upgradeNativeTitleTooltips,
    getDefaultMultiSubgroupName,
    createMultiSubgroupState,
    sanitizeMultiSubgroupName,
    sanitizeMultiRangeTitle,
    exportGroupToJSON,
    triggerGroupImportFor,
    exportSubgroupToJSON,
    triggerSubgroupImportFor
});

function getPersistenceState() {
    return {
        groups,
        activeGroupId,
        currentMainTab,
        activeGroupIdByMainTab,
        slotCount,
        showCopyFormat,
        showTimeline,
        displayFormatOrder,
        displayFormatEnabled,
        displayTimePartsEnabled,
        copyFormatOrder,
        copyFormatEnabled,
        copyTimePartsEnabled,
        timeAdjustDayStepBySlot,
        multiRangeCount,
        multiRangeTitle,
        multiRanges,
        multiRangeCollapsed,
        multiRangeStartEditEnabled,
        multiRangeEndEditEnabled,
        isRealtime,
        currentTheme,
        currentLang
    };
}

function setPersistenceState(next = {}) {
    if (!next || typeof next !== "object") return;
    if (Object.prototype.hasOwnProperty.call(next, "groups")) groups = next.groups;
    if (Object.prototype.hasOwnProperty.call(next, "activeGroupId")) activeGroupId = next.activeGroupId;
    if (Object.prototype.hasOwnProperty.call(next, "currentMainTab")) currentMainTab = next.currentMainTab;
    if (Object.prototype.hasOwnProperty.call(next, "activeGroupIdByMainTab")) activeGroupIdByMainTab = next.activeGroupIdByMainTab;
    if (Object.prototype.hasOwnProperty.call(next, "slotCount")) slotCount = next.slotCount;
    if (Object.prototype.hasOwnProperty.call(next, "showCopyFormat")) showCopyFormat = next.showCopyFormat;
    if (Object.prototype.hasOwnProperty.call(next, "showTimeline")) showTimeline = !!next.showTimeline;
    if (Object.prototype.hasOwnProperty.call(next, "displayFormatOrder")) displayFormatOrder = next.displayFormatOrder;
    if (Object.prototype.hasOwnProperty.call(next, "displayFormatEnabled")) displayFormatEnabled = next.displayFormatEnabled;
    if (Object.prototype.hasOwnProperty.call(next, "displayTimePartsEnabled")) displayTimePartsEnabled = next.displayTimePartsEnabled;
    if (Object.prototype.hasOwnProperty.call(next, "copyFormatOrder")) copyFormatOrder = next.copyFormatOrder;
    if (Object.prototype.hasOwnProperty.call(next, "copyFormatEnabled")) copyFormatEnabled = next.copyFormatEnabled;
    if (Object.prototype.hasOwnProperty.call(next, "copyTimePartsEnabled")) copyTimePartsEnabled = next.copyTimePartsEnabled;
    if (Object.prototype.hasOwnProperty.call(next, "timeAdjustDayStepBySlot")) timeAdjustDayStepBySlot = next.timeAdjustDayStepBySlot;
    if (Object.prototype.hasOwnProperty.call(next, "multiRangeCount")) multiRangeCount = next.multiRangeCount;
    if (Object.prototype.hasOwnProperty.call(next, "multiRangeTitle")) multiRangeTitle = next.multiRangeTitle;
    if (Object.prototype.hasOwnProperty.call(next, "multiRanges")) multiRanges = next.multiRanges;
    if (Object.prototype.hasOwnProperty.call(next, "multiRangeCollapsed")) multiRangeCollapsed = next.multiRangeCollapsed;
    if (Object.prototype.hasOwnProperty.call(next, "multiRangeStartEditEnabled")) multiRangeStartEditEnabled = next.multiRangeStartEditEnabled;
    if (Object.prototype.hasOwnProperty.call(next, "multiRangeEndEditEnabled")) multiRangeEndEditEnabled = next.multiRangeEndEditEnabled;
    if (Object.prototype.hasOwnProperty.call(next, "isRealtime")) isRealtime = next.isRealtime;
    if (Object.prototype.hasOwnProperty.call(next, "currentTheme")) currentTheme = next.currentTheme;
    if (Object.prototype.hasOwnProperty.call(next, "currentLang")) currentLang = next.currentLang;
}

const persistenceService = GTV_STATE_PERSISTENCE.createService({
    STORAGE_KEY,
    THEME_STORAGE_KEY,
    LANG_STORAGE_KEY,
    UI_SCALE_STORAGE_KEY,
    LEGACY_STORAGE_KEYS,
    LEGACY_STORAGE_FALLBACK_KEYS,
    COPY_FORMAT_KEYS,
    DEFAULT_TIME_ADJUST_DAY_STEP,
    MIN_MULTI_RANGE_COUNT,
    I18N_DATA,
    getState: getPersistenceState,
    setState: setPersistenceState,
    getPersistenceSnapshot,
    ensureGroupMultiSubgroups,
    sanitizeGroup,
    sanitizeBaseTimezoneId,
    sanitizeMainTab,
    sanitizeTimeAdjustDayStep,
    sanitizeCopyFormatOrder,
    sanitizeCopyFormatEnabled,
    sanitizeTimePartsEnabled,
    deriveTimePartsFromLegacyEnabled,
    sanitizeMultiStatePayload,
    sanitizeMultiRangeTitle,
    loadCurrentMultiStateFromActiveSubgroup,
    ensureBaseTimezoneSelection,
    syncCurrentMultiStateToActiveSubgroup,
    loadThemePreference,
    applyTheme,
    loadUiScalePreference,
    applyUiScale,
    populateUiScaleSelect,
    getCurrentUiScalePercent,
    refreshMultiRangeControls,
    updateTZDropdown,
    refreshSelectWidths,
    switchMainTab,
    showToast,
    t,
    applyVersionBranding,
    applyTranslations: () => {
        if (typeof globalThis.applyTranslations === "function") {
            globalThis.applyTranslations();
        }
    }
});

const settingsIoService = GTV_SETTINGS_IO.createService({
    I18N_DATA,
    THEME_STORAGE_KEY,
    LANG_STORAGE_KEY,
    UI_SCALE_STORAGE_KEY,
    getGroups: () => groups,
    getCurrentTheme: () => currentTheme,
    getCurrentLang: () => currentLang,
    getCurrentMainTab: () => currentMainTab,
    sanitizeBaseTimezoneId,
    sanitizeUtcRowOrder,
    persistStorageSnapshot,
    setStorageValue,
    sanitizeTheme,
    sanitizeUiScalePercent,
    setCurrentLang,
    loadPersistence,
    localizeAutoGeneratedNamesForCurrentLanguage,
    savePersistence,
    applyTheme,
    loadThemePreference,
    applyUiScale,
    loadUiScalePreference,
    applyTranslations: () => {
        if (typeof globalThis.applyTranslations === "function") {
            globalThis.applyTranslations();
        }
    },
    applyVersionBranding,
    populateUiScaleSelect,
    getCurrentUiScalePercent,
    refreshMultiRangeControls,
    updateTZDropdown,
    refreshSelectWidths,
    switchMainTab
});
const dataTransferService = GTV_DATA_TRANSFER.createService({
    VERSION,
    MIN_MULTI_RANGE_COUNT,
    I18N_DATA,
    getGroups: () => groups,
    getActiveGroupId: () => activeGroupId,
    getCurrentTheme: () => currentTheme,
    getCurrentLang: () => currentLang,
    getPersistenceSnapshot,
    getCurrentUiScalePercent,
    sanitizeTheme,
    sanitizeFilenamePart,
    pad,
    syncCurrentMultiStateToActiveSubgroup,
    ensureGroupMultiSubgroups,
    sanitizeGroup,
    loadCurrentMultiStateFromActiveSubgroup,
    savePersistence,
    renderGroups,
    renderMultiSubgroups,
    renderBaseTimeSelect,
    renderMultiRanges,
    renderList,
    isMultiTab,
    sanitizeMultiSubgroupId,
    sanitizeMultiSubgroupName,
    getDefaultMultiSubgroupName,
    sanitizeMultiStatePayload,
    getCurrentMultiSubgroup,
    applyImportedSettings: (importedRoot) => settingsIoService.applyImportedSettings(importedRoot),
    isQuotaExceededError,
    showToast,
    t,
    tFormat
});

async function initApp() {
    await loadPersistence();
    if (localizeAutoGeneratedNamesForCurrentLanguage()) {
        await savePersistence();
    }
    loadCurrentMultiStateFromActiveSubgroup();
    await applyTheme(await loadThemePreference(), false);
    await applyUiScale(await loadUiScalePreference(), false);
    applyTranslations();
    applyVersionBranding();
    initUI();
    bindFloatingTooltipEvents();
    initDragAndDrop();
    initSearchAndSelect();
    queueStandardTimezoneWarmup();
    initCalculators();

    setInterval(() => {
        if (window.isRealtime) {
            const now = new Date();
            globalTimes[0] = now;
            updateClocks();
        }
    }, 1000);

    switchMainTab(currentMainTab);

    // Force initial update
    updateClocks();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        initApp().catch(err => console.error("!!! FATAL INIT ERROR (DOMContentLoaded) !!!", err));
    });
} else {
    initApp().catch(err => console.error("!!! FATAL INIT ERROR (Sync) !!!", err));
}

function initUI() {
    // Main Tabs
    document.querySelectorAll(".nav-item").forEach(btn => {
        btn.addEventListener("click", () => switchMainTab(btn.dataset.tab));
    });

    const uiScaleSelect = document.getElementById("ui-scale-select");
    if (uiScaleSelect) {
        populateUiScaleSelect(uiScaleSelect);
        uiScaleSelect.value = String(getCurrentUiScalePercent());
        uiScaleSelect.onchange = (e) => {
            applyUiScale(e.target.value);
            uiScaleSelect.value = String(getCurrentUiScalePercent());
        };
    }
    const multiRangeCountInput = document.getElementById("multi-range-count-input");
    const multiRangeDecreaseBtn = document.getElementById("multi-range-count-decrease");
    const multiRangeIncreaseBtn = document.getElementById("multi-range-count-increase");
    if (multiRangeCountInput) {
        const commitRangeCount = () => {
            setMultiRangeCount(multiRangeCountInput.value, { persist: true, rerender: true, showBoundaryToast: true });
        };
        multiRangeCountInput.addEventListener("input", () => {
            multiRangeCountInput.value = String(multiRangeCountInput.value || "").replace(/[^0-9]/g, "");
        });
        multiRangeCountInput.addEventListener("change", commitRangeCount);
        multiRangeCountInput.addEventListener("blur", commitRangeCount);
        multiRangeCountInput.addEventListener("keydown", (e) => {
            if (e.key !== "Enter") return;
            commitRangeCount();
            multiRangeCountInput.blur();
        });
    }
    if (multiRangeDecreaseBtn) {
        multiRangeDecreaseBtn.addEventListener("click", () => {
            setMultiRangeCount(multiRangeCount - 1, { persist: true, rerender: true, showBoundaryToast: true });
        });
    }
    if (multiRangeIncreaseBtn) {
        multiRangeIncreaseBtn.addEventListener("click", () => {
            setMultiRangeCount(multiRangeCount + 1, { persist: true, rerender: true, showBoundaryToast: true });
        });
    }

    refreshMultiRangeControls();

    // Populate Custom Offset Hour Select
    const hSel = document.getElementById("custom-off-h");
    if (hSel) {
        for (let i = 14; i >= -12; i--) {
            const o = document.createElement("option");
            o.value = i;
            const sign = i > 0 ? "+" : (i < 0 ? "-" : "+");
            o.textContent = `${sign}${String(Math.abs(i)).padStart(2, "0")}`;
            if (i === 0) o.selected = true;
            hSel.appendChild(o);
        }
    }

    // Extra Time Toggle
    const extraTimeToggle = document.getElementById("toggle-extra-time");
    if (extraTimeToggle) {
        extraTimeToggle.checked = slotCount > 1;
        extraTimeToggle.onchange = (e) => {
            slotCount = e.target.checked ? 2 : 1;
            renderList();
            savePersistence();
        };
    }

    const copyFormatToggle = document.getElementById("toggle-copy-format");
    if (copyFormatToggle) {
        copyFormatToggle.checked = showCopyFormat;
        copyFormatToggle.onchange = (e) => {
            showCopyFormat = !!e.target.checked;
            renderCopyFormatControls();
            savePersistence();
        };
    }
    const timelineToggle = document.getElementById("toggle-timeline");
    if (timelineToggle) {
        timelineToggle.checked = showTimeline;
        timelineToggle.onchange = (e) => {
            showTimeline = !!e.target.checked;
            renderTimelineFrame();
            savePersistence();
        };
    }

    const displayFormatResetBtn = document.getElementById("display-format-reset-btn");
    if (displayFormatResetBtn) {
        displayFormatResetBtn.onclick = () => {
            displayFormatOrder = [...COPY_FORMAT_KEYS];
            displayFormatEnabled = sanitizeCopyFormatEnabled(null, "display");
            displayTimePartsEnabled = sanitizeTimePartsEnabled(null, "display");
            renderCopyFormatControls();
            renderList();
            savePersistence();
        };
    }

    const copyFormatResetBtn = document.getElementById("copy-format-reset-btn");
    if (copyFormatResetBtn) {
        copyFormatResetBtn.onclick = () => {
            copyFormatOrder = [...COPY_FORMAT_KEYS];
            copyFormatEnabled = sanitizeCopyFormatEnabled(null, "copy");
            copyTimePartsEnabled = sanitizeTimePartsEnabled(null, "copy");
            renderCopyFormatControls();
            savePersistence();
        };
    }

    const baseTimeSelect = document.getElementById("base-time-select");
    if (baseTimeSelect) {
        baseTimeSelect.onchange = (e) => {
            const nextBaseId = e.target.value || "utc";
            if (nextBaseId === "utc") {
                const activeGroup = getCurrentGroup();
                if (activeGroup) {
                    activeGroup.showUtcRow = true;
                    activeGroup.utcRowOrder = 0;
                }
            }
            setCurrentGroupBaseTimezoneId(nextBaseId);
            renderList();
            updateTimeAdjustPanel();
            savePersistence();
        };
    }

    // Custom Zone
    document.getElementById("add-custom-btn").onclick = () => {
        const abbr = normalizeCustomAbbr(document.getElementById("custom-abbr").value);
        const name = document.getElementById("custom-name").value.trim();
        const offH = parseInt(document.getElementById("custom-off-h").value) || 0;
        const offM = parseInt(document.getElementById("custom-off-m").value) || 0;
        if (!name) return showToast(t("toast_input_name"));
        addTimezone({ id: createUniqueTimezoneId("tz-c"), abbr, name, offH, offM, type: "custom" });
        document.getElementById("custom-abbr").value = "";
        document.getElementById("custom-name").value = "";
    };

    document.getElementById("add-group-btn").onclick = addGroup;
    const addMultiSubgroupBtn = document.getElementById("add-multi-subgroup-btn");
    if (addMultiSubgroupBtn) {
        addMultiSubgroupBtn.onclick = addMultiSubgroup;
    }

    document.getElementById("copy-all-btn").onclick = copyAllTimezones;
    const saveTableImageBtn = document.getElementById("save-table-image-btn");
    const saveTimelineImageBtn = document.getElementById("save-timeline-image-btn");
    const saveMultiRangeTitlesImageBtn = document.getElementById("save-multi-range-titles-image-btn");
    const saveMultiRangeByRangeImageBtn = document.getElementById("save-multi-range-by-range-image-btn");
    const saveImageMultiTimelineBtn = document.getElementById("save-image-multi-timeline-btn");

    if (saveTableImageBtn) {
        saveTableImageBtn.onclick = saveTimezoneTableImage;
    }
    if (saveTimelineImageBtn) {
        saveTimelineImageBtn.onclick = saveTimelineImage;
    }
    if (saveImageMultiTimelineBtn) {
        saveImageMultiTimelineBtn.onclick = saveTimelineImage;
    }
    if (saveMultiRangeTitlesImageBtn) {
        saveMultiRangeTitlesImageBtn.onclick = saveMultiRangeTitlesImage;
    }
    if (saveMultiRangeByRangeImageBtn) {
        saveMultiRangeByRangeImageBtn.onclick = saveMultiRangeAllImage;
    }
    const exportSettingsBtn = document.getElementById("export-settings-btn");
    if (exportSettingsBtn) {
        exportSettingsBtn.onclick = exportSettingsToJSON;
    }
    const importSettingsBtn = document.getElementById("import-settings-btn");
    const settingsImportFile = document.getElementById("settings-import-file");
    if (importSettingsBtn && settingsImportFile) {
        importSettingsBtn.onclick = () => {
            settingsImportFile.value = "";
            settingsImportFile.click();
        };
        settingsImportFile.onchange = handleSettingsImportFile;
    }
    const groupImportFile = document.getElementById("group-import-file");
    if (groupImportFile) {
        groupImportFile.onchange = handleGroupImportFile;
    }
    const subgroupImportFile = document.getElementById("subgroup-import-file");
    if (subgroupImportFile) {
        subgroupImportFile.onchange = handleSubgroupImportFile;
    }

    const themeSelect = document.getElementById("theme-select");
    if (themeSelect) {
        themeSelect.value = currentTheme;
        themeSelect.onchange = async (e) => {
            await applyTheme(e.target.value);
            if (typeof window !== "undefined" && typeof window.__gtvCalcRefresh === "function") {
                window.__gtvCalcRefresh();
            }
        };
    }

    // Language Selector
    const langSelect = document.getElementById("lang-select");
    if (langSelect) {
        langSelect.value = currentLang;
        langSelect.onchange = (e) => {
            hideFloatingTooltip();
            setLanguage(e.target.value);
            if (localizeAutoGeneratedNamesForCurrentLanguage()) {
                savePersistence();
            }
            applyVersionBranding();
            updateTZDropdown(); // Ensure dropdown is updated
            renderGroups();
            renderMultiSubgroups();
            renderList();
            updateTimeAdjustPanel();
            renderCopyFormatControls();
            refreshSelectWidths();
            if (typeof window !== "undefined" && typeof window.__gtvCalcRefresh === "function") {
                window.__gtvCalcRefresh();
            }
        };
    }

    const resetExceptGroupTzBtn = document.getElementById("reset-except-group-tz-btn");
    if (resetExceptGroupTzBtn) {
        resetExceptGroupTzBtn.onclick = resetExceptGroupsAndTimezones;
    }
    const resetAllSettingsBtn = document.getElementById("reset-all-settings-btn");
    if (resetAllSettingsBtn) {
        resetAllSettingsBtn.onclick = resetAllSettings;
    }

    document.querySelectorAll(".info-tip").forEach((tip) => {
        tip.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    renderBaseTimeSelect();
    refreshSelectWidths();
    updateOptionRowVisibility();
    updateTimeAdjustPanel();
    renderCopyFormatControls();
    renderTimelineFrame();
    upgradeNativeTitleTooltips(document);
}

function showToast(message, options = {}) {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const text = (typeof message === "string") ? message.trim() : "";
    if (!text) return;

    const safeType = (typeof options.type === "string" && options.type.trim())
        ? options.type.trim().toLowerCase()
        : "info";
    const toastType = ["success", "error", "info", "loading"].includes(safeType) ? safeType : "info";
    const parsedDuration = Number.parseInt(options.duration, 10);
    const duration = Number.isFinite(parsedDuration) ? Math.max(400, parsedDuration) : 3000;
    const iconMap = {
        success: "✓",
        error: "!",
        info: "i",
        loading: "…"
    };
    const iconText = (typeof options.icon === "string" && options.icon.trim())
        ? options.icon.trim()
        : iconMap[toastType];

    const toast = document.createElement("div");
    toast.className = `toast ${toastType}`;

    const iconEl = document.createElement("span");
    iconEl.className = "toast-icon";
    iconEl.textContent = iconText;

    const textEl = document.createElement("span");
    textEl.className = "toast-text";
    textEl.textContent = text;

    toast.appendChild(iconEl);
    toast.appendChild(textEl);

    container.appendChild(toast);

    const dismiss = () => {
        if (!toast.isConnected) return;
        toast.classList.add("out");
        setTimeout(() => toast.remove(), 500);
    };

    setTimeout(dismiss, duration);
    return { dismiss, element: toast };
}

function isQuotaExceededError(err) {
    return persistenceService.isQuotaExceededError(err);
}

async function setStorageValue(key, value, options = {}) {
    return persistenceService.setStorageValue(key, value, options);
}

async function getStorageValue(key, fallback = null) {
    return persistenceService.getStorageValue(key, fallback);
}

async function persistStorageSnapshot(snapshot, options = {}) {
    return persistenceService.persistStorageSnapshot(snapshot, options);
}

function switchMainTab(tab) {
    return tabUiService.switchMainTab(tab);
}

function updateOptionRowVisibility() {
    return tabUiService.updateOptionRowVisibility();
}

function refreshOptionToggleDividers() {
    return tabUiService.refreshOptionToggleDividers();
}

function adjustSelectWidthForContent(select, minWidth = 0) {
    if (!select) return;
    const canvas = adjustSelectWidthForContent.canvas || (adjustSelectWidthForContent.canvas = document.createElement("canvas"));
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const computed = window.getComputedStyle(select);
    ctx.font = `${computed.fontStyle} ${computed.fontWeight} ${computed.fontSize} ${computed.fontFamily}`;

    let maxTextWidth = 0;
    [...select.options].forEach(option => {
        const label = (option.textContent || "").trim();
        if (!label) return;
        maxTextWidth = Math.max(maxTextWidth, ctx.measureText(label).width);
    });

    const requiredWidth = Math.ceil(maxTextWidth + 72); // arrow + scrollbar + safety gap
    const currentWidth = parseInt(select.dataset.minWidth || "", 10);
    const baseMinWidth = Number.isFinite(currentWidth)
        ? currentWidth
        : (parseInt(select.style.width || "", 10) || minWidth || 0);
    if (!Number.isFinite(currentWidth)) select.dataset.minWidth = String(baseMinWidth);

    select.style.width = `${Math.max(baseMinWidth, requiredWidth)}px`;
}

function refreshSelectWidths() {
    adjustSelectWidthForContent(document.getElementById("tz-quick-select"), 118);
    adjustSelectWidthForContent(document.getElementById("base-time-select"), 200);
}

function renderBaseTimeSelect() {
    const select = document.getElementById("base-time-select");
    if (!select) return;

    ensureBaseTimezoneSelection();
    const selectedBefore = getCurrentGroupBaseTimezoneId();
    select.textContent = "";

    const includeUtcOption = selectedBefore === "utc" || isCurrentGroupUtcRowVisible();
    if (includeUtcOption) {
        const utcOption = document.createElement("option");
        utcOption.value = "utc";
        utcOption.textContent = `[UTC] ${t("utc_name")}`;
        select.appendChild(utcOption);
    }

    getCurrentGroupZones().forEach(tz => {
        const option = document.createElement("option");
        option.value = tz.id;
        option.textContent = `[${getZoneAbbreviation(tz)}] ${getZoneDisplayName(tz)}`;
        select.appendChild(option);
    });

    const selectedNext = [...select.options].some(o => o.value === selectedBefore)
        ? selectedBefore
        : (select.options[0]?.value || "utc");
    setCurrentGroupBaseTimezoneId(selectedNext);
    select.value = selectedNext;
    if (selectedNext !== selectedBefore) savePersistence();
    adjustSelectWidthForContent(select, 220);
}

function createTimeAdjustActionButton(labelKey, slotIdx, action, onAction = applyTimeAdjustAction, disabled = false) {
    return timeAdjustUiService.createTimeAdjustActionButton(labelKey, slotIdx, action, onAction, disabled);
}

function createTimeAdjustDivider() {
    return timeAdjustUiService.createTimeAdjustDivider();
}

function attachTimeAdjustToggleLabel(setEl, checked, text, onChange) {
    return timeAdjustUiService.attachTimeAdjustToggleLabel(setEl, checked, text, onChange);
}

function sanitizeTimeAdjustDayStep(value) {
    return timeAdjustUiService.sanitizeTimeAdjustDayStep(value);
}

function getTimeAdjustDayStep(slotIdx) {
    return timeAdjustUiService.getTimeAdjustDayStep(slotIdx);
}

function setTimeAdjustDayStep(slotIdx, value) {
    return timeAdjustUiService.setTimeAdjustDayStep(slotIdx, value);
}

function createTimeAdjustCustomDaysControl(slotIdx, onAction = applyTimeAdjustAction, disabled = false) {
    return timeAdjustUiService.createTimeAdjustCustomDaysControl(slotIdx, onAction, disabled);
}

function renderTimeAdjustSet(slotIdx, options = {}) {
    return timeAdjustUiService.renderTimeAdjustSet(slotIdx, options);
}

function updateTimeAdjustPanel() {
    return timeAdjustUiService.updateTimeAdjustPanel();
}

function getCopyFieldLabel(key) {
    return formatControlsService.getCopyFieldLabel(key);
}

function getTimePartLabel(partKey) {
    return formatControlsService.getTimePartLabel(partKey);
}

function closeAllTimePartsMenus() {
    return formatControlsService.closeAllTimePartsMenus();
}

function bindTimePartsOutsideClickHandler() {
    return formatControlsService.bindTimePartsOutsideClickHandler();
}

function getCopyFormatDropTarget(container, x, y = null) {
    return formatControlsService.getCopyFormatDropTarget(container, x, y);
}

function renderFormatControlList(list, order, enabled, options = {}) {
    return formatControlsService.renderFormatControlList(list, order, enabled, options);
}

function renderCopyFormatControls() {
    return formatControlsService.renderCopyFormatControls();
}

function getDisplayColumns(effectiveSlotCount) {
    return tableRenderService.getDisplayColumns(effectiveSlotCount);
}

function getDisplayTimeInputMode() {
    return tableRenderService.getDisplayTimeInputMode();
}

function buildTimeColumnCell(slotIdx, slotCountToRender, options = {}) {
    return tableRenderService.buildTimeColumnCell(slotIdx, slotCountToRender, options);
}

function getDisplayColumnHeader(colKey) {
    return tableRenderService.getDisplayColumnHeader(colKey);
}

function getMultiDisplayColumnHeader(colKey) {
    return tableRenderService.getMultiDisplayColumnHeader(colKey);
}

function buildStaticRowCell(colKey, slotCountToRender, zoneNameHtml = "") {
    return tableRenderService.buildStaticRowCell(colKey, slotCountToRender, zoneNameHtml);
}

function buildDynamicRowCell(colKey, slotCountToRender) {
    return tableRenderService.buildDynamicRowCell(colKey, slotCountToRender);
}

function buildRowActionCells(copyButtonTitle, removeButtonText, removeButtonTitle = "") {
    return tableRenderService.buildRowActionCells(copyButtonTitle, removeButtonText, removeButtonTitle);
}

function createInteractiveTimezoneRow(tz, effectiveSlotCount, displayColumns, rowId = tz.id) {
    return tableRenderService.createInteractiveTimezoneRow(tz, effectiveSlotCount, displayColumns, rowId);
}

function getRenderableTimezoneRows(baseRef) {
    return tableRenderService.getRenderableTimezoneRows(baseRef);
}

function getTimezoneDisplayPointAtDate(date, tz, fixedDisplayOffsetMinutes = null) {
    return multiRangeRenderService.getTimezoneDisplayPointAtDate(date, tz, fixedDisplayOffsetMinutes);
}

function buildTimezoneComputedSnapshotForRange(tz, startDate, endDate) {
    return multiRangeRenderService.buildTimezoneComputedSnapshotForRange(tz, startDate, endDate);
}

function applySnapshotToRow(row, snapshot) {
    return multiRangeRenderService.applySnapshotToRow(row, snapshot);
}

function formatRangeDurationText(startUtcMs, endUtcMs) {
    return multiRangeRenderService.formatRangeDurationText(startUtcMs, endUtcMs);
}

function getMultiRangeTitleText(rangeIdx, range, baseRef) {
    return multiRangeRenderService.getMultiRangeTitleText(rangeIdx, range, baseRef);
}

function createMultiRangeTableRow(tz, options = {}) {
    return multiRangeRenderService.createMultiRangeTableRow(tz, options);
}

function renderMultiRanges() {
    return multiRangeRenderService.renderMultiRanges();
}

// --- Group Management ---
function activateGroupTab(idx) {
    return groupTabsService.activateGroupTab(idx);
}

function addGroup() {
    return groupTabsService.addGroup();
}

function renderGroups() {
    return groupTabsService.renderGroups();
}

function renameGroup(idx) {
    return groupTabsService.renameGroup(idx);
}

function activateMultiSubgroup(subgroupId) {
    return groupTabsService.activateMultiSubgroup(subgroupId);
}

function addMultiSubgroup() {
    return groupTabsService.addMultiSubgroup();
}

function renameMultiSubgroup(subgroupId) {
    return groupTabsService.renameMultiSubgroup(subgroupId);
}

function deleteMultiSubgroup(subgroupId) {
    return groupTabsService.deleteMultiSubgroup(subgroupId);
}

function renderMultiSubgroups() {
    return groupTabsService.renderMultiSubgroups();
}

// --- List Rendering (Dynamic Slots) ---
function renderList() {
    return tableRenderService.renderList();
}
// --- Exact Abbr Mapping (Expanded) ---
const ZONE_MAP = {
    "Asia/Seoul": "KST", "Asia/Tokyo": "JST", "Asia/Shanghai": "CST", "Asia/Hong_Kong": "HKT",
    "Asia/Singapore": "SGT", "Asia/Taipei": "CST", "Asia/Bangkok": "ICT", "Asia/Dubai": "GST",
    "Europe/Paris": ["CET", "CEST"], "Europe/London": ["GMT", "BST"], "Europe/Berlin": ["CET", "CEST"],
    "Europe/Moscow": "MSK", "Europe/Istanbul": "TRT", "America/New_York": ["EST", "EDT"],
    "America/Chicago": ["CST", "CDT"], "America/Los_Angeles": ["PST", "PDT"], "America/Sao_Paulo": "BRT",
    "Australia/Sydney": ["AEST", "AEDT"], "Australia/Perth": "AWST", "Pacific/Auckland": ["NZST", "NZDT"], "UTC": "UTC"
};

function getBetterAbbr(zone, date) {
    if (zone === "UTC") return "UTC";
    const mapping = ZONE_MAP[zone];
    let abbr = "";
    if (mapping) {
        abbr = (typeof mapping === "string") ? mapping : (isTimeZoneInDST(zone, date) ? mapping[1] : mapping[0]);
    } else {
        abbr = new Intl.DateTimeFormat("en-US", { timeZone: zone, timeZoneName: "short" }).formatToParts(date).find(p => p.type === "timeZoneName")?.value || "";
    }
    return abbr.replace("GMT", "UTC");
}

function isTimeZoneInDST(zone, date) {
    try {
        const year = date.getUTCFullYear();
        // Use UTC-noon anchors to avoid local-timezone side effects near midnight boundaries.
        const jan = new Date(Date.UTC(year, 0, 1, 12, 0, 0));
        const jul = new Date(Date.UTC(year, 6, 1, 12, 0, 0));
        const janOffset = getTimezoneOffset(zone, jan);
        const julOffset = getTimezoneOffset(zone, jul);
        const standardOffset = Math.min(janOffset, julOffset);
        return getTimezoneOffset(zone, date) !== standardOffset;
    } catch (e) { return false; }
}

function getTimezoneOffset(zone, date) {
    try {
        const parts = new Intl.DateTimeFormat("en-US", { timeZone: zone, timeZoneName: "longOffset" }).formatToParts(date);
        const offStr = parts.find(p => p.type === "timeZoneName")?.value || "GMT+0";
        const m = offStr.match(/[+-](\d{1,2}):?(\d{2})?/);
        if (!m) return 0;
        const sign = offStr.includes("+") ? 1 : -1;
        return sign * (parseInt(m[1]) * 60 + parseInt(m[2] || 0));
    } catch (err) {
        return 0;
    }
}

function getFixedOffsetForDisplayAtDate(tz, anchorDate) {
    if (!tz || tz.type !== "standard" || !tz.zone || tz.zone === "UTC") return null;
    const raw = tz.fixedOffsetMinutes;
    if (raw === null || raw === undefined) return null;
    if (typeof raw === "string" && !raw.trim()) return null;
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return null;
    return Math.min(14 * 60, Math.max(-14 * 60, Math.trunc(parsed)));
}

function getFixedOffsetForDisplay(tz) {
    return getFixedOffsetForDisplayAtDate(tz, globalTimes[0]);
}

function pad(v) { return GTV_TIME_CORE.pad(v); }

function getCustomOffsetMinutes(tz) {
    return GTV_TIME_CORE.getCustomOffsetMinutes(tz);
}

function getSignedInclusiveDaySpan(mainDateTimeStr, extraDateTimeStr) {
    const parseDateOnly = (dateTimeStr) => {
        const dateStr = (dateTimeStr || "").split(" ")[0] || "";
        const m = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (!m) return null;
        return Date.UTC(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10));
    };

    const tA = parseDateOnly(mainDateTimeStr);
    const tB = parseDateOnly(extraDateTimeStr);
    if (tA === null || tB === null) return null;

    const dayMagnitude = Math.floor(Math.abs(tB - tA) / 86400000) + 1;
    const sign = extraDateTimeStr >= mainDateTimeStr ? 1 : -1;
    return sign * dayMagnitude;
}

function getSignedDurationDayHourMinute(mainDateTimeStr, extraDateTimeStr) {
    const parseDateTimeToUtcMs = (dateTimeStr) => {
        const m = (dateTimeStr || "").trim().match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
        if (!m) return null;
        return Date.UTC(
            parseInt(m[1], 10),
            parseInt(m[2], 10) - 1,
            parseInt(m[3], 10),
            parseInt(m[4], 10),
            parseInt(m[5], 10),
            parseInt(m[6], 10)
        );
    };

    const tA = parseDateTimeToUtcMs(mainDateTimeStr);
    const tB = parseDateTimeToUtcMs(extraDateTimeStr);
    if (tA === null || tB === null) return null;

    const diffMs = tB - tA;
    const sign = diffMs < 0 ? "-" : "";
    const totalMinutes = Math.floor(Math.abs(diffMs) / 60000);
    const day = Math.floor(totalMinutes / 1440);
    const hour = Math.floor((totalMinutes % 1440) / 60);
    const minute = totalMinutes % 60;

    if (currentLang === "ko") {
        return `${sign}${day}\uC77C ${hour}\uC2DC\uAC04 ${minute}\uBD84`;
    }
    return `${sign}${day}d ${hour}h ${minute}m`;
}

function getLocalPartsByTimezone(date, tz, fixedOffsetMinutes = null) {
    if (tz.type === "custom") {
        const offsetMin = getCustomOffsetMinutes(tz);
        const shifted = new Date(date.getTime() + (offsetMin * 60000));
        return {
            year: shifted.getUTCFullYear(),
            month: shifted.getUTCMonth() + 1,
            day: shifted.getUTCDate(),
            hour: shifted.getUTCHours(),
            minute: shifted.getUTCMinutes(),
            second: shifted.getUTCSeconds()
        };
    }

    if (Number.isFinite(fixedOffsetMinutes)) {
        const shifted = new Date(date.getTime() + (fixedOffsetMinutes * 60000));
        return {
            year: shifted.getUTCFullYear(),
            month: shifted.getUTCMonth() + 1,
            day: shifted.getUTCDate(),
            hour: shifted.getUTCHours(),
            minute: shifted.getUTCMinutes(),
            second: shifted.getUTCSeconds()
        };
    }

    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: tz.zone || "UTC",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false
    });
    const parts = formatter.formatToParts(date);
    const get = type => parts.find(p => p.type === type)?.value || "0";
    const hour = parseInt(get("hour"), 10);
    return {
        year: parseInt(get("year"), 10),
        month: parseInt(get("month"), 10),
        day: parseInt(get("day"), 10),
        hour: hour === 24 ? 0 : hour,
        minute: parseInt(get("minute"), 10),
        second: parseInt(get("second"), 10)
    };
}

function getUTCDateFromLocalParts(parts, tz, fixedOffsetMinutes = null) {
    const utcMs = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
    if (tz.type === "custom") {
        const offsetMin = getCustomOffsetMinutes(tz);
        return new Date(utcMs - (offsetMin * 60000));
    }
    if (!tz.zone || tz.zone === "UTC") return new Date(utcMs);
    if (Number.isFinite(fixedOffsetMinutes)) {
        return new Date(utcMs - (fixedOffsetMinutes * 60000));
    }
    const tempUTC = new Date(utcMs);
    const offMs = getTimezoneOffset(tz.zone, tempUTC) * 60000;
    return new Date(utcMs - offMs);
}

function shiftLocalParts(parts, delta = {}) {
    const d = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second));
    if (delta.hours) d.setUTCHours(d.getUTCHours() + delta.hours);
    if (delta.days) d.setUTCDate(d.getUTCDate() + delta.days);
    if (delta.weeks) d.setUTCDate(d.getUTCDate() + (delta.weeks * 7));
    return {
        year: d.getUTCFullYear(),
        month: d.getUTCMonth() + 1,
        day: d.getUTCDate(),
        hour: d.getUTCHours(),
        minute: d.getUTCMinutes(),
        second: d.getUTCSeconds()
    };
}

function applyTimeAdjustAction(slotIdx, action) {
    if (isRealtime) return;

    if (action === "now") {
        globalTimes[slotIdx] = new Date();
        updateClocks();
        return;
    }

    const baseRef = getBaseTimezoneRef();
    const fixedOffsetMinutes = getFixedOffsetForDisplay(baseRef);
    let parts = getLocalPartsByTimezone(globalTimes[slotIdx], baseRef, fixedOffsetMinutes);

    switch (action) {
        case "midnight":
            parts.hour = 0;
            parts.minute = 0;
            parts.second = 0;
            break;
        case "sharp_hour":
            parts.minute = 0;
            parts.second = 0;
            break;
        case "plus_hour":
            parts = shiftLocalParts(parts, { hours: 1 });
            break;
        case "minus_hour":
            parts = shiftLocalParts(parts, { hours: -1 });
            break;
        case "plus_day":
            parts = shiftLocalParts(parts, { days: 1 });
            break;
        case "minus_day":
            parts = shiftLocalParts(parts, { days: -1 });
            break;
        case "plus_week":
            parts = shiftLocalParts(parts, { weeks: 1 });
            break;
        case "minus_week":
            parts = shiftLocalParts(parts, { weeks: -1 });
            break;
        case "plus_four_weeks":
            parts = shiftLocalParts(parts, { weeks: 4 });
            break;
        case "minus_four_weeks":
            parts = shiftLocalParts(parts, { weeks: -4 });
            break;
        case "set_zero_day":
            if (slotIdx !== 1) return;
            globalTimes[1] = new Date(globalTimes[0].getTime());
            updateClocks();
            return;
        case "plus_custom_days":
            parts = shiftLocalParts(parts, { days: getTimeAdjustDayStep(slotIdx) });
            break;
        case "minus_custom_days":
            parts = shiftLocalParts(parts, { days: -getTimeAdjustDayStep(slotIdx) });
            break;
        default:
            return;
    }

    globalTimes[slotIdx] = getUTCDateFromLocalParts(parts, baseRef, fixedOffsetMinutes);
    updateClocks();
}

function getAdjustedUtcDateByAction(baseDate, action, slotIdx, baseRef, fixedOffsetMinutes) {
    if (!(baseDate instanceof Date) || !Number.isFinite(baseDate.getTime())) return null;

    if (action === "now") return new Date();

    let parts = getLocalPartsByTimezone(baseDate, baseRef, fixedOffsetMinutes);
    switch (action) {
        case "midnight":
            parts.hour = 0;
            parts.minute = 0;
            parts.second = 0;
            break;
        case "sharp_hour":
            parts.minute = 0;
            parts.second = 0;
            break;
        case "plus_hour":
            parts = shiftLocalParts(parts, { hours: 1 });
            break;
        case "minus_hour":
            parts = shiftLocalParts(parts, { hours: -1 });
            break;
        case "plus_day":
            parts = shiftLocalParts(parts, { days: 1 });
            break;
        case "minus_day":
            parts = shiftLocalParts(parts, { days: -1 });
            break;
        case "plus_week":
            parts = shiftLocalParts(parts, { weeks: 1 });
            break;
        case "minus_week":
            parts = shiftLocalParts(parts, { weeks: -1 });
            break;
        case "plus_four_weeks":
            parts = shiftLocalParts(parts, { weeks: 4 });
            break;
        case "minus_four_weeks":
            parts = shiftLocalParts(parts, { weeks: -4 });
            break;
        case "plus_custom_days":
            parts = shiftLocalParts(parts, { days: getTimeAdjustDayStep(slotIdx) });
            break;
        case "minus_custom_days":
            parts = shiftLocalParts(parts, { days: -getTimeAdjustDayStep(slotIdx) });
            break;
        default:
            return null;
    }
    return getUTCDateFromLocalParts(parts, baseRef, fixedOffsetMinutes);
}

function applyBulkRangeStartAction(slotIdx, action) {
    ensureMultiRangeState();
    if (!multiRanges.length) return;

    const baseRef = getBaseTimezoneRef();
    const anchorDate = new Date(multiRanges[0].startUtcMs);
    const fixedOffsetMinutes = getFixedOffsetForDisplayAtDate(baseRef, anchorDate);
    const adjustedFirstStart = getAdjustedUtcDateByAction(new Date(multiRanges[0].startUtcMs), action, slotIdx, baseRef, fixedOffsetMinutes);
    if (!(adjustedFirstStart instanceof Date) || !Number.isFinite(adjustedFirstStart.getTime())) return;

    const durations = multiRanges.map((range) => range.endUtcMs - range.startUtcMs);
    let cursor = adjustedFirstStart.getTime();
    multiRanges = multiRanges.map((range, idx) => {
        const startUtcMs = cursor;
        const endUtcMs = startUtcMs + durations[idx];
        cursor = endUtcMs;
        return { startUtcMs, endUtcMs };
    });

    if (isMultiTab()) renderMultiRanges();
    savePersistence();
}

function applyBulkRangeAllAction(slotIdx, action) {
    ensureMultiRangeState();
    if (!multiRanges.length) return;

    const baseDurations = multiRanges.map((range) => range.endUtcMs - range.startUtcMs);
    let nextDurations = [];

    if (action === "set_zero_day") {
        nextDurations = baseDurations.map(() => 0);
    } else {
        let deltaMs = 0;
        switch (action) {
            case "plus_hour":
                deltaMs = 60 * 60 * 1000;
                break;
            case "minus_hour":
                deltaMs = -60 * 60 * 1000;
                break;
            case "plus_day":
                deltaMs = 24 * 60 * 60 * 1000;
                break;
            case "minus_day":
                deltaMs = -24 * 60 * 60 * 1000;
                break;
            case "plus_week":
                deltaMs = 7 * 24 * 60 * 60 * 1000;
                break;
            case "minus_week":
                deltaMs = -7 * 24 * 60 * 60 * 1000;
                break;
            case "plus_four_weeks":
                deltaMs = 28 * 24 * 60 * 60 * 1000;
                break;
            case "minus_four_weeks":
                deltaMs = -28 * 24 * 60 * 60 * 1000;
                break;
            case "plus_custom_days":
                deltaMs = getTimeAdjustDayStep(slotIdx) * 24 * 60 * 60 * 1000;
                break;
            case "minus_custom_days":
                deltaMs = -getTimeAdjustDayStep(slotIdx) * 24 * 60 * 60 * 1000;
                break;
            default:
                return;
        }
        nextDurations = baseDurations.map((durationMs) => durationMs + deltaMs);
    }

    let cursor = sanitizeUtcMs(multiRanges[0]?.startUtcMs, Date.now());
    for (let idx = 0; idx < multiRanges.length; idx++) {
        const current = multiRanges[idx];
        if (!current) continue;
        if (idx === 0 || isMultiRangeStartLinked(idx)) {
            current.startUtcMs = cursor;
        } else {
            current.startUtcMs = sanitizeUtcMs(current.startUtcMs, cursor);
        }
        current.endUtcMs = current.startUtcMs + (nextDurations[idx] ?? 0);
        cursor = current.endUtcMs;
    }

    if (isMultiTab()) renderMultiRanges();
    savePersistence();
}

function applyMultiRangeTimeAdjustAction(rangeIdx, slotIdx, action) {
    if (!isMultiTab()) return;
    if (rangeIdx > 0 && slotIdx === 0 && !isMultiRangeStartEditEnabled(rangeIdx)) return;
    if (slotIdx === 1 && !isMultiRangeEndEditEnabled(rangeIdx)) return;

    ensureMultiRangeState();
    const range = multiRanges[rangeIdx];
    if (!range) return;

    if (slotIdx === 0 && action === "sync_prev_end") {
        if (rangeIdx <= 0) return;
        const durationSnapshot = multiRanges.map((item) => item.endUtcMs - item.startUtcMs);
        range.startUtcMs = multiRanges[rangeIdx - 1].endUtcMs;
        syncLinkedRangesFrom(rangeIdx, {
            includeCurrent: true,
            stopAtFirstUnlocked: true,
            baseDurations: durationSnapshot
        });
    } else if (slotIdx === 1 && action === "set_zero_day") {
        range.endUtcMs = range.startUtcMs;
    } else {
        const baseRef = getBaseTimezoneRef();
        const anchorDate = new Date(range.startUtcMs);
        const fixedOffsetMinutes = getFixedOffsetForDisplayAtDate(baseRef, anchorDate);
        const baseDate = getMultiRangeSlotDate(rangeIdx, slotIdx);
        const nextUtcDate = getAdjustedUtcDateByAction(baseDate, action, slotIdx, baseRef, fixedOffsetMinutes);
        if (!(nextUtcDate instanceof Date) || !Number.isFinite(nextUtcDate.getTime())) return;
        setMultiRangeSlotDate(rangeIdx, slotIdx, nextUtcDate);
    }

    if (slotIdx === 1) {
        syncFollowingRangesByDuration(rangeIdx);
    } else if (rangeIdx === 0) {
        syncMultiRangeStartLinks(1);
    }

    renderMultiRanges();
    savePersistence();
}

function clampNumber(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function isTimelineSupportedTab() {
    return currentMainTab === "live" || currentMainTab === "fixed";
}

function shouldRenderTimeline() {
    return !!showTimeline && isTimelineSupportedTab() && !isMultiTab();
}

function stopTimelineDrag() {
    if (!timelineDragState) return;
    const state = timelineDragState;
    timelineDragState = null;
    if (state.rafId) {
        cancelUiFrame(state.rafId);
    }
    if (state.trackBody) {
        state.trackBody.removeEventListener("pointermove", state.onPointerMove);
        state.trackBody.removeEventListener("pointerup", state.onPointerUp);
        state.trackBody.removeEventListener("pointercancel", state.onPointerCancel);
        if (
            Number.isInteger(state.pointerId) &&
            typeof state.trackBody.hasPointerCapture === "function" &&
            state.trackBody.hasPointerCapture(state.pointerId)
        ) {
            try {
                state.trackBody.releasePointerCapture(state.pointerId);
            } catch (_) {
                // Ignore pointer capture release failures during rerender/dispose.
            }
        }
    }
}

function getTimelineRows(baseRef) {
    const rowsToRender = getCurrentGroupZones().filter(
        (tz) => tz.id !== baseRef.id && !(tz.type === "standard" && tz.zone === "UTC")
    );
    if (baseRef.id !== "utc" && isCurrentGroupUtcRowVisible()) {
        const insertIndex = Math.min(Math.max(getCurrentGroupUtcRowOrder(), 0), rowsToRender.length);
        rowsToRender.splice(insertIndex, 0, getUTCRef());
    }
    return [baseRef, ...rowsToRender];
}

function getTimelineBaseLocalContext(slotIdx, baseRef) {
    const sourceDate = (globalTimes[slotIdx] instanceof Date && Number.isFinite(globalTimes[slotIdx].getTime()))
        ? globalTimes[slotIdx]
        : new Date();
    const fixedOffsetMinutes = getFixedOffsetForDisplayAtDate(baseRef, sourceDate);
    const parts = getLocalPartsByTimezone(sourceDate, baseRef, fixedOffsetMinutes);
    return { sourceDate, fixedOffsetMinutes, parts };
}

function getTimelineHourRatio(slotIdx, baseRef) {
    const { parts } = getTimelineBaseLocalContext(slotIdx, baseRef);
    const totalSeconds = (parts.hour * 3600) + (parts.minute * 60) + parts.second;
    if (totalSeconds <= 0) return 0;
    if (totalSeconds >= (TIMELINE_TOTAL_SECONDS - 1)) return 1;
    return clampNumber(totalSeconds / TIMELINE_TOTAL_SECONDS, 0, 1);
}

function getTimelineBaseDayStartUtc(slotIdx, baseRef) {
    const { fixedOffsetMinutes, parts } = getTimelineBaseLocalContext(slotIdx, baseRef);
    const dayStartParts = {
        year: parts.year,
        month: parts.month,
        day: parts.day,
        hour: 0,
        minute: 0,
        second: 0
    };
    return getUTCDateFromLocalParts(dayStartParts, baseRef, fixedOffsetMinutes);
}

function getTimelineRatioFromClientX(trackBody, clientX) {
    const boxRow = trackBody?.querySelector(".timeline-box-row");
    if (!boxRow) return 0;
    const rect = boxRow.getBoundingClientRect();
    if (!(rect.width > 0)) return 0;
    const clamped = clampNumber(clientX - rect.left, 0, rect.width);
    return clampNumber(clamped / rect.width, 0, 1);
}

function positionTimelineIndicator(trackBody, indicatorEl, ratio) {
    if (!trackBody || !indicatorEl) return false;
    const boxRow = trackBody.querySelector(".timeline-box-row");
    if (!boxRow) return false;
    const width = boxRow.clientWidth;
    if (!(width > 0)) return false;
    const rawLeft = boxRow.offsetLeft + (width * clampNumber(ratio, 0, 1));
    const minLeft = boxRow.offsetLeft;
    const maxLeft = boxRow.offsetLeft + width;
    const left = clampNumber(rawLeft, minLeft, maxLeft);
    indicatorEl.style.left = `${Math.round(left)}px`;
    return true;
}

function applyTimelineRatioToSlot(slotIdx, ratio, baseRef) {
    if (isRealtime) return;
    const sourceDate = (globalTimes[slotIdx] instanceof Date && Number.isFinite(globalTimes[slotIdx].getTime()))
        ? globalTimes[slotIdx]
        : new Date();
    const fixedOffsetMinutes = getFixedOffsetForDisplayAtDate(baseRef, sourceDate);
    const parts = getLocalPartsByTimezone(sourceDate, baseRef, fixedOffsetMinutes);

    const totalSeconds = Math.min(
        TIMELINE_TOTAL_SECONDS - 1,
        Math.max(0, Math.round(clampNumber(ratio, 0, 1) * TIMELINE_TOTAL_SECONDS))
    );
    parts.hour = Math.floor(totalSeconds / 3600);
    parts.minute = Math.floor((totalSeconds % 3600) / 60);
    parts.second = totalSeconds % 60;

    globalTimes[slotIdx] = getUTCDateFromLocalParts(parts, baseRef, fixedOffsetMinutes);
    updateClocks();
}

function bindTimelineDrag(trackBody, indicatorEl, slotIdx, baseRef) {
    if (!(trackBody instanceof HTMLElement) || !(indicatorEl instanceof HTMLElement)) return;

    trackBody.addEventListener("pointerdown", (event) => {
        if (isRealtime || event.button !== 0) return;
        event.preventDefault();
        stopTimelineDrag();

        const state = {
            trackBody,
            indicatorEl,
            slotIdx,
            baseRef,
            pointerId: event.pointerId,
            pendingRatio: null,
            lastRatio: null,
            rafId: 0,
            onPointerMove: null,
            onPointerUp: null,
            onPointerCancel: null
        };

        const renderPendingRatio = () => {
            state.rafId = 0;
            if (state.pendingRatio === null) return;
            state.lastRatio = state.pendingRatio;
            positionTimelineIndicator(state.trackBody, state.indicatorEl, state.pendingRatio);
            applyTimelineRatioToSlot(state.slotIdx, state.pendingRatio, state.baseRef);
        };

        const queueRatioRender = (clientX) => {
            state.pendingRatio = getTimelineRatioFromClientX(state.trackBody, clientX);
            if (state.rafId) return;
            state.rafId = requestUiFrame(renderPendingRatio);
        };

        state.onPointerMove = (moveEvent) => {
            if (moveEvent.pointerId !== state.pointerId) return;
            moveEvent.preventDefault();
            queueRatioRender(moveEvent.clientX);
        };

        state.onPointerCancel = (cancelEvent) => {
            if (cancelEvent.pointerId !== state.pointerId) return;
            stopTimelineDrag();
        };

        state.onPointerUp = (upEvent) => {
            if (upEvent.pointerId !== state.pointerId) return;
            upEvent.preventDefault();
            if (state.rafId) {
                cancelUiFrame(state.rafId);
                renderPendingRatio();
            }
            const finalRatio = (state.pendingRatio !== null)
                ? state.pendingRatio
                : ((state.lastRatio !== null) ? state.lastRatio : getTimelineRatioFromClientX(state.trackBody, upEvent.clientX));
            stopTimelineDrag();
            applyTimelineRatioToSlot(state.slotIdx, finalRatio, state.baseRef);
        };

        timelineDragState = state;
        queueRatioRender(event.clientX);

        trackBody.addEventListener("pointermove", state.onPointerMove);
        trackBody.addEventListener("pointerup", state.onPointerUp);
        trackBody.addEventListener("pointercancel", state.onPointerCancel);
        if (typeof trackBody.setPointerCapture === "function") {
            try {
                trackBody.setPointerCapture(state.pointerId);
            } catch (_) {
                // Ignore pointer capture failures for unsupported environments.
            }
        }
    });
}

function createTimelineAxisTrack() {
    const axisTrack = document.createElement("div");
    axisTrack.className = "timeline-axis-track";
    for (let hour = 0; hour <= TIMELINE_TOTAL_HOURS; hour += 3) {
        const tick = document.createElement("span");
        tick.className = "timeline-axis-mark";
        if (hour === TIMELINE_TOTAL_HOURS) tick.classList.add("last");
        tick.style.left = `${(hour / TIMELINE_TOTAL_HOURS) * 100}%`;
        tick.textContent = String(hour === TIMELINE_TOTAL_HOURS ? 0 : hour);
        axisTrack.appendChild(tick);
    }
    return axisTrack;
}

function createTimelineRow(slotIdx, tz, baseDayStartUtcMs) {
    const row = document.createElement("div");
    row.className = "timeline-timezone-row";

    const labelEl = document.createElement("div");
    labelEl.className = "timeline-label";
    const labelText = getZoneDisplayName(tz);
    labelEl.textContent = labelText;
    row.appendChild(labelEl);

    const boxRow = document.createElement("div");
    boxRow.className = "timeline-box-row";
    for (let hourIdx = 0; hourIdx < TIMELINE_TOTAL_HOURS; hourIdx++) {
        const utcMs = baseDayStartUtcMs + (hourIdx * 60 * 60 * 1000);
        const utcPoint = new Date(utcMs);
        const fixedOffsetMinutes = getFixedOffsetForDisplayAtDate(tz, utcPoint);
        const localParts = getLocalPartsByTimezone(utcPoint, tz, fixedOffsetMinutes);
        const localHour = localParts.hour;
        const isDay = (localHour >= 6 && localHour < 18);

        const box = document.createElement("div");
        box.className = `timeline-hour-box ${isDay ? "day" : "night"}`;

        const isDayBoundary = localHour === 6 || localHour === 17;
        const isNightBoundary = localHour === 18 || localHour === 5;
        if (isDayBoundary || isNightBoundary) {
            const icon = document.createElement("span");
            icon.className = "timeline-hour-icon";
            icon.textContent = isDayBoundary ? "\u2600\uFE0F" : "🌙";
            box.appendChild(icon);
        }

        boxRow.appendChild(box);
    }

    row.appendChild(boxRow);
    return row;
}

function createTimelinePanel(slotIdx, baseRef, rows, panelCount) {
    const panel = document.createElement("section");
    panel.className = "timeline-panel";

    if (panelCount > 1) {
        const title = document.createElement("h3");
        title.className = `timeline-panel-title ${slotIdx === 0 ? "start" : "end"}`;
        title.textContent = t(slotIdx === 0 ? "th_time_day_start" : "th_time_day_end");
        panel.appendChild(title);
    }

    const scroll = document.createElement("div");
    scroll.className = "timeline-scroll";

    const grid = document.createElement("div");
    grid.className = "timeline-grid";

    const axisRow = document.createElement("div");
    axisRow.className = "timeline-axis-row";

    const axisSpacer = document.createElement("div");
    axisSpacer.className = "timeline-label timeline-axis-spacer";
    axisRow.appendChild(axisSpacer);
    axisRow.appendChild(createTimelineAxisTrack());

    const trackBody = document.createElement("div");
    trackBody.className = "timeline-track-body";

    const baseDayStartUtc = getTimelineBaseDayStartUtc(slotIdx, baseRef);
    const baseDayStartUtcMs = baseDayStartUtc.getTime();
    rows.forEach((tz) => {
        trackBody.appendChild(createTimelineRow(slotIdx, tz, baseDayStartUtcMs));
    });

    const indicator = document.createElement("div");
    indicator.className = `timeline-indicator ${slotIdx === 0 ? "start" : "end"}`;
    trackBody.appendChild(indicator);

    grid.appendChild(axisRow);
    grid.appendChild(trackBody);
    scroll.appendChild(grid);
    panel.appendChild(scroll);

    if (!isRealtime) {
        trackBody.classList.add("draggable");
        bindTimelineDrag(trackBody, indicator, slotIdx, baseRef);
    }

    return panel;
}

function getTimelineRenderKey(baseRef, rows, panelCount) {
    const slotDayKeys = [];
    for (let slotIdx = 0; slotIdx < panelCount; slotIdx++) {
        const ctx = getTimelineBaseLocalContext(slotIdx, baseRef);
        const dayKey = `${ctx.parts.year}-${pad(ctx.parts.month)}-${pad(ctx.parts.day)}`;
        slotDayKeys.push(dayKey);
    }

    const rowKeys = rows.map((tz) => {
        const sourceDate = (globalTimes[0] instanceof Date && Number.isFinite(globalTimes[0].getTime()))
            ? globalTimes[0]
            : new Date();
        const fixedOffsetMinutes = getFixedOffsetForDisplayAtDate(tz, sourceDate);
        const offsetToken = Number.isFinite(fixedOffsetMinutes) ? String(fixedOffsetMinutes) : "auto";
        return `${tz.id}:${offsetToken}`;
    });

    return [
        currentMainTab,
        panelCount,
        baseRef.id,
        currentLang,
        currentTheme,
        rowKeys.join(","),
        slotDayKeys.join("|")
    ].join("::");
}

function refreshTimelineIndicators(frame, baseRef, panelCount) {
    let hasPositioned = false;
    for (let slotIdx = 0; slotIdx < panelCount; slotIdx++) {
        const panel = frame.querySelector(`.timeline-panel[data-slot="${slotIdx}"]`);
        if (!panel) continue;
        const trackBody = panel.querySelector(".timeline-track-body");
        const indicator = panel.querySelector(".timeline-indicator");
        if (!trackBody || !indicator) continue;
        const positioned = positionTimelineIndicator(trackBody, indicator, getTimelineHourRatio(slotIdx, baseRef));
        hasPositioned = hasPositioned || positioned;
    }
    return hasPositioned;
}

function scheduleTimelineIndicatorRefresh(frame, baseRef, panelCount, renderKey) {
    const refreshIfCurrent = () => {
        if (!frame?.isConnected) return false;
        if ((frame.getAttribute("data-render-key") || "") !== renderKey) return false;
        return refreshTimelineIndicators(frame, baseRef, panelCount);
    };

    requestUiFrame(() => {
        const positioned = refreshIfCurrent();
        if (positioned) return;
        requestUiFrame(() => {
            refreshIfCurrent();
        });
    });
}

function renderTimelineFrame() {
    const frame = document.getElementById("timeline-frame");
    if (!frame) return;

    const timelineSaveBtn = document.getElementById("save-timeline-image-btn");
    const multiTimelineSaveBtn = document.getElementById("save-image-multi-timeline-btn");

    if (!shouldRenderTimeline()) {
        stopTimelineDrag();
        frame.removeAttribute("data-render-key");
        frame.style.display = "none";
        frame.textContent = "";
        if (timelineSaveBtn) timelineSaveBtn.style.display = "none";
        if (multiTimelineSaveBtn) multiTimelineSaveBtn.style.display = "none";
        return;
    }

    if (timelineSaveBtn) timelineSaveBtn.style.display = "inline-block";
    if (multiTimelineSaveBtn) multiTimelineSaveBtn.style.display = "inline-block";

    const baseRef = getBaseTimezoneRef();
    const rows = getTimelineRows(baseRef);
    const panelCount = (!isRealtime && slotCount > 1) ? 2 : 1;
    const nextRenderKey = getTimelineRenderKey(baseRef, rows, panelCount);
    const currentRenderKey = frame.getAttribute("data-render-key") || "";

    if (isRealtime) {
        frame.classList.add("is-realtime");
    } else {
        frame.classList.remove("is-realtime");
    }

    frame.style.display = "block";
    if (currentRenderKey === nextRenderKey) {
        const positioned = refreshTimelineIndicators(frame, baseRef, panelCount);
        if (!positioned) {
            scheduleTimelineIndicatorRefresh(frame, baseRef, panelCount, nextRenderKey);
        }
        return;
    }

    stopTimelineDrag();
    frame.textContent = "";

    const panels = document.createElement("div");
    panels.className = `timeline-panels${panelCount > 1 ? " dual" : ""}`;

    for (let slotIdx = 0; slotIdx < panelCount; slotIdx++) {
        const panel = createTimelinePanel(slotIdx, baseRef, rows, panelCount);
        panel.dataset.slot = String(slotIdx);
        panels.appendChild(panel);
    }

    frame.setAttribute("data-render-key", nextRenderKey);
    frame.appendChild(panels);
    const positioned = refreshTimelineIndicators(frame, baseRef, panelCount);
    if (!positioned) {
        scheduleTimelineIndicatorRefresh(frame, baseRef, panelCount, nextRenderKey);
    }
}

// --- Clock Logic ---
function updateClocks() {
    if (isMultiTab()) {
        renderMultiRanges();
        renderTimelineFrame();
        return;
    }

    const baseRef = getBaseTimezoneRef();
    const utcRef = getUTCRef();
    updateRow(baseRef.id, baseRef);
    if (baseRef.id !== "utc") updateRow(utcRef.id, utcRef);
    const currentZones = getCurrentGroupZones().filter(tz => tz.id !== baseRef.id);
    currentZones.forEach(tz => updateRow(tz.id, tz));
    updateCopyFormatPreview();
    renderTimelineFrame();
}

function updateRow(id, tz) {
    const row = document.getElementById(`tz-row-${id}`);
    if (!row) return;

    let offsetStr = "";
    let zoneCodeMain = "";
    const fixedDisplayOffsetMinutes = getFixedOffsetForDisplay(tz);

    if (tz.type === "custom") {
        zoneCodeMain = normalizeCustomAbbr(tz.abbr);
        const offsetMin = getCustomOffsetMinutes(tz);
        const sign = offsetMin >= 0 ? "+" : "-";
        const absMin = Math.abs(offsetMin);
        const absHour = Math.floor(absMin / 60);
        const minPart = absMin % 60;
        offsetStr = `UTC${sign}${pad(absHour)}:${pad(minPart)}`;
    } else {
        if (Number.isFinite(fixedDisplayOffsetMinutes)) {
            const sign = fixedDisplayOffsetMinutes >= 0 ? "+" : "-";
            const absMin = Math.abs(fixedDisplayOffsetMinutes);
            const absHour = Math.floor(absMin / 60);
            const minPart = absMin % 60;
            offsetStr = `UTC${sign}${pad(absHour)}:${pad(minPart)}`;
        } else {
            const offF = new Intl.DateTimeFormat("en-US", { timeZone: tz.zone, timeZoneName: "longOffset" });
            let partsArr = offF.formatToParts(globalTimes[0]);
            let offVal = partsArr.find(p => p.type === "timeZoneName")?.value || "GMT+0";
            // Normalize to UTC+HH:mm (No GMT)
            const match = offVal.match(/[+-](\d{1,2}):?(\d{2})?/);
            if (match) {
                const sign = offVal.includes("+") ? "+" : "-";
                offsetStr = `UTC${sign}${pad(match[1])}:${pad(match[2] || 0)}`;
            } else {
                offsetStr = "UTC+00:00";
            }
        }
        zoneCodeMain = getZoneAbbreviation(tz, globalTimes[0]);
    }

    const zoneCodeEl = row.querySelector(".zone-code");
    const offsetTextEl = row.querySelector(".offset-text");
    if (zoneCodeEl) zoneCodeEl.textContent = zoneCodeMain;
    if (offsetTextEl) offsetTextEl.textContent = offsetStr;

    // Helper: updateDN inside updateRow
    const updateDN = (hour, el) => {
        if (!el) return;
        const isDay = (hour >= 6 && hour <= 18);
        el.textContent = isDay ? "\u2600\uFE0F" : "🌙";
        el.title = isDay ? t("dn_day") : t("dn_night");
    };

    const effectiveSlotCount = isRealtime ? 1 : slotCount;
    const slotTimeParts = [];
    for (let i = 0; i < effectiveSlotCount; i++) {
        let t;
        if (tz.type === "custom" || Number.isFinite(fixedDisplayOffsetMinutes)) {
            const curBase = globalTimes[i];
            const offsetMin = tz.type === "custom" ? getCustomOffsetMinutes(tz) : fixedDisplayOffsetMinutes;
            const tMs = curBase.getTime() + (offsetMin * 60000);
            t = new Date(tMs);
        } else {
            const f = new Intl.DateTimeFormat("en-US", {
                timeZone: tz.zone, year: "numeric", month: "numeric", day: "numeric",
                hour: "numeric", minute: "numeric", second: "numeric", weekday: "short", hour12: false
            });
            const parts = f.formatToParts(globalTimes[i]);
            const get = type => parts.find(p => p.type === type)?.value || "";
            const h = parseInt(get("hour"));
            t = {
                str: `${get("year")}-${pad(get("month"))}-${pad(get("day"))} ${pad(h === 24 ? 0 : h)}:${pad(get("minute"))}:${pad(get("second"))}`,
                dow: { "Sun": 0, "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6 }[get("weekday")]
            };
        }

        const inputs = [...row.querySelectorAll(`.time-input[data-slot="${i}"]`)];
        const dayBadges = [...row.querySelectorAll(`.day-slot-${i}`)];
        const dnIcons = [...row.querySelectorAll(`.dn-slot-${i}`)];

        let displayHour = 0;
        let displayDow = 0;
        let timeStr = "";

        if (t instanceof Date) {
            displayHour = t.getUTCHours();
            displayDow = t.getUTCDay();
            timeStr = `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())} ${pad(displayHour)}:${pad(t.getUTCMinutes())}:${pad(t.getUTCSeconds())}`;
        } else {
            displayHour = parseInt(t.str.split(" ")[1].split(":")[0]);
            displayDow = t.dow;
            timeStr = t.str;
        }

        const [dateStr, clockStrRaw] = timeStr.split(" ");
        const clockStr = (clockStrRaw || "").trim();
        inputs.forEach(input => {
            const inputMode = input.dataset.inputMode || "datetime";
            let nextValue = timeStr;
            if (inputMode === "date") nextValue = dateStr;
            else if (inputMode === "time") nextValue = clockStr;
            else if (inputMode === "none") nextValue = "";
            if (document.activeElement !== input) {
                input.value = nextValue;
            }
        });
        dayBadges.forEach(dayBadge => {
            dayBadge.textContent = I18N_DATA[currentLang].days[displayDow];
            dayBadge.className = "day-badge day-slot-" + i + " " + (displayDow === 0 ? "day-sun" : (displayDow === 6 ? "day-sat" : ""));
        });
        dnIcons.forEach(dnIcon => updateDN(displayHour, dnIcon));
        slotTimeParts.push(timeStr);
    }

    const periodEl = row.querySelector(".period-days-text");
    if (periodEl) {
        if (effectiveSlotCount > 1 && slotTimeParts.length > 1) {
            const spanDays = getSignedInclusiveDaySpan(slotTimeParts[0], slotTimeParts[1]);
            periodEl.textContent = spanDays === null ? "-" : `${spanDays}${t("unit_days_suffix")}`;
        } else {
            periodEl.textContent = "-";
        }
    }

    const periodTimeEl = row.querySelector(".period-time-text");
    if (periodTimeEl) {
        if (effectiveSlotCount > 1 && slotTimeParts.length > 1) {
            const spanTime = getSignedDurationDayHourMinute(slotTimeParts[0], slotTimeParts[1]);
            periodTimeEl.textContent = spanTime === null ? "-" : spanTime;
        } else {
            periodTimeEl.textContent = "-";
        }
    }
}

function resolveLocalDatePartsByTimezoneAtDate(timezone, utcDate, timezoneId = null) {
    const sourceDate = (utcDate instanceof Date && Number.isFinite(utcDate.getTime()))
        ? utcDate
        : new Date();

    if (timezone === "UTC") {
        return {
            Y: sourceDate.getUTCFullYear(),
            M: sourceDate.getUTCMonth() + 1,
            D: sourceDate.getUTCDate()
        };
    }

    if (timezone === "CUSTOM") {
        const currentZones = getCurrentGroupZones();
        let tz = null;
        if (timezoneId) {
            tz = currentZones.find(z => z.id === timezoneId) || null;
        }
        if (!tz) {
            const row = document.querySelector(".dragging") || (document.activeElement?.closest ? document.activeElement.closest("tr") : null);
            const rowId = row?.id ? row.id.replace("tz-row-", "") : "";
            if (rowId) tz = currentZones.find(z => z.id === rowId) || null;
        }
        if (!tz) return null;
        const shifted = new Date(sourceDate.getTime() + (getCustomOffsetMinutes(tz) * 60000));
        return { Y: shifted.getUTCFullYear(), M: shifted.getUTCMonth() + 1, D: shifted.getUTCDate() };
    }

    if (timezoneId) {
        const tz = getCurrentGroupZones().find((item) => item.id === timezoneId) || null;
        const fixedOffsetMinutes = getFixedOffsetForDisplayAtDate(tz, sourceDate);
        if (Number.isFinite(fixedOffsetMinutes)) {
            const shifted = new Date(sourceDate.getTime() + (fixedOffsetMinutes * 60000));
            return { Y: shifted.getUTCFullYear(), M: shifted.getUTCMonth() + 1, D: shifted.getUTCDate() };
        }
    }

    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour12: false
    });
    const parts = formatter.formatToParts(sourceDate);
    const get = (type) => parseInt(parts.find(p => p.type === type)?.value || "0", 10);
    return { Y: get("year"), M: get("month"), D: get("day") };
}

function resolveLocalDatePartsByTimezone(timezone, slotIdx, timezoneId = null) {
    return resolveLocalDatePartsByTimezoneAtDate(timezone, globalTimes[slotIdx], timezoneId);
}

function buildStrictUtcDateFromParts(parts) {
    return GTV_TIME_CORE.buildStrictUtcDateFromParts(parts);
}

function handleTimeChange(val, timezone, slotIdx, timezoneId = null, inputMode = "datetime") {
    if (isRealtime) return;
    const normalized = (val || "").trim();
    const dateTimeMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
    const dateOnlyMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const timeOnlyMatch = normalized.match(/^(\d{2}):(\d{2}):(\d{2})$/);
    let Y = 0; let M = 0; let D = 0; let H = 0; let min = 0; let S = 0;
    if (inputMode === "none") {
        return;
    }
    if (inputMode === "datetime" && dateTimeMatch) {
        [Y, M, D, H, min, S] = dateTimeMatch.slice(1).map(Number);
    } else if (inputMode === "date" && dateOnlyMatch) {
        [Y, M, D] = dateOnlyMatch.slice(1).map(Number);
    } else if (inputMode === "time" && timeOnlyMatch) {
        const baseDateParts = resolveLocalDatePartsByTimezone(timezone, slotIdx, timezoneId);
        if (!baseDateParts) return;
        ({ Y, M, D } = baseDateParts);
        [H, min, S] = timeOnlyMatch.slice(1).map(Number);
    } else {
        showToast(t("toast_invalid_date"));
        renderList();
        return;
    }
    const tempUTC = buildStrictUtcDateFromParts({
        year: Y,
        month: M,
        day: D,
        hour: H,
        minute: min,
        second: S
    });
    if (!tempUTC) {
        showToast(t("toast_invalid_date"));
        renderList();
        return;
    }

    if (timezone === "UTC") {
        globalTimes[slotIdx] = tempUTC;
    } else if (timezone === "CUSTOM") {
        const currentZones = getCurrentGroupZones();
        let tz = null;

        if (timezoneId) {
            tz = currentZones.find(z => z.id === timezoneId) || null;
        }
        // Backward fallback: resolve from focused/dragging row if id wasn't provided.
        if (!tz) {
            const row = document.querySelector(".dragging") || (document.activeElement?.closest ? document.activeElement.closest("tr") : null);
            const rowId = row?.id ? row.id.replace("tz-row-", "") : "";
            if (rowId) tz = currentZones.find(z => z.id === rowId) || null;
        }
        if (tz) {
            const offMs = getCustomOffsetMinutes(tz) * 60000;
            globalTimes[slotIdx] = new Date(tempUTC.getTime() - offMs);
        } else {
            return;
        }
    } else {
        const zoneRef = timezoneId
            ? (getCurrentGroupZones().find((z) => z.id === timezoneId) || null)
            : null;
        const fixedOffsetMinutes = getFixedOffsetForDisplayAtDate(zoneRef, globalTimes[0]);
        const offMin = Number.isFinite(fixedOffsetMinutes)
            ? fixedOffsetMinutes
            : getTimezoneOffset(timezone, tempUTC);
        const offMs = offMin * 60000;
        globalTimes[slotIdx] = new Date(tempUTC.getTime() - offMs);
    }
    updateClocks();
}

function handleMultiRangeTimeChange(rangeIdx, val, timezone, slotIdx, timezoneId = null, inputMode = "datetime") {
    if (!isMultiTab()) return;
    if (rangeIdx > 0 && slotIdx === 0 && !isMultiRangeStartEditEnabled(rangeIdx)) return;
    if (slotIdx === 1 && !isMultiRangeEndEditEnabled(rangeIdx)) return;

    ensureMultiRangeState();
    const range = multiRanges[rangeIdx];
    if (!range) return;

    const normalized = (val || "").trim();
    const dateTimeMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
    const dateOnlyMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const timeOnlyMatch = normalized.match(/^(\d{2}):(\d{2}):(\d{2})$/);
    let Y = 0; let M = 0; let D = 0; let H = 0; let min = 0; let S = 0;

    if (inputMode === "none") return;

    if (inputMode === "datetime" && dateTimeMatch) {
        [Y, M, D, H, min, S] = dateTimeMatch.slice(1).map(Number);
    } else if (inputMode === "date" && dateOnlyMatch) {
        [Y, M, D] = dateOnlyMatch.slice(1).map(Number);
    } else if (inputMode === "time" && timeOnlyMatch) {
        const baseDate = getMultiRangeSlotDate(rangeIdx, slotIdx);
        const baseDateParts = resolveLocalDatePartsByTimezoneAtDate(timezone, baseDate, timezoneId);
        if (!baseDateParts) return;
        ({ Y, M, D } = baseDateParts);
        [H, min, S] = timeOnlyMatch.slice(1).map(Number);
    } else {
        showToast(t("toast_invalid_date"));
        renderMultiRanges();
        return;
    }

    const tempUTC = buildStrictUtcDateFromParts({
        year: Y,
        month: M,
        day: D,
        hour: H,
        minute: min,
        second: S
    });
    if (!tempUTC) {
        showToast(t("toast_invalid_date"));
        renderMultiRanges();
        return;
    }

    let nextUtcDate = null;
    if (timezone === "UTC") {
        nextUtcDate = tempUTC;
    } else if (timezone === "CUSTOM") {
        const tz = getCurrentGroupZones().find(z => z.id === timezoneId) || null;
        if (!tz) return;
        const offMs = getCustomOffsetMinutes(tz) * 60000;
        nextUtcDate = new Date(tempUTC.getTime() - offMs);
    } else {
        const offsetAnchor = new Date(range.startUtcMs);
        const zoneRef = timezoneId
            ? (getCurrentGroupZones().find((z) => z.id === timezoneId) || null)
            : null;
        const fixedOffsetMinutes = getFixedOffsetForDisplayAtDate(zoneRef, offsetAnchor);
        const offMin = Number.isFinite(fixedOffsetMinutes)
            ? fixedOffsetMinutes
            : getTimezoneOffset(timezone, tempUTC);
        nextUtcDate = new Date(tempUTC.getTime() - (offMin * 60000));
    }

    if (!(nextUtcDate instanceof Date) || !Number.isFinite(nextUtcDate.getTime())) return;
    setMultiRangeSlotDate(rangeIdx, slotIdx, nextUtcDate);

    if (slotIdx === 1) {
        syncFollowingRangesByDuration(rangeIdx);
    } else if (rangeIdx === 0) {
        syncMultiRangeStartLinks(1);
    }

    renderMultiRanges();
    savePersistence();
}

// --- Utils ---
// Clear and Redraw Options on init/lang change
function updateTZDropdown() {
    return timezoneSearchService.updateTZDropdown();
}

function initSearchAndSelect() {
    return timezoneSearchService.initSearchAndSelect();
}

function createStandardTimezoneFromSelectableEntry(entry) {
    return timezoneSearchService.createStandardTimezoneFromSelectableEntry(entry);
}

function addFromSearchWithData(entryKey) {
    return timezoneSearchService.addFromSearchWithData(entryKey);
}

// function addFromSearch is now replaced by addFromSearchWithData
function addTimezone(tz) {
    const activeGroup = groups[activeGroupId];
    if (!activeGroup) return;
    if (!tz || typeof tz !== "object") return;
    if (tz?.type === "standard" && !isValidTimeZone(tz.zone)) {
        showToast(t("toast_invalid_timezone"));
        return;
    }
    const requestedId = sanitizeTimezoneId(tz.id);
    const existingIds = new Set(
        activeGroup.zones
            .map((zone) => sanitizeTimezoneId(zone?.id))
            .filter(Boolean)
    );
    let nextId = requestedId;
    if (!nextId || existingIds.has(nextId)) {
        nextId = createUniqueTimezoneId(tz.type === "custom" ? "tz-c" : "tz");
    }
    activeGroup.zones.push({ ...tz, id: nextId });
    savePersistence();
    renderList();
}
function removeTimezone(id) {
    const activeGroup = groups[activeGroupId];
    if (!activeGroup) return;
    if (id === getCurrentGroupBaseTimezoneId()) return;
    if (id === "utc") {
        activeGroup.showUtcRow = false;
        activeGroup.utcRowOrder = 0;
        savePersistence();
        renderList();
        return;
    }
    activeGroup.zones = activeGroup.zones.filter(z => z.id !== id);
    savePersistence();
    renderList();
}
function initDragAndDrop() {
    const container = document.getElementById("clocks-container");
    if (!container) return;

    let pendingClientY = 0;
    let reorderFrameId = null;
    const requestReorder = () => {
        if (reorderFrameId !== null) return;
        reorderFrameId = requestUiFrame(() => {
            reorderFrameId = null;
            const draggingRow = container.querySelector(".time-row.dragging");
            if (!draggingRow) return;

            const beforeRects = captureReorderableRowRects(container);
            const afterEl = getAfter(container, pendingClientY);
            if (afterEl === draggingRow || draggingRow.nextElementSibling === afterEl) return;
            container.insertBefore(draggingRow, afterEl);
            animateReorderTransition(container, beforeRects);
        });
    };

    container.ondragover = (e) => {
        const draggingRow = container.querySelector(".time-row.dragging");
        if (!draggingRow) return;
        e.preventDefault();
        pendingClientY = e.clientY;
        requestReorder();
    };

    container.ondrop = (e) => {
        const draggingRow = container.querySelector(".time-row.dragging");
        if (!draggingRow) return;
        e.preventDefault();
    };

    container.ondragleave = (e) => {
        if (!(e.relatedTarget instanceof Node) || !container.contains(e.relatedTarget)) {
            if (reorderFrameId !== null) {
                cancelUiFrame(reorderFrameId);
                reorderFrameId = null;
            }
        }
    };
}
function captureReorderableRowRects(container) {
    const rectMap = new Map();
    const rows = [...container.querySelectorAll(".time-row:not(.dragging):not(.static)")];
    rows.forEach((row) => {
        rectMap.set(row, row.getBoundingClientRect());
    });
    return rectMap;
}

function animateReorderTransition(container, beforeRects) {
    const rows = [...container.querySelectorAll(".time-row:not(.dragging):not(.static)")];
    rows.forEach((row) => {
        const prevRect = beforeRects.get(row);
        if (!prevRect) return;
        const nextRect = row.getBoundingClientRect();
        const deltaY = prevRect.top - nextRect.top;
        if (Math.abs(deltaY) < 1) return;

        row.style.transition = "none";
        row.style.transform = `translateY(${deltaY}px)`;
        requestUiFrame(() => {
            row.style.transition = "transform 170ms ease";
            row.style.transform = "";
        });
        row.addEventListener("transitionend", () => {
            row.style.transition = "";
        }, { once: true });
    });
}

function getAfter(container, y) {
    const rows = [...container.querySelectorAll(".time-row:not(.dragging):not(.static)")];
    return rows.reduce((closest, row) => {
        const rect = row.getBoundingClientRect();
        const offset = y - rect.top - rect.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset, element: row };
        }
        return closest;
    }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
}
function saveOrder() {
    const activeGroup = groups[activeGroupId];
    if (!activeGroup) return;
    const ids = [...document.querySelectorAll("#clocks-container .time-row:not(.static)")].map(r => r.id.replace("tz-row-", ""));
    const zoneIds = ids.filter(id => id !== "utc");
    activeGroup.zones.sort((a, b) => {
        const idxA = zoneIds.indexOf(a.id);
        const idxB = zoneIds.indexOf(b.id);
        if (idxA < 0 || idxB < 0) return 0;
        return idxA - idxB;
    });
    if (getCurrentGroupBaseTimezoneId() !== "utc") {
        const utcIndex = ids.indexOf("utc");
        activeGroup.showUtcRow = utcIndex >= 0;
        if (utcIndex >= 0) activeGroup.utcRowOrder = utcIndex;
    } else {
        activeGroup.showUtcRow = true;
        activeGroup.utcRowOrder = 0;
    }
    savePersistence();
}

function getTimezoneRefById(id) {
    return snapshotFormatService.getTimezoneRefById(id);
}

function buildTimezoneComputedSnapshot(id) {
    return snapshotFormatService.buildTimezoneComputedSnapshot(id);
}

function formatTimeTextByParts(snapshot, timePartsEnabled) {
    return snapshotFormatService.formatTimeTextByParts(snapshot, timePartsEnabled);
}

function getCopyFieldText(snapshot, key, options = {}) {
    return snapshotFormatService.getCopyFieldText(snapshot, key, options);
}

function getRowCopyText(rowOrId) {
    return snapshotFormatService.getRowCopyText(rowOrId, {
        order: copyFormatOrder,
        enabled: copyFormatEnabled,
        timePartsEnabled: copyTimePartsEnabled
    });
}

function formatSnapshotText(snapshot, order, enabled, timePartsEnabled = DEFAULT_COPY_TIME_PARTS_ENABLED) {
    return snapshotFormatService.formatSnapshotText(snapshot, order, enabled, timePartsEnabled);
}

function getRowFormattedText(rowOrId, order, enabled, timePartsEnabled = DEFAULT_COPY_TIME_PARTS_ENABLED) {
    return snapshotFormatService.getRowFormattedText(rowOrId, order, enabled, timePartsEnabled);
}

function updateCopyFormatPreview() {
    return copyActionsService.updateCopyFormatPreview();
}

async function copyRow(id) {
    return copyActionsService.copyRow(id);
}

async function copyAllTimezones() {
    return copyActionsService.copyAllTimezones();
}

async function copyMultiRangeRow(rangeIdx, rowId) {
    return multiRangeCopyService.copyMultiRangeRow(rangeIdx, rowId);
}

async function copyWholeMultiRange(rangeIdx) {
    return multiRangeCopyService.copyWholeMultiRange(rangeIdx);
}

async function copyAllMultiRangeTimezones() {
    return multiRangeCopyService.copyAllMultiRangeTimezones();
}

function sanitizeFilenamePart(value) {
    return String(value || "")
        .replace(/[\\/:*?"<>|]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function formatDateTimeByTimezone(date, tz) {
    if (tz?.type === "custom") {
        const offsetMin = getCustomOffsetMinutes(tz);
        const shifted = new Date(date.getTime() + (offsetMin * 60000));
        return `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())} ${pad(shifted.getUTCHours())}:${pad(shifted.getUTCMinutes())}:${pad(shifted.getUTCSeconds())}`;
    }

    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: tz?.zone || "UTC",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false
    });
    const parts = formatter.formatToParts(date);
    const get = (type) => parts.find(p => p.type === type)?.value || "0";
    const hourRaw = parseInt(get("hour"), 10);
    const hour = hourRaw === 24 ? 0 : hourRaw;
    return `${get("year")}-${pad(get("month"))}-${pad(get("day"))} ${pad(hour)}:${pad(get("minute"))}:${pad(get("second"))}`;
}

function getTimezoneTableImageFilename() {
    const baseRef = getBaseTimezoneRef();
    const groupName = sanitizeFilenamePart(groups[activeGroupId]?.name || t("default_group_name")) || "Group";
    const baseAbbr = sanitizeFilenamePart(getZoneAbbreviation(baseRef) || "UTC") || "UTC";
    const baseDateTime = formatDateTimeByTimezone(globalTimes[0], baseRef).trim();
    const m = baseDateTime.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
    const timePart = sanitizeFilenamePart(m ? `${m[1]} ${m[2]}${m[3]}${m[4]}` : baseDateTime.replace(/:/g, "")) || "time";

    return `${groupName}_${baseAbbr}_${timePart}`;
}

function getMultiRangeTableImageFilename(rangeIdx) {
    const baseName = getTimezoneTableImageFilename();
    const subgroupName = sanitizeMultiSubgroupName(getCurrentMultiSubgroupName(), "subgroup");
    const rangeLabel = sanitizeFilenamePart(`${subgroupName} ${rangeIdx + 1}`) || `range_${rangeIdx + 1}`;
    return `${baseName}_${rangeLabel}.png`;
}

function getMultiRangeTitlesImageFilename() {
    const baseName = getTimezoneTableImageFilename();
    const titleLabel = sanitizeFilenamePart(sanitizeMultiSubgroupName(getCurrentMultiSubgroupName(), "subgroup")) || "range";
    return `${baseName}_${titleLabel}_titles.png`;
}

function collectDocumentCssText() {
    let cssText = "";
    // 1. First, try to get styles from styleSheets
    for (const styleSheet of [...document.styleSheets]) {
        try {
            if (styleSheet.cssRules) {
                for (const rule of [...styleSheet.cssRules]) {
                    cssText += `${rule.cssText}\n`;
                }
            }
        } catch (err) {
            // Could not read cssRules
        }
    }

    // 2. Internal style tags fallback
    const internalStyles = document.querySelectorAll("style");
    internalStyles.forEach(s => {
        if (s.innerText && !cssText.includes(s.innerText.substring(0, 50))) {
            cssText += `\n${s.innerText}\n`;
        }
    });

    // 3. Dynamic Theme Variables Injection
    const rootStyle = getComputedStyle(document.documentElement);
    const bodyStyle = getComputedStyle(document.body);

    // Capture current theme essentials
    const themeVars = [
        "--panel-bg", "--panel-bg-alt", "--border", "--text", "--text-dim",
        "--accent", "--accent-hover", "--table-head-bg", "--timeline-label-w",
        "--timeline-box-w", "--timeline-box-h", "--ui-scale"
    ];

    let injectedVars = ":root {\n";
    themeVars.forEach(v => {
        const val = rootStyle.getPropertyValue(v).trim();
        if (val) injectedVars += `  ${v}: ${val} !important;\n`;
    });
    // Fallback for missing critical values
    if (!rootStyle.getPropertyValue("--timeline-label-w")) injectedVars += "  --timeline-label-w: 150px;\n";
    if (!rootStyle.getPropertyValue("--timeline-box-h")) injectedVars += "  --timeline-box-h: 28px;\n";

    injectedVars += `  background-color: ${bodyStyle.backgroundColor || "#0f172a"} !important;\n`;
    injectedVars += "}\n";

    cssText = injectedVars + cssText;

    // [Scorched Earth] Security cleaning
    cssText = cssText.replace(/@font-face\s*{[\s\S]*?}/gi, "");
    cssText = cssText.replace(/@import\s+[^;]+;/gi, "");
    cssText = cssText.replace(/url\s*\([\s\S]*?\)/gi, "none");
    cssText += `\n* { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important; }\n`;

    return cssText;
}

function cloneTableForImageExport(tableEl) {
    const clone = tableEl.cloneNode(true);
    const srcInputs = tableEl.querySelectorAll(".time-input");
    const clonedInputs = clone.querySelectorAll(".time-input");

    clonedInputs.forEach((inputEl, idx) => {
        const span = document.createElement("span");
        span.className = "export-time-text";
        span.textContent = srcInputs[idx]?.value || "";
        inputEl.replaceWith(span);
    });

    clone.querySelectorAll(".export-exclude, .move-col, .move-cell").forEach((node) => node.remove());

    return clone;
}

function cloneMultiRangeBlockForImageExport(blockEl) {
    const clone = blockEl.cloneNode(true);
    const srcInputs = blockEl.querySelectorAll(".time-input");
    const clonedInputs = clone.querySelectorAll(".time-input");

    clonedInputs.forEach((inputEl, idx) => {
        const span = document.createElement("span");
        span.className = "export-time-text";
        span.textContent = srcInputs[idx]?.value || "";
        inputEl.replaceWith(span);
    });

    clone.classList.remove("collapsed");
    clone.querySelectorAll(".multi-range-header-actions, .multi-range-adjust-row, .export-exclude, .move-col, .move-cell").forEach((node) => node.remove());
    return clone;
}

function cloneMultiRangesForImageExport(containerEl) {
    const wrapper = document.createElement("div");
    wrapper.className = "multi-ranges-container";
    const blocks = [...containerEl.querySelectorAll(".multi-range-block")];
    blocks.forEach((blockEl) => {
        wrapper.appendChild(cloneMultiRangeBlockForImageExport(blockEl));
    });
    return wrapper;
}
async function renderElementWithForeignObjectToPngDataUrl(renderElement) {
    if (!renderElement) throw new Error("Render element not found");

    // Temporarily host to measure exact content size
    const measureHost = document.createElement("div");
    // Flexible width for measurement to avoid premature wrapping
    measureHost.style.cssText = "position:fixed; left:-99999px; top:0; width:max-content; min-width:1400px; height:auto; visibility:hidden; pointer-events:none; display:block !important;";
    const measureClone = renderElement.cloneNode(true);
    // Ensure all blocks are visible for measurement
    measureClone.classList.remove("collapsed");

    // CRITICAL: If this is the multi-ranges container, ensure it stacks vertically during measurement
    // so that the scrollWidth/scrollHeight matches the final SVG layout (flex-direction: column).
    if (measureClone.classList.contains("multi-ranges-container") || measureClone.querySelector(".multi-range-block")) {
        measureClone.style.display = "flex";
        measureClone.style.flexDirection = "column";
        measureClone.style.alignItems = "center";
        measureClone.style.gap = "40px";
        measureClone.style.width = "1400px"; // Constrain width for a vertical stack
    }

    measureHost.appendChild(measureClone);
    document.body.appendChild(measureHost);

    // Measure the actual boundary of content
    const width = Math.ceil(measureClone.scrollWidth || 1400);
    const height = Math.ceil(measureClone.scrollHeight || 600);
    measureHost.remove();

    const targetWidth = TABLE_IMAGE_EXPORT_WIDTH;
    const targetHeight = Math.max(1, Math.round((height * targetWidth) / width));

    const markup = new XMLSerializer().serializeToString(renderElement);
    const cssText = collectDocumentCssText();

    // 21st round: Ultra Visual Fidelity & Vertical Stacking Fix
    const dayBox = document.querySelector(".timeline-hour-box.day");
    const nightBox = document.querySelector(".timeline-hour-box.night");
    const liveDayBg = dayBox ? getComputedStyle(dayBox).backgroundColor : "#caeefb";
    const liveNightBg = "#616161"; // Force requested color
    const liveBorder = dayBox ? getComputedStyle(dayBox).borderTopColor : "#8795aa";
    const liveText = getComputedStyle(document.body).color || "#f8fafc";
    const liveBg = getComputedStyle(document.body).backgroundColor || "#0f172a";

    const extraCss = `
        /* Root variable overrides for SVG context */
        :root {
            --text: ${liveText} !important;
            --panel-bg: ${liveBg} !important;
        }

        /* Essential resetting and centering */
        body { 
            background-color: ${liveBg} !important; 
            margin: 0 !important;
            padding: 0 !important;
            display: flex !important;
            justify-content: center !important;
            align-items: flex-start !important;
        }

        /* Force container to fill the image with exact theme background */
        .timezone-export-wrapper, .multi-ranges-container {
            width: ${width}px !important;
            min-height: ${height}px !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: flex-start !important;
            gap: 40px !important;
            padding: 60px 80px !important;
            box-sizing: border-box !important;
            background-color: ${liveBg} !important;
            color: ${liveText} !important;
            overflow: visible !important;
        }

        /* Vertical Stacking for All Ranges Export */
        .multi-ranges-container {
            flex-direction: column !important;
            align-items: center !important;
        }
        .multi-range-block {
            width: 100% !important;
            max-width: 1400px !important;
            margin-bottom: 20px !important;
            background-color: transparent !important;
        }

        /* Dual Panels (Extra Time) - Split LEFT/RIGHT as requested */
        .timeline-panels.dual {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 30px !important;
            width: 100% !important;
            margin: 0 auto !important;
        }

        /* Timeline grid preservation & layout fixes */
        .timeline-frame .time-adjust-row, 
        .timeline-frame .time-adjust-set-container {
            display: flex !important;
            flex-direction: row !important;
            justify-content: center !important;
            gap: 25px !important;
        }

        .timeline-axis-row, .timeline-timezone-row {
            display: grid !important;
            grid-template-columns: var(--timeline-label-w, 150px) 1fr !important;
            width: 100% !important;
            height: var(--timeline-box-h, 28px) !important; 
            margin-bottom: 2px !important;
            color: ${liveText} !important;
        }
        .timeline-label {
            display: flex !important;
            align-items: center !important;
            padding-right: 20px !important;
            font-size: 13px !important;
            color: ${liveText} !important;
        }
        .timeline-box-row {
            display: flex !important;
            width: 100% !important;
            height: 100% !important;
            border: 0.5px solid ${liveBorder} !important;
        }
        .timeline-hour-box {
            flex: 1 !important;
            height: 100% !important;
            border-right: 0.5px solid ${liveBorder} !important;
        }
        .timeline-hour-box.night { background-color: ${liveNightBg} !important; }

        .calendar-btn { display: none !important; }

        .timeline-indicator {
            position: absolute !important;
            top: 0 !important;
            bottom: 0 !important;
            background-color: #ef4444 !important;
            width: 2px !important;
            z-index: 10 !important;
        }

        /* General UI scale and layout fixes */
        .multi-range-title { 
            font-size: 22px !important; 
            margin-bottom: 20px !important;
            color: ${liveText} !important;
        }
        .data-table { border-collapse: collapse !important; width: 100% !important; color: ${liveText} !important; }
        .data-table th, .data-table td { border: 1px solid var(--border) !important; padding: 12px !important; color: ${liveText} !important; }
        .zone-code, .zone-name, .offset-text, .period-days-text, .period-time-text { color: ${liveText} !important; }
        * { box-sizing: border-box !important; }
    `;


    let safeCssText = `${cssText}\n${extraCss}`
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/<\/style>/gi, "<\\/style>")
        .replace(/url\s*\(/gi, "none(");

    const tempDiv = document.createElement("div");
    tempDiv.insertAdjacentHTML('beforeend', markup);

    // Filter tags but keep SVG for drawings
    const riskyTags = ["script", "iframe", "object", "embed", "link", "meta", "image", "img"];
    riskyTags.forEach(tag => tempDiv.querySelectorAll(tag).forEach(el => el.remove()));

    // Strict attribute whitelist
    const walker = document.createTreeWalker(tempDiv, NodeFilter.SHOW_ELEMENT);
    let curr = walker.nextNode();
    const SAFE_ATTRS = new Set([
        "id", "class", "style", "colspan", "rowspan", "width", "height", "xmlns",
        "viewbox", "x", "y", "rx", "ry", "cx", "cy", "r", "d", "fill", "stroke",
        "stroke-width", "points", "transform", "preserveaspectratio", "opacity"
    ]);

    while (curr) {
        if (curr.nodeType === 1) {
            const attrs = [...curr.attributes];
            for (const attr of attrs) {
                if (!SAFE_ATTRS.has(attr.name.toLowerCase())) curr.removeAttribute(attr.name);
            }
            const style = curr.getAttribute("style");
            if (style && style.toLowerCase().includes("url")) {
                curr.setAttribute("style", style.replace(/url\s*\(/gi, "none("));
            }
        }
        curr = walker.nextNode();
    }

    const svgMarkup = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
            <foreignObject width="100%" height="100%">
                <div xmlns="http://www.w3.org/1999/xhtml">
                    <style>/* <![CDATA[ */\n${safeCssText}\n/* ]]> */</style>
                    ${tempDiv.innerHTML}
                </div>
            </foreignObject>
        </svg>
    `;

    const svgDataUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgMarkup);

    try {
        await waitForDocumentFontsReady();
        const img = await loadImageElement(svgDataUrl);
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas context unavailable");

        ctx.fillStyle = getComputedStyle(document.body).backgroundColor || "#0f172a";
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        try {
            ctx.getImageData(0, 0, 1, 1);
        } catch (taintErr) {
            // Canvas TAINTED
            throw taintErr;
        }

        return canvas.toDataURL("image/png");
    } catch (err) {
        // ERROR handled
        throw err;
    }
}

function loadImageElement(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(new Error("Image load error"));
        img.src = src;
    });
}

async function waitForDocumentFontsReady() {
    if (!document.fonts?.ready) return;
    try {
        await document.fonts.ready;
    } catch (_) {
        // Ignore font readiness failures and continue with fallback rendering.
    }
}

function isDomExceptionLike(err) {
    if (!err) return false;
    if (typeof DOMException !== "undefined" && err instanceof DOMException) return true;
    const name = typeof err.name === "string" ? err.name : "";
    return name === "SecurityError" || name === "InvalidStateError";
}

async function detectForeignObjectRendererSupport() {
    if (typeof canUseForeignObjectRenderer === "boolean") return canUseForeignObjectRenderer;
    if (typeof URL === "undefined" || typeof URL.createObjectURL !== "function") {
        canUseForeignObjectRenderer = false;
        return false;
    }

    const probeSvg = `
        < svg xmlns = "http://www.w3.org/2000/svg" width = "4" height = "4" viewBox = "0 0 4 4" >
            <foreignObject width="100%" height="100%">
                <div xmlns="http://www.w3.org/1999/xhtml" style="width:4px;height:4px;background:#000;"></div>
            </foreignObject>
        </svg >
        `;
    const probeBlob = new Blob([probeSvg], { type: "image/svg+xml;charset=utf-8" });
    const probeUrl = URL.createObjectURL(probeBlob);
    try {
        const img = await loadImageElement(probeUrl);
        const canvas = document.createElement("canvas");
        canvas.width = 4;
        canvas.height = 4;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            canUseForeignObjectRenderer = false;
            return false;
        }
        ctx.drawImage(img, 0, 0, 4, 4);
        canvas.toDataURL("image/png");
        canUseForeignObjectRenderer = true;
        return true;
    } catch (err) {
        canUseForeignObjectRenderer = false;
        return false;
    } finally {
        URL.revokeObjectURL(probeUrl);
    }
}

function extractTableCellText(cell) {
    if (!cell) return "";
    const timeInput = cell.querySelector(".time-input");
    const exportTimeText = cell.querySelector(".export-time-text");
    if (timeInput) {
        const dnText = (cell.querySelector(".dn-icon")?.textContent || "").trim();
        const dayBadge = cell.querySelector(".day-badge");
        const timeText = (timeInput.value || "").trim();
        const dayText = (dayBadge?.textContent || "").trim();
        return [dnText, timeText, dayText].filter(Boolean).join(" ").trim();
    }
    if (exportTimeText) {
        const dnText = (cell.querySelector(".dn-icon")?.textContent || "").trim();
        const dayBadge = cell.querySelector(".day-badge");
        const timeText = (exportTimeText.textContent || "").trim();
        const dayText = (dayBadge?.textContent || "").trim();
        return [dnText, timeText, dayText].filter(Boolean).join(" ").trim();
    }

    const zoneCode = (cell.querySelector(".zone-code")?.textContent || "").trim();
    if (zoneCode) return zoneCode;
    const zoneName = (cell.querySelector(".zone-name")?.textContent || "").trim();
    if (zoneName) return zoneName;
    const offsetText = (cell.querySelector(".offset-text")?.textContent || "").trim();
    if (offsetText) return offsetText;
    const periodDays = (cell.querySelector(".period-days-text")?.textContent || "").trim();
    if (periodDays && periodDays !== "-") return periodDays;
    const periodTime = (cell.querySelector(".period-time-text")?.textContent || "").trim();
    if (periodTime && periodTime !== "-") return periodTime;
    const buttonText = (cell.querySelector("button")?.textContent || "").trim();
    if (buttonText) return buttonText;
    return (cell.textContent || "").trim();
}

async function renderTimezoneTableFallbackDataUrl() {
    await waitForDocumentFontsReady();

    const table = document.querySelector("#timezone-section .data-table");
    if (!table) throw new Error("Table element not found");

    const headerCells = [...table.querySelectorAll("#table-head th")]
        .filter((th) => !th.classList.contains("export-exclude") && !th.classList.contains("move-col"));
    const bodyRows = [...table.querySelectorAll("#clocks-container tr.time-row")];
    if (!headerCells.length || !bodyRows.length) {
        throw new Error("No table data to render");
    }

    const colCount = headerCells.length;
    const measuredColWidths = headerCells.map((th) => {
        const w = Math.ceil(th.getBoundingClientRect().width);
        return Math.max(w, 70);
    });
    const tableWidth = measuredColWidths.reduce((acc, w) => acc + w, 0);
    const headerHeight = Math.max(34, Math.ceil(headerCells[0].getBoundingClientRect().height) || 40);
    const rowHeights = bodyRows.map((row) => Math.max(34, Math.ceil(row.getBoundingClientRect().height) || 40));
    const tableHeight = headerHeight + rowHeights.reduce((acc, h) => acc + h, 0);
    const targetWidth = TABLE_IMAGE_EXPORT_WIDTH;
    const renderRatio = targetWidth / Math.max(1, tableWidth);
    const targetHeight = Math.max(1, Math.round(tableHeight * renderRatio));

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context unavailable");
    ctx.scale(renderRatio, renderRatio);

    const rootStyle = getComputedStyle(document.documentElement);
    const bodyStyle = getComputedStyle(document.body);
    const headBg = (rootStyle.getPropertyValue("--table-head-bg") || "#1e293b").trim();
    const borderColor = (rootStyle.getPropertyValue("--border") || "rgba(148,163,184,0.25)").trim();
    const textColor = (rootStyle.getPropertyValue("--text") || "#f1f5f9").trim();
    const dimColor = (rootStyle.getPropertyValue("--text-dim") || "#94a3b8").trim();
    const rowBgA = "rgba(255,255,255,0.02)";
    const rowBgB = "rgba(255,255,255,0.04)";
    const pageBg = bodyStyle.backgroundColor || "#0f172a";

    ctx.fillStyle = pageBg;
    ctx.fillRect(0, 0, tableWidth, tableHeight);

    const exportBodyFont = `13px ${EXPORT_MONO_FONT_FAMILY} `;
    const exportHeaderFont = `600 13px ${EXPORT_MONO_FONT_FAMILY} `;
    const drawCellText = (text, x, y, w, h, align = "left", color = textColor, font = exportBodyFont) => {
        ctx.save();
        ctx.fillStyle = color;
        ctx.font = font;
        ctx.textBaseline = "middle";
        const padX = 8;
        if (align === "center") {
            ctx.textAlign = "center";
            ctx.fillText(text, x + (w / 2), y + (h / 2));
        } else {
            ctx.textAlign = "left";
            ctx.fillText(text, x + padX, y + (h / 2));
        }
        ctx.restore();
    };

    const isCenterHeader = () => true;
    const isCenterBodyCell = (cell) => {
        if (!cell) return false;
        if (
            cell.classList.contains("move-cell") ||
            cell.classList.contains("timezone-cell") ||
            cell.classList.contains("period-days-cell") ||
            cell.classList.contains("period-time-cell")
        ) {
            return true;
        }
        return !!cell.querySelector(".offset-text");
    };

    let y = 0;
    ctx.fillStyle = headBg;
    ctx.fillRect(0, y, tableWidth, headerHeight);
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y + headerHeight - 0.5);
    ctx.lineTo(tableWidth, y + headerHeight - 0.5);
    ctx.stroke();

    let x = 0;
    for (let c = 0; c < colCount; c++) {
        const w = measuredColWidths[c];
        const headText = (headerCells[c].textContent || "").trim();
        drawCellText(headText, x, y, w, headerHeight, isCenterHeader(c) ? "center" : "left", dimColor, exportHeaderFont);
        if (c < colCount - 1) {
            ctx.beginPath();
            ctx.moveTo(x + w - 0.5, y);
            ctx.lineTo(x + w - 0.5, tableHeight);
            ctx.stroke();
        }
        x += w;
    }

    y += headerHeight;
    bodyRows.forEach((row, rowIdx) => {
        const h = rowHeights[rowIdx];
        ctx.fillStyle = rowIdx % 2 === 0 ? rowBgA : rowBgB;
        ctx.fillRect(0, y, tableWidth, h);
        ctx.beginPath();
        ctx.moveTo(0, y + h - 0.5);
        ctx.lineTo(tableWidth, y + h - 0.5);
        ctx.stroke();

        let rowX = 0;
        const cells = [...row.children]
            .filter((td) => !td.classList.contains("export-exclude") && !td.classList.contains("move-cell"));
        for (let c = 0; c < colCount; c++) {
            const w = measuredColWidths[c];
            const cell = cells[c];
            const text = extractTableCellText(cell);
            const center = isCenterBodyCell(cell);
            drawCellText(text, rowX, y, w, h, center ? "center" : "left", textColor, exportBodyFont);
            rowX += w;
        }
        y += h;
    });

    return canvas.toDataURL("image/png");
}


async function renderTimezoneTableToPngDataUrl() {
    const sectionEl = document.getElementById("timezone-section");
    const tableEl = sectionEl ? sectionEl.querySelector(".data-table") : null;
    if (!tableEl) throw new Error("Timezone table not found");
    return renderElementWithForeignObjectToPngDataUrl(cloneTableForImageExport(tableEl));
}

async function renderMultiRangesFallbackDataUrl(targetRangeIdx = null) {
    await waitForDocumentFontsReady();

    const containerEl = document.getElementById("multi-ranges-container");
    if (!containerEl) throw new Error("Multi-range container not found");

    const sourceBlocks = [...containerEl.querySelectorAll(".multi-range-block")];
    const selectedBlocks = Number.isInteger(targetRangeIdx)
        ? (sourceBlocks[targetRangeIdx] ? [sourceBlocks[targetRangeIdx]] : [])
        : sourceBlocks;
    if (!selectedBlocks.length) throw new Error("No multi-range table data to render");

    const clonedContainer = document.createElement("div");
    clonedContainer.className = "multi-ranges-container";
    selectedBlocks.forEach((blockEl) => {
        clonedContainer.appendChild(cloneMultiRangeBlockForImageExport(blockEl));
    });

    const measureHost = document.createElement("div");
    measureHost.style.cssText = "position:fixed; left:-10000px; top:0; width:auto; min-width:800px; max-width:1400px; height:auto; opacity:0; pointer-events:none; display:block !important;";
    measureHost.appendChild(clonedContainer);
    document.body.appendChild(measureHost);

    const metrics = [];
    try {
        const blockEls = [...clonedContainer.querySelectorAll(".multi-range-block")];
        blockEls.forEach((block) => {
            block.classList.remove("collapsed"); // Fix: Ensure all blocks are expanded for export
            const titleText = (block.querySelector(".multi-range-title")?.textContent || "").trim();
            const tableEl = block.querySelector(".data-table");
            if (!tableEl) return;

            const headerCells = [...tableEl.querySelectorAll("thead th")]
                .filter((th) => !th.classList.contains("export-exclude") && !th.classList.contains("move-col"));
            const bodyRows = [...tableEl.querySelectorAll("tbody tr.time-row")];
            if (!headerCells.length || !bodyRows.length) return;

            const colWidths = headerCells.map((th) => Math.max(Math.ceil(th.getBoundingClientRect().width), 70));
            const tableWidth = colWidths.reduce((acc, w) => acc + w, 0);
            const headerHeight = Math.max(34, Math.ceil(headerCells[0].getBoundingClientRect().height) || 40);
            const rowHeights = bodyRows.map((row) => Math.max(34, Math.ceil(row.getBoundingClientRect().height) || 40));
            const tableHeight = headerHeight + rowHeights.reduce((acc, h) => acc + h, 0);

            metrics.push({
                titleText,
                headerCells,
                bodyRows,
                colWidths,
                headerHeight,
                rowHeights,
                tableWidth,
                tableHeight
            });
        });
    } finally {
        measureHost.remove();
    }

    if (!metrics.length) throw new Error("No multi-range table data to render");

    const rootStyle = getComputedStyle(document.documentElement);
    const bodyStyle = getComputedStyle(document.body);
    const pageBg = bodyStyle.backgroundColor || "#0f172a";
    const headBg = (rootStyle.getPropertyValue("--table-head-bg") || "#1e293b").trim();
    const borderColor = (rootStyle.getPropertyValue("--border") || "rgba(148,163,184,0.25)").trim();
    const textColor = (rootStyle.getPropertyValue("--text") || "#f1f5f9").trim();
    const dimColor = (rootStyle.getPropertyValue("--text-dim") || "#94a3b8").trim();
    const accentColor = (rootStyle.getPropertyValue("--accent") || "#38bdf8").trim();
    const rowBgA = "rgba(255,255,255,0.02)";
    const rowBgB = "rgba(255,255,255,0.04)";
    const titleBg = "rgba(56, 189, 248, 0.10)";
    const blockGap = 14;
    const titleHeight = 38;
    const maxTableWidth = Math.max(...metrics.map((metric) => metric.tableWidth));
    const sourceWidth = Math.max(1, maxTableWidth);
    const sourceHeight = metrics.reduce((sum, metric, idx) => (
        sum + titleHeight + metric.tableHeight + (idx < metrics.length - 1 ? blockGap : 0)
    ), 0);
    // Add small buffer to avoid truncation
    const canvasHeightBuffer = 4;
    const targetWidth = TABLE_IMAGE_EXPORT_WIDTH;
    const renderRatio = targetWidth / sourceWidth;
    const targetHeight = Math.max(1, Math.round(sourceHeight * renderRatio));

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context unavailable");
    ctx.scale(renderRatio, renderRatio);

    ctx.fillStyle = pageBg;
    ctx.fillRect(0, 0, sourceWidth, sourceHeight);

    const exportBodyFont = `13px ${EXPORT_MONO_FONT_FAMILY} `;
    const exportHeaderFont = `600 13px ${EXPORT_MONO_FONT_FAMILY} `;
    const exportTitleFont = `700 16px ${EXPORT_MONO_FONT_FAMILY} `;
    const drawCellText = (text, x, y, w, h, align = "left", color = textColor, font = exportBodyFont) => {
        ctx.save();
        ctx.beginPath();
        ctx.rect(x + 2, y + 1, Math.max(0, w - 4), Math.max(0, h - 2));
        ctx.clip();
        ctx.fillStyle = color;
        ctx.font = font;
        ctx.textBaseline = "middle";
        const padX = 8;
        if (align === "center") {
            ctx.textAlign = "center";
            ctx.fillText(text, x + (w / 2), y + (h / 2));
        } else {
            ctx.textAlign = "left";
            ctx.fillText(text, x + padX, y + (h / 2));
        }
        ctx.restore();
    };

    const isCenterBodyCell = (cell) => {
        if (!cell) return false;
        if (
            cell.classList.contains("timezone-cell") ||
            cell.classList.contains("period-days-cell") ||
            cell.classList.contains("period-time-cell")
        ) {
            return true;
        }
        return !!cell.querySelector(".offset-text");
    };

    let y = 0;
    metrics.forEach((metric, metricIdx) => {
        const titleText = metric.titleText || `${t("default_subgroup_name")} ${metricIdx + 1} `;
        ctx.fillStyle = titleBg;
        ctx.fillRect(0, y, sourceWidth, titleHeight);
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y + titleHeight - 0.5);
        ctx.lineTo(sourceWidth, y + titleHeight - 0.5);
        ctx.stroke();
        drawCellText(titleText, 0, y, sourceWidth, titleHeight, "left", accentColor, exportTitleFont);
        y += titleHeight;

        ctx.fillStyle = headBg;
        ctx.fillRect(0, y, metric.tableWidth, metric.headerHeight);
        ctx.beginPath();
        ctx.moveTo(0, y + metric.headerHeight - 0.5);
        ctx.lineTo(metric.tableWidth, y + metric.headerHeight - 0.5);
        ctx.stroke();

        let x = 0;
        for (let c = 0; c < metric.colWidths.length; c++) {
            const w = metric.colWidths[c];
            const headText = (metric.headerCells[c].textContent || "").trim();
            drawCellText(headText, x, y, w, metric.headerHeight, "center", dimColor, exportHeaderFont);
            if (c < metric.colWidths.length - 1) {
                ctx.beginPath();
                ctx.moveTo(x + w - 0.5, y);
                ctx.lineTo(x + w - 0.5, y + metric.tableHeight);
                ctx.stroke();
            }
            x += w;
        }

        let rowY = y + metric.headerHeight;
        metric.bodyRows.forEach((row, rowIdx) => {
            const h = metric.rowHeights[rowIdx];
            ctx.fillStyle = rowIdx % 2 === 0 ? rowBgA : rowBgB;
            ctx.fillRect(0, rowY, metric.tableWidth, h);
            ctx.beginPath();
            ctx.moveTo(0, rowY + h - 0.5);
            ctx.lineTo(metric.tableWidth, rowY + h - 0.5);
            ctx.stroke();

            let rowX = 0;
            const cells = [...row.children]
                .filter((td) => !td.classList.contains("export-exclude") && !td.classList.contains("move-cell"));
            for (let c = 0; c < metric.colWidths.length; c++) {
                const w = metric.colWidths[c];
                const cell = cells[c];
                const text = extractTableCellText(cell);
                const center = isCenterBodyCell(cell);
                drawCellText(text, rowX, rowY, w, h, center ? "center" : "left", textColor, exportBodyFont);
                rowX += w;
            }
            rowY += h;
        });

        y += metric.tableHeight;
        if (metricIdx < metrics.length - 1) y += blockGap;
    });

    return canvas.toDataURL("image/png");
}

async function renderMultiRangesToPngDataUrl(targetRangeIdx = null) {
    return renderMultiRangesFallbackDataUrl(targetRangeIdx);
}

async function renderMultiRangeSingleToPngDataUrl(rangeIdx) {
    return renderMultiRangesToPngDataUrl(rangeIdx);
}

async function renderMultiRangeTitlesToPngDataUrl() {
    await waitForDocumentFontsReady();

    ensureMultiRangeState();
    const baseRef = getBaseTimezoneRef();
    const titles = multiRanges.map((range, rangeIdx) => getMultiRangeTitleText(rangeIdx, range, baseRef));
    if (!titles.length) throw new Error("No multi-range title data to render");

    const rootStyle = getComputedStyle(document.documentElement);
    const bodyStyle = getComputedStyle(document.body);
    const pageBg = bodyStyle.backgroundColor || "#0f172a";
    const borderColor = (rootStyle.getPropertyValue("--border") || "rgba(148,163,184,0.25)").trim();
    const accentColor = (rootStyle.getPropertyValue("--accent") || "#38bdf8").trim();
    const titleFont = `700 16px ${EXPORT_MONO_FONT_FAMILY} `;
    const sidePadding = 16;
    const topBottomPadding = 12;
    const rowHeight = 40;
    const rowGap = 8;

    const measureCanvas = document.createElement("canvas");
    const measureCtx = measureCanvas.getContext("2d");
    let maxTextWidth = 0;
    if (measureCtx) {
        measureCtx.font = titleFont;
        titles.forEach((titleText) => {
            maxTextWidth = Math.max(maxTextWidth, Math.ceil(measureCtx.measureText(titleText).width));
        });
    }

    const sourceWidth = Math.max(640, maxTextWidth + (sidePadding * 2));
    const contentHeight = (titles.length * rowHeight) + (Math.max(0, titles.length - 1) * rowGap);
    const sourceHeight = contentHeight + (topBottomPadding * 2);
    const targetWidth = TABLE_IMAGE_EXPORT_WIDTH;
    const renderRatio = targetWidth / sourceWidth;
    const targetHeight = Math.max(1, Math.round(sourceHeight * renderRatio));

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context unavailable");
    ctx.scale(renderRatio, renderRatio);

    ctx.fillStyle = pageBg;
    ctx.fillRect(0, 0, sourceWidth, sourceHeight);

    let y = topBottomPadding;
    titles.forEach((titleText, idx) => {
        const rowBg = idx % 2 === 0 ? "rgba(56, 189, 248, 0.12)" : "rgba(56, 189, 248, 0.08)";
        const resolvedTitle = (titleText || "").trim() || `${t("default_subgroup_name")} ${idx + 1} `;

        ctx.fillStyle = rowBg;
        ctx.fillRect(0, y, sourceWidth, rowHeight);

        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 1;
        ctx.strokeRect(0.5, y + 0.5, Math.max(1, sourceWidth - 1), Math.max(1, rowHeight - 1));

        ctx.fillStyle = accentColor;
        ctx.font = titleFont;
        ctx.textBaseline = "middle";
        ctx.textAlign = "left";
        ctx.fillText(resolvedTitle, sidePadding, y + (rowHeight / 2));

        y += rowHeight + rowGap;
    });

    return canvas.toDataURL("image/png");
}

function getImageExportDeps() {
    return {
        t,
        showToast,
        isMultiTab,
        ensureMultiRangeState,
        detectForeignObjectRendererSupport,
        renderTimezoneTableToPngDataUrl,
        renderTimezoneTableFallbackDataUrl,
        renderMultiRangesToPngDataUrl,
        renderMultiRangeSingleToPngDataUrl,
        renderMultiRangesFallbackDataUrl,
        renderMultiRangeTitlesToPngDataUrl,
        saveMultiRangeSingleImage,
        isTimelineVisible: () => {
            const frame = document.getElementById("timeline-frame");
            return frame && frame.style.display !== "none" && frame.childElementCount > 0;
        },
        getTimezoneTableImageFilename,
        getMultiRangeTableImageFilename,
        getMultiRangeTitlesImageFilename,
        getMultiRanges: () => multiRanges,
        isDomExceptionLike,
        setCanUseForeignObjectRenderer: (value) => {
            canUseForeignObjectRenderer = value;
        }
    };
}

async function saveMultiRangeTitlesImage() {
    return GTV_IMAGE_EXPORT.saveMultiRangeTitlesImage(getImageExportDeps());
}


async function saveMultiRangeAllImage() {
    return GTV_IMAGE_EXPORT.saveMultiRangeAllImage(getImageExportDeps());
}

async function saveMultiRangeSingleImage(rangeIdx) {
    return GTV_IMAGE_EXPORT.saveMultiRangeSingleImage(getImageExportDeps(), rangeIdx);
}

async function saveTimezoneTableImage() {
    return GTV_IMAGE_EXPORT.saveTimezoneTableImage(getImageExportDeps());
}


function initCalculators() {
    if (!GTV_CALCULATOR || typeof GTV_CALCULATOR.initCalculators !== "function") {
        console.error("Missing required module API: GTVCalculator.initCalculators");
        return;
    }
    GTV_CALCULATOR.initCalculators({
        t,
        copyText
    });
}

async function copyText(elementId, isInput = false) {
    const el = document.getElementById(elementId);
    if (!el) return;
    let text = (isInput ? el.value : (el.textContent || "")).trim();
    if (!isInput && PERIOD_RESULT_IDS.has(elementId)) {
        const matchedNumber = text.match(/-?\d+(\.\d+)?/);
        text = matchedNumber ? matchedNumber[0] : "";
    }
    if (!text) return;
    try {
        await navigator.clipboard.writeText(text);
        showToast(t("toast_copy_success"), { type: "success" });
    } catch (err) {
        console.error("copyText failed:", err);
        showToast(t("toast_copy_failed"), { type: "error" });
    }
}

function getPersistenceSnapshot() {
    currentMainTab = sanitizeMainTab(currentMainTab);
    syncCurrentMultiStateToActiveSubgroup();
    if (currentMainTab === "live" || currentMainTab === "fixed") {
        activeGroupIdByMainTab[currentMainTab] = activeGroupId;
    }
    normalizeGroupTabState();
    ensureMultiRangeState();
    groups.forEach((group) => ensureGroupMultiSubgroups(group));

    return {
        groups,
        activeGroupId,
        currentMainTab,
        activeGroupIdByMainTab,
        slotCount,
        baseTimezoneId: getCurrentGroupBaseTimezoneId(),
        showCopyFormat,
        showTimeline,
        displayFormatOrder: sanitizeCopyFormatOrder(displayFormatOrder),
        displayFormatEnabled: sanitizeCopyFormatEnabled(displayFormatEnabled, "display"),
        displayTimePartsEnabled: sanitizeTimePartsEnabled(displayTimePartsEnabled, "display"),
        copyFormatOrder: sanitizeCopyFormatOrder(copyFormatOrder),
        copyFormatEnabled: sanitizeCopyFormatEnabled(copyFormatEnabled, "copy"),
        copyTimePartsEnabled: sanitizeTimePartsEnabled(copyTimePartsEnabled, "copy"),
        timeAdjustDayStepBySlot: [
            getTimeAdjustDayStep(0),
            getTimeAdjustDayStep(1)
        ],
        multiRangeCount: sanitizeMultiRangeCount(multiRangeCount),
        multiRangeTitle: sanitizeMultiRangeTitle(getCurrentMultiSubgroupName()),
        multiRanges: multiRanges.map((range) => ({
            startUtcMs: sanitizeUtcMs(range.startUtcMs, Date.now()),
            endUtcMs: sanitizeUtcMs(range.endUtcMs, Date.now())
        })),
        multiRangeCollapsed: multiRangeCollapsed.map((flag) => !!flag),
        multiRangeStartEditEnabled: multiRangeStartEditEnabled.map((flag) => !!flag),
        multiRangeEndEditEnabled: multiRangeEndEditEnabled.map((flag) => !!flag)
    };
}

function getSettingsExportFileName() {
    return dataTransferService.getSettingsExportFileName();
}

function getGroupExportFileName(groupName = "") {
    return dataTransferService.getGroupExportFileName(groupName);
}

function getSubgroupExportFileName(groupName = "", subgroupName = "") {
    return dataTransferService.getSubgroupExportFileName(groupName, subgroupName);
}

function exportGroupToJSON(groupIdx = activeGroupId) {
    return dataTransferService.exportGroupToJSON(groupIdx);
}

function triggerGroupImportFor(groupIdx = activeGroupId) {
    return dataTransferService.triggerGroupImportFor(groupIdx);
}

async function handleGroupImportFile(event) {
    return dataTransferService.handleGroupImportFile(event);
}

function exportSubgroupToJSON(groupIdx = activeGroupId, subgroupId = "") {
    return dataTransferService.exportSubgroupToJSON(groupIdx, subgroupId);
}

function triggerSubgroupImportFor(groupIdx = activeGroupId, subgroupId = "") {
    return dataTransferService.triggerSubgroupImportFor(groupIdx, subgroupId);
}

async function handleSubgroupImportFile(event) {
    return dataTransferService.handleSubgroupImportFile(event);
}

function exportSettingsToJSON() {
    return dataTransferService.exportSettingsToJSON();
}

async function handleSettingsImportFile(event) {
    return dataTransferService.handleSettingsImportFile(event);
}

async function savePersistence(options = {}) {
    return persistenceService.savePersistence(options);
}

async function resetAllSettings() {
    return persistenceService.resetAllSettings();
}

async function resetExceptGroupsAndTimezones() {
    return persistenceService.resetExceptGroupsAndTimezones();
}

function getDefaultGroups() {
    return persistenceService.getDefaultGroups();
}

function sanitizeTimezoneZone(zone) {
    return groupStateService.sanitizeTimezoneZone(zone);
}

function isValidTimeZone(zoneName) {
    return groupStateService.isValidTimeZone(zoneName);
}

function sanitizeGroup(group, idx, legacyMultiState = null) {
    return groupStateService.sanitizeGroup(group, idx, legacyMultiState);
}

async function loadPersistence() {
    return persistenceService.loadPersistence();
}

// --- End of main.js ---


