(function initGtvMainDayNightRangeUtils(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const defaultDayStartHour = Number.isFinite(Number(safeDeps.defaultDayStartHour))
            ? Number(safeDeps.defaultDayStartHour)
            : 6;
        const defaultNightStartHour = Number.isFinite(Number(safeDeps.defaultNightStartHour))
            ? Number(safeDeps.defaultNightStartHour)
            : 18;
        const dayNightHourOptions = Array.isArray(safeDeps.dayNightHourOptions)
            ? safeDeps.dayNightHourOptions
            : Array.from({ length: 24 }, (_, hour) => hour);

        function sanitizeDayNightHourValue(value, fallbackHour = defaultDayStartHour) {
            const parsed = Number.parseInt(value, 10);
            const fallbackParsed = Number.parseInt(fallbackHour, 10);
            const base = Number.isFinite(parsed)
                ? parsed
                : (Number.isFinite(fallbackParsed) ? fallbackParsed : 0);
            const clamped = Math.min(23, Math.max(0, base));
            const options = Array.isArray(dayNightHourOptions) && dayNightHourOptions.length
                ? dayNightHourOptions
                : Array.from({ length: 24 }, (_, hour) => hour);
            return options.reduce((closest, hourRaw) => {
                const hour = Number.parseInt(hourRaw, 10);
                if (!Number.isFinite(hour)) return closest;
                return Math.abs(hour - clamped) < Math.abs(closest - clamped) ? hour : closest;
            }, Number.parseInt(options[0], 10) || 0);
        }

        function normalizeDayNightRangeValues(dayStartHourInput, nightStartHourInput) {
            const dayStartHour = sanitizeDayNightHourValue(dayStartHourInput, defaultDayStartHour);
            const nightStartHour = sanitizeDayNightHourValue(nightStartHourInput, defaultNightStartHour);
            if (nightStartHour <= dayStartHour) {
                return {
                    dayStartHour: sanitizeDayNightHourValue(defaultDayStartHour, 6),
                    nightStartHour: sanitizeDayNightHourValue(defaultNightStartHour, 18)
                };
            }
            return { dayStartHour, nightStartHour };
        }

        return Object.freeze({
            sanitizeDayNightHourValue,
            normalizeDayNightRangeValues
        });
    }

    globalObj.GTVMainDayNightRangeUtils = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
