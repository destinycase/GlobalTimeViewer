import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-timezone-helper-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeTimezoneHelperBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeTimezoneHelperBindings", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainRuntimeTimezoneHelperBindings || globalThis.GTVMainRuntimeTimezoneHelperBindings;
}

describe("GTV main runtime timezone helper bindings module", () => {
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

    it("builds runtime timezone helper bindings from delegated service", () => {
        const moduleApi = loadMainRuntimeTimezoneHelperBindingsModule();
        const runtimeTimezoneHelpersService = {
            prepareExportCanvas: vi.fn(() => "canvas"),
            drawExportCellText: vi.fn(() => "draw"),
            parseLocalDateTimeToUtcMs: vi.fn(() => 123),
            getSignedDurationDayHourMinute: vi.fn(() => ({ day: 1 })),
            getZoneAbbreviation: vi.fn(() => "KST"),
            getZoneDisplayNameForUiAtDate: vi.fn(() => "Korea Standard Time"),
            getCustomOffsetMinutes: vi.fn(() => 540),
            writeClipboardText: vi.fn(async () => true),
            getLocalPartsByTimezone: vi.fn(() => ({ year: 2026 })),
            getUTCDateFromLocalParts: vi.fn(() => new Date("2026-03-28T00:00:00.000Z")),
            isCurrentGroupUtcRowVisible: vi.fn(() => true),
            getCurrentGroupUtcRowOrder: vi.fn(() => [])
        };
        const runtimeTimezoneHelpersModule = {
            createService: vi.fn(() => runtimeTimezoneHelpersService)
        };
        const deps = {
            runtimeTimezoneHelpersModule,
            getMainSharedUtilsService: () => ({}),
            getTimeService: () => ({}),
            getRuntimeCurrentLangValue: () => "ko",
            getGlobalTimeState: () => new Date(),
            callServiceMethod: () => undefined,
            getMainTimezoneFacadeService: () => ({}),
            getTimeCore: () => ({}),
            getConsoleWarn: () => () => undefined,
            getNavigatorRef: () => null,
            getGroupContextStateService: () => ({})
        };

        const service = moduleApi.createService(deps);

        expect(runtimeTimezoneHelpersModule.createService).toHaveBeenCalledWith({
            getMainSharedUtilsService: deps.getMainSharedUtilsService,
            getTimeService: deps.getTimeService,
            getRuntimeCurrentLangValue: deps.getRuntimeCurrentLangValue,
            getGlobalTimeState: deps.getGlobalTimeState,
            callServiceMethod: deps.callServiceMethod,
            getMainTimezoneFacadeService: deps.getMainTimezoneFacadeService,
            getTimeCore: deps.getTimeCore,
            getConsoleWarn: deps.getConsoleWarn,
            getNavigatorRef: deps.getNavigatorRef,
            getGroupContextStateService: deps.getGroupContextStateService
        });
        expect(service.getCustomOffsetMinutes()).toBe(540);
        expect(service.getZoneAbbreviation()).toBe("KST");
    });

    it("throws explicit errors for missing runtime helper module dependencies", () => {
        const moduleApi = loadMainRuntimeTimezoneHelperBindingsModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required module API: GTVMainRuntimeTimezoneHelpers.createService"
        );
        expect(() => moduleApi.createService({
            runtimeTimezoneHelpersModule: { createService: () => null }
        })).toThrow("Invalid runtime timezone helpers service");
    });
});
