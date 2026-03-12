(function (globalObj) {
    const I18N = {
        ko: {
            days: ["일", "월", "화", "수", "목", "금", "토"],
            placeholderDate: "연도-월-일",
            placeholderDatetime: "연도-월-일 시:분:초",
            clear: "삭제",
            today: "오늘",
            yearMonthFormat: (y, m) => `${y}년 ${m}월`
        },
        en: {
            days: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
            placeholderDate: "YYYY-MM-DD",
            placeholderDatetime: "YYYY-MM-DD HH:mm:ss",
            clear: "Clear",
            today: "Today",
            yearMonthFormat: (y, m) => `${y}-${String(m).padStart(2, '0')}`
        }
    };

    class CustomDatePicker {
        constructor(inputEl, options = {}) {
            this.input = inputEl;
            this.type = options.type || "date"; // "date" or "datetime"
            this.lang = options.lang || "en";
            this.theme = options.theme || "dark";
            this.onChange = options.onChange || null;
            this.triggerElement = options.triggerElement || null;

            this.currentDate = new Date();
            this.selectedDate = null; // Date object

            this.isOpen = false;

            this._initDOM();
            this._bindEvents();
            this.setLang(this.lang);
            this.setTheme(this.theme);

            // Sync initial value if any
            if (this.input.value) {
                const parsed = new Date(this.input.value);
                if (!isNaN(parsed)) {
                    this.selectedDate = parsed;
                    this.currentDate = new Date(parsed);
                }
            }
            this._updateInputText();
        }

        _initDOM() {
            // Remove readonly override if we have an external trigger. 
            // If the user uses the input as the trigger, keep it readonly or leave to caller.
            this.input.classList.add("custom-date-picker-input");

            // Create popup container
            this.popup = document.createElement("div");
            this.popup.className = "custom-date-picker-popup";
            this.popup.style.display = "none";

            // Build Layout: Left (Calendar), Right (Time - optional)
            this.calendarSection = document.createElement("div");
            this.calendarSection.className = "cdp-calendar-section";

            this._buildCalendarHeader();
            this._buildCalendarGrid();
            this._buildCalendarFooter();

            this.popup.appendChild(this.calendarSection);

            if (this.type === "datetime") {
                this.timeSection = document.createElement("div");
                this.timeSection.className = "cdp-time-section";
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
            this.prevBtn.textContent = "↑"; // standard up arrow or prev?
            this.prevBtn.className = "cdp-btn-icon";

            this.nextBtn = document.createElement("button");
            this.nextBtn.textContent = "↓";
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
            this.clearBtn.className = "cdp-btn-text";

            this.todayBtn = document.createElement("button");
            this.todayBtn.className = "cdp-btn-text";

            this.footer.appendChild(this.clearBtn);
            this.footer.appendChild(this.todayBtn);
            this.calendarSection.appendChild(this.footer);
        }

        _buildTimePickers() {
            const createScrollColumn = (max) => {
                const col = document.createElement("div");
                col.className = "cdp-time-col";
                for (let i = 0; i <= max; i++) {
                    const item = document.createElement("div");
                    item.className = "cdp-time-item";
                    item.textContent = String(i).padStart(2, "0");
                    item.dataset.val = i;
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
            const triggerEl = this.triggerElement || this.input;
            triggerEl.addEventListener("click", (e) => {
                e.stopPropagation();
                this.toggle();
            });

            document.addEventListener("click", (e) => {
                if (this.isOpen && !this.popup.contains(e.target) && e.target !== triggerEl && e.target !== this.input) {
                    this.close();
                }
            });

            this.prevBtn.addEventListener("click", (e) => {
                e.preventDefault();
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this._render();
            });

            this.nextBtn.addEventListener("click", (e) => {
                e.preventDefault();
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this._render();
            });

            this.clearBtn.addEventListener("click", (e) => {
                e.preventDefault();
                this.selectedDate = null;
                this._updateInputText();
                this._render();
                this.close();
                this._triggerChange();
            });

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
            });

            this.grid.addEventListener("click", (e) => {
                const cell = e.target.closest(".cdp-cell");
                if (!cell || cell.classList.contains("empty")) return;

                const d = parseInt(cell.dataset.date, 10);

                if (!this.selectedDate) {
                    this.selectedDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), d);
                    if (this.type === "datetime") {
                        const now = new Date();
                        this.selectedDate.setHours(now.getHours(), now.getMinutes(), 0, 0);
                    }
                } else {
                    this.selectedDate.setFullYear(this.currentDate.getFullYear(), this.currentDate.getMonth(), d);
                }

                this._updateInputText();
                this._render();

                if (this.type === "date") {
                    this.close();
                }
                this._triggerChange();
            });

            if (this.timeSection) {
                this.timeSection.addEventListener("click", (e) => {
                    const item = e.target.closest(".cdp-time-item");
                    if (!item) return;

                    const val = parseInt(item.dataset.val, 10);
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
                });
            }
        }

        _render() {
            const y = this.currentDate.getFullYear();
            const m = this.currentDate.getMonth();
            const dict = I18N[this.lang];

            this.title.textContent = dict.yearMonthFormat(y, m + 1);

            this.daysHeader.textContent = "";
            dict.days.forEach(d => {
                const el = document.createElement("div");
                el.textContent = d;
                this.daysHeader.appendChild(el);
            });

            this.grid.textContent = "";
            const firstDay = new Date(y, m, 1).getDay();
            const daysInMonth = new Date(y, m + 1, 0).getDate();

            for (let i = 0; i < firstDay; i++) {
                const empty = document.createElement("div");
                empty.className = "cdp-cell empty";
                this.grid.appendChild(empty);
            }

            for (let d = 1; d <= daysInMonth; d++) {
                const cell = document.createElement("div");
                cell.className = "cdp-cell";
                cell.textContent = d;
                cell.dataset.date = d;

                if (this.selectedDate &&
                    this.selectedDate.getFullYear() === y &&
                    this.selectedDate.getMonth() === m &&
                    this.selectedDate.getDate() === d) {
                    cell.classList.add("selected");
                }

                this.grid.appendChild(cell);
            }

            if (this.timeSection) {
                const h = this.selectedDate ? this.selectedDate.getHours() : 0;
                const min = this.selectedDate ? this.selectedDate.getMinutes() : 0;
                const s = this.selectedDate ? this.selectedDate.getSeconds() : 0;

                const updateActive = (col, val) => {
                    col.querySelectorAll(".cdp-time-item").forEach(el => {
                        el.classList.toggle("active", parseInt(el.dataset.val, 10) === val);
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
            if (!this.selectedDate) {
                this.input.value = "";
                return;
            }
            const y = this.selectedDate.getFullYear();
            const m = String(this.selectedDate.getMonth() + 1).padStart(2, "0");
            const d = String(this.selectedDate.getDate()).padStart(2, "0");

            if (this.type === "date") {
                this.input.value = `${y}-${m}-${d}`;
            } else {
                const h = String(this.selectedDate.getHours()).padStart(2, "0");
                const min = String(this.selectedDate.getMinutes()).padStart(2, "0");
                const s = String(this.selectedDate.getSeconds()).padStart(2, "0");
                this.input.value = `${y}-${m}-${d} ${h}:${min}:${s}`;
            }
        }

        _triggerChange() {
            if (this.onChange) this.onChange(this.selectedDate);
            this.input.dispatchEvent(new Event("change", { bubbles: true }));
        }

        _positionPopup() {
            const rect = this.input.getBoundingClientRect();
            this.popup.style.top = `${rect.bottom + window.scrollY + 4}px`;

            // Adjust left to prevent going off-screen
            let left = rect.left + window.scrollX;
            this.popup.style.display = "flex"; // measure
            const popRect = this.popup.getBoundingClientRect();

            if (left + popRect.width > window.innerWidth) {
                left = window.innerWidth - popRect.width - 10;
            }
            this.popup.style.left = `${Math.max(10, left)}px`;
        }

        toggle() {
            if (this.isOpen) this.close();
            else this.open();
        }

        open() {
            if (this.input.value) {
                const cleanVal = this.input.value.trim().replace(' ', 'T');
                const parsed = new Date(cleanVal);
                if (!isNaN(parsed.getTime())) {
                    this.selectedDate = parsed;
                    this.currentDate = new Date(parsed);
                } else {
                    this.selectedDate = new Date();
                    this.currentDate = new Date();
                }
            } else {
                this.selectedDate = new Date();
                this.currentDate = new Date();
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
            const dict = I18N[this.lang];
            this.input.placeholder = this.type === "date" ? dict.placeholderDate : dict.placeholderDatetime;
            this.clearBtn.textContent = dict.clear;
            this.todayBtn.textContent = dict.today;

            if (this.isOpen) this._render();
        }

        setTheme(theme) {
            this.theme = theme;
            this.popup.setAttribute("data-theme", theme);
        }

        setDate(dateObj) {
            if (!dateObj || isNaN(dateObj.getTime())) {
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
            this.popup.remove();
        }
    }

    globalObj.CustomDatePicker = CustomDatePicker;
})(typeof window !== "undefined" ? window : globalThis);
