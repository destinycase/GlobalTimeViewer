let isRealtime = true;
if (typeof window !== "undefined" && window) window.isRealtime = isRealtime;
let globalTimes = [new Date(), new Date()];
let slotCount = 1;
let uiScale = 1.0;
let showCopyFormat = false;
let showTimeline = false;
const GTV_MAIN_CONSTANTS = (typeof window !== "undefined" ? window.GTVMainConstants : globalThis.GTVMainConstants);
if (!GTV_MAIN_CONSTANTS || typeof GTV_MAIN_CONSTANTS !== "object") {
    throw new Error("Missing required module: GTVMainConstants");
}
const COPY_FORMAT_KEYS = [...(GTV_MAIN_CONSTANTS.COPY_FORMAT_KEYS || [])];
const TIME_PART_KEYS = [...(GTV_MAIN_CONSTANTS.TIME_PART_KEYS || [])];
const PERIOD_RESULT_IDS = new Set(GTV_MAIN_CONSTANTS.PERIOD_RESULT_IDS || []);
const TIMELINE_TOTAL_HOURS = Number(GTV_MAIN_CONSTANTS.TIMELINE_TOTAL_HOURS || 24);
const TIMELINE_TOTAL_SECONDS = Number(GTV_MAIN_CONSTANTS.TIMELINE_TOTAL_SECONDS || (24 * 60 * 60));
const MAIN_TABS = [...(GTV_MAIN_CONSTANTS.MAIN_TABS || [])];
const DEFAULT_REALTIME_TICK_MS = 1000;
const requestUiFrame = (typeof requestAnimationFrame === "function")
    ? requestAnimationFrame.bind(globalThis)
    : ((cb) => setTimeout(cb, 16));
const cancelUiFrame = (typeof cancelAnimationFrame === "function")
    ? cancelAnimationFrame.bind(globalThis)
    : ((id) => clearTimeout(id));
const MIN_TIME_ADJUST_DAY_STEP = Number(GTV_MAIN_CONSTANTS.MIN_TIME_ADJUST_DAY_STEP || 1);
const MAX_TIME_ADJUST_DAY_STEP = Number(GTV_MAIN_CONSTANTS.MAX_TIME_ADJUST_DAY_STEP || 36500);
const DEFAULT_TIME_ADJUST_DAY_STEP = Number(GTV_MAIN_CONSTANTS.DEFAULT_TIME_ADJUST_DAY_STEP || 1);
const MIN_MULTI_RANGE_COUNT = Number(GTV_MAIN_CONSTANTS.MIN_MULTI_RANGE_COUNT || 1);
const MAX_MULTI_RANGE_COUNT = Number(GTV_MAIN_CONSTANTS.MAX_MULTI_RANGE_COUNT || 12);
const MIN_FIXED_TIME_SLOT_COUNT = Number(GTV_MAIN_CONSTANTS.MIN_FIXED_TIME_SLOT_COUNT || 1);
const MAX_FIXED_TIME_SLOT_COUNT = Number(GTV_MAIN_CONSTANTS.MAX_FIXED_TIME_SLOT_COUNT || 5);
const DEFAULT_FIXED_TIME_VALUE = String(GTV_MAIN_CONSTANTS.DEFAULT_FIXED_TIME_VALUE || "09:00");
const DEFAULT_MULTI_RANGE_TITLE = String(GTV_MAIN_CONSTANTS.DEFAULT_MULTI_RANGE_TITLE || "Range");
const DEFAULT_DISPLAY_FORMAT_ENABLED = { ...(GTV_MAIN_CONSTANTS.DEFAULT_DISPLAY_FORMAT_ENABLED || {}) };
const DEFAULT_COPY_FORMAT_ENABLED = { ...(GTV_MAIN_CONSTANTS.DEFAULT_COPY_FORMAT_ENABLED || {}) };
const DEFAULT_DISPLAY_TIME_PARTS_ENABLED = { ...(GTV_MAIN_CONSTANTS.DEFAULT_DISPLAY_TIME_PARTS_ENABLED || {}) };
const DEFAULT_COPY_TIME_PARTS_ENABLED = { ...(GTV_MAIN_CONSTANTS.DEFAULT_COPY_TIME_PARTS_ENABLED || {}) };
const FORMAT_PROFILE_CONTEXT_KEYS = [...(GTV_MAIN_CONSTANTS.FORMAT_PROFILE_CONTEXT_KEYS || [])];

let displayFormatOrder = [...COPY_FORMAT_KEYS];
let displayFormatEnabled = { ...DEFAULT_DISPLAY_FORMAT_ENABLED };
let copyFormatOrder = [...COPY_FORMAT_KEYS];
let copyFormatEnabled = { ...DEFAULT_COPY_FORMAT_ENABLED };
let displayTimePartsEnabled = { ...DEFAULT_DISPLAY_TIME_PARTS_ENABLED };
let copyTimePartsEnabled = { ...DEFAULT_COPY_TIME_PARTS_ENABLED };
let formatProfiles = {};
let activeFormatProfileContext = "live";
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
let fixedTimeIdSeed = 0;
let groups = [];
let activeGroupId = 0;
let appFeedbackService = null;
let calculatorActionsService = null;
let multiStateService = null;
let groupStateService = null;
let mainPersistenceSnapshotService = null;
let mainClockOrchestratorService = null;
let mainTimezoneRuntimeService = null;
let mainTimezoneMutationService = null;
let mainBaseTimezoneService = null;
let persistenceServices = null;
let persistenceService = null;
let settingsIoService = null;
let dataTransferService = null;

function setIsRealtimeState(next) {
    isRealtime = !!next;
    if (typeof window !== "undefined" && window) window.isRealtime = isRealtime;
    return isRealtime;
}

function applyVersionBranding() {
    const titleText = `Global Time Viwer v${VERSION}`;
    document.title = titleText;
    const badge = document.getElementById("version-badge");
    if (badge) badge.textContent = `ver ${VERSION}`;
}

const MAX_RUNTIME_CACHE_SIZE = 4096;
const timezoneOffsetCache = new Map();
const timezoneDstCache = new Map();
const zoneAbbrCache = new Map();
const rowViewCache = new Map();
const GTV_MAIN_MODULE_RESOLVER = (typeof window !== "undefined"
    ? window.GTVMainModuleResolver
    : globalThis.GTVMainModuleResolver);
if (!GTV_MAIN_MODULE_RESOLVER || typeof GTV_MAIN_MODULE_RESOLVER.resolveModules !== "function") {
    throw new Error("Missing required module API: GTVMainModuleResolver.resolveModules");
}
const GTV_MAIN_MODULE_SPEC = (typeof window !== "undefined"
    ? window.GTVMainModuleSpec
    : globalThis.GTVMainModuleSpec);
if (!GTV_MAIN_MODULE_SPEC || typeof GTV_MAIN_MODULE_SPEC.createSpecMap !== "function") {
    throw new Error("Missing required module API: GTVMainModuleSpec.createSpecMap");
}
const {
    GTV_SERVICE_BOOTSTRAP,
    GTV_APP_STATE_PATCHER,
    GTV_TIME_SERVICE,
    GTV_TIME_CORE,
    GTV_TIME_INPUT_MUTATIONS,
    GTV_TIMER_ENGINE,
    GTV_CALCULATOR,
    GTV_CALCULATOR_ACTIONS,
    GTV_MULTI_STATE,
    GTV_IMAGE_EXPORT,
    GTV_IMAGE_EXPORT_ACTIONS,
    GTV_IMAGE_EXPORT_BRIDGE,
    GTV_IMAGE_EXPORT_NAMING,
    GTV_IMAGE_CLONE,
    GTV_IMAGE_FOREIGN_RENDER,
    GTV_TABLE_IMAGE_RENDER,
    GTV_GROUP_STATE,
    GTV_GROUP_CONTEXT_STATE,
    GTV_GROUP_TABS,
    GTV_TIMEZONE_SEARCH,
    GTV_SNAPSHOT_FORMAT,
    GTV_TABLE_RENDER,
    GTV_MULTI_RANGE_STATE,
    GTV_MULTI_RANGE_RENDER,
    GTV_MULTI_RANGE_IMAGE_RENDER,
    GTV_MULTI_RANGE_COPY,
    GTV_COPY_ACTIONS,
    GTV_TIME_ADJUST_UI,
    GTV_TIME_ADJUST_ACTIONS,
    GTV_MULTI_BULK_TOOLS,
    GTV_TIMELINE_FRAME,
    GTV_FIXED_TIME_CORE,
    GTV_FIXED_TIME_SLOT_UTILS,
    GTV_FIXED_TIME_STATE,
    GTV_FIXED_TIME_TIMELINE,
    GTV_FIXED_TIME_ACTIONS,
    GTV_FIXED_TIME_TABLE,
    GTV_FORMAT_PROFILE_STATE,
    GTV_FORMAT_CONTROLS,
    GTV_TAB_UI,
    GTV_TAB_ORCHESTRATOR,
    GTV_UI_SETTINGS_ACTIONS,
    GTV_APP_PERSISTENCE_STATE,
    GTV_PERSISTENCE_SERVICE_BUNDLE,
    GTV_STATE_PERSISTENCE,
    GTV_UI_PREFERENCES_STATE,
    GTV_SETTINGS_IO,
    GTV_DATA_TRANSFER,
    GTV_APP_CONFIG,
    GTV_TIMEZONE_DATA,
    GTV_MAIN_UI_INIT,
    GTV_MAIN_UI_UTILS,
    GTV_APP_FEEDBACK,
    GTV_MAIN_FOUNDATION_SERVICES,
    GTV_MAIN_APP_STATE_SERVICES,
    GTV_MAIN_PERSISTENCE_SERVICES,
    GTV_MAIN_GROUP_TABS_SERVICE,
    GTV_MAIN_IMAGE_RUNTIME_SERVICES,
    GTV_MAIN_IMAGE_EXPORT_SERVICES,
    GTV_MAIN_IMAGE_EXPORT_BRIDGE_PROXY,
    GTV_MAIN_IMAGE_EXPORT_NAMING_PROXY,
    GTV_MAIN_ROW_ORDER_SERVICES,
    GTV_MAIN_ROW_VIEW_SERVICES,
    GTV_MAIN_SELECT_SERVICES,
    GTV_MAIN_GROUP_LOCALIZATION_SERVICES,
    GTV_MAIN_PERSISTENCE_SNAPSHOT_SERVICES,
    GTV_MAIN_PERSISTENCE_COMPOSITION_SERVICES,
    GTV_MAIN_CLOCK_ORCHESTRATOR_SERVICES,
    GTV_MAIN_TIMEZONE_RUNTIME_SERVICES,
    GTV_MAIN_TIMEZONE_MUTATION_SERVICES,
    GTV_MAIN_BASE_TIMEZONE_SERVICES,
    GTV_MAIN_RUNTIME_COMPOSITION_SERVICES,
    GTV_MAIN_FIXED_TIME_SERVICES,
    GTV_MAIN_MULTI_RANGE_SERVICES,
    GTV_MAIN_TIME_ADJUST_SERVICES,
    GTV_MAIN_TAB_SERVICES,
    GTV_MAIN_GROUP_STATE_SERVICES,
    GTV_MAIN_UI_RUNTIME_SERVICES
} = GTV_MAIN_MODULE_RESOLVER.resolveModules(GTV_MAIN_MODULE_SPEC.createSpecMap());

