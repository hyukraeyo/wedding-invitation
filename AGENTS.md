# AGENTS.md

Guidance for agentic coding agents working in `wedding-invitation`.

> **CRITICAL: SYNC MANDATE**
> All guide docs (`.cursorrules`, `AGENTS.md`, `README.md`) must stay in sync. Update all when changing rules.

## Build / Lint / Test Commands

```bash
# Development
npm run dev                # Start dev server (Turbo) at http://localhost:3000
npm run build              # Production build with webpack + type checking
npm run start              # Start production server

# Code Quality
npm run lint               # Run ESLint
npm run lint:fix           # Run ESLint with auto-fix
npm run type-check         # Run TypeScript compiler (no emit)
npm run analyze            # Bundle size analysis
npm run clean              # Clean .next, out, dist directories
```

## Core Standards

### 🎨 Styling: Strict SCSS Modules

- **SCSS Modules mandatory**: All components use `.module.scss` files
- **Tailwind CSS prohibited**: Maintains design consistency
- **Radix UI First**: Use **Radix UI Primitives** for all UI components
- **No direct UI style edits**: Do not modify UI component styles directly; keep consistency via shared tokens/variants or new components
- **Design tokens**: Use `@use "@/styles/variables" as v;` and `@use "@/styles/mixins" as m;`. 모든 스타일 값(색상, 패딩, 폰트 사이즈, 마진 등)은 하드코딩 금지, 검색 필수.
- **Primary color**: Banana yellow `#FBC02D`

### 📁 Naming: PascalCase Folders & Files

- **Component structure** (mandatory):
  ```
  ComponentName/
  ├── ComponentName.tsx
  ├── ComponentName.module.scss
  └── index.ts
  ```
- **Folder/File names**: PascalCase (`src/components/ui/Button/Button.tsx`)
- **Functions/Variables**: camelCase (`getUserData`, `isLoading`)
- **Types/Interfaces**: PascalCase (`ApiResponse`, `UserProfile`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)

### 📱 Mobile-First UX

- **Mobile first**: Portrait mode priority
- **Animations**: iOS-style `cubic-bezier(0.16, 1, 0.3, 1)`
- **Device utils**: Use `isMobile()`, `isIOS()`, `isAndroid()`

### 🚀 Next.js 16+ Patterns

- **Server components default**: Data fetching in server components
- **No client fetches on load**: Prohibit `useEffect` + `fetch` on initial load
- **Server Actions**: All mutations use `'use server'`
- **Direct DB access**: Supabase service layer, no internal API routes
- **Cache Components (PPR)**: Use `use cache` for cacheable server components/functions, wrap dynamic UI in `Suspense`
- **View Transitions**: Keep transitions compatible with navigation updates
- **React Compiler**: Prefer compiler-driven memoization over manual `useMemo`/`React.memo`
- **App Router**: Next.js 16.1.x patterns

### Latest Platform Guidance (React 19.2 + Next 16)

- **Target versions**: React/ReactDOM 19.2.x, Next.js 16.1.x (keep latest patch)
- **React 19.2 APIs**: Prefer `<Activity />`, `useEffectEvent`, `cacheSignal` (RSC) when appropriate
- **Caching APIs**: Use `revalidateTag`, `updateTag`, `refresh` for on-demand cache updates
- **Turbopack dev**: Use `npm run dev` (Turbo) for fastest local iteration
- **Webpack prod**: Keep `npm run build` with webpack for current production parity

## Code Style Guidelines

### Import Organization

```typescript
// 1. React imports
import * as React from 'react';

// 2. External libraries (alphabetical)
import { clsx } from 'clsx';
import * as DialogPrimitive from '@radix-ui/react-dialog';

// 3. Internal imports (alphabetical by path)
import { cn } from '@/lib/utils';
import styles from './ComponentName.module.scss';
```

### TypeScript Patterns

- **Strict mode**: No `any`, proper typing required
- **Explicit props**: Define interfaces, avoid `React.FC`
- **Type guards**: Implement for complex type narrowing

### Component Structure

```typescript
'use client'; // when needed

import * as React from 'react';
import { cn } from '@/lib/utils';
import styles from './ComponentName.module.scss';

interface ComponentNameProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const ComponentName = React.forwardRef<
  HTMLButtonElement,
  ComponentNameProps
>(({ children, className, disabled = false, ...props }, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(styles.container, className)}
      {...props}
    >
      {children}
    </button>
  );
});

ComponentName.displayName = 'ComponentName';
export default ComponentName;
```

### Error Handling

- Use `sonner` toast notifications for user actions
- Use Zod for runtime validation
- Proper error boundaries

## Project Architecture

### Technology Stack

- **Framework**: Next.js 16.1.x (App Router, Cache Components, View Transitions)
- **Library**: React 19.2.x
- **Language**: TypeScript 5 (strict mode)
- **Styling**: SCSS Modules + Radix UI Primitives
- **State**: Zustand (client), TanStack Query (server)
- **Database**: Supabase (Remote CLI)
- **UI**: Radix UI Primitives + TDS Style
- **Build**: Webpack (production), Turbopack (dev)

### Key Directories

```
src/
├── components/
│   ├── ui/           # Reusable UI components (Radix-based)
│   ├── common/       # Shared business components
│   ├── auth/         # Authentication components
│   ├── builder/      # Invitation builder components
│   ├── mypage/       # User dashboard components
│   └── preview/      # Invitation preview components
├── lib/              # Utilities and configurations
├── services/         # Data service layers
├── store/            # Zustand stores
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
├── styles/           # Global SCSS and design tokens
└── constants/        # Application constants
```

## Critical Development Rules

1. **Reuse First**: Search existing components before creating new ones
2. **Mobile Priority**: Design for mobile first, enhance for desktop
3. **Type Safety**: Strict TypeScript, no `any`
4. **Git Commits**: Always in **Korean** following Conventional Commits
   - Format: `type: message in Korean` (e.g., `feat: 로그인 기능 추가`)
5. **Strict Styling**: 모든 스타일링 수치(Padding, Margin, Font-size, Color 등)는 하드코딩하지 말고 반드시 `styles/` 폴더 내 토큰 검색 후 사용.
