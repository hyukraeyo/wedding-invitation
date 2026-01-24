# 🧪 바나나웨딩 테스트 전략 가이드

본 문서는 바나나웨딩 프로젝트의 테스트 전략, 도구 사용법, 그리고 품질 보증을 위한 모범 사례를 정의합니다.

---

## 1. 테스트 전략 개요

### 🎯 테스트 피라미드

```
        ▲ E2E Tests (작은 비중)
       / ▲ \
      / ▲▲▲ \
     /________\  ← Cypress/Playwright
    Integration Tests (중간 비중)
   /          \
  /            \
 /______________\  ← Vitest + Testing Library
/ Unit Tests (가장 큰 비중)
/________________\
```

### 📊 테스트 커버리지 목표
- **Unit Tests**: 80% 이상
- **Integration Tests**: 핵심 기능 100%
- **E2E Tests**: 주요 사용자 플로우 100%

---

## 2. 테스팅 도구 및 설정

### 🛠️ 기술 스택

#### 핵심 도구
- **Vitest**: 빠른 유닛 테스트 프레임워크
- **Testing Library**: React 컴포넌트 테스트
- **jsdom**: Node.js 환경에서 DOM 시뮬레이션
- **MSW**: API Mocking
- **Cypress**: E2E 테스트
- **Storybook**: 컴포넌트 시각적 테스트

#### 추가 도구
- **@testing-library/jest-dom**: DOM 어서션 확장
- **@testing-library/user-event**: 사용자 이벤트 시뮬레이션
- **vitest-coverage-v8**: 커버리지 리포트
- **@vitest/ui**: 시각적 테스트 인터페이스

### ⚙️ 초기 설정

#### vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'src/mocks/'
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

#### 테스트 설정 파일 (src/test/setup.ts)
```typescript
import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from './server'

// MSW 서버 시작
beforeAll(() => server.listen())

// 각 테스트 후 핸들러 리셋
afterEach(() => server.resetHandlers())

// 테스트 종료 후 서버 종료
afterAll(() => server.close())

// 전역 객체 설정
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
```

---

## 3. 유닛 테스팅

### 🧩 컴포넌트 테스트

#### 기본 컴포넌트 테스트
```typescript
// src/components/ui/Button/Button.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies correct styles for variant', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('destructive')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })
})
```

#### 복잡 컴포넌트 테스트 (InvitationCanvas)
```typescript
// src/components/preview/InvitationCanvas.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InvitationCanvas } from './InvitationCanvas'
import { useInvitationStore } from '@/store/useInvitationStore'

// Mock Zustand store
vi.mock('@/store/useInvitationStore', () => ({
  useInvitationStore: vi.fn()
}))

const mockUseInvitationStore = vi.mocked(useInvitationStore)

describe('InvitationCanvas', () => {
  beforeEach(() => {
    mockUseInvitationStore.mockReturnValue({
      invitation: {
        id: '1',
        title: '초대합니다',
        bride_name: '김신부',
        groom_name: '이신랑',
        date: '2024-06-15',
        location: '서울',
        theme: 'rose'
      },
      updateInvitation: vi.fn()
    })
  })

  it('displays wedding invitation details', () => {
    render(<InvitationCanvas />)
    
    expect(screen.getByText('초대합니다')).toBeInTheDocument()
    expect(screen.getByText('김신부 & 이신랑')).toBeInTheDocument()
    expect(screen.getByText('2024년 6월 15일')).toBeInTheDocument()
    expect(screen.getByText('서울')).toBeInTheDocument()
  })

  it('applies correct theme styles', () => {
    render(<InvitationCanvas />)
    
    const canvas = screen.getByTestId('invitation-canvas')
    expect(canvas).toHaveClass('theme-rose')
  })

  it('shows loading state when invitation data is not available', () => {
    mockUseInvitationStore.mockReturnValue({
      invitation: null,
      updateInvitation: vi.fn()
    })
    
    render(<InvitationCanvas />)
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()
  })
})
```

