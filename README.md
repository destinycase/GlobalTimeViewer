# Global Time Viewer v3.12.6

## 프로젝트 개요
Global Time Viewer는 여러 시간대를 빠르게 비교하고, 시간 조정/기간 계산/복사/이미지 저장을 지원하는 브라우저 기반 도구입니다.

## 확장 프로그램
- https://chromewebstore.google.com/detail/ojmkgfaeececindhbegihnonpndkbnho?utm_source=item-share-cb

## 주요 기능
- 실시간 시간대 비교
- 기준 시간 변경 및 시간대별 시간 확인
- 연속 시간 변경(구간 단위 시작/종료 시간 관리)
- 고정 시간 관리 및 타임라인 표시
- 기간 계산, 카운트다운, 날짜/시간 이동 계산
- 테이블 전체 복사 및 이미지 저장
- 그룹/보조 그룹 단위 설정 내보내기/가져오기

## 실행 방법
1. 웹 실행: 브라우저에서 `index.html`을 직접 열어 실행합니다.
2. 확장 실행: `chrome://extensions`에서 개발자 모드로 로드합니다.

## 개발 명령
- 의존성 설치: `npm install`
- 린트: `npm run lint`
- 테스트: `npm test -- --run`
- 커버리지: `npm run test:coverage`
- 빌드: `npm run build`
- 엄격 빌드(버전 정합성 검사): `npm run build:strict`

## 개발 가이드

### 1. 프로젝트 구조
- `index.html`: UI 골격 + 런타임 스크립트 로더
- `main.js`: 엔트리 포인트 호환 셸(bootstrap 연결)
- `js/modules/`: 도메인/상태/UI 모듈
- `js/vendor/`: 외부 라이브러리 브릿지
- `tests/`: 모듈 단위 테스트 및 회귀 테스트
- `scripts/`: 빌드/유틸 스크립트
- `dist/`, `dist_extension/`: 빌드 산출물 (수동 수정 금지)

### 2. 코드 규칙
- ESLint 오류 0을 유지합니다. (`npm run lint`)
- 안정성 규칙을 우선합니다. (`no-undef`, `no-redeclare`, `eqeqeq`, `no-unreachable` 등)
- 콘솔 로그는 `console.warn`, `console.error`만 허용합니다.
- `js/modules/**`는 미사용 변수를 금지하며 `_` 접두 변수만 예외입니다.
- 가능한 범위에서 `createService(deps)` 기반 의존성 주입 패턴을 유지합니다.
- EOL은 기본 LF이며, `main.js`와 `*.ps1`만 CRLF를 유지합니다.

### 3. 작업시 주의점
- 변경 전/후 `npm run lint`와 영향 범위 테스트를 실행합니다.
- 배포 전 `npm run build:strict`를 실행합니다.
- 버전 변경 시 다음 파일을 함께 갱신합니다.
  - `package.json`, `package-lock.json`, `manifest.json`, `js/modules/app-config.js`, `README.md`, `CHANGELOG.md`
- 불필요한 diff 방지를 위해 줄바꿈(EOL)과 파일 인코딩(UTF-8)을 유지합니다.
- `dist/**`, `dist_extension/**`, `js/bundle.js`는 생성 산출물이므로 직접 수정하지 않습니다.
- 리팩토링 시 bootstrap 배선과 비즈니스 로직의 경계를 유지합니다.

## 아키텍처 요약
- 부트스트랩: `main.js` -> `main-app-bootstrap.js`
- 조립 계층: config-builder/composition 계층에서 서비스 배선 수행
- UI 런타임: 화면 초기화와 이벤트 연결 담당
- 도메인 모듈: 시간 계산, 그룹 상태, 테이블 렌더링 책임 분리

## 데이터 저장
- 확장 환경: `chrome.storage.local` 우선 사용
- 일반 웹(Fallback): `localStorage`
- 주요 키
  - 통합 데이터: `GTV_v324_Data`
  - 테마: `GTV_Theme`
  - 언어: `GTV_Lang`
  - UI 스케일: `GTV_UIScale`

## 변경 이력
- 상세 릴리스 노트는 `CHANGELOG.md`를 참고하세요.

## 확장 프로그램
- Chrome Web Store: https://chromewebstore.google.com/detail/ojmkgfaeececindhbegihnonpndkbnho?utm_source=item-share-cb
