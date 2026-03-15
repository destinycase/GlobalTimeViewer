import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const luxon = require("luxon");

const MAIN_JS_PATH = path.resolve(process.cwd(), "main.js");
const APP_CONFIG_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "app-config.js");
const MAIN_CONSTANTS_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-constants.js");
const SERVICE_BOOTSTRAP_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "service-bootstrap.js");
const APP_STATE_PATCHER_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "app-state-patcher.js");
const DATE_PICKER_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "date-picker.js");
const TIME_CORE_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "time-core.js");
const TIME_INPUT_MUTATIONS_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "time-input-mutations.js");
const TIMER_ENGINE_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "timer-engine.js");
const TIME_SERVICE_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "time-service.js");
const TIMEZONE_DATA_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "timezone-data.js");
const CALCULATOR_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "calculator.js");
const CALCULATOR_ACTIONS_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "calculator-actions.js");
const MULTI_STATE_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "multi-state.js");
const IMAGE_EXPORT_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "image-export.js");
const IMAGE_EXPORT_ACTIONS_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "image-export-actions.js");
const IMAGE_EXPORT_BRIDGE_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "image-export-bridge.js");
const IMAGE_EXPORT_NAMING_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "image-export-naming.js");
const IMAGE_CLONE_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "image-clone.js");
const IMAGE_FOREIGN_RENDER_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "image-foreign-render.js");
const GROUP_STATE_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "group-state.js");
const GROUP_CONTEXT_STATE_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "group-context-state.js");
const GROUP_TABS_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "group-tabs.js");
const TIMEZONE_SEARCH_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "timezone-search.js");
const SNAPSHOT_FORMAT_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "snapshot-format.js");
const TABLE_RENDER_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "table-render.js");
const TABLE_IMAGE_RENDER_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "table-image-render.js");
const MULTI_RANGE_IMAGE_RENDER_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "multi-range-image-render.js");
const MULTI_RANGE_STATE_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "multi-range-state.js");
const MULTI_RANGE_RENDER_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "multi-range-render.js");
const MULTI_RANGE_COPY_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "multi-range-copy.js");
const COPY_ACTIONS_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "copy-actions.js");
const TIME_ADJUST_UI_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "time-adjust-ui.js");
const TIME_ADJUST_ACTIONS_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "time-adjust-actions.js");
const MULTI_BULK_TOOLS_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "multi-bulk-tools.js");
const TIMELINE_FRAME_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "timeline-frame.js");
const FIXED_TIME_CORE_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "fixed-time-core.js");
const FIXED_TIME_SLOT_UTILS_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "fixed-time-slot-utils.js");
const FIXED_TIME_STATE_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "fixed-time-state.js");
const FIXED_TIME_TIMELINE_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "fixed-time-timeline.js");
const FIXED_TIME_ACTIONS_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "fixed-time-actions.js");
const FIXED_TIME_TABLE_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "fixed-time-table.js");
const FORMAT_PROFILE_STATE_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "format-profile-state.js");
const FORMAT_CONTROLS_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "format-controls.js");
const TAB_UI_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "tab-ui.js");
const TAB_ORCHESTRATOR_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "tab-orchestrator.js");
const MAIN_UI_INIT_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-ui-init.js");
const MAIN_UI_UTILS_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-ui-utils.js");
const APP_FEEDBACK_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "app-feedback.js");
const UI_SETTINGS_ACTIONS_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "ui-settings-actions.js");
const APP_PERSISTENCE_STATE_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "app-persistence-state.js");
const PERSISTENCE_SERVICE_BUNDLE_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "persistence-service-bundle.js");
const STATE_PERSISTENCE_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "state-persistence.js");
const UI_PREFERENCES_STATE_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "ui-preferences-state.js");
const SETTINGS_IO_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "settings-io.js");
const DATA_TRANSFER_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "data-transfer.js");

