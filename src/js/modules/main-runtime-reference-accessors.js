(function initGtvMainRuntimeReferenceAccessors(globalObj) {
    "use strict";

    // [exported name, dependency getter name, fallback when the dependency is missing].
    // Each exported ref calls its getter with no arguments (formerly one wrapper function per getter).
    const PASS_THROUGH_REFS = Object.freeze([
        ["getRenderListRef", "getRenderList", () => undefined],
        ["getSanitizeCopyFormatOrderForContextRef", "getSanitizeCopyFormatOrderForContext", () => undefined],
        ["getSanitizeCopyFormatEnabledForContextRef", "getSanitizeCopyFormatEnabledForContext", () => undefined],
        ["getSanitizeTimePartsEnabledForContextRef", "getSanitizeTimePartsEnabledForContext", () => undefined],
        ["getShowToastRef", "getShowToast", () => undefined],
        ["getRenderTimelineFrameRef", "getRenderTimelineFrame", () => undefined],
        ["getUpdateClocksRef", "getUpdateClocks", () => undefined],
        ["getTranslatorRef", "getTranslator", () => ((key) => String(key ?? ""))],
        ["getSavePersistenceSafelyRef", "getSavePersistenceSafely", () => undefined],
        ["getRenderFixedTimeTabRef", "getRenderFixedTimeTab", () => undefined],
        ["getRefreshFixedTimeSlotCountControlsRef", "getRefreshFixedTimeSlotCountControls", () => undefined],
        ["getAppStatePatcherServiceRef", "getAppStatePatcherService", () => null],
        ["getAppPersistenceStateServiceRef", "getAppPersistenceStateService", () => null],
        ["getMainTimezoneRuntimeBridgeServiceRef", "getMainTimezoneRuntimeBridgeService", () => null],
        ["getMainTimezoneRuntimeServiceRef", "getMainTimezoneRuntimeService", () => null],
        ["getMainBaseTimezoneServiceRef", "getMainBaseTimezoneService", () => null],
        ["getMainTimezoneMutationServiceRef", "getMainTimezoneMutationService", () => null],
        ["getZoneMapRef", "getZoneMap", () => ({})],
        ["getTzDatabaseRef", "getTzDatabase", () => []],
        ["getTimeServiceRef", "getTimeService", () => null],
        ["getRandomValue", "getRuntimeRandom", () => Math.random()],
        ["getGroupStateServiceRef", "getGroupStateService", () => null],
        ["getTimeAdjustActionsServiceRef", "getTimeAdjustActionsService", () => null],
        ["getMultiBulkToolsServiceRef", "getMultiBulkToolsService", () => null],
        ["getFixedTimeTableServiceRef", "getFixedTimeTableService", () => null],
        ["invokeRenderBaseTimeSelect", "invokeRenderBaseTimeSelect", () => undefined],
        ["getMultiRangeCopyServiceRef", "getMultiRangeCopyService", () => null],
        ["getMultiStateServiceRef", "getMultiStateService", () => null],
        ["getMainClockOrchestratorServiceRef", "getMainClockOrchestratorService", () => null],
        ["getMainPersistenceSnapshotServiceRef", "getMainPersistenceSnapshotService", () => null],
        ["getFixedTimeCoreServiceRef", "getFixedTimeCoreService", () => null],
        ["getFixedTimeActionsServiceRef", "getFixedTimeActionsService", () => null],
        ["getTimelineFrameServiceRef", "getTimelineFrameService", () => null],
        ["getFixedTimeTimelineServiceRef", "getFixedTimeTimelineService", () => null],
        ["getShowTimelineStateRef", "getShowTimelineState", () => false],
        ["getDisplayFormatOrderStateRef", "getDisplayFormatOrderState", () => []],
        ["getDisplayFormatEnabledStateRef", "getDisplayFormatEnabledState", () => ({})],
        ["getDisplayTimePartsEnabledStateRef", "getDisplayTimePartsEnabledState", () => ({})],
        ["getCopyFormatOrderStateRef", "getCopyFormatOrderState", () => []],
        ["getCopyFormatEnabledStateRef", "getCopyFormatEnabledState", () => ({})],
        ["getCopyTimePartsEnabledStateRef", "getCopyTimePartsEnabledState", () => ({})],
        ["getFormatProfilesStateRef", "getFormatProfilesState", () => ({})],
        ["getActiveFormatProfileContextStateRef", "getActiveFormatProfileContextState", () => "live"],
        ["getCurrentThemeStateRef", "getCurrentThemeState", () => "dark"],
        ["getCurrentLangStateRef", "getRuntimeCurrentLangValue", () => "ko"],
        ["getSnapshotFormatServiceRef", "getSnapshotFormatService", () => null],
        ["getI18nDataRef", "getI18nData", () => ({ ko: {}, en: {} })],
        ["getImageExportBridgeServiceRef", "getImageExportBridgeService", () => null],
        ["getCanUseForeignObjectRendererRef", "getCanUseForeignObjectRendererState", () => false],
        ["getImageExportActionsServiceRef", "getImageExportActionsService", () => null],
        ["getImageExportNamingServiceRef", "getImageExportNamingService", () => null],
        ["getPersistenceServiceRef", "getPersistenceService", () => null],
        ["getTableRenderServiceRef", "getTableRenderService", () => null],
        ["getCopyActionsServiceRef", "getCopyActionsService", () => null],
        ["getTimeAdjustUiServiceRef", "getTimeAdjustUiService", () => null],
        ["getMultiRangeRenderServiceRef", "getMultiRangeRenderService", () => null],
        ["getFormatControlsServiceRef", "getFormatControlsService", () => null],
        ["getTabUiServiceRef", "getTabUiService", () => null],
        ["getUiSettingsActionsServiceRef", "getUiSettingsActionsService", () => null],
        ["getTimezoneSearchServiceRef", "getTimezoneSearchService", () => null],
        ["getGroupTabsServiceRef", "getGroupTabsService", () => null],
        ["getMainUiInitServiceRef", "getMainUiInitService", () => null],
        ["getTimerEngineServiceRef", "getTimerEngineService", () => null],
        ["getTimeCoreRef", "getTimeCore", () => null],
        ["getMainTimezoneFacadeServiceRef", "getMainTimezoneFacadeService", () => null],
        ["getMainTimeAdjustFacadeServiceRef", "getMainTimeAdjustFacadeService", () => null],
        ["getMainTimezoneTableFacadeServiceRef", "getMainTimezoneTableFacadeService", () => null],
        ["getMainTimelineFacadeServiceRef", "getMainTimelineFacadeService", () => null],
        ["getMainFixedTimeFacadeServiceRef", "getMainFixedTimeFacadeService", () => null],
        ["getMainFixedTimeTabFacadeServiceRef", "getMainFixedTimeTabFacadeService", () => null],
        ["getMainMultiRangeTabFacadeServiceRef", "getMainMultiRangeTabFacadeService", () => null],
        ["getMainFoundationServicesRef", "getMainFoundationServices", () => null]
    ]);

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const dep = (name, fallback) => ((typeof safeDeps[name] === "function") ? safeDeps[name] : fallback);
        const refs = {};
        PASS_THROUGH_REFS.forEach(([exportedName, depName, fallback]) => {
            const getter = dep(depName, fallback);
            refs[exportedName] = () => getter();
        });

        const getTimeService = refs.getTimeServiceRef;
        const getDayStartHourState = dep("getDayStartHourState", () => 6);
        const getNightStartHourState = dep("getNightStartHourState", () => 18);
        const sanitizeDayNightHourValue = dep("sanitizeDayNightHourValue", (value, fallbackHour = 6) => {
            const parsed = Number.parseInt(value, 10);
            return Number.isFinite(parsed) ? parsed : fallbackHour;
        });
        const normalizeDayNightRangeValues = dep("normalizeDayNightRangeValues", (dayStartHour, nightStartHour) => ({ dayStartHour, nightStartHour }));
        const getBuildStrictUtcDateFromParts = dep("getBuildStrictUtcDateFromParts", () => null);
        const getSetGlobalTimeState = dep("getSetGlobalTimeState", () => null);
        const setCanUseForeignObjectRendererState = dep("setCanUseForeignObjectRendererState", () => {});
        const defaultDayStartHour = Number.isFinite(safeDeps.defaultDayStartHour)
            ? safeDeps.defaultDayStartHour
            : 6;
        const defaultNightStartHour = Number.isFinite(safeDeps.defaultNightStartHour)
            ? safeDeps.defaultNightStartHour
            : 18;

        function getDayStartHourStateRef() {
            return sanitizeDayNightHourValue(getDayStartHourState(), defaultDayStartHour);
        }

        function getNightStartHourStateRef() {
            return sanitizeDayNightHourValue(getNightStartHourState(), defaultNightStartHour);
        }

        function getDayNightMarkerByHour(hour) {
            const normalized = normalizeDayNightRangeValues(getDayStartHourStateRef(), getNightStartHourStateRef());
            const numericHour = Number.parseInt(hour, 10);
            const safeHour = ((Number.isFinite(numericHour) ? numericHour : 0) % 24 + 24) % 24;
            return (safeHour >= normalized.dayStartHour && safeHour < normalized.nightStartHour) ? "DAY" : "NIGHT";
        }

        function resolveLocalDatePartsViaTimeService(date, timezone, timezoneId, fallback) {
            const timeService = getTimeService();
            if (!timeService || typeof timeService.resolveLocalDateParts !== "function") {
                return fallback;
            }
            return timeService.resolveLocalDateParts(date, timezone, timezoneId, fallback);
        }

        function buildStrictUtcDateFromPartsViaCore(parts) {
            const builder = getBuildStrictUtcDateFromParts();
            if (typeof builder !== "function") return null;
            return builder(parts);
        }

        function setGlobalTimeValue(slotIdx, value) {
            const setter = getSetGlobalTimeState();
            if (typeof setter !== "function") return;
            setter(slotIdx, value);
        }

        function createDefaultTableExportContext() {
            return {
                table: null,
                headerSelector: "#table-head th",
                rowSelector: "#clocks-container tr.time-row"
            };
        }

        function setCanUseForeignObjectRenderer(value) {
            setCanUseForeignObjectRendererState(!!value);
        }

        return Object.freeze({
            ...refs,
            getDayStartHourStateRef,
            getNightStartHourStateRef,
            getDayNightMarkerByHour,
            resolveLocalDatePartsViaTimeService,
            buildStrictUtcDateFromPartsViaCore,
            setGlobalTimeValue,
            createDefaultTableExportContext,
            setCanUseForeignObjectRenderer
        });
    }

    globalObj.GTVMainRuntimeReferenceAccessors = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

(function initGtvMainRuntimeReferenceAccessorBindings(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const { runtimeReferenceAccessorsModule, ...forwardDeps } = safeDeps;
        if (
            !runtimeReferenceAccessorsModule
            || typeof runtimeReferenceAccessorsModule.createService !== "function"
        ) {
            throw new Error("Missing required module API: GTVMainRuntimeReferenceAccessors.createService");
        }

        const runtimeReferenceAccessorsService = runtimeReferenceAccessorsModule.createService(forwardDeps);
        if (!runtimeReferenceAccessorsService || typeof runtimeReferenceAccessorsService !== "object") {
            throw new Error("Invalid runtime reference accessors service");
        }

        return Object.freeze({
            ...runtimeReferenceAccessorsService
        });
    }

    globalObj.GTVMainRuntimeReferenceAccessorBindings = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
