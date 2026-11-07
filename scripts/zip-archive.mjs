import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { ZipFile } = require("yazl");

// Fixed entry metadata keeps the archive byte-identical for identical inputs,
// so a stable tag can be rebuilt and compared against the recorded SHA-256.
export const FIXED_ENTRY_MTIME = new Date("2000-01-01T00:00:00Z");
export const FIXED_ENTRY_MODE = 0o100644;

export function listFilesRecursively(rootDir, relativeDir = "") {
    const absoluteDir = path.join(rootDir, relativeDir);
    const entries = fs.readdirSync(absoluteDir, { withFileTypes: true })
        .sort((left, right) => (left.name < right.name ? -1 : left.name > right.name ? 1 : 0));
    const files = [];
    for (const entry of entries) {
        const relativePath = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;
        if (entry.isDirectory()) {
            files.push(...listFilesRecursively(rootDir, relativePath));
        } else if (entry.isFile()) {
            files.push(relativePath);
        }
    }
    return files;
}

export async function createDeterministicZip(sourceDir, outputPath) {
    const zipFile = new ZipFile();
    const outputStream = fs.createWriteStream(outputPath, { flags: "wx" });
    const completion = new Promise((resolve, reject) => {
        outputStream.on("close", resolve);
        outputStream.on("error", reject);
        zipFile.outputStream.on("error", reject);
    });
    zipFile.outputStream.pipe(outputStream);
    for (const relativePath of listFilesRecursively(sourceDir)) {
        const content = fs.readFileSync(path.join(sourceDir, ...relativePath.split("/")));
        zipFile.addBuffer(content, relativePath, {
            mtime: FIXED_ENTRY_MTIME,
            mode: FIXED_ENTRY_MODE,
            compress: true
        });
    }
    zipFile.end();
    await completion;
}

function findEndOfCentralDirectory(buffer) {
    const minimumOffset = Math.max(0, buffer.length - 22 - 0xffff);
    for (let offset = buffer.length - 22; offset >= minimumOffset; offset -= 1) {
        if (buffer.readUInt32LE(offset) === 0x06054b50) return offset;
    }
    throw new Error("ZIP end of central directory record not found.");
}

// Reads every entry of a ZIP archive (stored or deflated, no ZIP64) into memory.
export function readZipEntries(zipPath) {
    const buffer = fs.readFileSync(zipPath);
    const eocdOffset = findEndOfCentralDirectory(buffer);
    const entryCount = buffer.readUInt16LE(eocdOffset + 10);
    let cursor = buffer.readUInt32LE(eocdOffset + 16);
    const entries = new Map();

    for (let index = 0; index < entryCount; index += 1) {
        if (buffer.readUInt32LE(cursor) !== 0x02014b50) {
            throw new Error(`Invalid ZIP central directory entry at ${cursor}.`);
        }
        const method = buffer.readUInt16LE(cursor + 10);
        const compressedSize = buffer.readUInt32LE(cursor + 20);
        const uncompressedSize = buffer.readUInt32LE(cursor + 24);
        const nameLength = buffer.readUInt16LE(cursor + 28);
        const extraLength = buffer.readUInt16LE(cursor + 30);
        const commentLength = buffer.readUInt16LE(cursor + 32);
        const localHeaderOffset = buffer.readUInt32LE(cursor + 42);
        const name = buffer.toString("utf8", cursor + 46, cursor + 46 + nameLength);
        cursor += 46 + nameLength + extraLength + commentLength;

        if (buffer.readUInt32LE(localHeaderOffset) !== 0x04034b50) {
            throw new Error(`Invalid ZIP local header for ${name}.`);
        }
        const localNameLength = buffer.readUInt16LE(localHeaderOffset + 26);
        const localExtraLength = buffer.readUInt16LE(localHeaderOffset + 28);
        const dataStart = localHeaderOffset + 30 + localNameLength + localExtraLength;
        const compressed = buffer.subarray(dataStart, dataStart + compressedSize);
        let content;
        if (method === 0) {
            content = Buffer.from(compressed);
        } else if (method === 8) {
            content = zlib.inflateRawSync(compressed);
        } else {
            throw new Error(`Unsupported ZIP compression method ${method} for ${name}.`);
        }
        if (content.length !== uncompressedSize) {
            throw new Error(`ZIP size mismatch for ${name}.`);
        }
        if (name.endsWith("/")) continue;
        entries.set(name, content);
    }
    return entries;
}
