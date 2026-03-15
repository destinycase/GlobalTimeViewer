import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { expect, test } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "date-picker.js");
const moduleCode = fs.readFileSync(MODULE_PATH, "utf8");

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

    const sandbox = {
        console,
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
        document: documentStub,
        innerWidth: 1280,
        scrollX: 0,
        scrollY: 0,
        Event: class Event {
            constructor(type, options = {}) {
                this.type = type;
                this.bubbles = !!options.bubbles;
            }
        },
        AbortController: class AbortController {
            constructor() {
                this.signal = {};
            }
            abort() { }
        }
    };
    sandbox.window = sandbox;
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(moduleCode, sandbox, { filename: "js/modules/date-picker.js" });
    return sandbox;
}

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
