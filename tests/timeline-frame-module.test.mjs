import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "timeline-frame.js");

function loadTimelineFrameModule(options = {}) {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = {
        window: {},
        globalThis: {},
        Date: options.Date || Date,
        document: options.document || {
            getElementById() {
                return null;
            },
            createElement() {
                return null;
            }
        },
        console
    };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/timeline-frame.js" });
    return sandbox.window.GTVTimelineFrame || sandbox.GTVTimelineFrame || sandbox.globalThis.GTVTimelineFrame;
}

describe("GTV timeline frame module", () => {
    it("shouldRenderTimeline follows tab/toggle/multi conditions", () => {
        const module = loadTimelineFrameModule();
        const service = module.createService({
            getShowTimeline: () => true,
            getCurrentMainTab: () => "fixed",
            isMultiTab: () => false
        });
        expect(service.shouldRenderTimeline()).toBe(true);

        const serviceMulti = module.createService({
            getShowTimeline: () => true,
            getCurrentMainTab: () => "fixed",
            isMultiTab: () => true
        });
        expect(serviceMulti.shouldRenderTimeline()).toBe(false);
    });

    it("renderTimelineFrame exits safely without frame element", () => {
        const module = loadTimelineFrameModule();
        const service = module.createService({
            getTimelineFrameElement: () => null
        });
        expect(() => service.renderTimelineFrame()).not.toThrow();
    });

    it("applyTimelineRatioToSlot uses fixed-time path and respects render/persist options", () => {
        const module = loadTimelineFrameModule();
        let applyCount = 0;
        let updateCount = 0;
        let saveCount = 0;
        const service = module.createService({
            getIsRealtime: () => false,
            isFixedTimeTab: () => true,
            applyFixedTimeSlotTimelineRatio: () => {
                applyCount += 1;
                return true;
            },
            updateClocks: () => {
                updateCount += 1;
            },
            savePersistence: () => {
                saveCount += 1;
            }
        });

        service.applyTimelineRatioToSlot(0, 0.5, { id: "utc", zone: "UTC" }, { render: false, persist: false });
        expect(applyCount).toBe(1);
        expect(updateCount).toBe(0);
        expect(saveCount).toBe(0);

        service.applyTimelineRatioToSlot(0, 0.75, { id: "utc", zone: "UTC" });
        expect(applyCount).toBe(2);
        expect(updateCount).toBe(1);
        expect(saveCount).toBe(1);
    });

    it("applyTimelineRatioToSlot updates UTC time through non-fixed path", () => {
        const module = loadTimelineFrameModule();
        let savedDate = new Date(Date.UTC(2026, 2, 24, 0, 0, 0));
        let updateCount = 0;
        let saveCount = 0;
        const service = module.createService({
            getIsRealtime: () => false,
            isFixedTimeTab: () => false,
            getGlobalTime: () => savedDate,
            setGlobalTime: (_slotIdx, nextDate) => {
                savedDate = new Date(nextDate);
            },
            getFixedOffsetForDisplayAtDate: () => 0,
            getLocalPartsByTimezone: () => ({
                year: 2026,
                month: 3,
                day: 24,
                hour: 0,
                minute: 0,
                second: 0
            }),
            getUTCDateFromLocalParts: (parts) => new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second)),
            updateClocks: () => {
                updateCount += 1;
            },
            savePersistence: () => {
                saveCount += 1;
            }
        });

        service.applyTimelineRatioToSlot(0, 0.5, { id: "utc", zone: "UTC" });

        expect(savedDate.getUTCHours()).toBe(12);
        expect(savedDate.getUTCMinutes()).toBe(0);
        expect(updateCount).toBe(1);
        expect(saveCount).toBe(0);
    });

    it("getTimelinePanelCount follows realtime and fixed-time branches", () => {
        const module = loadTimelineFrameModule();

        const nonRealtimeDual = module.createService({
            isFixedTimeTab: () => false,
            getIsRealtime: () => false,
            getSlotCount: () => 2
        });
        expect(nonRealtimeDual.getTimelinePanelCount()).toBe(2);

        const realtimeSingle = module.createService({
            isFixedTimeTab: () => false,
            getIsRealtime: () => true,
            getSlotCount: () => 2
        });
        expect(realtimeSingle.getTimelinePanelCount()).toBe(1);

        const fixedTimeSingle = module.createService({
            isFixedTimeTab: () => true,
            getIsRealtime: () => false,
            getSlotCount: () => 2
        });
        expect(fixedTimeSingle.getTimelinePanelCount()).toBe(1);
    });

    it("getTimelineIndicatorLabel uses range labels on fixed tab with two slots", () => {
        const module = loadTimelineFrameModule();
        const fixedService = module.createService({
            t: (key) => key,
            getCurrentMainTab: () => "fixed",
            getIsRealtime: () => false,
            getSlotCount: () => 2
        });
        expect(fixedService.getTimelineIndicatorLabel(0)).toBe("th_time_day_start");
        expect(fixedService.getTimelineIndicatorLabel(1)).toBe("th_time_day_end");

        const liveService = module.createService({
            t: (key) => key,
            getCurrentMainTab: () => "live",
            getIsRealtime: () => false,
            getSlotCount: () => 2
        });
        expect(liveService.getTimelineIndicatorLabel(0)).toBe("th_time_day_main");
    });

    it("renderTimelineFrame hides and clears frame when timeline should not render", () => {
        const frame = {
            style: {},
            textContent: "stale",
            removed: [],
            removeAttribute(name) {
                this.removed.push(name);
            },
            classList: {
                add() { },
                remove() { }
            }
        };
        const module = loadTimelineFrameModule();
        const service = module.createService({
            getTimelineFrameElement: () => frame,
            getShowTimeline: () => false
        });

        service.renderTimelineFrame();

        expect(frame.style.display).toBe("none");
        expect(frame.textContent).toBe("");
        expect(frame.removed).toContain("data-render-key");
    });
});
