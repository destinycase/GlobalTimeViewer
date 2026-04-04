(function initGtvTabOrchestrator(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function toSafeCallable(depFn) {
            if (typeof depFn !== "function") return () => undefined;
            return (...args) => {
                try {
                    return depFn(...args);
                } catch (_err) {
                    return undefined;
                }
            };
        }

        const dep = Object.freeze({
            sanitizeMainTab: toSafeCallable(safeDeps.sanitizeMainTab),
            getSlotCount: toSafeCallable(safeDeps.getSlotCount),
            syncActiveFormatProfileFromState: toSafeCallable(safeDeps.syncActiveFormatProfileFromState),
            resolveFormatProfileContext: toSafeCallable(safeDeps.resolveFormatProfileContext),
            activateFormatProfileContext: toSafeCallable(safeDeps.activateFormatProfileContext),
            switchMainTabUi: toSafeCallable(safeDeps.switchMainTabUi),
            refreshOptionToggleDividersUi: toSafeCallable(safeDeps.refreshOptionToggleDividersUi)
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
