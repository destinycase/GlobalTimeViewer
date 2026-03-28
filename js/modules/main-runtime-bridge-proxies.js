(function initGtvMainRuntimeBridgeProxies(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const callServiceMethod = (typeof safeDeps.callServiceMethod === "function")
            ? safeDeps.callServiceMethod
            : (() => undefined);
        const getMainSharedUtilsService = (typeof safeDeps.getMainSharedUtilsService === "function")
            ? safeDeps.getMainSharedUtilsService
            : (() => null);
        const getTableRenderService = (typeof safeDeps.getTableRenderService === "function")
            ? safeDeps.getTableRenderService
            : (() => null);
        const getSnapshotFormatService = (typeof safeDeps.getSnapshotFormatService === "function")
            ? safeDeps.getSnapshotFormatService
            : (() => null);
        const getTimezoneSearchService = (typeof safeDeps.getTimezoneSearchService === "function")
            ? safeDeps.getTimezoneSearchService
            : (() => null);
        const getMultiStateService = (typeof safeDeps.getMultiStateService === "function")
            ? safeDeps.getMultiStateService
            : (() => null);
        const getTimeService = (typeof safeDeps.getTimeService === "function")
            ? safeDeps.getTimeService
            : (() => null);
        const getMultiRangeRenderService = (typeof safeDeps.getMultiRangeRenderService === "function")
            ? safeDeps.getMultiRangeRenderService
            : (() => null);
        const getPatchedCopyFormatOrderState = (typeof safeDeps.getPatchedCopyFormatOrderState === "function")
            ? safeDeps.getPatchedCopyFormatOrderState
            : (() => []);
        const getPatchedCopyFormatEnabledState = (typeof safeDeps.getPatchedCopyFormatEnabledState === "function")
            ? safeDeps.getPatchedCopyFormatEnabledState
            : (() => ({}));
        const getPatchedCopyTimePartsEnabledState = (typeof safeDeps.getPatchedCopyTimePartsEnabledState === "function")
            ? safeDeps.getPatchedCopyTimePartsEnabledState
            : (() => ({}));
        const defaultCopyTimePartsEnabled = (safeDeps.defaultCopyTimePartsEnabled && typeof safeDeps.defaultCopyTimePartsEnabled === "object")
            ? safeDeps.defaultCopyTimePartsEnabled
            : {};
        const applyMultiRangeTimeAdjustAction = (typeof safeDeps.applyMultiRangeTimeAdjustAction === "function")
            ? safeDeps.applyMultiRangeTimeAdjustAction
            : (() => undefined);

        function getSignedInclusiveDaySpan(a, b) {
            return getTimeService().getDaySpan(a, b);
        }

        function escapeHtmlViaSharedUtils(value) {
            return getMainSharedUtilsService().escapeHtml(value);
        }

        function getRenderableTimezoneRowsFromTableRender(baseRef) {
            return callServiceMethod(
                "tableRenderService",
                getTableRenderService(),
                "getRenderableTimezoneRows",
                [baseRef],
                { fallback: [] }
            );
        }

        function getMultiDisplayColumnHeaderFromTableRender(colKey) {
            return callServiceMethod(
                "tableRenderService",
                getTableRenderService(),
                "getMultiDisplayColumnHeader",
                [colKey],
                { fallback: "" }
            );
        }

        function getTimezoneRefByIdFromSnapshotService(id) {
            return getSnapshotFormatService().getTimezoneRefById(id);
        }

        function normalizeZoneAbbreviationViaSearch(value) {
            return getTimezoneSearchService().normalizeZoneAbbreviation(value);
        }

        function getDefaultMultiSubgroupNameViaState(index = 0) {
            return callServiceMethod(
                "multiStateService",
                getMultiStateService(),
                "getDefaultMultiSubgroupName",
                [index],
                { fallback: "" }
            );
        }

        function sanitizeMultiSubgroupIdViaState(value) {
            return callServiceMethod(
                "multiStateService",
                getMultiStateService(),
                "sanitizeMultiSubgroupId",
                [value],
                { fallback: value }
            );
        }

        function getMultiRangeTitleTextFromRenderService(rangeIdx, range, baseRef) {
            return callServiceMethod(
                "multiRangeRenderService",
                getMultiRangeRenderService(),
                "getMultiRangeTitleText",
                [rangeIdx, range, baseRef],
                { fallback: "" }
            );
        }

        function buildTimezoneComputedSnapshotForDatesViaSnapshotService(tz, slotDates, options = {}) {
            return getSnapshotFormatService().buildTimezoneComputedSnapshotForDates(tz, slotDates, options);
        }

        function formatSnapshotTextViaSnapshotService(snapshot, order, enabled, timePartsEnabled) {
            return getSnapshotFormatService().formatSnapshotText(snapshot, order, enabled, timePartsEnabled);
        }

        function sanitizeMultiSubgroupNameViaState(value, fallback = "") {
            return callServiceMethod(
                "multiStateService",
                getMultiStateService(),
                "sanitizeMultiSubgroupName",
                [value, fallback],
                { fallback }
            );
        }

        function sanitizeMultiSubgroupNameForExport(value, fallback = "subgroup") {
            return callServiceMethod(
                "multiStateService",
                getMultiStateService(),
                "sanitizeMultiSubgroupName",
                [value, fallback],
                { fallback }
            );
        }

        function buildStaticRowCellFromTableRender(colKey, slotCountToRender, zoneNameHtml = "") {
            return callServiceMethod(
                "tableRenderService",
                getTableRenderService(),
                "buildStaticRowCell",
                [colKey, slotCountToRender, zoneNameHtml],
                { fallback: "" }
            );
        }

        function buildDynamicRowCellFromTableRender(colKey, slotCountToRender) {
            return callServiceMethod(
                "tableRenderService",
                getTableRenderService(),
                "buildDynamicRowCell",
                [colKey, slotCountToRender],
                { fallback: "" }
            );
        }

        function getRowFormattedTextViaSnapshotService(
            rowOrId,
            order,
            enabled,
            timePartsEnabled = defaultCopyTimePartsEnabled
        ) {
            return getSnapshotFormatService().getRowFormattedText(rowOrId, order, enabled, timePartsEnabled);
        }

        function getRowCopyTextViaSnapshotService(rowOrId) {
            return getSnapshotFormatService().getRowCopyText(rowOrId, {
                order: getPatchedCopyFormatOrderState(),
                enabled: getPatchedCopyFormatEnabledState(),
                timePartsEnabled: getPatchedCopyTimePartsEnabledState()
            });
        }

        function applyFirstRangeStartAdjustAction(slotIdx, action) {
            return applyMultiRangeTimeAdjustAction(0, slotIdx, action);
        }

        function ensureGroupMultiSubgroupsViaState(group, options = {}) {
            return callServiceMethod(
                "multiStateService",
                getMultiStateService(),
                "ensureGroupMultiSubgroups",
                [group, options],
                { fallback: [] }
            );
        }

        function createMultiSubgroupStateViaState(name = "", index = 0, state = null) {
            return callServiceMethod(
                "multiStateService",
                getMultiStateService(),
                "createMultiSubgroupState",
                [name, index, state],
                { fallback: null }
            );
        }

        function sanitizeMultiStatePayloadViaState(rawState = null, fallbackState = null) {
            return callServiceMethod(
                "multiStateService",
                getMultiStateService(),
                "sanitizeMultiStatePayload",
                [rawState, fallbackState],
                { fallback: fallbackState }
            );
        }

        return Object.freeze({
            getSignedInclusiveDaySpan,
            escapeHtmlViaSharedUtils,
            getRenderableTimezoneRowsFromTableRender,
            getMultiDisplayColumnHeaderFromTableRender,
            getTimezoneRefByIdFromSnapshotService,
            normalizeZoneAbbreviationViaSearch,
            getDefaultMultiSubgroupNameViaState,
            sanitizeMultiSubgroupIdViaState,
            getMultiRangeTitleTextFromRenderService,
            buildTimezoneComputedSnapshotForDatesViaSnapshotService,
            formatSnapshotTextViaSnapshotService,
            sanitizeMultiSubgroupNameViaState,
            sanitizeMultiSubgroupNameForExport,
            buildStaticRowCellFromTableRender,
            buildDynamicRowCellFromTableRender,
            getRowFormattedTextViaSnapshotService,
            getRowCopyTextViaSnapshotService,
            applyFirstRangeStartAdjustAction,
            ensureGroupMultiSubgroupsViaState,
            createMultiSubgroupStateViaState,
            sanitizeMultiStatePayloadViaState
        });
    }

    globalObj.GTVMainRuntimeBridgeProxies = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
