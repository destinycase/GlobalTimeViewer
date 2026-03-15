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
const GTV_SERVICE_BOOTSTRAP = (typeof window !== "undefined" ? window.GTVServiceBootstrap : globalThis.GTVServiceBootstrap);
const GTV_APP_STATE_PATCHER = (typeof window !== "undefined" ? window.GTVAppStatePatcher : globalThis.GTVAppStatePatcher);
const GTV_TIME_SERVICE = (typeof window !== "undefined" ? window.GTVTimeService : globalThis.GTVTimeService);
const GTV_TIME_CORE = (typeof window !== "undefined" ? window.GTVTimeCore : globalThis.GTVTimeCore);
const GTV_TIME_INPUT_MUTATIONS = (typeof window !== "undefined" ? window.GTVTimeInputMutations : globalThis.GTVTimeInputMutations);
const GTV_TIMER_ENGINE = (typeof window !== "undefined" ? window.GTVTimerEngine : globalThis.GTVTimerEngine);
const GTV_CALCULATOR = (typeof window !== "undefined" ? window.GTVCalculator : globalThis.GTVCalculator);
const GTV_CALCULATOR_ACTIONS = (typeof window !== "undefined" ? window.GTVCalculatorActions : globalThis.GTVCalculatorActions);
const GTV_MULTI_STATE = (typeof window !== "undefined" ? window.GTVMultiState : globalThis.GTVMultiState);
const GTV_IMAGE_EXPORT = (typeof window !== "undefined" ? window.GTVImageExport : globalThis.GTVImageExport);
const GTV_IMAGE_EXPORT_ACTIONS = (typeof window !== "undefined" ? window.GTVImageExportActions : globalThis.GTVImageExportActions);
const GTV_IMAGE_EXPORT_BRIDGE = (typeof window !== "undefined" ? window.GTVImageExportBridge : globalThis.GTVImageExportBridge);
const GTV_IMAGE_EXPORT_NAMING = (typeof window !== "undefined" ? window.GTVImageExportNaming : globalThis.GTVImageExportNaming);
const GTV_IMAGE_CLONE = (typeof window !== "undefined" ? window.GTVImageClone : globalThis.GTVImageClone);
const GTV_IMAGE_FOREIGN_RENDER = (typeof window !== "undefined" ? window.GTVImageForeignRender : globalThis.GTVImageForeignRender);
const GTV_TABLE_IMAGE_RENDER = (typeof window !== "undefined" ? window.GTVTableImageRender : globalThis.GTVTableImageRender);
const GTV_GROUP_STATE = (typeof window !== "undefined" ? window.GTVGroupState : globalThis.GTVGroupState);
const GTV_GROUP_CONTEXT_STATE = (typeof window !== "undefined" ? window.GTVGroupContextState : globalThis.GTVGroupContextState);
const GTV_GROUP_TABS = (typeof window !== "undefined" ? window.GTVGroupTabs : globalThis.GTVGroupTabs);
const GTV_TIMEZONE_SEARCH = (typeof window !== "undefined" ? window.GTVTimezoneSearch : globalThis.GTVTimezoneSearch);
const GTV_SNAPSHOT_FORMAT = (typeof window !== "undefined" ? window.GTVSnapshotFormat : globalThis.GTVSnapshotFormat);
const GTV_TABLE_RENDER = (typeof window !== "undefined" ? window.GTVTableRender : globalThis.GTVTableRender);
const GTV_MULTI_RANGE_STATE = (typeof window !== "undefined" ? window.GTVMultiRangeState : globalThis.GTVMultiRangeState);
const GTV_MULTI_RANGE_RENDER = (typeof window !== "undefined" ? window.GTVMultiRangeRender : globalThis.GTVMultiRangeRender);
const GTV_MULTI_RANGE_IMAGE_RENDER = (typeof window !== "undefined" ? window.GTVMultiRangeImageRender : globalThis.GTVMultiRangeImageRender);
const GTV_MULTI_RANGE_COPY = (typeof window !== "undefined" ? window.GTVMultiRangeCopy : globalThis.GTVMultiRangeCopy);
const GTV_COPY_ACTIONS = (typeof window !== "undefined" ? window.GTVCopyActions : globalThis.GTVCopyActions);
const GTV_TIME_ADJUST_UI = (typeof window !== "undefined" ? window.GTVTimeAdjustUI : globalThis.GTVTimeAdjustUI);
const GTV_TIME_ADJUST_ACTIONS = (typeof window !== "undefined" ? window.GTVTimeAdjustActions : globalThis.GTVTimeAdjustActions);
const GTV_MULTI_BULK_TOOLS = (typeof window !== "undefined" ? window.GTVMultiBulkTools : globalThis.GTVMultiBulkTools);
const GTV_TIMELINE_FRAME = (typeof window !== "undefined" ? window.GTVTimelineFrame : globalThis.GTVTimelineFrame);
const GTV_FIXED_TIME_CORE = (typeof window !== "undefined" ? window.GTVFixedTimeCore : globalThis.GTVFixedTimeCore);
const GTV_FIXED_TIME_SLOT_UTILS = (typeof window !== "undefined" ? window.GTVFixedTimeSlotUtils : globalThis.GTVFixedTimeSlotUtils);
const GTV_FIXED_TIME_STATE = (typeof window !== "undefined" ? window.GTVFixedTimeState : globalThis.GTVFixedTimeState);
const GTV_FIXED_TIME_TIMELINE = (typeof window !== "undefined" ? window.GTVFixedTimeTimeline : globalThis.GTVFixedTimeTimeline);
const GTV_FIXED_TIME_ACTIONS = (typeof window !== "undefined" ? window.GTVFixedTimeActions : globalThis.GTVFixedTimeActions);
const GTV_FIXED_TIME_TABLE = (typeof window !== "undefined" ? window.GTVFixedTimeTable : globalThis.GTVFixedTimeTable);
const GTV_FORMAT_PROFILE_STATE = (typeof window !== "undefined" ? window.GTVFormatProfileState : globalThis.GTVFormatProfileState);
const GTV_FORMAT_CONTROLS = (typeof window !== "undefined" ? window.GTVFormatControls : globalThis.GTVFormatControls);
const GTV_TAB_UI = (typeof window !== "undefined" ? window.GTVTabUI : globalThis.GTVTabUI);
const GTV_TAB_ORCHESTRATOR = (typeof window !== "undefined" ? window.GTVTabOrchestrator : globalThis.GTVTabOrchestrator);
const GTV_UI_SETTINGS_ACTIONS = (typeof window !== "undefined" ? window.GTVUiSettingsActions : globalThis.GTVUiSettingsActions);
const GTV_APP_PERSISTENCE_STATE = (typeof window !== "undefined" ? window.GTVAppPersistenceState : globalThis.GTVAppPersistenceState);
const GTV_PERSISTENCE_SERVICE_BUNDLE = (typeof window !== "undefined" ? window.GTVPersistenceServiceBundle : globalThis.GTVPersistenceServiceBundle);
const GTV_STATE_PERSISTENCE = (typeof window !== "undefined" ? window.GTVStatePersistence : globalThis.GTVStatePersistence);
const GTV_UI_PREFERENCES_STATE = (typeof window !== "undefined" ? window.GTVUiPreferencesState : globalThis.GTVUiPreferencesState);
const GTV_SETTINGS_IO = (typeof window !== "undefined" ? window.GTVSettingsIO : globalThis.GTVSettingsIO);
const GTV_DATA_TRANSFER = (typeof window !== "undefined" ? window.GTVDataTransfer : globalThis.GTVDataTransfer);
const GTV_APP_CONFIG = (typeof window !== "undefined" ? window.GTVAppConfig : globalThis.GTVAppConfig);
const GTV_TIMEZONE_DATA = (typeof window !== "undefined" ? window.GTVTimezoneData : globalThis.GTVTimezoneData);
const GTV_MAIN_UI_INIT = (typeof window !== "undefined" ? window.GTVMainUiInit : globalThis.GTVMainUiInit);
const GTV_MAIN_UI_UTILS = (typeof window !== "undefined" ? window.GTVMainUiUtils : globalThis.GTVMainUiUtils);
const GTV_APP_FEEDBACK = (typeof window !== "undefined" ? window.GTVAppFeedback : globalThis.GTVAppFeedback);
if (!GTV_SERVICE_BOOTSTRAP || typeof GTV_SERVICE_BOOTSTRAP.createService !== "function") {
    throw new Error("Missing required module API: GTVServiceBootstrap.createService");
}
if (!GTV_APP_STATE_PATCHER || typeof GTV_APP_STATE_PATCHER.createService !== "function") {
    throw new Error("Missing required module API: GTVAppStatePatcher.createService");
}
if (!GTV_TIME_SERVICE || typeof GTV_TIME_SERVICE.createService !== "function") {
    throw new Error("Missing required module API: GTVTimeService.createService");
}
if (!GTV_TIME_CORE) {
    throw new Error("Missing required module: GTVTimeCore");
}
if (!GTV_TIME_INPUT_MUTATIONS || typeof GTV_TIME_INPUT_MUTATIONS.createService !== "function") {
    throw new Error("Missing required module API: GTVTimeInputMutations.createService");
}
if (!GTV_TIMER_ENGINE || typeof GTV_TIMER_ENGINE.createService !== "function") {
    throw new Error("Missing required module API: GTVTimerEngine.createService");
}
if (!GTV_CALCULATOR_ACTIONS || typeof GTV_CALCULATOR_ACTIONS.createService !== "function") {
    throw new Error("Missing required module API: GTVCalculatorActions.createService");
}
if (!GTV_IMAGE_EXPORT || typeof GTV_IMAGE_EXPORT.createService !== "function") {
    throw new Error("Missing required module API: GTVImageExport.createService");
}
if (!GTV_IMAGE_EXPORT_ACTIONS || typeof GTV_IMAGE_EXPORT_ACTIONS.createService !== "function") {
    throw new Error("Missing required module API: GTVImageExportActions.createService");
}
if (!GTV_IMAGE_EXPORT_BRIDGE || typeof GTV_IMAGE_EXPORT_BRIDGE.createService !== "function") {
    throw new Error("Missing required module API: GTVImageExportBridge.createService");
}
if (!GTV_IMAGE_EXPORT_NAMING || typeof GTV_IMAGE_EXPORT_NAMING.createService !== "function") {
    throw new Error("Missing required module API: GTVImageExportNaming.createService");
}
if (!GTV_IMAGE_CLONE || typeof GTV_IMAGE_CLONE.createService !== "function") {
    throw new Error("Missing required module API: GTVImageClone.createService");
}
if (!GTV_IMAGE_FOREIGN_RENDER || typeof GTV_IMAGE_FOREIGN_RENDER.createService !== "function") {
    throw new Error("Missing required module API: GTVImageForeignRender.createService");
}
if (!GTV_TABLE_IMAGE_RENDER || typeof GTV_TABLE_IMAGE_RENDER.createService !== "function") {
    throw new Error("Missing required module API: GTVTableImageRender.createService");
}
if (!GTV_MULTI_STATE || typeof GTV_MULTI_STATE.createService !== "function") {
    throw new Error("Missing required module API: GTVMultiState.createService");
}
if (!GTV_GROUP_STATE || typeof GTV_GROUP_STATE.createService !== "function") {
    throw new Error("Missing required module API: GTVGroupState.createService");
}
if (!GTV_GROUP_CONTEXT_STATE || typeof GTV_GROUP_CONTEXT_STATE.createService !== "function") {
    throw new Error("Missing required module API: GTVGroupContextState.createService");
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
if (!GTV_MULTI_RANGE_STATE || typeof GTV_MULTI_RANGE_STATE.createService !== "function") {
    throw new Error("Missing required module API: GTVMultiRangeState.createService");
}
if (!GTV_MULTI_RANGE_IMAGE_RENDER || typeof GTV_MULTI_RANGE_IMAGE_RENDER.createService !== "function") {
    throw new Error("Missing required module API: GTVMultiRangeImageRender.createService");
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
if (!GTV_TIME_ADJUST_ACTIONS || typeof GTV_TIME_ADJUST_ACTIONS.createService !== "function") {
    throw new Error("Missing required module API: GTVTimeAdjustActions.createService");
}
if (!GTV_MULTI_BULK_TOOLS || typeof GTV_MULTI_BULK_TOOLS.createService !== "function") {
    throw new Error("Missing required module API: GTVMultiBulkTools.createService");
}
if (!GTV_TIMELINE_FRAME || typeof GTV_TIMELINE_FRAME.createService !== "function") {
    throw new Error("Missing required module API: GTVTimelineFrame.createService");
}
if (!GTV_FIXED_TIME_CORE || typeof GTV_FIXED_TIME_CORE.createService !== "function") {
    throw new Error("Missing required module API: GTVFixedTimeCore.createService");
}
if (!GTV_FIXED_TIME_SLOT_UTILS || typeof GTV_FIXED_TIME_SLOT_UTILS.createService !== "function") {
    throw new Error("Missing required module API: GTVFixedTimeSlotUtils.createService");
}
if (!GTV_FIXED_TIME_STATE || typeof GTV_FIXED_TIME_STATE.createService !== "function") {
    throw new Error("Missing required module API: GTVFixedTimeState.createService");
}
if (!GTV_FIXED_TIME_TIMELINE || typeof GTV_FIXED_TIME_TIMELINE.createService !== "function") {
    throw new Error("Missing required module API: GTVFixedTimeTimeline.createService");
}
if (!GTV_FIXED_TIME_ACTIONS || typeof GTV_FIXED_TIME_ACTIONS.createService !== "function") {
    throw new Error("Missing required module API: GTVFixedTimeActions.createService");
}
if (!GTV_FIXED_TIME_TABLE || typeof GTV_FIXED_TIME_TABLE.createService !== "function") {
    throw new Error("Missing required module API: GTVFixedTimeTable.createService");
}
if (!GTV_FORMAT_PROFILE_STATE || typeof GTV_FORMAT_PROFILE_STATE.createService !== "function") {
    throw new Error("Missing required module API: GTVFormatProfileState.createService");
}
if (!GTV_FORMAT_CONTROLS || typeof GTV_FORMAT_CONTROLS.createService !== "function") {
    throw new Error("Missing required module API: GTVFormatControls.createService");
}
if (!GTV_TAB_UI || typeof GTV_TAB_UI.createService !== "function") {
    throw new Error("Missing required module API: GTVTabUI.createService");
}
if (!GTV_TAB_ORCHESTRATOR || typeof GTV_TAB_ORCHESTRATOR.createService !== "function") {
    throw new Error("Missing required module API: GTVTabOrchestrator.createService");
}
if (!GTV_UI_SETTINGS_ACTIONS || typeof GTV_UI_SETTINGS_ACTIONS.createService !== "function") {
    throw new Error("Missing required module API: GTVUiSettingsActions.createService");
}
if (!GTV_APP_PERSISTENCE_STATE || typeof GTV_APP_PERSISTENCE_STATE.createService !== "function") {
    throw new Error("Missing required module API: GTVAppPersistenceState.createService");
}
if (!GTV_PERSISTENCE_SERVICE_BUNDLE || typeof GTV_PERSISTENCE_SERVICE_BUNDLE.createService !== "function") {
    throw new Error("Missing required module API: GTVPersistenceServiceBundle.createService");
}
if (!GTV_STATE_PERSISTENCE || typeof GTV_STATE_PERSISTENCE.createService !== "function") {
    throw new Error("Missing required module API: GTVStatePersistence.createService");
}
if (!GTV_UI_PREFERENCES_STATE || typeof GTV_UI_PREFERENCES_STATE.createService !== "function") {
    throw new Error("Missing required module API: GTVUiPreferencesState.createService");
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
if (
    !GTV_TIMEZONE_DATA ||
    !Array.isArray(GTV_TIMEZONE_DATA.TZ_DATABASE) ||
    !GTV_TIMEZONE_DATA.ZONE_MAP ||
    typeof GTV_TIMEZONE_DATA.ZONE_MAP !== "object"
) {
    throw new Error("Missing required module API: GTVTimezoneData");
}
if (!GTV_MAIN_UI_UTILS || typeof GTV_MAIN_UI_UTILS.createService !== "function") {
    throw new Error("Missing required module API: GTVMainUiUtils.createService");
}
if (!GTV_MAIN_UI_INIT || typeof GTV_MAIN_UI_INIT.createService !== "function") {
    throw new Error("Missing required module API: GTVMainUiInit.createService");
}
if (!GTV_APP_FEEDBACK || typeof GTV_APP_FEEDBACK.createService !== "function") {
    throw new Error("Missing required module API: GTVAppFeedback.createService");
}

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
const serviceBootstrap = GTV_SERVICE_BOOTSTRAP.createService({
    GTV_TAB_UI,
    GTV_TAB_ORCHESTRATOR,
    GTV_GROUP_STATE
});
const persistenceServiceBundleFactory = GTV_PERSISTENCE_SERVICE_BUNDLE.createService({
    GTV_STATE_PERSISTENCE,
    GTV_SETTINGS_IO,
    GTV_DATA_TRANSFER,
    GTV_UI_SETTINGS_ACTIONS
});
const mainUiUtilsService = GTV_MAIN_UI_UTILS.createService();
appFeedbackService = GTV_APP_FEEDBACK.createService({
    t,
    resetAllSettings: async () => {
        if (persistenceService && typeof persistenceService.resetAllSettings === "function") {
            await persistenceService.resetAllSettings();
        }
    },
    confirmFn: (message) => confirm(message),
    location: (typeof location === "object" && location) ? location : null,
    document: (typeof document === "object" && document) ? document : null,
    logError: (...args) => console.error(...args)
});
calculatorActionsService = GTV_CALCULATOR_ACTIONS.createService({
    GTV_CALCULATOR,
    PERIOD_RESULT_IDS,
    t: (...args) => t(...args),
    showToast: (...args) => showToast(...args),
    getElementById: (id) => {
        if (typeof document !== "object" || !document || typeof document.getElementById !== "function") return null;
        return document.getElementById(id);
    },
    writeClipboard: async (text) => {
        const clipboard = (typeof navigator === "object" && navigator && navigator.clipboard) ? navigator.clipboard : null;
        if (!clipboard || typeof clipboard.writeText !== "function") {
            throw new Error("Clipboard API unavailable");
        }
        return await clipboard.writeText(text);
    },
    logError: (...args) => console.error(...args)
});
const setCustomTooltip = mainUiUtilsService.setCustomTooltip;
const upgradeNativeTitleTooltips = mainUiUtilsService.upgradeNativeTitleTooltips;
const hideFloatingTooltip = mainUiUtilsService.hideFloatingTooltip;
const bindFloatingTooltipEvents = mainUiUtilsService.bindFloatingTooltipEvents;
const clearDragGhost = mainUiUtilsService.clearDragGhost;
const createDragGhostFromRow = mainUiUtilsService.createDragGhostFromRow;
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
    const safeDate = (date instanceof Date && Number.isFinite(date.getTime())) ? date : new Date();
    return [
        safeDate.getUTCFullYear(),
        safeDate.getUTCMonth(),
        safeDate.getUTCDate(),
        safeDate.getUTCHours(),
        safeDate.getUTCMinutes()
    ].join(":");
}

function setCappedRuntimeCache(cache, key, value) {
    if (!(cache instanceof Map)) return;
    if (cache.size >= MAX_RUNTIME_CACHE_SIZE) {
        cache.clear();
    }
    cache.set(key, value);
}

function getZoneAbbreviation(tz, date = globalTimes[0]) {
    if (!tz) return "";
    if (tz.zone === "UTC") return "UTC";
    if (tz.type === "custom") return normalizeCustomAbbr(tz.abbr);
    const fixedAbbr = timezoneSearchService.normalizeZoneAbbreviation(tz.fixedAbbr);
    if (fixedAbbr) return fixedAbbr;
    return getBetterAbbr(tz.zone, date);
}

function getBetterAbbr(zone, date) {
    if (zone === "UTC") return "UTC";
    const safeZone = (typeof zone === "string" && zone.trim()) ? zone : "UTC";
    const safeDate = (date instanceof Date && Number.isFinite(date.getTime())) ? date : new Date();
    const cacheKey = `${safeZone}|${getUtcMinuteCacheKey(safeDate)}`;
    if (zoneAbbrCache.has(cacheKey)) return zoneAbbrCache.get(cacheKey);

    let abbr = "";
    const mapping = ZONE_MAP[safeZone];
    if (mapping) {
        const mappedAbbr = (typeof mapping === "string") ? mapping : (isTimeZoneInDST(safeZone, safeDate) ? mapping[1] : mapping[0]);
        abbr = String(mappedAbbr || "").replace("GMT", "UTC");
        setCappedRuntimeCache(zoneAbbrCache, cacheKey, abbr);
        return abbr;
    }
    try {
        abbr = (timeService.toDateTime(safeDate).setZone(safeZone).offsetNameShort || "").replace("GMT", "UTC");
    } catch (_) {
        abbr = "";
    }
    setCappedRuntimeCache(zoneAbbrCache, cacheKey, abbr);
    return abbr;
}

function isTimeZoneInDST(zone, date) {
    const safeZone = (typeof zone === "string" && zone.trim()) ? zone : "UTC";
    const safeDate = (date instanceof Date && Number.isFinite(date.getTime())) ? date : new Date();
    const cacheKey = `${safeZone}|${getUtcMinuteCacheKey(safeDate)}`;
    if (timezoneDstCache.has(cacheKey)) return timezoneDstCache.get(cacheKey);

    let inDst = false;
    try {
        const year = safeDate.getUTCFullYear();
        const jan = new Date(Date.UTC(year, 0, 1, 12, 0, 0));
        const jul = new Date(Date.UTC(year, 6, 1, 12, 0, 0));
        const janOffset = timeService.toDateTime(jan).setZone(safeZone).offset;
        const julOffset = timeService.toDateTime(jul).setZone(safeZone).offset;
        const currentOffset = timeService.toDateTime(safeDate).setZone(safeZone).offset;
        const standardOffset = Math.min(janOffset, julOffset);
        inDst = currentOffset !== standardOffset;
    } catch (e) {
        inDst = false;
    }
    setCappedRuntimeCache(timezoneDstCache, cacheKey, inDst);
    return inDst;
}

function getTimezoneOffset(zone, date) {
    const safeZone = (typeof zone === "string" && zone.trim()) ? zone : "UTC";
    const safeDate = (date instanceof Date && Number.isFinite(date.getTime())) ? date : new Date();
    const cacheKey = `${safeZone}|${getUtcMinuteCacheKey(safeDate)}`;
    if (timezoneOffsetCache.has(cacheKey)) return timezoneOffsetCache.get(cacheKey);

    let offset = 0;
    try {
        offset = timeService.toDateTime(safeDate).setZone(safeZone).offset;
    } catch (err) {
        offset = 0;
    }
    setCappedRuntimeCache(timezoneOffsetCache, cacheKey, offset);
    return offset;
}

function getFixedOffsetForDisplayAtDate(tz, anchorDate) {
    if (!tz || tz.type !== "standard" || !tz.zone || tz.zone === "UTC") return null;
    const raw = tz.fixedOffsetMinutes;
    if (raw === null || raw === undefined || raw === "") return null;
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return null;
    return Math.min(14 * 60, Math.max(-14 * 60, Math.trunc(parsed)));
}

function getFixedOffsetForDisplay(tz) {
    return getFixedOffsetForDisplayAtDate(tz, globalTimes[0]);
}

function getLocalizedTZLabel(tzData) {
    if (currentLang === "en") return `${tzData.name_en} - ${tzData.city_en}`;
    return `${tzData.name} - ${tzData.city}`;
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

function sanitizeTimezoneId(value) {
    if (value == null) return "";
    return GTV_TIME_CORE.sanitizeTimezoneId(value);
}

function sanitizeBaseTimezoneId(value) {
    if (value == null) return "utc";
    return GTV_TIME_CORE.sanitizeBaseTimezoneId(value);
}

function setCurrentGroupBaseTimezoneId(value) {
    const group = getCurrentGroup();
    if (!group) return false;
    group.baseTimezoneId = sanitizeBaseTimezoneId(value);
    return true;
}

function applyCurrentGroupBaseTimezoneId(nextBaseId, options = {}) {
    const { persist = true } = options;
    const safeBaseId = sanitizeBaseTimezoneId(nextBaseId || "utc");
    if (safeBaseId === "utc") {
        const activeGroup = getCurrentGroup();
        if (activeGroup) {
            activeGroup.showUtcRow = true;
            activeGroup.utcRowOrder = 0;
        }
    }
    setCurrentGroupBaseTimezoneId(safeBaseId);
    renderList();
    renderTimelineFrame();
    timeAdjustUiService.updateTimeAdjustPanel();
    if (persist) persistenceService.savePersistence();
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

    const groupBaseCandidates = ["Default Group", "\uAE30\uBCF8 \uADF8\uB8F9"];
    const subgroupBaseCandidates = [
        "Subgroup",
        "Aux Group",
        "\uC11C\uBE0C \uADF8\uB8F9",
        "\uBCF4\uC870 \uADF8\uB8F9"
    ];
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

        multiStateService.ensureGroupMultiSubgroups(group);
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

function getCurrentMultiSubgroup() {
    const group = getCurrentGroup();
    if (!group) return null;
    multiStateService.ensureGroupMultiSubgroups(group);
    return group.multiSubgroups.find((subgroup) => subgroup.id === group.activeMultiSubgroupId) || group.multiSubgroups[0] || null;
}

function getCurrentMultiSubgroupName() {
    const subgroup = getCurrentMultiSubgroup();
    return multiStateService.sanitizeMultiSubgroupName(
        subgroup?.name,
        multiStateService.getDefaultMultiSubgroupName(0)
    );
}

function syncCurrentMultiStateToActiveSubgroup() {
    const group = getCurrentGroup();
    if (!group) return;
    multiStateService.ensureGroupMultiSubgroups(group);
    ensureMultiRangeState();

    const subgroup = getCurrentMultiSubgroup();
    if (!subgroup) return;

    subgroup.name = multiStateService.sanitizeMultiSubgroupName(
        subgroup.name,
        multiStateService.getDefaultMultiSubgroupName(0)
    );
    subgroup.multiRangeCount = sanitizeMultiRangeCount(multiRangeCount);
    subgroup.multiRanges = multiRanges.map((range) => ({
        startUtcMs: GTV_TIME_CORE.sanitizeUtcMs(range.startUtcMs, Date.now()),
        endUtcMs: GTV_TIME_CORE.sanitizeUtcMs(range.endUtcMs, Date.now())
    }));
    subgroup.multiRangeCollapsed = multiRangeCollapsed.map((flag) => !!flag);
    subgroup.multiRangeStartEditEnabled = multiRangeStartEditEnabled.map((flag) => !!flag);
    subgroup.multiRangeEndEditEnabled = multiRangeEndEditEnabled.map((flag) => !!flag);
}

function loadCurrentMultiStateFromActiveSubgroup() {
    const subgroup = getCurrentMultiSubgroup();
    const normalized = multiStateService.sanitizeMultiStatePayload(subgroup, null);
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
    return groupContextStateService.isCurrentGroupUtcRowVisible();
}

function getCurrentGroupUtcRowOrder() {
    return groupContextStateService.getCurrentGroupUtcRowOrder();
}

function getZoneDisplayName(tz) {
    if (!tz) return "";

    // Custom timezone: always use the user-defined name
    if (tz.type === "custom") {
        return tz.name_ko || tz.name || tz.name_en || tz.zone || "";
    }

    // Fixed offset standard time (e.g., "UTC+09:00 Standard Time" / "UTC+09:00 \uD45C\uC900\uC2DC")
    if (tz.fixedOffsetMinutes !== undefined && tz.fixedOffsetMinutes !== null) {
        const nameFallback = tz.name_ko || tz.name || tz.name_en || "";
        const lowerName = String(nameFallback).toLowerCase();
        if (lowerName.includes("standard time") || nameFallback.includes("\uD45C\uC900\uC2DC")) {
            const offsetLabel = formatUtcOffsetLabel(tz.fixedOffsetMinutes);
            return currentLang === "en"
                ? `${offsetLabel} Standard Time`
                : `${offsetLabel} \uD45C\uC900\uC2DC`;
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
    escapeHtml,
    getZoneDisplayName,
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

imageCloneService = GTV_IMAGE_CLONE.createService({
    document: (typeof document === "object" && document) ? document : null
});

imageForeignRenderService = GTV_IMAGE_FOREIGN_RENDER.createService({
    TABLE_IMAGE_EXPORT_WIDTH,
    getCanUseForeignObjectRenderer: () => canUseForeignObjectRenderer,
    setCanUseForeignObjectRenderer: (value) => {
        canUseForeignObjectRenderer = !!value;
    }
});

imageExportBridgeService = GTV_IMAGE_EXPORT_BRIDGE.createService({
    getImageCloneService: () => imageCloneService,
    getImageForeignRenderService: () => imageForeignRenderService,
    getTableImageRenderService: () => tableImageRenderService,
    getMultiRangeImageRenderService: () => multiRangeImageRenderService,
    getImageExportActionsService: () => imageExportActionsService,
    getDefaultTableExportContext: () => ({
        table: null,
        headerSelector: "#table-head th",
        rowSelector: "#clocks-container tr.time-row"
    })
});

tableImageRenderService = GTV_TABLE_IMAGE_RENDER.createService({
    EXPORT_MONO_FONT_FAMILY,
    isFixedTimeTab,
    waitForDocumentFontsReady,
    prepareExportCanvas,
    drawExportCellText,
    cloneTableForImageExport,
    renderElementWithForeignObjectToPngDataUrl
});

multiRangeImageRenderService = GTV_MULTI_RANGE_IMAGE_RENDER.createService({
    EXPORT_MONO_FONT_FAMILY,
    t,
    waitForDocumentFontsReady,
    ensureMultiRangeState,
    getBaseTimezoneRef,
    getMultiRanges: () => multiRanges,
    getMultiRangeTitleText: (rangeIdx, range, baseRef) =>
        multiRangeRenderService.getMultiRangeTitleText(rangeIdx, range, baseRef),
    cloneMultiRangeBlockForImageExport,
    prepareExportCanvas,
    drawExportCellText,
    extractTableCellText: (cell) =>
        tableImageRenderService && typeof tableImageRenderService.extractTableCellText === "function"
            ? tableImageRenderService.extractTableCellText(cell)
            : extractTableCellText(cell)
});

fixedTimeCoreService = GTV_FIXED_TIME_CORE.createService({
    DEFAULT_FIXED_TIME_VALUE,
    I18N_DATA,
    t,
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
    getFixedDateParts: () => getFixedDatePartsFromGroup()
});

fixedTimeTimelineService = GTV_FIXED_TIME_TIMELINE.createService({
    TIMELINE_TOTAL_SECONDS,
    getCurrentGroup,
    ensureGroupFixedTimes,
    getGlobalTime: (slotIdx) => globalTimes[slotIdx],
    resolveFixedTimeSlotUtcDate,
    clampNumber,
    pad,
    getFixedTimeSlotCount,
    sanitizeFixedTimeId,
    sanitizeFixedTimeName,
    getDefaultFixedTimeName,
    getFixedTimeSlotHeaderLabel
});

fixedTimeActionsService = GTV_FIXED_TIME_ACTIONS.createService({
    DEFAULT_FIXED_TIME_VALUE,
    MIN_FIXED_TIME_SLOT_COUNT,
    t: (...args) => t(...args),
    sanitizeCopyFormatOrderForContext,
    sanitizeCopyFormatEnabledForContext,
    sanitizeTimePartsEnabledForContext,
    getCopyFormatOrder: () => copyFormatOrder,
    getCopyFormatEnabled: () => copyFormatEnabled,
    getCopyTimePartsEnabled: () => copyTimePartsEnabled,
    buildTimezoneComputedSnapshotForDates: (tz, slotDates, options = {}) =>
        snapshotFormatService.buildTimezoneComputedSnapshotForDates(tz, slotDates, options),
    formatSnapshotText: (snapshot, order, enabled, timePartsEnabled) =>
        snapshotFormatService.formatSnapshotText(snapshot, order, enabled, timePartsEnabled),
    getCurrentGroup,
    ensureGroupFixedTimes,
    getBaseTimezoneRef,
    getGlobalTime: (slotIdx) => globalTimes[slotIdx],
    resolveFixedTimeSlotUtcDate,
    getFixedTimeSlotHeaderLabel,
    getRenderableTimezoneRows: (baseRef) => tableRenderService.getRenderableTimezoneRows(baseRef),
    getFixedOffsetForDisplayAtDate,
    getLocalPartsByTimezone,
    getUTCDateFromLocalParts,
    parseDateTimeParts,
    pad,
    showToast: (...args) => showToast(...args),
    writeClipboard: async (text) => navigator.clipboard.writeText(text),
    buildFixedTimeDisplayPayloadAtUtc,
    renderFixedTimeTab: (...args) => renderFixedTimeTab(...args),
    renderTimelineFrame: (...args) => renderTimelineFrame(...args),
    savePersistence: (...args) => persistenceService.savePersistence(...args),
    getDefaultFixedTimeName,
    sanitizeFixedTimeName,
    sanitizeFixedTimeValue,
    getFixedTimeSlotCount,
    setFixedTimeSlotCount,
    refreshFixedTimeSlotCountControls: (...args) => refreshFixedTimeSlotCountControls(...args)
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
    copyWholeMultiRange: (rangeIdx) => multiRangeCopyService.copyWholeMultiRange(rangeIdx),
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
    upgradeNativeTitleTooltips
});

const multiRangeCopyService = GTV_MULTI_RANGE_COPY.createService({
    t,
    showToast,
    ensureMultiRangeState,
    getMultiRanges: () => multiRanges,
    getBaseTimezoneRef,
    getRenderableTimezoneRows: (baseRef) => tableRenderService.getRenderableTimezoneRows(baseRef),
    getTimezoneRefById: (id) => snapshotFormatService.getTimezoneRefById(id),
    buildTimezoneComputedSnapshotForRange,
    formatSnapshotText,
    getMultiRangeTitleText: (rangeIdx, range, baseRef) =>
        multiRangeRenderService.getMultiRangeTitleText(rangeIdx, range, baseRef),
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
    isFixedTimeTab,
    ensureMultiRangeState,
    getMultiRanges: () => multiRanges,
    getBaseTimezoneRef,
    buildTimezoneComputedSnapshotForRange,
    formatSnapshotText,
    getCopyFormatOrder: () => copyFormatOrder,
    getCopyFormatEnabled: () => copyFormatEnabled,
    getCopyTimePartsEnabled: () => copyTimePartsEnabled,
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
    copyAllMultiRangeTimezones,
    writeClipboard: async (text) => navigator.clipboard.writeText(text)
});

const timeAdjustUiService = GTV_TIME_ADJUST_UI.createService({
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
    upgradeNativeTitleTooltips
});

multiBulkToolsService = GTV_MULTI_BULK_TOOLS.createService({
    t,
    getMultiRangeCount: () => multiRangeCount,
    renderTimeAdjustSet: (slotIdx, options = {}) => timeAdjustUiService.renderTimeAdjustSet(slotIdx, options),
    createTimeAdjustActionButton: (labelKey, slotIdx, action, onAction = null, disabled = false) =>
        timeAdjustUiService.createTimeAdjustActionButton(labelKey, slotIdx, action, onAction, disabled),
    createTimeAdjustDivider: () => timeAdjustUiService.createTimeAdjustDivider(),
    applyBulkRangeAllAction,
    applyFirstRangeStartAdjustAction: (slotIdx, action) =>
        applyMultiRangeTimeAdjustAction(0, slotIdx, action),
    setAllMultiRangeStartEditEnabled,
    setAllMultiRangeEndEditEnabled,
    upgradeNativeTitleTooltips
});

timeAdjustActionsService = GTV_TIME_ADJUST_ACTIONS.createService({
    isRealtime: () => isRealtime,
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
    savePersistence: () => {
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

const formatControlsService = GTV_FORMAT_CONTROLS.createService({
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
    getActiveTimePartKeys: () => getFormatProfileAllowedTimePartKeys(activeFormatProfileContext)
});

const tabUiService = serviceBootstrap.createTabUiService({
    t,
    sanitizeMainTab,
    clampGroupIndex,
    normalizeGroupTabState,
    isMultiTab,
    isFixedTimeTab,
    getSlotCount: () => slotCount,
    getShowCopyFormat: () => showCopyFormat,
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
    renderList,
    renderTimelineFrame,
    updateTimeAdjustPanel: () => timeAdjustUiService.updateTimeAdjustPanel(),
    renderCopyFormatControls: () => formatControlsService.renderCopyFormatControls(),
    savePersistence: (options = {}) => persistenceService.savePersistence(options)
});
const tabOrchestratorService = serviceBootstrap.createTabOrchestratorService({
    sanitizeMainTab,
    syncActiveFormatProfileFromState,
    resolveFormatProfileContext,
    activateFormatProfileContext,
    getSlotCount: () => slotCount,
    switchMainTabUi: (tab) => tabUiService.switchMainTab(tab),
    refreshOptionToggleDividersUi: () => tabUiService.refreshOptionToggleDividers()
});

const multiStateService = GTV_MULTI_STATE.createService({
    MIN_MULTI_RANGE_COUNT,
    t,
    getGroups: () => groups,
    getDefaultMultiRangeBounds,
    sanitizeMultiRangeCount,
    sanitizeMultiRangeItem,
    sanitizeUtcMs: (value, fallbackMs) => GTV_TIME_CORE.sanitizeUtcMs(value, fallbackMs)
});

imageExportNamingService = GTV_IMAGE_EXPORT_NAMING.createService({
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
    getCurrentMultiSubgroupName
});

imageExportActionsService = GTV_IMAGE_EXPORT_ACTIONS.createService({
    imageExportApi: GTV_IMAGE_EXPORT,
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
    getTimezoneTableImageFilename,
    getMultiRangeTableImageFilename,
    getMultiRangeTitlesImageFilename,
    getMultiRanges: () => multiRanges,
    isDomExceptionLike,
    setCanUseForeignObjectRenderer: (value) => {
        canUseForeignObjectRenderer = !!value;
    }
});

const groupStateService = serviceBootstrap.createGroupStateService({
    t,
    sanitizeTimezoneId,
    createUniqueTimezoneId,
    normalizeCustomAbbr,
    normalizeZoneAbbreviation: (value) => timezoneSearchService.normalizeZoneAbbreviation(value),
    sanitizeBaseTimezoneId,
    sanitizeUtcRowOrder: (value) => GTV_TIME_CORE.sanitizeUtcRowOrder(value),
    sanitizeMultiSubgroupId: (value) => multiStateService.sanitizeMultiSubgroupId(value),
    sanitizeFixedTimes,
    sanitizeFixedDateValue,
    ensureGroupMultiSubgroups: (group, options = {}) =>
        multiStateService.ensureGroupMultiSubgroups(group, options)
});
const appStatePatcherService = GTV_APP_STATE_PATCHER.createService({
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
    setIsRealtimeState: (...args) => setIsRealtimeState(...args)
});
const appPersistenceStateService = GTV_APP_PERSISTENCE_STATE.createService({
    getState: () => appStatePatcherService.getStateSnapshot(),
    setState: (next = {}) => appStatePatcherService.applyStatePatch(next),
    setIsRealtimeState: (...args) => setIsRealtimeState(...args),
    syncActiveFormatProfileFromState: (...args) => syncActiveFormatProfileFromState(...args),
    ensureFormatProfiles: (...args) => ensureFormatProfiles(...args),
    getCurrentFormatProfileState: (...args) => getCurrentFormatProfileState(...args),
    resolveFormatProfileContext: (...args) => resolveFormatProfileContext(...args),
    applyFormatProfileState: (...args) => applyFormatProfileState(...args)
});

const groupTabsService = GTV_GROUP_TABS.createService({
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
    savePersistence: (options = {}) => persistenceService.savePersistence(options),
    renderGroups: () => groupTabsService.renderGroups(),
    renderMultiSubgroups: () => groupTabsService.renderMultiSubgroups(),
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
    exportGroupToJSON: (groupIdx = activeGroupId) => dataTransferService.exportGroupToJSON(groupIdx),
    triggerGroupImportFor: (groupIdx = activeGroupId) => dataTransferService.triggerGroupImportFor(groupIdx),
    exportSubgroupToJSON: (groupIdx = activeGroupId, subgroupId = "") => dataTransferService.exportSubgroupToJSON(groupIdx, subgroupId),
    triggerSubgroupImportFor: (groupIdx = activeGroupId, subgroupId = "") => dataTransferService.triggerSubgroupImportFor(groupIdx, subgroupId)
});

const persistenceServices = persistenceServiceBundleFactory.createBundle({
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
    applyTranslations: () => {
        if (typeof globalThis.applyTranslations === "function") {
            globalThis.applyTranslations();
        }
    },
    getGroups: () => groups,
    getCurrentTheme: () => currentTheme,
    getCurrentLang: () => currentLang,
    getCurrentMainTab: () => currentMainTab,
    sanitizeUtcRowOrder: (value) => GTV_TIME_CORE.sanitizeUtcRowOrder(value),
    sanitizeTheme,
    sanitizeUiScalePercent,
    setCurrentLang,
    loadPersistence,
    localizeAutoGeneratedNamesForCurrentLanguage,
    getActiveGroupId: () => activeGroupId,
    sanitizeFilenamePart,
    pad,
    renderGroups: () => groupTabsService.renderGroups(),
    renderMultiSubgroups: () => groupTabsService.renderMultiSubgroups(),
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
});
const persistenceService = persistenceServices.persistenceService;
const settingsIoService = persistenceServices.settingsIoService;
const dataTransferService = persistenceServices.dataTransferService;
uiSettingsActionsService = persistenceServices.uiSettingsActionsService;

timelineFrameService = GTV_TIMELINE_FRAME.createService({
    TIMELINE_TOTAL_HOURS,
    TIMELINE_TOTAL_SECONDS,
    requestUiFrame,
    cancelUiFrame,
    t,
    getCurrentMainTab: () => currentMainTab,
    getShowTimeline: () => showTimeline,
    isMultiTab,
    isFixedTimeTab,
    getIsRealtime: () => isRealtime,
    getSlotCount: () => slotCount,
    getGlobalTime: (slotIdx) => globalTimes[slotIdx],
    setGlobalTime: (slotIdx, value) => {
        globalTimes[slotIdx] = value;
    },
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
    getFixedOffsetForDisplayAtDate,
    getLocalPartsByTimezone,
    getUTCDateFromLocalParts,
    clampNumber,
    pad,
    getCurrentLang: () => currentLang,
    getCurrentTheme: () => currentTheme,
    updateClocks: () => updateClocks(),
    savePersistence: () => persistenceService.savePersistence(),
    getTimelineFrameElement: () => document.getElementById("timeline-frame")
});

fixedTimeTableService = GTV_FIXED_TIME_TABLE.createService({
    t,
    getCurrentGroup,
    ensureGroupFixedTimes,
    getFixedTimeDisplayPartsEnabled,
    getDisplayFormatOrder: () => displayFormatOrder,
    getDisplayFormatEnabled: () => displayFormatEnabled,
    sanitizeCopyFormatOrderForContext,
    sanitizeCopyFormatEnabledForContext,
    getBaseTimezoneRef,
    getRenderableTimezoneRows: (baseRef) => tableRenderService.getRenderableTimezoneRows(baseRef),
    getGlobalTime: (slotIdx) => globalTimes[slotIdx],
    resolveFixedTimeSlotUtcDate,
    getFixedTimeTimelineIndicatorColor,
    getFixedTimeSlotHeaderLabel,
    renameFixedTimeSlot,
    copyFixedTimeSlotColumn,
    createDragGhostFromRow,
    clearDragGhost,
    saveFixedTimeOrder,
    updateClocks: () => updateClocks(),
    getZoneAbbreviation,
    getZoneDisplayName,
    formatUtcOffsetLabel,
    getCustomOffsetMinutes,
    getFixedOffsetForDisplayAtDate,
    getTimezoneOffset,
    buildFixedTimeDisplayPayloadAtUtc,
    bindCustomDatePickerForInput,
    buildFixedTimeCellInputValue,
    applyFixedTimeSlotByTimezoneInput,
    copyFixedTimeCellByTimezone,
    upgradeNativeTitleTooltips
});

mainUiInitService = GTV_MAIN_UI_INIT.createService({
    t,
    switchMainTab,
    populateUiScaleSelect,
    getUiScale: () => uiScale,
    applyUiScale,
    getMultiRangeCount: () => multiRangeCount,
    setMultiRangeCount,
    refreshMultiRangeControls,
    getFixedTimeSlotCountForCurrentGroup: () => getFixedTimeSlotCount(getCurrentGroup()),
    setFixedTimeSlotCount,
    refreshFixedTimeSlotCountControls,
    bindCustomDatePickerForInput,
    getCurrentGroup,
    ensureGroupFixedTimes,
    setCurrentGroupFixedDate,
    sanitizeFixedDateValue,
    showToast,
    normalizeCustomAbbr,
    addTimezone,
    createUniqueTimezoneId,
    syncActiveFormatProfileFromState,
    getSlotCount: () => slotCount,
    setSlotCount: (next) => {
        slotCount = next;
    },
    activateFormatProfileForCurrentContext,
    renderList,
    renderCopyFormatControls: () => formatControlsService.renderCopyFormatControls(),
    updateCopyFormatPreview,
    savePersistence: () => persistenceService.savePersistence(),
    getShowCopyFormat: () => showCopyFormat,
    setShowCopyFormat: (next) => {
        showCopyFormat = !!next;
    },
    getShowTimeline: () => showTimeline,
    setShowTimeline: (next) => {
        showTimeline = !!next;
    },
    renderTimelineFrame,
    resetDisplayFormatForActiveContext,
    resetCopyFormatForActiveContext,
    applyCurrentGroupBaseTimezoneId,
    addGroup: () => groupTabsService.addGroup(),
    addMultiSubgroup: () => groupTabsService.addMultiSubgroup(),
    copyAllTimezones,
    saveTimezoneTableImage,
    saveMultiRangeTitlesImage,
    bindTransferControls: () => {
        if (uiSettingsActionsService && typeof uiSettingsActionsService.bindTransferControls === "function") {
            uiSettingsActionsService.bindTransferControls();
        }
    },
    getCurrentTheme: () => currentTheme,
    applyTheme,
    refreshCalculator: () => {
        if (typeof window !== "undefined" && typeof window.__gtvCalcRefresh === "function") {
            window.__gtvCalcRefresh();
        }
    },
    getCurrentLang: () => currentLang,
    hideFloatingTooltip,
    setLanguage: (lang) => {
        const languageFn = (typeof globalThis !== "undefined" && typeof globalThis.setLanguage === "function")
            ? globalThis.setLanguage
            : null;
        if (languageFn) languageFn(lang);
    },
    localizeAutoGeneratedNamesForCurrentLanguage,
    applyVersionBranding,
    updateTZDropdown: () => timezoneSearchService.updateTZDropdown(),
    renderGroups: () => groupTabsService.renderGroups(),
    renderMultiSubgroups: () => groupTabsService.renderMultiSubgroups(),
    updateTimeAdjustPanel: () => timeAdjustUiService.updateTimeAdjustPanel(),
    refreshSelectWidths,
    bindResetControls: () => {
        if (uiSettingsActionsService && typeof uiSettingsActionsService.bindResetControls === "function") {
            uiSettingsActionsService.bindResetControls();
        }
    },
    renderBaseTimeSelect,
    updateOptionRowVisibility: () => tabUiService.updateOptionRowVisibility(),
    upgradeNativeTitleTooltips
});

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
    if (selectedNext !== selectedBefore) persistenceService.savePersistence();
    adjustSelectWidthForContent(select, 220);
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
    if (isFixedTimeTab()) {
        renderFixedTimeTab();
        renderTimelineFrame();
        return;
    }

    if (isMultiTab()) {
        multiRangeRenderService.renderMultiRanges();
        renderTimelineFrame();
        return;
    }

    const baseRef = getBaseTimezoneRef();
    const utcRef = getUTCRef();
    updateRow(baseRef.id, baseRef);
    if (baseRef.id !== "utc") updateRow(utcRef.id, utcRef);
    const currentZones = getCurrentGroupZones().filter(tz => tz.id !== baseRef.id);
    currentZones.forEach(tz => updateRow(tz.id, tz));
    if (showCopyFormat) {
        updateCopyFormatPreview();
    }
    renderTimelineFrame();
}

function getRowViewState(row) {
    const rowId = String(row?.id || "");
    const cached = rowId ? rowViewCache.get(rowId) : null;
    if (cached && cached.row === row) return cached;

    const state = {
        row,
        zoneCodeEl: row.querySelector(".zone-code"),
        offsetTextEl: row.querySelector(".offset-text"),
        periodEl: row.querySelector(".period-days-text"),
        periodTimeEl: row.querySelector(".period-time-text"),
        slotInputs: new Map(),
        slotDayBadges: new Map(),
        slotDnIcons: new Map()
    };

    if (rowId) {
        if (rowViewCache.size >= MAX_RUNTIME_CACHE_SIZE) rowViewCache.clear();
        rowViewCache.set(rowId, state);
    }
    return state;
}

function getSlotElementsForRow(rowViewState, slotIdx) {
    let inputs = rowViewState.slotInputs.get(slotIdx);
    if (!inputs) {
        inputs = [...rowViewState.row.querySelectorAll(`.time-input[data-slot="${slotIdx}"]`)];
        rowViewState.slotInputs.set(slotIdx, inputs);
    }

    let dayBadges = rowViewState.slotDayBadges.get(slotIdx);
    if (!dayBadges) {
        dayBadges = [...rowViewState.row.querySelectorAll(`.day-slot-${slotIdx}`)];
        rowViewState.slotDayBadges.set(slotIdx, dayBadges);
    }

    let dnIcons = rowViewState.slotDnIcons.get(slotIdx);
    if (!dnIcons) {
        dnIcons = [...rowViewState.row.querySelectorAll(`.dn-slot-${slotIdx}`)];
        rowViewState.slotDnIcons.set(slotIdx, dnIcons);
    }

    return { inputs, dayBadges, dnIcons };
}

function updateRow(id, tz) {
    const row = document.getElementById(`tz-row-${id}`);
    if (!row) return;

    const snapshot = snapshotFormatService.buildTimezoneComputedSnapshot(id);
    if (!snapshot) return;

    const rowViewState = getRowViewState(row);
    if (rowViewState.zoneCodeEl) rowViewState.zoneCodeEl.textContent = snapshot.timezone;
    if (rowViewState.offsetTextEl) rowViewState.offsetTextEl.textContent = snapshot.offset;

    const dayNames = I18N_DATA[currentLang]?.days || I18N_DATA.en?.days || [];
    const sunName = dayNames[0] || "";
    const satName = dayNames[6] || "";
    const effectiveSlotCount = isRealtime ? 1 : slotCount;
    for (let i = 0; i < effectiveSlotCount; i++) {
        const timeStr = snapshot.times[i] || "";
        const dateStr = snapshot.dates[i] || "";
        const clockStr = snapshot.clocks[i] || "";
        const dayStr = snapshot.dayNames[i] || "";
        const dayNightStatus = snapshot.dayNightIcons[i] || "DAY";
        const dayNightMarker = normalizeDayNightMarker(dayNightStatus);
        const dayNightGlyph = getDayNightGlyph(dayNightStatus);
        const { inputs, dayBadges, dnIcons } = getSlotElementsForRow(rowViewState, i);

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
            dayBadge.textContent = dayStr;
            const isSun = dayStr === sunName;
            const isSat = dayStr === satName;
            dayBadge.className = "day-badge day-slot-" + i + (isSun ? " day-sun" : (isSat ? " day-sat" : ""));
        });

        dnIcons.forEach(dnIcon => {
            dnIcon.textContent = dayNightGlyph;
            if (dayNightMarker === "DAY") dnIcon.title = t("dn_day");
            else if (dayNightMarker === "NIGHT") dnIcon.title = t("dn_night");
            else dnIcon.title = "";
        });
    }

    if (rowViewState.periodEl) {
        rowViewState.periodEl.textContent = snapshot.periodDays || "-";
    }

    if (rowViewState.periodTimeEl) {
        rowViewState.periodTimeEl.textContent = snapshot.periodTime || "-";
    }
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
    const activeGroup = getCurrentGroup();
    if (!activeGroup) return;
    if (!tz || typeof tz !== "object") return;
    if (tz?.type === "standard" && !groupStateService.isValidTimeZone(tz.zone)) {
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
    persistenceService.savePersistence();
    renderList();
    renderTimelineFrame();
}
function removeTimezone(id) {
    const activeGroup = getCurrentGroup();
    if (!activeGroup) return;
    if (id === getCurrentGroupBaseTimezoneId()) return;
    if (id === "utc") {
        activeGroup.showUtcRow = false;
        activeGroup.utcRowOrder = 0;
        persistenceService.savePersistence();
        renderList();
        renderTimelineFrame();
        return;
    }
    activeGroup.zones = activeGroup.zones.filter(z => z.id !== id);
    persistenceService.savePersistence();
    renderList();
    renderTimelineFrame();
}

function bindRowContainerDragAndDrop(container) {
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

function initDragAndDrop() {
    bindRowContainerDragAndDrop(document.getElementById("clocks-container"));
    bindRowContainerDragAndDrop(document.getElementById("fixed-time-body"));
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
function saveOrderForContainer(containerSelector) {
    const activeGroup = groups[activeGroupId];
    if (!activeGroup) return;
    const ids = [...document.querySelectorAll(`${containerSelector} .time-row:not(.static)`)].map(r => r.id.replace("tz-row-", ""));
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
    persistenceService.savePersistence();
}

function saveOrder() {
    saveOrderForContainer("#clocks-container");
}

function saveFixedTimeOrder() {
    saveOrderForContainer("#fixed-time-body");
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

function sanitizeFilenamePart(value) {
    if (imageExportNamingService && typeof imageExportNamingService.sanitizeFilenamePart === "function") {
        return imageExportNamingService.sanitizeFilenamePart(value);
    }
    return String(value || "")
        .replace(/[\\/:*?"<>|]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function formatDateTimeByTimezone(date, tz) {
    if (imageExportNamingService && typeof imageExportNamingService.formatDateTimeByTimezone === "function") {
        return imageExportNamingService.formatDateTimeByTimezone(date, tz);
    }
    if (tz?.type === "custom") {
        const offsetMin = getCustomOffsetMinutes(tz);
        const shifted = new Date(date.getTime() + (offsetMin * 60000));
        return `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())} ${pad(shifted.getUTCHours())}:${pad(shifted.getUTCMinutes())}:${pad(shifted.getUTCSeconds())}`;
    }

    // Delegate timezone-local date conversion to GTVTimeService.
    const p = timeService.resolveLocalDateParts(date, tz?.zone || "UTC", tz?.id, null);
    return `${p.Y}-${pad(p.M)}-${pad(p.D)} ${pad(p.H)}:${pad(p.min)}:${pad(p.S)}`;
}

function getTimezoneTableImageFilename() {
    if (imageExportNamingService && typeof imageExportNamingService.getTimezoneTableImageFilename === "function") {
        return imageExportNamingService.getTimezoneTableImageFilename();
    }

    const baseRef = getBaseTimezoneRef();
    const groupName = sanitizeFilenamePart(groups[activeGroupId]?.name || t("default_group_name")) || "Group";
    const baseAbbr = sanitizeFilenamePart(getZoneAbbreviation(baseRef) || "UTC") || "UTC";
    const baseDateTime = formatDateTimeByTimezone(globalTimes[0], baseRef).trim();
    const m = baseDateTime.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
    const timePart = sanitizeFilenamePart(m ? `${m[1]} ${m[2]}${m[3]}${m[4]}` : baseDateTime.replace(/:/g, "")) || "time";

    return `${groupName}_${baseAbbr}_${timePart}`;
}

function getMultiRangeTableImageFilename(rangeIdx) {
    if (imageExportNamingService && typeof imageExportNamingService.getMultiRangeTableImageFilename === "function") {
        return imageExportNamingService.getMultiRangeTableImageFilename(rangeIdx);
    }
    const baseName = getTimezoneTableImageFilename();
    const subgroupName = multiStateService.sanitizeMultiSubgroupName(getCurrentMultiSubgroupName(), "subgroup");
    const rangeLabel = sanitizeFilenamePart(`${subgroupName} ${rangeIdx + 1}`) || `range_${rangeIdx + 1}`;
    return `${baseName}_${rangeLabel}.png`;
}

function getMultiRangeTitlesImageFilename() {
    if (imageExportNamingService && typeof imageExportNamingService.getMultiRangeTitlesImageFilename === "function") {
        return imageExportNamingService.getMultiRangeTitlesImageFilename();
    }
    const baseName = getTimezoneTableImageFilename();
    const titleLabel =
        sanitizeFilenamePart(multiStateService.sanitizeMultiSubgroupName(getCurrentMultiSubgroupName(), "subgroup")) || "range";
    return `${baseName}_${titleLabel}_titles.png`;
}

function collectDocumentCssText() {
    if (!imageExportBridgeService || typeof imageExportBridgeService.collectDocumentCssText !== "function") return "";
    return imageExportBridgeService.collectDocumentCssText();
}

function cloneTableForImageExport(tableEl) {
    if (!imageExportBridgeService || typeof imageExportBridgeService.cloneTableForImageExport !== "function") return null;
    return imageExportBridgeService.cloneTableForImageExport(tableEl);
}

function cloneMultiRangeBlockForImageExport(blockEl) {
    if (!imageExportBridgeService || typeof imageExportBridgeService.cloneMultiRangeBlockForImageExport !== "function") return null;
    return imageExportBridgeService.cloneMultiRangeBlockForImageExport(blockEl);
}

async function renderElementWithForeignObjectToPngDataUrl(renderElement) {
    if (!imageExportBridgeService || typeof imageExportBridgeService.renderElementWithForeignObjectToPngDataUrl !== "function") {
        throw new Error("Foreign-object renderer unavailable");
    }
    return await imageExportBridgeService.renderElementWithForeignObjectToPngDataUrl(renderElement);
}

function loadImageElement(src) {
    if (!imageExportBridgeService || typeof imageExportBridgeService.loadImageElement !== "function") {
        return Promise.reject(new Error("Image loader unavailable"));
    }
    return imageExportBridgeService.loadImageElement(src);
}

async function waitForDocumentFontsReady() {
    if (!imageExportBridgeService || typeof imageExportBridgeService.waitForDocumentFontsReady !== "function") return;
    await imageExportBridgeService.waitForDocumentFontsReady();
}

function isDomExceptionLike(err) {
    if (!imageExportBridgeService || typeof imageExportBridgeService.isDomExceptionLike !== "function") return false;
    return imageExportBridgeService.isDomExceptionLike(err);
}

async function detectForeignObjectRendererSupport() {
    if (!imageExportBridgeService || typeof imageExportBridgeService.detectForeignObjectRendererSupport !== "function") return false;
    return await imageExportBridgeService.detectForeignObjectRendererSupport();
}

function extractTableCellText(cell) {
    if (!imageExportBridgeService || typeof imageExportBridgeService.extractTableCellText !== "function") return "";
    return imageExportBridgeService.extractTableCellText(cell);
}

function extractTableHeaderText(cell) {
    if (!imageExportBridgeService || typeof imageExportBridgeService.extractTableHeaderText !== "function") return "";
    return imageExportBridgeService.extractTableHeaderText(cell);
}

function getActiveTableExportContext() {
    if (!imageExportBridgeService || typeof imageExportBridgeService.getActiveTableExportContext !== "function") {
        return {
            table: null,
            headerSelector: "#table-head th",
            rowSelector: "#clocks-container tr.time-row"
        };
    }
    return imageExportBridgeService.getActiveTableExportContext();
}

async function renderTimezoneTableFallbackDataUrl() {
    if (!imageExportBridgeService || typeof imageExportBridgeService.renderTimezoneTableFallbackDataUrl !== "function") {
        throw new Error("Timezone table fallback renderer unavailable");
    }
    return await imageExportBridgeService.renderTimezoneTableFallbackDataUrl();
}


async function renderTimezoneTableToPngDataUrl() {
    if (!imageExportBridgeService || typeof imageExportBridgeService.renderTimezoneTableToPngDataUrl !== "function") {
        throw new Error("Timezone table renderer unavailable");
    }
    return await imageExportBridgeService.renderTimezoneTableToPngDataUrl();
}

async function renderMultiRangesFallbackDataUrl(targetRangeIdx = null) {
    if (!imageExportBridgeService || typeof imageExportBridgeService.renderMultiRangesFallbackDataUrl !== "function") {
        throw new Error("Multi-range fallback renderer unavailable");
    }
    return await imageExportBridgeService.renderMultiRangesFallbackDataUrl(targetRangeIdx);
}

async function renderMultiRangesToPngDataUrl(targetRangeIdx = null) {
    if (!imageExportBridgeService || typeof imageExportBridgeService.renderMultiRangesToPngDataUrl !== "function") {
        throw new Error("Multi-range renderer unavailable");
    }
    return await imageExportBridgeService.renderMultiRangesToPngDataUrl(targetRangeIdx);
}

async function renderMultiRangeSingleToPngDataUrl(rangeIdx) {
    if (!imageExportBridgeService || typeof imageExportBridgeService.renderMultiRangeSingleToPngDataUrl !== "function") {
        throw new Error("Multi-range single renderer unavailable");
    }
    return await imageExportBridgeService.renderMultiRangeSingleToPngDataUrl(rangeIdx);
}

async function renderMultiRangeTitlesToPngDataUrl() {
    if (!imageExportBridgeService || typeof imageExportBridgeService.renderMultiRangeTitlesToPngDataUrl !== "function") {
        throw new Error("Multi-range title renderer unavailable");
    }
    return await imageExportBridgeService.renderMultiRangeTitlesToPngDataUrl();
}

async function saveTimezoneTableImage() {
    if (!imageExportBridgeService || typeof imageExportBridgeService.saveTimezoneTableImage !== "function") return;
    return await imageExportBridgeService.saveTimezoneTableImage();
}

async function saveMultiRangeTitlesImage() {
    if (!imageExportBridgeService || typeof imageExportBridgeService.saveMultiRangeTitlesImage !== "function") return;
    return await imageExportBridgeService.saveMultiRangeTitlesImage();
}

async function saveMultiRangeSingleImage(rangeIdx) {
    if (!imageExportBridgeService || typeof imageExportBridgeService.saveMultiRangeSingleImage !== "function") return;
    return await imageExportBridgeService.saveMultiRangeSingleImage(rangeIdx);
}

function getImageExportDeps() {
    if (!imageExportBridgeService || typeof imageExportBridgeService.getImageExportDeps !== "function") return {};
    return imageExportBridgeService.getImageExportDeps();
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
    currentMainTab = sanitizeMainTab(currentMainTab);
    syncActiveFormatProfileFromState();
    syncCurrentMultiStateToActiveSubgroup();
    if (currentMainTab === "live" || currentMainTab === "fixed") {
        activeGroupIdByMainTab[currentMainTab] = activeGroupId;
    }
    normalizeGroupTabState();
    ensureMultiRangeState();
    groups.forEach((group) => {
        ensureGroupFixedTimes(group);
        multiStateService.ensureGroupMultiSubgroups(group);
    });
    formatProfiles = sanitizeFormatProfiles(formatProfiles, getCurrentFormatProfileState());

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
        formatProfiles,
        activeFormatProfileContext,
        timeAdjustDayStepBySlot: [
            getTimeAdjustDayStep(0),
            getTimeAdjustDayStep(1)
        ],
        multiRangeCount: sanitizeMultiRangeCount(multiRangeCount),
        multiRangeTitle: sanitizeMultiRangeTitle(getCurrentMultiSubgroupName()),
        multiRanges: multiRanges.map((range) => ({
            startUtcMs: GTV_TIME_CORE.sanitizeUtcMs(range.startUtcMs, Date.now()),
            endUtcMs: GTV_TIME_CORE.sanitizeUtcMs(range.endUtcMs, Date.now())
        })),
        multiRangeCollapsed: multiRangeCollapsed.map((flag) => !!flag),
        multiRangeStartEditEnabled: multiRangeStartEditEnabled.map((flag) => !!flag),
        multiRangeEndEditEnabled: multiRangeEndEditEnabled.map((flag) => !!flag)
    };
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






