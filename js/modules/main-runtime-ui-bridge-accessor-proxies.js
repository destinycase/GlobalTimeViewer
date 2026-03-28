(function initGtvMainRuntimeUiBridgeAccessorProxies(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const callServiceMethod = (typeof safeDeps.callServiceMethod === "function")
            ? safeDeps.callServiceMethod
            : (() => undefined);
        const getAppFeedbackService = (typeof safeDeps.getAppFeedbackService === "function")
            ? safeDeps.getAppFeedbackService
            : (() => null);
        const getTabOrchestratorService = (typeof safeDeps.getTabOrchestratorService === "function")
            ? safeDeps.getTabOrchestratorService
            : (() => null);
        const getFormatControlsService = (typeof safeDeps.getFormatControlsService === "function")
            ? safeDeps.getFormatControlsService
            : (() => null);
        const getTableRenderService = (typeof safeDeps.getTableRenderService === "function")
            ? safeDeps.getTableRenderService
            : (() => null);
        const getMainTimezoneTableFacadeService = (
            typeof safeDeps.getMainTimezoneTableFacadeService === "function"
        )
            ? safeDeps.getMainTimezoneTableFacadeService
            : (() => null);
        const getMainTimelineFacadeService = (typeof safeDeps.getMainTimelineFacadeService === "function")
            ? safeDeps.getMainTimelineFacadeService
            : (() => null);
        const getMainFixedTimeFacadeService = (typeof safeDeps.getMainFixedTimeFacadeService === "function")
            ? safeDeps.getMainFixedTimeFacadeService
            : (() => null);
        const getMainFixedTimeTabFacadeService = (
            typeof safeDeps.getMainFixedTimeTabFacadeService === "function"
        )
            ? safeDeps.getMainFixedTimeTabFacadeService
            : (() => null);
        const getPatchedSlotCountState = (typeof safeDeps.getPatchedSlotCountState === "function")
            ? safeDeps.getPatchedSlotCountState
            : (() => 1);
        const getGlobalTimeState = (typeof safeDeps.getGlobalTimeState === "function")
            ? safeDeps.getGlobalTimeState
            : (() => null);
        const serviceMethodMissingToken = Object.prototype.hasOwnProperty.call(safeDeps, "serviceMethodMissingToken")
            ? safeDeps.serviceMethodMissingToken
            : Symbol("GTV_SERVICE_METHOD_MISSING");
        const consoleError = (typeof safeDeps.consoleError === "function")
            ? safeDeps.consoleError
            : console.error.bind(console);

        function showFatalError(err) {
            const result = callServiceMethod(
                "appFeedbackService",
                getAppFeedbackService(),
                "showFatalError",
                [err],
                { fallback: serviceMethodMissingToken }
            );
            if (result === serviceMethodMissingToken) {
                consoleError("FATAL ERROR during app initialization:", err);
            }
            return result;
        }

        function showToast(message, options = {}) {
            return callServiceMethod(
                "appFeedbackService",
                getAppFeedbackService(),
                "showToast",
                [message, options]
            );
        }

        function switchMainTab(tab) {
            return callServiceMethod(
                "tabOrchestratorService",
                getTabOrchestratorService(),
                "switchMainTab",
                [tab]
            );
        }

        function refreshOptionToggleDividers() {
            return callServiceMethod(
                "tabOrchestratorService",
                getTabOrchestratorService(),
                "refreshOptionToggleDividers",
                []
            );
        }

        function getCopyFieldLabel(key) {
            const safeKey = (typeof key === "string") ? key : "";
            return callServiceMethod(
                "formatControlsService",
                getFormatControlsService(),
                "getCopyFieldLabel",
                [safeKey],
                { fallback: safeKey }
            );
        }

        function getTimePartLabel(partKey) {
            const safePartKey = (typeof partKey === "string") ? partKey : "";
            return callServiceMethod(
                "formatControlsService",
                getFormatControlsService(),
                "getTimePartLabel",
                [safePartKey],
                { fallback: safePartKey }
            );
        }

        function getDisplayColumns(effectiveSlotCount) {
            const safeSlotCount = Number.isFinite(Number(effectiveSlotCount))
                ? Number(effectiveSlotCount)
                : getPatchedSlotCountState();
            return callServiceMethod(
                "tableRenderService",
                getTableRenderService(),
                "getDisplayColumns",
                [safeSlotCount],
                { fallback: [] }
            );
        }

        function getDisplayTimeInputMode() {
            return callServiceMethod(
                "tableRenderService",
                getTableRenderService(),
                "getDisplayTimeInputMode",
                [],
                { fallback: "datetime" }
            );
        }

        function buildRowActionCells(copyButtonTitle, removeButtonText, removeButtonTitle = "") {
            const safeCopyTitle = String(copyButtonTitle ?? "");
            const safeRemoveText = String(removeButtonText ?? "");
            const safeRemoveTitle = String(removeButtonTitle ?? "");
            return callServiceMethod(
                "tableRenderService",
                getTableRenderService(),
                "buildRowActionCells",
                [safeCopyTitle, safeRemoveText, safeRemoveTitle],
                { fallback: "" }
            );
        }

        function renderList() {
            return callServiceMethod(
                "mainTimezoneTableFacadeService",
                getMainTimezoneTableFacadeService(),
                "renderList",
                [],
                { fallback: undefined }
            );
        }

        function renderTimelineFrame() {
            return callServiceMethod(
                "mainTimelineFacadeService",
                getMainTimelineFacadeService(),
                "renderTimelineFrame",
                [],
                { fallback: undefined }
            );
        }

        function resolveFixedTimeSlotUtcDate(slot, baseRef, anchorDate = getGlobalTimeState(0)) {
            return callServiceMethod(
                "mainFixedTimeFacadeService",
                getMainFixedTimeFacadeService(),
                "resolveFixedTimeSlotUtcDate",
                [slot, baseRef, anchorDate],
                { fallback: null }
            );
        }

        function getFixedTimeSlotHeaderLabel(slot, slotIdx, slotCount = 1) {
            return callServiceMethod(
                "mainFixedTimeFacadeService",
                getMainFixedTimeFacadeService(),
                "getFixedTimeSlotHeaderLabel",
                [slot, slotIdx, slotCount],
                { fallback: "" }
            );
        }

        function renderFixedTimeTab() {
            return callServiceMethod(
                "mainFixedTimeTabFacadeService",
                getMainFixedTimeTabFacadeService(),
                "renderFixedTimeTab",
                [],
                { fallback: undefined }
            );
        }

        return Object.freeze({
            showFatalError,
            showToast,
            switchMainTab,
            refreshOptionToggleDividers,
            getCopyFieldLabel,
            getTimePartLabel,
            getDisplayColumns,
            getDisplayTimeInputMode,
            buildRowActionCells,
            renderList,
            renderTimelineFrame,
            resolveFixedTimeSlotUtcDate,
            getFixedTimeSlotHeaderLabel,
            renderFixedTimeTab
        });
    }

    globalObj.GTVMainRuntimeUiBridgeAccessorProxies = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
