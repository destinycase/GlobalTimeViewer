import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "multi-range-render.js");

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
        readOnly: false,
        children: [],
        appendChild(child) {
            this.children.push(child);
            child.parentNode = this;
            return child;
        },
        setAttribute() { },
        addEventListener() { },
        insertAdjacentHTML() { },
        querySelectorAll() {
            return [];
        },
        querySelector() {
            return null;
        }
    };
}

function loadMultiRangeRenderModule(options = {}) {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = {
        window: {},
        globalThis: {},
        document: options.document || {
            activeElement: null,
            getElementById() {
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
    vm.runInContext(code, sandbox, { filename: "js/modules/multi-range-render.js" });
    return sandbox.window.GTVMultiRangeRender || sandbox.GTVMultiRangeRender || sandbox.globalThis.GTVMultiRangeRender;
}

describe("GTV multi-range render module", () => {
    it("buildTimezoneComputedSnapshotForRange returns null for missing timezone", () => {
        const module = loadMultiRangeRenderModule();
        const service = module.createService({});

        expect(service.buildTimezoneComputedSnapshotForRange(null, new Date(), new Date())).toBe(null);
    });

    it("applySnapshotToRow exits safely for malformed row objects", () => {
        const module = loadMultiRangeRenderModule();
        const service = module.createService({});

        expect(() => service.applySnapshotToRow(null, {})).not.toThrow();
        expect(() => service.applySnapshotToRow({}, {})).not.toThrow();
    });

    it("applySnapshotToRow populates time inputs from iterable querySelectorAll results", () => {
        const module = loadMultiRangeRenderModule();
        const service = module.createService({});
        const slot0Input = { dataset: { inputMode: "datetime" }, value: "" };
        const slot1Input = { dataset: { inputMode: "datetime" }, value: "" };
        const emptyIterable = { *[Symbol.iterator]() { } };
        const iterableOf = (items) => ({ *[Symbol.iterator]() { yield* items; } });
        const row = {
            querySelector() {
                return null;
            },
            querySelectorAll(selector) {
                if (selector === '.time-input[data-slot="0"]') return iterableOf([slot0Input]);
                if (selector === '.time-input[data-slot="1"]') return iterableOf([slot1Input]);
                return emptyIterable;
            }
        };

        service.applySnapshotToRow(row, {
            times: ["2026-03-13 09:00:00", "2026-03-13 10:00:00"],
            dates: ["2026-03-13", "2026-03-13"],
            clocks: ["09:00:00", "10:00:00"],
            dayNames: ["Fri", "Fri"],
            dayIndexes: [5, 5],
            dayNightIcons: ["DAY", "DAY"],
            periodDays: "1d",
            periodTime: "0d 1h 0m"
        });

        expect(slot0Input.value).toBe("2026-03-13 09:00:00");
        expect(slot1Input.value).toBe("2026-03-13 10:00:00");
    });

    it("formatRangeDurationText falls back to english when lang dep is missing", () => {
        const module = loadMultiRangeRenderModule();
        const service = module.createService({});

        const text = service.formatRangeDurationText(0, 90 * 60000);
        expect(text).toBe("0d 1h 30m");
    });

    it("createMultiRangeTableRow returns null when document.createElement is unavailable", () => {
        const module = loadMultiRangeRenderModule({
            document: {
                getElementById() {
                    return null;
                }
            }
        });
        const service = module.createService({});

        const row = service.createMultiRangeTableRow({ id: "utc" }, {
            rangeIdx: 0,
            range: { startUtcMs: 0, endUtcMs: 1000 },
            displayColumns: [],
            rowId: "utc"
        });
        expect(row).toBe(null);
    });

    it("renderMultiRanges exits safely when container is missing", () => {
        const module = loadMultiRangeRenderModule({
            document: {
                getElementById() {
                    return null;
                }
            }
        });
        const service = module.createService({});

        expect(() => service.renderMultiRanges()).not.toThrow();
    });

    it("renderMultiRanges handles empty multi-range state without crashing", () => {
        const container = createElementStub();
        const module = loadMultiRangeRenderModule({
            document: {
                activeElement: null,
                getElementById(id) {
                    if (id === "multi-ranges-container") return container;
                    return null;
                },
                createElement() {
                    return createElementStub();
                }
            }
        });
        const service = module.createService({
            getBaseTimezoneRef: () => ({ id: "utc", zone: "UTC" }),
            getZoneDisplayName: () => "UTC",
            escapeHtml: (value) => String(value || ""),
            getDisplayColumns: () => [],
            getRenderableTimezoneRows: () => [],
            getMultiRanges: () => [],
            getMultiRangeCollapsed: () => [],
            getMultiRangeCount: () => 0
        });

        expect(() => service.renderMultiRanges()).not.toThrow();
        expect(container.children.length).toBe(0);
    });
});
