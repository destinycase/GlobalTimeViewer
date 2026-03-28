import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-foundation-service-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainFoundationServiceBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainFoundationServiceBindings", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainFoundationServiceBindings || globalThis.GTVMainFoundationServiceBindings;
}

describe("GTV main foundation service bindings module", () => {
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

    it("maps foundation and core domain services into immutable bindings", () => {
        const moduleApi = loadMainFoundationServiceBindingsModule();
        const mainFoundationServices = {
            serviceBootstrap: { id: "bootstrap" },
            persistenceServiceBundleFactory: { id: "bundle" },
            mainUiUtilsService: { id: "ui-utils" },
            appFeedbackService: { id: "feedback" },
            calculatorActionsService: { id: "calc-actions" },
            setCustomTooltip: () => undefined,
            upgradeNativeTitleTooltips: () => undefined,
            hideFloatingTooltip: () => undefined,
            bindFloatingTooltipEvents: () => undefined,
            clearDragGhost: () => undefined,
            createDragGhostFromRow: () => undefined
        };
        const mainCoreServices = {
            groupContextStateService: { id: "group-context" },
            formatProfileStateService: { id: "format-profile" },
            multiRangeStateService: { id: "multi-range" },
            fixedTimeSlotUtilsService: { id: "slot-utils" },
            fixedTimeStateService: { id: "fixed-time-state" },
            uiPreferencesStateService: { id: "ui-pref" },
            timerEngineService: { id: "timer" },
            timeService: { id: "time" }
        };

        const service = moduleApi.createService({
            mainFoundationServices,
            mainCoreServices
        });

        expect(service.serviceBootstrap).toBe(mainFoundationServices.serviceBootstrap);
        expect(service.appFeedbackService).toBe(mainFoundationServices.appFeedbackService);
        expect(service.timeService).toBe(mainCoreServices.timeService);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit errors for missing dependencies", () => {
        const moduleApi = loadMainFoundationServiceBindingsModule();

        expect(() => moduleApi.createService({
            mainCoreServices: {}
        })).toThrow("Missing dependency: mainFoundationServices");

        expect(() => moduleApi.createService({
            mainFoundationServices: {}
        })).toThrow("Missing dependency: mainCoreServices");
    });
});
