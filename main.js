let isRealtime = true;
const GTV_GLOBAL = (typeof window !== "undefined" && window) ? window : globalThis;
let mainRuntimeLangStateService = null;
let mainDayNightRangeUtilsService = null;
let mainRuntimeCoreAccessorService = null;
function syncRealtimeFlagToGlobal(value) {
    if (typeof mainRuntimeCoreAccessorService?.syncRealtimeFlagToGlobal === "function") {
        return mainRuntimeCoreAccessorService.syncRealtimeFlagToGlobal(value);
    }
    return mainRuntimeLangStateService.syncRealtimeFlagToGlobal(value);
}
let globalTimes = [new Date(), new Date()];
let slotCount = 1;
let uiScale = 1.0;
let showCopyFormat = false;
let showTimeline = false;
const fallbackTranslate = (key) => String(key ?? "");
const resolveTranslate = () => (typeof GTV_GLOBAL.t === "function" ? GTV_GLOBAL.t : fallbackTranslate);
const gtvT = (...args) => resolveTranslate()(...args);
const MAIN_I18N_DATA = (GTV_GLOBAL.I18N_DATA && typeof GTV_GLOBAL.I18N_DATA === "object")
    ? GTV_GLOBAL.I18N_DATA
    : { ko: {}, en: {} };
function assertBindingCreateService(bindingsModule, moduleApiName) {
    if (!bindingsModule || typeof bindingsModule.createService !== "function") {
        throw new Error(`Missing required module API: ${moduleApiName}.createService`);
    }
}
function getRuntimeCurrentLangValue() {
    if (typeof mainRuntimeCoreAccessorService?.getRuntimeCurrentLangValue === "function") {
        return mainRuntimeCoreAccessorService.getRuntimeCurrentLangValue();
    }
    return mainRuntimeLangStateService.getRuntimeCurrentLangValue();
}

function syncCurrentLang(next) {
    if (typeof mainRuntimeCoreAccessorService?.syncCurrentLang === "function") {
        return mainRuntimeCoreAccessorService.syncCurrentLang(next);
    }
    return mainRuntimeLangStateService.syncCurrentLang(next);
}
const GTV_MAIN_CONSTANTS = GTV_GLOBAL.GTVMainConstants;
const GTV_MAIN_CONSTANTS_BINDINGS = GTV_GLOBAL.GTVMainConstantsBindings;
assertBindingCreateService(GTV_MAIN_CONSTANTS_BINDINGS, "GTVMainConstantsBindings");
const {
    COPY_FORMAT_KEYS,
    TIME_PART_KEYS,
    PERIOD_RESULT_IDS,
    TIMELINE_TOTAL_HOURS,
    TIMELINE_TOTAL_SECONDS,
    MAIN_TABS,
    MIN_TIME_ADJUST_DAY_STEP,
    MAX_TIME_ADJUST_DAY_STEP,
    DEFAULT_TIME_ADJUST_DAY_STEP,
    MIN_MULTI_RANGE_COUNT,
    MAX_MULTI_RANGE_COUNT,
    MIN_FIXED_TIME_SLOT_COUNT,
    MAX_FIXED_TIME_SLOT_COUNT,
    DEFAULT_FIXED_TIME_VALUE,
    DEFAULT_DAY_START_HOUR,
    DEFAULT_NIGHT_START_HOUR,
    DAY_NIGHT_HOUR_OPTIONS,
    DEFAULT_MULTI_RANGE_TITLE,
    DEFAULT_DISPLAY_FORMAT_ENABLED,
    DEFAULT_COPY_FORMAT_ENABLED,
    DEFAULT_DISPLAY_TIME_PARTS_ENABLED,
    DEFAULT_COPY_TIME_PARTS_ENABLED,
    FORMAT_PROFILE_CONTEXT_KEYS
} = GTV_MAIN_CONSTANTS_BINDINGS.createService({
    constantsModule: GTV_MAIN_CONSTANTS
});
const DEFAULT_REALTIME_TICK_MS = 1000;
const requestUiFrame = (typeof requestAnimationFrame === "function")
    ? requestAnimationFrame.bind(globalThis)
    : ((cb) => setTimeout(cb, 16));
const cancelUiFrame = (typeof cancelAnimationFrame === "function")
    ? cancelAnimationFrame.bind(globalThis)
    : ((id) => clearTimeout(id));
const GTV_MAIN_RUNTIME_LANG_STATE = GTV_GLOBAL.GTVMainRuntimeLangState;
const GTV_MAIN_RUNTIME_LANG_STATE_BINDINGS = GTV_GLOBAL.GTVMainRuntimeLangStateBindings;
assertBindingCreateService(GTV_MAIN_RUNTIME_LANG_STATE_BINDINGS, "GTVMainRuntimeLangStateBindings");
({
    mainRuntimeLangStateService
} = GTV_MAIN_RUNTIME_LANG_STATE_BINDINGS.createService({
    runtimeLangStateModule: GTV_MAIN_RUNTIME_LANG_STATE,
    globalRef: GTV_GLOBAL,
    defaultLang: "ko"
}));
getRuntimeCurrentLangValue();
const GTV_MAIN_DAY_NIGHT_RANGE_UTILS = GTV_GLOBAL.GTVMainDayNightRangeUtils;
const GTV_MAIN_DAY_NIGHT_RANGE_UTILS_BINDINGS = GTV_GLOBAL.GTVMainDayNightRangeUtilsBindings;
assertBindingCreateService(GTV_MAIN_DAY_NIGHT_RANGE_UTILS_BINDINGS, "GTVMainDayNightRangeUtilsBindings");
({
    mainDayNightRangeUtilsService
} = GTV_MAIN_DAY_NIGHT_RANGE_UTILS_BINDINGS.createService({
    dayNightRangeUtilsModule: GTV_MAIN_DAY_NIGHT_RANGE_UTILS,
    defaultDayStartHour: DEFAULT_DAY_START_HOUR,
    defaultNightStartHour: DEFAULT_NIGHT_START_HOUR,
    dayNightHourOptions: DAY_NIGHT_HOUR_OPTIONS
}));
const GTV_MAIN_APP_STATE_VARS = GTV_GLOBAL.GTVMainAppStateVars;
const GTV_MAIN_APP_STATE_VARS_BINDINGS = GTV_GLOBAL.GTVMainAppStateVarsBindings;
assertBindingCreateService(GTV_MAIN_APP_STATE_VARS_BINDINGS, "GTVMainAppStateVarsBindings");
const {
    mainAppStateVarsService
} = GTV_MAIN_APP_STATE_VARS_BINDINGS.createService({
    appStateVarsModule: GTV_MAIN_APP_STATE_VARS,
    t: gtvT,
    copyFormatKeys: COPY_FORMAT_KEYS,
    defaultDisplayFormatEnabled: DEFAULT_DISPLAY_FORMAT_ENABLED,
    defaultCopyFormatEnabled: DEFAULT_COPY_FORMAT_ENABLED,
    defaultDisplayTimePartsEnabled: DEFAULT_DISPLAY_TIME_PARTS_ENABLED,
    defaultCopyTimePartsEnabled: DEFAULT_COPY_TIME_PARTS_ENABLED,
    defaultTimeAdjustDayStep: DEFAULT_TIME_ADJUST_DAY_STEP,
    defaultDayStartHour: DEFAULT_DAY_START_HOUR,
    defaultNightStartHour: DEFAULT_NIGHT_START_HOUR
});
const GTV_MAIN_STATE_INITIALIZER = GTV_GLOBAL.GTVMainStateInitializer;
const GTV_MAIN_STATE_INITIALIZER_BINDINGS = GTV_GLOBAL.GTVMainStateInitializerBindings;
assertBindingCreateService(GTV_MAIN_STATE_INITIALIZER_BINDINGS, "GTVMainStateInitializerBindings");
const {
    mainStateInitializerService
} = GTV_MAIN_STATE_INITIALIZER_BINDINGS.createService({
    stateInitializerModule: GTV_MAIN_STATE_INITIALIZER
});
const initialMainState = (mainAppStateVarsService && typeof mainAppStateVarsService === "object")
    ? (mainAppStateVarsService.initialState || {})
    : {};
function sanitizeDayNightHourValue(value, fallbackHour = DEFAULT_DAY_START_HOUR) {
    if (typeof mainRuntimeCoreAccessorService?.sanitizeDayNightHourValue === "function") {
        return mainRuntimeCoreAccessorService.sanitizeDayNightHourValue(value, fallbackHour);
    }
    return mainDayNightRangeUtilsService.sanitizeDayNightHourValue(value, fallbackHour);
}

function normalizeDayNightRangeValues(dayStartHourInput, nightStartHourInput) {
    if (typeof mainRuntimeCoreAccessorService?.normalizeDayNightRangeValues === "function") {
        return mainRuntimeCoreAccessorService.normalizeDayNightRangeValues(dayStartHourInput, nightStartHourInput);
    }
    return mainDayNightRangeUtilsService.normalizeDayNightRangeValues(dayStartHourInput, nightStartHourInput);
}

const initializedMainState = mainStateInitializerService.deriveInitialState({
    initialMainState,
    copyFormatKeys: COPY_FORMAT_KEYS,
    defaults: {
        defaultDisplayFormatEnabled: DEFAULT_DISPLAY_FORMAT_ENABLED,
        defaultCopyFormatEnabled: DEFAULT_COPY_FORMAT_ENABLED,
        defaultDisplayTimePartsEnabled: DEFAULT_DISPLAY_TIME_PARTS_ENABLED,
        defaultCopyTimePartsEnabled: DEFAULT_COPY_TIME_PARTS_ENABLED,
        defaultTimeAdjustDayStep: DEFAULT_TIME_ADJUST_DAY_STEP,
        defaultDayStartHour: DEFAULT_DAY_START_HOUR,
        defaultNightStartHour: DEFAULT_NIGHT_START_HOUR,
        defaultMultiRangeTitle: DEFAULT_MULTI_RANGE_TITLE
    },
    normalizeDayNightRangeValues,
    t: gtvT
});
isRealtime = initializedMainState.isRealtime;
syncRealtimeFlagToGlobal(isRealtime);
globalTimes = initializedMainState.globalTimes;
slotCount = initializedMainState.slotCount;
uiScale = initializedMainState.uiScale;
showCopyFormat = initializedMainState.showCopyFormat;
showTimeline = initializedMainState.showTimeline;
let displayFormatOrder = initializedMainState.displayFormatOrder;
let displayFormatEnabled = initializedMainState.displayFormatEnabled;
let copyFormatOrder = initializedMainState.copyFormatOrder;
let copyFormatEnabled = initializedMainState.copyFormatEnabled;
let displayTimePartsEnabled = initializedMainState.displayTimePartsEnabled;
let copyTimePartsEnabled = initializedMainState.copyTimePartsEnabled;
let formatProfiles = initializedMainState.formatProfiles;
let activeFormatProfileContext = initializedMainState.activeFormatProfileContext;
let timeAdjustDayStepBySlot = initializedMainState.timeAdjustDayStepBySlot;
let multiRangeCount = initializedMainState.multiRangeCount;
let multiRangeTitle = initializedMainState.multiRangeTitle;
let multiRanges = initializedMainState.multiRanges;
let multiRangeCollapsed = initializedMainState.multiRangeCollapsed;
let multiRangeStartEditEnabled = initializedMainState.multiRangeStartEditEnabled;
let multiRangeEndEditEnabled = initializedMainState.multiRangeEndEditEnabled;
let currentMainTab = initializedMainState.currentMainTab;
let activeGroupIdByMainTab = initializedMainState.activeGroupIdByMainTab;
let currentTheme = initializedMainState.currentTheme;
let dayStartHour = initializedMainState.dayStartHour;
let nightStartHour = initializedMainState.nightStartHour;
let canUseForeignObjectRenderer = initializedMainState.canUseForeignObjectRenderer;
let fixedTimeIdSeed = initializedMainState.fixedTimeIdSeed;
let groups = initializedMainState.groups;
let activeGroupId = initializedMainState.activeGroupId;
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
let mainRuntimeHostUtilsService = null;
let mainRuntimePrimaryStateService = null;
let mainRuntimeServiceBridgeHelpersService = null;
let mainRuntimePatchedStateFallbackService = null;
let mainRuntimeStatePatchAccessorService = null;
let mainRuntimeLocalStateHelpersService = null;
let mainRuntimeBridgeProxiesService = null;
let mainTimezoneRuntimeBridgeService = null;
let mainRuntimeBootstrapAccessorService = null;
let mainTimezoneFacadeService = null;
let mainTimezoneTableFacadeService = null;
let mainTimeAdjustFacadeService = null;
let mainFixedTimeTabFacadeService = null;
let mainMultiRangeTabFacadeService = null;
let mainTimelineFacadeService = null;
let mainFixedTimeFacadeService = null;
let mainAppBootstrapService = null;
let mainRuntimePublicApiService = null;
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
    dayStartHour: (value) => {
        const normalized = normalizeDayNightRangeValues(value, nightStartHour);
        dayStartHour = normalized.dayStartHour;
        nightStartHour = normalized.nightStartHour;
    },
    nightStartHour: (value) => {
        const normalized = normalizeDayNightRangeValues(dayStartHour, value);
        dayStartHour = normalized.dayStartHour;
        nightStartHour = normalized.nightStartHour;
    },
    currentLang: (value) => { syncCurrentLang(value); }
});

