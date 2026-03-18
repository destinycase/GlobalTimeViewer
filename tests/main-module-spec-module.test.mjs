import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-module-spec.js");

function loadMainModuleSpec() {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = { window: {}, globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/main-module-spec.js" });
    return sandbox.window.GTVMainModuleSpec || sandbox.GTVMainModuleSpec || sandbox.globalThis.GTVMainModuleSpec;
}

describe("GTV main module spec", () => {
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
        expect(specMap.GTV_MAIN_TIMEZONE_RUNTIME_SERVICES.globalName).toBe("GTVMainTimezoneRuntimeServices");
        expect(specMap.GTV_MAIN_TIMEZONE_MUTATION_SERVICES.globalName).toBe("GTVMainTimezoneMutationServices");
        expect(specMap.GTV_MAIN_BASE_TIMEZONE_SERVICES.globalName).toBe("GTVMainBaseTimezoneServices");
        expect(specMap.GTV_MAIN_RUNTIME_COMPOSITION_SERVICES.globalName).toBe("GTVMainRuntimeCompositionServices");
        expect(specMap.GTV_MAIN_GROUP_STATE_SERVICES.globalName).toBe("GTVMainGroupStateServices");
    });
});
