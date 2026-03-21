import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-timezone-table-facade.js");

function loadMainTimezoneTableFacadeModule({ withWindow = true } = {}) {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = withWindow ? { window: {}, globalThis: {}, console } : { globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/main-timezone-table-facade.js" });
    return sandbox.window?.GTVMainTimezoneTableFacade
        || sandbox.GTVMainTimezoneTableFacade
        || sandbox.globalThis.GTVMainTimezoneTableFacade;
}

function createCallServiceMethod() {
    return (_serviceName, serviceRef, methodName, args = [], options = {}) => {
        if (serviceRef && typeof serviceRef[methodName] === "function") {
            return serviceRef[methodName](...args);
        }
        return options.fallback;
    };
}

describe("GTV main timezone table facade module", () => {
    it("delegates list/timezone/copy actions through injected services", async () => {
        const moduleApi = loadMainTimezoneTableFacadeModule();
        const tableRenderService = {
            renderList: () => "table-rendered"
        };
        const timezoneFacadeService = {
            createStandardTimezoneFromSelectableEntry: (entry) => ({ ...entry, type: "standard" }),
            addTimezone: () => true,
            removeTimezone: () => "removed"
        };
        const copyActionsService = {
            updateCopyFormatPreview: () => "preview-updated",
            copyAllTimezones: async () => "copied"
        };
        const service = moduleApi.createService({
            callServiceMethod: createCallServiceMethod(),
            getTableRenderService: () => tableRenderService,
            getMainTimezoneFacadeService: () => timezoneFacadeService,
            getCopyActionsService: () => copyActionsService,
            isFixedTimeTab: () => false
        });

        expect(service.renderList()).toBe("table-rendered");
        expect(service.createStandardTimezoneFromSelectableEntry({ zone: "Asia/Seoul" }).type).toBe("standard");
        expect(service.addTimezone({ id: "tz-1" })).toBe(true);
        expect(service.removeTimezone("tz-1")).toBe("removed");
        expect(service.updateCopyFormatPreview()).toBe("preview-updated");
        await expect(service.copyAllTimezones()).resolves.toBe("copied");
    });

    it("routes renderList to fixed-time renderer when fixed tab is active", () => {
        const moduleApi = loadMainTimezoneTableFacadeModule();
        const service = moduleApi.createService({
            callServiceMethod: createCallServiceMethod(),
            isFixedTimeTab: () => true,
            renderFixedTimeTab: () => "fixed-rendered"
        });

        expect(service.renderList()).toBe("fixed-rendered");
    });

    it("provides stable fallback values when dependencies are missing", async () => {
        const moduleApi = loadMainTimezoneTableFacadeModule({ withWindow: false });
        const service = moduleApi.createService({
            callServiceMethod: createCallServiceMethod(),
            isFixedTimeTab: () => false
        });

        expect(service.renderList()).toBe(undefined);
        expect(service.createStandardTimezoneFromSelectableEntry({ zone: "X" })).toBe(null);
        expect(service.addTimezone({ id: "tz-1" })).toBe(false);
        expect(service.removeTimezone("tz-1")).toBe(undefined);
        expect(service.updateCopyFormatPreview()).toBe(undefined);
        await expect(service.copyAllTimezones()).resolves.toBe(false);
    });

    it("works without any dependency wiring", async () => {
        const moduleApi = loadMainTimezoneTableFacadeModule({ withWindow: false });
        const service = moduleApi.createService();

        expect(service.renderList()).toBe(undefined);
        expect(service.createStandardTimezoneFromSelectableEntry({ zone: "X" })).toBe(undefined);
        expect(service.addTimezone({ id: "tz-1" })).toBe(undefined);
        expect(service.removeTimezone("tz-1")).toBe(undefined);
        expect(service.updateCopyFormatPreview()).toBe(undefined);
        await expect(service.copyAllTimezones()).resolves.toBe(undefined);
    });
});
