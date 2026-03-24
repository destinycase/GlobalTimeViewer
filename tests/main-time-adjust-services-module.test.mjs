import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-time-adjust-services.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainTimeAdjustServicesModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainTimeAdjustServices", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainTimeAdjustServices || globalThis.GTVMainTimeAdjustServices;
}

describe("GTV main time-adjust services module", () => {
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
    it("creates time-adjust/ui-bulk services and wires ui-dependent callbacks", () => {
        const moduleApi = loadMainTimeAdjustServicesModule();
        let uiConfig = null;
        let bulkConfig = null;
        let actionsConfig = null;
        let forcePersistCalled = 0;

        const services = moduleApi.createService({
            GTV_TIME_ADJUST_UI: {
                createService: (cfg) => {
                    uiConfig = cfg;
                    return {
                        id: "ui",
                        renderTimeAdjustSet: (slotIdx) => `set-${slotIdx}`,
                        createTimeAdjustActionButton: (labelKey, slotIdx) => `${labelKey}-${slotIdx}`,
                        createTimeAdjustDivider: () => "divider"
                    };
                }
            },
            GTV_MULTI_BULK_TOOLS: {
                createService: (cfg) => {
                    bulkConfig = cfg;
                    return { id: "bulk" };
                }
            },
            GTV_TIME_ADJUST_ACTIONS: {
                createService: (cfg) => {
                    actionsConfig = cfg;
                    return { id: "actions" };
                }
            },
            MIN_TIME_ADJUST_DAY_STEP: 1,
            MAX_TIME_ADJUST_DAY_STEP: 36500,
            DEFAULT_TIME_ADJUST_DAY_STEP: 1,
            t: (key) => key,
            savePersistence: () => {},
            applyTimeAdjustAction: () => {},
            getCurrentMainTab: () => "live",
            isRealtime: () => false,
            getSlotCount: () => 1,
            getTimeAdjustDayStepValue: () => 1,
            setTimeAdjustDayStepValue: () => {},
            upgradeNativeTitleTooltips: () => {},
            getMultiRangeCount: () => 1,
            applyBulkRangeAllAction: () => {},
            applyFirstRangeStartAdjustAction: () => {},
            setAllMultiRangeStartEditEnabled: () => {},
            setAllMultiRangeEndEditEnabled: () => {},
            getGlobalTimes: () => [new Date()],
            updateClocks: () => {},
            getBaseTimezoneRef: () => ({ id: "utc" }),
            getFixedOffsetForDisplay: () => 0,
            getFixedOffsetForDisplayAtDate: () => 0,
            getCustomOffsetMinutes: () => 0,
            getTimeAdjustDayStep: () => 1,
            timeService: { adjustDate: (date) => date },
            sanitizeUtcMs: (value) => value,
            ensureMultiRangeState: () => {},
            getMultiRanges: () => [],
            isMultiRangeStartLinked: () => false,
            isMultiTab: () => true,
            renderMultiRanges: () => {},
            savePersistenceForce: () => {
                forcePersistCalled += 1;
            },
            isMultiRangeStartEditEnabled: () => true,
            isMultiRangeEndEditEnabled: () => true,
            syncLinkedRangesFrom: () => {},
            getMultiRangeSlotDate: () => new Date(),
            setMultiRangeSlotDate: () => {},
            syncFollowingRangesByDuration: () => {},
            syncMultiRangeStartLinks: () => {}
        });

        expect(services.timeAdjustUiService.id).toBe("ui");
        expect(services.multiBulkToolsService.id).toBe("bulk");
        expect(services.timeAdjustActionsService.id).toBe("actions");

        expect(typeof uiConfig.getTimeAdjustDayStepValue).toBe("function");
        expect(bulkConfig.renderTimeAdjustSet(2, {})).toBe("set-2");
        expect(bulkConfig.createTimeAdjustActionButton("btn_now", 1)).toBe("btn_now-1");
        expect(bulkConfig.createTimeAdjustDivider()).toBe("divider");

        actionsConfig.savePersistence();
        expect(forcePersistCalled).toBe(1);
    });

    it("throws when required module APIs are missing", () => {
        const moduleApi = loadMainTimeAdjustServicesModule();
        expect(() => moduleApi.createService({})).toThrow("Missing required module API: GTVTimeAdjustUI.createService");
    });
});
