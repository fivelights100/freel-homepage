# FreeL Plugin Home

정적 메인 홈입니다. AWS Amplify Hosting에 올린 뒤, 레지스트리 서버 주소를 입력하면 공식 플러그인 목록을 불러옵니다.

## 핵심 흐름
- 웹은 `/plugins/registry` 를 fetch 해서 목록 표시
- `앱에 설치` 버튼은 `freel://plugin/install?pluginId=...` 링크 호출
- `앱에서 삭제` 버튼은 `freel://plugin/uninstall?pluginId=...` 링크 호출
- FreeL 데스크톱 앱은 custom protocol 을 받아 실제 설치/삭제를 처리

## 배포 후 먼저 확인할 것
1. Registry URL 을 실제 서버 주소로 저장
2. 데스크톱 앱이 실행 중이거나, `freel://` 프로토콜이 등록되어 있는지 확인
3. 서버 CORS 허용 도메인에 Amplify 도메인 추가
