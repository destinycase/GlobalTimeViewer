import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "table-image-render.js");

function loadTableImageRenderModule(options = {}) {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = {
        window: {},
        globalThis: {},
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
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/table-image-render.js" });
    return sandbox.window.GTVTableImageRender || sandbox.GTVTableImageRender || sandbox.globalThis.GTVTableImageRender;
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

    it("strips [DST] suffix from zone-name for export text", () => {
        const module = loadTableImageRenderModule();
        const service = module.createService({});
        const cell = createQueryCell({
            ".zone-name": { textContent: "America/New_York [DST]" }
        });

        expect(service.extractTableCellText(cell)).toBe("America/New_York");
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
});
