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
            getDocumentRefOrNull: safeDeps.getDocumentRefOrNull,
            getComputedStyleSafely: safeDeps.getComputedStyleSafely,
            ensureBaseTimezoneSelection: safeDeps.ensureBaseTimezoneSelection,
            getCurrentGroupBaseTimezoneId: safeDeps.getCurrentGroupBaseTimezoneId,
            isCurrentGroupUtcRowVisible: safeDeps.isCurrentGroupUtcRowVisible,
            getCurrentGroupZones: safeDeps.getCurrentGroupZones,
            getZoneAbbreviation: safeDeps.getZoneAbbreviation,
            getZoneDisplayName: safeDeps.getZoneDisplayName,
            setCurrentGroupBaseTimezoneId: safeDeps.setCurrentGroupBaseTimezoneId,
            savePersistenceSafely: safeDeps.savePersistenceSafely,
            gtvT: safeDeps.gtvT
        });
        const mainSelectServices = createMainSelectServices(mainSelectServicesConfig);
        const adjustSelectWidthForContent = mainSelectServices.adjustSelectWidthForContent;
        const refreshSelectWidths = mainSelectServices.refreshSelectWidths;
        const renderBaseTimeSelect = mainSelectServices.renderBaseTimeSelect;

        const timezoneSearchConfig = buildTimezoneSearchConfig({
            TZ_DATABASE: safeDeps.TZ_DATABASE,
            getZoneMapRef: safeDeps.getZoneMapRef,
            gtvT: safeDeps.gtvT,
            getPatchedCurrentLangState: safeDeps.getPatchedCurrentLangState,
            getBetterAbbr: safeDeps.getBetterAbbr,
            getTimezoneOffset: safeDeps.getTimezoneOffset,
            getLocalizedTZLabel: safeDeps.getLocalizedTZLabel,
            adjustSelectWidthForContent,
            getCurrentGroup: safeDeps.getCurrentGroup,
            savePersistenceSafely: safeDeps.savePersistenceSafely,
            deferDynamicCall: safeDeps.deferDynamicCall,
            getRenderListRef: safeDeps.getRenderListRef,
            addTimezone: safeDeps.addTimezone,
            createUniqueTimezoneId: safeDeps.createUniqueTimezoneId
        });
        const timezoneSearchService = createTimezoneSearchService(timezoneSearchConfig);

        const snapshotFormatConfig = buildSnapshotFormatConfig({
            DEFAULT_COPY_TIME_PARTS_ENABLED: safeDeps.DEFAULT_COPY_TIME_PARTS_ENABLED,
            MAIN_I18N_DATA: safeDeps.MAIN_I18N_DATA,
            gtvT: safeDeps.gtvT,
            getPatchedCurrentLangState: safeDeps.getPatchedCurrentLangState,
            getUTCRef: safeDeps.getUTCRef,
            getBaseTimezoneRef: safeDeps.getBaseTimezoneRef,
            getCurrentGroupZones: safeDeps.getCurrentGroupZones,
            getGlobalTimesState: safeDeps.getGlobalTimesState,
            getPatchedSlotCountState: safeDeps.getPatchedSlotCountState,
            getIsRealtimeState: safeDeps.getIsRealtimeState,
            getDayNightMarkerByHour: safeDeps.getDayNightMarkerByHour,
            getFixedOffsetForDisplay: safeDeps.getFixedOffsetForDisplay,
            normalizeCustomAbbr: safeDeps.normalizeCustomAbbr,
            getCustomOffsetMinutes: safeDeps.getCustomOffsetMinutes,
            pad: safeDeps.pad,
            getZoneAbbreviation: safeDeps.getZoneAbbreviation,
            getZoneDisplayName: safeDeps.getZoneDisplayName,
            getSignedInclusiveDaySpan: safeDeps.getSignedInclusiveDaySpan,
            getSignedDurationDayHourMinute: safeDeps.getSignedDurationDayHourMinute,
            sanitizeTimePartsEnabled: safeDeps.sanitizeTimePartsEnabled,
            sanitizeCopyFormatOrder: safeDeps.sanitizeCopyFormatOrder,
            timeService: safeDeps.timeService
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
