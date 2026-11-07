(function initGtvMainAppStateVars(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const t = (typeof safeDeps.t === "function") ? safeDeps.t : (() => "Range");
        const copyFormatKeys = Array.isArray(safeDeps.copyFormatKeys) ? safeDeps.copyFormatKeys : [];
        const defaultDisplayFormatEnabled = (safeDeps.defaultDisplayFormatEnabled && typeof safeDeps.defaultDisplayFormatEnabled === "object") ? safeDeps.defaultDisplayFormatEnabled : {};
        const defaultCopyFormatEnabled = (safeDeps.defaultCopyFormatEnabled && typeof safeDeps.defaultCopyFormatEnabled === "object") ? safeDeps.defaultCopyFormatEnabled : {};
        const defaultDisplayTimePartsEnabled = (safeDeps.defaultDisplayTimePartsEnabled && typeof safeDeps.defaultDisplayTimePartsEnabled === "object") ? safeDeps.defaultDisplayTimePartsEnabled : {};
        const defaultCopyTimePartsEnabled = (safeDeps.defaultCopyTimePartsEnabled && typeof safeDeps.defaultCopyTimePartsEnabled === "object") ? safeDeps.defaultCopyTimePartsEnabled : {};
        const defaultTimeAdjustDayStep = Number.isFinite(Number(safeDeps.defaultTimeAdjustDayStep)) ? Number(safeDeps.defaultTimeAdjustDayStep) : 1;
        const defaultDayStartHour = Number.isFinite(Number(safeDeps.defaultDayStartHour))
            ? Math.min(23, Math.max(0, Math.trunc(Number(safeDeps.defaultDayStartHour))))
            : 6;
        const defaultNightStartHour = Number.isFinite(Number(safeDeps.defaultNightStartHour))
            ? Math.min(23, Math.max(0, Math.trunc(Number(safeDeps.defaultNightStartHour))))
            : 18;

        const initialState = Object.freeze({
            isRealtime: true,
            globalTimes: [new Date(), new Date()],
            slotCount: 1,
            uiScale: 1.0,
            showCopyFormat: false,
            showTimeline: false,
            displayFormatOrder: [...copyFormatKeys],
            displayFormatEnabled: { ...defaultDisplayFormatEnabled },
            copyFormatOrder: [...copyFormatKeys],
            copyFormatEnabled: { ...defaultCopyFormatEnabled },
            displayTimePartsEnabled: { ...defaultDisplayTimePartsEnabled },
            copyTimePartsEnabled: { ...defaultCopyTimePartsEnabled },
            formatProfiles: {},
            activeFormatProfileContext: "live",
            timeAdjustDayStepBySlot: [defaultTimeAdjustDayStep, defaultTimeAdjustDayStep],
            multiRangeCount: 1,
            multiRangeTitle: String(t("placeholder_range_title") || "Range"),
            multiRanges: [],
            multiRangeCollapsed: [],
            multiRangeStartEditEnabled: [],
            multiRangeEndEditEnabled: [],
            currentMainTab: "live",
            activeGroupIdByMainTab: { live: 0, fixed: 0 },
            currentTheme: "dark",
            dayStartHour: defaultDayStartHour,
            nightStartHour: defaultNightStartHour,
            canUseForeignObjectRenderer: null,
            fixedTimeIdSeed: 0,
            groups: [],
            activeGroupId: 0
        });

        function createDirectStateSetters(setterDeps = {}) {
            const safeSetterDeps = (setterDeps && typeof setterDeps === "object") ? setterDeps : {};
            const setByKey = (key, value) => {
                const setter = safeSetterDeps[key];
                if (typeof setter !== "function") return;
                setter(value);
            };
            return Object.freeze({
                groups: (value) => { setByKey("groups", value); },
                activeGroupId: (value) => { setByKey("activeGroupId", value); },
                currentMainTab: (value) => { setByKey("currentMainTab", value); },
                activeGroupIdByMainTab: (value) => { setByKey("activeGroupIdByMainTab", value); },
                slotCount: (value) => { setByKey("slotCount", value); },
                showCopyFormat: (value) => { setByKey("showCopyFormat", value); },
                showTimeline: (value) => { setByKey("showTimeline", !!value); },
                displayFormatOrder: (value) => { setByKey("displayFormatOrder", value); },
                displayFormatEnabled: (value) => { setByKey("displayFormatEnabled", value); },
                displayTimePartsEnabled: (value) => { setByKey("displayTimePartsEnabled", value); },
                copyFormatOrder: (value) => { setByKey("copyFormatOrder", value); },
                copyFormatEnabled: (value) => { setByKey("copyFormatEnabled", value); },
                copyTimePartsEnabled: (value) => { setByKey("copyTimePartsEnabled", value); },
                formatProfiles: (value) => { setByKey("formatProfiles", value); },
                activeFormatProfileContext: (value) => { setByKey("activeFormatProfileContext", value); },
                timeAdjustDayStepBySlot: (value) => { setByKey("timeAdjustDayStepBySlot", value); },
                multiRangeCount: (value) => { setByKey("multiRangeCount", value); },
                multiRangeTitle: (value) => { setByKey("multiRangeTitle", value); },
                multiRanges: (value) => { setByKey("multiRanges", value); },
                multiRangeCollapsed: (value) => { setByKey("multiRangeCollapsed", value); },
                multiRangeStartEditEnabled: (value) => { setByKey("multiRangeStartEditEnabled", value); },
                multiRangeEndEditEnabled: (value) => { setByKey("multiRangeEndEditEnabled", value); },
                currentTheme: (value) => { setByKey("currentTheme", value); },
                dayStartHour: (value) => { setByKey("dayStartHour", value); },
                nightStartHour: (value) => { setByKey("nightStartHour", value); },
                currentLang: (value) => { setByKey("currentLang", value); }
            });
        }

        return Object.freeze({
            initialState,
            createDirectStateSetters
        });
    }

    globalObj.GTVMainAppStateVars = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
