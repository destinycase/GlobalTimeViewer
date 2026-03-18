import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-foundation-services.js");

function loadMainFoundationServicesModule() {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = { window: {}, globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/main-foundation-services.js" });
    return sandbox.window.GTVMainFoundationServices || sandbox.GTVMainFoundationServices || sandbox.globalThis.GTVMainFoundationServices;
}

describe("GTV main foundation services module", () => {
    it("creates foundational services and ui utility bindings", async () => {
        const moduleApi = loadMainFoundationServicesModule();
        let resetCalled = 0;
        let clipboardPayload = "";
        let feedbackConfig = null;
        let calculatorConfig = null;

        const service = moduleApi.createService({
            GTV_SERVICE_BOOTSTRAP: {
                createService: (cfg) => ({ type: "bootstrap", cfg })
            },
            GTV_PERSISTENCE_SERVICE_BUNDLE: {
                createService: (cfg) => ({ type: "persistence-bundle", cfg })
            },
            GTV_MAIN_UI_UTILS: {
                createService: () => ({
                    setCustomTooltip: () => "tooltip",
                    upgradeNativeTitleTooltips: () => "upgrade",
                    hideFloatingTooltip: () => "hide",
                    bindFloatingTooltipEvents: () => "bind",
                    clearDragGhost: () => "clear",
                    createDragGhostFromRow: () => "ghost"
                })
            },
            GTV_APP_FEEDBACK: {
                createService: (cfg) => {
                    feedbackConfig = cfg;
                    return { type: "feedback" };
                }
            },
            GTV_CALCULATOR_ACTIONS: {
                createService: (cfg) => {
                    calculatorConfig = cfg;
                    return { type: "calculator-actions" };
                }
            },
            GTV_TAB_UI: { createService: () => ({}) },
            GTV_TAB_ORCHESTRATOR: { createService: () => ({}) },
            GTV_GROUP_STATE: { createService: () => ({}) },
            GTV_STATE_PERSISTENCE: { createService: () => ({}) },
            GTV_SETTINGS_IO: { createService: () => ({}) },
            GTV_DATA_TRANSFER: { createService: () => ({}) },
            GTV_UI_SETTINGS_ACTIONS: { createService: () => ({}) },
            GTV_CALCULATOR: { initCalculators: () => {} },
            PERIOD_RESULT_IDS: new Set(["period_days"]),
            t: (key) => `t:${key}`,
            showToast: () => {},
            getPersistenceService: () => ({
                resetAllSettings: async () => {
                    resetCalled += 1;
                }
            }),
            confirmFn: () => true,
            documentRef: {
                getElementById: (id) => ({ id })
            },
            locationRef: { href: "about:blank" },
            writeClipboard: async (text) => {
                clipboardPayload = String(text || "");
            },
            logError: () => {}
        });

        expect(service.serviceBootstrap.type).toBe("bootstrap");
        expect(service.persistenceServiceBundleFactory.type).toBe("persistence-bundle");
        expect(service.appFeedbackService.type).toBe("feedback");
        expect(service.calculatorActionsService.type).toBe("calculator-actions");
        expect(service.setCustomTooltip()).toBe("tooltip");
        expect(service.createDragGhostFromRow()).toBe("ghost");

        await feedbackConfig.resetAllSettings();
        expect(resetCalled).toBe(1);

        await calculatorConfig.writeClipboard("payload");
        expect(clipboardPayload).toBe("payload");
        expect(typeof calculatorConfig.getElementById).toBe("function");
    });

    it("throws when required module APIs are missing", () => {
        const moduleApi = loadMainFoundationServicesModule();
        expect(() => moduleApi.createService({})).toThrow("Missing required module API: GTVServiceBootstrap.createService");
    });
});
