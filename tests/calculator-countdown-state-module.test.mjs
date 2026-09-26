import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { expect, test } from "vitest";

const MODULE_PATH = path.resolve(process.cwd(), "js", "modules", "calculator-countdown-state.js");

function loadCountdownStateModule() {
    const windowRef = {};
    const context = { window: windowRef, globalThis: windowRef };
    vm.runInNewContext(fs.readFileSync(MODULE_PATH, "utf8"), context);
    return windowRef.GTVCalculatorCountdownState;
}

test("normalizes a fixed number of countdown slots and sanitizes persisted state", () => {
    const moduleApi = loadCountdownStateModule();
    const service = moduleApi.createService();
    const state = service.normalizeState([
        { name: "  Launch  ", nameIsCustom: true, active: true, pausedRemainingMs: -12 },
        { name: "  ", nameIsCustom: true, targetIso: 42, pausedRemainingMs: 12.8 },
        { active: 1 },
        { name: "ignored" }
    ], (key) => (key === "calc_countdown_default_prefix" ? "Timer" : key));

    expect(state).toHaveLength(3);
    expect(state[0]).toMatchObject({
        name: "Launch",
        nameIsCustom: true,
        targetIso: "",
        active: true,
        pausedRemainingMs: 0
    });
    expect(state[1]).toMatchObject({
        name: "Timer 2",
        nameIsCustom: false,
        targetIso: "",
        active: false,
        pausedRemainingMs: 12
    });
    expect(state[2]).toMatchObject({ name: "Timer 3", active: true, pausedRemainingMs: null });
    expect(service.slotCount).toBe(3);
    expect(service.storageKey).toBe("GTV_CalcCountdown_v1");
    expect(Object.isFrozen(service)).toBe(true);
});

test("computes active, paused, expired and invalid countdowns safely", () => {
    const service = loadCountdownStateModule().createService();
    const futureTargetMs = Date.parse("2026-01-01T00:00:02.000Z");
    const expiredTargetMs = Date.parse("2026-01-01T00:00:00.000Z");

    expect(service.parseRemainingMs(
        { active: true, targetIso: "2026-01-01T00:00:02.000Z" },
        futureTargetMs - 1000
    )).toBe(1000);
    expect(service.parseRemainingMs({ active: false, pausedRemainingMs: 2500 }, 1000)).toBe(2500);
    expect(service.parseRemainingMs(
        { active: false, targetIso: "2026-01-01T00:00:00.000Z" },
        expiredTargetMs + 1000
    )).toBe(0);
    expect(service.parseRemainingMs({ active: true, targetIso: "invalid" }, 1000)).toBeNull();
    expect(service.parseRemainingMs(null, 1000)).toBeNull();
});

test("formats countdown duration with localized suffix and injected padding", () => {
    const service = loadCountdownStateModule().createService();
    const t = (key) => (key === "calc_countdown_day_suffix" ? "일" : key);
    const pad = (value) => String(value).padStart(2, "0");

    expect(service.formatRemainingText(90_061_000, t, pad)).toBe("01일 01:01:01");
    expect(service.formatRemainingText(-1, t, pad)).toBe("00일 00:00:00");
});
