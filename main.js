let isRealtime = true;
if (typeof window !== "undefined" && window) window.isRealtime = isRealtime;
let globalTimes = [new Date(), new Date()];
let slotCount = 1;
let uiScale = 1.0;
let showCopyFormat = false;
let showTimeline = false;
const GTV_GLOBAL = (typeof window !== "undefined" && window) ? window : globalThis;
const fallbackTranslate = (key) => String(key ?? "");
const resolveTranslate = () => (typeof GTV_GLOBAL.t === "function" ? GTV_GLOBAL.t : fallbackTranslate);
const gtvT = (...args) => resolveTranslate()(...args);
const MAIN_I18N_DATA = (GTV_GLOBAL.I18N_DATA && typeof GTV_GLOBAL.I18N_DATA === "object")
    ? GTV_GLOBAL.I18N_DATA
    : { ko: {}, en: {} };
let mainCurrentLang = "ko";
function getRuntimeCurrentLangValue() {
    const runtimeLang = (typeof GTV_GLOBAL.currentLang === "string" && GTV_GLOBAL.currentLang.trim())
        ? GTV_GLOBAL.currentLang
        : "";
    if (runtimeLang) {
        mainCurrentLang = runtimeLang;
        return runtimeLang;
    }
    return (typeof mainCurrentLang === "string" && mainCurrentLang.trim()) ? mainCurrentLang : "ko";
}
mainCurrentLang = getRuntimeCurrentLangValue();

function syncCurrentLang(next) {
    const normalized = String(next ?? "").trim() || "ko";
    mainCurrentLang = normalized;
    try {
        GTV_GLOBAL.currentLang = normalized;
    } catch (_error) {
        // noop: non-writable global in sandbox/test environments
    }
    return mainCurrentLang;
}
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
const GTV_MAIN_APP_STATE_VARS = (typeof window !== "undefined"
    ? window.GTVMainAppStateVars
    : globalThis.GTVMainAppStateVars);
if (!GTV_MAIN_APP_STATE_VARS || typeof GTV_MAIN_APP_STATE_VARS.createService !== "function") {
    throw new Error("Missing required module API: GTVMainAppStateVars.createService");
}
const mainAppStateVarsService = GTV_MAIN_APP_STATE_VARS.createService({
    t: gtvT,
    copyFormatKeys: COPY_FORMAT_KEYS,
    defaultDisplayFormatEnabled: DEFAULT_DISPLAY_FORMAT_ENABLED,
    defaultCopyFormatEnabled: DEFAULT_COPY_FORMAT_ENABLED,
    defaultDisplayTimePartsEnabled: DEFAULT_DISPLAY_TIME_PARTS_ENABLED,
    defaultCopyTimePartsEnabled: DEFAULT_COPY_TIME_PARTS_ENABLED,
    defaultTimeAdjustDayStep: DEFAULT_TIME_ADJUST_DAY_STEP
});
if (!mainAppStateVarsService || typeof mainAppStateVarsService.createDirectStateSetters !== "function") {
    throw new Error("Missing required module API: GTVMainAppStateVars.createDirectStateSetters");
}
const initialMainState = (mainAppStateVarsService && typeof mainAppStateVarsService === "object")
    ? (mainAppStateVarsService.initialState || {})
    : {};
const initialDisplayFormatEnabled = (
    initialMainState.displayFormatEnabled && typeof initialMainState.displayFormatEnabled === "object"
) ? initialMainState.displayFormatEnabled : DEFAULT_DISPLAY_FORMAT_ENABLED;
const initialCopyFormatEnabled = (
    initialMainState.copyFormatEnabled && typeof initialMainState.copyFormatEnabled === "object"
) ? initialMainState.copyFormatEnabled : DEFAULT_COPY_FORMAT_ENABLED;
const initialDisplayTimePartsEnabled = (
    initialMainState.displayTimePartsEnabled && typeof initialMainState.displayTimePartsEnabled === "object"
) ? initialMainState.displayTimePartsEnabled : DEFAULT_DISPLAY_TIME_PARTS_ENABLED;
const initialCopyTimePartsEnabled = (
    initialMainState.copyTimePartsEnabled && typeof initialMainState.copyTimePartsEnabled === "object"
) ? initialMainState.copyTimePartsEnabled : DEFAULT_COPY_TIME_PARTS_ENABLED;

isRealtime = !!initialMainState.isRealtime;
if (typeof window !== "undefined" && window) window.isRealtime = isRealtime;
globalTimes = Array.isArray(initialMainState.globalTimes) ? [...initialMainState.globalTimes] : [new Date(), new Date()];
slotCount = Number.isFinite(Number(initialMainState.slotCount)) ? Number(initialMainState.slotCount) : 1;
uiScale = Number.isFinite(Number(initialMainState.uiScale)) ? Number(initialMainState.uiScale) : 1.0;
showCopyFormat = !!initialMainState.showCopyFormat;
showTimeline = !!initialMainState.showTimeline;
let displayFormatOrder = Array.isArray(initialMainState.displayFormatOrder) ? [...initialMainState.displayFormatOrder] : [...COPY_FORMAT_KEYS];
let displayFormatEnabled = { ...initialDisplayFormatEnabled };
let copyFormatOrder = Array.isArray(initialMainState.copyFormatOrder) ? [...initialMainState.copyFormatOrder] : [...COPY_FORMAT_KEYS];
let copyFormatEnabled = { ...initialCopyFormatEnabled };
let displayTimePartsEnabled = { ...initialDisplayTimePartsEnabled };
let copyTimePartsEnabled = { ...initialCopyTimePartsEnabled };
let formatProfiles = (
    initialMainState.formatProfiles && typeof initialMainState.formatProfiles === "object"
) ? initialMainState.formatProfiles : {};
let activeFormatProfileContext = String(initialMainState.activeFormatProfileContext || "live");
let timeAdjustDayStepBySlot = Array.isArray(initialMainState.timeAdjustDayStepBySlot)
    ? [...initialMainState.timeAdjustDayStepBySlot]
    : [DEFAULT_TIME_ADJUST_DAY_STEP, DEFAULT_TIME_ADJUST_DAY_STEP];
let multiRangeCount = Number.isFinite(Number(initialMainState.multiRangeCount))
    ? Number(initialMainState.multiRangeCount)
    : 1;
let multiRangeTitle = String(
    initialMainState.multiRangeTitle
    || gtvT("placeholder_range_title")
    || DEFAULT_MULTI_RANGE_TITLE
);
let multiRanges = Array.isArray(initialMainState.multiRanges) ? [...initialMainState.multiRanges] : [];
let multiRangeCollapsed = Array.isArray(initialMainState.multiRangeCollapsed) ? [...initialMainState.multiRangeCollapsed] : [];
let multiRangeStartEditEnabled = Array.isArray(initialMainState.multiRangeStartEditEnabled)
    ? [...initialMainState.multiRangeStartEditEnabled]
    : [];
let multiRangeEndEditEnabled = Array.isArray(initialMainState.multiRangeEndEditEnabled)
    ? [...initialMainState.multiRangeEndEditEnabled]
    : [];
let currentMainTab = String(initialMainState.currentMainTab || "live");
let activeGroupIdByMainTab = (
    initialMainState.activeGroupIdByMainTab && typeof initialMainState.activeGroupIdByMainTab === "object"
) ? { ...initialMainState.activeGroupIdByMainTab } : { live: 0, fixed: 0 };
let currentTheme = String(initialMainState.currentTheme || "dark");
let canUseForeignObjectRenderer = Object.prototype.hasOwnProperty.call(initialMainState, "canUseForeignObjectRenderer")
    ? initialMainState.canUseForeignObjectRenderer
    : null;
let fixedTimeIdSeed = Number.isFinite(Number(initialMainState.fixedTimeIdSeed))
    ? Number(initialMainState.fixedTimeIdSeed)
    : 0;
let groups = Array.isArray(initialMainState.groups) ? [...initialMainState.groups] : [];
let activeGroupId = initialMainState.activeGroupId ?? 0;
let appFeedbackService = null;
let calculatorActionsService = null;
let multiStateService = null;
let groupStateService = null;
let mainPersistenceSnapshotService = null;
let mainClockOrchestratorService = null;
let mainTimezoneRuntimeService = null;
let mainTimezoneMutationService = null;
let mainBaseTimezoneService = null;
let timeAdjustUiService = null;
let mainServiceMethodBridgeService = null;
let mainDirectStatePatchService = null;
let mainSharedUtilsService = null;
let mainTimezoneRuntimeBridgeService = null;
let mainTimezoneFacadeService = null;
let mainTimezoneTableFacadeService = null;
let mainTimeAdjustFacadeService = null;
let mainFixedTimeTabFacadeService = null;
let mainMultiRangeTabFacadeService = null;
let mainTimelineFacadeService = null;
let mainFixedTimeFacadeService = null;
let mainAppBootstrapService = null;
let appPersistenceStateService = null;
let appStatePatcherService = null;
let mainAppStateBridgeService = null;
let mainPatchedStateSelectorsService = null;
let persistenceServices = null;
let persistenceService = null;
let settingsIoService = null;
let dataTransferService = null;

const directStateSetters = mainAppStateVarsService.createDirectStateSetters({
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
    currentLang: (value) => { syncCurrentLang(value); }
});

function setIsRealtimeState(next) {
    isRealtime = !!next;
    if (typeof window !== "undefined" && window) window.isRealtime = isRealtime;
    return isRealtime;
}

function getIsRealtimeState() {
    return !!isRealtime;
}

function getGlobalTimesState() {
    return Array.isArray(globalTimes) ? globalTimes : [];
}

function getGlobalTimeState(slotIdx = 0) {
    const safeSlotIdx = Number.isFinite(Number(slotIdx)) ? Math.max(0, Math.trunc(Number(slotIdx))) : 0;
    const times = getGlobalTimesState();
    const candidate = times[safeSlotIdx];
    return (candidate instanceof Date && Number.isFinite(candidate.getTime())) ? candidate : new Date();
}

function setGlobalTimeState(slotIdx, value) {
    const safeSlotIdx = Number.isFinite(Number(slotIdx)) ? Math.max(0, Math.trunc(Number(slotIdx))) : 0;
    const safeValue = (value instanceof Date && Number.isFinite(value.getTime())) ? value : new Date();
    if (!Array.isArray(globalTimes)) globalTimes = [];
    globalTimes[safeSlotIdx] = safeValue;
    return safeValue;
}

function getUiScaleState() {
    const parsed = Number(uiScale);
    return Number.isFinite(parsed) ? parsed : 1;
}

function applyDirectStatePatch(next = {}) {
    if (mainDirectStatePatchService && typeof mainDirectStatePatchService.applyDirectStatePatch === "function") {
        return mainDirectStatePatchService.applyDirectStatePatch(next);
    }
    if (!next || typeof next !== "object") return;
    Object.keys(directStateSetters).forEach((key) => {
        if (!Object.prototype.hasOwnProperty.call(next, key)) return;
        const setter = directStateSetters[key];
        if (typeof setter !== "function") return;
        if (key === "showTimeline") {
            setter(!!next.showTimeline);
            return;
        }
        setter(next[key]);
    });
    if (Object.prototype.hasOwnProperty.call(next, "isRealtime")) {
        setIsRealtimeState(next.isRealtime);
    }
}

let requiredServicesAsserted = false;
const SERVICE_METHOD_MISSING = Symbol("GTV_SERVICE_METHOD_MISSING");

function warnMissingServiceMethod(serviceName, methodName) {
    if (mainServiceMethodBridgeService && typeof mainServiceMethodBridgeService.warnMissingServiceMethod === "function") {
        return mainServiceMethodBridgeService.warnMissingServiceMethod(serviceName, methodName);
    }
    console.warn(`[GTV] ${serviceName}.${methodName} is unavailable. Fallback path will be used.`);
}

function showMissingFeatureToastOnce(featureKey = "") {
    const key = String(featureKey || "").trim();
    if (!key) return;
    const message = (getRuntimeCurrentLangValue() === "ko")
        ? "필수 기능 모듈이 준비되지 않았습니다. 새로고침 후 다시 시도해 주세요."
        : "A required feature module is unavailable. Refresh and try again.";
    callServiceMethod(
        "appFeedbackService",
        appFeedbackService,
        "showToast",
        [message, { type: "warning" }]
    );
}

function getServiceMethod(serviceName, serviceRef, methodName, options = {}) {
    if (mainServiceMethodBridgeService && typeof mainServiceMethodBridgeService.getServiceMethod === "function") {
        return mainServiceMethodBridgeService.getServiceMethod(serviceName, serviceRef, methodName, options);
    }
    if (serviceRef && typeof serviceRef[methodName] === "function") {
        return serviceRef[methodName].bind(serviceRef);
    }
    warnMissingServiceMethod(serviceName, methodName);
    if (options.toastOnMissing) {
        showMissingFeatureToastOnce(options.featureKey || `${serviceName}.${methodName}`);
    }
    return null;
}

function callServiceMethod(serviceName, serviceRef, methodName, args = [], options = {}) {
    const method = getServiceMethod(serviceName, serviceRef, methodName, options);
    if (!method) return options.fallback;
    return method(...args);
}

function savePersistenceSafely(...args) {
    return callServiceMethod(
        "persistenceService",
        persistenceService,
        "savePersistence",
        args
    );
}

function renderMultiRangesSafely() {
    return mainMultiRangeTabFacadeService.renderMultiRanges();
}

function resolveRequiredBootstrapServiceRef(serviceName = "") {
    const key = String(serviceName || "");
    switch (key) {
        case "persistenceService":
            return persistenceService;
        case "mainUiInitService":
            return mainUiInitService;
        case "timezoneSearchService":
            return timezoneSearchService;
        case "timerEngineService":
            return timerEngineService;
        case "tabOrchestratorService":
            return tabOrchestratorService;
        case "mainClockOrchestratorService":
            return mainClockOrchestratorService;
        case "mainPersistenceSnapshotService":
            return mainPersistenceSnapshotService;
        case "mainTimezoneMutationService":
            return mainTimezoneMutationService;
        case "calculatorActionsService":
            return calculatorActionsService;
        default:
            return null;
    }
}