### 🔧 유틸리티 함수 테스트

#### 날짜 유틸리티 테스트
```typescript
// src/lib/dateUtils.test.ts
import { describe, it, expect } from 'vitest'
import { formatDate, calculateDaysUntil, formatKoreanDate } from './dateUtils'

describe('dateUtils', () => {
  it('formats date correctly', () => {
    const date = new Date('2024-06-15')
    expect(formatDate(date)).toBe('2024-06-15')
  })

  it('calculates days until wedding', () => {
    const weddingDate = new Date()
    weddingDate.setDate(weddingDate.getDate() + 10)
    
    expect(calculateDaysUntil(weddingDate)).toBe(10)
  })

  it('formats Korean date correctly', () => {
    const date = new Date('2024-06-15')
    expect(formatKoreanDate(date)).toBe('2024년 6월 15일')
  })

  it('handles past dates correctly', () => {
    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - 5)
    
    expect(calculateDaysUntil(pastDate)).toBe(-5)
  })
})
```

---

## 4. 통합 테스팅

### 🔗 컴포넌트 통합 테스트

#### 폼 제출 테스트
```typescript
// src/components/builder/EditorForm.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditorForm } from './EditorForm'
import * as invitationActions from '@/app/actions/invitations'

// Mock server actions
vi.mock('@/app/actions/invitations', () => ({
  updateInvitation: vi.fn()
}))

const mockUpdateInvitation = vi.mocked(invitationActions.updateInvitation)

describe('EditorForm Integration', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    mockUpdateInvitation.mockResolvedValue({
      id: '1',
      title: 'Updated Title'
    })
  })

  it('updates invitation when form is submitted', async () => {
    render(<EditorForm invitationId="1" />)
    
    // 폼 필드 찾기
    const titleInput = screen.getByLabelText('청첩장 제목')
    const brideNameInput = screen.getByLabelText('신부 이름')
    const groomNameInput = screen.getByLabelText('신랑 이름')
    
    // 폼 데이터 입력
    await user.clear(titleInput)
    await user.type(titleInput, '결혼합니다')
    
    await user.clear(brideNameInput)
    await user.type(brideNameInput, '김신부')
    
    await user.clear(groomNameInput)
    await user.type(groomNameInput, '이신랑')
    
    // 폼 제출
    await user.click(screen.getByRole('button', { name: '저장' }))
    
    // 서버 액션 호출 확인
    await waitFor(() => {
      expect(mockUpdateInvitation).toHaveBeenCalledWith('1', expect.any(FormData))
    })
  })

  it('displays validation errors for invalid inputs', async () => {
    render(<EditorForm invitationId="1" />)
    
    const titleInput = screen.getByLabelText('청첩장 제목')
    await user.clear(titleInput) // 빈 값으로 설정
    
    await user.click(screen.getByRole('button', { name: '저장' }))
    
    await waitFor(() => {
      expect(screen.getByText('제목은 필수 입력값입니다.')).toBeInTheDocument()
    })
    
    expect(mockUpdateInvitation).not.toHaveBeenCalled()
  })
})
```

#### API 통합 테스트
```typescript
// src/services/invitationService.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { invitationService } from './invitationService'

const server = setupServer(
  rest.get('/api/invitations/:id', (req, res, ctx) => {
    const { id } = req.params
    if (id === '1') {
      return res(
        ctx.json({
          id: '1',
          title: '초대합니다',
          bride_name: '김신부',
          groom_name: '이신랑'
        })
      )
    }
    return res(ctx.status(404))
  }),
  
  rest.post('/api/invitations', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: '2',
        ...req.body
      })
    )
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('invitationService Integration', () => {
  it('fetches invitation by id', async () => {
    const invitation = await invitationService.getById('1')
    
    expect(invitation).toEqual({
      id: '1',
      title: '초대합니다',
      bride_name: '김신부',
      groom_name: '이신랑'
    })
  })

  it('handles not found error', async () => {
    await expect(invitationService.getById('999')).rejects.toThrow('초대장을 찾을 수 없습니다.')
  })

  it('creates new invitation', async () => {
    const newInvitation = {
      title: '새 청첩장',
      bride_name: '박신부',
      groom_name: '최신랑'
    }
    
    const created = await invitationService.create(newInvitation)
    
    expect(created).toEqual({
      id: '2',
      ...newInvitation
    })
  })
})
```

