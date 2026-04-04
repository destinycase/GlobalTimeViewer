# main.js 리팩토링 가드레일

이 문서는 `main.js` 리팩토링 중 회귀를 방지하기 위한 기준선입니다.

## 1) 부트스트랩 흐름

1. `index.html`은 `js/source-script-loader.js` 하나만 직접 로드하고, 해당 로더가 `script_list.tmp` 기준 순서로 defer 스크립트들을 주입합니다.
2. `main.js`는 `DOMContentLoaded`에서 `initApp`을 실행합니다.
3. `initApp`은 필수 서비스 검증, `mainUiInitService.initUI()`, 초기 렌더링, 시계 업데이트를 수행합니다.

## 2) 빌드/패키징 제약

1. 현재 런타임은 전역 IIFE + 다중 `<script src>` 구조입니다.
2. 빌드 경로는 `script_list.tmp`와 `js/source-script-loader.js`가 일치하는지 검증한 뒤 `js/bundle.js`를 만듭니다.
3. 따라서 즉시 ESM(`type="module"`)로 전환하는 작업은 별도 마이그레이션으로 분리합니다.

## 3) 호환성 유지 대상 전역 API

아래 API는 테스트 및 내부 모듈 의존성 때문에 계속 유지합니다.

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

1. 삭제보다 위임을 우선합니다.
2. 도메인 로직은 모듈로 이동하되, `main.js`는 얇은 파사드/부트스트랩 역할로 유지합니다.
3. 상태 접근은 `mainAppStateBridge`와 `mainPatchedStateSelectors`를 우선 경유합니다.
4. 각 단계마다 테스트를 실행하고, 마지막에는 `npm run ci:gate`를 통과해야 합니다.
