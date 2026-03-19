# Toolchain Upgrade Assessment

기준일: 2026-03-19  
프로젝트 현재: `vite 6.4.1`, `vitest 3.2.4`

## 관찰 결과

`npm outdated` 기준:

- `vite`: current `6.4.1`, latest `8.0.1`
- `vitest`: current `3.2.4`, latest `4.1.0`
- `terser`: current `5.46.0`, latest `5.46.1`

## 리스크 요약

1. Vite 6 -> 8  
플러그인/빌드 옵션 호환성, Node 런타임 요구사항, HTML 엔트리 처리 규칙 변동 가능성이 가장 큼.

2. Vitest 3 -> 4  
커버리지 provider, 기본 reporter, CLI 옵션 세부 동작 변화로 CI 출력/파이프라인 영향 가능.

3. 빌드 스크립트 결합도  
`build_extension.ps1`가 Vite 결과 구조(`dist/index.html`, asset path)를 가정하고 있어 메이저 업그레이드 시 회귀 가능.

## 권장 경로

1. 1차 저위험 업데이트  
`terser` 패치만 우선 반영.

2. 2차 테스트 프레임워크 업데이트  
`vitest` + `@vitest/coverage-v8`를 같은 메이저로 올리고 CI의 `test`, `coverage`를 먼저 안정화.

3. 3차 빌드 도구 업데이트  
`vite`를 메이저 업그레이드하고 `build_extension.ps1`의 산출물 검증 루틴(`js/bundle.js`, script path check)까지 함께 검증.

## 승격(Go) 조건

- 로컬: `npm run ci:gate` 통과
- CI: `lint`, `test`, `coverage`, `build_strict` 전부 통과
- 아카이브: `GlobalTimeViewer_extension.zip` 생성 및 수동 로드 점검