var setIsRealtimeState;
var getIsRealtimeState;
var getGlobalTimesState;
var getGlobalTimeState;
var setGlobalTimeState;
var getUiScaleState;

function applyDirectStatePatch(next = {}) {
    return mainRuntimeStatePatchAccessorService.applyDirectStatePatch(next);
}

const SERVICE_METHOD_MISSING = Symbol("GTV_SERVICE_METHOD_MISSING");
const GTV_MAIN_GLOBAL_BINDINGS = GTV_GLOBAL.GTVMainGlobalBindings;
assertBindingCreateService(GTV_MAIN_GLOBAL_BINDINGS, "GTVMainGlobalBindings");
const {
    GTV_MAIN_BOOTSTRAP_GUARD, GTV_MAIN_BOOTSTRAP_GUARD_BINDINGS,
    GTV_MAIN_RUNTIME_HOST_UTILS, GTV_MAIN_RUNTIME_HOST_UTILS_BINDINGS,
    GTV_MAIN_RUNTIME_HOST_ACCESSOR_PROXIES, GTV_MAIN_RUNTIME_HOST_ACCESSOR_BINDINGS,
    GTV_MAIN_RUNTIME_PRIMARY_STATE, GTV_MAIN_RUNTIME_PRIMARY_STATE_BINDINGS,
    GTV_MAIN_RUNTIME_PRIMARY_STATE_ACCESSOR_PROXIES, GTV_MAIN_RUNTIME_PRIMARY_STATE_ACCESSOR_BINDINGS,
    GTV_MAIN_RUNTIME_SERVICE_BRIDGE_HELPERS, GTV_MAIN_RUNTIME_SERVICE_BRIDGE_HELPER_BINDINGS,
    GTV_MAIN_RUNTIME_SERVICE_BRIDGE_ACCESSOR_PROXIES, GTV_MAIN_RUNTIME_SERVICE_BRIDGE_ACCESSOR_BINDINGS,
    GTV_MAIN_RUNTIME_UI_BRIDGE_ACCESSOR_PROXIES, GTV_MAIN_RUNTIME_UI_BRIDGE_ACCESSOR_BINDINGS,
    GTV_MAIN_RUNTIME_OPERATION_ACCESSOR_PROXIES, GTV_MAIN_RUNTIME_OPERATION_ACCESSOR_BINDINGS,
    GTV_MAIN_RUNTIME_PUBLIC_API_BINDINGS,
    GTV_MAIN_RUNTIME_BOOTSTRAP_ACCESSOR_PROXIES, GTV_MAIN_RUNTIME_BOOTSTRAP_ACCESSOR_BINDINGS,
    GTV_MAIN_RUNTIME_CORE_ACCESSOR_PROXIES, GTV_MAIN_RUNTIME_CORE_ACCESSOR_BINDINGS,
    GTV_MAIN_RUNTIME_STATE_PATCH_ACCESSOR_PROXIES, GTV_MAIN_RUNTIME_STATE_PATCH_ACCESSOR_BINDINGS,
    GTV_MAIN_RUNTIME_PATCHED_STATE_FALLBACK, GTV_MAIN_RUNTIME_PATCHED_STATE_FALLBACK_BINDINGS,
    GTV_MAIN_RUNTIME_LOCAL_STATE_HELPERS, GTV_MAIN_RUNTIME_LOCAL_STATE_HELPERS_BINDINGS,
    GTV_MAIN_RUNTIME_LOCAL_STATE_ACCESSOR_PROXIES, GTV_MAIN_RUNTIME_LOCAL_STATE_ACCESSOR_BINDINGS,
    GTV_MAIN_FACADE_BINDINGS, GTV_MAIN_RUNTIME_BRIDGE_PROXIES, GTV_MAIN_RUNTIME_BRIDGE_PROXY_BINDINGS,
    GTV_MAIN_RUNTIME_TIMEZONE_HELPERS, GTV_MAIN_RUNTIME_TIMEZONE_HELPER_BINDINGS,
    GTV_MAIN_RUNTIME_STATE_HELPERS, GTV_MAIN_RUNTIME_STATE_HELPER_ALIASES,
    GTV_MAIN_RUNTIME_STATE_HELPER_ALIASES_BINDINGS, GTV_MAIN_RUNTIME_STATE_HELPER_ACCESSOR_PROXIES,
    GTV_MAIN_RUNTIME_STATE_HELPER_ACCESSOR_BINDINGS, GTV_MAIN_FORMAT_PROFILE_FACADE_BINDINGS,
    GTV_MAIN_CORE_SERVICE_ASSEMBLY_BINDINGS, GTV_MAIN_FOUNDATION_SERVICES_BINDINGS,
    GTV_MAIN_RUNTIME_REFERENCE_ACCESSOR_BINDINGS, GTV_MAIN_RUNTIME_REFERENCE_ACCESSORS,
    GTV_MAIN_STATE_DOMAIN_WRAPPER_BRIDGE, GTV_MAIN_STATE_DOMAIN_WRAPPER_BRIDGE_BINDINGS,
    GTV_MAIN_STATE_DOMAIN_WRAPPER_GLOBAL_BINDINGS, GTV_MAIN_STATE_DOMAIN_WRAPPER_GLOBAL_BINDINGS_BRIDGE,
    GTV_MAIN_STATE_DOMAIN_PROXY_BINDINGS, GTV_MAIN_FACADE_METHOD_BINDER,
    GTV_MAIN_FACADE_METHOD_BINDER_BINDINGS, GTV_MAIN_FACADE_BRIDGE, GTV_MAIN_FACADE_BRIDGE_BINDINGS,
    GTV_MAIN_COMPOSITION_CONFIG_BUILDER, GTV_MAIN_COMPOSITION_CONFIG_BUILDER_BINDINGS,
    GTV_MAIN_CORE_ASSEMBLY_CONFIG_BUILDER, GTV_MAIN_CORE_ASSEMBLY_CONFIG_BUILDER_BINDINGS,
    GTV_MAIN_CORE_SERVICE_BINDINGS, GTV_MAIN_FOUNDATION_SERVICE_BINDINGS,
    GTV_MAIN_RUNTIME_SERVICE_CONFIG_BUILDER, GTV_MAIN_RUNTIME_SERVICE_CONFIG_BUILDER_BINDINGS,
    GTV_MAIN_PATCHED_STATE_ACCESSOR_PROXIES, GTV_MAIN_PATCHED_STATE_ACCESSOR_BINDINGS,
    REQUIRED_BOOTSTRAP_SPECS
} = GTV_MAIN_GLOBAL_BINDINGS.createService({
    globalRef: GTV_GLOBAL
});
const REQUIRED_BOOTSTRAP_SERVICE_GETTERS = Object.freeze({
    persistenceService: () => persistenceService,
    mainUiInitService: () => mainUiInitService,
    timezoneSearchService: () => timezoneSearchService,
    timerEngineService: () => timerEngineService,
    tabOrchestratorService: () => tabOrchestratorService,
    mainClockOrchestratorService: () => mainClockOrchestratorService,
    mainPersistenceSnapshotService: () => mainPersistenceSnapshotService,
    mainTimezoneMutationService: () => mainTimezoneMutationService,
    calculatorActionsService: () => calculatorActionsService
});

assertBindingCreateService(GTV_MAIN_RUNTIME_SERVICE_BRIDGE_HELPER_BINDINGS, "GTVMainRuntimeServiceBridgeHelperBindings");
({
    mainRuntimeServiceBridgeHelpersService
} = GTV_MAIN_RUNTIME_SERVICE_BRIDGE_HELPER_BINDINGS.createService({
    runtimeServiceBridgeHelpersModule: GTV_MAIN_RUNTIME_SERVICE_BRIDGE_HELPERS,
    getMainServiceMethodBridgeService: () => mainServiceMethodBridgeService,
    getAppFeedbackService: () => appFeedbackService,
    getPersistenceService: () => persistenceService,
    getMainMultiRangeTabFacadeService: () => mainMultiRangeTabFacadeService,
    getTranslator: () => gtvT
}));

var warnMissingServiceMethod;
var showMissingFeatureToastOnce;
var getServiceMethod;
var callServiceMethod;
var savePersistenceSafely;
var renderMultiRangesSafely;
assertBindingCreateService(GTV_MAIN_RUNTIME_SERVICE_BRIDGE_ACCESSOR_BINDINGS, "GTVMainRuntimeServiceBridgeAccessorBindings");
({
    warnMissingServiceMethod,
    showMissingFeatureToastOnce,
    getServiceMethod,
    callServiceMethod,
    savePersistenceSafely,
    renderMultiRangesSafely
} = GTV_MAIN_RUNTIME_SERVICE_BRIDGE_ACCESSOR_BINDINGS.createService({
    runtimeServiceBridgeAccessorProxiesModule: GTV_MAIN_RUNTIME_SERVICE_BRIDGE_ACCESSOR_PROXIES,
    getMainRuntimeServiceBridgeHelpersService: () => mainRuntimeServiceBridgeHelpersService,
    getMainServiceMethodBridgeService: () => mainServiceMethodBridgeService,
    getAppFeedbackService: () => appFeedbackService,
    getPersistenceService: () => persistenceService,
    getMainMultiRangeTabFacadeService: () => mainMultiRangeTabFacadeService,
    getTranslator: () => gtvT
}));

assertBindingCreateService(GTV_MAIN_FACADE_METHOD_BINDER_BINDINGS, "GTVMainFacadeMethodBinderBindings");
const {
    deriveFacadeServiceName,
    bindFacadeMethod
} = GTV_MAIN_FACADE_METHOD_BINDER_BINDINGS.createService({
    facadeMethodBinderModule: GTV_MAIN_FACADE_METHOD_BINDER,
    callServiceMethod
});

assertBindingCreateService(GTV_MAIN_BOOTSTRAP_GUARD_BINDINGS, "GTVMainBootstrapGuardBindings");
const {
    mainBootstrapGuardService
} = GTV_MAIN_BOOTSTRAP_GUARD_BINDINGS.createService({
    bootstrapGuardModule: GTV_MAIN_BOOTSTRAP_GUARD,
    serviceGetters: REQUIRED_BOOTSTRAP_SERVICE_GETTERS,
    getServiceMethod,
    requiredSpecs: REQUIRED_BOOTSTRAP_SPECS
});

assertBindingCreateService(GTV_MAIN_RUNTIME_CORE_ACCESSOR_BINDINGS, "GTVMainRuntimeCoreAccessorBindings");
mainRuntimeCoreAccessorService = GTV_MAIN_RUNTIME_CORE_ACCESSOR_BINDINGS.createService({
    runtimeCoreAccessorProxiesModule: GTV_MAIN_RUNTIME_CORE_ACCESSOR_PROXIES,
    getMainRuntimeLangStateService: () => mainRuntimeLangStateService,
    getMainDayNightRangeUtilsService: () => mainDayNightRangeUtilsService,
    getMainBootstrapGuardService: () => mainBootstrapGuardService,
    getGlobalRef: () => GTV_GLOBAL,
    defaultLang: "ko",
    defaultDayStartHour: DEFAULT_DAY_START_HOUR,
    defaultNightStartHour: DEFAULT_NIGHT_START_HOUR
});

function assertRequiredServices() {
    if (typeof mainRuntimeCoreAccessorService?.assertRequiredServices === "function") {
        return mainRuntimeCoreAccessorService.assertRequiredServices();
    }
    return mainBootstrapGuardService.assertRequiredServices();
}

var applyVersionBranding;

