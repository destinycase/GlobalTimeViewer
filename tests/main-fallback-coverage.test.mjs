import { describe, expect, it } from "vitest";

import { runMainWithSandbox } from "./helpers/run-main-fallback-sandbox.mjs";

describe("main.js fallback coverage guards", () => {
    it("uses constant fallbacks in window context before resolver guard fails", () => {
        const err = runMainWithSandbox({ withWindow: true, constantsDefined: true });
        expect(String(err?.message || "")).toContain("Missing required module API: GTVMainModuleResolver.resolveModules");
    });

    it("supports globalThis constants path when window is absent", () => {
        const err = runMainWithSandbox({ withWindow: false, constantsDefined: true });
        expect(String(err?.message || "")).toContain("Missing required module API: GTVMainModuleResolver.resolveModules");
    });

    it("throws explicit error when constants module is missing", () => {
        const err = runMainWithSandbox({ withWindow: true, constantsDefined: false });
        expect(String(err?.message || "")).toContain("Missing required module: GTVMainConstants");
    });
});
