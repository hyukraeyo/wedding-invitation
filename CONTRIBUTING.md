# 🤝 바나나웨딩 기여 가이드

바나나웨딩 프로젝트에 관심을 가져주셔서 감사합니다! 본 가이드는 프로젝트에 기여하는 방법, 코드 컨벤션, 그리고 협업 과정을 안내합니다.

---

## 1. 시작하기

### 🎯 기여 방법

기여는 다양한 형태로 가능합니다:

- 🐛 **버그 리포트**: 발견한 버그를 상세히 보고
- 💡 **기능 제안**: 새로운 기능 아이디어 제안
- 📝 **문서 개선**: 오타 수정, 문서 추가, 설명 개선
- 🧪 **테스트 작성**: 테스트 커버리지 향상
- 🔧 **버그 수정**: 이슈에 등록된 버그 해결
- ✨ **신규 기능**: 새로운 기능 구현
- 🎨 **디자인 개선**: UI/UX 개선
- 🌐 **번역**: 다국어 지원 추가

### 📋 필수 요구사항

- **Node.js** 20.0 이상
- **npm** 9.0 이상
- **Git** 기본 사용 능력
- **TypeScript** 기본 이해
- **React** 및 **Next.js** 기본 지식

---

## 2. 개발 환경 설정

### 🛠️ 로컬 개발 환경

#### 1. 저장소 클론
```bash
# 저장소 포크 후 클론
git clone https://github.com/YOUR_USERNAME/wedding-invitation.git
cd wedding-invitation

# 원본 저장소를 upstream으로 추가
git remote add upstream https://github.com/original-owner/wedding-invitation.git
```

#### 2. 의존성 설치
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

#### 3. 환경변수 설정
```bash
# 환경변수 예시 파일 복사
cp .env.example .env.local

# .env.local 파일에 필요한 값 설정
# 자세한 내용은 SECURITY.md 참조
```

#### 4. 개발 도구 설정
```bash
# Git hooks 설치 (Husky)
npm run prepare

# VS Code 설정 추천
# - ES7+ React/Redux/React-Native snippets
# - TypeScript Importer
# - Prettier - Code formatter
# - ESLint
```

### ⚙️ IDE 설정

#### VS Code 설정 (.vscode/settings.json)
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "files.associations": {
    "*.module.scss": "scss"
  }
}
```

---

## 3. 브랜치 전략

### 🌳 Git 워크플로우

#### 브랜치 명명 규칙
```bash
# 기능 개발
feature/invitation-builder
feature/gallery-optimization

# 버그 수정
fix/mobile-layout-issue
fix/authentication-error

# 핫픽스 (긴급 수정)
hotfix/security-vulnerability

# 문서 작성
docs/api-documentation
docs/contribution-guide

# 리팩토링
refactor/user-store-structure
```

#### 브랜치 작업 절차
```bash
# 1. 최신 main 브랜치 동기화
git checkout main
git pull upstream main

# 2. 새로운 기능 브랜치 생성
git checkout -b feature/your-feature-name

# 3. 코드 작성 및 커밋
git add .
git commit -m "feat: implement new feature"

# 4. 원격 저장소에 푸시
git push origin feature/your-feature-name

# 5. Pull Request 생성
# GitHub에서 PR 생성
```

---

## 4. 커밋 컨벤션

### 📝 커밋 메시지 형식

#### 기본 구조
```
<type>(<scope>): <subject>

<body>

<footer>
```

#### 타입 (Type)
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 스타일 변경 (포맷팅 등)
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드/도구 설정 변경
- `perf`: 성능 개선
- `ci`: CI/CD 관련 변경

#### 스코프 (Scope)
- `ui`: UI 컴포넌트 관련
- `api`: API 관련
- `db`: 데이터베이스 관련
- `auth`: 인증 관련
- `builder`: 청첩장 빌더 관련
- `preview`: 미리보기 관련
- `mobile`: 모바일 최적화 관련
- `perf`: 성능 최적화 관련

#### 커밋 메시지 예시
```bash
# 좋은 예시
feat(builder): add real-time preview functionality
feat(ui): implement responsive gallery component
fix(auth): resolve mobile login issue
docs(api): update authentication endpoints documentation
perf(images): optimize image loading with lazy loading
refactor(store): restructure user data management

