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

        function pickDepsFrom(source, depNames = []) {
            const resolved = {};
            depNames.forEach((depName) => {
                resolved[depName] = source[depName];
            });
            return resolved;
        }

        function pickAliasedDeps(d, aliasMap = {}) {
            const resolved = {};
            Object.keys(aliasMap).forEach((targetKey) => {
                resolved[targetKey] = d[aliasMap[targetKey]];
            });
            return resolved;
        }

        function deferDynamic(d, getter) {
            if (typeof d.deferDynamicCall !== "function") return () => undefined;
            return d.deferDynamicCall(getter);
        }

        function buildMainSelectServicesConfig(d) {
            return {
                ...pickAliasedDeps(d, {
                    getDocumentRef: "getDocumentRefOrNull",
                    getComputedStyle: "getComputedStyleSafely",
                    savePersistence: "savePersistenceSafely",
                    t: "gtvT"
                }),
                ...pickDepsFrom(d, [
                    "ensureBaseTimezoneSelection",
                    "getCurrentGroupBaseTimezoneId",
                    "isCurrentGroupUtcRowVisible",
                    "getCurrentGroupZones",
                    "getZoneAbbreviation",
                    "getZoneDisplayName",
                    "setCurrentGroupBaseTimezoneId"
                ])
            };
        }

        function buildTimezoneSearchConfig(d) {
            return {
                ...pickDepsFrom(d, ["TZ_DATABASE"]),
                ...pickAliasedDeps(d, {
                    getZoneMap: "getZoneMapRef",
                    t: "gtvT",
                    getCurrentLang: "getPatchedCurrentLangState",
                    savePersistence: "savePersistenceSafely"
                }),
                ...pickDepsFrom(d, [
                    "getBetterAbbr",
                    "getTimezoneOffset",
                    "getLocalizedTZLabel",
                    "adjustSelectWidthForContent",
                    "getCurrentGroup",
                    "addTimezone",
                    "createUniqueTimezoneId"
                ]),
                renderList: deferDynamic(d, d.getRenderListRef)
            };
        }

        function buildSnapshotFormatConfig(d) {
            return {
                ...pickDepsFrom(d, ["DEFAULT_COPY_TIME_PARTS_ENABLED"]),
                ...pickAliasedDeps(d, {
                    I18N_DATA: "MAIN_I18N_DATA",
                    t: "gtvT",
                    getCurrentLang: "getPatchedCurrentLangState",
                    getGlobalTimes: "getGlobalTimesState",
                    getSlotCount: "getPatchedSlotCountState",
                    isRealtime: "getIsRealtimeState"
                }),
                ...pickDepsFrom(d, [
                    "getUTCRef",
                    "getBaseTimezoneRef",
                    "getCurrentGroupZones",
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
            };
        }

        const mainCoreServices = requireObject(safeDeps.mainCoreServices, "mainCoreServices");

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

        const selectDeps = {
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
        };
        const mainSelectServicesConfig = buildMainSelectServicesConfig(selectDeps);
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
