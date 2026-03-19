# main.js Refactor Plan

기준일: 2026-03-19  
대상: `main.js` (약 3,427 lines)

## 목표

- 전역 오케스트레이터 역할만 `main.js`에 남기고 기능별 책임을 모듈로 이동.
- `index.html`의 스크립트 순서 의존성을 줄이고, 회귀 범위를 작게 분할.
- 기존 테스트(`tests/main-unit.test.mjs` + 모듈 단위 테스트) 기반으로 안전하게 점진 이관.

## 우선순위

1. 상태 패치/셀렉터 계층 분리  
대상 함수: `getPatched*`, `patchAppState`, `patchPrimaryState`, `setPersistenceState` 계열 (약 `main.js:2122-2275`, `main.js:1390-1440`)  
이관 후보: `js/modules/main-app-state-services.js` 또는 신규 `main-state-selectors.js`

2. 포맷/복사 상태 분리  
대상 함수: `sanitizeCopyFormat*`, `sanitizeTimeParts*`, `formatSnapshotText`, `updateCopyFormatPreview` (약 `main.js:1072-1172`, `main.js:3358-3369`)  
이관 후보: `js/modules/format-controls.js`, `js/modules/snapshot-format.js`

3. 멀티레인지 상태/동작 분리  
대상 함수: `sanitizeMultiRange*`, `setMultiRange*`, `syncLinkedRanges*`, `applyMultiRangeTimeAdjustAction` (약 `main.js:1236-1346`, `main.js:2740`)  
이관 후보: `js/modules/main-multi-range-services.js`, `js/modules/multi-range-*.js`

4. 고정 시간(Fixed Time) UI/계산 분리  
대상 함수: `getFixedTime*`, `renderFixedTime*`, `applyFixedTimeSlotByTimezoneInput`, `add/removeFixedTimeSlot` (약 `main.js:2922-3293`)  
이관 후보: `js/modules/main-fixed-time-services.js`, `js/modules/fixed-time-*.js`

5. 타임라인 렌더링/인터랙션 분리  
대상 함수: `renderTimelineFrame`, `applyTimelineRatioToSlot`, `stopTimelineDrag`, `getTimelineIndicatorLabel` (약 `main.js:2751-2913`)  
이관 후보: `js/modules/timeline-frame.js`, `js/modules/main-clock-orchestrator-services.js`

## 실행 순서

1. 함수군별 이관 단위를 200~400 lines 이하로 제한한다.
2. 각 이관에서 공개 API(`window.GTV...`)를 먼저 만들고 `main.js` 호출부만 교체한다.
3. 단위 테스트를 먼저 추가/수정하고 기존 `main-unit` 회귀를 통과시킨다.
4. 이관 후 죽은 코드(중복 fallback, 레거시 wrapper)를 즉시 제거한다.

## 완료 기준

- `main.js` 2,000 lines 이하.
- `index.html`에서 기능 스크립트 직접 나열 수 감소(현재 86개 기준).
- `npm run ci:gate` 지속 통과.
