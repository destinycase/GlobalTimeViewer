# main.js 리팩토링 가드레일

이 문서는 `main.js` 리팩토링 중 회귀를 방지하기 위한 기준선이다.

## 1) 부트스트랩 흐름

1. `index.html`에서 모듈 스크립트들을 순차 로드한 뒤 마지막에 `main.js`를 로드한다.
2. `main.js`는 `DOMContentLoaded`에서 `initApp`을 실행한다.
3. `initApp`에서 필수 서비스 검증, `mainUiInitService.initUI()`, 초기 렌더링 및 시계 업데이트를 수행한다.

## 2) 빌드/패키징 제약

1. 현재 런타임은 전역 IIFE + 다중 `<script src>` 구조다.
2. `build_extension.ps1`는 `index.html`의 스크립트 태그를 수집해 `js/bundle.js`로 합친다.
3. 따라서 즉시 ESM(`type="module"`) 전환은 별도 마이그레이션 작업으로 분리한다.

## 3) 호환성 유지 대상 전역 API

아래 API는 테스트 및 내부 모듈 의존성상 유지한다.

- `switchMainTab`
- `renderList`
- `addTimezone`
- `removeTimezone`
- `applyTimeAdjustAction`
- `renderFixedTimeTab`
- `renderMultiRanges`
- `copyAllTimezones`
- `getZoneDisplayName`

## 4) 리팩토링 원칙

1. 삭제보다 위임을 우선한다.
2. 도메인 로직은 모듈로 이동하되, `main.js`는 얇은 파사드/부트스트랩으로 유지한다.
3. 상태 접근은 `mainAppStateBridge` + `mainPatchedStateSelectors` 경유를 우선한다.
4. 각 단계마다 테스트를 실행하고, 마지막에 `npm run ci:gate`를 통과해야 한다.
