(function initGtvMainBaseTimezoneServices(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const getCurrentGroup = (typeof safeDeps.getCurrentGroup === "function")
            ? safeDeps.getCurrentGroup
            : (() => null);
        const sanitizeBaseTimezoneId = (typeof safeDeps.sanitizeBaseTimezoneId === "function")
            ? safeDeps.sanitizeBaseTimezoneId
            : ((value) => (value == null ? "utc" : String(value || "").trim().toLowerCase() || "utc"));
        const renderList = (typeof safeDeps.renderList === "function")
            ? safeDeps.renderList
            : (() => { });
        const renderTimelineFrame = (typeof safeDeps.renderTimelineFrame === "function")
            ? safeDeps.renderTimelineFrame
            : (() => { });
        const updateTimeAdjustPanel = (typeof safeDeps.updateTimeAdjustPanel === "function")
            ? safeDeps.updateTimeAdjustPanel
            : (() => { });
        const savePersistence = (typeof safeDeps.savePersistence === "function")
            ? safeDeps.savePersistence
            : (() => { });

        function setCurrentGroupBaseTimezoneId(value) {
            const group = getCurrentGroup();
            if (!group) return false;
            group.baseTimezoneId = sanitizeBaseTimezoneId(value);
            return true;
        }

        function applyCurrentGroupBaseTimezoneId(nextBaseId, options = {}) {
            const safeOptions = (options && typeof options === "object") ? options : {};
            const persist = safeOptions.persist !== false;
            const safeBaseId = sanitizeBaseTimezoneId(nextBaseId || "utc");
            if (safeBaseId === "utc") {
                const activeGroup = getCurrentGroup();
                if (activeGroup) {
                    activeGroup.showUtcRow = true;
                    activeGroup.utcRowOrder = 0;
                }
            }
            setCurrentGroupBaseTimezoneId(safeBaseId);
            renderList();
            renderTimelineFrame();
            updateTimeAdjustPanel();
            if (persist) savePersistence();
        }

        return Object.freeze({
            setCurrentGroupBaseTimezoneId,
            applyCurrentGroupBaseTimezoneId
        });
    }

    globalObj.GTVMainBaseTimezoneServices = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
