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

        function pickDeps(depNames = []) {
            const resolved = {};
            depNames.forEach((depName) => {
                resolved[depName] = safeDeps[depName];
            });
            return resolved;
        }

        const fixedTimeCoreApi = requireCreateServiceModule(safeDeps.GTV_FIXED_TIME_CORE, "GTVFixedTimeCore");
        const fixedTimeTimelineApi = requireCreateServiceModule(safeDeps.GTV_FIXED_TIME_TIMELINE, "GTVFixedTimeTimeline");
        const fixedTimeActionsApi = requireCreateServiceModule(safeDeps.GTV_FIXED_TIME_ACTIONS, "GTVFixedTimeActions");

        const fixedTimeCoreService = fixedTimeCoreApi.createService({
            ...pickDeps([
                "DEFAULT_FIXED_TIME_VALUE",
                "I18N_DATA",
                "t",
                "getCurrentLang",
                "sanitizeFixedTimeValue",
                "getFixedOffsetForDisplayAtDate",
                "getLocalPartsByTimezone",
                "getUTCDateFromLocalParts",
                "pad",
                "sanitizeTimePartsEnabledForContext",
                "getDisplayTimePartsEnabled",
                "getDefaultFixedTimeName",
                "sanitizeFixedTimeName",
                "getFixedDateParts",
                "getDayNightMarkerByHour"
            ])
        });

        const fixedTimeTimelineService = fixedTimeTimelineApi.createService({
            ...pickDeps([
                "TIMELINE_TOTAL_SECONDS",
                "getCurrentGroup",
                "ensureGroupFixedTimes",
                "getGlobalTime",
                "resolveFixedTimeSlotUtcDate",
                "clampNumber",
                "pad",
                "getFixedTimeSlotCount",
                "sanitizeFixedTimeId",
                "sanitizeFixedTimeName",
                "getDefaultFixedTimeName",
                "getFixedTimeSlotHeaderLabel"
            ])
        });

        const fixedTimeActionsService = fixedTimeActionsApi.createService({
            ...pickDeps([
                "DEFAULT_FIXED_TIME_VALUE",
                "MIN_FIXED_TIME_SLOT_COUNT",
                "t",
                "sanitizeCopyFormatOrderForContext",
                "sanitizeCopyFormatEnabledForContext",
                "sanitizeTimePartsEnabledForContext",
                "getCopyFormatOrder",
                "getCopyFormatEnabled",
                "getCopyTimePartsEnabled",
                "buildTimezoneComputedSnapshotForDates",
                "formatSnapshotText",
                "getCurrentGroup",
                "ensureGroupFixedTimes",
                "getBaseTimezoneRef",
                "getGlobalTime",
                "resolveFixedTimeSlotUtcDate",
                "getFixedTimeSlotHeaderLabel",
                "getRenderableTimezoneRows",
                "getFixedOffsetForDisplayAtDate",
                "getLocalPartsByTimezone",
                "getUTCDateFromLocalParts",
                "parseDateTimeParts",
                "pad",
                "showToast",
                "writeClipboard",
                "buildFixedTimeDisplayPayloadAtUtc",
                "renderFixedTimeTab",
                "renderTimelineFrame",
                "savePersistence",
                "getDefaultFixedTimeName",
                "sanitizeFixedTimeName",
                "sanitizeFixedTimeValue",
                "getFixedTimeSlotCount",
                "setFixedTimeSlotCount",
                "refreshFixedTimeSlotCountControls"
            ])
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
