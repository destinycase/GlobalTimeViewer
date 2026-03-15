import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "multi-state.js");

function loadMultiStateModule() {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = {
        window: {},
        globalThis: {},
        console
    };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/multi-state.js" });
    return sandbox.window.GTVMultiState || sandbox.GTVMultiState || sandbox.globalThis.GTVMultiState;
}

describe("GTV multi state module", () => {
    it("sanitizeMultiSubgroupName falls back safely when translation dep is missing", () => {
        const module = loadMultiStateModule();
        const service = module.createService({});

        expect(service.sanitizeMultiSubgroupName("", "")).toBe("default_subgroup_name");
    });

    it("getUsedMultiSubgroupIds tolerates non-array groups source", () => {
        const module = loadMultiStateModule();
        const service = module.createService({
            getGroups: () => null
        });

        const used = service.getUsedMultiSubgroupIds();
        expect(typeof used?.size).toBe("number");
        expect(typeof used?.has).toBe("function");
        expect(used.size).toBe(0);
    });

    it("sanitizeMultiStatePayload uses safe defaults without sanitizer deps", () => {
        const module = loadMultiStateModule();
        const service = module.createService({
            MIN_MULTI_RANGE_COUNT: 1,
            getDefaultMultiRangeBounds: () => ({ startMs: 1000, endMs: 2000 })
        });

        const normalized = service.sanitizeMultiStatePayload(null, null);

        expect(normalized.multiRangeCount).toBe(1);
        expect(Array.isArray(normalized.multiRanges)).toBe(true);
        expect(normalized.multiRanges).toHaveLength(1);
        expect(normalized.multiRanges[0]).toMatchObject({ startUtcMs: 1000, endUtcMs: 2000 });
    });

    it("ensureGroupMultiSubgroups initializes missing subgroup array", () => {
        const module = loadMultiStateModule();
        const service = module.createService({
            t: (key) => key,
            MIN_MULTI_RANGE_COUNT: 1,
            getDefaultMultiRangeBounds: () => ({ startMs: 1000, endMs: 2000 }),
            sanitizeMultiRangeCount: (value) => Number(value) || 1,
            sanitizeMultiRangeItem: (_item, startMs, endMs) => ({ startUtcMs: startMs, endUtcMs: endMs }),
            sanitizeUtcMs: (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : Number(fallback),
            getGroups: () => []
        });
        const group = {
            name: "G",
            multiSubgroups: null,
            activeMultiSubgroupId: ""
        };

        service.ensureGroupMultiSubgroups(group);

        expect(Array.isArray(group.multiSubgroups)).toBe(true);
        expect(group.multiSubgroups.length).toBe(1);
        expect(typeof group.activeMultiSubgroupId).toBe("string");
        expect(group.activeMultiSubgroupId.length).toBeGreaterThan(0);
    });

    it("ensureGroupMultiSubgroups rewrites duplicate subgroup ids", () => {
        const module = loadMultiStateModule();
        const service = module.createService({
            t: (key) => key,
            MIN_MULTI_RANGE_COUNT: 1,
            getDefaultMultiRangeBounds: () => ({ startMs: 1000, endMs: 2000 }),
            sanitizeMultiRangeCount: (value) => Number(value) || 1,
            sanitizeMultiRangeItem: (_item, startMs, endMs) => ({ startUtcMs: startMs, endUtcMs: endMs }),
            sanitizeUtcMs: (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : Number(fallback),
            getGroups: () => []
        });
        const group = {
            multiSubgroups: [
                { id: "dup", name: "A", multiRangeCount: 1, multiRanges: [{ startUtcMs: 1000, endUtcMs: 2000 }] },
                { id: "dup", name: "B", multiRangeCount: 1, multiRanges: [{ startUtcMs: 1000, endUtcMs: 2000 }] }
            ],
            activeMultiSubgroupId: "dup"
        };

        service.ensureGroupMultiSubgroups(group);

        const ids = group.multiSubgroups.map((item) => item.id);
        expect(new Set(ids).size).toBe(ids.length);
        expect(group.multiSubgroups.some((item) => item.id === group.activeMultiSubgroupId)).toBe(true);
    });
});
