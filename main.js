let isRealtime = true;
const GTV_GLOBAL = (typeof window !== "undefined" && window) ? window : globalThis;
let mainRuntimeLangStateService = null;
let mainDayNightRangeUtilsService = null;
let mainRuntimeCoreAccessorService = null;
function callRuntimeCoreAccessor(methodName, args, fallbackFn) {
    if (
        mainRuntimeCoreAccessorService
        && typeof mainRuntimeCoreAccessorService[methodName] === "function"
    ) {
        return mainRuntimeCoreAccessorService[methodName](...args);
    }
    return fallbackFn(...args);
}
function syncRealtimeFlagToGlobal(value) {
    return callRuntimeCoreAccessor(
        "syncRealtimeFlagToGlobal",
        [value],
        (nextValue) => mainRuntimeLangStateService.syncRealtimeFlagToGlobal(nextValue)
    );
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
function getRuntimeCurrentLangValue() {
    return callRuntimeCoreAccessor(
        "getRuntimeCurrentLangValue",
        [],
        () => mainRuntimeLangStateService.getRuntimeCurrentLangValue()
    );
}

function syncCurrentLang(next) {
    return callRuntimeCoreAccessor(
        "syncCurrentLang",
        [next],
        (nextValue) => mainRuntimeLangStateService.syncCurrentLang(nextValue)
    );
}
const GTV_MAIN_CONSTANTS = GTV_GLOBAL.GTVMainConstants;
const GTV_MAIN_CONSTANTS_BINDINGS = GTV_GLOBAL.GTVMainConstantsBindings;
if (
    !GTV_MAIN_CONSTANTS_BINDINGS
    || typeof GTV_MAIN_CONSTANTS_BINDINGS.createService !== "function"
) {
    throw new Error("Missing required module API: GTVMainConstantsBindings.createService");
}
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
if (
    !GTV_MAIN_RUNTIME_LANG_STATE_BINDINGS
    || typeof GTV_MAIN_RUNTIME_LANG_STATE_BINDINGS.createService !== "function"
) {
    throw new Error("Missing required module API: GTVMainRuntimeLangStateBindings.createService");
}
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
if (
    !GTV_MAIN_DAY_NIGHT_RANGE_UTILS_BINDINGS
    || typeof GTV_MAIN_DAY_NIGHT_RANGE_UTILS_BINDINGS.createService !== "function"
) {
    throw new Error("Missing required module API: GTVMainDayNightRangeUtilsBindings.createService");
}
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
if (
    !GTV_MAIN_APP_STATE_VARS_BINDINGS
    || typeof GTV_MAIN_APP_STATE_VARS_BINDINGS.createService !== "function"
) {
    throw new Error("Missing required module API: GTVMainAppStateVarsBindings.createService");
}
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
if (
    !GTV_MAIN_STATE_INITIALIZER_BINDINGS
    || typeof GTV_MAIN_STATE_INITIALIZER_BINDINGS.createService !== "function"
) {
    throw new Error("Missing required module API: GTVMainStateInitializerBindings.createService");
}
const {
    mainStateInitializerService
} = GTV_MAIN_STATE_INITIALIZER_BINDINGS.createService({
    stateInitializerModule: GTV_MAIN_STATE_INITIALIZER
});
const initialMainState = (mainAppStateVarsService && typeof mainAppStateVarsService === "object")
    ? (mainAppStateVarsService.initialState || {})
    : {};
function sanitizeDayNightHourValue(value, fallbackHour = DEFAULT_DAY_START_HOUR) {
    return callRuntimeCoreAccessor(
        "sanitizeDayNightHourValue",
        [value, fallbackHour],
        (nextValue, nextFallbackHour) => mainDayNightRangeUtilsService.sanitizeDayNightHourValue(nextValue, nextFallbackHour)
    );
}

function normalizeDayNightRangeValues(dayStartHourInput, nightStartHourInput) {
    return callRuntimeCoreAccessor(
        "normalizeDayNightRangeValues",
        [dayStartHourInput, nightStartHourInput],
        (nextDayStartHourInput, nextNightStartHourInput) => (
            mainDayNightRangeUtilsService.normalizeDayNightRangeValues(nextDayStartHourInput, nextNightStartHourInput)
        )
    );
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

function callRuntimeStatePatchAccessor(methodName, args, fallbackFn) {
    if (
        mainRuntimeStatePatchAccessorService
        && typeof mainRuntimeStatePatchAccessorService[methodName] === "function"
    ) {
        return mainRuntimeStatePatchAccessorService[methodName](...args);
    }
    return fallbackFn(...args);
}

function applyDirectStatePatch(next = {}) {
    return callRuntimeStatePatchAccessor("applyDirectStatePatch", [next], (nextPatch = {}) => {
        if (
            mainDirectStatePatchService
            && typeof mainDirectStatePatchService.applyDirectStatePatch === "function"
        ) {
            return mainDirectStatePatchService.applyDirectStatePatch(nextPatch);
        }
        if (!nextPatch || typeof nextPatch !== "object") return;
        Object.keys(directStateSetters).forEach((key) => {
            if (!Object.prototype.hasOwnProperty.call(nextPatch, key)) return;
            const setter = directStateSetters[key];
            if (typeof setter !== "function") return;
            if (key === "showTimeline") {
                setter(!!nextPatch.showTimeline);
                return;
            }
            setter(nextPatch[key]);
        });
        if (
            Object.prototype.hasOwnProperty.call(nextPatch, "dayStartHour")
            || Object.prototype.hasOwnProperty.call(nextPatch, "nightStartHour")
        ) {
            const normalized = normalizeDayNightRangeValues(dayStartHour, nightStartHour);
            dayStartHour = normalized.dayStartHour;
            nightStartHour = normalized.nightStartHour;
        }
        if (Object.prototype.hasOwnProperty.call(nextPatch, "isRealtime")) {
            setIsRealtimeState(nextPatch.isRealtime);
        }
    });
}

const SERVICE_METHOD_MISSING = Symbol("GTV_SERVICE_METHOD_MISSING");
const GTV_MAIN_BOOTSTRAP_GUARD = GTV_GLOBAL.GTVMainBootstrapGuard;
const GTV_MAIN_BOOTSTRAP_GUARD_BINDINGS = GTV_GLOBAL.GTVMainBootstrapGuardBindings;
const GTV_MAIN_RUNTIME_HOST_UTILS = GTV_GLOBAL.GTVMainRuntimeHostUtils;
const GTV_MAIN_RUNTIME_HOST_UTILS_BINDINGS = GTV_GLOBAL.GTVMainRuntimeHostUtilsBindings;
const GTV_MAIN_RUNTIME_HOST_ACCESSOR_PROXIES = GTV_GLOBAL.GTVMainRuntimeHostAccessorProxies;
const GTV_MAIN_RUNTIME_HOST_ACCESSOR_BINDINGS = GTV_GLOBAL.GTVMainRuntimeHostAccessorBindings;
const GTV_MAIN_RUNTIME_PRIMARY_STATE = GTV_GLOBAL.GTVMainRuntimePrimaryState;
const GTV_MAIN_RUNTIME_PRIMARY_STATE_BINDINGS = GTV_GLOBAL.GTVMainRuntimePrimaryStateBindings;
const GTV_MAIN_RUNTIME_PRIMARY_STATE_ACCESSOR_PROXIES = GTV_GLOBAL.GTVMainRuntimePrimaryStateAccessorProxies;
const GTV_MAIN_RUNTIME_PRIMARY_STATE_ACCESSOR_BINDINGS = GTV_GLOBAL.GTVMainRuntimePrimaryStateAccessorBindings;
const GTV_MAIN_RUNTIME_SERVICE_BRIDGE_HELPERS = GTV_GLOBAL.GTVMainRuntimeServiceBridgeHelpers;
const GTV_MAIN_RUNTIME_SERVICE_BRIDGE_HELPER_BINDINGS = GTV_GLOBAL.GTVMainRuntimeServiceBridgeHelperBindings;
const GTV_MAIN_RUNTIME_SERVICE_BRIDGE_ACCESSOR_PROXIES = GTV_GLOBAL.GTVMainRuntimeServiceBridgeAccessorProxies;
const GTV_MAIN_RUNTIME_SERVICE_BRIDGE_ACCESSOR_BINDINGS = GTV_GLOBAL.GTVMainRuntimeServiceBridgeAccessorBindings;
const GTV_MAIN_RUNTIME_UI_BRIDGE_ACCESSOR_PROXIES = GTV_GLOBAL.GTVMainRuntimeUiBridgeAccessorProxies;
const GTV_MAIN_RUNTIME_UI_BRIDGE_ACCESSOR_BINDINGS = GTV_GLOBAL.GTVMainRuntimeUiBridgeAccessorBindings;
const GTV_MAIN_RUNTIME_OPERATION_ACCESSOR_PROXIES = GTV_GLOBAL.GTVMainRuntimeOperationAccessorProxies;
const GTV_MAIN_RUNTIME_OPERATION_ACCESSOR_BINDINGS = GTV_GLOBAL.GTVMainRuntimeOperationAccessorBindings;
const GTV_MAIN_RUNTIME_BOOTSTRAP_ACCESSOR_PROXIES = GTV_GLOBAL.GTVMainRuntimeBootstrapAccessorProxies;
const GTV_MAIN_RUNTIME_BOOTSTRAP_ACCESSOR_BINDINGS = GTV_GLOBAL.GTVMainRuntimeBootstrapAccessorBindings;
const GTV_MAIN_RUNTIME_CORE_ACCESSOR_PROXIES = GTV_GLOBAL.GTVMainRuntimeCoreAccessorProxies;
const GTV_MAIN_RUNTIME_CORE_ACCESSOR_BINDINGS = GTV_GLOBAL.GTVMainRuntimeCoreAccessorBindings;
const GTV_MAIN_RUNTIME_STATE_PATCH_ACCESSOR_PROXIES = GTV_GLOBAL.GTVMainRuntimeStatePatchAccessorProxies;
const GTV_MAIN_RUNTIME_STATE_PATCH_ACCESSOR_BINDINGS = GTV_GLOBAL.GTVMainRuntimeStatePatchAccessorBindings;
const GTV_MAIN_RUNTIME_PATCHED_STATE_FALLBACK = GTV_GLOBAL.GTVMainRuntimePatchedStateFallback;
const GTV_MAIN_RUNTIME_PATCHED_STATE_FALLBACK_BINDINGS = GTV_GLOBAL.GTVMainRuntimePatchedStateFallbackBindings;
const GTV_MAIN_RUNTIME_LOCAL_STATE_HELPERS = GTV_GLOBAL.GTVMainRuntimeLocalStateHelpers;
const GTV_MAIN_RUNTIME_LOCAL_STATE_HELPERS_BINDINGS = GTV_GLOBAL.GTVMainRuntimeLocalStateHelpersBindings;
const GTV_MAIN_RUNTIME_LOCAL_STATE_ACCESSOR_PROXIES = GTV_GLOBAL.GTVMainRuntimeLocalStateAccessorProxies;
const GTV_MAIN_RUNTIME_LOCAL_STATE_ACCESSOR_BINDINGS = GTV_GLOBAL.GTVMainRuntimeLocalStateAccessorBindings;
const GTV_MAIN_FACADE_BINDINGS = GTV_GLOBAL.GTVMainFacadeBindings;
const GTV_MAIN_RUNTIME_BRIDGE_PROXIES = GTV_GLOBAL.GTVMainRuntimeBridgeProxies;
const GTV_MAIN_RUNTIME_BRIDGE_PROXY_BINDINGS = GTV_GLOBAL.GTVMainRuntimeBridgeProxyBindings;
const GTV_MAIN_RUNTIME_TIMEZONE_HELPERS = GTV_GLOBAL.GTVMainRuntimeTimezoneHelpers;
const GTV_MAIN_RUNTIME_TIMEZONE_HELPER_BINDINGS = GTV_GLOBAL.GTVMainRuntimeTimezoneHelperBindings;
const GTV_MAIN_RUNTIME_STATE_HELPERS = GTV_GLOBAL.GTVMainRuntimeStateHelpers;
const GTV_MAIN_RUNTIME_STATE_HELPER_ALIASES = GTV_GLOBAL.GTVMainRuntimeStateHelperAliases;
const GTV_MAIN_RUNTIME_STATE_HELPER_ALIASES_BINDINGS = GTV_GLOBAL.GTVMainRuntimeStateHelperAliasesBindings;
const GTV_MAIN_RUNTIME_STATE_HELPER_ACCESSOR_PROXIES = GTV_GLOBAL.GTVMainRuntimeStateHelperAccessorProxies;
const GTV_MAIN_RUNTIME_STATE_HELPER_ACCESSOR_BINDINGS = GTV_GLOBAL.GTVMainRuntimeStateHelperAccessorBindings;
const GTV_MAIN_FORMAT_PROFILE_FACADE_BINDINGS = GTV_GLOBAL.GTVMainFormatProfileFacadeBindings;
const GTV_MAIN_CORE_SERVICE_ASSEMBLY_BINDINGS = GTV_GLOBAL.GTVMainCoreServiceAssemblyBindings;
const GTV_MAIN_FOUNDATION_SERVICES_BINDINGS = GTV_GLOBAL.GTVMainFoundationServicesBindings;
const GTV_MAIN_RUNTIME_REFERENCE_ACCESSOR_BINDINGS = GTV_GLOBAL.GTVMainRuntimeReferenceAccessorBindings;
const GTV_MAIN_RUNTIME_REFERENCE_ACCESSORS = GTV_GLOBAL.GTVMainRuntimeReferenceAccessors;
const GTV_MAIN_STATE_DOMAIN_WRAPPER_BRIDGE = GTV_GLOBAL.GTVMainStateDomainWrapperBridge;
const GTV_MAIN_STATE_DOMAIN_WRAPPER_BRIDGE_BINDINGS = GTV_GLOBAL.GTVMainStateDomainWrapperBridgeBindings;
const GTV_MAIN_STATE_DOMAIN_WRAPPER_GLOBAL_BINDINGS = GTV_GLOBAL.GTVMainStateDomainWrapperGlobalBindings;
const GTV_MAIN_STATE_DOMAIN_WRAPPER_GLOBAL_BINDINGS_BRIDGE = GTV_GLOBAL.GTVMainStateDomainWrapperGlobalBindingsBridge;
const GTV_MAIN_STATE_DOMAIN_PROXY_BINDINGS = GTV_GLOBAL.GTVMainStateDomainProxyBindings;
const GTV_MAIN_FACADE_METHOD_BINDER = GTV_GLOBAL.GTVMainFacadeMethodBinder;
const GTV_MAIN_FACADE_METHOD_BINDER_BINDINGS = GTV_GLOBAL.GTVMainFacadeMethodBinderBindings;
const GTV_MAIN_FACADE_BRIDGE = GTV_GLOBAL.GTVMainFacadeBridge;
const GTV_MAIN_FACADE_BRIDGE_BINDINGS = GTV_GLOBAL.GTVMainFacadeBridgeBindings;
const GTV_MAIN_COMPOSITION_CONFIG_BUILDER = GTV_GLOBAL.GTVMainCompositionConfigBuilder;
const GTV_MAIN_COMPOSITION_CONFIG_BUILDER_BINDINGS = GTV_GLOBAL.GTVMainCompositionConfigBuilderBindings;
const GTV_MAIN_CORE_ASSEMBLY_CONFIG_BUILDER = GTV_GLOBAL.GTVMainCoreAssemblyConfigBuilder;
const GTV_MAIN_CORE_ASSEMBLY_CONFIG_BUILDER_BINDINGS = GTV_GLOBAL.GTVMainCoreAssemblyConfigBuilderBindings;
const GTV_MAIN_CORE_SERVICE_BINDINGS = GTV_GLOBAL.GTVMainCoreServiceBindings;
const GTV_MAIN_FOUNDATION_SERVICE_BINDINGS = GTV_GLOBAL.GTVMainFoundationServiceBindings;
const GTV_MAIN_RUNTIME_SERVICE_CONFIG_BUILDER = GTV_GLOBAL.GTVMainRuntimeServiceConfigBuilder;
const GTV_MAIN_RUNTIME_SERVICE_CONFIG_BUILDER_BINDINGS = GTV_GLOBAL.GTVMainRuntimeServiceConfigBuilderBindings;
const GTV_MAIN_PATCHED_STATE_ACCESSOR_PROXIES = GTV_GLOBAL.GTVMainPatchedStateAccessorProxies;
const GTV_MAIN_PATCHED_STATE_ACCESSOR_BINDINGS = GTV_GLOBAL.GTVMainPatchedStateAccessorBindings;
const REQUIRED_BOOTSTRAP_SPECS = Object.freeze([
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
]);
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

if (
    GTV_MAIN_RUNTIME_SERVICE_BRIDGE_HELPER_BINDINGS
    && typeof GTV_MAIN_RUNTIME_SERVICE_BRIDGE_HELPER_BINDINGS.createService === "function"
    && GTV_MAIN_RUNTIME_SERVICE_BRIDGE_HELPERS
    && typeof GTV_MAIN_RUNTIME_SERVICE_BRIDGE_HELPERS.createService === "function"
) {
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
}

var warnMissingServiceMethod;
var showMissingFeatureToastOnce;
var getServiceMethod;
var callServiceMethod;
var savePersistenceSafely;
var renderMultiRangesSafely;
if (
    GTV_MAIN_RUNTIME_SERVICE_BRIDGE_ACCESSOR_BINDINGS
    && typeof GTV_MAIN_RUNTIME_SERVICE_BRIDGE_ACCESSOR_BINDINGS.createService === "function"
    && GTV_MAIN_RUNTIME_SERVICE_BRIDGE_ACCESSOR_PROXIES
    && typeof GTV_MAIN_RUNTIME_SERVICE_BRIDGE_ACCESSOR_PROXIES.createService === "function"
) {
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
} else {
    const callRuntimeServiceBridgeHelper = function callRuntimeServiceBridgeHelper(methodName, args, fallbackFn) {
        if (
            mainRuntimeServiceBridgeHelpersService
            && typeof mainRuntimeServiceBridgeHelpersService[methodName] === "function"
        ) {
            return mainRuntimeServiceBridgeHelpersService[methodName](...args);
        }
        return fallbackFn(...args);
    };
    warnMissingServiceMethod = function warnMissingServiceMethodFallback(serviceName, methodName) {
        return callRuntimeServiceBridgeHelper(
            "warnMissingServiceMethod",
            [serviceName, methodName],
            (nextServiceName, nextMethodName) => {
                if (
                    mainServiceMethodBridgeService
                    && typeof mainServiceMethodBridgeService.warnMissingServiceMethod === "function"
                ) {
                    return mainServiceMethodBridgeService.warnMissingServiceMethod(nextServiceName, nextMethodName);
                }
                console.warn(`[GTV] ${nextServiceName}.${nextMethodName} is unavailable. Fallback path will be used.`);
            }
        );
    };
    showMissingFeatureToastOnce = function showMissingFeatureToastOnceFallback(featureKey = "") {
        return callRuntimeServiceBridgeHelper(
            "showMissingFeatureToastOnce",
            [featureKey],
            (nextFeatureKey) => {
                const key = String(nextFeatureKey || "").trim();
                if (!key) return;
                const messageKey = "toast_required_feature_module_missing";
                const localized = gtvT(messageKey);
                const message = (typeof localized === "string" && localized !== messageKey)
                    ? localized
                    : "A required feature module is unavailable. Refresh and try again.";
                callServiceMethod(
                    "appFeedbackService",
                    appFeedbackService,
                    "showToast",
                    [message, { type: "warning" }]
                );
            }
        );
    };
    getServiceMethod = function getServiceMethodFallback(serviceName, serviceRef, methodName, options = {}) {
        return callRuntimeServiceBridgeHelper(
            "getServiceMethod",
            [serviceName, serviceRef, methodName, options],
            (nextServiceName, nextServiceRef, nextMethodName, nextOptions = {}) => {
                if (
                    mainServiceMethodBridgeService
                    && typeof mainServiceMethodBridgeService.getServiceMethod === "function"
                ) {
                    return mainServiceMethodBridgeService.getServiceMethod(
                        nextServiceName,
                        nextServiceRef,
                        nextMethodName,
                        nextOptions
                    );
                }
                if (nextServiceRef && typeof nextServiceRef[nextMethodName] === "function") {
                    return nextServiceRef[nextMethodName].bind(nextServiceRef);
                }
                warnMissingServiceMethod(nextServiceName, nextMethodName);
                if (nextOptions.toastOnMissing) {
                    showMissingFeatureToastOnce(nextOptions.featureKey || `${nextServiceName}.${nextMethodName}`);
                }
                return null;
            }
        );
    };
    callServiceMethod = function callServiceMethodFallback(serviceName, serviceRef, methodName, args = [], options = {}) {
        return callRuntimeServiceBridgeHelper(
            "callServiceMethod",
            [serviceName, serviceRef, methodName, args, options],
            (nextServiceName, nextServiceRef, nextMethodName, nextArgs = [], nextOptions = {}) => {
                const method = getServiceMethod(nextServiceName, nextServiceRef, nextMethodName, nextOptions);
                if (!method) return nextOptions.fallback;
                return method(...nextArgs);
            }
        );
    };
    savePersistenceSafely = function savePersistenceSafelyFallback(...args) {
        return callRuntimeServiceBridgeHelper(
            "savePersistenceSafely",
            [args],
            (nextArgs) => callServiceMethod(
                "persistenceService",
                persistenceService,
                "savePersistence",
                nextArgs
            )
        );
    };
    renderMultiRangesSafely = function renderMultiRangesSafelyFallback() {
        return callRuntimeServiceBridgeHelper(
            "renderMultiRangesSafely",
            [],
            () => callServiceMethod(
                "mainMultiRangeTabFacadeService",
                mainMultiRangeTabFacadeService,
                "renderMultiRanges",
                [],
                { fallback: undefined }
            )
        );
    };
}

if (
    !GTV_MAIN_FACADE_METHOD_BINDER_BINDINGS
    || typeof GTV_MAIN_FACADE_METHOD_BINDER_BINDINGS.createService !== "function"
) {
    throw new Error("Missing required module API: GTVMainFacadeMethodBinderBindings.createService");
}
const {
    deriveFacadeServiceName,
    bindFacadeMethod
} = GTV_MAIN_FACADE_METHOD_BINDER_BINDINGS.createService({
    facadeMethodBinderModule: GTV_MAIN_FACADE_METHOD_BINDER,
    callServiceMethod
});

if (
    !GTV_MAIN_BOOTSTRAP_GUARD_BINDINGS
    || typeof GTV_MAIN_BOOTSTRAP_GUARD_BINDINGS.createService !== "function"
) {
    throw new Error("Missing required module API: GTVMainBootstrapGuardBindings.createService");
}
const {
    mainBootstrapGuardService
} = GTV_MAIN_BOOTSTRAP_GUARD_BINDINGS.createService({
    bootstrapGuardModule: GTV_MAIN_BOOTSTRAP_GUARD,
    serviceGetters: REQUIRED_BOOTSTRAP_SERVICE_GETTERS,
    getServiceMethod,
    requiredSpecs: REQUIRED_BOOTSTRAP_SPECS
});

if (
    GTV_MAIN_RUNTIME_CORE_ACCESSOR_BINDINGS
    && typeof GTV_MAIN_RUNTIME_CORE_ACCESSOR_BINDINGS.createService === "function"
    && GTV_MAIN_RUNTIME_CORE_ACCESSOR_PROXIES
    && typeof GTV_MAIN_RUNTIME_CORE_ACCESSOR_PROXIES.createService === "function"
) {
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
}

function assertRequiredServices() {
    return callRuntimeCoreAccessor(
        "assertRequiredServices",
        [],
        () => mainBootstrapGuardService.assertRequiredServices()
    );
}

var applyVersionBranding;

if (
    !GTV_MAIN_RUNTIME_BRIDGE_PROXY_BINDINGS
    || typeof GTV_MAIN_RUNTIME_BRIDGE_PROXY_BINDINGS.createService !== "function"
) {
    throw new Error("Missing required module API: GTVMainRuntimeBridgeProxyBindings.createService");
}
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
if (
    !GTV_MAIN_MODULE_RESOLUTION_BINDINGS
    || typeof GTV_MAIN_MODULE_RESOLUTION_BINDINGS.createService !== "function"
) {
    throw new Error("Missing required module API: GTVMainModuleResolutionBindings.createService");
}
const {
    resolveModulesFromSpec
} = GTV_MAIN_MODULE_RESOLUTION_BINDINGS.createService({
    moduleResolverModule: GTV_MAIN_MODULE_RESOLVER,
    moduleSpecModule: GTV_MAIN_MODULE_SPEC
});
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
} = resolveModulesFromSpec();

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
if (
    !GTV_MAIN_RUNTIME_HOST_UTILS_BINDINGS
    || typeof GTV_MAIN_RUNTIME_HOST_UTILS_BINDINGS.createService !== "function"
) {
    throw new Error("Missing required module API: GTVMainRuntimeHostUtilsBindings.createService");
}
({
    mainRuntimeHostUtilsService
} = GTV_MAIN_RUNTIME_HOST_UTILS_BINDINGS.createService({
    runtimeHostUtilsModule: GTV_MAIN_RUNTIME_HOST_UTILS,
    appDisplayName: APP_DISPLAY_NAME,
    version: VERSION,
    getGlobalRef: () => GTV_GLOBAL
}));
if (
    !GTV_MAIN_RUNTIME_HOST_ACCESSOR_BINDINGS
    || typeof GTV_MAIN_RUNTIME_HOST_ACCESSOR_BINDINGS.createService !== "function"
) {
    throw new Error("Missing required module API: GTVMainRuntimeHostAccessorBindings.createService");
}
({
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
    deferDynamicCall
} = GTV_MAIN_RUNTIME_HOST_ACCESSOR_BINDINGS.createService({
    runtimeHostAccessorProxiesModule: GTV_MAIN_RUNTIME_HOST_ACCESSOR_PROXIES,
    getMainRuntimeHostUtilsService: () => mainRuntimeHostUtilsService
}));

if (
    !GTV_MAIN_RUNTIME_PRIMARY_STATE_BINDINGS
    || typeof GTV_MAIN_RUNTIME_PRIMARY_STATE_BINDINGS.createService !== "function"
) {
    throw new Error("Missing required module API: GTVMainRuntimePrimaryStateBindings.createService");
}
({
    mainRuntimePrimaryStateService
} = GTV_MAIN_RUNTIME_PRIMARY_STATE_BINDINGS.createService({
    runtimePrimaryStateModule: GTV_MAIN_RUNTIME_PRIMARY_STATE,
    getIsRealtime: () => isRealtime,
    setIsRealtime: (next) => { isRealtime = !!next; },
    syncRealtimeFlagToGlobal,
    getGlobalTimes: () => globalTimes,
    setGlobalTimes: (next) => { globalTimes = next; },
    getUiScale: () => uiScale
}));
if (
    !GTV_MAIN_RUNTIME_PRIMARY_STATE_ACCESSOR_BINDINGS
    || typeof GTV_MAIN_RUNTIME_PRIMARY_STATE_ACCESSOR_BINDINGS.createService !== "function"
) {
    throw new Error("Missing required module API: GTVMainRuntimePrimaryStateAccessorBindings.createService");
}
({
    setIsRealtimeState,
    getIsRealtimeState,
    getGlobalTimesState,
    getGlobalTimeState,
    setGlobalTimeState,
    getUiScaleState
} = GTV_MAIN_RUNTIME_PRIMARY_STATE_ACCESSOR_BINDINGS.createService({
    runtimePrimaryStateAccessorProxiesModule: GTV_MAIN_RUNTIME_PRIMARY_STATE_ACCESSOR_PROXIES,
    getMainRuntimePrimaryStateService: () => mainRuntimePrimaryStateService,
    getIsRealtime: () => isRealtime,
    setIsRealtime: (next) => { isRealtime = !!next; },
    syncRealtimeFlagToGlobal,
    getGlobalTimes: () => globalTimes,
    setGlobalTimes: (next) => { globalTimes = next; },
    getUiScale: () => uiScale
}));
if (
    GTV_MAIN_RUNTIME_PATCHED_STATE_FALLBACK_BINDINGS
    && typeof GTV_MAIN_RUNTIME_PATCHED_STATE_FALLBACK_BINDINGS.createService === "function"
    && GTV_MAIN_RUNTIME_PATCHED_STATE_FALLBACK
    && typeof GTV_MAIN_RUNTIME_PATCHED_STATE_FALLBACK.createService === "function"
) {
    ({
        mainRuntimePatchedStateFallbackService
    } = GTV_MAIN_RUNTIME_PATCHED_STATE_FALLBACK_BINDINGS.createService({
        runtimePatchedStateFallbackModule: GTV_MAIN_RUNTIME_PATCHED_STATE_FALLBACK,
        getNormalizeDayNightRangeValues: normalizeDayNightRangeValues,
        getRuntimeCurrentLangValue,
        getCurrentMainTab: () => currentMainTab,
        getSlotCount: () => slotCount,
        getShowCopyFormat: () => showCopyFormat,
        getShowTimeline: () => showTimeline,
        getCurrentTheme: () => currentTheme,
        getDayStartHour: () => dayStartHour,
        getNightStartHour: () => nightStartHour,
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
        getMultiRangeTitle: () => multiRangeTitle
    }));
}
if (
    GTV_MAIN_RUNTIME_STATE_PATCH_ACCESSOR_BINDINGS
    && typeof GTV_MAIN_RUNTIME_STATE_PATCH_ACCESSOR_BINDINGS.createService === "function"
    && GTV_MAIN_RUNTIME_STATE_PATCH_ACCESSOR_PROXIES
    && typeof GTV_MAIN_RUNTIME_STATE_PATCH_ACCESSOR_PROXIES.createService === "function"
) {
    mainRuntimeStatePatchAccessorService = GTV_MAIN_RUNTIME_STATE_PATCH_ACCESSOR_BINDINGS.createService({
        runtimeStatePatchAccessorProxiesModule: GTV_MAIN_RUNTIME_STATE_PATCH_ACCESSOR_PROXIES,
        getMainDirectStatePatchService: () => mainDirectStatePatchService,
        getDirectStateSetters: () => directStateSetters,
        getNormalizeDayNightRangeValues: () => normalizeDayNightRangeValues,
        getDayStartHour: () => dayStartHour,
        setDayStartHour: (next) => { dayStartHour = next; },
        getNightStartHour: () => nightStartHour,
        setNightStartHour: (next) => { nightStartHour = next; },
        getSetIsRealtimeState: () => setIsRealtimeState,
        getMainRuntimePatchedStateFallbackService: () => mainRuntimePatchedStateFallbackService,
        getRuntimeCurrentLangValue,
        getCurrentMainTab: () => currentMainTab,
        getSlotCount: () => slotCount,
        getShowCopyFormat: () => showCopyFormat,
        getShowTimeline: () => showTimeline,
        getCurrentTheme: () => currentTheme,
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
        getMultiRangeTitle: () => multiRangeTitle
    });
}

function callRuntimePatchedStateFallbackAccessor(methodName, args, fallbackFn) {
    if (
        mainRuntimePatchedStateFallbackService
        && typeof mainRuntimePatchedStateFallbackService[methodName] === "function"
    ) {
        return mainRuntimePatchedStateFallbackService[methodName](...args);
    }
    return fallbackFn(...args);
}

function buildPatchedStateFallbackSnapshot() {
    return callRuntimeStatePatchAccessor("buildPatchedStateFallbackSnapshot", [], () => {
        return callRuntimePatchedStateFallbackAccessor("buildPatchedStateFallbackSnapshot", [], () => {
            const dayNightRange = normalizeDayNightRangeValues(dayStartHour, nightStartHour);
            return {
                currentMainTab,
                slotCount,
                showCopyFormat,
                showTimeline,
                currentTheme,
                dayStartHour: dayNightRange.dayStartHour,
                nightStartHour: dayNightRange.nightStartHour,
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
        });
    });
}

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

if (
    GTV_MAIN_RUNTIME_LOCAL_STATE_HELPERS_BINDINGS
    && typeof GTV_MAIN_RUNTIME_LOCAL_STATE_HELPERS_BINDINGS.createService === "function"
    && GTV_MAIN_RUNTIME_LOCAL_STATE_HELPERS
    && typeof GTV_MAIN_RUNTIME_LOCAL_STATE_HELPERS.createService === "function"
) {
    ({
        mainRuntimeLocalStateHelpersService
    } = GTV_MAIN_RUNTIME_LOCAL_STATE_HELPERS_BINDINGS.createService({
        runtimeLocalStateHelpersModule: GTV_MAIN_RUNTIME_LOCAL_STATE_HELPERS,
        getPatchAppState: () => patchAppState,
        getFixedTimeIdSeed: () => fixedTimeIdSeed,
        setFixedTimeIdSeed: (next) => { fixedTimeIdSeed = next; },
        getUiScale: () => uiScale,
        setUiScale: (next) => { uiScale = next; },
        getCurrentTheme: () => currentTheme,
        setCurrentTheme: (next) => { currentTheme = next; },
        getDayStartHour: () => dayStartHour,
        setDayStartHour: (next) => { dayStartHour = next; },
        getNightStartHour: () => nightStartHour,
        setNightStartHour: (next) => { nightStartHour = next; },
        sanitizeDayNightHourValue,
        normalizeDayNightRangeValues,
        syncCurrentLang,
        getGlobalTimeState,
        getFixedTimeSlotCount: (...args) => getFixedTimeSlotCount(...args),
        getConfirm: (message) => confirm(message),
        getFormatProfileAllowedKeys: (...args) => getFormatProfileAllowedKeys(...args),
        getFormatProfileAllowedTimePartKeys: (...args) => getFormatProfileAllowedTimePartKeys(...args),
        getPatchedActiveFormatProfileContextState,
        getUiScaleState,
        getCurrentGroup: (...args) => getCurrentGroup(...args),
        getFixedTimeStateService: () => fixedTimeStateService,
        getIsRealtimeState,
        isFixedTimeTab: (...args) => isFixedTimeTab(...args),
        getTimeAdjustDayStepBySlotSnapshot
    }));
}

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
if (
    !GTV_MAIN_RUNTIME_LOCAL_STATE_ACCESSOR_BINDINGS
    || typeof GTV_MAIN_RUNTIME_LOCAL_STATE_ACCESSOR_BINDINGS.createService !== "function"
) {
    throw new Error("Missing required module API: GTVMainRuntimeLocalStateAccessorBindings.createService");
}
({
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
} = GTV_MAIN_RUNTIME_LOCAL_STATE_ACCESSOR_BINDINGS.createService({
    runtimeLocalStateAccessorProxiesModule: GTV_MAIN_RUNTIME_LOCAL_STATE_ACCESSOR_PROXIES,
    getMainRuntimeLocalStateHelpersService: () => mainRuntimeLocalStateHelpersService,
    getPatchAppState: () => patchAppState,
    getFixedTimeIdSeed: () => fixedTimeIdSeed,
    setFixedTimeIdSeed: (next) => { fixedTimeIdSeed = next; },
    getUiScale: () => uiScale,
    setUiScale: (next) => { uiScale = next; },
    getCurrentTheme: () => currentTheme,
    setCurrentTheme: (next) => { currentTheme = next; },
    getDayStartHour: () => dayStartHour,
    setDayStartHour: (next) => { dayStartHour = next; },
    getNightStartHour: () => nightStartHour,
    setNightStartHour: (next) => { nightStartHour = next; },
    sanitizeDayNightHourValue,
    normalizeDayNightRangeValues,
    syncCurrentLang,
    getGlobalTimeState,
    getFixedTimeSlotCount: (...args) => getFixedTimeSlotCount(...args),
    getConfirm: (message) => confirm(message),
    getFormatProfileAllowedKeys: (...args) => getFormatProfileAllowedKeys(...args),
    getFormatProfileAllowedTimePartKeys: (...args) => getFormatProfileAllowedTimePartKeys(...args),
    getPatchedActiveFormatProfileContextState,
    getUiScaleState,
    getCurrentGroup: (...args) => getCurrentGroup(...args),
    getFixedTimeStateService: () => fixedTimeStateService,
    getIsRealtimeState,
    isFixedTimeTab: (...args) => isFixedTimeTab(...args),
    getTimeAdjustDayStepBySlotSnapshot
}));

if (
    !GTV_MAIN_RUNTIME_REFERENCE_ACCESSOR_BINDINGS
    || typeof GTV_MAIN_RUNTIME_REFERENCE_ACCESSOR_BINDINGS.createService !== "function"
) {
    throw new Error("Missing required module API: GTVMainRuntimeReferenceAccessorBindings.createService");
}
const {
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
    getDayStartHourStateRef,
    getNightStartHourStateRef,
    getDayNightMarkerByHour,
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
} = GTV_MAIN_RUNTIME_REFERENCE_ACCESSOR_BINDINGS.createService({
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
let mainStateDomainProxiesService = null;
if (
    !GTV_MAIN_STATE_DOMAIN_WRAPPER_BRIDGE_BINDINGS
    || typeof GTV_MAIN_STATE_DOMAIN_WRAPPER_BRIDGE_BINDINGS.createService !== "function"
) {
    throw new Error("Missing required module API: GTVMainStateDomainWrapperBridgeBindings.createService");
}
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
if (
    !GTV_MAIN_STATE_DOMAIN_WRAPPER_GLOBAL_BINDINGS_BRIDGE
    || typeof GTV_MAIN_STATE_DOMAIN_WRAPPER_GLOBAL_BINDINGS_BRIDGE.createService !== "function"
) {
    throw new Error("Missing required module API: GTVMainStateDomainWrapperGlobalBindingsBridge.createService");
}
const {
    mainStateDomainWrapperGlobalBindingsService
} = GTV_MAIN_STATE_DOMAIN_WRAPPER_GLOBAL_BINDINGS_BRIDGE.createService({
    stateDomainWrapperGlobalBindingsModule: GTV_MAIN_STATE_DOMAIN_WRAPPER_GLOBAL_BINDINGS,
    getGlobalRoot: () => GTV_GLOBAL
});
mainStateDomainWrapperGlobalBindingsService.applyBindings(mainStateDomainWrapperBridgeService, {
    excludeKeys: ["invokeStateDomainProxy"]
});

if (
    !GTV_MAIN_CORE_ASSEMBLY_CONFIG_BUILDER_BINDINGS
    || typeof GTV_MAIN_CORE_ASSEMBLY_CONFIG_BUILDER_BINDINGS.createService !== "function"
) {
    throw new Error("Missing required module API: GTVMainCoreAssemblyConfigBuilderBindings.createService");
}
const {
    mainCoreAssemblyConfigBuilderService
} = GTV_MAIN_CORE_ASSEMBLY_CONFIG_BUILDER_BINDINGS.createService({
    coreAssemblyConfigBuilderModule: GTV_MAIN_CORE_ASSEMBLY_CONFIG_BUILDER
});
if (
    !GTV_MAIN_PATCHED_STATE_ACCESSOR_BINDINGS
    || typeof GTV_MAIN_PATCHED_STATE_ACCESSOR_BINDINGS.createService !== "function"
) {
    throw new Error("Missing required module API: GTVMainPatchedStateAccessorBindings.createService");
}
var {
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
} = GTV_MAIN_PATCHED_STATE_ACCESSOR_BINDINGS.createService({
    patchedStateAccessorProxiesModule: GTV_MAIN_PATCHED_STATE_ACCESSOR_PROXIES,
    getMainAppStateBridgeService: () => mainAppStateBridgeService,
    getMainPatchedStateSelectorsService: () => mainPatchedStateSelectorsService
});
const mainCoreAssemblyConfig = mainCoreAssemblyConfigBuilderService.buildMainCoreAssemblyConfig({
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
    consoleWarn: console.warn.bind(console),
    showMissingFeatureToastOnce,
    directStateSetters,
    setIsRealtimeState,
    callServiceMethod,
    getAppStatePatcherServiceRef,
    getAppPersistenceStateServiceRef,
    applyDirectStatePatch,
    SERVICE_METHOD_MISSING,
    buildPatchedStateFallbackSnapshot,
    TABLE_IMAGE_EXPORT_WIDTH,
    createCanvasSafely,
    getMainTimezoneRuntimeBridgeServiceRef,
    getMainTimezoneRuntimeServiceRef,
    getMainBaseTimezoneServiceRef,
    getMainTimezoneMutationServiceRef,
    getTimezoneSearchServiceRef,
    getTimeCoreRef,
    getBaseTimeSnapshot,
    getZoneMapRef,
    getTzDatabaseRef,
    getTimeServiceRef,
    formatUtcOffsetLabel,
    bindFacadeMethod,
    getMainTimezoneFacadeServiceRef,
    timezoneOffsetCache,
    timezoneDstCache,
    zoneAbbrCache,
    getCurrentGroupBaseTimezoneId,
    getRandomUUIDSafely,
    getRandomValue,
    getGroupStateServiceRef,
    normalizeCustomAbbr,
    deferDynamicCall,
    getRenderListRef,
    getTableRenderServiceRef,
    getCopyActionsServiceRef,
    isFixedTimeTab,
    renderFixedTimeTab,
    getTimeAdjustUiServiceRef,
    getTimeAdjustActionsServiceRef,
    getMultiBulkToolsServiceRef,
    getTimeAdjustDayStepBySlotSnapshot,
    setTimeAdjustDayStepBySlotState,
    DEFAULT_TIME_ADJUST_DAY_STEP,
    MIN_TIME_ADJUST_DAY_STEP,
    MAX_TIME_ADJUST_DAY_STEP,
    getFixedTimeTableServiceRef,
    getCurrentGroup,
    ensureGroupFixedTimes,
    refreshFixedTimeSlotCountControls,
    getCurrentGroupFixedTimeShowLiveNow,
    getDocumentRefOrNull,
    invokeRenderBaseTimeSelect,
    getMultiRangeRenderServiceRef,
    getMultiRangeCopyServiceRef,
    getMultiStateServiceRef,
    getCurrentMultiRangeStateSnapshot,
    setMultiRangeState,
    sanitizeMultiRangeCount,
    sanitizeMultiRangeTitle,
    ensureMultiRangeState,
    refreshMultiRangeControls,
    getRuntimeNowMs,
    getMainClockOrchestratorServiceRef,
    getMainPersistenceSnapshotServiceRef,
    warnMissingServiceMethod,
    getFixedTimeCoreServiceRef,
    getFixedTimeActionsServiceRef,
    getPatchedCopyFormatOrderState,
    getPatchedCopyFormatEnabledState,
    getPatchedCopyTimePartsEnabledState,
    getSanitizeCopyFormatOrderForContextRef,
    getSanitizeCopyFormatEnabledForContextRef,
    getSanitizeTimePartsEnabledForContextRef,
    getWindowRefOrNull,
    getTimelineFrameServiceRef,
    getFixedTimeTimelineServiceRef,
    getPatchedMainTabState,
    getShowTimelineStateRef,
    getGlobalTimeState,
    getFixedTimeSlotCountForGroupRef,
    getFixedTimeSlotHeaderLabel,
    getPatchedSlotCountState,
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
    getPatchedActiveGroupIdState,
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
    getDisplayFormatOrderStateRef,
    getDisplayFormatEnabledStateRef,
    getDisplayTimePartsEnabledStateRef,
    getCopyFormatOrderStateRef,
    getCopyFormatEnabledStateRef,
    getCopyTimePartsEnabledStateRef,
    getFormatProfilesStateRef,
    getActiveFormatProfileContextStateRef,
    patchAppState,
    MIN_MULTI_RANGE_COUNT,
    MAX_MULTI_RANGE_COUNT,
    DEFAULT_MULTI_RANGE_TITLE,
    gtvT,
    getShowToastRef,
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
    getPersistenceServiceRef,
    getUiScaleState,
    getCurrentThemeStateRef,
    getDayStartHourStateRef,
    getNightStartHourStateRef,
    getPatchedCurrentLangState,
    getCurrentLangStateRef,
    setUiPreferencesState,
    DEFAULT_REALTIME_TICK_MS,
    getIsRealtimeState,
    shouldRunRealtimeTick,
    setGlobalTimeState,
    MAX_RUNTIME_CACHE_SIZE,
    getUpdateClocksRef,
    setRuntimeInterval,
    clearRuntimeInterval,
    getLuxonGlobalRef
});
if (
    !GTV_MAIN_CORE_SERVICE_ASSEMBLY_BINDINGS
    || typeof GTV_MAIN_CORE_SERVICE_ASSEMBLY_BINDINGS.createService !== "function"
) {
    throw new Error("Missing required module API: GTVMainCoreServiceAssemblyBindings.createService");
}
const {
    mainCoreServices
} = GTV_MAIN_CORE_SERVICE_ASSEMBLY_BINDINGS.createService({
    coreServiceAssemblyModule: GTV_MAIN_CORE_SERVICE_ASSEMBLY,
    mainCoreAssemblyConfig
});
if (
    !GTV_MAIN_CORE_SERVICE_BINDINGS
    || typeof GTV_MAIN_CORE_SERVICE_BINDINGS.createService !== "function"
) {
    throw new Error("Missing required module API: GTVMainCoreServiceBindings.createService");
}
const mainCoreServiceBindings = GTV_MAIN_CORE_SERVICE_BINDINGS.createService({
    mainCoreServices
});
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
    mainMultiRangeTabFacadeService
} = mainCoreServiceBindings);
const {
    mainGroupLocalizationServices,
    mainOrchestrationFlowServices
} = mainCoreServiceBindings;
const mainFoundationConfig = mainCoreAssemblyConfigBuilderService.buildMainFoundationConfig({
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
    consoleError: console.error.bind(console)
});
if (
    !GTV_MAIN_FOUNDATION_SERVICES_BINDINGS
    || typeof GTV_MAIN_FOUNDATION_SERVICES_BINDINGS.createService !== "function"
) {
    throw new Error("Missing required module API: GTVMainFoundationServicesBindings.createService");
}
const {
    mainFoundationServices
} = GTV_MAIN_FOUNDATION_SERVICES_BINDINGS.createService({
    foundationServicesModule: GTV_MAIN_FOUNDATION_SERVICES,
    mainFoundationConfig
});
if (
    !GTV_MAIN_FOUNDATION_SERVICE_BINDINGS
    || typeof GTV_MAIN_FOUNDATION_SERVICE_BINDINGS.createService !== "function"
) {
    throw new Error("Missing required module API: GTVMainFoundationServiceBindings.createService");
}
const mainFoundationServiceBindings = GTV_MAIN_FOUNDATION_SERVICE_BINDINGS.createService({
    mainFoundationServices,
    mainCoreServices
});
({
    appFeedbackService,
    calculatorActionsService
} = mainFoundationServiceBindings);
const {
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
} = mainFoundationServiceBindings;
const GTV_MAIN_STATE_DOMAIN_PROXIES = GTV_GLOBAL.GTVMainStateDomainProxies;
if (
    !GTV_MAIN_STATE_DOMAIN_PROXY_BINDINGS
    || typeof GTV_MAIN_STATE_DOMAIN_PROXY_BINDINGS.createService !== "function"
) {
    throw new Error("Missing required module API: GTVMainStateDomainProxyBindings.createService");
}
({
    mainStateDomainProxiesService
} = GTV_MAIN_STATE_DOMAIN_PROXY_BINDINGS.createService({
    stateDomainProxiesModule: GTV_MAIN_STATE_DOMAIN_PROXIES,
    fixedTimeSlotUtilsService,
    multiRangeStateService,
    fixedTimeStateService,
    uiPreferencesStateService,
    groupContextStateService,
    mainAppStateBridgeService,
    getPatchedMainTabState,
    getCurrentGroup: () => getCurrentGroup(),
    defaultFixedTimeValue: DEFAULT_FIXED_TIME_VALUE
}));
if (
    !GTV_MAIN_FACADE_BRIDGE_BINDINGS
    || typeof GTV_MAIN_FACADE_BRIDGE_BINDINGS.createService !== "function"
) {
    throw new Error("Missing required module API: GTVMainFacadeBridgeBindings.createService");
}
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

if (
    !GTV_MAIN_COMPOSITION_CONFIG_BUILDER_BINDINGS
    || typeof GTV_MAIN_COMPOSITION_CONFIG_BUILDER_BINDINGS.createService !== "function"
) {
    throw new Error("Missing required module API: GTVMainCompositionConfigBuilderBindings.createService");
}
const {
    mainCompositionConfigBuilderService
} = GTV_MAIN_COMPOSITION_CONFIG_BUILDER_BINDINGS.createService({
    compositionConfigBuilderModule: GTV_MAIN_COMPOSITION_CONFIG_BUILDER
});

// --- Shared Core Utilities ---
if (
    !GTV_MAIN_RUNTIME_TIMEZONE_HELPER_BINDINGS
    || typeof GTV_MAIN_RUNTIME_TIMEZONE_HELPER_BINDINGS.createService !== "function"
) {
    throw new Error("Missing required module API: GTVMainRuntimeTimezoneHelperBindings.createService");
}
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

if (
    !GTV_MAIN_RUNTIME_STATE_HELPER_ALIASES_BINDINGS
    || typeof GTV_MAIN_RUNTIME_STATE_HELPER_ALIASES_BINDINGS.createService !== "function"
) {
    throw new Error("Missing required module API: GTVMainRuntimeStateHelperAliasesBindings.createService");
}
const {
    parseDateTimePartsViaRuntimeStateHelpers,
    getTimeAdjustDayStepBySlotSnapshotViaRuntimeStateHelpers,
    setTimeAdjustDayStepBySlotStateViaRuntimeStateHelpers,
    updateTimeAdjustPanelSafelyViaRuntimeStateHelpers,
    getUTCRefViaRuntimeStateHelpers,
    getCurrentGroupViaRuntimeStateHelpers,
    getCurrentGroupZonesViaRuntimeStateHelpers,
    getCurrentGroupBaseTimezoneIdViaRuntimeStateHelpers,
    getBaseTimezoneRefViaRuntimeStateHelpers,
    ensureBaseTimezoneSelectionViaRuntimeStateHelpers,
    formatUtcOffsetLabelViaRuntimeStateHelpers,
    normalizeCustomAbbrViaRuntimeStateHelpers,
    getCurrentMultiRangeStateSnapshotViaRuntimeStateHelpers,
    getGroupsStateSnapshotViaRuntimeStateHelpers,
    getActiveGroupIdByMainTabStateSnapshotViaRuntimeStateHelpers,
    patchPrimaryStateViaRuntimeStateHelpers,
    setCurrentMainTabStateViaRuntimeStateHelpers,
    setActiveGroupIdStateViaRuntimeStateHelpers,
    setActiveGroupIdByMainTabStateViaRuntimeStateHelpers,
    getActiveGroupNameSnapshotViaRuntimeStateHelpers
} = GTV_MAIN_RUNTIME_STATE_HELPER_ALIASES_BINDINGS.createService({
    runtimeStateHelperAliasesModule: GTV_MAIN_RUNTIME_STATE_HELPER_ALIASES,
    runtimeStateHelpersModule: GTV_MAIN_RUNTIME_STATE_HELPERS,
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
});

var mainRuntimeStateHelperAccessorService = null;
if (
    GTV_MAIN_RUNTIME_STATE_HELPER_ACCESSOR_BINDINGS
    && typeof GTV_MAIN_RUNTIME_STATE_HELPER_ACCESSOR_BINDINGS.createService === "function"
    && GTV_MAIN_RUNTIME_STATE_HELPER_ACCESSOR_PROXIES
    && typeof GTV_MAIN_RUNTIME_STATE_HELPER_ACCESSOR_PROXIES.createService === "function"
) {
    mainRuntimeStateHelperAccessorService = GTV_MAIN_RUNTIME_STATE_HELPER_ACCESSOR_BINDINGS.createService({
        runtimeStateHelperAccessorProxiesModule: GTV_MAIN_RUNTIME_STATE_HELPER_ACCESSOR_PROXIES,
        getParseDateTimePartsViaRuntimeStateHelpers: () => parseDateTimePartsViaRuntimeStateHelpers,
        getGetTimeAdjustDayStepBySlotSnapshotViaRuntimeStateHelpers: () => getTimeAdjustDayStepBySlotSnapshotViaRuntimeStateHelpers,
        getSetTimeAdjustDayStepBySlotStateViaRuntimeStateHelpers: () => setTimeAdjustDayStepBySlotStateViaRuntimeStateHelpers,
        getUpdateTimeAdjustPanelSafelyViaRuntimeStateHelpers: () => updateTimeAdjustPanelSafelyViaRuntimeStateHelpers,
        getGetUTCRefViaRuntimeStateHelpers: () => getUTCRefViaRuntimeStateHelpers,
        getGetCurrentGroupViaRuntimeStateHelpers: () => getCurrentGroupViaRuntimeStateHelpers,
        getGetCurrentGroupZonesViaRuntimeStateHelpers: () => getCurrentGroupZonesViaRuntimeStateHelpers,
        getGetCurrentGroupBaseTimezoneIdViaRuntimeStateHelpers: () => getCurrentGroupBaseTimezoneIdViaRuntimeStateHelpers,
        getGetBaseTimezoneRefViaRuntimeStateHelpers: () => getBaseTimezoneRefViaRuntimeStateHelpers,
        getEnsureBaseTimezoneSelectionViaRuntimeStateHelpers: () => ensureBaseTimezoneSelectionViaRuntimeStateHelpers,
        getFormatUtcOffsetLabelViaRuntimeStateHelpers: () => formatUtcOffsetLabelViaRuntimeStateHelpers,
        getNormalizeCustomAbbrViaRuntimeStateHelpers: () => normalizeCustomAbbrViaRuntimeStateHelpers,
        getGetCurrentMultiRangeStateSnapshotViaRuntimeStateHelpers: () => getCurrentMultiRangeStateSnapshotViaRuntimeStateHelpers,
        getGetGroupsStateSnapshotViaRuntimeStateHelpers: () => getGroupsStateSnapshotViaRuntimeStateHelpers,
        getGetActiveGroupIdByMainTabStateSnapshotViaRuntimeStateHelpers: () => getActiveGroupIdByMainTabStateSnapshotViaRuntimeStateHelpers,
        getPatchPrimaryStateViaRuntimeStateHelpers: () => patchPrimaryStateViaRuntimeStateHelpers,
        getSetCurrentMainTabStateViaRuntimeStateHelpers: () => setCurrentMainTabStateViaRuntimeStateHelpers,
        getSetActiveGroupIdStateViaRuntimeStateHelpers: () => setActiveGroupIdStateViaRuntimeStateHelpers,
        getSetActiveGroupIdByMainTabStateViaRuntimeStateHelpers: () => setActiveGroupIdByMainTabStateViaRuntimeStateHelpers,
        getGetActiveGroupNameSnapshotViaRuntimeStateHelpers: () => getActiveGroupNameSnapshotViaRuntimeStateHelpers
    });
}

function callRuntimeStateHelperAccessor(methodName, args, fallbackFn) {
    if (
        mainRuntimeStateHelperAccessorService
        && typeof mainRuntimeStateHelperAccessorService[methodName] === "function"
    ) {
        return mainRuntimeStateHelperAccessorService[methodName](...args);
    }
    return fallbackFn(...args);
}

function parseDateTimeParts(val, inputMode) {
    return callRuntimeStateHelperAccessor(
        "parseDateTimeParts",
        [val, inputMode],
        parseDateTimePartsViaRuntimeStateHelpers
    );
}

function getTimeAdjustDayStepBySlotSnapshot() {
    return callRuntimeStateHelperAccessor(
        "getTimeAdjustDayStepBySlotSnapshot",
        [],
        getTimeAdjustDayStepBySlotSnapshotViaRuntimeStateHelpers
    );
}

function setTimeAdjustDayStepBySlotState(nextValues = []) {
    return callRuntimeStateHelperAccessor(
        "setTimeAdjustDayStepBySlotState",
        [nextValues],
        setTimeAdjustDayStepBySlotStateViaRuntimeStateHelpers
    );
}

function updateTimeAdjustPanelSafely() {
    return callRuntimeStateHelperAccessor(
        "updateTimeAdjustPanelSafely",
        [],
        updateTimeAdjustPanelSafelyViaRuntimeStateHelpers
    );
}

function getUTCRef() {
    return callRuntimeStateHelperAccessor(
        "getUTCRef",
        [],
        getUTCRefViaRuntimeStateHelpers
    );
}

function getCurrentGroup() {
    return callRuntimeStateHelperAccessor(
        "getCurrentGroup",
        [],
        getCurrentGroupViaRuntimeStateHelpers
    );
}

function getCurrentGroupZones() {
    return callRuntimeStateHelperAccessor(
        "getCurrentGroupZones",
        [],
        getCurrentGroupZonesViaRuntimeStateHelpers
    );
}

function getCurrentGroupBaseTimezoneId() {
    return callRuntimeStateHelperAccessor(
        "getCurrentGroupBaseTimezoneId",
        [],
        getCurrentGroupBaseTimezoneIdViaRuntimeStateHelpers
    );
}

function getBaseTimezoneRef() {
    return callRuntimeStateHelperAccessor(
        "getBaseTimezoneRef",
        [],
        getBaseTimezoneRefViaRuntimeStateHelpers
    );
}

function ensureBaseTimezoneSelection() {
    return callRuntimeStateHelperAccessor(
        "ensureBaseTimezoneSelection",
        [],
        ensureBaseTimezoneSelectionViaRuntimeStateHelpers
    );
}

function formatUtcOffsetLabel(totalMinutes = 0) {
    return callRuntimeStateHelperAccessor(
        "formatUtcOffsetLabel",
        [totalMinutes],
        formatUtcOffsetLabelViaRuntimeStateHelpers
    );
}

function normalizeCustomAbbr(value) {
    return callRuntimeStateHelperAccessor(
        "normalizeCustomAbbr",
        [value],
        normalizeCustomAbbrViaRuntimeStateHelpers
    );
}

function getCurrentMultiRangeStateSnapshot() {
    return callRuntimeStateHelperAccessor(
        "getCurrentMultiRangeStateSnapshot",
        [],
        getCurrentMultiRangeStateSnapshotViaRuntimeStateHelpers
    );
}

function getGroupsStateSnapshot() {
    return callRuntimeStateHelperAccessor(
        "getGroupsStateSnapshot",
        [],
        getGroupsStateSnapshotViaRuntimeStateHelpers
    );
}

function getActiveGroupIdByMainTabStateSnapshot() {
    return callRuntimeStateHelperAccessor(
        "getActiveGroupIdByMainTabStateSnapshot",
        [],
        getActiveGroupIdByMainTabStateSnapshotViaRuntimeStateHelpers
    );
}

function patchPrimaryState(next = {}) {
    return callRuntimeStateHelperAccessor(
        "patchPrimaryState",
        [next],
        patchPrimaryStateViaRuntimeStateHelpers
    );
}

function setCurrentMainTabState(nextTab) {
    return callRuntimeStateHelperAccessor(
        "setCurrentMainTabState",
        [nextTab],
        setCurrentMainTabStateViaRuntimeStateHelpers
    );
}

function setActiveGroupIdState(nextId) {
    return callRuntimeStateHelperAccessor(
        "setActiveGroupIdState",
        [nextId],
        setActiveGroupIdStateViaRuntimeStateHelpers
    );
}

function setActiveGroupIdByMainTabState(nextMap) {
    return callRuntimeStateHelperAccessor(
        "setActiveGroupIdByMainTabState",
        [nextMap],
        setActiveGroupIdByMainTabStateViaRuntimeStateHelpers
    );
}

function getActiveGroupNameSnapshot() {
    return callRuntimeStateHelperAccessor(
        "getActiveGroupNameSnapshot",
        [],
        getActiveGroupNameSnapshotViaRuntimeStateHelpers
    );
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

if (
    !GTV_MAIN_FORMAT_PROFILE_FACADE_BINDINGS
    || typeof GTV_MAIN_FORMAT_PROFILE_FACADE_BINDINGS.createService !== "function"
) {
    throw new Error("Missing required module API: GTVMainFormatProfileFacadeBindings.createService");
}
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

if (
    !GTV_MAIN_RUNTIME_SERVICE_CONFIG_BUILDER_BINDINGS
    || typeof GTV_MAIN_RUNTIME_SERVICE_CONFIG_BUILDER_BINDINGS.createService !== "function"
) {
    throw new Error("Missing required module API: GTVMainRuntimeServiceConfigBuilderBindings.createService");
}
const {
    mainRuntimeServiceConfigBuilderService
} = GTV_MAIN_RUNTIME_SERVICE_CONFIG_BUILDER_BINDINGS.createService({
    runtimeServiceConfigBuilderModule: GTV_MAIN_RUNTIME_SERVICE_CONFIG_BUILDER
});
const mainSelectServicesConfig = mainRuntimeServiceConfigBuilderService.buildMainSelectServicesConfig({
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
    gtvT
});
const mainSelectServices = mainCoreServices.createMainSelectServices(mainSelectServicesConfig);
const {
    adjustSelectWidthForContent,
    refreshSelectWidths,
    renderBaseTimeSelect
} = mainSelectServices;

// --- Group Data Structures ---

const timezoneSearchConfig = mainRuntimeServiceConfigBuilderService.buildTimezoneSearchConfig({
    TZ_DATABASE,
    getZoneMapRef,
    gtvT,
    getPatchedCurrentLangState,
    getBetterAbbr,
    getTimezoneOffset,
    getLocalizedTZLabel,
    adjustSelectWidthForContent,
    getCurrentGroup,
    savePersistenceSafely,
    deferDynamicCall,
    getRenderListRef,
    addTimezone,
    createUniqueTimezoneId
});
const timezoneSearchService = mainCoreServices.createTimezoneSearchService(timezoneSearchConfig);

const snapshotFormatConfig = mainRuntimeServiceConfigBuilderService.buildSnapshotFormatConfig({
    DEFAULT_COPY_TIME_PARTS_ENABLED,
    MAIN_I18N_DATA,
    gtvT,
    getPatchedCurrentLangState,
    getUTCRef,
    getBaseTimezoneRef,
    getCurrentGroupZones,
    getGlobalTimesState,
    getPatchedSlotCountState,
    getIsRealtimeState,
    getDayNightMarkerByHour,
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
const snapshotFormatService = mainCoreServices.createSnapshotFormatService(snapshotFormatConfig);

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
const timeInputMutationsConfig = mainRuntimeServiceConfigBuilderService.buildTimeInputMutationsConfig({
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
    getSavePersistenceSafelyRef
});
const timeInputMutationsService = mainCoreServices.createTimeInputMutationsService(timeInputMutationsConfig);

const mainRowOrderConfig = mainRuntimeServiceConfigBuilderService.buildMainRowOrderConfig({
    requestUiFrame,
    cancelUiFrame,
    getGroupsStateSnapshot,
    getPatchedActiveGroupIdState,
    getCurrentGroupBaseTimezoneId,
    getPersistenceServiceRef,
    getDocumentRefOrNull,
    NodeCtor: (typeof Node === "function") ? Node : null
});
const mainRowOrderServices = mainCoreServices.createMainRowOrderServices(mainRowOrderConfig);
const {
    bindRowContainerDragAndDrop,
    initDragAndDrop,
    captureReorderableRowRects,
    animateReorderTransition,
    getAfter,
    saveOrderForContainer,
    saveOrder
} = mainRowOrderServices;
const mainRowViewConfig = mainRuntimeServiceConfigBuilderService.buildMainRowViewConfig({
    rowViewCache,
    MAX_RUNTIME_CACHE_SIZE,
    getDocumentRefOrNull,
    getSnapshotFormatServiceRef,
    getGlobalTimeState,
    getZoneDisplayName,
    getZoneDisplayNameForUiAtDate,
    getPatchedCurrentLangState,
    getI18nDataRef,
    getIsRealtimeState,
    getPatchedSlotCountState,
    normalizeDayNightMarker,
    getDayNightGlyph,
    gtvT
});
const mainRowViewServices = mainCoreServices.createMainRowViewServices(mainRowViewConfig);
const { updateRow } = mainRowViewServices;

const tableRenderConfig = mainRuntimeServiceConfigBuilderService.buildTableRenderConfig({
    gtvT,
    sanitizeCopyFormatOrder,
    getPatchedDisplayFormatOrderState,
    getPatchedDisplayFormatEnabledState,
    getPatchedDisplayTimePartsEnabledState,
    getIsRealtimeState,
    getPatchedSlotCountState,
    isMultiTab,
    renderMultiRangesSafely,
    getBaseTimezoneRef,
    getGlobalTimeState,
    escapeHtmlViaSharedUtils,
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
    updateTimeAdjustPanelSafely,
    deferDynamicCall,
    getUpdateClocksRef,
    hideFloatingTooltip,
    upgradeNativeTitleTooltips,
    createDragGhostFromRow,
    clearDragGhost,
    bindFacadeMethod,
    getCopyActionsServiceRef
});
const tableRenderService = mainCoreServices.createTableRenderService(tableRenderConfig);

const mainImageExportBridgeProxyConfig = mainRuntimeServiceConfigBuilderService.buildMainImageExportBridgeProxyConfig({
    getImageExportBridgeServiceRef,
    createDefaultTableExportContext
});
const mainImageExportBridgeProxy = mainCoreServices.createMainImageExportBridgeProxy(mainImageExportBridgeProxyConfig);
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

const mainImageRuntimeServicesConfig = mainRuntimeServiceConfigBuilderService.buildMainImageRuntimeServicesConfig({
    GTV_IMAGE_CLONE,
    GTV_IMAGE_FOREIGN_RENDER,
    GTV_IMAGE_EXPORT_BRIDGE,
    GTV_TABLE_IMAGE_RENDER,
    GTV_MULTI_RANGE_IMAGE_RENDER,
    TABLE_IMAGE_EXPORT_WIDTH,
    EXPORT_MONO_FONT_FAMILY,
    getDocumentRefOrNull,
    getCanUseForeignObjectRendererRef,
    setCanUseForeignObjectRenderer,
    getImageExportActionsServiceRef,
    createDefaultTableExportContext,
    isFixedTimeTab,
    waitForDocumentFontsReady,
    prepareExportCanvas,
    drawExportCellText,
    cloneTableForImageExport,
    renderElementWithForeignObjectToPngDataUrl,
    gtvT,
    ensureMultiRangeState,
    getBaseTimezoneRef,
    getPatchedMultiRangesState,
    getMultiRangeTitleTextFromRenderService,
    cloneMultiRangeBlockForImageExport,
    extractTableCellText
});
const mainImageRuntimeServices = mainCoreServices.createMainImageRuntimeServices(mainImageRuntimeServicesConfig);
imageCloneService = mainImageRuntimeServices.imageCloneService;
imageForeignRenderService = mainImageRuntimeServices.imageForeignRenderService;
imageExportBridgeService = mainImageRuntimeServices.imageExportBridgeService;
tableImageRenderService = mainImageRuntimeServices.tableImageRenderService;
multiRangeImageRenderService = mainImageRuntimeServices.multiRangeImageRenderService;

const mainFixedTimeServicesConfig = mainRuntimeServiceConfigBuilderService.buildMainFixedTimeServicesConfig({
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
    getRefreshFixedTimeSlotCountControlsRef
});
const mainFixedTimeServices = mainCoreServices.createMainFixedTimeServices(mainFixedTimeServicesConfig);
fixedTimeCoreService = mainFixedTimeServices.fixedTimeCoreService;
fixedTimeTimelineService = mainFixedTimeServices.fixedTimeTimelineService;
fixedTimeActionsService = mainFixedTimeServices.fixedTimeActionsService;

const mainMultiRangeServicesConfig = mainRuntimeServiceConfigBuilderService.buildMainMultiRangeServicesConfig({
    GTV_MULTI_RANGE_RENDER,
    GTV_MULTI_RANGE_COPY,
    GTV_COPY_ACTIONS,
    MAIN_I18N_DATA,
    gtvT,
    getPatchedCurrentLangState,
    pad,
    getDayNightMarkerByHour,
    getCustomOffsetMinutes,
    getFixedOffsetForDisplayAtDate,
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
    getBaseTimezoneRef,
    escapeHtmlViaSharedUtils,
    getDisplayColumns,
    getRenderableTimezoneRowsFromTableRender,
    getPatchedMultiRangesState,
    getPatchedMultiRangeCollapsedState,
    getPatchedMultiRangeCountState,
    buildTimezoneComputedSnapshotForDatesViaSnapshotService,
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
    deferDynamicCall,
    getShowToastRef,
    getTimezoneRefByIdFromSnapshotService,
    buildTimezoneComputedSnapshotForRange,
    formatSnapshotText,
    getPatchedCopyFormatOrderState,
    getPatchedCopyFormatEnabledState,
    getPatchedCopyTimePartsEnabledState,
    writeClipboardText,
    getPatchedShowCopyFormatState,
    isMultiTab,
    isFixedTimeTab,
    getRowFormattedTextViaSnapshotService,
    getRowCopyTextViaSnapshotService,
    getFixedTimePreviewCopyText,
    getAllFixedTimeRowsCopyText,
    copyAllMultiRangeTimezones
});
const mainMultiRangeServices = mainCoreServices.createMainMultiRangeServices(mainMultiRangeServicesConfig);
const multiRangeRenderService = mainMultiRangeServices.multiRangeRenderService;
const multiRangeCopyService = mainMultiRangeServices.multiRangeCopyService;
const copyActionsService = mainMultiRangeServices.copyActionsService;

const mainTimeAdjustServicesConfig = mainRuntimeServiceConfigBuilderService.buildMainTimeAdjustServicesConfig({
    GTV_TIME_ADJUST_UI,
    GTV_MULTI_BULK_TOOLS,
    GTV_TIME_ADJUST_ACTIONS,
    MIN_TIME_ADJUST_DAY_STEP,
    MAX_TIME_ADJUST_DAY_STEP,
    DEFAULT_TIME_ADJUST_DAY_STEP,
    gtvT,
    savePersistenceSafely,
    applyTimeAdjustAction,
    getPatchedMainTabState,
    getIsRealtimeState,
    getPatchedSlotCountState,
    getTimeAdjustDayStepValue,
    getTimeAdjustDayStepBySlotSnapshot,
    setTimeAdjustDayStepBySlotState,
    upgradeNativeTitleTooltips,
    getPatchedMultiRangeCountState,
    applyBulkRangeAllAction,
    applyFirstRangeStartAdjustAction,
    setAllMultiRangeStartEditEnabled,
    setAllMultiRangeEndEditEnabled,
    getGlobalTimesState,
    deferDynamicCall,
    getUpdateClocksRef,
    getBaseTimezoneRef,
    getFixedOffsetForDisplay,
    getFixedOffsetForDisplayAtDate,
    getCustomOffsetMinutes,
    getTimeAdjustDayStep,
    timeService,
    sanitizeUtcMsViaTimeCore,
    ensureMultiRangeState,
    getPatchedMultiRangesState,
    isMultiRangeStartLinked,
    isMultiTab,
    renderMultiRangesSafely,
    isMultiRangeStartEditEnabled,
    isMultiRangeEndEditEnabled,
    syncLinkedRangesFrom,
    getMultiRangeSlotDate,
    setMultiRangeSlotDate,
    syncFollowingRangesByDuration,
    syncMultiRangeStartLinks
});
const mainTimeAdjustServices = mainCoreServices.createMainTimeAdjustServices(mainTimeAdjustServicesConfig);
timeAdjustUiService = mainTimeAdjustServices.timeAdjustUiService;
multiBulkToolsService = mainTimeAdjustServices.multiBulkToolsService;
timeAdjustActionsService = mainTimeAdjustServices.timeAdjustActionsService;

const mainTabServicesConfig = mainRuntimeServiceConfigBuilderService.buildMainTabServicesConfig({
    GTV_FORMAT_CONTROLS,
    serviceBootstrap,
    COPY_FORMAT_KEYS,
    TIME_PART_KEYS,
    gtvT,
    sanitizeCopyFormatOrder,
    deferDynamicCall,
    getRenderListRef,
    updateCopyFormatPreview,
    savePersistenceSafely,
    upgradeNativeTitleTooltips,
    getPatchedShowCopyFormatState,
    getPatchedDisplayFormatOrderState,
    getPatchedActiveFormatProfileContextState,
    patchAppState,
    sanitizeCopyFormatOrderForContext,
    syncActiveFormatProfileFromState,
    getPatchedDisplayFormatEnabledState,
    sanitizeCopyFormatEnabledForContext,
    getPatchedDisplayTimePartsEnabledState,
    sanitizeTimePartsEnabledForContext,
    getPatchedCopyFormatOrderState,
    getPatchedCopyFormatEnabledState,
    getPatchedCopyTimePartsEnabledState,
    getActiveCopyFormatKeysForCurrentContext,
    getActiveTimePartKeysForCurrentContext,
    sanitizeMainTab,
    clampGroupIndex,
    normalizeGroupTabState,
    isMultiTab,
    isFixedTimeTab,
    getPatchedSlotCountState,
    getPatchedShowTimelineState,
    getIsRealtimeState,
    setIsRealtimeState,
    setGlobalTimeState,
    getPatchedMainTabState,
    setCurrentMainTabState,
    getPatchedActiveGroupIdState,
    setActiveGroupIdState,
    getActiveGroupIdByMainTabStateSnapshot,
    setActiveGroupIdByMainTabState,
    hideFloatingTooltip,
    syncCurrentMultiStateToActiveSubgroup,
    refreshMultiRangeControls,
    renderBaseTimeSelect,
    loadCurrentMultiStateFromActiveSubgroup,
    bindFacadeMethod,
    getGroupTabsServiceRef,
    renderMultiRangesSafely,
    renderFixedTimeTab,
    getRenderTimelineFrameRef,
    updateTimeAdjustPanelSafely,
    resolveFormatProfileContext,
    activateFormatProfileContext
});
const mainTabServices = mainCoreServices.createMainTabServices(mainTabServicesConfig);
const formatControlsService = mainTabServices.formatControlsService;
const tabUiService = mainTabServices.tabUiService;
const tabOrchestratorService = mainTabServices.tabOrchestratorService;

const mainGroupStateServicesConfig = mainRuntimeServiceConfigBuilderService.buildMainGroupStateServicesConfig({
    GTV_MULTI_STATE,
    serviceBootstrap,
    MIN_MULTI_RANGE_COUNT,
    gtvT,
    getGroupsStateSnapshot,
    getDefaultMultiRangeBounds,
    sanitizeMultiRangeCount,
    sanitizeMultiRangeItem,
    sanitizeUtcMsViaTimeCore,
    sanitizeTimezoneId,
    createUniqueTimezoneId,
    normalizeCustomAbbr,
    normalizeZoneAbbreviationViaSearch,
    sanitizeBaseTimezoneId,
    sanitizeUtcRowOrderViaTimeCore,
    sanitizeFixedTimes,
    sanitizeFixedDateValue,
    sanitizeFixedTimeShowLiveNow
});
const mainGroupStateServices = mainCoreServices.createMainGroupStateServices(mainGroupStateServicesConfig);
multiStateService = mainGroupStateServices.multiStateService;
groupStateService = mainGroupStateServices.groupStateService;

const mainImageExportNamingProxyConfig = mainRuntimeServiceConfigBuilderService.buildMainImageExportNamingProxyConfig({
    getImageExportNamingServiceRef,
    getCustomOffsetMinutes,
    pad,
    timeService,
    getBaseTimezoneRef,
    getGroupsStateSnapshot,
    getPatchedActiveGroupIdState,
    gtvT,
    getZoneAbbreviation,
    getBaseTimeSnapshot,
    sanitizeMultiSubgroupNameForExport,
    getCurrentMultiSubgroupName
});
const mainImageExportNamingProxy = mainCoreServices.createMainImageExportNamingProxy(mainImageExportNamingProxyConfig);
const {
    sanitizeFilenamePart,
    formatDateTimeByTimezone,
    getTimezoneTableImageFilename,
    getMultiRangeTableImageFilename,
    getMultiRangeTitlesImageFilename
} = mainImageExportNamingProxy;

const mainImageExportServicesConfig = mainRuntimeServiceConfigBuilderService.buildMainImageExportServicesConfig({
    GTV_IMAGE_EXPORT_NAMING,
    GTV_IMAGE_EXPORT_ACTIONS,
    GTV_IMAGE_EXPORT,
    gtvT,
    pad,
    timeService,
    getCustomOffsetMinutes,
    getBaseTimezoneRef,
    getBaseTimeSnapshot,
    getActiveGroupNameSnapshot,
    getZoneAbbreviation,
    sanitizeMultiSubgroupNameForExport,
    getCurrentMultiSubgroupName,
    deferDynamicCall,
    getShowToastRef,
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
    getPatchedMultiRangesState,
    isDomExceptionLike,
    setCanUseForeignObjectRenderer
});
const mainImageExportServices = mainCoreServices.createMainImageExportServices(mainImageExportServicesConfig);
imageExportNamingService = mainImageExportServices.imageExportNamingService;
imageExportActionsService = mainImageExportServices.imageExportActionsService;

const mainAppStateServicesConfig = mainRuntimeServiceConfigBuilderService.buildMainAppStateServicesConfig({
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
    setIsRealtimeState,
    syncActiveFormatProfileFromState,
    ensureFormatProfiles,
    getCurrentFormatProfileState,
    resolveFormatProfileContext,
    applyFormatProfileState
});
const mainAppStateServices = mainCoreServices.createMainAppStateServices(mainAppStateServicesConfig);
appStatePatcherService = mainAppStateServices.appStatePatcherService;
appPersistenceStateService = mainAppStateServices.appPersistenceStateService;
ensureFormatProfiles(createDefaultFormatProfile("live"));
activateFormatProfileForCurrentContext({ syncCurrent: false });

const mainPersistenceCompositionConfig = mainCompositionConfigBuilderService.buildPersistenceCompositionConfig({
    GTV_MAIN_GROUP_TABS_SERVICE,
    GTV_MAIN_PERSISTENCE_SNAPSHOT_SERVICES,
    GTV_MAIN_PERSISTENCE_SERVICES,
    GTV_GROUP_TABS,
    t: gtvT,
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
const mainPersistenceCompositionServices = mainCoreServices.createMainPersistenceCompositionServices(
    mainPersistenceCompositionConfig
);
const mainGroupTabsService = mainPersistenceCompositionServices.mainGroupTabsService;
const groupTabsService = mainPersistenceCompositionServices.groupTabsService;
mainPersistenceSnapshotService = mainPersistenceCompositionServices.mainPersistenceSnapshotService;
const mainPersistenceServices = mainPersistenceCompositionServices.mainPersistenceServices;
persistenceServices = mainPersistenceCompositionServices.persistenceServices;
persistenceService = mainPersistenceCompositionServices.persistenceService;
settingsIoService = mainPersistenceCompositionServices.settingsIoService;
dataTransferService = mainPersistenceCompositionServices.dataTransferService;
uiSettingsActionsService = mainPersistenceCompositionServices.uiSettingsActionsService;

const mainRuntimeCompositionConfig = mainCompositionConfigBuilderService.buildRuntimeCompositionConfig({
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
const mainRuntimeCompositionServices = mainCoreServices.createMainRuntimeCompositionServices(
    mainRuntimeCompositionConfig
);
timelineFrameService = mainRuntimeCompositionServices.timelineFrameService;
fixedTimeTableService = mainRuntimeCompositionServices.fixedTimeTableService;
mainUiInitService = mainRuntimeCompositionServices.mainUiInitService;
mainClockOrchestratorService = mainRuntimeCompositionServices.mainClockOrchestratorService;
var mainRuntimeUiBridgeAccessorService = null;
if (
    GTV_MAIN_RUNTIME_UI_BRIDGE_ACCESSOR_BINDINGS
    && typeof GTV_MAIN_RUNTIME_UI_BRIDGE_ACCESSOR_BINDINGS.createService === "function"
    && GTV_MAIN_RUNTIME_UI_BRIDGE_ACCESSOR_PROXIES
    && typeof GTV_MAIN_RUNTIME_UI_BRIDGE_ACCESSOR_PROXIES.createService === "function"
) {
    mainRuntimeUiBridgeAccessorService = GTV_MAIN_RUNTIME_UI_BRIDGE_ACCESSOR_BINDINGS.createService({
        runtimeUiBridgeAccessorProxiesModule: GTV_MAIN_RUNTIME_UI_BRIDGE_ACCESSOR_PROXIES,
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
        consoleError: console.error.bind(console)
    });
}
var mainRuntimeOperationAccessorService = null;
if (
    GTV_MAIN_RUNTIME_OPERATION_ACCESSOR_BINDINGS
    && typeof GTV_MAIN_RUNTIME_OPERATION_ACCESSOR_BINDINGS.createService === "function"
    && GTV_MAIN_RUNTIME_OPERATION_ACCESSOR_PROXIES
    && typeof GTV_MAIN_RUNTIME_OPERATION_ACCESSOR_PROXIES.createService === "function"
) {
    mainRuntimeOperationAccessorService = GTV_MAIN_RUNTIME_OPERATION_ACCESSOR_BINDINGS.createService({
        runtimeOperationAccessorProxiesModule: GTV_MAIN_RUNTIME_OPERATION_ACCESSOR_PROXIES,
        callServiceMethod,
        getMainOrchestrationFlowServices: () => mainOrchestrationFlowServices,
        getTimeInputMutationsService: () => timeInputMutationsService,
        getSnapshotFormatService: () => snapshotFormatService,
        getCalculatorActionsService: () => calculatorActionsService,
        getGroupStateService: () => groupStateService,
        getPersistenceService: () => persistenceService,
        defaultCopyTimePartsEnabled: DEFAULT_COPY_TIME_PARTS_ENABLED
    });
}
const mainAppBootstrapConfig = mainRuntimeServiceConfigBuilderService.buildMainAppBootstrapConfig({
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
    showFatalError
});
mainAppBootstrapService = mainCoreServices.createMainAppBootstrapService(mainAppBootstrapConfig);
if (
    GTV_MAIN_RUNTIME_BOOTSTRAP_ACCESSOR_BINDINGS
    && typeof GTV_MAIN_RUNTIME_BOOTSTRAP_ACCESSOR_BINDINGS.createService === "function"
    && GTV_MAIN_RUNTIME_BOOTSTRAP_ACCESSOR_PROXIES
    && typeof GTV_MAIN_RUNTIME_BOOTSTRAP_ACCESSOR_PROXIES.createService === "function"
) {
    mainRuntimeBootstrapAccessorService = GTV_MAIN_RUNTIME_BOOTSTRAP_ACCESSOR_BINDINGS.createService({
        runtimeBootstrapAccessorProxiesModule: GTV_MAIN_RUNTIME_BOOTSTRAP_ACCESSOR_PROXIES,
        getMainAppBootstrapService: () => mainAppBootstrapService,
        getDocumentRefOrNull
    });
}

function callRuntimeUiBridgeAccessor(methodName, args, fallbackFn) {
    if (
        mainRuntimeUiBridgeAccessorService
        && typeof mainRuntimeUiBridgeAccessorService[methodName] === "function"
    ) {
        return mainRuntimeUiBridgeAccessorService[methodName](...args);
    }
    return fallbackFn(...args);
}

function callRuntimeOperationAccessor(methodName, args, fallbackFn) {
    if (
        mainRuntimeOperationAccessorService
        && typeof mainRuntimeOperationAccessorService[methodName] === "function"
    ) {
        return mainRuntimeOperationAccessorService[methodName](...args);
    }
    return fallbackFn(...args);
}

function callRuntimeBootstrapAccessor(methodName, args, fallbackFn) {
    if (
        mainRuntimeBootstrapAccessorService
        && typeof mainRuntimeBootstrapAccessorService[methodName] === "function"
    ) {
        return mainRuntimeBootstrapAccessorService[methodName](...args);
    }
    return fallbackFn(...args);
}

function showFatalError(err) {
    return callRuntimeUiBridgeAccessor("showFatalError", [err], (nextError) => {
        const result = callServiceMethod(
            "appFeedbackService",
            appFeedbackService,
            "showFatalError",
            [nextError],
            { fallback: SERVICE_METHOD_MISSING }
        );
        if (result === SERVICE_METHOD_MISSING) {
            console.error("FATAL ERROR during app initialization:", nextError);
        }
        return result;
    });
}

async function initApp() {
    return await callRuntimeBootstrapAccessor(
        "initApp",
        [],
        async () => await mainAppBootstrapService.initApp()
    );
}

function startBootstrapOnDomReady(initFn) {
    return callRuntimeBootstrapAccessor(
        "startBootstrapOnDomReady",
        [initFn],
        (nextInitFn) => {
            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", nextInitFn);
            } else {
                nextInitFn();
            }
        }
    );
}

startBootstrapOnDomReady(initApp);

function showToast(message, options = {}) {
    return callRuntimeUiBridgeAccessor("showToast", [message, options], (nextMessage, nextOptions) => callServiceMethod(
        "appFeedbackService",
        appFeedbackService,
        "showToast",
        [nextMessage, nextOptions]
    ));
}

function switchMainTab(tab) {
    return callRuntimeUiBridgeAccessor("switchMainTab", [tab], (nextTab) => callServiceMethod(
        "tabOrchestratorService",
        tabOrchestratorService,
        "switchMainTab",
        [nextTab]
    ));
}

function refreshOptionToggleDividers() {
    return callRuntimeUiBridgeAccessor("refreshOptionToggleDividers", [], () => callServiceMethod(
        "tabOrchestratorService",
        tabOrchestratorService,
        "refreshOptionToggleDividers",
        []
    ));
}

function getCopyFieldLabel(key) {
    return callRuntimeUiBridgeAccessor("getCopyFieldLabel", [key], (nextKey) => {
        const safeKey = (typeof nextKey === "string") ? nextKey : "";
        return callServiceMethod(
            "formatControlsService",
            formatControlsService,
            "getCopyFieldLabel",
            [safeKey],
            { fallback: safeKey }
        );
    });
}

function getTimePartLabel(partKey) {
    return callRuntimeUiBridgeAccessor("getTimePartLabel", [partKey], (nextPartKey) => {
        const safePartKey = (typeof nextPartKey === "string") ? nextPartKey : "";
        return callServiceMethod(
            "formatControlsService",
            formatControlsService,
            "getTimePartLabel",
            [safePartKey],
            { fallback: safePartKey }
        );
    });
}

function getDisplayColumns(effectiveSlotCount) {
    return callRuntimeUiBridgeAccessor("getDisplayColumns", [effectiveSlotCount], (nextSlotCount) => {
        const safeSlotCount = Number.isFinite(Number(nextSlotCount))
            ? Number(nextSlotCount)
            : getPatchedSlotCountState();
        return callServiceMethod(
            "tableRenderService",
            tableRenderService,
            "getDisplayColumns",
            [safeSlotCount],
            { fallback: [] }
        );
    });
}

function getDisplayTimeInputMode() {
    return callRuntimeUiBridgeAccessor("getDisplayTimeInputMode", [], () => callServiceMethod(
        "tableRenderService",
        tableRenderService,
        "getDisplayTimeInputMode",
        [],
        { fallback: "datetime" }
    ));
}

function buildRowActionCells(copyButtonTitle, removeButtonText, removeButtonTitle = "") {
    return callRuntimeUiBridgeAccessor(
        "buildRowActionCells",
        [copyButtonTitle, removeButtonText, removeButtonTitle],
        (nextCopyTitle, nextRemoveText, nextRemoveTitle) => {
            const safeCopyTitle = String(nextCopyTitle ?? "");
            const safeRemoveText = String(nextRemoveText ?? "");
            const safeRemoveTitle = String(nextRemoveTitle ?? "");
            return callServiceMethod(
                "tableRenderService",
                tableRenderService,
                "buildRowActionCells",
                [safeCopyTitle, safeRemoveText, safeRemoveTitle],
                { fallback: "" }
            );
        }
    );
}

// --- List Rendering (dynamic slots) ---
function renderList() {
    return callRuntimeUiBridgeAccessor("renderList", [], () => callServiceMethod(
        "mainTimezoneTableFacadeService",
        mainTimezoneTableFacadeService,
        "renderList",
        [],
        { fallback: undefined }
    ));
}

function renderTimelineFrame() {
    return callRuntimeUiBridgeAccessor("renderTimelineFrame", [], () => callServiceMethod(
        "mainTimelineFacadeService",
        mainTimelineFacadeService,
        "renderTimelineFrame",
        [],
        { fallback: undefined }
    ));
}

function resolveFixedTimeSlotUtcDate(slot, baseRef, anchorDate = getGlobalTimeState(0)) {
    return callRuntimeUiBridgeAccessor(
        "resolveFixedTimeSlotUtcDate",
        [slot, baseRef, anchorDate],
        (nextSlot, nextBaseRef, nextAnchorDate) => callServiceMethod(
            "mainFixedTimeFacadeService",
            mainFixedTimeFacadeService,
            "resolveFixedTimeSlotUtcDate",
            [nextSlot, nextBaseRef, nextAnchorDate],
            { fallback: null }
        )
    );
}

function getFixedTimeSlotHeaderLabel(slot, slotIdx, slotCount = 1) {
    return callRuntimeUiBridgeAccessor(
        "getFixedTimeSlotHeaderLabel",
        [slot, slotIdx, slotCount],
        (nextSlot, nextSlotIdx, nextSlotCount) => callServiceMethod(
            "mainFixedTimeFacadeService",
            mainFixedTimeFacadeService,
            "getFixedTimeSlotHeaderLabel",
            [nextSlot, nextSlotIdx, nextSlotCount],
            { fallback: "" }
        )
    );
}

function renderFixedTimeTab() {
    return callRuntimeUiBridgeAccessor("renderFixedTimeTab", [], () => callServiceMethod(
        "mainFixedTimeTabFacadeService",
        mainFixedTimeTabFacadeService,
        "renderFixedTimeTab",
        [],
        { fallback: undefined }
    ));
}

// --- Clock Logic ---
function updateClocks() {
    return callRuntimeOperationAccessor(
        "updateClocks",
        [],
        () => mainOrchestrationFlowServices.updateClocks()
    );
}

function resolveLocalDatePartsByTimezoneAtDate(timezone, utcDate, timezoneId = null) {
    return callRuntimeOperationAccessor(
        "resolveLocalDatePartsByTimezoneAtDate",
        [timezone, utcDate, timezoneId],
        (nextTimezone, nextUtcDate, nextTimezoneId) => (
            timeInputMutationsService.resolveLocalDatePartsByTimezoneAtDate(nextTimezone, nextUtcDate, nextTimezoneId)
        )
    );
}

function resolveLocalDatePartsByTimezone(timezone, slotIdx, timezoneId = null) {
    return callRuntimeOperationAccessor(
        "resolveLocalDatePartsByTimezone",
        [timezone, slotIdx, timezoneId],
        (nextTimezone, nextSlotIdx, nextTimezoneId) => (
            timeInputMutationsService.resolveLocalDatePartsByTimezone(nextTimezone, nextSlotIdx, nextTimezoneId)
        )
    );
}

function buildStrictUtcDateFromParts(parts) {
    return callRuntimeOperationAccessor(
        "buildStrictUtcDateFromParts",
        [parts],
        (nextParts) => timeInputMutationsService.buildStrictUtcDateFromParts(nextParts)
    );
}

function handleTimeChange(val, timezone, slotIdx, timezoneId = null, inputMode = "datetime") {
    return callRuntimeOperationAccessor(
        "handleTimeChange",
        [val, timezone, slotIdx, timezoneId, inputMode],
        (nextVal, nextTimezone, nextSlotIdx, nextTimezoneId, nextInputMode) => (
            timeInputMutationsService.handleTimeChange(nextVal, nextTimezone, nextSlotIdx, nextTimezoneId, nextInputMode)
        )
    );
}

function handleMultiRangeTimeChange(rangeIdx, val, timezone, slotIdx, timezoneId = null, inputMode = "datetime") {
    return callRuntimeOperationAccessor(
        "handleMultiRangeTimeChange",
        [rangeIdx, val, timezone, slotIdx, timezoneId, inputMode],
        (
            nextRangeIdx,
            nextVal,
            nextTimezone,
            nextSlotIdx,
            nextTimezoneId,
            nextInputMode
        ) => timeInputMutationsService.handleMultiRangeTimeChange(
            nextRangeIdx,
            nextVal,
            nextTimezone,
            nextSlotIdx,
            nextTimezoneId,
            nextInputMode
        )
    );
}

function formatTimeTextByParts(snapshot, timePartsEnabled) {
    return callRuntimeOperationAccessor(
        "formatTimeTextByParts",
        [snapshot, timePartsEnabled],
        (nextSnapshot, nextTimePartsEnabled) => {
            const safeSnapshot = (nextSnapshot && typeof nextSnapshot === "object") ? nextSnapshot : {};
            const safeTimeParts = (nextTimePartsEnabled === undefined) ? DEFAULT_COPY_TIME_PARTS_ENABLED : nextTimePartsEnabled;
            return snapshotFormatService.formatTimeTextByParts(safeSnapshot, safeTimeParts);
        }
    );
}

function formatSnapshotText(snapshot, order, enabled, timePartsEnabled = DEFAULT_COPY_TIME_PARTS_ENABLED) {
    return callRuntimeOperationAccessor(
        "formatSnapshotText",
        [snapshot, order, enabled, timePartsEnabled],
        (nextSnapshot, nextOrder, nextEnabled, nextTimePartsEnabled) => {
            const safeSnapshot = (nextSnapshot && typeof nextSnapshot === "object") ? nextSnapshot : {};
            return snapshotFormatService.formatSnapshotText(safeSnapshot, nextOrder, nextEnabled, nextTimePartsEnabled);
        }
    );
}

function initCalculators() {
    return callRuntimeOperationAccessor("initCalculators", [], () => callServiceMethod(
        "calculatorActionsService",
        calculatorActionsService,
        "initCalculators",
        []
    ));
}

async function copyText(elementId, isInput = false) {
    return await callRuntimeOperationAccessor(
        "copyText",
        [elementId, isInput],
        async (nextElementId, nextIsInput) => await callServiceMethod(
            "calculatorActionsService",
            calculatorActionsService,
            "copyText",
            [nextElementId, nextIsInput],
            { toastOnMissing: true, featureKey: "calculator-copy" }
        )
    );
}

function getPersistenceSnapshot() {
    return callRuntimeOperationAccessor(
        "getPersistenceSnapshot",
        [],
        () => mainOrchestrationFlowServices.getPersistenceSnapshot()
    );
}

function sanitizeGroup(group, idx, legacyMultiState = null) {
    return callRuntimeOperationAccessor(
        "sanitizeGroup",
        [group, idx, legacyMultiState],
        (nextGroup, nextIdx, nextLegacyMultiState) => {
            if (!nextGroup || typeof nextGroup !== "object") return null;
            const safeIdx = Number.isInteger(nextIdx) && nextIdx >= 0 ? nextIdx : 0;
            return callServiceMethod(
                "groupStateService",
                groupStateService,
                "sanitizeGroup",
                [nextGroup, safeIdx, nextLegacyMultiState],
                { fallback: null }
            );
        }
    );
}

async function loadPersistence() {
    return await callRuntimeOperationAccessor(
        "loadPersistence",
        [],
        async () => await persistenceService.loadPersistence()
    );
}

const GTV_MAIN_TEST_HELPERS = GTV_GLOBAL.GTVMainTestHelpers;
const GTV_MAIN_TEST_HELPERS_BINDINGS = GTV_GLOBAL.GTVMainTestHelpersBindings;
if (
    GTV_MAIN_TEST_HELPERS_BINDINGS
    && typeof GTV_MAIN_TEST_HELPERS_BINDINGS.createService === "function"
    && GTV_MAIN_TEST_HELPERS
    && typeof GTV_MAIN_TEST_HELPERS.createService === "function"
) {
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
}

// --- main.js end ---
