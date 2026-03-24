import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-ui-init.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function createNode({ id = "", value = "", checked = false, dataset = {} } = {}) {
    const handlers = new Map();
    const children = [];
    const node = {
        id,
        value,
        checked,
        dataset,
        style: {},
        children,
        blurCallCount: 0,
        addEventListener(type, handler) {
            const key = String(type);
            if (!handlers.has(key)) handlers.set(key, []);
            handlers.get(key).push(handler);
        },
        appendChild(child) {
            children.push(child);
            return child;
        },
        blur() {
            this.blurCallCount += 1;
        },
        async dispatch(type, event = {}) {
            const key = String(type);
            const list = handlers.get(key) || [];
            const payload = {
                target: node,
                preventDefault() {},
                stopPropagation() {},
                ...event
            };
            for (const handler of list) {
                await handler(payload);
            }
        }
    };
    return node;
}

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

    it("executes major UI event branches with populated element stubs", async () => {
        const calls = {
            switchTabs: [],
            uiScaleApplied: [],
            multiRangeCount: [],
            fixedSlotCount: [],
            fixedDate: [],
            toasts: [],
            addTimezone: [],
            setSlotCount: [],
            setShowCopyFormat: [],
            setShowTimeline: [],
            baseTimezone: [],
            theme: [],
            language: [],
            refreshCalculator: 0,
            renderList: 0,
            savePersistence: 0,
            bindTransferControls: 0,
            bindResetControls: 0,
            renderTimelineFrame: 0,
            renderCopyFormatControls: 0,
            refreshMultiRangeControls: 0,
            refreshFixedTimeSlotCountControls: 0,
            applyVersionBranding: 0,
            updateTZDropdown: 0,
            renderGroups: 0,
            renderMultiSubgroups: 0,
            updateTimeAdjustPanel: 0,
            refreshSelectWidths: 0,
            renderBaseTimeSelect: 0,
            updateOptionRowVisibility: 0,
            upgradeNativeTitleTooltips: 0,
            hideFloatingTooltip: 0
        };

        let uiScale = 1.0;
        let multiRangeCount = 3;
        let fixedSlotCount = 2;
        let slotCount = 1;
        let showCopyFormat = false;
        let showTimeline = true;
        let currentTheme = "dark";
        let currentLang = "ko";
        let currentGroup = { fixedDate: "2026-01-02" };
        const addResults = [false, true];
        const navLive = createNode({ dataset: { tab: "live" } });
        const navMulti = createNode({ dataset: { tab: "multi" } });
        const infoTip = createNode();

        const uiScaleSelect = createNode({ id: "ui-scale-select", value: "100" });
        const multiRangeCountInput = createNode({ id: "multi-range-count-input", value: "1a2" });
        const multiRangeDecreaseBtn = createNode({ id: "multi-range-count-decrease" });
        const multiRangeIncreaseBtn = createNode({ id: "multi-range-count-increase" });
        const fixedTimeSlotCountInput = createNode({ id: "fixed-time-slot-count-input", value: "5x" });
        const fixedTimeSlotDecreaseBtn = createNode({ id: "fixed-time-slot-count-decrease" });
        const fixedTimeSlotIncreaseBtn = createNode({ id: "fixed-time-slot-count-increase" });
        const fixedTimeDateInput = createNode({ id: "fixed-time-date-input", value: "" });
        const fixedTimeDateTrigger = createNode({ id: "fixed-time-date-trigger" });
        const customOffH = createNode({ id: "custom-off-h", value: "0" });
        const customOffM = createNode({ id: "custom-off-m", value: "30" });
        const extraTimeToggle = createNode({ id: "toggle-extra-time", checked: false });
        const copyFormatToggle = createNode({ id: "toggle-copy-format", checked: false });
        const timelineToggle = createNode({ id: "toggle-timeline", checked: true });
        const displayFormatResetBtn = createNode({ id: "display-format-reset-btn" });
        const copyFormatResetBtn = createNode({ id: "copy-format-reset-btn" });
        const baseTimeSelect = createNode({ id: "base-time-select", value: "utc" });
        const addCustomBtn = createNode({ id: "add-custom-btn" });
        const customAbbr = createNode({ id: "custom-abbr", value: " ab " });
        const customName = createNode({ id: "custom-name", value: "" });
        const addGroupBtn = createNode({ id: "add-group-btn" });
        const addMultiSubgroupBtn = createNode({ id: "add-multi-subgroup-btn" });
        const copyAllBtn = createNode({ id: "copy-all-btn" });
        const saveTableImageBtn = createNode({ id: "save-table-image-btn" });
        const saveMultiRangeTitlesImageBtn = createNode({ id: "save-multi-range-titles-image-btn" });
        const themeSelect = createNode({ id: "theme-select", value: "dark" });
        const langSelect = createNode({ id: "lang-select", value: "ko" });

        const elementsById = new Map([
            ["ui-scale-select", uiScaleSelect],
            ["multi-range-count-input", multiRangeCountInput],
            ["multi-range-count-decrease", multiRangeDecreaseBtn],
            ["multi-range-count-increase", multiRangeIncreaseBtn],
            ["fixed-time-slot-count-input", fixedTimeSlotCountInput],
            ["fixed-time-slot-count-decrease", fixedTimeSlotDecreaseBtn],
            ["fixed-time-slot-count-increase", fixedTimeSlotIncreaseBtn],
            ["fixed-time-date-input", fixedTimeDateInput],
            ["fixed-time-date-trigger", fixedTimeDateTrigger],
            ["custom-off-h", customOffH],
            ["custom-off-m", customOffM],
            ["toggle-extra-time", extraTimeToggle],
            ["toggle-copy-format", copyFormatToggle],
            ["toggle-timeline", timelineToggle],
            ["display-format-reset-btn", displayFormatResetBtn],
            ["copy-format-reset-btn", copyFormatResetBtn],
            ["base-time-select", baseTimeSelect],
            ["add-custom-btn", addCustomBtn],
            ["custom-abbr", customAbbr],
            ["custom-name", customName],
            ["add-group-btn", addGroupBtn],
            ["add-multi-subgroup-btn", addMultiSubgroupBtn],
            ["copy-all-btn", copyAllBtn],
            ["save-table-image-btn", saveTableImageBtn],
            ["save-multi-range-titles-image-btn", saveMultiRangeTitlesImageBtn],
            ["theme-select", themeSelect],
            ["lang-select", langSelect]
        ]);

        const documentStub = {
            getElementById(id) {
                return elementsById.get(id) || null;
            },
            querySelectorAll(selector) {
                if (selector === ".nav-item") return [navLive, navMulti];
                if (selector === ".info-tip") return [infoTip];
                return [];
            },
            createElement(tagName) {
                return createNode({ id: String(tagName || "").toLowerCase() });
            },
            addEventListener() {}
        };

        const moduleApi = loadMainUiInitModule({ document: documentStub });
        const service = moduleApi.createService({
            t: (key) => key,
            switchMainTab: (tab) => calls.switchTabs.push(tab),
            populateUiScaleSelect: () => {},
            getUiScale: () => uiScale,
            applyUiScale: (value) => {
                uiScale = Number(value) / 100;
                calls.uiScaleApplied.push(String(value));
            },
            getMultiRangeCount: () => multiRangeCount,
            setMultiRangeCount: (value) => {
                calls.multiRangeCount.push(value);
                const parsed = Number(value);
                if (Number.isFinite(parsed)) multiRangeCount = parsed;
            },
            refreshMultiRangeControls: () => {
                calls.refreshMultiRangeControls += 1;
            },
            getFixedTimeSlotCountForCurrentGroup: () => fixedSlotCount,
            setFixedTimeSlotCount: (value) => {
                calls.fixedSlotCount.push(value);
                const parsed = Number(value);
                if (Number.isFinite(parsed)) fixedSlotCount = parsed;
            },
            refreshFixedTimeSlotCountControls: () => {
                calls.refreshFixedTimeSlotCountControls += 1;
            },
            bindCustomDatePickerForInput: () => {},
            getCurrentGroup: () => currentGroup,
            ensureGroupFixedTimes: () => {},
            setCurrentGroupFixedDate: (value) => {
                calls.fixedDate.push(value);
                if (!currentGroup) return false;
                if (value === "2026-01-04") {
                    currentGroup.fixedDate = "2026-01-05";
                    return false;
                }
                currentGroup.fixedDate = value;
                return true;
            },
            sanitizeFixedDateValue: (rawInput) => (rawInput === "bad-date" ? "" : rawInput),
            showToast: (message) => calls.toasts.push(message),
            normalizeCustomAbbr: (value) => String(value || "").trim().toUpperCase(),
            addTimezone: (payload) => {
                calls.addTimezone.push(payload);
                return addResults.shift() ?? true;
            },
            createUniqueTimezoneId: () => "tz-c-1",
            syncActiveFormatProfileFromState: () => {},
            getSlotCount: () => slotCount,
            setSlotCount: (value) => {
                slotCount = value;
                calls.setSlotCount.push(value);
            },
            activateFormatProfileForCurrentContext: () => {},
            renderList: () => {
                calls.renderList += 1;
            },
            renderCopyFormatControls: () => {
                calls.renderCopyFormatControls += 1;
            },
            updateCopyFormatPreview: () => {},
            savePersistence: () => {
                calls.savePersistence += 1;
            },
            getShowCopyFormat: () => showCopyFormat,
            setShowCopyFormat: (value) => {
                showCopyFormat = value;
                calls.setShowCopyFormat.push(value);
            },
            getShowTimeline: () => showTimeline,
            setShowTimeline: (value) => {
                showTimeline = value;
                calls.setShowTimeline.push(value);
            },
            renderTimelineFrame: () => {
                calls.renderTimelineFrame += 1;
            },
            resetDisplayFormatForActiveContext: () => {},
            resetCopyFormatForActiveContext: () => {},
            applyCurrentGroupBaseTimezoneId: (value) => {
                calls.baseTimezone.push(value);
            },
            addGroup: () => {},
            addMultiSubgroup: () => {},
            copyAllTimezones: () => {},
            saveTimezoneTableImage: () => {},
            saveMultiRangeTitlesImage: () => {},
            bindTransferControls: () => {
                calls.bindTransferControls += 1;
            },
            getCurrentTheme: () => currentTheme,
            applyTheme: async (theme) => {
                currentTheme = theme;
                calls.theme.push(theme);
            },
            refreshCalculator: () => {
                calls.refreshCalculator += 1;
            },
            getCurrentLang: () => currentLang,
            hideFloatingTooltip: () => {
                calls.hideFloatingTooltip += 1;
            },
            setLanguage: (lang) => {
                currentLang = lang;
                calls.language.push(lang);
            },
            localizeAutoGeneratedNamesForCurrentLanguage: () => true,
            applyVersionBranding: () => {
                calls.applyVersionBranding += 1;
            },
            updateTZDropdown: () => {
                calls.updateTZDropdown += 1;
            },
            renderGroups: () => {
                calls.renderGroups += 1;
            },
            renderMultiSubgroups: () => {
                calls.renderMultiSubgroups += 1;
            },
            updateTimeAdjustPanel: () => {
                calls.updateTimeAdjustPanel += 1;
            },
            refreshSelectWidths: () => {
                calls.refreshSelectWidths += 1;
            },
            bindResetControls: () => {
                calls.bindResetControls += 1;
            },
            renderBaseTimeSelect: () => {
                calls.renderBaseTimeSelect += 1;
            },
            updateOptionRowVisibility: () => {
                calls.updateOptionRowVisibility += 1;
            },
            upgradeNativeTitleTooltips: () => {
                calls.upgradeNativeTitleTooltips += 1;
            }
        });

        service.initUI();

        expect(calls.refreshMultiRangeControls).toBe(1);
        expect(calls.refreshFixedTimeSlotCountControls).toBe(1);
        expect(calls.bindTransferControls).toBe(1);
        expect(calls.bindResetControls).toBe(1);
        expect(calls.renderBaseTimeSelect).toBe(1);
        expect(calls.upgradeNativeTitleTooltips).toBe(1);
        expect(customOffH.children.length).toBe(27);

        await navLive.dispatch("click");
        await navMulti.dispatch("click");
        expect(calls.switchTabs).toEqual(["live", "multi"]);

        uiScaleSelect.value = "125";
        await uiScaleSelect.dispatch("change");
        expect(calls.uiScaleApplied).toEqual(["125"]);
        expect(uiScaleSelect.value).toBe("125");

        await multiRangeCountInput.dispatch("input");
        expect(multiRangeCountInput.value).toBe("12");
        await multiRangeCountInput.dispatch("change");
        await multiRangeCountInput.dispatch("blur");
        await multiRangeCountInput.dispatch("keydown", { key: "Escape" });
        await multiRangeCountInput.dispatch("keydown", { key: "Enter" });
        expect(multiRangeCountInput.blurCallCount).toBe(1);
        await multiRangeDecreaseBtn.dispatch("click");
        await multiRangeIncreaseBtn.dispatch("click");
        expect(calls.multiRangeCount.length).toBeGreaterThanOrEqual(5);

        await fixedTimeSlotCountInput.dispatch("input");
        expect(fixedTimeSlotCountInput.value).toBe("5");
        await fixedTimeSlotCountInput.dispatch("change");
        await fixedTimeSlotCountInput.dispatch("blur");
        await fixedTimeSlotCountInput.dispatch("keydown", { key: "Enter" });
        expect(fixedTimeSlotCountInput.blurCallCount).toBe(1);
        await fixedTimeSlotDecreaseBtn.dispatch("click");
        await fixedTimeSlotIncreaseBtn.dispatch("click");
        expect(calls.fixedSlotCount.length).toBeGreaterThanOrEqual(5);

        currentGroup = null;
        fixedTimeDateInput.value = "2026-01-01";
        await fixedTimeDateInput.dispatch("change");

        currentGroup = { fixedDate: "2026-01-02" };
        fixedTimeDateInput.value = "";
        await fixedTimeDateInput.dispatch("change");
        expect(currentGroup.fixedDate).toBe("");
        fixedTimeDateInput.value = "bad-date";
        await fixedTimeDateInput.dispatch("blur");
        expect(calls.toasts.includes("toast_invalid_date")).toBe(true);
        expect(fixedTimeDateInput.value).toBe("");

        fixedTimeDateInput.value = "2026-01-03";
        await fixedTimeDateInput.dispatch("keydown", { key: "Enter" });
        expect(fixedTimeDateInput.value).toBe("2026-01-03");
        expect(fixedTimeDateInput.blurCallCount).toBe(1);

        fixedTimeDateInput.value = "2026-01-04";
        await fixedTimeDateInput.dispatch("change");
        expect(fixedTimeDateInput.value).toBe("2026-01-05");

        extraTimeToggle.checked = true;
        await extraTimeToggle.dispatch("change");
        expect(calls.setSlotCount.includes(2)).toBe(true);

        copyFormatToggle.checked = true;
        await copyFormatToggle.dispatch("change");
        timelineToggle.checked = false;
        await timelineToggle.dispatch("change");
        expect(calls.setShowCopyFormat).toEqual([true]);
        expect(calls.setShowTimeline).toEqual([false]);

        await displayFormatResetBtn.dispatch("click");
        await copyFormatResetBtn.dispatch("click");

        baseTimeSelect.value = "tz-a";
        await baseTimeSelect.dispatch("change");
        expect(calls.baseTimezone).toEqual(["tz-a"]);

        customName.value = "";
        await addCustomBtn.dispatch("click");
        expect(calls.toasts.includes("toast_input_name")).toBe(true);

        customName.value = "City";
        await addCustomBtn.dispatch("click");
        expect(customAbbr.value).toBe(" ab ");
        expect(customName.value).toBe("City");
        await addCustomBtn.dispatch("click");
        expect(customAbbr.value).toBe("");
        expect(customName.value).toBe("");
        expect(calls.addTimezone.length).toBe(2);

        await addGroupBtn.dispatch("click");
        await addMultiSubgroupBtn.dispatch("click");
        await copyAllBtn.dispatch("click");
        await saveTableImageBtn.dispatch("click");
        await saveMultiRangeTitlesImageBtn.dispatch("click");

        themeSelect.value = "light";
        await themeSelect.dispatch("change");
        expect(calls.theme).toEqual(["light"]);

        langSelect.value = "en";
        await langSelect.dispatch("change");
        expect(calls.language).toEqual(["en"]);
        expect(calls.hideFloatingTooltip).toBe(1);
        expect(calls.applyVersionBranding).toBe(1);
        expect(calls.updateTZDropdown).toBeGreaterThanOrEqual(1);
        expect(calls.renderGroups).toBeGreaterThanOrEqual(1);
        expect(calls.renderMultiSubgroups).toBeGreaterThanOrEqual(1);
        expect(calls.updateTimeAdjustPanel).toBeGreaterThanOrEqual(2);
        expect(calls.refreshSelectWidths).toBeGreaterThanOrEqual(2);
        expect(calls.refreshCalculator).toBeGreaterThanOrEqual(2);

        let prevented = 0;
        let stopped = 0;
        await infoTip.dispatch("click", {
            preventDefault() { prevented += 1; },
            stopPropagation() { stopped += 1; }
        });
        expect(prevented).toBe(1);
        expect(stopped).toBe(1);
    });
});
