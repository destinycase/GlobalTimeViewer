(function initGtvMainConstantsBindings(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const constantsModule = safeDeps.constantsModule;
        if (!constantsModule || typeof constantsModule !== "object") {
            throw new Error("Missing required module: GTVMainConstants");
        }

        return Object.freeze({
            COPY_FORMAT_KEYS: [...(constantsModule.COPY_FORMAT_KEYS || [])],
            TIME_PART_KEYS: [...(constantsModule.TIME_PART_KEYS || [])],
            PERIOD_RESULT_IDS: new Set(constantsModule.PERIOD_RESULT_IDS || []),
            TIMELINE_TOTAL_HOURS: Number(constantsModule.TIMELINE_TOTAL_HOURS || 24),
            TIMELINE_TOTAL_SECONDS: Number(constantsModule.TIMELINE_TOTAL_SECONDS || (24 * 60 * 60)),
            MAIN_TABS: [...(constantsModule.MAIN_TABS || [])],
            MIN_TIME_ADJUST_DAY_STEP: Number(constantsModule.MIN_TIME_ADJUST_DAY_STEP || 1),
            MAX_TIME_ADJUST_DAY_STEP: Number(constantsModule.MAX_TIME_ADJUST_DAY_STEP || 36500),
            DEFAULT_TIME_ADJUST_DAY_STEP: Number(constantsModule.DEFAULT_TIME_ADJUST_DAY_STEP || 1),
            MIN_MULTI_RANGE_COUNT: Number(constantsModule.MIN_MULTI_RANGE_COUNT || 1),
            MAX_MULTI_RANGE_COUNT: Number(constantsModule.MAX_MULTI_RANGE_COUNT || 12),
            MIN_FIXED_TIME_SLOT_COUNT: Number(constantsModule.MIN_FIXED_TIME_SLOT_COUNT || 1),
            MAX_FIXED_TIME_SLOT_COUNT: Number(constantsModule.MAX_FIXED_TIME_SLOT_COUNT || 5),
            DEFAULT_FIXED_TIME_VALUE: String(constantsModule.DEFAULT_FIXED_TIME_VALUE || "09:00"),
            DEFAULT_DAY_START_HOUR: Number(constantsModule.DEFAULT_DAY_START_HOUR || 6),
            DEFAULT_NIGHT_START_HOUR: Number(constantsModule.DEFAULT_NIGHT_START_HOUR || 18),
            DAY_NIGHT_HOUR_OPTIONS: [
                ...(constantsModule.DAY_NIGHT_HOUR_OPTIONS || Array.from({ length: 24 }, (_, hour) => hour))
            ],
            DEFAULT_MULTI_RANGE_TITLE: String(constantsModule.DEFAULT_MULTI_RANGE_TITLE || "Range"),
            DEFAULT_DISPLAY_FORMAT_ENABLED: { ...(constantsModule.DEFAULT_DISPLAY_FORMAT_ENABLED || {}) },
            DEFAULT_COPY_FORMAT_ENABLED: { ...(constantsModule.DEFAULT_COPY_FORMAT_ENABLED || {}) },
            DEFAULT_DISPLAY_TIME_PARTS_ENABLED: { ...(constantsModule.DEFAULT_DISPLAY_TIME_PARTS_ENABLED || {}) },
            DEFAULT_COPY_TIME_PARTS_ENABLED: { ...(constantsModule.DEFAULT_COPY_TIME_PARTS_ENABLED || {}) },
            FORMAT_PROFILE_CONTEXT_KEYS: [...(constantsModule.FORMAT_PROFILE_CONTEXT_KEYS || [])]
        });
    }

    globalObj.GTVMainConstantsBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
