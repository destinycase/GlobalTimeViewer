import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "image-export-actions.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadImageExportActionsModule(options = {}) {
    const globalPatches = {
        window: {},
        console: options.console || console
    };
    const keys = ["window", "console", "GTVImageExportActions", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVImageExportActions || globalThis.GTVImageExportActions;
}

describe("GTV image export actions module", () => {
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

    it("prefers deps.windowRef image export API over global window API", async () => {
        const module = loadImageExportActionsModule({
            window: {
                GTVImageExport: {
                    saveTimezoneTableImage: async () => {
                        throw new Error("global window api should not be used");
                    }
                }
            }
        });
        const calls = [];
        const service = module.createService({
            windowRef: {
                GTVImageExport: {
                    createService: () => ({
                        saveTimezoneTableImage: async () => {
                            calls.push("windowRef");
                        }
                    })
                }
            }
        });

        await service.saveTimezoneTableImage();

        expect(calls).toEqual(["windowRef"]);
    });

    it("prefers deps.getWindowRefOrNull image export API over direct window dependency", async () => {
        const module = loadImageExportActionsModule({
            window: {
                GTVImageExport: {
                    saveTimezoneTableImage: async () => {
                        throw new Error("global window api should not be used");
                    }
                }
            }
        });
        const calls = [];
        const service = module.createService({
            window: {
                GTVImageExport: {
                    createService: () => {
                        throw new Error("direct window dep should not be used");
                    }
                }
            },
            getWindowRefOrNull: () => ({
                GTVImageExport: {
                    createService: () => ({
                        saveTimezoneTableImage: async () => {
                            calls.push("getWindowRefOrNull");
                        }
                    })
                }
            })
        });

        await service.saveTimezoneTableImage();

        expect(calls).toEqual(["getWindowRefOrNull"]);
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
