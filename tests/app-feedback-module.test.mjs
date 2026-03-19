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
    const element = {
        tagName: String(tagName || "div").toUpperCase(),
        className: "",
        textContent: "",
        style: {},
        children: [],
        isConnected: true,
        parentNode: null,
        classList: {
            add(...names) {
                const merged = new Set((element.className || "").split(/\s+/).filter(Boolean));
                names.forEach((name) => merged.add(name));
                element.className = [...merged].join(" ");
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
        let confirmCount = 0;
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
            confirmFn: () => {
                confirmCount += 1;
                return true;
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
        expect(typeof resetBtn.onclick).toBe("function");

        await resetBtn.onclick();
        expect(confirmCount).toBe(1);
        expect(resetCount).toBe(1);
        expect(reloadCount).toBe(1);
    });

    it("showFatalError stops when user cancels confirmation", async () => {
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
            confirmFn: () => false,
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

        service.showFatalError(new Error("boom"));
        await resetBtn.onclick();
        expect(resetCount).toBe(0);
        expect(reloadCount).toBe(0);
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
});
