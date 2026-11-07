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

        function pickDeps(depNames = []) {
            const resolved = {};
            depNames.forEach((depName) => {
                resolved[depName] = safeDeps[depName];
            });
            return resolved;
        }

        const formatControlsApi = requireCreateServiceModule(safeDeps.GTV_FORMAT_CONTROLS, "GTVFormatControls");
        const serviceBootstrap = requireServiceBootstrap(safeDeps.serviceBootstrap);

        const formatControlsService = formatControlsApi.createService({
            ...pickDeps([
                "COPY_FORMAT_KEYS",
                "TIME_PART_KEYS",
                "t",
                "sanitizeCopyFormatOrder",
                "renderList",
                "updateCopyFormatPreview",
                "savePersistence",
                "upgradeNativeTitleTooltips",
                "isShowCopyFormat",
                "getDisplayFormatOrder",
                "setDisplayFormatOrder",
                "getDisplayFormatEnabled",
                "setDisplayFormatEnabled",
                "getDisplayTimePartsEnabled",
                "setDisplayTimePartsEnabled",
                "getCopyFormatOrder",
                "setCopyFormatOrder",
                "getCopyFormatEnabled",
                "setCopyFormatEnabled",
                "getCopyTimePartsEnabled",
                "setCopyTimePartsEnabled",
                "getActiveCopyFormatKeys",
                "getActiveTimePartKeys",
                "patchAppState",
                "getActiveFormatProfileContext",
                "sanitizeCopyFormatOrderForContext",
                "syncActiveFormatProfileFromState"
            ])
        });

        const tabUiService = serviceBootstrap.createTabUiService({
            ...pickDeps([
                "t",
                "sanitizeMainTab",
                "clampGroupIndex",
                "normalizeGroupTabState",
                "isMultiTab",
                "isFixedTimeTab",
                "getSlotCount",
                "getShowCopyFormat",
                "getShowTimeline",
                "getIsRealtime",
                "setIsRealtime",
                "syncRealtimeNow",
                "getCurrentMainTab",
                "setCurrentMainTab",
                "getActiveGroupId",
                "setActiveGroupId",
                "getActiveGroupIdByMainTab",
                "setActiveGroupIdByMainTab",
                "hideFloatingTooltip",
                "syncCurrentMultiStateToActiveSubgroup",
                "refreshMultiRangeControls",
                "renderBaseTimeSelect",
                "loadCurrentMultiStateFromActiveSubgroup",
                "renderGroups",
                "renderMultiSubgroups",
                "renderMultiRanges",
                "renderFixedTimeTab",
                "renderList",
                "renderTimelineFrame",
                "updateTimeAdjustPanel"
            ]),
            renderCopyFormatControls: () => formatControlsService.renderCopyFormatControls(),
            ...pickDeps([
                "savePersistence"
            ])
        });

        const tabOrchestratorService = serviceBootstrap.createTabOrchestratorService({
            ...pickDeps([
                "sanitizeMainTab",
                "syncActiveFormatProfileFromState",
                "resolveFormatProfileContext",
                "activateFormatProfileContext",
                "getSlotCount"
            ]),
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
