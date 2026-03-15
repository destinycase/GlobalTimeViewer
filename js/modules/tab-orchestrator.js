(function initGtvTabOrchestrator(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (_err) {
                return undefined;
            }
        }

        function switchMainTab(tab) {
            const safeTab = invokeDep("sanitizeMainTab", tab);
            const slotCount = invokeDep("getSlotCount");
            invokeDep("syncActiveFormatProfileFromState");
            const nextContext = invokeDep("resolveFormatProfileContext", safeTab, slotCount);
            invokeDep("activateFormatProfileContext", nextContext, { syncCurrent: false });
            return invokeDep("switchMainTabUi", safeTab);
        }

        function refreshOptionToggleDividers() {
            return invokeDep("refreshOptionToggleDividersUi");
        }

        return Object.freeze({
            switchMainTab,
            refreshOptionToggleDividers
        });
    }

    globalObj.GTVTabOrchestrator = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