assertBindingCreateService(GTV_MAIN_RUNTIME_BRIDGE_PROXY_BINDINGS, "GTVMainRuntimeBridgeProxyBindings");
({
    mainRuntimeBridgeProxiesService,
    getSignedInclusiveDaySpan,
    escapeHtmlViaSharedUtils,
    getRenderableTimezoneRowsFromTableRender,
    getMultiDisplayColumnHeaderFromTableRender,
    getTimezoneRefByIdFromSnapshotService,
    normalizeZoneAbbreviationViaSearch,
    getDefaultMultiSubgroupNameViaState,
    sanitizeMultiSubgroupIdViaState,
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
    sanitizeMultiStatePayloadViaState
} = GTV_MAIN_RUNTIME_BRIDGE_PROXY_BINDINGS.createService({
    runtimeBridgeProxiesModule: GTV_MAIN_RUNTIME_BRIDGE_PROXIES,
    callServiceMethod,
    getMainSharedUtilsService: () => mainSharedUtilsService,
    getTableRenderService: () => tableRenderService,
    getSnapshotFormatService: () => snapshotFormatService,
    getTimezoneSearchService: () => timezoneSearchService,
    getMultiStateService: () => multiStateService,
    getTimeService: () => timeService,
    getMultiRangeRenderService: () => multiRangeRenderService,
    getPatchedCopyFormatOrderState: () => getPatchedCopyFormatOrderState(),
    getPatchedCopyFormatEnabledState: () => getPatchedCopyFormatEnabledState(),
    getPatchedCopyTimePartsEnabledState: () => getPatchedCopyTimePartsEnabledState(),
    defaultCopyTimePartsEnabled: DEFAULT_COPY_TIME_PARTS_ENABLED,
    applyMultiRangeTimeAdjustAction: (rangeIdx, slotIdx, action) => applyMultiRangeTimeAdjustAction(rangeIdx, slotIdx, action)
}));

const MAX_RUNTIME_CACHE_SIZE = 4096;
const timezoneOffsetCache = new Map();
const timezoneDstCache = new Map();
const zoneAbbrCache = new Map();
const rowViewCache = new Map();
const GTV_MAIN_MODULE_RESOLVER = GTV_GLOBAL.GTVMainModuleResolver;
const GTV_MAIN_MODULE_SPEC = GTV_GLOBAL.GTVMainModuleSpec;
const GTV_MAIN_MODULE_RESOLUTION_BINDINGS = GTV_GLOBAL.GTVMainModuleResolutionBindings;
assertBindingCreateService(GTV_MAIN_MODULE_RESOLUTION_BINDINGS, "GTVMainModuleResolutionBindings");
const {
    resolveModulesFromSpec
} = GTV_MAIN_MODULE_RESOLUTION_BINDINGS.createService({
    moduleResolverModule: GTV_MAIN_MODULE_RESOLVER,
    moduleSpecModule: GTV_MAIN_MODULE_SPEC
});
const mainResolvedModules = resolveModulesFromSpec();
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
} = mainResolvedModules;

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
var createCanvasSafely;
var getRandomUUIDSafely;
var getDocumentRefOrNull;
var getWindowRefOrNull;
var getLocationRefOrNull;
var getGlobalThisRefOrNull;
var getLuxonGlobalRef;
var getComputedStyleSafely;
var getRuntimeNowMs;
var setRuntimeInterval;
var clearRuntimeInterval;
var deferDynamicCall;

var setMultiRangeState;
var getNextFixedTimeSeed;
var setUiPreferencesState;
var getBaseTimeSnapshot;
var getFixedTimeSlotCountForGroupRef;
var confirmRuntime;
var getActiveCopyFormatKeysForCurrentContext;
var getActiveTimePartKeysForCurrentContext;
var getCurrentUiScalePercent;
var getFixedTimeSlotCountForCurrentGroup;
var getCurrentGroupFixedTimeShowLiveNow;
var shouldRunRealtimeTick;
var getTimeAdjustDayStepValue;
var buildPatchedStateFallbackSnapshot;
const GTV_MAIN_RUNTIME_STATE_CORE_BOOTSTRAP = GTV_GLOBAL.GTVMainRuntimeStateCoreBootstrap;
assertBindingCreateService(GTV_MAIN_RUNTIME_STATE_CORE_BOOTSTRAP, "GTVMainRuntimeStateCoreBootstrap");
({
    mainRuntimeHostUtilsService,
    applyVersionBranding,
    createCanvasSafely,
    getRandomUUIDSafely,
    getDocumentRefOrNull,
    getWindowRefOrNull,
    getLocationRefOrNull,
    getGlobalThisRefOrNull,
    getLuxonGlobalRef,
    getComputedStyleSafely,
    getRuntimeNowMs,
    setRuntimeInterval,
    clearRuntimeInterval,
    deferDynamicCall,
    mainRuntimePrimaryStateService,
    setIsRealtimeState,
    getIsRealtimeState,
    getGlobalTimesState,
    getGlobalTimeState,
    setGlobalTimeState,
    getUiScaleState,
    mainRuntimePatchedStateFallbackService,
    mainRuntimeStatePatchAccessorService,
    buildPatchedStateFallbackSnapshot,
    mainRuntimeLocalStateHelpersService,
    setMultiRangeState,
    getNextFixedTimeSeed,
    setUiPreferencesState,
    getBaseTimeSnapshot,
    getFixedTimeSlotCountForGroupRef,
    confirmRuntime,
    getActiveCopyFormatKeysForCurrentContext,
    getActiveTimePartKeysForCurrentContext,
    getCurrentUiScalePercent,
    getFixedTimeSlotCountForCurrentGroup,
    getCurrentGroupFixedTimeShowLiveNow,
    shouldRunRealtimeTick,
    getTimeAdjustDayStepValue
} = GTV_MAIN_RUNTIME_STATE_CORE_BOOTSTRAP.createService({
    runtimeHostUtilsBindings: GTV_MAIN_RUNTIME_HOST_UTILS_BINDINGS,
    runtimeHostUtilsModule: GTV_MAIN_RUNTIME_HOST_UTILS,
    runtimeHostAccessorBindings: GTV_MAIN_RUNTIME_HOST_ACCESSOR_BINDINGS,
    runtimeHostAccessorProxiesModule: GTV_MAIN_RUNTIME_HOST_ACCESSOR_PROXIES,
    runtimePrimaryStateBindings: GTV_MAIN_RUNTIME_PRIMARY_STATE_BINDINGS,
    runtimePrimaryStateModule: GTV_MAIN_RUNTIME_PRIMARY_STATE,
    runtimePrimaryStateAccessorBindings: GTV_MAIN_RUNTIME_PRIMARY_STATE_ACCESSOR_BINDINGS,
    runtimePrimaryStateAccessorProxiesModule: GTV_MAIN_RUNTIME_PRIMARY_STATE_ACCESSOR_PROXIES,
    runtimePatchedStateFallbackBindings: GTV_MAIN_RUNTIME_PATCHED_STATE_FALLBACK_BINDINGS,
    runtimePatchedStateFallbackModule: GTV_MAIN_RUNTIME_PATCHED_STATE_FALLBACK,
    runtimeStatePatchAccessorBindings: GTV_MAIN_RUNTIME_STATE_PATCH_ACCESSOR_BINDINGS,
    runtimeStatePatchAccessorProxiesModule: GTV_MAIN_RUNTIME_STATE_PATCH_ACCESSOR_PROXIES,
    runtimeLocalStateHelpersBindings: GTV_MAIN_RUNTIME_LOCAL_STATE_HELPERS_BINDINGS,
    runtimeLocalStateHelpersModule: GTV_MAIN_RUNTIME_LOCAL_STATE_HELPERS,
    runtimeLocalStateAccessorBindings: GTV_MAIN_RUNTIME_LOCAL_STATE_ACCESSOR_BINDINGS,
    runtimeLocalStateAccessorProxiesModule: GTV_MAIN_RUNTIME_LOCAL_STATE_ACCESSOR_PROXIES,
    appDisplayName: APP_DISPLAY_NAME,
    version: VERSION,
    getGlobalRef: () => GTV_GLOBAL,
    getIsRealtime: () => isRealtime,
    setIsRealtime: (next) => { isRealtime = !!next; },
    syncRealtimeFlagToGlobal,
    getGlobalTimes: () => globalTimes,
    setGlobalTimes: (next) => { globalTimes = next; },
    getUiScale: () => uiScale,
    normalizeDayNightRangeValues,
    getNormalizeDayNightRangeValues: () => normalizeDayNightRangeValues,
    getRuntimeCurrentLangValue,
    getCurrentMainTab: () => currentMainTab,
    getSlotCount: () => slotCount,
    getShowCopyFormat: () => showCopyFormat,
    getShowTimeline: () => showTimeline,
    getCurrentTheme: () => currentTheme,
    getDayStartHour: () => dayStartHour,
    setDayStartHour: (next) => { dayStartHour = next; },
    getNightStartHour: () => nightStartHour,
    setNightStartHour: (next) => { nightStartHour = next; },
    getDisplayFormatOrder: () => displayFormatOrder,
    getDisplayFormatEnabled: () => displayFormatEnabled,
    getDisplayTimePartsEnabled: () => displayTimePartsEnabled,
    getCopyFormatOrder: () => copyFormatOrder,
    getCopyFormatEnabled: () => copyFormatEnabled,
    getCopyTimePartsEnabled: () => copyTimePartsEnabled,
    getActiveFormatProfileContext: () => activeFormatProfileContext,
    getActiveGroupId: () => activeGroupId,
    getMultiRangeCount: () => multiRangeCount,
    getMultiRanges: () => multiRanges,
    getMultiRangeCollapsed: () => multiRangeCollapsed,
    getTimeAdjustDayStepBySlot: () => timeAdjustDayStepBySlot,
    getMultiRangeTitle: () => multiRangeTitle,
    getMainDirectStatePatchService: () => mainDirectStatePatchService,
    getDirectStateSetters: () => directStateSetters,
    getPatchAppState: () => patchAppState,
    getFixedTimeIdSeed: () => fixedTimeIdSeed,
    setFixedTimeIdSeed: (next) => { fixedTimeIdSeed = next; },
    setUiScale: (next) => { uiScale = next; },
    setCurrentTheme: (next) => { currentTheme = next; },
    sanitizeDayNightHourValue,
    syncCurrentLang,
    getFixedTimeSlotCount: (...args) => getFixedTimeSlotCount(...args),
    getConfirm: (message) => confirm(message),
    getFormatProfileAllowedKeys: (...args) => getFormatProfileAllowedKeys(...args),
    getFormatProfileAllowedTimePartKeys: (...args) => getFormatProfileAllowedTimePartKeys(...args),
    getPatchedActiveFormatProfileContextState,
    getCurrentGroup: (...args) => getCurrentGroup(...args),
    getFixedTimeStateService: () => fixedTimeStateService,
    isFixedTimeTab: (...args) => isFixedTimeTab(...args),
    getTimeAdjustDayStepBySlotSnapshot
}));

