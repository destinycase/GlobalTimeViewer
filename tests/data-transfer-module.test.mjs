import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "data-transfer.js");

function loadDataTransferModule(options = {}) {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
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
    const sandbox = {
        window: {},
        globalThis: {},
        document: options.document || {
            getElementById() {
                return null;
            }
        },
        console: consoleStub
    };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/data-transfer.js" });
    return {
        module: sandbox.window.GTVDataTransfer || sandbox.GTVDataTransfer || sandbox.globalThis.GTVDataTransfer,
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
});
