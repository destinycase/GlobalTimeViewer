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
            runtimeHostUtilsModule: safeDeps.runtimeHostUtilsModule,
            appDisplayName: safeDeps.appDisplayName,
            version: safeDeps.version,
            getGlobalRef: safeDeps.getGlobalRef
        });
        const hostAccessors = createRuntimeHostAccessorService({
            runtimeHostAccessorProxiesModule: safeDeps.runtimeHostAccessorProxiesModule,
            getMainRuntimeHostUtilsService: () => mainRuntimeHostUtilsService
        });

        const {
            mainRuntimePrimaryStateService
        } = createRuntimePrimaryStateService({
            runtimePrimaryStateModule: safeDeps.runtimePrimaryStateModule,
            getIsRealtime: safeDeps.getIsRealtime,
            setIsRealtime: safeDeps.setIsRealtime,
            syncRealtimeFlagToGlobal: safeDeps.syncRealtimeFlagToGlobal,
            getGlobalTimes: safeDeps.getGlobalTimes,
            setGlobalTimes: safeDeps.setGlobalTimes,
            getUiScale: safeDeps.getUiScale
        });
        const primaryStateAccessors = createRuntimePrimaryStateAccessorService({
            runtimePrimaryStateAccessorProxiesModule: safeDeps.runtimePrimaryStateAccessorProxiesModule,
            getMainRuntimePrimaryStateService: () => mainRuntimePrimaryStateService,
            getIsRealtime: safeDeps.getIsRealtime,
            setIsRealtime: safeDeps.setIsRealtime,
            syncRealtimeFlagToGlobal: safeDeps.syncRealtimeFlagToGlobal,
            getGlobalTimes: safeDeps.getGlobalTimes,
            setGlobalTimes: safeDeps.setGlobalTimes,
            getUiScale: safeDeps.getUiScale
        });

        const {
            mainRuntimePatchedStateFallbackService
        } = createRuntimePatchedStateFallbackService({
            runtimePatchedStateFallbackModule: safeDeps.runtimePatchedStateFallbackModule,
            getNormalizeDayNightRangeValues: safeDeps.normalizeDayNightRangeValues,
            getRuntimeCurrentLangValue: safeDeps.getRuntimeCurrentLangValue,
            getCurrentMainTab: safeDeps.getCurrentMainTab,
            getSlotCount: safeDeps.getSlotCount,
            getShowCopyFormat: safeDeps.getShowCopyFormat,
            getShowTimeline: safeDeps.getShowTimeline,
            getCurrentTheme: safeDeps.getCurrentTheme,
            getDayStartHour: safeDeps.getDayStartHour,
            getNightStartHour: safeDeps.getNightStartHour,
            getDisplayFormatOrder: safeDeps.getDisplayFormatOrder,
            getDisplayFormatEnabled: safeDeps.getDisplayFormatEnabled,
            getDisplayTimePartsEnabled: safeDeps.getDisplayTimePartsEnabled,
            getCopyFormatOrder: safeDeps.getCopyFormatOrder,
            getCopyFormatEnabled: safeDeps.getCopyFormatEnabled,
            getCopyTimePartsEnabled: safeDeps.getCopyTimePartsEnabled,
            getActiveFormatProfileContext: safeDeps.getActiveFormatProfileContext,
            getActiveGroupId: safeDeps.getActiveGroupId,
            getMultiRangeCount: safeDeps.getMultiRangeCount,
            getMultiRanges: safeDeps.getMultiRanges,
            getMultiRangeCollapsed: safeDeps.getMultiRangeCollapsed,
            getTimeAdjustDayStepBySlot: safeDeps.getTimeAdjustDayStepBySlot,
            getMultiRangeTitle: safeDeps.getMultiRangeTitle
        });
        const mainRuntimeStatePatchAccessorService = createRuntimeStatePatchAccessorService({
            runtimeStatePatchAccessorProxiesModule: safeDeps.runtimeStatePatchAccessorProxiesModule,
            getMainDirectStatePatchService: safeDeps.getMainDirectStatePatchService,
            getDirectStateSetters: safeDeps.getDirectStateSetters,
            getNormalizeDayNightRangeValues: safeDeps.getNormalizeDayNightRangeValues,
            getDayStartHour: safeDeps.getDayStartHour,
            setDayStartHour: safeDeps.setDayStartHour,
            getNightStartHour: safeDeps.getNightStartHour,
            setNightStartHour: safeDeps.setNightStartHour,
            getSetIsRealtimeState: () => primaryStateAccessors.setIsRealtimeState,
            getMainRuntimePatchedStateFallbackService: () => mainRuntimePatchedStateFallbackService,
            getRuntimeCurrentLangValue: safeDeps.getRuntimeCurrentLangValue,
            getCurrentMainTab: safeDeps.getCurrentMainTab,
            getSlotCount: safeDeps.getSlotCount,
            getShowCopyFormat: safeDeps.getShowCopyFormat,
            getShowTimeline: safeDeps.getShowTimeline,
            getCurrentTheme: safeDeps.getCurrentTheme,
            getDisplayFormatOrder: safeDeps.getDisplayFormatOrder,
            getDisplayFormatEnabled: safeDeps.getDisplayFormatEnabled,
            getDisplayTimePartsEnabled: safeDeps.getDisplayTimePartsEnabled,
            getCopyFormatOrder: safeDeps.getCopyFormatOrder,
            getCopyFormatEnabled: safeDeps.getCopyFormatEnabled,
            getCopyTimePartsEnabled: safeDeps.getCopyTimePartsEnabled,
            getActiveFormatProfileContext: safeDeps.getActiveFormatProfileContext,
            getActiveGroupId: safeDeps.getActiveGroupId,
            getMultiRangeCount: safeDeps.getMultiRangeCount,
            getMultiRanges: safeDeps.getMultiRanges,
            getMultiRangeCollapsed: safeDeps.getMultiRangeCollapsed,
            getTimeAdjustDayStepBySlot: safeDeps.getTimeAdjustDayStepBySlot,
            getMultiRangeTitle: safeDeps.getMultiRangeTitle
        });

        const {
            mainRuntimeLocalStateHelpersService
        } = createRuntimeLocalStateHelpersService({
            runtimeLocalStateHelpersModule: safeDeps.runtimeLocalStateHelpersModule,
            getPatchAppState: safeDeps.getPatchAppState,
            getFixedTimeIdSeed: safeDeps.getFixedTimeIdSeed,
            setFixedTimeIdSeed: safeDeps.setFixedTimeIdSeed,
            getUiScale: safeDeps.getUiScale,
            setUiScale: safeDeps.setUiScale,
            getCurrentTheme: safeDeps.getCurrentTheme,
            setCurrentTheme: safeDeps.setCurrentTheme,
            getDayStartHour: safeDeps.getDayStartHour,
            setDayStartHour: safeDeps.setDayStartHour,
            getNightStartHour: safeDeps.getNightStartHour,
            setNightStartHour: safeDeps.setNightStartHour,
            sanitizeDayNightHourValue: safeDeps.sanitizeDayNightHourValue,
            normalizeDayNightRangeValues: safeDeps.normalizeDayNightRangeValues,
            syncCurrentLang: safeDeps.syncCurrentLang,
            getGlobalTimeState: primaryStateAccessors.getGlobalTimeState,
            getFixedTimeSlotCount: safeDeps.getFixedTimeSlotCount,
            getConfirm: safeDeps.getConfirm,
            getFormatProfileAllowedKeys: safeDeps.getFormatProfileAllowedKeys,
            getFormatProfileAllowedTimePartKeys: safeDeps.getFormatProfileAllowedTimePartKeys,
            getPatchedActiveFormatProfileContextState: safeDeps.getPatchedActiveFormatProfileContextState,
            getUiScaleState: primaryStateAccessors.getUiScaleState,
            getCurrentGroup: safeDeps.getCurrentGroup,
            getFixedTimeStateService: safeDeps.getFixedTimeStateService,
            getIsRealtimeState: primaryStateAccessors.getIsRealtimeState,
            isFixedTimeTab: safeDeps.isFixedTimeTab,
            getTimeAdjustDayStepBySlotSnapshot: safeDeps.getTimeAdjustDayStepBySlotSnapshot
        });
        const localStateAccessors = createRuntimeLocalStateAccessorService({
            runtimeLocalStateAccessorProxiesModule: safeDeps.runtimeLocalStateAccessorProxiesModule,
            getMainRuntimeLocalStateHelpersService: () => mainRuntimeLocalStateHelpersService,
            getPatchAppState: safeDeps.getPatchAppState,
            getFixedTimeIdSeed: safeDeps.getFixedTimeIdSeed,
            setFixedTimeIdSeed: safeDeps.setFixedTimeIdSeed,
            getUiScale: safeDeps.getUiScale,
            setUiScale: safeDeps.setUiScale,
            getCurrentTheme: safeDeps.getCurrentTheme,
            setCurrentTheme: safeDeps.setCurrentTheme,
            getDayStartHour: safeDeps.getDayStartHour,
            setDayStartHour: safeDeps.setDayStartHour,
            getNightStartHour: safeDeps.getNightStartHour,
            setNightStartHour: safeDeps.setNightStartHour,
            sanitizeDayNightHourValue: safeDeps.sanitizeDayNightHourValue,
            normalizeDayNightRangeValues: safeDeps.normalizeDayNightRangeValues,
            syncCurrentLang: safeDeps.syncCurrentLang,
            getGlobalTimeState: primaryStateAccessors.getGlobalTimeState,
            getFixedTimeSlotCount: safeDeps.getFixedTimeSlotCount,
            getConfirm: safeDeps.getConfirm,
            getFormatProfileAllowedKeys: safeDeps.getFormatProfileAllowedKeys,
            getFormatProfileAllowedTimePartKeys: safeDeps.getFormatProfileAllowedTimePartKeys,
            getPatchedActiveFormatProfileContextState: safeDeps.getPatchedActiveFormatProfileContextState,
            getUiScaleState: primaryStateAccessors.getUiScaleState,
            getCurrentGroup: safeDeps.getCurrentGroup,
            getFixedTimeStateService: safeDeps.getFixedTimeStateService,
            getIsRealtimeState: primaryStateAccessors.getIsRealtimeState,
            isFixedTimeTab: safeDeps.isFixedTimeTab,
            getTimeAdjustDayStepBySlotSnapshot: safeDeps.getTimeAdjustDayStepBySlotSnapshot
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
