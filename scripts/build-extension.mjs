import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { ZipFile } = require("yazl");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const DIST_DIR = path.join(ROOT_DIR, "dist");
const DEST_DIR = path.join(ROOT_DIR, "dist_extension");
const ZIP_FILE = path.join(ROOT_DIR, "GlobalTimeViewer_extension.zip");
const BUNDLE_PATH = path.join(ROOT_DIR, "js", "bundle.js");
const SCRIPT_LIST_PATH = path.join(ROOT_DIR, "script_list.tmp");
const SOURCE_SCRIPT_LOADER_PATH = path.join(ROOT_DIR, "js", "source-script-loader.js");
const SOURCE_SCRIPT_LOADER_RELATIVE_PATH = "js/source-script-loader.js";
const MAX_BUNDLE_BYTES = 900 * 1024;
const ENFORCE_VERSION_CONSISTENCY = process.argv.includes("--enforce-version-consistency");

function writeLine(message) {
    process.stdout.write(`${String(message)}\n`);
}

function writeError(message) {
    process.stderr.write(`${String(message)}\n`);
}

function readText(filePath) {
    return fs.readFileSync(filePath, "utf8");
}

function writeText(filePath, content) {
    fs.writeFileSync(filePath, content, "utf8");
}

function ensureExists(filePath, label) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`${label} not found: ${filePath}`);
    }
}

function resolvePackageBinary(packageName, relativeBinaryPath) {
    const packageJsonPath = require.resolve(`${packageName}/package.json`);
    return path.join(path.dirname(packageJsonPath), relativeBinaryPath);
}

function runNodeBinary(binaryPath, args, label) {
    const result = spawnSync(process.execPath, [binaryPath, ...args], {
        cwd: ROOT_DIR,
        stdio: "inherit"
    });
    if (result.error) {
        throw result.error;
    }
    if (result.status !== 0) {
        throw new Error(`${label} failed with exit code ${result.status ?? "unknown"}.`);
    }
}

function syncVersionMetadata() {
    const packagePath = path.join(ROOT_DIR, "package.json");
    const manifestPath = path.join(ROOT_DIR, "manifest.json");
    const appConfigPath = path.join(ROOT_DIR, "js", "modules", "app-config.js");

    ensureExists(packagePath, "package.json");
    ensureExists(manifestPath, "manifest.json");
    ensureExists(appConfigPath, "js/modules/app-config.js");

    const packageContent = JSON.parse(readText(packagePath));
    const version = String(packageContent?.version || "").trim();
    if (!version) {
        throw new Error("Version sync failed: package.json version is empty.");
    }

    const manifestContent = readText(manifestPath);
    const appConfigContent = readText(appConfigPath);

    const manifestVersionMatch = manifestContent.match(/"version"\s*:\s*"([^"]+)"/);
    const manifestVersionNameMatch = manifestContent.match(/"version_name"\s*:\s*"([^"]+)"/);
    const appConfigVersionMatch = appConfigContent.match(/VERSION:\s*"([^"]+)"/);

    if (!manifestVersionMatch || !manifestVersionNameMatch || !appConfigVersionMatch) {
        throw new Error("Version sync failed: could not parse one or more version fields.");
    }

    const mismatches = [];
    if (manifestVersionMatch[1] !== version) {
        mismatches.push(`manifest.json version=${manifestVersionMatch[1]}`);
    }
    if (manifestVersionNameMatch[1] !== version) {
        mismatches.push(`manifest.json version_name=${manifestVersionNameMatch[1]}`);
    }
    if (appConfigVersionMatch[1] !== version) {
        mismatches.push(`js/modules/app-config.js VERSION=${appConfigVersionMatch[1]}`);
    }

    if (ENFORCE_VERSION_CONSISTENCY && mismatches.length > 0) {
        throw new Error(
            `Version consistency check failed. package.json version=${version}; mismatches: ${mismatches.join("; ")}`
        );
    }

    const nextManifestContent = manifestContent
        .replace(/"version"\s*:\s*"[^"]+"/, `"version": "${version}"`)
        .replace(/"version_name"\s*:\s*"[^"]+"/, `"version_name": "${version}"`);
    if (nextManifestContent !== manifestContent) {
        writeText(manifestPath, nextManifestContent);
        writeLine(`Synced manifest version to ${version}`);
    }

    const nextAppConfigContent = appConfigContent.replace(/VERSION:\s*"[^"]+"/, `VERSION: "${version}"`);
    if (nextAppConfigContent !== appConfigContent) {
        writeText(appConfigPath, nextAppConfigContent);
        writeLine(`Synced app-config version to ${version}`);
    }
}

function readScriptList() {
    if (!fs.existsSync(SCRIPT_LIST_PATH)) return [];
    return readText(SCRIPT_LIST_PATH)
        .split(/\r?\n/)
        .map((entry) => entry.trim())
        .filter(Boolean);
}

