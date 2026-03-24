import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "image-clone.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadImageCloneModule(options = {}) {
    const globalPatches = {
        window: {},
        document: options.document || {
            createElement() {
                return { className: "", textContent: "" };
            }
        },
        console: options.console || console
    };
    const keys = ["window", "document", "console", "GTVImageClone", ...Object.keys(globalPatches)];
    const previous = new Map();
    keys.forEach((key) => {
        previous.set(key, {
            exists: Object.prototype.hasOwnProperty.call(globalThis, key),
            value: globalThis[key]
        });
    });

    Object.entries(globalPatches).forEach(([key, value]) => {
        globalThis[key] = value;
    });

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

    return globalThis.window?.GTVImageClone || globalThis.GTVImageClone;
}

function createMockSourceElement(values, removalSelector, includeClassList = false) {
    const sourceInputs = values.map((value) => ({ value }));
    const clonedInputs = values.map(() => ({
        replacedWith: null,
        replaceWith(node) {
            this.replacedWith = node;
        }
    }));
    const removableNodes = [{ removed: false, remove() { this.removed = true; } }];
    const clone = {
        querySelectorAll(selector) {
            if (selector === ".time-input") return clonedInputs;
            if (selector === removalSelector) return removableNodes;
            return [];
        }
    };
    if (includeClassList) {
        clone.classList = {
            removed: [],
            remove(token) {
                this.removed.push(token);
            }
        };
    }

    const source = {
        querySelectorAll(selector) {
            if (selector === ".time-input") return sourceInputs;
            return [];
        },
        cloneNode() {
            return clone;
        }
    };

    return { source, clone, clonedInputs, removableNodes };
}

describe("GTV image clone module", () => {
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

    it("clones timezone table and replaces input values with export spans", () => {
        const module = loadImageCloneModule();
        const { source, clonedInputs, removableNodes } = createMockSourceElement(
            ["09:00", "10:30"],
            ".export-exclude, .move-col, .move-cell"
        );
        const service = module.createService({});

        const clone = service.cloneTableForImageExport(source);

        expect(clone).toBeTruthy();
        expect(clonedInputs[0].replacedWith.className).toBe("export-time-text");
        expect(clonedInputs[0].replacedWith.textContent).toBe("09:00");
        expect(clonedInputs[1].replacedWith.textContent).toBe("10:30");
        expect(removableNodes[0].removed).toBe(true);
    });

    it("clones multi-range block, expands collapsed class and removes control nodes", () => {
        const module = loadImageCloneModule();
        const { source, clone, clonedInputs, removableNodes } = createMockSourceElement(
            ["08:00"],
            ".multi-range-header-actions, .multi-range-adjust-row, .export-exclude, .move-col, .move-cell",
            true
        );
        const service = module.createService({});

        service.cloneMultiRangeBlockForImageExport(source);

        expect(clonedInputs[0].replacedWith.textContent).toBe("08:00");
        expect(clone.classList.removed).toContain("collapsed");
        expect(removableNodes[0].removed).toBe(true);
    });

    it("returns null when clone source is invalid", () => {
        const module = loadImageCloneModule();
        const service = module.createService({});

        expect(service.cloneTableForImageExport(null)).toBeNull();
        expect(service.cloneMultiRangeBlockForImageExport(undefined)).toBeNull();
    });

    it("removes [DST] suffix from cloned zone-name labels", () => {
        const module = loadImageCloneModule();
        const zoneNameNode = { textContent: "America/New_York [DST]" };
        const source = {
            querySelectorAll(selector) {
                if (selector === ".time-input") return [];
                return [];
            },
            cloneNode() {
                return {
                    querySelectorAll(selector) {
                        if (selector === ".time-input") return [];
                        if (selector === ".zone-name") return [zoneNameNode];
                        if (selector === ".export-exclude, .move-col, .move-cell") return [];
                        return [];
                    }
                };
            }
        };
        const service = module.createService({});

        service.cloneTableForImageExport(source);

        expect(zoneNameNode.textContent).toBe("America/New_York");
    });
});
