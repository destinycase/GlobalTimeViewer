(function initGtvMainFixedTimeTabFacade(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const callServiceMethod = (typeof safeDeps.callServiceMethod === "function")
            ? safeDeps.callServiceMethod
            : (() => undefined);
        const getFixedTimeTableService = (typeof safeDeps.getFixedTimeTableService === "function")
            ? safeDeps.getFixedTimeTableService
            : (() => null);
        const getCurrentGroup = (typeof safeDeps.getCurrentGroup === "function")
            ? safeDeps.getCurrentGroup
            : (() => null);
        const ensureGroupFixedTimes = (typeof safeDeps.ensureGroupFixedTimes === "function")
            ? safeDeps.ensureGroupFixedTimes
            : (() => undefined);
        const refreshFixedTimeSlotCountControls = (typeof safeDeps.refreshFixedTimeSlotCountControls === "function")
            ? safeDeps.refreshFixedTimeSlotCountControls
            : (() => undefined);
        const getCurrentGroupFixedTimeShowLiveNow = (typeof safeDeps.getCurrentGroupFixedTimeShowLiveNow === "function")
            ? safeDeps.getCurrentGroupFixedTimeShowLiveNow
            : ((group) => !!group?.fixedTimeShowLiveNow);
        const getDocumentRef = (typeof safeDeps.getDocumentRef === "function")
            ? safeDeps.getDocumentRef
            : (() => ((typeof document === "object" && document) ? document : null));
        const renderBaseTimeSelect = (typeof safeDeps.renderBaseTimeSelect === "function")
            ? safeDeps.renderBaseTimeSelect
            : (() => undefined);
        const getCopyActionsService = (typeof safeDeps.getCopyActionsService === "function")
            ? safeDeps.getCopyActionsService
            : (() => null);

        function getFixedTimeSlotLayoutMetrics(partsEnabled) {
            return callServiceMethod(
                "fixedTimeTableService",
                getFixedTimeTableService(),
                "getFixedTimeSlotLayoutMetrics",
                [partsEnabled],
                { fallback: { inputWidthPx: 100, columnMinWidthPx: 152 } }
            );
        }

        function getFixedTimeDisplayColumns() {
            return callServiceMethod(
                "fixedTimeTableService",
                getFixedTimeTableService(),
                "getFixedTimeDisplayColumns",
                [],
                { fallback: ["timezone", "region", "time_slots"] }
            );
        }

        function getFixedTimeOffsetTextAtDate(tz, anchorDate) {
            return callServiceMethod(
                "fixedTimeTableService",
                getFixedTimeTableService(),
                "getFixedTimeOffsetTextAtDate",
                [tz, anchorDate],
                { fallback: "" }
            );
        }

        function renderFixedTimeTable(isTick = false) {
            return callServiceMethod(
                "fixedTimeTableService",
                getFixedTimeTableService(),
                "renderFixedTimeTable",
                [isTick]
            );
        }

        function renderFixedTimeControls(group = null, options = {}) {
            refreshFixedTimeSlotCountControls();

            const doc = getDocumentRef();
            const liveNowToggle = doc && typeof doc.getElementById === "function"
                ? doc.getElementById("fixed-time-live-now-toggle")
                : null;
            if (!liveNowToggle) return;

            const safeGroup = group || getCurrentGroup();
            if (!safeGroup) {
                liveNowToggle.checked = false;
                liveNowToggle.disabled = true;
                return;
            }

            if (options.ensureGroup !== false) {
                ensureGroupFixedTimes(safeGroup);
            }
            liveNowToggle.disabled = false;
            liveNowToggle.checked = !!getCurrentGroupFixedTimeShowLiveNow(safeGroup);
        }

        function renderFixedTimeTab(isTick = false) {
            if (isTick) {
                renderFixedTimeTable(true);
                return;
            }
            const group = getCurrentGroup();
            if (!group) return;
            ensureGroupFixedTimes(group);
            renderBaseTimeSelect();
            renderFixedTimeControls(group, { ensureGroup: false });
            renderFixedTimeTable(false);
            // The copy preview shows the top timezone at slot 1. Live ticks refresh it through
            // updateClocks, but with the realtime marker off nothing ticks, so refresh it here
            // after slot, order or top-row changes (it does nothing when the preview is hidden).
            callServiceMethod(
                "copyActionsService",
                getCopyActionsService(),
                "updateCopyFormatPreview",
                []
            );
        }

        return Object.freeze({
            getFixedTimeSlotLayoutMetrics,
            getFixedTimeDisplayColumns,
            getFixedTimeOffsetTextAtDate,
            renderFixedTimeControls,
            renderFixedTimeTable,
            renderFixedTimeTab
        });
    }

    globalObj.GTVMainFixedTimeTabFacade = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