function readSourceScriptLoaderList() {
    ensureExists(SOURCE_SCRIPT_LOADER_PATH, "js/source-script-loader.js");
    const loaderContent = readText(SOURCE_SCRIPT_LOADER_PATH);
    const matched = loaderContent.match(/const SOURCE_SCRIPTS = Object\.freeze\((\[[\s\S]*?\])\);/);
    if (!matched) {
        throw new Error("Could not parse SOURCE_SCRIPTS from js/source-script-loader.js.");
    }
    const parsed = JSON.parse(matched[1]);
    if (!Array.isArray(parsed) || parsed.some((entry) => typeof entry !== "string" || !entry.trim())) {
        throw new Error("Invalid SOURCE_SCRIPTS payload in js/source-script-loader.js.");
    }
    return parsed;
}

function collectBundleSources(indexHtmlContent) {
    const scriptMatches = indexHtmlContent.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*><\/script>/g);
    const htmlScriptPaths = [];

    for (const match of scriptMatches) {
        const rawSrc = String(match[1] || "").trim();
        if (!rawSrc || /^(https?:)?\/\//i.test(rawSrc)) continue;
        const normalized = rawSrc.split("?")[0].trim();
        if (!normalized || normalized === "js/bundle.js" || normalized === SOURCE_SCRIPT_LOADER_RELATIVE_PATH) continue;
        if (!htmlScriptPaths.includes(normalized)) {
            htmlScriptPaths.push(normalized);
        }
    }

    const listedScriptPaths = readScriptList();
    if (listedScriptPaths.length > 0) {
        const loaderScriptPaths = readSourceScriptLoaderList();
        if (loaderScriptPaths.join("\n") !== listedScriptPaths.join("\n")) {
            throw new Error("js/source-script-loader.js does not match script_list.tmp. Run npm run sync:source-loader.");
        }
        if (htmlScriptPaths.length > 0 && htmlScriptPaths.join("\n") !== listedScriptPaths.join("\n")) {
            throw new Error("script_list.tmp does not match index.html script order.");
        }
        return listedScriptPaths;
    }

    if (htmlScriptPaths.length === 0) {
        throw new Error("No script files were discovered from index.html.");
    }
    return htmlScriptPaths;
}

function createBundle(indexHtmlContent) {
    const jsFiles = collectBundleSources(indexHtmlContent);
    const missingFiles = [];
    const bundleParts = [];

    for (const relativeFilePath of jsFiles) {
        const absoluteFilePath = path.resolve(ROOT_DIR, ...relativeFilePath.split("/"));
        if (!fs.existsSync(absoluteFilePath)) {
            missingFiles.push(relativeFilePath);
            continue;
        }
        bundleParts.push(`\n// --- File: ${relativeFilePath} ---\n`);
        bundleParts.push(readText(absoluteFilePath));
    }

    if (missingFiles.length > 0) {
        throw new Error(`Bundle source contains missing files: ${missingFiles.join(", ")}`);
    }

    fs.mkdirSync(path.dirname(BUNDLE_PATH), { recursive: true });
    writeText(BUNDLE_PATH, bundleParts.join(""));
}

function minifyBundle() {
    const terserPath = resolvePackageBinary("terser", path.join("bin", "terser"));
    writeLine("Minifying concatenated bundle...");
    runNodeBinary(
        terserPath,
        [
            BUNDLE_PATH,
            "--compress", "passes=3,toplevel",
            "--mangle", "toplevel",
            "--ecma", "2020",
            "--comments", "false",
            "--output", BUNDLE_PATH
        ],
        "Bundle minification"
    );

    const bundleSizeBytes = fs.statSync(BUNDLE_PATH).size;
    if (bundleSizeBytes > MAX_BUNDLE_BYTES) {
        throw new Error(`Bundle size gate failed: ${bundleSizeBytes} bytes (max: ${MAX_BUNDLE_BYTES}).`);
    }
    writeLine(`  Bundle size after minify: ${bundleSizeBytes} bytes`);
}

function createTemporaryViteEntry(originalIndexContent) {
    let content = originalIndexContent.replace(/<script\b[^>]*\bsrc="[^"]+"[^>]*><\/script>\s*/g, "");
    content = content.replace(/href="style\.css\?v=\d+"/g, "href=\"style.css\"");
    if (/<\/body>/i.test(content)) {
        content = content.replace(/<\/body>/i, "    <script src=\"js/bundle.js\"></script>\n</body>");
    } else {
        content += "\n<script src=\"js/bundle.js\"></script>\n";
    }
    return content;
}

function runViteBuild(originalIndexContent) {
    const vitePath = resolvePackageBinary("vite", path.join("bin", "vite.js"));
    const indexPath = path.join(ROOT_DIR, "index.html");
    const backupIndexPath = path.join(ROOT_DIR, "index.html.bak");
    const tempIndexPath = path.join(ROOT_DIR, "vite-index.html");
    let backupCreated = false;

    writeText(tempIndexPath, createTemporaryViteEntry(originalIndexContent));

    try {
        if (fs.existsSync(backupIndexPath)) {
            fs.rmSync(backupIndexPath, { force: true });
        }
        fs.renameSync(indexPath, backupIndexPath);
        backupCreated = true;
        fs.renameSync(tempIndexPath, indexPath);

        writeLine("Running Vite build...");
        runNodeBinary(vitePath, ["build"], "Vite build");
    } finally {
        if (backupCreated) {
            if (fs.existsSync(indexPath)) {
                fs.rmSync(indexPath, { force: true });
            }
            if (fs.existsSync(backupIndexPath)) {
                fs.renameSync(backupIndexPath, indexPath);
            }
        }
        if (fs.existsSync(tempIndexPath)) {
            fs.rmSync(tempIndexPath, { force: true });
        }
    }
}

