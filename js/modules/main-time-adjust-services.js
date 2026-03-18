(function initGtvMainTimeAdjustServices(globalObj) {
    "use strict";

    function requireCreateServiceModule(moduleApi, label) {
        if (!moduleApi || typeof moduleApi.createService !== "function") {
            throw new Error(`Missing required module API: ${label}.createService`);
        }
        return moduleApi;
    }

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const timeAdjustUiApi = requireCreateServiceModule(safeDeps.GTV_TIME_ADJUST_UI, "GTVTimeAdjustUI");
        const multiBulkToolsApi = requireCreateServiceModule(safeDeps.GTV_MULTI_BULK_TOOLS, "GTVMultiBulkTools");
        const timeAdjustActionsApi = requireCreateServiceModule(safeDeps.GTV_TIME_ADJUST_ACTIONS, "GTVTimeAdjustActions");

        const timeAdjustUiService = timeAdjustUiApi.createService({
            MIN_TIME_ADJUST_DAY_STEP: safeDeps.MIN_TIME_ADJUST_DAY_STEP,
            MAX_TIME_ADJUST_DAY_STEP: safeDeps.MAX_TIME_ADJUST_DAY_STEP,
            DEFAULT_TIME_ADJUST_DAY_STEP: safeDeps.DEFAULT_TIME_ADJUST_DAY_STEP,
            t: safeDeps.t,
            savePersistence: safeDeps.savePersistence,
            applyTimeAdjustAction: safeDeps.applyTimeAdjustAction,
            getCurrentMainTab: safeDeps.getCurrentMainTab,
            isRealtime: safeDeps.isRealtime,
            getSlotCount: safeDeps.getSlotCount,
            getTimeAdjustDayStepValue: safeDeps.getTimeAdjustDayStepValue,
            setTimeAdjustDayStepValue: safeDeps.setTimeAdjustDayStepValue,
            upgradeNativeTitleTooltips: safeDeps.upgradeNativeTitleTooltips
        });

        const multiBulkToolsService = multiBulkToolsApi.createService({
            t: safeDeps.t,
            getMultiRangeCount: safeDeps.getMultiRangeCount,
            renderTimeAdjustSet: (slotIdx, options = {}) => timeAdjustUiService.renderTimeAdjustSet(slotIdx, options),
            createTimeAdjustActionButton: (labelKey, slotIdx, action, onAction = null, disabled = false) =>
                timeAdjustUiService.createTimeAdjustActionButton(labelKey, slotIdx, action, onAction, disabled),
            createTimeAdjustDivider: () => timeAdjustUiService.createTimeAdjustDivider(),
            applyBulkRangeAllAction: safeDeps.applyBulkRangeAllAction,
            applyFirstRangeStartAdjustAction: safeDeps.applyFirstRangeStartAdjustAction,
            setAllMultiRangeStartEditEnabled: safeDeps.setAllMultiRangeStartEditEnabled,
            setAllMultiRangeEndEditEnabled: safeDeps.setAllMultiRangeEndEditEnabled,
            upgradeNativeTitleTooltips: safeDeps.upgradeNativeTitleTooltips
        });

        const timeAdjustActionsService = timeAdjustActionsApi.createService({
            isRealtime: safeDeps.isRealtime,
            getGlobalTimes: safeDeps.getGlobalTimes,
            updateClocks: safeDeps.updateClocks,
            getBaseTimezoneRef: safeDeps.getBaseTimezoneRef,
            getFixedOffsetForDisplay: safeDeps.getFixedOffsetForDisplay,
            getFixedOffsetForDisplayAtDate: safeDeps.getFixedOffsetForDisplayAtDate,
            getCustomOffsetMinutes: safeDeps.getCustomOffsetMinutes,
            getTimeAdjustDayStep: safeDeps.getTimeAdjustDayStep,
            timeService: safeDeps.timeService,
            sanitizeUtcMs: safeDeps.sanitizeUtcMs,
            ensureMultiRangeState: safeDeps.ensureMultiRangeState,
            getMultiRanges: safeDeps.getMultiRanges,
            isMultiRangeStartLinked: safeDeps.isMultiRangeStartLinked,
            isMultiTab: safeDeps.isMultiTab,
            renderMultiRanges: safeDeps.renderMultiRanges,
            savePersistence: safeDeps.savePersistenceForce,
            isMultiRangeStartEditEnabled: safeDeps.isMultiRangeStartEditEnabled,
            isMultiRangeEndEditEnabled: safeDeps.isMultiRangeEndEditEnabled,
            syncLinkedRangesFrom: safeDeps.syncLinkedRangesFrom,
            getMultiRangeSlotDate: safeDeps.getMultiRangeSlotDate,
            setMultiRangeSlotDate: safeDeps.setMultiRangeSlotDate,
            syncFollowingRangesByDuration: safeDeps.syncFollowingRangesByDuration,
            syncMultiRangeStartLinks: safeDeps.syncMultiRangeStartLinks
        });

        return Object.freeze({
            timeAdjustUiService,
            multiBulkToolsService,
            timeAdjustActionsService
        });
    }

    globalObj.GTVMainTimeAdjustServices = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
