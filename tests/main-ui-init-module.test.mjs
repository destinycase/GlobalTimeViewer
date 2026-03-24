import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-ui-init.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainUiInitModule(options = {}) {
    const globalPatches = {
        window: {},
        document: options.document || {
            getElementById() { return null; },
            addEventListener() { },
            querySelectorAll() { return []; }
        },
        MutationObserver: options.MutationObserver || class {
            observe() {}
            disconnect() {}
        },
        console
    };
    const keys = ["window", "document", "MutationObserver", "console", "GTVMainUiInit", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainUiInit || globalThis.GTVMainUiInit;
}

describe("GTV main ui init module", () => {
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
