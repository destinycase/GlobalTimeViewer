# 코드 스타일 정리 기준

- 작성일: 2026-04-02
- 기준 버전: 3.12.1

이 문서는 현재 코드베이스에서 공존하는 작성 스타일을 정리하고, 앞으로 맞춰 갈 기본 패턴을 기록합니다. 목적은 전면 재작성보다 스타일 드리프트를 줄이고, 새 코드가 어느 방향을 따라야 하는지 명확히 하는 데 있습니다.

## 권장 기본 패턴

신규 모듈과 리팩토링 대상 모듈은 아래 패턴을 우선합니다.

- IIFE 전역 노출 + `createService(deps = {})` 진입점 유지
- `safeDeps` 또는 동등한 방어적 입력 정규화
- `invokeDep(name, ...args)` 같은 의존성 호출 헬퍼 사용
- 브라우저 API는 가능한 한 helper 또는 foundation service 뒤로 숨김
- public method는 `null` 또는 불완전한 deps에서도 안전하게 no-op 또는 fallback 동작
- 테스트는 모듈 단위 `createService()` 진입점 기준으로 작성

## 현재 스타일 섬

### 1) 레거시 전역 셸

- 대상: `main.js`
- 상태:
  - 전역 상태, 전역 바인딩, 서비스 조립, 호환 래퍼가 한 파일에 공존
  - 신규 서비스 모듈 스타일과 가장 차이가 큼
- 원칙:
  - 신규 비즈니스 로직은 `main.js`에 추가하지 않음
  - `main.js`는 호환 셸과 조립 진입점으로만 유지

### 2) 부분 레거시 모듈

- 대상 예시:
  - `js/modules/calculator.js`
  - `js/modules/group-tabs.js`
- 상태:
  - DI 기반 진입점은 있지만, 하위 호환 래퍼 또는 오래된 직접 접근 패턴이 일부 남아 있음
- 원칙:
  - 동작 유지가 필요한 래퍼는 남기되 deprecated 경로를 명시
  - 새 수정은 `createService()` 경로 중심으로만 반영

### 3) 브라우저 API 직접 접근 모듈

- 대상 예시:
  - `js/modules/ui-preferences-state.js`
  - `js/modules/app-feedback.js`
  - `js/modules/state-persistence.js`
  - `js/modules/copy-actions.js`
- 상태:
  - `document`, `navigator`, `localStorage`, `location` 직접 접근이 남아 있음
- 원칙:
  - 테스트 가능성과 환경 독립성이 필요한 지점부터 helper 또는 foundation service로 이동
  - 단순 렌더링 모듈은 즉시 과도한 추상화를 하지 않음

## 이번 정리에서 반영한 내용

- `js/modules/group-tabs.js`
  - `createService(deps = {})`로 입력 방어 추가
  - `invokeDep()` 기반 호출 패턴으로 정리
  - `documentRef` 경계와 `Element` 안전 검사 추가
  - `null deps`에서도 public method가 안전하게 동작하도록 보강
- `js/modules/ui-preferences-state.js`
  - `document` 직접 접근을 `documentRef` helper 경계로 정리
  - 전역 `document` 없이도 주입된 문서 참조로 동작하도록 보강
  - 관련 테스트로 주입 경로를 고정
- `js/modules/app-feedback.js`
  - `documentRef`, `locationRef`, `storageRef`, `navigatorRef` 경계를 추가
  - 로깅과 번역 호출을 helper로 모아 direct global fallback을 축소
  - 관련 테스트로 `*Ref` 주입 경로를 고정
- `js/modules/state-persistence.js`
  - `createService(deps = {})`와 `safeDeps` 기준으로 저장소/문서 접근 경계를 정리
  - `chromeRef`, `chromeStorageLocalRef`, `localStorageRef`, `documentRef` 경로를 지원
  - `null deps`에서도 저장소 helper와 기본 fallback 경로가 안전하게 동작하도록 보강
- `js/modules/calculator.js`
  - `createService()`가 `documentRef`, `storageRef`, `luxonDateTimeRef`, `datePickerCtor`, `timeCoreRef`, `refreshTargetRef`를 우선 사용하도록 정리
  - 날짜/포맷 helper가 서비스 경로에서 명시적으로 주입된 runtime 의존성을 전달받도록 보강
  - deprecated 전역 진입점은 유지하되 내부 구현은 서비스 경로 위임만 담당
- `js/modules/main-persistence-services.js`
  - 하위 모듈로 `documentRef`, `windowRef`를 명시 전달하면서 기존 `document`, `window` 호환 키도 유지
- `js/modules/copy-actions.js`
  - `documentRef` 우선 경로와 `logError` helper를 추가해 브라우저/콘솔 직접 접근을 축소
  - 기존 `document` fallback과 runtime 동작은 그대로 유지

## 다음 우선순위

1. `main.js`에는 추가 분기 대신 기존 서비스 모듈로 위임
2. `calculator.js`에 남아 있는 모듈 스코프 fallback을 장기적으로 helper 팩토리로 더 축소
3. 브라우저 API 직접 접근이 남아 있는 보조 모듈을 `*Ref` / helper 경계로 정리

## 하지 않을 일

- 스타일 통일만을 목적으로 전 파일 기계적 재포맷을 수행하지 않음
- 테스트 경계가 없는 대규모 추상화 이동을 한 번에 하지 않음
- 호환 경로를 제거해 런타임 위험을 키우는 리팩토링을 우선하지 않음
