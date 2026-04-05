(function initGtvGroupContextState(globalObj) {
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
                    logWarn(`[GTVGroupContextState] Dependency "${depName}" threw.`, err);
                    return undefined;
                }
            };
        }

        const dep = Object.freeze({
            getGroups: toSafeCallable("getGroups", safeDeps.getGroups),
            getState: toSafeCallable("getState", safeDeps.getState),
            setState: toSafeCallable("setState", safeDeps.setState),
            getUTCRef: toSafeCallable("getUTCRef", safeDeps.getUTCRef),
            sanitizeUtcRowOrder: toSafeCallable("sanitizeUtcRowOrder", safeDeps.sanitizeUtcRowOrder)
        });

        function getMainTabs() {
            if (!Array.isArray(safeDeps.MAIN_TABS)) {
                return ["live", "fixed", "multi", "fixed-time", "calc"];
            }
            return safeDeps.MAIN_TABS.filter((tab) => typeof tab === "string" && tab.trim());
        }

        function getGroups() {
            const groups = dep.getGroups();
            return Array.isArray(groups) ? groups : [];
        }

        function getState() {
            const state = dep.getState();
            if (!state || typeof state !== "object") {
                return {
                    currentMainTab: "live",
                    activeGroupId: 0,
                    activeGroupIdByMainTab: { live: 0, fixed: 0 }
                };
            }
            return {
                currentMainTab: typeof state.currentMainTab === "string" ? state.currentMainTab : "live",
                activeGroupId: state.activeGroupId,
                activeGroupIdByMainTab: state.activeGroupIdByMainTab
            };
        }

        function setState(next = {}) {
            dep.setState(next);
        }

        function sanitizeMainTab(tab) {
            const tabs = getMainTabs();
            return tabs.includes(tab) ? tab : "live";
        }

        function clampGroupIndex(index) {
            const maxIndex = Math.max(0, getGroups().length - 1);
            const parsed = parseInt(index, 10);
            if (!Number.isFinite(parsed)) return 0;
            return Math.min(Math.max(parsed, 0), maxIndex);
        }

        function normalizeGroupTabState() {
            const state = getState();
            const nextActiveGroupId = clampGroupIndex(state.activeGroupId);
            const nextTabMap = {
                live: clampGroupIndex(state.activeGroupIdByMainTab && state.activeGroupIdByMainTab.live),
                fixed: clampGroupIndex(state.activeGroupIdByMainTab && state.activeGroupIdByMainTab.fixed)
            };
            setState({
                activeGroupId: nextActiveGroupId,
                activeGroupIdByMainTab: nextTabMap
            });
            return {
                activeGroupId: nextActiveGroupId,
                activeGroupIdByMainTab: nextTabMap
            };
        }

        function getCurrentGroup() {
            const groups = getGroups();
            if (!groups.length) return null;

            const state = getState();
            const currentMainTab = sanitizeMainTab(state.currentMainTab);
            const tabSpecific = currentMainTab === "live" || currentMainTab === "fixed";
            const targetId = tabSpecific
                ? (state.activeGroupIdByMainTab && state.activeGroupIdByMainTab[currentMainTab])
                : state.activeGroupId;
            return groups[clampGroupIndex(targetId)] || groups[0] || null;
        }

        function getCurrentGroupZones() {
            const group = getCurrentGroup();
            return Array.isArray(group && group.zones) ? group.zones : [];
        }

        function getCurrentGroupBaseTimezoneId() {
            const group = getCurrentGroup();
            return (group && typeof group.baseTimezoneId === "string" && group.baseTimezoneId)
                ? group.baseTimezoneId
                : "utc";
        }

        function getBaseTimezoneRef() {
            const requestedId = getCurrentGroupBaseTimezoneId();
            const matched = getCurrentGroupZones().find((z) => z && z.id === requestedId);
            if (matched) return matched;
            return dep.getUTCRef() || null;
        }

        function ensureBaseTimezoneSelection() {
            const group = getCurrentGroup();
            if (!group) return getBaseTimezoneRef();
            const baseId = getCurrentGroupBaseTimezoneId();
            const exists = (baseId === "utc") || getCurrentGroupZones().some((z) => z && z.id === baseId);
            if (!exists) group.baseTimezoneId = "utc";
            return getBaseTimezoneRef();
        }

        function isCurrentGroupUtcRowVisible() {
            const group = getCurrentGroup();
            return !group || group.showUtcRow !== false;
        }

        function getCurrentGroupUtcRowOrder() {
            const group = getCurrentGroup();
            if (!group) return 0;
            const sanitized = dep.sanitizeUtcRowOrder(group.utcRowOrder);
            if (Number.isFinite(sanitized)) return sanitized;
            const parsed = parseInt(group.utcRowOrder, 10);
            if (!Number.isFinite(parsed)) return 0;
            return Math.max(0, Math.min(1, parsed));
        }

        return Object.freeze({
            sanitizeMainTab,
            clampGroupIndex,
            normalizeGroupTabState,
            getCurrentGroup,
            getCurrentGroupZones,
            getCurrentGroupBaseTimezoneId,
            getBaseTimezoneRef,
            ensureBaseTimezoneSelection,
            isCurrentGroupUtcRowVisible,
            getCurrentGroupUtcRowOrder
        });
    }

    globalObj.GTVGroupContextState = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