function assertRequiredServices() {
    if (requiredServicesAsserted) return;
    const requiredSpecs = [
        { serviceName: "persistenceService", methodName: "loadPersistence" },
        { serviceName: "persistenceService", methodName: "savePersistence" },
        { serviceName: "mainUiInitService", methodName: "initUI" },
        { serviceName: "timezoneSearchService", methodName: "initSearchAndSelect" },
        { serviceName: "timerEngineService", methodName: "startRealtimeTicker" },
        { serviceName: "tabOrchestratorService", methodName: "switchMainTab" },
        { serviceName: "mainClockOrchestratorService", methodName: "updateClocks" },
        { serviceName: "mainPersistenceSnapshotService", methodName: "getPersistenceSnapshot" },
        { serviceName: "mainTimezoneMutationService", methodName: "addTimezone" },
        { serviceName: "mainTimezoneMutationService", methodName: "removeTimezone" },
        { serviceName: "calculatorActionsService", methodName: "initCalculators" },
        { serviceName: "calculatorActionsService", methodName: "copyText" }
    ];

    const missing = [];
    requiredSpecs.forEach((spec) => {
        const serviceRef = resolveRequiredBootstrapServiceRef(spec.serviceName);
        const method = getServiceMethod(spec.serviceName, serviceRef, spec.methodName, { toastOnMissing: false });
        if (!method) missing.push(`${spec.serviceName}.${spec.methodName}`);
    });

    if (missing.length) {
        throw new Error(`[GTV] Missing required services at bootstrap: ${missing.join(", ")}`);
    }
    requiredServicesAsserted = true;
}

function applyVersionBranding() {
    const titleText = `${APP_DISPLAY_NAME} v${VERSION}`;
    document.title = titleText;
    const badge = document.getElementById("version-badge");
    if (badge) badge.textContent = `ver ${VERSION}`;
    const logoTitle = document.querySelector(".logo-text h1");
    if (logoTitle) logoTitle.textContent = APP_DISPLAY_NAME;
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
    GTV_MAIN_CORE_SERVICE_ASSEMBLY,
    GTV_MAIN_SHARED_UTILS,
    GTV_MAIN_SERVICE_METHOD_BRIDGE,
    GTV_MAIN_DIRECT_STATE_PATCH,
    GTV_MAIN_APP_STATE_SERVICES,
    GTV_MAIN_APP_STATE_BRIDGE,
    GTV_MAIN_PATCHED_STATE_SELECTORS,
    GTV_MAIN_FORMAT_PROFILE_FACADE,
    GTV_MAIN_TIMELINE_FACADE,
    GTV_MAIN_FIXED_TIME_FACADE,
    GTV_MAIN_TIMEZONE_FACADE,
    GTV_MAIN_TIMEZONE_TABLE_FACADE,
    GTV_MAIN_TIME_ADJUST_FACADE,
    GTV_MAIN_FIXED_TIME_TAB_FACADE,
    GTV_MAIN_MULTI_RANGE_TAB_FACADE,
    GTV_MAIN_APP_BOOTSTRAP,
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
    GTV_MAIN_ORCHESTRATION_FLOW_SERVICES,
    GTV_MAIN_PERSISTENCE_SNAPSHOT_SERVICES,
    GTV_MAIN_PERSISTENCE_COMPOSITION_SERVICES,
    GTV_MAIN_CLOCK_ORCHESTRATOR_SERVICES,
    GTV_MAIN_TIMEZONE_RUNTIME_SERVICES,
    GTV_MAIN_TIMEZONE_RUNTIME_BRIDGE,
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

const APP_DISPLAY_NAME = "Global Time Viewer";
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

function buildPatchedStateFallbackSnapshot() {
    return {
        currentMainTab,
        slotCount,
        showCopyFormat,
        showTimeline,
        currentTheme,
        currentLang: getRuntimeCurrentLangValue(),
        displayFormatOrder,
        displayFormatEnabled,
        displayTimePartsEnabled,
        copyFormatOrder,
        copyFormatEnabled,
        copyTimePartsEnabled,
        activeFormatProfileContext,
        activeGroupId,
        multiRangeCount,
        multiRanges,
        multiRangeCollapsed,
        timeAdjustDayStepBySlot,
        multiRangeTitle
    };
}

function createCanvasSafely() {
    if (typeof document !== "object" || !document || typeof document.createElement !== "function") {
        return null;
    }
    return document.createElement("canvas");
}

function getRandomUUIDSafely() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return "";
}

function getDocumentRefOrNull() {
    return (typeof document === "object" && document) ? document : null;
}

function getWindowRefOrNull() {
    return (typeof window === "object" && window) ? window : null;
}

function getLocationRefOrNull() {
    return (typeof location === "object" && location) ? location : null;
}

function getGlobalThisRefOrNull() {
    return (typeof globalThis === "object" && globalThis) ? globalThis : null;
}

function getLuxonGlobalRef() {
    return (typeof window !== "undefined") ? window.luxon : globalThis.luxon;
}

function getRuntimeNowMs() {
    return Date.now();
}

function setRuntimeInterval(cb, ms) {
    if (typeof cb !== "function") return null;
    return setInterval(cb, ms);
}

function clearRuntimeInterval(id) {
    if (id === null || id === undefined) return;
    clearInterval(id);
}

function deferDynamicCall(getFn) {
    return (...args) => getFn()(...args);
}

function setMultiRangeState(next = {}) {
    if (!next || typeof next !== "object") return;
    patchAppState(next);
}

function getNextFixedTimeSeed() {
    fixedTimeIdSeed += 1;
    return fixedTimeIdSeed;
}

function setUiPreferencesState(next = {}) {
    if (!next || typeof next !== "object") return;
    if (Object.prototype.hasOwnProperty.call(next, "uiScale")) uiScale = next.uiScale;
    if (Object.prototype.hasOwnProperty.call(next, "currentTheme")) currentTheme = next.currentTheme;
    if (Object.prototype.hasOwnProperty.call(next, "currentLang")) syncCurrentLang(next.currentLang);
}

function getSignedInclusiveDaySpan(a, b) {
    return timeService.getDaySpan(a, b);
}

function escapeHtmlViaSharedUtils(value) {
    return mainSharedUtilsService.escapeHtml(value);
}

function getRenderableTimezoneRowsFromTableRender(baseRef) {
    return tableRenderService.getRenderableTimezoneRows(baseRef);
}

function getMultiDisplayColumnHeaderFromTableRender(colKey) {
    return tableRenderService.getMultiDisplayColumnHeader(colKey);
}

function getTimezoneRefByIdFromSnapshotService(id) {
    return snapshotFormatService.getTimezoneRefById(id);
}

function normalizeZoneAbbreviationViaSearch(value) {
    return timezoneSearchService.normalizeZoneAbbreviation(value);
}

function getDefaultMultiSubgroupNameViaState(index = 0) {
    return multiStateService.getDefaultMultiSubgroupName(index);
}

function sanitizeMultiSubgroupIdViaState(value) {
    return multiStateService.sanitizeMultiSubgroupId(value);
}

function getBaseTimeSnapshot() {
    return getGlobalTimeState(0);
}

function getFixedTimeSlotCountForGroupRef(group) {
    return getFixedTimeSlotCount(group);
}

function confirmRuntime(message) {
    return confirm(message);
}

function getActiveCopyFormatKeysForCurrentContext() {
    return getFormatProfileAllowedKeys(getPatchedActiveFormatProfileContextState());
}

function getActiveTimePartKeysForCurrentContext() {
    return getFormatProfileAllowedTimePartKeys(getPatchedActiveFormatProfileContextState());
}

function getCurrentUiScalePercent() {
    return Math.round(getUiScaleState() * 100);
}

function getFixedTimeSlotCountForCurrentGroup() {
    return getFixedTimeSlotCount(getCurrentGroup());
}

function getTimeAdjustDayStepValue(slotIdx) {
    return getTimeAdjustDayStepBySlotSnapshot()[slotIdx];
}

function getRenderListRef() {
    return renderList;
}

function getSanitizeCopyFormatOrderForContextRef() {
    return sanitizeCopyFormatOrderForContext;
}

function getSanitizeCopyFormatEnabledForContextRef() {
    return sanitizeCopyFormatEnabledForContext;
}

function getSanitizeTimePartsEnabledForContextRef() {
    return sanitizeTimePartsEnabledForContext;
}

function getShowToastRef() {
    return showToast;
}

function getRenderTimelineFrameRef() {
    return renderTimelineFrame;
}

function getUpdateClocksRef() {
    return updateClocks;
}

function getTranslatorRef() {
    return gtvT;
}

function getSavePersistenceSafelyRef() {
    return savePersistenceSafely;
}

function getRenderFixedTimeTabRef() {
    return renderFixedTimeTab;
}

function getRefreshFixedTimeSlotCountControlsRef() {
    return refreshFixedTimeSlotCountControls;
}

function getAppStatePatcherServiceRef() {
    return appStatePatcherService;
}

function getAppPersistenceStateServiceRef() {
    return appPersistenceStateService;
}

function getMainTimezoneRuntimeBridgeServiceRef() {
    return mainTimezoneRuntimeBridgeService;
}

function getMainTimezoneRuntimeServiceRef() {
    return mainTimezoneRuntimeService;
}

function getMainBaseTimezoneServiceRef() {
    return mainBaseTimezoneService;
}

function getMainTimezoneMutationServiceRef() {
    return mainTimezoneMutationService;
}

function getZoneMapRef() {
    return ZONE_MAP;
}

function getTzDatabaseRef() {
    return TZ_DATABASE;
}

function getTimeServiceRef() {
    return timeService;
}

function getRandomValue() {
    return Math.random();
}

function getGroupStateServiceRef() {
    return groupStateService;
}

function getTimeAdjustActionsServiceRef() {
    return timeAdjustActionsService;
}

function getMultiBulkToolsServiceRef() {
    return multiBulkToolsService;
}

function getFixedTimeTableServiceRef() {
    return fixedTimeTableService;
}

function invokeRenderBaseTimeSelect() {
    return renderBaseTimeSelect();
}

function getMultiRangeCopyServiceRef() {
    return multiRangeCopyService;
}

function getMultiStateServiceRef() {
    return multiStateService;
}

function getMainClockOrchestratorServiceRef() {
    return mainClockOrchestratorService;
}

function getMainPersistenceSnapshotServiceRef() {
    return mainPersistenceSnapshotService;
}

function getFixedTimeCoreServiceRef() {
    return fixedTimeCoreService;
}

function getFixedTimeActionsServiceRef() {
    return fixedTimeActionsService;
}

function getTimelineFrameServiceRef() {
    return timelineFrameService;
}

function getFixedTimeTimelineServiceRef() {
    return fixedTimeTimelineService;
}

function getShowTimelineStateRef() {
    return showTimeline;
}

function getDisplayFormatOrderStateRef() {
    return displayFormatOrder;
}

function getDisplayFormatEnabledStateRef() {
    return displayFormatEnabled;
}

function getDisplayTimePartsEnabledStateRef() {
    return displayTimePartsEnabled;
}

function getCopyFormatOrderStateRef() {
    return copyFormatOrder;
}

function getCopyFormatEnabledStateRef() {
    return copyFormatEnabled;
}

function getCopyTimePartsEnabledStateRef() {
    return copyTimePartsEnabled;
}

function getFormatProfilesStateRef() {
    return formatProfiles;
}

function getActiveFormatProfileContextStateRef() {
    return activeFormatProfileContext;
}

function getCurrentThemeStateRef() {
    return currentTheme;
}

function getCurrentLangStateRef() {
    return getRuntimeCurrentLangValue();
}

function resolveLocalDatePartsViaTimeService(date, timezone, timezoneId, fallback) {
    return timeService.resolveLocalDateParts(date, timezone, timezoneId, fallback);
}

function buildStrictUtcDateFromPartsViaCore(parts) {
    return GTV_TIME_CORE.buildStrictUtcDateFromParts(parts);
}

function setGlobalTimeValue(slotIdx, value) {
    setGlobalTimeState(slotIdx, value);
}

function getSnapshotFormatServiceRef() {
    return snapshotFormatService;
}

function getI18nDataRef() {
    return MAIN_I18N_DATA;
}

function getImageExportBridgeServiceRef() {
    return imageExportBridgeService;
}

function createDefaultTableExportContext() {
    return {
        table: null,
        headerSelector: "#table-head th",
        rowSelector: "#clocks-container tr.time-row"
    };
}

function getCanUseForeignObjectRendererRef() {
    return canUseForeignObjectRenderer;
}

function setCanUseForeignObjectRenderer(value) {
    canUseForeignObjectRenderer = !!value;
}

function getImageExportActionsServiceRef() {
    return imageExportActionsService;
}

function getImageExportNamingServiceRef() {
    return imageExportNamingService;
}

function getMultiRangeTitleTextFromRenderService(rangeIdx, range, baseRef) {
    return multiRangeRenderService.getMultiRangeTitleText(rangeIdx, range, baseRef);
}

function buildTimezoneComputedSnapshotForDatesViaSnapshotService(tz, slotDates, options = {}) {
    return snapshotFormatService.buildTimezoneComputedSnapshotForDates(tz, slotDates, options);
}

function formatSnapshotTextViaSnapshotService(snapshot, order, enabled, timePartsEnabled) {
    return snapshotFormatService.formatSnapshotText(snapshot, order, enabled, timePartsEnabled);
}

function sanitizeMultiSubgroupNameViaState(value, fallback = "") {
    return multiStateService.sanitizeMultiSubgroupName(value, fallback);
}

function sanitizeMultiSubgroupNameForExport(value, fallback = "subgroup") {
    return multiStateService.sanitizeMultiSubgroupName(value, fallback);
}

function buildStaticRowCellFromTableRender(colKey, slotCountToRender, zoneNameHtml = "") {
    return tableRenderService.buildStaticRowCell(colKey, slotCountToRender, zoneNameHtml);
}

function buildDynamicRowCellFromTableRender(colKey, slotCountToRender) {
    return tableRenderService.buildDynamicRowCell(colKey, slotCountToRender);
}

function getRowFormattedTextViaSnapshotService(
    rowOrId,
    order,
    enabled,
    timePartsEnabled = DEFAULT_COPY_TIME_PARTS_ENABLED
) {
    return snapshotFormatService.getRowFormattedText(rowOrId, order, enabled, timePartsEnabled);
}

function getRowCopyTextViaSnapshotService(rowOrId) {
    return snapshotFormatService.getRowCopyText(rowOrId, {
        order: getPatchedCopyFormatOrderState(),
        enabled: getPatchedCopyFormatEnabledState(),
        timePartsEnabled: getPatchedCopyTimePartsEnabledState()
    });
}

function applyFirstRangeStartAdjustAction(slotIdx, action) {
    return applyMultiRangeTimeAdjustAction(0, slotIdx, action);
}

function ensureGroupMultiSubgroupsViaState(group, options = {}) {
    return multiStateService.ensureGroupMultiSubgroups(group, options);
}

function createMultiSubgroupStateViaState(name = "", index = 0, state = null) {
    return multiStateService.createMultiSubgroupState(name, index, state);
}

function sanitizeMultiStatePayloadViaState(rawState = null, fallbackState = null) {
    return multiStateService.sanitizeMultiStatePayload(rawState, fallbackState);
}

function getPersistenceServiceRef() {
    return persistenceService;
}

function getTableRenderServiceRef() {
    return tableRenderService;
}

