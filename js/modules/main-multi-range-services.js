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
        const multiRangeRenderApi = requireCreateServiceModule(safeDeps.GTV_MULTI_RANGE_RENDER, "GTVMultiRangeRender");
        const multiRangeCopyApi = requireCreateServiceModule(safeDeps.GTV_MULTI_RANGE_COPY, "GTVMultiRangeCopy");
        const copyActionsApi = requireCreateServiceModule(safeDeps.GTV_COPY_ACTIONS, "GTVCopyActions");

        let multiRangeCopyService = null;
        const multiRangeRenderService = multiRangeRenderApi.createService({
            I18N_DATA: safeDeps.I18N_DATA,
            t: safeDeps.t,
            getCurrentLang: safeDeps.getCurrentLang,
            pad: safeDeps.pad,
            getDayNightMarkerByHour: safeDeps.getDayNightMarkerByHour,
            getCustomOffsetMinutes: safeDeps.getCustomOffsetMinutes,
            getFixedOffsetForDisplayAtDate: safeDeps.getFixedOffsetForDisplayAtDate,
            normalizeCustomAbbr: safeDeps.normalizeCustomAbbr,
            getZoneAbbreviation: safeDeps.getZoneAbbreviation,
            getSignedInclusiveDaySpan: safeDeps.getSignedInclusiveDaySpan,
            getSignedDurationDayHourMinute: safeDeps.getSignedDurationDayHourMinute,
            getZoneDisplayName: safeDeps.getZoneDisplayName,
            getZoneDisplayNameForUiAtDate: safeDeps.getZoneDisplayNameForUiAtDate,
            sanitizeMultiSubgroupName: safeDeps.sanitizeMultiSubgroupName,
            getCurrentMultiSubgroupName: safeDeps.getCurrentMultiSubgroupName,
            sanitizeMultiRangeTitle: safeDeps.sanitizeMultiRangeTitle,
            getMultiRangeTitle: safeDeps.getMultiRangeTitle,
            buildStaticRowCell: safeDeps.buildStaticRowCell,
            buildDynamicRowCell: safeDeps.buildDynamicRowCell,
            isMultiRangeStartEditEnabled: safeDeps.isMultiRangeStartEditEnabled,
            isMultiRangeEndEditEnabled: safeDeps.isMultiRangeEndEditEnabled,
            handleMultiRangeTimeChange: safeDeps.handleMultiRangeTimeChange,
            copyMultiRangeRow: safeDeps.copyMultiRangeRow,
            hideFloatingTooltip: safeDeps.hideFloatingTooltip,
            ensureMultiRangeState: safeDeps.ensureMultiRangeState,
            refreshMultiRangeControls: safeDeps.refreshMultiRangeControls,
            renderMultiBulkToolSets: safeDeps.renderMultiBulkToolSets,
            getBaseTimezoneRef: safeDeps.getBaseTimezoneRef,
            escapeHtml: safeDeps.escapeHtml,
            getDisplayColumns: safeDeps.getDisplayColumns,
            getRenderableTimezoneRows: safeDeps.getRenderableTimezoneRows,
            getMultiRanges: safeDeps.getMultiRanges,
            getMultiRangeCollapsed: safeDeps.getMultiRangeCollapsed,
            getMultiRangeCount: safeDeps.getMultiRangeCount,
            buildTimezoneComputedSnapshotForDates: safeDeps.buildTimezoneComputedSnapshotForDates,
            saveMultiRangeSingleImage: safeDeps.saveMultiRangeSingleImage,
            copyWholeMultiRange: (rangeIdx) => multiRangeCopyService.copyWholeMultiRange(rangeIdx),
            setMultiRangesCollapsedBelow: safeDeps.setMultiRangesCollapsedBelow,
            toggleMultiRangeCollapsed: safeDeps.toggleMultiRangeCollapsed,
            renderTimeAdjustSet: safeDeps.renderTimeAdjustSet,
            applyMultiRangeTimeAdjustAction: safeDeps.applyMultiRangeTimeAdjustAction,
            attachTimeAdjustToggleLabel: safeDeps.attachTimeAdjustToggleLabel,
            setMultiRangeStartEditEnabled: safeDeps.setMultiRangeStartEditEnabled,
            setMultiRangeEndEditEnabled: safeDeps.setMultiRangeEndEditEnabled,
            getMultiDisplayColumnHeader: safeDeps.getMultiDisplayColumnHeader,
            updateTimeAdjustPanel: safeDeps.updateTimeAdjustPanel,
            updateCopyFormatPreview: safeDeps.updateCopyFormatPreview,
            upgradeNativeTitleTooltips: safeDeps.upgradeNativeTitleTooltips
        });

        multiRangeCopyService = multiRangeCopyApi.createService({
            t: safeDeps.t,
            showToast: safeDeps.showToast,
            ensureMultiRangeState: safeDeps.ensureMultiRangeState,
            getMultiRanges: safeDeps.getMultiRanges,
            getBaseTimezoneRef: safeDeps.getBaseTimezoneRef,
            getRenderableTimezoneRows: safeDeps.getRenderableTimezoneRows,
            getTimezoneRefById: safeDeps.getTimezoneRefById,
            buildTimezoneComputedSnapshotForRange: safeDeps.buildTimezoneComputedSnapshotForRange,
            formatSnapshotText: safeDeps.formatSnapshotText,
            getMultiRangeTitleText: (rangeIdx, range, baseRef) =>
                multiRangeRenderService.getMultiRangeTitleText(rangeIdx, range, baseRef),
            getCopyFormatOrder: safeDeps.getCopyFormatOrder,
            getCopyFormatEnabled: safeDeps.getCopyFormatEnabled,
            getCopyTimePartsEnabled: safeDeps.getCopyTimePartsEnabled,
            writeClipboard: safeDeps.writeClipboard
        });

        const copyActionsService = copyActionsApi.createService({
            t: safeDeps.t,
            showToast: safeDeps.showToast,
            isShowCopyFormat: safeDeps.isShowCopyFormat,
            isMultiTab: safeDeps.isMultiTab,
            isFixedTimeTab: safeDeps.isFixedTimeTab,
            ensureMultiRangeState: safeDeps.ensureMultiRangeState,
            getMultiRanges: safeDeps.getMultiRanges,
            getBaseTimezoneRef: safeDeps.getBaseTimezoneRef,
            buildTimezoneComputedSnapshotForRange: safeDeps.buildTimezoneComputedSnapshotForRange,
            formatSnapshotText: safeDeps.formatSnapshotText,
            getCopyFormatOrder: safeDeps.getCopyFormatOrder,
            getCopyFormatEnabled: safeDeps.getCopyFormatEnabled,
            getCopyTimePartsEnabled: safeDeps.getCopyTimePartsEnabled,
            getRowFormattedText: safeDeps.getRowFormattedText,
            getRowCopyText: safeDeps.getRowCopyText,
            getFixedTimePreviewCopyText: safeDeps.getFixedTimePreviewCopyText,
            getAllFixedTimeRowsCopyText: safeDeps.getAllFixedTimeRowsCopyText,
            copyAllMultiRangeTimezones: safeDeps.copyAllMultiRangeTimezones,
            writeClipboard: safeDeps.writeClipboard
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
