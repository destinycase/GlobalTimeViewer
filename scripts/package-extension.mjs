/**
 * Chrome 웹 스토어 배포용 ZIP 패키징 파이프라인
 *
 * [1/5] 회귀 테스트 (npm test)
 * [2/5] 엄격 빌드 (버전 일관성 확인 포함) -> dist_extension/
 * [3/5] 빌드 결과 버전 확인
 * [4/5] ZIP 생성 -> release/gtv-vX.Y.Z.zip (같은 이름이 있으면 중단)
 * [5/5] ZIP 내용 대조, 크기·SHA-256 출력, 배포물 검사 (tests/audit)
 *
 * GTV_RELEASE_DIR: ZIP 출력 폴더(기본 release/). 재현성 확인 등 중간 검증은 scratch/ 아래로 분리한다.
 * GTV_SKIP_PRETEST=1: CI에서 같은 소스의 전체 검사가 앞 작업에서 끝난 경우에만 [1/5]를 건너뛴다.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createDeterministicZip, listFilesRecursively, readZipEntries } from "./zip-archive.mjs";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEST_DIR = path.join(ROOT_DIR, "dist_extension");
const RELEASE_DIR = path.resolve(ROOT_DIR, process.env.GTV_RELEASE_DIR || "release");
const NPM_COMMAND = process.platform === "win32" ? "npm.cmd" : "npm";

function log(message = "") {
    process.stdout.write(`${message}\n`);
}

function fail(message) {
    process.stderr.write(`\n[실패] ${message}\n`);
    process.exit(1);
}

function run(command, args, label, env = process.env) {
    const result = spawnSync(command, args, {
        cwd: ROOT_DIR,
        stdio: "inherit",
        env,
        shell: process.platform === "win32"
    });
    if (result.error || result.status !== 0) {
        fail(`${label} 실패 (exit ${result.status ?? "unknown"})`);
    }
}

function readVersion() {
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, "package.json"), "utf8"));
    const version = String(pkg.version || "").trim();
    if (!/^\d+\.\d+\.\d+$/.test(version)) fail(`package.json 버전 형식이 올바르지 않습니다: ${version}`);
    return version;
}

async function main() {
    const version = readVersion();
    const zipName = `gtv-v${version}.zip`;
    const zipPath = path.join(RELEASE_DIR, zipName);

    log("================================================================");
    log(`GTV 배포 패키징 v${version} -> ${path.relative(ROOT_DIR, zipPath)}`);
    log("================================================================");

    if (fs.existsSync(zipPath)) {
        fail(`${path.relative(ROOT_DIR, zipPath)}이(가) 이미 있습니다. 기존 배포 ZIP은 덮어쓰지 않습니다.`);
    }

    const skipPretest = process.env.GTV_SKIP_PRETEST === "1";
    if (skipPretest && process.env.CI !== "true") {
        fail("GTV_SKIP_PRETEST는 CI에서 같은 소스의 전체 검사가 끝난 뒤에만 쓸 수 있습니다.");
    }
    if (skipPretest) {
        log("\n[1/5] 회귀 테스트 생략: CI 앞 작업에서 같은 소스의 전체 검사가 통과했습니다.");
    } else {
        log("\n[1/5] 회귀 테스트 (npm test)");
        run(NPM_COMMAND, ["test"], "회귀 테스트");
    }

    log("\n[2/5] 엄격 빌드 (npm run build:strict)");
    run(NPM_COMMAND, ["run", "build:strict"], "엄격 빌드");

    log("\n[3/5] 빌드 결과 버전 확인");
    const manifest = JSON.parse(fs.readFileSync(path.join(DEST_DIR, "manifest.json"), "utf8"));
    if (manifest.version !== version || manifest.version_name !== version) {
        fail(`dist_extension/manifest.json 버전(${manifest.version}/${manifest.version_name})이 ${version}과 다릅니다.`);
    }
    const distFiles = listFilesRecursively(DEST_DIR);
    log(`  dist_extension: ${distFiles.length}개 파일, manifest v${manifest.version}`);

    log(`\n[4/5] ZIP 생성 -> ${path.relative(ROOT_DIR, zipPath)}`);
    fs.mkdirSync(RELEASE_DIR, { recursive: true });
    await createDeterministicZip(DEST_DIR, zipPath);

    log("\n[5/5] ZIP 내용 대조와 배포물 검사");
    const entries = readZipEntries(zipPath);
    const zipNames = [...entries.keys()].sort();
    if (zipNames.join("\n") !== [...distFiles].sort().join("\n")) {
        fail("ZIP 항목 목록이 dist_extension 파일 목록과 다릅니다.");
    }
    for (const name of distFiles) {
        const expected = fs.readFileSync(path.join(DEST_DIR, ...name.split("/")));
        if (!expected.equals(entries.get(name))) fail(`ZIP 항목 내용이 다릅니다: ${name}`);
    }
    run(NPM_COMMAND, ["run", "test:package"], "배포물 검사", {
        ...process.env,
        GTV_PACKAGE_ZIP: zipPath,
        GTV_REQUIRE_ARTIFACTS: "1"
    });

    const zipBuffer = fs.readFileSync(zipPath);
    const sha256 = crypto.createHash("sha256").update(zipBuffer).digest("hex").toUpperCase();
    log("\n================================================================");
    log(`완료: ${path.relative(ROOT_DIR, zipPath)}`);
    log(`  - 버전: v${version}`);
    log(`  - 파일 수: ${zipNames.length}`);
    log(`  - 크기: ${zipBuffer.length} bytes`);
    log(`  - SHA-256: ${sha256}`);
    log("================================================================");
}

main().catch((error) => fail(error instanceof Error ? error.message : String(error)));
