# 🍌 Banana Wedding UI 최적화 가이드

본 문서는 Next.js 16+, React 19 환경에서 고성능 프리미엄 사용자 경험을 제공하기 위한 UI 최적화 전략을 정리합니다.

---

## 1. 렌더링 최적화 (Server-First Approach)

### **Server Components 활용**
- **전략**: 모든 데이터 페칭은 서버 컴포넌트에서 수행하고, 클라이언트 컴포넌트는 오직 인터랙션(이벤트 핸들러, 상태 관리)이 필요한 부분으로 최소화합니다.
- **효과**: Javascript 번들 사이즈 감소, 초기 로딩 속도(FCP) 단축.

### **Selective Hydration**
- 복잡한 UI 요소(예: 캘린더, 지도)는 `next/dynamic`을 사용하여 필요한 시점에 지연 로딩합니다.
```tsx
const DynamicCalendar = dynamic(() => import('@/components/ui/Calendar'), {
  ssr: false,
  loading: () => <Skeleton className="h-[300px]" />
});
```

---

## 2. 레이아웃 시프트(CLS) 방지

### **Media Assets (Images/Videos)**
- 반드시 `next/image`를 사용하고, `width`와 `height`를 명시하거나 `placeholder="blur"`를 활용합니다.
- 동적으로 변하는 컨텐츠 영역에는 적절한 **Skeleton UI**를 적용하여 레이아웃이 급격히 변하는 것을 방지합니다.

### **Aspect Ratio 유지**
- 이미지나 비디오 컨테이너에 `aspect-ratio` CSS 속성을 사용하여 로딩 전에도 영역을 확보합니다.

---

## 3. 스타일링 및 애니메이션 최적화

### **SCSS Modules & CSS Variables**
- 런타임에 스타일을 변경해야 하는 경우(예: 다크모드, 디자인 시스템 조절) 인라인 스타일 대신 **CSS Variables**를 조절합니다.
- 이는 React의 리렌더링 없이 브라우저 수준에서 스타일을 갱신하므로 성능에 유리합니다.

### **GPU 가속 애니메이션**
- 애니메이션 성능을 위해 `transform`, `opacity` 속성만 사용합니다.
- `width`, `height`, `margin` 등의 기하학적 속성 변경은 레이아웃 재계산(Reflow)을 유발하므로 지양합니다.
```scss
// GOOD: GPU 가속 활용
.smooth-scale {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  &:hover { transform: scale(1.05); }
}
```

---

## 4. 폰트 및 에셋 최적화

### **Font Optimization (`next/font`)**
- `next/font`를 사용하여 폰트를 셀프 호스팅하고, **Variable Font**를 활용하여 번들 사이즈를 줄입니다.
- `display: swap`을 통해 폰트 로딩 중에도 텍스트가 보이도록 설정합니다.

### **SVG 관리**
- 작은 아이콘은 `lucide-react`와 같은 라이브러리를 사용하거나 인라인 SVG로 관리합니다.
- 복잡한 일러스트는 `public/assets`에 저장하고 `Image` 컴포넌트로 로드하여 캐싱을 활용합니다.

---

## 5. 인터랙션 최적화

### **Debounce & Throttle**
- 검색 필드의 `onChange`나 스크롤 이벤트에는 반드시 debounce/throttle을 적용하여 과도한 연산을 방지합니다.

### **Optimistic UI Update (Next.js Server Actions)**
- 좋아요, 삭제 등 사용자 액션에 대해 서버 응답을 기다리지 않고 미리 UI를 업데이트하여 즉각적인 피드백을 제공합니다.
- `useOptimistic` 훅을 적극 활용하십시오.

---

> **Tip**: 모든 UI 변경 사항은 Lighthouse 또는 Vercel Speed Insights를 통해 정기적으로 성능 지표를 점검하시기 바랍니다.
