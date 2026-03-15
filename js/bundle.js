
// --- File: i18n.js ---
const EN_I18N = {
    app_title: "Global Time Viwer v3.10.1",
    nav_live: "Realtime",
    nav_fixed_time: "Fixed Time",
    nav_fixed: "Time Edit",
    nav_multi: "Continuous Time Edit",
    nav_calc: "Calculator",
    status_sync: "Real-time sync",
    status_fixed_time: "Fixed time slot mode",
    status_fixed: "Fixed mode",
    status_multi: "Continuous time edit mode",

    label_base_time: "Base Time",
    label_add_tz: "Add Timezone",
    placeholder_search: "Search city...",
    placeholder_name: "Name",
    placeholder_abbr: "Timezone",
    label_add_custom: "Add Custom",
    label_custom: "Custom",

    label_time_adjust: "Time Edit",
    label_extra_time: "Extra Time",
    label_timeline_view: "Timeline View",
    label_copy_format: "Display / Copy Format",
    tooltip_time_adjust_desc: "You can change the time of the timezone set as the base time.",
    tooltip_extra_time_desc: "You can add an extra time slot to reflect a period range.",
    tooltip_timeline_view_desc: "Shows a box timeline in Realtime, Time Edit, and Fixed Time tabs.",
    tooltip_copy_format_desc: "You can configure what is shown and copied. Drag to reorder display and copy formats.",
    tooltip_range_count_max: "Maximum range count is 12.",
    tooltip_ui_scale_desc: "Changes the size of UI elements. Default: 100%.",
    tooltip_theme_desc: "Selects the theme. Default: Dark.",
    tooltip_language_desc: "Sets the application display language. Default: Korean.",
    tooltip_export_settings_desc: "Exports groups and all settings to an external file.",
    tooltip_import_settings_desc: "Imports groups and all settings from an exported file.",
    tooltip_reset_all_settings_desc: "Resets groups and all settings to their defaults.",

    label_display_format_row: "Display",
    label_copy_format_row: "Copy",
    label_preview: "Copy Preview",
    label_custom_days: "Custom Days",
    label_range_count: "Range Count",
    label_count_suffix: "count",
    label_range_name: "Range Name",
    label_fixed_time_slots: "Fixed Time Slots",
    label_fixed_time_slot_names: "Slot Names",
    label_fixed_date: "Fixed Date",
    label_fixed_time_default: "Fixed Time",
    placeholder_fixed_date: "YYYY-MM-DD",
    placeholder_range_title: "Range",
    label_range_start: "Range Start",
    label_start_time_adjust: "Start Time Adjust",
    label_main_time_adjust: "Time Adjust",
    label_range_bulk: "All Ranges",
    label_all_range_time_adjust: "Range Time Adjust",
    label_range_end: "End Time Adjust",
    label_extra_time_adjust: "End Time Adjust",
    label_range_period: "Period",

    label_theme: "Theme",
    label_language: "Language",
    label_ui_scale: "UI Scale",
    theme_dark: "Dark",
    theme_light: "Light",

    btn_export_settings: "Export All",
    btn_import_settings: "Import All",
    btn_reset_except_group_tz: "Reset Settings Only",
    btn_reset_all_settings: "Reset All",
    btn_reset_all: "Reset All",
    confirm_reset_all: "Are you sure you want to reset all settings and groups? This action cannot be undone.",
    btn_copy_all: "📋 Copy All",
    btn_save_table_image: "🖼️ Save Image",
    btn_save_image_tz: "🖼️ Save Image",
    btn_save_image_range: "🖼️ Save Image - Range",
    btn_save_multi_titles_image: "🖼️ Save Image - Titles",
    btn_save_multi_by_range_image: "🖼️ Save Image - All",
    btn_add_fixed_time: "+ Add Slot",
    btn_add: "Add",
    btn_list: "List",
    btn_reset: "Reset",

    btn_now: "Now",
    btn_midnight: "00:00",
    btn_sharp_hour: "Round Hour",
    btn_plus_hour: "+1h",
    btn_minus_hour: "-1h",
    btn_plus_day: "+1d",
    btn_minus_day: "-1d",
    btn_plus_week: "+1w",
    btn_minus_week: "-1w",
    btn_plus_four_weeks: "+4w",
    btn_minus_four_weeks: "-4w",
    btn_set_zero_day: "Set Period to 0 Days",
    btn_collapse: "Collapse",
    btn_expand: "Expand",
    btn_collapse_this_range: "Collapse This Range",
    btn_expand_this_range: "Expand This Range",
    btn_collapse_below: "Collapse Below",
    btn_expand_below: "Expand Below",
    btn_collapse_all: "Collapse All",
    btn_expand_all: "Expand All",
    btn_copy_range: "📋 Copy - Range",
    btn_sync_main_time: "Get Time",
    btn_sync_extra_time: "Use Previous Range End",
    btn_enable_all_start_time_adjust: "Enable All Start Time Adjust",
    btn_disable_all_start_time_adjust: "Disable All Start Time Adjust",
    btn_enable_all_end_time_adjust: "Enable All End Time Adjust",
    btn_disable_all_end_time_adjust: "Disable All End Time Adjust",

    th_tz_abbr: "Timezone",
    th_order: "Order",
    th_region: "Name",
    th_utc_offset: "UTC",
    th_time: "Time",
    th_day: "Day",
    th_copy: "Copy",
    th_remove: "Remove",
    th_action: "Action",
    th_time_day_main: "Time",
    th_time_day_extra: "Extra Time",
    th_time_day_start: "Start Time",
    th_time_day_end: "End Time",
    th_fixed_time: "Fixed Time",
    th_time_with_day_main: "Date,Time,Day",
    th_time_with_day_extra: "Extra Date,Time,Day",
    th_time_main: "Date,Time",
    th_time_extra: "Extra Date,Time",
    th_date_with_day_main: "Date,Day",
    th_date_with_day_extra: "Extra Date,Day",
    th_date_main: "Date",
    th_date_extra: "Extra Date",
    th_period_days: "Days",
    th_period_time: "Period",

    copy_field_timezone: "Timezone",
    copy_field_region: "Name",
    copy_field_offset: "UTC",
    copy_field_time_day: "Date,Time,Day",
    copy_field_time: "Time",
    label_time_parts: "Time Parts",
    btn_time_parts: "Parts",
    copy_time_part_dn: "Day/Night",
    copy_time_part_date: "Date",
    copy_time_part_time: "Time",
    copy_time_part_weekday: "Day",
    copy_field_date_day: "Date,Day",
    copy_field_date: "Date",
    copy_field_period: "Days",
    copy_field_period_time: "Period",

    utc_name: "Standard Time",

    calc_unit_title: "Time Unit Converter",
    calc_period_title: "Period Calculator",
    calc_offset_title: "Date Offset Calculator",
    calc_label_day: "Day",
    calc_label_hour: "Hour",
    calc_label_min: "Minute",
    calc_label_sec: "Second",
    calc_label_start: "Start Date",
    calc_label_end: "End Date",
    calc_label_base: "Base Date",
    calc_label_result: "Result Date",
    calc_label_total_days: "Total Days",
    calc_label_total_hours: "Total Hours",
    calc_label_total_minutes: "Total Minutes",
    calc_label_total_seconds: "Total Seconds",
    calc_label_shift: "Shift",
    calc_label_after: "after",
    calc_label_before: "before",
    calc_unit_day: "Days",
    calc_unit_week: "Weeks",
    calc_unit_month: "Months",
    calc_unit_year: "Years",
    calc_countdown_title: "Countdown",
    calc_countdown_default_prefix: "Countdown",
    calc_countdown_start: "Start",
    calc_countdown_stop: "Stop",
    calc_countdown_reset: "Reset",
    calc_countdown_expired: "Expired",
    calc_countdown_rename_prompt: "Edit countdown name:",
    calc_countdown_day_suffix: "d",
    calc_unix_title: "Smart Format Converter",
    calc_unix_current: "Current Timestamp",
    calc_unix_sync_now: "Now",
    calc_unix_ts_to_date: "Timestamp -> Date",
    calc_unix_date_to_ts: "Date -> Timestamp",
    calc_unix_invalid: "Invalid Date",
    calc_fmt_unix_sec: "Unix Timestamp (s)",
    calc_fmt_unix_ms: "Unix Timestamp (ms)",
    calc_fmt_iso_local: "ISO 8601 (Local)",
    calc_fmt_iso_utc: "ISO 8601 (UTC)",
    calc_fmt_rfc2822: "RFC 2822",
    calc_fmt_sql: "SQL / Database",
    calc_fmt_human: "Human Readable",
    calc_coming_soon_title: "Coming Soon",
    calc_coming_soon_desc: "New time utilities are in progress. Share your ideas for upcoming tools.",

    option_popular: "Select popular city...",
    overlay_select_tz: "Select Timezone",
    overlay_standard_tz_list: "Standard Time List",
    overlay_country_region_tz_list: "Country - Region List",

    default_group_name: "Default Group",
    btn_rename: "Rename",
    btn_delete: "Delete",
    default_subgroup_name: "Aux Group",
    prompt_new_group: "Enter a new group name:",
    prompt_rename_group: "Rename group to:",
    prompt_new_subgroup: "Enter a new aux group name:",
    prompt_rename_subgroup: "Rename aux group to:",

    unit_days_suffix: " days",
    unit_days_short: "d",
    unit_hours_suffix: " hours",
    unit_minutes_suffix: " minutes",
    unit_seconds_suffix: " seconds",

    tooltip_copy: "Copy",
    tooltip_edit: "Rename Group",
    tooltip_delete: "Delete Group",
    tooltip_remove_row: "Delete",
    tooltip_group_export: "Export Group",
    tooltip_group_import: "Import Group",
    tooltip_subgroup_export: "Export Aux Group",
    tooltip_subgroup_import: "Import Aux Group",
    tooltip_subgroup_edit: "Rename Aux Group",
    tooltip_subgroup_delete: "Delete Aux Group",
    tooltip_reorder: "Reorder",
    tooltip_swap_dates: "Swap Start/End Dates",
    tooltip_add_group: "Add Group",
    tooltip_add_subgroup: "Add Aux Group",
    tooltip_remove_fixed_time: "Remove slot",
    tooltip_reset_except_group_tz_desc: "Resets settings only, while keeping groups and timezones.",

    dn_day: "Day (06:00~18:00)",
    dn_night: "Night (18:01~05:59) 🌙",
    days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],

    toast_copy_success: "Copied to clipboard.",
    toast_copy_all_success: "All rows copied.",
    toast_copy_failed: "Failed to copy.",
    toast_invalid_timezone: "Invalid timezone.",
    toast_invalid_date: "Invalid date format.",
    toast_input_name: "Please enter a name.",
    toast_group_deleted: "Group deleted.",
    toast_group_min: "At least one group is required.",
    toast_name_changed: "Group name updated.",
    toast_table_image_generating: "Generating image... Please wait.",
    toast_table_image_saved: "Table image saved.",
    toast_table_image_failed: "Failed to save table image.",
    toast_settings_export_success: "Exported full config and data.\nFilename : {filename}",
    toast_settings_export_failed: "Failed to export settings JSON.",
    toast_settings_import_success: "Imported full config and data.\nFilename : {filename}",
    toast_settings_import_failed: "Failed to import settings JSON.",
    toast_storage_save_failed: "Failed to save local data.",
    toast_storage_quota_exceeded: "Failed to save local data. Browser storage is full.",
    toast_group_export_success: "Exported group config.\nFilename : {filename}",
    toast_group_export_failed: "Failed to export group config.",
    toast_group_import_success: "Imported group config.\nFilename : {filename}",
    toast_group_import_failed: "Failed to import group.",
    toast_subgroup_export_success: "Exported aux group config.\nFilename : {filename}",
    toast_subgroup_export_failed: "Failed to export aux group config.",
    toast_subgroup_import_success: "Imported aux group config.\nFilename : {filename}",
    toast_subgroup_import_failed: "Failed to import aux group.",
    toast_subgroup_deleted: "Aux group deleted.",
    toast_subgroup_min: "At least one aux group is required.",
    toast_subgroup_name_changed: "Aux group name updated.",
    toast_range_count_max: "Range count max is 12.",
    toast_range_count_min: "Range count min is 1.",
    toast_fixed_time_max: "You can add up to 5 fixed time slots.",
    toast_fixed_time_min: "At least one fixed time slot is required.",
    toast_invalid_format: "Invalid data format.",

    confirm_delete_group: "Are you sure you want to delete this group?",
    confirm_delete_subgroup: "Are you sure you want to delete this aux group?",
    confirm_reset_except_group_tz: "Reset all settings except saved groups and timezones. Continue?",
    confirm_reset_all_settings: "Saved groups, timezones, and all settings will be reset to defaults. Continue?",
    error_fatal_title: "Application Initialization Failed",
    error_fatal_desc: "An error occurred while loading data. Please try refreshing the extension or resetting the settings."
};

const KO_OVERRIDES = {
    nav_fixed_time: "\uACE0\uC815 \uC2DC\uAC04",
    status_fixed_time: "\uACE0\uC815 \uC2DC\uAC04 \uBAA8\uB4DC",
    label_fixed_time_slots: "\uACE0\uC815 \uC2DC\uAC04 \uC2AC\uB86F",
    label_fixed_time_slot_names: "\uC2AC\uB86F \uC774\uB984",
    label_fixed_date: "\uACE0\uC815 \uB0A0\uC9DC",
    label_fixed_time_default: "\uACE0\uC815 \uC2DC\uAC04",
    placeholder_fixed_date: "YYYY-MM-DD",
    btn_add_fixed_time: "+ \uC2AC\uB86F \uCD94\uAC00",
    th_fixed_time: "\uACE0\uC815 \uC2DC\uAC04",
    tooltip_remove_fixed_time: "\uC2AC\uB86F \uC0AD\uC81C",
    toast_fixed_time_max: "\uACE0\uC815 \uC2DC\uAC04 \uC2AC\uB86F\uC740 \uCD5C\uB300 5\uAC1C\uAE4C\uC9C0 \uCD94\uAC00\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
    toast_fixed_time_min: "\uACE0\uC815 \uC2DC\uAC04 \uC2AC\uB86F\uC740 \uCD5C\uC18C 1\uAC1C \uC774\uC0C1 \uD544\uC694\uD569\uB2C8\uB2E4.",
    app_title: "Global Time Viwer v3.10.1",
    nav_live: "실시간",
    nav_fixed: "시간 변경",
    nav_multi: "연속 시간 변경",
    nav_calc: "계산기 도구",
    status_sync: "실시간 동기화",
    status_fixed: "고정 시간 모드",
    status_multi: "연속 시간 변경 모드",

    label_base_time: "기준 시간",
    label_add_tz: "타임존 추가",
    placeholder_search: "도시 검색...",
    placeholder_name: "이름",
    placeholder_abbr: "시간대",
    label_add_custom: "커스텀 추가",
    label_custom: "커스텀",

    label_time_adjust: "시간 수정",
    label_extra_time: "추가 시간 표시",
    label_timeline_view: "타임라인 보기",
    label_copy_format: "표기 / 복사 양식",
    tooltip_time_adjust_desc: "기준 시간으로 설정된 시간대의 시간을 변경할 수 있습니다.",
    tooltip_extra_time_desc: "시간을 추가하여 기간을 반영해볼 수 있습니다.",
    tooltip_timeline_view_desc: "실시간/시간 변경/고정 시간 탭에 박스 타임라인을 표시합니다.",
    tooltip_copy_format_desc: "화면 표기와 복사 항목을 설정하고 드래그로 순서를 변경할 수 있습니다.",
    tooltip_range_count_max: "구간의 최대 수량은 12개 입니다.",
    tooltip_ui_scale_desc: "UI 항목의 크기를 변경합니다. 기본 값: 100%",
    tooltip_theme_desc: "테마를 선택합니다. 기본 값: 다크",
    tooltip_language_desc: "어플리케이션 출력 언어를 설정합니다. 기본 값: 한국어",
    tooltip_export_settings_desc: "그룹 및 모든 설정 값을 외부 파일로 내보냅니다.",
    tooltip_import_settings_desc: "그룹 및 모든 설정 값을 내보내기 파일을 불러서 가져옵니다.",
    tooltip_reset_all_settings_desc: "그룹 및 모든 설정 값을 초기값으로 변경합니다.",

    label_display_format_row: "표기",
    label_copy_format_row: "복사",
    label_preview: "복사 미리보기",
    label_custom_days: "커스텀 일수",
    label_range_count: "구간 수량",
    label_count_suffix: "개",
    label_range_name: "구간 이름",
    placeholder_range_title: "구간",
    label_range_start: "구간 시작",
    label_start_time_adjust: "시작 시간 조정",
    label_main_time_adjust: "시간 조정",
    label_range_bulk: "구간 일괄",
    label_all_range_time_adjust: "구간 시간 조정",
    label_range_end: "끝 시간 조정",
    label_extra_time_adjust: "끝 시간 조정",
    label_range_period: "기간",

    label_theme: "테마",
    label_language: "언어",
    label_ui_scale: "UI 스케일",
    theme_dark: "다크",
    theme_light: "라이트",

    btn_export_settings: "전체 내보내기",
    btn_import_settings: "전체 가져오기",
    btn_reset_except_group_tz: "설정만 초기화",
    btn_reset_all_settings: "전체 초기화",
    btn_copy_all: "📋 전체 복사",
    btn_save_table_image: "🖼️ 이미지 저장",
    btn_save_image_tz: "🖼️ 이미지 저장",
    btn_save_image_range: "🖼️ 이미지 저장 - 구간",
    btn_save_multi_titles_image: "🖼️ 이미지 저장 - 구간만",
    btn_save_multi_by_range_image: "🖼️ 이미지 저장 - 전체",
    btn_add: "추가",
    btn_list: "목록",
    btn_reset: "초기화",

    btn_now: "지금 시간",
    btn_midnight: "0시",
    btn_sharp_hour: "정각",
    btn_plus_hour: "+1시간",
    btn_minus_hour: "-1시간",
    btn_plus_day: "+1일",
    btn_minus_day: "-1일",
    btn_plus_week: "+1주",
    btn_minus_week: "-1주",
    btn_plus_four_weeks: "+4주",
    btn_minus_four_weeks: "-4주",
    btn_set_zero_day: "기간 0일로 변경",
    btn_collapse: "접기",
    btn_expand: "펼치기",
    btn_collapse_this_range: "이 구간 접기",
    btn_expand_this_range: "이 구간 펼치기",
    btn_collapse_below: "이하 구간 접기",
    btn_expand_below: "이하 구간 펼치기",
    btn_collapse_all: "일괄 접기",
    btn_expand_all: "일괄 펼치기",
    btn_copy_range: "📋 복사 - 구간",
    btn_sync_main_time: "시간 가져오기",
    btn_sync_extra_time: "이전 구간 끝 가져오기",
    btn_enable_all_start_time_adjust: "모든 시작 시간 조정 활성화",
    btn_disable_all_start_time_adjust: "모든 시작 시간 조정 비활성화",
    btn_enable_all_end_time_adjust: "모든 끝 시간 조정 활성화",
    btn_disable_all_end_time_adjust: "모든 끝 시간 조정 비활성화",

    th_tz_abbr: "시간대",
    th_order: "순서",
    th_region: "이름",
    th_copy: "복사",
    th_remove: "제거",
    th_time_day_main: "시간",
    th_time_day_extra: "추가 시간",
    th_time_day_start: "시작 시간",
    th_time_day_end: "끝 시간",
    th_period_days: "일수",
    th_period_time: "기간",

    copy_field_timezone: "시간대",
    copy_field_region: "이름",
    copy_field_offset: "UTC",
    copy_field_time_day: "날짜,시간,요일",
    copy_field_time: "시간",
    btn_time_parts: "항목",
    copy_time_part_dn: "낮/밤",
    copy_time_part_date: "날짜",
    copy_time_part_time: "시간",
    copy_time_part_weekday: "요일",
    copy_field_date_day: "날짜,요일",
    copy_field_date: "날짜",
    copy_field_period: "일수",
    copy_field_period_time: "기간",

    utc_name: "표준시",

    calc_unit_title: "시간 단위 변환",
    calc_period_title: "기간 계산",
    calc_offset_title: "날짜 이동 계산",
    calc_label_day: "일",
    calc_label_hour: "시간",
    calc_label_min: "분",
    calc_label_sec: "초",
    calc_label_start: "시작일",
    calc_label_end: "종료일",
    calc_label_base: "기준일",
    calc_label_result: "결과 날짜",
    calc_label_total_days: "총 일수",
    calc_label_total_hours: "총 시간",
    calc_label_total_minutes: "총 분",
    calc_label_total_seconds: "총 초",
    calc_label_shift: "이동량",
    calc_label_after: "후",
    calc_label_before: "전",
    calc_unit_day: "일",
    calc_unit_week: "주",
    calc_unit_month: "개월",
    calc_unit_year: "년",
    calc_countdown_title: "카운트다운",
    calc_countdown_default_prefix: "카운트다운",
    calc_countdown_start: "시작",
    calc_countdown_stop: "중지",
    calc_countdown_reset: "초기화",
    calc_countdown_expired: "만료",
    calc_countdown_rename_prompt: "카운트다운 이름을 입력하세요:",
    calc_countdown_day_suffix: "일",
    calc_unix_title: "스마트 시간 포맷 변환기",
    calc_unix_current: "현재 타임스탬프",
    calc_unix_sync_now: "지금",
    calc_unix_ts_to_date: "타임스탬프 -> 날짜",
    calc_unix_date_to_ts: "날짜 -> 타임스탬프",
    calc_unix_invalid: "유효하지 않은 날짜",
    calc_fmt_unix_sec: "Unix 타임스탬프 (초)",
    calc_fmt_unix_ms: "Unix 타임스탬프 (밀리초)",
    calc_fmt_iso_local: "ISO 8601 (로컬)",
    calc_fmt_iso_utc: "ISO 8601 (UTC)",
    calc_fmt_rfc2822: "RFC 2822",
    calc_fmt_sql: "SQL / 데이터베이스",
    calc_fmt_human: "사람이 읽기 쉬운 형식",
    calc_coming_soon_title: "새로운 기능 준비 중 (Coming Soon)",
    calc_coming_soon_desc: "Global Time Viwer는 더 편리한 시간 계산 기능을 준비하고 있습니다. 원하시는 기능이 있다면 의견을 남겨주세요.",

    option_popular: "인기 도시 선택...",
    overlay_select_tz: "시간대 선택",
    overlay_standard_tz_list: "표준시 목록",
    overlay_country_region_tz_list: "국가 - 지역 목록",

    default_group_name: "그룹",
    btn_rename: "이름 변경",
    btn_delete: "삭제",
    default_subgroup_name: "보조 그룹",
    prompt_new_group: "새 그룹 이름을 입력하세요:",
    prompt_rename_group: "그룹 이름 변경:",
    prompt_new_subgroup: "새 보조 그룹 이름을 입력하세요:",
    prompt_rename_subgroup: "보조 그룹 이름 변경:",

    unit_days_suffix: "일",
    unit_days_short: "일",
    unit_hours_suffix: "시간",
    unit_minutes_suffix: "분",
    unit_seconds_suffix: "초",

    tooltip_copy: "복사",
    tooltip_edit: "그룹 이름 변경",
    tooltip_delete: "그룹 삭제",
    tooltip_remove_row: "삭제",
    tooltip_group_export: "그룹 내보내기",
    tooltip_group_import: "그룹 가져오기",
    tooltip_subgroup_export: "보조 그룹 내보내기",
    tooltip_subgroup_import: "보조 그룹 가져오기",
    tooltip_subgroup_edit: "보조 그룹 이름 변경",
    tooltip_subgroup_delete: "보조 그룹 삭제",
    tooltip_reorder: "순서 변경",
    tooltip_swap_dates: "시작일과 종료일 바꾸기",
    tooltip_add_group: "새 그룹 추가",
    tooltip_add_subgroup: "새 보조 그룹 추가",
    tooltip_reset_except_group_tz_desc: "그룹과 시간대를 제외한 설정 값만 초기화 합니다.",

    dn_day: "낮 (06:00~18:00)",
    dn_night: "밤 (18:01~05:59) 🌙",
    days: ["일", "월", "화", "수", "목", "금", "토"],

    toast_copy_success: "클립보드에 복사했습니다.",
    toast_copy_all_success: "전체 행을 복사했습니다.",
    toast_copy_failed: "복사에 실패했습니다.",
    toast_invalid_timezone: "유효하지 않은 시간대입니다.",
    toast_invalid_date: "유효하지 않은 날짜 형식입니다.",
    toast_input_name: "이름을 입력해주세요.",
    toast_group_deleted: "그룹을 삭제했습니다.",
    toast_group_min: "최소 1개 그룹이 필요합니다.",
    toast_name_changed: "이름을 변경했습니다.",
    toast_table_image_generating: "이미지 생성 중... 잠시만 기다려주세요.",
    toast_table_image_saved: "이미지를 저장했습니다.",
    toast_table_image_failed: "이미지 저장에 실패했습니다.",
    toast_settings_export_success: "전체 구성과 데이터를 내보냈습니다.\n파일명 : {filename}",
    toast_settings_export_failed: "전체 구성 내보내기에 실패했습니다.",
    toast_settings_import_success: "전체 구성과 데이터를 가져왔습니다.\n파일명 : {filename}",
    toast_settings_import_failed: "전체 구성 가져오기에 실패했습니다.",
    toast_storage_save_failed: "로컬 데이터 저장에 실패했습니다.",
    toast_storage_quota_exceeded: "로컬 데이터 저장에 실패했습니다. 브라우저 저장 공간이 부족합니다.",
    toast_group_export_success: "그룹 구성을 내보냈습니다.\n파일명 : {filename}",
    toast_group_export_failed: "그룹 구성 내보내기에 실패했습니다.",
    toast_group_import_success: "그룹 구성을 가져왔습니다.\n파일명 : {filename}",
    toast_group_import_failed: "그룹 가져오기에 실패 했습니다.",
    toast_subgroup_export_success: "보조 그룹 구성을 내보냈습니다.\n파일명 : {filename}",
    toast_subgroup_export_failed: "보조 그룹 구성 내보내기에 실패했습니다.",
    toast_subgroup_import_success: "보조 그룹 구성을 가져왔습니다.\n파일명 : {filename}",
    toast_subgroup_import_failed: "보조 그룹 가져오기에 실패 했습니다.",
    toast_subgroup_deleted: "보조 그룹을 삭제했습니다.",
    toast_subgroup_min: "최소 1개 보조 그룹이 필요합니다.",
    toast_subgroup_name_changed: "보조 그룹 이름을 변경했습니다.",
    toast_range_count_max: "구간 수량은 최대 12개 입니다.",
    toast_range_count_min: "구간 수량은 최소 1개 입니다.",
    toast_invalid_format: "잘못된 데이터 형식입니다.",

    confirm_delete_group: "이 그룹을 삭제하시겠습니까?",
    confirm_delete_subgroup: "이 보조 그룹을 삭제하시겠습니까?",
    confirm_reset_except_group_tz: "저장된 그룹과 시간대를 유지하고 나머지 설정을 초기화합니다. 계속할까요?",
    confirm_reset_all_settings: "저장된 그룹/시간대/모든 설정을 초기값으로 되돌립니다. 계속할까요?",
    error_fatal_title: "애플리케이션 초기화 실패",
    error_fatal_desc: "데이터를 불러오는 중 오류가 발생했습니다. 확장 프로그램을 새로고침하거나 설정을 초기화해 보세요."
};

const I18N_DATA = {
    ko: { ...EN_I18N, ...KO_OVERRIDES },
    en: { ...EN_I18N }
};

function safeLocalStorageGet(key, fallback = null) {
    try {
        return localStorage.getItem(key) ?? fallback;
    } catch (e) {
        console.warn(`localStorage.getItem("${key}") failed during i18n init.`, e);
        return fallback;
    }
}

function safeLocalStorageSet(key, value) {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (e) {
        console.warn(`localStorage.setItem("${key}") failed during i18n update.`, e);
        return false;
    }
}

let currentLang = safeLocalStorageGet("GTV_Lang") || "ko";
if (!I18N_DATA[currentLang]) {
    currentLang = "ko";
}

function setLanguage(lang) {
    if (!I18N_DATA[lang]) return;
    currentLang = lang;
    safeLocalStorageSet("GTV_Lang", lang);
    applyTranslations();
}

function t(key) {
    return I18N_DATA[currentLang]?.[key] ?? I18N_DATA.ko[key] ?? key;
}

function tFormat(key, vars = {}) {
    const base = t(key);
    return Object.entries(vars).reduce((acc, [name, value]) => {
        const token = `{${name}}`;
        return acc.split(token).join(String(value));
    }, base);
}

function applyTranslations() {
    document.documentElement.lang = currentLang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        const translation = t(key);
        if (el.tagName === "INPUT" && (el.type === "text" || el.type === "number")) {
            el.placeholder = translation;
        } else if (el.tagName === "OPTION") {
            el.textContent = translation;
        } else {
            el.textContent = translation;
        }
    });

    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
        const key = el.getAttribute("data-i18n-title");
        const translation = t(key);
        el.setAttribute("data-tooltip", translation);
        el.removeAttribute("title");
        el.setAttribute("aria-label", translation);
        if (!el.classList.contains("info-tip")) {
            el.classList.add("custom-tooltip");
        }
    });

    const langSelect = document.getElementById("lang-select");
    if (langSelect) {
        const koOption = langSelect.querySelector('option[value="ko"]');
        const enOption = langSelect.querySelector('option[value="en"]');
        if (koOption) koOption.textContent = "한국어(KO)";
        if (enOption) enOption.textContent = "English(EN)";
    }

    if (I18N_DATA[currentLang].app_title) {
        document.title = I18N_DATA[currentLang].app_title;
    }
}

// --- File: js/vendor/luxon.min.js ---
var luxon=function(e){"use strict";function L(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,function(e){e=function(e,t){if("object"!=typeof e||null===e)return e;var n=e[Symbol.toPrimitive];if(void 0===n)return("string"===t?String:Number)(e);n=n.call(e,t||"default");if("object"!=typeof n)return n;throw new TypeError("@@toPrimitive must return a primitive value.")}(e,"string");return"symbol"==typeof e?e:String(e)}(r.key),r)}}function i(e,t,n){t&&L(e.prototype,t),n&&L(e,n),Object.defineProperty(e,"prototype",{writable:!1})}function l(){return(l=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n,r=arguments[t];for(n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(this,arguments)}function o(e,t){e.prototype=Object.create(t.prototype),z(e.prototype.constructor=e,t)}function j(e){return(j=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function z(e,t){return(z=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e})(e,t)}function A(e,t,n){return(A=function(){if("undefined"!=typeof Reflect&&Reflect.construct&&!Reflect.construct.sham){if("function"==typeof Proxy)return 1;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),1}catch(e){}}}()?Reflect.construct.bind():function(e,t,n){var r=[null];r.push.apply(r,t);t=new(Function.bind.apply(e,r));return n&&z(t,n.prototype),t}).apply(null,arguments)}function q(e){var n="function"==typeof Map?new Map:void 0;return function(e){if(null===e||-1===Function.toString.call(e).indexOf("[native code]"))return e;if("function"!=typeof e)throw new TypeError("Super expression must either be null or a function");if(void 0!==n){if(n.has(e))return n.get(e);n.set(e,t)}function t(){return A(e,arguments,j(this).constructor)}return t.prototype=Object.create(e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),z(t,e)}(e)}function _(e,t){if(null==e)return{};for(var n,r={},i=Object.keys(e),o=0;o<i.length;o++)n=i[o],0<=t.indexOf(n)||(r[n]=e[n]);return r}function U(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function R(e,t){var n,r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(r)return(r=r.call(e)).next.bind(r);if(Array.isArray(e)||(r=function(e,t){var n;if(e)return"string"==typeof e?U(e,t):"Map"===(n="Object"===(n=Object.prototype.toString.call(e).slice(8,-1))&&e.constructor?e.constructor.name:n)||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?U(e,t):void 0}(e))||t&&e&&"number"==typeof e.length)return r&&(e=r),n=0,function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}};throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var t=function(e){function t(){return e.apply(this,arguments)||this}return o(t,e),t}(q(Error)),P=function(t){function e(e){return t.call(this,"Invalid DateTime: "+e.toMessage())||this}return o(e,t),e}(t),Y=function(t){function e(e){return t.call(this,"Invalid Interval: "+e.toMessage())||this}return o(e,t),e}(t),H=function(t){function e(e){return t.call(this,"Invalid Duration: "+e.toMessage())||this}return o(e,t),e}(t),w=function(e){function t(){return e.apply(this,arguments)||this}return o(t,e),t}(t),J=function(t){function e(e){return t.call(this,"Invalid unit "+e)||this}return o(e,t),e}(t),u=function(e){function t(){return e.apply(this,arguments)||this}return o(t,e),t}(t),n=function(e){function t(){return e.call(this,"Zone is an abstract class")||this}return o(t,e),t}(t),t="numeric",r="short",a="long",G={year:t,month:t,day:t},$={year:t,month:r,day:t},B={year:t,month:r,day:t,weekday:r},Q={year:t,month:a,day:t},K={year:t,month:a,day:t,weekday:a},X={hour:t,minute:t},ee={hour:t,minute:t,second:t},te={hour:t,minute:t,second:t,timeZoneName:r},ne={hour:t,minute:t,second:t,timeZoneName:a},re={hour:t,minute:t,hourCycle:"h23"},ie={hour:t,minute:t,second:t,hourCycle:"h23"},oe={hour:t,minute:t,second:t,hourCycle:"h23",timeZoneName:r},ae={hour:t,minute:t,second:t,hourCycle:"h23",timeZoneName:a},se={year:t,month:t,day:t,hour:t,minute:t},ue={year:t,month:t,day:t,hour:t,minute:t,second:t},le={year:t,month:r,day:t,hour:t,minute:t},ce={year:t,month:r,day:t,hour:t,minute:t,second:t},fe={year:t,month:r,day:t,weekday:r,hour:t,minute:t},de={year:t,month:a,day:t,hour:t,minute:t,timeZoneName:r},he={year:t,month:a,day:t,hour:t,minute:t,second:t,timeZoneName:r},me={year:t,month:a,day:t,weekday:a,hour:t,minute:t,timeZoneName:a},ye={year:t,month:a,day:t,weekday:a,hour:t,minute:t,second:t,timeZoneName:a},s=function(){function e(){}var t=e.prototype;return t.offsetName=function(e,t){throw new n},t.formatOffset=function(e,t){throw new n},t.offset=function(e){throw new n},t.equals=function(e){throw new n},i(e,[{key:"type",get:function(){throw new n}},{key:"name",get:function(){throw new n}},{key:"ianaName",get:function(){return this.name}},{key:"isUniversal",get:function(){throw new n}},{key:"isValid",get:function(){throw new n}}]),e}(),ve=null,ge=function(e){function t(){return e.apply(this,arguments)||this}o(t,e);var n=t.prototype;return n.offsetName=function(e,t){return Ot(e,t.format,t.locale)},n.formatOffset=function(e,t){return Dt(this.offset(e),t)},n.offset=function(e){return-new Date(e).getTimezoneOffset()},n.equals=function(e){return"system"===e.type},i(t,[{key:"type",get:function(){return"system"}},{key:"name",get:function(){return(new Intl.DateTimeFormat).resolvedOptions().timeZone}},{key:"isUniversal",get:function(){return!1}},{key:"isValid",get:function(){return!0}}],[{key:"instance",get:function(){return ve=null===ve?new t:ve}}]),t}(s),pe=new Map;var ke={year:0,month:1,day:2,era:3,hour:4,minute:5,second:6};var we=new Map,c=function(n){function r(e){var t=n.call(this)||this;return t.zoneName=e,t.valid=r.isValidZone(e),t}o(r,n),r.create=function(e){var t=we.get(e);return void 0===t&&we.set(e,t=new r(e)),t},r.resetCache=function(){we.clear(),pe.clear()},r.isValidSpecifier=function(e){return this.isValidZone(e)},r.isValidZone=function(e){if(!e)return!1;try{return new Intl.DateTimeFormat("en-US",{timeZone:e}).format(),!0}catch(e){return!1}};var e=r.prototype;return e.offsetName=function(e,t){return Ot(e,t.format,t.locale,this.name)},e.formatOffset=function(e,t){return Dt(this.offset(e),t)},e.offset=function(e){var t,n,r,i,o,a,s,u;return!this.valid||(e=new Date(e),isNaN(e))?NaN:(i=this.name,void 0===(o=pe.get(i))&&(o=new Intl.DateTimeFormat("en-US",{hour12:!1,timeZone:i,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",era:"short"}),pe.set(i,o)),a=(i=(i=o).formatToParts?function(e,t){for(var n=e.formatToParts(t),r=[],i=0;i<n.length;i++){var o=n[i],a=o.type,o=o.value,s=ke[a];"era"===a?r[s]=o:N(s)||(r[s]=parseInt(o,10))}return r}(i,e):(o=e,i=(i=i).format(o).replace(/\u200E/g,""),i=(o=/(\d+)\/(\d+)\/(\d+) (AD|BC),? (\d+):(\d+):(\d+)/.exec(i))[1],a=o[2],[o[3],i,a,o[4],o[5],o[6],o[7]]))[0],o=i[1],t=i[2],n=i[3],s=i[4],r=i[5],i=i[6],s=24===s?0:s,u=(e=+e)%1e3,(kt({year:a="BC"===n?1-Math.abs(a):a,month:o,day:t,hour:s,minute:r,second:i,millisecond:0})-(e-=0<=u?u:1e3+u))/6e4)},e.equals=function(e){return"iana"===e.type&&e.name===this.name},i(r,[{key:"type",get:function(){return"iana"}},{key:"name",get:function(){return this.zoneName}},{key:"isUniversal",get:function(){return!1}},{key:"isValid",get:function(){return this.valid}}]),r}(s),be=["base"],Se=["padTo","floor"],Oe={};var Te=new Map;function Ne(e,t){void 0===t&&(t={});var n=JSON.stringify([e,t]),r=Te.get(n);return void 0===r&&(r=new Intl.DateTimeFormat(e,t),Te.set(n,r)),r}var Me=new Map;var De=new Map;var Ie=null;var Ve=new Map;function Ee(e){var t=Ve.get(e);return void 0===t&&(t=new Intl.DateTimeFormat(e).resolvedOptions(),Ve.set(e,t)),t}var xe=new Map;function Fe(e,t,n,r){e=e.listingMode();return"error"===e?null:("en"===e?n:r)(t)}var Ce=function(){function e(e,t,n){this.padTo=n.padTo||0,this.floor=n.floor||!1,n.padTo,n.floor;var r=_(n,Se);(!t||0<Object.keys(r).length)&&(t=l({useGrouping:!1},n),0<n.padTo&&(t.minimumIntegerDigits=n.padTo),this.inf=(r=e,void 0===(n=t)&&(n={}),e=JSON.stringify([r,n]),void 0===(t=Me.get(e))&&(t=new Intl.NumberFormat(r,n),Me.set(e,t)),t))}return e.prototype.format=function(e){var t;return this.inf?(t=this.floor?Math.floor(e):e,this.inf.format(t)):m(this.floor?Math.floor(e):vt(e,3),this.padTo)},e}(),Ze=function(){function e(e,t,n){this.opts=n;var n=this.originalZone=void 0,r=(this.opts.timeZone?this.dt=e:"fixed"===e.zone.type?(r=0<=(r=e.offset/60*-1)?"Etc/GMT+"+r:"Etc/GMT"+r,0!==e.offset&&c.create(r).valid?(n=r,this.dt=e):(n="UTC",this.dt=0===e.offset?e:e.setZone("UTC").plus({minutes:e.offset}),this.originalZone=e.zone)):"system"===e.zone.type?this.dt=e:"iana"===e.zone.type?n=(this.dt=e).zone.name:(this.dt=e.setZone(n="UTC").plus({minutes:e.offset}),this.originalZone=e.zone),l({},this.opts));r.timeZone=r.timeZone||n,this.dtf=Ne(t,r)}var t=e.prototype;return t.format=function(){return this.originalZone?this.formatToParts().map(function(e){return e.value}).join(""):this.dtf.format(this.dt.toJSDate())},t.formatToParts=function(){var t=this,e=this.dtf.formatToParts(this.dt.toJSDate());return this.originalZone?e.map(function(e){return"timeZoneName"===e.type?l({},e,{value:t.originalZone.offsetName(t.dt.ts,{locale:t.dt.locale,format:t.opts.timeZoneName})}):e}):e},t.resolvedOptions=function(){return this.dtf.resolvedOptions()},e}(),We=function(){function e(e,t,n){var r;this.opts=l({style:"long"},n),!t&&ft()&&(this.rtf=(t=e,(n=e=void 0===(e=n)?{}:e).base,n=_(n=e,be),n=JSON.stringify([t,n]),void 0===(r=De.get(n))&&(r=new Intl.RelativeTimeFormat(t,e),De.set(n,r)),r))}var t=e.prototype;return t.format=function(e,t){if(this.rtf)return this.rtf.format(e,t);var n=t,t=e,e=this.opts.numeric,r="long"!==this.opts.style,i=(void 0===e&&(e="always"),void 0===r&&(r=!1),{years:["year","yr."],quarters:["quarter","qtr."],months:["month","mo."],weeks:["week","wk."],days:["day","day","days"],hours:["hour","hr."],minutes:["minute","min."],seconds:["second","sec."]}),o=-1===["hours","minutes","seconds"].indexOf(n);if("auto"===e&&o){var a="days"===n;switch(t){case 1:return a?"tomorrow":"next "+i[n][0];case-1:return a?"yesterday":"last "+i[n][0];case 0:return a?"today":"this "+i[n][0]}}var e=Object.is(t,-0)||t<0,t=1===(o=Math.abs(t)),s=i[n],r=r?!t&&s[2]||s[1]:t?i[n][0]:n;return e?o+" "+r+" ago":"in "+o+" "+r},t.formatToParts=function(e,t){return this.rtf?this.rtf.formatToParts(e,t):[]},e}(),Le={firstDay:1,minimalDays:4,weekend:[6,7]},b=function(){function o(e,t,n,r,i){var e=function(t){var n=t.indexOf("-x-");if(-1===(n=(t=-1!==n?t.substring(0,n):t).indexOf("-u-")))return[t];try{r=Ne(t).resolvedOptions(),i=t}catch(e){var t=t.substring(0,n),r=Ne(t).resolvedOptions(),i=t}return[i,(n=r).numberingSystem,n.calendar]}(e),o=e[0],a=e[1],e=e[2];this.locale=o,this.numberingSystem=t||a||null,this.outputCalendar=n||e||null,this.weekSettings=r,this.intl=(o=this.locale,t=this.numberingSystem,((a=this.outputCalendar)||t)&&(o.includes("-u-")||(o+="-u"),a&&(o+="-ca-"+a),t)&&(o+="-nu-"+t),o),this.weekdaysCache={format:{},standalone:{}},this.monthsCache={format:{},standalone:{}},this.meridiemCache=null,this.eraCache={},this.specifiedLocale=i,this.fastNumbersCached=null}o.fromOpts=function(e){return o.create(e.locale,e.numberingSystem,e.outputCalendar,e.weekSettings,e.defaultToEN)},o.create=function(e,t,n,r,i){void 0===i&&(i=!1);e=e||O.defaultLocale;return new o(e||(i?"en-US":Ie=Ie||(new Intl.DateTimeFormat).resolvedOptions().locale),t||O.defaultNumberingSystem,n||O.defaultOutputCalendar,mt(r)||O.defaultWeekSettings,e)},o.resetCache=function(){Ie=null,Te.clear(),Me.clear(),De.clear(),Ve.clear(),xe.clear()},o.fromObject=function(e){var e=void 0===e?{}:e,t=e.locale,n=e.numberingSystem,r=e.outputCalendar,e=e.weekSettings;return o.create(t,n,r,e)};var e=o.prototype;return e.listingMode=function(){var e=this.isEnglish(),t=!(null!==this.numberingSystem&&"latn"!==this.numberingSystem||null!==this.outputCalendar&&"gregory"!==this.outputCalendar);return e&&t?"en":"intl"},e.clone=function(e){return e&&0!==Object.getOwnPropertyNames(e).length?o.create(e.locale||this.specifiedLocale,e.numberingSystem||this.numberingSystem,e.outputCalendar||this.outputCalendar,mt(e.weekSettings)||this.weekSettings,e.defaultToEN||!1):this},e.redefaultToEN=function(e){return this.clone(l({},e=void 0===e?{}:e,{defaultToEN:!0}))},e.redefaultToSystem=function(e){return this.clone(l({},e=void 0===e?{}:e,{defaultToEN:!1}))},e.months=function(r,i){var o=this;return void 0===i&&(i=!1),Fe(this,r,Ft,function(){var e="ja"===o.intl||o.intl.startsWith("ja-"),t=(i&=!e)?{month:r,day:"numeric"}:{month:r},n=i?"format":"standalone";return o.monthsCache[n][r]||(o.monthsCache[n][r]=function(e){for(var t=[],n=1;n<=12;n++){var r=W.utc(2009,n,1);t.push(e(r))}return t}(e?function(e){return o.dtFormatter(e,t).format()}:function(e){return o.extract(e,t,"month")})),o.monthsCache[n][r]})},e.weekdays=function(n,r){var i=this;return void 0===r&&(r=!1),Fe(this,n,Lt,function(){var t=r?{weekday:n,year:"numeric",month:"long",day:"numeric"}:{weekday:n},e=r?"format":"standalone";return i.weekdaysCache[e][n]||(i.weekdaysCache[e][n]=function(e){for(var t=[],n=1;n<=7;n++){var r=W.utc(2016,11,13+n);t.push(e(r))}return t}(function(e){return i.extract(e,t,"weekday")})),i.weekdaysCache[e][n]})},e.meridiems=function(){var n=this;return Fe(this,void 0,function(){return jt},function(){var t;return n.meridiemCache||(t={hour:"numeric",hourCycle:"h12"},n.meridiemCache=[W.utc(2016,11,13,9),W.utc(2016,11,13,19)].map(function(e){return n.extract(e,t,"dayperiod")})),n.meridiemCache})},e.eras=function(e){var n=this;return Fe(this,e,_t,function(){var t={era:e};return n.eraCache[e]||(n.eraCache[e]=[W.utc(-40,1,1),W.utc(2017,1,1)].map(function(e){return n.extract(e,t,"era")})),n.eraCache[e]})},e.extract=function(e,t,n){e=this.dtFormatter(e,t).formatToParts().find(function(e){return e.type.toLowerCase()===n});return e?e.value:null},e.numberFormatter=function(e){return new Ce(this.intl,(e=void 0===e?{}:e).forceSimple||this.fastNumbers,e)},e.dtFormatter=function(e,t){return new Ze(e,this.intl,t=void 0===t?{}:t)},e.relFormatter=function(e){return void 0===e&&(e={}),new We(this.intl,this.isEnglish(),e)},e.listFormatter=function(e){return void 0===e&&(e={}),t=this.intl,void 0===(e=e)&&(e={}),n=JSON.stringify([t,e]),(r=Oe[n])||(r=new Intl.ListFormat(t,e),Oe[n]=r),r;var t,n,r},e.isEnglish=function(){return"en"===this.locale||"en-us"===this.locale.toLowerCase()||Ee(this.intl).locale.startsWith("en-us")},e.getWeekSettings=function(){return this.weekSettings||(dt()?(e=this.locale,(n=xe.get(e))||("minimalDays"in(n="getWeekInfo"in(t=new Intl.Locale(e))?t.getWeekInfo():t.weekInfo)||(n=l({},Le,n)),xe.set(e,n)),n):Le);var e,t,n},e.getStartOfWeek=function(){return this.getWeekSettings().firstDay},e.getMinDaysInFirstWeek=function(){return this.getWeekSettings().minimalDays},e.getWeekendDays=function(){return this.getWeekSettings().weekend},e.equals=function(e){return this.locale===e.locale&&this.numberingSystem===e.numberingSystem&&this.outputCalendar===e.outputCalendar},e.toString=function(){return"Locale("+this.locale+", "+this.numberingSystem+", "+this.outputCalendar+")"},i(o,[{key:"fastNumbers",get:function(){var e;return null==this.fastNumbersCached&&(this.fastNumbersCached=(!(e=this).numberingSystem||"latn"===e.numberingSystem)&&("latn"===e.numberingSystem||!e.locale||e.locale.startsWith("en")||"latn"===Ee(e.locale).numberingSystem)),this.fastNumbersCached}}]),o}(),je=null,f=function(n){function t(e){var t=n.call(this)||this;return t.fixed=e,t}o(t,n),t.instance=function(e){return 0===e?t.utcInstance:new t(e)},t.parseSpecifier=function(e){if(e){e=e.match(/^utc(?:([+-]\d{1,2})(?::(\d{2}))?)?$/i);if(e)return new t(Tt(e[1],e[2]))}return null};var e=t.prototype;return e.offsetName=function(){return this.name},e.formatOffset=function(e,t){return Dt(this.fixed,t)},e.offset=function(){return this.fixed},e.equals=function(e){return"fixed"===e.type&&e.fixed===this.fixed},i(t,[{key:"type",get:function(){return"fixed"}},{key:"name",get:function(){return 0===this.fixed?"UTC":"UTC"+Dt(this.fixed,"narrow")}},{key:"ianaName",get:function(){return 0===this.fixed?"Etc/UTC":"Etc/GMT"+Dt(-this.fixed,"narrow")}},{key:"isUniversal",get:function(){return!0}},{key:"isValid",get:function(){return!0}}],[{key:"utcInstance",get:function(){return je=null===je?new t(0):je}}]),t}(s),ze=function(n){function e(e){var t=n.call(this)||this;return t.zoneName=e,t}o(e,n);var t=e.prototype;return t.offsetName=function(){return null},t.formatOffset=function(){return""},t.offset=function(){return NaN},t.equals=function(){return!1},i(e,[{key:"type",get:function(){return"invalid"}},{key:"name",get:function(){return this.zoneName}},{key:"isUniversal",get:function(){return!1}},{key:"isValid",get:function(){return!1}}]),e}(s);function S(e,t){var n;return N(e)||null===e?t:e instanceof s?e:"string"==typeof e?"default"===(n=e.toLowerCase())?t:"local"===n||"system"===n?ge.instance:"utc"===n||"gmt"===n?f.utcInstance:f.parseSpecifier(n)||c.create(e):v(e)?f.instance(e):"object"==typeof e&&"offset"in e&&"function"==typeof e.offset?e:new ze(e)}var Ae={arab:"[٠-٩]",arabext:"[۰-۹]",bali:"[᭐-᭙]",beng:"[০-৯]",deva:"[०-९]",fullwide:"[０-９]",gujr:"[૦-૯]",hanidec:"[〇|一|二|三|四|五|六|七|八|九]",khmr:"[០-៩]",knda:"[೦-೯]",laoo:"[໐-໙]",limb:"[᥆-᥏]",mlym:"[൦-൯]",mong:"[᠐-᠙]",mymr:"[၀-၉]",orya:"[୦-୯]",tamldec:"[௦-௯]",telu:"[౦-౯]",thai:"[๐-๙]",tibt:"[༠-༩]",latn:"\\d"},qe={arab:[1632,1641],arabext:[1776,1785],bali:[6992,7001],beng:[2534,2543],deva:[2406,2415],fullwide:[65296,65303],gujr:[2790,2799],khmr:[6112,6121],knda:[3302,3311],laoo:[3792,3801],limb:[6470,6479],mlym:[3430,3439],mong:[6160,6169],mymr:[4160,4169],orya:[2918,2927],tamldec:[3046,3055],telu:[3174,3183],thai:[3664,3673],tibt:[3872,3881]},_e=Ae.hanidec.replace(/[\[|\]]/g,"").split("");var Ue=new Map;function y(e,t){void 0===t&&(t="");var e=e.numberingSystem||"latn",n=Ue.get(e),r=(void 0===n&&(n=new Map,Ue.set(e,n)),n.get(t));return void 0===r&&(r=new RegExp(""+Ae[e]+t),n.set(t,r)),r}var Re,Pe=function(){return Date.now()},Ye="system",He=null,Je=null,Ge=null,$e=60,Be=null,O=function(){function e(){}return e.resetCaches=function(){b.resetCache(),c.resetCache(),W.resetCache(),Ue.clear()},i(e,null,[{key:"now",get:function(){return Pe},set:function(e){Pe=e}},{key:"defaultZone",get:function(){return S(Ye,ge.instance)},set:function(e){Ye=e}},{key:"defaultLocale",get:function(){return He},set:function(e){He=e}},{key:"defaultNumberingSystem",get:function(){return Je},set:function(e){Je=e}},{key:"defaultOutputCalendar",get:function(){return Ge},set:function(e){Ge=e}},{key:"defaultWeekSettings",get:function(){return Be},set:function(e){Be=mt(e)}},{key:"twoDigitCutoffYear",get:function(){return $e},set:function(e){$e=e%100}},{key:"throwOnInvalid",get:function(){return Re},set:function(e){Re=e}}]),e}(),d=function(){function e(e,t){this.reason=e,this.explanation=t}return e.prototype.toMessage=function(){return this.explanation?this.reason+": "+this.explanation:this.reason},e}(),Qe=[0,31,59,90,120,151,181,212,243,273,304,334],Ke=[0,31,60,91,121,152,182,213,244,274,305,335];function T(e,t){return new d("unit out of range","you specified "+t+" (of type "+typeof t+") as a "+e+", which is invalid")}function Xe(e,t,n){t=new Date(Date.UTC(e,t-1,n)),e<100&&0<=e&&t.setUTCFullYear(t.getUTCFullYear()-1900),n=t.getUTCDay();return 0===n?7:n}function et(e,t,n){return n+(gt(e)?Ke:Qe)[t-1]}function tt(e,t){var e=gt(e)?Ke:Qe,n=e.findIndex(function(e){return e<t});return{month:n+1,day:t-e[n]}}function nt(e,t){return(e-t+7)%7+1}function rt(e,t,n){void 0===t&&(t=4),void 0===n&&(n=1);var r,i=e.year,o=e.month,a=e.day,s=et(i,o,a),o=nt(Xe(i,o,a),n),a=Math.floor((s-o+14-t)/7);return a<1?a=bt(r=i-1,t,n):a>bt(i,t,n)?(r=i+1,a=1):r=i,l({weekYear:r,weekNumber:a,weekday:o},It(e))}function it(e,t,n){void 0===n&&(n=1);var r,i=e.weekYear,o=e.weekNumber,a=e.weekday,n=nt(Xe(i,1,t=void 0===t?4:t),n),s=D(i),o=7*o+a-n-7+t,a=(o<1?o+=D(r=i-1):s<o?(r=i+1,o-=D(i)):r=i,tt(r,o));return l({year:r,month:a.month,day:a.day},It(e))}function ot(e){var t=e.year;return l({year:t,ordinal:et(t,e.month,e.day)},It(e))}function at(e){var t=e.year,n=tt(t,e.ordinal);return l({year:t,month:n.month,day:n.day},It(e))}function st(e,t){if(N(e.localWeekday)&&N(e.localWeekNumber)&&N(e.localWeekYear))return{minDaysInFirstWeek:4,startOfWeek:1};if(N(e.weekday)&&N(e.weekNumber)&&N(e.weekYear))return N(e.localWeekday)||(e.weekday=e.localWeekday),N(e.localWeekNumber)||(e.weekNumber=e.localWeekNumber),N(e.localWeekYear)||(e.weekYear=e.localWeekYear),delete e.localWeekday,delete e.localWeekNumber,delete e.localWeekYear,{minDaysInFirstWeek:t.getMinDaysInFirstWeek(),startOfWeek:t.getStartOfWeek()};throw new w("Cannot mix locale-based week fields with ISO-based week fields")}function ut(e){var t=ct(e.year),n=M(e.month,1,12),r=M(e.day,1,pt(e.year,e.month));return t?n?!r&&T("day",e.day):T("month",e.month):T("year",e.year)}function lt(e){var t=e.hour,n=e.minute,r=e.second,e=e.millisecond,i=M(t,0,23)||24===t&&0===n&&0===r&&0===e,o=M(n,0,59),a=M(r,0,59),s=M(e,0,999);return i?o?a?!s&&T("millisecond",e):T("second",r):T("minute",n):T("hour",t)}function N(e){return void 0===e}function v(e){return"number"==typeof e}function ct(e){return"number"==typeof e&&e%1==0}function ft(){try{return"undefined"!=typeof Intl&&!!Intl.RelativeTimeFormat}catch(e){return!1}}function dt(){try{return"undefined"!=typeof Intl&&!!Intl.Locale&&("weekInfo"in Intl.Locale.prototype||"getWeekInfo"in Intl.Locale.prototype)}catch(e){return!1}}function ht(e,n,r){if(0!==e.length)return e.reduce(function(e,t){t=[n(t),t];return e&&r(e[0],t[0])===e[0]?e:t},null)[1]}function h(e,t){return Object.prototype.hasOwnProperty.call(e,t)}function mt(e){if(null==e)return null;if("object"!=typeof e)throw new u("Week settings must be an object");if(M(e.firstDay,1,7)&&M(e.minimalDays,1,7)&&Array.isArray(e.weekend)&&!e.weekend.some(function(e){return!M(e,1,7)}))return{firstDay:e.firstDay,minimalDays:e.minimalDays,weekend:Array.from(e.weekend)};throw new u("Invalid week settings")}function M(e,t,n){return ct(e)&&t<=e&&e<=n}function m(e,t){void 0===t&&(t=2);e=e<0?"-"+(""+-e).padStart(t,"0"):(""+e).padStart(t,"0");return e}function g(e){if(!N(e)&&null!==e&&""!==e)return parseInt(e,10)}function p(e){if(!N(e)&&null!==e&&""!==e)return parseFloat(e)}function yt(e){if(!N(e)&&null!==e&&""!==e)return e=1e3*parseFloat("0."+e),Math.floor(e)}function vt(e,t,n){void 0===n&&(n="round");var r=Math.pow(10,t);switch(n){case"expand":return 0<e?Math.ceil(e*r)/r:Math.floor(e*r)/r;case"trunc":return Math.trunc(e*r)/r;case"round":return Math.round(e*r)/r;case"floor":return Math.floor(e*r)/r;case"ceil":return Math.ceil(e*r)/r;default:throw new RangeError("Value rounding "+n+" is out of range")}}function gt(e){return e%4==0&&(e%100!=0||e%400==0)}function D(e){return gt(e)?366:365}function pt(e,t){var n,r=(r=t-1)-(n=12)*Math.floor(r/n)+1;return 2==r?gt(e+(t-r)/12)?29:28:[31,null,31,30,31,30,31,31,30,31,30,31][r-1]}function kt(e){var t=Date.UTC(e.year,e.month-1,e.day,e.hour,e.minute,e.second,e.millisecond);return e.year<100&&0<=e.year&&(t=new Date(t)).setUTCFullYear(e.year,e.month-1,e.day),+t}function wt(e,t,n){return-nt(Xe(e,1,t),n)+t-1}function bt(e,t,n){var r=wt(e,t=void 0===t?4:t,n=void 0===n?1:n),t=wt(e+1,t,n);return(D(e)-r+t)/7}function St(e){return 99<e?e:e>O.twoDigitCutoffYear?1900+e:2e3+e}function Ot(e,t,n,r){void 0===r&&(r=null);var e=new Date(e),i={hourCycle:"h23",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"},r=(r&&(i.timeZone=r),l({timeZoneName:t},i)),t=new Intl.DateTimeFormat(n,r).formatToParts(e).find(function(e){return"timezonename"===e.type.toLowerCase()});return t?t.value:null}function Tt(e,t){e=parseInt(e,10),Number.isNaN(e)&&(e=0),t=parseInt(t,10)||0;return 60*e+(e<0||Object.is(e,-0)?-t:t)}function Nt(e){var t=Number(e);if("boolean"!=typeof e&&""!==e&&Number.isFinite(t))return t;throw new u("Invalid unit value "+e)}function Mt(e,t){var n,r,i={};for(n in e)h(e,n)&&null!=(r=e[n])&&(i[t(n)]=Nt(r));return i}function Dt(e,t){var n=Math.trunc(Math.abs(e/60)),r=Math.trunc(Math.abs(e%60)),i=0<=e?"+":"-";switch(t){case"short":return i+m(n,2)+":"+m(r,2);case"narrow":return i+n+(0<r?":"+r:"");case"techie":return i+m(n,2)+m(r,2);default:throw new RangeError("Value format "+t+" is out of range for property format")}}function It(e){return n=e,["hour","minute","second","millisecond"].reduce(function(e,t){return e[t]=n[t],e},{});var n}var Vt=["January","February","March","April","May","June","July","August","September","October","November","December"],Et=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],xt=["J","F","M","A","M","J","J","A","S","O","N","D"];function Ft(e){switch(e){case"narrow":return[].concat(xt);case"short":return[].concat(Et);case"long":return[].concat(Vt);case"numeric":return["1","2","3","4","5","6","7","8","9","10","11","12"];case"2-digit":return["01","02","03","04","05","06","07","08","09","10","11","12"];default:return null}}var Ct=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],Zt=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],Wt=["M","T","W","T","F","S","S"];function Lt(e){switch(e){case"narrow":return[].concat(Wt);case"short":return[].concat(Zt);case"long":return[].concat(Ct);case"numeric":return["1","2","3","4","5","6","7"];default:return null}}var jt=["AM","PM"],zt=["Before Christ","Anno Domini"],At=["BC","AD"],qt=["B","A"];function _t(e){switch(e){case"narrow":return[].concat(qt);case"short":return[].concat(At);case"long":return[].concat(zt);default:return null}}function Ut(e,t){for(var n="",r=R(e);!(i=r()).done;){var i=i.value;i.literal?n+=i.val:n+=t(i.val)}return n}var Rt={D:G,DD:$,DDD:Q,DDDD:K,t:X,tt:ee,ttt:te,tttt:ne,T:re,TT:ie,TTT:oe,TTTT:ae,f:se,ff:le,fff:de,ffff:me,F:ue,FF:ce,FFF:he,FFFF:ye},I=function(){function d(e,t){this.opts=t,this.loc=e,this.systemLoc=null}d.create=function(e,t){return new d(e,t=void 0===t?{}:t)},d.parseFormat=function(e){for(var t=null,n="",r=!1,i=[],o=0;o<e.length;o++){var a=e.charAt(o);"'"===a?((0<n.length||r)&&i.push({literal:r||/^\s+$/.test(n),val:""===n?"'":n}),t=null,n="",r=!r):r||a===t?n+=a:(0<n.length&&i.push({literal:/^\s+$/.test(n),val:n}),t=n=a)}return 0<n.length&&i.push({literal:r||/^\s+$/.test(n),val:n}),i},d.macroTokenToFormatOpts=function(e){return Rt[e]};var e=d.prototype;return e.formatWithSystemDefault=function(e,t){return null===this.systemLoc&&(this.systemLoc=this.loc.redefaultToSystem()),this.systemLoc.dtFormatter(e,l({},this.opts,t)).format()},e.dtFormatter=function(e,t){return this.loc.dtFormatter(e,l({},this.opts,t=void 0===t?{}:t))},e.formatDateTime=function(e,t){return this.dtFormatter(e,t).format()},e.formatDateTimeParts=function(e,t){return this.dtFormatter(e,t).formatToParts()},e.formatInterval=function(e,t){return this.dtFormatter(e.start,t).dtf.formatRange(e.start.toJSDate(),e.end.toJSDate())},e.resolvedOptions=function(e,t){return this.dtFormatter(e,t).resolvedOptions()},e.num=function(e,t,n){var r;return void 0===t&&(t=0),void 0===n&&(n=void 0),this.opts.forceSimple?m(e,t):(r=l({},this.opts),0<t&&(r.padTo=t),n&&(r.signDisplay=n),this.loc.numberFormatter(r).format(e))},e.formatDateTimeFromString=function(r,e){var n=this,i="en"===this.loc.listingMode(),t=this.loc.outputCalendar&&"gregory"!==this.loc.outputCalendar,o=function(e,t){return n.loc.extract(r,e,t)},a=function(e){return r.isOffsetFixed&&0===r.offset&&e.allowZ?"Z":r.isValid?r.zone.formatOffset(r.ts,e.format):""},s=function(){return i?jt[r.hour<12?0:1]:o({hour:"numeric",hourCycle:"h12"},"dayperiod")},u=function(e,t){return i?(n=r,Ft(e)[n.month-1]):o(t?{month:e}:{month:e,day:"numeric"},"month");var n},l=function(e,t){return i?(n=r,Lt(e)[n.weekday-1]):o(t?{weekday:e}:{weekday:e,month:"long",day:"numeric"},"weekday");var n},c=function(e){var t=d.macroTokenToFormatOpts(e);return t?n.formatWithSystemDefault(r,t):e},f=function(e){return i?(t=r,_t(e)[t.year<0?0:1]):o({era:e},"era");var t};return Ut(d.parseFormat(e),function(e){switch(e){case"S":return n.num(r.millisecond);case"u":case"SSS":return n.num(r.millisecond,3);case"s":return n.num(r.second);case"ss":return n.num(r.second,2);case"uu":return n.num(Math.floor(r.millisecond/10),2);case"uuu":return n.num(Math.floor(r.millisecond/100));case"m":return n.num(r.minute);case"mm":return n.num(r.minute,2);case"h":return n.num(r.hour%12==0?12:r.hour%12);case"hh":return n.num(r.hour%12==0?12:r.hour%12,2);case"H":return n.num(r.hour);case"HH":return n.num(r.hour,2);case"Z":return a({format:"narrow",allowZ:n.opts.allowZ});case"ZZ":return a({format:"short",allowZ:n.opts.allowZ});case"ZZZ":return a({format:"techie",allowZ:n.opts.allowZ});case"ZZZZ":return r.zone.offsetName(r.ts,{format:"short",locale:n.loc.locale});case"ZZZZZ":return r.zone.offsetName(r.ts,{format:"long",locale:n.loc.locale});case"z":return r.zoneName;case"a":return s();case"d":return t?o({day:"numeric"},"day"):n.num(r.day);case"dd":return t?o({day:"2-digit"},"day"):n.num(r.day,2);case"c":return n.num(r.weekday);case"ccc":return l("short",!0);case"cccc":return l("long",!0);case"ccccc":return l("narrow",!0);case"E":return n.num(r.weekday);case"EEE":return l("short",!1);case"EEEE":return l("long",!1);case"EEEEE":return l("narrow",!1);case"L":return t?o({month:"numeric",day:"numeric"},"month"):n.num(r.month);case"LL":return t?o({month:"2-digit",day:"numeric"},"month"):n.num(r.month,2);case"LLL":return u("short",!0);case"LLLL":return u("long",!0);case"LLLLL":return u("narrow",!0);case"M":return t?o({month:"numeric"},"month"):n.num(r.month);case"MM":return t?o({month:"2-digit"},"month"):n.num(r.month,2);case"MMM":return u("short",!1);case"MMMM":return u("long",!1);case"MMMMM":return u("narrow",!1);case"y":return t?o({year:"numeric"},"year"):n.num(r.year);case"yy":return t?o({year:"2-digit"},"year"):n.num(r.year.toString().slice(-2),2);case"yyyy":return t?o({year:"numeric"},"year"):n.num(r.year,4);case"yyyyyy":return t?o({year:"numeric"},"year"):n.num(r.year,6);case"G":return f("short");case"GG":return f("long");case"GGGGG":return f("narrow");case"kk":return n.num(r.weekYear.toString().slice(-2),2);case"kkkk":return n.num(r.weekYear,4);case"W":return n.num(r.weekNumber);case"WW":return n.num(r.weekNumber,2);case"n":return n.num(r.localWeekNumber);case"nn":return n.num(r.localWeekNumber,2);case"ii":return n.num(r.localWeekYear.toString().slice(-2),2);case"iiii":return n.num(r.localWeekYear,4);case"o":return n.num(r.ordinal);case"ooo":return n.num(r.ordinal,3);case"q":return n.num(r.quarter);case"qq":return n.num(r.quarter,2);case"X":return n.num(Math.floor(r.ts/1e3));case"x":return n.num(r.ts);default:return c(e)}})},e.formatDurationFromString=function(e,t){var i,o,a=this,s="negativeLargestOnly"===this.opts.signMode?-1:1,u=function(e){switch(e[0]){case"S":return"milliseconds";case"s":return"seconds";case"m":return"minutes";case"h":return"hours";case"d":return"days";case"w":return"weeks";case"M":return"months";case"y":return"years";default:return null}},t=d.parseFormat(t),n=t.reduce(function(e,t){var n=t.literal,t=t.val;return n?e:e.concat(t)},[]),e=e.shiftTo.apply(e,n.map(u).filter(function(e){return e})),n={isNegativeDuration:e<0,largestUnit:Object.keys(e.values)[0]};return Ut(t,(i=e,o=n,function(e){var t,n,r=u(e);return r?(t=o.isNegativeDuration&&r!==o.largestUnit?s:1,n="negativeLargestOnly"===a.opts.signMode&&r!==o.largestUnit?"never":"all"===a.opts.signMode?"always":"auto",a.num(i.get(r)*t,e.length,n)):e}))},d}(),r=/[A-Za-z_+-]{1,256}(?::?\/[A-Za-z0-9_+-]{1,256}(?:\/[A-Za-z0-9_+-]{1,256})?)?/;function Pt(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var r=t.reduce(function(e,t){return e+t.source},"");return RegExp("^"+r+"$")}function Yt(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(o){return t.reduce(function(e,t){var n=e[0],r=e[1],e=e[2],t=t(o,e),e=t[0],i=t[1],t=t[2];return[l({},n,e),i||r,t]},[{},null,1]).slice(0,2)}}function Ht(e){if(null!=e){for(var t=arguments.length,n=new Array(1<t?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];for(var i=0,o=n;i<o.length;i++){var a=o[i],s=a[0],a=a[1],s=s.exec(e);if(s)return a(s)}}return[null,null]}function Jt(){for(var e=arguments.length,i=new Array(e),t=0;t<e;t++)i[t]=arguments[t];return function(e,t){for(var n={},r=0;r<i.length;r++)n[i[r]]=g(e[t+r]);return[n,null,t+r]}}var t=/(?:([Zz])|([+-]\d\d)(?::?(\d\d))?)/,a=/(\d\d)(?::?(\d\d)(?::?(\d\d)(?:[.,](\d{1,30}))?)?)?/,Gt=RegExp(a.source+("(?:"+t.source+"?(?:\\[("+r.source+")\\])?)?")),k=RegExp("(?:[Tt]"+Gt.source+")?"),$t=Jt("weekYear","weekNumber","weekDay"),Bt=Jt("year","ordinal"),t=RegExp(a.source+" ?(?:"+t.source+"|("+r.source+"))?"),r=RegExp("(?: "+t.source+")?");function Qt(e,t,n){e=e[t];return N(e)?n:g(e)}function Kt(e,t){return[{hours:Qt(e,t,0),minutes:Qt(e,t+1,0),seconds:Qt(e,t+2,0),milliseconds:yt(e[t+3])},null,t+4]}function Xt(e,t){var n=!e[t]&&!e[t+1],e=Tt(e[t+1],e[t+2]);return[{},n?null:f.instance(e),t+3]}function en(e,t){return[{},e[t]?c.create(e[t]):null,t+1]}var tn=RegExp("^T?"+a.source+"$"),nn=/^-?P(?:(?:(-?\d{1,20}(?:\.\d{1,20})?)Y)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20}(?:\.\d{1,20})?)W)?(?:(-?\d{1,20}(?:\.\d{1,20})?)D)?(?:T(?:(-?\d{1,20}(?:\.\d{1,20})?)H)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20})(?:[.,](-?\d{1,20}))?S)?)?)$/;function rn(e){function t(e,t){return void 0===t&&(t=!1),void 0!==e&&(t||e&&c)?-e:e}var n=e[0],r=e[1],i=e[2],o=e[3],a=e[4],s=e[5],u=e[6],l=e[7],e=e[8],c="-"===n[0],n=l&&"-"===l[0];return[{years:t(p(r)),months:t(p(i)),weeks:t(p(o)),days:t(p(a)),hours:t(p(s)),minutes:t(p(u)),seconds:t(p(l),"-0"===l),milliseconds:t(yt(e),n)}]}var on={GMT:0,EDT:-240,EST:-300,CDT:-300,CST:-360,MDT:-360,MST:-420,PDT:-420,PST:-480};function an(e,t,n,r,i,o,a){t={year:2===t.length?St(g(t)):g(t),month:Et.indexOf(n)+1,day:g(r),hour:g(i),minute:g(o)};return a&&(t.second=g(a)),e&&(t.weekday=3<e.length?Ct.indexOf(e)+1:Zt.indexOf(e)+1),t}var sn=/^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|(?:([+-]\d\d)(\d\d)))$/;function un(e){var t=e[1],n=e[2],r=e[3],i=e[4],o=e[5],a=e[6],s=e[7],u=e[8],l=e[9],c=e[10],e=e[11],t=an(t,i,r,n,o,a,s),i=u?on[u]:l?0:Tt(c,e);return[t,new f(i)]}var ln=/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d\d) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d\d):(\d\d):(\d\d) GMT$/,cn=/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d\d)-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d\d) (\d\d):(\d\d):(\d\d) GMT$/,fn=/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( \d|\d\d) (\d\d):(\d\d):(\d\d) (\d{4})$/;function dn(e){var t=e[1],n=e[2],r=e[3];return[an(t,e[4],r,n,e[5],e[6],e[7]),f.utcInstance]}function hn(e){var t=e[1],n=e[2],r=e[3],i=e[4],o=e[5],a=e[6];return[an(t,e[7],n,r,i,o,a),f.utcInstance]}var mn=Pt(/([+-]\d{6}|\d{4})(?:-?(\d\d)(?:-?(\d\d))?)?/,k),yn=Pt(/(\d{4})-?W(\d\d)(?:-?(\d))?/,k),vn=Pt(/(\d{4})-?(\d{3})/,k),gn=Pt(Gt),pn=Yt(function(e,t){return[{year:Qt(e,t),month:Qt(e,t+1,1),day:Qt(e,t+2,1)},null,t+3]},Kt,Xt,en),kn=Yt($t,Kt,Xt,en),wn=Yt(Bt,Kt,Xt,en),bn=Yt(Kt,Xt,en);var Sn=Yt(Kt);var On=Pt(/(\d{4})-(\d\d)-(\d\d)/,r),Tn=Pt(t),Nn=Yt(Kt,Xt,en);var Mn="Invalid Duration",a={weeks:{days:7,hours:168,minutes:10080,seconds:604800,milliseconds:6048e5},days:{hours:24,minutes:1440,seconds:86400,milliseconds:864e5},hours:{minutes:60,seconds:3600,milliseconds:36e5},minutes:{seconds:60,milliseconds:6e4},seconds:{milliseconds:1e3}},Dn=l({years:{quarters:4,months:12,weeks:52,days:365,hours:8760,minutes:525600,seconds:31536e3,milliseconds:31536e6},quarters:{months:3,weeks:13,days:91,hours:2184,minutes:131040,seconds:7862400,milliseconds:78624e5},months:{weeks:4,days:30,hours:720,minutes:43200,seconds:2592e3,milliseconds:2592e6}},a),k=365.2425,Gt=30.436875,In=l({years:{quarters:4,months:12,weeks:k/7,days:k,hours:24*k,minutes:525949.2,seconds:525949.2*60,milliseconds:525949.2*60*1e3},quarters:{months:3,weeks:k/28,days:k/4,hours:24*k/4,minutes:131487.3,seconds:525949.2*60/4,milliseconds:7889237999.999999},months:{weeks:Gt/7,days:Gt,hours:24*Gt,minutes:43829.1,seconds:2629746,milliseconds:2629746e3}},a),V=["years","quarters","months","weeks","days","hours","minutes","seconds","milliseconds"],Vn=V.slice(0).reverse();function E(e,t,n){n={values:(n=void 0===n?!1:n)?t.values:l({},e.values,t.values||{}),loc:e.loc.clone(t.loc),conversionAccuracy:t.conversionAccuracy||e.conversionAccuracy,matrix:t.matrix||e.matrix};return new x(n)}function En(e,t){for(var n,r=null!=(n=t.milliseconds)?n:0,i=R(Vn.slice(1));!(o=i()).done;){var o=o.value;t[o]&&(r+=t[o]*e[o].milliseconds)}return r}function xn(i,o){var a=En(i,o)<0?-1:1;V.reduceRight(function(e,t){var n,r;return N(o[t])?e:(e&&(r=o[e]*a,n=i[t][e],r=Math.floor(r/n),o[t]+=r*a,o[e]-=r*n*a),t)},null),V.reduce(function(e,t){var n;return N(o[t])?e:(e&&(n=o[e]%1,o[e]-=n,o[t]+=n*i[e][t]),t)},null)}function Fn(e){for(var t={},n=0,r=Object.entries(e);n<r.length;n++){var i=r[n],o=i[0],i=i[1];0!==i&&(t[o]=i)}return t}var x=function(e){function m(e){var t="longterm"===e.conversionAccuracy||!1,n=t?In:Dn;e.matrix&&(n=e.matrix),this.values=e.values,this.loc=e.loc||b.create(),this.conversionAccuracy=t?"longterm":"casual",this.invalid=e.invalid||null,this.matrix=n,this.isLuxonDuration=!0}m.fromMillis=function(e,t){return m.fromObject({milliseconds:e},t)},m.fromObject=function(e,t){if(void 0===t&&(t={}),null==e||"object"!=typeof e)throw new u("Duration.fromObject: argument expected to be an object, got "+(null===e?"null":typeof e));return new m({values:Mt(e,m.normalizeUnit),loc:b.fromObject(t),conversionAccuracy:t.conversionAccuracy,matrix:t.matrix})},m.fromDurationLike=function(e){if(v(e))return m.fromMillis(e);if(m.isDuration(e))return e;if("object"==typeof e)return m.fromObject(e);throw new u("Unknown duration argument "+e+" of type "+typeof e)},m.fromISO=function(e,t){var n=Ht(e,[nn,rn])[0];return n?m.fromObject(n,t):m.invalid("unparsable",'the input "'+e+"\" can't be parsed as ISO 8601")},m.fromISOTime=function(e,t){var n=Ht(e,[tn,Sn])[0];return n?m.fromObject(n,t):m.invalid("unparsable",'the input "'+e+"\" can't be parsed as ISO 8601")},m.invalid=function(e,t){if(void 0===t&&(t=null),!e)throw new u("need to specify a reason the Duration is invalid");e=e instanceof d?e:new d(e,t);if(O.throwOnInvalid)throw new H(e);return new m({invalid:e})},m.normalizeUnit=function(e){var t={year:"years",years:"years",quarter:"quarters",quarters:"quarters",month:"months",months:"months",week:"weeks",weeks:"weeks",day:"days",days:"days",hour:"hours",hours:"hours",minute:"minutes",minutes:"minutes",second:"seconds",seconds:"seconds",millisecond:"milliseconds",milliseconds:"milliseconds"}[e&&e.toLowerCase()];if(t)return t;throw new J(e)},m.isDuration=function(e){return e&&e.isLuxonDuration||!1};var t=m.prototype;return t.toFormat=function(e,t){t=l({},t=void 0===t?{}:t,{floor:!1!==t.round&&!1!==t.floor});return this.isValid?I.create(this.loc,t).formatDurationFromString(this,e):Mn},t.toHuman=function(n){var r,e,i=this;return void 0===n&&(n={}),this.isValid?(r=!1!==n.showZeros,e=V.map(function(e){var t=i.values[e];return N(t)||0===t&&!r?null:i.loc.numberFormatter(l({style:"unit",unitDisplay:"long"},n,{unit:e.slice(0,-1)})).format(t)}).filter(function(e){return e}),this.loc.listFormatter(l({type:"conjunction",style:n.listStyle||"narrow"},n)).format(e)):Mn},t.toObject=function(){return this.isValid?l({},this.values):{}},t.toISO=function(){var e;return this.isValid?(e="P",0!==this.years&&(e+=this.years+"Y"),0===this.months&&0===this.quarters||(e+=this.months+3*this.quarters+"M"),0!==this.weeks&&(e+=this.weeks+"W"),0!==this.days&&(e+=this.days+"D"),0===this.hours&&0===this.minutes&&0===this.seconds&&0===this.milliseconds||(e+="T"),0!==this.hours&&(e+=this.hours+"H"),0!==this.minutes&&(e+=this.minutes+"M"),0===this.seconds&&0===this.milliseconds||(e+=vt(this.seconds+this.milliseconds/1e3,3)+"S"),"P"===e&&(e+="T0S"),e):null},t.toISOTime=function(e){var t;return void 0===e&&(e={}),!this.isValid||(t=this.toMillis())<0||864e5<=t?null:(e=l({suppressMilliseconds:!1,suppressSeconds:!1,includePrefix:!1,format:"extended"},e,{includeOffset:!1}),W.fromMillis(t,{zone:"UTC"}).toISOTime(e))},t.toJSON=function(){return this.toISO()},t.toString=function(){return this.toISO()},t[e]=function(){return this.isValid?"Duration { values: "+JSON.stringify(this.values)+" }":"Duration { Invalid, reason: "+this.invalidReason+" }"},t.toMillis=function(){return this.isValid?En(this.matrix,this.values):NaN},t.valueOf=function(){return this.toMillis()},t.plus=function(e){if(!this.isValid)return this;for(var t=m.fromDurationLike(e),n={},r=0,i=V;r<i.length;r++){var o=i[r];(h(t.values,o)||h(this.values,o))&&(n[o]=t.get(o)+this.get(o))}return E(this,{values:n},!0)},t.minus=function(e){return this.isValid?(e=m.fromDurationLike(e),this.plus(e.negate())):this},t.mapUnits=function(e){if(!this.isValid)return this;for(var t={},n=0,r=Object.keys(this.values);n<r.length;n++){var i=r[n];t[i]=Nt(e(this.values[i],i))}return E(this,{values:t},!0)},t.get=function(e){return this[m.normalizeUnit(e)]},t.set=function(e){return this.isValid?E(this,{values:l({},this.values,Mt(e,m.normalizeUnit))}):this},t.reconfigure=function(e){var e=void 0===e?{}:e,t=e.locale,n=e.numberingSystem,r=e.conversionAccuracy,e=e.matrix,t=this.loc.clone({locale:t,numberingSystem:n});return E(this,{loc:t,matrix:e,conversionAccuracy:r})},t.as=function(e){return this.isValid?this.shiftTo(e).get(e):NaN},t.normalize=function(){var e;return this.isValid?(e=this.toObject(),xn(this.matrix,e),E(this,{values:e},!0)):this},t.rescale=function(){var e;return this.isValid?(e=Fn(this.normalize().shiftToAll().toObject()),E(this,{values:e},!0)):this},t.shiftTo=function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];if(!this.isValid)return this;if(0===t.length)return this;for(var r,t=t.map(function(e){return m.normalizeUnit(e)}),i={},o={},a=this.toObject(),s=0,u=V;s<u.length;s++){var l=u[s];if(0<=t.indexOf(l)){var c,f=l,d=0;for(c in o)d+=this.matrix[c][l]*o[c],o[c]=0;v(a[l])&&(d+=a[l]);var h=Math.trunc(d);o[l]=(1e3*d-1e3*(i[l]=h))/1e3}else v(a[l])&&(o[l]=a[l])}for(r in o)0!==o[r]&&(i[f]+=r===f?o[r]:o[r]/this.matrix[f][r]);return xn(this.matrix,i),E(this,{values:i},!0)},t.shiftToAll=function(){return this.isValid?this.shiftTo("years","months","weeks","days","hours","minutes","seconds","milliseconds"):this},t.negate=function(){if(!this.isValid)return this;for(var e={},t=0,n=Object.keys(this.values);t<n.length;t++){var r=n[t];e[r]=0===this.values[r]?0:-this.values[r]}return E(this,{values:e},!0)},t.removeZeros=function(){return this.isValid?E(this,{values:Fn(this.values)},!0):this},t.equals=function(e){if(!this.isValid||!e.isValid)return!1;if(!this.loc.equals(e.loc))return!1;for(var t,n=0,r=V;n<r.length;n++){var i=r[n];if(t=this.values[i],i=e.values[i],!(void 0===t||0===t?void 0===i||0===i:t===i))return!1}return!0},i(m,[{key:"locale",get:function(){return this.isValid?this.loc.locale:null}},{key:"numberingSystem",get:function(){return this.isValid?this.loc.numberingSystem:null}},{key:"years",get:function(){return this.isValid?this.values.years||0:NaN}},{key:"quarters",get:function(){return this.isValid?this.values.quarters||0:NaN}},{key:"months",get:function(){return this.isValid?this.values.months||0:NaN}},{key:"weeks",get:function(){return this.isValid?this.values.weeks||0:NaN}},{key:"days",get:function(){return this.isValid?this.values.days||0:NaN}},{key:"hours",get:function(){return this.isValid?this.values.hours||0:NaN}},{key:"minutes",get:function(){return this.isValid?this.values.minutes||0:NaN}},{key:"seconds",get:function(){return this.isValid?this.values.seconds||0:NaN}},{key:"milliseconds",get:function(){return this.isValid?this.values.milliseconds||0:NaN}},{key:"isValid",get:function(){return null===this.invalid}},{key:"invalidReason",get:function(){return this.invalid?this.invalid.reason:null}},{key:"invalidExplanation",get:function(){return this.invalid?this.invalid.explanation:null}}]),m}(Symbol.for("nodejs.util.inspect.custom")),Cn="Invalid Interval";var Zn=function(e){function l(e){this.s=e.start,this.e=e.end,this.invalid=e.invalid||null,this.isLuxonInterval=!0}l.invalid=function(e,t){if(void 0===t&&(t=null),!e)throw new u("need to specify a reason the Interval is invalid");e=e instanceof d?e:new d(e,t);if(O.throwOnInvalid)throw new Y(e);return new l({invalid:e})},l.fromDateTimes=function(e,t){var n,e=Or(e),t=Or(t),r=(n=t,(r=e)&&r.isValid?n&&n.isValid?n<r?Zn.invalid("end before start","The end of an interval must be after its start, but you had start="+r.toISO()+" and end="+n.toISO()):null:Zn.invalid("missing or invalid end"):Zn.invalid("missing or invalid start"));return null==r?new l({start:e,end:t}):r},l.after=function(e,t){t=x.fromDurationLike(t),e=Or(e);return l.fromDateTimes(e,e.plus(t))},l.before=function(e,t){t=x.fromDurationLike(t),e=Or(e);return l.fromDateTimes(e.minus(t),e)},l.fromISO=function(e,t){var n,r,i,o=(e||"").split("/",2),a=o[0],s=o[1];if(a&&s){try{u=(n=W.fromISO(a,t)).isValid}catch(s){u=!1}try{i=(r=W.fromISO(s,t)).isValid}catch(s){i=!1}if(u&&i)return l.fromDateTimes(n,r);if(u){o=x.fromISO(s,t);if(o.isValid)return l.after(n,o)}else if(i){var u=x.fromISO(a,t);if(u.isValid)return l.before(r,u)}}return l.invalid("unparsable",'the input "'+e+"\" can't be parsed as ISO 8601")},l.isInterval=function(e){return e&&e.isLuxonInterval||!1};var t=l.prototype;return t.length=function(e){return void 0===e&&(e="milliseconds"),this.isValid?this.toDuration.apply(this,[e]).get(e):NaN},t.count=function(e,t){var n,r;return this.isValid?(n=this.start.startOf(e=void 0===e?"milliseconds":e,t),r=(r=null!=t&&t.useLocaleWeeks?this.end.reconfigure({locale:n.locale}):this.end).startOf(e,t),Math.floor(r.diff(n,e).get(e))+(r.valueOf()!==this.end.valueOf())):NaN},t.hasSame=function(e){return!!this.isValid&&(this.isEmpty()||this.e.minus(1).hasSame(this.s,e))},t.isEmpty=function(){return this.s.valueOf()===this.e.valueOf()},t.isAfter=function(e){return!!this.isValid&&this.s>e},t.isBefore=function(e){return!!this.isValid&&this.e<=e},t.contains=function(e){return!!this.isValid&&this.s<=e&&this.e>e},t.set=function(e){var e=void 0===e?{}:e,t=e.start,e=e.end;return this.isValid?l.fromDateTimes(t||this.s,e||this.e):this},t.splitAt=function(){var t=this;if(!this.isValid)return[];for(var e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];for(var i=n.map(Or).filter(function(e){return t.contains(e)}).sort(function(e,t){return e.toMillis()-t.toMillis()}),o=[],a=this.s,s=0;a<this.e;){var u=i[s]||this.e,u=+u>+this.e?this.e:u;o.push(l.fromDateTimes(a,u)),a=u,s+=1}return o},t.splitBy=function(e){var t=x.fromDurationLike(e);if(!this.isValid||!t.isValid||0===t.as("milliseconds"))return[];for(var n=this.s,r=1,i=[];n<this.e;){var o=this.start.plus(t.mapUnits(function(e){return e*r})),o=+o>+this.e?this.e:o;i.push(l.fromDateTimes(n,o)),n=o,r+=1}return i},t.divideEqually=function(e){return this.isValid?this.splitBy(this.length()/e).slice(0,e):[]},t.overlaps=function(e){return this.e>e.s&&this.s<e.e},t.abutsStart=function(e){return!!this.isValid&&+this.e==+e.s},t.abutsEnd=function(e){return!!this.isValid&&+e.e==+this.s},t.engulfs=function(e){return!!this.isValid&&this.s<=e.s&&this.e>=e.e},t.equals=function(e){return!(!this.isValid||!e.isValid)&&this.s.equals(e.s)&&this.e.equals(e.e)},t.intersection=function(e){var t;return this.isValid?(t=(this.s>e.s?this:e).s,(e=(this.e<e.e?this:e).e)<=t?null:l.fromDateTimes(t,e)):this},t.union=function(e){var t;return this.isValid?(t=(this.s<e.s?this:e).s,e=(this.e>e.e?this:e).e,l.fromDateTimes(t,e)):this},l.merge=function(e){var e=e.sort(function(e,t){return e.s-t.s}).reduce(function(e,t){var n=e[0],e=e[1];return e?e.overlaps(t)||e.abutsStart(t)?[n,e.union(t)]:[n.concat([e]),t]:[n,t]},[[],null]),t=e[0],e=e[1];return e&&t.push(e),t},l.xor=function(e){for(var t,n=null,r=0,i=[],e=e.map(function(e){return[{time:e.s,type:"s"},{time:e.e,type:"e"}]}),o=R((t=Array.prototype).concat.apply(t,e).sort(function(e,t){return e.time-t.time}));!(a=o()).done;)var a=a.value,n=1===(r+="s"===a.type?1:-1)?a.time:(n&&+n!=+a.time&&i.push(l.fromDateTimes(n,a.time)),null);return l.merge(i)},t.difference=function(){for(var t=this,e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];return l.xor([this].concat(n)).map(function(e){return t.intersection(e)}).filter(function(e){return e&&!e.isEmpty()})},t.toString=function(){return this.isValid?"["+this.s.toISO()+" – "+this.e.toISO()+")":Cn},t[e]=function(){return this.isValid?"Interval { start: "+this.s.toISO()+", end: "+this.e.toISO()+" }":"Interval { Invalid, reason: "+this.invalidReason+" }"},t.toLocaleString=function(e,t){return void 0===e&&(e=G),void 0===t&&(t={}),this.isValid?I.create(this.s.loc.clone(t),e).formatInterval(this):Cn},t.toISO=function(e){return this.isValid?this.s.toISO(e)+"/"+this.e.toISO(e):Cn},t.toISODate=function(){return this.isValid?this.s.toISODate()+"/"+this.e.toISODate():Cn},t.toISOTime=function(e){return this.isValid?this.s.toISOTime(e)+"/"+this.e.toISOTime(e):Cn},t.toFormat=function(e,t){t=(void 0===t?{}:t).separator,t=void 0===t?" – ":t;return this.isValid?""+this.s.toFormat(e)+t+this.e.toFormat(e):Cn},t.toDuration=function(e,t){return this.isValid?this.e.diff(this.s,e,t):x.invalid(this.invalidReason)},t.mapEndpoints=function(e){return l.fromDateTimes(e(this.s),e(this.e))},i(l,[{key:"start",get:function(){return this.isValid?this.s:null}},{key:"end",get:function(){return this.isValid?this.e:null}},{key:"lastDateTime",get:function(){return this.isValid&&this.e?this.e.minus(1):null}},{key:"isValid",get:function(){return null===this.invalidReason}},{key:"invalidReason",get:function(){return this.invalid?this.invalid.reason:null}},{key:"invalidExplanation",get:function(){return this.invalid?this.invalid.explanation:null}}]),l}(Symbol.for("nodejs.util.inspect.custom")),Wn=function(){function e(){}return e.hasDST=function(e){void 0===e&&(e=O.defaultZone);var t=W.now().setZone(e).set({month:12});return!e.isUniversal&&t.offset!==t.set({month:6}).offset},e.isValidIANAZone=function(e){return c.isValidZone(e)},e.normalizeZone=function(e){return S(e,O.defaultZone)},e.getStartOfWeek=function(e){var e=void 0===e?{}:e,t=e.locale,e=e.locObj;return((void 0===e?null:e)||b.create(void 0===t?null:t)).getStartOfWeek()},e.getMinimumDaysInFirstWeek=function(e){var e=void 0===e?{}:e,t=e.locale,e=e.locObj;return((void 0===e?null:e)||b.create(void 0===t?null:t)).getMinDaysInFirstWeek()},e.getWeekendWeekdays=function(e){var e=void 0===e?{}:e,t=e.locale,e=e.locObj;return((void 0===e?null:e)||b.create(void 0===t?null:t)).getWeekendDays().slice()},e.months=function(e,t){void 0===e&&(e="long");var t=void 0===t?{}:t,n=t.locale,r=t.numberingSystem,i=t.locObj,i=void 0===i?null:i,t=t.outputCalendar;return(i||b.create(void 0===n?null:n,void 0===r?null:r,void 0===t?"gregory":t)).months(e)},e.monthsFormat=function(e,t){void 0===e&&(e="long");var t=void 0===t?{}:t,n=t.locale,r=t.numberingSystem,i=t.locObj,i=void 0===i?null:i,t=t.outputCalendar;return(i||b.create(void 0===n?null:n,void 0===r?null:r,void 0===t?"gregory":t)).months(e,!0)},e.weekdays=function(e,t){void 0===e&&(e="long");var t=void 0===t?{}:t,n=t.locale,r=t.numberingSystem,t=t.locObj;return((void 0===t?null:t)||b.create(void 0===n?null:n,void 0===r?null:r,null)).weekdays(e)},e.weekdaysFormat=function(e,t){void 0===e&&(e="long");var t=void 0===t?{}:t,n=t.locale,r=t.numberingSystem,t=t.locObj;return((void 0===t?null:t)||b.create(void 0===n?null:n,void 0===r?null:r,null)).weekdays(e,!0)},e.meridiems=function(e){e=(void 0===e?{}:e).locale;return b.create(void 0===e?null:e).meridiems()},e.eras=function(e,t){void 0===e&&(e="short");t=(void 0===t?{}:t).locale;return b.create(void 0===t?null:t,null,"gregory").eras(e)},e.features=function(){return{relative:ft(),localeWeek:dt()}},e}();function Ln(e,t){function n(e){return e.toUTC(0,{keepLocalTime:!0}).startOf("day").valueOf()}t=n(t)-n(e);return Math.floor(x.fromMillis(t).as("days"))}function jn(e,t,n,r){var e=function(e,t,n){for(var r,i,o={},a=e,s=0,u=[["years",function(e,t){return t.year-e.year}],["quarters",function(e,t){return t.quarter-e.quarter+4*(t.year-e.year)}],["months",function(e,t){return t.month-e.month+12*(t.year-e.year)}],["weeks",function(e,t){e=Ln(e,t);return(e-e%7)/7}],["days",Ln]];s<u.length;s++){var l=u[s],c=l[0],l=l[1];0<=n.indexOf(c)&&(o[r=c]=l(e,t),t<(i=a.plus(o))?(o[c]--,t<(e=a.plus(o))&&(i=e,o[c]--,e=a.plus(o))):e=i)}return[e,o,i,r]}(e,t,n),i=e[0],o=e[1],a=e[2],e=e[3],s=t-i,n=n.filter(function(e){return 0<=["hours","minutes","seconds","milliseconds"].indexOf(e)}),t=(0===n.length&&(a=a<t?i.plus(((t={})[e]=1,t)):a)!==i&&(o[e]=(o[e]||0)+s/(a-i)),x.fromObject(o,r));return 0<n.length?(e=x.fromMillis(s,r)).shiftTo.apply(e,n).plus(t):t}var zn="missing Intl.DateTimeFormat.formatToParts support";function F(e,t){return void 0===t&&(t=function(e){return e}),{regex:e,deser:function(e){e=e[0];return t(function(e){var t=parseInt(e,10);if(isNaN(t)){for(var t="",n=0;n<e.length;n++){var r=e.charCodeAt(n);if(-1!==e[n].search(Ae.hanidec))t+=_e.indexOf(e[n]);else for(var i in qe){var i=qe[i],o=i[0],i=i[1];o<=r&&r<=i&&(t+=r-o)}}return parseInt(t,10)}return t}(e))}}}var An="[ "+String.fromCharCode(160)+"]",qn=new RegExp(An,"g");function _n(e){return e.replace(/\./g,"\\.?").replace(qn,An)}function Un(e){return e.replace(/\./g,"").replace(qn," ").toLowerCase()}function C(n,r){return null===n?null:{regex:RegExp(n.map(_n).join("|")),deser:function(e){var t=e[0];return n.findIndex(function(e){return Un(t)===Un(e)})+r}}}function Rn(e,t){return{regex:e,deser:function(e){return Tt(e[1],e[2])},groups:t}}function Pn(e){return{regex:e,deser:function(e){return e[0]}}}function Yn(t,n){function r(e){return{regex:RegExp(e.val.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")),deser:function(e){return e[0]},literal:!0}}var i=y(n),o=y(n,"{2}"),a=y(n,"{3}"),s=y(n,"{4}"),u=y(n,"{6}"),l=y(n,"{1,2}"),c=y(n,"{1,3}"),f=y(n,"{1,6}"),d=y(n,"{1,9}"),h=y(n,"{2,4}"),m=y(n,"{4,6}"),e=function(e){if(t.literal)return r(e);switch(e.val){case"G":return C(n.eras("short"),0);case"GG":return C(n.eras("long"),0);case"y":return F(f);case"yy":return F(h,St);case"yyyy":return F(s);case"yyyyy":return F(m);case"yyyyyy":return F(u);case"M":return F(l);case"MM":return F(o);case"MMM":return C(n.months("short",!0),1);case"MMMM":return C(n.months("long",!0),1);case"L":return F(l);case"LL":return F(o);case"LLL":return C(n.months("short",!1),1);case"LLLL":return C(n.months("long",!1),1);case"d":return F(l);case"dd":return F(o);case"o":return F(c);case"ooo":return F(a);case"HH":return F(o);case"H":return F(l);case"hh":return F(o);case"h":return F(l);case"mm":return F(o);case"m":case"q":return F(l);case"qq":return F(o);case"s":return F(l);case"ss":return F(o);case"S":return F(c);case"SSS":return F(a);case"u":return Pn(d);case"uu":return Pn(l);case"uuu":return F(i);case"a":return C(n.meridiems(),0);case"kkkk":return F(s);case"kk":return F(h,St);case"W":return F(l);case"WW":return F(o);case"E":case"c":return F(i);case"EEE":return C(n.weekdays("short",!1),1);case"EEEE":return C(n.weekdays("long",!1),1);case"ccc":return C(n.weekdays("short",!0),1);case"cccc":return C(n.weekdays("long",!0),1);case"Z":case"ZZ":return Rn(new RegExp("([+-]"+l.source+")(?::("+o.source+"))?"),2);case"ZZZ":return Rn(new RegExp("([+-]"+l.source+")("+o.source+")?"),2);case"z":return Pn(/[a-z_+-/]{1,256}?/i);case" ":return Pn(/[^\S\n\r]/);default:return r(e)}}(t)||{invalidReason:zn};return e.token=t,e}var Hn={year:{"2-digit":"yy",numeric:"yyyyy"},month:{numeric:"M","2-digit":"MM",short:"MMM",long:"MMMM"},day:{numeric:"d","2-digit":"dd"},weekday:{short:"EEE",long:"EEEE"},dayperiod:"a",dayPeriod:"a",hour12:{numeric:"h","2-digit":"hh"},hour24:{numeric:"H","2-digit":"HH"},minute:{numeric:"m","2-digit":"mm"},second:{numeric:"s","2-digit":"ss"},timeZoneName:{long:"ZZZZZ",short:"ZZZ"}};var Jn=null;function Gn(e,n){var t;return(t=Array.prototype).concat.apply(t,e.map(function(e){return t=n,(e=e).literal||null==(t=Qn(I.macroTokenToFormatOpts(e.val),t))||t.includes(void 0)?e:t;var t}))}var $n=function(){function e(t,e){var n;this.locale=t,this.format=e,this.tokens=Gn(I.parseFormat(e),t),this.units=this.tokens.map(function(e){return Yn(e,t)}),this.disqualifyingUnit=this.units.find(function(e){return e.invalidReason}),this.disqualifyingUnit||(n=(e=["^"+(e=this.units).map(function(e){return e.regex}).reduce(function(e,t){return e+"("+t.source+")"},"")+"$",e])[1],this.regex=RegExp(e[0],"i"),this.handlers=n)}return e.prototype.explainFromTokens=function(e){if(this.isValid){var t=function(e,t,n){var r=e.match(t);if(r){var i,o,a,s={},u=1;for(i in n)h(n,i)&&(a=(o=n[i]).groups?o.groups+1:1,!o.literal&&o.token&&(s[o.token.val[0]]=o.deser(r.slice(u,u+a))),u+=a);return[r,s]}return[r,{}]}(e,this.regex,this.handlers),n=t[0],t=t[1],r=t?(r=null,N((s=t).z)||(r=c.create(s.z)),N(s.Z)||(r=r||new f(s.Z),i=s.Z),N(s.q)||(s.M=3*(s.q-1)+1),N(s.h)||(s.h<12&&1===s.a?s.h+=12:12===s.h&&0===s.a&&(s.h=0)),0===s.G&&s.y&&(s.y=-s.y),N(s.u)||(s.S=yt(s.u)),[Object.keys(s).reduce(function(e,t){var n=function(e){switch(e){case"S":return"millisecond";case"s":return"second";case"m":return"minute";case"h":case"H":return"hour";case"d":return"day";case"o":return"ordinal";case"L":case"M":return"month";case"y":return"year";case"E":case"c":return"weekday";case"W":return"weekNumber";case"k":return"weekYear";case"q":return"quarter";default:return null}}(t);return n&&(e[n]=s[t]),e},{}),r,i]):[null,null,void 0],i=r[0],o=r[1],a=r[2];if(h(t,"a")&&h(t,"H"))throw new w("Can't include meridiem when specifying 24-hour format");return{input:e,tokens:this.tokens,regex:this.regex,rawMatches:n,matches:t,result:i,zone:o,specificOffset:a}}return{input:e,tokens:this.tokens,invalidReason:this.invalidReason};var s,i,r},i(e,[{key:"isValid",get:function(){return!this.disqualifyingUnit}},{key:"invalidReason",get:function(){return this.disqualifyingUnit?this.disqualifyingUnit.invalidReason:null}}]),e}();function Bn(e,t,n){return new $n(e,n).explainFromTokens(t)}function Qn(o,e){var t,a;return o?(t=(e=I.create(e,o).dtFormatter(Jn=Jn||W.fromMillis(1555555555555))).formatToParts(),a=e.resolvedOptions(),t.map(function(e){return t=o,n=a,i=(e=e).type,e=e.value,"literal"===i?{literal:!(r=/^\s+$/.test(e)),val:r?" ":e}:(r=t[i],"hour"===(e=i)&&(e=null!=t.hour12?t.hour12?"hour12":"hour24":null!=t.hourCycle?"h11"===t.hourCycle||"h12"===t.hourCycle?"hour12":"hour24":n.hour12?"hour12":"hour24"),(i="object"==typeof(i=Hn[e])?i[r]:i)?{literal:!1,val:i}:void 0);var t,n,r,i})):null}var Kn="Invalid DateTime";function Xn(e){return new d("unsupported zone",'the zone "'+e.name+'" is not supported')}function er(e){return null===e.weekData&&(e.weekData=rt(e.c)),e.weekData}function tr(e){return null===e.localWeekData&&(e.localWeekData=rt(e.c,e.loc.getMinDaysInFirstWeek(),e.loc.getStartOfWeek())),e.localWeekData}function Z(e,t){e={ts:e.ts,zone:e.zone,c:e.c,o:e.o,loc:e.loc,invalid:e.invalid};return new W(l({},e,t,{old:e}))}function nr(e,t,n){var r=e-60*t*1e3,i=n.offset(r);return t===i?[r,t]:i===(n=n.offset(r-=60*(i-t)*1e3))?[r,i]:[e-60*Math.min(i,n)*1e3,Math.max(i,n)]}function rr(e,t){e+=60*t*1e3;t=new Date(e);return{year:t.getUTCFullYear(),month:t.getUTCMonth()+1,day:t.getUTCDate(),hour:t.getUTCHours(),minute:t.getUTCMinutes(),second:t.getUTCSeconds(),millisecond:t.getUTCMilliseconds()}}function ir(e,t,n){return nr(kt(e),t,n)}function or(e,t){var n=e.o,r=e.c.year+Math.trunc(t.years),i=e.c.month+Math.trunc(t.months)+3*Math.trunc(t.quarters),r=l({},e.c,{year:r,month:i,day:Math.min(e.c.day,pt(r,i))+Math.trunc(t.days)+7*Math.trunc(t.weeks)}),i=x.fromObject({years:t.years-Math.trunc(t.years),quarters:t.quarters-Math.trunc(t.quarters),months:t.months-Math.trunc(t.months),weeks:t.weeks-Math.trunc(t.weeks),days:t.days-Math.trunc(t.days),hours:t.hours,minutes:t.minutes,seconds:t.seconds,milliseconds:t.milliseconds}).as("milliseconds"),t=nr(kt(r),n,e.zone),r=t[0],n=t[1];return 0!==i&&(n=e.zone.offset(r+=i)),{ts:r,o:n}}function ar(e,t,n,r,i,o){var a=n.setZone,s=n.zone;return e&&0!==Object.keys(e).length||t?(e=W.fromObject(e,l({},n,{zone:t||s,specificOffset:o})),a?e:e.setZone(s)):W.invalid(new d("unparsable",'the input "'+i+"\" can't be parsed as "+r))}function sr(e,t,n){return void 0===n&&(n=!0),e.isValid?I.create(b.create("en-US"),{allowZ:n,forceSimple:!0}).formatDateTimeFromString(e,t):null}function ur(e,t,n){var r=9999<e.c.year||e.c.year<0,i="";if(r&&0<=e.c.year&&(i+="+"),i+=m(e.c.year,r?6:4),"year"!==n){if(t){if(i=(i+="-")+m(e.c.month),"month"===n)return i;i+="-"}else if(i+=m(e.c.month),"month"===n)return i;i+=m(e.c.day)}return i}function lr(e,t,n,r,i,o,a){var s=!n||0!==e.c.millisecond||0!==e.c.second,u="";switch(a){case"day":case"month":case"year":break;default:if(u+=m(e.c.hour),"hour"!==a){if(t){if(u=(u+=":")+m(e.c.minute),"minute"===a)break;s&&(u=(u+=":")+m(e.c.second))}else{if(u+=m(e.c.minute),"minute"===a)break;s&&(u+=m(e.c.second))}"second"===a||!s||r&&0===e.c.millisecond||(u=(u+=".")+m(e.c.millisecond,3))}}return i&&(e.isOffsetFixed&&0===e.offset&&!o?u+="Z":u=e.o<0?(u=(u+="-")+m(Math.trunc(-e.o/60))+":")+m(Math.trunc(-e.o%60)):(u=(u+="+")+m(Math.trunc(e.o/60))+":")+m(Math.trunc(e.o%60))),o&&(u+="["+e.zone.ianaName+"]"),u}var cr,fr={month:1,day:1,hour:0,minute:0,second:0,millisecond:0},dr={weekNumber:1,weekday:1,hour:0,minute:0,second:0,millisecond:0},hr={ordinal:1,hour:0,minute:0,second:0,millisecond:0},mr=["year","month","day","hour","minute","second","millisecond"],yr=["weekYear","weekNumber","weekday","hour","minute","second","millisecond"],vr=["year","ordinal","hour","minute","second","millisecond"];function gr(e){var t={year:"year",years:"year",month:"month",months:"month",day:"day",days:"day",hour:"hour",hours:"hour",minute:"minute",minutes:"minute",quarter:"quarter",quarters:"quarter",second:"second",seconds:"second",millisecond:"millisecond",milliseconds:"millisecond",weekday:"weekday",weekdays:"weekday",weeknumber:"weekNumber",weeksnumber:"weekNumber",weeknumbers:"weekNumber",weekyear:"weekYear",weekyears:"weekYear",ordinal:"ordinal"}[e.toLowerCase()];if(t)return t;throw new J(e)}function pr(e){switch(e.toLowerCase()){case"localweekday":case"localweekdays":return"localWeekday";case"localweeknumber":case"localweeknumbers":return"localWeekNumber";case"localweekyear":case"localweekyears":return"localWeekYear";default:return gr(e)}}function kr(e,t){var n=S(t.zone,O.defaultZone);if(!n.isValid)return W.invalid(Xn(n));var r,t=b.fromObject(t);if(N(e.year))u=O.now();else{for(var i=0,o=mr;i<o.length;i++){var a=o[i];N(e[a])&&(e[a]=fr[a])}var s=ut(e)||lt(e);if(s)return W.invalid(s);s=n,void 0===cr&&(cr=O.now());var s=ir(e,"iana"!==s.type?s.offset(cr):(l=s.name,void 0===(r=Sr.get(l))&&(r=s.offset(cr),Sr.set(l,r)),r),n),u=s[0],l=s[1]}return new W({ts:u,zone:n,loc:t,o:l})}function wr(t,n,r){function e(e,t){return e=vt(e,o||r.calendary?0:2,r.calendary?"round":a),n.loc.clone(r).relFormatter(r).format(e,t)}function i(e){return r.calendary?n.hasSame(t,e)?0:n.startOf(e).diff(t.startOf(e),e).get(e):n.diff(t,e).get(e)}var o=!!N(r.round)||r.round,a=N(r.rounding)?"trunc":r.rounding;if(r.unit)return e(i(r.unit),r.unit);for(var s=R(r.units);!(u=s()).done;){var u=u.value,l=i(u);if(1<=Math.abs(l))return e(l,u)}return e(n<t?-0:0,r.units[r.units.length-1])}function br(e){var t={},e=0<e.length&&"object"==typeof e[e.length-1]?(t=e[e.length-1],Array.from(e).slice(0,e.length-1)):Array.from(e);return[t,e]}var Sr=new Map,W=function(e){function k(e){var t,n=e.zone||O.defaultZone,r=e.invalid||(Number.isNaN(e.ts)?new d("invalid input"):null)||(n.isValid?null:Xn(n)),i=(this.ts=N(e.ts)?O.now():e.ts,null),o=null;r||(o=e.old&&e.old.ts===this.ts&&e.old.zone.equals(n)?(i=(t=[e.old.c,e.old.o])[0],t[1]):(t=v(e.o)&&!e.old?e.o:n.offset(this.ts),i=rr(this.ts,t),i=(r=Number.isNaN(i.year)?new d("invalid input"):null)?null:i,r?null:t)),this._zone=n,this.loc=e.loc||b.create(),this.invalid=r,this.weekData=null,this.localWeekData=null,this.c=i,this.o=o,this.isLuxonDateTime=!0}k.now=function(){return new k({})},k.local=function(){var e=br(arguments),t=e[0],e=e[1];return kr({year:e[0],month:e[1],day:e[2],hour:e[3],minute:e[4],second:e[5],millisecond:e[6]},t)},k.utc=function(){var e=br(arguments),t=e[0],e=e[1],n=e[0],r=e[1],i=e[2],o=e[3],a=e[4],s=e[5],e=e[6];return t.zone=f.utcInstance,kr({year:n,month:r,day:i,hour:o,minute:a,second:s,millisecond:e},t)},k.fromJSDate=function(e,t){void 0===t&&(t={});var n,e="[object Date]"===Object.prototype.toString.call(e)?e.valueOf():NaN;return Number.isNaN(e)?k.invalid("invalid input"):(n=S(t.zone,O.defaultZone)).isValid?new k({ts:e,zone:n,loc:b.fromObject(t)}):k.invalid(Xn(n))},k.fromMillis=function(e,t){if(void 0===t&&(t={}),v(e))return e<-864e13||864e13<e?k.invalid("Timestamp out of range"):new k({ts:e,zone:S(t.zone,O.defaultZone),loc:b.fromObject(t)});throw new u("fromMillis requires a numerical input, but received a "+typeof e+" with value "+e)},k.fromSeconds=function(e,t){if(void 0===t&&(t={}),v(e))return new k({ts:1e3*e,zone:S(t.zone,O.defaultZone),loc:b.fromObject(t)});throw new u("fromSeconds requires a numerical input")},k.fromObject=function(e,t){e=e||{};var n=S((t=void 0===t?{}:t).zone,O.defaultZone);if(!n.isValid)return k.invalid(Xn(n));var r=b.fromObject(t),i=Mt(e,pr),o=st(i,r),a=o.minDaysInFirstWeek,o=o.startOfWeek,s=O.now(),t=N(t.specificOffset)?n.offset(s):t.specificOffset,u=!N(i.ordinal),l=!N(i.year),c=!N(i.month)||!N(i.day),l=l||c,f=i.weekYear||i.weekNumber;if((l||u)&&f)throw new w("Can't mix weekYear/weekNumber units with year/month/day or ordinals");if(c&&u)throw new w("Can't mix ordinal dates with month/day");for(var d,c=f||i.weekday&&!l,h=rr(s,t),m=(c?(p=yr,d=dr,h=rt(h,a,o)):u?(p=vr,d=hr,h=ot(h)):(p=mr,d=fr),!1),y=R(p);!(v=y()).done;){var v=v.value;N(i[v])?i[v]=(m?d:h)[v]:m=!0}var g,p=(c?(f=a,s=o,g=ct((p=i).weekYear),f=M(p.weekNumber,1,bt(p.weekYear,f=void 0===f?4:f,s=void 0===s?1:s)),s=M(p.weekday,1,7),g?f?!s&&T("weekday",p.weekday):T("week",p.weekNumber):T("weekYear",p.weekYear)):u?(f=ct((g=i).year),s=M(g.ordinal,1,D(g.year)),f?!s&&T("ordinal",g.ordinal):T("year",g.year)):ut(i))||lt(i);return p?k.invalid(p):(s=new k({ts:(f=ir(c?it(i,a,o):u?at(i):i,t,n))[0],zone:n,o:f[1],loc:r}),i.weekday&&l&&e.weekday!==s.weekday?k.invalid("mismatched weekday","you can't specify both a weekday of "+i.weekday+" and a date of "+s.toISO()):s.isValid?s:k.invalid(s.invalid))},k.fromISO=function(e,t){void 0===t&&(t={});var n=Ht(e,[mn,pn],[yn,kn],[vn,wn],[gn,bn]);return ar(n[0],n[1],t,"ISO 8601",e)},k.fromRFC2822=function(e,t){void 0===t&&(t={});var n=Ht(e.replace(/\([^()]*\)|[\n\t]/g," ").replace(/(\s\s+)/g," ").trim(),[sn,un]);return ar(n[0],n[1],t,"RFC 2822",e)},k.fromHTTP=function(e,t){void 0===t&&(t={});e=Ht(e,[ln,dn],[cn,dn],[fn,hn]);return ar(e[0],e[1],t,"HTTP",t)},k.fromFormat=function(e,t,n){if(void 0===n&&(n={}),N(e)||N(t))throw new u("fromFormat requires an input string and a format");var r=n,i=r.locale,r=r.numberingSystem,i=b.fromOpts({locale:void 0===i?null:i,numberingSystem:void 0===r?null:r,defaultToEN:!0}),i=[(r=Bn(r=i,e,t)).result,r.zone,r.specificOffset,r.invalidReason],r=i[0],o=i[1],a=i[2],i=i[3];return i?k.invalid(i):ar(r,o,n,"format "+t,e,a)},k.fromString=function(e,t,n){return k.fromFormat(e,t,n=void 0===n?{}:n)},k.fromSQL=function(e,t){void 0===t&&(t={});var n=Ht(e,[On,pn],[Tn,Nn]);return ar(n[0],n[1],t,"SQL",e)},k.invalid=function(e,t){if(void 0===t&&(t=null),!e)throw new u("need to specify a reason the DateTime is invalid");e=e instanceof d?e:new d(e,t);if(O.throwOnInvalid)throw new P(e);return new k({invalid:e})},k.isDateTime=function(e){return e&&e.isLuxonDateTime||!1},k.parseFormatForOpts=function(e,t){e=Qn(e,b.fromObject(t=void 0===t?{}:t));return e?e.map(function(e){return e?e.val:null}).join(""):null},k.expandFormat=function(e,t){return void 0===t&&(t={}),Gn(I.parseFormat(e),b.fromObject(t)).map(function(e){return e.val}).join("")},k.resetCache=function(){cr=void 0,Sr.clear()};var t=k.prototype;return t.get=function(e){return this[e]},t.getPossibleOffsets=function(){var e,t,n,r;return this.isValid&&!this.isOffsetFixed&&(e=kt(this.c),n=this.zone.offset(e-864e5),r=this.zone.offset(e+864e5),(n=this.zone.offset(e-6e4*n))!==(r=this.zone.offset(e-6e4*r)))&&(t=e-6e4*r,n=rr(e=e-6e4*n,n),r=rr(t,r),n.hour===r.hour)&&n.minute===r.minute&&n.second===r.second&&n.millisecond===r.millisecond?[Z(this,{ts:e}),Z(this,{ts:t})]:[this]},t.resolvedLocaleOptions=function(e){e=I.create(this.loc.clone(e=void 0===e?{}:e),e).resolvedOptions(this);return{locale:e.locale,numberingSystem:e.numberingSystem,outputCalendar:e.calendar}},t.toUTC=function(e,t){return void 0===t&&(t={}),this.setZone(f.instance(e=void 0===e?0:e),t)},t.toLocal=function(){return this.setZone(O.defaultZone)},t.setZone=function(e,t){var n,t=void 0===t?{}:t,r=t.keepLocalTime,r=void 0!==r&&r,t=t.keepCalendarTime,t=void 0!==t&&t;return(e=S(e,O.defaultZone)).equals(this.zone)?this:e.isValid?(n=this.ts,(r||t)&&(r=e.offset(this.ts),n=ir(this.toObject(),r,e)[0]),Z(this,{ts:n,zone:e})):k.invalid(Xn(e))},t.reconfigure=function(e){var e=void 0===e?{}:e,t=e.locale,n=e.numberingSystem,e=e.outputCalendar,t=this.loc.clone({locale:t,numberingSystem:n,outputCalendar:e});return Z(this,{loc:t})},t.setLocale=function(e){return this.reconfigure({locale:e})},t.set=function(e){if(!this.isValid)return this;var t,e=Mt(e,pr),n=st(e,this.loc),r=n.minDaysInFirstWeek,n=n.startOfWeek,i=!N(e.weekYear)||!N(e.weekNumber)||!N(e.weekday),o=!N(e.ordinal),a=!N(e.year),s=!N(e.month)||!N(e.day),u=e.weekYear||e.weekNumber;if((a||s||o)&&u)throw new w("Can't mix weekYear/weekNumber units with year/month/day or ordinals");if(s&&o)throw new w("Can't mix ordinal dates with month/day");i?t=it(l({},rt(this.c,r,n),e),r,n):N(e.ordinal)?(t=l({},this.toObject(),e),N(e.day)&&(t.day=Math.min(pt(t.year,t.month),t.day))):t=at(l({},ot(this.c),e));a=ir(t,this.o,this.zone);return Z(this,{ts:a[0],o:a[1]})},t.plus=function(e){return this.isValid?Z(this,or(this,x.fromDurationLike(e))):this},t.minus=function(e){return this.isValid?Z(this,or(this,x.fromDurationLike(e).negate())):this},t.startOf=function(e,t){t=(void 0===t?{}:t).useLocaleWeeks,t=void 0!==t&&t;if(!this.isValid)return this;var n={},e=x.normalizeUnit(e);switch(e){case"years":n.month=1;case"quarters":case"months":n.day=1;case"weeks":case"days":n.hour=0;case"hours":n.minute=0;case"minutes":n.second=0;case"seconds":n.millisecond=0}return"weeks"===e&&(t?(t=this.loc.getStartOfWeek(),this.weekday<t&&(n.weekNumber=this.weekNumber-1),n.weekday=t):n.weekday=1),"quarters"===e&&(t=Math.ceil(this.month/3),n.month=3*(t-1)+1),this.set(n)},t.endOf=function(e,t){var n;return this.isValid?this.plus(((n={})[e]=1,n)).startOf(e,t).minus(1):this},t.toFormat=function(e,t){return void 0===t&&(t={}),this.isValid?I.create(this.loc.redefaultToEN(t)).formatDateTimeFromString(this,e):Kn},t.toLocaleString=function(e,t){return void 0===e&&(e=G),void 0===t&&(t={}),this.isValid?I.create(this.loc.clone(t),e).formatDateTime(this):Kn},t.toLocaleParts=function(e){return void 0===e&&(e={}),this.isValid?I.create(this.loc.clone(e),e).formatDateTimeParts(this):[]},t.toISO=function(e){var t,e=void 0===e?{}:e,n=e.format,r=e.suppressSeconds,r=void 0!==r&&r,i=e.suppressMilliseconds,i=void 0!==i&&i,o=e.includeOffset,o=void 0===o||o,a=e.extendedZone,a=void 0!==a&&a,e=e.precision;return this.isValid?(t=ur(this,n="extended"===(void 0===n?"extended":n),e=gr(void 0===e?"milliseconds":e)),3<=mr.indexOf(e)&&(t+="T"),t+lr(this,n,r,i,o,a,e)):null},t.toISODate=function(e){var e=void 0===e?{}:e,t=e.format,e=e.precision;return this.isValid?ur(this,"extended"===(void 0===t?"extended":t),gr(void 0===e?"day":e)):null},t.toISOWeekDate=function(){return sr(this,"kkkk-'W'WW-c")},t.toISOTime=function(e){var e=void 0===e?{}:e,t=e.suppressMilliseconds,t=void 0!==t&&t,n=e.suppressSeconds,n=void 0!==n&&n,r=e.includeOffset,r=void 0===r||r,i=e.includePrefix,i=void 0!==i&&i,o=e.extendedZone,o=void 0!==o&&o,a=e.format,a=void 0===a?"extended":a,e=e.precision;return this.isValid?(e=gr(e=void 0===e?"milliseconds":e),(i&&3<=mr.indexOf(e)?"T":"")+lr(this,"extended"===a,n,t,r,o,e)):null},t.toRFC2822=function(){return sr(this,"EEE, dd LLL yyyy HH:mm:ss ZZZ",!1)},t.toHTTP=function(){return sr(this.toUTC(),"EEE, dd LLL yyyy HH:mm:ss 'GMT'")},t.toSQLDate=function(){return this.isValid?ur(this,!0):null},t.toSQLTime=function(e){var e=void 0===e?{}:e,t=e.includeOffset,t=void 0===t||t,n=e.includeZone,n=void 0!==n&&n,e=e.includeOffsetSpace,r="HH:mm:ss.SSS";return(n||t)&&((void 0===e||e)&&(r+=" "),n?r+="z":t&&(r+="ZZ")),sr(this,r,!0)},t.toSQL=function(e){return void 0===e&&(e={}),this.isValid?this.toSQLDate()+" "+this.toSQLTime(e):null},t.toString=function(){return this.isValid?this.toISO():Kn},t[e]=function(){return this.isValid?"DateTime { ts: "+this.toISO()+", zone: "+this.zone.name+", locale: "+this.locale+" }":"DateTime { Invalid, reason: "+this.invalidReason+" }"},t.valueOf=function(){return this.toMillis()},t.toMillis=function(){return this.isValid?this.ts:NaN},t.toSeconds=function(){return this.isValid?this.ts/1e3:NaN},t.toUnixInteger=function(){return this.isValid?Math.floor(this.ts/1e3):NaN},t.toJSON=function(){return this.toISO()},t.toBSON=function(){return this.toJSDate()},t.toObject=function(e){var t;return void 0===e&&(e={}),this.isValid?(t=l({},this.c),e.includeConfig&&(t.outputCalendar=this.outputCalendar,t.numberingSystem=this.loc.numberingSystem,t.locale=this.loc.locale),t):{}},t.toJSDate=function(){return new Date(this.isValid?this.ts:NaN)},t.diff=function(e,t,n){var r;return void 0===t&&(t="milliseconds"),void 0===n&&(n={}),this.isValid&&e.isValid?(n=l({locale:this.locale,numberingSystem:this.numberingSystem},n),t=t,t=(Array.isArray(t)?t:[t]).map(x.normalizeUnit),e=jn((r=e.valueOf()>this.valueOf())?this:e,r?e:this,t,n),r?e.negate():e):x.invalid("created by diffing an invalid DateTime")},t.diffNow=function(e,t){return void 0===e&&(e="milliseconds"),void 0===t&&(t={}),this.diff(k.now(),e,t)},t.until=function(e){return this.isValid?Zn.fromDateTimes(this,e):this},t.hasSame=function(e,t,n){var r;return!!this.isValid&&(r=e.valueOf(),(e=this.setZone(e.zone,{keepLocalTime:!0})).startOf(t,n)<=r)&&r<=e.endOf(t,n)},t.equals=function(e){return this.isValid&&e.isValid&&this.valueOf()===e.valueOf()&&this.zone.equals(e.zone)&&this.loc.equals(e.loc)},t.toRelative=function(e){var t,n,r,i;return this.isValid?(t=(e=void 0===e?{}:e).base||k.fromObject({},{zone:this.zone}),n=e.padding?this<t?-e.padding:e.padding:0,r=["years","months","days","hours","minutes","seconds"],i=e.unit,Array.isArray(e.unit)&&(r=e.unit,i=void 0),wr(t,this.plus(n),l({},e,{numeric:"always",units:r,unit:i}))):null},t.toRelativeCalendar=function(e){return void 0===e&&(e={}),this.isValid?wr(e.base||k.fromObject({},{zone:this.zone}),this,l({},e,{numeric:"auto",units:["years","months","days"],calendary:!0})):null},k.min=function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];if(t.every(k.isDateTime))return ht(t,function(e){return e.valueOf()},Math.min);throw new u("min requires all arguments be DateTimes")},k.max=function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];if(t.every(k.isDateTime))return ht(t,function(e){return e.valueOf()},Math.max);throw new u("max requires all arguments be DateTimes")},k.fromFormatExplain=function(e,t,n){var n=n=void 0===n?{}:n,r=n.locale,n=n.numberingSystem;return Bn(b.fromOpts({locale:void 0===r?null:r,numberingSystem:void 0===n?null:n,defaultToEN:!0}),e,t)},k.fromStringExplain=function(e,t,n){return k.fromFormatExplain(e,t,n=void 0===n?{}:n)},k.buildFormatParser=function(e,t){var t=t=void 0===t?{}:t,n=t.locale,t=t.numberingSystem,n=b.fromOpts({locale:void 0===n?null:n,numberingSystem:void 0===t?null:t,defaultToEN:!0});return new $n(n,e)},k.fromFormatParser=function(e,t,n){if(void 0===n&&(n={}),N(e)||N(t))throw new u("fromFormatParser requires an input string and a format parser");var r,i,o,a=n,s=a.locale,a=a.numberingSystem,s=b.fromOpts({locale:void 0===s?null:s,numberingSystem:void 0===a?null:a,defaultToEN:!0});if(s.equals(t.locale))return r=(a=t.explainFromTokens(e)).result,i=a.zone,o=a.specificOffset,(a=a.invalidReason)?k.invalid(a):ar(r,i,n,"format "+t.format,e,o);throw new u("fromFormatParser called with a locale of "+s+", but the format parser was created for "+t.locale)},i(k,[{key:"isValid",get:function(){return null===this.invalid}},{key:"invalidReason",get:function(){return this.invalid?this.invalid.reason:null}},{key:"invalidExplanation",get:function(){return this.invalid?this.invalid.explanation:null}},{key:"locale",get:function(){return this.isValid?this.loc.locale:null}},{key:"numberingSystem",get:function(){return this.isValid?this.loc.numberingSystem:null}},{key:"outputCalendar",get:function(){return this.isValid?this.loc.outputCalendar:null}},{key:"zone",get:function(){return this._zone}},{key:"zoneName",get:function(){return this.isValid?this.zone.name:null}},{key:"year",get:function(){return this.isValid?this.c.year:NaN}},{key:"quarter",get:function(){return this.isValid?Math.ceil(this.c.month/3):NaN}},{key:"month",get:function(){return this.isValid?this.c.month:NaN}},{key:"day",get:function(){return this.isValid?this.c.day:NaN}},{key:"hour",get:function(){return this.isValid?this.c.hour:NaN}},{key:"minute",get:function(){return this.isValid?this.c.minute:NaN}},{key:"second",get:function(){return this.isValid?this.c.second:NaN}},{key:"millisecond",get:function(){return this.isValid?this.c.millisecond:NaN}},{key:"weekYear",get:function(){return this.isValid?er(this).weekYear:NaN}},{key:"weekNumber",get:function(){return this.isValid?er(this).weekNumber:NaN}},{key:"weekday",get:function(){return this.isValid?er(this).weekday:NaN}},{key:"isWeekend",get:function(){return this.isValid&&this.loc.getWeekendDays().includes(this.weekday)}},{key:"localWeekday",get:function(){return this.isValid?tr(this).weekday:NaN}},{key:"localWeekNumber",get:function(){return this.isValid?tr(this).weekNumber:NaN}},{key:"localWeekYear",get:function(){return this.isValid?tr(this).weekYear:NaN}},{key:"ordinal",get:function(){return this.isValid?ot(this.c).ordinal:NaN}},{key:"monthShort",get:function(){return this.isValid?Wn.months("short",{locObj:this.loc})[this.month-1]:null}},{key:"monthLong",get:function(){return this.isValid?Wn.months("long",{locObj:this.loc})[this.month-1]:null}},{key:"weekdayShort",get:function(){return this.isValid?Wn.weekdays("short",{locObj:this.loc})[this.weekday-1]:null}},{key:"weekdayLong",get:function(){return this.isValid?Wn.weekdays("long",{locObj:this.loc})[this.weekday-1]:null}},{key:"offset",get:function(){return this.isValid?+this.o:NaN}},{key:"offsetNameShort",get:function(){return this.isValid?this.zone.offsetName(this.ts,{format:"short",locale:this.locale}):null}},{key:"offsetNameLong",get:function(){return this.isValid?this.zone.offsetName(this.ts,{format:"long",locale:this.locale}):null}},{key:"isOffsetFixed",get:function(){return this.isValid?this.zone.isUniversal:null}},{key:"isInDST",get:function(){return!this.isOffsetFixed&&(this.offset>this.set({month:1,day:1}).offset||this.offset>this.set({month:5}).offset)}},{key:"isInLeapYear",get:function(){return gt(this.year)}},{key:"daysInMonth",get:function(){return pt(this.year,this.month)}},{key:"daysInYear",get:function(){return this.isValid?D(this.year):NaN}},{key:"weeksInWeekYear",get:function(){return this.isValid?bt(this.weekYear):NaN}},{key:"weeksInLocalWeekYear",get:function(){return this.isValid?bt(this.localWeekYear,this.loc.getMinDaysInFirstWeek(),this.loc.getStartOfWeek()):NaN}}],[{key:"DATE_SHORT",get:function(){return G}},{key:"DATE_MED",get:function(){return $}},{key:"DATE_MED_WITH_WEEKDAY",get:function(){return B}},{key:"DATE_FULL",get:function(){return Q}},{key:"DATE_HUGE",get:function(){return K}},{key:"TIME_SIMPLE",get:function(){return X}},{key:"TIME_WITH_SECONDS",get:function(){return ee}},{key:"TIME_WITH_SHORT_OFFSET",get:function(){return te}},{key:"TIME_WITH_LONG_OFFSET",get:function(){return ne}},{key:"TIME_24_SIMPLE",get:function(){return re}},{key:"TIME_24_WITH_SECONDS",get:function(){return ie}},{key:"TIME_24_WITH_SHORT_OFFSET",get:function(){return oe}},{key:"TIME_24_WITH_LONG_OFFSET",get:function(){return ae}},{key:"DATETIME_SHORT",get:function(){return se}},{key:"DATETIME_SHORT_WITH_SECONDS",get:function(){return ue}},{key:"DATETIME_MED",get:function(){return le}},{key:"DATETIME_MED_WITH_SECONDS",get:function(){return ce}},{key:"DATETIME_MED_WITH_WEEKDAY",get:function(){return fe}},{key:"DATETIME_FULL",get:function(){return de}},{key:"DATETIME_FULL_WITH_SECONDS",get:function(){return he}},{key:"DATETIME_HUGE",get:function(){return me}},{key:"DATETIME_HUGE_WITH_SECONDS",get:function(){return ye}}]),k}(Symbol.for("nodejs.util.inspect.custom"));function Or(e){if(W.isDateTime(e))return e;if(e&&e.valueOf&&v(e.valueOf()))return W.fromJSDate(e);if(e&&"object"==typeof e)return W.fromObject(e);throw new u("Unknown datetime argument: "+e+", of type "+typeof e)}return e.DateTime=W,e.Duration=x,e.FixedOffsetZone=f,e.IANAZone=c,e.Info=Wn,e.Interval=Zn,e.InvalidZone=ze,e.Settings=O,e.SystemZone=ge,e.VERSION="3.7.2",e.Zone=s,Object.defineProperty(e,"__esModule",{value:!0}),e}({});
// --- File: js/modules/app-config.js ---
(function initGtvAppConfig(globalObj) {
    "use strict";

    const APP_CONFIG = Object.freeze({
        VERSION: "3.10.1",
        STORAGE_KEY: "GTV_v323_Data",
        THEME_STORAGE_KEY: "GTV_Theme",
        LANG_STORAGE_KEY: "GTV_Lang",
        UI_SCALE_STORAGE_KEY: "GTV_UIScale",
        MIN_UI_SCALE_PERCENT: 50,
        MAX_UI_SCALE_PERCENT: 200,
        DEFAULT_UI_SCALE_PERCENT: 100,
        UI_SCALE_PERCENT_OPTIONS: Object.freeze([50, 75, 100, 125, 150, 175, 200]),
        LEGACY_STORAGE_KEYS: Object.freeze([
            "GTV_v322_Data",
            "GTV_v321_Data",
            "GTV_v320_Data",
            "GTV_v310_Data",
            "GTV_v300_Data",
            "GTV_v200_Data",
            "GTV_v170_Data",
            "GTV_v160_Data",
            "GTV_v150_Data",
            "GTV_v140_Data"
        ]),
        LEGACY_STORAGE_FALLBACK_KEYS: Object.freeze([
            "GTV_v322_Data",
            "GTV_v321_Data",
            "GTV_v320_Data"
        ]),
        THEME_LIST: Object.freeze(["dark", "light"]),
        TABLE_IMAGE_EXPORT_WIDTH: 1920,
        EXPORT_MONO_FONT_FAMILY: "'JetBrains Mono', 'Consolas', 'Courier New', monospace"
    });

    globalObj.GTVAppConfig = APP_CONFIG;
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/main-constants.js ---
(function initGtvMainConstants(globalObj) {
    "use strict";

    const COPY_FORMAT_KEYS = Object.freeze(["timezone", "region", "offset", "time", "period_days", "period_time"]);
    const TIME_PART_KEYS = Object.freeze(["dn", "date", "time", "weekday"]);
    const PERIOD_RESULT_IDS = Object.freeze(["period-res", "period-hour-res", "period-min-res", "period-sec-res"]);
    const TIMELINE_TOTAL_HOURS = 24;
    const TIMELINE_TOTAL_SECONDS = 24 * 60 * 60;
    const MAIN_TABS = Object.freeze(["live", "fixed", "multi", "fixed-time", "calc"]);
    const MIN_TIME_ADJUST_DAY_STEP = 1;
    const MAX_TIME_ADJUST_DAY_STEP = 36500;
    const DEFAULT_TIME_ADJUST_DAY_STEP = 1;
    const MIN_MULTI_RANGE_COUNT = 1;
    const MAX_MULTI_RANGE_COUNT = 12;
    const MIN_FIXED_TIME_SLOT_COUNT = 1;
    const MAX_FIXED_TIME_SLOT_COUNT = 5;
    const DEFAULT_FIXED_TIME_VALUE = "09:00";
    const DEFAULT_MULTI_RANGE_TITLE = "Range";
    const DEFAULT_DISPLAY_FORMAT_ENABLED = Object.freeze({
        timezone: true,
        region: true,
        offset: true,
        time: true,
        period_days: false,
        period_time: true
    });
    const DEFAULT_COPY_FORMAT_ENABLED = Object.freeze({
        timezone: true,
        region: true,
        offset: true,
        time: true,
        period_days: false,
        period_time: true
    });
    const DEFAULT_DISPLAY_TIME_PARTS_ENABLED = Object.freeze({
        dn: true,
        date: true,
        time: true,
        weekday: false
    });
    const DEFAULT_COPY_TIME_PARTS_ENABLED = Object.freeze({
        dn: false,
        date: true,
        time: true,
        weekday: false
    });
    const FORMAT_PROFILE_CONTEXT_KEYS = Object.freeze(["live", "fixed", "fixed-extra", "multi", "fixed-time"]);

    globalObj.GTVMainConstants = Object.freeze({
        COPY_FORMAT_KEYS,
        TIME_PART_KEYS,
        PERIOD_RESULT_IDS,
        TIMELINE_TOTAL_HOURS,
        TIMELINE_TOTAL_SECONDS,
        MAIN_TABS,
        MIN_TIME_ADJUST_DAY_STEP,
        MAX_TIME_ADJUST_DAY_STEP,
        DEFAULT_TIME_ADJUST_DAY_STEP,
        MIN_MULTI_RANGE_COUNT,
        MAX_MULTI_RANGE_COUNT,
        MIN_FIXED_TIME_SLOT_COUNT,
        MAX_FIXED_TIME_SLOT_COUNT,
        DEFAULT_FIXED_TIME_VALUE,
        DEFAULT_MULTI_RANGE_TITLE,
        DEFAULT_DISPLAY_FORMAT_ENABLED,
        DEFAULT_COPY_FORMAT_ENABLED,
        DEFAULT_DISPLAY_TIME_PARTS_ENABLED,
        DEFAULT_COPY_TIME_PARTS_ENABLED,
        FORMAT_PROFILE_CONTEXT_KEYS
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/service-bootstrap.js ---
(function initGtvServiceBootstrap(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function resolveModuleApi(moduleName) {
            const api = safeDeps[moduleName];
            if (!api || typeof api.createService !== "function") {
                throw new Error(`Missing required module API: ${moduleName}.createService`);
            }
            return api;
        }

        function createTabUiService(config = {}) {
            const api = resolveModuleApi("GTV_TAB_UI");
            return api.createService(config);
        }

        function createTabOrchestratorService(config = {}) {
            const api = resolveModuleApi("GTV_TAB_ORCHESTRATOR");
            return api.createService(config);
        }

        function createGroupStateService(config = {}) {
            const api = resolveModuleApi("GTV_GROUP_STATE");
            return api.createService(config);
        }

        return Object.freeze({
            createTabUiService,
            createTabOrchestratorService,
            createGroupStateService
        });
    }

    globalObj.GTVServiceBootstrap = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/app-state-patcher.js ---
(function initGtvAppStatePatcher(globalObj) {
    "use strict";

    const PATCHABLE_KEYS = Object.freeze([
        "groups",
        "activeGroupId",
        "currentMainTab",
        "activeGroupIdByMainTab",
        "slotCount",
        "showCopyFormat",
        "showTimeline",
        "displayFormatOrder",
        "displayFormatEnabled",
        "displayTimePartsEnabled",
        "copyFormatOrder",
        "copyFormatEnabled",
        "copyTimePartsEnabled",
        "formatProfiles",
        "activeFormatProfileContext",
        "timeAdjustDayStepBySlot",
        "multiRangeCount",
        "multiRangeTitle",
        "multiRanges",
        "multiRangeCollapsed",
        "multiRangeStartEditEnabled",
        "multiRangeEndEditEnabled",
        "currentTheme",
        "currentLang"
    ]);

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (_err) {
                return undefined;
            }
        }

        function getStateSnapshot() {
            const source = invokeDep("getStateSource");
            const safeSource = (source && typeof source === "object") ? source : {};
            const snapshot = {};
            PATCHABLE_KEYS.forEach((key) => {
                snapshot[key] = safeSource[key];
            });
            snapshot.isRealtime = !!safeSource.isRealtime;
            return snapshot;
        }

        function applyStatePatch(next = {}) {
            if (!next || typeof next !== "object") return;
            const setters = (safeDeps.stateSetters && typeof safeDeps.stateSetters === "object")
                ? safeDeps.stateSetters
                : {};

            PATCHABLE_KEYS.forEach((key) => {
                if (!Object.prototype.hasOwnProperty.call(next, key)) return;
                const setter = setters[key];
                if (typeof setter !== "function") return;
                if (key === "showTimeline") {
                    setter(!!next.showTimeline);
                    return;
                }
                setter(next[key]);
            });

            if (Object.prototype.hasOwnProperty.call(next, "isRealtime")) {
                invokeDep("setIsRealtimeState", next.isRealtime);
            }
        }

        return Object.freeze({
            getStateSnapshot,
            applyStatePatch
        });
    }

    globalObj.GTVAppStatePatcher = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/date-picker.js ---
(function (globalObj) {
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
                    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                    this._render();
                }, { signal });
            }

            if (this.nextBtn) {
                this.nextBtn.addEventListener("click", (e) => {
                    e.preventDefault();
                    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
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

    globalObj.CustomDatePicker = CustomDatePicker;
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/time-core.js ---
(function initGtvTimeCore(globalObj) {
    "use strict";

    function sanitizeTimezoneId(value) {
        const raw = (typeof value === "string") ? value.trim() : "";
        if (!raw) return "";
        if (raw.toLowerCase() === "utc") return "";
        return raw;
    }

    function sanitizeBaseTimezoneId(value) {
        const raw = (typeof value === "string") ? value.trim() : "";
        if (!raw) return "utc";
        if (raw.toLowerCase() === "utc") return "utc";
        return raw;
    }

    function sanitizeUtcRowOrder(value) {
        const parsed = parseInt(value, 10);
        if (!Number.isFinite(parsed) || parsed < 0) return 0;
        return parsed;
    }

    function sanitizeUtcMs(value, fallbackMs) {
        const asNumber = Number(value);
        if (Number.isFinite(asNumber)) return asNumber;
        if (value instanceof Date && Number.isFinite(value.getTime())) return value.getTime();
        return fallbackMs;
    }

    function buildStrictUtcDateFromParts(parts) {
        const year = parseInt(parts?.year, 10);
        const month = parseInt(parts?.month, 10);
        const day = parseInt(parts?.day, 10);
        const hour = parseInt(parts?.hour, 10);
        const minute = parseInt(parts?.minute, 10);
        const second = parseInt(parts?.second, 10);
        if (!Number.isInteger(year)) return null;
        if (!Number.isInteger(month) || month < 1 || month > 12) return null;
        if (!Number.isInteger(day) || day < 1 || day > 31) return null;
        if (!Number.isInteger(hour) || hour < 0 || hour > 23) return null;
        if (!Number.isInteger(minute) || minute < 0 || minute > 59) return null;
        if (!Number.isInteger(second) || second < 0 || second > 59) return null;

        const candidate = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
        if (!Number.isFinite(candidate.getTime())) return null;
        if (candidate.getUTCFullYear() !== year) return null;
        if ((candidate.getUTCMonth() + 1) !== month) return null;
        if (candidate.getUTCDate() !== day) return null;
        if (candidate.getUTCHours() !== hour) return null;
        if (candidate.getUTCMinutes() !== minute) return null;
        if (candidate.getUTCSeconds() !== second) return null;
        return candidate;
    }

    function pad(v) {
        return String(Math.max(0, Math.trunc(v))).padStart(2, "0");
    }

    function clampNumber(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function getCustomOffsetMinutes(tz) {
        const offH = Number.isFinite(parseInt(tz?.offH, 10)) ? parseInt(tz.offH, 10) : 0;
        const offM = Number.isFinite(parseInt(tz?.offM, 10)) ? Math.abs(parseInt(tz.offM, 10)) : 0;
        const minuteSign = offH < 0 ? -1 : 1;
        return (offH * 60) + (minuteSign * offM);
    }

    const api = Object.freeze({
        sanitizeTimezoneId,
        sanitizeBaseTimezoneId,
        sanitizeUtcRowOrder,
        sanitizeUtcMs,
        buildStrictUtcDateFromParts,
        pad,
        getCustomOffsetMinutes,
        clampNumber
    });

    globalObj.GTVTimeCore = api;
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/time-input-mutations.js ---
(function initGtvTimeInputMutations(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (_err) {
                return undefined;
            }
        }

        function isValidDate(value) {
            return !!value && typeof value.getTime === "function" && Number.isFinite(value.getTime());
        }

        function getCurrentGroupZones() {
            const zones = invokeDep("getCurrentGroupZones");
            return Array.isArray(zones) ? zones : [];
        }

        function resolveLocalDatePartsByTimezoneAtDate(timezone, utcDate, timezoneId = null) {
            const sourceDate = isValidDate(utcDate) ? utcDate : new Date();

            if (timezone === "UTC") {
                return {
                    Y: sourceDate.getUTCFullYear(),
                    M: sourceDate.getUTCMonth() + 1,
                    D: sourceDate.getUTCDate()
                };
            }

            if (timezone === "CUSTOM") {
                const currentZones = getCurrentGroupZones();
                let tz = null;
                if (timezoneId) {
                    tz = currentZones.find((z) => z && z.id === timezoneId) || null;
                }
                if (!tz) return null;
                const shifted = new Date(sourceDate.getTime() + (invokeDep("getCustomOffsetMinutes", tz) * 60000));
                return {
                    Y: shifted.getUTCFullYear(),
                    M: shifted.getUTCMonth() + 1,
                    D: shifted.getUTCDate()
                };
            }

            if (timezoneId) {
                const zoneRef = getCurrentGroupZones().find((item) => item && item.id === timezoneId) || null;
                const fixedOffsetMinutes = invokeDep("getFixedOffsetForDisplayAtDate", zoneRef, sourceDate);
                if (Number.isFinite(fixedOffsetMinutes)) {
                    const shifted = new Date(sourceDate.getTime() + (fixedOffsetMinutes * 60000));
                    return {
                        Y: shifted.getUTCFullYear(),
                        M: shifted.getUTCMonth() + 1,
                        D: shifted.getUTCDate()
                    };
                }
            }

            const parts = invokeDep("resolveLocalDateParts", sourceDate, timezone, timezoneId, null);
            if (!parts || typeof parts !== "object") return null;
            if (!Number.isFinite(parts.Y) || !Number.isFinite(parts.M) || !Number.isFinite(parts.D)) return null;
            return { Y: parts.Y, M: parts.M, D: parts.D };
        }

        function resolveLocalDatePartsByTimezone(timezone, slotIdx, timezoneId = null) {
            return resolveLocalDatePartsByTimezoneAtDate(
                timezone,
                invokeDep("getGlobalTime", slotIdx),
                timezoneId
            );
        }

        function buildStrictUtcDateFromParts(parts) {
            const date = invokeDep("buildStrictUtcDateFromParts", parts);
            return isValidDate(date) ? date : null;
        }

        function showInvalidDateFeedback(isMultiRange = false) {
            invokeDep("showToast", invokeDep("t", "toast_invalid_date"));
            if (isMultiRange) {
                invokeDep("renderMultiRanges");
            } else {
                invokeDep("renderList");
            }
        }

        function parseLocalInputParts(val, timezone, slotIdx, timezoneId, inputMode, baseDateResolver = null) {
            const parts = invokeDep("parseDateTimeParts", val, inputMode);
            if (!parts) return null;

            let Y = 0;
            let M = 0;
            let D = 0;
            let H = 0;
            let min = 0;
            let S = 0;
            if (inputMode === "datetime") {
                [Y, M, D, H, min, S] = parts;
            } else if (inputMode === "date") {
                [Y, M, D] = parts;
            } else if (inputMode === "time") {
                const baseDate = (typeof baseDateResolver === "function") ? baseDateResolver() : null;
                const baseDateParts = isValidDate(baseDate)
                    ? resolveLocalDatePartsByTimezoneAtDate(timezone, baseDate, timezoneId)
                    : resolveLocalDatePartsByTimezone(timezone, slotIdx, timezoneId);
                if (!baseDateParts) return null;
                ({ Y, M, D } = baseDateParts);
                [H, min, S] = parts;
            }

            return buildStrictUtcDateFromParts({
                year: Y,
                month: M,
                day: D,
                hour: H,
                minute: min,
                second: S
            });
        }

        function resolveUtcDateForZone(tempUTC, timezone, timezoneId = null, offsetAnchor = null) {
            if (!isValidDate(tempUTC)) return null;
            if (timezone === "UTC") return tempUTC;

            if (timezone === "CUSTOM") {
                const tz = getCurrentGroupZones().find((item) => item && item.id === timezoneId) || null;
                if (!tz) return null;
                const offsetMs = invokeDep("getCustomOffsetMinutes", tz) * 60000;
                return new Date(tempUTC.getTime() - offsetMs);
            }

            const zoneRef = timezoneId
                ? (getCurrentGroupZones().find((item) => item && item.id === timezoneId) || null)
                : null;
            const anchorDate = isValidDate(offsetAnchor) ? offsetAnchor : tempUTC;
            const fixedOffsetMinutes = invokeDep("getFixedOffsetForDisplayAtDate", zoneRef, anchorDate);
            const offsetMinutes = Number.isFinite(fixedOffsetMinutes)
                ? fixedOffsetMinutes
                : invokeDep("getTimezoneOffset", timezone, tempUTC);
            if (!Number.isFinite(offsetMinutes)) return null;
            return new Date(tempUTC.getTime() - (offsetMinutes * 60000));
        }

        function handleTimeChange(val, timezone, slotIdx, timezoneId = null, inputMode = "datetime") {
            if (invokeDep("isRealtime")) return;
            if (inputMode === "none") return;

            const tempUTC = parseLocalInputParts(val, timezone, slotIdx, timezoneId, inputMode);
            if (!tempUTC) {
                showInvalidDateFeedback(false);
                return;
            }

            const utcDate = resolveUtcDateForZone(
                tempUTC,
                timezone,
                timezoneId,
                invokeDep("getGlobalTime", 0)
            );
            if (!isValidDate(utcDate)) return;
            invokeDep("setGlobalTime", slotIdx, utcDate);
            invokeDep("updateClocks");
        }

        function handleMultiRangeTimeChange(rangeIdx, val, timezone, slotIdx, timezoneId = null, inputMode = "datetime") {
            if (!invokeDep("isMultiTab")) return;
            if (rangeIdx > 0 && slotIdx === 0 && !invokeDep("isMultiRangeStartEditEnabled", rangeIdx)) return;
            if (slotIdx === 1 && !invokeDep("isMultiRangeEndEditEnabled", rangeIdx)) return;

            invokeDep("ensureMultiRangeState");
            const ranges = invokeDep("getMultiRanges");
            const safeRanges = Array.isArray(ranges) ? ranges : [];
            const range = safeRanges[rangeIdx];
            if (!range) return;
            if (inputMode === "none") return;

            const tempUTC = parseLocalInputParts(
                val,
                timezone,
                slotIdx,
                timezoneId,
                inputMode,
                () => invokeDep("getMultiRangeSlotDate", rangeIdx, slotIdx)
            );
            if (!tempUTC) {
                showInvalidDateFeedback(true);
                return;
            }

            const utcDate = resolveUtcDateForZone(
                tempUTC,
                timezone,
                timezoneId,
                new Date(range.startUtcMs)
            );
            if (!isValidDate(utcDate)) return;
            invokeDep("setMultiRangeSlotDate", rangeIdx, slotIdx, utcDate);

            if (slotIdx === 1) {
                invokeDep("syncFollowingRangesByDuration", rangeIdx);
            } else if (rangeIdx === 0) {
                invokeDep("syncMultiRangeStartLinks", 1);
            }

            invokeDep("renderMultiRanges");
            invokeDep("savePersistence");
        }

        return Object.freeze({
            resolveLocalDatePartsByTimezoneAtDate,
            resolveLocalDatePartsByTimezone,
            buildStrictUtcDateFromParts,
            handleTimeChange,
            handleMultiRangeTimeChange
        });
    }

    globalObj.GTVTimeInputMutations = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/timer-engine.js ---
(function initGtvTimerEngine(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const setIntervalFn = (typeof safeDeps.setIntervalFn === "function")
            ? safeDeps.setIntervalFn
            : ((fn, ms) => setInterval(fn, ms));
        const clearIntervalFn = (typeof safeDeps.clearIntervalFn === "function")
            ? safeDeps.clearIntervalFn
            : ((id) => clearInterval(id));
        let realtimeIntervalId = null;

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (_err) {
                return undefined;
            }
        }

        function getTickIntervalMs(overrideMs = null) {
            const fallback = Number.isFinite(Number(safeDeps.DEFAULT_REALTIME_TICK_MS))
                ? Math.max(100, Math.trunc(Number(safeDeps.DEFAULT_REALTIME_TICK_MS)))
                : 1000;
            const parsed = Number(overrideMs);
            return Number.isFinite(parsed) ? Math.max(100, Math.trunc(parsed)) : fallback;
        }

        function runRealtimeTick() {
            const shouldTick = invokeDep("shouldTick");
            if (shouldTick === false) return false;
            invokeDep("onTick");
            return true;
        }

        function stopRealtimeTicker() {
            if (realtimeIntervalId === null) return false;
            clearIntervalFn(realtimeIntervalId);
            realtimeIntervalId = null;
            return true;
        }

        function startRealtimeTicker(options = {}) {
            const { intervalMs = null } = options;
            const tickIntervalMs = getTickIntervalMs(intervalMs);
            stopRealtimeTicker();
            realtimeIntervalId = setIntervalFn(() => {
                runRealtimeTick();
            }, tickIntervalMs);
            return realtimeIntervalId;
        }

        function restartRealtimeTicker(options = {}) {
            stopRealtimeTicker();
            return startRealtimeTicker(options);
        }

        function isRealtimeTickerRunning() {
            return realtimeIntervalId !== null;
        }

        return Object.freeze({
            getTickIntervalMs,
            runRealtimeTick,
            startRealtimeTicker,
            stopRealtimeTicker,
            restartRealtimeTicker,
            isRealtimeTickerRunning
        });
    }

    globalObj.GTVTimerEngine = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/time-service.js ---
/**
 * GTVTimeService Module
 * Provides high-level time manipulation and state management using Luxon.
 */
(function initGtvTimeService(globalObj) {
    "use strict";

    function createService(deps) {
        const DateTime = deps?.luxon?.DateTime;

        function hasLuxonDateTime() {
            return !!DateTime
                && typeof DateTime.fromJSDate === "function"
                && typeof DateTime.fromISO === "function"
                && typeof DateTime.fromMillis === "function"
                && typeof DateTime.fromObject === "function";
        }

        function toDateObject(value) {
            if (value instanceof Date && Number.isFinite(value.getTime())) return new Date(value.getTime());
            const parsed = new Date(value);
            if (Number.isFinite(parsed.getTime())) return parsed;
            return new Date();
        }

        function getCustomOffsetMinutes(fixedOffsetMinutes) {
            return Number.isFinite(fixedOffsetMinutes) ? Math.trunc(fixedOffsetMinutes) : 0;
        }

        function toOffsetShiftedDate(date, offsetMinutes) {
            const safeDate = toDateObject(date);
            return new Date(safeDate.getTime() + (offsetMinutes * 60000));
        }

        function fromOffsetShiftedDate(date, offsetMinutes) {
            const safeDate = toDateObject(date);
            return new Date(safeDate.getTime() - (offsetMinutes * 60000));
        }

        function toFallbackDateTime(date, zone = "UTC", fixedOffsetMinutes = null) {
            const safeDate = toDateObject(date);
            const useCustomOffset = zone === "CUSTOM" || Number.isFinite(fixedOffsetMinutes);
            const offset = useCustomOffset ? getCustomOffsetMinutes(fixedOffsetMinutes) : 0;
            const shifted = toOffsetShiftedDate(safeDate, offset);
            const jsWeekday = shifted.getUTCDay();
            const luxonWeekday = jsWeekday === 0 ? 7 : jsWeekday;
            return {
                year: shifted.getUTCFullYear(),
                month: shifted.getUTCMonth() + 1,
                day: shifted.getUTCDate(),
                hour: shifted.getUTCHours(),
                minute: shifted.getUTCMinutes(),
                second: shifted.getUTCSeconds(),
                offset,
                weekday: luxonWeekday,
                toJSDate() {
                    return new Date(safeDate.getTime());
                }
            };
        }

        function toValidInt(value, fallback = 0) {
            const parsed = Number(value);
            return Number.isFinite(parsed) ? Math.trunc(parsed) : fallback;
        }

        function applyDeltaToDate(date, delta = {}) {
            const next = new Date(toDateObject(date).getTime());
            if (delta.hours) next.setUTCHours(next.getUTCHours() + toValidInt(delta.hours, 0));
            if (delta.days) next.setUTCDate(next.getUTCDate() + toValidInt(delta.days, 0));
            if (delta.weeks) next.setUTCDate(next.getUTCDate() + (toValidInt(delta.weeks, 0) * 7));
            return next;
        }

        /**
         * Converts a JS Date to a Luxon DateTime in the specified timezone.
         */
        function toDateTime(date, zone = "UTC", fixedOffsetMinutes = null) {
            if (hasLuxonDateTime()) {
                const safeDate = toDateObject(date);
                let dt = DateTime.fromJSDate(safeDate);
                if (zone === "CUSTOM" || Number.isFinite(fixedOffsetMinutes)) {
                    const offset = getCustomOffsetMinutes(fixedOffsetMinutes);
                    return dt.toUTC().plus({ minutes: offset });
                }
                try {
                    return dt.setZone(zone || "UTC");
                } catch (_err) {
                    return dt.setZone("UTC");
                }
            }
            return toFallbackDateTime(date, zone, fixedOffsetMinutes);
        }

        /**
         * Resolves local date parts (Y, M, D) for a given timezone.
         */
        function resolveLocalDateParts(date, zone, timezoneId = null, fixedOffsetMinutes = null) {
            const dt = toDateTime(date, zone, fixedOffsetMinutes);
            return {
                Y: Number.isFinite(dt?.year) ? dt.year : 1970,
                M: Number.isFinite(dt?.month) ? dt.month : 1,
                D: Number.isFinite(dt?.day) ? dt.day : 1,
                H: Number.isFinite(dt?.hour) ? dt.hour : 0,
                min: Number.isFinite(dt?.minute) ? dt.minute : 0,
                S: Number.isFinite(dt?.second) ? dt.second : 0
            };
        }

        /**
         * Shifts a date by the specified period.
         */
        function shiftDate(date, delta = {}, zone = "UTC", fixedOffsetMinutes = null) {
            if (hasLuxonDateTime()) {
                let dt = toDateTime(date, zone, fixedOffsetMinutes);
                if (delta.hours) dt = dt.plus({ hours: toValidInt(delta.hours, 0) });
                if (delta.days) dt = dt.plus({ days: toValidInt(delta.days, 0) });
                if (delta.weeks) dt = dt.plus({ weeks: toValidInt(delta.weeks, 0) });

                if (zone === "CUSTOM" || Number.isFinite(fixedOffsetMinutes)) {
                    const offset = getCustomOffsetMinutes(fixedOffsetMinutes);
                    return dt.minus({ minutes: offset }).toJSDate();
                }
                return dt.toJSDate();
            }

            const useCustomOffset = zone === "CUSTOM" || Number.isFinite(fixedOffsetMinutes);
            if (useCustomOffset) {
                const offset = getCustomOffsetMinutes(fixedOffsetMinutes);
                const shifted = toOffsetShiftedDate(date, offset);
                const moved = applyDeltaToDate(shifted, delta);
                return fromOffsetShiftedDate(moved, offset);
            }
            return applyDeltaToDate(date, delta);
        }

        /**
         * Calculates the signed day span between two date strings (YYYY-MM-DD).
         */
        function getDaySpan(startStr, endStr) {
            const startIso = (typeof startStr === "string") ? startStr.split(" ")[0] : "";
            const endIso = (typeof endStr === "string") ? endStr.split(" ")[0] : "";
            if (!startIso || !endIso) return null;

            if (hasLuxonDateTime()) {
                const start = DateTime.fromISO(startIso);
                const end = DateTime.fromISO(endIso);
                if (!start.isValid || !end.isValid) return null;
                const diff = end.diff(start, "days").days;
                return (diff >= 0 ? 1 : -1) * (Math.abs(Math.floor(diff)) + 1);
            }

            const start = new Date(`${startIso}T00:00:00Z`);
            const end = new Date(`${endIso}T00:00:00Z`);
            if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime())) return null;
            const diff = (end.getTime() - start.getTime()) / 86400000;
            return (diff >= 0 ? 1 : -1) * (Math.abs(Math.floor(diff)) + 1);
        }

        /**
         * Formats duration between two dates.
         */
        function formatDuration(startMs, endMs, lang = "en") {
            const safeStartMs = Number(startMs);
            const safeEndMs = Number(endMs);
            if (!Number.isFinite(safeStartMs) || !Number.isFinite(safeEndMs)) return "";

            const sign = safeEndMs < safeStartMs ? "-" : "";
            let d = 0;
            let h = 0;
            let m = 0;

            if (hasLuxonDateTime()) {
                const start = DateTime.fromMillis(safeStartMs);
                const end = DateTime.fromMillis(safeEndMs);
                const diff = end.diff(start, ["days", "hours", "minutes"]).toObject();
                d = Math.abs(Math.floor(diff.days || 0));
                h = Math.abs(Math.floor(diff.hours || 0));
                m = Math.abs(Math.floor(diff.minutes || 0));
            } else {
                const totalMinutes = Math.floor(Math.abs(safeEndMs - safeStartMs) / 60000);
                d = Math.floor(totalMinutes / (24 * 60));
                h = Math.floor((totalMinutes % (24 * 60)) / 60);
                m = totalMinutes % 60;
            }

            if (lang === "ko") {
                return `${sign}${d}\uC77C ${h}\uC2DC\uAC04 ${m}\uBD84`;
            }
            return `${sign}${d}d ${h}h ${m}m`;
        }

        /**
         * Adjusts a date based on specific actions (midnight, sharp_hour, etc.)
         */
        function adjustDate(date, action, zone = "UTC", fixedOffsetMinutes = null, customDays = 1) {
            if (action === "now") return new Date();

            const safeCustomDays = Math.max(0, Math.abs(toValidInt(customDays, 1)));
            const useCustomOffset = zone === "CUSTOM" || Number.isFinite(fixedOffsetMinutes);
            const offset = getCustomOffsetMinutes(fixedOffsetMinutes);

            if (hasLuxonDateTime()) {
                let dt = toDateTime(date, zone, fixedOffsetMinutes);
                switch (action) {
                    case "midnight":
                        dt = dt.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
                        break;
                    case "sharp_hour":
                        dt = dt.set({ minute: 0, second: 0, millisecond: 0 });
                        break;
                    case "plus_hour":
                        dt = dt.plus({ hours: 1 });
                        break;
                    case "minus_hour":
                        dt = dt.minus({ hours: 1 });
                        break;
                    case "plus_day":
                        dt = dt.plus({ days: 1 });
                        break;
                    case "minus_day":
                        dt = dt.minus({ days: 1 });
                        break;
                    case "plus_week":
                        dt = dt.plus({ weeks: 1 });
                        break;
                    case "minus_week":
                        dt = dt.minus({ weeks: 1 });
                        break;
                    case "plus_four_weeks":
                        dt = dt.plus({ weeks: 4 });
                        break;
                    case "minus_four_weeks":
                        dt = dt.minus({ weeks: 4 });
                        break;
                    case "plus_custom_days":
                        dt = dt.plus({ days: safeCustomDays });
                        break;
                    case "minus_custom_days":
                        dt = dt.minus({ days: safeCustomDays });
                        break;
                    default:
                        return toDateObject(date);
                }

                if (useCustomOffset) {
                    return dt.minus({ minutes: offset }).toJSDate();
                }
                return dt.toJSDate();
            }

            const shifted = useCustomOffset ? toOffsetShiftedDate(date, offset) : toDateObject(date);
            switch (action) {
                case "midnight":
                    shifted.setUTCHours(0, 0, 0, 0);
                    break;
                case "sharp_hour":
                    shifted.setUTCMinutes(0, 0, 0);
                    break;
                case "plus_hour":
                    shifted.setUTCHours(shifted.getUTCHours() + 1);
                    break;
                case "minus_hour":
                    shifted.setUTCHours(shifted.getUTCHours() - 1);
                    break;
                case "plus_day":
                    shifted.setUTCDate(shifted.getUTCDate() + 1);
                    break;
                case "minus_day":
                    shifted.setUTCDate(shifted.getUTCDate() - 1);
                    break;
                case "plus_week":
                    shifted.setUTCDate(shifted.getUTCDate() + 7);
                    break;
                case "minus_week":
                    shifted.setUTCDate(shifted.getUTCDate() - 7);
                    break;
                case "plus_four_weeks":
                    shifted.setUTCDate(shifted.getUTCDate() + 28);
                    break;
                case "minus_four_weeks":
                    shifted.setUTCDate(shifted.getUTCDate() - 28);
                    break;
                case "plus_custom_days":
                    shifted.setUTCDate(shifted.getUTCDate() + safeCustomDays);
                    break;
                case "minus_custom_days":
                    shifted.setUTCDate(shifted.getUTCDate() - safeCustomDays);
                    break;
                default:
                    return toDateObject(date);
            }

            return useCustomOffset ? fromOffsetShiftedDate(shifted, offset) : shifted;
        }

        /**
         * Converts local date/time parts to UTC JS Date.
         * @param {{year, month, day, hour, minute, second}} parts local time parts
         * @param {string} zone IANA zone name or "UTC"/"CUSTOM"
         * @param {number|null} fixedOffsetMinutes fixed offset in minutes when using CUSTOM
         */
        function fromLocalPartsToUtc(parts, zone = "UTC", fixedOffsetMinutes = null) {
            const safeParts = {
                year: toValidInt(parts?.year, 1970),
                month: Math.min(12, Math.max(1, toValidInt(parts?.month, 1))),
                day: Math.min(31, Math.max(1, toValidInt(parts?.day, 1))),
                hour: Math.min(23, Math.max(0, toValidInt(parts?.hour, 0))),
                minute: Math.min(59, Math.max(0, toValidInt(parts?.minute, 0))),
                second: Math.min(59, Math.max(0, toValidInt(parts?.second, 0)))
            };

            if (hasLuxonDateTime()) {
                if (!zone || zone === "UTC") {
                    return DateTime.fromObject(safeParts, { zone: "UTC" }).toJSDate();
                }
                if (zone === "CUSTOM" || Number.isFinite(fixedOffsetMinutes)) {
                    const offset = getCustomOffsetMinutes(fixedOffsetMinutes);
                    return DateTime.fromObject(safeParts, { zone: "UTC" }).minus({ minutes: offset }).toJSDate();
                }
                try {
                    return DateTime.fromObject(safeParts, { zone }).toUTC().toJSDate();
                } catch (_err) {
                    return DateTime.fromObject(safeParts, { zone: "UTC" }).toJSDate();
                }
            }

            const utcMs = Date.UTC(
                safeParts.year,
                safeParts.month - 1,
                safeParts.day,
                safeParts.hour,
                safeParts.minute,
                safeParts.second
            );
            if (zone === "CUSTOM" || Number.isFinite(fixedOffsetMinutes)) {
                const offset = getCustomOffsetMinutes(fixedOffsetMinutes);
                return new Date(utcMs - (offset * 60000));
            }
            return new Date(utcMs);
        }

        return Object.freeze({
            toDateTime,
            resolveLocalDateParts,
            shiftDate,
            adjustDate,
            getDaySpan,
            formatDuration,
            fromLocalPartsToUtc
        });
    }

    globalObj.GTVTimeService = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/timezone-data.js ---
(function initGtvTimezoneData(globalObj) {
    "use strict";

    const TZ_DATABASE = Object.freeze([
        { zone: "Asia/Seoul", name: "\uB300\uD55C\uBBFC\uAD6D", city: "\uC11C\uC6B8", name_en: "South Korea", city_en: "Seoul" },
        { zone: "Asia/Tokyo", name: "\uC77C\uBCF8", city: "\uB3C4\uCFC4", name_en: "Japan", city_en: "Tokyo" },
        { zone: "Asia/Shanghai", name: "\uC911\uAD6D", city: "\uC0C1\uD558\uC774", name_en: "China", city_en: "Shanghai" },
        { zone: "Asia/Hong_Kong", name: "\uD64D\uCF69", city: "\uD64D\uCF69", name_en: "Hong Kong", city_en: "Hong Kong" },
        { zone: "Asia/Singapore", name: "\uC2F1\uAC00\uD3EC\uB974", city: "\uC2F1\uAC00\uD3EC\uB974", name_en: "Singapore", city_en: "Singapore" },
        { zone: "Asia/Taipei", name: "\uB300\uB9CC", city: "\uD0C0\uC774\uBCA0\uC774", name_en: "Taiwan", city_en: "Taipei" },
        { zone: "Asia/Bangkok", name: "\uD0DC\uAD6D", city: "\uBC29\uCF55", name_en: "Thailand", city_en: "Bangkok" },
        { zone: "Asia/Ho_Chi_Minh", name: "\uBCA0\uD2B8\uB0A8", city: "\uD638\uCE58\uBBFC", name_en: "Vietnam", city_en: "Ho Chi Minh" },
        { zone: "Asia/Jakarta", name: "\uC778\uB3C4\uB124\uC2DC\uC544", city: "\uC790\uCE74\uB974\uD0C0", name_en: "Indonesia", city_en: "Jakarta" },
        { zone: "Asia/Dubai", name: "\uC544\uB78D\uC5D0\uBBF8\uB9AC\uD2B8", city: "\uB450\uBC14\uC774", name_en: "UAE", city_en: "Dubai" },
        { zone: "Asia/Kolkata", name: "\uC778\uB3C4", city: "\uB274\uB378\uB9AC", name_en: "India", city_en: "New Delhi" },
        { zone: "Europe/London", name: "\uC601\uAD6D", city: "\uB7F0\uB358", name_en: "UK", city_en: "London" },
        { zone: "Europe/Paris", name: "\uD504\uB791\uC2A4", city: "\uD30C\uB9AC", name_en: "France", city_en: "Paris" },
        { zone: "Europe/Berlin", name: "\uB3C5\uC77C", city: "\uBCA0\uB97C\uB9B0", name_en: "Germany", city_en: "Berlin" },
        { zone: "Europe/Moscow", name: "\uB7EC\uC2DC\uC544", city: "\uBAA8\uC2A4\uD06C\uBC14", name_en: "Russia", city_en: "Moscow" },
        { zone: "Europe/Istanbul", name: "\uD280\uB974\uD0A4\uC608", city: "\uC774\uC2A4\uD0C4\uBD88", name_en: "Turkey", city_en: "Istanbul" },
        { zone: "America/New_York", name: "\uBBF8\uAD6D", city: "\uB274\uC695", name_en: "USA", city_en: "New York" },
        { zone: "America/Chicago", name: "\uBBF8\uAD6D", city: "\uC2DC\uCE74\uACE0", name_en: "USA", city_en: "Chicago" },
        { zone: "America/Los_Angeles", name: "\uBBF8\uAD6D", city: "\uB85C\uC2A4\uC564\uC824\uB808\uC2A4", name_en: "USA", city_en: "Los Angeles" },
        { zone: "America/Mexico_City", name: "\uBA55\uC2DC\uCF54", city: "\uBA55\uC2DC\uCF54\uC2DC\uD2F0", name_en: "Mexico", city_en: "Mexico City" },
        { zone: "America/Sao_Paulo", name: "\uBE0C\uB77C\uC9C8", city: "\uC0C1\uD30C\uC6B8\uB8E8", name_en: "Brazil", city_en: "Sao Paulo" },
        { zone: "Australia/Sydney", name: "\uD638\uC8FC", city: "\uC2DC\uB4DC\uB2C8", name_en: "Australia", city_en: "Sydney" },
        { zone: "Australia/Perth", name: "\uD638\uC8FC", city: "\uD37C\uC2A4", name_en: "Australia", city_en: "Perth" },
        { zone: "Pacific/Auckland", name: "\uB274\uC9C8\uB79C\uB4DC", city: "\uC624\uD074\uB79C\uB4DC", name_en: "New Zealand", city_en: "Auckland" }
    ]);

    const ZONE_MAP = Object.freeze({
        "Asia/Seoul": "KST", "Asia/Tokyo": "JST", "Asia/Shanghai": "CST", "Asia/Hong_Kong": "HKT",
        "Asia/Singapore": "SGT", "Asia/Taipei": "CST", "Asia/Bangkok": "ICT", "Asia/Dubai": "GST",
        "Europe/Paris": ["CET", "CEST"], "Europe/London": ["GMT", "BST"], "Europe/Berlin": ["CET", "CEST"],
        "Europe/Moscow": "MSK", "Europe/Istanbul": "TRT", "America/New_York": ["EST", "EDT"],
        "America/Chicago": ["CST", "CDT"], "America/Los_Angeles": ["PST", "PDT"], "America/Sao_Paulo": "BRT",
        "Australia/Sydney": ["AEST", "AEDT"], "Australia/Perth": "AWST", "Pacific/Auckland": ["NZST", "NZDT"], "UTC": "UTC"
    });

    globalObj.GTVTimezoneData = Object.freeze({
        TZ_DATABASE,
        ZONE_MAP
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/calculator.js ---
(function initGtvCalculator(globalObj) {
    "use strict";

    const COUNTDOWN_SLOT_COUNT = 3;
    const COUNTDOWN_STORAGE_KEY = "GTV_CalcCountdown_v1";

    let countdownState = [];
    let countdownTimerId = null;
    let unixTimerId = null;

    const GTV_TIME_CORE = globalObj?.GTVTimeCore || null;
    const LuxonDateTime = globalObj?.luxon?.DateTime || null;
    const storage = globalObj?.localStorage || (typeof localStorage !== "undefined" ? localStorage : null);
    const doc = globalObj?.document || (typeof document !== "undefined" ? document : null);
    const pad2 = (typeof GTV_TIME_CORE?.pad === "function")
        ? GTV_TIME_CORE.pad
        : ((value) => String(Math.max(0, Math.trunc(Number(value) || 0))).padStart(2, "0"));

    function getElementById(id) {
        if (!doc || typeof doc.getElementById !== "function") return null;
        return doc.getElementById(id);
    }

    function querySelector(selector) {
        if (!doc || typeof doc.querySelector !== "function") return null;
        return doc.querySelector(selector);
    }

    function querySelectorAll(selector) {
        if (!doc || typeof doc.querySelectorAll !== "function") return [];
        return Array.from(doc.querySelectorAll(selector) || []);
    }

    function getCurrentLang() {
        const lang = doc?.documentElement?.lang;
        return (typeof lang === "string" && lang.trim()) ? lang : "en";
    }

    function getCurrentTheme() {
        const theme = doc?.documentElement?.getAttribute?.("data-theme");
        return (typeof theme === "string" && theme.trim()) ? theme : "dark";
    }

    function isCalculatorTabActive() {
        const calcSection = getElementById("calc-section");
        if (!calcSection?.classList || typeof calcSection.classList.contains !== "function") {
            return true;
        }
        return calcSection.classList.contains("active");
    }

    function toValidDate(value) {
        if (!value) return null;
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    function formatDateOnly(dateObj) {
        const year = dateObj.getFullYear();
        const month = pad2(dateObj.getMonth() + 1);
        const day = pad2(dateObj.getDate());
        return `${year}-${month}-${day}`;
    }

    function formatDateTimeForInput(dateObj) {
        const year = dateObj.getFullYear();
        const month = pad2(dateObj.getMonth() + 1);
        const day = pad2(dateObj.getDate());
        const hour = pad2(dateObj.getHours());
        const minute = pad2(dateObj.getMinutes());
        const second = pad2(dateObj.getSeconds());
        return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    }

    function formatLocalDateTime(dateObj) {
        const year = dateObj.getFullYear();
        const month = pad2(dateObj.getMonth() + 1);
        const day = pad2(dateObj.getDate());
        const hour = pad2(dateObj.getHours());
        const minute = pad2(dateObj.getMinutes());
        const second = pad2(dateObj.getSeconds());
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }

    function formatUTCDateTime(dateObj) {
        const year = dateObj.getUTCFullYear();
        const month = pad2(dateObj.getUTCMonth() + 1);
        const day = pad2(dateObj.getUTCDate());
        const hour = pad2(dateObj.getUTCHours());
        const minute = pad2(dateObj.getUTCMinutes());
        const second = pad2(dateObj.getUTCSeconds());
        return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
    }

    function initConverter() {
        const secIn = getElementById("conv-sec");
        const minIn = getElementById("conv-min");
        const hourIn = getElementById("conv-hour");
        const dayIn = getElementById("conv-day");
        if (!secIn || !minIn || !hourIn || !dayIn) return;

        const allInputs = [secIn, minIn, hourIn, dayIn];

        const updateFrom = (rawValue, unit) => {
            const numericValue = Number(rawValue);
            if (rawValue === "" || Number.isNaN(numericValue)) {
                allInputs.forEach((input) => {
                    input.value = "";
                });
                return;
            }

            let baseSec = 0;
            if (unit === "sec") baseSec = numericValue;
            if (unit === "min") baseSec = numericValue * 60;
            if (unit === "hour") baseSec = numericValue * 3600;
            if (unit === "day") baseSec = numericValue * 86400;

            if (unit !== "sec") secIn.value = String(Number(baseSec.toFixed(4)));
            if (unit !== "min") minIn.value = String(Number((baseSec / 60).toFixed(4)));
            if (unit !== "hour") hourIn.value = String(Number((baseSec / 3600).toFixed(4)));
            if (unit !== "day") dayIn.value = String(Number((baseSec / 86400).toFixed(4)));
        };

        secIn.oninput = (e) => updateFrom(e.target.value, "sec");
        minIn.oninput = (e) => updateFrom(e.target.value, "min");
        hourIn.oninput = (e) => updateFrom(e.target.value, "hour");
        dayIn.oninput = (e) => updateFrom(e.target.value, "day");
    }

    function bindCopyButtons(copyText, copyBindings) {
        if (!Array.isArray(copyBindings)) return;
        copyBindings.forEach(([btnId, targetId, isInput]) => {
            const btn = getElementById(btnId);
            if (!btn) return;
            btn.addEventListener("click", () => copyText(targetId, isInput));
        });
    }

    function buildCountdownDefaultName(slotIdx, t) {
        const prefix = (t("calc_countdown_default_prefix") || "Countdown").trim() || "Countdown";
        return `${prefix} ${slotIdx + 1}`;
    }

    function loadCountdownState() {
        try {
            if (!storage || typeof storage.getItem !== "function") return null;
            const raw = storage.getItem(COUNTDOWN_STORAGE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : null;
        } catch (err) {
            return null;
        }
    }

    function saveCountdownState() {
        try {
            if (!storage || typeof storage.setItem !== "function") return;
            storage.setItem(COUNTDOWN_STORAGE_KEY, JSON.stringify(countdownState));
        } catch (err) {
            // Ignore storage errors for calculator-only helper state.
        }
    }

    function normalizeCountdownState(persisted, t) {
        const base = Array.isArray(persisted) ? persisted : [];
        const next = [];
        for (let i = 0; i < COUNTDOWN_SLOT_COUNT; i++) {
            const source = base[i] || {};
            const hasCustomName = !!source.nameIsCustom;
            const fallbackName = buildCountdownDefaultName(i, t);
            const rawName = (typeof source.name === "string") ? source.name.trim() : "";
            next.push({
                name: rawName || fallbackName,
                nameIsCustom: hasCustomName && !!rawName,
                targetIso: (typeof source.targetIso === "string") ? source.targetIso : "",
                active: !!source.active,
                pausedRemainingMs: Number.isFinite(source.pausedRemainingMs)
                    ? Math.max(0, Math.floor(source.pausedRemainingMs))
                    : null
            });
        }
        return next;
    }

    function parseCountdownRemainingMs(slot, nowMs) {
        if (!slot) return null;
        if (slot.active && slot.targetIso) {
            const targetMs = Date.parse(slot.targetIso);
            if (!Number.isFinite(targetMs)) return null;
            return targetMs - nowMs;
        }
        if (Number.isFinite(slot.pausedRemainingMs)) return slot.pausedRemainingMs;
        if (slot.targetIso) {
            const targetMs = Date.parse(slot.targetIso);
            if (!Number.isFinite(targetMs)) return null;
            return Math.max(0, targetMs - nowMs);
        }
        return null;
    }

    function formatCountdownText(remainingMs, t) {
        const clampedMs = Math.max(0, Math.floor(remainingMs));
        const totalSeconds = Math.floor(clampedMs / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const daySuffix = t("calc_countdown_day_suffix") || "d";
        return `${pad2(days)}${daySuffix} ${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
    }

    function renderCountdownSlot(slotIdx, refs, t, options = {}) {
        const { syncMeta = false } = options;
        const slot = countdownState[slotIdx];
        const nameBtn = refs.nameButtons[slotIdx];
        const nameInput = refs.nameInputs[slotIdx];
        const toggleBtn = refs.toggleButtons[slotIdx];
        const targetInput = refs.targetInputs[slotIdx];
        const displayEl = refs.displayEls[slotIdx];
        const statusEl = refs.statusEls[slotIdx];
        if (!slot || !nameBtn || !nameInput || !toggleBtn || !targetInput || !displayEl || !statusEl) return;

        if (syncMeta) {
            if (!slot.nameIsCustom) {
                slot.name = buildCountdownDefaultName(slotIdx, t);
            }
            nameBtn.textContent = slot.name;
            if (nameInput.style.display === "none") {
                nameInput.value = slot.name;
            }

            const DatePickerCtor = globalObj?.CustomDatePicker;
            if (typeof DatePickerCtor === "function" && !targetInput._cdp) {
                targetInput._cdp = new DatePickerCtor(targetInput, {
                    type: "datetime",
                    lang: getCurrentLang(),
                    theme: getCurrentTheme(),
                    triggerElement: querySelector(`.trigger-cd-${slotIdx}`) || null
                });
            }

            if (slot.targetIso) {
                const targetDate = toValidDate(slot.targetIso);
                if (targetInput._cdp) {
                    if (targetDate) targetInput._cdp.setDate(targetDate);
                    else targetInput._cdp.setDate(null);
                } else {
                    targetInput.value = targetDate ? formatDateTimeForInput(targetDate) : "";
                }
            } else {
                if (targetInput._cdp) targetInput._cdp.setDate(null);
                else targetInput.value = "";
            }
        }

        const nowMs = Date.now();
        let remainingMs = parseCountdownRemainingMs(slot, nowMs);
        let expired = false;

        if (slot.active && Number.isFinite(remainingMs) && remainingMs <= 0) {
            slot.active = false;
            slot.pausedRemainingMs = 0;
            remainingMs = 0;
            expired = true;
            saveCountdownState();
        }

        if (!Number.isFinite(remainingMs)) {
            toggleBtn.textContent = slot.active ? t("calc_countdown_stop") : t("calc_countdown_start");
            displayEl.textContent = formatCountdownText(0, t);
            displayEl.classList.remove("expired");
            statusEl.textContent = "";
            statusEl.classList.remove("expired");
            return;
        }

        displayEl.textContent = formatCountdownText(remainingMs, t);
        if (expired || (!slot.active && remainingMs === 0 && !!slot.targetIso)) {
            displayEl.classList.add("expired");
            statusEl.classList.add("expired");
            statusEl.textContent = t("calc_countdown_expired");
        } else {
            displayEl.classList.remove("expired");
            statusEl.classList.remove("expired");
            statusEl.textContent = "";
        }
        toggleBtn.textContent = slot.active ? t("calc_countdown_stop") : t("calc_countdown_start");
    }

    function initCountdown(t) {
        const nameButtons = querySelectorAll(".countdown-name-btn");
        const nameInputs = querySelectorAll(".countdown-name-input");
        const toggleButtons = querySelectorAll(".countdown-toggle-btn");
        const targetInputs = querySelectorAll(".countdown-target-input");
        const displayEls = querySelectorAll(".countdown-display");
        const statusEls = querySelectorAll(".countdown-status");
        if (
            nameButtons.length < COUNTDOWN_SLOT_COUNT ||
            nameInputs.length < COUNTDOWN_SLOT_COUNT ||
            toggleButtons.length < COUNTDOWN_SLOT_COUNT ||
            targetInputs.length < COUNTDOWN_SLOT_COUNT ||
            displayEls.length < COUNTDOWN_SLOT_COUNT ||
            statusEls.length < COUNTDOWN_SLOT_COUNT
        ) {
            return { refresh: () => { } };
        }

        countdownState = normalizeCountdownState(loadCountdownState(), t);
        const refs = { nameButtons, nameInputs, toggleButtons, targetInputs, displayEls, statusEls };

        for (let i = 0; i < COUNTDOWN_SLOT_COUNT; i++) {
            const nameBtn = nameButtons[i];
            const nameInput = nameInputs[i];
            const targetInput = targetInputs[i];

            const closeNameEditor = (commit) => {
                if (nameInput.style.display === "none") return;

                if (commit) {
                    const trimmed = String(nameInput.value || "").trim();
                    if (!trimmed) {
                        countdownState[i].name = buildCountdownDefaultName(i, t);
                        countdownState[i].nameIsCustom = false;
                    } else {
                        countdownState[i].name = trimmed;
                        countdownState[i].nameIsCustom = true;
                    }
                    saveCountdownState();
                }

                nameInput.style.display = "none";
                nameBtn.style.display = "inline-flex";
                renderCountdownSlot(i, refs, t, { syncMeta: true });
            };

            nameBtn.addEventListener("click", () => {
                nameInput.value = countdownState[i].name || buildCountdownDefaultName(i, t);
                nameBtn.style.display = "none";
                nameInput.style.display = "block";
                nameInput.focus();
                nameInput.select();
            });

            nameInput.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    closeNameEditor(true);
                    nameInput.blur();
                    return;
                }
                if (event.key === "Escape") {
                    event.preventDefault();
                    closeNameEditor(false);
                    nameInput.blur();
                }
            });

            nameInput.addEventListener("blur", () => {
                closeNameEditor(true);
            });

            targetInput.addEventListener("change", () => {
                const parsed = targetInput._cdp && targetInput._cdp.selectedDate ? new Date(targetInput._cdp.selectedDate) : toValidDate(targetInput.value);
                if (!parsed) {
                    countdownState[i].targetIso = "";
                    countdownState[i].active = false;
                    countdownState[i].pausedRemainingMs = null;
                } else {
                    countdownState[i].targetIso = parsed.toISOString();
                    countdownState[i].pausedRemainingMs = null;
                    if (!countdownState[i].active) {
                        const nowMs = Date.now();
                        countdownState[i].pausedRemainingMs = Math.max(0, parsed.getTime() - nowMs);
                    }
                }
                renderCountdownSlot(i, refs, t, { syncMeta: true });
                saveCountdownState();
            });
        }

        querySelectorAll(".countdown-slot-controls .sm-btn[data-action]").forEach((btn) => {
            const slotIdx = Number(btn.getAttribute("data-slot"));
            const action = btn.getAttribute("data-action");
            if (!Number.isInteger(slotIdx) || slotIdx < 0 || slotIdx >= COUNTDOWN_SLOT_COUNT) return;
            const targetInput = targetInputs[slotIdx];

            btn.addEventListener("click", () => {
                const slot = countdownState[slotIdx];
                if (!slot) return;

                if (action === "toggle") {
                    if (slot.active) {
                        const remainingMs = parseCountdownRemainingMs(slot, Date.now());
                        slot.active = false;
                        slot.pausedRemainingMs = Number.isFinite(remainingMs)
                            ? Math.max(0, Math.floor(remainingMs))
                            : null;
                    } else {
                        const parsed = toValidDate(targetInput.value) || toValidDate(slot.targetIso);
                        if (!parsed) return;
                        slot.targetIso = parsed.toISOString();
                        slot.active = true;
                        slot.pausedRemainingMs = null;
                    }
                } else if (action === "reset") {
                    slot.targetIso = "";
                    slot.active = false;
                    slot.pausedRemainingMs = null;
                    targetInput.value = "";
                }

                renderCountdownSlot(slotIdx, refs, t, { syncMeta: true });
                saveCountdownState();
            });
        });

        if (countdownTimerId != null) {
            clearInterval(countdownTimerId);
            countdownTimerId = null;
        }
        countdownTimerId = setInterval(() => {
            if (!isCalculatorTabActive()) return;
            for (let i = 0; i < COUNTDOWN_SLOT_COUNT; i++) {
                renderCountdownSlot(i, refs, t);
            }
        }, 1000);

        for (let i = 0; i < COUNTDOWN_SLOT_COUNT; i++) {
            renderCountdownSlot(i, refs, t, { syncMeta: true });
        }

        return {
            refresh() {
                for (let i = 0; i < COUNTDOWN_SLOT_COUNT; i++) {
                    renderCountdownSlot(i, refs, t, { syncMeta: true });
                }
            }
        };
    }

    function initUnixTimestampConverter(t) {
        const unixNowValue = getElementById("unix-now-value");
        const unixNowMsValue = getElementById("unix-now-ms-value");
        const unixSyncNowBtn = getElementById("unix-sync-now-btn");
        const unixTsInput = getElementById("unix-ts-input");
        const unixTsMsInput = getElementById("unix-ts-ms-input");
        const unixIsoLocalInput = getElementById("unix-iso-local-input");
        const unixIsoUtcInput = getElementById("unix-iso-utc-input");
        const unixRfc2822Input = getElementById("unix-rfc2822-input");
        const unixSqlInput = getElementById("unix-sql-input");
        const unixHumanInput = getElementById("unix-human-input");
        const smartFormatRows = querySelectorAll(".smart-format-row");

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
            const month = pad2(dateObj.getMonth() + 1);
            const day = pad2(dateObj.getDate());
            const hour = pad2(dateObj.getHours());
            const minute = pad2(dateObj.getMinutes());
            const second = pad2(dateObj.getSeconds());
            const totalOffsetMinutes = -dateObj.getTimezoneOffset();
            const sign = totalOffsetMinutes >= 0 ? "+" : "-";
            const absOffset = Math.abs(totalOffsetMinutes);
            const offsetHour = pad2(Math.floor(absOffset / 60));
            const offsetMinute = pad2(absOffset % 60);
            return `${year}-${month}-${day}T${hour}:${minute}:${second}${sign}${offsetHour}:${offsetMinute}`;
        };

        const buildFieldValues = (epochMs) => {
            const safeEpochMs = Math.trunc(Number(epochMs));
            if (!Number.isFinite(safeEpochMs)) return null;

            if (LuxonDateTime && typeof LuxonDateTime.fromMillis === "function") {
                const utc = LuxonDateTime.fromMillis(safeEpochMs, { zone: "utc" });
                if (!utc.isValid) return null;
                const local = utc.toLocal().setLocale(getCurrentLang());
                return {
                    unixSec: String(Math.floor(safeEpochMs / 1000)),
                    unixMs: String(safeEpochMs),
                    isoLocal: local.toISO({ suppressMilliseconds: true, includeOffset: true }) || "",
                    isoUtc: utc.toISO({ suppressMilliseconds: true, includeOffset: true }) || "",
                    rfc2822: local.toRFC2822() || "",
                    sql: local.toFormat("yyyy-LL-dd HH:mm:ss"),
                    human: local.toLocaleString(LuxonDateTime.DATETIME_FULL_WITH_SECONDS)
                };
            }

            const dateObj = new Date(safeEpochMs);
            if (Number.isNaN(dateObj.getTime())) return null;
            const locale = getCurrentLang() === "ko" ? "ko-KR" : "en-US";
            return {
                unixSec: String(Math.floor(safeEpochMs / 1000)),
                unixMs: String(safeEpochMs),
                isoLocal: formatIsoLocalWithOffset(dateObj),
                isoUtc: formatUTCDateTime(dateObj),
                rfc2822: dateObj.toUTCString(),
                sql: formatLocalDateTime(dateObj),
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

        const setFieldValues = (values) => {
            if (!values) return;
            isSyncing = true;
            unixTsInput.value = values.unixSec;
            unixTsMsInput.value = values.unixMs;
            unixIsoLocalInput.value = values.isoLocal;
            unixIsoUtcInput.value = values.isoUtc;
            unixRfc2822Input.value = values.rfc2822;
            unixSqlInput.value = values.sql;
            unixHumanInput.value = values.human;
            isSyncing = false;
        };

        const renderInvalid = () => {
            hasValidEpoch = false;
            setRowsInvalid(true);
            const invalidText = t("calc_unix_invalid");
            setFieldValues({
                unixSec: invalidText,
                unixMs: invalidText,
                isoLocal: invalidText,
                isoUtc: invalidText,
                rfc2822: invalidText,
                sql: invalidText,
                human: invalidText
            });
        };

        const renderFromEpoch = (epochMs) => {
            const values = buildFieldValues(epochMs);
            if (!values) {
                renderInvalid();
                return;
            }
            hasValidEpoch = true;
            setRowsInvalid(false);
            setFieldValues(values);
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

            if (LuxonDateTime) {
                let parsed = null;
                if (key === "iso_local") {
                    parsed = LuxonDateTime.fromISO(raw, { setZone: true });
                    if (!parsed.isValid) parsed = LuxonDateTime.fromISO(raw, { zone: "local" });
                } else if (key === "iso_utc") {
                    parsed = LuxonDateTime.fromISO(raw, { setZone: true });
                    if (!parsed.isValid) parsed = LuxonDateTime.fromISO(raw, { zone: "utc" });
                } else if (key === "rfc2822") {
                    parsed = LuxonDateTime.fromRFC2822(raw, { setZone: true });
                } else if (key === "sql") {
                    parsed = LuxonDateTime.fromSQL(raw, { setZone: true });
                    if (!parsed.isValid) parsed = LuxonDateTime.fromFormat(raw, "yyyy-LL-dd HH:mm:ss", { zone: "local" });
                }
                if (parsed && parsed.isValid) return Math.trunc(parsed.toMillis());
            }

            if (key === "sql") {
                const sqlMatched = raw.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
                if (sqlMatched) {
                    const asDate = new Date(
                        Number(sqlMatched[1]),
                        Number(sqlMatched[2]) - 1,
                        Number(sqlMatched[3]),
                        Number(sqlMatched[4]),
                        Number(sqlMatched[5]),
                        Number(sqlMatched[6])
                    );
                    if (!Number.isNaN(asDate.getTime())) return asDate.getTime();
                }
            }

            const fallbackDate = new Date(raw);
            return Number.isNaN(fallbackDate.getTime()) ? null : fallbackDate.getTime();
        };

        const handleFieldInput = (key, fieldEl) => {
            if (isSyncing || !fieldEl) return;
            const parsedMs = parseFieldValue(key, fieldEl.value);
            if (!Number.isFinite(parsedMs)) {
                renderInvalid();
                return;
            }
            activeEpochMs = Math.trunc(parsedMs);
            renderFromEpoch(activeEpochMs);
        };

        const updateNow = () => {
            if (!isCalculatorTabActive()) return;
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
            el.addEventListener("input", () => handleFieldInput(key, el));
            el.addEventListener("change", () => handleFieldInput(key, el));
        });
        if (unixSyncNowBtn) unixSyncNowBtn.addEventListener("click", syncNow);

        if (unixTimerId != null) {
            clearInterval(unixTimerId);
            unixTimerId = null;
        }
        unixTimerId = setInterval(updateNow, 1000);

        syncNow();

        return {
            refresh() {
                updateNow();
                if (hasValidEpoch) renderFromEpoch(activeEpochMs);
                else renderInvalid();
            }
        };
    }

    function initPeriodAndDateShift(t) {
        const periodStart = getElementById("period-start");
        const periodEnd = getElementById("period-end");
        const periodSwapBtn = getElementById("period-swap-btn");
        const periodDayRes = getElementById("period-res");
        const periodHourRes = getElementById("period-hour-res");
        const periodMinRes = getElementById("period-min-res");
        const periodSecRes = getElementById("period-sec-res");

        const offsetStart = getElementById("offset-start");
        const offsetValueInput = getElementById("off-val");
        const offValMinus = getElementById("off-val-minus");
        const offValPlus = getElementById("off-val-plus");
        const offsetUnit = getElementById("off-unit");
        const offsetDirection = getElementById("off-dir");
        const offsetResult = getElementById("offset-res");

        if (
            !periodStart || !periodEnd || !periodDayRes || !periodHourRes || !periodMinRes || !periodSecRes ||
            !offsetStart || !offsetValueInput || !offsetUnit || !offsetDirection || !offsetResult
        ) {
            return { refresh: () => { } };
        }

        const applyPicker = (el, iconId) => {
            const DatePickerCtor = globalObj?.CustomDatePicker;
            if (typeof DatePickerCtor === "function" && !el._cdp) {
                el._cdp = new DatePickerCtor(el, {
                    type: "date",
                    lang: getCurrentLang(),
                    theme: getCurrentTheme(),
                    triggerElement: getElementById(iconId) || null
                });
            }
        };

        applyPicker(periodStart, "period-start-trigger");
        applyPicker(periodEnd, "period-end-trigger");
        applyPicker(offsetStart, "offset-start-trigger");

        // 기간 계산용: UTC 자정으로 파싱 (DST 경계 오류 방지)
        const getPickerDateUtc = (el) => {
            let val = el.value;
            // CDP가 있으면 해당 날짜 객체에서 YYYY-MM-DD 정보만 추출
            if (el._cdp && el._cdp.selectedDate) {
                const d = new Date(el._cdp.selectedDate);
                val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
            }

            if (val) {
                const parts = val.split("-");
                if (parts.length === 3) {
                    const y = parseInt(parts[0], 10);
                    const m = parseInt(parts[1], 10) - 1;
                    const d = parseInt(parts[2], 10);
                    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
                        return new Date(Date.UTC(y, m, d));
                    }
                }
            }
            return null;
        };


        // 날짜 이동 계산용: 로컬 자정으로 파싱 (setFullYear/setMonth 등 로컬 메서드와 일관성 유지)
        const getPickerDateLocal = (el) => {
            if (el._cdp && el._cdp.selectedDate) return new Date(el._cdp.selectedDate);
            if (el.value) return new Date(el.value + 'T00:00:00');
            return null;
        };

        const today = new Date();
        const todayText = formatDateOnly(today);
        if (!periodStart.value) periodStart.value = todayText;
        if (!periodEnd.value) periodEnd.value = todayText;
        if (!offsetStart.value) offsetStart.value = todayText;
        if (!offsetValueInput.value) offsetValueInput.value = "1";
        if (!offsetUnit.value) offsetUnit.value = "day";
        if (!offsetDirection.value) offsetDirection.value = "after";

        const setPeriodResult = (el, value, suffix) => {
            el.textContent = `${value}${suffix || ""}`;
        };

        const updateAll = () => {
            const startD = getPickerDateUtc(periodStart);
            const endD = getPickerDateUtc(periodEnd);

            if (startD && endD) {
                // Math.trunc 사용: 시작일 > 종료일(음수) 시 Math.round가 오방향으로 반올림하는 버그 수정
                const diffMs = endD.getTime() - startD.getTime();
                setPeriodResult(periodDayRes, Math.trunc(diffMs / 86400000), t("unit_days_suffix"));
                setPeriodResult(periodHourRes, Math.trunc(diffMs / 3600000), t("unit_hours_suffix"));
                setPeriodResult(periodMinRes, Math.trunc(diffMs / 60000), t("unit_minutes_suffix"));
                setPeriodResult(periodSecRes, Math.trunc(diffMs / 1000), t("unit_seconds_suffix"));
            } else {
                setPeriodResult(periodDayRes, 0, t("unit_days_suffix"));
                setPeriodResult(periodHourRes, 0, t("unit_hours_suffix"));
                setPeriodResult(periodMinRes, 0, t("unit_minutes_suffix"));
                setPeriodResult(periodSecRes, 0, t("unit_seconds_suffix"));
            }


            const offStartD = getPickerDateLocal(offsetStart);
            if (!offStartD) {
                offsetResult.value = "-";
                return;
            }

            const resultDate = new Date(offStartD.getTime());
            const offsetValue = parseInt(offsetValueInput.value, 10) || 0;
            const directionMultiplier = offsetDirection.value === "before" ? -1 : 1;
            const actualShift = offsetValue * directionMultiplier;

            if (offsetUnit.value === "day") resultDate.setDate(resultDate.getDate() + actualShift);
            if (offsetUnit.value === "week") resultDate.setDate(resultDate.getDate() + (actualShift * 7));
            if (offsetUnit.value === "month") resultDate.setMonth(resultDate.getMonth() + actualShift);
            if (offsetUnit.value === "year") resultDate.setFullYear(resultDate.getFullYear() + actualShift);

            offsetResult.value = formatLocalDateTime(resultDate);
        };

        [periodStart, periodEnd, offsetStart, offsetValueInput, offsetUnit, offsetDirection].forEach((el) => {
            el.addEventListener("input", updateAll);
            el.addEventListener("change", updateAll);
        });

        if (offValMinus && offValPlus) {
            offValMinus.addEventListener("click", () => {
                let v = parseInt(offsetValueInput.value, 10) || 1;
                if (v > 1) {
                    offsetValueInput.value = v - 1;
                    updateAll();
                }
            });
            offValPlus.addEventListener("click", () => {
                let v = parseInt(offsetValueInput.value, 10) || 0;
                offsetValueInput.value = v + 1;
                updateAll();
            });
            offsetValueInput.addEventListener("input", () => {
                let v = parseInt(offsetValueInput.value, 10) || 1;
                if (v < 1) {
                    offsetValueInput.value = 1;
                    updateAll();
                }
            });
        }

        if (periodSwapBtn) {
            periodSwapBtn.addEventListener("click", () => {
                // CDP 상태까지 고려한 Swap 로직 보완
                const startD = getPickerDateUtc(periodStart);
                const endD = getPickerDateUtc(periodEnd);

                if (startD && endD) {
                    // CDP가 있으면 setDate로 동기화, 없으면 value로 직접 교체
                    if (periodStart._cdp) periodStart._cdp.setDate(endD);
                    else periodStart.value = formatDateOnly(endD);

                    if (periodEnd._cdp) periodEnd._cdp.setDate(startD);
                    else periodEnd.value = formatDateOnly(startD);

                    updateAll();
                } else {
                    // 폴백: 값만 교체
                    const startValue = periodStart.value;
                    periodStart.value = periodEnd.value;
                    periodEnd.value = startValue;
                    updateAll();
                }
            });
        }


        updateAll();
        return { refresh: updateAll };
    }

    function initCalculators(options = {}) {
        const t = (typeof options.t === "function") ? options.t : ((key) => key);
        const copyText = (typeof options.copyText === "function")
            ? options.copyText
            : (async () => { });

        const periodAndShift = initPeriodAndDateShift(t);
        const countdown = initCountdown(t);
        const unixConverter = initUnixTimestampConverter(t);
        initConverter();

        bindCopyButtons(copyText, [
            ["copy-conv-day-btn", "conv-day", true],
            ["copy-conv-hour-btn", "conv-hour", true],
            ["copy-conv-min-btn", "conv-min", true],
            ["copy-conv-sec-btn", "conv-sec", true],
            ["copy-period-res-btn", "period-res", false],
            ["copy-period-hour-res-btn", "period-hour-res", false],
            ["copy-period-min-res-btn", "period-min-res", false],
            ["copy-period-sec-res-btn", "period-sec-res", false],
            ["copy-offset-res-btn", "offset-res", true],
            ["copy-unix-now-btn", "unix-now-value", false],
            ["copy-unix-now-ms-btn", "unix-now-ms-value", false],
            ["copy-unix-ts-btn", "unix-ts-input", true],
            ["copy-unix-ts-ms-btn", "unix-ts-ms-input", true],
            ["copy-unix-iso-local-btn", "unix-iso-local-input", true],
            ["copy-unix-iso-utc-btn", "unix-iso-utc-input", true],
            ["copy-unix-rfc2822-btn", "unix-rfc2822-input", true],
            ["copy-unix-sql-btn", "unix-sql-input", true],
            ["copy-unix-human-btn", "unix-human-input", true]
        ]);

        if (typeof globalObj !== "undefined") {
            globalObj.__gtvCalcRefresh = () => {
                periodAndShift.refresh();
                countdown.refresh();
                unixConverter.refresh();

                const currentLang = getCurrentLang();
                const currentTheme = getCurrentTheme();
                querySelectorAll(".custom-date-picker-input").forEach(el => {
                    if (el._cdp) {
                        el._cdp.setLang(currentLang);
                        el._cdp.setTheme(currentTheme);
                    }
                });
            };
        }
    }

    globalObj.GTVCalculator = Object.freeze({
        initCalculators
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/calculator-actions.js ---
(function initGtvCalculatorActions(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (_err) {
                return undefined;
            }
        }

        function logError(...args) {
            if (typeof safeDeps.logError === "function") {
                safeDeps.logError(...args);
                return;
            }
            if (typeof console === "object" && console && typeof console.error === "function") {
                console.error(...args);
            }
        }

        function getCalculatorApi() {
            if (safeDeps.GTV_CALCULATOR && typeof safeDeps.GTV_CALCULATOR === "object") {
                return safeDeps.GTV_CALCULATOR;
            }
            if (globalObj && typeof globalObj.GTVCalculator === "object") {
                return globalObj.GTVCalculator;
            }
            return null;
        }

        function getElementById(id) {
            if (typeof safeDeps.getElementById === "function") return safeDeps.getElementById(id);
            if (typeof document === "object" && document && typeof document.getElementById === "function") {
                return document.getElementById(id);
            }
            return null;
        }

        function getPeriodResultIdsSet() {
            const ids = safeDeps.PERIOD_RESULT_IDS;
            if (ids && typeof ids.has === "function") return ids;
            return null;
        }

        async function writeClipboard(text) {
            if (typeof safeDeps.writeClipboard === "function") {
                return await safeDeps.writeClipboard(text);
            }
            const clipboard = (typeof navigator === "object" && navigator && navigator.clipboard) ? navigator.clipboard : null;
            if (!clipboard || typeof clipboard.writeText !== "function") {
                throw new Error("Clipboard API unavailable");
            }
            return await clipboard.writeText(text);
        }

        function translate(key) {
            const value = invokeDep("t", key);
            if (typeof value === "string" && value) return value;
            return String(key || "");
        }

        function showToastMessage(message, options = {}) {
            invokeDep("showToast", message, options);
        }

        async function copyText(elementId, isInput = false) {
            const el = getElementById(elementId);
            if (!el) return;

            const sourceText = isInput ? (el.value || "") : (el.textContent || "");
            let text = String(sourceText).trim();
            const periodResultIds = getPeriodResultIdsSet();
            if (!isInput && periodResultIds && periodResultIds.has(elementId)) {
                const matchedNumber = text.match(/-?\d+(\.\d+)?/);
                text = matchedNumber ? matchedNumber[0] : "";
            }
            if (!text) return;

            try {
                await writeClipboard(text);
                showToastMessage(translate("toast_copy_success"), { type: "success" });
            } catch (err) {
                logError("copyText failed:", err);
                showToastMessage(translate("toast_copy_failed"), { type: "error" });
            }
        }

        function initCalculators() {
            const api = getCalculatorApi();
            if (!api || typeof api.initCalculators !== "function") {
                logError("Missing required module API: GTVCalculator.initCalculators");
                return;
            }
            api.initCalculators({
                t: (key) => translate(key),
                copyText
            });
        }

        return Object.freeze({
            initCalculators,
            copyText
        });
    }

    globalObj.GTVCalculatorActions = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/multi-state.js ---
(function initGtvMultiState(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        let multiSubgroupIdSeed = 0;

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (_err) {
                return undefined;
            }
        }

        function asArray(value) {
            return Array.isArray(value) ? value : [];
        }

        function translate(key) {
            const translated = invokeDep("t", key);
            if (typeof translated === "string" && translated) return translated;
            return String(key || "");
        }

        function getGroupsSafe() {
            return asArray(invokeDep("getGroups"));
        }

        function getMinMultiRangeCount() {
            const parsed = Number(safeDeps.MIN_MULTI_RANGE_COUNT);
            return Number.isFinite(parsed) ? Math.max(1, Math.trunc(parsed)) : 1;
        }

        function getDefaultMultiRangeBoundsSafe() {
            const defaults = invokeDep("getDefaultMultiRangeBounds");
            const nowMs = Date.now();
            const startMs = Number(defaults?.startMs);
            const endMs = Number(defaults?.endMs);
            const safeStartMs = Number.isFinite(startMs) ? startMs : nowMs;
            const safeEndMs = Number.isFinite(endMs) ? endMs : (safeStartMs + 3600000);
            return {
                startMs: safeStartMs,
                endMs: safeEndMs
            };
        }

        function sanitizeMultiRangeCountSafe(value) {
            const sanitized = invokeDep("sanitizeMultiRangeCount", value);
            const minCount = getMinMultiRangeCount();
            if (Number.isFinite(Number(sanitized))) {
                return Math.max(minCount, Math.trunc(Number(sanitized)));
            }
            const parsed = parseInt(value, 10);
            if (Number.isFinite(parsed)) {
                return Math.max(minCount, parsed);
            }
            return minCount;
        }

        function sanitizeUtcMsSafe(value, fallbackMs) {
            const sanitized = invokeDep("sanitizeUtcMs", value, fallbackMs);
            if (Number.isFinite(Number(sanitized))) return Number(sanitized);
            const parsed = Number(value);
            if (Number.isFinite(parsed)) return parsed;
            return Number.isFinite(Number(fallbackMs)) ? Number(fallbackMs) : Date.now();
        }

        function sanitizeMultiRangeItemSafe(item, fallbackStartMs, fallbackEndMs) {
            const sanitized = invokeDep("sanitizeMultiRangeItem", item, fallbackStartMs, fallbackEndMs);
            if (sanitized && typeof sanitized === "object") {
                const startUtcMs = sanitizeUtcMsSafe(sanitized.startUtcMs, fallbackStartMs);
                const endUtcMs = sanitizeUtcMsSafe(sanitized.endUtcMs, fallbackEndMs);
                return {
                    startUtcMs,
                    endUtcMs: Math.max(endUtcMs, startUtcMs)
                };
            }
            const rawStart = Number(item?.startUtcMs);
            const rawEnd = Number(item?.endUtcMs);
            const startUtcMs = Number.isFinite(rawStart) ? rawStart : Number(fallbackStartMs);
            const endUtcMs = Number.isFinite(rawEnd) ? rawEnd : Number(fallbackEndMs);
            const safeStartUtcMs = Number.isFinite(startUtcMs) ? startUtcMs : Date.now();
            const safeEndUtcMs = Number.isFinite(endUtcMs) ? endUtcMs : (safeStartUtcMs + 3600000);
            return {
                startUtcMs: safeStartUtcMs,
                endUtcMs: Math.max(safeEndUtcMs, safeStartUtcMs)
            };
        }

        function sanitizeMultiSubgroupId(value) {
            return (typeof value === "string" && value.trim()) ? value.trim() : "";
        }

        function sanitizeMultiSubgroupName(value, fallback = "") {
            const trimmed = (typeof value === "string" ? value : "").trim();
            if (trimmed) return trimmed.slice(0, 60);
            const fallbackTrimmed = (typeof fallback === "string" ? fallback : "").trim();
            if (fallbackTrimmed) return fallbackTrimmed.slice(0, 60);
            return translate("default_subgroup_name");
        }

        function getDefaultMultiSubgroupName(index = 0) {
            const base = translate("default_subgroup_name");
            return `${base} ${index + 1}`;
        }

        function getUsedMultiSubgroupIds() {
            const usedIds = new Set();
            const groups = getGroupsSafe();
            groups.forEach((group) => {
                if (!group || !Array.isArray(group.multiSubgroups)) return;
                group.multiSubgroups.forEach((subgroup) => {
                    const subgroupId = sanitizeMultiSubgroupId(subgroup?.id);
                    if (subgroupId) usedIds.add(subgroupId);
                });
            });
            return usedIds;
        }

        function createUniqueMultiSubgroupId(prefix = "subgroup") {
            const normalizedPrefix = (typeof prefix === "string" && prefix.trim()) ? prefix.trim() : "subgroup";
            const usedIds = getUsedMultiSubgroupIds();

            if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
                const uuidId = `${normalizedPrefix}-${crypto.randomUUID()}`;
                if (!usedIds.has(uuidId)) return uuidId;
            }

            for (let attempt = 0; attempt < 10000; attempt++) {
                multiSubgroupIdSeed = (multiSubgroupIdSeed + 1) % 1000000;
                const candidate = `${normalizedPrefix}-${Date.now()}-${multiSubgroupIdSeed}`;
                if (!usedIds.has(candidate)) return candidate;
            }

            return `${normalizedPrefix}-${Date.now()}-${Math.floor(Math.random() * 1000000000)}`;
        }

        function sanitizeMultiStatePayload(rawState = null, fallbackState = null) {
            const defaults = getDefaultMultiRangeBoundsSafe();
            const fallback = fallbackState && typeof fallbackState === "object"
                ? fallbackState
                : {
                    multiRangeCount: getMinMultiRangeCount(),
                    multiRanges: [{ startUtcMs: defaults.startMs, endUtcMs: defaults.endMs }],
                    multiRangeCollapsed: [],
                    multiRangeStartEditEnabled: [],
                    multiRangeEndEditEnabled: []
                };

            const nextCount = sanitizeMultiRangeCountSafe(rawState?.multiRangeCount ?? fallback.multiRangeCount);
            const sourceRanges = Array.isArray(rawState?.multiRanges)
                ? rawState.multiRanges
                : (Array.isArray(fallback.multiRanges) ? fallback.multiRanges : []);
            const sourceCollapsed = Array.isArray(rawState?.multiRangeCollapsed)
                ? rawState.multiRangeCollapsed
                : (Array.isArray(fallback.multiRangeCollapsed) ? fallback.multiRangeCollapsed : []);
            const sourceStartEdit = Array.isArray(rawState?.multiRangeStartEditEnabled)
                ? rawState.multiRangeStartEditEnabled
                : (Array.isArray(fallback.multiRangeStartEditEnabled) ? fallback.multiRangeStartEditEnabled : []);
            const sourceEndEdit = Array.isArray(rawState?.multiRangeEndEditEnabled)
                ? rawState.multiRangeEndEditEnabled
                : (Array.isArray(fallback.multiRangeEndEditEnabled) ? fallback.multiRangeEndEditEnabled : []);

            let nextRanges = sourceRanges
                .map((item) => sanitizeMultiRangeItemSafe(item, defaults.startMs, defaults.endMs))
                .slice(0, nextCount);
            if (!nextRanges.length) {
                const fallbackRange = sanitizeMultiRangeItemSafe(sourceRanges[0], defaults.startMs, defaults.endMs);
                nextRanges = [fallbackRange];
            }

            const firstDuration = nextRanges[0].endUtcMs - nextRanges[0].startUtcMs;
            while (nextRanges.length < nextCount) {
                const prev = nextRanges[nextRanges.length - 1];
                const startUtcMs = prev.endUtcMs;
                nextRanges.push({
                    startUtcMs,
                    endUtcMs: startUtcMs + firstDuration
                });
            }

            const nextCollapsed = Array.from({ length: nextCount }, (_, idx) => !!sourceCollapsed[idx]);
            const nextStartEditEnabled = Array.from({ length: nextCount }, (_, idx) => (idx === 0 ? false : !!sourceStartEdit[idx]));
            const nextEndEditEnabled = Array.from({ length: nextCount }, (_, idx) =>
                (sourceEndEdit[idx] === undefined ? true : !!sourceEndEdit[idx])
            );

            nextRanges[0].startUtcMs = sanitizeUtcMsSafe(nextRanges[0].startUtcMs, defaults.startMs);
            nextRanges[0].endUtcMs = sanitizeUtcMsSafe(nextRanges[0].endUtcMs, defaults.endMs);
            for (let i = 1; i < nextRanges.length; i++) {
                nextRanges[i].startUtcMs = sanitizeUtcMsSafe(nextRanges[i].startUtcMs, nextRanges[i - 1].endUtcMs);
                if (!nextStartEditEnabled[i]) {
                    nextRanges[i].startUtcMs = nextRanges[i - 1].endUtcMs;
                }
                nextRanges[i].endUtcMs = sanitizeUtcMsSafe(nextRanges[i].endUtcMs, nextRanges[i].startUtcMs);
            }

            return {
                multiRangeCount: nextCount,
                multiRanges: nextRanges,
                multiRangeCollapsed: nextCollapsed,
                multiRangeStartEditEnabled: nextStartEditEnabled,
                multiRangeEndEditEnabled: nextEndEditEnabled
            };
        }

        function createMultiSubgroupState(name = "", index = 0, state = null) {
            const normalized = sanitizeMultiStatePayload(state, null);
            return {
                id: createUniqueMultiSubgroupId(),
                name: sanitizeMultiSubgroupName(name, getDefaultMultiSubgroupName(index)),
                ...normalized
            };
        }

        function ensureGroupMultiSubgroups(group, options = {}) {
            if (!group || typeof group !== "object") return;
            const { legacyMultiState = null } = options;
            const rawSubgroups = Array.isArray(group.multiSubgroups) ? group.multiSubgroups : [];
            const fallbackState = sanitizeMultiStatePayload(legacyMultiState, null);

            let normalizedSubgroups = rawSubgroups.map((subgroup, idx) => {
                const subgroupState = sanitizeMultiStatePayload(subgroup, fallbackState);
                return {
                    id: sanitizeMultiSubgroupId(subgroup?.id) || createUniqueMultiSubgroupId(),
                    name: sanitizeMultiSubgroupName(subgroup?.name, getDefaultMultiSubgroupName(idx)),
                    ...subgroupState
                };
            });

            if (!normalizedSubgroups.length) {
                normalizedSubgroups = [{
                    id: createUniqueMultiSubgroupId(),
                    name: sanitizeMultiSubgroupName(
                        group.multiRangeTitle || legacyMultiState?.multiRangeTitle || "",
                        getDefaultMultiSubgroupName(0)
                    ),
                    ...fallbackState
                }];
            }

            const used = new Set();
            normalizedSubgroups.forEach((subgroup, idx) => {
                if (!subgroup.id || used.has(subgroup.id)) subgroup.id = createUniqueMultiSubgroupId();
                used.add(subgroup.id);
                subgroup.name = sanitizeMultiSubgroupName(subgroup.name, getDefaultMultiSubgroupName(idx));
            });

            group.multiSubgroups = normalizedSubgroups;
            const requestedActiveSubgroupId = sanitizeMultiSubgroupId(group.activeMultiSubgroupId);
            group.activeMultiSubgroupId = normalizedSubgroups.some((subgroup) => subgroup.id === requestedActiveSubgroupId)
                ? requestedActiveSubgroupId
                : normalizedSubgroups[0].id;
        }

        return Object.freeze({
            sanitizeMultiSubgroupId,
            sanitizeMultiSubgroupName,
            getDefaultMultiSubgroupName,
            getUsedMultiSubgroupIds,
            createUniqueMultiSubgroupId,
            sanitizeMultiStatePayload,
            createMultiSubgroupState,
            ensureGroupMultiSubgroups
        });
    }

    globalObj.GTVMultiState = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/image-export.js ---
(function initGtvImageExport(globalObj) {
    "use strict";

    const doc = globalObj?.document || (typeof document !== "undefined" ? document : null);
    const chromeApi = globalObj?.chrome || (typeof chrome !== "undefined" ? chrome : null);

    function callDep(deps, name, fallback, ...args) {
        const fn = deps?.[name];
        if (typeof fn !== "function") return fallback;
        try {
            return fn(...args);
        } catch (_err) {
            return fallback;
        }
    }

    async function callDepAsync(deps, name, fallback, ...args) {
        const fn = deps?.[name];
        if (typeof fn !== "function") return fallback;
        try {
            return await fn(...args);
        } catch (_err) {
            return fallback;
        }
    }

    function triggerAnchorDownload(dataUrl, filename) {
        if (!doc || typeof doc.createElement !== "function" || !doc.body || typeof doc.body.appendChild !== "function") {
            throw new Error("Download is unavailable without DOM support");
        }
        const anchor = doc.createElement("a");
        anchor.href = dataUrl;
        anchor.download = filename;
        doc.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
    }

    function downloadDataUrl(dataUrl, filename) {
        return new Promise((resolve, reject) => {
            if (chromeApi?.downloads?.download) {
                chromeApi.downloads.download(
                    { url: dataUrl, filename, saveAs: false },
                    (downloadId) => {
                        if (chromeApi.runtime?.lastError || !downloadId) {
                            try {
                                triggerAnchorDownload(dataUrl, filename);
                                resolve();
                            } catch (fallbackErr) {
                                reject(fallbackErr);
                            }
                            return;
                        }
                        resolve();
                    }
                );
                return;
            }

            try {
                triggerAnchorDownload(dataUrl, filename);
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    async function saveMultiRangeTitlesImage(deps) {
        try {
            if (callDep(deps, "isMultiTab", false) !== true) return;
            callDep(deps, "showToast", null, callDep(deps, "t", "toast_table_image_generating", "toast_table_image_generating"), { type: "loading" });
            callDep(deps, "ensureMultiRangeState", null);
            const dataUrl = await callDepAsync(deps, "renderMultiRangeTitlesToPngDataUrl", "");
            const fileName = callDep(deps, "getMultiRangeTitlesImageFilename", `GlobalTimeViwer_MultiRanges_Titles_${Date.now()}.png`);
            if (!dataUrl) throw new Error("Image render failed");
            await downloadDataUrl(dataUrl, fileName);
            callDep(deps, "showToast", null, callDep(deps, "t", "toast_table_image_saved", "toast_table_image_saved"), { type: "success" });
        } catch (err) {
            console.error("Failed to save multi-range titles image:", err);
            callDep(
                deps,
                "showToast",
                null,
                `${callDep(deps, "t", "toast_table_image_failed", "toast_table_image_failed")}\n(${err?.message || err})`,
                { type: "error", duration: 5000 }
            );
        }
    }

    async function saveMultiRangeAllImage(deps) {
        try {
            callDep(deps, "showToast", null, callDep(deps, "t", "toast_table_image_generating", "toast_table_image_generating"), { type: "loading" });
            const dataUrl = await callDepAsync(deps, "renderMultiRangesToPngDataUrl", "");
            if (!dataUrl) throw new Error("Image render failed");
            const filename = `GlobalTimeViwer_MultiRanges_All_${Date.now()}.png`;
            await downloadDataUrl(dataUrl, filename);
            callDep(deps, "showToast", null, callDep(deps, "t", "toast_table_image_saved", "toast_table_image_saved"), { type: "success" });
        } catch (err) {
            console.error("Failed to save all multi-range images:", err);
            callDep(
                deps,
                "showToast",
                null,
                `${callDep(deps, "t", "toast_table_image_failed", "toast_table_image_failed")}\n(${err?.message || err})`,
                { type: "error", duration: 5000 }
            );
        }
    }

    async function saveMultiRangeSingleImage(deps, rangeIdx) {
        try {
            callDep(deps, "showToast", null, callDep(deps, "t", "toast_table_image_generating", "toast_table_image_generating"), { type: "loading" });
            const dataUrl = await callDepAsync(deps, "renderMultiRangeSingleToPngDataUrl", "", rangeIdx);
            if (!dataUrl) throw new Error("Image render failed");
            const filename = `GlobalTimeViwer_MultiRange_Range_${rangeIdx + 1}_${Date.now()}.png`;
            await downloadDataUrl(dataUrl, filename);
            callDep(deps, "showToast", null, callDep(deps, "t", "toast_table_image_saved", "toast_table_image_saved"), { type: "success" });
        } catch (err) {
            console.error("Failed to save single multi-range image:", err);
            callDep(
                deps,
                "showToast",
                null,
                `${callDep(deps, "t", "toast_table_image_failed", "toast_table_image_failed")}\n(${err?.message || err})`,
                { type: "error", duration: 5000 }
            );
        }
    }

    async function saveTimezoneTableImage(deps) {
        try {
            if (callDep(deps, "isMultiTab", false) === true) {
                await saveMultiRangeAllImage(deps);
                return;
            }

            callDep(deps, "showToast", null, callDep(deps, "t", "toast_table_image_generating", "toast_table_image_generating"), { type: "loading" });
            const supportsPrimaryRenderer = await callDepAsync(deps, "detectForeignObjectRendererSupport", false);
            let dataUrl = "";
            if (supportsPrimaryRenderer) {
                try {
                    const primaryRenderer = deps?.renderTimezoneTableToPngDataUrl;
                    if (typeof primaryRenderer !== "function") {
                        throw new Error("Primary renderer unavailable");
                    }
                    dataUrl = await primaryRenderer();
                } catch (primaryErr) {
                    if (callDep(deps, "isDomExceptionLike", false, primaryErr)) {
                        callDep(deps, "setCanUseForeignObjectRenderer", null, false);
                    }
                    dataUrl = await callDepAsync(deps, "renderTimezoneTableFallbackDataUrl", "");
                }
            } else {
                dataUrl = await callDepAsync(deps, "renderTimezoneTableFallbackDataUrl", "");
            }
            if (!dataUrl) throw new Error("Image render failed");
            const baseName = callDep(deps, "getTimezoneTableImageFilename", `GlobalTimeViwer_Table_${Date.now()}`);
            const filename = `${baseName}.png`;
            await downloadDataUrl(dataUrl, filename);
            callDep(deps, "showToast", null, callDep(deps, "t", "toast_table_image_saved", "toast_table_image_saved"), { type: "success" });
        } catch (err) {
            console.error("Failed to save timezone table image:", err);
            callDep(
                deps,
                "showToast",
                null,
                `${callDep(deps, "t", "toast_table_image_failed", "toast_table_image_failed")}\n(${err?.message || err})`,
                { type: "error", duration: 5000 }
            );
        }
    }

    function createService(deps) {
        const boundDeps = (deps && typeof deps === "object") ? deps : {};
        return Object.freeze({
            downloadDataUrl,
            saveMultiRangeTitlesImage: () => saveMultiRangeTitlesImage(boundDeps),
            saveMultiRangeAllImage: () => saveMultiRangeAllImage(boundDeps),
            saveMultiRangeSingleImage: (rangeIdx) => saveMultiRangeSingleImage(boundDeps, rangeIdx),
            saveTimezoneTableImage: () => saveTimezoneTableImage(boundDeps)
        });
    }


    globalObj.GTVImageExport = Object.freeze({
        downloadDataUrl,
        createService,
        saveMultiRangeTitlesImage,
        saveMultiRangeAllImage,
        saveMultiRangeSingleImage,
        saveTimezoneTableImage
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/image-export-actions.js ---
(function initGtvImageExportActions(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        let boundImageExportService = null;

        function getImageExportApi() {
            if (safeDeps.imageExportApi && typeof safeDeps.imageExportApi === "object") return safeDeps.imageExportApi;
            if (globalObj && typeof globalObj.GTVImageExport === "object") return globalObj.GTVImageExport;
            return null;
        }

        function getImageExportDeps() {
            return {
                t: safeDeps.t,
                showToast: safeDeps.showToast,
                isMultiTab: safeDeps.isMultiTab,
                ensureMultiRangeState: safeDeps.ensureMultiRangeState,
                detectForeignObjectRendererSupport: safeDeps.detectForeignObjectRendererSupport,
                renderTimezoneTableToPngDataUrl: safeDeps.renderTimezoneTableToPngDataUrl,
                renderTimezoneTableFallbackDataUrl: safeDeps.renderTimezoneTableFallbackDataUrl,
                renderMultiRangesToPngDataUrl: safeDeps.renderMultiRangesToPngDataUrl,
                renderMultiRangeSingleToPngDataUrl: safeDeps.renderMultiRangeSingleToPngDataUrl,
                renderMultiRangesFallbackDataUrl: safeDeps.renderMultiRangesFallbackDataUrl,
                renderMultiRangeTitlesToPngDataUrl: safeDeps.renderMultiRangeTitlesToPngDataUrl,
                getTimezoneTableImageFilename: safeDeps.getTimezoneTableImageFilename,
                getMultiRangeTableImageFilename: safeDeps.getMultiRangeTableImageFilename,
                getMultiRangeTitlesImageFilename: safeDeps.getMultiRangeTitlesImageFilename,
                getMultiRanges: safeDeps.getMultiRanges,
                isDomExceptionLike: safeDeps.isDomExceptionLike,
                setCanUseForeignObjectRenderer: safeDeps.setCanUseForeignObjectRenderer
            };
        }

        function getBoundImageExportService() {
            if (boundImageExportService) return boundImageExportService;
            const api = getImageExportApi();
            if (!api || typeof api.createService !== "function") return null;
            try {
                boundImageExportService = api.createService(getImageExportDeps());
            } catch (err) {
                console.warn("[GTVImageExportActions] Failed to create bound image export service.", err);
                boundImageExportService = null;
            }
            return boundImageExportService;
        }

        async function callImageExport(methodName, ...args) {
            const bound = getBoundImageExportService();
            if (bound && typeof bound[methodName] === "function") {
                return await bound[methodName](...args);
            }

            const api = getImageExportApi();
            if (api && typeof api[methodName] === "function") {
                return await api[methodName](getImageExportDeps(), ...args);
            }

            console.error(`[GTVImageExportActions] Missing image export method: ${methodName}`);
            return undefined;
        }

        return Object.freeze({
            getImageExportDeps,
            saveTimezoneTableImage: () => callImageExport("saveTimezoneTableImage"),
            saveMultiRangeTitlesImage: () => callImageExport("saveMultiRangeTitlesImage"),
            saveMultiRangeAllImage: () => callImageExport("saveMultiRangeAllImage"),
            saveMultiRangeSingleImage: (rangeIdx) => callImageExport("saveMultiRangeSingleImage", rangeIdx)
        });
    }

    globalObj.GTVImageExportActions = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/image-export-bridge.js ---
(function initGtvImageExportBridge(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (_err) {
                return undefined;
            }
        }

        function getDefaultTableExportContext() {
            const fallback = invokeDep("getDefaultTableExportContext");
            if (!fallback || typeof fallback !== "object") {
                return {
                    table: null,
                    headerSelector: "#table-head th",
                    rowSelector: "#clocks-container tr.time-row"
                };
            }
            return fallback;
        }

        function getImageCloneService() {
            return invokeDep("getImageCloneService");
        }

        function getImageForeignRenderService() {
            return invokeDep("getImageForeignRenderService");
        }

        function getTableImageRenderService() {
            return invokeDep("getTableImageRenderService");
        }

        function getMultiRangeImageRenderService() {
            return invokeDep("getMultiRangeImageRenderService");
        }

        function getImageExportActionsService() {
            return invokeDep("getImageExportActionsService");
        }

        function collectDocumentCssText() {
            const svc = getImageForeignRenderService();
            if (!svc || typeof svc.collectDocumentCssText !== "function") return "";
            return svc.collectDocumentCssText();
        }

        function cloneTableForImageExport(tableEl) {
            const svc = getImageCloneService();
            if (!svc || typeof svc.cloneTableForImageExport !== "function") return null;
            return svc.cloneTableForImageExport(tableEl);
        }

        function cloneMultiRangeBlockForImageExport(blockEl) {
            const svc = getImageCloneService();
            if (!svc || typeof svc.cloneMultiRangeBlockForImageExport !== "function") return null;
            return svc.cloneMultiRangeBlockForImageExport(blockEl);
        }

        async function renderElementWithForeignObjectToPngDataUrl(renderElement) {
            const svc = getImageForeignRenderService();
            if (!svc || typeof svc.renderElementWithForeignObjectToPngDataUrl !== "function") {
                throw new Error("Foreign-object renderer unavailable");
            }
            return await svc.renderElementWithForeignObjectToPngDataUrl(renderElement);
        }

        function loadImageElement(src) {
            const svc = getImageForeignRenderService();
            if (!svc || typeof svc.loadImageElement !== "function") {
                return Promise.reject(new Error("Image loader unavailable"));
            }
            return svc.loadImageElement(src);
        }

        async function waitForDocumentFontsReady() {
            const svc = getImageForeignRenderService();
            if (!svc || typeof svc.waitForDocumentFontsReady !== "function") return;
            await svc.waitForDocumentFontsReady();
        }

        function isDomExceptionLike(err) {
            const svc = getImageForeignRenderService();
            if (!svc || typeof svc.isDomExceptionLike !== "function") return false;
            return !!svc.isDomExceptionLike(err);
        }

        async function detectForeignObjectRendererSupport() {
            const svc = getImageForeignRenderService();
            if (!svc || typeof svc.detectForeignObjectRendererSupport !== "function") return false;
            return !!(await svc.detectForeignObjectRendererSupport());
        }

        function extractTableCellText(cell) {
            const svc = getTableImageRenderService();
            if (!svc || typeof svc.extractTableCellText !== "function") return "";
            return svc.extractTableCellText(cell);
        }

        function extractTableHeaderText(cell) {
            const svc = getTableImageRenderService();
            if (!svc || typeof svc.extractTableHeaderText !== "function") return "";
            return svc.extractTableHeaderText(cell);
        }

        function getActiveTableExportContext() {
            const svc = getTableImageRenderService();
            if (!svc || typeof svc.getActiveTableExportContext !== "function") {
                return getDefaultTableExportContext();
            }
            return svc.getActiveTableExportContext();
        }

        async function renderTimezoneTableFallbackDataUrl() {
            const svc = getTableImageRenderService();
            if (!svc || typeof svc.renderTimezoneTableFallbackDataUrl !== "function") {
                throw new Error("Timezone table fallback renderer unavailable");
            }
            return await svc.renderTimezoneTableFallbackDataUrl();
        }

        async function renderTimezoneTableToPngDataUrl() {
            const svc = getTableImageRenderService();
            if (!svc || typeof svc.renderTimezoneTableToPngDataUrl !== "function") {
                throw new Error("Timezone table renderer unavailable");
            }
            return await svc.renderTimezoneTableToPngDataUrl();
        }

        async function renderMultiRangesFallbackDataUrl(targetRangeIdx = null) {
            const svc = getMultiRangeImageRenderService();
            if (!svc || typeof svc.renderMultiRangesFallbackDataUrl !== "function") {
                throw new Error("Multi-range fallback renderer unavailable");
            }
            return await svc.renderMultiRangesFallbackDataUrl(targetRangeIdx);
        }

        async function renderMultiRangesToPngDataUrl(targetRangeIdx = null) {
            const svc = getMultiRangeImageRenderService();
            if (!svc || typeof svc.renderMultiRangesToPngDataUrl !== "function") {
                throw new Error("Multi-range renderer unavailable");
            }
            return await svc.renderMultiRangesToPngDataUrl(targetRangeIdx);
        }

        async function renderMultiRangeSingleToPngDataUrl(rangeIdx) {
            const svc = getMultiRangeImageRenderService();
            if (!svc || typeof svc.renderMultiRangeSingleToPngDataUrl !== "function") {
                throw new Error("Multi-range single renderer unavailable");
            }
            return await svc.renderMultiRangeSingleToPngDataUrl(rangeIdx);
        }

        async function renderMultiRangeTitlesToPngDataUrl() {
            const svc = getMultiRangeImageRenderService();
            if (!svc || typeof svc.renderMultiRangeTitlesToPngDataUrl !== "function") {
                throw new Error("Multi-range title renderer unavailable");
            }
            return await svc.renderMultiRangeTitlesToPngDataUrl();
        }

        async function saveTimezoneTableImage() {
            const svc = getImageExportActionsService();
            if (!svc || typeof svc.saveTimezoneTableImage !== "function") return;
            return await svc.saveTimezoneTableImage();
        }

        async function saveMultiRangeTitlesImage() {
            const svc = getImageExportActionsService();
            if (!svc || typeof svc.saveMultiRangeTitlesImage !== "function") return;
            return await svc.saveMultiRangeTitlesImage();
        }

        async function saveMultiRangeSingleImage(rangeIdx) {
            const svc = getImageExportActionsService();
            if (!svc || typeof svc.saveMultiRangeSingleImage !== "function") return;
            return await svc.saveMultiRangeSingleImage(rangeIdx);
        }

        function getImageExportDeps() {
            const svc = getImageExportActionsService();
            if (svc && typeof svc.getImageExportDeps === "function") {
                return svc.getImageExportDeps();
            }
            return {};
        }

        return Object.freeze({
            collectDocumentCssText,
            cloneTableForImageExport,
            cloneMultiRangeBlockForImageExport,
            renderElementWithForeignObjectToPngDataUrl,
            loadImageElement,
            waitForDocumentFontsReady,
            isDomExceptionLike,
            detectForeignObjectRendererSupport,
            extractTableCellText,
            extractTableHeaderText,
            getActiveTableExportContext,
            renderTimezoneTableFallbackDataUrl,
            renderTimezoneTableToPngDataUrl,
            renderMultiRangesFallbackDataUrl,
            renderMultiRangesToPngDataUrl,
            renderMultiRangeSingleToPngDataUrl,
            renderMultiRangeTitlesToPngDataUrl,
            saveTimezoneTableImage,
            saveMultiRangeTitlesImage,
            saveMultiRangeSingleImage,
            getImageExportDeps
        });
    }

    globalObj.GTVImageExportBridge = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/image-export-naming.js ---
(function initGtvImageExportNaming(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (err) {
                console.warn(`[GTVImageExportNaming] Dependency "${name}" threw.`, err);
                return undefined;
            }
        }

        function pad2(value) {
            const depPad = safeDeps.pad;
            const n = Number(value);
            if (typeof depPad === "function") {
                try {
                    return String(depPad(n));
                } catch (_err) {
                    // Fallback to local padding.
                }
            }
            return String(Number.isFinite(n) ? n : 0).padStart(2, "0");
        }

        function sanitizeFilenamePart(value) {
            return String(value || "")
                .replace(/[\\/:*?"<>|]/g, "")
                .replace(/\s+/g, " ")
                .trim();
        }

        function resolveDate(value) {
            if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
            const parsed = new Date(value);
            if (!Number.isNaN(parsed.getTime())) return parsed;
            return new Date();
        }

        function formatDateTimeByTimezone(date, tz) {
            const targetDate = resolveDate(date);
            const safeTimezone = (tz && typeof tz === "object") ? tz : {};

            if (safeTimezone.type === "custom") {
                const offsetMinRaw = invokeDep("getCustomOffsetMinutes", safeTimezone);
                const offsetMin = Number.isFinite(Number(offsetMinRaw)) ? Number(offsetMinRaw) : 0;
                const shifted = new Date(targetDate.getTime() + (offsetMin * 60000));
                return `${shifted.getUTCFullYear()}-${pad2(shifted.getUTCMonth() + 1)}-${pad2(shifted.getUTCDate())} ${pad2(shifted.getUTCHours())}:${pad2(shifted.getUTCMinutes())}:${pad2(shifted.getUTCSeconds())}`;
            }

            const timeService = safeDeps.timeService;
            if (timeService && typeof timeService.resolveLocalDateParts === "function") {
                const p = timeService.resolveLocalDateParts(targetDate, safeTimezone.zone || "UTC", safeTimezone.id, null);
                if (p && Number.isFinite(Number(p.Y))) {
                    return `${p.Y}-${pad2(p.M)}-${pad2(p.D)} ${pad2(p.H)}:${pad2(p.min)}:${pad2(p.S)}`;
                }
            }

            return `${targetDate.getUTCFullYear()}-${pad2(targetDate.getUTCMonth() + 1)}-${pad2(targetDate.getUTCDate())} ${pad2(targetDate.getUTCHours())}:${pad2(targetDate.getUTCMinutes())}:${pad2(targetDate.getUTCSeconds())}`;
        }

        function getTimezoneTableImageFilename() {
            const baseRef = invokeDep("getBaseTimezoneRef") || { type: "standard", zone: "UTC", id: "utc" };
            const groupName =
                sanitizeFilenamePart(invokeDep("getActiveGroupName") || invokeDep("t", "default_group_name")) || "Group";
            const baseAbbr = sanitizeFilenamePart(invokeDep("getZoneAbbreviation", baseRef) || "UTC") || "UTC";
            const baseDateTime = formatDateTimeByTimezone(invokeDep("getBaseTime"), baseRef).trim();
            const m = baseDateTime.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
            const timePart =
                sanitizeFilenamePart(m ? `${m[1]} ${m[2]}${m[3]}${m[4]}` : baseDateTime.replace(/:/g, "")) || "time";

            return `${groupName}_${baseAbbr}_${timePart}`;
        }

        function getSanitizedSubgroupName() {
            const subgroupName = invokeDep(
                "sanitizeMultiSubgroupName",
                invokeDep("getCurrentMultiSubgroupName"),
                "subgroup"
            );
            return sanitizeFilenamePart(subgroupName || "") || "subgroup";
        }

        function getMultiRangeTableImageFilename(rangeIdx) {
            const baseName = getTimezoneTableImageFilename();
            const safeRangeIdx = Number.isInteger(rangeIdx) && rangeIdx >= 0 ? rangeIdx : 0;
            const rangeLabel = sanitizeFilenamePart(`${getSanitizedSubgroupName()} ${safeRangeIdx + 1}`) || `range_${safeRangeIdx + 1}`;
            return `${baseName}_${rangeLabel}.png`;
        }

        function getMultiRangeTitlesImageFilename() {
            const baseName = getTimezoneTableImageFilename();
            const titleLabel = getSanitizedSubgroupName() || "range";
            return `${baseName}_${titleLabel}_titles.png`;
        }

        return Object.freeze({
            sanitizeFilenamePart,
            formatDateTimeByTimezone,
            getTimezoneTableImageFilename,
            getMultiRangeTableImageFilename,
            getMultiRangeTitlesImageFilename
        });
    }

    globalObj.GTVImageExportNaming = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/image-clone.js ---
(function initGtvImageClone(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function getDocumentRef() {
            if (safeDeps.document && typeof safeDeps.document === "object") return safeDeps.document;
            if (typeof document === "object" && document) return document;
            return null;
        }

        function toArray(iterable) {
            if (!iterable) return [];
            if (Array.isArray(iterable)) return iterable;
            try {
                return Array.from(iterable);
            } catch (_err) {
                return [];
            }
        }

        function replaceTimeInputsWithText(sourceEl, clonedEl, docRef) {
            const srcInputs = toArray(sourceEl?.querySelectorAll?.(".time-input"));
            const clonedInputs = toArray(clonedEl?.querySelectorAll?.(".time-input"));
            clonedInputs.forEach((inputEl, idx) => {
                if (!docRef?.createElement || typeof inputEl?.replaceWith !== "function") return;
                const span = docRef.createElement("span");
                span.className = "export-time-text";
                span.textContent = srcInputs[idx]?.value || "";
                inputEl.replaceWith(span);
            });
        }

        function removeBySelector(root, selector) {
            toArray(root?.querySelectorAll?.(selector)).forEach((node) => node?.remove?.());
        }

        function cloneTableForImageExport(tableEl) {
            if (!tableEl || typeof tableEl.cloneNode !== "function") return null;
            const docRef = getDocumentRef();
            const clone = tableEl.cloneNode(true);
            replaceTimeInputsWithText(tableEl, clone, docRef);
            removeBySelector(clone, ".export-exclude, .move-col, .move-cell");
            return clone;
        }

        function cloneMultiRangeBlockForImageExport(blockEl) {
            if (!blockEl || typeof blockEl.cloneNode !== "function") return null;
            const docRef = getDocumentRef();
            const clone = blockEl.cloneNode(true);
            replaceTimeInputsWithText(blockEl, clone, docRef);
            clone.classList?.remove?.("collapsed");
            removeBySelector(
                clone,
                ".multi-range-header-actions, .multi-range-adjust-row, .export-exclude, .move-col, .move-cell"
            );
            return clone;
        }

        return Object.freeze({
            cloneTableForImageExport,
            cloneMultiRangeBlockForImageExport
        });
    }

    globalObj.GTVImageClone = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);


// --- File: js/modules/image-foreign-render.js ---
(function initGtvImageForeignRender(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const TABLE_IMAGE_EXPORT_WIDTH = Number.isFinite(Number(safeDeps.TABLE_IMAGE_EXPORT_WIDTH))
            ? Number(safeDeps.TABLE_IMAGE_EXPORT_WIDTH)
            : 1600;

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (err) {
                console.warn(`[GTVImageForeignRender] Dependency "${name}" threw.`, err);
                return undefined;
            }
        }

        function getDocumentRef() {
            return (typeof document === "object" && document) ? document : null;
        }

        function getComputedStyleSafe(target) {
            if (!target) return { getPropertyValue: () => "", backgroundColor: "" };
            if (typeof globalObj.getComputedStyle === "function") {
                return globalObj.getComputedStyle(target);
            }
            if (typeof getComputedStyle === "function") {
                return getComputedStyle(target);
            }
            return { getPropertyValue: () => "", backgroundColor: "" };
        }

        function getCanUseForeignObjectRenderer() {
            const value = invokeDep("getCanUseForeignObjectRenderer");
            return typeof value === "boolean" ? value : null;
        }

        function setCanUseForeignObjectRenderer(value) {
            invokeDep("setCanUseForeignObjectRenderer", !!value);
        }

        function collectDocumentCssText() {
            const doc = getDocumentRef();
            if (!doc) return "";

            let cssText = "";
            const styleSheets = Array.isArray(doc.styleSheets) ? doc.styleSheets : Array.from(doc.styleSheets || []);
            for (const styleSheet of styleSheets) {
                try {
                    if (styleSheet?.cssRules) {
                        const rules = Array.isArray(styleSheet.cssRules)
                            ? styleSheet.cssRules
                            : Array.from(styleSheet.cssRules);
                        for (const rule of rules) {
                            cssText += `${rule.cssText}\n`;
                        }
                    }
                } catch (_err) {
                    // Ignore inaccessible stylesheet rules.
                }
            }

            const internalStyles = doc.querySelectorAll?.("style") || [];
            Array.from(internalStyles).forEach((styleEl) => {
                const text = styleEl?.innerText || "";
                if (text && !cssText.includes(text.substring(0, 50))) {
                    cssText += `\n${text}\n`;
                }
            });

            const rootStyle = getComputedStyleSafe(doc.documentElement);
            const bodyStyle = getComputedStyleSafe(doc.body);
            const themeVars = [
                "--panel-bg", "--panel-bg-alt", "--border", "--text", "--text-dim",
                "--accent", "--accent-hover", "--table-head-bg", "--timeline-label-w",
                "--timeline-box-w", "--timeline-box-h", "--ui-scale"
            ];

            let injectedVars = ":root {\n";
            themeVars.forEach((v) => {
                const val = (rootStyle.getPropertyValue?.(v) || "").trim();
                if (val) injectedVars += `  ${v}: ${val} !important;\n`;
            });
            if (!(rootStyle.getPropertyValue?.("--timeline-label-w") || "").trim()) {
                injectedVars += "  --timeline-label-w: 150px;\n";
            }
            if (!(rootStyle.getPropertyValue?.("--timeline-box-h") || "").trim()) {
                injectedVars += "  --timeline-box-h: 28px;\n";
            }
            injectedVars += `  background-color: ${bodyStyle.backgroundColor || "#0f172a"} !important;\n`;
            injectedVars += "}\n";

            cssText = injectedVars + cssText;
            cssText = cssText.replace(/@font-face\s*{[\s\S]*?}/gi, "");
            cssText = cssText.replace(/@import\s+[^;]+;/gi, "");
            cssText = cssText.replace(/url\s*\([\s\S]*?\)/gi, "none");
            cssText += "\n* { font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif !important; }\n";
            return cssText;
        }

        function loadImageElement(src) {
            const ImageCtor = globalObj.Image || (typeof Image !== "undefined" ? Image : null);
            if (typeof ImageCtor !== "function") {
                return Promise.reject(new Error("Image constructor unavailable"));
            }
            return new Promise((resolve, reject) => {
                const img = new ImageCtor();
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error("Image load error"));
                img.src = src;
            });
        }

        async function waitForDocumentFontsReady() {
            const doc = getDocumentRef();
            if (!doc?.fonts?.ready) return;
            try {
                await doc.fonts.ready;
            } catch (_) {
                // Ignore font readiness failures and continue with fallback rendering.
            }
        }

        function isDomExceptionLike(err) {
            if (!err) return false;
            const DomExceptionCtor = globalObj.DOMException || (typeof DOMException !== "undefined" ? DOMException : null);
            if (typeof DomExceptionCtor === "function" && err instanceof DomExceptionCtor) return true;
            const name = typeof err.name === "string" ? err.name : "";
            return name === "SecurityError" || name === "InvalidStateError";
        }

        async function detectForeignObjectRendererSupport() {
            const cached = getCanUseForeignObjectRenderer();
            if (typeof cached === "boolean") return cached;

            const URLCtor = globalObj.URL || (typeof URL !== "undefined" ? URL : null);
            if (!URLCtor || typeof URLCtor.createObjectURL !== "function") {
                setCanUseForeignObjectRenderer(false);
                return false;
            }

            const doc = getDocumentRef();
            if (!doc?.createElement) {
                setCanUseForeignObjectRenderer(false);
                return false;
            }

            const probeSvg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="4" viewBox="0 0 4 4">
                    <foreignObject width="100%" height="100%">
                        <div xmlns="http://www.w3.org/1999/xhtml" style="width:4px;height:4px;background:#000;"></div>
                    </foreignObject>
                </svg>
            `;
            const BlobCtor = globalObj.Blob || (typeof Blob !== "undefined" ? Blob : null);
            if (typeof BlobCtor !== "function") {
                setCanUseForeignObjectRenderer(false);
                return false;
            }

            const probeBlob = new BlobCtor([probeSvg], { type: "image/svg+xml;charset=utf-8" });
            const probeUrl = URLCtor.createObjectURL(probeBlob);
            try {
                const img = await loadImageElement(probeUrl);
                const canvas = doc.createElement("canvas");
                canvas.width = 4;
                canvas.height = 4;
                const ctx = canvas.getContext?.("2d");
                if (!ctx) {
                    setCanUseForeignObjectRenderer(false);
                    return false;
                }
                ctx.drawImage(img, 0, 0, 4, 4);
                canvas.toDataURL("image/png");
                setCanUseForeignObjectRenderer(true);
                return true;
            } catch (_err) {
                setCanUseForeignObjectRenderer(false);
                return false;
            } finally {
                URLCtor.revokeObjectURL?.(probeUrl);
            }
        }

        async function renderElementWithForeignObjectToPngDataUrl(renderElement) {
            const doc = getDocumentRef();
            if (!doc?.createElement) throw new Error("DOM unavailable");
            if (!renderElement) throw new Error("Render element not found");

            const measureHost = doc.createElement("div");
            measureHost.style.cssText = "position:fixed; left:-99999px; top:0; width:max-content; min-width:1400px; height:auto; visibility:hidden; pointer-events:none; display:block !important;";
            const measureClone = renderElement.cloneNode(true);
            measureClone.classList?.remove?.("collapsed");

            if (measureClone.classList?.contains("multi-ranges-container") || measureClone.querySelector?.(".multi-range-block")) {
                measureClone.style.display = "flex";
                measureClone.style.flexDirection = "column";
                measureClone.style.alignItems = "center";
                measureClone.style.gap = "40px";
                measureClone.style.width = "1400px";
            }

            measureHost.appendChild(measureClone);
            doc.body?.appendChild?.(measureHost);

            const width = Math.ceil(measureClone.scrollWidth || 1400);
            const height = Math.ceil(measureClone.scrollHeight || 600);
            measureHost.remove?.();

            const targetWidth = TABLE_IMAGE_EXPORT_WIDTH;
            const targetHeight = Math.max(1, Math.round((height * targetWidth) / width));

            const serializer = new XMLSerializer();
            const markup = serializer.serializeToString(renderElement);
            const cssText = collectDocumentCssText();

            const dayBox = doc.querySelector?.(".timeline-hour-box.day");
            const liveDayBg = dayBox ? getComputedStyleSafe(dayBox).backgroundColor : "#caeefb";
            const liveNightBg = "#616161";
            const liveBorder = dayBox ? getComputedStyleSafe(dayBox).borderTopColor : "#8795aa";
            const liveText = getComputedStyleSafe(doc.body).color || "#f8fafc";
            const liveBg = getComputedStyleSafe(doc.body).backgroundColor || "#0f172a";

            const extraCss = `
                :root {
                    --text: ${liveText} !important;
                    --panel-bg: ${liveBg} !important;
                }
                body {
                    background-color: ${liveBg} !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    display: flex !important;
                    justify-content: center !important;
                    align-items: flex-start !important;
                }
                .timezone-export-wrapper, .multi-ranges-container {
                    width: ${width}px !important;
                    min-height: ${height}px !important;
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: center !important;
                    justify-content: flex-start !important;
                    gap: 40px !important;
                    padding: 60px 80px !important;
                    box-sizing: border-box !important;
                    background-color: ${liveBg} !important;
                    color: ${liveText} !important;
                    overflow: visible !important;
                }
                .multi-ranges-container {
                    flex-direction: column !important;
                    align-items: center !important;
                }
                .multi-range-block {
                    width: 100% !important;
                    max-width: 1400px !important;
                    margin-bottom: 20px !important;
                    background-color: transparent !important;
                }
                .timeline-panels.dual {
                    display: grid !important;
                    grid-template-columns: 1fr 1fr !important;
                    gap: 30px !important;
                    width: 100% !important;
                    margin: 0 auto !important;
                }
                .timeline-frame .time-adjust-row,
                .timeline-frame .time-adjust-set-container {
                    display: flex !important;
                    flex-direction: row !important;
                    justify-content: center !important;
                    gap: 25px !important;
                }
                .timeline-axis-row, .timeline-timezone-row {
                    display: grid !important;
                    grid-template-columns: var(--timeline-label-w, 150px) 1fr !important;
                    width: 100% !important;
                    height: var(--timeline-box-h, 28px) !important;
                    margin-bottom: 2px !important;
                    color: ${liveText} !important;
                }
                .timeline-label {
                    display: flex !important;
                    align-items: center !important;
                    padding-right: 20px !important;
                    font-size: 13px !important;
                    color: ${liveText} !important;
                }
                .timeline-box-row {
                    display: flex !important;
                    width: 100% !important;
                    height: 100% !important;
                    border: 0.5px solid ${liveBorder} !important;
                }
                .timeline-hour-box {
                    flex: 1 !important;
                    height: 100% !important;
                    border-right: 0.5px solid ${liveBorder} !important;
                }
                .timeline-hour-box.day { background-color: ${liveDayBg} !important; }
                .timeline-hour-box.night { background-color: ${liveNightBg} !important; }
                .calendar-btn { display: none !important; }
                .timeline-indicator {
                    position: absolute !important;
                    top: 0 !important;
                    bottom: 0 !important;
                    background-color: #ef4444 !important;
                    width: 2px !important;
                    z-index: 10 !important;
                }
                .multi-range-title {
                    font-size: 22px !important;
                    margin-bottom: 20px !important;
                    color: ${liveText} !important;
                }
                .data-table { border-collapse: collapse !important; width: 100% !important; color: ${liveText} !important; }
                .data-table th, .data-table td { border: 1px solid var(--border) !important; padding: 12px !important; color: ${liveText} !important; }
                .zone-code, .zone-name, .offset-text, .period-days-text, .period-time-text { color: ${liveText} !important; }
                * { box-sizing: border-box !important; }
            `;

            let safeCssText = `${cssText}\n${extraCss}`
                .replace(/\/\*[\s\S]*?\*\//g, "")
                .replace(/<\/style>/gi, "<\\/style>")
                .replace(/url\s*\(/gi, "none(");

            const tempDiv = doc.createElement("div");
            tempDiv.insertAdjacentHTML?.("beforeend", markup);

            const riskyTags = ["script", "iframe", "object", "embed", "link", "meta", "image", "img"];
            riskyTags.forEach((tag) => {
                Array.from(tempDiv.querySelectorAll?.(tag) || []).forEach((el) => el.remove?.());
            });

            const showElementFilter = (typeof NodeFilter !== "undefined" && Number.isFinite(NodeFilter.SHOW_ELEMENT))
                ? NodeFilter.SHOW_ELEMENT
                : 1;
            const walker = doc.createTreeWalker?.(tempDiv, showElementFilter);
            const SAFE_ATTRS = new Set([
                "id", "class", "style", "colspan", "rowspan", "width", "height", "xmlns",
                "viewbox", "x", "y", "rx", "ry", "cx", "cy", "r", "d", "fill", "stroke",
                "stroke-width", "points", "transform", "preserveaspectratio", "opacity"
            ]);

            if (walker) {
                let curr = walker.nextNode();
                while (curr) {
                    if (curr.nodeType === 1) {
                        const attrs = Array.from(curr.attributes || []);
                        for (const attr of attrs) {
                            if (!SAFE_ATTRS.has(String(attr.name || "").toLowerCase())) {
                                curr.removeAttribute?.(attr.name);
                            }
                        }
                        const style = curr.getAttribute?.("style");
                        if (style && style.toLowerCase().includes("url")) {
                            curr.setAttribute?.("style", style.replace(/url\s*\(/gi, "none("));
                        }
                    }
                    curr = walker.nextNode();
                }
            }

            const svgMarkup = `
                <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
                    <foreignObject width="100%" height="100%">
                        <div xmlns="http://www.w3.org/1999/xhtml">
                            <style>/* <![CDATA[ */\n${safeCssText}\n/* ]]> */</style>
                            ${tempDiv.innerHTML}
                        </div>
                    </foreignObject>
                </svg>
            `;

            const svgDataUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgMarkup);

            await waitForDocumentFontsReady();
            const img = await loadImageElement(svgDataUrl);
            const canvas = doc.createElement("canvas");
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const ctx = canvas.getContext?.("2d");
            if (!ctx) throw new Error("Canvas context unavailable");

            ctx.fillStyle = getComputedStyleSafe(doc.body).backgroundColor || "#0f172a";
            ctx.fillRect(0, 0, targetWidth, targetHeight);
            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

            try {
                ctx.getImageData(0, 0, 1, 1);
            } catch (taintErr) {
                throw taintErr;
            }

            return canvas.toDataURL("image/png");
        }

        return Object.freeze({
            collectDocumentCssText,
            loadImageElement,
            waitForDocumentFontsReady,
            isDomExceptionLike,
            detectForeignObjectRendererSupport,
            renderElementWithForeignObjectToPngDataUrl
        });
    }

    globalObj.GTVImageForeignRender = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);


// --- File: js/modules/group-state.js ---
(function initGtvGroupState(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const timeZoneValidationCache = new Map();
        let generatedIdCounter = 0;

        function callDep(name, fallback, ...args) {
            const fn = safeDeps[name];
            if (typeof fn !== "function") return fallback;
            try {
                return fn(...args);
            } catch (_err) {
                return fallback;
            }
        }

        function createTimezoneId(prefix = "tz") {
            const fromDep = callDep("createUniqueTimezoneId", "", prefix);
            if (typeof fromDep === "string" && fromDep.trim()) return fromDep.trim();
            generatedIdCounter += 1;
            return `${prefix}-${Date.now()}-${generatedIdCounter}`;
        }

        function isValidTimeZone(zoneName) {
            const normalized = (typeof zoneName === "string") ? zoneName.trim() : "";
            if (!normalized) return false;
            if (timeZoneValidationCache.has(normalized)) {
                return timeZoneValidationCache.get(normalized);
            }

            let valid = false;
            try {
                new Intl.DateTimeFormat("en-US", { timeZone: normalized }).format(new Date());
                valid = true;
            } catch (err) {
                valid = false;
            }

            timeZoneValidationCache.set(normalized, valid);
            return valid;
        }

        function sanitizeTimezoneZone(zone) {
            if (!zone || typeof zone !== "object") return null;
            const zoneType = zone.type === "custom" ? "custom" : "standard";
            const requestedId = callDep("sanitizeTimezoneId", "", zone.id);
            const fallbackPrefix = zoneType === "custom" ? "tz-c" : "tz";
            const id = requestedId || createTimezoneId(fallbackPrefix);
            if (!id) return null;

            if (zoneType === "custom") {
                const offH = parseInt(zone.offH, 10);
                const offM = parseInt(zone.offM, 10);
                return {
                    id,
                    type: "custom",
                    abbr: callDep("normalizeCustomAbbr", "", zone.abbr),
                    name: (typeof zone.name === "string" && zone.name.trim()) ? zone.name.trim() : callDep("t", "Custom", "label_custom"),
                    offH: Number.isFinite(offH) ? Math.max(-14, Math.min(14, offH)) : 0,
                    offM: Number.isFinite(offM) ? Math.max(0, Math.min(59, Math.abs(offM))) : 0
                };
            }

            const timeZoneName = (typeof zone.zone === "string" && zone.zone.trim()) ? zone.zone : null;
            if (!timeZoneName || !isValidTimeZone(timeZoneName)) return null;
            const fallbackName = (typeof zone.name === "string" && zone.name.trim()) ? zone.name.trim() : timeZoneName;
            const rawFixedOffset = zone.fixedOffsetMinutes;
            const hasFixedOffsetValue = (
                rawFixedOffset !== null
                && rawFixedOffset !== undefined
                && !(typeof rawFixedOffset === "string" && !rawFixedOffset.trim())
            );
            const parsedFixedOffset = hasFixedOffsetValue ? Number(rawFixedOffset) : NaN;
            const fixedOffsetMinutes = Number.isFinite(parsedFixedOffset)
                ? Math.min(14 * 60, Math.max(-14 * 60, Math.trunc(parsedFixedOffset)))
                : null;
            const fixedAbbr = callDep("normalizeZoneAbbreviation", "", zone.fixedAbbr);
            return {
                id,
                type: "standard",
                zone: timeZoneName,
                name_ko: (typeof zone.name_ko === "string" && zone.name_ko.trim()) ? zone.name_ko : fallbackName,
                name_en: (typeof zone.name_en === "string" && zone.name_en.trim()) ? zone.name_en : fallbackName,
                fixedOffsetMinutes,
                fixedAbbr: fixedAbbr || ""
            };
        }

        function sanitizeGroup(group, idx, legacyMultiState = null) {
            if (!group || typeof group !== "object") return null;

            const rawZones = Array.isArray(group.zones) ? group.zones.map(sanitizeTimezoneZone).filter(Boolean) : [];
            const zones = rawZones
                .filter((zone) => !(zone.type === "standard" && zone.zone === "UTC"))
                .map((zone) => ({ ...zone }));

            const seenZoneIds = new Set(["utc"]);
            zones.forEach((zone) => {
                let zoneId = callDep("sanitizeTimezoneId", "", zone.id);
                if (!zoneId || seenZoneIds.has(zoneId)) {
                    const prefix = zone.type === "custom" ? "tz-c" : "tz";
                    do {
                        zoneId = createTimezoneId(prefix);
                    } while (!zoneId || seenZoneIds.has(zoneId));
                }
                zone.id = zoneId;
                seenZoneIds.add(zoneId);
            });

            const defaultGroupLabel = callDep("t", "Group", "default_group_name");
            const safeIndex = Number.isFinite(Number(idx)) ? Math.max(0, Math.trunc(Number(idx))) : 0;
            const name = (typeof group.name === "string" && group.name.trim()) ? group.name.trim() : `${defaultGroupLabel} ${safeIndex + 1}`;
            let requestedBaseTimezoneId = callDep("sanitizeBaseTimezoneId", "utc", group.baseTimezoneId);
            if (requestedBaseTimezoneId !== "utc") {
                const baseIsLegacyUtcZone = rawZones.some((zone) => zone.id === requestedBaseTimezoneId && zone.type === "standard" && zone.zone === "UTC");
                if (baseIsLegacyUtcZone) requestedBaseTimezoneId = "utc";
            }
            const isBaseTimezoneValid = requestedBaseTimezoneId === "utc" || zones.some((zone) => zone.id === requestedBaseTimezoneId);
            const hasLegacyUtcZone = rawZones.length !== zones.length;
            const showUtcRow = hasLegacyUtcZone ? true : (typeof group.showUtcRow === "boolean" ? group.showUtcRow : true);
            const utcRowOrder = callDep("sanitizeUtcRowOrder", 0, group.utcRowOrder);
            const rawMultiSubgroups = Array.isArray(group.multiSubgroups) ? group.multiSubgroups : [];
            const multiSubgroups = rawMultiSubgroups.map((subgroup) => ({
                id: callDep("sanitizeMultiSubgroupId", "", subgroup?.id),
                name: subgroup?.name,
                multiRangeCount: subgroup?.multiRangeCount,
                multiRanges: subgroup?.multiRanges,
                multiRangeCollapsed: subgroup?.multiRangeCollapsed,
                multiRangeStartEditEnabled: subgroup?.multiRangeStartEditEnabled,
                multiRangeEndEditEnabled: subgroup?.multiRangeEndEditEnabled
            }));
            const activeMultiSubgroupId = callDep("sanitizeMultiSubgroupId", "", group.activeMultiSubgroupId);
            const fixedTimes = (typeof safeDeps.sanitizeFixedTimes === "function")
                ? callDep("sanitizeFixedTimes", [], group.fixedTimes)
                : [];
            const fixedDate = (typeof safeDeps.sanitizeFixedDateValue === "function")
                ? callDep("sanitizeFixedDateValue", "", group.fixedDate, "")
                : "";
            const sanitizedGroup = {
                name,
                zones,
                baseTimezoneId: isBaseTimezoneValid ? requestedBaseTimezoneId : "utc",
                showUtcRow,
                utcRowOrder,
                fixedTimes,
                fixedDate,
                activeMultiSubgroupId,
                multiSubgroups
            };

            const hasLegacyMultiState = group.multiRanges || group.multiRangeCount || group.multiRangeCollapsed || group.multiRangeStartEditEnabled || group.multiRangeEndEditEnabled;
            const groupLegacyMultiState = hasLegacyMultiState
                ? {
                    multiRangeCount: group.multiRangeCount,
                    multiRanges: group.multiRanges,
                    multiRangeCollapsed: group.multiRangeCollapsed,
                    multiRangeStartEditEnabled: group.multiRangeStartEditEnabled,
                    multiRangeEndEditEnabled: group.multiRangeEndEditEnabled,
                    multiRangeTitle: group.multiRangeTitle
                }
                : null;

            callDep("ensureGroupMultiSubgroups", null, sanitizedGroup, { legacyMultiState: groupLegacyMultiState || legacyMultiState });
            return sanitizedGroup;
        }

        return Object.freeze({
            sanitizeTimezoneZone,
            isValidTimeZone,
            sanitizeGroup
        });
    }

    globalObj.GTVGroupState = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/group-context-state.js ---
(function initGtvGroupContextState(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (_err) {
                return undefined;
            }
        }

        function getMainTabs() {
            if (!Array.isArray(safeDeps.MAIN_TABS)) {
                return ["live", "fixed", "multi", "fixed-time", "calc"];
            }
            return safeDeps.MAIN_TABS.filter((tab) => typeof tab === "string" && tab.trim());
        }

        function getGroups() {
            const groups = invokeDep("getGroups");
            return Array.isArray(groups) ? groups : [];
        }

        function getState() {
            const state = invokeDep("getState");
            if (!state || typeof state !== "object") {
                return {
                    currentMainTab: "live",
                    activeGroupId: 0,
                    activeGroupIdByMainTab: { live: 0, fixed: 0 }
                };
            }
            return {
                currentMainTab: typeof state.currentMainTab === "string" ? state.currentMainTab : "live",
                activeGroupId: state.activeGroupId,
                activeGroupIdByMainTab: state.activeGroupIdByMainTab
            };
        }

        function setState(next = {}) {
            invokeDep("setState", next);
        }

        function sanitizeMainTab(tab) {
            const tabs = getMainTabs();
            return tabs.includes(tab) ? tab : "live";
        }

        function clampGroupIndex(index) {
            const maxIndex = Math.max(0, getGroups().length - 1);
            const parsed = parseInt(index, 10);
            if (!Number.isFinite(parsed)) return 0;
            return Math.min(Math.max(parsed, 0), maxIndex);
        }

        function normalizeGroupTabState() {
            const state = getState();
            const nextActiveGroupId = clampGroupIndex(state.activeGroupId);
            const nextTabMap = {
                live: clampGroupIndex(state.activeGroupIdByMainTab && state.activeGroupIdByMainTab.live),
                fixed: clampGroupIndex(state.activeGroupIdByMainTab && state.activeGroupIdByMainTab.fixed)
            };
            setState({
                activeGroupId: nextActiveGroupId,
                activeGroupIdByMainTab: nextTabMap
            });
            return {
                activeGroupId: nextActiveGroupId,
                activeGroupIdByMainTab: nextTabMap
            };
        }

        function getCurrentGroup() {
            const groups = getGroups();
            if (!groups.length) return null;

            const state = getState();
            const currentMainTab = sanitizeMainTab(state.currentMainTab);
            const tabSpecific = currentMainTab === "live" || currentMainTab === "fixed";
            const targetId = tabSpecific
                ? (state.activeGroupIdByMainTab && state.activeGroupIdByMainTab[currentMainTab])
                : state.activeGroupId;
            return groups[clampGroupIndex(targetId)] || groups[0] || null;
        }

        function getCurrentGroupZones() {
            const group = getCurrentGroup();
            return Array.isArray(group && group.zones) ? group.zones : [];
        }

        function getCurrentGroupBaseTimezoneId() {
            const group = getCurrentGroup();
            return (group && typeof group.baseTimezoneId === "string" && group.baseTimezoneId)
                ? group.baseTimezoneId
                : "utc";
        }

        function getBaseTimezoneRef() {
            const requestedId = getCurrentGroupBaseTimezoneId();
            const matched = getCurrentGroupZones().find((z) => z && z.id === requestedId);
            if (matched) return matched;
            return invokeDep("getUTCRef") || null;
        }

        function ensureBaseTimezoneSelection() {
            const group = getCurrentGroup();
            if (!group) return getBaseTimezoneRef();
            const baseId = getCurrentGroupBaseTimezoneId();
            const exists = (baseId === "utc") || getCurrentGroupZones().some((z) => z && z.id === baseId);
            if (!exists) group.baseTimezoneId = "utc";
            return getBaseTimezoneRef();
        }

        function isCurrentGroupUtcRowVisible() {
            const group = getCurrentGroup();
            return !group || group.showUtcRow !== false;
        }

        function getCurrentGroupUtcRowOrder() {
            const group = getCurrentGroup();
            if (!group) return 0;
            const sanitized = invokeDep("sanitizeUtcRowOrder", group.utcRowOrder);
            if (Number.isFinite(sanitized)) return sanitized;
            const parsed = parseInt(group.utcRowOrder, 10);
            if (!Number.isFinite(parsed)) return 0;
            return Math.max(0, Math.min(1, parsed));
        }

        return Object.freeze({
            sanitizeMainTab,
            clampGroupIndex,
            normalizeGroupTabState,
            getCurrentGroup,
            getCurrentGroupZones,
            getCurrentGroupBaseTimezoneId,
            getBaseTimezoneRef,
            ensureBaseTimezoneSelection,
            isCurrentGroupUtcRowVisible,
            getCurrentGroupUtcRowOrder
        });
    }

    globalObj.GTVGroupContextState = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/group-tabs.js ---
(function initGtvGroupTabs(globalObj) {
    "use strict";

    function createService(deps) {
        function getState() {
            const state = (typeof deps.getState === "function") ? deps.getState() : null;
            return (state && typeof state === "object") ? state : {};
        }

        function getStateGroups(state = getState()) {
            return Array.isArray(state.groups) ? state.groups : [];
        }

        function clampGroupIndexByLength(index, length) {
            const max = Math.max(0, (Number.isFinite(length) ? length : 0) - 1);
            const parsed = parseInt(index, 10);
            if (!Number.isFinite(parsed)) return 0;
            return Math.min(Math.max(parsed, 0), max);
        }

        function setState(next) {
            if (!next || typeof next !== "object") return;
            if (typeof deps.setState !== "function") return;
            deps.setState(next);
        }

        function syncActiveGroupIdByCurrentTab() {
            const state = getState();
            if (state.currentMainTab !== "live" && state.currentMainTab !== "fixed") return;
            const nextMap = {
                ...(state.activeGroupIdByMainTab || { live: 0, fixed: 0 }),
                [state.currentMainTab]: state.activeGroupId
            };
            setState({ activeGroupIdByMainTab: nextMap });
        }

        function rerenderActiveTabBody() {
            if (deps.isMultiTab()) {
                deps.renderBaseTimeSelect();
                deps.renderMultiRanges();
            } else if (typeof deps.isFixedTimeTab === "function" && deps.isFixedTimeTab()) {
                deps.renderFixedTimeTab();
            } else {
                deps.renderList();
            }
            if (typeof deps.renderTimelineFrame === "function") {
                deps.renderTimelineFrame();
            }
        }

        function activateGroupTab(idx) {
            const state = getState();
            const groups = getStateGroups(state);
            if (!groups.length) return;
            const safeIdx = clampGroupIndexByLength(idx, groups.length);
            if (safeIdx === state.activeGroupId) return;
            deps.syncCurrentMultiStateToActiveSubgroup();
            setState({ activeGroupId: safeIdx });
            deps.normalizeGroupTabState();
            syncActiveGroupIdByCurrentTab();
            deps.loadCurrentMultiStateFromActiveSubgroup();
            deps.savePersistence();
            renderGroups();
            renderMultiSubgroups();
            rerenderActiveTabBody();
        }

        function addGroup() {
            const name = prompt(deps.t("prompt_new_group"), deps.t("default_group_name"));
            if (!name) return;

            deps.syncCurrentMultiStateToActiveSubgroup();
            const nextGroup = {
                name: name.trim(),
                zones: [],
                baseTimezoneId: "utc",
                showUtcRow: true,
                utcRowOrder: 0,
                fixedDate: (typeof deps.getDefaultFixedDate === "function")
                    ? deps.getDefaultFixedDate()
                    : "",
                fixedTimes: (typeof deps.getDefaultFixedTimes === "function")
                    ? deps.getDefaultFixedTimes()
                    : []
            };
            deps.ensureGroupMultiSubgroups(nextGroup);

            const state = getState();
            const currentGroups = getStateGroups(state);
            const nextGroups = [...currentGroups, nextGroup];
            const nextActiveGroupId = nextGroups.length - 1;
            setState({
                groups: nextGroups,
                activeGroupId: nextActiveGroupId
            });

            if (state.currentMainTab === "live" || state.currentMainTab === "fixed") {
                const nextMap = {
                    ...(state.activeGroupIdByMainTab || { live: 0, fixed: 0 }),
                    [state.currentMainTab]: nextActiveGroupId
                };
                setState({ activeGroupIdByMainTab: nextMap });
            }

            deps.loadCurrentMultiStateFromActiveSubgroup();
            deps.savePersistence();
            renderGroups();
            renderMultiSubgroups();
            rerenderActiveTabBody();
        }

        function renameGroup(idx) {
            const state = getState();
            const groups = getStateGroups(state);
            if (!groups.length) return;
            const safeIdx = clampGroupIndexByLength(idx, groups.length);
            const group = groups[safeIdx];
            if (!group) return;
            const newName = prompt(deps.t("prompt_rename_group"), group.name);
            if (!newName || !newName.trim()) return;
            group.name = newName.trim();
            deps.savePersistence();
            renderGroups();
            renderMultiSubgroups();
            deps.showToast(deps.t("toast_name_changed"));
        }

        function deleteGroup(idx) {
            const state = getState();
            const groups = getStateGroups(state);
            if (groups.length <= 1) {
                deps.showToast(deps.t("toast_group_min"));
                return;
            }
            if (!confirm(deps.t("confirm_delete_group"))) return;

            const safeIdx = clampGroupIndexByLength(idx, groups.length);
            const currentActiveGroupId = clampGroupIndexByLength(state.activeGroupId, groups.length);
            deps.syncCurrentMultiStateToActiveSubgroup();
            const nextGroups = [...groups];
            nextGroups.splice(safeIdx, 1);

            let nextActiveGroupId = currentActiveGroupId;
            if (safeIdx < currentActiveGroupId) {
                nextActiveGroupId = currentActiveGroupId - 1;
            } else if (safeIdx === currentActiveGroupId) {
                nextActiveGroupId = Math.max(0, currentActiveGroupId - 1);
            }
            nextActiveGroupId = clampGroupIndexByLength(nextActiveGroupId, nextGroups.length);
            setState({
                groups: nextGroups,
                activeGroupId: nextActiveGroupId
            });
            deps.normalizeGroupTabState();
            syncActiveGroupIdByCurrentTab();
            deps.loadCurrentMultiStateFromActiveSubgroup();
            deps.savePersistence();
            renderGroups();
            renderMultiSubgroups();
            rerenderActiveTabBody();
            deps.showToast(deps.t("toast_group_deleted"));
        }

        function activateMultiSubgroup(subgroupId) {
            const group = deps.getCurrentGroup();
            if (!group) return;
            deps.ensureGroupMultiSubgroups(group);
            if (!group.multiSubgroups.some((subgroup) => subgroup.id === subgroupId)) return;

            deps.syncCurrentMultiStateToActiveSubgroup();
            group.activeMultiSubgroupId = subgroupId;
            deps.loadCurrentMultiStateFromActiveSubgroup();
            deps.savePersistence();
            renderMultiSubgroups();
            if (deps.isMultiTab()) deps.renderMultiRanges();
        }

        function addMultiSubgroup() {
            const group = deps.getCurrentGroup();
            if (!group) return;
            deps.ensureGroupMultiSubgroups(group);

            const defaultName = deps.getDefaultMultiSubgroupName(group.multiSubgroups.length);
            const nextName = prompt(deps.t("prompt_new_subgroup"), defaultName);
            if (!nextName || !nextName.trim()) return;

            deps.syncCurrentMultiStateToActiveSubgroup();
            const subgroup = deps.createMultiSubgroupState(nextName, group.multiSubgroups.length, null);
            group.multiSubgroups.push(subgroup);
            group.activeMultiSubgroupId = subgroup.id;
            deps.loadCurrentMultiStateFromActiveSubgroup();
            deps.savePersistence();
            renderMultiSubgroups();
            if (deps.isMultiTab()) deps.renderMultiRanges();
        }

        function renameMultiSubgroup(subgroupId) {
            const group = deps.getCurrentGroup();
            if (!group) return;
            deps.ensureGroupMultiSubgroups(group);
            const subgroup = group.multiSubgroups.find((item) => item.id === subgroupId);
            if (!subgroup) return;

            const nextName = prompt(deps.t("prompt_rename_subgroup"), subgroup.name);
            if (!nextName || !nextName.trim()) return;
            subgroup.name = deps.sanitizeMultiSubgroupName(nextName, subgroup.name);
            setState({ multiRangeTitle: deps.sanitizeMultiRangeTitle(subgroup.name) });
            deps.savePersistence();
            renderMultiSubgroups();
            if (deps.isMultiTab()) deps.renderMultiRanges();
            deps.showToast(deps.t("toast_subgroup_name_changed"));
        }

        function deleteMultiSubgroup(subgroupId) {
            const group = deps.getCurrentGroup();
            if (!group) return;
            deps.ensureGroupMultiSubgroups(group);
            if (group.multiSubgroups.length <= 1) {
                deps.showToast(deps.t("toast_subgroup_min"));
                return;
            }
            if (!confirm(deps.t("confirm_delete_subgroup"))) return;

            deps.syncCurrentMultiStateToActiveSubgroup();
            const removeIdx = group.multiSubgroups.findIndex((item) => item.id === subgroupId);
            if (removeIdx < 0) return;
            group.multiSubgroups.splice(removeIdx, 1);
            if (!group.multiSubgroups.length) {
                group.multiSubgroups.push(deps.createMultiSubgroupState(deps.getDefaultMultiSubgroupName(0), 0, null));
            }
            group.activeMultiSubgroupId = group.multiSubgroups[Math.max(0, removeIdx - 1)]?.id || group.multiSubgroups[0].id;
            deps.loadCurrentMultiStateFromActiveSubgroup();
            deps.savePersistence();
            renderMultiSubgroups();
            if (deps.isMultiTab()) deps.renderMultiRanges();
            deps.showToast(deps.t("toast_subgroup_deleted"));
        }

        function renderGroups() {
            deps.hideFloatingTooltip();
            const container = document.getElementById("group-tabs-container");
            const addBtn = document.getElementById("add-group-btn");
            if (!container || !addBtn) return;

            const state = getState();
            const { groups, activeGroupId } = state;
            container.textContent = "";

            getStateGroups(state).forEach((group, idx) => {
                deps.ensureGroupMultiSubgroups(group);
                const btn = document.createElement("div");
                btn.className = `group-tab ${idx === activeGroupId ? "active" : ""}`;
                btn.setAttribute("role", "button");
                btn.tabIndex = 0;

                const label = document.createElement("span");
                label.className = "group-name-label";
                label.textContent = group.name;
                let pointerDownX = 0;
                let pointerDownY = 0;
                btn.addEventListener("pointerdown", (e) => {
                    if (e.button !== 0) return;
                    pointerDownX = e.clientX;
                    pointerDownY = e.clientY;
                });
                btn.addEventListener("pointerup", (e) => {
                    if (e.button !== 0) return;
                    const target = e.target;
                    if (target instanceof Element && target.closest(".group-edit-btn, .group-export-btn, .group-import-btn, .group-del-btn")) return;
                    const deltaX = Math.abs(e.clientX - pointerDownX);
                    const deltaY = Math.abs(e.clientY - pointerDownY);
                    if (deltaX > 8 || deltaY > 8) return;
                    activateGroupTab(idx);
                });
                btn.addEventListener("keydown", (e) => {
                    if (e.key !== "Enter" && e.key !== " ") return;
                    e.preventDefault();
                    activateGroupTab(idx);
                });

                const editBtn = document.createElement("button");
                editBtn.className = "group-edit-btn";
                editBtn.textContent = "✎";
                deps.setCustomTooltip(editBtn, deps.t("tooltip_edit"));
                editBtn.onclick = (e) => {
                    e.stopPropagation();
                    renameGroup(idx);
                };

                const exportBtn = document.createElement("button");
                exportBtn.className = "group-export-btn";
                exportBtn.textContent = "⤒";
                deps.setCustomTooltip(exportBtn, deps.t("tooltip_group_export"));
                exportBtn.onclick = (e) => {
                    e.stopPropagation();
                    deps.exportGroupToJSON(idx);
                };

                const importBtn = document.createElement("button");
                importBtn.className = "group-import-btn";
                importBtn.textContent = "⤓";
                deps.setCustomTooltip(importBtn, deps.t("tooltip_group_import"));
                importBtn.onclick = (e) => {
                    e.stopPropagation();
                    deps.triggerGroupImportFor(idx);
                };

                const delBtn = document.createElement("button");
                delBtn.className = "group-del-btn";
                delBtn.textContent = "✕";
                deps.setCustomTooltip(delBtn, deps.t("tooltip_delete"));
                delBtn.onclick = (e) => {
                    e.stopPropagation();
                    deleteGroup(idx);
                };

                btn.appendChild(label);
                if (idx === activeGroupId) {
                    btn.appendChild(editBtn);
                    btn.appendChild(exportBtn);
                    btn.appendChild(importBtn);
                    btn.appendChild(delBtn);
                }
                container.appendChild(btn);
            });

            container.appendChild(addBtn);
            deps.upgradeNativeTitleTooltips(container);
        }

        function renderMultiSubgroups() {
            deps.hideFloatingTooltip();
            const container = document.getElementById("multi-subgroup-tabs-container");
            const addBtn = document.getElementById("add-multi-subgroup-btn");
            if (!container || !addBtn) return;

            if (!deps.isMultiTab()) {
                container.style.display = "none";
                return;
            }

            const group = deps.getCurrentGroup();
            if (!group) {
                container.textContent = "";
                container.appendChild(addBtn);
                container.style.display = "flex";
                return;
            }

            const state = getState();
            deps.ensureGroupMultiSubgroups(group);
            container.textContent = "";
            group.multiSubgroups.forEach((subgroup) => {
                const tab = document.createElement("div");
                const isActive = subgroup.id === group.activeMultiSubgroupId;
                tab.className = `multi-subgroup-tab ${isActive ? "active" : ""}`;
                tab.setAttribute("role", "button");
                tab.tabIndex = 0;
                tab.addEventListener("click", () => activateMultiSubgroup(subgroup.id));
                tab.addEventListener("keydown", (e) => {
                    if (e.key !== "Enter" && e.key !== " ") return;
                    e.preventDefault();
                    activateMultiSubgroup(subgroup.id);
                });

                const label = document.createElement("span");
                label.className = "multi-subgroup-name-label";
                label.textContent = subgroup.name;
                tab.appendChild(label);

                if (isActive) {
                    const editBtn = document.createElement("button");
                    editBtn.className = "multi-subgroup-edit-btn";
                    editBtn.type = "button";
                    editBtn.textContent = "✎";
                    deps.setCustomTooltip(editBtn, deps.t("tooltip_subgroup_edit"));
                    editBtn.onclick = (e) => {
                        e.stopPropagation();
                        renameMultiSubgroup(subgroup.id);
                    };

                    const exportBtn = document.createElement("button");
                    exportBtn.className = "multi-subgroup-export-btn";
                    exportBtn.type = "button";
                    exportBtn.textContent = "⤒";
                    deps.setCustomTooltip(exportBtn, deps.t("tooltip_subgroup_export"));
                    exportBtn.onclick = (e) => {
                        e.stopPropagation();
                        deps.exportSubgroupToJSON(state.activeGroupId, subgroup.id);
                    };

                    const importBtn = document.createElement("button");
                    importBtn.className = "multi-subgroup-import-btn";
                    importBtn.type = "button";
                    importBtn.textContent = "⤓";
                    deps.setCustomTooltip(importBtn, deps.t("tooltip_subgroup_import"));
                    importBtn.onclick = (e) => {
                        e.stopPropagation();
                        deps.triggerSubgroupImportFor(state.activeGroupId, subgroup.id);
                    };

                    const delBtn = document.createElement("button");
                    delBtn.className = "multi-subgroup-del-btn";
                    delBtn.type = "button";
                    delBtn.textContent = "✕";
                    deps.setCustomTooltip(delBtn, deps.t("tooltip_subgroup_delete"));
                    delBtn.onclick = (e) => {
                        e.stopPropagation();
                        deleteMultiSubgroup(subgroup.id);
                    };
                    tab.appendChild(editBtn);
                    tab.appendChild(exportBtn);
                    tab.appendChild(importBtn);
                    tab.appendChild(delBtn);
                }

                container.appendChild(tab);
            });

            container.appendChild(addBtn);
            container.style.display = "flex";
            deps.upgradeNativeTitleTooltips(container);
        }

        return Object.freeze({
            activateGroupTab,
            addGroup,
            renameGroup,
            activateMultiSubgroup,
            addMultiSubgroup,
            renameMultiSubgroup,
            deleteMultiSubgroup,
            renderGroups,
            renderMultiSubgroups
        });
    }

    globalObj.GTVGroupTabs = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/timezone-search.js ---
(function initGtvTimezoneSearch(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        let standardTimezoneEntriesCache = null;
        let standardTimezoneEntriesCacheYear = null;
        let standardTimezoneWarmupQueued = false;
        let fullTimezoneOverlayStandardEntries = [];
        let fullTimezoneOverlayCountryEntries = [];
        let fullTimezoneOverlayActiveTab = "standard";
        let generatedTimezoneIdSeq = 0;

        function getDocumentRef() {
            return (typeof document === "object" && document) ? document : null;
        }

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (_err) {
                return undefined;
            }
        }

        function getTZDatabase() {
            return Array.isArray(safeDeps.TZ_DATABASE) ? safeDeps.TZ_DATABASE : [];
        }

        function getZoneMap() {
            const zoneMapFromDep = invokeDep("getZoneMap");
            if (zoneMapFromDep && typeof zoneMapFromDep === "object") return zoneMapFromDep;
            return (safeDeps.ZONE_MAP && typeof safeDeps.ZONE_MAP === "object") ? safeDeps.ZONE_MAP : {};
        }

        function getCurrentLang() {
            const lang = invokeDep("getCurrentLang");
            return lang === "en" ? "en" : "ko";
        }

        function getLocalizedTZLabel(tzData) {
            const localized = invokeDep("getLocalizedTZLabel", tzData);
            if (typeof localized === "string" && localized.trim()) return localized;
            if (!tzData || typeof tzData !== "object") return "";
            if (getCurrentLang() === "en") {
                const en = String(tzData.name_en || tzData.name || "").trim();
                const cityEn = String(tzData.city_en || tzData.city || "").trim();
                if (en && cityEn) return `${en} - ${cityEn}`;
                return en || cityEn || String(tzData.zone || "");
            }
            const ko = String(tzData.name || tzData.name_ko || "").trim();
            const city = String(tzData.city || tzData.city_ko || "").trim();
            if (ko && city) return `${ko} - ${city}`;
            return ko || city || String(tzData.zone || "");
        }

        function getTimezoneOffsetSafe(zone, date) {
            const offset = invokeDep("getTimezoneOffset", zone, date);
            return Number.isFinite(offset) ? offset : Number.NaN;
        }

        function getBetterAbbrSafe(zone, date) {
            const value = invokeDep("getBetterAbbr", zone, date);
            return String(value || "").trim();
        }

        function translate(key) {
            const translated = invokeDep("t", key);
            if (typeof translated === "string" && translated) return translated;
            return String(key || "");
        }

        function createUniqueTimezoneId(prefix = "tz") {
            const id = invokeDep("createUniqueTimezoneId", prefix);
            if (typeof id === "string" && id.trim()) return id;
            generatedTimezoneIdSeq += 1;
            return `${prefix}-${Date.now()}-${generatedTimezoneIdSeq}`;
        }

        function formatUtcOffsetLabel(totalMinutes = 0) {
            const safeTotalMinutes = Number.isFinite(totalMinutes) ? Math.trunc(totalMinutes) : 0;
            const sign = safeTotalMinutes >= 0 ? "+" : "-";
            const abs = Math.abs(safeTotalMinutes);
            const hh = String(Math.floor(abs / 60)).padStart(2, "0");
            const mm = String(abs % 60).padStart(2, "0");
            return `UTC${sign}${hh}:${mm}`;
        }

        function getZoneStandardDaylightOffsets(zone) {
            const safeZone = (typeof zone === "string") ? zone.trim() : "";
            if (!safeZone) return { standard: null, daylight: null };
            try {
                const now = new Date();
                const year = now.getUTCFullYear();
                const jan = new Date(Date.UTC(year, 0, 1, 12, 0, 0));
                const jul = new Date(Date.UTC(year, 6, 1, 12, 0, 0));
                const janOffset = getTimezoneOffsetSafe(safeZone, jan);
                const julOffset = getTimezoneOffsetSafe(safeZone, jul);
                if (!Number.isFinite(janOffset) || !Number.isFinite(julOffset)) {
                    return { standard: null, daylight: null };
                }
                if (janOffset === julOffset) {
                    return { standard: janOffset, daylight: null };
                }
                return {
                    standard: Math.min(janOffset, julOffset),
                    daylight: Math.max(janOffset, julOffset)
                };
            } catch (err) {
                return { standard: null, daylight: null };
            }
        }

        function normalizeZoneAbbreviation(value) {
            return String(value || "").replace("GMT", "UTC").trim().toUpperCase();
        }

        function getAllSupportedTimezoneNames() {
            try {
                if (typeof Intl !== "undefined" && typeof Intl.supportedValuesOf === "function") {
                    const values = Intl.supportedValuesOf("timeZone");
                    if (Array.isArray(values) && values.length) return values;
                }
            } catch (err) {
                // Fallback below.
            }
            const fallback = new Set(["UTC"]);
            getTZDatabase().forEach((tzData) => {
                if (tzData?.zone) fallback.add(tzData.zone);
            });
            return [...fallback];
        }

        function getSortedTZData(list) {
            const locale = getCurrentLang() === "en" ? "en-US" : "ko-KR";
            return [...list].sort((a, b) =>
                getLocalizedTZLabel(a).localeCompare(getLocalizedTZLabel(b), locale, { sensitivity: "base", numeric: true })
            );
        }

        function getSelectableTZEntries() {
            const entries = [];
            const zoneMap = getZoneMap();
            getSortedTZData(getTZDatabase()).forEach((tzData) => {
                const mapping = zoneMap[tzData.zone];
                if (Array.isArray(mapping) && mapping.length >= 2) {
                    const offsets = getZoneStandardDaylightOffsets(tzData.zone);
                    if (Number.isFinite(offsets.daylight) && Number.isFinite(offsets.standard) && offsets.daylight !== offsets.standard) {
                        entries.push({
                            ...tzData,
                            kind: "country_region",
                            key: `${tzData.zone}|dst`,
                            abbr: normalizeZoneAbbreviation(mapping[1]),
                            fixedOffsetMinutes: offsets.daylight
                        });
                        entries.push({
                            ...tzData,
                            kind: "country_region",
                            key: `${tzData.zone}|std`,
                            abbr: normalizeZoneAbbreviation(mapping[0]),
                            fixedOffsetMinutes: offsets.standard
                        });
                        return;
                    }
                }

                const baseAbbr = Array.isArray(mapping)
                    ? normalizeZoneAbbreviation(mapping[0])
                    : normalizeZoneAbbreviation(mapping || getBetterAbbrSafe(tzData.zone, new Date()));
                entries.push({
                    ...tzData,
                    kind: "country_region",
                    key: `${tzData.zone}|auto`,
                    abbr: baseAbbr || normalizeZoneAbbreviation(getBetterAbbrSafe(tzData.zone, new Date())),
                    fixedOffsetMinutes: null
                });
            });
            return entries;
        }

        function getStandardTimezoneEntries() {
            const now = new Date();
            const currentYear = now.getUTCFullYear();
            if (standardTimezoneEntriesCacheYear === currentYear && Array.isArray(standardTimezoneEntriesCache)) {
                return standardTimezoneEntriesCache.map((entry) => ({ ...entry }));
            }

            const entries = [];
            const seen = new Set();

            const pushEntry = (abbrValue, offsetMinutes, zone = "UTC") => {
                if (!Number.isFinite(offsetMinutes)) return;
                const safeOffset = Math.min(14 * 60, Math.max(-14 * 60, Math.trunc(offsetMinutes)));
                const abbr = normalizeZoneAbbreviation(abbrValue) || formatUtcOffsetLabel(safeOffset);
                const dedupeKey = `${abbr}|${safeOffset}`;
                if (seen.has(dedupeKey)) return;
                seen.add(dedupeKey);
                entries.push({
                    kind: "standard_list",
                    key: `std:${abbr}:${safeOffset}`,
                    zone,
                    abbr,
                    fixedOffsetMinutes: safeOffset
                });
            };

            pushEntry("UTC", 0, "UTC");

            const janDate = new Date(Date.UTC(currentYear, 0, 1, 12, 0, 0));
            const julDate = new Date(Date.UTC(currentYear, 6, 1, 12, 0, 0));
            getAllSupportedTimezoneNames().forEach((zone) => {
                if (zone === "UTC") return;
                const janOffset = getTimezoneOffsetSafe(zone, janDate);
                const julOffset = getTimezoneOffsetSafe(zone, julDate);
                if (!Number.isFinite(janOffset) || !Number.isFinite(julOffset)) return;

                const janAbbr = normalizeZoneAbbreviation(getBetterAbbrSafe(zone, janDate)) || formatUtcOffsetLabel(janOffset);
                const julAbbr = normalizeZoneAbbreviation(getBetterAbbrSafe(zone, julDate)) || formatUtcOffsetLabel(julOffset);

                if (janOffset === julOffset) {
                    pushEntry(janAbbr, janOffset, zone);
                    return;
                }

                const standardOffset = Math.min(janOffset, julOffset);
                const daylightOffset = Math.max(janOffset, julOffset);
                const standardAbbr = (janOffset === standardOffset) ? janAbbr : julAbbr;
                const daylightAbbr = (janOffset === daylightOffset) ? janAbbr : julAbbr;
                pushEntry(daylightAbbr, daylightOffset, zone);
                pushEntry(standardAbbr, standardOffset, zone);
            });

            const sorted = entries.sort((a, b) => {
                const diff = a.fixedOffsetMinutes - b.fixedOffsetMinutes;
                if (diff !== 0) return diff;
                return a.abbr.localeCompare(b.abbr, "en-US", { sensitivity: "base" });
            });
            standardTimezoneEntriesCache = sorted.map((entry) => ({ ...entry }));
            standardTimezoneEntriesCacheYear = currentYear;
            return sorted;
        }

        function queueStandardTimezoneWarmup() {
            const currentYear = new Date().getUTCFullYear();
            if (standardTimezoneEntriesCacheYear === currentYear && Array.isArray(standardTimezoneEntriesCache)) return;
            if (standardTimezoneWarmupQueued) return;
            standardTimezoneWarmupQueued = true;

            const warmup = () => {
                standardTimezoneWarmupQueued = false;
                try {
                    getStandardTimezoneEntries();
                } catch (err) {
                    console.warn("Failed to warm up standard timezone cache.", err);
                }
            };

            if (typeof globalObj.requestIdleCallback === "function") {
                globalObj.requestIdleCallback(warmup, { timeout: 1200 });
                return;
            }
            if (typeof globalObj.setTimeout === "function") {
                globalObj.setTimeout(warmup, 120);
                return;
            }
            warmup();
        }

        function getTimezoneEntryTitle(entry) {
            if (entry?.kind === "standard_list") {
                const offsetLabel = formatUtcOffsetLabel(entry.fixedOffsetMinutes);
                return getCurrentLang() === "en"
                    ? `${offsetLabel} Standard Time`
                    : `${offsetLabel} \uD45C\uC900\uC2DC`;
            }
            return getLocalizedTZLabel(entry);
        }

        function getSelectableTZEntryByKey(entryKey) {
            const key = (typeof entryKey === "string") ? entryKey.trim() : "";
            if (!key) return null;
            const countryEntry = getSelectableTZEntries().find((entry) => entry.key === key);
            if (countryEntry) return countryEntry;
            return getStandardTimezoneEntries().find((entry) => entry.key === key) || null;
        }

        function getSelectableTZOptionLabel(entry) {
            const line1 = getTimezoneEntryTitle(entry);
            const abbr = normalizeZoneAbbreviation(entry?.abbr);
            return abbr ? `${line1} [${abbr}]` : line1;
        }

        function createStandardTimezoneFromSelectableEntry(entry) {
            if (!entry || typeof entry !== "object") return null;
            if (entry.kind === "standard_list") {
                const abbr = normalizeZoneAbbreviation(entry.abbr);
                const fixedOffsetMinutes = Number.isFinite(entry.fixedOffsetMinutes) ? Math.trunc(entry.fixedOffsetMinutes) : null;
                const offsetLabel = formatUtcOffsetLabel(fixedOffsetMinutes);
                return {
                    id: createUniqueTimezoneId("tz"),
                    zone: entry.zone || "UTC",
                    name_ko: `${offsetLabel} \uD45C\uC900\uC2DC`,
                    name_en: `${offsetLabel} Standard Time`,
                    type: "standard",
                    fixedAbbr: abbr,
                    fixedOffsetMinutes
                };
            }
            return {
                id: createUniqueTimezoneId("tz"),
                zone: entry.zone,
                name_ko: `${entry.name} - ${entry.city}`,
                name_en: `${entry.name_en} - ${entry.city_en}`,
                type: "standard",
                fixedAbbr: normalizeZoneAbbreviation(entry.abbr),
                fixedOffsetMinutes: Number.isFinite(entry.fixedOffsetMinutes) ? entry.fixedOffsetMinutes : null
            };
        }

        function addFromSearchWithData(entryKey) {
            const entry = getSelectableTZEntryByKey(entryKey);
            const nextZone = createStandardTimezoneFromSelectableEntry(entry);
            if (nextZone) {
                invokeDep("addTimezone", {
                    ...nextZone
                });
            }
        }

        function createTimezoneListItem(tzEntry, closeOverlay = false) {
            const resolveEntryOffsetMinutes = (entry) => {
                const fixedOffsetRaw = entry?.fixedOffsetMinutes;
                const hasFixedOffsetValue = (
                    fixedOffsetRaw !== null
                    && fixedOffsetRaw !== undefined
                    && !(typeof fixedOffsetRaw === "string" && !fixedOffsetRaw.trim())
                );
                if (hasFixedOffsetValue) {
                    const fixedOffset = Number(fixedOffsetRaw);
                    if (Number.isFinite(fixedOffset)) return Math.trunc(fixedOffset);
                }
                if (entry?.zone) {
                    const liveOffset = getTimezoneOffsetSafe(entry.zone, new Date());
                    if (Number.isFinite(liveOffset)) return Math.trunc(liveOffset);
                }
                return null;
            };

            const formatOffsetBadgeLabel = (offsetMinutes) => {
                const compact = formatUtcOffsetLabel(offsetMinutes); // UTC+09:00
                return `UTC ${compact.slice(3)}`; // UTC +09:00
            };

            const toCanonicalOffsetText = (value) => String(value || "").replace(/\s+/g, "").toUpperCase();

            const doc = getDocumentRef();
            if (!doc || typeof doc.createElement !== "function") return null;
            const item = doc.createElement("div");
            item.className = "tz-item";
            const title = doc.createElement("div");
            title.className = "tz-item-title";
            title.textContent = getTimezoneEntryTitle(tzEntry);
            const abbr = doc.createElement("div");
            abbr.className = "tz-item-abbr";
            const abbrText = tzEntry?.kind === "standard_list"
                ? formatUtcOffsetLabel(tzEntry?.fixedOffsetMinutes)
                : (
                    normalizeZoneAbbreviation(tzEntry?.abbr)
                    || normalizeZoneAbbreviation(getBetterAbbrSafe(tzEntry?.zone, new Date()))
                    || "UTC"
                );
            if (tzEntry?.kind === "standard_list") {
                abbr.textContent = `[${abbrText}]`;
            } else {
                const offsetMinutes = resolveEntryOffsetMinutes(tzEntry);
                if (Number.isFinite(offsetMinutes)) {
                    const offsetText = formatOffsetBadgeLabel(offsetMinutes);
                    if (toCanonicalOffsetText(abbrText) === toCanonicalOffsetText(offsetText)) {
                        abbr.textContent = `[${abbrText}]`;
                    } else {
                        abbr.textContent = `[${abbrText}] [${offsetText}]`;
                    }
                } else {
                    abbr.textContent = `[${abbrText}]`;
                }
            }
            item.appendChild(title);
            item.appendChild(abbr);
            item.addEventListener("click", () => {
                addFromSearchWithData(tzEntry.key);
                if (closeOverlay) {
                    const overlay = doc.getElementById?.("full-tz-overlay");
                    if (overlay) overlay.style.display = "none";
                }
            });
            return item;
        }

        function sanitizeFullTimezoneOverlayTab(value) {
            return value === "country" ? "country" : "standard";
        }

        function renderFullTimezoneOverlayList() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function") return;
            const list = doc.getElementById("full-tz-list");
            if (!list) return;

            list.innerHTML = "";
            const entries = fullTimezoneOverlayActiveTab === "country"
                ? fullTimezoneOverlayCountryEntries
                : fullTimezoneOverlayStandardEntries;
            entries.forEach((entry) => {
                const item = createTimezoneListItem(entry, true);
                if (item) list.appendChild(item);
            });
        }

        function updateFullTimezoneOverlayTabButtons() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function") return;
            const standardTabBtn = doc.getElementById("tz-tab-standard");
            const countryTabBtn = doc.getElementById("tz-tab-country");
            if (standardTabBtn) {
                standardTabBtn.classList.toggle("active", fullTimezoneOverlayActiveTab === "standard");
                standardTabBtn.setAttribute("aria-selected", fullTimezoneOverlayActiveTab === "standard" ? "true" : "false");
            }
            if (countryTabBtn) {
                countryTabBtn.classList.toggle("active", fullTimezoneOverlayActiveTab === "country");
                countryTabBtn.setAttribute("aria-selected", fullTimezoneOverlayActiveTab === "country" ? "true" : "false");
            }
        }

        function setFullTimezoneOverlayTab(value) {
            fullTimezoneOverlayActiveTab = sanitizeFullTimezoneOverlayTab(value);
            updateFullTimezoneOverlayTabButtons();
            renderFullTimezoneOverlayList();
        }

        function updateTZDropdown() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function" || typeof doc.createElement !== "function") return;
            const quickSelect = doc.getElementById("tz-quick-select");
            if (!quickSelect) return;
            const placeholder = quickSelect.options?.[0] || null;
            quickSelect.textContent = "";
            if (placeholder) quickSelect.appendChild(placeholder);

            const utcOption = doc.createElement("option");
            utcOption.value = "UTC";
            utcOption.textContent = translate("utc_name");
            quickSelect.appendChild(utcOption);

            getSelectableTZEntries().forEach((entry) => {
                const option = doc.createElement("option");
                option.value = entry.key;
                option.textContent = getSelectableTZOptionLabel(entry);
                quickSelect.appendChild(option);
            });
            invokeDep("adjustSelectWidthForContent", quickSelect, 118);
        }

        function initSearchAndSelect() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function") return;
            const quickSelect = doc.getElementById("tz-quick-select");
            if (!quickSelect) return;

            updateTZDropdown();

            quickSelect.onchange = (e) => {
                const value = e?.target?.value;
                if (value === "UTC") {
                    const activeGroup = invokeDep("getCurrentGroup");
                    if (activeGroup) {
                        activeGroup.showUtcRow = true;
                        if (!Number.isFinite(parseInt(activeGroup.utcRowOrder, 10))) {
                            activeGroup.utcRowOrder = 0;
                        }
                        invokeDep("savePersistence");
                        invokeDep("renderList");
                    }
                    quickSelect.value = "";
                    return;
                }
                const entry = getSelectableTZEntryByKey(value);
                if (entry) addFromSearchWithData(entry.key);
                quickSelect.value = "";
            };

            const showAllBtn = doc.getElementById("show-all-tz");
            if (showAllBtn) {
                showAllBtn.onclick = () => {
                    const overlay = doc.getElementById("full-tz-overlay");
                    if (!overlay) return;
                    fullTimezoneOverlayStandardEntries = getStandardTimezoneEntries();
                    fullTimezoneOverlayCountryEntries = getSelectableTZEntries();
                    setFullTimezoneOverlayTab("standard");
                    overlay.style.display = "flex";
                };
            }

            const standardTabBtn = doc.getElementById("tz-tab-standard");
            const countryTabBtn = doc.getElementById("tz-tab-country");
            if (standardTabBtn) {
                standardTabBtn.addEventListener("click", () => setFullTimezoneOverlayTab("standard"));
            }
            if (countryTabBtn) {
                countryTabBtn.addEventListener("click", () => setFullTimezoneOverlayTab("country"));
            }

            const closeOverlayBtn = doc.getElementById("close-overlay");
            if (closeOverlayBtn) {
                closeOverlayBtn.onclick = () => {
                    const overlay = doc.getElementById("full-tz-overlay");
                    if (overlay) overlay.style.display = "none";
                };
            }
        }

        return Object.freeze({
            formatUtcOffsetLabel,
            normalizeZoneAbbreviation,
            getAllSupportedTimezoneNames,
            getSelectableTZEntries,
            getStandardTimezoneEntries,
            queueStandardTimezoneWarmup,
            getTimezoneEntryTitle,
            getSelectableTZEntryByKey,
            getSelectableTZOptionLabel,
            sanitizeFullTimezoneOverlayTab,
            renderFullTimezoneOverlayList,
            updateFullTimezoneOverlayTabButtons,
            setFullTimezoneOverlayTab,
            updateTZDropdown,
            initSearchAndSelect,
            createStandardTimezoneFromSelectableEntry,
            addFromSearchWithData
        });
    }

    globalObj.GTVTimezoneSearch = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);


// --- File: js/modules/snapshot-format.js ---
(function initGtvSnapshotFormat(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const defaultCopyTimePartsEnabled = (safeDeps.DEFAULT_COPY_TIME_PARTS_ENABLED && typeof safeDeps.DEFAULT_COPY_TIME_PARTS_ENABLED === "object")
            ? safeDeps.DEFAULT_COPY_TIME_PARTS_ENABLED
            : Object.freeze({ dn: true, date: true, time: true, weekday: true });

        function callDep(name, fallback, ...args) {
            const fn = safeDeps[name];
            if (typeof fn !== "function") return fallback;
            try {
                return fn(...args);
            } catch (_err) {
                return fallback;
            }
        }

        function safePad(value) {
            return callDep("pad", String(Math.max(0, Math.trunc(Number(value) || 0))).padStart(2, "0"), value);
        }

        function safeTimeServiceMethod(name, fallback, ...args) {
            const fn = safeDeps?.timeService?.[name];
            if (typeof fn !== "function") return fallback;
            try {
                return fn(...args);
            } catch (_err) {
                return fallback;
            }
        }

        function getDayNamesByLang() {
            const lang = callDep("getCurrentLang", "en");
            return safeDeps.I18N_DATA?.[lang]?.days || safeDeps.I18N_DATA?.en?.days || [];
        }

        function getTimezoneRefById(id) {
            if (!id) return null;
            if (id === "utc") return callDep("getUTCRef", null);
            const baseRef = callDep("getBaseTimezoneRef", null);
            if (baseRef?.id === id) return baseRef;
            const zones = callDep("getCurrentGroupZones", []);
            if (!Array.isArray(zones)) return null;
            return zones.find((zone) => zone?.id === id) || null;
        }

        function toValidDate(value, fallbackDate = null) {
            if (value instanceof Date && Number.isFinite(value.getTime())) {
                return new Date(value.getTime());
            }
            const parsed = new Date(value);
            if (Number.isFinite(parsed.getTime())) return parsed;
            if (fallbackDate instanceof Date && Number.isFinite(fallbackDate.getTime())) {
                return new Date(fallbackDate.getTime());
            }
            return null;
        }

        function formatOffsetLabel(totalMinutes = 0) {
            const safeTotalMinutes = Number.isFinite(totalMinutes) ? Math.trunc(totalMinutes) : 0;
            const sign = safeTotalMinutes >= 0 ? "+" : "-";
            const absMin = Math.abs(safeTotalMinutes);
            return `UTC${sign}${safePad(Math.floor(absMin / 60))}:${safePad(absMin % 60)}`;
        }

        function resolveSnapshotOffsetMinutes(tz, anchorDate, fixedDisplayOffsetMinutes = null) {
            if (tz?.type === "custom") return callDep("getCustomOffsetMinutes", 0, tz);
            if (Number.isFinite(fixedDisplayOffsetMinutes)) return Math.trunc(fixedDisplayOffsetMinutes);
            const dt = safeTimeServiceMethod("toDateTime", null, anchorDate, tz?.zone || "UTC");
            const offset = Number(dt?.offset);
            return Number.isFinite(offset) ? Math.trunc(offset) : 0;
        }

        function buildTimezoneComputedSnapshotForDates(tz, slotDates = [], options = {}) {
            if (!tz || typeof tz !== "object") return null;

            const fallbackDate = new Date();
            let safeDates = Array.isArray(slotDates)
                ? slotDates.map((date) => toValidDate(date, null)).filter(Boolean)
                : [];
            if (!safeDates.length) safeDates = [fallbackDate];

            const anchorDate = safeDates[0];
            const hasFixedOption = Object.prototype.hasOwnProperty.call(options || {}, "fixedDisplayOffsetMinutes");
            const fixedDisplayOffsetMinutes = hasFixedOption
                ? options.fixedDisplayOffsetMinutes
                : callDep("getFixedOffsetForDisplay", null, tz);
            const zone = tz.type === "custom" ? "CUSTOM" : (tz.zone || "UTC");

            const zoneCodeMain = (tz.type === "custom")
                ? callDep("normalizeCustomAbbr", "", tz.abbr)
                : callDep("getZoneAbbreviation", "", tz, anchorDate);
            const offsetStr = formatOffsetLabel(resolveSnapshotOffsetMinutes(tz, anchorDate, fixedDisplayOffsetMinutes));
            const dayNamesByLang = getDayNamesByLang();

            const timeValues = [];
            const dateValues = [];
            const clockValues = [];
            const dayNameValues = [];
            const dayIndexes = [];
            const dayNightIconValues = [];

            safeDates.forEach((slotDate) => {
                const validDate = toValidDate(slotDate, fallbackDate) || fallbackDate;
                const parts = safeTimeServiceMethod("resolveLocalDateParts", null, validDate, zone, tz.id, fixedDisplayOffsetMinutes);
                if (!parts) return;

                const hour = Number.isFinite(parts?.H) ? Math.trunc(parts.H) : 0;
                const minute = Number.isFinite(parts?.min) ? Math.trunc(parts.min) : 0;
                const second = Number.isFinite(parts?.S) ? Math.trunc(parts.S) : 0;
                const year = Number.isFinite(parts?.Y) ? Math.trunc(parts.Y) : 1970;
                const month = Number.isFinite(parts?.M) ? Math.trunc(parts.M) : 1;
                const day = Number.isFinite(parts?.D) ? Math.trunc(parts.D) : 1;

                const timeStr = `${year}-${safePad(month)}-${safePad(day)} ${safePad(hour)}:${safePad(minute)}:${safePad(second)}`;
                const dateStr = `${year}-${safePad(month)}-${safePad(day)}`;
                const clockStr = `${safePad(hour)}:${safePad(minute)}:${safePad(second)}`;

                // Use local calendar date parts for weekday to avoid an extra timezone conversion call.
                const weekdayDate = new Date(Date.UTC(
                    Math.max(1, year),
                    Math.max(0, month - 1),
                    Math.max(1, day)
                ));
                const weekdayIndex = Number.isFinite(weekdayDate.getTime()) ? weekdayDate.getUTCDay() : 0;

                timeValues.push(timeStr);
                dateValues.push(dateStr);
                clockValues.push(clockStr);
                dayIndexes.push(weekdayIndex);
                dayNameValues.push(dayNamesByLang[weekdayIndex] || "");
                dayNightIconValues.push(hour >= 6 && hour <= 18 ? "DAY" : "NIGHT");
            });

            let periodDaysText = "";
            let periodTimeText = "";
            if (timeValues.length > 1) {
                const spanDays = callDep("getSignedInclusiveDaySpan", null, timeValues[0], timeValues[1]);
                const spanTime = callDep("getSignedDurationDayHourMinute", null, timeValues[0], timeValues[1]);
                periodDaysText = spanDays === null ? "" : `${spanDays}${callDep("t", "d", "unit_days_suffix")}`;
                periodTimeText = spanTime === null ? "" : spanTime;
            }

            return {
                timezone: zoneCodeMain,
                region: callDep("getZoneDisplayName", "", tz),
                offset: offsetStr,
                times: timeValues,
                dates: dateValues,
                clocks: clockValues,
                dayNames: dayNameValues,
                dayIndexes,
                dayNightIcons: dayNightIconValues,
                periodDays: periodDaysText,
                periodTime: periodTimeText
            };
        }

        function buildTimezoneComputedSnapshot(id) {
            const tz = getTimezoneRefById(id);
            if (!tz) return null;

            const globalTimes = callDep("getGlobalTimes", []);
            const anchorDate = globalTimes[0] instanceof Date ? globalTimes[0] : new Date();
            const effectiveSlotCount = callDep("isRealtime", false) ? 1 : callDep("getSlotCount", 1);
            const slotDates = Array.from({ length: effectiveSlotCount }, (_, idx) =>
                (globalTimes[idx] instanceof Date) ? globalTimes[idx] : anchorDate
            );

            return buildTimezoneComputedSnapshotForDates(tz, slotDates);
        }

        function formatTimeTextByParts(snapshot, timePartsEnabled) {
            const safeParts = callDep("sanitizeTimePartsEnabled", defaultCopyTimePartsEnabled, timePartsEnabled, "copy");
            const dates = Array.isArray(snapshot.dates) ? snapshot.dates : [];
            const clocks = Array.isArray(snapshot.clocks) ? snapshot.clocks : [];
            const dayNames = Array.isArray(snapshot.dayNames) ? snapshot.dayNames : [];
            const dayNightIcons = Array.isArray(snapshot.dayNightIcons) ? snapshot.dayNightIcons : [];
            const slotSize = Math.max(dates.length, clocks.length, dayNames.length, dayNightIcons.length);
            const rendered = [];

            for (let i = 0; i < slotSize; i++) {
                const tokens = [];
                if (safeParts.dn && dayNightIcons[i]) tokens.push(dayNightIcons[i]);
                if (safeParts.date && dates[i]) tokens.push(dates[i]);
                if (safeParts.time && clocks[i]) tokens.push(clocks[i]);
                if (safeParts.weekday && dayNames[i]) tokens.push(`(${dayNames[i]})`);
                const merged = tokens.join(" ").trim();
                if (merged) rendered.push(merged);
            }

            return rendered.join(" ~ ");
        }

        function getCopyFieldText(snapshot, key, options = {}) {
            const { timePartsEnabled = defaultCopyTimePartsEnabled } = options;
            if (!snapshot) return "";
            if (key === "timezone") {
                const zoneCodeRaw = (snapshot.timezone || "").trim();
                if (!zoneCodeRaw) return "";
                return zoneCodeRaw.startsWith("[") ? zoneCodeRaw : `[${zoneCodeRaw}]`;
            }

            if (key === "region") {
                return (snapshot.region || "").trim();
            }

            if (key === "offset") {
                const offsetText = (snapshot.offset || "").trim();
                if (!offsetText) return "";
                return offsetText.startsWith("[") ? offsetText : `[${offsetText}]`;
            }

            if (key === "time") {
                return formatTimeTextByParts(snapshot, timePartsEnabled);
            }

            if (key === "period_days") {
                const periodText = (snapshot.periodDays || "").trim();
                if (!periodText || periodText === "-") return "";
                return `[${periodText}]`;
            }

            if (key === "period_time") {
                const periodTimeText = (snapshot.periodTime || "").trim();
                if (!periodTimeText || periodTimeText === "-") return "";
                return `[${periodTimeText}]`;
            }

            return "";
        }

        function formatSnapshotText(snapshot, order, enabled, timePartsEnabled = defaultCopyTimePartsEnabled) {
            if (!snapshot) return "";
            const orderedParts = [];
            const safeOrder = callDep("sanitizeCopyFormatOrder", [], order);
            (Array.isArray(safeOrder) ? safeOrder : []).forEach((key) => {
                if (!enabled?.[key]) return;
                const value = getCopyFieldText(snapshot, key, { timePartsEnabled });
                if (value) orderedParts.push(value);
            });
            return orderedParts.join(" ").trim();
        }

        function getRowFormattedText(rowOrId, order, enabled, timePartsEnabled = defaultCopyTimePartsEnabled) {
            const rowId = typeof rowOrId === "string"
                ? rowOrId
                : String(rowOrId?.id || "").replace("tz-row-", "");
            if (!rowId) return "";

            const snapshot = buildTimezoneComputedSnapshot(rowId);
            if (!snapshot) return "";
            return formatSnapshotText(snapshot, order, enabled, timePartsEnabled);
        }

        function getRowCopyText(rowOrId, options = {}) {
            const {
                order = [],
                enabled = {},
                timePartsEnabled = defaultCopyTimePartsEnabled
            } = options;
            return getRowFormattedText(rowOrId, order, enabled, timePartsEnabled);
        }

        return Object.freeze({
            getTimezoneRefById,
            buildTimezoneComputedSnapshotForDates,
            buildTimezoneComputedSnapshot,
            formatTimeTextByParts,
            getCopyFieldText,
            formatSnapshotText,
            getRowFormattedText,
            getRowCopyText
        });
    }

    globalObj.GTVSnapshotFormat = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/table-render.js ---
(function initGtvTableRender(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function getDocumentRef() {
            return (typeof document === "object" && document) ? document : null;
        }

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (err) {
                console.warn(`[GTVTableRender] Dependency "${name}" threw.`, err);
                return undefined;
            }
        }

        function translate(key) {
            const value = invokeDep("t", key);
            if (typeof value === "string" && value) return value;
            return String(key || "");
        }

        function getDisplayEnabledMap() {
            const enabled = invokeDep("getDisplayFormatEnabled");
            return (enabled && typeof enabled === "object") ? enabled : {};
        }

        function getDisplayTimePartsEnabledMap() {
            const enabled = invokeDep("getDisplayTimePartsEnabled");
            return (enabled && typeof enabled === "object") ? enabled : {};
        }

        function getSafeDisplayOrder() {
            const order = invokeDep("getDisplayFormatOrder");
            const sanitized = invokeDep("sanitizeCopyFormatOrder", order);
            if (Array.isArray(sanitized)) return sanitized;
            if (Array.isArray(order)) return order;
            return [];
        }

        function getSlotCountSafe() {
            const value = Number(invokeDep("getSlotCount"));
            return Number.isFinite(value) ? value : 1;
        }

        function getDisplayColumns(effectiveSlotCount) {
            const columns = [];
            const safeSlotCount = Number.isFinite(Number(effectiveSlotCount)) ? Number(effectiveSlotCount) : 1;
            const enabledMap = getDisplayEnabledMap();
            const isMultiTab = !!invokeDep("isMultiTab");
            getSafeDisplayOrder().forEach((key) => {
                if (key === "time") {
                    if (!enabledMap[key] && !isMultiTab) return;
                    columns.push("time_main");
                    if (safeSlotCount > 1) columns.push("time_extra");
                    return;
                }
                if (!enabledMap[key]) return;
                if ((key === "period_days" || key === "period_time") && safeSlotCount <= 1) {
                    return;
                }
                columns.push(key);
            });
            return columns;
        }

        function getDisplayTimeInputMode() {
            const enabled = getDisplayTimePartsEnabledMap();
            const showDate = !!enabled.date;
            const showTime = !!enabled.time;
            if (showDate && showTime) return "datetime";
            if (showDate) return "date";
            if (showTime) return "time";
            return "none";
        }

        function buildTimeColumnCell(slotIdx, slotCountToRender, options = {}) {
            if (slotIdx >= slotCountToRender) return "";
            const { isReadonly = false } = options;
            const enabled = getDisplayTimePartsEnabledMap();
            const showDn = !!enabled.dn;
            const showWeekday = !!enabled.weekday;
            const inputMode = getDisplayTimeInputMode();
            const hideInput = inputMode === "none";
            return `
                <td class="dynamic-cell">
                    <div class="time-day-group">
                        ${showDn ? `<span class="dn-icon dn-slot-${slotIdx}"></span>` : ""}
                        <input
                            type="text"
                            class="time-input slot-${slotIdx}${hideInput ? " time-input-hidden" : ""}"
                            spellcheck="false"
                            data-slot="${slotIdx}"
                            data-field="time"
                            data-input-mode="${inputMode}"
                            ${isReadonly || hideInput ? "readonly" : ""}
                        >
                        ${isReadonly || hideInput ? "" : ""}
                        ${showWeekday ? `<span class="day-badge day-slot-${slotIdx}">-</span>` : ""}
                        ${hideInput || isReadonly ? "" : `<button type="button" class="calendar-btn trigger-slot-${slotIdx}" tabindex="-1" title="달력(Date Picker) 열기">📅</button>`}
                    </div>
                </td>
            `;
        }

        function getDisplayColumnHeader(colKey) {
            const useRangeTimeLabels = !invokeDep("isRealtime") && getSlotCountSafe() > 1;
            switch (colKey) {
                case "timezone":
                    return `<th style="width: 110px;">${translate("th_tz_abbr")}</th>`;
                case "region":
                    return `<th style="width: 220px;">${translate("th_region")}</th>`;
                case "offset":
                    return `<th style="width: 140px;">${translate("th_utc_offset")}</th>`;
                case "time_main":
                    return `<th class="dynamic-col">${translate(useRangeTimeLabels ? "th_time_day_start" : "th_time_day_main")}</th>`;
                case "time_extra":
                    return `<th class="dynamic-col">${translate(useRangeTimeLabels ? "th_time_day_end" : "th_time_day_extra")}</th>`;
                case "period_days":
                    return `<th style="width: 90px;">${translate("th_period_days")}</th>`;
                case "period_time":
                    return `<th style="width: 170px;">${translate("th_period_time")}</th>`;
                default:
                    return "";
            }
        }

        function getMultiDisplayColumnHeader(colKey) {
            switch (colKey) {
                case "timezone":
                    return `<th style="width: 110px;">${translate("th_tz_abbr")}</th>`;
                case "region":
                    return `<th style="width: 220px;">${translate("th_region")}</th>`;
                case "offset":
                    return `<th style="width: 150px;">${translate("th_utc_offset")}</th>`;
                case "time_main":
                    return `<th class="dynamic-col">${translate("th_time_day_start")}</th>`;
                case "time_extra":
                    return `<th class="dynamic-col">${translate("th_time_day_end")}</th>`;
                case "period_days":
                    return `<th style="width: 100px;">${translate("th_period_days")}</th>`;
                case "period_time":
                    return `<th style="width: 180px;">${translate("th_period_time")}</th>`;
                default:
                    return "";
            }
        }

        function buildStaticRowCell(colKey, slotCountToRender, zoneNameHtml = "") {
            switch (colKey) {
                case "timezone":
                    return `<td class="timezone-cell"><div class="abbr-cell"><span class="zone-code"></span></div></td>`;
                case "region":
                    return `<td><div class="zone-info"><span class="zone-name">${zoneNameHtml}</span></div></td>`;
                case "offset":
                    return `<td><span class="offset-text"></span></td>`;
                case "time_main":
                case "time_extra": {
                    const slotIdx = colKey === "time_main" ? 0 : 1;
                    return buildTimeColumnCell(slotIdx, slotCountToRender, { isReadonly: invokeDep("isRealtime") });
                }
                case "period_days":
                    return `<td class="period-days-cell"><span class="period-days-text">-</span></td>`;
                case "period_time":
                    return `<td class="period-time-cell"><span class="period-time-text">-</span></td>`;
                default:
                    return "";
            }
        }

        function buildDynamicRowCell(colKey, slotCountToRender) {
            switch (colKey) {
                case "timezone":
                    return `<td class="timezone-cell"><div class="abbr-cell"><span class="zone-code"></span></div></td>`;
                case "region":
                    return `<td><div class="zone-info"><span class="zone-name"></span></div></td>`;
                case "offset":
                    return `<td><span class="offset-text"></span></td>`;
                case "time_main":
                case "time_extra": {
                    const slotIdx = colKey === "time_main" ? 0 : 1;
                    return buildTimeColumnCell(slotIdx, slotCountToRender, { isReadonly: invokeDep("isRealtime") });
                }
                case "period_days":
                    return `<td class="period-days-cell"><span class="period-days-text">-</span></td>`;
                case "period_time":
                    return `<td class="period-time-cell"><span class="period-time-text">-</span></td>`;
                default:
                    return "";
            }
        }

        function buildRowActionCells(copyButtonTitle, removeButtonText, removeButtonTitle = "") {
            const copyCell = `<td class="export-exclude copy-cell"><div class="btn-group"><button class="sm-btn copy-row-btn" title="${copyButtonTitle}">&#128203;</button></div></td>`;
            const removeTitleAttr = (typeof removeButtonTitle === "string" && removeButtonTitle.trim())
                ? ` title="${removeButtonTitle.trim()}"`
                : "";
            const removeCell = removeButtonText
                ? `<td class="export-exclude remove-cell"><div class="btn-group"><button class="sm-btn danger remove-row-btn"${removeTitleAttr}>${removeButtonText}</button></div></td>`
                : `<td class="export-exclude remove-cell"></td>`;
            return `${copyCell}${removeCell}`;
        }

        function createInteractiveTimezoneRow(tz, effectiveSlotCount, displayColumns, rowId = tz?.id) {
            const doc = getDocumentRef();
            if (!doc || typeof doc.createElement !== "function") return null;
            const safeTz = (tz && typeof tz === "object") ? tz : {};
            const safeRowId = String(rowId || safeTz.id || "utc");
            const safeDisplayColumns = Array.isArray(displayColumns) ? displayColumns : [];
            const tr = doc.createElement("tr");
            tr.className = "time-row";
            tr.id = `tz-row-${safeRowId}`;
            tr.draggable = false;

            const dragHandleHtml = `<button type="button" class="drag-handle" draggable="true">&#8942;&#8942;</button>`;
            let inner = `<td class="move-cell"><div class="btn-group">${dragHandleHtml}</div></td>`;
            safeDisplayColumns.forEach((colKey) => {
                inner += buildDynamicRowCell(colKey, effectiveSlotCount);
            });
            inner += buildRowActionCells(translate("tooltip_copy"), "X", translate("tooltip_remove_row"));
            tr.insertAdjacentHTML('beforeend', inner);

            const zoneNameEl = tr.querySelector(".zone-name");
            if (zoneNameEl) zoneNameEl.textContent = invokeDep("getZoneDisplayName", safeTz) || "";

            const copyBtn = tr.querySelector(".copy-row-btn");
            if (copyBtn) copyBtn.addEventListener("click", () => invokeDep("copyRow", safeRowId));

            const removeBtn = tr.querySelector(".remove-row-btn");
            if (removeBtn) removeBtn.addEventListener("click", () => invokeDep("removeTimezone", safeRowId));

            Array.from(tr.querySelectorAll(".time-input") || []).forEach((input) => {
                const slotIdx = parseInt(input.dataset.slot, 10);
                const inputMode = input.dataset.inputMode || "datetime";
                const timezoneId = safeRowId === "utc" ? null : safeTz.id;

                const triggerBtn = input.parentElement?.querySelector?.(`.trigger-slot-${slotIdx}`);
                const CustomDatePickerCtor = globalObj.CustomDatePicker;
                if (CustomDatePickerCtor && !input.classList.contains("time-input-hidden") && inputMode !== "none") {
                    if (input._cdp && typeof input._cdp.destroy === "function") {
                        input._cdp.destroy();
                    }
                    input._cdp = new CustomDatePickerCtor(input, {
                        type: inputMode === "date" ? "date" : "datetime",
                        lang: doc.documentElement?.lang || "en",
                        theme: doc.documentElement?.getAttribute?.("data-theme") || "dark",
                        triggerElement: triggerBtn || null
                    });
                }

                input.onchange = (e) => invokeDep("handleTimeChange", e.target.value, safeTz.zone || "CUSTOM", slotIdx, timezoneId, inputMode);
                input.onkeydown = (e) => {
                    if (e.key === "Enter") {
                        invokeDep("handleTimeChange", e.target.value, safeTz.zone || "CUSTOM", slotIdx, timezoneId, inputMode);
                        input.blur();
                    }
                };
            });

            const dragHandle = tr.querySelector(".drag-handle");
            if (dragHandle) dragHandle.draggable = true;
            if (dragHandle) {
                dragHandle.addEventListener("dragstart", (e) => {
                    tr.classList.add("dragging");
                    if (e.dataTransfer) {
                        e.dataTransfer.effectAllowed = "move";
                        e.dataTransfer.setData("text/plain", safeRowId);
                        const ghost = invokeDep("createDragGhostFromRow", tr);
                        e.dataTransfer.setDragImage(ghost || tr, 20, 20);
                    }
                });
                dragHandle.addEventListener("dragend", () => {
                    tr.classList.remove("dragging");
                    invokeDep("clearDragGhost");
                    invokeDep("saveOrder");
                    invokeDep("updateClocks");
                });
            }

            return tr;
        }

        function getRenderableTimezoneRows(baseRef) {
            const safeBaseRef = (baseRef && typeof baseRef === "object") ? baseRef : { id: "utc" };
            const currentZones = invokeDep("getCurrentGroupZones");
            const zoneRows = (Array.isArray(currentZones) ? currentZones : []).filter(
                (tz) => tz && typeof tz === "object" && tz.id !== safeBaseRef.id && !(tz.type === "standard" && tz.zone === "UTC")
            );
            const rowsToRender = [...zoneRows];
            if (safeBaseRef.id !== "utc" && invokeDep("isCurrentGroupUtcRowVisible")) {
                const utcRef = invokeDep("getUTCRef");
                if (utcRef && typeof utcRef === "object") {
                    const utcRowOrder = Number(invokeDep("getCurrentGroupUtcRowOrder"));
                    const safeUtcRowOrder = Number.isFinite(utcRowOrder) ? utcRowOrder : 0;
                    const insertIndex = Math.min(Math.max(safeUtcRowOrder, 0), rowsToRender.length);
                    rowsToRender.splice(insertIndex, 0, utcRef);
                }
            }
            return rowsToRender;
        }

        function renderList() {
            const doc = getDocumentRef();
            if (!doc) return;
            invokeDep("hideFloatingTooltip");
            if (invokeDep("isMultiTab")) {
                invokeDep("renderMultiRanges");
                return;
            }

            const effectiveSlotCount = invokeDep("isRealtime") ? 1 : getSlotCountSafe();
            const displayColumns = getDisplayColumns(effectiveSlotCount);
            const baseRef = invokeDep("getBaseTimezoneRef") || { id: "utc", zone: "UTC" };
            const baseZoneName = invokeDep("getZoneDisplayName", baseRef) || "";
            const escapedBaseZoneName = invokeDep("escapeHtml", baseZoneName);
            const baseRefName = (typeof escapedBaseZoneName === "string") ? escapedBaseZoneName : String(baseZoneName);
            const theadRow = doc.querySelector?.("#table-head tr");

            if (theadRow) {
                const headCells = [`<th class="move-col" style="width: 70px;">${translate("th_order")}</th>`];
                headCells.push(...displayColumns.map(getDisplayColumnHeader).filter(Boolean));
                headCells.push(`<th class="export-exclude" style="width: 70px;">${translate("th_copy")}</th>`);
                headCells.push(`<th class="export-exclude" style="width: 70px;">${translate("th_remove")}</th>`);
                theadRow.textContent = "";
                theadRow.insertAdjacentHTML('beforeend', headCells.join(""));
            }

            const container = doc.getElementById?.("clocks-container");
            if (!container) return;
            container.textContent = "";

            if (typeof doc.createElement !== "function") return;
            const baseRow = doc.createElement("tr");
            baseRow.className = "time-row static base-row";
            baseRow.id = `tz-row-${baseRef.id}`;
            let baseInner = `<td class="move-cell"><span class="drag-spacer" aria-hidden="true"></span></td>`;
            displayColumns.forEach((colKey) => {
                baseInner += buildStaticRowCell(colKey, effectiveSlotCount, baseRefName);
            });
            baseInner += buildRowActionCells(translate("tooltip_copy"), "");
            baseRow.insertAdjacentHTML('beforeend', baseInner);
            const baseCopyBtn = baseRow.querySelector(".copy-row-btn");
            if (baseCopyBtn) baseCopyBtn.addEventListener("click", () => invokeDep("copyRow", baseRef.id));
            container.appendChild(baseRow);

            for (let i = 0; i < effectiveSlotCount; i++) {
                const inputs = Array.from(baseRow.querySelectorAll(`.time-input[data-slot="${i}"]`) || []);
                inputs.forEach((input) => {
                    const inputMode = input.dataset.inputMode || "datetime";
                    const slotIdx = parseInt(input.dataset.slot, 10);

                    const triggerBtn = input.parentElement?.querySelector?.(`.trigger-slot-${slotIdx}`);
                    const CustomDatePickerCtor = globalObj.CustomDatePicker;
                    if (CustomDatePickerCtor && !input.classList.contains("time-input-hidden") && inputMode !== "none") {
                        if (input._cdp && typeof input._cdp.destroy === "function") {
                            input._cdp.destroy();
                        }
                        input._cdp = new CustomDatePickerCtor(input, {
                            type: inputMode === "date" ? "date" : "datetime",
                            lang: doc.documentElement?.lang || "en",
                            theme: doc.documentElement?.getAttribute?.("data-theme") || "dark",
                            triggerElement: triggerBtn || null
                        });
                    }

                    input.onchange = (e) => invokeDep("handleTimeChange", e.target.value, baseRef.zone || "CUSTOM", i, baseRef.id, inputMode);
                    input.onkeydown = (e) => {
                        if (e.key === "Enter") {
                            invokeDep("handleTimeChange", e.target.value, baseRef.zone || "CUSTOM", i, baseRef.id, inputMode);
                            input.blur();
                        }
                    };
                    if (invokeDep("isRealtime")) input.readOnly = true;
                });
            }

            const rowsToRender = getRenderableTimezoneRows(baseRef);
            rowsToRender.forEach((tz) => {
                if (!tz || typeof tz !== "object") return;
                const rowId = tz.id === "utc" ? "utc" : tz.id;
                const row = createInteractiveTimezoneRow(tz, effectiveSlotCount, displayColumns, rowId);
                if (row) container.appendChild(row);
            });

            invokeDep("renderBaseTimeSelect");
            invokeDep("updateTimeAdjustPanel");
            invokeDep("updateClocks");
            invokeDep("upgradeNativeTitleTooltips", container);
        }

        return Object.freeze({
            getDisplayColumns,
            getDisplayTimeInputMode,
            buildTimeColumnCell,
            getDisplayColumnHeader,
            getMultiDisplayColumnHeader,
            buildStaticRowCell,
            buildDynamicRowCell,
            buildRowActionCells,
            createInteractiveTimezoneRow,
            getRenderableTimezoneRows,
            renderList
        });
    }

    globalObj.GTVTableRender = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/table-image-render.js ---
(function initGtvTableImageRender(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (err) {
                console.warn(`[GTVTableImageRender] Dependency "${name}" threw.`, err);
                return undefined;
            }
        }

        async function invokeDepAsync(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return await safeDeps[name](...args);
            } catch (err) {
                console.warn(`[GTVTableImageRender] Dependency "${name}" threw.`, err);
                return undefined;
            }
        }

        function getDocumentRef() {
            return (typeof document === "object" && document) ? document : null;
        }

        function getComputedStyleSafe(target) {
            if (typeof globalObj.getComputedStyle === "function") {
                return globalObj.getComputedStyle(target);
            }
            return {
                getPropertyValue() { return ""; },
                backgroundColor: ""
            };
        }

        function extractTableCellText(cell) {
            if (!cell) return "";
            const timeInput = cell.querySelector?.(".time-input");
            const exportTimeText = cell.querySelector?.(".export-time-text");
            if (timeInput) {
                const dnText = (cell.querySelector?.(".dn-icon")?.textContent || "").trim();
                const dayBadge = cell.querySelector?.(".day-badge");
                const timeText = (timeInput.value || "").trim();
                const dayText = (dayBadge?.textContent || "").trim();
                return [dnText, timeText, dayText].filter(Boolean).join(" ").trim();
            }
            if (exportTimeText) {
                const dnText = (cell.querySelector?.(".dn-icon")?.textContent || "").trim();
                const dayBadge = cell.querySelector?.(".day-badge");
                const timeText = (exportTimeText.textContent || "").trim();
                const dayText = (dayBadge?.textContent || "").trim();
                return [dnText, timeText, dayText].filter(Boolean).join(" ").trim();
            }

            const zoneCode = (cell.querySelector?.(".zone-code")?.textContent || "").trim();
            if (zoneCode) return zoneCode;
            const zoneName = (cell.querySelector?.(".zone-name")?.textContent || "").trim();
            if (zoneName) return zoneName;
            const offsetText = (cell.querySelector?.(".offset-text")?.textContent || "").trim();
            if (offsetText) return offsetText;
            const periodDays = (cell.querySelector?.(".period-days-text")?.textContent || "").trim();
            if (periodDays && periodDays !== "-") return periodDays;
            const periodTime = (cell.querySelector?.(".period-time-text")?.textContent || "").trim();
            if (periodTime && periodTime !== "-") return periodTime;
            const fixedTimeClock = (cell.querySelector?.(".fixed-time-clock")?.textContent || "").trim();
            if (fixedTimeClock) {
                const dnText = (cell.querySelector?.(".dn-icon")?.textContent || "").trim();
                const dayText = (cell.querySelector?.(".day-badge")?.textContent || "").trim();
                return [dnText, fixedTimeClock, dayText].filter(Boolean).join(" ").trim();
            }
            const buttonText = (cell.querySelector?.("button")?.textContent || "").trim();
            if (buttonText) return buttonText;
            return (cell.textContent || "").trim();
        }

        function extractTableHeaderText(cell) {
            if (!cell) return "";
            const fixedTitle = (cell.querySelector?.(".fixed-time-slot-title")?.textContent || "").trim();
            if (fixedTitle) return fixedTitle;
            return (cell.textContent || "").trim();
        }

        function getActiveTableExportContext() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function") {
                return {
                    table: null,
                    headerSelector: "#table-head th",
                    rowSelector: "#clocks-container tr.time-row"
                };
            }
            if (invokeDep("isFixedTimeTab")) {
                const section = doc.getElementById("fixed-time-section");
                const table = section ? section.querySelector?.(".data-table") : null;
                return {
                    table,
                    headerSelector: "#fixed-time-table-head th",
                    rowSelector: "#fixed-time-body tr.time-row"
                };
            }
            const section = doc.getElementById("timezone-section");
            const table = section ? section.querySelector?.(".data-table") : null;
            return {
                table,
                headerSelector: "#table-head th",
                rowSelector: "#clocks-container tr.time-row"
            };
        }

        async function renderTimezoneTableFallbackDataUrl() {
            await invokeDepAsync("waitForDocumentFontsReady");

            const doc = getDocumentRef();
            const context = getActiveTableExportContext();
            const table = context.table;
            if (!doc || !table || typeof table.querySelectorAll !== "function") {
                throw new Error("Table element not found");
            }

            const headerCells = Array.from(table.querySelectorAll(context.headerSelector) || [])
                .filter((th) => !th.classList?.contains("export-exclude") && !th.classList?.contains("move-col"));
            const bodyRows = Array.from(table.querySelectorAll(context.rowSelector) || []);
            if (!headerCells.length || !bodyRows.length) {
                throw new Error("No table data to render");
            }

            const colCount = headerCells.length;
            const measuredColWidths = headerCells.map((th) => {
                const w = Math.ceil(th.getBoundingClientRect?.().width || 0);
                return Math.max(w, 70);
            });
            const tableWidth = measuredColWidths.reduce((acc, w) => acc + w, 0);
            const headerHeight = Math.max(34, Math.ceil(headerCells[0].getBoundingClientRect?.().height || 0) || 40);
            const rowHeights = bodyRows.map((row) => Math.max(34, Math.ceil(row.getBoundingClientRect?.().height || 0) || 40));
            const tableHeight = headerHeight + rowHeights.reduce((acc, h) => acc + h, 0);
            const rootStyle = getComputedStyleSafe(doc.documentElement);
            const bodyStyle = getComputedStyleSafe(doc.body || doc.documentElement);
            const pageBg = bodyStyle.backgroundColor || "#0f172a";

            const renderTarget = invokeDep("prepareExportCanvas", tableWidth, tableHeight, pageBg);
            const canvas = renderTarget?.canvas;
            const ctx = renderTarget?.ctx;
            if (!canvas || !ctx) throw new Error("Canvas context unavailable");

            const headBg = (rootStyle.getPropertyValue?.("--table-head-bg") || "#1e293b").trim();
            const borderColor = (rootStyle.getPropertyValue?.("--border") || "rgba(148,163,184,0.25)").trim();
            const textColor = (rootStyle.getPropertyValue?.("--text") || "#f1f5f9").trim();
            const dimColor = (rootStyle.getPropertyValue?.("--text-dim") || "#94a3b8").trim();
            const rowBgA = "rgba(255,255,255,0.02)";
            const rowBgB = "rgba(255,255,255,0.04)";

            const monoFont = String(safeDeps.EXPORT_MONO_FONT_FAMILY || "monospace");
            const exportBodyFont = `13px ${monoFont} `;
            const exportHeaderFont = `600 13px ${monoFont} `;

            const drawCellText = (text, x, y, w, h, align = "left", color = textColor, font = exportBodyFont) => {
                invokeDep("drawExportCellText", ctx, text, x, y, w, h, { align, color, font });
            };

            const isCenterHeader = () => true;
            const isCenterBodyCell = (cell) => {
                if (!cell) return false;
                if (
                    cell.classList?.contains("move-cell") ||
                    cell.classList?.contains("timezone-cell") ||
                    cell.classList?.contains("fixed-time-time") ||
                    cell.classList?.contains("period-days-cell") ||
                    cell.classList?.contains("period-time-cell")
                ) {
                    return true;
                }
                return !!cell.querySelector?.(".offset-text");
            };

            let y = 0;
            ctx.fillStyle = headBg;
            ctx.fillRect(0, y, tableWidth, headerHeight);
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, y + headerHeight - 0.5);
            ctx.lineTo(tableWidth, y + headerHeight - 0.5);
            ctx.stroke();

            let x = 0;
            for (let c = 0; c < colCount; c++) {
                const w = measuredColWidths[c];
                const headText = extractTableHeaderText(headerCells[c]);
                drawCellText(headText, x, y, w, headerHeight, isCenterHeader(c) ? "center" : "left", dimColor, exportHeaderFont);
                if (c < colCount - 1) {
                    ctx.beginPath();
                    ctx.moveTo(x + w - 0.5, y);
                    ctx.lineTo(x + w - 0.5, tableHeight);
                    ctx.stroke();
                }
                x += w;
            }

            y += headerHeight;
            bodyRows.forEach((row, rowIdx) => {
                const h = rowHeights[rowIdx];
                ctx.fillStyle = rowIdx % 2 === 0 ? rowBgA : rowBgB;
                ctx.fillRect(0, y, tableWidth, h);
                ctx.beginPath();
                ctx.moveTo(0, y + h - 0.5);
                ctx.lineTo(tableWidth, y + h - 0.5);
                ctx.stroke();

                let rowX = 0;
                const cells = Array.from(row.children || [])
                    .filter((td) => !td.classList?.contains("export-exclude") && !td.classList?.contains("move-cell"));
                for (let c = 0; c < colCount; c++) {
                    const w = measuredColWidths[c];
                    const cell = cells[c];
                    const text = extractTableCellText(cell);
                    const center = isCenterBodyCell(cell);
                    drawCellText(text, rowX, y, w, h, center ? "center" : "left", textColor, exportBodyFont);
                    rowX += w;
                }
                y += h;
            });

            return canvas.toDataURL("image/png");
        }

        async function renderTimezoneTableToPngDataUrl() {
            const context = getActiveTableExportContext();
            const tableEl = context.table;
            if (!tableEl) throw new Error("Timezone table not found");

            const cloned = invokeDep("cloneTableForImageExport", tableEl);
            const renderer = safeDeps.renderElementWithForeignObjectToPngDataUrl;
            if (typeof renderer !== "function") {
                throw new Error("Primary renderer unavailable");
            }
            return renderer(cloned || tableEl);
        }

        return Object.freeze({
            extractTableCellText,
            extractTableHeaderText,
            getActiveTableExportContext,
            renderTimezoneTableFallbackDataUrl,
            renderTimezoneTableToPngDataUrl
        });
    }

    globalObj.GTVTableImageRender = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);


// --- File: js/modules/multi-range-image-render.js ---
(function initGtvMultiRangeImageRender(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (err) {
                console.warn(`[GTVMultiRangeImageRender] Dependency "${name}" threw.`, err);
                return undefined;
            }
        }

        async function invokeDepAsync(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return await safeDeps[name](...args);
            } catch (err) {
                console.warn(`[GTVMultiRangeImageRender] Dependency "${name}" threw.`, err);
                return undefined;
            }
        }

        function getDocumentRef() {
            return (typeof document === "object" && document) ? document : null;
        }

        function getComputedStyleSafe(target) {
            if (typeof globalObj.getComputedStyle === "function") {
                return globalObj.getComputedStyle(target);
            }
            return {
                getPropertyValue() { return ""; },
                backgroundColor: ""
            };
        }

        function asArray(value) {
            if (Array.isArray(value)) return value;
            if (value && typeof value[Symbol.iterator] === "function") {
                try {
                    return Array.from(value);
                } catch (_err) {
                    return [];
                }
            }
            return [];
        }

        function getMultiRangeTitles(baseRef) {
            const ranges = asArray(invokeDep("getMultiRanges"));
            return ranges.map((range, rangeIdx) =>
                invokeDep("getMultiRangeTitleText", rangeIdx, range, baseRef)
            );
        }

        async function renderMultiRangesFallbackDataUrl(targetRangeIdx = null) {
            await invokeDepAsync("waitForDocumentFontsReady");

            const doc = getDocumentRef();
            const containerEl = doc?.getElementById?.("multi-ranges-container");
            if (!containerEl) throw new Error("Multi-range container not found");

            const sourceBlocks = asArray(containerEl.querySelectorAll?.(".multi-range-block"));
            const selectedBlocks = Number.isInteger(targetRangeIdx)
                ? (sourceBlocks[targetRangeIdx] ? [sourceBlocks[targetRangeIdx]] : [])
                : sourceBlocks;
            if (!selectedBlocks.length) throw new Error("No multi-range table data to render");

            const clonedContainer = doc.createElement("div");
            clonedContainer.className = "multi-ranges-container";
            selectedBlocks.forEach((blockEl) => {
                const cloned = invokeDep("cloneMultiRangeBlockForImageExport", blockEl);
                if (cloned) clonedContainer.appendChild(cloned);
            });

            const measureHost = doc.createElement("div");
            measureHost.style.cssText = "position:fixed; left:-10000px; top:0; width:auto; min-width:800px; max-width:1400px; height:auto; opacity:0; pointer-events:none; display:block !important;";
            measureHost.appendChild(clonedContainer);
            doc.body?.appendChild?.(measureHost);

            const metrics = [];
            try {
                const blockEls = asArray(clonedContainer.querySelectorAll?.(".multi-range-block"));
                blockEls.forEach((block) => {
                    block.classList?.remove?.("collapsed");
                    const titleText = (block.querySelector?.(".multi-range-title")?.textContent || "").trim();
                    const tableEl = block.querySelector?.(".data-table");
                    if (!tableEl) return;

                    const headerCells = asArray(tableEl.querySelectorAll?.("thead th"))
                        .filter((th) => !th.classList?.contains("export-exclude") && !th.classList?.contains("move-col"));
                    const bodyRows = asArray(tableEl.querySelectorAll?.("tbody tr.time-row"));
                    if (!headerCells.length || !bodyRows.length) return;

                    const colWidths = headerCells.map((th) => Math.max(Math.ceil(th.getBoundingClientRect?.().width || 0), 70));
                    const tableWidth = colWidths.reduce((acc, w) => acc + w, 0);
                    const headerHeight = Math.max(34, Math.ceil(headerCells[0].getBoundingClientRect?.().height || 0) || 40);
                    const rowHeights = bodyRows.map((row) => Math.max(34, Math.ceil(row.getBoundingClientRect?.().height || 0) || 40));
                    const tableHeight = headerHeight + rowHeights.reduce((acc, h) => acc + h, 0);

                    metrics.push({
                        titleText,
                        headerCells,
                        bodyRows,
                        colWidths,
                        headerHeight,
                        rowHeights,
                        tableWidth,
                        tableHeight
                    });
                });
            } finally {
                measureHost.remove?.();
            }

            if (!metrics.length) throw new Error("No multi-range table data to render");

            const rootStyle = getComputedStyleSafe(doc.documentElement);
            const bodyStyle = getComputedStyleSafe(doc.body || doc.documentElement);
            const pageBg = bodyStyle.backgroundColor || "#0f172a";
            const blockGap = 14;
            const titleHeight = 38;

            const maxTableWidth = Math.max(...metrics.map((metric) => metric.tableWidth));
            const sourceWidth = Math.max(1, maxTableWidth);
            const sourceHeight = metrics.reduce((sum, metric, idx) => (
                sum + titleHeight + metric.tableHeight + (idx < metrics.length - 1 ? blockGap : 0)
            ), 0);

            const renderTarget = invokeDep("prepareExportCanvas", sourceWidth, sourceHeight, pageBg);
            const canvas = renderTarget?.canvas;
            const ctx = renderTarget?.ctx;
            if (!canvas || !ctx) throw new Error("Canvas context unavailable");

            const headBg = (rootStyle.getPropertyValue?.("--table-head-bg") || "#1e293b").trim();
            const borderColor = (rootStyle.getPropertyValue?.("--border") || "rgba(148,163,184,0.25)").trim();
            const textColor = (rootStyle.getPropertyValue?.("--text") || "#f1f5f9").trim();
            const dimColor = (rootStyle.getPropertyValue?.("--text-dim") || "#94a3b8").trim();
            const accentColor = (rootStyle.getPropertyValue?.("--accent") || "#38bdf8").trim();
            const rowBgA = "rgba(255,255,255,0.02)";
            const rowBgB = "rgba(255,255,255,0.04)";
            const titleBg = "rgba(56, 189, 248, 0.10)";

            const monoFont = String(safeDeps.EXPORT_MONO_FONT_FAMILY || "monospace");
            const exportBodyFont = `13px ${monoFont} `;
            const exportHeaderFont = `600 13px ${monoFont} `;
            const exportTitleFont = `700 16px ${monoFont} `;

            const drawCellText = (text, x, y, w, h, align = "left", color = textColor, font = exportBodyFont) => {
                invokeDep("drawExportCellText", ctx, text, x, y, w, h, { align, color, font, clip: true });
            };

            const isCenterBodyCell = (cell) => {
                if (!cell) return false;
                if (
                    cell.classList?.contains("timezone-cell") ||
                    cell.classList?.contains("period-days-cell") ||
                    cell.classList?.contains("period-time-cell")
                ) {
                    return true;
                }
                return !!cell.querySelector?.(".offset-text");
            };

            let y = 0;
            metrics.forEach((metric, metricIdx) => {
                const titleText = metric.titleText || `${invokeDep("t", "default_subgroup_name")} ${metricIdx + 1} `;
                ctx.fillStyle = titleBg;
                ctx.fillRect(0, y, sourceWidth, titleHeight);
                ctx.strokeStyle = borderColor;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, y + titleHeight - 0.5);
                ctx.lineTo(sourceWidth, y + titleHeight - 0.5);
                ctx.stroke();
                drawCellText(titleText, 0, y, sourceWidth, titleHeight, "left", accentColor, exportTitleFont);
                y += titleHeight;

                ctx.fillStyle = headBg;
                ctx.fillRect(0, y, metric.tableWidth, metric.headerHeight);
                ctx.beginPath();
                ctx.moveTo(0, y + metric.headerHeight - 0.5);
                ctx.lineTo(metric.tableWidth, y + metric.headerHeight - 0.5);
                ctx.stroke();

                let x = 0;
                for (let c = 0; c < metric.colWidths.length; c++) {
                    const w = metric.colWidths[c];
                    const headText = (metric.headerCells[c].textContent || "").trim();
                    drawCellText(headText, x, y, w, metric.headerHeight, "center", dimColor, exportHeaderFont);
                    if (c < metric.colWidths.length - 1) {
                        ctx.beginPath();
                        ctx.moveTo(x + w - 0.5, y);
                        ctx.lineTo(x + w - 0.5, y + metric.tableHeight);
                        ctx.stroke();
                    }
                    x += w;
                }

                let rowY = y + metric.headerHeight;
                metric.bodyRows.forEach((row, rowIdx) => {
                    const h = metric.rowHeights[rowIdx];
                    ctx.fillStyle = rowIdx % 2 === 0 ? rowBgA : rowBgB;
                    ctx.fillRect(0, rowY, metric.tableWidth, h);
                    ctx.beginPath();
                    ctx.moveTo(0, rowY + h - 0.5);
                    ctx.lineTo(metric.tableWidth, rowY + h - 0.5);
                    ctx.stroke();

                    let rowX = 0;
                    const cells = asArray(row.children)
                        .filter((td) => !td.classList?.contains("export-exclude") && !td.classList?.contains("move-cell"));
                    for (let c = 0; c < metric.colWidths.length; c++) {
                        const w = metric.colWidths[c];
                        const cell = cells[c];
                        const text = invokeDep("extractTableCellText", cell) || "";
                        const center = isCenterBodyCell(cell);
                        drawCellText(text, rowX, rowY, w, h, center ? "center" : "left", textColor, exportBodyFont);
                        rowX += w;
                    }
                    rowY += h;
                });

                y += metric.tableHeight;
                if (metricIdx < metrics.length - 1) y += blockGap;
            });

            return canvas.toDataURL("image/png");
        }

        async function renderMultiRangesToPngDataUrl(targetRangeIdx = null) {
            return renderMultiRangesFallbackDataUrl(targetRangeIdx);
        }

        async function renderMultiRangeSingleToPngDataUrl(rangeIdx) {
            return renderMultiRangesToPngDataUrl(rangeIdx);
        }

        async function renderMultiRangeTitlesToPngDataUrl() {
            await invokeDepAsync("waitForDocumentFontsReady");

            invokeDep("ensureMultiRangeState");
            const baseRef = invokeDep("getBaseTimezoneRef");
            const titles = getMultiRangeTitles(baseRef);
            if (!titles.length) throw new Error("No multi-range title data to render");

            const doc = getDocumentRef();
            const rootStyle = getComputedStyleSafe(doc?.documentElement || null);
            const bodyStyle = getComputedStyleSafe(doc?.body || doc?.documentElement || null);
            const pageBg = bodyStyle.backgroundColor || "#0f172a";
            const borderColor = (rootStyle.getPropertyValue?.("--border") || "rgba(148,163,184,0.25)").trim();
            const accentColor = (rootStyle.getPropertyValue?.("--accent") || "#38bdf8").trim();
            const monoFont = String(safeDeps.EXPORT_MONO_FONT_FAMILY || "monospace");
            const titleFont = `700 16px ${monoFont} `;
            const sidePadding = 16;
            const topBottomPadding = 12;
            const rowHeight = 40;
            const rowGap = 8;

            const measureCanvas = doc?.createElement?.("canvas");
            const measureCtx = measureCanvas?.getContext?.("2d");
            let maxTextWidth = 0;
            if (measureCtx) {
                measureCtx.font = titleFont;
                titles.forEach((titleText) => {
                    maxTextWidth = Math.max(maxTextWidth, Math.ceil(measureCtx.measureText(String(titleText || "")).width));
                });
            }

            const sourceWidth = Math.max(640, maxTextWidth + (sidePadding * 2));
            const contentHeight = (titles.length * rowHeight) + (Math.max(0, titles.length - 1) * rowGap);
            const sourceHeight = contentHeight + (topBottomPadding * 2);

            const renderTarget = invokeDep("prepareExportCanvas", sourceWidth, sourceHeight, pageBg);
            const canvas = renderTarget?.canvas;
            const ctx = renderTarget?.ctx;
            if (!canvas || !ctx) throw new Error("Canvas context unavailable");

            let y = topBottomPadding;
            titles.forEach((titleText, idx) => {
                const rowBg = idx % 2 === 0 ? "rgba(56, 189, 248, 0.12)" : "rgba(56, 189, 248, 0.08)";
                const resolvedTitle = (String(titleText || "").trim()) || `${invokeDep("t", "default_subgroup_name")} ${idx + 1} `;

                ctx.fillStyle = rowBg;
                ctx.fillRect(0, y, sourceWidth, rowHeight);

                ctx.strokeStyle = borderColor;
                ctx.lineWidth = 1;
                ctx.strokeRect(0.5, y + 0.5, Math.max(1, sourceWidth - 1), Math.max(1, rowHeight - 1));

                invokeDep("drawExportCellText", ctx, resolvedTitle, 0, y, sourceWidth, rowHeight, {
                    align: "left",
                    color: accentColor,
                    font: titleFont,
                    padX: sidePadding
                });

                y += rowHeight + rowGap;
            });

            return canvas.toDataURL("image/png");
        }

        return Object.freeze({
            renderMultiRangesFallbackDataUrl,
            renderMultiRangesToPngDataUrl,
            renderMultiRangeSingleToPngDataUrl,
            renderMultiRangeTitlesToPngDataUrl
        });
    }

    globalObj.GTVMultiRangeImageRender = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);


// --- File: js/modules/multi-range-state.js ---
(function initGtvMultiRangeState(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (_err) {
                return undefined;
            }
        }

        function readState() {
            const state = invokeDep("getState");
            if (!state || typeof state !== "object") {
                return {
                    multiRangeCount: 1,
                    multiRangeTitle: "",
                    multiRanges: [],
                    multiRangeCollapsed: [],
                    multiRangeStartEditEnabled: [],
                    multiRangeEndEditEnabled: []
                };
            }
            return state;
        }

        function patchState(next = {}) {
            if (!next || typeof next !== "object") return;
            invokeDep("setState", next);
        }

        function translate(key) {
            const text = invokeDep("t", key);
            return (typeof text === "string" && text) ? text : String(key || "");
        }

        function sanitizeUtcMs(value, fallbackMs) {
            const viaDep = invokeDep("sanitizeUtcMs", value, fallbackMs);
            if (Number.isFinite(viaDep)) return viaDep;
            const parsed = Number(value);
            if (Number.isFinite(parsed)) return parsed;
            const fallback = Number(fallbackMs);
            return Number.isFinite(fallback) ? fallback : Date.now();
        }

        function getMinCount() {
            const parsed = Number(safeDeps.MIN_MULTI_RANGE_COUNT);
            return Number.isFinite(parsed) ? Math.max(1, Math.trunc(parsed)) : 1;
        }

        function getMaxCount() {
            const parsed = Number(safeDeps.MAX_MULTI_RANGE_COUNT);
            return Number.isFinite(parsed) ? Math.max(getMinCount(), Math.trunc(parsed)) : 12;
        }

        function sanitizeMultiRangeCount(value) {
            const parsed = parseInt(value, 10);
            if (!Number.isFinite(parsed)) return getMinCount();
            return Math.min(getMaxCount(), Math.max(getMinCount(), parsed));
        }

        function sanitizeMultiRangeTitle(value) {
            const text = (typeof value === "string") ? value.trim() : "";
            if (!text) return translate("placeholder_range_title");
            return text.slice(0, 40);
        }

        function getDefaultMultiRangeBounds() {
            const globalTimes = invokeDep("getGlobalTimes");
            const safeTimes = Array.isArray(globalTimes) ? globalTimes : [];
            const nowMs = Date.now();
            const startMs = sanitizeUtcMs(safeTimes[0]?.getTime?.(), nowMs);
            const endMs = sanitizeUtcMs(safeTimes[1]?.getTime?.(), startMs);
            return { startMs, endMs };
        }

        function sanitizeMultiRangeItem(rawRange, fallbackStartMs, fallbackEndMs) {
            if (!rawRange || typeof rawRange !== "object") {
                return { startUtcMs: fallbackStartMs, endUtcMs: fallbackEndMs };
            }
            const startUtcMs = sanitizeUtcMs(rawRange.startUtcMs, fallbackStartMs);
            const endUtcMs = sanitizeUtcMs(rawRange.endUtcMs, fallbackEndMs);
            return { startUtcMs, endUtcMs };
        }

        function isMultiRangeStartEditEnabled(rangeIdx) {
            const state = readState();
            if (!Number.isInteger(rangeIdx) || rangeIdx <= 0) return false;
            return !!state.multiRangeStartEditEnabled?.[rangeIdx];
        }

        function isMultiRangeEndEditEnabled(rangeIdx) {
            const state = readState();
            if (!Number.isInteger(rangeIdx) || rangeIdx < 0) return false;
            return !!state.multiRangeEndEditEnabled?.[rangeIdx];
        }

        function isMultiRangeStartLinked(rangeIdx) {
            return rangeIdx > 0 && !isMultiRangeStartEditEnabled(rangeIdx);
        }

        function ensureMultiRangeState() {
            const state = readState();
            const nextCount = sanitizeMultiRangeCount(state.multiRangeCount);
            const nextTitle = sanitizeMultiRangeTitle(state.multiRangeTitle);
            const defaults = getDefaultMultiRangeBounds();

            const normalized = Array.isArray(state.multiRanges)
                ? state.multiRanges.map((item) => sanitizeMultiRangeItem(item, defaults.startMs, defaults.endMs))
                : [];
            const normalizedCollapsed = Array.isArray(state.multiRangeCollapsed)
                ? state.multiRangeCollapsed.map((flag) => !!flag)
                : [];
            const normalizedStartEdit = Array.isArray(state.multiRangeStartEditEnabled)
                ? state.multiRangeStartEditEnabled.map((flag) => !!flag)
                : [];
            const normalizedEndEdit = Array.isArray(state.multiRangeEndEditEnabled)
                ? state.multiRangeEndEditEnabled.map((flag) => !!flag)
                : [];

            let nextRanges = normalized.slice(0, nextCount);
            if (!nextRanges.length) {
                nextRanges = [{
                    startUtcMs: defaults.startMs,
                    endUtcMs: defaults.endMs
                }];
            }

            const firstDuration = nextRanges[0].endUtcMs - nextRanges[0].startUtcMs;
            while (nextRanges.length < nextCount) {
                const prev = nextRanges[nextRanges.length - 1];
                const startUtcMs = prev.endUtcMs;
                nextRanges.push({
                    startUtcMs,
                    endUtcMs: startUtcMs + firstDuration
                });
            }

            const nextStartEditEnabled = Array.from({ length: nextCount }, (_, idx) => (idx === 0 ? false : !!normalizedStartEdit[idx]));
            const nextEndEditEnabled = Array.from({ length: nextCount }, (_, idx) =>
                (normalizedEndEdit[idx] === undefined ? true : !!normalizedEndEdit[idx])
            );

            nextRanges[0].startUtcMs = sanitizeUtcMs(nextRanges[0].startUtcMs, defaults.startMs);
            nextRanges[0].endUtcMs = sanitizeUtcMs(nextRanges[0].endUtcMs, defaults.endMs);
            for (let i = 1; i < nextRanges.length; i++) {
                nextRanges[i].startUtcMs = sanitizeUtcMs(nextRanges[i].startUtcMs, nextRanges[i - 1].endUtcMs);
                if (!nextStartEditEnabled[i]) {
                    nextRanges[i].startUtcMs = nextRanges[i - 1].endUtcMs;
                }
                nextRanges[i].endUtcMs = sanitizeUtcMs(nextRanges[i].endUtcMs, nextRanges[i].startUtcMs);
            }

            patchState({
                multiRangeCount: nextCount,
                multiRangeTitle: nextTitle,
                multiRanges: nextRanges,
                multiRangeCollapsed: Array.from({ length: nextCount }, (_, idx) => !!normalizedCollapsed[idx]),
                multiRangeStartEditEnabled: nextStartEditEnabled,
                multiRangeEndEditEnabled: nextEndEditEnabled
            });
        }

        function renderIfMultiTab() {
            if (!invokeDep("isMultiTab")) return;
            invokeDep("renderMultiRanges");
        }

        function persistIfNeeded(persist) {
            if (!persist) return;
            invokeDep("savePersistence");
        }

        function setMultiRangeStartEditEnabled(rangeIdx, enabled, options = {}) {
            const { persist = true, rerender = true } = options;
            ensureMultiRangeState();
            const state = readState();
            const count = sanitizeMultiRangeCount(state.multiRangeCount);
            if (!Number.isInteger(rangeIdx) || rangeIdx <= 0 || rangeIdx >= count) return false;

            const nextEnabled = !!enabled;
            const nextStartEdit = Array.isArray(state.multiRangeStartEditEnabled) ? [...state.multiRangeStartEditEnabled] : [];
            const nextRanges = Array.isArray(state.multiRanges) ? state.multiRanges.map((item) => ({ ...item })) : [];

            nextStartEdit[rangeIdx] = nextEnabled;
            if (!nextEnabled && nextRanges[rangeIdx] && nextRanges[rangeIdx - 1]) {
                nextRanges[rangeIdx].startUtcMs = nextRanges[rangeIdx - 1].endUtcMs;
            }

            patchState({
                multiRangeStartEditEnabled: nextStartEdit,
                multiRanges: nextRanges
            });

            if (rerender) renderIfMultiTab();
            persistIfNeeded(persist);
            return true;
        }

        function setMultiRangeEndEditEnabled(rangeIdx, enabled, options = {}) {
            const { persist = true, rerender = true } = options;
            ensureMultiRangeState();
            const state = readState();
            const count = sanitizeMultiRangeCount(state.multiRangeCount);
            if (!Number.isInteger(rangeIdx) || rangeIdx < 0 || rangeIdx >= count) return false;

            const nextEndEdit = Array.isArray(state.multiRangeEndEditEnabled) ? [...state.multiRangeEndEditEnabled] : [];
            nextEndEdit[rangeIdx] = !!enabled;
            patchState({ multiRangeEndEditEnabled: nextEndEdit });

            if (rerender) renderIfMultiTab();
            persistIfNeeded(persist);
            return true;
        }

        function setAllMultiRangeStartEditEnabled(enabled, options = {}) {
            const { persist = true, rerender = true } = options;
            ensureMultiRangeState();
            const state = readState();
            const count = sanitizeMultiRangeCount(state.multiRangeCount);
            const next = !!enabled;
            const nextStartEdit = Array.isArray(state.multiRangeStartEditEnabled) ? [...state.multiRangeStartEditEnabled] : [];
            const nextRanges = Array.isArray(state.multiRanges) ? state.multiRanges.map((item) => ({ ...item })) : [];

            for (let idx = 1; idx < count; idx++) {
                nextStartEdit[idx] = next;
                if (!next && nextRanges[idx] && nextRanges[idx - 1]) {
                    nextRanges[idx].startUtcMs = nextRanges[idx - 1].endUtcMs;
                }
            }

            patchState({
                multiRangeStartEditEnabled: nextStartEdit,
                multiRanges: nextRanges
            });

            if (rerender) renderIfMultiTab();
            persistIfNeeded(persist);
            return true;
        }

        function setAllMultiRangeEndEditEnabled(enabled, options = {}) {
            const { persist = true, rerender = true } = options;
            ensureMultiRangeState();
            const state = readState();
            const count = sanitizeMultiRangeCount(state.multiRangeCount);
            const next = !!enabled;
            const nextEndEdit = Array.isArray(state.multiRangeEndEditEnabled) ? [...state.multiRangeEndEditEnabled] : [];

            for (let idx = 0; idx < count; idx++) {
                nextEndEdit[idx] = next;
            }

            patchState({ multiRangeEndEditEnabled: nextEndEdit });

            if (rerender) renderIfMultiTab();
            persistIfNeeded(persist);
            return true;
        }

        function refreshMultiRangeControls() {
            const state = readState();
            const count = sanitizeMultiRangeCount(state.multiRangeCount);
            const countInput = document.getElementById("multi-range-count-input");
            if (countInput) countInput.value = String(count);

            const decreaseBtn = document.getElementById("multi-range-count-decrease");
            const increaseBtn = document.getElementById("multi-range-count-increase");
            if (decreaseBtn) decreaseBtn.disabled = count <= getMinCount();
            if (increaseBtn) increaseBtn.disabled = count >= getMaxCount();
        }

        function syncMultiRangeStartLinks(startIdx = 1) {
            ensureMultiRangeState();
            const state = readState();
            const nextRanges = Array.isArray(state.multiRanges) ? state.multiRanges.map((item) => ({ ...item })) : [];
            for (let idx = Math.max(1, startIdx); idx < nextRanges.length; idx++) {
                if (!isMultiRangeStartLinked(idx)) continue;
                nextRanges[idx].startUtcMs = nextRanges[idx - 1].endUtcMs;
            }
            patchState({ multiRanges: nextRanges });
        }

        function syncFollowingRangesByDuration(changedRangeIdx) {
            const state = readState();
            const ranges = Array.isArray(state.multiRanges) ? state.multiRanges : [];
            if (!Number.isInteger(changedRangeIdx) || changedRangeIdx < 0 || changedRangeIdx >= ranges.length) return;
            if (changedRangeIdx >= ranges.length - 1) return;

            const fallbackNow = Date.now();
            const nextRanges = ranges.map((item) => ({ ...item }));
            const durations = nextRanges.map((range) => {
                const startUtcMs = sanitizeUtcMs(range?.startUtcMs, fallbackNow);
                const endUtcMs = sanitizeUtcMs(range?.endUtcMs, startUtcMs);
                return endUtcMs - startUtcMs;
            });

            let cursor = sanitizeUtcMs(nextRanges[changedRangeIdx]?.endUtcMs, fallbackNow);
            for (let idx = changedRangeIdx + 1; idx < nextRanges.length; idx++) {
                const duration = durations[idx] ?? 0;
                if (isMultiRangeStartLinked(idx)) {
                    nextRanges[idx].startUtcMs = cursor;
                    nextRanges[idx].endUtcMs = cursor + duration;
                } else {
                    nextRanges[idx].startUtcMs = sanitizeUtcMs(nextRanges[idx].startUtcMs, cursor);
                    nextRanges[idx].endUtcMs = sanitizeUtcMs(nextRanges[idx].endUtcMs, nextRanges[idx].startUtcMs);
                }
                cursor = sanitizeUtcMs(nextRanges[idx].endUtcMs, cursor);
            }

            patchState({ multiRanges: nextRanges });
        }

        function syncLinkedRangesFrom(rangeIdx, options = {}) {
            const { includeCurrent = true, stopAtFirstUnlocked = true, baseDurations = null } = options;
            ensureMultiRangeState();
            const state = readState();
            const ranges = Array.isArray(state.multiRanges) ? state.multiRanges : [];
            if (!Number.isInteger(rangeIdx) || rangeIdx < 0 || rangeIdx >= ranges.length) return;

            const fallbackNow = Date.now();
            const nextRanges = ranges.map((item) => ({ ...item }));
            const durations = Array.isArray(baseDurations) && baseDurations.length
                ? baseDurations
                : nextRanges.map((range) => {
                    const startUtcMs = sanitizeUtcMs(range?.startUtcMs, fallbackNow);
                    const endUtcMs = sanitizeUtcMs(range?.endUtcMs, startUtcMs);
                    return endUtcMs - startUtcMs;
                });

            let anchorIdx = rangeIdx;
            if (includeCurrent) {
                const startUtcMs = sanitizeUtcMs(nextRanges[anchorIdx]?.startUtcMs, fallbackNow);
                nextRanges[anchorIdx].startUtcMs = startUtcMs;
                nextRanges[anchorIdx].endUtcMs = startUtcMs + (durations[anchorIdx] ?? 0);
            }

            let cursor = sanitizeUtcMs(nextRanges[anchorIdx]?.endUtcMs, fallbackNow);
            for (let idx = anchorIdx + 1; idx < nextRanges.length; idx++) {
                if (!isMultiRangeStartLinked(idx)) {
                    if (stopAtFirstUnlocked) break;
                    cursor = sanitizeUtcMs(nextRanges[idx]?.endUtcMs, cursor);
                    continue;
                }
                nextRanges[idx].startUtcMs = cursor;
                nextRanges[idx].endUtcMs = cursor + (durations[idx] ?? 0);
                cursor = sanitizeUtcMs(nextRanges[idx].endUtcMs, cursor);
            }

            patchState({ multiRanges: nextRanges });
        }

        function setMultiRangeCount(value, options = {}) {
            const { persist = true, rerender = true, showBoundaryToast = false } = options;
            const parsed = parseInt(value, 10);
            const nextCount = sanitizeMultiRangeCount(value);

            if (showBoundaryToast && Number.isFinite(parsed)) {
                if (parsed >= getMaxCount()) {
                    invokeDep("showToast", translate("toast_range_count_max"));
                } else if (parsed <= getMinCount()) {
                    invokeDep("showToast", translate("toast_range_count_min"));
                }
            }

            patchState({ multiRangeCount: nextCount });
            ensureMultiRangeState();
            refreshMultiRangeControls();

            if (rerender) renderIfMultiTab();
            persistIfNeeded(persist);
        }

        function toggleMultiRangeCollapsed(rangeIdx) {
            ensureMultiRangeState();
            const state = readState();
            const nextCollapsed = Array.isArray(state.multiRangeCollapsed) ? [...state.multiRangeCollapsed] : [];
            if (!Number.isInteger(rangeIdx) || rangeIdx < 0 || rangeIdx >= nextCollapsed.length) return;
            nextCollapsed[rangeIdx] = !nextCollapsed[rangeIdx];
            patchState({ multiRangeCollapsed: nextCollapsed });
            renderIfMultiTab();
            invokeDep("savePersistence");
        }

        function setMultiRangesCollapsedBelow(rangeIdx, collapsed) {
            ensureMultiRangeState();
            const state = readState();
            const count = sanitizeMultiRangeCount(state.multiRangeCount);
            if (!Number.isInteger(rangeIdx) || rangeIdx < 0 || rangeIdx >= count) return;

            const nextCollapsed = Array.isArray(state.multiRangeCollapsed) ? [...state.multiRangeCollapsed] : [];
            const next = !!collapsed;
            for (let idx = rangeIdx; idx < count; idx++) {
                nextCollapsed[idx] = next;
            }
            patchState({ multiRangeCollapsed: nextCollapsed });
            renderIfMultiTab();
            invokeDep("savePersistence");
        }

        function getMultiRangeSlotDate(rangeIdx, slotIdx) {
            ensureMultiRangeState();
            const state = readState();
            const range = state.multiRanges?.[rangeIdx];
            if (!range) return new Date();
            const utcMs = slotIdx === 0 ? range.startUtcMs : range.endUtcMs;
            return new Date(utcMs);
        }

        function setMultiRangeSlotDate(rangeIdx, slotIdx, nextDate) {
            ensureMultiRangeState();
            const state = readState();
            const nextRanges = Array.isArray(state.multiRanges) ? state.multiRanges.map((item) => ({ ...item })) : [];
            const range = nextRanges[rangeIdx];
            if (!range || !(nextDate instanceof Date) || !Number.isFinite(nextDate.getTime())) return false;
            const nextMs = nextDate.getTime();
            if (slotIdx === 0) range.startUtcMs = nextMs;
            else range.endUtcMs = nextMs;
            patchState({ multiRanges: nextRanges });
            return true;
        }

        return Object.freeze({
            sanitizeMultiRangeCount,
            sanitizeMultiRangeTitle,
            getDefaultMultiRangeBounds,
            sanitizeMultiRangeItem,
            isMultiRangeStartEditEnabled,
            isMultiRangeEndEditEnabled,
            isMultiRangeStartLinked,
            ensureMultiRangeState,
            setMultiRangeStartEditEnabled,
            setMultiRangeEndEditEnabled,
            setAllMultiRangeStartEditEnabled,
            setAllMultiRangeEndEditEnabled,
            refreshMultiRangeControls,
            syncMultiRangeStartLinks,
            syncFollowingRangesByDuration,
            syncLinkedRangesFrom,
            setMultiRangeCount,
            toggleMultiRangeCollapsed,
            setMultiRangesCollapsedBelow,
            getMultiRangeSlotDate,
            setMultiRangeSlotDate
        });
    }

    globalObj.GTVMultiRangeState = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/multi-range-render.js ---
(function initGtvMultiRangeRender(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function getDocumentRef() {
            return (typeof document === "object" && document) ? document : null;
        }

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (err) {
                console.warn(`[GTVMultiRangeRender] Dependency "${name}" threw.`, err);
                return undefined;
            }
        }

        function translate(key) {
            const value = invokeDep("t", key);
            if (typeof value === "string" && value) return value;
            return String(key || "");
        }

        function asArray(value) {
            if (Array.isArray(value)) return value;
            if (value && typeof value[Symbol.iterator] === "function") {
                try {
                    return Array.from(value);
                } catch (_err) {
                    return [];
                }
            }
            return [];
        }

        function getCurrentLang() {
            return invokeDep("getCurrentLang") === "ko" ? "ko" : "en";
        }

        function getDayNightGlyph(marker) {
            if (marker === "DAY") return "\u2600\uFE0F";
            if (marker === "NIGHT") return "\uD83C\uDF19";
            return marker;
        }

        function getTimezoneDisplayPointAtDate(date, tz, fixedDisplayOffsetMinutes = null) {
            const snapshot = invokeDep(
                "buildTimezoneComputedSnapshotForDates",
                tz,
                [date],
                { fixedDisplayOffsetMinutes }
            ) || {};
            const timeStr = snapshot.times?.[0] || "";
            const dateStr = snapshot.dates?.[0] || "";
            const clockStr = snapshot.clocks?.[0] || "";
            const dayIndex = Number.isFinite(snapshot.dayIndexes?.[0]) ? snapshot.dayIndexes[0] : 0;
            const hour = Number.parseInt(clockStr.slice(0, 2), 10) || 0;
            return {
                timeStr,
                dateStr,
                clockStr,
                dayIndex,
                hour,
                dayName: snapshot.dayNames?.[0] || "",
                dayNightIcon: snapshot.dayNightIcons?.[0] || (hour >= 6 && hour <= 18 ? "DAY" : "NIGHT")
            };
        }

        function buildTimezoneComputedSnapshotForRange(tz, startDate, endDate) {
            if (!tz) return null;
            const fixedDisplayOffsetMinutes = invokeDep("getFixedOffsetForDisplayAtDate", tz, startDate);
            return invokeDep(
                "buildTimezoneComputedSnapshotForDates",
                tz,
                [startDate, endDate],
                { fixedDisplayOffsetMinutes }
            ) || null;
        }

        function applySnapshotToRow(row, snapshot) {
            if (!row || !snapshot || typeof row.querySelector !== "function") return;
            const doc = getDocumentRef();

            const zoneCodeEl = row.querySelector(".zone-code");
            if (zoneCodeEl) zoneCodeEl.textContent = snapshot.timezone || "";

            const zoneNameEl = row.querySelector(".zone-name");
            if (zoneNameEl && !zoneNameEl.textContent) zoneNameEl.textContent = snapshot.region || "";

            const offsetTextEl = row.querySelector(".offset-text");
            if (offsetTextEl) offsetTextEl.textContent = snapshot.offset || "";

            for (let slotIdx = 0; slotIdx < 2; slotIdx++) {
                const timeStr = snapshot.times?.[slotIdx] || "";
                const dateStr = snapshot.dates?.[slotIdx] || "";
                const clockStr = snapshot.clocks?.[slotIdx] || "";
                const dayName = snapshot.dayNames?.[slotIdx] || "";
                const dayIndex = snapshot.dayIndexes?.[slotIdx] ?? 0;
                const dnMarker = String(snapshot.dayNightIcons?.[slotIdx] || "").trim().toUpperCase();
                const dnGlyph = getDayNightGlyph(dnMarker);

                const inputs = asArray(row.querySelectorAll?.(`.time-input[data-slot="${slotIdx}"]`));
                inputs.forEach((input) => {
                    const inputMode = input.dataset?.inputMode || "datetime";
                    let nextValue = timeStr;
                    if (inputMode === "date") nextValue = dateStr;
                    else if (inputMode === "time") nextValue = clockStr;
                    else if (inputMode === "none") nextValue = "";
                    if (!doc || doc.activeElement !== input) input.value = nextValue;
                });

                const badges = asArray(row.querySelectorAll?.(`.day-slot-${slotIdx}`));
                badges.forEach((badge) => {
                    badge.textContent = dayName;
                    badge.className = `day-badge day-slot-${slotIdx}`;
                    if (dayIndex === 0) badge.classList?.add?.("day-sun");
                    else if (dayIndex === 6) badge.classList?.add?.("day-sat");
                });

                const dnElements = asArray(row.querySelectorAll?.(`.dn-slot-${slotIdx}`));
                dnElements.forEach((dnEl) => {
                    dnEl.textContent = dnGlyph;
                    if (dnMarker === "DAY") dnEl.title = translate("dn_day");
                    else if (dnMarker === "NIGHT") dnEl.title = translate("dn_night");
                    else dnEl.title = "";
                });
            }

            const periodEl = row.querySelector(".period-days-text");
            if (periodEl) periodEl.textContent = (snapshot.periodDays || "").trim() || "-";

            const periodTimeEl = row.querySelector(".period-time-text");
            if (periodTimeEl) periodTimeEl.textContent = (snapshot.periodTime || "").trim() || "-";
        }

        function formatRangeDurationText(startUtcMs, endUtcMs) {
            const safeStart = Number(startUtcMs);
            const safeEnd = Number(endUtcMs);
            const diffMs = (Number.isFinite(safeEnd) ? safeEnd : 0) - (Number.isFinite(safeStart) ? safeStart : 0);
            const sign = diffMs < 0 ? "-" : "";
            const totalMinutes = Math.floor(Math.abs(diffMs) / 60000);
            const day = Math.floor(totalMinutes / 1440);
            const hour = Math.floor((totalMinutes % 1440) / 60);
            const minute = totalMinutes % 60;
            if (getCurrentLang() === "ko") return `${sign}${day}\uC77C ${hour}\uC2DC\uAC04 ${minute}\uBD84`;
            return `${sign}${day}d ${hour}h ${minute}m`;
        }

        function getMultiRangeTitleText(rangeIdx, range, baseRef) {
            const safeRange = (range && typeof range === "object") ? range : { startUtcMs: 0, endUtcMs: 0 };
            const safeTitle = invokeDep(
                "sanitizeMultiSubgroupName",
                invokeDep("getCurrentMultiSubgroupName"),
                invokeDep("sanitizeMultiRangeTitle", invokeDep("getMultiRangeTitle"))
            ) || "";
            const durationText = formatRangeDurationText(safeRange.startUtcMs, safeRange.endUtcMs);
            const baseSnapshot = buildTimezoneComputedSnapshotForRange(
                baseRef,
                new Date(safeRange.startUtcMs),
                new Date(safeRange.endUtcMs)
            );
            const startText = baseSnapshot?.times?.[0] || "-";
            const endText = baseSnapshot?.times?.[1] || "-";
            return `${safeTitle} #${rangeIdx + 1} - ${startText} ~ ${endText} [${durationText}]`;
        }

        function createMultiRangeTableRow(tz, options = {}) {
            const doc = getDocumentRef();
            if (!doc || typeof doc.createElement !== "function") return null;

            const safeTz = (tz && typeof tz === "object") ? tz : {};
            const safeOptions = (options && typeof options === "object") ? options : {};
            const rangeIdx = Number(safeOptions.rangeIdx) || 0;
            const range = (safeOptions.range && typeof safeOptions.range === "object")
                ? safeOptions.range
                : { startUtcMs: 0, endUtcMs: 0 };
            const displayColumns = asArray(safeOptions.displayColumns);
            const isBase = !!safeOptions.isBase;
            const safeRowId = String(safeOptions.rowId || safeTz.id || "utc");
            const baseNameHtml = String(safeOptions.baseNameHtml || "");

            const tr = doc.createElement("tr");
            tr.className = isBase ? "time-row static base-row" : "time-row";
            tr.id = `multi-r${rangeIdx}-tz-row-${safeRowId}`;

            let inner = "";
            displayColumns.forEach((colKey) => {
                if (isBase) {
                    inner += String(invokeDep("buildStaticRowCell", colKey, 2, baseNameHtml) || "");
                } else {
                    inner += String(invokeDep("buildDynamicRowCell", colKey, 2) || "");
                }
            });
            inner += `<td class="export-exclude copy-cell"><div class="btn-group"><button class="sm-btn copy-row-btn" title="${translate("tooltip_copy")}">&#128203;</button></div></td>`;
            tr.insertAdjacentHTML("beforeend", inner);

            if (!isBase) {
                const zoneNameEl = tr.querySelector(".zone-name");
                if (zoneNameEl) zoneNameEl.textContent = invokeDep("getZoneDisplayName", safeTz) || "";
            }

            const copyBtn = tr.querySelector(".copy-row-btn");
            if (copyBtn) {
                copyBtn.addEventListener("click", () => invokeDep("copyMultiRangeRow", rangeIdx, safeRowId));
            }

            const inputs = asArray(tr.querySelectorAll(".time-input"));
            inputs.forEach((input) => {
                const slotIdx = parseInt(input.dataset?.slot, 10);
                const inputMode = input.dataset?.inputMode || "datetime";
                const timezoneId = safeRowId === "utc" ? null : safeTz.id;
                const lockedByChain = slotIdx === 0 && rangeIdx > 0 && !invokeDep("isMultiRangeStartEditEnabled", rangeIdx);
                const lockedByEndToggle = slotIdx === 1 && !invokeDep("isMultiRangeEndEditEnabled", rangeIdx);
                const lockedByToggle = lockedByChain || lockedByEndToggle;

                const triggerBtn = input.parentElement?.querySelector?.(`.trigger-slot-${slotIdx}`);
                if (lockedByToggle) {
                    input.readOnly = true;
                    if (triggerBtn?.style) triggerBtn.style.display = "none";
                }

                const CustomDatePickerCtor = globalObj.CustomDatePicker;
                if (!lockedByToggle && CustomDatePickerCtor && !input.classList.contains("time-input-hidden") && inputMode !== "none") {
                    if (input._cdp && typeof input._cdp.destroy === "function") {
                        input._cdp.destroy();
                    }
                    input._cdp = new CustomDatePickerCtor(input, {
                        type: inputMode === "date" ? "date" : "datetime",
                        lang: doc.documentElement?.lang || "en",
                        theme: doc.documentElement?.getAttribute?.("data-theme") || "dark",
                        triggerElement: triggerBtn || null
                    });
                }

                input.onchange = (e) => {
                    if (lockedByToggle) return;
                    invokeDep("handleMultiRangeTimeChange", rangeIdx, e.target.value, safeTz.zone || "CUSTOM", slotIdx, timezoneId, inputMode);
                };
                input.onkeydown = (e) => {
                    if (e.key !== "Enter") return;
                    if (!lockedByToggle) {
                        invokeDep("handleMultiRangeTimeChange", rangeIdx, input.value, safeTz.zone || "CUSTOM", slotIdx, timezoneId, inputMode);
                    }
                    input.blur();
                };
            });

            const snapshot = buildTimezoneComputedSnapshotForRange(
                safeTz,
                new Date(range.startUtcMs),
                new Date(range.endUtcMs)
            );
            applySnapshotToRow(tr, snapshot);
            return tr;
        }

        function renderMultiRanges() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function" || typeof doc.createElement !== "function") return;

            invokeDep("hideFloatingTooltip");
            const container = doc.getElementById("multi-ranges-container");
            if (!container) return;

            invokeDep("ensureMultiRangeState");
            invokeDep("refreshMultiRangeControls");
            invokeDep("renderMultiBulkToolSets");

            const baseRef = invokeDep("getBaseTimezoneRef");
            if (!baseRef) {
                container.innerHTML = "";
                return;
            }
            const baseZoneName = invokeDep("getZoneDisplayName", baseRef) || "";
            const escapedBaseZoneName = invokeDep("escapeHtml", baseZoneName);
            const baseRefName = (typeof escapedBaseZoneName === "string") ? escapedBaseZoneName : String(baseZoneName);
            const displayColumns = asArray(invokeDep("getDisplayColumns", 2));
            const rowsToRender = asArray(invokeDep("getRenderableTimezoneRows", baseRef));
            const multiRanges = asArray(invokeDep("getMultiRanges"));
            const multiRangeCollapsed = asArray(invokeDep("getMultiRangeCollapsed"));
            const multiRangeCountRaw = Number(invokeDep("getMultiRangeCount"));
            const multiRangeCount = Number.isFinite(multiRangeCountRaw) ? multiRangeCountRaw : multiRanges.length;

            container.innerHTML = "";
            multiRanges.forEach((range, rangeIdx) => {
                const block = doc.createElement("div");
                block.className = "multi-range-block";
                const isCollapsed = !!multiRangeCollapsed[rangeIdx];
                if (isCollapsed) block.classList.add("collapsed");

                const header = doc.createElement("div");
                header.className = "multi-range-header";
                const title = doc.createElement("div");
                title.className = "multi-range-title";
                title.textContent = getMultiRangeTitleText(rangeIdx, range, baseRef);

                const headerActions = doc.createElement("div");
                headerActions.className = "multi-range-header-actions";
                const createHeaderActionDivider = () => {
                    const divider = doc.createElement("span");
                    divider.className = "multi-range-header-divider";
                    divider.textContent = "|";
                    divider.setAttribute("aria-hidden", "true");
                    return divider;
                };

                const saveRangeBtn = doc.createElement("button");
                saveRangeBtn.type = "button";
                saveRangeBtn.className = "sm-btn multi-range-save-btn";
                saveRangeBtn.textContent = translate("btn_save_image_range");
                saveRangeBtn.addEventListener("click", () => {
                    invokeDep("saveMultiRangeSingleImage", rangeIdx);
                });

                const copyRangeBtn = doc.createElement("button");
                copyRangeBtn.type = "button";
                copyRangeBtn.className = "sm-btn multi-range-copy-btn";
                copyRangeBtn.textContent = translate("btn_copy_range");
                copyRangeBtn.addEventListener("click", () => {
                    invokeDep("copyWholeMultiRange", rangeIdx);
                });

                const collapseBelowBtn = doc.createElement("button");
                collapseBelowBtn.type = "button";
                collapseBelowBtn.className = "sm-btn multi-range-toggle-btn";
                collapseBelowBtn.textContent = translate("btn_collapse_below");
                collapseBelowBtn.disabled = rangeIdx >= (multiRangeCount - 1);
                collapseBelowBtn.addEventListener("click", () => invokeDep("setMultiRangesCollapsedBelow", rangeIdx, true));

                const expandBelowBtn = doc.createElement("button");
                expandBelowBtn.type = "button";
                expandBelowBtn.className = "sm-btn multi-range-toggle-btn";
                expandBelowBtn.textContent = translate("btn_expand_below");
                expandBelowBtn.disabled = rangeIdx >= (multiRangeCount - 1);
                expandBelowBtn.addEventListener("click", () => invokeDep("setMultiRangesCollapsedBelow", rangeIdx, false));

                const toggleBtn = doc.createElement("button");
                toggleBtn.type = "button";
                toggleBtn.className = "sm-btn multi-range-toggle-btn";
                toggleBtn.textContent = isCollapsed ? translate("btn_expand_this_range") : translate("btn_collapse_this_range");
                toggleBtn.addEventListener("click", () => invokeDep("toggleMultiRangeCollapsed", rangeIdx));

                headerActions.appendChild(saveRangeBtn);
                headerActions.appendChild(copyRangeBtn);
                headerActions.appendChild(createHeaderActionDivider());
                headerActions.appendChild(collapseBelowBtn);
                headerActions.appendChild(expandBelowBtn);
                headerActions.appendChild(createHeaderActionDivider());
                headerActions.appendChild(toggleBtn);
                header.appendChild(title);
                header.appendChild(headerActions);
                block.appendChild(header);

                const adjustRow = doc.createElement("div");
                adjustRow.className = "multi-range-adjust-row";
                const startAdjustEnabled = !!invokeDep("isMultiRangeStartEditEnabled", rangeIdx);
                const startAdjustSet = (rangeIdx > 0)
                    ? invokeDep("renderTimeAdjustSet", 0, {
                        labelText: translate("label_start_time_adjust"),
                        includeFixedActions: false,
                        includeSyncPreviousEndAction: true,
                        disabled: !startAdjustEnabled,
                        onAction: (slotIdx, action) => invokeDep("applyMultiRangeTimeAdjustAction", rangeIdx, slotIdx, action)
                    })
                    : null;
                if (startAdjustSet) {
                    invokeDep(
                        "attachTimeAdjustToggleLabel",
                        startAdjustSet,
                        startAdjustEnabled,
                        translate("label_start_time_adjust"),
                        (nextChecked) => invokeDep("setMultiRangeStartEditEnabled", rangeIdx, nextChecked, { persist: true, rerender: true })
                    );
                    adjustRow.appendChild(startAdjustSet);
                }

                const endAdjustEnabled = !!invokeDep("isMultiRangeEndEditEnabled", rangeIdx);
                const endAdjustSet = invokeDep("renderTimeAdjustSet", 1, {
                    labelText: translate("label_extra_time_adjust"),
                    includeFixedActions: false,
                    includeZeroDayAction: true,
                    disabled: !endAdjustEnabled,
                    onAction: (slotIdx, action) => invokeDep("applyMultiRangeTimeAdjustAction", rangeIdx, slotIdx, action)
                });
                if (endAdjustSet) {
                    invokeDep(
                        "attachTimeAdjustToggleLabel",
                        endAdjustSet,
                        endAdjustEnabled,
                        translate("label_extra_time_adjust"),
                        (nextChecked) => invokeDep("setMultiRangeEndEditEnabled", rangeIdx, nextChecked, { persist: true, rerender: true })
                    );
                    adjustRow.appendChild(endAdjustSet);
                }
                block.appendChild(adjustRow);

                const tableWrap = doc.createElement("div");
                tableWrap.className = "multi-range-table-wrap";
                const table = doc.createElement("table");
                table.className = "data-table multi-range-table";

                const thead = doc.createElement("thead");
                const headCells = [];
                headCells.push(...displayColumns.map((colKey) => invokeDep("getMultiDisplayColumnHeader", colKey)).filter(Boolean));
                headCells.push(`<th class="export-exclude" style="width: 70px;">${translate("th_copy")}</th>`);
                thead.insertAdjacentHTML("afterbegin", `<tr>${headCells.join("")}</tr>`);
                table.appendChild(thead);

                const tbody = doc.createElement("tbody");
                const baseRow = createMultiRangeTableRow(baseRef, {
                    rangeIdx,
                    range,
                    displayColumns,
                    isBase: true,
                    rowId: baseRef.id,
                    baseNameHtml: baseRefName
                });
                if (baseRow) tbody.appendChild(baseRow);

                rowsToRender.forEach((tz) => {
                    if (!tz || typeof tz !== "object") return;
                    const rowId = tz.id === "utc" ? "utc" : tz.id;
                    const row = createMultiRangeTableRow(tz, {
                        rangeIdx,
                        range,
                        displayColumns,
                        isBase: false,
                        rowId
                    });
                    if (row) tbody.appendChild(row);
                });

                table.appendChild(tbody);
                tableWrap.appendChild(table);
                block.appendChild(tableWrap);
                container.appendChild(block);
            });

            invokeDep("updateTimeAdjustPanel");
            invokeDep("updateCopyFormatPreview");
            invokeDep("upgradeNativeTitleTooltips", container);
        }

        return Object.freeze({
            getTimezoneDisplayPointAtDate,
            buildTimezoneComputedSnapshotForRange,
            applySnapshotToRow,
            formatRangeDurationText,
            getMultiRangeTitleText,
            createMultiRangeTableRow,
            renderMultiRanges
        });
    }

    globalObj.GTVMultiRangeRender = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/multi-range-copy.js ---
(function initGtvMultiRangeCopy(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (_err) {
                return undefined;
            }
        }

        function translate(key) {
            const value = invokeDep("t", key);
            if (typeof value === "string" && value) return value;
            return String(key || "");
        }

        function getRangesSafe() {
            const ranges = invokeDep("getMultiRanges");
            return Array.isArray(ranges) ? ranges : [];
        }

        async function copyMultiRangeRow(rangeIdx, rowId) {
            invokeDep("ensureMultiRangeState");
            const ranges = getRangesSafe();
            const range = ranges[rangeIdx];
            if (!range) return;
            const tz = invokeDep("getTimezoneRefById", rowId);
            if (!tz) return;

            const snapshot = invokeDep(
                "buildTimezoneComputedSnapshotForRange",
                tz,
                new Date(range.startUtcMs),
                new Date(range.endUtcMs)
            );
            const text = invokeDep(
                "formatSnapshotText",
                snapshot,
                invokeDep("getCopyFormatOrder"),
                invokeDep("getCopyFormatEnabled"),
                invokeDep("getCopyTimePartsEnabled")
            );
            if (!text) return;

            try {
                await invokeDep("writeClipboard", text);
                invokeDep("showToast", translate("toast_copy_success"), { type: "success" });
            } catch (err) {
                console.error("copyMultiRangeRow failed:", err);
                invokeDep("showToast", translate("toast_copy_failed"), { type: "error" });
            }
        }

        async function copyWholeMultiRange(rangeIdx) {
            invokeDep("ensureMultiRangeState");
            const ranges = getRangesSafe();
            const range = ranges[rangeIdx];
            if (!range) return;

            const baseRef = invokeDep("getBaseTimezoneRef");
            if (!baseRef) return;
            const dynamicRowsRaw = invokeDep("getRenderableTimezoneRows", baseRef);
            const dynamicRows = Array.isArray(dynamicRowsRaw) ? dynamicRowsRaw : [];
            const rowRefs = [baseRef, ...dynamicRows];
            const lineArr = [invokeDep("getMultiRangeTitleText", rangeIdx, range, baseRef)];

            rowRefs.forEach((tz) => {
                if (!tz) return;
                const snapshot = invokeDep(
                    "buildTimezoneComputedSnapshotForRange",
                    tz,
                    new Date(range.startUtcMs),
                    new Date(range.endUtcMs)
                );
                const line = invokeDep(
                    "formatSnapshotText",
                    snapshot,
                    invokeDep("getCopyFormatOrder"),
                    invokeDep("getCopyFormatEnabled"),
                    invokeDep("getCopyTimePartsEnabled")
                );
                if (line) lineArr.push(line);
            });

            if (lineArr.length <= 1) return;
            try {
                await invokeDep("writeClipboard", lineArr.join("\n"));
                invokeDep("showToast", translate("toast_copy_success"), { type: "success" });
            } catch (err) {
                console.error("copyWholeMultiRange failed:", err);
                invokeDep("showToast", translate("toast_copy_failed"), { type: "error" });
            }
        }

        async function copyAllMultiRangeTimezones() {
            invokeDep("ensureMultiRangeState");
            const ranges = getRangesSafe();
            const baseRef = invokeDep("getBaseTimezoneRef");
            if (!baseRef) return;
            const dynamicRowsRaw = invokeDep("getRenderableTimezoneRows", baseRef);
            const dynamicRows = Array.isArray(dynamicRowsRaw) ? dynamicRowsRaw : [];
            const rowRefs = [baseRef, ...dynamicRows];
            const lineArr = [];

            ranges.forEach((range, rangeIdx) => {
                lineArr.push(invokeDep("getMultiRangeTitleText", rangeIdx, range, baseRef));
                rowRefs.forEach((tz) => {
                    if (!tz) return;
                    const snapshot = invokeDep(
                        "buildTimezoneComputedSnapshotForRange",
                        tz,
                        new Date(range.startUtcMs),
                        new Date(range.endUtcMs)
                    );
                    const line = invokeDep(
                        "formatSnapshotText",
                        snapshot,
                        invokeDep("getCopyFormatOrder"),
                        invokeDep("getCopyFormatEnabled"),
                        invokeDep("getCopyTimePartsEnabled")
                    );
                    if (line) lineArr.push(line);
                });
                if (rangeIdx < ranges.length - 1) {
                    lineArr.push("");
                }
            });

            if (!lineArr.length) return;
            try {
                await invokeDep("writeClipboard", lineArr.join("\n"));
                invokeDep("showToast", translate("toast_copy_all_success"), { type: "success" });
            } catch (err) {
                console.error("copyAllMultiRangeTimezones failed:", err);
                invokeDep("showToast", translate("toast_copy_failed"), { type: "error" });
            }
        }

        return Object.freeze({
            copyMultiRangeRow,
            copyWholeMultiRange,
            copyAllMultiRangeTimezones
        });
    }

    globalObj.GTVMultiRangeCopy = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/copy-actions.js ---
(function initGtvCopyActions(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function getDocumentRef() {
            return (typeof document === "object" && document) ? document : null;
        }

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (_err) {
                return undefined;
            }
        }

        function getBooleanDep(name, fallback = false) {
            const value = invokeDep(name);
            if (value === undefined) return !!fallback;
            return !!value;
        }

        function translate(key) {
            const value = invokeDep("t", key);
            if (typeof value === "string" && value) return value;
            return String(key || "");
        }

        function updateCopyFormatPreview() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function") return;
            const copyPreviewEl = doc.getElementById("copy-format-preview");
            if (!copyPreviewEl) return;

            const setPreview = (el, text) => {
                const resolved = text || "-";
                el.textContent = resolved;
                if (el.classList && typeof el.classList.toggle === "function") {
                    el.classList.toggle("empty", resolved === "-");
                }
            };

            if (!getBooleanDep("isShowCopyFormat")) {
                setPreview(copyPreviewEl, "-");
                return;
            }

            if (getBooleanDep("isMultiTab")) {
                invokeDep("ensureMultiRangeState");
                const multiRanges = invokeDep("getMultiRanges");
                const firstRange = Array.isArray(multiRanges) ? multiRanges[0] : null;
                const baseRef = invokeDep("getBaseTimezoneRef");
                const snapshot = firstRange
                    ? invokeDep("buildTimezoneComputedSnapshotForRange", baseRef, new Date(firstRange.startUtcMs), new Date(firstRange.endUtcMs))
                    : null;
                setPreview(
                    copyPreviewEl,
                    invokeDep(
                        "formatSnapshotText",
                        snapshot,
                        invokeDep("getCopyFormatOrder"),
                        invokeDep("getCopyFormatEnabled"),
                        invokeDep("getCopyTimePartsEnabled")
                    )
                );
                return;
            }

            if (getBooleanDep("isFixedTimeTab")) {
                setPreview(copyPreviewEl, invokeDep("getFixedTimePreviewCopyText", ""));
                return;
            }

            const baseRef = invokeDep("getBaseTimezoneRef");
            const baseRowId = baseRef?.id || "utc";
            setPreview(
                copyPreviewEl,
                invokeDep(
                    "getRowFormattedText",
                    baseRowId,
                    invokeDep("getCopyFormatOrder"),
                    invokeDep("getCopyFormatEnabled"),
                    invokeDep("getCopyTimePartsEnabled")
                )
            );
        }

        async function copyRow(id) {
            const text = invokeDep("getRowCopyText", id);
            if (!text) return;
            try {
                await invokeDep("writeClipboard", text);
                invokeDep("showToast", translate("toast_copy_success"), { type: "success" });
            } catch (err) {
                console.error("copyRow failed:", err);
                invokeDep("showToast", translate("toast_copy_failed"), { type: "error" });
            }
        }

        async function copyAllTimezones() {
            const doc = getDocumentRef();
            if (getBooleanDep("isMultiTab")) {
                await invokeDep("copyAllMultiRangeTimezones");
                return;
            }
            if (getBooleanDep("isFixedTimeTab")) {
                const fixedTimeAllText = invokeDep("getAllFixedTimeRowsCopyText", "");
                if (!fixedTimeAllText) return;
                try {
                    await invokeDep("writeClipboard", fixedTimeAllText);
                    invokeDep("showToast", translate("toast_copy_all_success"), { type: "success" });
                } catch (err) {
                    console.error("copyAllTimezones failed:", err);
                    invokeDep("showToast", translate("toast_copy_failed"), { type: "error" });
                }
                return;
            }

            if (!doc || typeof doc.querySelectorAll !== "function") return;
            const lineArr = Array.from(doc.querySelectorAll("#clocks-container .time-row") || [])
                .map((row) => invokeDep("getRowCopyText", String(row?.id || "").replace("tz-row-", "")))
                .filter(Boolean);
            if (!lineArr.length) return;

            try {
                await invokeDep("writeClipboard", lineArr.join("\n"));
                invokeDep("showToast", translate("toast_copy_all_success"), { type: "success" });
            } catch (err) {
                console.error("copyAllTimezones failed:", err);
                invokeDep("showToast", translate("toast_copy_failed"), { type: "error" });
            }
        }

        return Object.freeze({
            updateCopyFormatPreview,
            copyRow,
            copyAllTimezones
        });
    }

    globalObj.GTVCopyActions = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/time-adjust-ui.js ---
(function initGtvTimeAdjustUi(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function getDocumentRef() {
            return (typeof document === "object" && document) ? document : null;
        }

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (_err) {
                return undefined;
            }
        }

        function translate(key) {
            const value = invokeDep("t", key);
            if (typeof value === "string" && value) return value;
            return String(key || "");
        }

        function getNumberConstant(name, fallback) {
            const parsed = Number(safeDeps[name]);
            return Number.isFinite(parsed) ? parsed : fallback;
        }

        function isHtmlElementLike(el) {
            if (!el || typeof el !== "object") return false;
            if (typeof HTMLElement === "undefined") return true;
            return el instanceof HTMLElement;
        }

        function createElement(tagName) {
            const doc = getDocumentRef();
            if (!doc || typeof doc.createElement !== "function") return null;
            return doc.createElement(tagName);
        }

        function appendChildIfPossible(parent, child) {
            if (!parent || !child) return;
            if (typeof parent.appendChild !== "function") return;
            parent.appendChild(child);
        }

        function resolveActionHandler(onAction) {
            if (typeof onAction === "function") return onAction;
            return (typeof safeDeps.applyTimeAdjustAction === "function") ? safeDeps.applyTimeAdjustAction : null;
        }

        function createTimeAdjustActionButton(labelKey, slotIdx, action, onAction = null, disabled = false) {
            const button = createElement("button");
            if (!button) return null;
            const actionHandler = resolveActionHandler(onAction);
            button.type = "button";
            button.className = "sm-btn";
            button.dataset.action = action;
            button.textContent = translate(labelKey);
            button.disabled = !!disabled;
            button.addEventListener("click", () => {
                if (button.disabled) return;
                if (typeof actionHandler === "function") actionHandler(slotIdx, action);
            });
            return button;
        }

        function createTimeAdjustDivider() {
            const divider = createElement("span");
            if (!divider) return null;
            divider.className = "time-adjust-divider";
            divider.textContent = "|";
            return divider;
        }

        function attachTimeAdjustToggleLabel(setEl, checked, text, onChange) {
            if (!isHtmlElementLike(setEl) || typeof onChange !== "function") return;
            const label = setEl.querySelector?.(".time-adjust-set-label");
            if (!label) return;

            if (label.classList && typeof label.classList.add === "function") {
                label.classList.add("time-adjust-set-label-with-toggle");
            }
            label.textContent = "";

            const toggle = createElement("input");
            const textEl = createElement("span");
            if (!toggle || !textEl) return;

            toggle.type = "checkbox";
            toggle.className = "time-adjust-set-toggle";
            toggle.checked = !!checked;
            toggle.addEventListener("change", () => onChange(toggle.checked));

            textEl.textContent = text;

            appendChildIfPossible(label, toggle);
            appendChildIfPossible(label, textEl);
        }

        function sanitizeTimeAdjustDayStep(value) {
            const minStep = getNumberConstant("MIN_TIME_ADJUST_DAY_STEP", 1);
            const maxStep = getNumberConstant("MAX_TIME_ADJUST_DAY_STEP", 36500);
            const defaultStep = getNumberConstant("DEFAULT_TIME_ADJUST_DAY_STEP", 1);
            const parsed = parseInt(value, 10);
            if (!Number.isFinite(parsed)) return defaultStep;
            return Math.min(maxStep, Math.max(minStep, parsed));
        }

        function getTimeAdjustDayStep(slotIdx) {
            return sanitizeTimeAdjustDayStep(invokeDep("getTimeAdjustDayStepValue", slotIdx));
        }

        function setTimeAdjustDayStep(slotIdx, value) {
            const safeValue = sanitizeTimeAdjustDayStep(value);
            invokeDep("setTimeAdjustDayStepValue", slotIdx, safeValue);
            return safeValue;
        }

        function createTimeAdjustCustomDaysControl(slotIdx, onAction = null, disabled = false) {
            const wrap = createElement("div");
            const label = createElement("span");
            const dayInput = createElement("input");
            const minusBtn = createElement("button");
            const plusBtn = createElement("button");
            if (!wrap || !label || !dayInput || !minusBtn || !plusBtn) return wrap;
            const actionHandler = resolveActionHandler(onAction);

            wrap.className = "time-adjust-custom-group";

            label.className = "time-adjust-custom-label";
            label.textContent = translate("label_custom_days");

            dayInput.type = "number";
            dayInput.className = "form-input time-adjust-days-input";
            dayInput.min = String(getNumberConstant("MIN_TIME_ADJUST_DAY_STEP", 1));
            dayInput.step = "1";
            dayInput.inputMode = "numeric";
            dayInput.value = String(getTimeAdjustDayStep(slotIdx));
            dayInput.disabled = !!disabled;

            minusBtn.type = "button";
            minusBtn.className = "sm-btn time-adjust-custom-btn";
            minusBtn.textContent = "-";
            minusBtn.disabled = !!disabled;
            minusBtn.addEventListener("click", () => {
                if (minusBtn.disabled) return;
                if (typeof actionHandler === "function") actionHandler(slotIdx, "minus_custom_days");
            });

            plusBtn.type = "button";
            plusBtn.className = "sm-btn time-adjust-custom-btn";
            plusBtn.textContent = "+";
            plusBtn.disabled = !!disabled;
            plusBtn.addEventListener("click", () => {
                if (plusBtn.disabled) return;
                if (typeof actionHandler === "function") actionHandler(slotIdx, "plus_custom_days");
            });

            const syncInputAndLabel = (persist = false) => {
                const normalized = setTimeAdjustDayStep(slotIdx, dayInput.value);
                dayInput.value = String(normalized);
                if (persist) invokeDep("savePersistence");
            };

            dayInput.addEventListener("input", () => syncInputAndLabel(true));
            dayInput.addEventListener("change", () => syncInputAndLabel(true));
            dayInput.addEventListener("blur", () => syncInputAndLabel(true));
            syncInputAndLabel();

            appendChildIfPossible(wrap, label);
            appendChildIfPossible(wrap, minusBtn);
            appendChildIfPossible(wrap, dayInput);
            appendChildIfPossible(wrap, plusBtn);
            return wrap;
        }

        function renderTimeAdjustSet(slotIdx, options = {}) {
            const {
                onAction = null,
                labelText = "",
                disabled = false,
                includeFixedActions = true,
                includeZeroDayAction = false,
                includeSyncPreviousEndAction = false
            } = options;
            const actionHandler = resolveActionHandler(onAction);
            const set = createElement("div");
            const label = createElement("span");
            if (!set || !label) return set;

            set.className = "time-adjust-set";

            label.className = "time-adjust-set-label";
            label.textContent = labelText || (slotIdx === 0 ? translate("th_time_day_main") : translate("th_time_day_extra"));
            appendChildIfPossible(set, label);

            if (includeFixedActions) {
                const fixedActions = [
                    ["btn_now", "now"],
                    ["btn_midnight", "midnight"],
                    ["btn_sharp_hour", "sharp_hour"]
                ];
                fixedActions.forEach(([labelKey, action]) => {
                    appendChildIfPossible(set, createTimeAdjustActionButton(labelKey, slotIdx, action, actionHandler, disabled));
                });
                appendChildIfPossible(set, createTimeAdjustDivider());
            }

            if (includeZeroDayAction) {
                const zeroDayBtn = createTimeAdjustActionButton("btn_set_zero_day", slotIdx, "set_zero_day", actionHandler, disabled);
                if (zeroDayBtn?.classList && typeof zeroDayBtn.classList.add === "function") {
                    zeroDayBtn.classList.add("time-adjust-zero-btn");
                }
                appendChildIfPossible(set, zeroDayBtn);
                appendChildIfPossible(set, createTimeAdjustDivider());
            }

            if (includeSyncPreviousEndAction) {
                const syncPrevBtn = createTimeAdjustActionButton("btn_sync_extra_time", slotIdx, "sync_prev_end", actionHandler, disabled);
                if (syncPrevBtn?.classList && typeof syncPrevBtn.classList.add === "function") {
                    syncPrevBtn.classList.add("time-adjust-sync-btn");
                }
                appendChildIfPossible(set, syncPrevBtn);
                appendChildIfPossible(set, createTimeAdjustDivider());
            }

            const shiftActionGroups = [
                [["btn_minus_hour", "minus_hour"], ["btn_plus_hour", "plus_hour"]],
                [["btn_minus_day", "minus_day"], ["btn_plus_day", "plus_day"]],
                [["btn_minus_week", "minus_week"], ["btn_plus_week", "plus_week"]]
            ];
            shiftActionGroups.forEach((group, groupIdx) => {
                group.forEach(([labelKey, action]) => {
                    appendChildIfPossible(set, createTimeAdjustActionButton(labelKey, slotIdx, action, actionHandler, disabled));
                });
                if (groupIdx < shiftActionGroups.length - 1) {
                    appendChildIfPossible(set, createTimeAdjustDivider());
                }
            });

            appendChildIfPossible(set, createTimeAdjustDivider());
            appendChildIfPossible(set, createTimeAdjustActionButton("btn_minus_four_weeks", slotIdx, "minus_four_weeks", actionHandler, disabled));
            appendChildIfPossible(set, createTimeAdjustActionButton("btn_plus_four_weeks", slotIdx, "plus_four_weeks", actionHandler, disabled));
            appendChildIfPossible(set, createTimeAdjustDivider());
            appendChildIfPossible(set, createTimeAdjustCustomDaysControl(slotIdx, actionHandler, disabled));

            return set;
        }

        function updateTimeAdjustPanel() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function") return;
            const frame = doc.getElementById("time-adjust-frame");
            const row = doc.getElementById("time-adjust-row");
            const buttonsContainer = doc.getElementById("time-adjust-buttons");
            if (!frame || !row || !buttonsContainer) return;

            const visible = invokeDep("getCurrentMainTab") === "fixed";
            frame.style.display = visible ? "block" : "none";
            row.style.display = visible ? "block" : "none";

            if (!visible) {
                buttonsContainer.textContent = "";
                return;
            }

            const effectiveSlotCount = invokeDep("isRealtime") ? 1 : (Number(invokeDep("getSlotCount")) || 1);
            buttonsContainer.innerHTML = "";
            if (effectiveSlotCount > 1) {
                appendChildIfPossible(buttonsContainer, renderTimeAdjustSet(0, {
                    labelText: translate("label_start_time_adjust"),
                    includeFixedActions: true
                }));
                appendChildIfPossible(buttonsContainer, renderTimeAdjustSet(1, {
                    labelText: translate("label_extra_time_adjust"),
                    includeFixedActions: false,
                    includeZeroDayAction: true
                }));
            } else {
                appendChildIfPossible(buttonsContainer, renderTimeAdjustSet(0, {
                    labelText: translate("label_main_time_adjust"),
                    includeFixedActions: true
                }));
            }

            const syncFixedZeroButtonWidth = () => {
                const sets = Array.from(buttonsContainer.querySelectorAll?.(".time-adjust-set") || []);
                if (sets.length < 2) return;
                const startSet = sets[0];
                const endSet = sets[1];
                const zeroBtn = endSet.querySelector?.('[data-action="set_zero_day"]');
                if (!isHtmlElementLike(zeroBtn)) return;

                zeroBtn.style.width = "";
                zeroBtn.style.minWidth = "";

                const nowBtn = startSet.querySelector?.('[data-action="now"]');
                const firstDivider = startSet.querySelector?.(".time-adjust-divider");
                if (isHtmlElementLike(nowBtn) && isHtmlElementLike(firstDivider)) {
                    const nowRect = nowBtn.getBoundingClientRect();
                    const dividerRect = firstDivider.getBoundingClientRect();
                    const desiredSpanToDivider = Math.round(dividerRect.left - nowRect.left);
                    if (desiredSpanToDivider > 0 && typeof globalObj.getComputedStyle === "function") {
                        const endSetStyle = globalObj.getComputedStyle(endSet);
                        const gap = parseFloat(endSetStyle.columnGap || endSetStyle.gap || "0") || 0;
                        const btnStyle = globalObj.getComputedStyle(zeroBtn);
                        const marginRight = parseFloat(btnStyle.marginRight || "0") || 0;
                        const widthPx = `${Math.max(150, Math.round(desiredSpanToDivider - marginRight - gap))}px`;
                        zeroBtn.style.width = widthPx;
                        zeroBtn.style.minWidth = widthPx;
                        return;
                    }
                }

                const fallbackWidth = Math.max(150, Math.ceil((Number(zeroBtn.scrollWidth) || 0) + 18));
                const widthPx = `${fallbackWidth}px`;
                zeroBtn.style.width = widthPx;
                zeroBtn.style.minWidth = widthPx;
            };

            if (effectiveSlotCount > 1) {
                if (typeof globalObj.requestAnimationFrame === "function") {
                    globalObj.requestAnimationFrame(syncFixedZeroButtonWidth);
                } else {
                    syncFixedZeroButtonWidth();
                }
            }

            invokeDep("upgradeNativeTitleTooltips", buttonsContainer);
        }

        return Object.freeze({
            createTimeAdjustActionButton,
            createTimeAdjustDivider,
            attachTimeAdjustToggleLabel,
            sanitizeTimeAdjustDayStep,
            getTimeAdjustDayStep,
            setTimeAdjustDayStep,
            createTimeAdjustCustomDaysControl,
            renderTimeAdjustSet,
            updateTimeAdjustPanel
        });
    }

    globalObj.GTVTimeAdjustUI = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/time-adjust-actions.js ---
(function initGtvTimeAdjustActions(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (_err) {
                return undefined;
            }
        }

        function getGlobalTimesRef() {
            const value = invokeDep("getGlobalTimes");
            return Array.isArray(value) ? value : [];
        }

        function isValidDate(value) {
            return !!value && typeof value.getTime === "function" && Number.isFinite(value.getTime());
        }

        function sanitizeUtcMs(value, fallbackMs) {
            const viaDep = invokeDep("sanitizeUtcMs", value, fallbackMs);
            if (Number.isFinite(viaDep)) return Math.trunc(viaDep);
            const parsed = Number(value);
            if (Number.isFinite(parsed)) return Math.trunc(parsed);
            const fallback = Number(fallbackMs);
            return Number.isFinite(fallback) ? Math.trunc(fallback) : Date.now();
        }

        function getAdjustedDayMs(slotIdx, direction) {
            const days = Number(invokeDep("getTimeAdjustDayStep", slotIdx));
            const safeDays = Number.isFinite(days) ? days : 1;
            const sign = direction < 0 ? -1 : 1;
            return sign * safeDays * 24 * 60 * 60 * 1000;
        }

        function resolveTimeAdjustZoneAndOffset(baseRef, fixedOffsetMinutes = null) {
            const safeBaseRef = (baseRef && typeof baseRef === "object") ? baseRef : null;
            if (safeBaseRef?.type === "custom") {
                return {
                    zone: "CUSTOM",
                    fixedOffsetMinutes: invokeDep("getCustomOffsetMinutes", safeBaseRef)
                };
            }

            const safeZone = (typeof safeBaseRef?.zone === "string" && safeBaseRef.zone.trim())
                ? safeBaseRef.zone
                : "UTC";
            const hasFixedOffsetValue = (
                fixedOffsetMinutes !== null
                && fixedOffsetMinutes !== undefined
                && !(typeof fixedOffsetMinutes === "string" && !fixedOffsetMinutes.trim())
            );
            const parsedOffset = hasFixedOffsetValue ? Number(fixedOffsetMinutes) : Number.NaN;
            return {
                zone: safeZone,
                fixedOffsetMinutes: Number.isFinite(parsedOffset) ? Math.trunc(parsedOffset) : null
            };
        }

        function getAdjustedUtcDateByAction(baseDate, action, slotIdx, baseRef, fixedOffsetMinutes) {
            if (!isValidDate(baseDate)) return null;

            if (action === "now") return new Date();
            if (action === "set_zero_day" || action === "sync_prev_end") {
                if (slotIdx !== 1) return baseDate;
                const globalTimes = getGlobalTimesRef();
                const startDate = globalTimes[0];
                if (!isValidDate(startDate)) return null;
                return new Date(startDate.getTime());
            }

            if (!safeDeps.timeService || typeof safeDeps.timeService.adjustDate !== "function") return null;
            const customDays = Number(invokeDep("getTimeAdjustDayStep", slotIdx));
            const resolved = resolveTimeAdjustZoneAndOffset(baseRef, fixedOffsetMinutes);
            return safeDeps.timeService.adjustDate(
                baseDate,
                action,
                resolved.zone,
                resolved.fixedOffsetMinutes,
                Number.isFinite(customDays) ? customDays : 1
            );
        }

        function applyTimeAdjustAction(slotIdx, action) {
            if (invokeDep("isRealtime")) return;

            const globalTimes = getGlobalTimesRef();
            if (!Array.isArray(globalTimes) || !globalTimes.length) return;

            if (action === "now") {
                globalTimes[slotIdx] = new Date();
                invokeDep("updateClocks");
                return;
            }
            if (action === "set_zero_day" || action === "sync_prev_end") {
                if (slotIdx === 1 && isValidDate(globalTimes[0])) {
                    globalTimes[1] = new Date(globalTimes[0].getTime());
                    invokeDep("updateClocks");
                }
                return;
            }

            if (!safeDeps.timeService || typeof safeDeps.timeService.adjustDate !== "function") return;

            const baseRef = invokeDep("getBaseTimezoneRef");
            const defaultFixedOffsetMinutes = invokeDep("getFixedOffsetForDisplay", baseRef);
            const { zone, fixedOffsetMinutes } = resolveTimeAdjustZoneAndOffset(baseRef, defaultFixedOffsetMinutes);
            const customDays = Number(invokeDep("getTimeAdjustDayStep", slotIdx));
            globalTimes[slotIdx] = safeDeps.timeService.adjustDate(
                globalTimes[slotIdx],
                action,
                zone,
                fixedOffsetMinutes,
                Number.isFinite(customDays) ? customDays : 1
            );
            invokeDep("updateClocks");
        }

        function resolveBulkDurationDelta(slotIdx, action) {
            switch (action) {
                case "plus_hour":
                    return 60 * 60 * 1000;
                case "minus_hour":
                    return -60 * 60 * 1000;
                case "plus_day":
                    return 24 * 60 * 60 * 1000;
                case "minus_day":
                    return -24 * 60 * 60 * 1000;
                case "plus_week":
                    return 7 * 24 * 60 * 60 * 1000;
                case "minus_week":
                    return -7 * 24 * 60 * 60 * 1000;
                case "plus_four_weeks":
                    return 28 * 24 * 60 * 60 * 1000;
                case "minus_four_weeks":
                    return -28 * 24 * 60 * 60 * 1000;
                case "plus_custom_days":
                    return getAdjustedDayMs(slotIdx, 1);
                case "minus_custom_days":
                    return getAdjustedDayMs(slotIdx, -1);
                default:
                    return null;
            }
        }

        function applyBulkRangeAllAction(slotIdx, action) {
            invokeDep("ensureMultiRangeState");
            const multiRanges = invokeDep("getMultiRanges");
            if (!Array.isArray(multiRanges) || !multiRanges.length) return;

            const baseDurations = multiRanges.map((range) => {
                const start = sanitizeUtcMs(range?.startUtcMs, Date.now());
                const end = sanitizeUtcMs(range?.endUtcMs, start);
                return end - start;
            });
            let nextDurations = [];

            if (action === "set_zero_day") {
                nextDurations = baseDurations.map(() => 0);
            } else {
                const deltaMs = resolveBulkDurationDelta(slotIdx, action);
                if (!Number.isFinite(deltaMs)) return;
                nextDurations = baseDurations.map((durationMs) => durationMs + deltaMs);
            }

            let cursor = sanitizeUtcMs(multiRanges[0]?.startUtcMs, Date.now());
            for (let idx = 0; idx < multiRanges.length; idx += 1) {
                const current = multiRanges[idx];
                if (!current || typeof current !== "object") continue;
                if (idx === 0 || invokeDep("isMultiRangeStartLinked", idx)) {
                    current.startUtcMs = cursor;
                } else {
                    current.startUtcMs = sanitizeUtcMs(current.startUtcMs, cursor);
                }
                current.endUtcMs = current.startUtcMs + (nextDurations[idx] ?? 0);
                cursor = current.endUtcMs;
            }

            if (invokeDep("isMultiTab")) invokeDep("renderMultiRanges");
            invokeDep("savePersistence");
        }

        function applyMultiRangeTimeAdjustAction(rangeIdx, slotIdx, action) {
            if (!invokeDep("isMultiTab")) return;
            if (rangeIdx > 0 && slotIdx === 0 && !invokeDep("isMultiRangeStartEditEnabled", rangeIdx)) return;
            if (slotIdx === 1 && !invokeDep("isMultiRangeEndEditEnabled", rangeIdx)) return;

            invokeDep("ensureMultiRangeState");
            const multiRanges = invokeDep("getMultiRanges");
            if (!Array.isArray(multiRanges)) return;
            const range = multiRanges[rangeIdx];
            if (!range || typeof range !== "object") return;

            if (slotIdx === 0 && action === "sync_prev_end") {
                if (rangeIdx <= 0) return;
                const durationSnapshot = multiRanges.map((item) => {
                    const start = sanitizeUtcMs(item?.startUtcMs, Date.now());
                    const end = sanitizeUtcMs(item?.endUtcMs, start);
                    return end - start;
                });
                range.startUtcMs = sanitizeUtcMs(multiRanges[rangeIdx - 1]?.endUtcMs, range.startUtcMs);
                invokeDep("syncLinkedRangesFrom", rangeIdx, {
                    includeCurrent: true,
                    stopAtFirstUnlocked: true,
                    baseDurations: durationSnapshot
                });
            } else if (slotIdx === 1 && action === "set_zero_day") {
                range.endUtcMs = range.startUtcMs;
            } else {
                const baseRef = invokeDep("getBaseTimezoneRef");
                const anchorDate = new Date(sanitizeUtcMs(range.startUtcMs, Date.now()));
                const fixedOffsetMinutes = invokeDep("getFixedOffsetForDisplayAtDate", baseRef, anchorDate);
                const baseDate = invokeDep("getMultiRangeSlotDate", rangeIdx, slotIdx);
                const nextUtcDate = getAdjustedUtcDateByAction(
                    baseDate,
                    action,
                    slotIdx,
                    baseRef,
                    fixedOffsetMinutes
                );
                if (!isValidDate(nextUtcDate)) return;
                invokeDep("setMultiRangeSlotDate", rangeIdx, slotIdx, nextUtcDate);
            }

            if (slotIdx === 1) {
                invokeDep("syncFollowingRangesByDuration", rangeIdx);
            } else if (rangeIdx === 0) {
                invokeDep("syncMultiRangeStartLinks", 1);
            }

            invokeDep("renderMultiRanges");
            invokeDep("savePersistence");
        }

        return Object.freeze({
            resolveTimeAdjustZoneAndOffset,
            getAdjustedUtcDateByAction,
            applyTimeAdjustAction,
            applyBulkRangeAllAction,
            applyMultiRangeTimeAdjustAction
        });
    }

    globalObj.GTVTimeAdjustActions = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/multi-bulk-tools.js ---
(function initGtvMultiBulkTools(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function getDocumentRef() {
            return (typeof document === "object" && document) ? document : null;
        }

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (err) {
                console.warn(`[GTVMultiBulkTools] Dependency "${name}" threw.`, err);
                return undefined;
            }
        }

        function translate(key) {
            const value = invokeDep("t", key);
            if (typeof value === "string" && value) return value;
            return String(key || "");
        }

        function asArray(value) {
            if (Array.isArray(value)) return value;
            if (value && typeof value[Symbol.iterator] === "function") {
                try {
                    return Array.from(value);
                } catch (_err) {
                    return [];
                }
            }
            return [];
        }

        function isElementLike(node) {
            if (!node || typeof node !== "object") return false;
            if (typeof Element === "undefined") return true;
            return node instanceof Element;
        }

        function getMultiRangeCount() {
            const value = Number(invokeDep("getMultiRangeCount"));
            return Number.isFinite(value) ? Math.max(0, value) : 0;
        }

        function renderMultiBulkToolSets() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function" || typeof doc.createElement !== "function") return;

            const startTools = doc.getElementById("multi-bulk-start-tools");
            const allTools = doc.getElementById("multi-bulk-all-tools");
            if (!allTools) return;

            const multiRangeCount = getMultiRangeCount();
            const hasRanges = multiRangeCount > 0;
            allTools.textContent = "";
            if (startTools) {
                startTools.textContent = "";
                startTools.style.display = "none";
            }
            allTools.style.display = "flex";
            allTools.style.flexDirection = "column";
            allTools.style.alignItems = "flex-start";
            allTools.style.gap = "8px";

            const bulkSet = invokeDep("renderTimeAdjustSet", 1, {
                labelText: translate("label_range_bulk"),
                disabled: !hasRanges,
                onAction: (slotIdx, action) => invokeDep("applyBulkRangeAllAction", slotIdx, action),
                includeFixedActions: false
            });
            if (!bulkSet || typeof bulkSet.appendChild !== "function") return;

            const zeroDayBtn = invokeDep(
                "createTimeAdjustActionButton",
                "btn_set_zero_day",
                1,
                "set_zero_day",
                (slotIdx, action) => invokeDep("applyBulkRangeAllAction", slotIdx, action),
                !hasRanges
            );
            if (zeroDayBtn?.classList && typeof zeroDayBtn.classList.add === "function") {
                zeroDayBtn.classList.add("time-adjust-bulk-zero-btn");
            }

            const bulkChildren = asArray(bulkSet.children);
            const firstActionNode = bulkChildren.find((_node, idx) => idx > 0) || null;
            if (zeroDayBtn && firstActionNode && typeof bulkSet.insertBefore === "function") {
                bulkSet.insertBefore(zeroDayBtn, firstActionNode);
                const divider = invokeDep("createTimeAdjustDivider");
                if (divider) bulkSet.insertBefore(divider, firstActionNode);
            } else if (zeroDayBtn) {
                bulkSet.appendChild(zeroDayBtn);
            }

            const bulkToolBlock = doc.createElement("div");
            bulkToolBlock.className = "multi-tool-block";
            bulkToolBlock.appendChild(bulkSet);

            const firstRangeStartSet = invokeDep("renderTimeAdjustSet", 0, {
                labelText: translate("label_start_time_adjust"),
                disabled: !hasRanges,
                onAction: (slotIdx, action) => invokeDep("applyFirstRangeStartAdjustAction", slotIdx, action),
                includeFixedActions: true,
                includeSyncPreviousEndAction: false
            });
            const firstRangeStartToolBlock = doc.createElement("div");
            firstRangeStartToolBlock.className = "multi-tool-block";
            firstRangeStartToolBlock.dataset.role = "first-range-start-tools";
            if (firstRangeStartSet) firstRangeStartToolBlock.appendChild(firstRangeStartSet);

            const createBulkToggleButton = (buttonText, onClick) => {
                const button = doc.createElement("button");
                button.type = "button";
                button.className = "sm-btn time-adjust-bulk-toggle-btn";
                button.textContent = buttonText;
                button.disabled = !hasRanges;
                button.addEventListener("click", () => {
                    if (button.disabled) return;
                    onClick();
                });
                return button;
            };

            const bulkToggleSet = doc.createElement("div");
            bulkToggleSet.className = "time-adjust-set";
            const bulkToggleLabel = doc.createElement("span");
            bulkToggleLabel.className = "time-adjust-set-label";
            bulkToggleLabel.textContent = translate("label_all_range_time_adjust");
            bulkToggleSet.appendChild(bulkToggleLabel);
            const enableStartBtn = createBulkToggleButton(
                translate("btn_enable_all_start_time_adjust"),
                () => invokeDep("setAllMultiRangeStartEditEnabled", true, { persist: true, rerender: true })
            );
            if (enableStartBtn) bulkToggleSet.appendChild(enableStartBtn);
            const disableStartBtn = createBulkToggleButton(
                translate("btn_disable_all_start_time_adjust"),
                () => invokeDep("setAllMultiRangeStartEditEnabled", false, { persist: true, rerender: true })
            );
            if (disableStartBtn) bulkToggleSet.appendChild(disableStartBtn);
            const toggleDivider = invokeDep("createTimeAdjustDivider");
            if (toggleDivider) bulkToggleSet.appendChild(toggleDivider);
            const enableEndBtn = createBulkToggleButton(
                translate("btn_enable_all_end_time_adjust"),
                () => invokeDep("setAllMultiRangeEndEditEnabled", true, { persist: true, rerender: true })
            );
            if (enableEndBtn) bulkToggleSet.appendChild(enableEndBtn);
            const disableEndBtn = createBulkToggleButton(
                translate("btn_disable_all_end_time_adjust"),
                () => invokeDep("setAllMultiRangeEndEditEnabled", false, { persist: true, rerender: true })
            );
            if (disableEndBtn) bulkToggleSet.appendChild(disableEndBtn);
            const toggleToolBlock = doc.createElement("div");
            toggleToolBlock.className = "multi-tool-block";
            toggleToolBlock.appendChild(bulkToggleSet);
            allTools.appendChild(toggleToolBlock);
            if (firstRangeStartSet) allTools.appendChild(firstRangeStartToolBlock);
            allTools.appendChild(bulkToolBlock);

            const syncZeroButtonWidth = () => {
                const bulkZeroBtn = allTools.querySelector?.(".time-adjust-bulk-zero-btn");
                if (!bulkZeroBtn || !isElementLike(bulkZeroBtn)) return;
                const rangeButtons = asArray(doc.querySelectorAll?.(
                    '.multi-range-adjust-row [data-action="set_zero_day"], .multi-range-adjust-row [data-action="sync_prev_end"]'
                ));
                const targetButtons = [bulkZeroBtn, ...rangeButtons].filter((btn) => isElementLike(btn));
                if (!targetButtons.length) return;

                targetButtons.forEach((btn) => {
                    btn.style.width = "";
                    btn.style.minWidth = "";
                    btn.style.justifyContent = "";
                    btn.style.textAlign = "";
                });

                const firstRangeSet = allTools.querySelector?.('[data-role="first-range-start-tools"] .time-adjust-set')
                    || doc.querySelector?.('.multi-range-adjust-row .time-adjust-set [data-action="now"]')?.closest?.(".time-adjust-set");
                let desiredSpanToDivider = 0;
                if (firstRangeSet) {
                    const nowBtn = firstRangeSet.querySelector?.('[data-action="now"]');
                    const firstDivider = firstRangeSet.querySelector?.(".time-adjust-divider");
                    if (nowBtn && firstDivider) {
                        const nowRect = nowBtn.getBoundingClientRect();
                        const dividerRect = firstDivider.getBoundingClientRect();
                        desiredSpanToDivider = Math.round(dividerRect.left - nowRect.left);
                    }
                }

                const getComputedStyleFn = (typeof globalObj.getComputedStyle === "function")
                    ? globalObj.getComputedStyle.bind(globalObj)
                    : null;
                if (desiredSpanToDivider > 0 && getComputedStyleFn) {
                    targetButtons.forEach((btn) => {
                        const set = btn.closest?.(".time-adjust-set");
                        const setStyle = set ? getComputedStyleFn(set) : null;
                        const gap = setStyle ? (parseFloat(setStyle.columnGap || setStyle.gap || "0") || 0) : 0;
                        const btnStyle = getComputedStyleFn(btn);
                        const marginRight = parseFloat(btnStyle.marginRight || "0") || 0;
                        const nextWidth = Math.max(150, Math.round(desiredSpanToDivider - marginRight - gap));
                        const widthPx = `${nextWidth}px`;
                        btn.style.width = widthPx;
                        btn.style.minWidth = widthPx;
                    });
                    return;
                }

                const fallbackWidth = Math.max(
                    180,
                    ...targetButtons.map((btn) => Math.ceil(btn.getBoundingClientRect().width)),
                    ...targetButtons.map((btn) => Math.ceil((Number(btn.scrollWidth) || 0) + 18))
                );
                if (fallbackWidth <= 0) return;
                const widthPx = `${fallbackWidth}px`;
                targetButtons.forEach((btn) => {
                    btn.style.width = widthPx;
                    btn.style.minWidth = widthPx;
                });
            };

            if (typeof globalObj.requestAnimationFrame === "function") {
                globalObj.requestAnimationFrame(syncZeroButtonWidth);
            } else {
                syncZeroButtonWidth();
            }
            invokeDep("upgradeNativeTitleTooltips", allTools);
        }

        return Object.freeze({
            renderMultiBulkToolSets
        });
    }

    globalObj.GTVMultiBulkTools = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/timeline-frame.js ---
(function initGtvTimelineFrame(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const TIMELINE_TOTAL_HOURS = Number.isFinite(Number(safeDeps.TIMELINE_TOTAL_HOURS))
            ? Number(safeDeps.TIMELINE_TOTAL_HOURS)
            : 24;
        const TIMELINE_TOTAL_SECONDS = Number.isFinite(Number(safeDeps.TIMELINE_TOTAL_SECONDS))
            ? Number(safeDeps.TIMELINE_TOTAL_SECONDS)
            : (24 * 60 * 60);

        const requestUiFrame = (typeof safeDeps.requestUiFrame === "function")
            ? safeDeps.requestUiFrame
            : ((cb) => {
                if (typeof globalObj.requestAnimationFrame === "function") {
                    return globalObj.requestAnimationFrame(cb);
                }
                return setTimeout(cb, 16);
            });
        const cancelUiFrame = (typeof safeDeps.cancelUiFrame === "function")
            ? safeDeps.cancelUiFrame
            : ((id) => {
                if (typeof globalObj.cancelAnimationFrame === "function") {
                    globalObj.cancelAnimationFrame(id);
                    return;
                }
                clearTimeout(id);
            });

        let timelineDragState = null;

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (err) {
                console.warn(`[GTVTimelineFrame] Dependency "${name}" threw.`, err);
                return undefined;
            }
        }

        function isValidDate(value) {
            return value instanceof Date && Number.isFinite(value.getTime());
        }

        function asArray(value) {
            if (Array.isArray(value)) return value;
            if (value && typeof value[Symbol.iterator] === "function") {
                try {
                    return Array.from(value);
                } catch (_err) {
                    return [];
                }
            }
            return [];
        }

        function isElementLike(el) {
            if (!el || typeof el !== "object") return false;
            if (typeof HTMLElement === "undefined") return true;
            return el instanceof HTMLElement;
        }

        function clampNumber(value, min, max) {
            const numeric = Number(value);
            if (!Number.isFinite(numeric)) return min;
            if (numeric < min) return min;
            if (numeric > max) return max;
            return numeric;
        }

        function getGlobalTime(slotIdx) {
            const value = invokeDep("getGlobalTime", slotIdx);
            return isValidDate(value) ? value : null;
        }

        function setGlobalTime(slotIdx, value) {
            if (!isValidDate(value)) return false;
            invokeDep("setGlobalTime", slotIdx, value);
            return true;
        }

        function translate(key) {
            const value = invokeDep("t", key);
            if (typeof value === "string" && value) return value;
            return String(key || "");
        }

        function getCurrentMainTab() {
            const tab = invokeDep("getCurrentMainTab");
            if (tab === "live" || tab === "fixed" || tab === "multi" || tab === "fixed-time" || tab === "calc") {
                return tab;
            }
            return "live";
        }

        function getIsRealtime() {
            return !!invokeDep("getIsRealtime");
        }

        function getSlotCount() {
            const value = Number(invokeDep("getSlotCount"));
            return Number.isFinite(value) ? Math.max(1, value) : 1;
        }

        function getTimelinePanelCount() {
            if (invokeDep("isFixedTimeTab")) return 1;
            return (!getIsRealtime() && getSlotCount() > 1) ? 2 : 1;
        }

        function isTimelineSupportedTab() {
            const currentMainTab = getCurrentMainTab();
            return currentMainTab === "live" || currentMainTab === "fixed" || currentMainTab === "fixed-time";
        }

        function shouldRenderTimeline() {
            return !!invokeDep("getShowTimeline") && isTimelineSupportedTab() && !invokeDep("isMultiTab");
        }

        function stopTimelineDrag() {
            if (!timelineDragState) return;
            const state = timelineDragState;
            timelineDragState = null;
            if (state.rafId) {
                cancelUiFrame(state.rafId);
            }
            const pointerEventTarget = state.pointerEventTarget || state.trackBody;
            if (pointerEventTarget && typeof pointerEventTarget.removeEventListener === "function") {
                pointerEventTarget.removeEventListener("pointermove", state.onPointerMove);
                pointerEventTarget.removeEventListener("pointerup", state.onPointerUp);
                pointerEventTarget.removeEventListener("pointercancel", state.onPointerCancel);
            }
            const captureEl = state.captureEl || state.trackBody;
            if (
                captureEl &&
                Number.isInteger(state.pointerId) &&
                typeof captureEl.hasPointerCapture === "function" &&
                captureEl.hasPointerCapture(state.pointerId)
            ) {
                try {
                    captureEl.releasePointerCapture(state.pointerId);
                } catch (_err) {
                    // Ignore pointer capture release failures during rerender/dispose.
                }
            }
        }

        function getTimelineRows(baseRef) {
            const rowsToRender = asArray(invokeDep("getCurrentGroupZones")).filter(
                (tz) => tz && typeof tz === "object" && tz.id !== baseRef.id && !(tz.type === "standard" && tz.zone === "UTC")
            );
            if (baseRef.id !== "utc" && invokeDep("isCurrentGroupUtcRowVisible")) {
                const insertIndex = Math.min(
                    Math.max(Number(invokeDep("getCurrentGroupUtcRowOrder")) || 0, 0),
                    rowsToRender.length
                );
                const utcRef = invokeDep("getUTCRef");
                if (utcRef && typeof utcRef === "object") {
                    rowsToRender.splice(insertIndex, 0, utcRef);
                }
            }
            return [baseRef, ...rowsToRender];
        }

        function getTimelineSourceDate(slotIdx, baseRef) {
            if (invokeDep("isFixedTimeTab")) {
                const anchorDate = getGlobalTime(0) || new Date();
                const resolved = invokeDep("resolveFixedTimeTimelineSourceDate", slotIdx, baseRef, anchorDate);
                if (isValidDate(resolved)) return resolved;
            }
            return getGlobalTime(slotIdx) || new Date();
        }

        function getTimelineBaseLocalContext(slotIdx, baseRef) {
            const sourceDate = getTimelineSourceDate(slotIdx, baseRef);
            const fixedOffsetMinutes = invokeDep("getFixedOffsetForDisplayAtDate", baseRef, sourceDate);
            const parts = invokeDep("getLocalPartsByTimezone", sourceDate, baseRef, fixedOffsetMinutes);
            if (!parts || typeof parts !== "object") {
                return {
                    sourceDate,
                    fixedOffsetMinutes,
                    parts: {
                        year: sourceDate.getUTCFullYear(),
                        month: sourceDate.getUTCMonth() + 1,
                        day: sourceDate.getUTCDate(),
                        hour: sourceDate.getUTCHours(),
                        minute: sourceDate.getUTCMinutes(),
                        second: sourceDate.getUTCSeconds()
                    }
                };
            }
            return { sourceDate, fixedOffsetMinutes, parts };
        }

        function getTimelineHourRatio(slotIdx, baseRef) {
            const { parts } = getTimelineBaseLocalContext(slotIdx, baseRef);
            const totalSeconds = (parts.hour * 3600) + (parts.minute * 60) + parts.second;
            if (totalSeconds <= 0) return 0;
            if (totalSeconds >= (TIMELINE_TOTAL_SECONDS - 1)) return 1;
            return clampNumber(totalSeconds / TIMELINE_TOTAL_SECONDS, 0, 1);
        }

        function getTimelineBaseDayStartUtc(slotIdx, baseRef) {
            const { fixedOffsetMinutes, parts } = getTimelineBaseLocalContext(slotIdx, baseRef);
            const dayStartParts = {
                year: parts.year,
                month: parts.month,
                day: parts.day,
                hour: 0,
                minute: 0,
                second: 0
            };
            const resolved = invokeDep("getUTCDateFromLocalParts", dayStartParts, baseRef, fixedOffsetMinutes);
            return isValidDate(resolved) ? resolved : new Date();
        }

        function getTimelineRatioFromClientX(trackBody, clientX) {
            const boxRow = trackBody?.querySelector?.(".timeline-box-row");
            if (!boxRow) return 0;
            const rect = boxRow.getBoundingClientRect();
            if (!(rect.width > 0)) return 0;
            const clamped = clampNumber(clientX - rect.left, 0, rect.width);
            return clampNumber(clamped / rect.width, 0, 1);
        }

        function positionTimelineIndicator(trackBody, indicatorEl, ratio) {
            if (!trackBody || !indicatorEl) return false;
            const boxRow = trackBody.querySelector?.(".timeline-box-row");
            if (!boxRow) return false;
            const width = boxRow.clientWidth;
            if (!(width > 0)) return false;
            const rawLeft = boxRow.offsetLeft + (width * clampNumber(ratio, 0, 1));
            const minLeft = boxRow.offsetLeft;
            const maxLeft = boxRow.offsetLeft + width;
            const left = clampNumber(rawLeft, minLeft, maxLeft);
            indicatorEl.style.left = `${Math.round(left)}px`;
            return true;
        }

        function applyTimelineRatioToSlot(slotIdx, ratio, baseRef, options = {}) {
            if (getIsRealtime()) return;
            const safeOptions = (options && typeof options === "object") ? options : {};
            const shouldRender = safeOptions.render !== false;
            const shouldPersist = safeOptions.persist !== false;

            if (invokeDep("isFixedTimeTab")) {
                const applied = invokeDep("applyFixedTimeSlotTimelineRatio", slotIdx, ratio);
                if (!applied) return;
                if (shouldRender) invokeDep("updateClocks");
                if (shouldPersist) invokeDep("savePersistence");
                return;
            }

            const sourceDate = getGlobalTime(slotIdx) || new Date();
            const fixedOffsetMinutes = invokeDep("getFixedOffsetForDisplayAtDate", baseRef, sourceDate);
            const parts = invokeDep("getLocalPartsByTimezone", sourceDate, baseRef, fixedOffsetMinutes);
            if (!parts || typeof parts !== "object") return;

            const totalSeconds = Math.min(
                TIMELINE_TOTAL_SECONDS - 1,
                Math.max(0, Math.round(clampNumber(ratio, 0, 1) * TIMELINE_TOTAL_SECONDS))
            );
            parts.hour = Math.floor(totalSeconds / 3600);
            parts.minute = Math.floor((totalSeconds % 3600) / 60);
            parts.second = totalSeconds % 60;

            const nextUtcDate = invokeDep("getUTCDateFromLocalParts", parts, baseRef, fixedOffsetMinutes);
            if (!setGlobalTime(slotIdx, nextUtcDate)) return;

            if (shouldRender) {
                invokeDep("updateClocks");
            }
        }

        function bindTimelineDrag(trackBody, indicatorEl, slotIdx, baseRef, dragHandleEl = trackBody) {
            if (!isElementLike(trackBody) || !isElementLike(indicatorEl)) return;
            const pointerSource = isElementLike(dragHandleEl) ? dragHandleEl : trackBody;
            const pointerEventTarget = (typeof globalObj.addEventListener === "function")
                ? globalObj
                : trackBody;
            const captureEl = (pointerSource && typeof pointerSource.setPointerCapture === "function")
                ? pointerSource
                : trackBody;

            pointerSource.addEventListener("pointerdown", (event) => {
                const pointerType = String(event.pointerType || "mouse").toLowerCase();
                const isMouseLike = pointerType === "mouse" || pointerType === "";
                if (getIsRealtime()) return;
                if (event.isPrimary === false) return;
                if (isMouseLike && event.button !== 0) return;
                event.preventDefault();
                stopTimelineDrag();

                const state = {
                    trackBody,
                    indicatorEl,
                    slotIdx,
                    baseRef,
                    pointerId: event.pointerId,
                    pointerEventTarget,
                    captureEl,
                    applyOnMove: true,
                    pendingRatio: null,
                    lastRatio: null,
                    rafId: 0,
                    onPointerMove: null,
                    onPointerUp: null,
                    onPointerCancel: null
                };

                const renderPendingRatio = () => {
                    state.rafId = 0;
                    if (state.pendingRatio === null) return;
                    state.lastRatio = state.pendingRatio;
                    positionTimelineIndicator(state.trackBody, state.indicatorEl, state.pendingRatio);
                    applyTimelineRatioToSlot(state.slotIdx, state.pendingRatio, state.baseRef, {
                        render: state.applyOnMove,
                        persist: false
                    });
                };

                const queueRatioRender = (clientX) => {
                    state.pendingRatio = getTimelineRatioFromClientX(state.trackBody, clientX);
                    if (state.rafId) return;
                    state.rafId = requestUiFrame(renderPendingRatio);
                };

                state.onPointerMove = (moveEvent) => {
                    if (moveEvent.pointerId !== state.pointerId) return;
                    moveEvent.preventDefault();
                    queueRatioRender(moveEvent.clientX);
                };

                state.onPointerCancel = (cancelEvent) => {
                    if (cancelEvent.pointerId !== state.pointerId) return;
                    stopTimelineDrag();
                };

                state.onPointerUp = (upEvent) => {
                    if (upEvent.pointerId !== state.pointerId) return;
                    upEvent.preventDefault();
                    if (state.rafId) {
                        cancelUiFrame(state.rafId);
                        renderPendingRatio();
                    }
                    const finalRatio = (state.pendingRatio !== null)
                        ? state.pendingRatio
                        : ((state.lastRatio !== null) ? state.lastRatio : getTimelineRatioFromClientX(state.trackBody, upEvent.clientX));
                    stopTimelineDrag();
                    applyTimelineRatioToSlot(state.slotIdx, finalRatio, state.baseRef, {
                        render: true,
                        persist: true
                    });
                };

                timelineDragState = state;
                queueRatioRender(event.clientX);

                if (pointerEventTarget && typeof pointerEventTarget.addEventListener === "function") {
                    pointerEventTarget.addEventListener("pointermove", state.onPointerMove);
                    pointerEventTarget.addEventListener("pointerup", state.onPointerUp);
                    pointerEventTarget.addEventListener("pointercancel", state.onPointerCancel);
                }
                if (captureEl && typeof captureEl.setPointerCapture === "function") {
                    try {
                        captureEl.setPointerCapture(state.pointerId);
                    } catch (_err) {
                        // Ignore pointer capture failures for unsupported environments.
                    }
                }
            });
        }

        function createTimelineAxisTrack(doc) {
            const axisTrack = doc.createElement("div");
            axisTrack.className = "timeline-axis-track";
            for (let hour = 0; hour <= TIMELINE_TOTAL_HOURS; hour += 3) {
                const tick = doc.createElement("span");
                tick.className = "timeline-axis-mark";
                if (hour === TIMELINE_TOTAL_HOURS) tick.classList.add("last");
                tick.style.left = `${(hour / TIMELINE_TOTAL_HOURS) * 100}%`;
                tick.textContent = String(hour === TIMELINE_TOTAL_HOURS ? 0 : hour);
                axisTrack.appendChild(tick);
            }
            return axisTrack;
        }

        function createTimelineRow(doc, slotIdx, tz, baseDayStartUtcMs) {
            const row = doc.createElement("div");
            row.className = "timeline-timezone-row";

            const labelEl = doc.createElement("div");
            labelEl.className = "timeline-label";
            labelEl.textContent = invokeDep("getZoneDisplayName", tz) || "";
            row.appendChild(labelEl);

            const boxRow = doc.createElement("div");
            boxRow.className = "timeline-box-row";
            for (let hourIdx = 0; hourIdx < TIMELINE_TOTAL_HOURS; hourIdx++) {
                const utcMs = baseDayStartUtcMs + (hourIdx * 60 * 60 * 1000);
                const utcPoint = new Date(utcMs);
                const fixedOffsetMinutes = invokeDep("getFixedOffsetForDisplayAtDate", tz, utcPoint);
                const localParts = invokeDep("getLocalPartsByTimezone", utcPoint, tz, fixedOffsetMinutes);
                const localHour = Number(localParts?.hour) || 0;
                const isDay = (localHour >= 6 && localHour < 18);

                const box = doc.createElement("div");
                box.className = `timeline-hour-box ${isDay ? "day" : "night"}`;

                const isDayBoundary = localHour === 6 || localHour === 17;
                const isNightBoundary = localHour === 18 || localHour === 5;
                if (isDayBoundary || isNightBoundary) {
                    const icon = doc.createElement("span");
                    icon.className = "timeline-hour-icon";
                    icon.textContent = isDayBoundary ? "\u2600\uFE0F" : "\uD83C\uDF19";
                    box.appendChild(icon);
                }

                boxRow.appendChild(box);
            }

            row.appendChild(boxRow);
            return row;
        }

        function getFixedTimeTimelineIndicatorColor(slotIdx) {
            const palette = ["#ff4d4d", "#3b82f6", "#14b8a6", "#f59e0b", "#a855f7"];
            return palette[slotIdx % palette.length];
        }

        function getFixedTimeTimelineIndicatorLabel(slot, slotIdx, slotCount = 1) {
            const label = invokeDep("getFixedTimeSlotTimelineLabel", slot, slotIdx, slotCount);
            if (typeof label === "string" && label.trim()) return label.trim();
            return String(slotIdx + 1);
        }

        function getTimelineIndicatorLabel(slotIdx) {
            const currentMainTab = getCurrentMainTab();
            const showRangeLabels = currentMainTab === "fixed" && !getIsRealtime() && getSlotCount() > 1;
            if (showRangeLabels) {
                return translate(slotIdx === 0 ? "th_time_day_start" : "th_time_day_end");
            }
            return translate("th_time_day_main");
        }

        function appendFixedTimeTimelineIndicators(doc, trackBody, baseRef) {
            const slots = asArray(invokeDep("getFixedTimeTimelineSlots"));
            const slotCount = slots.length;

            if (!getIsRealtime()) trackBody.classList.add("draggable");
            for (let slotIdx = 0; slotIdx < slotCount; slotIdx++) {
                const slot = slots[slotIdx];
                const indicator = doc.createElement("div");
                indicator.className = "timeline-indicator fixed-slot";
                indicator.dataset.slot = String(slotIdx);

                const color = getFixedTimeTimelineIndicatorColor(slotIdx);
                indicator.style.background = color;
                indicator.style.color = color;
                const offsetPx = (slotIdx - ((slotCount - 1) / 2)) * 3;
                indicator.style.marginLeft = `${Math.round(offsetPx)}px`;

                const label = doc.createElement("span");
                label.className = "timeline-indicator-label";
                label.textContent = getFixedTimeTimelineIndicatorLabel(slot, slotIdx, slotCount);
                indicator.appendChild(label);

                trackBody.appendChild(indicator);
                if (!getIsRealtime()) {
                    bindTimelineDrag(trackBody, indicator, slotIdx, baseRef, indicator);
                }
            }
        }

        function createTimelinePanel(doc, slotIdx, baseRef, rows, panelCount) {
            const panel = doc.createElement("section");
            panel.className = "timeline-panel";

            const currentMainTab = getCurrentMainTab();
            if (panelCount > 1 && !invokeDep("isFixedTimeTab") && currentMainTab !== "fixed") {
                const title = doc.createElement("h3");
                title.className = `timeline-panel-title ${slotIdx === 0 ? "start" : "end"}`;
                title.textContent = translate(slotIdx === 0 ? "th_time_day_start" : "th_time_day_end");
                panel.appendChild(title);
            }

            const scroll = doc.createElement("div");
            scroll.className = "timeline-scroll";

            const grid = doc.createElement("div");
            grid.className = "timeline-grid";

            const axisRow = doc.createElement("div");
            axisRow.className = "timeline-axis-row";

            const axisSpacer = doc.createElement("div");
            axisSpacer.className = "timeline-label timeline-axis-spacer";
            axisRow.appendChild(axisSpacer);
            axisRow.appendChild(createTimelineAxisTrack(doc));

            const trackBody = doc.createElement("div");
            trackBody.className = "timeline-track-body";

            const baseDayStartUtc = getTimelineBaseDayStartUtc(slotIdx, baseRef);
            const baseDayStartUtcMs = baseDayStartUtc.getTime();
            rows.forEach((tz) => {
                trackBody.appendChild(createTimelineRow(doc, slotIdx, tz, baseDayStartUtcMs));
            });

            if (invokeDep("isFixedTimeTab")) {
                appendFixedTimeTimelineIndicators(doc, trackBody, baseRef);
            } else {
                const indicator = doc.createElement("div");
                indicator.className = `timeline-indicator ${slotIdx === 0 ? "start" : "end"}`;

                const indicatorLabel = doc.createElement("span");
                indicatorLabel.className = "timeline-indicator-label";
                indicatorLabel.textContent = getTimelineIndicatorLabel(slotIdx);
                indicator.appendChild(indicatorLabel);

                trackBody.appendChild(indicator);

                if (!getIsRealtime()) {
                    trackBody.classList.add("draggable");
                    bindTimelineDrag(trackBody, indicator, slotIdx, baseRef, indicator);
                }
            }

            grid.appendChild(axisRow);
            grid.appendChild(trackBody);
            scroll.appendChild(grid);
            panel.appendChild(scroll);

            return panel;
        }

        function getTimelineRenderKey(baseRef, rows, panelCount) {
            const fixedTimeMode = !!invokeDep("isFixedTimeTab");
            const fixedSlotCount = Number(invokeDep("getFixedTimeTimelineSlotCount"));
            const slotKeyCount = fixedTimeMode && Number.isFinite(fixedSlotCount) ? fixedSlotCount : panelCount;
            const slotDayKeys = [];
            for (let slotIdx = 0; slotIdx < slotKeyCount; slotIdx++) {
                const ctx = getTimelineBaseLocalContext(slotIdx, baseRef);
                const pad = invokeDep("pad");
                const monthText = (typeof pad === "function") ? pad(ctx.parts.month) : String(ctx.parts.month).padStart(2, "0");
                const dayText = (typeof pad === "function") ? pad(ctx.parts.day) : String(ctx.parts.day).padStart(2, "0");
                slotDayKeys.push(`${ctx.parts.year}-${monthText}-${dayText}`);
            }

            const fixedIndicatorToken = fixedTimeMode ? String(invokeDep("getFixedTimeTimelineIndicatorToken") || "") : "";

            const rowKeys = rows.map((tz) => {
                const sourceDate = getGlobalTime(0) || new Date();
                const fixedOffsetMinutes = invokeDep("getFixedOffsetForDisplayAtDate", tz, sourceDate);
                const offsetToken = Number.isFinite(fixedOffsetMinutes) ? String(fixedOffsetMinutes) : "auto";
                return `${tz.id}:${offsetToken}`;
            });

            return [
                getCurrentMainTab(),
                panelCount,
                baseRef.id,
                invokeDep("getCurrentLang"),
                invokeDep("getCurrentTheme"),
                rowKeys.join(","),
                slotDayKeys.join("|"),
                fixedIndicatorToken
            ].join("::");
        }

        function refreshTimelineIndicators(frame, baseRef, panelCount) {
            if (invokeDep("isFixedTimeTab")) {
                const panel = frame.querySelector?.('.timeline-panel[data-slot="0"]');
                const trackBody = panel?.querySelector?.(".timeline-track-body");
                if (!panel || !trackBody) return false;
                const slotCount = Number(invokeDep("getFixedTimeTimelineSlotCount"));
                if (!Number.isFinite(slotCount) || slotCount <= 0) return false;

                let hasPositioned = false;
                for (let slotIdx = 0; slotIdx < slotCount; slotIdx++) {
                    const indicator = panel.querySelector?.(`.timeline-indicator[data-slot="${slotIdx}"]`);
                    if (!indicator) continue;
                    const positioned = positionTimelineIndicator(trackBody, indicator, getTimelineHourRatio(slotIdx, baseRef));
                    hasPositioned = hasPositioned || positioned;
                }
                return hasPositioned;
            }

            let hasPositioned = false;
            for (let slotIdx = 0; slotIdx < panelCount; slotIdx++) {
                const panel = frame.querySelector?.(`.timeline-panel[data-slot="${slotIdx}"]`);
                if (!panel) continue;
                const trackBody = panel.querySelector?.(".timeline-track-body");
                const indicator = panel.querySelector?.(".timeline-indicator");
                if (!trackBody || !indicator) continue;
                const positioned = positionTimelineIndicator(trackBody, indicator, getTimelineHourRatio(slotIdx, baseRef));
                hasPositioned = hasPositioned || positioned;
            }
            return hasPositioned;
        }

        function scheduleTimelineIndicatorRefresh(frame, baseRef, panelCount, renderKey) {
            const refreshIfCurrent = () => {
                if (!frame?.isConnected) return false;
                if ((frame.getAttribute("data-render-key") || "") !== renderKey) return false;
                return refreshTimelineIndicators(frame, baseRef, panelCount);
            };

            requestUiFrame(() => {
                const positioned = refreshIfCurrent();
                if (positioned) return;
                requestUiFrame(() => {
                    refreshIfCurrent();
                });
            });
        }

        function renderTimelineFrame() {
            const frame = invokeDep("getTimelineFrameElement");
            if (!frame) return;

            if (!shouldRenderTimeline()) {
                stopTimelineDrag();
                frame.removeAttribute("data-render-key");
                frame.style.display = "none";
                frame.textContent = "";
                return;
            }

            const doc = frame.ownerDocument || (typeof document === "object" ? document : null);
            if (!doc || typeof doc.createElement !== "function") return;

            const baseRef = invokeDep("getBaseTimezoneRef");
            if (!baseRef || typeof baseRef !== "object") return;
            const rows = getTimelineRows(baseRef);
            const panelCount = getTimelinePanelCount();
            const nextRenderKey = getTimelineRenderKey(baseRef, rows, panelCount);
            const currentRenderKey = frame.getAttribute("data-render-key") || "";

            if (getIsRealtime()) {
                frame.classList.add("is-realtime");
            } else {
                frame.classList.remove("is-realtime");
            }

            frame.style.display = "block";
            if (currentRenderKey === nextRenderKey) {
                const positioned = refreshTimelineIndicators(frame, baseRef, panelCount);
                if (!positioned) {
                    scheduleTimelineIndicatorRefresh(frame, baseRef, panelCount, nextRenderKey);
                }
                return;
            }

            stopTimelineDrag();
            frame.textContent = "";

            const panels = doc.createElement("div");
            panels.className = `timeline-panels${panelCount > 1 ? " dual" : ""}`;

            for (let slotIdx = 0; slotIdx < panelCount; slotIdx++) {
                const panel = createTimelinePanel(doc, slotIdx, baseRef, rows, panelCount);
                panel.dataset.slot = String(slotIdx);
                panels.appendChild(panel);
            }

            frame.setAttribute("data-render-key", nextRenderKey);
            frame.appendChild(panels);
            const positioned = refreshTimelineIndicators(frame, baseRef, panelCount);
            if (!positioned) {
                scheduleTimelineIndicatorRefresh(frame, baseRef, panelCount, nextRenderKey);
            }
        }

        return Object.freeze({
            shouldRenderTimeline,
            stopTimelineDrag,
            applyTimelineRatioToSlot,
            getTimelineIndicatorLabel,
            getTimelinePanelCount,
            renderTimelineFrame
        });
    }

    globalObj.GTVTimelineFrame = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/fixed-time-core.js ---
(function initGtvFixedTimeCore(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (err) {
                console.warn(`[GTVFixedTimeCore] Dependency "${name}" threw.`, err);
                return undefined;
            }
        }

        function isValidDate(value) {
            return value instanceof Date && Number.isFinite(value.getTime());
        }

        function pad2(value) {
            const padFn = safeDeps.pad;
            if (typeof padFn === "function") return padFn(value);
            return String(Math.trunc(Number(value) || 0)).padStart(2, "0");
        }

        function getCurrentLang() {
            const lang = invokeDep("getCurrentLang");
            return (typeof lang === "string" && lang) ? lang : "en";
        }

        function normalizeDayNightMarker(marker) {
            const raw = String(marker || "").trim();
            if (!raw) return "";
            const normalized = raw.toUpperCase();
            if (normalized === "DAY" || raw === "\u2600\uFE0F") return "DAY";
            if (normalized === "NIGHT" || normalized === "MOON" || raw === "\uD83C\uDF19") return "NIGHT";
            return "";
        }

        function getDayNightGlyph(marker) {
            const normalized = normalizeDayNightMarker(marker);
            if (normalized === "DAY") return "\u2600\uFE0F";
            if (normalized === "NIGHT") return "\uD83C\uDF19";
            return String(marker || "");
        }

        function getLocalizedWeekdayNameByIndex(weekdayIndex) {
            const i18nData = (safeDeps.I18N_DATA && typeof safeDeps.I18N_DATA === "object")
                ? safeDeps.I18N_DATA
                : {};
            const days = i18nData[getCurrentLang()]?.days || i18nData.en?.days || [];
            return days[weekdayIndex] || "";
        }

        function getFixedTimeSlotParts(slot) {
            const defaultValue = String(safeDeps.DEFAULT_FIXED_TIME_VALUE || "09:00");
            const safeTime = invokeDep("sanitizeFixedTimeValue", slot?.time, defaultValue) || defaultValue;
            const [hourText, minuteText] = String(safeTime).split(":");
            const hour = parseInt(hourText, 10);
            const minute = parseInt(minuteText, 10);
            if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
            return { hour, minute };
        }

        function resolveFixedTimeSlotUtcDate(slot, baseRef, anchorDate = new Date()) {
            if (!slot || !baseRef) return null;
            const slotParts = getFixedTimeSlotParts(slot);
            if (!slotParts) return null;

            const safeAnchor = isValidDate(anchorDate) ? anchorDate : new Date();
            try {
                const baseOffset = invokeDep("getFixedOffsetForDisplayAtDate", baseRef, safeAnchor);
                const baseLocal = invokeDep("getLocalPartsByTimezone", safeAnchor, baseRef, baseOffset);
                const fixedDateParts = invokeDep("getFixedDateParts");
                const year = Number.isFinite(fixedDateParts?.year) ? fixedDateParts.year : baseLocal.year;
                const month = Number.isFinite(fixedDateParts?.month) ? fixedDateParts.month : baseLocal.month;
                const day = Number.isFinite(fixedDateParts?.day) ? fixedDateParts.day : baseLocal.day;
                const utcDate = invokeDep("getUTCDateFromLocalParts", {
                    year,
                    month,
                    day,
                    hour: slotParts.hour,
                    minute: slotParts.minute,
                    second: 0
                }, baseRef, baseOffset);
                if (!isValidDate(utcDate)) return null;
                return utcDate;
            } catch (_err) {
                return null;
            }
        }

        function buildFixedTimeDisplayPayloadAtUtc(utcDate, tz) {
            if (!isValidDate(utcDate) || !tz) return null;
            try {
                const fixedOffsetMinutes = invokeDep("getFixedOffsetForDisplayAtDate", tz, utcDate);
                const localParts = invokeDep("getLocalPartsByTimezone", utcDate, tz, fixedOffsetMinutes);
                const weekdayIndex = new Date(Date.UTC(
                    localParts.year,
                    Math.max(0, localParts.month - 1),
                    localParts.day
                )).getUTCDay();
                const dayNightMarker = (localParts.hour >= 6 && localParts.hour <= 18) ? "DAY" : "NIGHT";
                return {
                    clock: `${pad2(localParts.hour)}:${pad2(localParts.minute)}:${pad2(localParts.second)}`,
                    dayNightMarker,
                    dayNightGlyph: getDayNightGlyph(dayNightMarker),
                    dayName: getLocalizedWeekdayNameByIndex(weekdayIndex),
                    weekdayIndex
                };
            } catch (_err) {
                return null;
            }
        }

        function formatFixedTimeForTimezoneAtUtc(utcDate, tz) {
            const payload = buildFixedTimeDisplayPayloadAtUtc(utcDate, tz);
            return payload ? payload.clock : "--:--:--";
        }

        function getFixedTimeDisplayPartsEnabled() {
            const safe = invokeDep(
                "sanitizeTimePartsEnabledForContext",
                invokeDep("getDisplayTimePartsEnabled"),
                "display",
                "fixed-time"
            );
            return {
                dn: !!safe?.dn,
                time: !!safe?.time,
                weekday: !!safe?.weekday
            };
        }

        function getFixedTimeSlotHeaderLabel(slot, slotIdx, slotCount = 1) {
            const defaultName = invokeDep("getDefaultFixedTimeName");
            const safeName = invokeDep("sanitizeFixedTimeName", slot?.name, defaultName);
            const fixedLabel = String(invokeDep("t", "th_fixed_time") || "Fixed Time");
            if (safeName === defaultName && slotCount > 1) {
                return `${fixedLabel} ${slotIdx + 1}`;
            }
            return safeName || `${fixedLabel} ${slotIdx + 1}`;
        }

        function getFixedTimeTimelineIndicatorColor(slotIdx) {
            const palette = ["#ff4d4d", "#3b82f6", "#14b8a6", "#f59e0b", "#a855f7"];
            return palette[slotIdx % palette.length];
        }

        return Object.freeze({
            normalizeDayNightMarker,
            getDayNightGlyph,
            getLocalizedWeekdayNameByIndex,
            getFixedTimeSlotParts,
            resolveFixedTimeSlotUtcDate,
            formatFixedTimeForTimezoneAtUtc,
            getFixedTimeDisplayPartsEnabled,
            buildFixedTimeDisplayPayloadAtUtc,
            getFixedTimeSlotHeaderLabel,
            getFixedTimeTimelineIndicatorColor
        });
    }

    globalObj.GTVFixedTimeCore = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/fixed-time-slot-utils.js ---
(function initGtvFixedTimeSlotUtils(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (_err) {
                return undefined;
            }
        }

        function getNumberConstant(name, fallback) {
            const parsed = Number(safeDeps[name]);
            if (!Number.isFinite(parsed)) return fallback;
            return Math.trunc(parsed);
        }

        function getMinSlotCount() {
            return Math.max(1, getNumberConstant("MIN_FIXED_TIME_SLOT_COUNT", 1));
        }

        function getMaxSlotCount() {
            const min = getMinSlotCount();
            return Math.max(min, getNumberConstant("MAX_FIXED_TIME_SLOT_COUNT", 5));
        }

        function getDefaultFixedTimeValue() {
            const raw = safeDeps.DEFAULT_FIXED_TIME_VALUE;
            return (typeof raw === "string" && raw.trim()) ? raw.trim() : "09:00";
        }

        function pad2(value) {
            if (typeof safeDeps.pad === "function") return safeDeps.pad(value);
            return String(Math.trunc(Number(value) || 0)).padStart(2, "0");
        }

        function getDefaultFixedTimeName() {
            const translated = invokeDep("t", "label_fixed_time_default");
            return (typeof translated === "string" && translated.trim()) ? translated.trim() : "Fixed Time";
        }

        function getDefaultFixedDate(anchorDate = new Date()) {
            const safeDate = (anchorDate instanceof Date && Number.isFinite(anchorDate.getTime())) ? anchorDate : new Date();
            return `${safeDate.getFullYear()}-${pad2(safeDate.getMonth() + 1)}-${pad2(safeDate.getDate())}`;
        }

        function getDefaultFixedTimes() {
            return [{
                id: "",
                name: getDefaultFixedTimeName(),
                time: getDefaultFixedTimeValue()
            }];
        }

        function sanitizeFixedTimeSlotCount(value) {
            const parsed = parseInt(value, 10);
            if (!Number.isFinite(parsed)) return getMinSlotCount();
            return Math.min(getMaxSlotCount(), Math.max(getMinSlotCount(), parsed));
        }

        function sanitizeFixedTimeId(value) {
            if (typeof value !== "string") return "";
            const trimmed = value.trim();
            if (!trimmed) return "";
            return trimmed.slice(0, 40);
        }

        function sanitizeFixedTimeName(value, fallback = getDefaultFixedTimeName()) {
            const text = (typeof value === "string") ? value.trim() : "";
            if (!text) return fallback;
            return text.slice(0, 40);
        }

        function sanitizeFixedTimeValue(value, fallback = getDefaultFixedTimeValue()) {
            const source = (typeof value === "string") ? value.trim() : "";
            const match = source.match(/^(\d{1,2}):(\d{1,2})$/);
            if (!match) return fallback;
            const hour = parseInt(match[1], 10);
            const minute = parseInt(match[2], 10);
            if (!Number.isFinite(hour) || !Number.isFinite(minute)) return fallback;
            if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return fallback;
            return `${pad2(hour)}:${pad2(minute)}`;
        }

        function sanitizeFixedDateValue(value, fallback = "") {
            const source = (typeof value === "string") ? value.trim() : "";
            if (!source) return fallback;
            const parseDateTimeParts = safeDeps.parseDateTimeParts;
            if (typeof parseDateTimeParts !== "function") return fallback;

            const parsed = parseDateTimeParts(source, "date");
            if (!Array.isArray(parsed) || parsed.length < 3) return fallback;
            const year = parseInt(parsed[0], 10);
            const month = parseInt(parsed[1], 10);
            const day = parseInt(parsed[2], 10);
            if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return fallback;

            const strictDate = invokeDep("buildStrictUtcDateFromParts", {
                year,
                month,
                day,
                hour: 0,
                minute: 0,
                second: 0
            });
            if (!(strictDate instanceof Date) || !Number.isFinite(strictDate.getTime())) return fallback;
            return `${String(year).padStart(4, "0")}-${pad2(month)}-${pad2(day)}`;
        }

        function createDefaultFixedTimeSlot(id = "") {
            return {
                id: sanitizeFixedTimeId(id),
                name: getDefaultFixedTimeName(),
                time: getDefaultFixedTimeValue()
            };
        }

        function getFixedDatePartsFromGroup(group = invokeDep("getCurrentGroup")) {
            if (!group || typeof group !== "object") return null;
            const fixedDate = sanitizeFixedDateValue(group.fixedDate, "");
            if (!fixedDate) return null;

            const parseDateTimeParts = safeDeps.parseDateTimeParts;
            if (typeof parseDateTimeParts !== "function") return null;
            const parsed = parseDateTimeParts(fixedDate, "date");
            if (!Array.isArray(parsed) || parsed.length < 3) return null;

            const year = parseInt(parsed[0], 10);
            const month = parseInt(parsed[1], 10);
            const day = parseInt(parsed[2], 10);
            if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null;
            return { year, month, day };
        }

        function sanitizeFixedTimes(rawFixedTimes) {
            const source = Array.isArray(rawFixedTimes) ? rawFixedTimes : [];
            const sanitized = [];
            const seenIds = new Set();
            let localSeed = 0;
            const nextId = () => {
                let candidate = "";
                do {
                    localSeed += 1;
                    candidate = `ft-${localSeed}`;
                } while (seenIds.has(candidate));
                return candidate;
            };

            source.forEach((item) => {
                if (!item || typeof item !== "object") return;
                if (sanitized.length >= getMaxSlotCount()) return;

                let id = sanitizeFixedTimeId(item.id);
                if (!id || seenIds.has(id)) {
                    id = nextId();
                }
                seenIds.add(id);

                sanitized.push({
                    id,
                    name: sanitizeFixedTimeName(item.name, getDefaultFixedTimeName()),
                    time: sanitizeFixedTimeValue(item.time, getDefaultFixedTimeValue())
                });
            });

            while (sanitized.length < getMinSlotCount()) {
                const id = nextId();
                seenIds.add(id);
                const defaultSlot = createDefaultFixedTimeSlot(id);
                defaultSlot.id = id;
                sanitized.push(defaultSlot);
            }

            return sanitized;
        }

        function ensureGroupFixedTimes(group) {
            if (!group || typeof group !== "object") return;
            group.fixedTimes = sanitizeFixedTimes(group.fixedTimes);
            group.fixedDate = sanitizeFixedDateValue(group.fixedDate, "");
        }

        function createUniqueFixedTimeId(group = invokeDep("getCurrentGroup")) {
            const existingIds = new Set(
                (Array.isArray(group && group.fixedTimes) ? group.fixedTimes : [])
                    .map((item) => sanitizeFixedTimeId(item && item.id))
                    .filter(Boolean)
            );

            let candidate = "";
            do {
                const nextSeed = invokeDep("getNextFixedTimeSeed");
                const parsedSeed = Number(nextSeed);
                const suffix = Number.isFinite(parsedSeed) ? Math.trunc(parsedSeed) : Date.now();
                candidate = `ft-${suffix}`;
            } while (existingIds.has(candidate));

            return candidate;
        }

        return Object.freeze({
            getDefaultFixedTimeName,
            getDefaultFixedDate,
            getDefaultFixedTimes,
            sanitizeFixedTimeSlotCount,
            createDefaultFixedTimeSlot,
            sanitizeFixedTimeId,
            sanitizeFixedTimeName,
            sanitizeFixedTimeValue,
            sanitizeFixedDateValue,
            getFixedDatePartsFromGroup,
            sanitizeFixedTimes,
            ensureGroupFixedTimes,
            createUniqueFixedTimeId
        });
    }

    globalObj.GTVFixedTimeSlotUtils = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/fixed-time-state.js ---
(function initGtvFixedTimeState(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (_err) {
                return undefined;
            }
        }

        function getMinSlotCount() {
            const parsed = Number(safeDeps.MIN_FIXED_TIME_SLOT_COUNT);
            return Number.isFinite(parsed) ? Math.max(1, Math.trunc(parsed)) : 1;
        }

        function getMaxSlotCount() {
            const parsed = Number(safeDeps.MAX_FIXED_TIME_SLOT_COUNT);
            return Number.isFinite(parsed) ? Math.max(getMinSlotCount(), Math.trunc(parsed)) : 5;
        }

        function getFixedTimeSlotCount(group = invokeDep("getCurrentGroup")) {
            const safeGroup = (group && typeof group === "object") ? group : null;
            if (!safeGroup) return getMinSlotCount();
            invokeDep("ensureGroupFixedTimes", safeGroup);
            const sanitizeCount = invokeDep("sanitizeFixedTimeSlotCount", safeGroup.fixedTimes?.length);
            return Number.isFinite(sanitizeCount) ? sanitizeCount : getMinSlotCount();
        }

        function setCurrentGroupFixedDate(rawValue, options = {}) {
            const { persist = true, rerender = true } = options;
            const group = invokeDep("getCurrentGroup");
            if (!group) return false;
            invokeDep("ensureGroupFixedTimes", group);
            const nextDate = invokeDep("sanitizeFixedDateValue", rawValue, group.fixedDate || "");
            if (group.fixedDate === nextDate) return false;
            group.fixedDate = nextDate;
            if (rerender && invokeDep("isFixedTimeTab")) {
                invokeDep("renderFixedTimeTab");
                invokeDep("renderTimelineFrame");
            }
            if (persist) invokeDep("savePersistence");
            return true;
        }

        function refreshFixedTimeSlotCountControls() {
            const group = invokeDep("getCurrentGroup");
            const countInput = document.getElementById("fixed-time-slot-count-input");
            const decreaseBtn = document.getElementById("fixed-time-slot-count-decrease");
            const increaseBtn = document.getElementById("fixed-time-slot-count-increase");
            if (!group) {
                if (countInput) countInput.value = String(getMinSlotCount());
                if (decreaseBtn) decreaseBtn.disabled = true;
                if (increaseBtn) increaseBtn.disabled = true;
                return;
            }

            const count = getFixedTimeSlotCount(group);
            if (countInput) countInput.value = String(count);
            if (decreaseBtn) decreaseBtn.disabled = false;
            if (increaseBtn) increaseBtn.disabled = false;
        }

        function setFixedTimeSlotCount(value, options = {}) {
            const { persist = true, rerender = true, showBoundaryToast = false } = options;
            const group = invokeDep("getCurrentGroup");
            if (!group) return false;
            invokeDep("ensureGroupFixedTimes", group);

            const parsed = parseInt(value, 10);
            const nextCount = invokeDep("sanitizeFixedTimeSlotCount", value);
            if (showBoundaryToast && Number.isFinite(parsed)) {
                if (parsed > getMaxSlotCount()) {
                    invokeDep("showToast", invokeDep("t", "toast_fixed_time_max"), { type: "info" });
                } else if (parsed < getMinSlotCount()) {
                    invokeDep("showToast", invokeDep("t", "toast_fixed_time_min"), { type: "info" });
                }
            }

            const currentCount = getFixedTimeSlotCount(group);
            if (nextCount === currentCount) {
                refreshFixedTimeSlotCountControls();
                if (rerender && invokeDep("isFixedTimeTab")) {
                    invokeDep("renderFixedTimeTab");
                    invokeDep("renderTimelineFrame");
                }
                if (persist) invokeDep("savePersistence");
                return false;
            }

            if (nextCount < currentCount) {
                group.fixedTimes = group.fixedTimes.slice(0, nextCount);
            } else {
                while (group.fixedTimes.length < nextCount) {
                    const nextId = invokeDep("createUniqueFixedTimeId", group);
                    group.fixedTimes.push(invokeDep("createDefaultFixedTimeSlot", nextId));
                }
            }
            invokeDep("ensureGroupFixedTimes", group);
            refreshFixedTimeSlotCountControls();
            if (rerender && invokeDep("isFixedTimeTab")) {
                invokeDep("renderFixedTimeTab");
                invokeDep("renderTimelineFrame");
            }
            if (persist) invokeDep("savePersistence");
            return true;
        }

        return Object.freeze({
            getFixedTimeSlotCount,
            setCurrentGroupFixedDate,
            refreshFixedTimeSlotCountControls,
            setFixedTimeSlotCount
        });
    }

    globalObj.GTVFixedTimeState = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/fixed-time-timeline.js ---
(function initGtvFixedTimeTimeline(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const TIMELINE_TOTAL_SECONDS = Number.isFinite(Number(safeDeps.TIMELINE_TOTAL_SECONDS))
            ? Number(safeDeps.TIMELINE_TOTAL_SECONDS)
            : (24 * 60 * 60);

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (err) {
                console.warn(`[GTVFixedTimeTimeline] Dependency "${name}" threw.`, err);
                return undefined;
            }
        }

        function isValidDate(value) {
            return value instanceof Date && Number.isFinite(value.getTime());
        }

        function clampRatio(value) {
            const clampFn = safeDeps.clampNumber;
            if (typeof clampFn === "function") return clampFn(value, 0, 1);
            const numeric = Number(value);
            if (!Number.isFinite(numeric)) return 0;
            if (numeric < 0) return 0;
            if (numeric > 1) return 1;
            return numeric;
        }

        function pad2(value) {
            const padFn = safeDeps.pad;
            if (typeof padFn === "function") return padFn(value);
            return String(Math.trunc(Number(value) || 0)).padStart(2, "0");
        }

        function resolveFixedTimeTimelineSourceDate(slotIdx, baseRef, anchorDate = undefined) {
            const group = invokeDep("getCurrentGroup");
            if (!group || !baseRef) return null;
            invokeDep("ensureGroupFixedTimes", group);
            const slot = group.fixedTimes?.[slotIdx];
            if (!slot) return null;

            const safeAnchorDate = isValidDate(anchorDate)
                ? anchorDate
                : (isValidDate(invokeDep("getGlobalTime", 0)) ? invokeDep("getGlobalTime", 0) : new Date());
            return invokeDep("resolveFixedTimeSlotUtcDate", slot, baseRef, safeAnchorDate) || null;
        }

        function applyFixedTimeSlotTimelineRatio(slotIdx, ratio) {
            const group = invokeDep("getCurrentGroup");
            if (!group) return false;
            invokeDep("ensureGroupFixedTimes", group);
            const slot = group.fixedTimes?.[slotIdx];
            if (!slot) return false;

            const totalSeconds = Math.min(
                TIMELINE_TOTAL_SECONDS - 1,
                Math.max(0, Math.round(clampRatio(ratio) * TIMELINE_TOTAL_SECONDS))
            );
            const hour = Math.floor(totalSeconds / 3600);
            const minute = Math.floor((totalSeconds % 3600) / 60);
            slot.time = `${pad2(hour)}:${pad2(minute)}`;
            return true;
        }

        function getFixedTimeTimelineSlots() {
            const group = invokeDep("getCurrentGroup");
            if (!group) return [];
            invokeDep("ensureGroupFixedTimes", group);
            return Array.isArray(group.fixedTimes) ? group.fixedTimes : [];
        }

        function getFixedTimeTimelineSlotCount() {
            return invokeDep("getFixedTimeSlotCount", invokeDep("getCurrentGroup"));
        }

        function getFixedTimeTimelineIndicatorToken() {
            const group = invokeDep("getCurrentGroup");
            if (!group) return "";
            invokeDep("ensureGroupFixedTimes", group);
            const defaultName = invokeDep("getDefaultFixedTimeName");
            const slots = Array.isArray(group.fixedTimes) ? group.fixedTimes : [];
            return slots.map((slot, idx) => {
                const id = invokeDep("sanitizeFixedTimeId", slot?.id) || "";
                const name = invokeDep("sanitizeFixedTimeName", slot?.name, defaultName) || "";
                return `${idx}:${id}:${name}`;
            }).join("|");
        }

        function getFixedTimeSlotTimelineLabel(slot, slotIdx, slotCount = 1) {
            return invokeDep("getFixedTimeSlotHeaderLabel", slot, slotIdx, slotCount);
        }

        return Object.freeze({
            resolveFixedTimeTimelineSourceDate,
            applyFixedTimeSlotTimelineRatio,
            getFixedTimeTimelineSlots,
            getFixedTimeTimelineSlotCount,
            getFixedTimeTimelineIndicatorToken,
            getFixedTimeSlotTimelineLabel
        });
    }

    globalObj.GTVFixedTimeTimeline = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);


// --- File: js/modules/fixed-time-actions.js ---
(function initGtvFixedTimeActions(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (err) {
                console.warn(`[GTVFixedTimeActions] Dependency "${name}" threw.`, err);
                return undefined;
            }
        }

        function translate(key) {
            const value = invokeDep("t", key);
            if (typeof value === "string" && value) return value;
            return String(key || "");
        }

        function asArray(value) {
            if (Array.isArray(value)) return value;
            if (value && typeof value[Symbol.iterator] === "function") {
                try {
                    return Array.from(value);
                } catch (_err) {
                    return [];
                }
            }
            return [];
        }

        function getNumberConstant(name, fallback) {
            const parsed = Number(safeDeps[name]);
            return Number.isFinite(parsed) ? parsed : fallback;
        }

        function isValidDate(value) {
            return value instanceof Date && Number.isFinite(value.getTime());
        }

        function formatFixedTimePayloadText(payload, partsEnabled) {
            const safeParts = (partsEnabled && typeof partsEnabled === "object")
                ? partsEnabled
                : { dn: true, time: true, weekday: true };
            const tokens = [];
            if (safeParts.dn && payload?.dayNightGlyph) tokens.push(payload.dayNightGlyph);
            if (safeParts.time) tokens.push(payload?.clock || "--:--:--");
            if (safeParts.weekday && payload?.dayName) tokens.push(payload.dayName);
            if (!tokens.length) return "-";
            return tokens.join(" ");
        }

        function getFixedTimeCopyState() {
            const order = invokeDep("sanitizeCopyFormatOrderForContext", invokeDep("getCopyFormatOrder"), "fixed-time");
            const enabled = invokeDep("sanitizeCopyFormatEnabledForContext", invokeDep("getCopyFormatEnabled"), "copy", "fixed-time");
            const timePartsEnabled = invokeDep("sanitizeTimePartsEnabledForContext", invokeDep("getCopyTimePartsEnabled"), "copy", "fixed-time");
            return { order, enabled, timePartsEnabled };
        }

        function buildFixedTimeSnapshotForTimezoneSlot(tz, slotUtcDate) {
            if (!tz || !isValidDate(slotUtcDate)) return null;
            const fixedDisplayOffsetMinutes = invokeDep("getFixedOffsetForDisplayAtDate", tz, slotUtcDate);
            return invokeDep(
                "buildTimezoneComputedSnapshotForDates",
                tz,
                [slotUtcDate],
                { fixedDisplayOffsetMinutes }
            ) || null;
        }

        function formatFixedTimeCopyTextForTimezoneSlot(tz, slotUtcDate, copyState = null) {
            const safeCopyState = (copyState && typeof copyState === "object")
                ? copyState
                : getFixedTimeCopyState();
            const snapshot = buildFixedTimeSnapshotForTimezoneSlot(tz, slotUtcDate);
            if (!snapshot) return "";
            return invokeDep(
                "formatSnapshotText",
                snapshot,
                safeCopyState.order,
                safeCopyState.enabled,
                safeCopyState.timePartsEnabled
            ) || "";
        }

        function getFixedTimeSlotUtcDateByIndex(slotIdx) {
            if (!Number.isInteger(slotIdx) || slotIdx < 0) return null;
            const group = invokeDep("getCurrentGroup");
            if (!group) return null;
            invokeDep("ensureGroupFixedTimes", group);
            const slot = group.fixedTimes?.[slotIdx];
            if (!slot) return null;
            const baseRef = invokeDep("getBaseTimezoneRef");
            if (!baseRef) return null;
            const anchor = invokeDep("getGlobalTime", 0);
            const anchorDate = isValidDate(anchor) ? anchor : new Date();
            const slotUtcDate = invokeDep("resolveFixedTimeSlotUtcDate", slot, baseRef, anchorDate);
            return isValidDate(slotUtcDate) ? slotUtcDate : null;
        }

        function getFixedTimePreviewCopyText() {
            const baseRef = invokeDep("getBaseTimezoneRef");
            if (!baseRef) return "";
            const slotUtcDate = getFixedTimeSlotUtcDateByIndex(0);
            if (!isValidDate(slotUtcDate)) return "";
            return formatFixedTimeCopyTextForTimezoneSlot(baseRef, slotUtcDate);
        }

        function getAllFixedTimeRowsCopyText() {
            const group = invokeDep("getCurrentGroup");
            const baseRef = invokeDep("getBaseTimezoneRef");
            if (!group || !baseRef) return "";
            invokeDep("ensureGroupFixedTimes", group);
            if (!Array.isArray(group.fixedTimes) || !group.fixedTimes.length) return "";

            const rows = [baseRef, ...asArray(invokeDep("getRenderableTimezoneRows", baseRef))];
            if (!rows.length) return "";

            const copyState = getFixedTimeCopyState();
            const sections = [];
            group.fixedTimes.forEach((slot, slotIdx) => {
                const slotUtcDate = getFixedTimeSlotUtcDateByIndex(slotIdx);
                if (!isValidDate(slotUtcDate)) return;
                const lines = rows
                    .map((tz) => formatFixedTimeCopyTextForTimezoneSlot(tz, slotUtcDate, copyState))
                    .filter(Boolean);
                if (!lines.length) return;
                const slotLabel = invokeDep("getFixedTimeSlotHeaderLabel", slot, slotIdx, group.fixedTimes.length) || "";
                sections.push([`[${slotLabel}]`, ...lines].join("\n"));
            });

            return sections.join("\n\n").trim();
        }

        async function copyFixedTimeCellPayload(payload, partsEnabled) {
            const text = formatFixedTimePayloadText(payload, partsEnabled);
            if (!text) return;
            try {
                await invokeDep("writeClipboard", text);
                invokeDep("showToast", translate("toast_copy_success"), { type: "success" });
            } catch (err) {
                console.error("copyFixedTimeCellPayload failed:", err);
                invokeDep("showToast", translate("toast_copy_failed"), { type: "error" });
            }
        }

        async function copyFixedTimeCellByTimezone(tz, slotUtcDate) {
            const text = formatFixedTimeCopyTextForTimezoneSlot(tz, slotUtcDate);
            if (!text) return;
            try {
                await invokeDep("writeClipboard", text);
                invokeDep("showToast", translate("toast_copy_success"), { type: "success" });
            } catch (err) {
                console.error("copyFixedTimeCellByTimezone failed:", err);
                invokeDep("showToast", translate("toast_copy_failed"), { type: "error" });
            }
        }

        function buildFixedTimeCellInputValue(utcDate, tz) {
            const payload = invokeDep("buildFixedTimeDisplayPayloadAtUtc", utcDate, tz);
            return payload?.clock || "";
        }

        function buildFixedTimeCellTimeParts(rawValue) {
            const timeParts = invokeDep("parseDateTimeParts", rawValue, "time");
            if (timeParts) {
                const [hour, minute, second] = timeParts;
                return { hour, minute, second };
            }
            const datetimeParts = invokeDep("parseDateTimeParts", rawValue, "datetime");
            if (datetimeParts) {
                const [, , , hour, minute, second] = datetimeParts;
                return { hour, minute, second };
            }
            return null;
        }

        function applyFixedTimeSlotByTimezoneInput(slotIdx, tz, rawValue, anchorUtcDate) {
            if (!Number.isInteger(slotIdx) || slotIdx < 0) return false;
            if (!tz || typeof tz !== "object") return false;
            const timeParts = buildFixedTimeCellTimeParts(rawValue);
            if (!timeParts) {
                invokeDep("showToast", translate("toast_invalid_date"));
                invokeDep("renderFixedTimeTab");
                return false;
            }

            const safeAnchorDate = isValidDate(anchorUtcDate) ? anchorUtcDate : new Date();
            const fixedOffsetMinutes = invokeDep("getFixedOffsetForDisplayAtDate", tz, safeAnchorDate);
            const anchorLocal = invokeDep("getLocalPartsByTimezone", safeAnchorDate, tz, fixedOffsetMinutes);
            const localParts = {
                year: anchorLocal.year,
                month: anchorLocal.month,
                day: anchorLocal.day,
                hour: timeParts.hour,
                minute: timeParts.minute,
                second: timeParts.second
            };
            const nextUtcDate = invokeDep("getUTCDateFromLocalParts", localParts, tz, fixedOffsetMinutes);
            if (!isValidDate(nextUtcDate)) {
                invokeDep("showToast", translate("toast_invalid_date"));
                invokeDep("renderFixedTimeTab");
                return false;
            }

            const baseRef = invokeDep("getBaseTimezoneRef");
            if (!baseRef) return false;
            const baseOffsetMinutes = invokeDep("getFixedOffsetForDisplayAtDate", baseRef, nextUtcDate);
            const baseLocal = invokeDep("getLocalPartsByTimezone", nextUtcDate, baseRef, baseOffsetMinutes);
            const pad = invokeDep("pad");
            const hourText = (typeof pad === "function") ? pad(baseLocal.hour) : String(baseLocal.hour).padStart(2, "0");
            const minuteText = (typeof pad === "function") ? pad(baseLocal.minute) : String(baseLocal.minute).padStart(2, "0");
            const nextSlotValue = `${hourText}:${minuteText}`;
            return updateFixedTimeSlotTime(slotIdx, nextSlotValue);
        }

        async function copyFixedTimeSlotColumn(slotIdx) {
            if (!Number.isInteger(slotIdx) || slotIdx < 0) return;
            const group = invokeDep("getCurrentGroup");
            if (!group) return;
            invokeDep("ensureGroupFixedTimes", group);
            const slot = group.fixedTimes?.[slotIdx];
            if (!slot) return;

            const baseRef = invokeDep("getBaseTimezoneRef");
            if (!baseRef) return;
            const rows = [baseRef, ...asArray(invokeDep("getRenderableTimezoneRows", baseRef))];
            const anchor = invokeDep("getGlobalTime", 0);
            const anchorDate = isValidDate(anchor) ? anchor : new Date();
            const slotUtcDate = invokeDep("resolveFixedTimeSlotUtcDate", slot, baseRef, anchorDate);
            if (!isValidDate(slotUtcDate)) return;

            const slotLabel = invokeDep("getFixedTimeSlotHeaderLabel", slot, slotIdx, group.fixedTimes.length) || "";
            const copyState = getFixedTimeCopyState();
            const lines = rows
                .map((tz) => formatFixedTimeCopyTextForTimezoneSlot(tz, slotUtcDate, copyState))
                .filter(Boolean);

            if (!lines.length) return;
            const text = [`[${slotLabel}]`, ...lines].join("\n");
            try {
                await invokeDep("writeClipboard", text);
                invokeDep("showToast", translate("toast_copy_success"), { type: "success" });
            } catch (err) {
                console.error("copyFixedTimeSlotColumn failed:", err);
                invokeDep("showToast", translate("toast_copy_failed"), { type: "error" });
            }
        }

        function renameFixedTimeSlot(slotIdx) {
            if (!Number.isInteger(slotIdx) || slotIdx < 0) return;
            const group = invokeDep("getCurrentGroup");
            if (!group) return;
            invokeDep("ensureGroupFixedTimes", group);
            const slot = group.fixedTimes?.[slotIdx];
            if (!slot) return;
            const defaultName = invokeDep("getDefaultFixedTimeName");
            const currentName = invokeDep("sanitizeFixedTimeName", slot.name, defaultName);
            const promptText = `${translate("btn_rename")} ${translate("th_fixed_time")}:`;
            const promptFn = (typeof globalObj.prompt === "function") ? globalObj.prompt.bind(globalObj) : null;
            if (typeof promptFn !== "function") return;
            const nextRaw = promptFn(promptText, currentName);
            if (nextRaw === null) return;
            slot.name = invokeDep("sanitizeFixedTimeName", nextRaw, defaultName);
            invokeDep("renderFixedTimeTab");
            invokeDep("renderTimelineFrame");
            invokeDep("savePersistence");
        }

        function updateFixedTimeSlotTime(slotIdx, rawValue) {
            if (!Number.isInteger(slotIdx) || slotIdx < 0) return false;
            const group = invokeDep("getCurrentGroup");
            if (!group) return false;
            invokeDep("ensureGroupFixedTimes", group);
            const slot = group.fixedTimes?.[slotIdx];
            if (!slot) return false;
            const defaultValue = String(safeDeps.DEFAULT_FIXED_TIME_VALUE || "09:00");
            const fallbackValue = invokeDep("sanitizeFixedTimeValue", slot.time, defaultValue);
            const nextValue = invokeDep("sanitizeFixedTimeValue", rawValue, fallbackValue);
            if (slot.time === nextValue) return false;
            slot.time = nextValue;
            invokeDep("renderFixedTimeTab");
            invokeDep("renderTimelineFrame");
            invokeDep("savePersistence");
            return true;
        }

        function addFixedTimeSlot() {
            const group = invokeDep("getCurrentGroup");
            if (!group) return;
            const count = Number(invokeDep("getFixedTimeSlotCount", group)) || 1;
            invokeDep("setFixedTimeSlotCount", count + 1, { persist: true, rerender: true, showBoundaryToast: true });
        }

        function removeFixedTimeSlot(slotId) {
            const group = invokeDep("getCurrentGroup");
            if (!group) return;
            invokeDep("ensureGroupFixedTimes", group);
            const minCount = getNumberConstant("MIN_FIXED_TIME_SLOT_COUNT", 1);
            if ((group.fixedTimes?.length || 0) <= minCount) {
                invokeDep("showToast", translate("toast_fixed_time_min"), { type: "info" });
                return;
            }
            const next = asArray(group.fixedTimes).filter((slot) => slot.id !== slotId);
            if (next.length === (group.fixedTimes?.length || 0)) return;
            group.fixedTimes = next;
            invokeDep("refreshFixedTimeSlotCountControls");
            invokeDep("renderFixedTimeTab");
            invokeDep("renderTimelineFrame");
            invokeDep("savePersistence");
        }

        return Object.freeze({
            formatFixedTimePayloadText,
            getFixedTimeCopyState,
            buildFixedTimeSnapshotForTimezoneSlot,
            formatFixedTimeCopyTextForTimezoneSlot,
            getFixedTimeSlotUtcDateByIndex,
            getFixedTimePreviewCopyText,
            getAllFixedTimeRowsCopyText,
            copyFixedTimeCellPayload,
            copyFixedTimeCellByTimezone,
            buildFixedTimeCellInputValue,
            buildFixedTimeCellTimeParts,
            applyFixedTimeSlotByTimezoneInput,
            copyFixedTimeSlotColumn,
            renameFixedTimeSlot,
            updateFixedTimeSlotTime,
            addFixedTimeSlot,
            removeFixedTimeSlot
        });
    }

    globalObj.GTVFixedTimeActions = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);


// --- File: js/modules/fixed-time-table.js ---
(function initGtvFixedTimeTable(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (err) {
                console.warn(`[GTVFixedTimeTable] Dependency "${name}" threw.`, err);
                return undefined;
            }
        }

        function translate(key) {
            const value = invokeDep("t", key);
            if (typeof value === "string" && value) return value;
            return String(key || "");
        }

        function asArray(value) {
            if (Array.isArray(value)) return value;
            if (value && typeof value[Symbol.iterator] === "function") {
                try {
                    return Array.from(value);
                } catch (_err) {
                    return [];
                }
            }
            return [];
        }

        function isValidDate(value) {
            return value instanceof Date && Number.isFinite(value.getTime());
        }

        function getFixedTimeSlotLayoutMetrics(partsEnabled) {
            const safeParts = (partsEnabled && typeof partsEnabled === "object")
                ? partsEnabled
                : {};
            const showDn = safeParts.dn !== false;
            const showTime = safeParts.time !== false;
            const showWeekday = safeParts.weekday !== false;

            const inputWidthPx = showTime ? 100 : 0;
            const dayNightWidthPx = showDn ? 20 : 0;
            const weekdayWidthPx = showWeekday ? 28 : 0;
            const calendarBtnWidthPx = showTime ? 22 : 0;
            const copyBtnWidthPx = 24;
            const paddingAndGapPx = 16;
            const minimumWidthPx = showTime ? 152 : 72;
            const columnMinWidthPx = Math.max(
                minimumWidthPx,
                inputWidthPx + dayNightWidthPx + weekdayWidthPx + calendarBtnWidthPx + copyBtnWidthPx + paddingAndGapPx
            );

            return {
                inputWidthPx,
                columnMinWidthPx
            };
        }

        function getFixedTimeDisplayColumns() {
            const order = invokeDep("sanitizeCopyFormatOrderForContext", invokeDep("getDisplayFormatOrder"), "fixed-time");
            const enabled = invokeDep("sanitizeCopyFormatEnabledForContext", invokeDep("getDisplayFormatEnabled"), "display", "fixed-time");
            const columns = [];
            asArray(order).forEach((key) => {
                if (key === "time") {
                    if (enabled?.time) columns.push("time_slots");
                    return;
                }
                if (!enabled?.[key]) return;
                if (key === "timezone" || key === "region" || key === "offset") {
                    columns.push(key);
                }
            });
            return columns;
        }

        function getFixedTimeOffsetTextAtDate(tz, anchorDate) {
            if (!tz || typeof tz !== "object") return "";
            const safeAnchorDate = isValidDate(anchorDate) ? anchorDate : new Date();
            if (tz.type === "custom") {
                return invokeDep("formatUtcOffsetLabel", invokeDep("getCustomOffsetMinutes", tz)) || "";
            }
            if (tz.zone === "UTC") {
                return invokeDep("formatUtcOffsetLabel", 0) || "";
            }
            const fixedOffset = invokeDep("getFixedOffsetForDisplayAtDate", tz, safeAnchorDate);
            if (Number.isFinite(fixedOffset)) {
                return invokeDep("formatUtcOffsetLabel", fixedOffset) || "";
            }
            return invokeDep("formatUtcOffsetLabel", invokeDep("getTimezoneOffset", tz.zone || "UTC", safeAnchorDate)) || "";
        }

        function renderFixedTimeTable() {
            if (typeof document !== "object" || !document) return;
            const headRow = document.querySelector("#fixed-time-table-head tr");
            const body = document.getElementById("fixed-time-body");
            const group = invokeDep("getCurrentGroup");
            if (!headRow || !body || !group) return;

            invokeDep("ensureGroupFixedTimes", group);
            const fixedTimes = asArray(group.fixedTimes);
            const displayPartsEnabled = invokeDep("getFixedTimeDisplayPartsEnabled") || {};
            const slotLayout = getFixedTimeSlotLayoutMetrics(displayPartsEnabled);
            const displayColumns = getFixedTimeDisplayColumns();
            const fixedTimeTable = document.querySelector(".fixed-time-table");
            if (fixedTimeTable?.style && typeof fixedTimeTable.style.setProperty === "function") {
                fixedTimeTable.style.setProperty("--fixed-time-slot-min-width", `${slotLayout.columnMinWidthPx}px`);
                fixedTimeTable.style.setProperty("--fixed-time-input-width", `${slotLayout.inputWidthPx}px`);
            }

            headRow.textContent = "";
            const moveHead = document.createElement("th");
            moveHead.className = "move-col";
            moveHead.style.width = "70px";
            moveHead.textContent = translate("th_order");
            headRow.appendChild(moveHead);

            displayColumns.forEach((colKey) => {
                if (colKey === "timezone") {
                    const timezoneHead = document.createElement("th");
                    timezoneHead.style.width = "110px";
                    timezoneHead.textContent = translate("th_tz_abbr");
                    headRow.appendChild(timezoneHead);
                    return;
                }
                if (colKey === "region") {
                    const nameHead = document.createElement("th");
                    nameHead.style.width = "220px";
                    nameHead.textContent = translate("th_region");
                    headRow.appendChild(nameHead);
                    return;
                }
                if (colKey === "offset") {
                    const offsetHead = document.createElement("th");
                    offsetHead.style.width = "140px";
                    offsetHead.textContent = translate("th_utc_offset");
                    headRow.appendChild(offsetHead);
                    return;
                }
                if (colKey !== "time_slots") return;

                fixedTimes.forEach((slot, slotIdx) => {
                    const slotHead = document.createElement("th");
                    slotHead.className = "dynamic-col fixed-time-slot-head-cell";
                    slotHead.style.minWidth = `${slotLayout.columnMinWidthPx}px`;

                    const slotHeadWrap = document.createElement("div");
                    slotHeadWrap.className = "fixed-time-slot-head";

                    const slotHeadTop = document.createElement("div");
                    slotHeadTop.className = "fixed-time-slot-head-top";

                    const colorDot = document.createElement("span");
                    colorDot.className = "fixed-time-slot-dot";
                    colorDot.style.background = invokeDep("getFixedTimeTimelineIndicatorColor", slotIdx) || "";
                    colorDot.setAttribute("aria-hidden", "true");

                    const markerWrap = document.createElement("span");
                    markerWrap.className = "fixed-time-slot-marker";
                    markerWrap.appendChild(colorDot);

                    const slotTitle = document.createElement("span");
                    slotTitle.className = "fixed-time-slot-title";
                    slotTitle.textContent = invokeDep("getFixedTimeSlotHeaderLabel", slot, slotIdx, fixedTimes.length) || "";

                    const renameBtn = document.createElement("button");
                    renameBtn.type = "button";
                    renameBtn.className = "sm-btn fixed-time-slot-rename-btn export-exclude";
                    renameBtn.title = translate("btn_rename");
                    renameBtn.textContent = "\u270E";
                    renameBtn.addEventListener("click", () => {
                        invokeDep("renameFixedTimeSlot", slotIdx);
                    });
                    slotHeadTop.appendChild(renameBtn);

                    const copySlotBtn = document.createElement("button");
                    copySlotBtn.type = "button";
                    copySlotBtn.className = "sm-btn fixed-time-slot-copy-btn custom-tooltip export-exclude";
                    copySlotBtn.title = translate("tooltip_copy");
                    copySlotBtn.textContent = "\uD83D\uDCCB";
                    copySlotBtn.addEventListener("click", async () => {
                        await invokeDep("copyFixedTimeSlotColumn", slotIdx);
                    });

                    const actionsWrap = document.createElement("span");
                    actionsWrap.className = "fixed-time-slot-actions";
                    actionsWrap.appendChild(renameBtn);
                    actionsWrap.appendChild(copySlotBtn);

                    slotHeadTop.appendChild(markerWrap);
                    slotHeadTop.appendChild(slotTitle);
                    slotHeadTop.appendChild(actionsWrap);

                    slotHeadWrap.appendChild(slotHeadTop);
                    slotHead.appendChild(slotHeadWrap);
                    headRow.appendChild(slotHead);
                });
            });

            body.textContent = "";
            const baseRef = invokeDep("getBaseTimezoneRef");
            if (!baseRef) return;
            const rows = [baseRef, ...asArray(invokeDep("getRenderableTimezoneRows", baseRef))];
            const anchorDate = isValidDate(invokeDep("getGlobalTime", 0))
                ? invokeDep("getGlobalTime", 0)
                : new Date();
            const slotUtcDates = fixedTimes.map((slot) => invokeDep("resolveFixedTimeSlotUtcDate", slot, baseRef, anchorDate));

            rows.forEach((tz) => {
                const row = document.createElement("tr");
                row.className = "time-row fixed-time-row";
                row.id = `tz-row-${tz.id}`;
                const isBaseRow = tz.id === baseRef.id;
                if (isBaseRow) row.classList.add("static");
                row.draggable = false;

                const moveCell = document.createElement("td");
                moveCell.className = "move-cell";
                const moveGroup = document.createElement("div");
                moveGroup.className = "btn-group";
                if (isBaseRow) {
                    const spacer = document.createElement("span");
                    spacer.className = "drag-spacer";
                    spacer.setAttribute("aria-hidden", "true");
                    moveGroup.appendChild(spacer);
                } else {
                    const dragHandle = document.createElement("button");
                    dragHandle.type = "button";
                    dragHandle.className = "drag-handle";
                    dragHandle.draggable = true;
                    dragHandle.textContent = "\u22EE\u22EE";
                    dragHandle.addEventListener("dragstart", (event) => {
                        row.classList.add("dragging");
                        if (event.dataTransfer) {
                            event.dataTransfer.effectAllowed = "move";
                            event.dataTransfer.setData("text/plain", tz.id || "");
                            const ghost = invokeDep("createDragGhostFromRow", row);
                            event.dataTransfer.setDragImage(ghost || row, 20, 20);
                        }
                    });
                    dragHandle.addEventListener("dragend", () => {
                        row.classList.remove("dragging");
                        invokeDep("clearDragGhost");
                        invokeDep("saveFixedTimeOrder");
                        invokeDep("updateClocks");
                    });
                    moveGroup.appendChild(dragHandle);
                }
                moveCell.appendChild(moveGroup);
                row.appendChild(moveCell);

                const offsetAnchorDate = isValidDate(slotUtcDates[0]) ? slotUtcDates[0] : anchorDate;
                displayColumns.forEach((colKey) => {
                    if (colKey === "timezone") {
                        const tzCell = document.createElement("td");
                        tzCell.className = "timezone-cell";
                        const abbrWrap = document.createElement("div");
                        abbrWrap.className = "abbr-cell";
                        const zoneCode = document.createElement("span");
                        zoneCode.className = "zone-code";
                        zoneCode.textContent = invokeDep("getZoneAbbreviation", tz, anchorDate) || "";
                        abbrWrap.appendChild(zoneCode);
                        tzCell.appendChild(abbrWrap);
                        row.appendChild(tzCell);
                        return;
                    }

                    if (colKey === "region") {
                        const nameCell = document.createElement("td");
                        const zoneInfo = document.createElement("div");
                        zoneInfo.className = "zone-info";
                        const zoneName = document.createElement("span");
                        zoneName.className = "zone-name";
                        zoneName.textContent = invokeDep("getZoneDisplayName", tz) || "";
                        zoneInfo.appendChild(zoneName);
                        nameCell.appendChild(zoneInfo);
                        row.appendChild(nameCell);
                        return;
                    }

                    if (colKey === "offset") {
                        const offsetCell = document.createElement("td");
                        const offsetText = document.createElement("span");
                        offsetText.className = "offset-text";
                        offsetText.textContent = getFixedTimeOffsetTextAtDate(tz, offsetAnchorDate);
                        offsetCell.appendChild(offsetText);
                        row.appendChild(offsetCell);
                        return;
                    }

                    if (colKey !== "time_slots") return;
                    slotUtcDates.forEach((utcDate, slotIdx) => {
                        const timeCell = document.createElement("td");
                        timeCell.className = "fixed-time-time";
                        const payload = invokeDep("buildFixedTimeDisplayPayloadAtUtc", utcDate, tz);
                        const cellWrap = document.createElement("div");
                        cellWrap.className = "fixed-time-cell-wrap";

                        const timeGroup = document.createElement("div");
                        timeGroup.className = "time-day-group";
                        let hasTimeGroupContent = false;

                        if (displayPartsEnabled.dn) {
                            const dnEl = document.createElement("span");
                            dnEl.className = "dn-icon";
                            dnEl.textContent = payload?.dayNightGlyph || "";
                            dnEl.title = payload?.dayNightMarker === "DAY" ? translate("dn_day") : translate("dn_night");
                            timeGroup.appendChild(dnEl);
                            hasTimeGroupContent = true;
                        }

                        let timeInput = null;
                        let triggerBtn = null;
                        if (displayPartsEnabled.time) {
                            timeInput = document.createElement("input");
                            timeInput.type = "text";
                            timeInput.className = "time-input fixed-time-time-input";
                            timeInput.spellcheck = false;
                            timeInput.value = invokeDep("buildFixedTimeCellInputValue", utcDate, tz) || "";
                            timeGroup.appendChild(timeInput);
                            hasTimeGroupContent = true;
                        }

                        if (displayPartsEnabled.weekday && payload?.dayName) {
                            const dayEl = document.createElement("span");
                            const isSun = payload.weekdayIndex === 0;
                            const isSat = payload.weekdayIndex === 6;
                            dayEl.className = `day-badge${isSun ? " day-sun" : (isSat ? " day-sat" : "")}`;
                            dayEl.textContent = payload.dayName;
                            timeGroup.appendChild(dayEl);
                            hasTimeGroupContent = true;
                        }

                        if (displayPartsEnabled.time) {
                            triggerBtn = document.createElement("button");
                            triggerBtn.type = "button";
                            triggerBtn.className = "calendar-btn";
                            triggerBtn.tabIndex = -1;
                            triggerBtn.title = "Time Picker";
                            triggerBtn.textContent = "\uD83D\uDCC5";
                            timeGroup.appendChild(triggerBtn);
                            hasTimeGroupContent = true;
                        }

                        if (timeInput && triggerBtn) {
                            invokeDep("bindCustomDatePickerForInput", timeInput, triggerBtn, { preserveValue: true, type: "time" });
                            timeInput.value = invokeDep("buildFixedTimeCellInputValue", utcDate, tz) || "";

                            const commitCellInput = () => {
                                const latestInput = String(timeInput.value || "").trim();
                                invokeDep("applyFixedTimeSlotByTimezoneInput", slotIdx, tz, latestInput, utcDate);
                            };
                            timeInput.addEventListener("change", commitCellInput);
                            timeInput.addEventListener("keydown", (event) => {
                                if (event.key !== "Enter") return;
                                event.preventDefault();
                                timeInput.blur();
                            });
                            timeInput.addEventListener("blur", commitCellInput);
                        }

                        if (hasTimeGroupContent) {
                            cellWrap.appendChild(timeGroup);
                        }

                        const copyBtn = document.createElement("button");
                        copyBtn.type = "button";
                        copyBtn.className = "sm-btn fixed-time-copy-btn custom-tooltip export-exclude";
                        copyBtn.title = translate("tooltip_copy");
                        copyBtn.textContent = "\uD83D\uDCCB";
                        copyBtn.addEventListener("click", async () => {
                            await invokeDep("copyFixedTimeCellByTimezone", tz, utcDate);
                        });
                        cellWrap.appendChild(copyBtn);

                        timeCell.appendChild(cellWrap);
                        row.appendChild(timeCell);
                    });
                });

                body.appendChild(row);
            });
            invokeDep("upgradeNativeTitleTooltips", headRow);
            invokeDep("upgradeNativeTitleTooltips", body);
        }

        return Object.freeze({
            getFixedTimeSlotLayoutMetrics,
            getFixedTimeDisplayColumns,
            getFixedTimeOffsetTextAtDate,
            renderFixedTimeTable
        });
    }

    globalObj.GTVFixedTimeTable = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/format-profile-state.js ---
(function initGtvFormatProfileState(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        const COPY_FORMAT_KEYS = Array.isArray(safeDeps.COPY_FORMAT_KEYS) ? [...safeDeps.COPY_FORMAT_KEYS] : [];
        const TIME_PART_KEYS = Array.isArray(safeDeps.TIME_PART_KEYS) ? [...safeDeps.TIME_PART_KEYS] : [];
        const FORMAT_PROFILE_CONTEXT_KEYS = Array.isArray(safeDeps.FORMAT_PROFILE_CONTEXT_KEYS)
            ? [...safeDeps.FORMAT_PROFILE_CONTEXT_KEYS]
            : ["live"];
        const DEFAULT_DISPLAY_FORMAT_ENABLED = (safeDeps.DEFAULT_DISPLAY_FORMAT_ENABLED && typeof safeDeps.DEFAULT_DISPLAY_FORMAT_ENABLED === "object")
            ? { ...safeDeps.DEFAULT_DISPLAY_FORMAT_ENABLED }
            : {};
        const DEFAULT_COPY_FORMAT_ENABLED = (safeDeps.DEFAULT_COPY_FORMAT_ENABLED && typeof safeDeps.DEFAULT_COPY_FORMAT_ENABLED === "object")
            ? { ...safeDeps.DEFAULT_COPY_FORMAT_ENABLED }
            : {};
        const DEFAULT_DISPLAY_TIME_PARTS_ENABLED = (safeDeps.DEFAULT_DISPLAY_TIME_PARTS_ENABLED && typeof safeDeps.DEFAULT_DISPLAY_TIME_PARTS_ENABLED === "object")
            ? { ...safeDeps.DEFAULT_DISPLAY_TIME_PARTS_ENABLED }
            : {};
        const DEFAULT_COPY_TIME_PARTS_ENABLED = (safeDeps.DEFAULT_COPY_TIME_PARTS_ENABLED && typeof safeDeps.DEFAULT_COPY_TIME_PARTS_ENABLED === "object")
            ? { ...safeDeps.DEFAULT_COPY_TIME_PARTS_ENABLED }
            : {};

        function getState() {
            if (typeof safeDeps.getState !== "function") return {};
            const state = safeDeps.getState();
            return (state && typeof state === "object") ? state : {};
        }

        function patchState(next = {}) {
            if (typeof safeDeps.setState !== "function") return;
            if (!next || typeof next !== "object") return;
            safeDeps.setState(next);
        }

        function sanitizeMainTab(tab) {
            if (typeof safeDeps.sanitizeMainTab === "function") return safeDeps.sanitizeMainTab(tab);
            return (typeof tab === "string" && tab.trim()) ? tab.trim() : "live";
        }

        function getDefaultFormatEnabled(mode = "display") {
            return mode === "copy" ? { ...DEFAULT_COPY_FORMAT_ENABLED } : { ...DEFAULT_DISPLAY_FORMAT_ENABLED };
        }

        function getDefaultTimePartsEnabled(mode = "display") {
            return mode === "copy" ? { ...DEFAULT_COPY_TIME_PARTS_ENABLED } : { ...DEFAULT_DISPLAY_TIME_PARTS_ENABLED };
        }

        function normalizeCopyFormatKey(rawKey) {
            let normalizedKey = rawKey === "period" ? "period_days" : rawKey;
            if (normalizedKey === "time_day" || normalizedKey === "date_day" || normalizedKey === "date") {
                normalizedKey = "time";
            }
            return normalizedKey;
        }

        function sanitizeCopyFormatOrder(order) {
            const safeOrder = [];
            if (Array.isArray(order)) {
                order.forEach((key) => {
                    const normalizedKey = normalizeCopyFormatKey(key);
                    if (COPY_FORMAT_KEYS.includes(normalizedKey) && !safeOrder.includes(normalizedKey)) safeOrder.push(normalizedKey);
                });
            }
            COPY_FORMAT_KEYS.forEach((key) => {
                if (!safeOrder.includes(key)) safeOrder.push(key);
            });
            return safeOrder;
        }

        function sanitizeCopyFormatEnabled(enabled, mode = "display") {
            const safe = getDefaultFormatEnabled(mode);
            COPY_FORMAT_KEYS.forEach((key) => {
                if (enabled && typeof enabled === "object") {
                    if (Object.prototype.hasOwnProperty.call(enabled, key)) {
                        safe[key] = !!enabled[key];
                        return;
                    }
                    if (key === "time") {
                        const hasLegacyTime = !!enabled.time_day || !!enabled.date_day || !!enabled.date;
                        if (hasLegacyTime) {
                            safe[key] = true;
                            return;
                        }
                    }
                    if (key === "period_days" && Object.prototype.hasOwnProperty.call(enabled, "period")) {
                        safe[key] = !!enabled.period;
                        return;
                    }
                }
            });
            return safe;
        }

        function sanitizeTimePartsEnabled(parts, mode = "display") {
            const safe = getDefaultTimePartsEnabled(mode);
            if (!parts || typeof parts !== "object") return safe;
            TIME_PART_KEYS.forEach((key) => {
                if (Object.prototype.hasOwnProperty.call(parts, key)) {
                    safe[key] = !!parts[key];
                }
            });
            return safe;
        }

        function deriveTimePartsFromLegacyEnabled(_legacyEnabled, mode = "display") {
            return sanitizeTimePartsEnabled(null, mode);
        }

        function sanitizeFormatProfileContext(context) {
            if (typeof context !== "string") return "live";
            const safeContext = context.trim();
            return FORMAT_PROFILE_CONTEXT_KEYS.includes(safeContext) ? safeContext : "live";
        }

        function getFormatProfileAllowedKeys(context = getState().activeFormatProfileContext) {
            const safeContext = sanitizeFormatProfileContext(context);
            if (safeContext === "multi" || safeContext === "fixed-extra") {
                return [...COPY_FORMAT_KEYS];
            }
            return COPY_FORMAT_KEYS.filter((key) => key !== "period_days" && key !== "period_time");
        }

        function getFormatProfileAllowedTimePartKeys(context = getState().activeFormatProfileContext) {
            const safeContext = sanitizeFormatProfileContext(context);
            if (safeContext === "fixed-time") {
                return TIME_PART_KEYS.filter((key) => key !== "date");
            }
            return [...TIME_PART_KEYS];
        }

        function sanitizeCopyFormatOrderForContext(order, context = getState().activeFormatProfileContext) {
            const allowedKeys = getFormatProfileAllowedKeys(context);
            const allowedSet = new Set(allowedKeys);
            const safeOrder = sanitizeCopyFormatOrder(order).filter((key) => allowedSet.has(key));
            allowedKeys.forEach((key) => {
                if (!safeOrder.includes(key)) safeOrder.push(key);
            });
            return safeOrder;
        }

        function getDefaultFormatEnabledForContext(mode = "display", context = getState().activeFormatProfileContext) {
            const allowedKeys = getFormatProfileAllowedKeys(context);
            const allowedSet = new Set(allowedKeys);
            const safe = getDefaultFormatEnabled(mode);
            COPY_FORMAT_KEYS.forEach((key) => {
                if (!allowedSet.has(key)) {
                    safe[key] = false;
                }
            });
            if (allowedSet.has("period_days")) safe.period_days = true;
            if (allowedSet.has("period_time")) safe.period_time = true;
            return safe;
        }

        function sanitizeCopyFormatEnabledForContext(enabled, mode = "display", context = getState().activeFormatProfileContext) {
            const safe = getDefaultFormatEnabledForContext(mode, context);
            if (!enabled || typeof enabled !== "object") return safe;
            const allowedKeys = getFormatProfileAllowedKeys(context);
            const normalized = sanitizeCopyFormatEnabled(enabled, mode);
            allowedKeys.forEach((key) => {
                safe[key] = !!normalized[key];
            });
            return safe;
        }

        function sanitizeTimePartsEnabledForContext(parts, mode = "display", context = getState().activeFormatProfileContext) {
            const safe = sanitizeTimePartsEnabled(parts, mode);
            const allowedKeys = new Set(getFormatProfileAllowedTimePartKeys(context));
            TIME_PART_KEYS.forEach((key) => {
                if (!allowedKeys.has(key)) {
                    safe[key] = false;
                }
            });
            return safe;
        }

        function createDefaultFormatProfile(context = "live") {
            const safeContext = sanitizeFormatProfileContext(context);
            return {
                displayFormatOrder: sanitizeCopyFormatOrderForContext(COPY_FORMAT_KEYS, safeContext),
                displayFormatEnabled: getDefaultFormatEnabledForContext("display", safeContext),
                displayTimePartsEnabled: sanitizeTimePartsEnabledForContext(null, "display", safeContext),
                copyFormatOrder: sanitizeCopyFormatOrderForContext(COPY_FORMAT_KEYS, safeContext),
                copyFormatEnabled: getDefaultFormatEnabledForContext("copy", safeContext),
                copyTimePartsEnabled: sanitizeTimePartsEnabledForContext(null, "copy", safeContext)
            };
        }

        function sanitizeFormatProfile(profile, context = getState().activeFormatProfileContext) {
            const safeContext = sanitizeFormatProfileContext(context);
            const source = (profile && typeof profile === "object") ? profile : {};
            return {
                displayFormatOrder: sanitizeCopyFormatOrderForContext(source.displayFormatOrder, safeContext),
                displayFormatEnabled: sanitizeCopyFormatEnabledForContext(source.displayFormatEnabled, "display", safeContext),
                displayTimePartsEnabled: sanitizeTimePartsEnabledForContext(source.displayTimePartsEnabled, "display", safeContext),
                copyFormatOrder: sanitizeCopyFormatOrderForContext(source.copyFormatOrder, safeContext),
                copyFormatEnabled: sanitizeCopyFormatEnabledForContext(source.copyFormatEnabled, "copy", safeContext),
                copyTimePartsEnabled: sanitizeTimePartsEnabledForContext(source.copyTimePartsEnabled, "copy", safeContext)
            };
        }

        function sanitizeFormatProfiles(rawProfiles = null, legacyProfile = null) {
            const safeProfiles = (rawProfiles && typeof rawProfiles === "object") ? rawProfiles : {};
            const safeLegacy = (legacyProfile && typeof legacyProfile === "object") ? legacyProfile : null;
            const nextProfiles = {};
            FORMAT_PROFILE_CONTEXT_KEYS.forEach((contextKey) => {
                const rawProfile = safeProfiles[contextKey];
                const sourceProfile = (rawProfile && typeof rawProfile === "object") ? rawProfile : safeLegacy;
                nextProfiles[contextKey] = sanitizeFormatProfile(sourceProfile, contextKey);
            });
            return nextProfiles;
        }

        function getCurrentFormatProfileState() {
            const state = getState();
            return {
                displayFormatOrder: state.displayFormatOrder,
                displayFormatEnabled: state.displayFormatEnabled,
                displayTimePartsEnabled: state.displayTimePartsEnabled,
                copyFormatOrder: state.copyFormatOrder,
                copyFormatEnabled: state.copyFormatEnabled,
                copyTimePartsEnabled: state.copyTimePartsEnabled
            };
        }

        function resolveFormatProfileContext(tab = getState().currentMainTab, effectiveSlotCount = getState().slotCount) {
            const safeTab = sanitizeMainTab(tab);
            if (safeTab === "multi") return "multi";
            if (safeTab === "fixed-time") return "fixed-time";
            if (safeTab === "fixed") return Number(effectiveSlotCount) > 1 ? "fixed-extra" : "fixed";
            if (safeTab === "live") return "live";
            return sanitizeFormatProfileContext(getState().activeFormatProfileContext);
        }

        function ensureFormatProfiles(legacyProfile = null) {
            const state = getState();
            const nextProfiles = sanitizeFormatProfiles(state.formatProfiles, legacyProfile);
            const patch = { formatProfiles: nextProfiles };
            if (!FORMAT_PROFILE_CONTEXT_KEYS.includes(state.activeFormatProfileContext)) {
                patch.activeFormatProfileContext = resolveFormatProfileContext(state.currentMainTab, state.slotCount);
            }
            patchState(patch);
        }

        function applyFormatProfileState(profile, context = getState().activeFormatProfileContext) {
            const safeProfile = sanitizeFormatProfile(profile, context);
            patchState({
                displayFormatOrder: [...safeProfile.displayFormatOrder],
                displayFormatEnabled: { ...safeProfile.displayFormatEnabled },
                displayTimePartsEnabled: { ...safeProfile.displayTimePartsEnabled },
                copyFormatOrder: [...safeProfile.copyFormatOrder],
                copyFormatEnabled: { ...safeProfile.copyFormatEnabled },
                copyTimePartsEnabled: { ...safeProfile.copyTimePartsEnabled }
            });
        }

        function syncActiveFormatProfileFromState() {
            ensureFormatProfiles(getCurrentFormatProfileState());
            const state = getState();
            const safeContext = sanitizeFormatProfileContext(state.activeFormatProfileContext);
            const nextProfiles = { ...(state.formatProfiles || {}) };
            nextProfiles[safeContext] = sanitizeFormatProfile(getCurrentFormatProfileState(), safeContext);
            patchState({ formatProfiles: nextProfiles });
            applyFormatProfileState(nextProfiles[safeContext], safeContext);
        }

        function activateFormatProfileContext(context, options = {}) {
            const { syncCurrent = true } = options;
            if (syncCurrent) syncActiveFormatProfileFromState();
            ensureFormatProfiles(getCurrentFormatProfileState());

            const nextContext = sanitizeFormatProfileContext(context);
            const current = getState();
            const nextProfiles = { ...(current.formatProfiles || {}) };
            const nextProfile = sanitizeFormatProfile(nextProfiles[nextContext], nextContext);
            nextProfiles[nextContext] = nextProfile;

            patchState({
                activeFormatProfileContext: nextContext,
                formatProfiles: nextProfiles
            });
            applyFormatProfileState(nextProfile, nextContext);
            return nextContext;
        }

        function activateFormatProfileForCurrentContext(options = {}) {
            const state = getState();
            const nextContext = resolveFormatProfileContext(state.currentMainTab, state.slotCount);
            return activateFormatProfileContext(nextContext, options);
        }

        function resetDisplayFormatForActiveContext() {
            const state = getState();
            const defaults = createDefaultFormatProfile(state.activeFormatProfileContext);
            patchState({
                displayFormatOrder: [...defaults.displayFormatOrder],
                displayFormatEnabled: { ...defaults.displayFormatEnabled },
                displayTimePartsEnabled: { ...defaults.displayTimePartsEnabled }
            });
            syncActiveFormatProfileFromState();
        }

        function resetCopyFormatForActiveContext() {
            const state = getState();
            const defaults = createDefaultFormatProfile(state.activeFormatProfileContext);
            patchState({
                copyFormatOrder: [...defaults.copyFormatOrder],
                copyFormatEnabled: { ...defaults.copyFormatEnabled },
                copyTimePartsEnabled: { ...defaults.copyTimePartsEnabled }
            });
            syncActiveFormatProfileFromState();
        }

        function initialize(legacyProfile = null) {
            ensureFormatProfiles(legacyProfile);
            activateFormatProfileForCurrentContext({ syncCurrent: false });
        }

        return Object.freeze({
            getDefaultFormatEnabled,
            getDefaultTimePartsEnabled,
            normalizeCopyFormatKey,
            sanitizeCopyFormatOrder,
            sanitizeCopyFormatEnabled,
            sanitizeTimePartsEnabled,
            deriveTimePartsFromLegacyEnabled,
            sanitizeFormatProfileContext,
            getFormatProfileAllowedKeys,
            getFormatProfileAllowedTimePartKeys,
            sanitizeCopyFormatOrderForContext,
            getDefaultFormatEnabledForContext,
            sanitizeCopyFormatEnabledForContext,
            sanitizeTimePartsEnabledForContext,
            createDefaultFormatProfile,
            sanitizeFormatProfile,
            sanitizeFormatProfiles,
            getCurrentFormatProfileState,
            resolveFormatProfileContext,
            ensureFormatProfiles,
            applyFormatProfileState,
            syncActiveFormatProfileFromState,
            activateFormatProfileContext,
            activateFormatProfileForCurrentContext,
            resetDisplayFormatForActiveContext,
            resetCopyFormatForActiveContext,
            initialize
        });
    }

    globalObj.GTVFormatProfileState = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/format-controls.js ---
(function initGtvFormatControls(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};
        let timePartsOutsideHandlerBound = false;
        let copyFormatDragGhostEl = null;
        const requestUiFrame = (typeof globalObj.requestAnimationFrame === "function")
            ? globalObj.requestAnimationFrame.bind(globalObj)
            : ((cb) => {
                if (typeof globalObj.setTimeout === "function") {
                    return globalObj.setTimeout(cb, 16);
                }
                if (typeof cb === "function") cb();
                return 0;
            });

        function getDocumentRef() {
            return (typeof document === "object" && document) ? document : null;
        }

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (_err) {
                return undefined;
            }
        }

        function translate(key) {
            const translated = invokeDep("t", key);
            if (typeof translated === "string" && translated) return translated;
            return String(key || "");
        }

        function getCopyFormatKeys() {
            const activeKeys = invokeDep("getActiveCopyFormatKeys");
            if (Array.isArray(activeKeys) && activeKeys.length) return activeKeys;
            return Array.isArray(safeDeps.COPY_FORMAT_KEYS) ? safeDeps.COPY_FORMAT_KEYS : [];
        }

        function getTimePartKeys() {
            const activeKeys = invokeDep("getActiveTimePartKeys");
            if (Array.isArray(activeKeys) && activeKeys.length) return activeKeys;
            return Array.isArray(safeDeps.TIME_PART_KEYS) ? safeDeps.TIME_PART_KEYS : [];
        }

        function isElementLike(el) {
            return !!el && typeof el === "object";
        }

        function isHtmlElementLike(el) {
            if (!isElementLike(el)) return false;
            if (typeof HTMLElement === "undefined") return true;
            return el instanceof HTMLElement;
        }

        function clearCopyFormatDragGhost() {
            if (!copyFormatDragGhostEl) return;
            if (copyFormatDragGhostEl.parentNode) {
                copyFormatDragGhostEl.parentNode.removeChild(copyFormatDragGhostEl);
            }
            copyFormatDragGhostEl = null;
        }

        function createCopyFormatDragGhost(item) {
            const doc = getDocumentRef();
            if (!isHtmlElementLike(item)) return null;
            if (!doc || !doc.body || typeof doc.body.appendChild !== "function") return null;
            if (typeof item.cloneNode !== "function") return null;
            clearCopyFormatDragGhost();

            const ghost = item.cloneNode(true);
            if (!isHtmlElementLike(ghost)) return null;
            if (!ghost.style || typeof ghost.style !== "object") return null;

            if (ghost.classList && typeof ghost.classList.remove === "function") {
                ghost.classList.remove("dragging");
            }
            if (ghost.classList && typeof ghost.classList.add === "function") {
                ghost.classList.add("copy-format-drag-ghost");
            }

            if (typeof ghost.querySelectorAll === "function") {
                ghost.querySelectorAll("input, button").forEach((el) => {
                    if (isHtmlElementLike(el) && typeof el.setAttribute === "function") {
                        el.setAttribute("tabindex", "-1");
                    }
                    if (el && typeof el === "object" && "disabled" in el) {
                        el.disabled = true;
                    }
                });
            }

            const rect = (typeof item.getBoundingClientRect === "function")
                ? item.getBoundingClientRect()
                : { width: 120 };

            ghost.style.position = "fixed";
            ghost.style.left = "-10000px";
            ghost.style.top = "-10000px";
            ghost.style.width = `${Math.max(120, Math.round(Number(rect.width) || 120))}px`;
            ghost.style.pointerEvents = "none";
            ghost.style.zIndex = "10000";

            doc.body.appendChild(ghost);
            copyFormatDragGhostEl = ghost;
            return ghost;
        }

        function captureCopyFormatItemRects(list) {
            const rectMap = new Map();
            if (!isElementLike(list) || typeof list.querySelectorAll !== "function") return rectMap;
            list.querySelectorAll(".copy-format-item:not(.dragging)").forEach((item) => {
                if (typeof item?.getBoundingClientRect !== "function") return;
                rectMap.set(item, item.getBoundingClientRect());
            });
            return rectMap;
        }

        function animateCopyFormatReorder(list, beforeRects) {
            if (!isElementLike(list) || typeof list.querySelectorAll !== "function") return;
            list.querySelectorAll(".copy-format-item:not(.dragging)").forEach((item) => {
                const before = beforeRects.get(item);
                if (!before || typeof item?.getBoundingClientRect !== "function") return;
                const after = item.getBoundingClientRect();
                const deltaX = before.left - after.left;
                const deltaY = before.top - after.top;
                if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return;
                if (!item.style || typeof item.style !== "object") return;

                item.style.transition = "none";
                item.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                requestUiFrame(() => {
                    if (!item.style || typeof item.style !== "object") return;
                    item.style.transition = "transform 170ms ease";
                    item.style.transform = "";
                });
                if (typeof item.addEventListener === "function") {
                    item.addEventListener("transitionend", () => {
                        if (!item.style || typeof item.style !== "object") return;
                        item.style.transition = "";
                    }, { once: true });
                }
            });
        }

        function getCopyFieldLabel(key) {
            const keyMap = {
                timezone: "copy_field_timezone",
                region: "copy_field_region",
                offset: "copy_field_offset",
                time: "copy_field_time",
                period_days: "copy_field_period",
                period_time: "copy_field_period_time"
            };
            return translate(keyMap[key] || key);
        }

        function getTimePartLabel(partKey) {
            const map = {
                dn: "copy_time_part_dn",
                date: "copy_time_part_date",
                time: "copy_time_part_time",
                weekday: "copy_time_part_weekday"
            };
            return translate(map[partKey] || partKey);
        }

        function closeAllTimePartsMenus() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.querySelectorAll !== "function") return;
            doc.querySelectorAll(".time-parts-dropdown.open").forEach((el) => {
                if (el?.classList && typeof el.classList.remove === "function") {
                    el.classList.remove("open");
                }
            });
        }

        function bindTimePartsOutsideClickHandler() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.addEventListener !== "function") return;
            if (timePartsOutsideHandlerBound) return;
            doc.addEventListener("click", (e) => {
                const target = e?.target;
                if (typeof Element !== "undefined" && target && !(target instanceof Element)) return;
                if (target?.closest?.(".time-parts-dropdown")) return;
                closeAllTimePartsMenus();
            });
            timePartsOutsideHandlerBound = true;
        }

        function getCopyFormatDropTarget(container, x, y = null) {
            if (!isElementLike(container) || typeof container.querySelectorAll !== "function") return null;
            const draggableItems = Array.from(container.querySelectorAll(".copy-format-item:not(.dragging)") || []);
            if (!draggableItems.length) return null;

            if (typeof y === "number") {
                for (const child of draggableItems) {
                    if (typeof child?.getBoundingClientRect !== "function") continue;
                    const box = child.getBoundingClientRect();
                    const halfY = box.top + (box.height / 2);
                    const halfX = box.left + (box.width / 2);
                    const inSameRow = y >= box.top && y <= box.bottom;

                    if (y < halfY || (inSameRow && x < halfX)) {
                        return child;
                    }
                }
                return null;
            }

            return draggableItems.reduce((closest, child) => {
                if (typeof child?.getBoundingClientRect !== "function") return closest;
                const box = child.getBoundingClientRect();
                const offset = x - box.left - box.width / 2;
                if (offset < 0 && offset > closest.offset) return { offset, element: child };
                return closest;
            }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
        }

        function renderFormatControlList(list, order, enabled, options = {}) {
            const doc = getDocumentRef();
            const safeOrder = Array.isArray(order) ? order : [];
            const safeEnabled = (enabled && typeof enabled === "object") ? enabled : {};
            const { onToggle, onReorder, timePartsEnabled, onTimePartToggle } = options;
            if (!isElementLike(list) || !doc || typeof doc.createElement !== "function") return;

            bindTimePartsOutsideClickHandler();
            list.textContent = "";
            safeOrder.forEach((key) => {
                if (!getCopyFormatKeys().includes(key)) return;

                const item = doc.createElement("div");
                item.className = "copy-format-item";
                item.dataset.key = key;
                item.draggable = false;

                const dragHandle = doc.createElement("span");
                dragHandle.className = "copy-format-drag";
                dragHandle.textContent = "⋮⋮";
                dragHandle.draggable = true;

                const label = doc.createElement("label");
                label.className = "copy-format-item-label";

                const checkbox = doc.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = !!safeEnabled[key];
                checkbox.addEventListener("change", () => {
                    if (typeof onToggle === "function") onToggle(key, checkbox.checked);
                });

                const text = doc.createElement("span");
                text.textContent = getCopyFieldLabel(key);

                label.appendChild(checkbox);
                label.appendChild(text);
                item.appendChild(dragHandle);
                item.appendChild(label);

                if (key === "time") {
                    const dropdown = doc.createElement("div");
                    dropdown.className = "time-parts-dropdown";

                    const partsBtn = doc.createElement("button");
                    partsBtn.type = "button";
                    partsBtn.className = "time-parts-toggle-btn";
                    partsBtn.textContent = translate("btn_time_parts");
                    partsBtn.addEventListener("click", (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const willOpen = !!dropdown.classList && !dropdown.classList.contains("open");
                        closeAllTimePartsMenus();
                        if (willOpen && dropdown.classList && typeof dropdown.classList.add === "function") {
                            dropdown.classList.add("open");
                        }
                    });

                    const menu = doc.createElement("div");
                    menu.className = "time-parts-menu";
                    getTimePartKeys().forEach((partKey) => {
                        const rowEl = doc.createElement("label");
                        rowEl.className = "time-parts-option";

                        const cb = doc.createElement("input");
                        cb.type = "checkbox";
                        cb.checked = !!timePartsEnabled?.[partKey];
                        cb.addEventListener("change", () => {
                            if (typeof onTimePartToggle === "function") onTimePartToggle(partKey, cb.checked);
                        });

                        const txt = doc.createElement("span");
                        txt.textContent = getTimePartLabel(partKey);

                        rowEl.appendChild(cb);
                        rowEl.appendChild(txt);
                        menu.appendChild(rowEl);
                    });

                    dropdown.appendChild(partsBtn);
                    dropdown.appendChild(menu);
                    item.appendChild(dropdown);
                }

                dragHandle.addEventListener("dragstart", (e) => {
                    if (item.classList && typeof item.classList.add === "function") item.classList.add("dragging");
                    if (e.dataTransfer) {
                        e.dataTransfer.effectAllowed = "move";
                        e.dataTransfer.setData("text/plain", key);
                        const ghost = createCopyFormatDragGhost(item);
                        e.dataTransfer.setDragImage(ghost || item, 12, 12);
                    }
                });
                dragHandle.addEventListener("dragend", () => {
                    if (item.classList && typeof item.classList.remove === "function") item.classList.remove("dragging");
                    clearCopyFormatDragGhost();
                    if (typeof list.querySelectorAll !== "function") return;
                    const nextOrder = Array.from(list.querySelectorAll(".copy-format-item") || []).map((el) => el?.dataset?.key);
                    if (typeof onReorder === "function") onReorder(nextOrder);
                });

                list.appendChild(item);
            });

            list.ondragover = (e) => {
                const dragging = (typeof list.querySelector === "function")
                    ? list.querySelector(".copy-format-item.dragging")
                    : null;
                if (!dragging) return;
                e.preventDefault();
                const beforeRects = captureCopyFormatItemRects(list);
                const after = getCopyFormatDropTarget(list, e.clientX, e.clientY);
                if (after === dragging || dragging.nextElementSibling === after) return;
                if (typeof list.insertBefore === "function") {
                    list.insertBefore(dragging, after);
                    animateCopyFormatReorder(list, beforeRects);
                }
            };

            list.ondrop = (e) => {
                const dragging = (typeof list.querySelector === "function")
                    ? list.querySelector(".copy-format-item.dragging")
                    : null;
                if (!dragging) return;
                e.preventDefault();
                clearCopyFormatDragGhost();
            };
        }

        function renderCopyFormatControls() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function") return;
            const row = doc.getElementById("copy-format-row");
            const displayList = doc.getElementById("display-format-list");
            const copyList = doc.getElementById("copy-format-list");
            if (!row || !displayList || !copyList) return;

            const showCopyFormat = !!invokeDep("isShowCopyFormat");
            row.style.display = showCopyFormat ? "flex" : "none";
            if (!showCopyFormat) {
                displayList.textContent = "";
                copyList.textContent = "";
                invokeDep("updateCopyFormatPreview");
                return;
            }

            renderFormatControlList(
                displayList,
                invokeDep("getDisplayFormatOrder"),
                invokeDep("getDisplayFormatEnabled"),
                {
                    onToggle: (key, checked) => {
                        const currentEnabled = invokeDep("getDisplayFormatEnabled");
                        invokeDep("setDisplayFormatEnabled", {
                            ...((currentEnabled && typeof currentEnabled === "object") ? currentEnabled : {}),
                            [key]: checked
                        });
                        invokeDep("renderList");
                        invokeDep("updateCopyFormatPreview");
                        invokeDep("savePersistence");
                    },
                    onReorder: (nextOrder) => {
                        invokeDep("setDisplayFormatOrder", invokeDep("sanitizeCopyFormatOrder", nextOrder));
                        invokeDep("renderList");
                        invokeDep("updateCopyFormatPreview");
                        invokeDep("savePersistence");
                    },
                    timePartsEnabled: invokeDep("getDisplayTimePartsEnabled"),
                    onTimePartToggle: (partKey, checked) => {
                        const currentParts = invokeDep("getDisplayTimePartsEnabled");
                        invokeDep("setDisplayTimePartsEnabled", {
                            ...((currentParts && typeof currentParts === "object") ? currentParts : {}),
                            [partKey]: checked
                        });
                        invokeDep("renderList");
                        invokeDep("updateCopyFormatPreview");
                        invokeDep("savePersistence");
                    }
                }
            );

            renderFormatControlList(
                copyList,
                invokeDep("getCopyFormatOrder"),
                invokeDep("getCopyFormatEnabled"),
                {
                    onToggle: (key, checked) => {
                        const currentEnabled = invokeDep("getCopyFormatEnabled");
                        invokeDep("setCopyFormatEnabled", {
                            ...((currentEnabled && typeof currentEnabled === "object") ? currentEnabled : {}),
                            [key]: checked
                        });
                        invokeDep("updateCopyFormatPreview");
                        invokeDep("savePersistence");
                    },
                    onReorder: (nextOrder) => {
                        invokeDep("setCopyFormatOrder", invokeDep("sanitizeCopyFormatOrder", nextOrder));
                        invokeDep("updateCopyFormatPreview");
                        invokeDep("savePersistence");
                    },
                    timePartsEnabled: invokeDep("getCopyTimePartsEnabled"),
                    onTimePartToggle: (partKey, checked) => {
                        const currentParts = invokeDep("getCopyTimePartsEnabled");
                        invokeDep("setCopyTimePartsEnabled", {
                            ...((currentParts && typeof currentParts === "object") ? currentParts : {}),
                            [partKey]: checked
                        });
                        invokeDep("updateCopyFormatPreview");
                        invokeDep("savePersistence");
                    }
                }
            );

            invokeDep("updateCopyFormatPreview");
            invokeDep("upgradeNativeTitleTooltips", row);
        }

        return Object.freeze({
            getCopyFieldLabel,
            getTimePartLabel,
            closeAllTimePartsMenus,
            bindTimePartsOutsideClickHandler,
            getCopyFormatDropTarget,
            renderFormatControlList,
            renderCopyFormatControls
        });
    }

    globalObj.GTVFormatControls = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/tab-ui.js ---
(function initGtvTabUi(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function getDocumentRef() {
            return (typeof document === "object" && document) ? document : null;
        }

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (err) {
                console.warn(`[GTVTabUI] Dependency "${name}" threw.`, err);
                return undefined;
            }
        }

        function getBooleanDep(name, fallback = false) {
            const value = invokeDep(name);
            if (value === undefined) return !!fallback;
            return !!value;
        }

        function getMainTab(value) {
            if (value === "live" || value === "fixed" || value === "multi" || value === "calc" || value === "fixed-time") {
                return value;
            }
            return "live";
        }

        function sanitizeMainTab(tab) {
            const nextTab = invokeDep("sanitizeMainTab", tab);
            if (typeof nextTab === "string" && nextTab.trim()) return nextTab;
            return getMainTab(tab);
        }

        function clampGroupIndex(index) {
            const clamped = invokeDep("clampGroupIndex", index);
            const numeric = Number(clamped);
            if (Number.isFinite(numeric)) return numeric;
            const parsed = Number(index);
            if (Number.isFinite(parsed)) return Math.max(0, parsed);
            return 0;
        }

        function toggleClass(el, className, enabled) {
            if (!el || typeof el !== "object") return;
            if (!el.classList || typeof el.classList.toggle !== "function") return;
            el.classList.toggle(className, !!enabled);
        }

        function getElementDisplay(el) {
            const display = el?.style?.display;
            return (typeof display === "string") ? display : "";
        }

        function setElementDisplay(el, value) {
            if (!el || typeof el !== "object") return;
            if (!el.style || typeof el.style !== "object") return;
            el.style.display = value;
        }

        function refreshOptionToggleDividers() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function") return;
            const optionRow = doc.getElementById("control-option-row");
            if (!optionRow || typeof optionRow.querySelectorAll !== "function") return;
            const optionGroups = Array.from(optionRow.querySelectorAll(".option-toggle-group") || []);
            optionGroups.forEach((group) => {
                if (group?.classList && typeof group.classList.remove === "function") {
                    group.classList.remove("option-with-divider");
                }
            });
            const visibleGroups = optionGroups.filter((group) => getElementDisplay(group) !== "none");
            visibleGroups.forEach((group, idx) => {
                if (idx < visibleGroups.length - 1 && group?.classList && typeof group.classList.add === "function") {
                    group.classList.add("option-with-divider");
                }
            });
        }

        function updateOptionRowVisibility() {
            const doc = getDocumentRef();
            if (!doc || typeof doc.getElementById !== "function") return;
            const optionRow = doc.getElementById("control-option-row");
            if (!optionRow) return;

            const extraTimeGroup = doc.getElementById("toggle-extra-time")?.closest?.(".control-group");
            const copyFormatGroup = doc.getElementById("toggle-copy-format")?.closest?.(".control-group");
            const timelineGroup = doc.getElementById("toggle-timeline")?.closest?.(".control-group");
            const copyFormatRow = doc.getElementById("copy-format-row");
            const fixedTimeSlotCountGroup = doc.getElementById("fixed-time-slot-count-group");
            const fixedTimeDateGroup = doc.getElementById("fixed-time-date-group");
            const rangeCountGroup = doc.getElementById("multi-range-count-group");
            const multiToolsRow = doc.getElementById("multi-tools-row");
            const multiSubgroupRow = doc.getElementById("multi-subgroup-row");
            const multiControlsFrame = doc.getElementById("multi-controls-frame");
            const saveTableImageBtn = doc.getElementById("save-table-image-btn");
            const saveMultiRangeTitlesImageBtn = doc.getElementById("save-multi-range-titles-image-btn");
            const isMulti = getBooleanDep("isMultiTab");
            const isFixedTime = getBooleanDep("isFixedTimeTab");
            const isRealtime = getBooleanDep("getIsRealtime");

            setElementDisplay(optionRow, "flex");
            setElementDisplay(extraTimeGroup, (isRealtime || isMulti || isFixedTime) ? "none" : "flex");
            setElementDisplay(copyFormatGroup, "flex");
            setElementDisplay(timelineGroup, isMulti ? "none" : "flex");
            setElementDisplay(fixedTimeSlotCountGroup, isFixedTime ? "flex" : "none");
            setElementDisplay(fixedTimeDateGroup, isFixedTime ? "flex" : "none");
            setElementDisplay(rangeCountGroup, isMulti ? "flex" : "none");
            setElementDisplay(multiControlsFrame, isMulti ? "block" : "none");
            setElementDisplay(multiSubgroupRow, isMulti ? "flex" : "none");
            setElementDisplay(multiToolsRow, isMulti ? "flex" : "none");
            setElementDisplay(saveTableImageBtn, "");
            setElementDisplay(saveMultiRangeTitlesImageBtn, isMulti ? "" : "none");
            if (!getBooleanDep("getShowCopyFormat") && copyFormatRow) setElementDisplay(copyFormatRow, "none");
            invokeDep("refreshMultiRangeControls");
            refreshOptionToggleDividers();
        }

        function switchMainTab(tab) {
            const doc = getDocumentRef();
            const nextTab = sanitizeMainTab(tab);
            invokeDep("hideFloatingTooltip");
            invokeDep("syncCurrentMultiStateToActiveSubgroup");

            let currentMainTab = getMainTab(invokeDep("getCurrentMainTab"));
            let activeGroupId = clampGroupIndex(invokeDep("getActiveGroupId"));
            const rawActiveGroupIdByMainTab = invokeDep("getActiveGroupIdByMainTab");
            const activeGroupIdByMainTab = {
                live: 0,
                fixed: 0,
                ...((rawActiveGroupIdByMainTab && typeof rawActiveGroupIdByMainTab === "object")
                    ? rawActiveGroupIdByMainTab
                    : {})
            };

            if (currentMainTab === "live" || currentMainTab === "fixed") {
                activeGroupIdByMainTab[currentMainTab] = clampGroupIndex(activeGroupId);
            }

            currentMainTab = nextTab;
            if (currentMainTab === "live" || currentMainTab === "fixed") {
                activeGroupId = clampGroupIndex(activeGroupIdByMainTab[currentMainTab]);
            } else {
                activeGroupId = clampGroupIndex(activeGroupId);
            }

            invokeDep("setCurrentMainTab", currentMainTab);
            invokeDep("setActiveGroupId", activeGroupId);
            invokeDep("setActiveGroupIdByMainTab", activeGroupIdByMainTab);
            invokeDep("normalizeGroupTabState");

            if (doc && typeof doc.querySelectorAll === "function") {
                const navButtons = Array.from(doc.querySelectorAll(".nav-item") || []);
                navButtons.forEach((btn) => {
                    toggleClass(btn, "active", btn?.dataset?.tab === currentMainTab);
                });
            }
            const isMulti = getBooleanDep("isMultiTab");
            const isCalc = currentMainTab === "calc";
            const isFixedTime = getBooleanDep("isFixedTimeTab");
            toggleClass(doc?.getElementById?.("timezone-section"), "active", !isCalc && !isMulti && !isFixedTime);
            toggleClass(doc?.getElementById?.("fixed-time-section"), "active", isFixedTime);
            toggleClass(doc?.getElementById?.("multi-range-section"), "active", isMulti);
            toggleClass(doc?.getElementById?.("calc-section"), "active", isCalc);
            const groupTabsContainer = doc?.getElementById?.("group-tabs-container");
            if (groupTabsContainer) groupTabsContainer.style.display = isCalc ? "none" : "flex";
            const topControlBar = doc?.getElementById?.("top-control-bar");
            if (topControlBar) topControlBar.style.display = isCalc ? "none" : "flex";

            invokeDep("setIsRealtime", currentMainTab === "live");
            const isRealtime = getBooleanDep("getIsRealtime");
            if (isRealtime) {
                invokeDep("syncRealtimeNow");
            }
            const extraTimeToggle = doc?.getElementById?.("toggle-extra-time");
            const copyFormatToggle = doc?.getElementById?.("toggle-copy-format");
            const timelineToggle = doc?.getElementById?.("toggle-timeline");

            if (extraTimeToggle) {
                extraTimeToggle.disabled = isRealtime || isMulti || isFixedTime;
                if (isRealtime) extraTimeToggle.checked = false;
                else if (isFixedTime) extraTimeToggle.checked = false;
                else if (isMulti) extraTimeToggle.checked = true;
                else extraTimeToggle.checked = (Number(invokeDep("getSlotCount")) > 1);
            }

            if (copyFormatToggle) {
                copyFormatToggle.checked = getBooleanDep("getShowCopyFormat");
            }
            if (timelineToggle) {
                timelineToggle.checked = getBooleanDep("getShowTimeline");
            }
            updateOptionRowVisibility();
            invokeDep("renderTimelineFrame");

            if (isMulti) {
                invokeDep("renderBaseTimeSelect");
                invokeDep("loadCurrentMultiStateFromActiveSubgroup");
            }
            invokeDep("renderGroups");
            invokeDep("renderMultiSubgroups");
            if (isMulti) {
                invokeDep("renderMultiRanges");
            } else if (isFixedTime) {
                invokeDep("renderFixedTimeTab");
                invokeDep("updateTimeAdjustPanel");
            } else {
                invokeDep("renderList");
                invokeDep("updateTimeAdjustPanel");
            }
            invokeDep("renderCopyFormatControls");
            invokeDep("savePersistence");
        }

        return Object.freeze({
            switchMainTab,
            updateOptionRowVisibility,
            refreshOptionToggleDividers
        });
    }

    globalObj.GTVTabUI = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/tab-orchestrator.js ---
(function initGtvTabOrchestrator(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (_err) {
                return undefined;
            }
        }

        function switchMainTab(tab) {
            const safeTab = invokeDep("sanitizeMainTab", tab);
            const slotCount = invokeDep("getSlotCount");
            invokeDep("syncActiveFormatProfileFromState");
            const nextContext = invokeDep("resolveFormatProfileContext", safeTab, slotCount);
            invokeDep("activateFormatProfileContext", nextContext, { syncCurrent: false });
            return invokeDep("switchMainTabUi", safeTab);
        }

        function refreshOptionToggleDividers() {
            return invokeDep("refreshOptionToggleDividersUi");
        }

        return Object.freeze({
            switchMainTab,
            refreshOptionToggleDividers
        });
    }

    globalObj.GTVTabOrchestrator = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/main-ui-init.js ---
(function initGtvMainUiInit(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const t = deps.t || ((key) => key);
        const switchMainTab = deps.switchMainTab;
        const populateUiScaleSelect = deps.populateUiScaleSelect;
        const getUiScale = deps.getUiScale;
        const applyUiScale = deps.applyUiScale;
        const getMultiRangeCount = deps.getMultiRangeCount;
        const setMultiRangeCount = deps.setMultiRangeCount;
        const refreshMultiRangeControls = deps.refreshMultiRangeControls;
        const getFixedTimeSlotCountForCurrentGroup = deps.getFixedTimeSlotCountForCurrentGroup;
        const setFixedTimeSlotCount = deps.setFixedTimeSlotCount;
        const refreshFixedTimeSlotCountControls = deps.refreshFixedTimeSlotCountControls;
        const bindCustomDatePickerForInput = deps.bindCustomDatePickerForInput;
        const getCurrentGroup = deps.getCurrentGroup;
        const ensureGroupFixedTimes = deps.ensureGroupFixedTimes;
        const setCurrentGroupFixedDate = deps.setCurrentGroupFixedDate;
        const sanitizeFixedDateValue = deps.sanitizeFixedDateValue;
        const showToast = deps.showToast;
        const normalizeCustomAbbr = deps.normalizeCustomAbbr;
        const addTimezone = deps.addTimezone;
        const createUniqueTimezoneId = deps.createUniqueTimezoneId;
        const syncActiveFormatProfileFromState = deps.syncActiveFormatProfileFromState;
        const getSlotCount = deps.getSlotCount;
        const setSlotCount = deps.setSlotCount;
        const activateFormatProfileForCurrentContext = deps.activateFormatProfileForCurrentContext;
        const renderList = deps.renderList;
        const renderCopyFormatControls = deps.renderCopyFormatControls;
        const updateCopyFormatPreview = deps.updateCopyFormatPreview;
        const savePersistence = deps.savePersistence;
        const getShowCopyFormat = deps.getShowCopyFormat;
        const setShowCopyFormat = deps.setShowCopyFormat;
        const getShowTimeline = deps.getShowTimeline;
        const setShowTimeline = deps.setShowTimeline;
        const renderTimelineFrame = deps.renderTimelineFrame;
        const resetDisplayFormatForActiveContext = deps.resetDisplayFormatForActiveContext;
        const resetCopyFormatForActiveContext = deps.resetCopyFormatForActiveContext;
        const applyCurrentGroupBaseTimezoneId = deps.applyCurrentGroupBaseTimezoneId;
        const addGroup = deps.addGroup;
        const addMultiSubgroup = deps.addMultiSubgroup;
        const copyAllTimezones = deps.copyAllTimezones;
        const saveTimezoneTableImage = deps.saveTimezoneTableImage;
        const saveMultiRangeTitlesImage = deps.saveMultiRangeTitlesImage;
        const bindTransferControls = deps.bindTransferControls;
        const getCurrentTheme = deps.getCurrentTheme;
        const applyTheme = deps.applyTheme;
        const refreshCalculator = deps.refreshCalculator;
        const getCurrentLang = deps.getCurrentLang;
        const hideFloatingTooltip = deps.hideFloatingTooltip;
        const setLanguage = deps.setLanguage;
        const localizeAutoGeneratedNamesForCurrentLanguage = deps.localizeAutoGeneratedNamesForCurrentLanguage;
        const applyVersionBranding = deps.applyVersionBranding;
        const updateTZDropdown = deps.updateTZDropdown;
        const renderGroups = deps.renderGroups;
        const renderMultiSubgroups = deps.renderMultiSubgroups;
        const updateTimeAdjustPanel = deps.updateTimeAdjustPanel;
        const refreshSelectWidths = deps.refreshSelectWidths;
        const bindResetControls = deps.bindResetControls;
        const renderBaseTimeSelect = deps.renderBaseTimeSelect;
        const updateOptionRowVisibility = deps.updateOptionRowVisibility;
        const upgradeNativeTitleTooltips = deps.upgradeNativeTitleTooltips;

        function initUI() {
            // Main Tabs
            document.querySelectorAll(".nav-item").forEach((btn) => {
                btn.addEventListener("click", () => switchMainTab(btn.dataset.tab));
            });

            const uiScaleSelect = document.getElementById("ui-scale-select");
            if (uiScaleSelect) {
                populateUiScaleSelect(uiScaleSelect);
                uiScaleSelect.value = String(Math.round(getUiScale() * 100));
                uiScaleSelect.addEventListener("change", (e) => {
                    applyUiScale(e.target.value);
                    uiScaleSelect.value = String(Math.round(getUiScale() * 100));
                });
            }

            const multiRangeCountInput = document.getElementById("multi-range-count-input");
            const multiRangeDecreaseBtn = document.getElementById("multi-range-count-decrease");
            const multiRangeIncreaseBtn = document.getElementById("multi-range-count-increase");
            if (multiRangeCountInput) {
                const commitRangeCount = () => {
                    setMultiRangeCount(multiRangeCountInput.value, { persist: true, rerender: true, showBoundaryToast: true });
                };
                multiRangeCountInput.addEventListener("input", () => {
                    multiRangeCountInput.value = String(multiRangeCountInput.value || "").replace(/[^0-9]/g, "");
                });
                multiRangeCountInput.addEventListener("change", commitRangeCount);
                multiRangeCountInput.addEventListener("blur", commitRangeCount);
                multiRangeCountInput.addEventListener("keydown", (e) => {
                    if (e.key !== "Enter") return;
                    commitRangeCount();
                    multiRangeCountInput.blur();
                });
            }
            if (multiRangeDecreaseBtn) {
                multiRangeDecreaseBtn.addEventListener("click", () => {
                    setMultiRangeCount(getMultiRangeCount() - 1, { persist: true, rerender: true, showBoundaryToast: true });
                });
            }
            if (multiRangeIncreaseBtn) {
                multiRangeIncreaseBtn.addEventListener("click", () => {
                    setMultiRangeCount(getMultiRangeCount() + 1, { persist: true, rerender: true, showBoundaryToast: true });
                });
            }

            refreshMultiRangeControls();
            const fixedTimeSlotCountInput = document.getElementById("fixed-time-slot-count-input");
            const fixedTimeSlotDecreaseBtn = document.getElementById("fixed-time-slot-count-decrease");
            const fixedTimeSlotIncreaseBtn = document.getElementById("fixed-time-slot-count-increase");
            const fixedTimeDateInput = document.getElementById("fixed-time-date-input");
            const fixedTimeDateTrigger = document.getElementById("fixed-time-date-trigger");
            if (fixedTimeSlotCountInput) {
                const commitFixedTimeSlotCount = () => {
                    setFixedTimeSlotCount(fixedTimeSlotCountInput.value, { persist: true, rerender: true, showBoundaryToast: true });
                };
                fixedTimeSlotCountInput.addEventListener("input", () => {
                    fixedTimeSlotCountInput.value = String(fixedTimeSlotCountInput.value || "").replace(/[^0-9]/g, "");
                });
                fixedTimeSlotCountInput.addEventListener("change", commitFixedTimeSlotCount);
                fixedTimeSlotCountInput.addEventListener("blur", commitFixedTimeSlotCount);
                fixedTimeSlotCountInput.addEventListener("keydown", (e) => {
                    if (e.key !== "Enter") return;
                    commitFixedTimeSlotCount();
                    fixedTimeSlotCountInput.blur();
                });
            }
            if (fixedTimeSlotDecreaseBtn) {
                fixedTimeSlotDecreaseBtn.addEventListener("click", () => {
                    const nextCount = getFixedTimeSlotCountForCurrentGroup() - 1;
                    setFixedTimeSlotCount(nextCount, { persist: true, rerender: true, showBoundaryToast: true });
                });
            }
            if (fixedTimeSlotIncreaseBtn) {
                fixedTimeSlotIncreaseBtn.addEventListener("click", () => {
                    const nextCount = getFixedTimeSlotCountForCurrentGroup() + 1;
                    setFixedTimeSlotCount(nextCount, { persist: true, rerender: true, showBoundaryToast: true });
                });
            }
            if (fixedTimeDateInput && fixedTimeDateTrigger) {
                bindCustomDatePickerForInput(fixedTimeDateInput, fixedTimeDateTrigger, { preserveValue: true, type: "date" });
            }
            if (fixedTimeDateInput) {
                const commitFixedDate = () => {
                    const group = getCurrentGroup();
                    if (!group) return;
                    ensureGroupFixedTimes(group);
                    const before = group.fixedDate || "";
                    const rawInput = String(fixedTimeDateInput.value || "").trim();
                    if (!rawInput) {
                        setCurrentGroupFixedDate("", { persist: true, rerender: true });
                        fixedTimeDateInput.value = "";
                        return;
                    }
                    const normalized = sanitizeFixedDateValue(rawInput, "");
                    if (!normalized) {
                        showToast(t("toast_invalid_date"));
                        fixedTimeDateInput.value = before;
                        return;
                    }
                    const changed = setCurrentGroupFixedDate(normalized, { persist: true, rerender: true });
                    fixedTimeDateInput.value = changed ? normalized : (getCurrentGroup()?.fixedDate || normalized);
                };
                fixedTimeDateInput.addEventListener("input", () => {
                    fixedTimeDateInput.value = String(fixedTimeDateInput.value || "").replace(/[^0-9-]/g, "").slice(0, 10);
                });
                fixedTimeDateInput.addEventListener("change", commitFixedDate);
                fixedTimeDateInput.addEventListener("blur", commitFixedDate);
                fixedTimeDateInput.addEventListener("keydown", (e) => {
                    if (e.key !== "Enter") return;
                    commitFixedDate();
                    fixedTimeDateInput.blur();
                });
            }
            refreshFixedTimeSlotCountControls();

            // Populate Custom Offset Hour Select
            const hSel = document.getElementById("custom-off-h");
            if (hSel) {
                for (let i = 14; i >= -12; i--) {
                    const o = document.createElement("option");
                    o.value = i;
                    const sign = i > 0 ? "+" : (i < 0 ? "-" : "+");
                    o.textContent = `${sign}${String(Math.abs(i)).padStart(2, "0")}`;
                    if (i === 0) o.selected = true;
                    hSel.appendChild(o);
                }
            }

            // Extra Time Toggle
            const extraTimeToggle = document.getElementById("toggle-extra-time");
            if (extraTimeToggle) {
                extraTimeToggle.checked = getSlotCount() > 1;
                extraTimeToggle.addEventListener("change", (e) => {
                    syncActiveFormatProfileFromState();
                    setSlotCount(e.target.checked ? 2 : 1);
                    activateFormatProfileForCurrentContext({ syncCurrent: false });
                    renderList();
                    renderCopyFormatControls();
                    updateCopyFormatPreview();
                    savePersistence();
                });
            }

            const copyFormatToggle = document.getElementById("toggle-copy-format");
            if (copyFormatToggle) {
                copyFormatToggle.checked = getShowCopyFormat();
                copyFormatToggle.addEventListener("change", (e) => {
                    setShowCopyFormat(!!e.target.checked);
                    renderCopyFormatControls();
                    savePersistence();
                });
            }
            const timelineToggle = document.getElementById("toggle-timeline");
            if (timelineToggle) {
                timelineToggle.checked = getShowTimeline();
                timelineToggle.addEventListener("change", (e) => {
                    setShowTimeline(!!e.target.checked);
                    renderTimelineFrame();
                    savePersistence();
                });
            }

            const displayFormatResetBtn = document.getElementById("display-format-reset-btn");
            if (displayFormatResetBtn) {
                displayFormatResetBtn.addEventListener("click", () => {
                    resetDisplayFormatForActiveContext();
                    renderCopyFormatControls();
                    renderList();
                    savePersistence();
                });
            }

            const copyFormatResetBtn = document.getElementById("copy-format-reset-btn");
            if (copyFormatResetBtn) {
                copyFormatResetBtn.addEventListener("click", () => {
                    resetCopyFormatForActiveContext();
                    renderCopyFormatControls();
                    savePersistence();
                });
            }

            const baseTimeSelect = document.getElementById("base-time-select");
            if (baseTimeSelect) {
                baseTimeSelect.addEventListener("change", (e) => {
                    applyCurrentGroupBaseTimezoneId(e.target.value || "utc", { persist: true });
                });
            }

            // Custom Zone
            const addCustomBtn = document.getElementById("add-custom-btn");
            if (addCustomBtn) {
                addCustomBtn.addEventListener("click", () => {
                    const abbrInput = document.getElementById("custom-abbr");
                    const nameInput = document.getElementById("custom-name");
                    const offHInput = document.getElementById("custom-off-h");
                    const offMInput = document.getElementById("custom-off-m");
                    const abbr = normalizeCustomAbbr(abbrInput?.value);
                    const name = (nameInput?.value || "").trim();
                    const offH = parseInt(offHInput?.value, 10) || 0;
                    const offM = parseInt(offMInput?.value, 10) || 0;
                    if (!name) return showToast(t("toast_input_name"));
                    addTimezone({ id: createUniqueTimezoneId("tz-c"), abbr, name, offH, offM, type: "custom" });
                    if (abbrInput) abbrInput.value = "";
                    if (nameInput) nameInput.value = "";
                });
            }

            const addGroupBtn = document.getElementById("add-group-btn");
            if (addGroupBtn) {
                addGroupBtn.addEventListener("click", () => {
                    addGroup();
                });
            }
            const addMultiSubgroupBtn = document.getElementById("add-multi-subgroup-btn");
            if (addMultiSubgroupBtn) {
                addMultiSubgroupBtn.addEventListener("click", () => {
                    addMultiSubgroup();
                });
            }

            const copyAllBtn = document.getElementById("copy-all-btn");
            if (copyAllBtn) {
                copyAllBtn.addEventListener("click", copyAllTimezones);
            }
            const saveTableImageBtn = document.getElementById("save-table-image-btn");
            if (saveTableImageBtn) {
                saveTableImageBtn.addEventListener("click", () => {
                    saveTimezoneTableImage();
                });
            }
            const saveMultiRangeTitlesImageBtn = document.getElementById("save-multi-range-titles-image-btn");
            if (saveMultiRangeTitlesImageBtn) {
                saveMultiRangeTitlesImageBtn.addEventListener("click", () => {
                    saveMultiRangeTitlesImage();
                });
            }
            bindTransferControls();

            const themeSelect = document.getElementById("theme-select");
            if (themeSelect) {
                themeSelect.value = getCurrentTheme();
                themeSelect.addEventListener("change", async (e) => {
                    await applyTheme(e.target.value);
                    refreshCalculator();
                });
            }

            // Language Selector
            const langSelect = document.getElementById("lang-select");
            if (langSelect) {
                langSelect.value = getCurrentLang();
                langSelect.addEventListener("change", (e) => {
                    hideFloatingTooltip();
                    setLanguage(e.target.value);
                    if (localizeAutoGeneratedNamesForCurrentLanguage()) {
                        savePersistence();
                    }
                    applyVersionBranding();
                    updateTZDropdown();
                    renderGroups();
                    renderMultiSubgroups();
                    renderList();
                    updateTimeAdjustPanel();
                    renderCopyFormatControls();
                    refreshSelectWidths();
                    refreshCalculator();
                });
            }

            bindResetControls();

            document.querySelectorAll(".info-tip").forEach((tip) => {
                tip.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                });
            });

            renderBaseTimeSelect();
            refreshSelectWidths();
            updateOptionRowVisibility();
            updateTimeAdjustPanel();
            renderCopyFormatControls();
            renderTimelineFrame();
            upgradeNativeTitleTooltips(document);
        }

        return Object.freeze({
            initUI
        });
    }

    globalObj.GTVMainUiInit = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/main-ui-utils.js ---
(function initGtvMainUiUtils(globalObj) {
    "use strict";

    function createService() {
        let floatingTooltipEl = null;
        let floatingTooltipTarget = null;
        let floatingTooltipBound = false;
        let dragGhostEl = null;

        function isElementInstance(value) {
            if (!value || typeof value !== "object") return false;
            if (typeof Element === "undefined") return true;
            return value instanceof Element;
        }

        function isHtmlElementInstance(value) {
            if (!value || typeof value !== "object") return false;
            if (typeof HTMLElement === "undefined") return true;
            return value instanceof HTMLElement;
        }

        function setCustomTooltip(el, text) {
            if (!isElementInstance(el)) return;
            const tooltip = (typeof text === "string") ? text.trim() : "";
            if (!tooltip) {
                el.removeAttribute("data-tooltip");
                if (!el.classList.contains("info-tip")) el.classList.remove("custom-tooltip");
                el.removeAttribute("title");
                return;
            }
            el.setAttribute("data-tooltip", tooltip);
            el.setAttribute("aria-label", tooltip);
            el.removeAttribute("title");
            if (!el.classList.contains("info-tip")) el.classList.add("custom-tooltip");
        }

        function upgradeNativeTitleTooltips(root = document) {
            if (!root || typeof root.querySelectorAll !== "function") return;
            const candidates = root.querySelectorAll(
                'button.copy-row-btn[title], button.remove-row-btn[title]'
            );
            candidates.forEach((el) => {
                const text = (el.getAttribute("title") || "").trim();
                if (!text) {
                    el.removeAttribute("title");
                    return;
                }
                setCustomTooltip(el, text);
            });
        }

        function ensureFloatingTooltipElement() {
            if (floatingTooltipEl && floatingTooltipEl.isConnected) return floatingTooltipEl;
            const tooltip = document.createElement("div");
            tooltip.className = "app-floating-tooltip";
            tooltip.id = "app-floating-tooltip";
            document.body.appendChild(tooltip);
            floatingTooltipEl = tooltip;
            return tooltip;
        }

        function hideFloatingTooltip() {
            if (floatingTooltipEl) floatingTooltipEl.classList.remove("visible");
            floatingTooltipTarget = null;
        }

        function positionFloatingTooltip() {
            if (!floatingTooltipEl || !floatingTooltipTarget) return;
            if (!isElementInstance(floatingTooltipTarget) || !floatingTooltipTarget.isConnected) {
                hideFloatingTooltip();
                return;
            }

            const targetRect = floatingTooltipTarget.getBoundingClientRect();
            floatingTooltipEl.style.left = "0px";
            floatingTooltipEl.style.top = "0px";
            const tooltipRect = floatingTooltipEl.getBoundingClientRect();
            const viewportPadding = 8;
            const offset = 10;

            let left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
            left = Math.min(
                window.innerWidth - tooltipRect.width - viewportPadding,
                Math.max(viewportPadding, left)
            );

            let top = targetRect.top - tooltipRect.height - offset;
            if (top < viewportPadding) {
                top = targetRect.bottom + offset;
            }
            top = Math.min(
                window.innerHeight - tooltipRect.height - viewportPadding,
                Math.max(viewportPadding, top)
            );

            floatingTooltipEl.style.left = `${Math.round(left)}px`;
            floatingTooltipEl.style.top = `${Math.round(top)}px`;
        }

        function showFloatingTooltip(target) {
            if (!isElementInstance(target)) {
                hideFloatingTooltip();
                return;
            }
            const text = (target.getAttribute("data-tooltip") || "").trim();
            if (!text) {
                hideFloatingTooltip();
                return;
            }

            const tooltip = ensureFloatingTooltipElement();
            tooltip.textContent = text;
            floatingTooltipTarget = target;
            tooltip.classList.add("visible");
            positionFloatingTooltip();
        }

        function clearDragGhost() {
            if (!dragGhostEl) return;
            if (dragGhostEl.parentNode) {
                dragGhostEl.parentNode.removeChild(dragGhostEl);
            }
            dragGhostEl = null;
        }

        function createDragGhostFromRow(row) {
            if (!isHtmlElementInstance(row)) return null;
            clearDragGhost();

            const ghostTable = document.createElement("table");
            ghostTable.className = "data-table drag-ghost-table";
            ghostTable.setAttribute("aria-hidden", "true");

            const ghostBody = document.createElement("tbody");
            const ghostRow = row.cloneNode(true);
            if (isHtmlElementInstance(ghostRow)) {
                ghostRow.classList.remove("dragging");
                ghostRow.classList.add("drag-ghost-row");
                const sourceInputs = [...row.querySelectorAll(".time-input")];
                ghostRow.querySelectorAll(".time-input").forEach((input, idx) => {
                    const sourceValue = sourceInputs[idx]?.value;
                    if (typeof sourceValue === "string") input.value = sourceValue;
                    input.setAttribute("readonly", "readonly");
                });
            }
            ghostBody.appendChild(ghostRow);
            ghostTable.appendChild(ghostBody);

            const rect = row.getBoundingClientRect();
            ghostTable.style.width = `${Math.max(420, Math.round(rect.width))}px`;
            ghostTable.style.position = "fixed";
            ghostTable.style.left = "-10000px";
            ghostTable.style.top = "-10000px";
            ghostTable.style.pointerEvents = "none";
            ghostTable.style.zIndex = "10000";

            document.body.appendChild(ghostTable);
            dragGhostEl = ghostTable;
            return ghostTable;
        }

        function bindFloatingTooltipEvents() {
            if (floatingTooltipBound) return;
            floatingTooltipBound = true;

            document.addEventListener("pointerenter", (e) => {
                const target = isElementInstance(e.target) ? e.target.closest("[data-tooltip]") : null;
                if (!target) return;
                showFloatingTooltip(target);
            }, true);

            document.addEventListener("pointerleave", (e) => {
                const target = isElementInstance(e.target) ? e.target.closest("[data-tooltip]") : null;
                if (!target) return;
                const relatedTarget = e.relatedTarget;
                if (isElementInstance(relatedTarget) && target.contains(relatedTarget)) return;
                if (floatingTooltipTarget === target) hideFloatingTooltip();
            }, true);

            document.addEventListener("focusin", (e) => {
                const target = isElementInstance(e.target) ? e.target.closest("[data-tooltip]") : null;
                if (!target) return;
                showFloatingTooltip(target);
            }, true);

            document.addEventListener("focusout", (e) => {
                const target = isElementInstance(e.target) ? e.target.closest("[data-tooltip]") : null;
                if (!target) return;
                const relatedTarget = e.relatedTarget;
                if (isElementInstance(relatedTarget) && target.contains(relatedTarget)) return;
                if (floatingTooltipTarget === target) hideFloatingTooltip();
            }, true);

            window.addEventListener("scroll", positionFloatingTooltip, true);
            window.addEventListener("resize", positionFloatingTooltip, true);
            document.addEventListener("pointerdown", hideFloatingTooltip, true);
            document.addEventListener("keydown", hideFloatingTooltip, true);
        }

        return Object.freeze({
            setCustomTooltip,
            upgradeNativeTitleTooltips,
            hideFloatingTooltip,
            bindFloatingTooltipEvents,
            clearDragGhost,
            createDragGhostFromRow
        });
    }

    globalObj.GTVMainUiUtils = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/app-feedback.js ---
(function initGtvAppFeedback(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (_err) {
                return undefined;
            }
        }

        function getDocumentRef() {
            if (safeDeps.document && typeof safeDeps.document.getElementById === "function") {
                return safeDeps.document;
            }
            return (typeof document === "object" && document) ? document : null;
        }

        function getLocationRef() {
            if (safeDeps.location && typeof safeDeps.location.reload === "function") {
                return safeDeps.location;
            }
            return (typeof location === "object" && typeof location.reload === "function") ? location : null;
        }

        function getConfirmFn() {
            if (typeof safeDeps.confirmFn === "function") return safeDeps.confirmFn;
            if (typeof confirm === "function") return confirm;
            return null;
        }

        function logFatalError(err) {
            if (typeof safeDeps.logError === "function") {
                safeDeps.logError("FATAL ERROR during app initialization:", err);
                return;
            }
            if (typeof console === "object" && console && typeof console.error === "function") {
                console.error("FATAL ERROR during app initialization:", err);
            }
        }

        function getResetConfirmMessage() {
            const translated = invokeDep("t", "confirm_reset_all_settings");
            if (typeof translated === "string" && translated.trim()) return translated;
            return "Reset all settings?";
        }

        function showFatalError(err) {
            logFatalError(err);
            const doc = getDocumentRef();
            if (!doc) return;
            const banner = doc.getElementById("fatal-error-banner");
            if (!banner) return;

            banner.style.display = "flex";
            const resetBtn = doc.getElementById("fatal-error-reset-btn");
            if (!resetBtn) return;

            resetBtn.onclick = async () => {
                const confirmFn = getConfirmFn();
                const confirmMsg = getResetConfirmMessage();
                if (confirmFn && !confirmFn(confirmMsg)) return;
                if (typeof safeDeps.resetAllSettings === "function") {
                    await safeDeps.resetAllSettings();
                }
                const locationRef = getLocationRef();
                if (locationRef) locationRef.reload();
            };
        }

        function showToast(message, options = {}) {
            const doc = getDocumentRef();
            if (!doc) return;
            const container = doc.getElementById("toast-container");
            if (!container) return;
            const text = (typeof message === "string") ? message.trim() : "";
            if (!text) return;

            const safeType = (typeof options.type === "string" && options.type.trim())
                ? options.type.trim().toLowerCase()
                : "info";
            const toastType = ["success", "error", "info", "loading"].includes(safeType) ? safeType : "info";
            const parsedDuration = Number.parseInt(options.duration, 10);
            const duration = Number.isFinite(parsedDuration) ? Math.max(400, parsedDuration) : 3000;
            const iconMap = {
                success: "OK",
                error: "!",
                info: "i",
                loading: "..."
            };
            const iconText = (typeof options.icon === "string" && options.icon.trim())
                ? options.icon.trim()
                : iconMap[toastType];

            const toast = doc.createElement("div");
            toast.className = `toast ${toastType}`;

            const iconEl = doc.createElement("span");
            iconEl.className = "toast-icon";
            iconEl.textContent = iconText;

            const textEl = doc.createElement("span");
            textEl.className = "toast-text";
            textEl.textContent = text;

            toast.appendChild(iconEl);
            toast.appendChild(textEl);

            container.appendChild(toast);

            const dismiss = () => {
                if (toast.isConnected === false) return;
                toast.classList.add("out");
                if (typeof setTimeout === "function") {
                    setTimeout(() => toast.remove(), 500);
                } else {
                    toast.remove();
                }
            };

            if (typeof setTimeout === "function") {
                setTimeout(dismiss, duration);
            }
            return { dismiss, element: toast };
        }

        return Object.freeze({
            showFatalError,
            showToast
        });
    }

    globalObj.GTVAppFeedback = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/ui-settings-actions.js ---
(function initGtvUiSettingsActions(globalObj) {
    "use strict";

    function createService(deps) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (err) {
                console.warn(`[GTVUiSettingsActions] Dependency "${name}" threw.`, err);
                return undefined;
            }
        }

        function getDocumentRef() {
            if (safeDeps.document && typeof safeDeps.document === "object") return safeDeps.document;
            if (typeof document === "object" && document) return document;
            return null;
        }

        function bindTransferControls() {
            const doc = getDocumentRef();
            if (!doc?.getElementById) return;

            const exportSettingsBtn = doc.getElementById("export-settings-btn");
            if (exportSettingsBtn?.addEventListener) {
                exportSettingsBtn.addEventListener("click", () => {
                    invokeDep("exportSettingsToJSON");
                });
            }

            const importSettingsBtn = doc.getElementById("import-settings-btn");
            const settingsImportFile = doc.getElementById("settings-import-file");
            if (importSettingsBtn?.addEventListener && settingsImportFile) {
                importSettingsBtn.addEventListener("click", () => {
                    settingsImportFile.value = "";
                    settingsImportFile.click?.();
                });
                settingsImportFile.addEventListener?.("change", (event) => {
                    invokeDep("handleSettingsImportFile", event);
                });
            }

            const groupImportFile = doc.getElementById("group-import-file");
            if (groupImportFile?.addEventListener) {
                groupImportFile.addEventListener("change", (event) => {
                    invokeDep("handleGroupImportFile", event);
                });
            }

            const subgroupImportFile = doc.getElementById("subgroup-import-file");
            if (subgroupImportFile?.addEventListener) {
                subgroupImportFile.addEventListener("change", (event) => {
                    invokeDep("handleSubgroupImportFile", event);
                });
            }
        }

        function bindResetControls() {
            const doc = getDocumentRef();
            if (!doc?.getElementById) return;

            const resetExceptGroupTzBtn = doc.getElementById("reset-except-group-tz-btn");
            if (resetExceptGroupTzBtn?.addEventListener) {
                resetExceptGroupTzBtn.addEventListener("click", () => {
                    invokeDep("resetExceptGroupsAndTimezones");
                });
            }

            const resetAllSettingsBtn = doc.getElementById("reset-all-settings-btn");
            if (resetAllSettingsBtn?.addEventListener) {
                resetAllSettingsBtn.addEventListener("click", () => {
                    invokeDep("resetAllSettings");
                });
            }
        }

        function bindAllControls() {
            bindTransferControls();
            bindResetControls();
        }

        return Object.freeze({
            bindTransferControls,
            bindResetControls,
            bindAllControls
        });
    }

    globalObj.GTVUiSettingsActions = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/app-persistence-state.js ---
(function initGtvAppPersistenceState(globalObj) {
    "use strict";

    const PERSISTENCE_KEYS = Object.freeze([
        "groups",
        "activeGroupId",
        "currentMainTab",
        "activeGroupIdByMainTab",
        "slotCount",
        "showCopyFormat",
        "showTimeline",
        "displayFormatOrder",
        "displayFormatEnabled",
        "displayTimePartsEnabled",
        "copyFormatOrder",
        "copyFormatEnabled",
        "copyTimePartsEnabled",
        "formatProfiles",
        "activeFormatProfileContext",
        "timeAdjustDayStepBySlot",
        "multiRangeCount",
        "multiRangeTitle",
        "multiRanges",
        "multiRangeCollapsed",
        "multiRangeStartEditEnabled",
        "multiRangeEndEditEnabled",
        "currentTheme",
        "currentLang"
    ]);

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (_err) {
                return undefined;
            }
        }

        function getCurrentState() {
            const state = invokeDep("getState");
            return (state && typeof state === "object") ? state : {};
        }

        function getPersistenceState() {
            invokeDep("syncActiveFormatProfileFromState");
            const currentState = getCurrentState();
            const snapshot = {};
            PERSISTENCE_KEYS.forEach((key) => {
                snapshot[key] = currentState[key];
            });
            snapshot.isRealtime = !!currentState.isRealtime;
            return snapshot;
        }

        function setPersistenceState(next = {}) {
            if (!next || typeof next !== "object") return;

            const patch = {};
            PERSISTENCE_KEYS.forEach((key) => {
                if (!Object.prototype.hasOwnProperty.call(next, key)) return;
                if (key === "showTimeline") {
                    patch.showTimeline = !!next.showTimeline;
                    return;
                }
                patch[key] = next[key];
            });

            if (Object.keys(patch).length > 0) {
                invokeDep("setState", patch);
            }
            if (Object.prototype.hasOwnProperty.call(next, "isRealtime")) {
                invokeDep("setIsRealtimeState", next.isRealtime);
            }

            invokeDep("ensureFormatProfiles", invokeDep("getCurrentFormatProfileState"));
            const updatedState = getCurrentState();
            const nextContext = invokeDep(
                "resolveFormatProfileContext",
                updatedState.currentMainTab,
                updatedState.slotCount
            );
            invokeDep("setState", { activeFormatProfileContext: nextContext });
            const postContextState = getCurrentState();
            const profile = postContextState?.formatProfiles?.[nextContext];
            invokeDep("applyFormatProfileState", profile, nextContext);
        }

        return Object.freeze({
            getPersistenceState,
            setPersistenceState
        });
    }

    globalObj.GTVAppPersistenceState = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/persistence-service-bundle.js ---
(function initGtvPersistenceServiceBundle(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function resolveModuleApi(moduleName) {
            const api = safeDeps[moduleName];
            if (!api || typeof api.createService !== "function") {
                throw new Error(`Missing required module API: ${moduleName}.createService`);
            }
            return api;
        }

        const statePersistenceApi = resolveModuleApi("GTV_STATE_PERSISTENCE");
        const settingsIoApi = resolveModuleApi("GTV_SETTINGS_IO");
        const dataTransferApi = resolveModuleApi("GTV_DATA_TRANSFER");
        const uiSettingsActionsApi = resolveModuleApi("GTV_UI_SETTINGS_ACTIONS");

        function createBundle(config = {}) {
            const cfg = (config && typeof config === "object") ? config : {};

            const persistenceService = statePersistenceApi.createService({
                STORAGE_KEY: cfg.STORAGE_KEY,
                THEME_STORAGE_KEY: cfg.THEME_STORAGE_KEY,
                LANG_STORAGE_KEY: cfg.LANG_STORAGE_KEY,
                UI_SCALE_STORAGE_KEY: cfg.UI_SCALE_STORAGE_KEY,
                LEGACY_STORAGE_KEYS: cfg.LEGACY_STORAGE_KEYS,
                LEGACY_STORAGE_FALLBACK_KEYS: cfg.LEGACY_STORAGE_FALLBACK_KEYS,
                COPY_FORMAT_KEYS: cfg.COPY_FORMAT_KEYS,
                DEFAULT_TIME_ADJUST_DAY_STEP: cfg.DEFAULT_TIME_ADJUST_DAY_STEP,
                MIN_MULTI_RANGE_COUNT: cfg.MIN_MULTI_RANGE_COUNT,
                I18N_DATA: cfg.I18N_DATA,
                getDefaultFixedTimes: cfg.getDefaultFixedTimes,
                getState: cfg.getState,
                setState: cfg.setState,
                getPersistenceSnapshot: cfg.getPersistenceSnapshot,
                ensureGroupMultiSubgroups: cfg.ensureGroupMultiSubgroups,
                sanitizeGroup: cfg.sanitizeGroup,
                sanitizeBaseTimezoneId: cfg.sanitizeBaseTimezoneId,
                sanitizeMainTab: cfg.sanitizeMainTab,
                sanitizeTimeAdjustDayStep: cfg.sanitizeTimeAdjustDayStep,
                sanitizeCopyFormatOrder: cfg.sanitizeCopyFormatOrder,
                sanitizeCopyFormatEnabled: cfg.sanitizeCopyFormatEnabled,
                sanitizeTimePartsEnabled: cfg.sanitizeTimePartsEnabled,
                sanitizeFormatProfiles: cfg.sanitizeFormatProfiles,
                deriveTimePartsFromLegacyEnabled: cfg.deriveTimePartsFromLegacyEnabled,
                sanitizeMultiStatePayload: cfg.sanitizeMultiStatePayload,
                sanitizeMultiRangeTitle: cfg.sanitizeMultiRangeTitle,
                getDefaultFixedDate: cfg.getDefaultFixedDate,
                loadCurrentMultiStateFromActiveSubgroup: cfg.loadCurrentMultiStateFromActiveSubgroup,
                ensureBaseTimezoneSelection: cfg.ensureBaseTimezoneSelection,
                syncCurrentMultiStateToActiveSubgroup: cfg.syncCurrentMultiStateToActiveSubgroup,
                loadThemePreference: cfg.loadThemePreference,
                applyTheme: cfg.applyTheme,
                loadUiScalePreference: cfg.loadUiScalePreference,
                applyUiScale: cfg.applyUiScale,
                populateUiScaleSelect: cfg.populateUiScaleSelect,
                getCurrentUiScalePercent: cfg.getCurrentUiScalePercent,
                refreshMultiRangeControls: cfg.refreshMultiRangeControls,
                updateTZDropdown: cfg.updateTZDropdown,
                refreshSelectWidths: cfg.refreshSelectWidths,
                switchMainTab: cfg.switchMainTab,
                showToast: cfg.showToast,
                t: cfg.t,
                applyVersionBranding: cfg.applyVersionBranding,
                applyTranslations: cfg.applyTranslations
            });

            const settingsIoService = settingsIoApi.createService({
                I18N_DATA: cfg.I18N_DATA,
                THEME_STORAGE_KEY: cfg.THEME_STORAGE_KEY,
                LANG_STORAGE_KEY: cfg.LANG_STORAGE_KEY,
                UI_SCALE_STORAGE_KEY: cfg.UI_SCALE_STORAGE_KEY,
                t: cfg.t,
                getGroups: cfg.getGroups,
                getCurrentTheme: cfg.getCurrentTheme,
                getCurrentLang: cfg.getCurrentLang,
                getCurrentMainTab: cfg.getCurrentMainTab,
                getDefaultFixedTimes: cfg.getDefaultFixedTimes,
                getDefaultFixedDate: cfg.getDefaultFixedDate,
                sanitizeGroup: cfg.sanitizeGroup,
                sanitizeMainTab: cfg.sanitizeMainTab,
                sanitizeBaseTimezoneId: cfg.sanitizeBaseTimezoneId,
                sanitizeUtcRowOrder: cfg.sanitizeUtcRowOrder,
                sanitizeMultiStatePayload: cfg.sanitizeMultiStatePayload,
                sanitizeMultiRangeTitle: cfg.sanitizeMultiRangeTitle,
                normalizeImportedPayload: (payload = null) => persistenceService.normalizeImportedPayload(payload),
                persistStorageSnapshot: (snapshot, options = {}) => persistenceService.persistStorageSnapshot(snapshot, options),
                getStorageValue: (key, fallback = null) => persistenceService.getStorageValue(key, fallback),
                setStorageValue: (key, value, options = {}) => persistenceService.setStorageValue(key, value, options),
                sanitizeTheme: cfg.sanitizeTheme,
                sanitizeUiScalePercent: cfg.sanitizeUiScalePercent,
                setCurrentLang: cfg.setCurrentLang,
                loadPersistence: cfg.loadPersistence,
                localizeAutoGeneratedNamesForCurrentLanguage: cfg.localizeAutoGeneratedNamesForCurrentLanguage,
                savePersistence: (options = {}) => persistenceService.savePersistence(options),
                applyTheme: cfg.applyTheme,
                loadThemePreference: cfg.loadThemePreference,
                applyUiScale: cfg.applyUiScale,
                loadUiScalePreference: cfg.loadUiScalePreference,
                applyTranslations: cfg.applyTranslations,
                applyVersionBranding: cfg.applyVersionBranding,
                populateUiScaleSelect: cfg.populateUiScaleSelect,
                getCurrentUiScalePercent: cfg.getCurrentUiScalePercent,
                refreshMultiRangeControls: cfg.refreshMultiRangeControls,
                updateTZDropdown: cfg.updateTZDropdown,
                refreshSelectWidths: cfg.refreshSelectWidths,
                switchMainTab: cfg.switchMainTab
            });

            const dataTransferService = dataTransferApi.createService({
                VERSION: cfg.VERSION,
                MIN_MULTI_RANGE_COUNT: cfg.MIN_MULTI_RANGE_COUNT,
                I18N_DATA: cfg.I18N_DATA,
                getGroups: cfg.getGroups,
                getActiveGroupId: cfg.getActiveGroupId,
                getCurrentTheme: cfg.getCurrentTheme,
                getCurrentLang: cfg.getCurrentLang,
                getPersistenceSnapshot: cfg.getPersistenceSnapshot,
                getCurrentUiScalePercent: cfg.getCurrentUiScalePercent,
                sanitizeTheme: cfg.sanitizeTheme,
                sanitizeFilenamePart: cfg.sanitizeFilenamePart,
                pad: cfg.pad,
                syncCurrentMultiStateToActiveSubgroup: cfg.syncCurrentMultiStateToActiveSubgroup,
                ensureGroupMultiSubgroups: cfg.ensureGroupMultiSubgroups,
                sanitizeGroup: cfg.sanitizeGroup,
                loadCurrentMultiStateFromActiveSubgroup: cfg.loadCurrentMultiStateFromActiveSubgroup,
                savePersistence: (options = {}) => persistenceService.savePersistence(options),
                renderGroups: cfg.renderGroups,
                renderMultiSubgroups: cfg.renderMultiSubgroups,
                renderBaseTimeSelect: cfg.renderBaseTimeSelect,
                renderMultiRanges: cfg.renderMultiRanges,
                renderList: cfg.renderList,
                isMultiTab: cfg.isMultiTab,
                sanitizeMultiSubgroupId: cfg.sanitizeMultiSubgroupId,
                sanitizeMultiSubgroupName: cfg.sanitizeMultiSubgroupName,
                getDefaultMultiSubgroupName: cfg.getDefaultMultiSubgroupName,
                sanitizeMultiStatePayload: cfg.sanitizeMultiStatePayload,
                getCurrentMultiSubgroup: cfg.getCurrentMultiSubgroup,
                applyImportedSettings: (importedRoot) => settingsIoService.applyImportedSettings(importedRoot),
                isQuotaExceededError: (err) => persistenceService.isQuotaExceededError(err),
                showToast: cfg.showToast,
                t: cfg.t,
                tFormat: cfg.tFormat
            });

            const uiSettingsActionsService = uiSettingsActionsApi.createService({
                document: cfg.document,
                exportSettingsToJSON: () => dataTransferService.exportSettingsToJSON(),
                handleSettingsImportFile: (event) => dataTransferService.handleSettingsImportFile(event),
                handleGroupImportFile: (event) => dataTransferService.handleGroupImportFile(event),
                handleSubgroupImportFile: (event) => dataTransferService.handleSubgroupImportFile(event),
                resetExceptGroupsAndTimezones: () => persistenceService.resetExceptGroupsAndTimezones(),
                resetAllSettings: () => persistenceService.resetAllSettings()
            });

            return Object.freeze({
                persistenceService,
                settingsIoService,
                dataTransferService,
                uiSettingsActionsService
            });
        }

        return Object.freeze({
            createBundle
        });
    }

    globalObj.GTVPersistenceServiceBundle = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/state-persistence.js ---
(function initGtvStatePersistence(globalObj) {
    "use strict";

    function createService(deps) {
        let lastPersistenceErrorToastAt = 0;
        let persistenceWriteQueue = Promise.resolve();

        function isQuotaExceededError(err) {
            if (!err || typeof err !== "object") return false;
            const code = Number(err.code);
            const name = (typeof err.name === "string") ? err.name : "";
            return code === 22 || code === 1014 || name === "QuotaExceededError" || name === "NS_ERROR_DOM_QUOTA_REACHED";
        }

        function showPersistenceErrorToast(err) {
            const now = Date.now();
            if (now - lastPersistenceErrorToastAt < 2500) return;
            lastPersistenceErrorToastAt = now;
            deps.showToast(deps.t(isQuotaExceededError(err) ? "toast_storage_quota_exceeded" : "toast_storage_save_failed"));
        }

        function hasChromeStorage() {
            try {
                if (typeof chrome === "undefined" || !chrome) return false;
                if (typeof chrome.storage === "undefined" || !chrome.storage) return false;
                return !!chrome.storage.local;
            } catch (e) {
                return false;
            }
        }

        function getStorageLocal() {
            try {
                return hasChromeStorage() ? chrome.storage.local : null;
            } catch (e) {
                return null;
            }
        }

        function safeLocalStorageGet(key, fallback = null) {
            try {
                return localStorage.getItem(key) ?? fallback;
            } catch (e) {
                console.warn(`localStorage.getItem("${key}") failed.`, e);
                return fallback;
            }
        }

        function safeLocalStorageSet(key, value) {
            try {
                localStorage.setItem(key, value);
                return true;
            } catch (e) {
                console.warn(`localStorage.setItem("${key}") failed.`, e);
                return false;
            }
        }

        function safeLocalStorageRemove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.warn(`localStorage.removeItem("${key}") failed.`, e);
                return false;
            }
        }

        async function setStorageValue(key, value, options = {}) {
            const { suppressToast = false } = options;
            let lastError = null;
            try {
                const storage = getStorageLocal();
                if (storage) {
                    try {
                        await storage.set({ [key]: value });
                        return { ok: true, error: null };
                    } catch (err) {
                        lastError = err;
                        console.warn(`chrome.storage.set("${key}") failed. Falling back to localStorage.`, err);
                    }
                }
                const ok = safeLocalStorageSet(key, value);
                if (!ok) throw (lastError || new Error(`Failed to write localStorage key "${key}".`));
                return { ok: true, error: null };
            } catch (err) {
                const finalError = lastError || err;
                console.error(`Failed to write storage key "${key}".`, finalError);
                if (!suppressToast) showPersistenceErrorToast(finalError);
                return { ok: false, error: finalError };
            }
        }

        async function getStorageValue(key, fallback = null) {
            try {
                const storage = getStorageLocal();
                if (storage) {
                    const data = await storage.get(key);
                    if (data && data[key] !== undefined) return data[key];
                }
                return safeLocalStorageGet(key, fallback);
            } catch (err) {
                console.warn(`Failed to read storage key "${key}". Falling back to safeLocalStorageGet.`, err);
                return safeLocalStorageGet(key, fallback);
            }
        }

        function persistStorageSnapshot(snapshot, options = {}) {
            let serialized = "";
            try {
                serialized = JSON.stringify(snapshot);
            } catch (err) {
                console.error("Failed to serialize persistence snapshot.", err);
                if (!options?.suppressToast) showPersistenceErrorToast(err);
                return { ok: false, error: err };
            }
            return setStorageValue(deps.STORAGE_KEY, serialized, options);
        }

        function enqueuePersistenceWrite(taskFn) {
            const nextWrite = persistenceWriteQueue.then(taskFn, taskFn);
            // Keep queue alive even if one write fails.
            persistenceWriteQueue = nextWrite.catch(() => false);
            return nextWrite;
        }

        async function savePersistence(options = {}) {
            return enqueuePersistenceWrite(async () => {
                try {
                    const snapshot = deps.getPersistenceSnapshot();
                    const result = await persistStorageSnapshot(snapshot, options);
                    return !!result?.ok;
                } catch (err) {
                    console.error("savePersistence failed during snapshot generation.", err);
                    if (!options?.suppressToast) showPersistenceErrorToast(err);
                    return false;
                }
            });
        }

        function getDefaultGroups() {
            const defaultGroup = {
                name: deps.t("default_group_name"),
                zones: [],
                baseTimezoneId: "utc",
                showUtcRow: true,
                utcRowOrder: 0,
                fixedDate: (typeof deps.getDefaultFixedDate === "function")
                    ? deps.getDefaultFixedDate()
                    : "",
                fixedTimes: (typeof deps.getDefaultFixedTimes === "function")
                    ? deps.getDefaultFixedTimes()
                    : []
            };
            deps.ensureGroupMultiSubgroups(defaultGroup);
            return [defaultGroup];
        }

        function clampGroupIndex(index, groupsLength) {
            const maxIndex = Math.max(0, groupsLength - 1);
            const parsed = parseInt(index, 10);
            if (!Number.isFinite(parsed)) return 0;
            return Math.min(Math.max(parsed, 0), maxIndex);
        }

        function applyDefaultPersistenceState({ includeMultiState = false } = {}) {
            const baseState = {
                groups: getDefaultGroups(),
                activeGroupId: 0,
                currentMainTab: "live",
                activeGroupIdByMainTab: { live: 0, fixed: 0 },
                activeFormatProfileContext: "live",
                slotCount: 1,
                showCopyFormat: false,
                showTimeline: false,
                timeAdjustDayStepBySlot: [deps.DEFAULT_TIME_ADJUST_DAY_STEP, deps.DEFAULT_TIME_ADJUST_DAY_STEP],
                displayFormatOrder: [...deps.COPY_FORMAT_KEYS],
                displayFormatEnabled: deps.sanitizeCopyFormatEnabled(null, "display"),
                displayTimePartsEnabled: deps.sanitizeTimePartsEnabled(null, "display"),
                copyFormatOrder: [...deps.COPY_FORMAT_KEYS],
                copyFormatEnabled: deps.sanitizeCopyFormatEnabled(null, "copy"),
                copyTimePartsEnabled: deps.sanitizeTimePartsEnabled(null, "copy"),
                isRealtime: true
            };
            if (typeof deps.sanitizeFormatProfiles === "function") {
                baseState.formatProfiles = deps.sanitizeFormatProfiles(null, null);
            }
            if (includeMultiState) {
                baseState.multiRangeCount = deps.MIN_MULTI_RANGE_COUNT;
                baseState.multiRangeTitle = deps.t("placeholder_range_title");
                baseState.multiRanges = [];
                baseState.multiRangeCollapsed = [];
                baseState.multiRangeStartEditEnabled = [];
                baseState.multiRangeEndEditEnabled = [];
            }
            deps.setState(baseState);
            deps.loadCurrentMultiStateFromActiveSubgroup();
        }

        function normalizeParsedPersistenceState(parsed) {
            const legacyGlobalMultiState = deps.sanitizeMultiStatePayload({
                multiRangeCount: parsed?.multiRangeCount,
                multiRanges: parsed?.multiRanges,
                multiRangeCollapsed: parsed?.multiRangeCollapsed,
                multiRangeStartEditEnabled: parsed?.multiRangeStartEditEnabled,
                multiRangeEndEditEnabled: parsed?.multiRangeEndEditEnabled
            }, null);
            legacyGlobalMultiState.multiRangeTitle = deps.sanitizeMultiRangeTitle(parsed?.multiRangeTitle);

            const parsedGroups = Array.isArray(parsed?.groups)
                ? parsed.groups.map((group, idx) => deps.sanitizeGroup(group, idx, legacyGlobalMultiState)).filter(Boolean)
                : [];
            const groups = parsedGroups.length ? parsedGroups : getDefaultGroups();
            const rawGroups = Array.isArray(parsed?.groups) ? parsed.groups : [];
            const legacyGlobalBaseTimezoneId = deps.sanitizeBaseTimezoneId(parsed?.baseTimezoneId);
            groups.forEach((group, idx) => {
                const rawGroup = rawGroups[idx];
                const hasGroupSpecificBase = typeof rawGroup?.baseTimezoneId === "string" && rawGroup.baseTimezoneId.trim();
                if (hasGroupSpecificBase || legacyGlobalBaseTimezoneId === "utc") return;
                group.baseTimezoneId = group.zones.some((zone) => zone.id === legacyGlobalBaseTimezoneId) ? legacyGlobalBaseTimezoneId : "utc";
            });

            let activeGroupId = clampGroupIndex(parsed?.activeGroupId, groups.length);
            const currentMainTab = deps.sanitizeMainTab(parsed?.currentMainTab);

            const rawGroupMap = (parsed?.activeGroupIdByMainTab && typeof parsed.activeGroupIdByMainTab === "object")
                ? parsed.activeGroupIdByMainTab
                : null;
            const fallbackGroupId = activeGroupId;
            const mapLive = parseInt(rawGroupMap?.live, 10);
            const mapFixed = parseInt(rawGroupMap?.fixed, 10);
            const activeGroupIdByMainTab = {
                live: clampGroupIndex(Number.isFinite(mapLive) ? mapLive : fallbackGroupId, groups.length),
                fixed: clampGroupIndex(Number.isFinite(mapFixed) ? mapFixed : fallbackGroupId, groups.length)
            };

            const parsedSlotCount = parseInt(parsed?.slotCount, 10);
            const slotCount = Math.min(2, Math.max(1, Number.isFinite(parsedSlotCount) ? parsedSlotCount : 1));

            const showCopyFormat = !!parsed?.showCopyFormat;
            const showTimeline = !!parsed?.showTimeline;
            const rawTimeAdjustStep = Array.isArray(parsed?.timeAdjustDayStepBySlot) ? parsed.timeAdjustDayStepBySlot : [];
            const timeAdjustDayStepBySlot = [
                deps.sanitizeTimeAdjustDayStep(rawTimeAdjustStep[0]),
                deps.sanitizeTimeAdjustDayStep(rawTimeAdjustStep[1])
            ];
            const hasDisplayOrder = Array.isArray(parsed?.displayFormatOrder);
            const hasDisplayEnabled = !!(parsed?.displayFormatEnabled && typeof parsed.displayFormatEnabled === "object");
            const rawDisplayEnabled = hasDisplayEnabled ? parsed.displayFormatEnabled : parsed?.copyFormatEnabled;
            const fallbackCopyOrder = deps.sanitizeCopyFormatOrder(parsed?.copyFormatOrder);
            const fallbackCopyEnabled = deps.sanitizeCopyFormatEnabled(parsed?.copyFormatEnabled, "copy");

            const displayFormatOrder = deps.sanitizeCopyFormatOrder(hasDisplayOrder ? parsed.displayFormatOrder : parsed?.copyFormatOrder);
            const displayFormatEnabled = deps.sanitizeCopyFormatEnabled(rawDisplayEnabled, "display");
            let displayTimePartsEnabled = deps.sanitizeTimePartsEnabled(parsed?.displayTimePartsEnabled, "display");
            if (!parsed?.displayTimePartsEnabled) {
                displayTimePartsEnabled = deps.deriveTimePartsFromLegacyEnabled(rawDisplayEnabled, "display");
            }
            const copyFormatOrder = fallbackCopyOrder;
            const copyFormatEnabled = fallbackCopyEnabled;
            let copyTimePartsEnabled = deps.sanitizeTimePartsEnabled(parsed?.copyTimePartsEnabled, "copy");
            if (!parsed?.copyTimePartsEnabled) {
                copyTimePartsEnabled = deps.deriveTimePartsFromLegacyEnabled(parsed?.copyFormatEnabled, "copy");
            }
            const legacyFormatProfileState = {
                displayFormatOrder,
                displayFormatEnabled,
                displayTimePartsEnabled,
                copyFormatOrder,
                copyFormatEnabled,
                copyTimePartsEnabled
            };
            const formatProfiles = (typeof deps.sanitizeFormatProfiles === "function")
                ? deps.sanitizeFormatProfiles(parsed?.formatProfiles, legacyFormatProfileState)
                : null;
            const activeFormatProfileContext = (typeof parsed?.activeFormatProfileContext === "string")
                ? parsed.activeFormatProfileContext
                : null;

            if (currentMainTab === "live" || currentMainTab === "fixed") {
                activeGroupId = activeGroupIdByMainTab[currentMainTab];
            }

            const nextState = {
                groups,
                activeGroupId,
                currentMainTab,
                activeGroupIdByMainTab,
                slotCount,
                showCopyFormat,
                showTimeline,
                timeAdjustDayStepBySlot,
                displayFormatOrder,
                displayFormatEnabled,
                displayTimePartsEnabled,
                copyFormatOrder,
                copyFormatEnabled,
                copyTimePartsEnabled,
                multiRangeCount: deps.MIN_MULTI_RANGE_COUNT,
                multiRangeTitle: deps.t("placeholder_range_title"),
                multiRanges: [],
                multiRangeCollapsed: [],
                multiRangeStartEditEnabled: [],
                multiRangeEndEditEnabled: [],
                isRealtime: (currentMainTab === "live")
            };
            if (formatProfiles && typeof formatProfiles === "object") {
                nextState.formatProfiles = formatProfiles;
            }
            if (activeFormatProfileContext) {
                nextState.activeFormatProfileContext = activeFormatProfileContext;
            }
            return nextState;
        }

        function normalizeImportedPayload(payload = null) {
            const parsed = (payload && typeof payload === "object") ? payload : {};
            const normalizedState = normalizeParsedPersistenceState(parsed);
            const groups = Array.isArray(normalizedState.groups) && normalizedState.groups.length
                ? normalizedState.groups
                : getDefaultGroups();
            const activeGroupId = clampGroupIndex(normalizedState.activeGroupId, groups.length);
            const activeGroup = groups[activeGroupId] || groups[0] || null;
            const baseTimezoneId = deps.sanitizeBaseTimezoneId(activeGroup?.baseTimezoneId);

            const snapshot = {
                groups,
                activeGroupId,
                currentMainTab: normalizedState.currentMainTab,
                activeGroupIdByMainTab: normalizedState.activeGroupIdByMainTab,
                slotCount: normalizedState.slotCount,
                baseTimezoneId,
                showCopyFormat: normalizedState.showCopyFormat,
                showTimeline: normalizedState.showTimeline,
                displayFormatOrder: normalizedState.displayFormatOrder,
                displayFormatEnabled: normalizedState.displayFormatEnabled,
                displayTimePartsEnabled: normalizedState.displayTimePartsEnabled,
                copyFormatOrder: normalizedState.copyFormatOrder,
                copyFormatEnabled: normalizedState.copyFormatEnabled,
                copyTimePartsEnabled: normalizedState.copyTimePartsEnabled,
                timeAdjustDayStepBySlot: normalizedState.timeAdjustDayStepBySlot,
                multiRangeCount: deps.MIN_MULTI_RANGE_COUNT,
                multiRangeTitle: deps.t("placeholder_range_title"),
                multiRanges: [],
                multiRangeCollapsed: [],
                multiRangeStartEditEnabled: [],
                multiRangeEndEditEnabled: []
            };
            if (normalizedState.formatProfiles && typeof normalizedState.formatProfiles === "object") {
                snapshot.formatProfiles = normalizedState.formatProfiles;
            }
            if (normalizedState.activeFormatProfileContext) {
                snapshot.activeFormatProfileContext = normalizedState.activeFormatProfileContext;
            }
            return snapshot;
        }

        async function loadPersistence() {
            let serialized = null;

            try {
                if (hasChromeStorage()) {
                    const data = await chrome.storage.local.get(deps.STORAGE_KEY);
                    serialized = data[deps.STORAGE_KEY];
                }
            } catch (err) {
                console.warn("Chrome storage error during loadPersistence. Falling back to localStorage.", err);
            }

            if (!serialized) {
                serialized = safeLocalStorageGet(deps.STORAGE_KEY);
            }

            const legacyFallbackKeys = Array.isArray(deps.LEGACY_STORAGE_FALLBACK_KEYS)
                ? deps.LEGACY_STORAGE_FALLBACK_KEYS
                : deps.LEGACY_STORAGE_KEYS;
            if (!serialized) {
                for (const key of legacyFallbackKeys) {
                    const legacy = safeLocalStorageGet(key);
                    if (legacy) {
                        serialized = legacy;
                        break;
                    }
                }
            }

            if (!serialized) {
                applyDefaultPersistenceState();
                return;
            }

            try {
                const parsed = JSON.parse(serialized);
                const nextState = normalizeParsedPersistenceState(parsed);
                deps.setState(nextState);

                deps.loadCurrentMultiStateFromActiveSubgroup();
                deps.ensureBaseTimezoneSelection();
            } catch (err) {
                console.warn("Failed to parse persisted data. Falling back to defaults.", err);
                applyDefaultPersistenceState();
                await savePersistence();
            }
        }

        async function resetAllSettings() {
            if (!confirm(deps.t("confirm_reset_all_settings"))) return;

            const keysToRemove = [
                deps.STORAGE_KEY,
                deps.THEME_STORAGE_KEY,
                deps.LANG_STORAGE_KEY,
                deps.UI_SCALE_STORAGE_KEY,
                ...deps.LEGACY_STORAGE_KEYS
            ];

            try {
                const storage = getStorageLocal();
                if (storage) {
                    await storage.remove(keysToRemove);
                }
            } catch (err) {
                console.warn("Chrome storage remove error.", err);
            }
            keysToRemove.forEach((key) => safeLocalStorageRemove(key));
            location.reload();
        }

        async function resetExceptGroupsAndTimezones() {
            if (!confirm(deps.t("confirm_reset_except_group_tz"))) return;

            deps.syncCurrentMultiStateToActiveSubgroup();
            const currentState = (typeof deps.getState === "function") ? (deps.getState() || {}) : {};
            const sourceGroups = Array.isArray(currentState.groups) ? currentState.groups : [];
            const preservedGroups = sourceGroups
                .map((group, idx) => {
                    try {
                        return deps.sanitizeGroup({
                            name: group?.name,
                            zones: group?.zones,
                            baseTimezoneId: group?.baseTimezoneId,
                            showUtcRow: group?.showUtcRow,
                            utcRowOrder: group?.utcRowOrder,
                            fixedDate: group?.fixedDate,
                            fixedTimes: group?.fixedTimes
                        }, idx, null);
                    } catch (err) {
                        console.warn("sanitizeGroup failed during resetExceptGroupsAndTimezones.", err);
                        return null;
                    }
                })
                .filter(Boolean);

            const groups = preservedGroups.length ? preservedGroups : getDefaultGroups();
            groups.forEach((group) => deps.ensureGroupMultiSubgroups(group));

            deps.setState({
                groups,
                activeGroupId: 0,
                currentMainTab: "live",
                activeGroupIdByMainTab: { live: 0, fixed: 0 },
                activeFormatProfileContext: "live",
                slotCount: 1,
                showCopyFormat: false,
                showTimeline: false,
                timeAdjustDayStepBySlot: [deps.DEFAULT_TIME_ADJUST_DAY_STEP, deps.DEFAULT_TIME_ADJUST_DAY_STEP],
                displayFormatOrder: [...deps.COPY_FORMAT_KEYS],
                displayFormatEnabled: deps.sanitizeCopyFormatEnabled(null, "display"),
                displayTimePartsEnabled: deps.sanitizeTimePartsEnabled(null, "display"),
                copyFormatOrder: [...deps.COPY_FORMAT_KEYS],
                copyFormatEnabled: deps.sanitizeCopyFormatEnabled(null, "copy"),
                copyTimePartsEnabled: deps.sanitizeTimePartsEnabled(null, "copy"),
                multiRangeCount: deps.MIN_MULTI_RANGE_COUNT,
                multiRangeTitle: deps.t("placeholder_range_title"),
                multiRanges: [],
                multiRangeCollapsed: [],
                multiRangeStartEditEnabled: [],
                multiRangeEndEditEnabled: [],
                isRealtime: true
            });
            if (typeof deps.sanitizeFormatProfiles === "function") {
                deps.setState({
                    formatProfiles: deps.sanitizeFormatProfiles(null, null)
                });
            }
            deps.loadCurrentMultiStateFromActiveSubgroup();

            const keysToRemove = [
                deps.THEME_STORAGE_KEY,
                deps.LANG_STORAGE_KEY,
                deps.UI_SCALE_STORAGE_KEY,
                ...deps.LEGACY_STORAGE_KEYS
            ];

            try {
                const storage = getStorageLocal();
                if (storage) {
                    await storage.remove(keysToRemove);
                    await storage.remove([deps.STORAGE_KEY]);
                }
            } catch (err) {
                console.warn("Chrome storage remove error.", err);
            }
            keysToRemove.forEach((key) => safeLocalStorageRemove(key));
            safeLocalStorageRemove(deps.STORAGE_KEY);

            const currentTheme = await deps.loadThemePreference();
            const nextLangRaw = await getStorageValue(deps.LANG_STORAGE_KEY, "ko");
            const nextLang = (typeof nextLangRaw === "string") ? nextLangRaw : "ko";

            const currentLang = deps.I18N_DATA[nextLang] ? nextLang : "ko";
            deps.setState({
                currentTheme,
                currentLang
            });
            deps.applyTheme(currentTheme, false);
            const uiScale = await deps.loadUiScalePreference();
            deps.applyUiScale(uiScale, false);
            deps.applyTranslations();
            deps.applyVersionBranding();

            const langSelect = document.getElementById("lang-select");
            if (langSelect) langSelect.value = currentLang;
            const themeSelect = document.getElementById("theme-select");
            if (themeSelect) themeSelect.value = currentTheme;
            const uiScaleSelect = document.getElementById("ui-scale-select");
            if (uiScaleSelect) {
                deps.populateUiScaleSelect(uiScaleSelect);
                uiScaleSelect.value = String(deps.getCurrentUiScalePercent());
            }

            deps.refreshMultiRangeControls();
            deps.updateTZDropdown();
            deps.refreshSelectWidths();
            deps.switchMainTab("live");
            await savePersistence();
        }

        return Object.freeze({
            isQuotaExceededError,
            setStorageValue,
            getStorageValue,
            persistStorageSnapshot,
            savePersistence,
            resetAllSettings,
            resetExceptGroupsAndTimezones,
            getDefaultGroups,
            normalizeImportedPayload,
            loadPersistence
        });
    }

    globalObj.GTVStatePersistence = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/ui-preferences-state.js ---
(function initGtvUiPreferencesState(globalObj) {
    "use strict";

    function createService(deps = {}) {
        const safeDeps = (deps && typeof deps === "object") ? deps : {};

        function invokeDep(name, ...args) {
            if (typeof safeDeps[name] !== "function") return undefined;
            try {
                return safeDeps[name](...args);
            } catch (_err) {
                return undefined;
            }
        }

        function readState() {
            const state = invokeDep("getState");
            if (!state || typeof state !== "object") {
                return {
                    uiScale: 1.0,
                    currentTheme: "dark",
                    currentLang: "ko"
                };
            }
            return state;
        }

        function patchState(next = {}) {
            if (!next || typeof next !== "object") return;
            invokeDep("setState", next);
        }

        function getUiScaleDefaultPercent() {
            const parsed = Number(safeDeps.DEFAULT_UI_SCALE_PERCENT);
            return Number.isFinite(parsed) ? parsed : 100;
        }

        function getUiScaleMinPercent() {
            const parsed = Number(safeDeps.MIN_UI_SCALE_PERCENT);
            return Number.isFinite(parsed) ? parsed : 50;
        }

        function getUiScaleMaxPercent() {
            const parsed = Number(safeDeps.MAX_UI_SCALE_PERCENT);
            return Number.isFinite(parsed) ? parsed : 200;
        }

        function getUiScalePercentOptions() {
            return Array.isArray(safeDeps.UI_SCALE_PERCENT_OPTIONS)
                ? safeDeps.UI_SCALE_PERCENT_OPTIONS
                : [50, 75, 100, 125, 150, 175, 200];
        }

        function sanitizeUiScalePercent(value) {
            const parsed = parseInt(value, 10);
            if (!Number.isFinite(parsed)) return getUiScaleDefaultPercent();
            const clamped = Math.min(getUiScaleMaxPercent(), Math.max(getUiScaleMinPercent(), parsed));
            const options = getUiScalePercentOptions();
            return options.reduce((closest, percent) => (
                Math.abs(percent - clamped) < Math.abs(closest - clamped) ? percent : closest
            ), options[0]);
        }

        async function applyUiScale(scalePercent, persist = true) {
            const safePercent = sanitizeUiScalePercent(scalePercent);
            const nextScale = safePercent / 100;
            patchState({ uiScale: nextScale });

            if (document.documentElement) {
                document.documentElement.style.setProperty("--ui-zoom", nextScale.toFixed(2));
                document.documentElement.style.zoom = String(nextScale);
                document.documentElement.style.overflow = "hidden";
            }
            if (document.body) {
                document.body.style.overflow = "hidden";
            }

            if (persist) {
                await invokeDep("setStorageValue", safeDeps.UI_SCALE_STORAGE_KEY, String(safePercent));
            }
        }

        async function loadUiScalePreference() {
            const val = await invokeDep("getStorageValue", safeDeps.UI_SCALE_STORAGE_KEY, getUiScaleDefaultPercent());
            return sanitizeUiScalePercent(val);
        }

        function populateUiScaleSelect(selectEl) {
            if (!selectEl) return;
            selectEl.textContent = "";
            getUiScalePercentOptions().forEach((percent) => {
                const option = document.createElement("option");
                option.value = String(percent);
                option.textContent = `${percent}%`;
                selectEl.appendChild(option);
            });
        }

        function sanitizeTheme(theme) {
            const safeList = Array.isArray(safeDeps.THEME_LIST) ? safeDeps.THEME_LIST : ["dark"];
            return safeList.includes(theme) ? theme : "dark";
        }

        async function applyTheme(theme, persist = true) {
            const nextTheme = sanitizeTheme(theme);
            patchState({ currentTheme: nextTheme });
            if (document.documentElement) {
                document.documentElement.setAttribute("data-theme", nextTheme);
            }
            if (persist) {
                await invokeDep("setStorageValue", safeDeps.THEME_STORAGE_KEY, nextTheme);
            }
        }

        async function loadThemePreference() {
            const val = await invokeDep("getStorageValue", safeDeps.THEME_STORAGE_KEY, "dark");
            return sanitizeTheme(val);
        }

        function setCurrentLang(lang) {
            const i18nData = (safeDeps.I18N_DATA && typeof safeDeps.I18N_DATA === "object") ? safeDeps.I18N_DATA : {};
            const nextLang = i18nData[lang] ? lang : "ko";
            patchState({ currentLang: nextLang });
            if (document.documentElement) {
                document.documentElement.lang = nextLang;
            }
        }

        return Object.freeze({
            sanitizeUiScalePercent,
            applyUiScale,
            loadUiScalePreference,
            populateUiScaleSelect,
            sanitizeTheme,
            applyTheme,
            loadThemePreference,
            setCurrentLang
        });
    }

    globalObj.GTVUiPreferencesState = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/settings-io.js ---
(function initGtvSettingsIo(globalObj) {
    "use strict";

    function createService(deps) {
        function createPersistenceWriteError(message, cause = null) {
            const err = new Error(message || "Failed to persist imported settings payload");
            err.code = "PERSISTENCE_WRITE_FAILED";
            err.cause = cause || null;
            return err;
        }

        async function persistPreferenceValue(storageKey, value) {
            const writeResult = await deps.setStorageValue(storageKey, value, { suppressToast: true });
            if (!writeResult || writeResult.ok !== true) {
                throw createPersistenceWriteError(`Failed to persist preference key: ${storageKey}`, writeResult?.error || null);
            }
        }

        async function ensurePersistenceSaved() {
            const ok = await deps.savePersistence();
            if (!ok) {
                throw createPersistenceWriteError("Failed to persist normalized imported settings");
            }
        }

        function ensureImportedGroupsFallbackToStandardTime() {
            let changed = false;
            const groups = Array.isArray(deps.getGroups()) ? deps.getGroups() : [];
            groups.forEach((group) => {
                if (!group || typeof group !== "object") return;
                const zoneCount = Array.isArray(group.zones) ? group.zones.length : 0;
                if (zoneCount > 0) return;

                if (deps.sanitizeBaseTimezoneId(group.baseTimezoneId) !== "utc") {
                    group.baseTimezoneId = "utc";
                    changed = true;
                }
                if (group.showUtcRow === false) {
                    group.showUtcRow = true;
                    changed = true;
                }
                if (deps.sanitizeUtcRowOrder(group.utcRowOrder) !== 0) {
                    group.utcRowOrder = 0;
                    changed = true;
                }
            });
            return changed;
        }

        function clampGroupIndex(value, groupsLength, fallback = 0) {
            const safeLength = Number.isFinite(groupsLength) ? Math.max(1, Math.trunc(groupsLength)) : 1;
            const parsed = parseInt(value, 10);
            const fallbackParsed = parseInt(fallback, 10);
            const safeValue = Number.isFinite(parsed) ? parsed : (Number.isFinite(fallbackParsed) ? fallbackParsed : 0);
            return Math.min(Math.max(safeValue, 0), safeLength - 1);
        }

        function buildLegacyGlobalMultiState(payload) {
            if (typeof deps.sanitizeMultiStatePayload !== "function") return null;
            const normalized = deps.sanitizeMultiStatePayload({
                multiRangeCount: payload?.multiRangeCount,
                multiRanges: payload?.multiRanges,
                multiRangeCollapsed: payload?.multiRangeCollapsed,
                multiRangeStartEditEnabled: payload?.multiRangeStartEditEnabled,
                multiRangeEndEditEnabled: payload?.multiRangeEndEditEnabled
            }, null);
            if (!normalized || typeof normalized !== "object") return null;
            if (typeof deps.sanitizeMultiRangeTitle === "function") {
                normalized.multiRangeTitle = deps.sanitizeMultiRangeTitle(payload?.multiRangeTitle);
            }
            return normalized;
        }

        function createFallbackImportedGroup(legacyGlobalMultiState = null) {
            const translatedDefaultName = (typeof deps.t === "function") ? deps.t("default_group_name") : "Group";
            const safeDefaultName = (typeof translatedDefaultName === "string" && translatedDefaultName.trim())
                ? translatedDefaultName.trim()
                : "Group";
            const rawFallback = {
                name: safeDefaultName,
                zones: [],
                baseTimezoneId: "utc",
                showUtcRow: true,
                utcRowOrder: 0,
                fixedDate: (typeof deps.getDefaultFixedDate === "function")
                    ? deps.getDefaultFixedDate()
                    : "",
                fixedTimes: (typeof deps.getDefaultFixedTimes === "function")
                    ? deps.getDefaultFixedTimes()
                    : []
            };
            if (typeof deps.sanitizeGroup === "function") {
                const sanitized = deps.sanitizeGroup(rawFallback, 0, legacyGlobalMultiState);
                if (sanitized && typeof sanitized === "object") return sanitized;
            }
            return rawFallback;
        }

        function sanitizeImportedGroups(payload) {
            const sourceGroups = Array.isArray(payload?.groups) ? payload.groups : [];
            const legacyGlobalMultiState = buildLegacyGlobalMultiState(payload);
            if (typeof deps.sanitizeGroup !== "function") {
                const fallbackGroups = sourceGroups
                    .filter((group) => !!group && typeof group === "object")
                    .map((group) => ({ ...group }));
                if (fallbackGroups.length) return fallbackGroups;
                return [createFallbackImportedGroup(legacyGlobalMultiState)];
            }

            const sanitized = sourceGroups
                .map((group, idx) => deps.sanitizeGroup(group, idx, legacyGlobalMultiState))
                .filter((group) => !!group && typeof group === "object");

            if (sanitized.length) return sanitized;
            return [createFallbackImportedGroup(legacyGlobalMultiState)];
        }

        function sanitizeImportedMainTab(tabValue) {
            if (typeof deps.sanitizeMainTab === "function") {
                return deps.sanitizeMainTab(tabValue);
            }
            const normalized = (typeof tabValue === "string") ? tabValue.trim() : "";
            if (normalized === "live" || normalized === "fixed" || normalized === "multi" || normalized === "fixed-time" || normalized === "calc") {
                return normalized;
            }
            return "live";
        }

        function buildSanitizedImportPayload(payload) {
            const groups = sanitizeImportedGroups(payload);
            const activeGroupId = clampGroupIndex(payload?.activeGroupId, groups.length, 0);
            const currentMainTab = sanitizeImportedMainTab(payload?.currentMainTab);

            const rawGroupMap = (payload?.activeGroupIdByMainTab && typeof payload.activeGroupIdByMainTab === "object")
                ? payload.activeGroupIdByMainTab
                : null;
            const activeGroupIdByMainTab = {
                live: clampGroupIndex(rawGroupMap?.live, groups.length, activeGroupId),
                fixed: clampGroupIndex(rawGroupMap?.fixed, groups.length, activeGroupId)
            };

            const parsedSlotCount = parseInt(payload?.slotCount, 10);
            const slotCount = Number.isFinite(parsedSlotCount) ? Math.min(2, Math.max(1, parsedSlotCount)) : 1;

            let baseTimezoneId = "utc";
            if (typeof deps.sanitizeBaseTimezoneId === "function") {
                baseTimezoneId = deps.sanitizeBaseTimezoneId(payload?.baseTimezoneId);
                if (baseTimezoneId !== "utc") {
                    const activeGroup = groups[activeGroupId];
                    const zones = Array.isArray(activeGroup?.zones) ? activeGroup.zones : [];
                    const found = zones.some((zone) => zone && zone.id === baseTimezoneId);
                    if (!found) baseTimezoneId = "utc";
                }
            }

            return {
                groups,
                activeGroupId,
                currentMainTab,
                activeGroupIdByMainTab,
                slotCount,
                baseTimezoneId,
                showCopyFormat: !!payload?.showCopyFormat,
                showTimeline: !!payload?.showTimeline,
                displayFormatOrder: payload?.displayFormatOrder,
                displayFormatEnabled: payload?.displayFormatEnabled,
                displayTimePartsEnabled: payload?.displayTimePartsEnabled,
                copyFormatOrder: payload?.copyFormatOrder,
                copyFormatEnabled: payload?.copyFormatEnabled,
                copyTimePartsEnabled: payload?.copyTimePartsEnabled,
                formatProfiles: payload?.formatProfiles,
                activeFormatProfileContext: payload?.activeFormatProfileContext,
                timeAdjustDayStepBySlot: payload?.timeAdjustDayStepBySlot,
                multiRangeCount: payload?.multiRangeCount,
                multiRangeTitle: payload?.multiRangeTitle,
                multiRanges: payload?.multiRanges,
                multiRangeCollapsed: payload?.multiRangeCollapsed,
                multiRangeStartEditEnabled: payload?.multiRangeStartEditEnabled,
                multiRangeEndEditEnabled: payload?.multiRangeEndEditEnabled
            };
        }

        function normalizeImportPayload(payload) {
            if (typeof deps.normalizeImportedPayload === "function") {
                try {
                    const normalized = deps.normalizeImportedPayload(payload);
                    if (normalized && typeof normalized === "object") return normalized;
                } catch (err) {
                    console.warn("normalizeImportedPayload failed. Falling back to local import sanitization.", err);
                }
            }
            return buildSanitizedImportPayload(payload);
        }

        async function applyImportedSettings(importedRoot) {
            const payload = (importedRoot && typeof importedRoot === "object" && importedRoot.data && typeof importedRoot.data === "object")
                ? importedRoot.data
                : importedRoot;
            if (!payload || typeof payload !== "object") {
                throw new Error("Invalid settings payload");
            }
            if (!Array.isArray(payload.groups)) {
                throw new Error("Invalid settings payload: groups is required");
            }

            const sanitizedPayload = normalizeImportPayload(payload);
            const writeResult = await deps.persistStorageSnapshot(sanitizedPayload, { suppressToast: true });
            if (!writeResult.ok) {
                throw createPersistenceWriteError("Failed to persist imported settings payload", writeResult.error);
            }

            const pref = (importedRoot && typeof importedRoot === "object" && importedRoot.preferences && typeof importedRoot.preferences === "object")
                ? importedRoot.preferences
                : importedRoot;

            if (pref && typeof pref === "object") {
                if (typeof pref.theme === "string") {
                    await persistPreferenceValue(deps.THEME_STORAGE_KEY, deps.sanitizeTheme(pref.theme));
                }
                if (typeof pref.language === "string" && deps.I18N_DATA[pref.language]) {
                    await persistPreferenceValue(deps.LANG_STORAGE_KEY, pref.language);
                }
                if (pref.uiScale !== undefined) {
                    await persistPreferenceValue(deps.UI_SCALE_STORAGE_KEY, String(deps.sanitizeUiScalePercent(pref.uiScale)));
                }
            }

            const nextLang = await deps.getStorageValue(deps.LANG_STORAGE_KEY, "ko");
            deps.setCurrentLang(deps.I18N_DATA[nextLang] ? nextLang : "ko");
            await deps.loadPersistence();
            if (deps.localizeAutoGeneratedNamesForCurrentLanguage()) {
                await ensurePersistenceSaved();
            }
            if (ensureImportedGroupsFallbackToStandardTime()) {
                await ensurePersistenceSaved();
            }
            await deps.applyTheme(await deps.loadThemePreference(), false);
            await deps.applyUiScale(await deps.loadUiScalePreference(), false);
            deps.applyTranslations();
            deps.applyVersionBranding();

            const langSelect = document.getElementById("lang-select");
            if (langSelect) langSelect.value = deps.getCurrentLang();

            const themeSelect = document.getElementById("theme-select");
            if (themeSelect) themeSelect.value = deps.getCurrentTheme();
            const uiScaleSelect = document.getElementById("ui-scale-select");
            if (uiScaleSelect) {
                deps.populateUiScaleSelect(uiScaleSelect);
                uiScaleSelect.value = String(deps.getCurrentUiScalePercent());
            }
            deps.refreshMultiRangeControls();

            deps.updateTZDropdown();
            deps.refreshSelectWidths();
            deps.switchMainTab(deps.getCurrentMainTab());
        }

        return Object.freeze({
            applyImportedSettings
        });
    }

    globalObj.GTVSettingsIO = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/data-transfer.js ---
(function initGtvDataTransfer(globalObj) {
    "use strict";

    function createService(deps) {
        let pendingGroupImportIndex = null;
        let pendingSubgroupImportTarget = null;

        async function ensurePersistenceSaved() {
            const ok = await deps.savePersistence();
            if (ok) return true;
            const err = new Error("Persistence save failed");
            err.code = "PERSISTENCE_WRITE_FAILED";
            throw err;
        }

        function getSettingsExportFileName() {
            const now = new Date();
            const stamp = `${now.getFullYear()}-${deps.pad(now.getMonth() + 1)}-${deps.pad(now.getDate())}_${deps.pad(now.getHours())}${deps.pad(now.getMinutes())}${deps.pad(now.getSeconds())}`;
            return `GlobalTimeViwer_settings_${stamp}.json`;
        }

        function getGroupExportFileName(groupName = "") {
            const now = new Date();
            const stamp = `${now.getFullYear()}-${deps.pad(now.getMonth() + 1)}-${deps.pad(now.getDate())}_${deps.pad(now.getHours())}${deps.pad(now.getMinutes())}${deps.pad(now.getSeconds())}`;
            const safeName = deps.sanitizeFilenamePart(groupName || "") || "group";
            return `GlobalTimeViwer_group_${safeName}_${stamp}.json`;
        }

        function getSubgroupExportFileName(groupName = "", subgroupName = "") {
            const now = new Date();
            const stamp = `${now.getFullYear()}-${deps.pad(now.getMonth() + 1)}-${deps.pad(now.getDate())}_${deps.pad(now.getHours())}${deps.pad(now.getMinutes())}${deps.pad(now.getSeconds())}`;
            const safeGroupName = deps.sanitizeFilenamePart(groupName || "") || "group";
            const safeSubgroupName = deps.sanitizeFilenamePart(subgroupName || "") || "subgroup";
            return `GlobalTimeViwer_subgroup_${safeGroupName}_${safeSubgroupName}_${stamp}.json`;
        }

        function isValidGroupImportSource(source) {
            if (!source || typeof source !== "object") return false;
            if (typeof source.name !== "string" || !source.name.trim()) return false;
            if (!Array.isArray(source.zones)) return false;
            return true;
        }

        function isValidSubgroupImportSource(source) {
            if (!source || typeof source !== "object") return false;
            if (typeof source.name !== "string" || !source.name.trim()) return false;
            if (!Array.isArray(source.multiRanges) || !source.multiRanges.length) return false;
            const count = parseInt(source.multiRangeCount, 10);
            if (!Number.isFinite(count) || count < deps.MIN_MULTI_RANGE_COUNT) return false;
            return true;
        }

        async function applyImportedGroupSettings(importedRoot, targetGroupIdx = deps.getActiveGroupId()) {
            const groups = Array.isArray(deps.getGroups()) ? deps.getGroups() : [];
            if (!groups.length) return;
            const rootType = (importedRoot && typeof importedRoot === "object" && typeof importedRoot.type === "string")
                ? importedRoot.type.trim().toLowerCase()
                : "";
            if (rootType && rootType !== "group") {
                throw new Error("Invalid group payload type");
            }
            const source = (importedRoot && typeof importedRoot === "object" && importedRoot.group && typeof importedRoot.group === "object")
                ? importedRoot.group
                : importedRoot;
            if (!isValidGroupImportSource(source)) {
                throw new Error("Invalid group payload");
            }

            const safeIdx = Math.min(Math.max(parseInt(targetGroupIdx, 10) || 0, 0), groups.length - 1);
            const sanitized = deps.sanitizeGroup(source, safeIdx, null);
            if (!sanitized) {
                throw new Error("Invalid group payload");
            }
            deps.ensureGroupMultiSubgroups(sanitized);
            deps.syncCurrentMultiStateToActiveSubgroup();
            groups[safeIdx] = sanitized;

            if (deps.getActiveGroupId() === safeIdx) {
                deps.loadCurrentMultiStateFromActiveSubgroup();
            }
            await ensurePersistenceSaved();
            deps.renderGroups();
            deps.renderMultiSubgroups();
            if (deps.isMultiTab()) {
                deps.renderBaseTimeSelect();
                deps.renderMultiRanges();
            } else {
                deps.renderList();
            }
        }

        async function applyImportedSubgroupSettings(importedRoot, targetGroupIdx = deps.getActiveGroupId(), targetSubgroupId = "") {
            const groups = Array.isArray(deps.getGroups()) ? deps.getGroups() : [];
            if (!groups.length) return;
            const rootType = (importedRoot && typeof importedRoot === "object" && typeof importedRoot.type === "string")
                ? importedRoot.type.trim().toLowerCase()
                : "";
            if (rootType && rootType !== "subgroup") {
                throw new Error("Invalid subgroup payload type");
            }
            const source = (importedRoot && typeof importedRoot === "object" && importedRoot.subgroup && typeof importedRoot.subgroup === "object")
                ? importedRoot.subgroup
                : importedRoot;
            if (!isValidSubgroupImportSource(source)) {
                throw new Error("Invalid subgroup payload");
            }

            const safeGroupIdx = Math.min(Math.max(parseInt(targetGroupIdx, 10) || 0, 0), groups.length - 1);
            const targetGroup = groups[safeGroupIdx];
            if (!targetGroup) {
                throw new Error("Invalid subgroup target group");
            }
            deps.ensureGroupMultiSubgroups(targetGroup);
            const normalizedSubgroupId = deps.sanitizeMultiSubgroupId(targetSubgroupId) || targetGroup.activeMultiSubgroupId;
            const targetSubgroup = targetGroup.multiSubgroups.find((item) => item.id === normalizedSubgroupId);
            if (!targetSubgroup) {
                throw new Error("Invalid subgroup target");
            }

            const normalizedState = deps.sanitizeMultiStatePayload(source, null);
            deps.syncCurrentMultiStateToActiveSubgroup();
            targetSubgroup.name = deps.sanitizeMultiSubgroupName(source.name, targetSubgroup.name || deps.getDefaultMultiSubgroupName(0));
            targetSubgroup.multiRangeCount = normalizedState.multiRangeCount;
            targetSubgroup.multiRanges = normalizedState.multiRanges;
            targetSubgroup.multiRangeCollapsed = normalizedState.multiRangeCollapsed;
            targetSubgroup.multiRangeStartEditEnabled = normalizedState.multiRangeStartEditEnabled;
            targetSubgroup.multiRangeEndEditEnabled = normalizedState.multiRangeEndEditEnabled;

            if (deps.getActiveGroupId() === safeGroupIdx && targetGroup.activeMultiSubgroupId === targetSubgroup.id) {
                deps.loadCurrentMultiStateFromActiveSubgroup();
            }
            await ensurePersistenceSaved();
            deps.renderGroups();
            deps.renderMultiSubgroups();
            if (deps.isMultiTab()) {
                deps.renderBaseTimeSelect();
                deps.renderMultiRanges();
            } else {
                deps.renderList();
            }
        }

        function exportGroupToJSON(groupIdx = deps.getActiveGroupId()) {
            const groups = Array.isArray(deps.getGroups()) ? deps.getGroups() : [];
            if (!groups.length) return;
            try {
                deps.syncCurrentMultiStateToActiveSubgroup();
                const safeIdx = Math.min(Math.max(parseInt(groupIdx, 10) || 0, 0), groups.length - 1);
                const sourceGroup = groups[safeIdx];
                if (!sourceGroup) return;
                deps.ensureGroupMultiSubgroups(sourceGroup);

                const groupPayload = {
                    name: sourceGroup.name,
                    zones: sourceGroup.zones,
                    baseTimezoneId: sourceGroup.baseTimezoneId,
                    showUtcRow: sourceGroup.showUtcRow,
                    utcRowOrder: sourceGroup.utcRowOrder,
                    fixedDate: sourceGroup.fixedDate,
                    fixedTimes: sourceGroup.fixedTimes,
                    activeMultiSubgroupId: sourceGroup.activeMultiSubgroupId,
                    multiSubgroups: sourceGroup.multiSubgroups
                };
                const fileName = getGroupExportFileName(sourceGroup.name);
                const exportPayload = {
                    app: "GlobalTimeViwer",
                    type: "group",
                    formatVersion: 1,
                    version: deps.VERSION,
                    exportedAt: new Date().toISOString(),
                    group: JSON.parse(JSON.stringify(groupPayload))
                };

                const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json;charset=utf-8" });
                const url = URL.createObjectURL(blob);
                const anchor = document.createElement("a");
                anchor.href = url;
                anchor.download = fileName;
                document.body.appendChild(anchor);
                anchor.click();
                anchor.remove();
                URL.revokeObjectURL(url);
                deps.showToast(deps.tFormat("toast_group_export_success", { filename: fileName }));
            } catch (err) {
                console.error("exportGroupToJSON failed:", err);
                deps.showToast(deps.t("toast_group_export_failed"));
            }
        }

        function triggerGroupImportFor(groupIdx = deps.getActiveGroupId()) {
            const groups = Array.isArray(deps.getGroups()) ? deps.getGroups() : [];
            if (!groups.length) return;
            const safeIdx = Math.min(Math.max(parseInt(groupIdx, 10) || 0, 0), groups.length - 1);
            const groupImportFile = document.getElementById("group-import-file");
            if (!groupImportFile) return;
            pendingGroupImportIndex = safeIdx;
            groupImportFile.value = "";
            groupImportFile.click();
        }

        async function handleGroupImportFile(event) {
            const input = event?.target;
            const file = input?.files?.[0];
            if (!file) {
                pendingGroupImportIndex = null;
                if (input) input.value = "";
                return;
            }

            try {
                const raw = await file.text();
                let parsed;
                try {
                    parsed = JSON.parse(raw);
                } catch (jsonErr) {
                    deps.showToast(deps.t("toast_invalid_format"));
                    return;
                }
                await applyImportedGroupSettings(parsed, pendingGroupImportIndex ?? deps.getActiveGroupId());
                deps.showToast(deps.tFormat("toast_group_import_success", { filename: file.name || getGroupExportFileName("group") }));
            } catch (err) {
                console.error("handleGroupImportFile failed:", err);
                if (err.message === "Invalid group payload" || err.message === "Invalid group payload type") {
                    deps.showToast(deps.t("toast_invalid_format"));
                } else if (err && typeof err === "object" && err.code === "PERSISTENCE_WRITE_FAILED") {
                    deps.showToast(deps.t("toast_storage_save_failed"));
                } else {
                    deps.showToast(deps.t("toast_group_import_failed"));
                }
            } finally {
                pendingGroupImportIndex = null;
                if (input) input.value = "";
            }
        }

        function exportSubgroupToJSON(groupIdx = deps.getActiveGroupId(), subgroupId = "") {
            const groups = Array.isArray(deps.getGroups()) ? deps.getGroups() : [];
            if (!groups.length) return;
            try {
                deps.syncCurrentMultiStateToActiveSubgroup();
                const safeGroupIdx = Math.min(Math.max(parseInt(groupIdx, 10) || 0, 0), groups.length - 1);
                const sourceGroup = groups[safeGroupIdx];
                if (!sourceGroup) return;
                deps.ensureGroupMultiSubgroups(sourceGroup);

                const targetSubgroupId = deps.sanitizeMultiSubgroupId(subgroupId) || sourceGroup.activeMultiSubgroupId;
                const sourceSubgroup = sourceGroup.multiSubgroups.find((item) => item.id === targetSubgroupId) || sourceGroup.multiSubgroups[0];
                if (!sourceSubgroup) return;

                const subgroupPayload = {
                    name: sourceSubgroup.name,
                    multiRangeCount: sourceSubgroup.multiRangeCount,
                    multiRanges: sourceSubgroup.multiRanges,
                    multiRangeCollapsed: sourceSubgroup.multiRangeCollapsed,
                    multiRangeStartEditEnabled: sourceSubgroup.multiRangeStartEditEnabled,
                    multiRangeEndEditEnabled: sourceSubgroup.multiRangeEndEditEnabled
                };
                const fileName = getSubgroupExportFileName(sourceGroup.name, sourceSubgroup.name);
                const exportPayload = {
                    app: "GlobalTimeViwer",
                    type: "subgroup",
                    formatVersion: 1,
                    version: deps.VERSION,
                    exportedAt: new Date().toISOString(),
                    groupName: sourceGroup.name,
                    subgroup: JSON.parse(JSON.stringify(subgroupPayload))
                };

                const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json;charset=utf-8" });
                const url = URL.createObjectURL(blob);
                const anchor = document.createElement("a");
                anchor.href = url;
                anchor.download = fileName;
                document.body.appendChild(anchor);
                anchor.click();
                anchor.remove();
                URL.revokeObjectURL(url);
                deps.showToast(deps.tFormat("toast_subgroup_export_success", { filename: fileName }));
            } catch (err) {
                console.error("exportSubgroupToJSON failed:", err);
                deps.showToast(deps.t("toast_subgroup_export_failed"));
            }
        }

        function triggerSubgroupImportFor(groupIdx = deps.getActiveGroupId(), subgroupId = "") {
            const groups = Array.isArray(deps.getGroups()) ? deps.getGroups() : [];
            if (!groups.length) return;
            const safeGroupIdx = Math.min(Math.max(parseInt(groupIdx, 10) || 0, 0), groups.length - 1);
            const group = groups[safeGroupIdx];
            if (!group) return;
            deps.ensureGroupMultiSubgroups(group);
            const targetSubgroupId = deps.sanitizeMultiSubgroupId(subgroupId) || group.activeMultiSubgroupId;
            const exists = group.multiSubgroups.some((item) => item.id === targetSubgroupId);
            if (!exists) return;

            const subgroupImportFile = document.getElementById("subgroup-import-file");
            if (!subgroupImportFile) return;
            pendingSubgroupImportTarget = { groupIdx: safeGroupIdx, subgroupId: targetSubgroupId };
            subgroupImportFile.value = "";
            subgroupImportFile.click();
        }

        async function handleSubgroupImportFile(event) {
            const input = event?.target;
            const file = input?.files?.[0];
            if (!file) {
                pendingSubgroupImportTarget = null;
                if (input) input.value = "";
                return;
            }

            try {
                const raw = await file.text();
                let parsed;
                try {
                    parsed = JSON.parse(raw);
                } catch (jsonErr) {
                    deps.showToast(deps.t("toast_invalid_format"));
                    return;
                }
                const target = pendingSubgroupImportTarget || { groupIdx: deps.getActiveGroupId(), subgroupId: deps.getCurrentMultiSubgroup()?.id || "" };
                await applyImportedSubgroupSettings(parsed, target.groupIdx, target.subgroupId);
                deps.showToast(deps.tFormat("toast_subgroup_import_success", { filename: file.name || getSubgroupExportFileName("group", "subgroup") }));
            } catch (err) {
                console.error("handleSubgroupImportFile failed:", err);
                if (err.message === "Invalid subgroup payload" || err.message === "Invalid subgroup payload type") {
                    deps.showToast(deps.t("toast_invalid_format"));
                } else if (err && typeof err === "object" && err.code === "PERSISTENCE_WRITE_FAILED") {
                    deps.showToast(deps.t("toast_storage_save_failed"));
                } else {
                    deps.showToast(deps.t("toast_subgroup_import_failed"));
                }
            } finally {
                pendingSubgroupImportTarget = null;
                if (input) input.value = "";
            }
        }

        function exportSettingsToJSON() {
            try {
                const fileName = getSettingsExportFileName();
                const currentLang = deps.getCurrentLang();
                const exportPayload = {
                    app: "GlobalTimeViwer",
                    formatVersion: 1,
                    version: deps.VERSION,
                    exportedAt: new Date().toISOString(),
                    data: deps.getPersistenceSnapshot(),
                    preferences: {
                        theme: deps.sanitizeTheme(deps.getCurrentTheme()),
                        language: deps.I18N_DATA[currentLang] ? currentLang : "ko",
                        uiScale: deps.getCurrentUiScalePercent()
                    }
                };

                const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json;charset=utf-8" });
                const url = URL.createObjectURL(blob);
                const anchor = document.createElement("a");
                anchor.href = url;
                anchor.download = fileName;
                document.body.appendChild(anchor);
                anchor.click();
                anchor.remove();
                URL.revokeObjectURL(url);
                deps.showToast(deps.tFormat("toast_settings_export_success", { filename: fileName }));
            } catch (err) {
                console.error("exportSettingsToJSON failed:", err);
                deps.showToast(deps.t("toast_settings_export_failed"));
            }
        }

        async function handleSettingsImportFile(event) {
            const input = event?.target;
            const file = input?.files?.[0];
            if (!file) return;

            try {
                const raw = await file.text();
                let parsed;
                try {
                    parsed = JSON.parse(raw);
                } catch (jsonErr) {
                    deps.showToast(deps.t("toast_invalid_format"));
                    return;
                }
                await deps.applyImportedSettings(parsed);
                deps.showToast(deps.tFormat("toast_settings_import_success", { filename: file.name || getSettingsExportFileName() }));
            } catch (err) {
                console.error("handleSettingsImportFile failed:", err);
                if (err.message === "Invalid settings payload" || err.message === "Invalid settings payload: groups is required") {
                    deps.showToast(deps.t("toast_invalid_format"));
                } else {
                    const cause = (err && typeof err === "object" && err.code === "PERSISTENCE_WRITE_FAILED") ? err.cause : err;
                    if (deps.isQuotaExceededError(cause)) {
                        deps.showToast(deps.t("toast_storage_quota_exceeded"));
                    } else if (err && typeof err === "object" && err.code === "PERSISTENCE_WRITE_FAILED") {
                        deps.showToast(deps.t("toast_storage_save_failed"));
                    } else {
                        deps.showToast(deps.t("toast_settings_import_failed"));
                    }
                }
            } finally {
                if (input) input.value = "";
            }
        }

        return Object.freeze({
            getSettingsExportFileName,
            getGroupExportFileName,
            getSubgroupExportFileName,
            exportGroupToJSON,
            triggerGroupImportFor,
            handleGroupImportFile,
            exportSubgroupToJSON,
            triggerSubgroupImportFor,
            handleSubgroupImportFile,
            exportSettingsToJSON,
            handleSettingsImportFile
        });
    }

    globalObj.GTVDataTransfer = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: main.js ---
let isRealtime = true;
if (typeof window !== "undefined" && window) window.isRealtime = isRealtime;
let globalTimes = [new Date(), new Date()];
let slotCount = 1;
let uiScale = 1.0;
let showCopyFormat = false;
let showTimeline = false;
const GTV_MAIN_CONSTANTS = (typeof window !== "undefined" ? window.GTVMainConstants : globalThis.GTVMainConstants);
if (!GTV_MAIN_CONSTANTS || typeof GTV_MAIN_CONSTANTS !== "object") {
    throw new Error("Missing required module: GTVMainConstants");
}
const COPY_FORMAT_KEYS = [...(GTV_MAIN_CONSTANTS.COPY_FORMAT_KEYS || [])];
const TIME_PART_KEYS = [...(GTV_MAIN_CONSTANTS.TIME_PART_KEYS || [])];
const PERIOD_RESULT_IDS = new Set(GTV_MAIN_CONSTANTS.PERIOD_RESULT_IDS || []);
const TIMELINE_TOTAL_HOURS = Number(GTV_MAIN_CONSTANTS.TIMELINE_TOTAL_HOURS || 24);
const TIMELINE_TOTAL_SECONDS = Number(GTV_MAIN_CONSTANTS.TIMELINE_TOTAL_SECONDS || (24 * 60 * 60));
const MAIN_TABS = [...(GTV_MAIN_CONSTANTS.MAIN_TABS || [])];
const DEFAULT_REALTIME_TICK_MS = 1000;
const requestUiFrame = (typeof requestAnimationFrame === "function")
    ? requestAnimationFrame.bind(globalThis)
    : ((cb) => setTimeout(cb, 16));
const cancelUiFrame = (typeof cancelAnimationFrame === "function")
    ? cancelAnimationFrame.bind(globalThis)
    : ((id) => clearTimeout(id));
const MIN_TIME_ADJUST_DAY_STEP = Number(GTV_MAIN_CONSTANTS.MIN_TIME_ADJUST_DAY_STEP || 1);
const MAX_TIME_ADJUST_DAY_STEP = Number(GTV_MAIN_CONSTANTS.MAX_TIME_ADJUST_DAY_STEP || 36500);
const DEFAULT_TIME_ADJUST_DAY_STEP = Number(GTV_MAIN_CONSTANTS.DEFAULT_TIME_ADJUST_DAY_STEP || 1);
const MIN_MULTI_RANGE_COUNT = Number(GTV_MAIN_CONSTANTS.MIN_MULTI_RANGE_COUNT || 1);
const MAX_MULTI_RANGE_COUNT = Number(GTV_MAIN_CONSTANTS.MAX_MULTI_RANGE_COUNT || 12);
const MIN_FIXED_TIME_SLOT_COUNT = Number(GTV_MAIN_CONSTANTS.MIN_FIXED_TIME_SLOT_COUNT || 1);
const MAX_FIXED_TIME_SLOT_COUNT = Number(GTV_MAIN_CONSTANTS.MAX_FIXED_TIME_SLOT_COUNT || 5);
const DEFAULT_FIXED_TIME_VALUE = String(GTV_MAIN_CONSTANTS.DEFAULT_FIXED_TIME_VALUE || "09:00");
const DEFAULT_MULTI_RANGE_TITLE = String(GTV_MAIN_CONSTANTS.DEFAULT_MULTI_RANGE_TITLE || "Range");
const DEFAULT_DISPLAY_FORMAT_ENABLED = { ...(GTV_MAIN_CONSTANTS.DEFAULT_DISPLAY_FORMAT_ENABLED || {}) };
const DEFAULT_COPY_FORMAT_ENABLED = { ...(GTV_MAIN_CONSTANTS.DEFAULT_COPY_FORMAT_ENABLED || {}) };
const DEFAULT_DISPLAY_TIME_PARTS_ENABLED = { ...(GTV_MAIN_CONSTANTS.DEFAULT_DISPLAY_TIME_PARTS_ENABLED || {}) };
const DEFAULT_COPY_TIME_PARTS_ENABLED = { ...(GTV_MAIN_CONSTANTS.DEFAULT_COPY_TIME_PARTS_ENABLED || {}) };
const FORMAT_PROFILE_CONTEXT_KEYS = [...(GTV_MAIN_CONSTANTS.FORMAT_PROFILE_CONTEXT_KEYS || [])];

let displayFormatOrder = [...COPY_FORMAT_KEYS];
let displayFormatEnabled = { ...DEFAULT_DISPLAY_FORMAT_ENABLED };
let copyFormatOrder = [...COPY_FORMAT_KEYS];
let copyFormatEnabled = { ...DEFAULT_COPY_FORMAT_ENABLED };
let displayTimePartsEnabled = { ...DEFAULT_DISPLAY_TIME_PARTS_ENABLED };
let copyTimePartsEnabled = { ...DEFAULT_COPY_TIME_PARTS_ENABLED };
let formatProfiles = {};
let activeFormatProfileContext = "live";
let timeAdjustDayStepBySlot = [DEFAULT_TIME_ADJUST_DAY_STEP, DEFAULT_TIME_ADJUST_DAY_STEP];
let multiRangeCount = 1;
let multiRangeTitle = t("placeholder_range_title");
let multiRanges = [];
let multiRangeCollapsed = [];
let multiRangeStartEditEnabled = [];
let multiRangeEndEditEnabled = [];
let currentMainTab = "live";
let activeGroupIdByMainTab = { live: 0, fixed: 0 };
let currentTheme = "dark";
let canUseForeignObjectRenderer = null;
let timezoneIdSeed = 0;
let fixedTimeIdSeed = 0;
let groups = [];
let activeGroupId = 0;
let appFeedbackService = null;
let calculatorActionsService = null;

function setIsRealtimeState(next) {
    isRealtime = !!next;
    if (typeof window !== "undefined" && window) window.isRealtime = isRealtime;
    return isRealtime;
}

function applyVersionBranding() {
    const titleText = `Global Time Viwer v${VERSION}`;
    document.title = titleText;
    const badge = document.getElementById("version-badge");
    if (badge) badge.textContent = `ver ${VERSION}`;
}

const MAX_RUNTIME_CACHE_SIZE = 4096;
const timezoneOffsetCache = new Map();
const timezoneDstCache = new Map();
const zoneAbbrCache = new Map();
const rowViewCache = new Map();
const GTV_SERVICE_BOOTSTRAP = (typeof window !== "undefined" ? window.GTVServiceBootstrap : globalThis.GTVServiceBootstrap);
const GTV_APP_STATE_PATCHER = (typeof window !== "undefined" ? window.GTVAppStatePatcher : globalThis.GTVAppStatePatcher);
const GTV_TIME_SERVICE = (typeof window !== "undefined" ? window.GTVTimeService : globalThis.GTVTimeService);
const GTV_TIME_CORE = (typeof window !== "undefined" ? window.GTVTimeCore : globalThis.GTVTimeCore);
const GTV_TIME_INPUT_MUTATIONS = (typeof window !== "undefined" ? window.GTVTimeInputMutations : globalThis.GTVTimeInputMutations);
const GTV_TIMER_ENGINE = (typeof window !== "undefined" ? window.GTVTimerEngine : globalThis.GTVTimerEngine);
const GTV_CALCULATOR = (typeof window !== "undefined" ? window.GTVCalculator : globalThis.GTVCalculator);
const GTV_CALCULATOR_ACTIONS = (typeof window !== "undefined" ? window.GTVCalculatorActions : globalThis.GTVCalculatorActions);
const GTV_MULTI_STATE = (typeof window !== "undefined" ? window.GTVMultiState : globalThis.GTVMultiState);
const GTV_IMAGE_EXPORT = (typeof window !== "undefined" ? window.GTVImageExport : globalThis.GTVImageExport);
const GTV_IMAGE_EXPORT_ACTIONS = (typeof window !== "undefined" ? window.GTVImageExportActions : globalThis.GTVImageExportActions);
const GTV_IMAGE_EXPORT_BRIDGE = (typeof window !== "undefined" ? window.GTVImageExportBridge : globalThis.GTVImageExportBridge);
const GTV_IMAGE_EXPORT_NAMING = (typeof window !== "undefined" ? window.GTVImageExportNaming : globalThis.GTVImageExportNaming);
const GTV_IMAGE_CLONE = (typeof window !== "undefined" ? window.GTVImageClone : globalThis.GTVImageClone);
const GTV_IMAGE_FOREIGN_RENDER = (typeof window !== "undefined" ? window.GTVImageForeignRender : globalThis.GTVImageForeignRender);
const GTV_TABLE_IMAGE_RENDER = (typeof window !== "undefined" ? window.GTVTableImageRender : globalThis.GTVTableImageRender);
const GTV_GROUP_STATE = (typeof window !== "undefined" ? window.GTVGroupState : globalThis.GTVGroupState);
const GTV_GROUP_CONTEXT_STATE = (typeof window !== "undefined" ? window.GTVGroupContextState : globalThis.GTVGroupContextState);
const GTV_GROUP_TABS = (typeof window !== "undefined" ? window.GTVGroupTabs : globalThis.GTVGroupTabs);
const GTV_TIMEZONE_SEARCH = (typeof window !== "undefined" ? window.GTVTimezoneSearch : globalThis.GTVTimezoneSearch);
const GTV_SNAPSHOT_FORMAT = (typeof window !== "undefined" ? window.GTVSnapshotFormat : globalThis.GTVSnapshotFormat);
const GTV_TABLE_RENDER = (typeof window !== "undefined" ? window.GTVTableRender : globalThis.GTVTableRender);
const GTV_MULTI_RANGE_STATE = (typeof window !== "undefined" ? window.GTVMultiRangeState : globalThis.GTVMultiRangeState);
const GTV_MULTI_RANGE_RENDER = (typeof window !== "undefined" ? window.GTVMultiRangeRender : globalThis.GTVMultiRangeRender);
const GTV_MULTI_RANGE_IMAGE_RENDER = (typeof window !== "undefined" ? window.GTVMultiRangeImageRender : globalThis.GTVMultiRangeImageRender);
const GTV_MULTI_RANGE_COPY = (typeof window !== "undefined" ? window.GTVMultiRangeCopy : globalThis.GTVMultiRangeCopy);
const GTV_COPY_ACTIONS = (typeof window !== "undefined" ? window.GTVCopyActions : globalThis.GTVCopyActions);
const GTV_TIME_ADJUST_UI = (typeof window !== "undefined" ? window.GTVTimeAdjustUI : globalThis.GTVTimeAdjustUI);
const GTV_TIME_ADJUST_ACTIONS = (typeof window !== "undefined" ? window.GTVTimeAdjustActions : globalThis.GTVTimeAdjustActions);
const GTV_MULTI_BULK_TOOLS = (typeof window !== "undefined" ? window.GTVMultiBulkTools : globalThis.GTVMultiBulkTools);
const GTV_TIMELINE_FRAME = (typeof window !== "undefined" ? window.GTVTimelineFrame : globalThis.GTVTimelineFrame);
const GTV_FIXED_TIME_CORE = (typeof window !== "undefined" ? window.GTVFixedTimeCore : globalThis.GTVFixedTimeCore);
const GTV_FIXED_TIME_SLOT_UTILS = (typeof window !== "undefined" ? window.GTVFixedTimeSlotUtils : globalThis.GTVFixedTimeSlotUtils);
const GTV_FIXED_TIME_STATE = (typeof window !== "undefined" ? window.GTVFixedTimeState : globalThis.GTVFixedTimeState);
const GTV_FIXED_TIME_TIMELINE = (typeof window !== "undefined" ? window.GTVFixedTimeTimeline : globalThis.GTVFixedTimeTimeline);
const GTV_FIXED_TIME_ACTIONS = (typeof window !== "undefined" ? window.GTVFixedTimeActions : globalThis.GTVFixedTimeActions);
const GTV_FIXED_TIME_TABLE = (typeof window !== "undefined" ? window.GTVFixedTimeTable : globalThis.GTVFixedTimeTable);
const GTV_FORMAT_PROFILE_STATE = (typeof window !== "undefined" ? window.GTVFormatProfileState : globalThis.GTVFormatProfileState);
const GTV_FORMAT_CONTROLS = (typeof window !== "undefined" ? window.GTVFormatControls : globalThis.GTVFormatControls);
const GTV_TAB_UI = (typeof window !== "undefined" ? window.GTVTabUI : globalThis.GTVTabUI);
const GTV_TAB_ORCHESTRATOR = (typeof window !== "undefined" ? window.GTVTabOrchestrator : globalThis.GTVTabOrchestrator);
const GTV_UI_SETTINGS_ACTIONS = (typeof window !== "undefined" ? window.GTVUiSettingsActions : globalThis.GTVUiSettingsActions);
const GTV_APP_PERSISTENCE_STATE = (typeof window !== "undefined" ? window.GTVAppPersistenceState : globalThis.GTVAppPersistenceState);
const GTV_PERSISTENCE_SERVICE_BUNDLE = (typeof window !== "undefined" ? window.GTVPersistenceServiceBundle : globalThis.GTVPersistenceServiceBundle);
const GTV_STATE_PERSISTENCE = (typeof window !== "undefined" ? window.GTVStatePersistence : globalThis.GTVStatePersistence);
const GTV_UI_PREFERENCES_STATE = (typeof window !== "undefined" ? window.GTVUiPreferencesState : globalThis.GTVUiPreferencesState);
const GTV_SETTINGS_IO = (typeof window !== "undefined" ? window.GTVSettingsIO : globalThis.GTVSettingsIO);
const GTV_DATA_TRANSFER = (typeof window !== "undefined" ? window.GTVDataTransfer : globalThis.GTVDataTransfer);
const GTV_APP_CONFIG = (typeof window !== "undefined" ? window.GTVAppConfig : globalThis.GTVAppConfig);
const GTV_TIMEZONE_DATA = (typeof window !== "undefined" ? window.GTVTimezoneData : globalThis.GTVTimezoneData);
const GTV_MAIN_UI_INIT = (typeof window !== "undefined" ? window.GTVMainUiInit : globalThis.GTVMainUiInit);
const GTV_MAIN_UI_UTILS = (typeof window !== "undefined" ? window.GTVMainUiUtils : globalThis.GTVMainUiUtils);
const GTV_APP_FEEDBACK = (typeof window !== "undefined" ? window.GTVAppFeedback : globalThis.GTVAppFeedback);
if (!GTV_SERVICE_BOOTSTRAP || typeof GTV_SERVICE_BOOTSTRAP.createService !== "function") {
    throw new Error("Missing required module API: GTVServiceBootstrap.createService");
}
if (!GTV_APP_STATE_PATCHER || typeof GTV_APP_STATE_PATCHER.createService !== "function") {
    throw new Error("Missing required module API: GTVAppStatePatcher.createService");
}
if (!GTV_TIME_SERVICE || typeof GTV_TIME_SERVICE.createService !== "function") {
    throw new Error("Missing required module API: GTVTimeService.createService");
}
if (!GTV_TIME_CORE) {
    throw new Error("Missing required module: GTVTimeCore");
}
if (!GTV_TIME_INPUT_MUTATIONS || typeof GTV_TIME_INPUT_MUTATIONS.createService !== "function") {
    throw new Error("Missing required module API: GTVTimeInputMutations.createService");
}
if (!GTV_TIMER_ENGINE || typeof GTV_TIMER_ENGINE.createService !== "function") {
    throw new Error("Missing required module API: GTVTimerEngine.createService");
}
if (!GTV_CALCULATOR_ACTIONS || typeof GTV_CALCULATOR_ACTIONS.createService !== "function") {
    throw new Error("Missing required module API: GTVCalculatorActions.createService");
}
if (!GTV_IMAGE_EXPORT || typeof GTV_IMAGE_EXPORT.createService !== "function") {
    throw new Error("Missing required module API: GTVImageExport.createService");
}
if (!GTV_IMAGE_EXPORT_ACTIONS || typeof GTV_IMAGE_EXPORT_ACTIONS.createService !== "function") {
    throw new Error("Missing required module API: GTVImageExportActions.createService");
}
if (!GTV_IMAGE_EXPORT_BRIDGE || typeof GTV_IMAGE_EXPORT_BRIDGE.createService !== "function") {
    throw new Error("Missing required module API: GTVImageExportBridge.createService");
}
if (!GTV_IMAGE_EXPORT_NAMING || typeof GTV_IMAGE_EXPORT_NAMING.createService !== "function") {
    throw new Error("Missing required module API: GTVImageExportNaming.createService");
}
if (!GTV_IMAGE_CLONE || typeof GTV_IMAGE_CLONE.createService !== "function") {
    throw new Error("Missing required module API: GTVImageClone.createService");
}
if (!GTV_IMAGE_FOREIGN_RENDER || typeof GTV_IMAGE_FOREIGN_RENDER.createService !== "function") {
    throw new Error("Missing required module API: GTVImageForeignRender.createService");
}
if (!GTV_TABLE_IMAGE_RENDER || typeof GTV_TABLE_IMAGE_RENDER.createService !== "function") {
    throw new Error("Missing required module API: GTVTableImageRender.createService");
}
if (!GTV_MULTI_STATE || typeof GTV_MULTI_STATE.createService !== "function") {
    throw new Error("Missing required module API: GTVMultiState.createService");
}
if (!GTV_GROUP_STATE || typeof GTV_GROUP_STATE.createService !== "function") {
    throw new Error("Missing required module API: GTVGroupState.createService");
}
if (!GTV_GROUP_CONTEXT_STATE || typeof GTV_GROUP_CONTEXT_STATE.createService !== "function") {
    throw new Error("Missing required module API: GTVGroupContextState.createService");
}
if (!GTV_GROUP_TABS || typeof GTV_GROUP_TABS.createService !== "function") {
    throw new Error("Missing required module API: GTVGroupTabs.createService");
}
if (!GTV_TIMEZONE_SEARCH || typeof GTV_TIMEZONE_SEARCH.createService !== "function") {
    throw new Error("Missing required module API: GTVTimezoneSearch.createService");
}
if (!GTV_SNAPSHOT_FORMAT || typeof GTV_SNAPSHOT_FORMAT.createService !== "function") {
    throw new Error("Missing required module API: GTVSnapshotFormat.createService");
}
if (!GTV_TABLE_RENDER || typeof GTV_TABLE_RENDER.createService !== "function") {
    throw new Error("Missing required module API: GTVTableRender.createService");
}
if (!GTV_MULTI_RANGE_STATE || typeof GTV_MULTI_RANGE_STATE.createService !== "function") {
    throw new Error("Missing required module API: GTVMultiRangeState.createService");
}
if (!GTV_MULTI_RANGE_IMAGE_RENDER || typeof GTV_MULTI_RANGE_IMAGE_RENDER.createService !== "function") {
    throw new Error("Missing required module API: GTVMultiRangeImageRender.createService");
}
if (!GTV_MULTI_RANGE_RENDER || typeof GTV_MULTI_RANGE_RENDER.createService !== "function") {
    throw new Error("Missing required module API: GTVMultiRangeRender.createService");
}
if (!GTV_MULTI_RANGE_COPY || typeof GTV_MULTI_RANGE_COPY.createService !== "function") {
    throw new Error("Missing required module API: GTVMultiRangeCopy.createService");
}
if (!GTV_COPY_ACTIONS || typeof GTV_COPY_ACTIONS.createService !== "function") {
    throw new Error("Missing required module API: GTVCopyActions.createService");
}
if (!GTV_TIME_ADJUST_UI || typeof GTV_TIME_ADJUST_UI.createService !== "function") {
    throw new Error("Missing required module API: GTVTimeAdjustUI.createService");
}
if (!GTV_TIME_ADJUST_ACTIONS || typeof GTV_TIME_ADJUST_ACTIONS.createService !== "function") {
    throw new Error("Missing required module API: GTVTimeAdjustActions.createService");
}
if (!GTV_MULTI_BULK_TOOLS || typeof GTV_MULTI_BULK_TOOLS.createService !== "function") {
    throw new Error("Missing required module API: GTVMultiBulkTools.createService");
}
if (!GTV_TIMELINE_FRAME || typeof GTV_TIMELINE_FRAME.createService !== "function") {
    throw new Error("Missing required module API: GTVTimelineFrame.createService");
}
if (!GTV_FIXED_TIME_CORE || typeof GTV_FIXED_TIME_CORE.createService !== "function") {
    throw new Error("Missing required module API: GTVFixedTimeCore.createService");
}
if (!GTV_FIXED_TIME_SLOT_UTILS || typeof GTV_FIXED_TIME_SLOT_UTILS.createService !== "function") {
    throw new Error("Missing required module API: GTVFixedTimeSlotUtils.createService");
}
if (!GTV_FIXED_TIME_STATE || typeof GTV_FIXED_TIME_STATE.createService !== "function") {
    throw new Error("Missing required module API: GTVFixedTimeState.createService");
}
if (!GTV_FIXED_TIME_TIMELINE || typeof GTV_FIXED_TIME_TIMELINE.createService !== "function") {
    throw new Error("Missing required module API: GTVFixedTimeTimeline.createService");
}
if (!GTV_FIXED_TIME_ACTIONS || typeof GTV_FIXED_TIME_ACTIONS.createService !== "function") {
    throw new Error("Missing required module API: GTVFixedTimeActions.createService");
}
if (!GTV_FIXED_TIME_TABLE || typeof GTV_FIXED_TIME_TABLE.createService !== "function") {
    throw new Error("Missing required module API: GTVFixedTimeTable.createService");
}
if (!GTV_FORMAT_PROFILE_STATE || typeof GTV_FORMAT_PROFILE_STATE.createService !== "function") {
    throw new Error("Missing required module API: GTVFormatProfileState.createService");
}
if (!GTV_FORMAT_CONTROLS || typeof GTV_FORMAT_CONTROLS.createService !== "function") {
    throw new Error("Missing required module API: GTVFormatControls.createService");
}
if (!GTV_TAB_UI || typeof GTV_TAB_UI.createService !== "function") {
    throw new Error("Missing required module API: GTVTabUI.createService");
}
if (!GTV_TAB_ORCHESTRATOR || typeof GTV_TAB_ORCHESTRATOR.createService !== "function") {
    throw new Error("Missing required module API: GTVTabOrchestrator.createService");
}
if (!GTV_UI_SETTINGS_ACTIONS || typeof GTV_UI_SETTINGS_ACTIONS.createService !== "function") {
    throw new Error("Missing required module API: GTVUiSettingsActions.createService");
}
if (!GTV_APP_PERSISTENCE_STATE || typeof GTV_APP_PERSISTENCE_STATE.createService !== "function") {
    throw new Error("Missing required module API: GTVAppPersistenceState.createService");
}
if (!GTV_PERSISTENCE_SERVICE_BUNDLE || typeof GTV_PERSISTENCE_SERVICE_BUNDLE.createService !== "function") {
    throw new Error("Missing required module API: GTVPersistenceServiceBundle.createService");
}
if (!GTV_STATE_PERSISTENCE || typeof GTV_STATE_PERSISTENCE.createService !== "function") {
    throw new Error("Missing required module API: GTVStatePersistence.createService");
}
if (!GTV_UI_PREFERENCES_STATE || typeof GTV_UI_PREFERENCES_STATE.createService !== "function") {
    throw new Error("Missing required module API: GTVUiPreferencesState.createService");
}
if (!GTV_SETTINGS_IO || typeof GTV_SETTINGS_IO.createService !== "function") {
    throw new Error("Missing required module API: GTVSettingsIO.createService");
}
if (!GTV_DATA_TRANSFER || typeof GTV_DATA_TRANSFER.createService !== "function") {
    throw new Error("Missing required module API: GTVDataTransfer.createService");
}
if (!GTV_APP_CONFIG) {
    throw new Error("Missing required module: GTVAppConfig");
}
if (
    !GTV_TIMEZONE_DATA ||
    !Array.isArray(GTV_TIMEZONE_DATA.TZ_DATABASE) ||
    !GTV_TIMEZONE_DATA.ZONE_MAP ||
    typeof GTV_TIMEZONE_DATA.ZONE_MAP !== "object"
) {
    throw new Error("Missing required module API: GTVTimezoneData");
}
if (!GTV_MAIN_UI_UTILS || typeof GTV_MAIN_UI_UTILS.createService !== "function") {
    throw new Error("Missing required module API: GTVMainUiUtils.createService");
}
if (!GTV_MAIN_UI_INIT || typeof GTV_MAIN_UI_INIT.createService !== "function") {
    throw new Error("Missing required module API: GTVMainUiInit.createService");
}
if (!GTV_APP_FEEDBACK || typeof GTV_APP_FEEDBACK.createService !== "function") {
    throw new Error("Missing required module API: GTVAppFeedback.createService");
}

const TZ_DATABASE = GTV_TIMEZONE_DATA.TZ_DATABASE;
const ZONE_MAP = GTV_TIMEZONE_DATA.ZONE_MAP;

const VERSION = GTV_APP_CONFIG.VERSION;
const STORAGE_KEY = GTV_APP_CONFIG.STORAGE_KEY;
const THEME_STORAGE_KEY = GTV_APP_CONFIG.THEME_STORAGE_KEY;
const LANG_STORAGE_KEY = GTV_APP_CONFIG.LANG_STORAGE_KEY;
const UI_SCALE_STORAGE_KEY = GTV_APP_CONFIG.UI_SCALE_STORAGE_KEY;
const MIN_UI_SCALE_PERCENT = GTV_APP_CONFIG.MIN_UI_SCALE_PERCENT;
const MAX_UI_SCALE_PERCENT = GTV_APP_CONFIG.MAX_UI_SCALE_PERCENT;
const DEFAULT_UI_SCALE_PERCENT = GTV_APP_CONFIG.DEFAULT_UI_SCALE_PERCENT;
const UI_SCALE_PERCENT_OPTIONS = [...GTV_APP_CONFIG.UI_SCALE_PERCENT_OPTIONS];
const LEGACY_STORAGE_KEYS = [...GTV_APP_CONFIG.LEGACY_STORAGE_KEYS];
const LEGACY_STORAGE_FALLBACK_KEYS = [...GTV_APP_CONFIG.LEGACY_STORAGE_FALLBACK_KEYS];
const THEME_LIST = [...GTV_APP_CONFIG.THEME_LIST];
const TABLE_IMAGE_EXPORT_WIDTH = GTV_APP_CONFIG.TABLE_IMAGE_EXPORT_WIDTH;
const EXPORT_MONO_FONT_FAMILY = GTV_APP_CONFIG.EXPORT_MONO_FONT_FAMILY;
const serviceBootstrap = GTV_SERVICE_BOOTSTRAP.createService({
    GTV_TAB_UI,
    GTV_TAB_ORCHESTRATOR,
    GTV_GROUP_STATE
});
const persistenceServiceBundleFactory = GTV_PERSISTENCE_SERVICE_BUNDLE.createService({
    GTV_STATE_PERSISTENCE,
    GTV_SETTINGS_IO,
    GTV_DATA_TRANSFER,
    GTV_UI_SETTINGS_ACTIONS
});
const mainUiUtilsService = GTV_MAIN_UI_UTILS.createService();
appFeedbackService = GTV_APP_FEEDBACK.createService({
    t,
    resetAllSettings: async () => {
        if (persistenceService && typeof persistenceService.resetAllSettings === "function") {
            await persistenceService.resetAllSettings();
        }
    },
    confirmFn: (message) => confirm(message),
    location: (typeof location === "object" && location) ? location : null,
    document: (typeof document === "object" && document) ? document : null,
    logError: (...args) => console.error(...args)
});
calculatorActionsService = GTV_CALCULATOR_ACTIONS.createService({
    GTV_CALCULATOR,
    PERIOD_RESULT_IDS,
    t: (...args) => t(...args),
    showToast: (...args) => showToast(...args),
    getElementById: (id) => {
        if (typeof document !== "object" || !document || typeof document.getElementById !== "function") return null;
        return document.getElementById(id);
    },
    writeClipboard: async (text) => {
        const clipboard = (typeof navigator === "object" && navigator && navigator.clipboard) ? navigator.clipboard : null;
        if (!clipboard || typeof clipboard.writeText !== "function") {
            throw new Error("Clipboard API unavailable");
        }
        return await clipboard.writeText(text);
    },
    logError: (...args) => console.error(...args)
});
const setCustomTooltip = mainUiUtilsService.setCustomTooltip;
const upgradeNativeTitleTooltips = mainUiUtilsService.upgradeNativeTitleTooltips;
const hideFloatingTooltip = mainUiUtilsService.hideFloatingTooltip;
const bindFloatingTooltipEvents = mainUiUtilsService.bindFloatingTooltipEvents;
const clearDragGhost = mainUiUtilsService.clearDragGhost;
const createDragGhostFromRow = mainUiUtilsService.createDragGhostFromRow;
const groupContextStateService = GTV_GROUP_CONTEXT_STATE.createService({
    MAIN_TABS,
    getGroups: () => groups,
    getState: () => ({
        currentMainTab,
        activeGroupId,
        activeGroupIdByMainTab
    }),
    setState: (next = {}) => {
        if (!next || typeof next !== "object") return;
        if (Object.prototype.hasOwnProperty.call(next, "currentMainTab")) currentMainTab = next.currentMainTab;
        if (Object.prototype.hasOwnProperty.call(next, "activeGroupId")) activeGroupId = next.activeGroupId;
        if (Object.prototype.hasOwnProperty.call(next, "activeGroupIdByMainTab")) activeGroupIdByMainTab = next.activeGroupIdByMainTab;
    },
    getUTCRef: (...args) => getUTCRef(...args),
    sanitizeUtcRowOrder: (...args) => GTV_TIME_CORE.sanitizeUtcRowOrder(...args)
});
const formatProfileStateService = GTV_FORMAT_PROFILE_STATE.createService({
    COPY_FORMAT_KEYS,
    TIME_PART_KEYS,
    FORMAT_PROFILE_CONTEXT_KEYS,
    DEFAULT_DISPLAY_FORMAT_ENABLED,
    DEFAULT_COPY_FORMAT_ENABLED,
    DEFAULT_DISPLAY_TIME_PARTS_ENABLED,
    DEFAULT_COPY_TIME_PARTS_ENABLED,
    sanitizeMainTab,
    getState: () => ({
        displayFormatOrder,
        displayFormatEnabled,
        displayTimePartsEnabled,
        copyFormatOrder,
        copyFormatEnabled,
        copyTimePartsEnabled,
        formatProfiles,
        activeFormatProfileContext,
        currentMainTab,
        slotCount
    }),
    setState: (next = {}) => {
        if (!next || typeof next !== "object") return;
        if (Object.prototype.hasOwnProperty.call(next, "displayFormatOrder")) displayFormatOrder = next.displayFormatOrder;
        if (Object.prototype.hasOwnProperty.call(next, "displayFormatEnabled")) displayFormatEnabled = next.displayFormatEnabled;
        if (Object.prototype.hasOwnProperty.call(next, "displayTimePartsEnabled")) displayTimePartsEnabled = next.displayTimePartsEnabled;
        if (Object.prototype.hasOwnProperty.call(next, "copyFormatOrder")) copyFormatOrder = next.copyFormatOrder;
        if (Object.prototype.hasOwnProperty.call(next, "copyFormatEnabled")) copyFormatEnabled = next.copyFormatEnabled;
        if (Object.prototype.hasOwnProperty.call(next, "copyTimePartsEnabled")) copyTimePartsEnabled = next.copyTimePartsEnabled;
        if (Object.prototype.hasOwnProperty.call(next, "formatProfiles")) formatProfiles = next.formatProfiles;
        if (Object.prototype.hasOwnProperty.call(next, "activeFormatProfileContext")) activeFormatProfileContext = next.activeFormatProfileContext;
    }
});
const multiRangeStateService = GTV_MULTI_RANGE_STATE.createService({
    MIN_MULTI_RANGE_COUNT,
    MAX_MULTI_RANGE_COUNT,
    DEFAULT_MULTI_RANGE_TITLE,
    t,
    showToast,
    sanitizeUtcMs: (value, fallbackMs) => GTV_TIME_CORE.sanitizeUtcMs(value, fallbackMs),
    getGlobalTimes: () => globalTimes,
    getState: () => ({
        multiRangeCount,
        multiRangeTitle,
        multiRanges,
        multiRangeCollapsed,
        multiRangeStartEditEnabled,
        multiRangeEndEditEnabled
    }),
    setState: (next = {}) => {
        if (!next || typeof next !== "object") return;
        if (Object.prototype.hasOwnProperty.call(next, "multiRangeCount")) multiRangeCount = next.multiRangeCount;
        if (Object.prototype.hasOwnProperty.call(next, "multiRangeTitle")) multiRangeTitle = next.multiRangeTitle;
        if (Object.prototype.hasOwnProperty.call(next, "multiRanges")) multiRanges = next.multiRanges;
        if (Object.prototype.hasOwnProperty.call(next, "multiRangeCollapsed")) multiRangeCollapsed = next.multiRangeCollapsed;
        if (Object.prototype.hasOwnProperty.call(next, "multiRangeStartEditEnabled")) multiRangeStartEditEnabled = next.multiRangeStartEditEnabled;
        if (Object.prototype.hasOwnProperty.call(next, "multiRangeEndEditEnabled")) multiRangeEndEditEnabled = next.multiRangeEndEditEnabled;
    },
    isMultiTab,
    renderMultiRanges: () => multiRangeRenderService.renderMultiRanges(),
    savePersistence: () => persistenceService.savePersistence()
});
const fixedTimeSlotUtilsService = GTV_FIXED_TIME_SLOT_UTILS.createService({
    MIN_FIXED_TIME_SLOT_COUNT,
    MAX_FIXED_TIME_SLOT_COUNT,
    DEFAULT_FIXED_TIME_VALUE,
    t: (...args) => t(...args),
    pad: (...args) => GTV_TIME_CORE.pad(...args),
    parseDateTimeParts,
    buildStrictUtcDateFromParts,
    getCurrentGroup: (...args) => getCurrentGroup(...args),
    getNextFixedTimeSeed: () => {
        fixedTimeIdSeed += 1;
        return fixedTimeIdSeed;
    }
});
const fixedTimeStateService = GTV_FIXED_TIME_STATE.createService({
    MIN_FIXED_TIME_SLOT_COUNT,
    MAX_FIXED_TIME_SLOT_COUNT,
    t: (...args) => t(...args),
    showToast: (...args) => showToast(...args),
    getCurrentGroup,
    ensureGroupFixedTimes,
    sanitizeFixedDateValue,
    sanitizeFixedTimeSlotCount,
    isFixedTimeTab,
    renderFixedTimeTab,
    renderTimelineFrame,
    savePersistence: () => persistenceService.savePersistence(),
    createUniqueFixedTimeId,
    createDefaultFixedTimeSlot
});
const uiPreferencesStateService = GTV_UI_PREFERENCES_STATE.createService({
    MIN_UI_SCALE_PERCENT,
    MAX_UI_SCALE_PERCENT,
    DEFAULT_UI_SCALE_PERCENT,
    UI_SCALE_PERCENT_OPTIONS,
    THEME_LIST,
    THEME_STORAGE_KEY,
    UI_SCALE_STORAGE_KEY,
    I18N_DATA,
    getStorageValue: (...args) => persistenceService.getStorageValue(...args),
    setStorageValue: (...args) => persistenceService.setStorageValue(...args),
    getState: () => ({
        uiScale,
        currentTheme,
        currentLang
    }),
    setState: (next = {}) => {
        if (!next || typeof next !== "object") return;
        if (Object.prototype.hasOwnProperty.call(next, "uiScale")) uiScale = next.uiScale;
        if (Object.prototype.hasOwnProperty.call(next, "currentTheme")) currentTheme = next.currentTheme;
        if (Object.prototype.hasOwnProperty.call(next, "currentLang")) currentLang = next.currentLang;
    }
});
const timerEngineService = GTV_TIMER_ENGINE.createService({
    DEFAULT_REALTIME_TICK_MS,
    shouldTick: () => isRealtime,
    onTick: () => {
        globalTimes[0] = new Date();
        updateClocks();
    },
    setIntervalFn: (cb, ms) => setInterval(cb, ms),
    clearIntervalFn: (id) => clearInterval(id)
});

// Initialize timeService and commonUtils once at a higher scope
const timeService = GTV_TIME_SERVICE.createService({
    luxon: (typeof window !== "undefined" ? window.luxon : globalThis.luxon)
});
const commonUtils = Object.freeze({});

// --- INTEGRATED CORE UTILITIES ---

/**
 * Prepare shared canvas state for table image export.
 */
function prepareExportCanvas(sourceWidth, sourceHeight, pageBg) {
    const targetWidth = TABLE_IMAGE_EXPORT_WIDTH;
    const renderRatio = targetWidth / Math.max(1, sourceWidth);
    const targetHeight = Math.max(1, Math.round(sourceHeight * renderRatio));

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context unavailable");

    ctx.scale(renderRatio, renderRatio);
    ctx.fillStyle = pageBg;
    ctx.fillRect(0, 0, sourceWidth, sourceHeight);

    return { canvas, ctx, renderRatio, targetWidth, targetHeight };
}

/**
 * Draw text in an export cell with shared styling options.
 */
function drawExportCellText(ctx, text, x, y, w, h, options = {}) {
    const {
        align = "left",
        color = "#f1f5f9",
        font = "13px Arial",
        clip = false,
        padX = 8
    } = options;

    ctx.save();
    if (clip) {
        ctx.beginPath();
        ctx.rect(x + 2, y + 1, Math.max(0, w - 4), Math.max(0, h - 2));
        ctx.clip();
    }

    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textBaseline = "middle";

    if (align === "center") {
        ctx.textAlign = "center";
        ctx.fillText(text, x + (w / 2), y + (h / 2));
    } else {
        ctx.textAlign = "left";
        ctx.fillText(text, x + padX, y + (h / 2));
    }
    ctx.restore();
}

/**
 * Parse date/time input into numeric parts based on input mode.
 */
function parseDateTimeParts(val, inputMode) {
    const normalized = (val || "").trim();
    if (!normalized) return null;

    const patterns = {
        datetime: /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/,
        date: /^(\d{4})-(\d{2})-(\d{2})$/,
        time: /^(\d{2}):(\d{2}):(\d{2})$/
    };

    const match = normalized.match(patterns[inputMode]);
    if (!match) return null;

    return match.slice(1).map(Number);
}


function getTimeAdjustDayStep(slotIdx) {
    if (typeof timeAdjustUiService !== "undefined") {
        return timeAdjustUiService.getTimeAdjustDayStep(slotIdx);
    }
    const idx = Number.isInteger(slotIdx) ? slotIdx : 0;
    return timeAdjustDayStepBySlot[idx] || DEFAULT_TIME_ADJUST_DAY_STEP;
}

function setTimeAdjustDayStep(slotIdx, value) {
    if (typeof timeAdjustUiService !== "undefined") {
        return timeAdjustUiService.setTimeAdjustDayStep(slotIdx, value);
    }
    const idx = Number.isInteger(slotIdx) ? slotIdx : 0;
    timeAdjustDayStepBySlot[idx] = value;
}


function getUTCRef() {
    return { id: "utc", type: "standard", zone: "UTC", name: t("utc_name") };
}

function getCurrentGroup() {
    return groupContextStateService.getCurrentGroup();
}

function getCurrentGroupZones() {
    return groupContextStateService.getCurrentGroupZones();
}

function getCurrentGroupBaseTimezoneId() {
    return groupContextStateService.getCurrentGroupBaseTimezoneId();
}

function getBaseTimezoneRef() {
    return groupContextStateService.getBaseTimezoneRef();
}

function ensureBaseTimezoneSelection() {
    return groupContextStateService.ensureBaseTimezoneSelection();
}

function getUtcMinuteCacheKey(date) {
    const safeDate = (date instanceof Date && Number.isFinite(date.getTime())) ? date : new Date();
    return [
        safeDate.getUTCFullYear(),
        safeDate.getUTCMonth(),
        safeDate.getUTCDate(),
        safeDate.getUTCHours(),
        safeDate.getUTCMinutes()
    ].join(":");
}

function setCappedRuntimeCache(cache, key, value) {
    if (!(cache instanceof Map)) return;
    if (cache.size >= MAX_RUNTIME_CACHE_SIZE) {
        cache.clear();
    }
    cache.set(key, value);
}

function getZoneAbbreviation(tz, date = globalTimes[0]) {
    if (!tz) return "";
    if (tz.zone === "UTC") return "UTC";
    if (tz.type === "custom") return normalizeCustomAbbr(tz.abbr);
    const fixedAbbr = timezoneSearchService.normalizeZoneAbbreviation(tz.fixedAbbr);
    if (fixedAbbr) return fixedAbbr;
    return getBetterAbbr(tz.zone, date);
}

function getBetterAbbr(zone, date) {
    if (zone === "UTC") return "UTC";
    const safeZone = (typeof zone === "string" && zone.trim()) ? zone : "UTC";
    const safeDate = (date instanceof Date && Number.isFinite(date.getTime())) ? date : new Date();
    const cacheKey = `${safeZone}|${getUtcMinuteCacheKey(safeDate)}`;
    if (zoneAbbrCache.has(cacheKey)) return zoneAbbrCache.get(cacheKey);

    let abbr = "";
    const mapping = ZONE_MAP[safeZone];
    if (mapping) {
        const mappedAbbr = (typeof mapping === "string") ? mapping : (isTimeZoneInDST(safeZone, safeDate) ? mapping[1] : mapping[0]);
        abbr = String(mappedAbbr || "").replace("GMT", "UTC");
        setCappedRuntimeCache(zoneAbbrCache, cacheKey, abbr);
        return abbr;
    }
    try {
        abbr = (timeService.toDateTime(safeDate).setZone(safeZone).offsetNameShort || "").replace("GMT", "UTC");
    } catch (_) {
        abbr = "";
    }
    setCappedRuntimeCache(zoneAbbrCache, cacheKey, abbr);
    return abbr;
}

function isTimeZoneInDST(zone, date) {
    const safeZone = (typeof zone === "string" && zone.trim()) ? zone : "UTC";
    const safeDate = (date instanceof Date && Number.isFinite(date.getTime())) ? date : new Date();
    const cacheKey = `${safeZone}|${getUtcMinuteCacheKey(safeDate)}`;
    if (timezoneDstCache.has(cacheKey)) return timezoneDstCache.get(cacheKey);

    let inDst = false;
    try {
        const year = safeDate.getUTCFullYear();
        const jan = new Date(Date.UTC(year, 0, 1, 12, 0, 0));
        const jul = new Date(Date.UTC(year, 6, 1, 12, 0, 0));
        const janOffset = timeService.toDateTime(jan).setZone(safeZone).offset;
        const julOffset = timeService.toDateTime(jul).setZone(safeZone).offset;
        const currentOffset = timeService.toDateTime(safeDate).setZone(safeZone).offset;
        const standardOffset = Math.min(janOffset, julOffset);
        inDst = currentOffset !== standardOffset;
    } catch (e) {
        inDst = false;
    }
    setCappedRuntimeCache(timezoneDstCache, cacheKey, inDst);
    return inDst;
}

function getTimezoneOffset(zone, date) {
    const safeZone = (typeof zone === "string" && zone.trim()) ? zone : "UTC";
    const safeDate = (date instanceof Date && Number.isFinite(date.getTime())) ? date : new Date();
    const cacheKey = `${safeZone}|${getUtcMinuteCacheKey(safeDate)}`;
    if (timezoneOffsetCache.has(cacheKey)) return timezoneOffsetCache.get(cacheKey);

    let offset = 0;
    try {
        offset = timeService.toDateTime(safeDate).setZone(safeZone).offset;
    } catch (err) {
        offset = 0;
    }
    setCappedRuntimeCache(timezoneOffsetCache, cacheKey, offset);
    return offset;
}

function getFixedOffsetForDisplayAtDate(tz, anchorDate) {
    if (!tz || tz.type !== "standard" || !tz.zone || tz.zone === "UTC") return null;
    const raw = tz.fixedOffsetMinutes;
    if (raw === null || raw === undefined || raw === "") return null;
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return null;
    return Math.min(14 * 60, Math.max(-14 * 60, Math.trunc(parsed)));
}

function getFixedOffsetForDisplay(tz) {
    return getFixedOffsetForDisplayAtDate(tz, globalTimes[0]);
}

function getLocalizedTZLabel(tzData) {
    if (currentLang === "en") return `${tzData.name_en} - ${tzData.city_en}`;
    return `${tzData.name} - ${tzData.city}`;
}

const pad = GTV_TIME_CORE.pad;
const clampNumber = GTV_TIME_CORE.clampNumber;
function getCustomOffsetMinutes(tz) {
    const safeTimezone = (tz && typeof tz === "object") ? tz : {};
    return GTV_TIME_CORE.getCustomOffsetMinutes(safeTimezone);
}

function getLocalPartsByTimezone(date, tz, fixedOffsetMinutes = null) {
    const zone = tz.type === "custom" ? "CUSTOM" : (tz.zone || "UTC");
    const offset = tz.type === "custom" ? getCustomOffsetMinutes(tz) : fixedOffsetMinutes;
    const p = timeService.resolveLocalDateParts(date, zone, tz.id, offset);
    return { year: p.Y, month: p.M, day: p.D, hour: p.H, minute: p.min, second: p.S };
}

function getUTCDateFromLocalParts(parts, tz, fixedOffsetMinutes = null) {
    const zone = tz.type === "custom" ? "CUSTOM" : (tz.zone || "UTC");
    const offset = tz.type === "custom" ? getCustomOffsetMinutes(tz) : fixedOffsetMinutes;
    return timeService.fromLocalPartsToUtc(parts, zone, offset);
}

function formatUtcOffsetLabel(totalMinutes = 0) {
    const safeMinutes = Number.isFinite(totalMinutes) ? totalMinutes : 0;
    return timezoneSearchService.formatUtcOffsetLabel(safeMinutes);
}

function normalizeCustomAbbr(value) {
    const trimmed = (value || "").trim();
    if (!trimmed) return t("label_custom");
    return trimmed.toUpperCase().slice(0, 12);
}

function sanitizeTimezoneId(value) {
    if (value == null) return "";
    return GTV_TIME_CORE.sanitizeTimezoneId(value);
}

function sanitizeBaseTimezoneId(value) {
    if (value == null) return "utc";
    return GTV_TIME_CORE.sanitizeBaseTimezoneId(value);
}

function setCurrentGroupBaseTimezoneId(value) {
    const group = getCurrentGroup();
    if (!group) return false;
    group.baseTimezoneId = sanitizeBaseTimezoneId(value);
    return true;
}

function applyCurrentGroupBaseTimezoneId(nextBaseId, options = {}) {
    const { persist = true } = options;
    const safeBaseId = sanitizeBaseTimezoneId(nextBaseId || "utc");
    if (safeBaseId === "utc") {
        const activeGroup = getCurrentGroup();
        if (activeGroup) {
            activeGroup.showUtcRow = true;
            activeGroup.utcRowOrder = 0;
        }
    }
    setCurrentGroupBaseTimezoneId(safeBaseId);
    renderList();
    renderTimelineFrame();
    timeAdjustUiService.updateTimeAdjustPanel();
    if (persist) persistenceService.savePersistence();
}

function getUsedTimezoneIds() {
    const usedIds = new Set(["utc"]);
    groups.forEach((group) => {
        if (!group || !Array.isArray(group.zones)) return;
        group.zones.forEach((zone) => {
            const zoneId = sanitizeTimezoneId(zone?.id);
            if (zoneId) usedIds.add(zoneId);
        });
    });
    return usedIds;
}

function createUniqueTimezoneId(prefix = "tz") {
    const normalizedPrefix = (typeof prefix === "string" && prefix.trim()) ? prefix.trim() : "tz";
    const usedIds = getUsedTimezoneIds();

    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        const uuidId = `${normalizedPrefix}-${crypto.randomUUID()}`;
        if (!usedIds.has(uuidId)) return uuidId;
    }

    for (let attempt = 0; attempt < 10000; attempt++) {
        timezoneIdSeed = (timezoneIdSeed + 1) % 1000000;
        const candidate = `${normalizedPrefix}-${Date.now()}-${timezoneIdSeed}`;
        if (!usedIds.has(candidate)) return candidate;
    }

    return `${normalizedPrefix}-${Date.now()}-${Math.floor(Math.random() * 1000000000)}`;
}

function parseAutoGeneratedIndexedName(name, baseCandidates = []) {
    const text = (typeof name === "string") ? name.trim() : "";
    if (!text) return { matched: false, number: null };

    for (const base of baseCandidates) {
        const safeBase = String(base || "").trim();
        if (!safeBase) continue;
        if (text === safeBase) {
            return { matched: true, number: null };
        }
        const escapedBase = safeBase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const matched = text.match(new RegExp(`^${escapedBase}\\s+(\\d+)$`));
        if (matched) {
            return { matched: true, number: parseInt(matched[1], 10) };
        }
    }
    return { matched: false, number: null };
}

function localizeAutoGeneratedNamesForCurrentLanguage() {
    if (!Array.isArray(groups) || !groups.length) return false;
    let changed = false;

    const groupBaseCandidates = ["Default Group", "\uAE30\uBCF8 \uADF8\uB8F9"];
    const subgroupBaseCandidates = [
        "Subgroup",
        "Aux Group",
        "\uC11C\uBE0C \uADF8\uB8F9",
        "\uBCF4\uC870 \uADF8\uB8F9"
    ];
    const nextGroupBase = t("default_group_name");
    const nextSubgroupBase = t("default_subgroup_name");

    groups.forEach((group, groupIdx) => {
        if (!group || typeof group !== "object") return;
        const parsedGroup = parseAutoGeneratedIndexedName(group.name, groupBaseCandidates);
        if (parsedGroup.matched) {
            const nextGroupName = Number.isFinite(parsedGroup.number)
                ? `${nextGroupBase} ${parsedGroup.number}`
                : nextGroupBase;
            if (group.name !== nextGroupName) {
                group.name = nextGroupName;
                changed = true;
            }
        }

        multiStateService.ensureGroupMultiSubgroups(group);
        group.multiSubgroups.forEach((subgroup, subgroupIdx) => {
            const parsedSubgroup = parseAutoGeneratedIndexedName(subgroup?.name, subgroupBaseCandidates);
            if (!parsedSubgroup.matched) return;
            const nextSubgroupName = Number.isFinite(parsedSubgroup.number)
                ? `${nextSubgroupBase} ${parsedSubgroup.number}`
                : `${nextSubgroupBase} ${subgroupIdx + 1}`;
            if (subgroup.name !== nextSubgroupName) {
                subgroup.name = nextSubgroupName;
                changed = true;
            }
        });
    });

    return changed;
}

function getCurrentMultiSubgroup() {
    const group = getCurrentGroup();
    if (!group) return null;
    multiStateService.ensureGroupMultiSubgroups(group);
    return group.multiSubgroups.find((subgroup) => subgroup.id === group.activeMultiSubgroupId) || group.multiSubgroups[0] || null;
}

function getCurrentMultiSubgroupName() {
    const subgroup = getCurrentMultiSubgroup();
    return multiStateService.sanitizeMultiSubgroupName(
        subgroup?.name,
        multiStateService.getDefaultMultiSubgroupName(0)
    );
}

function syncCurrentMultiStateToActiveSubgroup() {
    const group = getCurrentGroup();
    if (!group) return;
    multiStateService.ensureGroupMultiSubgroups(group);
    ensureMultiRangeState();

    const subgroup = getCurrentMultiSubgroup();
    if (!subgroup) return;

    subgroup.name = multiStateService.sanitizeMultiSubgroupName(
        subgroup.name,
        multiStateService.getDefaultMultiSubgroupName(0)
    );
    subgroup.multiRangeCount = sanitizeMultiRangeCount(multiRangeCount);
    subgroup.multiRanges = multiRanges.map((range) => ({
        startUtcMs: GTV_TIME_CORE.sanitizeUtcMs(range.startUtcMs, Date.now()),
        endUtcMs: GTV_TIME_CORE.sanitizeUtcMs(range.endUtcMs, Date.now())
    }));
    subgroup.multiRangeCollapsed = multiRangeCollapsed.map((flag) => !!flag);
    subgroup.multiRangeStartEditEnabled = multiRangeStartEditEnabled.map((flag) => !!flag);
    subgroup.multiRangeEndEditEnabled = multiRangeEndEditEnabled.map((flag) => !!flag);
}

function loadCurrentMultiStateFromActiveSubgroup() {
    const subgroup = getCurrentMultiSubgroup();
    const normalized = multiStateService.sanitizeMultiStatePayload(subgroup, null);
    multiRangeCount = normalized.multiRangeCount;
    multiRanges = normalized.multiRanges;
    multiRangeCollapsed = normalized.multiRangeCollapsed;
    multiRangeStartEditEnabled = normalized.multiRangeStartEditEnabled;
    multiRangeEndEditEnabled = normalized.multiRangeEndEditEnabled;
    multiRangeTitle = sanitizeMultiRangeTitle(getCurrentMultiSubgroupName());
    ensureMultiRangeState();
    refreshMultiRangeControls();
}

function isCurrentGroupUtcRowVisible() {
    return groupContextStateService.isCurrentGroupUtcRowVisible();
}

function getCurrentGroupUtcRowOrder() {
    return groupContextStateService.getCurrentGroupUtcRowOrder();
}

function getZoneDisplayName(tz) {
    if (!tz) return "";

    // Custom timezone: always use the user-defined name
    if (tz.type === "custom") {
        return tz.name_ko || tz.name || tz.name_en || tz.zone || "";
    }

    // Fixed offset standard time (e.g., "UTC+09:00 Standard Time" / "UTC+09:00 \uD45C\uC900\uC2DC")
    if (tz.fixedOffsetMinutes !== undefined && tz.fixedOffsetMinutes !== null) {
        const nameFallback = tz.name_ko || tz.name || tz.name_en || "";
        const lowerName = String(nameFallback).toLowerCase();
        if (lowerName.includes("standard time") || nameFallback.includes("\uD45C\uC900\uC2DC")) {
            const offsetLabel = formatUtcOffsetLabel(tz.fixedOffsetMinutes);
            return currentLang === "en"
                ? `${offsetLabel} Standard Time`
                : `${offsetLabel} \uD45C\uC900\uC2DC`;
        }
    }

    if (tz.zone === "UTC") return t("utc_name");

    // Standard IANA timezone
    if (tz.zone && tz.zone !== "UTC") {
        // Find matching entry in TZ_DATABASE
        const dbEntry = TZ_DATABASE.find(entry => entry.zone === tz.zone);
        if (dbEntry) {
            return getLocalizedTZLabel(dbEntry);
        }
    }

    // Fallback to stored names if all dynamic localization attempts fail
    if (currentLang === "en") return tz.name_en || tz.name || tz.name_ko || tz.zone || "";
    return tz.name_ko || tz.name || tz.name_en || tz.zone || "";
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}



function getDefaultFormatEnabled(mode = "display") {
    return formatProfileStateService.getDefaultFormatEnabled(mode);
}

function getDefaultTimePartsEnabled(mode = "display") {
    return formatProfileStateService.getDefaultTimePartsEnabled(mode);
}

function normalizeCopyFormatKey(rawKey) {
    return formatProfileStateService.normalizeCopyFormatKey(rawKey);
}

function sanitizeCopyFormatOrder(order) {
    return formatProfileStateService.sanitizeCopyFormatOrder(order);
}

function sanitizeCopyFormatEnabled(enabled, mode = "display") {
    return formatProfileStateService.sanitizeCopyFormatEnabled(enabled, mode);
}

function sanitizeTimePartsEnabled(parts, mode = "display") {
    return formatProfileStateService.sanitizeTimePartsEnabled(parts, mode);
}

function deriveTimePartsFromLegacyEnabled(legacyEnabled, mode = "display") {
    return formatProfileStateService.deriveTimePartsFromLegacyEnabled(legacyEnabled, mode);
}

function sanitizeFormatProfileContext(context) {
    return formatProfileStateService.sanitizeFormatProfileContext(context);
}

function getFormatProfileAllowedKeys(context = activeFormatProfileContext) {
    return formatProfileStateService.getFormatProfileAllowedKeys(context);
}

function getFormatProfileAllowedTimePartKeys(context = activeFormatProfileContext) {
    return formatProfileStateService.getFormatProfileAllowedTimePartKeys(context);
}

function sanitizeCopyFormatOrderForContext(order, context = activeFormatProfileContext) {
    return formatProfileStateService.sanitizeCopyFormatOrderForContext(order, context);
}

function getDefaultFormatEnabledForContext(mode = "display", context = activeFormatProfileContext) {
    return formatProfileStateService.getDefaultFormatEnabledForContext(mode, context);
}

function sanitizeCopyFormatEnabledForContext(enabled, mode = "display", context = activeFormatProfileContext) {
    return formatProfileStateService.sanitizeCopyFormatEnabledForContext(enabled, mode, context);
}

function sanitizeTimePartsEnabledForContext(parts, mode = "display", context = activeFormatProfileContext) {
    return formatProfileStateService.sanitizeTimePartsEnabledForContext(parts, mode, context);
}

function createDefaultFormatProfile(context = "live") {
    return formatProfileStateService.createDefaultFormatProfile(context);
}

function sanitizeFormatProfile(profile, context = activeFormatProfileContext) {
    return formatProfileStateService.sanitizeFormatProfile(profile, context);
}

function sanitizeFormatProfiles(rawProfiles = null, legacyProfile = null) {
    return formatProfileStateService.sanitizeFormatProfiles(rawProfiles, legacyProfile);
}

function getCurrentFormatProfileState() {
    return formatProfileStateService.getCurrentFormatProfileState();
}

function resolveFormatProfileContext(tab = currentMainTab, effectiveSlotCount = slotCount) {
    return formatProfileStateService.resolveFormatProfileContext(tab, effectiveSlotCount);
}

function ensureFormatProfiles(legacyProfile = null) {
    return formatProfileStateService.ensureFormatProfiles(legacyProfile);
}

function applyFormatProfileState(profile, context = activeFormatProfileContext) {
    return formatProfileStateService.applyFormatProfileState(profile, context);
}

function syncActiveFormatProfileFromState() {
    return formatProfileStateService.syncActiveFormatProfileFromState();
}

function activateFormatProfileContext(context, options = {}) {
    return formatProfileStateService.activateFormatProfileContext(context, options);
}

function activateFormatProfileForCurrentContext(options = {}) {
    return formatProfileStateService.activateFormatProfileForCurrentContext(options);
}

function resetDisplayFormatForActiveContext() {
    return formatProfileStateService.resetDisplayFormatForActiveContext();
}

function resetCopyFormatForActiveContext() {
    return formatProfileStateService.resetCopyFormatForActiveContext();
}

ensureFormatProfiles(createDefaultFormatProfile("live"));
activateFormatProfileForCurrentContext({ syncCurrent: false });

function getDefaultFixedTimeName() {
    return fixedTimeSlotUtilsService.getDefaultFixedTimeName();
}

function getDefaultFixedDate(anchorDate = new Date()) {
    return fixedTimeSlotUtilsService.getDefaultFixedDate(anchorDate);
}

function getDefaultFixedTimes() {
    return fixedTimeSlotUtilsService.getDefaultFixedTimes();
}

function sanitizeFixedTimeSlotCount(value) {
    return fixedTimeSlotUtilsService.sanitizeFixedTimeSlotCount(value);
}

function createDefaultFixedTimeSlot(id = "") {
    return fixedTimeSlotUtilsService.createDefaultFixedTimeSlot(id);
}

function sanitizeFixedTimeId(value) {
    return fixedTimeSlotUtilsService.sanitizeFixedTimeId(value);
}

function sanitizeFixedTimeName(value, fallback = getDefaultFixedTimeName()) {
    return fixedTimeSlotUtilsService.sanitizeFixedTimeName(value, fallback);
}

function sanitizeFixedTimeValue(value, fallback = DEFAULT_FIXED_TIME_VALUE) {
    return fixedTimeSlotUtilsService.sanitizeFixedTimeValue(value, fallback);
}

function sanitizeFixedDateValue(value, fallback = "") {
    return fixedTimeSlotUtilsService.sanitizeFixedDateValue(value, fallback);
}

function getFixedDatePartsFromGroup(group = getCurrentGroup()) {
    return fixedTimeSlotUtilsService.getFixedDatePartsFromGroup(group);
}

function sanitizeFixedTimes(rawFixedTimes) {
    return fixedTimeSlotUtilsService.sanitizeFixedTimes(rawFixedTimes);
}

function ensureGroupFixedTimes(group) {
    return fixedTimeSlotUtilsService.ensureGroupFixedTimes(group);
}

function createUniqueFixedTimeId(group = getCurrentGroup()) {
    return fixedTimeSlotUtilsService.createUniqueFixedTimeId(group);
}

function isFixedTimeTab() {
    return currentMainTab === "fixed-time";
}

function isMultiTab() {
    return currentMainTab === "multi";
}

function sanitizeMultiRangeCount(value) {
    return multiRangeStateService.sanitizeMultiRangeCount(value);
}

function sanitizeMultiRangeTitle(value) {
    return multiRangeStateService.sanitizeMultiRangeTitle(value);
}

function getDefaultMultiRangeBounds() {
    return multiRangeStateService.getDefaultMultiRangeBounds();
}

function sanitizeMultiRangeItem(rawRange, fallbackStartMs, fallbackEndMs) {
    return multiRangeStateService.sanitizeMultiRangeItem(rawRange, fallbackStartMs, fallbackEndMs);
}

function isMultiRangeStartEditEnabled(rangeIdx) {
    return multiRangeStateService.isMultiRangeStartEditEnabled(rangeIdx);
}

function isMultiRangeEndEditEnabled(rangeIdx) {
    return multiRangeStateService.isMultiRangeEndEditEnabled(rangeIdx);
}

function isMultiRangeStartLinked(rangeIdx) {
    return multiRangeStateService.isMultiRangeStartLinked(rangeIdx);
}

function ensureMultiRangeState() {
    return multiRangeStateService.ensureMultiRangeState();
}

function setMultiRangeStartEditEnabled(rangeIdx, enabled, options = {}) {
    return multiRangeStateService.setMultiRangeStartEditEnabled(rangeIdx, enabled, options);
}

function setMultiRangeEndEditEnabled(rangeIdx, enabled, options = {}) {
    return multiRangeStateService.setMultiRangeEndEditEnabled(rangeIdx, enabled, options);
}

function setAllMultiRangeStartEditEnabled(enabled, options = {}) {
    return multiRangeStateService.setAllMultiRangeStartEditEnabled(enabled, options);
}

function setAllMultiRangeEndEditEnabled(enabled, options = {}) {
    return multiRangeStateService.setAllMultiRangeEndEditEnabled(enabled, options);
}

function refreshMultiRangeControls() {
    return multiRangeStateService.refreshMultiRangeControls();
}

function renderMultiBulkToolSets() {
    if (!multiBulkToolsService || typeof multiBulkToolsService.renderMultiBulkToolSets !== "function") return;
    multiBulkToolsService.renderMultiBulkToolSets();
}

function syncMultiRangeStartLinks(startIdx = 1) {
    return multiRangeStateService.syncMultiRangeStartLinks(startIdx);
}

function syncFollowingRangesByDuration(changedRangeIdx) {
    return multiRangeStateService.syncFollowingRangesByDuration(changedRangeIdx);
}

function syncLinkedRangesFrom(rangeIdx, options = {}) {
    return multiRangeStateService.syncLinkedRangesFrom(rangeIdx, options);
}

function setMultiRangeCount(value, options = {}) {
    return multiRangeStateService.setMultiRangeCount(value, options);
}

function getFixedTimeSlotCount(group = getCurrentGroup()) {
    return fixedTimeStateService.getFixedTimeSlotCount(group);
}

function setCurrentGroupFixedDate(rawValue, options = {}) {
    return fixedTimeStateService.setCurrentGroupFixedDate(rawValue, options);
}

function refreshFixedTimeSlotCountControls() {
    return fixedTimeStateService.refreshFixedTimeSlotCountControls();
}

function setFixedTimeSlotCount(value, options = {}) {
    return fixedTimeStateService.setFixedTimeSlotCount(value, options);
}

function toggleMultiRangeCollapsed(rangeIdx) {
    return multiRangeStateService.toggleMultiRangeCollapsed(rangeIdx);
}

function setMultiRangesCollapsedBelow(rangeIdx, collapsed) {
    return multiRangeStateService.setMultiRangesCollapsedBelow(rangeIdx, collapsed);
}

function getMultiRangeSlotDate(rangeIdx, slotIdx) {
    return multiRangeStateService.getMultiRangeSlotDate(rangeIdx, slotIdx);
}

function setMultiRangeSlotDate(rangeIdx, slotIdx, nextDate) {
    return multiRangeStateService.setMultiRangeSlotDate(rangeIdx, slotIdx, nextDate);
}

function sanitizeUiScalePercent(value) {
    return uiPreferencesStateService.sanitizeUiScalePercent(value);
}

async function applyUiScale(scalePercent, persist = true) {
    return uiPreferencesStateService.applyUiScale(scalePercent, persist);
}

async function loadUiScalePreference() {
    return uiPreferencesStateService.loadUiScalePreference();
}

function populateUiScaleSelect(selectEl) {
    return uiPreferencesStateService.populateUiScaleSelect(selectEl);
}

function sanitizeTheme(theme) {
    return uiPreferencesStateService.sanitizeTheme(theme);
}

async function applyTheme(theme, persist = true) {
    return uiPreferencesStateService.applyTheme(theme, persist);
}

async function loadThemePreference() {
    return uiPreferencesStateService.loadThemePreference();
}

function setCurrentLang(lang) {
    return uiPreferencesStateService.setCurrentLang(lang);
}

function sanitizeMainTab(tab) {
    return groupContextStateService.sanitizeMainTab(tab);
}

function clampGroupIndex(index) {
    return groupContextStateService.clampGroupIndex(index);
}

function normalizeGroupTabState() {
    return groupContextStateService.normalizeGroupTabState();
}

function getPersistenceState() {
    return appPersistenceStateService.getPersistenceState();
}

function setPersistenceState(next = {}) {
    return appPersistenceStateService.setPersistenceState(next);
}

// --- Group Data Structure ---

const timezoneSearchService = GTV_TIMEZONE_SEARCH.createService({
    TZ_DATABASE,
    getZoneMap: () => ZONE_MAP,
    t,
    getCurrentLang: () => currentLang,
    getBetterAbbr,
    getTimezoneOffset,
    getLocalizedTZLabel,
    adjustSelectWidthForContent,
    getCurrentGroup,
    savePersistence: (options = {}) => persistenceService.savePersistence(options),
    renderList,
    addTimezone,
    createUniqueTimezoneId
});


const snapshotFormatService = GTV_SNAPSHOT_FORMAT.createService({
    DEFAULT_COPY_TIME_PARTS_ENABLED,
    I18N_DATA,
    t,
    getCurrentLang: () => currentLang,
    getUTCRef,
    getBaseTimezoneRef,
    getCurrentGroupZones,
    getGlobalTimes: () => globalTimes,
    getSlotCount: () => slotCount,
    isRealtime: () => isRealtime,
    getFixedOffsetForDisplay,
    normalizeCustomAbbr,
    getCustomOffsetMinutes,
    pad,
    getZoneAbbreviation,
    getZoneDisplayName,
        getSignedInclusiveDaySpan: (a, b) => timeService.getDaySpan(a, b),
        getSignedDurationDayHourMinute: (a, b) => {
            const parse = (s) => {
                const m = (s || "").trim().match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
                if (!m) return NaN;
                return Date.UTC(m[1], m[2]-1, m[3], m[4], m[5], m[6]);
            };
            return timeService.formatDuration(parse(a), parse(b), currentLang);
        },
    sanitizeTimePartsEnabled,
    sanitizeCopyFormatOrder,
    timeService
});

let multiBulkToolsService = null;
let timelineFrameService = null;
let imageExportActionsService = null;
let imageExportNamingService = null;
let imageExportBridgeService = null;
let uiSettingsActionsService = null;
let imageCloneService = null;
let imageForeignRenderService = null;
let tableImageRenderService = null;
let multiRangeImageRenderService = null;
let fixedTimeCoreService = null;
let fixedTimeTimelineService = null;
let fixedTimeActionsService = null;
let fixedTimeTableService = null;
let mainUiInitService = null;
let timeAdjustActionsService = null;
const timeInputMutationsService = GTV_TIME_INPUT_MUTATIONS.createService({
    t: (...args) => t(...args),
    showToast: (...args) => showToast(...args),
    isRealtime: () => isRealtime,
    isMultiTab,
    isMultiRangeStartEditEnabled,
    isMultiRangeEndEditEnabled,
    ensureMultiRangeState,
    getMultiRanges: () => multiRanges,
    getMultiRangeSlotDate,
    setMultiRangeSlotDate,
    syncFollowingRangesByDuration,
    syncMultiRangeStartLinks,
    parseDateTimeParts,
    getCurrentGroupZones,
    getCustomOffsetMinutes,
    getFixedOffsetForDisplayAtDate,
    getTimezoneOffset,
    resolveLocalDateParts: (date, timezone, timezoneId, fallback) =>
        timeService.resolveLocalDateParts(date, timezone, timezoneId, fallback),
    buildStrictUtcDateFromParts: (parts) => GTV_TIME_CORE.buildStrictUtcDateFromParts(parts),
    getGlobalTime: (slotIdx) => globalTimes[slotIdx],
    setGlobalTime: (slotIdx, value) => {
        globalTimes[slotIdx] = value;
    },
    updateClocks: (...args) => updateClocks(...args),
    renderList: (...args) => renderList(...args),
    renderMultiRanges: () => {
        if (multiRangeRenderService && typeof multiRangeRenderService.renderMultiRanges === "function") {
            multiRangeRenderService.renderMultiRanges();
        }
    },
    savePersistence: () => {
        if (persistenceService && typeof persistenceService.savePersistence === "function") {
            persistenceService.savePersistence();
        }
    }
});

const tableRenderService = GTV_TABLE_RENDER.createService({
    t,
    sanitizeCopyFormatOrder,
    getDisplayFormatOrder: () => displayFormatOrder,
    getDisplayFormatEnabled: () => displayFormatEnabled,
    getDisplayTimePartsEnabled: () => displayTimePartsEnabled,
    isRealtime: () => isRealtime,
    getSlotCount: () => slotCount,
    isMultiTab,
    renderMultiRanges: () => multiRangeRenderService.renderMultiRanges(),
    getBaseTimezoneRef,
    escapeHtml,
    getZoneDisplayName,
    removeTimezone,
    handleTimeChange,
    saveOrder,
    getCurrentGroupZones,
    isCurrentGroupUtcRowVisible,
    getCurrentGroupUtcRowOrder,
    getUTCRef,
    renderBaseTimeSelect,
    updateTimeAdjustPanel: () => timeAdjustUiService.updateTimeAdjustPanel(),
    updateClocks,
    hideFloatingTooltip,
    upgradeNativeTitleTooltips,
    createDragGhostFromRow,
    clearDragGhost,
    copyRow: (id) => copyActionsService.copyRow(id)
});

imageCloneService = GTV_IMAGE_CLONE.createService({
    document: (typeof document === "object" && document) ? document : null
});

imageForeignRenderService = GTV_IMAGE_FOREIGN_RENDER.createService({
    TABLE_IMAGE_EXPORT_WIDTH,
    getCanUseForeignObjectRenderer: () => canUseForeignObjectRenderer,
    setCanUseForeignObjectRenderer: (value) => {
        canUseForeignObjectRenderer = !!value;
    }
});

imageExportBridgeService = GTV_IMAGE_EXPORT_BRIDGE.createService({
    getImageCloneService: () => imageCloneService,
    getImageForeignRenderService: () => imageForeignRenderService,
    getTableImageRenderService: () => tableImageRenderService,
    getMultiRangeImageRenderService: () => multiRangeImageRenderService,
    getImageExportActionsService: () => imageExportActionsService,
    getDefaultTableExportContext: () => ({
        table: null,
        headerSelector: "#table-head th",
        rowSelector: "#clocks-container tr.time-row"
    })
});

tableImageRenderService = GTV_TABLE_IMAGE_RENDER.createService({
    EXPORT_MONO_FONT_FAMILY,
    isFixedTimeTab,
    waitForDocumentFontsReady,
    prepareExportCanvas,
    drawExportCellText,
    cloneTableForImageExport,
    renderElementWithForeignObjectToPngDataUrl
});

multiRangeImageRenderService = GTV_MULTI_RANGE_IMAGE_RENDER.createService({
    EXPORT_MONO_FONT_FAMILY,
    t,
    waitForDocumentFontsReady,
    ensureMultiRangeState,
    getBaseTimezoneRef,
    getMultiRanges: () => multiRanges,
    getMultiRangeTitleText: (rangeIdx, range, baseRef) =>
        multiRangeRenderService.getMultiRangeTitleText(rangeIdx, range, baseRef),
    cloneMultiRangeBlockForImageExport,
    prepareExportCanvas,
    drawExportCellText,
    extractTableCellText: (cell) =>
        tableImageRenderService && typeof tableImageRenderService.extractTableCellText === "function"
            ? tableImageRenderService.extractTableCellText(cell)
            : extractTableCellText(cell)
});

fixedTimeCoreService = GTV_FIXED_TIME_CORE.createService({
    DEFAULT_FIXED_TIME_VALUE,
    I18N_DATA,
    t,
    getCurrentLang: () => currentLang,
    sanitizeFixedTimeValue,
    getFixedOffsetForDisplayAtDate,
    getLocalPartsByTimezone,
    getUTCDateFromLocalParts,
    pad,
    sanitizeTimePartsEnabledForContext,
    getDisplayTimePartsEnabled: () => displayTimePartsEnabled,
    getDefaultFixedTimeName,
    sanitizeFixedTimeName,
    getFixedDateParts: () => getFixedDatePartsFromGroup()
});

fixedTimeTimelineService = GTV_FIXED_TIME_TIMELINE.createService({
    TIMELINE_TOTAL_SECONDS,
    getCurrentGroup,
    ensureGroupFixedTimes,
    getGlobalTime: (slotIdx) => globalTimes[slotIdx],
    resolveFixedTimeSlotUtcDate,
    clampNumber,
    pad,
    getFixedTimeSlotCount,
    sanitizeFixedTimeId,
    sanitizeFixedTimeName,
    getDefaultFixedTimeName,
    getFixedTimeSlotHeaderLabel
});

fixedTimeActionsService = GTV_FIXED_TIME_ACTIONS.createService({
    DEFAULT_FIXED_TIME_VALUE,
    MIN_FIXED_TIME_SLOT_COUNT,
    t: (...args) => t(...args),
    sanitizeCopyFormatOrderForContext,
    sanitizeCopyFormatEnabledForContext,
    sanitizeTimePartsEnabledForContext,
    getCopyFormatOrder: () => copyFormatOrder,
    getCopyFormatEnabled: () => copyFormatEnabled,
    getCopyTimePartsEnabled: () => copyTimePartsEnabled,
    buildTimezoneComputedSnapshotForDates: (tz, slotDates, options = {}) =>
        snapshotFormatService.buildTimezoneComputedSnapshotForDates(tz, slotDates, options),
    formatSnapshotText: (snapshot, order, enabled, timePartsEnabled) =>
        snapshotFormatService.formatSnapshotText(snapshot, order, enabled, timePartsEnabled),
    getCurrentGroup,
    ensureGroupFixedTimes,
    getBaseTimezoneRef,
    getGlobalTime: (slotIdx) => globalTimes[slotIdx],
    resolveFixedTimeSlotUtcDate,
    getFixedTimeSlotHeaderLabel,
    getRenderableTimezoneRows: (baseRef) => tableRenderService.getRenderableTimezoneRows(baseRef),
    getFixedOffsetForDisplayAtDate,
    getLocalPartsByTimezone,
    getUTCDateFromLocalParts,
    parseDateTimeParts,
    pad,
    showToast: (...args) => showToast(...args),
    writeClipboard: async (text) => navigator.clipboard.writeText(text),
    buildFixedTimeDisplayPayloadAtUtc,
    renderFixedTimeTab: (...args) => renderFixedTimeTab(...args),
    renderTimelineFrame: (...args) => renderTimelineFrame(...args),
    savePersistence: (...args) => persistenceService.savePersistence(...args),
    getDefaultFixedTimeName,
    sanitizeFixedTimeName,
    sanitizeFixedTimeValue,
    getFixedTimeSlotCount,
    setFixedTimeSlotCount,
    refreshFixedTimeSlotCountControls: (...args) => refreshFixedTimeSlotCountControls(...args)
});

const multiRangeRenderService = GTV_MULTI_RANGE_RENDER.createService({
    I18N_DATA,
    t,
    getCurrentLang: () => currentLang,
    pad,
    getCustomOffsetMinutes,
    getFixedOffsetForDisplayAtDate,
    normalizeCustomAbbr,
    getZoneAbbreviation,
    getSignedInclusiveDaySpan: (a, b) => timeService.getDaySpan(a, b),
    getSignedDurationDayHourMinute: (a, b) => {
        const parse = (s) => {
            const m = (s || "").trim().match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
            if (!m) return NaN;
            return Date.UTC(m[1], m[2] - 1, m[3], m[4], m[5], m[6]);
        };
        return timeService.formatDuration(parse(a), parse(b), currentLang);
    },
    getZoneDisplayName,
    sanitizeMultiSubgroupName: (value, fallback = "") =>
        multiStateService.sanitizeMultiSubgroupName(value, fallback),
    getCurrentMultiSubgroupName,
    sanitizeMultiRangeTitle,
    getMultiRangeTitle: () => multiRangeTitle,
    buildStaticRowCell: (colKey, slotCountToRender, zoneNameHtml = "") =>
        tableRenderService.buildStaticRowCell(colKey, slotCountToRender, zoneNameHtml),
    buildDynamicRowCell: (colKey, slotCountToRender) =>
        tableRenderService.buildDynamicRowCell(colKey, slotCountToRender),
    isMultiRangeStartEditEnabled,
    isMultiRangeEndEditEnabled,
    handleMultiRangeTimeChange,
    copyMultiRangeRow,
    hideFloatingTooltip,
    ensureMultiRangeState,
    refreshMultiRangeControls,
    renderMultiBulkToolSets,
    getBaseTimezoneRef,
    escapeHtml,
    getDisplayColumns,
    getRenderableTimezoneRows: (baseRef) => tableRenderService.getRenderableTimezoneRows(baseRef),
    getMultiRanges: () => multiRanges,
    getMultiRangeCollapsed: () => multiRangeCollapsed,
    getMultiRangeCount: () => multiRangeCount,
    buildTimezoneComputedSnapshotForDates: (tz, slotDates, options = {}) =>
        snapshotFormatService.buildTimezoneComputedSnapshotForDates(tz, slotDates, options),
    saveMultiRangeSingleImage,
    copyWholeMultiRange: (rangeIdx) => multiRangeCopyService.copyWholeMultiRange(rangeIdx),
    setMultiRangesCollapsedBelow,
    toggleMultiRangeCollapsed,
    renderTimeAdjustSet: (slotIdx, options = {}) => timeAdjustUiService.renderTimeAdjustSet(slotIdx, options),
    applyMultiRangeTimeAdjustAction,
    attachTimeAdjustToggleLabel: (setEl, checked, text, onChange) =>
        timeAdjustUiService.attachTimeAdjustToggleLabel(setEl, checked, text, onChange),
    setMultiRangeStartEditEnabled,
    setMultiRangeEndEditEnabled,
    getMultiDisplayColumnHeader: (colKey) => tableRenderService.getMultiDisplayColumnHeader(colKey),
    updateTimeAdjustPanel: () => timeAdjustUiService.updateTimeAdjustPanel(),
    updateCopyFormatPreview,
    upgradeNativeTitleTooltips
});

const multiRangeCopyService = GTV_MULTI_RANGE_COPY.createService({
    t,
    showToast,
    ensureMultiRangeState,
    getMultiRanges: () => multiRanges,
    getBaseTimezoneRef,
    getRenderableTimezoneRows: (baseRef) => tableRenderService.getRenderableTimezoneRows(baseRef),
    getTimezoneRefById: (id) => snapshotFormatService.getTimezoneRefById(id),
    buildTimezoneComputedSnapshotForRange,
    formatSnapshotText,
    getMultiRangeTitleText: (rangeIdx, range, baseRef) =>
        multiRangeRenderService.getMultiRangeTitleText(rangeIdx, range, baseRef),
    getCopyFormatOrder: () => copyFormatOrder,
    getCopyFormatEnabled: () => copyFormatEnabled,
    getCopyTimePartsEnabled: () => copyTimePartsEnabled,
    writeClipboard: async (text) => navigator.clipboard.writeText(text)
});

const copyActionsService = GTV_COPY_ACTIONS.createService({
    t,
    showToast,
    isShowCopyFormat: () => showCopyFormat,
    isMultiTab,
    isFixedTimeTab,
    ensureMultiRangeState,
    getMultiRanges: () => multiRanges,
    getBaseTimezoneRef,
    buildTimezoneComputedSnapshotForRange,
    formatSnapshotText,
    getCopyFormatOrder: () => copyFormatOrder,
    getCopyFormatEnabled: () => copyFormatEnabled,
    getCopyTimePartsEnabled: () => copyTimePartsEnabled,
    getRowFormattedText: (rowOrId, order, enabled, timePartsEnabled = DEFAULT_COPY_TIME_PARTS_ENABLED) =>
        snapshotFormatService.getRowFormattedText(rowOrId, order, enabled, timePartsEnabled),
    getRowCopyText: (rowOrId) =>
        snapshotFormatService.getRowCopyText(rowOrId, {
            order: copyFormatOrder,
            enabled: copyFormatEnabled,
            timePartsEnabled: copyTimePartsEnabled
        }),
    getFixedTimePreviewCopyText,
    getAllFixedTimeRowsCopyText,
    copyAllMultiRangeTimezones,
    writeClipboard: async (text) => navigator.clipboard.writeText(text)
});

const timeAdjustUiService = GTV_TIME_ADJUST_UI.createService({
    MIN_TIME_ADJUST_DAY_STEP,
    MAX_TIME_ADJUST_DAY_STEP,
    DEFAULT_TIME_ADJUST_DAY_STEP,
    t,
    savePersistence: (options = {}) => persistenceService.savePersistence(options),
    applyTimeAdjustAction,
    getCurrentMainTab: () => currentMainTab,
    isRealtime: () => isRealtime,
    getSlotCount: () => slotCount,
    getTimeAdjustDayStepValue: (slotIdx) => timeAdjustDayStepBySlot[slotIdx],
    setTimeAdjustDayStepValue: (slotIdx, value) => {
        timeAdjustDayStepBySlot[slotIdx] = value;
    },
    upgradeNativeTitleTooltips
});

multiBulkToolsService = GTV_MULTI_BULK_TOOLS.createService({
    t,
    getMultiRangeCount: () => multiRangeCount,
    renderTimeAdjustSet: (slotIdx, options = {}) => timeAdjustUiService.renderTimeAdjustSet(slotIdx, options),
    createTimeAdjustActionButton: (labelKey, slotIdx, action, onAction = null, disabled = false) =>
        timeAdjustUiService.createTimeAdjustActionButton(labelKey, slotIdx, action, onAction, disabled),
    createTimeAdjustDivider: () => timeAdjustUiService.createTimeAdjustDivider(),
    applyBulkRangeAllAction,
    applyFirstRangeStartAdjustAction: (slotIdx, action) =>
        applyMultiRangeTimeAdjustAction(0, slotIdx, action),
    setAllMultiRangeStartEditEnabled,
    setAllMultiRangeEndEditEnabled,
    upgradeNativeTitleTooltips
});

timeAdjustActionsService = GTV_TIME_ADJUST_ACTIONS.createService({
    isRealtime: () => isRealtime,
    getGlobalTimes: () => globalTimes,
    updateClocks: () => updateClocks(),
    getBaseTimezoneRef,
    getFixedOffsetForDisplay,
    getFixedOffsetForDisplayAtDate,
    getCustomOffsetMinutes,
    getTimeAdjustDayStep,
    timeService,
    sanitizeUtcMs: (...args) => GTV_TIME_CORE.sanitizeUtcMs(...args),
    ensureMultiRangeState,
    getMultiRanges: () => multiRanges,
    isMultiRangeStartLinked,
    isMultiTab,
    renderMultiRanges: () => {
        if (multiRangeRenderService && typeof multiRangeRenderService.renderMultiRanges === "function") {
            multiRangeRenderService.renderMultiRanges();
        }
    },
    savePersistence: () => {
        if (persistenceService && typeof persistenceService.savePersistence === "function") {
            persistenceService.savePersistence();
        }
    },
    isMultiRangeStartEditEnabled,
    isMultiRangeEndEditEnabled,
    syncLinkedRangesFrom,
    getMultiRangeSlotDate,
    setMultiRangeSlotDate,
    syncFollowingRangesByDuration,
    syncMultiRangeStartLinks
});

const formatControlsService = GTV_FORMAT_CONTROLS.createService({
    COPY_FORMAT_KEYS,
    TIME_PART_KEYS,
    t,
    sanitizeCopyFormatOrder,
    renderList,
    updateCopyFormatPreview,
    savePersistence: (options = {}) => persistenceService.savePersistence(options),
    upgradeNativeTitleTooltips,
    isShowCopyFormat: () => showCopyFormat,
    getDisplayFormatOrder: () => displayFormatOrder,
    setDisplayFormatOrder: (next) => {
        displayFormatOrder = sanitizeCopyFormatOrderForContext(next, activeFormatProfileContext);
        syncActiveFormatProfileFromState();
    },
    getDisplayFormatEnabled: () => displayFormatEnabled,
    setDisplayFormatEnabled: (next) => {
        displayFormatEnabled = sanitizeCopyFormatEnabledForContext(next, "display", activeFormatProfileContext);
        syncActiveFormatProfileFromState();
    },
    getDisplayTimePartsEnabled: () => displayTimePartsEnabled,
    setDisplayTimePartsEnabled: (next) => {
        displayTimePartsEnabled = sanitizeTimePartsEnabledForContext(next, "display", activeFormatProfileContext);
        syncActiveFormatProfileFromState();
    },
    getCopyFormatOrder: () => copyFormatOrder,
    setCopyFormatOrder: (next) => {
        copyFormatOrder = sanitizeCopyFormatOrderForContext(next, activeFormatProfileContext);
        syncActiveFormatProfileFromState();
    },
    getCopyFormatEnabled: () => copyFormatEnabled,
    setCopyFormatEnabled: (next) => {
        copyFormatEnabled = sanitizeCopyFormatEnabledForContext(next, "copy", activeFormatProfileContext);
        syncActiveFormatProfileFromState();
    },
    getCopyTimePartsEnabled: () => copyTimePartsEnabled,
    setCopyTimePartsEnabled: (next) => {
        copyTimePartsEnabled = sanitizeTimePartsEnabledForContext(next, "copy", activeFormatProfileContext);
        syncActiveFormatProfileFromState();
    },
    getActiveCopyFormatKeys: () => getFormatProfileAllowedKeys(activeFormatProfileContext),
    getActiveTimePartKeys: () => getFormatProfileAllowedTimePartKeys(activeFormatProfileContext)
});

const tabUiService = serviceBootstrap.createTabUiService({
    t,
    sanitizeMainTab,
    clampGroupIndex,
    normalizeGroupTabState,
    isMultiTab,
    isFixedTimeTab,
    getSlotCount: () => slotCount,
    getShowCopyFormat: () => showCopyFormat,
    getShowTimeline: () => showTimeline,
    getIsRealtime: () => isRealtime,
    setIsRealtime: (next) => setIsRealtimeState(next),
    syncRealtimeNow: () => {
        globalTimes[0] = new Date();
    },
    getCurrentMainTab: () => currentMainTab,
    setCurrentMainTab: (next) => { currentMainTab = next; },
    getActiveGroupId: () => activeGroupId,
    setActiveGroupId: (next) => { activeGroupId = next; },
    getActiveGroupIdByMainTab: () => activeGroupIdByMainTab,
    setActiveGroupIdByMainTab: (next) => { activeGroupIdByMainTab = next; },
    hideFloatingTooltip,
    syncCurrentMultiStateToActiveSubgroup,
    refreshMultiRangeControls,
    renderBaseTimeSelect,
    loadCurrentMultiStateFromActiveSubgroup,
    renderGroups: () => groupTabsService.renderGroups(),
    renderMultiSubgroups: () => groupTabsService.renderMultiSubgroups(),
    renderMultiRanges: () => multiRangeRenderService.renderMultiRanges(),
    renderFixedTimeTab,
    renderList,
    renderTimelineFrame,
    updateTimeAdjustPanel: () => timeAdjustUiService.updateTimeAdjustPanel(),
    renderCopyFormatControls: () => formatControlsService.renderCopyFormatControls(),
    savePersistence: (options = {}) => persistenceService.savePersistence(options)
});
const tabOrchestratorService = serviceBootstrap.createTabOrchestratorService({
    sanitizeMainTab,
    syncActiveFormatProfileFromState,
    resolveFormatProfileContext,
    activateFormatProfileContext,
    getSlotCount: () => slotCount,
    switchMainTabUi: (tab) => tabUiService.switchMainTab(tab),
    refreshOptionToggleDividersUi: () => tabUiService.refreshOptionToggleDividers()
});

const multiStateService = GTV_MULTI_STATE.createService({
    MIN_MULTI_RANGE_COUNT,
    t,
    getGroups: () => groups,
    getDefaultMultiRangeBounds,
    sanitizeMultiRangeCount,
    sanitizeMultiRangeItem,
    sanitizeUtcMs: (value, fallbackMs) => GTV_TIME_CORE.sanitizeUtcMs(value, fallbackMs)
});

imageExportNamingService = GTV_IMAGE_EXPORT_NAMING.createService({
    t,
    pad,
    timeService,
    getCustomOffsetMinutes,
    getBaseTimezoneRef,
    getBaseTime: () => globalTimes[0],
    getActiveGroupName: () => groups[activeGroupId]?.name,
    getZoneAbbreviation,
    sanitizeMultiSubgroupName: (value, fallback = "subgroup") =>
        multiStateService.sanitizeMultiSubgroupName(value, fallback),
    getCurrentMultiSubgroupName
});

imageExportActionsService = GTV_IMAGE_EXPORT_ACTIONS.createService({
    imageExportApi: GTV_IMAGE_EXPORT,
    t,
    showToast,
    isMultiTab,
    ensureMultiRangeState,
    detectForeignObjectRendererSupport,
    renderTimezoneTableToPngDataUrl,
    renderTimezoneTableFallbackDataUrl,
    renderMultiRangesToPngDataUrl,
    renderMultiRangeSingleToPngDataUrl,
    renderMultiRangesFallbackDataUrl,
    renderMultiRangeTitlesToPngDataUrl,
    getTimezoneTableImageFilename,
    getMultiRangeTableImageFilename,
    getMultiRangeTitlesImageFilename,
    getMultiRanges: () => multiRanges,
    isDomExceptionLike,
    setCanUseForeignObjectRenderer: (value) => {
        canUseForeignObjectRenderer = !!value;
    }
});

const groupStateService = serviceBootstrap.createGroupStateService({
    t,
    sanitizeTimezoneId,
    createUniqueTimezoneId,
    normalizeCustomAbbr,
    normalizeZoneAbbreviation: (value) => timezoneSearchService.normalizeZoneAbbreviation(value),
    sanitizeBaseTimezoneId,
    sanitizeUtcRowOrder: (value) => GTV_TIME_CORE.sanitizeUtcRowOrder(value),
    sanitizeMultiSubgroupId: (value) => multiStateService.sanitizeMultiSubgroupId(value),
    sanitizeFixedTimes,
    sanitizeFixedDateValue,
    ensureGroupMultiSubgroups: (group, options = {}) =>
        multiStateService.ensureGroupMultiSubgroups(group, options)
});
const appStatePatcherService = GTV_APP_STATE_PATCHER.createService({
    getStateSource: () => ({
        groups,
        activeGroupId,
        currentMainTab,
        activeGroupIdByMainTab,
        slotCount,
        showCopyFormat,
        showTimeline,
        displayFormatOrder,
        displayFormatEnabled,
        displayTimePartsEnabled,
        copyFormatOrder,
        copyFormatEnabled,
        copyTimePartsEnabled,
        formatProfiles,
        activeFormatProfileContext,
        timeAdjustDayStepBySlot,
        multiRangeCount,
        multiRangeTitle,
        multiRanges,
        multiRangeCollapsed,
        multiRangeStartEditEnabled,
        multiRangeEndEditEnabled,
        isRealtime,
        currentTheme,
        currentLang
    }),
    stateSetters: {
        groups: (value) => { groups = value; },
        activeGroupId: (value) => { activeGroupId = value; },
        currentMainTab: (value) => { currentMainTab = value; },
        activeGroupIdByMainTab: (value) => { activeGroupIdByMainTab = value; },
        slotCount: (value) => { slotCount = value; },
        showCopyFormat: (value) => { showCopyFormat = value; },
        showTimeline: (value) => { showTimeline = !!value; },
        displayFormatOrder: (value) => { displayFormatOrder = value; },
        displayFormatEnabled: (value) => { displayFormatEnabled = value; },
        displayTimePartsEnabled: (value) => { displayTimePartsEnabled = value; },
        copyFormatOrder: (value) => { copyFormatOrder = value; },
        copyFormatEnabled: (value) => { copyFormatEnabled = value; },
        copyTimePartsEnabled: (value) => { copyTimePartsEnabled = value; },
        formatProfiles: (value) => { formatProfiles = value; },
        activeFormatProfileContext: (value) => { activeFormatProfileContext = value; },
        timeAdjustDayStepBySlot: (value) => { timeAdjustDayStepBySlot = value; },
        multiRangeCount: (value) => { multiRangeCount = value; },
        multiRangeTitle: (value) => { multiRangeTitle = value; },
        multiRanges: (value) => { multiRanges = value; },
        multiRangeCollapsed: (value) => { multiRangeCollapsed = value; },
        multiRangeStartEditEnabled: (value) => { multiRangeStartEditEnabled = value; },
        multiRangeEndEditEnabled: (value) => { multiRangeEndEditEnabled = value; },
        currentTheme: (value) => { currentTheme = value; },
        currentLang: (value) => { currentLang = value; }
    },
    setIsRealtimeState: (...args) => setIsRealtimeState(...args)
});
const appPersistenceStateService = GTV_APP_PERSISTENCE_STATE.createService({
    getState: () => appStatePatcherService.getStateSnapshot(),
    setState: (next = {}) => appStatePatcherService.applyStatePatch(next),
    setIsRealtimeState: (...args) => setIsRealtimeState(...args),
    syncActiveFormatProfileFromState: (...args) => syncActiveFormatProfileFromState(...args),
    ensureFormatProfiles: (...args) => ensureFormatProfiles(...args),
    getCurrentFormatProfileState: (...args) => getCurrentFormatProfileState(...args),
    resolveFormatProfileContext: (...args) => resolveFormatProfileContext(...args),
    applyFormatProfileState: (...args) => applyFormatProfileState(...args)
});

const groupTabsService = GTV_GROUP_TABS.createService({
    t,
    showToast,
    getState: getPersistenceState,
    setState: setPersistenceState,
    isMultiTab,
    getCurrentGroup,
    isFixedTimeTab,
    ensureGroupMultiSubgroups: (group, options = {}) =>
        multiStateService.ensureGroupMultiSubgroups(group, options),
    normalizeGroupTabState,
    syncCurrentMultiStateToActiveSubgroup,
    loadCurrentMultiStateFromActiveSubgroup,
    savePersistence: (options = {}) => persistenceService.savePersistence(options),
    renderGroups: () => groupTabsService.renderGroups(),
    renderMultiSubgroups: () => groupTabsService.renderMultiSubgroups(),
    renderBaseTimeSelect,
    renderMultiRanges: () => multiRangeRenderService.renderMultiRanges(),
    renderFixedTimeTab,
    renderList,
    renderTimelineFrame,
    setCustomTooltip,
    hideFloatingTooltip,
    upgradeNativeTitleTooltips,
    getDefaultMultiSubgroupName: (index = 0) => multiStateService.getDefaultMultiSubgroupName(index),
    getDefaultFixedTimes,
    getDefaultFixedDate,
    createMultiSubgroupState: (name = "", index = 0, state = null) =>
        multiStateService.createMultiSubgroupState(name, index, state),
    sanitizeMultiSubgroupName: (value, fallback = "") =>
        multiStateService.sanitizeMultiSubgroupName(value, fallback),
    sanitizeMultiRangeTitle,
    exportGroupToJSON: (groupIdx = activeGroupId) => dataTransferService.exportGroupToJSON(groupIdx),
    triggerGroupImportFor: (groupIdx = activeGroupId) => dataTransferService.triggerGroupImportFor(groupIdx),
    exportSubgroupToJSON: (groupIdx = activeGroupId, subgroupId = "") => dataTransferService.exportSubgroupToJSON(groupIdx, subgroupId),
    triggerSubgroupImportFor: (groupIdx = activeGroupId, subgroupId = "") => dataTransferService.triggerSubgroupImportFor(groupIdx, subgroupId)
});

const persistenceServices = persistenceServiceBundleFactory.createBundle({
    STORAGE_KEY,
    THEME_STORAGE_KEY,
    LANG_STORAGE_KEY,
    UI_SCALE_STORAGE_KEY,
    LEGACY_STORAGE_KEYS,
    LEGACY_STORAGE_FALLBACK_KEYS,
    COPY_FORMAT_KEYS,
    DEFAULT_TIME_ADJUST_DAY_STEP,
    MIN_MULTI_RANGE_COUNT,
    I18N_DATA,
    VERSION,
    getDefaultFixedTimes,
    getDefaultFixedDate,
    getState: getPersistenceState,
    setState: setPersistenceState,
    getPersistenceSnapshot,
    ensureGroupMultiSubgroups: (group, options = {}) =>
        multiStateService.ensureGroupMultiSubgroups(group, options),
    sanitizeGroup,
    sanitizeBaseTimezoneId,
    sanitizeMainTab,
    sanitizeTimeAdjustDayStep,
    sanitizeCopyFormatOrder,
    sanitizeCopyFormatEnabled,
    sanitizeTimePartsEnabled,
    sanitizeFormatProfiles,
    deriveTimePartsFromLegacyEnabled,
    sanitizeMultiStatePayload: (rawState = null, fallbackState = null) =>
        multiStateService.sanitizeMultiStatePayload(rawState, fallbackState),
    sanitizeMultiRangeTitle,
    loadCurrentMultiStateFromActiveSubgroup,
    ensureBaseTimezoneSelection,
    syncCurrentMultiStateToActiveSubgroup,
    loadThemePreference,
    applyTheme,
    loadUiScalePreference,
    applyUiScale,
    populateUiScaleSelect,
    getCurrentUiScalePercent: () => Math.round(uiScale * 100),
    refreshMultiRangeControls,
    updateTZDropdown: () => timezoneSearchService.updateTZDropdown(),
    refreshSelectWidths,
    switchMainTab,
    showToast,
    t,
    tFormat,
    applyVersionBranding,
    applyTranslations: () => {
        if (typeof globalThis.applyTranslations === "function") {
            globalThis.applyTranslations();
        }
    },
    getGroups: () => groups,
    getCurrentTheme: () => currentTheme,
    getCurrentLang: () => currentLang,
    getCurrentMainTab: () => currentMainTab,
    sanitizeUtcRowOrder: (value) => GTV_TIME_CORE.sanitizeUtcRowOrder(value),
    sanitizeTheme,
    sanitizeUiScalePercent,
    setCurrentLang,
    loadPersistence,
    localizeAutoGeneratedNamesForCurrentLanguage,
    getActiveGroupId: () => activeGroupId,
    sanitizeFilenamePart,
    pad,
    renderGroups: () => groupTabsService.renderGroups(),
    renderMultiSubgroups: () => groupTabsService.renderMultiSubgroups(),
    renderBaseTimeSelect,
    renderMultiRanges: () => multiRangeRenderService.renderMultiRanges(),
    renderList,
    isMultiTab,
    sanitizeMultiSubgroupId: (value) => multiStateService.sanitizeMultiSubgroupId(value),
    sanitizeMultiSubgroupName: (value, fallback = "") =>
        multiStateService.sanitizeMultiSubgroupName(value, fallback),
    getDefaultMultiSubgroupName: (index = 0) => multiStateService.getDefaultMultiSubgroupName(index),
    getCurrentMultiSubgroup,
    document: (typeof document === "object" && document) ? document : null
});
const persistenceService = persistenceServices.persistenceService;
const settingsIoService = persistenceServices.settingsIoService;
const dataTransferService = persistenceServices.dataTransferService;
uiSettingsActionsService = persistenceServices.uiSettingsActionsService;

timelineFrameService = GTV_TIMELINE_FRAME.createService({
    TIMELINE_TOTAL_HOURS,
    TIMELINE_TOTAL_SECONDS,
    requestUiFrame,
    cancelUiFrame,
    t,
    getCurrentMainTab: () => currentMainTab,
    getShowTimeline: () => showTimeline,
    isMultiTab,
    isFixedTimeTab,
    getIsRealtime: () => isRealtime,
    getSlotCount: () => slotCount,
    getGlobalTime: (slotIdx) => globalTimes[slotIdx],
    setGlobalTime: (slotIdx, value) => {
        globalTimes[slotIdx] = value;
    },
    getBaseTimezoneRef,
    getCurrentGroupZones,
    isCurrentGroupUtcRowVisible,
    getCurrentGroupUtcRowOrder,
    getUTCRef,
    resolveFixedTimeTimelineSourceDate,
    applyFixedTimeSlotTimelineRatio,
    getFixedTimeTimelineSlots,
    getFixedTimeTimelineSlotCount,
    getFixedTimeTimelineIndicatorToken,
    getFixedTimeSlotTimelineLabel,
    getZoneDisplayName,
    getFixedOffsetForDisplayAtDate,
    getLocalPartsByTimezone,
    getUTCDateFromLocalParts,
    clampNumber,
    pad,
    getCurrentLang: () => currentLang,
    getCurrentTheme: () => currentTheme,
    updateClocks: () => updateClocks(),
    savePersistence: () => persistenceService.savePersistence(),
    getTimelineFrameElement: () => document.getElementById("timeline-frame")
});

fixedTimeTableService = GTV_FIXED_TIME_TABLE.createService({
    t,
    getCurrentGroup,
    ensureGroupFixedTimes,
    getFixedTimeDisplayPartsEnabled,
    getDisplayFormatOrder: () => displayFormatOrder,
    getDisplayFormatEnabled: () => displayFormatEnabled,
    sanitizeCopyFormatOrderForContext,
    sanitizeCopyFormatEnabledForContext,
    getBaseTimezoneRef,
    getRenderableTimezoneRows: (baseRef) => tableRenderService.getRenderableTimezoneRows(baseRef),
    getGlobalTime: (slotIdx) => globalTimes[slotIdx],
    resolveFixedTimeSlotUtcDate,
    getFixedTimeTimelineIndicatorColor,
    getFixedTimeSlotHeaderLabel,
    renameFixedTimeSlot,
    copyFixedTimeSlotColumn,
    createDragGhostFromRow,
    clearDragGhost,
    saveFixedTimeOrder,
    updateClocks: () => updateClocks(),
    getZoneAbbreviation,
    getZoneDisplayName,
    formatUtcOffsetLabel,
    getCustomOffsetMinutes,
    getFixedOffsetForDisplayAtDate,
    getTimezoneOffset,
    buildFixedTimeDisplayPayloadAtUtc,
    bindCustomDatePickerForInput,
    buildFixedTimeCellInputValue,
    applyFixedTimeSlotByTimezoneInput,
    copyFixedTimeCellByTimezone,
    upgradeNativeTitleTooltips
});

mainUiInitService = GTV_MAIN_UI_INIT.createService({
    t,
    switchMainTab,
    populateUiScaleSelect,
    getUiScale: () => uiScale,
    applyUiScale,
    getMultiRangeCount: () => multiRangeCount,
    setMultiRangeCount,
    refreshMultiRangeControls,
    getFixedTimeSlotCountForCurrentGroup: () => getFixedTimeSlotCount(getCurrentGroup()),
    setFixedTimeSlotCount,
    refreshFixedTimeSlotCountControls,
    bindCustomDatePickerForInput,
    getCurrentGroup,
    ensureGroupFixedTimes,
    setCurrentGroupFixedDate,
    sanitizeFixedDateValue,
    showToast,
    normalizeCustomAbbr,
    addTimezone,
    createUniqueTimezoneId,
    syncActiveFormatProfileFromState,
    getSlotCount: () => slotCount,
    setSlotCount: (next) => {
        slotCount = next;
    },
    activateFormatProfileForCurrentContext,
    renderList,
    renderCopyFormatControls: () => formatControlsService.renderCopyFormatControls(),
    updateCopyFormatPreview,
    savePersistence: () => persistenceService.savePersistence(),
    getShowCopyFormat: () => showCopyFormat,
    setShowCopyFormat: (next) => {
        showCopyFormat = !!next;
    },
    getShowTimeline: () => showTimeline,
    setShowTimeline: (next) => {
        showTimeline = !!next;
    },
    renderTimelineFrame,
    resetDisplayFormatForActiveContext,
    resetCopyFormatForActiveContext,
    applyCurrentGroupBaseTimezoneId,
    addGroup: () => groupTabsService.addGroup(),
    addMultiSubgroup: () => groupTabsService.addMultiSubgroup(),
    copyAllTimezones,
    saveTimezoneTableImage,
    saveMultiRangeTitlesImage,
    bindTransferControls: () => {
        if (uiSettingsActionsService && typeof uiSettingsActionsService.bindTransferControls === "function") {
            uiSettingsActionsService.bindTransferControls();
        }
    },
    getCurrentTheme: () => currentTheme,
    applyTheme,
    refreshCalculator: () => {
        if (typeof window !== "undefined" && typeof window.__gtvCalcRefresh === "function") {
            window.__gtvCalcRefresh();
        }
    },
    getCurrentLang: () => currentLang,
    hideFloatingTooltip,
    setLanguage: (lang) => {
        const languageFn = (typeof globalThis !== "undefined" && typeof globalThis.setLanguage === "function")
            ? globalThis.setLanguage
            : null;
        if (languageFn) languageFn(lang);
    },
    localizeAutoGeneratedNamesForCurrentLanguage,
    applyVersionBranding,
    updateTZDropdown: () => timezoneSearchService.updateTZDropdown(),
    renderGroups: () => groupTabsService.renderGroups(),
    renderMultiSubgroups: () => groupTabsService.renderMultiSubgroups(),
    updateTimeAdjustPanel: () => timeAdjustUiService.updateTimeAdjustPanel(),
    refreshSelectWidths,
    bindResetControls: () => {
        if (uiSettingsActionsService && typeof uiSettingsActionsService.bindResetControls === "function") {
            uiSettingsActionsService.bindResetControls();
        }
    },
    renderBaseTimeSelect,
    updateOptionRowVisibility: () => tabUiService.updateOptionRowVisibility(),
    upgradeNativeTitleTooltips
});

function showFatalError(err) {
    if (!appFeedbackService || typeof appFeedbackService.showFatalError !== "function") {
        console.error("FATAL ERROR during app initialization:", err);
        return;
    }
    appFeedbackService.showFatalError(err);
}

async function initApp() {
    try {
        await loadPersistence();
        if (localizeAutoGeneratedNamesForCurrentLanguage()) {
            await persistenceService.savePersistence();
        }
        loadCurrentMultiStateFromActiveSubgroup();
        await applyTheme(await loadThemePreference(), false);
        await applyUiScale(await loadUiScalePreference(), false);
        applyTranslations();
        applyVersionBranding();
        mainUiInitService.initUI();
        bindFloatingTooltipEvents();
        initDragAndDrop();
        timezoneSearchService.initSearchAndSelect();
        initCalculators();

        timerEngineService.startRealtimeTicker();

        switchMainTab(currentMainTab);

        // Force initial update
        updateClocks();
    } catch (err) {
        showFatalError(err);
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}

function showToast(message, options = {}) {
    if (!appFeedbackService || typeof appFeedbackService.showToast !== "function") return;
    return appFeedbackService.showToast(message, options);
}

function switchMainTab(tab) {
    return tabOrchestratorService.switchMainTab(tab);
}

function refreshOptionToggleDividers() {
    return tabOrchestratorService.refreshOptionToggleDividers();
}

function adjustSelectWidthForContent(select, minWidth = 0) {
    if (!select) return;
    const canvas = adjustSelectWidthForContent.canvas || (adjustSelectWidthForContent.canvas = document.createElement("canvas"));
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const computed = window.getComputedStyle(select);
    ctx.font = `${computed.fontStyle} ${computed.fontWeight} ${computed.fontSize} ${computed.fontFamily}`;

    let maxTextWidth = 0;
    [...select.options].forEach(option => {
        const label = (option.textContent || "").trim();
        if (!label) return;
        maxTextWidth = Math.max(maxTextWidth, ctx.measureText(label).width);
    });

    const requiredWidth = Math.ceil(maxTextWidth + 72); // arrow + scrollbar + safety gap
    const currentWidth = parseInt(select.dataset.minWidth || "", 10);
    const baseMinWidth = Number.isFinite(currentWidth)
        ? currentWidth
        : (parseInt(select.style.width || "", 10) || minWidth || 0);
    if (!Number.isFinite(currentWidth)) select.dataset.minWidth = String(baseMinWidth);

    select.style.width = `${Math.max(baseMinWidth, requiredWidth)}px`;
}

function refreshSelectWidths() {
    adjustSelectWidthForContent(document.getElementById("tz-quick-select"), 118);
    adjustSelectWidthForContent(document.getElementById("base-time-select"), 200);
}

function renderBaseTimeSelect() {
    const select = document.getElementById("base-time-select");
    if (!select) return;

    ensureBaseTimezoneSelection();
    const selectedBefore = getCurrentGroupBaseTimezoneId();
    select.textContent = "";

    const includeUtcOption = selectedBefore === "utc" || isCurrentGroupUtcRowVisible();
    if (includeUtcOption) {
        const utcOption = document.createElement("option");
        utcOption.value = "utc";
        utcOption.textContent = `[UTC] ${t("utc_name")}`;
        select.appendChild(utcOption);
    }

    getCurrentGroupZones().forEach(tz => {
        const option = document.createElement("option");
        option.value = tz.id;
        option.textContent = `[${getZoneAbbreviation(tz)}] ${getZoneDisplayName(tz)}`;
        select.appendChild(option);
    });

    const selectedNext = [...select.options].some(o => o.value === selectedBefore)
        ? selectedBefore
        : (select.options[0]?.value || "utc");
    setCurrentGroupBaseTimezoneId(selectedNext);
    select.value = selectedNext;
    if (selectedNext !== selectedBefore) persistenceService.savePersistence();
    adjustSelectWidthForContent(select, 220);
}

function sanitizeTimeAdjustDayStep(value) {
    const safeValue = Number.isFinite(Number(value)) ? value : DEFAULT_TIME_ADJUST_DAY_STEP;
    return timeAdjustUiService.sanitizeTimeAdjustDayStep(safeValue);
}



function getCopyFieldLabel(key) {
    const safeKey = (typeof key === "string") ? key : "";
    return formatControlsService.getCopyFieldLabel(safeKey);
}

function getTimePartLabel(partKey) {
    const safePartKey = (typeof partKey === "string") ? partKey : "";
    return formatControlsService.getTimePartLabel(safePartKey);
}

function getDisplayColumns(effectiveSlotCount) {
    const safeSlotCount = Number.isFinite(Number(effectiveSlotCount)) ? Number(effectiveSlotCount) : slotCount;
    return tableRenderService.getDisplayColumns(safeSlotCount);
}

function getDisplayTimeInputMode() {
    const mode = tableRenderService.getDisplayTimeInputMode();
    return mode;
}

function buildRowActionCells(copyButtonTitle, removeButtonText, removeButtonTitle = "") {
    const safeCopyTitle = String(copyButtonTitle ?? "");
    const safeRemoveText = String(removeButtonText ?? "");
    const safeRemoveTitle = String(removeButtonTitle ?? "");
    return tableRenderService.buildRowActionCells(safeCopyTitle, safeRemoveText, safeRemoveTitle);
}

function buildTimezoneComputedSnapshotForRange(tz, startDate, endDate) {
    if (!(startDate instanceof Date) || !Number.isFinite(startDate.getTime())) return null;
    if (!(endDate instanceof Date) || !Number.isFinite(endDate.getTime())) return null;
    return multiRangeRenderService.buildTimezoneComputedSnapshotForRange(tz, startDate, endDate);
}

function applySnapshotToRow(row, snapshot) {
    if (!row || !snapshot) return false;
    return multiRangeRenderService.applySnapshotToRow(row, snapshot);
}

function formatRangeDurationText(startUtcMs, endUtcMs) {
    const safeStart = Number.isFinite(startUtcMs) ? startUtcMs : Date.now();
    const safeEnd = Number.isFinite(endUtcMs) ? endUtcMs : safeStart;
    return multiRangeRenderService.formatRangeDurationText(safeStart, safeEnd);
}

// --- List Rendering (Dynamic Slots) ---
function renderList() {
    if (isFixedTimeTab()) {
        return renderFixedTimeTab();
    }
    return tableRenderService.renderList();
}

function resolveTimeAdjustZoneAndOffset(baseRef, fixedOffsetMinutes = null) {
    if (!timeAdjustActionsService || typeof timeAdjustActionsService.resolveTimeAdjustZoneAndOffset !== "function") {
        return { zone: "UTC", fixedOffsetMinutes: null };
    }
    return timeAdjustActionsService.resolveTimeAdjustZoneAndOffset(baseRef, fixedOffsetMinutes);
}








function applyTimeAdjustAction(slotIdx, action) {
    if (!timeAdjustActionsService || typeof timeAdjustActionsService.applyTimeAdjustAction !== "function") return;
    timeAdjustActionsService.applyTimeAdjustAction(slotIdx, action);
}

function getAdjustedUtcDateByAction(baseDate, action, slotIdx, baseRef, fixedOffsetMinutes) {
    if (!timeAdjustActionsService || typeof timeAdjustActionsService.getAdjustedUtcDateByAction !== "function") return null;
    return timeAdjustActionsService.getAdjustedUtcDateByAction(
        baseDate,
        action,
        slotIdx,
        baseRef,
        fixedOffsetMinutes
    );
}

function applyBulkRangeAllAction(slotIdx, action) {
    if (!timeAdjustActionsService || typeof timeAdjustActionsService.applyBulkRangeAllAction !== "function") return;
    timeAdjustActionsService.applyBulkRangeAllAction(slotIdx, action);
}

function applyMultiRangeTimeAdjustAction(rangeIdx, slotIdx, action) {
    if (!timeAdjustActionsService || typeof timeAdjustActionsService.applyMultiRangeTimeAdjustAction !== "function") return;
    timeAdjustActionsService.applyMultiRangeTimeAdjustAction(rangeIdx, slotIdx, action);
}


function isTimelineSupportedTab() {
    return currentMainTab === "live" || currentMainTab === "fixed" || currentMainTab === "fixed-time";
}

function shouldRenderTimeline() {
    if (timelineFrameService && typeof timelineFrameService.shouldRenderTimeline === "function") {
        return !!timelineFrameService.shouldRenderTimeline();
    }
    return !!showTimeline && isTimelineSupportedTab() && !isMultiTab();
}

function resolveFixedTimeTimelineSourceDate(slotIdx, baseRef, anchorDate = globalTimes[0]) {
    if (!fixedTimeTimelineService || typeof fixedTimeTimelineService.resolveFixedTimeTimelineSourceDate !== "function") return null;
    return fixedTimeTimelineService.resolveFixedTimeTimelineSourceDate(slotIdx, baseRef, anchorDate);
}

function applyFixedTimeSlotTimelineRatio(slotIdx, ratio) {
    if (!fixedTimeTimelineService || typeof fixedTimeTimelineService.applyFixedTimeSlotTimelineRatio !== "function") return false;
    return fixedTimeTimelineService.applyFixedTimeSlotTimelineRatio(slotIdx, ratio);
}

function getFixedTimeTimelineSlots() {
    if (!fixedTimeTimelineService || typeof fixedTimeTimelineService.getFixedTimeTimelineSlots !== "function") return [];
    return fixedTimeTimelineService.getFixedTimeTimelineSlots();
}

function getFixedTimeTimelineSlotCount() {
    if (!fixedTimeTimelineService || typeof fixedTimeTimelineService.getFixedTimeTimelineSlotCount !== "function") {
        return getFixedTimeSlotCount(getCurrentGroup());
    }
    return fixedTimeTimelineService.getFixedTimeTimelineSlotCount();
}

function getFixedTimeTimelineIndicatorToken() {
    if (!fixedTimeTimelineService || typeof fixedTimeTimelineService.getFixedTimeTimelineIndicatorToken !== "function") return "";
    return fixedTimeTimelineService.getFixedTimeTimelineIndicatorToken();
}

function getFixedTimeSlotTimelineLabel(slot, slotIdx, slotCount = 1) {
    if (!fixedTimeTimelineService || typeof fixedTimeTimelineService.getFixedTimeSlotTimelineLabel !== "function") {
        return getFixedTimeSlotHeaderLabel(slot, slotIdx, slotCount);
    }
    return fixedTimeTimelineService.getFixedTimeSlotTimelineLabel(slot, slotIdx, slotCount);
}

function getFixedTimeTimelineIndicatorColor(slotIdx) {
    if (!fixedTimeCoreService || typeof fixedTimeCoreService.getFixedTimeTimelineIndicatorColor !== "function") {
        const palette = ["#ff4d4d", "#3b82f6", "#14b8a6", "#f59e0b", "#a855f7"];
        return palette[slotIdx % palette.length];
    }
    return fixedTimeCoreService.getFixedTimeTimelineIndicatorColor(slotIdx);
}

function stopTimelineDrag() {
    if (!timelineFrameService || typeof timelineFrameService.stopTimelineDrag !== "function") return;
    timelineFrameService.stopTimelineDrag();
}

function normalizeDayNightMarker(marker) {
    if (!fixedTimeCoreService || typeof fixedTimeCoreService.normalizeDayNightMarker !== "function") {
        const raw = String(marker || "").trim();
        if (!raw) return "";
        const normalized = raw.toUpperCase();
        if (normalized === "DAY" || raw === "\u2600\uFE0F") return "DAY";
        if (normalized === "NIGHT" || normalized === "MOON" || raw === "\uD83C\uDF19") return "NIGHT";
        return "";
    }
    return fixedTimeCoreService.normalizeDayNightMarker(marker);
}

function getDayNightGlyph(marker) {
    if (!fixedTimeCoreService || typeof fixedTimeCoreService.getDayNightGlyph !== "function") return String(marker || "");
    return fixedTimeCoreService.getDayNightGlyph(marker);
}

function applyTimelineRatioToSlot(slotIdx, ratio, baseRef, options = {}) {
    if (!timelineFrameService || typeof timelineFrameService.applyTimelineRatioToSlot !== "function") return;
    timelineFrameService.applyTimelineRatioToSlot(slotIdx, ratio, baseRef, options);
}

function getTimelineIndicatorLabel(slotIdx) {
    if (timelineFrameService && typeof timelineFrameService.getTimelineIndicatorLabel === "function") {
        return timelineFrameService.getTimelineIndicatorLabel(slotIdx);
    }
    const showRangeLabels = currentMainTab === "fixed" && !isRealtime && slotCount > 1;
    if (showRangeLabels) {
        return t(slotIdx === 0 ? "th_time_day_start" : "th_time_day_end");
    }
    return t("th_time_day_main");
}

function getTimelinePanelCount() {
    if (timelineFrameService && typeof timelineFrameService.getTimelinePanelCount === "function") {
        return timelineFrameService.getTimelinePanelCount();
    }
    if (isFixedTimeTab()) {
        return 1;
    }
    return (!isRealtime && slotCount > 1) ? 2 : 1;
}

function renderTimelineFrame() {
    if (!timelineFrameService || typeof timelineFrameService.renderTimelineFrame !== "function") return;
    timelineFrameService.renderTimelineFrame();
}

function getFixedTimeSlotParts(slot) {
    if (!fixedTimeCoreService || typeof fixedTimeCoreService.getFixedTimeSlotParts !== "function") return null;
    return fixedTimeCoreService.getFixedTimeSlotParts(slot);
}

function resolveFixedTimeSlotUtcDate(slot, baseRef, anchorDate = globalTimes[0]) {
    if (!fixedTimeCoreService || typeof fixedTimeCoreService.resolveFixedTimeSlotUtcDate !== "function") return null;
    return fixedTimeCoreService.resolveFixedTimeSlotUtcDate(slot, baseRef, anchorDate);
}

function formatFixedTimeForTimezoneAtUtc(utcDate, tz) {
    if (!fixedTimeCoreService || typeof fixedTimeCoreService.formatFixedTimeForTimezoneAtUtc !== "function") return "--:--:--";
    return fixedTimeCoreService.formatFixedTimeForTimezoneAtUtc(utcDate, tz);
}

function getFixedTimeDisplayPartsEnabled() {
    if (!fixedTimeCoreService || typeof fixedTimeCoreService.getFixedTimeDisplayPartsEnabled !== "function") {
        return { dn: true, time: true, weekday: true };
    }
    return fixedTimeCoreService.getFixedTimeDisplayPartsEnabled();
}

function getLocalizedWeekdayNameByIndex(weekdayIndex) {
    if (!fixedTimeCoreService || typeof fixedTimeCoreService.getLocalizedWeekdayNameByIndex !== "function") return "";
    return fixedTimeCoreService.getLocalizedWeekdayNameByIndex(weekdayIndex);
}

function buildFixedTimeDisplayPayloadAtUtc(utcDate, tz) {
    if (!fixedTimeCoreService || typeof fixedTimeCoreService.buildFixedTimeDisplayPayloadAtUtc !== "function") return null;
    return fixedTimeCoreService.buildFixedTimeDisplayPayloadAtUtc(utcDate, tz);
}

function getFixedTimeSlotHeaderLabel(slot, slotIdx, slotCount = 1) {
    if (!fixedTimeCoreService || typeof fixedTimeCoreService.getFixedTimeSlotHeaderLabel !== "function") {
        return `${t("th_fixed_time")} ${slotIdx + 1}`;
    }
    return fixedTimeCoreService.getFixedTimeSlotHeaderLabel(slot, slotIdx, slotCount);
}

function renderFixedTimeValueCell(cell, payload, partsEnabled) {
    if (!cell) return;
    const safeParts = (partsEnabled && typeof partsEnabled === "object")
        ? partsEnabled
        : { dn: true, time: true, weekday: true };

    cell.textContent = "";
    const wrap = document.createElement("div");
    wrap.className = "fixed-time-display";
    let hasAnyToken = false;

    if (safeParts.dn && payload?.dayNightGlyph) {
        const dnEl = document.createElement("span");
        dnEl.className = "dn-icon";
        dnEl.textContent = payload.dayNightGlyph;
        dnEl.title = payload.dayNightMarker === "DAY" ? t("dn_day") : t("dn_night");
        wrap.appendChild(dnEl);
        hasAnyToken = true;
    }

    if (safeParts.time) {
        const clockEl = document.createElement("span");
        clockEl.className = "fixed-time-clock";
        clockEl.textContent = payload?.clock || "--:--:--";
        wrap.appendChild(clockEl);
        hasAnyToken = true;
    }

    if (safeParts.weekday && payload?.dayName) {
        const dayEl = document.createElement("span");
        const isSun = payload.weekdayIndex === 0;
        const isSat = payload.weekdayIndex === 6;
        dayEl.className = `day-badge${isSun ? " day-sun" : (isSat ? " day-sat" : "")}`;
        dayEl.textContent = payload.dayName;
        wrap.appendChild(dayEl);
        hasAnyToken = true;
    }

    if (!hasAnyToken) {
        const emptyEl = document.createElement("span");
        emptyEl.className = "fixed-time-empty";
        emptyEl.textContent = "-";
        wrap.appendChild(emptyEl);
    }

    cell.appendChild(wrap);
}

function formatFixedTimePayloadText(payload, partsEnabled) {
    if (!fixedTimeActionsService || typeof fixedTimeActionsService.formatFixedTimePayloadText !== "function") return "-";
    return fixedTimeActionsService.formatFixedTimePayloadText(payload, partsEnabled);
}

function getFixedTimeCopyState() {
    if (!fixedTimeActionsService || typeof fixedTimeActionsService.getFixedTimeCopyState !== "function") {
        return {
            order: sanitizeCopyFormatOrderForContext(copyFormatOrder, "fixed-time"),
            enabled: sanitizeCopyFormatEnabledForContext(copyFormatEnabled, "copy", "fixed-time"),
            timePartsEnabled: sanitizeTimePartsEnabledForContext(copyTimePartsEnabled, "copy", "fixed-time")
        };
    }
    return fixedTimeActionsService.getFixedTimeCopyState();
}

function buildFixedTimeSnapshotForTimezoneSlot(tz, slotUtcDate) {
    if (!fixedTimeActionsService || typeof fixedTimeActionsService.buildFixedTimeSnapshotForTimezoneSlot !== "function") return null;
    return fixedTimeActionsService.buildFixedTimeSnapshotForTimezoneSlot(tz, slotUtcDate);
}

function formatFixedTimeCopyTextForTimezoneSlot(tz, slotUtcDate, copyState = null) {
    if (!fixedTimeActionsService || typeof fixedTimeActionsService.formatFixedTimeCopyTextForTimezoneSlot !== "function") return "";
    return fixedTimeActionsService.formatFixedTimeCopyTextForTimezoneSlot(tz, slotUtcDate, copyState);
}

function getFixedTimeSlotUtcDateByIndex(slotIdx) {
    if (!fixedTimeActionsService || typeof fixedTimeActionsService.getFixedTimeSlotUtcDateByIndex !== "function") return null;
    return fixedTimeActionsService.getFixedTimeSlotUtcDateByIndex(slotIdx);
}

function getFixedTimePreviewCopyText() {
    if (!fixedTimeActionsService || typeof fixedTimeActionsService.getFixedTimePreviewCopyText !== "function") return "";
    return fixedTimeActionsService.getFixedTimePreviewCopyText();
}

function getAllFixedTimeRowsCopyText() {
    if (!fixedTimeActionsService || typeof fixedTimeActionsService.getAllFixedTimeRowsCopyText !== "function") return "";
    return fixedTimeActionsService.getAllFixedTimeRowsCopyText();
}

async function copyFixedTimeCellPayload(payload, partsEnabled) {
    if (!fixedTimeActionsService || typeof fixedTimeActionsService.copyFixedTimeCellPayload !== "function") return;
    return fixedTimeActionsService.copyFixedTimeCellPayload(payload, partsEnabled);
}

async function copyFixedTimeCellByTimezone(tz, slotUtcDate) {
    if (!fixedTimeActionsService || typeof fixedTimeActionsService.copyFixedTimeCellByTimezone !== "function") return;
    return fixedTimeActionsService.copyFixedTimeCellByTimezone(tz, slotUtcDate);
}

function buildFixedTimeCellInputValue(utcDate, tz) {
    if (!fixedTimeActionsService || typeof fixedTimeActionsService.buildFixedTimeCellInputValue !== "function") return "";
    return fixedTimeActionsService.buildFixedTimeCellInputValue(utcDate, tz);
}

function buildFixedTimeCellTimeParts(rawValue) {
    if (!fixedTimeActionsService || typeof fixedTimeActionsService.buildFixedTimeCellTimeParts !== "function") return null;
    return fixedTimeActionsService.buildFixedTimeCellTimeParts(rawValue);
}

function applyFixedTimeSlotByTimezoneInput(slotIdx, tz, rawValue, anchorUtcDate) {
    if (!fixedTimeActionsService || typeof fixedTimeActionsService.applyFixedTimeSlotByTimezoneInput !== "function") return false;
    return fixedTimeActionsService.applyFixedTimeSlotByTimezoneInput(slotIdx, tz, rawValue, anchorUtcDate);
}

function bindCustomDatePickerForInput(input, triggerBtn, options = {}) {
    const CustomDatePickerCtor = window.CustomDatePicker;
    if (!CustomDatePickerCtor) return;
    const preserveValue = !!options?.preserveValue;
    const pickerType = (options?.type === "date" || options?.type === "time" || options?.type === "datetime")
        ? options.type
        : "datetime";
    const preservedInputValue = preserveValue ? String(input.value || "") : "";
    if (input._cdp && typeof input._cdp.destroy === "function") {
        input._cdp.destroy();
    }
    input._cdp = new CustomDatePickerCtor(input, {
        type: pickerType,
        lang: document.documentElement?.lang || "en",
        theme: document.documentElement?.getAttribute?.("data-theme") || "dark",
        triggerElement: triggerBtn || null
    });
    if (preserveValue) {
        input.value = preservedInputValue;
    }
}

async function copyFixedTimeSlotColumn(slotIdx) {
    if (!fixedTimeActionsService || typeof fixedTimeActionsService.copyFixedTimeSlotColumn !== "function") return;
    return fixedTimeActionsService.copyFixedTimeSlotColumn(slotIdx);
}

function renameFixedTimeSlot(slotIdx) {
    if (!fixedTimeActionsService || typeof fixedTimeActionsService.renameFixedTimeSlot !== "function") return;
    fixedTimeActionsService.renameFixedTimeSlot(slotIdx);
}

function updateFixedTimeSlotTime(slotIdx, rawValue) {
    if (!fixedTimeActionsService || typeof fixedTimeActionsService.updateFixedTimeSlotTime !== "function") return false;
    return fixedTimeActionsService.updateFixedTimeSlotTime(slotIdx, rawValue);
}

function addFixedTimeSlot() {
    if (!fixedTimeActionsService || typeof fixedTimeActionsService.addFixedTimeSlot !== "function") return;
    fixedTimeActionsService.addFixedTimeSlot();
}

function removeFixedTimeSlot(slotId) {
    if (!fixedTimeActionsService || typeof fixedTimeActionsService.removeFixedTimeSlot !== "function") return;
    fixedTimeActionsService.removeFixedTimeSlot(slotId);
}

function renderFixedTimeControls() {
    refreshFixedTimeSlotCountControls();
    const dateInput = document.getElementById("fixed-time-date-input");
    const group = getCurrentGroup();
    if (!dateInput) return;
    if (!group) {
        dateInput.value = "";
        return;
    }
    ensureGroupFixedTimes(group);
    dateInput.value = group.fixedDate || "";
}

function getFixedTimeSlotLayoutMetrics(partsEnabled) {
    if (!fixedTimeTableService || typeof fixedTimeTableService.getFixedTimeSlotLayoutMetrics !== "function") {
        return { inputWidthPx: 100, columnMinWidthPx: 152 };
    }
    return fixedTimeTableService.getFixedTimeSlotLayoutMetrics(partsEnabled);
}

function getFixedTimeDisplayColumns() {
    if (!fixedTimeTableService || typeof fixedTimeTableService.getFixedTimeDisplayColumns !== "function") {
        return ["timezone", "region", "time_slots"];
    }
    return fixedTimeTableService.getFixedTimeDisplayColumns();
}

function getFixedTimeOffsetTextAtDate(tz, anchorDate) {
    if (!fixedTimeTableService || typeof fixedTimeTableService.getFixedTimeOffsetTextAtDate !== "function") {
        return "";
    }
    return fixedTimeTableService.getFixedTimeOffsetTextAtDate(tz, anchorDate);
}

function renderFixedTimeTable() {
    if (!fixedTimeTableService || typeof fixedTimeTableService.renderFixedTimeTable !== "function") return;
    fixedTimeTableService.renderFixedTimeTable();
}

function renderFixedTimeTab() {
    const group = getCurrentGroup();
    if (!group) return;
    ensureGroupFixedTimes(group);
    renderBaseTimeSelect();
    renderFixedTimeControls();
    renderFixedTimeTable();
}

// --- Clock Logic ---
function updateClocks() {
    if (isFixedTimeTab()) {
        renderFixedTimeTab();
        renderTimelineFrame();
        return;
    }

    if (isMultiTab()) {
        multiRangeRenderService.renderMultiRanges();
        renderTimelineFrame();
        return;
    }

    const baseRef = getBaseTimezoneRef();
    const utcRef = getUTCRef();
    updateRow(baseRef.id, baseRef);
    if (baseRef.id !== "utc") updateRow(utcRef.id, utcRef);
    const currentZones = getCurrentGroupZones().filter(tz => tz.id !== baseRef.id);
    currentZones.forEach(tz => updateRow(tz.id, tz));
    if (showCopyFormat) {
        updateCopyFormatPreview();
    }
    renderTimelineFrame();
}

function getRowViewState(row) {
    const rowId = String(row?.id || "");
    const cached = rowId ? rowViewCache.get(rowId) : null;
    if (cached && cached.row === row) return cached;

    const state = {
        row,
        zoneCodeEl: row.querySelector(".zone-code"),
        offsetTextEl: row.querySelector(".offset-text"),
        periodEl: row.querySelector(".period-days-text"),
        periodTimeEl: row.querySelector(".period-time-text"),
        slotInputs: new Map(),
        slotDayBadges: new Map(),
        slotDnIcons: new Map()
    };

    if (rowId) {
        if (rowViewCache.size >= MAX_RUNTIME_CACHE_SIZE) rowViewCache.clear();
        rowViewCache.set(rowId, state);
    }
    return state;
}

function getSlotElementsForRow(rowViewState, slotIdx) {
    let inputs = rowViewState.slotInputs.get(slotIdx);
    if (!inputs) {
        inputs = [...rowViewState.row.querySelectorAll(`.time-input[data-slot="${slotIdx}"]`)];
        rowViewState.slotInputs.set(slotIdx, inputs);
    }

    let dayBadges = rowViewState.slotDayBadges.get(slotIdx);
    if (!dayBadges) {
        dayBadges = [...rowViewState.row.querySelectorAll(`.day-slot-${slotIdx}`)];
        rowViewState.slotDayBadges.set(slotIdx, dayBadges);
    }

    let dnIcons = rowViewState.slotDnIcons.get(slotIdx);
    if (!dnIcons) {
        dnIcons = [...rowViewState.row.querySelectorAll(`.dn-slot-${slotIdx}`)];
        rowViewState.slotDnIcons.set(slotIdx, dnIcons);
    }

    return { inputs, dayBadges, dnIcons };
}

function updateRow(id, tz) {
    const row = document.getElementById(`tz-row-${id}`);
    if (!row) return;

    const snapshot = snapshotFormatService.buildTimezoneComputedSnapshot(id);
    if (!snapshot) return;

    const rowViewState = getRowViewState(row);
    if (rowViewState.zoneCodeEl) rowViewState.zoneCodeEl.textContent = snapshot.timezone;
    if (rowViewState.offsetTextEl) rowViewState.offsetTextEl.textContent = snapshot.offset;

    const dayNames = I18N_DATA[currentLang]?.days || I18N_DATA.en?.days || [];
    const sunName = dayNames[0] || "";
    const satName = dayNames[6] || "";
    const effectiveSlotCount = isRealtime ? 1 : slotCount;
    for (let i = 0; i < effectiveSlotCount; i++) {
        const timeStr = snapshot.times[i] || "";
        const dateStr = snapshot.dates[i] || "";
        const clockStr = snapshot.clocks[i] || "";
        const dayStr = snapshot.dayNames[i] || "";
        const dayNightStatus = snapshot.dayNightIcons[i] || "DAY";
        const dayNightMarker = normalizeDayNightMarker(dayNightStatus);
        const dayNightGlyph = getDayNightGlyph(dayNightStatus);
        const { inputs, dayBadges, dnIcons } = getSlotElementsForRow(rowViewState, i);

        inputs.forEach(input => {
            const inputMode = input.dataset.inputMode || "datetime";
            let nextValue = timeStr;
            if (inputMode === "date") nextValue = dateStr;
            else if (inputMode === "time") nextValue = clockStr;
            else if (inputMode === "none") nextValue = "";
            if (document.activeElement !== input) {
                input.value = nextValue;
            }
        });

        dayBadges.forEach(dayBadge => {
            dayBadge.textContent = dayStr;
            const isSun = dayStr === sunName;
            const isSat = dayStr === satName;
            dayBadge.className = "day-badge day-slot-" + i + (isSun ? " day-sun" : (isSat ? " day-sat" : ""));
        });

        dnIcons.forEach(dnIcon => {
            dnIcon.textContent = dayNightGlyph;
            if (dayNightMarker === "DAY") dnIcon.title = t("dn_day");
            else if (dayNightMarker === "NIGHT") dnIcon.title = t("dn_night");
            else dnIcon.title = "";
        });
    }

    if (rowViewState.periodEl) {
        rowViewState.periodEl.textContent = snapshot.periodDays || "-";
    }

    if (rowViewState.periodTimeEl) {
        rowViewState.periodTimeEl.textContent = snapshot.periodTime || "-";
    }
}

function resolveLocalDatePartsByTimezoneAtDate(timezone, utcDate, timezoneId = null) {
    return timeInputMutationsService.resolveLocalDatePartsByTimezoneAtDate(timezone, utcDate, timezoneId);
}

function resolveLocalDatePartsByTimezone(timezone, slotIdx, timezoneId = null) {
    return timeInputMutationsService.resolveLocalDatePartsByTimezone(timezone, slotIdx, timezoneId);
}

function buildStrictUtcDateFromParts(parts) {
    return timeInputMutationsService.buildStrictUtcDateFromParts(parts);
}

function handleTimeChange(val, timezone, slotIdx, timezoneId = null, inputMode = "datetime") {
    return timeInputMutationsService.handleTimeChange(val, timezone, slotIdx, timezoneId, inputMode);
}

function handleMultiRangeTimeChange(rangeIdx, val, timezone, slotIdx, timezoneId = null, inputMode = "datetime") {
    return timeInputMutationsService.handleMultiRangeTimeChange(
        rangeIdx,
        val,
        timezone,
        slotIdx,
        timezoneId,
        inputMode
    );
}

function createStandardTimezoneFromSelectableEntry(entry) {
    if (!entry || typeof entry !== "object") return null;
    return timezoneSearchService.createStandardTimezoneFromSelectableEntry(entry);
}

function addTimezone(tz) {
    const activeGroup = getCurrentGroup();
    if (!activeGroup) return;
    if (!tz || typeof tz !== "object") return;
    if (tz?.type === "standard" && !groupStateService.isValidTimeZone(tz.zone)) {
        showToast(t("toast_invalid_timezone"));
        return;
    }
    const requestedId = sanitizeTimezoneId(tz.id);
    const existingIds = new Set(
        activeGroup.zones
            .map((zone) => sanitizeTimezoneId(zone?.id))
            .filter(Boolean)
    );
    let nextId = requestedId;
    if (!nextId || existingIds.has(nextId)) {
        nextId = createUniqueTimezoneId(tz.type === "custom" ? "tz-c" : "tz");
    }
    activeGroup.zones.push({ ...tz, id: nextId });
    persistenceService.savePersistence();
    renderList();
    renderTimelineFrame();
}
function removeTimezone(id) {
    const activeGroup = getCurrentGroup();
    if (!activeGroup) return;
    if (id === getCurrentGroupBaseTimezoneId()) return;
    if (id === "utc") {
        activeGroup.showUtcRow = false;
        activeGroup.utcRowOrder = 0;
        persistenceService.savePersistence();
        renderList();
        renderTimelineFrame();
        return;
    }
    activeGroup.zones = activeGroup.zones.filter(z => z.id !== id);
    persistenceService.savePersistence();
    renderList();
    renderTimelineFrame();
}

function bindRowContainerDragAndDrop(container) {
    if (!container) return;

    let pendingClientY = 0;
    let reorderFrameId = null;
    const requestReorder = () => {
        if (reorderFrameId !== null) return;
        reorderFrameId = requestUiFrame(() => {
            reorderFrameId = null;
            const draggingRow = container.querySelector(".time-row.dragging");
            if (!draggingRow) return;

            const beforeRects = captureReorderableRowRects(container);
            const afterEl = getAfter(container, pendingClientY);
            if (afterEl === draggingRow || draggingRow.nextElementSibling === afterEl) return;
            container.insertBefore(draggingRow, afterEl);
            animateReorderTransition(container, beforeRects);
        });
    };

    container.ondragover = (e) => {
        const draggingRow = container.querySelector(".time-row.dragging");
        if (!draggingRow) return;
        e.preventDefault();
        pendingClientY = e.clientY;
        requestReorder();
    };

    container.ondrop = (e) => {
        const draggingRow = container.querySelector(".time-row.dragging");
        if (!draggingRow) return;
        e.preventDefault();
    };

    container.ondragleave = (e) => {
        if (!(e.relatedTarget instanceof Node) || !container.contains(e.relatedTarget)) {
            if (reorderFrameId !== null) {
                cancelUiFrame(reorderFrameId);
                reorderFrameId = null;
            }
        }
    };
}

function initDragAndDrop() {
    bindRowContainerDragAndDrop(document.getElementById("clocks-container"));
    bindRowContainerDragAndDrop(document.getElementById("fixed-time-body"));
}
function captureReorderableRowRects(container) {
    const rectMap = new Map();
    const rows = [...container.querySelectorAll(".time-row:not(.dragging):not(.static)")];
    rows.forEach((row) => {
        rectMap.set(row, row.getBoundingClientRect());
    });
    return rectMap;
}

function animateReorderTransition(container, beforeRects) {
    const rows = [...container.querySelectorAll(".time-row:not(.dragging):not(.static)")];
    rows.forEach((row) => {
        const prevRect = beforeRects.get(row);
        if (!prevRect) return;
        const nextRect = row.getBoundingClientRect();
        const deltaY = prevRect.top - nextRect.top;
        if (Math.abs(deltaY) < 1) return;

        row.style.transition = "none";
        row.style.transform = `translateY(${deltaY}px)`;
        requestUiFrame(() => {
            row.style.transition = "transform 170ms ease";
            row.style.transform = "";
        });
        row.addEventListener("transitionend", () => {
            row.style.transition = "";
        }, { once: true });
    });
}

function getAfter(container, y) {
    const rows = [...container.querySelectorAll(".time-row:not(.dragging):not(.static)")];
    return rows.reduce((closest, row) => {
        const rect = row.getBoundingClientRect();
        const offset = y - rect.top - rect.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset, element: row };
        }
        return closest;
    }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
}
function saveOrderForContainer(containerSelector) {
    const activeGroup = groups[activeGroupId];
    if (!activeGroup) return;
    const ids = [...document.querySelectorAll(`${containerSelector} .time-row:not(.static)`)].map(r => r.id.replace("tz-row-", ""));
    const zoneIds = ids.filter(id => id !== "utc");
    activeGroup.zones.sort((a, b) => {
        const idxA = zoneIds.indexOf(a.id);
        const idxB = zoneIds.indexOf(b.id);
        if (idxA < 0 || idxB < 0) return 0;
        return idxA - idxB;
    });
    if (getCurrentGroupBaseTimezoneId() !== "utc") {
        const utcIndex = ids.indexOf("utc");
        activeGroup.showUtcRow = utcIndex >= 0;
        if (utcIndex >= 0) activeGroup.utcRowOrder = utcIndex;
    } else {
        activeGroup.showUtcRow = true;
        activeGroup.utcRowOrder = 0;
    }
    persistenceService.savePersistence();
}

function saveOrder() {
    saveOrderForContainer("#clocks-container");
}

function saveFixedTimeOrder() {
    saveOrderForContainer("#fixed-time-body");
}

function formatTimeTextByParts(snapshot, timePartsEnabled) {
    const safeSnapshot = (snapshot && typeof snapshot === "object") ? snapshot : {};
    const safeTimeParts = (timePartsEnabled === undefined) ? DEFAULT_COPY_TIME_PARTS_ENABLED : timePartsEnabled;
    return snapshotFormatService.formatTimeTextByParts(safeSnapshot, safeTimeParts);
}

function formatSnapshotText(snapshot, order, enabled, timePartsEnabled = DEFAULT_COPY_TIME_PARTS_ENABLED) {
    const safeSnapshot = (snapshot && typeof snapshot === "object") ? snapshot : {};
    return snapshotFormatService.formatSnapshotText(safeSnapshot, order, enabled, timePartsEnabled);
}

function updateCopyFormatPreview() {
    copyActionsService.updateCopyFormatPreview();
}

async function copyAllTimezones() {
    return await copyActionsService.copyAllTimezones();
}

async function copyMultiRangeRow(rangeIdx, rowId) {
    if (!Number.isInteger(rangeIdx) || rangeIdx < 0) return false;
    if (typeof rowId !== "string" || !rowId.trim()) return false;
    return await multiRangeCopyService.copyMultiRangeRow(rangeIdx, rowId);
}

async function copyAllMultiRangeTimezones() {
    return await multiRangeCopyService.copyAllMultiRangeTimezones();
}

function sanitizeFilenamePart(value) {
    if (imageExportNamingService && typeof imageExportNamingService.sanitizeFilenamePart === "function") {
        return imageExportNamingService.sanitizeFilenamePart(value);
    }
    return String(value || "")
        .replace(/[\\/:*?"<>|]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function formatDateTimeByTimezone(date, tz) {
    if (imageExportNamingService && typeof imageExportNamingService.formatDateTimeByTimezone === "function") {
        return imageExportNamingService.formatDateTimeByTimezone(date, tz);
    }
    if (tz?.type === "custom") {
        const offsetMin = getCustomOffsetMinutes(tz);
        const shifted = new Date(date.getTime() + (offsetMin * 60000));
        return `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())} ${pad(shifted.getUTCHours())}:${pad(shifted.getUTCMinutes())}:${pad(shifted.getUTCSeconds())}`;
    }

    // Delegate timezone-local date conversion to GTVTimeService.
    const p = timeService.resolveLocalDateParts(date, tz?.zone || "UTC", tz?.id, null);
    return `${p.Y}-${pad(p.M)}-${pad(p.D)} ${pad(p.H)}:${pad(p.min)}:${pad(p.S)}`;
}

function getTimezoneTableImageFilename() {
    if (imageExportNamingService && typeof imageExportNamingService.getTimezoneTableImageFilename === "function") {
        return imageExportNamingService.getTimezoneTableImageFilename();
    }

    const baseRef = getBaseTimezoneRef();
    const groupName = sanitizeFilenamePart(groups[activeGroupId]?.name || t("default_group_name")) || "Group";
    const baseAbbr = sanitizeFilenamePart(getZoneAbbreviation(baseRef) || "UTC") || "UTC";
    const baseDateTime = formatDateTimeByTimezone(globalTimes[0], baseRef).trim();
    const m = baseDateTime.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
    const timePart = sanitizeFilenamePart(m ? `${m[1]} ${m[2]}${m[3]}${m[4]}` : baseDateTime.replace(/:/g, "")) || "time";

    return `${groupName}_${baseAbbr}_${timePart}`;
}

function getMultiRangeTableImageFilename(rangeIdx) {
    if (imageExportNamingService && typeof imageExportNamingService.getMultiRangeTableImageFilename === "function") {
        return imageExportNamingService.getMultiRangeTableImageFilename(rangeIdx);
    }
    const baseName = getTimezoneTableImageFilename();
    const subgroupName = multiStateService.sanitizeMultiSubgroupName(getCurrentMultiSubgroupName(), "subgroup");
    const rangeLabel = sanitizeFilenamePart(`${subgroupName} ${rangeIdx + 1}`) || `range_${rangeIdx + 1}`;
    return `${baseName}_${rangeLabel}.png`;
}

function getMultiRangeTitlesImageFilename() {
    if (imageExportNamingService && typeof imageExportNamingService.getMultiRangeTitlesImageFilename === "function") {
        return imageExportNamingService.getMultiRangeTitlesImageFilename();
    }
    const baseName = getTimezoneTableImageFilename();
    const titleLabel =
        sanitizeFilenamePart(multiStateService.sanitizeMultiSubgroupName(getCurrentMultiSubgroupName(), "subgroup")) || "range";
    return `${baseName}_${titleLabel}_titles.png`;
}

function collectDocumentCssText() {
    if (!imageExportBridgeService || typeof imageExportBridgeService.collectDocumentCssText !== "function") return "";
    return imageExportBridgeService.collectDocumentCssText();
}

function cloneTableForImageExport(tableEl) {
    if (!imageExportBridgeService || typeof imageExportBridgeService.cloneTableForImageExport !== "function") return null;
    return imageExportBridgeService.cloneTableForImageExport(tableEl);
}

function cloneMultiRangeBlockForImageExport(blockEl) {
    if (!imageExportBridgeService || typeof imageExportBridgeService.cloneMultiRangeBlockForImageExport !== "function") return null;
    return imageExportBridgeService.cloneMultiRangeBlockForImageExport(blockEl);
}

async function renderElementWithForeignObjectToPngDataUrl(renderElement) {
    if (!imageExportBridgeService || typeof imageExportBridgeService.renderElementWithForeignObjectToPngDataUrl !== "function") {
        throw new Error("Foreign-object renderer unavailable");
    }
    return await imageExportBridgeService.renderElementWithForeignObjectToPngDataUrl(renderElement);
}

function loadImageElement(src) {
    if (!imageExportBridgeService || typeof imageExportBridgeService.loadImageElement !== "function") {
        return Promise.reject(new Error("Image loader unavailable"));
    }
    return imageExportBridgeService.loadImageElement(src);
}

async function waitForDocumentFontsReady() {
    if (!imageExportBridgeService || typeof imageExportBridgeService.waitForDocumentFontsReady !== "function") return;
    await imageExportBridgeService.waitForDocumentFontsReady();
}

function isDomExceptionLike(err) {
    if (!imageExportBridgeService || typeof imageExportBridgeService.isDomExceptionLike !== "function") return false;
    return imageExportBridgeService.isDomExceptionLike(err);
}

async function detectForeignObjectRendererSupport() {
    if (!imageExportBridgeService || typeof imageExportBridgeService.detectForeignObjectRendererSupport !== "function") return false;
    return await imageExportBridgeService.detectForeignObjectRendererSupport();
}

function extractTableCellText(cell) {
    if (!imageExportBridgeService || typeof imageExportBridgeService.extractTableCellText !== "function") return "";
    return imageExportBridgeService.extractTableCellText(cell);
}

function extractTableHeaderText(cell) {
    if (!imageExportBridgeService || typeof imageExportBridgeService.extractTableHeaderText !== "function") return "";
    return imageExportBridgeService.extractTableHeaderText(cell);
}

function getActiveTableExportContext() {
    if (!imageExportBridgeService || typeof imageExportBridgeService.getActiveTableExportContext !== "function") {
        return {
            table: null,
            headerSelector: "#table-head th",
            rowSelector: "#clocks-container tr.time-row"
        };
    }
    return imageExportBridgeService.getActiveTableExportContext();
}

async function renderTimezoneTableFallbackDataUrl() {
    if (!imageExportBridgeService || typeof imageExportBridgeService.renderTimezoneTableFallbackDataUrl !== "function") {
        throw new Error("Timezone table fallback renderer unavailable");
    }
    return await imageExportBridgeService.renderTimezoneTableFallbackDataUrl();
}


async function renderTimezoneTableToPngDataUrl() {
    if (!imageExportBridgeService || typeof imageExportBridgeService.renderTimezoneTableToPngDataUrl !== "function") {
        throw new Error("Timezone table renderer unavailable");
    }
    return await imageExportBridgeService.renderTimezoneTableToPngDataUrl();
}

async function renderMultiRangesFallbackDataUrl(targetRangeIdx = null) {
    if (!imageExportBridgeService || typeof imageExportBridgeService.renderMultiRangesFallbackDataUrl !== "function") {
        throw new Error("Multi-range fallback renderer unavailable");
    }
    return await imageExportBridgeService.renderMultiRangesFallbackDataUrl(targetRangeIdx);
}

async function renderMultiRangesToPngDataUrl(targetRangeIdx = null) {
    if (!imageExportBridgeService || typeof imageExportBridgeService.renderMultiRangesToPngDataUrl !== "function") {
        throw new Error("Multi-range renderer unavailable");
    }
    return await imageExportBridgeService.renderMultiRangesToPngDataUrl(targetRangeIdx);
}

async function renderMultiRangeSingleToPngDataUrl(rangeIdx) {
    if (!imageExportBridgeService || typeof imageExportBridgeService.renderMultiRangeSingleToPngDataUrl !== "function") {
        throw new Error("Multi-range single renderer unavailable");
    }
    return await imageExportBridgeService.renderMultiRangeSingleToPngDataUrl(rangeIdx);
}

async function renderMultiRangeTitlesToPngDataUrl() {
    if (!imageExportBridgeService || typeof imageExportBridgeService.renderMultiRangeTitlesToPngDataUrl !== "function") {
        throw new Error("Multi-range title renderer unavailable");
    }
    return await imageExportBridgeService.renderMultiRangeTitlesToPngDataUrl();
}

async function saveTimezoneTableImage() {
    if (!imageExportBridgeService || typeof imageExportBridgeService.saveTimezoneTableImage !== "function") return;
    return await imageExportBridgeService.saveTimezoneTableImage();
}

async function saveMultiRangeTitlesImage() {
    if (!imageExportBridgeService || typeof imageExportBridgeService.saveMultiRangeTitlesImage !== "function") return;
    return await imageExportBridgeService.saveMultiRangeTitlesImage();
}

async function saveMultiRangeSingleImage(rangeIdx) {
    if (!imageExportBridgeService || typeof imageExportBridgeService.saveMultiRangeSingleImage !== "function") return;
    return await imageExportBridgeService.saveMultiRangeSingleImage(rangeIdx);
}

function getImageExportDeps() {
    if (!imageExportBridgeService || typeof imageExportBridgeService.getImageExportDeps !== "function") return {};
    return imageExportBridgeService.getImageExportDeps();
}

function initCalculators() {
    if (!calculatorActionsService || typeof calculatorActionsService.initCalculators !== "function") return;
    calculatorActionsService.initCalculators();
}

async function copyText(elementId, isInput = false) {
    if (!calculatorActionsService || typeof calculatorActionsService.copyText !== "function") return;
    return await calculatorActionsService.copyText(elementId, isInput);
}

function getPersistenceSnapshot() {
    currentMainTab = sanitizeMainTab(currentMainTab);
    syncActiveFormatProfileFromState();
    syncCurrentMultiStateToActiveSubgroup();
    if (currentMainTab === "live" || currentMainTab === "fixed") {
        activeGroupIdByMainTab[currentMainTab] = activeGroupId;
    }
    normalizeGroupTabState();
    ensureMultiRangeState();
    groups.forEach((group) => {
        ensureGroupFixedTimes(group);
        multiStateService.ensureGroupMultiSubgroups(group);
    });
    formatProfiles = sanitizeFormatProfiles(formatProfiles, getCurrentFormatProfileState());

    return {
        groups,
        activeGroupId,
        currentMainTab,
        activeGroupIdByMainTab,
        slotCount,
        baseTimezoneId: getCurrentGroupBaseTimezoneId(),
        showCopyFormat,
        showTimeline,
        displayFormatOrder: sanitizeCopyFormatOrder(displayFormatOrder),
        displayFormatEnabled: sanitizeCopyFormatEnabled(displayFormatEnabled, "display"),
        displayTimePartsEnabled: sanitizeTimePartsEnabled(displayTimePartsEnabled, "display"),
        copyFormatOrder: sanitizeCopyFormatOrder(copyFormatOrder),
        copyFormatEnabled: sanitizeCopyFormatEnabled(copyFormatEnabled, "copy"),
        copyTimePartsEnabled: sanitizeTimePartsEnabled(copyTimePartsEnabled, "copy"),
        formatProfiles,
        activeFormatProfileContext,
        timeAdjustDayStepBySlot: [
            getTimeAdjustDayStep(0),
            getTimeAdjustDayStep(1)
        ],
        multiRangeCount: sanitizeMultiRangeCount(multiRangeCount),
        multiRangeTitle: sanitizeMultiRangeTitle(getCurrentMultiSubgroupName()),
        multiRanges: multiRanges.map((range) => ({
            startUtcMs: GTV_TIME_CORE.sanitizeUtcMs(range.startUtcMs, Date.now()),
            endUtcMs: GTV_TIME_CORE.sanitizeUtcMs(range.endUtcMs, Date.now())
        })),
        multiRangeCollapsed: multiRangeCollapsed.map((flag) => !!flag),
        multiRangeStartEditEnabled: multiRangeStartEditEnabled.map((flag) => !!flag),
        multiRangeEndEditEnabled: multiRangeEndEditEnabled.map((flag) => !!flag)
    };
}

function sanitizeGroup(group, idx, legacyMultiState = null) {
    if (!group || typeof group !== "object") return null;
    const safeIdx = Number.isInteger(idx) && idx >= 0 ? idx : 0;
    return groupStateService.sanitizeGroup(group, safeIdx, legacyMultiState);
}

async function loadPersistence() {
    return await persistenceService.loadPersistence();
}

// --- End of main.js ---






