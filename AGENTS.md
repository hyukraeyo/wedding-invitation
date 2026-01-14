# AGENTS.md

Guidance for agentic coding agents working in `wedding-invitation`.
This file consolidates repo conventions plus Cursor rules from `.cursorrules`.

## Build/Lint/Test Commands

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

## Project Overview

- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS + TDS Mobile design system base
- **State**: Zustand (client), TanStack Query (server)
- **Testing**: Vitest + React Testing Library

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

### Next.js 16+ Official Patterns (STRICT)
- **Server Components Only for Data**: ALWAYS fetch data in Server Components directly from the DB.
- **No Client Fetching**: Do NOT use `useEffect` or client-side generic fetch for initial data.
- **Server Actions for Mutations**: Use Server Actions (`'use server'`) for form submissions and data updates. Do NOT create API routes for these.
- **Direct DB Access**: In Server Components, call the DB/Service layer directly. Do NOT `fetch` your own API routes.

### Reuse First (Critical)
- Search for existing components before creating new ones.
- If patterns repeat, refactor into shared components.
- DRY is mandatory; do not duplicate UI patterns.

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
- **Components**: PascalCase (`UserProfile.tsx`)
- **Files/Folders**: kebab-case (`user-profile.tsx`)
- **Functions/Variables**: camelCase (`getUserData`)
- **Types/Interfaces**: PascalCase (`ApiResponse`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)

### TypeScript Usage
- Strict mode is enforced; avoid `any`.
- Use `interface` for object shapes and component props.
- Use `type` for unions, intersections, and mapped types.
- Define props explicitly and avoid `React.FC`.

```ts
interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function Button({ onClick, disabled = false }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled} />;
}
```

### React + Next.js Patterns
- Server components by default.
- `'use client'` only for hooks, browser APIs, or interactivity.
- Use `ErrorBoundary` for client-side error recovery.
- Use Next.js `<Image>` for image optimization.
- Use memoization (`React.memo`, `useMemo`, `useCallback`) to reduce re-renders.

## Error Handling

### API Routes
Use structured error responses with status codes:

```ts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = schema.parse(body);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Client Components
Wrap risky UI with `ErrorBoundary`:

```tsx
<ErrorBoundary fallback={<ErrorFallback />}>
  <ComponentThatMightError />
</ErrorBoundary>
```

## Testing Guidelines

- Place tests in `__tests__` folders or `*.test.tsx` files.
- Use `@/test-utils` for configured providers.
- Test behavior, not implementation details.
- Prefer `getByRole`/`getByText` over selectors.
- Mock external APIs and browser APIs when needed.

```ts
import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## Commit Message Format

```
type(scope): description

feat(auth): add login modal
fix(api): handle validation errors
refactor(state): extract hook
```

- Always include a type prefix.
- Use lowercase and keep subject <= 50 chars.
