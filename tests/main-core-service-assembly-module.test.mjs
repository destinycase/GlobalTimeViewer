import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-core-service-assembly.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainCoreServiceAssemblyModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainCoreServiceAssembly", ...Object.keys(globalPatches)];
    const previous = new Map();
    keys.forEach((key) => {
        previous.set(key, {
            exists: Object.prototype.hasOwnProperty.call(globalThis, key),
            value: globalThis[key]
        });
    });

    Object.entries(globalPatches).forEach(([key, value]) => {
        globalThis[key] = value;
    });

    delete require.cache[MODULE_ID];
    require(MODULE_PATH);
    moduleCleanupStack.push(() => {
        delete require.cache[MODULE_ID];
        keys.forEach((key) => {
            const entry = previous.get(key);
            if (!entry || !entry.exists) {
                delete globalThis[key];
                return;
            }
            globalThis[key] = entry.value;
        });
    });

    return globalThis.window?.GTVMainCoreServiceAssembly || globalThis.GTVMainCoreServiceAssembly;
}

describe("GTV main core service assembly module", () => {
    afterEach(() => {
        while (moduleCleanupStack.length) {
            const cleanup = moduleCleanupStack.pop();
            try {
                cleanup();
            } catch {
                // Ignore cleanup failures in tests.
            }
        }
    });
    it("assembles core services using provided module APIs", () => {
        const moduleApi = loadMainCoreServiceAssemblyModule();
        const calls = {};
        const shouldRunRealtimeTick = () => false;
        const makeApi = (name) => ({
            createService: (deps) => {
                calls[name] = deps;
                return { name };
            }
        });

        const assembled = moduleApi.createService({
            GTV_MAIN_SERVICE_METHOD_BRIDGE: makeApi("bridge"),
            GTV_MAIN_DIRECT_STATE_PATCH: makeApi("patch"),
            GTV_MAIN_APP_STATE_BRIDGE: makeApi("appBridge"),
            GTV_MAIN_PATCHED_STATE_SELECTORS: makeApi("patchedSelectors"),
            GTV_MAIN_SHARED_UTILS: makeApi("shared"),
            GTV_MAIN_TIMEZONE_RUNTIME_BRIDGE: makeApi("runtimeBridge"),
            GTV_MAIN_TIMEZONE_RUNTIME_SERVICES: makeApi("tzRuntime"),
            GTV_MAIN_FORMAT_PROFILE_FACADE: makeApi("formatFacade"),
            GTV_MAIN_TIMEZONE_FACADE: makeApi("tzFacade"),
            GTV_MAIN_BASE_TIMEZONE_SERVICES: makeApi("baseTimezone"),
            GTV_MAIN_TIMEZONE_MUTATION_SERVICES: makeApi("tzMutation"),
            GTV_MAIN_TIMEZONE_TABLE_FACADE: makeApi("tzTableFacade"),
            GTV_MAIN_TIME_ADJUST_FACADE: makeApi("adjustFacade"),
            GTV_MAIN_FIXED_TIME_TAB_FACADE: makeApi("fixedFacade"),
            GTV_MAIN_FIXED_TIME_FACADE: makeApi("fixedTimeFacade"),
            GTV_MAIN_TIMELINE_FACADE: makeApi("timelineFacade"),
            GTV_MAIN_MULTI_RANGE_TAB_FACADE: makeApi("multiFacade"),
            GTV_MAIN_GROUP_LOCALIZATION_SERVICES: makeApi("groupLocalization"),
            GTV_MAIN_ORCHESTRATION_FLOW_SERVICES: makeApi("orchestrationFlow"),
            GTV_MAIN_SELECT_SERVICES: makeApi("selectServices"),
            GTV_TIMEZONE_SEARCH: makeApi("timezoneSearch"),
            GTV_SNAPSHOT_FORMAT: makeApi("snapshotFormat"),
            GTV_TIME_INPUT_MUTATIONS: makeApi("timeInputMutations"),
            GTV_MAIN_ROW_ORDER_SERVICES: makeApi("rowOrder"),
            GTV_MAIN_ROW_VIEW_SERVICES: makeApi("rowView"),
            GTV_TABLE_RENDER: makeApi("tableRender"),
            GTV_MAIN_IMAGE_EXPORT_BRIDGE_PROXY: makeApi("imageExportBridgeProxy"),
            GTV_MAIN_IMAGE_RUNTIME_SERVICES: makeApi("imageRuntimeServices"),
            GTV_MAIN_FIXED_TIME_SERVICES: makeApi("fixedTimeServices"),
            GTV_MAIN_MULTI_RANGE_SERVICES: makeApi("multiRangeServices"),
            GTV_MAIN_TIME_ADJUST_SERVICES: makeApi("timeAdjustServices"),
            GTV_MAIN_TAB_SERVICES: makeApi("tabServices"),
            GTV_MAIN_GROUP_STATE_SERVICES: makeApi("groupStateServices"),
            GTV_MAIN_IMAGE_EXPORT_NAMING_PROXY: makeApi("imageExportNamingProxy"),
            GTV_MAIN_IMAGE_EXPORT_SERVICES: makeApi("imageExportServices"),
            GTV_MAIN_APP_STATE_SERVICES: makeApi("appStateServices"),
            GTV_MAIN_PERSISTENCE_COMPOSITION_SERVICES: makeApi("persistenceCompositionServices"),
            GTV_MAIN_RUNTIME_COMPOSITION_SERVICES: makeApi("runtimeCompositionServices"),
            GTV_MAIN_APP_BOOTSTRAP: makeApi("appBootstrap"),
            GTV_GROUP_CONTEXT_STATE: makeApi("groupContext"),
            GTV_FORMAT_PROFILE_STATE: makeApi("formatProfile"),
            GTV_MULTI_RANGE_STATE: makeApi("multiRange"),
            GTV_FIXED_TIME_SLOT_UTILS: makeApi("fixedTimeSlotUtils"),
            GTV_FIXED_TIME_STATE: makeApi("fixedTimeState"),
            GTV_UI_PREFERENCES_STATE: makeApi("uiPrefs"),
            GTV_TIMER_ENGINE: makeApi("timerEngine"),
            GTV_TIME_SERVICE: makeApi("timeService"),
            onWarnMissingMethod: () => {},
            onMissingFeature: () => {},
            stateSetters: { slotCount: () => {} },
            setIsRealtimeState: () => {},
            callServiceMethod: () => {},
            getAppStatePatcherService: () => null,
            getAppPersistenceStateService: () => null,
            applyDirectStatePatch: () => {},
            serviceMethodMissingToken: Symbol("missing"),
            getPatchedStateFallback: () => ({ currentMainTab: "live", slotCount: 1 }),
            tableImageExportWidth: 1920,
            createCanvas: () => null,
            getMainTimezoneRuntimeBridgeService: () => null,
            getMainBaseTimezoneService: () => null,
            getMainTimezoneMutationService: () => null,
            getTimezoneSearchService: () => null,
            getTimeCore: () => null,
            getBaseTime: () => new Date(),
            getZoneMap: () => ({}),
            getTzDatabase: () => [],
            getTimeService: () => null,
            formatUtcOffsetLabel: () => "UTC+00:00",
            resolveLocalizedTZLabel: () => "",
            timezoneOffsetCache: new Map(),
            timezoneDstCache: new Map(),
            zoneAbbrCache: new Map(),
            getCurrentGroupBaseTimezoneId: () => "utc",
            sanitizeTimezoneId: (value) => value,
            getNextTimezoneIdSeed: () => 1,
            getRandomUUID: () => "",
            getRandom: () => 0.5,
            getGroupStateService: () => null,
            normalizeCustomAbbr: (value) => String(value || "").trim().toUpperCase(),
            sanitizeBaseTimezoneId: (value) => value,
            renderList: () => {},
            getTableRenderService: () => null,
            getMainTimezoneFacadeService: () => null,
            getCopyActionsService: () => null,
            isFixedTimeTab: () => false,
            renderFixedTimeTab: () => {},
            getTimeAdjustUiService: () => null,
            getTimeAdjustActionsService: () => null,
            getMultiBulkToolsService: () => null,
            getTimeAdjustDayStepBySlotSnapshot: () => [1, 1],
            setTimeAdjustDayStepBySlotState: () => {},
            defaultTimeAdjustDayStep: 1,
            minTimeAdjustDayStep: 1,
            maxTimeAdjustDayStep: 36500,
            getFixedTimeTableService: () => null,
            getCurrentGroup: () => ({}),
            ensureGroupFixedTimes: () => {},
            refreshFixedTimeSlotCountControls: () => {},
            getDocumentRef: () => null,
            renderBaseTimeSelect: () => {},
            getMultiRangeRenderService: () => null,
            getMultiRangeCopyService: () => null,
            getMultiStateService: () => null,
            getMultiRangeStateSnapshot: () => ({
                multiRangeCount: 1,
                multiRanges: [],
                multiRangeCollapsed: [],
                multiRangeStartEditEnabled: [],
                multiRangeEndEditEnabled: [],
                multiRangeTitle: "Range"
            }),
            setMultiRangeState: () => {},
            sanitizeMultiRangeCount: (value) => value,
            sanitizeMultiRangeTitle: (value) => value,
            ensureMultiRangeState: () => {},
            refreshMultiRangeControls: () => {},
            now: () => Date.now(),
            getMainClockOrchestratorService: () => null,
            getMainPersistenceSnapshotService: () => null,
            warnMissingServiceMethod: () => {},
            getFixedTimeCoreService: () => null,
            getFixedTimeActionsService: () => null,
            getPatchedCopyFormatOrderState: () => ["date", "time"],
            getPatchedCopyFormatEnabledState: () => ({ time: true }),
            getPatchedCopyTimePartsEnabledState: () => ({ hour: true }),
            sanitizeCopyFormatOrderForContext: (value) => value,
            sanitizeCopyFormatEnabledForContext: (value) => value,
            sanitizeTimePartsEnabledForContext: (value) => value,
            getWindowRef: () => null,
            getTimelineFrameService: () => null,
            getFixedTimeTimelineService: () => null,
            getMainTabState: () => "live",
            getShowTimelineState: () => false,
            getGlobalTimeState: () => new Date(),
            getFixedTimeSlotCountForGroup: () => 1,
            getFixedTimeSlotHeaderLabel: () => "1",
            getSlotCountState: () => 1,
            MAIN_TABS: ["live", "fixed"],
            getGroupsStateSnapshot: () => [],
            getPatchedActiveFormatProfileContextState: () => "live",
            getPatchedMainTabState: () => "live",
            getPatchedActiveGroupIdState: () => 0,
            getActiveGroupIdByMainTabStateSnapshot: () => ({ live: 0, fixed: 0 }),
            patchPrimaryState: () => {},
            getUTCRef: () => ({ id: "utc", zone: "UTC" }),
            sanitizeUtcRowOrder: () => [],
            COPY_FORMAT_KEYS: ["date", "time"],
            TIME_PART_KEYS: ["day", "hour"],
            FORMAT_PROFILE_CONTEXT_KEYS: ["live", "fixed"],
            DEFAULT_DISPLAY_FORMAT_ENABLED: { date: true },
            DEFAULT_COPY_FORMAT_ENABLED: { time: true },
            DEFAULT_DISPLAY_TIME_PARTS_ENABLED: { day: true },
            DEFAULT_COPY_TIME_PARTS_ENABLED: { hour: true },
            sanitizeMainTab: (tab) => tab,
            getDisplayFormatOrderState: () => ["date", "time"],
            getDisplayFormatEnabledState: () => ({ date: true }),
            getDisplayTimePartsEnabledState: () => ({ day: true }),
            getCopyFormatOrderState: () => ["date", "time"],
            getCopyFormatEnabledState: () => ({ time: true }),
            getCopyTimePartsEnabledState: () => ({ hour: true }),
            getFormatProfilesState: () => ({}),
            getActiveFormatProfileContextState: () => "live",
            getPatchedSlotCountState: () => 1,
            patchAppState: () => {},
            MIN_MULTI_RANGE_COUNT: 1,
            MAX_MULTI_RANGE_COUNT: 12,
            DEFAULT_MULTI_RANGE_TITLE: "Range",
            t: () => "text",
            showToast: () => {},
            sanitizeUtcMs: (value) => Number(value || 0),
            getGlobalTimesState: () => [new Date(), new Date()],
            getCurrentMultiRangeStateSnapshot: () => ({
                multiRangeCount: 1,
                multiRanges: [],
                multiRangeCollapsed: [],
                multiRangeStartEditEnabled: [],
                multiRangeEndEditEnabled: [],
                multiRangeTitle: "Range"
            }),
            isMultiTab: () => false,
            renderMultiRangesSafely: () => {},
            updateTimeAdjustPanelSafely: () => {},
            savePersistenceSafely: () => {},
            MIN_FIXED_TIME_SLOT_COUNT: 1,
            MAX_FIXED_TIME_SLOT_COUNT: 5,
            DEFAULT_FIXED_TIME_VALUE: "09:00",
            pad: (value) => String(value).padStart(2, "0"),
            parseDateTimeParts: () => null,
            buildStrictUtcDateFromParts: () => new Date(),
            getNextFixedTimeSeed: () => 1,
            sanitizeFixedDateValue: (value) => value,
            sanitizeFixedTimeSlotCount: (value) => value,
            renderTimelineFrame: () => {},
            createUniqueFixedTimeId: () => "fixed-1",
            createDefaultFixedTimeSlot: () => ({ id: "fixed-1" }),
            MIN_UI_SCALE_PERCENT: 60,
            MAX_UI_SCALE_PERCENT: 140,
            DEFAULT_UI_SCALE_PERCENT: 100,
            UI_SCALE_PERCENT_OPTIONS: [80, 90, 100],
            THEME_LIST: ["dark", "light"],
            THEME_STORAGE_KEY: "theme",
            UI_SCALE_STORAGE_KEY: "ui-scale",
            I18N_DATA: { ko: {}, en: {} },
            getStorageValue: () => null,
            setStorageValue: () => {},
            getUiScaleState: () => 1,
            getCurrentThemeState: () => "dark",
            getRuntimeCurrentLangState: () => "ko",
            getCurrentLangState: () => "ko",
            setUiPreferencesState: () => {},
            DEFAULT_REALTIME_TICK_MS: 1000,
            getIsRealtimeState: () => true,
            shouldRunRealtimeTick,
            setGlobalTimeState: () => {},
            maxRuntimeCacheSize: 4096,
            updateClocks: () => {},
            setIntervalFn: () => 1,
            clearIntervalFn: () => {},
            luxon: {}
        });

        expect(calls.bridge).toHaveProperty("onWarnMissingMethod");
        expect(calls.patch).toHaveProperty("stateSetters");
        expect(calls.appBridge).toHaveProperty("applyDirectStatePatch");
        expect(calls.patchedSelectors).toHaveProperty("getPatchedStateValue");
        expect(calls.shared).toHaveProperty("tableImageExportWidth");
        expect(calls.runtimeBridge).toHaveProperty("getMainTimezoneRuntimeService");
        expect(calls.tzRuntime).toHaveProperty("getZoneMap");
        expect(calls.formatFacade).toHaveProperty("getFormatProfileStateService");
        expect(calls.tzFacade).toHaveProperty("getMainTimezoneMutationService");
        expect(calls.baseTimezone).toHaveProperty("sanitizeBaseTimezoneId");
        expect(calls.tzMutation).toHaveProperty("sanitizeTimezoneId");
        expect(calls.tzTableFacade).toHaveProperty("getCopyActionsService");
        expect(calls.adjustFacade).toHaveProperty("maxTimeAdjustDayStep");
        expect(calls.fixedFacade).toHaveProperty("refreshFixedTimeSlotCountControls");
        expect(calls.fixedFacade).toHaveProperty("getDocumentRef");
        expect(calls.fixedTimeFacade).toHaveProperty("getFixedTimeCoreService");
        expect(calls.fixedTimeFacade).toHaveProperty("getCopyTimePartsEnabledState");
        expect(calls.timelineFacade).toHaveProperty("getTimelineFrameService");
        expect(calls.timelineFacade).toHaveProperty("getSlotCountState");
        expect(calls.multiFacade).toHaveProperty("getMultiRangeCopyService");
        expect(calls.groupLocalization).toHaveProperty("getCurrentGroup");
        expect(calls.orchestrationFlow).toHaveProperty("getMainClockOrchestratorService");
        expect(calls.groupContext).toHaveProperty("MAIN_TABS");
        expect(calls.formatProfile).toHaveProperty("COPY_FORMAT_KEYS");
        expect(calls.multiRange).toHaveProperty("MIN_MULTI_RANGE_COUNT");
        expect(calls.fixedTimeSlotUtils).toHaveProperty("DEFAULT_FIXED_TIME_VALUE");
        expect(calls.fixedTimeState).toHaveProperty("sanitizeFixedTimeSlotCount");
        expect(calls.uiPrefs).toHaveProperty("MIN_UI_SCALE_PERCENT");
        expect(calls.timerEngine).toHaveProperty("DEFAULT_REALTIME_TICK_MS");
        expect(calls.timerEngine.shouldTick).toBe(shouldRunRealtimeTick);
        expect(calls.timeService).toHaveProperty("luxon");
        expect(assembled.createMainSelectServices({ a: 1 })).toEqual({ name: "selectServices" });
        expect(assembled.createTimezoneSearchService({ a: 1 })).toEqual({ name: "timezoneSearch" });
        expect(assembled.createSnapshotFormatService({ a: 1 })).toEqual({ name: "snapshotFormat" });
        expect(assembled.createTimeInputMutationsService({ a: 1 })).toEqual({ name: "timeInputMutations" });
        expect(assembled.createMainRowOrderServices({ a: 1 })).toEqual({ name: "rowOrder" });
        expect(assembled.createMainRowViewServices({ a: 1 })).toEqual({ name: "rowView" });
        expect(assembled.createTableRenderService({ a: 1 })).toEqual({ name: "tableRender" });
        expect(assembled.createMainImageExportBridgeProxy({ a: 1 })).toEqual({ name: "imageExportBridgeProxy" });
        expect(assembled.createMainImageRuntimeServices({ a: 1 })).toEqual({ name: "imageRuntimeServices" });
        expect(assembled.createMainFixedTimeServices({ a: 1 })).toEqual({ name: "fixedTimeServices" });
        expect(assembled.createMainMultiRangeServices({ a: 1 })).toEqual({ name: "multiRangeServices" });
        expect(assembled.createMainTimeAdjustServices({ a: 1 })).toEqual({ name: "timeAdjustServices" });
        expect(assembled.createMainTabServices({ a: 1 })).toEqual({ name: "tabServices" });
        expect(assembled.createMainGroupStateServices({ a: 1 })).toEqual({ name: "groupStateServices" });
        expect(assembled.createMainImageExportNamingProxy({ a: 1 })).toEqual({ name: "imageExportNamingProxy" });
        expect(assembled.createMainImageExportServices({ a: 1 })).toEqual({ name: "imageExportServices" });
        expect(assembled.createMainAppStateServices({ a: 1 })).toEqual({ name: "appStateServices" });
        expect(assembled.createMainPersistenceCompositionServices({ a: 1 })).toEqual({ name: "persistenceCompositionServices" });
        expect(assembled.createMainRuntimeCompositionServices({ a: 1 })).toEqual({ name: "runtimeCompositionServices" });
        expect(assembled.createMainAppBootstrapService({ a: 1 })).toEqual({ name: "appBootstrap" });
        expect(calls.selectServices).toHaveProperty("a");
        expect(calls.runtimeCompositionServices).toHaveProperty("a");

        expect(assembled.mainServiceMethodBridgeService).toEqual({ name: "bridge" });
        expect(assembled.mainPatchedStateSelectorsService).toEqual({ name: "patchedSelectors" });
        expect(assembled.mainTimezoneRuntimeBridgeService).toEqual({ name: "runtimeBridge" });
        expect(assembled.mainTimezoneRuntimeService).toEqual({ name: "tzRuntime" });
        expect(assembled.mainBaseTimezoneService).toEqual({ name: "baseTimezone" });
        expect(assembled.mainTimezoneMutationService).toEqual({ name: "tzMutation" });
        expect(assembled.mainTimeAdjustFacadeService).toEqual({ name: "adjustFacade" });
        expect(assembled.mainFixedTimeFacadeService).toEqual({ name: "fixedTimeFacade" });
        expect(assembled.mainTimelineFacadeService).toEqual({ name: "timelineFacade" });
        expect(assembled.mainFormatProfileFacadeService).toEqual({ name: "formatFacade" });
        expect(assembled.mainMultiRangeTabFacadeService).toEqual({ name: "multiFacade" });
        expect(assembled.mainGroupLocalizationServices).toEqual({ name: "groupLocalization" });
        expect(assembled.mainOrchestrationFlowServices).toEqual({ name: "orchestrationFlow" });
        expect(assembled.groupContextStateService).toEqual({ name: "groupContext" });
        expect(assembled.timeService).toEqual({ name: "timeService" });
    });

    it("throws a TypeError when a required structural dependency factory is completely omitted", () => {
        const moduleApi = loadMainCoreServiceAssemblyModule();
        
        // Provide an empty deps object, which should cause deps.GTV_MAIN_SERVICE_METHOD_BRIDGE.createService to throw
        expect(() => {
            moduleApi.createService({});
        }).toThrow(/Cannot read properties of undefined/);
        
        // Provide partial deps but missing one in the middle (e.g., GTV_MAIN_FORMAT_PROFILE_FACADE)
        const makeApi = (name) => ({ createService: () => ({ name }) });
        const partialDeps = {
            GTV_MAIN_SERVICE_METHOD_BRIDGE: makeApi("b"),
            GTV_MAIN_DIRECT_STATE_PATCH: makeApi("p"),
            GTV_MAIN_APP_STATE_BRIDGE: makeApi("a"),
            GTV_MAIN_PATCHED_STATE_SELECTORS: makeApi("ps"),
            GTV_MAIN_SHARED_UTILS: makeApi("su"),
            GTV_MAIN_TIMEZONE_RUNTIME_BRIDGE: makeApi("trb"),
            GTV_MAIN_TIMEZONE_RUNTIME_SERVICES: makeApi("trs")
            // Intentionally missing GTV_MAIN_TIMEZONE_FACADE and others
        };

        expect(() => {
            moduleApi.createService(partialDeps);
        }).toThrow(/Cannot read properties of undefined/);
    });

    it("prioritizes getRuntimeCurrentLangState over getCurrentLangState dynamically", () => {
        const moduleApi = loadMainCoreServiceAssemblyModule();
        let runtimeLangCalled = false;
        let currentLangCalled = false;

        const calls = {};
        const makeApi = (name) => ({
            createService: (deps) => {
                calls[name] = deps;
                return { name };
            }
        });

        const mockDeps = {
            GTV_MAIN_SERVICE_METHOD_BRIDGE: makeApi("bridge"),
            GTV_MAIN_DIRECT_STATE_PATCH: makeApi("patch"),
            GTV_MAIN_APP_STATE_BRIDGE: makeApi("appBridge"),
            GTV_MAIN_PATCHED_STATE_SELECTORS: makeApi("patchedSelectors"),
            GTV_MAIN_SHARED_UTILS: makeApi("shared"),
            GTV_MAIN_TIMEZONE_RUNTIME_BRIDGE: makeApi("runtimeBridge"),
            GTV_MAIN_TIMEZONE_RUNTIME_SERVICES: makeApi("tzRuntime"),
            GTV_MAIN_FORMAT_PROFILE_FACADE: makeApi("f"),
            GTV_MAIN_TIMEZONE_FACADE: makeApi("tz"),
            GTV_MAIN_BASE_TIMEZONE_SERVICES: makeApi("b"),
            GTV_MAIN_TIMEZONE_MUTATION_SERVICES: makeApi("m"),
            GTV_MAIN_TIMEZONE_TABLE_FACADE: makeApi("t"),
            GTV_MAIN_TIME_ADJUST_FACADE: makeApi("a"),
            GTV_MAIN_FIXED_TIME_TAB_FACADE: makeApi("ft"),
            GTV_MAIN_FIXED_TIME_FACADE: makeApi("ff"),
            GTV_MAIN_TIMELINE_FACADE: makeApi("tf"),
            GTV_MAIN_MULTI_RANGE_TAB_FACADE: makeApi("mt"),
            GTV_MAIN_GROUP_LOCALIZATION_SERVICES: makeApi("gl"),
            GTV_MAIN_ORCHESTRATION_FLOW_SERVICES: makeApi("of"),
            GTV_MAIN_SELECT_SERVICES: makeApi("ss"),
            GTV_TIMEZONE_SEARCH: makeApi("ts"),
            GTV_SNAPSHOT_FORMAT: makeApi("sf"),
            GTV_TIME_INPUT_MUTATIONS: makeApi("ti"),
            GTV_MAIN_ROW_ORDER_SERVICES: makeApi("ro"),
            GTV_MAIN_ROW_VIEW_SERVICES: makeApi("rv"),
            GTV_TABLE_RENDER: makeApi("tr"),
            GTV_MAIN_IMAGE_EXPORT_BRIDGE_PROXY: makeApi("iebp"),
            GTV_MAIN_IMAGE_RUNTIME_SERVICES: makeApi("irs"),
            GTV_MAIN_FIXED_TIME_SERVICES: makeApi("fts"),
            GTV_MAIN_MULTI_RANGE_SERVICES: makeApi("mrs"),
            GTV_MAIN_TIME_ADJUST_SERVICES: makeApi("tas"),
            GTV_MAIN_TAB_SERVICES: makeApi("tabs"),
            GTV_MAIN_GROUP_STATE_SERVICES: makeApi("gss"),
            GTV_MAIN_IMAGE_EXPORT_NAMING_PROXY: makeApi("ienp"),
            GTV_MAIN_IMAGE_EXPORT_SERVICES: makeApi("ies"),
            GTV_MAIN_APP_STATE_SERVICES: makeApi("ass"),
            GTV_MAIN_PERSISTENCE_COMPOSITION_SERVICES: makeApi("pcs"),
            GTV_MAIN_RUNTIME_COMPOSITION_SERVICES: makeApi("rcs"),
            GTV_MAIN_APP_BOOTSTRAP: makeApi("ab"),
            GTV_GROUP_CONTEXT_STATE: makeApi("gc"),
            GTV_FORMAT_PROFILE_STATE: makeApi("fp"),
            GTV_MULTI_RANGE_STATE: makeApi("mr"),
            GTV_FIXED_TIME_SLOT_UTILS: makeApi("ftsu"),
            GTV_FIXED_TIME_STATE: makeApi("ftsState"),
            GTV_UI_PREFERENCES_STATE: makeApi("uip"),
            GTV_TIMER_ENGINE: makeApi("te"),
            GTV_TIME_SERVICE: makeApi("timesvc"),
            getRuntimeCurrentLangState: () => { runtimeLangCalled = true; return "ko"; },
            getCurrentLangState: () => { currentLangCalled = true; return "en"; }
        };

        // When creating, the priority logic should inject getRuntimeCurrentLangState into tzRuntime
        moduleApi.createService(mockDeps);
        
        // Execute the bound function inside tzRuntime to verify it calls the runtime version
        const boundLangFn = calls.tzRuntime.getCurrentLang;
        expect(boundLangFn()).toBe("ko");
        expect(runtimeLangCalled).toBe(true);
        expect(currentLangCalled).toBe(false);
    });
});
