(function initGtvMainRuntimeTimezoneHelperBindings(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function pickDeps(depNames = []) {
            const resolved = {};
            depNames.forEach((depName) => {
                resolved[depName] = safeDeps[depName];
            });
            return resolved;
        }

        const runtimeTimezoneHelpersModule = safeDeps.runtimeTimezoneHelpersModule;
        if (
            !runtimeTimezoneHelpersModule
            || typeof runtimeTimezoneHelpersModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainRuntimeTimezoneHelpers.createService");
        }

        const runtimeTimezoneHelpersService = runtimeTimezoneHelpersModule.createService({
            ...pickDeps([
                "getMainSharedUtilsService",
                "getTimeService",
                "getRuntimeCurrentLangValue",
                "getGlobalTimeState",
                "callServiceMethod",
                "getMainTimezoneFacadeService",
                "getTimeCore",
                "getConsoleWarn",
                "getNavigatorRef",
                "getGroupContextStateService"
            ])
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