const TZ_DATABASE = GTV_TIMEZONE_DATA.TZ_DATABASE;
const ZONE_MAP = GTV_TIMEZONE_DATA.ZONE_MAP;

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
const mainFoundationServices = GTV_MAIN_FOUNDATION_SERVICES.createService({
    GTV_SERVICE_BOOTSTRAP,
    GTV_PERSISTENCE_SERVICE_BUNDLE,
    GTV_MAIN_UI_UTILS,
    GTV_APP_FEEDBACK,
    GTV_CALCULATOR_ACTIONS,
    GTV_TAB_UI,
    GTV_TAB_ORCHESTRATOR,
    GTV_GROUP_STATE,
    GTV_STATE_PERSISTENCE,
    GTV_SETTINGS_IO,
    GTV_DATA_TRANSFER,
    GTV_UI_SETTINGS_ACTIONS,
    GTV_CALCULATOR,
    PERIOD_RESULT_IDS,
    t: (...args) => t(...args),
    showToast: (...args) => showToast(...args),
    getPersistenceService: () => persistenceService,
    confirmFn: (message) => confirm(message),
    locationRef: (typeof location === "object" && location) ? location : null,
    documentRef: (typeof document === "object" && document) ? document : null,
    logError: (...args) => console.error(...args)
});
const serviceBootstrap = mainFoundationServices.serviceBootstrap;
const persistenceServiceBundleFactory = mainFoundationServices.persistenceServiceBundleFactory;
const mainUiUtilsService = mainFoundationServices.mainUiUtilsService;
appFeedbackService = mainFoundationServices.appFeedbackService;
calculatorActionsService = mainFoundationServices.calculatorActionsService;
const setCustomTooltip = mainFoundationServices.setCustomTooltip;
const upgradeNativeTitleTooltips = mainFoundationServices.upgradeNativeTitleTooltips;
const hideFloatingTooltip = mainFoundationServices.hideFloatingTooltip;
const bindFloatingTooltipEvents = mainFoundationServices.bindFloatingTooltipEvents;
const clearDragGhost = mainFoundationServices.clearDragGhost;
const createDragGhostFromRow = mainFoundationServices.createDragGhostFromRow;
const groupContextStateService = GTV_GROUP_CONTEXT_STATE.createService({
    MAIN_TABS,
    getGroups: () => groups,
    getState: () => ({
        currentMainTab,
        activeGroupId,
        activeGroupIdByMainTab
    }),
    setState: (next = {}) => {
        if (!next || typeof next !== "object") return;
        if (Object.prototype.hasOwnProperty.call(next, "currentMainTab")) currentMainTab = next.currentMainTab;
        if (Object.prototype.hasOwnProperty.call(next, "activeGroupId")) activeGroupId = next.activeGroupId;
        if (Object.prototype.hasOwnProperty.call(next, "activeGroupIdByMainTab")) activeGroupIdByMainTab = next.activeGroupIdByMainTab;
    },
    getUTCRef: (...args) => getUTCRef(...args),
    sanitizeUtcRowOrder: (...args) => GTV_TIME_CORE.sanitizeUtcRowOrder(...args)
});
const formatProfileStateService = GTV_FORMAT_PROFILE_STATE.createService({
    COPY_FORMAT_KEYS,
    TIME_PART_KEYS,
    FORMAT_PROFILE_CONTEXT_KEYS,
    DEFAULT_DISPLAY_FORMAT_ENABLED,
    DEFAULT_COPY_FORMAT_ENABLED,
    DEFAULT_DISPLAY_TIME_PARTS_ENABLED,
    DEFAULT_COPY_TIME_PARTS_ENABLED,
    sanitizeMainTab,
    getState: () => ({
        displayFormatOrder,
        displayFormatEnabled,
        displayTimePartsEnabled,
        copyFormatOrder,
        copyFormatEnabled,
        copyTimePartsEnabled,
        formatProfiles,
        activeFormatProfileContext,
        currentMainTab,
        slotCount
    }),
    setState: (next = {}) => {
        if (!next || typeof next !== "object") return;
        if (Object.prototype.hasOwnProperty.call(next, "displayFormatOrder")) displayFormatOrder = next.displayFormatOrder;
        if (Object.prototype.hasOwnProperty.call(next, "displayFormatEnabled")) displayFormatEnabled = next.displayFormatEnabled;
        if (Object.prototype.hasOwnProperty.call(next, "displayTimePartsEnabled")) displayTimePartsEnabled = next.displayTimePartsEnabled;
        if (Object.prototype.hasOwnProperty.call(next, "copyFormatOrder")) copyFormatOrder = next.copyFormatOrder;
        if (Object.prototype.hasOwnProperty.call(next, "copyFormatEnabled")) copyFormatEnabled = next.copyFormatEnabled;
        if (Object.prototype.hasOwnProperty.call(next, "copyTimePartsEnabled")) copyTimePartsEnabled = next.copyTimePartsEnabled;
        if (Object.prototype.hasOwnProperty.call(next, "formatProfiles")) formatProfiles = next.formatProfiles;
        if (Object.prototype.hasOwnProperty.call(next, "activeFormatProfileContext")) activeFormatProfileContext = next.activeFormatProfileContext;
    }
});
const multiRangeStateService = GTV_MULTI_RANGE_STATE.createService({
    MIN_MULTI_RANGE_COUNT,
    MAX_MULTI_RANGE_COUNT,
    DEFAULT_MULTI_RANGE_TITLE,
    t,
    showToast,
    sanitizeUtcMs: (value, fallbackMs) => GTV_TIME_CORE.sanitizeUtcMs(value, fallbackMs),
    getGlobalTimes: () => globalTimes,
    getState: () => ({
        multiRangeCount,
        multiRangeTitle,
        multiRanges,
        multiRangeCollapsed,
        multiRangeStartEditEnabled,
        multiRangeEndEditEnabled
    }),
    setState: (next = {}) => {
        if (!next || typeof next !== "object") return;
        if (Object.prototype.hasOwnProperty.call(next, "multiRangeCount")) multiRangeCount = next.multiRangeCount;
        if (Object.prototype.hasOwnProperty.call(next, "multiRangeTitle")) multiRangeTitle = next.multiRangeTitle;
        if (Object.prototype.hasOwnProperty.call(next, "multiRanges")) multiRanges = next.multiRanges;
        if (Object.prototype.hasOwnProperty.call(next, "multiRangeCollapsed")) multiRangeCollapsed = next.multiRangeCollapsed;
        if (Object.prototype.hasOwnProperty.call(next, "multiRangeStartEditEnabled")) multiRangeStartEditEnabled = next.multiRangeStartEditEnabled;
        if (Object.prototype.hasOwnProperty.call(next, "multiRangeEndEditEnabled")) multiRangeEndEditEnabled = next.multiRangeEndEditEnabled;
    },
    isMultiTab,
    renderMultiRanges: () => multiRangeRenderService.renderMultiRanges(),
    savePersistence: () => persistenceService.savePersistence()
});
const fixedTimeSlotUtilsService = GTV_FIXED_TIME_SLOT_UTILS.createService({
    MIN_FIXED_TIME_SLOT_COUNT,
    MAX_FIXED_TIME_SLOT_COUNT,
    DEFAULT_FIXED_TIME_VALUE,
    t: (...args) => t(...args),
    pad: (...args) => GTV_TIME_CORE.pad(...args),
    parseDateTimeParts,
    buildStrictUtcDateFromParts,
    getCurrentGroup: (...args) => getCurrentGroup(...args),
    getNextFixedTimeSeed: () => {
        fixedTimeIdSeed += 1;
        return fixedTimeIdSeed;
    }
});
const fixedTimeStateService = GTV_FIXED_TIME_STATE.createService({
    MIN_FIXED_TIME_SLOT_COUNT,
    MAX_FIXED_TIME_SLOT_COUNT,
    t: (...args) => t(...args),
    showToast: (...args) => showToast(...args),
    getCurrentGroup,
    ensureGroupFixedTimes,
    sanitizeFixedDateValue,
    sanitizeFixedTimeSlotCount,
    isFixedTimeTab,
    renderFixedTimeTab,
    renderTimelineFrame,
    savePersistence: () => persistenceService.savePersistence(),
    createUniqueFixedTimeId,
    createDefaultFixedTimeSlot
});
const uiPreferencesStateService = GTV_UI_PREFERENCES_STATE.createService({
    MIN_UI_SCALE_PERCENT,
    MAX_UI_SCALE_PERCENT,
    DEFAULT_UI_SCALE_PERCENT,
    UI_SCALE_PERCENT_OPTIONS,
    THEME_LIST,
    THEME_STORAGE_KEY,
    UI_SCALE_STORAGE_KEY,
    I18N_DATA,
    getStorageValue: (...args) => persistenceService.getStorageValue(...args),
    setStorageValue: (...args) => persistenceService.setStorageValue(...args),
    getState: () => ({
        uiScale,
        currentTheme,
        currentLang
    }),
    setState: (next = {}) => {
        if (!next || typeof next !== "object") return;
        if (Object.prototype.hasOwnProperty.call(next, "uiScale")) uiScale = next.uiScale;
        if (Object.prototype.hasOwnProperty.call(next, "currentTheme")) currentTheme = next.currentTheme;
        if (Object.prototype.hasOwnProperty.call(next, "currentLang")) currentLang = next.currentLang;
    }
});
const timerEngineService = GTV_TIMER_ENGINE.createService({
    DEFAULT_REALTIME_TICK_MS,
    shouldTick: () => isRealtime,
    onTick: () => {
        globalTimes[0] = new Date();
        updateClocks();
    },
    setIntervalFn: (cb, ms) => setInterval(cb, ms),
    clearIntervalFn: (id) => clearInterval(id)
});

// Initialize timeService and commonUtils once at a higher scope
const timeService = GTV_TIME_SERVICE.createService({
    luxon: (typeof window !== "undefined" ? window.luxon : globalThis.luxon)
});
const commonUtils = Object.freeze({});

// --- INTEGRATED CORE UTILITIES ---

/**
 * Prepare shared canvas state for table image export.
 */
function prepareExportCanvas(sourceWidth, sourceHeight, pageBg) {
    const targetWidth = TABLE_IMAGE_EXPORT_WIDTH;
    const renderRatio = targetWidth / Math.max(1, sourceWidth);
    const targetHeight = Math.max(1, Math.round(sourceHeight * renderRatio));

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context unavailable");

    ctx.scale(renderRatio, renderRatio);
    ctx.fillStyle = pageBg;
    ctx.fillRect(0, 0, sourceWidth, sourceHeight);

    return { canvas, ctx, renderRatio, targetWidth, targetHeight };
}

/**
 * Draw text in an export cell with shared styling options.
 */
function drawExportCellText(ctx, text, x, y, w, h, options = {}) {
    const {
        align = "left",
        color = "#f1f5f9",
        font = "13px Arial",
        clip = false,
        padX = 8
    } = options;

    ctx.save();
    if (clip) {
        ctx.beginPath();
        ctx.rect(x + 2, y + 1, Math.max(0, w - 4), Math.max(0, h - 2));
        ctx.clip();
    }

    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textBaseline = "middle";

    if (align === "center") {
        ctx.textAlign = "center";
        ctx.fillText(text, x + (w / 2), y + (h / 2));
    } else {
        ctx.textAlign = "left";
        ctx.fillText(text, x + padX, y + (h / 2));
    }
    ctx.restore();
}

/**
 * Parse date/time input into numeric parts based on input mode.
 */
function parseDateTimeParts(val, inputMode) {
    const normalized = (val || "").trim();
    if (!normalized) return null;

    const patterns = {
        datetime: /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/,
        date: /^(\d{4})-(\d{2})-(\d{2})$/,
        time: /^(\d{2}):(\d{2}):(\d{2})$/
    };

    const match = normalized.match(patterns[inputMode]);
    if (!match) return null;

    return match.slice(1).map(Number);
}


function getTimeAdjustDayStep(slotIdx) {
    if (typeof timeAdjustUiService !== "undefined") {
        return timeAdjustUiService.getTimeAdjustDayStep(slotIdx);
    }
    const idx = Number.isInteger(slotIdx) ? slotIdx : 0;
    return timeAdjustDayStepBySlot[idx] || DEFAULT_TIME_ADJUST_DAY_STEP;
}

function setTimeAdjustDayStep(slotIdx, value) {
    if (typeof timeAdjustUiService !== "undefined") {
        return timeAdjustUiService.setTimeAdjustDayStep(slotIdx, value);
    }
    const idx = Number.isInteger(slotIdx) ? slotIdx : 0;
    timeAdjustDayStepBySlot[idx] = value;
}


function getUTCRef() {
    return { id: "utc", type: "standard", zone: "UTC", name: t("utc_name") };
}

function getCurrentGroup() {
    return groupContextStateService.getCurrentGroup();
}

function getCurrentGroupZones() {
    return groupContextStateService.getCurrentGroupZones();
}

function getCurrentGroupBaseTimezoneId() {
    return groupContextStateService.getCurrentGroupBaseTimezoneId();
}

function getBaseTimezoneRef() {
    return groupContextStateService.getBaseTimezoneRef();
}

function ensureBaseTimezoneSelection() {
    return groupContextStateService.ensureBaseTimezoneSelection();
}

function getUtcMinuteCacheKey(date) {
    if (!mainTimezoneRuntimeService || typeof mainTimezoneRuntimeService.getUtcMinuteCacheKey !== "function") {
        const safeDate = (date instanceof Date && Number.isFinite(date.getTime())) ? date : new Date();
        return [
            safeDate.getUTCFullYear(),
            safeDate.getUTCMonth(),
            safeDate.getUTCDate(),
            safeDate.getUTCHours(),
            safeDate.getUTCMinutes()
        ].join(":");
    }
    return mainTimezoneRuntimeService.getUtcMinuteCacheKey(date);
}

function setCappedRuntimeCache(cache, key, value) {
    if (!mainTimezoneRuntimeService || typeof mainTimezoneRuntimeService.setCappedRuntimeCache !== "function") {
        if (!(cache instanceof Map)) return;
        if (cache.size >= MAX_RUNTIME_CACHE_SIZE) cache.clear();
        cache.set(key, value);
        return;
    }
    mainTimezoneRuntimeService.setCappedRuntimeCache(cache, key, value);
}

function getZoneAbbreviation(tz, date = globalTimes[0]) {
    if (!mainTimezoneRuntimeService || typeof mainTimezoneRuntimeService.getZoneAbbreviation !== "function") return "";
    return mainTimezoneRuntimeService.getZoneAbbreviation(tz, date);
}

function getBetterAbbr(zone, date) {
    if (!mainTimezoneRuntimeService || typeof mainTimezoneRuntimeService.getBetterAbbr !== "function") return "";
    return mainTimezoneRuntimeService.getBetterAbbr(zone, date);
}

function isTimeZoneInDST(zone, date) {
    if (!mainTimezoneRuntimeService || typeof mainTimezoneRuntimeService.isTimeZoneInDST !== "function") return false;
    return mainTimezoneRuntimeService.isTimeZoneInDST(zone, date);
}

function getTimezoneOffset(zone, date) {
    if (!mainTimezoneRuntimeService || typeof mainTimezoneRuntimeService.getTimezoneOffset !== "function") return 0;
    return mainTimezoneRuntimeService.getTimezoneOffset(zone, date);
}

function getFixedOffsetForDisplayAtDate(tz, anchorDate) {
    if (!mainTimezoneRuntimeService || typeof mainTimezoneRuntimeService.getFixedOffsetForDisplayAtDate !== "function") {
        if (!tz || tz.type !== "standard" || !tz.zone || tz.zone === "UTC") return null;
        const raw = tz.fixedOffsetMinutes;
        if (raw === null || raw === undefined || raw === "") return null;
        const parsed = Number(raw);
        if (!Number.isFinite(parsed)) return null;
        return Math.min(14 * 60, Math.max(-14 * 60, Math.trunc(parsed)));
    }
    return mainTimezoneRuntimeService.getFixedOffsetForDisplayAtDate(tz, anchorDate);
}

function getFixedOffsetForDisplay(tz) {
    if (!mainTimezoneRuntimeService || typeof mainTimezoneRuntimeService.getFixedOffsetForDisplay !== "function") {
        return getFixedOffsetForDisplayAtDate(tz, globalTimes[0]);
    }
    return mainTimezoneRuntimeService.getFixedOffsetForDisplay(tz);
}

function getLocalizedTZLabel(tzData) {
    if (!mainTimezoneRuntimeService || typeof mainTimezoneRuntimeService.getLocalizedTZLabel !== "function") {
        if (currentLang === "en") return `${tzData.name_en} - ${tzData.city_en}`;
        return `${tzData.name} - ${tzData.city}`;
    }
    return mainTimezoneRuntimeService.getLocalizedTZLabel(tzData);
}

const pad = GTV_TIME_CORE.pad;
const clampNumber = GTV_TIME_CORE.clampNumber;
function getCustomOffsetMinutes(tz) {
    const safeTimezone = (tz && typeof tz === "object") ? tz : {};
    return GTV_TIME_CORE.getCustomOffsetMinutes(safeTimezone);
}

function getLocalPartsByTimezone(date, tz, fixedOffsetMinutes = null) {
    const zone = tz.type === "custom" ? "CUSTOM" : (tz.zone || "UTC");
    const offset = tz.type === "custom" ? getCustomOffsetMinutes(tz) : fixedOffsetMinutes;
    const p = timeService.resolveLocalDateParts(date, zone, tz.id, offset);
    return { year: p.Y, month: p.M, day: p.D, hour: p.H, minute: p.min, second: p.S };
}

function getUTCDateFromLocalParts(parts, tz, fixedOffsetMinutes = null) {
    const zone = tz.type === "custom" ? "CUSTOM" : (tz.zone || "UTC");
    const offset = tz.type === "custom" ? getCustomOffsetMinutes(tz) : fixedOffsetMinutes;
    return timeService.fromLocalPartsToUtc(parts, zone, offset);
}

function formatUtcOffsetLabel(totalMinutes = 0) {
    const safeMinutes = Number.isFinite(totalMinutes) ? totalMinutes : 0;
    return timezoneSearchService.formatUtcOffsetLabel(safeMinutes);
}