---

## 5. E2E 테스팅

### 🎭 Cypress 설정 및 테스트

#### Cypress 설정 (cypress.config.ts)
```typescript
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    video: true,
    screenshotOnRunFailure: true,
    viewportWidth: 375, // 모바일 우선
    viewportHeight: 812,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    }
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack'
    }
  }
})
```

#### 사용자 플로우 테스트
```typescript
// cypress/e2e/wedding-invitation-creation.cy.ts
describe('Wedding Invitation Creation', () => {
  beforeEach(() => {
    // 로그인 상태 설정
    cy.window().then((win) => {
      win.localStorage.setItem('supabase.auth.token', 'fake-token')
    })
    cy.visit('/builder')
  })

  it('creates and previews wedding invitation', () => {
    // 1. 기본 정보 입력
    cy.get('[data-testid="title-input"]')
      .type('결혼합니다')
    
    cy.get('[data-testid="bride-name-input"]')
      .type('김신부')
    
    cy.get('[data-testid="groom-name-input"]')
      .type('이신랑')
    
    // 2. 날짜 선택
    cy.get('[data-testid="date-picker"]').click()
    cy.get('[data-testid="calendar-day-15"]').click()
    cy.get('[data-testid="confirm-date"]').click()
    
    // 3. 장소 입력
    cy.get('[data-testid="location-input"]')
      .type('서울특별시 강남구')
    
    // 4. 저장
    cy.get('[data-testid="save-button"]').click()
    
    // 5. 저장 확인
    cy.get('[data-testid="success-toast"]')
      .should('be.visible')
      .and('contain', '저장되었습니다')
    
    // 6. 미리보기 확인
    cy.get('[data-testid="preview-button"]').click()
    cy.url().should('include', '/preview')
    
    // 7. 미리보기 내용 확인
    cy.get('[data-testid="invitation-title"]')
      .should('contain', '결혷합니다')
    
    cy.get('[data-testid="invitation-couple"]')
      .should('contain', '김신부 & 이신랑')
  })

  it('handles form validation errors', () => {
    // 빈 폼 제출 시도
    cy.get('[data-testid="save-button"]').click()
    
    // 에러 메시지 확인
    cy.get('[data-testid="error-title"]')
      .should('be.visible')
      .and('contain', '제목은 필수 입력값입니다.')
    
    cy.get('[data-testid="error-bride-name"]')
      .should('be.visible')
      .and('contain', '신부 이름을 입력해주세요.')
  })

  it('shares invitation via KakaoTalk', () => {
    // 청첩장 생성 후 공유 테스트
    cy.get('[data-testid="title-input"]').type('테스트 청첩장')
    cy.get('[data-testid="bride-name-input"]').type('김신부')
    cy.get('[data-testid="groom-name-input"]').type('이신랑')
    cy.get('[data-testid="save-button"]').click()
    
    // 카카오톡 공유 버튼 클릭
    cy.get('[data-testid="kakao-share-button"]').click()
    
    // Kakao SDK 함수 호출 확인
    cy.window().its('Kakao').should('exist')
    // 실제 카카오톡 앱 호출은 Mock으로 처리
  })
})
```

---

## 6. 테스트 데이터 및 모킹

### 🎭 Mock 데이터 관리

