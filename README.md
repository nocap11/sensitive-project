# FROM TEXT TO FEELING

AI 기반 감성 분석 웹 서비스입니다. 사용자가 입력한 텍스트를 OpenAI GPT-4o-mini 모델을 통해 분석하고, 결과를 긍정, 부정, 중립으로 시각화하여 보여줍니다.

## 주요 기능

- **실시간 감성 분석**: 텍스트를 입력하면 즉시 AI 분석을 시작합니다.
- **상세 결과 제공**: 분석된 감성, 신뢰도(%), 분석 근거를 함께 표시합니다.
- **미니멀 디자인**: 고대비 레이아웃과 큰 타이포그래피를 적용한 세련된 UI를 제공합니다.
- **히스토리 저장**: 분석 결과는 Supabase DB에 안전하게 기록됩니다.

## 기술 스택

- **Frontend**: HTML5, Vanilla CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express
- **AI**: OpenAI API (GPT-4o-mini)
- **Database**: Supabase
- **Deployment**: Vercel

## 시작하기

### 1. 환경 변수 설정

`.env.example` 파일을 복사하여 `.env` 파일을 생성하고 필요한 API 키를 입력합니다.

```env
OPENAI_API_KEY=your_openai_api_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
PORT=3000
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 서버 실행

```bash
# 개발 모드 (nodemon)
npm run dev

# 일반 모드
npm start
```

### 4. 접속

브라우저에서 `http://localhost:3000`에 접속합니다.

## 배포

이 프로젝트는 Vercel에 최적화되어 있습니다. Vercel Dashboard에서 환경 변수를 등록한 뒤 배포하세요.

## 라이선스

MIT License
