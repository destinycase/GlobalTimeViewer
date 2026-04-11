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

        function pickSafeCallables(keys) {
            return keys.reduce((acc, key) => {
                acc[key] = toSafeCallable(key, safeDeps[key]);
                return acc;
            }, {});
        }

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
