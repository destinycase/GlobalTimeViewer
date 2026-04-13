import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-tab-services.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainTabServicesModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainTabServices", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainTabServices || globalThis.GTVMainTabServices;
}

describe("GTV main tab services module", () => {
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
    it("creates format/tab services and preserves wiring to format/tab UI methods", () => {
        const moduleApi = loadMainTabServicesModule();
        let formatConfig = null;
        let tabUiConfig = null;
        let tabOrchestratorConfig = null;
        let renderCopyFormatControlsCalled = 0;
        let switchMainTabCalls = 0;
        let refreshDividerCalls = 0;
        const patchAppState = () => {};
        const getActiveFormatProfileContext = () => "live";
        const sanitizeCopyFormatOrderForContext = (order) => order;
        const syncActiveFormatProfileFromState = () => {};

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
            renderList: () => {},
            patchAppState,
            getActiveFormatProfileContext,
            sanitizeCopyFormatOrderForContext,
            syncActiveFormatProfileFromState
        });

        expect(services.formatControlsService.id).toBe("format-controls");
        expect(services.tabUiService.id).toBe("tab-ui");
        expect(services.tabOrchestratorService.id).toBe("tab-orchestrator");
        expect(typeof formatConfig.renderList).toBe("function");
        expect(formatConfig.patchAppState).toBe(patchAppState);
        expect(formatConfig.getActiveFormatProfileContext).toBe(getActiveFormatProfileContext);
        expect(formatConfig.sanitizeCopyFormatOrderForContext).toBe(sanitizeCopyFormatOrderForContext);
        expect(formatConfig.syncActiveFormatProfileFromState).toBe(syncActiveFormatProfileFromState);

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
