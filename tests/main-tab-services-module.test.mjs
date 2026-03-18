import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-tab-services.js");

function loadMainTabServicesModule() {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = { window: {}, globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/main-tab-services.js" });
    return sandbox.window.GTVMainTabServices || sandbox.GTVMainTabServices || sandbox.globalThis.GTVMainTabServices;
}

describe("GTV main tab services module", () => {
    it("creates format/tab services and preserves wiring to format/tab UI methods", () => {
        const moduleApi = loadMainTabServicesModule();
        let formatConfig = null;
        let tabUiConfig = null;
        let tabOrchestratorConfig = null;
        let renderCopyFormatControlsCalled = 0;
        let switchMainTabCalls = 0;
        let refreshDividerCalls = 0;

        const services = moduleApi.createService({
            GTV_FORMAT_CONTROLS: {
                createService: (cfg) => {
                    formatConfig = cfg;
                    return {
                        id: "format-controls",
                        renderCopyFormatControls: () => {
                            renderCopyFormatControlsCalled += 1;
                        }
                    };
                }
            },
            serviceBootstrap: {
                createTabUiService: (cfg) => {
                    tabUiConfig = cfg;
                    return {
                        id: "tab-ui",
                        switchMainTab: (tab) => {
                            switchMainTabCalls += 1;
                            return tab;
                        },
                        refreshOptionToggleDividers: () => {
                            refreshDividerCalls += 1;
                        }
                    };
                },
                createTabOrchestratorService: (cfg) => {
                    tabOrchestratorConfig = cfg;
                    return { id: "tab-orchestrator" };
                }
            },
            t: (key) => key,
            savePersistence: () => {},
            renderList: () => {}
        });

        expect(services.formatControlsService.id).toBe("format-controls");
        expect(services.tabUiService.id).toBe("tab-ui");
        expect(services.tabOrchestratorService.id).toBe("tab-orchestrator");
        expect(typeof formatConfig.renderList).toBe("function");

        tabUiConfig.renderCopyFormatControls();
        expect(renderCopyFormatControlsCalled).toBe(1);

        expect(tabOrchestratorConfig.switchMainTabUi("multi")).toBe("multi");
        tabOrchestratorConfig.refreshOptionToggleDividersUi();
        expect(switchMainTabCalls).toBe(1);
        expect(refreshDividerCalls).toBe(1);
    });

    it("throws when required module APIs are missing", () => {
        const moduleApi = loadMainTabServicesModule();
        expect(() => moduleApi.createService({})).toThrow("Missing required module API: GTVFormatControls.createService");
    });
});
