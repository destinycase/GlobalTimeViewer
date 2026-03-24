import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-group-tabs-service.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainGroupTabsServiceModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainGroupTabsService", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainGroupTabsService || globalThis.GTVMainGroupTabsService;
}

describe("GTV main group tabs service module", () => {
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
    it("creates groupTabs service and wires proxy callbacks", () => {
        const moduleApi = loadMainGroupTabsServiceModule();
        let config = null;
        let renderGroupsCalled = 0;
        let renderMultiSubgroupsCalled = 0;
        const transferCalls = [];

        const groupTabsService = {
            renderGroups: () => {
                renderGroupsCalled += 1;
            },
            renderMultiSubgroups: () => {
                renderMultiSubgroupsCalled += 1;
            }
        };

        const result = moduleApi.createService({
            GTV_GROUP_TABS: {
                createService: (cfg) => {
                    config = cfg;
                    return groupTabsService;
                }
            },
            t: (key) => key,
            showToast: () => {},
            confirmFn: () => false,
            getState: () => ({}),
            setState: () => {},
            isMultiTab: () => false,
            getCurrentGroup: () => null,
            isFixedTimeTab: () => false,
            ensureGroupMultiSubgroups: () => {},
            normalizeGroupTabState: () => {},
            syncCurrentMultiStateToActiveSubgroup: () => {},
            loadCurrentMultiStateFromActiveSubgroup: () => {},
            getPersistenceService: () => ({ savePersistence: () => {} }),
            renderBaseTimeSelect: () => {},
            renderMultiRanges: () => {},
            renderFixedTimeTab: () => {},
            renderList: () => {},
            renderTimelineFrame: () => {},
            setCustomTooltip: () => {},
            hideFloatingTooltip: () => {},
            upgradeNativeTitleTooltips: () => {},
            getDefaultMultiSubgroupName: () => "Subgroup 1",
            getDefaultFixedTimes: () => [],
            getDefaultFixedDate: () => "",
            createMultiSubgroupState: () => ({}),
            sanitizeMultiSubgroupName: (value) => value,
            sanitizeMultiRangeTitle: (value) => value,
            getDataTransferService: () => ({
                exportGroupToJSON: (groupIdx) => transferCalls.push(["exportGroupToJSON", groupIdx]),
                triggerGroupImportFor: (groupIdx) => transferCalls.push(["triggerGroupImportFor", groupIdx]),
                exportSubgroupToJSON: (groupIdx, subgroupId) => transferCalls.push(["exportSubgroupToJSON", groupIdx, subgroupId]),
                triggerSubgroupImportFor: (groupIdx, subgroupId) => transferCalls.push(["triggerSubgroupImportFor", groupIdx, subgroupId])
            }),
            getActiveGroupId: () => 3
        });

        expect(result.groupTabsService).toBe(groupTabsService);
        expect(config.confirmFn()).toBe(false);

        config.renderGroups();
        config.renderMultiSubgroups();
        expect(renderGroupsCalled).toBe(1);
        expect(renderMultiSubgroupsCalled).toBe(1);

        config.exportGroupToJSON();
        config.triggerGroupImportFor();
        config.exportSubgroupToJSON(4, "sub-2");
        config.triggerSubgroupImportFor(5, "sub-3");
        expect(transferCalls).toEqual([
            ["exportGroupToJSON", 3],
            ["triggerGroupImportFor", 3],
            ["exportSubgroupToJSON", 4, "sub-2"],
            ["triggerSubgroupImportFor", 5, "sub-3"]
        ]);
    });

    it("throws when required module api is missing", () => {
        const moduleApi = loadMainGroupTabsServiceModule();
        expect(() => moduleApi.createService({})).toThrow("Missing required module API: GTVGroupTabs.createService");
    });
});
