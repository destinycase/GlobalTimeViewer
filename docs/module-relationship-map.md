# Global Time Viewer 모듈 관계도

> 기준: v3.15.1 소스 트리(4차 안정 버전). `src/runtime-script-list.txt`, `src/main.js`, `src/js/modules/main-module-spec.js` 및 각 서비스의 `createService(deps)` 배선을 기준으로 정리했습니다. 아래 경로는 특별한 표시가 없으면 `src/` 기준입니다. 파일 수는 소스 트리에서 계산한 값이며, 관계도는 모든 개별 의존성을 나열한 그래프가 아니라 런타임 레이어와 주요 연결을 보여줍니다.

모듈 파일별 전역 API, 입력 의존성 키, 반환 서비스 API, 모듈 등록 경로 및 `main.js` 조립 호출 목록은 [상세 인벤토리](module-dependency-inventory.md)를 참고하세요. 이 인벤토리는 [generate-module-dependency-inventory.mjs](../scripts/generate-module-dependency-inventory.mjs)로 현재 소스에서 다시 생성할 수 있습니다.

기능 변경 위치와 `main.js` 조립 단계를 빠르게 찾으려면 [코드 구조 탐색 안내](code-navigation.md)를 참고하세요.

## 런타임 진입 및 로딩

```mermaid
flowchart TD
    HTML["index.html\nUI 골격 · style.css · 소스 로더"] --> LOADER["js/source-script-loader.js\nruntime-script-list 순서로 스크립트 삽입"]
    LIST["runtime-script-list.txt\n런타임 스크립트 순서"] --> LOADER
    LOADER --> I18N["i18n.js\n번역 API"]
    LOADER --> VENDOR["js/vendor\nLuxon + 전역 브리지"]
    LOADER --> MODULES["js/modules/*\n전역 GTV 모듈 API"]
    LOADER --> MAIN["main.js\n서비스 조립 · 전역 호환 API"]
    I18N --> MAIN
    VENDOR --> MAIN
    MODULES --> MAIN
    MAIN --> APPBOOT["GTVMainAppBootstrap"]
    APPBOOT --> INIT["저장 상태/설정 로드\nUI · 검색 · 계산기 초기화"]
    INIT --> CLOCK["실시간 ticker · 탭 · 시계 갱신"]
```

`index.html`은 생성된 소스 로더 하나를 포함합니다. 로더는 `runtime-script-list.txt`의 런타임 스크립트를 `async = false`로 삽입해 선언 순서 실행을 요청합니다. `main.js`가 목록 끝에 있어 모듈 전역 API가 준비된 뒤 서비스 조립을 시작합니다. 확장 빌드는 같은 순서 목록을 하나의 축약 번들로 결합하고 Vite 산출물 및 확장 파일을 만듭니다.

## `main.js` 조립 계층

모듈은 ES `import`로 연결되지 않습니다. 각 파일이 `window`/`globalThis`에 `GTV...` API를 등록하고, `main.js`가 `main-module-spec.js`의 명세와 `main-module-resolver.js`를 통해 모듈을 확인한 뒤 `createService(deps)`에 의존성을 전달합니다.

```mermaid
flowchart LR
    SPEC["main-module-spec\n전역 이름 · 필수 API · 선택 모듈"] --> RESOLVE["main-module-resolver\nAPI 존재/형태 검사"]
    RESOLVE --> MAIN["main.js\n의존성 조립 · 전역 API 호환 셸"]
    STATE["상태/호스트 준비\nstate vars · host · primary state"] --> CORE["핵심 서비스 조립\ncore assembly · foundation · helpers"]
    MAIN --> SPEC
    MAIN --> STATE
    STATE --> CORE
    CORE --> DOMAIN["도메인 서비스\ntimezone · fixed time · multi-range\n시간 조정 · 그룹 · persistence"]
    DOMAIN --> UI["UI/렌더 서비스\ntable · timeline · tabs · image export"]
    CORE --> COMPOSE["composition bootstrap\n도메인 설정/서비스 조립"]
    DOMAIN --> COMPOSE
    UI --> COMPOSE
    COMPOSE --> WIRE["runtime bootstrap wiring"]
    WIRE --> PUBLIC["runtime public API bindings"]
    PUBLIC --> APP["main-app-bootstrap\n초기화 순서 실행"]
```

주요 조립 진입점은 다음과 같습니다.

