
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

모든 "모달" 형태의 UI는 모바일 퍼스트 UX를 위해 기기 해상도에 따라 자동으로 형태가 변환되어야 합니다.

- **Desktop (>= 768px)**: 중앙 `Dialog` (팝업)
- **Mobile (< 768px)**: 하단 `Drawer` (바텀 시트)

**사용법:**
```tsx
import { ResponsiveModal } from '@/components/common/ResponsiveModal';

// ...
<ResponsiveModal
    open={isOpen}
    onOpenChange={setIsOpen}
    title="모달 제목"
    // 필요한 경우 trigger 사용 (버튼 등)
    trigger={<Button>열기</Button>} 
>
    <div>모달 내용</div>
</ResponsiveModal>
```
*주의: 모바일에서 강제로 Dialog를 써야 하는 특수한 경우가 아니라면, 항상 이 컴포넌트를 사용하여 일관된 UX를 제공해야 합니다.*

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

### 5. 스타일링 원칙 (Tailwind + SCSS)

- **색상**: `primary`는 바나나 옐로우(`#FBC02D`)를 사용합니다.
- **애니메이션**: 'iOS' 느낌의 부드러운 감속(`cubic-bezier(0.16, 1, 0.3, 1)`)을 전역적으로 사용합니다.
- **반응형 패딩**: 모바일에서의 작업 영역 확보를 위해, 빌더 사이드바의 `padding-x`는 모바일에서 `1rem`, 데스크탑에서 `1.5rem`을 유지합니다.

### 6. 데이터 흐름 (Zustand)

- **단일 스토어 원칙**: `useInvitationStore`를 통해 청첩장의 모든 데이터(신랑/신부 정보, 사진, 위치 등)를 관리합니다.
- **셀렉터 사용**: 성능 최적화를 위해 필요한 상태만 선택하여 구독합니다.
  ```tsx
  const groomName = useInvitationStore(state => state.groom.firstName);
  ```

---
