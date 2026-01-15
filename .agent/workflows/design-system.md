---
description: TDS Mobile 디자인 시스템 참조 및 커스터마이징 가이드
---


# TDS Mobile 디자인 시스템 사용 가이드

## 📱 모바일 최적화 (최상위 우선순위)
- **모바일 퍼스트**: 모든 디자인과 컴포넌트는 모바일 환경을 기준으로 설계됩니다.
- **최상급 UI/UX**: 작은 화면에서도 직관적이고 아름다운 사용자 경험을 제공해야 합니다.
- **반응형 필수**: 다양한 모바일 해상도에 완벽하게 대응해야 합니다.
- **터치 친화적**: 모든 인터랙션 요소는 터치하기 쉬운 크기와 간격을 유지해야 합니다.

## 1. 설치된 패키지

```json
"@toss/tds-colors": "^0.1.0",
"@toss/tds-mobile": "^2.2.0",
"@toss/tds-mobile-ait": "^2.2.0"
```

## 2. Provider 설정 (이미 완료)

`src/app/ClientProviders.tsx`에서 `TDSMobileProvider` 설정됨.

## 3. 사용 가능한 TDS Mobile 컴포넌트

### 기본 입력 컴포넌트
- `TextField` - 텍스트 입력 (✅ 적용됨)
- `TextArea` - 멀티라인 텍스트 (✅ 적용됨)
- `SearchField` - 검색 필드
- `SplitTextField` - 분할 텍스트 필드

### 선택 컴포넌트
- `SegmentedControl` - 세그먼트 컨트롤 (✅ 적용됨)
- `Selector` - 선택기
- `Switch` - 스위치 토글 (✅ 적용됨)

### 슬라이더 & 스테퍼
- `Slider` - 슬라이더 (✅ 적용됨)
- `Stepper` - 스테퍼
- `NumericSpinner` - 숫자 스피너

### UI 컴포넌트 (TDS & shadcn/ui)
- `Badge` - 배지
- `BottomSheet` - 바터시트 (TDS)
- `AlertDialog` - 얼럿 다이얼로그
- `Tooltip` - 툴팁
- `Rating` - 별점
- `Skeleton` - 스켈레톤 로딩
- **`ResponsiveModal` (표준)** - `shadcn/ui` 기반의 반응형 모달 (Dialog ↔ Drawer). 모든 모달 UI의 최우선 순위.

## 4. shadcn/ui 활용 및 시맨틱 마크업

TDS와 함께 `shadcn/ui`를 사용하여 표준 접근성과 고급 기능을 구현합니다. 특히 모달/바텀시트 구현 시 다음의 시맨틱 요소를 정확히 사용해야 합니다.

### 반응형 모달(`ResponsiveModal`)의 DOM 구조
```tsx
<DrawerContent>
  <div className="mx-auto w-full max-w-sm"> {/* 1. 표준 컨테이너 */}
    <DrawerHeader> {/* 2. 시맨틱 헤더 */}
      <DrawerTitle>...</DrawerTitle>
      <DrawerDescription>...</DrawerDescription>
    </DrawerHeader>
    <DrawerScrollArea>...</DrawerScrollArea> {/* 3. 스크롤 영역 */}
    <DrawerFooter>...</DrawerFooter> {/* 4. 시맨틱 푸터 */}
  </div>
</DrawerContent>
```
- **SEO/A11y**: 기계적 크롤링 및 보조 기술이 제목과 내용을 정확하게 파악할 수 있도록 위 구조를 강제합니다.
- **핸들 스타일**: `bg-zinc-300` 색상과 `h-1.5 w-12` 규격을 사용하여 충분한 가시성과 조작감을 제공합니다.

## 5. 스타일 시스템

### 컬러 사용
```scss
@use "@/styles/variables" as *;

// TDS 컬러 변수 사용
color: $tds-grey-900;  // 기본 텍스트
color: $tds-grey-600;  // 보조 텍스트
color: $tds-blue-500;  // 프라이머리
color: $tds-red-500;   // 에러/위험

background: $tds-grey-100;  // 서브틀 배경
background: $tds-background; // 기본 배경
```

### 타이포그래피 사용
```scss
@use "@/styles/tds_typography" as typography;

// 타이포그래피 믹스인 사용
.title {
    @include typography.tds-t3("bold");  // 22px, bold
}

.body {
    @include typography.tds-t5("regular");  // 17px, regular
}

.caption {
    @include typography.tds-t7("medium");  // 13px, medium
}

.small {
    @include typography.tds-sub-t12("regular");  // 12px, regular
}
```

### 타이포그래피 토큰 참조
| 토큰 | 크기 | 줄 높이 | 용도 |
|------|------|---------|------|
| T1 | 30px | 40px | 대형 타이틀 |
| T2 | 26px | 35px | 타이틀 |
| T3 | 22px | 31px | 서브타이틀 |
| T4 | 20px | 29px | 섹션 헤딩 |
| T5 | 17px | 25.5px | 본문 (기본) |
| T6 | 15px | 22.5px | 본문 (소) |
| T7 | 13px | 19.5px | 캡션/라벨 |
| sub-T11 | 14px | 21px | 보조 본문 |
| sub-T12 | 12px | 18px | 작은 캡션 |
| sub-T13 | 11px | 16.5px | 최소 텍스트 |

## 5. Adaptive CSS 변수

TDS Mobile 컴포넌트는 `--adaptiveXXX` CSS 변수를 사용합니다.
`globals.scss`에서 매핑되어 있습니다:

```scss
:root {
    --adaptiveGrey200: var(--grey200);
    --adaptiveBlue500: var(--blue500);
    // ... 전체 목록은 globals.scss 참조
}
```

## 6. 컴포넌트 마이그레이션 패턴

기존 커스텀 컴포넌트를 TDS로 교체할 때:

```tsx
// Before
import { CustomTextField } from './CustomTextField';

// After
import { TextField } from '@toss/tds-mobile';
// 또는 래퍼 사용
import { TextField } from '@/components/builder/TextField';
```

## 7. 문서 참조

- [TDS Mobile 공식 문서](https://tossmini-docs.toss.im/tds-mobile/)
- [컬러 가이드](https://tossmini-docs.toss.im/tds-mobile/foundation/colors/)
- [타이포그래피 가이드](https://tossmini-docs.toss.im/tds-mobile/foundation/typography/)
