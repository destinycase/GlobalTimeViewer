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
        // Primary state and local state accessors are the services' own methods. The former
        // *-accessor-proxies modules repeated the same logic as a fallback for a missing service,
        // which cannot happen because both services are created and checked here.
        const PRIMARY_STATE_ACCESSOR_METHODS = Object.freeze(["setIsRealtimeState","getIsRealtimeState","getGlobalTimesState","getGlobalTimeState","setGlobalTimeState","getUiScaleState"]);
        const LOCAL_STATE_ACCESSOR_METHODS = Object.freeze(["setMultiRangeState","getNextFixedTimeSeed","setUiPreferencesState","getBaseTimeSnapshot","getFixedTimeSlotCountForGroupRef","confirmRuntime","getActiveCopyFormatKeysForCurrentContext","getActiveTimePartKeysForCurrentContext","getCurrentUiScalePercent","getFixedTimeSlotCountForCurrentGroup","getCurrentGroupFixedTimeShowLiveNow","shouldRunRealtimeTick","getTimeAdjustDayStepValue"]);
        function pickRequiredMethods(service, serviceLabel, methodNames) {
            return Object.freeze(Object.fromEntries(methodNames.map((methodName) => [
                methodName,
                requireFunction(service?.[methodName], `${serviceLabel}.${methodName}`)
            ])));
        }
        // Host accessors forward to the host utils service (formerly main-runtime-host-accessor-proxies.js).
        const HOST_ACCESSOR_METHODS = Object.freeze(["applyVersionBranding","createCanvasSafely","getRandomUUIDSafely","getDocumentRefOrNull","getWindowRefOrNull","getLocationRefOrNull","getGlobalThisRefOrNull","getLuxonGlobalRef","getComputedStyleSafely","getRuntimeNowMs","setRuntimeInterval","clearRuntimeInterval","deferDynamicCall"]);

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
        const primaryStateAccessors = pickRequiredMethods(
            mainRuntimePrimaryStateService,
            "mainRuntimePrimaryStateService",
            PRIMARY_STATE_ACCESSOR_METHODS
        );

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
        // State patch accessors (formerly main-runtime-state-patch-accessor-proxies.js). The direct
        // state patch service is created later in main.js, so it is looked up per call. The old
        // proxy's fallbacks only ran when a service was missing, which normal assembly never does.
        const mainRuntimeStatePatchAccessorService = Object.freeze({
            ...serviceInvokeUtils.createLateBoundForwarders(
                safeDeps.getMainDirectStatePatchService,
                "mainDirectStatePatchService",
                ["applyDirectStatePatch"]
            ),
            buildPatchedStateFallbackSnapshot: requireFunction(
                mainRuntimePatchedStateFallbackService?.buildPatchedStateFallbackSnapshot,
                "mainRuntimePatchedStateFallbackService.buildPatchedStateFallbackSnapshot"
            )
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
        const localStateAccessors = pickRequiredMethods(
            mainRuntimeLocalStateHelpersService,
            "mainRuntimeLocalStateHelpersService",
            LOCAL_STATE_ACCESSOR_METHODS
        );

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
