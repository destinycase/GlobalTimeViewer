import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "image-export-naming.js");

function loadImageExportNamingModule(options = {}) {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = {
        window: {},
        globalThis: {},
        console: options.console || console
    };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/image-export-naming.js" });
    return sandbox.window.GTVImageExportNaming || sandbox.GTVImageExportNaming || sandbox.globalThis.GTVImageExportNaming;
}

describe("GTV image export naming module", () => {
    it("sanitizes filename parts by removing reserved characters and collapsing spaces", () => {
        const module = loadImageExportNamingModule();
        const service = module.createService({});

        expect(service.sanitizeFilenamePart("  Team:/Core*  Alpha  ")).toBe("TeamCore Alpha");
        expect(service.sanitizeFilenamePart("")).toBe("");
    });

    it("formats custom timezone date-time with provided offset minutes", () => {
        const module = loadImageExportNamingModule();
        const service = module.createService({
            getCustomOffsetMinutes: () => 540
        });

        const text = service.formatDateTimeByTimezone(new Date(Date.UTC(2026, 2, 13, 0, 52, 21)), { type: "custom" });
        expect(text).toBe("2026-03-13 09:52:21");
    });

    it("builds timezone table image filename from group/base info", () => {
        const module = loadImageExportNamingModule();
        const service = module.createService({
            t: () => "Default Group",
            getBaseTimezoneRef: () => ({ type: "standard", zone: "UTC", id: "utc" }),
            getBaseTime: () => new Date(Date.UTC(2026, 2, 13, 0, 52, 21)),
            getActiveGroupName: () => "Main / Team",
            getZoneAbbreviation: () => "UTC+0",
            timeService: {
                resolveLocalDateParts: () => ({
                    Y: 2026,
                    M: 3,
                    D: 13,
                    H: 0,
                    min: 52,
                    S: 21
                })
            }
        });

        expect(service.getTimezoneTableImageFilename()).toBe("Main Team_UTC+0_2026-03-13 005221");
    });

    it("builds multi-range and titles filenames with subgroup labels", () => {
        const module = loadImageExportNamingModule();
        const service = module.createService({
            t: () => "Default Group",
            getBaseTimezoneRef: () => ({ type: "standard", zone: "UTC", id: "utc" }),
            getBaseTime: () => new Date(Date.UTC(2026, 2, 13, 10, 0, 0)),
            getActiveGroupName: () => "Main",
            getZoneAbbreviation: () => "UTC",
            getCurrentMultiSubgroupName: () => "Sprint/One",
            sanitizeMultiSubgroupName: () => "Sprint/One",
            timeService: {
                resolveLocalDateParts: () => ({
                    Y: 2026,
                    M: 3,
                    D: 13,
                    H: 10,
                    min: 0,
                    S: 0
                })
            }
        });

        expect(service.getMultiRangeTableImageFilename(1)).toBe("Main_UTC_2026-03-13 100000_SprintOne 2.png");
        expect(service.getMultiRangeTitlesImageFilename()).toBe("Main_UTC_2026-03-13 100000_SprintOne_titles.png");
    });
});
