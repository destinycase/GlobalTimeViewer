import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-format-profile-facade.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainFormatProfileFacadeModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainFormatProfileFacade", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainFormatProfileFacade || globalThis.GTVMainFormatProfileFacade;
}

describe("GTV main format profile facade module", () => {
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
    it("delegates calls to format profile state service with default context wiring", () => {
        const moduleApi = loadMainFormatProfileFacadeModule();
        const calls = {};
        const formatProfileStateService = {
            sanitizeCopyFormatOrderForContext(order, context) {
                calls.sanitizeCopyFormatOrderForContext = [order, context];
                return [...order, context];
            },
            resolveFormatProfileContext(tab, slotCount) {
                calls.resolveFormatProfileContext = [tab, slotCount];
                return `${tab}:${slotCount}`;
            },
            getFormatProfileAllowedKeys(context) {
                calls.getFormatProfileAllowedKeys = [context];
                return [context, "extra"];
            },
            activateFormatProfileContext(context, options) {
                calls.activateFormatProfileContext = [context, options];
                return context;
            }
        };

        const service = moduleApi.createService({
            getFormatProfileStateService: () => formatProfileStateService,
            getActiveFormatProfileContextState: () => "fixed-time",
            getMainTabState: () => "multi",
            getSlotCountState: () => 4
        });

        expect(service.sanitizeCopyFormatOrderForContext(["time"])).toEqual(["time", "fixed-time"]);
        expect(calls.sanitizeCopyFormatOrderForContext).toEqual([["time"], "fixed-time"]);

        expect(service.resolveFormatProfileContext()).toBe("multi:4");
        expect(calls.resolveFormatProfileContext).toEqual(["multi", 4]);

        expect(service.getFormatProfileAllowedKeys()).toEqual(["fixed-time", "extra"]);
        expect(calls.getFormatProfileAllowedKeys).toEqual(["fixed-time"]);

        expect(service.activateFormatProfileContext("live", { persist: true })).toBe("live");
        expect(calls.activateFormatProfileContext).toEqual(["live", { persist: true }]);
    });

    it("returns stable fallback values when state service is unavailable", () => {
        const moduleApi = loadMainFormatProfileFacadeModule();
        const service = moduleApi.createService({
            getActiveFormatProfileContextState: () => "fixed-time",
            getMainTabState: () => "multi",
            getSlotCountState: () => 2
        });

        expect(service.getDefaultFormatEnabled()).toEqual({});
        expect(service.sanitizeCopyFormatOrder(["date"])).toEqual([]);
        expect(service.sanitizeCopyFormatEnabled({ date: true }, "copy")).toEqual({});
        expect(service.sanitizeTimePartsEnabled({ day: true }, "display")).toEqual({});
        expect(service.getFormatProfileAllowedKeys()).toEqual([]);
        expect(service.createDefaultFormatProfile()).toEqual({
            order: [],
            enabled: {},
            timePartsEnabled: {}
        });
        expect(service.getCurrentFormatProfileState()).toEqual({
            order: [],
            enabled: {},
            timePartsEnabled: {}
        });
        expect(service.resolveFormatProfileContext()).toBe("multi");
        expect(service.activateFormatProfileContext("fixed-time")).toBe("fixed-time");
        expect(Object.isFrozen(service)).toBe(true);
    });
});
