(function initGtvMainDirectStatePatch(globalObj) {
    "use strict";

    const DEFAULT_PATCH_KEYS = Object.freeze([
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
        const patchKeys = Array.isArray(safeDeps.patchKeys) ? safeDeps.patchKeys : DEFAULT_PATCH_KEYS;
        const stateSetters = (safeDeps.stateSetters && typeof safeDeps.stateSetters === "object")
            ? safeDeps.stateSetters
            : {};
        const setIsRealtimeState = (typeof safeDeps.setIsRealtimeState === "function")
            ? safeDeps.setIsRealtimeState
            : (() => {});

        function applyDirectStatePatch(next = {}) {
            if (!next || typeof next !== "object") return;

            patchKeys.forEach((key) => {
                if (!Object.prototype.hasOwnProperty.call(next, key)) return;
                const setter = stateSetters[key];
                if (typeof setter !== "function") return;
                if (key === "showTimeline") {
                    setter(!!next.showTimeline);
                    return;
                }
                setter(next[key]);
            });

            if (Object.prototype.hasOwnProperty.call(next, "isRealtime")) {
                setIsRealtimeState(next.isRealtime);
            }
        }

        return Object.freeze({
            applyDirectStatePatch,
            getPatchKeys: () => [...patchKeys]
        });
    }

    globalObj.GTVMainDirectStatePatch = Object.freeze({
        DEFAULT_PATCH_KEYS,
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
