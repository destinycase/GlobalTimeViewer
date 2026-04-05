import fs from "node:fs";
import path from "node:path";

import { expect, test } from "vitest";

const MODULES_DIR = path.resolve(process.cwd(), "js", "modules");

test("all module files expose createService entrypoint", () => {
    const files = fs.readdirSync(MODULES_DIR)
        .filter((name) => name.endsWith(".js"))
        .sort();

    const missing = files.filter((name) => {
        const fullPath = path.join(MODULES_DIR, name);
        const code = fs.readFileSync(fullPath, "utf8");
        return !/function\s+createService\s*\(/.test(code);
    });

    expect(missing).toEqual([]);
});

test("module dependency invocation helpers follow unified style", () => {
    const files = fs.readdirSync(MODULES_DIR)
        .filter((name) => name.endsWith(".js"))
        .sort();

    const legacyToSafeCallable = [];
    const legacyInvokeDep = [];

    files.forEach((name) => {
        const fullPath = path.join(MODULES_DIR, name);
        const code = fs.readFileSync(fullPath, "utf8");

        if (/function\s+toSafeCallable\s*\(\s*depFn\s*\)/.test(code)) {
            legacyToSafeCallable.push(name);
        }
        if (/\binvokeDep\s*\(/.test(code)) {
            legacyInvokeDep.push(name);
        }
    });

    expect(legacyToSafeCallable).toEqual([]);
    expect(legacyInvokeDep).toEqual([]);
});
