(function initGtvMainTimelineFacade(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const callServiceMethod = (typeof safeDeps.callServiceMethod === "function")
            ? safeDeps.callServiceMethod
            : (() => undefined);
        const getTimelineFrameService = (typeof safeDeps.getTimelineFrameService === "function")
            ? safeDeps.getTimelineFrameService
            : (() => null);
        const getFixedTimeTimelineService = (typeof safeDeps.getFixedTimeTimelineService === "function")
            ? safeDeps.getFixedTimeTimelineService
            : (() => null);
        const getFixedTimeCoreService = (typeof safeDeps.getFixedTimeCoreService === "function")
            ? safeDeps.getFixedTimeCoreService
            : (() => null);
        const getMainTabState = (typeof safeDeps.getMainTabState === "function")
            ? safeDeps.getMainTabState
            : (() => "live");
        const getShowTimelineState = (typeof safeDeps.getShowTimelineState === "function")
            ? safeDeps.getShowTimelineState
            : (() => false);
        const isMultiTab = (typeof safeDeps.isMultiTab === "function")
            ? safeDeps.isMultiTab
            : (() => false);
        const getGlobalTimeState = (typeof safeDeps.getGlobalTimeState === "function")
            ? safeDeps.getGlobalTimeState
            : (() => new Date());
        const getCurrentGroup = (typeof safeDeps.getCurrentGroup === "function")
            ? safeDeps.getCurrentGroup
            : (() => null);
        const getFixedTimeSlotCountForGroup = (typeof safeDeps.getFixedTimeSlotCountForGroup === "function")
            ? safeDeps.getFixedTimeSlotCountForGroup
            : (() => 1);
        const getFixedTimeSlotHeaderLabel = (typeof safeDeps.getFixedTimeSlotHeaderLabel === "function")
            ? safeDeps.getFixedTimeSlotHeaderLabel
            : ((_slot, slotIdx) => String(slotIdx + 1));
        const getIsRealtimeState = (typeof safeDeps.getIsRealtimeState === "function")
            ? safeDeps.getIsRealtimeState
            : (() => true);
        const getSlotCountState = (typeof safeDeps.getSlotCountState === "function")
            ? safeDeps.getSlotCountState
            : (() => 1);
        const isFixedTimeTab = (typeof safeDeps.isFixedTimeTab === "function")
            ? safeDeps.isFixedTimeTab
            : (() => false);
        const t = (typeof safeDeps.t === "function")
            ? safeDeps.t
            : ((key) => String(key || ""));

        function isTimelineSupportedTab() {
            const mainTab = getMainTabState();
            return mainTab === "live" || mainTab === "fixed" || mainTab === "fixed-time";
        }

        function shouldRenderTimeline() {
            return !!callServiceMethod(
                "timelineFrameService",
                getTimelineFrameService(),
                "shouldRenderTimeline",
                [],
                { fallback: !!getShowTimelineState() && isTimelineSupportedTab() && !isMultiTab() }
            );
        }

        function resolveFixedTimeTimelineSourceDate(slotIdx, baseRef, anchorDate = getGlobalTimeState(0)) {
            return callServiceMethod(
                "fixedTimeTimelineService",
                getFixedTimeTimelineService(),
                "resolveFixedTimeTimelineSourceDate",
                [slotIdx, baseRef, anchorDate],
                { fallback: null }
            );
        }

        function applyFixedTimeSlotTimelineRatio(slotIdx, ratio) {
            return callServiceMethod(
                "fixedTimeTimelineService",
                getFixedTimeTimelineService(),
                "applyFixedTimeSlotTimelineRatio",
                [slotIdx, ratio],
                { fallback: false }
            );
        }

        function getFixedTimeTimelineSlots() {
            return callServiceMethod(
                "fixedTimeTimelineService",
                getFixedTimeTimelineService(),
                "getFixedTimeTimelineSlots",
                [],
                { fallback: [] }
            );
        }

        function getFixedTimeTimelineSlotCount() {
            return callServiceMethod(
                "fixedTimeTimelineService",
                getFixedTimeTimelineService(),
                "getFixedTimeTimelineSlotCount",
                [],
                { fallback: getFixedTimeSlotCountForGroup(getCurrentGroup()) }
            );
        }

        function getFixedTimeTimelineIndicatorToken() {
            return callServiceMethod(
                "fixedTimeTimelineService",
                getFixedTimeTimelineService(),
                "getFixedTimeTimelineIndicatorToken",
                [],
                { fallback: "" }
            );
        }

        function getFixedTimeSlotTimelineLabel(slot, slotIdx, slotCount = 1) {
            return callServiceMethod(
                "fixedTimeTimelineService",
                getFixedTimeTimelineService(),
                "getFixedTimeSlotTimelineLabel",
                [slot, slotIdx, slotCount],
                { fallback: getFixedTimeSlotHeaderLabel(slot, slotIdx, slotCount) }
            );
        }

        function getFixedTimeTimelineIndicatorColor(slotIdx) {
            const fallbackPalette = ["#ff4d4d", "#3b82f6", "#14b8a6", "#f59e0b", "#a855f7"];
            return callServiceMethod(
                "fixedTimeCoreService",
                getFixedTimeCoreService(),
                "getFixedTimeTimelineIndicatorColor",
                [slotIdx],
                { fallback: fallbackPalette[slotIdx % fallbackPalette.length] }
            );
        }

        function stopTimelineDrag() {
            return callServiceMethod(
                "timelineFrameService",
                getTimelineFrameService(),
                "stopTimelineDrag",
                []
            );
        }

        function normalizeDayNightMarker(marker) {
            const raw = String(marker || "").trim();
            const normalized = raw.toUpperCase();
            return callServiceMethod(
                "fixedTimeCoreService",
                getFixedTimeCoreService(),
                "normalizeDayNightMarker",
                [marker],
                {
                    fallback: (!raw)
                        ? ""
                        : ((normalized === "DAY" || raw === "\u2600\uFE0F")
                            ? "DAY"
                            : ((normalized === "NIGHT" || normalized === "MOON" || raw === "\uD83C\uDF19") ? "NIGHT" : ""))
                }
            );
        }

        function getDayNightGlyph(marker) {
            return callServiceMethod(
                "fixedTimeCoreService",
                getFixedTimeCoreService(),
                "getDayNightGlyph",
                [marker],
                { fallback: String(marker || "") }
            );
        }

        function applyTimelineRatioToSlot(slotIdx, ratio, baseRef, options = {}) {
            return callServiceMethod(
                "timelineFrameService",
                getTimelineFrameService(),
                "applyTimelineRatioToSlot",
                [slotIdx, ratio, baseRef, options]
            );
        }

        function getTimelineIndicatorLabel(slotIdx) {
            return callServiceMethod(
                "timelineFrameService",
                getTimelineFrameService(),
                "getTimelineIndicatorLabel",
                [slotIdx],
                {
                    fallback: (() => {
                        const showRangeLabels = getMainTabState() === "fixed"
                            && !getIsRealtimeState()
                            && getSlotCountState() > 1;
                        if (showRangeLabels) {
                            return t(slotIdx === 0 ? "th_time_day_start" : "th_time_day_end");
                        }
                        return t("th_time_day_main");
                    })()
                }
            );
        }

        function getTimelinePanelCount() {
            return callServiceMethod(
                "timelineFrameService",
                getTimelineFrameService(),
                "getTimelinePanelCount",
                [],
                { fallback: (isFixedTimeTab() || getIsRealtimeState() || getSlotCountState() <= 1) ? 1 : 2 }
            );
        }

        function renderTimelineFrame() {
            return callServiceMethod(
                "timelineFrameService",
                getTimelineFrameService(),
                "renderTimelineFrame",
                []
            );
        }

        return Object.freeze({
            isTimelineSupportedTab,
            shouldRenderTimeline,
            resolveFixedTimeTimelineSourceDate,
            applyFixedTimeSlotTimelineRatio,
            getFixedTimeTimelineSlots,
            getFixedTimeTimelineSlotCount,
            getFixedTimeTimelineIndicatorToken,
            getFixedTimeSlotTimelineLabel,
            getFixedTimeTimelineIndicatorColor,
            stopTimelineDrag,
            normalizeDayNightMarker,
            getDayNightGlyph,
            applyTimelineRatioToSlot,
            getTimelineIndicatorLabel,
            getTimelinePanelCount,
            renderTimelineFrame
        });
    }

    globalObj.GTVMainTimelineFacade = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
