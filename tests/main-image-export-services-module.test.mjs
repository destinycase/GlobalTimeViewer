import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-image-export-services.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainImageExportServicesModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainImageExportServices", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainImageExportServices || globalThis.GTVMainImageExportServices;
}

describe("GTV main image export services module", () => {
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
    it("creates naming/actions services with injected dependencies", () => {
        const moduleApi = loadMainImageExportServicesModule();
        let namingConfig = null;
        let actionsConfig = null;

        const services = moduleApi.createService({
            GTV_IMAGE_EXPORT_NAMING: {
                createService: (cfg) => {
                    namingConfig = cfg;
                    return { id: "naming" };
                }
            },
            GTV_IMAGE_EXPORT_ACTIONS: {
                createService: (cfg) => {
                    actionsConfig = cfg;
                    return { id: "actions" };
                }
            },
            imageExportApi: { id: "export-api" },
            t: (key) => key,
            pad: (v) => String(v).padStart(2, "0"),
            timeService: { id: "time-service" },
            getCustomOffsetMinutes: () => 0,
            getBaseTimezoneRef: () => ({ id: "utc" }),
            getBaseTime: () => new Date(),
            getActiveGroupName: () => "Group A",
            getZoneAbbreviation: () => "UTC",
            sanitizeMultiSubgroupName: (value) => value,
            getCurrentMultiSubgroupName: () => "Subgroup 1",
            showToast: () => {},
            isMultiTab: () => false,
            ensureMultiRangeState: () => {},
            detectForeignObjectRendererSupport: async () => true,
            renderTimezoneTableToPngDataUrl: async () => "data:image/png;base64,aaa",
            renderTimezoneTableFallbackDataUrl: async () => "data:image/png;base64,bbb",
            renderMultiRangesToPngDataUrl: async () => "data:image/png;base64,ccc",
            renderMultiRangeSingleToPngDataUrl: async () => "data:image/png;base64,ddd",
            renderMultiRangesFallbackDataUrl: async () => "data:image/png;base64,eee",
            renderMultiRangeTitlesToPngDataUrl: async () => "data:image/png;base64,fff",
            getTimezoneTableImageFilename: () => "table.png",
            getMultiRangeTableImageFilename: () => "multi.png",
            getMultiRangeTitlesImageFilename: () => "titles.png",
            getMultiRanges: () => [],
            isDomExceptionLike: () => false,
            setCanUseForeignObjectRenderer: () => {}
        });

        expect(services.imageExportNamingService.id).toBe("naming");
        expect(services.imageExportActionsService.id).toBe("actions");

        expect(typeof namingConfig.getBaseTimezoneRef).toBe("function");
        expect(typeof namingConfig.getCurrentMultiSubgroupName).toBe("function");
        expect(actionsConfig.imageExportApi.id).toBe("export-api");
        expect(typeof actionsConfig.detectForeignObjectRendererSupport).toBe("function");
        expect(typeof actionsConfig.setCanUseForeignObjectRenderer).toBe("function");
    });

    it("throws when required module APIs are missing", () => {
        const moduleApi = loadMainImageExportServicesModule();
        expect(() => moduleApi.createService({})).toThrow("Missing required module API: GTVImageExportNaming.createService");
    });
});
