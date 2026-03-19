(function initGtvMainAppStateBridge(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const callServiceMethod = (typeof safeDeps.callServiceMethod === "function")
            ? safeDeps.callServiceMethod
            : (() => undefined);
        const getAppStatePatcherService = (typeof safeDeps.getAppStatePatcherService === "function")
            ? safeDeps.getAppStatePatcherService
            : (() => null);
        const getAppPersistenceStateService = (typeof safeDeps.getAppPersistenceStateService === "function")
            ? safeDeps.getAppPersistenceStateService
            : (() => null);
        const applyDirectStatePatch = (typeof safeDeps.applyDirectStatePatch === "function")
            ? safeDeps.applyDirectStatePatch
            : (() => {});
        const serviceMethodMissingToken = Object.prototype.hasOwnProperty.call(safeDeps, "serviceMethodMissingToken")
            ? safeDeps.serviceMethodMissingToken
            : Symbol("GTV_SERVICE_METHOD_MISSING");

        function getPersistenceState() {
            return callServiceMethod(
                "appPersistenceStateService",
                getAppPersistenceStateService(),
                "getPersistenceState",
                [],
                { fallback: {} }
            );
        }

        function setPersistenceState(next = {}) {
            const result = callServiceMethod(
                "appPersistenceStateService",
                getAppPersistenceStateService(),
                "setPersistenceState",
                [next],
                { fallback: serviceMethodMissingToken }
            );
            if (result === serviceMethodMissingToken) {
                applyDirectStatePatch(next);
                return;
            }
            return result;
        }

        function getPatchedAppStateSnapshot() {
            return callServiceMethod(
                "appStatePatcherService",
                getAppStatePatcherService(),
                "getStateSnapshot",
                [],
                { fallback: {} }
            );
        }

        function patchAppState(next = {}) {
            const result = callServiceMethod(
                "appStatePatcherService",
                getAppStatePatcherService(),
                "applyStatePatch",
                [next],
                { fallback: serviceMethodMissingToken }
            );
            if (result === serviceMethodMissingToken) {
                setPersistenceState(next);
                return;
            }
            return result;
        }

        function getPatchedStateValue(key, fallbackValue) {
            const state = getPatchedAppStateSnapshot();
            if (state && typeof state === "object" && Object.prototype.hasOwnProperty.call(state, key)) {
                return state[key];
            }
            return fallbackValue;
        }

        function getPatchedIntegerStateValue(key, fallbackValue = 0) {
            const fallback = Number.isFinite(Number(fallbackValue)) ? Math.trunc(Number(fallbackValue)) : 0;
            const raw = getPatchedStateValue(key, fallback);
            const parsed = Number(raw);
            if (!Number.isFinite(parsed)) return fallback;
            return Math.trunc(parsed);
        }

        function getPatchedBooleanStateValue(key, fallbackValue = false) {
            return !!getPatchedStateValue(key, !!fallbackValue);
        }

        function getPatchedStringStateValue(key, fallbackValue = "") {
            const fallback = (typeof fallbackValue === "string") ? fallbackValue : "";
            const raw = getPatchedStateValue(key, fallback);
            return (typeof raw === "string" && raw) ? raw : fallback;
        }

        function getPatchedArrayStateValue(key, fallbackValue = []) {
            const fallback = Array.isArray(fallbackValue) ? fallbackValue : [];
            const raw = getPatchedStateValue(key, fallback);
            return Array.isArray(raw) ? raw : fallback;
        }

        function getPatchedObjectStateValue(key, fallbackValue = {}) {
            const fallback = (fallbackValue && typeof fallbackValue === "object" && !Array.isArray(fallbackValue))
                ? fallbackValue
                : {};
            const raw = getPatchedStateValue(key, fallback);
            if (raw && typeof raw === "object" && !Array.isArray(raw)) return raw;
            return fallback;
        }

        return Object.freeze({
            getPersistenceState,
            setPersistenceState,
            getPatchedAppStateSnapshot,
            patchAppState,
            getPatchedStateValue,
            getPatchedIntegerStateValue,
            getPatchedBooleanStateValue,
            getPatchedStringStateValue,
            getPatchedArrayStateValue,
            getPatchedObjectStateValue
        });
    }

    globalObj.GTVMainAppStateBridge = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
