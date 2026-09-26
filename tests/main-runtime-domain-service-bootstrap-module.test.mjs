import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-domain-service-bootstrap.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeDomainServiceBootstrapModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeDomainServiceBootstrap", ...Object.keys(globalPatches)];
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
        globalThis.window?.GTVMainRuntimeDomainServiceBootstrap
        || globalThis.GTVMainRuntimeDomainServiceBootstrap
    );
}

describe("GTV main runtime domain service bootstrap module", () => {
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

    it("builds domain services from configs assembled beside their consumers", () => {
        const moduleApi = loadMainRuntimeDomainServiceBootstrapModule();

        const createMainFixedTimeServices = vi.fn(() => ({
            fixedTimeCoreService: { name: "fixed-core-service" },
            fixedTimeTimelineService: { name: "fixed-timeline-service" },
            fixedTimeActionsService: { name: "fixed-actions-service" }
        }));
        const createMainMultiRangeServices = vi.fn(() => ({
            multiRangeRenderService: { name: "multi-range-render-service" },
            multiRangeCopyService: { name: "multi-range-copy-service" },
            copyActionsService: { name: "copy-actions-service" }
        }));
        const createMainTimeAdjustServices = vi.fn(() => ({
            timeAdjustUiService: { name: "time-adjust-ui-service" },
            multiBulkToolsService: { name: "multi-bulk-tools-service" },
            timeAdjustActionsService: { name: "time-adjust-actions-service" }
        }));
        const createMainGroupStateServices = vi.fn(() => ({
            multiStateService: { name: "multi-state-service" },
            groupStateService: { name: "group-state-service" }
        }));

        const showToast = vi.fn((message) => `toast:${message}`);
        const groups = () => [{ id: "group-1" }];
        const service = moduleApi.createService({
            gtvT: (key) => `tx:${key}`,
            deferDynamicCall: (getter) => (...args) => getter()(...args),
            getShowToastRef: () => showToast,
            getGroupsStateSnapshot: groups,
            mainCoreServices: {
                createMainFixedTimeServices,
                createMainMultiRangeServices,
                createMainTimeAdjustServices,
                createMainGroupStateServices
            }
        });

        expect(createMainFixedTimeServices.mock.calls[0][0].t("hello")).toBe("tx:hello");
        expect(createMainFixedTimeServices.mock.calls[0][0].showToast("hello")).toBe("toast:hello");
        expect(showToast).toHaveBeenCalledWith("hello");
        expect(createMainMultiRangeServices.mock.calls[0][0].t("hello")).toBe("tx:hello");
        expect(typeof createMainTimeAdjustServices.mock.calls[0][0]).toBe("object");
        expect(createMainGroupStateServices.mock.calls[0][0].getGroups).toBe(groups);

        expect(service.fixedTimeCoreService).toEqual({ name: "fixed-core-service" });
        expect(service.copyActionsService).toEqual({ name: "copy-actions-service" });
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit dependency errors when required module contracts are missing", () => {
        const moduleApi = loadMainRuntimeDomainServiceBootstrapModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required dependency: mainCoreServices"
        );
        expect(() => moduleApi.createService({ mainCoreServices: {} })).toThrow(
            "Missing required dependency: mainCoreServices.createMainFixedTimeServices"
        );
    });
});
