
## 🏗️ 아키텍처 및 공통 패턴 가이드

이 섹션은 프로젝트의 일관된 코드 품질과 유지보수성을 위해 모든 개발자(Active Agent 포함)가 따라야 할 핵심 아키텍처와 UI 패턴을 정의합니다.

### 1. Data Fetching & Mutation (Strict Rule)

Next.js App Router의 성능 이점을 극대화하기 위해 다음 패턴을 강제합니다.

#### **Read: Server Components w/ Direct DB Access**
- **❌ DO NOT**: 클라이언트 컴포넌트에서 `useEffect`로 데이터를 가져오거나, 서버 컴포넌트에서 `fetch('/api/...')`로 내부 API를 호출하는 행위.
- **✅ DO**: 서버 컴포넌트(`async` function)에서 Service 계층이나 DB Client를 직접 호출하여 데이터를 확보.
  ```tsx
  // app/example/page.tsx
  import { db } from '@/lib/db';

  export default async function Page() {
    // API 호출 없이 직접 DB 쿼리
    const data = await db.query('SELECT * ...'); 
    return <ClientView initialData={data} />;
  }
  ```

#### **Write: Server Actions**
- **❌ DO NOT**: Form submit을 위해 별도의 API Route(`route.ts`)를 만들고 `fetch`로 요청하는 행위.
- **✅ DO**: **Server Actions**(`'use server'`)를 정의하여 클라이언트에서 함수처럼 직접 호출.
  ```tsx
  // actions/updateUser.ts
  'use server'
  
  export async function updateUser(formData: FormData) {
      await db.update(...);
      revalidatePath('/profile');
  }
  ```

### 2. 반응형 모달 시스템 (`ResponsiveModal`)

모든 "모달" 형태의 UI는 모바일 퍼스트 UX와 접근성(A11y)을 위해 기기 해상도에 따라 자동으로 형태가 변환되어야 하며, `shadcn/ui`의 표준 시맨틱 구조를 따라야 합니다.

- **Desktop (>= 768px)**: 중앙 `Dialog` (Radix UI)
- **Mobile (< 768px)**: 하단 `Drawer` (Vaul)

**핵심 마크업 원칙 (A11y & SEO):**
- **시맨틱 태그 사용**: `DrawerHeader`, `DrawerFooter`, `DrawerTitle`, `DrawerDescription` 등 전용 컴포넌트를 반드시 사용하여 DOM 구조를 표준화합니다.
- **제목(Title) 필수**: 접근성을 위해 제목이 없는 경우에도 보이지 않는 텍스트(`VisuallyHidden` 등)나 기본 제목("알림" 등)을 제공하여 스크린 리더가 인지할 수 있게 합니다.
- **표준 레이아웃**: `DrawerContent` 내부에는 `mx-auto w-full max-w-sm` 컨테이너를 배치하여 다양한 모바일 가로폭에서 일관된 레이아웃을 유지합니다.

**사용법:**
```tsx
import { ResponsiveModal } from '@/components/common/ResponsiveModal';

<ResponsiveModal
    open={isOpen}
    onOpenChange={setIsOpen}
    title="모달 제목"
    description="보조 설명 (SEO/접근성 향상)"
    trigger={<Button>열기</Button>} 
>
    <div>모달 내용 (DrawerScrollArea 내부 렌더링)</div>
</ResponsiveModal>
```
*주의: 마우스 드래그 및 터치 스와이프 닫기 기능을 보존하기 위해, 내부에서 이벤트를 임의로 차단하지 않아야 합니다.*

### 3. 아코디언 시스템 (`AccordionItem`)

빌더(Builder)의 각 섹션은 `AccordionItem`을 사용하여 구성합니다.

- **아이콘 스타일**:
  - 기본: `text-muted-foreground`
  - 활성(열림/완료): `text-primary` (노란색), 배경 없음.
  - *이전에는 원형 배경이 있었으나, 간결함을 위해 아이콘 색상 변경으로 통일됨.*
