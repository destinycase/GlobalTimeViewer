import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "src", "js", "modules", "main-runtime-state-core-bootstrap.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeStateCoreBootstrapModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeStateCoreBootstrap", ...Object.keys(globalPatches)];
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
        globalThis.window?.GTVMainRuntimeStateCoreBootstrap
        || globalThis.GTVMainRuntimeStateCoreBootstrap
    );
}

describe("GTV main runtime state core bootstrap module", () => {
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

    it("builds and exposes host/primary/patched/local runtime state services", () => {
        const moduleApi = loadMainRuntimeStateCoreBootstrapModule();
        const setIsRealtimeState = vi.fn();
        const buildPatchedStateFallbackSnapshot = vi.fn(() => ({ ok: true }));
        let capturedStatePatchAccessorDeps = null;

        const hostUtils = {
            name: "host-utils",
            getRandomUUIDSafely: vi.fn(() => "uuid"),
            setRuntimeInterval: vi.fn((cb, ms) => `interval:${ms}`)
        };

        const primaryState = {
            name: "primary-state",
            setIsRealtimeState,
            getIsRealtimeState: vi.fn(() => true),
            getGlobalTimesState: vi.fn(() => []),
            getGlobalTimeState: vi.fn(() => new Date(0)),
            setGlobalTimeState: vi.fn(),
            getUiScaleState: vi.fn(() => 1)
        };
        const localStateHelpers = {
            name: "local-state-helpers",
            setMultiRangeState: vi.fn(),
            getNextFixedTimeSeed: vi.fn(() => 1),
            setUiPreferencesState: vi.fn(),
            getBaseTimeSnapshot: vi.fn(() => new Date(0)),
            getFixedTimeSlotCountForGroupRef: vi.fn(() => 1),
            confirmRuntime: vi.fn(() => true),
            getActiveCopyFormatKeysForCurrentContext: vi.fn(() => []),
            getActiveTimePartKeysForCurrentContext: vi.fn(() => []),
            getCurrentUiScalePercent: vi.fn(() => 100),
            getFixedTimeSlotCountForCurrentGroup: vi.fn(() => 1),
            getCurrentGroupFixedTimeShowLiveNow: vi.fn(() => false),
            shouldRunRealtimeTick: vi.fn(() => true),
            getTimeAdjustDayStepValue: vi.fn(() => 1)
        };

        const deps = {
            runtimeHostUtilsBindings: {
                createService: vi.fn(() => ({ mainRuntimeHostUtilsService: hostUtils }))
            },
            runtimePrimaryStateBindings: {
                createService: vi.fn(() => ({ mainRuntimePrimaryStateService: primaryState }))
            },
            runtimePatchedStateFallbackBindings: {
                createService: vi.fn(() => ({
                    mainRuntimePatchedStateFallbackService: { name: "patched-fallback" }
                }))
            },
            runtimeStatePatchAccessorProxiesModule: {
                createService: vi.fn((deps) => {
                    capturedStatePatchAccessorDeps = deps;
                    return {
                        applyDirectStatePatch: vi.fn(),
                        buildPatchedStateFallbackSnapshot
                    };
                })
            },
            runtimeLocalStateHelpersBindings: {
                createService: vi.fn(() => ({
                    mainRuntimeLocalStateHelpersService: localStateHelpers
                }))
            }
        };
        const service = moduleApi.createService(deps);

        expect(service.mainRuntimeHostUtilsService).toBe(hostUtils);
        expect(service.getRandomUUIDSafely()).toBe("uuid");
        expect(service.setRuntimeInterval(() => {}, 50)).toBe("interval:50");
        expect(() => service.getLuxonGlobalRef()).toThrow(
            "Missing required module API: mainRuntimeHostUtilsService.getLuxonGlobalRef"
        );
        expect(service.mainRuntimePrimaryStateService).toBe(primaryState);
        expect(service.setIsRealtimeState).toBe(primaryState.setIsRealtimeState);
        expect(service.getIsRealtimeState()).toBe(true);
        expect(service.mainRuntimePatchedStateFallbackService).toEqual({ name: "patched-fallback" });
        expect(service.mainRuntimeLocalStateHelpersService).toBe(localStateHelpers);
        expect(service.getCurrentUiScalePercent()).toBe(100);
        expect(service.confirmRuntime).toBe(localStateHelpers.confirmRuntime);
        expect(() => moduleApi.createService({
            ...deps,
            runtimePrimaryStateBindings: {
                createService: () => ({ mainRuntimePrimaryStateService: { name: "no-methods" } })
            }
        })).toThrow("Missing required dependency: mainRuntimePrimaryStateService.setIsRealtimeState");
        const { getTimeAdjustDayStepValue: _omitted, ...partialLocal } = localStateHelpers;
        expect(() => moduleApi.createService({
            ...deps,
            runtimeLocalStateHelpersBindings: {
                createService: () => ({ mainRuntimeLocalStateHelpersService: partialLocal })
            }
        })).toThrow("Missing required dependency: mainRuntimeLocalStateHelpersService.getTimeAdjustDayStepValue");
        expect(service.buildPatchedStateFallbackSnapshot()).toEqual({ ok: true });
        expect(capturedStatePatchAccessorDeps.getSetIsRealtimeState()).toBe(setIsRealtimeState);
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit dependency error when runtime host-utils bindings are missing", () => {
        const moduleApi = loadMainRuntimeStateCoreBootstrapModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required dependency: runtimeHostUtilsBindings"
        );
    });
});
