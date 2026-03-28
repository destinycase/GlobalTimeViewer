import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-composition-config-builder.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainCompositionConfigBuilderModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainCompositionConfigBuilder", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainCompositionConfigBuilder || globalThis.GTVMainCompositionConfigBuilder;
}

describe("GTV main composition config builder module", () => {
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

    it("builds persistence composition config with expected nested bindings", () => {
        const moduleApi = loadMainCompositionConfigBuilderModule();
        const builder = moduleApi.createService();
        const deps = {
            GTV_MAIN_GROUP_TABS_SERVICE: { id: "group-tabs-service" },
            GTV_MAIN_PERSISTENCE_SNAPSHOT_SERVICES: { id: "snapshot-services" },
            GTV_MAIN_PERSISTENCE_SERVICES: { id: "persistence-services" },
            deferDynamicCall: (getRef) => (...args) => getRef()(...args),
            getShowToastRef: () => (message) => `toast:${message}`,
            getRenderListRef: () => () => "render-list",
            getRenderTimelineFrameRef: () => () => "render-timeline",
            confirmFnViaMainFoundation: () => true,
            bindFacadeMethod: (getFacade, methodName) => (...args) => getFacade()[methodName](...args),
            getTimezoneSearchServiceRef: () => ({
                updateTZDropdown: () => "updated"
            }),
            getDocumentRefOrNull: () => ({ id: "doc" }),
            getRuntimeNowMs: () => 1234
        };

        const config = builder.buildPersistenceCompositionConfig(deps);

        expect(config.GTV_MAIN_GROUP_TABS_SERVICE).toEqual({ id: "group-tabs-service" });
        expect(config.snapshotConfig.now()).toBe(1234);
        expect(config.groupTabsConfig.showToast("ok")).toBe("toast:ok");
        expect(config.groupTabsConfig.renderList()).toBe("render-list");
        expect(config.groupTabsConfig.renderTimelineFrame()).toBe("render-timeline");
        expect(config.persistenceConfig.updateTZDropdown()).toBe("updated");
        expect(config.persistenceConfig.document).toEqual({ id: "doc" });
    });

    it("builds runtime composition config with deferred actions and environment refs", () => {
        const moduleApi = loadMainCompositionConfigBuilderModule();
        const builder = moduleApi.createService();
        const deps = {
            GTV_MAIN_UI_RUNTIME_SERVICES: { id: "ui-runtime" },
            GTV_MAIN_CLOCK_ORCHESTRATOR_SERVICES: { id: "clock-orchestrator" },
            GTV_TIMELINE_FRAME: { id: "timeline-frame" },
            GTV_FIXED_TIME_TABLE: { id: "fixed-time-table" },
            GTV_MAIN_UI_INIT: { id: "ui-init" },
            deferDynamicCall: (getRef) => (...args) => getRef()(...args),
            getUpdateClocksRef: () => () => "update-clocks",
            getShowToastRef: () => (message) => `toast:${message}`,
            getRenderListRef: () => () => "render-list",
            getRenderTimelineFrameRef: () => () => "render-timeline",
            getDocumentRefOrNull: () => ({ id: "doc" }),
            getWindowRefOrNull: () => ({ id: "win" }),
            getGlobalThisRefOrNull: () => ({ id: "global" })
        };

        const config = builder.buildRuntimeCompositionConfig(deps);

        expect(config.GTV_MAIN_UI_RUNTIME_SERVICES).toEqual({ id: "ui-runtime" });
        expect(config.moduleDeps.GTV_TIMELINE_FRAME).toEqual({ id: "timeline-frame" });
        expect(config.actions.updateClocks()).toBe("update-clocks");
        expect(config.actions.showToast("warn")).toBe("toast:warn");
        expect(config.actions.renderList()).toBe("render-list");
        expect(config.actions.renderTimelineFrame()).toBe("render-timeline");
        expect(config.environment.getDocumentRef).toBe(deps.getDocumentRefOrNull);
        expect(config.environment.getWindowRef).toBe(deps.getWindowRefOrNull);
        expect(config.environment.getGlobalThisRef).toBe(deps.getGlobalThisRefOrNull);
    });
});
