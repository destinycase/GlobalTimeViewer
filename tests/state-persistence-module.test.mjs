import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "state-persistence.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function createLocalStorageStub() {
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
        },
        snapshot() {
            return new Map(store);
        }
    };
}

function createFailingLocalStorageStub() {
    return {
        getItem() {
            return null;
        },
        setItem() {
            throw new Error("localStorage unavailable");
        },
        removeItem() { },
        snapshot() {
            return new Map();
        }
    };
}

function createStoredPersistenceEnvelope(data, revision = 1, updatedAt = "2026-01-01T00:00:00.000Z") {
    return JSON.stringify({
        __gtvStorageEnvelope: 1,
        meta: {
            revision,
            updatedAt
        },
        data
    });
}

function unwrapStoredPersistencePayload(raw) {
    const parsed = JSON.parse(raw || "null");
    if (
        parsed
        && typeof parsed === "object"
        && parsed.__gtvStorageEnvelope === 1
        && parsed.data
        && typeof parsed.data === "object"
    ) {
        return {
            isEnvelope: true,
            meta: parsed.meta || {},
            data: parsed.data
        };
    }
    return {
        isEnvelope: false,
        meta: null,
        data: parsed
    };
}

function loadStatePersistenceModule(options = {}) {
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
        localStorage: options.localStorage || createLocalStorageStub(),
        document: {
            getElementById() {
                return null;
            }
        },
        confirm: options.confirm || (() => true),
        location: options.location || { reload() { } },
        console: consoleStub,
        chrome: options.chrome
    };

    const keys = ["window", "GTVStatePersistence", ...Object.keys(globalPatches)];
    const previous = new Map();
    keys.forEach((key) => {
        previous.set(key, {
            exists: Object.prototype.hasOwnProperty.call(globalThis, key),
            value: globalThis[key]
        });
    });

    globalThis.window = globalThis;
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
        module: globalThis.GTVStatePersistence,
        logs
    };
}

function createBaseDeps(overrides = {}) {
    return {
        STORAGE_KEY: "TEST_STORAGE_KEY",
        THEME_STORAGE_KEY: "TEST_THEME",
        LANG_STORAGE_KEY: "TEST_LANG",
        UI_SCALE_STORAGE_KEY: "TEST_UI_SCALE",
        LEGACY_STORAGE_KEYS: [],
        LEGACY_STORAGE_FALLBACK_KEYS: [],
        COPY_FORMAT_KEYS: ["timezone"],
        DEFAULT_TIME_ADJUST_DAY_STEP: 1,
        MIN_MULTI_RANGE_COUNT: 1,
        I18N_DATA: { ko: {}, en: {} },
        getDefaultFixedTimes: () => [],
        getState: () => ({}),
        setState: () => { },
        getPersistenceSnapshot: () => ({}),
        ensureGroupMultiSubgroups: () => { },
        sanitizeGroup: (group) => group,
        sanitizeBaseTimezoneId: () => "utc",
        sanitizeMainTab: () => "live",
        sanitizeTimeAdjustDayStep: (value) => value,
        sanitizeCopyFormatOrder: () => ["timezone"],
        sanitizeCopyFormatEnabled: () => ({ timezone: true }),
        sanitizeTimePartsEnabled: () => ({ date: true, time: true }),
        deriveTimePartsFromLegacyEnabled: () => ({ date: true, time: true }),
        sanitizeMultiStatePayload: () => ({
            multiRangeCount: 1,
            multiRangeTitle: "",
            multiRanges: [],
            multiRangeCollapsed: [],
            multiRangeStartEditEnabled: [],
            multiRangeEndEditEnabled: []
        }),
        sanitizeMultiRangeTitle: () => "",
        loadCurrentMultiStateFromActiveSubgroup: () => { },
        ensureBaseTimezoneSelection: () => { },
        syncCurrentMultiStateToActiveSubgroup: () => { },
        loadThemePreference: async () => "dark",
        applyTheme: () => { },
        loadUiScalePreference: async () => 100,
        applyUiScale: () => { },
        populateUiScaleSelect: () => { },
        getCurrentUiScalePercent: () => 100,
        refreshMultiRangeControls: () => { },
        updateTZDropdown: () => { },
        refreshSelectWidths: () => { },
        switchMainTab: () => { },
        showToast: () => { },
        t: (key) => key,
        applyVersionBranding: () => { },
        applyTranslations: () => { },
        ...overrides
    };
}

