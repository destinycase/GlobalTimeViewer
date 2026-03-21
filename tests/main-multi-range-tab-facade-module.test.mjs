import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-multi-range-tab-facade.js");

function loadMainMultiRangeTabFacadeModule({ withWindow = true } = {}) {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = withWindow ? { window: {}, globalThis: {}, console } : { globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/main-multi-range-tab-facade.js" });
    return sandbox.window?.GTVMainMultiRangeTabFacade
        || sandbox.GTVMainMultiRangeTabFacade
        || sandbox.globalThis.GTVMainMultiRangeTabFacade;
}

function createCallServiceMethod() {
    return (_serviceName, serviceRef, methodName, args = [], options = {}) => {
        if (serviceRef && typeof serviceRef[methodName] === "function") {
            return serviceRef[methodName](...args);
        }
        return options.fallback;
    };
}

describe("GTV main multi-range tab facade module", () => {
    it("delegates render/format/copy operations to injected services", async () => {
        const moduleApi = loadMainMultiRangeTabFacadeModule();
        const multiRangeRenderService = {
            renderMultiRanges: () => "rendered",
            buildTimezoneComputedSnapshotForRange: () => ({ start: 1, end: 2 }),
            applySnapshotToRow: () => true,
            formatRangeDurationText: () => "2h 30m"
        };
        const multiRangeCopyService = {
            copyMultiRangeRow: async () => true,
            copyAllMultiRangeTimezones: async () => true
        };
        const service = moduleApi.createService({
            callServiceMethod: createCallServiceMethod(),
            getMultiRangeRenderService: () => multiRangeRenderService,
            getMultiRangeCopyService: () => multiRangeCopyService
        });

        const start = new Date("2026-01-01T00:00:00.000Z");
        const end = new Date("2026-01-01T01:00:00.000Z");
        expect(service.renderMultiRanges()).toBe("rendered");
        expect(service.buildTimezoneComputedSnapshotForRange({}, start, end)).toEqual({ start: 1, end: 2 });
        expect(service.applySnapshotToRow({}, {})).toBe(true);
        expect(service.formatRangeDurationText(start.getTime(), end.getTime())).toBe("2h 30m");
        await expect(service.copyMultiRangeRow(0, "tz-1")).resolves.toBe(true);
        await expect(service.copyAllMultiRangeTimezones()).resolves.toBe(true);
    });

    it("returns stable fallback values for missing dependencies and invalid inputs", async () => {
        const moduleApi = loadMainMultiRangeTabFacadeModule({ withWindow: false });
        const service = moduleApi.createService({
            callServiceMethod: createCallServiceMethod()
        });

        expect(service.renderMultiRanges()).toBe(undefined);
        expect(service.buildTimezoneComputedSnapshotForRange({}, "bad", new Date())).toBe(null);
        expect(service.applySnapshotToRow(null, {})).toBe(false);
        expect(service.formatRangeDurationText(NaN, NaN)).toBe("");
        await expect(service.copyMultiRangeRow(-1, "")).resolves.toBe(false);
        await expect(service.copyAllMultiRangeTimezones()).resolves.toBe(false);
    });

    it("supports no dependency injection", async () => {
        const moduleApi = loadMainMultiRangeTabFacadeModule({ withWindow: false });
        const service = moduleApi.createService();

        const start = new Date("2026-01-01T00:00:00.000Z");
        const end = new Date("2026-01-01T01:00:00.000Z");
        expect(service.renderMultiRanges()).toBe(undefined);
        expect(service.buildTimezoneComputedSnapshotForRange({}, start, end)).toBe(undefined);
        expect(service.applySnapshotToRow({}, {})).toBe(undefined);
        expect(service.formatRangeDurationText(start.getTime(), end.getTime())).toBe(undefined);
        await expect(service.copyMultiRangeRow(0, "tz-1")).resolves.toBe(undefined);
        await expect(service.copyAllMultiRangeTimezones()).resolves.toBe(undefined);
    });
});
