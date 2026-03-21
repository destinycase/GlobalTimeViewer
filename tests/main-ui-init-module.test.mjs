import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-ui-init.js");

function loadMainUiInitModule(options = {}) {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = {
        window: {},
        globalThis: {},
        document: options.document || {
            getElementById() { return null; },
            addEventListener() { },
            querySelectorAll() { return []; }
        },
        MutationObserver: class {
            observe() {}
            disconnect() {}
        },
        console
    };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/main-ui-init.js" });
    return sandbox.window.GTVMainUiInit || sandbox.GTVMainUiInit || sandbox.globalThis.GTVMainUiInit;
}

describe("GTV main ui init module", () => {
    it("gracefully runs even when DOM elements are completely missing from HTML", () => {
        // Provide an completely empty DOM stub
        const documentStub = {
            getElementById() { return null; },
            querySelectorAll() { return []; },
            addEventListener() { }
        };
        const moduleApi = loadMainUiInitModule({ document: documentStub });
        
        const service = moduleApi.createService({
            getUiSettingsActionsService: () => ({
                bindTransferControls: () => {},
                bindResetControls: () => {}
            }),
            switchMainTab: () => {},
            hideFloatingTooltip: () => {},
            syncActiveFormatProfileFromState: () => {},
            activateFormatProfileForCurrentContext: () => {},
            renderList: () => {},
            renderCopyFormatControls: () => {},
            updateCopyFormatPreview: () => {},
            refreshCalculator: () => {},
            updateTZDropdown: () => {},
            renderGroups: () => {},
            renderMultiSubgroups: () => {},
            populateUiScaleSelect: () => {},
            applyUiScale: () => {},
            applyTheme: () => {},
            refreshSelectWidths: () => {},
            updateOptionRowVisibility: () => {},
            renderBaseTimeSelect: () => {},
            updateTimeAdjustPanel: () => {},
            renderTimelineFrame: () => {},
            upgradeNativeTitleTooltips: () => {},
            bindTransferControls: () => {},
            bindResetControls: () => {},
            refreshMultiRangeControls: () => {},
            refreshFixedTimeSlotCountControls: () => {},
            getUiScale: () => 1,
            getCurrentTheme: () => "dark",
            getCurrentLang: () => "ko",
            getShowTimeline: () => true,
            getShowCopyFormat: () => false,
            getSlotCount: () => 1
        });

        // Test initUI method which attaches numerous event listeners
        service.initUI();
    });

    it("attaches events correctly ONLY to elements that exist", () => {
        const attachedEvents = [];
        
        const clickMockNode = {
            dataset: { tab: "live" },
            style: {},
            value: "100",
            closest() { return { style: {} }; },
            addEventListener(type, handler) {
                attachedEvents.push({ type, handler, node: "someButton" });
            }
        };

        const documentStub = {
            getElementById(id) {
                if (id === "add-timezone-btn" || id === "add-group-btn" || id === "copy-all-btn") return clickMockNode;
                return null;
            },
            querySelectorAll(selector) {
                if (selector === ".nav-item") return [clickMockNode];
                if (selector === ".info-tip") return [clickMockNode];
                return [];
            },
            addEventListener(type, handler) {
                attachedEvents.push({ type, handler, node: "document" });
            }
        };

        const moduleApi = loadMainUiInitModule({ document: documentStub });
        const service = moduleApi.createService({
            switchMainTab: () => {},
            getUiSettingsActionsService: () => ({
                bindTransferControls: () => {},
                bindResetControls: () => {}
            }),
            addTimezone: () => "addTimezone",
            addGroup: () => "addGroup",
            copyAllTimezones: () => {},
            updateTimeAdjustPanel: () => {},
            refreshSelectWidths: () => {},
            renderBaseTimeSelect: () => {},
            updateOptionRowVisibility: () => {},
            refreshMultiRangeControls: () => {},
            refreshFixedTimeSlotCountControls: () => {},
            getUiScale: () => 1,
            getCurrentTheme: () => "dark",
            getCurrentLang: () => "ko",
            getShowTimeline: () => true,
            getShowCopyFormat: () => false,
            getSlotCount: () => 1,
            bindTransferControls: () => {},
            bindResetControls: () => {},
            renderTimelineFrame: () => {},
            upgradeNativeTitleTooltips: () => {},
            renderCopyFormatControls: () => {}
        });

        expect(() => {
            service.initUI();
        }).not.toThrow();

        // Should have attached at least to our mocked node
        const clickEvents = attachedEvents.filter(e => e.type === "click" && e.node === "someButton");
        expect(clickEvents.length).toBeGreaterThan(0);
        
        // Execute the handler to ensure it doesn't crash
        expect(() => clickEvents[0].handler({ preventDefault: () => {}, stopPropagation: () => {} })).not.toThrow();
    });
});
