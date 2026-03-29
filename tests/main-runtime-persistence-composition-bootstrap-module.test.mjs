import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(
    process.cwd(),
    "js",
    "modules",
    "main-runtime-persistence-composition-bootstrap.js"
);
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimePersistenceCompositionBootstrapModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimePersistenceCompositionBootstrap", ...Object.keys(globalPatches)];
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

    return (
        globalThis.window?.GTVMainRuntimePersistenceCompositionBootstrap
        || globalThis.GTVMainRuntimePersistenceCompositionBootstrap
    );
}

describe("GTV main runtime persistence composition bootstrap module", () => {
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

    it("builds persistence composition services through builder/core contracts", () => {
        const moduleApi = loadMainRuntimePersistenceCompositionBootstrapModule();
        const buildPersistenceCompositionConfig = vi.fn(() => ({ kind: "persistence-config" }));
        const createMainPersistenceCompositionServices = vi.fn(() => ({
            mainGroupTabsService: { name: "main-group-tabs-service" },
            groupTabsService: { name: "group-tabs-service" },
            mainPersistenceSnapshotService: { name: "snapshot-service" },
            mainPersistenceServices: { name: "main-persistence-services" },
            persistenceServices: { name: "persistence-services" },
            persistenceService: { name: "persistence-service" },
            settingsIoService: { name: "settings-io-service" },
            dataTransferService: { name: "data-transfer-service" },
            uiSettingsActionsService: { name: "ui-settings-actions-service" }
        }));

        const service = moduleApi.createService({
            mainCompositionConfigBuilderService: {
                buildPersistenceCompositionConfig
            },
            mainCoreServices: {
                createMainPersistenceCompositionServices
            }
        });

        expect(buildPersistenceCompositionConfig).toHaveBeenCalledTimes(1);
        expect(createMainPersistenceCompositionServices).toHaveBeenCalledWith({ kind: "persistence-config" });
        expect(service.mainGroupTabsService).toEqual({ name: "main-group-tabs-service" });
        expect(service.persistenceService).toEqual({ name: "persistence-service" });
        expect(service.uiSettingsActionsService).toEqual({ name: "ui-settings-actions-service" });
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit dependency errors when required contracts are missing", () => {
        const moduleApi = loadMainRuntimePersistenceCompositionBootstrapModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required dependency: mainCompositionConfigBuilderService"
        );
        expect(() => moduleApi.createService({
            mainCompositionConfigBuilderService: {},
            mainCoreServices: {}
        })).toThrow(
            "Missing required dependency: mainCompositionConfigBuilderService.buildPersistenceCompositionConfig"
        );
    });
});
