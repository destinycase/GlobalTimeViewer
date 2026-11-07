import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, expect, test } from "vitest";

import {
    createDeterministicZip,
    listFilesRecursively,
    readZipEntries
} from "../../scripts/zip-archive.mjs";

let tempDir;

afterEach(() => {
    if (tempDir) fs.rmSync(tempDir, { recursive: true, force: true });
    tempDir = undefined;
});

function makeSourceTree() {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "gtv-zip-"));
    const sourceDir = path.join(tempDir, "source");
    fs.mkdirSync(path.join(sourceDir, "js"), { recursive: true });
    fs.mkdirSync(path.join(sourceDir, "icons"), { recursive: true });
    fs.writeFileSync(path.join(sourceDir, "manifest.json"), "{\"version\":\"1.0.0\"}\n");
    fs.writeFileSync(path.join(sourceDir, "js", "bundle.js"), "console.warn('x');\n".repeat(200));
    fs.writeFileSync(path.join(sourceDir, "icons", "icon16.png"), Buffer.from([0x89, 0x50, 0x4e, 0x47, 0, 1, 2, 3]));
    return sourceDir;
}

function sha256(filePath) {
    return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

test("lists files recursively in a stable order with forward slashes", () => {
    const sourceDir = makeSourceTree();
    expect(listFilesRecursively(sourceDir)).toEqual(["icons/icon16.png", "js/bundle.js", "manifest.json"]);
});

test("round-trips every file byte for byte", async () => {
    const sourceDir = makeSourceTree();
    const zipPath = path.join(tempDir, "out.zip");
    await createDeterministicZip(sourceDir, zipPath);
    const entries = readZipEntries(zipPath);
    expect([...entries.keys()].sort()).toEqual(listFilesRecursively(sourceDir));
    for (const [name, content] of entries) {
        expect(content.equals(fs.readFileSync(path.join(sourceDir, ...name.split("/"))))).toBe(true);
    }
});

test("produces identical archives for identical input even when file times differ", async () => {
    const sourceDir = makeSourceTree();
    const firstZip = path.join(tempDir, "first.zip");
    await createDeterministicZip(sourceDir, firstZip);
    const later = new Date(Date.now() + 86_400_000);
    fs.utimesSync(path.join(sourceDir, "manifest.json"), later, later);
    const secondZip = path.join(tempDir, "second.zip");
    await createDeterministicZip(sourceDir, secondZip);
    expect(sha256(secondZip)).toBe(sha256(firstZip));
});

test("refuses to overwrite an existing archive", async () => {
    const sourceDir = makeSourceTree();
    const zipPath = path.join(tempDir, "existing.zip");
    fs.writeFileSync(zipPath, "keep");
    await expect(createDeterministicZip(sourceDir, zipPath)).rejects.toThrow();
    expect(fs.readFileSync(zipPath, "utf8")).toBe("keep");
});
