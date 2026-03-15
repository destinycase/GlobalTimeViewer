import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "image-clone.js");

function loadImageCloneModule(options = {}) {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = {
        window: {},
        globalThis: {},
        document: options.document || {
            createElement() {
                return { className: "", textContent: "" };
            }
        },
        console: options.console || console
    };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/image-clone.js" });
    return sandbox.window.GTVImageClone || sandbox.GTVImageClone || sandbox.globalThis.GTVImageClone;
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
});

