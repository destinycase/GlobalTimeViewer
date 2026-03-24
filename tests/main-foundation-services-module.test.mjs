import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-foundation-services.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function captureGlobalSnapshot(keys) {
    const snapshot = new Map();
    keys.forEach((key) => {
        snapshot.set(key, {
            exists: Object.prototype.hasOwnProperty.call(globalThis, key),
            descriptor: Object.getOwnPropertyDescriptor(globalThis, key),
            value: globalThis[key]
        });
    });
    return snapshot;
}

function setGlobalValue(key, value) {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, key);
    if (!descriptor || descriptor.writable) {
        globalThis[key] = value;
        return;
    }
    Object.defineProperty(globalThis, key, {
        configurable: true,
        enumerable: descriptor.enumerable ?? true,
        writable: true,
        value
    });
}

function restoreGlobalSnapshot(snapshot, keys) {
    keys.forEach((key) => {
        const entry = snapshot.get(key);
        if (!entry || !entry.exists) {
            delete globalThis[key];
            return;
        }
        if (entry.descriptor) {
            Object.defineProperty(globalThis, key, entry.descriptor);
            return;
        }
        globalThis[key] = entry.value;
    });
}

function loadMainFoundationServicesModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainFoundationServices", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainFoundationServices || globalThis.GTVMainFoundationServices;
}

describe("GTV main foundation services module", () => {
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

    it("uses global fallbacks for document/location/clipboard/confirm when optional deps are omitted", async () => {
        const moduleApi = loadMainFoundationServicesModule();
        const globalKeys = ["document", "location", "navigator", "confirm"];
        const previous = captureGlobalSnapshot(globalKeys);

        const clipboardWrites = [];
        const confirmCalls = [];
        let feedbackConfig = null;
        let calculatorConfig = null;

        setGlobalValue("document", {
            getElementById: (id) => ({ id, from: "global-document" })
        });
        setGlobalValue("location", { href: "https://example.com" });
        setGlobalValue("navigator", {
            clipboard: {
                writeText: async (text) => {
                    clipboardWrites.push(String(text));
                }
            }
        });
        setGlobalValue("confirm", (message) => {
            confirmCalls.push(String(message));
            return true;
        });

        try {
            moduleApi.createService({
                GTV_SERVICE_BOOTSTRAP: { createService: () => ({}) },
                GTV_PERSISTENCE_SERVICE_BUNDLE: { createService: () => ({}) },
                GTV_MAIN_UI_UTILS: {
                    createService: () => ({
                        setCustomTooltip: () => {},
                        upgradeNativeTitleTooltips: () => {},
                        hideFloatingTooltip: () => {},
                        bindFloatingTooltipEvents: () => {},
                        clearDragGhost: () => {},
                        createDragGhostFromRow: () => {}
                    })
                },
                GTV_APP_FEEDBACK: {
                    createService: (cfg) => {
                        feedbackConfig = cfg;
                        return {};
                    }
                },
                GTV_CALCULATOR_ACTIONS: {
                    createService: (cfg) => {
                        calculatorConfig = cfg;
                        return {};
                    }
                }
            });

            expect(feedbackConfig.document).toBe(globalThis.document);
            expect(feedbackConfig.location).toBe(globalThis.location);
            expect(feedbackConfig.confirmFn("confirm?")).toBe(true);
            expect(confirmCalls).toEqual(["confirm?"]);

            expect(calculatorConfig.getElementById("node-1")).toEqual({
                id: "node-1",
                from: "global-document"
            });
            expect(calculatorConfig.t("fallback_key")).toBe("fallback_key");
            expect(calculatorConfig.PERIOD_RESULT_IDS instanceof Set).toBe(true);
            expect(calculatorConfig.PERIOD_RESULT_IDS.size).toBe(0);
            expect(() => calculatorConfig.showToast("ignored")).not.toThrow();

            await calculatorConfig.writeClipboard("clip-text");
            expect(clipboardWrites).toEqual(["clip-text"]);
            await expect(feedbackConfig.resetAllSettings()).resolves.toBeUndefined();
        } finally {
            restoreGlobalSnapshot(previous, globalKeys);
        }
    });

    it("throws clipboard unavailable when fallback clipboard API is missing", async () => {
        const moduleApi = loadMainFoundationServicesModule();
        const globalKeys = ["navigator"];
        const previous = captureGlobalSnapshot(globalKeys);
        let calculatorConfig = null;

        setGlobalValue("navigator", {});
        try {
            moduleApi.createService({
                GTV_SERVICE_BOOTSTRAP: { createService: () => ({}) },
                GTV_PERSISTENCE_SERVICE_BUNDLE: { createService: () => ({}) },
                GTV_MAIN_UI_UTILS: {
                    createService: () => ({
                        setCustomTooltip: () => {},
                        upgradeNativeTitleTooltips: () => {},
                        hideFloatingTooltip: () => {},
                        bindFloatingTooltipEvents: () => {},
                        clearDragGhost: () => {},
                        createDragGhostFromRow: () => {}
                    })
                },
                GTV_APP_FEEDBACK: {
                    createService: () => ({})
                },
                GTV_CALCULATOR_ACTIONS: {
                    createService: (cfg) => {
                        calculatorConfig = cfg;
                        return {};
                    }
                }
            });

            await expect(calculatorConfig.writeClipboard("x")).rejects.toThrow("Clipboard API unavailable");
        } finally {
            restoreGlobalSnapshot(previous, globalKeys);
        }
    });
});
