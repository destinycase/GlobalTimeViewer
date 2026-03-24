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

    it("delegates full facade surface to format profile state service", () => {
        const moduleApi = loadMainFormatProfileFacadeModule();
        const calls = [];
        const formatProfileStateService = {
            getDefaultFormatEnabled: (mode) => { calls.push(["getDefaultFormatEnabled", mode]); return { mode }; },
            getDefaultTimePartsEnabled: (mode) => { calls.push(["getDefaultTimePartsEnabled", mode]); return { mode, time: true }; },
            normalizeCopyFormatKey: (key) => { calls.push(["normalizeCopyFormatKey", key]); return String(key || "").toUpperCase(); },
            sanitizeCopyFormatOrder: (order) => { calls.push(["sanitizeCopyFormatOrder", order]); return Array.isArray(order) ? order : []; },
            sanitizeCopyFormatEnabled: (enabled, mode) => { calls.push(["sanitizeCopyFormatEnabled", enabled, mode]); return { enabled: !!enabled, mode }; },
            sanitizeTimePartsEnabled: (parts, mode) => { calls.push(["sanitizeTimePartsEnabled", parts, mode]); return { parts, mode }; },
            deriveTimePartsFromLegacyEnabled: (legacy, mode) => { calls.push(["deriveTimePartsFromLegacyEnabled", legacy, mode]); return { legacy, mode }; },
            sanitizeFormatProfileContext: (context) => { calls.push(["sanitizeFormatProfileContext", context]); return context || "live"; },
            getFormatProfileAllowedKeys: (context) => { calls.push(["getFormatProfileAllowedKeys", context]); return [context, "timezone"]; },
            getFormatProfileAllowedTimePartKeys: (context) => { calls.push(["getFormatProfileAllowedTimePartKeys", context]); return [context, "time"]; },
            sanitizeCopyFormatOrderForContext: (order, context) => { calls.push(["sanitizeCopyFormatOrderForContext", order, context]); return [...(order || []), context]; },
            getDefaultFormatEnabledForContext: (mode, context) => { calls.push(["getDefaultFormatEnabledForContext", mode, context]); return { mode, context }; },
            sanitizeCopyFormatEnabledForContext: (enabled, mode, context) => { calls.push(["sanitizeCopyFormatEnabledForContext", enabled, mode, context]); return { enabled, mode, context }; },
            sanitizeTimePartsEnabledForContext: (parts, mode, context) => { calls.push(["sanitizeTimePartsEnabledForContext", parts, mode, context]); return { parts, mode, context }; },
            createDefaultFormatProfile: (context) => { calls.push(["createDefaultFormatProfile", context]); return { order: [context], enabled: {}, timePartsEnabled: {} }; },
            sanitizeFormatProfile: (profile, context) => { calls.push(["sanitizeFormatProfile", profile, context]); return { ...profile, context }; },
            sanitizeFormatProfiles: (profiles, legacy) => { calls.push(["sanitizeFormatProfiles", profiles, legacy]); return { profiles, legacy }; },
            getCurrentFormatProfileState: () => { calls.push(["getCurrentFormatProfileState"]); return { order: ["time"], enabled: { time: true }, timePartsEnabled: { time: true } }; },
            resolveFormatProfileContext: (tab, slotCount) => { calls.push(["resolveFormatProfileContext", tab, slotCount]); return `${tab}:${slotCount}`; },
            ensureFormatProfiles: (legacy) => { calls.push(["ensureFormatProfiles", legacy]); return "ensure"; },
            applyFormatProfileState: (profile, context) => { calls.push(["applyFormatProfileState", profile, context]); return "apply"; },
            syncActiveFormatProfileFromState: () => { calls.push(["syncActiveFormatProfileFromState"]); return "sync"; },
            activateFormatProfileContext: (context, options) => { calls.push(["activateFormatProfileContext", context, options]); return context; },
            activateFormatProfileForCurrentContext: (options) => { calls.push(["activateFormatProfileForCurrentContext", options]); return "activate"; },
            resetDisplayFormatForActiveContext: () => { calls.push(["resetDisplayFormatForActiveContext"]); return "reset-display"; },
            resetCopyFormatForActiveContext: () => { calls.push(["resetCopyFormatForActiveContext"]); return "reset-copy"; }
        };

        const service = moduleApi.createService({
            getFormatProfileStateService: () => formatProfileStateService,
            getActiveFormatProfileContextState: () => "multi",
            getMainTabState: () => "fixed-time",
            getSlotCountState: () => 2
        });

        expect(service.getDefaultFormatEnabled("copy")).toEqual({ mode: "copy" });
        expect(service.getDefaultTimePartsEnabled("copy")).toEqual({ mode: "copy", time: true });
        expect(service.normalizeCopyFormatKey("time")).toBe("TIME");
        expect(service.sanitizeCopyFormatOrder(["timezone"])).toEqual(["timezone"]);
        expect(service.sanitizeCopyFormatEnabled({ time: true }, "copy")).toEqual({ enabled: true, mode: "copy" });
        expect(service.sanitizeTimePartsEnabled({ time: true }, "display")).toEqual({ parts: { time: true }, mode: "display" });
        expect(service.deriveTimePartsFromLegacyEnabled({ date: true }, "copy")).toEqual({ legacy: { date: true }, mode: "copy" });
        expect(service.sanitizeFormatProfileContext("fixed-time")).toBe("fixed-time");
        expect(service.getFormatProfileAllowedKeys()).toEqual(["multi", "timezone"]);
        expect(service.getFormatProfileAllowedTimePartKeys()).toEqual(["multi", "time"]);
        expect(service.sanitizeCopyFormatOrderForContext(["time"])).toEqual(["time", "multi"]);
        expect(service.getDefaultFormatEnabledForContext("display")).toEqual({ mode: "display", context: "multi" });
        expect(service.sanitizeCopyFormatEnabledForContext({ time: true }, "copy")).toEqual({
            enabled: { time: true },
            mode: "copy",
            context: "multi"
        });
        expect(service.sanitizeTimePartsEnabledForContext({ time: true }, "display")).toEqual({
            parts: { time: true },
            mode: "display",
            context: "multi"
        });
        expect(service.createDefaultFormatProfile("live")).toEqual({
            order: ["live"],
            enabled: {},
            timePartsEnabled: {}
        });
        expect(service.sanitizeFormatProfile({ enabled: { time: true } }, "fixed")).toEqual({
            enabled: { time: true },
            context: "fixed"
        });
        expect(service.sanitizeFormatProfiles({ a: 1 }, { b: 2 })).toEqual({ profiles: { a: 1 }, legacy: { b: 2 } });
        expect(service.getCurrentFormatProfileState()).toEqual({
            order: ["time"],
            enabled: { time: true },
            timePartsEnabled: { time: true }
        });
        expect(service.resolveFormatProfileContext()).toBe("fixed-time:2");
        expect(service.ensureFormatProfiles({ legacy: true })).toBe("ensure");
        expect(service.applyFormatProfileState({ order: [] }, "multi")).toBe("apply");
        expect(service.syncActiveFormatProfileFromState()).toBe("sync");
        expect(service.activateFormatProfileContext("live", { persist: true })).toBe("live");
        expect(service.activateFormatProfileForCurrentContext({ syncCurrent: true })).toBe("activate");
        expect(service.resetDisplayFormatForActiveContext()).toBe("reset-display");
        expect(service.resetCopyFormatForActiveContext()).toBe("reset-copy");

        expect(calls.length).toBeGreaterThan(20);
    });

    it("executes fallback getters and context defaults when dependencies are omitted", () => {
        const moduleApi = loadMainFormatProfileFacadeModule();
        const service = moduleApi.createService(null);

        expect(service.getDefaultTimePartsEnabled()).toEqual({});
        expect(service.normalizeCopyFormatKey("time")).toBe("");
        expect(service.deriveTimePartsFromLegacyEnabled({ time: true })).toEqual({});
        expect(service.getFormatProfileAllowedTimePartKeys()).toEqual([]);
        expect(service.getDefaultFormatEnabledForContext()).toEqual({});
        expect(service.sanitizeCopyFormatEnabledForContext({ time: true }, "copy")).toEqual({});
        expect(service.sanitizeTimePartsEnabledForContext({ time: true }, "display")).toEqual({});
        expect(service.sanitizeFormatProfile({}, "fixed")).toEqual({
            order: [],
            enabled: {},
            timePartsEnabled: {}
        });
        expect(service.sanitizeFormatProfiles(null, null)).toEqual({});
        expect(service.resolveFormatProfileContext()).toBe("live");
        expect(service.applyFormatProfileState({}, "live")).toBe(null);
        expect(service.syncActiveFormatProfileFromState()).toBe(null);
        expect(service.resetDisplayFormatForActiveContext()).toBe(null);
        expect(service.resetCopyFormatForActiveContext()).toBe(null);
    });
});
