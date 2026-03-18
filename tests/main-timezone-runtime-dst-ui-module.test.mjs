import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-timezone-runtime-services.js");

function loadMainTimezoneRuntimeServicesModule() {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = { window: {}, globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/main-timezone-runtime-services.js" });
    return sandbox.window.GTVMainTimezoneRuntimeServices
        || sandbox.GTVMainTimezoneRuntimeServices
        || sandbox.globalThis.GTVMainTimezoneRuntimeServices;
}

describe("GTV main timezone runtime services DST ui label", () => {
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
