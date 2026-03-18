(function initGtvMainFixedTimeServices(globalObj) {
    "use strict";

    function requireCreateServiceModule(moduleApi, label) {
        if (!moduleApi || typeof moduleApi.createService !== "function") {
            throw new Error(`Missing required module API: ${label}.createService`);
        }
        return moduleApi;
    }

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const fixedTimeCoreApi = requireCreateServiceModule(safeDeps.GTV_FIXED_TIME_CORE, "GTVFixedTimeCore");
        const fixedTimeTimelineApi = requireCreateServiceModule(safeDeps.GTV_FIXED_TIME_TIMELINE, "GTVFixedTimeTimeline");
        const fixedTimeActionsApi = requireCreateServiceModule(safeDeps.GTV_FIXED_TIME_ACTIONS, "GTVFixedTimeActions");

        const fixedTimeCoreService = fixedTimeCoreApi.createService({
            DEFAULT_FIXED_TIME_VALUE: safeDeps.DEFAULT_FIXED_TIME_VALUE,
            I18N_DATA: safeDeps.I18N_DATA,
            t: safeDeps.t,
            getCurrentLang: safeDeps.getCurrentLang,
            sanitizeFixedTimeValue: safeDeps.sanitizeFixedTimeValue,
            getFixedOffsetForDisplayAtDate: safeDeps.getFixedOffsetForDisplayAtDate,
            getLocalPartsByTimezone: safeDeps.getLocalPartsByTimezone,
            getUTCDateFromLocalParts: safeDeps.getUTCDateFromLocalParts,
            pad: safeDeps.pad,
            sanitizeTimePartsEnabledForContext: safeDeps.sanitizeTimePartsEnabledForContext,
            getDisplayTimePartsEnabled: safeDeps.getDisplayTimePartsEnabled,
            getDefaultFixedTimeName: safeDeps.getDefaultFixedTimeName,
            sanitizeFixedTimeName: safeDeps.sanitizeFixedTimeName,
            getFixedDateParts: safeDeps.getFixedDateParts
        });

        const fixedTimeTimelineService = fixedTimeTimelineApi.createService({
            TIMELINE_TOTAL_SECONDS: safeDeps.TIMELINE_TOTAL_SECONDS,
            getCurrentGroup: safeDeps.getCurrentGroup,
            ensureGroupFixedTimes: safeDeps.ensureGroupFixedTimes,
            getGlobalTime: safeDeps.getGlobalTime,
            resolveFixedTimeSlotUtcDate: safeDeps.resolveFixedTimeSlotUtcDate,
            clampNumber: safeDeps.clampNumber,
            pad: safeDeps.pad,
            getFixedTimeSlotCount: safeDeps.getFixedTimeSlotCount,
            sanitizeFixedTimeId: safeDeps.sanitizeFixedTimeId,
            sanitizeFixedTimeName: safeDeps.sanitizeFixedTimeName,
            getDefaultFixedTimeName: safeDeps.getDefaultFixedTimeName,
            getFixedTimeSlotHeaderLabel: safeDeps.getFixedTimeSlotHeaderLabel
        });

        const fixedTimeActionsService = fixedTimeActionsApi.createService({
            DEFAULT_FIXED_TIME_VALUE: safeDeps.DEFAULT_FIXED_TIME_VALUE,
            MIN_FIXED_TIME_SLOT_COUNT: safeDeps.MIN_FIXED_TIME_SLOT_COUNT,
            t: safeDeps.t,
            sanitizeCopyFormatOrderForContext: safeDeps.sanitizeCopyFormatOrderForContext,
            sanitizeCopyFormatEnabledForContext: safeDeps.sanitizeCopyFormatEnabledForContext,
            sanitizeTimePartsEnabledForContext: safeDeps.sanitizeTimePartsEnabledForContext,
            getCopyFormatOrder: safeDeps.getCopyFormatOrder,
            getCopyFormatEnabled: safeDeps.getCopyFormatEnabled,
            getCopyTimePartsEnabled: safeDeps.getCopyTimePartsEnabled,
            buildTimezoneComputedSnapshotForDates: safeDeps.buildTimezoneComputedSnapshotForDates,
            formatSnapshotText: safeDeps.formatSnapshotText,
            getCurrentGroup: safeDeps.getCurrentGroup,
            ensureGroupFixedTimes: safeDeps.ensureGroupFixedTimes,
            getBaseTimezoneRef: safeDeps.getBaseTimezoneRef,
            getGlobalTime: safeDeps.getGlobalTime,
            resolveFixedTimeSlotUtcDate: safeDeps.resolveFixedTimeSlotUtcDate,
            getFixedTimeSlotHeaderLabel: safeDeps.getFixedTimeSlotHeaderLabel,
            getRenderableTimezoneRows: safeDeps.getRenderableTimezoneRows,
            getFixedOffsetForDisplayAtDate: safeDeps.getFixedOffsetForDisplayAtDate,
            getLocalPartsByTimezone: safeDeps.getLocalPartsByTimezone,
            getUTCDateFromLocalParts: safeDeps.getUTCDateFromLocalParts,
            parseDateTimeParts: safeDeps.parseDateTimeParts,
            pad: safeDeps.pad,
            showToast: safeDeps.showToast,
            writeClipboard: safeDeps.writeClipboard,
            buildFixedTimeDisplayPayloadAtUtc: safeDeps.buildFixedTimeDisplayPayloadAtUtc,
            renderFixedTimeTab: safeDeps.renderFixedTimeTab,
            renderTimelineFrame: safeDeps.renderTimelineFrame,
            savePersistence: safeDeps.savePersistence,
            getDefaultFixedTimeName: safeDeps.getDefaultFixedTimeName,
            sanitizeFixedTimeName: safeDeps.sanitizeFixedTimeName,
            sanitizeFixedTimeValue: safeDeps.sanitizeFixedTimeValue,
            getFixedTimeSlotCount: safeDeps.getFixedTimeSlotCount,
            setFixedTimeSlotCount: safeDeps.setFixedTimeSlotCount,
            refreshFixedTimeSlotCountControls: safeDeps.refreshFixedTimeSlotCountControls
        });

        return Object.freeze({
            fixedTimeCoreService,
            fixedTimeTimelineService,
            fixedTimeActionsService
        });
    }

    globalObj.GTVMainFixedTimeServices = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
