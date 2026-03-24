import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-timezone-mutation-services.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainTimezoneMutationServicesModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainTimezoneMutationServices", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainTimezoneMutationServices || globalThis.GTVMainTimezoneMutationServices;
}

describe("GTV main timezone mutation services module", () => {
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
    it("creates unique timezone ids and collects used ids", () => {
        const moduleApi = loadMainTimezoneMutationServicesModule();
        const groups = [{ zones: [{ id: "tz-1" }, { id: "tz-2" }] }];
        let seed = 0;
        const service = moduleApi.createService({
            getGroups: () => groups,
            sanitizeTimezoneId: (value) => String(value || "").trim(),
            getNextTimezoneIdSeed: () => {
                seed += 1;
                return seed;
            },
            getNow: () => 100,
            getRandomUUID: () => "",
            getRandom: () => 0.5
        });

        const usedIds = service.getUsedTimezoneIds();
        const generated = service.createUniqueTimezoneId("tz");

        expect(usedIds.has("utc")).toBe(true);
        expect(usedIds.has("tz-1")).toBe(true);
        expect(generated).toBe("tz-100-1");
    });

    it("prefers UUID-based timezone id and falls back when UUID id is already used", () => {
        const moduleApi = loadMainTimezoneMutationServicesModule();
        const groups = [{ zones: [{ id: "tz-dupe" }] }];
        let seed = 10;
        const service = moduleApi.createService({
            getGroups: () => groups,
            sanitizeTimezoneId: (value) => String(value || "").trim(),
            getRandomUUID: () => "dupe",
            getNextTimezoneIdSeed: () => {
                seed += 1;
                return seed;
            },
            getNow: () => 400,
            getRandom: () => 0.123
        });

        const generated = service.createUniqueTimezoneId("tz");

        expect(generated).toBe("tz-400-11");
    });

    it("adds and removes timezones with persistence and rerender", () => {
        const moduleApi = loadMainTimezoneMutationServicesModule();
        const group = {
            zones: [{ id: "tz-a", type: "custom" }],
            baseTimezoneId: "utc",
            showUtcRow: true,
            utcRowOrder: 0
        };
        let saveCount = 0;
        let listCount = 0;
        let timelineCount = 0;
        const service = moduleApi.createService({
            getGroups: () => [group],
            getCurrentGroup: () => group,
            getCurrentGroupBaseTimezoneId: () => group.baseTimezoneId,
            sanitizeTimezoneId: (value) => String(value || "").trim(),
            getNextTimezoneIdSeed: () => 7,
            getNow: () => 200,
            getRandomUUID: () => "",
            getGroupStateService: () => ({
                isValidTimeZone: () => true
            }),
            savePersistence: () => { saveCount += 1; },
            renderList: () => { listCount += 1; },
            renderTimelineFrame: () => { timelineCount += 1; },
            showToast: () => { },
            t: (key) => key
        });

        service.addTimezone({ id: "", type: "standard", zone: "Asia/Seoul", name: "KST" });
        expect(group.zones).toHaveLength(2);
        expect(group.zones[1].id).toBe("tz-200-7");

        service.removeTimezone("tz-a");
        expect(group.zones.find((zone) => zone.id === "tz-a")).toBeUndefined();

        group.baseTimezoneId = "tz-base";
        service.removeTimezone("utc");
        expect(group.showUtcRow).toBe(false);
        expect(group.utcRowOrder).toBe(0);
        expect(saveCount).toBe(3);
        expect(listCount).toBe(3);
        expect(timelineCount).toBe(3);
    });

    it("blocks duplicate custom timezone abbreviations within the active group", () => {
        const moduleApi = loadMainTimezoneMutationServicesModule();
        const group = {
            zones: [{ id: "tz-c-1", type: "custom", abbr: "KTX", name: "A", offH: 9, offM: 0 }],
            baseTimezoneId: "utc",
            showUtcRow: true,
            utcRowOrder: 0
        };
        const toasts = [];
        let saveCount = 0;
        let listCount = 0;
        let timelineCount = 0;
        const service = moduleApi.createService({
            getGroups: () => [group],
            getCurrentGroup: () => group,
            getCurrentGroupBaseTimezoneId: () => group.baseTimezoneId,
            sanitizeTimezoneId: (value) => String(value || "").trim(),
            normalizeCustomAbbr: (value) => String(value || "").trim().toUpperCase(),
            getNextTimezoneIdSeed: () => 1,
            getNow: () => 300,
            getRandomUUID: () => "",
            getGroupStateService: () => ({
                isValidTimeZone: () => true
            }),
            savePersistence: () => { saveCount += 1; },
            renderList: () => { listCount += 1; },
            renderTimelineFrame: () => { timelineCount += 1; },
            showToast: (message) => { toasts.push(message); },
            t: (key) => key
        });

        const added = service.addTimezone({ id: "", type: "custom", abbr: "ktx", name: "B", offH: 9, offM: 0 });

        expect(added).toBe(false);
        expect(group.zones).toHaveLength(1);
        expect(saveCount).toBe(0);
        expect(listCount).toBe(0);
        expect(timelineCount).toBe(0);
        expect(toasts).toEqual(["toast_custom_timezone_duplicate"]);
    });

    it("blocks duplicate standard timezone zones within the active group", () => {
        const moduleApi = loadMainTimezoneMutationServicesModule();
        const group = {
            zones: [{ id: "tz-s-1", type: "standard", zone: "America/New_York", name_en: "USA - New York" }],
            baseTimezoneId: "utc",
            showUtcRow: true,
            utcRowOrder: 0
        };
        const toasts = [];
        let saveCount = 0;
        let listCount = 0;
        let timelineCount = 0;
        const service = moduleApi.createService({
            getGroups: () => [group],
            getCurrentGroup: () => group,
            getCurrentGroupBaseTimezoneId: () => group.baseTimezoneId,
            sanitizeTimezoneId: (value) => String(value || "").trim(),
            getNextTimezoneIdSeed: () => 2,
            getNow: () => 301,
            getRandomUUID: () => "",
            getGroupStateService: () => ({
                isValidTimeZone: () => true
            }),
            savePersistence: () => { saveCount += 1; },
            renderList: () => { listCount += 1; },
            renderTimelineFrame: () => { timelineCount += 1; },
            showToast: (message) => { toasts.push(message); },
            t: (key) => key
        });

        const added = service.addTimezone({
            id: "",
            type: "standard",
            zone: "America/New_York",
            name_en: "USA - New York"
        });

        expect(added).toBe(false);
        expect(group.zones).toHaveLength(1);
        expect(saveCount).toBe(0);
        expect(listCount).toBe(0);
        expect(timelineCount).toBe(0);
        expect(toasts).toEqual(["toast_timezone_duplicate"]);
    });
});
