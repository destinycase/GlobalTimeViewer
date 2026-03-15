# Global Time Viwer v3.10.1

## 최근 업데이트 (v3.10.1)
- main.js 핵심 책임을 기능 모듈로 추가 분리했습니다.
  - time-adjust-actions.js, app-feedback.js, image-export-bridge.js, calculator-actions.js
- 시간 변경/연속 시간 변경에서 시간 조정이 기준 시간대가 아닌 UTC로 동작하던 문제를 수정했습니다.
  - 기준 시간(base timezone) 기준 시간 조정이 정상 반영됩니다.
- 고정 시간 - 시간대 테이블의 슬롯 타이틀 헤더를 개선했습니다.
  - 타이틀 텍스트 크기 상향
  - 헤더 셀 기준 중앙 정렬 보장
- 배포 스크립트(build_extension.ps1)를 index.html 스크립트 순서 기반 자동 번들링 방식으로 보강했습니다.
## 주요 기능
- 여러 시간대를 한 화면에서 비교 (`실시간`)
- 기준 시간을 변경하여 시간대별 시간 확인 (`시간 변경`)
- 구간 단위 시작/끝 시간을 연속 관리 (`연속 시간 변경`)
- 슬롯 기반 고정 시간 관리 및 타임라인 표시 (`고정 시간`)
- 시간 변환/기간 계산/카운트다운/스마트 포맷 변환 도구 (`계산기 도구`)
- `표기 / 복사 양식`으로 출력 항목 및 복사 형식 제어
- 시간대 테이블 이미지 저장 및 복사 기능
- 그룹/보조 그룹 단위 설정 저장, 내보내기/가져오기

## 실행 방법
1. 브라우저에서 `index.html`을 직접 열어 실행합니다.
2. 확장 프로그램으로 사용할 경우 `chrome://extensions`에서 개발자 모드로 로드합니다.

## 개발 명령
- 테스트: `npm test -- --run`
- 빌드: `npm run build`

## 데이터 저장
- 확장 프로그램 환경: `chrome.storage.local` 우선 사용
- 일반 웹 환경(Fallback): `localStorage`

### 주요 저장 키
- 통합 데이터: `GTV_v323_Data`
- 테마: `GTV_Theme`
- 언어: `GTV_Lang`
- UI 스케일: `GTV_UIScale`

## 변경 이력
- 자세한 변경 사항은 `CHANGELOG.md`를 참고하세요.

