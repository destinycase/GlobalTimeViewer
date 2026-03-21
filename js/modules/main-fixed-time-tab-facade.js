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
        const renderBaseTimeSelect = (typeof safeDeps.renderBaseTimeSelect === "function")
            ? safeDeps.renderBaseTimeSelect
            : (() => undefined);
        const renderFixedTimeControls = (typeof safeDeps.renderFixedTimeControls === "function")
            ? safeDeps.renderFixedTimeControls
            : (() => undefined);

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

        function renderFixedTimeTable() {
            return callServiceMethod(
                "fixedTimeTableService",
                getFixedTimeTableService(),
                "renderFixedTimeTable",
                []
            );
        }

        function renderFixedTimeTab() {
            const group = getCurrentGroup();
            if (!group) return;
            ensureGroupFixedTimes(group);
            renderBaseTimeSelect();
            renderFixedTimeControls();
            renderFixedTimeTable();
        }

        return Object.freeze({
            getFixedTimeSlotLayoutMetrics,
            getFixedTimeDisplayColumns,
            getFixedTimeOffsetTextAtDate,
            renderFixedTimeTable,
            renderFixedTimeTab
        });
    }

    globalObj.GTVMainFixedTimeTabFacade = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
