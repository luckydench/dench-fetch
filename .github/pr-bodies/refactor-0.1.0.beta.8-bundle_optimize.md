### 리팩터링 한 기능 요약
dench fetch 빌더/러너 구조와 HTTP 타입 정의를 정리했습니다.

### 리팩터링 진행 이유
요청 실행 책임을 공통 러너로 분리하고 HEAD 요청 처리를 명확히 하며, 불필요한 문서와 스크립트 구성을 줄이기 위해 진행했습니다.

### 리팩터링 작업 상세 내용
[] dench 빌더의 응답 변환 로직을 공통 러너 생성 함수로 분리
[] POST/PUT/PATCH 요청 빌더를 createCreateBuilder로 통합
[] HEAD 요청 전용 builder/runner와 상태 및 헤더 응답 처리 흐름 정리
[] params 설정 필드를 제거하고 요청 URL 조합 방식 단순화
[] HTTP 옵션 타입을 const object 기반 타입에서 enum으로 정리
[] 아키텍처 문서 링크와 파일, publish/version 스크립트 및 commit-msg 규칙 정리
