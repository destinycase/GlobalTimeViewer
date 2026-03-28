(function initGtvMainRuntimeReferenceAccessors(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const getRenderList = (typeof safeDeps.getRenderList === "function")
            ? safeDeps.getRenderList
            : (() => undefined);
        const getSanitizeCopyFormatOrderForContext = (typeof safeDeps.getSanitizeCopyFormatOrderForContext === "function")
            ? safeDeps.getSanitizeCopyFormatOrderForContext
            : (() => undefined);
        const getSanitizeCopyFormatEnabledForContext = (typeof safeDeps.getSanitizeCopyFormatEnabledForContext === "function")
            ? safeDeps.getSanitizeCopyFormatEnabledForContext
            : (() => undefined);
        const getSanitizeTimePartsEnabledForContext = (typeof safeDeps.getSanitizeTimePartsEnabledForContext === "function")
            ? safeDeps.getSanitizeTimePartsEnabledForContext
            : (() => undefined);
        const getShowToast = (typeof safeDeps.getShowToast === "function")
            ? safeDeps.getShowToast
            : (() => undefined);
        const getRenderTimelineFrame = (typeof safeDeps.getRenderTimelineFrame === "function")
            ? safeDeps.getRenderTimelineFrame
            : (() => undefined);
        const getUpdateClocks = (typeof safeDeps.getUpdateClocks === "function")
            ? safeDeps.getUpdateClocks
            : (() => undefined);
        const getTranslator = (typeof safeDeps.getTranslator === "function")
            ? safeDeps.getTranslator
            : (() => ((key) => String(key ?? "")));
        const getSavePersistenceSafely = (typeof safeDeps.getSavePersistenceSafely === "function")
            ? safeDeps.getSavePersistenceSafely
            : (() => undefined);
        const getRenderFixedTimeTab = (typeof safeDeps.getRenderFixedTimeTab === "function")
            ? safeDeps.getRenderFixedTimeTab
            : (() => undefined);
        const getRefreshFixedTimeSlotCountControls = (typeof safeDeps.getRefreshFixedTimeSlotCountControls === "function")
            ? safeDeps.getRefreshFixedTimeSlotCountControls
            : (() => undefined);
        const getAppStatePatcherService = (typeof safeDeps.getAppStatePatcherService === "function")
            ? safeDeps.getAppStatePatcherService
            : (() => null);
        const getAppPersistenceStateService = (typeof safeDeps.getAppPersistenceStateService === "function")
            ? safeDeps.getAppPersistenceStateService
            : (() => null);
        const getMainTimezoneRuntimeBridgeService = (typeof safeDeps.getMainTimezoneRuntimeBridgeService === "function")
            ? safeDeps.getMainTimezoneRuntimeBridgeService
            : (() => null);
        const getMainTimezoneRuntimeService = (typeof safeDeps.getMainTimezoneRuntimeService === "function")
            ? safeDeps.getMainTimezoneRuntimeService
            : (() => null);
        const getMainBaseTimezoneService = (typeof safeDeps.getMainBaseTimezoneService === "function")
            ? safeDeps.getMainBaseTimezoneService
            : (() => null);
        const getMainTimezoneMutationService = (typeof safeDeps.getMainTimezoneMutationService === "function")
            ? safeDeps.getMainTimezoneMutationService
            : (() => null);
        const getZoneMap = (typeof safeDeps.getZoneMap === "function")
            ? safeDeps.getZoneMap
            : (() => ({}));
        const getTzDatabase = (typeof safeDeps.getTzDatabase === "function")
            ? safeDeps.getTzDatabase
            : (() => []);
        const getTimeService = (typeof safeDeps.getTimeService === "function")
            ? safeDeps.getTimeService
            : (() => null);
        const getRuntimeRandom = (typeof safeDeps.getRuntimeRandom === "function")
            ? safeDeps.getRuntimeRandom
            : (() => Math.random());
        const getGroupStateService = (typeof safeDeps.getGroupStateService === "function")
            ? safeDeps.getGroupStateService
            : (() => null);
        const getTimeAdjustActionsService = (typeof safeDeps.getTimeAdjustActionsService === "function")
            ? safeDeps.getTimeAdjustActionsService
            : (() => null);
        const getMultiBulkToolsService = (typeof safeDeps.getMultiBulkToolsService === "function")
            ? safeDeps.getMultiBulkToolsService
            : (() => null);
        const getFixedTimeTableService = (typeof safeDeps.getFixedTimeTableService === "function")
            ? safeDeps.getFixedTimeTableService
            : (() => null);
        const invokeRenderBaseTimeSelect = (typeof safeDeps.invokeRenderBaseTimeSelect === "function")
            ? safeDeps.invokeRenderBaseTimeSelect
            : (() => undefined);
        const getMultiRangeCopyService = (typeof safeDeps.getMultiRangeCopyService === "function")
            ? safeDeps.getMultiRangeCopyService
            : (() => null);
        const getMultiStateService = (typeof safeDeps.getMultiStateService === "function")
            ? safeDeps.getMultiStateService
            : (() => null);
        const getMainClockOrchestratorService = (typeof safeDeps.getMainClockOrchestratorService === "function")
            ? safeDeps.getMainClockOrchestratorService
            : (() => null);
        const getMainPersistenceSnapshotService = (typeof safeDeps.getMainPersistenceSnapshotService === "function")
            ? safeDeps.getMainPersistenceSnapshotService
            : (() => null);
        const getFixedTimeCoreService = (typeof safeDeps.getFixedTimeCoreService === "function")
            ? safeDeps.getFixedTimeCoreService
            : (() => null);
        const getFixedTimeActionsService = (typeof safeDeps.getFixedTimeActionsService === "function")
            ? safeDeps.getFixedTimeActionsService
            : (() => null);
        const getTimelineFrameService = (typeof safeDeps.getTimelineFrameService === "function")
            ? safeDeps.getTimelineFrameService
            : (() => null);
        const getFixedTimeTimelineService = (typeof safeDeps.getFixedTimeTimelineService === "function")
            ? safeDeps.getFixedTimeTimelineService
            : (() => null);
        const getShowTimelineState = (typeof safeDeps.getShowTimelineState === "function")
            ? safeDeps.getShowTimelineState
            : (() => false);
        const getDisplayFormatOrderState = (typeof safeDeps.getDisplayFormatOrderState === "function")
            ? safeDeps.getDisplayFormatOrderState
            : (() => []);
        const getDisplayFormatEnabledState = (typeof safeDeps.getDisplayFormatEnabledState === "function")
            ? safeDeps.getDisplayFormatEnabledState
            : (() => ({}));
        const getDisplayTimePartsEnabledState = (typeof safeDeps.getDisplayTimePartsEnabledState === "function")
            ? safeDeps.getDisplayTimePartsEnabledState
            : (() => ({}));
        const getCopyFormatOrderState = (typeof safeDeps.getCopyFormatOrderState === "function")
            ? safeDeps.getCopyFormatOrderState
            : (() => []);
        const getCopyFormatEnabledState = (typeof safeDeps.getCopyFormatEnabledState === "function")
            ? safeDeps.getCopyFormatEnabledState
            : (() => ({}));
        const getCopyTimePartsEnabledState = (typeof safeDeps.getCopyTimePartsEnabledState === "function")
            ? safeDeps.getCopyTimePartsEnabledState
            : (() => ({}));
        const getFormatProfilesState = (typeof safeDeps.getFormatProfilesState === "function")
            ? safeDeps.getFormatProfilesState
            : (() => ({}));
        const getActiveFormatProfileContextState = (typeof safeDeps.getActiveFormatProfileContextState === "function")
            ? safeDeps.getActiveFormatProfileContextState
            : (() => "live");
        const getCurrentThemeState = (typeof safeDeps.getCurrentThemeState === "function")
            ? safeDeps.getCurrentThemeState
            : (() => "dark");
        const getDayStartHourState = (typeof safeDeps.getDayStartHourState === "function")
            ? safeDeps.getDayStartHourState
            : (() => 6);
        const getNightStartHourState = (typeof safeDeps.getNightStartHourState === "function")
            ? safeDeps.getNightStartHourState
            : (() => 18);
        const sanitizeDayNightHourValue = (typeof safeDeps.sanitizeDayNightHourValue === "function")
            ? safeDeps.sanitizeDayNightHourValue
            : ((value, fallbackHour = 6) => {
                const parsed = Number.parseInt(value, 10);
                return Number.isFinite(parsed) ? parsed : fallbackHour;
            });
        const normalizeDayNightRangeValues = (typeof safeDeps.normalizeDayNightRangeValues === "function")
            ? safeDeps.normalizeDayNightRangeValues
            : ((dayStartHour, nightStartHour) => ({ dayStartHour, nightStartHour }));
        const defaultDayStartHour = Number.isFinite(safeDeps.defaultDayStartHour)
            ? safeDeps.defaultDayStartHour
            : 6;
        const defaultNightStartHour = Number.isFinite(safeDeps.defaultNightStartHour)
            ? safeDeps.defaultNightStartHour
            : 18;
        const getRuntimeCurrentLangValue = (typeof safeDeps.getRuntimeCurrentLangValue === "function")
            ? safeDeps.getRuntimeCurrentLangValue
            : (() => "ko");
        const getBuildStrictUtcDateFromParts = (typeof safeDeps.getBuildStrictUtcDateFromParts === "function")
            ? safeDeps.getBuildStrictUtcDateFromParts
            : (() => null);
        const getSetGlobalTimeState = (typeof safeDeps.getSetGlobalTimeState === "function")
            ? safeDeps.getSetGlobalTimeState
            : (() => null);
        const getSnapshotFormatService = (typeof safeDeps.getSnapshotFormatService === "function")
            ? safeDeps.getSnapshotFormatService
            : (() => null);
        const getI18nData = (typeof safeDeps.getI18nData === "function")
            ? safeDeps.getI18nData
            : (() => ({ ko: {}, en: {} }));
        const getImageExportBridgeService = (typeof safeDeps.getImageExportBridgeService === "function")
            ? safeDeps.getImageExportBridgeService
            : (() => null);
        const getCanUseForeignObjectRendererState = (typeof safeDeps.getCanUseForeignObjectRendererState === "function")
            ? safeDeps.getCanUseForeignObjectRendererState
            : (() => false);
        const setCanUseForeignObjectRendererState = (typeof safeDeps.setCanUseForeignObjectRendererState === "function")
            ? safeDeps.setCanUseForeignObjectRendererState
            : (() => { });
        const getImageExportActionsService = (typeof safeDeps.getImageExportActionsService === "function")
            ? safeDeps.getImageExportActionsService
            : (() => null);
        const getImageExportNamingService = (typeof safeDeps.getImageExportNamingService === "function")
            ? safeDeps.getImageExportNamingService
            : (() => null);
        const getPersistenceService = (typeof safeDeps.getPersistenceService === "function")
            ? safeDeps.getPersistenceService
            : (() => null);
        const getTableRenderService = (typeof safeDeps.getTableRenderService === "function")
            ? safeDeps.getTableRenderService
            : (() => null);
        const getCopyActionsService = (typeof safeDeps.getCopyActionsService === "function")
            ? safeDeps.getCopyActionsService
            : (() => null);
        const getTimeAdjustUiService = (typeof safeDeps.getTimeAdjustUiService === "function")
            ? safeDeps.getTimeAdjustUiService
            : (() => null);
        const getMultiRangeRenderService = (typeof safeDeps.getMultiRangeRenderService === "function")
            ? safeDeps.getMultiRangeRenderService
            : (() => null);
        const getFormatControlsService = (typeof safeDeps.getFormatControlsService === "function")
            ? safeDeps.getFormatControlsService
            : (() => null);
        const getTabUiService = (typeof safeDeps.getTabUiService === "function")
            ? safeDeps.getTabUiService
            : (() => null);
        const getUiSettingsActionsService = (typeof safeDeps.getUiSettingsActionsService === "function")
            ? safeDeps.getUiSettingsActionsService
            : (() => null);
        const getTimezoneSearchService = (typeof safeDeps.getTimezoneSearchService === "function")
            ? safeDeps.getTimezoneSearchService
            : (() => null);
        const getGroupTabsService = (typeof safeDeps.getGroupTabsService === "function")
            ? safeDeps.getGroupTabsService
            : (() => null);
        const getMainUiInitService = (typeof safeDeps.getMainUiInitService === "function")
            ? safeDeps.getMainUiInitService
            : (() => null);
        const getTimerEngineService = (typeof safeDeps.getTimerEngineService === "function")
            ? safeDeps.getTimerEngineService
            : (() => null);
        const getTimeCore = (typeof safeDeps.getTimeCore === "function")
            ? safeDeps.getTimeCore
            : (() => null);
        const getMainTimezoneFacadeService = (typeof safeDeps.getMainTimezoneFacadeService === "function")
            ? safeDeps.getMainTimezoneFacadeService
            : (() => null);
        const getMainTimeAdjustFacadeService = (typeof safeDeps.getMainTimeAdjustFacadeService === "function")
            ? safeDeps.getMainTimeAdjustFacadeService
            : (() => null);
        const getMainTimezoneTableFacadeService = (typeof safeDeps.getMainTimezoneTableFacadeService === "function")
            ? safeDeps.getMainTimezoneTableFacadeService
            : (() => null);
        const getMainTimelineFacadeService = (typeof safeDeps.getMainTimelineFacadeService === "function")
            ? safeDeps.getMainTimelineFacadeService
            : (() => null);
        const getMainFixedTimeFacadeService = (typeof safeDeps.getMainFixedTimeFacadeService === "function")
            ? safeDeps.getMainFixedTimeFacadeService
            : (() => null);
        const getMainFixedTimeTabFacadeService = (typeof safeDeps.getMainFixedTimeTabFacadeService === "function")
            ? safeDeps.getMainFixedTimeTabFacadeService
            : (() => null);
        const getMainMultiRangeTabFacadeService = (typeof safeDeps.getMainMultiRangeTabFacadeService === "function")
            ? safeDeps.getMainMultiRangeTabFacadeService
            : (() => null);
        const getMainFoundationServices = (typeof safeDeps.getMainFoundationServices === "function")
            ? safeDeps.getMainFoundationServices
            : (() => null);

        function getRenderListRef() {
            return getRenderList();
        }

        function getSanitizeCopyFormatOrderForContextRef() {
            return getSanitizeCopyFormatOrderForContext();
        }

        function getSanitizeCopyFormatEnabledForContextRef() {
            return getSanitizeCopyFormatEnabledForContext();
        }

        function getSanitizeTimePartsEnabledForContextRef() {
            return getSanitizeTimePartsEnabledForContext();
        }

        function getShowToastRef() {
            return getShowToast();
        }

        function getRenderTimelineFrameRef() {
            return getRenderTimelineFrame();
        }

        function getUpdateClocksRef() {
            return getUpdateClocks();
        }

        function getTranslatorRef() {
            return getTranslator();
        }

        function getSavePersistenceSafelyRef() {
            return getSavePersistenceSafely();
        }

        function getRenderFixedTimeTabRef() {
            return getRenderFixedTimeTab();
        }

        function getRefreshFixedTimeSlotCountControlsRef() {
            return getRefreshFixedTimeSlotCountControls();
        }

        function getAppStatePatcherServiceRef() {
            return getAppStatePatcherService();
        }

        function getAppPersistenceStateServiceRef() {
            return getAppPersistenceStateService();
        }

        function getMainTimezoneRuntimeBridgeServiceRef() {
            return getMainTimezoneRuntimeBridgeService();
        }

        function getMainTimezoneRuntimeServiceRef() {
            return getMainTimezoneRuntimeService();
        }

        function getMainBaseTimezoneServiceRef() {
            return getMainBaseTimezoneService();
        }

        function getMainTimezoneMutationServiceRef() {
            return getMainTimezoneMutationService();
        }

        function getZoneMapRef() {
            return getZoneMap();
        }

        function getTzDatabaseRef() {
            return getTzDatabase();
        }

        function getTimeServiceRef() {
            return getTimeService();
        }

        function getRandomValue() {
            return getRuntimeRandom();
        }

        function getGroupStateServiceRef() {
            return getGroupStateService();
        }

        function getTimeAdjustActionsServiceRef() {
            return getTimeAdjustActionsService();
        }

        function getMultiBulkToolsServiceRef() {
            return getMultiBulkToolsService();
        }

        function getFixedTimeTableServiceRef() {
            return getFixedTimeTableService();
        }

        function invokeRenderBaseTimeSelectRef() {
            return invokeRenderBaseTimeSelect();
        }

        function getMultiRangeCopyServiceRef() {
            return getMultiRangeCopyService();
        }

        function getMultiStateServiceRef() {
            return getMultiStateService();
        }

        function getMainClockOrchestratorServiceRef() {
            return getMainClockOrchestratorService();
        }

        function getMainPersistenceSnapshotServiceRef() {
            return getMainPersistenceSnapshotService();
        }

        function getFixedTimeCoreServiceRef() {
            return getFixedTimeCoreService();
        }

        function getFixedTimeActionsServiceRef() {
            return getFixedTimeActionsService();
        }

        function getTimelineFrameServiceRef() {
            return getTimelineFrameService();
        }

        function getFixedTimeTimelineServiceRef() {
            return getFixedTimeTimelineService();
        }

        function getShowTimelineStateRef() {
            return getShowTimelineState();
        }

        function getDisplayFormatOrderStateRef() {
            return getDisplayFormatOrderState();
        }

        function getDisplayFormatEnabledStateRef() {
            return getDisplayFormatEnabledState();
        }

        function getDisplayTimePartsEnabledStateRef() {
            return getDisplayTimePartsEnabledState();
        }

        function getCopyFormatOrderStateRef() {
            return getCopyFormatOrderState();
        }

        function getCopyFormatEnabledStateRef() {
            return getCopyFormatEnabledState();
        }

        function getCopyTimePartsEnabledStateRef() {
            return getCopyTimePartsEnabledState();
        }

        function getFormatProfilesStateRef() {
            return getFormatProfilesState();
        }

        function getActiveFormatProfileContextStateRef() {
            return getActiveFormatProfileContextState();
        }

        function getCurrentThemeStateRef() {
            return getCurrentThemeState();
        }

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

        function getCurrentLangStateRef() {
            return getRuntimeCurrentLangValue();
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

        function getSnapshotFormatServiceRef() {
            return getSnapshotFormatService();
        }

        function getI18nDataRef() {
            return getI18nData();
        }

        function getImageExportBridgeServiceRef() {
            return getImageExportBridgeService();
        }

        function createDefaultTableExportContext() {
            return {
                table: null,
                headerSelector: "#table-head th",
                rowSelector: "#clocks-container tr.time-row"
            };
        }

        function getCanUseForeignObjectRendererRef() {
            return getCanUseForeignObjectRendererState();
        }

        function setCanUseForeignObjectRenderer(value) {
            setCanUseForeignObjectRendererState(!!value);
        }

        function getImageExportActionsServiceRef() {
            return getImageExportActionsService();
        }

        function getImageExportNamingServiceRef() {
            return getImageExportNamingService();
        }

        function getPersistenceServiceRef() {
            return getPersistenceService();
        }

        function getTableRenderServiceRef() {
            return getTableRenderService();
        }

        function getCopyActionsServiceRef() {
            return getCopyActionsService();
        }

        function getTimeAdjustUiServiceRef() {
            return getTimeAdjustUiService();
        }

        function getMultiRangeRenderServiceRef() {
            return getMultiRangeRenderService();
        }

        function getFormatControlsServiceRef() {
            return getFormatControlsService();
        }

        function getTabUiServiceRef() {
            return getTabUiService();
        }

        function getUiSettingsActionsServiceRef() {
            return getUiSettingsActionsService();
        }

        function getTimezoneSearchServiceRef() {
            return getTimezoneSearchService();
        }

        function getGroupTabsServiceRef() {
            return getGroupTabsService();
        }

        function getMainUiInitServiceRef() {
            return getMainUiInitService();
        }

        function getTimerEngineServiceRef() {
            return getTimerEngineService();
        }

        function getTimeCoreRef() {
            return getTimeCore();
        }

        function getMainTimezoneFacadeServiceRef() {
            return getMainTimezoneFacadeService();
        }

        function getMainTimeAdjustFacadeServiceRef() {
            return getMainTimeAdjustFacadeService();
        }

        function getMainTimezoneTableFacadeServiceRef() {
            return getMainTimezoneTableFacadeService();
        }

        function getMainTimelineFacadeServiceRef() {
            return getMainTimelineFacadeService();
        }

        function getMainFixedTimeFacadeServiceRef() {
            return getMainFixedTimeFacadeService();
        }

        function getMainFixedTimeTabFacadeServiceRef() {
            return getMainFixedTimeTabFacadeService();
        }

        function getMainMultiRangeTabFacadeServiceRef() {
            return getMainMultiRangeTabFacadeService();
        }

        function getMainFoundationServicesRef() {
            return getMainFoundationServices();
        }

        return Object.freeze({
            getRenderListRef,
            getSanitizeCopyFormatOrderForContextRef,
            getSanitizeCopyFormatEnabledForContextRef,
            getSanitizeTimePartsEnabledForContextRef,
            getShowToastRef,
            getRenderTimelineFrameRef,
            getUpdateClocksRef,
            getTranslatorRef,
            getSavePersistenceSafelyRef,
            getRenderFixedTimeTabRef,
            getRefreshFixedTimeSlotCountControlsRef,
            getAppStatePatcherServiceRef,
            getAppPersistenceStateServiceRef,
            getMainTimezoneRuntimeBridgeServiceRef,
            getMainTimezoneRuntimeServiceRef,
            getMainBaseTimezoneServiceRef,
            getMainTimezoneMutationServiceRef,
            getZoneMapRef,
            getTzDatabaseRef,
            getTimeServiceRef,
            getRandomValue,
            getGroupStateServiceRef,
            getTimeAdjustActionsServiceRef,
            getMultiBulkToolsServiceRef,
            getFixedTimeTableServiceRef,
            invokeRenderBaseTimeSelect: invokeRenderBaseTimeSelectRef,
            getMultiRangeCopyServiceRef,
            getMultiStateServiceRef,
            getMainClockOrchestratorServiceRef,
            getMainPersistenceSnapshotServiceRef,
            getFixedTimeCoreServiceRef,
            getFixedTimeActionsServiceRef,
            getTimelineFrameServiceRef,
            getFixedTimeTimelineServiceRef,
            getShowTimelineStateRef,
            getDisplayFormatOrderStateRef,
            getDisplayFormatEnabledStateRef,
            getDisplayTimePartsEnabledStateRef,
            getCopyFormatOrderStateRef,
            getCopyFormatEnabledStateRef,
            getCopyTimePartsEnabledStateRef,
            getFormatProfilesStateRef,
            getActiveFormatProfileContextStateRef,
            getCurrentThemeStateRef,
            getDayStartHourStateRef,
            getNightStartHourStateRef,
            getDayNightMarkerByHour,
            getCurrentLangStateRef,
            resolveLocalDatePartsViaTimeService,
            buildStrictUtcDateFromPartsViaCore,
            setGlobalTimeValue,
            getSnapshotFormatServiceRef,
            getI18nDataRef,
            getImageExportBridgeServiceRef,
            createDefaultTableExportContext,
            getCanUseForeignObjectRendererRef,
            setCanUseForeignObjectRenderer,
            getImageExportActionsServiceRef,
            getImageExportNamingServiceRef,
            getPersistenceServiceRef,
            getTableRenderServiceRef,
            getCopyActionsServiceRef,
            getTimeAdjustUiServiceRef,
            getMultiRangeRenderServiceRef,
            getFormatControlsServiceRef,
            getTabUiServiceRef,
            getUiSettingsActionsServiceRef,
            getTimezoneSearchServiceRef,
            getGroupTabsServiceRef,
            getMainUiInitServiceRef,
            getTimerEngineServiceRef,
            getTimeCoreRef,
            getMainTimezoneFacadeServiceRef,
            getMainTimeAdjustFacadeServiceRef,
            getMainTimezoneTableFacadeServiceRef,
            getMainTimelineFacadeServiceRef,
            getMainFixedTimeFacadeServiceRef,
            getMainFixedTimeTabFacadeServiceRef,
            getMainMultiRangeTabFacadeServiceRef,
            getMainFoundationServicesRef
        });
    }

    globalObj.GTVMainRuntimeReferenceAccessors = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
