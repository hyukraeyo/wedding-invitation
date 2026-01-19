---
trigger: always_on
---

# 🍌 바나나웨딩 프로젝트 개발 규칙

> **CRITICAL: SYNC MANDATE**
> 모든 설정 및 가이드 문서(`.agent`, `.codex`, `.cursor`, `.opencode`, `.cursorrules`, `AGENTS.md`, `README.md`, `ARCHITECTURE.md`)는 항상 동일한 기준을 유지하도록 함께 업데이트되어야 합니다. 한 곳의 규칙이 변경되면 언급된 모든 파일에 해당 변경 사항을 명시하고 동기화하십시오.

## 프로젝트 개요
모바일 청첩장 제작 플랫폼. Next.js 16 App Router + React 19 + TypeScript + Zustand 기반.

## 필수 참조 문서
- **ARCHITECTURE.md**: 아키텍처 및 공통 패턴 가이드
- **README.md**: 프로젝트 개요 및 기술 스택

## 핵심 개발 규칙

### 0. Vercel React Best Practices (최우선)
- React/Next.js 관련 작업은 항상 Vercel Best Practices를 최우선으로 준수합니다.
- 참조: `.codex/skills/vercel-react-best-practices/SKILL.md` 및 `rules/*`

### 1. Data Fetching (Strict)
- ❌ 클라이언트에서 `useEffect` + `fetch` 금지
- ❌ 서버 컴포넌트에서 내부 API Route 호출 금지
- ✅ 서버 컴포넌트에서 Service 계층 직접 호출
- ✅ 데이터 변이는 Server Actions 사용

### 2. 모바일 퍼스트
- 모든 디자인은 모바일 환경 기준으로 설계
- 터치 친화적 UI (최소 44px 터치 영역)
- 반응형 모달: Desktop(Dialog) ↔ Mobile(Drawer)

### 3. Zustand 상태 관리
- `useInvitationStore` 단일 스토어 사용
- 셀렉터로 필요한 상태만 구독
- `/builder?mode=edit`: 기존 청첩장 수정 (상태 유지)
- `/builder`: 새 청첩장 생성 (스토어 초기화)

### 4. 스타일링 및 UI 컴포넌트
- Primary 컬러: 바나나 옐로우 `#FBC02D`
- 애니메이션: iOS 느낌 (`cubic-bezier(0.16, 1, 0.3, 1)`)
- **SCSS Modules 필수 사용 (Tailwind 금지)**
- 디자인 토큰은 `src/styles/_variables.scss`에서 관리

### 4.1 UI 컴포넌트 생성 규칙 (Hybrid Component Pattern)

**폴더 구조 (필수)**
```
src/components/ui/ComponentName/
├── ComponentName.tsx        # 컴포넌트 로직 (PascalCase)
├── ComponentName.module.scss # 스타일
└── index.ts                 # Re-export (export * from './ComponentName')
```

**필수 규칙**
- ❌ 단일 파일(`component.tsx`) 금지 → PascalCase 폴더 구조 사용
- ✅ Named Export 사용: `export { ComponentName }`
- ✅ displayName 필수 설정
- ✅ SCSS 변수는 `@use "../../../styles/variables" as v;`로 import

**Shadcn CLI 사용 시**
```bash
npx shadcn@latest add [component]
# 이후 반드시:
# 1. ComponentName 폴더로 이동
# 2. ComponentName.tsx / ComponentName.module.scss / index.ts 구조로 리팩토링
# 3. Tailwind 코드를 SCSS Modules로 이전
```

### 5. 코드 품질
- TypeScript strict 모드 필수
- ESLint 규칙 준수
- 빌드 에러 없이 커밋