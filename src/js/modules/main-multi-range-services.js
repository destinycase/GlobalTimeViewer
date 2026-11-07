(function initGtvMainMultiRangeServices(globalObj) {
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

        const multiRangeRenderApi = requireCreateServiceModule(safeDeps.GTV_MULTI_RANGE_RENDER, "GTVMultiRangeRender");
        const multiRangeCopyApi = requireCreateServiceModule(safeDeps.GTV_MULTI_RANGE_COPY, "GTVMultiRangeCopy");
        const copyActionsApi = requireCreateServiceModule(safeDeps.GTV_COPY_ACTIONS, "GTVCopyActions");

        let multiRangeCopyService = null;
        const multiRangeRenderService = multiRangeRenderApi.createService({
            ...pickDeps([
                "I18N_DATA",
                "t",
                "getCurrentLang",
                "pad",
                "getDayNightMarkerByHour",
                "getCustomOffsetMinutes",
                "getFixedOffsetForDisplayAtDate",
                "normalizeCustomAbbr",
                "getZoneAbbreviation",
                "getSignedInclusiveDaySpan",
                "getSignedDurationDayHourMinute",
                "getZoneDisplayName",
                "getZoneDisplayNameForUiAtDate",
                "sanitizeMultiSubgroupName",
                "getCurrentMultiSubgroupName",
                "sanitizeMultiRangeTitle",
                "getMultiRangeTitle",
                "buildStaticRowCell",
                "buildDynamicRowCell",
                "isMultiRangeStartEditEnabled",
                "isMultiRangeEndEditEnabled",
                "handleMultiRangeTimeChange",
                "copyMultiRangeRow",
                "hideFloatingTooltip",
                "ensureMultiRangeState",
                "refreshMultiRangeControls",
                "renderMultiBulkToolSets",
                "getBaseTimezoneRef",
                "escapeHtml",
                "getDisplayColumns",
                "getRenderableTimezoneRows",
                "getMultiRanges",
                "getMultiRangeCollapsed",
                "getMultiRangeCount",
                "buildTimezoneComputedSnapshotForDates",
                "saveMultiRangeSingleImage"
            ]),
            copyWholeMultiRange: (rangeIdx) => multiRangeCopyService.copyWholeMultiRange(rangeIdx),
            ...pickDeps([
                "setMultiRangesCollapsedBelow",
                "toggleMultiRangeCollapsed",
                "renderTimeAdjustSet",
                "applyMultiRangeTimeAdjustAction",
                "attachTimeAdjustToggleLabel",
                "setMultiRangeStartEditEnabled",
                "setMultiRangeEndEditEnabled",
                "getMultiDisplayColumnHeader",
                "updateTimeAdjustPanel",
                "updateCopyFormatPreview",
                "upgradeNativeTitleTooltips"
            ])
        });

        multiRangeCopyService = multiRangeCopyApi.createService({
            ...pickDeps([
                "t",
                "showToast",
                "ensureMultiRangeState",
                "getMultiRanges",
                "getBaseTimezoneRef",
                "getRenderableTimezoneRows",
                "getTimezoneRefById",
                "buildTimezoneComputedSnapshotForRange",
                "formatSnapshotText"
            ]),
            getMultiRangeTitleText: (rangeIdx, range, baseRef) =>
                multiRangeRenderService.getMultiRangeTitleText(rangeIdx, range, baseRef),
            ...pickDeps([
                "getCopyFormatOrder",
                "getCopyFormatEnabled",
                "getCopyTimePartsEnabled",
                "writeClipboard"
            ])
        });

        const copyActionsService = copyActionsApi.createService({
            ...pickDeps([
                "t",
                "showToast",
                "isShowCopyFormat",
                "isMultiTab",
                "isFixedTimeTab",
                "ensureMultiRangeState",
                "getMultiRanges",
                "getBaseTimezoneRef",
                "buildTimezoneComputedSnapshotForRange",
                "formatSnapshotText",
                "getCopyFormatOrder",
                "getCopyFormatEnabled",
                "getCopyTimePartsEnabled",
                "getRowFormattedText",
                "getRowCopyText",
                "getFixedTimePreviewCopyText",
                "getAllFixedTimeRowsCopyText",
                "copyAllMultiRangeTimezones",
                "writeClipboard"
            ])
        });

        return Object.freeze({
            multiRangeRenderService,
            multiRangeCopyService,
            copyActionsService
        });
    }

    globalObj.GTVMainMultiRangeServices = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
