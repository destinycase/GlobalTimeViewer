import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-operation-accessor-proxies.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeOperationAccessorProxiesModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeOperationAccessorProxies", ...Object.keys(globalPatches)];
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
        globalThis.window?.GTVMainRuntimeOperationAccessorProxies
        || globalThis.GTVMainRuntimeOperationAccessorProxies
    );
}

describe("GTV main runtime operation accessor proxies module", () => {
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

    it("delegates runtime operation wrappers with preserved behavior", async () => {
        const moduleApi = loadMainRuntimeOperationAccessorProxiesModule();
        const callServiceMethod = vi.fn((serviceName, _serviceRef, methodName) => {
            if (serviceName === "calculatorActionsService" && methodName === "initCalculators") return "calc-init";
            if (serviceName === "calculatorActionsService" && methodName === "copyText") return "copied";
            if (serviceName === "groupStateService" && methodName === "sanitizeGroup") return { name: "sanitized" };
            return undefined;
        });
        const updateClocks = vi.fn(() => "tick");
        const getPersistenceSnapshot = vi.fn(() => ({ ok: true }));
        const resolveLocalDatePartsByTimezoneAtDate = vi.fn(() => ({ hour: 9 }));
        const resolveLocalDatePartsByTimezone = vi.fn(() => ({ hour: 10 }));
        const buildStrictUtcDateFromParts = vi.fn(() => new Date(Date.UTC(2026, 0, 1, 0, 0, 0)));
        const handleTimeChange = vi.fn(() => "time-change");
        const handleMultiRangeTimeChange = vi.fn(() => "multi-time-change");
        const formatTimeTextByParts = vi.fn(() => "time-text");
        const formatSnapshotText = vi.fn(() => "snapshot-text");
        const loadPersistence = vi.fn(async () => ({ groups: [] }));
        const defaultCopyTimePartsEnabled = { dn: true };

        const service = moduleApi.createService({
            callServiceMethod,
            getMainOrchestrationFlowServices: () => ({
                updateClocks,
                getPersistenceSnapshot
            }),
            getTimeInputMutationsService: () => ({
                resolveLocalDatePartsByTimezoneAtDate,
                resolveLocalDatePartsByTimezone,
                buildStrictUtcDateFromParts,
                handleTimeChange,
                handleMultiRangeTimeChange
            }),
            getSnapshotFormatService: () => ({
                formatTimeTextByParts,
                formatSnapshotText
            }),
            getCalculatorActionsService: () => ({ initCalculators: () => {} }),
            getGroupStateService: () => ({ sanitizeGroup: () => {} }),
            getPersistenceService: () => ({ loadPersistence }),
            defaultCopyTimePartsEnabled
        });

        expect(service.updateClocks()).toBe("tick");
        expect(service.resolveLocalDatePartsByTimezoneAtDate("UTC", new Date())).toEqual({ hour: 9 });
        expect(service.resolveLocalDatePartsByTimezone("UTC", 0)).toEqual({ hour: 10 });
        expect(service.buildStrictUtcDateFromParts({ year: 2026 })).toBeInstanceOf(Date);
        expect(service.handleTimeChange("2026-01-01 00:00:00", "UTC", 0)).toBe("time-change");
        expect(service.handleMultiRangeTimeChange(0, "2026-01-01 00:00:00", "UTC", 0)).toBe("multi-time-change");
        expect(service.formatTimeTextByParts({ a: 1 })).toBe("time-text");
        expect(formatTimeTextByParts).toHaveBeenCalledWith({ a: 1 }, defaultCopyTimePartsEnabled);
        expect(service.formatSnapshotText({ a: 1 }, [], {})).toBe("snapshot-text");
        expect(service.initCalculators()).toBe("calc-init");
        await expect(service.copyText("source", true)).resolves.toBe("copied");
        expect(service.getPersistenceSnapshot()).toEqual({ ok: true });
        expect(service.sanitizeGroup({ name: "g" }, 1, null)).toEqual({ name: "sanitized" });
        await expect(service.loadPersistence()).resolves.toEqual({ groups: [] });
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("returns null for invalid group payload in sanitizeGroup", () => {
        const moduleApi = loadMainRuntimeOperationAccessorProxiesModule();
        const callServiceMethod = vi.fn(() => ({ name: "sanitized" }));
        const service = moduleApi.createService({
            callServiceMethod,
            getMainOrchestrationFlowServices: () => ({ updateClocks: () => {}, getPersistenceSnapshot: () => ({}) }),
            getTimeInputMutationsService: () => ({
                resolveLocalDatePartsByTimezoneAtDate: () => ({}),
                resolveLocalDatePartsByTimezone: () => ({}),
                buildStrictUtcDateFromParts: () => null,
                handleTimeChange: () => {},
                handleMultiRangeTimeChange: () => {}
            }),
            getSnapshotFormatService: () => ({ formatTimeTextByParts: () => "", formatSnapshotText: () => "" }),
            getCalculatorActionsService: () => ({}),
            getGroupStateService: () => ({}),
            getPersistenceService: () => ({ loadPersistence: async () => ({}) })
        });

        expect(service.sanitizeGroup(null, 0, null)).toBe(null);
        expect(callServiceMethod).not.toHaveBeenCalled();
    });
});