function getCopyActionsServiceRef() {
    return copyActionsService;
}

function getTimeAdjustUiServiceRef() {
    return timeAdjustUiService;
}

function getMultiRangeRenderServiceRef() {
    return multiRangeRenderService;
}

function getFormatControlsServiceRef() {
    return formatControlsService;
}

function getTabUiServiceRef() {
    return tabUiService;
}

function getUiSettingsActionsServiceRef() {
    return uiSettingsActionsService;
}

function getTimezoneSearchServiceRef() {
    return timezoneSearchService;
}

function getGroupTabsServiceRef() {
    return groupTabsService;
}

function getMainUiInitServiceRef() {
    return mainUiInitService;
}

function getTimerEngineServiceRef() {
    return timerEngineService;
}

function getTimeCoreRef() {
    return GTV_TIME_CORE;
}

function getMainTimezoneFacadeServiceRef() {
    return mainTimezoneFacadeService;
}

function getMainTimeAdjustFacadeServiceRef() {
    return mainTimeAdjustFacadeService;
}

function getMainTimezoneTableFacadeServiceRef() {
    return mainTimezoneTableFacadeService;
}

function getMainTimelineFacadeServiceRef() {
    return mainTimelineFacadeService;
}

function getMainFixedTimeFacadeServiceRef() {
    return mainFixedTimeFacadeService;
}

function getMainFixedTimeTabFacadeServiceRef() {
    return mainFixedTimeTabFacadeService;
}

function getMainMultiRangeTabFacadeServiceRef() {
    return mainMultiRangeTabFacadeService;
}

function getMainFoundationServicesRef() {
    return mainFoundationServices;
}

const mainCoreServices = GTV_MAIN_CORE_SERVICE_ASSEMBLY.createService({
    GTV_MAIN_SERVICE_METHOD_BRIDGE,
    GTV_MAIN_DIRECT_STATE_PATCH,
    GTV_MAIN_APP_STATE_BRIDGE,
    GTV_MAIN_PATCHED_STATE_SELECTORS,
    GTV_MAIN_SHARED_UTILS,
    GTV_MAIN_TIMEZONE_RUNTIME_BRIDGE,
    GTV_MAIN_TIMEZONE_RUNTIME_SERVICES,
    GTV_MAIN_FORMAT_PROFILE_FACADE,
    GTV_MAIN_TIMEZONE_FACADE,
    GTV_MAIN_BASE_TIMEZONE_SERVICES,
    GTV_MAIN_TIMEZONE_MUTATION_SERVICES,
    GTV_MAIN_TIMEZONE_TABLE_FACADE,
    GTV_MAIN_TIME_ADJUST_FACADE,
    GTV_MAIN_FIXED_TIME_TAB_FACADE,
    GTV_MAIN_FIXED_TIME_FACADE,
    GTV_MAIN_TIMELINE_FACADE,
    GTV_MAIN_MULTI_RANGE_TAB_FACADE,
    GTV_MAIN_GROUP_LOCALIZATION_SERVICES,
    GTV_MAIN_ORCHESTRATION_FLOW_SERVICES,
    GTV_MAIN_SELECT_SERVICES,
    GTV_TIMEZONE_SEARCH,
    GTV_SNAPSHOT_FORMAT,
    GTV_TIME_INPUT_MUTATIONS,
    GTV_MAIN_ROW_ORDER_SERVICES,
    GTV_MAIN_ROW_VIEW_SERVICES,
    GTV_TABLE_RENDER,
    GTV_MAIN_IMAGE_EXPORT_BRIDGE_PROXY,
    GTV_MAIN_IMAGE_RUNTIME_SERVICES,
    GTV_MAIN_FIXED_TIME_SERVICES,
    GTV_MAIN_MULTI_RANGE_SERVICES,
    GTV_MAIN_TIME_ADJUST_SERVICES,
    GTV_MAIN_TAB_SERVICES,
    GTV_MAIN_GROUP_STATE_SERVICES,
    GTV_MAIN_IMAGE_EXPORT_NAMING_PROXY,
    GTV_MAIN_IMAGE_EXPORT_SERVICES,
    GTV_MAIN_APP_STATE_SERVICES,
    GTV_MAIN_PERSISTENCE_COMPOSITION_SERVICES,
    GTV_MAIN_RUNTIME_COMPOSITION_SERVICES,
    GTV_MAIN_APP_BOOTSTRAP,
    onWarnMissingMethod: (serviceName, methodName) => {
        console.warn(`[GTV] ${serviceName}.${methodName} is unavailable. Fallback path will be used.`);
    },
    onMissingFeature: (featureKey) => {
        showMissingFeatureToastOnce(featureKey);
    },
    stateSetters: directStateSetters,
    setIsRealtimeState,
    callServiceMethod,
    getAppStatePatcherService: getAppStatePatcherServiceRef,
    getAppPersistenceStateService: getAppPersistenceStateServiceRef,
    applyDirectStatePatch,
    serviceMethodMissingToken: SERVICE_METHOD_MISSING,
    getPatchedStateFallback: buildPatchedStateFallbackSnapshot,
    tableImageExportWidth: TABLE_IMAGE_EXPORT_WIDTH,
    createCanvas: createCanvasSafely,
    getMainTimezoneRuntimeBridgeService: getMainTimezoneRuntimeBridgeServiceRef,
    getMainTimezoneRuntimeService: getMainTimezoneRuntimeServiceRef,
    getMainBaseTimezoneService: getMainBaseTimezoneServiceRef,
    getMainTimezoneMutationService: getMainTimezoneMutationServiceRef,
    getTimezoneSearchService: getTimezoneSearchServiceRef,
    getTimeCore: getTimeCoreRef,
    getBaseTime: getBaseTimeSnapshot,
    getZoneMap: getZoneMapRef,
    getTzDatabase: getTzDatabaseRef,
    getTimeService: getTimeServiceRef,
    formatUtcOffsetLabel,
    resolveLocalizedTZLabel: bindFacadeMethod(getMainTimezoneFacadeServiceRef, "getLocalizedTZLabel"),
    timezoneOffsetCache,
    timezoneDstCache,
    zoneAbbrCache,
    getCurrentGroupBaseTimezoneId,
    sanitizeTimezoneId: bindFacadeMethod(getMainTimezoneFacadeServiceRef, "sanitizeTimezoneId"),
    getNextTimezoneIdSeed: bindFacadeMethod(getMainTimezoneFacadeServiceRef, "getNextTimezoneIdSeed"),
    getRandomUUID: getRandomUUIDSafely,
    getRandom: getRandomValue,
    getGroupStateService: getGroupStateServiceRef,
    normalizeCustomAbbr,
    sanitizeBaseTimezoneId: bindFacadeMethod(getMainTimezoneFacadeServiceRef, "sanitizeBaseTimezoneId"),
    renderList: deferDynamicCall(getRenderListRef),
    getTableRenderService: getTableRenderServiceRef,
    getMainTimezoneFacadeService: getMainTimezoneFacadeServiceRef,
    getCopyActionsService: getCopyActionsServiceRef,
    isFixedTimeTab,
    renderFixedTimeTab,
    getTimeAdjustUiService: getTimeAdjustUiServiceRef,
    getTimeAdjustActionsService: getTimeAdjustActionsServiceRef,
    getMultiBulkToolsService: getMultiBulkToolsServiceRef,
    getTimeAdjustDayStepBySlotSnapshot,
    setTimeAdjustDayStepBySlotState,
    defaultTimeAdjustDayStep: DEFAULT_TIME_ADJUST_DAY_STEP,
    minTimeAdjustDayStep: MIN_TIME_ADJUST_DAY_STEP,
    maxTimeAdjustDayStep: MAX_TIME_ADJUST_DAY_STEP,
    getFixedTimeTableService: getFixedTimeTableServiceRef,
    getCurrentGroup,
    ensureGroupFixedTimes,
    refreshFixedTimeSlotCountControls,
    getDocumentRef: getDocumentRefOrNull,
    renderBaseTimeSelect: invokeRenderBaseTimeSelect,
    getMultiRangeRenderService: getMultiRangeRenderServiceRef,
    getMultiRangeCopyService: getMultiRangeCopyServiceRef,
    getMultiStateService: getMultiStateServiceRef,
    getMultiRangeStateSnapshot: getCurrentMultiRangeStateSnapshot,
    setMultiRangeState,
    sanitizeMultiRangeCount,
    sanitizeMultiRangeTitle,
    ensureMultiRangeState,
    refreshMultiRangeControls,
    now: getRuntimeNowMs,
    getMainClockOrchestratorService: getMainClockOrchestratorServiceRef,
    getMainPersistenceSnapshotService: getMainPersistenceSnapshotServiceRef,
    warnMissingServiceMethod,
    getFixedTimeCoreService: getFixedTimeCoreServiceRef,
    getFixedTimeActionsService: getFixedTimeActionsServiceRef,
    getPatchedCopyFormatOrderState,
    getPatchedCopyFormatEnabledState,
    getPatchedCopyTimePartsEnabledState,
    sanitizeCopyFormatOrderForContext: deferDynamicCall(getSanitizeCopyFormatOrderForContextRef),
    sanitizeCopyFormatEnabledForContext: deferDynamicCall(getSanitizeCopyFormatEnabledForContextRef),
    sanitizeTimePartsEnabledForContext: deferDynamicCall(getSanitizeTimePartsEnabledForContextRef),
    getWindowRef: getWindowRefOrNull,
    getTimelineFrameService: getTimelineFrameServiceRef,
    getFixedTimeTimelineService: getFixedTimeTimelineServiceRef,
    getMainTabState: getPatchedMainTabState,
    getShowTimelineState: getShowTimelineStateRef,
    getGlobalTimeState,
    getFixedTimeSlotCountForGroup: getFixedTimeSlotCountForGroupRef,
    getFixedTimeSlotHeaderLabel,
    getSlotCountState: getPatchedSlotCountState,
    GTV_GROUP_CONTEXT_STATE,
    GTV_FORMAT_PROFILE_STATE,
    GTV_MULTI_RANGE_STATE,
    GTV_FIXED_TIME_SLOT_UTILS,
    GTV_FIXED_TIME_STATE,
    GTV_UI_PREFERENCES_STATE,
    GTV_TIMER_ENGINE,
    GTV_TIME_SERVICE,
    MAIN_TABS,
    getGroupsStateSnapshot,
    getPatchedActiveFormatProfileContextState,
    getPatchedMainTabState,
    getPatchedActiveGroupIdState,
    getActiveGroupIdByMainTabStateSnapshot,
    patchPrimaryState,
    getUTCRef,
    sanitizeUtcRowOrder: bindFacadeMethod(getTimeCoreRef, "sanitizeUtcRowOrder"),
    COPY_FORMAT_KEYS,
    TIME_PART_KEYS,
    FORMAT_PROFILE_CONTEXT_KEYS,
    DEFAULT_DISPLAY_FORMAT_ENABLED,
    DEFAULT_COPY_FORMAT_ENABLED,
    DEFAULT_DISPLAY_TIME_PARTS_ENABLED,
    DEFAULT_COPY_TIME_PARTS_ENABLED,
    sanitizeMainTab,
    getDisplayFormatOrderState: getDisplayFormatOrderStateRef,
    getDisplayFormatEnabledState: getDisplayFormatEnabledStateRef,
    getDisplayTimePartsEnabledState: getDisplayTimePartsEnabledStateRef,
    getCopyFormatOrderState: getCopyFormatOrderStateRef,
    getCopyFormatEnabledState: getCopyFormatEnabledStateRef,
    getCopyTimePartsEnabledState: getCopyTimePartsEnabledStateRef,
    getFormatProfilesState: getFormatProfilesStateRef,
    getActiveFormatProfileContextState: getActiveFormatProfileContextStateRef,
    getPatchedSlotCountState,
    patchAppState,
    MIN_MULTI_RANGE_COUNT,
    MAX_MULTI_RANGE_COUNT,
    DEFAULT_MULTI_RANGE_TITLE,
    t: gtvT,
    showToast: deferDynamicCall(getShowToastRef),
    sanitizeUtcMs: bindFacadeMethod(getTimeCoreRef, "sanitizeUtcMs"),
    getGlobalTimesState,
    getCurrentMultiRangeStateSnapshot,
    isMultiTab,
    renderMultiRangesSafely,
    updateTimeAdjustPanelSafely,
    savePersistenceSafely,
    MIN_FIXED_TIME_SLOT_COUNT,
    MAX_FIXED_TIME_SLOT_COUNT,
    DEFAULT_FIXED_TIME_VALUE,
    pad: bindFacadeMethod(getTimeCoreRef, "pad"),
    parseDateTimeParts,
    buildStrictUtcDateFromParts,
    getNextFixedTimeSeed,
    sanitizeFixedDateValue,
    sanitizeFixedTimeSlotCount,
    renderTimelineFrame: deferDynamicCall(getRenderTimelineFrameRef),
    createUniqueFixedTimeId,
    createDefaultFixedTimeSlot,
    MIN_UI_SCALE_PERCENT,
    MAX_UI_SCALE_PERCENT,
    DEFAULT_UI_SCALE_PERCENT,
    UI_SCALE_PERCENT_OPTIONS,
    THEME_LIST,
    THEME_STORAGE_KEY,
    UI_SCALE_STORAGE_KEY,
    I18N_DATA: MAIN_I18N_DATA,
    getStorageValue: bindFacadeMethod(getPersistenceServiceRef, "getStorageValue"),
    setStorageValue: bindFacadeMethod(getPersistenceServiceRef, "setStorageValue"),
    getUiScaleState,
    getCurrentThemeState: getCurrentThemeStateRef,
    getRuntimeCurrentLangState: getPatchedCurrentLangState,
    getCurrentLangState: getCurrentLangStateRef,
    setUiPreferencesState,
    DEFAULT_REALTIME_TICK_MS,
    getIsRealtimeState,
    setGlobalTimeState,
    maxRuntimeCacheSize: MAX_RUNTIME_CACHE_SIZE,
    updateClocks: deferDynamicCall(getUpdateClocksRef),
    setIntervalFn: setRuntimeInterval,
    clearIntervalFn: clearRuntimeInterval,
    luxon: getLuxonGlobalRef()
});
mainServiceMethodBridgeService = mainCoreServices.mainServiceMethodBridgeService;
mainDirectStatePatchService = mainCoreServices.mainDirectStatePatchService;
mainAppStateBridgeService = mainCoreServices.mainAppStateBridgeService;
mainPatchedStateSelectorsService = mainCoreServices.mainPatchedStateSelectorsService;
mainSharedUtilsService = mainCoreServices.mainSharedUtilsService;
mainTimezoneRuntimeBridgeService = mainCoreServices.mainTimezoneRuntimeBridgeService;
mainTimezoneRuntimeService = mainCoreServices.mainTimezoneRuntimeService;
mainTimezoneFacadeService = mainCoreServices.mainTimezoneFacadeService;
mainBaseTimezoneService = mainCoreServices.mainBaseTimezoneService;
mainTimezoneMutationService = mainCoreServices.mainTimezoneMutationService;
mainTimezoneTableFacadeService = mainCoreServices.mainTimezoneTableFacadeService;
mainTimeAdjustFacadeService = mainCoreServices.mainTimeAdjustFacadeService;
mainFixedTimeTabFacadeService = mainCoreServices.mainFixedTimeTabFacadeService;
mainFixedTimeFacadeService = mainCoreServices.mainFixedTimeFacadeService;
mainTimelineFacadeService = mainCoreServices.mainTimelineFacadeService;
mainMultiRangeTabFacadeService = mainCoreServices.mainMultiRangeTabFacadeService;
const mainGroupLocalizationServices = mainCoreServices.mainGroupLocalizationServices;
const mainOrchestrationFlowServices = mainCoreServices.mainOrchestrationFlowServices;
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
    t: gtvT,
    showToast: deferDynamicCall(getShowToastRef),
    getPersistenceService: getPersistenceServiceRef,
    confirmFn: confirmRuntime,
    locationRef: getLocationRefOrNull(),
    documentRef: getDocumentRefOrNull(),
    logError: console.error.bind(console)
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
const groupContextStateService = mainCoreServices.groupContextStateService;
const formatProfileStateService = mainCoreServices.formatProfileStateService;
const multiRangeStateService = mainCoreServices.multiRangeStateService;
const fixedTimeSlotUtilsService = mainCoreServices.fixedTimeSlotUtilsService;
const fixedTimeStateService = mainCoreServices.fixedTimeStateService;
const uiPreferencesStateService = mainCoreServices.uiPreferencesStateService;
const timerEngineService = mainCoreServices.timerEngineService;
const timeService = mainCoreServices.timeService;
function bindFacadeMethod(getFacade, methodName) {
    return (...args) => getFacade()[methodName](...args);
}

