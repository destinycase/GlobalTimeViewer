/**
 * 실제 Chrome 검사 (npm run verify:chrome)
 *
 * 헤드리스 Chrome을 새 프로필로 띄워 확장을 로드하고, 사람 개입 없이 핵심 동작을 확인한다.
 * 대상: dist_extension/ (먼저 strict build) 와 release/gtv-v<버전>.zip 추출본(있을 때).
 * 결과와 내려받은 파일은 scratch/chrome/<시각>/ 에 남기며, 실패가 하나라도 있으면 종료 코드 1.
 *
 * 환경 변수
 *   GTV_CHROME_PATH         Chrome 실행 파일 경로(기본 설치 위치를 자동 탐색)
 *   GTV_CHROME_SKIP_BUILD=1 이미 만든 dist_extension/ 을 그대로 검사
 *   GTV_CHROME_TARGETS      "dist", "zip" 중 쉼표 목록(기본: 둘 다)
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { evaluate, launchChrome, sleep, until } from "./cdp-client.mjs";
import { readZipEntries } from "../../scripts/zip-archive.mjs";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const VERSION = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, "package.json"), "utf8")).version;
const STAMP = new Date().toISOString().replace(/[:.]/g, "-");
const RUN_DIR = path.join(ROOT_DIR, "scratch", "chrome", STAMP);
const STORAGE_KEY = "GTV_v324_Data";
const LEGACY_KEY = "GTV_v323_Data";

function log(message = "") {
    process.stdout.write(`${message}\n`);
}

function assert(condition, message) {
    if (!condition) throw new Error(message);
}

function prepareTargets() {
    const wanted = String(process.env.GTV_CHROME_TARGETS || "dist,zip").split(",").map((item) => item.trim());
    const targets = [];
    if (wanted.includes("dist")) {
        if (process.env.GTV_CHROME_SKIP_BUILD !== "1") {
            log("[준비] strict build");
            execFileSync(process.execPath, [path.join(ROOT_DIR, "scripts", "build-extension.mjs"), "--enforce-version-consistency"], {
                cwd: ROOT_DIR,
                stdio: "inherit"
            });
        }
        targets.push({ name: "dist_extension", dir: path.join(ROOT_DIR, "dist_extension") });
    }
    if (wanted.includes("zip")) {
        const zipPath = path.join(ROOT_DIR, "release", `gtv-v${VERSION}.zip`);
        if (fs.existsSync(zipPath)) {
            const extractDir = path.join(RUN_DIR, "zip-extract");
            for (const [name, content] of readZipEntries(zipPath)) {
                const outPath = path.join(extractDir, ...name.split("/"));
                fs.mkdirSync(path.dirname(outPath), { recursive: true });
                fs.writeFileSync(outPath, content);
            }
            targets.push({ name: `release/gtv-v${VERSION}.zip`, dir: extractDir });
        } else {
            targets.push({ name: `release/gtv-v${VERSION}.zip`, dir: null, skipReason: "ZIP 없음(npm run package 전)" });
        }
    }
    return targets;
}

// ---------------------------------------------------------------- page helpers

function pageApi(page) {
    const ev = (expression) => evaluate(page.client, expression);
    return {
        ev,
        async waitReady() {
            await until("앱 초기화", () => ev(`(() => {
                const overlay = document.getElementById("app-loading-overlay");
                const overlayDone = !overlay || overlay.classList.contains("hidden") || getComputedStyle(overlay).display === "none";
                // The app restores the last main tab, so readiness is the loading overlay going away
                // plus a rendered table for whichever tab is active.
                const rendered = document.querySelectorAll("#clocks-container tr, #fixed-time-body tr, #multi-ranges-container tr").length > 0
                    || document.querySelector('.nav-item.active[data-tab="calc"]') !== null;
                return document.readyState === "complete" && overlayDone && rendered;
            })()`), 20000);
        },
        async reload() {
            await page.client.send("Page.reload", { ignoreCache: true });
            await sleep(300);
            await this.waitReady();
        },
        async switchTab(tab) {
            await ev(`document.querySelector('.nav-item[data-tab="${tab}"]').click()`);
            await until(`탭 전환 ${tab}`, () => ev(`document.querySelector('.nav-item[data-tab="${tab}"]').classList.contains("active")`));
            await sleep(150);
        },
        storedData(key = STORAGE_KEY) {
            return ev(`(() => {
                const raw = localStorage.getItem(${JSON.stringify(key)});
                if (!raw) return null;
                const parsed = JSON.parse(raw);
                return parsed && parsed.data && parsed.__gtvStorageEnvelope ? parsed.data : parsed;
            })()`);
        },
        async mouse(type, x, y) {
            await page.client.send("Input.dispatchMouseEvent", {
                type,
                x,
                y,
                button: "left",
                buttons: type === "mouseReleased" ? 0 : 1,
                clickCount: 1
            });
        }
    };
}

// ---------------------------------------------------------------- scenarios

function buildScenarios(ctx) {
    return [
        {
            id: "1",
            title: "확장 로드·서비스 워커·아이콘 클릭 처리기",
            async run() {
                const workerUrl = `chrome-extension://${ctx.extensionId}/background.js`;
                const worker = await until("서비스 워커", async () => (await ctx.session.targets())
                    .find((target) => target.type === "service_worker" && target.url === workerUrl));
                const client = await ctx.session.attach(worker.targetId);
                await client.send("Runtime.enable");
                const manifest = await until("워커 실행 컨텍스트", () => evaluate(client, "chrome.runtime.getManifest()"));
                assert(manifest.version === VERSION, `manifest 버전 ${manifest.version} ≠ ${VERSION}`);
                const hasListener = await evaluate(client, "chrome.action.onClicked.hasListeners()");
                assert(hasListener === true, "아이콘 클릭 처리기가 등록되지 않음");
                return `manifest v${manifest.version}, onClicked 등록됨 (실제 툴바 클릭은 자동 검사 범위 밖)`;
            }
        },
        {
            id: "2",
            title: "앱 초기화 성공(치명 오류 없음)",
            async run() {
                ctx.page = await ctx.session.openPage(`chrome-extension://${ctx.extensionId}/index.html`);
                ctx.api = pageApi(ctx.page);
                await ctx.api.waitReady();
                const state = await ctx.api.ev(`({
                    fatalHidden: document.getElementById("fatal-error-banner").classList.contains("is-hidden"),
                    version: document.getElementById("version-badge")?.textContent || "",
                    chromeStorage: typeof chrome.storage
                })`);
                assert(state.fatalHidden, "치명 오류 화면이 표시됨");
                assert(state.version.includes(VERSION), `버전 표시 "${state.version}"에 ${VERSION} 없음`);
                assert(ctx.page.consoleErrors.length === 0, `콘솔 오류: ${ctx.page.consoleErrors.join(" | ")}`);
                return `버전 표시 "${state.version.trim()}", chrome.storage=${state.chromeStorage}`;
            }
        },
        {
            id: "3",
            title: "시간대 추가 → 저장 → 다시 열어도 유지",
            async run() {
                const { api } = ctx;
                await api.ev(`(() => {
                    document.getElementById("custom-abbr").value = "GTVQ";
                    document.getElementById("custom-name").value = "Chrome Check Zone";
                    document.getElementById("custom-off-h").value = "9";
                    document.getElementById("custom-off-m").value = "0";
                    document.getElementById("add-custom-btn").click();
                })()`);
                await until("행 추가", () => api.ev(`[...document.querySelectorAll("#clocks-container .zone-name")].some((el) => el.textContent.includes("Chrome Check Zone"))`));
                await until("저장", async () => JSON.stringify(await api.storedData() || {}).includes("Chrome Check Zone"));
                await api.reload();
                const kept = await api.ev(`[...document.querySelectorAll("#clocks-container .zone-name")].some((el) => el.textContent.includes("Chrome Check Zone"))`);
                assert(kept, "다시 연 뒤 추가한 시간대가 없음");
                return "UTC+09:00 사용자 지정 시간대가 다시 연 뒤에도 표시됨";
            }
        },
        {
            id: "4",
            title: "시간 변경 탭 입력 → 다른 행 반영",
            async run() {
                const { api } = ctx;
                await api.switchTab("fixed");
                await api.ev(`(() => {
                    const input = document.querySelector('#clocks-container .base-row .time-input[data-slot="0"]');
                    input.value = "2026-01-15 10:00:00";
                    input.dispatchEvent(new Event("change", { bubbles: true }));
                })()`);
                const otherValue = await until("다른 행 갱신", async () => {
                    const value = await api.ev(`(() => {
                        const row = [...document.querySelectorAll("#clocks-container tr")]
                            .find((tr) => tr.querySelector(".zone-name")?.textContent.includes("Chrome Check Zone"));
                        return row?.querySelector('.time-input[data-slot="0"]')?.value || "";
                    })()`);
                    return value.startsWith("2026-01-15 19:00:00") ? value : false;
                });
                return `기준 10:00:00(UTC) → 사용자 지정 행 ${otherValue}`;
            }
        },
        {
            id: "5",
            title: "고정 시간 탭 렌더·타임라인 슬롯 드래그 후 저장 유지",
            async run() {
                const { api } = ctx;
                await api.switchTab("fixed-time");
                await until("고정 시간 표", () => api.ev(`document.querySelectorAll("#fixed-time-body tr").length > 0`));
                const timelineOn = await api.ev(`document.getElementById("toggle-timeline").checked`);
                if (!timelineOn) await api.ev(`document.getElementById("toggle-timeline").click()`);
                const geometry = await until("타임라인 슬롯", () => api.ev(`(() => {
                    const indicator = document.querySelector("#timeline-frame .fixed-slot");
                    const box = document.querySelector("#timeline-frame .timeline-box-row");
                    if (!indicator || !box) return null;
                    indicator.scrollIntoView({ block: "center" });
                    const i = indicator.getBoundingClientRect();
                    const b = box.getBoundingClientRect();
                    if (!(i.width > 0 && b.width > 0)) return null;
                    return { x: i.left + i.width / 2, y: i.top + i.height / 2, boxLeft: b.left, boxWidth: b.width, boxY: b.top + b.height / 2 };
                })()`));
                const before = JSON.stringify((await api.storedData())?.groups?.[0]?.fixedTimes || []);
                // Mark a slot cell input: an in-place update keeps the element, a rebuild replaces it.
                const markedValue = await api.ev(`(() => {
                    const input = document.querySelector("#fixed-time-body .fixed-time-time-input");
                    input.dataset.gtvChromeMark = "1";
                    return input.value;
                })()`);
                const targetX = geometry.boxLeft + (geometry.boxWidth * 0.25);
                await api.mouse("mousePressed", geometry.x, geometry.y);
                for (let step = 1; step <= 5; step++) {
                    await api.mouse("mouseMoved", geometry.x + ((targetX - geometry.x) * step / 5), geometry.y);
                    await sleep(40);
                }
                await api.mouse("mouseReleased", targetX, geometry.y);
                const after = await until("드래그 결과 저장", async () => {
                    const value = JSON.stringify((await api.storedData())?.groups?.[0]?.fixedTimes || []);
                    return value !== before ? value : false;
                }, 5000);
                const markedAfter = await api.ev(`(() => {
                    const input = document.querySelector('#fixed-time-body .fixed-time-time-input[data-gtv-chrome-mark="1"]');
                    return input ? input.value : null;
                })()`);
                assert(markedAfter !== null, "드래그 중 고정 시간 표 셀이 다시 만들어짐(제자리 갱신 아님)");
                assert(markedAfter !== markedValue, `셀 시각이 갱신되지 않음: ${markedValue}`);
                await api.reload();
                await api.switchTab("fixed-time");
                const reloaded = JSON.stringify((await api.storedData())?.groups?.[0]?.fixedTimes || []);
                assert(reloaded === after, "다시 연 뒤 슬롯 시각이 저장값과 다름");
                return `슬롯 시각 저장 변경: ${before} → ${after}, 셀 제자리 갱신 ${markedValue} → ${markedAfter}`;
            }
        },
        {
            id: "6",
            title: "계산기 기간 계산과 날짜 바꾸기",
            async run() {
                const { api } = ctx;
                await api.switchTab("calc");
                await api.ev(`(() => {
                    const start = document.getElementById("period-start");
                    const end = document.getElementById("period-end");
                    start.value = "2026-05-10";
                    end.value = "2026-05-20";
                    start.dispatchEvent(new Event("input", { bubbles: true }));
                })()`);
                const result = await until("기간 결과", async () => {
                    const text = await api.ev(`document.getElementById("period-res").textContent`);
                    return /^10\D/.test(text) ? text : false;
                });
                await api.ev(`document.getElementById("period-swap-btn").click()`);
                const swapped = await api.ev(`({
                    start: document.getElementById("period-start").value,
                    end: document.getElementById("period-end").value,
                    res: document.getElementById("period-res").textContent
                })`);
                assert(swapped.start === "2026-05-20" && swapped.end === "2026-05-10", `바꾸기 결과 ${swapped.start} / ${swapped.end}`);
                assert(/^-10\D/.test(swapped.res), `바꾼 뒤 기간 ${swapped.res}`);
                return `기간 ${result}, 바꾸기 후 ${swapped.res}`;
            }
        },
        {
            id: "7",
            title: "설정 내보내기 파일 생성",
            async run() {
                const { api } = ctx;
                const existing = new Set(fs.existsSync(ctx.downloadDir) ? fs.readdirSync(ctx.downloadDir) : []);
                await api.ev(`document.getElementById("export-settings-btn").click()`);
                const fileName = await until("내보내기 파일", () => {
                    const files = fs.existsSync(ctx.downloadDir) ? fs.readdirSync(ctx.downloadDir) : [];
                    return files.find((name) => !existing.has(name) && /^GlobalTimeViewer_settings_.*\.json$/.test(name));
                }, 10000);
                const payload = JSON.parse(fs.readFileSync(path.join(ctx.downloadDir, fileName), "utf8"));
                assert(payload.app === "GlobalTimeViewer" && payload.version === VERSION, "내보낸 파일의 앱·버전 정보가 다름");
                assert(JSON.stringify(payload.data?.groups || []).includes("Chrome Check Zone"), "내보낸 파일에 추가한 시간대가 없음");
                return `${fileName} (groups ${payload.data.groups.length}개)`;
            }
        },
        {
            id: "8",
            title: "localStorage 옛 키(v3.2.3 형식) 이어받기",
            async run() {
                const { api } = ctx;
                const legacy = {
                    groups: [{ name: "Legacy Check Group", zones: [], baseTimezoneId: "utc", showUtcRow: true, utcRowOrder: 0 }],
                    activeGroupId: 0,
                    currentMainTab: "live",
                    activeGroupIdByMainTab: { live: 0, fixed: 0 },
                    slotCount: 1
                };
                await api.ev(`(() => {
                    localStorage.removeItem(${JSON.stringify(STORAGE_KEY)});
                    localStorage.setItem(${JSON.stringify(LEGACY_KEY)}, ${JSON.stringify(JSON.stringify(legacy))});
                })()`);
                await api.reload();
                const groupNames = await api.ev(`document.getElementById("group-tabs-container").textContent`);
                assert(groupNames.includes("Legacy Check Group"), `그룹 탭에 옛 데이터 그룹이 없음: ${groupNames.trim()}`);
                const migrated = await until("현재 키로 저장", async () => JSON.stringify(await api.storedData() || {}).includes("Legacy Check Group"));
                const legacyKept = await api.ev(`localStorage.getItem(${JSON.stringify(LEGACY_KEY)}) !== null`);
                assert(migrated && legacyKept, "현재 키 저장 또는 옛 키 보존 실패");
                return "옛 키 데이터 표시, 현재 키에 저장, 옛 키 보존";
            }
        },
        {
            id: "9",
            title: "옛 고정 서머타임 도시 항목 변환·시각 옆 DST 표시",
            async run() {
                const { api } = ctx;
                // Saved before v3.11.1: Los Angeles fixed at UTC-07:00 "PDT".
                const saved = {
                    groups: [{
                        name: "DST Legacy Group",
                        zones: [{
                            id: "tz-la-fixed",
                            type: "standard",
                            zone: "America/Los_Angeles",
                            name_ko: "미국 - 로스앤젤레스",
                            name_en: "USA - Los Angeles",
                            fixedAbbr: "PDT",
                            fixedOffsetMinutes: -420
                        }],
                        baseTimezoneId: "tz-la-fixed",
                        showUtcRow: true,
                        utcRowOrder: 0
                    }],
                    activeGroupId: 0,
                    currentMainTab: "fixed",
                    activeGroupIdByMainTab: { live: 0, fixed: 0 },
                    slotCount: 1
                };
                await api.ev(`localStorage.setItem(${JSON.stringify(STORAGE_KEY)}, ${JSON.stringify(JSON.stringify(saved))})`);
                await api.reload();
                await api.switchTab("fixed");
                const readBaseRow = async (value) => {
                    await api.ev(`(() => {
                        const input = document.querySelector('#clocks-container .base-row .time-input[data-slot="0"]');
                        input.value = ${JSON.stringify(value)};
                        input.dispatchEvent(new Event("change", { bubbles: true }));
                    })()`);
                    return until(`기준 행 갱신 ${value}`, async () => {
                        const row = await api.ev(`(() => {
                            const tr = document.querySelector("#clocks-container .base-row");
                            const cells = [...tr.querySelectorAll("td")].map((td) => td.textContent.trim());
                            const dstBadge = tr.querySelector(".dst-slot-0");
                            return {
                                abbr: cells[1],
                                name: cells[2],
                                utc: cells[3],
                                input: tr.querySelector('.time-input[data-slot="0"]').value,
                                dstVisible: !!dstBadge && !dstBadge.classList.contains("is-hidden") && getComputedStyle(dstBadge).display !== "none"
                            };
                        })()`);
                        return row.input.startsWith(value.slice(0, 10)) ? row : false;
                    });
                };
                const winter = await readBaseRow("2027-01-15 10:00:00");
                assert(winter.utc === "UTC-08:00" && winter.abbr === "PST", `1월: ${winter.abbr} ${winter.utc}`);
                assert(!winter.name.includes("[DST]") && !winter.dstVisible, `1월 DST 표시: 이름 "${winter.name}", 시각 옆 ${winter.dstVisible}`);
                const summer = await readBaseRow("2026-10-31 22:33:55");
                assert(summer.utc === "UTC-07:00" && summer.abbr === "PDT", `10월 말: ${summer.abbr} ${summer.utc}`);
                assert(summer.dstVisible, "10월 말 시각 옆 DST 표시 없음");
                assert(!summer.name.includes("[DST]"), `이름에 [DST]가 남아 있음: ${summer.name}`);
                const stored = await until("변환 저장", async () => {
                    const zone = (await api.storedData())?.groups?.[0]?.zones?.[0];
                    return zone && zone.fixedOffsetMinutes === null ? zone : false;
                });
                return `1월 ${winter.abbr} ${winter.utc}(DST 표시 없음), 10월 말 ${summer.abbr} ${summer.utc}(시각 옆 DST 표시, 이름 "${summer.name}"), 저장 fixedOffsetMinutes=${stored.fixedOffsetMinutes}`;
            }
        },
        {
            id: "10",
            title: "고정 시간 탭: 고정 날짜 기준 DST 표시·시간대 약어",
            async run() {
                const { api } = ctx;
                const readFixedTable = async (fixedDate) => {
                    const saved = {
                        groups: [{
                            name: "Fixed DST Group",
                            zones: [
                                { id: "tz-la", type: "standard", zone: "America/Los_Angeles", name_ko: "미국 - 로스앤젤레스", name_en: "USA - Los Angeles", fixedAbbr: "", fixedOffsetMinutes: null },
                                { id: "tz-seoul", type: "standard", zone: "Asia/Seoul", name_ko: "대한민국 - 서울", name_en: "Korea - Seoul", fixedAbbr: "", fixedOffsetMinutes: null }
                            ],
                            baseTimezoneId: "tz-la",
                            showUtcRow: true,
                            utcRowOrder: 0,
                            fixedDate,
                            fixedTimeShowLiveNow: false,
                            fixedTimes: [
                                { id: "ft-1", name: "A", time: "09:00" },
                                { id: "ft-2", name: "B", time: "00:30" }
                            ]
                        }],
                        activeGroupId: 0,
                        currentMainTab: "fixed-time",
                        activeGroupIdByMainTab: { live: 0, fixed: 0 },
                        slotCount: 1
                    };
                    await api.ev(`localStorage.setItem(${JSON.stringify(STORAGE_KEY)}, ${JSON.stringify(JSON.stringify(saved))})`);
                    await api.reload();
                    await api.switchTab("fixed-time");
                    return until(`고정 시간 표 ${fixedDate}`, async () => {
                        const rows = await api.ev(`[...document.querySelectorAll("#fixed-time-body tr")].map((tr) => ({
                            abbr: (tr.querySelector(".zone-code")?.textContent || "").trim(),
                            utc: (tr.querySelector(".offset-text")?.textContent || "").trim(),
                            dst: [...tr.querySelectorAll(".fixed-time-time .dst-badge")].map((b) => !b.classList.contains("is-hidden") && getComputedStyle(b).display !== "none")
                        }))`);
                        return rows.length >= 3 && rows[0].dst.length === 2 ? rows : false;
                    });
                };
                const inDst = await readFixedTable("2026-10-31");
                const [laDst, , seoulDst] = inDst;
                assert(laDst.abbr === "PDT" && laDst.utc === "UTC-07:00", `10-31 LA: ${laDst.abbr} ${laDst.utc}`);
                assert(laDst.dst.every(Boolean), `10-31 LA 슬롯 DST 표시: ${JSON.stringify(laDst.dst)}`);
                assert(!seoulDst.dst.some(Boolean), "서울에 DST 표시");
                const afterDst = await readFixedTable("2026-11-02");
                const laStd = afterDst[0];
                assert(laStd.abbr === "PST" && laStd.utc === "UTC-08:00", `11-02 LA: ${laStd.abbr} ${laStd.utc}`);
                assert(!laStd.dst.some(Boolean), `11-02 LA 슬롯 DST 표시: ${JSON.stringify(laStd.dst)}`);
                return `10-31 LA ${laDst.abbr} ${laDst.utc} 슬롯 DST ${laDst.dst.length}/2, 11-02 LA ${laStd.abbr} ${laStd.utc} DST 없음, 서울 표시 없음`;
            }
        }
    ];
}

// ---------------------------------------------------------------- runner

async function runTarget(target) {
    const results = [];
    if (!target.dir) {
        results.push({ id: "-", title: "대상 준비", status: "skipped", detail: target.skipReason });
        return results;
    }
    const downloadDir = path.join(RUN_DIR, "downloads", target.name.replace(/[^\w.-]+/g, "_"));
    const session = await launchChrome({ downloadDir });
    const ctx = { session, downloadDir, extensionId: null, page: null, api: null };
    try {
        ctx.chromeVersion = await session.version();
        ctx.extensionId = await session.loadExtension(target.dir);
        for (const scenario of buildScenarios(ctx)) {
            const startedAt = Date.now();
            try {
                const detail = await scenario.run();
                results.push({ id: scenario.id, title: scenario.title, status: "passed", detail, ms: Date.now() - startedAt });
                log(`  ✓ [${scenario.id}] ${scenario.title} — ${detail}`);
            } catch (err) {
                results.push({ id: scenario.id, title: scenario.title, status: "failed", detail: err.message, ms: Date.now() - startedAt });
                log(`  ✗ [${scenario.id}] ${scenario.title} — ${err.message}`);
            }
        }
        if (ctx.page && ctx.page.consoleErrors.length) {
            results.push({ id: "console", title: "검사 중 콘솔 오류 없음", status: "failed", detail: ctx.page.consoleErrors.join(" | ") });
            log(`  ✗ [console] ${ctx.page.consoleErrors.join(" | ")}`);
        }
    } finally {
        await session.close();
    }
    return results.map((result) => ({ ...result, chrome: ctx.chromeVersion }));
}

async function main() {
    fs.mkdirSync(RUN_DIR, { recursive: true });
    log(`GTV 실제 Chrome 검사 v${VERSION} → ${path.relative(ROOT_DIR, RUN_DIR)}`);
    const report = { version: VERSION, startedAt: new Date().toISOString(), targets: [] };
    let commit = "";
    try {
        commit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: ROOT_DIR, encoding: "utf8" }).trim();
    } catch {
        commit = "";
    }
    report.commit = commit;

    for (const target of prepareTargets()) {
        log(`\n[대상] ${target.name}`);
        const results = await runTarget(target);
        report.targets.push({ name: target.name, results });
    }

    report.finishedAt = new Date().toISOString();
    fs.writeFileSync(path.join(RUN_DIR, "result.json"), JSON.stringify(report, null, 2));

    const all = report.targets.flatMap((target) => target.results);
    const failed = all.filter((result) => result.status === "failed").length;
    const skipped = all.filter((result) => result.status === "skipped").length;
    const passed = all.filter((result) => result.status === "passed").length;
    log(`\n결과: 통과 ${passed}, 실패 ${failed}, 건너뜀 ${skipped} (건너뜀은 통과로 세지 않음)`);
    log(`기록: ${path.relative(ROOT_DIR, path.join(RUN_DIR, "result.json"))}`);
    process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
    process.stderr.write(`[실패] ${err.stack || err.message}\n`);
    process.exit(1);
});
