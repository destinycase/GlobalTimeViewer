# Global Time Viewer 개발자 가이드

이 문서는 현재 소스 트리의 구조와 실행 계약을 설명합니다. 프로그램은 단순한 정적 HTML 페이지가 아닙니다. 일반적인 ES 모듈 import 대신 전역 GTV... API와 순서가 지정된 스크립트 로더를 사용하는 브라우저 확장이므로, 파일 분리나 로드 순서를 바꾸기 전에 관련 경계를 먼저 이해해야 합니다.

**기준 소스 버전:** 3.12.9. 모듈별 실제 API와 전역 의존성은 [생성 인벤토리](module-dependency-inventory.md), 전체 연결은 [모듈 관계도](module-relationship-map.md), 기능별 탐색은 [코드 탐색 안내](code-navigation.md)를 함께 참고하세요.

## 1. 프로젝트 구성

| 경로/파일 | 역할 |
| --- | --- |
| index.html | 애플리케이션의 DOM 골격, 메뉴/입력/표 컨테이너, 로딩·치명 오류 화면, 생성 스크립트 로더 참조를 정의합니다. |
| style.css | 화면 레이아웃, 컴포넌트 상태, 테마 및 UI 크기 표현을 담당합니다. |
| i18n.js | 전역 번역 사전/API를 제공합니다. 화면 문자열을 추가할 때 한국어와 영어 키를 함께 관리합니다. |
| main.js | 런타임 조립 지점입니다. 주요 상태와 호스트 API를 준비하고 여러 main-*-bootstrap 조립 서비스를 호출하며 공개 전역 호환 API를 연결합니다. 순수 계산 모듈로 취급하지 마세요. |
| main-module-spec.js / main-module-resolver.js | 모듈 전역 API의 필수/선택 계약을 선언하고 실제 로드된 API를 검증·해결합니다. |
| main-app-bootstrap.js | 조립된 애플리케이션의 시작 순서를 제어합니다. 저장 데이터 로드, 지역명/번역 및 설정 적용, UI 초기화, 표 갱신과 타이머 시작 등을 연결합니다. |
| js/modules/ | 시간 계산, 상태, 지속성, 렌더링, 상호작용 등 기능 모듈과 main-*-bindings/composition/bootstrap 계층을 포함합니다. 파일명이 비슷해도 API 연결과 fallback이 다를 수 있으므로 구현을 확인하세요. |
| js/source-script-loader.js | script_list.tmp를 바탕으로 생성되는 순차 로더입니다. 직접 편집하지 않습니다. |
| script_list.tmp | 브라우저 런타임 스크립트 로드 순서의 원본 목록입니다. 앞선 스크립트 전역 API가 뒤의 스크립트에서 사용될 수 있습니다. |
| js/vendor/ | Luxon 등 브라우저에서 사용하는 외부 라이브러리입니다. |
| tests/ | Vitest 모듈 단위 및 통합 성격 테스트입니다. |
| scripts/ | 로더/모듈 인벤토리 생성, 빌드 등 개발 자동화 스크립트입니다. |
| dist/, dist_extension/, js/bundle.js, ZIP | 빌드 과정에서 생성되는 산출물입니다. 생성 결과를 직접 수정하지 않습니다. |

## 2. 런타임 흐름과 로드 순서

1. index.html은 DOM과 스타일을 준비하고 js/source-script-loader.js를 불러옵니다.
2. 생성 로더는 script_list.tmp에 선언된 순서대로 스크립트를 삽입합니다. 비동기 병렬 로드가 아니라 전역 등록 순서가 의미 있는 로드입니다.
3. 설정, 번역, vendor, 모듈 API가 등록됩니다. 각 모듈은 보통 window.GTV... 또는 호스트 전역 객체에 API를 등록합니다.
4. main.js가 main-module-spec 및 resolver를 사용해 요구 모듈 API가 준비되었는지 확인하고 상태/의존성을 조립합니다.
5. 도메인, UI, 지속성 서비스의 createService(deps) 경계를 통해 필요한 의존성을 전달하고 공개 API를 연결합니다.
6. GTVMainAppBootstrap이 초기화 순서를 진행하고 성공 후 상호작용/시계 갱신을 시작합니다. 필수 초기화 실패 시 사용자용 오류 화면이 표시됩니다.

