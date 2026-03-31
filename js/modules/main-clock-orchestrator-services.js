(function initGtvMainClockOrchestratorServices(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const isFixedTimeTab = (typeof safeDeps.isFixedTimeTab === "function")
            ? safeDeps.isFixedTimeTab
            : (() => false);
        const renderFixedTimeTab = (typeof safeDeps.renderFixedTimeTab === "function")
            ? safeDeps.renderFixedTimeTab
            : (() => { });
        const renderTimelineFrame = (typeof safeDeps.renderTimelineFrame === "function")
            ? safeDeps.renderTimelineFrame
            : (() => { });
        const isMultiTab = (typeof safeDeps.isMultiTab === "function")
            ? safeDeps.isMultiTab
            : (() => false);
        const renderMultiRanges = (typeof safeDeps.renderMultiRanges === "function")
            ? safeDeps.renderMultiRanges
            : (() => { });
        const getBaseTimezoneRef = (typeof safeDeps.getBaseTimezoneRef === "function")
            ? safeDeps.getBaseTimezoneRef
            : (() => ({ id: "utc" }));
        const getUTCRef = (typeof safeDeps.getUTCRef === "function")
            ? safeDeps.getUTCRef
            : (() => ({ id: "utc" }));
        const updateRow = (typeof safeDeps.updateRow === "function")
            ? safeDeps.updateRow
            : (() => { });
        const getCurrentGroupZones = (typeof safeDeps.getCurrentGroupZones === "function")
            ? safeDeps.getCurrentGroupZones
            : (() => []);
        const isShowCopyFormat = (typeof safeDeps.isShowCopyFormat === "function")
            ? safeDeps.isShowCopyFormat
            : (() => false);
        const updateCopyFormatPreview = (typeof safeDeps.updateCopyFormatPreview === "function")
            ? safeDeps.updateCopyFormatPreview
            : (() => { });

        function updateClocks() {
            if (isFixedTimeTab()) {
                renderFixedTimeTab(true);
                renderTimelineFrame();
                return;
            }

            if (isMultiTab()) {
                renderMultiRanges();
                renderTimelineFrame();
                return;
            }

            const baseRef = getBaseTimezoneRef();
            const utcRef = getUTCRef();
            updateRow(baseRef.id, baseRef);
            if (baseRef.id !== "utc") updateRow(utcRef.id, utcRef);

            const currentZones = (Array.isArray(getCurrentGroupZones()) ? getCurrentGroupZones() : [])
                .filter((tz) => tz.id !== baseRef.id);
            currentZones.forEach((tz) => updateRow(tz.id, tz));

            if (isShowCopyFormat()) {
                updateCopyFormatPreview();
            }
            renderTimelineFrame();
        }

        return Object.freeze({
            updateClocks
        });
    }

    globalObj.GTVMainClockOrchestratorServices = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