- **헤더 액션 (`HeaderAction`)**:
  - 아코디언 헤더 우측에 위치하는 버튼(예: "추천 문구", "미리보기").
  - **필수 구현**: 클릭 시 아코디언이 접히지 않도록 이벤트 전파를 막아야 합니다.
    ```tsx
    // HeaderAction 내부 구현 예시
    onClick={(e) => {
        e.preventDefault(); // 중요: 부모 포커스 방지
        e.stopPropagation(); // 중요: 아코디언 토글 방지
        onClick();
    }}
    ```

### 4. 아이콘 및 에셋 관리

- **라이브러리**: `lucide-react`를 기본으로 사용합니다.
- **커스텀 아이콘**: `public/assets/icons` 경로에 SVG/PNG로 관리하며, `Image` 컴포넌트로 로드합니다.
- **로고**: 벡터 그래픽(`public/assets/icons/logo_vector.svg`) 사용을 권장합니다.

### 5. 스타일링 원칙 (SCSS Modules + Radix UI)

- **Single Source of Truth**: 모든 디자인 토큰(색상, 폰트, 간격)은 `src/styles/_variables.scss`에서 관리합니다.
- **SCSS Modules 필수**: 컴포넌트 스타일링은 반드시 `module.scss`를 사용하며, Tailwind 등 유틸리티 클래스 사용을 금지합니다.
- **Radix UI Primitives**: 
  - 접근성(A11y)과 키보드 네비게이션이 보장된 Radix UI Primitive를 사용합니다.
  - 스타일은 전적으로 SCSS로 커스터마이징합니다.
- **색상**: Primary Color는 바나나 옐로우(`#FBC02D`)를 사용합니다.

### 5.1 UI 컴포넌트 생성 가이드 (Strict Rule)

새로운 UI 컴포넌트를 생성할 때 반드시 다음 규칙을 따릅니다.

#### **폴더 구조 (필수)**
```
src/components/ui/
├── ComponentName/           # PascalCase 폴더명
│   ├── index.tsx           # 컴포넌트 로직
│   └── styles.module.scss  # 스타일 (선택적)
├── Button/
│   ├── index.tsx
│   └── styles.module.scss
├── Calendar/
│   └── index.tsx           # react-day-picker 래핑
├── Accordion/
│   ├── index.tsx
│   └── styles.module.scss
└── ...
```

#### **컴포넌트 타입별 구현 패턴**

**1. Radix UI 기반 컴포넌트 (권장)**
```tsx
// src/components/ui/Dialog/index.tsx
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"
import styles from "./styles.module.scss"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className={styles.overlay} />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(styles.content, className)}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

export { Dialog, DialogTrigger, DialogContent }
```

**2. 외부 라이브러리 래핑 (Calendar 등)**
```tsx
// src/components/ui/Calendar/index.tsx
"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/Button"

// 타입 정의
export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}

function Calendar({ className, classNames, ...props }: CalendarProps) {
  return (
    <DayPicker
      className={cn("...", className)}
      classNames={{...classNames}}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
```

**3. 순수 HTML 기반 컴포넌트**
```tsx
// src/components/ui/Input/index.tsx
import * as React from "react"
import { cn } from "@/lib/utils"
import styles from "./styles.module.scss"

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(styles.input, className)}
    ref={ref}
    {...props}
  />
))
Input.displayName = "Input"

export { Input }
```

#### **SCSS 스타일 작성 규칙**

```scss
// src/components/ui/Button/styles.module.scss
@use "../../../styles/variables" as v;
@use "../../../styles/mixins" as m;

.button {
  @include m.button-base;  // 공통 믹스인 사용
  
  // 변형(Variant)별 스타일
  &--variant-default {
    background-color: v.$primary;
    color: v.$color-primary-foreground;
  }
  
  &--variant-outline {
    border: 1px solid v.$color-border;
    background-color: transparent;
  }
  
  // 크기별 스타일
  &--size-sm { padding: 0.25rem 0.5rem; }
  &--size-default { padding: 0.5rem 1rem; }
  &--size-lg { padding: 0.75rem 1.5rem; }
}
```

#### **Export 규칙**

- **Named Export 사용**: `export { ComponentName }`
- **displayName 필수**: 디버깅을 위해 항상 설정
- **타입 Export**: 필요 시 Props 타입도 export

#### **Shadcn UI CLI 사용 시**

