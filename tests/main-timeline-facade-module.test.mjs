import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-timeline-facade.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainTimelineFacadeModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainTimelineFacade", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainTimelineFacade || globalThis.GTVMainTimelineFacade;
}

describe("GTV main timeline facade module", () => {
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
    it("delegates timeline methods to injected services", () => {
        const moduleApi = loadMainTimelineFacadeModule();
        const timelineFrameService = {
            shouldRenderTimeline: () => false,
            stopTimelineDrag: () => "stopped",
            applyTimelineRatioToSlot: () => "applied",
            getTimelineIndicatorLabel: () => "label",
            getTimelinePanelCount: () => 9,
            renderTimelineFrame: () => "rendered"
        };
        const fixedTimeTimelineService = {
            resolveFixedTimeTimelineSourceDate: () => "source-date",
            applyFixedTimeSlotTimelineRatio: () => true,
            getFixedTimeTimelineSlots: () => ["s1", "s2"],
            getFixedTimeTimelineSlotCount: () => 7,
            getFixedTimeTimelineIndicatorToken: () => "token",
            getFixedTimeSlotTimelineLabel: () => "slot-label"
        };
        const fixedTimeCoreService = {
            getFixedTimeTimelineIndicatorColor: () => "#112233",
            normalizeDayNightMarker: () => "DAY",
            getDayNightGlyph: () => "\u2600\uFE0F"
        };
        const callServiceMethod = (_serviceName, serviceRef, methodName, args = [], options = {}) => {
            if (serviceRef && typeof serviceRef[methodName] === "function") {
                return serviceRef[methodName](...args);
            }
            return options.fallback;
        };

        const service = moduleApi.createService({
            callServiceMethod,
            getTimelineFrameService: () => timelineFrameService,
            getFixedTimeTimelineService: () => fixedTimeTimelineService,
            getFixedTimeCoreService: () => fixedTimeCoreService,
            getMainTabState: () => "live",
            getShowTimelineState: () => true,
            isMultiTab: () => false,
            getCurrentGroup: () => ({ id: "g1" }),
            getFixedTimeSlotCountForGroup: () => 3,
            getFixedTimeSlotHeaderLabel: () => "fallback-header",
            getIsRealtimeState: () => false,
            getSlotCountState: () => 2,
            isFixedTimeTab: () => false,
            t: (key) => `i18n:${key}`
        });

        expect(service.isTimelineSupportedTab()).toBe(true);
        expect(service.shouldRenderTimeline()).toBe(false);
        expect(service.resolveFixedTimeTimelineSourceDate(0, { id: "utc" })).toBe("source-date");
        expect(service.applyFixedTimeSlotTimelineRatio(0, 0.5)).toBe(true);
        expect(service.getFixedTimeTimelineSlots()).toEqual(["s1", "s2"]);
        expect(service.getFixedTimeTimelineSlotCount()).toBe(7);
        expect(service.getFixedTimeTimelineIndicatorToken()).toBe("token");
        expect(service.getFixedTimeSlotTimelineLabel({}, 0, 2)).toBe("slot-label");
        expect(service.getFixedTimeTimelineIndicatorColor(0)).toBe("#112233");
        expect(service.stopTimelineDrag()).toBe("stopped");
        expect(service.normalizeDayNightMarker("night")).toBe("DAY");
        expect(service.getDayNightGlyph("DAY")).toBe("\u2600\uFE0F");
        expect(service.applyTimelineRatioToSlot(0, 0.2, { id: "utc" }, {})).toBe("applied");
        expect(service.getTimelineIndicatorLabel(0)).toBe("label");
        expect(service.getTimelinePanelCount()).toBe(9);
        expect(service.renderTimelineFrame()).toBe("rendered");
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("provides deterministic fallback behavior without concrete services", () => {
        const moduleApi = loadMainTimelineFacadeModule();
        const callServiceMethod = (_serviceName, _serviceRef, _methodName, _args = [], options = {}) => options.fallback;

        const service = moduleApi.createService({
            callServiceMethod,
            getMainTabState: () => "fixed",
            getShowTimelineState: () => true,
            isMultiTab: () => false,
            getCurrentGroup: () => ({ id: "g1" }),
            getFixedTimeSlotCountForGroup: () => 4,
            getFixedTimeSlotHeaderLabel: (_slot, slotIdx) => `slot-${slotIdx + 1}`,
            getIsRealtimeState: () => false,
            getSlotCountState: () => 2,
            isFixedTimeTab: () => false,
            t: (key) => key
        });

        expect(service.isTimelineSupportedTab()).toBe(true);
        expect(service.shouldRenderTimeline()).toBe(true);
        expect(service.resolveFixedTimeTimelineSourceDate(0, { id: "utc" })).toBe(null);
        expect(service.applyFixedTimeSlotTimelineRatio(0, 0.5)).toBe(false);
        expect(service.getFixedTimeTimelineSlots()).toEqual([]);
        expect(service.getFixedTimeTimelineSlotCount()).toBe(4);
        expect(service.getFixedTimeTimelineIndicatorToken()).toBe("");
        expect(service.getFixedTimeSlotTimelineLabel({}, 1, 2)).toBe("slot-2");
        expect(service.getFixedTimeTimelineIndicatorColor(3)).toBe("#f59e0b");
        expect(service.stopTimelineDrag()).toBe(undefined);
        expect(service.normalizeDayNightMarker("\uD83C\uDF19")).toBe("NIGHT");
        expect(service.getDayNightGlyph("DAY")).toBe("DAY");
        expect(service.applyTimelineRatioToSlot(0, 0.1, { id: "utc" }, {})).toBe(undefined);
        expect(service.getTimelineIndicatorLabel(0)).toBe("th_time_day_start");
        expect(service.getTimelinePanelCount()).toBe(2);
        expect(service.renderTimelineFrame()).toBe(undefined);
    });
});
