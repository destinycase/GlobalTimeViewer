
// --- File: i18n.js ---
const EN_I18N = {
    app_title: "Global Time v3.8.1",
    nav_live: "Realtime",
    nav_fixed: "Time Edit",
    nav_multi: "Continuous Time Edit",
    nav_calc: "Calculator",
    status_sync: "Real-time sync",
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
    tooltip_timeline_view_desc: "Shows a box timeline in Realtime and Time Edit tabs.",
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
    btn_copy_all: "📋 Copy All",
    btn_save_table_image: "🖼️ Save Image",
    btn_save_image_tz: "🖼️ Save Image",
    btn_save_image_range: "🖼️ Save Image - Range",
    btn_save_multi_titles_image: "🖼️ Save Image - Titles",
    btn_save_multi_by_range_image: "🖼️ Save Image - All",
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
    calc_unix_title: "Unix Timestamp Converter",
    calc_unix_current: "Current Unix Timestamp",
    calc_unix_sync_now: "Now",
    calc_unix_ts_to_date: "Timestamp -> Date",
    calc_unix_date_to_ts: "Date -> Timestamp",
    calc_unix_invalid: "Invalid timestamp",
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
    toast_invalid_format: "Invalid data format.",

    confirm_delete_group: "Are you sure you want to delete this group?",
    confirm_delete_subgroup: "Are you sure you want to delete this aux group?",
    confirm_reset_except_group_tz: "Reset all settings except saved groups and timezones. Continue?",
    confirm_reset_all_settings: "Saved groups, timezones, and all settings will be reset to defaults. Continue?"
};

const KO_OVERRIDES = {
    app_title: "Global Time v3.8.1",
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
    tooltip_timeline_view_desc: "실시간/시간 변경 탭에 박스 타임라인을 표시합니다.",
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
    calc_unix_title: "Unix 타임스탬프 변환기",
    calc_unix_current: "현재 Unix 타임스탬프",
    calc_unix_sync_now: "지금",
    calc_unix_ts_to_date: "타임스탬프 -> 날짜",
    calc_unix_date_to_ts: "날짜 -> 타임스탬프",
    calc_unix_invalid: "유효하지 않은 타임스탬프",
    calc_coming_soon_title: "새로운 기능 준비 중 (Coming Soon)",
    calc_coming_soon_desc: "Global Time은 더 편리한 시간 계산 기능을 준비하고 있습니다. 원하시는 기능이 있다면 의견을 남겨주세요.",

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
    confirm_reset_all_settings: "저장된 그룹/시간대/모든 설정을 초기값으로 되돌립니다. 계속할까요?"
};

const I18N_DATA = {
    ko: { ...EN_I18N, ...KO_OVERRIDES },
    en: { ...EN_I18N }
};

let currentLang = localStorage.getItem("GTV_Lang") || "ko";
if (!I18N_DATA[currentLang]) {
    currentLang = "ko";
}

