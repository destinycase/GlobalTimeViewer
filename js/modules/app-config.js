(function initGtvAppConfig(globalObj) {
    "use strict";

    const LEGACY_STORAGE_KEYS = Object.freeze([
        "GTV_v322_Data",
        "GTV_v321_Data",
        "GTV_v320_Data",
        "GTV_v310_Data",
        "GTV_v300_Data",
        "GTV_v200_Data",
        "GTV_v170_Data",
        "GTV_v160_Data",
        "GTV_v150_Data",
        "GTV_v140_Data"
    ]);
    // Recent migration candidates for read-only fallback during load.
    const LEGACY_STORAGE_FALLBACK_KEYS = Object.freeze(LEGACY_STORAGE_KEYS.slice(0, 3));

    const APP_CONFIG = Object.freeze({
        VERSION: "3.12.1",
        STORAGE_KEY: "GTV_v323_Data",
        THEME_STORAGE_KEY: "GTV_Theme",
        LANG_STORAGE_KEY: "GTV_Lang",
        UI_SCALE_STORAGE_KEY: "GTV_UIScale",
        MIN_UI_SCALE_PERCENT: 50,
        MAX_UI_SCALE_PERCENT: 200,
        DEFAULT_UI_SCALE_PERCENT: 100,
        UI_SCALE_PERCENT_OPTIONS: Object.freeze([50, 75, 100, 125, 150, 175, 200]),
        LEGACY_STORAGE_KEYS,
        LEGACY_STORAGE_FALLBACK_KEYS,
        THEME_LIST: Object.freeze(["dark", "light"]),
        TABLE_IMAGE_EXPORT_WIDTH: 1920,
        EXPORT_MONO_FONT_FAMILY: "'JetBrains Mono', 'Consolas', 'Courier New', monospace"
    });

    globalObj.GTVAppConfig = APP_CONFIG;
})(typeof window !== "undefined" ? window : globalThis);