# 나쁜 예시
fixed bug
add feature
update files
asdf
```

#### 상세 커밋 메시지 예시
```bash
feat(auth): implement OAuth login with Kakao

- Add Kakao OAuth integration
- Implement user profile synchronization
- Add error handling for OAuth failures
- Update login UI with Kakao button

Closes #123
```

---

## 5. 코드 스타일 가이드

### 🎨 TypeScript/React 컨벤션

#### 파일 명명 규칙
```bash
# 컴포넌트: PascalCase
InvitationCard.tsx
InvitationCanvas.tsx
UserProfile.tsx

# 유틸리티: camelCase
dateUtils.ts
validationHelpers.ts
apiClient.ts

# 타입: PascalCase
Invitation.ts
User.ts
ApiResponse.ts

# 상수: UPPER_SNAKE_CASE
API_ENDPOINTS.ts
THEME_COLORS.ts
VALIDATION_RULES.ts
```

#### 컴포넌트 구조
```typescript
// ComponentName/ComponentName.tsx
"use client" // 클라이언트 컴포넌트일 경우

import React from 'react'
import { cn } from '@/lib/utils'
import styles from './ComponentName.module.scss'

interface ComponentNameProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'primary' | 'secondary'
  disabled?: boolean
}

/**
 * Component description
 * Based on TDS design system
 */
export const ComponentName = React.forwardRef<
  HTMLButtonElement,
  ComponentNameProps
>(({
  children,
  className,
  variant = 'default',
  disabled = false,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        styles.container,
        styles[`variant-${variant}`],
        disabled && styles.disabled,
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})

ComponentName.displayName = "ComponentName"
export default ComponentName
```

#### 임포트 정렬 순서
```typescript
// 1. React imports
import React from 'react'
import { useState, useEffect } from 'react'

// 2. External libraries (알파벳 순)
import { clsx } from 'clsx'
import * as TogglePrimitive from '@radix-ui/react-toggle'
import Image from 'next/image'

// 3. Internal imports (알파벳 순, 경로별 정렬)
import { cn } from '@/lib/utils'
import { profileService } from '@/services/profileService'
import { useInvitationStore } from '@/store/useInvitationStore'
import styles from './ComponentName.module.scss'
```

#### 타입 정의
```typescript
// types/Invitation.ts
export interface Invitation {
  id: string
  title: string
  brideName: string
  groomName: string
  date: string
  location: string
  theme: Theme
  published: boolean
  createdAt: string
  updatedAt: string
  userId: string
}

export interface InvitationForm {
  title: string
  brideName: string
  groomName: string
  date: Date
  location: string
  theme: Theme
}

export type InvitationStatus = 'draft' | 'published' | 'archived'

export interface InvitationResponse extends ApiResponse<Invitation> {}
```

### 🎭 SCSS 모듈 컨벤션

#### SCSS 파일 구조
```scss
// ComponentName.module.scss
.container {
  // 기본 컨테이너 스타일
  display: flex;
  flex-direction: column;
  gap: v.$spacing-md;
  
  // 상태별 스타일
  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  // 변이 (Variants)
  &.variant-primary {
    background-color: v.$color-primary;
    color: v.$color-white;
  }
  
  &.variant-secondary {
    background-color: v.$color-gray-100;
    color: v.$color-gray-900;
  }
}

.title {
  @include m.typography-heading;
  
  color: v.$color-text-primary;
  margin-bottom: v.$spacing-sm;
}

.button {
  @include m.button-base;
  
  // 호버 효과
  &:hover:not(.disabled) {
    transform: scale(1.02);
  }
  
  // 포커스 효과
  &:focus {
    @include m.focus-ring;
  }
}
```

#### BEM 규칙 준수
```scss
.gallery {
  &__item {
    position: relative;
    overflow: hidden;
  }
  
  &__image {
    width: 100%;
    height: auto;
    transition: transform 0.3s ease;
  }
  
  &__caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: v.$spacing-sm;
  }
  
  &--featured {
    .gallery__image {
      transform: scale(1.05);
    }
  }
}
```

---

## 6. 품질 보증

### 🧪 테스트 작성 가이드

#### 컴포넌트 테스트
```typescript
// ComponentName.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentName } from './ComponentName'