const sanitizeUtcRowOrderViaTimeCore = bindFacadeMethod(getTimeCoreRef, "sanitizeUtcRowOrder");
const sanitizeUtcMsViaTimeCore = bindFacadeMethod(getTimeCoreRef, "sanitizeUtcMs");
const confirmFnViaMainFoundation = bindFacadeMethod(getMainFoundationServicesRef, "confirmFn");

var getUtcMinuteCacheKey = bindFacadeMethod(getMainTimezoneFacadeServiceRef, "getUtcMinuteCacheKey");
var setCappedRuntimeCache = bindFacadeMethod(getMainTimezoneFacadeServiceRef, "setCappedRuntimeCache");
var getBetterAbbr = bindFacadeMethod(getMainTimezoneFacadeServiceRef, "getBetterAbbr");
var isTimeZoneInDST = bindFacadeMethod(getMainTimezoneFacadeServiceRef, "isTimeZoneInDST");
var getTimezoneOffset = bindFacadeMethod(getMainTimezoneFacadeServiceRef, "getTimezoneOffset");
var getFixedOffsetForDisplayAtDate = bindFacadeMethod(getMainTimezoneFacadeServiceRef, "getFixedOffsetForDisplayAtDate");
var getFixedOffsetForDisplay = bindFacadeMethod(getMainTimezoneFacadeServiceRef, "getFixedOffsetForDisplay");
var getLocalizedTZLabel = bindFacadeMethod(getMainTimezoneFacadeServiceRef, "getLocalizedTZLabel");
var getZoneDisplayName = bindFacadeMethod(getMainTimezoneFacadeServiceRef, "getZoneDisplayName");
var sanitizeTimezoneId = bindFacadeMethod(getMainTimezoneFacadeServiceRef, "sanitizeTimezoneId");
var sanitizeBaseTimezoneId = bindFacadeMethod(getMainTimezoneFacadeServiceRef, "sanitizeBaseTimezoneId");
var setCurrentGroupBaseTimezoneId = bindFacadeMethod(getMainTimezoneFacadeServiceRef, "setCurrentGroupBaseTimezoneId");
var applyCurrentGroupBaseTimezoneId = (nextBaseId, options = {}) =>
    mainTimezoneFacadeService.applyCurrentGroupBaseTimezoneId(nextBaseId, options);
var getUsedTimezoneIds = bindFacadeMethod(getMainTimezoneFacadeServiceRef, "getUsedTimezoneIds");
var createUniqueTimezoneId = (prefix = "tz") => mainTimezoneFacadeService.createUniqueTimezoneId(prefix);
var getNextTimezoneIdSeed = bindFacadeMethod(getMainTimezoneFacadeServiceRef, "getNextTimezoneIdSeed");

var getTimeAdjustDayStep = bindFacadeMethod(getMainTimeAdjustFacadeServiceRef, "getTimeAdjustDayStep");
var setTimeAdjustDayStep = bindFacadeMethod(getMainTimeAdjustFacadeServiceRef, "setTimeAdjustDayStep");
var updateTimeAdjustPanel = bindFacadeMethod(getMainTimeAdjustFacadeServiceRef, "updateTimeAdjustPanel");
var renderTimeAdjustSet = (slotIdx, options = {}) => mainTimeAdjustFacadeService.renderTimeAdjustSet(slotIdx, options);
var attachTimeAdjustToggleLabel = bindFacadeMethod(getMainTimeAdjustFacadeServiceRef, "attachTimeAdjustToggleLabel");
var renderMultiBulkToolSets = bindFacadeMethod(getMainTimeAdjustFacadeServiceRef, "renderMultiBulkToolSets");
var sanitizeTimeAdjustDayStep = bindFacadeMethod(getMainTimeAdjustFacadeServiceRef, "sanitizeTimeAdjustDayStep");
var resolveTimeAdjustZoneAndOffset = (baseRef, fixedOffsetMinutes = null) =>
    mainTimeAdjustFacadeService.resolveTimeAdjustZoneAndOffset(baseRef, fixedOffsetMinutes);
var applyTimeAdjustAction = bindFacadeMethod(getMainTimeAdjustFacadeServiceRef, "applyTimeAdjustAction");
var getAdjustedUtcDateByAction = bindFacadeMethod(getMainTimeAdjustFacadeServiceRef, "getAdjustedUtcDateByAction");
var applyBulkRangeAllAction = bindFacadeMethod(getMainTimeAdjustFacadeServiceRef, "applyBulkRangeAllAction");
var applyMultiRangeTimeAdjustAction = bindFacadeMethod(getMainTimeAdjustFacadeServiceRef, "applyMultiRangeTimeAdjustAction");

var createStandardTimezoneFromSelectableEntry = bindFacadeMethod(
    getMainTimezoneTableFacadeServiceRef,
    "createStandardTimezoneFromSelectableEntry"
);
var addTimezone = bindFacadeMethod(getMainTimezoneTableFacadeServiceRef, "addTimezone");
var removeTimezone = bindFacadeMethod(getMainTimezoneTableFacadeServiceRef, "removeTimezone");
var updateCopyFormatPreview = bindFacadeMethod(getMainTimezoneTableFacadeServiceRef, "updateCopyFormatPreview");
var copyAllTimezones = bindFacadeMethod(getMainTimezoneTableFacadeServiceRef, "copyAllTimezones");

var isTimelineSupportedTab = bindFacadeMethod(getMainTimelineFacadeServiceRef, "isTimelineSupportedTab");
var shouldRenderTimeline = bindFacadeMethod(getMainTimelineFacadeServiceRef, "shouldRenderTimeline");
var resolveFixedTimeTimelineSourceDate = (slotIdx, baseRef, anchorDate = getGlobalTimeState(0)) =>
    mainTimelineFacadeService.resolveFixedTimeTimelineSourceDate(slotIdx, baseRef, anchorDate);
var applyFixedTimeSlotTimelineRatio = bindFacadeMethod(getMainTimelineFacadeServiceRef, "applyFixedTimeSlotTimelineRatio");
var getFixedTimeTimelineSlots = bindFacadeMethod(getMainTimelineFacadeServiceRef, "getFixedTimeTimelineSlots");
var getFixedTimeTimelineSlotCount = bindFacadeMethod(getMainTimelineFacadeServiceRef, "getFixedTimeTimelineSlotCount");
var getFixedTimeTimelineIndicatorToken = bindFacadeMethod(getMainTimelineFacadeServiceRef, "getFixedTimeTimelineIndicatorToken");
var getFixedTimeSlotTimelineLabel = (slot, slotIdx, slotCount = 1) =>
    mainTimelineFacadeService.getFixedTimeSlotTimelineLabel(slot, slotIdx, slotCount);
var getFixedTimeTimelineIndicatorColor = bindFacadeMethod(getMainTimelineFacadeServiceRef, "getFixedTimeTimelineIndicatorColor");
var stopTimelineDrag = bindFacadeMethod(getMainTimelineFacadeServiceRef, "stopTimelineDrag");
var normalizeDayNightMarker = bindFacadeMethod(getMainTimelineFacadeServiceRef, "normalizeDayNightMarker");
var getDayNightGlyph = bindFacadeMethod(getMainTimelineFacadeServiceRef, "getDayNightGlyph");
var applyTimelineRatioToSlot = (slotIdx, ratio, baseRef, options = {}) =>
    mainTimelineFacadeService.applyTimelineRatioToSlot(slotIdx, ratio, baseRef, options);
var getTimelineIndicatorLabel = bindFacadeMethod(getMainTimelineFacadeServiceRef, "getTimelineIndicatorLabel");
var getTimelinePanelCount = bindFacadeMethod(getMainTimelineFacadeServiceRef, "getTimelinePanelCount");

var getFixedTimeSlotParts = bindFacadeMethod(getMainFixedTimeFacadeServiceRef, "getFixedTimeSlotParts");
var formatFixedTimeForTimezoneAtUtc = bindFacadeMethod(getMainFixedTimeFacadeServiceRef, "formatFixedTimeForTimezoneAtUtc");
var getFixedTimeDisplayPartsEnabled = bindFacadeMethod(getMainFixedTimeFacadeServiceRef, "getFixedTimeDisplayPartsEnabled");
var getLocalizedWeekdayNameByIndex = bindFacadeMethod(getMainFixedTimeFacadeServiceRef, "getLocalizedWeekdayNameByIndex");
var buildFixedTimeDisplayPayloadAtUtc = bindFacadeMethod(getMainFixedTimeFacadeServiceRef, "buildFixedTimeDisplayPayloadAtUtc");
var formatFixedTimePayloadText = bindFacadeMethod(getMainFixedTimeFacadeServiceRef, "formatFixedTimePayloadText");
var getFixedTimeCopyState = bindFacadeMethod(getMainFixedTimeFacadeServiceRef, "getFixedTimeCopyState");
var buildFixedTimeSnapshotForTimezoneSlot = bindFacadeMethod(
    getMainFixedTimeFacadeServiceRef,
    "buildFixedTimeSnapshotForTimezoneSlot"
);
var formatFixedTimeCopyTextForTimezoneSlot = (tz, slotUtcDate, copyState = null) =>
    mainFixedTimeFacadeService.formatFixedTimeCopyTextForTimezoneSlot(tz, slotUtcDate, copyState);
var getFixedTimeSlotUtcDateByIndex = bindFacadeMethod(getMainFixedTimeFacadeServiceRef, "getFixedTimeSlotUtcDateByIndex");
var getFixedTimePreviewCopyText = bindFacadeMethod(getMainFixedTimeFacadeServiceRef, "getFixedTimePreviewCopyText");
var getAllFixedTimeRowsCopyText = bindFacadeMethod(getMainFixedTimeFacadeServiceRef, "getAllFixedTimeRowsCopyText");
var copyFixedTimeCellPayload = bindFacadeMethod(getMainFixedTimeFacadeServiceRef, "copyFixedTimeCellPayload");
var copyFixedTimeCellByTimezone = bindFacadeMethod(getMainFixedTimeFacadeServiceRef, "copyFixedTimeCellByTimezone");
var buildFixedTimeCellInputValue = bindFacadeMethod(getMainFixedTimeFacadeServiceRef, "buildFixedTimeCellInputValue");
var buildFixedTimeCellTimeParts = bindFacadeMethod(getMainFixedTimeFacadeServiceRef, "buildFixedTimeCellTimeParts");
var applyFixedTimeSlotByTimezoneInput = bindFacadeMethod(getMainFixedTimeFacadeServiceRef, "applyFixedTimeSlotByTimezoneInput");
var bindCustomDatePickerForInput = (input, triggerBtn, options = {}) =>
    mainFixedTimeFacadeService.bindCustomDatePickerForInput(input, triggerBtn, options);
var copyFixedTimeSlotColumn = bindFacadeMethod(getMainFixedTimeFacadeServiceRef, "copyFixedTimeSlotColumn");
var renameFixedTimeSlot = bindFacadeMethod(getMainFixedTimeFacadeServiceRef, "renameFixedTimeSlot");
var updateFixedTimeSlotTime = bindFacadeMethod(getMainFixedTimeFacadeServiceRef, "updateFixedTimeSlotTime");
var addFixedTimeSlot = bindFacadeMethod(getMainFixedTimeFacadeServiceRef, "addFixedTimeSlot");
var removeFixedTimeSlot = bindFacadeMethod(getMainFixedTimeFacadeServiceRef, "removeFixedTimeSlot");

var renderFixedTimeControls = (group = null, options = {}) => mainFixedTimeTabFacadeService.renderFixedTimeControls(group, options);
var getFixedTimeSlotLayoutMetrics = bindFacadeMethod(getMainFixedTimeTabFacadeServiceRef, "getFixedTimeSlotLayoutMetrics");
var getFixedTimeDisplayColumns = bindFacadeMethod(getMainFixedTimeTabFacadeServiceRef, "getFixedTimeDisplayColumns");
var getFixedTimeOffsetTextAtDate = bindFacadeMethod(getMainFixedTimeTabFacadeServiceRef, "getFixedTimeOffsetTextAtDate");
var renderFixedTimeTable = bindFacadeMethod(getMainFixedTimeTabFacadeServiceRef, "renderFixedTimeTable");

var buildTimezoneComputedSnapshotForRange = bindFacadeMethod(
    getMainMultiRangeTabFacadeServiceRef,
    "buildTimezoneComputedSnapshotForRange"
);
var applySnapshotToRow = bindFacadeMethod(getMainMultiRangeTabFacadeServiceRef, "applySnapshotToRow");
var formatRangeDurationText = bindFacadeMethod(getMainMultiRangeTabFacadeServiceRef, "formatRangeDurationText");
var copyMultiRangeRow = bindFacadeMethod(getMainMultiRangeTabFacadeServiceRef, "copyMultiRangeRow");
var copyAllMultiRangeTimezones = bindFacadeMethod(getMainMultiRangeTabFacadeServiceRef, "copyAllMultiRangeTimezones");

