import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "image-export-actions.js");

function loadImageExportActionsModule(options = {}) {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = {
        window: {},
        globalThis: {},
        console: options.console || console
    };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/image-export-actions.js" });
    return sandbox.window.GTVImageExportActions || sandbox.GTVImageExportActions || sandbox.globalThis.GTVImageExportActions;
}

describe("GTV image export actions module", () => {
    it("delegates save actions through bound image export service", async () => {
        const module = loadImageExportActionsModule();
        const calls = [];
        const service = module.createService({
            imageExportApi: {
                createService: () => ({
                    saveTimezoneTableImage: async () => { calls.push("timezone"); },
                    saveMultiRangeSingleImage: async (idx) => { calls.push(`single:${idx}`); }
                })
            }
        });

        await service.saveTimezoneTableImage();
        await service.saveMultiRangeSingleImage(2);

        expect(calls).toEqual(["timezone", "single:2"]);
    });

    it("falls back to static image export API when createService is unavailable", async () => {
        const module = loadImageExportActionsModule();
        let depsFromCall = null;
        const service = module.createService({
            t: (key) => key,
            showToast: () => { },
            imageExportApi: {
                saveTimezoneTableImage: async (deps) => {
                    depsFromCall = deps;
                }
            }
        });

        await service.saveTimezoneTableImage();

        expect(depsFromCall).toBeTruthy();
        expect(typeof depsFromCall.t).toBe("function");
        expect(typeof depsFromCall.showToast).toBe("function");
    });

    it("exposes image export deps builder with renderer callbacks", () => {
        const module = loadImageExportActionsModule();
        const service = module.createService({
            renderTimezoneTableToPngDataUrl: async () => "data:image/png;base64,AAA",
            getTimezoneTableImageFilename: () => "name"
        });
        const deps = service.getImageExportDeps();

        expect(typeof deps.renderTimezoneTableToPngDataUrl).toBe("function");
        expect(typeof deps.getTimezoneTableImageFilename).toBe("function");
    });

    it("returns undefined when no compatible image export API method exists", async () => {
        const module = loadImageExportActionsModule({
            console: { ...console, error: () => { } }
        });
        const service = module.createService({
            imageExportApi: {}
        });

        const result = await service.saveMultiRangeTitlesImage();
        expect(result).toBeUndefined();
    });
});
