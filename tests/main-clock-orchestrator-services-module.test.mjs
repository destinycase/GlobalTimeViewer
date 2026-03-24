import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-clock-orchestrator-services.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainClockOrchestratorServicesModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainClockOrchestratorServices", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainClockOrchestratorServices || globalThis.GTVMainClockOrchestratorServices;
}

describe("GTV main clock orchestrator services module", () => {
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