assertBindingCreateService(GTV_MAIN_RUNTIME_REFERENCE_ACCESSOR_BINDINGS, "GTVMainRuntimeReferenceAccessorBindings");
const mainRuntimeReferenceAccessorService = GTV_MAIN_RUNTIME_REFERENCE_ACCESSOR_BINDINGS.createService({
    runtimeReferenceAccessorsModule: GTV_MAIN_RUNTIME_REFERENCE_ACCESSORS,
    getRenderList: () => renderList,
    getSanitizeCopyFormatOrderForContext: () => sanitizeCopyFormatOrderForContext,
    getSanitizeCopyFormatEnabledForContext: () => sanitizeCopyFormatEnabledForContext,
    getSanitizeTimePartsEnabledForContext: () => sanitizeTimePartsEnabledForContext,
    getShowToast: () => showToast,
    getRenderTimelineFrame: () => renderTimelineFrame,
    getUpdateClocks: () => updateClocks,
    getTranslator: () => gtvT,
    getSavePersistenceSafely: () => savePersistenceSafely,
    getRenderFixedTimeTab: () => renderFixedTimeTab,
    getRefreshFixedTimeSlotCountControls: () => refreshFixedTimeSlotCountControls,
    getAppStatePatcherService: () => appStatePatcherService,
    getAppPersistenceStateService: () => appPersistenceStateService,
    getMainTimezoneRuntimeBridgeService: () => mainTimezoneRuntimeBridgeService,
    getMainTimezoneRuntimeService: () => mainTimezoneRuntimeService,
    getMainBaseTimezoneService: () => mainBaseTimezoneService,
    getMainTimezoneMutationService: () => mainTimezoneMutationService,
    getZoneMap: () => ZONE_MAP,
    getTzDatabase: () => TZ_DATABASE,
    getTimeService: () => timeService,
    getRuntimeRandom: () => Math.random(),
    getGroupStateService: () => groupStateService,
    getTimeAdjustActionsService: () => timeAdjustActionsService,
    getMultiBulkToolsService: () => multiBulkToolsService,
    getFixedTimeTableService: () => fixedTimeTableService,
    invokeRenderBaseTimeSelect: () => renderBaseTimeSelect(),
    getMultiRangeCopyService: () => multiRangeCopyService,
    getMultiStateService: () => multiStateService,
    getMainClockOrchestratorService: () => mainClockOrchestratorService,
    getMainPersistenceSnapshotService: () => mainPersistenceSnapshotService,
    getFixedTimeCoreService: () => fixedTimeCoreService,
    getFixedTimeActionsService: () => fixedTimeActionsService,
    getTimelineFrameService: () => timelineFrameService,
    getFixedTimeTimelineService: () => fixedTimeTimelineService,
    getShowTimelineState: () => showTimeline,
    getDisplayFormatOrderState: () => displayFormatOrder,
    getDisplayFormatEnabledState: () => displayFormatEnabled,
    getDisplayTimePartsEnabledState: () => displayTimePartsEnabled,
    getCopyFormatOrderState: () => copyFormatOrder,
    getCopyFormatEnabledState: () => copyFormatEnabled,
    getCopyTimePartsEnabledState: () => copyTimePartsEnabled,
    getFormatProfilesState: () => formatProfiles,
    getActiveFormatProfileContextState: () => activeFormatProfileContext,
    getCurrentThemeState: () => currentTheme,
    getDayStartHourState: () => dayStartHour,
    getNightStartHourState: () => nightStartHour,
    sanitizeDayNightHourValue,
    normalizeDayNightRangeValues,
    defaultDayStartHour: DEFAULT_DAY_START_HOUR,
    defaultNightStartHour: DEFAULT_NIGHT_START_HOUR,
    getRuntimeCurrentLangValue,
    getBuildStrictUtcDateFromParts: () => GTV_TIME_CORE.buildStrictUtcDateFromParts,
    getSetGlobalTimeState: () => setGlobalTimeState,
    getSnapshotFormatService: () => snapshotFormatService,
    getI18nData: () => MAIN_I18N_DATA,
    getImageExportBridgeService: () => imageExportBridgeService,
    getCanUseForeignObjectRendererState: () => canUseForeignObjectRenderer,
    setCanUseForeignObjectRendererState: (value) => { canUseForeignObjectRenderer = !!value; },
    getImageExportActionsService: () => imageExportActionsService,
    getImageExportNamingService: () => imageExportNamingService,
    getPersistenceService: () => persistenceService,
    getTableRenderService: () => tableRenderService,
    getCopyActionsService: () => copyActionsService,
    getTimeAdjustUiService: () => timeAdjustUiService,
    getMultiRangeRenderService: () => multiRangeRenderService,
    getFormatControlsService: () => formatControlsService,
    getTabUiService: () => tabUiService,
    getUiSettingsActionsService: () => uiSettingsActionsService,
    getTimezoneSearchService: () => timezoneSearchService,
    getGroupTabsService: () => groupTabsService,
    getMainUiInitService: () => mainUiInitService,
    getTimerEngineService: () => timerEngineService,
    getTimeCore: () => GTV_TIME_CORE,
    getMainTimezoneFacadeService: () => mainTimezoneFacadeService,
    getMainTimeAdjustFacadeService: () => mainTimeAdjustFacadeService,
    getMainTimezoneTableFacadeService: () => mainTimezoneTableFacadeService,
    getMainTimelineFacadeService: () => mainTimelineFacadeService,
    getMainFixedTimeFacadeService: () => mainFixedTimeFacadeService,
    getMainFixedTimeTabFacadeService: () => mainFixedTimeTabFacadeService,
    getMainMultiRangeTabFacadeService: () => mainMultiRangeTabFacadeService,
    getMainFoundationServices: () => mainFoundationServices
});
const {
    getRenderListRef,
    getShowToastRef,
    getRenderTimelineFrameRef,
    getUpdateClocksRef,
    getTranslatorRef,
    getSavePersistenceSafelyRef,
    getRenderFixedTimeTabRef,
    getRefreshFixedTimeSlotCountControlsRef,
    getZoneMapRef,
    invokeRenderBaseTimeSelect,
    getDayNightMarkerByHour,
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
    getMainFoundationServicesRef
} = mainRuntimeReferenceAccessorService;
let mainStateDomainProxiesService = null;
assertBindingCreateService(GTV_MAIN_STATE_DOMAIN_WRAPPER_BRIDGE_BINDINGS, "GTVMainStateDomainWrapperBridgeBindings");
const {
    mainStateDomainWrapperBridgeService,
    getDefaultFixedTimeName,
    getDefaultFixedDate,
    getDefaultFixedTimes,
    sanitizeFixedTimeSlotCount,
    createDefaultFixedTimeSlot,
    sanitizeFixedTimeId,
    sanitizeFixedTimeName,
    sanitizeFixedTimeValue,
    sanitizeFixedDateValue,
    sanitizeFixedTimeShowLiveNow,
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
    setCurrentGroupFixedTimeShowLiveNow,
    refreshFixedTimeSlotCountControls,
    setFixedTimeSlotCount,
    toggleMultiRangeCollapsed,
    setMultiRangesCollapsedBelow,
    getMultiRangeSlotDate,
    setMultiRangeSlotDate,
    sanitizeUiScalePercent,
    applyUiScale,
    loadUiScalePreference,
    populateUiScaleSelect,
    populateDayNightHourSelect,
    setDayNightRange,
    sanitizeTheme,
    applyTheme,
    loadThemePreference,
    setCurrentLang,
    sanitizeMainTab,
    clampGroupIndex,
    normalizeGroupTabState,
    getPersistenceState,
    setPersistenceState
} = GTV_MAIN_STATE_DOMAIN_WRAPPER_BRIDGE_BINDINGS.createService({
    stateDomainWrapperBridgeModule: GTV_MAIN_STATE_DOMAIN_WRAPPER_BRIDGE,
    getMainStateDomainProxiesService: () => mainStateDomainProxiesService,
    getCurrentGroup: () => getCurrentGroup(),
    defaultFixedTimeValue: DEFAULT_FIXED_TIME_VALUE
});
assertBindingCreateService(GTV_MAIN_STATE_DOMAIN_WRAPPER_GLOBAL_BINDINGS_BRIDGE, "GTVMainStateDomainWrapperGlobalBindingsBridge");
const {
    mainStateDomainWrapperGlobalBindingsService
} = GTV_MAIN_STATE_DOMAIN_WRAPPER_GLOBAL_BINDINGS_BRIDGE.createService({
    stateDomainWrapperGlobalBindingsModule: GTV_MAIN_STATE_DOMAIN_WRAPPER_GLOBAL_BINDINGS,
    getGlobalRoot: () => GTV_GLOBAL
});
mainStateDomainWrapperGlobalBindingsService.applyBindings(mainStateDomainWrapperBridgeService, {
    excludeKeys: ["invokeStateDomainProxy"]
});

