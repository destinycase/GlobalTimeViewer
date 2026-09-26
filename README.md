# Global Time Viewer

Global Time Viewer는 여러 지역의 시각을 비교하고, 날짜와 시간을 조정해 확인하며, 고정 시간 관리와 시간 관련 계산을 할 수 있는 Chrome 확장 프로그램입니다. 한국어와 영어, 어두운/밝은 테마, 화면 크기 조절을 지원하며 저장 설정을 내보내고 가져올 수 있습니다.

**현재 소스 버전:** 3.12.9
**Chrome 웹 스토어:** [Global Time Viewer 열기](https://chromewebstore.google.com/detail/ojmkgfaeececindhbegihnonpndkbnho)

## 문서 안내

- [사용자 가이드](docs/user-guide.md) — 프로그래밍 지식 없이 설치하고 사용하는 방법을 안내합니다.
- [개발자 가이드](docs/developer-guide.md) — 프로젝트 구조, 실행 흐름, 모듈 책임, 코딩 규칙과 안전한 변경 절차를 설명합니다.
- [코드 탐색 안내](docs/code-navigation.md) — 기능을 담당하는 코드와 실행 경로를 찾는 방법을 안내합니다.
- [모듈 관계도](docs/module-relationship-map.md) — 런타임과 주요 모듈의 관계를 그림으로 설명합니다.
- [모듈 의존성 인벤토리](docs/module-dependency-inventory.md) — 생성된 모듈 API, 의존성, 스크립트 순서 자료입니다.
- [변경 이력](docs/CHANGELOG.md) — 버전별 변경 사항과 버전 번호 정정 안내를 확인할 수 있습니다.

## 개발자를 위한 간단 안내

의존성은 `npm install`로 설치합니다. 검사와 빌드 명령, 변경 시 주의할 점은 [개발자 가이드](docs/developer-guide.md)에 정리되어 있습니다. 확장 프로그램 빌드 결과는 `dist_extension/`에 생성되며, 생성된 파일을 직접 수정하지 마세요.
