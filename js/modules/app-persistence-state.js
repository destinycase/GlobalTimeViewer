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
        "currentLang"
    ]);

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (_err) {
                return undefined;
            }
        }

        function getCurrentState() {
            const state = invokeDep("getState");
            return (state && typeof state === "object") ? state : {};
        }

        function getPersistenceState() {
            invokeDep("syncActiveFormatProfileFromState");
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
                invokeDep("setState", patch);
            }
            if (Object.prototype.hasOwnProperty.call(next, "isRealtime")) {
                invokeDep("setIsRealtimeState", next.isRealtime);
            }

            invokeDep("ensureFormatProfiles", invokeDep("getCurrentFormatProfileState"));
            const updatedState = getCurrentState();
            const nextContext = invokeDep(
                "resolveFormatProfileContext",
                updatedState.currentMainTab,
                updatedState.slotCount
            );
            invokeDep("setState", { activeFormatProfileContext: nextContext });
            const postContextState = getCurrentState();
            const profile = postContextState?.formatProfiles?.[nextContext];
            invokeDep("applyFormatProfileState", profile, nextContext);
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