// --- 통합 코어 유틸리티 ---

/**
 * 표 이미지 내보내기를 위한 공통 캔버스 상태를 준비한다.
 */
function prepareExportCanvas(sourceWidth, sourceHeight, pageBg) {
    if (!mainSharedUtilsService || typeof mainSharedUtilsService.prepareExportCanvas !== "function") {
        throw new Error("Main shared utils service is unavailable: prepareExportCanvas");
    }
    return mainSharedUtilsService.prepareExportCanvas(sourceWidth, sourceHeight, pageBg);
}

/**
 * 공통 스타일 옵션을 적용해 내보내기 셀 텍스트를 그린다.
 */
function drawExportCellText(ctx, text, x, y, w, h, options = {}) {
    if (!mainSharedUtilsService || typeof mainSharedUtilsService.drawExportCellText !== "function") {
        throw new Error("Main shared utils service is unavailable: drawExportCellText");
    }
    return mainSharedUtilsService.drawExportCellText(ctx, text, x, y, w, h, options);
}

/**
 * 입력 모드에 맞춰 날짜/시간 입력 문자열을 숫자 파트로 파싱한다.
 */
function parseDateTimeParts(val, inputMode) {
    if (!mainSharedUtilsService || typeof mainSharedUtilsService.parseDateTimeParts !== "function") {
        return null;
    }
    return mainSharedUtilsService.parseDateTimeParts(val, inputMode);
}

function parseLocalDateTimeToUtcMs(value) {
    if (!mainSharedUtilsService || typeof mainSharedUtilsService.parseLocalDateTimeToUtcMs !== "function") {
        return NaN;
    }
    return mainSharedUtilsService.parseLocalDateTimeToUtcMs(value);
}

function getSignedDurationDayHourMinute(a, b) {
    return timeService.formatDuration(
        parseLocalDateTimeToUtcMs(a),
        parseLocalDateTimeToUtcMs(b),
        getRuntimeCurrentLangValue()
    );
}

function getTimeAdjustDayStepBySlotSnapshot() {
    return getPatchedTimeAdjustDayStepBySlotState();
}

function setTimeAdjustDayStepBySlotState(nextValues = []) {
    const safeValues = Array.isArray(nextValues) ? nextValues : [];
    patchPrimaryState({ timeAdjustDayStepBySlot: [...safeValues] });
}

function updateTimeAdjustPanelSafely() {
    return updateTimeAdjustPanel();
}

function getUTCRef() {
    return { id: "utc", type: "standard", zone: "UTC", name: gtvT("utc_name") };
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

function getZoneAbbreviation(tz, date = getGlobalTimeState(0)) {
    return mainTimezoneFacadeService.getZoneAbbreviation(tz, date);
}
function getZoneDisplayNameForUiAtDate(tz, anchorDate = getGlobalTimeState(0)) {
    return mainTimezoneFacadeService.getZoneDisplayNameForUiAtDate(tz, anchorDate);
}

const pad = GTV_TIME_CORE.pad;
const clampNumber = GTV_TIME_CORE.clampNumber;
function getCustomOffsetMinutes(tz) {
    const safeTimezone = (tz && typeof tz === "object") ? tz : {};
    return GTV_TIME_CORE.getCustomOffsetMinutes(safeTimezone);
}

async function writeClipboardText(text) {
    const clipboard = (typeof navigator === "object" && navigator && navigator.clipboard)
        ? navigator.clipboard
        : null;
    if (!clipboard || typeof clipboard.writeText !== "function") {
        throw new Error("Clipboard API is unavailable.");
    }
    try {
        await clipboard.writeText(text);
    } catch (err) {
        console.warn("Clipboard write failed.", err);
        throw err;
    }
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
    if (!trimmed) return gtvT("label_custom");
    return trimmed.toUpperCase().slice(0, 12);
}

function getCurrentMultiRangeStateSnapshot() {
    return {
        multiRangeCount: getPatchedMultiRangeCountState(),
        multiRanges: getPatchedMultiRangesState(),
        multiRangeCollapsed: getPatchedMultiRangeCollapsedState(),
        multiRangeStartEditEnabled: getPatchedArrayStateValue("multiRangeStartEditEnabled", multiRangeStartEditEnabled),
        multiRangeEndEditEnabled: getPatchedArrayStateValue("multiRangeEndEditEnabled", multiRangeEndEditEnabled),
        multiRangeTitle: getPatchedMultiRangeTitleState()
    };
}

const {
    parseAutoGeneratedIndexedName,
    localizeAutoGeneratedNamesForCurrentLanguage,
    getCurrentMultiSubgroup,
    getCurrentMultiSubgroupName,
    syncCurrentMultiStateToActiveSubgroup,
    loadCurrentMultiStateFromActiveSubgroup
} = mainOrchestrationFlowServices;
function isCurrentGroupUtcRowVisible() {
    return groupContextStateService.isCurrentGroupUtcRowVisible();
}

function getCurrentGroupUtcRowOrder() {
    return groupContextStateService.getCurrentGroupUtcRowOrder();
}

const mainFormatProfileFacadeService = mainCoreServices.mainFormatProfileFacadeService;
const {
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
    resetCopyFormatForActiveContext
} = mainFormatProfileFacadeService;
const mainFormatProfileFacadeGlobalRoot = (typeof window !== "undefined" && window)
    ? window
    : ((typeof globalThis === "object" && globalThis) ? globalThis : null);
if (mainFormatProfileFacadeGlobalRoot) {
    Object.assign(mainFormatProfileFacadeGlobalRoot, {
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
        resetCopyFormatForActiveContext
    });
}

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
    return getPatchedMainTabState() === "fixed-time";
}

function isMultiTab() {
    return getPatchedMainTabState() === "multi";
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
    return mainAppStateBridgeService.getPersistenceState();
}

function getGroupsStateSnapshot() {
    const state = getPersistenceState();
    if (Array.isArray(state?.groups)) return state.groups;
    return groups;
}

function getActiveGroupIdByMainTabStateSnapshot() {
    const state = getPersistenceState();
    if (state?.activeGroupIdByMainTab && typeof state.activeGroupIdByMainTab === "object") {
        return state.activeGroupIdByMainTab;
    }
    return activeGroupIdByMainTab;
}

function patchPrimaryState(next = {}) {
    patchAppState(next);
}

function setCurrentMainTabState(nextTab) {
    patchPrimaryState({ currentMainTab: nextTab });
}

function setActiveGroupIdState(nextId) {
    patchPrimaryState({ activeGroupId: nextId });
}

function setActiveGroupIdByMainTabState(nextMap) {
    patchPrimaryState({ activeGroupIdByMainTab: nextMap });
}

function getActiveGroupNameSnapshot() {
    const safeGroups = getGroupsStateSnapshot();
    const safeActiveId = getPatchedActiveGroupIdState();
    return safeGroups[safeActiveId]?.name;
}

function setPersistenceState(next = {}) {
    return mainAppStateBridgeService.setPersistenceState(next);
}

const mainSelectServices = mainCoreServices.createMainSelectServices({
    getDocumentRef: getDocumentRefOrNull,
    getComputedStyle: (target) => window.getComputedStyle(target),
    ensureBaseTimezoneSelection,
    getCurrentGroupBaseTimezoneId,
    isCurrentGroupUtcRowVisible,
    getCurrentGroupZones,
    getZoneAbbreviation,
    getZoneDisplayName,
    setCurrentGroupBaseTimezoneId,
    savePersistence: savePersistenceSafely,
    t: gtvT
});
const {
    adjustSelectWidthForContent,
    refreshSelectWidths,
    renderBaseTimeSelect
} = mainSelectServices;

// --- 그룹 데이터 구조 ---

const timezoneSearchService = mainCoreServices.createTimezoneSearchService({
    TZ_DATABASE,
    getZoneMap: getZoneMapRef,
    t: gtvT,
    getCurrentLang: getPatchedCurrentLangState,
    getBetterAbbr,
    getTimezoneOffset,
    getLocalizedTZLabel,
    adjustSelectWidthForContent,
    getCurrentGroup,
    savePersistence: savePersistenceSafely,
    renderList: deferDynamicCall(getRenderListRef),
    addTimezone,
    createUniqueTimezoneId
});

