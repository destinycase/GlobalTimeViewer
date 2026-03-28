(function initGtvMainRuntimeCoreAccessorProxies(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const getMainRuntimeLangStateService = (typeof safeDeps.getMainRuntimeLangStateService === "function")
            ? safeDeps.getMainRuntimeLangStateService
            : (() => null);
        const getMainDayNightRangeUtilsService = (typeof safeDeps.getMainDayNightRangeUtilsService === "function")
            ? safeDeps.getMainDayNightRangeUtilsService
            : (() => null);
        const getMainBootstrapGuardService = (typeof safeDeps.getMainBootstrapGuardService === "function")
            ? safeDeps.getMainBootstrapGuardService
            : (() => null);
        const getGlobalRef = (typeof safeDeps.getGlobalRef === "function")
            ? safeDeps.getGlobalRef
            : (() => ((typeof window !== "undefined" && window) ? window : globalThis));
        const defaultLang = String(safeDeps.defaultLang || "ko");
        const defaultDayStartHour = Number.isFinite(Number(safeDeps.defaultDayStartHour))
            ? Number(safeDeps.defaultDayStartHour)
            : 6;
        const defaultNightStartHour = Number.isFinite(Number(safeDeps.defaultNightStartHour))
            ? Number(safeDeps.defaultNightStartHour)
            : 18;

        function syncRealtimeFlagToGlobal(value) {
            const service = getMainRuntimeLangStateService();
            if (service && typeof service.syncRealtimeFlagToGlobal === "function") {
                return service.syncRealtimeFlagToGlobal(value);
            }
            const globalRef = getGlobalRef();
            try {
                globalRef.isRealtime = !!value;
            } catch {
                // no-op for readonly global in tests/sandbox
            }
            return !!value;
        }

        function getRuntimeCurrentLangValue() {
            const service = getMainRuntimeLangStateService();
            if (service && typeof service.getRuntimeCurrentLangValue === "function") {
                return service.getRuntimeCurrentLangValue();
            }
            const currentLang = String(getGlobalRef().currentLang || "").trim();
            return currentLang || defaultLang;
        }

        function syncCurrentLang(next) {
            const service = getMainRuntimeLangStateService();
            if (service && typeof service.syncCurrentLang === "function") {
                return service.syncCurrentLang(next);
            }
            const normalized = String(next ?? "").trim() || defaultLang;
            try {
                getGlobalRef().currentLang = normalized;
            } catch {
                // no-op for readonly global in tests/sandbox
            }
            return normalized;
        }

        function sanitizeDayNightHourValue(value, fallbackHour = defaultDayStartHour) {
            const service = getMainDayNightRangeUtilsService();
            if (service && typeof service.sanitizeDayNightHourValue === "function") {
                return service.sanitizeDayNightHourValue(value, fallbackHour);
            }
            const asNumber = Number(value);
            if (!Number.isFinite(asNumber)) return Number(fallbackHour) || defaultDayStartHour;
            const normalized = Math.floor(asNumber) % 24;
            return normalized < 0 ? normalized + 24 : normalized;
        }

        function normalizeDayNightRangeValues(dayStartHourInput, nightStartHourInput) {
            const service = getMainDayNightRangeUtilsService();
            if (service && typeof service.normalizeDayNightRangeValues === "function") {
                return service.normalizeDayNightRangeValues(dayStartHourInput, nightStartHourInput);
            }
            const dayStartHour = sanitizeDayNightHourValue(dayStartHourInput, defaultDayStartHour);
            const nightStartHour = sanitizeDayNightHourValue(nightStartHourInput, defaultNightStartHour);
            return { dayStartHour, nightStartHour };
        }

        function assertRequiredServices() {
            const service = getMainBootstrapGuardService();
            if (service && typeof service.assertRequiredServices === "function") {
                return service.assertRequiredServices();
            }
            return undefined;
        }

        return Object.freeze({
            syncRealtimeFlagToGlobal,
            getRuntimeCurrentLangValue,
            syncCurrentLang,
            sanitizeDayNightHourValue,
            normalizeDayNightRangeValues,
            assertRequiredServices
        });
    }

    globalObj.GTVMainRuntimeCoreAccessorProxies = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
