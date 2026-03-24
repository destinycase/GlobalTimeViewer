import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-image-export-naming-proxy.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainImageExportNamingProxyModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainImageExportNamingProxy", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainImageExportNamingProxy || globalThis.GTVMainImageExportNamingProxy;
}

describe("GTV main image export naming proxy module", () => {
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
    it("delegates to naming service when available", () => {
        const moduleApi = loadMainImageExportNamingProxyModule();
        const proxy = moduleApi.createService({
            getImageExportNamingService: () => ({
                sanitizeFilenamePart: (value) => `s:${value}`,
                formatDateTimeByTimezone: () => "dt",
                getTimezoneTableImageFilename: () => "table-name",
                getMultiRangeTableImageFilename: (idx) => `range-${idx}`,
                getMultiRangeTitlesImageFilename: () => "titles-name"
            })
        });

        expect(proxy.sanitizeFilenamePart("a b")).toBe("s:a b");
        expect(proxy.formatDateTimeByTimezone(new Date(), { zone: "UTC" })).toBe("dt");
        expect(proxy.getTimezoneTableImageFilename()).toBe("table-name");
        expect(proxy.getMultiRangeTableImageFilename(2)).toBe("range-2");
        expect(proxy.getMultiRangeTitlesImageFilename()).toBe("titles-name");
    });

    it("uses fallback naming rules when naming service is absent", () => {
        const moduleApi = loadMainImageExportNamingProxyModule();
        const now = new Date(Date.UTC(2026, 2, 17, 12, 34, 56));
        const proxy = moduleApi.createService({
            getImageExportNamingService: () => null,
            getCustomOffsetMinutes: () => 0,
            pad: (value) => String(value).padStart(2, "0"),
            timeService: {
                resolveLocalDateParts: () => ({
                    Y: 2026, M: 3, D: 17, H: 12, min: 34, S: 56
                })
            },
            getBaseTimezoneRef: () => ({ zone: "UTC" }),
            getGroups: () => [{ name: "My Group" }],
            getActiveGroupId: () => 0,
            t: (key) => key,
            getZoneAbbreviation: () => "UTC",
            getBaseTime: () => now,
            sanitizeMultiSubgroupName: (value) => value || "subgroup",
            getCurrentMultiSubgroupName: () => "Subgroup 1"
        });

        expect(proxy.sanitizeFilenamePart("a/b:c")).toBe("abc");
        expect(proxy.formatDateTimeByTimezone(now, { zone: "UTC" })).toBe("2026-03-17 12:34:56");
        expect(proxy.getTimezoneTableImageFilename()).toContain("My Group_UTC_2026-03-17 123456");
        expect(proxy.getMultiRangeTableImageFilename(1)).toContain("_Subgroup 1 2.png");
        expect(proxy.getMultiRangeTitlesImageFilename()).toContain("_Subgroup 1_titles.png");
    });
});
