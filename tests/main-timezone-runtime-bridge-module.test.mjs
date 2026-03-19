import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "main-timezone-runtime-bridge.js");

function loadMainTimezoneRuntimeBridgeModule() {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = { window: {}, globalThis: {}, console };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/main-timezone-runtime-bridge.js" });
    return sandbox.window.GTVMainTimezoneRuntimeBridge
        || sandbox.GTVMainTimezoneRuntimeBridge
        || sandbox.globalThis.GTVMainTimezoneRuntimeBridge;
}

function createCallServiceMethod() {
    return (serviceName, serviceRef, methodName, args = [], options = {}) => {
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

        expect(service.getLocalizedTZLabel({
            name_en: "Korea",
            city_en: "Seoul",
            name: "대한민국",
            city: "서울"
        })).toBe("Korea - Seoul");
    });

    it("delegates to runtime service methods when available", () => {
        const moduleApi = loadMainTimezoneRuntimeBridgeModule();
        const runtimeService = {
            getTimezoneOffset: () => 540,
            getZoneDisplayName: () => "KST"
        };
        const service = moduleApi.createService({
            callServiceMethod: createCallServiceMethod(),
            getMainTimezoneRuntimeService: () => runtimeService,
            getGlobalTimeState: () => new Date(Date.UTC(2026, 2, 20, 1, 2, 3)),
            getCurrentLangState: () => "ko"
        });

        expect(service.getTimezoneOffset("Asia/Seoul", new Date())).toBe(540);
        expect(service.getZoneDisplayName("Asia/Seoul")).toBe("KST");
        expect(service.getZoneDisplayNameForUiAtDate("Asia/Seoul", new Date())).toBe("KST");
    });
});