function createDocumentStub() {
    const stub = {
        addEventListener() { },
        removeEventListener() { },
        getElementById(id) {
            const el = stub.createElement("div");
            if (id?.includes("select")) el.tagName = "SELECT";
            if (id?.includes("input") || id?.includes("count")) el.tagName = "INPUT";
            return el;
        },
        querySelectorAll() { return []; },
        querySelector() { return stub.createElement("div"); },
        createElement(tag) {
            const el = {
                tagName: tag?.toUpperCase() || "DIV",
                style: {},
                classList: { add() { }, remove() { }, toggle() { }, contains() { return false; } },
                setAttribute() { },
                removeAttribute() { },
                getAttribute() { return ""; },
                appendChild(child) {
                    if (this.tagName === "SELECT" && child?.tagName === "OPTION") {
                        this.options.push(child);
                    }
                },
                remove() { },
                click() { },
                addEventListener() { },
                removeEventListener() { },
                insertAdjacentHTML() { },
                getContext() {
                    return {
                        measureText: () => ({ width: 100 }),
                        fillText: () => { },
                        drawImage: () => { },
                        beginPath: () => { },
                        moveTo: () => { },
                        lineTo: () => { },
                        stroke: () => { },
                        fill: () => { },
                        rect: () => { },
                        arc: () => { }
                    };
                },
                value: "",
                options: [],
                dataset: {},
                textContent: "",
                lang: "ko",
                closest() { return this; },
                querySelectorAll() { return []; },
                querySelector() { return null; }
            };
            return el;
        },
        body: {
            appendChild() { },
            removeChild() { },
            style: {}
        },
        documentElement: null // Will be set below
    };
    stub.documentElement = stub.createElement("html");
    stub.documentElement.style.overflow = "";
    stub.documentElement.style.setProperty = () => { };
    stub.documentElement.style.removeProperty = () => { };
    return stub;
}

function createStorageStub() {
    const store = new Map();
    return {
        getItem(key) {
            return store.has(key) ? store.get(key) : null;
        },
        setItem(key, value) {
            store.set(String(key), String(value));
        },
        removeItem(key) {
            store.delete(String(key));
        }
    };
}

