(function initGtvMainConstants(globalObj) {
    "use strict";

    const COPY_FORMAT_KEYS = Object.freeze(["timezone", "region", "offset", "time", "period_days", "period_time"]);
    const TIME_PART_KEYS = Object.freeze(["dn", "date", "time", "weekday"]);
    const PERIOD_RESULT_IDS = Object.freeze(["period-res", "period-hour-res", "period-min-res", "period-sec-res"]);
    const TIMELINE_TOTAL_HOURS = 24;
    const TIMELINE_TOTAL_SECONDS = 24 * 60 * 60;
    const MAIN_TABS = Object.freeze(["live", "fixed", "multi", "fixed-time", "calc"]);
    const MIN_TIME_ADJUST_DAY_STEP = 1;
    const MAX_TIME_ADJUST_DAY_STEP = 36500;
    const DEFAULT_TIME_ADJUST_DAY_STEP = 1;
    const MIN_MULTI_RANGE_COUNT = 1;
    const MAX_MULTI_RANGE_COUNT = 12;
    const MIN_FIXED_TIME_SLOT_COUNT = 1;
    const MAX_FIXED_TIME_SLOT_COUNT = 5;
    const DEFAULT_FIXED_TIME_VALUE = "09:00";
    const DEFAULT_MULTI_RANGE_TITLE = "Range";
    const DEFAULT_DISPLAY_FORMAT_ENABLED = Object.freeze({
        timezone: true,
        region: true,
        offset: true,
        time: true,
        period_days: false,
        period_time: true
    });
    const DEFAULT_COPY_FORMAT_ENABLED = Object.freeze({
        timezone: true,
        region: true,
        offset: true,
        time: true,
        period_days: false,
        period_time: true
    });
    const DEFAULT_DISPLAY_TIME_PARTS_ENABLED = Object.freeze({
        dn: true,
        date: true,
        time: true,
        weekday: true
    });
    const DEFAULT_COPY_TIME_PARTS_ENABLED = Object.freeze({
        dn: false,
        date: true,
        time: true,
        weekday: false
    });
    const FORMAT_PROFILE_CONTEXT_KEYS = Object.freeze(["live", "fixed", "fixed-extra", "multi", "fixed-time"]);

    globalObj.GTVMainConstants = Object.freeze({
        COPY_FORMAT_KEYS,
        TIME_PART_KEYS,
        PERIOD_RESULT_IDS,
        TIMELINE_TOTAL_HOURS,
        TIMELINE_TOTAL_SECONDS,
        MAIN_TABS,
        MIN_TIME_ADJUST_DAY_STEP,
        MAX_TIME_ADJUST_DAY_STEP,
        DEFAULT_TIME_ADJUST_DAY_STEP,
        MIN_MULTI_RANGE_COUNT,
        MAX_MULTI_RANGE_COUNT,
        MIN_FIXED_TIME_SLOT_COUNT,
        MAX_FIXED_TIME_SLOT_COUNT,
        DEFAULT_FIXED_TIME_VALUE,
        DEFAULT_MULTI_RANGE_TITLE,
        DEFAULT_DISPLAY_FORMAT_ENABLED,
        DEFAULT_COPY_FORMAT_ENABLED,
        DEFAULT_DISPLAY_TIME_PARTS_ENABLED,
        DEFAULT_COPY_TIME_PARTS_ENABLED,
        FORMAT_PROFILE_CONTEXT_KEYS
    });
})(typeof window !== "undefined" ? window : globalThis);
