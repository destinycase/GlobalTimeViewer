import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-core-service-bootstrap.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeCoreServiceBootstrapModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimeCoreServiceBootstrap", ...Object.keys(globalPatches)];
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
        globalThis.window?.GTVMainRuntimeCoreServiceBootstrap
        || globalThis.GTVMainRuntimeCoreServiceBootstrap
    );
}

describe("GTV main runtime core service bootstrap module", () => {
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

    it("builds core service configs beside the services that consume them", () => {
        const moduleApi = loadMainRuntimeCoreServiceBootstrapModule();
        let selectConfig;
        let timezoneConfig;
        let snapshotConfig;
        const createMainSelectServices = vi.fn(() => ({
            adjustSelectWidthForContent: () => "adjusted",
            refreshSelectWidths: () => "refreshed",
            renderBaseTimeSelect: () => "rendered"
        }));
        const createTimezoneSearchService = vi.fn((config) => {
            timezoneConfig = config;
            return { name: "timezone-search-service" };
        });
        const createSnapshotFormatService = vi.fn((config) => {
            snapshotConfig = config;
            return { name: "snapshot-format-service" };
        });
        createMainSelectServices.mockImplementation((config) => {
            selectConfig = config;
            return {
                adjustSelectWidthForContent: () => "adjusted",
                refreshSelectWidths: () => "refreshed",
                renderBaseTimeSelect: () => "rendered"
            };
        });
        const renderList = () => "rows";
        const t = (key) => `t:${key}`;

        const service = moduleApi.createService({
            mainCoreServices: {
                createMainSelectServices,
                createTimezoneSearchService,
                createSnapshotFormatService
            },
            getDocumentRefOrNull: () => ({ id: "doc" }),
            getComputedStyleSafely: () => ({ fontSize: "12px" }),
            ensureBaseTimezoneSelection: () => true,
            getCurrentGroupBaseTimezoneId: () => "utc",
            isCurrentGroupUtcRowVisible: () => true,
            getCurrentGroupZones: () => [],
            getZoneAbbreviation: () => "UTC",
            getZoneDisplayName: () => "UTC",
            setCurrentGroupBaseTimezoneId: () => true,
            savePersistenceSafely: () => true,
            gtvT: t,
            TZ_DATABASE: [{ id: "UTC" }],
            getZoneMapRef: () => ({ UTC: true }),
            getPatchedCurrentLangState: () => "en",
            getBetterAbbr: () => "UTC",
            getTimezoneOffset: () => 0,
            getLocalizedTZLabel: () => "UTC",
            getCurrentGroup: () => ({ id: 1 }),
            deferDynamicCall: (getter) => (...args) => getter()(...args),
            getRenderListRef: () => renderList,
            addTimezone: () => true,
            createUniqueTimezoneId: () => "utc-1",
            DEFAULT_COPY_TIME_PARTS_ENABLED: { date: true },
            MAIN_I18N_DATA: { en: {} },
            getUTCRef: () => "UTC",
            getBaseTimezoneRef: () => "UTC",
            getGlobalTimesState: () => [],
            getPatchedSlotCountState: () => 1,
            getIsRealtimeState: () => true,
            getDayNightMarkerByHour: () => "day",
            getFixedOffsetForDisplay: () => "+00:00",
            normalizeCustomAbbr: (value) => value,
            getCustomOffsetMinutes: () => 0,
            pad: (value) => String(value).padStart(2, "0"),
            getSignedInclusiveDaySpan: () => 0,
            getSignedDurationDayHourMinute: () => "0d 00:00",
            sanitizeTimePartsEnabled: (value) => value,
            sanitizeCopyFormatOrder: (value) => value,
            timeService: { name: "time-service" }
        });

        expect(selectConfig.getDocumentRef()).toEqual({ id: "doc" });
        expect(selectConfig.t).toBe(t);
        expect(selectConfig.savePersistence()).toBe(true);
        expect(timezoneConfig.TZ_DATABASE).toEqual([{ id: "UTC" }]);
        expect(timezoneConfig.getZoneMap()).toEqual({ UTC: true });
        expect(timezoneConfig.renderList()).toBe("rows");
        expect(snapshotConfig.I18N_DATA).toEqual({ en: {} });
        expect(snapshotConfig.getCurrentLang()).toBe("en");
        expect(snapshotConfig.timeService).toEqual({ name: "time-service" });
        expect(typeof service.adjustSelectWidthForContent).toBe("function");
        expect(service.timezoneSearchService).toEqual({ name: "timezone-search-service" });
        expect(service.snapshotFormatService).toEqual({ name: "snapshot-format-service" });
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("throws explicit dependency errors for missing core service contracts", () => {
        const moduleApi = loadMainRuntimeCoreServiceBootstrapModule();

        expect(() => moduleApi.createService({})).toThrow(
            "Missing required dependency: mainCoreServices"
        );
        expect(() => moduleApi.createService({
            mainCoreServices: {}
        })).toThrow(
            "Missing required dependency: mainCoreServices.createMainSelectServices"
        );
    });
});