export function createMainContext() {
    const appConfigCode = fs.readFileSync(APP_CONFIG_MODULE_PATH, "utf8");
    const mainConstantsCode = fs.readFileSync(MAIN_CONSTANTS_MODULE_PATH, "utf8");
    const serviceBootstrapCode = fs.readFileSync(SERVICE_BOOTSTRAP_MODULE_PATH, "utf8");
    const appStatePatcherCode = fs.readFileSync(APP_STATE_PATCHER_MODULE_PATH, "utf8");
    const datePickerCode = fs.readFileSync(DATE_PICKER_MODULE_PATH, "utf8");
    const timeCoreCode = fs.readFileSync(TIME_CORE_MODULE_PATH, "utf8");
    const timeInputMutationsCode = fs.readFileSync(TIME_INPUT_MUTATIONS_MODULE_PATH, "utf8");
    const timerEngineCode = fs.readFileSync(TIMER_ENGINE_MODULE_PATH, "utf8");
    const timeServiceCode = fs.readFileSync(TIME_SERVICE_MODULE_PATH, "utf8");
    const timezoneDataCode = fs.readFileSync(TIMEZONE_DATA_MODULE_PATH, "utf8");
    const calculatorCode = fs.readFileSync(CALCULATOR_MODULE_PATH, "utf8");
    const calculatorActionsCode = fs.readFileSync(CALCULATOR_ACTIONS_MODULE_PATH, "utf8");
    const multiStateCode = fs.readFileSync(MULTI_STATE_MODULE_PATH, "utf8");
    const imageExportCode = fs.readFileSync(IMAGE_EXPORT_MODULE_PATH, "utf8");
    const imageExportActionsCode = fs.readFileSync(IMAGE_EXPORT_ACTIONS_MODULE_PATH, "utf8");
    const imageExportBridgeCode = fs.readFileSync(IMAGE_EXPORT_BRIDGE_MODULE_PATH, "utf8");
    const imageExportNamingCode = fs.readFileSync(IMAGE_EXPORT_NAMING_MODULE_PATH, "utf8");
    const imageCloneCode = fs.readFileSync(IMAGE_CLONE_MODULE_PATH, "utf8");
    const imageForeignRenderCode = fs.readFileSync(IMAGE_FOREIGN_RENDER_MODULE_PATH, "utf8");
    const groupStateCode = fs.readFileSync(GROUP_STATE_MODULE_PATH, "utf8");
    const groupContextStateCode = fs.readFileSync(GROUP_CONTEXT_STATE_MODULE_PATH, "utf8");
    const groupTabsCode = fs.readFileSync(GROUP_TABS_MODULE_PATH, "utf8");
    const timezoneSearchCode = fs.readFileSync(TIMEZONE_SEARCH_MODULE_PATH, "utf8");
    const snapshotFormatCode = fs.readFileSync(SNAPSHOT_FORMAT_MODULE_PATH, "utf8");
    const tableRenderCode = fs.readFileSync(TABLE_RENDER_MODULE_PATH, "utf8");
    const tableImageRenderCode = fs.readFileSync(TABLE_IMAGE_RENDER_MODULE_PATH, "utf8");
    const multiRangeImageRenderCode = fs.readFileSync(MULTI_RANGE_IMAGE_RENDER_MODULE_PATH, "utf8");
    const multiRangeStateCode = fs.readFileSync(MULTI_RANGE_STATE_MODULE_PATH, "utf8");
    const multiRangeRenderCode = fs.readFileSync(MULTI_RANGE_RENDER_MODULE_PATH, "utf8");
    const multiRangeCopyCode = fs.readFileSync(MULTI_RANGE_COPY_MODULE_PATH, "utf8");
    const copyActionsCode = fs.readFileSync(COPY_ACTIONS_MODULE_PATH, "utf8");
    const timeAdjustUiCode = fs.readFileSync(TIME_ADJUST_UI_MODULE_PATH, "utf8");
    const timeAdjustActionsCode = fs.readFileSync(TIME_ADJUST_ACTIONS_MODULE_PATH, "utf8");
    const multiBulkToolsCode = fs.readFileSync(MULTI_BULK_TOOLS_MODULE_PATH, "utf8");
    const timelineFrameCode = fs.readFileSync(TIMELINE_FRAME_MODULE_PATH, "utf8");
    const fixedTimeCoreCode = fs.readFileSync(FIXED_TIME_CORE_MODULE_PATH, "utf8");
    const fixedTimeSlotUtilsCode = fs.readFileSync(FIXED_TIME_SLOT_UTILS_MODULE_PATH, "utf8");
    const fixedTimeStateCode = fs.readFileSync(FIXED_TIME_STATE_MODULE_PATH, "utf8");
    const fixedTimeTimelineCode = fs.readFileSync(FIXED_TIME_TIMELINE_MODULE_PATH, "utf8");
    const fixedTimeActionsCode = fs.readFileSync(FIXED_TIME_ACTIONS_MODULE_PATH, "utf8");
    const fixedTimeTableCode = fs.readFileSync(FIXED_TIME_TABLE_MODULE_PATH, "utf8");
    const formatProfileStateCode = fs.readFileSync(FORMAT_PROFILE_STATE_MODULE_PATH, "utf8");
    const formatControlsCode = fs.readFileSync(FORMAT_CONTROLS_MODULE_PATH, "utf8");
    const tabUiCode = fs.readFileSync(TAB_UI_MODULE_PATH, "utf8");
    const tabOrchestratorCode = fs.readFileSync(TAB_ORCHESTRATOR_MODULE_PATH, "utf8");
    const mainUiInitCode = fs.readFileSync(MAIN_UI_INIT_MODULE_PATH, "utf8");
    const mainUiUtilsCode = fs.readFileSync(MAIN_UI_UTILS_MODULE_PATH, "utf8");
    const appFeedbackCode = fs.readFileSync(APP_FEEDBACK_MODULE_PATH, "utf8");
    const uiSettingsActionsCode = fs.readFileSync(UI_SETTINGS_ACTIONS_MODULE_PATH, "utf8");
    const appPersistenceStateCode = fs.readFileSync(APP_PERSISTENCE_STATE_MODULE_PATH, "utf8");
    const persistenceServiceBundleCode = fs.readFileSync(PERSISTENCE_SERVICE_BUNDLE_MODULE_PATH, "utf8");
    const statePersistenceCode = fs.readFileSync(STATE_PERSISTENCE_MODULE_PATH, "utf8");
    const uiPreferencesStateCode = fs.readFileSync(UI_PREFERENCES_STATE_MODULE_PATH, "utf8");
    const settingsIoCode = fs.readFileSync(SETTINGS_IO_MODULE_PATH, "utf8");
    const dataTransferCode = fs.readFileSync(DATA_TRANSFER_MODULE_PATH, "utf8");
    const mainCode = fs.readFileSync(MAIN_JS_PATH, "utf8");
    const documentStub = createDocumentStub();
    const storageStub = createStorageStub();

    const sandbox = {
        console,
        Date,
        Intl,
        luxon,
        Math,
        JSON,
        Number,
        String,
        Boolean,
        Array,
        Object,
        RegExp,
        Set,
        Map,
        Promise,
        setTimeout,
        clearTimeout,
        setInterval,
        clearInterval,
        Error,
        TypeError,
        parseInt,
        parseFloat,
        isNaN,
        isFinite,
        URL,
        Blob,
        t: (key) => key,
        tFormat: (key) => key,
        applyTranslations: () => { },
        Element: function () { },
        Node: function () { },
        getComputedStyle: () => ({
            getPropertyValue: () => "0px",
            width: "0px",
            height: "0px"
        }),
        I18N_DATA: {
            ko: { days: ["일", "월", "화", "수", "목", "금", "토"] },
            en: { days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }
        },
        currentLang: "ko",
        document: documentStub,
        localStorage: storageStub,
        location: { reload() { } },
        navigator: {
            clipboard: { writeText: async () => { } }
        },
        AbortController: class {
            constructor() { this.signal = { addEventListener() { }, removeEventListener() { } }; }
            abort() { }
        }
    };

    sandbox.window = sandbox;
    sandbox.globalThis = sandbox;
    sandbox.global = sandbox;
    sandbox.addEventListener = () => { };
    sandbox.removeEventListener = () => { };

    // Add browser-specific window properties that aren't on the sandbox root
    sandbox.innerWidth = 1920;
    sandbox.innerHeight = 1080;

    vm.createContext(sandbox);
    vm.runInContext(appConfigCode, sandbox, { filename: "js/modules/app-config.js" });
    vm.runInContext(mainConstantsCode, sandbox, { filename: "js/modules/main-constants.js" });
    vm.runInContext(serviceBootstrapCode, sandbox, { filename: "js/modules/service-bootstrap.js" });
    vm.runInContext(appStatePatcherCode, sandbox, { filename: "js/modules/app-state-patcher.js" });
    vm.runInContext(datePickerCode, sandbox, { filename: "js/modules/date-picker.js" });
    vm.runInContext(timeCoreCode, sandbox, { filename: "js/modules/time-core.js" });
    vm.runInContext(timeInputMutationsCode, sandbox, { filename: "js/modules/time-input-mutations.js" });
    vm.runInContext(timerEngineCode, sandbox, { filename: "js/modules/timer-engine.js" });
    vm.runInContext(timeServiceCode, sandbox, { filename: "js/modules/time-service.js" });
    vm.runInContext(timezoneDataCode, sandbox, { filename: "js/modules/timezone-data.js" });
    vm.runInContext(calculatorCode, sandbox, { filename: "js/modules/calculator.js" });
    vm.runInContext(calculatorActionsCode, sandbox, { filename: "js/modules/calculator-actions.js" });
    vm.runInContext(multiStateCode, sandbox, { filename: "js/modules/multi-state.js" });
    vm.runInContext(imageExportCode, sandbox, { filename: "js/modules/image-export.js" });
    vm.runInContext(imageExportActionsCode, sandbox, { filename: "js/modules/image-export-actions.js" });
    vm.runInContext(imageExportBridgeCode, sandbox, { filename: "js/modules/image-export-bridge.js" });
    vm.runInContext(imageExportNamingCode, sandbox, { filename: "js/modules/image-export-naming.js" });
    vm.runInContext(imageCloneCode, sandbox, { filename: "js/modules/image-clone.js" });
    vm.runInContext(imageForeignRenderCode, sandbox, { filename: "js/modules/image-foreign-render.js" });
    vm.runInContext(groupStateCode, sandbox, { filename: "js/modules/group-state.js" });
    vm.runInContext(groupContextStateCode, sandbox, { filename: "js/modules/group-context-state.js" });
    vm.runInContext(groupTabsCode, sandbox, { filename: "js/modules/group-tabs.js" });
    vm.runInContext(timezoneSearchCode, sandbox, { filename: "js/modules/timezone-search.js" });
    vm.runInContext(snapshotFormatCode, sandbox, { filename: "js/modules/snapshot-format.js" });
    vm.runInContext(tableRenderCode, sandbox, { filename: "js/modules/table-render.js" });
    vm.runInContext(tableImageRenderCode, sandbox, { filename: "js/modules/table-image-render.js" });
    vm.runInContext(multiRangeImageRenderCode, sandbox, { filename: "js/modules/multi-range-image-render.js" });
    vm.runInContext(multiRangeStateCode, sandbox, { filename: "js/modules/multi-range-state.js" });
    vm.runInContext(multiRangeRenderCode, sandbox, { filename: "js/modules/multi-range-render.js" });
    vm.runInContext(multiRangeCopyCode, sandbox, { filename: "js/modules/multi-range-copy.js" });
    vm.runInContext(copyActionsCode, sandbox, { filename: "js/modules/copy-actions.js" });
    vm.runInContext(timeAdjustUiCode, sandbox, { filename: "js/modules/time-adjust-ui.js" });
    vm.runInContext(timeAdjustActionsCode, sandbox, { filename: "js/modules/time-adjust-actions.js" });
    vm.runInContext(multiBulkToolsCode, sandbox, { filename: "js/modules/multi-bulk-tools.js" });
    vm.runInContext(timelineFrameCode, sandbox, { filename: "js/modules/timeline-frame.js" });
    vm.runInContext(fixedTimeCoreCode, sandbox, { filename: "js/modules/fixed-time-core.js" });
    vm.runInContext(fixedTimeSlotUtilsCode, sandbox, { filename: "js/modules/fixed-time-slot-utils.js" });
    vm.runInContext(fixedTimeStateCode, sandbox, { filename: "js/modules/fixed-time-state.js" });
    vm.runInContext(fixedTimeTimelineCode, sandbox, { filename: "js/modules/fixed-time-timeline.js" });
    vm.runInContext(fixedTimeActionsCode, sandbox, { filename: "js/modules/fixed-time-actions.js" });
    vm.runInContext(fixedTimeTableCode, sandbox, { filename: "js/modules/fixed-time-table.js" });
    vm.runInContext(formatProfileStateCode, sandbox, { filename: "js/modules/format-profile-state.js" });
    vm.runInContext(formatControlsCode, sandbox, { filename: "js/modules/format-controls.js" });
    vm.runInContext(tabUiCode, sandbox, { filename: "js/modules/tab-ui.js" });
    vm.runInContext(tabOrchestratorCode, sandbox, { filename: "js/modules/tab-orchestrator.js" });
    vm.runInContext(mainUiInitCode, sandbox, { filename: "js/modules/main-ui-init.js" });
    vm.runInContext(mainUiUtilsCode, sandbox, { filename: "js/modules/main-ui-utils.js" });
    vm.runInContext(appFeedbackCode, sandbox, { filename: "js/modules/app-feedback.js" });
    vm.runInContext(uiSettingsActionsCode, sandbox, { filename: "js/modules/ui-settings-actions.js" });
    vm.runInContext(appPersistenceStateCode, sandbox, { filename: "js/modules/app-persistence-state.js" });
    vm.runInContext(persistenceServiceBundleCode, sandbox, { filename: "js/modules/persistence-service-bundle.js" });
    vm.runInContext(statePersistenceCode, sandbox, { filename: "js/modules/state-persistence.js" });
    vm.runInContext(uiPreferencesStateCode, sandbox, { filename: "js/modules/ui-preferences-state.js" });
    vm.runInContext(settingsIoCode, sandbox, { filename: "js/modules/settings-io.js" });
    vm.runInContext(dataTransferCode, sandbox, { filename: "js/modules/data-transfer.js" });
    vm.runInContext(mainCode, sandbox, { filename: "main.js" });

    return {
        sandbox,
        run: (source) => vm.runInContext(source, sandbox)
    };
}
