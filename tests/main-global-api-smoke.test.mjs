import { describe, expect, it } from "vitest";

import { createMainContext } from "./helpers/create-main-context.mjs";

describe("main global API smoke", () => {
    it("keeps core global facade APIs available", () => {
        const { sandbox } = createMainContext();
        const requiredApis = [
            "switchMainTab",
            "renderList",
            "addTimezone",
            "removeTimezone",
            "applyTimeAdjustAction",
            "renderTimelineFrame",
            "copyAllTimezones",
            "getZoneDisplayName"
        ];

        requiredApis.forEach((name) => {
            expect(typeof sandbox[name]).toBe("function");
        });
    });
});