| 단계 | 모듈 | 역할 |
| --- | --- | --- |
| 명세와 검사 | `main-module-spec.js`, `main-module-resolver.js`(`main.js`가 직접 호출) | 전역 API 이름, 필수 `createService`, 선택 모듈 및 데이터 형식 검증 |
| 전역 이름 연결 | `main-global-bindings.js` | `main.js`가 쓰는 모듈 전역 이름 목록(`BINDING_MAP`) |
| 기본 상태/호스트 | `main-state-initializer.js`, `main-runtime-host-utils.js`, `main-runtime-primary-state.js`, `main-runtime-local-state-helpers.js` | 브라우저 API와 앱 기본 상태를 서비스로 제공. state-core bootstrap이 만들고 함수를 그대로 내보냄 |
| 핵심/상태 조립 | `main-runtime-state-core-bootstrap.js`, `main-runtime-core-assembly-bootstrap.js`, `main-runtime-core-foundation-bootstrap.js`, `main-runtime-state-helper-bootstrap.js`, `main-runtime-core-service-bootstrap.js` | 상태 접근, 공통 서비스, 핵심 의존성 조립. state-helper bootstrap은 `main-runtime-state-helpers` 서비스의 함수 20개를 그대로 내보냄 |
| 늦게 정해지는 참조 | `main-runtime-reference-accessors.js` | 조립 중 나중에 만들어지는 서비스·상태를 읽는 함수 80개(대부분 표 하나로 정의) |
| UI/도메인 서비스 조립 | `main-runtime-table-image-bootstrap.js`, `main-runtime-domain-service-bootstrap.js`, `main-runtime-ui-services-bootstrap.js`, `main-runtime-persistence-composition-bootstrap.js`, `main-runtime-composition-bootstrap.js` | 표/이미지, 도메인, 저장, 화면 관련 서비스를 구성 |
| 외부 연결 | `main-runtime-bootstrap-wiring.js`, `main-runtime-public-api-bindings.js`, `main-app-bootstrap.js` | UI·작업·부트스트랩 호출 연결, 앱 시작 순서 실행 |

`main.js`는 아직 이 조립 단계들을 직접 호출하고, 상태 변수를 클로저로 보유하며, 다수의 호환 전역 함수를 공개합니다. 따라서 현재의 주요 변경 위험 지점은 순수 기능 모듈보다는 이 파일의 배선과 전역 호환 경계입니다.

조립에서 반복되는 일은 공용 도우미가 맡습니다.

| 하는 일 | 위치 |
| --- | --- |
| 모듈 API 확인 후 서비스 생성, 필수 메서드 검사 | `GTVServiceInvokeUtils.createRequiredModuleService` |
| 나중에 만들어지는 서비스를 호출할 때 찾아 부르기 | `GTVServiceInvokeUtils.createLateBoundForwarders`(host 접근 함수, patched state 접근 함수, direct state patch) |
| state-domain 함수·표시 형식 함수를 전역 객체에 올리기 | `main.js`의 `exposeOnGlobalHost` |
| 앞쪽 조립 코드에 미리 넘기는 공개 호환 함수 | `main.js` 끝의 `Public compatibility facade`(인수 기본값은 `main-runtime-public-api-bindings`가 적용) |

남은 accessor proxy 4개(`main-runtime-bootstrap-accessor-proxies`, `-core-`, `-operation-`, `-ui-bridge-`)는 단순 전달이 아니라 인수 정리, 기본값, 없는 기능 알림 같은 동작을 가집니다.

## 기능별 도메인 모듈

화살표는 대표적인 서비스 데이터 흐름입니다. 실제 구체 의존성은 `main.js`의 설정 객체와 각 조립 모듈을 통해 전달됩니다.

```mermaid
flowchart LR
    TIME["시간 계산\ntime-core · time-service\ntime-input-mutations · timer-engine"] --> TZ["시간대/그룹\ntimezone-data · timezone-search\ngroup-state · group-context-state · group-tabs"]
    TIME --> FIXED["고정 시간\nfixed-time-core/state/actions/table/timeline"]
    TIME --> MULTI["연속 시간\nmulti-state · multi-range-state/render/copy"]
    TZ --> TABLE["표/UI 렌더\ntable-render · tab-ui · tab-orchestrator"]
    FIXED --> TABLE
    MULTI --> TABLE
    TABLE --> COPY["복사/이미지/내보내기\ncopy-actions · image-export* · data-transfer"]
    STATE["앱/환경설정 상태\napp-state-patcher · ui-preferences-state\nformat-profile-state"] --> PERSIST["저장/설정 이전\nstate-persistence · settings-io\napp-persistence-state"]
    PERSIST --> STATE
    SCHEMA["저장 데이터 스키마\npersistence-state-normalizer"] --> PERSIST
    CALCSTATE["카운트다운 상태 서비스\ncalculator-countdown-state"] --> CALCTOOLS["계산기 도구\ncalculator-countdown · calculator-format-converter\ncalculator-date-format"]
    CALCTOOLS --> CALCUI["계산기 UI 조립\ncalculator · calculator-actions"]
    CALCUI --> DATEPICKER["date-picker"]
    CALCUI --> TIME
    UI["초기화/알림/설정·도움말 팝업\nmain-ui-init · app-feedback · ui-settings-actions"] --> TABLE
```

