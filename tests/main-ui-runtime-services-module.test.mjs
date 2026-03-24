import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-ui-runtime-services.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainUiRuntimeServicesModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainUiRuntimeServices", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainUiRuntimeServices || globalThis.GTVMainUiRuntimeServices;
}

describe("GTV main ui runtime services module", () => {
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
    it("creates timeline/fixed-time/ui-init services and binds settings handlers", () => {
        const moduleApi = loadMainUiRuntimeServicesModule();
        let timelineConfig = null;
        let fixedTableConfig = null;
        let uiInitConfig = null;
        let transferBound = 0;
        let resetBound = 0;

        const services = moduleApi.createService({
            GTV_TIMELINE_FRAME: {
                createService: (cfg) => {
                    timelineConfig = cfg;
                    return { id: "timeline" };
                }
            },
            GTV_FIXED_TIME_TABLE: {
                createService: (cfg) => {
                    fixedTableConfig = cfg;
                    return { id: "fixed-table" };
                }
            },
            GTV_MAIN_UI_INIT: {
                createService: (cfg) => {
                    uiInitConfig = cfg;
                    return { id: "ui-init" };
                }
            },
            TIMELINE_TOTAL_HOURS: 24,
            TIMELINE_TOTAL_SECONDS: 86400,
            requestUiFrame: () => {},
            cancelUiFrame: () => {},
            t: (key) => key,
            getCurrentMainTab: () => "live",
            getShowTimeline: () => true,
            isMultiTab: () => false,
            isFixedTimeTab: () => false,
            getIsRealtime: () => true,
            getSlotCount: () => 1,
            getGlobalTime: () => new Date(),
            setGlobalTime: () => {},
            getBaseTimezoneRef: () => ({ id: "utc" }),
            getCurrentGroupZones: () => [],
            isCurrentGroupUtcRowVisible: () => true,
            getCurrentGroupUtcRowOrder: () => 0,
            getUTCRef: () => ({ id: "utc" }),
            resolveFixedTimeTimelineSourceDate: () => new Date(),
            applyFixedTimeSlotTimelineRatio: () => true,
            getFixedTimeTimelineSlots: () => [],
            getFixedTimeTimelineSlotCount: () => 1,
            getFixedTimeTimelineIndicatorToken: () => "tok",
            getFixedTimeSlotTimelineLabel: () => "label",
            getZoneDisplayName: () => "UTC",
            getFixedOffsetForDisplayAtDate: () => "+00:00",
            getLocalPartsByTimezone: () => ({}),
            getUTCDateFromLocalParts: () => new Date(),
            clampNumber: (v) => v,
            pad: (v) => String(v).padStart(2, "0"),
            getCurrentLang: () => "en",
            getCurrentTheme: () => "dark",
            updateClocks: () => {},
            savePersistence: () => {},
            getTimelineFrameElement: () => ({ id: "timeline-frame" }),
            getCurrentGroup: () => null,
            ensureGroupFixedTimes: () => {},
            getFixedTimeDisplayPartsEnabled: () => ({}),
            getDisplayFormatOrder: () => [],
            getDisplayFormatEnabled: () => ({}),
            sanitizeCopyFormatOrderForContext: (v) => v,
            sanitizeCopyFormatEnabledForContext: (v) => v,
            getRenderableTimezoneRows: () => [],
            resolveFixedTimeSlotUtcDate: () => new Date(),
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
            getUiScale: () => 1,
            applyUiScale: () => {},
            getMultiRangeCount: () => 1,
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
            getSlotCountState: () => 1,
            setSlotCount: () => {},
            activateFormatProfileForCurrentContext: () => {},
            renderList: () => {},
            renderCopyFormatControls: () => {},
            updateCopyFormatPreview: () => {},
            getShowCopyFormat: () => false,
            setShowCopyFormat: () => {},
            setShowTimeline: () => {},
            renderTimelineFrame: () => {},
            resetDisplayFormatForActiveContext: () => {},
            resetCopyFormatForActiveContext: () => {},
            applyCurrentGroupBaseTimezoneId: () => {},
            addGroup: () => {},
            addMultiSubgroup: () => {},
            copyAllTimezones: () => {},
            saveTimezoneTableImage: () => {},
            saveMultiRangeTitlesImage: () => {},
            getUiSettingsActionsService: () => ({
                bindTransferControls: () => { transferBound += 1; },
                bindResetControls: () => { resetBound += 1; }
            }),
            getCurrentThemeState: () => "dark",
            applyTheme: () => {},
            refreshCalculator: () => {},
            getCurrentLangState: () => "en",
            hideFloatingTooltip: () => {},
            setLanguage: () => {},
            localizeAutoGeneratedNamesForCurrentLanguage: () => false,
            applyVersionBranding: () => {},
            updateTZDropdown: () => {},
            renderGroups: () => {},
            renderMultiSubgroups: () => {},
            updateTimeAdjustPanel: () => {},
            refreshSelectWidths: () => {},
            renderBaseTimeSelect: () => {},
            updateOptionRowVisibility: () => {}
        });

        expect(services.timelineFrameService.id).toBe("timeline");
        expect(services.fixedTimeTableService.id).toBe("fixed-table");
        expect(services.mainUiInitService.id).toBe("ui-init");
        expect(typeof timelineConfig.getTimelineFrameElement).toBe("function");
        expect(typeof fixedTableConfig.getRenderableTimezoneRows).toBe("function");

        uiInitConfig.bindTransferControls();
        uiInitConfig.bindResetControls();
        expect(transferBound).toBe(1);
        expect(resetBound).toBe(1);
    });

    it("throws when required module APIs are missing", () => {
        const moduleApi = loadMainUiRuntimeServicesModule();
        expect(() => moduleApi.createService({})).toThrow("Missing required module API: GTVTimelineFrame.createService");
    });
});
