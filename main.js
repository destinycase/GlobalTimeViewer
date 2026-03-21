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
let timeAdjustUiService = null;
let mainServiceMethodBridgeService = null;
let mainDirectStatePatchService = null;
let mainSharedUtilsService = null;
let mainTimezoneFacadeService = null;
let mainTimezoneTableFacadeService = null;
let mainTimeAdjustFacadeService = null;
let mainFixedTimeTabFacadeService = null;
let mainMultiRangeTabFacadeService = null;
let mainAppBootstrapService = null;
let appPersistenceStateService = null;
let appStatePatcherService = null;
let mainAppStateBridgeService = null;
let mainPatchedStateSelectorsService = null;
let persistenceServices = null;
let persistenceService = null;
let settingsIoService = null;
let dataTransferService = null;

const directStateSetters = {
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
};

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
    const message = (currentLang === "ko")
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

function assertRequiredServices() {
    if (requiredServicesAsserted) return;
    const requiredSpecs = [
        { serviceName: "persistenceService", methodName: "loadPersistence", serviceRef: () => persistenceService },
        { serviceName: "persistenceService", methodName: "savePersistence", serviceRef: () => persistenceService },
        { serviceName: "mainUiInitService", methodName: "initUI", serviceRef: () => mainUiInitService },
        { serviceName: "timezoneSearchService", methodName: "initSearchAndSelect", serviceRef: () => timezoneSearchService },
        { serviceName: "timerEngineService", methodName: "startRealtimeTicker", serviceRef: () => timerEngineService },
        { serviceName: "tabOrchestratorService", methodName: "switchMainTab", serviceRef: () => tabOrchestratorService },
        { serviceName: "mainClockOrchestratorService", methodName: "updateClocks", serviceRef: () => mainClockOrchestratorService },
        { serviceName: "mainPersistenceSnapshotService", methodName: "getPersistenceSnapshot", serviceRef: () => mainPersistenceSnapshotService },
        { serviceName: "mainTimezoneMutationService", methodName: "addTimezone", serviceRef: () => mainTimezoneMutationService },
        { serviceName: "mainTimezoneMutationService", methodName: "removeTimezone", serviceRef: () => mainTimezoneMutationService },
        { serviceName: "calculatorActionsService", methodName: "initCalculators", serviceRef: () => calculatorActionsService },
        { serviceName: "calculatorActionsService", methodName: "copyText", serviceRef: () => calculatorActionsService }
    ];

    const missing = [];
    requiredSpecs.forEach((spec) => {
        const serviceRef = (typeof spec.serviceRef === "function") ? spec.serviceRef() : null;
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
    GTV_MAIN_SHARED_UTILS,
    GTV_MAIN_SERVICE_METHOD_BRIDGE,
    GTV_MAIN_DIRECT_STATE_PATCH,
    GTV_MAIN_APP_STATE_SERVICES,
    GTV_MAIN_APP_STATE_BRIDGE,
    GTV_MAIN_PATCHED_STATE_SELECTORS,
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
mainServiceMethodBridgeService = GTV_MAIN_SERVICE_METHOD_BRIDGE.createService({
    onWarnMissingMethod: (serviceName, methodName) => {
        console.warn(`[GTV] ${serviceName}.${methodName} is unavailable. Fallback path will be used.`);
    },
    onMissingFeature: (featureKey) => {
        showMissingFeatureToastOnce(featureKey);
    }
});
mainDirectStatePatchService = GTV_MAIN_DIRECT_STATE_PATCH.createService({
    stateSetters: directStateSetters,
    setIsRealtimeState: (...args) => setIsRealtimeState(...args)
});
mainAppStateBridgeService = GTV_MAIN_APP_STATE_BRIDGE.createService({
    callServiceMethod,
    getAppStatePatcherService: () => appStatePatcherService,
    getAppPersistenceStateService: () => appPersistenceStateService,
    applyDirectStatePatch: (next = {}) => applyDirectStatePatch(next),
    serviceMethodMissingToken: SERVICE_METHOD_MISSING
});
mainSharedUtilsService = GTV_MAIN_SHARED_UTILS.createService({
    tableImageExportWidth: TABLE_IMAGE_EXPORT_WIDTH,
    createCanvas: () => {
        if (typeof document !== "object" || !document || typeof document.createElement !== "function") {
            return null;
        }
        return document.createElement("canvas");
    }
});
mainTimezoneFacadeService = GTV_MAIN_TIMEZONE_FACADE.createService({
    callServiceMethod,
    getMainTimezoneRuntimeBridgeService: () => mainTimezoneRuntimeBridgeService,
    getMainBaseTimezoneService: () => mainBaseTimezoneService,
    getMainTimezoneMutationService: () => mainTimezoneMutationService,
    getTimezoneSearchService: () => timezoneSearchService,
    getTimeCore: () => GTV_TIME_CORE
});
mainTimezoneTableFacadeService = GTV_MAIN_TIMEZONE_TABLE_FACADE.createService({
    callServiceMethod,
    getTableRenderService: () => tableRenderService,
    getMainTimezoneFacadeService: () => mainTimezoneFacadeService,
    getCopyActionsService: () => copyActionsService,
    isFixedTimeTab: () => isFixedTimeTab(),
    renderFixedTimeTab: () => renderFixedTimeTab()
});
mainTimeAdjustFacadeService = GTV_MAIN_TIME_ADJUST_FACADE.createService({
    callServiceMethod,
    getTimeAdjustUiService: () => timeAdjustUiService,
    getTimeAdjustActionsService: () => timeAdjustActionsService,
    getMultiBulkToolsService: () => multiBulkToolsService,
    getTimeAdjustDayStepBySlotSnapshot: () => getTimeAdjustDayStepBySlotSnapshot(),
    setTimeAdjustDayStepBySlotState: (nextValues = []) => setTimeAdjustDayStepBySlotState(nextValues),
    defaultTimeAdjustDayStep: DEFAULT_TIME_ADJUST_DAY_STEP,
    minTimeAdjustDayStep: MIN_TIME_ADJUST_DAY_STEP,
    maxTimeAdjustDayStep: MAX_TIME_ADJUST_DAY_STEP
});
mainFixedTimeTabFacadeService = GTV_MAIN_FIXED_TIME_TAB_FACADE.createService({
    callServiceMethod,
    getFixedTimeTableService: () => fixedTimeTableService,
    getCurrentGroup,
    ensureGroupFixedTimes,
    renderBaseTimeSelect: () => renderBaseTimeSelect(),
    renderFixedTimeControls: () => renderFixedTimeControls()
});
mainMultiRangeTabFacadeService = GTV_MAIN_MULTI_RANGE_TAB_FACADE.createService({
    callServiceMethod,
    getMultiRangeRenderService: () => multiRangeRenderService,
    getMultiRangeCopyService: () => multiRangeCopyService
});
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
    getGroups: () => getGroupsStateSnapshot(),
    getState: () => ({
        currentMainTab: getPatchedMainTabState(),
        activeGroupId: getPatchedActiveGroupIdState(),
        activeGroupIdByMainTab: getActiveGroupIdByMainTabStateSnapshot()
    }),
    setState: (next = {}) => {
        patchPrimaryState(next);
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
        currentMainTab: getPatchedMainTabState(),
        slotCount: getPatchedSlotCountState()
    }),
    setState: (next = {}) => {
        patchAppState(next);
    }
});
const multiRangeStateService = GTV_MULTI_RANGE_STATE.createService({
    MIN_MULTI_RANGE_COUNT,
    MAX_MULTI_RANGE_COUNT,
    DEFAULT_MULTI_RANGE_TITLE,
    t,
    showToast,
    sanitizeUtcMs: (value, fallbackMs) => GTV_TIME_CORE.sanitizeUtcMs(value, fallbackMs),
    getGlobalTimes: () => getGlobalTimesState(),
    getState: () => getCurrentMultiRangeStateSnapshot(),
    setState: (next = {}) => {
        patchAppState(next);
    },
    isMultiTab,
    renderMultiRanges: () => renderMultiRangesSafely(),
    savePersistence: (...args) => savePersistenceSafely(...args)
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
    savePersistence: (...args) => savePersistenceSafely(...args),
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
        uiScale: getUiScaleState(),
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
    shouldTick: () => getIsRealtimeState(),
    onTick: () => {
        setGlobalTimeState(0, new Date());
        updateClocks();
    },
    setIntervalFn: (cb, ms) => setInterval(cb, ms),
    clearIntervalFn: (id) => clearInterval(id)
});

