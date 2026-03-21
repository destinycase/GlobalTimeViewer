import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-fixed-time-tab-facade.js");

function loadMainFixedTimeTabFacadeModule({ withWindow = true } = {}) {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = withWindow ? { window: {}, globalThis: {}, console } : { globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/main-fixed-time-tab-facade.js" });
    return sandbox.window?.GTVMainFixedTimeTabFacade
        || sandbox.GTVMainFixedTimeTabFacade
        || sandbox.globalThis.GTVMainFixedTimeTabFacade;
}

function createCallServiceMethod() {
    return (_serviceName, serviceRef, methodName, args = [], options = {}) => {
        if (serviceRef && typeof serviceRef[methodName] === "function") {
            return serviceRef[methodName](...args);
        }
        return options.fallback;
    };
}

describe("GTV main fixed-time tab facade module", () => {
    it("delegates fixed-time table methods and tab rendering flow", () => {
        const moduleApi = loadMainFixedTimeTabFacadeModule();
        const calls = [];
        const fixedTimeTableService = {
            getFixedTimeSlotLayoutMetrics: () => ({ inputWidthPx: 220, columnMinWidthPx: 300 }),
            getFixedTimeDisplayColumns: () => ["timezone", "time_slots"],
            getFixedTimeOffsetTextAtDate: () => "+09:00",
            renderFixedTimeTable: () => "table-rendered"
        };
        const service = moduleApi.createService({
            callServiceMethod: createCallServiceMethod(),
            getFixedTimeTableService: () => fixedTimeTableService,
            getCurrentGroup: () => ({ id: 1 }),
            ensureGroupFixedTimes: () => { calls.push("ensure"); },
            renderBaseTimeSelect: () => { calls.push("base"); },
            renderFixedTimeControls: () => { calls.push("controls"); }
        });

        expect(service.getFixedTimeSlotLayoutMetrics({})).toEqual({ inputWidthPx: 220, columnMinWidthPx: 300 });
        expect(service.getFixedTimeDisplayColumns()).toEqual(["timezone", "time_slots"]);
        expect(service.getFixedTimeOffsetTextAtDate({}, new Date())).toBe("+09:00");
        expect(service.renderFixedTimeTable()).toBe("table-rendered");
        expect(service.renderFixedTimeTab()).toBe(undefined);
        expect(calls).toEqual(["ensure", "base", "controls"]);
    });

    it("returns fallback values when fixed-time table service is unavailable", () => {
        const moduleApi = loadMainFixedTimeTabFacadeModule({ withWindow: false });
        const service = moduleApi.createService({
            callServiceMethod: createCallServiceMethod(),
            getFixedTimeTableService: () => null,
            getCurrentGroup: () => null
        });

        expect(service.getFixedTimeSlotLayoutMetrics({})).toEqual({ inputWidthPx: 100, columnMinWidthPx: 152 });
        expect(service.getFixedTimeDisplayColumns()).toEqual(["timezone", "region", "time_slots"]);
        expect(service.getFixedTimeOffsetTextAtDate({}, new Date())).toBe("");
        expect(service.renderFixedTimeTable()).toBe(undefined);
        expect(service.renderFixedTimeTab()).toBe(undefined);
    });

    it("supports omitted dependency wiring", () => {
        const moduleApi = loadMainFixedTimeTabFacadeModule({ withWindow: false });
        const service = moduleApi.createService();

        expect(service.getFixedTimeSlotLayoutMetrics({})).toBe(undefined);
        expect(service.getFixedTimeDisplayColumns()).toBe(undefined);
        expect(service.getFixedTimeOffsetTextAtDate({}, new Date())).toBe(undefined);
        expect(service.renderFixedTimeTable()).toBe(undefined);
        expect(service.renderFixedTimeTab()).toBe(undefined);
    });
});
