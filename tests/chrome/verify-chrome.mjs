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
        },
        {
            id: "11",
            title: "QA 결함 회귀: DST 경계 기간·없는 날짜·소수 이동량",
            async run() {
                const { api } = ctx;
                // 1) Period across the New York DST end is the real 2 minutes on every row.
                const saved = {
                    groups: [{
                        name: "QA Period Group",
                        zones: [
                            { id: "tz-seoul", type: "standard", zone: "Asia/Seoul", name_ko: "대한민국 - 서울", name_en: "Korea - Seoul", fixedAbbr: "", fixedOffsetMinutes: null },
                            { id: "tz-ny", type: "standard", zone: "America/New_York", name_ko: "미국 - 뉴욕", name_en: "USA - New York", fixedAbbr: "", fixedOffsetMinutes: null }
                        ],
                        baseTimezoneId: "tz-seoul",
                        showUtcRow: true,
                        utcRowOrder: 0
                    }],
                    activeGroupId: 0,
                    currentMainTab: "fixed",
                    activeGroupIdByMainTab: { live: 0, fixed: 0 },
                    slotCount: 2
                };
                await api.ev(`localStorage.setItem(${JSON.stringify(STORAGE_KEY)}, ${JSON.stringify(JSON.stringify(saved))})`);
                await api.reload();
                await api.switchTab("fixed");
                const setSlot = (slot, value) => api.ev(`(() => {
                    const input = document.querySelector('#clocks-container .base-row .time-input[data-slot="${slot}"]');
                    input.value = ${JSON.stringify(value)};
                    input.dispatchEvent(new Event("change", { bubbles: true }));
                })()`);
                await setSlot(0, "2026-11-01 14:59:00");
                await setSlot(1, "2026-11-01 15:01:00");
                const periods = await until("기간 갱신", async () => {
                    const rows = await api.ev(`[...document.querySelectorAll("#clocks-container tr.time-row")].map((tr) => ({
                        name: (tr.querySelector(".zone-name")?.textContent || "").trim(),
                        start: tr.querySelector('.time-input[data-slot="0"]')?.value || "",
                        period: (tr.querySelector(".period-time-text")?.textContent || "").trim()
                    }))`);
                    const ny = rows.find((row) => row.name.includes("뉴욕") || row.name.includes("New York"));
                    return ny && ny.start.startsWith("2026-11-01 01:59") ? rows : false;
                });
                const nyRow = periods.find((row) => row.name.includes("뉴욕") || row.name.includes("New York"));
                assert(periods.every((row) => row.period === periods[0].period), `행별 기간이 다름: ${JSON.stringify(periods.map((row) => row.period))}`);
                assert(/^0\D+0\D+2\D/.test(nyRow.period), `뉴욕 기간 ${nyRow.period}`);

                // 2) ISO converter refuses an impossible date instead of rolling it to March 1.
                await api.switchTab("calc");
                const invalidText = await api.ev(`(() => {
                    const iso = document.getElementById("unix-iso-utc-input");
                    iso.value = "2023-02-29T00:00:00Z";
                    iso.dispatchEvent(new Event("input", { bubbles: true }));
                    return document.getElementById("unix-ts-input").value;
                })()`);
                assert(invalidText !== "1677628800" && !/^\d+$/.test(invalidText), `없는 날짜가 변환됨: ${invalidText}`);

                // 3) A fractional shift is rejected with a message instead of being cut to 2.
                const shift = await api.ev(`(() => {
                    const base = document.getElementById("offset-start");
                    base.value = "2024-02-29";
                    base.dispatchEvent(new Event("input", { bubbles: true }));
                    document.getElementById("off-unit").value = "year";
                    const amount = document.getElementById("off-val");
                    amount.value = "2.5";
                    amount.dispatchEvent(new Event("input", { bubbles: true }));
                    return {
                        result: document.getElementById("offset-res").value,
                        message: document.getElementById("off-val-error").textContent.trim()
                    };
                })()`);
                assert(shift.result === "-" && shift.message, `소수 이동량: 결과 ${shift.result}, 안내 "${shift.message}"`);
                return `뉴욕·서울·UTC 기간 ${nyRow.period}, ISO 2023-02-29 → "${invalidText}", 이동량 2.5 → "${shift.result}"(${shift.message})`;
            }
        },
        {
            id: "12",
            title: "검수 결함 회귀: 변환기 손 입력·카운트다운 수정·DST 없는 시각·고정 시간 범위·표준시 검색 안내",
            async run() {
                const { api, page } = ctx;
                const toastTexts = () => api.ev(`[...document.querySelectorAll("#toast-container .toast")].map((t) => t.textContent.trim())`);

                // a) Typing into the converter one key at a time keeps the text and converts it.
                await api.switchTab("calc");
                await api.ev(`(() => { const el = document.getElementById("unix-iso-utc-input"); el.focus(); el.select(); })()`);
                await page.client.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Backspace", code: "Backspace", windowsVirtualKeyCode: 8 });
                await page.client.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Backspace", code: "Backspace", windowsVirtualKeyCode: 8 });
                for (const ch of "2024-02-29T00:00:00Z") {
                    await page.client.send("Input.insertText", { text: ch });
                }
                const typed = await api.ev(`({ field: document.getElementById("unix-iso-utc-input").value, unixSec: document.getElementById("unix-ts-input").value })`);
                assert(typed.field === "2024-02-29T00:00:00Z" && typed.unixSec === "1709164800", `변환기 손 입력: ${JSON.stringify(typed)}`);

                // b) Countdown: a manual edit after a calendar selection is used.
                const countdown = await api.ev(`(() => {
                    const input = document.querySelector(".countdown-target-input");
                    if (!input._cdp) return { error: "no picker" };
                    input._cdp.setDate(new Date(2030, 0, 1, 0, 0, 0));
                    input.dispatchEvent(new Event("change", { bubbles: true }));
                    input.value = "2031-06-15 12:00:00";
                    input.dispatchEvent(new Event("change", { bubbles: true }));
                    return { shown: input.value, picker: input._cdp.selectedDate ? input._cdp.selectedDate.getFullYear() : null };
                })()`);
                assert(countdown.shown === "2031-06-15 12:00:00" && countdown.picker === 2031, `카운트다운 수동 수정: ${JSON.stringify(countdown)}`);

                // c) A skipped DST-start time moves forward with a notice; d) fixed-time 25:00 is refused.
                const saved = {
                    groups: [{
                        name: "Review Group",
                        zones: [
                            { id: "tz-ny", type: "standard", zone: "America/New_York", name_ko: "미국 - 뉴욕", name_en: "USA - New York", fixedAbbr: "", fixedOffsetMinutes: null }
                        ],
                        baseTimezoneId: "tz-ny",
                        showUtcRow: true,
                        utcRowOrder: 0,
                        fixedDate: "2026-07-01",
                        fixedTimeShowLiveNow: false,
                        fixedTimes: [{ id: "ft-1", name: "A", time: "09:00" }]
                    }],
                    activeGroupId: 0,
                    currentMainTab: "fixed",
                    activeGroupIdByMainTab: { live: 0, fixed: 0 },
                    slotCount: 1
                };
                await api.ev(`localStorage.setItem(${JSON.stringify(STORAGE_KEY)}, ${JSON.stringify(JSON.stringify(saved))})`);
                await api.reload();
                await api.switchTab("fixed");
                await api.ev(`(() => {
                    const input = document.querySelector('#clocks-container .base-row .time-input[data-slot="0"]');
                    input.value = "2026-03-08 02:30:00";
                    input.dispatchEvent(new Event("change", { bubbles: true }));
                })()`);
                const gap = await until("없는 시각 보정", async () => {
                    const value = await api.ev(`document.querySelector('#clocks-container .base-row .time-input[data-slot="0"]').value`);
                    return value.startsWith("2026-03-08 03:30:00") ? value : false;
                });
                const gapToasts = await toastTexts();
                assert(gapToasts.some((text) => text.includes("서머타임") || text.toLowerCase().includes("daylight")), `없는 시각 안내 없음: ${JSON.stringify(gapToasts)}`);

                await api.switchTab("fixed-time");
                await until("고정 시간 표", () => api.ev(`document.querySelectorAll("#fixed-time-body .fixed-time-time-input").length > 0`));
                const fixedBefore = await api.ev(`document.querySelector("#fixed-time-body .fixed-time-time-input").value`);
                await api.ev(`(() => {
                    const input = document.querySelector("#fixed-time-body .fixed-time-time-input");
                    input.value = "25:00:00";
                    input.dispatchEvent(new Event("change", { bubbles: true }));
                })()`);
                await sleep(300);
                const fixedAfter = await api.ev(`document.querySelector("#fixed-time-body .fixed-time-time-input").value`);
                const storedSlot = (await api.storedData())?.groups?.[0]?.fixedTimes?.[0]?.time;
                assert(fixedAfter === fixedBefore && storedSlot === "09:00", `고정 시간 25:00: 표시 ${fixedBefore}→${fixedAfter}, 저장 ${storedSlot}`);

                // e) The standard time list has its own search hint.
                await api.ev(`document.getElementById("show-all-tz").click()`);
                await sleep(200);
                const placeholder = await api.ev(`document.getElementById("tz-search-input").placeholder`);
                await api.ev(`document.getElementById("close-overlay").click()`);
                assert(/UTC/.test(placeholder) && !/도시|city/i.test(placeholder), `표준시 목록 안내: ${placeholder}`);

                return `변환기 손 입력 ${typed.unixSec}, 카운트다운 ${countdown.shown}, 02:30 → ${gap.slice(11, 19)}(안내), 25:00 거부(${fixedAfter}), 표준시 안내 "${placeholder}"`;
            }
        },
        {
            id: "13",
            title: "그룹 만들기(이름 입력 창)·같은 도시 중복 추가 방지",
            async run() {
                const { api } = ctx;
                const toastTexts = () => api.ev(`[...document.querySelectorAll("#toast-container .toast")].map((t) => t.textContent.trim())`);
                // Real mouse clicks at the element centre, as a person would click.
                const clickAt = async (selector) => {
                    const rect = await api.ev(`(() => {
                        const el = document.querySelector(${JSON.stringify(selector)});
                        if (!el) return null;
                        el.scrollIntoView({ block: "center" });
                        const r = el.getBoundingClientRect();
                        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
                    })()`);
                    assert(rect, `클릭 대상 없음: ${selector}`);
                    await api.mouse("mousePressed", rect.x, rect.y);
                    await api.mouse("mouseReleased", rect.x, rect.y);
                    await sleep(150);
                };
                const groupTabs = () => api.ev(`[...document.querySelectorAll("#group-tabs-container .group-tab")].map((tab) => ({
                    name: tab.querySelector(".group-name-label")?.textContent || "",
                    active: tab.classList.contains("active")
                }))`);
                const promptShown = () => api.ev(`getComputedStyle(document.getElementById("app-prompt-overlay")).display !== "none"`);
                // The group name must be asked in the in-page dialog, filled with real clicks and typing.
                // A browser prompt would block the page, so it is still answered from the CDP event and
                // then reported as a failure instead of hanging the run.
                const nativeDialogs = [];
                let nativeAnswer = null;
                if (!ctx.dialogHandlerInstalled) {
                    ctx.dialogHandlerInstalled = true;
                    ctx.page.client.on("Page.javascriptDialogOpening", (params) => {
                        nativeDialogs.push({ type: params.type, message: params.message });
                        ctx.page.client.send("Page.handleJavaScriptDialog", nativeAnswer === null
                            ? { accept: false }
                            : { accept: true, promptText: nativeAnswer }).catch(() => {});
                    });
                }
                const answerGroupName = async (name) => {
                    const before = nativeDialogs.length;
                    nativeAnswer = name;
                    await clickAt("#add-group-btn");
                    if (nativeDialogs.length > before) {
                        const dialog = nativeDialogs[nativeDialogs.length - 1];
                        assert(dialog.type === "prompt", `예상 밖 브라우저 창: ${JSON.stringify(dialog)}`);
                        return { kind: "browser", title: dialog.message.trim() };
                    }
                    await until("이름 입력 창 표시", promptShown);
                    const title = await api.ev(`document.getElementById("app-prompt-title").textContent.trim()`);
                    if (name === null) {
                        await clickAt("#app-prompt-cancel");
                    } else {
                        await clickAt("#app-prompt-input");
                        await api.ev(`document.getElementById("app-prompt-input").select()`);
                        await ctx.page.client.send("Input.insertText", { text: name });
                        await clickAt("#app-prompt-confirm");
                    }
                    await until("이름 입력 창 닫힘", async () => !(await promptShown()));
                    return { kind: "page", title };
                };
                const tableNames = () => api.ev(`[...document.querySelectorAll("#clocks-container .zone-name")].map((el) => el.textContent.trim())`);

                const saved = {
                    groups: [{
                        name: "Dup Group",
                        zones: [
                            { id: "tz-ny", type: "standard", zone: "America/New_York", name_ko: "미국 - 뉴욕", name_en: "USA - New York", fixedAbbr: "", fixedOffsetMinutes: null }
                        ],
                        baseTimezoneId: "utc",
                        showUtcRow: true,
                        utcRowOrder: 0,
                        fixedDate: "2026-07-01",
                        fixedTimeShowLiveNow: false,
                        fixedTimes: [{ id: "ft-1", name: "A", time: "09:00" }]
                    }],
                    activeGroupId: 0,
                    currentMainTab: "live",
                    activeGroupIdByMainTab: { live: 0, fixed: 0 },
                    slotCount: 1
                };
                await api.ev(`localStorage.setItem(${JSON.stringify(STORAGE_KEY)}, ${JSON.stringify(JSON.stringify(saved))})`);
                await api.reload();
                await api.switchTab("live");
                assert((await groupTabs()).length === 1, `시작 그룹 수: ${JSON.stringify(await groupTabs())}`);

                // a) Cancel leaves the groups unchanged.
                const cancelled = await answerGroupName(null);
                assert(cancelled.kind === "page", "그룹 이름을 브라우저 기본 입력 창으로 물음(화면 안 입력 창이어야 함)");
                await sleep(200);
                assert((await groupTabs()).length === 1, `취소 뒤 그룹 수: ${JSON.stringify(await groupTabs())}`);

                // b) Typing a name and confirming creates, selects and saves the group.
                const named = await answerGroupName("QA 새 그룹");
                assert(named.kind === "page", "그룹 이름을 브라우저 기본 입력 창으로 물음(화면 안 입력 창이어야 함)");
                const tabsAfter = await until("새 그룹 탭", async () => {
                    const tabs = await groupTabs();
                    return tabs.length === 2 ? tabs : false;
                });
                assert(tabsAfter[1].name === "QA 새 그룹" && tabsAfter[1].active, `새 그룹 탭: ${JSON.stringify(tabsAfter)}`);
                await until("새 그룹 저장", async () => (await api.storedData())?.groups?.[1]?.name === "QA 새 그룹");
                await api.reload();
                const tabsReloaded = await groupTabs();
                assert(tabsReloaded.length === 2 && tabsReloaded[1].name === "QA 새 그룹", `다시 연 뒤 그룹: ${JSON.stringify(tabsReloaded)}`);

                // c) Back in the first group, adding New York again is refused with a notice;
                //    Seoul is added once and refused the second time.
                await clickAt("#group-tabs-container .group-tab:first-child .group-name-label");
                await until("첫 그룹 선택", async () => (await groupTabs())[0].active);
                const addFromList = async (query, titlePart) => {
                    await api.ev(`document.getElementById("show-all-tz").click()`);
                    await until("시간대 목록 열림", () => api.ev(`getComputedStyle(document.getElementById("full-tz-overlay")).display !== "none"`));
                    await api.ev(`document.getElementById("tz-tab-country").click()`);
                    await api.ev(`(() => {
                        const input = document.getElementById("tz-search-input");
                        input.value = ${JSON.stringify(query)};
                        input.dispatchEvent(new Event("input", { bubbles: true }));
                    })()`);
                    const index = await until(`검색 결과 ${query}`, () => api.ev(`(() => {
                        const items = [...document.querySelectorAll("#full-tz-list .tz-item")];
                        const i = items.findIndex((item) => item.querySelector(".tz-item-title")?.textContent.includes(${JSON.stringify(titlePart)}));
                        return i >= 0 ? i + 1 : false;
                    })()`));
                    await clickAt(`#full-tz-list .tz-item:nth-child(${index})`);
                    await sleep(200);
                    const stillOpen = await api.ev(`getComputedStyle(document.getElementById("full-tz-overlay")).display !== "none"`);
                    if (stillOpen) await api.ev(`document.getElementById("close-overlay").click()`);
                    await sleep(150);
                };
                const zoneCount = async () => (await api.storedData())?.groups?.[0]?.zones?.length;

                await api.ev(`document.querySelectorAll("#toast-container .toast").forEach((t) => t.remove())`);
                await addFromList("뉴욕", "뉴욕");
                const dupToasts = await toastTexts();
                assert(dupToasts.some((text) => text.includes("이미 존재") || text.toLowerCase().includes("already")), `뉴욕 중복 안내 없음: ${JSON.stringify(dupToasts)}`);
                const namesAfterDup = await tableNames();
                assert(namesAfterDup.filter((name) => name.includes("뉴욕")).length === 1 && await zoneCount() === 1, `뉴욕 중복 추가됨: ${JSON.stringify(namesAfterDup)}`);

                await addFromList("서울", "서울");
                await until("서울 추가", async () => await zoneCount() === 2);
                await api.ev(`document.querySelectorAll("#toast-container .toast").forEach((t) => t.remove())`);
                await addFromList("서울", "서울");
                const seoulToasts = await toastTexts();
                const namesFinal = await tableNames();
                assert(seoulToasts.some((text) => text.includes("이미 존재") || text.toLowerCase().includes("already")), `서울 중복 안내 없음: ${JSON.stringify(seoulToasts)}`);
                assert(namesFinal.filter((name) => name.includes("서울")).length === 1 && await zoneCount() === 2, `서울 중복 추가됨: ${JSON.stringify(namesFinal)}`);
                assert(((await api.storedData())?.groups?.[1]?.zones || []).length === 0, "새 그룹에 시간대가 들어감");

                // d) The selected group stays the same when moving between the left tabs.
                await clickAt("#group-tabs-container .group-tab:nth-child(2) .group-name-label");
                await until("새 그룹 선택", async () => (await groupTabs())[1].active);
                const keptOn = [];
                for (const tab of ["fixed", "live", "multi", "fixed-time", "fixed"]) {
                    await api.switchTab(tab);
                    const active = (await groupTabs()).find((t) => t.active)?.name;
                    assert(active === "QA 새 그룹", `${tab} 탭에서 그룹이 바뀜: ${active}`);
                    keptOn.push(tab);
                }

                const promptKind = named.kind === "browser" ? "브라우저 기본 입력 창" : "화면 안 입력 창";
                return `취소 시 그룹 1개 유지, ${promptKind} "${named.title}"에 이름 입력 → 탭 "QA 새 그룹" 선택·저장·다시 연 뒤 유지, 뉴욕 재추가 거부(안내), 서울 1회 추가 후 재추가 거부(안내), 표 ${namesFinal.join(" / ")}, 탭 이동 중 그룹 유지(${keptOn.join("→")})`;
            }
        },
        {
            id: "14",
            title: "화면 배치: 연속 시간 셀 겹침·변환기 글자 잘림 없음(1280·1600px)",
            async run() {
                const { api } = ctx;
                const zone = (id, name, ko, en) => ({ id, type: "standard", zone: name, name_ko: ko, name_en: en, fixedAbbr: "", fixedOffsetMinutes: null });
                const saved = {
                    groups: [{
                        name: "Layout Group",
                        zones: [
                            zone("tz-ny", "America/New_York", "미국 - 뉴욕", "USA - New York"),
                            zone("tz-se", "Asia/Seoul", "대한민국 - 서울", "Korea - Seoul"),
                            zone("tz-la", "America/Los_Angeles", "미국 - 로스앤젤레스", "USA - Los Angeles"),
                            zone("tz-ld", "Europe/London", "영국 - 런던", "UK - London")
                        ],
                        baseTimezoneId: "tz-se",
                        showUtcRow: true,
                        utcRowOrder: 0,
                        fixedDate: "2026-07-01",
                        fixedTimeShowLiveNow: false,
                        fixedTimes: [{ id: "ft-1", name: "A", time: "09:00" }]
                    }],
                    activeGroupId: 0,
                    currentMainTab: "multi",
                    activeGroupIdByMainTab: { live: 0, fixed: 0 },
                    slotCount: 2
                };
                await api.ev(`localStorage.setItem(${JSON.stringify(STORAGE_KEY)}, ${JSON.stringify(JSON.stringify(saved))})`);
                // Every visible element must stay inside its table cell, no input may hide part of
                // its value and no text may be cut off.
                const measureMulti = () => api.ev(`(() => {
                    const problems = [];
                    document.querySelectorAll(".multi-range-table tr.time-row").forEach((tr, row) => {
                        [...tr.children].forEach((td, col) => {
                            const cell = td.getBoundingClientRect();
                            if (cell.width === 0) return;
                            const where = "r" + row + "c" + col + " ";
                            td.querySelectorAll("*").forEach((el) => {
                                const box = el.getBoundingClientRect();
                                if (box.width === 0 || el.closest(".is-hidden")) return;
                                if (box.left < cell.left - 0.5 || box.right > cell.right + 0.5) problems.push("셀 밖 " + where + (el.className || el.tagName));
                            });
                            [td, ...td.querySelectorAll("*")].forEach((el) => {
                                if (el.tagName === "INPUT") {
                                    if (el.scrollWidth > el.clientWidth + 1) problems.push("입력 잘림 " + where + el.value);
                                } else if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflow !== "visible") {
                                    problems.push("글자 잘림 " + where + el.textContent.trim().slice(0, 20));
                                }
                            });
                        });
                    });
                    const wrap = document.querySelector(".multi-range-table-wrap");
                    return {
                        problems,
                        rows: document.querySelectorAll(".multi-range-table tr.time-row").length,
                        dst: document.querySelectorAll(".multi-range-table .dst-badge:not(.is-hidden)").length,
                        sideScroll: wrap ? wrap.scrollWidth > wrap.clientWidth + 1 : null
                    };
                })()`);
                const results = [];
                try {
                    for (const width of [1280, 1600]) {
                        await ctx.page.client.send("Emulation.setDeviceMetricsOverride", { width, height: 1000, deviceScaleFactor: 1, mobile: false });
                        await api.reload();
                        await api.switchTab("multi");
                        await until("연속 시간 표", () => api.ev(`document.querySelectorAll(".multi-range-table tr.time-row").length >= 5`));
                        // July start: New York, Los Angeles and London show the DST badge (the widest cells).
                        await api.ev(`(() => {
                            const input = document.querySelector(".multi-range-table .base-row .time-input.slot-0");
                            input.value = "2026-07-15 10:00:00";
                            input.dispatchEvent(new Event("change", { bubbles: true }));
                        })()`);
                        await until("DST 표시", () => api.ev(`document.querySelectorAll(".multi-range-table .dst-badge:not(.is-hidden)").length >= 3`));
                        await sleep(200);
                        const multi = await measureMulti();
                        assert(multi.problems.length === 0, `${width}px 연속 시간: ${multi.problems.slice(0, 6).join(" | ")}`);
                        assert(multi.sideScroll === false, `${width}px 연속 시간 표가 옆으로 넘침`);

                        // Time adjust rows in the same panel start their hour/day/week buttons at the
                        // same position, whatever their leading buttons are.
                        const alignment = async (tab) => {
                            await api.switchTab(tab);
                            return api.ev(`(() => {
                                const panels = new Map();
                                document.querySelectorAll(".time-adjust-set").forEach((set) => {
                                    if (set.getBoundingClientRect().width === 0) return;
                                    const button = set.querySelector('[data-action="minus_hour"]');
                                    const panel = set.closest(".multi-range-block, #multi-tools-row, .control-panel, section") || document.body;
                                    if (!button) return;
                                    const list = panels.get(panel) || [];
                                    list.push(["minus_hour", "minus_day", "minus_week", "plus_four_weeks"].map((action) => Math.round(set.querySelector('[data-action="' + action + '"]').getBoundingClientRect().left)));
                                    panels.set(panel, list);
                                });
                                return [...panels.values()].filter((rows) => rows.length > 1);
                            })()`);
                        };
                        const checkAlignment = async (context) => {
                            for (const tab of ["fixed", "multi"]) {
                                const groups = await alignment(tab);
                                assert(groups.length > 0, `${context} ${tab} 시간 조정 행 없음`);
                                groups.forEach((rows) => {
                                    const same = rows.every((row) => row.every((x, i) => Math.abs(x - rows[0][i]) <= 1));
                                    assert(same, `${context} ${tab} 시간 조정 버튼 열 어긋남: ${JSON.stringify(rows)}`);
                                });
                            }
                        };
                        await checkAlignment(`${width}px`);
                        if (width === 1600) {
                            // The time-edit table fits without sideways scrolling and keeps full times.
                            await api.switchTab("fixed");
                            const timeEdit = await api.ev(`(() => {
                                const table = document.querySelector("#clocks-container").closest("table");
                                const wrap = document.getElementById("timezone-section");
                                const clipped = [...table.querySelectorAll(".time-input")].filter((el) => el.getBoundingClientRect().width > 0 && el.scrollWidth > el.clientWidth + 1).map((el) => el.value);
                                return { sideScroll: wrap.scrollWidth > wrap.clientWidth + 1, clipped, rows: table.querySelectorAll("tr.time-row").length };
                            })()`);
                            assert(timeEdit.rows >= 5 && !timeEdit.sideScroll, `1600px 시간 변경 표가 옆으로 넘침`);
                            assert(timeEdit.clipped.length === 0, `1600px 시간 변경 입력 잘림: ${timeEdit.clipped.join(" | ")}`);
                            // Rows rendered while their tab is hidden, at 125% UI scale, must line up too.
                            await api.ev(`(() => {
                                const data = JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEY)}));
                                const target = data && data.data && data.__gtvStorageEnvelope ? data.data : data;
                                target.currentMainTab = "calc";
                                localStorage.setItem(${JSON.stringify(STORAGE_KEY)}, JSON.stringify(data));
                                localStorage.setItem("GTV_UIScale", "125");
                            })()`);
                            await api.reload();
                            try {
                                await checkAlignment("125% 숨은 탭 시작");
                            } finally {
                                await api.ev(`localStorage.removeItem("GTV_UIScale")`);
                                await api.reload();
                            }
                        }
                        await api.switchTab("multi");

                        await api.switchTab("calc");
                        const converter = await api.ev(`(() => {
                            const input = document.getElementById("unix-iso-local-input");
                            input.value = "2026-11-09T18:41:00+09:00";
                            input.dispatchEvent(new Event("input", { bubbles: true }));
                            input.dispatchEvent(new Event("change", { bubbles: true }));
                            return [...document.querySelectorAll(".smart-format-input")].map((el) => ({ id: el.id, value: el.value, clipped: el.scrollWidth > el.clientWidth + 1 }));
                        })()`);
                        const clipped = converter.filter((field) => field.clipped).map((field) => `${field.id}="${field.value}"`);
                        assert(converter.length >= 7 && converter.every((field) => field.value), `${width}px 변환기 값: ${JSON.stringify(converter)}`);
                        assert(clipped.length === 0, `${width}px 변환기 잘림: ${clipped.join(" | ")}`);
                        results.push(`${width}px 행 ${multi.rows}·DST ${multi.dst}·변환기 ${converter.length}칸`);
                    }
                } finally {
                    await ctx.page.client.send("Emulation.clearDeviceMetricsOverride");
                }
                return `겹침·잘림 없음: ${results.join(", ")}`;
            }
        },
        {
            id: "15",
            title: "사이드바 도움말·설정 아이콘과 설정·도움말 팝업",
            async run() {
                const { api } = ctx;
                await api.reload();
                const clickAt = async (selector) => {
                    const rect = await api.ev(`(() => {
                        const el = document.querySelector(${JSON.stringify(selector)});
                        if (!el) return null;
                        const r = el.getBoundingClientRect();
                        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
                    })()`);
                    assert(rect, `클릭 대상 없음: ${selector}`);
                    await api.mouse("mousePressed", rect.x, rect.y);
                    await api.mouse("mouseReleased", rect.x, rect.y);
                    await sleep(200);
                };
                const shown = (id) => api.ev(`getComputedStyle(document.getElementById(${JSON.stringify(id)})).display !== "none"`);
                const pressEscape = async () => {
                    await ctx.page.client.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
                    await ctx.page.client.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
                    await sleep(200);
                };

                // The sidebar footer holds only the help and settings icon buttons, left aligned.
                const footer = await api.ev(`(() => {
                    const footer = document.querySelector(".sidebar-footer");
                    const buttons = [...footer.querySelectorAll("button")];
                    const footerLeft = footer.getBoundingClientRect().left;
                    return {
                        ids: buttons.map((b) => b.id),
                        labels: buttons.map((b) => b.getAttribute("aria-label")),
                        firstOffset: Math.round(buttons[0].getBoundingClientRect().left - footerLeft),
                        selects: footer.querySelectorAll("select").length
                    };
                })()`);
                assert(JSON.stringify(footer.ids) === JSON.stringify(["open-help-btn", "open-settings-btn"]) && footer.selects === 0, `사이드바 하단: ${JSON.stringify(footer)}`);
                assert(footer.firstOffset <= 24 && footer.labels.every(Boolean), `아이콘 정렬·이름: ${JSON.stringify(footer)}`);

                // Settings: open with a real click, change the theme inside, close with Esc.
                await clickAt("#open-settings-btn");
                assert(await shown("settings-overlay"), "설정 팝업이 열리지 않음");
                const inside = await api.ev(`["ui-scale-select", "theme-select", "lang-select", "export-settings-btn", "import-settings-btn", "reset-except-group-tz-btn", "reset-all-settings-btn"].every((id) => document.getElementById(id)?.closest("#settings-overlay"))`);
                assert(inside, "설정 항목이 팝업 안에 없음");
                const before = await api.ev(`document.documentElement.getAttribute("data-theme") || "dark"`);
                const next = before === "light" ? "dark" : "light";
                await api.ev(`(() => { const s = document.getElementById("theme-select"); s.value = "${next}"; s.dispatchEvent(new Event("change", { bubbles: true })); })()`);
                await until("테마 변경", async () => (await api.ev(`document.documentElement.getAttribute("data-theme") || "dark"`)) === next);
                await api.ev(`(() => { const s = document.getElementById("theme-select"); s.value = "${before}"; s.dispatchEvent(new Event("change", { bubbles: true })); })()`);
                await pressEscape();
                assert(!(await shown("settings-overlay")), "Esc로 설정 팝업이 닫히지 않음");
                const focusBack = await api.ev(`document.activeElement?.id`);

                // Help: open, close by clicking the dimmed background.
                await clickAt("#open-help-btn");
                assert(await shown("help-overlay"), "도움말 팝업이 열리지 않음");
                const helpText = await api.ev(`document.querySelector("#help-overlay .help-body").innerText.trim().length`);
                assert(helpText > 200, `도움말 내용이 비어 있음(${helpText}자)`);
                await api.mouse("mousePressed", 30, 500);
                await api.mouse("mouseReleased", 30, 500);
                await sleep(200);
                assert(!(await shown("help-overlay")), "바깥 클릭으로 도움말이 닫히지 않음");

                return `하단 아이콘 ${footer.labels.join("·")}(왼쪽 ${footer.firstOffset}px), 설정 팝업 안 항목 7개·테마 ${next} 전환, Esc 닫힘(초점 ${focusBack}), 도움말 ${helpText}자·바깥 클릭 닫힘`;
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
