(function initGtvMainRuntimeTimezoneHelpers(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const getMainSharedUtilsService = (typeof safeDeps.getMainSharedUtilsService === "function")
            ? safeDeps.getMainSharedUtilsService
            : (() => null);
        const getTimeService = (typeof safeDeps.getTimeService === "function")
            ? safeDeps.getTimeService
            : (() => null);
        const getRuntimeCurrentLangValue = (typeof safeDeps.getRuntimeCurrentLangValue === "function")
            ? safeDeps.getRuntimeCurrentLangValue
            : (() => "ko");
        const getGlobalTimeState = (typeof safeDeps.getGlobalTimeState === "function")
            ? safeDeps.getGlobalTimeState
            : (() => new Date());
        const callServiceMethod = (typeof safeDeps.callServiceMethod === "function")
            ? safeDeps.callServiceMethod
            : (() => undefined);
        const getMainTimezoneFacadeService = (typeof safeDeps.getMainTimezoneFacadeService === "function")
            ? safeDeps.getMainTimezoneFacadeService
            : (() => null);
        const getTimeCore = (typeof safeDeps.getTimeCore === "function")
            ? safeDeps.getTimeCore
            : (() => null);
        const getConsoleWarn = (typeof safeDeps.getConsoleWarn === "function")
            ? safeDeps.getConsoleWarn
            : (() => {
                if (typeof console === "object" && console && typeof console.warn === "function") {
                    return console.warn.bind(console);
                }
                return () => { };
            });
        const getNavigatorRef = (typeof safeDeps.getNavigatorRef === "function")
            ? safeDeps.getNavigatorRef
            : (() => ((typeof navigator === "object" && navigator) ? navigator : null));
        const getGroupContextStateService = (typeof safeDeps.getGroupContextStateService === "function")
            ? safeDeps.getGroupContextStateService
            : (() => null);

        function prepareExportCanvas(sourceWidth, sourceHeight, pageBg) {
            const mainSharedUtilsService = getMainSharedUtilsService();
            if (!mainSharedUtilsService || typeof mainSharedUtilsService.prepareExportCanvas !== "function") {
                throw new Error("Main shared utils service is unavailable: prepareExportCanvas");
            }
            return mainSharedUtilsService.prepareExportCanvas(sourceWidth, sourceHeight, pageBg);
        }

        function drawExportCellText(ctx, text, x, y, w, h, options = {}) {
            const mainSharedUtilsService = getMainSharedUtilsService();
            if (!mainSharedUtilsService || typeof mainSharedUtilsService.drawExportCellText !== "function") {
                throw new Error("Main shared utils service is unavailable: drawExportCellText");
            }
            return mainSharedUtilsService.drawExportCellText(ctx, text, x, y, w, h, options);
        }

        function parseLocalDateTimeToUtcMs(value) {
            const mainSharedUtilsService = getMainSharedUtilsService();
            if (!mainSharedUtilsService || typeof mainSharedUtilsService.parseLocalDateTimeToUtcMs !== "function") {
                return NaN;
            }
            return mainSharedUtilsService.parseLocalDateTimeToUtcMs(value);
        }

        function getSignedDurationDayHourMinute(a, b) {
            const timeService = getTimeService();
            return timeService.formatDuration(
                parseLocalDateTimeToUtcMs(a),
                parseLocalDateTimeToUtcMs(b),
                getRuntimeCurrentLangValue()
            );
        }

        function getZoneAbbreviation(tz, date = getGlobalTimeState(0)) {
            return callServiceMethod(
                "mainTimezoneFacadeService",
                getMainTimezoneFacadeService(),
                "getZoneAbbreviation",
                [tz, date],
                { fallback: "" }
            );
        }

        function getZoneDisplayNameForUiAtDate(tz, anchorDate = getGlobalTimeState(0)) {
            return callServiceMethod(
                "mainTimezoneFacadeService",
                getMainTimezoneFacadeService(),
                "getZoneDisplayNameForUiAtDate",
                [tz, anchorDate],
                { fallback: "" }
            );
        }

        function getCustomOffsetMinutes(tz) {
            const timeCore = getTimeCore();
            const safeTimezone = (tz && typeof tz === "object") ? tz : {};
            return timeCore.getCustomOffsetMinutes(safeTimezone);
        }

        async function writeClipboardText(text) {
            const navigatorRef = getNavigatorRef();
            const clipboard = (navigatorRef && navigatorRef.clipboard)
                ? navigatorRef.clipboard
                : null;
            if (!clipboard || typeof clipboard.writeText !== "function") {
                throw new Error("Clipboard API is unavailable.");
            }
            try {
                await clipboard.writeText(text);
            } catch (err) {
                getConsoleWarn()("Clipboard write failed.", err);
                throw err;
            }
        }

        function getLocalPartsByTimezone(date, tz, fixedOffsetMinutes = null) {
            const timeService = getTimeService();
            const safeTimezone = (tz && typeof tz === "object") ? tz : {};
            const zone = safeTimezone.type === "custom" ? "CUSTOM" : (safeTimezone.zone || "UTC");
            const offset = safeTimezone.type === "custom"
                ? getCustomOffsetMinutes(safeTimezone)
                : fixedOffsetMinutes;
            const p = timeService.resolveLocalDateParts(date, zone, safeTimezone.id, offset);
            return { year: p.Y, month: p.M, day: p.D, hour: p.H, minute: p.min, second: p.S };
        }

        function getUTCDateFromLocalParts(parts, tz, fixedOffsetMinutes = null) {
            const timeService = getTimeService();
            const safeTimezone = (tz && typeof tz === "object") ? tz : {};
            const zone = safeTimezone.type === "custom" ? "CUSTOM" : (safeTimezone.zone || "UTC");
            const offset = safeTimezone.type === "custom"
                ? getCustomOffsetMinutes(safeTimezone)
                : fixedOffsetMinutes;
            return timeService.fromLocalPartsToUtc(parts, zone, offset);
        }

        function isCurrentGroupUtcRowVisible() {
            return getGroupContextStateService().isCurrentGroupUtcRowVisible();
        }

        function getCurrentGroupUtcRowOrder() {
            return getGroupContextStateService().getCurrentGroupUtcRowOrder();
        }

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

    globalObj.GTVMainRuntimeTimezoneHelpers = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
