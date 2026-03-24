import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-app-state-services.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainAppStateServicesModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainAppStateServices", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainAppStateServices || globalThis.GTVMainAppStateServices;
}

describe("GTV main app state services module", () => {
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
    it("creates app state patcher/persistence services using injected APIs", () => {
        const moduleApi = loadMainAppStateServicesModule();
        let patcherConfig = null;
        let persistenceConfig = null;
        let lastPatch = null;
        const snapshot = { activeGroupId: 2, currentMainTab: "fixed" };

        const services = moduleApi.createService({
            GTV_APP_STATE_PATCHER: {
                createService: (cfg) => {
                    patcherConfig = cfg;
                    return {
                        getStateSnapshot: () => snapshot,
                        applyStatePatch: (next) => {
                            lastPatch = next;
                        }
                    };
                }
            },
            GTV_APP_PERSISTENCE_STATE: {
                createService: (cfg) => {
                    persistenceConfig = cfg;
                    return cfg;
                }
            },
            getStateSource: () => ({ activeGroupId: 2 }),
            stateSetters: { activeGroupId: () => {} },
            setIsRealtimeState: () => {},
            syncActiveFormatProfileFromState: () => {},
            ensureFormatProfiles: () => {},
            getCurrentFormatProfileState: () => ({}),
            resolveFormatProfileContext: () => "fixed",
            applyFormatProfileState: () => {}
        });

        expect(typeof patcherConfig.getStateSource).toBe("function");
        expect(patcherConfig.getStateSource()).toEqual({ activeGroupId: 2 });
        expect(patcherConfig.stateSetters).toHaveProperty("activeGroupId");

        expect(services.appPersistenceStateService.getState()).toBe(snapshot);
        services.appPersistenceStateService.setState({ currentMainTab: "live" });
        expect(lastPatch).toEqual({ currentMainTab: "live" });

        expect(typeof persistenceConfig.syncActiveFormatProfileFromState).toBe("function");
        expect(typeof persistenceConfig.resolveFormatProfileContext).toBe("function");
        expect(persistenceConfig.resolveFormatProfileContext()).toBe("fixed");
    });

    it("throws when required module apis are missing", () => {
        const moduleApi = loadMainAppStateServicesModule();
        expect(() => moduleApi.createService({})).toThrow("Missing required module API: GTVAppStatePatcher.createService");
    });
});
