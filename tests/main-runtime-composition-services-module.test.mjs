import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-composition-services.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeCompositionServicesModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainRuntimeCompositionServices", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainRuntimeCompositionServices || globalThis.GTVMainRuntimeCompositionServices;
}

describe("GTV main runtime composition services module", () => {
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
    it("composes ui runtime and clock services with service-driven adapters", () => {
        const moduleApi = loadMainRuntimeCompositionServicesModule();
        let uiRuntimeConfig = null;
        let clockConfig = null;
        let saveCount = 0;
        let copyControlCount = 0;
        let addGroupCount = 0;
        let addSubgroupCount = 0;
        let renderGroupsCount = 0;
        let renderMultiSubgroupsCount = 0;
        let rangeRenderCount = 0;
        let tzDropdownCount = 0;
        let adjustPanelCount = 0;
        let optionVisibilityCount = 0;
        let calculatorRefreshCount = 0;
        let languageCalls = [];

        const service = moduleApi.createService({
            GTV_MAIN_UI_RUNTIME_SERVICES: {
                createService: (config) => {
                    uiRuntimeConfig = config;
                    return {
                        timelineFrameService: { id: "timeline" },
                        fixedTimeTableService: { id: "fixed" },
                        mainUiInitService: { id: "ui-init" }
                    };
                }
            },
            GTV_MAIN_CLOCK_ORCHESTRATOR_SERVICES: {
                createService: (config) => {
                    clockConfig = config;
                    return { id: "clock" };
                }
            },
            moduleDeps: {
                GTV_TIMELINE_FRAME: {},
                GTV_FIXED_TIME_TABLE: {},
                GTV_MAIN_UI_INIT: {}
            },
            timelineConfig: {
                TIMELINE_TOTAL_HOURS: 24,
                TIMELINE_TOTAL_SECONDS: 86400,
                requestUiFrame: () => {},
                cancelUiFrame: () => {}
            },
            state: {
                getCurrentMainTab: () => "live",
                getIsRealtime: () => true,
                getSlotCount: () => 1,
                getGlobalTime: () => new Date(0),
                setGlobalTime: () => {},
                getCurrentLang: () => "en",
                getCurrentTheme: () => "dark",
                getUiScale: () => 1,
                getMultiRangeCount: () => 1,
                getShowCopyFormat: () => true,
                setShowCopyFormat: () => {},
                getShowTimeline: () => true,
                setShowTimeline: () => {},
                getSlotCountState: () => 1,
                setSlotCount: () => {}
            },
            services: {
                getPersistenceService: () => ({
                    savePersistence: () => { saveCount += 1; }
                }),
                getTableRenderService: () => ({
                    getRenderableTimezoneRows: () => ["row-a", "row-b"]
                }),
                getFormatControlsService: () => ({
                    renderCopyFormatControls: () => { copyControlCount += 1; }
                }),
                getGroupTabsService: () => ({
                    addGroup: () => { addGroupCount += 1; },
                    addMultiSubgroup: () => { addSubgroupCount += 1; },
                    renderGroups: () => { renderGroupsCount += 1; },
                    renderMultiSubgroups: () => { renderMultiSubgroupsCount += 1; }
                }),
                getMultiRangeRenderService: () => ({
                    renderMultiRanges: () => { rangeRenderCount += 1; }
                }),
                getTimezoneSearchService: () => ({
                    updateTZDropdown: () => { tzDropdownCount += 1; }
                }),
                getTimeAdjustUiService: () => ({
                    updateTimeAdjustPanel: () => { adjustPanelCount += 1; }
                }),
                getTabUiService: () => ({
                    updateOptionRowVisibility: () => { optionVisibilityCount += 1; }
                }),
                getUiSettingsActionsService: () => ({ id: "settings-actions" })
            },
            actions: {
                t: (key) => key,
                isMultiTab: () => false,
                isFixedTimeTab: () => false,
                getBaseTimezoneRef: () => ({ id: "utc" }),
                getCurrentGroupZones: () => [],
                isCurrentGroupUtcRowVisible: () => true,
                getCurrentGroupUtcRowOrder: () => 0,
                getUTCRef: () => ({ id: "utc" }),
                resolveFixedTimeTimelineSourceDate: () => new Date(0),
                applyFixedTimeSlotTimelineRatio: () => true,
                getFixedTimeTimelineSlots: () => [],
                getFixedTimeTimelineSlotCount: () => 1,
                getFixedTimeTimelineIndicatorToken: () => "tok",
                getFixedTimeSlotTimelineLabel: () => "label",
                getZoneDisplayName: () => "UTC",
                getFixedOffsetForDisplayAtDate: () => 0,
                getLocalPartsByTimezone: () => ({}),
                getUTCDateFromLocalParts: () => new Date(0),
                clampNumber: (value) => value,
                pad: (value) => String(value),
                updateClocks: () => {},
                getCurrentGroup: () => null,
                ensureGroupFixedTimes: () => {},
                getFixedTimeDisplayPartsEnabled: () => ({}),
                getDisplayFormatOrder: () => [],
                getDisplayFormatEnabled: () => ({}),
                sanitizeCopyFormatOrderForContext: (value) => value,
                sanitizeCopyFormatEnabledForContext: (value) => value,
                resolveFixedTimeSlotUtcDate: () => new Date(0),
                getFixedTimeTimelineIndicatorColor: () => "#fff",
                getFixedTimeSlotHeaderLabel: () => "slot",
                renameFixedTimeSlot: () => {},
                copyFixedTimeSlotColumn: () => {},
                getZoneAbbreviation: () => "UTC",
                formatUtcOffsetLabel: () => "UTC+00:00",
                getCustomOffsetMinutes: () => 0,
                getTimezoneOffset: () => 0,
                buildFixedTimeDisplayPayloadAtUtc: () => ({}),
                bindCustomDatePickerForInput: () => {},
                buildFixedTimeCellInputValue: () => "",
                applyFixedTimeSlotByTimezoneInput: () => true,
                copyFixedTimeCellByTimezone: () => {},
                upgradeNativeTitleTooltips: () => {},
                switchMainTab: () => {},
                populateUiScaleSelect: () => {},
                applyUiScale: () => {},
                setMultiRangeCount: () => {},
                refreshMultiRangeControls: () => {},
                getFixedTimeSlotCountForCurrentGroup: () => 1,
                setFixedTimeSlotCount: () => {},
                refreshFixedTimeSlotCountControls: () => {},
                setCurrentGroupFixedDate: () => {},
                sanitizeFixedDateValue: () => "",
                showToast: () => {},
                normalizeCustomAbbr: () => "",
                addTimezone: () => {},
                createUniqueTimezoneId: () => "tz-1",
                syncActiveFormatProfileFromState: () => {},
                activateFormatProfileForCurrentContext: () => {},
                renderList: () => {},
                updateCopyFormatPreview: () => {},
                renderTimelineFrame: () => {},
                resetDisplayFormatForActiveContext: () => {},
                resetCopyFormatForActiveContext: () => {},
                applyCurrentGroupBaseTimezoneId: () => {},
                copyAllTimezones: () => {},
                saveTimezoneTableImage: () => {},
                saveMultiRangeTitlesImage: () => {},
                applyTheme: () => {},
                hideFloatingTooltip: () => {},
                localizeAutoGeneratedNamesForCurrentLanguage: () => false,
                applyVersionBranding: () => {},
                refreshSelectWidths: () => {},
                renderBaseTimeSelect: () => {},
                updateRow: () => {},
                renderFixedTimeTab: () => {}
            },
            environment: {
                getDocumentRef: () => ({
                    getElementById: (id) => ({ id })
                }),
                getWindowRef: () => ({
                    __gtvCalcRefresh: () => { calculatorRefreshCount += 1; }
                }),
                getGlobalThisRef: () => ({
                    setLanguage: (lang) => { languageCalls.push(lang); }
                })
            }
        });

        expect(service.timelineFrameService.id).toBe("timeline");
        expect(service.fixedTimeTableService.id).toBe("fixed");
        expect(service.mainUiInitService.id).toBe("ui-init");
        expect(service.mainClockOrchestratorService.id).toBe("clock");

        uiRuntimeConfig.savePersistence();
        uiRuntimeConfig.renderCopyFormatControls();
        uiRuntimeConfig.addGroup();
        uiRuntimeConfig.addMultiSubgroup();
        uiRuntimeConfig.renderGroups();
        uiRuntimeConfig.renderMultiSubgroups();
        uiRuntimeConfig.updateTZDropdown();
        uiRuntimeConfig.updateTimeAdjustPanel();
        uiRuntimeConfig.updateOptionRowVisibility();
        uiRuntimeConfig.refreshCalculator();
        uiRuntimeConfig.setLanguage("ko");
        expect(uiRuntimeConfig.getTimelineFrameElement().id).toBe("timeline-frame");
        expect(uiRuntimeConfig.getRenderableTimezoneRows()).toEqual(["row-a", "row-b"]);
        expect(uiRuntimeConfig.getUiSettingsActionsService().id).toBe("settings-actions");

        clockConfig.renderMultiRanges();
        expect(clockConfig.isShowCopyFormat()).toBe(true);

        expect(saveCount).toBe(1);
        expect(copyControlCount).toBe(1);
        expect(addGroupCount).toBe(1);
        expect(addSubgroupCount).toBe(1);
        expect(renderGroupsCount).toBe(1);
        expect(renderMultiSubgroupsCount).toBe(1);
        expect(tzDropdownCount).toBe(1);
        expect(adjustPanelCount).toBe(1);
        expect(optionVisibilityCount).toBe(1);
        expect(calculatorRefreshCount).toBe(1);
        expect(languageCalls).toEqual(["ko"]);
        expect(rangeRenderCount).toBe(1);
    });

    it("throws when required module APIs are missing", () => {
        const moduleApi = loadMainRuntimeCompositionServicesModule();
        expect(() => moduleApi.createService({})).toThrow("Missing required module API: GTVMainUiRuntimeServices.createService");
    });
});