assertBindingCreateService(GTV_MAIN_CORE_ASSEMBLY_CONFIG_BUILDER_BINDINGS, "GTVMainCoreAssemblyConfigBuilderBindings");
const {
    mainCoreAssemblyConfigBuilderService
} = GTV_MAIN_CORE_ASSEMBLY_CONFIG_BUILDER_BINDINGS.createService({
    coreAssemblyConfigBuilderModule: GTV_MAIN_CORE_ASSEMBLY_CONFIG_BUILDER
});
assertBindingCreateService(GTV_MAIN_PATCHED_STATE_ACCESSOR_BINDINGS, "GTVMainPatchedStateAccessorBindings");
const mainPatchedStateAccessorService = GTV_MAIN_PATCHED_STATE_ACCESSOR_BINDINGS.createService({
    patchedStateAccessorProxiesModule: GTV_MAIN_PATCHED_STATE_ACCESSOR_PROXIES,
    getMainAppStateBridgeService: () => mainAppStateBridgeService,
    getMainPatchedStateSelectorsService: () => mainPatchedStateSelectorsService
});
var {
    getPatchedAppStateSnapshot,
    patchAppState,
    getPatchedArrayStateValue,
    getPatchedMainTabState,
    getPatchedSlotCountState,
    setPatchedSlotCountState,
    getPatchedShowCopyFormatState,
    setPatchedShowCopyFormatState,
    getPatchedShowTimelineState,
    setPatchedShowTimelineState,
    getPatchedCurrentThemeState,
    getPatchedDayStartHourState,
    getPatchedNightStartHourState,
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
    getPatchedMultiRangeTitleState
} = mainPatchedStateAccessorService;
const GTV_MAIN_RUNTIME_CORE_ASSEMBLY_BOOTSTRAP = GTV_GLOBAL.GTVMainRuntimeCoreAssemblyBootstrap;
assertBindingCreateService(GTV_MAIN_RUNTIME_CORE_ASSEMBLY_BOOTSTRAP, "GTVMainRuntimeCoreAssemblyBootstrap");
const {
    mainCoreAssemblyConfig
} = GTV_MAIN_RUNTIME_CORE_ASSEMBLY_BOOTSTRAP.createService({
    mainCoreAssemblyConfigBuilderService,
    moduleRefs: mainResolvedModules,
    runtimeReferenceAccessorService: mainRuntimeReferenceAccessorService,
    patchedStateAccessorService: mainPatchedStateAccessorService,
    consoleWarn: console.warn.bind(console),
    showMissingFeatureToastOnce,
    directStateSetters,
    setIsRealtimeState,
    callServiceMethod,
    applyDirectStatePatch,
    SERVICE_METHOD_MISSING,
    buildPatchedStateFallbackSnapshot,
    TABLE_IMAGE_EXPORT_WIDTH,
    createCanvasSafely,
    getBaseTimeSnapshot,
    formatUtcOffsetLabel,
    bindFacadeMethod,
    timezoneOffsetCache,
    timezoneDstCache,
    zoneAbbrCache,
    getCurrentGroupBaseTimezoneId,
    getRandomUUIDSafely,
    normalizeCustomAbbr,
    deferDynamicCall,
    isFixedTimeTab,
    renderFixedTimeTab,
    getTimeAdjustDayStepBySlotSnapshot,
    setTimeAdjustDayStepBySlotState,
    DEFAULT_TIME_ADJUST_DAY_STEP,
    MIN_TIME_ADJUST_DAY_STEP,
    MAX_TIME_ADJUST_DAY_STEP,
    getCurrentGroup,
    ensureGroupFixedTimes,
    refreshFixedTimeSlotCountControls,
    getCurrentGroupFixedTimeShowLiveNow,
    getDocumentRefOrNull,
    getCurrentMultiRangeStateSnapshot,
    setMultiRangeState,
    sanitizeMultiRangeCount,
    sanitizeMultiRangeTitle,
    ensureMultiRangeState,
    refreshMultiRangeControls,
    getRuntimeNowMs,
    warnMissingServiceMethod,
    getWindowRefOrNull,
    getGlobalTimeState,
    getFixedTimeSlotCountForGroupRef,
    getFixedTimeSlotHeaderLabel,
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
    getActiveGroupIdByMainTabStateSnapshot,
    patchPrimaryState,
    getUTCRef,
    COPY_FORMAT_KEYS,
    TIME_PART_KEYS,
    FORMAT_PROFILE_CONTEXT_KEYS,
    DEFAULT_DISPLAY_FORMAT_ENABLED,
    DEFAULT_COPY_FORMAT_ENABLED,
    DEFAULT_DISPLAY_TIME_PARTS_ENABLED,
    DEFAULT_COPY_TIME_PARTS_ENABLED,
    sanitizeMainTab,
    MIN_MULTI_RANGE_COUNT,
    MAX_MULTI_RANGE_COUNT,
    DEFAULT_MULTI_RANGE_TITLE,
    gtvT,
    getGlobalTimesState,
    isMultiTab,
    renderMultiRangesSafely,
    updateTimeAdjustPanelSafely,
    savePersistenceSafely,
    MIN_FIXED_TIME_SLOT_COUNT,
    MAX_FIXED_TIME_SLOT_COUNT,
    DEFAULT_FIXED_TIME_VALUE,
    parseDateTimeParts,
    buildStrictUtcDateFromParts,
    getNextFixedTimeSeed,
    sanitizeFixedDateValue,
    sanitizeFixedTimeShowLiveNow,
    sanitizeFixedTimeSlotCount,
    getRenderTimelineFrameRef,
    createUniqueFixedTimeId,
    createDefaultFixedTimeSlot,
    MIN_UI_SCALE_PERCENT,
    MAX_UI_SCALE_PERCENT,
    DEFAULT_UI_SCALE_PERCENT,
    UI_SCALE_PERCENT_OPTIONS,
    DEFAULT_DAY_START_HOUR,
    DEFAULT_NIGHT_START_HOUR,
    DAY_NIGHT_HOUR_OPTIONS,
    THEME_LIST,
    THEME_STORAGE_KEY,
    UI_SCALE_STORAGE_KEY,
    MAIN_I18N_DATA,
    setUiPreferencesState,
    DEFAULT_REALTIME_TICK_MS,
    getIsRealtimeState,
    shouldRunRealtimeTick,
    setGlobalTimeState,
    MAX_RUNTIME_CACHE_SIZE,
    setRuntimeInterval,
    clearRuntimeInterval,
    getLuxonGlobalRef
});
const GTV_MAIN_RUNTIME_CORE_FOUNDATION_BOOTSTRAP = GTV_GLOBAL.GTVMainRuntimeCoreFoundationBootstrap;
assertBindingCreateService(GTV_MAIN_RUNTIME_CORE_FOUNDATION_BOOTSTRAP, "GTVMainRuntimeCoreFoundationBootstrap");
const mainRuntimeCoreFoundationServices = GTV_MAIN_RUNTIME_CORE_FOUNDATION_BOOTSTRAP.createService({
    mainCoreAssemblyConfigBuilderService,
    coreServiceAssemblyBindings: GTV_MAIN_CORE_SERVICE_ASSEMBLY_BINDINGS,
    coreServiceAssemblyModule: GTV_MAIN_CORE_SERVICE_ASSEMBLY,
    coreServiceBindings: GTV_MAIN_CORE_SERVICE_BINDINGS,
    foundationServicesBindings: GTV_MAIN_FOUNDATION_SERVICES_BINDINGS,
    foundationServicesModule: GTV_MAIN_FOUNDATION_SERVICES,
    foundationServiceBindings: GTV_MAIN_FOUNDATION_SERVICE_BINDINGS,
    stateDomainProxyBindings: GTV_MAIN_STATE_DOMAIN_PROXY_BINDINGS,
    mainStateDomainProxiesModule: GTV_GLOBAL.GTVMainStateDomainProxies,
    mainCoreAssemblyConfig,
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
    gtvT,
    getShowToastRef,
    deferDynamicCall,
    getPersistenceServiceRef,
    confirmRuntime,
    getLocationRefOrNull,
    getDocumentRefOrNull,
    consoleError: console.error.bind(console),
    getPatchedMainTabState,
    getCurrentGroup: () => getCurrentGroup(),
    defaultFixedTimeValue: DEFAULT_FIXED_TIME_VALUE
});
const {
    mainCoreServices,
    mainFoundationServices,
    mainGroupLocalizationServices,
    mainOrchestrationFlowServices,
    serviceBootstrap,
    persistenceServiceBundleFactory,
    mainUiUtilsService,
    setCustomTooltip,
    upgradeNativeTitleTooltips,
    hideFloatingTooltip,
    bindFloatingTooltipEvents,
    clearDragGhost,
    createDragGhostFromRow,
    groupContextStateService,
    formatProfileStateService,
    multiRangeStateService,
    fixedTimeSlotUtilsService,
    fixedTimeStateService,
    uiPreferencesStateService,
    timerEngineService,
    timeService
} = mainRuntimeCoreFoundationServices;
({
    mainServiceMethodBridgeService,
    mainDirectStatePatchService,
    mainAppStateBridgeService,
    mainPatchedStateSelectorsService,
    mainSharedUtilsService,
    mainTimezoneRuntimeBridgeService,
    mainTimezoneRuntimeService,
    mainTimezoneFacadeService,
    mainBaseTimezoneService,
    mainTimezoneMutationService,
    mainTimezoneTableFacadeService,
    mainTimeAdjustFacadeService,
    mainFixedTimeTabFacadeService,
    mainFixedTimeFacadeService,
    mainTimelineFacadeService,
    mainMultiRangeTabFacadeService,
    appFeedbackService,
    calculatorActionsService,
    mainStateDomainProxiesService
} = mainRuntimeCoreFoundationServices);
assertBindingCreateService(GTV_MAIN_FACADE_BRIDGE_BINDINGS, "GTVMainFacadeBridgeBindings");
var {
    sanitizeUtcRowOrderViaTimeCore,
    sanitizeUtcMsViaTimeCore,
    confirmFnViaMainFoundation,
    getUtcMinuteCacheKey,
    setCappedRuntimeCache,
    getBetterAbbr,
    isTimeZoneInDST,
    getTimezoneOffset,
    getFixedOffsetForDisplayAtDate,
    getFixedOffsetForDisplay,
    getLocalizedTZLabel,
    getZoneDisplayName,
    sanitizeTimezoneId,
    sanitizeBaseTimezoneId,
    setCurrentGroupBaseTimezoneId,
    applyCurrentGroupBaseTimezoneId,
    getUsedTimezoneIds,
    createUniqueTimezoneId,
    getNextTimezoneIdSeed,
    getTimeAdjustDayStep,
    setTimeAdjustDayStep,
    updateTimeAdjustPanel,
    renderTimeAdjustSet,
    attachTimeAdjustToggleLabel,
    renderMultiBulkToolSets,
    sanitizeTimeAdjustDayStep,
    resolveTimeAdjustZoneAndOffset,
    applyTimeAdjustAction,
    getAdjustedUtcDateByAction,
    applyBulkRangeAllAction,
    applyMultiRangeTimeAdjustAction,
    createStandardTimezoneFromSelectableEntry,
    addTimezone,
    removeTimezone,
    updateCopyFormatPreview,
    copyAllTimezones,
    isTimelineSupportedTab,
    shouldRenderTimeline,
    resolveFixedTimeTimelineSourceDate,
    applyFixedTimeSlotTimelineRatio,
    getFixedTimeTimelineSlots,
    getFixedTimeTimelineSlotCount,
    getFixedTimeTimelineIndicatorToken,
    getFixedTimeSlotTimelineLabel,
    getFixedTimeTimelineIndicatorColor,
    stopTimelineDrag,
    normalizeDayNightMarker,
    getDayNightGlyph,
    applyTimelineRatioToSlot,
    getTimelineIndicatorLabel,
    getTimelinePanelCount,
    getFixedTimeSlotParts,
    formatFixedTimeForTimezoneAtUtc,
    getFixedTimeDisplayPartsEnabled,
    getLocalizedWeekdayNameByIndex,
    buildFixedTimeDisplayPayloadAtUtc,
    formatFixedTimePayloadText,
    getFixedTimeCopyState,
    buildFixedTimeSnapshotForTimezoneSlot,
    formatFixedTimeCopyTextForTimezoneSlot,
    getFixedTimeSlotUtcDateByIndex,
    getFixedTimePreviewCopyText,
    getAllFixedTimeRowsCopyText,
    copyFixedTimeCellPayload,
    copyFixedTimeCellByTimezone,
    buildFixedTimeCellInputValue,
    buildFixedTimeCellTimeParts,
    applyFixedTimeSlotByTimezoneInput,
    bindCustomDatePickerForInput,
    copyFixedTimeSlotColumn,
    renameFixedTimeSlot,
    updateFixedTimeSlotTime,
    addFixedTimeSlot,
    removeFixedTimeSlot,
    renderFixedTimeControls,
    getFixedTimeSlotLayoutMetrics,
    getFixedTimeDisplayColumns,
    getFixedTimeOffsetTextAtDate,
    renderFixedTimeTable,
    buildTimezoneComputedSnapshotForRange,
    applySnapshotToRow,
    formatRangeDurationText,
    copyMultiRangeRow,
    copyAllMultiRangeTimezones
} = GTV_MAIN_FACADE_BRIDGE_BINDINGS.createService({
    facadeBridgeModule: GTV_MAIN_FACADE_BRIDGE,
    facadeBindingsModule: GTV_MAIN_FACADE_BINDINGS,
    bindFacadeMethod,
    getTimeCoreRef,
    getMainFoundationServicesRef,
    getMainTimezoneFacadeServiceRef,
    getMainTimeAdjustFacadeServiceRef,
    getMainTimezoneTableFacadeServiceRef,
    getMainTimelineFacadeServiceRef,
    getMainFixedTimeFacadeServiceRef,
    getMainFixedTimeTabFacadeServiceRef,
    getMainMultiRangeTabFacadeServiceRef
});

assertBindingCreateService(GTV_MAIN_COMPOSITION_CONFIG_BUILDER_BINDINGS, "GTVMainCompositionConfigBuilderBindings");
const {
    mainCompositionConfigBuilderService
} = GTV_MAIN_COMPOSITION_CONFIG_BUILDER_BINDINGS.createService({
    compositionConfigBuilderModule: GTV_MAIN_COMPOSITION_CONFIG_BUILDER
});

// --- Shared Core Utilities ---
assertBindingCreateService(GTV_MAIN_RUNTIME_TIMEZONE_HELPER_BINDINGS, "GTVMainRuntimeTimezoneHelperBindings");
const {
    prepareExportCanvas,
    drawExportCellText,
    parseLocalDateTimeToUtcMs,
    getSignedDurationDayHourMinute,
    getZoneAbbreviation,
    getZoneDisplayNameForUiAtDate,
    getCustomOffsetMinutes: getCustomOffsetMinutesViaRuntimeHelpers,
    writeClipboardText,
    getLocalPartsByTimezone,
    getUTCDateFromLocalParts,
    isCurrentGroupUtcRowVisible,
    getCurrentGroupUtcRowOrder
} = GTV_MAIN_RUNTIME_TIMEZONE_HELPER_BINDINGS.createService({
    runtimeTimezoneHelpersModule: GTV_MAIN_RUNTIME_TIMEZONE_HELPERS,
    getMainSharedUtilsService: () => mainSharedUtilsService,
    getTimeService: () => timeService,
    getRuntimeCurrentLangValue,
    getGlobalTimeState,
    callServiceMethod,
    getMainTimezoneFacadeService: () => mainTimezoneFacadeService,
    getTimeCore: () => GTV_TIME_CORE,
    getConsoleWarn: () => console.warn.bind(console),
    getNavigatorRef: () => ((typeof navigator === "object" && navigator) ? navigator : null),
    getGroupContextStateService: () => groupContextStateService
});
function getCustomOffsetMinutes(tz) {
    return getCustomOffsetMinutesViaRuntimeHelpers(tz);
}

const GTV_MAIN_RUNTIME_STATE_HELPER_BOOTSTRAP = GTV_GLOBAL.GTVMainRuntimeStateHelperBootstrap;
assertBindingCreateService(GTV_MAIN_RUNTIME_STATE_HELPER_BOOTSTRAP, "GTVMainRuntimeStateHelperBootstrap");
var mainRuntimeStateHelperAccessorService = null;
mainRuntimeStateHelperAccessorService = GTV_MAIN_RUNTIME_STATE_HELPER_BOOTSTRAP.createService({
    runtimeStateHelperAliasesBindings: GTV_MAIN_RUNTIME_STATE_HELPER_ALIASES_BINDINGS,
    runtimeStateHelperAccessorBindings: GTV_MAIN_RUNTIME_STATE_HELPER_ACCESSOR_BINDINGS,
    runtimeStateHelperAliasesModule: GTV_MAIN_RUNTIME_STATE_HELPER_ALIASES,
    runtimeStateHelpersModule: GTV_MAIN_RUNTIME_STATE_HELPERS,
    runtimeStateHelperAccessorProxiesModule: GTV_MAIN_RUNTIME_STATE_HELPER_ACCESSOR_PROXIES,
    getMainSharedUtilsService: () => mainSharedUtilsService,
    getPatchedTimeAdjustDayStepBySlotState,
    getPatchAppState: () => patchAppState,
    getUpdateTimeAdjustPanel: () => updateTimeAdjustPanel,
    getTranslator: () => gtvT,
    getGroupContextStateService: () => groupContextStateService,
    getTimezoneSearchService: () => timezoneSearchService,
    getPatchedMultiRangeCountState,
    getPatchedMultiRangesState,
    getPatchedMultiRangeCollapsedState,
    getPatchedArrayStateValue,
    getMultiRangeStartEditEnabledState: () => multiRangeStartEditEnabled,
    getMultiRangeEndEditEnabledState: () => multiRangeEndEditEnabled,
    getPatchedMultiRangeTitleState,
    getPersistenceState,
    getGroupsState: () => groups,
    getActiveGroupIdByMainTabState: () => activeGroupIdByMainTab,
    getPatchedActiveGroupIdState
}).mainRuntimeStateHelperAccessorService;

function parseDateTimeParts(val, inputMode) {
    return mainRuntimeStateHelperAccessorService.parseDateTimeParts(val, inputMode);
}

