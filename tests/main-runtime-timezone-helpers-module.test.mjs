import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-timezone-helpers.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeTimezoneHelpersModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainRuntimeTimezoneHelpers", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainRuntimeTimezoneHelpers || globalThis.GTVMainRuntimeTimezoneHelpers;
}

describe("GTV main runtime timezone helpers module", () => {
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

    it("delegates shared util canvas/text parsing helpers", () => {
        const moduleApi = loadMainRuntimeTimezoneHelpersModule();
        const sharedUtilsService = {
            prepareExportCanvas: vi.fn(() => ({ canvas: true })),
            drawExportCellText: vi.fn(() => true),
            parseLocalDateTimeToUtcMs: vi.fn(() => 1710000000000)
        };
        const timeService = {
            formatDuration: vi.fn(() => ({ day: 0, hour: 1, minute: 30 }))
        };
        const service = moduleApi.createService({
            getMainSharedUtilsService: () => sharedUtilsService,
            getTimeService: () => timeService,
            getRuntimeCurrentLangValue: () => "ko"
        });

        expect(service.prepareExportCanvas(100, 100, "#fff")).toEqual({ canvas: true });
        expect(service.drawExportCellText({}, "t", 0, 0, 10, 10)).toBe(true);
        expect(service.getSignedDurationDayHourMinute("2026-03-28T00:00", "2026-03-28T01:30")).toEqual({
            day: 0,
            hour: 1,
            minute: 30
        });
        expect(sharedUtilsService.parseLocalDateTimeToUtcMs).toHaveBeenCalledTimes(2);
    });

    it("delegates timezone facade calls and local/utc conversion", () => {
        const moduleApi = loadMainRuntimeTimezoneHelpersModule();
        const callServiceMethod = vi.fn((_serviceName, _serviceRef, methodName, args, options) => {
            if (methodName === "getZoneAbbreviation") return "KST";
            if (methodName === "getZoneDisplayNameForUiAtDate") return "Korea Standard Time";
            return options?.fallback;
        });
        const timeService = {
            resolveLocalDateParts: vi.fn(() => ({ Y: 2026, M: 3, D: 28, H: 12, min: 0, S: 0 })),
            fromLocalPartsToUtc: vi.fn(() => new Date("2026-03-28T03:00:00.000Z"))
        };
        const timeCore = {
            getCustomOffsetMinutes: vi.fn(() => 540)
        };
        const service = moduleApi.createService({
            callServiceMethod,
            getMainTimezoneFacadeService: () => ({}),
            getGlobalTimeState: () => new Date("2026-03-28T00:00:00.000Z"),
            getTimeService: () => timeService,
            getTimeCore: () => timeCore
        });

        const tz = { id: "seoul", type: "custom", zone: "Asia/Seoul" };
        expect(service.getZoneAbbreviation(tz)).toBe("KST");
        expect(service.getZoneDisplayNameForUiAtDate(tz)).toBe("Korea Standard Time");
        expect(service.getCustomOffsetMinutes(tz)).toBe(540);
        expect(service.getLocalPartsByTimezone(new Date("2026-03-28T00:00:00.000Z"), tz)).toEqual({
            year: 2026,
            month: 3,
            day: 28,
            hour: 12,
            minute: 0,
            second: 0
        });
        expect(service.getUTCDateFromLocalParts({ year: 2026 }, tz) instanceof Date).toBe(true);
    });

    it("throws when clipboard API is unavailable", async () => {
        const moduleApi = loadMainRuntimeTimezoneHelpersModule();
        const warnSpy = vi.fn();
        const service = moduleApi.createService({
            getNavigatorRef: () => ({}),
            getConsoleWarn: () => warnSpy
        });

        await expect(service.writeClipboardText("x")).rejects.toThrow("Clipboard API is unavailable.");
        expect(warnSpy).not.toHaveBeenCalled();
    });

    it("uses injected consoleWarn fallback when clipboard write fails", async () => {
        const moduleApi = loadMainRuntimeTimezoneHelpersModule();
        const warned = [];
        const service = moduleApi.createService({
            navigatorRef: {
                clipboard: {
                    writeText: async () => {
                        throw new Error("clipboard denied");
                    }
                }
            },
            consoleWarn: (...args) => {
                warned.push(args);
            }
        });

        await expect(service.writeClipboardText("x")).rejects.toThrow("clipboard denied");
        expect(warned).toHaveLength(1);
        expect(String(warned[0][0])).toContain("Clipboard write failed.");
    });
});
