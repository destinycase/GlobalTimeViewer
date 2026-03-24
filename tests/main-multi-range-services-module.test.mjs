import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-multi-range-services.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadMainMultiRangeServicesModule() {
    const globalPatches = { window: {}, console };
    const keys = ["window", "console", "GTVMainMultiRangeServices", ...Object.keys(globalPatches)];
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

    return globalThis.window?.GTVMainMultiRangeServices || globalThis.GTVMainMultiRangeServices;
}

describe("GTV main multi-range services module", () => {
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
    it("creates multi-range render/copy/copy-actions services and preserves cross-service callbacks", () => {
        const moduleApi = loadMainMultiRangeServicesModule();
        let renderConfig = null;
        let copyConfig = null;
        let copyActionsConfig = null;
        let copiedRangeIdx = -1;

        const services = moduleApi.createService({
            GTV_MULTI_RANGE_RENDER: {
                createService: (cfg) => {
                    renderConfig = cfg;
                    return {
                        id: "render",
                        getMultiRangeTitleText: (rangeIdx) => `title-${rangeIdx}`
                    };
                }
            },
            GTV_MULTI_RANGE_COPY: {
                createService: (cfg) => {
                    copyConfig = cfg;
                    return {
                        id: "copy",
                        copyWholeMultiRange: (rangeIdx) => {
                            copiedRangeIdx = rangeIdx;
                        },
                        copyAllMultiRangeTimezones: async () => {}
                    };
                }
            },
            GTV_COPY_ACTIONS: {
                createService: (cfg) => {
                    copyActionsConfig = cfg;
                    return { id: "copy-actions" };
                }
            },
            t: (key) => key,
            showToast: () => {},
            getCopyFormatOrder: () => [],
            getCopyFormatEnabled: () => ({}),
            getCopyTimePartsEnabled: () => ({}),
            copyAllMultiRangeTimezones: async () => {},
            writeClipboard: async () => {}
        });

        expect(services.multiRangeRenderService.id).toBe("render");
        expect(services.multiRangeCopyService.id).toBe("copy");
        expect(services.copyActionsService.id).toBe("copy-actions");

        expect(typeof renderConfig.copyWholeMultiRange).toBe("function");
        renderConfig.copyWholeMultiRange(2);
        expect(copiedRangeIdx).toBe(2);

        expect(typeof copyConfig.getMultiRangeTitleText).toBe("function");
        expect(copyConfig.getMultiRangeTitleText(3, {}, {})).toBe("title-3");
        expect(typeof copyActionsConfig.copyAllMultiRangeTimezones).toBe("function");
    });

    it("throws when required module APIs are missing", () => {
        const moduleApi = loadMainMultiRangeServicesModule();
        expect(() => moduleApi.createService({})).toThrow("Missing required module API: GTVMultiRangeRender.createService");
    });
});
