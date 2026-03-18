import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-multi-range-services.js");

function loadMainMultiRangeServicesModule() {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = { window: {}, globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/main-multi-range-services.js" });
    return sandbox.window.GTVMainMultiRangeServices || sandbox.GTVMainMultiRangeServices || sandbox.globalThis.GTVMainMultiRangeServices;
}

describe("GTV main multi-range services module", () => {
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
