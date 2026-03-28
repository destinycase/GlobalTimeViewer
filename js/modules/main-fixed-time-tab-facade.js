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

        function renderFixedTimeControls(group = null, options = {}) {
            refreshFixedTimeSlotCountControls();

            const doc = getDocumentRef();
            const dateInput = doc && typeof doc.getElementById === "function"
                ? doc.getElementById("fixed-time-date-input")
                : null;
            const liveNowToggle = doc && typeof doc.getElementById === "function"
                ? doc.getElementById("fixed-time-live-now-toggle")
                : null;
            if (!dateInput) return;

            const safeGroup = group || getCurrentGroup();
            if (!safeGroup) {
                dateInput.value = "";
                if (liveNowToggle) {
                    liveNowToggle.checked = false;
                    liveNowToggle.disabled = true;
                }
                return;
            }

            if (options.ensureGroup !== false) {
                ensureGroupFixedTimes(safeGroup);
            }
            dateInput.value = safeGroup.fixedDate || "";
            if (liveNowToggle) {
                liveNowToggle.disabled = false;
                liveNowToggle.checked = !!getCurrentGroupFixedTimeShowLiveNow(safeGroup);
            }
        }

        function renderFixedTimeTab() {
            const group = getCurrentGroup();
            if (!group) return;
            ensureGroupFixedTimes(group);
            renderBaseTimeSelect();
            renderFixedTimeControls(group, { ensureGroup: false });
            renderFixedTimeTable();
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
