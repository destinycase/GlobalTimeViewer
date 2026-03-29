import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-runtime-public-api-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainRuntimePublicApiBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainRuntimePublicApiBindings", ...Object.keys(globalPatches)];
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

    return (
        globalThis.window?.GTVMainRuntimePublicApiBindings
        || globalThis.GTVMainRuntimePublicApiBindings
    );
}

describe("GTV main runtime public api bindings module", () => {
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

    it("creates delegated wrapper methods with default arguments preserved", async () => {
        const moduleApi = loadMainRuntimePublicApiBindingsModule();
        const uiService = {
            showToast: vi.fn(() => "toast-ok"),
            resolveFixedTimeSlotUtcDate: vi.fn(() => "fixed-slot"),
            switchMainTab: vi.fn(() => "switched"),
            showFatalError: vi.fn(() => "fatal"),
            startBootstrapOnDomReady: vi.fn()
        };
        const operationService = {
            formatSnapshotText: vi.fn(() => "formatted"),
            copyText: vi.fn(async () => "copied")
        };
        const bootstrapService = {
            initApp: vi.fn(async () => "init-ok"),
            startBootstrapOnDomReady: vi.fn(() => "started")
        };

        const service = moduleApi.createService({
            getUiBridgeAccessorService: () => uiService,
            getOperationAccessorService: () => operationService,
            getBootstrapAccessorService: () => bootstrapService,
            getGlobalTimeState: () => "anchor-now",
            defaultCopyTimePartsEnabled: { ms: true }
        });

        expect(service.showToast("hello")).toBe("toast-ok");
        expect(service.switchMainTab("fixed")).toBe("switched");
        expect(service.resolveFixedTimeSlotUtcDate("slot", "base")).toBe("fixed-slot");
        expect(service.formatSnapshotText("snapshot", [], {})).toBe("formatted");
        expect(await service.copyText("copy-field")).toBe("copied");
        expect(await service.initApp()).toBe("init-ok");
        expect(service.startBootstrapOnDomReady(() => {})).toBe("started");

        expect(uiService.resolveFixedTimeSlotUtcDate).toHaveBeenCalledWith("slot", "base", "anchor-now");
        expect(operationService.formatSnapshotText).toHaveBeenCalledWith("snapshot", [], {}, { ms: true });
        expect(Object.isFrozen(service)).toBe(true);
    });

    it("uses direct service object fallbacks when getter deps are omitted", () => {
        const moduleApi = loadMainRuntimePublicApiBindingsModule();
        const service = moduleApi.createService({
            uiBridgeAccessorService: {
                getDisplayColumns: (count) => count
            },
            operationAccessorService: {
                getPersistenceSnapshot: () => ({ ok: true })
            },
            bootstrapAccessorService: {
                startBootstrapOnDomReady: () => "boot"
            }
        });

        expect(service.getDisplayColumns(3)).toBe(3);
        expect(service.getPersistenceSnapshot()).toEqual({ ok: true });
        expect(service.startBootstrapOnDomReady(() => {})).toBe("boot");
    });
});
