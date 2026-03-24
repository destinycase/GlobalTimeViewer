import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-timezone-runtime-bridge.js");

function loadMainTimezoneRuntimeBridgeModule(options = {}) {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = { globalThis: {}, console: options.console || console };
    if (!options.noWindow) {
        sandbox.window = {};
    }
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/main-timezone-runtime-bridge.js" });
    return sandbox.window?.GTVMainTimezoneRuntimeBridge
        || sandbox.GTVMainTimezoneRuntimeBridge
        || sandbox.globalThis.GTVMainTimezoneRuntimeBridge;
}

function createCallServiceMethod() {
    return (_serviceName, serviceRef, methodName, args = [], options = {}) => {
        if (serviceRef && typeof serviceRef[methodName] === "function") {
            return serviceRef[methodName](...args);
        }
        return options.fallback;
    };
}

describe("GTV main timezone runtime bridge module", () => {
    it("uses fallback logic when runtime service is missing", () => {
        const moduleApi = loadMainTimezoneRuntimeBridgeModule();
        const service = moduleApi.createService({
            callServiceMethod: createCallServiceMethod(),
            getMainTimezoneRuntimeService: () => null,
            getGlobalTimeState: () => new Date(Date.UTC(2026, 2, 20, 1, 2, 3)),
            getCurrentLangState: () => "en",
            maxRuntimeCacheSize: 2
        });

        const minuteKey = service.getUtcMinuteCacheKey(new Date(Date.UTC(2026, 2, 20, 1, 2, 59)));
        expect(minuteKey).toBe("2026:2:20:1:2");

        const cache = new Map([["a", 1], ["b", 2]]);
        service.setCappedRuntimeCache(cache, "c", 3);
        expect(cache.has("a")).toBe(false);
        expect(cache.has("b")).toBe(true);
        expect(cache.get("c")).toBe(3);

        expect(service.getFixedOffsetForDisplayAtDate({
            type: "standard",
            zone: "Asia/Seoul",
            fixedOffsetMinutes: 900
        }, new Date())).toBe(840);
        expect(service.getFixedOffsetForDisplayAtDate({
            type: "standard",
            zone: "Asia/Seoul",
            fixedOffsetMinutes: null
        }, new Date())).toBe(null);
        expect(service.getFixedOffsetForDisplayAtDate({
            type: "standard",
            zone: "UTC",
            fixedOffsetMinutes: 300
        }, new Date())).toBe(null);
        expect(service.getFixedOffsetForDisplayAtDate({
            type: "custom",
            zone: "Asia/Seoul",
            fixedOffsetMinutes: 300
        }, new Date())).toBe(null);
        expect(service.getFixedOffsetForDisplayAtDate({
            type: "standard",
            zone: "Asia/Seoul",
            fixedOffsetMinutes: "not-a-number"
        }, new Date())).toBe(null);
        expect(service.getFixedOffsetForDisplay({
            type: "standard",
            zone: "Asia/Seoul",
            fixedOffsetMinutes: "601"
        })).toBe(601);

        expect(service.getZoneAbbreviation("Asia/Seoul", new Date())).toBe("");
        expect(service.getBetterAbbr("Asia/Seoul", new Date())).toBe("");
        expect(service.isTimeZoneInDST("Asia/Seoul", new Date())).toBe(false);
        expect(service.getTimezoneOffset("Asia/Seoul", new Date())).toBe(0);
        expect(service.getZoneDisplayName("Asia/Seoul")).toBe("");
        expect(service.getZoneDisplayNameForUiAtDate("Asia/Seoul", new Date())).toBe("");

        expect(service.getLocalizedTZLabel({
            name_en: "Korea",
            city_en: "Seoul",
            name: "Korea Local",
            city: "Seoul Local"
        })).toBe("Korea - Seoul");
    });

    it("builds localized labels for non-English language fallbacks", () => {
        const moduleApi = loadMainTimezoneRuntimeBridgeModule();
        const service = moduleApi.createService({
            callServiceMethod: createCallServiceMethod(),
            getMainTimezoneRuntimeService: () => null,
            getCurrentLangState: () => "ko"
        });

        expect(service.getLocalizedTZLabel({
            name: "Korea",
            city: "Seoul"
        })).toBe("Korea - Seoul");
        expect(service.getLocalizedTZLabel({
            name_ko: "Korea KO",
            city_en: "Seoul EN"
        })).toBe("Korea KO - Seoul EN");
        expect(service.getLocalizedTZLabel({
            name_en: "Only English"
        })).toBe("Only English");
        expect(service.getLocalizedTZLabel(null)).toBe("");
    });

    it("supports direct fallback values and factories in bridge helper", () => {
        const moduleApi = loadMainTimezoneRuntimeBridgeModule();
        const service = moduleApi.createService({
            callServiceMethod: createCallServiceMethod(),
            getMainTimezoneRuntimeService: () => null
        });

        expect(service.callMainTimezoneRuntimeMethodOrFallback("missing", [], 123)).toBe(123);

        let factoryCalls = 0;
        expect(service.callMainTimezoneRuntimeMethodOrFallback("missing", [], () => {
            factoryCalls += 1;
            return "fallback-value";
        })).toBe("fallback-value");
        expect(factoryCalls).toBe(1);
    });

    it("keeps cache bounded and ignores non-map cache objects", () => {
        const moduleApi = loadMainTimezoneRuntimeBridgeModule();
        const service = moduleApi.createService({
            callServiceMethod: createCallServiceMethod(),
            getMainTimezoneRuntimeService: () => null,
            maxRuntimeCacheSize: 0
        });

        expect(() => service.setCappedRuntimeCache({}, "x", 1)).not.toThrow();

        const cache = new Map([["a", 1]]);
        service.setCappedRuntimeCache(cache, "b", 2);
        expect(Array.from(cache.entries())).toEqual([["b", 2]]);

        service.setCappedRuntimeCache(cache, "c", 3);
        expect(Array.from(cache.entries())).toEqual([["c", 3]]);
    });

    it("delegates to runtime service methods when available", () => {
        const moduleApi = loadMainTimezoneRuntimeBridgeModule();
        const runtimeService = {
            getUtcMinuteCacheKey: () => "runtime-minute",
            setCappedRuntimeCache: (cache, key, value) => cache.set(key, value),
            getZoneAbbreviation: () => "ABR",
            getBetterAbbr: () => "BET",
            isTimeZoneInDST: () => true,
            getTimezoneOffset: () => 540,
            getFixedOffsetForDisplayAtDate: () => 333,
            getFixedOffsetForDisplay: () => 444,
            getLocalizedTZLabel: () => "LABEL",
            getZoneDisplayName: () => "KST",
            getZoneDisplayNameForUiAtDate: () => "KST-UI"
        };
        const service = moduleApi.createService({
            callServiceMethod: createCallServiceMethod(),
            getMainTimezoneRuntimeService: () => runtimeService,
            getGlobalTimeState: () => new Date(Date.UTC(2026, 2, 20, 1, 2, 3)),
            getCurrentLangState: () => "ko"
        });

        const cache = new Map();
        expect(service.getUtcMinuteCacheKey(new Date())).toBe("runtime-minute");
        service.setCappedRuntimeCache(cache, "a", 1);
        expect(cache.get("a")).toBe(1);
        expect(service.getZoneAbbreviation("Asia/Seoul", new Date())).toBe("ABR");
        expect(service.getBetterAbbr("Asia/Seoul", new Date())).toBe("BET");
        expect(service.isTimeZoneInDST("Asia/Seoul", new Date())).toBe(true);
        expect(service.getTimezoneOffset("Asia/Seoul", new Date())).toBe(540);
        expect(service.getFixedOffsetForDisplayAtDate("Asia/Seoul", new Date())).toBe(333);
        expect(service.getFixedOffsetForDisplay("Asia/Seoul")).toBe(444);
        expect(service.getLocalizedTZLabel({})).toBe("LABEL");
        expect(service.getZoneDisplayName("Asia/Seoul")).toBe("KST");
        expect(service.getZoneDisplayNameForUiAtDate("Asia/Seoul", new Date())).toBe("KST-UI");
    });

    it("supports globalThis export path and default dependency fallbacks", () => {
        const moduleApi = loadMainTimezoneRuntimeBridgeModule({ noWindow: true });
        const service = moduleApi.createService(null);

        expect(service.callMainTimezoneRuntimeMethodOrFallback("missing", [], "x")).toBe(undefined);
        expect(service.getTimezoneOffset("Asia/Seoul", new Date())).toBe(undefined);
        expect(service.getZoneDisplayName("Asia/Seoul")).toBe(undefined);
        expect(service.getFixedOffsetForDisplayAtDate({
            type: "standard",
            zone: "Asia/Seoul",
            fixedOffsetMinutes: 300
        }, new Date())).toBe(undefined);
        expect(service.getUtcMinuteCacheKey("invalid-date")).toBe(undefined);
    });
});
