import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "app-feedback.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);

let restoreGlobals = null;

function installGlobalScaffold() {
    const keys = ["window", "GTVAppFeedback", "setTimeout", "document", "location", "confirm"];
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

function createElementStub(tagName = "div") {
    const listeners = new Map();
    const element = {
        tagName: String(tagName || "div").toUpperCase(),
        className: "",
        textContent: "",
        style: {},
        children: [],
        isConnected: true,
        parentNode: null,
        onclick: null,
        classList: {
            add(...names) {
                const merged = new Set((element.className || "").split(/\s+/).filter(Boolean));
                names.forEach((name) => merged.add(name));
                element.className = [...merged].join(" ");
            }
        },
        addEventListener(type, handler) {
            const key = String(type || "");
            if (!key || typeof handler !== "function") return;
            if (!listeners.has(key)) listeners.set(key, new Set());
            listeners.get(key).add(handler);
        },
        removeEventListener(type, handler) {
            const key = String(type || "");
            if (!key || typeof handler !== "function") return;
            if (!listeners.has(key)) return;
            listeners.get(key).delete(handler);
        },
        listenerCount(type) {
            const key = String(type || "");
            if (!listeners.has(key)) return 0;
            return listeners.get(key).size;
        },
        async trigger(type, event = {}) {
            const key = String(type || "");
            const handlers = listeners.has(key) ? [...listeners.get(key)] : [];
            for (const handler of handlers) {
                await handler.call(element, event);
            }
            if (key === "click" && typeof element.onclick === "function") {
                await element.onclick(event);
            }
        },
        appendChild(child) {
            if (!child || typeof child !== "object") return null;
            child.parentNode = element;
            child.isConnected = true;
            element.children.push(child);
            return child;
        },
        remove() {
            if (!element.parentNode || !Array.isArray(element.parentNode.children)) {
                element.isConnected = false;
                return;
            }
            const siblings = element.parentNode.children;
            const idx = siblings.indexOf(element);
            if (idx >= 0) siblings.splice(idx, 1);
            element.parentNode = null;
            element.isConnected = false;
        }
    };
    return element;
}

function loadAppFeedbackModule() {
    delete require.cache[MODULE_ID];
    require(MODULE_PATH);
    return globalThis.GTVAppFeedback;
}

describe("GTV app feedback module", () => {
    beforeEach(() => {
        restoreGlobals = installGlobalScaffold();
    });

    afterEach(() => {
        if (typeof restoreGlobals === "function") restoreGlobals();
    });

    it("showToast renders a typed toast element", () => {
        const module = loadAppFeedbackModule();
        const toastContainer = createElementStub("div");
        const timeoutQueue = [];
        globalThis.setTimeout = (fn) => {
            timeoutQueue.push(fn);
            return timeoutQueue.length;
        };
        const doc = {
            getElementById(id) {
                return id === "toast-container" ? toastContainer : null;
            },
            createElement(tag) {
                return createElementStub(tag);
            }
        };
        const service = module.createService({ document: doc });

        const result = service.showToast("Saved", { type: "success", icon: "S" });
        expect(typeof result?.dismiss).toBe("function");
        expect(toastContainer.children.length).toBe(1);
        expect(toastContainer.children[0].className).toContain("toast success");
        expect(toastContainer.children[0].children[0].textContent).toBe("S");

        while (timeoutQueue.length) {
            const fn = timeoutQueue.shift();
            if (typeof fn === "function") fn();
        }
        expect(toastContainer.children.length).toBe(0);
    });

    it("showToast applies fallback type/icon rules and ignores invalid message", () => {
        const module = loadAppFeedbackModule();
        const toastContainer = createElementStub("div");
        globalThis.setTimeout = () => 1;
        const doc = {
            getElementById(id) {
                return id === "toast-container" ? toastContainer : null;
            },
            createElement(tag) {
                return createElementStub(tag);
            }
        };
        const service = module.createService({ document: doc });

        const noText = service.showToast("   ", { type: "error" });
        expect(noText).toBeUndefined();
        expect(toastContainer.children).toHaveLength(0);

        const fallbackToast = service.showToast("Notice", { type: "weird", icon: "   ", duration: "200" });
        expect(fallbackToast).toBeTruthy();
        expect(toastContainer.children).toHaveLength(1);
        expect(toastContainer.children[0].className).toContain("toast info");
        expect(toastContainer.children[0].children[0].textContent).toBe("i");
    });

    it("showFatalError wires reset handler and triggers reset+reload", async () => {
        const module = loadAppFeedbackModule();
        const banner = createElementStub("div");
        const resetBtn = createElementStub("button");
        let resetCount = 0;
        let reloadCount = 0;
        const service = module.createService({
            document: {
                getElementById(id) {
                    if (id === "fatal-error-banner") return banner;
                    if (id === "fatal-error-reset-btn") return resetBtn;
                    return null;
                }
            },
            resetAllSettings: async () => {
                resetCount += 1;
            },
            location: {
                reload() {
                    reloadCount += 1;
                }
            },
            t: (key) => key,
            logError: () => {}
        });

        service.showFatalError(new Error("boom"));
        expect(banner.style.display).toBe("flex");
        expect(resetBtn.listenerCount("click")).toBe(1);

        await resetBtn.trigger("click");
        expect(resetCount).toBe(1);
        expect(reloadCount).toBe(1);
    });

    it("showFatalError does not reload when resetAllSettings returns false", async () => {
        const module = loadAppFeedbackModule();
        const banner = createElementStub("div");
        const resetBtn = createElementStub("button");
        let resetCount = 0;
        let reloadCount = 0;
        const service = module.createService({
            document: {
                getElementById(id) {
                    if (id === "fatal-error-banner") return banner;
                    if (id === "fatal-error-reset-btn") return resetBtn;
                    return null;
                }
            },
            resetAllSettings: async () => {
                resetCount += 1;
                return false;
            },
            location: {
                reload() {
                    reloadCount += 1;
                }
            },
            t: () => "",
            logError: () => {}
        });

        service.showFatalError(new Error("boom"));
        await resetBtn.trigger("click");
        expect(resetCount).toBe(1);
        expect(reloadCount).toBe(0);
    });

    it("showFatalError rebinds reset click handler without stacking listeners", async () => {
        const module = loadAppFeedbackModule();
        const banner = createElementStub("div");
        const resetBtn = createElementStub("button");
        let resetCount = 0;
        let reloadCount = 0;
        const service = module.createService({
            document: {
                getElementById(id) {
                    if (id === "fatal-error-banner") return banner;
                    if (id === "fatal-error-reset-btn") return resetBtn;
                    return null;
                }
            },
            resetAllSettings: async () => {
                resetCount += 1;
            },
            location: {
                reload() {
                    reloadCount += 1;
                }
            },
            t: () => "",
            logError: () => {}
        });

        service.showFatalError(new Error("boom-1"));
        service.showFatalError(new Error("boom-2"));
        expect(resetBtn.listenerCount("click")).toBe(1);

        await resetBtn.trigger("click");
        expect(resetCount).toBe(1);
        expect(reloadCount).toBe(1);
    });

    it("showFatalError populates error metadata and wires retry/copy actions", async () => {
        const module = loadAppFeedbackModule();
        const banner = createElementStub("div");
        const resetBtn = createElementStub("button");
        const retryBtn = createElementStub("button");
        const copyBtn = createElementStub("button");
        const titleEl = createElementStub("h2");
        const descEl = createElementStub("p");
        const codeWrap = createElementStub("div");
        const codeEl = createElementStub("code");
        const detailsEl = createElementStub("pre");
        let reloadCount = 0;
        const copied = [];
        const storageState = new Map();

        const service = module.createService({
            document: {
                getElementById(id) {
                    if (id === "fatal-error-banner") return banner;
                    if (id === "fatal-error-reset-btn") return resetBtn;
                    if (id === "fatal-error-retry-btn") return retryBtn;
                    if (id === "fatal-error-copy-btn") return copyBtn;
                    if (id === "fatal-error-title") return titleEl;
                    if (id === "fatal-error-desc") return descEl;
                    if (id === "fatal-error-code-wrap") return codeWrap;
                    if (id === "fatal-error-code") return codeEl;
                    if (id === "fatal-error-details-content") return detailsEl;
                    return null;
                },
                createElement(tag) {
                    return createElementStub(tag);
                }
            },
            storage: {
                getItem(key) {
                    return storageState.has(key) ? storageState.get(key) : null;
                },
                setItem(key, value) {
                    storageState.set(key, value);
                }
            },
            writeClipboard: async (value) => {
                copied.push(value);
            },
            location: {
                reload() {
                    reloadCount += 1;
                }
            },
            t: (key) => key,
            logError: () => {}
        });

        service.showFatalError(new Error("Missing required module API: boom"));
        expect(titleEl.textContent).toBe("error_fatal_title");
        expect(descEl.textContent).toBe("error_fatal_desc_module_load");
        expect(codeEl.textContent).toMatch(/^GTV-MODULELOAD-/);
        expect(codeWrap.style.display).toBe("flex");
        expect(detailsEl.textContent).toContain("Missing required module API: boom");

        const storedLogs = JSON.parse(storageState.get("GTV_BOOTSTRAP_ERRORS"));
        expect(storedLogs).toHaveLength(1);
        expect(storedLogs[0].type).toBe("module_load");

        await retryBtn.trigger("click");
        expect(reloadCount).toBe(1);

        await copyBtn.trigger("click");
        expect(copied).toEqual([codeEl.textContent]);
    });

    it("supports explicit *Ref dependency keys for document, location, storage, and navigator", async () => {
        const module = loadAppFeedbackModule();
        const banner = createElementStub("div");
        const retryBtn = createElementStub("button");
        const copyBtn = createElementStub("button");
        const titleEl = createElementStub("h2");
        const descEl = createElementStub("p");
        const codeWrap = createElementStub("div");
        const codeEl = createElementStub("code");
        const detailsEl = createElementStub("pre");
        const toastContainer = createElementStub("div");
        let reloadCount = 0;
        const storageState = new Map();
        const copied = [];

        const service = module.createService({
            documentRef: {
                getElementById(id) {
                    if (id === "fatal-error-banner") return banner;
                    if (id === "fatal-error-retry-btn") return retryBtn;
                    if (id === "fatal-error-copy-btn") return copyBtn;
                    if (id === "fatal-error-title") return titleEl;
                    if (id === "fatal-error-desc") return descEl;
                    if (id === "fatal-error-code-wrap") return codeWrap;
                    if (id === "fatal-error-code") return codeEl;
                    if (id === "fatal-error-details-content") return detailsEl;
                    if (id === "toast-container") return toastContainer;
                    return null;
                },
                createElement(tag) {
                    return createElementStub(tag);
                }
            },
            locationRef: {
                reload() {
                    reloadCount += 1;
                }
            },
            storageRef: {
                getItem(key) {
                    return storageState.has(key) ? storageState.get(key) : null;
                },
                setItem(key, value) {
                    storageState.set(key, value);
                }
            },
            navigatorRef: {
                userAgent: "GTV-Test-Agent",
                clipboard: {
                    writeText: async (value) => {
                        copied.push(String(value));
                    }
                }
            },
            t: (key) => key,
            logError: () => {}
        });

        service.showFatalError(new Error("storage quota exceeded"));
        expect(descEl.textContent).toBe("error_fatal_desc_persistence");

        const storedLogs = JSON.parse(storageState.get("GTV_BOOTSTRAP_ERRORS"));
        expect(storedLogs).toHaveLength(1);
        expect(storedLogs[0].type).toBe("persistence");
        expect(storedLogs[0].userAgent).toBe("GTV-Test-Agent");

        await retryBtn.trigger("click");
        expect(reloadCount).toBe(1);

        await copyBtn.trigger("click");
        expect(copied).toEqual([codeEl.textContent]);
        expect(toastContainer.children).toHaveLength(1);
        expect(toastContainer.children[0].className).toContain("toast success");
    });

    it("prefers getter-based refs for document, location, storage, and navigator", async () => {
        const module = loadAppFeedbackModule();
        const banner = createElementStub("div");
        const retryBtn = createElementStub("button");
        const copyBtn = createElementStub("button");
        const titleEl = createElementStub("h2");
        const descEl = createElementStub("p");
        const codeWrap = createElementStub("div");
        const codeEl = createElementStub("code");
        const detailsEl = createElementStub("pre");
        const toastContainer = createElementStub("div");
        let reloadCount = 0;
        const storageState = new Map();
        const copied = [];

        globalThis.document = {
            getElementById() {
                throw new Error("global document should not be used");
            }
        };

        const service = module.createService({
            getDocumentRefOrNull: () => ({
                getElementById(id) {
                    if (id === "fatal-error-banner") return banner;
                    if (id === "fatal-error-retry-btn") return retryBtn;
                    if (id === "fatal-error-copy-btn") return copyBtn;
                    if (id === "fatal-error-title") return titleEl;
                    if (id === "fatal-error-desc") return descEl;
                    if (id === "fatal-error-code-wrap") return codeWrap;
                    if (id === "fatal-error-code") return codeEl;
                    if (id === "fatal-error-details-content") return detailsEl;
                    if (id === "toast-container") return toastContainer;
                    return null;
                },
                createElement(tag) {
                    return createElementStub(tag);
                }
            }),
            getLocationRef: () => ({
                reload() {
                    reloadCount += 1;
                }
            }),
            storageRef: {
                getItem(key) {
                    return storageState.has(key) ? storageState.get(key) : null;
                },
                setItem(key, value) {
                    storageState.set(key, value);
                }
            },
            getNavigatorRefOrNull: () => ({
                userAgent: "GTV-Getter-Agent",
                clipboard: {
                    writeText: async (value) => {
                        copied.push(String(value));
                    }
                }
            }),
            t: (key) => key,
            logError: () => {}
        });

        service.showFatalError(new Error("state mismatch"));
        expect(descEl.textContent).toBe("error_fatal_desc_state");
        const storedLogs = JSON.parse(storageState.get("GTV_BOOTSTRAP_ERRORS"));
        expect(storedLogs).toHaveLength(1);
        expect(storedLogs[0].userAgent).toBe("GTV-Getter-Agent");

        await retryBtn.trigger("click");
        expect(reloadCount).toBe(1);
        await copyBtn.trigger("click");
        expect(copied).toEqual([codeEl.textContent]);
        expect(toastContainer.children).toHaveLength(1);
    });

    it("showFatalError falls back to global console and no-op DOM when unavailable", () => {
        const module = loadAppFeedbackModule();
        let loggedArgs = null;
        const originalError = console.error;
        console.error = (...args) => {
            loggedArgs = args;
        };

        try {
            const service = module.createService({});
            expect(() => service.showFatalError(new Error("fatal"))).not.toThrow();
            expect(Array.isArray(loggedArgs)).toBe(true);
            expect(String(loggedArgs[0])).toContain("FATAL ERROR during app initialization");
        } finally {
            console.error = originalError;
        }
    });

    it("showFatalError prefers injected consoleError dependency when logError is unavailable", () => {
        const module = loadAppFeedbackModule();
        const loggedArgs = [];
        const service = module.createService({
            consoleError: (...args) => {
                loggedArgs.push(args);
            }
        });

        expect(() => service.showFatalError(new Error("fatal"))).not.toThrow();
        expect(loggedArgs).toHaveLength(1);
        expect(String(loggedArgs[0][0])).toContain("FATAL ERROR during app initialization");
    });
});