#### MSW 핸들러 설정
```typescript
// src/test/server/handlers.ts
import { rest } from 'msw'

export const handlers = [
  // Supabase Auth Mock
  rest.post('https://*.supabase.co/auth/v1/token', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        access_token: 'fake-access-token',
        refresh_token: 'fake-refresh-token',
        user: {
          id: 'user-1',
          email: 'test@example.com'
        }
      })
    )
  }),

  // Invitations API Mock
  rest.get('/api/invitations/:id', (req, res, ctx) => {
    const { id } = req.params
    
    if (id === '1') {
      return res(
        ctx.json({
          id: '1',
          title: '테스트 청첩장',
          bride_name: '김신부',
          groom_name: '이신랑',
          date: '2024-06-15',
          location: '서울',
          theme: 'rose',
          published: false
        })
      )
    }
    
    return res(ctx.status(404))
  }),

  // 지도 API Mock
  rest.get('https://dapi.kakao.com/v2/local/search/address.json', (req, res, ctx) => {
    return res(
      ctx.json({
        documents: [
          {
            address_name: '서울 강남구 테헤란로 123',
            x: '127.028344',
            y: '37.516311'
          }
        ]
      })
    )
  })
]
```

#### 테스트 데이터 팩토리
```typescript
// src/test/factories/invitationFactory.ts
import {faker} from '@faker-js/faker'
import { Invitation } from '@/types/invitation'

export function createInvitation(overrides: Partial<Invitation> = {}): Invitation {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.words(3),
    bride_name: faker.person.firstName('female'),
    groom_name: faker.person.firstName('male'),
    date: faker.date.future().toISOString().split('T')[0],
    location: faker.location.city(),
    theme: faker.helpers.arrayElement(['rose', 'sky', 'lavender', 'sage']),
    published: faker.datatype.boolean(),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
    user_id: faker.string.uuid(),
    ...overrides
  }
}

export function createInvitations(count: number): Invitation[] {
  return Array.from({ length: count }, () => createInvitation())
}
```

---

## 7. 접근성 테스팅

### ♿ 접근성 테스트

#### axe-core를 이용한 접근성 테스트
```typescript
// src/test/accessibility/axeConfig.ts
import { toHaveNoViolations } from 'jest-axe'
import { configureAxe } from 'jest-axe'

expect.extend(toHaveNoViolations)

const axe = configureAxe({
  rules: {
    // 자동화 테스트에서 제외할 규칙
    'color-contrast': { enabled: false }
  }
})

export { axe }
```

#### 컴포넌트 접근성 테스트
```typescript
// src/components/ui/Button/Button.accessibility.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe } from '@/test/accessibility/axeConfig'
import { Button } from './Button'

describe('Button Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<Button>Accessible Button</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should be keyboard accessible', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toHaveAttribute('tabindex', '0')
    expect(button).toHaveAttribute('type', 'button')
  })

  it('should have proper ARIA labels when needed', () => {
    render(<Button aria-label="Close dialog">×</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toHaveAttribute('aria-label', 'Close dialog')
  })
})
```

---

## 8. 테스트 실행 및 커버리지

### 📊 테스트 실행 명령어

#### package.json 스크립트
```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "cypress open",
    "test:e2e:headless": "cypress run",
    "test:accessibility": "vitest run --reporter=verbose src/test/accessibility"
  }
}
```

#### 커버리지 리포트 설정
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'src/mocks/',
        '**/*.stories.*'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
})
```

---

## 9. 테스트 모범 사례

### ✅ 좋은 테스트 작성 원칙

#### 1. AAA 패턴 (Arrange-Act-Assert)
```typescript
it('should calculate total price correctly', () => {
  // Arrange - 준비
  const item = { price: 100, quantity: 2 }
  const expectedTotal = 200
  
  // Act - 실행
  const actualTotal = calculateTotal(item)
  
  // Assert - 검증
  expect(actualTotal).toBe(expectedTotal)
})
```

#### 2. 의미 있는 테스트 이름
```typescript
// 좋은 예
it('displays error message when email format is invalid')
it('prevents form submission when required fields are empty')

