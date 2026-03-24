import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "table-render.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

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
    const globalPatches = {
        window: options.window || {},
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
    const keys = ["window", "document", "GTVTableRender", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVTableRender || globalThis.GTVTableRender;
}

describe("GTV table render module", () => {
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
