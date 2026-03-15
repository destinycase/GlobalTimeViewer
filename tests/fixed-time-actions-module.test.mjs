import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "fixed-time-actions.js");

function loadFixedTimeActionsModule(options = {}) {
    const code = fs.readFileSync(MODULE_PATH, "utf8");
    const sandbox = {
        window: {},
        globalThis: {},
        Date,
        console: options.console || console,
        prompt: options.prompt || (() => null)
    };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox, { filename: "js/modules/fixed-time-actions.js" });
    return sandbox.window.GTVFixedTimeActions || sandbox.GTVFixedTimeActions || sandbox.globalThis.GTVFixedTimeActions;
}

describe("GTV fixed time actions module", () => {
    it("formats fixed-time payload text based on enabled parts", () => {
        const module = loadFixedTimeActionsModule();
        const service = module.createService({});

        const text = service.formatFixedTimePayloadText({
            dayNightGlyph: "AM",
            clock: "09:30:00",
            dayName: "Mon"
        }, { dn: true, time: true, weekday: false });

        expect(text).toBe("AM 09:30:00");
    });

    it("builds aggregated copy text per slot", () => {
        const module = loadFixedTimeActionsModule();
        const baseRef = { id: "utc", zone: "UTC" };
        const seoul = { id: "seoul", zone: "Asia/Seoul" };
        const group = {
            fixedTimes: [
                { id: "ft-1", name: "Slot A", time: "09:00" },
                { id: "ft-2", name: "Slot B", time: "14:30" }
            ]
        };
        const service = module.createService({
            sanitizeCopyFormatOrderForContext: (order) => order,
            getCopyFormatOrder: () => ["timezone", "time"],
            sanitizeCopyFormatEnabledForContext: (enabled) => enabled,
            getCopyFormatEnabled: () => ({ timezone: true, time: true }),
            sanitizeTimePartsEnabledForContext: (enabled) => enabled,
            getCopyTimePartsEnabled: () => ({ time: true }),
            getCurrentGroup: () => group,
            ensureGroupFixedTimes: () => { },
            getBaseTimezoneRef: () => baseRef,
            getRenderableTimezoneRows: () => [seoul],
            getGlobalTime: () => new Date(Date.UTC(2026, 2, 7, 0, 0, 0)),
            resolveFixedTimeSlotUtcDate: (slot) => (
                slot.name === "Slot A"
                    ? new Date(Date.UTC(2026, 2, 7, 9, 0, 0))
                    : new Date(Date.UTC(2026, 2, 7, 14, 30, 0))
            ),
            getFixedOffsetForDisplayAtDate: () => 0,
            buildTimezoneComputedSnapshotForDates: (tz, slotDates) => ({
                tz,
                slotDates
            }),
            formatSnapshotText: (snapshot) => {
                const hhmmss = snapshot.slotDates[0].toISOString().slice(11, 19);
                return `[${snapshot.tz.id}] ${hhmmss}`;
            },
            getFixedTimeSlotHeaderLabel: (slot) => slot.name
        });

        const text = service.getAllFixedTimeRowsCopyText();

        expect(text).toContain("[Slot A]");
        expect(text).toContain("[utc] 09:00:00");
        expect(text).toContain("[seoul] 14:30:00");
    });

    it("updates fixed-time slot and triggers side effects", () => {
        const module = loadFixedTimeActionsModule();
        const group = { fixedTimes: [{ id: "ft-1", name: "Slot", time: "09:00" }] };
        let renderFixedCount = 0;
        let renderTimelineCount = 0;
        let saveCount = 0;
        const service = module.createService({
            getCurrentGroup: () => group,
            ensureGroupFixedTimes: () => { },
            sanitizeFixedTimeValue: (value, fallback) => (value ? value : fallback),
            renderFixedTimeTab: () => { renderFixedCount += 1; },
            renderTimelineFrame: () => { renderTimelineCount += 1; },
            savePersistence: () => { saveCount += 1; }
        });

        const changed = service.updateFixedTimeSlotTime(0, "10:15");

        expect(changed).toBe(true);
        expect(group.fixedTimes[0].time).toBe("10:15");
        expect(renderFixedCount).toBe(1);
        expect(renderTimelineCount).toBe(1);
        expect(saveCount).toBe(1);
    });

    it("prevents slot removal below minimum count", () => {
        const module = loadFixedTimeActionsModule();
        const group = { fixedTimes: [{ id: "ft-1", name: "Slot", time: "09:00" }] };
        const toastMessages = [];
        const service = module.createService({
            MIN_FIXED_TIME_SLOT_COUNT: 1,
            t: (key) => key,
            getCurrentGroup: () => group,
            ensureGroupFixedTimes: () => { },
            showToast: (message) => { toastMessages.push(String(message)); }
        });

        service.removeFixedTimeSlot("ft-1");

        expect(group.fixedTimes).toHaveLength(1);
        expect(toastMessages).toContain("toast_fixed_time_min");
    });
});
