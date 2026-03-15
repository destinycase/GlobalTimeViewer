import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "table-render.js");

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

function createElementStub() {
    return {
        style: {},
        className: "",
        classList: createClassList(),
        dataset: {},
        textContent: "",
        innerHTML: "",
        id: "",
        draggable: false,
        children: [],
        appendChild(child) {
            this.children.push(child);
            child.parentNode = this;
            return child;
        },
        querySelectorAll() {
            return [];
        },
        querySelector() {
            return null;
        },
        insertAdjacentHTML() { },
        addEventListener() { }
    };
}

function loadTableRenderModule(options = {}) {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = {
        window: {},
        globalThis: {},
        document: options.document || {
            getElementById() {
                return null;
            },
            querySelector() {
                return null;
            },
            createElement() {
                return createElementStub();
            }
        },
        console
    };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/table-render.js" });
    return sandbox.window.GTVTableRender || sandbox.GTVTableRender || sandbox.globalThis.GTVTableRender;
}

describe("GTV table render module", () => {
    it("getDisplayColumns tolerates malformed format state", () => {
        const module = loadTableRenderModule();
        const service = module.createService({
            sanitizeCopyFormatOrder: () => null,
            getDisplayFormatOrder: () => null,
            getDisplayFormatEnabled: () => null
        });

        expect(service.getDisplayColumns(1)).toEqual([]);
    });

    it("getDisplayTimeInputMode returns none when parts map is missing", () => {
        const module = loadTableRenderModule();
        const service = module.createService({
            getDisplayTimePartsEnabled: () => null
        });

        expect(service.getDisplayTimeInputMode()).toBe("none");
    });

    it("getDisplayTimeInputMode honors part toggles even in multi tab", () => {
        const module = loadTableRenderModule();
        const service = module.createService({
            isMultiTab: () => true,
            getDisplayTimePartsEnabled: () => ({ dn: true, date: false, time: false, weekday: true })
        });

        expect(service.getDisplayTimeInputMode()).toBe("none");
    });

    it("createInteractiveTimezoneRow exits safely when document.createElement is missing", () => {
        const module = loadTableRenderModule({
            document: {
                getElementById() {
                    return null;
                }
            }
        });
        const service = module.createService({});

        expect(service.createInteractiveTimezoneRow({ id: "utc" }, 1, ["timezone"], "utc")).toBe(null);
    });

    it("getRenderableTimezoneRows handles non-array zones input", () => {
        const module = loadTableRenderModule();
        const service = module.createService({
            getCurrentGroupZones: () => null,
            isCurrentGroupUtcRowVisible: () => false
        });

        expect(service.getRenderableTimezoneRows({ id: "utc" })).toEqual([]);
    });

    it("renderList exits safely when required DOM nodes are missing", () => {
        const module = loadTableRenderModule({
            document: {
                getElementById() {
                    return null;
                },
                querySelector() {
                    return null;
                }
            }
        });
        const service = module.createService({
            hideFloatingTooltip: () => { },
            isMultiTab: () => false,
            isRealtime: () => false,
            getSlotCount: () => 1,
            getBaseTimezoneRef: () => ({ id: "utc", zone: "UTC" })
        });

        expect(() => service.renderList()).not.toThrow();
    });
});
