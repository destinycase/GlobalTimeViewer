(function initGtvMainTimezoneTableFacade(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const callServiceMethod = (typeof safeDeps.callServiceMethod === "function")
            ? safeDeps.callServiceMethod
            : (() => undefined);
        const getTableRenderService = (typeof safeDeps.getTableRenderService === "function")
            ? safeDeps.getTableRenderService
            : (() => null);
        const getMainTimezoneFacadeService = (typeof safeDeps.getMainTimezoneFacadeService === "function")
            ? safeDeps.getMainTimezoneFacadeService
            : (() => null);
        const getCopyActionsService = (typeof safeDeps.getCopyActionsService === "function")
            ? safeDeps.getCopyActionsService
            : (() => null);
        const isFixedTimeTab = (typeof safeDeps.isFixedTimeTab === "function")
            ? safeDeps.isFixedTimeTab
            : (() => false);
        const renderFixedTimeTab = (typeof safeDeps.renderFixedTimeTab === "function")
            ? safeDeps.renderFixedTimeTab
            : (() => undefined);
        const renderTimelineFrame = (typeof safeDeps.renderTimelineFrame === "function")
            ? safeDeps.renderTimelineFrame
            : (() => undefined);

        function renderList() {
            if (isFixedTimeTab()) {
                // The table render path redraws the timeline through updateClocks; the fixed
                // time tab draws only its table, so redraw the timeline here (a shown or hidden
                // row must appear there at once, even with the realtime marker off).
                const result = renderFixedTimeTab();
                renderTimelineFrame();
                return result;
            }
            return callServiceMethod(
                "tableRenderService",
                getTableRenderService(),
                "renderList",
                []
            );
        }

        function createStandardTimezoneFromSelectableEntry(entry) {
            return callServiceMethod(
                "mainTimezoneFacadeService",
                getMainTimezoneFacadeService(),
                "createStandardTimezoneFromSelectableEntry",
                [entry],
                { fallback: null }
            );
        }

        function addTimezone(tz) {
            return callServiceMethod(
                "mainTimezoneFacadeService",
                getMainTimezoneFacadeService(),
                "addTimezone",
                [tz],
                { fallback: false, toastOnMissing: true, featureKey: "timezone-add" }
            );
        }

        function removeTimezone(id) {
            return callServiceMethod(
                "mainTimezoneFacadeService",
                getMainTimezoneFacadeService(),
                "removeTimezone",
                [id],
                { toastOnMissing: true, featureKey: "timezone-remove" }
            );
        }

        function updateCopyFormatPreview() {
            return callServiceMethod(
                "copyActionsService",
                getCopyActionsService(),
                "updateCopyFormatPreview",
                []
            );
        }

        async function copyAllTimezones() {
            return await callServiceMethod(
                "copyActionsService",
                getCopyActionsService(),
                "copyAllTimezones",
                [],
                { fallback: false, toastOnMissing: true, featureKey: "copy-all-timezones" }
            );
        }

        return Object.freeze({
            renderList,
            createStandardTimezoneFromSelectableEntry,
            addTimezone,
            removeTimezone,
            updateCopyFormatPreview,
            copyAllTimezones
        });
    }

    globalObj.GTVMainTimezoneTableFacade = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
