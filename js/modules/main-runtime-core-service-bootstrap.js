(function initGtvMainRuntimeCoreServiceBootstrap(globalObj) {
    "use strict";

    function requireFunction(value, label) {
        if (typeof value !== "function") {
            throw new Error(`Missing required dependency: ${label}`);
        }
        return value;
    }

    function requireObject(value, label) {
        if (!value || typeof value !== "object") {
            throw new Error(`Missing required dependency: ${label}`);
        }
        return value;
    }

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function pickDeps(depNames = []) {
            const resolved = {};
            depNames.forEach((depName) => {
                resolved[depName] = safeDeps[depName];
            });
            return resolved;
        }

        const mainRuntimeServiceConfigBuilderService = requireObject(
            safeDeps.mainRuntimeServiceConfigBuilderService,
            "mainRuntimeServiceConfigBuilderService"
        );
        const mainCoreServices = requireObject(safeDeps.mainCoreServices, "mainCoreServices");

        const buildMainSelectServicesConfig = requireFunction(
            mainRuntimeServiceConfigBuilderService.buildMainSelectServicesConfig,
            "mainRuntimeServiceConfigBuilderService.buildMainSelectServicesConfig"
        );
        const buildTimezoneSearchConfig = requireFunction(
            mainRuntimeServiceConfigBuilderService.buildTimezoneSearchConfig,
            "mainRuntimeServiceConfigBuilderService.buildTimezoneSearchConfig"
        );
        const buildSnapshotFormatConfig = requireFunction(
            mainRuntimeServiceConfigBuilderService.buildSnapshotFormatConfig,
            "mainRuntimeServiceConfigBuilderService.buildSnapshotFormatConfig"
        );
        const createMainSelectServices = requireFunction(
            mainCoreServices.createMainSelectServices,
            "mainCoreServices.createMainSelectServices"
        );
        const createTimezoneSearchService = requireFunction(
            mainCoreServices.createTimezoneSearchService,
            "mainCoreServices.createTimezoneSearchService"
        );
        const createSnapshotFormatService = requireFunction(
            mainCoreServices.createSnapshotFormatService,
            "mainCoreServices.createSnapshotFormatService"
        );

        const mainSelectServicesConfig = buildMainSelectServicesConfig({
            ...pickDeps([
                "getDocumentRefOrNull",
                "getComputedStyleSafely",
                "ensureBaseTimezoneSelection",
                "getCurrentGroupBaseTimezoneId",
                "isCurrentGroupUtcRowVisible",
                "getCurrentGroupZones",
                "getZoneAbbreviation",
                "getZoneDisplayName",
                "setCurrentGroupBaseTimezoneId",
                "savePersistenceSafely",
                "gtvT"
            ])
        });
        const mainSelectServices = createMainSelectServices(mainSelectServicesConfig);
        const adjustSelectWidthForContent = mainSelectServices.adjustSelectWidthForContent;
        const refreshSelectWidths = mainSelectServices.refreshSelectWidths;
        const renderBaseTimeSelect = mainSelectServices.renderBaseTimeSelect;

        const timezoneSearchConfig = buildTimezoneSearchConfig({
            ...pickDeps([
                "TZ_DATABASE",
                "getZoneMapRef",
                "gtvT",
                "getPatchedCurrentLangState",
                "getBetterAbbr",
                "getTimezoneOffset",
                "getLocalizedTZLabel"
            ]),
            adjustSelectWidthForContent,
            ...pickDeps([
                "getCurrentGroup",
                "savePersistenceSafely",
                "deferDynamicCall",
                "getRenderListRef",
                "addTimezone",
                "createUniqueTimezoneId"
            ])
        });
        const timezoneSearchService = createTimezoneSearchService(timezoneSearchConfig);

        const snapshotFormatConfig = buildSnapshotFormatConfig({
            ...pickDeps([
                "DEFAULT_COPY_TIME_PARTS_ENABLED",
                "MAIN_I18N_DATA",
                "gtvT",
                "getPatchedCurrentLangState",
                "getUTCRef",
                "getBaseTimezoneRef",
                "getCurrentGroupZones",
                "getGlobalTimesState",
                "getPatchedSlotCountState",
                "getIsRealtimeState",
                "getDayNightMarkerByHour",
                "getFixedOffsetForDisplay",
                "normalizeCustomAbbr",
                "getCustomOffsetMinutes",
                "pad",
                "getZoneAbbreviation",
                "getZoneDisplayName",
                "getSignedInclusiveDaySpan",
                "getSignedDurationDayHourMinute",
                "sanitizeTimePartsEnabled",
                "sanitizeCopyFormatOrder",
                "timeService"
            ])
        });
        const snapshotFormatService = createSnapshotFormatService(snapshotFormatConfig);

        return Object.freeze({
            mainSelectServices,
            adjustSelectWidthForContent,
            refreshSelectWidths,
            renderBaseTimeSelect,
            timezoneSearchService,
            snapshotFormatService
        });
    }

    globalObj.GTVMainRuntimeCoreServiceBootstrap = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
