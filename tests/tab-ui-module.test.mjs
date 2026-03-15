import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "tab-ui.js");

function loadTabUiModule(options = {}) {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = {
        window: {},
        globalThis: {},
        document: options.document || {
            getElementById() {
                return null;
            },
            querySelectorAll() {
                return [];
            }
        },
        console
    };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/tab-ui.js" });
    return sandbox.window.GTVTabUI || sandbox.GTVTabUI || sandbox.globalThis.GTVTabUI;
}

describe("GTV tab UI module", () => {
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
});
