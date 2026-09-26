# 코드 구조 탐색 안내

개발 환경과 변경 규칙 전반은 [개발자 가이드](developer-guide.md), 프로그램 사용 방법은 [사용자 가이드](user-guide.md)를 참고하세요.

이 문서는 프로젝트를 처음 읽거나 기능을 수정할 때, 구현 위치와 실행 흐름을 빠르게 찾기 위한 안내입니다. 모든 파일을 한 번에 읽기보다 아래 경계에 맞춰 관련된 부분만 따라갑니다.

## 실행 흐름

1. `script_list.tmp`가 브라우저 런타임 스크립트의 로드 순서를 정합니다.
2. `js/source-script-loader.js`가 그 순서대로 API 스크립트를 로드합니다.
3. `main.js`가 `main-module-spec.js`와 `main-module-resolver.js`를 사용해 모듈 계약을 확인합니다.
4. `main.js`가 상태 접근자, 핵심 서비스, 도메인 서비스, UI·저장 서비스를 순서대로 조립합니다.
5. 조립된 공개 API가 `main-app-bootstrap.js`를 통해 앱 초기화를 시작합니다.

전체 레이어는 [모듈 관계도](module-relationship-map.md), 모듈별 API와 입력은 [의존성 인벤토리](module-dependency-inventory.md)를 참고합니다.

## `main.js`에서 찾을 위치

`main.js`는 애플리케이션의 조립 지점이자 기존 전역 API 호환 계층입니다. 기능 계산이나 UI 동작을 구현하는 곳이 아니라, 각 서비스에 의존성을 전달하고 초기화 순서를 연결하는 곳으로 유지합니다.

| 수정 목적 | 검색할 식별자 또는 주석 | 책임 |
| --- | --- | --- |
| 필수 모듈 계약 확인 | `assertRequiredServices` | 모듈 API 누락을 초기 단계에서 검출 |
| 상태 접근자와 공용 서비스 조립 | `mainRuntimeCoreAccessorService`, `mainRuntimeCoreFoundationServices` | 상태와 핵심 서비스 연결 |
| 공용 계산·상태 도우미 | `Shared Core Utilities`, `Group Data Structures` | 여러 서비스가 공유하는 호스트·그룹 유틸리티 준비 |
| 표·이미지 기능 조립 | `mainRuntimeTableImageServices` | 표 표시와 이미지 내보내기 계열 서비스 연결 |
| 도메인 기능 조립 | `mainRuntimeDomainServices` | 시간대, 고정 시간, 다중 범위 등 연결 |
| 저장·앱 구성 | `mainPersistenceCompositionServices`, `mainRuntimeCompositionServices` | 영속성 및 사용자 기능 서비스 조합 |
| 초기화 순서와 브리지 연결 | `mainRuntimeBootstrapWiringServices` | 공개 서비스와 앱 시작 절차 연결 |
| 이전 전역 함수 호출 경로 | `callMainRuntimePublicApi`, `Public compatibility facade` | 호환 전역 호출을 공개 서비스로 전달 |

새 기능을 추가할 때는 도메인 서비스에 구현하고, 이 파일에는 필요한 의존성 전달과 공개 함수 연결만 추가합니다. 기존 조립 단계를 통째로 바꾸기보다 영향을 받는 단계와 그 단계의 모듈 테스트를 함께 확인합니다.

## 책임별 주요 파일

| 변경 영역 | 시작점 | 함께 볼 파일 |
| --- | --- | --- |
| 시간 계산·시간대 처리 | `time-service.js` | `time-core.js`, `timezone-data.js`, `time-input-mutations.js`, `timer-engine.js` |
| 그룹·탭 상태 | `group-state.js` | `group-context-state.js`, `group-tabs.js`, `app-state-patcher.js` |
| 계산기 입력·표시 | `calculator.js` | `calculator-countdown-state.js`, `calculator-actions.js`, `date-picker.js` |
| 저장 데이터 정규화 | `persistence-state-normalizer.js` | `state-persistence.js`, `format-profile-state.js`, `multi-state.js` |
| 브라우저 저장소·설정 초기화 | `state-persistence.js` | `persistence-service-bundle.js`, `settings-io.js`, `data-transfer.js` |
| 핵심·표·이미지 서비스 의존성 구성 | `main-runtime-core-service-bootstrap.js`, `main-runtime-table-image-bootstrap.js` | 각 조립부가 생성할 서비스의 설정을 함께 구성 |
| 도메인 서비스 조립·의존성 구성 | `main-runtime-domain-service-bootstrap.js`, `main-runtime-ui-services-bootstrap.js` | 도메인 서비스를 만드는 데 필요한 설정과 생성 순서를 함께 확인 |
| 최종 앱 시작 wiring | `main-runtime-bootstrap-wiring.js` | 앱 bootstrap 설정과 공개 API 연결을 한 곳에서 확인 |
| 모듈 필수 API 계약 | `main-module-spec.js` | `main-module-resolver.js`, `module-create-service-convention.test.mjs` |

저장 영역은 저장소 읽기·쓰기와 앱 상태 복구를 `state-persistence.js`가 맡고, 들어오는 데이터의 기본값·형태 정규화는 `persistence-state-normalizer.js`가 맡습니다. 공개 진입점은 기존처럼 `GTVStatePersistence.createService()`로 유지합니다.

## 구조 검증 명령

- `npm run sync:source-loader`: 스크립트 manifest와 생성 로더를 동기화합니다.
- `npm run docs:module-inventory:check`: 의존성 인벤토리가 현재 코드와 일치하는지 확인합니다.
- `npm run ci:gate`: 린트, 문서 확인, 커버리지 테스트, 엄격 빌드를 순서대로 수행합니다.
