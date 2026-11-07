(function initGtvTabOrchestrator(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        const serviceInvokeUtils = globalObj?.GTVServiceInvokeUtils || globalThis.GTVServiceInvokeUtils;
        if (!serviceInvokeUtils) throw new Error("Missing required module API: GTVServiceInvokeUtils");
        const logWarn = serviceInvokeUtils.createDependencyLogger(safeDeps, "warn", globalObj);
        const toSafeCallable = serviceInvokeUtils.createSafeCallableFactory("GTVTabOrchestrator", logWarn);
        const pickSafeCallables = (keys) => serviceInvokeUtils.pickSafeCallables(safeDeps, keys, toSafeCallable);

        const dep = Object.freeze({
            ...pickSafeCallables([
                "sanitizeMainTab",
                "getSlotCount",
                "syncActiveFormatProfileFromState",
                "resolveFormatProfileContext",
                "activateFormatProfileContext",
                "switchMainTabUi",
                "refreshOptionToggleDividersUi"
            ])
        });

        function switchMainTab(tab) {
            const safeTab = dep.sanitizeMainTab(tab);
            const slotCount = dep.getSlotCount();
            dep.syncActiveFormatProfileFromState();
            const nextContext = dep.resolveFormatProfileContext(safeTab, slotCount);
            dep.activateFormatProfileContext(nextContext, { syncCurrent: false });
            return dep.switchMainTabUi(safeTab);
        }

        function refreshOptionToggleDividers() {
            return dep.refreshOptionToggleDividersUi();
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
