import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-state-domain-wrapper-bridge.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainStateDomainWrapperBridgeModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainStateDomainWrapperBridge", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainStateDomainWrapperBridge || globalThis.GTVMainStateDomainWrapperBridge;
}

describe("GTV main state domain wrapper bridge module", () => {
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

    it("delegates domain wrappers to injected proxy service with defaults", () => {
        const moduleApi = loadMainStateDomainWrapperBridgeModule();
        const proxyService = {
            getDefaultFixedTimeName: vi.fn(() => "slot"),
            sanitizeFixedTimeName: vi.fn(() => "name"),
            sanitizeFixedTimeValue: vi.fn((_value, fallback) => fallback),
            getFixedDatePartsFromGroup: vi.fn(() => ({ y: 2026 })),
            getPersistenceState: vi.fn(() => ({ groups: [] })),
            setPersistenceState: vi.fn((next) => next),
            isFixedTimeTab: vi.fn(() => true),
            isMultiTab: vi.fn(() => false)
        };
        const currentGroup = { id: 2 };
        const service = moduleApi.createService({
            getMainStateDomainProxiesService: () => proxyService,
            getCurrentGroup: () => currentGroup,
            defaultFixedTimeValue: "08:15"
        });

        expect(service.getDefaultFixedTimeName()).toBe("slot");
        expect(service.sanitizeFixedTimeName("x")).toBe("name");
        expect(service.sanitizeFixedTimeValue("x")).toBe("08:15");
        expect(service.getFixedDatePartsFromGroup()).toEqual({ y: 2026 });
        expect(proxyService.getFixedDatePartsFromGroup).toHaveBeenCalledWith(currentGroup);
        expect(service.getPersistenceState()).toEqual({ groups: [] });
        expect(service.setPersistenceState({ activeGroupId: 1 })).toEqual({ activeGroupId: 1 });
        expect(service.isFixedTimeTab()).toBe(true);
        expect(service.isMultiTab()).toBe(false);
    });

    it("throws explicit errors when proxy service or method is unavailable", () => {
        const moduleApi = loadMainStateDomainWrapperBridgeModule();
        const withoutService = moduleApi.createService({
            getMainStateDomainProxiesService: () => null
        });
        expect(() => withoutService.getDefaultFixedTimeName()).toThrow(
            "Main state domain proxy service is unavailable: getDefaultFixedTimeName"
        );

        const missingMethod = moduleApi.createService({
            getMainStateDomainProxiesService: () => ({})
        });
        expect(() => missingMethod.sanitizeMainTab("live")).toThrow(
            "Main state domain proxy service is unavailable: sanitizeMainTab"
        );
    });
});
