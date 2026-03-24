import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-timezone-runtime-services.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainTimezoneRuntimeServicesModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainTimezoneRuntimeServices", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainTimezoneRuntimeServices || globalThis.GTVMainTimezoneRuntimeServices;
}

describe("GTV main timezone runtime services DST ui label", () => {
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
    it("appends [DST] for dynamic IANA standard zone during daylight period", () => {
        const moduleApi = loadMainTimezoneRuntimeServicesModule();
        let offsetCallCount = 0;
        const service = moduleApi.createService({
            getCurrentLang: () => "en",
            getTzDatabase: () => ([{
                zone: "America/New_York",
                name: "USA",
                city: "New York",
                name_en: "USA",
                city_en: "New York"
            }]),
            getTimeService: () => ({
                toDateTime: () => ({
                    setZone: () => {
                        offsetCallCount += 1;
                        const phase = offsetCallCount % 3;
                        const inDst = phase === 0 || phase === 2;
                        return {
                            offset: inDst ? -240 : -300,
                            offsetNameShort: inDst ? "EDT" : "EST"
                        };
                    }
                })
            }),
            t: (key) => key
        });

        const tz = { type: "standard", zone: "America/New_York" };
        expect(service.getZoneDisplayNameForUiAtDate(tz)).toBe("USA - New York [DST]");
    });

    it("does not append [DST] for fixed/custom/utc zones", () => {
        const moduleApi = loadMainTimezoneRuntimeServicesModule();
        let offsetCallCount = 0;
        const service = moduleApi.createService({
            getCurrentLang: () => "en",
            getTzDatabase: () => ([{
                zone: "America/New_York",
                name: "USA",
                city: "New York",
                name_en: "USA",
                city_en: "New York"
            }]),
            getTimeService: () => ({
                toDateTime: () => ({
                    setZone: () => {
                        offsetCallCount += 1;
                        const phase = offsetCallCount % 3;
                        const inDst = phase === 2;
                        return { offset: inDst ? -240 : -300, offsetNameShort: inDst ? "EDT" : "EST" };
                    }
                })
            }),
            t: (key) => key
        });

        const anchor = null;
        expect(service.getZoneDisplayNameForUiAtDate({
            type: "standard",
            zone: "America/New_York",
            fixedOffsetMinutes: -300
        }, anchor)).toBe("USA - New York");

        expect(service.getZoneDisplayNameForUiAtDate({
            type: "standard",
            zone: "America/New_York"
        }, anchor)).toBe("USA - New York");

        expect(service.getZoneDisplayNameForUiAtDate({
            type: "custom",
            zone: "CUSTOM",
            name_en: "My Custom"
        }, anchor)).toBe("My Custom");

        expect(service.getZoneDisplayNameForUiAtDate({
            type: "standard",
            zone: "UTC"
        }, anchor)).toBe("utc_name");
    });
});
