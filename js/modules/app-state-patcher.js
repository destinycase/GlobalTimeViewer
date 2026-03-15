(function initGtvAppStatePatcher(globalObj) {
    "use strict";

    const PATCHABLE_KEYS = Object.freeze([
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

        function getStateSnapshot() {
            const source = invokeDep("getStateSource");
            const safeSource = (source && typeof source === "object") ? source : {};
            const snapshot = {};
            PATCHABLE_KEYS.forEach((key) => {
                snapshot[key] = safeSource[key];
            });
            snapshot.isRealtime = !!safeSource.isRealtime;
            return snapshot;
        }

        function applyStatePatch(next = {}) {
            if (!next || typeof next !== "object") return;
            const setters = (safeDeps.stateSetters && typeof safeDeps.stateSetters === "object")
                ? safeDeps.stateSetters
                : {};

            PATCHABLE_KEYS.forEach((key) => {
                if (!Object.prototype.hasOwnProperty.call(next, key)) return;
                const setter = setters[key];
                if (typeof setter !== "function") return;
                if (key === "showTimeline") {
                    setter(!!next.showTimeline);
                    return;
                }
                setter(next[key]);
            });

            if (Object.prototype.hasOwnProperty.call(next, "isRealtime")) {
                invokeDep("setIsRealtimeState", next.isRealtime);
            }
        }

        return Object.freeze({
            getStateSnapshot,
            applyStatePatch
        });
    }

    globalObj.GTVAppStatePatcher = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