따라서 런타임 파일을 추가/이동하거나 스크립트 순서를 바꾸는 변경은 아래를 한 묶음으로 다룹니다.

1. 적절한 도메인 소유 모듈에 구현하고 필요한 전역 API 계약을 정합니다.
2. js/modules/main-module-spec.js의 계약 선언 및 이에 해당하는 조립 지점을 확인합니다.
3. script_list.tmp에서 의존 관계에 맞는 위치에 등록합니다.
4. npm run sync:source-loader로 생성 로더를 갱신합니다. 생성 파일을 수동으로 고치지 않습니다.
5. 로더 체크, 해당 모듈 테스트, 동작 회귀 검사 및 빌드를 실행합니다.

## 3. 아키텍처와 책임 경계

### 모듈 API와 의존성 전달

대부분의 런타임 모듈은 IIFE 내부에서 createService(deps = {}) 형태의 서비스를 만들고, 전역에 모듈 API를 등록합니다. 인스턴스별 deps 전달이 테스트 대역과 실행 환경 차이를 수용하는 경계입니다. 새 기능의 구현은 책임을 가진 도메인 모듈에 두고, 조립 파일에는 의존성 전달과 API wiring만 둡니다.

일반적으로 모듈 API는 불변 객체로 공개됩니다. 기존 API 반환 형식과 전역 이름을 바꾸면 resolver, 조립 서비스, 테스트와 호환 호출자가 동시에 영향을 받을 수 있습니다. 공개 API 변경은 단일 파일 리팩터링처럼 취급하지 말고 모든 소비자와 테스트를 추적하세요.

### 조립 계층과 main.js

main.js는 규모가 크더라도 단순히 줄 수를 줄이기 위해 분해하면 안 됩니다. 여러 초기 상태, 호스트/브라우저 접근, 공개 전역 호환 함수 및 조립 순서가 모여 있는 곳입니다. 비슷한 코드라는 이유만으로 상태 소유권이나 호출 순서를 작은 파일들에 복제하면 추적해야 할 연결 지점이 늘어납니다.

기능별 책임은 도메인 모듈에 둡니다. main-runtime-*-bootstrap.js, *-composition.js, *-bindings.js 계열은 이미 존재하는 조립 책임을 따릅니다. 변경 전 [코드 탐색 안내](code-navigation.md)의 main.js 연결 지점과 [관계도](module-relationship-map.md)를 보고, 새 파일이 실제로 응집도나 테스트 경계를 높이는지 확인하세요. 크기만 작은 공용 util 모듈을 추가하지 않습니다.

### 주요 도메인 소유권

| 기능 영역 | 주요 모듈 계열 | 경계에서 확인할 것 |
| --- | --- | --- |
| 시간 계산 및 시간 입력 변경 | time-core, time-service, time-input-mutations, timer-engine | 시간대 변환/날짜 산술과 DOM 이벤트를 섞지 말고 기존 반환 데이터와 날짜 경계 의미를 유지합니다. |
| 시간대 검색/표시 데이터 | timezone-data, timezone-search | 지역 식별자, 검색 결과 및 사용자 지정 고정 오프셋의 의미를 보존합니다. |
| 그룹 및 화면 컨텍스트 | group-state, group-context-state, group-tabs, app-state-patcher | 현재 그룹/보조 그룹과 도메인 데이터 간 단일 소유 흐름을 유지합니다. |
| 실시간 표와 표 이미지 | table-render, table-image-render, image-export-* | 표시 데이터와 이미지용 복제/렌더 경로를 혼동하지 말고 현재 UI 상태를 기준으로 합니다. |
| 고정 시간/타임라인 | fixed-time-core, fixed-time-state, fixed-time-actions, fixed-time-table, fixed-time-timeline | 고정 날짜, 슬롯 상태, 표시 여부가 같이 움직이는 경로를 추적합니다. |
| 다중 연속 시간 범위 | multi-state, multi-range-state, multi-range-render, multi-range-copy, multi-bulk-tools | 그룹/보조 그룹별 범위, 개수, 편집 옵션을 함께 유지합니다. |
| 계산기/날짜 입력 | calculator, calculator-actions, calculator-countdown-state, date-picker, time-adjust-* | 계산 결과 의미를 바꾸지 않고 DOM 입력 검증/피드백과 핵심 연산을 구분합니다. |
| 저장/설정 가져오기 | persistence-state-normalizer, state-persistence, persistence-service-bundle, settings-io, data-transfer | 정규화, 저장소 fallback, 구버전 읽기, 전체/그룹/보조 그룹 payload는 다른 책임입니다. |

