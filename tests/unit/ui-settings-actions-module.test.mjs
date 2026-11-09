import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "src", "js", "modules", "ui-settings-actions.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadUiSettingsActionsModule(options = {}) {
    const globalPatches = {
        window: {},
        console: options.console || console
    };
    const keys = ["window", "console", "GTVUiSettingsActions", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVUiSettingsActions || globalThis.GTVUiSettingsActions;
}

function createEventElement() {
    const listeners = {};
    return {
        value: "preset",
        clicked: false,
        addEventListener(type, handler) {
            listeners[type] = handler;
        },
        click() {
            this.clicked = true;
        },
        trigger(type, event = {}) {
            if (typeof listeners[type] === "function") listeners[type](event);
        }
    };
}

describe("GTV UI settings actions module", () => {
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

    it("binds export/import controls and forwards events", () => {
        const module = loadUiSettingsActionsModule();
        const elements = {
            "export-settings-btn": createEventElement(),
            "import-settings-btn": createEventElement(),
            "settings-import-file": createEventElement()
        };
        const observed = { exported: 0, settingsChanges: 0 };
        const service = module.createService({
            document: {
                getElementById(id) {
                    return elements[id] || null;
                }
            },
            exportSettingsToJSON: () => { observed.exported += 1; },
            handleSettingsImportFile: () => { observed.settingsChanges += 1; }
        });

        service.bindTransferControls();

        elements["export-settings-btn"].trigger("click");
        elements["import-settings-btn"].trigger("click");
        elements["settings-import-file"].trigger("change", { type: "change" });

        expect(observed.exported).toBe(1);
        expect(elements["settings-import-file"].value).toBe("");
        expect(elements["settings-import-file"].clicked).toBe(true);
        expect(observed.settingsChanges).toBe(1);
    });

    it("binds group/subgroup import change handlers", () => {
        const module = loadUiSettingsActionsModule();
        const elements = {
            "group-import-file": createEventElement(),
            "subgroup-import-file": createEventElement()
        };
        const observed = { group: 0, subgroup: 0, clearGroup: 0, clearSubgroup: 0 };
        const service = module.createService({
            document: {
                getElementById(id) {
                    return elements[id] || null;
                }
            },
            handleGroupImportFile: () => { observed.group += 1; },
            handleSubgroupImportFile: () => { observed.subgroup += 1; },
            clearPendingGroupImport: () => { observed.clearGroup += 1; },
            clearPendingSubgroupImport: () => { observed.clearSubgroup += 1; }
        });

        service.bindTransferControls();
        elements["group-import-file"].trigger("change", { target: { files: [] } });
        elements["subgroup-import-file"].trigger("change", { target: { files: [] } });
        elements["group-import-file"].trigger("cancel", { type: "cancel" });
        elements["subgroup-import-file"].trigger("cancel", { type: "cancel" });

        expect(observed.group).toBe(1);
        expect(observed.subgroup).toBe(1);
        expect(observed.clearGroup).toBe(1);
        expect(observed.clearSubgroup).toBe(1);
    });

    it("binds reset controls and delegates to persistence actions", () => {
        const module = loadUiSettingsActionsModule();
        const elements = {
            "reset-except-group-tz-btn": createEventElement(),
            "reset-all-settings-btn": createEventElement()
        };
        const observed = { partial: 0, full: 0 };
        const service = module.createService({
            document: {
                getElementById(id) {
                    return elements[id] || null;
                }
            },
            resetExceptGroupsAndTimezones: () => { observed.partial += 1; },
            resetAllSettings: () => { observed.full += 1; }
        });

        service.bindResetControls();
        elements["reset-except-group-tz-btn"].trigger("click");
        elements["reset-all-settings-btn"].trigger("click");

        expect(observed.partial).toBe(1);
        expect(observed.full).toBe(1);
    });

    it("bindTransferControls prefers injected getDocumentRefOrNull when direct document dep is unusable", () => {
        const module = loadUiSettingsActionsModule();
        const elements = {
            "export-settings-btn": createEventElement(),
            "import-settings-btn": createEventElement(),
            "settings-import-file": createEventElement()
        };
        const observed = { exported: 0, settingsChanges: 0 };
        const service = module.createService({
            document: {
                getElementById() {
                    throw new Error("direct document dep should not be used");
                }
            },
            getDocumentRefOrNull: () => ({
                getElementById(id) {
                    return elements[id] || null;
                }
            }),
            exportSettingsToJSON: () => { observed.exported += 1; },
            handleSettingsImportFile: () => { observed.settingsChanges += 1; }
        });

        service.bindTransferControls();

        elements["export-settings-btn"].trigger("click");
        elements["import-settings-btn"].trigger("click");
        elements["settings-import-file"].trigger("change", { type: "change" });

        expect(observed.exported).toBe(1);
        expect(elements["settings-import-file"].value).toBe("");
        expect(elements["settings-import-file"].clicked).toBe(true);
        expect(observed.settingsChanges).toBe(1);
    });

    it("does not throw when controls or dependencies are missing", () => {
        const module = loadUiSettingsActionsModule();
        const service = module.createService({
            document: {
                getElementById() {
                    return null;
                }
            }
        });

        expect(() => service.bindTransferControls()).not.toThrow();
        expect(() => service.bindResetControls()).not.toThrow();
        expect(() => service.bindAllControls()).not.toThrow();
    });
it("opens and closes the settings and help popups", () => {
        const module = loadUiSettingsActionsModule();
        const makeElement = (extra = {}) => {
            const listeners = {};
            return {
                style: {},
                focused: 0,
                addEventListener(type, handler) { listeners[type] = handler; },
                trigger(type, event = {}) { if (listeners[type]) listeners[type](event); },
                focus() { this.focused += 1; },
                ...extra
            };
        };
        const docListeners = {};
        const settingsClose = makeElement();
        const helpClose = makeElement();
        const settingsPanel = makeElement();
        const helpPanel = makeElement();
        const confirmOverlay = makeElement();
        const elements = {
            "open-settings-btn": makeElement(),
            "open-help-btn": makeElement(),
            "settings-overlay": makeElement({ querySelector: () => settingsPanel }),
            "help-overlay": makeElement({ querySelector: () => helpPanel }),
            "close-settings-btn": settingsClose,
            "close-help-btn": helpClose
        };
        const doc = {
            getElementById: (id) => elements[id] || null,
            querySelectorAll: () => [confirmOverlay],
            addEventListener: (type, handler) => { docListeners[type] = handler; }
        };
        const service = module.createService({ document: doc });
        service.bindDialogControls();
        const settings = elements["settings-overlay"];
        const help = elements["help-overlay"];

        // Open settings: shown, focus moves into the popup panel.
        elements["open-settings-btn"].trigger("click");
        expect(settings.style.display).toBe("flex");
        expect(settingsPanel.focused).toBe(1);

        // Opening help hides settings.
        elements["open-help-btn"].trigger("click");
        expect(help.style.display).toBe("flex");
        expect(settings.style.display).toBe("none");

        // Close button closes and returns focus to the opener.
        helpClose.trigger("click");
        expect(help.style.display).toBe("none");
        expect(elements["open-help-btn"].focused).toBe(1);

        // A click inside the popup keeps it; a click on the background closes it.
        elements["open-settings-btn"].trigger("click");
        settings.trigger("click", { target: settingsClose });
        expect(settings.style.display).toBe("flex");
        settings.trigger("click", { target: settings });
        expect(settings.style.display).toBe("none");

        // Esc closes, except while a confirm/prompt dialog is open above it.
        elements["open-settings-btn"].trigger("click");
        confirmOverlay.style.display = "flex";
        docListeners.keydown({ key: "Escape" });
        expect(settings.style.display).toBe("flex");
        confirmOverlay.style.display = "none";
        docListeners.keydown({ key: "Enter" });
        expect(settings.style.display).toBe("flex");
        docListeners.keydown({ key: "Escape" });
        expect(settings.style.display).toBe("none");
    });

    it("closes the settings popup only after a confirmed reset or a successful import", async () => {
        const module = loadUiSettingsActionsModule();
        const makeElement = (extra = {}) => {
            const listeners = {};
            return {
                style: {},
                value: "",
                addEventListener(type, handler) { listeners[type] = handler; },
                trigger(type, event = {}) { return listeners[type] ? listeners[type](event) : undefined; },
                focus() { },
                click() { },
                ...extra
            };
        };
        const elements = {
            "open-settings-btn": makeElement(),
            "settings-overlay": makeElement({ querySelector: () => makeElement() }),
            "close-settings-btn": makeElement(),
            "reset-except-group-tz-btn": makeElement(),
            "reset-all-settings-btn": makeElement(),
            "import-settings-btn": makeElement(),
            "settings-import-file": makeElement()
        };
        const results = { resetAll: false, resetExcept: true, imported: undefined };
        const service = module.createService({
            document: {
                getElementById: (id) => elements[id] || null,
                querySelectorAll: () => [],
                addEventListener: () => { }
            },
            resetAllSettings: async () => results.resetAll,
            resetExceptGroupsAndTimezones: async () => results.resetExcept,
            handleSettingsImportFile: async () => results.imported
        });
        service.bindAllControls();
        const settings = elements["settings-overlay"];
        const open = () => elements["open-settings-btn"].trigger("click");

        // Cancelled reset (false) keeps the popup open.
        open();
        await elements["reset-all-settings-btn"].trigger("click");
        expect(settings.style.display).toBe("flex");

        // Confirmed reset (true) closes it.
        await elements["reset-except-group-tz-btn"].trigger("click");
        expect(settings.style.display).toBe("none");

        // A failed or cancelled import keeps it open; a successful one closes it.
        open();
        await elements["settings-import-file"].trigger("change", {});
        expect(settings.style.display).toBe("flex");
        results.imported = true;
        await elements["settings-import-file"].trigger("change", {});
        expect(settings.style.display).toBe("none");
    });

});
