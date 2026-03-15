import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "multi-range-copy.js");

function loadMultiRangeCopyModule(options = {}) {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = {
        window: {},
        globalThis: {},
        console: options.console || console
    };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/multi-range-copy.js" });
    return sandbox.window.GTVMultiRangeCopy || sandbox.GTVMultiRangeCopy || sandbox.globalThis.GTVMultiRangeCopy;
}

describe("GTV multi-range copy module", () => {
    it("copyMultiRangeRow exits safely when ranges are missing", async () => {
        const module = loadMultiRangeCopyModule();
        const service = module.createService({
            getMultiRanges: () => null
        });

        await expect(service.copyMultiRangeRow(0, "utc")).resolves.toBeUndefined();
    });

    it("copyMultiRangeRow emits failure toast when clipboard write fails", async () => {
        const toasts = [];
        const module = loadMultiRangeCopyModule({
            console: {
                error() { },
                warn() { },
                log() { }
            }
        });
        const service = module.createService({
            getMultiRanges: () => [{ startUtcMs: 0, endUtcMs: 1000 }],
            getTimezoneRefById: () => ({ id: "utc" }),
            buildTimezoneComputedSnapshotForRange: () => ({ timezone: "UTC" }),
            formatSnapshotText: () => "UTC line",
            writeClipboard: async () => {
                throw new Error("clipboard denied");
            },
            showToast: (message, options = {}) => {
                toasts.push({ message, type: options.type });
            },
            t: (key) => key
        });

        await service.copyMultiRangeRow(0, "utc");

        expect(toasts).toHaveLength(1);
        expect(toasts[0]).toMatchObject({ message: "toast_copy_failed", type: "error" });
    });

    it("copyWholeMultiRange exits when base reference is unavailable", async () => {
        const module = loadMultiRangeCopyModule();
        const service = module.createService({
            getMultiRanges: () => [{ startUtcMs: 0, endUtcMs: 1000 }],
            getBaseTimezoneRef: () => null
        });

        await expect(service.copyWholeMultiRange(0)).resolves.toBeUndefined();
    });

    it("copyWholeMultiRange skips clipboard when there is no formatted row text", async () => {
        let writes = 0;
        const module = loadMultiRangeCopyModule();
        const service = module.createService({
            getMultiRanges: () => [{ startUtcMs: 0, endUtcMs: 1000 }],
            getBaseTimezoneRef: () => ({ id: "utc" }),
            getRenderableTimezoneRows: () => [],
            getMultiRangeTitleText: () => "TITLE",
            buildTimezoneComputedSnapshotForRange: () => ({}),
            formatSnapshotText: () => "",
            writeClipboard: async () => { writes += 1; }
        });

        await service.copyWholeMultiRange(0);

        expect(writes).toBe(0);
    });

    it("copyAllMultiRangeTimezones aggregates title and row lines", async () => {
        let copiedText = "";
        const module = loadMultiRangeCopyModule();
        const service = module.createService({
            getMultiRanges: () => [{ startUtcMs: 0, endUtcMs: 1000 }],
            getBaseTimezoneRef: () => ({ id: "utc" }),
            getRenderableTimezoneRows: () => [{ id: "tz-1" }],
            getMultiRangeTitleText: () => "RANGE #1",
            buildTimezoneComputedSnapshotForRange: (tz) => ({ timezone: tz.id }),
            formatSnapshotText: (snapshot) => `[${snapshot.timezone}]`,
            writeClipboard: async (text) => { copiedText = text; },
            showToast: () => { },
            t: (key) => key
        });

        await service.copyAllMultiRangeTimezones();

        expect(copiedText).toContain("RANGE #1");
        expect(copiedText).toContain("[utc]");
        expect(copiedText).toContain("[tz-1]");
    });
});