// 상위 스코프에서 timeService를 1회 초기화
const timeService = GTV_TIME_SERVICE.createService({
    luxon: (typeof window !== "undefined" ? window.luxon : globalThis.luxon)
});

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
        currentLang
    );
}

function getTimeAdjustDayStepBySlotSnapshot() {
    return getPatchedTimeAdjustDayStepBySlotState();
}

function setTimeAdjustDayStepBySlotState(nextValues = []) {
    const safeValues = Array.isArray(nextValues) ? nextValues : [];
    patchPrimaryState({ timeAdjustDayStepBySlot: [...safeValues] });
}

function getTimeAdjustDayStep(slotIdx) {
    return mainTimeAdjustFacadeService.getTimeAdjustDayStep(slotIdx);
}

function setTimeAdjustDayStep(slotIdx, value) {
    return mainTimeAdjustFacadeService.setTimeAdjustDayStep(slotIdx, value);
}

function updateTimeAdjustPanelSafely() {
    return mainTimeAdjustFacadeService.updateTimeAdjustPanel();
}

function renderTimeAdjustSet(slotIdx, options = {}) {
    return mainTimeAdjustFacadeService.renderTimeAdjustSet(slotIdx, options);
}

function attachTimeAdjustToggleLabel(setEl, checked, text, onChange) {
    return mainTimeAdjustFacadeService.attachTimeAdjustToggleLabel(setEl, checked, text, onChange);
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

const mainTimezoneRuntimeBridgeService = GTV_MAIN_TIMEZONE_RUNTIME_BRIDGE.createService({
    callServiceMethod: (...args) => callServiceMethod(...args),
    getMainTimezoneRuntimeService: () => mainTimezoneRuntimeService,
    getGlobalTimeState: (slotIdx = 0) => getGlobalTimeState(slotIdx),
    getCurrentLangState: () => getPatchedCurrentLangState(),
    maxRuntimeCacheSize: MAX_RUNTIME_CACHE_SIZE
});
function getUtcMinuteCacheKey(date) {
    return mainTimezoneFacadeService.getUtcMinuteCacheKey(date);
}
function setCappedRuntimeCache(cache, key, value) {
    return mainTimezoneFacadeService.setCappedRuntimeCache(cache, key, value);
}
function getZoneAbbreviation(tz, date = getGlobalTimeState(0)) {
    return mainTimezoneFacadeService.getZoneAbbreviation(tz, date);
}
function getBetterAbbr(zone, date) {
    return mainTimezoneFacadeService.getBetterAbbr(zone, date);
}
function isTimeZoneInDST(zone, date) {
    return mainTimezoneFacadeService.isTimeZoneInDST(zone, date);
}
function getTimezoneOffset(zone, date) {
    return mainTimezoneFacadeService.getTimezoneOffset(zone, date);
}
function getFixedOffsetForDisplayAtDate(tz, anchorDate) {
    return mainTimezoneFacadeService.getFixedOffsetForDisplayAtDate(tz, anchorDate);
}
function getFixedOffsetForDisplay(tz) {
    return mainTimezoneFacadeService.getFixedOffsetForDisplay(tz);
}
function getLocalizedTZLabel(tzData) {
    return mainTimezoneFacadeService.getLocalizedTZLabel(tzData);
}
function getZoneDisplayName(tz) {
    return mainTimezoneFacadeService.getZoneDisplayName(tz);
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
    if (!trimmed) return t("label_custom");
    return trimmed.toUpperCase().slice(0, 12);
}
mainTimezoneRuntimeService = GTV_MAIN_TIMEZONE_RUNTIME_SERVICES.createService({
    maxRuntimeCacheSize: MAX_RUNTIME_CACHE_SIZE,
    timezoneOffsetCache,
    timezoneDstCache,
    zoneAbbrCache,
    getBaseTime: () => getGlobalTimeState(0),
    getZoneMap: () => ZONE_MAP,
    getTzDatabase: () => TZ_DATABASE,
    getTimeService: () => timeService,
    normalizeCustomAbbr: (...args) => normalizeCustomAbbr(...args),
    getTimezoneSearchService: () => timezoneSearchService,
    formatUtcOffsetLabel: (...args) => formatUtcOffsetLabel(...args),
    getCurrentLang: () => getPatchedCurrentLangState(),
    t,
    resolveLocalizedTZLabel: (tzData) => getLocalizedTZLabel(tzData)
});

function sanitizeTimezoneId(value) {
    return mainTimezoneFacadeService.sanitizeTimezoneId(value);
}

function sanitizeBaseTimezoneId(value) {
    return mainTimezoneFacadeService.sanitizeBaseTimezoneId(value);
}

function setCurrentGroupBaseTimezoneId(value) {
    return mainTimezoneFacadeService.setCurrentGroupBaseTimezoneId(value);
}

function applyCurrentGroupBaseTimezoneId(nextBaseId, options = {}) {
    return mainTimezoneFacadeService.applyCurrentGroupBaseTimezoneId(nextBaseId, options);
}

function getUsedTimezoneIds() {
    return mainTimezoneFacadeService.getUsedTimezoneIds();
}

function createUniqueTimezoneId(prefix = "tz") {
    return mainTimezoneFacadeService.createUniqueTimezoneId(prefix);
}

function getNextTimezoneIdSeed() {
    return mainTimezoneFacadeService.getNextTimezoneIdSeed();
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

mainBaseTimezoneService = GTV_MAIN_BASE_TIMEZONE_SERVICES.createService({
    getCurrentGroup,
    sanitizeBaseTimezoneId,
    renderList: () => renderList(),
    renderTimelineFrame: () => renderTimelineFrame(),
    updateTimeAdjustPanel: () => updateTimeAdjustPanelSafely(),
    savePersistence: (...args) => savePersistenceSafely(...args)
});

const mainGroupLocalizationServices = GTV_MAIN_GROUP_LOCALIZATION_SERVICES.createService({
    getGroups: () => getGroupsStateSnapshot(),
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
const mainOrchestrationFlowServices = GTV_MAIN_ORCHESTRATION_FLOW_SERVICES.createService({
    getMainClockOrchestratorService: () => mainClockOrchestratorService,
    getMainPersistenceSnapshotService: () => mainPersistenceSnapshotService,
    getMainGroupLocalizationService: () => mainGroupLocalizationServices,
    warnMissingServiceMethod
});
const {
    parseAutoGeneratedIndexedName,
    localizeAutoGeneratedNamesForCurrentLanguage,
    getCurrentMultiSubgroup,
    getCurrentMultiSubgroupName,
    syncCurrentMultiStateToActiveSubgroup,
    loadCurrentMultiStateFromActiveSubgroup
} = mainOrchestrationFlowServices;
mainTimezoneMutationService = GTV_MAIN_TIMEZONE_MUTATION_SERVICES.createService({
    getGroups: () => getGroupsStateSnapshot(),
    getCurrentGroup,
    getCurrentGroupBaseTimezoneId,
    sanitizeTimezoneId,
    getNextTimezoneIdSeed,
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
    savePersistence: (...args) => savePersistenceSafely(...args),
    renderList: () => renderList(),
    renderTimelineFrame: () => renderTimelineFrame()
});

function isCurrentGroupUtcRowVisible() {
    return groupContextStateService.isCurrentGroupUtcRowVisible();
}

function getCurrentGroupUtcRowOrder() {
    return groupContextStateService.getCurrentGroupUtcRowOrder();
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

function getFormatProfileAllowedKeys(context = getPatchedActiveFormatProfileContextState()) {
    return formatProfileStateService.getFormatProfileAllowedKeys(context);
}

function getFormatProfileAllowedTimePartKeys(context = getPatchedActiveFormatProfileContextState()) {
    return formatProfileStateService.getFormatProfileAllowedTimePartKeys(context);
}

function sanitizeCopyFormatOrderForContext(order, context = getPatchedActiveFormatProfileContextState()) {
    return formatProfileStateService.sanitizeCopyFormatOrderForContext(order, context);
}

function getDefaultFormatEnabledForContext(mode = "display", context = getPatchedActiveFormatProfileContextState()) {
    return formatProfileStateService.getDefaultFormatEnabledForContext(mode, context);
}

function sanitizeCopyFormatEnabledForContext(enabled, mode = "display", context = getPatchedActiveFormatProfileContextState()) {
    return formatProfileStateService.sanitizeCopyFormatEnabledForContext(enabled, mode, context);
}

function sanitizeTimePartsEnabledForContext(parts, mode = "display", context = getPatchedActiveFormatProfileContextState()) {
    return formatProfileStateService.sanitizeTimePartsEnabledForContext(parts, mode, context);
}

function createDefaultFormatProfile(context = "live") {
    return formatProfileStateService.createDefaultFormatProfile(context);
}

function sanitizeFormatProfile(profile, context = getPatchedActiveFormatProfileContextState()) {
    return formatProfileStateService.sanitizeFormatProfile(profile, context);
}

function sanitizeFormatProfiles(rawProfiles = null, legacyProfile = null) {
    return formatProfileStateService.sanitizeFormatProfiles(rawProfiles, legacyProfile);
}

function getCurrentFormatProfileState() {
    return formatProfileStateService.getCurrentFormatProfileState();
}

function resolveFormatProfileContext(tab = getPatchedMainTabState(), effectiveSlotCount = getPatchedSlotCountState()) {
    return formatProfileStateService.resolveFormatProfileContext(tab, effectiveSlotCount);
}

function ensureFormatProfiles(legacyProfile = null) {
    return formatProfileStateService.ensureFormatProfiles(legacyProfile);
}

function applyFormatProfileState(profile, context = getPatchedActiveFormatProfileContextState()) {
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

function renderMultiBulkToolSets() {
    return mainTimeAdjustFacadeService.renderMultiBulkToolSets();
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

function setGroupsState(nextGroups) {
    patchPrimaryState({ groups: nextGroups });
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
    savePersistence: (...args) => savePersistenceSafely(...args),
    t
});
const {
    adjustSelectWidthForContent,
    refreshSelectWidths,
    renderBaseTimeSelect
} = mainSelectServices;

// --- 그룹 데이터 구조 ---

const timezoneSearchService = GTV_TIMEZONE_SEARCH.createService({
    TZ_DATABASE,
    getZoneMap: () => ZONE_MAP,
    t,
    getCurrentLang: () => getPatchedCurrentLangState(),
    getBetterAbbr,
    getTimezoneOffset,
    getLocalizedTZLabel,
    adjustSelectWidthForContent,
    getCurrentGroup,
    savePersistence: (options = {}) => savePersistenceSafely(options),
    renderList,
    addTimezone,
    createUniqueTimezoneId
});


const snapshotFormatService = GTV_SNAPSHOT_FORMAT.createService({
    DEFAULT_COPY_TIME_PARTS_ENABLED,
    I18N_DATA,
    t,
    getCurrentLang: () => getPatchedCurrentLangState(),
    getUTCRef,
    getBaseTimezoneRef,
    getCurrentGroupZones,
    getGlobalTimes: () => getGlobalTimesState(),
    getSlotCount: () => getPatchedSlotCountState(),
    isRealtime: () => getIsRealtimeState(),
    getFixedOffsetForDisplay,
    normalizeCustomAbbr,
    getCustomOffsetMinutes,
    pad,
    getZoneAbbreviation,
    getZoneDisplayName,
    getSignedInclusiveDaySpan: (a, b) => timeService.getDaySpan(a, b),
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
const timeInputMutationsService = GTV_TIME_INPUT_MUTATIONS.createService({
    t: (...args) => t(...args),
    showToast: (...args) => showToast(...args),
    isRealtime: () => getIsRealtimeState(),
    isMultiTab,
    isMultiRangeStartEditEnabled,
    isMultiRangeEndEditEnabled,
    ensureMultiRangeState,
    getMultiRanges: () => getPatchedMultiRangesState(),
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
    getGlobalTime: (slotIdx) => getGlobalTimeState(slotIdx),
    setGlobalTime: (slotIdx, value) => {
        setGlobalTimeState(slotIdx, value);
    },
    updateClocks: (...args) => updateClocks(...args),
    renderList: (...args) => renderList(...args),
    renderMultiRanges: () => renderMultiRangesSafely(),
    savePersistence: (...args) => savePersistenceSafely(...args)
});

const mainRowOrderServices = GTV_MAIN_ROW_ORDER_SERVICES.createService({
    requestUiFrame,
    cancelUiFrame,
    getGroups: () => getGroupsStateSnapshot(),
    getActiveGroupId: () => getPatchedActiveGroupIdState(),
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
    getGlobalTime: (slotIdx) => getGlobalTimeState(slotIdx),
    getZoneDisplayName,
    getZoneDisplayNameForUiAtDate,
    getCurrentLang: () => getPatchedCurrentLangState(),
    getI18nData: () => I18N_DATA,
    isRealtime: () => getIsRealtimeState(),
    getSlotCount: () => getPatchedSlotCountState(),
    normalizeDayNightMarker: (...args) => normalizeDayNightMarker(...args),
    getDayNightGlyph: (...args) => getDayNightGlyph(...args),
    t
});
const { updateRow } = mainRowViewServices;

const tableRenderService = GTV_TABLE_RENDER.createService({
    t,
    sanitizeCopyFormatOrder,
    getDisplayFormatOrder: () => getPatchedDisplayFormatOrderState(),
    getDisplayFormatEnabled: () => getPatchedDisplayFormatEnabledState(),
    getDisplayTimePartsEnabled: () => getPatchedDisplayTimePartsEnabledState(),
    isRealtime: () => getIsRealtimeState(),
    getSlotCount: () => getPatchedSlotCountState(),
    isMultiTab,
    renderMultiRanges: () => renderMultiRangesSafely(),
    getBaseTimezoneRef,
    getGlobalTime: (slotIdx) => getGlobalTimeState(slotIdx),
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
    updateTimeAdjustPanel: () => updateTimeAdjustPanelSafely(),
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
    getMultiRanges: () => getPatchedMultiRangesState(),
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
    getCurrentLang: () => getPatchedCurrentLangState(),
    sanitizeFixedTimeValue,
    getFixedOffsetForDisplayAtDate,
    getLocalPartsByTimezone,
    getUTCDateFromLocalParts,
    pad,
    sanitizeTimePartsEnabledForContext,
    getDisplayTimePartsEnabled: () => getPatchedDisplayTimePartsEnabledState(),
    getDefaultFixedTimeName,
    sanitizeFixedTimeName,
    getFixedDateParts: () => getFixedDatePartsFromGroup(),
    getCurrentGroup,
    ensureGroupFixedTimes,
    getGlobalTime: (slotIdx) => getGlobalTimeState(slotIdx),
    resolveFixedTimeSlotUtcDate,
    clampNumber,
    getFixedTimeSlotCount,
    sanitizeFixedTimeId,
    getFixedTimeSlotHeaderLabel,
    sanitizeCopyFormatOrderForContext,
    sanitizeCopyFormatEnabledForContext,
    getCopyFormatOrder: () => getPatchedCopyFormatOrderState(),
    getCopyFormatEnabled: () => getPatchedCopyFormatEnabledState(),
    getCopyTimePartsEnabled: () => getPatchedCopyTimePartsEnabledState(),
    buildTimezoneComputedSnapshotForDates: (tz, slotDates, options = {}) =>
        snapshotFormatService.buildTimezoneComputedSnapshotForDates(tz, slotDates, options),
    formatSnapshotText: (snapshot, order, enabled, timePartsEnabled) =>
        snapshotFormatService.formatSnapshotText(snapshot, order, enabled, timePartsEnabled),
    getBaseTimezoneRef,
    getRenderableTimezoneRows: (baseRef) => tableRenderService.getRenderableTimezoneRows(baseRef),
    parseDateTimeParts,
    showToast: (...args) => showToast(...args),
    writeClipboard: async (text) => writeClipboardText(text),
    buildFixedTimeDisplayPayloadAtUtc,
    renderFixedTimeTab: (...args) => renderFixedTimeTab(...args),
    renderTimelineFrame: (...args) => renderTimelineFrame(...args),
    savePersistence: (...args) => savePersistenceSafely(...args),
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
    getCurrentLang: () => getPatchedCurrentLangState(),
    pad,
    getCustomOffsetMinutes,
    getFixedOffsetForDisplayAtDate,
    normalizeCustomAbbr,
    getZoneAbbreviation,
    getSignedInclusiveDaySpan: (a, b) => timeService.getDaySpan(a, b),
    getSignedDurationDayHourMinute,
    getZoneDisplayName,
    getZoneDisplayNameForUiAtDate,
    sanitizeMultiSubgroupName: (value, fallback = "") =>
        multiStateService.sanitizeMultiSubgroupName(value, fallback),
    getCurrentMultiSubgroupName,
    sanitizeMultiRangeTitle,
    getMultiRangeTitle: () => getPatchedMultiRangeTitleState(),
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
    getMultiRanges: () => getPatchedMultiRangesState(),
    getMultiRangeCollapsed: () => getPatchedMultiRangeCollapsedState(),
    getMultiRangeCount: () => getPatchedMultiRangeCountState(),
    buildTimezoneComputedSnapshotForDates: (tz, slotDates, options = {}) =>
        snapshotFormatService.buildTimezoneComputedSnapshotForDates(tz, slotDates, options),
    saveMultiRangeSingleImage,
    setMultiRangesCollapsedBelow,
    toggleMultiRangeCollapsed,
    renderTimeAdjustSet,
    applyMultiRangeTimeAdjustAction,
    attachTimeAdjustToggleLabel,
    setMultiRangeStartEditEnabled,
    setMultiRangeEndEditEnabled,
    getMultiDisplayColumnHeader: (colKey) => tableRenderService.getMultiDisplayColumnHeader(colKey),
    updateTimeAdjustPanel: () => updateTimeAdjustPanelSafely(),
    updateCopyFormatPreview,
    upgradeNativeTitleTooltips,
    showToast,
    getTimezoneRefById: (id) => snapshotFormatService.getTimezoneRefById(id),
    buildTimezoneComputedSnapshotForRange,
    formatSnapshotText,
    getCopyFormatOrder: () => getPatchedCopyFormatOrderState(),
    getCopyFormatEnabled: () => getPatchedCopyFormatEnabledState(),
    getCopyTimePartsEnabled: () => getPatchedCopyTimePartsEnabledState(),
    writeClipboard: async (text) => writeClipboardText(text),
    isShowCopyFormat: () => getPatchedShowCopyFormatState(),
    isMultiTab,
    isFixedTimeTab,
    getRowFormattedText: (rowOrId, order, enabled, timePartsEnabled = DEFAULT_COPY_TIME_PARTS_ENABLED) =>
        snapshotFormatService.getRowFormattedText(rowOrId, order, enabled, timePartsEnabled),
    getRowCopyText: (rowOrId) =>
        snapshotFormatService.getRowCopyText(rowOrId, {
            order: getPatchedCopyFormatOrderState(),
            enabled: getPatchedCopyFormatEnabledState(),
            timePartsEnabled: getPatchedCopyTimePartsEnabledState()
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
    savePersistence: (options = {}) => savePersistenceSafely(options),
    applyTimeAdjustAction,
    getCurrentMainTab: () => getPatchedMainTabState(),
    isRealtime: () => getIsRealtimeState(),
    getSlotCount: () => getPatchedSlotCountState(),
    getTimeAdjustDayStepValue: (slotIdx) => getTimeAdjustDayStepBySlotSnapshot()[slotIdx],
    setTimeAdjustDayStepValue: (slotIdx, value) => {
        const daySteps = [...getTimeAdjustDayStepBySlotSnapshot()];
        daySteps[slotIdx] = value;
        setTimeAdjustDayStepBySlotState(daySteps);
    },
    upgradeNativeTitleTooltips,
    getMultiRangeCount: () => getPatchedMultiRangeCountState(),
    applyBulkRangeAllAction,
    applyFirstRangeStartAdjustAction: (slotIdx, action) =>
        applyMultiRangeTimeAdjustAction(0, slotIdx, action),
    setAllMultiRangeStartEditEnabled,
    setAllMultiRangeEndEditEnabled,
    getGlobalTimes: () => getGlobalTimesState(),
    updateClocks: () => updateClocks(),
    getBaseTimezoneRef,
    getFixedOffsetForDisplay,
    getFixedOffsetForDisplayAtDate,
    getCustomOffsetMinutes,
    getTimeAdjustDayStep,
    timeService,
    sanitizeUtcMs: (...args) => GTV_TIME_CORE.sanitizeUtcMs(...args),
    ensureMultiRangeState,
    getMultiRanges: () => getPatchedMultiRangesState(),
    isMultiRangeStartLinked,
    isMultiTab,
    renderMultiRanges: () => renderMultiRangesSafely(),
    savePersistenceForce: () => savePersistenceSafely(),
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

const mainTabServices = GTV_MAIN_TAB_SERVICES.createService({
    GTV_FORMAT_CONTROLS,
    serviceBootstrap,
    COPY_FORMAT_KEYS,
    TIME_PART_KEYS,
    t,
    sanitizeCopyFormatOrder,
    renderList,
    updateCopyFormatPreview,
    savePersistence: (options = {}) => savePersistenceSafely(options),
    upgradeNativeTitleTooltips,
    isShowCopyFormat: () => getPatchedShowCopyFormatState(),
    getDisplayFormatOrder: () => getPatchedDisplayFormatOrderState(),
    setDisplayFormatOrder: (next) => {
        const context = getPatchedActiveFormatProfileContextState();
        patchAppState({
            displayFormatOrder: sanitizeCopyFormatOrderForContext(next, context)
        });
        syncActiveFormatProfileFromState();
    },
    getDisplayFormatEnabled: () => getPatchedDisplayFormatEnabledState(),
    setDisplayFormatEnabled: (next) => {
        const context = getPatchedActiveFormatProfileContextState();
        patchAppState({
            displayFormatEnabled: sanitizeCopyFormatEnabledForContext(next, "display", context)
        });
        syncActiveFormatProfileFromState();
    },
    getDisplayTimePartsEnabled: () => getPatchedDisplayTimePartsEnabledState(),
    setDisplayTimePartsEnabled: (next) => {
        const context = getPatchedActiveFormatProfileContextState();
        patchAppState({
            displayTimePartsEnabled: sanitizeTimePartsEnabledForContext(next, "display", context)
        });
        syncActiveFormatProfileFromState();
    },
    getCopyFormatOrder: () => getPatchedCopyFormatOrderState(),
    setCopyFormatOrder: (next) => {
        const context = getPatchedActiveFormatProfileContextState();
        patchAppState({
            copyFormatOrder: sanitizeCopyFormatOrderForContext(next, context)
        });
        syncActiveFormatProfileFromState();
    },
    getCopyFormatEnabled: () => getPatchedCopyFormatEnabledState(),
    setCopyFormatEnabled: (next) => {
        const context = getPatchedActiveFormatProfileContextState();
        patchAppState({
            copyFormatEnabled: sanitizeCopyFormatEnabledForContext(next, "copy", context)
        });
        syncActiveFormatProfileFromState();
    },
    getCopyTimePartsEnabled: () => getPatchedCopyTimePartsEnabledState(),
    setCopyTimePartsEnabled: (next) => {
        const context = getPatchedActiveFormatProfileContextState();
        patchAppState({
            copyTimePartsEnabled: sanitizeTimePartsEnabledForContext(next, "copy", context)
        });
        syncActiveFormatProfileFromState();
    },
    getActiveCopyFormatKeys: () => getFormatProfileAllowedKeys(getPatchedActiveFormatProfileContextState()),
    getActiveTimePartKeys: () => getFormatProfileAllowedTimePartKeys(getPatchedActiveFormatProfileContextState()),
    sanitizeMainTab,
    clampGroupIndex,
    normalizeGroupTabState,
    isMultiTab,
    isFixedTimeTab,
    getSlotCount: () => getPatchedSlotCountState(),
    getShowTimeline: () => getPatchedShowTimelineState(),
    getIsRealtime: () => getIsRealtimeState(),
    setIsRealtime: (next) => setIsRealtimeState(next),
    syncRealtimeNow: () => {
        setGlobalTimeState(0, new Date());
    },
    getCurrentMainTab: () => getPatchedMainTabState(),
    setCurrentMainTab: (next) => { setCurrentMainTabState(next); },
    getActiveGroupId: () => getPatchedActiveGroupIdState(),
    setActiveGroupId: (next) => { setActiveGroupIdState(next); },
    getActiveGroupIdByMainTab: () => getActiveGroupIdByMainTabStateSnapshot(),
    setActiveGroupIdByMainTab: (next) => { setActiveGroupIdByMainTabState(next); },
    hideFloatingTooltip,
    syncCurrentMultiStateToActiveSubgroup,
    refreshMultiRangeControls,
    renderBaseTimeSelect,
    loadCurrentMultiStateFromActiveSubgroup,
    renderGroups: () => groupTabsService.renderGroups(),
    renderMultiSubgroups: () => groupTabsService.renderMultiSubgroups(),
    renderMultiRanges: () => renderMultiRangesSafely(),
    renderFixedTimeTab,
    renderTimelineFrame,
    updateTimeAdjustPanel: () => updateTimeAdjustPanelSafely(),
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
    getGroups: () => getGroupsStateSnapshot(),
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
    getGroups: () => getGroupsStateSnapshot(),
    getActiveGroupId: () => getPatchedActiveGroupIdState(),
    t,
    getZoneAbbreviation,
    getBaseTime: () => getGlobalTimeState(0),
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
    getBaseTime: () => getGlobalTimeState(0),
    getActiveGroupName: () => getActiveGroupNameSnapshot(),
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
    getMultiRanges: () => getPatchedMultiRangesState(),
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
        isRealtime: getIsRealtimeState(),
        currentTheme,
        currentLang
    }),
    stateSetters: directStateSetters,
    setIsRealtimeState: (...args) => setIsRealtimeState(...args),
    syncActiveFormatProfileFromState: (...args) => syncActiveFormatProfileFromState(...args),
    ensureFormatProfiles: (...args) => ensureFormatProfiles(...args),
    getCurrentFormatProfileState: (...args) => getCurrentFormatProfileState(...args),
    resolveFormatProfileContext: (...args) => resolveFormatProfileContext(...args),
    applyFormatProfileState: (...args) => applyFormatProfileState(...args)
});
appStatePatcherService = mainAppStateServices.appStatePatcherService;
appPersistenceStateService = mainAppStateServices.appPersistenceStateService;
mainPatchedStateSelectorsService = GTV_MAIN_PATCHED_STATE_SELECTORS.createService({
    getPatchedStateValue: (key, fallbackValue) => mainAppStateBridgeService.getPatchedStateValue(key, fallbackValue),
    getPatchedIntegerStateValue: (key, fallbackValue = 0) =>
        mainAppStateBridgeService.getPatchedIntegerStateValue(key, fallbackValue),
    getPatchedBooleanStateValue: (key, fallbackValue = false) =>
        mainAppStateBridgeService.getPatchedBooleanStateValue(key, fallbackValue),
    getPatchedStringStateValue: (key, fallbackValue = "") =>
        mainAppStateBridgeService.getPatchedStringStateValue(key, fallbackValue),
    getPatchedArrayStateValue: (key, fallbackValue = []) =>
        mainAppStateBridgeService.getPatchedArrayStateValue(key, fallbackValue),
    getPatchedObjectStateValue: (key, fallbackValue = {}) =>
        mainAppStateBridgeService.getPatchedObjectStateValue(key, fallbackValue),
    patchAppState: (next = {}) => mainAppStateBridgeService.patchAppState(next),
    getFallbackState: () => ({
        currentMainTab,
        slotCount,
        showCopyFormat,
        showTimeline,
        currentTheme,
        currentLang,
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
    })
});
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

const mainPersistenceCompositionServices = GTV_MAIN_PERSISTENCE_COMPOSITION_SERVICES.createService({
    GTV_MAIN_GROUP_TABS_SERVICE,
    GTV_MAIN_PERSISTENCE_SNAPSHOT_SERVICES,
    GTV_MAIN_PERSISTENCE_SERVICES,
    groupTabsConfig: {
        GTV_GROUP_TABS,
        t,
        showToast,
        confirmFn: (...args) => mainFoundationServices.confirmFn(...args),
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
        renderMultiRanges: () => renderMultiRangesSafely(),
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
        getGroups: () => getGroupsStateSnapshot(),
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
        getCurrentUiScalePercent: () => Math.round(getUiScaleState() * 100),
        refreshMultiRangeControls,
        updateTZDropdown: () => timezoneSearchService.updateTZDropdown(),
        refreshSelectWidths,
        switchMainTab,
        showToast,
        t,
        confirmFn: (...args) => mainFoundationServices.confirmFn(...args),
        tFormat,
        applyVersionBranding,
        getGroups: () => getGroupsStateSnapshot(),
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
        renderMultiRanges: () => renderMultiRangesSafely(),
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
        getIsRealtime: () => getIsRealtimeState(),
        getSlotCount: () => getPatchedSlotCountState(),
        getGlobalTime: (slotIdx) => getGlobalTimeState(slotIdx),
        setGlobalTime: (slotIdx, value) => {
            setGlobalTimeState(slotIdx, value);
        },
        getCurrentLang: () => getPatchedCurrentLangState(),
        getCurrentTheme: () => getPatchedCurrentThemeState(),
        getUiScale: () => getUiScaleState(),
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
        getDisplayFormatOrder: () => getPatchedDisplayFormatOrderState(),
        getDisplayFormatEnabled: () => getPatchedDisplayFormatEnabledState(),
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
mainAppBootstrapService = GTV_MAIN_APP_BOOTSTRAP.createService({
    assertRequiredServices,
    loadPersistence,
    localizeAutoGeneratedNamesForCurrentLanguage,
    savePersistenceSafely: () => savePersistenceSafely(),
    loadCurrentMultiStateFromActiveSubgroup,
    loadThemePreference,
    applyTheme,
    loadUiScalePreference,
    applyUiScale,
    applyTranslations,
    applyVersionBranding,
    initUI: () => mainUiInitService.initUI(),
    bindFloatingTooltipEvents,
    initDragAndDrop,
    initSearchAndSelect: () => timezoneSearchService.initSearchAndSelect(),
    initCalculators,
    startRealtimeTicker: () => timerEngineService.startRealtimeTicker(),
    switchMainTab,
    getCurrentMainTab: () => getPatchedMainTabState(),
    updateClocks,
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

function sanitizeTimeAdjustDayStep(value) {
    return mainTimeAdjustFacadeService.sanitizeTimeAdjustDayStep(value);
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

function buildTimezoneComputedSnapshotForRange(tz, startDate, endDate) {
    return mainMultiRangeTabFacadeService.buildTimezoneComputedSnapshotForRange(tz, startDate, endDate);
}

function applySnapshotToRow(row, snapshot) {
    return mainMultiRangeTabFacadeService.applySnapshotToRow(row, snapshot);
}

function formatRangeDurationText(startUtcMs, endUtcMs) {
    return mainMultiRangeTabFacadeService.formatRangeDurationText(startUtcMs, endUtcMs);
}

// --- 목록 렌더링(동적 슬롯) ---
function renderList() {
    return mainTimezoneTableFacadeService.renderList();
}

function resolveTimeAdjustZoneAndOffset(baseRef, fixedOffsetMinutes = null) {
    return mainTimeAdjustFacadeService.resolveTimeAdjustZoneAndOffset(baseRef, fixedOffsetMinutes);
}








function applyTimeAdjustAction(slotIdx, action) {
    return mainTimeAdjustFacadeService.applyTimeAdjustAction(slotIdx, action);
}

function getAdjustedUtcDateByAction(baseDate, action, slotIdx, baseRef, fixedOffsetMinutes) {
    return mainTimeAdjustFacadeService.getAdjustedUtcDateByAction(
        baseDate,
        action,
        slotIdx,
        baseRef,
        fixedOffsetMinutes
    );
}

function applyBulkRangeAllAction(slotIdx, action) {
    return mainTimeAdjustFacadeService.applyBulkRangeAllAction(slotIdx, action);
}

function applyMultiRangeTimeAdjustAction(rangeIdx, slotIdx, action) {
    return mainTimeAdjustFacadeService.applyMultiRangeTimeAdjustAction(rangeIdx, slotIdx, action);
}


function isTimelineSupportedTab() {
    const mainTab = getPatchedMainTabState();
    return mainTab === "live" || mainTab === "fixed" || mainTab === "fixed-time";
}

function shouldRenderTimeline() {
    return !!callServiceMethod(
        "timelineFrameService",
        timelineFrameService,
        "shouldRenderTimeline",
        [],
        { fallback: !!showTimeline && isTimelineSupportedTab() && !isMultiTab() }
    );
}

function resolveFixedTimeTimelineSourceDate(slotIdx, baseRef, anchorDate = getGlobalTimeState(0)) {
    return callServiceMethod(
        "fixedTimeTimelineService",
        fixedTimeTimelineService,
        "resolveFixedTimeTimelineSourceDate",
        [slotIdx, baseRef, anchorDate],
        { fallback: null }
    );
}

function applyFixedTimeSlotTimelineRatio(slotIdx, ratio) {
    return callServiceMethod(
        "fixedTimeTimelineService",
        fixedTimeTimelineService,
        "applyFixedTimeSlotTimelineRatio",
        [slotIdx, ratio],
        { fallback: false }
    );
}

function getFixedTimeTimelineSlots() {
    return callServiceMethod(
        "fixedTimeTimelineService",
        fixedTimeTimelineService,
        "getFixedTimeTimelineSlots",
        [],
        { fallback: [] }
    );
}

function getFixedTimeTimelineSlotCount() {
    return callServiceMethod(
        "fixedTimeTimelineService",
        fixedTimeTimelineService,
        "getFixedTimeTimelineSlotCount",
        [],
        { fallback: getFixedTimeSlotCount(getCurrentGroup()) }
    );
}

function getFixedTimeTimelineIndicatorToken() {
    return callServiceMethod(
        "fixedTimeTimelineService",
        fixedTimeTimelineService,
        "getFixedTimeTimelineIndicatorToken",
        [],
        { fallback: "" }
    );
}

function getFixedTimeSlotTimelineLabel(slot, slotIdx, slotCount = 1) {
    return callServiceMethod(
        "fixedTimeTimelineService",
        fixedTimeTimelineService,
        "getFixedTimeSlotTimelineLabel",
        [slot, slotIdx, slotCount],
        { fallback: getFixedTimeSlotHeaderLabel(slot, slotIdx, slotCount) }
    );
}

function getFixedTimeTimelineIndicatorColor(slotIdx) {
    const fallbackPalette = ["#ff4d4d", "#3b82f6", "#14b8a6", "#f59e0b", "#a855f7"];
    return callServiceMethod(
        "fixedTimeCoreService",
        fixedTimeCoreService,
        "getFixedTimeTimelineIndicatorColor",
        [slotIdx],
        { fallback: fallbackPalette[slotIdx % fallbackPalette.length] }
    );
}

function stopTimelineDrag() {
    return callServiceMethod(
        "timelineFrameService",
        timelineFrameService,
        "stopTimelineDrag",
        []
    );
}

function normalizeDayNightMarker(marker) {
    const raw = String(marker || "").trim();
    const normalized = raw.toUpperCase();
    return callServiceMethod(
        "fixedTimeCoreService",
        fixedTimeCoreService,
        "normalizeDayNightMarker",
        [marker],
        {
            fallback: (!raw)
                ? ""
                : ((normalized === "DAY" || raw === "\u2600\uFE0F")
                    ? "DAY"
                    : ((normalized === "NIGHT" || normalized === "MOON" || raw === "\uD83C\uDF19") ? "NIGHT" : ""))
        }
    );
}

function getDayNightGlyph(marker) {
    return callServiceMethod(
        "fixedTimeCoreService",
        fixedTimeCoreService,
        "getDayNightGlyph",
        [marker],
        { fallback: String(marker || "") }
    );
}

function applyTimelineRatioToSlot(slotIdx, ratio, baseRef, options = {}) {
    return callServiceMethod(
        "timelineFrameService",
        timelineFrameService,
        "applyTimelineRatioToSlot",
        [slotIdx, ratio, baseRef, options]
    );
}

function getTimelineIndicatorLabel(slotIdx) {
    return callServiceMethod(
        "timelineFrameService",
        timelineFrameService,
        "getTimelineIndicatorLabel",
        [slotIdx],
        {
            fallback: (() => {
                const showRangeLabels = getPatchedMainTabState() === "fixed"
                    && !getIsRealtimeState()
                    && getPatchedSlotCountState() > 1;
                if (showRangeLabels) {
                    return t(slotIdx === 0 ? "th_time_day_start" : "th_time_day_end");
                }
                return t("th_time_day_main");
            })()
        }
    );
}

function getTimelinePanelCount() {
    return callServiceMethod(
        "timelineFrameService",
        timelineFrameService,
        "getTimelinePanelCount",
        [],
        { fallback: (isFixedTimeTab() || getIsRealtimeState() || getPatchedSlotCountState() <= 1) ? 1 : 2 }
    );
}

function renderTimelineFrame() {
    return callServiceMethod(
        "timelineFrameService",
        timelineFrameService,
        "renderTimelineFrame",
        []
    );
}

function getFixedTimeSlotParts(slot) {
    return callServiceMethod(
        "fixedTimeCoreService",
        fixedTimeCoreService,
        "getFixedTimeSlotParts",
        [slot],
        { fallback: null }
    );
}

function resolveFixedTimeSlotUtcDate(slot, baseRef, anchorDate = getGlobalTimeState(0)) {
    return callServiceMethod(
        "fixedTimeCoreService",
        fixedTimeCoreService,
        "resolveFixedTimeSlotUtcDate",
        [slot, baseRef, anchorDate],
        { fallback: null }
    );
}

function formatFixedTimeForTimezoneAtUtc(utcDate, tz) {
    return callServiceMethod(
        "fixedTimeCoreService",
        fixedTimeCoreService,
        "formatFixedTimeForTimezoneAtUtc",
        [utcDate, tz],
        { fallback: "--:--:--" }
    );
}

function getFixedTimeDisplayPartsEnabled() {
    return callServiceMethod(
        "fixedTimeCoreService",
        fixedTimeCoreService,
        "getFixedTimeDisplayPartsEnabled",
        [],
        { fallback: { dn: true, time: true, weekday: true } }
    );
}

function getLocalizedWeekdayNameByIndex(weekdayIndex) {
    return callServiceMethod(
        "fixedTimeCoreService",
        fixedTimeCoreService,
        "getLocalizedWeekdayNameByIndex",
        [weekdayIndex],
        { fallback: "" }
    );
}

function buildFixedTimeDisplayPayloadAtUtc(utcDate, tz) {
    return callServiceMethod(
        "fixedTimeCoreService",
        fixedTimeCoreService,
        "buildFixedTimeDisplayPayloadAtUtc",
        [utcDate, tz],
        { fallback: null }
    );
}

function getFixedTimeSlotHeaderLabel(slot, slotIdx, slotCount = 1) {
    return callServiceMethod(
        "fixedTimeCoreService",
        fixedTimeCoreService,
        "getFixedTimeSlotHeaderLabel",
        [slot, slotIdx, slotCount],
        { fallback: `${t("th_fixed_time")} ${slotIdx + 1}` }
    );
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
    return callServiceMethod(
        "fixedTimeActionsService",
        fixedTimeActionsService,
        "formatFixedTimePayloadText",
        [payload, partsEnabled],
        { fallback: "-" }
    );
}

function getFixedTimeCopyState() {
    return callServiceMethod(
        "fixedTimeActionsService",
        fixedTimeActionsService,
        "getFixedTimeCopyState",
        [],
        {
            fallback: {
                order: sanitizeCopyFormatOrderForContext(copyFormatOrder, "fixed-time"),
                enabled: sanitizeCopyFormatEnabledForContext(copyFormatEnabled, "copy", "fixed-time"),
                timePartsEnabled: sanitizeTimePartsEnabledForContext(copyTimePartsEnabled, "copy", "fixed-time")
            }
        }
    );
}

function buildFixedTimeSnapshotForTimezoneSlot(tz, slotUtcDate) {
    return callServiceMethod(
        "fixedTimeActionsService",
        fixedTimeActionsService,
        "buildFixedTimeSnapshotForTimezoneSlot",
        [tz, slotUtcDate],
        { fallback: null }
    );
}

function formatFixedTimeCopyTextForTimezoneSlot(tz, slotUtcDate, copyState = null) {
    return callServiceMethod(
        "fixedTimeActionsService",
        fixedTimeActionsService,
        "formatFixedTimeCopyTextForTimezoneSlot",
        [tz, slotUtcDate, copyState],
        { fallback: "" }
    );
}

function getFixedTimeSlotUtcDateByIndex(slotIdx) {
    return callServiceMethod(
        "fixedTimeActionsService",
        fixedTimeActionsService,
        "getFixedTimeSlotUtcDateByIndex",
        [slotIdx],
        { fallback: null }
    );
}

function getFixedTimePreviewCopyText() {
    return callServiceMethod(
        "fixedTimeActionsService",
        fixedTimeActionsService,
        "getFixedTimePreviewCopyText",
        [],
        { fallback: "" }
    );
}

function getAllFixedTimeRowsCopyText() {
    return callServiceMethod(
        "fixedTimeActionsService",
        fixedTimeActionsService,
        "getAllFixedTimeRowsCopyText",
        [],
        { fallback: "" }
    );
}

async function copyFixedTimeCellPayload(payload, partsEnabled) {
    return callServiceMethod(
        "fixedTimeActionsService",
        fixedTimeActionsService,
        "copyFixedTimeCellPayload",
        [payload, partsEnabled],
        { toastOnMissing: true, featureKey: "fixed-time-copy-cell" }
    );
}

async function copyFixedTimeCellByTimezone(tz, slotUtcDate) {
    return callServiceMethod(
        "fixedTimeActionsService",
        fixedTimeActionsService,
        "copyFixedTimeCellByTimezone",
        [tz, slotUtcDate],
        { toastOnMissing: true, featureKey: "fixed-time-copy-timezone" }
    );
}

function buildFixedTimeCellInputValue(utcDate, tz) {
    return callServiceMethod(
        "fixedTimeActionsService",
        fixedTimeActionsService,
        "buildFixedTimeCellInputValue",
        [utcDate, tz],
        { fallback: "" }
    );
}

function buildFixedTimeCellTimeParts(rawValue) {
    return callServiceMethod(
        "fixedTimeActionsService",
        fixedTimeActionsService,
        "buildFixedTimeCellTimeParts",
        [rawValue],
        { fallback: null }
    );
}

function applyFixedTimeSlotByTimezoneInput(slotIdx, tz, rawValue, anchorUtcDate) {
    return callServiceMethod(
        "fixedTimeActionsService",
        fixedTimeActionsService,
        "applyFixedTimeSlotByTimezoneInput",
        [slotIdx, tz, rawValue, anchorUtcDate],
        { fallback: false, toastOnMissing: true, featureKey: "fixed-time-apply-input" }
    );
}

function bindCustomDatePickerForInput(input, triggerBtn, options = {}) {
    const CustomDatePickerCtor = window.CustomDatePicker;
    if (!CustomDatePickerCtor) {
        console.warn("CustomDatePicker module is unavailable. Date picker binding is skipped.");
        return;
    }
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
    return callServiceMethod(
        "fixedTimeActionsService",
        fixedTimeActionsService,
        "copyFixedTimeSlotColumn",
        [slotIdx],
        { toastOnMissing: true, featureKey: "fixed-time-copy-column" }
    );
}

function renameFixedTimeSlot(slotIdx) {
    return callServiceMethod(
        "fixedTimeActionsService",
        fixedTimeActionsService,
        "renameFixedTimeSlot",
        [slotIdx],
        { toastOnMissing: true, featureKey: "fixed-time-rename-slot" }
    );
}

function updateFixedTimeSlotTime(slotIdx, rawValue) {
    return callServiceMethod(
        "fixedTimeActionsService",
        fixedTimeActionsService,
        "updateFixedTimeSlotTime",
        [slotIdx, rawValue],
        { fallback: false, toastOnMissing: true, featureKey: "fixed-time-update-slot" }
    );
}

function addFixedTimeSlot() {
    return callServiceMethod(
        "fixedTimeActionsService",
        fixedTimeActionsService,
        "addFixedTimeSlot",
        [],
        { toastOnMissing: true, featureKey: "fixed-time-add-slot" }
    );
}

function removeFixedTimeSlot(slotId) {
    return callServiceMethod(
        "fixedTimeActionsService",
        fixedTimeActionsService,
        "removeFixedTimeSlot",
        [slotId],
        { toastOnMissing: true, featureKey: "fixed-time-remove-slot" }
    );
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
    return mainFixedTimeTabFacadeService.getFixedTimeSlotLayoutMetrics(partsEnabled);
}

function getFixedTimeDisplayColumns() {
    return mainFixedTimeTabFacadeService.getFixedTimeDisplayColumns();
}

function getFixedTimeOffsetTextAtDate(tz, anchorDate) {
    return mainFixedTimeTabFacadeService.getFixedTimeOffsetTextAtDate(tz, anchorDate);
}

function renderFixedTimeTable() {
    return mainFixedTimeTabFacadeService.renderFixedTimeTable();
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

function createStandardTimezoneFromSelectableEntry(entry) {
    return mainTimezoneTableFacadeService.createStandardTimezoneFromSelectableEntry(entry);
}

function addTimezone(tz) {
    return mainTimezoneTableFacadeService.addTimezone(tz);
}
function removeTimezone(id) {
    return mainTimezoneTableFacadeService.removeTimezone(id);
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
    return mainTimezoneTableFacadeService.updateCopyFormatPreview();
}

async function copyAllTimezones() {
    return await mainTimezoneTableFacadeService.copyAllTimezones();
}

async function copyMultiRangeRow(rangeIdx, rowId) {
    return await mainMultiRangeTabFacadeService.copyMultiRangeRow(rangeIdx, rowId);
}

async function copyAllMultiRangeTimezones() {
    return await mainMultiRangeTabFacadeService.copyAllMultiRangeTimezones();
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

// --- main.js 끝 ---







