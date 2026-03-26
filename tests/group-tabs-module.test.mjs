import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "group-tabs.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function createClassList() {
    const values = new Set();
    return {
        add(...tokens) {
            tokens.forEach((token) => values.add(String(token)));
        },
        remove(...tokens) {
            tokens.forEach((token) => values.delete(String(token)));
        },
        contains(token) {
            return values.has(String(token));
        },
        toggle(token, force) {
            const key = String(token);
            const shouldAdd = (force === undefined) ? !values.has(key) : !!force;
            if (shouldAdd) values.add(key);
            else values.delete(key);
            return shouldAdd;
        }
    };
}

function splitClassNames(className = "") {
    return String(className || "")
        .split(/\s+/)
        .map((token) => token.trim())
        .filter(Boolean);
}

function createElementStub(tagName = "div") {
    const handlers = new Map();
    const el = {
        tagName: String(tagName || "div").toUpperCase(),
        style: {},
        className: "",
        classList: createClassList(),
        dataset: {},
        textContent: "",
        id: "",
        type: "",
        tabIndex: 0,
        parentNode: null,
        children: [],
        attributes: {},
        onclick: null,
        addEventListener(type, cb) {
            const key = String(type || "");
            if (!handlers.has(key)) handlers.set(key, []);
            handlers.get(key).push(cb);
        },
        removeEventListener(type, cb) {
            const key = String(type || "");
            const list = handlers.get(key) || [];
            handlers.set(key, list.filter((item) => item !== cb));
        },
        dispatch(type, event = {}) {
            const key = String(type || "");
            const list = handlers.get(key) || [];
            list.forEach((cb) => cb(event));
        },
        appendChild(child) {
            if (!child || typeof child !== "object") return child;
            this.children.push(child);
            child.parentNode = this;
            return child;
        },
        setAttribute(name, value) {
            const key = String(name || "");
            const text = String(value ?? "");
            this.attributes[key] = text;
            if (key === "class") this.className = text;
            if (key === "id") this.id = text;
        },
        querySelector(selector) {
            return this.querySelectorAll(selector)[0] || null;
        },
        querySelectorAll(selector) {
            const classMatch = String(selector || "").match(/^\.([a-zA-Z0-9_-]+)$/);
            if (!classMatch) return [];
            const token = classMatch[1];
            const matched = [];
            const walk = (node) => {
                (node.children || []).forEach((child) => {
                    if (splitClassNames(child.className).includes(token)) {
                        matched.push(child);
                    }
                    walk(child);
                });
            };
            walk(this);
            return matched;
        }
    };
    return el;
}

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

    it("renameGroup trims name, persists, and shows toast", () => {
        const module = loadGroupTabsModule({
            prompt: () => "  Renamed Group  "
        });
        const state = {
            groups: [{ name: "Old Name" }],
            activeGroupId: 0,
            currentMainTab: "live",
            activeGroupIdByMainTab: { live: 0, fixed: 0 }
        };
        let toastKey = "";
        let saveCalls = 0;
        const service = module.createService(createBaseDeps(state, {
            savePersistence: () => { saveCalls += 1; },
            showToast: (key) => { toastKey = key; }
        }));

        service.renameGroup(0);

        expect(state.groups[0].name).toBe("Renamed Group");
        expect(saveCalls).toBe(1);
        expect(toastKey).toBe("toast_name_changed");
    });

    it("renderGroups delete button removes target group and updates state", () => {
        const groupContainer = createElementStub("div");
        const addBtn = createElementStub("button");
        const module = loadGroupTabsModule({
            document: {
                getElementById(id) {
                    if (id === "group-tabs-container") return groupContainer;
                    if (id === "add-group-btn") return addBtn;
                    return null;
                },
                createElement(tagName) {
                    return createElementStub(tagName);
                }
            }
        });
        const state = {
            groups: [{ name: "A" }, { name: "B" }],
            activeGroupId: 0,
            currentMainTab: "live",
            activeGroupIdByMainTab: { live: 0, fixed: 0 }
        };
        let toastKey = "";
        const service = module.createService(createBaseDeps(state, {
            confirmFn: () => true,
            showToast: (key) => { toastKey = key; }
        }));

        service.renderGroups();
        const firstTab = groupContainer.children[0];
        const delBtn = firstTab?.children?.find((child) => child.className === "group-del-btn");
        expect(delBtn).toBeTruthy();

        delBtn.onclick?.({ stopPropagation() { } });

        expect(state.groups).toHaveLength(1);
        expect(state.groups[0].name).toBe("B");
        expect(state.activeGroupId).toBe(0);
        expect(toastKey).toBe("toast_group_deleted");
    });

    it("activateMultiSubgroup switches active subgroup and rerenders multi UI", () => {
        const module = loadGroupTabsModule();
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
            currentMainTab: "multi",
            activeGroupIdByMainTab: { live: 0, fixed: 0 }
        };
        let renderMultiCalls = 0;
        let renderTabsCalls = 0;
        let saveCalls = 0;
        const service = module.createService(createBaseDeps(state, {
            isMultiTab: () => true,
            renderMultiRanges: () => { renderMultiCalls += 1; },
            renderMultiSubgroups: () => { renderTabsCalls += 1; },
            savePersistence: () => { saveCalls += 1; }
        }));

        service.activateMultiSubgroup("sg-2");

        expect(state.groups[0].activeMultiSubgroupId).toBe("sg-2");
        expect(renderMultiCalls).toBe(1);
        expect(saveCalls).toBe(1);
        expect(renderTabsCalls).toBe(0);
    });

    it("addMultiSubgroup aborts when prompt is blank", () => {
        const module = loadGroupTabsModule({
            prompt: () => "   "
        });
        const state = {
            groups: [{
                name: "A",
                multiSubgroups: [{ id: "sg-1", name: "Subgroup 1" }],
                activeMultiSubgroupId: "sg-1"
            }],
            activeGroupId: 0,
            currentMainTab: "multi",
            activeGroupIdByMainTab: { live: 0, fixed: 0 }
        };
        let saveCalls = 0;
        const service = module.createService(createBaseDeps(state, {
            isMultiTab: () => true,
            savePersistence: () => { saveCalls += 1; }
        }));

        service.addMultiSubgroup();

        expect(state.groups[0].multiSubgroups).toHaveLength(1);
        expect(saveCalls).toBe(0);
    });

    it("deleteMultiSubgroup blocks deletion when only one subgroup remains", () => {
        const module = loadGroupTabsModule();
        const state = {
            groups: [{
                name: "A",
                multiSubgroups: [{ id: "sg-1", name: "Subgroup 1" }],
                activeMultiSubgroupId: "sg-1"
            }],
            activeGroupId: 0,
            currentMainTab: "multi",
            activeGroupIdByMainTab: { live: 0, fixed: 0 }
        };
        let toastKey = "";
        const service = module.createService(createBaseDeps(state, {
            showToast: (key) => { toastKey = key; }
        }));

        service.deleteMultiSubgroup("sg-1");

        expect(state.groups[0].multiSubgroups).toHaveLength(1);
        expect(toastKey).toBe("toast_subgroup_min");
    });

    it("renderMultiSubgroups hides section when not in multi tab", () => {
        const subgroupContainer = createElementStub("div");
        const addBtn = createElementStub("button");
        const module = loadGroupTabsModule({
            document: {
                getElementById(id) {
                    if (id === "multi-subgroup-tabs-container") return subgroupContainer;
                    if (id === "add-multi-subgroup-btn") return addBtn;
                    return null;
                },
                createElement(tagName) {
                    return createElementStub(tagName);
                }
            }
        });
        const state = {
            groups: [],
            activeGroupId: 0,
            currentMainTab: "live",
            activeGroupIdByMainTab: { live: 0, fixed: 0 }
        };
        const service = module.createService(createBaseDeps(state, {
            isMultiTab: () => false
        }));

        service.renderMultiSubgroups();

        expect(subgroupContainer.style.display).toBe("none");
    });

    it("renderMultiSubgroups shows add button when current group is missing", () => {
        const subgroupContainer = createElementStub("div");
        const addBtn = createElementStub("button");
        const module = loadGroupTabsModule({
            document: {
                getElementById(id) {
                    if (id === "multi-subgroup-tabs-container") return subgroupContainer;
                    if (id === "add-multi-subgroup-btn") return addBtn;
                    return null;
                },
                createElement(tagName) {
                    return createElementStub(tagName);
                }
            }
        });
        const state = {
            groups: [],
            activeGroupId: 0,
            currentMainTab: "multi",
            activeGroupIdByMainTab: { live: 0, fixed: 0 }
        };
        const service = module.createService(createBaseDeps(state, {
            isMultiTab: () => true,
            getCurrentGroup: () => null
        }));

        service.renderMultiSubgroups();

        expect(subgroupContainer.children.at(-1)).toBe(addBtn);
        expect(subgroupContainer.style.display).toBe("flex");
    });

    it("activateGroupTab exits when groups are empty or index is unchanged", () => {
        const module = loadGroupTabsModule();
        const emptyState = {
            groups: [],
            activeGroupId: 0,
            currentMainTab: "live",
            activeGroupIdByMainTab: { live: 0, fixed: 0 }
        };
        let saveCalls = 0;
        const emptyService = module.createService(createBaseDeps(emptyState, {
            savePersistence: () => { saveCalls += 1; }
        }));
        emptyService.activateGroupTab(0);
        expect(saveCalls).toBe(0);

        const sameState = {
            groups: [{ name: "A" }, { name: "B" }],
            activeGroupId: 1,
            currentMainTab: "live",
            activeGroupIdByMainTab: { live: 1, fixed: 0 }
        };
        const sameService = module.createService(createBaseDeps(sameState, {
            savePersistence: () => { saveCalls += 1; }
        }));
        sameService.activateGroupTab(1);
        expect(saveCalls).toBe(0);
    });

    it("addGroup aborts when prompt is empty", () => {
        const module = loadGroupTabsModule({
            prompt: () => ""
        });
        const state = {
            groups: [{ name: "A" }],
            activeGroupId: 0,
            currentMainTab: "live",
            activeGroupIdByMainTab: { live: 0, fixed: 0 }
        };
        let saveCalls = 0;
        const service = module.createService(createBaseDeps(state, {
            savePersistence: () => { saveCalls += 1; }
        }));

        service.addGroup();

        expect(state.groups).toHaveLength(1);
        expect(saveCalls).toBe(0);
    });

    it("renameGroup and renameMultiSubgroup safely no-op on invalid targets", () => {
        const module = loadGroupTabsModule({
            prompt: () => " "
        });
        const state = {
            groups: [{ name: "A", multiSubgroups: [{ id: "sg-1", name: "Subgroup 1" }], activeMultiSubgroupId: "sg-1" }],
            activeGroupId: 0,
            currentMainTab: "multi",
            activeGroupIdByMainTab: { live: 0, fixed: 0 }
        };
        let saveCalls = 0;
        const service = module.createService(createBaseDeps(state, {
            savePersistence: () => { saveCalls += 1; }
        }));

        service.renameGroup(5);
        service.renameMultiSubgroup("missing-id");

        expect(saveCalls).toBe(0);
        expect(state.groups[0].name).toBe("A");
    });

    it("renderGroups pointer/keyboard guards prevent unintended activation", () => {
        const groupContainer = createElementStub("div");
        const addBtn = createElementStub("button");
        const module = loadGroupTabsModule({
            document: {
                getElementById(id) {
                    if (id === "group-tabs-container") return groupContainer;
                    if (id === "add-group-btn") return addBtn;
                    return null;
                },
                createElement(tagName) {
                    return createElementStub(tagName);
                }
            }
        });
        const state = {
            groups: [{ name: "A" }, { name: "B" }],
            activeGroupId: 0,
            currentMainTab: "live",
            activeGroupIdByMainTab: { live: 0, fixed: 0 }
        };
        const service = module.createService(createBaseDeps(state));

        const prevElement = globalThis.Element;
        class ElementStub {}
        globalThis.Element = ElementStub;
        try {
            service.renderGroups();
            const secondTab = groupContainer.children[1];
            secondTab.dispatch("pointerdown", { button: 0, clientX: 10, clientY: 10 });
            secondTab.dispatch("pointerup", {
                button: 0,
                clientX: 12,
                clientY: 11,
                target: Object.assign(new ElementStub(), { closest: () => ({ blocked: true }) })
            });
            expect(state.activeGroupId).toBe(0);

            secondTab.dispatch("pointerdown", { button: 0, clientX: 10, clientY: 10 });
            secondTab.dispatch("pointerup", {
                button: 0,
                clientX: 30,
                clientY: 30,
                target: Object.assign(new ElementStub(), { closest: () => null })
            });
            expect(state.activeGroupId).toBe(0);

            let preventDefaultCalls = 0;
            secondTab.dispatch("keydown", { key: "Tab", preventDefault: () => { preventDefaultCalls += 1; } });
            expect(preventDefaultCalls).toBe(0);
            expect(state.activeGroupId).toBe(0);
        } finally {
            globalThis.Element = prevElement;
        }
    });

    it("renderGroups rename/export/import handlers invoke expected actions", () => {
        const groupContainer = createElementStub("div");
        const addBtn = createElementStub("button");
        const module = loadGroupTabsModule({
            prompt: () => "Renamed via button",
            document: {
                getElementById(id) {
                    if (id === "group-tabs-container") return groupContainer;
                    if (id === "add-group-btn") return addBtn;
                    return null;
                },
                createElement(tagName) {
                    return createElementStub(tagName);
                }
            }
        });
        const state = {
            groups: [{ name: "A" }, { name: "B" }],
            activeGroupId: 0,
            currentMainTab: "live",
            activeGroupIdByMainTab: { live: 0, fixed: 0 }
        };
        let exportCalls = 0;
        let importCalls = 0;
        const service = module.createService(createBaseDeps(state, {
            exportGroupToJSON: () => { exportCalls += 1; },
            triggerGroupImportFor: () => { importCalls += 1; }
        }));

        service.renderGroups();
        const firstTab = groupContainer.children[0];
        const editBtn = firstTab.children.find((child) => child.className === "group-edit-btn");
        const exportBtn = firstTab.children.find((child) => child.className === "group-export-btn");
        const importBtn = firstTab.children.find((child) => child.className === "group-import-btn");
        editBtn.onclick?.({ stopPropagation() { } });
        exportBtn.onclick?.({ stopPropagation() { } });
        importBtn.onclick?.({ stopPropagation() { } });

        expect(state.groups[0].name).toBe("Renamed via button");
        expect(exportCalls).toBe(1);
        expect(importCalls).toBe(1);
    });

    it("renderMultiSubgroups active tab handlers rename/export/import/delete", () => {
        const subgroupContainer = createElementStub("div");
        const addBtn = createElementStub("button");
        const module = loadGroupTabsModule({
            prompt: () => "Renamed Subgroup",
            document: {
                getElementById(id) {
                    if (id === "multi-subgroup-tabs-container") return subgroupContainer;
                    if (id === "add-multi-subgroup-btn") return addBtn;
                    return null;
                },
                createElement(tagName) {
                    return createElementStub(tagName);
                }
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
            currentMainTab: "multi",
            activeGroupIdByMainTab: { live: 0, fixed: 0 }
        };
        let exportCalls = 0;
        let importCalls = 0;
        let multiRenderCalls = 0;
        const service = module.createService(createBaseDeps(state, {
            isMultiTab: () => true,
            confirmFn: () => true,
            exportSubgroupToJSON: () => { exportCalls += 1; },
            triggerSubgroupImportFor: () => { importCalls += 1; },
            renderMultiRanges: () => { multiRenderCalls += 1; }
        }));

        service.renderMultiSubgroups();
        const activeTab = subgroupContainer.children[0];
        const editBtn = activeTab.children.find((child) => child.className === "multi-subgroup-edit-btn");
        const exportBtn = activeTab.children.find((child) => child.className === "multi-subgroup-export-btn");
        const importBtn = activeTab.children.find((child) => child.className === "multi-subgroup-import-btn");
        const delBtn = activeTab.children.find((child) => child.className === "multi-subgroup-del-btn");

        editBtn.onclick?.({ stopPropagation() { } });
        exportBtn.onclick?.({ stopPropagation() { } });
        importBtn.onclick?.({ stopPropagation() { } });
        delBtn.onclick?.({ stopPropagation() { } });

        expect(exportCalls).toBe(1);
        expect(importCalls).toBe(1);
        expect(state.groups[0].multiSubgroups.length).toBe(1);
        expect(state.groups[0].multiSubgroups[0].name).toBe("Subgroup 2");
        expect(state.groups[0].activeMultiSubgroupId).toBe("sg-2");
        expect(multiRenderCalls).toBeGreaterThan(0);
    });

    it("deleteMultiSubgroup exits when target id is missing", () => {
        const module = loadGroupTabsModule();
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
            currentMainTab: "multi",
            activeGroupIdByMainTab: { live: 0, fixed: 0 }
        };
        let saveCalls = 0;
        const service = module.createService(createBaseDeps(state, {
            confirmFn: () => true,
            savePersistence: () => { saveCalls += 1; }
        }));

        service.deleteMultiSubgroup("missing");

        expect(state.groups[0].multiSubgroups).toHaveLength(2);
        expect(saveCalls).toBe(0);
    });
});
