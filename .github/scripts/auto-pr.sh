#!/usr/bin/env bash
set -e
# -e 옵션은 스크립트 실행 중 오류가 발생하면 즉시 종료하도록 하는 옵션임
# 이렇게 하면 오류가 발생했을 때 스크립트가 계속 실행되는 것을 방지할 수 있음
# errorexit의 약자로, 정확히 쓰면
# set -o errexit 임

echo "Current branch: $BRANCH_NAME"



SAFE_BRANCH_NAME="${BRANCH_NAME//\//-}" # 슬래시를 하이픈으로 바꿔줌
BODY_FILE=$(find .github/pr-bodies -name ${SAFE_BRANCH_NAME}*.md | head -n 1) 
# find는 명령어를 찾는 파일인데
# 여기서는 .github/pr-bodies 디렉토리에서 ${SAFE_BRANCH_NAME}*.md 패턴에 맞는 파일을 찾음
# head -n 1은 그 중 첫 번째 파일만 가져오라는 의미임


# 현재 브랜치 -> master 브랜치 대상으로 한 PR이 없는지 확인함.
# pr view는 pr 존재 여부 확인힘
# 사용 방식은 pr view <branch_name> --base <base_branch>
# branch_name -> base_branch로 PR이 존재하면 0, 존재하지 않으면 1 반환
if gh pr view "$BRANCH_NAME" --base master > /dev/null 2>&1; then
    echo "PR already exists and updating..."

# 추가로 /dev/null은 표준 출력을 버리는 장치 파일로, 그렇게 약속된 모양이니 외워야 함
# 또한 2>&1은 표준 오류 출력(stderr, 2)를 표준 출력(stdout, 1)으로 리다이렉션 시키는 것
# 따라서 위 구문은 모든 출력(성공, 실패)을 출력하지 않고 버리는 역할을 해줌

# 예를 들어 echo "Hello" > /dev/null 이라 하면 Hello가 출력되지 않음.
# 참고로 0은 stdout, 1은 stdout, 2는 stderr임.

# --base master > /dev/null 이 구문에서  >는 1>의 축약형으로 
# 사실상 이런 느낌임
# echo(gh pr view "$BRANCH_NAME" --base master) 1> /dev/null
# 그렇다면 gh pr view의 결과가 되는 모든 출력이 /dev/null로 향해서 출력이 사라지는 것
# 사용법은 (기록할 내용이나 명령) > (출력할 파일명)


# >&은 다른 파일 디스크립터로 리다이렉션 시키는 구문
# 만약 2>1이라 적는다면 stderr을 "1"이라는 파일에 출력하라는 의미가 됨
# 하지만 2>&1이라 적는다면 stderr을 stdout으로 리다이렉션 시키는 것
# 애당초 >&의 쓰이는 방법은 >& 뒤에 파일디스크립터가 오게 되어있음
# 따라서 2>&1은 stderr을 stdout으로 리다이렉션 시키는 구문임



gh pr edit "$BRANCH_NAME" \
    --title "Auto PR: $BRANCH_NAME" \
    --body-file "$BODY_FILE" \
    --add-assignee @me \
    --add-reviewer @copilot

exit 0
fi

gh pr create \
    --title "Auto PR: $BRANCH_NAME" \
    --body-file "$BODY_FILE" \
    --base master \
    --head "$BRANCH_NAME" \
    --assignees @me \
    --reviewers @copilot 

#위 스크립트의 주 내용을 정리하면 이렇다.
# echo "Current branch: $BRANCH_NAME" : 현재 브랜치 이름을 출력
# if gh pr view "$BRANCH_NAME" --base master > /dev/null 2>&1; then : 
# - 현재 브랜치에서 master 브랜치를 기준으로 PR이 존재하는지 확인
# fi : PR이 존재하면 종료
# gh pr create : PR 생성 명령어
# 그 아래로는 PR 제목, 내용, 기준 브랜치(master), 현재 브랜치(head)를 지정

# 참고로 이러한 github actions의 pr 생성 기능은 실제 그 레포 setting 에서 설정이 되어있어야 한다.
# settings -> actions -> general -> workflow permissions -> read and write permissions 설정 ㄱ