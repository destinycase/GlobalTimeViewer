(function initGtvMainGroupTabsService(globalObj) {
    "use strict";

    function requireCreateServiceModule(moduleApi, label) {
        if (!moduleApi || typeof moduleApi.createService !== "function") {
            throw new Error(`Missing required module API: ${label}.createService`);
        }
        return moduleApi;
    }

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const groupTabsApi = requireCreateServiceModule(safeDeps.GTV_GROUP_TABS, "GTVGroupTabs");
        const serviceInvokeUtils = (
            safeDeps.GTV_SERVICE_INVOKE_UTILS
            && typeof safeDeps.GTV_SERVICE_INVOKE_UTILS === "object"
        )
            ? safeDeps.GTV_SERVICE_INVOKE_UTILS
            : (
                globalObj.GTVServiceInvokeUtils
                && typeof globalObj.GTVServiceInvokeUtils === "object"
            )
                ? globalObj.GTVServiceInvokeUtils
                : null;

        const getPersistenceService = (typeof safeDeps.getPersistenceService === "function")
            ? safeDeps.getPersistenceService
            : (() => null);
        const getDataTransferService = (typeof safeDeps.getDataTransferService === "function")
            ? safeDeps.getDataTransferService
            : (() => null);
        const getActiveGroupId = (typeof safeDeps.getActiveGroupId === "function")
            ? safeDeps.getActiveGroupId
            : (() => 0);

        function resolveExternalService(getter) {
            if (serviceInvokeUtils && typeof serviceInvokeUtils.resolveService === "function") {
                return serviceInvokeUtils.resolveService(getter);
            }
            if (typeof getter !== "function") return null;
            const service = getter();
            return (service && typeof service === "object") ? service : null;
        }

        function invokeExternalService(getter, methodName, args = [], fallback = undefined) {
            if (serviceInvokeUtils && typeof serviceInvokeUtils.invokeGetterMethod === "function") {
                return serviceInvokeUtils.invokeGetterMethod(getter, methodName, args, fallback);
            }
            const service = resolveExternalService(getter);
            if (!service || typeof service[methodName] !== "function") return fallback;
            return service[methodName](...args);
        }

        let groupTabsService = null;
        groupTabsService = groupTabsApi.createService({
            t: safeDeps.t,
            showToast: safeDeps.showToast,
            confirmFn: safeDeps.confirmFn,
            getState: safeDeps.getState,
            setState: safeDeps.setState,
            isMultiTab: safeDeps.isMultiTab,
            getCurrentGroup: safeDeps.getCurrentGroup,
            isFixedTimeTab: safeDeps.isFixedTimeTab,
            ensureGroupMultiSubgroups: (group, options = {}) =>
                safeDeps.ensureGroupMultiSubgroups(group, options),
            normalizeGroupTabState: safeDeps.normalizeGroupTabState,
            syncCurrentMultiStateToActiveSubgroup: safeDeps.syncCurrentMultiStateToActiveSubgroup,
            loadCurrentMultiStateFromActiveSubgroup: safeDeps.loadCurrentMultiStateFromActiveSubgroup,
            savePersistence: (options = {}) =>
                invokeExternalService(getPersistenceService, "savePersistence", [options]),
            renderGroups: () => groupTabsService.renderGroups(),
            renderMultiSubgroups: () => groupTabsService.renderMultiSubgroups(),
            renderBaseTimeSelect: safeDeps.renderBaseTimeSelect,
            renderMultiRanges: safeDeps.renderMultiRanges,
            renderFixedTimeTab: safeDeps.renderFixedTimeTab,
            renderList: safeDeps.renderList,
            renderTimelineFrame: safeDeps.renderTimelineFrame,
            setCustomTooltip: safeDeps.setCustomTooltip,
            hideFloatingTooltip: safeDeps.hideFloatingTooltip,
            upgradeNativeTitleTooltips: safeDeps.upgradeNativeTitleTooltips,
            getDefaultMultiSubgroupName: safeDeps.getDefaultMultiSubgroupName,
            getDefaultFixedTimes: safeDeps.getDefaultFixedTimes,
            getDefaultFixedDate: safeDeps.getDefaultFixedDate,
            createMultiSubgroupState: safeDeps.createMultiSubgroupState,
            sanitizeMultiSubgroupName: safeDeps.sanitizeMultiSubgroupName,
            sanitizeMultiRangeTitle: safeDeps.sanitizeMultiRangeTitle,
            exportGroupToJSON: (groupIdx = getActiveGroupId()) =>
                invokeExternalService(getDataTransferService, "exportGroupToJSON", [groupIdx]),
            triggerGroupImportFor: (groupIdx = getActiveGroupId()) =>
                invokeExternalService(getDataTransferService, "triggerGroupImportFor", [groupIdx]),
            exportSubgroupToJSON: (groupIdx = getActiveGroupId(), subgroupId = "") =>
                invokeExternalService(getDataTransferService, "exportSubgroupToJSON", [groupIdx, subgroupId]),
            triggerSubgroupImportFor: (groupIdx = getActiveGroupId(), subgroupId = "") =>
                invokeExternalService(getDataTransferService, "triggerSubgroupImportFor", [groupIdx, subgroupId])
        });

        return Object.freeze({
            groupTabsService
        });
    }

    globalObj.GTVMainGroupTabsService = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