function finalizeDistArtifacts() {
    ensureExists(DIST_DIR, "dist");

    const distIndexPath = path.join(DIST_DIR, "index.html");
    if (fs.existsSync(distIndexPath)) {
        const sanitizedHtml = readText(distIndexPath).replace(/ crossorigin/g, "");
        writeText(distIndexPath, sanitizedHtml);
    }

    const distJsDir = path.join(DIST_DIR, "js");
    fs.mkdirSync(distJsDir, { recursive: true });
    fs.copyFileSync(BUNDLE_PATH, path.join(distJsDir, "bundle.js"));
}

function resetDestinationDirectory() {
    fs.rmSync(DEST_DIR, { recursive: true, force: true });
    fs.mkdirSync(DEST_DIR, { recursive: true });
}

function copyDirectoryContents(sourceDir, destDir) {
    const entries = fs.readdirSync(sourceDir, { withFileTypes: true });
    for (const entry of entries) {
        const sourcePath = path.join(sourceDir, entry.name);
        const destPath = path.join(destDir, entry.name);
        fs.cpSync(sourcePath, destPath, { recursive: true, force: true });
    }
}

function copyDeploymentArtifacts() {
    writeLine("Gathering files for deployment...");
    copyDirectoryContents(DIST_DIR, DEST_DIR);
    writeLine("  Copied Vite build output");

    for (const item of ["manifest.json", "icons", "background.js"]) {
        const sourcePath = path.join(ROOT_DIR, item);
        if (!fs.existsSync(sourcePath)) {
            writeLine(`  Warning: ${item} could not be found, skipping.`);
            continue;
        }
        fs.cpSync(sourcePath, path.join(DEST_DIR, item), { recursive: true, force: true });
        writeLine(`  Copied: ${item}`);
    }
}

function validateArtifacts() {
    const distIndexPath = path.join(DEST_DIR, "index.html");
    ensureExists(distIndexPath, "dist_extension/index.html");

    const htmlContent = readText(distIndexPath);
    const scriptMatches = htmlContent.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g);

    for (const match of scriptMatches) {
        const relativeSourcePath = String(match[1] || "").trim();
        const absoluteSourcePath = path.resolve(DEST_DIR, ...relativeSourcePath.split("/"));
        ensureExists(absoluteSourcePath, `Artifact ${relativeSourcePath}`);
        writeLine(`  Verified: ${relativeSourcePath} exists`);
    }
}

function addDirectoryToZip(zipFile, sourceDir, archiveDir = "") {
    const entries = fs.readdirSync(sourceDir, { withFileTypes: true })
        .sort((left, right) => left.name.localeCompare(right.name));

    for (const entry of entries) {
        const sourcePath = path.join(sourceDir, entry.name);
        const archivePath = archiveDir
            ? `${archiveDir}/${entry.name}`.replace(/\\/g, "/")
            : entry.name.replace(/\\/g, "/");

        if (entry.isDirectory()) {
            addDirectoryToZip(zipFile, sourcePath, archivePath);
            continue;
        }
        if (entry.isFile()) {
            zipFile.addFile(sourcePath, archivePath);
        }
    }
}

async function createZipArchive() {
    fs.rmSync(ZIP_FILE, { force: true });

    const zipFile = new ZipFile();
    const outputStream = fs.createWriteStream(ZIP_FILE);

    const completion = new Promise((resolve, reject) => {
        outputStream.on("close", resolve);
        outputStream.on("error", reject);
        zipFile.outputStream.on("error", reject);
    });

    zipFile.outputStream.pipe(outputStream);
    addDirectoryToZip(zipFile, DEST_DIR);
    zipFile.end();

    await completion;
}

async function main() {
    process.chdir(ROOT_DIR);

    if (ENFORCE_VERSION_CONSISTENCY) {
        writeLine("Strict version consistency mode enabled.");
    }

    syncVersionMetadata();
    resetDestinationDirectory();

    const originalIndexContent = readText(path.join(ROOT_DIR, "index.html"));

    writeLine("Creating concatenated bundle...");
    createBundle(originalIndexContent);
    minifyBundle();
    runViteBuild(originalIndexContent);
    finalizeDistArtifacts();
    copyDeploymentArtifacts();
    validateArtifacts();

    writeLine("Creating zip archive...");
    await createZipArchive();

    writeLine(`Done! Deployment archive created: ${path.basename(ZIP_FILE)}`);
}

main().catch((error) => {
    writeError(error instanceof Error ? error.message : String(error));
    process.exit(1);
});
