import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-image-export-services.js");

function loadMainImageExportServicesModule() {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = { window: {}, globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/main-image-export-services.js" });
    return sandbox.window.GTVMainImageExportServices || sandbox.GTVMainImageExportServices || sandbox.globalThis.GTVMainImageExportServices;
}

describe("GTV main image export services module", () => {
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
