import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-persistence-composition-services.js");

function loadMainPersistenceCompositionServicesModule() {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = { window: {}, globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/main-persistence-composition-services.js" });
    return sandbox.window.GTVMainPersistenceCompositionServices
        || sandbox.GTVMainPersistenceCompositionServices
        || sandbox.globalThis.GTVMainPersistenceCompositionServices;
}

describe("GTV main persistence composition services module", () => {
    it("composes group tabs, persistence snapshot and persistence services", () => {
        const moduleApi = loadMainPersistenceCompositionServicesModule();
        let groupTabsConfig = null;
        let snapshotConfig = null;
        let persistenceConfig = null;
        let renderGroupsCount = 0;
        let renderSubgroupsCount = 0;
        const persistenceService = { id: "persistence" };
        const dataTransferService = { id: "data-transfer" };

        const result = moduleApi.createService({
            GTV_MAIN_GROUP_TABS_SERVICE: {
                createService: (config) => {
                    groupTabsConfig = config;
                    return {
                        groupTabsService: {
                            renderGroups: () => { renderGroupsCount += 1; },
                            renderMultiSubgroups: () => { renderSubgroupsCount += 1; }
                        }
                    };
                }
            },
            GTV_MAIN_PERSISTENCE_SNAPSHOT_SERVICES: {
                createService: (config) => {
                    snapshotConfig = config;
                    return { id: "snapshot-service" };
                }
            },
            GTV_MAIN_PERSISTENCE_SERVICES: {
                createService: (config) => {
                    persistenceConfig = config;
                    return {
                        persistenceServices: { id: "bundle" },
                        persistenceService,
                        settingsIoService: { id: "settings-io" },
                        dataTransferService,
                        uiSettingsActionsService: { id: "ui-settings-actions" }
                    };
                }
            },
            groupTabsConfig: {
                t: (key) => key
            },
            snapshotConfig: {
                now: () => 123
            },
            persistenceConfig: {
                VERSION: "1.0.0"
            }
        });

        expect(result.groupTabsService).toBeTruthy();
        expect(result.mainPersistenceSnapshotService.id).toBe("snapshot-service");
        expect(result.persistenceServices.id).toBe("bundle");
        expect(result.persistenceService).toBe(persistenceService);
        expect(result.dataTransferService).toBe(dataTransferService);
        expect(groupTabsConfig.t("x")).toBe("x");
        expect(snapshotConfig.now()).toBe(123);
        expect(persistenceConfig.VERSION).toBe("1.0.0");
        expect(groupTabsConfig.getPersistenceService()).toBe(persistenceService);
        expect(groupTabsConfig.getDataTransferService()).toBe(dataTransferService);

        persistenceConfig.renderGroups();
        persistenceConfig.renderMultiSubgroups();
        expect(renderGroupsCount).toBe(1);
        expect(renderSubgroupsCount).toBe(1);
    });

    it("throws when required module APIs are missing", () => {
        const moduleApi = loadMainPersistenceCompositionServicesModule();
        expect(() => moduleApi.createService({})).toThrow("Missing required module API: GTVMainGroupTabsService.createService");
    });
});
