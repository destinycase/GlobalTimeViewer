import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, expect, test } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "date-picker.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function createClassList() {
    const tokens = new Set();
    return {
        add(...values) {
            values.forEach((value) => tokens.add(String(value)));
        },
        remove(...values) {
            values.forEach((value) => tokens.delete(String(value)));
        },
        contains(value) {
            return tokens.has(String(value));
        },
        toggle(value, force) {
            const key = String(value);
            const next = (typeof force === "boolean") ? force : !tokens.has(key);
            if (next) tokens.add(key);
            else tokens.delete(key);
            return next;
        }
    };
}

function createElement(tagName = "div") {
    const listeners = new Map();
    const attributes = new Map();
    const el = {
        tagName: String(tagName || "div").toUpperCase(),
        style: {},
        className: "",
        classList: createClassList(),
        dataset: {},
        children: [],
        parentNode: null,
        textContent: "",
        value: "",
        placeholder: "",
        scrollTop: 0,
        clientHeight: 240,
        addEventListener(eventName, handler) {
            if (!listeners.has(eventName)) listeners.set(eventName, []);
            listeners.get(eventName).push(handler);
        },
        removeEventListener(eventName, handler) {
            const list = listeners.get(eventName) || [];
            const next = list.filter((item) => item !== handler);
            listeners.set(eventName, next);
        },
        dispatchEvent(event) {
            const evt = event || { type: "" };
            if (typeof evt.preventDefault !== "function") evt.preventDefault = () => { };
            if (typeof evt.stopPropagation !== "function") evt.stopPropagation = () => { };
            if (!evt.target) evt.target = el;
            const list = listeners.get(evt.type) || [];
            list.forEach((handler) => handler(evt));
            return true;
        },
        appendChild(child) {
            if (!child) return child;
            child.parentNode = el;
            child.parentElement = el;
            el.children.push(child);
            return child;
        },
        remove() {
            if (!el.parentNode || !Array.isArray(el.parentNode.children)) return;
            el.parentNode.children = el.parentNode.children.filter((child) => child !== el);
            el.parentNode = null;
        },
        contains(target) {
            if (target === el) return true;
            return el.children.some((child) => child === target || (typeof child.contains === "function" && child.contains(target)));
        },
        setAttribute(name, value) {
            attributes.set(String(name), String(value));
        },
        getAttribute(name) {
            return attributes.has(String(name)) ? attributes.get(String(name)) : null;
        },
        removeAttribute(name) {
            attributes.delete(String(name));
        },
        getBoundingClientRect() {
            return { left: 0, right: 240, top: 0, bottom: 36, width: 240, height: 36 };
        },
        querySelectorAll() {
            return [];
        },
        querySelector() {
            return null;
        },
        closest(selector) {
            if (selector === ".cdp-cell" && el.classList.contains("cdp-cell")) return el;
            if (selector === ".cdp-time-item" && el.classList.contains("cdp-time-item")) return el;
            return null;
        },
        focus() { },
        select() { }
    };
    return el;
}

function createSandbox() {
    const documentListeners = new Map();
    const documentStub = {
        body: createElement("body"),
        createElement(tag) {
            return createElement(tag);
        },
        addEventListener(eventName, handler) {
            if (!documentListeners.has(eventName)) documentListeners.set(eventName, []);
            documentListeners.get(eventName).push(handler);
        },
        removeEventListener(eventName, handler) {
            const list = documentListeners.get(eventName) || [];
            documentListeners.set(eventName, list.filter((item) => item !== handler));
        },
        dispatchEvent(event) {
            const evt = event || { type: "" };
            const list = documentListeners.get(evt.type) || [];
            list.forEach((handler) => handler(evt));
        }
    };

    const eventCtor = class Event {
        constructor(type, options = {}) {
            this.type = type;
            this.bubbles = !!options.bubbles;
        }
    };
    const abortControllerCtor = class AbortController {
        constructor() {
            this.signal = {};
        }
        abort() { }
    };
    const windowStub = {
        document: documentStub,
        innerWidth: 1280,
        scrollX: 0,
        scrollY: 0,
        Date,
        Math,
        Number,
        String,
        Object,
        Array,
        parseInt,
        isNaN,
        setTimeout,
        clearTimeout,
        Event: class Event {
            constructor(type, options = {}) {
                this.type = type;
                this.bubbles = !!options.bubbles;
            }
        },
        AbortController: abortControllerCtor
    };
    windowStub.Event = eventCtor;

    const keys = [
        "window",
        "document",
        "innerWidth",
        "scrollX",
        "scrollY",
        "Event",
        "AbortController",
        "CustomDatePicker",
        "console"
    ];
    const previous = new Map();
    keys.forEach((key) => {
        previous.set(key, {
            exists: Object.prototype.hasOwnProperty.call(globalThis, key),
            value: globalThis[key]
        });
    });

    globalThis.window = windowStub;
    globalThis.document = documentStub;
    globalThis.innerWidth = windowStub.innerWidth;
    globalThis.scrollX = windowStub.scrollX;
    globalThis.scrollY = windowStub.scrollY;
    globalThis.Event = eventCtor;
    globalThis.AbortController = abortControllerCtor;
    globalThis.console = console;

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

    return windowStub;
}