describe('ComponentName', () => {
  const user = userEvent.setup()
  
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  describe('Rendering', () => {
    it('renders correctly with default props', () => {
      render(<ComponentName>Test</ComponentName>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
    
    it('applies correct variant styles', () => {
      render(<ComponentName variant="primary">Primary Button</ComponentName>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('variant-primary')
    })
  })
  
  describe('Interactions', () => {
    it('handles click events', async () => {
      const handleClick = vi.fn()
      render(<ComponentName onClick={handleClick}>Click me</ComponentName>)
      
      await user.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })
  
  describe('Accessibility', () => {
    it('is keyboard accessible', async () => {
      render(<ComponentName>Accessible Button</ComponentName>)
      const button = screen.getByRole('button')
      
      button.focus()
      expect(button).toHaveFocus()
      
      await user.keyboard('{Enter}')
      // 엔터 키 동작 확인
    })
  })
})
```

#### 유틸리티 함수 테스트
```typescript
// utils/dateUtils.test.ts
import { describe, it, expect } from 'vitest'
import { formatDate, calculateDaysUntil } from './dateUtils'

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-06-15')
      expect(formatDate(date)).toBe('2024-06-15')
    })
    
    it('handles invalid dates', () => {
      expect(() => formatDate(new Date('invalid'))).toThrow()
    })
  })
  
  describe('calculateDaysUntil', () => {
    it('calculates days until future date', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 10)
      expect(calculateDaysUntil(futureDate)).toBe(10)
    })
  })
})
```

### 📋 코드 리뷰 체크리스트

#### 기능 검토
- [ ] 기능이 정상적으로 동작하는가?
- [ ] 요구사항이 모두 충족되었는가?
- [ ] 엣지 케이스가 처리되었는가?
- [ ] 에러 핸들링이 적절한가?

#### 코드 품질
- [ ] 코드 스타일 가이드를 따르는가?
- [ ] 변수/함수 이름이 명확한가?
- [ ] 중복 코드가 없는가?
- [ ] 타입 안전성이 보장되는가?

#### 성능 및 보안
- [ ] 성능 저하가 없는가?
- [ ] 보안 취약점이 없는가?
- [ ] 불필요한 리렌더링이 없는가?
- [ ] 메모리 누수가 없는가?

#### 테스트
- [ ] 테스트 커버리지가 충분한가?
- [ ] 테스트가 의미있는 시나리오를 검증하는가?
- [ ] E2E 테스트가 필요한가?
- [ ] 접근성 테스트가 포함되었는가?

---

## 7. Pull Request 가이드

### 📝 PR 작성 절차

#### 1. Pull Request 템플릿
```markdown
## 📋 변경 사항 요약
(무엇을 변경했는지 간략히 설명)

## 🎯 변경 목적
(왜 이 변경이 필요한지 설명)

## 🛠️ 구현 내용
(어떻게 구현했는지 상세 설명)

## 📸 스크린샷/영상
(UI 변경이 있다면 스크린샷이나 영상 첨부)

## 🧪 테스트 방법
(테스트 방법 및 수동 테스트 결과)

## ✅ 체크리스트
- [ ] 코드가 스타일 가이드를 따름
- [ ] 테스트를 작성했거나 수정함
- [ ] Self-review 완료
- [ ] 빌드가 성공적으로 완료됨
- [ ] 접근성 테스트 통과

