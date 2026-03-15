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