describe("GTV state persistence module", () => {
    afterEach(() => {
        while (moduleCleanupStack.length) {
            const cleanup = moduleCleanupStack.pop();
            try {
                cleanup();
            } catch {
                // Ignore cleanup failures during tests.
            }
        }
    });

    it("savePersistence returns false when snapshot generation throws", async () => {
        const loaded = loadStatePersistenceModule();
        const mod = loaded.module;
        const toastKeys = [];
        const deps = createBaseDeps({
            getPersistenceSnapshot() {
                throw new Error("snapshot failed");
            },
            showToast(message) {
                toastKeys.push(message);
            }
        });
        const service = mod.createService(deps);

        const ok = await service.savePersistence();

        expect(ok).toBe(false);
        expect(toastKeys).toContain("toast_storage_save_failed");
        expect(loaded.logs.error.length).toBeGreaterThan(0);
    });

    it("savePersistence suppresses toast when suppressToast is true", async () => {
        const loaded = loadStatePersistenceModule();
        const mod = loaded.module;
        const toastKeys = [];
        const deps = createBaseDeps({
            getPersistenceSnapshot() {
                throw new Error("snapshot failed");
            },
            showToast(message) {
                toastKeys.push(message);
            }
        });
        const service = mod.createService(deps);

        const ok = await service.savePersistence({ suppressToast: true });

        expect(ok).toBe(false);
        expect(toastKeys).toHaveLength(0);
    });

    it("setStorageValue falls back to localStorage when chrome.storage.set fails", async () => {
        const chromeSetError = new Error("chrome storage write failed");
        const loaded = loadStatePersistenceModule({
            chrome: {
                storage: {
                    local: {
                        async set() {
                            throw chromeSetError;
                        }
                    }
                }
            }
        });
        const service = loaded.module.createService(createBaseDeps());

        const result = await service.setStorageValue("KEY_A", "VALUE_A");
        const stored = await service.getStorageValue("KEY_A", null);

        expect(result.ok).toBe(true);
        expect(result.error).toBe(null);
        expect(stored).toBe("VALUE_A");
        expect(loaded.logs.warn.length).toBeGreaterThan(0);
        expect(loaded.logs.error).toHaveLength(0);
    });

    it("setStorageValue returns failure when both chrome and localStorage writes fail", async () => {
        const loaded = loadStatePersistenceModule({
            localStorage: createFailingLocalStorageStub(),
            chrome: {
                storage: {
                    local: {
                        async set() {
                            throw new Error("chrome storage write failed");
                        }
                    }
                }
            }
        });
        const toastKeys = [];
        const service = loaded.module.createService(createBaseDeps({
            showToast(message) {
                toastKeys.push(message);
            }
        }));

        const result = await service.setStorageValue("KEY_B", "VALUE_B");

        expect(result.ok).toBe(false);
        expect(result.error).toBeTruthy();
        expect(toastKeys).toContain("toast_storage_save_failed");
        expect(loaded.logs.error.length).toBeGreaterThan(0);
    });

    it("isQuotaExceededError matches known quota signatures", () => {
        const loaded = loadStatePersistenceModule();
        const service = loaded.module.createService(createBaseDeps());

        expect(service.isQuotaExceededError({ code: 22 })).toBe(true);
        expect(service.isQuotaExceededError({ code: 1014 })).toBe(true);
        expect(service.isQuotaExceededError({ name: "QuotaExceededError" })).toBe(true);
        expect(service.isQuotaExceededError({ name: "NS_ERROR_DOM_QUOTA_REACHED" })).toBe(true);
        expect(service.isQuotaExceededError({ code: 99, name: "OtherError" })).toBe(false);
    });

    it("setStorageValue surfaces quota toast key and throttles repeated toasts", async () => {
        const toastKeys = [];
        const loaded = loadStatePersistenceModule({
            localStorage: createFailingLocalStorageStub(),
            chrome: {
                storage: {
                    local: {
                        async set() {
                            const error = new Error("quota exceeded");
                            error.name = "QuotaExceededError";
                            error.code = 22;
                            throw error;
                        }
                    }
                }
            }
        });
        const service = loaded.module.createService(createBaseDeps({
            showToast(message) {
                toastKeys.push(message);
            }
        }));

        const first = await service.setStorageValue("KEY_Q", "VALUE_Q");
        const second = await service.setStorageValue("KEY_Q2", "VALUE_Q2");

        expect(first.ok).toBe(false);
        expect(second.ok).toBe(false);
        expect(toastKeys[0]).toBe("toast_storage_quota_exceeded");
        expect(toastKeys.length).toBe(1);
    });

    it("persistStorageSnapshot handles JSON stringify failure", async () => {
        const toastKeys = [];
        const loaded = loadStatePersistenceModule();
        const service = loaded.module.createService(createBaseDeps({
            showToast(message) {
                toastKeys.push(message);
            }
        }));
        const circular = {};
        circular.self = circular;

        const result = await service.persistStorageSnapshot(circular);

        expect(result.ok).toBe(false);
        expect(toastKeys).toContain("toast_storage_save_failed");
        expect(loaded.logs.error.length).toBeGreaterThan(0);
    });

    it("getStorageValue prefers chrome storage when available", async () => {
        const localStorage = createLocalStorageStub();
        localStorage.setItem("KEY_PREF", "local-value");
        const loaded = loadStatePersistenceModule({
            localStorage,
            chrome: {
                storage: {
                    local: {
                        async get(key) {
                            return { [key]: "chrome-value" };
                        }
                    }
                }
            }
        });
        const service = loaded.module.createService(createBaseDeps());

        const value = await service.getStorageValue("KEY_PREF", null);

        expect(value).toBe("chrome-value");
    });

    it("getStorageValue falls back to localStorage when chrome storage read fails", async () => {
        const localStorage = createLocalStorageStub();
        localStorage.setItem("KEY_FALLBACK", "fallback-value");
        const loaded = loadStatePersistenceModule({
            localStorage,
            chrome: {
                storage: {
                    local: {
                        async get() {
                            throw new Error("chrome get failed");
                        }
                    }
                }
            }
        });
        const service = loaded.module.createService(createBaseDeps());

        const value = await service.getStorageValue("KEY_FALLBACK", null);

        expect(value).toBe("fallback-value");
        expect(loaded.logs.warn.length).toBeGreaterThan(0);
    });

    it("loadPersistence rewrites defaults when stored JSON is invalid", async () => {
        const localStorage = createLocalStorageStub();
        localStorage.setItem("TEST_STORAGE_KEY", "{not-json");
        const loaded = loadStatePersistenceModule({ localStorage });
        const service = loaded.module.createService(createBaseDeps());

        await service.loadPersistence();

        const stored = unwrapStoredPersistencePayload(localStorage.getItem("TEST_STORAGE_KEY"));
        expect(stored.isEnvelope).toBe(true);
        expect(stored.data).toEqual({});
        expect(Number(stored.meta?.revision)).toBeGreaterThanOrEqual(1);
        expect(loaded.logs.warn.length).toBeGreaterThan(0);
    });

    it("loadPersistence applies default state when no persisted payload exists", async () => {
        const localStorage = createLocalStorageStub();
        let appliedState = null;
        const loaded = loadStatePersistenceModule({ localStorage });
        const service = loaded.module.createService(createBaseDeps({
            setState(next) {
                appliedState = next;
            }
        }));

        await service.loadPersistence();

        expect(appliedState).toBeTruthy();
        expect(Array.isArray(appliedState.groups)).toBe(true);
        expect(appliedState.activeGroupId).toBe(0);
        expect(appliedState.currentMainTab).toBe("live");
    });

    it("loadPersistence reads legacy fallback keys when primary key is empty", async () => {
        const legacyPayload = JSON.stringify({
            groups: [{
                name: "Legacy Group",
                zones: [],
                baseTimezoneId: "utc",
                showUtcRow: true,
                utcRowOrder: 0
            }],
            activeGroupId: 0,
            currentMainTab: "fixed",
            activeGroupIdByMainTab: { live: 0, fixed: 0 },
            slotCount: 1,
            showCopyFormat: true,
            showTimeline: true
        });
        const localStorage = createLocalStorageStub();
        localStorage.setItem("LEGACY_KEY_A", legacyPayload);
        let appliedState = null;
        const loaded = loadStatePersistenceModule({ localStorage });
        const service = loaded.module.createService(createBaseDeps({
            LEGACY_STORAGE_KEYS: ["LEGACY_KEY_A"],
            LEGACY_STORAGE_FALLBACK_KEYS: ["LEGACY_KEY_A"],
            setState(next) {
                appliedState = next;
            }
        }));

        await service.loadPersistence();

        expect(appliedState).toBeTruthy();
        expect(appliedState.groups[0].name).toBe("Legacy Group");
    });

    it("savePersistence serializes writes so latest snapshot wins", async () => {
        let releaseFirstWrite = null;
        const storageData = {};
        const loaded = loadStatePersistenceModule({
            chrome: {
                storage: {
                    local: {
                        async set(payload) {
                            const raw = payload.TEST_STORAGE_KEY;
                            const stored = unwrapStoredPersistencePayload(raw);
                            const payloadData = stored.data || {};
                            if (payloadData.version === 1) {
                                await new Promise((resolve) => {
                                    releaseFirstWrite = resolve;
                                });
                            }
                            Object.assign(storageData, payload);
                        },
                        async get(key) {
                            return { [key]: storageData[key] };
                        }
                    }
                }
            }
        });

        let snapshotCallCount = 0;
        const service = loaded.module.createService(createBaseDeps({
            getPersistenceSnapshot() {
                snapshotCallCount += 1;
                return { version: snapshotCallCount };
            }
        }));

        const first = service.savePersistence();
        const second = service.savePersistence();

        for (let i = 0; i < 10 && typeof releaseFirstWrite !== "function"; i++) {
            await Promise.resolve();
        }
        expect(typeof releaseFirstWrite).toBe("function");
        releaseFirstWrite();
        await Promise.all([first, second]);

        const storedRaw = await service.getStorageValue("TEST_STORAGE_KEY", null);
        const stored = unwrapStoredPersistencePayload(storedRaw);
        expect(stored.isEnvelope).toBe(true);
        expect(stored.data.version).toBe(2);
        expect(Number(stored.meta?.revision)).toBeGreaterThanOrEqual(2);
    });

    it("loadPersistence prefers newer local envelope when chrome has stale legacy payload", async () => {
        const staleChromePayload = JSON.stringify({
            groups: [{
                name: "Chrome Legacy Group",
                zones: [],
                baseTimezoneId: "utc",
                showUtcRow: true,
                utcRowOrder: 0
            }],
            activeGroupId: 0,
            currentMainTab: "fixed",
            activeGroupIdByMainTab: { live: 0, fixed: 0 },
            slotCount: 1,
            showCopyFormat: false,
            showTimeline: false
        });
        const freshLocalPayload = {
            groups: [{
                name: "Local Fresh Group",
                zones: [],
                baseTimezoneId: "utc",
                showUtcRow: true,
                utcRowOrder: 0
            }],
            activeGroupId: 0,
            currentMainTab: "live",
            activeGroupIdByMainTab: { live: 0, fixed: 0 },
            slotCount: 1,
            showCopyFormat: true,
            showTimeline: true
        };
        const localStorage = createLocalStorageStub();
        localStorage.setItem(
            "TEST_STORAGE_KEY",
            createStoredPersistenceEnvelope(freshLocalPayload, 7, "2026-03-26T00:00:00.000Z")
        );

        let appliedState = null;
        const loaded = loadStatePersistenceModule({
            localStorage,
            chrome: {
                storage: {
                    local: {
                        async get(key) {
                            return { [key]: staleChromePayload };
                        },
                        async set() {
                            return undefined;
                        }
                    }
                }
            }
        });
        const service = loaded.module.createService(createBaseDeps({
            setState(next) {
                appliedState = next;
            }
        }));

        await service.loadPersistence();

        expect(appliedState).toBeTruthy();
        expect(appliedState.groups[0].name).toBe("Local Fresh Group");
        expect(appliedState.currentMainTab).toBe("live");
    });

    it("resetExceptGroupsAndTimezones aborts early when confirmFn denies", async () => {
        let setStateCalled = 0;
        let syncCalled = 0;
        const loaded = loadStatePersistenceModule({
            confirm: () => {
                throw new Error("global confirm should not be used");
            }
        });
        const service = loaded.module.createService(createBaseDeps({
            confirmFn: () => false,
            syncCurrentMultiStateToActiveSubgroup() {
                syncCalled += 1;
            },
            setState() {
                setStateCalled += 1;
            }
        }));

        await service.resetExceptGroupsAndTimezones();

        expect(syncCalled).toBe(0);
        expect(setStateCalled).toBe(0);
    });

    it("resetExceptGroupsAndTimezones handles non-array groups without crashing", async () => {
        const loaded = loadStatePersistenceModule({ confirm: () => true });
        const capturedStates = [];
        const service = loaded.module.createService(createBaseDeps({
            getState: () => ({ groups: null }),
            setState(next) {
                capturedStates.push(next);
            }
        }));

        await service.resetExceptGroupsAndTimezones();

        const groupsState = capturedStates.find((item) => Array.isArray(item?.groups));
        expect(groupsState).toBeTruthy();
        expect(groupsState.groups.length).toBeGreaterThan(0);
    });

    it("resetExceptGroupsAndTimezones continues when sanitizeGroup throws", async () => {
        const loaded = loadStatePersistenceModule({ confirm: () => true });
        const capturedStates = [];
        let sanitizeCalls = 0;
        const service = loaded.module.createService(createBaseDeps({
            getState: () => ({
                groups: [
                    { name: "A", zones: [], baseTimezoneId: "utc", fixedTimes: [] }
                ]
            }),
            sanitizeGroup() {
                sanitizeCalls += 1;
                throw new Error("sanitize failed");
            },
            setState(next) {
                capturedStates.push(next);
            }
        }));

        await service.resetExceptGroupsAndTimezones();

        const groupsState = capturedStates.find((item) => Array.isArray(item?.groups));
        expect(sanitizeCalls).toBe(1);
        expect(groupsState).toBeTruthy();
        expect(groupsState.groups.length).toBeGreaterThan(0);
        expect(loaded.logs.warn.length).toBeGreaterThan(0);
    });

    it("resetAllSettings uses injected confirmFn and aborts when denied", async () => {
        let confirmCalled = 0;
        const localStorage = createLocalStorageStub();
        localStorage.setItem("TEST_STORAGE_KEY", "{\"hello\":\"world\"}");
        const loaded = loadStatePersistenceModule({
            localStorage,
            confirm: () => {
                throw new Error("global confirm should not be used");
            }
        });
        const service = loaded.module.createService(createBaseDeps({
            confirmFn() {
                confirmCalled += 1;
                return false;
            }
        }));

        await service.resetAllSettings();

        expect(confirmCalled).toBe(1);
        expect(localStorage.getItem("TEST_STORAGE_KEY")).toBe("{\"hello\":\"world\"}");
    });

    it("resetAllSettings resets state without calling location.reload", async () => {
        let reloadCalled = 0;
        const loaded = loadStatePersistenceModule({
            confirm: () => true,
            location: {
                reload() {
                    reloadCalled += 1;
                }
            }
        });
        const capturedStates = [];
        const service = loaded.module.createService(createBaseDeps({
            confirmFn: () => true,
            setState(next) {
                capturedStates.push(next);
            }
        }));

        await service.resetAllSettings();

        expect(reloadCalled).toBe(0);
        const groupsState = capturedStates.find((item) => Array.isArray(item?.groups));
        expect(groupsState).toBeTruthy();
        expect(groupsState.currentMainTab).toBe("live");
        expect(groupsState.slotCount).toBe(1);
    });

    it("loadPersistence includes sanitized formatProfiles when provided", async () => {
        const payload = {
            groups: [{
                name: "G",
                zones: [],
                baseTimezoneId: "utc",
                showUtcRow: true,
                utcRowOrder: 0
            }],
            activeGroupId: 0,
            currentMainTab: "live",
            activeGroupIdByMainTab: { live: 0, fixed: 0 },
            slotCount: 1,
            showCopyFormat: false,
            showTimeline: false,
            displayFormatOrder: ["timezone"],
            displayFormatEnabled: { timezone: true },
            displayTimePartsEnabled: { dn: false, date: true, time: true, weekday: false },
            copyFormatOrder: ["timezone"],
            copyFormatEnabled: { timezone: true },
            copyTimePartsEnabled: { dn: false, date: true, time: true, weekday: false },
            formatProfiles: {
                live: {
                    displayFormatOrder: ["timezone"],
                    copyFormatOrder: ["timezone"]
                }
            }
        };
        const localStorage = createLocalStorageStub();
        localStorage.setItem("TEST_STORAGE_KEY", JSON.stringify(payload));
        const loaded = loadStatePersistenceModule({ localStorage });
        let stateApplied = null;
        const sanitizedProfiles = {
            live: { displayFormatOrder: ["timezone"] },
            fixed: { displayFormatOrder: ["timezone"] },
            "fixed-extra": { displayFormatOrder: ["timezone", "period_days", "period_time"] },
            multi: { displayFormatOrder: ["timezone", "period_days", "period_time"] },
            "fixed-time": { displayFormatOrder: ["timezone"] }
        };
        const service = loaded.module.createService(createBaseDeps({
            setState(next) {
                stateApplied = next;
            },
            sanitizeFormatProfiles() {
                return sanitizedProfiles;
            }
        }));

        await service.loadPersistence();

        expect(stateApplied).toBeTruthy();
        expect(stateApplied.formatProfiles).toBe(sanitizedProfiles);
    });
});
