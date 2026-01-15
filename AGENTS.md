# AGENTS.md

Guidance for agentic coding agents working in `wedding-invitation`.
This file consolidates repo conventions plus Cursor rules from `.cursorrules`.

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

### Run a Single Test

```bash
# Run a specific test file
npm run test -- src/app/__tests__/page.test.tsx

# Run tests matching pattern
npm run test -- --reporter=verbose src/components/common/__tests__

# Run test matching name
npm run test -- -t "renders main heading"
```

## Cursor Rules (from `.cursorrules`)

### Mobile-First UX (Top Priority)
- Design for mobile first, including layout and performance.
- Ensure responsive behavior across common devices.
- Keep UI/UX quality high without compromise.

### Design System: TDS Mobile (Required)
- Follow TDS colors and typography references.
- Reuse TDS-style components (buttons, inputs, modals, toasts).
- Customize only within TDS spacing/rounding/shadow constraints.

### shadcn/ui Best Practices
- Prefer `@/components/ui` components.
- Maintain accessibility defaults and add ARIA when needed.
- Avoid unnecessary re-renders in component usage.

### Next.js 16+ Official Patterns (Strict)
- Server components are default; only use client components for interactivity.
- Fetch initial data in server components; no client-side `useEffect` fetches.
- Use Server Actions (`'use server'`) for mutations; avoid extra API routes.
- Direct DB/service layer access from server components; no `fetch('/api')`.
- Use `Suspense` and `loading.tsx` for streaming.

### Reuse First (Critical)
- Search for existing components before creating new ones.
- Refactor repeated patterns into shared components.
- DRY is mandatory; avoid duplicating UI patterns.

## Project Overview
- Framework: Next.js 16.1.1 (App Router)
- Language: TypeScript 5 (strict mode)
- Styling: Tailwind CSS + TDS Mobile design system base
- State: Zustand (client), TanStack Query (server)
- Testing: Vitest + React Testing Library

## Supabase Remote CLI (No Docker)
- Local Docker is not used; connect directly to remote Supabase.
- In non-interactive environments, `npx supabase login` fails, use tokens.

```bash
export SUPABASE_ACCESS_TOKEN=...
export SUPABASE_DB_PASSWORD=...

npx supabase link --project-ref <project-ref>
npx supabase db push
```

## Code Style Guidelines

### Imports and Path Aliases
Use path aliases for clarity:

```ts
import { Component } from '@/components/common/Component';
import { utility } from '@/lib/utils';
import { CustomType } from '@/types/common';
import { useCustomHook } from '@/hooks/useCustomHook';
import { CONSTANT } from '@/constants';
```

### Formatting
- Follow existing file formatting and ESLint rules.
- Keep components under 200 lines with a single responsibility.
- Avoid adding inline comments unless explicitly requested.

### Naming Conventions
- Components: PascalCase (`UserProfile.tsx`)
- Files/Folders: kebab-case (`user-profile.tsx`)
- Functions/Variables: camelCase (`getUserData`)
- Types/Interfaces: PascalCase (`ApiResponse`)
- Constants: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)

### TypeScript Usage
- Strict mode is enforced; avoid `any`.
- Use `interface` for object shapes and component props.
- Use `type` for unions, intersections, and mapped types.
- Define props explicitly and avoid `React.FC`.
- Prefer explicit return types for exported helpers.

### React + Next.js Patterns
- Server components by default.
- `'use client'` only for hooks, browser APIs, or interactivity.
- Data fetching stays in server components; no client-side fetch on initial render.
- Use Server Actions for mutations.
- Use `<Image>` for images and memoize expensive components.
- Wrap risky UI with `ErrorBoundary`.

## Error Handling
- Prefer structured errors with status codes in API handlers.
- Handle Zod validation errors explicitly.
- Log unexpected errors server-side with context.

```ts
return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
```

## Testing Guidelines
- Place tests in `__tests__` folders or `*.test.tsx` files.
- Use `@/test-utils` for configured providers.
- Test behavior, not implementation details.
- Prefer `getByRole`/`getByText` over selectors.
- Mock external APIs and browser APIs when needed.

## Performance & Accessibility
- Minimize client components to reduce hydration cost.
- Use memoization to reduce unnecessary re-renders.
- Ensure keyboard navigation and meaningful ARIA labels.
- Prefer `loading.tsx` + `Suspense` for perceived performance.
- Keep bundle size in check with `npm run analyze`.
