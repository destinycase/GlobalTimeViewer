import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "format-controls.js");

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
        },
        toggle(token, force) {
            const key = String(token);
            const shouldAdd = (force === undefined) ? !values.has(key) : !!force;
            if (shouldAdd) values.add(key);
            else values.delete(key);
            return shouldAdd;
        }
    };
}

function createElementStub() {
    const el = {
        style: {},
        textContent: "",
        className: "",
        classList: createClassList(),
        dataset: {},
        children: [],
        addEventListener() { },
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
        insertBefore(node, beforeNode) {
            const currentIdx = this.children.indexOf(node);
            if (currentIdx >= 0) this.children.splice(currentIdx, 1);
            if (!beforeNode) {
                this.children.push(node);
                return node;
            }
            const beforeIdx = this.children.indexOf(beforeNode);
            if (beforeIdx < 0) this.children.push(node);
            else this.children.splice(beforeIdx, 0, node);
            return node;
        },
        setAttribute() { }
    };
    return el;
}

function loadFormatControlsModule(options = {}) {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = {
        window: {},
        globalThis: {},
        document: options.document || {
            getElementById() {
                return null;
            },
            querySelectorAll() {
                return [];
            }
        },
        console
    };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/format-controls.js" });
    return sandbox.window.GTVFormatControls || sandbox.GTVFormatControls || sandbox.globalThis.GTVFormatControls;
}

describe("GTV format controls module", () => {
    it("renderCopyFormatControls exits safely when required nodes are missing", () => {
        const module = loadFormatControlsModule({
            document: {
                getElementById() {
                    return null;
                }
            }
        });
        const service = module.createService({});

        expect(() => service.renderCopyFormatControls()).not.toThrow();
    });

    it("renderCopyFormatControls hides row when panel is disabled", () => {
        const row = createElementStub();
        const displayList = createElementStub();
        const copyList = createElementStub();
        let previewCalls = 0;
        const module = loadFormatControlsModule({
            document: {
                getElementById(id) {
                    if (id === "copy-format-row") return row;
                    if (id === "display-format-list") return displayList;
                    if (id === "copy-format-list") return copyList;
                    return null;
                }
            }
        });
        const service = module.createService({
            isShowCopyFormat: () => false,
            updateCopyFormatPreview: () => { previewCalls += 1; }
        });

        service.renderCopyFormatControls();

        expect(row.style.display).toBe("none");
        expect(displayList.textContent).toBe("");
        expect(copyList.textContent).toBe("");
        expect(previewCalls).toBe(1);
    });

    it("bindTimePartsOutsideClickHandler tolerates missing addEventListener", () => {
        const module = loadFormatControlsModule({
            document: {
                querySelectorAll() {
                    return [];
                }
            }
        });
        const service = module.createService({});

        expect(() => service.bindTimePartsOutsideClickHandler()).not.toThrow();
        expect(() => service.bindTimePartsOutsideClickHandler()).not.toThrow();
    });

    it("getCopyFormatDropTarget returns null for malformed containers", () => {
        const module = loadFormatControlsModule();
        const service = module.createService({});

        expect(service.getCopyFormatDropTarget(null, 10, 10)).toBe(null);
        expect(service.getCopyFormatDropTarget({}, 10, 10)).toBe(null);
        expect(service.getCopyFormatDropTarget({ querySelectorAll: () => [] }, 10, 10)).toBe(null);
    });

    it("renderFormatControlList handles invalid order/enabled values safely", () => {
        const module = loadFormatControlsModule({
            document: {
                createElement() {
                    return createElementStub();
                },
                querySelectorAll() {
                    return [];
                },
                addEventListener() { }
            }
        });
        const service = module.createService({
            COPY_FORMAT_KEYS: ["timezone"],
            TIME_PART_KEYS: ["date"],
            t: (key) => key
        });
        const list = createElementStub();

        expect(() => service.renderFormatControlList(list, null, null, {})).not.toThrow();
        expect(list.textContent).toBe("");
    });

    it("renderCopyFormatControls respects active context format keys", () => {
        const row = createElementStub();
        const displayList = createElementStub();
        const copyList = createElementStub();
        const module = loadFormatControlsModule({
            document: {
                getElementById(id) {
                    if (id === "copy-format-row") return row;
                    if (id === "display-format-list") return displayList;
                    if (id === "copy-format-list") return copyList;
                    return null;
                },
                createElement() {
                    return createElementStub();
                },
                querySelectorAll() {
                    return [];
                },
                addEventListener() { }
            }
        });
        const service = module.createService({
            COPY_FORMAT_KEYS: ["timezone", "region", "offset", "time", "period_days", "period_time"],
            TIME_PART_KEYS: ["dn", "date", "time", "weekday"],
            t: (key) => key,
            isShowCopyFormat: () => true,
            getActiveCopyFormatKeys: () => ["timezone", "region", "offset", "time"],
            getActiveTimePartKeys: () => ["dn", "time", "weekday"],
            getDisplayFormatOrder: () => ["timezone", "region", "offset", "time", "period_days", "period_time"],
            getDisplayFormatEnabled: () => ({
                timezone: true,
                region: true,
                offset: true,
                time: true,
                period_days: true,
                period_time: true
            }),
            getDisplayTimePartsEnabled: () => ({ dn: true, date: true, time: true, weekday: true }),
            getCopyFormatOrder: () => ["timezone", "region", "offset", "time", "period_days", "period_time"],
            getCopyFormatEnabled: () => ({
                timezone: true,
                region: true,
                offset: true,
                time: true,
                period_days: true,
                period_time: true
            }),
            getCopyTimePartsEnabled: () => ({ dn: true, date: true, time: true, weekday: true }),
            sanitizeCopyFormatOrder: (order) => order,
            renderList: () => { },
            updateCopyFormatPreview: () => { },
            savePersistence: () => { },
            upgradeNativeTitleTooltips: () => { }
        });

        service.renderCopyFormatControls();

        expect(displayList.children.map((item) => item.dataset.key)).toEqual(["timezone", "region", "offset", "time"]);
        expect(copyList.children.map((item) => item.dataset.key)).toEqual(["timezone", "region", "offset", "time"]);
        const displayTimeItem = displayList.children.find((item) => item.dataset.key === "time");
        const displayDropdown = displayTimeItem?.children?.[2] || null;
        const displayMenu = displayDropdown?.children?.[1] || null;
        expect(displayMenu?.children?.length || 0).toBe(3);
    });
});
