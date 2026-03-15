import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "fixed-time-timeline.js");

function loadFixedTimeTimelineModule(options = {}) {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = {
        window: {},
        globalThis: {},
        Date,
        console: options.console || console
    };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/fixed-time-timeline.js" });
    return sandbox.window.GTVFixedTimeTimeline || sandbox.GTVFixedTimeTimeline || sandbox.globalThis.GTVFixedTimeTimeline;
}

describe("GTV fixed time timeline module", () => {
    it("applies ratio to fixed-time slot with clamping", () => {
        const module = loadFixedTimeTimelineModule();
        const group = { fixedTimes: [{ id: "ft-1", name: "Slot", time: "00:00" }] };
        const service = module.createService({
            TIMELINE_TOTAL_SECONDS: 24 * 60 * 60,
            getCurrentGroup: () => group,
            ensureGroupFixedTimes: () => { },
            clampNumber: (value, min, max) => Math.max(min, Math.min(max, Number(value))),
            pad: (value) => String(value).padStart(2, "0")
        });

        const changed = service.applyFixedTimeSlotTimelineRatio(0, 0.5);

        expect(changed).toBe(true);
        expect(group.fixedTimes[0].time).toBe("12:00");

        service.applyFixedTimeSlotTimelineRatio(0, 1.2);
        expect(group.fixedTimes[0].time).toBe("23:59");
    });

    it("resolves fixed-time source date for timeline", () => {
        const module = loadFixedTimeTimelineModule();
        const group = { fixedTimes: [{ id: "ft-1", name: "Slot", time: "09:00" }] };
        const expected = new Date("2026-03-07T09:00:00.000Z");
        const service = module.createService({
            getCurrentGroup: () => group,
            ensureGroupFixedTimes: () => { },
            getGlobalTime: () => new Date("2026-03-07T00:00:00.000Z"),
            resolveFixedTimeSlotUtcDate: () => expected
        });

        const resolved = service.resolveFixedTimeTimelineSourceDate(0, { zone: "UTC" });
        expect(resolved.toISOString()).toBe(expected.toISOString());
    });

    it("returns timeline slot list/count from current group", () => {
        const module = loadFixedTimeTimelineModule();
        const group = {
            fixedTimes: [
                { id: "ft-1", name: "A", time: "09:00" },
                { id: "ft-2", name: "B", time: "12:00" }
            ]
        };
        const service = module.createService({
            getCurrentGroup: () => group,
            ensureGroupFixedTimes: () => { },
            getFixedTimeSlotCount: () => 2
        });

        expect(service.getFixedTimeTimelineSlots()).toHaveLength(2);
        expect(service.getFixedTimeTimelineSlotCount()).toBe(2);
    });

    it("builds indicator token and delegates slot label", () => {
        const module = loadFixedTimeTimelineModule();
        const group = {
            fixedTimes: [
                { id: "ft-1", name: "A", time: "09:00" },
                { id: "ft-2", name: "B", time: "12:00" }
            ]
        };
        const service = module.createService({
            getCurrentGroup: () => group,
            ensureGroupFixedTimes: () => { },
            getDefaultFixedTimeName: () => "Fixed Time",
            sanitizeFixedTimeId: (value) => String(value || ""),
            sanitizeFixedTimeName: (value, fallback) => (String(value || "").trim() || fallback),
            getFixedTimeSlotHeaderLabel: (slot, slotIdx) => `${slot.name}-${slotIdx + 1}`
        });

        expect(service.getFixedTimeTimelineIndicatorToken()).toBe("0:ft-1:A|1:ft-2:B");
        expect(service.getFixedTimeSlotTimelineLabel({ name: "A" }, 0, 2)).toBe("A-1");
    });
});

