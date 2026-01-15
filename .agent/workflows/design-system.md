---
description: 바나나웨딩 디자인 시스템 (shadcn/ui + Tailwind) 가이드
---

# 🍌 바나나웨딩 디자인 시스템 가이드

모든 UI 컴포넌트는 **shadcn/ui**를 기반으로 하며, **모바일 퍼스트**와 **접근성(A11y)** 준수를 최우선으로 합니다.

## 📱 디자인 원칙
- **모바일 퍼스트**: 모든 화면은 모바일 해상도를 기준으로 먼저 설계하고, 이후 데스크톱 대응을 고려합니다.
- **반응형 컴포넌트**: 기기 해상도에 따라 형태가 변하는 `ResponsiveModal` 시스템을 적극 활용합니다.
- **접근성(A11y)**: 시맨틱 HTML 태그와 Aria 속성을 준수하여 SEO 및 웹 접근성을 확보합니다.

## 1. 핵심 UI 프레임워크

프로젝트는 다음 라이브러리를 기반으로 조립된 컴포넌트를 사용합니다.
- **Base**: `Radix UI` (고수준 프리미티브)
- **Styling**: `Tailwind CSS` + `SCSS`
- **Animations**: `Framer Motion` (또는 vaul/radix 내장 애니메이션)

## 2. 주요 시맨틱 컴포넌트

### 📦 ResponsiveModal (모든 모달의 표준)
데스크톱에서는 `Dialog`, 모바일에서는 `Drawer`로 자동 전환되는 핵심 컴포넌트입니다.

```tsx
import { ResponsiveModal } from '@/components/common/ResponsiveModal';

<ResponsiveModal
  title="제목"
  description="설명"
  onConfirm={handleConfirm}
>
  {/* 내용 */}
</ResponsiveModal>
```

### 📦 Input & Select (폼 요소)
- **Input**: `@/components/ui/Input` 사용. 모바일 터치 영역 보장(최소 높이 48px).
- **Select**: `@/components/ui/Select` 활용. 모바일에서는 하단 바텀시트(`Drawer`) 형태로 동작하게 커스터마이징됨.

## 3. shadcn/ui 표준 마크업 패턴

모달 및 바텀시트 구현 시 다음의 시맨틱 요소를 정확히 사용해야 브라우저와 검색 엔진이 구조를 파악할 수 있습니다.

```tsx
<DrawerContent>
  <div className="mx-auto w-full max-w-sm"> {/* 중앙 정렬 및 너비 가이드 */}
    <DrawerHeader> {/* 헤더 시맨틱 */}
      <DrawerTitle>제목</DrawerTitle>
      <DrawerDescription>설명</DrawerDescription>
    </DrawerHeader>
    <DrawerScrollArea>내용</DrawerScrollArea> {/* 스크롤 영역 */}
    <DrawerFooter>버튼 영역</DrawerFooter> {/* 푸터 시맨틱 */}
  </div>
</DrawerContent>
```

## 4. 스타일 시스템

### 프라이머리 컬러
- **Primary**: 바나나 옐로우 `#FBC02D` (Tailwind: `bg-primary`)
- **Interactive**: 가독성을 위해 핸들 및 버튼 테두리는 `zinc-300`, `zinc-400` 계열 활용.

### 타이포그래피 (Tailwind Utility 우선)
- **Title**: `text-lg font-semibold tracking-tight`
- **Body**: `text-sm text-muted-foreground`
- **Mobile Optimized**: 모든 폰트 크기는 모바일 환경에서 가독성이 확보된 사이즈를 사용합니다.

## 5. 컴포넌트 추가 및 수정 규칙

1. **shadcn CLI 활용**: 새로운 UI 요소가 필요하면 `npx shadcn@latest add [component]`를 통해 공식 코드를 가져옵니다.
2. **Drawer 핸들 가이드**: 모바일 바텀시트 핸들은 `bg-zinc-300`, `h-1.5`, `w-12` 규격을 준수합니다.
3. **이벤트 전파**: 아코디언 헤더 내부의 버튼 등은 `e.stopPropagation()`을 사용하여 의도치 않은 작동을 방지합니다.

## 6. 권장 워크플로우
- UI 수정 시 `ResponsiveModal`이 적용되었는지 확인.
- `Dialog`만 사용 중이라면 `Drawer` 분기가 포함된 `ResponsiveModal`로 교체 고려.
- 빌드 전 항상 `npm run build`를 통해 대소문자 및 타입 오류 확인.
