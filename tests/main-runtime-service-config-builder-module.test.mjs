import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-service-config-builder.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimeServiceConfigBuilderModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainRuntimeServiceConfigBuilder", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainRuntimeServiceConfigBuilder || globalThis.GTVMainRuntimeServiceConfigBuilder;
}

describe("GTV main runtime service config builder module", () => {
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

    it("builds select/search/snapshot configs with expected mappings", () => {
        const moduleApi = loadMainRuntimeServiceConfigBuilderModule();
        const builder = moduleApi.createService();
        const deps = {
            getDocumentRefOrNull: () => ({ id: "doc" }),
            getComputedStyleSafely: () => ({ fontSize: "12px" }),
            ensureBaseTimezoneSelection: () => "base-ok",
            getCurrentGroupBaseTimezoneId: () => "base",
            isCurrentGroupUtcRowVisible: () => true,
            getCurrentGroupZones: () => [],
            getZoneAbbreviation: () => "KST",
            getZoneDisplayName: () => "Seoul",
            setCurrentGroupBaseTimezoneId: () => true,
            savePersistenceSafely: () => "saved",
            gtvT: (key) => `t:${key}`,
            TZ_DATABASE: [{ id: "Asia/Seoul" }],
            getZoneMapRef: () => ({ "Asia/Seoul": true }),
            getPatchedCurrentLangState: () => "ko",
            getBetterAbbr: () => "KST+",
            getTimezoneOffset: () => 540,
            getLocalizedTZLabel: () => "UTC+09:00",
            adjustSelectWidthForContent: () => "adjusted",
            getCurrentGroup: () => ({ id: 1 }),
            deferDynamicCall: (getter) => (...args) => getter()(...args),
            getRenderListRef: () => () => "render-list",
            addTimezone: () => "added",
            createUniqueTimezoneId: () => "tz-1",
            DEFAULT_COPY_TIME_PARTS_ENABLED: { date: true },
            MAIN_I18N_DATA: { ko: {}, en: {} },
            getUTCRef: () => "UTC",
            getBaseTimezoneRef: () => "Asia/Seoul",
            getGlobalTimesState: () => [],
            getPatchedSlotCountState: () => 1,
            getIsRealtimeState: () => true,
            getDayNightMarkerByHour: () => "day",
            getFixedOffsetForDisplay: () => "+09:00",
            normalizeCustomAbbr: (v) => v,
            getCustomOffsetMinutes: () => 0,
            pad: () => "09",
            getSignedInclusiveDaySpan: () => 0,
            getSignedDurationDayHourMinute: () => "0d 00:00",
            sanitizeTimePartsEnabled: (v) => v,
            sanitizeCopyFormatOrder: (v) => v,
            timeService: { id: "time-service" }
        };

        const selectConfig = builder.buildMainSelectServicesConfig(deps);
        const searchConfig = builder.buildTimezoneSearchConfig(deps);
        const snapshotConfig = builder.buildSnapshotFormatConfig(deps);

        expect(selectConfig.t("x")).toBe("t:x");
        expect(selectConfig.savePersistence()).toBe("saved");
        expect(searchConfig.renderList()).toBe("render-list");
        expect(searchConfig.createUniqueTimezoneId()).toBe("tz-1");
        expect(snapshotConfig.getCurrentLang()).toBe("ko");
        expect(snapshotConfig.pad()).toBe("09");
        expect(snapshotConfig.timeService).toEqual({ id: "time-service" });
    });

    it("builds runtime UI configs with deferred/bound helpers", () => {
        const moduleApi = loadMainRuntimeServiceConfigBuilderModule();
        const builder = moduleApi.createService();
        const deps = {
            deferDynamicCall: (getter) => (...args) => getter()(...args),
            bindFacadeMethod: (getter, methodName) => (...args) => getter()[methodName](...args),
            getTranslatorRef: () => (key) => `tx:${key}`,
            getShowToastRef: () => (message) => `toast:${message}`,
            getIsRealtimeState: () => false,
            isMultiTab: () => true,
            isMultiRangeStartEditEnabled: () => false,
            isMultiRangeEndEditEnabled: () => false,
            ensureMultiRangeState: () => ({}),
            getPatchedMultiRangesState: () => [],
            getMultiRangeSlotDate: () => null,
            setMultiRangeSlotDate: () => true,
            syncFollowingRangesByDuration: () => {},
            syncMultiRangeStartLinks: () => {},
            parseDateTimeParts: () => ({}),
            getCurrentGroupZones: () => [],
            getCustomOffsetMinutes: () => 0,
            getFixedOffsetForDisplayAtDate: () => "+09:00",
            getTimezoneOffset: () => 540,
            resolveLocalDatePartsViaTimeService: () => ({}),
            buildStrictUtcDateFromPartsViaCore: () => new Date(),
            getGlobalTimeState: () => new Date(),
            setGlobalTimeValue: () => {},
            getUpdateClocksRef: () => () => "updated",
            getRenderListRef: () => () => "render-list",
            renderMultiRangesSafely: () => "rendered",
            getSavePersistenceSafelyRef: () => () => "saved",
            requestUiFrame: () => 1,
            cancelUiFrame: () => {},
            getGroupsStateSnapshot: () => [],
            getPatchedActiveGroupIdState: () => 0,
            getCurrentGroupBaseTimezoneId: () => "Asia/Seoul",
            getPersistenceServiceRef: () => ({ id: "persistence" }),
            getDocumentRefOrNull: () => ({ id: "doc" }),
            NodeCtor: null,
            rowViewCache: new Map(),
            MAX_RUNTIME_CACHE_SIZE: 50,
            getSnapshotFormatServiceRef: () => ({ id: "snapshot" }),
            getZoneDisplayName: () => "Seoul",
            getZoneDisplayNameForUiAtDate: () => "Seoul",
            getPatchedCurrentLangState: () => "ko",
            getI18nDataRef: () => ({ ko: {} }),
            getPatchedSlotCountState: () => 1,
            normalizeDayNightMarker: (v) => v,
            getDayNightGlyph: () => "sun",
            gtvT: (key) => key,
            sanitizeCopyFormatOrder: (v) => v,
            getPatchedDisplayFormatOrderState: () => [],
            getPatchedDisplayFormatEnabledState: () => ({}),
            getPatchedDisplayTimePartsEnabledState: () => ({}),
            getBaseTimezoneRef: () => "Asia/Seoul",
            escapeHtmlViaSharedUtils: (v) => String(v),
            removeTimezone: () => {},
            handleTimeChange: () => {},
            saveOrder: () => {},
            isCurrentGroupUtcRowVisible: () => true,
            getCurrentGroupUtcRowOrder: () => [],
            getUTCRef: () => "UTC",
            renderBaseTimeSelect: () => {},
            updateTimeAdjustPanelSafely: () => {},
            hideFloatingTooltip: () => {},
            upgradeNativeTitleTooltips: () => {},
            createDragGhostFromRow: () => {},
            clearDragGhost: () => {},
            getCopyActionsServiceRef: () => ({ copyRow: () => "copied" })
        };

        const mutationsConfig = builder.buildTimeInputMutationsConfig(deps);
        const rowOrderConfig = builder.buildMainRowOrderConfig(deps);
        const rowViewConfig = builder.buildMainRowViewConfig(deps);
        const tableConfig = builder.buildTableRenderConfig(deps);

        expect(mutationsConfig.t("k")).toBe("tx:k");
        expect(mutationsConfig.showToast("m")).toBe("toast:m");
        expect(mutationsConfig.updateClocks()).toBe("updated");
        expect(mutationsConfig.renderList()).toBe("render-list");
        expect(mutationsConfig.renderMultiRanges()).toBe("rendered");
        expect(mutationsConfig.savePersistence()).toBe("saved");
        expect(rowOrderConfig.getPersistenceService()).toEqual({ id: "persistence" });
        expect(rowViewConfig.maxRuntimeCacheSize).toBe(50);
        expect(tableConfig.copyRow()).toBe("copied");
        expect(tableConfig.updateClocks()).toBe("updated");
    });

    it("builds image/fixed/multi/time-adjust/group configs with expected adapters", () => {
        const moduleApi = loadMainRuntimeServiceConfigBuilderModule();
        const builder = moduleApi.createService();
        let daySteps = [1, 2];
        const deps = {
            deferDynamicCall: (getter) => (...args) => getter()(...args),
            getDocumentRefOrNull: () => ({ id: "doc" }),
            getImageExportBridgeServiceRef: () => ({ id: "bridge" }),
            createDefaultTableExportContext: () => ({ id: "ctx" }),
            GTV_IMAGE_CLONE: { id: "clone" },
            GTV_IMAGE_FOREIGN_RENDER: { id: "foreign" },
            GTV_IMAGE_EXPORT_BRIDGE: { id: "export-bridge" },
            GTV_TABLE_IMAGE_RENDER: { id: "table-render" },
            GTV_MULTI_RANGE_IMAGE_RENDER: { id: "multi-render" },
            TABLE_IMAGE_EXPORT_WIDTH: 1200,
            EXPORT_MONO_FONT_FAMILY: "monospace",
            getCanUseForeignObjectRendererRef: () => true,
            setCanUseForeignObjectRenderer: () => {},
            getImageExportActionsServiceRef: () => ({ id: "actions" }),
            isFixedTimeTab: () => false,
            waitForDocumentFontsReady: () => Promise.resolve(),
            prepareExportCanvas: () => ({}),
            drawExportCellText: () => {},
            cloneTableForImageExport: () => ({}),
            renderElementWithForeignObjectToPngDataUrl: () => "data:image/png;base64,x",
            gtvT: (key) => key,
            ensureMultiRangeState: () => ({}),
            getBaseTimezoneRef: () => "Asia/Seoul",
            getPatchedMultiRangesState: () => [],
            getMultiRangeTitleTextFromRenderService: () => "title",
            cloneMultiRangeBlockForImageExport: () => ({}),
            extractTableCellText: () => "cell",
            GTV_FIXED_TIME_CORE: { id: "fixed-core" },
            GTV_FIXED_TIME_TIMELINE: { id: "fixed-timeline" },
            GTV_FIXED_TIME_ACTIONS: { id: "fixed-actions" },
            DEFAULT_FIXED_TIME_VALUE: "09:00",
            MIN_FIXED_TIME_SLOT_COUNT: 1,
            TIMELINE_TOTAL_SECONDS: 86400,
            MAIN_I18N_DATA: { ko: {}, en: {} },
            getPatchedCurrentLangState: () => "ko",
            sanitizeFixedTimeValue: (v) => v,
            getFixedOffsetForDisplayAtDate: () => "+09:00",
            getLocalPartsByTimezone: () => ({}),
            getUTCDateFromLocalParts: () => new Date(),
            pad: () => "09",
            sanitizeTimePartsEnabledForContext: (v) => v,
            getPatchedDisplayTimePartsEnabledState: () => ({}),
            getDefaultFixedTimeName: () => "slot",
            sanitizeFixedTimeName: (v) => v,
            getFixedDatePartsFromGroup: () => ({}),
            getDayNightMarkerByHour: () => "day",
            getCurrentGroup: () => ({ id: 0 }),
            ensureGroupFixedTimes: () => [],
            getGlobalTimeState: () => new Date(),
            resolveFixedTimeSlotUtcDate: () => new Date(),
            clampNumber: (v) => v,
            getFixedTimeSlotCount: () => 1,
            sanitizeFixedTimeId: (v) => v,
            getFixedTimeSlotHeaderLabel: () => "label",
            sanitizeCopyFormatOrderForContext: (v) => v,
            sanitizeCopyFormatEnabledForContext: (v) => v,
            getPatchedCopyFormatOrderState: () => [],
            getPatchedCopyFormatEnabledState: () => ({}),
            getPatchedCopyTimePartsEnabledState: () => ({}),
            buildTimezoneComputedSnapshotForDatesViaSnapshotService: () => [],
            formatSnapshotTextViaSnapshotService: () => "text",
            getRenderableTimezoneRowsFromTableRender: () => [],
            parseDateTimeParts: () => ({}),
            getShowToastRef: () => (message) => `toast:${message}`,
            writeClipboardText: () => true,
            buildFixedTimeDisplayPayloadAtUtc: () => ({}),
            getRenderFixedTimeTabRef: () => () => "render-fixed-tab",
            getRenderTimelineFrameRef: () => () => "render-timeline",
            getSavePersistenceSafelyRef: () => () => "saved",
            setFixedTimeSlotCount: () => {},
            getRefreshFixedTimeSlotCountControlsRef: () => () => "refresh-fixed-slot",
            GTV_MULTI_RANGE_RENDER: { id: "multi-render-core" },
            GTV_MULTI_RANGE_COPY: { id: "multi-copy" },
            GTV_COPY_ACTIONS: { id: "copy-actions" },
            getCustomOffsetMinutes: () => 0,
            normalizeCustomAbbr: (v) => v,
            getZoneAbbreviation: () => "KST",
            getSignedInclusiveDaySpan: () => 0,
            getSignedDurationDayHourMinute: () => "0d 00:00",
            getZoneDisplayName: () => "Seoul",
            getZoneDisplayNameForUiAtDate: () => "Seoul",
            sanitizeMultiSubgroupNameViaState: (v) => v,
            getCurrentMultiSubgroupName: () => "sub",
            sanitizeMultiRangeTitle: (v) => v,
            getPatchedMultiRangeTitleState: () => "range",
            buildStaticRowCellFromTableRender: () => "<td/>",
            buildDynamicRowCellFromTableRender: () => "<td/>",
            isMultiRangeStartEditEnabled: () => false,
            isMultiRangeEndEditEnabled: () => false,
            handleMultiRangeTimeChange: () => {},
            copyMultiRangeRow: () => {},
            hideFloatingTooltip: () => {},
            refreshMultiRangeControls: () => {},
            renderMultiBulkToolSets: () => {},
            escapeHtmlViaSharedUtils: (v) => String(v),
            getDisplayColumns: () => [],
            getPatchedMultiRangeCollapsedState: () => [],
            getPatchedMultiRangeCountState: () => 1,
            saveMultiRangeSingleImage: () => {},
            setMultiRangesCollapsedBelow: () => {},
            toggleMultiRangeCollapsed: () => {},
            renderTimeAdjustSet: () => {},
            applyMultiRangeTimeAdjustAction: () => {},
            attachTimeAdjustToggleLabel: () => {},
            setMultiRangeStartEditEnabled: () => {},
            setMultiRangeEndEditEnabled: () => {},
            getMultiDisplayColumnHeaderFromTableRender: () => "H",
            updateTimeAdjustPanelSafely: () => {},
            updateCopyFormatPreview: () => {},
            upgradeNativeTitleTooltips: () => {},
            getTimezoneRefByIdFromSnapshotService: () => ({}),
            buildTimezoneComputedSnapshotForRange: () => [],
            formatSnapshotText: () => "text",
            getPatchedShowCopyFormatState: () => false,
            isMultiTab: () => true,
            getRowFormattedTextViaSnapshotService: () => "row",
            getRowCopyTextViaSnapshotService: () => "row-copy",
            getFixedTimePreviewCopyText: () => "preview",
            getAllFixedTimeRowsCopyText: () => "all-fixed",
            copyAllMultiRangeTimezones: () => "all-multi",
            GTV_TIME_ADJUST_UI: { id: "time-adjust-ui" },
            GTV_MULTI_BULK_TOOLS: { id: "bulk-tools" },
            GTV_TIME_ADJUST_ACTIONS: { id: "time-adjust-actions" },
            MIN_TIME_ADJUST_DAY_STEP: 1,
            MAX_TIME_ADJUST_DAY_STEP: 365,
            DEFAULT_TIME_ADJUST_DAY_STEP: 1,
            savePersistenceSafely: () => "persisted",
            applyTimeAdjustAction: () => {},
            getPatchedMainTabState: () => "live",
            getIsRealtimeState: () => true,
            getPatchedSlotCountState: () => 2,
            getTimeAdjustDayStepValue: () => 1,
            getTimeAdjustDayStepBySlotSnapshot: () => daySteps,
            setTimeAdjustDayStepBySlotState: (next) => { daySteps = next; },
            applyBulkRangeAllAction: () => {},
            applyFirstRangeStartAdjustAction: () => {},
            setAllMultiRangeStartEditEnabled: () => {},
            setAllMultiRangeEndEditEnabled: () => {},
            getGlobalTimesState: () => [new Date(), new Date()],
            getUpdateClocksRef: () => () => "updated",
            getFixedOffsetForDisplay: () => "+09:00",
            getTimeAdjustDayStep: () => 1,
            timeService: { id: "time-service" },
            sanitizeUtcMsViaTimeCore: (v) => v,
            isMultiRangeStartLinked: () => false,
            renderMultiRangesSafely: () => {},
            syncLinkedRangesFrom: () => {},
            getMultiRangeSlotDate: () => null,
            setMultiRangeSlotDate: () => {},
            syncFollowingRangesByDuration: () => {},
            syncMultiRangeStartLinks: () => {},
            GTV_MULTI_STATE: { id: "multi-state" },
            serviceBootstrap: { id: "bootstrap" },
            MIN_MULTI_RANGE_COUNT: 1,
            getGroupsStateSnapshot: () => [],
            getDefaultMultiRangeBounds: () => ({ start: 0, end: 0 }),
            sanitizeMultiRangeCount: (v) => v,
            sanitizeMultiRangeItem: (v) => v,
            sanitizeTimezoneId: (v) => v,
            createUniqueTimezoneId: () => "tz-1",
            normalizeZoneAbbreviationViaSearch: (v) => v,
            sanitizeBaseTimezoneId: (v) => v,
            sanitizeUtcRowOrderViaTimeCore: (v) => v,
            sanitizeFixedTimes: (v) => v,
            sanitizeFixedDateValue: (v) => v,
            sanitizeFixedTimeShowLiveNow: (v) => !!v,
            getImageExportNamingServiceRef: () => ({ id: "naming" }),
            getPatchedActiveGroupIdState: () => 0,
            getBaseTimeSnapshot: () => new Date(),
            sanitizeMultiSubgroupNameForExport: (v) => v,
            GTV_IMAGE_EXPORT_NAMING: { id: "img-naming" },
            GTV_IMAGE_EXPORT_ACTIONS: { id: "img-actions" },
            GTV_IMAGE_EXPORT: { id: "img-api" },
            getActiveGroupNameSnapshot: () => "Group 1",
            detectForeignObjectRendererSupport: () => true,
            renderTimezoneTableToPngDataUrl: () => "tz-png",
            renderTimezoneTableFallbackDataUrl: () => "tz-fallback",
            renderMultiRangesToPngDataUrl: () => "multi-png",
            renderMultiRangeSingleToPngDataUrl: () => "single-png",
            renderMultiRangesFallbackDataUrl: () => "multi-fallback",
            renderMultiRangeTitlesToPngDataUrl: () => "titles-png",
            getTimezoneTableImageFilename: () => "tz.png",
            getMultiRangeTableImageFilename: () => "multi.png",
            getMultiRangeTitlesImageFilename: () => "titles.png",
            isDomExceptionLike: () => false
        };

        const bridgeConfig = builder.buildMainImageExportBridgeProxyConfig(deps);
        const imageRuntimeConfig = builder.buildMainImageRuntimeServicesConfig(deps);
        const fixedConfig = builder.buildMainFixedTimeServicesConfig(deps);
        const multiConfig = builder.buildMainMultiRangeServicesConfig(deps);
        const adjustConfig = builder.buildMainTimeAdjustServicesConfig(deps);
        const groupConfig = builder.buildMainGroupStateServicesConfig(deps);
        const namingConfig = builder.buildMainImageExportNamingProxyConfig(deps);
        const imageExportConfig = builder.buildMainImageExportServicesConfig(deps);

        expect(bridgeConfig.getDefaultTableExportContext()).toEqual({ id: "ctx" });
        expect(imageRuntimeConfig.document).toEqual({ id: "doc" });
        expect(imageRuntimeConfig.getMultiRangeTitleText()).toBe("title");
        expect(fixedConfig.showToast("warn")).toBe("toast:warn");
        expect(fixedConfig.renderFixedTimeTab()).toBe("render-fixed-tab");
        expect(fixedConfig.renderTimelineFrame()).toBe("render-timeline");
        expect(fixedConfig.savePersistence()).toBe("saved");
        expect(fixedConfig.refreshFixedTimeSlotCountControls()).toBe("refresh-fixed-slot");
        expect(multiConfig.showToast("warn")).toBe("toast:warn");
        expect(multiConfig.copyAllMultiRangeTimezones()).toBe("all-multi");
        adjustConfig.setTimeAdjustDayStepValue(1, 7);
        expect(daySteps).toEqual([1, 7]);
        expect(adjustConfig.updateClocks()).toBe("updated");
        expect(groupConfig.serviceBootstrap).toEqual({ id: "bootstrap" });
        expect(namingConfig.getImageExportNamingService()).toEqual({ id: "naming" });
        expect(imageExportConfig.imageExportApi).toEqual({ id: "img-api" });
        expect(imageExportConfig.showToast("warn")).toBe("toast:warn");
    });

    it("builds tab/app-state configs with context-aware patch and state source wiring", () => {
        const moduleApi = loadMainRuntimeServiceConfigBuilderModule();
        const builder = moduleApi.createService();
        const patchCalls = [];
        let syncCount = 0;
        const realtimeCalls = [];
        const deps = {
            deferDynamicCall: (getter) => (...args) => getter()(...args),
            bindFacadeMethod: (getter, methodName) => (...args) => getter()[methodName](...args),
            GTV_FORMAT_CONTROLS: { id: "format-controls" },
            serviceBootstrap: { id: "bootstrap" },
            COPY_FORMAT_KEYS: ["time", "date"],
            TIME_PART_KEYS: ["ampm"],
            gtvT: (key) => `t:${key}`,
            sanitizeCopyFormatOrder: (v) => v,
            getRenderListRef: () => () => "render-list",
            updateCopyFormatPreview: () => {},
            savePersistenceSafely: () => "saved",
            upgradeNativeTitleTooltips: () => {},
            getPatchedShowCopyFormatState: () => false,
            getPatchedDisplayFormatOrderState: () => ["time"],
            getPatchedActiveFormatProfileContextState: () => "live",
            patchAppState: (next) => { patchCalls.push(next); },
            sanitizeCopyFormatOrderForContext: (_next, context) => `order-${context}`,
            syncActiveFormatProfileFromState: () => { syncCount += 1; },
            getPatchedDisplayFormatEnabledState: () => ({ time: true }),
            sanitizeCopyFormatEnabledForContext: (_next, mode, context) => `${mode}-${context}`,
            getPatchedDisplayTimePartsEnabledState: () => ({ ampm: true }),
            sanitizeTimePartsEnabledForContext: (_next, mode, context) => `${mode}-tp-${context}`,
            getPatchedCopyFormatOrderState: () => ["date"],
            getPatchedCopyFormatEnabledState: () => ({ date: true }),
            getPatchedCopyTimePartsEnabledState: () => ({ ampm: false }),
            getActiveCopyFormatKeysForCurrentContext: () => ["time"],
            getActiveTimePartKeysForCurrentContext: () => ["ampm"],
            sanitizeMainTab: (v) => v,
            clampGroupIndex: (v) => v,
            normalizeGroupTabState: () => ({}),
            isMultiTab: () => false,
            isFixedTimeTab: () => false,
            getPatchedSlotCountState: () => 2,
            getPatchedShowTimelineState: () => false,
            getIsRealtimeState: () => true,
            setIsRealtimeState: () => true,
            setGlobalTimeState: (...args) => { realtimeCalls.push(args); },
            getPatchedMainTabState: () => "live",
            setCurrentMainTabState: () => {},
            getPatchedActiveGroupIdState: () => 0,
            setActiveGroupIdState: () => {},
            getActiveGroupIdByMainTabStateSnapshot: () => ({ live: 0 }),
            setActiveGroupIdByMainTabState: () => {},
            hideFloatingTooltip: () => {},
            syncCurrentMultiStateToActiveSubgroup: () => {},
            refreshMultiRangeControls: () => {},
            renderBaseTimeSelect: () => {},
            loadCurrentMultiStateFromActiveSubgroup: () => {},
            getGroupTabsServiceRef: () => ({
                renderGroups: () => "groups",
                renderMultiSubgroups: () => "subgroups"
            }),
            renderMultiRangesSafely: () => {},
            renderFixedTimeTab: () => {},
            getRenderTimelineFrameRef: () => () => "timeline",
            updateTimeAdjustPanelSafely: () => {},
            resolveFormatProfileContext: () => "live",
            activateFormatProfileContext: () => {},
            GTV_APP_STATE_PATCHER: { id: "patcher" },
            GTV_APP_PERSISTENCE_STATE: { id: "persist-state" },
            getMainAppStateSource: () => ({ key: "value" }),
            directStateSetters: { key: () => {} },
            ensureFormatProfiles: () => {},
            getCurrentFormatProfileState: () => ({}),
            applyFormatProfileState: () => {}
        };

        const tabConfig = builder.buildMainTabServicesConfig(deps);
        tabConfig.setDisplayFormatOrder(["time"]);
        tabConfig.setDisplayFormatEnabled({ time: false });
        tabConfig.setDisplayTimePartsEnabled({ ampm: false });
        tabConfig.setCopyFormatOrder(["date"]);
        tabConfig.setCopyFormatEnabled({ date: false });
        tabConfig.setCopyTimePartsEnabled({ ampm: true });
        tabConfig.syncRealtimeNow();

        expect(patchCalls).toEqual([
            { displayFormatOrder: "order-live" },
            { displayFormatEnabled: "display-live" },
            { displayTimePartsEnabled: "display-tp-live" },
            { copyFormatOrder: "order-live" },
            { copyFormatEnabled: "copy-live" },
            { copyTimePartsEnabled: "copy-tp-live" }
        ]);
        expect(syncCount).toBe(6);
        expect(realtimeCalls.length).toBe(1);
        expect(realtimeCalls[0][0]).toBe(0);
        expect(realtimeCalls[0][1] instanceof Date).toBe(true);
        expect(tabConfig.renderGroups()).toBe("groups");
        expect(tabConfig.renderMultiSubgroups()).toBe("subgroups");
        expect(tabConfig.renderTimelineFrame()).toBe("timeline");

        const appStateConfig = builder.buildMainAppStateServicesConfig(deps);
        expect(appStateConfig.GTV_APP_STATE_PATCHER).toEqual({ id: "patcher" });
        expect(appStateConfig.GTV_APP_PERSISTENCE_STATE).toEqual({ id: "persist-state" });
        expect(appStateConfig.getStateSource()).toEqual({ key: "value" });
        expect(appStateConfig.stateSetters).toEqual({ key: deps.directStateSetters.key });
        expect(appStateConfig.setIsRealtimeState).toBe(deps.setIsRealtimeState);
    });

    it("builds app bootstrap config with bound/deferred runtime methods", () => {
        const moduleApi = loadMainRuntimeServiceConfigBuilderModule();
        const builder = moduleApi.createService();
        const deps = {
            bindFacadeMethod: (getter, methodName) => (...args) => getter()[methodName](...args),
            deferDynamicCall: (getter) => (...args) => getter()(...args),
            assertRequiredServices: () => true,
            loadPersistence: () => Promise.resolve(),
            localizeAutoGeneratedNamesForCurrentLanguage: () => {},
            savePersistenceSafely: () => {},
            loadCurrentMultiStateFromActiveSubgroup: () => {},
            loadThemePreference: () => {},
            applyTheme: () => {},
            loadUiScalePreference: () => {},
            applyUiScale: () => {},
            applyTranslations: () => {},
            applyVersionBranding: () => {},
            getMainUiInitServiceRef: () => ({
                initUI: () => "init-ui"
            }),
            bindFloatingTooltipEvents: () => {},
            initDragAndDrop: () => {},
            getTimezoneSearchServiceRef: () => ({
                initSearchAndSelect: () => "init-search"
            }),
            initCalculators: () => {},
            getTimerEngineServiceRef: () => ({
                startRealtimeTicker: () => "ticker"
            }),
            switchMainTab: () => {},
            getPatchedMainTabState: () => "live",
            getUpdateClocksRef: () => () => "update-clocks",
            showFatalError: () => {}
        };

        const config = builder.buildMainAppBootstrapConfig(deps);

        expect(config.initUI()).toBe("init-ui");
        expect(config.initSearchAndSelect()).toBe("init-search");
        expect(config.startRealtimeTicker()).toBe("ticker");
        expect(config.updateClocks()).toBe("update-clocks");
        expect(config.getCurrentMainTab()).toBe("live");
    });

    it("merges base deps from createService with per-call deps", () => {
        const moduleApi = loadMainRuntimeServiceConfigBuilderModule();
        const builder = moduleApi.createService({
            gtvT: (key) => `base:${key}`,
            savePersistenceSafely: () => "base-save"
        });

        const baseConfig = builder.buildMainSelectServicesConfig();
        const overrideConfig = builder.buildMainSelectServicesConfig({
            gtvT: (key) => `override:${key}`
        });

        expect(baseConfig.t("x")).toBe("base:x");
        expect(baseConfig.savePersistence()).toBe("base-save");
        expect(overrideConfig.t("x")).toBe("override:x");
        expect(overrideConfig.savePersistence()).toBe("base-save");
    });
});
