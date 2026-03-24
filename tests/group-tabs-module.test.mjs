import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "group-tabs.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadGroupTabsModule(options = {}) {
    const globalPatches = {
        window: {},
        document: options.document || {
            getElementById() {
                return null;
            }
        },
        prompt: options.prompt || (() => null),
        confirm: options.confirm || (() => true),
        console
    };
    const keys = ["window", "document", "prompt", "confirm", "console", "GTVGroupTabs", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVGroupTabs || globalThis.GTVGroupTabs;
}

function createBaseDeps(state, overrides = {}) {
    return {
        t: (key) => key,
        showToast: () => { },
        confirmFn: () => true,
        getState: () => state,
        setState: (next) => {
            Object.assign(state, next);
        },
        isMultiTab: () => false,
        getCurrentGroup: () => Array.isArray(state.groups) ? state.groups[state.activeGroupId || 0] : null,
        isFixedTimeTab: () => false,
        ensureGroupMultiSubgroups: (group) => {
            if (!group || typeof group !== "object") return;
            if (!Array.isArray(group.multiSubgroups) || !group.multiSubgroups.length) {
                group.multiSubgroups = [{
                    id: "sg-1",
                    name: "Subgroup 1",
                    multiRangeCount: 1,
                    multiRanges: [],
                    multiRangeCollapsed: [],
                    multiRangeStartEditEnabled: [],
                    multiRangeEndEditEnabled: []
                }];
            }
            if (!group.activeMultiSubgroupId) {
                group.activeMultiSubgroupId = group.multiSubgroups[0].id;
            }
        },
        normalizeGroupTabState: () => { },
        syncCurrentMultiStateToActiveSubgroup: () => { },
        loadCurrentMultiStateFromActiveSubgroup: () => { },
        savePersistence: () => { },
        renderGroups: () => { },
        renderMultiSubgroups: () => { },
        renderBaseTimeSelect: () => { },
        renderMultiRanges: () => { },
        renderFixedTimeTab: () => { },
        renderList: () => { },
        renderTimelineFrame: () => { },
        setCustomTooltip: () => { },
        hideFloatingTooltip: () => { },
        upgradeNativeTitleTooltips: () => { },
        getDefaultMultiSubgroupName: (index) => `Subgroup ${Number(index) + 1}`,
        getDefaultFixedTimes: () => [],
        getDefaultFixedDate: () => "",
        createMultiSubgroupState: (name, index) => ({
            id: `sg-${Number(index) + 1}`,
            name: String(name || "").trim() || `Subgroup ${Number(index) + 1}`,
            multiRangeCount: 1,
            multiRanges: [],
            multiRangeCollapsed: [],
            multiRangeStartEditEnabled: [],
            multiRangeEndEditEnabled: []
        }),
        sanitizeMultiSubgroupName: (value, fallback = "") => String(value || fallback || ""),
        sanitizeMultiRangeTitle: (value) => String(value || ""),
        exportGroupToJSON: () => { },
        triggerGroupImportFor: () => { },
        exportSubgroupToJSON: () => { },
        triggerSubgroupImportFor: () => { },
        ...overrides
    };
}

describe("GTV group tabs module", () => {
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

    it("addGroup handles non-array groups state and initializes first group", () => {
        const module = loadGroupTabsModule({
            prompt: () => "New Group"
        });
        const state = {
            groups: null,
            activeGroupId: 0,
            currentMainTab: "live",
            activeGroupIdByMainTab: { live: 0, fixed: 0 }
        };
        const service = module.createService(createBaseDeps(state));

        service.addGroup();

        expect(Array.isArray(state.groups)).toBe(true);
        expect(state.groups.length).toBe(1);
        expect(state.groups[0].name).toBe("New Group");
        expect(state.activeGroupId).toBe(0);
    });

    it("addGroup initializes fixedDate from dependency", () => {
        const module = loadGroupTabsModule({
            prompt: () => "With Date"
        });
        const state = {
            groups: [],
            activeGroupId: 0,
            currentMainTab: "fixed-time",
            activeGroupIdByMainTab: { live: 0, fixed: 0 }
        };
        const service = module.createService(createBaseDeps(state, {
            getDefaultFixedDate: () => "2026-03-15"
        }));

        service.addGroup();

        expect(state.groups[0].fixedDate).toBe("2026-03-15");
    });

    it("activateGroupTab clamps out-of-range index", () => {
        const module = loadGroupTabsModule();
        const state = {
            groups: [{ name: "A" }, { name: "B" }],
            activeGroupId: 0,
            currentMainTab: "live",
            activeGroupIdByMainTab: { live: 0, fixed: 0 }
        };
        const service = module.createService(createBaseDeps(state));

        service.activateGroupTab(99);

        expect(state.activeGroupId).toBe(1);
    });

    it("renderGroups exits safely when required DOM nodes are missing", () => {
        const module = loadGroupTabsModule();
        const state = {
            groups: [{ name: "A" }, { name: "B" }],
            activeGroupId: 0,
            currentMainTab: "live",
            activeGroupIdByMainTab: { live: 0, fixed: 0 }
        };
        const service = module.createService(createBaseDeps(state));

        expect(() => service.renderGroups()).not.toThrow();
    });

    it("activateGroupTab rerenders fixed-time body and timeline", () => {
        const module = loadGroupTabsModule();
        const state = {
            groups: [{ name: "A" }, { name: "B" }],
            activeGroupId: 0,
            currentMainTab: "fixed-time",
            activeGroupIdByMainTab: { live: 0, fixed: 0 }
        };
        let fixedTimeRenderCount = 0;
        let timelineRenderCount = 0;
        const service = module.createService(createBaseDeps(state, {
            isFixedTimeTab: () => true,
            renderFixedTimeTab: () => { fixedTimeRenderCount += 1; },
            renderTimelineFrame: () => { timelineRenderCount += 1; }
        }));

        service.activateGroupTab(1);

        expect(state.activeGroupId).toBe(1);
        expect(fixedTimeRenderCount).toBe(1);
        expect(timelineRenderCount).toBe(1);
    });

    it("deleteMultiSubgroup uses injected confirmFn and aborts when denied", () => {
        const module = loadGroupTabsModule({
            confirm: () => {
                throw new Error("global confirm should not be called");
            }
        });
        const state = {
            groups: [{
                name: "A",
                multiSubgroups: [
                    { id: "sg-1", name: "Subgroup 1" },
                    { id: "sg-2", name: "Subgroup 2" }
                ],
                activeMultiSubgroupId: "sg-1"
            }],
            activeGroupId: 0,
            currentMainTab: "live",
            activeGroupIdByMainTab: { live: 0, fixed: 0 }
        };
        let confirmCalls = 0;
        let saveCalls = 0;
        const service = module.createService(createBaseDeps(state, {
            isMultiTab: () => true,
            confirmFn: () => {
                confirmCalls += 1;
                return false;
            },
            savePersistence: () => {
                saveCalls += 1;
            }
        }));

        service.deleteMultiSubgroup("sg-2");

        expect(confirmCalls).toBe(1);
        expect(saveCalls).toBe(0);
        expect(state.groups[0].multiSubgroups).toHaveLength(2);
    });
});