afterEach(() => {
    while (moduleCleanupStack.length) {
        const cleanup = moduleCleanupStack.pop();
        try {
            cleanup();
        } catch {
            // Ignore cleanup failures during tests.
        }
    }
});

test("CustomDatePicker initializes placeholder and input class", () => {
    const sandbox = createSandbox();
    const input = sandbox.document.createElement("input");
    const picker = new sandbox.CustomDatePicker(input, { type: "date", lang: "en" });

    expect(input.classList.contains("custom-date-picker-input")).toBe(true);
    expect(input.placeholder).toBe("YYYY-MM-DD");
    expect(picker.popup.parentNode).toBe(sandbox.document.body);
});

test("setDate formats date and datetime values correctly", () => {
    const sandbox = createSandbox();
    const dateInput = sandbox.document.createElement("input");
    const datePicker = new sandbox.CustomDatePicker(dateInput, { type: "date", lang: "en" });
    datePicker.setDate(new Date("2026-03-07T00:00:00"));
    expect(dateInput.value).toBe("2026-03-07");

    const dateTimeInput = sandbox.document.createElement("input");
    const dateTimePicker = new sandbox.CustomDatePicker(dateTimeInput, { type: "datetime", lang: "en" });
    dateTimePicker.setDate(new Date("2026-03-07T09:10:11"));
    expect(dateTimeInput.value).toMatch(/^2026-03-07 \d{2}:10:11$/);
});

test("time picker mode formats HH:mm:ss and uses time placeholder", () => {
    const sandbox = createSandbox();
    const timeInput = sandbox.document.createElement("input");
    const timePicker = new sandbox.CustomDatePicker(timeInput, { type: "time", lang: "en" });

    timePicker.setDate(new Date("2026-03-07T09:10:11"));

    expect(timeInput.placeholder).toBe("HH:mm:ss");
    expect(timeInput.value).toBe("09:10:11");
});

test("open/close toggles popup visibility state", () => {
    const sandbox = createSandbox();
    const input = sandbox.document.createElement("input");
    const picker = new sandbox.CustomDatePicker(input, { type: "date", lang: "en" });

    picker.open();
    expect(picker.isOpen).toBe(true);
    expect(picker.popup.style.display).toBe("flex");

    picker.close();
    expect(picker.isOpen).toBe(false);
    expect(picker.popup.style.display).toBe("none");
});

test("next month navigation from 31st does not skip to the following month", () => {
    const sandbox = createSandbox();
    const input = sandbox.document.createElement("input");
    const picker = new sandbox.CustomDatePicker(input, { type: "date", lang: "en" });

    picker.setDate(new Date("2026-01-31T00:00:00"));
    picker.nextBtn.dispatchEvent({ type: "click", preventDefault() { } });

    expect(picker.currentDate.getFullYear()).toBe(2026);
    expect(picker.currentDate.getMonth()).toBe(1);
    expect(picker.title.textContent).toBe("2026-02");
});

test("previous month navigation from 31st does not skip to the prior month", () => {
    const sandbox = createSandbox();
    const input = sandbox.document.createElement("input");
    const picker = new sandbox.CustomDatePicker(input, { type: "date", lang: "en" });

    picker.setDate(new Date("2026-03-31T00:00:00"));
    picker.prevBtn.dispatchEvent({ type: "click", preventDefault() { } });

    expect(picker.currentDate.getFullYear()).toBe(2026);
    expect(picker.currentDate.getMonth()).toBe(1);
    expect(picker.title.textContent).toBe("2026-02");
});

