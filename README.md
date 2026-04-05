# Global Time Viewer v3.12.4

## 최근 업데이트 (3.12.4)
- 아키텍처 문서를 `README.md`로 통합하고 런타임 구조 설명을 최신화했습니다.
- 모듈 의존성 호출 스타일을 `toSafeCallable(depName, depFn)`으로 통일하고 규약 회귀 테스트를 추가했습니다.

## 확장 프로그램
- https://chromewebstore.google.com/detail/ojmkgfaeececindhbegihnonpndkbnho?utm_source=item-share-cb

## 주요 기능
- 여러 시간대를 한 화면에서 비교 (실시간)
- 기준 시간을 변경하여 시간대별 시간 확인 (시간 변경)
- 구간 단위 시작/끝 시간의 연속 관리 (연속 시간 변경)
- 슬롯 기반 고정 시간 관리 및 타임라인 표시 (고정 시간)
- 시간 변환, 기간 계산, 카운트다운, 스마트 포맷 변환 도구 (계산기 도구)
- `표기 / 복사 양식`으로 출력 항목 및 복사 형식 제어
- 시간대 테이블 이미지 저장 및 복사 기능
- 그룹/보조 그룹 단위 설정 저장, 내보내기/가져오기

## 아키텍처
이 문서는 앱의 런타임 부트스트랩과 서비스 계층을 높은 수준에서 정리합니다. 리팩토링 중 깨지기 쉬운 경계를 빠르게 파악할 수 있도록 짧고 핵심적인 내용에 집중합니다.

### 부트스트랩 흐름

```mermaid
flowchart TD
    A[index.html 소스 스크립트 로더] --> B[정렬된 defer 스크립트 목록]
    B --> C[main.js]
    C --> D[startBootstrapOnDomReady]
    D --> E[mainRuntimePublicApiService.initApp]
    E --> F[mainAppBootstrapService.initApp]
    F --> G[assertRequiredServices]
    F --> H[loadPersistence]
    F --> I[테마, 언어, UI 스케일 적용]
    F --> J[mainUiInitService.initUI]
    F --> K[검색, 드래그 앤 드롭, 계산기 이벤트 바인딩]
    F --> L[startRealtimeTicker]
    F --> M[switchMainTab + updateClocks]
```

`main-app-bootstrap.js`는 런타임 코디네이터입니다. 비즈니스 규칙을 직접 소유하지 않고, 시작 순서를 조정하고, 타임아웃 가드를 적용하며, 실패 시 `showFatalError`를 통해 안전하게 종료합니다.

### 조립 계층

```mermaid
flowchart LR
    A[main.js] --> B[mainRuntimeCompositionBootstrap]
    B --> C[mainCompositionConfigBuilder]
    C --> D[mainCoreServices.createMainRuntimeCompositionServices]
    D --> E[mainUiRuntimeServices]
    D --> F[mainClockOrchestratorServices]
    D --> G[기반 서비스와 영속성 서비스]
```

중요한 분리는 다음과 같습니다.

- `main.js`: 레거시 호환 셸이자 전역 바인딩 표면입니다.
- `mainRuntimeCompositionBootstrap`: 런타임 의존성을 하나의 조립 설정으로 묶습니다.
- `mainUiRuntimeServices`: `timelineFrameService`, `fixedTimeTableService`, `mainUiInitService` 같은 UI 지향 서비스를 생성합니다.
- `mainClockOrchestratorServices`: 주기적인 시계 및 타임라인 업데이트를 담당합니다.
- 기반 서비스와 영속성 서비스: 클립보드, 프롬프트, 토스트, 설정 입출력, 영속성 같은 브라우저 접점 기능을 감쌉니다.

### UI 런타임 책임

```mermaid
flowchart TD
    A[mainUiInitService] --> B[탭 전환]
    A --> C[그룹 및 보조 그룹 제어]
    A --> D[시간대 추가 및 검색 제어]
    A --> E[고정 시간 제어]
    A --> F[연속 시간 변경 제어]
    A --> G[복사 양식 및 내보내기 제어]
    H[timelineFrameService] --> I[실시간 타임라인 렌더링 및 드래그 상호작용]
    J[fixedTimeTableService] --> K[고정 시간 테이블 렌더링 및 슬롯 액션]
```

이 구분이 중요한 이유는 UI 부트스트랩과 렌더링이 동일한 책임이 아니기 때문입니다. `mainUiInitService`는 이벤트와 초기 제어 상태를 연결하고, 렌더링 비중이 큰 로직은 전문 서비스에 위임합니다.

### 상태와 도메인 경계

앱은 여전히 전역 스크립트 기반이지만, 새 코드 대부분은 모듈 간 직접 변이보다 서비스 경계를 따릅니다.

- 상태 accessor와 bridge는 모든 모듈이 전역 변수에 직접 의존하지 않도록 현재 앱 상태를 노출합니다.
- 도메인 서비스는 시간대, 고정 시간 슬롯, 영속성 스냅샷, 행 순서 같은 규칙을 소유합니다.
- facade와 bridge 모듈은 기존 `main.js` 경로가 새 서비스를 안전하게 호출할 수 있도록 호환 래퍼를 제공합니다.

동작을 수정할 때는 `main.js`에 분기를 더 추가하기보다, 해당 규칙을 소유한 가장 좁은 서비스부터 수정하는 편이 맞습니다.

### 빌드와 패키징 모델

- 소스 개발 모드는 전역 IIFE 모듈 순서를 사용하며, `index.html`은 소스 목록 관리를 `js/source-script-loader.js`에 위임합니다.
- 빌드는 `scripts/build-extension.mjs`에서 concat/minify 및 Vite 산출물 패키징을 수행합니다.
- `build:strict`는 버전 일관성을 검증하고 배포 가능한 `dist` 및 zip 산출물을 생성합니다.

즉, 패키지 결과물은 번들되더라도 소스 모드에서는 스크립트 순서가 여전히 런타임 계약입니다.

### 리팩토링 가드레일

- 시작 순서는 `main-app-bootstrap.js`에 유지합니다.
- 조립 배선은 bootstrap 및 config-builder 계층에 유지합니다.
- 가능하면 브라우저 API는 기반 서비스 뒤에 숨깁니다.
- 계층 간 로직 이동 전에는 범위가 좁은 모듈 테스트를 추가하거나 갱신합니다.
- `main.js`는 새 비즈니스 로직의 기본 위치가 아니라, 호환 셸로 취급합니다.

## 실행 방법
1. 브라우저에서 `index.html`을 직접 열어 실행합니다.
2. 확장 프로그램으로 사용할 경우 `chrome://extensions`에서 개발자 모드로 로드합니다.

## 개발 명령
- 테스트: `npm test -- --run`
- 빌드: `npm run build`

## 데이터 저장
- 확장 프로그램 환경: `chrome.storage.local` 우선 사용
- 일반 웹 환경(Fallback): `localStorage`

### 주요 데이터 키
- 통합 데이터: `GTV_v324_Data`
- 테마: `GTV_Theme`
- 언어: `GTV_Lang`
- UI 스케일: `GTV_UIScale`

## 변경 이력
- 상세한 변경 사항은 `CHANGELOG.md`를 참고하세요.
