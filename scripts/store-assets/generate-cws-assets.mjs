/**
 * Chrome Web Store images for Global Time Viewer (Korean and English).
 *
 * Captures the real extension from dist_extension in headless Chrome with sample groups and a
 * fixed clock, then lays the captures into store-sized frames:
 *   - cws_screenshot_1_realtime / 2_multi_range / 3_fixed_time / 4_calculator  (1280x800)
 *   - cws_promo_small  (440x280)
 *   - cws_promo_marquee (1400x560)
 * each as _ko and _en JPEG, plus icon128.png. Output: Asset/store_assets/chrome-web-store/.
 *
 * Run `npm run build` first. Usage: node scripts/store-assets/generate-cws-assets.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { launchChrome, evaluate, sleep, until } from "../../tests/chrome/cdp-client.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const DIST = path.join(ROOT, "dist_extension");
const OUT = path.join(ROOT, "Asset", "store_assets", "chrome-web-store");
const ICON = path.join(ROOT, "Asset", "icons", "icon128.png");
const STORAGE_KEY = "GTV_v324_Data";
// Tuesday 2026-11-17 10:30:00 in Seoul. Every capture shows this moment, so the images do not
// depend on when they are made.
const FIXED_NOW_MS = Date.UTC(2026, 10, 17, 1, 30, 0);
const APP_W = 1440;
const APP_H = 900;
const JPEG_QUALITY = 92;

const log = (message) => process.stdout.write(`${message}\n`);

const ZONES = [
    ["tz-se", "Asia/Seoul", "대한민국 - 서울", "Korea - Seoul"],
    ["tz-la", "America/Los_Angeles", "미국 - 로스앤젤레스", "USA - Los Angeles"],
    ["tz-ny", "America/New_York", "미국 - 뉴욕", "USA - New York"],
    ["tz-ld", "Europe/London", "영국 - 런던", "UK - London"],
    ["tz-be", "Europe/Berlin", "독일 - 베를린", "Germany - Berlin"],
    ["tz-sy", "Australia/Sydney", "호주 - 시드니", "Australia - Sydney"]
];

const TEXT = {
    ko: {
        group: "업무",
        brand: "Global Time Viewer",
        tagline: "세계 시각 비교·변환 도구",
        shots: [
            ["전 세계 시각을", "한눈에 비교", "여러 도시의 현재 시각과 낮·밤을 표와 타임라인으로 함께 봅니다."],
            ["일정 구간을", "도시별로 나란히", "시작·끝 시각이 있는 여러 구간을 시간대마다 한 번에 확인합니다."],
            ["회의 시각을", "쉽게 맞추기", "오늘 원하는 시각 여러 개를 시간대별로 한 표에서 봅니다."],
            ["시간 계산도", "한곳에서", "기간 계산, 날짜 이동, 카운트다운, Unix 시간 변환까지."]
        ],
        marquee: ["전 세계 시각을", "한 화면에서.", "세계 시계, 시간 비교, 회의 시각 맞추기,<br>시간 계산기를 탭 하나에서."],
        chips: ["실시간 세계 시계", "타임라인", "회의 시각 비교", "시간 계산기"]
    },
    en: {
        group: "Work",
        brand: "Global Time Viewer",
        tagline: "World time compare & convert",
        shots: [
            ["Every timezone,", "at a glance", "See current times and day/night across cities in a table and a timeline."],
            ["Compare time ranges", "side by side", "Check several ranges with start and end times in every timezone at once."],
            ["Plan meetings", "across timezones", "Line up several times for today in one table, per timezone."],
            ["All your time math", "in one place", "Durations, date shifts, countdowns and Unix time conversion."]
        ],
        marquee: ["World time,", "on one screen.", "World clock, time comparison, meeting planning<br>and time calculators in a single tab."],
        chips: ["Realtime world clock", "Timeline", "Meeting planner", "Time calculators"]
    }
};

function savedState(lang) {
    return {
        groups: [{
            name: TEXT[lang].group,
            zones: ZONES.map(([id, zone, ko, en]) => ({ id, type: "standard", zone, name_ko: ko, name_en: en, fixedAbbr: "", fixedOffsetMinutes: null })),
            baseTimezoneId: "tz-se",
            showUtcRow: false,
            utcRowOrder: ZONES.length
        }],
        activeGroupId: 0,
        currentMainTab: "live"
    };
}

const fixedClockScript = `(() => {
    const RealDate = Date;
    // The clock stands still at the fixed moment.
    class FixedDate extends RealDate {
        constructor(...args) { if (args.length === 0) super(${FIXED_NOW_MS}); else super(...args); }
        static now() { return ${FIXED_NOW_MS}; }
    }
    globalThis.Date = FixedDate;
})();`;

async function captureApp(session, extensionId, lang) {
    const page = await session.openPage(`chrome-extension://${extensionId}/index.html`);
    const c = page.client;
    const ev = (expression) => evaluate(c, expression);
    await c.send("Emulation.setDeviceMetricsOverride", { width: APP_W, height: APP_H, deviceScaleFactor: 1, mobile: false });
    await c.send("Page.addScriptToEvaluateOnNewDocument", { source: fixedClockScript });
    await until("app", () => ev(`document.readyState === "complete"`));
    await ev(`localStorage.setItem(${JSON.stringify(STORAGE_KEY)}, ${JSON.stringify(JSON.stringify(savedState(lang)))}); localStorage.setItem("GTV_Lang", "${lang}"); localStorage.setItem("GTV_Theme", "dark");`);
    await c.send("Page.reload", { ignoreCache: true });
    await until("rendered", () => ev(`document.querySelectorAll("#clocks-container tr").length >= ${ZONES.length}`));
    await sleep(800);
    const shot = async () => (await c.send("Page.captureScreenshot", { format: "png" })).data;
    const tab = async (name) => {
        await ev(`document.querySelector('.nav-item[data-tab="${name}"]').click()`);
        await until(`tab ${name}`, () => ev(`document.querySelector('.nav-item[data-tab="${name}"]').classList.contains("active")`));
        await sleep(500);
    };
    const setValue = (selector, value, index = 0) => ev(`(() => {
        const el = document.querySelectorAll(${JSON.stringify(selector)})[${index}];
        if (!el) throw new Error("missing " + ${JSON.stringify(selector)});
        el.focus();
        el.value = ${JSON.stringify(value)};
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
        el.blur();
    })()`);
    const shots = {};

    // 1) Realtime with the timeline.
    await ev(`(() => { const t = document.getElementById("toggle-timeline"); if (!t.checked) t.click(); })()`);
    await sleep(600);
    shots.realtime = await shot();

    // 2) Continuous time edit: two ranges, the first a 09:00-18:00 working day in Seoul.
    await tab("multi");
    await setValue("#multi-range-count-input", "2");
    await sleep(500);
    await setValue("#multi-ranges-container .base-row .time-input[data-slot=\"0\"]", "2026-11-17 09:00:00");
    await sleep(300);
    await setValue("#multi-ranges-container .base-row .time-input[data-slot=\"1\"]", "2026-11-17 18:00:00");
    await sleep(600);
    await ev(`window.scrollTo(0, 0)`);
    shots.multi = await shot();

    // 3) Fixed time: three meeting slots for today in Seoul.
    await tab("fixed-time");
    await setValue("#fixed-time-slot-count-input", "3");
    await sleep(500);
    const slotTimes = ["09:00:00", "16:00:00", "22:00:00"];
    for (let i = 0; i < slotTimes.length; i += 1) {
        await setValue("#fixed-time-body tr:first-child .fixed-time-time-input", slotTimes[i], i);
        await sleep(300);
    }
    await sleep(500);
    const slots = await ev(`[...document.querySelectorAll("#fixed-time-body tr:first-child .fixed-time-time-input")].map((el) => el.value).join(",")`);
    if (slots !== slotTimes.join(",")) throw new Error(`fixed time slots: ${slots}`);
    shots.fixed = await shot();

    // 4) Calculator with sample values.
    await tab("calc");
    await setValue("#conv-day", "1.5");
    await setValue("#period-end", "2026-12-25");
    await setValue("#off-val", "30");
    await setValue(".countdown-target-input[data-slot=\"0\"]", "2026-12-31 18:00:00");
    await ev(`document.querySelector('.countdown-toggle-btn[data-slot="0"]').click()`);
    await sleep(1200);
    shots.calc = await shot();

    await c.send("Target.closeTarget", { targetId: page.targetId }).catch(() => {});
    return shots;
}

function iconDataUri() {
    return `data:image/png;base64,${fs.readFileSync(ICON).toString("base64")}`;
}

const FONT = `"Segoe UI", "Malgun Gothic", "Apple SD Gothic Neo", sans-serif`;
const BASE_CSS = `
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 100%; height: 100%; overflow: hidden; }
body { font-family: ${FONT}; color: #e2e8f0; background: #0b1220; -webkit-font-smoothing: antialiased; }
.bg { position: absolute; inset: 0; background:
    radial-gradient(1200px 600px at 100% 0%, rgba(56, 189, 248, 0.22), transparent 60%),
    radial-gradient(900px 500px at 0% 100%, rgba(37, 99, 235, 0.25), transparent 60%),
    linear-gradient(160deg, #0f172a 0%, #0b1220 60%, #0a1628 100%); }
.brand { display: flex; align-items: center; gap: 14px; font-weight: 700; color: #f1f5f9; }
.brand img { border-radius: 12px; box-shadow: 0 6px 18px rgba(14, 165, 233, 0.35); }
.accent { color: #38bdf8; }
.window { position: absolute; border-radius: 14px; overflow: hidden; border: 1px solid rgba(148, 163, 184, 0.28);
    box-shadow: 0 30px 70px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(56, 189, 248, 0.08); background: #0f172a; }
.window .bar { height: 30px; display: flex; align-items: center; gap: 7px; padding: 0 12px; background: #111a2e; border-bottom: 1px solid rgba(148, 163, 184, 0.18); }
.window .bar i { width: 11px; height: 11px; border-radius: 50%; display: block; }
.window img.app { display: block; }
`;

function screenshotHtml(lang, index, capture) {
    const [line1, line2, sub] = TEXT[lang].shots[index];
    const appWidth = 1150;
    const scale = appWidth / APP_W;
    return `<!doctype html><html><head><meta charset="utf-8"><style>${BASE_CSS}
.text { position: absolute; left: 64px; top: 48px; right: 64px; }
.brand { font-size: 20px; }
h1 { margin-top: 18px; font-size: 44px; line-height: 1.18; font-weight: 800; letter-spacing: -0.5px; color: #f8fafc; }
p { margin-top: 12px; font-size: 19px; color: #94a3b8; }
.window { left: 65px; top: 232px; width: ${appWidth}px; }
</style></head><body><div class="bg"></div>
<div class="text"><div class="brand"><img src="${iconDataUri()}" width="40" height="40">${TEXT[lang].brand}</div>
<h1>${line1} <span class="accent">${line2}</span></h1><p>${sub}</p></div>
<div class="window"><div class="bar"><i style="background:#ef4444"></i><i style="background:#f59e0b"></i><i style="background:#22c55e"></i></div>
<img class="app" src="data:image/png;base64,${capture}" width="${appWidth}" height="${Math.round(APP_H * scale)}"></div>
</body></html>`;
}

function marqueeHtml(lang, capture) {
    const [line1, line2, sub] = TEXT[lang].marquee;
    const appWidth = 820;
    return `<!doctype html><html><head><meta charset="utf-8"><style>${BASE_CSS}
.text { position: absolute; left: 72px; top: 0; bottom: 0; width: 470px; display: flex; flex-direction: column; justify-content: center; }
.brand { font-size: 24px; }
h1 { margin-top: 26px; font-size: 54px; line-height: 1.15; font-weight: 800; letter-spacing: -0.5px; color: #f8fafc; }
p { margin-top: 18px; font-size: 19px; line-height: 1.5; color: #94a3b8; }
.window { left: 560px; top: 70px; width: ${appWidth}px; }
</style></head><body><div class="bg"></div>
<div class="text"><div class="brand"><img src="${iconDataUri()}" width="52" height="52">${TEXT[lang].brand}</div>
<h1>${line1}<br><span class="accent">${line2}</span></h1><p>${sub}</p></div>
<div class="window"><div class="bar"><i style="background:#ef4444"></i><i style="background:#f59e0b"></i><i style="background:#22c55e"></i></div>
<img class="app" src="data:image/png;base64,${capture}" width="${appWidth}" height="${Math.round(APP_H * appWidth / APP_W)}"></div>
</body></html>`;
}

function smallTileHtml(lang) {
    const t = TEXT[lang];
    return `<!doctype html><html><head><meta charset="utf-8"><style>${BASE_CSS}
.wrap { position: absolute; inset: 0; padding: 34px 32px; display: flex; flex-direction: column; justify-content: center; }
.brand { font-size: 25px; gap: 14px; line-height: 1.15; }
.tag { margin-top: 12px; font-size: 15px; color: #94a3b8; }
.chips { margin-top: 20px; display: flex; flex-wrap: wrap; gap: 7px; }
.chips span { font-size: 12.5px; font-weight: 600; padding: 5px 10px; border-radius: 999px; color: #bae6fd; background: rgba(56, 189, 248, 0.12); border: 1px solid rgba(56, 189, 248, 0.35); }
</style></head><body><div class="bg"></div>
<div class="wrap"><div class="brand"><img src="${iconDataUri()}" width="58" height="58"><span>Global Time<br>Viewer</span></div>
<div class="tag">${t.tagline}</div>
<div class="chips">${t.chips.map((chip) => `<span>${chip}</span>`).join("")}</div></div>
</body></html>`;
}

async function renderHtml(session, html, width, height, outFile) {
    const page = await session.openPage("about:blank");
    const c = page.client;
    await c.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false });
    const { frameTree } = await c.send("Page.getFrameTree");
    await c.send("Page.setDocumentContent", { frameId: frameTree.frame.id, html });
    await evaluate(c, `Promise.all([...document.images].map((img) => img.decode().catch(() => null))).then(() => document.fonts.ready).then(() => true)`);
    await sleep(200);
    const shot = await c.send("Page.captureScreenshot", { format: "jpeg", quality: JPEG_QUALITY, clip: { x: 0, y: 0, width, height, scale: 1 } });
    fs.writeFileSync(outFile, Buffer.from(shot.data, "base64"));
    await c.send("Target.closeTarget", { targetId: page.targetId }).catch(() => {});
    const size = jpegSize(outFile);
    if (size.width !== width || size.height !== height || size.components !== 3) {
        throw new Error(`${path.basename(outFile)} is ${size.width}x${size.height} with ${size.components} channels, expected ${width}x${height} RGB`);
    }
    log(`  ${path.relative(ROOT, outFile)} (${width}x${height})`);
}

// Reads width, height and channel count from the JPEG frame header, so each image is checked
// against the store size (and has no alpha) after it is written.
function jpegSize(file) {
    const buf = fs.readFileSync(file);
    if (buf[0] !== 0xff || buf[1] !== 0xd8) throw new Error(`${path.basename(file)} is not a JPEG`);
    let offset = 2;
    while (offset < buf.length) {
        if (buf[offset] !== 0xff) throw new Error(`${path.basename(file)}: bad JPEG marker`);
        const marker = buf[offset + 1];
        const length = buf.readUInt16BE(offset + 2);
        if (marker >= 0xc0 && marker <= 0xc3) {
            return { height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7), components: buf[offset + 9] };
        }
        offset += 2 + length;
    }
    throw new Error(`${path.basename(file)}: no JPEG frame header`);
}

async function main() {
    if (!fs.existsSync(path.join(DIST, "manifest.json"))) throw new Error("dist_extension is missing. Run `npm run build` first.");
    fs.mkdirSync(OUT, { recursive: true });
    const session = await launchChrome({ downloadDir: path.join(ROOT, "scratch", "store-assets", "downloads") });
    try {
        const extensionId = await session.loadExtension(DIST);
        for (const lang of ["ko", "en"]) {
            log(`[${lang}] capturing the app`);
            const shots = await captureApp(session, extensionId, lang);
            const order = [["1_realtime", shots.realtime], ["2_multi_range", shots.multi], ["3_fixed_time", shots.fixed], ["4_calculator", shots.calc]];
            for (let i = 0; i < order.length; i += 1) {
                await renderHtml(session, screenshotHtml(lang, i, order[i][1]), 1280, 800, path.join(OUT, `cws_screenshot_${order[i][0]}_${lang}.jpg`));
            }
            await renderHtml(session, marqueeHtml(lang, shots.realtime), 1400, 560, path.join(OUT, `cws_promo_marquee_${lang}.jpg`));
            await renderHtml(session, smallTileHtml(lang), 440, 280, path.join(OUT, `cws_promo_small_${lang}.jpg`));
        }
        fs.copyFileSync(ICON, path.join(OUT, "icon128.png"));
        log(`  ${path.relative(ROOT, path.join(OUT, "icon128.png"))} (128x128)`);
    } finally {
        await session.close();
    }
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