function getTimeAdjustDayStepBySlotSnapshot() {
    return mainRuntimeStateHelperAccessorService.getTimeAdjustDayStepBySlotSnapshot();
}

function setTimeAdjustDayStepBySlotState(nextValues = []) {
    return mainRuntimeStateHelperAccessorService.setTimeAdjustDayStepBySlotState(nextValues);
}

function updateTimeAdjustPanelSafely() {
    return mainRuntimeStateHelperAccessorService.updateTimeAdjustPanelSafely();
}

function getUTCRef() {
    return mainRuntimeStateHelperAccessorService.getUTCRef();
}

function getCurrentGroup() {
    return mainRuntimeStateHelperAccessorService.getCurrentGroup();
}

function getCurrentGroupZones() {
    return mainRuntimeStateHelperAccessorService.getCurrentGroupZones();
}

function getCurrentGroupBaseTimezoneId() {
    return mainRuntimeStateHelperAccessorService.getCurrentGroupBaseTimezoneId();
}

function getBaseTimezoneRef() {
    return mainRuntimeStateHelperAccessorService.getBaseTimezoneRef();
}

function ensureBaseTimezoneSelection() {
    return mainRuntimeStateHelperAccessorService.ensureBaseTimezoneSelection();
}

function formatUtcOffsetLabel(totalMinutes = 0) {
    return mainRuntimeStateHelperAccessorService.formatUtcOffsetLabel(totalMinutes);
}

function normalizeCustomAbbr(value) {
    return mainRuntimeStateHelperAccessorService.normalizeCustomAbbr(value);
}

function getCurrentMultiRangeStateSnapshot() {
    return mainRuntimeStateHelperAccessorService.getCurrentMultiRangeStateSnapshot();
}

function getGroupsStateSnapshot() {
    return mainRuntimeStateHelperAccessorService.getGroupsStateSnapshot();
}

function getActiveGroupIdByMainTabStateSnapshot() {
    return mainRuntimeStateHelperAccessorService.getActiveGroupIdByMainTabStateSnapshot();
}

function patchPrimaryState(next = {}) {
    return mainRuntimeStateHelperAccessorService.patchPrimaryState(next);
}

function setCurrentMainTabState(nextTab) {
    return mainRuntimeStateHelperAccessorService.setCurrentMainTabState(nextTab);
}

function setActiveGroupIdState(nextId) {
    return mainRuntimeStateHelperAccessorService.setActiveGroupIdState(nextId);
}

function setActiveGroupIdByMainTabState(nextMap) {
    return mainRuntimeStateHelperAccessorService.setActiveGroupIdByMainTabState(nextMap);
}

function getActiveGroupNameSnapshot() {
    return mainRuntimeStateHelperAccessorService.getActiveGroupNameSnapshot();
}

const pad = GTV_TIME_CORE.pad;
const clampNumber = GTV_TIME_CORE.clampNumber;

const {
    parseAutoGeneratedIndexedName,
    localizeAutoGeneratedNamesForCurrentLanguage,
    getCurrentMultiSubgroup,
    getCurrentMultiSubgroupName,
    syncCurrentMultiStateToActiveSubgroup,
    loadCurrentMultiStateFromActiveSubgroup
} = mainOrchestrationFlowServices;

assertBindingCreateService(GTV_MAIN_FORMAT_PROFILE_FACADE_BINDINGS, "GTVMainFormatProfileFacadeBindings");
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
} = GTV_MAIN_FORMAT_PROFILE_FACADE_BINDINGS.createService({
    formatProfileFacadeService: mainCoreServices.mainFormatProfileFacadeService
});

assertBindingCreateService(GTV_MAIN_RUNTIME_SERVICE_CONFIG_BUILDER_BINDINGS, "GTVMainRuntimeServiceConfigBuilderBindings");
const {
    mainRuntimeServiceConfigBuilderService
} = GTV_MAIN_RUNTIME_SERVICE_CONFIG_BUILDER_BINDINGS.createService({
    runtimeServiceConfigBuilderModule: GTV_MAIN_RUNTIME_SERVICE_CONFIG_BUILDER
});
const GTV_MAIN_RUNTIME_CORE_SERVICE_BOOTSTRAP = GTV_GLOBAL.GTVMainRuntimeCoreServiceBootstrap;
assertBindingCreateService(GTV_MAIN_RUNTIME_CORE_SERVICE_BOOTSTRAP, "GTVMainRuntimeCoreServiceBootstrap");
const {
    mainSelectServices,
    adjustSelectWidthForContent,
    refreshSelectWidths,
    renderBaseTimeSelect,
    timezoneSearchService,
    snapshotFormatService
} = GTV_MAIN_RUNTIME_CORE_SERVICE_BOOTSTRAP.createService({
    mainRuntimeServiceConfigBuilderService,
    mainCoreServices,
    getDocumentRefOrNull,
    getComputedStyleSafely,
    ensureBaseTimezoneSelection,
    getCurrentGroupBaseTimezoneId,
    isCurrentGroupUtcRowVisible,
    getCurrentGroupZones,
    getZoneAbbreviation,
    getZoneDisplayName,
    setCurrentGroupBaseTimezoneId,
    savePersistenceSafely,
    gtvT,
    TZ_DATABASE,
    getZoneMapRef,
    getPatchedCurrentLangState,
    getBetterAbbr,
    getTimezoneOffset,
    getLocalizedTZLabel,
    getCurrentGroup,
    deferDynamicCall,
    getRenderListRef,
    addTimezone,
    createUniqueTimezoneId,
    DEFAULT_COPY_TIME_PARTS_ENABLED,
    MAIN_I18N_DATA,
    getUTCRef,
    getBaseTimezoneRef,
    getGlobalTimesState,
    getPatchedSlotCountState,
    getIsRealtimeState,
    getDayNightMarkerByHour,
    getFixedOffsetForDisplay,
    normalizeCustomAbbr,
    getCustomOffsetMinutes,
    pad,
    getSignedInclusiveDaySpan,
    getSignedDurationDayHourMinute,
    sanitizeTimePartsEnabled,
    sanitizeCopyFormatOrder,
    timeService
});

// --- Group Data Structures ---

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
const GTV_MAIN_RUNTIME_TABLE_IMAGE_BOOTSTRAP = GTV_GLOBAL.GTVMainRuntimeTableImageBootstrap;
assertBindingCreateService(GTV_MAIN_RUNTIME_TABLE_IMAGE_BOOTSTRAP, "GTVMainRuntimeTableImageBootstrap");
const mainRuntimeTableImageServices = GTV_MAIN_RUNTIME_TABLE_IMAGE_BOOTSTRAP.createService({
    mainRuntimeServiceConfigBuilderService,
    mainCoreServices,
    deferDynamicCall,
    getTranslatorRef,
    getShowToastRef,
    getIsRealtimeState,
    isMultiTab,
    isMultiRangeStartEditEnabled,
    isMultiRangeEndEditEnabled,
    ensureMultiRangeState,
    getPatchedMultiRangesState,
    getMultiRangeSlotDate,
    setMultiRangeSlotDate,
    syncFollowingRangesByDuration,
    syncMultiRangeStartLinks,
    parseDateTimeParts,
    getCurrentGroupZones,
    getCustomOffsetMinutes,
    getFixedOffsetForDisplayAtDate,
    getTimezoneOffset,
    resolveLocalDatePartsViaTimeService,
    buildStrictUtcDateFromPartsViaCore,
    getGlobalTimeState,
    setGlobalTimeValue,
    getUpdateClocksRef,
    getRenderListRef,
    renderMultiRangesSafely,
    getSavePersistenceSafelyRef,
    requestUiFrame,
    cancelUiFrame,
    getGroupsStateSnapshot,
    getPatchedActiveGroupIdState,
    getCurrentGroupBaseTimezoneId,
    getPersistenceServiceRef,
    getDocumentRefOrNull,
    NodeCtor: (typeof Node === "function") ? Node : null,
    rowViewCache,
    MAX_RUNTIME_CACHE_SIZE,
    getSnapshotFormatServiceRef,
    getZoneDisplayName,
    getZoneDisplayNameForUiAtDate,
    getPatchedCurrentLangState,
    getI18nDataRef,
    getPatchedSlotCountState,
    normalizeDayNightMarker,
    getDayNightGlyph,
    gtvT,
    sanitizeCopyFormatOrder,
    getPatchedDisplayFormatOrderState,
    getPatchedDisplayFormatEnabledState,
    getPatchedDisplayTimePartsEnabledState,
    getBaseTimezoneRef,
    escapeHtmlViaSharedUtils,
    removeTimezone,
    handleTimeChange,
    isCurrentGroupUtcRowVisible,
    getCurrentGroupUtcRowOrder,
    getUTCRef,
    renderBaseTimeSelect,
    updateTimeAdjustPanelSafely,
    hideFloatingTooltip,
    upgradeNativeTitleTooltips,
    createDragGhostFromRow,
    clearDragGhost,
    bindFacadeMethod,
    getCopyActionsServiceRef,
    getImageExportBridgeServiceRef,
    createDefaultTableExportContext,
    GTV_IMAGE_CLONE,
    GTV_IMAGE_FOREIGN_RENDER,
    GTV_IMAGE_EXPORT_BRIDGE,
    GTV_TABLE_IMAGE_RENDER,
    GTV_MULTI_RANGE_IMAGE_RENDER,
    TABLE_IMAGE_EXPORT_WIDTH,
    EXPORT_MONO_FONT_FAMILY,
    getCanUseForeignObjectRendererRef,
    setCanUseForeignObjectRenderer,
    getImageExportActionsServiceRef,
    isFixedTimeTab,
    prepareExportCanvas,
    drawExportCellText,
    getMultiRangeTitleTextFromRenderService
});
const timeInputMutationsService = mainRuntimeTableImageServices.timeInputMutationsService;
const {
    bindRowContainerDragAndDrop,
    initDragAndDrop,
    captureReorderableRowRects,
    animateReorderTransition,
    getAfter,
    saveOrderForContainer,
    saveOrder,
    updateRow,
    tableRenderService,
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
} = mainRuntimeTableImageServices;
imageCloneService = mainRuntimeTableImageServices.imageCloneService;
imageForeignRenderService = mainRuntimeTableImageServices.imageForeignRenderService;
imageExportBridgeService = mainRuntimeTableImageServices.imageExportBridgeService;
tableImageRenderService = mainRuntimeTableImageServices.tableImageRenderService;
multiRangeImageRenderService = mainRuntimeTableImageServices.multiRangeImageRenderService;