function normalizeCustomAbbr(value) {
    const trimmed = (value || "").trim();
    if (!trimmed) return t("label_custom");
    return trimmed.toUpperCase().slice(0, 12);
}
mainTimezoneRuntimeService = GTV_MAIN_TIMEZONE_RUNTIME_SERVICES.createService({
    maxRuntimeCacheSize: MAX_RUNTIME_CACHE_SIZE,
    timezoneOffsetCache,
    timezoneDstCache,
    zoneAbbrCache,
    getBaseTime: () => globalTimes[0],
    getZoneMap: () => ZONE_MAP,
    getTzDatabase: () => TZ_DATABASE,
    getTimeService: () => timeService,
    normalizeCustomAbbr: (...args) => normalizeCustomAbbr(...args),
    getTimezoneSearchService: () => timezoneSearchService,
    formatUtcOffsetLabel: (...args) => formatUtcOffsetLabel(...args),
    getCurrentLang: () => currentLang,
    t,
    resolveLocalizedTZLabel: (tzData) => getLocalizedTZLabel(tzData)
});

function sanitizeTimezoneId(value) {
    if (value == null) return "";
    return GTV_TIME_CORE.sanitizeTimezoneId(value);
}

function sanitizeBaseTimezoneId(value) {
    if (value == null) return "utc";
    return GTV_TIME_CORE.sanitizeBaseTimezoneId(value);
}

function setCurrentGroupBaseTimezoneId(value) {
    if (!mainBaseTimezoneService || typeof mainBaseTimezoneService.setCurrentGroupBaseTimezoneId !== "function") return false;
    return mainBaseTimezoneService.setCurrentGroupBaseTimezoneId(value);
}

function applyCurrentGroupBaseTimezoneId(nextBaseId, options = {}) {
    if (!mainBaseTimezoneService || typeof mainBaseTimezoneService.applyCurrentGroupBaseTimezoneId !== "function") return;
    mainBaseTimezoneService.applyCurrentGroupBaseTimezoneId(nextBaseId, options);
}

function getUsedTimezoneIds() {
    if (!mainTimezoneMutationService || typeof mainTimezoneMutationService.getUsedTimezoneIds !== "function") {
        return new Set(["utc"]);
    }
    return mainTimezoneMutationService.getUsedTimezoneIds();
}

function createUniqueTimezoneId(prefix = "tz") {
    if (!mainTimezoneMutationService || typeof mainTimezoneMutationService.createUniqueTimezoneId !== "function") {
        return `${prefix || "tz"}-${Date.now()}-${Math.floor(Math.random() * 1000000000)}`;
    }
    return mainTimezoneMutationService.createUniqueTimezoneId(prefix);
}

function getCurrentMultiRangeStateSnapshot() {
    const patchedState = getPatchedAppStateSnapshot();
    if (patchedState && typeof patchedState === "object") {
        return {
            multiRangeCount: patchedState.multiRangeCount,
            multiRanges: patchedState.multiRanges,
            multiRangeCollapsed: patchedState.multiRangeCollapsed,
            multiRangeStartEditEnabled: patchedState.multiRangeStartEditEnabled,
            multiRangeEndEditEnabled: patchedState.multiRangeEndEditEnabled,
            multiRangeTitle: patchedState.multiRangeTitle
        };
    }
    return {
        multiRangeCount,
        multiRanges,
        multiRangeCollapsed,
        multiRangeStartEditEnabled,
        multiRangeEndEditEnabled,
        multiRangeTitle
    };
}

mainBaseTimezoneService = GTV_MAIN_BASE_TIMEZONE_SERVICES.createService({
    getCurrentGroup,
    sanitizeBaseTimezoneId,
    renderList: () => renderList(),
    renderTimelineFrame: () => renderTimelineFrame(),
    updateTimeAdjustPanel: () => {
        if (timeAdjustUiService && typeof timeAdjustUiService.updateTimeAdjustPanel === "function") {
            timeAdjustUiService.updateTimeAdjustPanel();
        }
    },
    savePersistence: () => {
        if (persistenceService && typeof persistenceService.savePersistence === "function") {
            persistenceService.savePersistence();
        }
    }
});

const mainGroupLocalizationServices = GTV_MAIN_GROUP_LOCALIZATION_SERVICES.createService({
    getGroups: () => groups,
    getCurrentGroup,
    getMultiStateService: () => multiStateService,
    t,
    getMultiRangeState: () => getCurrentMultiRangeStateSnapshot(),
    setMultiRangeState: (next = {}) => {
        if (!next || typeof next !== "object") return;
        patchAppState(next);
    },
    sanitizeMultiRangeCount,
    sanitizeMultiRangeTitle,
    sanitizeUtcMs: (value, fallbackMs) => GTV_TIME_CORE.sanitizeUtcMs(value, fallbackMs),
    ensureMultiRangeState,
    refreshMultiRangeControls,
    now: () => Date.now()
});
const {
    parseAutoGeneratedIndexedName,
    localizeAutoGeneratedNamesForCurrentLanguage,
    getCurrentMultiSubgroup,
    getCurrentMultiSubgroupName,
    syncCurrentMultiStateToActiveSubgroup,
    loadCurrentMultiStateFromActiveSubgroup
} = mainGroupLocalizationServices;
mainTimezoneMutationService = GTV_MAIN_TIMEZONE_MUTATION_SERVICES.createService({
    getGroups: () => groups,
    getCurrentGroup,
    getCurrentGroupBaseTimezoneId,
    sanitizeTimezoneId,
    getNextTimezoneIdSeed: () => {
        timezoneIdSeed = (timezoneIdSeed + 1) % 1000000;
        return timezoneIdSeed;
    },
    getNow: () => Date.now(),
    getRandomUUID: () => {
        if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
            return crypto.randomUUID();
        }
        return "";
    },
    getRandom: () => Math.random(),
    getGroupStateService: () => groupStateService,
    normalizeCustomAbbr,
    showToast,
    t,
    savePersistence: () => {
        if (persistenceService && typeof persistenceService.savePersistence === "function") {
            persistenceService.savePersistence();
        }
    },
    renderList: () => renderList(),
    renderTimelineFrame: () => renderTimelineFrame()
});

function isCurrentGroupUtcRowVisible() {
    return groupContextStateService.isCurrentGroupUtcRowVisible();
}

function getCurrentGroupUtcRowOrder() {
    return groupContextStateService.getCurrentGroupUtcRowOrder();
}

function getZoneDisplayName(tz) {
    if (!mainTimezoneRuntimeService || typeof mainTimezoneRuntimeService.getZoneDisplayName !== "function") return "";
    return mainTimezoneRuntimeService.getZoneDisplayName(tz);
}

function getZoneDisplayNameForUiAtDate(tz, anchorDate = globalTimes[0]) {
    if (!mainTimezoneRuntimeService || typeof mainTimezoneRuntimeService.getZoneDisplayNameForUiAtDate !== "function") {
        return getZoneDisplayName(tz);
    }
    return mainTimezoneRuntimeService.getZoneDisplayNameForUiAtDate(tz, anchorDate);
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}



function getDefaultFormatEnabled(mode = "display") {
    return formatProfileStateService.getDefaultFormatEnabled(mode);
}

function getDefaultTimePartsEnabled(mode = "display") {
    return formatProfileStateService.getDefaultTimePartsEnabled(mode);
}

function normalizeCopyFormatKey(rawKey) {
    return formatProfileStateService.normalizeCopyFormatKey(rawKey);
}

function sanitizeCopyFormatOrder(order) {
    return formatProfileStateService.sanitizeCopyFormatOrder(order);
}

function sanitizeCopyFormatEnabled(enabled, mode = "display") {
    return formatProfileStateService.sanitizeCopyFormatEnabled(enabled, mode);
}

function sanitizeTimePartsEnabled(parts, mode = "display") {
    return formatProfileStateService.sanitizeTimePartsEnabled(parts, mode);
}

function deriveTimePartsFromLegacyEnabled(legacyEnabled, mode = "display") {
    return formatProfileStateService.deriveTimePartsFromLegacyEnabled(legacyEnabled, mode);
}

function sanitizeFormatProfileContext(context) {
    return formatProfileStateService.sanitizeFormatProfileContext(context);
}

function getFormatProfileAllowedKeys(context = activeFormatProfileContext) {
    return formatProfileStateService.getFormatProfileAllowedKeys(context);
}

function getFormatProfileAllowedTimePartKeys(context = activeFormatProfileContext) {
    return formatProfileStateService.getFormatProfileAllowedTimePartKeys(context);
}

function sanitizeCopyFormatOrderForContext(order, context = activeFormatProfileContext) {
    return formatProfileStateService.sanitizeCopyFormatOrderForContext(order, context);
}

function getDefaultFormatEnabledForContext(mode = "display", context = activeFormatProfileContext) {
    return formatProfileStateService.getDefaultFormatEnabledForContext(mode, context);
}

function sanitizeCopyFormatEnabledForContext(enabled, mode = "display", context = activeFormatProfileContext) {
    return formatProfileStateService.sanitizeCopyFormatEnabledForContext(enabled, mode, context);
}

function sanitizeTimePartsEnabledForContext(parts, mode = "display", context = activeFormatProfileContext) {
    return formatProfileStateService.sanitizeTimePartsEnabledForContext(parts, mode, context);
}

function createDefaultFormatProfile(context = "live") {
    return formatProfileStateService.createDefaultFormatProfile(context);
}

function sanitizeFormatProfile(profile, context = activeFormatProfileContext) {
    return formatProfileStateService.sanitizeFormatProfile(profile, context);
}

function sanitizeFormatProfiles(rawProfiles = null, legacyProfile = null) {
    return formatProfileStateService.sanitizeFormatProfiles(rawProfiles, legacyProfile);
}

function getCurrentFormatProfileState() {
    return formatProfileStateService.getCurrentFormatProfileState();
}

function resolveFormatProfileContext(tab = currentMainTab, effectiveSlotCount = slotCount) {
    return formatProfileStateService.resolveFormatProfileContext(tab, effectiveSlotCount);
}

function ensureFormatProfiles(legacyProfile = null) {
    return formatProfileStateService.ensureFormatProfiles(legacyProfile);
}

function applyFormatProfileState(profile, context = activeFormatProfileContext) {
    return formatProfileStateService.applyFormatProfileState(profile, context);
}

function syncActiveFormatProfileFromState() {
    return formatProfileStateService.syncActiveFormatProfileFromState();
}

function activateFormatProfileContext(context, options = {}) {
    return formatProfileStateService.activateFormatProfileContext(context, options);
}

function activateFormatProfileForCurrentContext(options = {}) {
    return formatProfileStateService.activateFormatProfileForCurrentContext(options);
}

function resetDisplayFormatForActiveContext() {
    return formatProfileStateService.resetDisplayFormatForActiveContext();
}

function resetCopyFormatForActiveContext() {
    return formatProfileStateService.resetCopyFormatForActiveContext();
}

ensureFormatProfiles(createDefaultFormatProfile("live"));
activateFormatProfileForCurrentContext({ syncCurrent: false });

function getDefaultFixedTimeName() {
    return fixedTimeSlotUtilsService.getDefaultFixedTimeName();
}

function getDefaultFixedDate(anchorDate = new Date()) {
    return fixedTimeSlotUtilsService.getDefaultFixedDate(anchorDate);
}

function getDefaultFixedTimes() {
    return fixedTimeSlotUtilsService.getDefaultFixedTimes();
}

function sanitizeFixedTimeSlotCount(value) {
    return fixedTimeSlotUtilsService.sanitizeFixedTimeSlotCount(value);
}

function createDefaultFixedTimeSlot(id = "") {
    return fixedTimeSlotUtilsService.createDefaultFixedTimeSlot(id);
}

function sanitizeFixedTimeId(value) {
    return fixedTimeSlotUtilsService.sanitizeFixedTimeId(value);
}

function sanitizeFixedTimeName(value, fallback = getDefaultFixedTimeName()) {
    return fixedTimeSlotUtilsService.sanitizeFixedTimeName(value, fallback);
}

function sanitizeFixedTimeValue(value, fallback = DEFAULT_FIXED_TIME_VALUE) {
    return fixedTimeSlotUtilsService.sanitizeFixedTimeValue(value, fallback);
}

function sanitizeFixedDateValue(value, fallback = "") {
    return fixedTimeSlotUtilsService.sanitizeFixedDateValue(value, fallback);
}

function getFixedDatePartsFromGroup(group = getCurrentGroup()) {
    return fixedTimeSlotUtilsService.getFixedDatePartsFromGroup(group);
}

function sanitizeFixedTimes(rawFixedTimes) {
    return fixedTimeSlotUtilsService.sanitizeFixedTimes(rawFixedTimes);
}

function ensureGroupFixedTimes(group) {
    return fixedTimeSlotUtilsService.ensureGroupFixedTimes(group);
}

function createUniqueFixedTimeId(group = getCurrentGroup()) {
    return fixedTimeSlotUtilsService.createUniqueFixedTimeId(group);
}

function isFixedTimeTab() {
    return currentMainTab === "fixed-time";
}

function isMultiTab() {
    return currentMainTab === "multi";
}

function sanitizeMultiRangeCount(value) {
    return multiRangeStateService.sanitizeMultiRangeCount(value);
}

function sanitizeMultiRangeTitle(value) {
    return multiRangeStateService.sanitizeMultiRangeTitle(value);
}

function getDefaultMultiRangeBounds() {
    return multiRangeStateService.getDefaultMultiRangeBounds();
}

function sanitizeMultiRangeItem(rawRange, fallbackStartMs, fallbackEndMs) {
    return multiRangeStateService.sanitizeMultiRangeItem(rawRange, fallbackStartMs, fallbackEndMs);
}

function isMultiRangeStartEditEnabled(rangeIdx) {
    return multiRangeStateService.isMultiRangeStartEditEnabled(rangeIdx);
}

function isMultiRangeEndEditEnabled(rangeIdx) {
    return multiRangeStateService.isMultiRangeEndEditEnabled(rangeIdx);
}

function isMultiRangeStartLinked(rangeIdx) {
    return multiRangeStateService.isMultiRangeStartLinked(rangeIdx);
}

function ensureMultiRangeState() {
    return multiRangeStateService.ensureMultiRangeState();
}

function setMultiRangeStartEditEnabled(rangeIdx, enabled, options = {}) {
    return multiRangeStateService.setMultiRangeStartEditEnabled(rangeIdx, enabled, options);
}

function setMultiRangeEndEditEnabled(rangeIdx, enabled, options = {}) {
    return multiRangeStateService.setMultiRangeEndEditEnabled(rangeIdx, enabled, options);
}

function setAllMultiRangeStartEditEnabled(enabled, options = {}) {
    return multiRangeStateService.setAllMultiRangeStartEditEnabled(enabled, options);
}

function setAllMultiRangeEndEditEnabled(enabled, options = {}) {
    return multiRangeStateService.setAllMultiRangeEndEditEnabled(enabled, options);
}

