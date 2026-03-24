import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-time-adjust-facade.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainTimeAdjustFacadeModule({ withWindow = true } = {}) {
    const globalPatches = withWindow ? { window: {}, console } : { console };
    const keys = ["window", "console", "GTVMainTimeAdjustFacade", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainTimeAdjustFacade
        || globalThis.GTVMainTimeAdjustFacade;
}

function createCallServiceMethod() {
    return (_serviceName, serviceRef, methodName, args = [], options = {}) => {
        if (serviceRef && typeof serviceRef[methodName] === "function") {
            return serviceRef[methodName](...args);
        }
        return options.fallback;
    };
}

describe("GTV main time adjust facade module", () => {
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

    it("delegates to time-adjust ui/action services when available", () => {
        const moduleApi = loadMainTimeAdjustFacadeModule();
        const uiService = {
            getTimeAdjustDayStep: () => 7,
            setTimeAdjustDayStep: () => "set",
            updateTimeAdjustPanel: () => "updated",
            sanitizeTimeAdjustDayStep: () => 11,
            renderTimeAdjustSet: () => "rendered",
            attachTimeAdjustToggleLabel: () => "attached"
        };
        const actionService = {
            resolveTimeAdjustZoneAndOffset: () => ({ zone: "Asia/Seoul", fixedOffsetMinutes: 540 }),
            applyTimeAdjustAction: () => "applied",
            getAdjustedUtcDateByAction: () => new Date("2026-01-01T00:00:00.000Z"),
            applyBulkRangeAllAction: () => "bulk",
            applyMultiRangeTimeAdjustAction: () => "multi"
        };
        const multiBulkToolsService = {
            renderMultiBulkToolSets: () => "multi-bulk-rendered"
        };

        const service = moduleApi.createService({
            callServiceMethod: createCallServiceMethod(),
            getTimeAdjustUiService: () => uiService,
            getTimeAdjustActionsService: () => actionService,
            getMultiBulkToolsService: () => multiBulkToolsService
        });

        expect(service.getTimeAdjustDayStep(0)).toBe(7);
        expect(service.setTimeAdjustDayStep(0, 2)).toBe("set");
        expect(service.updateTimeAdjustPanel()).toBe("updated");
        expect(service.sanitizeTimeAdjustDayStep(999)).toBe(11);
        expect(service.renderTimeAdjustSet(0, {})).toBe("rendered");
        expect(service.attachTimeAdjustToggleLabel(null, true, "", () => {})).toBe("attached");
        expect(service.renderMultiBulkToolSets()).toBe("multi-bulk-rendered");
        expect(service.resolveTimeAdjustZoneAndOffset({ id: "utc" })).toEqual({
            zone: "Asia/Seoul",
            fixedOffsetMinutes: 540
        });
        expect(service.applyTimeAdjustAction(0, "plus-minute")).toBe("applied");
        expect(service.getAdjustedUtcDateByAction(new Date(), "plus-minute", 0, { id: "utc" }, null))
            .toBeInstanceOf(Date);
        expect(service.applyBulkRangeAllAction(0, "plus-minute")).toBe("bulk");
        expect(service.applyMultiRangeTimeAdjustAction(0, 0, "plus-minute")).toBe("multi");
    });

    it("applies deterministic fallback behavior when dependencies are missing", () => {
        const moduleApi = loadMainTimeAdjustFacadeModule();
        let dayStepsState = [5];
        const service = moduleApi.createService({
            callServiceMethod: createCallServiceMethod(),
            getTimeAdjustUiService: () => null,
            getTimeAdjustActionsService: () => null,
            getMultiBulkToolsService: () => null,
            getTimeAdjustDayStepBySlotSnapshot: () => dayStepsState,
            setTimeAdjustDayStepBySlotState: (next) => { dayStepsState = next; },
            defaultTimeAdjustDayStep: 3,
            minTimeAdjustDayStep: 1,
            maxTimeAdjustDayStep: 10
        });

        expect(service.getTimeAdjustDayStep(0)).toBe(5);
        expect(service.getTimeAdjustDayStep(1)).toBe(3);
        expect(service.setTimeAdjustDayStep(1, 9)).toBe(undefined);
        expect(dayStepsState).toEqual([5, 9]);
        expect(service.updateTimeAdjustPanel()).toBe(null);
        expect(service.sanitizeTimeAdjustDayStep("20")).toBe(10);
        expect(service.sanitizeTimeAdjustDayStep("invalid")).toBe(3);
        expect(service.renderTimeAdjustSet(0, {})).toBe(null);
        expect(service.attachTimeAdjustToggleLabel(null, false, "", () => {})).toBe(null);
        expect(service.renderMultiBulkToolSets()).toBe(null);
        expect(service.resolveTimeAdjustZoneAndOffset({ id: "utc" })).toEqual({
            zone: "UTC",
            fixedOffsetMinutes: null
        });
        expect(service.applyTimeAdjustAction(0, "plus-minute")).toBe(undefined);
        expect(service.getAdjustedUtcDateByAction(new Date(), "plus-minute", 0, { id: "utc" }, null)).toBe(null);
        expect(service.applyBulkRangeAllAction(0, "plus-minute")).toBe(undefined);
        expect(service.applyMultiRangeTimeAdjustAction(0, 0, "plus-minute")).toBe(undefined);
    });

    it("supports createService without explicit dependency wiring", () => {
        const moduleApi = loadMainTimeAdjustFacadeModule({ withWindow: false });
        const service = moduleApi.createService({
            callServiceMethod: createCallServiceMethod()
        });

        expect(service.getTimeAdjustDayStep(0)).toBe(1);
        expect(service.sanitizeTimeAdjustDayStep(99999)).toBe(36500);
        expect(service.resolveTimeAdjustZoneAndOffset({ id: "utc" })).toEqual({
            zone: "UTC",
            fixedOffsetMinutes: null
        });
    });

    it("returns undefined-heavy fallbacks when dependencies are entirely omitted", () => {
        const moduleApi = loadMainTimeAdjustFacadeModule({ withWindow: false });
        const service = moduleApi.createService();

        expect(service.getTimeAdjustDayStep(0)).toBe(undefined);
        expect(service.setTimeAdjustDayStep(0, 2)).toBe(undefined);
        expect(service.updateTimeAdjustPanel()).toBe(undefined);
        expect(service.sanitizeTimeAdjustDayStep(999)).toBe(undefined);
        expect(service.renderTimeAdjustSet(0, {})).toBe(undefined);
        expect(service.attachTimeAdjustToggleLabel(null, true, "", () => {})).toBe(undefined);
        expect(service.renderMultiBulkToolSets()).toBe(undefined);
        expect(service.resolveTimeAdjustZoneAndOffset({ id: "utc" })).toBe(undefined);
    });
});
