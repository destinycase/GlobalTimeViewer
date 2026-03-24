import path from "node:path";
import { createRequire } from "node:module";

import { afterEach, describe, expect, it } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "fixed-time-actions.js");
const require = createRequire(import.meta.url);
const MODULE_ID = require.resolve(MODULE_PATH);
const moduleCleanupStack = [];

function loadFixedTimeActionsModule(options = {}) {
    const windowStub = {
        prompt: options.prompt || (() => null)
    };
    const globalPatches = {
        window: windowStub,
        Date,
        console: options.console || console
    };
    const keys = ["window", "Date", "console", "GTVFixedTimeActions", ...Object.keys(globalPatches)];
    const previous = new Map();
    keys.forEach((key) => {
        previous.set(key, {
            exists: Object.prototype.hasOwnProperty.call(globalThis, key),
            value: globalThis[key]
        });
    });

    Object.entries(globalPatches).forEach(([key, value]) => {
        globalThis[key] = value;
    });

    delete require.cache[MODULE_ID];
    require(MODULE_PATH);
    moduleCleanupStack.push(() => {
        delete require.cache[MODULE_ID];
        keys.forEach((key) => {
            const entry = previous.get(key);
            if (!entry || !entry.exists) {
                delete globalThis[key];
                return;
            }
            globalThis[key] = entry.value;
        });
    });

    return globalThis.window?.GTVFixedTimeActions || globalThis.GTVFixedTimeActions;
}

