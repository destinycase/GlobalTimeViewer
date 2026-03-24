import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "tab-ui.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadTabUiModule(options = {}) {
    const globalPatches = {
        document: options.document || {
            getElementById() {
                return null;
            },
            querySelectorAll() {
                return [];
            }
        },
        console: options.console || console
    };
    if (!options.noWindow) {
        globalPatches.window = {};
    }
    const keys = ["window", "document", "console", "GTVTabUI", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVTabUI || globalThis.GTVTabUI;
}

function createClassListState() {
    const classes = new Set();
    return {
        add(name) {
            classes.add(name);
        },
        remove(name) {
            classes.delete(name);
        },
        toggle(name, enabled) {
            if (enabled) classes.add(name);
            else classes.delete(name);
        },
        has(name) {
            return classes.has(name);
        }
    };
}

function createElementStub(extra = {}) {
    return {
        style: {},
        classList: createClassListState(),
        ...extra
    };
}

describe("GTV tab UI module", () => {
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

    it("switchMainTab tolerates malformed state map/index values", () => {
        const navItem = {
            dataset: { tab: "fixed" },
            classList: {
                active: false,
                toggle(_cls, value) {
                    this.active = !!value;
                }
            }
        };
        const optionRow = {
            style: {},
            querySelectorAll() {
                return [];
            }
        };
        const toggles = {
            "toggle-extra-time": { disabled: false, checked: true },
            "toggle-copy-format": { checked: false },
            "toggle-timeline": { checked: false },
            "control-option-row": optionRow
        };
        const documentStub = {
            getElementById(id) {
                return toggles[id] || null;
            },
            querySelectorAll(selector) {
                if (selector === ".nav-item") return [navItem];
                return [];
            }
        };
        const module = loadTabUiModule({ document: documentStub });

        const state = {
            mainTab: null,
            activeGroupId: null,
            activeByTab: null,
            isRealtime: null
        };
        const service = module.createService({
            sanitizeMainTab: () => "   ",
            hideFloatingTooltip: () => { },
            syncCurrentMultiStateToActiveSubgroup: () => { },
            getCurrentMainTab: () => "live",
            getActiveGroupId: () => "invalid-index",
            getActiveGroupIdByMainTab: () => "invalid-map",
            clampGroupIndex: () => 0,
            setCurrentMainTab: (value) => { state.mainTab = value; },
            setActiveGroupId: (value) => { state.activeGroupId = value; },
            setActiveGroupIdByMainTab: (value) => { state.activeByTab = value; },
            normalizeGroupTabState: () => { },
            isMultiTab: () => false,
            isFixedTimeTab: () => false,
            setIsRealtime: (value) => { state.isRealtime = value; },
            getIsRealtime: () => false,
            getSlotCount: () => 1,
            getShowCopyFormat: () => false,
            getShowTimeline: () => false
        });

        expect(() => service.switchMainTab("fixed")).not.toThrow();
        expect(state.mainTab).toBe("fixed");
        expect(state.activeGroupId).toBe(0);
        expect(state.activeByTab).toMatchObject({ live: 0, fixed: 0 });
        expect(state.isRealtime).toBe(false);
    });

    it("refreshOptionToggleDividers exits safely when option row is missing", () => {
        const module = loadTabUiModule({
            document: {
                getElementById() {
                    return null;
                }
            }
        });
        const service = module.createService({});

        expect(() => service.refreshOptionToggleDividers()).not.toThrow();
    });

    it("updateOptionRowVisibility handles missing DOM nodes and deps safely", () => {
        const optionRow = { style: {} };
        const module = loadTabUiModule({
            document: {
                getElementById(id) {
                    if (id === "control-option-row") return optionRow;
                    return null;
                }
            }
        });
        const service = module.createService(null);

        expect(() => service.updateOptionRowVisibility()).not.toThrow();
        expect(optionRow.style.display).toBe("flex");
    });

    it("updateOptionRowVisibility keeps table image save button visible regardless of timeline toggle", () => {
        const makeNode = () => ({ style: {} });
        const optionRow = {
            style: {},
            querySelectorAll() {
                return [];
            }
        };
        const extraGroup = makeNode();
        const copyGroup = makeNode();
        const timelineGroup = makeNode();
        const fixedTimeSlotCountGroup = makeNode();
        const fixedTimeDateGroup = makeNode();
        const saveTableImageBtn = makeNode();
        const saveMultiTitlesImageBtn = makeNode();
        const elements = {
            "control-option-row": optionRow,
            "toggle-extra-time": { closest: () => extraGroup },
            "toggle-copy-format": { closest: () => copyGroup },
            "toggle-timeline": { closest: () => timelineGroup },
            "fixed-time-slot-count-group": fixedTimeSlotCountGroup,
            "fixed-time-date-group": fixedTimeDateGroup,
            "copy-format-row": makeNode(),
            "multi-range-count-group": makeNode(),
            "multi-tools-row": makeNode(),
            "multi-subgroup-row": makeNode(),
            "multi-controls-frame": makeNode(),
            "save-table-image-btn": saveTableImageBtn,
            "save-multi-range-titles-image-btn": saveMultiTitlesImageBtn
        };
        const module = loadTabUiModule({
            document: {
                getElementById(id) {
                    return elements[id] || null;
                }
            }
        });

        const serviceTimelineOn = module.createService({
            isMultiTab: () => false,
            isFixedTimeTab: () => false,
            getIsRealtime: () => false,
            getShowTimeline: () => true,
            refreshMultiRangeControls: () => { }
        });
        serviceTimelineOn.updateOptionRowVisibility();
        expect(saveTableImageBtn.style.display).toBe("");
        expect(saveMultiTitlesImageBtn.style.display).toBe("none");

        const serviceTimelineOff = module.createService({
            isMultiTab: () => false,
            isFixedTimeTab: () => false,
            getIsRealtime: () => false,
            getShowTimeline: () => false,
            refreshMultiRangeControls: () => { }
        });
        serviceTimelineOff.updateOptionRowVisibility();
        expect(saveTableImageBtn.style.display).toBe("");
        expect(saveMultiTitlesImageBtn.style.display).toBe("none");

        const serviceFixedTime = module.createService({
            isMultiTab: () => false,
            isFixedTimeTab: () => true,
            getIsRealtime: () => false,
            getShowTimeline: () => false,
            refreshMultiRangeControls: () => { }
        });
        serviceFixedTime.updateOptionRowVisibility();
        expect(saveTableImageBtn.style.display).toBe("");
        expect(saveMultiTitlesImageBtn.style.display).toBe("none");
        expect(copyGroup.style.display).toBe("flex");
        expect(timelineGroup.style.display).toBe("flex");
        expect(fixedTimeSlotCountGroup.style.display).toBe("flex");
        expect(fixedTimeDateGroup.style.display).toBe("flex");

        const serviceMulti = module.createService({
            isMultiTab: () => true,
            isFixedTimeTab: () => false,
            getIsRealtime: () => false,
            getShowTimeline: () => false,
            refreshMultiRangeControls: () => { }
        });
        serviceMulti.updateOptionRowVisibility();
        expect(saveTableImageBtn.style.display).toBe("");
        expect(saveMultiTitlesImageBtn.style.display).toBe("");
        expect(copyGroup.style.display).toBe("flex");
        expect(timelineGroup.style.display).toBe("none");
        expect(fixedTimeSlotCountGroup.style.display).toBe("none");
        expect(fixedTimeDateGroup.style.display).toBe("none");
    });

    it("refreshOptionToggleDividers updates divider class only for visible groups", () => {
        const group1 = createElementStub({ style: { display: "flex" } });
        const group2 = createElementStub({ style: { display: "none" } });
        const group3 = createElementStub({ style: { display: "" } });
        const group4 = createElementStub({ style: { display: "block" } });
        const optionRow = {
            querySelectorAll() {
                return [group1, group2, group3, group4];
            }
        };
        const module = loadTabUiModule({
            document: {
                getElementById(id) {
                    if (id === "control-option-row") return optionRow;
                    return null;
                }
            }
        });
        const service = module.createService({});

        service.refreshOptionToggleDividers();

        expect(group1.classList.has("option-with-divider")).toBe(true);
        expect(group2.classList.has("option-with-divider")).toBe(false);
        expect(group3.classList.has("option-with-divider")).toBe(true);
        expect(group4.classList.has("option-with-divider")).toBe(false);
    });

    it("switchMainTab drives multi-tab rendering path and toggle states", () => {
        const navLive = createElementStub({ dataset: { tab: "live" } });
        const navMulti = createElementStub({ dataset: { tab: "multi" } });
        const timezoneSection = createElementStub();
        const fixedTimeSection = createElementStub();
        const multiRangeSection = createElementStub();
        const calcSection = createElementStub();
        const groupTabsContainer = createElementStub();
        const topControlBar = createElementStub();
        const optionRow = { style: {}, querySelectorAll() { return []; } };
        const extraGroup = createElementStub();
        const copyGroup = createElementStub();
        const timelineGroup = createElementStub();
        const extraToggle = { disabled: false, checked: false, closest: () => extraGroup };
        const copyToggle = { checked: false, closest: () => copyGroup };
        const timelineToggle = { checked: false, closest: () => timelineGroup };
        const elements = {
            "timezone-section": timezoneSection,
            "fixed-time-section": fixedTimeSection,
            "multi-range-section": multiRangeSection,
            "calc-section": calcSection,
            "group-tabs-container": groupTabsContainer,
            "top-control-bar": topControlBar,
            "control-option-row": optionRow,
            "toggle-extra-time": extraToggle,
            "toggle-copy-format": copyToggle,
            "toggle-timeline": timelineToggle,
            "copy-format-row": createElementStub(),
            "fixed-time-slot-count-group": createElementStub(),
            "fixed-time-date-group": createElementStub(),
            "multi-range-count-group": createElementStub(),
            "multi-tools-row": createElementStub(),
            "multi-subgroup-row": createElementStub(),
            "multi-controls-frame": createElementStub(),
            "save-table-image-btn": createElementStub(),
            "save-multi-range-titles-image-btn": createElementStub()
        };
        const module = loadTabUiModule({
            document: {
                getElementById(id) {
                    return elements[id] || null;
                },
                querySelectorAll(selector) {
                    if (selector === ".nav-item") return [navLive, navMulti];
                    return [];
                }
            }
        });

        let currentMainTab = "live";
        let activeGroupId = 2;
        let activeGroupIdByMainTab = { live: 1, fixed: 3 };
        let realtime = false;
        const calls = [];
        const service = module.createService({
            sanitizeMainTab: () => "multi",
            hideFloatingTooltip: () => calls.push("hideFloatingTooltip"),
            syncCurrentMultiStateToActiveSubgroup: () => calls.push("syncCurrentMultiState"),
            getCurrentMainTab: () => currentMainTab,
            getActiveGroupId: () => activeGroupId,
            getActiveGroupIdByMainTab: () => activeGroupIdByMainTab,
            clampGroupIndex: (value) => Number(value),
            setCurrentMainTab: (value) => {
                currentMainTab = value;
            },
            setActiveGroupId: (value) => {
                activeGroupId = value;
            },
            setActiveGroupIdByMainTab: (value) => {
                activeGroupIdByMainTab = value;
            },
            normalizeGroupTabState: () => calls.push("normalizeGroupTabState"),
            isMultiTab: () => currentMainTab === "multi",
            isFixedTimeTab: () => currentMainTab === "fixed-time",
            setIsRealtime: (value) => {
                realtime = !!value;
            },
            getIsRealtime: () => realtime,
            getSlotCount: () => 2,
            getShowCopyFormat: () => true,
            getShowTimeline: () => false,
            renderTimelineFrame: () => calls.push("renderTimelineFrame"),
            renderBaseTimeSelect: () => calls.push("renderBaseTimeSelect"),
            loadCurrentMultiStateFromActiveSubgroup: () => calls.push("loadCurrentMultiState"),
            renderGroups: () => calls.push("renderGroups"),
            renderMultiSubgroups: () => calls.push("renderMultiSubgroups"),
            renderMultiRanges: () => calls.push("renderMultiRanges"),
            renderCopyFormatControls: () => calls.push("renderCopyFormatControls"),
            savePersistence: () => calls.push("savePersistence"),
            refreshMultiRangeControls: () => calls.push("refreshMultiRangeControls")
        });

        service.switchMainTab("multi");

        expect(currentMainTab).toBe("multi");
        expect(activeGroupId).toBe(2);
        expect(activeGroupIdByMainTab).toMatchObject({ live: 2, fixed: 3 });
        expect(extraToggle.disabled).toBe(true);
        expect(extraToggle.checked).toBe(true);
        expect(copyToggle.checked).toBe(true);
        expect(timelineToggle.checked).toBe(false);
        expect(navMulti.classList.has("active")).toBe(true);
        expect(navLive.classList.has("active")).toBe(false);
        expect(timezoneSection.classList.has("active")).toBe(false);
        expect(multiRangeSection.classList.has("active")).toBe(true);
        expect(calcSection.classList.has("active")).toBe(false);
        expect(groupTabsContainer.style.display).toBe("flex");
        expect(topControlBar.style.display).toBe("flex");
        expect(calls).toContain("renderBaseTimeSelect");
        expect(calls).toContain("loadCurrentMultiState");
        expect(calls).toContain("renderMultiRanges");
        expect(calls).toContain("savePersistence");
        expect(calls).not.toContain("renderList");
        expect(calls).not.toContain("renderFixedTimeTab");
    });

    it("switchMainTab live path enables realtime sync and calc path hides top controls", () => {
        const timezoneSection = createElementStub();
        const fixedTimeSection = createElementStub();
        const multiRangeSection = createElementStub();
        const calcSection = createElementStub();
        const groupTabsContainer = createElementStub();
        const topControlBar = createElementStub();
        const optionRow = { style: {}, querySelectorAll() { return []; } };
        const extraGroup = createElementStub();
        const copyGroup = createElementStub();
        const timelineGroup = createElementStub();
        const extraToggle = { disabled: false, checked: true, closest: () => extraGroup };
        const copyToggle = { checked: false, closest: () => copyGroup };
        const timelineToggle = { checked: false, closest: () => timelineGroup };
        const elements = {
            "timezone-section": timezoneSection,
            "fixed-time-section": fixedTimeSection,
            "multi-range-section": multiRangeSection,
            "calc-section": calcSection,
            "group-tabs-container": groupTabsContainer,
            "top-control-bar": topControlBar,
            "control-option-row": optionRow,
            "toggle-extra-time": extraToggle,
            "toggle-copy-format": copyToggle,
            "toggle-timeline": timelineToggle,
            "copy-format-row": createElementStub(),
            "fixed-time-slot-count-group": createElementStub(),
            "fixed-time-date-group": createElementStub(),
            "multi-range-count-group": createElementStub(),
            "multi-tools-row": createElementStub(),
            "multi-subgroup-row": createElementStub(),
            "multi-controls-frame": createElementStub(),
            "save-table-image-btn": createElementStub(),
            "save-multi-range-titles-image-btn": createElementStub()
        };
        const module = loadTabUiModule({
            document: {
                getElementById(id) {
                    return elements[id] || null;
                },
                querySelectorAll() {
                    return [];
                }
            }
        });

        let currentMainTab = "fixed";
        let realtime = false;
        const calls = [];
        const service = module.createService({
            sanitizeMainTab: (tab) => tab,
            getCurrentMainTab: () => currentMainTab,
            getActiveGroupId: () => 0,
            getActiveGroupIdByMainTab: () => ({ live: 0, fixed: 0 }),
            setCurrentMainTab: (value) => {
                currentMainTab = value;
            },
            setActiveGroupId: () => { },
            setActiveGroupIdByMainTab: () => { },
            normalizeGroupTabState: () => { },
            isMultiTab: () => currentMainTab === "multi",
            isFixedTimeTab: () => currentMainTab === "fixed-time",
            setIsRealtime: (value) => {
                realtime = !!value;
            },
            getIsRealtime: () => realtime,
            syncRealtimeNow: () => calls.push("syncRealtimeNow"),
            getSlotCount: () => 3,
            getShowCopyFormat: () => false,
            getShowTimeline: () => true,
            renderTimelineFrame: () => calls.push("renderTimelineFrame"),
            renderList: () => calls.push("renderList"),
            updateTimeAdjustPanel: () => calls.push("updateTimeAdjustPanel"),
            renderCopyFormatControls: () => calls.push("renderCopyFormatControls"),
            savePersistence: () => calls.push("savePersistence"),
            renderGroups: () => calls.push("renderGroups"),
            renderMultiSubgroups: () => calls.push("renderMultiSubgroups"),
            refreshMultiRangeControls: () => { }
        });

        service.switchMainTab("live");
        expect(realtime).toBe(true);
        expect(extraToggle.disabled).toBe(true);
        expect(extraToggle.checked).toBe(false);
        expect(calls).toContain("syncRealtimeNow");
        expect(calls).toContain("renderList");
        expect(calls).toContain("updateTimeAdjustPanel");
        expect(groupTabsContainer.style.display).toBe("flex");
        expect(topControlBar.style.display).toBe("flex");

        calls.length = 0;
        service.switchMainTab("calc");
        expect(realtime).toBe(false);
        expect(calcSection.classList.has("active")).toBe(true);
        expect(groupTabsContainer.style.display).toBe("none");
        expect(topControlBar.style.display).toBe("none");
    });

    it("warns and recovers when dependency throws inside switch flow", () => {
        const warnings = [];
        const consoleStub = {
            warn(...args) {
                warnings.push(args);
            }
        };
        const module = loadTabUiModule({
            console: consoleStub,
            noWindow: true,
            document: {
                getElementById() {
                    return null;
                },
                querySelectorAll() {
                    return [];
                }
            }
        });
        const service = module.createService({
            sanitizeMainTab: () => {
                throw new Error("sanitize failed");
            },
            getCurrentMainTab: () => "live",
            getActiveGroupId: () => 0,
            getActiveGroupIdByMainTab: () => ({ live: 0, fixed: 0 })
        });

        expect(() => service.switchMainTab("fixed-time")).not.toThrow();
        expect(warnings.length).toBeGreaterThan(0);
        expect(String(warnings[0][0])).toContain("Dependency");
    });
});
