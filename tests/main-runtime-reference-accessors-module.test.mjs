import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-reference-accessors.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeReferenceAccessorsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeReferenceAccessors", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainRuntimeReferenceAccessors || globalThis.GTVMainRuntimeReferenceAccessors;
}

describe("GTV main runtime reference accessors module", () => {
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

    it("returns configured refs and computes day/night markers", () => {
        const moduleApi = loadMainRuntimeReferenceAccessorsModule();
        const renderList = vi.fn();
        const showToast = vi.fn();
        const updateClocks = vi.fn();
        const sanitizeDayNightHourValue = vi.fn((value, fallback) => {
            const parsed = Number.parseInt(value, 10);
            return Number.isFinite(parsed) ? parsed : fallback;
        });
        const normalizeDayNightRangeValues = vi.fn((dayStartHour, nightStartHour) => ({
            dayStartHour,
            nightStartHour
        }));

        const service = moduleApi.createService({
            getRenderList: () => renderList,
            getShowToast: () => showToast,
            getUpdateClocks: () => updateClocks,
            getTranslator: () => ((key) => `t:${key}`),
            getDayStartHourState: () => 6,
            getNightStartHourState: () => 18,
            sanitizeDayNightHourValue,
            normalizeDayNightRangeValues,
            getRuntimeCurrentLangValue: () => "en"
        });

        expect(Object.isFrozen(service)).toBe(true);
        expect(service.getRenderListRef()).toBe(renderList);
        expect(service.getShowToastRef()).toBe(showToast);
        expect(service.getUpdateClocksRef()).toBe(updateClocks);
        expect(service.getTranslatorRef()("x")).toBe("t:x");
        expect(service.getDayStartHourStateRef()).toBe(6);
        expect(service.getNightStartHourStateRef()).toBe(18);
        expect(service.getDayNightMarkerByHour(9)).toBe("DAY");
        expect(service.getDayNightMarkerByHour(23)).toBe("NIGHT");
        expect(service.getCurrentLangStateRef()).toBe("en");
        expect(sanitizeDayNightHourValue).toHaveBeenCalled();
        expect(normalizeDayNightRangeValues).toHaveBeenCalled();
    });

    it("delegates global time updates and renderer flag setters", () => {
        const moduleApi = loadMainRuntimeReferenceAccessorsModule();
        const setGlobalTimeState = vi.fn();
        const setCanUseForeignObjectRendererState = vi.fn();
        const invokeRenderBaseTimeSelect = vi.fn(() => "rendered");
        const resolveLocalDateParts = vi.fn(() => ({ Y: 2026, M: 3, D: 28 }));
        const buildStrictUtcDateFromParts = vi.fn(() => new Date("2026-03-28T00:00:00.000Z"));

        const service = moduleApi.createService({
            getSetGlobalTimeState: () => setGlobalTimeState,
            setCanUseForeignObjectRendererState,
            invokeRenderBaseTimeSelect,
            getTimeService: () => ({ resolveLocalDateParts }),
            getBuildStrictUtcDateFromParts: () => buildStrictUtcDateFromParts
        });

        service.setGlobalTimeValue(2, new Date("2026-03-28T09:00:00.000Z"));
        service.setCanUseForeignObjectRenderer("yes");

        expect(setGlobalTimeState).toHaveBeenCalledTimes(1);
        expect(setCanUseForeignObjectRendererState).toHaveBeenCalledWith(true);
        expect(service.invokeRenderBaseTimeSelect()).toBe("rendered");
        expect(service.resolveLocalDatePartsViaTimeService(new Date(), "UTC", "utc", null)).toEqual({ Y: 2026, M: 3, D: 28 });
        expect(service.buildStrictUtcDateFromPartsViaCore({})).toEqual(new Date("2026-03-28T00:00:00.000Z"));
    });

    it("uses safe fallbacks when optional deps are absent", () => {
        const moduleApi = loadMainRuntimeReferenceAccessorsModule();
        const service = moduleApi.createService();
        const fallbackParts = { fallback: true };

        expect(service.resolveLocalDatePartsViaTimeService(new Date(), "UTC", "utc", fallbackParts)).toBe(fallbackParts);
        expect(service.buildStrictUtcDateFromPartsViaCore({})).toBeNull();
        expect(service.getRandomValue()).toEqual(expect.any(Number));
        expect(service.createDefaultTableExportContext()).toEqual({
            table: null,
            headerSelector: "#table-head th",
            rowSelector: "#clocks-container tr.time-row"
        });
    });
});
