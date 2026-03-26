import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "persistence-service-bundle.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadPersistenceServiceBundleModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVPersistenceServiceBundle", ...Object.keys(globalPatches)];
    const previous = new Map();
    keys.forEach((key) => {
        previous.set(key, {
            exists: Object.prototype.hasOwnProperty.call(globalThis, key),
            value: globalThis[key]
        });
    });

    Object.entries(globalPatches).forEach(([key, value]) => {
        globalThis[key] = value;
    });

    delete require.cache[MODULE_ID];
    require(MODULE_PATH);
    moduleCleanupStack.push(() => {
        delete require.cache[MODULE_ID];
        keys.forEach((key) => {
            const entry = previous.get(key);
            if (!entry || !entry.exists) {
                delete globalThis[key];
                return;
            }
            globalThis[key] = entry.value;
        });
    });

    return globalThis.window?.GTVPersistenceServiceBundle || globalThis.GTVPersistenceServiceBundle;
}

describe("GTV persistence service bundle module", () => {
    afterEach(() => {
        while (moduleCleanupStack.length) {
            const cleanup = moduleCleanupStack.pop();
            try {
                cleanup();
            } catch {
                // Ignore cleanup failures in tests.
            }
        }
    });

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

    it("throws when required module APIs are missing", () => {
        const module = loadPersistenceServiceBundleModule();
        expect(() => module.createService({})).toThrow("Missing required module API: GTV_STATE_PERSISTENCE.createService");
    });

    it("wires cross-service wrapper functions through the bundle", () => {
        const module = loadPersistenceServiceBundleModule();
        const calls = {
            normalizeImportedPayload: 0,
            persistStorageSnapshot: 0,
            getStorageValue: 0,
            setStorageValue: 0,
            savePersistence: 0,
            applyImportedSettings: 0,
            clearPendingGroupImport: 0,
            clearPendingSubgroupImport: 0
        };
        let settingsIoConfig = null;
        let dataTransferConfig = null;

        const persistenceService = {
            normalizeImportedPayload: (payload) => {
                calls.normalizeImportedPayload += 1;
                return { normalized: payload };
            },
            persistStorageSnapshot: (snapshot, options = {}) => {
                calls.persistStorageSnapshot += 1;
                return { snapshot, options };
            },
            getStorageValue: (key, fallback = null) => {
                calls.getStorageValue += 1;
                return `${String(key)}:${String(fallback)}`;
            },
            setStorageValue: (key, value, options = {}) => {
                calls.setStorageValue += 1;
                return { key, value, options };
            },
            savePersistence: (options = {}) => {
                calls.savePersistence += 1;
                return { saved: true, options };
            },
            isQuotaExceededError: (err) => err?.code === "QUOTA",
            resetExceptGroupsAndTimezones: () => {},
            resetAllSettings: () => {}
        };
        const settingsIoService = {
            applyImportedSettings: (importedRoot) => {
                calls.applyImportedSettings += 1;
                return { importedRoot };
            }
        };
        const dataTransferService = {
            exportSettingsToJSON: () => "exported",
            handleSettingsImportFile: (event) => `settings:${event?.type || "none"}`,
            handleGroupImportFile: (event) => `group:${event?.type || "none"}`,
            handleSubgroupImportFile: (event) => `subgroup:${event?.type || "none"}`,
            clearPendingGroupImport: () => {
                calls.clearPendingGroupImport += 1;
                return "cleared-group";
            },
            clearPendingSubgroupImport: () => {
                calls.clearPendingSubgroupImport += 1;
                return "cleared-subgroup";
            }
        };

        const bundleFactory = module.createService({
            GTV_STATE_PERSISTENCE: {
                createService: () => persistenceService
            },
            GTV_SETTINGS_IO: {
                createService: (cfg) => {
                    settingsIoConfig = cfg;
                    return settingsIoService;
                }
            },
            GTV_DATA_TRANSFER: {
                createService: (cfg) => {
                    dataTransferConfig = cfg;
                    return dataTransferService;
                }
            },
            GTV_UI_SETTINGS_ACTIONS: {
                createService: (cfg) => cfg
            }
        });

        const bundle = bundleFactory.createBundle({
            document: { id: "doc-ref" },
            window: { id: "win-ref" }
        });
        expect(bundle.persistenceService).toBe(persistenceService);
        expect(bundle.settingsIoService).toBe(settingsIoService);
        expect(bundle.dataTransferService).toBe(dataTransferService);

        expect(settingsIoConfig.normalizeImportedPayload({ ok: true })).toEqual({ normalized: { ok: true } });
        expect(settingsIoConfig.persistStorageSnapshot({ state: 1 }, { force: true })).toEqual({
            snapshot: { state: 1 },
            options: { force: true }
        });
        expect(settingsIoConfig.getStorageValue("key", "fallback")).toBe("key:fallback");
        expect(settingsIoConfig.setStorageValue("key", "value", { ttl: 1 })).toEqual({
            key: "key",
            value: "value",
            options: { ttl: 1 }
        });
        expect(settingsIoConfig.savePersistence({ immediate: true })).toEqual({
            saved: true,
            options: { immediate: true }
        });

        expect(dataTransferConfig.savePersistence({ sync: true })).toEqual({
            saved: true,
            options: { sync: true }
        });
        expect(dataTransferConfig.applyImportedSettings({ group: "A" })).toEqual({
            importedRoot: { group: "A" }
        });
        expect(dataTransferConfig.isQuotaExceededError({ code: "QUOTA" })).toBe(true);
        expect(dataTransferConfig.document).toEqual({ id: "doc-ref" });
        expect(dataTransferConfig.window).toEqual({ id: "win-ref" });

        expect(bundle.uiSettingsActionsService.exportSettingsToJSON()).toBe("exported");
        expect(bundle.uiSettingsActionsService.handleSettingsImportFile({ type: "settings-file" })).toBe("settings:settings-file");
        expect(bundle.uiSettingsActionsService.handleGroupImportFile({ type: "group-file" })).toBe("group:group-file");
        expect(bundle.uiSettingsActionsService.handleSubgroupImportFile({ type: "subgroup-file" })).toBe("subgroup:subgroup-file");
        expect(bundle.uiSettingsActionsService.clearPendingGroupImport()).toBe("cleared-group");
        expect(bundle.uiSettingsActionsService.clearPendingSubgroupImport()).toBe("cleared-subgroup");

        expect(calls.normalizeImportedPayload).toBe(1);
        expect(calls.persistStorageSnapshot).toBe(1);
        expect(calls.getStorageValue).toBe(1);
        expect(calls.setStorageValue).toBe(1);
        expect(calls.savePersistence).toBe(2);
        expect(calls.applyImportedSettings).toBe(1);
        expect(calls.clearPendingGroupImport).toBe(1);
        expect(calls.clearPendingSubgroupImport).toBe(1);
    });
});
