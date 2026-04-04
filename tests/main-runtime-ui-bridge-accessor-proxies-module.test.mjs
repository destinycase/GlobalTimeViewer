import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-ui-bridge-accessor-proxies.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeUiBridgeAccessorProxiesModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeUiBridgeAccessorProxies", ...Object.keys(globalPatches)];
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

    return (
        globalThis.window?.GTVMainRuntimeUiBridgeAccessorProxies
        || globalThis.GTVMainRuntimeUiBridgeAccessorProxies
    );
}

describe("GTV main runtime UI bridge accessor proxies module", () => {
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

    it("delegates UI bridge wrapper methods through callServiceMethod", () => {
        const moduleApi = loadMainRuntimeUiBridgeAccessorProxiesModule();
        const calls = [];
        const callServiceMethod = vi.fn((serviceName, _serviceRef, methodName, args = [], options = {}) => {
            calls.push({ serviceName, methodName, args, options });
            if (methodName === "getDisplayColumns") return ["timezone", "time_main"];
            if (methodName === "getDisplayTimeInputMode") return "datetime";
            if (methodName === "buildRowActionCells") return "<td>row</td>";
            if (methodName === "getCopyFieldLabel") return "copy_field_timezone";
            if (methodName === "getTimePartLabel") return "copy_time_part_hour";
            if (methodName === "renderList") return "mainTimezoneTableFacadeService.renderList";
            if (methodName === "renderTimelineFrame") return "mainTimelineFacadeService.renderTimelineFrame";
            if (methodName === "renderFixedTimeTab") return "mainFixedTimeTabFacadeService.renderFixedTimeTab";
            if (methodName === "getFixedTimeSlotHeaderLabel") return "Slot A";
            if (methodName === "resolveFixedTimeSlotUtcDate") return new Date(Date.UTC(2026, 0, 1, 0, 0, 0));
            if (methodName === "showFatalError") return undefined;
            if (Object.prototype.hasOwnProperty.call(options, "fallback")) return options.fallback;
            return `${serviceName}.${methodName}`;
        });
        const service = moduleApi.createService({
            callServiceMethod,
            getAppFeedbackService: () => ({ showToast: () => {} }),
            getTabOrchestratorService: () => ({ switchMainTab: () => {} }),
            getFormatControlsService: () => ({ getCopyFieldLabel: () => {} }),
            getTableRenderService: () => ({ getDisplayColumns: () => [] }),
            getMainTimezoneTableFacadeService: () => ({ renderList: () => {} }),
            getMainTimelineFacadeService: () => ({ renderTimelineFrame: () => {} }),
            getMainFixedTimeFacadeService: () => ({ resolveFixedTimeSlotUtcDate: () => null }),
            getMainFixedTimeTabFacadeService: () => ({ renderFixedTimeTab: () => {} }),
            getPatchedSlotCountState: () => 2,
            getGlobalTimeState: () => new Date(Date.UTC(2026, 0, 1, 0, 0, 0))
        });

        expect(service.showToast("ok")).toBe("appFeedbackService.showToast");
        expect(service.switchMainTab("fixed")).toBe("tabOrchestratorService.switchMainTab");
        expect(service.refreshOptionToggleDividers()).toBe("tabOrchestratorService.refreshOptionToggleDividers");
        expect(service.getCopyFieldLabel("timezone")).toBe("copy_field_timezone");
        expect(service.getTimePartLabel("hour")).toBe("copy_time_part_hour");
        expect(service.getDisplayColumns()).toEqual(["timezone", "time_main"]);
        expect(service.getDisplayTimeInputMode()).toBe("datetime");
        expect(service.buildRowActionCells("copy", "remove", "title")).toBe("<td>row</td>");
        expect(service.renderList()).toBe("mainTimezoneTableFacadeService.renderList");
        expect(service.renderTimelineFrame()).toBe("mainTimelineFacadeService.renderTimelineFrame");
        expect(service.getFixedTimeSlotHeaderLabel({}, 0, 1)).toBe("Slot A");
        expect(service.renderFixedTimeTab()).toBe("mainFixedTimeTabFacadeService.renderFixedTimeTab");
        expect(service.resolveFixedTimeSlotUtcDate({}, { id: "utc" })).toBeInstanceOf(Date);
        expect(Object.isFrozen(service)).toBe(true);

        const calledMethodNames = calls.map((entry) => entry.methodName);
        expect(calledMethodNames).toContain("showToast");
        expect(calledMethodNames).toContain("switchMainTab");
        expect(calledMethodNames).toContain("getDisplayColumns");
        expect(calledMethodNames).toContain("renderFixedTimeTab");
    });

    it("logs fatal bootstrap errors when showFatalError fallback is used", () => {
        const moduleApi = loadMainRuntimeUiBridgeAccessorProxiesModule();
        const missingToken = Symbol("missing");
        const errorLogs = [];
        const service = moduleApi.createService({
            callServiceMethod: (_serviceName, _serviceRef, _methodName, _args, options = {}) => options.fallback,
            serviceMethodMissingToken: missingToken,
            consoleError: (...args) => errorLogs.push(args)
        });

        const err = new Error("fatal");
        const result = service.showFatalError(err);

        expect(result).toBe(missingToken);
        expect(errorLogs.length).toBe(1);
        expect(String(errorLogs[0][0])).toContain("FATAL ERROR during app initialization");
        expect(errorLogs[0][1]).toBe(err);
    });

    it("prefers logError dependency over consoleError for fatal fallback logs", () => {
        const moduleApi = loadMainRuntimeUiBridgeAccessorProxiesModule();
        const missingToken = Symbol("missing");
        const logErrorCalls = [];
        const consoleErrorCalls = [];
        const service = moduleApi.createService({
            callServiceMethod: (_serviceName, _serviceRef, _methodName, _args, options = {}) => options.fallback,
            serviceMethodMissingToken: missingToken,
            logError: (...args) => logErrorCalls.push(args),
            consoleError: (...args) => consoleErrorCalls.push(args)
        });

        service.showFatalError(new Error("fatal"));

        expect(logErrorCalls).toHaveLength(1);
        expect(consoleErrorCalls).toHaveLength(0);
        expect(String(logErrorCalls[0][0])).toContain("FATAL ERROR during app initialization");
    });
});
