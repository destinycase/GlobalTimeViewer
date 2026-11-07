(function initGtvTimezoneData(globalObj) {
    "use strict";

    // 아시아 (Asia) — 기존 11개 + 확장
    // 유럽 (Europe) — 기존 5개 + 확장
    // 아메리카 (America) — 기존 5개 + 확장
    // 오세아니아/태평양 (Oceania/Pacific) — 기존 3개 + 확장
    // 아프리카/중동 (Africa/Middle East) — 신규 추가
    const TZ_DATABASE = Object.freeze([
        // ── 아시아 ───────────────────────────────────────────
        { zone: "Asia/Seoul",           name: "대한민국",   city: "서울",       name_en: "South Korea",  city_en: "Seoul" },
        { zone: "Asia/Tokyo",           name: "일본",       city: "도쿄",       name_en: "Japan",        city_en: "Tokyo" },
        { zone: "Asia/Shanghai",        name: "중국",       city: "상하이",     name_en: "China",        city_en: "Shanghai" },
        { zone: "Asia/Hong_Kong",       name: "홍콩",       city: "홍콩",       name_en: "Hong Kong",    city_en: "Hong Kong" },
        { zone: "Asia/Singapore",       name: "싱가포르",   city: "싱가포르",   name_en: "Singapore",    city_en: "Singapore" },
        { zone: "Asia/Taipei",          name: "대만",       city: "타이베이",   name_en: "Taiwan",       city_en: "Taipei" },
        { zone: "Asia/Bangkok",         name: "태국",       city: "방콕",       name_en: "Thailand",     city_en: "Bangkok" },
        { zone: "Asia/Ho_Chi_Minh",     name: "베트남",     city: "호치민",     name_en: "Vietnam",      city_en: "Ho Chi Minh" },
        { zone: "Asia/Jakarta",         name: "인도네시아", city: "자카르타",   name_en: "Indonesia",    city_en: "Jakarta" },
        { zone: "Asia/Dubai",           name: "아랍에미리트", city: "두바이",   name_en: "UAE",          city_en: "Dubai" },
        { zone: "Asia/Kolkata",         name: "인도",       city: "뉴델리",     name_en: "India",        city_en: "New Delhi" },
        // 아시아 확장
        { zone: "Asia/Kuala_Lumpur",    name: "말레이시아", city: "쿠알라룸푸르", name_en: "Malaysia",   city_en: "Kuala Lumpur" },
        { zone: "Asia/Manila",          name: "필리핀",     city: "마닐라",     name_en: "Philippines",  city_en: "Manila" },
        { zone: "Asia/Dhaka",           name: "방글라데시", city: "다카",       name_en: "Bangladesh",   city_en: "Dhaka" },
        { zone: "Asia/Karachi",         name: "파키스탄",   city: "카라치",     name_en: "Pakistan",     city_en: "Karachi" },
        { zone: "Asia/Riyadh",          name: "사우디아라비아", city: "리야드", name_en: "Saudi Arabia", city_en: "Riyadh" },
        { zone: "Asia/Tehran",          name: "이란",       city: "테헤란",     name_en: "Iran",         city_en: "Tehran" },
        { zone: "Asia/Baghdad",         name: "이라크",     city: "바그다드",   name_en: "Iraq",         city_en: "Baghdad" },
        { zone: "Asia/Kathmandu",       name: "네팔",       city: "카트만두",   name_en: "Nepal",        city_en: "Kathmandu" },
        { zone: "Asia/Colombo",         name: "스리랑카",   city: "콜롬보",     name_en: "Sri Lanka",    city_en: "Colombo" },
        { zone: "Asia/Tashkent",        name: "우즈베키스탄", city: "타슈켄트", name_en: "Uzbekistan",   city_en: "Tashkent" },
        { zone: "Asia/Almaty",          name: "카자흐스탄", city: "알마티",     name_en: "Kazakhstan",   city_en: "Almaty" },
        { zone: "Asia/Yangon",          name: "미얀마",     city: "양곤",       name_en: "Myanmar",      city_en: "Yangon" },
        { zone: "Asia/Phnom_Penh",      name: "캄보디아",   city: "프놈펜",     name_en: "Cambodia",     city_en: "Phnom Penh" },
        { zone: "Asia/Ulaanbaatar",     name: "몽골",       city: "울란바토르", name_en: "Mongolia",     city_en: "Ulaanbaatar" },

        // ── 유럽 ─────────────────────────────────────────────
        { zone: "Europe/London",        name: "영국",       city: "런던",       name_en: "UK",           city_en: "London" },
        { zone: "Europe/Paris",         name: "프랑스",     city: "파리",       name_en: "France",       city_en: "Paris" },
        { zone: "Europe/Berlin",        name: "독일",       city: "베를린",     name_en: "Germany",      city_en: "Berlin" },
        { zone: "Europe/Moscow",        name: "러시아",     city: "모스크바",   name_en: "Russia",       city_en: "Moscow" },
        { zone: "Europe/Istanbul",      name: "튀르키예",   city: "이스탄불",   name_en: "Turkey",       city_en: "Istanbul" },
        // 유럽 확장
        { zone: "Europe/Rome",          name: "이탈리아",   city: "로마",       name_en: "Italy",        city_en: "Rome" },
        { zone: "Europe/Madrid",        name: "스페인",     city: "마드리드",   name_en: "Spain",        city_en: "Madrid" },
        { zone: "Europe/Amsterdam",     name: "네덜란드",   city: "암스테르담", name_en: "Netherlands",  city_en: "Amsterdam" },
        { zone: "Europe/Warsaw",        name: "폴란드",     city: "바르샤바",   name_en: "Poland",       city_en: "Warsaw" },
        { zone: "Europe/Zurich",        name: "스위스",     city: "취리히",     name_en: "Switzerland",  city_en: "Zurich" },
        { zone: "Europe/Stockholm",     name: "스웨덴",     city: "스톡홀름",   name_en: "Sweden",       city_en: "Stockholm" },
        { zone: "Europe/Athens",        name: "그리스",     city: "아테네",     name_en: "Greece",       city_en: "Athens" },
        { zone: "Europe/Helsinki",      name: "핀란드",     city: "헬싱키",     name_en: "Finland",      city_en: "Helsinki" },
        { zone: "Europe/Bucharest",     name: "루마니아",   city: "부쿠레슈티", name_en: "Romania",      city_en: "Bucharest" },
        { zone: "Europe/Kiev",          name: "우크라이나", city: "키이우",     name_en: "Ukraine",      city_en: "Kyiv" },

        // ── 아메리카 ──────────────────────────────────────────
        { zone: "America/New_York",     name: "미국",       city: "뉴욕",       name_en: "USA",          city_en: "New York" },
        { zone: "America/Chicago",      name: "미국",       city: "시카고",     name_en: "USA",          city_en: "Chicago" },
        { zone: "America/Los_Angeles",  name: "미국",       city: "로스앤젤레스", name_en: "USA",        city_en: "Los Angeles" },
        { zone: "America/Mexico_City",  name: "멕시코",     city: "멕시코시티", name_en: "Mexico",       city_en: "Mexico City" },
        { zone: "America/Sao_Paulo",    name: "브라질",     city: "상파울루",   name_en: "Brazil",       city_en: "Sao Paulo" },
        // 아메리카 확장
        { zone: "America/Toronto",      name: "캐나다",     city: "토론토",     name_en: "Canada",       city_en: "Toronto" },
        { zone: "America/Vancouver",    name: "캐나다",     city: "밴쿠버",     name_en: "Canada",       city_en: "Vancouver" },
        { zone: "America/Denver",       name: "미국",       city: "덴버",       name_en: "USA",          city_en: "Denver" },
        { zone: "America/Phoenix",      name: "미국",       city: "피닉스",     name_en: "USA",          city_en: "Phoenix" },
        { zone: "America/Anchorage",    name: "미국",       city: "앵커리지",   name_en: "USA",          city_en: "Anchorage" },
        { zone: "America/Buenos_Aires", name: "아르헨티나", city: "부에노스아이레스", name_en: "Argentina", city_en: "Buenos Aires" },
        { zone: "America/Santiago",     name: "칠레",       city: "산티아고",   name_en: "Chile",        city_en: "Santiago" },
        { zone: "America/Lima",         name: "페루",       city: "리마",       name_en: "Peru",         city_en: "Lima" },
        { zone: "America/Bogota",       name: "콜롬비아",   city: "보고타",     name_en: "Colombia",     city_en: "Bogota" },
        { zone: "America/Caracas",      name: "베네수엘라", city: "카라카스",   name_en: "Venezuela",    city_en: "Caracas" },
        { zone: "America/Havana",       name: "쿠바",       city: "아바나",     name_en: "Cuba",         city_en: "Havana" },

        // ── 오세아니아/태평양 ──────────────────────────────────
        { zone: "Australia/Sydney",     name: "호주",       city: "시드니",     name_en: "Australia",    city_en: "Sydney" },
        { zone: "Australia/Perth",      name: "호주",       city: "퍼스",       name_en: "Australia",    city_en: "Perth" },
        { zone: "Pacific/Auckland",     name: "뉴질랜드",   city: "오클랜드",   name_en: "New Zealand",  city_en: "Auckland" },
        // 오세아니아 확장
        { zone: "Australia/Brisbane",   name: "호주",       city: "브리즈번",   name_en: "Australia",    city_en: "Brisbane" },
        { zone: "Australia/Adelaide",   name: "호주",       city: "애들레이드", name_en: "Australia",    city_en: "Adelaide" },
        { zone: "Pacific/Honolulu",     name: "미국(하와이)", city: "호놀룰루", name_en: "USA (Hawaii)", city_en: "Honolulu" },
        { zone: "Pacific/Fiji",         name: "피지",       city: "수바",       name_en: "Fiji",         city_en: "Suva" },

        // ── 아프리카 (신규) ───────────────────────────────────
        { zone: "Africa/Cairo",         name: "이집트",     city: "카이로",     name_en: "Egypt",        city_en: "Cairo" },
        { zone: "Africa/Johannesburg",  name: "남아프리카공화국", city: "요하네스버그", name_en: "South Africa", city_en: "Johannesburg" },
        { zone: "Africa/Lagos",         name: "나이지리아", city: "라고스",     name_en: "Nigeria",      city_en: "Lagos" },
        { zone: "Africa/Nairobi",       name: "케냐",       city: "나이로비",   name_en: "Kenya",        city_en: "Nairobi" },
        { zone: "Africa/Casablanca",    name: "모로코",     city: "카사블랑카", name_en: "Morocco",      city_en: "Casablanca" },
        { zone: "Africa/Accra",         name: "가나",       city: "아크라",     name_en: "Ghana",        city_en: "Accra" },
        { zone: "Africa/Addis_Ababa",   name: "에티오피아", city: "아디스아바바", name_en: "Ethiopia",   city_en: "Addis Ababa" }
    ]);

    const ZONE_MAP = Object.freeze({
        // ── 아시아 ───────────────────────────────────────────
        "Asia/Seoul":           "KST",
        "Asia/Tokyo":           "JST",
        "Asia/Shanghai":        "CST",
        "Asia/Hong_Kong":       "HKT",
        "Asia/Singapore":       "SGT",
        "Asia/Taipei":          "CST",
        "Asia/Bangkok":         "ICT",
        "Asia/Ho_Chi_Minh":     "ICT",
        "Asia/Jakarta":         "WIB",
        "Asia/Dubai":           "GST",
        "Asia/Kolkata":         "IST",
        "Asia/Kuala_Lumpur":    "MYT",
        "Asia/Manila":          "PHT",
        "Asia/Dhaka":           "BST",
        "Asia/Karachi":         "PKT",
        "Asia/Riyadh":          "AST",
        "Asia/Tehran":          ["IRST", "IRDT"],
        "Asia/Baghdad":         "AST",
        "Asia/Kathmandu":       "NPT",
        "Asia/Colombo":         "IST",
        "Asia/Tashkent":        "UZT",
        "Asia/Almaty":          "ALMT",
        "Asia/Yangon":          "MMT",
        "Asia/Phnom_Penh":      "ICT",
        "Asia/Ulaanbaatar":     "ULAT",

        // ── 유럽 ─────────────────────────────────────────────
        "Europe/London":        ["GMT", "BST"],
        "Europe/Paris":         ["CET", "CEST"],
        "Europe/Berlin":        ["CET", "CEST"],
        "Europe/Moscow":        "MSK",
        "Europe/Istanbul":      "TRT",
        "Europe/Rome":          ["CET", "CEST"],
        "Europe/Madrid":        ["CET", "CEST"],
        "Europe/Amsterdam":     ["CET", "CEST"],
        "Europe/Warsaw":        ["CET", "CEST"],
        "Europe/Zurich":        ["CET", "CEST"],
        "Europe/Stockholm":     ["CET", "CEST"],
        "Europe/Athens":        ["EET", "EEST"],
        "Europe/Helsinki":      ["EET", "EEST"],
        "Europe/Bucharest":     ["EET", "EEST"],
        "Europe/Kiev":          ["EET", "EEST"],

        // ── 아메리카 ──────────────────────────────────────────
        "America/New_York":     ["EST", "EDT"],
        "America/Chicago":      ["CST", "CDT"],
        "America/Los_Angeles":  ["PST", "PDT"],
        "America/Mexico_City":  ["CST", "CDT"],
        "America/Sao_Paulo":    "BRT",
        "America/Toronto":      ["EST", "EDT"],
        "America/Vancouver":    ["PST", "PDT"],
        "America/Denver":       ["MST", "MDT"],
        "America/Phoenix":      "MST",
        "America/Anchorage":    ["AKST", "AKDT"],
        "America/Buenos_Aires": "ART",
        "America/Santiago":     ["CLT", "CLST"],
        "America/Lima":         "PET",
        "America/Bogota":       "COT",
        "America/Caracas":      "VET",
        "America/Havana":       ["CST", "CDT"],

        // ── 오세아니아/태평양 ──────────────────────────────────
        "Australia/Sydney":     ["AEST", "AEDT"],
        "Australia/Perth":      "AWST",
        "Australia/Brisbane":   "AEST",
        "Australia/Adelaide":   ["ACST", "ACDT"],
        "Pacific/Auckland":     ["NZST", "NZDT"],
        "Pacific/Honolulu":     "HST",
        "Pacific/Fiji":         ["FJT", "FJST"],

        // ── 아프리카 ──────────────────────────────────────────
        "Africa/Cairo":         ["EET", "EEST"],
        "Africa/Johannesburg":  "SAST",
        "Africa/Lagos":         "WAT",
        "Africa/Nairobi":       "EAT",
        "Africa/Casablanca":    ["WET", "WEST"],
        "Africa/Accra":         "GMT",
        "Africa/Addis_Ababa":   "EAT",

        "UTC": "UTC"
    });

    const TIMEZONE_DATA_API = Object.freeze({
        TZ_DATABASE,
        ZONE_MAP
    });

    function createService(_deps = {}) {
        return TIMEZONE_DATA_API;
    }

    globalObj.GTVTimezoneData = Object.freeze({
        createService,
        ...TIMEZONE_DATA_API
    });
})(typeof window !== "undefined" ? window : globalThis);
