(function initGtvMainRuntimeStateCoreBootstrap(globalObj) {
    "use strict";

    function requireObject(value, label) {
        if (!value || typeof value !== "object") {
            throw new Error(`Missing required dependency: ${label}`);
        }
        return value;
    }

    function requireFunction(value, label) {
        if (typeof value !== "function") {
            throw new Error(`Missing required dependency: ${label}`);
        }
        return value;
    }

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function pickDeps(depNames = []) {
            const resolved = {};
            depNames.forEach((depName) => {
                resolved[depName] = safeDeps[depName];
            });
            return resolved;
        }


        function pickAliasedDeps(aliasMap = {}) {
            const resolved = {};
            Object.keys(aliasMap).forEach((targetKey) => {
                resolved[targetKey] = safeDeps[aliasMap[targetKey]];
            });
            return resolved;
        }

        const runtimeHostUtilsBindings = requireObject(
            safeDeps.runtimeHostUtilsBindings,
            "runtimeHostUtilsBindings"
        );
        const runtimePrimaryStateBindings = requireObject(
            safeDeps.runtimePrimaryStateBindings,
            "runtimePrimaryStateBindings"
        );
        const runtimePatchedStateFallbackBindings = requireObject(
            safeDeps.runtimePatchedStateFallbackBindings,
            "runtimePatchedStateFallbackBindings"
        );
        const runtimeLocalStateHelpersBindings = requireObject(
            safeDeps.runtimeLocalStateHelpersBindings,
            "runtimeLocalStateHelpersBindings"
        );

        const serviceInvokeUtils = globalObj?.GTVServiceInvokeUtils || globalThis.GTVServiceInvokeUtils;
        if (!serviceInvokeUtils || typeof serviceInvokeUtils.createRequiredModuleService !== "function") {
            throw new Error("Missing required module API: GTVServiceInvokeUtils.createRequiredModuleService");
        }
        // Host accessors forward to the host utils service (formerly main-runtime-host-accessor-proxies.js).
        const HOST_ACCESSOR_METHODS = Object.freeze(["applyVersionBranding","createCanvasSafely","getRandomUUIDSafely","getDocumentRefOrNull","getWindowRefOrNull","getLocationRefOrNull","getGlobalThisRefOrNull","getLuxonGlobalRef","getComputedStyleSafely","getRuntimeNowMs","setRuntimeInterval","clearRuntimeInterval","deferDynamicCall"]);
        // Accessor proxy services are created directly (formerly one *-bindings module each) and
        // exposed as frozen copies, as the bindings did.
        const ACCESSOR_SPECS = Object.freeze({
            PrimaryState: {
                moduleKey: "runtimePrimaryStateAccessorProxiesModule",
                moduleName: "GTVMainRuntimePrimaryStateAccessorProxies",
                invalidMessage: "Invalid main runtime primary state accessor proxies service",
                requiredMethods: ["setIsRealtimeState","getIsRealtimeState","getGlobalTimesState","getGlobalTimeState","setGlobalTimeState","getUiScaleState"]
            },
            StatePatch: {
                moduleKey: "runtimeStatePatchAccessorProxiesModule",
                moduleName: "GTVMainRuntimeStatePatchAccessorProxies",
                invalidMessage: "Invalid main runtime state patch accessor proxies service",
                requiredMethods: ["applyDirectStatePatch","buildPatchedStateFallbackSnapshot"]
            },
            LocalState: {
                moduleKey: "runtimeLocalStateAccessorProxiesModule",
                moduleName: "GTVMainRuntimeLocalStateAccessorProxies",
                invalidMessage: "Invalid main runtime local state accessor proxies service",
                requiredMethods: ["setMultiRangeState","getNextFixedTimeSeed","setUiPreferencesState","getBaseTimeSnapshot","getFixedTimeSlotCountForGroupRef","confirmRuntime","getActiveCopyFormatKeysForCurrentContext","getActiveTimePartKeysForCurrentContext","getCurrentUiScalePercent","getFixedTimeSlotCountForCurrentGroup","getCurrentGroupFixedTimeShowLiveNow","shouldRunRealtimeTick","getTimeAdjustDayStepValue"]
            }
        });
        function createAccessorService(kind, accessorDeps) {
            const spec = ACCESSOR_SPECS[kind];
            return Object.freeze({
                ...serviceInvokeUtils.createRequiredModuleService(
                    safeDeps[spec.moduleKey],
                    spec.moduleName,
                    accessorDeps,
                    spec.requiredMethods,
                    spec.invalidMessage
                )
            });
        }

        const createRuntimeHostUtilsService = requireFunction(
            runtimeHostUtilsBindings.createService,
            "runtimeHostUtilsBindings.createService"
        );
        const createRuntimePrimaryStateService = requireFunction(
            runtimePrimaryStateBindings.createService,
            "runtimePrimaryStateBindings.createService"
        );
        const createRuntimePatchedStateFallbackService = requireFunction(
            runtimePatchedStateFallbackBindings.createService,
            "runtimePatchedStateFallbackBindings.createService"
        );
        const createRuntimeLocalStateHelpersService = requireFunction(
            runtimeLocalStateHelpersBindings.createService,
            "runtimeLocalStateHelpersBindings.createService"
        );

        const {
            mainRuntimeHostUtilsService
        } = createRuntimeHostUtilsService({
            ...pickDeps([
                "runtimeHostUtilsModule",
                "appDisplayName",
                "version",
                "getGlobalRef",
            ]),
        });
        const hostAccessors = serviceInvokeUtils.createLateBoundForwarders(
            () => mainRuntimeHostUtilsService,
            "mainRuntimeHostUtilsService",
            HOST_ACCESSOR_METHODS
        );

        const {
            mainRuntimePrimaryStateService
        } = createRuntimePrimaryStateService({
            ...pickDeps([
                "runtimePrimaryStateModule",
                "getIsRealtime",
                "setIsRealtime",
                "syncRealtimeFlagToGlobal",
                "getGlobalTimes",
                "setGlobalTimes",
                "getUiScale",
            ]),
        });
        const primaryStateAccessors = createAccessorService("PrimaryState", {
            ...pickDeps([
            ]),
            getMainRuntimePrimaryStateService: () => mainRuntimePrimaryStateService,
            ...pickDeps([
                "getIsRealtime",
                "setIsRealtime",
                "syncRealtimeFlagToGlobal",
                "getGlobalTimes",
                "setGlobalTimes",
                "getUiScale",
            ]),
        });

        const {
            mainRuntimePatchedStateFallbackService
        } = createRuntimePatchedStateFallbackService({
            ...pickDeps([
                "runtimePatchedStateFallbackModule",
            ]),
            ...pickAliasedDeps({
                "getNormalizeDayNightRangeValues": "normalizeDayNightRangeValues"
            }),
            ...pickDeps([
                "getRuntimeCurrentLangValue",
                "getCurrentMainTab",
                "getSlotCount",
                "getShowCopyFormat",
                "getShowTimeline",
                "getCurrentTheme",
                "getDayStartHour",
                "getNightStartHour",
                "getDisplayFormatOrder",
                "getDisplayFormatEnabled",
                "getDisplayTimePartsEnabled",
                "getCopyFormatOrder",
                "getCopyFormatEnabled",
                "getCopyTimePartsEnabled",
                "getActiveFormatProfileContext",
                "getActiveGroupId",
                "getMultiRangeCount",
                "getMultiRanges",
                "getMultiRangeCollapsed",
                "getTimeAdjustDayStepBySlot",
                "getMultiRangeTitle",
            ]),
        });
        const mainRuntimeStatePatchAccessorService = createAccessorService("StatePatch", {
            ...pickDeps([
                "getMainDirectStatePatchService",
                "getDirectStateSetters",
                "getNormalizeDayNightRangeValues",
                "getDayStartHour",
                "setDayStartHour",
                "getNightStartHour",
                "setNightStartHour",
            ]),
            getSetIsRealtimeState: () => primaryStateAccessors.setIsRealtimeState,
            getMainRuntimePatchedStateFallbackService: () => mainRuntimePatchedStateFallbackService,
            ...pickDeps([
                "getRuntimeCurrentLangValue",
                "getCurrentMainTab",
                "getSlotCount",
                "getShowCopyFormat",
                "getShowTimeline",
                "getCurrentTheme",
                "getDisplayFormatOrder",
                "getDisplayFormatEnabled",
                "getDisplayTimePartsEnabled",
                "getCopyFormatOrder",
                "getCopyFormatEnabled",
                "getCopyTimePartsEnabled",
                "getActiveFormatProfileContext",
                "getActiveGroupId",
                "getMultiRangeCount",
                "getMultiRanges",
                "getMultiRangeCollapsed",
                "getTimeAdjustDayStepBySlot",
                "getMultiRangeTitle",
            ]),
        });

        const {
            mainRuntimeLocalStateHelpersService
        } = createRuntimeLocalStateHelpersService({
            ...pickDeps([
                "runtimeLocalStateHelpersModule",
                "getPatchAppState",
                "getFixedTimeIdSeed",
                "setFixedTimeIdSeed",
                "getUiScale",
                "setUiScale",
                "getCurrentTheme",
                "setCurrentTheme",
                "getDayStartHour",
                "setDayStartHour",
                "getNightStartHour",
                "setNightStartHour",
                "sanitizeDayNightHourValue",
                "normalizeDayNightRangeValues",
                "syncCurrentLang",
            ]),
            getGlobalTimeState: primaryStateAccessors.getGlobalTimeState,
            ...pickDeps([
                "getFixedTimeSlotCount",
                "getConfirm",
                "getFormatProfileAllowedKeys",
                "getFormatProfileAllowedTimePartKeys",
                "getPatchedActiveFormatProfileContextState",
            ]),
            getUiScaleState: primaryStateAccessors.getUiScaleState,
            ...pickDeps([
                "getCurrentGroup",
                "getFixedTimeStateService",
            ]),
            getIsRealtimeState: primaryStateAccessors.getIsRealtimeState,
            ...pickDeps([
                "isFixedTimeTab",
                "getTimeAdjustDayStepBySlotSnapshot",
            ]),
        });
        const localStateAccessors = createAccessorService("LocalState", {
            ...pickDeps([
            ]),
            getMainRuntimeLocalStateHelpersService: () => mainRuntimeLocalStateHelpersService,
            ...pickDeps([
                "getPatchAppState",
                "getFixedTimeIdSeed",
                "setFixedTimeIdSeed",
                "getUiScale",
                "setUiScale",
                "getCurrentTheme",
                "setCurrentTheme",
                "getDayStartHour",
                "setDayStartHour",
                "getNightStartHour",
                "setNightStartHour",
                "sanitizeDayNightHourValue",
                "normalizeDayNightRangeValues",
                "syncCurrentLang",
            ]),
            getGlobalTimeState: primaryStateAccessors.getGlobalTimeState,
            ...pickDeps([
                "getFixedTimeSlotCount",
                "getConfirm",
                "getFormatProfileAllowedKeys",
                "getFormatProfileAllowedTimePartKeys",
                "getPatchedActiveFormatProfileContextState",
            ]),
            getUiScaleState: primaryStateAccessors.getUiScaleState,
            ...pickDeps([
                "getCurrentGroup",
                "getFixedTimeStateService",
            ]),
            getIsRealtimeState: primaryStateAccessors.getIsRealtimeState,
            ...pickDeps([
                "isFixedTimeTab",
                "getTimeAdjustDayStepBySlotSnapshot",
            ]),
        });

        return Object.freeze({
            mainRuntimeHostUtilsService,
            ...hostAccessors,
            mainRuntimePrimaryStateService,
            ...primaryStateAccessors,
            mainRuntimePatchedStateFallbackService,
            mainRuntimeStatePatchAccessorService,
            buildPatchedStateFallbackSnapshot: () => (
                mainRuntimeStatePatchAccessorService.buildPatchedStateFallbackSnapshot()
            ),
            mainRuntimeLocalStateHelpersService,
            ...localStateAccessors
        });
    }

    globalObj.GTVMainRuntimeStateCoreBootstrap = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
