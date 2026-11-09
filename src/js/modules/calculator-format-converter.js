(function initGtvCalculatorFormatConverter(globalObj) {
    "use strict";

    // Time format converter (Unix s/ms, ISO 8601, RFC 2822, SQL, human readable).

    // ── Unix 타임스탬프 변환기 ─────────────────────────────────────

    function initUnixTimestampConverter(t, helpers, luxonDT, timerIds, runtime = {}) {
        const padFn = (typeof runtime.pad2 === "function") ? runtime.pad2 : runtime.dateFormat.defaultPad2;
        const unixNowValue = helpers.getElementById("unix-now-value");
        const unixNowMsValue = helpers.getElementById("unix-now-ms-value");
        const unixSyncNowBtn = helpers.getElementById("unix-sync-now-btn");
        const unixTsInput = helpers.getElementById("unix-ts-input");
        const unixTsMsInput = helpers.getElementById("unix-ts-ms-input");
        const unixIsoLocalInput = helpers.getElementById("unix-iso-local-input");
        const unixIsoUtcInput = helpers.getElementById("unix-iso-utc-input");
        const unixRfc2822Input = helpers.getElementById("unix-rfc2822-input");
        const unixSqlInput = helpers.getElementById("unix-sql-input");
        const unixHumanInput = helpers.getElementById("unix-human-input");
        const smartFormatRows = helpers.querySelectorAll(".smart-format-row");

        if (
            !unixNowValue || !unixNowMsValue || !unixTsInput || !unixTsMsInput ||
            !unixIsoLocalInput || !unixIsoUtcInput || !unixRfc2822Input || !unixSqlInput || !unixHumanInput
        ) {
            return { refresh: () => { } };
        }

        const editableFields = [
            { key: "unix_sec", el: unixTsInput },
            { key: "unix_ms", el: unixTsMsInput },
            { key: "iso_local", el: unixIsoLocalInput },
            { key: "iso_utc", el: unixIsoUtcInput },
            { key: "rfc2822", el: unixRfc2822Input },
            { key: "sql", el: unixSqlInput }
        ];

        let activeEpochMs = Date.now();
        let hasValidEpoch = true;
        let isSyncing = false;

        const setRowsInvalid = (invalid) => {
            smartFormatRows.forEach((row) => {
                if (!row || !row.classList) return;
                if (invalid) row.classList.add("is-invalid");
                else row.classList.remove("is-invalid");
            });
        };

        const formatIsoLocalWithOffset = (dateObj) => {
            const year = dateObj.getFullYear();
            const month = padFn(dateObj.getMonth() + 1);
            const day = padFn(dateObj.getDate());
            const hour = padFn(dateObj.getHours());
            const minute = padFn(dateObj.getMinutes());
            const second = padFn(dateObj.getSeconds());
            const totalOffsetMinutes = -dateObj.getTimezoneOffset();
            const sign = totalOffsetMinutes >= 0 ? "+" : "-";
            const absOffset = Math.abs(totalOffsetMinutes);
            const offsetHour = padFn(Math.floor(absOffset / 60));
            const offsetMinute = padFn(absOffset % 60);
            return `${year}-${month}-${day}T${hour}:${minute}:${second}${sign}${offsetHour}:${offsetMinute}`;
        };

        const buildFieldValues = (epochMs) => {
            const safeEpochMs = Math.trunc(Number(epochMs));
            if (!Number.isFinite(safeEpochMs)) return null;

            if (luxonDT && typeof luxonDT.fromMillis === "function") {
                const utc = luxonDT.fromMillis(safeEpochMs, { zone: "utc" });
                if (!utc.isValid) return null;
                const local = utc.toLocal().setLocale(helpers.getCurrentLang());
                return {
                    unixSec: String(Math.floor(safeEpochMs / 1000)),
                    unixMs: String(safeEpochMs),
                    isoLocal: local.toISO({ suppressMilliseconds: true, includeOffset: true }) || "",
                    isoUtc: utc.toISO({ suppressMilliseconds: true, includeOffset: true }) || "",
                    rfc2822: local.toRFC2822() || "",
                    sql: local.toFormat("yyyy-LL-dd HH:mm:ss"),
                    human: local.toLocaleString(luxonDT.DATETIME_FULL_WITH_SECONDS)
                };
            }

            const dateObj = new Date(safeEpochMs);
            if (Number.isNaN(dateObj.getTime())) return null;
            const locale = helpers.getCurrentLang() === "ko" ? "ko-KR" : "en-US";
            return {
                unixSec: String(Math.floor(safeEpochMs / 1000)),
                unixMs: String(safeEpochMs),
                isoLocal: formatIsoLocalWithOffset(dateObj),
                isoUtc: runtime.dateFormat.formatUTCDateTime(dateObj, padFn),
                rfc2822: dateObj.toUTCString(),
                sql: runtime.dateFormat.formatLocalDateTime(dateObj, padFn),
                human: dateObj.toLocaleString(locale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    weekday: "short"
                })
            };
        };

        const FIELD_VALUE_KEYS = Object.freeze([
            ["unix_sec", unixTsInput, "unixSec"],
            ["unix_ms", unixTsMsInput, "unixMs"],
            ["iso_local", unixIsoLocalInput, "isoLocal"],
            ["iso_utc", unixIsoUtcInput, "isoUtc"],
            ["rfc2822", unixRfc2822Input, "rfc2822"],
            ["sql", unixSqlInput, "sql"],
            ["human", unixHumanInput, "human"]
        ]);

        // activeKey: the field the user is typing in. It keeps the user's text (also when empty or
        // invalid) so typing, deleting and correcting are never overwritten; only the other fields update.
        const setFieldValues = (values, activeKey = null) => {
            if (!values) return;
            isSyncing = true;
            FIELD_VALUE_KEYS.forEach(([key, el, valueKey]) => {
                if (key === activeKey) return;
                el.value = values[valueKey];
            });
            isSyncing = false;
        };

        const renderInvalid = (activeKey = null) => {
            hasValidEpoch = false;
            setRowsInvalid(true);
            const invalidText = t("calc_unix_invalid");
            setFieldValues({
                unixSec: invalidText, unixMs: invalidText, isoLocal: invalidText,
                isoUtc: invalidText, rfc2822: invalidText, sql: invalidText, human: invalidText
            }, activeKey);
        };

        const renderFromEpoch = (epochMs, activeKey = null) => {
            const values = buildFieldValues(epochMs);
            if (!values) { renderInvalid(activeKey); return; }
            hasValidEpoch = true;
            setRowsInvalid(false);
            setFieldValues(values, activeKey);
        };

        const parseFieldValue = (key, value) => {
            const raw = String(value || "").trim();
            if (!raw) return null;

            if (key === "unix_sec") {
                const sec = Number(raw);
                return Number.isFinite(sec) ? Math.trunc(sec * 1000) : null;
            }
            if (key === "unix_ms") {
                const ms = Number(raw);
                return Number.isFinite(ms) ? Math.trunc(ms) : null;
            }

            let parsedDate = null;
            if (key === "iso_local") {
                parsedDate = runtime.dateFormat.parseIsoLocalDateString(raw, luxonDT);
            } else if (key === "iso_utc") {
                parsedDate = runtime.dateFormat.parseIsoUtcDateString(raw, luxonDT);
            } else if (key === "rfc2822") {
                parsedDate = runtime.dateFormat.parseRfc2822DateWithLuxon(raw, luxonDT);
            } else if (key === "sql") {
                parsedDate = runtime.dateFormat.parseSqlDateWithLuxon(raw, luxonDT);
            }

            return runtime.dateFormat.isValidDateObject(parsedDate) ? Math.trunc(parsedDate.getTime()) : null;
        };

        // While typing ("input") the edited field keeps its text. On "change" (the field is committed)
        // a valid value is rewritten in the standard form; an invalid one is left as typed.
        const handleFieldInput = (key, fieldEl, isCommit = false) => {
            if (isSyncing || !fieldEl) return;
            const parsedMs = parseFieldValue(key, fieldEl.value);
            if (!Number.isFinite(parsedMs)) { renderInvalid(key); return; }
            activeEpochMs = Math.trunc(parsedMs);
            renderFromEpoch(activeEpochMs, isCommit ? null : key);
        };

        const updateNow = () => {
            if (!helpers.isCalculatorTabActive()) return;
            const nowMs = Date.now();
            unixNowValue.textContent = String(Math.floor(nowMs / 1000));
            unixNowMsValue.textContent = String(Math.trunc(nowMs));
        };

        const syncNow = () => {
            activeEpochMs = Date.now();
            renderFromEpoch(activeEpochMs);
            updateNow();
        };

        editableFields.forEach(({ key, el }) => {
            el.addEventListener("input", () => handleFieldInput(key, el, false));
            el.addEventListener("change", () => handleFieldInput(key, el, true));
        });
        if (unixSyncNowBtn) unixSyncNowBtn.addEventListener("click", syncNow);

        // 이전 타이머 정리 후 새 타이머 등록
        if (timerIds.unix !== null && timerIds.unix !== undefined) {
            clearInterval(timerIds.unix);
        }
        timerIds.unix = setInterval(updateNow, 1000);
        syncNow();

        return {
            refresh() {
                updateNow();
                if (hasValidEpoch) renderFromEpoch(activeEpochMs);
                else renderInvalid();
            }
        };
    }


    function createService(_deps = {}) {
        return Object.freeze({
            initUnixTimestampConverter
        });
    }

    const defaultService = createService();

    globalObj.GTVCalculatorFormatConverter = Object.freeze({
        createService,
        initUnixTimestampConverter: defaultService.initUnixTimestampConverter
    });
})(typeof window !== "undefined" ? window : globalThis);
