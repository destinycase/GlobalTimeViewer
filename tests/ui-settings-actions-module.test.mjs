import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "ui-settings-actions.js");
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
        const observed = { group: 0, subgroup: 0 };
        const service = module.createService({
            document: {
                getElementById(id) {
                    return elements[id] || null;
                }
            },
            handleGroupImportFile: () => { observed.group += 1; },
            handleSubgroupImportFile: () => { observed.subgroup += 1; }
        });

        service.bindTransferControls();
        elements["group-import-file"].trigger("change", { target: { files: [] } });
        elements["subgroup-import-file"].trigger("change", { target: { files: [] } });

        expect(observed.group).toBe(1);
        expect(observed.subgroup).toBe(1);
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
});