function refreshMultiRangeControls() {
    return multiRangeStateService.refreshMultiRangeControls();
}

function renderMultiBulkToolSets() {
    if (!multiBulkToolsService || typeof multiBulkToolsService.renderMultiBulkToolSets !== "function") return;
    multiBulkToolsService.renderMultiBulkToolSets();
}

function syncMultiRangeStartLinks(startIdx = 1) {
    return multiRangeStateService.syncMultiRangeStartLinks(startIdx);
}

function syncFollowingRangesByDuration(changedRangeIdx) {
    return multiRangeStateService.syncFollowingRangesByDuration(changedRangeIdx);
}

function syncLinkedRangesFrom(rangeIdx, options = {}) {
    return multiRangeStateService.syncLinkedRangesFrom(rangeIdx, options);
}

function setMultiRangeCount(value, options = {}) {
    return multiRangeStateService.setMultiRangeCount(value, options);
}

function getFixedTimeSlotCount(group = getCurrentGroup()) {
    return fixedTimeStateService.getFixedTimeSlotCount(group);
}

function setCurrentGroupFixedDate(rawValue, options = {}) {
    return fixedTimeStateService.setCurrentGroupFixedDate(rawValue, options);
}

function refreshFixedTimeSlotCountControls() {
    return fixedTimeStateService.refreshFixedTimeSlotCountControls();
}

function setFixedTimeSlotCount(value, options = {}) {
    return fixedTimeStateService.setFixedTimeSlotCount(value, options);
}

function toggleMultiRangeCollapsed(rangeIdx) {
    return multiRangeStateService.toggleMultiRangeCollapsed(rangeIdx);
}

function setMultiRangesCollapsedBelow(rangeIdx, collapsed) {
    return multiRangeStateService.setMultiRangesCollapsedBelow(rangeIdx, collapsed);
}

function getMultiRangeSlotDate(rangeIdx, slotIdx) {
    return multiRangeStateService.getMultiRangeSlotDate(rangeIdx, slotIdx);
}

function setMultiRangeSlotDate(rangeIdx, slotIdx, nextDate) {
    return multiRangeStateService.setMultiRangeSlotDate(rangeIdx, slotIdx, nextDate);
}

function sanitizeUiScalePercent(value) {
    return uiPreferencesStateService.sanitizeUiScalePercent(value);
}

async function applyUiScale(scalePercent, persist = true) {
    return uiPreferencesStateService.applyUiScale(scalePercent, persist);
}

async function loadUiScalePreference() {
    return uiPreferencesStateService.loadUiScalePreference();
}

function populateUiScaleSelect(selectEl) {
    return uiPreferencesStateService.populateUiScaleSelect(selectEl);
}

function sanitizeTheme(theme) {
    return uiPreferencesStateService.sanitizeTheme(theme);
}

async function applyTheme(theme, persist = true) {
    return uiPreferencesStateService.applyTheme(theme, persist);
}

async function loadThemePreference() {
    return uiPreferencesStateService.loadThemePreference();
}

function setCurrentLang(lang) {
    return uiPreferencesStateService.setCurrentLang(lang);
}

function sanitizeMainTab(tab) {
    return groupContextStateService.sanitizeMainTab(tab);
}

function clampGroupIndex(index) {
    return groupContextStateService.clampGroupIndex(index);
}

function normalizeGroupTabState() {
    return groupContextStateService.normalizeGroupTabState();
}

function getPersistenceState() {
    return appPersistenceStateService.getPersistenceState();
}

function setPersistenceState(next = {}) {
    return appPersistenceStateService.setPersistenceState(next);
}

const mainSelectServices = GTV_MAIN_SELECT_SERVICES.createService({
    getDocumentRef: () => (typeof document === "object" && document) ? document : null,
    getComputedStyle: (target) => window.getComputedStyle(target),
    ensureBaseTimezoneSelection,
    getCurrentGroupBaseTimezoneId,
    isCurrentGroupUtcRowVisible,
    getCurrentGroupZones,
    getZoneAbbreviation,
    getZoneDisplayName,
    setCurrentGroupBaseTimezoneId,
    savePersistence: () => {
        if (persistenceService && typeof persistenceService.savePersistence === "function") {
            persistenceService.savePersistence();
        }
    },
    t
});
const {
    adjustSelectWidthForContent,
    refreshSelectWidths,
    renderBaseTimeSelect
} = mainSelectServices;

// --- Group Data Structure ---

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
    savePersistence: (options = {}) => persistenceService.savePersistence(options),
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
        getSignedInclusiveDaySpan: (a, b) => timeService.getDaySpan(a, b),
        getSignedDurationDayHourMinute: (a, b) => {
            const parse = (s) => {
                const m = (s || "").trim().match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
                if (!m) return NaN;
                return Date.UTC(m[1], m[2]-1, m[3], m[4], m[5], m[6]);
            };
            return timeService.formatDuration(parse(a), parse(b), currentLang);
        },
    sanitizeTimePartsEnabled,
    sanitizeCopyFormatOrder,
    timeService
});

let multiBulkToolsService = null;
let timelineFrameService = null;
let imageExportActionsService = null;
let imageExportNamingService = null;
let imageExportBridgeService = null;
let uiSettingsActionsService = null;
let imageCloneService = null;
let imageForeignRenderService = null;
let tableImageRenderService = null;
let multiRangeImageRenderService = null;
let fixedTimeCoreService = null;
let fixedTimeTimelineService = null;
let fixedTimeActionsService = null;
let fixedTimeTableService = null;
let mainUiInitService = null;
let timeAdjustActionsService = null;
const timeInputMutationsService = GTV_TIME_INPUT_MUTATIONS.createService({
    t: (...args) => t(...args),
    showToast: (...args) => showToast(...args),
    isRealtime: () => isRealtime,
    isMultiTab,
    isMultiRangeStartEditEnabled,
    isMultiRangeEndEditEnabled,
    ensureMultiRangeState,
    getMultiRanges: () => multiRanges,
    getMultiRangeSlotDate,
    setMultiRangeSlotDate,
    syncFollowingRangesByDuration,
    syncMultiRangeStartLinks,
    parseDateTimeParts,
    getCurrentGroupZones,
    getCustomOffsetMinutes,
    getFixedOffsetForDisplayAtDate,
    getTimezoneOffset,
    resolveLocalDateParts: (date, timezone, timezoneId, fallback) =>
        timeService.resolveLocalDateParts(date, timezone, timezoneId, fallback),
    buildStrictUtcDateFromParts: (parts) => GTV_TIME_CORE.buildStrictUtcDateFromParts(parts),
    getGlobalTime: (slotIdx) => globalTimes[slotIdx],
    setGlobalTime: (slotIdx, value) => {
        globalTimes[slotIdx] = value;
    },
    updateClocks: (...args) => updateClocks(...args),
    renderList: (...args) => renderList(...args),
    renderMultiRanges: () => {
        if (multiRangeRenderService && typeof multiRangeRenderService.renderMultiRanges === "function") {
            multiRangeRenderService.renderMultiRanges();
        }
    },
    savePersistence: () => {
        if (persistenceService && typeof persistenceService.savePersistence === "function") {
            persistenceService.savePersistence();
        }
    }
});

const mainRowOrderServices = GTV_MAIN_ROW_ORDER_SERVICES.createService({
    requestUiFrame,
    cancelUiFrame,
    getGroups: () => groups,
    getActiveGroupId: () => activeGroupId,
    getCurrentGroupBaseTimezoneId,
    getPersistenceService: () => persistenceService,
    getDocumentRef: () => (typeof document === "object" && document) ? document : null,
    NodeCtor: (typeof Node === "function") ? Node : null
});
const {
    bindRowContainerDragAndDrop,
    initDragAndDrop,
    captureReorderableRowRects,
    animateReorderTransition,
    getAfter,
    saveOrderForContainer,
    saveOrder
} = mainRowOrderServices;
const mainRowViewServices = GTV_MAIN_ROW_VIEW_SERVICES.createService({
    rowViewCache,
    maxRuntimeCacheSize: MAX_RUNTIME_CACHE_SIZE,
    getDocumentRef: () => (typeof document === "object" && document) ? document : null,
    getSnapshotFormatService: () => snapshotFormatService,
    getGlobalTime: (slotIdx) => globalTimes[slotIdx],
    getZoneDisplayName,
    getZoneDisplayNameForUiAtDate,
    getCurrentLang: () => currentLang,
    getI18nData: () => I18N_DATA,
    isRealtime: () => isRealtime,
    getSlotCount: () => slotCount,
    normalizeDayNightMarker: (...args) => normalizeDayNightMarker(...args),
    getDayNightGlyph: (...args) => getDayNightGlyph(...args),
    t
});
const { updateRow } = mainRowViewServices;

const tableRenderService = GTV_TABLE_RENDER.createService({
    t,
    sanitizeCopyFormatOrder,
    getDisplayFormatOrder: () => displayFormatOrder,
    getDisplayFormatEnabled: () => displayFormatEnabled,
    getDisplayTimePartsEnabled: () => displayTimePartsEnabled,
    isRealtime: () => isRealtime,
    getSlotCount: () => slotCount,
    isMultiTab,
    renderMultiRanges: () => multiRangeRenderService.renderMultiRanges(),
    getBaseTimezoneRef,
    getGlobalTime: (slotIdx) => globalTimes[slotIdx],
    escapeHtml,
    getZoneDisplayName,
    getZoneDisplayNameForUiAtDate,
    removeTimezone,
    handleTimeChange,
    saveOrder,
    getCurrentGroupZones,
    isCurrentGroupUtcRowVisible,
    getCurrentGroupUtcRowOrder,
    getUTCRef,
    renderBaseTimeSelect,
    updateTimeAdjustPanel: () => timeAdjustUiService.updateTimeAdjustPanel(),
    updateClocks,
    hideFloatingTooltip,
    upgradeNativeTitleTooltips,
    createDragGhostFromRow,
    clearDragGhost,
    copyRow: (id) => copyActionsService.copyRow(id)
});

const mainImageExportBridgeProxy = GTV_MAIN_IMAGE_EXPORT_BRIDGE_PROXY.createService({
    getImageExportBridgeService: () => imageExportBridgeService,
    getDefaultTableExportContext: () => ({
        table: null,
        headerSelector: "#table-head th",
        rowSelector: "#clocks-container tr.time-row"
    })
});
const {
    collectDocumentCssText,
    cloneTableForImageExport,
    cloneMultiRangeBlockForImageExport,
    renderElementWithForeignObjectToPngDataUrl,
    loadImageElement,
    waitForDocumentFontsReady,
    isDomExceptionLike,
    detectForeignObjectRendererSupport,
    extractTableCellText,
    extractTableHeaderText,
    getActiveTableExportContext,
    renderTimezoneTableFallbackDataUrl,
    renderTimezoneTableToPngDataUrl,
    renderMultiRangesFallbackDataUrl,
    renderMultiRangesToPngDataUrl,
    renderMultiRangeSingleToPngDataUrl,
    renderMultiRangeTitlesToPngDataUrl,
    saveTimezoneTableImage,
    saveMultiRangeTitlesImage,
    saveMultiRangeSingleImage,
    getImageExportDeps
} = mainImageExportBridgeProxy;

const mainImageRuntimeServices = GTV_MAIN_IMAGE_RUNTIME_SERVICES.createService({
    GTV_IMAGE_CLONE,
    GTV_IMAGE_FOREIGN_RENDER,
    GTV_IMAGE_EXPORT_BRIDGE,
    GTV_TABLE_IMAGE_RENDER,
    GTV_MULTI_RANGE_IMAGE_RENDER,
    TABLE_IMAGE_EXPORT_WIDTH,
    EXPORT_MONO_FONT_FAMILY,
    document: (typeof document === "object" && document) ? document : null,
    getCanUseForeignObjectRenderer: () => canUseForeignObjectRenderer,
    setCanUseForeignObjectRenderer: (value) => {
        canUseForeignObjectRenderer = !!value;
    },
    getImageExportActionsService: () => imageExportActionsService,
    getDefaultTableExportContext: () => ({
        table: null,
        headerSelector: "#table-head th",
        rowSelector: "#clocks-container tr.time-row"
    }),
    isFixedTimeTab,
    waitForDocumentFontsReady,
    prepareExportCanvas,
    drawExportCellText,
    cloneTableForImageExport,
    renderElementWithForeignObjectToPngDataUrl,
    t,
    ensureMultiRangeState,
    getBaseTimezoneRef,
    getMultiRanges: () => multiRanges,
    getMultiRangeTitleText: (rangeIdx, range, baseRef) =>
        multiRangeRenderService.getMultiRangeTitleText(rangeIdx, range, baseRef),
    cloneMultiRangeBlockForImageExport,
    extractTableCellText
});
imageCloneService = mainImageRuntimeServices.imageCloneService;
imageForeignRenderService = mainImageRuntimeServices.imageForeignRenderService;
imageExportBridgeService = mainImageRuntimeServices.imageExportBridgeService;
tableImageRenderService = mainImageRuntimeServices.tableImageRenderService;
multiRangeImageRenderService = mainImageRuntimeServices.multiRangeImageRenderService;

const mainFixedTimeServices = GTV_MAIN_FIXED_TIME_SERVICES.createService({
    GTV_FIXED_TIME_CORE,
    GTV_FIXED_TIME_TIMELINE,
    GTV_FIXED_TIME_ACTIONS,
    DEFAULT_FIXED_TIME_VALUE,
    MIN_FIXED_TIME_SLOT_COUNT,
    TIMELINE_TOTAL_SECONDS,
    I18N_DATA,
    t: (...args) => t(...args),
    getCurrentLang: () => currentLang,
    sanitizeFixedTimeValue,
    getFixedOffsetForDisplayAtDate,
    getLocalPartsByTimezone,
    getUTCDateFromLocalParts,
    pad,
    sanitizeTimePartsEnabledForContext,
    getDisplayTimePartsEnabled: () => displayTimePartsEnabled,
    getDefaultFixedTimeName,
    sanitizeFixedTimeName,
    getFixedDateParts: () => getFixedDatePartsFromGroup(),
    getCurrentGroup,
    ensureGroupFixedTimes,
    getGlobalTime: (slotIdx) => globalTimes[slotIdx],
    resolveFixedTimeSlotUtcDate,
    clampNumber,
    getFixedTimeSlotCount,
    sanitizeFixedTimeId,
    getFixedTimeSlotHeaderLabel,
    sanitizeCopyFormatOrderForContext,
    sanitizeCopyFormatEnabledForContext,
    getCopyFormatOrder: () => copyFormatOrder,
    getCopyFormatEnabled: () => copyFormatEnabled,
    getCopyTimePartsEnabled: () => copyTimePartsEnabled,
    buildTimezoneComputedSnapshotForDates: (tz, slotDates, options = {}) =>
        snapshotFormatService.buildTimezoneComputedSnapshotForDates(tz, slotDates, options),
    formatSnapshotText: (snapshot, order, enabled, timePartsEnabled) =>
        snapshotFormatService.formatSnapshotText(snapshot, order, enabled, timePartsEnabled),
    getBaseTimezoneRef,
    getRenderableTimezoneRows: (baseRef) => tableRenderService.getRenderableTimezoneRows(baseRef),
    parseDateTimeParts,
    showToast: (...args) => showToast(...args),
    writeClipboard: async (text) => navigator.clipboard.writeText(text),
    buildFixedTimeDisplayPayloadAtUtc,
    renderFixedTimeTab: (...args) => renderFixedTimeTab(...args),
    renderTimelineFrame: (...args) => renderTimelineFrame(...args),
    savePersistence: (...args) => persistenceService.savePersistence(...args),
    setFixedTimeSlotCount,
    refreshFixedTimeSlotCountControls: (...args) => refreshFixedTimeSlotCountControls(...args)
});
fixedTimeCoreService = mainFixedTimeServices.fixedTimeCoreService;
fixedTimeTimelineService = mainFixedTimeServices.fixedTimeTimelineService;
fixedTimeActionsService = mainFixedTimeServices.fixedTimeActionsService;

