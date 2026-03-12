import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const MAIN_JS_PATH = path.resolve(process.cwd(), "main.js");
const APP_CONFIG_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "app-config.js");
const TIME_CORE_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "time-core.js");
const CALCULATOR_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "calculator.js");
const MULTI_STATE_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "multi-state.js");
const IMAGE_EXPORT_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "image-export.js");
const GROUP_STATE_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "group-state.js");
const GROUP_TABS_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "group-tabs.js");
const TIMEZONE_SEARCH_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "timezone-search.js");
const SNAPSHOT_FORMAT_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "snapshot-format.js");
const TABLE_RENDER_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "table-render.js");
const MULTI_RANGE_RENDER_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "multi-range-render.js");
const MULTI_RANGE_COPY_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "multi-range-copy.js");
const COPY_ACTIONS_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "copy-actions.js");
const TIME_ADJUST_UI_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "time-adjust-ui.js");
const FORMAT_CONTROLS_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "format-controls.js");
const TAB_UI_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "tab-ui.js");
const STATE_PERSISTENCE_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "state-persistence.js");
const SETTINGS_IO_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "settings-io.js");
const DATA_TRANSFER_MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "data-transfer.js");

function createDocumentStub() {
    return {
        addEventListener() {},
        removeEventListener() {},
        getElementById() { return null; },
        querySelectorAll() { return []; },
        querySelector() { return null; },
        createElement() {
            return {
                style: {},
                classList: { add() {}, remove() {}, toggle() {} },
                setAttribute() {},
                removeAttribute() {},
                appendChild() {},
                remove() {},
                click() {}
            };
        },
        body: {
            appendChild() {},
            removeChild() {}
        }
    };
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
    const timeCoreCode = fs.readFileSync(TIME_CORE_MODULE_PATH, "utf8");
    const calculatorCode = fs.readFileSync(CALCULATOR_MODULE_PATH, "utf8");
    const multiStateCode = fs.readFileSync(MULTI_STATE_MODULE_PATH, "utf8");
    const imageExportCode = fs.readFileSync(IMAGE_EXPORT_MODULE_PATH, "utf8");
    const groupStateCode = fs.readFileSync(GROUP_STATE_MODULE_PATH, "utf8");
    const groupTabsCode = fs.readFileSync(GROUP_TABS_MODULE_PATH, "utf8");
    const timezoneSearchCode = fs.readFileSync(TIMEZONE_SEARCH_MODULE_PATH, "utf8");
    const snapshotFormatCode = fs.readFileSync(SNAPSHOT_FORMAT_MODULE_PATH, "utf8");
    const tableRenderCode = fs.readFileSync(TABLE_RENDER_MODULE_PATH, "utf8");
    const multiRangeRenderCode = fs.readFileSync(MULTI_RANGE_RENDER_MODULE_PATH, "utf8");
    const multiRangeCopyCode = fs.readFileSync(MULTI_RANGE_COPY_MODULE_PATH, "utf8");
    const copyActionsCode = fs.readFileSync(COPY_ACTIONS_MODULE_PATH, "utf8");
    const timeAdjustUiCode = fs.readFileSync(TIME_ADJUST_UI_MODULE_PATH, "utf8");
    const formatControlsCode = fs.readFileSync(FORMAT_CONTROLS_MODULE_PATH, "utf8");
    const tabUiCode = fs.readFileSync(TAB_UI_MODULE_PATH, "utf8");
    const statePersistenceCode = fs.readFileSync(STATE_PERSISTENCE_MODULE_PATH, "utf8");
    const settingsIoCode = fs.readFileSync(SETTINGS_IO_MODULE_PATH, "utf8");
    const dataTransferCode = fs.readFileSync(DATA_TRANSFER_MODULE_PATH, "utf8");
    const mainCode = fs.readFileSync(MAIN_JS_PATH, "utf8");
    const documentStub = createDocumentStub();
    const storageStub = createStorageStub();

    const sandbox = {
        console,
        Date,
        Intl,
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
        I18N_DATA: {
            ko: { days: ["일", "월", "화", "수", "목", "금", "토"] },
            en: { days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }
        },
        currentLang: "ko",
        document: documentStub,
        window: {
            addEventListener() {},
            removeEventListener() {},
            innerWidth: 1920,
            innerHeight: 1080
        },
        localStorage: storageStub,
        location: { reload() {} },
        navigator: {
            clipboard: { writeText: async () => {} }
        }
    };

    sandbox.globalThis = sandbox;
    sandbox.global = sandbox;

    vm.createContext(sandbox);
    vm.runInContext(appConfigCode, sandbox, { filename: "js/modules/app-config.js" });
    vm.runInContext(timeCoreCode, sandbox, { filename: "js/modules/time-core.js" });
    vm.runInContext(calculatorCode, sandbox, { filename: "js/modules/calculator.js" });
    vm.runInContext(multiStateCode, sandbox, { filename: "js/modules/multi-state.js" });
    vm.runInContext(imageExportCode, sandbox, { filename: "js/modules/image-export.js" });
    vm.runInContext(groupStateCode, sandbox, { filename: "js/modules/group-state.js" });
    vm.runInContext(groupTabsCode, sandbox, { filename: "js/modules/group-tabs.js" });
    vm.runInContext(timezoneSearchCode, sandbox, { filename: "js/modules/timezone-search.js" });
    vm.runInContext(snapshotFormatCode, sandbox, { filename: "js/modules/snapshot-format.js" });
    vm.runInContext(tableRenderCode, sandbox, { filename: "js/modules/table-render.js" });
    vm.runInContext(multiRangeRenderCode, sandbox, { filename: "js/modules/multi-range-render.js" });
    vm.runInContext(multiRangeCopyCode, sandbox, { filename: "js/modules/multi-range-copy.js" });
    vm.runInContext(copyActionsCode, sandbox, { filename: "js/modules/copy-actions.js" });
    vm.runInContext(timeAdjustUiCode, sandbox, { filename: "js/modules/time-adjust-ui.js" });
    vm.runInContext(formatControlsCode, sandbox, { filename: "js/modules/format-controls.js" });
    vm.runInContext(tabUiCode, sandbox, { filename: "js/modules/tab-ui.js" });
    vm.runInContext(statePersistenceCode, sandbox, { filename: "js/modules/state-persistence.js" });
    vm.runInContext(settingsIoCode, sandbox, { filename: "js/modules/settings-io.js" });
    vm.runInContext(dataTransferCode, sandbox, { filename: "js/modules/data-transfer.js" });
    vm.runInContext(mainCode, sandbox, { filename: "main.js" });

    return {
        sandbox,
        run: (source) => vm.runInContext(source, sandbox)
    };
}
