import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-timezone-facade.js");

function loadMainTimezoneFacadeModule({ withWindow = true } = {}) {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = withWindow ? { window: {}, globalThis: {}, console } : { globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/main-timezone-facade.js" });
    return sandbox.window?.GTVMainTimezoneFacade
        || sandbox.GTVMainTimezoneFacade
        || sandbox.globalThis.GTVMainTimezoneFacade;
}

function createCallServiceMethod() {
    return (_serviceName, serviceRef, methodName, args = [], options = {}) => {
        if (serviceRef && typeof serviceRef[methodName] === "function") {
            return serviceRef[methodName](...args);
        }
        return options.fallback;
    };
}

describe("GTV main timezone facade module", () => {
    it("delegates to runtime/base/mutation services when available", () => {
        const moduleApi = loadMainTimezoneFacadeModule();
        const runtimeBridgeService = {
            getTimezoneOffset: () => 540,
            getZoneAbbreviation: () => "KST",
            getZoneDisplayName: () => "Korea Standard Time"
        };
        const baseService = {
            setCurrentGroupBaseTimezoneId: () => true,
            applyCurrentGroupBaseTimezoneId: () => "applied"
        };
        const mutationService = {
            getUsedTimezoneIds: () => new Set(["utc", "tz-1"]),
            createUniqueTimezoneId: (prefix) => `${prefix}-x`,
            addTimezone: () => true,
            removeTimezone: () => "removed"
        };
        const timezoneSearchService = {
            createStandardTimezoneFromSelectableEntry: (entry) => ({ ...entry, type: "standard" })
        };
        const timeCore = {
            sanitizeTimezoneId: (value) => String(value).trim(),
            sanitizeBaseTimezoneId: (value) => String(value).toLowerCase()
        };

        const service = moduleApi.createService({
            callServiceMethod: createCallServiceMethod(),
            getMainTimezoneRuntimeBridgeService: () => runtimeBridgeService,
            getMainBaseTimezoneService: () => baseService,
            getMainTimezoneMutationService: () => mutationService,
            getTimezoneSearchService: () => timezoneSearchService,
            getTimeCore: () => timeCore
        });

        expect(service.getTimezoneOffset("Asia/Seoul", new Date())).toBe(540);
        expect(service.getZoneAbbreviation({ zone: "Asia/Seoul" }, new Date())).toBe("KST");
        expect(service.getZoneDisplayName({ zone: "Asia/Seoul" })).toBe("Korea Standard Time");
        expect(service.setCurrentGroupBaseTimezoneId("tz-1")).toBe(true);
        expect(service.applyCurrentGroupBaseTimezoneId("tz-1", {})).toBe("applied");
        expect([...service.getUsedTimezoneIds()]).toEqual(["utc", "tz-1"]);
        expect(service.createUniqueTimezoneId("tz")).toBe("tz-x");
        expect(service.addTimezone({ id: "tz-1" })).toBe(true);
        expect(service.removeTimezone("tz-1")).toBe("removed");
        expect(service.sanitizeTimezoneId("  tz-1  ")).toBe("tz-1");
        expect(service.sanitizeBaseTimezoneId("UTC")).toBe("utc");
        expect(service.createStandardTimezoneFromSelectableEntry({ zone: "Asia/Seoul" }).type).toBe("standard");
    });

    it("applies deterministic fallback behavior when services are missing", () => {
        const moduleApi = loadMainTimezoneFacadeModule();
        const service = moduleApi.createService({
            callServiceMethod: createCallServiceMethod(),
            getMainTimezoneRuntimeBridgeService: () => null,
            getMainBaseTimezoneService: () => null,
            getMainTimezoneMutationService: () => null,
            getTimezoneSearchService: () => null,
            getTimeCore: () => ({}),
            now: () => 1000,
            randomInt: () => 777,
            initialTimezoneIdSeed: 0
        });

        expect(service.getTimezoneOffset("Asia/Seoul", new Date())).toBe(0);
        expect(service.getZoneAbbreviation({ zone: "Asia/Seoul" }, new Date())).toBe("");
        expect(service.sanitizeTimezoneId(null)).toBe("");
        expect(service.sanitizeBaseTimezoneId(null)).toBe("utc");
        expect(service.setCurrentGroupBaseTimezoneId("tz")).toBe(false);
        expect([...service.getUsedTimezoneIds()]).toEqual(["utc"]);
        expect(service.createUniqueTimezoneId("tz")).toBe("tz-1000-777");
        expect(service.getNextTimezoneIdSeed()).toBe(1);
        expect(service.getNextTimezoneIdSeed()).toBe(2);
        expect(service.createStandardTimezoneFromSelectableEntry({ zone: "x" })).toBe(null);
    });

    it("handles omitted dependency getters with built-in defaults", () => {
        const moduleApi = loadMainTimezoneFacadeModule({ withWindow: false });
        const service = moduleApi.createService({
            callServiceMethod: createCallServiceMethod()
        });

        expect(service.getTimezoneOffset("Asia/Seoul", new Date())).toBe(0);
        expect(service.getZoneDisplayName({ zone: "Asia/Seoul" })).toBe("");
        expect(service.sanitizeTimezoneId("  tz-1  ")).toBe("  tz-1  ");
        expect(service.sanitizeBaseTimezoneId("UTC")).toBe("utc");
        expect([...service.getUsedTimezoneIds()]).toEqual(["utc"]);
        expect(service.createUniqueTimezoneId("tz")).toMatch(/^tz-\d+-\d+$/);
        expect(service.getNextTimezoneIdSeed()).toBe(1);
    });
});
