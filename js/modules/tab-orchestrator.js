(function initGtvTabOrchestrator(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function logWarn(...args) {
            if (typeof safeDeps.logWarn === "function") {
                safeDeps.logWarn(...args);
                return;
            }
            if (typeof safeDeps.consoleWarn === "function") {
                safeDeps.consoleWarn(...args);
                return;
            }
            if (typeof console === "object" && console && typeof console.warn === "function") {
                console.warn(...args);
            }
        }

        function toSafeCallable(depName, depFn) {
            if (typeof depFn !== "function") return () => undefined;
            return (...args) => {
                try {
                    return depFn(...args);
                } catch (err) {
                    logWarn(`[GTVTabOrchestrator] Dependency "${depName}" threw.`, err);
                    return undefined;
                }
            };
        }

        const dep = Object.freeze({
            sanitizeMainTab: toSafeCallable("sanitizeMainTab", safeDeps.sanitizeMainTab),
            getSlotCount: toSafeCallable("getSlotCount", safeDeps.getSlotCount),
            syncActiveFormatProfileFromState: toSafeCallable("syncActiveFormatProfileFromState", safeDeps.syncActiveFormatProfileFromState),
            resolveFormatProfileContext: toSafeCallable("resolveFormatProfileContext", safeDeps.resolveFormatProfileContext),
            activateFormatProfileContext: toSafeCallable("activateFormatProfileContext", safeDeps.activateFormatProfileContext),
            switchMainTabUi: toSafeCallable("switchMainTabUi", safeDeps.switchMainTabUi),
            refreshOptionToggleDividersUi: toSafeCallable("refreshOptionToggleDividersUi", safeDeps.refreshOptionToggleDividersUi)
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