이 표는 탐색용 요약입니다. 정확한 파일별 전역 API/입력 계약은 생성 인벤토리를 기준으로 합니다.

## 4. 상태와 저장 데이터

- 핵심 실행 상태는 조립 계층이 소유하고, 각 도메인 서비스에는 필요한 읽기/쓰기 함수가 전달됩니다. 같은 상태의 별도 사본을 UI 모듈에 장기간 보유하면 화면과 저장 데이터가 어긋날 수 있습니다.
- 앱 상태 patching, 그룹 컨텍스트, 사용자 환경설정, 복사/표시 형식은 각각의 소유 모듈 경로를 통해 변경합니다. 이미 있는 updater/normalizer 경로를 우회해 직접 전역을 바꾸지 마세요.
- 저장소 접근은 state-persistence.js를 중심으로 하며 Chrome 확장 환경에서는 chrome.storage.local, 가능한 실행 환경에서는 localStorage fallback 경로를 지원합니다. 접근 경로의 예외/fallback 동작을 유지해야 합니다.
- 현재 핵심 데이터 키는 GTV_v324_Data이고 구버전 키 목록은 app-config.js가 선언합니다. 테마, 언어, UI 배율은 별도 키(GTV_Theme, GTV_Lang, GTV_UIScale)입니다. 실제 저장 구조를 바꾸려면 normalizer, 마이그레이션/legacy fallback, 설정 내보내기/가져오기, 테스트를 함께 검토합니다.
- 설정 가져오기는 외부 JSON 입력이므로 settings-io.js와 data-transfer.js의 검증·정규화·저장 실패 경로를 건너뛰지 않습니다. 개별 그룹/보조 그룹 가져오기를 전체 설정 가져오기와 같은 payload로 가정하지 마세요.

## 5. 안전한 변경 절차

1. **현행 구현을 찾습니다.** 먼저 [코드 탐색 안내](code-navigation.md)를 보고 생성 인벤토리에서 모듈의 API, 입력, 소비자를 확인합니다.
2. **변경 책임을 고릅니다.** 기능 동작은 소유 도메인에, 조립 변경은 기존 composition/bootstrap에, 사용자 안내/표시는 UI 경계에 둡니다. 단지 분리를 위한 새 파일을 만들지 않습니다.
3. **계약을 기록합니다.** 함수 입력/반환, 비동기 여부, 상태 변경 소유자, 전역 API 및 저장 payload가 달라지는지 먼저 확인합니다. 핵심 기능과 데이터 결과를 바꾸는 UX 수정은 별도 동작 변경으로 검토해야 합니다.
4. **최소 범위로 수정합니다.** 직접 관련 소비자만 바꾸고 fallback/오류 흐름을 보존합니다. 사용자 문자열은 i18n.js의 한국어/영어 양쪽에 추가합니다.
5. **검증합니다.** 아래 명령을 실행하고 변경한 도메인의 기존 테스트를 확인합니다. 저장, 날짜 경계, 시간대/서머타임, 가져오기 입력이라면 경계 사례 테스트가 필요합니다.
6. **문서를 갱신합니다.** 공개 동작/개발 흐름/모듈 계약이 바뀌면 이 가이드, 관계도/탐색 문서, 릴리스 기록 중 영향받는 곳을 반영합니다. 스크립트 소유권이 바뀌면 생성 인벤토리도 검사합니다.

### 특히 피할 변경

- 기존 전역 API를 검토 없이 삭제/이름 변경하거나 모든 파일을 ES module로 한 번에 바꾸기
- script_list.tmp와 생성 로더 사이의 불일치 또는 로드 순서 의존성 깨뜨리기
- main.js 상태/호환 경계를 기능별 작은 파일에 중복 분산하기
- 의미 있는 응집 없이 지나치게 작은 모듈 또는 모든 기능을 빨아들이는 공용 util 파일 만들기
- 가져오기 데이터를 정규화기/검증기 우회해서 저장하거나 기존 저장 키 호환성을 제거하기
- UI 문자열을 하드코딩해 두 언어가 서로 달라지게 만들기
- 계산 또는 데이터 출력을 바꾸는 수정인데 화면 문구 변경으로만 취급하기
- 오류를 무시하는 광범위한 catch 또는 정상 오류를 console.log로 숨기기

