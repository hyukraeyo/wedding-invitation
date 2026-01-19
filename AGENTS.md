# AGENTS.md

Guidance for agentic coding agents working in `wedding-invitation`.
This file consolidates repo conventions plus Cursor rules from `.cursorrules`.

> **CRITICAL: SYNC MANDATE**
> 모든 설정 및 가이드 문서(`.agent`, `.codex`, `.cursor`, `.opencode`, `.cursorrules`, `AGENTS.md`, `README.md`, `ARCHITECTURE.md`)는 항상 동일한 기준을 유지하도록 함께 업데이트되어야 합니다. 한 곳의 규칙이 변경되면 언급된 모든 파일에 해당 변경 사항을 명시하고 동기화하십시오.

## Build / Lint / Test Commands

```bash
# Development
npm run dev                # Start dev server at http://localhost:3000
npm run build              # Production build (includes type checking)
npm run start              # Start production server

# Code Quality
npm run lint               # Run ESLint
npm run analyze            # Analyze bundle size (ANALYZE=true npm run build)

# Testing
npm run test               # Run all tests (Vitest)
npm run test:watch         # Watch mode for development
npm run test:ui            # Open Vitest UI
npm run test:coverage      # Generate coverage report
```

## Core Standards (from `.cursorrules`)

### Styling: Strict SCSS Modules
- **SCSS Modules are mandatory** for all components.
- **Tailwind CSS is prohibited** within components to maintain design consistency.
- Use `@use "@/styles/variables" as v;` for design tokens.

### Naming: PascalCase Folders & Files
- **Component Folders/Files**: Use **PascalCase** (e.g., `src/components/ui/Button/Button.tsx`).
- **Hybrid Pattern**: Every component folder must have a `ComponentName.tsx`, `ComponentName.module.scss`, and `index.ts`.

### Mobile-First UX (Top Priority)
- Design for mobile first (Portrait mode).
- Premium iOS-like animations (`cubic-bezier(0.16, 1, 0.3, 1)`).
- Use `ResponsiveModal` for dialogs.

### Next.js 16+ Patterns (Strict)
- Server components are default.
- Fetch initial data in server components; no client-side `useEffect` fetches on page load.
- Use Server Actions (`'use server'`) for mutations.
- Direct DB access from server components; no internal `fetch('/api')`.

### Reuse First (Critical)
- Search for existing components before creating new ones.
- Refactor repeated patterns into shared components.
- DRY is mandatory.

## Project Overview
- Framework: Next.js 16.1.1 (App Router)
- Language: TypeScript 5 (strict mode)
- Styling: SCSS Modules + TDS Mobile (Toss Style)
- State: Zustand (client), TanStack Query (server)
- Database: Supabase (Remote CLI)

## Naming Conventions
- Components: PascalCase (`UserProfile.tsx`)
- Folders: PascalCase (`src/components/ui/UserProfile/`)
- Functions/Variables: camelCase (`getUserData`)
- Types/Interfaces: PascalCase (`ApiResponse`)
- Constants: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)

## TypeScript Usage
- Strict mode is enforced; avoid `any`.
- Define props explicitly and avoid `React.FC`.
- Prefer explicit return types for exported helpers.
