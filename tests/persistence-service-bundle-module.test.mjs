import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "persistence-service-bundle.js");

function loadPersistenceServiceBundleModule() {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = { window: {}, globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/persistence-service-bundle.js" });
    return sandbox.window.GTVPersistenceServiceBundle || sandbox.GTVPersistenceServiceBundle || sandbox.globalThis.GTVPersistenceServiceBundle;
}

describe("GTV persistence service bundle module", () => {
    it("creates persistence/settings/data-transfer/ui-settings services in one bundle", () => {
        let transferExportCalled = 0;
        let resetAllCalled = 0;
        let resetPartialCalled = 0;

        const module = loadPersistenceServiceBundleModule();
        const bundleFactory = module.createService({
            GTV_STATE_PERSISTENCE: {
                createService: () => ({
                    normalizeImportedPayload: () => ({}),
                    persistStorageSnapshot: () => ({ ok: true }),
                    getStorageValue: async () => null,
                    setStorageValue: async () => ({ ok: true }),
                    savePersistence: async () => true,
                    isQuotaExceededError: () => false,
                    resetExceptGroupsAndTimezones: () => {
                        resetPartialCalled += 1;
                    },
                    resetAllSettings: () => {
                        resetAllCalled += 1;
                    }
                })
            },
            GTV_SETTINGS_IO: {
                createService: () => ({
                    applyImportedSettings: () => true
                })
            },
            GTV_DATA_TRANSFER: {
                createService: () => ({
                    exportSettingsToJSON: () => {
                        transferExportCalled += 1;
                    },
                    handleSettingsImportFile: () => {},
                    handleGroupImportFile: () => {},
                    handleSubgroupImportFile: () => {}
                })
            },
            GTV_UI_SETTINGS_ACTIONS: {
                createService: (cfg) => ({
                    exportSettingsToJSON: cfg.exportSettingsToJSON,
                    resetExceptGroupsAndTimezones: cfg.resetExceptGroupsAndTimezones,
                    resetAllSettings: cfg.resetAllSettings
                })
            }
        });

        const bundle = bundleFactory.createBundle({});
        expect(bundle.persistenceService).toBeTruthy();
        expect(bundle.settingsIoService).toBeTruthy();
        expect(bundle.dataTransferService).toBeTruthy();
        expect(bundle.uiSettingsActionsService).toBeTruthy();

        bundle.uiSettingsActionsService.exportSettingsToJSON();
        bundle.uiSettingsActionsService.resetExceptGroupsAndTimezones();
        bundle.uiSettingsActionsService.resetAllSettings();

        expect(transferExportCalled).toBe(1);
        expect(resetPartialCalled).toBe(1);
        expect(resetAllCalled).toBe(1);
    });
});
