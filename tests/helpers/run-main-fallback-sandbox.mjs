import path from "node:path";
import { createRequire } from "node:module";

const MAIN_PATH = path.resolve(process.cwd(), "main.js");
const require = createRequire(import.meta.url);
const MAIN_ID = require.resolve(MAIN_PATH);

export function runMainWithSandbox({ withWindow = true, constantsDefined = true } = {}) {
    const mainConstantsBindingsStub = {
        createService: (deps = {}) => {
            const safeDeps = (deps && typeof deps === "object") ? deps : {};
            const constantsModule = safeDeps.constantsModule;
            if (!constantsModule || typeof constantsModule !== "object") {
                throw new Error("Missing required module: GTVMainConstants");
            }
            return {
                COPY_FORMAT_KEYS: [],
                TIME_PART_KEYS: [],
                PERIOD_RESULT_IDS: new Set(),
                TIMELINE_TOTAL_HOURS: 24,
                TIMELINE_TOTAL_SECONDS: 24 * 60 * 60,
                MAIN_TABS: [],
                MIN_TIME_ADJUST_DAY_STEP: 1,
                MAX_TIME_ADJUST_DAY_STEP: 36500,
                DEFAULT_TIME_ADJUST_DAY_STEP: 1,
                MIN_MULTI_RANGE_COUNT: 1,
                MAX_MULTI_RANGE_COUNT: 12,
                MIN_FIXED_TIME_SLOT_COUNT: 1,
                MAX_FIXED_TIME_SLOT_COUNT: 5,
                DEFAULT_FIXED_TIME_VALUE: "09:00",
                DEFAULT_DAY_START_HOUR: 6,
                DEFAULT_NIGHT_START_HOUR: 18,
                DAY_NIGHT_HOUR_OPTIONS: Array.from({ length: 24 }, (_, hour) => hour),
                DEFAULT_MULTI_RANGE_TITLE: "Range",
                DEFAULT_DISPLAY_FORMAT_ENABLED: {},
                DEFAULT_COPY_FORMAT_ENABLED: {},
                DEFAULT_DISPLAY_TIME_PARTS_ENABLED: {},
                DEFAULT_COPY_TIME_PARTS_ENABLED: {},
                FORMAT_PROFILE_CONTEXT_KEYS: []
            };
        }
    };
    const mainAppStateVarsStub = {
        createService: () => ({
            initialState: {},
            createDirectStateSetters: () => ({})
        })
    };
    const mainStateInitializerStub = {
        createService: () => ({
            deriveInitialState: () => ({
                isRealtime: true,
                globalTimes: [new Date(), new Date()],
                slotCount: 1,
                uiScale: 1,
                showCopyFormat: false,
                showTimeline: false,
                displayFormatOrder: [],
                displayFormatEnabled: {},
                copyFormatOrder: [],
                copyFormatEnabled: {},
                displayTimePartsEnabled: {},
                copyTimePartsEnabled: {},
                formatProfiles: {},
                activeFormatProfileContext: "live",
                timeAdjustDayStepBySlot: [1, 1],
                multiRangeCount: 1,
                multiRangeTitle: "Range",
                multiRanges: [],
                multiRangeCollapsed: [],
                multiRangeStartEditEnabled: [],
                multiRangeEndEditEnabled: [],
                currentMainTab: "live",
                activeGroupIdByMainTab: { live: 0, fixed: 0 },
                currentTheme: "dark",
                dayStartHour: 6,
                nightStartHour: 18,
                canUseForeignObjectRenderer: null,
                fixedTimeIdSeed: 0,
                groups: [],
                activeGroupId: 0
            })
        })
    };
    const mainRuntimeLangStateBindingsStub = {
        createService: (deps = {}) => {
            const safeDeps = (deps && typeof deps === "object") ? deps : {};
            const runtimeLangStateModule = safeDeps.runtimeLangStateModule;
            const service = (
                runtimeLangStateModule
                && typeof runtimeLangStateModule.createService === "function"
            )
                ? runtimeLangStateModule.createService(safeDeps)
                : {
                    syncRealtimeFlagToGlobal: () => {},
                    getRuntimeCurrentLangValue: () => "ko",
                    syncCurrentLang: (next) => String(next ?? "").trim() || "ko"
                };
            return {
                mainRuntimeLangStateService: service
            };
        }
    };
    const mainDayNightRangeUtilsBindingsStub = {
        createService: (deps = {}) => {
            const safeDeps = (deps && typeof deps === "object") ? deps : {};
            const dayNightRangeUtilsModule = safeDeps.dayNightRangeUtilsModule;
            const service = (
                dayNightRangeUtilsModule
                && typeof dayNightRangeUtilsModule.createService === "function"
            )
                ? dayNightRangeUtilsModule.createService(safeDeps)
                : {
                    sanitizeDayNightHourValue: () => 6,
                    normalizeDayNightRangeValues: () => ({ dayStartHour: 6, nightStartHour: 18 })
                };
            return {
                mainDayNightRangeUtilsService: service
            };
        }
    };
    const mainAppStateVarsBindingsStub = {
        createService: (deps = {}) => {
            const safeDeps = (deps && typeof deps === "object") ? deps : {};
            const appStateVarsModule = safeDeps.appStateVarsModule;
            const service = (
                appStateVarsModule
                && typeof appStateVarsModule.createService === "function"
            )
                ? appStateVarsModule.createService(safeDeps)
                : {
                    initialState: {},
                    createDirectStateSetters: () => ({})
                };
            return {
                mainAppStateVarsService: service
            };
        }
    };
    const mainStateInitializerBindingsStub = {
        createService: (deps = {}) => {
            const safeDeps = (deps && typeof deps === "object") ? deps : {};
            const stateInitializerModule = safeDeps.stateInitializerModule;
            const service = (
                stateInitializerModule
                && typeof stateInitializerModule.createService === "function"
            )
                ? stateInitializerModule.createService(safeDeps)
                : {
                    deriveInitialState: () => ({
                        isRealtime: true,
                        globalTimes: [new Date(), new Date()],
                        slotCount: 1,
                        uiScale: 1,
                        showCopyFormat: false,
                        showTimeline: false,
                        displayFormatOrder: [],
                        displayFormatEnabled: {},
                        copyFormatOrder: [],
                        copyFormatEnabled: {},
                        displayTimePartsEnabled: {},
                        copyTimePartsEnabled: {},
                        formatProfiles: {},
                        activeFormatProfileContext: "live",
                        timeAdjustDayStepBySlot: [1, 1],
                        multiRangeCount: 1,
                        multiRangeTitle: "Range",
                        multiRanges: [],
                        multiRangeCollapsed: [],
                        multiRangeStartEditEnabled: [],
                        multiRangeEndEditEnabled: [],
                        currentMainTab: "live",
                        activeGroupIdByMainTab: { live: 0, fixed: 0 },
                        currentTheme: "dark",
                        dayStartHour: 6,
                        nightStartHour: 18,
                        canUseForeignObjectRenderer: null,
                        fixedTimeIdSeed: 0,
                        groups: [],
                        activeGroupId: 0
                    })
                };
            return {
                mainStateInitializerService: service
            };
        }
    };
    const mainBootstrapGuardStub = {
        createService: () => ({
            assertRequiredServices: () => {}
        })
    };
    const mainBootstrapGuardBindingsStub = {
        createService: (deps = {}) => {
            const safeDeps = (deps && typeof deps === "object") ? deps : {};
            const bootstrapGuardModule = safeDeps.bootstrapGuardModule;
            const service = (
                bootstrapGuardModule
                && typeof bootstrapGuardModule.createService === "function"
            )
                ? bootstrapGuardModule.createService(safeDeps)
                : { assertRequiredServices: () => {} };
            return {
                mainBootstrapGuardService: service
            };
        }
    };
    const mainRuntimeBridgeProxiesStub = {
        createService: () => ({})
    };
    const mainRuntimeBridgeProxyBindingsStub = {
        createService: (deps = {}) => {
            const safeDeps = (deps && typeof deps === "object") ? deps : {};
            const runtimeBridgeProxiesModule = safeDeps.runtimeBridgeProxiesModule;
            const service = (
                runtimeBridgeProxiesModule
                && typeof runtimeBridgeProxiesModule.createService === "function"
            )
                ? runtimeBridgeProxiesModule.createService(safeDeps)
                : {};
            return {
                mainRuntimeBridgeProxiesService: service,
                ...service
            };
        }
    };
    const mainFacadeMethodBinderStub = {
        createService: () => ({
            deriveFacadeServiceName: () => "facadeService",
            bindFacadeMethod: () => () => undefined
        })
    };
    const mainFacadeMethodBinderBindingsStub = {
        createService: (deps = {}) => {
            const safeDeps = (deps && typeof deps === "object") ? deps : {};
            const facadeMethodBinderModule = safeDeps.facadeMethodBinderModule;
            const service = (
                facadeMethodBinderModule
                && typeof facadeMethodBinderModule.createService === "function"
            )
                ? facadeMethodBinderModule.createService(safeDeps)
                : {
                    deriveFacadeServiceName: () => "facadeService",
                    bindFacadeMethod: () => () => undefined
                };
            return {
                mainFacadeMethodBinderService: service,
                deriveFacadeServiceName: service.deriveFacadeServiceName,
                bindFacadeMethod: service.bindFacadeMethod
            };
        }
    };
    const mainRuntimeServiceBridgeAccessorBindingsStub = {
        createService: () => ({
            warnMissingServiceMethod: () => undefined,
            showMissingFeatureToastOnce: () => undefined,
            getServiceMethod: (serviceName, serviceRef, methodName) => {
                void serviceName;
                return (
                    serviceRef && typeof serviceRef[methodName] === "function"
                        ? serviceRef[methodName].bind(serviceRef)
                        : null
                );
            },
            callServiceMethod: (serviceName, serviceRef, methodName, args = [], options = {}) => {
                void serviceName;
                if (serviceRef && typeof serviceRef[methodName] === "function") {
                    return serviceRef[methodName](...args);
                }
                return options.fallback;
            },
            savePersistenceSafely: () => undefined,
            renderMultiRangesSafely: () => undefined
        })
    };
    const mainRuntimeServiceBridgeHelperBindingsStub = {
        createService: () => ({
            mainRuntimeServiceBridgeHelpersService: {}
        })
    };
    const mainRuntimeCoreAccessorBindingsStub = {
        createService: () => ({
            syncRealtimeFlagToGlobal: () => undefined,
            getRuntimeCurrentLangValue: () => "ko",
            syncCurrentLang: (next) => String(next ?? "").trim() || "ko",
            sanitizeDayNightHourValue: () => 6,
            normalizeDayNightRangeValues: () => ({ dayStartHour: 6, nightStartHour: 18 }),
            assertRequiredServices: () => undefined
        })
    };
    const mainTestHelpersStub = {
        createService: () => ({
            install: () => false
        })
    };
    const mainTestHelpersBindingsStub = {
        createService: (deps = {}) => {
            const safeDeps = (deps && typeof deps === "object") ? deps : {};
            const testHelpersModule = safeDeps.testHelpersModule;
            if (!testHelpersModule || typeof testHelpersModule.createService !== "function") {
                throw new Error("Missing required module API: GTVMainTestHelpers.createService");
            }
            return {
                mainTestHelpersService: testHelpersModule.createService(safeDeps)
            };
        }
    };
    const mainRuntimePublicApiBindingsStub = {
        createService: (deps = {}) => {
            const safeDeps = (deps && typeof deps === "object") ? deps : {};
            const getUiBridgeAccessorService = (typeof safeDeps.getUiBridgeAccessorService === "function")
                ? safeDeps.getUiBridgeAccessorService
                : (() => safeDeps.uiBridgeAccessorService);
            const getOperationAccessorService = (typeof safeDeps.getOperationAccessorService === "function")
                ? safeDeps.getOperationAccessorService
                : (() => safeDeps.operationAccessorService);
            const getBootstrapAccessorService = (typeof safeDeps.getBootstrapAccessorService === "function")
                ? safeDeps.getBootstrapAccessorService
                : (() => safeDeps.bootstrapAccessorService);
            const getGlobalTimeState = (typeof safeDeps.getGlobalTimeState === "function")
                ? safeDeps.getGlobalTimeState
                : (() => undefined);
            const defaultCopyTimePartsEnabled = safeDeps.defaultCopyTimePartsEnabled;

            return {
                showFatalError: (err) => getUiBridgeAccessorService().showFatalError(err),
                initApp: async () => await getBootstrapAccessorService().initApp(),
                startBootstrapOnDomReady: (initFn) => getBootstrapAccessorService().startBootstrapOnDomReady(initFn),
                showToast: (message, options = {}) => getUiBridgeAccessorService().showToast(message, options),
                switchMainTab: (tab) => getUiBridgeAccessorService().switchMainTab(tab),
                refreshOptionToggleDividers: () => getUiBridgeAccessorService().refreshOptionToggleDividers(),
                getCopyFieldLabel: (key) => getUiBridgeAccessorService().getCopyFieldLabel(key),
                getTimePartLabel: (partKey) => getUiBridgeAccessorService().getTimePartLabel(partKey),
                getDisplayColumns: (effectiveSlotCount) => getUiBridgeAccessorService().getDisplayColumns(effectiveSlotCount),
                getDisplayTimeInputMode: () => getUiBridgeAccessorService().getDisplayTimeInputMode(),
                buildRowActionCells: (copyButtonTitle, removeButtonText, removeButtonTitle = "") => (
                    getUiBridgeAccessorService().buildRowActionCells(copyButtonTitle, removeButtonText, removeButtonTitle)
                ),
                renderList: () => getUiBridgeAccessorService().renderList(),
                renderTimelineFrame: () => getUiBridgeAccessorService().renderTimelineFrame(),
                resolveFixedTimeSlotUtcDate: (slot, baseRef, anchorDate = getGlobalTimeState(0)) => (
                    getUiBridgeAccessorService().resolveFixedTimeSlotUtcDate(slot, baseRef, anchorDate)
                ),
                getFixedTimeSlotHeaderLabel: (slot, slotIdx, slotCount = 1) => (
                    getUiBridgeAccessorService().getFixedTimeSlotHeaderLabel(slot, slotIdx, slotCount)
                ),
                renderFixedTimeTab: () => getUiBridgeAccessorService().renderFixedTimeTab(),
                updateClocks: () => getOperationAccessorService().updateClocks(),
                resolveLocalDatePartsByTimezoneAtDate: (timezone, utcDate, timezoneId = null) => (
                    getOperationAccessorService().resolveLocalDatePartsByTimezoneAtDate(timezone, utcDate, timezoneId)
                ),
                resolveLocalDatePartsByTimezone: (timezone, slotIdx, timezoneId = null) => (
                    getOperationAccessorService().resolveLocalDatePartsByTimezone(timezone, slotIdx, timezoneId)
                ),
                buildStrictUtcDateFromParts: (parts) => getOperationAccessorService().buildStrictUtcDateFromParts(parts),
                handleTimeChange: (val, timezone, slotIdx, timezoneId = null, inputMode = "datetime") => (
                    getOperationAccessorService().handleTimeChange(val, timezone, slotIdx, timezoneId, inputMode)
                ),
                handleMultiRangeTimeChange: (
                    rangeIdx,
                    val,
                    timezone,
                    slotIdx,
                    timezoneId = null,
                    inputMode = "datetime"
                ) => getOperationAccessorService().handleMultiRangeTimeChange(
                    rangeIdx,
                    val,
                    timezone,
                    slotIdx,
                    timezoneId,
                    inputMode
                ),
                formatTimeTextByParts: (snapshot, timePartsEnabled) => (
                    getOperationAccessorService().formatTimeTextByParts(snapshot, timePartsEnabled)
                ),
                formatSnapshotText: (
                    snapshot,
                    order,
                    enabled,
                    timePartsEnabled = defaultCopyTimePartsEnabled
                ) => getOperationAccessorService().formatSnapshotText(snapshot, order, enabled, timePartsEnabled),
                initCalculators: () => getOperationAccessorService().initCalculators(),
                copyText: async (elementId, isInput = false) => (
                    await getOperationAccessorService().copyText(elementId, isInput)
                ),
                getPersistenceSnapshot: () => getOperationAccessorService().getPersistenceSnapshot(),
                sanitizeGroup: (group, idx, legacyMultiState = null) => (
                    getOperationAccessorService().sanitizeGroup(group, idx, legacyMultiState)
                ),
                loadPersistence: async () => await getOperationAccessorService().loadPersistence()
            };
        }
    };
    const createNoopServiceProxy = (fallbackValue = undefined) => new Proxy({}, {
        get: () => (() => fallbackValue)
    });
    const mainRuntimeCoreServiceBootstrapStub = {
        createService: () => {
            const mainSelectServices = {
                adjustSelectWidthForContent: () => undefined,
                refreshSelectWidths: () => undefined,
                renderBaseTimeSelect: () => undefined
            };
            return {
                mainSelectServices,
                adjustSelectWidthForContent: mainSelectServices.adjustSelectWidthForContent,
                refreshSelectWidths: mainSelectServices.refreshSelectWidths,
                renderBaseTimeSelect: mainSelectServices.renderBaseTimeSelect,
                timezoneSearchService: createNoopServiceProxy(),
                snapshotFormatService: createNoopServiceProxy()
            };
        }
    };
    const mainRuntimeStateCoreBootstrapStub = {
        createService: () => ({
            mainRuntimeHostUtilsService: createNoopServiceProxy(),
            applyVersionBranding: () => undefined,
            createCanvasSafely: () => null,
            getRandomUUIDSafely: () => "fallback-uuid",
            getDocumentRefOrNull: () => null,
            getWindowRefOrNull: () => null,
            getLocationRefOrNull: () => null,
            getGlobalThisRefOrNull: () => globalThis,
            getLuxonGlobalRef: () => null,
            getComputedStyleSafely: () => null,
            getRuntimeNowMs: () => Date.now(),
            setRuntimeInterval: () => 0,
            clearRuntimeInterval: () => undefined,
            deferDynamicCall: async (fn, args = []) => (typeof fn === "function" ? fn(...args) : undefined),
            mainRuntimePrimaryStateService: createNoopServiceProxy(),
            setIsRealtimeState: () => undefined,
            getIsRealtimeState: () => true,
            getGlobalTimesState: () => [new Date(), new Date()],
            getGlobalTimeState: () => new Date(),
            setGlobalTimeState: () => undefined,
            getUiScaleState: () => 1,
            mainRuntimePatchedStateFallbackService: createNoopServiceProxy(),
            mainRuntimeStatePatchAccessorService: {
                applyDirectStatePatch: () => undefined,
                buildPatchedStateFallbackSnapshot: () => ({})
            },
            buildPatchedStateFallbackSnapshot: () => ({}),
            mainRuntimeLocalStateHelpersService: createNoopServiceProxy(),
            setMultiRangeState: () => undefined,
            getNextFixedTimeSeed: () => 1,
            setUiPreferencesState: () => undefined,
            getBaseTimeSnapshot: () => new Date(),
            getFixedTimeSlotCountForGroupRef: () => 1,
            confirmRuntime: () => true,
            getActiveCopyFormatKeysForCurrentContext: () => [],
            getActiveTimePartKeysForCurrentContext: () => [],
            getCurrentUiScalePercent: () => 100,
            getFixedTimeSlotCountForCurrentGroup: () => 1,
            getCurrentGroupFixedTimeShowLiveNow: () => false,
            shouldRunRealtimeTick: () => true,
            getTimeAdjustDayStepValue: () => 1
        })
    };
    const mainRuntimeCoreAssemblyBootstrapStub = {
        createService: () => ({
            mainCoreAssemblyConfig: {}
        })
    };
    const mainRuntimeCoreFoundationBootstrapStub = {
        createService: () => ({
            mainCoreServices: createNoopServiceProxy(),
            mainFoundationServices: createNoopServiceProxy(),
            mainServiceMethodBridgeService: createNoopServiceProxy(),
            mainDirectStatePatchService: createNoopServiceProxy(),
            mainAppStateBridgeService: createNoopServiceProxy(),
            mainPatchedStateSelectorsService: createNoopServiceProxy(),
            mainSharedUtilsService: createNoopServiceProxy(),
            mainTimezoneRuntimeBridgeService: createNoopServiceProxy(),
            mainTimezoneRuntimeService: createNoopServiceProxy(),
            mainTimezoneFacadeService: createNoopServiceProxy(),
            mainBaseTimezoneService: createNoopServiceProxy(),
            mainTimezoneMutationService: createNoopServiceProxy(),
            mainTimezoneTableFacadeService: createNoopServiceProxy(),
            mainTimeAdjustFacadeService: createNoopServiceProxy(),
            mainFixedTimeTabFacadeService: createNoopServiceProxy(),
            mainFixedTimeFacadeService: createNoopServiceProxy(),
            mainTimelineFacadeService: createNoopServiceProxy(),
            mainMultiRangeTabFacadeService: createNoopServiceProxy(),
            mainGroupLocalizationServices: createNoopServiceProxy(),
            mainOrchestrationFlowServices: {
                parseAutoGeneratedIndexedName: () => ({ index: 0 }),
                localizeAutoGeneratedNamesForCurrentLanguage: () => undefined,
                getCurrentMultiSubgroup: () => null,
                getCurrentMultiSubgroupName: () => "",
                syncCurrentMultiStateToActiveSubgroup: () => undefined,
                loadCurrentMultiStateFromActiveSubgroup: () => undefined
            },
            appFeedbackService: createNoopServiceProxy(),
            calculatorActionsService: createNoopServiceProxy(),
            serviceBootstrap: createNoopServiceProxy(),
            persistenceServiceBundleFactory: createNoopServiceProxy(),
            mainUiUtilsService: createNoopServiceProxy(),
            setCustomTooltip: () => undefined,
            upgradeNativeTitleTooltips: () => undefined,
            hideFloatingTooltip: () => undefined,
            bindFloatingTooltipEvents: () => undefined,
            clearDragGhost: () => undefined,
            createDragGhostFromRow: () => null,
            groupContextStateService: createNoopServiceProxy(),
            formatProfileStateService: createNoopServiceProxy(),
            multiRangeStateService: createNoopServiceProxy(),
            fixedTimeSlotUtilsService: createNoopServiceProxy(),
            fixedTimeStateService: createNoopServiceProxy(),
            uiPreferencesStateService: createNoopServiceProxy(),
            timerEngineService: createNoopServiceProxy(),
            timeService: createNoopServiceProxy(),
            mainStateDomainProxiesService: createNoopServiceProxy()
        })
    };
    const mainRuntimeTableImageBootstrapStub = {
        createService: () => ({
            timeInputMutationsService: createNoopServiceProxy(),
            bindRowContainerDragAndDrop: () => undefined,
            initDragAndDrop: () => undefined,
            captureReorderableRowRects: () => undefined,
            animateReorderTransition: () => undefined,
            getAfter: () => null,
            saveOrderForContainer: () => undefined,
            saveOrder: () => undefined,
            updateRow: () => undefined,
            tableRenderService: createNoopServiceProxy(),
            collectDocumentCssText: () => "",
            cloneTableForImageExport: () => null,
            cloneMultiRangeBlockForImageExport: () => null,
            renderElementWithForeignObjectToPngDataUrl: async () => "",
            loadImageElement: async () => null,
            waitForDocumentFontsReady: async () => undefined,
            isDomExceptionLike: () => false,
            detectForeignObjectRendererSupport: async () => false,
            extractTableCellText: () => "",
            extractTableHeaderText: () => "",
            getActiveTableExportContext: () => ({}),
            renderTimezoneTableFallbackDataUrl: async () => "",
            renderTimezoneTableToPngDataUrl: async () => "",
            renderMultiRangesFallbackDataUrl: async () => "",
            renderMultiRangesToPngDataUrl: async () => "",
            renderMultiRangeSingleToPngDataUrl: async () => "",
            renderMultiRangeTitlesToPngDataUrl: async () => "",
            saveTimezoneTableImage: async () => undefined,
            saveMultiRangeTitlesImage: async () => undefined,
            saveMultiRangeSingleImage: async () => undefined,
            getImageExportDeps: () => ({}),
            imageCloneService: createNoopServiceProxy(),
            imageForeignRenderService: createNoopServiceProxy(),
            imageExportBridgeService: createNoopServiceProxy(),
            tableImageRenderService: createNoopServiceProxy(),
            multiRangeImageRenderService: createNoopServiceProxy()
        })
    };
    const mainRuntimeDomainServiceBootstrapStub = {
        createService: () => ({
            fixedTimeCoreService: createNoopServiceProxy(),
            fixedTimeTimelineService: createNoopServiceProxy(),
            fixedTimeActionsService: createNoopServiceProxy(),
            multiRangeRenderService: createNoopServiceProxy(),
            multiRangeCopyService: createNoopServiceProxy(),
            copyActionsService: createNoopServiceProxy(),
            timeAdjustUiService: createNoopServiceProxy(),
            multiBulkToolsService: createNoopServiceProxy(),
            timeAdjustActionsService: createNoopServiceProxy(),
            formatControlsService: createNoopServiceProxy(),
            tabUiService: createNoopServiceProxy(),
            tabOrchestratorService: createNoopServiceProxy(),
            multiStateService: createNoopServiceProxy(),
            groupStateService: createNoopServiceProxy(),
            sanitizeFilenamePart: (value = "") => String(value),
            formatDateTimeByTimezone: () => "",
            getTimezoneTableImageFilename: () => "timezone.png",
            getMultiRangeTableImageFilename: () => "multi-range.png",
            getMultiRangeTitlesImageFilename: () => "multi-range-titles.png",
            imageExportNamingService: createNoopServiceProxy(),
            imageExportActionsService: createNoopServiceProxy(),
            appStatePatcherService: createNoopServiceProxy(),
            appPersistenceStateService: createNoopServiceProxy()
        })
    };
    const mainRuntimePersistenceCompositionBootstrapStub = {
        createService: () => ({
            mainGroupTabsService: createNoopServiceProxy(),
            groupTabsService: createNoopServiceProxy(),
            mainPersistenceSnapshotService: createNoopServiceProxy(),
            mainPersistenceServices: createNoopServiceProxy(),
            persistenceServices: createNoopServiceProxy(),
            persistenceService: createNoopServiceProxy(),
            settingsIoService: createNoopServiceProxy(),
            dataTransferService: createNoopServiceProxy(),
            uiSettingsActionsService: createNoopServiceProxy()
        })
    };
    const mainRuntimeCompositionBootstrapStub = {
        createService: () => ({
            timelineFrameService: createNoopServiceProxy(),
            fixedTimeTableService: createNoopServiceProxy(),
            mainUiInitService: createNoopServiceProxy(),
            mainClockOrchestratorService: createNoopServiceProxy()
        })
    };
    const mainRuntimeStateHelperBootstrapStub = {
        createService: () => ({
            mainRuntimeStateHelperAccessorService: createNoopServiceProxy()
        })
    };
    const mainRuntimeBootstrapWiringStub = {
        createService: () => ({
            mainRuntimeUiBridgeAccessorService: createNoopServiceProxy(),
            mainRuntimeOperationAccessorService: createNoopServiceProxy(),
            mainRuntimePublicApiService: {
                showFatalError: () => undefined,
                initApp: async () => undefined,
                startBootstrapOnDomReady: () => undefined,
                showToast: () => undefined,
                switchMainTab: () => undefined,
                refreshOptionToggleDividers: () => undefined,
                getCopyFieldLabel: () => "",
                getTimePartLabel: () => "",
                getDisplayColumns: () => [],
                getDisplayTimeInputMode: () => "datetime",
                buildRowActionCells: () => "",
                renderList: () => undefined,
                renderTimelineFrame: () => undefined,
                resolveFixedTimeSlotUtcDate: () => null,
                getFixedTimeSlotHeaderLabel: () => "",
                renderFixedTimeTab: () => undefined,
                updateClocks: () => undefined,
                resolveLocalDatePartsByTimezoneAtDate: () => null,
                resolveLocalDatePartsByTimezone: () => null,
                buildStrictUtcDateFromParts: () => null,
                handleTimeChange: () => undefined,
                handleMultiRangeTimeChange: () => undefined,
                formatTimeTextByParts: () => "",
                formatSnapshotText: () => "",
                initCalculators: () => undefined,
                copyText: async () => undefined,
                getPersistenceSnapshot: () => ({}),
                sanitizeGroup: () => ({}),
                loadPersistence: async () => undefined
            },
            mainAppBootstrapService: createNoopServiceProxy(),
            mainRuntimeBootstrapAccessorService: createNoopServiceProxy()
        })
    };
    const MAIN_GLOBAL_BINDING_MAP = Object.freeze({
        GTV_MAIN_BOOTSTRAP_GUARD: "GTVMainBootstrapGuard",
        GTV_MAIN_BOOTSTRAP_GUARD_BINDINGS: "GTVMainBootstrapGuardBindings",
        GTV_MAIN_RUNTIME_HOST_UTILS: "GTVMainRuntimeHostUtils",
        GTV_MAIN_RUNTIME_HOST_UTILS_BINDINGS: "GTVMainRuntimeHostUtilsBindings",
        GTV_MAIN_RUNTIME_HOST_ACCESSOR_PROXIES: "GTVMainRuntimeHostAccessorProxies",
        GTV_MAIN_RUNTIME_HOST_ACCESSOR_BINDINGS: "GTVMainRuntimeHostAccessorBindings",
        GTV_MAIN_RUNTIME_PRIMARY_STATE: "GTVMainRuntimePrimaryState",
        GTV_MAIN_RUNTIME_PRIMARY_STATE_BINDINGS: "GTVMainRuntimePrimaryStateBindings",
        GTV_MAIN_RUNTIME_PRIMARY_STATE_ACCESSOR_PROXIES: "GTVMainRuntimePrimaryStateAccessorProxies",
        GTV_MAIN_RUNTIME_PRIMARY_STATE_ACCESSOR_BINDINGS: "GTVMainRuntimePrimaryStateAccessorBindings",
        GTV_MAIN_RUNTIME_SERVICE_BRIDGE_HELPERS: "GTVMainRuntimeServiceBridgeHelpers",
        GTV_MAIN_RUNTIME_SERVICE_BRIDGE_HELPER_BINDINGS: "GTVMainRuntimeServiceBridgeHelperBindings",
        GTV_MAIN_RUNTIME_SERVICE_BRIDGE_ACCESSOR_PROXIES: "GTVMainRuntimeServiceBridgeAccessorProxies",
        GTV_MAIN_RUNTIME_SERVICE_BRIDGE_ACCESSOR_BINDINGS: "GTVMainRuntimeServiceBridgeAccessorBindings",
        GTV_MAIN_RUNTIME_UI_BRIDGE_ACCESSOR_PROXIES: "GTVMainRuntimeUiBridgeAccessorProxies",
        GTV_MAIN_RUNTIME_UI_BRIDGE_ACCESSOR_BINDINGS: "GTVMainRuntimeUiBridgeAccessorBindings",
        GTV_MAIN_RUNTIME_OPERATION_ACCESSOR_PROXIES: "GTVMainRuntimeOperationAccessorProxies",
        GTV_MAIN_RUNTIME_OPERATION_ACCESSOR_BINDINGS: "GTVMainRuntimeOperationAccessorBindings",
        GTV_MAIN_RUNTIME_PUBLIC_API_BINDINGS: "GTVMainRuntimePublicApiBindings",
        GTV_MAIN_RUNTIME_BOOTSTRAP_ACCESSOR_PROXIES: "GTVMainRuntimeBootstrapAccessorProxies",
        GTV_MAIN_RUNTIME_BOOTSTRAP_ACCESSOR_BINDINGS: "GTVMainRuntimeBootstrapAccessorBindings",
        GTV_MAIN_RUNTIME_CORE_ACCESSOR_PROXIES: "GTVMainRuntimeCoreAccessorProxies",
        GTV_MAIN_RUNTIME_CORE_ACCESSOR_BINDINGS: "GTVMainRuntimeCoreAccessorBindings",
        GTV_MAIN_RUNTIME_STATE_PATCH_ACCESSOR_PROXIES: "GTVMainRuntimeStatePatchAccessorProxies",
        GTV_MAIN_RUNTIME_STATE_PATCH_ACCESSOR_BINDINGS: "GTVMainRuntimeStatePatchAccessorBindings",
        GTV_MAIN_RUNTIME_PATCHED_STATE_FALLBACK: "GTVMainRuntimePatchedStateFallback",
        GTV_MAIN_RUNTIME_PATCHED_STATE_FALLBACK_BINDINGS: "GTVMainRuntimePatchedStateFallbackBindings",
        GTV_MAIN_RUNTIME_LOCAL_STATE_HELPERS: "GTVMainRuntimeLocalStateHelpers",
        GTV_MAIN_RUNTIME_LOCAL_STATE_HELPERS_BINDINGS: "GTVMainRuntimeLocalStateHelpersBindings",
        GTV_MAIN_RUNTIME_LOCAL_STATE_ACCESSOR_PROXIES: "GTVMainRuntimeLocalStateAccessorProxies",
        GTV_MAIN_RUNTIME_LOCAL_STATE_ACCESSOR_BINDINGS: "GTVMainRuntimeLocalStateAccessorBindings",
        GTV_MAIN_FACADE_BINDINGS: "GTVMainFacadeBindings",
        GTV_MAIN_RUNTIME_BRIDGE_PROXIES: "GTVMainRuntimeBridgeProxies",
        GTV_MAIN_RUNTIME_BRIDGE_PROXY_BINDINGS: "GTVMainRuntimeBridgeProxyBindings",
        GTV_MAIN_RUNTIME_TIMEZONE_HELPERS: "GTVMainRuntimeTimezoneHelpers",
        GTV_MAIN_RUNTIME_TIMEZONE_HELPER_BINDINGS: "GTVMainRuntimeTimezoneHelperBindings",
        GTV_MAIN_RUNTIME_STATE_HELPERS: "GTVMainRuntimeStateHelpers",
        GTV_MAIN_RUNTIME_STATE_HELPER_ALIASES: "GTVMainRuntimeStateHelperAliases",
        GTV_MAIN_RUNTIME_STATE_HELPER_ALIASES_BINDINGS: "GTVMainRuntimeStateHelperAliasesBindings",
        GTV_MAIN_RUNTIME_STATE_HELPER_ACCESSOR_PROXIES: "GTVMainRuntimeStateHelperAccessorProxies",
        GTV_MAIN_RUNTIME_STATE_HELPER_ACCESSOR_BINDINGS: "GTVMainRuntimeStateHelperAccessorBindings",
        GTV_MAIN_FORMAT_PROFILE_FACADE_BINDINGS: "GTVMainFormatProfileFacadeBindings",
        GTV_MAIN_CORE_SERVICE_ASSEMBLY_BINDINGS: "GTVMainCoreServiceAssemblyBindings",
        GTV_MAIN_FOUNDATION_SERVICES_BINDINGS: "GTVMainFoundationServicesBindings",
        GTV_MAIN_RUNTIME_REFERENCE_ACCESSOR_BINDINGS: "GTVMainRuntimeReferenceAccessorBindings",
        GTV_MAIN_RUNTIME_REFERENCE_ACCESSORS: "GTVMainRuntimeReferenceAccessors",
        GTV_MAIN_STATE_DOMAIN_WRAPPER_BRIDGE: "GTVMainStateDomainWrapperBridge",
        GTV_MAIN_STATE_DOMAIN_WRAPPER_BRIDGE_BINDINGS: "GTVMainStateDomainWrapperBridgeBindings",
        GTV_MAIN_STATE_DOMAIN_WRAPPER_GLOBAL_BINDINGS: "GTVMainStateDomainWrapperGlobalBindings",
        GTV_MAIN_STATE_DOMAIN_WRAPPER_GLOBAL_BINDINGS_BRIDGE: "GTVMainStateDomainWrapperGlobalBindingsBridge",
        GTV_MAIN_STATE_DOMAIN_PROXY_BINDINGS: "GTVMainStateDomainProxyBindings",
        GTV_MAIN_FACADE_METHOD_BINDER: "GTVMainFacadeMethodBinder",
        GTV_MAIN_FACADE_METHOD_BINDER_BINDINGS: "GTVMainFacadeMethodBinderBindings",
        GTV_MAIN_FACADE_BRIDGE: "GTVMainFacadeBridge",
        GTV_MAIN_FACADE_BRIDGE_BINDINGS: "GTVMainFacadeBridgeBindings",
        GTV_MAIN_COMPOSITION_CONFIG_BUILDER: "GTVMainCompositionConfigBuilder",
        GTV_MAIN_COMPOSITION_CONFIG_BUILDER_BINDINGS: "GTVMainCompositionConfigBuilderBindings",
        GTV_MAIN_CORE_ASSEMBLY_CONFIG_BUILDER: "GTVMainCoreAssemblyConfigBuilder",
        GTV_MAIN_CORE_ASSEMBLY_CONFIG_BUILDER_BINDINGS: "GTVMainCoreAssemblyConfigBuilderBindings",
        GTV_MAIN_CORE_SERVICE_BINDINGS: "GTVMainCoreServiceBindings",
        GTV_MAIN_FOUNDATION_SERVICE_BINDINGS: "GTVMainFoundationServiceBindings",
        GTV_MAIN_RUNTIME_SERVICE_CONFIG_BUILDER: "GTVMainRuntimeServiceConfigBuilder",
        GTV_MAIN_RUNTIME_SERVICE_CONFIG_BUILDER_BINDINGS: "GTVMainRuntimeServiceConfigBuilderBindings",
        GTV_MAIN_PATCHED_STATE_ACCESSOR_PROXIES: "GTVMainPatchedStateAccessorProxies",
        GTV_MAIN_PATCHED_STATE_ACCESSOR_BINDINGS: "GTVMainPatchedStateAccessorBindings"
    });
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
    const mainGlobalBindingsStub = {
        createService: (deps = {}) => {
            const safeDeps = (deps && typeof deps === "object") ? deps : {};
            const globalRef = (safeDeps.globalRef && typeof safeDeps.globalRef === "object")
                ? safeDeps.globalRef
                : globalThis;
            const resolved = {};
            Object.entries(MAIN_GLOBAL_BINDING_MAP).forEach(([localKey, globalKey]) => {
                resolved[localKey] = globalRef[globalKey];
            });
            return {
                ...resolved,
                REQUIRED_BOOTSTRAP_SPECS
            };
        }
    };
    const mainCoreServiceAssemblyStub = {
        createService: () => ({
            mainServiceMethodBridgeService: null,
            mainDirectStatePatchService: null,
            mainAppStateBridgeService: null,
            mainSharedUtilsService: null,
            mainTimezoneFacadeService: null,
            mainTimezoneTableFacadeService: null,
            mainTimeAdjustFacadeService: null,
            mainFixedTimeTabFacadeService: null,
            mainMultiRangeTabFacadeService: null
        })
    };
    const mainModuleResolutionBindingsStub = {
        createService: (deps = {}) => {
            const safeDeps = (deps && typeof deps === "object") ? deps : {};
            const moduleResolverModule = safeDeps.moduleResolverModule;
            const moduleSpecModule = safeDeps.moduleSpecModule;
            if (!moduleResolverModule || typeof moduleResolverModule.resolveModules !== "function") {
                throw new Error("Missing required module API: GTVMainModuleResolver.resolveModules");
            }
            if (!moduleSpecModule || typeof moduleSpecModule.createSpecMap !== "function") {
                throw new Error("Missing required module API: GTVMainModuleSpec.createSpecMap");
            }
            return {
                resolveModulesFromSpec: () => moduleResolverModule.resolveModules(moduleSpecModule.createSpecMap())
            };
        }
    };
    const mainRuntimeLangStateStub = {
        createService: () => ({
            syncRealtimeFlagToGlobal: () => {},
            getRuntimeCurrentLangValue: () => "ko",
            syncCurrentLang: (next) => String(next ?? "").trim() || "ko"
        })
    };
    const mainDayNightRangeUtilsStub = {
        createService: () => ({
            sanitizeDayNightHourValue: () => 6,
            normalizeDayNightRangeValues: () => ({ dayStartHour: 6, nightStartHour: 18 })
        })
    };
    const globalPatches = {
        console,
        setTimeout,
        clearTimeout,
        t: () => "Range"
    };
    if (withWindow) {
        const windowRef = {};
        if (constantsDefined) windowRef.GTVMainConstants = {};
        windowRef.GTVMainConstantsBindings = mainConstantsBindingsStub;
        windowRef.GTVMainRuntimeLangState = mainRuntimeLangStateStub;
        windowRef.GTVMainRuntimeLangStateBindings = mainRuntimeLangStateBindingsStub;
        windowRef.GTVMainDayNightRangeUtils = mainDayNightRangeUtilsStub;
        windowRef.GTVMainDayNightRangeUtilsBindings = mainDayNightRangeUtilsBindingsStub;
        windowRef.GTVMainAppStateVars = mainAppStateVarsStub;
        windowRef.GTVMainAppStateVarsBindings = mainAppStateVarsBindingsStub;
        windowRef.GTVMainStateInitializer = mainStateInitializerStub;
        windowRef.GTVMainStateInitializerBindings = mainStateInitializerBindingsStub;
        windowRef.GTVMainBootstrapGuard = mainBootstrapGuardStub;
        windowRef.GTVMainBootstrapGuardBindings = mainBootstrapGuardBindingsStub;
        windowRef.GTVMainRuntimeBridgeProxies = mainRuntimeBridgeProxiesStub;
        windowRef.GTVMainRuntimeBridgeProxyBindings = mainRuntimeBridgeProxyBindingsStub;
        windowRef.GTVMainFacadeMethodBinder = mainFacadeMethodBinderStub;
        windowRef.GTVMainFacadeMethodBinderBindings = mainFacadeMethodBinderBindingsStub;
        windowRef.GTVMainRuntimeServiceBridgeHelperBindings = mainRuntimeServiceBridgeHelperBindingsStub;
        windowRef.GTVMainRuntimeServiceBridgeAccessorBindings = mainRuntimeServiceBridgeAccessorBindingsStub;
        windowRef.GTVMainRuntimeCoreAccessorBindings = mainRuntimeCoreAccessorBindingsStub;
        windowRef.GTVMainRuntimePublicApiBindings = mainRuntimePublicApiBindingsStub;
        windowRef.GTVMainRuntimeStateCoreBootstrap = mainRuntimeStateCoreBootstrapStub;
        windowRef.GTVMainRuntimeCoreServiceBootstrap = mainRuntimeCoreServiceBootstrapStub;
        windowRef.GTVMainRuntimeCoreAssemblyBootstrap = mainRuntimeCoreAssemblyBootstrapStub;
        windowRef.GTVMainRuntimeCoreFoundationBootstrap = mainRuntimeCoreFoundationBootstrapStub;
        windowRef.GTVMainRuntimeTableImageBootstrap = mainRuntimeTableImageBootstrapStub;
        windowRef.GTVMainRuntimeDomainServiceBootstrap = mainRuntimeDomainServiceBootstrapStub;
        windowRef.GTVMainRuntimePersistenceCompositionBootstrap = mainRuntimePersistenceCompositionBootstrapStub;
        windowRef.GTVMainRuntimeCompositionBootstrap = mainRuntimeCompositionBootstrapStub;
        windowRef.GTVMainRuntimeStateHelperBootstrap = mainRuntimeStateHelperBootstrapStub;
        windowRef.GTVMainRuntimeBootstrapWiring = mainRuntimeBootstrapWiringStub;
        windowRef.GTVMainGlobalBindings = mainGlobalBindingsStub;
        windowRef.GTVMainTestHelpers = mainTestHelpersStub;
        windowRef.GTVMainTestHelpersBindings = mainTestHelpersBindingsStub;
        windowRef.GTVMainCoreServiceAssembly = mainCoreServiceAssemblyStub;
        windowRef.GTVMainModuleResolutionBindings = mainModuleResolutionBindingsStub;
        globalPatches.window = windowRef;
    } else if (constantsDefined) {
        globalPatches.GTVMainConstants = {};
        globalPatches.GTVMainConstantsBindings = mainConstantsBindingsStub;
        globalPatches.GTVMainRuntimeLangState = mainRuntimeLangStateStub;
        globalPatches.GTVMainRuntimeLangStateBindings = mainRuntimeLangStateBindingsStub;
        globalPatches.GTVMainDayNightRangeUtils = mainDayNightRangeUtilsStub;
        globalPatches.GTVMainDayNightRangeUtilsBindings = mainDayNightRangeUtilsBindingsStub;
        globalPatches.GTVMainAppStateVars = mainAppStateVarsStub;
        globalPatches.GTVMainAppStateVarsBindings = mainAppStateVarsBindingsStub;
        globalPatches.GTVMainStateInitializer = mainStateInitializerStub;
        globalPatches.GTVMainStateInitializerBindings = mainStateInitializerBindingsStub;
        globalPatches.GTVMainBootstrapGuard = mainBootstrapGuardStub;
        globalPatches.GTVMainBootstrapGuardBindings = mainBootstrapGuardBindingsStub;
        globalPatches.GTVMainRuntimeBridgeProxies = mainRuntimeBridgeProxiesStub;
        globalPatches.GTVMainRuntimeBridgeProxyBindings = mainRuntimeBridgeProxyBindingsStub;
        globalPatches.GTVMainFacadeMethodBinder = mainFacadeMethodBinderStub;
        globalPatches.GTVMainFacadeMethodBinderBindings = mainFacadeMethodBinderBindingsStub;
        globalPatches.GTVMainRuntimeServiceBridgeHelperBindings = mainRuntimeServiceBridgeHelperBindingsStub;
        globalPatches.GTVMainRuntimeServiceBridgeAccessorBindings = mainRuntimeServiceBridgeAccessorBindingsStub;
        globalPatches.GTVMainRuntimeCoreAccessorBindings = mainRuntimeCoreAccessorBindingsStub;
        globalPatches.GTVMainRuntimePublicApiBindings = mainRuntimePublicApiBindingsStub;
        globalPatches.GTVMainRuntimeStateCoreBootstrap = mainRuntimeStateCoreBootstrapStub;
        globalPatches.GTVMainRuntimeCoreServiceBootstrap = mainRuntimeCoreServiceBootstrapStub;
        globalPatches.GTVMainRuntimeCoreAssemblyBootstrap = mainRuntimeCoreAssemblyBootstrapStub;
        globalPatches.GTVMainRuntimeCoreFoundationBootstrap = mainRuntimeCoreFoundationBootstrapStub;
        globalPatches.GTVMainRuntimeTableImageBootstrap = mainRuntimeTableImageBootstrapStub;
        globalPatches.GTVMainRuntimeDomainServiceBootstrap = mainRuntimeDomainServiceBootstrapStub;
        globalPatches.GTVMainRuntimePersistenceCompositionBootstrap = mainRuntimePersistenceCompositionBootstrapStub;
        globalPatches.GTVMainRuntimeCompositionBootstrap = mainRuntimeCompositionBootstrapStub;
        globalPatches.GTVMainRuntimeStateHelperBootstrap = mainRuntimeStateHelperBootstrapStub;
        globalPatches.GTVMainRuntimeBootstrapWiring = mainRuntimeBootstrapWiringStub;
        globalPatches.GTVMainGlobalBindings = mainGlobalBindingsStub;
        globalPatches.GTVMainTestHelpers = mainTestHelpersStub;
        globalPatches.GTVMainTestHelpersBindings = mainTestHelpersBindingsStub;
        globalPatches.GTVMainCoreServiceAssembly = mainCoreServiceAssemblyStub;
        globalPatches.GTVMainModuleResolutionBindings = mainModuleResolutionBindingsStub;
    }
    const keys = [
        "window",
        "console",
        "setTimeout",
        "clearTimeout",
        "t",
        "GTVMainConstants",
        "GTVMainConstantsBindings",
        "GTVMainRuntimeLangState",
        "GTVMainRuntimeLangStateBindings",
        "GTVMainDayNightRangeUtils",
        "GTVMainDayNightRangeUtilsBindings",
        "GTVMainAppStateVars",
        "GTVMainAppStateVarsBindings",
        "GTVMainStateInitializer",
        "GTVMainStateInitializerBindings",
        "GTVMainBootstrapGuard",
        "GTVMainBootstrapGuardBindings",
        "GTVMainRuntimeBridgeProxies",
        "GTVMainRuntimeBridgeProxyBindings",
        "GTVMainFacadeMethodBinder",
        "GTVMainFacadeMethodBinderBindings",
        "GTVMainRuntimeServiceBridgeHelperBindings",
        "GTVMainRuntimeServiceBridgeAccessorBindings",
        "GTVMainRuntimeCoreAccessorBindings",
        "GTVMainRuntimePublicApiBindings",
        "GTVMainRuntimeStateCoreBootstrap",
        "GTVMainRuntimeCoreServiceBootstrap",
        "GTVMainRuntimeCoreAssemblyBootstrap",
        "GTVMainRuntimeCoreFoundationBootstrap",
        "GTVMainRuntimeTableImageBootstrap",
        "GTVMainRuntimeDomainServiceBootstrap",
        "GTVMainRuntimePersistenceCompositionBootstrap",
        "GTVMainRuntimeCompositionBootstrap",
        "GTVMainRuntimeStateHelperBootstrap",
        "GTVMainRuntimeBootstrapWiring",
        "GTVMainGlobalBindings",
        "GTVMainTestHelpers",
        "GTVMainTestHelpersBindings",
        "GTVMainCoreServiceAssembly",
        "GTVMainModuleResolutionBindings",
        ...Object.keys(globalPatches)
    ];
    const previous = new Map();
    keys.forEach((key) => {
        previous.set(key, {
            exists: Object.prototype.hasOwnProperty.call(globalThis, key),
            value: globalThis[key]
        });
    });

    try {
        Object.entries(globalPatches).forEach(([key, value]) => {
            globalThis[key] = value;
        });
        delete require.cache[MAIN_ID];
        require(MAIN_PATH);
        return null;
    } catch (err) {
        return err;
    } finally {
        delete require.cache[MAIN_ID];
        keys.forEach((key) => {
            const entry = previous.get(key);
            if (!entry || !entry.exists) {
                delete globalThis[key];
                return;
            }
            globalThis[key] = entry.value;
        });
    }
}
