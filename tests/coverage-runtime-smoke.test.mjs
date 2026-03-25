import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

import { afterAll, beforeAll, expect, test, vi } from "vitest";

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
        "luxon",
        "__GTV_ENABLE_MAIN_TEST_HOOKS__",
        "__GTVMainTestHooks"
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
    setGlobalValue("__GTV_ENABLE_MAIN_TEST_HOOKS__", true);

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

afterAll(async () => {
    await new Promise((resolve) => setTimeout(resolve, 25));
    if (typeof restoreGlobals === "function") restoreGlobals();
});

test("coverage smoke imports runtime scripts without boot errors", () => {
    expect(MODULE_FILES.length).toBeGreaterThan(0);
    expect(globalThis.GTVMainConstants).toBeTruthy();
    expect(globalThis.GTVTimeService).toBeTruthy();
    expect(typeof globalThis.isRealtime).toBe("boolean");
});

test("coverage smoke invokes main internals through guarded test hook", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(NOOP);
    const errorSpy = vi.spyOn(console, "error").mockImplementation(NOOP);
    const hooks = globalThis.__GTVMainTestHooks;
    expect(hooks).toBeTruthy();
    expect(typeof hooks.invoke).toBe("function");

    const timezoneRef = {
        id: "tz-utc",
        type: "standard",
        zone: "UTC",
        name_ko: "UTC",
        name_en: "UTC"
    };
    const drawContext = {
        save: NOOP,
        restore: NOOP,
        fillText: NOOP,
        measureText: () => ({ width: 10 })
    };
    const argsByFunctionName = {
        setIsRealtimeState: [false],
        getGlobalTimeState: [0],
        setGlobalTimeState: [0, new Date(Date.UTC(2026, 0, 1, 0, 0, 0))],
        applyDirectStatePatch: [{
            groups: [],
            activeGroupId: 0,
            currentMainTab: "live",
            activeGroupIdByMainTab: { live: 0, fixed: 0 },
            slotCount: 2,
            showCopyFormat: true,
            showTimeline: true,
            displayFormatOrder: ["datetime"],
            displayFormatEnabled: { datetime: true },
            displayTimePartsEnabled: { hour24: true, minute: true },
            copyFormatOrder: ["datetime"],
            copyFormatEnabled: { datetime: true },
            copyTimePartsEnabled: { hour24: true, minute: true },
            formatProfiles: {},
            activeFormatProfileContext: "live",
            timeAdjustDayStepBySlot: [1, 1],
            multiRangeCount: 1,
            multiRangeTitle: "Range",
            multiRanges: [],
            multiRangeCollapsed: [],
            multiRangeStartEditEnabled: [],
            multiRangeEndEditEnabled: [],
            currentTheme: "dark",
            currentLang: "en",
            isRealtime: false
        }],
        warnMissingServiceMethod: ["svc", "method"],
        showMissingFeatureToastOnce: ["missing.feature"],
        getServiceMethod: ["svc", { ok: () => 1 }, "ok"],
        callServiceMethod: ["svc", { ok: () => 1 }, "ok", []],
        parseDateTimeParts: ["2026-03-10 10:20:30", "datetime"],
        parseLocalDateTimeToUtcMs: ["2026-03-10 10:20:30"],
        getSignedDurationDayHourMinute: ["2026-03-10 10:00:00", "2026-03-10 11:00:00"],
        getLocalPartsByTimezone: [new Date(Date.UTC(2026, 0, 1, 0, 0, 0)), timezoneRef, null],
        getUTCDateFromLocalParts: [{ year: 2026, month: 1, day: 1, hour: 0, minute: 0, second: 0 }, timezoneRef, null],
        drawExportCellText: [drawContext, "txt", 0, 0, 10, 10, {}],
        handleTimeChange: ["2026-03-10 10:20:30", timezoneRef, 0, null, "datetime"],
        handleMultiRangeTimeChange: [0, "2026-03-10 10:20:30", timezoneRef, 0, null, "datetime"],
        formatSnapshotText: [{}, ["datetime"], { datetime: true }, { hour24: true }],
        formatTimeTextByParts: [{ hour24: "10", minute: "20" }, { hour24: true, minute: true }],
        sanitizeGroup: [{ name: "G", zones: [], baseTimezoneId: "utc", showUtcRow: true, utcRowOrder: 0 }, 0, null],
        showFatalError: [new Error("sweep")]
    };
    const skipFunctions = new Set(["initApp", "prepareExportCanvas"]);
    const mainSource = fs.readFileSync(path.join(PROJECT_ROOT, "main.js"), "utf8");
    const functionNames = [...mainSource.matchAll(/^function\s+([A-Za-z0-9_]+)/gm)].map((match) => match[1]);

    const failed = [];
    let invoked = 0;
    functionNames.forEach((name) => {
        if (skipFunctions.has(name)) return;
        invoked += 1;
        try {
            const args = argsByFunctionName[name] || [];
            const result = hooks.invoke(name, ...args);
            if (result && typeof result.then === "function") {
                void result.catch(() => { });
            }
        } catch (error) {
            failed.push({ name, error });
        }
    });

    expect(invoked).toBeGreaterThanOrEqual(145);
    expect(failed).toEqual([]);

    warnSpy.mockRestore();
    errorSpy.mockRestore();
});
