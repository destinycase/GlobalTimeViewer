import path from "node:path";
import { createRequire } from "node:module";

import { describe, expect, it } from "vitest";

const MAIN_PATH = path.resolve(process.cwd(), "main.js");
const require = createRequire(import.meta.url);
const MAIN_ID = require.resolve(MAIN_PATH);

function runMainWithSandbox({ withWindow = true, constantsDefined = true } = {}) {
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

describe("main.js fallback coverage guards", () => {
    it("uses constant fallbacks in window context before resolver guard fails", () => {
        const err = runMainWithSandbox({ withWindow: true, constantsDefined: true });
        expect(String(err?.message || "")).toContain("Missing required module API: GTVMainModuleResolver.resolveModules");
    });

    it("supports globalThis constants path when window is absent", () => {
        const err = runMainWithSandbox({ withWindow: false, constantsDefined: true });
        expect(String(err?.message || "")).toContain("Missing required module API: GTVMainModuleResolver.resolveModules");
    });

    it("throws explicit error when constants module is missing", () => {
        const err = runMainWithSandbox({ withWindow: true, constantsDefined: false });
        expect(String(err?.message || "")).toContain("Missing required module: GTVMainConstants");
    });
});
