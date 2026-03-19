(function initGtvMainTimezoneFacade(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const callServiceMethod = (typeof safeDeps.callServiceMethod === "function")
            ? safeDeps.callServiceMethod
            : (() => undefined);
        const getMainTimezoneRuntimeBridgeService = (typeof safeDeps.getMainTimezoneRuntimeBridgeService === "function")
            ? safeDeps.getMainTimezoneRuntimeBridgeService
            : (() => null);
        const getMainBaseTimezoneService = (typeof safeDeps.getMainBaseTimezoneService === "function")
            ? safeDeps.getMainBaseTimezoneService
            : (() => null);
        const getMainTimezoneMutationService = (typeof safeDeps.getMainTimezoneMutationService === "function")
            ? safeDeps.getMainTimezoneMutationService
            : (() => null);
        const getTimezoneSearchService = (typeof safeDeps.getTimezoneSearchService === "function")
            ? safeDeps.getTimezoneSearchService
            : (() => null);
        const getTimeCore = (typeof safeDeps.getTimeCore === "function")
            ? safeDeps.getTimeCore
            : (() => ({}));
        const now = (typeof safeDeps.now === "function") ? safeDeps.now : (() => Date.now());
        const randomInt = (typeof safeDeps.randomInt === "function")
            ? safeDeps.randomInt
            : (() => Math.floor(Math.random() * 1000000000));
        let timezoneIdSeed = Number.isSafeInteger(Number(safeDeps.initialTimezoneIdSeed))
            ? Math.trunc(Number(safeDeps.initialTimezoneIdSeed))
            : 0;

        function callRuntimeBridgeMethod(methodName, args = [], fallbackValue = undefined) {
            return callServiceMethod(
                "mainTimezoneRuntimeBridgeService",
                getMainTimezoneRuntimeBridgeService(),
                methodName,
                args,
                { fallback: fallbackValue }
            );
        }

        function getUtcMinuteCacheKey(date) {
            return callRuntimeBridgeMethod("getUtcMinuteCacheKey", [date], "");
        }

        function setCappedRuntimeCache(cache, key, value) {
            return callRuntimeBridgeMethod("setCappedRuntimeCache", [cache, key, value], undefined);
        }

        function getZoneAbbreviation(tz, date) {
            return callRuntimeBridgeMethod("getZoneAbbreviation", [tz, date], "");
        }

        function getBetterAbbr(zone, date) {
            return callRuntimeBridgeMethod("getBetterAbbr", [zone, date], "");
        }

        function isTimeZoneInDST(zone, date) {
            return callRuntimeBridgeMethod("isTimeZoneInDST", [zone, date], false);
        }

        function getTimezoneOffset(zone, date) {
            return callRuntimeBridgeMethod("getTimezoneOffset", [zone, date], 0);
        }

        function getFixedOffsetForDisplayAtDate(tz, anchorDate) {
            return callRuntimeBridgeMethod("getFixedOffsetForDisplayAtDate", [tz, anchorDate], null);
        }

        function getFixedOffsetForDisplay(tz) {
            return callRuntimeBridgeMethod("getFixedOffsetForDisplay", [tz], null);
        }

        function getLocalizedTZLabel(tzData) {
            return callRuntimeBridgeMethod("getLocalizedTZLabel", [tzData], "");
        }

        function getZoneDisplayName(tz) {
            return callRuntimeBridgeMethod("getZoneDisplayName", [tz], "");
        }

        function getZoneDisplayNameForUiAtDate(tz, anchorDate) {
            return callRuntimeBridgeMethod("getZoneDisplayNameForUiAtDate", [tz, anchorDate], "");
        }

        function sanitizeTimezoneId(value) {
            if (value == null) return "";
            const timeCore = getTimeCore();
            if (!timeCore || typeof timeCore.sanitizeTimezoneId !== "function") return String(value || "");
            return timeCore.sanitizeTimezoneId(value);
        }

        function sanitizeBaseTimezoneId(value) {
            if (value == null) return "utc";
            const timeCore = getTimeCore();
            if (!timeCore || typeof timeCore.sanitizeBaseTimezoneId !== "function") return "utc";
            return timeCore.sanitizeBaseTimezoneId(value);
        }

        function setCurrentGroupBaseTimezoneId(value) {
            return callServiceMethod(
                "mainBaseTimezoneService",
                getMainBaseTimezoneService(),
                "setCurrentGroupBaseTimezoneId",
                [value],
                { fallback: false, toastOnMissing: true, featureKey: "base-timezone-set" }
            );
        }

        function applyCurrentGroupBaseTimezoneId(nextBaseId, options = {}) {
            return callServiceMethod(
                "mainBaseTimezoneService",
                getMainBaseTimezoneService(),
                "applyCurrentGroupBaseTimezoneId",
                [nextBaseId, options],
                { toastOnMissing: true, featureKey: "base-timezone-apply" }
            );
        }

        function getUsedTimezoneIds() {
            return callServiceMethod(
                "mainTimezoneMutationService",
                getMainTimezoneMutationService(),
                "getUsedTimezoneIds",
                [],
                { fallback: new Set(["utc"]) }
            );
        }

        function createUniqueTimezoneId(prefix = "tz") {
            return callServiceMethod(
                "mainTimezoneMutationService",
                getMainTimezoneMutationService(),
                "createUniqueTimezoneId",
                [prefix],
                { fallback: `${prefix || "tz"}-${now()}-${randomInt()}` }
            );
        }

        function getNextTimezoneIdSeed() {
            timezoneIdSeed += 1;
            if (!Number.isSafeInteger(timezoneIdSeed) || timezoneIdSeed < 1) {
                timezoneIdSeed = 1;
            }
            return timezoneIdSeed;
        }

        function createStandardTimezoneFromSelectableEntry(entry) {
            if (!entry || typeof entry !== "object") return null;
            const timezoneSearchService = getTimezoneSearchService();
            if (!timezoneSearchService || typeof timezoneSearchService.createStandardTimezoneFromSelectableEntry !== "function") {
                return null;
            }
            return timezoneSearchService.createStandardTimezoneFromSelectableEntry(entry);
        }

        function addTimezone(tz) {
            return callServiceMethod(
                "mainTimezoneMutationService",
                getMainTimezoneMutationService(),
                "addTimezone",
                [tz],
                { fallback: false, toastOnMissing: true, featureKey: "timezone-add" }
            );
        }

        function removeTimezone(id) {
            return callServiceMethod(
                "mainTimezoneMutationService",
                getMainTimezoneMutationService(),
                "removeTimezone",
                [id],
                { toastOnMissing: true, featureKey: "timezone-remove" }
            );
        }

        return Object.freeze({
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
            getZoneDisplayNameForUiAtDate,
            sanitizeTimezoneId,
            sanitizeBaseTimezoneId,
            setCurrentGroupBaseTimezoneId,
            applyCurrentGroupBaseTimezoneId,
            getUsedTimezoneIds,
            createUniqueTimezoneId,
            getNextTimezoneIdSeed,
            createStandardTimezoneFromSelectableEntry,
            addTimezone,
            removeTimezone
        });
    }

    globalObj.GTVMainTimezoneFacade = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
