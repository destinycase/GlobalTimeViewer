import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-group-state-services.js");

function loadMainGroupStateServicesModule() {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = { window: {}, globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/main-group-state-services.js" });
    return sandbox.window.GTVMainGroupStateServices || sandbox.GTVMainGroupStateServices || sandbox.globalThis.GTVMainGroupStateServices;
}

describe("GTV main group state services module", () => {
    it("creates multi/group state services with multi-state-derived callbacks", () => {
        const moduleApi = loadMainGroupStateServicesModule();
        let multiStateConfig = null;
        let groupStateConfig = null;
        let subgroupIdInput = null;
        let ensureGroupInput = null;

        const multiStateServiceStub = {
            sanitizeMultiSubgroupId: (value) => {
                subgroupIdInput = value;
                return `sub-${value}`;
            },
            ensureGroupMultiSubgroups: (group) => {
                ensureGroupInput = group;
                return group;
            }
        };

        const services = moduleApi.createService({
            GTV_MULTI_STATE: {
                createService: (cfg) => {
                    multiStateConfig = cfg;
                    return multiStateServiceStub;
                }
            },
            serviceBootstrap: {
                createGroupStateService: (cfg) => {
                    groupStateConfig = cfg;
                    return { id: "group-state" };
                }
            },
            MIN_MULTI_RANGE_COUNT: 1,
            t: (key) => key,
            getGroups: () => [],
            getDefaultMultiRangeBounds: () => ({}),
            sanitizeMultiRangeCount: (value) => value,
            sanitizeMultiRangeItem: (value) => value,
            sanitizeUtcMs: (value) => value,
            sanitizeTimezoneId: (value) => value,
            createUniqueTimezoneId: () => "tz-1",
            normalizeCustomAbbr: (value) => value,
            normalizeZoneAbbreviation: (value) => value,
            sanitizeBaseTimezoneId: (value) => value,
            sanitizeUtcRowOrder: (value) => value,
            sanitizeFixedTimes: (value) => value,
            sanitizeFixedDateValue: (value) => value
        });

        expect(services.multiStateService).toBe(multiStateServiceStub);
        expect(services.groupStateService.id).toBe("group-state");
        expect(multiStateConfig.MIN_MULTI_RANGE_COUNT).toBe(1);

        expect(groupStateConfig.sanitizeMultiSubgroupId("a")).toBe("sub-a");
        expect(subgroupIdInput).toBe("a");
        const group = { id: 1 };
        groupStateConfig.ensureGroupMultiSubgroups(group, {});
        expect(ensureGroupInput).toBe(group);
    });

    it("throws when required module APIs are missing", () => {
        const moduleApi = loadMainGroupStateServicesModule();
        expect(() => moduleApi.createService({})).toThrow("Missing required module API: GTVMultiState.createService");
    });
});
