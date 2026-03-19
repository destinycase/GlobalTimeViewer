import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "ui-preferences-state.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);

let restoreGlobals = null;

function installGlobalScaffold() {
    const keys = ["window", "GTVUiPreferencesState", "document"];
    const previous = new Map();
    keys.forEach((key) => {
        previous.set(key, Object.prototype.hasOwnProperty.call(globalThis, key) ? globalThis[key] : undefined);
    });

    globalThis.window = globalThis;

    return () => {
        keys.forEach((key) => {
            const value = previous.get(key);
            if (value === undefined) {
                delete globalThis[key];
                return;
            }
            globalThis[key] = value;
        });
    };
}

function createDocumentStub() {
    const documentElementStyle = {
        setPropertyCalls: [],
        setProperty(key, value) {
            this.setPropertyCalls.push([key, value]);
        },
        zoom: "",
        overflow: ""
    };

    const documentElement = {
        style: documentElementStyle,
        lang: "ko",
        setAttribute(name, value) {
            this[name] = value;
        }
    };

    const body = {
        style: {
            overflow: ""
        }
    };

    return {
        documentElement,
        body,
        createElement() {
            return {
                value: "",
                textContent: "",
                children: [],
                appendChild(child) {
                    this.children.push(child);
                    return child;
                }
            };
        }
    };
}

function loadUiPreferencesStateModule() {
    delete require.cache[MODULE_ID];
    require(MODULE_PATH);
    return globalThis.GTVUiPreferencesState;
}

describe("GTV ui preferences state module", () => {
    beforeEach(() => {
        restoreGlobals = installGlobalScaffold();
    });

    afterEach(() => {
        if (typeof restoreGlobals === "function") restoreGlobals();
    });

    it("sanitizes UI scale and applies zoom/storage values", async () => {
        const moduleApi = loadUiPreferencesStateModule();
        const doc = createDocumentStub();
        globalThis.document = doc;

        const patches = [];
        const storageWrites = [];
        const service = moduleApi.createService({
            DEFAULT_UI_SCALE_PERCENT: 100,
            MIN_UI_SCALE_PERCENT: 80,
            MAX_UI_SCALE_PERCENT: 120,
            UI_SCALE_PERCENT_OPTIONS: [80, 100, 120],
            UI_SCALE_STORAGE_KEY: "gtv-ui-scale",
            setState: (next) => patches.push(next),
            setStorageValue: async (key, value) => {
                storageWrites.push([key, value]);
            }
        });

        expect(service.sanitizeUiScalePercent("111")).toBe(120);
        expect(service.sanitizeUiScalePercent("20")).toBe(80);
        expect(service.sanitizeUiScalePercent("not-a-number")).toBe(100);

        await service.applyUiScale("111", true);
        expect(patches.at(-1)).toEqual({ uiScale: 1.2 });
        expect(doc.documentElement.style.setPropertyCalls).toContainEqual(["--ui-zoom", "1.20"]);
        expect(doc.documentElement.style.zoom).toBe("1.2");
        expect(doc.documentElement.style.overflow).toBe("hidden");
        expect(doc.body.style.overflow).toBe("hidden");
        expect(storageWrites).toEqual([["gtv-ui-scale", "120"]]);

        await service.applyUiScale("100", false);
        expect(storageWrites).toHaveLength(1);
    });

    it("loads preferences, populates select options, and applies theme/lang", async () => {
        const moduleApi = loadUiPreferencesStateModule();
        const doc = createDocumentStub();
        globalThis.document = doc;

        const statePatches = [];
        const storageWrites = [];
        const service = moduleApi.createService({
            DEFAULT_UI_SCALE_PERCENT: 100,
            UI_SCALE_PERCENT_OPTIONS: [80, 100, 120],
            UI_SCALE_STORAGE_KEY: "gtv-ui-scale",
            THEME_STORAGE_KEY: "gtv-theme",
            THEME_LIST: ["dark", "light"],
            I18N_DATA: { ko: { ok: true }, en: { ok: true } },
            setState: (next) => statePatches.push(next),
            getStorageValue: async (key, fallback) => {
                if (key === "gtv-ui-scale") return "77";
                if (key === "gtv-theme") return "solarized";
                return fallback;
            },
            setStorageValue: async (key, value) => {
                storageWrites.push([key, value]);
            }
        });

        const loadedScale = await service.loadUiScalePreference();
        expect(loadedScale).toBe(80);

        const selectEl = {
            textContent: "old",
            children: [],
            appendChild(child) {
                this.children.push(child);
                return child;
            }
        };
        service.populateUiScaleSelect(selectEl);
        expect(selectEl.textContent).toBe("");
        expect(selectEl.children.map((child) => child.value)).toEqual(["80", "100", "120"]);

        expect(service.sanitizeTheme("light")).toBe("light");
        expect(service.sanitizeTheme("unknown")).toBe("dark");

        await service.applyTheme("light", true);
        expect(statePatches).toContainEqual({ currentTheme: "light" });
        expect(doc.documentElement["data-theme"]).toBe("light");
        expect(storageWrites).toContainEqual(["gtv-theme", "light"]);

        const loadedTheme = await service.loadThemePreference();
        expect(loadedTheme).toBe("dark");

        service.setCurrentLang("en");
        expect(statePatches).toContainEqual({ currentLang: "en" });
        expect(doc.documentElement.lang).toBe("en");

        service.setCurrentLang("fr");
        expect(statePatches).toContainEqual({ currentLang: "ko" });
        expect(doc.documentElement.lang).toBe("ko");
    });
});