const GTV_MAIN_RUNTIME_DOMAIN_SERVICE_BOOTSTRAP = GTV_GLOBAL.GTVMainRuntimeDomainServiceBootstrap;
assertBindingCreateService(GTV_MAIN_RUNTIME_DOMAIN_SERVICE_BOOTSTRAP, "GTVMainRuntimeDomainServiceBootstrap");
const mainRuntimeDomainServices = GTV_MAIN_RUNTIME_DOMAIN_SERVICE_BOOTSTRAP.createService({
    mainRuntimeServiceConfigBuilderService,
    mainCoreServices,
    GTV_FIXED_TIME_CORE,
    GTV_FIXED_TIME_TIMELINE,
    GTV_FIXED_TIME_ACTIONS,
    DEFAULT_FIXED_TIME_VALUE,
    MIN_FIXED_TIME_SLOT_COUNT,
    TIMELINE_TOTAL_SECONDS,
    MAIN_I18N_DATA,
    gtvT,
    getPatchedCurrentLangState,
    sanitizeFixedTimeValue,
    getFixedOffsetForDisplayAtDate,
    getLocalPartsByTimezone,
    getUTCDateFromLocalParts,
    pad,
    sanitizeTimePartsEnabledForContext,
    getPatchedDisplayTimePartsEnabledState,
    getDefaultFixedTimeName,
    sanitizeFixedTimeName,
    getFixedDatePartsFromGroup,
    getDayNightMarkerByHour,
    getCurrentGroup,
    ensureGroupFixedTimes,
    getGlobalTimeState,
    resolveFixedTimeSlotUtcDate,
    clampNumber,
    getFixedTimeSlotCount,
    sanitizeFixedTimeId,
    getFixedTimeSlotHeaderLabel,
    sanitizeCopyFormatOrderForContext,
    sanitizeCopyFormatEnabledForContext,
    getPatchedCopyFormatOrderState,
    getPatchedCopyFormatEnabledState,
    getPatchedCopyTimePartsEnabledState,
    buildTimezoneComputedSnapshotForDatesViaSnapshotService,
    formatSnapshotTextViaSnapshotService,
    getBaseTimezoneRef,
    getRenderableTimezoneRowsFromTableRender,
    parseDateTimeParts,
    deferDynamicCall,
    getShowToastRef,
    writeClipboardText,
    buildFixedTimeDisplayPayloadAtUtc,
    getRenderFixedTimeTabRef,
    getRenderTimelineFrameRef,
    getSavePersistenceSafelyRef,
    setFixedTimeSlotCount,
    getRefreshFixedTimeSlotCountControlsRef,
    GTV_MULTI_RANGE_RENDER,
    GTV_MULTI_RANGE_COPY,
    GTV_COPY_ACTIONS,
    getCustomOffsetMinutes,
    normalizeCustomAbbr,
    getZoneAbbreviation,
    getSignedInclusiveDaySpan,
    getSignedDurationDayHourMinute,
    getZoneDisplayName,
    getZoneDisplayNameForUiAtDate,
    sanitizeMultiSubgroupNameViaState,
    getCurrentMultiSubgroupName,
    sanitizeMultiRangeTitle,
    getPatchedMultiRangeTitleState,
    buildStaticRowCellFromTableRender,
    buildDynamicRowCellFromTableRender,
    isMultiRangeStartEditEnabled,
    isMultiRangeEndEditEnabled,
    handleMultiRangeTimeChange,
    copyMultiRangeRow,
    hideFloatingTooltip,
    ensureMultiRangeState,
    refreshMultiRangeControls,
    renderMultiBulkToolSets,
    escapeHtmlViaSharedUtils,
    getDisplayColumns,
    getPatchedMultiRangesState,
    getPatchedMultiRangeCollapsedState,
    getPatchedMultiRangeCountState,
    saveMultiRangeSingleImage,
    setMultiRangesCollapsedBelow,
    toggleMultiRangeCollapsed,
    renderTimeAdjustSet,
    applyMultiRangeTimeAdjustAction,
    attachTimeAdjustToggleLabel,
    setMultiRangeStartEditEnabled,
    setMultiRangeEndEditEnabled,
    getMultiDisplayColumnHeaderFromTableRender,
    updateTimeAdjustPanelSafely,
    updateCopyFormatPreview,
    upgradeNativeTitleTooltips,
    getTimezoneRefByIdFromSnapshotService,
    buildTimezoneComputedSnapshotForRange,
    formatSnapshotText,
    getPatchedShowCopyFormatState,
    isMultiTab,
    isFixedTimeTab,
    getRowFormattedTextViaSnapshotService,
    getRowCopyTextViaSnapshotService,
    getFixedTimePreviewCopyText,
    getAllFixedTimeRowsCopyText,
    copyAllMultiRangeTimezones,
    GTV_TIME_ADJUST_UI,
    GTV_MULTI_BULK_TOOLS,
    GTV_TIME_ADJUST_ACTIONS,
    MIN_TIME_ADJUST_DAY_STEP,
    MAX_TIME_ADJUST_DAY_STEP,
    DEFAULT_TIME_ADJUST_DAY_STEP,
    savePersistenceSafely,
    applyTimeAdjustAction,
    getPatchedMainTabState,
    getIsRealtimeState,
    getPatchedSlotCountState,
    getTimeAdjustDayStepValue,
    getTimeAdjustDayStepBySlotSnapshot,
    setTimeAdjustDayStepBySlotState,
    applyBulkRangeAllAction,
    applyFirstRangeStartAdjustAction,
    setAllMultiRangeStartEditEnabled,
    setAllMultiRangeEndEditEnabled,
    getGlobalTimesState,
    getUpdateClocksRef,
    getFixedOffsetForDisplay,
    getTimeAdjustDayStep,
    timeService,
    sanitizeUtcMsViaTimeCore,
    isMultiRangeStartLinked,
    syncLinkedRangesFrom,
    getMultiRangeSlotDate,
    setMultiRangeSlotDate,
    syncFollowingRangesByDuration,
    syncMultiRangeStartLinks,
    GTV_FORMAT_CONTROLS,
    serviceBootstrap,
    COPY_FORMAT_KEYS,
    TIME_PART_KEYS,
    getRenderListRef,
    getPatchedDisplayFormatOrderState,
    getPatchedActiveFormatProfileContextState,
    patchAppState,
    syncActiveFormatProfileFromState,
    getPatchedDisplayFormatEnabledState,
    getActiveCopyFormatKeysForCurrentContext,
    getActiveTimePartKeysForCurrentContext,
    sanitizeMainTab,
    clampGroupIndex,
    normalizeGroupTabState,
    getPatchedShowTimelineState,
    setIsRealtimeState,
    setGlobalTimeState,
    setCurrentMainTabState,
    getPatchedActiveGroupIdState,
    setActiveGroupIdState,
    getActiveGroupIdByMainTabStateSnapshot,
    setActiveGroupIdByMainTabState,
    syncCurrentMultiStateToActiveSubgroup,
    loadCurrentMultiStateFromActiveSubgroup,
    bindFacadeMethod,
    getGroupTabsServiceRef,
    renderMultiRangesSafely,
    renderFixedTimeTab,
    resolveFormatProfileContext,
    activateFormatProfileContext,
    GTV_MULTI_STATE,
    MIN_MULTI_RANGE_COUNT,
    getGroupsStateSnapshot,
    getDefaultMultiRangeBounds,
    sanitizeMultiRangeCount,
    sanitizeMultiRangeItem,
    sanitizeTimezoneId,
    createUniqueTimezoneId,
    normalizeZoneAbbreviationViaSearch,
    sanitizeBaseTimezoneId,
    sanitizeUtcRowOrderViaTimeCore,
    sanitizeFixedTimes,
    sanitizeFixedDateValue,
    sanitizeFixedTimeShowLiveNow,
    getImageExportNamingServiceRef,
    getBaseTimeSnapshot,
    sanitizeMultiSubgroupNameForExport,
    GTV_IMAGE_EXPORT_NAMING,
    GTV_IMAGE_EXPORT_ACTIONS,
    GTV_IMAGE_EXPORT,
    getActiveGroupNameSnapshot,
    detectForeignObjectRendererSupport,
    renderTimezoneTableToPngDataUrl,
    renderTimezoneTableFallbackDataUrl,
    renderMultiRangesToPngDataUrl,
    renderMultiRangeSingleToPngDataUrl,
    renderMultiRangesFallbackDataUrl,
    renderMultiRangeTitlesToPngDataUrl,
    isDomExceptionLike,
    setCanUseForeignObjectRenderer,
    GTV_APP_STATE_PATCHER,
    GTV_APP_PERSISTENCE_STATE,
    getMainAppStateSource: () => ({
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
        dayStartHour,
        nightStartHour,
        currentLang: getRuntimeCurrentLangValue()
    }),
    directStateSetters,
    ensureFormatProfiles,
    getCurrentFormatProfileState,
    applyFormatProfileState
});
const {
    multiRangeRenderService,
    multiRangeCopyService,
    copyActionsService,
    formatControlsService,
    tabUiService,
    tabOrchestratorService,
    sanitizeFilenamePart,
    formatDateTimeByTimezone,
    getTimezoneTableImageFilename,
    getMultiRangeTableImageFilename,
    getMultiRangeTitlesImageFilename
} = mainRuntimeDomainServices;
fixedTimeCoreService = mainRuntimeDomainServices.fixedTimeCoreService;
fixedTimeTimelineService = mainRuntimeDomainServices.fixedTimeTimelineService;
fixedTimeActionsService = mainRuntimeDomainServices.fixedTimeActionsService;
timeAdjustUiService = mainRuntimeDomainServices.timeAdjustUiService;
multiBulkToolsService = mainRuntimeDomainServices.multiBulkToolsService;
timeAdjustActionsService = mainRuntimeDomainServices.timeAdjustActionsService;
multiStateService = mainRuntimeDomainServices.multiStateService;
groupStateService = mainRuntimeDomainServices.groupStateService;
imageExportNamingService = mainRuntimeDomainServices.imageExportNamingService;
imageExportActionsService = mainRuntimeDomainServices.imageExportActionsService;
appStatePatcherService = mainRuntimeDomainServices.appStatePatcherService;
appPersistenceStateService = mainRuntimeDomainServices.appPersistenceStateService;
ensureFormatProfiles(createDefaultFormatProfile("live"));
activateFormatProfileForCurrentContext({ syncCurrent: false });

