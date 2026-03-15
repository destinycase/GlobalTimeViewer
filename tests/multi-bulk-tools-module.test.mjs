import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "multi-bulk-tools.js");

function createClassList() {
    const values = new Set();
    return {
        add(...tokens) {
            tokens.forEach((token) => values.add(String(token)));
        },
        remove(...tokens) {
            tokens.forEach((token) => values.delete(String(token)));
        },
        contains(token) {
            return values.has(String(token));
        }
    };
}

function createElementStub(tagName = "div") {
    const listeners = new Map();
    const el = {
        tagName: String(tagName || "div").toUpperCase(),
        style: {},
        className: "",
        classList: createClassList(),
        dataset: {},
        textContent: "",
        disabled: false,
        children: [],
        appendChild(child) {
            this.children.push(child);
            child.parentNode = this;
            return child;
        },
        insertBefore(child, reference) {
            const idx = this.children.indexOf(reference);
            if (idx < 0) return this.appendChild(child);
            this.children.splice(idx, 0, child);
            child.parentNode = this;
            return child;
        },
        addEventListener(type, handler) {
            const list = listeners.get(type) || [];
            list.push(handler);
            listeners.set(type, list);
        },
        click() {
            const list = listeners.get("click") || [];
            list.forEach((handler) => handler());
        },
        querySelector() {
            return null;
        },
        querySelectorAll() {
            return [];
        },
        closest() {
            return null;
        },
        getBoundingClientRect() {
            return { width: 0, left: 0 };
        },
        scrollWidth: 0
    };
    return el;
}

function flattenTree(root) {
    const out = [];
    const stack = [root];
    while (stack.length) {
        const node = stack.pop();
        if (!node || typeof node !== "object") continue;
        out.push(node);
        const children = Array.isArray(node.children) ? node.children : [];
        for (let i = children.length - 1; i >= 0; i--) {
            stack.push(children[i]);
        }
    }
    return out;
}

function loadMultiBulkToolsModule(options = {}) {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = {
        window: {},
        globalThis: {},
        document: options.document || {
            getElementById() {
                return null;
            },
            createElement(tagName) {
                return createElementStub(tagName);
            },
            querySelectorAll() {
                return [];
            },
            querySelector() {
                return null;
            }
        },
        console,
        requestAnimationFrame: options.requestAnimationFrame || null,
        getComputedStyle: () => ({ columnGap: "0", gap: "0", marginRight: "0" })
    };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/multi-bulk-tools.js" });
    return sandbox.window.GTVMultiBulkTools || sandbox.GTVMultiBulkTools || sandbox.globalThis.GTVMultiBulkTools;
}

describe("GTV multi bulk tools module", () => {
    it("renderMultiBulkToolSets exits safely when controls are missing", () => {
        const module = loadMultiBulkToolsModule({
            document: {
                getElementById() {
                    return null;
                }
            }
        });
        const service = module.createService({});
        expect(() => service.renderMultiBulkToolSets()).not.toThrow();
    });

    it("handles non-iterable bulkSet.children safely", () => {
        const startTools = createElementStub("div");
        const allTools = createElementStub("div");
        const module = loadMultiBulkToolsModule({
            requestAnimationFrame: (cb) => cb(),
            document: {
                getElementById(id) {
                    if (id === "multi-bulk-start-tools") return startTools;
                    if (id === "multi-bulk-all-tools") return allTools;
                    return null;
                },
                createElement(tagName) {
                    return createElementStub(tagName);
                },
                querySelectorAll() {
                    return [];
                },
                querySelector() {
                    return null;
                }
            }
        });

        const service = module.createService({
            t: (key) => key,
            getMultiRangeCount: () => 2,
            renderTimeAdjustSet: () => ({
                children: { length: 2 },
                appendChild() { },
                insertBefore() { }
            }),
            createTimeAdjustActionButton: () => createElementStub("button"),
            createTimeAdjustDivider: () => createElementStub("span")
        });

        expect(() => service.renderMultiBulkToolSets()).not.toThrow();
    });

    it("wires bulk toggle button handlers", () => {
        const startTools = createElementStub("div");
        const allTools = createElementStub("div");
        let startEnableCount = 0;
        let endEnableCount = 0;
        const module = loadMultiBulkToolsModule({
            requestAnimationFrame: (cb) => cb(),
            document: {
                getElementById(id) {
                    if (id === "multi-bulk-start-tools") return startTools;
                    if (id === "multi-bulk-all-tools") return allTools;
                    return null;
                },
                createElement(tagName) {
                    return createElementStub(tagName);
                },
                querySelectorAll() {
                    return [];
                },
                querySelector() {
                    return null;
                }
            }
        });

        const service = module.createService({
            t: (key) => key,
            getMultiRangeCount: () => 2,
            renderTimeAdjustSet: () => createElementStub("div"),
            createTimeAdjustActionButton: () => createElementStub("button"),
            createTimeAdjustDivider: () => createElementStub("span"),
            setAllMultiRangeStartEditEnabled: (enabled) => {
                if (enabled) startEnableCount += 1;
            },
            setAllMultiRangeEndEditEnabled: (enabled) => {
                if (enabled) endEnableCount += 1;
            }
        });

        service.renderMultiBulkToolSets();

        const nodes = flattenTree(allTools);
        const enableStartBtn = nodes.find((node) => node.textContent === "btn_enable_all_start_time_adjust");
        const enableEndBtn = nodes.find((node) => node.textContent === "btn_enable_all_end_time_adjust");
        expect(enableStartBtn).toBeTruthy();
        expect(enableEndBtn).toBeTruthy();

        enableStartBtn.click();
        enableEndBtn.click();

        expect(startEnableCount).toBe(1);
        expect(endEnableCount).toBe(1);
    });
});

