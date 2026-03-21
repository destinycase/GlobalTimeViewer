import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-format-profile-facade.js");

function loadMainFormatProfileFacadeModule() {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = { window: {}, globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/main-format-profile-facade.js" });
    return sandbox.window.GTVMainFormatProfileFacade
        || sandbox.GTVMainFormatProfileFacade
        || sandbox.globalThis.GTVMainFormatProfileFacade;
}

describe("GTV main format profile facade module", () => {
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
});
