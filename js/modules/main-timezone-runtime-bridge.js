(function initGtvMainTimezoneRuntimeBridge(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const callServiceMethod = (typeof safeDeps.callServiceMethod === "function")
            ? safeDeps.callServiceMethod
            : (() => undefined);
        const getMainTimezoneRuntimeService = (typeof safeDeps.getMainTimezoneRuntimeService === "function")
            ? safeDeps.getMainTimezoneRuntimeService
            : (() => null);
        const getGlobalTimeState = (typeof safeDeps.getGlobalTimeState === "function")
            ? safeDeps.getGlobalTimeState
            : (() => new Date());
        const getCurrentLangState = (typeof safeDeps.getCurrentLangState === "function")
            ? safeDeps.getCurrentLangState
            : (() => "en");
        const maxRuntimeCacheSize = Number.isFinite(Number(safeDeps.maxRuntimeCacheSize))
            ? Math.max(1, Math.trunc(Number(safeDeps.maxRuntimeCacheSize)))
            : 4096;
        const SERVICE_METHOD_MISSING = Symbol("GTV_SERVICE_METHOD_MISSING");

        function callMainTimezoneRuntimeMethodOrFallback(methodName, args = [], fallbackFactory = null) {
            const runtimeService = getMainTimezoneRuntimeService();
            const result = callServiceMethod(
                "mainTimezoneRuntimeService",
                runtimeService,
                methodName,
                args,
                { fallback: SERVICE_METHOD_MISSING }
            );
            if (result !== SERVICE_METHOD_MISSING) return result;
            if (typeof fallbackFactory === "function") return fallbackFactory();
            return fallbackFactory;
        }

        function getUtcMinuteCacheKey(date) {
            return callMainTimezoneRuntimeMethodOrFallback(
                "getUtcMinuteCacheKey",
                [date],
                () => {
                    const parsed = new Date(date);
                    const safeDate = Number.isFinite(parsed.getTime()) ? parsed : new Date();
                    return [
                        safeDate.getUTCFullYear(),
                        safeDate.getUTCMonth(),
                        safeDate.getUTCDate(),
                        safeDate.getUTCHours(),
                        safeDate.getUTCMinutes()
                    ].join(":");
                }
            );
        }

        function setCappedRuntimeCache(cache, key, value) {
            return callMainTimezoneRuntimeMethodOrFallback(
                "setCappedRuntimeCache",
                [cache, key, value],
                () => {
                    const isMapLike = !!cache
                        && typeof cache === "object"
                        && typeof cache.set === "function"
                        && typeof cache.delete === "function"
                        && typeof cache.keys === "function"
                        && Number.isFinite(Number(cache.size));
                    if (!isMapLike) return;
                    if (cache.size >= maxRuntimeCacheSize) {
                        const oldestKey = cache.keys().next().value;
                        if (oldestKey !== undefined) cache.delete(oldestKey);
                    }
                    cache.set(key, value);
                }
            );
        }

        function getZoneAbbreviation(tz, date = getGlobalTimeState(0)) {
            return callMainTimezoneRuntimeMethodOrFallback("getZoneAbbreviation", [tz, date], "");
        }

        function getBetterAbbr(zone, date) {
            return callMainTimezoneRuntimeMethodOrFallback("getBetterAbbr", [zone, date], "");
        }

        function isTimeZoneInDST(zone, date) {
            return callMainTimezoneRuntimeMethodOrFallback("isTimeZoneInDST", [zone, date], false);
        }

        function getTimezoneOffset(zone, date) {
            return callMainTimezoneRuntimeMethodOrFallback("getTimezoneOffset", [zone, date], 0);
        }

        function getFixedOffsetForDisplayAtDate(tz, anchorDate) {
            return callMainTimezoneRuntimeMethodOrFallback(
                "getFixedOffsetForDisplayAtDate",
                [tz, anchorDate],
                () => {
                    if (!tz || tz.type !== "standard" || !tz.zone || tz.zone === "UTC") return null;
                    const raw = tz.fixedOffsetMinutes;
                    if (raw === null || raw === undefined || raw === "") return null;
                    const parsed = Number(raw);
                    if (!Number.isFinite(parsed)) return null;
                    return Math.min(14 * 60, Math.max(-14 * 60, Math.trunc(parsed)));
                }
            );
        }

        function getFixedOffsetForDisplay(tz) {
            return callMainTimezoneRuntimeMethodOrFallback(
                "getFixedOffsetForDisplay",
                [tz],
                () => getFixedOffsetForDisplayAtDate(tz, getGlobalTimeState(0))
            );
        }

        function getLocalizedTZLabel(tzData) {
            return callMainTimezoneRuntimeMethodOrFallback(
                "getLocalizedTZLabel",
                [tzData],
                () => {
                    if (!tzData || typeof tzData !== "object") return "";
                    if (getCurrentLangState() === "en") {
                        const name = tzData.name_en || tzData.name || tzData.name_ko || "";
                        const city = tzData.city_en || tzData.city || tzData.city_ko || "";
                        return city ? `${name} - ${city}` : name;
                    }
                    const name = tzData.name || tzData.name_ko || tzData.name_en || "";
                    const city = tzData.city || tzData.city_ko || tzData.city_en || "";
                    return city ? `${name} - ${city}` : name;
                }
            );
        }

        function getZoneDisplayName(tz) {
            return callMainTimezoneRuntimeMethodOrFallback("getZoneDisplayName", [tz], "");
        }

        function getZoneDisplayNameForUiAtDate(tz, anchorDate = getGlobalTimeState(0)) {
            return callMainTimezoneRuntimeMethodOrFallback(
                "getZoneDisplayNameForUiAtDate",
                [tz, anchorDate],
                () => getZoneDisplayName(tz)
            );
        }

        return Object.freeze({
            callMainTimezoneRuntimeMethodOrFallback,
            getUtcMinuteCacheKey,
            setCappedRuntimeCache,
            getZoneAbbreviation,
            getBetterAbbr,
            isTimeZoneInDST,
            getTimezoneOffset,
            getFixedOffsetForDisplayAtDate,
            getFixedOffsetForDisplay,
            getLocalizedTZLabel,
            getZoneDisplayName,
            getZoneDisplayNameForUiAtDate
        });
    }

    globalObj.GTVMainTimezoneRuntimeBridge = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