const mainMultiRangeServices = GTV_MAIN_MULTI_RANGE_SERVICES.createService({
    GTV_MULTI_RANGE_RENDER,
    GTV_MULTI_RANGE_COPY,
    GTV_COPY_ACTIONS,
    I18N_DATA,
    t,
    getCurrentLang: () => currentLang,
    pad,
    getCustomOffsetMinutes,
    getFixedOffsetForDisplayAtDate,
    normalizeCustomAbbr,
    getZoneAbbreviation,
    getSignedInclusiveDaySpan: (a, b) => timeService.getDaySpan(a, b),
    getSignedDurationDayHourMinute: (a, b) => {
        const parse = (s) => {
            const m = (s || "").trim().match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
            if (!m) return NaN;
            return Date.UTC(m[1], m[2] - 1, m[3], m[4], m[5], m[6]);
        };
        return timeService.formatDuration(parse(a), parse(b), currentLang);
    },
    getZoneDisplayName,
    getZoneDisplayNameForUiAtDate,
    sanitizeMultiSubgroupName: (value, fallback = "") =>
        multiStateService.sanitizeMultiSubgroupName(value, fallback),
    getCurrentMultiSubgroupName,
    sanitizeMultiRangeTitle,
    getMultiRangeTitle: () => multiRangeTitle,
    buildStaticRowCell: (colKey, slotCountToRender, zoneNameHtml = "") =>
        tableRenderService.buildStaticRowCell(colKey, slotCountToRender, zoneNameHtml),
    buildDynamicRowCell: (colKey, slotCountToRender) =>
        tableRenderService.buildDynamicRowCell(colKey, slotCountToRender),
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
    getRenderableTimezoneRows: (baseRef) => tableRenderService.getRenderableTimezoneRows(baseRef),
    getMultiRanges: () => multiRanges,
    getMultiRangeCollapsed: () => multiRangeCollapsed,
    getMultiRangeCount: () => multiRangeCount,
    buildTimezoneComputedSnapshotForDates: (tz, slotDates, options = {}) =>
        snapshotFormatService.buildTimezoneComputedSnapshotForDates(tz, slotDates, options),
    saveMultiRangeSingleImage,
    setMultiRangesCollapsedBelow,
    toggleMultiRangeCollapsed,
    renderTimeAdjustSet: (slotIdx, options = {}) => timeAdjustUiService.renderTimeAdjustSet(slotIdx, options),
    applyMultiRangeTimeAdjustAction,
    attachTimeAdjustToggleLabel: (setEl, checked, text, onChange) =>
        timeAdjustUiService.attachTimeAdjustToggleLabel(setEl, checked, text, onChange),
    setMultiRangeStartEditEnabled,
    setMultiRangeEndEditEnabled,
    getMultiDisplayColumnHeader: (colKey) => tableRenderService.getMultiDisplayColumnHeader(colKey),
    updateTimeAdjustPanel: () => timeAdjustUiService.updateTimeAdjustPanel(),
    updateCopyFormatPreview,
    upgradeNativeTitleTooltips,
    showToast,
    getTimezoneRefById: (id) => snapshotFormatService.getTimezoneRefById(id),
    buildTimezoneComputedSnapshotForRange,
    formatSnapshotText,
    getCopyFormatOrder: () => copyFormatOrder,
    getCopyFormatEnabled: () => copyFormatEnabled,
    getCopyTimePartsEnabled: () => copyTimePartsEnabled,
    writeClipboard: async (text) => navigator.clipboard.writeText(text),
    isShowCopyFormat: () => showCopyFormat,
    isMultiTab,
    isFixedTimeTab,
    getRowFormattedText: (rowOrId, order, enabled, timePartsEnabled = DEFAULT_COPY_TIME_PARTS_ENABLED) =>
        snapshotFormatService.getRowFormattedText(rowOrId, order, enabled, timePartsEnabled),
    getRowCopyText: (rowOrId) =>
        snapshotFormatService.getRowCopyText(rowOrId, {
            order: copyFormatOrder,
            enabled: copyFormatEnabled,
            timePartsEnabled: copyTimePartsEnabled
        }),
    getFixedTimePreviewCopyText,
    getAllFixedTimeRowsCopyText,
    copyAllMultiRangeTimezones
});
const multiRangeRenderService = mainMultiRangeServices.multiRangeRenderService;
const multiRangeCopyService = mainMultiRangeServices.multiRangeCopyService;
const copyActionsService = mainMultiRangeServices.copyActionsService;

const mainTimeAdjustServices = GTV_MAIN_TIME_ADJUST_SERVICES.createService({
    GTV_TIME_ADJUST_UI,
    GTV_MULTI_BULK_TOOLS,
    GTV_TIME_ADJUST_ACTIONS,
    MIN_TIME_ADJUST_DAY_STEP,
    MAX_TIME_ADJUST_DAY_STEP,
    DEFAULT_TIME_ADJUST_DAY_STEP,
    t,
    savePersistence: (options = {}) => persistenceService.savePersistence(options),
    applyTimeAdjustAction,
    getCurrentMainTab: () => currentMainTab,
    isRealtime: () => isRealtime,
    getSlotCount: () => slotCount,
    getTimeAdjustDayStepValue: (slotIdx) => timeAdjustDayStepBySlot[slotIdx],
    setTimeAdjustDayStepValue: (slotIdx, value) => {
        timeAdjustDayStepBySlot[slotIdx] = value;
    },
    upgradeNativeTitleTooltips,
    getMultiRangeCount: () => multiRangeCount,
    applyBulkRangeAllAction,
    applyFirstRangeStartAdjustAction: (slotIdx, action) =>
        applyMultiRangeTimeAdjustAction(0, slotIdx, action),
    setAllMultiRangeStartEditEnabled,
    setAllMultiRangeEndEditEnabled,
    getGlobalTimes: () => globalTimes,
    updateClocks: () => updateClocks(),
    getBaseTimezoneRef,
    getFixedOffsetForDisplay,
    getFixedOffsetForDisplayAtDate,
    getCustomOffsetMinutes,
    getTimeAdjustDayStep,
    timeService,
    sanitizeUtcMs: (...args) => GTV_TIME_CORE.sanitizeUtcMs(...args),
    ensureMultiRangeState,
    getMultiRanges: () => multiRanges,
    isMultiRangeStartLinked,
    isMultiTab,
    renderMultiRanges: () => {
        if (multiRangeRenderService && typeof multiRangeRenderService.renderMultiRanges === "function") {
            multiRangeRenderService.renderMultiRanges();
        }
    },
    savePersistenceForce: () => {
        if (persistenceService && typeof persistenceService.savePersistence === "function") {
            persistenceService.savePersistence();
        }
    },
    isMultiRangeStartEditEnabled,
    isMultiRangeEndEditEnabled,
    syncLinkedRangesFrom,
    getMultiRangeSlotDate,
    setMultiRangeSlotDate,
    syncFollowingRangesByDuration,
    syncMultiRangeStartLinks
});
const timeAdjustUiService = mainTimeAdjustServices.timeAdjustUiService;
multiBulkToolsService = mainTimeAdjustServices.multiBulkToolsService;
timeAdjustActionsService = mainTimeAdjustServices.timeAdjustActionsService;

const mainTabServices = GTV_MAIN_TAB_SERVICES.createService({
    GTV_FORMAT_CONTROLS,
    serviceBootstrap,
    COPY_FORMAT_KEYS,
    TIME_PART_KEYS,
    t,
    sanitizeCopyFormatOrder,
    renderList,
    updateCopyFormatPreview,
    savePersistence: (options = {}) => persistenceService.savePersistence(options),
    upgradeNativeTitleTooltips,
    isShowCopyFormat: () => showCopyFormat,
    getDisplayFormatOrder: () => displayFormatOrder,
    setDisplayFormatOrder: (next) => {
        displayFormatOrder = sanitizeCopyFormatOrderForContext(next, activeFormatProfileContext);
        syncActiveFormatProfileFromState();
    },
    getDisplayFormatEnabled: () => displayFormatEnabled,
    setDisplayFormatEnabled: (next) => {
        displayFormatEnabled = sanitizeCopyFormatEnabledForContext(next, "display", activeFormatProfileContext);
        syncActiveFormatProfileFromState();
    },
    getDisplayTimePartsEnabled: () => displayTimePartsEnabled,
    setDisplayTimePartsEnabled: (next) => {
        displayTimePartsEnabled = sanitizeTimePartsEnabledForContext(next, "display", activeFormatProfileContext);
        syncActiveFormatProfileFromState();
    },
    getCopyFormatOrder: () => copyFormatOrder,
    setCopyFormatOrder: (next) => {
        copyFormatOrder = sanitizeCopyFormatOrderForContext(next, activeFormatProfileContext);
        syncActiveFormatProfileFromState();
    },
    getCopyFormatEnabled: () => copyFormatEnabled,
    setCopyFormatEnabled: (next) => {
        copyFormatEnabled = sanitizeCopyFormatEnabledForContext(next, "copy", activeFormatProfileContext);
        syncActiveFormatProfileFromState();
    },
    getCopyTimePartsEnabled: () => copyTimePartsEnabled,
    setCopyTimePartsEnabled: (next) => {
        copyTimePartsEnabled = sanitizeTimePartsEnabledForContext(next, "copy", activeFormatProfileContext);
        syncActiveFormatProfileFromState();
    },
    getActiveCopyFormatKeys: () => getFormatProfileAllowedKeys(activeFormatProfileContext),
    getActiveTimePartKeys: () => getFormatProfileAllowedTimePartKeys(activeFormatProfileContext),
    sanitizeMainTab,
    clampGroupIndex,
    normalizeGroupTabState,
    isMultiTab,
    isFixedTimeTab,
    getSlotCount: () => slotCount,
    getShowTimeline: () => showTimeline,
    getIsRealtime: () => isRealtime,
    setIsRealtime: (next) => setIsRealtimeState(next),
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
    renderGroups: () => groupTabsService.renderGroups(),
    renderMultiSubgroups: () => groupTabsService.renderMultiSubgroups(),
    renderMultiRanges: () => multiRangeRenderService.renderMultiRanges(),
    renderFixedTimeTab,
    renderTimelineFrame,
    updateTimeAdjustPanel: () => timeAdjustUiService.updateTimeAdjustPanel(),
    syncActiveFormatProfileFromState,
    resolveFormatProfileContext,
    activateFormatProfileContext
});
const formatControlsService = mainTabServices.formatControlsService;
const tabUiService = mainTabServices.tabUiService;
const tabOrchestratorService = mainTabServices.tabOrchestratorService;

const mainGroupStateServices = GTV_MAIN_GROUP_STATE_SERVICES.createService({
    GTV_MULTI_STATE,
    serviceBootstrap,
    MIN_MULTI_RANGE_COUNT,
    t,
    getGroups: () => groups,
    getDefaultMultiRangeBounds,
    sanitizeMultiRangeCount,
    sanitizeMultiRangeItem,
    sanitizeUtcMs: (value, fallbackMs) => GTV_TIME_CORE.sanitizeUtcMs(value, fallbackMs),
    sanitizeTimezoneId,
    createUniqueTimezoneId,
    normalizeCustomAbbr,
    normalizeZoneAbbreviation: (value) => timezoneSearchService.normalizeZoneAbbreviation(value),
    sanitizeBaseTimezoneId,
    sanitizeUtcRowOrder: (value) => GTV_TIME_CORE.sanitizeUtcRowOrder(value),
    sanitizeFixedTimes,
    sanitizeFixedDateValue
});
multiStateService = mainGroupStateServices.multiStateService;
groupStateService = mainGroupStateServices.groupStateService;

const mainImageExportNamingProxy = GTV_MAIN_IMAGE_EXPORT_NAMING_PROXY.createService({
    getImageExportNamingService: () => imageExportNamingService,
    getCustomOffsetMinutes,
    pad,
    timeService,
    getBaseTimezoneRef,
    getGroups: () => groups,
    getActiveGroupId: () => activeGroupId,
    t,
    getZoneAbbreviation,
    getBaseTime: () => globalTimes[0],
    sanitizeMultiSubgroupName: (value, fallback = "subgroup") =>
        multiStateService.sanitizeMultiSubgroupName(value, fallback),
    getCurrentMultiSubgroupName
});
const {
    sanitizeFilenamePart,
    formatDateTimeByTimezone,
    getTimezoneTableImageFilename,
    getMultiRangeTableImageFilename,
    getMultiRangeTitlesImageFilename
} = mainImageExportNamingProxy;

const mainImageExportServices = GTV_MAIN_IMAGE_EXPORT_SERVICES.createService({
    GTV_IMAGE_EXPORT_NAMING,
    GTV_IMAGE_EXPORT_ACTIONS,
    imageExportApi: GTV_IMAGE_EXPORT,
    t,
    pad,
    timeService,
    getCustomOffsetMinutes,
    getBaseTimezoneRef,
    getBaseTime: () => globalTimes[0],
    getActiveGroupName: () => groups[activeGroupId]?.name,
    getZoneAbbreviation,
    sanitizeMultiSubgroupName: (value, fallback = "subgroup") =>
        multiStateService.sanitizeMultiSubgroupName(value, fallback),
    getCurrentMultiSubgroupName,
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
    getTimezoneTableImageFilename,
    getMultiRangeTableImageFilename,
    getMultiRangeTitlesImageFilename,
    getMultiRanges: () => multiRanges,
    isDomExceptionLike,
    setCanUseForeignObjectRenderer: (value) => {
        canUseForeignObjectRenderer = !!value;
    }
});
imageExportNamingService = mainImageExportServices.imageExportNamingService;
imageExportActionsService = mainImageExportServices.imageExportActionsService;

