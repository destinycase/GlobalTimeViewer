import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it, vi } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-format-profile-facade-bindings.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainFormatProfileFacadeBindingsModule() {
    const globalPatches = { window: {} };
    const keys = ["window", "GTVMainFormatProfileFacadeBindings", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainFormatProfileFacadeBindings || globalThis.GTVMainFormatProfileFacadeBindings;
}

describe("GTV main format profile facade bindings module", () => {
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

    it("maps format profile facade methods and exposes them to global root", () => {
        const moduleApi = loadMainFormatProfileFacadeBindingsModule();
        const formatProfileFacadeService = {
            getDefaultFormatEnabled: vi.fn(() => ({ time: true })),
            getDefaultTimePartsEnabled: vi.fn(() => ({ hm: true })),
            normalizeCopyFormatKey: vi.fn((value) => value),
            sanitizeCopyFormatOrder: vi.fn(() => []),
            sanitizeCopyFormatEnabled: vi.fn(() => ({})),
            sanitizeTimePartsEnabled: vi.fn(() => ({})),
            deriveTimePartsFromLegacyEnabled: vi.fn(() => ({})),
            sanitizeFormatProfileContext: vi.fn((value) => value),
            getFormatProfileAllowedKeys: vi.fn(() => []),
            getFormatProfileAllowedTimePartKeys: vi.fn(() => []),
            sanitizeCopyFormatOrderForContext: vi.fn(() => []),
            getDefaultFormatEnabledForContext: vi.fn(() => ({})),
            sanitizeCopyFormatEnabledForContext: vi.fn(() => ({})),
            sanitizeTimePartsEnabledForContext: vi.fn(() => ({})),
            createDefaultFormatProfile: vi.fn(() => ({})),
            sanitizeFormatProfile: vi.fn(() => ({})),
            sanitizeFormatProfiles: vi.fn(() => ({})),
            getCurrentFormatProfileState: vi.fn(() => ({})),
            resolveFormatProfileContext: vi.fn(() => "live"),
            ensureFormatProfiles: vi.fn(() => ({})),
            applyFormatProfileState: vi.fn(() => ({})),
            syncActiveFormatProfileFromState: vi.fn(() => undefined),
            activateFormatProfileContext: vi.fn(() => undefined),
            activateFormatProfileForCurrentContext: vi.fn(() => undefined),
            resetDisplayFormatForActiveContext: vi.fn(() => undefined),
            resetCopyFormatForActiveContext: vi.fn(() => undefined)
        };
        const globalRoot = {};

        const service = moduleApi.createService({
            formatProfileFacadeService,
            globalRoot
        });

        expect(service.getDefaultFormatEnabled()).toEqual({ time: true });
        expect(service.getDefaultTimePartsEnabled()).toEqual({ hm: true });
        expect(globalRoot.resetCopyFormatForActiveContext).toBe(service.resetCopyFormatForActiveContext);
        expect(typeof globalRoot.sanitizeCopyFormatOrderForContext).toBe("function");
    });

    it("can skip global exposure and throws for missing dependency", () => {
        const moduleApi = loadMainFormatProfileFacadeBindingsModule();
        const globalRoot = {};
        const service = moduleApi.createService({
            formatProfileFacadeService: {
                getDefaultFormatEnabled: () => ({}),
                getDefaultTimePartsEnabled: () => ({}),
                normalizeCopyFormatKey: () => "",
                sanitizeCopyFormatOrder: () => [],
                sanitizeCopyFormatEnabled: () => ({}),
                sanitizeTimePartsEnabled: () => ({}),
                deriveTimePartsFromLegacyEnabled: () => ({}),
                sanitizeFormatProfileContext: () => "",
                getFormatProfileAllowedKeys: () => [],
                getFormatProfileAllowedTimePartKeys: () => [],
                sanitizeCopyFormatOrderForContext: () => [],
                getDefaultFormatEnabledForContext: () => ({}),
                sanitizeCopyFormatEnabledForContext: () => ({}),
                sanitizeTimePartsEnabledForContext: () => ({}),
                createDefaultFormatProfile: () => ({}),
                sanitizeFormatProfile: () => ({}),
                sanitizeFormatProfiles: () => ({}),
                getCurrentFormatProfileState: () => ({}),
                resolveFormatProfileContext: () => "live",
                ensureFormatProfiles: () => ({}),
                applyFormatProfileState: () => ({}),
                syncActiveFormatProfileFromState: () => undefined,
                activateFormatProfileContext: () => undefined,
                activateFormatProfileForCurrentContext: () => undefined,
                resetDisplayFormatForActiveContext: () => undefined,
                resetCopyFormatForActiveContext: () => undefined
            },
            globalRoot,
            exposeToGlobal: false
        });

        expect(globalRoot.getDefaultFormatEnabled).toBeUndefined();
        expect(typeof service.getDefaultFormatEnabled).toBe("function");
        expect(() => moduleApi.createService({})).toThrow("Missing dependency: formatProfileFacadeService");
    });
});
