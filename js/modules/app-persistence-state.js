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

        function toSafeCallable(depFn) {
            if (typeof depFn !== "function") return () => undefined;
            return (...args) => {
                try {
                    return depFn(...args);
                } catch (_err) {
                    return undefined;
                }
            };
        }

        const dep = Object.freeze({
            getState: toSafeCallable(safeDeps.getState),
            syncActiveFormatProfileFromState: toSafeCallable(safeDeps.syncActiveFormatProfileFromState),
            setState: toSafeCallable(safeDeps.setState),
            setIsRealtimeState: toSafeCallable(safeDeps.setIsRealtimeState),
            ensureFormatProfiles: toSafeCallable(safeDeps.ensureFormatProfiles),
            getCurrentFormatProfileState: toSafeCallable(safeDeps.getCurrentFormatProfileState),
            resolveFormatProfileContext: toSafeCallable(safeDeps.resolveFormatProfileContext),
            applyFormatProfileState: toSafeCallable(safeDeps.applyFormatProfileState)
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