## 6. 코딩 컨벤션

현재 ESLint 설정(eslint.config.cjs)을 최종 기준으로 합니다.

- JavaScript 코드는 "use strict"를 사용하고 동등 비교는 ===/!==로 작성합니다.
- 정의되지 않은 변수, 중복 선언/키, 도달 불가능 코드, 부동소수점 정밀도 손실, debugger를 허용하지 않습니다.
- console.log는 금지되어 있습니다. 필요한 진단은 목적이 명확한 console.warn 또는 console.error로 남깁니다.
- js/modules/에서는 사용하지 않는 변수 검사가 적용됩니다. 사용하지 않는 의존성/임시 변수를 남기지 말고, 의도적으로 사용하지 않는 매개변수는 기존 명명 규칙을 따릅니다.
- 모듈은 의존성을 인자로 받고 가능한 경우 DOM/브라우저 전역을 직접 참조하지 않아 테스트에서 대체 가능하게 합니다. 다만 기존 소유권 패턴과 충돌하는 신규 추상화를 만들지는 않습니다.
- 사용자 입력/가져오기 입력은 정규화와 검증 경로를 사용합니다. 생성 HTML에 사용자 값을 넣을 때는 기존 escaping 패턴을 따르고, 단순 텍스트는 DOM textContent를 우선합니다.
- 새 화면 문구는 한국어/영어 번역 키를 함께 추가하고 버튼/툴팁은 키 연결(data-i18n, data-i18n-title)을 확인합니다.
- 저장 실패/선택 기능 fallback과 필수 초기화 오류는 서로 다른 상황입니다. 전자는 기존 fallback과 사용자 피드백을 보존하고, 후자는 fatal error 흐름을 숨기지 않습니다.
- UTF-8 인코딩을 유지하고 기존 파일의 개행 형식을 불필요하게 전체 변환하지 않습니다. 포맷 변경 diff가 실제 코드 변경과 섞이지 않도록 주의합니다.

## 7. 테스트, 검사, 빌드

Node.js와 npm을 준비한 뒤 저장소 루트에서 실행합니다.

```sh
npm install
npm run lint
npm test -- --run
npm run test:coverage
npm run docs:module-inventory:check
npm run build:strict
```

- 빠른 작업에서는 변경 모듈의 Vitest 파일부터 실행한 뒤 관련 통합 테스트를 실행합니다. 전체 테스트는 npm test -- --run, 커버리지 포함 실행은 npm run test:coverage입니다.
- npm run docs:module-inventory:check는 체크인된 모듈 인벤토리가 소스와 일치하는지 확인합니다. 재생성은 npm run docs:module-inventory입니다.
- script_list.tmp 수정 후에는 npm run sync:source-loader를 실행합니다.
- npm run build:strict는 버전 일관성을 확인하며 확장 산출물과 ZIP을 생성합니다. CI 전체 관문은 npm run ci:gate(lint, 인벤토리 검사, 커버리지 테스트, strict build)입니다.
- 제품 동작을 바꾸는 변경은 lint만으로 충분하지 않습니다. 영향 모듈 테스트, 저장/시간 경계 시나리오와 빌드까지 확인하세요.

## 8. 버전과 배포

버전을 바꿀 때는 적어도 package.json, package-lock.json, manifest.json, js/modules/app-config.js, README.md, docs/CHANGELOG.md의 버전 참조를 함께 확인합니다. 빌드 스크립트는 확장 파일을 dist_extension/에 모으고 GlobalTimeViewer_extension.zip을 만듭니다. 결과물을 직접 손으로 고치는 대신 원본을 수정하고 다시 빌드합니다. 배포 전 strict build와 관련 검증을 통과했는지 확인합니다.

## 9. 참고 문서

- [모듈 관계도](module-relationship-map.md): 스크립트 시작점, 조립 계층, 기능 도메인의 시각적 관계
- [코드 탐색 안내](code-navigation.md): main.js와 주요 기능의 변경 위치
- [모듈 의존성 인벤토리](module-dependency-inventory.md): 파일별 API/의존성과 스크립트 순서(생성 파일)
- [사용자 가이드](user-guide.md): 프로그램 사용 관점 안내
- [변경 이력](CHANGELOG.md): 버전별 변경 사항과 버전 번호 정정 내역
