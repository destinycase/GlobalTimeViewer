import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-base-timezone-services.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainBaseTimezoneServicesModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainBaseTimezoneServices", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainBaseTimezoneServices || globalThis.GTVMainBaseTimezoneServices;
}

describe("GTV main base timezone services module", () => {
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

    it("returns false when group is unavailable", () => {
        const moduleApi = loadMainBaseTimezoneServicesModule();
        const service = moduleApi.createService({
            getCurrentGroup: () => null
        });

        expect(service.setCurrentGroupBaseTimezoneId("tz-any")).toBe(false);
    });

    it("uses built-in sanitizer fallback and handles non-object options", () => {
        const moduleApi = loadMainBaseTimezoneServicesModule();
        const group = { baseTimezoneId: "tz-old", showUtcRow: false, utcRowOrder: 3 };
        const service = moduleApi.createService({
            getCurrentGroup: () => group
        });

        expect(service.setCurrentGroupBaseTimezoneId(" TZ-NEW ")).toBe(true);
        expect(group.baseTimezoneId).toBe("tz-new");

        service.applyCurrentGroupBaseTimezoneId("", null);
        expect(group.baseTimezoneId).toBe("utc");
        expect(group.showUtcRow).toBe(true);
        expect(group.utcRowOrder).toBe(0);
    });

    it("uses default getCurrentGroup fallback when no deps are provided", () => {
        const moduleApi = loadMainBaseTimezoneServicesModule();
        const service = moduleApi.createService();
        expect(service.setCurrentGroupBaseTimezoneId("tz-any")).toBe(false);
    });
});
