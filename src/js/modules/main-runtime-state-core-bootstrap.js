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
        const runtimeHostAccessorBindings = requireObject(
            safeDeps.runtimeHostAccessorBindings,
            "runtimeHostAccessorBindings"
        );
        const runtimePrimaryStateBindings = requireObject(
            safeDeps.runtimePrimaryStateBindings,
            "runtimePrimaryStateBindings"
        );
        const runtimePrimaryStateAccessorBindings = requireObject(
            safeDeps.runtimePrimaryStateAccessorBindings,
            "runtimePrimaryStateAccessorBindings"
        );
        const runtimePatchedStateFallbackBindings = requireObject(
            safeDeps.runtimePatchedStateFallbackBindings,
            "runtimePatchedStateFallbackBindings"
        );
        const runtimeStatePatchAccessorBindings = requireObject(
            safeDeps.runtimeStatePatchAccessorBindings,
            "runtimeStatePatchAccessorBindings"
        );
        const runtimeLocalStateHelpersBindings = requireObject(
            safeDeps.runtimeLocalStateHelpersBindings,
            "runtimeLocalStateHelpersBindings"
        );
        const runtimeLocalStateAccessorBindings = requireObject(
            safeDeps.runtimeLocalStateAccessorBindings,
            "runtimeLocalStateAccessorBindings"
        );

        const createRuntimeHostUtilsService = requireFunction(
            runtimeHostUtilsBindings.createService,
            "runtimeHostUtilsBindings.createService"
        );
        const createRuntimeHostAccessorService = requireFunction(
            runtimeHostAccessorBindings.createService,
            "runtimeHostAccessorBindings.createService"
        );
        const createRuntimePrimaryStateService = requireFunction(
            runtimePrimaryStateBindings.createService,
            "runtimePrimaryStateBindings.createService"
        );
        const createRuntimePrimaryStateAccessorService = requireFunction(
            runtimePrimaryStateAccessorBindings.createService,
            "runtimePrimaryStateAccessorBindings.createService"
        );
        const createRuntimePatchedStateFallbackService = requireFunction(
            runtimePatchedStateFallbackBindings.createService,
            "runtimePatchedStateFallbackBindings.createService"
        );
        const createRuntimeStatePatchAccessorService = requireFunction(
            runtimeStatePatchAccessorBindings.createService,
            "runtimeStatePatchAccessorBindings.createService"
        );
        const createRuntimeLocalStateHelpersService = requireFunction(
            runtimeLocalStateHelpersBindings.createService,
            "runtimeLocalStateHelpersBindings.createService"
        );
        const createRuntimeLocalStateAccessorService = requireFunction(
            runtimeLocalStateAccessorBindings.createService,
            "runtimeLocalStateAccessorBindings.createService"
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
        const hostAccessors = createRuntimeHostAccessorService({
            ...pickDeps([
                "runtimeHostAccessorProxiesModule",
            ]),
            getMainRuntimeHostUtilsService: () => mainRuntimeHostUtilsService
        });

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
        const primaryStateAccessors = createRuntimePrimaryStateAccessorService({
            ...pickDeps([
                "runtimePrimaryStateAccessorProxiesModule",
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
        const mainRuntimeStatePatchAccessorService = createRuntimeStatePatchAccessorService({
            ...pickDeps([
                "runtimeStatePatchAccessorProxiesModule",
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
        const localStateAccessors = createRuntimeLocalStateAccessorService({
            ...pickDeps([
                "runtimeLocalStateAccessorProxiesModule",
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
