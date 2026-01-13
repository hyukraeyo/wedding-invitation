# AGENTS.md

This guide is for agentic coding agents working in the wedding-invitation repository.

## Build/Lint/Test Commands

### Essential Commands

```bash
# Development
npm run dev                # Start dev server at http://localhost:3000
npm run build              # Production build (includes type checking)
npm run start              # Start production server

# Code Quality
npm run lint               # Run ESLint
npm run analyze            # Analyze bundle size (ANALYZE=true npm run build)

# Testing
npm run test               # Run all tests
npm run test:watch         # Watch mode for development
npm run test:ui            # Open Vitest UI
npm run test:coverage      # Generate coverage report
```

### Running a Single Test

```bash
# Run specific test file
npm run test -- src/app/__tests__/page.test.tsx

# Run tests matching pattern
npm run test -- --reporter=verbose src/components/common/__tests__

# Run test matching name
npm run test -- -t "renders main heading"
```

## Project Overview

- **Framework**: Next.js 16.1.1 with App Router
- **Language**: TypeScript 5.0+ (strict mode enabled)
- **Styling**: Tailwind CSS 4.0+ with TDS Mobile design system base
- **State**: Zustand 5.0+ for client, TanStack Query for server
- **Database/Auth**: Supabase
- **Testing**: Vitest + React Testing Library

## Code Style Guidelines

### Next.js 16 App Router Patterns

**Server Components First**: Default to server components. Only add `'use client'` when needed for:
- Interactivity (onClick, onChange, etc.)
- Browser APIs (window, localStorage, etc.)
- State management hooks (useState, useEffect)
- Context providers

**Data Fetching**: Perform API calls in server components to reduce client bundle size.

```typescript
// Server component (default)
export default async function MyPage() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

```typescript
// Client component (with directive)
'use client';
import { useState } from 'react';

export default function InteractiveComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Imports and Path Aliases

Use path aliases for cleaner imports:

```typescript
import { Component } from '@/components/common/Component';
import { utility } from '@/lib/utils';
import { CustomType } from '@/types/common';
import { useCustomHook } from '@/hooks/useCustomHook';
import { CONSTANT } from '@/constants';
```

Available aliases:
- `@/*` → `./src/*`
- `@/components/*` → `./src/components/*`
- `@/lib/*` → `./src/lib/*`
- `@/types/*` → `./src/types/*`
- `@/store/*` → `./src/store/*`
- `@/hooks/*` → `./src/hooks/*`
- `@/constants/*` → `./src/constants/*`

### Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`, `Button.tsx`)
- **Files/Folders**: kebab-case (`user-profile.tsx`, `api-routes/`)
- **Functions/Variables**: camelCase (`getUserData`, `userName`)
- **Types/Interfaces**: PascalCase (`User`, `ApiResponse`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)

```typescript
// Component file: UserProfile.tsx
export function UserProfile({ user }: { user: User }) {
  return <div>{userName}</div>;
}

// Utility function: formatDate.ts
export function formatDate(date: Date): string { }

// Type definition: types/common.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
```

### TypeScript Guidelines

**Strict Mode**: All strict flags enabled in tsconfig.json.

**Interface vs Type**:
- Use `interface` for object shapes and component props
- Use `type` for unions, intersections, and mapped types

```typescript
// Interface for component props
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

// Type for union types
type Theme = 'light' | 'dark' | 'auto';

// Type for mapped types
type PartialUser = Partial<User>;
```

**Component Props**: Define props explicitly without `React.FC`:

```typescript
interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function Button({ onClick, disabled = false }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled} />;
}
```

### Styling Guidelines

**Tailwind CSS**: Use utility classes. Combine with `cn()` for dynamic classes:

```typescript
import { cn } from '@/lib/utils';

export function Button({ className, ...props }: ButtonProps) {
  return (
    <button className={cn("bg-primary text-white", className)} {...props} />
  );
}
```

**shadcn/ui Components**: Use existing components from `@/components/ui/`. Reference official docs: https://ui.shadcn.com/docs/components

**TDS Mobile Base**: Refer to TDS design system for spacing, colors, typography patterns:
- https://tossmini-docs.toss.im/tds-mobile/foundation/colors/
- https://tossmini-docs.toss.im/tds-mobile/foundation/typography/

### Error Handling

**API Routes**: Use structured error responses with status codes:

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validate with Zod
    const validated = schema.parse(body);

    // Return success
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

**Client Components**: Wrap with ErrorBoundary for graceful error recovery:

```typescript
<ErrorBoundary fallback={<ErrorFallback />}>
  <ComponentThatMightError />
</ErrorBoundary>
```

### Testing Guidelines

**Test Structure**: Place test files alongside source files using `__tests__` directory or `.test.tsx`/`.spec.tsx` suffix:

```
src/
  components/
    common/
      ErrorBoundary.tsx
      __tests__/
        ErrorBoundary.test.tsx
```

**Testing Utilities**: Import from `@/test-utils` for pre-configured providers:

```typescript
import { render, screen } from '@/test-utils';
import { describe, it, expect } from 'vitest';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

**Best Practices**:
- Test user behavior, not implementation details
- Use semantic queries (`getByRole`, `getByText`) over CSS selectors
- Mock external dependencies (APIs, browser APIs)
- Avoid testing third-party library components

### Component Reuse (CRITICAL)

Before creating new UI or features:
1. Search existing codebase for similar components (grep, glob)
2. Reuse existing components (buttons, modals, forms, etc.)
3. If similar patterns exist, refactor to common component
4. DRY principle is mandatory

Example: Always reuse shadcn/ui components and builder components instead of creating duplicates.

### Additional Cursor Rules

**Mobile-First**: All features must be optimized for mobile experience first.

**Single Responsibility**: Keep components under 200 lines with one clear purpose.

**Memorization**: Use `React.memo`, `useMemo`, `useCallback` to prevent unnecessary re-renders.

**Performance**: Optimize images with Next.js `<Image>` component, use dynamic imports for heavy components.

**Accessibility**: Include ARIA attributes, keyboard navigation support, proper labels.

### Commit Message Format

```
type(scope): description

feat(auth): add login modal
fix(api): handle validation errors
docs(readme): update deployment guide
style(css): fix indentation
refactor(state): extract hook
test(components): add ErrorBoundary tests
chore(deps): update dependencies
```

Always include type prefix. Use lowercase, 50 chars max for subject.
