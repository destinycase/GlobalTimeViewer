import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "table-image-render.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadTableImageRenderModule(options = {}) {
    const globalPatches = {
        window: {},
        document: options.document || {
            getElementById() {
                return null;
            }
        },
        getComputedStyle: options.getComputedStyle || (() => ({
            getPropertyValue: () => "",
            backgroundColor: "#000"
        })),
        console: options.console || console
    };
    const keys = ["window", "document", "getComputedStyle", "console", "GTVTableImageRender", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVTableImageRender || globalThis.GTVTableImageRender;
}

function createQueryCell(map = {}) {
    return {
        textContent: map.textContent || "",
        querySelector(selector) {
            return map[selector] || null;
        }
    };
}

describe("GTV table image render module", () => {
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

    it("extracts fixed-time text with day/night and weekday markers", () => {
        const module = loadTableImageRenderModule();
        const service = module.createService({});
        const cell = createQueryCell({
            ".fixed-time-clock": { textContent: "09:00:00" },
            ".dn-icon": { textContent: "\u2600\uFE0F" },
            ".day-badge": { textContent: "Sat" }
        });

        expect(service.extractTableCellText(cell)).toBe("\u2600\uFE0F 09:00:00 Sat");
    });

    it("extracts editable/exported time text variants", () => {
        const module = loadTableImageRenderModule();
        const service = module.createService({});
        const timeInputCell = createQueryCell({
            ".time-input": { value: "10:30:00" },
            ".dn-icon": { textContent: "N" },
            ".day-badge": { textContent: "Mon" }
        });
        const exportTextCell = createQueryCell({
            ".export-time-text": { textContent: "11:45:00" },
            ".dn-icon": { textContent: "D" },
            ".day-badge": { textContent: "Tue" }
        });

        expect(service.extractTableCellText(timeInputCell)).toBe("N 10:30:00 Mon");
        expect(service.extractTableCellText(exportTextCell)).toBe("D 11:45:00 Tue");
    });

    it("strips [DST] suffix from zone-name for export text", () => {
        const module = loadTableImageRenderModule();
        const service = module.createService({});
        const cell = createQueryCell({
            ".zone-name": { textContent: "America/New_York [DST]" }
        });

        expect(service.extractTableCellText(cell)).toBe("America/New_York");
    });

    it("extracts zone code, offset, period, button and plain fallback text", () => {
        const module = loadTableImageRenderModule();
        const service = module.createService({});

        expect(service.extractTableCellText(createQueryCell({
            ".zone-code": { textContent: "KST" }
        }))).toBe("KST");

        expect(service.extractTableCellText(createQueryCell({
            ".offset-text": { textContent: "+09:00" }
        }))).toBe("+09:00");

        expect(service.extractTableCellText(createQueryCell({
            ".period-days-text": { textContent: "2d" }
        }))).toBe("2d");

        expect(service.extractTableCellText(createQueryCell({
            ".period-days-text": { textContent: "-" },
            ".period-time-text": { textContent: "03:00:00" }
        }))).toBe("03:00:00");

        expect(service.extractTableCellText(createQueryCell({
            "button": { textContent: "Move" }
        }))).toBe("Move");

        expect(service.extractTableCellText(createQueryCell({
            textContent: "raw-cell-text"
        }))).toBe("raw-cell-text");

        expect(service.extractTableCellText(null)).toBe("");
    });

    it("extracts table header text from fixed title or plain text", () => {
        const module = loadTableImageRenderModule();
        const service = module.createService({});

        expect(service.extractTableHeaderText(createQueryCell({
            ".fixed-time-slot-title": { textContent: "Slot A" }
        }))).toBe("Slot A");
        expect(service.extractTableHeaderText(createQueryCell({
            textContent: "Header B"
        }))).toBe("Header B");
        expect(service.extractTableHeaderText(null)).toBe("");
    });

    it("returns default export context when document is unavailable", () => {
        const module = loadTableImageRenderModule({ document: null });
        const service = module.createService({});

        expect(service.getActiveTableExportContext()).toEqual({
            table: null,
            headerSelector: "#table-head th",
            rowSelector: "#clocks-container tr.time-row"
        });
    });

    it("returns fixed-time export context when fixed-time tab is active", () => {
        const fixedTable = { id: "fixed-table" };
        const module = loadTableImageRenderModule({
            document: {
                getElementById(id) {
                    if (id === "fixed-time-section") {
                        return {
                            querySelector(selector) {
                                return selector === ".data-table" ? fixedTable : null;
                            }
                        };
                    }
                    return null;
                }
            }
        });
        const service = module.createService({
            isFixedTimeTab: () => true
        });
        const context = service.getActiveTableExportContext();

        expect(context.table).toBe(fixedTable);
        expect(context.headerSelector).toBe("#fixed-time-table-head th");
        expect(context.rowSelector).toBe("#fixed-time-body tr.time-row");
    });

    it("returns timezone export context when fixed-time tab is inactive", () => {
        const timezoneTable = { id: "timezone-table-context" };
        const module = loadTableImageRenderModule({
            document: {
                getElementById(id) {
                    if (id === "timezone-section") {
                        return {
                            querySelector(selector) {
                                return selector === ".data-table" ? timezoneTable : null;
                            }
                        };
                    }
                    return null;
                }
            }
        });
        const service = module.createService({
            isFixedTimeTab: () => false
        });

        const context = service.getActiveTableExportContext();
        expect(context.table).toBe(timezoneTable);
        expect(context.headerSelector).toBe("#table-head th");
        expect(context.rowSelector).toBe("#clocks-container tr.time-row");
    });

    it("getActiveTableExportContext prefers injected getDocumentRefOrNull over global document", () => {
        const timezoneTable = { id: "timezone-table-injected-context" };
        const module = loadTableImageRenderModule({
            document: {
                getElementById() {
                    throw new Error("global document should not be used");
                }
            }
        });
        const service = module.createService({
            getDocumentRefOrNull: () => ({
                getElementById(id) {
                    if (id === "timezone-section") {
                        return {
                            querySelector(selector) {
                                return selector === ".data-table" ? timezoneTable : null;
                            }
                        };
                    }
                    return null;
                }
            }),
            isFixedTimeTab: () => false
        });

        const context = service.getActiveTableExportContext();
        expect(context.table).toBe(timezoneTable);
        expect(context.headerSelector).toBe("#table-head th");
        expect(context.rowSelector).toBe("#clocks-container tr.time-row");
    });

    it("delegates primary table render via clone and foreignObject renderer", async () => {
        const timezoneTable = { id: "timezone-table" };
        const cloned = { id: "cloned-table" };
        const module = loadTableImageRenderModule({
            document: {
                getElementById(id) {
                    if (id === "timezone-section") {
                        return {
                            querySelector(selector) {
                                return selector === ".data-table" ? timezoneTable : null;
                            }
                        };
                    }
                    return null;
                }
            }
        });
        let clonedInput = null;
        const service = module.createService({
            isFixedTimeTab: () => false,
            cloneTableForImageExport: (tableEl) => {
                clonedInput = tableEl;
                return cloned;
            },
            renderElementWithForeignObjectToPngDataUrl: async (tableEl) =>
                `data:image/png;base64,${tableEl.id}`
        });

        const dataUrl = await service.renderTimezoneTableToPngDataUrl();

        expect(clonedInput).toBe(timezoneTable);
        expect(dataUrl).toBe("data:image/png;base64,cloned-table");
    });

    it("falls back to original table when clone result is empty", async () => {
        const timezoneTable = { id: "timezone-table-original" };
        const module = loadTableImageRenderModule({
            document: {
                getElementById(id) {
                    if (id === "timezone-section") {
                        return {
                            querySelector(selector) {
                                return selector === ".data-table" ? timezoneTable : null;
                            }
                        };
                    }
                    return null;
                }
            }
        });
        const service = module.createService({
            isFixedTimeTab: () => false,
            cloneTableForImageExport: () => null,
            renderElementWithForeignObjectToPngDataUrl: async (tableEl) =>
                `data:image/png;base64,${tableEl.id}`
        });

        await expect(service.renderTimezoneTableToPngDataUrl()).resolves.toBe("data:image/png;base64,timezone-table-original");
    });

    it("throws when primary renderer is unavailable or table is missing", async () => {
        const timezoneTable = { id: "timezone-table-no-renderer" };
        const module = loadTableImageRenderModule({
            document: {
                getElementById(id) {
                    if (id === "timezone-section") {
                        return {
                            querySelector(selector) {
                                return selector === ".data-table" ? timezoneTable : null;
                            }
                        };
                    }
                    return null;
                }
            }
        });
        const service = module.createService({
            isFixedTimeTab: () => false,
            cloneTableForImageExport: () => timezoneTable
        });
        await expect(service.renderTimezoneTableToPngDataUrl()).rejects.toThrow("Primary renderer unavailable");

        const noTableModule = loadTableImageRenderModule({
            document: {
                getElementById() {
                    return null;
                }
            }
        });
        const noTableService = noTableModule.createService({
            isFixedTimeTab: () => false,
            renderElementWithForeignObjectToPngDataUrl: async () => "unused"
        });
        await expect(noTableService.renderTimezoneTableToPngDataUrl()).rejects.toThrow("Timezone table not found");
    });

    it("throws when fallback table has no data rows", async () => {
        const tableEl = {
            querySelectorAll(selector) {
                if (selector === "#table-head th") {
                    return [];
                }
                if (selector === "#clocks-container tr.time-row") {
                    return [];
                }
                return [];
            }
        };
        const module = loadTableImageRenderModule({
            document: {
                documentElement: {},
                body: {},
                getElementById(id) {
                    if (id === "timezone-section") {
                        return {
                            querySelector(selector) {
                                return selector === ".data-table" ? tableEl : null;
                            }
                        };
                    }
                    return null;
                }
            }
        });
        const service = module.createService({
            isFixedTimeTab: () => false,
            waitForDocumentFontsReady: async () => {}
        });

        await expect(service.renderTimezoneTableFallbackDataUrl()).rejects.toThrow("No table data to render");
    });

    it("throws for fallback renderer when table is unavailable", async () => {
        const module = loadTableImageRenderModule({
            document: {
                getElementById() {
                    return null;
                }
            }
        });
        const service = module.createService({
            isFixedTimeTab: () => false,
            waitForDocumentFontsReady: async () => { }
        });

        await expect(service.renderTimezoneTableFallbackDataUrl()).rejects.toThrow("Table element not found");
    });

    it("uses injected logWarn when async dependency invocation throws", async () => {
        const warned = [];
        const module = loadTableImageRenderModule({
            document: {
                getElementById() {
                    return null;
                }
            }
        });
        const service = module.createService({
            logWarn: (...args) => {
                warned.push(args);
            },
            waitForDocumentFontsReady: async () => {
                throw new Error("font warmup failed");
            }
        });

        await expect(service.renderTimezoneTableFallbackDataUrl()).rejects.toThrow("Table element not found");
        expect(warned).toHaveLength(1);
        expect(String(warned[0][0])).toContain('Dependency "waitForDocumentFontsReady" threw.');
    });
});
