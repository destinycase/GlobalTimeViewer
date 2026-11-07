(function initGtvMainPersistenceCompositionServices(globalObj) {
    "use strict";

    function requireCreateServiceModule(moduleApi, label) {
        if (!moduleApi || typeof moduleApi.createService !== "function") {
            throw new Error(`Missing required module API: ${label}.createService`);
        }
        return moduleApi;
    }

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const mainGroupTabsApi = requireCreateServiceModule(
            safeDeps.GTV_MAIN_GROUP_TABS_SERVICE,
            "GTVMainGroupTabsService"
        );
        const mainPersistenceSnapshotApi = requireCreateServiceModule(
            safeDeps.GTV_MAIN_PERSISTENCE_SNAPSHOT_SERVICES,
            "GTVMainPersistenceSnapshotServices"
        );
        const mainPersistenceApi = requireCreateServiceModule(
            safeDeps.GTV_MAIN_PERSISTENCE_SERVICES,
            "GTVMainPersistenceServices"
        );

        const groupTabsConfig = (safeDeps.groupTabsConfig && typeof safeDeps.groupTabsConfig === "object")
            ? safeDeps.groupTabsConfig
            : {};
        const snapshotConfig = (safeDeps.snapshotConfig && typeof safeDeps.snapshotConfig === "object")
            ? safeDeps.snapshotConfig
            : {};
        const persistenceConfig = (safeDeps.persistenceConfig && typeof safeDeps.persistenceConfig === "object")
            ? safeDeps.persistenceConfig
            : {};

        let persistenceService = null;
        let dataTransferService = null;
        let groupTabsService = null;

        const mainGroupTabsService = mainGroupTabsApi.createService({
            ...groupTabsConfig,
            getPersistenceService: () => persistenceService,
            getDataTransferService: () => dataTransferService
        });
        groupTabsService = mainGroupTabsService?.groupTabsService || null;

        const mainPersistenceSnapshotService = mainPersistenceSnapshotApi.createService(snapshotConfig);
        const mainPersistenceServices = mainPersistenceApi.createService({
            ...persistenceConfig,
            renderGroups: () => {
                if (groupTabsService && typeof groupTabsService.renderGroups === "function") {
                    groupTabsService.renderGroups();
                }
            },
            renderMultiSubgroups: () => {
                if (groupTabsService && typeof groupTabsService.renderMultiSubgroups === "function") {
                    groupTabsService.renderMultiSubgroups();
                }
            }
        });

        const persistenceServices = mainPersistenceServices?.persistenceServices || null;
        persistenceService = mainPersistenceServices?.persistenceService || null;
        const settingsIoService = mainPersistenceServices?.settingsIoService || null;
        dataTransferService = mainPersistenceServices?.dataTransferService || null;
        const uiSettingsActionsService = mainPersistenceServices?.uiSettingsActionsService || null;

        return Object.freeze({
            mainGroupTabsService,
            groupTabsService,
            mainPersistenceSnapshotService,
            mainPersistenceServices,
            persistenceServices,
            persistenceService,
            settingsIoService,
            dataTransferService,
            uiSettingsActionsService
        });
    }

    globalObj.GTVMainPersistenceCompositionServices = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);
