(function initGtvMainRuntimeTimezoneHelperBindings(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const runtimeTimezoneHelpersModule = safeDeps.runtimeTimezoneHelpersModule;
        if (
            !runtimeTimezoneHelpersModule
            || typeof runtimeTimezoneHelpersModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainRuntimeTimezoneHelpers.createService");
        }

        const runtimeTimezoneHelpersService = runtimeTimezoneHelpersModule.createService({
            getMainSharedUtilsService: safeDeps.getMainSharedUtilsService,
            getTimeService: safeDeps.getTimeService,
            getRuntimeCurrentLangValue: safeDeps.getRuntimeCurrentLangValue,
            getGlobalTimeState: safeDeps.getGlobalTimeState,
            callServiceMethod: safeDeps.callServiceMethod,
            getMainTimezoneFacadeService: safeDeps.getMainTimezoneFacadeService,
            getTimeCore: safeDeps.getTimeCore,
            getConsoleWarn: safeDeps.getConsoleWarn,
            getNavigatorRef: safeDeps.getNavigatorRef,
            getGroupContextStateService: safeDeps.getGroupContextStateService
        });

        if (!runtimeTimezoneHelpersService || typeof runtimeTimezoneHelpersService !== "object") {
            throw new Error("Invalid runtime timezone helpers service");
        }

        const {
            prepareExportCanvas,
            drawExportCellText,
            parseLocalDateTimeToUtcMs,
            getSignedDurationDayHourMinute,
            getZoneAbbreviation,
            getZoneDisplayNameForUiAtDate,
            getCustomOffsetMinutes,
            writeClipboardText,
            getLocalPartsByTimezone,
            getUTCDateFromLocalParts,
            isCurrentGroupUtcRowVisible,
            getCurrentGroupUtcRowOrder
        } = runtimeTimezoneHelpersService;

        return Object.freeze({
            prepareExportCanvas,
            drawExportCellText,
            parseLocalDateTimeToUtcMs,
            getSignedDurationDayHourMinute,
            getZoneAbbreviation,
            getZoneDisplayNameForUiAtDate,
            getCustomOffsetMinutes,
            writeClipboardText,
            getLocalPartsByTimezone,
            getUTCDateFromLocalParts,
            isCurrentGroupUtcRowVisible,
            getCurrentGroupUtcRowOrder
        });
    }

    globalObj.GTVMainRuntimeTimezoneHelperBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
