import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "src", "js", "modules", "state-persistence.js");
const NORMALIZER_MODULE_PATH = path.resolve(process.cwd(), "src", "js", "modules", "persistence-state-normalizer.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const NORMALIZER_MODULE_ID = require.resolve(NORMALIZER_MODULE_PATH);
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

function createUnusedChromeStorage() {
    const calls = [];
    const record = (method) => async (...args) => {
        calls.push([method, ...args]);
        return {};
    };
    return {
        calls,
        chrome: { storage: { local: { get: record("get"), set: record("set"), remove: record("remove") } } }
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

    const keys = ["window", "GTVStatePersistence", "GTVPersistenceStateNormalizer", ...Object.keys(globalPatches)];
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
    delete require.cache[NORMALIZER_MODULE_ID];
    require(NORMALIZER_MODULE_PATH);
    require(MODULE_PATH);
    moduleCleanupStack.push(() => {
        delete require.cache[MODULE_ID];
        delete require.cache[NORMALIZER_MODULE_ID];
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

    it("setStorageValue and getStorageValue use localStorage only and stay async", async () => {
        const localStorage = createLocalStorageStub();
        const unusedChrome = createUnusedChromeStorage();
        const loaded = loadStatePersistenceModule({ localStorage, chrome: unusedChrome.chrome });
        const service = loaded.module.createService(createBaseDeps({ chromeRef: unusedChrome.chrome }));

        const writePromise = service.setStorageValue("KEY_A", "VALUE_A");
        const readPromise = service.getStorageValue("KEY_A", null);
        expect(writePromise).toBeInstanceOf(Promise);
        expect(readPromise).toBeInstanceOf(Promise);

        expect(await writePromise).toEqual({ ok: true, error: null });
        expect(await readPromise).toBe("VALUE_A");
        expect(localStorage.getItem("KEY_A")).toBe("VALUE_A");
        expect(await service.getStorageValue("MISSING", "fallback")).toBe("fallback");
        expect(unusedChrome.calls).toEqual([]);
        expect(loaded.logs.warn).toHaveLength(0);
        expect(loaded.logs.error).toHaveLength(0);
    });

    it("setStorageValue returns failure with a save-failed toast when localStorage write fails", async () => {
        const loaded = loadStatePersistenceModule({
            localStorage: createFailingLocalStorageStub()
        });
        const toastKeys = [];
        const service = loaded.module.createService(createBaseDeps({
            showToast(message) {
                toastKeys.push(message);
            }
        }));

        const result = await service.setStorageValue("KEY_B", "VALUE_B");

        expect(result.ok).toBe(false);
        expect(result.error.message).toBe('Failed to write localStorage key "KEY_B".');
        expect(toastKeys).toEqual(["toast_storage_save_failed"]);
        expect(loaded.logs.warn.length).toBeGreaterThan(0);
        expect(loaded.logs.error.length).toBeGreaterThan(0);
    });

    it("setStorageValue can suppress the failure toast", async () => {
        const loaded = loadStatePersistenceModule({ localStorage: createFailingLocalStorageStub() });
        const toastKeys = [];
        const service = loaded.module.createService(createBaseDeps({
            showToast(message) {
                toastKeys.push(message);
            }
        }));

        const result = await service.setStorageValue("KEY_S", "VALUE_S", { suppressToast: true });

        expect(result.ok).toBe(false);
        expect(toastKeys).toEqual([]);
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

    it("setStorageValue throttles repeated failure toasts", async () => {
        const toastKeys = [];
        const loaded = loadStatePersistenceModule({
            localStorage: createFailingLocalStorageStub()
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
        expect(toastKeys).toEqual(["toast_storage_save_failed"]);
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

    it("getStorageValue reads localStorage even when chrome.storage exists", async () => {
        const localStorage = createLocalStorageStub();
        localStorage.setItem("KEY_PREF", "local-value");
        const unusedChrome = createUnusedChromeStorage();
        const loaded = loadStatePersistenceModule({ localStorage, chrome: unusedChrome.chrome });
        const service = loaded.module.createService(createBaseDeps());

        expect(await service.getStorageValue("KEY_PREF", null)).toBe("local-value");
        expect(unusedChrome.calls).toEqual([]);
    });

    it("getStorageValue returns the fallback when localStorage read throws", async () => {
        const loaded = loadStatePersistenceModule({
            localStorage: {
                getItem() {
                    throw new Error("read blocked");
                },
                setItem() {},
                removeItem() {}
            }
        });
        const service = loaded.module.createService(createBaseDeps());

        expect(await service.getStorageValue("KEY_FALLBACK", "fallback-value")).toBe("fallback-value");
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

    it("loadPersistence preserves fixed-time main tab when sanitizer allows it", async () => {
        const localStorage = createLocalStorageStub();
        localStorage.setItem("TEST_STORAGE_KEY", JSON.stringify({
            groups: [{
                name: "Fixed Time Group",
                zones: [],
                baseTimezoneId: "utc",
                showUtcRow: true,
                utcRowOrder: 0,
                fixedDate: "2026-03-31",
                fixedTimes: [{ id: "ft-1", name: "A", time: "09:00" }]
            }],
            activeGroupId: 0,
            currentMainTab: "fixed-time",
            activeGroupIdByMainTab: { live: 0, fixed: 0 },
            slotCount: 1,
            showCopyFormat: false,
            showTimeline: true
        }));
        let appliedState = null;
        const loaded = loadStatePersistenceModule({ localStorage });
        const service = loaded.module.createService(createBaseDeps({
            sanitizeMainTab(value) {
                return value;
            },
            setState(next) {
                appliedState = next;
            }
        }));

        await service.loadPersistence();

        expect(appliedState).toBeTruthy();
        expect(appliedState.currentMainTab).toBe("fixed-time");
        expect(appliedState.isRealtime).toBe(false);
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

    it("loadPersistence falls back to LEGACY_STORAGE_KEYS when fallback key list is empty", async () => {
        const legacyPayload = JSON.stringify({
            groups: [{
                name: "Legacy Via Main Keys",
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
        localStorage.setItem("LEGACY_KEY_MAIN", legacyPayload);
        let appliedState = null;
        const loaded = loadStatePersistenceModule({ localStorage });
        const service = loaded.module.createService(createBaseDeps({
            LEGACY_STORAGE_KEYS: ["LEGACY_KEY_MAIN"],
            LEGACY_STORAGE_FALLBACK_KEYS: [],
            setState(next) {
                appliedState = next;
            }
        }));

        await service.loadPersistence();

        expect(appliedState).toBeTruthy();
        expect(appliedState.groups[0].name).toBe("Legacy Via Main Keys");
    });

    it("savePersistence serializes writes so latest snapshot wins", async () => {
        const writes = [];
        const localStorage = createLocalStorageStub();
        const baseSetItem = localStorage.setItem.bind(localStorage);
        localStorage.setItem = (key, value) => {
            writes.push(unwrapStoredPersistencePayload(value));
            baseSetItem(key, value);
        };
        const loaded = loadStatePersistenceModule({ localStorage });

        let snapshotCallCount = 0;
        const service = loaded.module.createService(createBaseDeps({
            getPersistenceSnapshot() {
                snapshotCallCount += 1;
                return { version: snapshotCallCount };
            }
        }));

        const results = await Promise.all([service.savePersistence(), service.savePersistence()]);

        expect(results).toEqual([true, true]);
        expect(writes.map((w) => [w.data.version, Number(w.meta.revision)])).toEqual([[1, 1], [2, 2]]);
        const stored = unwrapStoredPersistencePayload(await service.getStorageValue("TEST_STORAGE_KEY", null));
        expect(stored.isEnvelope).toBe(true);
        expect(stored.data.version).toBe(2);
    });

    it("persistStorageSnapshot serializes direct writes so later payload wins", async () => {
        const writes = [];
        const localStorage = createLocalStorageStub();
        const baseSetItem = localStorage.setItem.bind(localStorage);
        localStorage.setItem = (key, value) => {
            writes.push(unwrapStoredPersistencePayload(value));
            baseSetItem(key, value);
        };
        const loaded = loadStatePersistenceModule({ localStorage });
        const service = loaded.module.createService(createBaseDeps());

        const [firstResult, secondResult] = await Promise.all([
            service.persistStorageSnapshot({ version: 1 }),
            service.persistStorageSnapshot({ version: 2 })
        ]);

        expect(firstResult.ok).toBe(true);
        expect(secondResult.ok).toBe(true);
        expect(writes.map((w) => [w.data.version, Number(w.meta.revision)])).toEqual([[1, 1], [2, 2]]);
        const stored = unwrapStoredPersistencePayload(localStorage.getItem("TEST_STORAGE_KEY"));
        expect(stored.data.version).toBe(2);
    });

    it("loadPersistence reads the current localStorage envelope and ignores chrome.storage", async () => {
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
        const unusedChrome = createUnusedChromeStorage();

        let appliedState = null;
        const loaded = loadStatePersistenceModule({ localStorage, chrome: unusedChrome.chrome });
        const service = loaded.module.createService(createBaseDeps({
            setState(next) {
                appliedState = next;
            },
            getPersistenceSnapshot: () => ({ version: "next" })
        }));

        await service.loadPersistence();
        await service.savePersistence();

        expect(appliedState.groups[0].name).toBe("Local Fresh Group");
        expect(appliedState.currentMainTab).toBe("live");
        expect(Number(unwrapStoredPersistencePayload(localStorage.getItem("TEST_STORAGE_KEY")).meta.revision)).toBe(8);
        expect(unusedChrome.calls).toEqual([]);
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

    it("supports explicit *Ref dependency keys for document and localStorage", async () => {
        const globalStorage = createLocalStorageStub();
        globalStorage.setItem("GLOBAL_ONLY", "keep");
        const localStorageRef = createLocalStorageStub();
        localStorageRef.setItem("TEST_LANG", "en");
        localStorageRef.setItem("TEST_THEME", "dark");
        localStorageRef.setItem("TEST_UI_SCALE", "110");
        const langSelect = { value: "" };
        const themeSelect = { value: "" };
        const uiScaleSelect = { value: "" };
        const dayStartSelect = { value: "" };
        const nightStartSelect = { value: "" };
        let confirmCount = 0;
        let populateUiScaleCount = 0;
        const loaded = loadStatePersistenceModule({
            localStorage: globalStorage,
            confirm: () => {
                throw new Error("global confirm should not be used");
            },
            chrome: null
        });
        const service = loaded.module.createService(createBaseDeps({
            confirmFn() {
                confirmCount += 1;
                return true;
            },
            documentRef: {
                getElementById(id) {
                    if (id === "lang-select") return langSelect;
                    if (id === "theme-select") return themeSelect;
                    if (id === "ui-scale-select") return uiScaleSelect;
                    if (id === "day-start-select") return dayStartSelect;
                    if (id === "night-start-select") return nightStartSelect;
                    return null;
                }
            },
            localStorageRef,
            loadThemePreference: async () => "light",
            loadUiScalePreference: async () => 125,
            getCurrentUiScalePercent: () => 125,
            populateUiScaleSelect() {
                populateUiScaleCount += 1;
            },
            getPersistenceSnapshot: () => ({ reset: true })
        }));

        await service.resetAllSettings();

        expect(confirmCount).toBe(1);
        expect(localStorageRef.getItem("TEST_THEME")).toBe(null);
        expect(localStorageRef.getItem("TEST_LANG")).toBe(null);
        expect(localStorageRef.getItem("TEST_UI_SCALE")).toBe(null);
        expect(langSelect.value).toBe("ko");
        expect(themeSelect.value).toBe("light");
        expect(uiScaleSelect.value).toBe("125");
        expect(dayStartSelect.value).toBe("6");
        expect(nightStartSelect.value).toBe("18");
        expect(populateUiScaleCount).toBe(1);
        expect(globalStorage.getItem("GLOBAL_ONLY")).toBe("keep");

        const storedRaw = localStorageRef.getItem("TEST_STORAGE_KEY");
        const stored = unwrapStoredPersistencePayload(storedRaw);
        expect(stored.isEnvelope).toBe(true);
        expect(stored.data).toEqual({ reset: true });
    });

    it("prefers injected getDocumentRefOrNull when direct document dep is unusable", async () => {
        const langSelect = { value: "" };
        const themeSelect = { value: "" };
        const uiScaleSelect = { value: "" };
        const dayStartSelect = { value: "" };
        const nightStartSelect = { value: "" };
        let confirmCount = 0;
        const loaded = loadStatePersistenceModule({
            confirm: () => {
                throw new Error("global confirm should not be used");
            },
            chrome: null
        });
        const service = loaded.module.createService(createBaseDeps({
            confirmFn() {
                confirmCount += 1;
                return true;
            },
            document: {
                getElementById() {
                    throw new Error("direct document dep should not be used");
                }
            },
            getDocumentRefOrNull: () => ({
                getElementById(id) {
                    if (id === "lang-select") return langSelect;
                    if (id === "theme-select") return themeSelect;
                    if (id === "ui-scale-select") return uiScaleSelect;
                    if (id === "day-start-select") return dayStartSelect;
                    if (id === "night-start-select") return nightStartSelect;
                    return null;
                }
            }),
            loadThemePreference: async () => "light",
            loadUiScalePreference: async () => 125,
            getCurrentUiScalePercent: () => 125,
            getPersistenceSnapshot: () => ({ reset: true })
        }));

        await service.resetAllSettings();

        expect(confirmCount).toBe(1);
        expect(langSelect.value).toBe("ko");
        expect(themeSelect.value).toBe("light");
        expect(uiScaleSelect.value).toBe("125");
        expect(dayStartSelect.value).toBe("6");
        expect(nightStartSelect.value).toBe("18");
    });

    it("createService tolerates null deps for storage helpers", async () => {
        const loaded = loadStatePersistenceModule();
        const service = loaded.module.createService(null);

        const writeResult = await service.setStorageValue("NULL_KEY", "NULL_VALUE");
        const storedValue = await service.getStorageValue("NULL_KEY", null);

        expect(writeResult.ok).toBe(true);
        expect(storedValue).toBe("NULL_VALUE");
        expect(service.getDefaultGroups()[0].name).toBe("default_group_name");
        await expect(service.loadPersistence()).resolves.toBeUndefined();
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
