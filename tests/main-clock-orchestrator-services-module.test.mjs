import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-clock-orchestrator-services.js");

function loadMainClockOrchestratorServicesModule() {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = { window: {}, globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/main-clock-orchestrator-services.js" });
    return sandbox.window.GTVMainClockOrchestratorServices
        || sandbox.GTVMainClockOrchestratorServices
        || sandbox.globalThis.GTVMainClockOrchestratorServices;
}

describe("GTV main clock orchestrator services module", () => {
    it("renders fixed-time tab path with timeline only", () => {
        const moduleApi = loadMainClockOrchestratorServicesModule();
        let fixedRenderCount = 0;
        let timelineRenderCount = 0;
        let multiRenderCount = 0;
        const service = moduleApi.createService({
            isFixedTimeTab: () => true,
            renderFixedTimeTab: () => { fixedRenderCount += 1; },
            renderTimelineFrame: () => { timelineRenderCount += 1; },
            isMultiTab: () => false,
            renderMultiRanges: () => { multiRenderCount += 1; }
        });

        service.updateClocks();

        expect(fixedRenderCount).toBe(1);
        expect(timelineRenderCount).toBe(1);
        expect(multiRenderCount).toBe(0);
    });

    it("updates base/utc/rows and copy preview in live mode", () => {
        const moduleApi = loadMainClockOrchestratorServicesModule();
        const updatedIds = [];
        let previewCount = 0;
        let timelineCount = 0;
        const service = moduleApi.createService({
            isFixedTimeTab: () => false,
            isMultiTab: () => false,
            getBaseTimezoneRef: () => ({ id: "tz-base" }),
            getUTCRef: () => ({ id: "utc" }),
            updateRow: (id) => { updatedIds.push(id); },
            getCurrentGroupZones: () => ([
                { id: "tz-base" },
                { id: "tz-a" },
                { id: "tz-b" }
            ]),
            isShowCopyFormat: () => true,
            updateCopyFormatPreview: () => { previewCount += 1; },
            renderTimelineFrame: () => { timelineCount += 1; }
        });

        service.updateClocks();

        expect(updatedIds).toEqual(["tz-base", "utc", "tz-a", "tz-b"]);
        expect(previewCount).toBe(1);
        expect(timelineCount).toBe(1);
    });
});
