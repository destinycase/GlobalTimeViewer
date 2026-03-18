import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-base-timezone-services.js");

function loadMainBaseTimezoneServicesModule() {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = { window: {}, globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/main-base-timezone-services.js" });
    return sandbox.window.GTVMainBaseTimezoneServices
        || sandbox.GTVMainBaseTimezoneServices
        || sandbox.globalThis.GTVMainBaseTimezoneServices;
}

describe("GTV main base timezone services module", () => {
    it("sets current group base timezone id", () => {
        const moduleApi = loadMainBaseTimezoneServicesModule();
        const group = { baseTimezoneId: "utc" };
        const service = moduleApi.createService({
            getCurrentGroup: () => group,
            sanitizeBaseTimezoneId: (value) => String(value || "").trim().toLowerCase()
        });

        const updated = service.setCurrentGroupBaseTimezoneId("TZ-BASE");
        expect(updated).toBe(true);
        expect(group.baseTimezoneId).toBe("tz-base");
    });

    it("applies base timezone with rerender and optional persistence", () => {
        const moduleApi = loadMainBaseTimezoneServicesModule();
        const group = { baseTimezoneId: "tz-1", showUtcRow: false, utcRowOrder: 9 };
        let listCount = 0;
        let timelineCount = 0;
        let panelCount = 0;
        let saveCount = 0;
        const service = moduleApi.createService({
            getCurrentGroup: () => group,
            sanitizeBaseTimezoneId: (value) => String(value || "").trim().toLowerCase() || "utc",
            renderList: () => { listCount += 1; },
            renderTimelineFrame: () => { timelineCount += 1; },
            updateTimeAdjustPanel: () => { panelCount += 1; },
            savePersistence: () => { saveCount += 1; }
        });

        service.applyCurrentGroupBaseTimezoneId("UTC", { persist: true });
        expect(group.baseTimezoneId).toBe("utc");
        expect(group.showUtcRow).toBe(true);
        expect(group.utcRowOrder).toBe(0);
        expect(listCount).toBe(1);
        expect(timelineCount).toBe(1);
        expect(panelCount).toBe(1);
        expect(saveCount).toBe(1);

        service.applyCurrentGroupBaseTimezoneId("tz-seoul", { persist: false });
        expect(group.baseTimezoneId).toBe("tz-seoul");
        expect(saveCount).toBe(1);
        expect(listCount).toBe(2);
        expect(timelineCount).toBe(2);
        expect(panelCount).toBe(2);
    });
});
