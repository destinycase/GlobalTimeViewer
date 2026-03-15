import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "fixed-time-table.js");

function loadFixedTimeTableModule(options = {}) {
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
            }
        },
        console
    };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/fixed-time-table.js" });
    return sandbox.window.GTVFixedTimeTable || sandbox.GTVFixedTimeTable || sandbox.globalThis.GTVFixedTimeTable;
}

describe("GTV fixed time table module", () => {
    it("getFixedTimeSlotLayoutMetrics scales with enabled parts", () => {
        const module = loadFixedTimeTableModule();
        const service = module.createService({});

        const full = service.getFixedTimeSlotLayoutMetrics({ dn: true, time: true, weekday: true });
        const minimal = service.getFixedTimeSlotLayoutMetrics({ dn: false, time: true, weekday: false });
        const noTime = service.getFixedTimeSlotLayoutMetrics({ dn: true, time: false, weekday: true });

        expect(full.columnMinWidthPx).toBeGreaterThan(minimal.columnMinWidthPx);
        expect(full.inputWidthPx).toBe(100);
        expect(noTime.inputWidthPx).toBe(0);
    });

    it("getFixedTimeDisplayColumns follows sanitized order/enabled states", () => {
        const module = loadFixedTimeTableModule();
        const service = module.createService({
            getDisplayFormatOrder: () => ["offset", "time", "timezone", "region"],
            getDisplayFormatEnabled: () => ({
                timezone: true,
                region: false,
                offset: true,
                time: true
            }),
            sanitizeCopyFormatOrderForContext: (order) => order,
            sanitizeCopyFormatEnabledForContext: (enabled) => enabled
        });

        expect(service.getFixedTimeDisplayColumns()).toEqual(["offset", "time_slots", "timezone"]);
    });

    it("renderFixedTimeTable exits safely when required DOM nodes are missing", () => {
        const module = loadFixedTimeTableModule({
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
            getCurrentGroup: () => null
        });

        expect(() => service.renderFixedTimeTable()).not.toThrow();
    });
});

