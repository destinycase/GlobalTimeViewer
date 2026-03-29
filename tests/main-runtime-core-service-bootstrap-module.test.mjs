import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-core-service-bootstrap.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeCoreServiceBootstrapModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeCoreServiceBootstrap", ...Object.keys(globalPatches)];
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
        globalThis.window?.GTVMainRuntimeCoreServiceBootstrap
        || globalThis.GTVMainRuntimeCoreServiceBootstrap
    );
}

describe("GTV main runtime core service bootstrap module", () => {
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

    it("builds select/timezone-search/snapshot services from builder and core factory deps", () => {
        const moduleApi = loadMainRuntimeCoreServiceBootstrapModule();
        const buildMainSelectServicesConfig = vi.fn(() => ({ kind: "select-config" }));
        const buildTimezoneSearchConfig = vi.fn(() => ({ kind: "timezone-config" }));
        const buildSnapshotFormatConfig = vi.fn(() => ({ kind: "snapshot-config" }));
        const createMainSelectServices = vi.fn(() => ({
            adjustSelectWidthForContent: () => "adjusted",
            refreshSelectWidths: () => "refreshed",
            renderBaseTimeSelect: () => "rendered"
        }));
        const createTimezoneSearchService = vi.fn(() => ({ name: "timezone-search-service" }));
        const createSnapshotFormatService = vi.fn(() => ({ name: "snapshot-format-service" }));

        const service = moduleApi.createService({
            mainRuntimeServiceConfigBuilderService: {
                buildMainSelectServicesConfig,
                buildTimezoneSearchConfig,
                buildSnapshotFormatConfig
            },
            mainCoreServices: {
                createMainSelectServices,
                createTimezoneSearchService,
                createSnapshotFormatService
            }
        });

        expect(buildMainSelectServicesConfig).toHaveBeenCalledTimes(1);
        expect(buildTimezoneSearchConfig).toHaveBeenCalledTimes(1);
        expect(buildSnapshotFormatConfig).toHaveBeenCalledTimes(1);
        expect(createMainSelectServices).toHaveBeenCalledWith({ kind: "select-config" });
        expect(createTimezoneSearchService).toHaveBeenCalledWith({ kind: "timezone-config" });
        expect(createSnapshotFormatService).toHaveBeenCalledWith({ kind: "snapshot-config" });
        expect(typeof service.adjustSelectWidthForContent).toBe("function");
        expect(service.timezoneSearchService).toEqual({ name: "timezone-search-service" });
        expect(service.snapshotFormatService).toEqual({ name: "snapshot-format-service" });
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit dependency errors for missing builder or core service contracts", () => {
        const moduleApi = loadMainRuntimeCoreServiceBootstrapModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required dependency: mainRuntimeServiceConfigBuilderService"
        );
        expect(() => moduleApi.createService({
            mainRuntimeServiceConfigBuilderService: {},
            mainCoreServices: {}
        })).toThrow(
            "Missing required dependency: mainRuntimeServiceConfigBuilderService.buildMainSelectServicesConfig"
        );
    });
});
