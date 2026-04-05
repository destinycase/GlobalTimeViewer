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

describe("GTV main timezone runtime services module", () => {
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
                name: "\uB300\uD55C\uBBFC\uAD6D",
                city: "\uC11C\uC6B8",
                name_en: "South Korea",
                city_en: "Seoul"
            }]),
            resolveLocalizedTZLabel: () => "\uC678\uBD80 \uB77C\uBCA8"
        });

        expect(service.getZoneDisplayName({
            type: "standard",
            zone: "Asia/Seoul",
            name: "Korea Standard Time"
        })).toBe("\uC678\uBD80 \uB77C\uBCA8");

        expect(service.getZoneDisplayName({
            type: "standard",
            zone: "Asia/Seoul",
            fixedOffsetMinutes: 540,
            name_ko: "\uD55C\uAD6D \uD45C\uC900\uC2DC"
        })).toBe("UTC+09:00 \uD45C\uC900\uC2DC");
    });

    it("falls back to Intl offset resolution when time service is unavailable", () => {
        const moduleApi = loadMainTimezoneRuntimeServicesModule();
        const service = moduleApi.createService({
            getTimeService: () => null
        });

        expect(service.getTimezoneOffset("UTC", new Date(Date.UTC(2026, 2, 17, 0, 0, 0)))).toBe(0);
        expect(Number.isNaN(service.getTimezoneOffset("Invalid/Zone_Name", new Date(Date.UTC(2026, 2, 17, 0, 0, 0))))).toBe(true);
    });

    it("does not treat boolean fixedOffsetMinutes as a real fixed offset", () => {
        const moduleApi = loadMainTimezoneRuntimeServicesModule();
        const service = moduleApi.createService({
            getCurrentLang: () => "en",
            formatUtcOffsetLabel: (value) => `UTC${value}`,
            t: (key) => key
        });

        expect(service.getFixedOffsetForDisplayAtDate({
            type: "standard",
            zone: "Asia/Seoul",
            fixedOffsetMinutes: false
        }, new Date())).toBe(null);
    });
});
