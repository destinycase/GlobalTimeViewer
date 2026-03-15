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
});

