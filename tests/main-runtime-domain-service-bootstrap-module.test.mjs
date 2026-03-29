import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-domain-service-bootstrap.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeDomainServiceBootstrapModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeDomainServiceBootstrap", ...Object.keys(globalPatches)];
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
        globalThis.window?.GTVMainRuntimeDomainServiceBootstrap
        || globalThis.GTVMainRuntimeDomainServiceBootstrap
    );
}

describe("GTV main runtime domain service bootstrap module", () => {
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

    it("builds runtime domain services through builder/core method contracts", () => {
        const moduleApi = loadMainRuntimeDomainServiceBootstrapModule();

        const buildMainFixedTimeServicesConfig = vi.fn(() => ({ kind: "fixed-config" }));
        const buildMainMultiRangeServicesConfig = vi.fn(() => ({ kind: "multi-range-config" }));
        const buildMainTimeAdjustServicesConfig = vi.fn(() => ({ kind: "time-adjust-config" }));
        const buildMainTabServicesConfig = vi.fn(() => ({ kind: "tab-config" }));
        const buildMainGroupStateServicesConfig = vi.fn(() => ({ kind: "group-state-config" }));
        const buildMainImageExportNamingProxyConfig = vi.fn(() => ({ kind: "image-naming-config" }));
        const buildMainImageExportServicesConfig = vi.fn(() => ({ kind: "image-export-config" }));
        const buildMainAppStateServicesConfig = vi.fn(() => ({ kind: "app-state-config" }));

        const createMainFixedTimeServices = vi.fn(() => ({
            fixedTimeCoreService: { name: "fixed-core-service" },
            fixedTimeTimelineService: { name: "fixed-timeline-service" },
            fixedTimeActionsService: { name: "fixed-actions-service" }
        }));
        const createMainMultiRangeServices = vi.fn(() => ({
            multiRangeRenderService: { name: "multi-range-render-service" },
            multiRangeCopyService: { name: "multi-range-copy-service" },
            copyActionsService: { name: "copy-actions-service" }
        }));
        const createMainTimeAdjustServices = vi.fn(() => ({
            timeAdjustUiService: { name: "time-adjust-ui-service" },
            multiBulkToolsService: { name: "multi-bulk-tools-service" },
            timeAdjustActionsService: { name: "time-adjust-actions-service" }
        }));
        const createMainTabServices = vi.fn(() => ({
            formatControlsService: { name: "format-controls-service" },
            tabUiService: { name: "tab-ui-service" },
            tabOrchestratorService: { name: "tab-orchestrator-service" }
        }));
        const createMainGroupStateServices = vi.fn(() => ({
            multiStateService: { name: "multi-state-service" },
            groupStateService: { name: "group-state-service" }
        }));
        const createMainImageExportNamingProxy = vi.fn(() => ({
            sanitizeFilenamePart: (value) => value,
            formatDateTimeByTimezone: () => "formatted",
            getTimezoneTableImageFilename: () => "timezone.png",
            getMultiRangeTableImageFilename: () => "multi-range.png",
            getMultiRangeTitlesImageFilename: () => "multi-range-titles.png"
        }));
        const createMainImageExportServices = vi.fn(() => ({
            imageExportNamingService: { name: "image-export-naming-service" },
            imageExportActionsService: { name: "image-export-actions-service" }
        }));
        const createMainAppStateServices = vi.fn(() => ({
            appStatePatcherService: { name: "app-state-patcher-service" },
            appPersistenceStateService: { name: "app-persistence-state-service" }
        }));

        const service = moduleApi.createService({
            mainRuntimeServiceConfigBuilderService: {
                buildMainFixedTimeServicesConfig,
                buildMainMultiRangeServicesConfig,
                buildMainTimeAdjustServicesConfig,
                buildMainTabServicesConfig,
                buildMainGroupStateServicesConfig,
                buildMainImageExportNamingProxyConfig,
                buildMainImageExportServicesConfig,
                buildMainAppStateServicesConfig
            },
            mainCoreServices: {
                createMainFixedTimeServices,
                createMainMultiRangeServices,
                createMainTimeAdjustServices,
                createMainTabServices,
                createMainGroupStateServices,
                createMainImageExportNamingProxy,
                createMainImageExportServices,
                createMainAppStateServices
            }
        });

        expect(buildMainFixedTimeServicesConfig).toHaveBeenCalledTimes(1);
        expect(buildMainMultiRangeServicesConfig).toHaveBeenCalledTimes(1);
        expect(buildMainTimeAdjustServicesConfig).toHaveBeenCalledTimes(1);
        expect(buildMainTabServicesConfig).toHaveBeenCalledTimes(1);
        expect(buildMainGroupStateServicesConfig).toHaveBeenCalledTimes(1);
        expect(buildMainImageExportNamingProxyConfig).toHaveBeenCalledTimes(1);
        expect(buildMainImageExportServicesConfig).toHaveBeenCalledTimes(1);
        expect(buildMainAppStateServicesConfig).toHaveBeenCalledTimes(1);

        expect(createMainFixedTimeServices).toHaveBeenCalledWith({ kind: "fixed-config" });
        expect(createMainMultiRangeServices).toHaveBeenCalledWith({ kind: "multi-range-config" });
        expect(createMainTimeAdjustServices).toHaveBeenCalledWith({ kind: "time-adjust-config" });
        expect(createMainTabServices).toHaveBeenCalledWith({ kind: "tab-config" });
        expect(createMainGroupStateServices).toHaveBeenCalledWith({ kind: "group-state-config" });
        expect(createMainImageExportNamingProxy).toHaveBeenCalledWith({ kind: "image-naming-config" });
        expect(createMainImageExportServices).toHaveBeenCalledWith({ kind: "image-export-config" });
        expect(createMainAppStateServices).toHaveBeenCalledWith({ kind: "app-state-config" });

        expect(service.fixedTimeCoreService).toEqual({ name: "fixed-core-service" });
        expect(service.copyActionsService).toEqual({ name: "copy-actions-service" });
        expect(service.tabOrchestratorService).toEqual({ name: "tab-orchestrator-service" });
        expect(service.imageExportActionsService).toEqual({ name: "image-export-actions-service" });
        expect(service.appPersistenceStateService).toEqual({ name: "app-persistence-state-service" });
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit dependency errors when required module contracts are missing", () => {
        const moduleApi = loadMainRuntimeDomainServiceBootstrapModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required dependency: mainRuntimeServiceConfigBuilderService"
        );
        expect(() => moduleApi.createService({
            mainRuntimeServiceConfigBuilderService: {},
            mainCoreServices: {}
        })).toThrow(
            "Missing required dependency: mainRuntimeServiceConfigBuilderService.buildMainFixedTimeServicesConfig"
        );
    });
});
