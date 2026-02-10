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

- **Radix UI First (Gradual Migration)**: 모든 UI 컴포넌트는 점진적으로 **Radix UI Primitives** 기반으로 전환합니다.
- **TDS 스타일 유지**: 로직은 Radix UI를 사용하되, 디자인 시스템은 기존 [Toss Design System Mobile](https://tossmini-docs.toss.im/tds-mobile/)의 미학을 계승합니다.
- Primary 컬러: 바나나 옐로우 `#FBC02D`
- 애니메이션: iOS 느낌 (`cubic-bezier(0.16, 1, 0.3, 1)`)
- **SCSS Modules 필수 사용 (Tailwind 금지)**: Radix UI의 스타일링은 SCSS Modules를 통해 직접 제어합니다.
- 디자인 토큰은 `src/styles/_variables.scss`에서 관리

#### 4.0 컬러 사용 규칙 (Strict)

- ❌ **하드코딩된 색상 값 절대 금지**: `#FBC02D`, `#ffffff`, `rgba(0,0,0,0.5)` 등 직접 사용 금지
- ✅ **반드시 `_variables.scss`에 정의된 변수 사용**

  ```scss
  // ❌ 잘못된 예
  color: #fbc02d;
  background: #ffffff;
  border: 1px solid #e5e5e5;

  // ✅ 올바른 예
  @use '../../../styles/variables' as v;
  color: v.$primary;
  background: v.$white;
  border: 1px solid v.$grey-200;
  ```

- **주요 컬러 변수**:
  - Primary: `v.$primary` (`#FBC02D`)
  - Text: `v.$text-primary`, `v.$text-secondary`, `v.$text-tertiary`
  - Background: `v.$white`, `v.$grey-50`, `v.$grey-100`
  - Border: `v.$grey-200`, `v.$grey-300`
  - Status: `v.$color-success`, `v.$color-error`, `v.$color-warning`
- **타이포그래피 변수**: `v.$font-size-sm`, `v.$font-size-base`, `v.$font-size-xl` 등
- **간격/레이아웃 변수**: `v.$radius-md`, `v.$shadow-lg`, `v.$transition-200` 등
- **미디어 쿼리**: `v.$mobile`, `v.$tablet` 사용

#### 4.0.1 SCSS 변수/믹스인 존재 확인 (MANDATORY)

- ❌ **존재하지 않는 변수/믹스인 사용 절대 금지**
- ✅ **SCSS 변수나 믹스인을 사용하기 전에 반드시 `src/styles/_variables.scss` 파일을 검색(grep)하여 해당 변수가 실제로 정의되어 있는지 확인**
- ✅ **변수가 존재하지 않으면**: `_variables.scss`에 새로 정의하거나, 이미 존재하는 유사한 변수를 사용
- ✅ **새 SCSS 파일을 작성하거나 기존 파일을 수정할 때**, 사용하는 모든 `v.$*` 변수가 실제로 존재하는지 반드시 검증
- 이 규칙을 어기면 빌드 에러가 발생하므로, **추측으로 변수명을 사용하지 말 것**

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

### 5. 코드 품질

- TypeScript strict 모드 필수
- ESLint 규칙 준수
- 빌드 에러 없이 커밋

**Shadcn CLI 사용 시**

```bash
npx shadcn@latest add [component]
# 이후 반드시:
# 1. ComponentName 폴더로 이동
# 2. ComponentName.tsx / ComponentName.module.scss / index.ts 구조로 리팩토링
# 3. Tailwind 코드를 SCSS Modules로 이전
```

### 6. Git & Commit Convention (Strict)

- **한글 사용 필수**: 커밋 메시지 생성(Generation) 시 반드시 **한글**을 사용합니다.
- **컨벤션**: [Conventional Commits](https://www.conventionalcommits.org/) 형식을 따릅니다.
  - 예: `feat: 새로운 기능 추가`, `fix: 버그 수정`, `refactor: 코드 리팩토링`

### 7. 모달/드로어 aria-hidden 충돌 방지 (Built-in)

**문제**: Radix UI/Vaul은 모달이 열릴 때 백그라운드에 `aria-hidden="true"`를 적용하지만, 트리거 버튼이 포커스를 유지하면 접근성 충돌 발생

**해결 (이미 적용됨)**: 공통 컴포넌트(`DialogContent`, `DrawerContent`)에서 열릴 때 자동으로 `onOpenAutoFocus` 처리

```tsx
// 🔑 공통 컴포넌트에 이미 구현됨 - 별도 처리 불필요
const handleOpenAutoFocus = (event: Event) => {
  event.preventDefault();
  // 내부의 첫 번째 포커스 가능한 요소로 포커스 이동
  const focusableElements = contentRef.current?.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (focusableElements?.length) {
    (focusableElements[0] as HTMLElement).focus();
  }
};
```