const mainAppStateServices = GTV_MAIN_APP_STATE_SERVICES.createService({
    GTV_APP_STATE_PATCHER,
    GTV_APP_PERSISTENCE_STATE,
    getStateSource: () => ({
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
        formatProfiles,
        activeFormatProfileContext,
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
    }),
    stateSetters: {
        groups: (value) => { groups = value; },
        activeGroupId: (value) => { activeGroupId = value; },
        currentMainTab: (value) => { currentMainTab = value; },
        activeGroupIdByMainTab: (value) => { activeGroupIdByMainTab = value; },
        slotCount: (value) => { slotCount = value; },
        showCopyFormat: (value) => { showCopyFormat = value; },
        showTimeline: (value) => { showTimeline = !!value; },
        displayFormatOrder: (value) => { displayFormatOrder = value; },
        displayFormatEnabled: (value) => { displayFormatEnabled = value; },
        displayTimePartsEnabled: (value) => { displayTimePartsEnabled = value; },
        copyFormatOrder: (value) => { copyFormatOrder = value; },
        copyFormatEnabled: (value) => { copyFormatEnabled = value; },
        copyTimePartsEnabled: (value) => { copyTimePartsEnabled = value; },
        formatProfiles: (value) => { formatProfiles = value; },
        activeFormatProfileContext: (value) => { activeFormatProfileContext = value; },
        timeAdjustDayStepBySlot: (value) => { timeAdjustDayStepBySlot = value; },
        multiRangeCount: (value) => { multiRangeCount = value; },
        multiRangeTitle: (value) => { multiRangeTitle = value; },
        multiRanges: (value) => { multiRanges = value; },
        multiRangeCollapsed: (value) => { multiRangeCollapsed = value; },
        multiRangeStartEditEnabled: (value) => { multiRangeStartEditEnabled = value; },
        multiRangeEndEditEnabled: (value) => { multiRangeEndEditEnabled = value; },
        currentTheme: (value) => { currentTheme = value; },
        currentLang: (value) => { currentLang = value; }
    },
    setIsRealtimeState: (...args) => setIsRealtimeState(...args),
    syncActiveFormatProfileFromState: (...args) => syncActiveFormatProfileFromState(...args),
    ensureFormatProfiles: (...args) => ensureFormatProfiles(...args),
    getCurrentFormatProfileState: (...args) => getCurrentFormatProfileState(...args),
    resolveFormatProfileContext: (...args) => resolveFormatProfileContext(...args),
    applyFormatProfileState: (...args) => applyFormatProfileState(...args)
});
const appStatePatcherService = mainAppStateServices.appStatePatcherService;
const appPersistenceStateService = mainAppStateServices.appPersistenceStateService;

function getPatchedAppStateSnapshot() {
    if (!appStatePatcherService || typeof appStatePatcherService.getStateSnapshot !== "function") {
        return {};
    }
    return appStatePatcherService.getStateSnapshot();
}

function patchAppState(next = {}) {
    if (!appStatePatcherService || typeof appStatePatcherService.applyStatePatch !== "function") {
        return;
    }
    appStatePatcherService.applyStatePatch(next);
}

function getPatchedStateValue(key, fallbackValue) {
    const state = getPatchedAppStateSnapshot();
    if (state && typeof state === "object" && Object.prototype.hasOwnProperty.call(state, key)) {
        return state[key];
    }
    return fallbackValue;
}

function getPatchedIntegerStateValue(key, fallbackValue = 0) {
    const fallback = Number.isFinite(Number(fallbackValue)) ? Math.trunc(Number(fallbackValue)) : 0;
    const raw = getPatchedStateValue(key, fallback);
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.trunc(parsed);
}

function getPatchedBooleanStateValue(key, fallbackValue = false) {
    return !!getPatchedStateValue(key, !!fallbackValue);
}

function getPatchedStringStateValue(key, fallbackValue = "") {
    const fallback = (typeof fallbackValue === "string") ? fallbackValue : "";
    const raw = getPatchedStateValue(key, fallback);
    return (typeof raw === "string" && raw) ? raw : fallback;
}

function getPatchedMainTabState() {
    return getPatchedStringStateValue("currentMainTab", currentMainTab);
}

function getPatchedSlotCountState() {
    const value = getPatchedIntegerStateValue("slotCount", slotCount);
    return Math.max(1, value);
}

function setPatchedSlotCountState(next) {
    const parsed = Number(next);
    if (!Number.isFinite(parsed)) return;
    patchAppState({ slotCount: Math.max(1, Math.trunc(parsed)) });
}

function getPatchedShowCopyFormatState() {
    return getPatchedBooleanStateValue("showCopyFormat", showCopyFormat);
}

function setPatchedShowCopyFormatState(next) {
    patchAppState({ showCopyFormat: !!next });
}

function getPatchedShowTimelineState() {
    return getPatchedBooleanStateValue("showTimeline", showTimeline);
}

function setPatchedShowTimelineState(next) {
    patchAppState({ showTimeline: !!next });
}

function getPatchedCurrentThemeState() {
    return getPatchedStringStateValue("currentTheme", currentTheme);
}

function getPatchedCurrentLangState() {
    return getPatchedStringStateValue("currentLang", currentLang);
}

function getPatchedActiveGroupIdState() {
    const value = getPatchedIntegerStateValue("activeGroupId", activeGroupId);
    return Math.max(0, value);
}

function getPatchedMultiRangeCountState() {
    const value = getPatchedIntegerStateValue("multiRangeCount", multiRangeCount);
    return Math.max(1, value);
}

const mainPersistenceCompositionServices = GTV_MAIN_PERSISTENCE_COMPOSITION_SERVICES.createService({
    GTV_MAIN_GROUP_TABS_SERVICE,
    GTV_MAIN_PERSISTENCE_SNAPSHOT_SERVICES,
    GTV_MAIN_PERSISTENCE_SERVICES,
    groupTabsConfig: {
        GTV_GROUP_TABS,
        t,
        showToast,
        getState: getPersistenceState,
        setState: setPersistenceState,
        isMultiTab,
        getCurrentGroup,
        isFixedTimeTab,
        ensureGroupMultiSubgroups: (group, options = {}) =>
            multiStateService.ensureGroupMultiSubgroups(group, options),
        normalizeGroupTabState,
        syncCurrentMultiStateToActiveSubgroup,
        loadCurrentMultiStateFromActiveSubgroup,
        renderBaseTimeSelect,
        renderMultiRanges: () => multiRangeRenderService.renderMultiRanges(),
        renderFixedTimeTab,
        renderList,
        renderTimelineFrame,
        setCustomTooltip,
        hideFloatingTooltip,
        upgradeNativeTitleTooltips,
        getDefaultMultiSubgroupName: (index = 0) => multiStateService.getDefaultMultiSubgroupName(index),
        getDefaultFixedTimes,
        getDefaultFixedDate,
        createMultiSubgroupState: (name = "", index = 0, state = null) =>
            multiStateService.createMultiSubgroupState(name, index, state),
        sanitizeMultiSubgroupName: (value, fallback = "") =>
            multiStateService.sanitizeMultiSubgroupName(value, fallback),
        sanitizeMultiRangeTitle,
        getActiveGroupId: () => getPatchedActiveGroupIdState()
    },
    snapshotConfig: {
        getState: () => getPatchedAppStateSnapshot(),
        setState: (next = {}) => patchAppState(next),
        sanitizeMainTab,
        syncActiveFormatProfileFromState,
        syncCurrentMultiStateToActiveSubgroup,
        normalizeGroupTabState,
        ensureMultiRangeState,
        getGroups: () => groups,
        ensureGroupFixedTimes,
        ensureGroupMultiSubgroups: (group) => multiStateService.ensureGroupMultiSubgroups(group),
        sanitizeFormatProfiles,
        getCurrentFormatProfileState,
        getCurrentGroupBaseTimezoneId,
        sanitizeCopyFormatOrder,
        sanitizeCopyFormatEnabled,
        sanitizeTimePartsEnabled,
        getTimeAdjustDayStep,
        sanitizeMultiRangeCount,
        sanitizeMultiRangeTitle,
        getCurrentMultiSubgroupName,
        sanitizeUtcMs: (value, fallbackMs) => GTV_TIME_CORE.sanitizeUtcMs(value, fallbackMs),
        now: () => Date.now()
    },
    persistenceConfig: {
        persistenceServiceBundleFactory,
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
        VERSION,
        getDefaultFixedTimes,
        getDefaultFixedDate,
        getState: getPersistenceState,
        setState: setPersistenceState,
        getPersistenceSnapshot,
        ensureGroupMultiSubgroups: (group, options = {}) =>
            multiStateService.ensureGroupMultiSubgroups(group, options),
        sanitizeGroup,
        sanitizeBaseTimezoneId,
        sanitizeMainTab,
        sanitizeTimeAdjustDayStep,
        sanitizeCopyFormatOrder,
        sanitizeCopyFormatEnabled,
        sanitizeTimePartsEnabled,
        sanitizeFormatProfiles,
        deriveTimePartsFromLegacyEnabled,
        sanitizeMultiStatePayload: (rawState = null, fallbackState = null) =>
            multiStateService.sanitizeMultiStatePayload(rawState, fallbackState),
        sanitizeMultiRangeTitle,
        loadCurrentMultiStateFromActiveSubgroup,
        ensureBaseTimezoneSelection,
        syncCurrentMultiStateToActiveSubgroup,
        loadThemePreference,
        applyTheme,
        loadUiScalePreference,
        applyUiScale,
        populateUiScaleSelect,
        getCurrentUiScalePercent: () => Math.round(uiScale * 100),
        refreshMultiRangeControls,
        updateTZDropdown: () => timezoneSearchService.updateTZDropdown(),
        refreshSelectWidths,
        switchMainTab,
        showToast,
        t,
        tFormat,
        applyVersionBranding,
        getGroups: () => groups,
        getCurrentTheme: () => getPatchedCurrentThemeState(),
        getCurrentLang: () => getPatchedCurrentLangState(),
        getCurrentMainTab: () => getPatchedMainTabState(),
        sanitizeUtcRowOrder: (value) => GTV_TIME_CORE.sanitizeUtcRowOrder(value),
        sanitizeTheme,
        sanitizeUiScalePercent,
        setCurrentLang,
        loadPersistence,
        localizeAutoGeneratedNamesForCurrentLanguage,
        getActiveGroupId: () => getPatchedActiveGroupIdState(),
        sanitizeFilenamePart,
        pad,
        renderBaseTimeSelect,
        renderMultiRanges: () => multiRangeRenderService.renderMultiRanges(),
        renderList,
        isMultiTab,
        sanitizeMultiSubgroupId: (value) => multiStateService.sanitizeMultiSubgroupId(value),
        sanitizeMultiSubgroupName: (value, fallback = "") =>
            multiStateService.sanitizeMultiSubgroupName(value, fallback),
        getDefaultMultiSubgroupName: (index = 0) => multiStateService.getDefaultMultiSubgroupName(index),
        getCurrentMultiSubgroup,
        document: (typeof document === "object" && document) ? document : null
    }
});
const mainGroupTabsService = mainPersistenceCompositionServices.mainGroupTabsService;
const groupTabsService = mainPersistenceCompositionServices.groupTabsService;
mainPersistenceSnapshotService = mainPersistenceCompositionServices.mainPersistenceSnapshotService;
const mainPersistenceServices = mainPersistenceCompositionServices.mainPersistenceServices;
persistenceServices = mainPersistenceCompositionServices.persistenceServices;
persistenceService = mainPersistenceCompositionServices.persistenceService;
settingsIoService = mainPersistenceCompositionServices.settingsIoService;
dataTransferService = mainPersistenceCompositionServices.dataTransferService;
uiSettingsActionsService = mainPersistenceCompositionServices.uiSettingsActionsService;

const mainRuntimeCompositionServices = GTV_MAIN_RUNTIME_COMPOSITION_SERVICES.createService({
    GTV_MAIN_UI_RUNTIME_SERVICES,
    GTV_MAIN_CLOCK_ORCHESTRATOR_SERVICES,
    moduleDeps: {
        GTV_TIMELINE_FRAME,
        GTV_FIXED_TIME_TABLE,
        GTV_MAIN_UI_INIT
    },
    timelineConfig: {
        TIMELINE_TOTAL_HOURS,
        TIMELINE_TOTAL_SECONDS,
        requestUiFrame,
        cancelUiFrame
    },
    state: {
        getCurrentMainTab: () => getPatchedMainTabState(),
        getIsRealtime: () => isRealtime,
        getSlotCount: () => getPatchedSlotCountState(),
        getGlobalTime: (slotIdx) => globalTimes[slotIdx],
        setGlobalTime: (slotIdx, value) => {
            globalTimes[slotIdx] = value;
        },
        getCurrentLang: () => getPatchedCurrentLangState(),
        getCurrentTheme: () => getPatchedCurrentThemeState(),
        getUiScale: () => uiScale,
        getMultiRangeCount: () => getPatchedMultiRangeCountState(),
        getShowCopyFormat: () => getPatchedShowCopyFormatState(),
        setShowCopyFormat: (next) => setPatchedShowCopyFormatState(next),
        getShowTimeline: () => getPatchedShowTimelineState(),
        setShowTimeline: (next) => setPatchedShowTimelineState(next),
        getSlotCountState: () => getPatchedSlotCountState(),
        setSlotCount: (next) => setPatchedSlotCountState(next)
    },
    services: {
        getPersistenceService: () => persistenceService,
        getTableRenderService: () => tableRenderService,
        getFormatControlsService: () => formatControlsService,
        getGroupTabsService: () => groupTabsService,
        getMultiRangeRenderService: () => multiRangeRenderService,
        getTimezoneSearchService: () => timezoneSearchService,
        getTimeAdjustUiService: () => timeAdjustUiService,
        getTabUiService: () => tabUiService,
        getUiSettingsActionsService: () => uiSettingsActionsService
    },
    actions: {
        t,
        isMultiTab,
        isFixedTimeTab,
        getBaseTimezoneRef,
        getCurrentGroupZones,
        isCurrentGroupUtcRowVisible,
        getCurrentGroupUtcRowOrder,
        getUTCRef,
        resolveFixedTimeTimelineSourceDate,
        applyFixedTimeSlotTimelineRatio,
        getFixedTimeTimelineSlots,
        getFixedTimeTimelineSlotCount,
        getFixedTimeTimelineIndicatorToken,
        getFixedTimeSlotTimelineLabel,
        getZoneDisplayName,
        getZoneDisplayNameForUiAtDate,
        getFixedOffsetForDisplayAtDate,
        getLocalPartsByTimezone,
        getUTCDateFromLocalParts,
        clampNumber,
        pad,
        updateClocks: () => updateClocks(),
        getCurrentGroup,
        ensureGroupFixedTimes,
        getFixedTimeDisplayPartsEnabled,
        getDisplayFormatOrder: () => displayFormatOrder,
        getDisplayFormatEnabled: () => displayFormatEnabled,
        sanitizeCopyFormatOrderForContext,
        sanitizeCopyFormatEnabledForContext,
        resolveFixedTimeSlotUtcDate,
        getFixedTimeTimelineIndicatorColor,
        getFixedTimeSlotHeaderLabel,
        renameFixedTimeSlot,
        copyFixedTimeSlotColumn,
        getZoneAbbreviation,
        formatUtcOffsetLabel,
        getCustomOffsetMinutes,
        getTimezoneOffset,
        buildFixedTimeDisplayPayloadAtUtc,
        bindCustomDatePickerForInput,
        buildFixedTimeCellInputValue,
        applyFixedTimeSlotByTimezoneInput,
        copyFixedTimeCellByTimezone,
        upgradeNativeTitleTooltips,
        switchMainTab,
        populateUiScaleSelect,
        applyUiScale,
        setMultiRangeCount,
        refreshMultiRangeControls,
        getFixedTimeSlotCountForCurrentGroup: () => getFixedTimeSlotCount(getCurrentGroup()),
        setFixedTimeSlotCount,
        refreshFixedTimeSlotCountControls,
        setCurrentGroupFixedDate,
        sanitizeFixedDateValue,
        showToast,
        normalizeCustomAbbr,
        addTimezone,
        createUniqueTimezoneId,
        syncActiveFormatProfileFromState,
        activateFormatProfileForCurrentContext,
        renderList,
        updateCopyFormatPreview,
        renderTimelineFrame,
        resetDisplayFormatForActiveContext,
        resetCopyFormatForActiveContext,
        applyCurrentGroupBaseTimezoneId,
        copyAllTimezones,
        saveTimezoneTableImage,
        saveMultiRangeTitlesImage,
        applyTheme,
        hideFloatingTooltip,
        localizeAutoGeneratedNamesForCurrentLanguage,
        applyVersionBranding,
        refreshSelectWidths,
        renderBaseTimeSelect,
        updateRow,
        renderFixedTimeTab
    },
    environment: {
        getDocumentRef: () => (typeof document === "object" && document) ? document : null,
        getWindowRef: () => (typeof window === "object" && window) ? window : null,
        getGlobalThisRef: () => (typeof globalThis === "object" && globalThis) ? globalThis : null
    }
});
timelineFrameService = mainRuntimeCompositionServices.timelineFrameService;
fixedTimeTableService = mainRuntimeCompositionServices.fixedTimeTableService;
mainUiInitService = mainRuntimeCompositionServices.mainUiInitService;
mainClockOrchestratorService = mainRuntimeCompositionServices.mainClockOrchestratorService;

