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

describe("GTV main timezone runtime services module", () => {
    it("resolves abbreviations using fixed mapping and custom fallback", () => {
        const moduleApi = loadMainTimezoneRuntimeServicesModule();
        const service = moduleApi.createService({
            getBaseTime: () => new Date(Date.UTC(2026, 2, 17, 0, 0, 0)),
            getZoneMap: () => ({ "Asia/Seoul": "KST" }),
            getTimeService: () => ({
                toDateTime: () => ({
                    setZone: () => ({ offsetNameShort: "GMT+9", offset: 540 })
                })
            }),
            normalizeCustomAbbr: (value) => String(value || "").trim().toUpperCase(),
            getTimezoneSearchService: () => ({
                normalizeZoneAbbreviation: () => ""
            })
        });

        expect(service.getZoneAbbreviation({ type: "standard", zone: "Asia/Seoul" })).toBe("KST");
        expect(service.getZoneAbbreviation({ type: "custom", zone: "CUSTOM", abbr: "  cst " })).toBe("CST");
        expect(service.getTimezoneOffset("Asia/Seoul", new Date(Date.UTC(2026, 2, 17, 0, 0, 0)))).toBe(540);
    });

    it("builds localized display names with external localized-label resolver", () => {
        const moduleApi = loadMainTimezoneRuntimeServicesModule();
        const service = moduleApi.createService({
            getCurrentLang: () => "ko",
            t: (key) => key,
            formatUtcOffsetLabel: () => "UTC+09:00",
            getTzDatabase: () => ([{
                zone: "Asia/Seoul",
                name: "대한민국",
                city: "서울",
                name_en: "South Korea",
                city_en: "Seoul"
            }]),
            resolveLocalizedTZLabel: () => "외부 라벨"
        });

        expect(service.getZoneDisplayName({
            type: "standard",
            zone: "Asia/Seoul",
            name: "Korea Standard Time"
        })).toBe("외부 라벨");

        expect(service.getZoneDisplayName({
            type: "standard",
            zone: "Asia/Seoul",
            fixedOffsetMinutes: 540,
            name_ko: "한국 표준시"
        })).toBe("UTC+09:00 표준시");
    });
});
