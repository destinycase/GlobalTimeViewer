import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-ui-services-bootstrap.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const cleanup = [];

function loadModule() {
    const previousWindow = globalThis.window;
    globalThis.window = {};
    delete require.cache[MODULE_ID];
    require(MODULE_PATH);
    cleanup.push(() => {
        delete require.cache[MODULE_ID];
        if (previousWindow === undefined) delete globalThis.window;
        else globalThis.window = previousWindow;
    });
    return globalThis.window.GTVMainRuntimeUiServicesBootstrap;
}

describe("GTV main runtime UI services bootstrap", () => {
    afterEach(() => {
        while (cleanup.length) cleanup.pop()();
    });

    it("assembles tab, image export and app state configs beside their services", () => {
        const moduleApi = loadModule();
        const createMainTabServices = vi.fn(() => ({
            formatControlsService: { name: "format" },
            tabUiService: { name: "tabs" },
            tabOrchestratorService: { name: "orchestrator" }
        }));
        const createMainImageExportNamingProxy = vi.fn(() => ({
            sanitizeFilenamePart: (value) => value,
            formatDateTimeByTimezone: () => "formatted",
            getTimezoneTableImageFilename: () => "table.png",
            getMultiRangeTableImageFilename: () => "ranges.png",
            getMultiRangeTitlesImageFilename: () => "titles.png"
        }));
        const createMainImageExportServices = vi.fn(() => ({
            imageExportNamingService: { name: "image-naming" },
            imageExportActionsService: { name: "image-actions" }
        }));
        const createMainAppStateServices = vi.fn(() => ({
            appStatePatcherService: { name: "state-patcher" },
            appPersistenceStateService: { name: "state-persistence" }
        }));
        const imageExportApi = { name: "image-api" };
        const imageNamingServiceRef = () => ({ name: "naming-ref" });
        const stateSource = () => ({ name: "state-source" });
        const directStateSetters = { setCurrentMainTab: vi.fn() };

        const services = moduleApi.createService({
            gtvT: (key) => `tx:${key}`,
            getImageExportNamingServiceRef: imageNamingServiceRef,
            GTV_IMAGE_EXPORT: imageExportApi,
            getMainAppStateSource: stateSource,
            directStateSetters,
            mainCoreServices: {
                createMainTabServices,
                createMainImageExportNamingProxy,
                createMainImageExportServices,
                createMainAppStateServices
            }
        });

        expect(createMainTabServices.mock.calls[0][0].t("hello")).toBe("tx:hello");
        expect(createMainImageExportNamingProxy.mock.calls[0][0].getImageExportNamingService).toBe(imageNamingServiceRef);
        expect(createMainImageExportServices.mock.calls[0][0].imageExportApi).toBe(imageExportApi);
        expect(createMainAppStateServices.mock.calls[0][0].getStateSource).toBe(stateSource);
        expect(createMainAppStateServices.mock.calls[0][0].stateSetters).toBe(directStateSetters);
        expect(services.tabOrchestratorService).toEqual({ name: "orchestrator" });
        expect(services.sanitizeFilenamePart("table")).toBe("table");
        expect(services.imageExportActionsService).toEqual({ name: "image-actions" });
        expect(services.appPersistenceStateService).toEqual({ name: "state-persistence" });
        expect(Object.isFrozen(services)).toBe(true);
    });

    it("fails early when a required feature factory is unavailable", () => {
        const moduleApi = loadModule();
        expect(() => moduleApi.createService({ mainCoreServices: {} })).toThrow(
            "Missing required dependency: mainCoreServices.createMainTabServices"
        );
    });
});
