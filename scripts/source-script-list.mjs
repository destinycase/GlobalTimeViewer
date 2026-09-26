import fs from "node:fs";
import path from "node:path";

export function parseSourceScriptList(content) {
    const entries = String(content ?? "")
        .split(/\r?\n/)
        .map((entry) => entry.trim())
        .filter(Boolean);

    if (entries.length === 0) {
        throw new Error("script_list.tmp is empty.");
    }

    const seen = new Set();
    for (const entry of entries) {
        if (entry.includes("\\") || entry.startsWith("/") || /^[a-z][a-z\d+.-]*:/i.test(entry)) {
            throw new Error(`Invalid local script path in script_list.tmp: ${entry}`);
        }

        const normalized = path.posix.normalize(entry);
        if (normalized !== entry || normalized === "." || normalized.startsWith("../")) {
            throw new Error(`Script path must be normalized and stay within the project: ${entry}`);
        }

        if (seen.has(entry)) {
            throw new Error(`Duplicate script path in script_list.tmp: ${entry}`);
        }
        seen.add(entry);
    }

    return entries;
}

export function validateSourceScriptFiles(rootDir, sourceScripts) {
    const missingFiles = sourceScripts.filter((entry) => {
        try {
            return !fs.statSync(path.resolve(rootDir, ...entry.split("/"))).isFile();
        } catch {
            return true;
        }
    });

    if (missingFiles.length > 0) {
        throw new Error(`Source script list contains missing files: ${missingFiles.join(", ")}`);
    }
}

export function validateRuntimeScriptCoverage(rootDir, sourceScripts) {
    const runtimeScripts = [
        "i18n.js",
        "main.js",
        ...listJavaScriptFiles(path.join(rootDir, "js", "vendor"), "js/vendor"),
        ...listJavaScriptFiles(path.join(rootDir, "js", "modules"), "js/modules")
    ].sort();
    const listedScripts = [...sourceScripts].sort();
    const omittedScripts = runtimeScripts.filter((entry) => !listedScripts.includes(entry));
    const unexpectedScripts = listedScripts.filter((entry) => !runtimeScripts.includes(entry));

    if (omittedScripts.length > 0 || unexpectedScripts.length > 0) {
        const details = [];
        if (omittedScripts.length > 0) details.push(`not listed: ${omittedScripts.join(", ")}`);
        if (unexpectedScripts.length > 0) details.push(`not runtime sources: ${unexpectedScripts.join(", ")}`);
        throw new Error(`script_list.tmp does not cover runtime scripts (${details.join("; ")}).`);
    }
}

function listJavaScriptFiles(directoryPath, relativeDirectory) {
    return fs.readdirSync(directoryPath, { withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith(".js"))
        .map((entry) => `${relativeDirectory}/${entry.name}`);
}
