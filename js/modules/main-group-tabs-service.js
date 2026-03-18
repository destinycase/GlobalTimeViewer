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

        const getPersistenceService = (typeof safeDeps.getPersistenceService === "function")
            ? safeDeps.getPersistenceService
            : (() => null);
        const getDataTransferService = (typeof safeDeps.getDataTransferService === "function")
            ? safeDeps.getDataTransferService
            : (() => null);
        const getActiveGroupId = (typeof safeDeps.getActiveGroupId === "function")
            ? safeDeps.getActiveGroupId
            : (() => 0);

        let groupTabsService = null;
        groupTabsService = groupTabsApi.createService({
            t: safeDeps.t,
            showToast: safeDeps.showToast,
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
            savePersistence: (options = {}) => {
                const persistenceService = getPersistenceService();
                if (!persistenceService || typeof persistenceService.savePersistence !== "function") return;
                return persistenceService.savePersistence(options);
            },
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
            exportGroupToJSON: (groupIdx = getActiveGroupId()) => {
                const dataTransferService = getDataTransferService();
                if (!dataTransferService || typeof dataTransferService.exportGroupToJSON !== "function") return;
                return dataTransferService.exportGroupToJSON(groupIdx);
            },
            triggerGroupImportFor: (groupIdx = getActiveGroupId()) => {
                const dataTransferService = getDataTransferService();
                if (!dataTransferService || typeof dataTransferService.triggerGroupImportFor !== "function") return;
                return dataTransferService.triggerGroupImportFor(groupIdx);
            },
            exportSubgroupToJSON: (groupIdx = getActiveGroupId(), subgroupId = "") => {
                const dataTransferService = getDataTransferService();
                if (!dataTransferService || typeof dataTransferService.exportSubgroupToJSON !== "function") return;
                return dataTransferService.exportSubgroupToJSON(groupIdx, subgroupId);
            },
            triggerSubgroupImportFor: (groupIdx = getActiveGroupId(), subgroupId = "") => {
                const dataTransferService = getDataTransferService();
                if (!dataTransferService || typeof dataTransferService.triggerSubgroupImportFor !== "function") return;
                return dataTransferService.triggerSubgroupImportFor(groupIdx, subgroupId);
            }
        });

        return Object.freeze({
            groupTabsService
        });
    }

    globalObj.GTVMainGroupTabsService = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
