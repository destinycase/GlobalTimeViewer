import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-ui-utils.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function createClassList(initial = []) {
    const values = new Set(initial);
    return {
        add(token) {
            values.add(String(token));
        },
        remove(token) {
            values.delete(String(token));
        },
        contains(token) {
            return values.has(String(token));
        },
        toArray() {
            return [...values];
        }
    };
}

class FakeElement {
    constructor(tagName = "DIV") {
        this.tagName = String(tagName).toUpperCase();
        this.type = "";
        this.className = "";
        this.id = "";
        this.textContent = "";
        this.value = "";
        this.style = {};
        this.classList = createClassList();
        this.parentNode = null;
        this.children = [];
        this.isConnected = false;
        this._attrs = new Map();
        this._queryResults = new Map();
        this._rect = {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            bottom: 0
        };
    }

    setAttribute(name, value) {
        this._attrs.set(String(name), String(value));
    }

    getAttribute(name) {
        if (!this._attrs.has(String(name))) return null;
        return this._attrs.get(String(name));
    }

    removeAttribute(name) {
        this._attrs.delete(String(name));
    }

    appendChild(child) {
        this.children.push(child);
        child.parentNode = this;
        child.isConnected = Boolean(this.isConnected);
        return child;
    }

    removeChild(child) {
        const idx = this.children.indexOf(child);
        if (idx >= 0) this.children.splice(idx, 1);
        child.parentNode = null;
        child.isConnected = false;
        return child;
    }

    setQuerySelectorAll(selector, result) {
        this._queryResults.set(String(selector), result);
    }

    querySelectorAll(selector) {
        return this._queryResults.get(String(selector)) || [];
    }

    closest(selector) {
        if (String(selector) === "[data-tooltip]" && this.getAttribute("data-tooltip")) {
            return this;
        }
        return null;
    }

    contains(node) {
        let current = node;
        while (current) {
            if (current === this) return true;
            current = current.parentNode;
        }
        return false;
    }

    setBoundingClientRect(rect = {}) {
        const next = {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            ...rect
        };
        if (!Number.isFinite(next.bottom)) {
            next.bottom = next.top + next.height;
        }
        this._rect = next;
    }

    getBoundingClientRect() {
        return { ...this._rect };
    }
}

class FakeHTMLElement extends FakeElement {}

function createEmitter() {
    const listeners = new Map();
    return {
        addEventListener(type, handler) {
            const key = String(type);
            if (!listeners.has(key)) listeners.set(key, []);
            listeners.get(key).push(handler);
        },
        dispatch(type, event = {}) {
            const key = String(type);
            const handlers = listeners.get(key) || [];
            handlers.forEach((handler) => handler(event));
        },
        count(type) {
            const key = String(type);
            return (listeners.get(key) || []).length;
        }
    };
}

function createUiTestEnv() {
    const docEmitter = createEmitter();
    const winEmitter = createEmitter();

    const body = new FakeHTMLElement("BODY");
    body.isConnected = true;

    const documentMock = {
        body,
        createElement(tagName) {
            const el = new FakeHTMLElement(tagName);
            if (el.tagName === "DIV") {
                el.setBoundingClientRect({ width: 120, height: 28 });
            }
            return el;
        },
        addEventListener(type, handler) {
            docEmitter.addEventListener(type, handler);
        },
        dispatchEvent(type, event = {}) {
            docEmitter.dispatch(type, event);
        },
        getListenerCount(type) {
            return docEmitter.count(type);
        },
        querySelectorAll() {
            return [];
        }
    };

    const windowMock = {
        innerWidth: 320,
        innerHeight: 220,
        addEventListener(type, handler) {
            winEmitter.addEventListener(type, handler);
        },
        dispatchEvent(type, event = {}) {
            winEmitter.dispatch(type, event);
        },
        getListenerCount(type) {
            return winEmitter.count(type);
        }
    };

    return { documentMock, windowMock };
}

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

function loadMainUiUtilsModule(globalPatches) {
    const keys = [
        "window",
        "document",
        "console",
        "Element",
        "HTMLElement",
        "GTVMainUiUtils",
        ...Object.keys(globalPatches)
    ];
    const snapshot = captureGlobalSnapshot(keys);
    Object.entries(globalPatches).forEach(([key, value]) => {
        setGlobalValue(key, value);
    });

    delete require.cache[MODULE_ID];
    require(MODULE_PATH);
    moduleCleanupStack.push(() => {
        delete require.cache[MODULE_ID];
        restoreGlobalSnapshot(snapshot, keys);
    });

    return globalThis.window?.GTVMainUiUtils || globalThis.GTVMainUiUtils;
}

