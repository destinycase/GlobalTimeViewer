(function initGtvDatePicker(globalObj) {
    "use strict";

    const I18N = {
        ko: {
            days: ["일", "월", "화", "수", "목", "금", "토"],
            placeholderDate: "YYYY-MM-DD",
            placeholderTime: "HH:mm:ss",
            placeholderDatetime: "YYYY-MM-DD HH:mm:ss",
            clear: "삭제",
            today: "오늘",
            yearMonthFormat: (y, m) => `${y}년 ${m}월`
        },
        en: {
            days: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
            placeholderDate: "YYYY-MM-DD",
            placeholderTime: "HH:mm:ss",
            placeholderDatetime: "YYYY-MM-DD HH:mm:ss",
            clear: "Clear",
            today: "Today",
            yearMonthFormat: (y, m) => `${y}-${String(m).padStart(2, "0")}`
        }
    };

    class CustomDatePicker {
        constructor(inputEl, options = {}) {
            this.input = inputEl;
            this.type = (options.type === "date" || options.type === "time" || options.type === "datetime")
                ? options.type
                : "date";
            this.lang = options.lang || "en";
            this.theme = options.theme || "dark";
            this.onChange = options.onChange || null;
            this.triggerElement = options.triggerElement || null;

            this.currentDate = new Date();
            this.selectedDate = null;

            this.isOpen = false;
            this._abortController = new AbortController();

            this._initDOM();
            this._bindEvents();
            this.setLang(this.lang);
            this.setTheme(this.theme);

            const parsed = this._parseInputValue(this.input?.value || "");
            if (parsed) {
                this.selectedDate = parsed;
                this.currentDate = new Date(parsed);
            }
            this._updateInputText();
        }

        _initDOM() {
            if (!this.input) return;
            this.input.classList.add("custom-date-picker-input");

            this.popup = document.createElement("div");
            this.popup.className = "custom-date-picker-popup";
            this.popup.style.display = "none";

            if (this.type === "date" || this.type === "datetime") {
                this.calendarSection = document.createElement("div");
                this.calendarSection.className = "cdp-calendar-section";

                this._buildCalendarHeader();
                this._buildCalendarGrid();
                this._buildCalendarFooter();

                this.popup.appendChild(this.calendarSection);
            }

            if (this.type === "time" || this.type === "datetime") {
                this.timeSection = document.createElement("div");
                this.timeSection.className = "cdp-time-section";
                if (this.type === "time") this.timeSection.classList.add("cdp-time-only");
                this._buildTimePickers();
                this.popup.appendChild(this.timeSection);
            }

            document.body.appendChild(this.popup);
        }

        _buildCalendarHeader() {
            this.header = document.createElement("div");
            this.header.className = "cdp-header";

            this.title = document.createElement("div");
            this.title.className = "cdp-title";

            const btnGroup = document.createElement("div");
            btnGroup.className = "cdp-header-btns";

            this.prevBtn = document.createElement("button");
            this.prevBtn.type = "button";
            this.prevBtn.textContent = "◀";
            this.prevBtn.className = "cdp-btn-icon";

            this.nextBtn = document.createElement("button");
            this.nextBtn.type = "button";
            this.nextBtn.textContent = "▶";
            this.nextBtn.className = "cdp-btn-icon";

            btnGroup.appendChild(this.prevBtn);
            btnGroup.appendChild(this.nextBtn);

            this.header.appendChild(this.title);
            this.header.appendChild(btnGroup);
            this.calendarSection.appendChild(this.header);
        }

        _buildCalendarGrid() {
            this.daysHeader = document.createElement("div");
            this.daysHeader.className = "cdp-days-header";

            this.grid = document.createElement("div");
            this.grid.className = "cdp-grid";

            this.calendarSection.appendChild(this.daysHeader);
            this.calendarSection.appendChild(this.grid);
        }

        _buildCalendarFooter() {
            this.footer = document.createElement("div");
            this.footer.className = "cdp-footer";

            this.clearBtn = document.createElement("button");
            this.clearBtn.type = "button";
            this.clearBtn.className = "cdp-btn-text";

            this.todayBtn = document.createElement("button");
            this.todayBtn.type = "button";
            this.todayBtn.className = "cdp-btn-text";

            this.footer.appendChild(this.clearBtn);
            this.footer.appendChild(this.todayBtn);
            this.calendarSection.appendChild(this.footer);
        }

        _buildTimePickers() {
            const createScrollColumn = (max) => {
                const col = document.createElement("div");
                col.className = "cdp-time-col";
                for (let i = 0; i <= max; i += 1) {
                    const item = document.createElement("div");
                    item.className = "cdp-time-item";
                    item.textContent = String(i).padStart(2, "0");
                    item.dataset.val = String(i);
                    col.appendChild(item);
                }
                return col;
            };

            this.hourCol = createScrollColumn(23);
            this.minCol = createScrollColumn(59);
            this.secCol = createScrollColumn(59);

            this.timeSection.appendChild(this.hourCol);
            this.timeSection.appendChild(this.minCol);
            this.timeSection.appendChild(this.secCol);
        }

        _bindEvents() {
            const signal = this._abortController.signal;
            const triggerEl = this.triggerElement || this.input;

            if (triggerEl) {
                triggerEl.addEventListener("click", (e) => {
                    e.stopPropagation();
                    this.toggle();
                }, { signal });
            }

            document.addEventListener("click", (e) => {
                if (!this.isOpen) return;
                const target = e.target;
                if (!this.popup.contains(target) && target !== triggerEl && target !== this.input) {
                    this.close();
                }
            }, { signal });

            if (this.prevBtn) {
                this.prevBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    this._shiftCurrentMonth(-1);
                    this._render();
                }, { signal });
            }

            if (this.nextBtn) {
                this.nextBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    this._shiftCurrentMonth(1);
                    this._render();
                }, { signal });
            }

            if (this.clearBtn) {
                this.clearBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    this.selectedDate = null;
                    this._updateInputText();
                    this._render();
                    this.close();
                    this._triggerChange();
                }, { signal });
            }

            if (this.todayBtn) {
                this.todayBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    const now = new Date();
                    this.currentDate = new Date(now);
                    if (this.type === "date") {
                        this.selectedDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    } else {
                        this.selectedDate = new Date(now);
                    }
                    this._updateInputText();
                    this._render();
                    this._scrollToSelectedTime();
                    this.close();
                    this._triggerChange();
                }, { signal });
            }

            if (this.grid) {
                this.grid.addEventListener("click", (e) => {
                    const cell = e.target?.closest?.(".cdp-cell");
                    if (!cell || cell.classList.contains("empty")) return;

                    const d = parseInt(cell.dataset.date, 10);
                    if (!Number.isFinite(d)) return;

                    if (!this.selectedDate) {
                        this.selectedDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), d);
                        if (this.type === "datetime") {
                            const now = new Date();
                            this.selectedDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), 0);
                        }
                    } else {
                        this.selectedDate.setFullYear(this.currentDate.getFullYear(), this.currentDate.getMonth(), d);
                    }

                    this._updateInputText();
                    this._render();

                    if (this.type === "date") this.close();
                    this._triggerChange();
                }, { signal });
            }

            if (this.timeSection) {
                this.timeSection.addEventListener("click", (e) => {
                    const item = e.target?.closest?.(".cdp-time-item");
                    if (!item) return;

                    const val = parseInt(item.dataset.val, 10);
                    if (!Number.isFinite(val)) return;
                    const col = item.parentElement;

                    if (!this.selectedDate) {
                        const now = new Date();
                        this.selectedDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
                        this.currentDate = new Date(this.selectedDate);
                    }

                    if (col === this.hourCol) this.selectedDate.setHours(val);
                    else if (col === this.minCol) this.selectedDate.setMinutes(val);
                    else if (col === this.secCol) this.selectedDate.setSeconds(val);

                    this._updateInputText();
                    this._render();
                    this._scrollToSelectedTime();
                    this._triggerChange();
                }, { signal });
            }
        }

        _shiftCurrentMonth(delta) {
            if (!Number.isFinite(delta) || delta === 0) return;
            // 날짜 오버플로로 월이 건너뛰지 않도록 1일로 고정한다.
            this.currentDate.setDate(1);
            this.currentDate.setMonth(this.currentDate.getMonth() + delta);
        }

        _render() {
            const dict = I18N[this.lang] || I18N.en;

            if (this.calendarSection && this.title && this.daysHeader && this.grid) {
                const y = this.currentDate.getFullYear();
                const m = this.currentDate.getMonth();

                this.title.textContent = dict.yearMonthFormat(y, m + 1);

                this.daysHeader.textContent = "";
                dict.days.forEach((d) => {
                    const el = document.createElement("div");
                    el.textContent = d;
                    this.daysHeader.appendChild(el);
                });

                this.grid.textContent = "";
                const firstDay = new Date(y, m, 1).getDay();
                const daysInMonth = new Date(y, m + 1, 0).getDate();

                for (let i = 0; i < firstDay; i += 1) {
                    const empty = document.createElement("div");
                    empty.className = "cdp-cell empty";
                    this.grid.appendChild(empty);
                }

                for (let d = 1; d <= daysInMonth; d += 1) {
                    const cell = document.createElement("div");
                    cell.className = "cdp-cell";
                    cell.textContent = String(d);
                    cell.dataset.date = String(d);

                    if (
                        this.selectedDate
                        && this.selectedDate.getFullYear() === y
                        && this.selectedDate.getMonth() === m
                        && this.selectedDate.getDate() === d
                    ) {
                        cell.classList.add("selected");
                    }

                    this.grid.appendChild(cell);
                }
            }

            if (this.timeSection) {
                const h = this.selectedDate ? this.selectedDate.getHours() : 0;
                const min = this.selectedDate ? this.selectedDate.getMinutes() : 0;
                const s = this.selectedDate ? this.selectedDate.getSeconds() : 0;

                const updateActive = (col, val) => {
                    if (!col || typeof col.querySelectorAll !== "function") return;
                    col.querySelectorAll(".cdp-time-item").forEach((el) => {
                        const currentVal = parseInt(el.dataset.val, 10);
                        el.classList.toggle("active", currentVal === val);
                    });
                };

                updateActive(this.hourCol, h);
                updateActive(this.minCol, min);
                updateActive(this.secCol, s);
            }
        }

        _scrollToSelectedTime() {
            if (!this.timeSection || !this.isOpen) return;
            const h = this.selectedDate ? this.selectedDate.getHours() : 0;
            const min = this.selectedDate ? this.selectedDate.getMinutes() : 0;
            const s = this.selectedDate ? this.selectedDate.getSeconds() : 0;

            const scrollCol = (col, val) => {
                if (!col || typeof col.querySelector !== "function") return;
                const target = col.querySelector(`.cdp-time-item[data-val="${val}"]`);
                if (target) {
                    col.scrollTop = target.offsetTop - col.clientHeight / 2 + target.clientHeight / 2;
                }
            };

            setTimeout(() => {
                scrollCol(this.hourCol, h);
                scrollCol(this.minCol, min);
                scrollCol(this.secCol, s);
            }, 10);
        }

        _updateInputText() {
            if (!this.input) return;
            if (!this.selectedDate) {
                this.input.value = "";
                return;
            }

            const y = this.selectedDate.getFullYear();
            const m = String(this.selectedDate.getMonth() + 1).padStart(2, "0");
            const d = String(this.selectedDate.getDate()).padStart(2, "0");
            const h = String(this.selectedDate.getHours()).padStart(2, "0");
            const min = String(this.selectedDate.getMinutes()).padStart(2, "0");
            const s = String(this.selectedDate.getSeconds()).padStart(2, "0");

            if (this.type === "date") {
                this.input.value = `${y}-${m}-${d}`;
                return;
            }
            if (this.type === "time") {
                this.input.value = `${h}:${min}:${s}`;
                return;
            }
            this.input.value = `${y}-${m}-${d} ${h}:${min}:${s}`;
        }

        _triggerChange() {
            if (typeof this.onChange === "function") this.onChange(this.selectedDate);
            if (this.input && typeof this.input.dispatchEvent === "function") {
                this.input.dispatchEvent(new Event("change", { bubbles: true }));
            }
        }

        _positionPopup() {
            const rect = this.input.getBoundingClientRect();
            this.popup.style.top = `${rect.bottom + window.scrollY + 4}px`;

            let left = rect.left + window.scrollX;
            this.popup.style.display = "flex";
            const popRect = this.popup.getBoundingClientRect();

            if (left + popRect.width > window.innerWidth) {
                left = window.innerWidth - popRect.width - 10;
            }
            this.popup.style.left = `${Math.max(10, left)}px`;
        }

        _parseInputValue(rawValue) {
            const value = String(rawValue || "").trim();
            if (!value) return null;

            if (this.type === "date") {
                const m = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
                if (!m) return null;
                const year = parseInt(m[1], 10);
                const month = parseInt(m[2], 10) - 1;
                const day = parseInt(m[3], 10);
                const parsed = new Date(year, month, day);
                if (Number.isNaN(parsed.getTime())) return null;
                if (parsed.getFullYear() !== year || parsed.getMonth() !== month || parsed.getDate() !== day) return null;
                return parsed;
            }

            if (this.type === "time") {
                const m = value.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
                if (!m) return null;
                const hour = parseInt(m[1], 10);
                const minute = parseInt(m[2], 10);
                const second = parseInt(m[3] || "0", 10);
                if (hour < 0 || hour > 23 || minute < 0 || minute > 59 || second < 0 || second > 59) return null;
                const now = new Date();
                return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, second, 0);
            }

            const normalized = value.replace("T", " ");
            const datetimeMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
            if (datetimeMatch) {
                const year = parseInt(datetimeMatch[1], 10);
                const month = parseInt(datetimeMatch[2], 10) - 1;
                const day = parseInt(datetimeMatch[3], 10);
                const hour = parseInt(datetimeMatch[4], 10);
                const minute = parseInt(datetimeMatch[5], 10);
                const second = parseInt(datetimeMatch[6], 10);
                const parsed = new Date(year, month, day, hour, minute, second, 0);
                if (Number.isNaN(parsed.getTime())) return null;
                if (
                    parsed.getFullYear() !== year
                    || parsed.getMonth() !== month
                    || parsed.getDate() !== day
                    || parsed.getHours() !== hour
                    || parsed.getMinutes() !== minute
                    || parsed.getSeconds() !== second
                ) {
                    return null;
                }
                return parsed;
            }

            const parsed = new Date(value.replace(" ", "T"));
            return Number.isNaN(parsed.getTime()) ? null : parsed;
        }

        toggle() {
            if (this.isOpen) this.close();
            else this.open();
        }

        open() {
            const parsed = this._parseInputValue(this.input?.value || "");
            if (parsed) {
                this.selectedDate = parsed;
                this.currentDate = new Date(parsed);
            } else {
                const now = new Date();
                this.selectedDate = new Date(now);
                this.currentDate = new Date(now);
            }

            this.isOpen = true;
            this._render();
            this._positionPopup();
            this._scrollToSelectedTime();
        }

        close() {
            this.isOpen = false;
            this.popup.style.display = "none";
        }

        setLang(lang) {
            this.lang = I18N[lang] ? lang : "en";
            const dict = I18N[this.lang] || I18N.en;
            if (this.type === "date") this.input.placeholder = dict.placeholderDate;
            else if (this.type === "time") this.input.placeholder = dict.placeholderTime;
            else this.input.placeholder = dict.placeholderDatetime;

            if (this.clearBtn) this.clearBtn.textContent = dict.clear;
            if (this.todayBtn) this.todayBtn.textContent = dict.today;

            if (this.isOpen) this._render();
        }

        setTheme(theme) {
            this.theme = theme;
            this.popup.setAttribute("data-theme", theme);
        }

        setDate(dateObj) {
            if (!dateObj || Number.isNaN(dateObj.getTime())) {
                this.selectedDate = null;
            } else {
                this.selectedDate = new Date(dateObj);
                this.currentDate = new Date(dateObj);
            }
            this._updateInputText();
            if (this.isOpen) {
                this._render();
                this._scrollToSelectedTime();
            }
        }

        destroy() {
            this._abortController.abort();
            if (this.popup && this.popup.parentNode) {
                this.popup.remove();
            }
            if (this.input) {
                this.input.classList.remove("custom-date-picker-input");
            }
        }
    }

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function getCustomDatePickerCtor() {
            if (typeof safeDeps.CustomDatePicker === "function") return safeDeps.CustomDatePicker;
            if (typeof safeDeps.datePickerCtor === "function") return safeDeps.datePickerCtor;
            return CustomDatePicker;
        }

        function createDatePicker(inputEl, options = {}) {
            const DatePickerCtor = getCustomDatePickerCtor();
            return new DatePickerCtor(inputEl, options);
        }

        return Object.freeze({
            CustomDatePicker: getCustomDatePickerCtor(),
            createDatePicker
        });
    }

    const defaultService = createService();

    globalObj.CustomDatePicker = defaultService.CustomDatePicker;
    globalObj.GTVDatePicker = Object.freeze({
        createService,
        CustomDatePicker: defaultService.CustomDatePicker,
        createDatePicker: defaultService.createDatePicker
    });
})(typeof window !== "undefined" ? window : globalThis);
