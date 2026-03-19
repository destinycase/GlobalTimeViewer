import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

import { afterAll, beforeAll, expect, test } from "vitest";

const require = createRequire(import.meta.url);
const PROJECT_ROOT = path.resolve(process.cwd());
const MODULES_DIR = path.join(PROJECT_ROOT, "js", "modules");
const MODULE_FILES = fs.readdirSync(MODULES_DIR).filter((name) => name.endsWith(".js")).sort();

const NOOP = () => { };
let restoreGlobals = null;

function setGlobalValue(key, value) {
    try {
        globalThis[key] = value;
    } catch (_err) {
        Object.defineProperty(globalThis, key, {
            configurable: true,
            writable: true,
            value
        });
    }
}

function buildDocumentStub() {
    return {
        readyState: "loading",
        title: "",
        addEventListener: NOOP,
        removeEventListener: NOOP,
        querySelector: () => null,
        querySelectorAll: () => [],
        createElement: () => ({
            style: {},
            classList: {
                add: NOOP,
                remove: NOOP,
                contains: () => false
            },
            setAttribute: NOOP,
            removeAttribute: NOOP,
            appendChild: NOOP,
            querySelector: () => null,
            querySelectorAll: () => [],
            getContext: () => ({
                measureText: () => ({ width: 0 }),
                fillText: NOOP,
                drawImage: NOOP,
                beginPath: NOOP,
                moveTo: NOOP,
                lineTo: NOOP,
                stroke: NOOP,
                fill: NOOP,
                rect: NOOP,
                arc: NOOP
            })
        }),
        getElementById: () => null,
        body: {
            appendChild: NOOP,
            removeChild: NOOP,
            style: {}
        },
        documentElement: {
            lang: "en",
            style: {
                setProperty: NOOP,
                removeProperty: NOOP
            },
            getAttribute: () => "dark",
            setAttribute: NOOP
        }
    };
}

function installGlobalStubs() {
    const keys = [
        "window",
        "globalThis",
        "document",
        "navigator",
        "location",
        "localStorage",
        "chrome",
        "confirm",
        "alert",
        "requestAnimationFrame",
        "cancelAnimationFrame",
        "getComputedStyle",
        "CustomDatePicker",
        "t",
        "tFormat",
        "applyTranslations",
        "currentLang",
        "I18N_DATA",
        "luxon"
    ];
    const previous = new Map();
    keys.forEach((key) => {
        previous.set(key, Object.prototype.hasOwnProperty.call(globalThis, key) ? globalThis[key] : undefined);
    });

    setGlobalValue("window", globalThis);
    setGlobalValue("globalThis", globalThis);
    setGlobalValue("document", buildDocumentStub());
    setGlobalValue("navigator", { clipboard: { writeText: async () => { } } });
    setGlobalValue("location", { reload: NOOP });
    setGlobalValue("localStorage", {
        getItem: () => null,
        setItem: NOOP,
        removeItem: NOOP
    });
    setGlobalValue("chrome", {
        action: { onClicked: { addListener: NOOP } },
        tabs: { create: NOOP },
        storage: { local: { get: (_keys, cb) => cb?.({}), set: (_next, cb) => cb?.() } }
    });
    setGlobalValue("confirm", () => true);
    setGlobalValue("alert", NOOP);
    setGlobalValue("requestAnimationFrame", (cb) => setTimeout(cb, 0));
    setGlobalValue("cancelAnimationFrame", (id) => clearTimeout(id));
    setGlobalValue("getComputedStyle", () => ({ getPropertyValue: () => "0px", width: "0px", height: "0px" }));
    setGlobalValue("CustomDatePicker", class {
        destroy() { }
    });
    setGlobalValue("t", (key) => key);
    setGlobalValue("tFormat", (key) => key);
    setGlobalValue("applyTranslations", NOOP);
    setGlobalValue("currentLang", "en");
    setGlobalValue("I18N_DATA", {
        en: { days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] },
        ko: { days: ["일", "월", "화", "수", "목", "금", "토"] }
    });
    setGlobalValue("luxon", require("luxon"));

    return () => {
        keys.forEach((key) => {
            const prevValue = previous.get(key);
            if (prevValue === undefined) {
                delete globalThis[key];
                return;
            }
            setGlobalValue(key, prevValue);
        });
    };
}

beforeAll(() => {
    restoreGlobals = installGlobalStubs();
    MODULE_FILES.forEach((fileName) => {
        require(path.join(MODULES_DIR, fileName));
    });
    require(path.join(PROJECT_ROOT, "main.js"));
    require(path.join(PROJECT_ROOT, "i18n.js"));
    require(path.join(PROJECT_ROOT, "background.js"));
});

afterAll(() => {
    if (typeof restoreGlobals === "function") restoreGlobals();
});

test("coverage smoke imports runtime scripts without boot errors", () => {
    expect(MODULE_FILES.length).toBeGreaterThan(0);
    expect(globalThis.GTVMainConstants).toBeTruthy();
    expect(globalThis.GTVTimeService).toBeTruthy();
    expect(typeof globalThis.isRealtime).toBe("boolean");
});
