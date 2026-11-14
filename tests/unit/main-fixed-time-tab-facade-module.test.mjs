import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "src", "js", "modules", "main-fixed-time-tab-facade.js");
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
        const liveNowToggle = { checked: false, disabled: true };
        const liveNowByGroup = new Map();
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
            getCurrentGroup: () => ({ id: 1 }),
            ensureGroupFixedTimes: () => { calls.push("ensure"); },
            refreshFixedTimeSlotCountControls: () => { calls.push("refresh"); },
            getCurrentGroupFixedTimeShowLiveNow: (group) => liveNowByGroup.get(group?.id) === true,
            getDocumentRef: () => ({
                getElementById: (id) => (id === "fixed-time-live-now-toggle" ? liveNowToggle : null)
            }),
            renderBaseTimeSelect: () => { calls.push("base"); },
        });

        expect(service.getFixedTimeSlotLayoutMetrics({})).toEqual({ inputWidthPx: 220, columnMinWidthPx: 300 });
        expect(service.getFixedTimeDisplayColumns()).toEqual(["timezone", "time_slots"]);
        expect(service.getFixedTimeOffsetTextAtDate({}, new Date())).toBe("+09:00");
        expect(service.renderFixedTimeTable()).toBe("table-rendered");
        liveNowByGroup.set(2, true);
        expect(service.renderFixedTimeControls({ id: 2 })).toBe(undefined);
        expect(liveNowToggle).toEqual({ checked: true, disabled: false });
        expect(service.renderFixedTimeTab()).toBe(undefined);
        expect(liveNowToggle).toEqual({ checked: false, disabled: false });
        expect(calls).toEqual(["table", "refresh", "ensure", "ensure", "base", "refresh", "table"]);
    });

    it("returns fallback values when fixed-time table service is unavailable", () => {
        const moduleApi = loadMainFixedTimeTabFacadeModule({ withWindow: false });
        const liveNowToggle = { checked: true, disabled: false };
        const service = moduleApi.createService({
            callServiceMethod: createCallServiceMethod(),
            getFixedTimeTableService: () => null,
            getCurrentGroup: () => null,
            getDocumentRef: () => ({
                getElementById: (id) => (id === "fixed-time-live-now-toggle" ? liveNowToggle : null)
            })
        });

        expect(service.getFixedTimeSlotLayoutMetrics({})).toEqual({ inputWidthPx: 100, columnMinWidthPx: 152 });
        expect(service.getFixedTimeDisplayColumns()).toEqual(["timezone", "region", "time_slots"]);
        expect(service.getFixedTimeOffsetTextAtDate({}, new Date())).toBe("");
        expect(service.renderFixedTimeTable()).toBe(undefined);
        expect(service.renderFixedTimeControls()).toBe(undefined);
        expect(liveNowToggle).toEqual({ checked: false, disabled: true });
        expect(service.renderFixedTimeTab()).toBe(undefined);
    });

    it("refreshes the copy preview after a full fixed time render, not on live ticks", () => {
        const moduleApi = loadMainFixedTimeTabFacadeModule();
        const calls = [];
        const service = moduleApi.createService({
            callServiceMethod: createCallServiceMethod(),
            getFixedTimeTableService: () => ({ renderFixedTimeTable: (isTick) => { calls.push(isTick ? "tick" : "table"); } }),
            getCurrentGroup: () => ({ id: 1 }),
            getCopyActionsService: () => ({ updateCopyFormatPreview: () => { calls.push("preview"); } }),
            getDocumentRef: () => ({ getElementById: () => null })
        });

        service.renderFixedTimeTab();
        expect(calls).toEqual(["table", "preview"]);
        calls.length = 0;
        service.renderFixedTimeTab(true);
        expect(calls).toEqual(["tick"]);
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
