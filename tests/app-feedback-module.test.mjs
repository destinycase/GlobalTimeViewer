import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "app-feedback.js");

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
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = {
        window: {},
        globalThis: {},
        console,
        setTimeout: () => 1
    };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/app-feedback.js" });
    return sandbox.window.GTVAppFeedback || sandbox.GTVAppFeedback || sandbox.globalThis.GTVAppFeedback;
}

describe("GTV app feedback module", () => {
    it("showToast renders a typed toast element", () => {
        const module = loadAppFeedbackModule();
        const toastContainer = createElementStub("div");
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
});
