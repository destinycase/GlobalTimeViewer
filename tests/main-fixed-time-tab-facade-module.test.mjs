import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-fixed-time-tab-facade.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainFixedTimeTabFacadeModule({ withWindow = true } = {}) {
    const globalPatches = withWindow ? { window: {}, console } : { console };
    const keys = ["window", "console", "GTVMainFixedTimeTabFacade", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainFixedTimeTabFacade
        || globalThis.GTVMainFixedTimeTabFacade;
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

    it("delegates fixed-time table methods and tab rendering flow", () => {
        const moduleApi = loadMainFixedTimeTabFacadeModule();
        const calls = [];
        const dateInput = { value: "" };
        const fixedTimeTableService = {
            getFixedTimeSlotLayoutMetrics: () => ({ inputWidthPx: 220, columnMinWidthPx: 300 }),
            getFixedTimeDisplayColumns: () => ["timezone", "time_slots"],
            getFixedTimeOffsetTextAtDate: () => "+09:00",
            renderFixedTimeTable: () => {
                calls.push("table");
                return "table-rendered";
            }
        };
        const service = moduleApi.createService({
            callServiceMethod: createCallServiceMethod(),
            getFixedTimeTableService: () => fixedTimeTableService,
            getCurrentGroup: () => ({ id: 1, fixedDate: "2026-03-21" }),
            ensureGroupFixedTimes: () => { calls.push("ensure"); },
            refreshFixedTimeSlotCountControls: () => { calls.push("refresh"); },
            getDocumentRef: () => ({
                getElementById: () => dateInput
            }),
            renderBaseTimeSelect: () => { calls.push("base"); },
        });

        expect(service.getFixedTimeSlotLayoutMetrics({})).toEqual({ inputWidthPx: 220, columnMinWidthPx: 300 });
        expect(service.getFixedTimeDisplayColumns()).toEqual(["timezone", "time_slots"]);
        expect(service.getFixedTimeOffsetTextAtDate({}, new Date())).toBe("+09:00");
        expect(service.renderFixedTimeTable()).toBe("table-rendered");
        expect(service.renderFixedTimeControls({ fixedDate: "2026-03-22" })).toBe(undefined);
        expect(dateInput.value).toBe("2026-03-22");
        expect(service.renderFixedTimeTab()).toBe(undefined);
        expect(dateInput.value).toBe("2026-03-21");
        expect(calls).toEqual(["table", "refresh", "ensure", "ensure", "base", "refresh", "table"]);
    });

    it("returns fallback values when fixed-time table service is unavailable", () => {
        const moduleApi = loadMainFixedTimeTabFacadeModule({ withWindow: false });
        const dateInput = { value: "keep" };
        const service = moduleApi.createService({
            callServiceMethod: createCallServiceMethod(),
            getFixedTimeTableService: () => null,
            getCurrentGroup: () => null,
            getDocumentRef: () => ({
                getElementById: () => dateInput
            })
        });

        expect(service.getFixedTimeSlotLayoutMetrics({})).toEqual({ inputWidthPx: 100, columnMinWidthPx: 152 });
        expect(service.getFixedTimeDisplayColumns()).toEqual(["timezone", "region", "time_slots"]);
        expect(service.getFixedTimeOffsetTextAtDate({}, new Date())).toBe("");
        expect(service.renderFixedTimeTable()).toBe(undefined);
        expect(service.renderFixedTimeControls()).toBe(undefined);
        expect(dateInput.value).toBe("");
        expect(service.renderFixedTimeTab()).toBe(undefined);
    });

    it("supports omitted dependency wiring", () => {
        const moduleApi = loadMainFixedTimeTabFacadeModule({ withWindow: false });
        const service = moduleApi.createService();

        expect(service.getFixedTimeSlotLayoutMetrics({})).toBe(undefined);
        expect(service.getFixedTimeDisplayColumns()).toBe(undefined);
        expect(service.getFixedTimeOffsetTextAtDate({}, new Date())).toBe(undefined);
        expect(service.renderFixedTimeControls()).toBe(undefined);
        expect(service.renderFixedTimeTable()).toBe(undefined);
        expect(service.renderFixedTimeTab()).toBe(undefined);
    });
});
