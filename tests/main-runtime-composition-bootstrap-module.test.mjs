import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-composition-bootstrap.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeCompositionBootstrapModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeCompositionBootstrap", ...Object.keys(globalPatches)];
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
        globalThis.window?.GTVMainRuntimeCompositionBootstrap
        || globalThis.GTVMainRuntimeCompositionBootstrap
    );
}

describe("GTV main runtime composition bootstrap module", () => {
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

    it("builds runtime composition services through builder/core contracts", () => {
        const moduleApi = loadMainRuntimeCompositionBootstrapModule();
        const buildRuntimeCompositionConfig = vi.fn(() => ({ kind: "runtime-composition-config" }));
        const createMainRuntimeCompositionServices = vi.fn(() => ({
            timelineFrameService: { name: "timeline-frame-service" },
            fixedTimeTableService: { name: "fixed-time-table-service" },
            mainUiInitService: { name: "main-ui-init-service" },
            mainClockOrchestratorService: { name: "main-clock-orchestrator-service" }
        }));

        const service = moduleApi.createService({
            mainCompositionConfigBuilderService: {
                buildRuntimeCompositionConfig
            },
            mainCoreServices: {
                createMainRuntimeCompositionServices
            }
        });

        expect(buildRuntimeCompositionConfig).toHaveBeenCalledTimes(1);
        expect(createMainRuntimeCompositionServices).toHaveBeenCalledWith({ kind: "runtime-composition-config" });
        expect(service.timelineFrameService).toEqual({ name: "timeline-frame-service" });
        expect(service.mainUiInitService).toEqual({ name: "main-ui-init-service" });
        expect(service.mainClockOrchestratorService).toEqual({ name: "main-clock-orchestrator-service" });
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit dependency errors when required contracts are missing", () => {
        const moduleApi = loadMainRuntimeCompositionBootstrapModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required dependency: mainCompositionConfigBuilderService"
        );
        expect(() => moduleApi.createService({
            mainCompositionConfigBuilderService: {},
            mainCoreServices: {}
        })).toThrow(
            "Missing required dependency: mainCompositionConfigBuilderService.buildRuntimeCompositionConfig"
        );
    });
});