test("clear button resets value and triggers input change event", () => {
    const sandbox = createSandbox();
    const input = sandbox.document.createElement("input");
    const picker = new sandbox.CustomDatePicker(input, { type: "date", lang: "en" });
    let changeCount = 0;
    input.addEventListener("change", () => { changeCount += 1; });

    picker.setDate(new Date("2026-03-07T00:00:00"));
    picker.clearBtn.dispatchEvent({ type: "click", preventDefault() { } });

    expect(input.value).toBe("");
    expect(changeCount).toBe(1);
});

test("destroy detaches popup and removes marker class", () => {
    const sandbox = createSandbox();
    const input = sandbox.document.createElement("input");
    const picker = new sandbox.CustomDatePicker(input, { type: "date", lang: "en" });

    picker.destroy();

    expect(input.classList.contains("custom-date-picker-input")).toBe(false);
    expect(picker.popup.parentNode).toBe(null);
});

test("setLang falls back to English when unsupported language is provided", () => {
    const sandbox = createSandbox();
    const input = sandbox.document.createElement("input");
    const picker = new sandbox.CustomDatePicker(input, { type: "datetime", lang: "ko" });

    picker.setLang("unknown-lang");

    expect(picker.lang).toBe("en");
    expect(input.placeholder).toBe("YYYY-MM-DD HH:mm:ss");
    expect(picker.clearBtn.textContent).toBe("Clear");
    expect(picker.todayBtn.textContent).toBe("Today");
});

test("_parseInputValue validates date/time/datetime ranges", () => {
    const sandbox = createSandbox();

    const datePicker = new sandbox.CustomDatePicker(sandbox.document.createElement("input"), { type: "date", lang: "en" });
    expect(datePicker._parseInputValue("2026-02-29")).toBe(null);
    const validDate = datePicker._parseInputValue("2024-02-29");
    expect(validDate.getFullYear()).toBe(2024);
    expect(validDate.getMonth()).toBe(1);
    expect(validDate.getDate()).toBe(29);

    const timePicker = new sandbox.CustomDatePicker(sandbox.document.createElement("input"), { type: "time", lang: "en" });
    expect(timePicker._parseInputValue("24:00:00")).toBe(null);
    const validTime = timePicker._parseInputValue("09:10");
    expect(validTime.getHours()).toBe(9);
    expect(validTime.getMinutes()).toBe(10);
    expect(validTime.getSeconds()).toBe(0);

    const datetimePicker = new sandbox.CustomDatePicker(sandbox.document.createElement("input"), { type: "datetime", lang: "en" });
    expect(datetimePicker._parseInputValue("2026-02-30 10:00:00")).toBe(null);
    const validDateTime = datetimePicker._parseInputValue("2026-03-07T09:10:11");
    expect(validDateTime.getFullYear()).toBe(2026);
    expect(validDateTime.getMonth()).toBe(2);
    expect(validDateTime.getDate()).toBe(7);
    expect(validDateTime.getHours()).toBe(9);
});

test("outside document click closes popup while inside click keeps it open", () => {
    const sandbox = createSandbox();
    const input = sandbox.document.createElement("input");
    const picker = new sandbox.CustomDatePicker(input, { type: "date", lang: "en" });
    const outside = sandbox.document.createElement("div");

    picker.open();
    sandbox.document.dispatchEvent({ type: "click", target: picker.popup });
    expect(picker.isOpen).toBe(true);

    sandbox.document.dispatchEvent({ type: "click", target: outside });
    expect(picker.isOpen).toBe(false);
});

test("open with invalid input falls back to current time and opens popup", () => {
    const sandbox = createSandbox();
    const input = sandbox.document.createElement("input");
    input.value = "not-a-date";
    const picker = new sandbox.CustomDatePicker(input, { type: "datetime", lang: "en" });

    picker.open();

    expect(picker.isOpen).toBe(true);
    expect(picker.selectedDate).toBeTruthy();
    expect(Number.isNaN(picker.selectedDate.getTime())).toBe(false);
});

test("_positionPopup clamps left to viewport minimum", () => {
    const sandbox = createSandbox();
    sandbox.innerWidth = 120;
    const input = sandbox.document.createElement("input");
    input.getBoundingClientRect = () => ({ left: -30, right: 80, top: 5, bottom: 20, width: 110, height: 15 });
    const picker = new sandbox.CustomDatePicker(input, { type: "date", lang: "en" });
    picker.popup.getBoundingClientRect = () => ({ left: 0, right: 0, top: 0, bottom: 0, width: 250, height: 200 });

    picker._positionPopup();

    expect(parseInt(picker.popup.style.left, 10)).toBe(10);
    expect(picker.popup.style.display).toBe("flex");
});