const GTV_MAIN_RUNTIME_PERSISTENCE_COMPOSITION_BOOTSTRAP = GTV_GLOBAL.GTVMainRuntimePersistenceCompositionBootstrap;
assertBindingCreateService(
    GTV_MAIN_RUNTIME_PERSISTENCE_COMPOSITION_BOOTSTRAP,
    "GTVMainRuntimePersistenceCompositionBootstrap"
);
const mainPersistenceCompositionServices = GTV_MAIN_RUNTIME_PERSISTENCE_COMPOSITION_BOOTSTRAP.createService({
    mainCompositionConfigBuilderService,
    mainCoreServices,
    GTV_MAIN_GROUP_TABS_SERVICE,
    GTV_MAIN_PERSISTENCE_SNAPSHOT_SERVICES,
    GTV_MAIN_PERSISTENCE_SERVICES,
    GTV_GROUP_TABS,
    gtvT,
    deferDynamicCall,
    getShowToastRef,
    confirmFnViaMainFoundation,
    getPersistenceState,
    setPersistenceState,
    isMultiTab,
    getCurrentGroup,
    isFixedTimeTab,
    ensureGroupMultiSubgroupsViaState,
    normalizeGroupTabState,
    syncCurrentMultiStateToActiveSubgroup,
    loadCurrentMultiStateFromActiveSubgroup,
    renderBaseTimeSelect,
    renderMultiRangesSafely,
    renderFixedTimeTab,
    getRenderListRef,
    getRenderTimelineFrameRef,
    setCustomTooltip,
    hideFloatingTooltip,
    upgradeNativeTitleTooltips,
    getDefaultMultiSubgroupNameViaState,
    getDefaultFixedTimes,
    getDefaultFixedDate,
    createMultiSubgroupStateViaState,
    sanitizeMultiSubgroupNameViaState,
    sanitizeMultiRangeTitle,
    getPatchedActiveGroupIdState,
    getPatchedAppStateSnapshot,
    patchAppState,
    sanitizeMainTab,
    syncActiveFormatProfileFromState,
    ensureMultiRangeState,
    getGroupsStateSnapshot,
    ensureGroupFixedTimes,
    sanitizeFormatProfiles,
    getCurrentFormatProfileState,
    getCurrentGroupBaseTimezoneId,
    sanitizeCopyFormatOrder,
    sanitizeCopyFormatEnabled,
    sanitizeTimePartsEnabled,
    getTimeAdjustDayStep,
    sanitizeMultiRangeCount,
    DEFAULT_DAY_START_HOUR,
    DEFAULT_NIGHT_START_HOUR,
    sanitizeDayNightHourValue,
    getCurrentMultiSubgroupName,
    sanitizeUtcMsViaTimeCore,
    getRuntimeNowMs,
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
    MAIN_I18N_DATA,
    VERSION,
    getPersistenceSnapshot,
    sanitizeGroup,
    sanitizeBaseTimezoneId,
    sanitizeTimeAdjustDayStep,
    deriveTimePartsFromLegacyEnabled,
    sanitizeMultiStatePayloadViaState,
    ensureBaseTimezoneSelection,
    loadThemePreference,
    applyTheme,
    loadUiScalePreference,
    applyUiScale,
    populateUiScaleSelect,
    getCurrentUiScalePercent,
    refreshMultiRangeControls,
    bindFacadeMethod,
    getTimezoneSearchServiceRef,
    refreshSelectWidths,
    switchMainTab,
    tFormat,
    applyVersionBranding,
    getPatchedCurrentThemeState,
    getPatchedCurrentLangState,
    getPatchedMainTabState,
    sanitizeUtcRowOrderViaTimeCore,
    sanitizeTheme,
    sanitizeUiScalePercent,
    populateDayNightHourSelect,
    getPatchedDayStartHourState,
    getPatchedNightStartHourState,
    setCurrentLang,
    loadPersistence,
    localizeAutoGeneratedNamesForCurrentLanguage,
    sanitizeFilenamePart,
    pad,
    sanitizeMultiSubgroupIdViaState,
    getCurrentMultiSubgroup,
    getDocumentRefOrNull
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

const GTV_MAIN_RUNTIME_COMPOSITION_BOOTSTRAP = GTV_GLOBAL.GTVMainRuntimeCompositionBootstrap;
assertBindingCreateService(GTV_MAIN_RUNTIME_COMPOSITION_BOOTSTRAP, "GTVMainRuntimeCompositionBootstrap");
const mainRuntimeCompositionServices = GTV_MAIN_RUNTIME_COMPOSITION_BOOTSTRAP.createService({
    mainCompositionConfigBuilderService,
    mainCoreServices,
    GTV_MAIN_UI_RUNTIME_SERVICES,
    GTV_MAIN_CLOCK_ORCHESTRATOR_SERVICES,
    GTV_TIMELINE_FRAME,
    GTV_FIXED_TIME_TABLE,
    GTV_MAIN_UI_INIT,
    TIMELINE_TOTAL_HOURS,
    TIMELINE_TOTAL_SECONDS,
    requestUiFrame,
    cancelUiFrame,
    getPatchedMainTabState,
    getIsRealtimeState,
    getPatchedSlotCountState,
    getGlobalTimeState,
    setGlobalTimeState,
    getPatchedCurrentLangState,
    getPatchedCurrentThemeState,
    getUiScaleState,
    getPatchedDayStartHourState,
    getPatchedNightStartHourState,
    getPatchedMultiRangeCountState,
    getPatchedShowCopyFormatState,
    setPatchedShowCopyFormatState,
    getPatchedShowTimelineState,
    setPatchedShowTimelineState,
    setPatchedSlotCountState,
    getPersistenceServiceRef,
    getTableRenderServiceRef,
    getFormatControlsServiceRef,
    getGroupTabsServiceRef,
    getMultiRangeRenderServiceRef,
    getTimezoneSearchServiceRef,
    getTimeAdjustUiServiceRef,
    getTabUiServiceRef,
    getUiSettingsActionsServiceRef,
    gtvT,
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
    getDayNightMarkerByHour,
    getUTCDateFromLocalParts,
    clampNumber,
    pad,
    getUpdateClocksRef,
    deferDynamicCall,
    getCurrentGroup,
    ensureGroupFixedTimes,
    getFixedTimeDisplayPartsEnabled,
    getPatchedDisplayFormatOrderState,
    getPatchedDisplayFormatEnabledState,
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
    populateDayNightHourSelect,
    applyUiScale,
    setDayNightRange,
    setMultiRangeCount,
    refreshMultiRangeControls,
    getFixedTimeSlotCountForCurrentGroup,
    setFixedTimeSlotCount,
    refreshFixedTimeSlotCountControls,
    setCurrentGroupFixedDate,
    getCurrentGroupFixedTimeShowLiveNow,
    setCurrentGroupFixedTimeShowLiveNow,
    sanitizeFixedDateValue,
    getShowToastRef,
    normalizeCustomAbbr,
    addTimezone,
    createUniqueTimezoneId,
    syncActiveFormatProfileFromState,
    activateFormatProfileForCurrentContext,
    getRenderListRef,
    updateCopyFormatPreview,
    getRenderTimelineFrameRef,
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
    renderFixedTimeTab,
    getDocumentRefOrNull,
    getWindowRefOrNull,
    getGlobalThisRefOrNull
});
timelineFrameService = mainRuntimeCompositionServices.timelineFrameService;
fixedTimeTableService = mainRuntimeCompositionServices.fixedTimeTableService;
mainUiInitService = mainRuntimeCompositionServices.mainUiInitService;
mainClockOrchestratorService = mainRuntimeCompositionServices.mainClockOrchestratorService;
var mainRuntimeUiBridgeAccessorService = null;
var mainRuntimeOperationAccessorService = null;
const GTV_MAIN_RUNTIME_BOOTSTRAP_WIRING = GTV_GLOBAL.GTVMainRuntimeBootstrapWiring;
assertBindingCreateService(GTV_MAIN_RUNTIME_BOOTSTRAP_WIRING, "GTVMainRuntimeBootstrapWiring");
const mainRuntimeBootstrapWiringServices = GTV_MAIN_RUNTIME_BOOTSTRAP_WIRING.createService({
    runtimeUiBridgeAccessorBindings: GTV_MAIN_RUNTIME_UI_BRIDGE_ACCESSOR_BINDINGS,
    runtimeOperationAccessorBindings: GTV_MAIN_RUNTIME_OPERATION_ACCESSOR_BINDINGS,
    runtimePublicApiBindings: GTV_MAIN_RUNTIME_PUBLIC_API_BINDINGS,
    runtimeBootstrapAccessorBindings: GTV_MAIN_RUNTIME_BOOTSTRAP_ACCESSOR_BINDINGS,
    mainRuntimeServiceConfigBuilderService,
    mainCoreServices,
    runtimeUiBridgeAccessorProxiesModule: GTV_MAIN_RUNTIME_UI_BRIDGE_ACCESSOR_PROXIES,
    runtimeOperationAccessorProxiesModule: GTV_MAIN_RUNTIME_OPERATION_ACCESSOR_PROXIES,
    runtimeBootstrapAccessorProxiesModule: GTV_MAIN_RUNTIME_BOOTSTRAP_ACCESSOR_PROXIES,
    callServiceMethod,
    getAppFeedbackService: () => appFeedbackService,
    getTabOrchestratorService: () => tabOrchestratorService,
    getFormatControlsService: () => formatControlsService,
    getTableRenderService: () => tableRenderService,
    getMainTimezoneTableFacadeService: () => mainTimezoneTableFacadeService,
    getMainTimelineFacadeService: () => mainTimelineFacadeService,
    getMainFixedTimeFacadeService: () => mainFixedTimeFacadeService,
    getMainFixedTimeTabFacadeService: () => mainFixedTimeTabFacadeService,
    getPatchedSlotCountState,
    getGlobalTimeState,
    serviceMethodMissingToken: SERVICE_METHOD_MISSING,
    consoleError: console.error.bind(console),
    getMainOrchestrationFlowServices: () => mainOrchestrationFlowServices,
    getTimeInputMutationsService: () => timeInputMutationsService,
    getSnapshotFormatService: () => snapshotFormatService,
    getCalculatorActionsService: () => calculatorActionsService,
    getGroupStateService: () => groupStateService,
    getPersistenceService: () => persistenceService,
    defaultCopyTimePartsEnabled: DEFAULT_COPY_TIME_PARTS_ENABLED,
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
    bindFacadeMethod,
    getMainUiInitServiceRef,
    bindFloatingTooltipEvents,
    initDragAndDrop,
    getTimezoneSearchServiceRef,
    initCalculators,
    getTimerEngineServiceRef,
    switchMainTab,
    getPatchedMainTabState,
    deferDynamicCall,
    getUpdateClocksRef,
    showFatalError,
    getDocumentRefOrNull,
    getMainAppBootstrapService: () => mainAppBootstrapService,
    setMainAppBootstrapService: (next) => { mainAppBootstrapService = next; },
    getMainRuntimeBootstrapAccessorService: () => mainRuntimeBootstrapAccessorService,
    setMainRuntimeBootstrapAccessorService: (next) => { mainRuntimeBootstrapAccessorService = next; }
});
mainRuntimeUiBridgeAccessorService = mainRuntimeBootstrapWiringServices.mainRuntimeUiBridgeAccessorService;
mainRuntimeOperationAccessorService = mainRuntimeBootstrapWiringServices.mainRuntimeOperationAccessorService;
mainRuntimePublicApiService = mainRuntimeBootstrapWiringServices.mainRuntimePublicApiService;
mainAppBootstrapService = mainRuntimeBootstrapWiringServices.mainAppBootstrapService;
mainRuntimeBootstrapAccessorService = mainRuntimeBootstrapWiringServices.mainRuntimeBootstrapAccessorService;

function showFatalError(err) { return mainRuntimePublicApiService.showFatalError(err); }
async function initApp() { return await mainRuntimePublicApiService.initApp(); }
function startBootstrapOnDomReady(initFn) { return mainRuntimePublicApiService.startBootstrapOnDomReady(initFn); }
function showToast(message, options = {}) { return mainRuntimePublicApiService.showToast(message, options); }
function switchMainTab(tab) { return mainRuntimePublicApiService.switchMainTab(tab); }
function refreshOptionToggleDividers() { return mainRuntimePublicApiService.refreshOptionToggleDividers(); }
function getCopyFieldLabel(key) { return mainRuntimePublicApiService.getCopyFieldLabel(key); }
function getTimePartLabel(partKey) { return mainRuntimePublicApiService.getTimePartLabel(partKey); }
function getDisplayColumns(effectiveSlotCount) { return mainRuntimePublicApiService.getDisplayColumns(effectiveSlotCount); }
function getDisplayTimeInputMode() { return mainRuntimePublicApiService.getDisplayTimeInputMode(); }
function buildRowActionCells(copyButtonTitle, removeButtonText, removeButtonTitle = "") {
    return mainRuntimePublicApiService.buildRowActionCells(copyButtonTitle, removeButtonText, removeButtonTitle);
}
function renderList() { return mainRuntimePublicApiService.renderList(); }
function renderTimelineFrame() { return mainRuntimePublicApiService.renderTimelineFrame(); }
function resolveFixedTimeSlotUtcDate(slot, baseRef, anchorDate = getGlobalTimeState(0)) {
    return mainRuntimePublicApiService.resolveFixedTimeSlotUtcDate(slot, baseRef, anchorDate);
}
function getFixedTimeSlotHeaderLabel(slot, slotIdx, slotCount = 1) {
    return mainRuntimePublicApiService.getFixedTimeSlotHeaderLabel(slot, slotIdx, slotCount);
}
function renderFixedTimeTab(isTick = false) { return mainRuntimePublicApiService.renderFixedTimeTab(isTick); }
function updateClocks() { return mainRuntimePublicApiService.updateClocks(); }
function resolveLocalDatePartsByTimezoneAtDate(timezone, utcDate, timezoneId = null) {
    return mainRuntimePublicApiService.resolveLocalDatePartsByTimezoneAtDate(timezone, utcDate, timezoneId);
}
function resolveLocalDatePartsByTimezone(timezone, slotIdx, timezoneId = null) {
    return mainRuntimePublicApiService.resolveLocalDatePartsByTimezone(timezone, slotIdx, timezoneId);
}
function buildStrictUtcDateFromParts(parts) { return mainRuntimePublicApiService.buildStrictUtcDateFromParts(parts); }
function handleTimeChange(val, timezone, slotIdx, timezoneId = null, inputMode = "datetime") {
    return mainRuntimePublicApiService.handleTimeChange(val, timezone, slotIdx, timezoneId, inputMode);
}
function handleMultiRangeTimeChange(rangeIdx, val, timezone, slotIdx, timezoneId = null, inputMode = "datetime") {
    return mainRuntimePublicApiService.handleMultiRangeTimeChange(
        rangeIdx,
        val,
        timezone,
        slotIdx,
        timezoneId,
        inputMode
    );
}
function formatTimeTextByParts(snapshot, timePartsEnabled) {
    return mainRuntimePublicApiService.formatTimeTextByParts(snapshot, timePartsEnabled);
}
function formatSnapshotText(snapshot, order, enabled, timePartsEnabled = DEFAULT_COPY_TIME_PARTS_ENABLED) {
    return mainRuntimePublicApiService.formatSnapshotText(snapshot, order, enabled, timePartsEnabled);
}
function initCalculators() { return mainRuntimePublicApiService.initCalculators(); }
async function copyText(elementId, isInput = false) { return await mainRuntimePublicApiService.copyText(elementId, isInput); }
function getPersistenceSnapshot() { return mainRuntimePublicApiService.getPersistenceSnapshot(); }
function sanitizeGroup(group, idx, legacyMultiState = null) {
    return mainRuntimePublicApiService.sanitizeGroup(group, idx, legacyMultiState);
}
async function loadPersistence() { return await mainRuntimePublicApiService.loadPersistence(); }

startBootstrapOnDomReady(initApp);

const GTV_MAIN_TEST_HELPERS = GTV_GLOBAL.GTVMainTestHelpers;
const GTV_MAIN_TEST_HELPERS_BINDINGS = GTV_GLOBAL.GTVMainTestHelpersBindings;
assertBindingCreateService(GTV_MAIN_TEST_HELPERS_BINDINGS, "GTVMainTestHelpersBindings");
const {
    mainTestHelpersService
} = GTV_MAIN_TEST_HELPERS_BINDINGS.createService({
    testHelpersModule: GTV_MAIN_TEST_HELPERS,
    getGlobalRef: () => GTV_GLOBAL,
    resolveValue: (key) => {
        if (!Object.prototype.hasOwnProperty.call(GTV_GLOBAL, key)) return null;
        return GTV_GLOBAL[key];
    },
    isEnabled: () => !!GTV_GLOBAL.__GTV_ENABLE_MAIN_TEST_HOOKS__
});
mainTestHelpersService.install();

// --- main.js end ---
