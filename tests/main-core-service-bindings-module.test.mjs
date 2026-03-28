import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-core-service-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainCoreServiceBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainCoreServiceBindings", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainCoreServiceBindings || globalThis.GTVMainCoreServiceBindings;
}

describe("GTV main core service bindings module", () => {
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

    it("maps required core services into immutable bindings", () => {
        const moduleApi = loadMainCoreServiceBindingsModule();
        const mainCoreServices = {
            mainServiceMethodBridgeService: { id: "bridge" },
            mainDirectStatePatchService: { id: "patch" },
            mainAppStateBridgeService: { id: "app-state" },
            mainPatchedStateSelectorsService: { id: "selectors" },
            mainSharedUtilsService: { id: "shared-utils" },
            mainTimezoneRuntimeBridgeService: { id: "runtime-bridge" },
            mainTimezoneRuntimeService: { id: "runtime" },
            mainTimezoneFacadeService: { id: "timezone-facade" },
            mainBaseTimezoneService: { id: "base-timezone" },
            mainTimezoneMutationService: { id: "timezone-mutation" },
            mainTimezoneTableFacadeService: { id: "timezone-table" },
            mainTimeAdjustFacadeService: { id: "time-adjust" },
            mainFixedTimeTabFacadeService: { id: "fixed-time-tab" },
            mainFixedTimeFacadeService: { id: "fixed-time-facade" },
            mainTimelineFacadeService: { id: "timeline" },
            mainMultiRangeTabFacadeService: { id: "multi-range-tab" },
            mainGroupLocalizationServices: { id: "group-loc" },
            mainOrchestrationFlowServices: { id: "orchestration" }
        };

        const service = moduleApi.createService({ mainCoreServices });

        expect(service.mainServiceMethodBridgeService).toBe(mainCoreServices.mainServiceMethodBridgeService);
        expect(service.mainOrchestrationFlowServices).toBe(mainCoreServices.mainOrchestrationFlowServices);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit error for missing dependency", () => {
        const moduleApi = loadMainCoreServiceBindingsModule();
        expect(() => moduleApi.createService({})).toThrow("Missing dependency: mainCoreServices");
    });
});