const snapshotFormatService = mainCoreServices.createSnapshotFormatService({
    DEFAULT_COPY_TIME_PARTS_ENABLED,
    I18N_DATA: MAIN_I18N_DATA,
    t: gtvT,
    getCurrentLang: getPatchedCurrentLangState,
    getUTCRef,
    getBaseTimezoneRef,
    getCurrentGroupZones,
    getGlobalTimes: getGlobalTimesState,
    getSlotCount: getPatchedSlotCountState,
    isRealtime: getIsRealtimeState,
    getFixedOffsetForDisplay,
    normalizeCustomAbbr,
    getCustomOffsetMinutes,
    pad,
    getZoneAbbreviation,
    getZoneDisplayName,
    getSignedInclusiveDaySpan,
    getSignedDurationDayHourMinute,
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
const timeInputMutationsService = mainCoreServices.createTimeInputMutationsService({
    t: deferDynamicCall(getTranslatorRef),
    showToast: deferDynamicCall(getShowToastRef),
    isRealtime: getIsRealtimeState,
    isMultiTab,
    isMultiRangeStartEditEnabled,
    isMultiRangeEndEditEnabled,
    ensureMultiRangeState,
    getMultiRanges: getPatchedMultiRangesState,
    getMultiRangeSlotDate,
    setMultiRangeSlotDate,
    syncFollowingRangesByDuration,
    syncMultiRangeStartLinks,
    parseDateTimeParts,
    getCurrentGroupZones,
    getCustomOffsetMinutes,
    getFixedOffsetForDisplayAtDate,
    getTimezoneOffset,
    resolveLocalDateParts: resolveLocalDatePartsViaTimeService,
    buildStrictUtcDateFromParts: buildStrictUtcDateFromPartsViaCore,
    getGlobalTime: getGlobalTimeState,
    setGlobalTime: setGlobalTimeValue,
    updateClocks: deferDynamicCall(getUpdateClocksRef),
    renderList: deferDynamicCall(getRenderListRef),
    renderMultiRanges: renderMultiRangesSafely,
    savePersistence: deferDynamicCall(getSavePersistenceSafelyRef)
});

const mainRowOrderServices = mainCoreServices.createMainRowOrderServices({
    requestUiFrame,
    cancelUiFrame,
    getGroups: getGroupsStateSnapshot,
    getActiveGroupId: getPatchedActiveGroupIdState,
    getCurrentGroupBaseTimezoneId,
    getPersistenceService: getPersistenceServiceRef,
    getDocumentRef: getDocumentRefOrNull,
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
const mainRowViewServices = mainCoreServices.createMainRowViewServices({
    rowViewCache,
    maxRuntimeCacheSize: MAX_RUNTIME_CACHE_SIZE,
    getDocumentRef: getDocumentRefOrNull,
    getSnapshotFormatService: getSnapshotFormatServiceRef,
    getGlobalTime: getGlobalTimeState,
    getZoneDisplayName,
    getZoneDisplayNameForUiAtDate,
    getCurrentLang: getPatchedCurrentLangState,
    getI18nData: getI18nDataRef,
    isRealtime: getIsRealtimeState,
    getSlotCount: getPatchedSlotCountState,
    normalizeDayNightMarker,
    getDayNightGlyph,
    t: gtvT
});
const { updateRow } = mainRowViewServices;

const tableRenderService = mainCoreServices.createTableRenderService({
    t: gtvT,
    sanitizeCopyFormatOrder,
    getDisplayFormatOrder: getPatchedDisplayFormatOrderState,
    getDisplayFormatEnabled: getPatchedDisplayFormatEnabledState,
    getDisplayTimePartsEnabled: getPatchedDisplayTimePartsEnabledState,
    isRealtime: getIsRealtimeState,
    getSlotCount: getPatchedSlotCountState,
    isMultiTab,
    renderMultiRanges: renderMultiRangesSafely,
    getBaseTimezoneRef,
    getGlobalTime: getGlobalTimeState,
    escapeHtml: escapeHtmlViaSharedUtils,
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
    updateTimeAdjustPanel: updateTimeAdjustPanelSafely,
    updateClocks: deferDynamicCall(getUpdateClocksRef),
    hideFloatingTooltip,
    upgradeNativeTitleTooltips,
    createDragGhostFromRow,
    clearDragGhost,
    copyRow: bindFacadeMethod(getCopyActionsServiceRef, "copyRow")
});

const mainImageExportBridgeProxy = mainCoreServices.createMainImageExportBridgeProxy({
    getImageExportBridgeService: getImageExportBridgeServiceRef,
    getDefaultTableExportContext: createDefaultTableExportContext
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

const mainImageRuntimeServices = mainCoreServices.createMainImageRuntimeServices({
    GTV_IMAGE_CLONE,
    GTV_IMAGE_FOREIGN_RENDER,
    GTV_IMAGE_EXPORT_BRIDGE,
    GTV_TABLE_IMAGE_RENDER,
    GTV_MULTI_RANGE_IMAGE_RENDER,
    TABLE_IMAGE_EXPORT_WIDTH,
    EXPORT_MONO_FONT_FAMILY,
    document: getDocumentRefOrNull(),
    getCanUseForeignObjectRenderer: getCanUseForeignObjectRendererRef,
    setCanUseForeignObjectRenderer,
    getImageExportActionsService: getImageExportActionsServiceRef,
    getDefaultTableExportContext: createDefaultTableExportContext,
    isFixedTimeTab,
    waitForDocumentFontsReady,
    prepareExportCanvas,
    drawExportCellText,
    cloneTableForImageExport,
    renderElementWithForeignObjectToPngDataUrl,
    t: gtvT,
    ensureMultiRangeState,
    getBaseTimezoneRef,
    getMultiRanges: getPatchedMultiRangesState,
    getMultiRangeTitleText: getMultiRangeTitleTextFromRenderService,
    cloneMultiRangeBlockForImageExport,
    extractTableCellText
});
imageCloneService = mainImageRuntimeServices.imageCloneService;
imageForeignRenderService = mainImageRuntimeServices.imageForeignRenderService;
imageExportBridgeService = mainImageRuntimeServices.imageExportBridgeService;
tableImageRenderService = mainImageRuntimeServices.tableImageRenderService;
multiRangeImageRenderService = mainImageRuntimeServices.multiRangeImageRenderService;

const mainFixedTimeServices = mainCoreServices.createMainFixedTimeServices({
    GTV_FIXED_TIME_CORE,
    GTV_FIXED_TIME_TIMELINE,
    GTV_FIXED_TIME_ACTIONS,
    DEFAULT_FIXED_TIME_VALUE,
    MIN_FIXED_TIME_SLOT_COUNT,
    TIMELINE_TOTAL_SECONDS,
    I18N_DATA: MAIN_I18N_DATA,
    t: gtvT,
    getCurrentLang: getPatchedCurrentLangState,
    sanitizeFixedTimeValue,
    getFixedOffsetForDisplayAtDate,
    getLocalPartsByTimezone,
    getUTCDateFromLocalParts,
    pad,
    sanitizeTimePartsEnabledForContext,
    getDisplayTimePartsEnabled: getPatchedDisplayTimePartsEnabledState,
    getDefaultFixedTimeName,
    sanitizeFixedTimeName,
    getFixedDateParts: getFixedDatePartsFromGroup,
    getCurrentGroup,
    ensureGroupFixedTimes,
    getGlobalTime: getGlobalTimeState,
    resolveFixedTimeSlotUtcDate,
    clampNumber,
    getFixedTimeSlotCount,
    sanitizeFixedTimeId,
    getFixedTimeSlotHeaderLabel,
    sanitizeCopyFormatOrderForContext,
    sanitizeCopyFormatEnabledForContext,
    getCopyFormatOrder: getPatchedCopyFormatOrderState,
    getCopyFormatEnabled: getPatchedCopyFormatEnabledState,
    getCopyTimePartsEnabled: getPatchedCopyTimePartsEnabledState,
    buildTimezoneComputedSnapshotForDates: buildTimezoneComputedSnapshotForDatesViaSnapshotService,
    formatSnapshotText: formatSnapshotTextViaSnapshotService,
    getBaseTimezoneRef,
    getRenderableTimezoneRows: getRenderableTimezoneRowsFromTableRender,
    parseDateTimeParts,
    showToast: deferDynamicCall(getShowToastRef),
    writeClipboard: writeClipboardText,
    buildFixedTimeDisplayPayloadAtUtc,
    renderFixedTimeTab: deferDynamicCall(getRenderFixedTimeTabRef),
    renderTimelineFrame: deferDynamicCall(getRenderTimelineFrameRef),
    savePersistence: deferDynamicCall(getSavePersistenceSafelyRef),
    setFixedTimeSlotCount,
    refreshFixedTimeSlotCountControls: deferDynamicCall(getRefreshFixedTimeSlotCountControlsRef)
});
fixedTimeCoreService = mainFixedTimeServices.fixedTimeCoreService;
fixedTimeTimelineService = mainFixedTimeServices.fixedTimeTimelineService;
fixedTimeActionsService = mainFixedTimeServices.fixedTimeActionsService;

const mainMultiRangeServices = mainCoreServices.createMainMultiRangeServices({
    GTV_MULTI_RANGE_RENDER,
    GTV_MULTI_RANGE_COPY,
    GTV_COPY_ACTIONS,
    I18N_DATA: MAIN_I18N_DATA,
    t: gtvT,
    getCurrentLang: getPatchedCurrentLangState,
    pad,
    getCustomOffsetMinutes,
    getFixedOffsetForDisplayAtDate,
    normalizeCustomAbbr,
    getZoneAbbreviation,
    getSignedInclusiveDaySpan,
    getSignedDurationDayHourMinute,
    getZoneDisplayName,
    getZoneDisplayNameForUiAtDate,
    sanitizeMultiSubgroupName: sanitizeMultiSubgroupNameViaState,
    getCurrentMultiSubgroupName,
    sanitizeMultiRangeTitle,
    getMultiRangeTitle: getPatchedMultiRangeTitleState,
    buildStaticRowCell: buildStaticRowCellFromTableRender,
    buildDynamicRowCell: buildDynamicRowCellFromTableRender,
    isMultiRangeStartEditEnabled,
    isMultiRangeEndEditEnabled,
    handleMultiRangeTimeChange,
    copyMultiRangeRow,
    hideFloatingTooltip,
    ensureMultiRangeState,
    refreshMultiRangeControls,
    renderMultiBulkToolSets,
    getBaseTimezoneRef,
    escapeHtml: escapeHtmlViaSharedUtils,
    getDisplayColumns,
    getRenderableTimezoneRows: getRenderableTimezoneRowsFromTableRender,
    getMultiRanges: getPatchedMultiRangesState,
    getMultiRangeCollapsed: getPatchedMultiRangeCollapsedState,
    getMultiRangeCount: getPatchedMultiRangeCountState,
    buildTimezoneComputedSnapshotForDates: buildTimezoneComputedSnapshotForDatesViaSnapshotService,
    saveMultiRangeSingleImage,
    setMultiRangesCollapsedBelow,
    toggleMultiRangeCollapsed,
    renderTimeAdjustSet,
    applyMultiRangeTimeAdjustAction,
    attachTimeAdjustToggleLabel,
    setMultiRangeStartEditEnabled,
    setMultiRangeEndEditEnabled,
    getMultiDisplayColumnHeader: getMultiDisplayColumnHeaderFromTableRender,
    updateTimeAdjustPanel: updateTimeAdjustPanelSafely,
    updateCopyFormatPreview,
    upgradeNativeTitleTooltips,
    showToast: deferDynamicCall(getShowToastRef),
    getTimezoneRefById: getTimezoneRefByIdFromSnapshotService,
    buildTimezoneComputedSnapshotForRange,
    formatSnapshotText,
    getCopyFormatOrder: getPatchedCopyFormatOrderState,
    getCopyFormatEnabled: getPatchedCopyFormatEnabledState,
    getCopyTimePartsEnabled: getPatchedCopyTimePartsEnabledState,
    writeClipboard: writeClipboardText,
    isShowCopyFormat: getPatchedShowCopyFormatState,
    isMultiTab,
    isFixedTimeTab,
    getRowFormattedText: getRowFormattedTextViaSnapshotService,
    getRowCopyText: getRowCopyTextViaSnapshotService,
    getFixedTimePreviewCopyText,
    getAllFixedTimeRowsCopyText,
    copyAllMultiRangeTimezones
});
const multiRangeRenderService = mainMultiRangeServices.multiRangeRenderService;
const multiRangeCopyService = mainMultiRangeServices.multiRangeCopyService;
const copyActionsService = mainMultiRangeServices.copyActionsService;

const mainTimeAdjustServices = mainCoreServices.createMainTimeAdjustServices({
    GTV_TIME_ADJUST_UI,
    GTV_MULTI_BULK_TOOLS,
    GTV_TIME_ADJUST_ACTIONS,
    MIN_TIME_ADJUST_DAY_STEP,
    MAX_TIME_ADJUST_DAY_STEP,
    DEFAULT_TIME_ADJUST_DAY_STEP,
    t: gtvT,
    savePersistence: savePersistenceSafely,
    applyTimeAdjustAction,
    getCurrentMainTab: getPatchedMainTabState,
    isRealtime: getIsRealtimeState,
    getSlotCount: getPatchedSlotCountState,
    getTimeAdjustDayStepValue,
    setTimeAdjustDayStepValue: (slotIdx, value) => {
        const daySteps = [...getTimeAdjustDayStepBySlotSnapshot()];
        daySteps[slotIdx] = value;
        setTimeAdjustDayStepBySlotState(daySteps);
    },
    upgradeNativeTitleTooltips,
    getMultiRangeCount: getPatchedMultiRangeCountState,
    applyBulkRangeAllAction,
    applyFirstRangeStartAdjustAction,
    setAllMultiRangeStartEditEnabled,
    setAllMultiRangeEndEditEnabled,
    getGlobalTimes: getGlobalTimesState,
    updateClocks: deferDynamicCall(getUpdateClocksRef),
    getBaseTimezoneRef,
    getFixedOffsetForDisplay,
    getFixedOffsetForDisplayAtDate,
    getCustomOffsetMinutes,
    getTimeAdjustDayStep,
    timeService,
    sanitizeUtcMs: sanitizeUtcMsViaTimeCore,
    ensureMultiRangeState,
    getMultiRanges: getPatchedMultiRangesState,
    isMultiRangeStartLinked,
    isMultiTab,
    renderMultiRanges: renderMultiRangesSafely,
    savePersistenceForce: savePersistenceSafely,
    isMultiRangeStartEditEnabled,
    isMultiRangeEndEditEnabled,
    syncLinkedRangesFrom,
    getMultiRangeSlotDate,
    setMultiRangeSlotDate,
    syncFollowingRangesByDuration,
    syncMultiRangeStartLinks
});
timeAdjustUiService = mainTimeAdjustServices.timeAdjustUiService;
multiBulkToolsService = mainTimeAdjustServices.multiBulkToolsService;
timeAdjustActionsService = mainTimeAdjustServices.timeAdjustActionsService;

const mainTabServices = mainCoreServices.createMainTabServices({
    GTV_FORMAT_CONTROLS,
    serviceBootstrap,
    COPY_FORMAT_KEYS,
    TIME_PART_KEYS,
    t: gtvT,
    sanitizeCopyFormatOrder,
    renderList: deferDynamicCall(getRenderListRef),
    updateCopyFormatPreview,
    savePersistence: savePersistenceSafely,
    upgradeNativeTitleTooltips,
    isShowCopyFormat: getPatchedShowCopyFormatState,
    getDisplayFormatOrder: getPatchedDisplayFormatOrderState,
    setDisplayFormatOrder: (next) => {
        const context = getPatchedActiveFormatProfileContextState();
        patchAppState({
            displayFormatOrder: sanitizeCopyFormatOrderForContext(next, context)
        });
        syncActiveFormatProfileFromState();
    },
    getDisplayFormatEnabled: getPatchedDisplayFormatEnabledState,
    setDisplayFormatEnabled: (next) => {
        const context = getPatchedActiveFormatProfileContextState();
        patchAppState({
            displayFormatEnabled: sanitizeCopyFormatEnabledForContext(next, "display", context)
        });
        syncActiveFormatProfileFromState();
    },
    getDisplayTimePartsEnabled: getPatchedDisplayTimePartsEnabledState,
    setDisplayTimePartsEnabled: (next) => {
        const context = getPatchedActiveFormatProfileContextState();
        patchAppState({
            displayTimePartsEnabled: sanitizeTimePartsEnabledForContext(next, "display", context)
        });
        syncActiveFormatProfileFromState();
    },
    getCopyFormatOrder: getPatchedCopyFormatOrderState,
    setCopyFormatOrder: (next) => {
        const context = getPatchedActiveFormatProfileContextState();
        patchAppState({
            copyFormatOrder: sanitizeCopyFormatOrderForContext(next, context)
        });
        syncActiveFormatProfileFromState();
    },
    getCopyFormatEnabled: getPatchedCopyFormatEnabledState,
    setCopyFormatEnabled: (next) => {
        const context = getPatchedActiveFormatProfileContextState();
        patchAppState({
            copyFormatEnabled: sanitizeCopyFormatEnabledForContext(next, "copy", context)
        });
        syncActiveFormatProfileFromState();
    },
    getCopyTimePartsEnabled: getPatchedCopyTimePartsEnabledState,
    setCopyTimePartsEnabled: (next) => {
        const context = getPatchedActiveFormatProfileContextState();
        patchAppState({
            copyTimePartsEnabled: sanitizeTimePartsEnabledForContext(next, "copy", context)
        });
        syncActiveFormatProfileFromState();
    },
    getActiveCopyFormatKeys: getActiveCopyFormatKeysForCurrentContext,
    getActiveTimePartKeys: getActiveTimePartKeysForCurrentContext,
    sanitizeMainTab,
    clampGroupIndex,
    normalizeGroupTabState,
    isMultiTab,
    isFixedTimeTab,
    getSlotCount: getPatchedSlotCountState,
    getShowTimeline: getPatchedShowTimelineState,
    getIsRealtime: getIsRealtimeState,
    setIsRealtime: setIsRealtimeState,
    syncRealtimeNow: () => {
        setGlobalTimeState(0, new Date());
    },
    getCurrentMainTab: getPatchedMainTabState,
    setCurrentMainTab: setCurrentMainTabState,
    getActiveGroupId: getPatchedActiveGroupIdState,
    setActiveGroupId: setActiveGroupIdState,
    getActiveGroupIdByMainTab: getActiveGroupIdByMainTabStateSnapshot,
    setActiveGroupIdByMainTab: setActiveGroupIdByMainTabState,
    hideFloatingTooltip,
    syncCurrentMultiStateToActiveSubgroup,
    refreshMultiRangeControls,
    renderBaseTimeSelect,
    loadCurrentMultiStateFromActiveSubgroup,
    renderGroups: bindFacadeMethod(getGroupTabsServiceRef, "renderGroups"),
    renderMultiSubgroups: bindFacadeMethod(getGroupTabsServiceRef, "renderMultiSubgroups"),
    renderMultiRanges: renderMultiRangesSafely,
    renderFixedTimeTab,
    renderTimelineFrame: deferDynamicCall(getRenderTimelineFrameRef),
    updateTimeAdjustPanel: updateTimeAdjustPanelSafely,
    syncActiveFormatProfileFromState,
    resolveFormatProfileContext,
    activateFormatProfileContext
});
const formatControlsService = mainTabServices.formatControlsService;
const tabUiService = mainTabServices.tabUiService;
const tabOrchestratorService = mainTabServices.tabOrchestratorService;

const mainGroupStateServices = mainCoreServices.createMainGroupStateServices({
    GTV_MULTI_STATE,
    serviceBootstrap,
    MIN_MULTI_RANGE_COUNT,
    t: gtvT,
    getGroups: getGroupsStateSnapshot,
    getDefaultMultiRangeBounds,
    sanitizeMultiRangeCount,
    sanitizeMultiRangeItem,
    sanitizeUtcMs: sanitizeUtcMsViaTimeCore,
    sanitizeTimezoneId,
    createUniqueTimezoneId,
    normalizeCustomAbbr,
    normalizeZoneAbbreviation: normalizeZoneAbbreviationViaSearch,
    sanitizeBaseTimezoneId,
    sanitizeUtcRowOrder: sanitizeUtcRowOrderViaTimeCore,
    sanitizeFixedTimes,
    sanitizeFixedDateValue
});
multiStateService = mainGroupStateServices.multiStateService;
groupStateService = mainGroupStateServices.groupStateService;

const mainImageExportNamingProxy = mainCoreServices.createMainImageExportNamingProxy({
    getImageExportNamingService: getImageExportNamingServiceRef,
    getCustomOffsetMinutes,
    pad,
    timeService,
    getBaseTimezoneRef,
    getGroups: getGroupsStateSnapshot,
    getActiveGroupId: getPatchedActiveGroupIdState,
    t: gtvT,
    getZoneAbbreviation,
    getBaseTime: getBaseTimeSnapshot,
    sanitizeMultiSubgroupName: sanitizeMultiSubgroupNameForExport,
    getCurrentMultiSubgroupName
});
const {
    sanitizeFilenamePart,
    formatDateTimeByTimezone,
    getTimezoneTableImageFilename,
    getMultiRangeTableImageFilename,
    getMultiRangeTitlesImageFilename
} = mainImageExportNamingProxy;

const mainImageExportServices = mainCoreServices.createMainImageExportServices({
    GTV_IMAGE_EXPORT_NAMING,
    GTV_IMAGE_EXPORT_ACTIONS,
    imageExportApi: GTV_IMAGE_EXPORT,
    t: gtvT,
    pad,
    timeService,
    getCustomOffsetMinutes,
    getBaseTimezoneRef,
    getBaseTime: getBaseTimeSnapshot,
    getActiveGroupName: getActiveGroupNameSnapshot,
    getZoneAbbreviation,
    sanitizeMultiSubgroupName: sanitizeMultiSubgroupNameForExport,
    getCurrentMultiSubgroupName,
    showToast: deferDynamicCall(getShowToastRef),
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
    getMultiRanges: getPatchedMultiRangesState,
    isDomExceptionLike,
    setCanUseForeignObjectRenderer
});
imageExportNamingService = mainImageExportServices.imageExportNamingService;
imageExportActionsService = mainImageExportServices.imageExportActionsService;

const mainAppStateServices = mainCoreServices.createMainAppStateServices({
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
        isRealtime: getIsRealtimeState(),
        currentTheme,
        currentLang: getRuntimeCurrentLangValue()
    }),
    stateSetters: directStateSetters,
    setIsRealtimeState,
    syncActiveFormatProfileFromState,
    ensureFormatProfiles,
    getCurrentFormatProfileState,
    resolveFormatProfileContext,
    applyFormatProfileState
});
appStatePatcherService = mainAppStateServices.appStatePatcherService;
appPersistenceStateService = mainAppStateServices.appPersistenceStateService;
ensureFormatProfiles(createDefaultFormatProfile("live"));
activateFormatProfileForCurrentContext({ syncCurrent: false });

function getPatchedAppStateSnapshot() {
    return mainAppStateBridgeService.getPatchedAppStateSnapshot();
}

function patchAppState(next = {}) {
    return mainAppStateBridgeService.patchAppState(next);
}

function getPatchedStateValue(key, fallbackValue) {
    return mainAppStateBridgeService.getPatchedStateValue(key, fallbackValue);
}

function getPatchedIntegerStateValue(key, fallbackValue = 0) {
    return mainAppStateBridgeService.getPatchedIntegerStateValue(key, fallbackValue);
}

function getPatchedBooleanStateValue(key, fallbackValue = false) {
    return mainAppStateBridgeService.getPatchedBooleanStateValue(key, fallbackValue);
}

function getPatchedStringStateValue(key, fallbackValue = "") {
    return mainAppStateBridgeService.getPatchedStringStateValue(key, fallbackValue);
}

function getPatchedArrayStateValue(key, fallbackValue = []) {
    return mainAppStateBridgeService.getPatchedArrayStateValue(key, fallbackValue);
}

function getPatchedObjectStateValue(key, fallbackValue = {}) {
    return mainAppStateBridgeService.getPatchedObjectStateValue(key, fallbackValue);
}

function getPatchedMainTabState() {
    return mainPatchedStateSelectorsService.getPatchedMainTabState();
}

function getPatchedSlotCountState() {
    return mainPatchedStateSelectorsService.getPatchedSlotCountState();
}

function setPatchedSlotCountState(next) {
    return mainPatchedStateSelectorsService.setPatchedSlotCountState(next);
}

function getPatchedShowCopyFormatState() {
    return mainPatchedStateSelectorsService.getPatchedShowCopyFormatState();
}

function setPatchedShowCopyFormatState(next) {
    return mainPatchedStateSelectorsService.setPatchedShowCopyFormatState(next);
}

function getPatchedShowTimelineState() {
    return mainPatchedStateSelectorsService.getPatchedShowTimelineState();
}

function setPatchedShowTimelineState(next) {
    return mainPatchedStateSelectorsService.setPatchedShowTimelineState(next);
}

function getPatchedCurrentThemeState() {
    return mainPatchedStateSelectorsService.getPatchedCurrentThemeState();
}

function getPatchedCurrentLangState() {
    return mainPatchedStateSelectorsService.getPatchedCurrentLangState();
}

function getPatchedDisplayFormatOrderState() {
    return mainPatchedStateSelectorsService.getPatchedDisplayFormatOrderState();
}

function getPatchedDisplayFormatEnabledState() {
    return mainPatchedStateSelectorsService.getPatchedDisplayFormatEnabledState();
}

function getPatchedDisplayTimePartsEnabledState() {
    return mainPatchedStateSelectorsService.getPatchedDisplayTimePartsEnabledState();
}

function getPatchedCopyFormatOrderState() {
    return mainPatchedStateSelectorsService.getPatchedCopyFormatOrderState();
}

function getPatchedCopyFormatEnabledState() {
    return mainPatchedStateSelectorsService.getPatchedCopyFormatEnabledState();
}

function getPatchedCopyTimePartsEnabledState() {
    return mainPatchedStateSelectorsService.getPatchedCopyTimePartsEnabledState();
}

function getPatchedActiveFormatProfileContextState() {
    return mainPatchedStateSelectorsService.getPatchedActiveFormatProfileContextState();
}

function getPatchedActiveGroupIdState() {
    return mainPatchedStateSelectorsService.getPatchedActiveGroupIdState();
}

function getPatchedMultiRangeCountState() {
    return mainPatchedStateSelectorsService.getPatchedMultiRangeCountState();
}

function getPatchedMultiRangesState() {
    return mainPatchedStateSelectorsService.getPatchedMultiRangesState();
}

function getPatchedMultiRangeCollapsedState() {
    return mainPatchedStateSelectorsService.getPatchedMultiRangeCollapsedState();
}

function getPatchedTimeAdjustDayStepBySlotState() {
    return mainPatchedStateSelectorsService.getPatchedTimeAdjustDayStepBySlotState();
}

function getPatchedMultiRangeTitleState() {
    return mainPatchedStateSelectorsService.getPatchedMultiRangeTitleState();
}

const mainPersistenceCompositionServices = mainCoreServices.createMainPersistenceCompositionServices({
    GTV_MAIN_GROUP_TABS_SERVICE,
    GTV_MAIN_PERSISTENCE_SNAPSHOT_SERVICES,
    GTV_MAIN_PERSISTENCE_SERVICES,
    groupTabsConfig: {
        GTV_GROUP_TABS,
        t: gtvT,
        showToast: deferDynamicCall(getShowToastRef),
        confirmFn: confirmFnViaMainFoundation,
        getState: getPersistenceState,
        setState: setPersistenceState,
        isMultiTab,
        getCurrentGroup,
        isFixedTimeTab,
        ensureGroupMultiSubgroups: ensureGroupMultiSubgroupsViaState,
        normalizeGroupTabState,
        syncCurrentMultiStateToActiveSubgroup,
        loadCurrentMultiStateFromActiveSubgroup,
        renderBaseTimeSelect,
        renderMultiRanges: renderMultiRangesSafely,
        renderFixedTimeTab,
        renderList: deferDynamicCall(getRenderListRef),
        renderTimelineFrame: deferDynamicCall(getRenderTimelineFrameRef),
        setCustomTooltip,
        hideFloatingTooltip,
        upgradeNativeTitleTooltips,
        getDefaultMultiSubgroupName: getDefaultMultiSubgroupNameViaState,
        getDefaultFixedTimes,
        getDefaultFixedDate,
        createMultiSubgroupState: createMultiSubgroupStateViaState,
        sanitizeMultiSubgroupName: sanitizeMultiSubgroupNameViaState,
        sanitizeMultiRangeTitle,
        getActiveGroupId: getPatchedActiveGroupIdState
    },
    snapshotConfig: {
        getState: getPatchedAppStateSnapshot,
        setState: patchAppState,
        sanitizeMainTab,
        syncActiveFormatProfileFromState,
        syncCurrentMultiStateToActiveSubgroup,
        normalizeGroupTabState,
        ensureMultiRangeState,
        getGroups: getGroupsStateSnapshot,
        ensureGroupFixedTimes,
        ensureGroupMultiSubgroups: ensureGroupMultiSubgroupsViaState,
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
        sanitizeUtcMs: sanitizeUtcMsViaTimeCore,
        now: getRuntimeNowMs
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
        I18N_DATA: MAIN_I18N_DATA,
        VERSION,
        getDefaultFixedTimes,
        getDefaultFixedDate,
        getState: getPersistenceState,
        setState: setPersistenceState,
        getPersistenceSnapshot,
        ensureGroupMultiSubgroups: ensureGroupMultiSubgroupsViaState,
        sanitizeGroup,
        sanitizeBaseTimezoneId,
        sanitizeMainTab,
        sanitizeTimeAdjustDayStep,
        sanitizeCopyFormatOrder,
        sanitizeCopyFormatEnabled,
        sanitizeTimePartsEnabled,
        sanitizeFormatProfiles,
        deriveTimePartsFromLegacyEnabled,
        sanitizeMultiStatePayload: sanitizeMultiStatePayloadViaState,
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
        updateTZDropdown: bindFacadeMethod(getTimezoneSearchServiceRef, "updateTZDropdown"),
        refreshSelectWidths,
        switchMainTab,
        showToast: deferDynamicCall(getShowToastRef),
        t: gtvT,
        confirmFn: confirmFnViaMainFoundation,
        tFormat,
        applyVersionBranding,
        getGroups: getGroupsStateSnapshot,
        getCurrentTheme: getPatchedCurrentThemeState,
        getCurrentLang: getPatchedCurrentLangState,
        getCurrentMainTab: getPatchedMainTabState,
        sanitizeUtcRowOrder: sanitizeUtcRowOrderViaTimeCore,
        sanitizeTheme,
        sanitizeUiScalePercent,
        setCurrentLang,
        loadPersistence,
        localizeAutoGeneratedNamesForCurrentLanguage,
        getActiveGroupId: getPatchedActiveGroupIdState,
        sanitizeFilenamePart,
        pad,
        renderBaseTimeSelect,
        renderMultiRanges: renderMultiRangesSafely,
        renderList: deferDynamicCall(getRenderListRef),
        isMultiTab,
        sanitizeMultiSubgroupId: sanitizeMultiSubgroupIdViaState,
        sanitizeMultiSubgroupName: sanitizeMultiSubgroupNameViaState,
        getDefaultMultiSubgroupName: getDefaultMultiSubgroupNameViaState,
        getCurrentMultiSubgroup,
        document: getDocumentRefOrNull()
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

const mainRuntimeCompositionServices = mainCoreServices.createMainRuntimeCompositionServices({
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
        getCurrentMainTab: getPatchedMainTabState,
        getIsRealtime: getIsRealtimeState,
        getSlotCount: getPatchedSlotCountState,
        getGlobalTime: getGlobalTimeState,
        setGlobalTime: setGlobalTimeState,
        getCurrentLang: getPatchedCurrentLangState,
        getCurrentTheme: getPatchedCurrentThemeState,
        getUiScale: getUiScaleState,
        getMultiRangeCount: getPatchedMultiRangeCountState,
        getShowCopyFormat: getPatchedShowCopyFormatState,
        setShowCopyFormat: setPatchedShowCopyFormatState,
        getShowTimeline: getPatchedShowTimelineState,
        setShowTimeline: setPatchedShowTimelineState,
        getSlotCountState: getPatchedSlotCountState,
        setSlotCount: setPatchedSlotCountState
    },
    services: {
        getPersistenceService: getPersistenceServiceRef,
        getTableRenderService: getTableRenderServiceRef,
        getFormatControlsService: getFormatControlsServiceRef,
        getGroupTabsService: getGroupTabsServiceRef,
        getMultiRangeRenderService: getMultiRangeRenderServiceRef,
        getTimezoneSearchService: getTimezoneSearchServiceRef,
        getTimeAdjustUiService: getTimeAdjustUiServiceRef,
        getTabUiService: getTabUiServiceRef,
        getUiSettingsActionsService: getUiSettingsActionsServiceRef
    },
    actions: {
        t: gtvT,
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
        updateClocks: deferDynamicCall(getUpdateClocksRef),
        getCurrentGroup,
        ensureGroupFixedTimes,
        getFixedTimeDisplayPartsEnabled,
        getDisplayFormatOrder: getPatchedDisplayFormatOrderState,
        getDisplayFormatEnabled: getPatchedDisplayFormatEnabledState,
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
        getFixedTimeSlotCountForCurrentGroup,
        setFixedTimeSlotCount,
        refreshFixedTimeSlotCountControls,
        setCurrentGroupFixedDate,
        sanitizeFixedDateValue,
        showToast: deferDynamicCall(getShowToastRef),
        normalizeCustomAbbr,
        addTimezone,
        createUniqueTimezoneId,
        syncActiveFormatProfileFromState,
        activateFormatProfileForCurrentContext,
        renderList: deferDynamicCall(getRenderListRef),
        updateCopyFormatPreview,
        renderTimelineFrame: deferDynamicCall(getRenderTimelineFrameRef),
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
        getDocumentRef: getDocumentRefOrNull,
        getWindowRef: getWindowRefOrNull,
        getGlobalThisRef: getGlobalThisRefOrNull
    }
});
timelineFrameService = mainRuntimeCompositionServices.timelineFrameService;
fixedTimeTableService = mainRuntimeCompositionServices.fixedTimeTableService;
mainUiInitService = mainRuntimeCompositionServices.mainUiInitService;
mainClockOrchestratorService = mainRuntimeCompositionServices.mainClockOrchestratorService;
mainAppBootstrapService = mainCoreServices.createMainAppBootstrapService({
    assertRequiredServices,
    loadPersistence,
    localizeAutoGeneratedNamesForCurrentLanguage,
    savePersistenceSafely,
    loadCurrentMultiStateFromActiveSubgroup,
    loadThemePreference,
    applyTheme,
    loadUiScalePreference,
    applyUiScale,
    applyTranslations,
    applyVersionBranding,
    initUI: bindFacadeMethod(getMainUiInitServiceRef, "initUI"),
    bindFloatingTooltipEvents,
    initDragAndDrop,
    initSearchAndSelect: bindFacadeMethod(getTimezoneSearchServiceRef, "initSearchAndSelect"),
    initCalculators,
    startRealtimeTicker: bindFacadeMethod(getTimerEngineServiceRef, "startRealtimeTicker"),
    switchMainTab,
    getCurrentMainTab: getPatchedMainTabState,
    updateClocks: deferDynamicCall(getUpdateClocksRef),
    showFatalError
});

function showFatalError(err) {
    const result = callServiceMethod(
        "appFeedbackService",
        appFeedbackService,
        "showFatalError",
        [err],
        { fallback: SERVICE_METHOD_MISSING }
    );
    if (result === SERVICE_METHOD_MISSING) {
        console.error("FATAL ERROR during app initialization:", err);
    }
}

async function initApp() {
    return await mainAppBootstrapService.initApp();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}

function showToast(message, options = {}) {
    return callServiceMethod(
        "appFeedbackService",
        appFeedbackService,
        "showToast",
        [message, options]
    );
}

function switchMainTab(tab) {
    return tabOrchestratorService.switchMainTab(tab);
}

function refreshOptionToggleDividers() {
    return tabOrchestratorService.refreshOptionToggleDividers();
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
    const safeSlotCount = Number.isFinite(Number(effectiveSlotCount))
        ? Number(effectiveSlotCount)
        : getPatchedSlotCountState();
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

// --- 목록 렌더링(동적 슬롯) ---
function renderList() {
    return mainTimezoneTableFacadeService.renderList();
}

function renderTimelineFrame() {
    return mainTimelineFacadeService.renderTimelineFrame();
}

function resolveFixedTimeSlotUtcDate(slot, baseRef, anchorDate = getGlobalTimeState(0)) {
    return mainFixedTimeFacadeService.resolveFixedTimeSlotUtcDate(slot, baseRef, anchorDate);
}

function getFixedTimeSlotHeaderLabel(slot, slotIdx, slotCount = 1) {
    return mainFixedTimeFacadeService.getFixedTimeSlotHeaderLabel(slot, slotIdx, slotCount);
}

function renderFixedTimeTab() {
    return mainFixedTimeTabFacadeService.renderFixedTimeTab();
}

// --- 시계 로직 ---
function updateClocks() {
    return mainOrchestrationFlowServices.updateClocks();
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

function formatTimeTextByParts(snapshot, timePartsEnabled) {
    const safeSnapshot = (snapshot && typeof snapshot === "object") ? snapshot : {};
    const safeTimeParts = (timePartsEnabled === undefined) ? DEFAULT_COPY_TIME_PARTS_ENABLED : timePartsEnabled;
    return snapshotFormatService.formatTimeTextByParts(safeSnapshot, safeTimeParts);
}

function formatSnapshotText(snapshot, order, enabled, timePartsEnabled = DEFAULT_COPY_TIME_PARTS_ENABLED) {
    const safeSnapshot = (snapshot && typeof snapshot === "object") ? snapshot : {};
    return snapshotFormatService.formatSnapshotText(safeSnapshot, order, enabled, timePartsEnabled);
}

function initCalculators() {
    return callServiceMethod(
        "calculatorActionsService",
        calculatorActionsService,
        "initCalculators",
        []
    );
}

async function copyText(elementId, isInput = false) {
    return await callServiceMethod(
        "calculatorActionsService",
        calculatorActionsService,
        "copyText",
        [elementId, isInput],
        { toastOnMissing: true, featureKey: "calculator-copy" }
    );
}

function getPersistenceSnapshot() {
    return mainOrchestrationFlowServices.getPersistenceSnapshot();
}

function sanitizeGroup(group, idx, legacyMultiState = null) {
    if (!group || typeof group !== "object") return null;
    const safeIdx = Number.isInteger(idx) && idx >= 0 ? idx : 0;
    return groupStateService.sanitizeGroup(group, safeIdx, legacyMultiState);
}

async function loadPersistence() {
    return await persistenceService.loadPersistence();
}

const MAIN_TEST_HOOK_REGISTRY = Object.freeze({
    getRuntimeCurrentLangValue,
    syncCurrentLang,
    setIsRealtimeState,
    getIsRealtimeState,
    getGlobalTimesState,
    getGlobalTimeState,
    setGlobalTimeState,
    getUiScaleState,
    applyDirectStatePatch,
    warnMissingServiceMethod,
    showMissingFeatureToastOnce,
    getServiceMethod,
    callServiceMethod,
    savePersistenceSafely,
    renderMultiRangesSafely,
    resolveRequiredBootstrapServiceRef,
    assertRequiredServices,
    applyVersionBranding,
    buildPatchedStateFallbackSnapshot,
    createCanvasSafely,
    getRandomUUIDSafely,
    getDocumentRefOrNull,
    getWindowRefOrNull,
    getLocationRefOrNull,
    getGlobalThisRefOrNull,
    getLuxonGlobalRef,
    getRuntimeNowMs,
    setRuntimeInterval,
    clearRuntimeInterval,
    deferDynamicCall,
    setMultiRangeState,
    getNextFixedTimeSeed,
    setUiPreferencesState,
    getSignedInclusiveDaySpan,
    escapeHtmlViaSharedUtils,
    getRenderableTimezoneRowsFromTableRender,
    getMultiDisplayColumnHeaderFromTableRender,
    getTimezoneRefByIdFromSnapshotService,
    normalizeZoneAbbreviationViaSearch,
    getDefaultMultiSubgroupNameViaState,
    sanitizeMultiSubgroupIdViaState,
    getBaseTimeSnapshot,
    getFixedTimeSlotCountForGroupRef,
    confirmRuntime,
    getActiveCopyFormatKeysForCurrentContext,
    getActiveTimePartKeysForCurrentContext,
    getCurrentUiScalePercent,
    getFixedTimeSlotCountForCurrentGroup,
    getTimeAdjustDayStepValue,
    getRenderListRef,
    getSanitizeCopyFormatOrderForContextRef,
    getSanitizeCopyFormatEnabledForContextRef,
    getSanitizeTimePartsEnabledForContextRef,
    getShowToastRef,
    getRenderTimelineFrameRef,
    getUpdateClocksRef,
    getTranslatorRef,
    getSavePersistenceSafelyRef,
    getRenderFixedTimeTabRef,
    getRefreshFixedTimeSlotCountControlsRef,
    getAppStatePatcherServiceRef,
    getAppPersistenceStateServiceRef,
    getMainTimezoneRuntimeBridgeServiceRef,
    getMainTimezoneRuntimeServiceRef,
    getMainBaseTimezoneServiceRef,
    getMainTimezoneMutationServiceRef,
    getZoneMapRef,
    getTzDatabaseRef,
    getTimeServiceRef,
    getRandomValue,
    getGroupStateServiceRef,
    getTimeAdjustActionsServiceRef,
    getMultiBulkToolsServiceRef,
    getFixedTimeTableServiceRef,
    invokeRenderBaseTimeSelect,
    getMultiRangeCopyServiceRef,
    getMultiStateServiceRef,
    getMainClockOrchestratorServiceRef,
    getMainPersistenceSnapshotServiceRef,
    getFixedTimeCoreServiceRef,
    getFixedTimeActionsServiceRef,
    getTimelineFrameServiceRef,
    getFixedTimeTimelineServiceRef,
    getShowTimelineStateRef,
    getDisplayFormatOrderStateRef,
    getDisplayFormatEnabledStateRef,
    getDisplayTimePartsEnabledStateRef,
    getCopyFormatOrderStateRef,
    getCopyFormatEnabledStateRef,
    getCopyTimePartsEnabledStateRef,
    getFormatProfilesStateRef,
    getActiveFormatProfileContextStateRef,
    getCurrentThemeStateRef,
    getCurrentLangStateRef,
    resolveLocalDatePartsViaTimeService,
    buildStrictUtcDateFromPartsViaCore,
    setGlobalTimeValue,
    getSnapshotFormatServiceRef,
    getI18nDataRef,
    getImageExportBridgeServiceRef,
    createDefaultTableExportContext,
    getCanUseForeignObjectRendererRef,
    setCanUseForeignObjectRenderer,
    getImageExportActionsServiceRef,
    getImageExportNamingServiceRef,
    getMultiRangeTitleTextFromRenderService,
    buildTimezoneComputedSnapshotForDatesViaSnapshotService,
    formatSnapshotTextViaSnapshotService,
    sanitizeMultiSubgroupNameViaState,
    sanitizeMultiSubgroupNameForExport,
    buildStaticRowCellFromTableRender,
    buildDynamicRowCellFromTableRender,
    getRowFormattedTextViaSnapshotService,
    getRowCopyTextViaSnapshotService,
    applyFirstRangeStartAdjustAction,
    ensureGroupMultiSubgroupsViaState,
    createMultiSubgroupStateViaState,
    sanitizeMultiStatePayloadViaState,
    getPersistenceServiceRef,
    getTableRenderServiceRef,
    getCopyActionsServiceRef,
    getTimeAdjustUiServiceRef,
    getMultiRangeRenderServiceRef,
    getFormatControlsServiceRef,
    getTabUiServiceRef,
    getUiSettingsActionsServiceRef,
    getTimezoneSearchServiceRef,
    getGroupTabsServiceRef,
    getMainUiInitServiceRef,
    getTimerEngineServiceRef,
    getTimeCoreRef,
    getMainTimezoneFacadeServiceRef,
    getMainTimeAdjustFacadeServiceRef,
    getMainTimezoneTableFacadeServiceRef,
    getMainTimelineFacadeServiceRef,
    getMainFixedTimeFacadeServiceRef,
    getMainFixedTimeTabFacadeServiceRef,
    getMainMultiRangeTabFacadeServiceRef,
    getMainFoundationServicesRef,
    bindFacadeMethod,
    prepareExportCanvas,
    drawExportCellText,
    parseDateTimeParts,
    parseLocalDateTimeToUtcMs,
    getSignedDurationDayHourMinute,
    getTimeAdjustDayStepBySlotSnapshot,
    setTimeAdjustDayStepBySlotState,
    updateTimeAdjustPanelSafely,
    getUTCRef,
    getCurrentGroup,
    getCurrentGroupZones,
    getCurrentGroupBaseTimezoneId,
    getBaseTimezoneRef,
    ensureBaseTimezoneSelection,
    getZoneAbbreviation,
    getZoneDisplayNameForUiAtDate,
    getCustomOffsetMinutes,
    getLocalPartsByTimezone,
    getUTCDateFromLocalParts,
    formatUtcOffsetLabel,
    normalizeCustomAbbr,
    getCurrentMultiRangeStateSnapshot,
    isCurrentGroupUtcRowVisible,
    getCurrentGroupUtcRowOrder,
    getDefaultFixedTimeName,
    getDefaultFixedDate,
    getDefaultFixedTimes,
    sanitizeFixedTimeSlotCount,
    createDefaultFixedTimeSlot,
    sanitizeFixedTimeId,
    sanitizeFixedTimeName,
    sanitizeFixedTimeValue,
    sanitizeFixedDateValue,
    getFixedDatePartsFromGroup,
    sanitizeFixedTimes,
    ensureGroupFixedTimes,
    createUniqueFixedTimeId,
    isFixedTimeTab,
    isMultiTab,
    sanitizeMultiRangeCount,
    sanitizeMultiRangeTitle,
    getDefaultMultiRangeBounds,
    sanitizeMultiRangeItem,
    isMultiRangeStartEditEnabled,
    isMultiRangeEndEditEnabled,
    isMultiRangeStartLinked,
    ensureMultiRangeState,
    setMultiRangeStartEditEnabled,
    setMultiRangeEndEditEnabled,
    setAllMultiRangeStartEditEnabled,
    setAllMultiRangeEndEditEnabled,
    refreshMultiRangeControls,
    syncMultiRangeStartLinks,
    syncFollowingRangesByDuration,
    syncLinkedRangesFrom,
    setMultiRangeCount,
    getFixedTimeSlotCount,
    setCurrentGroupFixedDate,
    refreshFixedTimeSlotCountControls,
    setFixedTimeSlotCount,
    toggleMultiRangeCollapsed,
    setMultiRangesCollapsedBelow,
    getMultiRangeSlotDate,
    setMultiRangeSlotDate,
    sanitizeUiScalePercent,
    populateUiScaleSelect,
    sanitizeTheme,
    setCurrentLang,
    sanitizeMainTab,
    clampGroupIndex,
    normalizeGroupTabState,
    getPersistenceState,
    getGroupsStateSnapshot,
    getActiveGroupIdByMainTabStateSnapshot,
    patchPrimaryState,
    setCurrentMainTabState,
    setActiveGroupIdState,
    setActiveGroupIdByMainTabState,
    getActiveGroupNameSnapshot,
    setPersistenceState,
    getPatchedAppStateSnapshot,
    patchAppState,
    getPatchedStateValue,
    getPatchedIntegerStateValue,
    getPatchedBooleanStateValue,
    getPatchedStringStateValue,
    getPatchedArrayStateValue,
    getPatchedObjectStateValue,
    getPatchedMainTabState,
    getPatchedSlotCountState,
    setPatchedSlotCountState,
    getPatchedShowCopyFormatState,
    setPatchedShowCopyFormatState,
    getPatchedShowTimelineState,
    setPatchedShowTimelineState,
    getPatchedCurrentThemeState,
    getPatchedCurrentLangState,
    getPatchedDisplayFormatOrderState,
    getPatchedDisplayFormatEnabledState,
    getPatchedDisplayTimePartsEnabledState,
    getPatchedCopyFormatOrderState,
    getPatchedCopyFormatEnabledState,
    getPatchedCopyTimePartsEnabledState,
    getPatchedActiveFormatProfileContextState,
    getPatchedActiveGroupIdState,
    getPatchedMultiRangeCountState,
    getPatchedMultiRangesState,
    getPatchedMultiRangeCollapsedState,
    getPatchedTimeAdjustDayStepBySlotState,
    getPatchedMultiRangeTitleState,
    showFatalError,
    showToast,
    switchMainTab,
    refreshOptionToggleDividers,
    getCopyFieldLabel,
    getTimePartLabel,
    getDisplayColumns,
    getDisplayTimeInputMode,
    buildRowActionCells,
    renderList,
    renderTimelineFrame,
    resolveFixedTimeSlotUtcDate,
    getFixedTimeSlotHeaderLabel,
    renderFixedTimeTab,
    updateClocks,
    resolveLocalDatePartsByTimezoneAtDate,
    resolveLocalDatePartsByTimezone,
    buildStrictUtcDateFromParts,
    handleTimeChange,
    handleMultiRangeTimeChange,
    formatTimeTextByParts,
    formatSnapshotText,
    initCalculators,
    getPersistenceSnapshot,
    sanitizeGroup,
});

function resolveMainInternalForTest(name) {
    const key = String(name || "");
    if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key)) return null;
    return Object.prototype.hasOwnProperty.call(MAIN_TEST_HOOK_REGISTRY, key)
        ? MAIN_TEST_HOOK_REGISTRY[key]
        : null;
}

(function installMainTestHooks(globalObj) {
    if (!globalObj || !globalObj.__GTV_ENABLE_MAIN_TEST_HOOKS__) return;
    globalObj.__GTVMainTestHooks = Object.freeze({
        resolve(name) {
            return resolveMainInternalForTest(name);
        },
        invoke(name, ...args) {
            const fn = resolveMainInternalForTest(name);
            if (typeof fn !== "function") return undefined;
            return fn(...args);
        }
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- main.js 끝 ---