function setLanguage(lang) {
    if (!I18N_DATA[lang]) return;
    currentLang = lang;
    localStorage.setItem("GTV_Lang", lang);
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

// --- File: js/modules/app-config.js ---
(function initGtvAppConfig(globalObj) {
    "use strict";

    const APP_CONFIG = Object.freeze({
        VERSION: "3.8.1",
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

// --- File: js/modules/date-picker.js ---
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
        return String(Math.abs(v)).padStart(2, "0");
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
        getCustomOffsetMinutes
    });

    globalObj.GTVTimeCore = api;
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/calculator.js ---
(function initGtvCalculator(globalObj) {
    "use strict";

    const COUNTDOWN_SLOT_COUNT = 3;
    const COUNTDOWN_STORAGE_KEY = "GTV_CalcCountdown_v1";

    let countdownState = [];
    let countdownTimerId = null;
    let unixTimerId = null;

    function pad2(value) {
        return String(Math.max(0, Math.trunc(value))).padStart(2, "0");
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
        const secIn = document.getElementById("conv-sec");
        const minIn = document.getElementById("conv-min");
        const hourIn = document.getElementById("conv-hour");
        const dayIn = document.getElementById("conv-day");
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
        copyBindings.forEach(([btnId, targetId, isInput]) => {
            const btn = document.getElementById(btnId);
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
            const raw = localStorage.getItem(COUNTDOWN_STORAGE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : null;
        } catch (err) {
            return null;
        }
    }

    function saveCountdownState() {
        try {
            localStorage.setItem(COUNTDOWN_STORAGE_KEY, JSON.stringify(countdownState));
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

            if (window.CustomDatePicker && !targetInput._cdp) {
                targetInput._cdp = new CustomDatePicker(targetInput, {
                    type: "datetime",
                    lang: document.documentElement.lang || "en",
                    theme: document.documentElement.getAttribute("data-theme") || "dark",
                    triggerElement: document.querySelector(`.trigger-cd-${slotIdx}`) || null
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
        const nameButtons = Array.from(document.querySelectorAll(".countdown-name-btn"));
        const nameInputs = Array.from(document.querySelectorAll(".countdown-name-input"));
        const toggleButtons = Array.from(document.querySelectorAll(".countdown-toggle-btn"));
        const targetInputs = Array.from(document.querySelectorAll(".countdown-target-input"));
        const displayEls = Array.from(document.querySelectorAll(".countdown-display"));
        const statusEls = Array.from(document.querySelectorAll(".countdown-status"));
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

        document.querySelectorAll(".countdown-slot-controls .sm-btn[data-action]").forEach((btn) => {
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
        const unixNowValue = document.getElementById("unix-now-value");
        const unixSyncNowBtn = document.getElementById("unix-sync-now-btn");
        const unixTsInput = document.getElementById("unix-ts-input");
        const unixTsDateOut = document.getElementById("unix-ts-date-out");
        const unixDateInput = document.getElementById("unix-date-input");
        const unixDateTsOut = document.getElementById("unix-date-ts-out");

        if (!unixNowValue || !unixTsInput || !unixTsDateOut || !unixDateInput || !unixDateTsOut) {
            return { refresh: () => { } };
        }

        if (window.CustomDatePicker && !unixDateInput._cdp) {
            unixDateInput._cdp = new CustomDatePicker(unixDateInput, {
                type: "datetime",
                lang: document.documentElement.lang || "en",
                theme: document.documentElement.getAttribute("data-theme") || "dark",
                triggerElement: document.getElementById("unix-date-input-trigger") || null
            });
        }

        const updateNow = () => {
            unixNowValue.textContent = String(Math.floor(Date.now() / 1000));
        };

        const updateFromTimestamp = () => {
            const raw = String(unixTsInput.value || "").trim();
            if (!raw) {
                unixTsDateOut.textContent = "-";
                return;
            }

            const sec = Number(raw);
            if (!Number.isFinite(sec)) {
                unixTsDateOut.textContent = t("calc_unix_invalid");
                return;
            }

            const dateObj = new Date(sec * 1000);
            if (Number.isNaN(dateObj.getTime())) {
                unixTsDateOut.textContent = t("calc_unix_invalid");
                return;
            }
            unixTsDateOut.textContent = formatUTCDateTime(dateObj);
        };

        const updateFromDate = () => {
            const parsed = unixDateInput._cdp && unixDateInput._cdp.selectedDate ? new Date(unixDateInput._cdp.selectedDate) : toValidDate(unixDateInput.value);
            if (!parsed) {
                unixDateTsOut.textContent = "-";
                return;
            }
            unixDateTsOut.textContent = String(Math.floor(parsed.getTime() / 1000));
        };

        const syncNow = () => {
            const nowDate = new Date();
            unixTsInput.value = String(Math.floor(nowDate.getTime() / 1000));
            unixDateInput.value = formatUTCDateTime(nowDate);
            updateFromTimestamp();
            updateFromDate();
        };

        unixTsInput.addEventListener("input", updateFromTimestamp);
        unixTsInput.addEventListener("change", updateFromTimestamp);
        unixDateInput.addEventListener("input", updateFromDate);
        unixDateInput.addEventListener("change", updateFromDate);
        if (unixSyncNowBtn) unixSyncNowBtn.addEventListener("click", syncNow);

        if (unixTimerId != null) {
            clearInterval(unixTimerId);
            unixTimerId = null;
        }
        unixTimerId = setInterval(updateNow, 1000);

        updateNow();
        updateFromTimestamp();
        updateFromDate();

        return {
            refresh() {
                updateNow();
                updateFromTimestamp();
                updateFromDate();
            }
        };
    }

    function initPeriodAndDateShift(t) {
        const periodStart = document.getElementById("period-start");
        const periodEnd = document.getElementById("period-end");
        const periodSwapBtn = document.getElementById("period-swap-btn");
        const periodDayRes = document.getElementById("period-res");
        const periodHourRes = document.getElementById("period-hour-res");
        const periodMinRes = document.getElementById("period-min-res");
        const periodSecRes = document.getElementById("period-sec-res");

        const offsetStart = document.getElementById("offset-start");
        const offsetValueInput = document.getElementById("off-val");
        const offValMinus = document.getElementById("off-val-minus");
        const offValPlus = document.getElementById("off-val-plus");
        const offsetUnit = document.getElementById("off-unit");
        const offsetDirection = document.getElementById("off-dir");
        const offsetResult = document.getElementById("offset-res");

        if (
            !periodStart || !periodEnd || !periodDayRes || !periodHourRes || !periodMinRes || !periodSecRes ||
            !offsetStart || !offsetValueInput || !offsetUnit || !offsetDirection || !offsetResult
        ) {
            return { refresh: () => { } };
        }

        const applyPicker = (el, iconId) => {
            if (window.CustomDatePicker && !el._cdp) {
                el._cdp = new CustomDatePicker(el, {
                    type: "date",
                    lang: document.documentElement.lang || "en",
                    theme: document.documentElement.getAttribute("data-theme") || "dark",
                    triggerElement: document.getElementById(iconId) || null
                });
            }
        };

        applyPicker(periodStart, "period-start-trigger");
        applyPicker(periodEnd, "period-end-trigger");
        applyPicker(offsetStart, "offset-start-trigger");

        const today = new Date();
        const todayText = formatDateOnly(today);
        if (!periodStart.value) periodStart.value = todayText;
        if (!periodEnd.value) periodEnd.value = todayText;
        if (!offsetStart.value) offsetStart.value = todayText;
        if (!offsetValueInput.value) offsetValueInput.value = "1";
        if (!offsetUnit.value) offsetUnit.value = "day";
        if (!offsetDirection.value) offsetDirection.value = "after";

        const setPeriodResult = (el, value) => {
            el.textContent = `${value}`;
        };

        const getPickerDate = (el) => {
            if (el._cdp && el._cdp.selectedDate) return new Date(el._cdp.selectedDate);
            if (el.value) return new Date(el.value + 'T00:00:00');
            return null;
        };

        const updateAll = () => {
            const startD = getPickerDate(periodStart);
            const endD = getPickerDate(periodEnd);

            if (startD && endD) {
                const diffMs = endD.getTime() - startD.getTime();
                setPeriodResult(periodDayRes, Math.round(diffMs / 86400000));
                setPeriodResult(periodHourRes, Math.round(diffMs / 3600000));
                setPeriodResult(periodMinRes, Math.round(diffMs / 60000));
                setPeriodResult(periodSecRes, Math.round(diffMs / 1000));
            } else {
                setPeriodResult(periodDayRes, 0);
                setPeriodResult(periodHourRes, 0);
                setPeriodResult(periodMinRes, 0);
                setPeriodResult(periodSecRes, 0);
            }

            const offStartD = getPickerDate(offsetStart);
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
                const startValue = periodStart.value;
                periodStart.value = periodEnd.value;
                periodEnd.value = startValue;
                updateAll();
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
            ["copy-unix-ts-date-btn", "unix-ts-date-out", false],
            ["copy-unix-date-ts-btn", "unix-date-ts-out", false]
        ]);

        if (typeof globalObj !== "undefined") {
            globalObj.__gtvCalcRefresh = () => {
                periodAndShift.refresh();
                countdown.refresh();
                unixConverter.refresh();

                const currentLang = document.documentElement.lang || "en";
                const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
                document.querySelectorAll(".custom-date-picker-input").forEach(el => {
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

// --- File: js/modules/multi-state.js ---
(function initGtvMultiState(globalObj) {
    "use strict";

    function createService(deps) {
        let multiSubgroupIdSeed = 0;

        function sanitizeMultiSubgroupId(value) {
            return (typeof value === "string" && value.trim()) ? value.trim() : "";
        }

        function sanitizeMultiSubgroupName(value, fallback = "") {
            const trimmed = (typeof value === "string" ? value : "").trim();
            if (trimmed) return trimmed.slice(0, 60);
            const fallbackTrimmed = (typeof fallback === "string" ? fallback : "").trim();
            if (fallbackTrimmed) return fallbackTrimmed.slice(0, 60);
            return deps.t("default_subgroup_name");
        }

        function getDefaultMultiSubgroupName(index = 0) {
            const base = deps.t("default_subgroup_name");
            return `${base} ${index + 1}`;
        }

        function getUsedMultiSubgroupIds() {
            const usedIds = new Set();
            const groups = deps.getGroups();
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
            const defaults = deps.getDefaultMultiRangeBounds();
            const fallback = fallbackState && typeof fallbackState === "object"
                ? fallbackState
                : {
                    multiRangeCount: deps.MIN_MULTI_RANGE_COUNT,
                    multiRanges: [{ startUtcMs: defaults.startMs, endUtcMs: defaults.endMs }],
                    multiRangeCollapsed: [],
                    multiRangeStartEditEnabled: [],
                    multiRangeEndEditEnabled: []
                };

            const nextCount = deps.sanitizeMultiRangeCount(rawState?.multiRangeCount ?? fallback.multiRangeCount);
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
                .map((item) => deps.sanitizeMultiRangeItem(item, defaults.startMs, defaults.endMs))
                .slice(0, nextCount);
            if (!nextRanges.length) {
                const fallbackRange = deps.sanitizeMultiRangeItem(sourceRanges[0], defaults.startMs, defaults.endMs);
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

            nextRanges[0].startUtcMs = deps.sanitizeUtcMs(nextRanges[0].startUtcMs, defaults.startMs);
            nextRanges[0].endUtcMs = deps.sanitizeUtcMs(nextRanges[0].endUtcMs, defaults.endMs);
            for (let i = 1; i < nextRanges.length; i++) {
                nextRanges[i].startUtcMs = deps.sanitizeUtcMs(nextRanges[i].startUtcMs, nextRanges[i - 1].endUtcMs);
                if (!nextStartEditEnabled[i]) {
                    nextRanges[i].startUtcMs = nextRanges[i - 1].endUtcMs;
                }
                nextRanges[i].endUtcMs = deps.sanitizeUtcMs(nextRanges[i].endUtcMs, nextRanges[i].startUtcMs);
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

    function downloadDataUrl(dataUrl, filename) {
        return new Promise((resolve, reject) => {
            if (typeof chrome !== "undefined" && chrome.downloads?.download) {
                chrome.downloads.download(
                    { url: dataUrl, filename, saveAs: false },
                    (downloadId) => {
                        if (chrome.runtime?.lastError || !downloadId) {
                            try {
                                const anchor = document.createElement("a");
                                anchor.href = dataUrl;
                                anchor.download = filename;
                                document.body.appendChild(anchor);
                                anchor.click();
                                anchor.remove();
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
                const anchor = document.createElement("a");
                anchor.href = dataUrl;
                anchor.download = filename;
                document.body.appendChild(anchor);
                anchor.click();
                anchor.remove();
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    async function saveMultiRangeTitlesImage(deps) {
        try {
            if (!deps.isMultiTab()) return;
            deps.showToast(deps.t("toast_table_image_generating"), { type: "loading" });
            deps.ensureMultiRangeState();
            const dataUrl = await deps.renderMultiRangeTitlesToPngDataUrl();
            await downloadDataUrl(dataUrl, deps.getMultiRangeTitlesImageFilename());
            deps.showToast(deps.t("toast_table_image_saved"), { type: "success" });
        } catch (err) {
            console.error("Failed to save multi-range titles image:", err);
            deps.showToast(`${deps.t("toast_table_image_failed")}\n(${err.message || err})`, { type: "error", duration: 5000 });
        }
    }

    async function saveMultiRangeAllImage(deps) {
        try {
            deps.showToast(deps.t("toast_table_image_generating"), { type: "loading" });
            const dataUrl = await deps.renderMultiRangesToPngDataUrl();
            const filename = `GlobalTime_MultiRanges_All_${Date.now()}.png`;
            await downloadDataUrl(dataUrl, filename);
            deps.showToast(deps.t("toast_table_image_saved"), { type: "success" });
        } catch (err) {
            console.error("Failed to save all multi-range images:", err);
            deps.showToast(`${deps.t("toast_table_image_failed")}\n(${err.message || err})`, { type: "error", duration: 5000 });
        }
    }

    async function saveMultiRangeSingleImage(deps, rangeIdx) {
        try {
            deps.showToast(deps.t("toast_table_image_generating"), { type: "loading" });
            const dataUrl = await deps.renderMultiRangeSingleToPngDataUrl(rangeIdx);
            const filename = `GlobalTime_MultiRange_Range_${rangeIdx + 1}_${Date.now()}.png`;
            await downloadDataUrl(dataUrl, filename);
            deps.showToast(deps.t("toast_table_image_saved"), { type: "success" });
        } catch (err) {
            console.error("Failed to save single multi-range image:", err);
            deps.showToast(`${deps.t("toast_table_image_failed")}\n(${err.message || err})`, { type: "error", duration: 5000 });
        }
    }

    async function saveTimezoneTableImage(deps) {
        if (deps.isMultiTab()) {
            await saveMultiRangeAllImage(deps);
            return;
        }

        try {
            deps.showToast(deps.t("toast_table_image_generating"), { type: "loading" });
            const supportsPrimaryRenderer = await deps.detectForeignObjectRendererSupport();
            const wantsTimelineCapture = (typeof deps.isTimelineVisible === "function") ? deps.isTimelineVisible() : false;
            let dataUrl = "";
            if (supportsPrimaryRenderer || wantsTimelineCapture) {
                try {
                    dataUrl = await deps.renderTimezoneTableToPngDataUrl();
                } catch (primaryErr) {
                    if (deps.isDomExceptionLike(primaryErr)) {
                        deps.setCanUseForeignObjectRenderer(false);
                    }
                    dataUrl = await deps.renderTimezoneTableFallbackDataUrl();
                }
            } else {
                dataUrl = await deps.renderTimezoneTableFallbackDataUrl();
            }
            const filename = `${deps.getTimezoneTableImageFilename()}.png`;
            await downloadDataUrl(dataUrl, filename);
            deps.showToast(deps.t("toast_table_image_saved"), { type: "success" });
        } catch (err) {
            console.error("Failed to save timezone table image:", err);
            deps.showToast(`${deps.t("toast_table_image_failed")}\n(${err.message || err})`, { type: "error", duration: 5000 });
        }
    }


    globalObj.GTVImageExport = Object.freeze({
        downloadDataUrl,
        saveMultiRangeTitlesImage,
        saveMultiRangeAllImage,
        saveMultiRangeSingleImage,
        saveTimezoneTableImage
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/group-state.js ---
(function initGtvGroupState(globalObj) {
    "use strict";

    function createService(deps) {
        const timeZoneValidationCache = new Map();

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
            const requestedId = deps.sanitizeTimezoneId(zone.id);
            const fallbackPrefix = zoneType === "custom" ? "tz-c" : "tz";
            const id = requestedId || deps.createUniqueTimezoneId(fallbackPrefix);
            if (!id) return null;

            if (zoneType === "custom") {
                const offH = parseInt(zone.offH, 10);
                const offM = parseInt(zone.offM, 10);
                return {
                    id,
                    type: "custom",
                    abbr: deps.normalizeCustomAbbr(zone.abbr),
                    name: (typeof zone.name === "string" && zone.name.trim()) ? zone.name.trim() : deps.t("label_custom"),
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
            const fixedAbbr = deps.normalizeZoneAbbreviation(zone.fixedAbbr);
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
                let zoneId = deps.sanitizeTimezoneId(zone.id);
                if (!zoneId || seenZoneIds.has(zoneId)) {
                    const prefix = zone.type === "custom" ? "tz-c" : "tz";
                    do {
                        zoneId = deps.createUniqueTimezoneId(prefix);
                    } while (!zoneId || seenZoneIds.has(zoneId));
                }
                zone.id = zoneId;
                seenZoneIds.add(zoneId);
            });

            const name = (typeof group.name === "string" && group.name.trim()) ? group.name.trim() : `${deps.t("default_group_name")} ${idx + 1}`;
            let requestedBaseTimezoneId = deps.sanitizeBaseTimezoneId(group.baseTimezoneId);
            if (requestedBaseTimezoneId !== "utc") {
                const baseIsLegacyUtcZone = rawZones.some((zone) => zone.id === requestedBaseTimezoneId && zone.type === "standard" && zone.zone === "UTC");
                if (baseIsLegacyUtcZone) requestedBaseTimezoneId = "utc";
            }
            const isBaseTimezoneValid = requestedBaseTimezoneId === "utc" || zones.some((zone) => zone.id === requestedBaseTimezoneId);
            const hasLegacyUtcZone = rawZones.length !== zones.length;
            const showUtcRow = hasLegacyUtcZone ? true : (typeof group.showUtcRow === "boolean" ? group.showUtcRow : true);
            const utcRowOrder = deps.sanitizeUtcRowOrder(group.utcRowOrder);
            const rawMultiSubgroups = Array.isArray(group.multiSubgroups) ? group.multiSubgroups : [];
            const multiSubgroups = rawMultiSubgroups.map((subgroup) => ({
                id: deps.sanitizeMultiSubgroupId(subgroup?.id),
                name: subgroup?.name,
                multiRangeCount: subgroup?.multiRangeCount,
                multiRanges: subgroup?.multiRanges,
                multiRangeCollapsed: subgroup?.multiRangeCollapsed,
                multiRangeStartEditEnabled: subgroup?.multiRangeStartEditEnabled,
                multiRangeEndEditEnabled: subgroup?.multiRangeEndEditEnabled
            }));
            const activeMultiSubgroupId = deps.sanitizeMultiSubgroupId(group.activeMultiSubgroupId);
            const sanitizedGroup = {
                name,
                zones,
                baseTimezoneId: isBaseTimezoneValid ? requestedBaseTimezoneId : "utc",
                showUtcRow,
                utcRowOrder,
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

            deps.ensureGroupMultiSubgroups(sanitizedGroup, { legacyMultiState: groupLegacyMultiState || legacyMultiState });
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

// --- File: js/modules/group-tabs.js ---
(function initGtvGroupTabs(globalObj) {
    "use strict";

    function createService(deps) {
        function getState() {
            return deps.getState();
        }

        function setState(next) {
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
            } else {
                deps.renderList();
            }
        }

        function activateGroupTab(idx) {
            const state = getState();
            if (idx === state.activeGroupId) return;
            deps.syncCurrentMultiStateToActiveSubgroup();
            setState({ activeGroupId: idx });
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
                utcRowOrder: 0
            };
            deps.ensureGroupMultiSubgroups(nextGroup);

            const state = getState();
            const nextGroups = [...state.groups, nextGroup];
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
            const group = state.groups[idx];
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
            if (state.groups.length <= 1) {
                deps.showToast(deps.t("toast_group_min"));
                return;
            }
            if (!confirm(deps.t("confirm_delete_group"))) return;

            deps.syncCurrentMultiStateToActiveSubgroup();
            const nextGroups = [...state.groups];
            nextGroups.splice(idx, 1);
            const nextActiveGroupId = Math.max(0, state.activeGroupId - 1);
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

            groups.forEach((group, idx) => {
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
        let standardTimezoneEntriesCache = null;
        let standardTimezoneEntriesCacheYear = null;
        let standardTimezoneWarmupQueued = false;
        let fullTimezoneOverlayStandardEntries = [];
        let fullTimezoneOverlayCountryEntries = [];
        let fullTimezoneOverlayActiveTab = "standard";

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
                const janOffset = deps.getTimezoneOffset(safeZone, jan);
                const julOffset = deps.getTimezoneOffset(safeZone, jul);
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
            deps.TZ_DATABASE.forEach((tzData) => {
                if (tzData?.zone) fallback.add(tzData.zone);
            });
            return [...fallback];
        }

        function getSortedTZData(list) {
            const locale = deps.getCurrentLang() === "en" ? "en-US" : "ko-KR";
            return [...list].sort((a, b) =>
                deps.getLocalizedTZLabel(a).localeCompare(deps.getLocalizedTZLabel(b), locale, { sensitivity: "base", numeric: true })
            );
        }

        function getSelectableTZEntries() {
            const entries = [];
            const zoneMap = (typeof deps.getZoneMap === "function" ? deps.getZoneMap() : deps.ZONE_MAP) || {};
            getSortedTZData(deps.TZ_DATABASE).forEach((tzData) => {
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
                    : normalizeZoneAbbreviation(mapping || deps.getBetterAbbr(tzData.zone, new Date()));
                entries.push({
                    ...tzData,
                    kind: "country_region",
                    key: `${tzData.zone}|auto`,
                    abbr: baseAbbr || normalizeZoneAbbreviation(deps.getBetterAbbr(tzData.zone, new Date())),
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
                const janOffset = deps.getTimezoneOffset(zone, janDate);
                const julOffset = deps.getTimezoneOffset(zone, julDate);
                if (!Number.isFinite(janOffset) || !Number.isFinite(julOffset)) return;

                const janAbbr = normalizeZoneAbbreviation(deps.getBetterAbbr(zone, janDate)) || formatUtcOffsetLabel(janOffset);
                const julAbbr = normalizeZoneAbbreviation(deps.getBetterAbbr(zone, julDate)) || formatUtcOffsetLabel(julOffset);

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
                return deps.getCurrentLang() === "en" ? `${offsetLabel} Standard Time` : `${offsetLabel} 표준시`;
            }
            return deps.getLocalizedTZLabel(entry);
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
                    id: deps.createUniqueTimezoneId("tz"),
                    zone: entry.zone || "UTC",
                    name_ko: `${offsetLabel} 표준시`,
                    name_en: `${offsetLabel} Standard Time`,
                    type: "standard",
                    fixedAbbr: abbr,
                    fixedOffsetMinutes
                };
            }
            return {
                id: deps.createUniqueTimezoneId("tz"),
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
                deps.addTimezone({
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
                    const liveOffset = deps.getTimezoneOffset(entry.zone, new Date());
                    if (Number.isFinite(liveOffset)) return Math.trunc(liveOffset);
                }
                return null;
            };

            const formatOffsetBadgeLabel = (offsetMinutes) => {
                const compact = formatUtcOffsetLabel(offsetMinutes); // UTC+09:00
                return `UTC ${compact.slice(3)}`; // UTC +09:00
            };

            const toCanonicalOffsetText = (value) => String(value || "").replace(/\s+/g, "").toUpperCase();

            const item = document.createElement("div");
            item.className = "tz-item";
            const title = document.createElement("div");
            title.className = "tz-item-title";
            title.textContent = getTimezoneEntryTitle(tzEntry);
            const abbr = document.createElement("div");
            abbr.className = "tz-item-abbr";
            const abbrText = tzEntry?.kind === "standard_list"
                ? formatUtcOffsetLabel(tzEntry?.fixedOffsetMinutes)
                : (
                    normalizeZoneAbbreviation(tzEntry?.abbr)
                    || normalizeZoneAbbreviation(deps.getBetterAbbr(tzEntry?.zone, new Date()))
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
                    const overlay = document.getElementById("full-tz-overlay");
                    if (overlay) overlay.style.display = "none";
                }
            });
            return item;
        }

        function sanitizeFullTimezoneOverlayTab(value) {
            return value === "country" ? "country" : "standard";
        }

        function renderFullTimezoneOverlayList() {
            const list = document.getElementById("full-tz-list");
            if (!list) return;

            list.innerHTML = "";
            const entries = fullTimezoneOverlayActiveTab === "country"
                ? fullTimezoneOverlayCountryEntries
                : fullTimezoneOverlayStandardEntries;
            entries.forEach((entry) => list.appendChild(createTimezoneListItem(entry, true)));
        }

        function updateFullTimezoneOverlayTabButtons() {
            const standardTabBtn = document.getElementById("tz-tab-standard");
            const countryTabBtn = document.getElementById("tz-tab-country");
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
            const quickSelect = document.getElementById("tz-quick-select");
            if (!quickSelect) return;
            const placeholder = quickSelect.options[0];
            quickSelect.textContent = "";
            quickSelect.appendChild(placeholder);

            const utcOption = document.createElement("option");
            utcOption.value = "UTC";
            utcOption.textContent = deps.t("utc_name");
            quickSelect.appendChild(utcOption);

            getSelectableTZEntries().forEach((entry) => {
                const option = document.createElement("option");
                option.value = entry.key;
                option.textContent = getSelectableTZOptionLabel(entry);
                quickSelect.appendChild(option);
            });
            deps.adjustSelectWidthForContent(quickSelect, 118);
        }

        function initSearchAndSelect() {
            const quickSelect = document.getElementById("tz-quick-select");
            if (!quickSelect) return;

            updateTZDropdown();

            quickSelect.onchange = (e) => {
                if (e.target.value === "UTC") {
                    const activeGroup = deps.getCurrentGroup();
                    if (activeGroup) {
                        activeGroup.showUtcRow = true;
                        if (!Number.isFinite(parseInt(activeGroup.utcRowOrder, 10))) {
                            activeGroup.utcRowOrder = 0;
                        }
                        deps.savePersistence();
                        deps.renderList();
                    }
                    quickSelect.value = "";
                    return;
                }
                const entry = getSelectableTZEntryByKey(e.target.value);
                if (entry) addFromSearchWithData(entry.key);
                quickSelect.value = "";
            };

            const showAllBtn = document.getElementById("show-all-tz");
            if (showAllBtn) {
                showAllBtn.onclick = () => {
                    const overlay = document.getElementById("full-tz-overlay");
                    if (!overlay) return;
                    fullTimezoneOverlayStandardEntries = getStandardTimezoneEntries();
                    fullTimezoneOverlayCountryEntries = getSelectableTZEntries();
                    setFullTimezoneOverlayTab("standard");
                    overlay.style.display = "flex";
                };
            }

            const standardTabBtn = document.getElementById("tz-tab-standard");
            const countryTabBtn = document.getElementById("tz-tab-country");
            if (standardTabBtn) {
                standardTabBtn.addEventListener("click", () => setFullTimezoneOverlayTab("standard"));
            }
            if (countryTabBtn) {
                countryTabBtn.addEventListener("click", () => setFullTimezoneOverlayTab("country"));
            }

            const closeOverlayBtn = document.getElementById("close-overlay");
            if (closeOverlayBtn) {
                closeOverlayBtn.onclick = () => {
                    const overlay = document.getElementById("full-tz-overlay");
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
        function getDayNamesByLang() {
            const lang = deps.getCurrentLang();
            return deps.I18N_DATA?.[lang]?.days || deps.I18N_DATA?.en?.days || [];
        }

        function getTimezoneRefById(id) {
            if (!id) return null;
            if (id === "utc") return deps.getUTCRef();
            const baseRef = deps.getBaseTimezoneRef();
            if (baseRef.id === id) return baseRef;
            return deps.getCurrentGroupZones().find((zone) => zone.id === id) || null;
        }

        function buildTimezoneComputedSnapshot(id) {
            const tz = getTimezoneRefById(id);
            if (!tz) return null;

            const globalTimes = deps.getGlobalTimes();
            const anchorDate = globalTimes[0] instanceof Date ? globalTimes[0] : new Date();

            let zoneCodeMain = "";
            let offsetStr = "";
            const fixedDisplayOffsetMinutes = deps.getFixedOffsetForDisplay(tz);

            if (tz.type === "custom") {
                zoneCodeMain = deps.normalizeCustomAbbr(tz.abbr);
                const offsetMin = deps.getCustomOffsetMinutes(tz);
                const sign = offsetMin >= 0 ? "+" : "-";
                const absMin = Math.abs(offsetMin);
                const absHour = Math.floor(absMin / 60);
                const minPart = absMin % 60;
                offsetStr = `UTC${sign}${deps.pad(absHour)}:${deps.pad(minPart)}`;
            } else {
                zoneCodeMain = deps.getZoneAbbreviation(tz, anchorDate);
                if (Number.isFinite(fixedDisplayOffsetMinutes)) {
                    const sign = fixedDisplayOffsetMinutes >= 0 ? "+" : "-";
                    const absMin = Math.abs(fixedDisplayOffsetMinutes);
                    const absHour = Math.floor(absMin / 60);
                    const minPart = absMin % 60;
                    offsetStr = `UTC${sign}${deps.pad(absHour)}:${deps.pad(minPart)}`;
                } else {
                    const offFmt = new Intl.DateTimeFormat("en-US", { timeZone: tz.zone, timeZoneName: "longOffset" });
                    const partsArr = offFmt.formatToParts(anchorDate);
                    const offVal = partsArr.find((part) => part.type === "timeZoneName")?.value || "GMT+0";
                    const matched = offVal.match(/[+-](\d{1,2}):?(\d{2})?/);
                    if (matched) {
                        const sign = offVal.includes("+") ? "+" : "-";
                        offsetStr = `UTC${sign}${deps.pad(matched[1])}:${deps.pad(matched[2] || 0)}`;
                    } else {
                        offsetStr = "UTC+00:00";
                    }
                }
            }

            const dayNamesByLang = getDayNamesByLang();
            const effectiveSlotCount = deps.isRealtime() ? 1 : deps.getSlotCount();
            const timeValues = [];
            const dateValues = [];
            const clockValues = [];
            const dayNameValues = [];
            const dayNightIconValues = [];

            for (let i = 0; i < effectiveSlotCount; i++) {
                const slotDate = globalTimes[i] instanceof Date ? globalTimes[i] : anchorDate;
                if (tz.type === "custom" || Number.isFinite(fixedDisplayOffsetMinutes)) {
                    const offsetMin = tz.type === "custom" ? deps.getCustomOffsetMinutes(tz) : fixedDisplayOffsetMinutes;
                    const shifted = new Date(slotDate.getTime() + (offsetMin * 60000));
                    const timeStr = `${shifted.getUTCFullYear()}-${deps.pad(shifted.getUTCMonth() + 1)}-${deps.pad(shifted.getUTCDate())} ${deps.pad(shifted.getUTCHours())}:${deps.pad(shifted.getUTCMinutes())}:${deps.pad(shifted.getUTCSeconds())}`;
                    const dateStr = timeStr.split(" ")[0];
                    const dayStr = dayNamesByLang[shifted.getUTCDay()] || "";
                    const clockStr = timeStr.split(" ")[1] || "";
                    const dayNightIcon = shifted.getUTCHours() >= 6 && shifted.getUTCHours() <= 18 ? "DAY" : "NIGHT";
                    timeValues.push(timeStr);
                    dateValues.push(dateStr);
                    clockValues.push(clockStr);
                    dayNameValues.push(dayStr);
                    dayNightIconValues.push(dayNightIcon);
                    continue;
                }

                const fmt = new Intl.DateTimeFormat("en-US", {
                    timeZone: tz.zone,
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    weekday: "short",
                    hour12: false
                });
                const parts = fmt.formatToParts(slotDate);
                const get = (type) => parts.find((part) => part.type === type)?.value || "";
                const hour = parseInt(get("hour"), 10);
                const weekday = get("weekday");
                const weekdayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
                const weekdayIdx = weekdayMap[weekday];
                const safeHour = hour === 24 ? 0 : hour;
                const timeStr = `${get("year")}-${deps.pad(get("month"))}-${deps.pad(get("day"))} ${deps.pad(safeHour)}:${deps.pad(get("minute"))}:${deps.pad(get("second"))}`;
                const dayStr = Number.isInteger(weekdayIdx) ? (dayNamesByLang[weekdayIdx] || "") : "";
                const dateStr = timeStr.split(" ")[0];
                const clockStr = timeStr.split(" ")[1] || "";
                const dayNightIcon = safeHour >= 6 && safeHour <= 18 ? "DAY" : "NIGHT";
                timeValues.push(timeStr);
                dateValues.push(dateStr);
                clockValues.push(clockStr);
                dayNameValues.push(dayStr);
                dayNightIconValues.push(dayNightIcon);
            }

            let periodDaysText = "";
            let periodTimeText = "";
            if (effectiveSlotCount > 1 && timeValues.length > 1) {
                const spanDays = deps.getSignedInclusiveDaySpan(timeValues[0], timeValues[1]);
                const spanTime = deps.getSignedDurationDayHourMinute(timeValues[0], timeValues[1]);
                periodDaysText = spanDays === null ? "" : `${spanDays}${deps.t("unit_days_suffix")}`;
                periodTimeText = spanTime === null ? "" : spanTime;
            }

            return {
                timezone: zoneCodeMain,
                region: deps.getZoneDisplayName(tz),
                offset: offsetStr,
                times: timeValues,
                dates: dateValues,
                clocks: clockValues,
                dayNames: dayNameValues,
                dayNightIcons: dayNightIconValues,
                periodDays: periodDaysText,
                periodTime: periodTimeText
            };
        }

        function formatTimeTextByParts(snapshot, timePartsEnabled) {
            const safeParts = deps.sanitizeTimePartsEnabled(timePartsEnabled, "copy");
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
            const { timePartsEnabled = deps.DEFAULT_COPY_TIME_PARTS_ENABLED } = options;
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

        function formatSnapshotText(snapshot, order, enabled, timePartsEnabled = deps.DEFAULT_COPY_TIME_PARTS_ENABLED) {
            if (!snapshot) return "";
            const orderedParts = [];
            deps.sanitizeCopyFormatOrder(order).forEach((key) => {
                if (!enabled?.[key]) return;
                const value = getCopyFieldText(snapshot, key, { timePartsEnabled });
                if (value) orderedParts.push(value);
            });
            return orderedParts.join(" ").trim();
        }

        function getRowFormattedText(rowOrId, order, enabled, timePartsEnabled = deps.DEFAULT_COPY_TIME_PARTS_ENABLED) {
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
                timePartsEnabled = deps.DEFAULT_COPY_TIME_PARTS_ENABLED
            } = options;
            return getRowFormattedText(rowOrId, order, enabled, timePartsEnabled);
        }

        return Object.freeze({
            getTimezoneRefById,
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
        function getDisplayColumns(effectiveSlotCount) {
            const columns = [];
            deps.sanitizeCopyFormatOrder(deps.getDisplayFormatOrder()).forEach((key) => {
                if (!deps.getDisplayFormatEnabled()?.[key]) return;
                if (key === "time") {
                    columns.push("time_main");
                    if (effectiveSlotCount > 1) columns.push("time_extra");
                    return;
                }
                if ((key === "period_days" || key === "period_time") && effectiveSlotCount <= 1) {
                    return;
                }
                columns.push(key);
            });
            return columns;
        }

        function getDisplayTimeInputMode() {
            const enabled = deps.getDisplayTimePartsEnabled() || {};
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
            const enabled = deps.getDisplayTimePartsEnabled() || {};
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
            const useRangeTimeLabels = !deps.isRealtime() && deps.getSlotCount() > 1;
            switch (colKey) {
                case "timezone":
                    return `<th style="width: 110px;">${deps.t("th_tz_abbr")}</th>`;
                case "region":
                    return `<th style="width: 220px;">${deps.t("th_region")}</th>`;
                case "offset":
                    return `<th style="width: 140px;">${deps.t("th_utc_offset")}</th>`;
                case "time_main":
                    return `<th class="dynamic-col">${deps.t(useRangeTimeLabels ? "th_time_day_start" : "th_time_day_main")}</th>`;
                case "time_extra":
                    return `<th class="dynamic-col">${deps.t(useRangeTimeLabels ? "th_time_day_end" : "th_time_day_extra")}</th>`;
                case "period_days":
                    return `<th style="width: 90px;">${deps.t("th_period_days")}</th>`;
                case "period_time":
                    return `<th style="width: 170px;">${deps.t("th_period_time")}</th>`;
                default:
                    return "";
            }
        }

        function getMultiDisplayColumnHeader(colKey) {
            switch (colKey) {
                case "timezone":
                    return `<th style="width: 110px;">${deps.t("th_tz_abbr")}</th>`;
                case "region":
                    return `<th style="width: 220px;">${deps.t("th_region")}</th>`;
                case "offset":
                    return `<th style="width: 150px;">${deps.t("th_utc_offset")}</th>`;
                case "time_main":
                    return `<th class="dynamic-col">${deps.t("th_time_day_start")}</th>`;
                case "time_extra":
                    return `<th class="dynamic-col">${deps.t("th_time_day_end")}</th>`;
                case "period_days":
                    return `<th style="width: 100px;">${deps.t("th_period_days")}</th>`;
                case "period_time":
                    return `<th style="width: 180px;">${deps.t("th_period_time")}</th>`;
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
                    return buildTimeColumnCell(slotIdx, slotCountToRender, { isReadonly: deps.isRealtime() });
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
                    return buildTimeColumnCell(slotIdx, slotCountToRender, { isReadonly: deps.isRealtime() });
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

        function createInteractiveTimezoneRow(tz, effectiveSlotCount, displayColumns, rowId = tz.id) {
            const tr = document.createElement("tr");
            tr.className = "time-row";
            tr.id = `tz-row-${rowId}`;
            tr.draggable = false;

            const dragHandleHtml = `<button type="button" class="drag-handle" draggable="true">&#8942;&#8942;</button>`;
            let inner = `<td class="move-cell"><div class="btn-group">${dragHandleHtml}</div></td>`;
            displayColumns.forEach((colKey) => {
                inner += buildDynamicRowCell(colKey, effectiveSlotCount);
            });
            inner += buildRowActionCells(deps.t("tooltip_copy"), "X", deps.t("tooltip_remove_row"));
            tr.insertAdjacentHTML('beforeend', inner);

            const zoneNameEl = tr.querySelector(".zone-name");
            if (zoneNameEl) zoneNameEl.textContent = deps.getZoneDisplayName(tz);

            const copyBtn = tr.querySelector(".copy-row-btn");
            if (copyBtn) copyBtn.addEventListener("click", () => deps.copyRow(rowId));

            const removeBtn = tr.querySelector(".remove-row-btn");
            if (removeBtn) removeBtn.addEventListener("click", () => deps.removeTimezone(rowId));

            tr.querySelectorAll(".time-input").forEach((input) => {
                const slotIdx = parseInt(input.dataset.slot, 10);
                const inputMode = input.dataset.inputMode || "datetime";
                const timezoneId = rowId === "utc" ? null : tz.id;

                const triggerBtn = input.parentElement.querySelector(`.trigger-slot-${slotIdx}`);
                if (window.CustomDatePicker && !input.classList.contains("time-input-hidden") && inputMode !== "none") {
                    input._cdp = new CustomDatePicker(input, {
                        type: inputMode === "date" ? "date" : "datetime",
                        lang: document.documentElement.lang || "en",
                        theme: document.documentElement.getAttribute("data-theme") || "dark",
                        triggerElement: triggerBtn || null
                    });
                }

                input.onchange = (e) => deps.handleTimeChange(e.target.value, tz.zone || "CUSTOM", slotIdx, timezoneId, inputMode);
                input.onkeydown = (e) => {
                    if (e.key === "Enter") {
                        deps.handleTimeChange(e.target.value, tz.zone || "CUSTOM", slotIdx, timezoneId, inputMode);
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
                        e.dataTransfer.setData("text/plain", rowId);
                        const ghost = (typeof deps.createDragGhostFromRow === "function")
                            ? deps.createDragGhostFromRow(tr)
                            : null;
                        e.dataTransfer.setDragImage(ghost || tr, 20, 20);
                    }
                });
                dragHandle.addEventListener("dragend", () => {
                    tr.classList.remove("dragging");
                    if (typeof deps.clearDragGhost === "function") deps.clearDragGhost();
                    deps.saveOrder();
                    deps.updateClocks();
                });
            }

            return tr;
        }

        function getRenderableTimezoneRows(baseRef) {
            const zoneRows = deps.getCurrentGroupZones().filter(
                (tz) => tz.id !== baseRef.id && !(tz.type === "standard" && tz.zone === "UTC")
            );
            const rowsToRender = [...zoneRows];
            if (baseRef.id !== "utc" && deps.isCurrentGroupUtcRowVisible()) {
                const utcRef = deps.getUTCRef();
                const insertIndex = Math.min(Math.max(deps.getCurrentGroupUtcRowOrder(), 0), rowsToRender.length);
                rowsToRender.splice(insertIndex, 0, utcRef);
            }
            return rowsToRender;
        }

        function renderList() {
            deps.hideFloatingTooltip();
            if (deps.isMultiTab()) {
                deps.renderMultiRanges();
                return;
            }

            const effectiveSlotCount = deps.isRealtime() ? 1 : deps.getSlotCount();
            const displayColumns = getDisplayColumns(effectiveSlotCount);
            const baseRef = deps.getBaseTimezoneRef();
            const baseRefName = deps.escapeHtml(deps.getZoneDisplayName(baseRef));
            const theadRow = document.querySelector("#table-head tr");

            if (theadRow) {
                const headCells = [`<th class="move-col" style="width: 70px;">${deps.t("th_order")}</th>`];
                headCells.push(...displayColumns.map(getDisplayColumnHeader).filter(Boolean));
                headCells.push(`<th class="export-exclude" style="width: 70px;">${deps.t("th_copy")}</th>`);
                headCells.push(`<th class="export-exclude" style="width: 70px;">${deps.t("th_remove")}</th>`);
                theadRow.textContent = "";
                theadRow.insertAdjacentHTML('beforeend', headCells.join(""));
            }

            const container = document.getElementById("clocks-container");
            if (!container) return;
            container.textContent = "";

            const baseRow = document.createElement("tr");
            baseRow.className = "time-row static base-row";
            baseRow.id = `tz-row-${baseRef.id}`;
            let baseInner = `<td class="move-cell"><span class="drag-spacer" aria-hidden="true"></span></td>`;
            displayColumns.forEach((colKey) => {
                baseInner += buildStaticRowCell(colKey, effectiveSlotCount, baseRefName);
            });
            baseInner += buildRowActionCells(deps.t("tooltip_copy"), "");
            baseRow.insertAdjacentHTML('beforeend', baseInner);
            const baseCopyBtn = baseRow.querySelector(".copy-row-btn");
            if (baseCopyBtn) baseCopyBtn.addEventListener("click", () => deps.copyRow(baseRef.id));
            container.appendChild(baseRow);

            for (let i = 0; i < effectiveSlotCount; i++) {
                const inputs = [...baseRow.querySelectorAll(`.time-input[data-slot="${i}"]`)];
                inputs.forEach((input) => {
                    const inputMode = input.dataset.inputMode || "datetime";
                    const slotIdx = parseInt(input.dataset.slot, 10);

                    const triggerBtn = input.parentElement.querySelector(`.trigger-slot-${slotIdx}`);
                    if (window.CustomDatePicker && !input.classList.contains("time-input-hidden") && inputMode !== "none") {
                        input._cdp = new CustomDatePicker(input, {
                            type: inputMode === "date" ? "date" : "datetime",
                            lang: document.documentElement.lang || "en",
                            theme: document.documentElement.getAttribute("data-theme") || "dark",
                            triggerElement: triggerBtn || null
                        });
                    }

                    input.onchange = (e) => deps.handleTimeChange(e.target.value, baseRef.zone || "CUSTOM", i, baseRef.id, inputMode);
                    input.onkeydown = (e) => {
                        if (e.key === "Enter") {
                            deps.handleTimeChange(e.target.value, baseRef.zone || "CUSTOM", i, baseRef.id, inputMode);
                            input.blur();
                        }
                    };
                    if (deps.isRealtime()) input.readOnly = true;
                });
            }

            const rowsToRender = getRenderableTimezoneRows(baseRef);
            rowsToRender.forEach((tz) => {
                const rowId = tz.id === "utc" ? "utc" : tz.id;
                const row = createInteractiveTimezoneRow(tz, effectiveSlotCount, displayColumns, rowId);
                container.appendChild(row);
            });

            deps.renderBaseTimeSelect();
            deps.updateTimeAdjustPanel();
            deps.updateClocks();
            deps.upgradeNativeTitleTooltips(container);
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



// --- File: js/modules/multi-range-render.js ---
(function initGtvMultiRangeRender(globalObj) {
    "use strict";

    function createService(deps) {
        function getDayNightGlyph(marker) {
            if (marker === "DAY") return "\u2600\uFE0F";
            if (marker === "NIGHT") return "🌙";
            return marker;
        }

        function getTimezoneDisplayPointAtDate(date, tz, fixedDisplayOffsetMinutes = null) {
            let timeStr = "";
            let dayIndex = 0;
            let hour = 0;

            if (tz.type === "custom" || Number.isFinite(fixedDisplayOffsetMinutes)) {
                const offsetMin = tz.type === "custom" ? deps.getCustomOffsetMinutes(tz) : fixedDisplayOffsetMinutes;
                const shifted = new Date(date.getTime() + (offsetMin * 60000));
                hour = shifted.getUTCHours();
                dayIndex = shifted.getUTCDay();
                timeStr = `${shifted.getUTCFullYear()}-${deps.pad(shifted.getUTCMonth() + 1)}-${deps.pad(shifted.getUTCDate())} ${deps.pad(hour)}:${deps.pad(shifted.getUTCMinutes())}:${deps.pad(shifted.getUTCSeconds())}`;
            } else {
                const formatter = new Intl.DateTimeFormat("en-US", {
                    timeZone: tz.zone,
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    weekday: "short",
                    hour12: false
                });
                const parts = formatter.formatToParts(date);
                const get = (type) => parts.find((part) => part.type === type)?.value || "";
                const rawHour = parseInt(get("hour"), 10);
                hour = rawHour === 24 ? 0 : rawHour;
                const weekday = get("weekday");
                dayIndex = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[weekday] ?? 0;
                timeStr = `${get("year")}-${deps.pad(get("month"))}-${deps.pad(get("day"))} ${deps.pad(hour)}:${deps.pad(get("minute"))}:${deps.pad(get("second"))}`;
            }

            const dayNames = deps.I18N_DATA?.[deps.getCurrentLang()]?.days || [];
            const [dateStr, clockStrRaw] = timeStr.split(" ");
            return {
                timeStr,
                dateStr,
                clockStr: (clockStrRaw || "").trim(),
                dayIndex,
                hour,
                dayName: dayNames[dayIndex] || "",
                dayNightIcon: (hour >= 6 && hour <= 18) ? "DAY" : "NIGHT"
            };
        }

        function buildTimezoneComputedSnapshotForRange(tz, startDate, endDate) {
            if (!tz) return null;

            let zoneCodeMain = "";
            let offsetStr = "";
            const fixedDisplayOffsetMinutes = deps.getFixedOffsetForDisplayAtDate(tz, startDate);

            if (tz.type === "custom") {
                zoneCodeMain = deps.normalizeCustomAbbr(tz.abbr);
                const offsetMin = deps.getCustomOffsetMinutes(tz);
                const sign = offsetMin >= 0 ? "+" : "-";
                const absMin = Math.abs(offsetMin);
                offsetStr = `UTC${sign}${deps.pad(Math.floor(absMin / 60))}:${deps.pad(absMin % 60)}`;
            } else {
                zoneCodeMain = deps.getZoneAbbreviation(tz, startDate);
                if (Number.isFinite(fixedDisplayOffsetMinutes)) {
                    const sign = fixedDisplayOffsetMinutes >= 0 ? "+" : "-";
                    const absMin = Math.abs(fixedDisplayOffsetMinutes);
                    offsetStr = `UTC${sign}${deps.pad(Math.floor(absMin / 60))}:${deps.pad(absMin % 60)}`;
                } else {
                    const offFmt = new Intl.DateTimeFormat("en-US", { timeZone: tz.zone, timeZoneName: "longOffset" });
                    const partsArr = offFmt.formatToParts(startDate);
                    const offVal = partsArr.find((part) => part.type === "timeZoneName")?.value || "GMT+0";
                    const matched = offVal.match(/[+-](\d{1,2}):?(\d{2})?/);
                    if (matched) {
                        const sign = offVal.includes("+") ? "+" : "-";
                        offsetStr = `UTC${sign}${deps.pad(matched[1])}:${deps.pad(matched[2] || 0)}`;
                    } else {
                        offsetStr = "UTC+00:00";
                    }
                }
            }

            const points = [
                getTimezoneDisplayPointAtDate(startDate, tz, fixedDisplayOffsetMinutes),
                getTimezoneDisplayPointAtDate(endDate, tz, fixedDisplayOffsetMinutes)
            ];

            const times = points.map((point) => point.timeStr);
            const dates = points.map((point) => point.dateStr);
            const clocks = points.map((point) => point.clockStr);
            const dayNames = points.map((point) => point.dayName);
            const dayIndexes = points.map((point) => point.dayIndex);
            const dayNightIcons = points.map((point) => point.dayNightIcon);

            const spanDays = deps.getSignedInclusiveDaySpan(times[0], times[1]);
            const spanTime = deps.getSignedDurationDayHourMinute(times[0], times[1]);

            return {
                timezone: zoneCodeMain,
                region: deps.getZoneDisplayName(tz),
                offset: offsetStr,
                times,
                dates,
                clocks,
                dayNames,
                dayIndexes,
                dayNightIcons,
                periodDays: spanDays === null ? "" : `${spanDays}${deps.t("unit_days_suffix")}`,
                periodTime: spanTime === null ? "" : spanTime
            };
        }

        function applySnapshotToRow(row, snapshot) {
            if (!row || !snapshot) return;

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

                row.querySelectorAll(`.time-input[data-slot="${slotIdx}"]`).forEach((input) => {
                    const inputMode = input.dataset.inputMode || "datetime";
                    let nextValue = timeStr;
                    if (inputMode === "date") nextValue = dateStr;
                    else if (inputMode === "time") nextValue = clockStr;
                    else if (inputMode === "none") nextValue = "";
                    if (document.activeElement !== input) input.value = nextValue;
                });

                row.querySelectorAll(`.day-slot-${slotIdx}`).forEach((badge) => {
                    badge.textContent = dayName;
                    badge.className = `day-badge day-slot-${slotIdx}`;
                    if (dayIndex === 0) badge.classList.add("day-sun");
                    else if (dayIndex === 6) badge.classList.add("day-sat");
                });

                row.querySelectorAll(`.dn-slot-${slotIdx}`).forEach((dnEl) => {
                    dnEl.textContent = dnGlyph;
                    if (dnMarker === "DAY") dnEl.title = deps.t("dn_day");
                    else if (dnMarker === "NIGHT") dnEl.title = deps.t("dn_night");
                    else dnEl.title = "";
                });
            }

            const periodEl = row.querySelector(".period-days-text");
            if (periodEl) periodEl.textContent = (snapshot.periodDays || "").trim() || "-";

            const periodTimeEl = row.querySelector(".period-time-text");
            if (periodTimeEl) periodTimeEl.textContent = (snapshot.periodTime || "").trim() || "-";
        }

        function formatRangeDurationText(startUtcMs, endUtcMs) {
            const diffMs = endUtcMs - startUtcMs;
            const sign = diffMs < 0 ? "-" : "";
            const totalMinutes = Math.floor(Math.abs(diffMs) / 60000);
            const day = Math.floor(totalMinutes / 1440);
            const hour = Math.floor((totalMinutes % 1440) / 60);
            const minute = totalMinutes % 60;
            if (deps.getCurrentLang() === "ko") return `${sign}${day}\uC77C ${hour}\uC2DC\uAC04 ${minute}\uBD84`;
            return `${sign}${day}d ${hour}h ${minute}m`;
        }

        function getMultiRangeTitleText(rangeIdx, range, baseRef) {
            const safeTitle = deps.sanitizeMultiSubgroupName(
                deps.getCurrentMultiSubgroupName(),
                deps.sanitizeMultiRangeTitle(deps.getMultiRangeTitle())
            );
            const durationText = formatRangeDurationText(range.startUtcMs, range.endUtcMs);
            const baseSnapshot = buildTimezoneComputedSnapshotForRange(
                baseRef,
                new Date(range.startUtcMs),
                new Date(range.endUtcMs)
            );
            const startText = baseSnapshot?.times?.[0] || "-";
            const endText = baseSnapshot?.times?.[1] || "-";
            return `${safeTitle} #${rangeIdx + 1} - ${startText} ~ ${endText} [${durationText}]`;
        }

        function createMultiRangeTableRow(tz, options = {}) {
            const { rangeIdx, range, displayColumns, isBase = false, rowId = tz.id, baseNameHtml = "" } = options;
            const tr = document.createElement("tr");
            tr.className = isBase ? "time-row static base-row" : "time-row";
            tr.id = `multi-r${rangeIdx}-tz-row-${rowId}`;

            let inner = "";
            displayColumns.forEach((colKey) => {
                inner += isBase ? deps.buildStaticRowCell(colKey, 2, baseNameHtml) : deps.buildDynamicRowCell(colKey, 2);
            });
            inner += `<td class="export-exclude copy-cell"><div class="btn-group"><button class="sm-btn copy-row-btn" title="${deps.t("tooltip_copy")}">&#128203;</button></div></td>`;
            tr.insertAdjacentHTML('beforeend', inner);

            if (!isBase) {
                const zoneNameEl = tr.querySelector(".zone-name");
                if (zoneNameEl) zoneNameEl.textContent = deps.getZoneDisplayName(tz);
            }

            const copyBtn = tr.querySelector(".copy-row-btn");
            if (copyBtn) {
                copyBtn.addEventListener("click", () => deps.copyMultiRangeRow(rangeIdx, rowId));
            }

            tr.querySelectorAll(".time-input").forEach((input) => {
                const slotIdx = parseInt(input.dataset.slot, 10);
                const inputMode = input.dataset.inputMode || "datetime";
                const timezoneId = rowId === "utc" ? null : tz.id;
                const lockedByChain = slotIdx === 0 && rangeIdx > 0 && !deps.isMultiRangeStartEditEnabled(rangeIdx);
                const lockedByEndToggle = slotIdx === 1 && !deps.isMultiRangeEndEditEnabled(rangeIdx);
                const lockedByToggle = lockedByChain || lockedByEndToggle;

                const triggerBtn = input.parentElement.querySelector(`.trigger-slot-${slotIdx}`);
                if (lockedByToggle) {
                    input.readOnly = true;
                    if (triggerBtn) triggerBtn.style.display = "none";
                }

                if (!lockedByToggle && window.CustomDatePicker && !input.classList.contains("time-input-hidden") && inputMode !== "none") {
                    input._cdp = new CustomDatePicker(input, {
                        type: inputMode === "date" ? "date" : "datetime",
                        lang: document.documentElement.lang || "en",
                        theme: document.documentElement.getAttribute("data-theme") || "dark",
                        triggerElement: triggerBtn || null
                    });
                }

                input.onchange = (e) => {
                    if (lockedByToggle) return;
                    deps.handleMultiRangeTimeChange(rangeIdx, e.target.value, tz.zone || "CUSTOM", slotIdx, timezoneId, inputMode);
                };
                input.onkeydown = (e) => {
                    if (e.key !== "Enter") return;
                    if (!lockedByToggle) deps.handleMultiRangeTimeChange(rangeIdx, input.value, tz.zone || "CUSTOM", slotIdx, timezoneId, inputMode);
                    input.blur();
                };
            });

            const snapshot = buildTimezoneComputedSnapshotForRange(
                tz,
                new Date(range.startUtcMs),
                new Date(range.endUtcMs)
            );
            applySnapshotToRow(tr, snapshot);
            return tr;
        }

        function renderMultiRanges() {
            deps.hideFloatingTooltip();
            const container = document.getElementById("multi-ranges-container");
            if (!container) return;

            deps.ensureMultiRangeState();
            deps.refreshMultiRangeControls();
            deps.renderMultiBulkToolSets();

            const baseRef = deps.getBaseTimezoneRef();
            const baseRefName = deps.escapeHtml(deps.getZoneDisplayName(baseRef));
            const displayColumns = deps.getDisplayColumns(2);
            const rowsToRender = deps.getRenderableTimezoneRows(baseRef);
            const multiRanges = deps.getMultiRanges();
            const multiRangeCollapsed = deps.getMultiRangeCollapsed();
            const multiRangeCount = deps.getMultiRangeCount();

            container.innerHTML = "";
            multiRanges.forEach((range, rangeIdx) => {
                const block = document.createElement("div");
                block.className = "multi-range-block";
                const isCollapsed = !!multiRangeCollapsed[rangeIdx];
                if (isCollapsed) block.classList.add("collapsed");

                const header = document.createElement("div");
                header.className = "multi-range-header";
                const title = document.createElement("div");
                title.className = "multi-range-title";
                title.textContent = getMultiRangeTitleText(rangeIdx, range, baseRef);

                const headerActions = document.createElement("div");
                headerActions.className = "multi-range-header-actions";
                const createHeaderActionDivider = () => {
                    const divider = document.createElement("span");
                    divider.className = "multi-range-header-divider";
                    divider.textContent = "|";
                    divider.setAttribute("aria-hidden", "true");
                    return divider;
                };

                const saveRangeBtn = document.createElement("button");
                saveRangeBtn.type = "button";
                saveRangeBtn.className = "sm-btn multi-range-save-btn";
                saveRangeBtn.textContent = deps.t("btn_save_image_range");
                saveRangeBtn.addEventListener("click", () => {
                    deps.saveMultiRangeSingleImage(rangeIdx);
                });

                const copyRangeBtn = document.createElement("button");
                copyRangeBtn.type = "button";
                copyRangeBtn.className = "sm-btn multi-range-copy-btn";
                copyRangeBtn.textContent = deps.t("btn_copy_range");
                copyRangeBtn.addEventListener("click", () => {
                    deps.copyWholeMultiRange(rangeIdx);
                });

                const collapseBelowBtn = document.createElement("button");
                collapseBelowBtn.type = "button";
                collapseBelowBtn.className = "sm-btn multi-range-toggle-btn";
                collapseBelowBtn.textContent = deps.t("btn_collapse_below");
                collapseBelowBtn.disabled = rangeIdx >= (multiRangeCount - 1);
                collapseBelowBtn.addEventListener("click", () => deps.setMultiRangesCollapsedBelow(rangeIdx, true));

                const expandBelowBtn = document.createElement("button");
                expandBelowBtn.type = "button";
                expandBelowBtn.className = "sm-btn multi-range-toggle-btn";
                expandBelowBtn.textContent = deps.t("btn_expand_below");
                expandBelowBtn.disabled = rangeIdx >= (multiRangeCount - 1);
                expandBelowBtn.addEventListener("click", () => deps.setMultiRangesCollapsedBelow(rangeIdx, false));

                const toggleBtn = document.createElement("button");
                toggleBtn.type = "button";
                toggleBtn.className = "sm-btn multi-range-toggle-btn";
                toggleBtn.textContent = isCollapsed ? deps.t("btn_expand_this_range") : deps.t("btn_collapse_this_range");
                toggleBtn.addEventListener("click", () => deps.toggleMultiRangeCollapsed(rangeIdx));

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

                const adjustRow = document.createElement("div");
                adjustRow.className = "multi-range-adjust-row";
                const startAdjustEnabled = rangeIdx === 0 ? true : deps.isMultiRangeStartEditEnabled(rangeIdx);
                const startAdjustSet = deps.renderTimeAdjustSet(0, {
                    labelText: deps.t("label_start_time_adjust"),
                    includeFixedActions: rangeIdx === 0,
                    includeSyncPreviousEndAction: rangeIdx > 0,
                    disabled: rangeIdx > 0 ? !startAdjustEnabled : false,
                    onAction: (slotIdx, action) => deps.applyMultiRangeTimeAdjustAction(rangeIdx, slotIdx, action)
                });
                if (rangeIdx > 0) {
                    deps.attachTimeAdjustToggleLabel(
                        startAdjustSet,
                        startAdjustEnabled,
                        deps.t("label_start_time_adjust"),
                        (nextChecked) => deps.setMultiRangeStartEditEnabled(rangeIdx, nextChecked, { persist: true, rerender: true })
                    );
                }
                adjustRow.appendChild(startAdjustSet);
                const endAdjustEnabled = deps.isMultiRangeEndEditEnabled(rangeIdx);
                const endAdjustSet = deps.renderTimeAdjustSet(1, {
                    labelText: deps.t("label_extra_time_adjust"),
                    includeFixedActions: false,
                    includeZeroDayAction: true,
                    disabled: !endAdjustEnabled,
                    onAction: (slotIdx, action) => deps.applyMultiRangeTimeAdjustAction(rangeIdx, slotIdx, action)
                });
                deps.attachTimeAdjustToggleLabel(
                    endAdjustSet,
                    endAdjustEnabled,
                    deps.t("label_extra_time_adjust"),
                    (nextChecked) => deps.setMultiRangeEndEditEnabled(rangeIdx, nextChecked, { persist: true, rerender: true })
                );
                adjustRow.appendChild(endAdjustSet);
                block.appendChild(adjustRow);

                const tableWrap = document.createElement("div");
                tableWrap.className = "multi-range-table-wrap";
                const table = document.createElement("table");
                table.className = "data-table multi-range-table";

                const thead = document.createElement("thead");
                const headCells = [];
                headCells.push(...displayColumns.map(deps.getMultiDisplayColumnHeader).filter(Boolean));
                headCells.push(`<th class="export-exclude" style="width: 70px;">${deps.t("th_copy")}</th>`);
                thead.insertAdjacentHTML('afterbegin', `<tr>${headCells.join("")}</tr>`);
                table.appendChild(thead);

                const tbody = document.createElement("tbody");
                const baseRow = createMultiRangeTableRow(baseRef, {
                    rangeIdx,
                    range,
                    displayColumns,
                    isBase: true,
                    rowId: baseRef.id,
                    baseNameHtml: baseRefName
                });
                tbody.appendChild(baseRow);

                rowsToRender.forEach((tz) => {
                    const rowId = tz.id === "utc" ? "utc" : tz.id;
                    tbody.appendChild(createMultiRangeTableRow(tz, {
                        rangeIdx,
                        range,
                        displayColumns,
                        isBase: false,
                        rowId
                    }));
                });

                table.appendChild(tbody);
                tableWrap.appendChild(table);
                block.appendChild(tableWrap);
                container.appendChild(block);
            });

            deps.updateTimeAdjustPanel();
            deps.updateCopyFormatPreview();
            deps.upgradeNativeTitleTooltips(container);
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
        async function copyMultiRangeRow(rangeIdx, rowId) {
            deps.ensureMultiRangeState();
            const ranges = deps.getMultiRanges();
            const range = ranges[rangeIdx];
            if (!range) return;
            const tz = deps.getTimezoneRefById(rowId);
            if (!tz) return;

            const snapshot = deps.buildTimezoneComputedSnapshotForRange(
                tz,
                new Date(range.startUtcMs),
                new Date(range.endUtcMs)
            );
            const text = deps.formatSnapshotText(
                snapshot,
                deps.getCopyFormatOrder(),
                deps.getCopyFormatEnabled(),
                deps.getCopyTimePartsEnabled()
            );
            if (!text) return;

            try {
                await deps.writeClipboard(text);
                deps.showToast(deps.t("toast_copy_success"), { type: "success" });
            } catch (err) {
                console.error("copyMultiRangeRow failed:", err);
                deps.showToast(deps.t("toast_copy_failed"), { type: "error" });
            }
        }

        async function copyWholeMultiRange(rangeIdx) {
            deps.ensureMultiRangeState();
            const ranges = deps.getMultiRanges();
            const range = ranges[rangeIdx];
            if (!range) return;

            const baseRef = deps.getBaseTimezoneRef();
            const dynamicRows = deps.getRenderableTimezoneRows(baseRef);
            const rowRefs = [baseRef, ...dynamicRows];
            const lineArr = [deps.getMultiRangeTitleText(rangeIdx, range, baseRef)];

            rowRefs.forEach((tz) => {
                const snapshot = deps.buildTimezoneComputedSnapshotForRange(
                    tz,
                    new Date(range.startUtcMs),
                    new Date(range.endUtcMs)
                );
                const line = deps.formatSnapshotText(
                    snapshot,
                    deps.getCopyFormatOrder(),
                    deps.getCopyFormatEnabled(),
                    deps.getCopyTimePartsEnabled()
                );
                if (line) lineArr.push(line);
            });

            if (lineArr.length <= 1) return;
            try {
                await deps.writeClipboard(lineArr.join("\n"));
                deps.showToast(deps.t("toast_copy_success"), { type: "success" });
            } catch (err) {
                console.error("copyWholeMultiRange failed:", err);
                deps.showToast(deps.t("toast_copy_failed"), { type: "error" });
            }
        }

        async function copyAllMultiRangeTimezones() {
            deps.ensureMultiRangeState();
            const ranges = deps.getMultiRanges();
            const baseRef = deps.getBaseTimezoneRef();
            const dynamicRows = deps.getRenderableTimezoneRows(baseRef);
            const rowRefs = [baseRef, ...dynamicRows];
            const lineArr = [];

            ranges.forEach((range, rangeIdx) => {
                lineArr.push(deps.getMultiRangeTitleText(rangeIdx, range, baseRef));
                rowRefs.forEach((tz) => {
                    const snapshot = deps.buildTimezoneComputedSnapshotForRange(
                        tz,
                        new Date(range.startUtcMs),
                        new Date(range.endUtcMs)
                    );
                    const line = deps.formatSnapshotText(
                        snapshot,
                        deps.getCopyFormatOrder(),
                        deps.getCopyFormatEnabled(),
                        deps.getCopyTimePartsEnabled()
                    );
                    if (line) lineArr.push(line);
                });
                if (rangeIdx < ranges.length - 1) {
                    lineArr.push("");
                }
            });

            if (!lineArr.length) return;
            try {
                await deps.writeClipboard(lineArr.join("\n"));
                deps.showToast(deps.t("toast_copy_all_success"), { type: "success" });
            } catch (err) {
                console.error("copyAllMultiRangeTimezones failed:", err);
                deps.showToast(deps.t("toast_copy_failed"), { type: "error" });
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
        function updateCopyFormatPreview() {
            const copyPreviewEl = document.getElementById("copy-format-preview");
            if (!copyPreviewEl) return;

            const setPreview = (el, text) => {
                const resolved = text || "-";
                el.textContent = resolved;
                el.classList.toggle("empty", resolved === "-");
            };

            if (!deps.isShowCopyFormat()) {
                setPreview(copyPreviewEl, "-");
                return;
            }

            if (deps.isMultiTab()) {
                deps.ensureMultiRangeState();
                const firstRange = deps.getMultiRanges()[0];
                const baseRef = deps.getBaseTimezoneRef();
                const snapshot = firstRange
                    ? deps.buildTimezoneComputedSnapshotForRange(baseRef, new Date(firstRange.startUtcMs), new Date(firstRange.endUtcMs))
                    : null;
                setPreview(
                    copyPreviewEl,
                    deps.formatSnapshotText(
                        snapshot,
                        deps.getCopyFormatOrder(),
                        deps.getCopyFormatEnabled(),
                        deps.getCopyTimePartsEnabled()
                    )
                );
                return;
            }

            const baseRef = deps.getBaseTimezoneRef();
            const baseRowId = baseRef?.id || "utc";
            setPreview(
                copyPreviewEl,
                deps.getRowFormattedText(
                    baseRowId,
                    deps.getCopyFormatOrder(),
                    deps.getCopyFormatEnabled(),
                    deps.getCopyTimePartsEnabled()
                )
            );
        }

        async function copyRow(id) {
            const text = deps.getRowCopyText(id);
            if (!text) return;
            try {
                await deps.writeClipboard(text);
                deps.showToast(deps.t("toast_copy_success"), { type: "success" });
            } catch (err) {
                console.error("copyRow failed:", err);
                deps.showToast(deps.t("toast_copy_failed"), { type: "error" });
            }
        }

        async function copyAllTimezones() {
            if (deps.isMultiTab()) {
                await deps.copyAllMultiRangeTimezones();
                return;
            }

            const lineArr = [...document.querySelectorAll("#clocks-container .time-row")]
                .map((row) => deps.getRowCopyText(String(row.id || "").replace("tz-row-", "")))
                .filter(Boolean);
            if (!lineArr.length) return;

            try {
                await deps.writeClipboard(lineArr.join("\n"));
                deps.showToast(deps.t("toast_copy_all_success"), { type: "success" });
            } catch (err) {
                console.error("copyAllTimezones failed:", err);
                deps.showToast(deps.t("toast_copy_failed"), { type: "error" });
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
        function createTimeAdjustActionButton(labelKey, slotIdx, action, onAction = deps.applyTimeAdjustAction, disabled = false) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "sm-btn";
            button.dataset.action = action;
            button.textContent = deps.t(labelKey);
            button.disabled = !!disabled;
            button.addEventListener("click", () => {
                if (button.disabled) return;
                onAction(slotIdx, action);
            });
            return button;
        }

        function createTimeAdjustDivider() {
            const divider = document.createElement("span");
            divider.className = "time-adjust-divider";
            divider.textContent = "|";
            return divider;
        }

        function attachTimeAdjustToggleLabel(setEl, checked, text, onChange) {
            if (!(setEl instanceof HTMLElement) || typeof onChange !== "function") return;
            const label = setEl.querySelector(".time-adjust-set-label");
            if (!label) return;

            label.classList.add("time-adjust-set-label-with-toggle");
            label.textContent = "";

            const toggle = document.createElement("input");
            toggle.type = "checkbox";
            toggle.className = "time-adjust-set-toggle";
            toggle.checked = !!checked;
            toggle.addEventListener("change", () => onChange(toggle.checked));

            const textEl = document.createElement("span");
            textEl.textContent = text;

            label.appendChild(toggle);
            label.appendChild(textEl);
        }

        function sanitizeTimeAdjustDayStep(value) {
            const parsed = parseInt(value, 10);
            if (!Number.isFinite(parsed)) return deps.DEFAULT_TIME_ADJUST_DAY_STEP;
            return Math.min(deps.MAX_TIME_ADJUST_DAY_STEP, Math.max(deps.MIN_TIME_ADJUST_DAY_STEP, parsed));
        }

        function getTimeAdjustDayStep(slotIdx) {
            return sanitizeTimeAdjustDayStep(deps.getTimeAdjustDayStepValue(slotIdx));
        }

        function setTimeAdjustDayStep(slotIdx, value) {
            const safeValue = sanitizeTimeAdjustDayStep(value);
            deps.setTimeAdjustDayStepValue(slotIdx, safeValue);
            return safeValue;
        }

        function createTimeAdjustCustomDaysControl(slotIdx, onAction = deps.applyTimeAdjustAction, disabled = false) {
            const wrap = document.createElement("div");
            wrap.className = "time-adjust-custom-group";

            const label = document.createElement("span");
            label.className = "time-adjust-custom-label";
            label.textContent = deps.t("label_custom_days");

            const dayInput = document.createElement("input");
            dayInput.type = "number";
            dayInput.className = "form-input time-adjust-days-input";
            dayInput.min = String(deps.MIN_TIME_ADJUST_DAY_STEP);
            dayInput.step = "1";
            dayInput.inputMode = "numeric";
            dayInput.value = String(getTimeAdjustDayStep(slotIdx));
            dayInput.disabled = !!disabled;

            const minusBtn = document.createElement("button");
            minusBtn.type = "button";
            minusBtn.className = "sm-btn time-adjust-custom-btn";
            minusBtn.textContent = "-";
            minusBtn.disabled = !!disabled;
            minusBtn.addEventListener("click", () => {
                if (minusBtn.disabled) return;
                onAction(slotIdx, "minus_custom_days");
            });

            const plusBtn = document.createElement("button");
            plusBtn.type = "button";
            plusBtn.className = "sm-btn time-adjust-custom-btn";
            plusBtn.textContent = "+";
            plusBtn.disabled = !!disabled;
            plusBtn.addEventListener("click", () => {
                if (plusBtn.disabled) return;
                onAction(slotIdx, "plus_custom_days");
            });

            const syncInputAndLabel = (persist = false) => {
                const normalized = setTimeAdjustDayStep(slotIdx, dayInput.value);
                dayInput.value = String(normalized);
                if (persist) deps.savePersistence();
            };

            dayInput.addEventListener("input", () => syncInputAndLabel(true));
            dayInput.addEventListener("change", () => syncInputAndLabel(true));
            dayInput.addEventListener("blur", () => syncInputAndLabel(true));
            syncInputAndLabel();

            wrap.appendChild(label);
            wrap.appendChild(minusBtn);
            wrap.appendChild(dayInput);
            wrap.appendChild(plusBtn);
            return wrap;
        }

        function renderTimeAdjustSet(slotIdx, options = {}) {
            const {
                onAction = deps.applyTimeAdjustAction,
                labelText = "",
                disabled = false,
                includeFixedActions = true,
                includeZeroDayAction = false,
                includeSyncPreviousEndAction = false
            } = options;
            const set = document.createElement("div");
            set.className = "time-adjust-set";

            const label = document.createElement("span");
            label.className = "time-adjust-set-label";
            label.textContent = labelText || (slotIdx === 0 ? deps.t("th_time_day_main") : deps.t("th_time_day_extra"));
            set.appendChild(label);

            if (includeFixedActions) {
                const fixedActions = [
                    ["btn_now", "now"],
                    ["btn_midnight", "midnight"],
                    ["btn_sharp_hour", "sharp_hour"]
                ];
                fixedActions.forEach(([labelKey, action]) => {
                    set.appendChild(createTimeAdjustActionButton(labelKey, slotIdx, action, onAction, disabled));
                });
                set.appendChild(createTimeAdjustDivider());
            }

            if (includeZeroDayAction) {
                const zeroDayBtn = createTimeAdjustActionButton("btn_set_zero_day", slotIdx, "set_zero_day", onAction, disabled);
                zeroDayBtn.classList.add("time-adjust-zero-btn");
                set.appendChild(zeroDayBtn);
                set.appendChild(createTimeAdjustDivider());
            }

            if (includeSyncPreviousEndAction) {
                const syncPrevBtn = createTimeAdjustActionButton("btn_sync_extra_time", slotIdx, "sync_prev_end", onAction, disabled);
                syncPrevBtn.classList.add("time-adjust-sync-btn");
                set.appendChild(syncPrevBtn);
                set.appendChild(createTimeAdjustDivider());
            }

            const shiftActionGroups = [
                [["btn_minus_hour", "minus_hour"], ["btn_plus_hour", "plus_hour"]],
                [["btn_minus_day", "minus_day"], ["btn_plus_day", "plus_day"]],
                [["btn_minus_week", "minus_week"], ["btn_plus_week", "plus_week"]]
            ];
            shiftActionGroups.forEach((group, groupIdx) => {
                group.forEach(([labelKey, action]) => {
                    set.appendChild(createTimeAdjustActionButton(labelKey, slotIdx, action, onAction, disabled));
                });
                if (groupIdx < shiftActionGroups.length - 1) {
                    set.appendChild(createTimeAdjustDivider());
                }
            });

            set.appendChild(createTimeAdjustDivider());
            set.appendChild(createTimeAdjustActionButton("btn_minus_four_weeks", slotIdx, "minus_four_weeks", onAction, disabled));
            set.appendChild(createTimeAdjustActionButton("btn_plus_four_weeks", slotIdx, "plus_four_weeks", onAction, disabled));
            set.appendChild(createTimeAdjustDivider());
            set.appendChild(createTimeAdjustCustomDaysControl(slotIdx, onAction, disabled));

            return set;
        }

        function updateTimeAdjustPanel() {
            const frame = document.getElementById("time-adjust-frame");
            const row = document.getElementById("time-adjust-row");
            const buttonsContainer = document.getElementById("time-adjust-buttons");
            if (!frame || !row || !buttonsContainer) return;

            const visible = deps.getCurrentMainTab() === "fixed";
            frame.style.display = visible ? "block" : "none";
            row.style.display = visible ? "block" : "none";

            if (!visible) {
                buttonsContainer.textContent = "";
                return;
            }

            const effectiveSlotCount = deps.isRealtime() ? 1 : deps.getSlotCount();
            buttonsContainer.innerHTML = "";
            if (effectiveSlotCount > 1) {
                buttonsContainer.appendChild(renderTimeAdjustSet(0, {
                    labelText: deps.t("label_start_time_adjust"),
                    includeFixedActions: true
                }));
                buttonsContainer.appendChild(renderTimeAdjustSet(1, {
                    labelText: deps.t("label_extra_time_adjust"),
                    includeFixedActions: false,
                    includeZeroDayAction: true
                }));
            } else {
                buttonsContainer.appendChild(renderTimeAdjustSet(0, {
                    labelText: deps.t("label_main_time_adjust"),
                    includeFixedActions: true
                }));
            }

            const syncFixedZeroButtonWidth = () => {
                const sets = [...buttonsContainer.querySelectorAll(".time-adjust-set")];
                if (sets.length < 2) return;
                const startSet = sets[0];
                const endSet = sets[1];
                const zeroBtn = endSet.querySelector('[data-action="set_zero_day"]');
                if (!(zeroBtn instanceof HTMLElement)) return;

                zeroBtn.style.width = "";
                zeroBtn.style.minWidth = "";

                const nowBtn = startSet.querySelector('[data-action="now"]');
                const firstDivider = startSet.querySelector(".time-adjust-divider");
                if (nowBtn instanceof HTMLElement && firstDivider instanceof HTMLElement) {
                    const nowRect = nowBtn.getBoundingClientRect();
                    const dividerRect = firstDivider.getBoundingClientRect();
                    const desiredSpanToDivider = Math.round(dividerRect.left - nowRect.left);
                    if (desiredSpanToDivider > 0) {
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

                const fallbackWidth = Math.max(150, Math.ceil(zeroBtn.scrollWidth + 18));
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

            deps.upgradeNativeTitleTooltips(buttonsContainer);
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

// --- File: js/modules/format-controls.js ---
(function initGtvFormatControls(globalObj) {
    "use strict";

    function createService(deps) {
        let timePartsOutsideHandlerBound = false;
        let copyFormatDragGhostEl = null;
        const requestUiFrame = (typeof globalObj.requestAnimationFrame === "function")
            ? globalObj.requestAnimationFrame.bind(globalObj)
            : ((cb) => globalObj.setTimeout(cb, 16));

        function clearCopyFormatDragGhost() {
            if (!copyFormatDragGhostEl) return;
            if (copyFormatDragGhostEl.parentNode) {
                copyFormatDragGhostEl.parentNode.removeChild(copyFormatDragGhostEl);
            }
            copyFormatDragGhostEl = null;
        }

        function createCopyFormatDragGhost(item) {
            if (!(item instanceof HTMLElement)) return null;
            clearCopyFormatDragGhost();

            const ghost = item.cloneNode(true);
            if (!(ghost instanceof HTMLElement)) return null;
            ghost.classList.remove("dragging");
            ghost.classList.add("copy-format-drag-ghost");
            ghost.querySelectorAll("input, button").forEach((el) => {
                if (el instanceof HTMLElement) el.setAttribute("tabindex", "-1");
                if ("disabled" in el) el.disabled = true;
            });

            const rect = item.getBoundingClientRect();
            ghost.style.position = "fixed";
            ghost.style.left = "-10000px";
            ghost.style.top = "-10000px";
            ghost.style.width = `${Math.max(120, Math.round(rect.width))}px`;
            ghost.style.pointerEvents = "none";
            ghost.style.zIndex = "10000";

            document.body.appendChild(ghost);
            copyFormatDragGhostEl = ghost;
            return ghost;
        }

        function captureCopyFormatItemRects(list) {
            const rectMap = new Map();
            list.querySelectorAll(".copy-format-item:not(.dragging)").forEach((item) => {
                rectMap.set(item, item.getBoundingClientRect());
            });
            return rectMap;
        }

        function animateCopyFormatReorder(list, beforeRects) {
            list.querySelectorAll(".copy-format-item:not(.dragging)").forEach((item) => {
                const before = beforeRects.get(item);
                if (!before) return;
                const after = item.getBoundingClientRect();
                const deltaX = before.left - after.left;
                const deltaY = before.top - after.top;
                if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return;

                item.style.transition = "none";
                item.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                requestUiFrame(() => {
                    item.style.transition = "transform 170ms ease";
                    item.style.transform = "";
                });
                item.addEventListener("transitionend", () => {
                    item.style.transition = "";
                }, { once: true });
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
            return deps.t(keyMap[key] || key);
        }

        function getTimePartLabel(partKey) {
            const map = {
                dn: "copy_time_part_dn",
                date: "copy_time_part_date",
                time: "copy_time_part_time",
                weekday: "copy_time_part_weekday"
            };
            return deps.t(map[partKey] || partKey);
        }

        function closeAllTimePartsMenus() {
            document.querySelectorAll(".time-parts-dropdown.open").forEach((el) => {
                el.classList.remove("open");
            });
        }

        function bindTimePartsOutsideClickHandler() {
            if (timePartsOutsideHandlerBound) return;
            document.addEventListener("click", (e) => {
                const target = e.target;
                if (typeof Element !== "undefined" && !(target instanceof Element)) return;
                if (target?.closest?.(".time-parts-dropdown")) return;
                closeAllTimePartsMenus();
            });
            timePartsOutsideHandlerBound = true;
        }

        function getCopyFormatDropTarget(container, x, y = null) {
            const draggableItems = [...container.querySelectorAll(".copy-format-item:not(.dragging)")];
            if (!draggableItems.length) return null;

            if (typeof y === "number") {
                for (const child of draggableItems) {
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
                const box = child.getBoundingClientRect();
                const offset = x - box.left - box.width / 2;
                if (offset < 0 && offset > closest.offset) return { offset, element: child };
                return closest;
            }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
        }

        function renderFormatControlList(list, order, enabled, options = {}) {
            const { onToggle, onReorder, timePartsEnabled, onTimePartToggle } = options;
            if (!list) return;

            bindTimePartsOutsideClickHandler();
            list.textContent = "";
            order.forEach((key) => {
                if (!deps.COPY_FORMAT_KEYS.includes(key)) return;

                const item = document.createElement("div");
                item.className = "copy-format-item";
                item.dataset.key = key;
                item.draggable = false;

                const dragHandle = document.createElement("span");
                dragHandle.className = "copy-format-drag";
                dragHandle.textContent = "⋮⋮";
                dragHandle.draggable = true;

                const label = document.createElement("label");
                label.className = "copy-format-item-label";

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = !!enabled[key];
                checkbox.addEventListener("change", () => {
                    if (typeof onToggle === "function") onToggle(key, checkbox.checked);
                });

                const text = document.createElement("span");
                text.textContent = getCopyFieldLabel(key);

                label.appendChild(checkbox);
                label.appendChild(text);
                item.appendChild(dragHandle);
                item.appendChild(label);

                if (key === "time") {
                    const dropdown = document.createElement("div");
                    dropdown.className = "time-parts-dropdown";

                    const partsBtn = document.createElement("button");
                    partsBtn.type = "button";
                    partsBtn.className = "time-parts-toggle-btn";
                    partsBtn.textContent = deps.t("btn_time_parts");
                    partsBtn.addEventListener("click", (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const willOpen = !dropdown.classList.contains("open");
                        closeAllTimePartsMenus();
                        if (willOpen) dropdown.classList.add("open");
                    });

                    const menu = document.createElement("div");
                    menu.className = "time-parts-menu";
                    deps.TIME_PART_KEYS.forEach((partKey) => {
                        const rowEl = document.createElement("label");
                        rowEl.className = "time-parts-option";

                        const cb = document.createElement("input");
                        cb.type = "checkbox";
                        cb.checked = !!timePartsEnabled?.[partKey];
                        cb.addEventListener("change", () => {
                            if (typeof onTimePartToggle === "function") onTimePartToggle(partKey, cb.checked);
                        });

                        const txt = document.createElement("span");
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
                    item.classList.add("dragging");
                    if (e.dataTransfer) {
                        e.dataTransfer.effectAllowed = "move";
                        e.dataTransfer.setData("text/plain", key);
                        const ghost = createCopyFormatDragGhost(item);
                        e.dataTransfer.setDragImage(ghost || item, 12, 12);
                    }
                });
                dragHandle.addEventListener("dragend", () => {
                    item.classList.remove("dragging");
                    clearCopyFormatDragGhost();
                    const nextOrder = [...list.querySelectorAll(".copy-format-item")].map((el) => el.dataset.key);
                    if (typeof onReorder === "function") onReorder(nextOrder);
                });

                list.appendChild(item);
            });

            list.ondragover = (e) => {
                const dragging = list.querySelector(".copy-format-item.dragging");
                if (!dragging) return;
                e.preventDefault();
                const beforeRects = captureCopyFormatItemRects(list);
                const after = getCopyFormatDropTarget(list, e.clientX, e.clientY);
                if (after === dragging || dragging.nextElementSibling === after) return;
                list.insertBefore(dragging, after);
                animateCopyFormatReorder(list, beforeRects);
            };
            list.ondrop = (e) => {
                const dragging = list.querySelector(".copy-format-item.dragging");
                if (!dragging) return;
                e.preventDefault();
                clearCopyFormatDragGhost();
            };
        }

        function renderCopyFormatControls() {
            const row = document.getElementById("copy-format-row");
            const displayList = document.getElementById("display-format-list");
            const copyList = document.getElementById("copy-format-list");
            if (!row || !displayList || !copyList) return;

            row.style.display = deps.isShowCopyFormat() ? "flex" : "none";
            if (!deps.isShowCopyFormat()) {
                displayList.textContent = "";
                copyList.textContent = "";
                deps.updateCopyFormatPreview();
                return;
            }

            renderFormatControlList(displayList, deps.getDisplayFormatOrder(), deps.getDisplayFormatEnabled(), {
                onToggle: (key, checked) => {
                    deps.setDisplayFormatEnabled({
                        ...deps.getDisplayFormatEnabled(),
                        [key]: checked
                    });
                    deps.renderList();
                    deps.updateCopyFormatPreview();
                    deps.savePersistence();
                },
                onReorder: (nextOrder) => {
                    deps.setDisplayFormatOrder(deps.sanitizeCopyFormatOrder(nextOrder));
                    deps.renderList();
                    deps.updateCopyFormatPreview();
                    deps.savePersistence();
                },
                timePartsEnabled: deps.getDisplayTimePartsEnabled(),
                onTimePartToggle: (partKey, checked) => {
                    deps.setDisplayTimePartsEnabled({
                        ...deps.getDisplayTimePartsEnabled(),
                        [partKey]: checked
                    });
                    deps.renderList();
                    deps.updateCopyFormatPreview();
                    deps.savePersistence();
                }
            });

            renderFormatControlList(copyList, deps.getCopyFormatOrder(), deps.getCopyFormatEnabled(), {
                onToggle: (key, checked) => {
                    deps.setCopyFormatEnabled({
                        ...deps.getCopyFormatEnabled(),
                        [key]: checked
                    });
                    deps.updateCopyFormatPreview();
                    deps.savePersistence();
                },
                onReorder: (nextOrder) => {
                    deps.setCopyFormatOrder(deps.sanitizeCopyFormatOrder(nextOrder));
                    deps.updateCopyFormatPreview();
                    deps.savePersistence();
                },
                timePartsEnabled: deps.getCopyTimePartsEnabled(),
                onTimePartToggle: (partKey, checked) => {
                    deps.setCopyTimePartsEnabled({
                        ...deps.getCopyTimePartsEnabled(),
                        [partKey]: checked
                    });
                    deps.updateCopyFormatPreview();
                    deps.savePersistence();
                }
            });
            deps.updateCopyFormatPreview();
            deps.upgradeNativeTitleTooltips(row);
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
        function refreshOptionToggleDividers() {
            const optionRow = document.getElementById("control-option-row");
            if (!optionRow) return;
            const optionGroups = [...optionRow.querySelectorAll(".option-toggle-group")];
            optionGroups.forEach((group) => group.classList.remove("option-with-divider"));
            const visibleGroups = optionGroups.filter((group) => group.style.display !== "none");
            visibleGroups.forEach((group, idx) => {
                if (idx < visibleGroups.length - 1) group.classList.add("option-with-divider");
            });
        }

        function updateOptionRowVisibility() {
            const optionRow = document.getElementById("control-option-row");
            if (!optionRow) return;

            const extraTimeGroup = document.getElementById("toggle-extra-time")?.closest(".control-group");
            const copyFormatGroup = document.getElementById("toggle-copy-format")?.closest(".control-group");
            const timelineGroup = document.getElementById("toggle-timeline")?.closest(".control-group");
            const rangeCountGroup = document.getElementById("multi-range-count-group");
            const multiToolsRow = document.getElementById("multi-tools-row");
            const multiSubgroupRow = document.getElementById("multi-subgroup-row");
            const multiControlsFrame = document.getElementById("multi-controls-frame");
            const saveTableImageBtn = document.getElementById("save-table-image-btn");
            const saveTimelineImageBtn = document.getElementById("save-timeline-image-btn");
            const saveMultiRangeTitlesImageBtn = document.getElementById("save-multi-range-titles-image-btn");
            const saveMultiRangeByRangeImageBtn = document.getElementById("save-multi-range-by-range-image-btn");
            const isMulti = deps.isMultiTab();
            const isRealtime = deps.getIsRealtime();

            optionRow.style.display = "flex";
            if (extraTimeGroup) extraTimeGroup.style.display = (isRealtime || isMulti) ? "none" : "flex";
            if (copyFormatGroup) copyFormatGroup.style.display = "flex";
            if (timelineGroup) timelineGroup.style.display = isMulti ? "none" : "flex";
            if (rangeCountGroup) rangeCountGroup.style.display = isMulti ? "flex" : "none";
            if (multiControlsFrame) multiControlsFrame.style.display = isMulti ? "block" : "none";
            if (multiSubgroupRow) multiSubgroupRow.style.display = isMulti ? "flex" : "none";
            if (multiToolsRow) multiToolsRow.style.display = isMulti ? "flex" : "none";
            if (saveTableImageBtn) saveTableImageBtn.style.display = isMulti ? "none" : "";
            if (saveTimelineImageBtn) saveTimelineImageBtn.style.display = isMulti ? "none" : (deps.getShowTimeline() ? "inline-flex" : "none");
            if (saveMultiRangeTitlesImageBtn) saveMultiRangeTitlesImageBtn.style.display = isMulti ? "" : "none";
            if (saveMultiRangeByRangeImageBtn) saveMultiRangeByRangeImageBtn.style.display = isMulti ? "" : "none";
            deps.refreshMultiRangeControls();
            refreshOptionToggleDividers();
        }

        function switchMainTab(tab) {
            const nextTab = deps.sanitizeMainTab(tab);
            deps.hideFloatingTooltip();
            deps.syncCurrentMultiStateToActiveSubgroup();

            let currentMainTab = deps.getCurrentMainTab();
            let activeGroupId = deps.getActiveGroupId();
            const activeGroupIdByMainTab = {
                live: 0,
                fixed: 0,
                ...(deps.getActiveGroupIdByMainTab() || {})
            };

            if (currentMainTab === "live" || currentMainTab === "fixed") {
                activeGroupIdByMainTab[currentMainTab] = deps.clampGroupIndex(activeGroupId);
            }

            currentMainTab = nextTab;
            if (currentMainTab === "live" || currentMainTab === "fixed") {
                activeGroupId = deps.clampGroupIndex(activeGroupIdByMainTab[currentMainTab]);
            } else {
                activeGroupId = deps.clampGroupIndex(activeGroupId);
            }

            deps.setCurrentMainTab(currentMainTab);
            deps.setActiveGroupId(activeGroupId);
            deps.setActiveGroupIdByMainTab(activeGroupIdByMainTab);
            deps.normalizeGroupTabState();

            document.querySelectorAll(".nav-item").forEach((btn) => {
                btn.classList.toggle("active", btn.dataset.tab === currentMainTab);
            });
            const isMulti = deps.isMultiTab();
            const isCalc = currentMainTab === "calc";
            document.getElementById("timezone-section")?.classList.toggle("active", !isCalc && !isMulti);
            document.getElementById("multi-range-section")?.classList.toggle("active", isMulti);
            document.getElementById("calc-section")?.classList.toggle("active", isCalc);
            const groupTabsContainer = document.getElementById("group-tabs-container");
            if (groupTabsContainer) groupTabsContainer.style.display = isCalc ? "none" : "flex";
            const topControlBar = document.getElementById("top-control-bar");
            if (topControlBar) topControlBar.style.display = isCalc ? "none" : "flex";

            deps.setIsRealtime(currentMainTab === "live");
            const isRealtime = deps.getIsRealtime();
            if (isRealtime && typeof deps.syncRealtimeNow === "function") {
                deps.syncRealtimeNow();
            }
            const extraTimeToggle = document.getElementById("toggle-extra-time");
            const copyFormatToggle = document.getElementById("toggle-copy-format");
            const timelineToggle = document.getElementById("toggle-timeline");

            const statusText = document.getElementById("status-text");
            if (statusText) {
                if (isRealtime) statusText.textContent = deps.t("status_sync");
                else if (isMulti) statusText.textContent = deps.t("status_multi");
                else statusText.textContent = deps.t("status_fixed");
            }

            if (extraTimeToggle) {
                extraTimeToggle.disabled = isRealtime || isMulti;
                if (isRealtime) extraTimeToggle.checked = false;
                else if (isMulti) extraTimeToggle.checked = true;
                else extraTimeToggle.checked = (deps.getSlotCount() > 1);
            }

            if (copyFormatToggle) {
                copyFormatToggle.checked = deps.getShowCopyFormat();
            }
            if (timelineToggle) {
                timelineToggle.checked = deps.getShowTimeline();
            }
            updateOptionRowVisibility();
            deps.renderTimelineFrame();

            if (isMulti) {
                deps.renderBaseTimeSelect();
                deps.loadCurrentMultiStateFromActiveSubgroup();
            }
            deps.renderGroups();
            deps.renderMultiSubgroups();
            if (isMulti) {
                deps.renderMultiRanges();
            } else {
                deps.renderList();
                deps.updateTimeAdjustPanel();
            }
            deps.renderCopyFormatControls();
            deps.savePersistence();
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

// --- File: js/modules/state-persistence.js ---
(function initGtvStatePersistence(globalObj) {
    "use strict";

    function createService(deps) {
        let lastPersistenceErrorToastAt = 0;

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

        async function setStorageValue(key, value, options = {}) {
            const { suppressToast = false } = options;
            try {
                const storage = getStorageLocal();
                if (storage) {
                    await storage.set({ [key]: value });
                } else {
                    localStorage.setItem(key, value);
                }
                return { ok: true, error: null };
            } catch (err) {
                console.error(`Failed to write storage key "${key}".`, err);
                if (!suppressToast) showPersistenceErrorToast(err);
                return { ok: false, error: err };
            }
        }

        async function getStorageValue(key, fallback = null) {
            try {
                const storage = getStorageLocal();
                if (storage) {
                    const data = await storage.get(key);
                    if (data && data[key] !== undefined) return data[key];
                }
                return localStorage.getItem(key) ?? fallback;
            } catch (err) {
                console.warn(`Failed to read storage key "${key}". Falling back to localStorage.`, err);
                return localStorage.getItem(key) ?? fallback;
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

        async function savePersistence(options = {}) {
            const snapshot = deps.getPersistenceSnapshot();
            const result = await persistStorageSnapshot(snapshot, options);
            return result.ok;
        }

        function getDefaultGroups() {
            const defaultGroup = {
                name: deps.t("default_group_name"),
                zones: [],
                baseTimezoneId: "utc",
                showUtcRow: true,
                utcRowOrder: 0
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
                serialized = localStorage.getItem(deps.STORAGE_KEY);
            }

            const legacyFallbackKeys = Array.isArray(deps.LEGACY_STORAGE_FALLBACK_KEYS)
                ? deps.LEGACY_STORAGE_FALLBACK_KEYS
                : deps.LEGACY_STORAGE_KEYS;
            if (!serialized) {
                for (const key of legacyFallbackKeys) {
                    const legacy = localStorage.getItem(key);
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

                if (currentMainTab === "live" || currentMainTab === "fixed") {
                    activeGroupId = activeGroupIdByMainTab[currentMainTab];
                }

                deps.setState({
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
                });

                deps.loadCurrentMultiStateFromActiveSubgroup();
                deps.ensureBaseTimezoneSelection();
            } catch (err) {
                console.warn("Failed to parse persisted data. Falling back to defaults.", err);
                applyDefaultPersistenceState();
                savePersistence();
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
            keysToRemove.forEach((key) => localStorage.removeItem(key));
            location.reload();
        }

        async function resetExceptGroupsAndTimezones() {
            if (!confirm(deps.t("confirm_reset_except_group_tz"))) return;

            deps.syncCurrentMultiStateToActiveSubgroup();
            const currentState = deps.getState();
            const preservedGroups = currentState.groups
                .map((group, idx) => deps.sanitizeGroup({
                    name: group?.name,
                    zones: group?.zones,
                    baseTimezoneId: group?.baseTimezoneId,
                    showUtcRow: group?.showUtcRow,
                    utcRowOrder: group?.utcRowOrder
                }, idx, null))
                .filter(Boolean);

            const groups = preservedGroups.length ? preservedGroups : getDefaultGroups();
            groups.forEach((group) => deps.ensureGroupMultiSubgroups(group));

            deps.setState({
                groups,
                activeGroupId: 0,
                currentMainTab: "live",
                activeGroupIdByMainTab: { live: 0, fixed: 0 },
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
            keysToRemove.forEach((key) => localStorage.removeItem(key));
            localStorage.removeItem(deps.STORAGE_KEY);

            const currentTheme = await deps.loadThemePreference();
            let nextLang = "ko";

            try {
                const storage = getStorageLocal();
                if (storage) {
                    const d = await storage.get(deps.LANG_STORAGE_KEY);
                    nextLang = d[deps.LANG_STORAGE_KEY] || localStorage.getItem(deps.LANG_STORAGE_KEY) || "ko";
                } else {
                    nextLang = localStorage.getItem(deps.LANG_STORAGE_KEY) || "ko";
                }
            } catch (e) {
                nextLang = localStorage.getItem(deps.LANG_STORAGE_KEY) || "ko";
            }

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
            savePersistence();
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
            loadPersistence
        });
    }

    globalObj.GTVStatePersistence = Object.freeze({
        createService
    });
})(typeof window !== "undefined" ? window : globalThis);

// --- File: js/modules/settings-io.js ---
(function initGtvSettingsIo(globalObj) {
    "use strict";

    function createService(deps) {
        function ensureImportedGroupsFallbackToStandardTime() {
            let changed = false;
            const groups = deps.getGroups();
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

            const writeResult = await deps.persistStorageSnapshot(payload, { suppressToast: true });
            if (!writeResult.ok) {
                const persistErr = new Error("Failed to persist imported settings payload");
                persistErr.code = "PERSISTENCE_WRITE_FAILED";
                persistErr.cause = writeResult.error;
                throw persistErr;
            }

            const pref = (importedRoot && typeof importedRoot === "object" && importedRoot.preferences && typeof importedRoot.preferences === "object")
                ? importedRoot.preferences
                : importedRoot;

            if (pref && typeof pref === "object") {
                if (typeof pref.theme === "string") {
                    await deps.setStorageValue(deps.THEME_STORAGE_KEY, deps.sanitizeTheme(pref.theme), { suppressToast: true });
                }
                if (typeof pref.language === "string" && deps.I18N_DATA[pref.language]) {
                    await deps.setStorageValue(deps.LANG_STORAGE_KEY, pref.language, { suppressToast: true });
                }
                if (pref.uiScale !== undefined) {
                    await deps.setStorageValue(deps.UI_SCALE_STORAGE_KEY, String(deps.sanitizeUiScalePercent(pref.uiScale)), { suppressToast: true });
                }
            }

            const nextLang = localStorage.getItem(deps.LANG_STORAGE_KEY) || "ko";
            deps.setCurrentLang(deps.I18N_DATA[nextLang] ? nextLang : "ko");
            await deps.loadPersistence();
            if (deps.localizeAutoGeneratedNamesForCurrentLanguage()) {
                await deps.savePersistence();
            }
            if (ensureImportedGroupsFallbackToStandardTime()) {
                await deps.savePersistence();
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

        function getSettingsExportFileName() {
            const now = new Date();
            const stamp = `${now.getFullYear()}-${deps.pad(now.getMonth() + 1)}-${deps.pad(now.getDate())}_${deps.pad(now.getHours())}${deps.pad(now.getMinutes())}${deps.pad(now.getSeconds())}`;
            return `GlobalTimeViewer_settings_${stamp}.json`;
        }

        function getGroupExportFileName(groupName = "") {
            const now = new Date();
            const stamp = `${now.getFullYear()}-${deps.pad(now.getMonth() + 1)}-${deps.pad(now.getDate())}_${deps.pad(now.getHours())}${deps.pad(now.getMinutes())}${deps.pad(now.getSeconds())}`;
            const safeName = deps.sanitizeFilenamePart(groupName || "") || "group";
            return `GlobalTimeViewer_group_${safeName}_${stamp}.json`;
        }

        function getSubgroupExportFileName(groupName = "", subgroupName = "") {
            const now = new Date();
            const stamp = `${now.getFullYear()}-${deps.pad(now.getMonth() + 1)}-${deps.pad(now.getDate())}_${deps.pad(now.getHours())}${deps.pad(now.getMinutes())}${deps.pad(now.getSeconds())}`;
            const safeGroupName = deps.sanitizeFilenamePart(groupName || "") || "group";
            const safeSubgroupName = deps.sanitizeFilenamePart(subgroupName || "") || "subgroup";
            return `GlobalTimeViewer_subgroup_${safeGroupName}_${safeSubgroupName}_${stamp}.json`;
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

        function applyImportedGroupSettings(importedRoot, targetGroupIdx = deps.getActiveGroupId()) {
            const groups = deps.getGroups();
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
            deps.savePersistence();
            deps.renderGroups();
            deps.renderMultiSubgroups();
            if (deps.isMultiTab()) {
                deps.renderBaseTimeSelect();
                deps.renderMultiRanges();
            } else {
                deps.renderList();
            }
        }

        function applyImportedSubgroupSettings(importedRoot, targetGroupIdx = deps.getActiveGroupId(), targetSubgroupId = "") {
            const groups = deps.getGroups();
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
            deps.savePersistence();
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
            const groups = deps.getGroups();
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
                    activeMultiSubgroupId: sourceGroup.activeMultiSubgroupId,
                    multiSubgroups: sourceGroup.multiSubgroups
                };
                const fileName = getGroupExportFileName(sourceGroup.name);
                const exportPayload = {
                    app: "GlobalTimeViewer",
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
            const groups = deps.getGroups();
            if (!groups.length) return;
            const safeIdx = Math.min(Math.max(parseInt(groupIdx, 10) || 0, 0), groups.length - 1);
            pendingGroupImportIndex = safeIdx;
            const groupImportFile = document.getElementById("group-import-file");
            if (!groupImportFile) return;
            groupImportFile.value = "";
            groupImportFile.click();
        }

        async function handleGroupImportFile(event) {
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
                applyImportedGroupSettings(parsed, pendingGroupImportIndex ?? deps.getActiveGroupId());
                deps.showToast(deps.tFormat("toast_group_import_success", { filename: file.name || getGroupExportFileName("group") }));
            } catch (err) {
                console.error("handleGroupImportFile failed:", err);
                if (err.message === "Invalid group payload" || err.message === "Invalid group payload type") {
                    deps.showToast(deps.t("toast_invalid_format"));
                } else {
                    deps.showToast(deps.t("toast_group_import_failed"));
                }
            } finally {
                pendingGroupImportIndex = null;
                if (input) input.value = "";
            }
        }

        function exportSubgroupToJSON(groupIdx = deps.getActiveGroupId(), subgroupId = "") {
            const groups = deps.getGroups();
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
                    app: "GlobalTimeViewer",
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
            const groups = deps.getGroups();
            if (!groups.length) return;
            const safeGroupIdx = Math.min(Math.max(parseInt(groupIdx, 10) || 0, 0), groups.length - 1);
            const group = groups[safeGroupIdx];
            if (!group) return;
            deps.ensureGroupMultiSubgroups(group);
            const targetSubgroupId = deps.sanitizeMultiSubgroupId(subgroupId) || group.activeMultiSubgroupId;
            const exists = group.multiSubgroups.some((item) => item.id === targetSubgroupId);
            if (!exists) return;

            pendingSubgroupImportTarget = { groupIdx: safeGroupIdx, subgroupId: targetSubgroupId };
            const subgroupImportFile = document.getElementById("subgroup-import-file");
            if (!subgroupImportFile) return;
            subgroupImportFile.value = "";
            subgroupImportFile.click();
        }

        async function handleSubgroupImportFile(event) {
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
                const target = pendingSubgroupImportTarget || { groupIdx: deps.getActiveGroupId(), subgroupId: deps.getCurrentMultiSubgroup()?.id || "" };
                applyImportedSubgroupSettings(parsed, target.groupIdx, target.subgroupId);
                deps.showToast(deps.tFormat("toast_subgroup_import_success", { filename: file.name || getSubgroupExportFileName("group", "subgroup") }));
            } catch (err) {
                console.error("handleSubgroupImportFile failed:", err);
                if (err.message === "Invalid subgroup payload" || err.message === "Invalid subgroup payload type") {
                    deps.showToast(deps.t("toast_invalid_format"));
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
                    app: "GlobalTimeViewer",
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
window.isRealtime = true;
let isRealtime = window.isRealtime;
let globalTimes = [new Date(), new Date()];
let slotCount = 1;
let uiScale = 1.0;
let showCopyFormat = false;
let showTimeline = false;
const COPY_FORMAT_KEYS = ["timezone", "region", "offset", "time", "period_days", "period_time"];
const TIME_PART_KEYS = ["dn", "date", "time", "weekday"];
const PERIOD_RESULT_IDS = new Set(["period-res", "period-hour-res", "period-min-res", "period-sec-res"]);
const MAIN_TABS = ["live", "fixed", "multi", "calc"];
const TIMELINE_TOTAL_HOURS = 24;
const TIMELINE_TOTAL_SECONDS = 24 * 60 * 60;
const requestUiFrame = (typeof requestAnimationFrame === "function")
    ? requestAnimationFrame.bind(globalThis)
    : ((cb) => setTimeout(cb, 16));
const cancelUiFrame = (typeof cancelAnimationFrame === "function")
    ? cancelAnimationFrame.bind(globalThis)
    : ((id) => clearTimeout(id));
const MIN_TIME_ADJUST_DAY_STEP = 1;
const MAX_TIME_ADJUST_DAY_STEP = 36500;
const DEFAULT_TIME_ADJUST_DAY_STEP = 1;
const MIN_MULTI_RANGE_COUNT = 1;
const MAX_MULTI_RANGE_COUNT = 12;
const DEFAULT_MULTI_RANGE_TITLE = "Range";
const DEFAULT_DISPLAY_FORMAT_ENABLED = {
    timezone: true,
    region: true,
    offset: true,
    time: true,
    period_days: false,
    period_time: true
};
const DEFAULT_COPY_FORMAT_ENABLED = {
    timezone: true,
    region: true,
    offset: true,
    time: true,
    period_days: false,
    period_time: true
};
const DEFAULT_DISPLAY_TIME_PARTS_ENABLED = {
    dn: true,
    date: true,
    time: true,
    weekday: true
};
const DEFAULT_COPY_TIME_PARTS_ENABLED = {
    dn: false,
    date: true,
    time: true,
    weekday: false
};
let displayFormatOrder = [...COPY_FORMAT_KEYS];
let displayFormatEnabled = { ...DEFAULT_DISPLAY_FORMAT_ENABLED };
let copyFormatOrder = [...COPY_FORMAT_KEYS];
let copyFormatEnabled = { ...DEFAULT_COPY_FORMAT_ENABLED };
let displayTimePartsEnabled = { ...DEFAULT_DISPLAY_TIME_PARTS_ENABLED };
let copyTimePartsEnabled = { ...DEFAULT_COPY_TIME_PARTS_ENABLED };
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
let floatingTooltipEl = null;
let floatingTooltipTarget = null;
let floatingTooltipBound = false;
let timelineDragState = null;
let dragGhostEl = null;
const GTV_TIME_CORE = (typeof window !== "undefined" ? window.GTVTimeCore : globalThis.GTVTimeCore);
const GTV_CALCULATOR = (typeof window !== "undefined" ? window.GTVCalculator : globalThis.GTVCalculator);
const GTV_MULTI_STATE = (typeof window !== "undefined" ? window.GTVMultiState : globalThis.GTVMultiState);
const GTV_IMAGE_EXPORT = (typeof window !== "undefined" ? window.GTVImageExport : globalThis.GTVImageExport);
const GTV_GROUP_STATE = (typeof window !== "undefined" ? window.GTVGroupState : globalThis.GTVGroupState);
const GTV_GROUP_TABS = (typeof window !== "undefined" ? window.GTVGroupTabs : globalThis.GTVGroupTabs);
const GTV_TIMEZONE_SEARCH = (typeof window !== "undefined" ? window.GTVTimezoneSearch : globalThis.GTVTimezoneSearch);
const GTV_SNAPSHOT_FORMAT = (typeof window !== "undefined" ? window.GTVSnapshotFormat : globalThis.GTVSnapshotFormat);
const GTV_TABLE_RENDER = (typeof window !== "undefined" ? window.GTVTableRender : globalThis.GTVTableRender);
const GTV_MULTI_RANGE_RENDER = (typeof window !== "undefined" ? window.GTVMultiRangeRender : globalThis.GTVMultiRangeRender);
const GTV_MULTI_RANGE_COPY = (typeof window !== "undefined" ? window.GTVMultiRangeCopy : globalThis.GTVMultiRangeCopy);
const GTV_COPY_ACTIONS = (typeof window !== "undefined" ? window.GTVCopyActions : globalThis.GTVCopyActions);
const GTV_TIME_ADJUST_UI = (typeof window !== "undefined" ? window.GTVTimeAdjustUI : globalThis.GTVTimeAdjustUI);
const GTV_FORMAT_CONTROLS = (typeof window !== "undefined" ? window.GTVFormatControls : globalThis.GTVFormatControls);
const GTV_TAB_UI = (typeof window !== "undefined" ? window.GTVTabUI : globalThis.GTVTabUI);
const GTV_STATE_PERSISTENCE = (typeof window !== "undefined" ? window.GTVStatePersistence : globalThis.GTVStatePersistence);
const GTV_SETTINGS_IO = (typeof window !== "undefined" ? window.GTVSettingsIO : globalThis.GTVSettingsIO);
const GTV_DATA_TRANSFER = (typeof window !== "undefined" ? window.GTVDataTransfer : globalThis.GTVDataTransfer);
const GTV_APP_CONFIG = (typeof window !== "undefined" ? window.GTVAppConfig : globalThis.GTVAppConfig);
if (!GTV_TIME_CORE) {
    throw new Error("Missing required module: GTVTimeCore");
}
if (!GTV_IMAGE_EXPORT) {
    throw new Error("Missing required module: GTVImageExport");
}
if (!GTV_MULTI_STATE || typeof GTV_MULTI_STATE.createService !== "function") {
    throw new Error("Missing required module API: GTVMultiState.createService");
}
if (!GTV_GROUP_STATE || typeof GTV_GROUP_STATE.createService !== "function") {
    throw new Error("Missing required module API: GTVGroupState.createService");
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
if (!GTV_FORMAT_CONTROLS || typeof GTV_FORMAT_CONTROLS.createService !== "function") {
    throw new Error("Missing required module API: GTVFormatControls.createService");
}
if (!GTV_TAB_UI || typeof GTV_TAB_UI.createService !== "function") {
    throw new Error("Missing required module API: GTVTabUI.createService");
}
if (!GTV_STATE_PERSISTENCE || typeof GTV_STATE_PERSISTENCE.createService !== "function") {
    throw new Error("Missing required module API: GTVStatePersistence.createService");
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

function applyVersionBranding() {
    const titleText = `Global Time v${VERSION}`;
    document.title = titleText;
    const badge = document.getElementById("version-badge");
    if (badge) badge.textContent = `ver ${VERSION}`;
}

function setCustomTooltip(el, text) {
    if (!(el instanceof Element)) return;
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
    if (!root) return;
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
    if (!(floatingTooltipTarget instanceof Element) || !floatingTooltipTarget.isConnected) {
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
    if (!(target instanceof Element)) {
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
    if (!(row instanceof HTMLElement)) return null;
    clearDragGhost();

    const ghostTable = document.createElement("table");
    ghostTable.className = "data-table drag-ghost-table";
    ghostTable.setAttribute("aria-hidden", "true");

    const ghostBody = document.createElement("tbody");
    const ghostRow = row.cloneNode(true);
    if (ghostRow instanceof HTMLElement) {
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
        const target = e.target instanceof Element ? e.target.closest("[data-tooltip]") : null;
        if (!target) return;
        showFloatingTooltip(target);
    }, true);

    document.addEventListener("pointerleave", (e) => {
        const target = e.target instanceof Element ? e.target.closest("[data-tooltip]") : null;
        if (!target) return;
        const relatedTarget = e.relatedTarget;
        if (relatedTarget instanceof Element && target.contains(relatedTarget)) return;
        if (floatingTooltipTarget === target) hideFloatingTooltip();
    }, true);

    document.addEventListener("focusin", (e) => {
        const target = e.target instanceof Element ? e.target.closest("[data-tooltip]") : null;
        if (!target) return;
        showFloatingTooltip(target);
    }, true);

    document.addEventListener("focusout", (e) => {
        const target = e.target instanceof Element ? e.target.closest("[data-tooltip]") : null;
        if (!target) return;
        const relatedTarget = e.relatedTarget;
        if (relatedTarget instanceof Element && target.contains(relatedTarget)) return;
        if (floatingTooltipTarget === target) hideFloatingTooltip();
    }, true);

    window.addEventListener("scroll", positionFloatingTooltip, true);
    window.addEventListener("resize", positionFloatingTooltip, true);
    document.addEventListener("pointerdown", hideFloatingTooltip, true);
    document.addEventListener("keydown", hideFloatingTooltip, true);
}

// --- ???袁⒲?筌띾뙫怨롪뗄?샕 ?怨쀬뵠??(Extensive Mapping for Abbr) ---
const TZ_DATABASE = [
    { zone: "Asia/Seoul", name: "대한민국", city: "서울", name_en: "South Korea", city_en: "Seoul" },
    { zone: "Asia/Tokyo", name: "일본", city: "도쿄", name_en: "Japan", city_en: "Tokyo" },
    { zone: "Asia/Shanghai", name: "중국", city: "상하이", name_en: "China", city_en: "Shanghai" },
    { zone: "Asia/Hong_Kong", name: "홍콩", city: "홍콩", name_en: "Hong Kong", city_en: "Hong Kong" },
    { zone: "Asia/Singapore", name: "싱가포르", city: "싱가포르", name_en: "Singapore", city_en: "Singapore" },
    { zone: "Asia/Taipei", name: "대만", city: "타이베이", name_en: "Taiwan", city_en: "Taipei" },
    { zone: "Asia/Bangkok", name: "태국", city: "방콕", name_en: "Thailand", city_en: "Bangkok" },
    { zone: "Asia/Ho_Chi_Minh", name: "베트남", city: "호치민", name_en: "Vietnam", city_en: "Ho Chi Minh" },
    { zone: "Asia/Jakarta", name: "인도네시아", city: "자카르타", name_en: "Indonesia", city_en: "Jakarta" },
    { zone: "Asia/Dubai", name: "아랍에미리트", city: "두바이", name_en: "UAE", city_en: "Dubai" },
    { zone: "Asia/Kolkata", name: "인도", city: "뉴델리", name_en: "India", city_en: "New Delhi" },
    { zone: "Europe/London", name: "영국", city: "런던", name_en: "UK", city_en: "London" },
    { zone: "Europe/Paris", name: "프랑스", city: "파리", name_en: "France", city_en: "Paris" },
    { zone: "Europe/Berlin", name: "독일", city: "베를린", name_en: "Germany", city_en: "Berlin" },
    { zone: "Europe/Moscow", name: "러시아", city: "모스크바", name_en: "Russia", city_en: "Moscow" },
    { zone: "Europe/Istanbul", name: "튀르키예", city: "이스탄불", name_en: "Turkey", city_en: "Istanbul" },
    { zone: "America/New_York", name: "미국", city: "뉴욕", name_en: "USA", city_en: "New York" },
    { zone: "America/Chicago", name: "미국", city: "시카고", name_en: "USA", city_en: "Chicago" },
    { zone: "America/Los_Angeles", name: "미국", city: "로스앤젤레스", name_en: "USA", city_en: "Los Angeles" },
    { zone: "America/Mexico_City", name: "멕시코", city: "멕시코시티", name_en: "Mexico", city_en: "Mexico City" },
    { zone: "America/Sao_Paulo", name: "브라질", city: "상파울루", name_en: "Brazil", city_en: "Sao Paulo" },
    { zone: "Australia/Sydney", name: "호주", city: "시드니", name_en: "Australia", city_en: "Sydney" },
    { zone: "Australia/Perth", name: "호주", city: "퍼스", name_en: "Australia", city_en: "Perth" },
    { zone: "Pacific/Auckland", name: "뉴질랜드", city: "오클랜드", name_en: "New Zealand", city_en: "Auckland" }
];

function getLocalizedTZLabel(tzData) {
    if (currentLang === "en") {
        return `${tzData.name_en} - ${tzData.city_en}`;
    }
    return `${tzData.name} - ${tzData.city}`;
}

function formatUtcOffsetLabel(totalMinutes = 0) {
    return timezoneSearchService.formatUtcOffsetLabel(totalMinutes);
}

function normalizeZoneAbbreviation(value) {
    return timezoneSearchService.normalizeZoneAbbreviation(value);
}

function getAllSupportedTimezoneNames() {
    return timezoneSearchService.getAllSupportedTimezoneNames();
}

function getSelectableTZEntries() {
    return timezoneSearchService.getSelectableTZEntries();
}

function getStandardTimezoneEntries() {
    return timezoneSearchService.getStandardTimezoneEntries();
}

function queueStandardTimezoneWarmup() {
    return timezoneSearchService.queueStandardTimezoneWarmup();
}

function getTimezoneEntryTitle(entry) {
    return timezoneSearchService.getTimezoneEntryTitle(entry);
}

function getSelectableTZEntryByKey(entryKey) {
    return timezoneSearchService.getSelectableTZEntryByKey(entryKey);
}

function getSelectableTZOptionLabel(entry) {
    return timezoneSearchService.getSelectableTZOptionLabel(entry);
}

function sanitizeFullTimezoneOverlayTab(value) {
    return timezoneSearchService.sanitizeFullTimezoneOverlayTab(value);
}

function renderFullTimezoneOverlayList() {
    return timezoneSearchService.renderFullTimezoneOverlayList();
}

function updateFullTimezoneOverlayTabButtons() {
    return timezoneSearchService.updateFullTimezoneOverlayTabButtons();
}

function setFullTimezoneOverlayTab(value) {
    return timezoneSearchService.setFullTimezoneOverlayTab(value);
}

function normalizeCustomAbbr(value) {
    const trimmed = (value || "").trim();
    if (!trimmed) return t("label_custom");
    return trimmed.toUpperCase().slice(0, 12);
}

function getCurrentGroup() {
    return groups[activeGroupId] || null;
}

function sanitizeTimezoneId(value) {
    return GTV_TIME_CORE.sanitizeTimezoneId(value);
}

function sanitizeBaseTimezoneId(value) {
    return GTV_TIME_CORE.sanitizeBaseTimezoneId(value);
}

function sanitizeUtcRowOrder(value) {
    return GTV_TIME_CORE.sanitizeUtcRowOrder(value);
}

function getCurrentGroupBaseTimezoneId() {
    const group = getCurrentGroup();
    if (!group) return "utc";
    return sanitizeBaseTimezoneId(group.baseTimezoneId);
}

function setCurrentGroupBaseTimezoneId(value) {
    const group = getCurrentGroup();
    if (!group) return false;
    group.baseTimezoneId = sanitizeBaseTimezoneId(value);
    return true;
}

function getCurrentGroupZones() {
    return getCurrentGroup()?.zones || [];
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

function sanitizeMultiSubgroupId(value) {
    return multiStateService.sanitizeMultiSubgroupId(value);
}

function sanitizeMultiSubgroupName(value, fallback = "") {
    return multiStateService.sanitizeMultiSubgroupName(value, fallback);
}

function getDefaultMultiSubgroupName(index = 0) {
    return multiStateService.getDefaultMultiSubgroupName(index);
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

    const groupBaseCandidates = ["Default Group", "湲곕낯 洹몃９"];
    const subgroupBaseCandidates = ["Subgroup", "Aux Group", "?쒕툕 洹몃９", "蹂댁“ 洹몃９"];
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

        ensureGroupMultiSubgroups(group);
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

function getUsedMultiSubgroupIds() {
    return multiStateService.getUsedMultiSubgroupIds();
}

function createUniqueMultiSubgroupId(prefix = "subgroup") {
    return multiStateService.createUniqueMultiSubgroupId(prefix);
}

function sanitizeMultiStatePayload(rawState = null, fallbackState = null) {
    return multiStateService.sanitizeMultiStatePayload(rawState, fallbackState);
}

function createMultiSubgroupState(name = "", index = 0, state = null) {
    return multiStateService.createMultiSubgroupState(name, index, state);
}

function ensureGroupMultiSubgroups(group, options = {}) {
    return multiStateService.ensureGroupMultiSubgroups(group, options);
}

function getCurrentGroupMultiSubgroups() {
    const group = getCurrentGroup();
    if (!group) return [];
    ensureGroupMultiSubgroups(group);
    return group.multiSubgroups;
}

function getCurrentMultiSubgroup() {
    const group = getCurrentGroup();
    if (!group) return null;
    ensureGroupMultiSubgroups(group);
    return group.multiSubgroups.find((subgroup) => subgroup.id === group.activeMultiSubgroupId) || group.multiSubgroups[0] || null;
}

function getCurrentMultiSubgroupName() {
    const subgroup = getCurrentMultiSubgroup();
    return sanitizeMultiSubgroupName(subgroup?.name, getDefaultMultiSubgroupName(0));
}

function syncCurrentMultiStateToActiveSubgroup() {
    const group = getCurrentGroup();
    if (!group) return;
    ensureGroupMultiSubgroups(group);
    ensureMultiRangeState();

    const subgroup = getCurrentMultiSubgroup();
    if (!subgroup) return;

    subgroup.name = sanitizeMultiSubgroupName(subgroup.name, getDefaultMultiSubgroupName(0));
    subgroup.multiRangeCount = sanitizeMultiRangeCount(multiRangeCount);
    subgroup.multiRanges = multiRanges.map((range) => ({
        startUtcMs: sanitizeUtcMs(range.startUtcMs, Date.now()),
        endUtcMs: sanitizeUtcMs(range.endUtcMs, Date.now())
    }));
    subgroup.multiRangeCollapsed = multiRangeCollapsed.map((flag) => !!flag);
    subgroup.multiRangeStartEditEnabled = multiRangeStartEditEnabled.map((flag) => !!flag);
    subgroup.multiRangeEndEditEnabled = multiRangeEndEditEnabled.map((flag) => !!flag);
}

function loadCurrentMultiStateFromActiveSubgroup() {
    const subgroup = getCurrentMultiSubgroup();
    const normalized = sanitizeMultiStatePayload(subgroup, null);
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
    const group = getCurrentGroup();
    if (!group) return true;
    return group.showUtcRow !== false;
}

function getCurrentGroupUtcRowOrder() {
    const group = getCurrentGroup();
    if (!group) return 0;
    return sanitizeUtcRowOrder(group.utcRowOrder);
}

function getZoneDisplayName(tz) {
    if (!tz) return "";

    // Custom timezone: always use the user-defined name
    if (tz.type === "custom") {
        return tz.name_ko || tz.name || tz.name_en || tz.zone || "";
    }

    // Fixed offset standard time (e.g., "UTC+09:00 Standard Time" or "UTC+09:00 표준시")
    if (tz.fixedOffsetMinutes !== undefined && tz.fixedOffsetMinutes !== null) {
        const nameFallback = tz.name_ko || tz.name || tz.name_en || "";
        if (nameFallback.includes("표준시") || nameFallback.toLowerCase().includes("standard time")) {
            const offsetLabel = formatUtcOffsetLabel(tz.fixedOffsetMinutes);
            return currentLang === "en" ? `${offsetLabel} Standard Time` : `${offsetLabel} 표준시`;
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

function getZoneAbbreviation(tz, date = globalTimes[0]) {
    if (!tz) return "";
    if (tz.zone === "UTC") return "UTC";
    if (tz.type === "custom") return normalizeCustomAbbr(tz.abbr);
    const fixedAbbr = normalizeZoneAbbreviation(tz.fixedAbbr);
    if (fixedAbbr) return fixedAbbr;
    return getBetterAbbr(tz.zone, date);
}

function ensureBaseTimezoneSelection() {
    const group = getCurrentGroup();
    if (!group) return;
    const currentBaseTimezoneId = getCurrentGroupBaseTimezoneId();
    if (currentBaseTimezoneId === "utc") {
        group.baseTimezoneId = "utc";
        return;
    }
    const exists = (group.zones || []).some(z => z.id === currentBaseTimezoneId);
    if (!exists) group.baseTimezoneId = "utc";
}

function getUTCRef() {
    return { id: "utc", type: "standard", zone: "UTC", name: t("utc_name") };
}

function getBaseTimezoneRef() {
    ensureBaseTimezoneSelection();
    const currentBaseTimezoneId = getCurrentGroupBaseTimezoneId();
    if (currentBaseTimezoneId === "utc") return getUTCRef();
    const tz = getCurrentGroupZones().find(z => z.id === currentBaseTimezoneId);
    if (!tz) return getUTCRef();
    return tz;
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
        order.forEach(key => {
            const normalizedKey = normalizeCopyFormatKey(key);
            if (COPY_FORMAT_KEYS.includes(normalizedKey) && !safeOrder.includes(normalizedKey)) safeOrder.push(normalizedKey);
        });
    }
    COPY_FORMAT_KEYS.forEach(key => {
        if (!safeOrder.includes(key)) safeOrder.push(key);
    });
    return safeOrder;
}

function sanitizeCopyFormatEnabled(enabled, mode = "display") {
    const safe = getDefaultFormatEnabled(mode);
    COPY_FORMAT_KEYS.forEach(key => {
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

function deriveTimePartsFromLegacyEnabled(legacyEnabled, mode = "display") {
    return sanitizeTimePartsEnabled(null, mode);
}

function isMultiTab() {
    return currentMainTab === "multi";
}

function sanitizeMultiRangeCount(value) {
    const parsed = parseInt(value, 10);
    if (!Number.isFinite(parsed)) return MIN_MULTI_RANGE_COUNT;
    return Math.min(MAX_MULTI_RANGE_COUNT, Math.max(MIN_MULTI_RANGE_COUNT, parsed));
}

function sanitizeMultiRangeTitle(value) {
    const text = (typeof value === "string") ? value.trim() : "";
    if (!text) return t("placeholder_range_title");
    return text.slice(0, 40);
}

function sanitizeUtcMs(value, fallbackMs) {
    return GTV_TIME_CORE.sanitizeUtcMs(value, fallbackMs);
}

function getDefaultMultiRangeBounds() {
    const nowMs = Date.now();
    const startMs = sanitizeUtcMs(globalTimes[0]?.getTime?.(), nowMs);
    const endMs = sanitizeUtcMs(globalTimes[1]?.getTime?.(), startMs);
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
    if (!Number.isInteger(rangeIdx) || rangeIdx <= 0) return false;
    return !!multiRangeStartEditEnabled[rangeIdx];
}

function isMultiRangeEndEditEnabled(rangeIdx) {
    if (!Number.isInteger(rangeIdx) || rangeIdx < 0) return false;
    return !!multiRangeEndEditEnabled[rangeIdx];
}

function isMultiRangeStartLinked(rangeIdx) {
    return rangeIdx > 0 && !isMultiRangeStartEditEnabled(rangeIdx);
}

function ensureMultiRangeState() {
    multiRangeCount = sanitizeMultiRangeCount(multiRangeCount);
    multiRangeTitle = sanitizeMultiRangeTitle(multiRangeTitle);
    const defaults = getDefaultMultiRangeBounds();
    const normalized = Array.isArray(multiRanges)
        ? multiRanges.map((item) => sanitizeMultiRangeItem(item, defaults.startMs, defaults.endMs))
        : [];
    const normalizedCollapsed = Array.isArray(multiRangeCollapsed)
        ? multiRangeCollapsed.map((flag) => !!flag)
        : [];
    const normalizedStartEdit = Array.isArray(multiRangeStartEditEnabled)
        ? multiRangeStartEditEnabled.map((flag) => !!flag)
        : [];
    const normalizedEndEdit = Array.isArray(multiRangeEndEditEnabled)
        ? multiRangeEndEditEnabled.map((flag) => !!flag)
        : [];

    let nextRanges = normalized.slice(0, multiRangeCount);
    if (!nextRanges.length) {
        nextRanges = [{
            startUtcMs: defaults.startMs,
            endUtcMs: defaults.endMs
        }];
    }

    const firstDuration = nextRanges[0].endUtcMs - nextRanges[0].startUtcMs;
    while (nextRanges.length < multiRangeCount) {
        const prev = nextRanges[nextRanges.length - 1];
        const startUtcMs = prev.endUtcMs;
        nextRanges.push({
            startUtcMs,
            endUtcMs: startUtcMs + firstDuration
        });
    }

    const nextStartEditEnabled = Array.from({ length: multiRangeCount }, (_, idx) => (idx === 0 ? false : !!normalizedStartEdit[idx]));
    const nextEndEditEnabled = Array.from({ length: multiRangeCount }, (_, idx) =>
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

    multiRanges = nextRanges;
    multiRangeCollapsed = Array.from({ length: multiRangeCount }, (_, idx) => !!normalizedCollapsed[idx]);
    multiRangeStartEditEnabled = nextStartEditEnabled;
    multiRangeEndEditEnabled = nextEndEditEnabled;
}

function setMultiRangeStartEditEnabled(rangeIdx, enabled, options = {}) {
    const { persist = true, rerender = true } = options;
    ensureMultiRangeState();
    if (!Number.isInteger(rangeIdx) || rangeIdx <= 0 || rangeIdx >= multiRangeCount) return false;

    const nextEnabled = !!enabled;
    multiRangeStartEditEnabled[rangeIdx] = nextEnabled;
    if (!nextEnabled) {
        multiRanges[rangeIdx].startUtcMs = multiRanges[rangeIdx - 1].endUtcMs;
    }

    if (rerender && isMultiTab()) renderMultiRanges();
    if (persist) savePersistence();
    return true;
}

function setMultiRangeEndEditEnabled(rangeIdx, enabled, options = {}) {
    const { persist = true, rerender = true } = options;
    ensureMultiRangeState();
    if (!Number.isInteger(rangeIdx) || rangeIdx < 0 || rangeIdx >= multiRangeCount) return false;

    multiRangeEndEditEnabled[rangeIdx] = !!enabled;

    if (rerender && isMultiTab()) renderMultiRanges();
    if (persist) savePersistence();
    return true;
}

function setAllMultiRangeStartEditEnabled(enabled, options = {}) {
    const { persist = true, rerender = true } = options;
    ensureMultiRangeState();
    const next = !!enabled;

    for (let idx = 1; idx < multiRangeCount; idx++) {
        multiRangeStartEditEnabled[idx] = next;
        if (!next) {
            multiRanges[idx].startUtcMs = multiRanges[idx - 1].endUtcMs;
        }
    }

    if (rerender && isMultiTab()) renderMultiRanges();
    if (persist) savePersistence();
    return true;
}

function setAllMultiRangeEndEditEnabled(enabled, options = {}) {
    const { persist = true, rerender = true } = options;
    ensureMultiRangeState();
    const next = !!enabled;

    for (let idx = 0; idx < multiRangeCount; idx++) {
        multiRangeEndEditEnabled[idx] = next;
    }

    if (rerender && isMultiTab()) renderMultiRanges();
    if (persist) savePersistence();
    return true;
}

function refreshMultiRangeControls() {
    const countInput = document.getElementById("multi-range-count-input");
    if (countInput) countInput.value = String(multiRangeCount);

    const decreaseBtn = document.getElementById("multi-range-count-decrease");
    const increaseBtn = document.getElementById("multi-range-count-increase");
    if (decreaseBtn) decreaseBtn.disabled = multiRangeCount <= MIN_MULTI_RANGE_COUNT;
    if (increaseBtn) increaseBtn.disabled = multiRangeCount >= MAX_MULTI_RANGE_COUNT;

}

function renderMultiBulkToolSets() {
    const startTools = document.getElementById("multi-bulk-start-tools");
    const allTools = document.getElementById("multi-bulk-all-tools");
    if (!allTools) return;

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

    const bulkSet = renderTimeAdjustSet(1, {
        labelText: t("label_range_bulk"),
        disabled: !hasRanges,
        onAction: applyBulkRangeAllAction,
        includeFixedActions: false
    });
    const zeroDayBtn = createTimeAdjustActionButton("btn_set_zero_day", 1, "set_zero_day", applyBulkRangeAllAction, !hasRanges);
    zeroDayBtn.classList.add("time-adjust-bulk-zero-btn");
    const firstActionNode = [...bulkSet.children].find((node, idx) => idx > 0);
    if (firstActionNode) {
        bulkSet.insertBefore(zeroDayBtn, firstActionNode);
        bulkSet.insertBefore(createTimeAdjustDivider(), firstActionNode);
    } else {
        bulkSet.appendChild(zeroDayBtn);
    }
    const bulkToolBlock = document.createElement("div");
    bulkToolBlock.className = "multi-tool-block";
    bulkToolBlock.appendChild(bulkSet);

    const createBulkToggleButton = (buttonText, onClick) => {
        const button = document.createElement("button");
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

    const bulkToggleSet = document.createElement("div");
    bulkToggleSet.className = "time-adjust-set";
    const bulkToggleLabel = document.createElement("span");
    bulkToggleLabel.className = "time-adjust-set-label";
    bulkToggleLabel.textContent = t("label_all_range_time_adjust");
    bulkToggleSet.appendChild(bulkToggleLabel);
    bulkToggleSet.appendChild(createBulkToggleButton(
        t("btn_enable_all_start_time_adjust"),
        () => setAllMultiRangeStartEditEnabled(true, { persist: true, rerender: true })
    ));
    bulkToggleSet.appendChild(createBulkToggleButton(
        t("btn_disable_all_start_time_adjust"),
        () => setAllMultiRangeStartEditEnabled(false, { persist: true, rerender: true })
    ));
    bulkToggleSet.appendChild(createTimeAdjustDivider());
    bulkToggleSet.appendChild(createBulkToggleButton(
        t("btn_enable_all_end_time_adjust"),
        () => setAllMultiRangeEndEditEnabled(true, { persist: true, rerender: true })
    ));
    bulkToggleSet.appendChild(createBulkToggleButton(
        t("btn_disable_all_end_time_adjust"),
        () => setAllMultiRangeEndEditEnabled(false, { persist: true, rerender: true })
    ));
    const toggleToolBlock = document.createElement("div");
    toggleToolBlock.className = "multi-tool-block";
    toggleToolBlock.appendChild(bulkToggleSet);
    allTools.appendChild(toggleToolBlock);
    allTools.appendChild(bulkToolBlock);

    const syncZeroButtonWidth = () => {
        const bulkZeroBtn = allTools.querySelector(".time-adjust-bulk-zero-btn");
        if (!bulkZeroBtn) return;
        const rangeButtons = [...document.querySelectorAll('.multi-range-adjust-row [data-action="set_zero_day"], .multi-range-adjust-row [data-action="sync_prev_end"]')];
        const targetButtons = [bulkZeroBtn, ...rangeButtons].filter((btn) => btn instanceof HTMLElement);
        if (!targetButtons.length) return;

        targetButtons.forEach((btn) => {
            btn.style.width = "";
            btn.style.minWidth = "";
            btn.style.justifyContent = "";
            btn.style.textAlign = "";
        });

        const firstRangeStartSet = document.querySelector('.multi-range-adjust-row .time-adjust-set [data-action="now"]')?.closest(".time-adjust-set");
        let desiredSpanToDivider = 0;
        if (firstRangeStartSet) {
            const nowBtn = firstRangeStartSet.querySelector('[data-action="now"]');
            const firstDivider = firstRangeStartSet.querySelector(".time-adjust-divider");
            if (nowBtn && firstDivider) {
                const nowRect = nowBtn.getBoundingClientRect();
                const dividerRect = firstDivider.getBoundingClientRect();
                desiredSpanToDivider = Math.round(dividerRect.left - nowRect.left);
            }
        }

        if (desiredSpanToDivider > 0) {
            targetButtons.forEach((btn) => {
                const set = btn.closest(".time-adjust-set");
                const setStyle = set ? window.getComputedStyle(set) : null;
                const gap = setStyle ? (parseFloat(setStyle.columnGap || setStyle.gap || "0") || 0) : 0;
                const btnStyle = window.getComputedStyle(btn);
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
            ...targetButtons.map((btn) => Math.ceil(btn.scrollWidth + 18))
        );
        if (fallbackWidth <= 0) return;
        const widthPx = `${fallbackWidth}px`;
        targetButtons.forEach((btn) => {
            btn.style.width = widthPx;
            btn.style.minWidth = widthPx;
        });
    };

    if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
        window.requestAnimationFrame(syncZeroButtonWidth);
    } else {
        syncZeroButtonWidth();
    }
    upgradeNativeTitleTooltips(allTools);
}

function syncMultiRangeStartLinks(startIdx = 1) {
    ensureMultiRangeState();
    for (let idx = Math.max(1, startIdx); idx < multiRanges.length; idx++) {
        if (!isMultiRangeStartLinked(idx)) continue;
        multiRanges[idx].startUtcMs = multiRanges[idx - 1].endUtcMs;
    }
}

function syncFollowingRangesByDuration(changedRangeIdx) {
    if (!Number.isInteger(changedRangeIdx) || changedRangeIdx < 0 || changedRangeIdx >= multiRanges.length) return;
    if (changedRangeIdx >= multiRanges.length - 1) return;

    const fallbackNow = Date.now();
    const durations = multiRanges.map((range) => {
        const startUtcMs = sanitizeUtcMs(range?.startUtcMs, fallbackNow);
        const endUtcMs = sanitizeUtcMs(range?.endUtcMs, startUtcMs);
        return endUtcMs - startUtcMs;
    });

    let cursor = sanitizeUtcMs(multiRanges[changedRangeIdx]?.endUtcMs, fallbackNow);
    for (let idx = changedRangeIdx + 1; idx < multiRanges.length; idx++) {
        const duration = durations[idx] ?? 0;
        if (isMultiRangeStartLinked(idx)) {
            multiRanges[idx].startUtcMs = cursor;
            multiRanges[idx].endUtcMs = cursor + duration;
        } else {
            multiRanges[idx].startUtcMs = sanitizeUtcMs(multiRanges[idx].startUtcMs, cursor);
            multiRanges[idx].endUtcMs = sanitizeUtcMs(multiRanges[idx].endUtcMs, multiRanges[idx].startUtcMs);
        }
        cursor = sanitizeUtcMs(multiRanges[idx].endUtcMs, cursor);
    }
}

function syncLinkedRangesFrom(rangeIdx, options = {}) {
    const { includeCurrent = true, stopAtFirstUnlocked = true, baseDurations = null } = options;
    ensureMultiRangeState();
    if (!Number.isInteger(rangeIdx) || rangeIdx < 0 || rangeIdx >= multiRanges.length) return;

    const fallbackNow = Date.now();
    const durations = Array.isArray(baseDurations) && baseDurations.length
        ? baseDurations
        : multiRanges.map((range) => {
            const startUtcMs = sanitizeUtcMs(range?.startUtcMs, fallbackNow);
            const endUtcMs = sanitizeUtcMs(range?.endUtcMs, startUtcMs);
            return endUtcMs - startUtcMs;
        });

    let anchorIdx = rangeIdx;
    if (includeCurrent) {
        const startUtcMs = sanitizeUtcMs(multiRanges[anchorIdx]?.startUtcMs, fallbackNow);
        multiRanges[anchorIdx].startUtcMs = startUtcMs;
        multiRanges[anchorIdx].endUtcMs = startUtcMs + (durations[anchorIdx] ?? 0);
    }

    let cursor = sanitizeUtcMs(multiRanges[anchorIdx]?.endUtcMs, fallbackNow);
    for (let idx = anchorIdx + 1; idx < multiRanges.length; idx++) {
        if (!isMultiRangeStartLinked(idx)) {
            if (stopAtFirstUnlocked) break;
            cursor = sanitizeUtcMs(multiRanges[idx]?.endUtcMs, cursor);
            continue;
        }
        multiRanges[idx].startUtcMs = cursor;
        multiRanges[idx].endUtcMs = cursor + (durations[idx] ?? 0);
        cursor = sanitizeUtcMs(multiRanges[idx].endUtcMs, cursor);
    }
}

function setMultiRangeCount(value, options = {}) {
    const { persist = true, rerender = true, showBoundaryToast = false } = options;
    const parsed = parseInt(value, 10);
    const nextCount = sanitizeMultiRangeCount(value);

    if (showBoundaryToast && Number.isFinite(parsed)) {
        if (parsed >= MAX_MULTI_RANGE_COUNT) {
            showToast(t("toast_range_count_max"));
        } else if (parsed <= MIN_MULTI_RANGE_COUNT) {
            showToast(t("toast_range_count_min"));
        }
    }

    multiRangeCount = nextCount;
    ensureMultiRangeState();
    refreshMultiRangeControls();

    if (rerender && isMultiTab()) renderMultiRanges();
    if (persist) savePersistence();
}

function setMultiRangeTitle(value, options = {}) {
    const { persist = true, rerender = true } = options;
    const subgroup = getCurrentMultiSubgroup();
    if (subgroup) {
        subgroup.name = sanitizeMultiSubgroupName(value, subgroup.name || getDefaultMultiSubgroupName(0));
        multiRangeTitle = sanitizeMultiRangeTitle(subgroup.name);
    } else {
        multiRangeTitle = sanitizeMultiRangeTitle(value);
    }
    ensureMultiRangeState();
    refreshMultiRangeControls();

    if (rerender && isMultiTab()) renderMultiRanges();
    if (persist) savePersistence();
}

function toggleMultiRangeCollapsed(rangeIdx) {
    ensureMultiRangeState();
    if (!Number.isInteger(rangeIdx) || rangeIdx < 0 || rangeIdx >= multiRangeCollapsed.length) return;
    multiRangeCollapsed[rangeIdx] = !multiRangeCollapsed[rangeIdx];
    if (isMultiTab()) renderMultiRanges();
    savePersistence();
}

function setAllMultiRangesCollapsed(collapsed) {
    ensureMultiRangeState();
    const next = !!collapsed;
    multiRangeCollapsed = Array.from({ length: multiRangeCount }, () => next);
    if (isMultiTab()) renderMultiRanges();
    savePersistence();
}

function setMultiRangesCollapsedBelow(rangeIdx, collapsed) {
    ensureMultiRangeState();
    if (!Number.isInteger(rangeIdx) || rangeIdx < 0 || rangeIdx >= multiRangeCount) return;

    const startIdx = rangeIdx; // "below ranges": include current range
    if (startIdx >= multiRangeCount) return;

    const next = !!collapsed;
    for (let idx = startIdx; idx < multiRangeCount; idx++) {
        multiRangeCollapsed[idx] = next;
    }

    if (isMultiTab()) renderMultiRanges();
    savePersistence();
}

function getMultiRangeSlotDate(rangeIdx, slotIdx) {
    ensureMultiRangeState();
    const range = multiRanges[rangeIdx];
    if (!range) return new Date();
    const utcMs = slotIdx === 0 ? range.startUtcMs : range.endUtcMs;
    return new Date(utcMs);
}

function setMultiRangeSlotDate(rangeIdx, slotIdx, nextDate) {
    ensureMultiRangeState();
    const range = multiRanges[rangeIdx];
    if (!range || !(nextDate instanceof Date) || !Number.isFinite(nextDate.getTime())) return false;
    const nextMs = nextDate.getTime();
    if (slotIdx === 0) range.startUtcMs = nextMs;
    else range.endUtcMs = nextMs;
    return true;
}

function sanitizeUiScalePercent(value) {
    const parsed = parseInt(value, 10);
    if (!Number.isFinite(parsed)) return DEFAULT_UI_SCALE_PERCENT;
    const clamped = Math.min(MAX_UI_SCALE_PERCENT, Math.max(MIN_UI_SCALE_PERCENT, parsed));
    return UI_SCALE_PERCENT_OPTIONS.reduce((closest, percent) => (
        Math.abs(percent - clamped) < Math.abs(closest - clamped) ? percent : closest
    ), UI_SCALE_PERCENT_OPTIONS[0]);
}

function getCurrentUiScalePercent() {
    return Math.round(uiScale * 100);
}

async function applyUiScale(scalePercent, persist = true) {
    const safePercent = sanitizeUiScalePercent(scalePercent);
    uiScale = safePercent / 100;

    if (document.documentElement) {
        document.documentElement.style.setProperty("--ui-zoom", uiScale.toFixed(2));
        document.documentElement.style.zoom = String(uiScale);
        document.documentElement.style.overflow = "hidden";
    }
    if (document.body) {
        document.body.style.overflow = "hidden";
    }

    if (persist) {
        await setStorageValue(UI_SCALE_STORAGE_KEY, String(safePercent));
    }
}

async function loadUiScalePreference() {
    const val = await getStorageValue(UI_SCALE_STORAGE_KEY, DEFAULT_UI_SCALE_PERCENT);
    return sanitizeUiScalePercent(val);
}

function populateUiScaleSelect(selectEl) {
    if (!selectEl) return;

    selectEl.textContent = "";
    UI_SCALE_PERCENT_OPTIONS.forEach((percent) => {
        const option = document.createElement("option");
        option.value = String(percent);
        option.textContent = `${percent}%`;
        selectEl.appendChild(option);
    });
}

function sanitizeTheme(theme) {
    return THEME_LIST.includes(theme) ? theme : "dark";
}

async function applyTheme(theme, persist = true) {
    currentTheme = sanitizeTheme(theme);
    if (document.documentElement) {
        document.documentElement.setAttribute("data-theme", currentTheme);
    }
    if (persist) {
        await setStorageValue(THEME_STORAGE_KEY, currentTheme);
    }
}

async function loadThemePreference() {
    const val = await getStorageValue(THEME_STORAGE_KEY, "dark");
    return sanitizeTheme(val);
}

function setCurrentLang(lang) {
    currentLang = I18N_DATA[lang] ? lang : "ko";
    if (document.documentElement) {
        document.documentElement.lang = currentLang;
    }
}

function sanitizeMainTab(tab) {
    return MAIN_TABS.includes(tab) ? tab : "live";
}

function clampGroupIndex(index) {
    const maxIndex = Math.max(0, groups.length - 1);
    const parsed = parseInt(index, 10);
    if (!Number.isFinite(parsed)) return 0;
    return Math.min(Math.max(parsed, 0), maxIndex);
}

function normalizeGroupTabState() {
    activeGroupId = clampGroupIndex(activeGroupId);
    activeGroupIdByMainTab = {
        live: clampGroupIndex(activeGroupIdByMainTab?.live),
        fixed: clampGroupIndex(activeGroupIdByMainTab?.fixed)
    };
}

// --- Group Data Structure ---
let groups = [];
let activeGroupId = 0;
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
    savePersistence,
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
    getSignedInclusiveDaySpan,
    getSignedDurationDayHourMinute,
    sanitizeTimePartsEnabled,
    sanitizeCopyFormatOrder
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
    renderMultiRanges,
    getBaseTimezoneRef,
    escapeHtml,
    getZoneDisplayName,
    copyRow,
    removeTimezone,
    handleTimeChange,
    saveOrder,
    getCurrentGroupZones,
    isCurrentGroupUtcRowVisible,
    getCurrentGroupUtcRowOrder,
    getUTCRef,
    renderBaseTimeSelect,
    updateTimeAdjustPanel,
    updateClocks,
    hideFloatingTooltip,
    upgradeNativeTitleTooltips,
    createDragGhostFromRow,
    clearDragGhost
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
    getSignedInclusiveDaySpan,
    getSignedDurationDayHourMinute,
    getZoneDisplayName,
    sanitizeMultiSubgroupName,
    getCurrentMultiSubgroupName,
    sanitizeMultiRangeTitle,
    getMultiRangeTitle: () => multiRangeTitle,
    buildStaticRowCell,
    buildDynamicRowCell,
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
    getRenderableTimezoneRows,
    getMultiRanges: () => multiRanges,
    getMultiRangeCollapsed: () => multiRangeCollapsed,
    getMultiRangeCount: () => multiRangeCount,
    copyWholeMultiRange,
    setMultiRangesCollapsedBelow,
    toggleMultiRangeCollapsed,
    renderTimeAdjustSet,
    applyMultiRangeTimeAdjustAction,
    attachTimeAdjustToggleLabel,
    setMultiRangeStartEditEnabled,
    setMultiRangeEndEditEnabled,
    getMultiDisplayColumnHeader,
    updateTimeAdjustPanel,
    updateCopyFormatPreview,
    upgradeNativeTitleTooltips,
    saveMultiRangeSingleImage
});

const multiRangeCopyService = GTV_MULTI_RANGE_COPY.createService({
    t,
    showToast,
    ensureMultiRangeState,
    getMultiRanges: () => multiRanges,
    getBaseTimezoneRef,
    getRenderableTimezoneRows,
    getTimezoneRefById,
    buildTimezoneComputedSnapshotForRange,
    formatSnapshotText,
    getMultiRangeTitleText,
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
    ensureMultiRangeState,
    getMultiRanges: () => multiRanges,
    getBaseTimezoneRef,
    buildTimezoneComputedSnapshotForRange,
    formatSnapshotText,
    getCopyFormatOrder: () => copyFormatOrder,
    getCopyFormatEnabled: () => copyFormatEnabled,
    getCopyTimePartsEnabled: () => copyTimePartsEnabled,
    getRowFormattedText,
    getRowCopyText,
    copyAllMultiRangeTimezones,
    writeClipboard: async (text) => navigator.clipboard.writeText(text)
});

const timeAdjustUiService = GTV_TIME_ADJUST_UI.createService({
    MIN_TIME_ADJUST_DAY_STEP,
    MAX_TIME_ADJUST_DAY_STEP,
    DEFAULT_TIME_ADJUST_DAY_STEP,
    t,
    savePersistence,
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

const formatControlsService = GTV_FORMAT_CONTROLS.createService({
    COPY_FORMAT_KEYS,
    TIME_PART_KEYS,
    t,
    sanitizeCopyFormatOrder,
    renderList,
    updateCopyFormatPreview,
    savePersistence,
    upgradeNativeTitleTooltips,
    isShowCopyFormat: () => showCopyFormat,
    getDisplayFormatOrder: () => displayFormatOrder,
    setDisplayFormatOrder: (next) => { displayFormatOrder = next; },
    getDisplayFormatEnabled: () => displayFormatEnabled,
    setDisplayFormatEnabled: (next) => { displayFormatEnabled = next; },
    getDisplayTimePartsEnabled: () => displayTimePartsEnabled,
    setDisplayTimePartsEnabled: (next) => { displayTimePartsEnabled = next; },
    getCopyFormatOrder: () => copyFormatOrder,
    setCopyFormatOrder: (next) => { copyFormatOrder = next; },
    getCopyFormatEnabled: () => copyFormatEnabled,
    setCopyFormatEnabled: (next) => { copyFormatEnabled = next; },
    getCopyTimePartsEnabled: () => copyTimePartsEnabled,
    setCopyTimePartsEnabled: (next) => { copyTimePartsEnabled = next; }
});

const tabUiService = GTV_TAB_UI.createService({
    t,
    sanitizeMainTab,
    clampGroupIndex,
    normalizeGroupTabState,
    isMultiTab,
    getSlotCount: () => slotCount,
    getShowCopyFormat: () => showCopyFormat,
    getShowTimeline: () => showTimeline,
    getIsRealtime: () => isRealtime,
    setIsRealtime: (next) => {
        isRealtime = !!next;
        window.isRealtime = isRealtime;
    },
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
    renderGroups,
    renderMultiSubgroups,
    renderMultiRanges,
    renderList,
    renderTimelineFrame,
    updateTimeAdjustPanel,
    renderCopyFormatControls,
    savePersistence
});

const multiStateService = GTV_MULTI_STATE.createService({
    MIN_MULTI_RANGE_COUNT,
    t,
    getGroups: () => groups,
    getDefaultMultiRangeBounds,
    sanitizeMultiRangeCount,
    sanitizeMultiRangeItem,
    sanitizeUtcMs
});

const groupStateService = GTV_GROUP_STATE.createService({
    t,
    sanitizeTimezoneId,
    createUniqueTimezoneId,
    normalizeCustomAbbr,
    normalizeZoneAbbreviation,
    sanitizeBaseTimezoneId,
    sanitizeUtcRowOrder,
    sanitizeMultiSubgroupId,
    ensureGroupMultiSubgroups
});

const groupTabsService = GTV_GROUP_TABS.createService({
    t,
    showToast,
    getState: getPersistenceState,
    setState: setPersistenceState,
    isMultiTab,
    getCurrentGroup,
    ensureGroupMultiSubgroups,
    normalizeGroupTabState,
    syncCurrentMultiStateToActiveSubgroup,
    loadCurrentMultiStateFromActiveSubgroup,
    savePersistence,
    renderGroups,
    renderMultiSubgroups,
    renderBaseTimeSelect,
    renderMultiRanges,
    renderList,
    setCustomTooltip,
    hideFloatingTooltip,
    upgradeNativeTitleTooltips,
    getDefaultMultiSubgroupName,
    createMultiSubgroupState,
    sanitizeMultiSubgroupName,
    sanitizeMultiRangeTitle,
    exportGroupToJSON,
    triggerGroupImportFor,
    exportSubgroupToJSON,
    triggerSubgroupImportFor
});

function getPersistenceState() {
    return {
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
    };
}

function setPersistenceState(next = {}) {
    if (!next || typeof next !== "object") return;
    if (Object.prototype.hasOwnProperty.call(next, "groups")) groups = next.groups;
    if (Object.prototype.hasOwnProperty.call(next, "activeGroupId")) activeGroupId = next.activeGroupId;
    if (Object.prototype.hasOwnProperty.call(next, "currentMainTab")) currentMainTab = next.currentMainTab;
    if (Object.prototype.hasOwnProperty.call(next, "activeGroupIdByMainTab")) activeGroupIdByMainTab = next.activeGroupIdByMainTab;
    if (Object.prototype.hasOwnProperty.call(next, "slotCount")) slotCount = next.slotCount;
    if (Object.prototype.hasOwnProperty.call(next, "showCopyFormat")) showCopyFormat = next.showCopyFormat;
    if (Object.prototype.hasOwnProperty.call(next, "showTimeline")) showTimeline = !!next.showTimeline;
    if (Object.prototype.hasOwnProperty.call(next, "displayFormatOrder")) displayFormatOrder = next.displayFormatOrder;
    if (Object.prototype.hasOwnProperty.call(next, "displayFormatEnabled")) displayFormatEnabled = next.displayFormatEnabled;
    if (Object.prototype.hasOwnProperty.call(next, "displayTimePartsEnabled")) displayTimePartsEnabled = next.displayTimePartsEnabled;
    if (Object.prototype.hasOwnProperty.call(next, "copyFormatOrder")) copyFormatOrder = next.copyFormatOrder;
    if (Object.prototype.hasOwnProperty.call(next, "copyFormatEnabled")) copyFormatEnabled = next.copyFormatEnabled;
    if (Object.prototype.hasOwnProperty.call(next, "copyTimePartsEnabled")) copyTimePartsEnabled = next.copyTimePartsEnabled;
    if (Object.prototype.hasOwnProperty.call(next, "timeAdjustDayStepBySlot")) timeAdjustDayStepBySlot = next.timeAdjustDayStepBySlot;
    if (Object.prototype.hasOwnProperty.call(next, "multiRangeCount")) multiRangeCount = next.multiRangeCount;
    if (Object.prototype.hasOwnProperty.call(next, "multiRangeTitle")) multiRangeTitle = next.multiRangeTitle;
    if (Object.prototype.hasOwnProperty.call(next, "multiRanges")) multiRanges = next.multiRanges;
    if (Object.prototype.hasOwnProperty.call(next, "multiRangeCollapsed")) multiRangeCollapsed = next.multiRangeCollapsed;
    if (Object.prototype.hasOwnProperty.call(next, "multiRangeStartEditEnabled")) multiRangeStartEditEnabled = next.multiRangeStartEditEnabled;
    if (Object.prototype.hasOwnProperty.call(next, "multiRangeEndEditEnabled")) multiRangeEndEditEnabled = next.multiRangeEndEditEnabled;
    if (Object.prototype.hasOwnProperty.call(next, "isRealtime")) isRealtime = next.isRealtime;
    if (Object.prototype.hasOwnProperty.call(next, "currentTheme")) currentTheme = next.currentTheme;
    if (Object.prototype.hasOwnProperty.call(next, "currentLang")) currentLang = next.currentLang;
}

const persistenceService = GTV_STATE_PERSISTENCE.createService({
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
    getState: getPersistenceState,
    setState: setPersistenceState,
    getPersistenceSnapshot,
    ensureGroupMultiSubgroups,
    sanitizeGroup,
    sanitizeBaseTimezoneId,
    sanitizeMainTab,
    sanitizeTimeAdjustDayStep,
    sanitizeCopyFormatOrder,
    sanitizeCopyFormatEnabled,
    sanitizeTimePartsEnabled,
    deriveTimePartsFromLegacyEnabled,
    sanitizeMultiStatePayload,
    sanitizeMultiRangeTitle,
    loadCurrentMultiStateFromActiveSubgroup,
    ensureBaseTimezoneSelection,
    syncCurrentMultiStateToActiveSubgroup,
    loadThemePreference,
    applyTheme,
    loadUiScalePreference,
    applyUiScale,
    populateUiScaleSelect,
    getCurrentUiScalePercent,
    refreshMultiRangeControls,
    updateTZDropdown,
    refreshSelectWidths,
    switchMainTab,
    showToast,
    t,
    applyVersionBranding,
    applyTranslations: () => {
        if (typeof globalThis.applyTranslations === "function") {
            globalThis.applyTranslations();
        }
    }
});

const settingsIoService = GTV_SETTINGS_IO.createService({
    I18N_DATA,
    THEME_STORAGE_KEY,
    LANG_STORAGE_KEY,
    UI_SCALE_STORAGE_KEY,
    getGroups: () => groups,
    getCurrentTheme: () => currentTheme,
    getCurrentLang: () => currentLang,
    getCurrentMainTab: () => currentMainTab,
    sanitizeBaseTimezoneId,
    sanitizeUtcRowOrder,
    persistStorageSnapshot,
    setStorageValue,
    sanitizeTheme,
    sanitizeUiScalePercent,
    setCurrentLang,
    loadPersistence,
    localizeAutoGeneratedNamesForCurrentLanguage,
    savePersistence,
    applyTheme,
    loadThemePreference,
    applyUiScale,
    loadUiScalePreference,
    applyTranslations: () => {
        if (typeof globalThis.applyTranslations === "function") {
            globalThis.applyTranslations();
        }
    },
    applyVersionBranding,
    populateUiScaleSelect,
    getCurrentUiScalePercent,
    refreshMultiRangeControls,
    updateTZDropdown,
    refreshSelectWidths,
    switchMainTab
});
const dataTransferService = GTV_DATA_TRANSFER.createService({
    VERSION,
    MIN_MULTI_RANGE_COUNT,
    I18N_DATA,
    getGroups: () => groups,
    getActiveGroupId: () => activeGroupId,
    getCurrentTheme: () => currentTheme,
    getCurrentLang: () => currentLang,
    getPersistenceSnapshot,
    getCurrentUiScalePercent,
    sanitizeTheme,
    sanitizeFilenamePart,
    pad,
    syncCurrentMultiStateToActiveSubgroup,
    ensureGroupMultiSubgroups,
    sanitizeGroup,
    loadCurrentMultiStateFromActiveSubgroup,
    savePersistence,
    renderGroups,
    renderMultiSubgroups,
    renderBaseTimeSelect,
    renderMultiRanges,
    renderList,
    isMultiTab,
    sanitizeMultiSubgroupId,
    sanitizeMultiSubgroupName,
    getDefaultMultiSubgroupName,
    sanitizeMultiStatePayload,
    getCurrentMultiSubgroup,
    applyImportedSettings: (importedRoot) => settingsIoService.applyImportedSettings(importedRoot),
    isQuotaExceededError,
    showToast,
    t,
    tFormat
});

async function initApp() {
    await loadPersistence();
    if (localizeAutoGeneratedNamesForCurrentLanguage()) {
        await savePersistence();
    }
    loadCurrentMultiStateFromActiveSubgroup();
    await applyTheme(await loadThemePreference(), false);
    await applyUiScale(await loadUiScalePreference(), false);
    applyTranslations();
    applyVersionBranding();
    initUI();
    bindFloatingTooltipEvents();
    initDragAndDrop();
    initSearchAndSelect();
    queueStandardTimezoneWarmup();
    initCalculators();

    setInterval(() => {
        if (window.isRealtime) {
            const now = new Date();
            globalTimes[0] = now;
            updateClocks();
        }
    }, 1000);

    switchMainTab(currentMainTab);

    // Force initial update
    updateClocks();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        initApp().catch(err => console.error("!!! FATAL INIT ERROR (DOMContentLoaded) !!!", err));
    });
} else {
    initApp().catch(err => console.error("!!! FATAL INIT ERROR (Sync) !!!", err));
}

function initUI() {
    // Main Tabs
    document.querySelectorAll(".nav-item").forEach(btn => {
        btn.addEventListener("click", () => switchMainTab(btn.dataset.tab));
    });

    const uiScaleSelect = document.getElementById("ui-scale-select");
    if (uiScaleSelect) {
        populateUiScaleSelect(uiScaleSelect);
        uiScaleSelect.value = String(getCurrentUiScalePercent());
        uiScaleSelect.onchange = (e) => {
            applyUiScale(e.target.value);
            uiScaleSelect.value = String(getCurrentUiScalePercent());
        };
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
            setMultiRangeCount(multiRangeCount - 1, { persist: true, rerender: true, showBoundaryToast: true });
        });
    }
    if (multiRangeIncreaseBtn) {
        multiRangeIncreaseBtn.addEventListener("click", () => {
            setMultiRangeCount(multiRangeCount + 1, { persist: true, rerender: true, showBoundaryToast: true });
        });
    }

    refreshMultiRangeControls();

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
        extraTimeToggle.checked = slotCount > 1;
        extraTimeToggle.onchange = (e) => {
            slotCount = e.target.checked ? 2 : 1;
            renderList();
            savePersistence();
        };
    }

    const copyFormatToggle = document.getElementById("toggle-copy-format");
    if (copyFormatToggle) {
        copyFormatToggle.checked = showCopyFormat;
        copyFormatToggle.onchange = (e) => {
            showCopyFormat = !!e.target.checked;
            renderCopyFormatControls();
            savePersistence();
        };
    }
    const timelineToggle = document.getElementById("toggle-timeline");
    if (timelineToggle) {
        timelineToggle.checked = showTimeline;
        timelineToggle.onchange = (e) => {
            showTimeline = !!e.target.checked;
            renderTimelineFrame();
            savePersistence();
        };
    }

    const displayFormatResetBtn = document.getElementById("display-format-reset-btn");
    if (displayFormatResetBtn) {
        displayFormatResetBtn.onclick = () => {
            displayFormatOrder = [...COPY_FORMAT_KEYS];
            displayFormatEnabled = sanitizeCopyFormatEnabled(null, "display");
            displayTimePartsEnabled = sanitizeTimePartsEnabled(null, "display");
            renderCopyFormatControls();
            renderList();
            savePersistence();
        };
    }

    const copyFormatResetBtn = document.getElementById("copy-format-reset-btn");
    if (copyFormatResetBtn) {
        copyFormatResetBtn.onclick = () => {
            copyFormatOrder = [...COPY_FORMAT_KEYS];
            copyFormatEnabled = sanitizeCopyFormatEnabled(null, "copy");
            copyTimePartsEnabled = sanitizeTimePartsEnabled(null, "copy");
            renderCopyFormatControls();
            savePersistence();
        };
    }

    const baseTimeSelect = document.getElementById("base-time-select");
    if (baseTimeSelect) {
        baseTimeSelect.onchange = (e) => {
            const nextBaseId = e.target.value || "utc";
            if (nextBaseId === "utc") {
                const activeGroup = getCurrentGroup();
                if (activeGroup) {
                    activeGroup.showUtcRow = true;
                    activeGroup.utcRowOrder = 0;
                }
            }
            setCurrentGroupBaseTimezoneId(nextBaseId);
            renderList();
            updateTimeAdjustPanel();
            savePersistence();
        };
    }

    // Custom Zone
    document.getElementById("add-custom-btn").onclick = () => {
        const abbr = normalizeCustomAbbr(document.getElementById("custom-abbr").value);
        const name = document.getElementById("custom-name").value.trim();
        const offH = parseInt(document.getElementById("custom-off-h").value) || 0;
        const offM = parseInt(document.getElementById("custom-off-m").value) || 0;
        if (!name) return showToast(t("toast_input_name"));
        addTimezone({ id: createUniqueTimezoneId("tz-c"), abbr, name, offH, offM, type: "custom" });
        document.getElementById("custom-abbr").value = "";
        document.getElementById("custom-name").value = "";
    };

    document.getElementById("add-group-btn").onclick = addGroup;
    const addMultiSubgroupBtn = document.getElementById("add-multi-subgroup-btn");
    if (addMultiSubgroupBtn) {
        addMultiSubgroupBtn.onclick = addMultiSubgroup;
    }

    document.getElementById("copy-all-btn").onclick = copyAllTimezones;
    const saveTableImageBtn = document.getElementById("save-table-image-btn");
    const saveTimelineImageBtn = document.getElementById("save-timeline-image-btn");
    const saveMultiRangeTitlesImageBtn = document.getElementById("save-multi-range-titles-image-btn");
    const saveMultiRangeByRangeImageBtn = document.getElementById("save-multi-range-by-range-image-btn");
    const saveImageMultiTimelineBtn = document.getElementById("save-image-multi-timeline-btn");

    if (saveTableImageBtn) {
        saveTableImageBtn.onclick = saveTimezoneTableImage;
    }
    if (saveTimelineImageBtn) {
        saveTimelineImageBtn.onclick = saveTimelineImage;
    }
    if (saveImageMultiTimelineBtn) {
        saveImageMultiTimelineBtn.onclick = saveTimelineImage;
    }
    if (saveMultiRangeTitlesImageBtn) {
        saveMultiRangeTitlesImageBtn.onclick = saveMultiRangeTitlesImage;
    }
    if (saveMultiRangeByRangeImageBtn) {
        saveMultiRangeByRangeImageBtn.onclick = saveMultiRangeAllImage;
    }
    const exportSettingsBtn = document.getElementById("export-settings-btn");
    if (exportSettingsBtn) {
        exportSettingsBtn.onclick = exportSettingsToJSON;
    }
    const importSettingsBtn = document.getElementById("import-settings-btn");
    const settingsImportFile = document.getElementById("settings-import-file");
    if (importSettingsBtn && settingsImportFile) {
        importSettingsBtn.onclick = () => {
            settingsImportFile.value = "";
            settingsImportFile.click();
        };
        settingsImportFile.onchange = handleSettingsImportFile;
    }
    const groupImportFile = document.getElementById("group-import-file");
    if (groupImportFile) {
        groupImportFile.onchange = handleGroupImportFile;
    }
    const subgroupImportFile = document.getElementById("subgroup-import-file");
    if (subgroupImportFile) {
        subgroupImportFile.onchange = handleSubgroupImportFile;
    }

    const themeSelect = document.getElementById("theme-select");
    if (themeSelect) {
        themeSelect.value = currentTheme;
        themeSelect.onchange = async (e) => {
            await applyTheme(e.target.value);
            if (typeof window !== "undefined" && typeof window.__gtvCalcRefresh === "function") {
                window.__gtvCalcRefresh();
            }
        };
    }

    // Language Selector
    const langSelect = document.getElementById("lang-select");
    if (langSelect) {
        langSelect.value = currentLang;
        langSelect.onchange = (e) => {
            hideFloatingTooltip();
            setLanguage(e.target.value);
            if (localizeAutoGeneratedNamesForCurrentLanguage()) {
                savePersistence();
            }
            applyVersionBranding();
            updateTZDropdown(); // Ensure dropdown is updated
            renderGroups();
            renderMultiSubgroups();
            renderList();
            updateTimeAdjustPanel();
            renderCopyFormatControls();
            refreshSelectWidths();
            if (typeof window !== "undefined" && typeof window.__gtvCalcRefresh === "function") {
                window.__gtvCalcRefresh();
            }
        };
    }

    const resetExceptGroupTzBtn = document.getElementById("reset-except-group-tz-btn");
    if (resetExceptGroupTzBtn) {
        resetExceptGroupTzBtn.onclick = resetExceptGroupsAndTimezones;
    }
    const resetAllSettingsBtn = document.getElementById("reset-all-settings-btn");
    if (resetAllSettingsBtn) {
        resetAllSettingsBtn.onclick = resetAllSettings;
    }

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

function showToast(message, options = {}) {
    const container = document.getElementById("toast-container");
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
        success: "✓",
        error: "!",
        info: "i",
        loading: "…"
    };
    const iconText = (typeof options.icon === "string" && options.icon.trim())
        ? options.icon.trim()
        : iconMap[toastType];

    const toast = document.createElement("div");
    toast.className = `toast ${toastType}`;

    const iconEl = document.createElement("span");
    iconEl.className = "toast-icon";
    iconEl.textContent = iconText;

    const textEl = document.createElement("span");
    textEl.className = "toast-text";
    textEl.textContent = text;

    toast.appendChild(iconEl);
    toast.appendChild(textEl);

    container.appendChild(toast);

    const dismiss = () => {
        if (!toast.isConnected) return;
        toast.classList.add("out");
        setTimeout(() => toast.remove(), 500);
    };

    setTimeout(dismiss, duration);
    return { dismiss, element: toast };
}

function isQuotaExceededError(err) {
    return persistenceService.isQuotaExceededError(err);
}

async function setStorageValue(key, value, options = {}) {
    return persistenceService.setStorageValue(key, value, options);
}

async function getStorageValue(key, fallback = null) {
    return persistenceService.getStorageValue(key, fallback);
}

async function persistStorageSnapshot(snapshot, options = {}) {
    return persistenceService.persistStorageSnapshot(snapshot, options);
}

function switchMainTab(tab) {
    return tabUiService.switchMainTab(tab);
}

function updateOptionRowVisibility() {
    return tabUiService.updateOptionRowVisibility();
}

function refreshOptionToggleDividers() {
    return tabUiService.refreshOptionToggleDividers();
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
    if (selectedNext !== selectedBefore) savePersistence();
    adjustSelectWidthForContent(select, 220);
}

function createTimeAdjustActionButton(labelKey, slotIdx, action, onAction = applyTimeAdjustAction, disabled = false) {
    return timeAdjustUiService.createTimeAdjustActionButton(labelKey, slotIdx, action, onAction, disabled);
}

function createTimeAdjustDivider() {
    return timeAdjustUiService.createTimeAdjustDivider();
}

function attachTimeAdjustToggleLabel(setEl, checked, text, onChange) {
    return timeAdjustUiService.attachTimeAdjustToggleLabel(setEl, checked, text, onChange);
}

function sanitizeTimeAdjustDayStep(value) {
    return timeAdjustUiService.sanitizeTimeAdjustDayStep(value);
}

function getTimeAdjustDayStep(slotIdx) {
    return timeAdjustUiService.getTimeAdjustDayStep(slotIdx);
}

function setTimeAdjustDayStep(slotIdx, value) {
    return timeAdjustUiService.setTimeAdjustDayStep(slotIdx, value);
}

function createTimeAdjustCustomDaysControl(slotIdx, onAction = applyTimeAdjustAction, disabled = false) {
    return timeAdjustUiService.createTimeAdjustCustomDaysControl(slotIdx, onAction, disabled);
}

function renderTimeAdjustSet(slotIdx, options = {}) {
    return timeAdjustUiService.renderTimeAdjustSet(slotIdx, options);
}

function updateTimeAdjustPanel() {
    return timeAdjustUiService.updateTimeAdjustPanel();
}

function getCopyFieldLabel(key) {
    return formatControlsService.getCopyFieldLabel(key);
}

function getTimePartLabel(partKey) {
    return formatControlsService.getTimePartLabel(partKey);
}

function closeAllTimePartsMenus() {
    return formatControlsService.closeAllTimePartsMenus();
}

function bindTimePartsOutsideClickHandler() {
    return formatControlsService.bindTimePartsOutsideClickHandler();
}

function getCopyFormatDropTarget(container, x, y = null) {
    return formatControlsService.getCopyFormatDropTarget(container, x, y);
}

function renderFormatControlList(list, order, enabled, options = {}) {
    return formatControlsService.renderFormatControlList(list, order, enabled, options);
}

function renderCopyFormatControls() {
    return formatControlsService.renderCopyFormatControls();
}

function getDisplayColumns(effectiveSlotCount) {
    return tableRenderService.getDisplayColumns(effectiveSlotCount);
}

function getDisplayTimeInputMode() {
    return tableRenderService.getDisplayTimeInputMode();
}

function buildTimeColumnCell(slotIdx, slotCountToRender, options = {}) {
    return tableRenderService.buildTimeColumnCell(slotIdx, slotCountToRender, options);
}

function getDisplayColumnHeader(colKey) {
    return tableRenderService.getDisplayColumnHeader(colKey);
}

function getMultiDisplayColumnHeader(colKey) {
    return tableRenderService.getMultiDisplayColumnHeader(colKey);
}

function buildStaticRowCell(colKey, slotCountToRender, zoneNameHtml = "") {
    return tableRenderService.buildStaticRowCell(colKey, slotCountToRender, zoneNameHtml);
}

function buildDynamicRowCell(colKey, slotCountToRender) {
    return tableRenderService.buildDynamicRowCell(colKey, slotCountToRender);
}

function buildRowActionCells(copyButtonTitle, removeButtonText, removeButtonTitle = "") {
    return tableRenderService.buildRowActionCells(copyButtonTitle, removeButtonText, removeButtonTitle);
}

function createInteractiveTimezoneRow(tz, effectiveSlotCount, displayColumns, rowId = tz.id) {
    return tableRenderService.createInteractiveTimezoneRow(tz, effectiveSlotCount, displayColumns, rowId);
}

function getRenderableTimezoneRows(baseRef) {
    return tableRenderService.getRenderableTimezoneRows(baseRef);
}

function getTimezoneDisplayPointAtDate(date, tz, fixedDisplayOffsetMinutes = null) {
    return multiRangeRenderService.getTimezoneDisplayPointAtDate(date, tz, fixedDisplayOffsetMinutes);
}

function buildTimezoneComputedSnapshotForRange(tz, startDate, endDate) {
    return multiRangeRenderService.buildTimezoneComputedSnapshotForRange(tz, startDate, endDate);
}

function applySnapshotToRow(row, snapshot) {
    return multiRangeRenderService.applySnapshotToRow(row, snapshot);
}

function formatRangeDurationText(startUtcMs, endUtcMs) {
    return multiRangeRenderService.formatRangeDurationText(startUtcMs, endUtcMs);
}

function getMultiRangeTitleText(rangeIdx, range, baseRef) {
    return multiRangeRenderService.getMultiRangeTitleText(rangeIdx, range, baseRef);
}

function createMultiRangeTableRow(tz, options = {}) {
    return multiRangeRenderService.createMultiRangeTableRow(tz, options);
}

function renderMultiRanges() {
    return multiRangeRenderService.renderMultiRanges();
}

// --- Group Management ---
function activateGroupTab(idx) {
    return groupTabsService.activateGroupTab(idx);
}

function addGroup() {
    return groupTabsService.addGroup();
}

function renderGroups() {
    return groupTabsService.renderGroups();
}

function renameGroup(idx) {
    return groupTabsService.renameGroup(idx);
}

function activateMultiSubgroup(subgroupId) {
    return groupTabsService.activateMultiSubgroup(subgroupId);
}

function addMultiSubgroup() {
    return groupTabsService.addMultiSubgroup();
}

function renameMultiSubgroup(subgroupId) {
    return groupTabsService.renameMultiSubgroup(subgroupId);
}

function deleteMultiSubgroup(subgroupId) {
    return groupTabsService.deleteMultiSubgroup(subgroupId);
}

function renderMultiSubgroups() {
    return groupTabsService.renderMultiSubgroups();
}

// --- List Rendering (Dynamic Slots) ---
function renderList() {
    return tableRenderService.renderList();
}
// --- Exact Abbr Mapping (Expanded) ---
const ZONE_MAP = {
    "Asia/Seoul": "KST", "Asia/Tokyo": "JST", "Asia/Shanghai": "CST", "Asia/Hong_Kong": "HKT",
    "Asia/Singapore": "SGT", "Asia/Taipei": "CST", "Asia/Bangkok": "ICT", "Asia/Dubai": "GST",
    "Europe/Paris": ["CET", "CEST"], "Europe/London": ["GMT", "BST"], "Europe/Berlin": ["CET", "CEST"],
    "Europe/Moscow": "MSK", "Europe/Istanbul": "TRT", "America/New_York": ["EST", "EDT"],
    "America/Chicago": ["CST", "CDT"], "America/Los_Angeles": ["PST", "PDT"], "America/Sao_Paulo": "BRT",
    "Australia/Sydney": ["AEST", "AEDT"], "Australia/Perth": "AWST", "Pacific/Auckland": ["NZST", "NZDT"], "UTC": "UTC"
};

function getBetterAbbr(zone, date) {
    if (zone === "UTC") return "UTC";
    const mapping = ZONE_MAP[zone];
    let abbr = "";
    if (mapping) {
        abbr = (typeof mapping === "string") ? mapping : (isTimeZoneInDST(zone, date) ? mapping[1] : mapping[0]);
    } else {
        abbr = new Intl.DateTimeFormat("en-US", { timeZone: zone, timeZoneName: "short" }).formatToParts(date).find(p => p.type === "timeZoneName")?.value || "";
    }
    return abbr.replace("GMT", "UTC");
}

function isTimeZoneInDST(zone, date) {
    try {
        const year = date.getUTCFullYear();
        // Use UTC-noon anchors to avoid local-timezone side effects near midnight boundaries.
        const jan = new Date(Date.UTC(year, 0, 1, 12, 0, 0));
        const jul = new Date(Date.UTC(year, 6, 1, 12, 0, 0));
        const janOffset = getTimezoneOffset(zone, jan);
        const julOffset = getTimezoneOffset(zone, jul);
        const standardOffset = Math.min(janOffset, julOffset);
        return getTimezoneOffset(zone, date) !== standardOffset;
    } catch (e) { return false; }
}

function getTimezoneOffset(zone, date) {
    try {
        const parts = new Intl.DateTimeFormat("en-US", { timeZone: zone, timeZoneName: "longOffset" }).formatToParts(date);
        const offStr = parts.find(p => p.type === "timeZoneName")?.value || "GMT+0";
        const m = offStr.match(/[+-](\d{1,2}):?(\d{2})?/);
        if (!m) return 0;
        const sign = offStr.includes("+") ? 1 : -1;
        return sign * (parseInt(m[1]) * 60 + parseInt(m[2] || 0));
    } catch (err) {
        return 0;
    }
}

function getFixedOffsetForDisplayAtDate(tz, anchorDate) {
    if (!tz || tz.type !== "standard" || !tz.zone || tz.zone === "UTC") return null;
    const raw = tz.fixedOffsetMinutes;
    if (raw === null || raw === undefined) return null;
    if (typeof raw === "string" && !raw.trim()) return null;
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return null;
    return Math.min(14 * 60, Math.max(-14 * 60, Math.trunc(parsed)));
}

function getFixedOffsetForDisplay(tz) {
    return getFixedOffsetForDisplayAtDate(tz, globalTimes[0]);
}

function pad(v) { return GTV_TIME_CORE.pad(v); }

function getCustomOffsetMinutes(tz) {
    return GTV_TIME_CORE.getCustomOffsetMinutes(tz);
}

function getSignedInclusiveDaySpan(mainDateTimeStr, extraDateTimeStr) {
    const parseDateOnly = (dateTimeStr) => {
        const dateStr = (dateTimeStr || "").split(" ")[0] || "";
        const m = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (!m) return null;
        return Date.UTC(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10));
    };

    const tA = parseDateOnly(mainDateTimeStr);
    const tB = parseDateOnly(extraDateTimeStr);
    if (tA === null || tB === null) return null;

    const dayMagnitude = Math.floor(Math.abs(tB - tA) / 86400000) + 1;
    const sign = extraDateTimeStr >= mainDateTimeStr ? 1 : -1;
    return sign * dayMagnitude;
}

function getSignedDurationDayHourMinute(mainDateTimeStr, extraDateTimeStr) {
    const parseDateTimeToUtcMs = (dateTimeStr) => {
        const m = (dateTimeStr || "").trim().match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
        if (!m) return null;
        return Date.UTC(
            parseInt(m[1], 10),
            parseInt(m[2], 10) - 1,
            parseInt(m[3], 10),
            parseInt(m[4], 10),
            parseInt(m[5], 10),
            parseInt(m[6], 10)
        );
    };

    const tA = parseDateTimeToUtcMs(mainDateTimeStr);
    const tB = parseDateTimeToUtcMs(extraDateTimeStr);
    if (tA === null || tB === null) return null;

    const diffMs = tB - tA;
    const sign = diffMs < 0 ? "-" : "";
    const totalMinutes = Math.floor(Math.abs(diffMs) / 60000);
    const day = Math.floor(totalMinutes / 1440);
    const hour = Math.floor((totalMinutes % 1440) / 60);
    const minute = totalMinutes % 60;

    if (currentLang === "ko") {
        return `${sign}${day}\uC77C ${hour}\uC2DC\uAC04 ${minute}\uBD84`;
    }
    return `${sign}${day}d ${hour}h ${minute}m`;
}

function getLocalPartsByTimezone(date, tz, fixedOffsetMinutes = null) {
    if (tz.type === "custom") {
        const offsetMin = getCustomOffsetMinutes(tz);
        const shifted = new Date(date.getTime() + (offsetMin * 60000));
        return {
            year: shifted.getUTCFullYear(),
            month: shifted.getUTCMonth() + 1,
            day: shifted.getUTCDate(),
            hour: shifted.getUTCHours(),
            minute: shifted.getUTCMinutes(),
            second: shifted.getUTCSeconds()
        };
    }

    if (Number.isFinite(fixedOffsetMinutes)) {
        const shifted = new Date(date.getTime() + (fixedOffsetMinutes * 60000));
        return {
            year: shifted.getUTCFullYear(),
            month: shifted.getUTCMonth() + 1,
            day: shifted.getUTCDate(),
            hour: shifted.getUTCHours(),
            minute: shifted.getUTCMinutes(),
            second: shifted.getUTCSeconds()
        };
    }

    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: tz.zone || "UTC",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false
    });
    const parts = formatter.formatToParts(date);
    const get = type => parts.find(p => p.type === type)?.value || "0";
    const hour = parseInt(get("hour"), 10);
    return {
        year: parseInt(get("year"), 10),
        month: parseInt(get("month"), 10),
        day: parseInt(get("day"), 10),
        hour: hour === 24 ? 0 : hour,
        minute: parseInt(get("minute"), 10),
        second: parseInt(get("second"), 10)
    };
}

function getUTCDateFromLocalParts(parts, tz, fixedOffsetMinutes = null) {
    const utcMs = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
    if (tz.type === "custom") {
        const offsetMin = getCustomOffsetMinutes(tz);
        return new Date(utcMs - (offsetMin * 60000));
    }
    if (!tz.zone || tz.zone === "UTC") return new Date(utcMs);
    if (Number.isFinite(fixedOffsetMinutes)) {
        return new Date(utcMs - (fixedOffsetMinutes * 60000));
    }
    const tempUTC = new Date(utcMs);
    const offMs = getTimezoneOffset(tz.zone, tempUTC) * 60000;
    return new Date(utcMs - offMs);
}

function shiftLocalParts(parts, delta = {}) {
    const d = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second));
    if (delta.hours) d.setUTCHours(d.getUTCHours() + delta.hours);
    if (delta.days) d.setUTCDate(d.getUTCDate() + delta.days);
    if (delta.weeks) d.setUTCDate(d.getUTCDate() + (delta.weeks * 7));
    return {
        year: d.getUTCFullYear(),
        month: d.getUTCMonth() + 1,
        day: d.getUTCDate(),
        hour: d.getUTCHours(),
        minute: d.getUTCMinutes(),
        second: d.getUTCSeconds()
    };
}

function applyTimeAdjustAction(slotIdx, action) {
    if (isRealtime) return;

    if (action === "now") {
        globalTimes[slotIdx] = new Date();
        updateClocks();
        return;
    }

    const baseRef = getBaseTimezoneRef();
    const fixedOffsetMinutes = getFixedOffsetForDisplay(baseRef);
    let parts = getLocalPartsByTimezone(globalTimes[slotIdx], baseRef, fixedOffsetMinutes);

    switch (action) {
        case "midnight":
            parts.hour = 0;
            parts.minute = 0;
            parts.second = 0;
            break;
        case "sharp_hour":
            parts.minute = 0;
            parts.second = 0;
            break;
        case "plus_hour":
            parts = shiftLocalParts(parts, { hours: 1 });
            break;
        case "minus_hour":
            parts = shiftLocalParts(parts, { hours: -1 });
            break;
        case "plus_day":
            parts = shiftLocalParts(parts, { days: 1 });
            break;
        case "minus_day":
            parts = shiftLocalParts(parts, { days: -1 });
            break;
        case "plus_week":
            parts = shiftLocalParts(parts, { weeks: 1 });
            break;
        case "minus_week":
            parts = shiftLocalParts(parts, { weeks: -1 });
            break;
        case "plus_four_weeks":
            parts = shiftLocalParts(parts, { weeks: 4 });
            break;
        case "minus_four_weeks":
            parts = shiftLocalParts(parts, { weeks: -4 });
            break;
        case "set_zero_day":
            if (slotIdx !== 1) return;
            globalTimes[1] = new Date(globalTimes[0].getTime());
            updateClocks();
            return;
        case "plus_custom_days":
            parts = shiftLocalParts(parts, { days: getTimeAdjustDayStep(slotIdx) });
            break;
        case "minus_custom_days":
            parts = shiftLocalParts(parts, { days: -getTimeAdjustDayStep(slotIdx) });
            break;
        default:
            return;
    }

    globalTimes[slotIdx] = getUTCDateFromLocalParts(parts, baseRef, fixedOffsetMinutes);
    updateClocks();
}

function getAdjustedUtcDateByAction(baseDate, action, slotIdx, baseRef, fixedOffsetMinutes) {
    if (!(baseDate instanceof Date) || !Number.isFinite(baseDate.getTime())) return null;

    if (action === "now") return new Date();

    let parts = getLocalPartsByTimezone(baseDate, baseRef, fixedOffsetMinutes);
    switch (action) {
        case "midnight":
            parts.hour = 0;
            parts.minute = 0;
            parts.second = 0;
            break;
        case "sharp_hour":
            parts.minute = 0;
            parts.second = 0;
            break;
        case "plus_hour":
            parts = shiftLocalParts(parts, { hours: 1 });
            break;
        case "minus_hour":
            parts = shiftLocalParts(parts, { hours: -1 });
            break;
        case "plus_day":
            parts = shiftLocalParts(parts, { days: 1 });
            break;
        case "minus_day":
            parts = shiftLocalParts(parts, { days: -1 });
            break;
        case "plus_week":
            parts = shiftLocalParts(parts, { weeks: 1 });
            break;
        case "minus_week":
            parts = shiftLocalParts(parts, { weeks: -1 });
            break;
        case "plus_four_weeks":
            parts = shiftLocalParts(parts, { weeks: 4 });
            break;
        case "minus_four_weeks":
            parts = shiftLocalParts(parts, { weeks: -4 });
            break;
        case "plus_custom_days":
            parts = shiftLocalParts(parts, { days: getTimeAdjustDayStep(slotIdx) });
            break;
        case "minus_custom_days":
            parts = shiftLocalParts(parts, { days: -getTimeAdjustDayStep(slotIdx) });
            break;
        default:
            return null;
    }
    return getUTCDateFromLocalParts(parts, baseRef, fixedOffsetMinutes);
}

function applyBulkRangeStartAction(slotIdx, action) {
    ensureMultiRangeState();
    if (!multiRanges.length) return;

    const baseRef = getBaseTimezoneRef();
    const anchorDate = new Date(multiRanges[0].startUtcMs);
    const fixedOffsetMinutes = getFixedOffsetForDisplayAtDate(baseRef, anchorDate);
    const adjustedFirstStart = getAdjustedUtcDateByAction(new Date(multiRanges[0].startUtcMs), action, slotIdx, baseRef, fixedOffsetMinutes);
    if (!(adjustedFirstStart instanceof Date) || !Number.isFinite(adjustedFirstStart.getTime())) return;

    const durations = multiRanges.map((range) => range.endUtcMs - range.startUtcMs);
    let cursor = adjustedFirstStart.getTime();
    multiRanges = multiRanges.map((range, idx) => {
        const startUtcMs = cursor;
        const endUtcMs = startUtcMs + durations[idx];
        cursor = endUtcMs;
        return { startUtcMs, endUtcMs };
    });

    if (isMultiTab()) renderMultiRanges();
    savePersistence();
}

function applyBulkRangeAllAction(slotIdx, action) {
    ensureMultiRangeState();
    if (!multiRanges.length) return;

    const baseDurations = multiRanges.map((range) => range.endUtcMs - range.startUtcMs);
    let nextDurations = [];

    if (action === "set_zero_day") {
        nextDurations = baseDurations.map(() => 0);
    } else {
        let deltaMs = 0;
        switch (action) {
            case "plus_hour":
                deltaMs = 60 * 60 * 1000;
                break;
            case "minus_hour":
                deltaMs = -60 * 60 * 1000;
                break;
            case "plus_day":
                deltaMs = 24 * 60 * 60 * 1000;
                break;
            case "minus_day":
                deltaMs = -24 * 60 * 60 * 1000;
                break;
            case "plus_week":
                deltaMs = 7 * 24 * 60 * 60 * 1000;
                break;
            case "minus_week":
                deltaMs = -7 * 24 * 60 * 60 * 1000;
                break;
            case "plus_four_weeks":
                deltaMs = 28 * 24 * 60 * 60 * 1000;
                break;
            case "minus_four_weeks":
                deltaMs = -28 * 24 * 60 * 60 * 1000;
                break;
            case "plus_custom_days":
                deltaMs = getTimeAdjustDayStep(slotIdx) * 24 * 60 * 60 * 1000;
                break;
            case "minus_custom_days":
                deltaMs = -getTimeAdjustDayStep(slotIdx) * 24 * 60 * 60 * 1000;
                break;
            default:
                return;
        }
        nextDurations = baseDurations.map((durationMs) => durationMs + deltaMs);
    }

    let cursor = sanitizeUtcMs(multiRanges[0]?.startUtcMs, Date.now());
    for (let idx = 0; idx < multiRanges.length; idx++) {
        const current = multiRanges[idx];
        if (!current) continue;
        if (idx === 0 || isMultiRangeStartLinked(idx)) {
            current.startUtcMs = cursor;
        } else {
            current.startUtcMs = sanitizeUtcMs(current.startUtcMs, cursor);
        }
        current.endUtcMs = current.startUtcMs + (nextDurations[idx] ?? 0);
        cursor = current.endUtcMs;
    }

    if (isMultiTab()) renderMultiRanges();
    savePersistence();
}

function applyMultiRangeTimeAdjustAction(rangeIdx, slotIdx, action) {
    if (!isMultiTab()) return;
    if (rangeIdx > 0 && slotIdx === 0 && !isMultiRangeStartEditEnabled(rangeIdx)) return;
    if (slotIdx === 1 && !isMultiRangeEndEditEnabled(rangeIdx)) return;

    ensureMultiRangeState();
    const range = multiRanges[rangeIdx];
    if (!range) return;

    if (slotIdx === 0 && action === "sync_prev_end") {
        if (rangeIdx <= 0) return;
        const durationSnapshot = multiRanges.map((item) => item.endUtcMs - item.startUtcMs);
        range.startUtcMs = multiRanges[rangeIdx - 1].endUtcMs;
        syncLinkedRangesFrom(rangeIdx, {
            includeCurrent: true,
            stopAtFirstUnlocked: true,
            baseDurations: durationSnapshot
        });
    } else if (slotIdx === 1 && action === "set_zero_day") {
        range.endUtcMs = range.startUtcMs;
    } else {
        const baseRef = getBaseTimezoneRef();
        const anchorDate = new Date(range.startUtcMs);
        const fixedOffsetMinutes = getFixedOffsetForDisplayAtDate(baseRef, anchorDate);
        const baseDate = getMultiRangeSlotDate(rangeIdx, slotIdx);
        const nextUtcDate = getAdjustedUtcDateByAction(baseDate, action, slotIdx, baseRef, fixedOffsetMinutes);
        if (!(nextUtcDate instanceof Date) || !Number.isFinite(nextUtcDate.getTime())) return;
        setMultiRangeSlotDate(rangeIdx, slotIdx, nextUtcDate);
    }

    if (slotIdx === 1) {
        syncFollowingRangesByDuration(rangeIdx);
    } else if (rangeIdx === 0) {
        syncMultiRangeStartLinks(1);
    }

    renderMultiRanges();
    savePersistence();
}

function clampNumber(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function isTimelineSupportedTab() {
    return currentMainTab === "live" || currentMainTab === "fixed";
}

function shouldRenderTimeline() {
    return !!showTimeline && isTimelineSupportedTab() && !isMultiTab();
}

function stopTimelineDrag() {
    if (!timelineDragState) return;
    const state = timelineDragState;
    timelineDragState = null;
    if (state.rafId) {
        cancelUiFrame(state.rafId);
    }
    if (state.trackBody) {
        state.trackBody.removeEventListener("pointermove", state.onPointerMove);
        state.trackBody.removeEventListener("pointerup", state.onPointerUp);
        state.trackBody.removeEventListener("pointercancel", state.onPointerCancel);
        if (
            Number.isInteger(state.pointerId) &&
            typeof state.trackBody.hasPointerCapture === "function" &&
            state.trackBody.hasPointerCapture(state.pointerId)
        ) {
            try {
                state.trackBody.releasePointerCapture(state.pointerId);
            } catch (_) {
                // Ignore pointer capture release failures during rerender/dispose.
            }
        }
    }
}

function getTimelineRows(baseRef) {
    const rowsToRender = getCurrentGroupZones().filter(
        (tz) => tz.id !== baseRef.id && !(tz.type === "standard" && tz.zone === "UTC")
    );
    if (baseRef.id !== "utc" && isCurrentGroupUtcRowVisible()) {
        const insertIndex = Math.min(Math.max(getCurrentGroupUtcRowOrder(), 0), rowsToRender.length);
        rowsToRender.splice(insertIndex, 0, getUTCRef());
    }
    return [baseRef, ...rowsToRender];
}

function getTimelineBaseLocalContext(slotIdx, baseRef) {
    const sourceDate = (globalTimes[slotIdx] instanceof Date && Number.isFinite(globalTimes[slotIdx].getTime()))
        ? globalTimes[slotIdx]
        : new Date();
    const fixedOffsetMinutes = getFixedOffsetForDisplayAtDate(baseRef, sourceDate);
    const parts = getLocalPartsByTimezone(sourceDate, baseRef, fixedOffsetMinutes);
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
    return getUTCDateFromLocalParts(dayStartParts, baseRef, fixedOffsetMinutes);
}

function getTimelineRatioFromClientX(trackBody, clientX) {
    const boxRow = trackBody?.querySelector(".timeline-box-row");
    if (!boxRow) return 0;
    const rect = boxRow.getBoundingClientRect();
    if (!(rect.width > 0)) return 0;
    const clamped = clampNumber(clientX - rect.left, 0, rect.width);
    return clampNumber(clamped / rect.width, 0, 1);
}

function positionTimelineIndicator(trackBody, indicatorEl, ratio) {
    if (!trackBody || !indicatorEl) return false;
    const boxRow = trackBody.querySelector(".timeline-box-row");
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

function applyTimelineRatioToSlot(slotIdx, ratio, baseRef) {
    if (isRealtime) return;
    const sourceDate = (globalTimes[slotIdx] instanceof Date && Number.isFinite(globalTimes[slotIdx].getTime()))
        ? globalTimes[slotIdx]
        : new Date();
    const fixedOffsetMinutes = getFixedOffsetForDisplayAtDate(baseRef, sourceDate);
    const parts = getLocalPartsByTimezone(sourceDate, baseRef, fixedOffsetMinutes);

    const totalSeconds = Math.min(
        TIMELINE_TOTAL_SECONDS - 1,
        Math.max(0, Math.round(clampNumber(ratio, 0, 1) * TIMELINE_TOTAL_SECONDS))
    );
    parts.hour = Math.floor(totalSeconds / 3600);
    parts.minute = Math.floor((totalSeconds % 3600) / 60);
    parts.second = totalSeconds % 60;

    globalTimes[slotIdx] = getUTCDateFromLocalParts(parts, baseRef, fixedOffsetMinutes);
    updateClocks();
}

function bindTimelineDrag(trackBody, indicatorEl, slotIdx, baseRef) {
    if (!(trackBody instanceof HTMLElement) || !(indicatorEl instanceof HTMLElement)) return;

    trackBody.addEventListener("pointerdown", (event) => {
        if (isRealtime || event.button !== 0) return;
        event.preventDefault();
        stopTimelineDrag();

        const state = {
            trackBody,
            indicatorEl,
            slotIdx,
            baseRef,
            pointerId: event.pointerId,
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
            applyTimelineRatioToSlot(state.slotIdx, state.pendingRatio, state.baseRef);
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
            applyTimelineRatioToSlot(state.slotIdx, finalRatio, state.baseRef);
        };

        timelineDragState = state;
        queueRatioRender(event.clientX);

        trackBody.addEventListener("pointermove", state.onPointerMove);
        trackBody.addEventListener("pointerup", state.onPointerUp);
        trackBody.addEventListener("pointercancel", state.onPointerCancel);
        if (typeof trackBody.setPointerCapture === "function") {
            try {
                trackBody.setPointerCapture(state.pointerId);
            } catch (_) {
                // Ignore pointer capture failures for unsupported environments.
            }
        }
    });
}

function createTimelineAxisTrack() {
    const axisTrack = document.createElement("div");
    axisTrack.className = "timeline-axis-track";
    for (let hour = 0; hour <= TIMELINE_TOTAL_HOURS; hour += 3) {
        const tick = document.createElement("span");
        tick.className = "timeline-axis-mark";
        if (hour === TIMELINE_TOTAL_HOURS) tick.classList.add("last");
        tick.style.left = `${(hour / TIMELINE_TOTAL_HOURS) * 100}%`;
        tick.textContent = String(hour === TIMELINE_TOTAL_HOURS ? 0 : hour);
        axisTrack.appendChild(tick);
    }
    return axisTrack;
}

function createTimelineRow(slotIdx, tz, baseDayStartUtcMs) {
    const row = document.createElement("div");
    row.className = "timeline-timezone-row";

    const labelEl = document.createElement("div");
    labelEl.className = "timeline-label";
    const labelText = getZoneDisplayName(tz);
    labelEl.textContent = labelText;
    row.appendChild(labelEl);

    const boxRow = document.createElement("div");
    boxRow.className = "timeline-box-row";
    for (let hourIdx = 0; hourIdx < TIMELINE_TOTAL_HOURS; hourIdx++) {
        const utcMs = baseDayStartUtcMs + (hourIdx * 60 * 60 * 1000);
        const utcPoint = new Date(utcMs);
        const fixedOffsetMinutes = getFixedOffsetForDisplayAtDate(tz, utcPoint);
        const localParts = getLocalPartsByTimezone(utcPoint, tz, fixedOffsetMinutes);
        const localHour = localParts.hour;
        const isDay = (localHour >= 6 && localHour < 18);

        const box = document.createElement("div");
        box.className = `timeline-hour-box ${isDay ? "day" : "night"}`;

        const isDayBoundary = localHour === 6 || localHour === 17;
        const isNightBoundary = localHour === 18 || localHour === 5;
        if (isDayBoundary || isNightBoundary) {
            const icon = document.createElement("span");
            icon.className = "timeline-hour-icon";
            icon.textContent = isDayBoundary ? "\u2600\uFE0F" : "🌙";
            box.appendChild(icon);
        }

        boxRow.appendChild(box);
    }

    row.appendChild(boxRow);
    return row;
}

function createTimelinePanel(slotIdx, baseRef, rows, panelCount) {
    const panel = document.createElement("section");
    panel.className = "timeline-panel";

    if (panelCount > 1) {
        const title = document.createElement("h3");
        title.className = `timeline-panel-title ${slotIdx === 0 ? "start" : "end"}`;
        title.textContent = t(slotIdx === 0 ? "th_time_day_start" : "th_time_day_end");
        panel.appendChild(title);
    }

    const scroll = document.createElement("div");
    scroll.className = "timeline-scroll";

    const grid = document.createElement("div");
    grid.className = "timeline-grid";

    const axisRow = document.createElement("div");
    axisRow.className = "timeline-axis-row";

    const axisSpacer = document.createElement("div");
    axisSpacer.className = "timeline-label timeline-axis-spacer";
    axisRow.appendChild(axisSpacer);
    axisRow.appendChild(createTimelineAxisTrack());

    const trackBody = document.createElement("div");
    trackBody.className = "timeline-track-body";

    const baseDayStartUtc = getTimelineBaseDayStartUtc(slotIdx, baseRef);
    const baseDayStartUtcMs = baseDayStartUtc.getTime();
    rows.forEach((tz) => {
        trackBody.appendChild(createTimelineRow(slotIdx, tz, baseDayStartUtcMs));
    });

    const indicator = document.createElement("div");
    indicator.className = `timeline-indicator ${slotIdx === 0 ? "start" : "end"}`;
    trackBody.appendChild(indicator);

    grid.appendChild(axisRow);
    grid.appendChild(trackBody);
    scroll.appendChild(grid);
    panel.appendChild(scroll);

    if (!isRealtime) {
        trackBody.classList.add("draggable");
        bindTimelineDrag(trackBody, indicator, slotIdx, baseRef);
    }

    return panel;
}

function getTimelineRenderKey(baseRef, rows, panelCount) {
    const slotDayKeys = [];
    for (let slotIdx = 0; slotIdx < panelCount; slotIdx++) {
        const ctx = getTimelineBaseLocalContext(slotIdx, baseRef);
        const dayKey = `${ctx.parts.year}-${pad(ctx.parts.month)}-${pad(ctx.parts.day)}`;
        slotDayKeys.push(dayKey);
    }

    const rowKeys = rows.map((tz) => {
        const sourceDate = (globalTimes[0] instanceof Date && Number.isFinite(globalTimes[0].getTime()))
            ? globalTimes[0]
            : new Date();
        const fixedOffsetMinutes = getFixedOffsetForDisplayAtDate(tz, sourceDate);
        const offsetToken = Number.isFinite(fixedOffsetMinutes) ? String(fixedOffsetMinutes) : "auto";
        return `${tz.id}:${offsetToken}`;
    });

    return [
        currentMainTab,
        panelCount,
        baseRef.id,
        currentLang,
        currentTheme,
        rowKeys.join(","),
        slotDayKeys.join("|")
    ].join("::");
}

function refreshTimelineIndicators(frame, baseRef, panelCount) {
    let hasPositioned = false;
    for (let slotIdx = 0; slotIdx < panelCount; slotIdx++) {
        const panel = frame.querySelector(`.timeline-panel[data-slot="${slotIdx}"]`);
        if (!panel) continue;
        const trackBody = panel.querySelector(".timeline-track-body");
        const indicator = panel.querySelector(".timeline-indicator");
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
    const frame = document.getElementById("timeline-frame");
    if (!frame) return;

    const timelineSaveBtn = document.getElementById("save-timeline-image-btn");
    const multiTimelineSaveBtn = document.getElementById("save-image-multi-timeline-btn");

    if (!shouldRenderTimeline()) {
        stopTimelineDrag();
        frame.removeAttribute("data-render-key");
        frame.style.display = "none";
        frame.textContent = "";
        if (timelineSaveBtn) timelineSaveBtn.style.display = "none";
        if (multiTimelineSaveBtn) multiTimelineSaveBtn.style.display = "none";
        return;
    }

    if (timelineSaveBtn) timelineSaveBtn.style.display = "inline-block";
    if (multiTimelineSaveBtn) multiTimelineSaveBtn.style.display = "inline-block";

    const baseRef = getBaseTimezoneRef();
    const rows = getTimelineRows(baseRef);
    const panelCount = (!isRealtime && slotCount > 1) ? 2 : 1;
    const nextRenderKey = getTimelineRenderKey(baseRef, rows, panelCount);
    const currentRenderKey = frame.getAttribute("data-render-key") || "";

    if (isRealtime) {
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

    const panels = document.createElement("div");
    panels.className = `timeline-panels${panelCount > 1 ? " dual" : ""}`;

    for (let slotIdx = 0; slotIdx < panelCount; slotIdx++) {
        const panel = createTimelinePanel(slotIdx, baseRef, rows, panelCount);
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

// --- Clock Logic ---
function updateClocks() {
    if (isMultiTab()) {
        renderMultiRanges();
        renderTimelineFrame();
        return;
    }

    const baseRef = getBaseTimezoneRef();
    const utcRef = getUTCRef();
    updateRow(baseRef.id, baseRef);
    if (baseRef.id !== "utc") updateRow(utcRef.id, utcRef);
    const currentZones = getCurrentGroupZones().filter(tz => tz.id !== baseRef.id);
    currentZones.forEach(tz => updateRow(tz.id, tz));
    updateCopyFormatPreview();
    renderTimelineFrame();
}

function updateRow(id, tz) {
    const row = document.getElementById(`tz-row-${id}`);
    if (!row) return;

    let offsetStr = "";
    let zoneCodeMain = "";
    const fixedDisplayOffsetMinutes = getFixedOffsetForDisplay(tz);

    if (tz.type === "custom") {
        zoneCodeMain = normalizeCustomAbbr(tz.abbr);
        const offsetMin = getCustomOffsetMinutes(tz);
        const sign = offsetMin >= 0 ? "+" : "-";
        const absMin = Math.abs(offsetMin);
        const absHour = Math.floor(absMin / 60);
        const minPart = absMin % 60;
        offsetStr = `UTC${sign}${pad(absHour)}:${pad(minPart)}`;
    } else {
        if (Number.isFinite(fixedDisplayOffsetMinutes)) {
            const sign = fixedDisplayOffsetMinutes >= 0 ? "+" : "-";
            const absMin = Math.abs(fixedDisplayOffsetMinutes);
            const absHour = Math.floor(absMin / 60);
            const minPart = absMin % 60;
            offsetStr = `UTC${sign}${pad(absHour)}:${pad(minPart)}`;
        } else {
            const offF = new Intl.DateTimeFormat("en-US", { timeZone: tz.zone, timeZoneName: "longOffset" });
            let partsArr = offF.formatToParts(globalTimes[0]);
            let offVal = partsArr.find(p => p.type === "timeZoneName")?.value || "GMT+0";
            // Normalize to UTC+HH:mm (No GMT)
            const match = offVal.match(/[+-](\d{1,2}):?(\d{2})?/);
            if (match) {
                const sign = offVal.includes("+") ? "+" : "-";
                offsetStr = `UTC${sign}${pad(match[1])}:${pad(match[2] || 0)}`;
            } else {
                offsetStr = "UTC+00:00";
            }
        }
        zoneCodeMain = getZoneAbbreviation(tz, globalTimes[0]);
    }

    const zoneCodeEl = row.querySelector(".zone-code");
    const offsetTextEl = row.querySelector(".offset-text");
    if (zoneCodeEl) zoneCodeEl.textContent = zoneCodeMain;
    if (offsetTextEl) offsetTextEl.textContent = offsetStr;

    // Helper: updateDN inside updateRow
    const updateDN = (hour, el) => {
        if (!el) return;
        const isDay = (hour >= 6 && hour <= 18);
        el.textContent = isDay ? "\u2600\uFE0F" : "🌙";
        el.title = isDay ? t("dn_day") : t("dn_night");
    };

    const effectiveSlotCount = isRealtime ? 1 : slotCount;
    const slotTimeParts = [];
    for (let i = 0; i < effectiveSlotCount; i++) {
        let t;
        if (tz.type === "custom" || Number.isFinite(fixedDisplayOffsetMinutes)) {
            const curBase = globalTimes[i];
            const offsetMin = tz.type === "custom" ? getCustomOffsetMinutes(tz) : fixedDisplayOffsetMinutes;
            const tMs = curBase.getTime() + (offsetMin * 60000);
            t = new Date(tMs);
        } else {
            const f = new Intl.DateTimeFormat("en-US", {
                timeZone: tz.zone, year: "numeric", month: "numeric", day: "numeric",
                hour: "numeric", minute: "numeric", second: "numeric", weekday: "short", hour12: false
            });
            const parts = f.formatToParts(globalTimes[i]);
            const get = type => parts.find(p => p.type === type)?.value || "";
            const h = parseInt(get("hour"));
            t = {
                str: `${get("year")}-${pad(get("month"))}-${pad(get("day"))} ${pad(h === 24 ? 0 : h)}:${pad(get("minute"))}:${pad(get("second"))}`,
                dow: { "Sun": 0, "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6 }[get("weekday")]
            };
        }

        const inputs = [...row.querySelectorAll(`.time-input[data-slot="${i}"]`)];
        const dayBadges = [...row.querySelectorAll(`.day-slot-${i}`)];
        const dnIcons = [...row.querySelectorAll(`.dn-slot-${i}`)];

        let displayHour = 0;
        let displayDow = 0;
        let timeStr = "";

        if (t instanceof Date) {
            displayHour = t.getUTCHours();
            displayDow = t.getUTCDay();
            timeStr = `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())} ${pad(displayHour)}:${pad(t.getUTCMinutes())}:${pad(t.getUTCSeconds())}`;
        } else {
            displayHour = parseInt(t.str.split(" ")[1].split(":")[0]);
            displayDow = t.dow;
            timeStr = t.str;
        }

        const [dateStr, clockStrRaw] = timeStr.split(" ");
        const clockStr = (clockStrRaw || "").trim();
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
            dayBadge.textContent = I18N_DATA[currentLang].days[displayDow];
            dayBadge.className = "day-badge day-slot-" + i + " " + (displayDow === 0 ? "day-sun" : (displayDow === 6 ? "day-sat" : ""));
        });
        dnIcons.forEach(dnIcon => updateDN(displayHour, dnIcon));
        slotTimeParts.push(timeStr);
    }

    const periodEl = row.querySelector(".period-days-text");
    if (periodEl) {
        if (effectiveSlotCount > 1 && slotTimeParts.length > 1) {
            const spanDays = getSignedInclusiveDaySpan(slotTimeParts[0], slotTimeParts[1]);
            periodEl.textContent = spanDays === null ? "-" : `${spanDays}${t("unit_days_suffix")}`;
        } else {
            periodEl.textContent = "-";
        }
    }

    const periodTimeEl = row.querySelector(".period-time-text");
    if (periodTimeEl) {
        if (effectiveSlotCount > 1 && slotTimeParts.length > 1) {
            const spanTime = getSignedDurationDayHourMinute(slotTimeParts[0], slotTimeParts[1]);
            periodTimeEl.textContent = spanTime === null ? "-" : spanTime;
        } else {
            periodTimeEl.textContent = "-";
        }
    }
}

function resolveLocalDatePartsByTimezoneAtDate(timezone, utcDate, timezoneId = null) {
    const sourceDate = (utcDate instanceof Date && Number.isFinite(utcDate.getTime()))
        ? utcDate
        : new Date();

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
            tz = currentZones.find(z => z.id === timezoneId) || null;
        }
        if (!tz) {
            const row = document.querySelector(".dragging") || (document.activeElement?.closest ? document.activeElement.closest("tr") : null);
            const rowId = row?.id ? row.id.replace("tz-row-", "") : "";
            if (rowId) tz = currentZones.find(z => z.id === rowId) || null;
        }
        if (!tz) return null;
        const shifted = new Date(sourceDate.getTime() + (getCustomOffsetMinutes(tz) * 60000));
        return { Y: shifted.getUTCFullYear(), M: shifted.getUTCMonth() + 1, D: shifted.getUTCDate() };
    }

    if (timezoneId) {
        const tz = getCurrentGroupZones().find((item) => item.id === timezoneId) || null;
        const fixedOffsetMinutes = getFixedOffsetForDisplayAtDate(tz, sourceDate);
        if (Number.isFinite(fixedOffsetMinutes)) {
            const shifted = new Date(sourceDate.getTime() + (fixedOffsetMinutes * 60000));
            return { Y: shifted.getUTCFullYear(), M: shifted.getUTCMonth() + 1, D: shifted.getUTCDate() };
        }
    }

    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour12: false
    });
    const parts = formatter.formatToParts(sourceDate);
    const get = (type) => parseInt(parts.find(p => p.type === type)?.value || "0", 10);
    return { Y: get("year"), M: get("month"), D: get("day") };
}

function resolveLocalDatePartsByTimezone(timezone, slotIdx, timezoneId = null) {
    return resolveLocalDatePartsByTimezoneAtDate(timezone, globalTimes[slotIdx], timezoneId);
}

function buildStrictUtcDateFromParts(parts) {
    return GTV_TIME_CORE.buildStrictUtcDateFromParts(parts);
}

function handleTimeChange(val, timezone, slotIdx, timezoneId = null, inputMode = "datetime") {
    if (isRealtime) return;
    const normalized = (val || "").trim();
    const dateTimeMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
    const dateOnlyMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const timeOnlyMatch = normalized.match(/^(\d{2}):(\d{2}):(\d{2})$/);
    let Y = 0; let M = 0; let D = 0; let H = 0; let min = 0; let S = 0;
    if (inputMode === "none") {
        return;
    }
    if (inputMode === "datetime" && dateTimeMatch) {
        [Y, M, D, H, min, S] = dateTimeMatch.slice(1).map(Number);
    } else if (inputMode === "date" && dateOnlyMatch) {
        [Y, M, D] = dateOnlyMatch.slice(1).map(Number);
    } else if (inputMode === "time" && timeOnlyMatch) {
        const baseDateParts = resolveLocalDatePartsByTimezone(timezone, slotIdx, timezoneId);
        if (!baseDateParts) return;
        ({ Y, M, D } = baseDateParts);
        [H, min, S] = timeOnlyMatch.slice(1).map(Number);
    } else {
        showToast(t("toast_invalid_date"));
        renderList();
        return;
    }
    const tempUTC = buildStrictUtcDateFromParts({
        year: Y,
        month: M,
        day: D,
        hour: H,
        minute: min,
        second: S
    });
    if (!tempUTC) {
        showToast(t("toast_invalid_date"));
        renderList();
        return;
    }

    if (timezone === "UTC") {
        globalTimes[slotIdx] = tempUTC;
    } else if (timezone === "CUSTOM") {
        const currentZones = getCurrentGroupZones();
        let tz = null;

        if (timezoneId) {
            tz = currentZones.find(z => z.id === timezoneId) || null;
        }
        // Backward fallback: resolve from focused/dragging row if id wasn't provided.
        if (!tz) {
            const row = document.querySelector(".dragging") || (document.activeElement?.closest ? document.activeElement.closest("tr") : null);
            const rowId = row?.id ? row.id.replace("tz-row-", "") : "";
            if (rowId) tz = currentZones.find(z => z.id === rowId) || null;
        }
        if (tz) {
            const offMs = getCustomOffsetMinutes(tz) * 60000;
            globalTimes[slotIdx] = new Date(tempUTC.getTime() - offMs);
        } else {
            return;
        }
    } else {
        const zoneRef = timezoneId
            ? (getCurrentGroupZones().find((z) => z.id === timezoneId) || null)
            : null;
        const fixedOffsetMinutes = getFixedOffsetForDisplayAtDate(zoneRef, globalTimes[0]);
        const offMin = Number.isFinite(fixedOffsetMinutes)
            ? fixedOffsetMinutes
            : getTimezoneOffset(timezone, tempUTC);
        const offMs = offMin * 60000;
        globalTimes[slotIdx] = new Date(tempUTC.getTime() - offMs);
    }
    updateClocks();
}

function handleMultiRangeTimeChange(rangeIdx, val, timezone, slotIdx, timezoneId = null, inputMode = "datetime") {
    if (!isMultiTab()) return;
    if (rangeIdx > 0 && slotIdx === 0 && !isMultiRangeStartEditEnabled(rangeIdx)) return;
    if (slotIdx === 1 && !isMultiRangeEndEditEnabled(rangeIdx)) return;

    ensureMultiRangeState();
    const range = multiRanges[rangeIdx];
    if (!range) return;

    const normalized = (val || "").trim();
    const dateTimeMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
    const dateOnlyMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const timeOnlyMatch = normalized.match(/^(\d{2}):(\d{2}):(\d{2})$/);
    let Y = 0; let M = 0; let D = 0; let H = 0; let min = 0; let S = 0;

    if (inputMode === "none") return;

    if (inputMode === "datetime" && dateTimeMatch) {
        [Y, M, D, H, min, S] = dateTimeMatch.slice(1).map(Number);
    } else if (inputMode === "date" && dateOnlyMatch) {
        [Y, M, D] = dateOnlyMatch.slice(1).map(Number);
    } else if (inputMode === "time" && timeOnlyMatch) {
        const baseDate = getMultiRangeSlotDate(rangeIdx, slotIdx);
        const baseDateParts = resolveLocalDatePartsByTimezoneAtDate(timezone, baseDate, timezoneId);
        if (!baseDateParts) return;
        ({ Y, M, D } = baseDateParts);
        [H, min, S] = timeOnlyMatch.slice(1).map(Number);
    } else {
        showToast(t("toast_invalid_date"));
        renderMultiRanges();
        return;
    }

    const tempUTC = buildStrictUtcDateFromParts({
        year: Y,
        month: M,
        day: D,
        hour: H,
        minute: min,
        second: S
    });
    if (!tempUTC) {
        showToast(t("toast_invalid_date"));
        renderMultiRanges();
        return;
    }

    let nextUtcDate = null;
    if (timezone === "UTC") {
        nextUtcDate = tempUTC;
    } else if (timezone === "CUSTOM") {
        const tz = getCurrentGroupZones().find(z => z.id === timezoneId) || null;
        if (!tz) return;
        const offMs = getCustomOffsetMinutes(tz) * 60000;
        nextUtcDate = new Date(tempUTC.getTime() - offMs);
    } else {
        const offsetAnchor = new Date(range.startUtcMs);
        const zoneRef = timezoneId
            ? (getCurrentGroupZones().find((z) => z.id === timezoneId) || null)
            : null;
        const fixedOffsetMinutes = getFixedOffsetForDisplayAtDate(zoneRef, offsetAnchor);
        const offMin = Number.isFinite(fixedOffsetMinutes)
            ? fixedOffsetMinutes
            : getTimezoneOffset(timezone, tempUTC);
        nextUtcDate = new Date(tempUTC.getTime() - (offMin * 60000));
    }

    if (!(nextUtcDate instanceof Date) || !Number.isFinite(nextUtcDate.getTime())) return;
    setMultiRangeSlotDate(rangeIdx, slotIdx, nextUtcDate);

    if (slotIdx === 1) {
        syncFollowingRangesByDuration(rangeIdx);
    } else if (rangeIdx === 0) {
        syncMultiRangeStartLinks(1);
    }

    renderMultiRanges();
    savePersistence();
}

// --- Utils ---
// Clear and Redraw Options on init/lang change
function updateTZDropdown() {
    return timezoneSearchService.updateTZDropdown();
}

function initSearchAndSelect() {
    return timezoneSearchService.initSearchAndSelect();
}

function createStandardTimezoneFromSelectableEntry(entry) {
    return timezoneSearchService.createStandardTimezoneFromSelectableEntry(entry);
}

function addFromSearchWithData(entryKey) {
    return timezoneSearchService.addFromSearchWithData(entryKey);
}

// function addFromSearch is now replaced by addFromSearchWithData
function addTimezone(tz) {
    const activeGroup = groups[activeGroupId];
    if (!activeGroup) return;
    if (!tz || typeof tz !== "object") return;
    if (tz?.type === "standard" && !isValidTimeZone(tz.zone)) {
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
    savePersistence();
    renderList();
}
function removeTimezone(id) {
    const activeGroup = groups[activeGroupId];
    if (!activeGroup) return;
    if (id === getCurrentGroupBaseTimezoneId()) return;
    if (id === "utc") {
        activeGroup.showUtcRow = false;
        activeGroup.utcRowOrder = 0;
        savePersistence();
        renderList();
        return;
    }
    activeGroup.zones = activeGroup.zones.filter(z => z.id !== id);
    savePersistence();
    renderList();
}
function initDragAndDrop() {
    const container = document.getElementById("clocks-container");
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
function saveOrder() {
    const activeGroup = groups[activeGroupId];
    if (!activeGroup) return;
    const ids = [...document.querySelectorAll("#clocks-container .time-row:not(.static)")].map(r => r.id.replace("tz-row-", ""));
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
    savePersistence();
}

function getTimezoneRefById(id) {
    return snapshotFormatService.getTimezoneRefById(id);
}

function buildTimezoneComputedSnapshot(id) {
    return snapshotFormatService.buildTimezoneComputedSnapshot(id);
}

function formatTimeTextByParts(snapshot, timePartsEnabled) {
    return snapshotFormatService.formatTimeTextByParts(snapshot, timePartsEnabled);
}

function getCopyFieldText(snapshot, key, options = {}) {
    return snapshotFormatService.getCopyFieldText(snapshot, key, options);
}

function getRowCopyText(rowOrId) {
    return snapshotFormatService.getRowCopyText(rowOrId, {
        order: copyFormatOrder,
        enabled: copyFormatEnabled,
        timePartsEnabled: copyTimePartsEnabled
    });
}

function formatSnapshotText(snapshot, order, enabled, timePartsEnabled = DEFAULT_COPY_TIME_PARTS_ENABLED) {
    return snapshotFormatService.formatSnapshotText(snapshot, order, enabled, timePartsEnabled);
}

function getRowFormattedText(rowOrId, order, enabled, timePartsEnabled = DEFAULT_COPY_TIME_PARTS_ENABLED) {
    return snapshotFormatService.getRowFormattedText(rowOrId, order, enabled, timePartsEnabled);
}

function updateCopyFormatPreview() {
    return copyActionsService.updateCopyFormatPreview();
}

async function copyRow(id) {
    return copyActionsService.copyRow(id);
}

async function copyAllTimezones() {
    return copyActionsService.copyAllTimezones();
}

async function copyMultiRangeRow(rangeIdx, rowId) {
    return multiRangeCopyService.copyMultiRangeRow(rangeIdx, rowId);
}

async function copyWholeMultiRange(rangeIdx) {
    return multiRangeCopyService.copyWholeMultiRange(rangeIdx);
}

async function copyAllMultiRangeTimezones() {
    return multiRangeCopyService.copyAllMultiRangeTimezones();
}

function sanitizeFilenamePart(value) {
    return String(value || "")
        .replace(/[\\/:*?"<>|]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function formatDateTimeByTimezone(date, tz) {
    if (tz?.type === "custom") {
        const offsetMin = getCustomOffsetMinutes(tz);
        const shifted = new Date(date.getTime() + (offsetMin * 60000));
        return `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())} ${pad(shifted.getUTCHours())}:${pad(shifted.getUTCMinutes())}:${pad(shifted.getUTCSeconds())}`;
    }

    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: tz?.zone || "UTC",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false
    });
    const parts = formatter.formatToParts(date);
    const get = (type) => parts.find(p => p.type === type)?.value || "0";
    const hourRaw = parseInt(get("hour"), 10);
    const hour = hourRaw === 24 ? 0 : hourRaw;
    return `${get("year")}-${pad(get("month"))}-${pad(get("day"))} ${pad(hour)}:${pad(get("minute"))}:${pad(get("second"))}`;
}

function getTimezoneTableImageFilename() {
    const baseRef = getBaseTimezoneRef();
    const groupName = sanitizeFilenamePart(groups[activeGroupId]?.name || t("default_group_name")) || "Group";
    const baseAbbr = sanitizeFilenamePart(getZoneAbbreviation(baseRef) || "UTC") || "UTC";
    const baseDateTime = formatDateTimeByTimezone(globalTimes[0], baseRef).trim();
    const m = baseDateTime.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
    const timePart = sanitizeFilenamePart(m ? `${m[1]} ${m[2]}${m[3]}${m[4]}` : baseDateTime.replace(/:/g, "")) || "time";

    return `${groupName}_${baseAbbr}_${timePart}`;
}

function getMultiRangeTableImageFilename(rangeIdx) {
    const baseName = getTimezoneTableImageFilename();
    const subgroupName = sanitizeMultiSubgroupName(getCurrentMultiSubgroupName(), "subgroup");
    const rangeLabel = sanitizeFilenamePart(`${subgroupName} ${rangeIdx + 1}`) || `range_${rangeIdx + 1}`;
    return `${baseName}_${rangeLabel}.png`;
}

function getMultiRangeTitlesImageFilename() {
    const baseName = getTimezoneTableImageFilename();
    const titleLabel = sanitizeFilenamePart(sanitizeMultiSubgroupName(getCurrentMultiSubgroupName(), "subgroup")) || "range";
    return `${baseName}_${titleLabel}_titles.png`;
}

function collectDocumentCssText() {
    let cssText = "";
    // 1. First, try to get styles from styleSheets
    for (const styleSheet of [...document.styleSheets]) {
        try {
            if (styleSheet.cssRules) {
                for (const rule of [...styleSheet.cssRules]) {
                    cssText += `${rule.cssText}\n`;
                }
            }
        } catch (err) {
            // Could not read cssRules
        }
    }

    // 2. Internal style tags fallback
    const internalStyles = document.querySelectorAll("style");
    internalStyles.forEach(s => {
        if (s.innerText && !cssText.includes(s.innerText.substring(0, 50))) {
            cssText += `\n${s.innerText}\n`;
        }
    });

    // 3. Dynamic Theme Variables Injection
    const rootStyle = getComputedStyle(document.documentElement);
    const bodyStyle = getComputedStyle(document.body);

    // Capture current theme essentials
    const themeVars = [
        "--panel-bg", "--panel-bg-alt", "--border", "--text", "--text-dim",
        "--accent", "--accent-hover", "--table-head-bg", "--timeline-label-w",
        "--timeline-box-w", "--timeline-box-h", "--ui-scale"
    ];

    let injectedVars = ":root {\n";
    themeVars.forEach(v => {
        const val = rootStyle.getPropertyValue(v).trim();
        if (val) injectedVars += `  ${v}: ${val} !important;\n`;
    });
    // Fallback for missing critical values
    if (!rootStyle.getPropertyValue("--timeline-label-w")) injectedVars += "  --timeline-label-w: 150px;\n";
    if (!rootStyle.getPropertyValue("--timeline-box-h")) injectedVars += "  --timeline-box-h: 28px;\n";

    injectedVars += `  background-color: ${bodyStyle.backgroundColor || "#0f172a"} !important;\n`;
    injectedVars += "}\n";

    cssText = injectedVars + cssText;

    // [Scorched Earth] Security cleaning
    cssText = cssText.replace(/@font-face\s*{[\s\S]*?}/gi, "");
    cssText = cssText.replace(/@import\s+[^;]+;/gi, "");
    cssText = cssText.replace(/url\s*\([\s\S]*?\)/gi, "none");
    cssText += `\n* { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important; }\n`;

    return cssText;
}

function cloneTableForImageExport(tableEl) {
    const clone = tableEl.cloneNode(true);
    const srcInputs = tableEl.querySelectorAll(".time-input");
    const clonedInputs = clone.querySelectorAll(".time-input");

    clonedInputs.forEach((inputEl, idx) => {
        const span = document.createElement("span");
        span.className = "export-time-text";
        span.textContent = srcInputs[idx]?.value || "";
        inputEl.replaceWith(span);
    });

    clone.querySelectorAll(".export-exclude, .move-col, .move-cell").forEach((node) => node.remove());

    return clone;
}

function cloneMultiRangeBlockForImageExport(blockEl) {
    const clone = blockEl.cloneNode(true);
    const srcInputs = blockEl.querySelectorAll(".time-input");
    const clonedInputs = clone.querySelectorAll(".time-input");

    clonedInputs.forEach((inputEl, idx) => {
        const span = document.createElement("span");
        span.className = "export-time-text";
        span.textContent = srcInputs[idx]?.value || "";
        inputEl.replaceWith(span);
    });

    clone.classList.remove("collapsed");
    clone.querySelectorAll(".multi-range-header-actions, .multi-range-adjust-row, .export-exclude, .move-col, .move-cell").forEach((node) => node.remove());
    return clone;
}

function cloneMultiRangesForImageExport(containerEl) {
    const wrapper = document.createElement("div");
    wrapper.className = "multi-ranges-container";
    const blocks = [...containerEl.querySelectorAll(".multi-range-block")];
    blocks.forEach((blockEl) => {
        wrapper.appendChild(cloneMultiRangeBlockForImageExport(blockEl));
    });
    return wrapper;
}
async function renderElementWithForeignObjectToPngDataUrl(renderElement) {
    if (!renderElement) throw new Error("Render element not found");

    // Temporarily host to measure exact content size
    const measureHost = document.createElement("div");
    // Flexible width for measurement to avoid premature wrapping
    measureHost.style.cssText = "position:fixed; left:-99999px; top:0; width:max-content; min-width:1400px; height:auto; visibility:hidden; pointer-events:none; display:block !important;";
    const measureClone = renderElement.cloneNode(true);
    // Ensure all blocks are visible for measurement
    measureClone.classList.remove("collapsed");

    // CRITICAL: If this is the multi-ranges container, ensure it stacks vertically during measurement
    // so that the scrollWidth/scrollHeight matches the final SVG layout (flex-direction: column).
    if (measureClone.classList.contains("multi-ranges-container") || measureClone.querySelector(".multi-range-block")) {
        measureClone.style.display = "flex";
        measureClone.style.flexDirection = "column";
        measureClone.style.alignItems = "center";
        measureClone.style.gap = "40px";
        measureClone.style.width = "1400px"; // Constrain width for a vertical stack
    }

    measureHost.appendChild(measureClone);
    document.body.appendChild(measureHost);

    // Measure the actual boundary of content
    const width = Math.ceil(measureClone.scrollWidth || 1400);
    const height = Math.ceil(measureClone.scrollHeight || 600);
    measureHost.remove();

    const targetWidth = TABLE_IMAGE_EXPORT_WIDTH;
    const targetHeight = Math.max(1, Math.round((height * targetWidth) / width));

    const markup = new XMLSerializer().serializeToString(renderElement);
    const cssText = collectDocumentCssText();

    // 21st round: Ultra Visual Fidelity & Vertical Stacking Fix
    const dayBox = document.querySelector(".timeline-hour-box.day");
    const nightBox = document.querySelector(".timeline-hour-box.night");
    const liveDayBg = dayBox ? getComputedStyle(dayBox).backgroundColor : "#caeefb";
    const liveNightBg = "#616161"; // Force requested color
    const liveBorder = dayBox ? getComputedStyle(dayBox).borderTopColor : "#8795aa";
    const liveText = getComputedStyle(document.body).color || "#f8fafc";
    const liveBg = getComputedStyle(document.body).backgroundColor || "#0f172a";

    const extraCss = `
        /* Root variable overrides for SVG context */
        :root {
            --text: ${liveText} !important;
            --panel-bg: ${liveBg} !important;
        }

        /* Essential resetting and centering */
        body { 
            background-color: ${liveBg} !important; 
            margin: 0 !important;
            padding: 0 !important;
            display: flex !important;
            justify-content: center !important;
            align-items: flex-start !important;
        }

        /* Force container to fill the image with exact theme background */
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

        /* Vertical Stacking for All Ranges Export */
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

        /* Dual Panels (Extra Time) - Split LEFT/RIGHT as requested */
        .timeline-panels.dual {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 30px !important;
            width: 100% !important;
            margin: 0 auto !important;
        }

        /* Timeline grid preservation & layout fixes */
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

        /* General UI scale and layout fixes */
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

    const tempDiv = document.createElement("div");
    tempDiv.insertAdjacentHTML('beforeend', markup);

    // Filter tags but keep SVG for drawings
    const riskyTags = ["script", "iframe", "object", "embed", "link", "meta", "image", "img"];
    riskyTags.forEach(tag => tempDiv.querySelectorAll(tag).forEach(el => el.remove()));

    // Strict attribute whitelist
    const walker = document.createTreeWalker(tempDiv, NodeFilter.SHOW_ELEMENT);
    let curr = walker.nextNode();
    const SAFE_ATTRS = new Set([
        "id", "class", "style", "colspan", "rowspan", "width", "height", "xmlns",
        "viewbox", "x", "y", "rx", "ry", "cx", "cy", "r", "d", "fill", "stroke",
        "stroke-width", "points", "transform", "preserveaspectratio", "opacity"
    ]);

    while (curr) {
        if (curr.nodeType === 1) {
            const attrs = [...curr.attributes];
            for (const attr of attrs) {
                if (!SAFE_ATTRS.has(attr.name.toLowerCase())) curr.removeAttribute(attr.name);
            }
            const style = curr.getAttribute("style");
            if (style && style.toLowerCase().includes("url")) {
                curr.setAttribute("style", style.replace(/url\s*\(/gi, "none("));
            }
        }
        curr = walker.nextNode();
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

    try {
        await waitForDocumentFontsReady();
        const img = await loadImageElement(svgDataUrl);
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas context unavailable");

        ctx.fillStyle = getComputedStyle(document.body).backgroundColor || "#0f172a";
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        try {
            ctx.getImageData(0, 0, 1, 1);
        } catch (taintErr) {
            // Canvas TAINTED
            throw taintErr;
        }

        return canvas.toDataURL("image/png");
    } catch (err) {
        // ERROR handled
        throw err;
    }
}

function loadImageElement(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(new Error("Image load error"));
        img.src = src;
    });
}

async function waitForDocumentFontsReady() {
    if (!document.fonts?.ready) return;
    try {
        await document.fonts.ready;
    } catch (_) {
        // Ignore font readiness failures and continue with fallback rendering.
    }
}

function isDomExceptionLike(err) {
    if (!err) return false;
    if (typeof DOMException !== "undefined" && err instanceof DOMException) return true;
    const name = typeof err.name === "string" ? err.name : "";
    return name === "SecurityError" || name === "InvalidStateError";
}

async function detectForeignObjectRendererSupport() {
    if (typeof canUseForeignObjectRenderer === "boolean") return canUseForeignObjectRenderer;
    if (typeof URL === "undefined" || typeof URL.createObjectURL !== "function") {
        canUseForeignObjectRenderer = false;
        return false;
    }

    const probeSvg = `
        < svg xmlns = "http://www.w3.org/2000/svg" width = "4" height = "4" viewBox = "0 0 4 4" >
            <foreignObject width="100%" height="100%">
                <div xmlns="http://www.w3.org/1999/xhtml" style="width:4px;height:4px;background:#000;"></div>
            </foreignObject>
        </svg >
        `;
    const probeBlob = new Blob([probeSvg], { type: "image/svg+xml;charset=utf-8" });
    const probeUrl = URL.createObjectURL(probeBlob);
    try {
        const img = await loadImageElement(probeUrl);
        const canvas = document.createElement("canvas");
        canvas.width = 4;
        canvas.height = 4;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            canUseForeignObjectRenderer = false;
            return false;
        }
        ctx.drawImage(img, 0, 0, 4, 4);
        canvas.toDataURL("image/png");
        canUseForeignObjectRenderer = true;
        return true;
    } catch (err) {
        canUseForeignObjectRenderer = false;
        return false;
    } finally {
        URL.revokeObjectURL(probeUrl);
    }
}

function extractTableCellText(cell) {
    if (!cell) return "";
    const timeInput = cell.querySelector(".time-input");
    const exportTimeText = cell.querySelector(".export-time-text");
    if (timeInput) {
        const dnText = (cell.querySelector(".dn-icon")?.textContent || "").trim();
        const dayBadge = cell.querySelector(".day-badge");
        const timeText = (timeInput.value || "").trim();
        const dayText = (dayBadge?.textContent || "").trim();
        return [dnText, timeText, dayText].filter(Boolean).join(" ").trim();
    }
    if (exportTimeText) {
        const dnText = (cell.querySelector(".dn-icon")?.textContent || "").trim();
        const dayBadge = cell.querySelector(".day-badge");
        const timeText = (exportTimeText.textContent || "").trim();
        const dayText = (dayBadge?.textContent || "").trim();
        return [dnText, timeText, dayText].filter(Boolean).join(" ").trim();
    }

    const zoneCode = (cell.querySelector(".zone-code")?.textContent || "").trim();
    if (zoneCode) return zoneCode;
    const zoneName = (cell.querySelector(".zone-name")?.textContent || "").trim();
    if (zoneName) return zoneName;
    const offsetText = (cell.querySelector(".offset-text")?.textContent || "").trim();
    if (offsetText) return offsetText;
    const periodDays = (cell.querySelector(".period-days-text")?.textContent || "").trim();
    if (periodDays && periodDays !== "-") return periodDays;
    const periodTime = (cell.querySelector(".period-time-text")?.textContent || "").trim();
    if (periodTime && periodTime !== "-") return periodTime;
    const buttonText = (cell.querySelector("button")?.textContent || "").trim();
    if (buttonText) return buttonText;
    return (cell.textContent || "").trim();
}

async function renderTimezoneTableFallbackDataUrl() {
    await waitForDocumentFontsReady();

    const table = document.querySelector("#timezone-section .data-table");
    if (!table) throw new Error("Table element not found");

    const headerCells = [...table.querySelectorAll("#table-head th")]
        .filter((th) => !th.classList.contains("export-exclude") && !th.classList.contains("move-col"));
    const bodyRows = [...table.querySelectorAll("#clocks-container tr.time-row")];
    if (!headerCells.length || !bodyRows.length) {
        throw new Error("No table data to render");
    }

    const colCount = headerCells.length;
    const measuredColWidths = headerCells.map((th) => {
        const w = Math.ceil(th.getBoundingClientRect().width);
        return Math.max(w, 70);
    });
    const tableWidth = measuredColWidths.reduce((acc, w) => acc + w, 0);
    const headerHeight = Math.max(34, Math.ceil(headerCells[0].getBoundingClientRect().height) || 40);
    const rowHeights = bodyRows.map((row) => Math.max(34, Math.ceil(row.getBoundingClientRect().height) || 40));
    const tableHeight = headerHeight + rowHeights.reduce((acc, h) => acc + h, 0);
    const targetWidth = TABLE_IMAGE_EXPORT_WIDTH;
    const renderRatio = targetWidth / Math.max(1, tableWidth);
    const targetHeight = Math.max(1, Math.round(tableHeight * renderRatio));

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context unavailable");
    ctx.scale(renderRatio, renderRatio);

    const rootStyle = getComputedStyle(document.documentElement);
    const bodyStyle = getComputedStyle(document.body);
    const headBg = (rootStyle.getPropertyValue("--table-head-bg") || "#1e293b").trim();
    const borderColor = (rootStyle.getPropertyValue("--border") || "rgba(148,163,184,0.25)").trim();
    const textColor = (rootStyle.getPropertyValue("--text") || "#f1f5f9").trim();
    const dimColor = (rootStyle.getPropertyValue("--text-dim") || "#94a3b8").trim();
    const rowBgA = "rgba(255,255,255,0.02)";
    const rowBgB = "rgba(255,255,255,0.04)";
    const pageBg = bodyStyle.backgroundColor || "#0f172a";

    ctx.fillStyle = pageBg;
    ctx.fillRect(0, 0, tableWidth, tableHeight);

    const exportBodyFont = `13px ${EXPORT_MONO_FONT_FAMILY} `;
    const exportHeaderFont = `600 13px ${EXPORT_MONO_FONT_FAMILY} `;
    const drawCellText = (text, x, y, w, h, align = "left", color = textColor, font = exportBodyFont) => {
        ctx.save();
        ctx.fillStyle = color;
        ctx.font = font;
        ctx.textBaseline = "middle";
        const padX = 8;
        if (align === "center") {
            ctx.textAlign = "center";
            ctx.fillText(text, x + (w / 2), y + (h / 2));
        } else {
            ctx.textAlign = "left";
            ctx.fillText(text, x + padX, y + (h / 2));
        }
        ctx.restore();
    };

    const isCenterHeader = () => true;
    const isCenterBodyCell = (cell) => {
        if (!cell) return false;
        if (
            cell.classList.contains("move-cell") ||
            cell.classList.contains("timezone-cell") ||
            cell.classList.contains("period-days-cell") ||
            cell.classList.contains("period-time-cell")
        ) {
            return true;
        }
        return !!cell.querySelector(".offset-text");
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
        const headText = (headerCells[c].textContent || "").trim();
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
        const cells = [...row.children]
            .filter((td) => !td.classList.contains("export-exclude") && !td.classList.contains("move-cell"));
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
    const sectionEl = document.getElementById("timezone-section");
    const tableEl = sectionEl ? sectionEl.querySelector(".data-table") : null;
    if (!tableEl) throw new Error("Timezone table not found");
    return renderElementWithForeignObjectToPngDataUrl(cloneTableForImageExport(tableEl));
}

async function renderMultiRangesFallbackDataUrl(targetRangeIdx = null) {
    await waitForDocumentFontsReady();

    const containerEl = document.getElementById("multi-ranges-container");
    if (!containerEl) throw new Error("Multi-range container not found");

    const sourceBlocks = [...containerEl.querySelectorAll(".multi-range-block")];
    const selectedBlocks = Number.isInteger(targetRangeIdx)
        ? (sourceBlocks[targetRangeIdx] ? [sourceBlocks[targetRangeIdx]] : [])
        : sourceBlocks;
    if (!selectedBlocks.length) throw new Error("No multi-range table data to render");

    const clonedContainer = document.createElement("div");
    clonedContainer.className = "multi-ranges-container";
    selectedBlocks.forEach((blockEl) => {
        clonedContainer.appendChild(cloneMultiRangeBlockForImageExport(blockEl));
    });

    const measureHost = document.createElement("div");
    measureHost.style.cssText = "position:fixed; left:-10000px; top:0; width:auto; min-width:800px; max-width:1400px; height:auto; opacity:0; pointer-events:none; display:block !important;";
    measureHost.appendChild(clonedContainer);
    document.body.appendChild(measureHost);

    const metrics = [];
    try {
        const blockEls = [...clonedContainer.querySelectorAll(".multi-range-block")];
        blockEls.forEach((block) => {
            block.classList.remove("collapsed"); // Fix: Ensure all blocks are expanded for export
            const titleText = (block.querySelector(".multi-range-title")?.textContent || "").trim();
            const tableEl = block.querySelector(".data-table");
            if (!tableEl) return;

            const headerCells = [...tableEl.querySelectorAll("thead th")]
                .filter((th) => !th.classList.contains("export-exclude") && !th.classList.contains("move-col"));
            const bodyRows = [...tableEl.querySelectorAll("tbody tr.time-row")];
            if (!headerCells.length || !bodyRows.length) return;

            const colWidths = headerCells.map((th) => Math.max(Math.ceil(th.getBoundingClientRect().width), 70));
            const tableWidth = colWidths.reduce((acc, w) => acc + w, 0);
            const headerHeight = Math.max(34, Math.ceil(headerCells[0].getBoundingClientRect().height) || 40);
            const rowHeights = bodyRows.map((row) => Math.max(34, Math.ceil(row.getBoundingClientRect().height) || 40));
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
        measureHost.remove();
    }

    if (!metrics.length) throw new Error("No multi-range table data to render");

    const rootStyle = getComputedStyle(document.documentElement);
    const bodyStyle = getComputedStyle(document.body);
    const pageBg = bodyStyle.backgroundColor || "#0f172a";
    const headBg = (rootStyle.getPropertyValue("--table-head-bg") || "#1e293b").trim();
    const borderColor = (rootStyle.getPropertyValue("--border") || "rgba(148,163,184,0.25)").trim();
    const textColor = (rootStyle.getPropertyValue("--text") || "#f1f5f9").trim();
    const dimColor = (rootStyle.getPropertyValue("--text-dim") || "#94a3b8").trim();
    const accentColor = (rootStyle.getPropertyValue("--accent") || "#38bdf8").trim();
    const rowBgA = "rgba(255,255,255,0.02)";
    const rowBgB = "rgba(255,255,255,0.04)";
    const titleBg = "rgba(56, 189, 248, 0.10)";
    const blockGap = 14;
    const titleHeight = 38;
    const maxTableWidth = Math.max(...metrics.map((metric) => metric.tableWidth));
    const sourceWidth = Math.max(1, maxTableWidth);
    const sourceHeight = metrics.reduce((sum, metric, idx) => (
        sum + titleHeight + metric.tableHeight + (idx < metrics.length - 1 ? blockGap : 0)
    ), 0);
    // Add small buffer to avoid truncation
    const canvasHeightBuffer = 4;
    const targetWidth = TABLE_IMAGE_EXPORT_WIDTH;
    const renderRatio = targetWidth / sourceWidth;
    const targetHeight = Math.max(1, Math.round(sourceHeight * renderRatio));

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context unavailable");
    ctx.scale(renderRatio, renderRatio);

    ctx.fillStyle = pageBg;
    ctx.fillRect(0, 0, sourceWidth, sourceHeight);

    const exportBodyFont = `13px ${EXPORT_MONO_FONT_FAMILY} `;
    const exportHeaderFont = `600 13px ${EXPORT_MONO_FONT_FAMILY} `;
    const exportTitleFont = `700 16px ${EXPORT_MONO_FONT_FAMILY} `;
    const drawCellText = (text, x, y, w, h, align = "left", color = textColor, font = exportBodyFont) => {
        ctx.save();
        ctx.beginPath();
        ctx.rect(x + 2, y + 1, Math.max(0, w - 4), Math.max(0, h - 2));
        ctx.clip();
        ctx.fillStyle = color;
        ctx.font = font;
        ctx.textBaseline = "middle";
        const padX = 8;
        if (align === "center") {
            ctx.textAlign = "center";
            ctx.fillText(text, x + (w / 2), y + (h / 2));
        } else {
            ctx.textAlign = "left";
            ctx.fillText(text, x + padX, y + (h / 2));
        }
        ctx.restore();
    };

    const isCenterBodyCell = (cell) => {
        if (!cell) return false;
        if (
            cell.classList.contains("timezone-cell") ||
            cell.classList.contains("period-days-cell") ||
            cell.classList.contains("period-time-cell")
        ) {
            return true;
        }
        return !!cell.querySelector(".offset-text");
    };

    let y = 0;
    metrics.forEach((metric, metricIdx) => {
        const titleText = metric.titleText || `${t("default_subgroup_name")} ${metricIdx + 1} `;
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
            const cells = [...row.children]
                .filter((td) => !td.classList.contains("export-exclude") && !td.classList.contains("move-cell"));
            for (let c = 0; c < metric.colWidths.length; c++) {
                const w = metric.colWidths[c];
                const cell = cells[c];
                const text = extractTableCellText(cell);
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
    await waitForDocumentFontsReady();

    ensureMultiRangeState();
    const baseRef = getBaseTimezoneRef();
    const titles = multiRanges.map((range, rangeIdx) => getMultiRangeTitleText(rangeIdx, range, baseRef));
    if (!titles.length) throw new Error("No multi-range title data to render");

    const rootStyle = getComputedStyle(document.documentElement);
    const bodyStyle = getComputedStyle(document.body);
    const pageBg = bodyStyle.backgroundColor || "#0f172a";
    const borderColor = (rootStyle.getPropertyValue("--border") || "rgba(148,163,184,0.25)").trim();
    const accentColor = (rootStyle.getPropertyValue("--accent") || "#38bdf8").trim();
    const titleFont = `700 16px ${EXPORT_MONO_FONT_FAMILY} `;
    const sidePadding = 16;
    const topBottomPadding = 12;
    const rowHeight = 40;
    const rowGap = 8;

    const measureCanvas = document.createElement("canvas");
    const measureCtx = measureCanvas.getContext("2d");
    let maxTextWidth = 0;
    if (measureCtx) {
        measureCtx.font = titleFont;
        titles.forEach((titleText) => {
            maxTextWidth = Math.max(maxTextWidth, Math.ceil(measureCtx.measureText(titleText).width));
        });
    }

    const sourceWidth = Math.max(640, maxTextWidth + (sidePadding * 2));
    const contentHeight = (titles.length * rowHeight) + (Math.max(0, titles.length - 1) * rowGap);
    const sourceHeight = contentHeight + (topBottomPadding * 2);
    const targetWidth = TABLE_IMAGE_EXPORT_WIDTH;
    const renderRatio = targetWidth / sourceWidth;
    const targetHeight = Math.max(1, Math.round(sourceHeight * renderRatio));

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context unavailable");
    ctx.scale(renderRatio, renderRatio);

    ctx.fillStyle = pageBg;
    ctx.fillRect(0, 0, sourceWidth, sourceHeight);

    let y = topBottomPadding;
    titles.forEach((titleText, idx) => {
        const rowBg = idx % 2 === 0 ? "rgba(56, 189, 248, 0.12)" : "rgba(56, 189, 248, 0.08)";
        const resolvedTitle = (titleText || "").trim() || `${t("default_subgroup_name")} ${idx + 1} `;

        ctx.fillStyle = rowBg;
        ctx.fillRect(0, y, sourceWidth, rowHeight);

        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 1;
        ctx.strokeRect(0.5, y + 0.5, Math.max(1, sourceWidth - 1), Math.max(1, rowHeight - 1));

        ctx.fillStyle = accentColor;
        ctx.font = titleFont;
        ctx.textBaseline = "middle";
        ctx.textAlign = "left";
        ctx.fillText(resolvedTitle, sidePadding, y + (rowHeight / 2));

        y += rowHeight + rowGap;
    });

    return canvas.toDataURL("image/png");
}

function getImageExportDeps() {
    return {
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
        saveMultiRangeSingleImage,
        isTimelineVisible: () => {
            const frame = document.getElementById("timeline-frame");
            return frame && frame.style.display !== "none" && frame.childElementCount > 0;
        },
        getTimezoneTableImageFilename,
        getMultiRangeTableImageFilename,
        getMultiRangeTitlesImageFilename,
        getMultiRanges: () => multiRanges,
        isDomExceptionLike,
        setCanUseForeignObjectRenderer: (value) => {
            canUseForeignObjectRenderer = value;
        }
    };
}

async function saveMultiRangeTitlesImage() {
    return GTV_IMAGE_EXPORT.saveMultiRangeTitlesImage(getImageExportDeps());
}


async function saveMultiRangeAllImage() {
    return GTV_IMAGE_EXPORT.saveMultiRangeAllImage(getImageExportDeps());
}

async function saveMultiRangeSingleImage(rangeIdx) {
    return GTV_IMAGE_EXPORT.saveMultiRangeSingleImage(getImageExportDeps(), rangeIdx);
}

async function saveTimezoneTableImage() {
    return GTV_IMAGE_EXPORT.saveTimezoneTableImage(getImageExportDeps());
}


function initCalculators() {
    if (!GTV_CALCULATOR || typeof GTV_CALCULATOR.initCalculators !== "function") {
        console.error("Missing required module API: GTVCalculator.initCalculators");
        return;
    }
    GTV_CALCULATOR.initCalculators({
        t,
        copyText
    });
}

async function copyText(elementId, isInput = false) {
    const el = document.getElementById(elementId);
    if (!el) return;
    let text = (isInput ? el.value : (el.textContent || "")).trim();
    if (!isInput && PERIOD_RESULT_IDS.has(elementId)) {
        const matchedNumber = text.match(/-?\d+(\.\d+)?/);
        text = matchedNumber ? matchedNumber[0] : "";
    }
    if (!text) return;
    try {
        await navigator.clipboard.writeText(text);
        showToast(t("toast_copy_success"), { type: "success" });
    } catch (err) {
        console.error("copyText failed:", err);
        showToast(t("toast_copy_failed"), { type: "error" });
    }
}

function getPersistenceSnapshot() {
    currentMainTab = sanitizeMainTab(currentMainTab);
    syncCurrentMultiStateToActiveSubgroup();
    if (currentMainTab === "live" || currentMainTab === "fixed") {
        activeGroupIdByMainTab[currentMainTab] = activeGroupId;
    }
    normalizeGroupTabState();
    ensureMultiRangeState();
    groups.forEach((group) => ensureGroupMultiSubgroups(group));

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
        timeAdjustDayStepBySlot: [
            getTimeAdjustDayStep(0),
            getTimeAdjustDayStep(1)
        ],
        multiRangeCount: sanitizeMultiRangeCount(multiRangeCount),
        multiRangeTitle: sanitizeMultiRangeTitle(getCurrentMultiSubgroupName()),
        multiRanges: multiRanges.map((range) => ({
            startUtcMs: sanitizeUtcMs(range.startUtcMs, Date.now()),
            endUtcMs: sanitizeUtcMs(range.endUtcMs, Date.now())
        })),
        multiRangeCollapsed: multiRangeCollapsed.map((flag) => !!flag),
        multiRangeStartEditEnabled: multiRangeStartEditEnabled.map((flag) => !!flag),
        multiRangeEndEditEnabled: multiRangeEndEditEnabled.map((flag) => !!flag)
    };
}

function getSettingsExportFileName() {
    return dataTransferService.getSettingsExportFileName();
}

function getGroupExportFileName(groupName = "") {
    return dataTransferService.getGroupExportFileName(groupName);
}

function getSubgroupExportFileName(groupName = "", subgroupName = "") {
    return dataTransferService.getSubgroupExportFileName(groupName, subgroupName);
}

function exportGroupToJSON(groupIdx = activeGroupId) {
    return dataTransferService.exportGroupToJSON(groupIdx);
}

function triggerGroupImportFor(groupIdx = activeGroupId) {
    return dataTransferService.triggerGroupImportFor(groupIdx);
}

async function handleGroupImportFile(event) {
    return dataTransferService.handleGroupImportFile(event);
}

function exportSubgroupToJSON(groupIdx = activeGroupId, subgroupId = "") {
    return dataTransferService.exportSubgroupToJSON(groupIdx, subgroupId);
}

function triggerSubgroupImportFor(groupIdx = activeGroupId, subgroupId = "") {
    return dataTransferService.triggerSubgroupImportFor(groupIdx, subgroupId);
}

async function handleSubgroupImportFile(event) {
    return dataTransferService.handleSubgroupImportFile(event);
}

function exportSettingsToJSON() {
    return dataTransferService.exportSettingsToJSON();
}

async function handleSettingsImportFile(event) {
    return dataTransferService.handleSettingsImportFile(event);
}

async function savePersistence(options = {}) {
    return persistenceService.savePersistence(options);
}

async function resetAllSettings() {
    return persistenceService.resetAllSettings();
}

async function resetExceptGroupsAndTimezones() {
    return persistenceService.resetExceptGroupsAndTimezones();
}

function getDefaultGroups() {
    return persistenceService.getDefaultGroups();
}

function sanitizeTimezoneZone(zone) {
    return groupStateService.sanitizeTimezoneZone(zone);
}

function isValidTimeZone(zoneName) {
    return groupStateService.isValidTimeZone(zoneName);
}

function sanitizeGroup(group, idx, legacyMultiState = null) {
    return groupStateService.sanitizeGroup(group, idx, legacyMultiState);
}

async function loadPersistence() {
    return persistenceService.loadPersistence();
}

// --- End of main.js ---


