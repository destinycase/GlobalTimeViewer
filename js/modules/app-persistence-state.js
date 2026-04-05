(function initGtvAppPersistenceState(globalObj) {
    "use strict";

    const PERSISTENCE_KEYS = Object.freeze([
        "groups",
        "activeGroupId",
        "currentMainTab",
        "activeGroupIdByMainTab",
        "slotCount",
        "showCopyFormat",
        "showTimeline",
        "displayFormatOrder",
        "displayFormatEnabled",
        "displayTimePartsEnabled",
        "copyFormatOrder",
        "copyFormatEnabled",
        "copyTimePartsEnabled",
        "formatProfiles",
        "activeFormatProfileContext",
        "timeAdjustDayStepBySlot",
        "multiRangeCount",
        "multiRangeTitle",
        "multiRanges",
        "multiRangeCollapsed",
        "multiRangeStartEditEnabled",
        "multiRangeEndEditEnabled",
        "currentTheme",
        "dayStartHour",
        "nightStartHour",
        "currentLang"
    ]);

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function logWarn(...args) {
            if (typeof safeDeps.logWarn === "function") {
                safeDeps.logWarn(...args);
                return;
            }
            if (typeof safeDeps.consoleWarn === "function") {
                safeDeps.consoleWarn(...args);
                return;
            }
            if (typeof console === "object" && console && typeof console.warn === "function") {
                console.warn(...args);
            }
        }

        function toSafeCallable(depName, depFn) {
            if (typeof depFn !== "function") return () => undefined;
            return (...args) => {
                try {
                    return depFn(...args);
                } catch (err) {
                    logWarn(`[GTVAppPersistenceState] Dependency "${depName}" threw.`, err);
                    return undefined;
                }
            };
        }

        const dep = Object.freeze({
            getState: toSafeCallable("getState", safeDeps.getState),
            syncActiveFormatProfileFromState: toSafeCallable("syncActiveFormatProfileFromState", safeDeps.syncActiveFormatProfileFromState),
            setState: toSafeCallable("setState", safeDeps.setState),
            setIsRealtimeState: toSafeCallable("setIsRealtimeState", safeDeps.setIsRealtimeState),
            ensureFormatProfiles: toSafeCallable("ensureFormatProfiles", safeDeps.ensureFormatProfiles),
            getCurrentFormatProfileState: toSafeCallable("getCurrentFormatProfileState", safeDeps.getCurrentFormatProfileState),
            resolveFormatProfileContext: toSafeCallable("resolveFormatProfileContext", safeDeps.resolveFormatProfileContext),
            applyFormatProfileState: toSafeCallable("applyFormatProfileState", safeDeps.applyFormatProfileState)
        });

        function getCurrentState() {
            const state = dep.getState();
            return (state && typeof state === "object") ? state : {};
        }

        function getPersistenceState() {
            dep.syncActiveFormatProfileFromState();
            const currentState = getCurrentState();
            const snapshot = {};
            PERSISTENCE_KEYS.forEach((key) => {
                snapshot[key] = currentState[key];
            });
            snapshot.isRealtime = !!currentState.isRealtime;
            return snapshot;
        }

        function setPersistenceState(next = {}) {
            if (!next || typeof next !== "object") return;

            const patch = {};
            PERSISTENCE_KEYS.forEach((key) => {
                if (!Object.prototype.hasOwnProperty.call(next, key)) return;
                if (key === "showTimeline") {
                    patch.showTimeline = !!next.showTimeline;
                    return;
                }
                patch[key] = next[key];
            });

            if (Object.keys(patch).length > 0) {
                dep.setState(patch);
            }
            if (Object.prototype.hasOwnProperty.call(next, "isRealtime")) {
                dep.setIsRealtimeState(next.isRealtime);
            }

            dep.ensureFormatProfiles(dep.getCurrentFormatProfileState());
            const updatedState = getCurrentState();
            const nextContext = dep.resolveFormatProfileContext(
                updatedState.currentMainTab,
                updatedState.slotCount
            );
            dep.setState({ activeFormatProfileContext: nextContext });
            const postContextState = getCurrentState();
            const profile = postContextState?.formatProfiles?.[nextContext];
            dep.applyFormatProfileState(profile, nextContext);
        }

        return Object.freeze({
            getPersistenceState,
            setPersistenceState
        });
    }

    globalObj.GTVAppPersistenceState = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