describe("GTV fixed time actions module", () => {
    afterEach(() => {
        while (moduleCleanupStack.length) {
            const cleanup = moduleCleanupStack.pop();
            try {
                cleanup();
            } catch {
                // Ignore cleanup failures in tests.
            }
        }
    });

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

    it("builds snapshot and formatted text for timezone slot", () => {
        const module = loadFixedTimeActionsModule();
        const service = module.createService({
            getFixedOffsetForDisplayAtDate: () => 540,
            buildTimezoneComputedSnapshotForDates: (_tz, dates, options) => ({
                dates,
                fixedDisplayOffsetMinutes: options.fixedDisplayOffsetMinutes
            }),
            formatSnapshotText: (_snapshot, order, enabled, timePartsEnabled) => (
                `${order.join(",")}|${enabled.time}|${timePartsEnabled.time}`
            )
        });

        const utcDate = new Date("2026-03-07T00:00:00.000Z");
        const snapshot = service.buildFixedTimeSnapshotForTimezoneSlot({ zone: "Asia/Seoul" }, utcDate);
        const text = service.formatFixedTimeCopyTextForTimezoneSlot(
            { zone: "Asia/Seoul" },
            utcDate,
            { order: ["timezone", "time"], enabled: { time: true }, timePartsEnabled: { time: true } }
        );

        expect(snapshot.fixedDisplayOffsetMinutes).toBe(540);
        expect(text).toBe("timezone,time|true|true");
        expect(service.buildFixedTimeSnapshotForTimezoneSlot(null, utcDate)).toBe(null);
    });

    it("resolves slot UTC date and preview text with guard branches", () => {
        const module = loadFixedTimeActionsModule();
        const group = { fixedTimes: [{ id: "ft-1", name: "Slot", time: "09:00" }] };
        const resolvedDate = new Date("2026-03-07T09:00:00.000Z");
        const service = module.createService({
            getCurrentGroup: () => group,
            ensureGroupFixedTimes: () => { },
            getBaseTimezoneRef: () => ({ zone: "UTC", id: "utc" }),
            getGlobalTime: () => new Date("2026-03-07T00:00:00.000Z"),
            resolveFixedTimeSlotUtcDate: () => resolvedDate,
            getFixedOffsetForDisplayAtDate: () => 0,
            buildTimezoneComputedSnapshotForDates: () => ({ token: "snapshot" }),
            formatSnapshotText: () => "preview"
        });

        expect(service.getFixedTimeSlotUtcDateByIndex(0)?.toISOString()).toBe(resolvedDate.toISOString());
        expect(service.getFixedTimeSlotUtcDateByIndex(-1)).toBe(null);
        expect(service.getFixedTimePreviewCopyText()).toBe("preview");
    });

    it("copies fixed-time payload and timezone cell with success and failure toasts", async () => {
        const module = loadFixedTimeActionsModule();
        const toastEvents = [];
        const written = [];
        const service = module.createService({
            t: (key) => key,
            writeClipboard: async (text) => {
                written.push(text);
            },
            showToast: (message, options) => {
                toastEvents.push({ message, type: options?.type || "" });
            },
            getFixedOffsetForDisplayAtDate: () => 0,
            buildTimezoneComputedSnapshotForDates: () => ({ token: "snapshot" }),
            formatSnapshotText: () => "cell-text"
        });

        await service.copyFixedTimeCellPayload({ dayNightGlyph: "AM", clock: "09:00:00", dayName: "Sat" }, { dn: true, time: true, weekday: false });
        await service.copyFixedTimeCellByTimezone({ zone: "UTC" }, new Date("2026-03-07T00:00:00.000Z"));
        expect(written).toEqual(["AM 09:00:00", "cell-text"]);
        expect(toastEvents.filter((event) => event.message === "toast_copy_success")).toHaveLength(2);

        const failEvents = [];
        const failService = module.createService({
            t: (key) => key,
            writeClipboard: async () => {
                throw new Error("clipboard denied");
            },
            showToast: (message, options) => {
                failEvents.push({ message, type: options?.type || "" });
            },
            getFixedOffsetForDisplayAtDate: () => 0,
            buildTimezoneComputedSnapshotForDates: () => ({ token: "snapshot" }),
            formatSnapshotText: () => "cell-text"
        });

        await failService.copyFixedTimeCellPayload({ dayNightGlyph: "AM", clock: "09:00:00", dayName: "Sat" }, { dn: true, time: true, weekday: false });
        await failService.copyFixedTimeCellByTimezone({ zone: "UTC" }, new Date("2026-03-07T00:00:00.000Z"));
        expect(failEvents.filter((event) => event.message === "toast_copy_failed")).toHaveLength(2);
    });

    it("parses fixed-time input parts and exposes input value", () => {
        const module = loadFixedTimeActionsModule();
        const service = module.createService({
            buildFixedTimeDisplayPayloadAtUtc: () => ({ clock: "13:14:15" }),
            parseDateTimeParts: (raw, mode) => {
                if (raw === "10:11:12" && mode === "time") return [10, 11, 12];
                if (raw === "2026-03-07 20:21:22" && mode === "datetime") return [2026, 3, 7, 20, 21, 22];
                return null;
            }
        });

        expect(service.buildFixedTimeCellInputValue(new Date("2026-03-07T00:00:00.000Z"), { zone: "UTC" })).toBe("13:14:15");
        expect(service.buildFixedTimeCellInputValue(new Date("2026-03-07T00:00:00.000Z"), null)).toBe("13:14:15");
        expect(service.buildFixedTimeCellTimeParts("10:11:12")).toEqual({ hour: 10, minute: 11, second: 12 });
        expect(service.buildFixedTimeCellTimeParts("2026-03-07 20:21:22")).toEqual({ hour: 20, minute: 21, second: 22 });
        expect(service.buildFixedTimeCellTimeParts("invalid")).toBe(null);
    });

    it("applyFixedTimeSlotByTimezoneInput handles invalid parse and invalid UTC conversion", () => {
        const module = loadFixedTimeActionsModule();
        const toastMessages = [];
        let renderCount = 0;
        const service = module.createService({
            t: (key) => key,
            parseDateTimeParts: () => null,
            showToast: (message) => {
                toastMessages.push(String(message));
            },
            renderFixedTimeTab: () => {
                renderCount += 1;
            }
        });

        const parsedFail = service.applyFixedTimeSlotByTimezoneInput(0, { zone: "UTC" }, "invalid", new Date("2026-03-07T00:00:00.000Z"));
        expect(parsedFail).toBe(false);
        expect(toastMessages).toContain("toast_invalid_date");
        expect(renderCount).toBe(1);

        const service2 = module.createService({
            t: (key) => key,
            parseDateTimeParts: (raw, mode) => (mode === "time" ? [9, 10, 11] : null),
            getFixedOffsetForDisplayAtDate: () => 0,
            getLocalPartsByTimezone: () => ({ year: 2026, month: 3, day: 7 }),
            getUTCDateFromLocalParts: () => null,
            showToast: (message) => {
                toastMessages.push(String(message));
            },
            renderFixedTimeTab: () => {
                renderCount += 1;
            }
        });
        const utcFail = service2.applyFixedTimeSlotByTimezoneInput(0, { zone: "UTC" }, "09:10:11", new Date("2026-03-07T00:00:00.000Z"));

        expect(utcFail).toBe(false);
        expect(toastMessages.filter((msg) => msg === "toast_invalid_date").length).toBeGreaterThanOrEqual(2);
        expect(renderCount).toBe(2);
    });

    it("applyFixedTimeSlotByTimezoneInput converts timezone input and updates slot value", () => {
        const module = loadFixedTimeActionsModule();
        const group = { fixedTimes: [{ id: "ft-1", name: "Slot", time: "09:00" }] };
        const service = module.createService({
            getCurrentGroup: () => group,
            ensureGroupFixedTimes: () => { },
            parseDateTimeParts: (raw, mode) => (mode === "time" ? [10, 15, 20] : null),
            getFixedOffsetForDisplayAtDate: () => 0,
            getLocalPartsByTimezone: (date) => ({
                year: date.getUTCFullYear(),
                month: date.getUTCMonth() + 1,
                day: date.getUTCDate(),
                hour: date.getUTCHours(),
                minute: date.getUTCMinutes(),
                second: date.getUTCSeconds()
            }),
            getUTCDateFromLocalParts: (parts) => new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second)),
            getBaseTimezoneRef: () => ({ zone: "UTC", id: "utc" }),
            sanitizeFixedTimeValue: (value, fallback) => value || fallback,
            renderFixedTimeTab: () => { },
            renderTimelineFrame: () => { },
            savePersistence: () => { }
        });

        const changed = service.applyFixedTimeSlotByTimezoneInput(0, { zone: "UTC" }, "10:15:20", new Date("2026-03-07T00:00:00.000Z"));

        expect(changed).toBe(true);
        expect(group.fixedTimes[0].time).toBe("10:15");
    });

    it("copies slot column with success and failure handling", async () => {
        const module = loadFixedTimeActionsModule();
        const group = { fixedTimes: [{ id: "ft-1", name: "Slot A", time: "09:00" }] };
        const toasts = [];
        const service = module.createService({
            t: (key) => key,
            getCurrentGroup: () => group,
            ensureGroupFixedTimes: () => { },
            getBaseTimezoneRef: () => ({ id: "utc", zone: "UTC" }),
            getRenderableTimezoneRows: () => [{ id: "seoul", zone: "Asia/Seoul" }],
            getGlobalTime: () => new Date("2026-03-07T00:00:00.000Z"),
            resolveFixedTimeSlotUtcDate: () => new Date("2026-03-07T09:00:00.000Z"),
            sanitizeCopyFormatOrderForContext: (order) => order,
            getCopyFormatOrder: () => ["timezone", "time"],
            sanitizeCopyFormatEnabledForContext: (enabled) => enabled,
            getCopyFormatEnabled: () => ({ timezone: true, time: true }),
            sanitizeTimePartsEnabledForContext: (enabled) => enabled,
            getCopyTimePartsEnabled: () => ({ time: true }),
            getFixedOffsetForDisplayAtDate: () => 0,
            buildTimezoneComputedSnapshotForDates: (tz) => ({ tz }),
            formatSnapshotText: (snapshot) => `[${snapshot.tz.id}] 09:00:00`,
            getFixedTimeSlotHeaderLabel: (slot) => slot.name,
            writeClipboard: async () => { },
            showToast: (message, options) => {
                toasts.push({ message, type: options?.type || "" });
            }
        });

        await service.copyFixedTimeSlotColumn(0);
        expect(toasts.some((toast) => toast.message === "toast_copy_success")).toBe(true);

        const failToasts = [];
        const failService = module.createService({
            t: (key) => key,
            getCurrentGroup: () => group,
            ensureGroupFixedTimes: () => { },
            getBaseTimezoneRef: () => ({ id: "utc", zone: "UTC" }),
            getRenderableTimezoneRows: () => [{ id: "seoul", zone: "Asia/Seoul" }],
            getGlobalTime: () => new Date("2026-03-07T00:00:00.000Z"),
            resolveFixedTimeSlotUtcDate: () => new Date("2026-03-07T09:00:00.000Z"),
            sanitizeCopyFormatOrderForContext: (order) => order,
            getCopyFormatOrder: () => ["timezone", "time"],
            sanitizeCopyFormatEnabledForContext: (enabled) => enabled,
            getCopyFormatEnabled: () => ({ timezone: true, time: true }),
            sanitizeTimePartsEnabledForContext: (enabled) => enabled,
            getCopyTimePartsEnabled: () => ({ time: true }),
            getFixedOffsetForDisplayAtDate: () => 0,
            buildTimezoneComputedSnapshotForDates: (tz) => ({ tz }),
            formatSnapshotText: (snapshot) => `[${snapshot.tz.id}] 09:00:00`,
            getFixedTimeSlotHeaderLabel: (slot) => slot.name,
            writeClipboard: async () => {
                throw new Error("clipboard denied");
            },
            showToast: (message, options) => {
                failToasts.push({ message, type: options?.type || "" });
            }
        });
        await failService.copyFixedTimeSlotColumn(0);

        expect(failToasts.some((toast) => toast.message === "toast_copy_failed")).toBe(true);
    });

    it("renames slot and handles prompt cancellation", () => {
        const module = loadFixedTimeActionsModule({
            prompt: () => "  Renamed  "
        });
        const group = { fixedTimes: [{ id: "ft-1", name: "Slot", time: "09:00" }] };
        let renderFixedCount = 0;
        let renderTimelineCount = 0;
        let saveCount = 0;
        const service = module.createService({
            t: (key) => key,
            getCurrentGroup: () => group,
            ensureGroupFixedTimes: () => { },
            getDefaultFixedTimeName: () => "Fixed Time",
            sanitizeFixedTimeName: (value, fallback) => (String(value || "").trim() || fallback),
            renderFixedTimeTab: () => { renderFixedCount += 1; },
            renderTimelineFrame: () => { renderTimelineCount += 1; },
            savePersistence: () => { saveCount += 1; }
        });

        service.renameFixedTimeSlot(0);
        expect(group.fixedTimes[0].name).toBe("Renamed");
        expect(renderFixedCount).toBe(1);
        expect(renderTimelineCount).toBe(1);
        expect(saveCount).toBe(1);

        const cancelModule = loadFixedTimeActionsModule({
            prompt: () => null
        });
        const cancelGroup = { fixedTimes: [{ id: "ft-1", name: "Original", time: "09:00" }] };
        const cancelService = cancelModule.createService({
            t: (key) => key,
            getCurrentGroup: () => cancelGroup,
            ensureGroupFixedTimes: () => { },
            getDefaultFixedTimeName: () => "Fixed Time",
            sanitizeFixedTimeName: (value, fallback) => (String(value || "").trim() || fallback),
            renderFixedTimeTab: () => { throw new Error("should not render on cancel"); }
        });
        cancelService.renameFixedTimeSlot(0);
        expect(cancelGroup.fixedTimes[0].name).toBe("Original");
    });

    it("add/remove slot behaviors cover no-op and successful mutation paths", () => {
        const module = loadFixedTimeActionsModule();
        let setCountValue = null;
        const group = {
            fixedTimes: [
                { id: "ft-1", name: "A", time: "09:00" },
                { id: "ft-2", name: "B", time: "10:00" }
            ]
        };
        let refreshCount = 0;
        let renderFixedCount = 0;
        let renderTimelineCount = 0;
        let saveCount = 0;
        const service = module.createService({
            getCurrentGroup: () => group,
            ensureGroupFixedTimes: () => { },
            getFixedTimeSlotCount: () => 2,
            setFixedTimeSlotCount: (value) => {
                setCountValue = value;
            },
            refreshFixedTimeSlotCountControls: () => { refreshCount += 1; },
            renderFixedTimeTab: () => { renderFixedCount += 1; },
            renderTimelineFrame: () => { renderTimelineCount += 1; },
            savePersistence: () => { saveCount += 1; }
        });

        service.addFixedTimeSlot();
        expect(setCountValue).toBe(3);

        service.removeFixedTimeSlot("missing");
        expect(group.fixedTimes).toHaveLength(2);

        service.removeFixedTimeSlot("ft-1");
        expect(group.fixedTimes).toHaveLength(1);
        expect(refreshCount).toBe(1);
        expect(renderFixedCount).toBe(1);
        expect(renderTimelineCount).toBe(1);
        expect(saveCount).toBe(1);
    });
});
