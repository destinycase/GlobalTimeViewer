import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "group-context-state.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);

let restoreGlobals = null;

function installGlobalScaffold() {
    const keys = ["window", "GTVGroupContextState"];
    const previous = new Map();
    keys.forEach((key) => {
        previous.set(key, Object.prototype.hasOwnProperty.call(globalThis, key) ? globalThis[key] : undefined);
    });

    globalThis.window = globalThis;

    return () => {
        keys.forEach((key) => {
            const value = previous.get(key);
            if (value === undefined) {
                delete globalThis[key];
                return;
            }
            globalThis[key] = value;
        });
    };
}

function loadGroupContextStateModule() {
    delete require.cache[MODULE_ID];
    require(MODULE_PATH);
    return globalThis.GTVGroupContextState;
}

describe("GTV group context state module", () => {
    beforeEach(() => {
        restoreGlobals = installGlobalScaffold();
    });

    afterEach(() => {
        if (typeof restoreGlobals === "function") restoreGlobals();
    });

    it("normalizes tab/group state and resolves base timezone references", () => {
        const moduleApi = loadGroupContextStateModule();
        const groups = [
            {
                id: "g0",
                baseTimezoneId: "asia-seoul",
                showUtcRow: false,
                utcRowOrder: "1",
                zones: [{ id: "utc" }, { id: "asia-seoul" }]
            },
            {
                id: "g1",
                baseTimezoneId: "missing-zone",
                showUtcRow: true,
                utcRowOrder: 0,
                zones: [{ id: "tokyo" }]
            }
        ];

        let state = {
            currentMainTab: "fixed",
            activeGroupId: 99,
            activeGroupIdByMainTab: { live: 99, fixed: 1 }
        };
        let patchedState = null;

        const service = moduleApi.createService({
            MAIN_TABS: ["live", "fixed", "multi"],
            getGroups: () => groups,
            getState: () => state,
            setState: (next) => {
                patchedState = next;
                state = { ...state, ...next };
            },
            getUTCRef: () => ({ id: "utc", label: "UTC" }),
            sanitizeUtcRowOrder: (value) => {
                const parsed = Number(value);
                if (!Number.isFinite(parsed)) return 0;
                return Math.max(0, Math.min(1, Math.trunc(parsed)));
            }
        });

        expect(service.sanitizeMainTab("unknown")).toBe("live");
        expect(service.clampGroupIndex(999)).toBe(1);
        expect(service.clampGroupIndex("not-a-number")).toBe(0);

        const normalized = service.normalizeGroupTabState();
        expect(normalized).toEqual({
            activeGroupId: 1,
            activeGroupIdByMainTab: { live: 1, fixed: 1 }
        });
        expect(patchedState).toEqual({
            activeGroupId: 1,
            activeGroupIdByMainTab: { live: 1, fixed: 1 }
        });

        expect(service.getCurrentGroup()).toEqual(groups[1]);
        expect(service.getCurrentGroupZones()).toEqual(groups[1].zones);
        expect(service.getCurrentGroupBaseTimezoneId()).toBe("missing-zone");
        expect(service.getBaseTimezoneRef()).toEqual({ id: "utc", label: "UTC" });

        const ensured = service.ensureBaseTimezoneSelection();
        expect(ensured).toEqual({ id: "utc", label: "UTC" });
        expect(groups[1].baseTimezoneId).toBe("utc");

        state.currentMainTab = "live";
        state.activeGroupIdByMainTab.live = 0;
        expect(service.getCurrentGroup()).toEqual(groups[0]);
        expect(service.isCurrentGroupUtcRowVisible()).toBe(false);
        expect(service.getCurrentGroupUtcRowOrder()).toBe(1);
    });

    it("handles missing deps and empty groups with safe fallbacks", () => {
        const moduleApi = loadGroupContextStateModule();
        const service = moduleApi.createService({});

        expect(service.sanitizeMainTab("fixed-time")).toBe("fixed-time");
        expect(service.clampGroupIndex(5)).toBe(0);
        expect(service.getCurrentGroup()).toBeNull();
        expect(service.getCurrentGroupZones()).toEqual([]);
        expect(service.getCurrentGroupBaseTimezoneId()).toBe("utc");
        expect(service.getBaseTimezoneRef()).toBeNull();
        expect(service.ensureBaseTimezoneSelection()).toBeNull();
        expect(service.isCurrentGroupUtcRowVisible()).toBe(true);
        expect(service.getCurrentGroupUtcRowOrder()).toBe(0);
    });
});