// 나쁜 예
it('test button click')
it('should work')
```

#### 3. 테스트 격리
```typescript
describe('Component Tests', () => {
  beforeEach(() => {
    // 각 테스트 전에 깨끗한 상태로 리셋
    vi.clearAllMocks()
  })
  
  afterEach(() => {
    // 테스트 후 정리
    vi.restoreAllMocks()
  })
})
```

### 🚫 피해야 할 안티패턴

#### 1. 구현 세부사항 테스트
```typescript
// 나쁜 예 - 구현에 의존
it('should call useEffect once', () => {
  expect(useEffect).toHaveBeenCalledTimes(1)
})

// 좋은 예 - 동작에 집중
it('should load user data on mount', async () => {
  render(<UserProfile userId="123" />)
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })
})
```

#### 2. 과도한 Mocking
```typescript
// 나쁜 예 - 모든 것을 Mock
vi.mock('@/components/ui/Button', () => ({
  Button: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

// 좋은 예 - 실제 컴포넌트 사용
import { Button } from '@/components/ui/Button'
```

---

## 10. CI/CD 통합

### 🔄 GitHub Actions 설정

#### 테스트 워크플로우
```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-integration-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run type check
        run: npm run type-check
        
      - name: Run linting
        run: npm run lint
        
      - name: Run unit and integration tests
        run: npm run test:coverage
        
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          
  e2e-tests:
    runs-on: ubuntu-latest
    needs: unit-integration-tests
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build
        
      - name: Start application
        run: npm start &
        
      - name: Wait for app to be ready
        run: npx wait-on http://localhost:3000
        
      - name: Run E2E tests
        run: npm run test:e2e:headless
        
      - name: Upload screenshots
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots
```

---

## 11. 성능 테스팅

### ⚡ 성능 테스트

#### 컴포넌트 렌더링 성능 테스트
```typescript
// src/test/performance/InvitationList.performance.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { performance } from 'perf_hooks'
import { InvitationList } from '@/components/builder/InvitationList'
import { createInvitations } from '@/test/factories/invitationFactory'

describe('InvitationList Performance', () => {
  it('renders large list efficiently', () => {
    const invitations = createInvitations(1000)
    
    const startTime = performance.now()
    render(<InvitationList invitations={invitations} />)
    const endTime = performance.now()
    
    // 렌더링이 100ms 이내에 완료되어야 함
    expect(endTime - startTime).toBeLessThan(100)
    
    // 모든 항목이 렌더링되었는지 확인
    expect(screen.getAllByTestId('invitation-item')).toHaveLength(1000)
  })
})
```

---

## 12. 테스트 문서화

### 📚 테스트 가이드라인

#### 컴포넌트 테스트 템플릿
```typescript
// ComponentName.test.tsx 템플릿
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from '@/test/accessibility/axeConfig'
import { ComponentName } from './ComponentName'

// 필요한 Mock 설정
vi.mock('@/path/to/dependency', () => ({
  functionName: vi.fn()
}))

describe('ComponentName', () => {
  const user = userEvent.setup()
  
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  afterEach(() => {
    vi.restoreAllMocks()
  })
  
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<ComponentName />)
      // 기본 렌더링 확인
    })
    
    it('has no accessibility violations', async () => {
      const { container } = render(<ComponentName />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
  
  describe('Interactions', () => {
    it('handles user interactions correctly', async () => {
      render(<ComponentName />)
      
      // 사용자 상호작용 테스트
      await user.click(screen.getByRole('button'))
      
      await waitFor(() => {
        expect(screen.getByText('Expected text')).toBeInTheDocument()
      })
    })
  })
  
  describe('Edge Cases', () => {
    it('handles error states gracefully', () => {
      // 에러 상태 테스트
    })
    
    it('handles loading states', () => {
      // 로딩 상태 테스트
    })
  })
})
```

---

> **테스트는 코드의 생명 보험이며, 리팩토링의 용기와 변경의 자신감을 줍니다.** 모든 개발자는 테스트 작성을 습관화하고, 지속적인 테스트 커버리지 개선에 참여해야 합니다. 테스트와 관련된 문제나 개선 사항은 팀원들과 적극적으로 공유하고 논의해 주시기 바랍니다.