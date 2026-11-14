import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "src", "js", "modules", "group-tabs.js");
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

function createGroupSettingsDom() {
    const groupContainer = createElementStub("div");
    const addBtn = createElementStub("button");
    const overlay = createElementStub("div");
    const panel = createElementStub("div");
    panel.className = "app-dialog";
    panel.focused = 0;
    panel.focus = () => { panel.focused += 1; };
    overlay.appendChild(panel);
    const ids = {
        "group-tabs-container": groupContainer,
        "add-group-btn": addBtn,
        "group-settings-overlay": overlay,
        "group-settings-title": createElementStub("h3"),
        "group-settings-name-input": createElementStub("input"),
        "group-settings-name-apply-btn": createElementStub("button"),
        "close-group-settings-btn": createElementStub("button"),
        "group-settings-export-btn": createElementStub("button"),
        "group-settings-import-btn": createElementStub("button"),
        "group-settings-delete-btn": createElementStub("button")
    };
    const docHandlers = {};
    const dispatched = [];
    const blockingOverlay = createElementStub("div");
    const documentRef = {
        getElementById: (id) => ids[id] || null,
        createElement: (tagName) => createElementStub(tagName),
        querySelectorAll: () => [blockingOverlay],
        addEventListener: (type, cb) => { docHandlers[type] = cb; },
        dispatchEvent: (event) => { dispatched.push(event.type); }
    };
    return { ids, overlay, panel, groupContainer, documentRef, docHandlers, dispatched, blockingOverlay };
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

    it("addGroup handles non-array groups state and initializes first group", async () => {
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

        await service.addGroup();

        expect(Array.isArray(state.groups)).toBe(true);
        expect(state.groups.length).toBe(1);
        expect(state.groups[0].name).toBe("New Group");
        expect(state.activeGroupId).toBe(0);
    });

    it("addGroup creates a group without a fixed date", async () => {
        const module = loadGroupTabsModule({
            prompt: () => "With Date"
        });
        const state = {
            groups: [],
            activeGroupId: 0,
            currentMainTab: "fixed-time",
            activeGroupIdByMainTab: { live: 0, fixed: 0 }
        };
        const service = module.createService(createBaseDeps(state, {}));

        await service.addGroup();

        expect(state.groups[0].name).toBe("With Date");
        expect("fixedDate" in state.groups[0]).toBe(false);
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

    it("createService handles null deps and exposes safe no-op render methods", () => {
        const module = loadGroupTabsModule();
        const service = module.createService(null);

        expect(service).toMatchObject({
            activateGroupTab: expect.any(Function),
            addGroup: expect.any(Function),
            renameGroup: expect.any(Function),
            activateMultiSubgroup: expect.any(Function),
            addMultiSubgroup: expect.any(Function),
            renameMultiSubgroup: expect.any(Function),
            deleteMultiSubgroup: expect.any(Function),
            renderGroups: expect.any(Function),
            renderMultiSubgroups: expect.any(Function)
        });
        expect(() => service.renderGroups()).not.toThrow();
        expect(() => service.renderMultiSubgroups()).not.toThrow();
        expect(() => service.activateGroupTab(0)).not.toThrow();
        expect(() => service.activateMultiSubgroup("sg-1")).not.toThrow();
        expect(() => service.deleteMultiSubgroup("sg-1")).not.toThrow();
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

    it("deleteMultiSubgroup uses injected confirmFn and aborts when denied", async () => {
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

        await service.deleteMultiSubgroup("sg-2");

        expect(confirmCalls).toBe(1);
        expect(saveCalls).toBe(0);
        expect(state.groups[0].multiSubgroups).toHaveLength(2);
    });

    it("addGroup uses injected promptFn instead of global prompt", async () => {
        const module = loadGroupTabsModule({
            prompt: () => {
                throw new Error("global prompt should not be called");
            }
        });
        const state = {
            groups: [],
            activeGroupId: 0,
            currentMainTab: "live",
            activeGroupIdByMainTab: { live: 0, fixed: 0 }
        };
        let promptCalls = 0;
        const service = module.createService(createBaseDeps(state, {
            promptFn: async () => {
                promptCalls += 1;
                return "Injected Group";
            }
        }));

        await service.addGroup();

        expect(promptCalls).toBe(1);
        expect(state.groups[0].name).toBe("Injected Group");
    });

    it("addGroup falls back to deps.prompt when promptFn is absent", async () => {
        const module = loadGroupTabsModule({
            prompt: () => {
                throw new Error("global prompt should not be called");
            }
        });
        const state = {
            groups: [],
            activeGroupId: 0,
            currentMainTab: "live",
            activeGroupIdByMainTab: { live: 0, fixed: 0 }
        };
        let promptCalls = 0;
        const service = module.createService(createBaseDeps(state, {
            promptFn: undefined,
            prompt: () => {
                promptCalls += 1;
                return "Deps Prompt Group";
            }
        }));

        await service.addGroup();

        expect(promptCalls).toBe(1);
        expect(state.groups[0].name).toBe("Deps Prompt Group");
    });

    it("deleteMultiSubgroup falls back to deps.confirm when confirmFn is absent", async () => {
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
        const service = module.createService(createBaseDeps(state, {
            isMultiTab: () => true,
            confirmFn: undefined,
            confirm: () => {
                confirmCalls += 1;
                return true;
            }
        }));

        await service.deleteMultiSubgroup("sg-2");

        expect(confirmCalls).toBe(1);
        expect(state.groups[0].multiSubgroups).toHaveLength(1);
    });

    it("renameGroup trims name, persists, and shows toast", async () => {
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

        await service.renameGroup(0);

        expect(state.groups[0].name).toBe("Renamed Group");
        expect(saveCalls).toBe(1);
        expect(toastKey).toBe("toast_name_changed");
    });

    it("renderGroups shows only a settings button on the active tab that opens the group settings popup", async () => {
        const dom = createGroupSettingsDom();
        const module = loadGroupTabsModule({ document: dom.documentRef });
        globalThis.window.CustomEvent = class { constructor(type) { this.type = type; } };
        const state = {
            groups: [{ name: "A" }, { name: "B" }],
            activeGroupId: 0,
            currentMainTab: "live",
            activeGroupIdByMainTab: { live: 0, fixed: 0 }
        };
        let baseRendered = 0;
        let toastKey = "";
        const service = module.createService(createBaseDeps(state, {
            confirmFn: async () => true,
            showToast: (key) => { toastKey = key; },
            renderBaseTimeSelect: () => { baseRendered += 1; }
        }));

        service.renderGroups();
        const [firstTab, secondTab] = dom.groupContainer.children;
        const buttonClasses = (tab) => tab.children.filter((child) => child.tagName === "BUTTON").map((child) => child.className);
        expect(buttonClasses(firstTab)).toEqual(["group-settings-btn"]);
        expect(buttonClasses(secondTab)).toEqual([]);

        const settingsBtn = firstTab.children.find((child) => child.className === "group-settings-btn");
        settingsBtn.focused = 0;
        settingsBtn.focus = () => { settingsBtn.focused += 1; };
        settingsBtn.onclick({ stopPropagation() { } });
        expect(dom.overlay.style.display).toBe("flex");
        expect(dom.ids["group-settings-title"].textContent).toBe("group_settings_title \u2014 A");
        expect(dom.ids["group-settings-name-input"].value).toBe("A");
        expect(baseRendered).toBe(1);
        expect(dom.dispatched).toEqual(["gtv:group-settings-opened"]);
        expect(dom.panel.focused).toBe(1);

        // Esc is left to a confirm/prompt dialog shown above; otherwise it closes the popup.
        dom.blockingOverlay.style.display = "flex";
        dom.docHandlers.keydown({ key: "Escape" });
        expect(dom.overlay.style.display).toBe("flex");
        dom.blockingOverlay.style.display = "none";
        dom.docHandlers.keydown({ key: "Escape" });
        expect(dom.overlay.style.display).toBe("none");
        expect(settingsBtn.focused).toBe(1);

        // Background click closes; delete closes after a confirmed deletion.
        service.openGroupSettings(0, settingsBtn);
        dom.overlay.dispatch("click", { target: dom.panel });
        expect(dom.overlay.style.display).toBe("flex");
        dom.overlay.dispatch("click", { target: dom.overlay });
        expect(dom.overlay.style.display).toBe("none");

        service.openGroupSettings(0, settingsBtn);
        await dom.ids["group-settings-delete-btn"].dispatch("click");
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(state.groups).toHaveLength(1);
        expect(state.groups[0].name).toBe("B");
        expect(toastKey).toBe("toast_group_deleted");
        expect(dom.overlay.style.display).toBe("none");
    });

    it("group settings popup keeps the popup open when deletion is refused", async () => {
        const dom = createGroupSettingsDom();
        const module = loadGroupTabsModule({ document: dom.documentRef });
        const state = {
            groups: [{ name: "Only" }],
            activeGroupId: 0,
            currentMainTab: "live",
            activeGroupIdByMainTab: { live: 0, fixed: 0 }
        };
        let toastKey = "";
        const service = module.createService(createBaseDeps(state, {
            confirmFn: async () => true,
            showToast: (key) => { toastKey = key; }
        }));
        service.openGroupSettings(0);
        await dom.ids["group-settings-delete-btn"].dispatch("click");
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(toastKey).toBe("toast_group_min");
        expect(state.groups).toHaveLength(1);
        expect(dom.overlay.style.display).toBe("flex");
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

    it("addMultiSubgroup aborts when prompt is blank", async () => {
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

        await service.addMultiSubgroup();

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

    it("addGroup aborts when prompt is empty", async () => {
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

        await service.addGroup();

        expect(state.groups).toHaveLength(1);
        expect(saveCalls).toBe(0);
    });

    it("renameGroup and renameMultiSubgroup safely no-op on invalid targets", async () => {
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

        await service.renameGroup(5);
        await service.renameMultiSubgroup("missing-id");

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

    it("group settings popup renames in place and its export/import buttons act on the chosen group", async () => {
        const dom = createGroupSettingsDom();
        const module = loadGroupTabsModule({ document: dom.documentRef });
        const state = {
            groups: [{ name: "A" }, { name: "B" }],
            activeGroupId: 1,
            currentMainTab: "live",
            activeGroupIdByMainTab: { live: 1, fixed: 1 }
        };
        const exported = [];
        const imported = [];
        const service = module.createService(createBaseDeps(state, {
            exportGroupToJSON: (idx) => { exported.push(idx); },
            triggerGroupImportFor: (idx) => { imported.push(idx); }
        }));

        service.openGroupSettings(1);
        const nameInput = dom.ids["group-settings-name-input"];
        expect(nameInput.value).toBe("B");

        const applyBtn = dom.ids["group-settings-name-apply-btn"];

        // Typing alone, Enter or leaving the field does not save; the Change button does.
        nameInput.value = "  Renamed in popup  ";
        nameInput.dispatch("keydown", { key: "Enter", preventDefault() { } });
        nameInput.dispatch("change");
        expect(state.groups[1].name).toBe("B");
        applyBtn.dispatch("click");
        expect(state.groups[1].name).toBe("Renamed in popup");
        expect(dom.ids["group-settings-title"].textContent).toBe("group_settings_title \u2014 Renamed in popup");

        // An empty name is not saved; the field returns to the current name.
        nameInput.value = "   ";
        applyBtn.dispatch("click");
        expect(state.groups[1].name).toBe("Renamed in popup");
        expect(nameInput.value).toBe("Renamed in popup");

        // Closing with an unsaved name keeps the old name.
        nameInput.value = "Unsaved";
        dom.ids["close-group-settings-btn"].dispatch("click");
        expect(state.groups[1].name).toBe("Renamed in popup");
        service.openGroupSettings(1);

        dom.ids["group-settings-export-btn"].dispatch("click");
        expect(exported).toEqual([1]);

        // Import opens the file picker for this group and closes the popup.
        dom.ids["group-settings-import-btn"].dispatch("click");
        expect(imported).toEqual([1]);
        expect(dom.overlay.style.display).toBe("none");
    });

    it("renderMultiSubgroups active tab handlers rename/export/import/delete", async () => {
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

        await editBtn.onclick?.({ stopPropagation() { } });
        exportBtn.onclick?.({ stopPropagation() { } });
        importBtn.onclick?.({ stopPropagation() { } });
        delBtn.onclick?.({ stopPropagation() { } });
        await new Promise((resolve) => setTimeout(resolve, 0));

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

    it("renderGroups prefers injected getDocumentRef over global document", () => {
        const globalContainer = createElementStub("div");
        const globalAddBtn = createElementStub("button");
        const injectedContainer = createElementStub("div");
        const injectedAddBtn = createElementStub("button");
        const globalDoc = {
            getElementById(id) {
                if (id === "group-tabs-container") return globalContainer;
                if (id === "add-group-btn") return globalAddBtn;
                return null;
            },
            createElement(tagName) {
                return createElementStub(tagName);
            }
        };
        const injectedDoc = {
            getElementById(id) {
                if (id === "group-tabs-container") return injectedContainer;
                if (id === "add-group-btn") return injectedAddBtn;
                return null;
            },
            createElement(tagName) {
                return createElementStub(tagName);
            }
        };
        const module = loadGroupTabsModule({
            document: globalDoc
        });
        const state = {
            groups: [{ name: "A" }, { name: "B" }],
            activeGroupId: 0,
            currentMainTab: "live",
            activeGroupIdByMainTab: { live: 0, fixed: 0 }
        };
        const service = module.createService(createBaseDeps(state, {
            getDocumentRef: () => injectedDoc
        }));

        service.renderGroups();

        expect(injectedContainer.children.length).toBeGreaterThan(0);
        expect(globalContainer.children.length).toBe(0);
    });
});
