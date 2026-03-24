import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "data-transfer.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadDataTransferModule(options = {}) {
    const logs = {
        error: [],
        warn: [],
        log: []
    };
    const consoleStub = {
        error(...args) {
            logs.error.push(args);
        },
        warn(...args) {
            logs.warn.push(args);
        },
        log(...args) {
            logs.log.push(args);
        }
    };
    const globalPatches = {
        window: {},
        document: options.document || {
            getElementById() {
                return null;
            }
        },
        console: consoleStub
    };
    const keys = ["window", "document", "console", "GTVDataTransfer", ...Object.keys(globalPatches)];
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

    return {
        module: globalThis.window?.GTVDataTransfer || globalThis.GTVDataTransfer,
        logs
    };
}

function createBaseDeps(overrides = {}) {
    const groups = [
        {
            name: "Group A",
            zones: [],
            baseTimezoneId: "utc",
            showUtcRow: true,
            utcRowOrder: 0,
            fixedTimes: [],
            activeMultiSubgroupId: "sg-1",
            multiSubgroups: [
                {
                    id: "sg-1",
                    name: "Subgroup 1",
                    multiRangeCount: 1,
                    multiRanges: [{ startUtcMs: 1, endUtcMs: 2 }],
                    multiRangeCollapsed: [false],
                    multiRangeStartEditEnabled: [false],
                    multiRangeEndEditEnabled: [true]
                }
            ]
        }
    ];
    return {
        VERSION: "test",
        MIN_MULTI_RANGE_COUNT: 1,
        I18N_DATA: { ko: {}, en: {} },
        getGroups: () => groups,
        getActiveGroupId: () => 0,
        getCurrentTheme: () => "dark",
        getCurrentLang: () => "ko",
        getPersistenceSnapshot: () => ({}),
        getCurrentUiScalePercent: () => 100,
        sanitizeTheme: (theme) => theme,
        sanitizeFilenamePart: (value) => String(value || ""),
        pad: (value) => String(value).padStart(2, "0"),
        syncCurrentMultiStateToActiveSubgroup: () => { },
        ensureGroupMultiSubgroups: () => { },
        sanitizeGroup: (group) => ({
            name: group?.name || "Imported",
            zones: Array.isArray(group?.zones) ? group.zones : [],
            baseTimezoneId: group?.baseTimezoneId || "utc",
            showUtcRow: true,
            utcRowOrder: 0,
            fixedTimes: [],
            activeMultiSubgroupId: "sg-1",
            multiSubgroups: [
                {
                    id: "sg-1",
                    name: "Subgroup 1",
                    multiRangeCount: 1,
                    multiRanges: [{ startUtcMs: 1, endUtcMs: 2 }],
                    multiRangeCollapsed: [false],
                    multiRangeStartEditEnabled: [false],
                    multiRangeEndEditEnabled: [true]
                }
            ]
        }),
        loadCurrentMultiStateFromActiveSubgroup: () => { },
        savePersistence: async () => true,
        renderGroups: () => { },
        renderMultiSubgroups: () => { },
        renderBaseTimeSelect: () => { },
        renderMultiRanges: () => { },
        renderList: () => { },
        isMultiTab: () => false,
        sanitizeMultiSubgroupId: (value) => value,
        sanitizeMultiSubgroupName: (value, fallback = "") => String(value || fallback || ""),
        getDefaultMultiSubgroupName: () => "Subgroup",
        sanitizeMultiStatePayload: () => ({
            multiRangeCount: 1,
            multiRanges: [{ startUtcMs: 1, endUtcMs: 2 }],
            multiRangeCollapsed: [false],
            multiRangeStartEditEnabled: [false],
            multiRangeEndEditEnabled: [true]
        }),
        getCurrentMultiSubgroup: () => ({ id: "sg-1" }),
        applyImportedSettings: async () => { },
        isQuotaExceededError: () => false,
        showToast: () => { },
        t: (key) => key,
        tFormat: (_key, payload) => String(payload?.filename || ""),
        ...overrides
    };
}

