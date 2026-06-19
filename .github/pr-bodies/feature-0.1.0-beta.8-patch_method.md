### 추가 된 기능 요약
자동 PR 생성 흐름을 워크플로 내부에서 처리하도록 정리했습니다.

### 작업 상세 내용
- auto-pr 스크립트를 제거하고 GitHub Actions에 PR 생성 로직을 인라인으로 추가
- PR 중복 여부 확인 후 master 기준 PR을 생성하도록 구성
- Husky commit-msg, pre-push 훅 실행 내용을 간소화
- dench 인터페이스에서 patch 메서드 노출 제거

### 그 외 이슈 (선택)
- 기존 PR 템플릿 파일 제거