Shadcn CLI로 컴포넌트 추가 후 반드시:
1. 생성된 `*.tsx` 파일을 `ComponentName/index.tsx` 폴더로 이동
2. import 경로를 대문자 폴더명으로 수정
3. 중복 생성된 파일(button.tsx 등) 삭제

```bash
# Shadcn CLI로 컴포넌트 추가
npx shadcn@latest add calendar

# 폴더 구조로 이동
mkdir -p src/components/ui/Calendar
mv src/components/ui/calendar.tsx src/components/ui/Calendar/index.tsx
```

### 6. 데이터 흐름 (Zustand)

- **단일 스토어 원칙**: `useInvitationStore`를 통해 청첩장의 모든 데이터(신랑/신부 정보, 사진, 위치 등)를 관리합니다.
- **셀렉터 사용**: 성능 최적화를 위해 필요한 상태만 선택하여 구독합니다.
  ```tsx
  const groomName = useInvitationStore(state => state.groom.firstName);
  ```

### 7. Zustand Persist 미들웨어 및 페이지 간 상태 관리 (Strict Rule)

`useInvitationStore`는 `persist` 미들웨어를 사용하여 IndexedDB에 상태를 저장합니다. 이로 인해 페이지 간 이동 시에도 상태가 유지되므로, **페이지 진입 시 모드에 따른 상태 초기화**가 필수입니다.

#### **핵심 원칙: URL 기반 모드 구분**

| URL | 모드 | 동작 |
|-----|------|------|
| `/builder?mode=edit` | 수정 모드 | 스토어 상태 유지 (기존 데이터로 수정) |
| `/builder` | 생성 모드 | 스토어 초기화 (`reset()`) 후 새 청첩장 생성 |

#### **필수 구현 패턴**

```tsx
// app/builder/page.tsx
function BuilderPageContent() {
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('mode') === 'edit';
  const reset = useInvitationStore(state => state.reset);
  const initRef = useRef(false);
  const [isReady, setIsReady] = useState(false);

  // 🔑 페이지 진입 시 모드 확인 후 스토어 초기화
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    
    if (!isEditMode) {
      // 새 청첩장 모드: 스토어를 초기 상태로 리셋
      reset();
    }
    setIsReady(true);
  }, [isEditMode, reset]);

  // 초기화 완료 전 저장 방지
  const handleSave = useCallback(async () => {
    if (!isReady) {
      toast.error('잠시 후 다시 시도해주세요.');
      return;
    }
    // ... 저장 로직
  }, [isReady]);
}
```

#### **마이페이지에서 수정 버튼 클릭 시**

```tsx
// app/mypage/MyPageClient.tsx
const handleEdit = useCallback((inv: InvitationRecord) => {
  // 1. 스토어에 기존 데이터 로드
  useInvitationStore.setState(inv.invitation_data);
  useInvitationStore.getState().setSlug(inv.slug);
  
  // 2. mode=edit 쿼리 파라미터와 함께 빌더로 이동
  router.push('/builder?mode=edit');
}, [router]);
```

#### **⚠️ 주의사항**

- **❌ DO NOT**: `/builder` URL로 직접 접속 시 이전 데이터로 저장되도록 방치
- **❌ DO NOT**: `sessionStorage`나 `localStorage`에 의존하는 복잡한 slug 관리 로직 사용
- **✅ DO**: URL 쿼리 파라미터(`mode=edit`)로 명시적인 모드 구분
- **✅ DO**: `initRef`로 React StrictMode의 이중 실행 방지
- **✅ DO**: `isReady` 상태로 초기화 완료 전 사용자 액션 차단

#### **Next.js + Zustand Persist Hydration 처리**

```tsx
// persist 미들웨어 옵션 (useInvitationStore.ts)
persist((set) => ({...}), {
  name: 'wedding-invitation-storage',
  storage: createJSONStorage(() => ({
    getItem: async (name) => { /* idb-keyval */ },
    setItem: async (name, value) => { /* idb-keyval */ },
    removeItem: async (name) => { /* idb-keyval */ },
  })),
  // 중첩 객체 deep merge 처리
  merge: (persistedState, currentState) => ({
    ...currentState,
    ...persistedState,
    mainScreen: {
      ...currentState.mainScreen,
      ...(persistedState.mainScreen || {}),
    },
    // ... 기타 중첩 객체
  }),
});
```

---