describe("GTV data transfer module", () => {
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

    it("shows storage save failed toast when group import cannot persist", async () => {
        const loaded = loadDataTransferModule();
        const toasts = [];
        const service = loaded.module.createService(createBaseDeps({
            savePersistence: async () => false,
            showToast(message) {
                toasts.push(message);
            }
        }));
        const input = {
            value: "selected",
            files: [{
                name: "group.json",
                async text() {
                    return JSON.stringify({
                        type: "group",
                        group: {
                            name: "Imported Group",
                            zones: []
                        }
                    });
                }
            }]
        };

        await service.handleGroupImportFile({ target: input });

        expect(toasts).toContain("toast_storage_save_failed");
        expect(input.value).toBe("");
    });

    it("shows storage save failed toast when subgroup import cannot persist", async () => {
        const loaded = loadDataTransferModule();
        const toasts = [];
        const service = loaded.module.createService(createBaseDeps({
            savePersistence: async () => false,
            showToast(message) {
                toasts.push(message);
            }
        }));
        const input = {
            value: "selected",
            files: [{
                name: "subgroup.json",
                async text() {
                    return JSON.stringify({
                        type: "subgroup",
                        subgroup: {
                            name: "Imported Subgroup",
                            multiRangeCount: 1,
                            multiRanges: [{ startUtcMs: 1, endUtcMs: 2 }],
                            multiRangeCollapsed: [false],
                            multiRangeStartEditEnabled: [false],
                            multiRangeEndEditEnabled: [true]
                        }
                    });
                }
            }]
        };

        await service.handleSubgroupImportFile({ target: input });

        expect(toasts).toContain("toast_storage_save_failed");
        expect(input.value).toBe("");
    });

    it("clears pending group import state when no file is selected", async () => {
        const loaded = loadDataTransferModule();
        const toasts = [];
        const service = loaded.module.createService(createBaseDeps({
            showToast(message) {
                toasts.push(message);
            }
        }));
        const input = {
            value: "selected",
            files: []
        };

        await service.handleGroupImportFile({ target: input });

        expect(input.value).toBe("");
        expect(toasts).toHaveLength(0);
    });

    it("triggerGroupImportFor clears file input value and invokes click", () => {
        let clickCount = 0;
        const groupImportInput = {
            value: "selected",
            click() {
                clickCount += 1;
            }
        };
        const loaded = loadDataTransferModule({
            document: {
                getElementById(id) {
                    if (id === "group-import-file") return groupImportInput;
                    return null;
                }
            }
        });
        const service = loaded.module.createService(createBaseDeps());

        service.triggerGroupImportFor(0);

        expect(groupImportInput.value).toBe("");
        expect(clickCount).toBe(1);
    });

    it("triggerSubgroupImportFor does not click file input for invalid target subgroup", () => {
        let clickCount = 0;
        const subgroupImportInput = {
            value: "selected",
            click() {
                clickCount += 1;
            }
        };
        const loaded = loadDataTransferModule({
            document: {
                getElementById(id) {
                    if (id === "subgroup-import-file") return subgroupImportInput;
                    return null;
                }
            }
        });
        const groups = [{
            name: "Group A",
            zones: [],
            activeMultiSubgroupId: "sg-1",
            multiSubgroups: [{ id: "sg-1", name: "Subgroup 1" }]
        }];
        const service = loaded.module.createService(createBaseDeps({
            getGroups: () => groups
        }));

        service.triggerSubgroupImportFor(0, "unknown-subgroup");

        expect(clickCount).toBe(0);
    });

    it("handleSettingsImportFile shows invalid format toast for malformed JSON", async () => {
        const loaded = loadDataTransferModule();
        const toasts = [];
        const service = loaded.module.createService(createBaseDeps({
            showToast(message) {
                toasts.push(String(message));
            }
        }));
        const input = {
            value: "selected",
            files: [{
                name: "settings.json",
                async text() {
                    return "{invalid-json";
                }
            }]
        };

        await service.handleSettingsImportFile({ target: input });

        expect(toasts).toContain("toast_invalid_format");
        expect(input.value).toBe("");
    });

    it("handleSettingsImportFile maps persistence and quota failures to proper toasts", async () => {
        const loaded = loadDataTransferModule();
        const toasts = [];
        const serviceQuota = loaded.module.createService(createBaseDeps({
            applyImportedSettings: async () => {
                const err = new Error("save failed");
                err.code = "PERSISTENCE_WRITE_FAILED";
                err.cause = { quota: true };
                throw err;
            },
            isQuotaExceededError: (err) => !!err?.quota,
            showToast(message) {
                toasts.push(String(message));
            }
        }));
        const input = {
            value: "selected",
            files: [{
                name: "settings.json",
                async text() {
                    return JSON.stringify({ groups: [] });
                }
            }]
        };

        await serviceQuota.handleSettingsImportFile({ target: input });
        expect(toasts).toContain("toast_storage_quota_exceeded");

        toasts.length = 0;
        const serviceSaveFailed = loaded.module.createService(createBaseDeps({
            applyImportedSettings: async () => {
                const err = new Error("save failed");
                err.code = "PERSISTENCE_WRITE_FAILED";
                err.cause = {};
                throw err;
            },
            isQuotaExceededError: () => false,
            showToast(message) {
                toasts.push(String(message));
            }
        }));

        await serviceSaveFailed.handleSettingsImportFile({ target: input });
        expect(toasts).toContain("toast_storage_save_failed");
    });

    it("exportSettingsToJSON creates a download anchor and emits success toast", () => {
        const anchors = [];
        const loaded = loadDataTransferModule({
            document: {
                getElementById() {
                    return null;
                },
                createElement(tag) {
                    if (tag !== "a") return {};
                    return {
                        href: "",
                        download: "",
                        clicked: 0,
                        click() {
                            this.clicked += 1;
                        },
                        remove() { }
                    };
                },
                body: {
                    appendChild(node) {
                        anchors.push(node);
                    }
                }
            }
        });
        const toasts = [];
        const service = loaded.module.createService(createBaseDeps({
            getPersistenceSnapshot: () => ({ groups: [{ name: "A" }] }),
            getCurrentTheme: () => "light",
            getCurrentLang: () => "en",
            getCurrentUiScalePercent: () => 110,
            showToast(message) {
                toasts.push(String(message));
            },
            tFormat(key, payload) {
                return `${key}:${payload?.filename || ""}`;
            }
        }));

        service.exportSettingsToJSON();

        expect(anchors).toHaveLength(1);
        expect(anchors[0].download.startsWith("GlobalTimeViewer_settings_")).toBe(true);
        expect(anchors[0].download.endsWith(".json")).toBe(true);
        expect(anchors[0].clicked).toBe(1);
        expect(toasts[0].startsWith("toast_settings_export_success:")).toBe(true);
    });

    it("exportGroupToJSON maps DOM failures to failure toast", () => {
        const loaded = loadDataTransferModule({
            document: {
                getElementById() {
                    return null;
                },
                createElement() {
                    throw new Error("dom-create-failed");
                },
                body: {
                    appendChild() { }
                }
            }
        });
        const toasts = [];
        const service = loaded.module.createService(createBaseDeps({
            showToast(message) {
                toasts.push(String(message));
            }
        }));

        service.exportGroupToJSON(0);

        expect(toasts).toContain("toast_group_export_failed");
        expect(loaded.logs.error.length).toBeGreaterThan(0);
    });

    it("triggerSubgroupImportFor clicks input for a valid subgroup target", () => {
        let clickCount = 0;
        const subgroupImportInput = {
            value: "selected",
            click() {
                clickCount += 1;
            }
        };
        const loaded = loadDataTransferModule({
            document: {
                getElementById(id) {
                    if (id === "subgroup-import-file") return subgroupImportInput;
                    return null;
                }
            }
        });
        const service = loaded.module.createService(createBaseDeps());

        service.triggerSubgroupImportFor(0, "sg-1");

        expect(subgroupImportInput.value).toBe("");
        expect(clickCount).toBe(1);
    });

    it("handleGroupImportFile maps invalid payload type to invalid format toast", async () => {
        const loaded = loadDataTransferModule();
        const toasts = [];
        const service = loaded.module.createService(createBaseDeps({
            showToast(message) {
                toasts.push(String(message));
            }
        }));
        const input = {
            value: "selected",
            files: [{
                name: "wrong-type.json",
                async text() {
                    return JSON.stringify({
                        type: "subgroup",
                        subgroup: {
                            name: "S",
                            multiRangeCount: 1,
                            multiRanges: [{ startUtcMs: 1, endUtcMs: 2 }],
                            multiRangeCollapsed: [false],
                            multiRangeStartEditEnabled: [false],
                            multiRangeEndEditEnabled: [true]
                        }
                    });
                }
            }]
        };

        await service.handleGroupImportFile({ target: input });

        expect(toasts).toContain("toast_invalid_format");
        expect(input.value).toBe("");
    });

    it("handleSubgroupImportFile maps invalid payload type to invalid format toast", async () => {
        const loaded = loadDataTransferModule();
        const toasts = [];
        const service = loaded.module.createService(createBaseDeps({
            showToast(message) {
                toasts.push(String(message));
            }
        }));
        const input = {
            value: "selected",
            files: [{
                name: "wrong-type.json",
                async text() {
                    return JSON.stringify({
                        type: "group",
                        group: {
                            name: "G",
                            zones: []
                        }
                    });
                }
            }]
        };

        await service.handleSubgroupImportFile({ target: input });

        expect(toasts).toContain("toast_invalid_format");
        expect(input.value).toBe("");
    });

    it("handleSettingsImportFile maps unknown errors to settings import failed toast", async () => {
        const loaded = loadDataTransferModule();
        const toasts = [];
        const service = loaded.module.createService(createBaseDeps({
            applyImportedSettings: async () => {
                throw new Error("unknown failure");
            },
            showToast(message) {
                toasts.push(String(message));
            }
        }));
        const input = {
            value: "selected",
            files: [{
                name: "settings.json",
                async text() {
                    return JSON.stringify({ groups: [] });
                }
            }]
        };

        await service.handleSettingsImportFile({ target: input });

        expect(toasts).toContain("toast_settings_import_failed");
        expect(input.value).toBe("");
    });

    it("exportSubgroupToJSON creates a download anchor and emits success toast", () => {
        const anchors = [];
        const loaded = loadDataTransferModule({
            document: {
                getElementById() {
                    return null;
                },
                createElement(tag) {
                    if (tag !== "a") return {};
                    return {
                        href: "",
                        download: "",
                        clicked: 0,
                        click() {
                            this.clicked += 1;
                        },
                        remove() { }
                    };
                },
                body: {
                    appendChild(node) {
                        anchors.push(node);
                    }
                }
            }
        });
        const toasts = [];
        const service = loaded.module.createService(createBaseDeps({
            showToast(message) {
                toasts.push(String(message));
            },
            tFormat(key, payload) {
                return `${key}:${payload?.filename || ""}`;
            }
        }));

        service.exportSubgroupToJSON(0, "sg-1");

        expect(anchors).toHaveLength(1);
        expect(anchors[0].download.startsWith("GlobalTimeViewer_subgroup_")).toBe(true);
        expect(anchors[0].download.endsWith(".json")).toBe(true);
        expect(anchors[0].clicked).toBe(1);
        expect(toasts[0].startsWith("toast_subgroup_export_success:")).toBe(true);
    });
});
