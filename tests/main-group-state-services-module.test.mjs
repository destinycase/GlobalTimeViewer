import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-group-state-services.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainGroupStateServicesModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainGroupStateServices", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainGroupStateServices || globalThis.GTVMainGroupStateServices;
}

describe("GTV main group state services module", () => {
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
