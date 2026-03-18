import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-image-export-naming-proxy.js");

function loadMainImageExportNamingProxyModule() {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = { window: {}, globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/main-image-export-naming-proxy.js" });
    return sandbox.window.GTVMainImageExportNamingProxy
        || sandbox.GTVMainImageExportNamingProxy
        || sandbox.globalThis.GTVMainImageExportNamingProxy;
}

describe("GTV main image export naming proxy module", () => {
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
