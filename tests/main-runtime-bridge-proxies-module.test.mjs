import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-bridge-proxies.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeBridgeProxiesModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainRuntimeBridgeProxies", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainRuntimeBridgeProxies || globalThis.GTVMainRuntimeBridgeProxies;
}

describe("GTV main runtime bridge proxies module", () => {
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

    it("delegates table-render proxy calls through callServiceMethod", () => {
        const moduleApi = loadMainRuntimeBridgeProxiesModule();
        const callServiceMethod = vi.fn(() => ["row"]);
        const tableRenderService = {};
        const service = moduleApi.createService({
            callServiceMethod,
            getTableRenderService: () => tableRenderService
        });

        const result = service.getRenderableTimezoneRowsFromTableRender("base");

        expect(result).toEqual(["row"]);
        expect(callServiceMethod).toHaveBeenCalledWith(
            "tableRenderService",
            tableRenderService,
            "getRenderableTimezoneRows",
            ["base"],
            { fallback: [] }
        );
    });

    it("builds row copy text using patched copy-format selectors", () => {
        const moduleApi = loadMainRuntimeBridgeProxiesModule();
        const snapshotFormatService = {
            getRowCopyText: vi.fn((_rowOrId, options) => options)
        };
        const service = moduleApi.createService({
            getSnapshotFormatService: () => snapshotFormatService,
            getPatchedCopyFormatOrderState: () => ["time", "date"],
            getPatchedCopyFormatEnabledState: () => ({ time: true, date: false }),
            getPatchedCopyTimePartsEnabledState: () => ({ second: false })
        });

        const result = service.getRowCopyTextViaSnapshotService("row-1");

        expect(snapshotFormatService.getRowCopyText).toHaveBeenCalledOnce();
        expect(result).toEqual({
            order: ["time", "date"],
            enabled: { time: true, date: false },
            timePartsEnabled: { second: false }
        });
    });

    it("preserves fallback behavior for subgroup and multi-state helpers", () => {
        const moduleApi = loadMainRuntimeBridgeProxiesModule();
        const callServiceMethod = vi.fn((_serviceName, _serviceRef, _methodName, _args, options) => options.fallback);
        const service = moduleApi.createService({
            callServiceMethod,
            applyMultiRangeTimeAdjustAction: vi.fn(() => "adjusted")
        });

        expect(service.createMultiSubgroupStateViaState("name", 0, {})).toBeNull();
        const fallbackState = { timezoneIds: ["t1"], slotDates: [1, 2] };
        expect(service.sanitizeMultiStatePayloadViaState(null, fallbackState)).toBe(fallbackState);
        expect(service.applyFirstRangeStartAdjustAction(2, "plus-hour")).toBe("adjusted");
    });
});
