# AGENTS.md

Guidance for agentic coding agents working in `wedding-invitation`.
This file consolidates repo conventions plus Cursor rules from `.cursorrules`.

> **CRITICAL: SYNC MANDATE**
> 모든 설정 및 가이드 문서(`.agent`, `.codex`, `.cursor`, `.opencode`, `.cursorrules`, `AGENTS.md`, `README.md`, `ARCHITECTURE.md`)는 항상 동일한 기준을 유지하도록 함께 업데이트되어야 합니다. 한 곳의 규칙이 변경되면 언급된 모든 파일에 해당 변경 사항을 명시하고 동기화하십시오.

## Build / Lint / Test Commands

```bash
# Development
npm run dev                # Start dev server at http://localhost:3000
npm run dev:turbo          # Start dev server with Turbo
npm run build              # Production build (includes type checking)
npm run start              # Start production server

# Code Quality
npm run lint               # Run ESLint (uses @typescript-eslint/parser)
npm run analyze            # Analyze bundle size (ANALYZE=true npm run build, opens analyzer UI)

# Testing (Vitest + jsdom)
npm run test               # Run all tests
npm run test -- path/to/test.test.ts  # Run single test file
npm run test:watch         # Watch mode for development
npm run test:ui            # Open Vitest UI
npm run test:coverage      # Generate coverage report (v8 provider)
```

## Core Standards (from `.cursorrules`)

### 🎨 Styling: Strict SCSS Modules
- **SCSS Modules mandatory**: All components must use `.module.scss` files
- **Tailwind CSS prohibited**: Maintains design consistency across project
- **TDS Mobile Design System**: Based on Toss Design System Mobile aesthetics
- **Design tokens**: Use `@use "@/styles/variables" as v;` and `@use "@/styles/mixins" as m;`
- **Primary color**: Banana yellow `#FBC02D` (theme identity)
- **Color variables**: Use semantic variables like `$color-primary`, `$color-bg-page`, etc.

### 📁 Naming: PascalCase Folders & Files
- **Component structure**: Mandatory hybrid pattern:
  ```
  ComponentName/
  ├── ComponentName.tsx        # Component logic
  ├── ComponentName.module.scss # SCSS modules styling
  └── index.ts                # Re-export (export * from './ComponentName')
  ```
- **Folder/File names**: PascalCase (`src/components/ui/Button/Button.tsx`)
- **Functions/Variables**: camelCase (`getUserData`, `isLoading`)
- **Types/Interfaces**: PascalCase (`ApiResponse`, `UserProfile`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)

### 📱 Mobile-First UX (Top Priority)
- **Mobile first design**: Portrait mode priority
- **Premium animations**: iOS-style `cubic-bezier(0.16, 1, 0.3, 1)`
- **Responsive patterns**: Use `ResponsiveModal` for Desktop↔Mobile dialog conversion
- **Device detection**: Use `isMobile()`, `isIOS()`, `isAndroid()` utils

### 🚀 Next.js 16+ Patterns (Strict)
- **Server components default**: Data fetching in server components
- **No client fetches on load**: Prohibit `useEffect` + `fetch` on initial page load
- **Server Actions**: All mutations use `'use server'` directive
- **Direct DB access**: Supabase service layer, no internal API routes
- **App Router**: Use Next.js 16.1.1 App Router patterns

## Code Style Guidelines

### Import Organization
```typescript
// 1. React imports
import React from 'react';

// 2. External libraries (alphabetical)
import { clsx } from 'clsx';
import * as TogglePrimitive from '@radix-ui/react-toggle';

// 3. Internal imports (alphabetical by path)
import { cn } from '@/lib/utils';
import { profileService } from '@/services/profileService';
import styles from './ComponentName.module.scss';
```

### TypeScript Patterns
- **Strict mode enforced**: No `any`, use proper typing
- **Explicit props**: Define interfaces, avoid `React.FC`
- **Return types**: Use explicit returns for exported functions
- **Utility types**: Use generics with proper constraints
- **Type guards**: Implement for complex type narrowing

### Component Structure
```typescript
"use client"; // when needed

import React from 'react';
import { cn } from '@/lib/utils';
import styles from './ComponentName.module.scss';

interface ComponentNameProps {
  // Define props explicitly
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

/**
 * Component description following TDS design patterns
 * Based on Radix UI for accessibility when applicable
 */
export const ComponentName = React.forwardRef<
  HTMLButtonElement,
  ComponentNameProps
>(({
  children,
  className,
  disabled = false,
  ...props
}, ref) => {
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

ComponentName.displayName = "ComponentName";
export default ComponentName;
```

### Error Handling
- **Server errors**: Use proper error boundaries and toast notifications
- **Async errors**: Use try-catch with proper error typing
- **Validation**: Use Zod schemas for runtime validation
- **User feedback**: Use `sonner` toast notifications for user actions

### Testing Patterns (Vitest + Testing Library)
```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from '@/components/ui/ComponentName';

describe('ComponentName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render correctly', () => {
    render(<ComponentName>Test</ComponentName>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

## Project Architecture

### Technology Stack
- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: SCSS Modules + TDS Mobile design system
- **State Management**: Zustand (client), TanStack Query (server state)
- **Database**: Supabase (Remote CLI, no local Docker)
- **UI Components**: Radix UI primitives + custom styling
- **Testing**: Vitest + Testing Library + jsdom
- **Build**: Webpack (not Turbopack for production)

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
├── styles/           # Global SCSS files and design tokens
└── constants/        # Application constants
```

### Performance Guidelines
- **Code splitting**: Use dynamic imports for heavy components
- **Image optimization**: Use Next.js Image component
- **Bundle analysis**: Run `npm run analyze` before production
- **Server components**: Prefer for static content and data fetching
- **Client components**: Only when interactivity needed

### Accessibility Standards
- **ARIA attributes**: Follow Radix UI patterns
- **Keyboard navigation**: Test with tab navigation
- **Screen readers**: Use semantic HTML and proper labeling
- **Focus management**: Implement focus traps in modals
- **Color contrast**: Follow WCAG AA standards

## Critical Development Rules

1. **Reuse First**: Always search existing components before creating new ones
2. **Mobile Priority**: Design for mobile first, then enhance for desktop
3. **Type Safety**: Maintain strict TypeScript configuration
4. **Performance**: Optimize bundle size and loading performance
5. **Testing**: Write tests for critical user flows and utilities
6. **Accessibility**: Ensure keyboard navigation and screen reader support
7. **Error Boundaries**: Implement proper error handling at component level
8. **Design Consistency**: Follow TDS Mobile design principles strictly
