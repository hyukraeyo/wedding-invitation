# 🍌 바나나웨딩 (Banana Wedding)

> **특별한 순간을 위한 가장 달콤한 모바일 청첩장**
> 프리미엄 디자인과 최상의 사용자 경험을 제공하는 모바일 청첩장 제작 플랫폼입니다.

---

## 🚀 주요 기술 스택

### **Core**
- **Framework**: Next.js 16.1.x (App Router, Cache Components, View Transitions)
- **Library**: React 19.2.x
- **Language**: TypeScript 5 (Strict Mode)

### **Styling & UI**
- **Styling**: SCSS Modules (Primary) + Tailwind CSS (Secondary)
- **UI Components**: Radix UI Primitives + Toss Design System (TDS) 기반 디자인
- **Animations**: iOS 스타일 트랜지션 (`cubic-bezier(0.16, 1, 0.3, 1)`)

### **Infrastructure & Backend**
- **Database/Auth**: Supabase (Remote CLI)
- **Deployment**: Vercel
- **State Management**: Zustand (Client), TanStack Query (Server)

---

## 🛠 필수 개발 규칙

이 프로젝트의 모든 코드는 최상의 품질과 일관성을 위해 아래 규칙을 준수해야 합니다.

1. **모바일 퍼스트**: 전 디자인은 모바일 환경을 최우선으로 설계합니다.
2. **SCSS Modules 필수**: UI 컴포넌트 스타일링 시 Tailwind 대신 SCSS Modules를 사용합니다.
3. **디자인 토큰 활용**: 하드코딩된 색상 대신 `@/styles/_variables.scss`의 변수를 사용합니다.
4. **한글 커밋 메시지**: Git 커밋 시 반드시 한글을 사용하며 Conventional Commits 형식을 따름니다.
5. **Radix UI 활용**: 웹 접근성과 유연성을 위해 Radix UI Primitives를 기본으로 사용합니다.

---

## 📂 프로젝트 구조

```text
src/
├── app/              # Next.js App Router (Pages & API)
├── components/       # UI 및 비즈니스 프로젝트 컴포넌트
│   ├── ui/           # 공용 UI 컴포넌트 (Radix 기반)
│   ├── common/       # 전역 공용 컴포넌트
│   └── builder/      # 청첩장 빌더 핵심 로직
├── services/         # 서버 측 데이터 서비스 레이어
├── store/            # 전역 상태 관리 (Zustand)
├── styles/           # 전역 스타일 및 디자인 토큰
└── types/            # TypeScript 타입 정의
```

---

## 🏁 시작하기

### **설치 및 실행**
```bash
# 의존성 설치
npm install

# 로컬 개발 서버 실행 (Turbopack)
npm run dev
```

### **환경 변수 설정**
`.env.local` 파일을 생성하고 필요한 Supabase 및 Kakao API 키를 설정하십시오.

---

## 📄 라이선스

© 2024 Banana Wedding. All rights reserved.
