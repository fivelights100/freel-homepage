# FreeL Plugin Home

GitHub + AWS Amplify Hosting 배포를 기준으로 만든 정적 메인 홈입니다.

## 포함 파일
- `index.html`: 메인 홈
- `styles.css`: 스타일
- `script.js`: 간단한 JS
- `amplify.yml`: Amplify 배포 설정

## 특징
- 가벼운 정적 웹 구조
- GitHub에 바로 업로드 가능
- AWS Amplify에 바로 연결 가능
- 추후 플러그인 목록/상세 페이지로 확장 가능

## 로컬 미리보기
정적 파일이라서 브라우저에서 `index.html`을 직접 열어도 되고,
간단한 로컬 서버를 써도 됩니다.

예시 (Python):
```bash
python -m http.server 8080
```

그 뒤 브라우저에서 `http://localhost:8080` 접속