## 🔗 관련 이슈
(관련된 이슈 번호: #123)

## 📝 추가 정보
(리뷰어가 알아야 할 추가 정보)
```

#### 2. PR 제출 전 확인사항
```bash
# 1. 최신 코드 동기화
git checkout main
git pull upstream main
git checkout your-feature-branch
git rebase main

# 2. 코드 품질 검사
npm run lint
npm run type-check
npm run test

# 3. 빌드 테스트
npm run build

# 4. 성능 테스트 (필요시)
npm run analyze
```

#### 3. PR 리뷰 프로세스
1. **자가 리뷰**: PR 제출 전 스스로 코드 검토
2. **동료 리뷰**: 최소 1명 이상의 리뷰 필요
3. **승인 및 머지**: 모든 리뷰가 승인되면 머지

---

## 8. 이슈 관리

### 🐛 버그 리포트

#### 버그 리포트 템플릿
```markdown
## 🐛 버그 설명
(버그에 대한 간단한 설명)

## 🔄 재현 방법
1. '...'으로 이동
2. '...' 클릭
3. '...' 입력
4. 에러 발생

## 📱 환경 정보
- OS: [iOS 15.0, Android 12, Windows 11 등]
- 브라우저: [Chrome 120, Safari 16, Firefox 119 등]
- 기기: [iPhone 13, Galaxy S22 등]
- 버전: [v1.2.3]

## 📸 예상 동작
(예상되는 정상 동작 설명)

## 📸 실제 동작
(실제 발생하는 문제 설명)

## 📸 스크린샷/영상
(문제가 재현되는 스크린샷이나 영상)

## 📝 추가 정보
(추가적으로 필요한 정보)
```

### 💡 기능 제안

#### 기능 제안 템플릿
```markdown
## ✨ 기능 제안
(제안하고 싶은 기능에 대한 설명)

## 🎯 문제 해결
(이 기능이 어떤 문제를 해결하는지)

## 💡 구현 아이디어
(기능 구현에 대한 구체적인 아이디어)

## 🎨 UI/UX 제안
(디자인이나 사용자 경험에 대한 제안)

## 📊 우선순위
[ ] 높음
[ ] 보통
[ ] 낮음

## 🔗 관련 이슈
(관련된 다른 이슈나 논의)

## 📝 추가 정보
(추가적으로 필요한 정보)
```

---

## 9. 릴리즈 프로세스

### 🚀 버전 관리

#### 시맨틱 버저닝 (Semantic Versioning)
- `MAJOR.MINOR.PATCH`
- `MAJOR`: 하위 호환되지 않는 변경
- `MINOR`: 하위 호환되는 기능 추가
- `PATCH`: 하위 호환되는 버그 수정

#### 릴리즈 절차
1. **개발 완료**: 모든 기능 개발 완료
2. **테스트**: 전체 테스트 통과
3. **코드 리뷰**: 모든 PR 리뷰 완료
4. **버전 결정**: 다음 버전 번호 결정
5. **태그 생성**: `git tag v1.2.3`
6. **릴리즈 노트 작성**: 변경 사항 정리
7. **배포**: 프로덕션 환경에 배포

#### 릴리즈 노트 작성
```markdown
# v1.2.3 (2024-01-15)

## 🚀 새로운 기능
- 실시간 미리보기 기능 추가 (#123)
- 모바일 갤러리 최적화 (#124)

## 🐛 버그 수정
- 모바일 로그인 문제 해결 (#125)
- 이미지 로딩 오류 수정 (#126)

## 🔧 개선 사항
- 성능 최적화 (LCP 20% 개선) (#127)
- 접근성 향상 (#128)

## ⚠️ 중요 변경
- API 엔드포인트 변경 (#129) - 마이그레이션 가이드 참조

## 📱 지원
- iOS 15.0+
- Android 8.0+
- Chrome 120+
- Safari 16+
```

---

## 10. 커뮤니티 가이드라인

### 🤝 행동 강령

#### 기대되는 행동
- **존중과 배려**: 모든 기여자를 존중하고 배려
- **협력적 태도**: 건설적인 피드백과 협력
- **포용성**: 다양한 배경과 경험 수용
- **학습 지향**: 끊임없는 학습과 성장
- **책임감**: 자신의 코드와 행동에 책임

#### 피해야 할 행동
- **공격적 언어**: 비난, 조롱, 모욕적 언어
- **차별적 발언**: 인종, 성별, 성적 지향, 종교 등에 기반한 차별
- **하라시먼트**: 괴롭힘, 스토킹, 위협
- **비밀 정보 공유**: 개인정보나 민감정보 공개
- **스패밍**: 불필요한 반복 게시물

### 💬 커뮤니케이션

#### GitHub Discussions 활용
- **질문**: 기술적 질문이나 도움이 필요할 때
- **아이디어**: 새로운 아이디어나 제안 공유
- **발표**: 프로젝트 관련 소식이나 발표
- **일반**: 프로젝트와 관련된 일반적인 논의

#### 이슈 트래커 활용
- **버그 리포트**: 발견된 버그 보고
- **기능 요청**: 새로운 기능 요청
- **문제 해결**: 문제 해결 과정 논의
- **질문**: 기술적 질문 (단, Discussions 권장)

---

## 11. 도움말 및 지원

### ❓ 질문하기

#### 질문 전 확인사항
- [ ] 문서를 모두 읽었는가?
- [ ] 기존 이슈를 검색해 보았는가?
- [ ] Discussions를 검색해 보았는가?
- [ ] 스스로 해결하려는 노력을 했는가?

#### 질문하는 방법
1. **명확한 제목**: 무엇을 묻고 싶은지 명확하게
2. **상세한 설명**: 어떤 문제를 겪고 있는지 자세히
3. **재현 가능한 예**: 코드나 스텝 제공
4. **환경 정보**: OS, 브라우저, 버전 등
5. **시도한 방법**: 이미 시도해 본 해결책

### 📚 학습 자료

#### 추천 자료
- [React 공식 문서](https://react.dev/)
- [Next.js 공식 문서](https://nextjs.org/docs)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
- [SCSS 가이드](https://sass-lang.com/guide)
- [Testing Library 문서](https://testing-library.com/)

#### 프로젝트 특화 자료
- [프로젝트 아키텍처](./ARCHITECTURE.md)
- [스타일 가이드](./AGENTS.md)
- [테스트 가이드](./TESTING.md)
- [배포 가이드](./DEPLOYMENT.md)
- [성능 최적화](./PERFORMANCE.md)

---

## 12. 인정 및 감사

### 🏆 기여자 인정

#### 기여 유형별 인정
- **코드 기여**: 기능 개발, 버그 수정
- **문서 기여**: 문서 작성, 번역, 개선
- **디자인 기여**: UI/UX 디자인, 아이콘 제작
- **테스트 기여**: 테스트 작성, 버그 발견
- **커뮤니티**: 질문 답변, 코드 리뷰

#### 인정 방법
- **README Contributors**: 모든 기여자 목록
- **릴리즈 노트**: 주요 기여자 언급
- **블로그 포스트**: 특별한 기여에 대한 소개
- **커뮤니티 활동**: 기여자 하이라이트

### 🎉 감사

바나나웨딩 프로젝트에 기여해주시는 모든 분들께 진심으로 감사드립니다. 여러분의 시간과 노력 덕분에 더 나은 청첩장 제작 플랫폼을 만들어갈 수 있습니다.

---

## 13. 자주 묻는 질문 (FAQ)

### ❓ 일반적인 질문

#### Q: 초보자도 기여할 수 있나요?
A: 네! 문서 수정, 오타 수정, 간단한 버그 수정부터 시작할 수 있습니다. 좋은 기회가 될 것입니다.

#### Q: 어떤 기술 스택을 알아야 하나요?
A: React, Next.js, TypeScript, SCSS, Node.js 기본 지식이 필요합니다. 세부 사항은 문서를 참조해주세요.

#### Q: Pull Request는 얼마나 걸리나요?
A: 보통 1-3일 내에 리뷰가 완료됩니다. 복잡한 변경사항은 더 걸릴 수 있습니다.

#### Q: 코드 스타일이 맞지 않으면 어떻게 하나요?
A: Prettier와 ESLint가 자동으로 수정해줍니다. PR 제출 전 `npm run lint`를 실행해보세요.

---

> **모든 기여는 소중합니다.** 작은 오타 수정부터 큰 기능 개발까지, 모든 형태의 기여가 프로젝트를 발전시킵니다. 함께 멋진 바나나웨딩을 만들어가요! 🍌💕