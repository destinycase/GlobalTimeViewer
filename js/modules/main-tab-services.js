(function initGtvMainTabServices(globalObj) {
    "use strict";

    function requireCreateServiceModule(moduleApi, label) {
        if (!moduleApi || typeof moduleApi.createService !== "function") {
            throw new Error(`Missing required module API: ${label}.createService`);
        }
        return moduleApi;
    }

    function requireServiceBootstrap(serviceBootstrap) {
        if (!serviceBootstrap || typeof serviceBootstrap !== "object") {
            throw new Error("Missing required module API: serviceBootstrap");
        }
        if (typeof serviceBootstrap.createTabUiService !== "function") {
            throw new Error("Missing required module API: serviceBootstrap.createTabUiService");
        }
        if (typeof serviceBootstrap.createTabOrchestratorService !== "function") {
            throw new Error("Missing required module API: serviceBootstrap.createTabOrchestratorService");
        }
        return serviceBootstrap;
    }

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const formatControlsApi = requireCreateServiceModule(safeDeps.GTV_FORMAT_CONTROLS, "GTVFormatControls");
        const serviceBootstrap = requireServiceBootstrap(safeDeps.serviceBootstrap);

        const formatControlsService = formatControlsApi.createService({
            COPY_FORMAT_KEYS: safeDeps.COPY_FORMAT_KEYS,
            TIME_PART_KEYS: safeDeps.TIME_PART_KEYS,
            t: safeDeps.t,
            sanitizeCopyFormatOrder: safeDeps.sanitizeCopyFormatOrder,
            renderList: safeDeps.renderList,
            updateCopyFormatPreview: safeDeps.updateCopyFormatPreview,
            savePersistence: safeDeps.savePersistence,
            upgradeNativeTitleTooltips: safeDeps.upgradeNativeTitleTooltips,
            isShowCopyFormat: safeDeps.isShowCopyFormat,
            getDisplayFormatOrder: safeDeps.getDisplayFormatOrder,
            setDisplayFormatOrder: safeDeps.setDisplayFormatOrder,
            getDisplayFormatEnabled: safeDeps.getDisplayFormatEnabled,
            setDisplayFormatEnabled: safeDeps.setDisplayFormatEnabled,
            getDisplayTimePartsEnabled: safeDeps.getDisplayTimePartsEnabled,
            setDisplayTimePartsEnabled: safeDeps.setDisplayTimePartsEnabled,
            getCopyFormatOrder: safeDeps.getCopyFormatOrder,
            setCopyFormatOrder: safeDeps.setCopyFormatOrder,
            getCopyFormatEnabled: safeDeps.getCopyFormatEnabled,
            setCopyFormatEnabled: safeDeps.setCopyFormatEnabled,
            getCopyTimePartsEnabled: safeDeps.getCopyTimePartsEnabled,
            setCopyTimePartsEnabled: safeDeps.setCopyTimePartsEnabled,
            getActiveCopyFormatKeys: safeDeps.getActiveCopyFormatKeys,
            getActiveTimePartKeys: safeDeps.getActiveTimePartKeys
        });

        const tabUiService = serviceBootstrap.createTabUiService({
            t: safeDeps.t,
            sanitizeMainTab: safeDeps.sanitizeMainTab,
            clampGroupIndex: safeDeps.clampGroupIndex,
            normalizeGroupTabState: safeDeps.normalizeGroupTabState,
            isMultiTab: safeDeps.isMultiTab,
            isFixedTimeTab: safeDeps.isFixedTimeTab,
            getSlotCount: safeDeps.getSlotCount,
            getShowCopyFormat: safeDeps.getShowCopyFormat,
            getShowTimeline: safeDeps.getShowTimeline,
            getIsRealtime: safeDeps.getIsRealtime,
            setIsRealtime: safeDeps.setIsRealtime,
            syncRealtimeNow: safeDeps.syncRealtimeNow,
            getCurrentMainTab: safeDeps.getCurrentMainTab,
            setCurrentMainTab: safeDeps.setCurrentMainTab,
            getActiveGroupId: safeDeps.getActiveGroupId,
            setActiveGroupId: safeDeps.setActiveGroupId,
            getActiveGroupIdByMainTab: safeDeps.getActiveGroupIdByMainTab,
            setActiveGroupIdByMainTab: safeDeps.setActiveGroupIdByMainTab,
            hideFloatingTooltip: safeDeps.hideFloatingTooltip,
            syncCurrentMultiStateToActiveSubgroup: safeDeps.syncCurrentMultiStateToActiveSubgroup,
            refreshMultiRangeControls: safeDeps.refreshMultiRangeControls,
            renderBaseTimeSelect: safeDeps.renderBaseTimeSelect,
            loadCurrentMultiStateFromActiveSubgroup: safeDeps.loadCurrentMultiStateFromActiveSubgroup,
            renderGroups: safeDeps.renderGroups,
            renderMultiSubgroups: safeDeps.renderMultiSubgroups,
            renderMultiRanges: safeDeps.renderMultiRanges,
            renderFixedTimeTab: safeDeps.renderFixedTimeTab,
            renderList: safeDeps.renderList,
            renderTimelineFrame: safeDeps.renderTimelineFrame,
            updateTimeAdjustPanel: safeDeps.updateTimeAdjustPanel,
            renderCopyFormatControls: () => formatControlsService.renderCopyFormatControls(),
            savePersistence: safeDeps.savePersistence
        });

        const tabOrchestratorService = serviceBootstrap.createTabOrchestratorService({
            sanitizeMainTab: safeDeps.sanitizeMainTab,
            syncActiveFormatProfileFromState: safeDeps.syncActiveFormatProfileFromState,
            resolveFormatProfileContext: safeDeps.resolveFormatProfileContext,
            activateFormatProfileContext: safeDeps.activateFormatProfileContext,
            getSlotCount: safeDeps.getSlotCount,
            switchMainTabUi: (tab) => tabUiService.switchMainTab(tab),
            refreshOptionToggleDividersUi: () => tabUiService.refreshOptionToggleDividers()
        });

        return Object.freeze({
            formatControlsService,
            tabUiService,
            tabOrchestratorService
        });
    }

    globalObj.GTVMainTabServices = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
