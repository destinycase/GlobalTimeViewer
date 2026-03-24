import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-fixed-time-services.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainFixedTimeServicesModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainFixedTimeServices", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainFixedTimeServices || globalThis.GTVMainFixedTimeServices;
}

describe("GTV main fixed-time services module", () => {
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
    it("creates fixed-time core/timeline/actions services with wired dependencies", () => {
        const moduleApi = loadMainFixedTimeServicesModule();
        let coreConfig = null;
        let timelineConfig = null;
        let actionsConfig = null;

        const services = moduleApi.createService({
            GTV_FIXED_TIME_CORE: {
                createService: (cfg) => {
                    coreConfig = cfg;
                    return { id: "core" };
                }
            },
            GTV_FIXED_TIME_TIMELINE: {
                createService: (cfg) => {
                    timelineConfig = cfg;
                    return { id: "timeline" };
                }
            },
            GTV_FIXED_TIME_ACTIONS: {
                createService: (cfg) => {
                    actionsConfig = cfg;
                    return { id: "actions" };
                }
            },
            DEFAULT_FIXED_TIME_VALUE: "09:00",
            MIN_FIXED_TIME_SLOT_COUNT: 1,
            TIMELINE_TOTAL_SECONDS: 86400,
            I18N_DATA: {},
            t: (key) => key,
            getCurrentLang: () => "en",
            sanitizeFixedTimeValue: (value) => value,
            getFixedOffsetForDisplayAtDate: () => 0,
            getLocalPartsByTimezone: () => ({}),
            getUTCDateFromLocalParts: () => new Date(),
            pad: (value) => String(value).padStart(2, "0"),
            sanitizeTimePartsEnabledForContext: (value) => value,
            getDisplayTimePartsEnabled: () => ({ dn: true, time: true, weekday: true }),
            getDefaultFixedTimeName: () => "Fixed Time",
            sanitizeFixedTimeName: (value) => value,
            getFixedDateParts: () => ({ year: 2026, month: 3, day: 17 }),
            getCurrentGroup: () => ({}),
            ensureGroupFixedTimes: () => {},
            getGlobalTime: () => new Date(),
            resolveFixedTimeSlotUtcDate: () => new Date(),
            clampNumber: (value) => value,
            getFixedTimeSlotCount: () => 1,
            sanitizeFixedTimeId: (value) => value,
            getFixedTimeSlotHeaderLabel: () => "Fixed Time 1",
            sanitizeCopyFormatOrderForContext: (value) => value,
            sanitizeCopyFormatEnabledForContext: (value) => value,
            getCopyFormatOrder: () => ["timezone", "time"],
            getCopyFormatEnabled: () => ({ timezone: true, time: true }),
            getCopyTimePartsEnabled: () => ({ dn: true, time: true, weekday: true }),
            buildTimezoneComputedSnapshotForDates: () => ({}),
            formatSnapshotText: () => "snapshot",
            getBaseTimezoneRef: () => ({ id: "utc" }),
            getRenderableTimezoneRows: () => [],
            parseDateTimeParts: () => [9, 0, 0],
            showToast: () => {},
            writeClipboard: async () => {},
            buildFixedTimeDisplayPayloadAtUtc: () => ({}),
            renderFixedTimeTab: () => {},
            renderTimelineFrame: () => {},
            savePersistence: () => {},
            setFixedTimeSlotCount: () => {},
            refreshFixedTimeSlotCountControls: () => {}
        });

        expect(services.fixedTimeCoreService.id).toBe("core");
        expect(services.fixedTimeTimelineService.id).toBe("timeline");
        expect(services.fixedTimeActionsService.id).toBe("actions");

        expect(coreConfig.DEFAULT_FIXED_TIME_VALUE).toBe("09:00");
        expect(typeof coreConfig.getDisplayTimePartsEnabled).toBe("function");
        expect(timelineConfig.TIMELINE_TOTAL_SECONDS).toBe(86400);
        expect(typeof timelineConfig.getGlobalTime).toBe("function");
        expect(actionsConfig.MIN_FIXED_TIME_SLOT_COUNT).toBe(1);
        expect(typeof actionsConfig.getRenderableTimezoneRows).toBe("function");
    });

    it("throws when required module APIs are missing", () => {
        const moduleApi = loadMainFixedTimeServicesModule();
        expect(() => moduleApi.createService({})).toThrow("Missing required module API: GTVFixedTimeCore.createService");
    });
});
