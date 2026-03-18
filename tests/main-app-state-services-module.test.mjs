import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-app-state-services.js");

function loadMainAppStateServicesModule() {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = { window: {}, globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/main-app-state-services.js" });
    return sandbox.window.GTVMainAppStateServices || sandbox.GTVMainAppStateServices || sandbox.globalThis.GTVMainAppStateServices;
}

describe("GTV main app state services module", () => {
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
