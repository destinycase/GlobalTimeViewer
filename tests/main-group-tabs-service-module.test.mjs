import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-group-tabs-service.js");

function loadMainGroupTabsServiceModule() {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = { window: {}, globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/main-group-tabs-service.js" });
    return sandbox.window.GTVMainGroupTabsService || sandbox.GTVMainGroupTabsService || sandbox.globalThis.GTVMainGroupTabsService;
}

describe("GTV main group tabs service module", () => {
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
