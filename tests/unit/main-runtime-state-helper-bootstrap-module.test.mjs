import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "src", "js", "modules", "main-runtime-state-helper-bootstrap.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeStateHelperBootstrapModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeStateHelperBootstrap", ...Object.keys(globalPatches)];
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
        globalThis.window?.GTVMainRuntimeStateHelperBootstrap
        || globalThis.GTVMainRuntimeStateHelperBootstrap
    );
}

const STATE_HELPER_METHODS = [
    "parseDateTimeParts", "getTimeAdjustDayStepBySlotSnapshot", "setTimeAdjustDayStepBySlotState",
    "updateTimeAdjustPanelSafely", "getUTCRef", "getCurrentGroup", "getCurrentGroupZones",
    "getCurrentGroupBaseTimezoneId", "getBaseTimezoneRef", "ensureBaseTimezoneSelection",
    "formatUtcOffsetLabel", "normalizeCustomAbbr", "getCurrentMultiRangeStateSnapshot",
    "getGroupsStateSnapshot", "getActiveGroupIdByMainTabStateSnapshot", "patchPrimaryState",
    "setCurrentMainTabState", "setActiveGroupIdState", "setActiveGroupIdByMainTabState",
    "getActiveGroupNameSnapshot"
];

function buildHelpersService(overrides = {}) {
    const service = STATE_HELPER_METHODS.reduce((acc, methodName) => {
        acc[methodName] = vi.fn(() => methodName);
        return acc;
    }, {});
    return { ...service, extraHelper: vi.fn(), ...overrides };
}

describe("GTV main runtime state helper bootstrap module", () => {
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

    it("creates the runtime state helpers service and exposes its methods", () => {
        const moduleApi = loadMainRuntimeStateHelperBootstrapModule();
        const helpersService = buildHelpersService({ formatUtcOffsetLabel: vi.fn((minutes = 0) => `UTC+${minutes}`) });
        const helpersCreateService = vi.fn(() => helpersService);
        const getPatchAppState = () => "patch";

        const { mainRuntimeStateHelperAccessorService: accessors } = moduleApi.createService({
            runtimeStateHelpersModule: { createService: helpersCreateService },
            getPatchAppState,
            getGroupsState: () => [],
            unrelatedDep: "not forwarded"
        });

        const helperDeps = helpersCreateService.mock.calls[0][0];
        expect(helperDeps.getPatchAppState).toBe(getPatchAppState);
        expect(typeof helperDeps.getGroupsState).toBe("function");
        expect(helperDeps).not.toHaveProperty("unrelatedDep");
        expect(helperDeps).not.toHaveProperty("runtimeStateHelpersModule");
        expect(Object.keys(accessors)).toEqual(STATE_HELPER_METHODS);
        expect(Object.isFrozen(accessors)).toBe(true);
        expect(accessors.getCurrentGroup()).toBe("getCurrentGroup");
        expect(accessors.formatUtcOffsetLabel()).toBe("UTC+0");
        expect(accessors).not.toHaveProperty("extraHelper");
    });

    it("throws explicit errors for a missing module or a missing helper method", () => {
        const moduleApi = loadMainRuntimeStateHelperBootstrapModule();
        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainRuntimeStateHelpers.createService"
        );
        const { getActiveGroupNameSnapshot: _omitted, ...partial } = buildHelpersService();
        expect(() => moduleApi.createService({
            runtimeStateHelpersModule: { createService: () => partial }
        })).toThrow("Invalid runtime state helpers service");
        expect(() => moduleApi.createService({
            runtimeStateHelpersModule: { createService: () => null }
        })).toThrow("Invalid runtime state helpers service");
    });
});
