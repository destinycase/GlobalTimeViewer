import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-module-spec.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainModuleSpec() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainModuleSpec", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainModuleSpec || globalThis.GTVMainModuleSpec;
}

describe("GTV main module spec", () => {
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
    it("provides resolver spec map with required entries and validators", () => {
        const moduleSpecApi = loadMainModuleSpec();
        const specMap = moduleSpecApi.createSpecMap();

        expect(specMap.GTV_SERVICE_BOOTSTRAP.requiredMethod).toBe("createService");
        expect(specMap.GTV_CALCULATOR.optional).toBe(true);
        expect(typeof specMap.GTV_TIMEZONE_DATA.validate).toBe("function");
        expect(specMap.GTV_MAIN_IMAGE_EXPORT_BRIDGE_PROXY.globalName).toBe("GTVMainImageExportBridgeProxy");
        expect(specMap.GTV_MAIN_ROW_ORDER_SERVICES.globalName).toBe("GTVMainRowOrderServices");
        expect(specMap.GTV_MAIN_ROW_VIEW_SERVICES.globalName).toBe("GTVMainRowViewServices");
        expect(specMap.GTV_MAIN_SELECT_SERVICES.globalName).toBe("GTVMainSelectServices");
        expect(specMap.GTV_MAIN_GROUP_LOCALIZATION_SERVICES.globalName).toBe("GTVMainGroupLocalizationServices");
        expect(specMap.GTV_MAIN_ORCHESTRATION_FLOW_SERVICES.globalName).toBe("GTVMainOrchestrationFlowServices");
        expect(specMap.GTV_MAIN_PERSISTENCE_SNAPSHOT_SERVICES.globalName).toBe("GTVMainPersistenceSnapshotServices");
        expect(specMap.GTV_MAIN_PERSISTENCE_COMPOSITION_SERVICES.globalName).toBe("GTVMainPersistenceCompositionServices");
        expect(specMap.GTV_MAIN_CLOCK_ORCHESTRATOR_SERVICES.globalName).toBe("GTVMainClockOrchestratorServices");
        expect(specMap.GTV_MAIN_CORE_SERVICE_ASSEMBLY.globalName).toBe("GTVMainCoreServiceAssembly");
        expect(specMap.GTV_MAIN_SHARED_UTILS.globalName).toBe("GTVMainSharedUtils");
        expect(specMap.GTV_MAIN_SERVICE_METHOD_BRIDGE.globalName).toBe("GTVMainServiceMethodBridge");
        expect(specMap.GTV_MAIN_DIRECT_STATE_PATCH.globalName).toBe("GTVMainDirectStatePatch");
        expect(specMap.GTV_MAIN_APP_STATE_BRIDGE.globalName).toBe("GTVMainAppStateBridge");
        expect(specMap.GTV_MAIN_PATCHED_STATE_SELECTORS.globalName).toBe("GTVMainPatchedStateSelectors");
        expect(specMap.GTV_MAIN_FORMAT_PROFILE_FACADE.globalName).toBe("GTVMainFormatProfileFacade");
        expect(specMap.GTV_MAIN_TIMELINE_FACADE.globalName).toBe("GTVMainTimelineFacade");
        expect(specMap.GTV_MAIN_FIXED_TIME_FACADE.globalName).toBe("GTVMainFixedTimeFacade");
        expect(specMap.GTV_MAIN_TIMEZONE_FACADE.globalName).toBe("GTVMainTimezoneFacade");
        expect(specMap.GTV_MAIN_TIMEZONE_TABLE_FACADE.globalName).toBe("GTVMainTimezoneTableFacade");
        expect(specMap.GTV_MAIN_TIME_ADJUST_FACADE.globalName).toBe("GTVMainTimeAdjustFacade");
        expect(specMap.GTV_MAIN_FIXED_TIME_TAB_FACADE.globalName).toBe("GTVMainFixedTimeTabFacade");
        expect(specMap.GTV_MAIN_MULTI_RANGE_TAB_FACADE.globalName).toBe("GTVMainMultiRangeTabFacade");
        expect(specMap.GTV_MAIN_APP_BOOTSTRAP.globalName).toBe("GTVMainAppBootstrap");
        expect(specMap.GTV_MAIN_TIMEZONE_RUNTIME_SERVICES.globalName).toBe("GTVMainTimezoneRuntimeServices");
        expect(specMap.GTV_MAIN_TIMEZONE_RUNTIME_BRIDGE.globalName).toBe("GTVMainTimezoneRuntimeBridge");
        expect(specMap.GTV_MAIN_TIMEZONE_MUTATION_SERVICES.globalName).toBe("GTVMainTimezoneMutationServices");
        expect(specMap.GTV_MAIN_BASE_TIMEZONE_SERVICES.globalName).toBe("GTVMainBaseTimezoneServices");
        expect(specMap.GTV_MAIN_RUNTIME_COMPOSITION_SERVICES.globalName).toBe("GTVMainRuntimeCompositionServices");
        expect(specMap.GTV_MAIN_GROUP_STATE_SERVICES.globalName).toBe("GTVMainGroupStateServices");
    });
});