| 책임 | 관련 모듈 |
| --- | --- |
| 시간과 시간대 | `time-core.js`, `time-service.js`, `time-input-mutations.js`, `timezone-data.js`, `timezone-search.js`, `timer-engine.js` |
| 그룹 및 앱 상태 | `group-state.js`, `group-context-state.js`, `group-tabs.js`, `app-state-patcher.js`, `app-persistence-state.js`, `ui-preferences-state.js`, `format-profile-state.js` |
| 고정 시간 및 타임라인 | `fixed-time-core.js`, `fixed-time-slot-utils.js`, `fixed-time-state.js`, `fixed-time-actions.js`, `fixed-time-table.js`, `fixed-time-timeline.js`, `timeline-frame.js` |
| 연속 시간 변경 | `multi-state.js`, `multi-range-state.js`, `multi-range-render.js`, `multi-range-copy.js`, `multi-range-image-render.js`, `multi-bulk-tools.js` |
| 렌더·복사·이미지 | `table-render.js`, `table-image-render.js`, `copy-actions.js`, `image-export.js`, `image-export-actions.js`, `image-export-bridge.js`, `image-export-naming.js`, `image-clone.js`, `image-foreign-render.js` |
| 계산기·사용자 작업 | `calculator-countdown-state.js`(상태 정규화/표시), `calculator-date-format.js`(날짜 파싱·형식), `calculator-countdown.js`(카운트다운), `calculator-format-converter.js`(시간 포맷 변환기), `calculator.js`(단위 변환·기간/날짜 이동·기능 조립), `calculator-actions.js`, `date-picker.js`, `time-adjust-ui.js`, `time-adjust-actions.js`, `format-controls.js`, `ui-settings-actions.js` |
| 저장·설정 이동 | `persistence-state-normalizer.js`(저장 payload 정규화), `state-persistence.js`(`localStorage` 읽기·쓰기·로드·초기화), `persistence-service-bundle.js`, `settings-io.js`, `data-transfer.js` |

## 모듈 경계와 변경 시 확인 사항

- `js/modules/`에는 기능 모듈(약 58개)과 `main-*` 조립 모듈(86개)이 함께 있습니다. `main-*`에는 bootstrap, config builder, facade, 서비스 묶음, 남은 accessor proxy와 `*-bindings`가 있습니다. 이름이 비슷해도 기본값·대체 처리·여러 서비스 조합 같은 동작을 가진 경우가 있으므로, 내용과 테스트를 확인하기 전에는 중복 모듈로 간주하지 않습니다.
- 공통 도메인 서비스는 대체로 `createService(deps)` 형태이고, 의존성을 명시적으로 전달합니다. 반면 `main.js`는 레거시 호환과 전역 상태 연결을 담당하므로 새 도메인 로직을 이 파일에 추가하기보다 기능 모듈에 두고 조립부에서 연결하는 것이 현재 패턴에 맞습니다.
- 새 런타임 모듈을 추가하거나 제거할 때는 `src/runtime-script-list.txt`를 갱신한 뒤 `npm run sync:source-loader`를 실행합니다. 이 명령과 빌드는 목록 중복·경로·파일 누락·전체 런타임 파일 포함 여부를 검사합니다.
- 변경 확인은 영향 모듈 테스트, `npm run lint`, `npm run test:coverage`, 배포 전 `npm run package`(엄격 빌드, 배포 ZIP 생성, 배포물 검사) 순으로 수행합니다. 빠른 전체 확인은 `npm run ci:gate`입니다.

## 관계도의 한계

이 관계도는 현재 소스의 로더 순서와 조립 계층을 요약합니다. 모듈 간 모든 개별 메서드 호출이나 상태 읽기/쓰기 엣지를 자동 추출한 그래프는 아닙니다. 특히 `main.js`가 의존성 객체를 조립하므로 세부 관계를 변경할 때는 해당 `createService` 호출부와 모듈 테스트를 함께 추적해야 합니다.
