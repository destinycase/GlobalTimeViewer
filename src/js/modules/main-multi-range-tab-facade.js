(function initGtvMainMultiRangeTabFacade(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const callServiceMethod = (typeof safeDeps.callServiceMethod === "function")
            ? safeDeps.callServiceMethod
            : (() => undefined);
        const getMultiRangeRenderService = (typeof safeDeps.getMultiRangeRenderService === "function")
            ? safeDeps.getMultiRangeRenderService
            : (() => null);
        const getMultiRangeCopyService = (typeof safeDeps.getMultiRangeCopyService === "function")
            ? safeDeps.getMultiRangeCopyService
            : (() => null);

        function renderMultiRanges() {
            return callServiceMethod(
                "multiRangeRenderService",
                getMultiRangeRenderService(),
                "renderMultiRanges",
                []
            );
        }

        function buildTimezoneComputedSnapshotForRange(tz, startDate, endDate) {
            const startMs = Number(startDate && typeof startDate.getTime === "function" ? startDate.getTime() : NaN);
            const endMs = Number(endDate && typeof endDate.getTime === "function" ? endDate.getTime() : NaN);
            if (!Number.isFinite(startMs)) return null;
            if (!Number.isFinite(endMs)) return null;
            return callServiceMethod(
                "multiRangeRenderService",
                getMultiRangeRenderService(),
                "buildTimezoneComputedSnapshotForRange",
                [tz, startDate, endDate],
                { fallback: null }
            );
        }

        function applySnapshotToRow(row, snapshot) {
            if (!row || !snapshot) return false;
            return callServiceMethod(
                "multiRangeRenderService",
                getMultiRangeRenderService(),
                "applySnapshotToRow",
                [row, snapshot],
                { fallback: false }
            );
        }

        function formatRangeDurationText(startUtcMs, endUtcMs) {
            const safeStart = Number.isFinite(startUtcMs) ? startUtcMs : Date.now();
            const safeEnd = Number.isFinite(endUtcMs) ? endUtcMs : safeStart;
            return callServiceMethod(
                "multiRangeRenderService",
                getMultiRangeRenderService(),
                "formatRangeDurationText",
                [safeStart, safeEnd],
                { fallback: "" }
            );
        }

        async function copyMultiRangeRow(rangeIdx, rowId) {
            if (!Number.isInteger(rangeIdx) || rangeIdx < 0) return false;
            if (typeof rowId !== "string" || !rowId.trim()) return false;
            return await callServiceMethod(
                "multiRangeCopyService",
                getMultiRangeCopyService(),
                "copyMultiRangeRow",
                [rangeIdx, rowId],
                { fallback: false, toastOnMissing: true, featureKey: "copy-multi-range-row" }
            );
        }

        async function copyAllMultiRangeTimezones() {
            return await callServiceMethod(
                "multiRangeCopyService",
                getMultiRangeCopyService(),
                "copyAllMultiRangeTimezones",
                [],
                { fallback: false, toastOnMissing: true, featureKey: "copy-all-multi-range-timezones" }
            );
        }

        return Object.freeze({
            renderMultiRanges,
            buildTimezoneComputedSnapshotForRange,
            applySnapshotToRow,
            formatRangeDurationText,
            copyMultiRangeRow,
            copyAllMultiRangeTimezones
        });
    }

    globalObj.GTVMainMultiRangeTabFacade = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