function showFatalError(err) {
    if (!appFeedbackService || typeof appFeedbackService.showFatalError !== "function") {
        console.error("FATAL ERROR during app initialization:", err);
        return;
    }
    appFeedbackService.showFatalError(err);
}

async function initApp() {
    try {
        await loadPersistence();
        if (localizeAutoGeneratedNamesForCurrentLanguage()) {
            await persistenceService.savePersistence();
        }
        loadCurrentMultiStateFromActiveSubgroup();
        await applyTheme(await loadThemePreference(), false);
        await applyUiScale(await loadUiScalePreference(), false);
        applyTranslations();
        applyVersionBranding();
        mainUiInitService.initUI();
        bindFloatingTooltipEvents();
        initDragAndDrop();
        timezoneSearchService.initSearchAndSelect();
        initCalculators();

        timerEngineService.startRealtimeTicker();

        switchMainTab(currentMainTab);

        // Force initial update
        updateClocks();
    } catch (err) {
        showFatalError(err);
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}

function showToast(message, options = {}) {
    if (!appFeedbackService || typeof appFeedbackService.showToast !== "function") return;
    return appFeedbackService.showToast(message, options);
}

function switchMainTab(tab) {
    return tabOrchestratorService.switchMainTab(tab);
}

function refreshOptionToggleDividers() {
    return tabOrchestratorService.refreshOptionToggleDividers();
}

function sanitizeTimeAdjustDayStep(value) {
    const safeValue = Number.isFinite(Number(value)) ? value : DEFAULT_TIME_ADJUST_DAY_STEP;
    return timeAdjustUiService.sanitizeTimeAdjustDayStep(safeValue);
}



function getCopyFieldLabel(key) {
    const safeKey = (typeof key === "string") ? key : "";
    return formatControlsService.getCopyFieldLabel(safeKey);
}

function getTimePartLabel(partKey) {
    const safePartKey = (typeof partKey === "string") ? partKey : "";
    return formatControlsService.getTimePartLabel(safePartKey);
}

function getDisplayColumns(effectiveSlotCount) {
    const safeSlotCount = Number.isFinite(Number(effectiveSlotCount)) ? Number(effectiveSlotCount) : slotCount;
    return tableRenderService.getDisplayColumns(safeSlotCount);
}

function getDisplayTimeInputMode() {
    const mode = tableRenderService.getDisplayTimeInputMode();
    return mode;
}

function buildRowActionCells(copyButtonTitle, removeButtonText, removeButtonTitle = "") {
    const safeCopyTitle = String(copyButtonTitle ?? "");
    const safeRemoveText = String(removeButtonText ?? "");
    const safeRemoveTitle = String(removeButtonTitle ?? "");
    return tableRenderService.buildRowActionCells(safeCopyTitle, safeRemoveText, safeRemoveTitle);
}

function buildTimezoneComputedSnapshotForRange(tz, startDate, endDate) {
    if (!(startDate instanceof Date) || !Number.isFinite(startDate.getTime())) return null;
    if (!(endDate instanceof Date) || !Number.isFinite(endDate.getTime())) return null;
    return multiRangeRenderService.buildTimezoneComputedSnapshotForRange(tz, startDate, endDate);
}

function applySnapshotToRow(row, snapshot) {
    if (!row || !snapshot) return false;
    return multiRangeRenderService.applySnapshotToRow(row, snapshot);
}

function formatRangeDurationText(startUtcMs, endUtcMs) {
    const safeStart = Number.isFinite(startUtcMs) ? startUtcMs : Date.now();
    const safeEnd = Number.isFinite(endUtcMs) ? endUtcMs : safeStart;
    return multiRangeRenderService.formatRangeDurationText(safeStart, safeEnd);
}

// --- List Rendering (Dynamic Slots) ---
function renderList() {
    if (isFixedTimeTab()) {
        return renderFixedTimeTab();
    }
    return tableRenderService.renderList();
}

function resolveTimeAdjustZoneAndOffset(baseRef, fixedOffsetMinutes = null) {
    if (!timeAdjustActionsService || typeof timeAdjustActionsService.resolveTimeAdjustZoneAndOffset !== "function") {
        return { zone: "UTC", fixedOffsetMinutes: null };
    }
    return timeAdjustActionsService.resolveTimeAdjustZoneAndOffset(baseRef, fixedOffsetMinutes);
}








function applyTimeAdjustAction(slotIdx, action) {
    if (!timeAdjustActionsService || typeof timeAdjustActionsService.applyTimeAdjustAction !== "function") return;
    timeAdjustActionsService.applyTimeAdjustAction(slotIdx, action);
}

function getAdjustedUtcDateByAction(baseDate, action, slotIdx, baseRef, fixedOffsetMinutes) {
    if (!timeAdjustActionsService || typeof timeAdjustActionsService.getAdjustedUtcDateByAction !== "function") return null;
    return timeAdjustActionsService.getAdjustedUtcDateByAction(
        baseDate,
        action,
        slotIdx,
        baseRef,
        fixedOffsetMinutes
    );
}

function applyBulkRangeAllAction(slotIdx, action) {
    if (!timeAdjustActionsService || typeof timeAdjustActionsService.applyBulkRangeAllAction !== "function") return;
    timeAdjustActionsService.applyBulkRangeAllAction(slotIdx, action);
}

function applyMultiRangeTimeAdjustAction(rangeIdx, slotIdx, action) {
    if (!timeAdjustActionsService || typeof timeAdjustActionsService.applyMultiRangeTimeAdjustAction !== "function") return;
    timeAdjustActionsService.applyMultiRangeTimeAdjustAction(rangeIdx, slotIdx, action);
}


function isTimelineSupportedTab() {
    return currentMainTab === "live" || currentMainTab === "fixed" || currentMainTab === "fixed-time";
}

function shouldRenderTimeline() {
    if (timelineFrameService && typeof timelineFrameService.shouldRenderTimeline === "function") {
        return !!timelineFrameService.shouldRenderTimeline();
    }
    return !!showTimeline && isTimelineSupportedTab() && !isMultiTab();
}

function resolveFixedTimeTimelineSourceDate(slotIdx, baseRef, anchorDate = globalTimes[0]) {
    if (!fixedTimeTimelineService || typeof fixedTimeTimelineService.resolveFixedTimeTimelineSourceDate !== "function") return null;
    return fixedTimeTimelineService.resolveFixedTimeTimelineSourceDate(slotIdx, baseRef, anchorDate);
}

function applyFixedTimeSlotTimelineRatio(slotIdx, ratio) {
    if (!fixedTimeTimelineService || typeof fixedTimeTimelineService.applyFixedTimeSlotTimelineRatio !== "function") return false;
    return fixedTimeTimelineService.applyFixedTimeSlotTimelineRatio(slotIdx, ratio);
}

function getFixedTimeTimelineSlots() {
    if (!fixedTimeTimelineService || typeof fixedTimeTimelineService.getFixedTimeTimelineSlots !== "function") return [];
    return fixedTimeTimelineService.getFixedTimeTimelineSlots();
}

function getFixedTimeTimelineSlotCount() {
    if (!fixedTimeTimelineService || typeof fixedTimeTimelineService.getFixedTimeTimelineSlotCount !== "function") {
        return getFixedTimeSlotCount(getCurrentGroup());
    }
    return fixedTimeTimelineService.getFixedTimeTimelineSlotCount();
}

function getFixedTimeTimelineIndicatorToken() {
    if (!fixedTimeTimelineService || typeof fixedTimeTimelineService.getFixedTimeTimelineIndicatorToken !== "function") return "";
    return fixedTimeTimelineService.getFixedTimeTimelineIndicatorToken();
}

function getFixedTimeSlotTimelineLabel(slot, slotIdx, slotCount = 1) {
    if (!fixedTimeTimelineService || typeof fixedTimeTimelineService.getFixedTimeSlotTimelineLabel !== "function") {
        return getFixedTimeSlotHeaderLabel(slot, slotIdx, slotCount);
    }
    return fixedTimeTimelineService.getFixedTimeSlotTimelineLabel(slot, slotIdx, slotCount);
}

function getFixedTimeTimelineIndicatorColor(slotIdx) {
    if (!fixedTimeCoreService || typeof fixedTimeCoreService.getFixedTimeTimelineIndicatorColor !== "function") {
        const palette = ["#ff4d4d", "#3b82f6", "#14b8a6", "#f59e0b", "#a855f7"];
        return palette[slotIdx % palette.length];
    }
    return fixedTimeCoreService.getFixedTimeTimelineIndicatorColor(slotIdx);
}

function stopTimelineDrag() {
    if (!timelineFrameService || typeof timelineFrameService.stopTimelineDrag !== "function") return;
    timelineFrameService.stopTimelineDrag();
}

function normalizeDayNightMarker(marker) {
    if (!fixedTimeCoreService || typeof fixedTimeCoreService.normalizeDayNightMarker !== "function") {
        const raw = String(marker || "").trim();
        if (!raw) return "";
        const normalized = raw.toUpperCase();
        if (normalized === "DAY" || raw === "\u2600\uFE0F") return "DAY";
        if (normalized === "NIGHT" || normalized === "MOON" || raw === "\uD83C\uDF19") return "NIGHT";
        return "";
    }
    return fixedTimeCoreService.normalizeDayNightMarker(marker);
}

function getDayNightGlyph(marker) {
    if (!fixedTimeCoreService || typeof fixedTimeCoreService.getDayNightGlyph !== "function") return String(marker || "");
    return fixedTimeCoreService.getDayNightGlyph(marker);
}

function applyTimelineRatioToSlot(slotIdx, ratio, baseRef, options = {}) {
    if (!timelineFrameService || typeof timelineFrameService.applyTimelineRatioToSlot !== "function") return;
    timelineFrameService.applyTimelineRatioToSlot(slotIdx, ratio, baseRef, options);
}

function getTimelineIndicatorLabel(slotIdx) {
    if (timelineFrameService && typeof timelineFrameService.getTimelineIndicatorLabel === "function") {
        return timelineFrameService.getTimelineIndicatorLabel(slotIdx);
    }
    const showRangeLabels = currentMainTab === "fixed" && !isRealtime && slotCount > 1;
    if (showRangeLabels) {
        return t(slotIdx === 0 ? "th_time_day_start" : "th_time_day_end");
    }
    return t("th_time_day_main");
}

function getTimelinePanelCount() {
    if (timelineFrameService && typeof timelineFrameService.getTimelinePanelCount === "function") {
        return timelineFrameService.getTimelinePanelCount();
    }
    if (isFixedTimeTab()) {
        return 1;
    }
    return (!isRealtime && slotCount > 1) ? 2 : 1;
}

function renderTimelineFrame() {
    if (!timelineFrameService || typeof timelineFrameService.renderTimelineFrame !== "function") return;
    timelineFrameService.renderTimelineFrame();
}

function getFixedTimeSlotParts(slot) {
    if (!fixedTimeCoreService || typeof fixedTimeCoreService.getFixedTimeSlotParts !== "function") return null;
    return fixedTimeCoreService.getFixedTimeSlotParts(slot);
}

function resolveFixedTimeSlotUtcDate(slot, baseRef, anchorDate = globalTimes[0]) {
    if (!fixedTimeCoreService || typeof fixedTimeCoreService.resolveFixedTimeSlotUtcDate !== "function") return null;
    return fixedTimeCoreService.resolveFixedTimeSlotUtcDate(slot, baseRef, anchorDate);
}

function formatFixedTimeForTimezoneAtUtc(utcDate, tz) {
    if (!fixedTimeCoreService || typeof fixedTimeCoreService.formatFixedTimeForTimezoneAtUtc !== "function") return "--:--:--";
    return fixedTimeCoreService.formatFixedTimeForTimezoneAtUtc(utcDate, tz);
}

function getFixedTimeDisplayPartsEnabled() {
    if (!fixedTimeCoreService || typeof fixedTimeCoreService.getFixedTimeDisplayPartsEnabled !== "function") {
        return { dn: true, time: true, weekday: true };
    }
    return fixedTimeCoreService.getFixedTimeDisplayPartsEnabled();
}

function getLocalizedWeekdayNameByIndex(weekdayIndex) {
    if (!fixedTimeCoreService || typeof fixedTimeCoreService.getLocalizedWeekdayNameByIndex !== "function") return "";
    return fixedTimeCoreService.getLocalizedWeekdayNameByIndex(weekdayIndex);
}

function buildFixedTimeDisplayPayloadAtUtc(utcDate, tz) {
    if (!fixedTimeCoreService || typeof fixedTimeCoreService.buildFixedTimeDisplayPayloadAtUtc !== "function") return null;
    return fixedTimeCoreService.buildFixedTimeDisplayPayloadAtUtc(utcDate, tz);
}

function getFixedTimeSlotHeaderLabel(slot, slotIdx, slotCount = 1) {
    if (!fixedTimeCoreService || typeof fixedTimeCoreService.getFixedTimeSlotHeaderLabel !== "function") {
        return `${t("th_fixed_time")} ${slotIdx + 1}`;
    }
    return fixedTimeCoreService.getFixedTimeSlotHeaderLabel(slot, slotIdx, slotCount);
}

function renderFixedTimeValueCell(cell, payload, partsEnabled) {
    if (!cell) return;
    const safeParts = (partsEnabled && typeof partsEnabled === "object")
        ? partsEnabled
        : { dn: true, time: true, weekday: true };

    cell.textContent = "";
    const wrap = document.createElement("div");
    wrap.className = "fixed-time-display";
    let hasAnyToken = false;

    if (safeParts.dn && payload?.dayNightGlyph) {
        const dnEl = document.createElement("span");
        dnEl.className = "dn-icon";
        dnEl.textContent = payload.dayNightGlyph;
        dnEl.title = payload.dayNightMarker === "DAY" ? t("dn_day") : t("dn_night");
        wrap.appendChild(dnEl);
        hasAnyToken = true;
    }

    if (safeParts.time) {
        const clockEl = document.createElement("span");
        clockEl.className = "fixed-time-clock";
        clockEl.textContent = payload?.clock || "--:--:--";
        wrap.appendChild(clockEl);
        hasAnyToken = true;
    }

    if (safeParts.weekday && payload?.dayName) {
        const dayEl = document.createElement("span");
        const isSun = payload.weekdayIndex === 0;
        const isSat = payload.weekdayIndex === 6;
        dayEl.className = `day-badge${isSun ? " day-sun" : (isSat ? " day-sat" : "")}`;
        dayEl.textContent = payload.dayName;
        wrap.appendChild(dayEl);
        hasAnyToken = true;
    }

    if (!hasAnyToken) {
        const emptyEl = document.createElement("span");
        emptyEl.className = "fixed-time-empty";
        emptyEl.textContent = "-";
        wrap.appendChild(emptyEl);
    }

    cell.appendChild(wrap);
}

function formatFixedTimePayloadText(payload, partsEnabled) {
    if (!fixedTimeActionsService || typeof fixedTimeActionsService.formatFixedTimePayloadText !== "function") return "-";
    return fixedTimeActionsService.formatFixedTimePayloadText(payload, partsEnabled);
}

function getFixedTimeCopyState() {
    if (!fixedTimeActionsService || typeof fixedTimeActionsService.getFixedTimeCopyState !== "function") {
        return {
            order: sanitizeCopyFormatOrderForContext(copyFormatOrder, "fixed-time"),
            enabled: sanitizeCopyFormatEnabledForContext(copyFormatEnabled, "copy", "fixed-time"),
            timePartsEnabled: sanitizeTimePartsEnabledForContext(copyTimePartsEnabled, "copy", "fixed-time")
        };
    }
    return fixedTimeActionsService.getFixedTimeCopyState();
}

function buildFixedTimeSnapshotForTimezoneSlot(tz, slotUtcDate) {
    if (!fixedTimeActionsService || typeof fixedTimeActionsService.buildFixedTimeSnapshotForTimezoneSlot !== "function") return null;
    return fixedTimeActionsService.buildFixedTimeSnapshotForTimezoneSlot(tz, slotUtcDate);
}

function formatFixedTimeCopyTextForTimezoneSlot(tz, slotUtcDate, copyState = null) {
    if (!fixedTimeActionsService || typeof fixedTimeActionsService.formatFixedTimeCopyTextForTimezoneSlot !== "function") return "";
    return fixedTimeActionsService.formatFixedTimeCopyTextForTimezoneSlot(tz, slotUtcDate, copyState);
}

function getFixedTimeSlotUtcDateByIndex(slotIdx) {
    if (!fixedTimeActionsService || typeof fixedTimeActionsService.getFixedTimeSlotUtcDateByIndex !== "function") return null;
    return fixedTimeActionsService.getFixedTimeSlotUtcDateByIndex(slotIdx);
}

function getFixedTimePreviewCopyText() {
    if (!fixedTimeActionsService || typeof fixedTimeActionsService.getFixedTimePreviewCopyText !== "function") return "";
    return fixedTimeActionsService.getFixedTimePreviewCopyText();
}

function getAllFixedTimeRowsCopyText() {
    if (!fixedTimeActionsService || typeof fixedTimeActionsService.getAllFixedTimeRowsCopyText !== "function") return "";
    return fixedTimeActionsService.getAllFixedTimeRowsCopyText();
}

async function copyFixedTimeCellPayload(payload, partsEnabled) {
    if (!fixedTimeActionsService || typeof fixedTimeActionsService.copyFixedTimeCellPayload !== "function") return;
    return fixedTimeActionsService.copyFixedTimeCellPayload(payload, partsEnabled);
}

async function copyFixedTimeCellByTimezone(tz, slotUtcDate) {
    if (!fixedTimeActionsService || typeof fixedTimeActionsService.copyFixedTimeCellByTimezone !== "function") return;
    return fixedTimeActionsService.copyFixedTimeCellByTimezone(tz, slotUtcDate);
}

function buildFixedTimeCellInputValue(utcDate, tz) {
    if (!fixedTimeActionsService || typeof fixedTimeActionsService.buildFixedTimeCellInputValue !== "function") return "";
    return fixedTimeActionsService.buildFixedTimeCellInputValue(utcDate, tz);
}

function buildFixedTimeCellTimeParts(rawValue) {
    if (!fixedTimeActionsService || typeof fixedTimeActionsService.buildFixedTimeCellTimeParts !== "function") return null;
    return fixedTimeActionsService.buildFixedTimeCellTimeParts(rawValue);
}

function applyFixedTimeSlotByTimezoneInput(slotIdx, tz, rawValue, anchorUtcDate) {
    if (!fixedTimeActionsService || typeof fixedTimeActionsService.applyFixedTimeSlotByTimezoneInput !== "function") return false;
    return fixedTimeActionsService.applyFixedTimeSlotByTimezoneInput(slotIdx, tz, rawValue, anchorUtcDate);
}

function bindCustomDatePickerForInput(input, triggerBtn, options = {}) {
    const CustomDatePickerCtor = window.CustomDatePicker;
    if (!CustomDatePickerCtor) return;
    const preserveValue = !!options?.preserveValue;
    const pickerType = (options?.type === "date" || options?.type === "time" || options?.type === "datetime")
        ? options.type
        : "datetime";
    const preservedInputValue = preserveValue ? String(input.value || "") : "";
    if (input._cdp && typeof input._cdp.destroy === "function") {
        input._cdp.destroy();
    }
    input._cdp = new CustomDatePickerCtor(input, {
        type: pickerType,
        lang: document.documentElement?.lang || "en",
        theme: document.documentElement?.getAttribute?.("data-theme") || "dark",
        triggerElement: triggerBtn || null
    });
    if (preserveValue) {
        input.value = preservedInputValue;
    }
}

async function copyFixedTimeSlotColumn(slotIdx) {
    if (!fixedTimeActionsService || typeof fixedTimeActionsService.copyFixedTimeSlotColumn !== "function") return;
    return fixedTimeActionsService.copyFixedTimeSlotColumn(slotIdx);
}

function renameFixedTimeSlot(slotIdx) {
    if (!fixedTimeActionsService || typeof fixedTimeActionsService.renameFixedTimeSlot !== "function") return;
    fixedTimeActionsService.renameFixedTimeSlot(slotIdx);
}

function updateFixedTimeSlotTime(slotIdx, rawValue) {
    if (!fixedTimeActionsService || typeof fixedTimeActionsService.updateFixedTimeSlotTime !== "function") return false;
    return fixedTimeActionsService.updateFixedTimeSlotTime(slotIdx, rawValue);
}

function addFixedTimeSlot() {
    if (!fixedTimeActionsService || typeof fixedTimeActionsService.addFixedTimeSlot !== "function") return;
    fixedTimeActionsService.addFixedTimeSlot();
}

function removeFixedTimeSlot(slotId) {
    if (!fixedTimeActionsService || typeof fixedTimeActionsService.removeFixedTimeSlot !== "function") return;
    fixedTimeActionsService.removeFixedTimeSlot(slotId);
}

function renderFixedTimeControls() {
    refreshFixedTimeSlotCountControls();
    const dateInput = document.getElementById("fixed-time-date-input");
    const group = getCurrentGroup();
    if (!dateInput) return;
    if (!group) {
        dateInput.value = "";
        return;
    }
    ensureGroupFixedTimes(group);
    dateInput.value = group.fixedDate || "";
}

function getFixedTimeSlotLayoutMetrics(partsEnabled) {
    if (!fixedTimeTableService || typeof fixedTimeTableService.getFixedTimeSlotLayoutMetrics !== "function") {
        return { inputWidthPx: 100, columnMinWidthPx: 152 };
    }
    return fixedTimeTableService.getFixedTimeSlotLayoutMetrics(partsEnabled);
}

function getFixedTimeDisplayColumns() {
    if (!fixedTimeTableService || typeof fixedTimeTableService.getFixedTimeDisplayColumns !== "function") {
        return ["timezone", "region", "time_slots"];
    }
    return fixedTimeTableService.getFixedTimeDisplayColumns();
}

function getFixedTimeOffsetTextAtDate(tz, anchorDate) {
    if (!fixedTimeTableService || typeof fixedTimeTableService.getFixedTimeOffsetTextAtDate !== "function") {
        return "";
    }
    return fixedTimeTableService.getFixedTimeOffsetTextAtDate(tz, anchorDate);
}

function renderFixedTimeTable() {
    if (!fixedTimeTableService || typeof fixedTimeTableService.renderFixedTimeTable !== "function") return;
    fixedTimeTableService.renderFixedTimeTable();
}

function renderFixedTimeTab() {
    const group = getCurrentGroup();
    if (!group) return;
    ensureGroupFixedTimes(group);
    renderBaseTimeSelect();
    renderFixedTimeControls();
    renderFixedTimeTable();
}

// --- Clock Logic ---
function updateClocks() {
    if (!mainClockOrchestratorService || typeof mainClockOrchestratorService.updateClocks !== "function") return;
    mainClockOrchestratorService.updateClocks();
}

function resolveLocalDatePartsByTimezoneAtDate(timezone, utcDate, timezoneId = null) {
    return timeInputMutationsService.resolveLocalDatePartsByTimezoneAtDate(timezone, utcDate, timezoneId);
}

function resolveLocalDatePartsByTimezone(timezone, slotIdx, timezoneId = null) {
    return timeInputMutationsService.resolveLocalDatePartsByTimezone(timezone, slotIdx, timezoneId);
}

function buildStrictUtcDateFromParts(parts) {
    return timeInputMutationsService.buildStrictUtcDateFromParts(parts);
}

function handleTimeChange(val, timezone, slotIdx, timezoneId = null, inputMode = "datetime") {
    return timeInputMutationsService.handleTimeChange(val, timezone, slotIdx, timezoneId, inputMode);
}

function handleMultiRangeTimeChange(rangeIdx, val, timezone, slotIdx, timezoneId = null, inputMode = "datetime") {
    return timeInputMutationsService.handleMultiRangeTimeChange(
        rangeIdx,
        val,
        timezone,
        slotIdx,
        timezoneId,
        inputMode
    );
}

function createStandardTimezoneFromSelectableEntry(entry) {
    if (!entry || typeof entry !== "object") return null;
    return timezoneSearchService.createStandardTimezoneFromSelectableEntry(entry);
}

function addTimezone(tz) {
    if (!mainTimezoneMutationService || typeof mainTimezoneMutationService.addTimezone !== "function") return;
    return mainTimezoneMutationService.addTimezone(tz);
}
function removeTimezone(id) {
    if (!mainTimezoneMutationService || typeof mainTimezoneMutationService.removeTimezone !== "function") return;
    mainTimezoneMutationService.removeTimezone(id);
}

function formatTimeTextByParts(snapshot, timePartsEnabled) {
    const safeSnapshot = (snapshot && typeof snapshot === "object") ? snapshot : {};
    const safeTimeParts = (timePartsEnabled === undefined) ? DEFAULT_COPY_TIME_PARTS_ENABLED : timePartsEnabled;
    return snapshotFormatService.formatTimeTextByParts(safeSnapshot, safeTimeParts);
}

function formatSnapshotText(snapshot, order, enabled, timePartsEnabled = DEFAULT_COPY_TIME_PARTS_ENABLED) {
    const safeSnapshot = (snapshot && typeof snapshot === "object") ? snapshot : {};
    return snapshotFormatService.formatSnapshotText(safeSnapshot, order, enabled, timePartsEnabled);
}

function updateCopyFormatPreview() {
    copyActionsService.updateCopyFormatPreview();
}

async function copyAllTimezones() {
    return await copyActionsService.copyAllTimezones();
}

async function copyMultiRangeRow(rangeIdx, rowId) {
    if (!Number.isInteger(rangeIdx) || rangeIdx < 0) return false;
    if (typeof rowId !== "string" || !rowId.trim()) return false;
    return await multiRangeCopyService.copyMultiRangeRow(rangeIdx, rowId);
}

async function copyAllMultiRangeTimezones() {
    return await multiRangeCopyService.copyAllMultiRangeTimezones();
}

function initCalculators() {
    if (!calculatorActionsService || typeof calculatorActionsService.initCalculators !== "function") return;
    calculatorActionsService.initCalculators();
}

async function copyText(elementId, isInput = false) {
    if (!calculatorActionsService || typeof calculatorActionsService.copyText !== "function") return;
    return await calculatorActionsService.copyText(elementId, isInput);
}

function getPersistenceSnapshot() {
    if (!mainPersistenceSnapshotService || typeof mainPersistenceSnapshotService.getPersistenceSnapshot !== "function") {
        return {};
    }
    return mainPersistenceSnapshotService.getPersistenceSnapshot();
}

function sanitizeGroup(group, idx, legacyMultiState = null) {
    if (!group || typeof group !== "object") return null;
    const safeIdx = Number.isInteger(idx) && idx >= 0 ? idx : 0;
    return groupStateService.sanitizeGroup(group, safeIdx, legacyMultiState);
}

async function loadPersistence() {
    return await persistenceService.loadPersistence();
}

// --- End of main.js ---