function makeRow(values, width = 480) {
    const row = new FakeHTMLElement("TR");
    row.classList.add("dragging");
    row.setBoundingClientRect({ width, height: 24, top: 50, left: 10 });

    const sourceInputs = values.map((value) => {
        const input = new FakeHTMLElement("INPUT");
        input.value = value;
        return input;
    });
    row.setQuerySelectorAll(".time-input", sourceInputs);

    row.cloneNode = () => {
        const cloned = new FakeHTMLElement("TR");
        cloned.classList.add("dragging");
        const clonedInputs = values.map(() => new FakeHTMLElement("INPUT"));
        cloned.setQuerySelectorAll(".time-input", clonedInputs);
        return cloned;
    };

    return row;
}

describe("GTV main ui utils module", () => {
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

    it("sets and clears custom tooltips with expected attributes", () => {
        const env = createUiTestEnv();
        const moduleApi = loadMainUiUtilsModule({
            window: env.windowMock,
            document: env.documentMock,
            console,
            Element: FakeElement,
            HTMLElement: FakeHTMLElement
        });
        const service = moduleApi.createService();

        const el = new FakeHTMLElement("BUTTON");
        el.setAttribute("title", "legacy");

        service.setCustomTooltip(el, "  copied text  ");
        expect(el.getAttribute("data-tooltip")).toBe("copied text");
        expect(el.getAttribute("aria-label")).toBe("copied text");
        expect(el.getAttribute("title")).toBe(null);
        expect(el.classList.contains("custom-tooltip")).toBe(true);

        service.setCustomTooltip(el, "");
        expect(el.getAttribute("data-tooltip")).toBe(null);
        expect(el.classList.contains("custom-tooltip")).toBe(false);
    });

    it("keeps info-tip class behavior and ignores non-element targets", () => {
        const env = createUiTestEnv();
        const moduleApi = loadMainUiUtilsModule({
            window: env.windowMock,
            document: env.documentMock,
            console,
            Element: FakeElement,
            HTMLElement: FakeHTMLElement
        });
        const service = moduleApi.createService();

        expect(() => service.setCustomTooltip({}, "noop")).not.toThrow();

        const infoTip = new FakeHTMLElement("SPAN");
        infoTip.classList.add("info-tip");
        infoTip.classList.add("custom-tooltip");
        service.setCustomTooltip(infoTip, "   ");

        expect(infoTip.classList.contains("custom-tooltip")).toBe(true);
        expect(infoTip.getAttribute("data-tooltip")).toBe(null);
    });

    it("upgrades native title tooltips using root query results", () => {
        const env = createUiTestEnv();
        const moduleApi = loadMainUiUtilsModule({
            window: env.windowMock,
            document: env.documentMock,
            console,
            Element: FakeElement,
            HTMLElement: FakeHTMLElement
        });
        const service = moduleApi.createService();

        const withTitle = new FakeHTMLElement("BUTTON");
        withTitle.setAttribute("title", " Copy ");
        const emptyTitle = new FakeHTMLElement("BUTTON");
        emptyTitle.setAttribute("title", "   ");
        const root = {
            querySelectorAll(selector) {
                expect(selector).toBe("button.copy-row-btn[title], button.remove-row-btn[title]");
                return [withTitle, emptyTitle];
            }
        };

        expect(() => service.upgradeNativeTitleTooltips(null)).not.toThrow();
        service.upgradeNativeTitleTooltips(root);

        expect(withTitle.getAttribute("data-tooltip")).toBe("Copy");
        expect(withTitle.getAttribute("aria-label")).toBe("Copy");
        expect(withTitle.getAttribute("title")).toBe(null);
        expect(withTitle.classList.contains("custom-tooltip")).toBe(true);
        expect(emptyTitle.getAttribute("title")).toBe(null);
    });

    it("binds floating tooltip events once and handles show/hide paths", () => {
        const env = createUiTestEnv();
        const moduleApi = loadMainUiUtilsModule({
            window: env.windowMock,
            document: env.documentMock,
            console,
            Element: FakeElement,
            HTMLElement: FakeHTMLElement
        });
        const service = moduleApi.createService();

        service.bindFloatingTooltipEvents();
        service.bindFloatingTooltipEvents();
        expect(env.documentMock.getListenerCount("pointerenter")).toBe(1);
        expect(env.documentMock.getListenerCount("focusin")).toBe(1);
        expect(env.windowMock.getListenerCount("scroll")).toBe(1);

        const target = new FakeHTMLElement("BUTTON");
        target.isConnected = true;
        target.setAttribute("data-tooltip", "Tooltip Text");
        target.setBoundingClientRect({
            left: 10,
            top: 2,
            width: 40,
            height: 20,
            bottom: 22
        });
        const related = new FakeHTMLElement("SPAN");
        related.isConnected = true;
        target.appendChild(related);

        env.documentMock.dispatchEvent("pointerenter", { target });
        const tooltip = env.documentMock.body.children.find((el) => el.id === "app-floating-tooltip");
        expect(tooltip).toBeTruthy();
        expect(tooltip.textContent).toBe("Tooltip Text");
        expect(tooltip.classList.contains("visible")).toBe(true);
        expect(Number.parseInt(tooltip.style.top || "0", 10)).toBeGreaterThan(20);

        env.documentMock.dispatchEvent("pointerleave", { target, relatedTarget: related });
        expect(tooltip.classList.contains("visible")).toBe(true);

        env.documentMock.dispatchEvent("pointerleave", { target, relatedTarget: null });
        expect(tooltip.classList.contains("visible")).toBe(false);

        env.documentMock.dispatchEvent("focusin", { target });
        expect(tooltip.classList.contains("visible")).toBe(true);

        target.isConnected = false;
        env.windowMock.dispatchEvent("scroll", {});
        expect(tooltip.classList.contains("visible")).toBe(false);

        target.isConnected = true;
        env.documentMock.dispatchEvent("pointerenter", { target });
        expect(tooltip.classList.contains("visible")).toBe(true);
        env.documentMock.dispatchEvent("pointerdown", { target: new FakeHTMLElement("DIV") });
        expect(tooltip.classList.contains("visible")).toBe(false);

        env.documentMock.dispatchEvent("pointerenter", { target });
        env.documentMock.dispatchEvent("keydown", { target: new FakeHTMLElement("DIV") });
        expect(tooltip.classList.contains("visible")).toBe(false);
    });

    it("creates drag ghost rows, updates input values, and clears previous ghosts", () => {
        const env = createUiTestEnv();
        const moduleApi = loadMainUiUtilsModule({
            window: env.windowMock,
            document: env.documentMock,
            console,
            Element: FakeElement,
            HTMLElement: FakeHTMLElement
        });
        const service = moduleApi.createService();

        const rowA = makeRow(["10:00", "11:00"], 480);
        const ghostA = service.createDragGhostFromRow(rowA);
        expect(ghostA).toBeTruthy();
        expect(ghostA.style.width).toBe("480px");

        const ghostRowA = ghostA.children[0].children[0];
        const ghostInputsA = ghostRowA.querySelectorAll(".time-input");
        expect(ghostInputsA.map((input) => input.value)).toEqual(["10:00", "11:00"]);
        expect(ghostInputsA.every((input) => input.getAttribute("readonly") === "readonly")).toBe(true);
        expect(ghostRowA.classList.contains("dragging")).toBe(false);
        expect(ghostRowA.classList.contains("drag-ghost-row")).toBe(true);

        const rowB = makeRow(["12:30"], 200);
        const ghostB = service.createDragGhostFromRow(rowB);
        expect(ghostB.style.width).toBe("420px");
        expect(ghostA.parentNode).toBe(null);

        service.clearDragGhost();
        expect(ghostB.parentNode).toBe(null);
    });

    it("returns null for non-HTMLElement rows when HTMLElement is defined", () => {
        const env = createUiTestEnv();
        const moduleApi = loadMainUiUtilsModule({
            window: env.windowMock,
            document: env.documentMock,
            console,
            Element: FakeElement,
            HTMLElement: FakeHTMLElement
        });
        const service = moduleApi.createService();

        expect(service.createDragGhostFromRow({})).toBe(null);
    });
});
