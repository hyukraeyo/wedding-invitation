# BottomCTA 컴포넌트

TDS(Toss Design System) 패턴을 따르는 하단 CTA(Call-to-Action) 버튼 컴포넌트입니다.

## 주요 특징

- **TDS 패턴 준수**: Toss Design System의 BottomCTA 구조를 따릅니다
- **CTAButton 통합**: 별도의 CTAButton 컴포넌트를 활용하여 일관된 버튼 스타일 제공
- **hideOnScroll 지원**: 스크롤 시 자동으로 숨김/표시 애니메이션
- **모바일 최적화**: Safe area, 키보드 대응 등 모바일 환경 최적화
- **유연한 API**: Single/Double 패턴, Fixed 래퍼 제공

## 컴포넌트 구조

```
BottomCTA
├── BottomCTA.Single    # 단일 버튼
├── BottomCTA.Double    # 두 개 버튼
FixedBottomCTA          # 항상 고정 (BottomCTA.Single의 fixed={true} 래퍼)
└── FixedBottomCTA.Double  # 항상 고정 Double
CTAButton               # CTA 전용 버튼 컴포넌트
```

## 사용 예시

### 1. 기본 사용 (Single)

```tsx
import { BottomCTA } from '@/components/ui/BottomCTA';

// 일반 버튼 (고정 안 됨)
<BottomCTA.Single>
  확인
</BottomCTA.Single>

// 하단 고정
<BottomCTA.Single fixed>
  확인
</BottomCTA.Single>

// variant 커스터마이징
<BottomCTA.Single variant="secondary" color="grey">
  취소
</BottomCTA.Single>
```

### 2. Double 버튼

```tsx
import { BottomCTA, CTAButton } from '@/components/ui';

<BottomCTA.Double
  fixed
  leftButton={
    <CTAButton variant="secondary" color="grey">
      취소
    </CTAButton>
  }
  rightButton={<CTAButton>확인</CTAButton>}
/>;
```

### 3. FixedBottomCTA (항상 고정)

```tsx
import { FixedBottomCTA, CTAButton } from '@/components/ui';

// Single (기본)
<FixedBottomCTA>
  확인
</FixedBottomCTA>

// Double
<FixedBottomCTA.Double
  leftButton={<CTAButton variant="secondary" color="grey">취소</CTAButton>}
  rightButton={<CTAButton>확인</CTAButton>}
/>
```

### 4. hideOnScroll (스크롤 애니메이션)

```tsx
// 스크롤 시 자동 숨김/표시
<BottomCTA.Single fixed hideOnScroll>
  확인
</BottomCTA.Single>

<FixedBottomCTA hideOnScroll>
  확인
</FixedBottomCTA>
```

### 5. CTAButton 단독 사용

```tsx
import { CTAButton } from '@/components/ui/CTAButton';

// 기본 (primary)
<CTAButton>확인</CTAButton>

// variant 커스터마이징
<CTAButton variant="secondary" color="grey">
  취소
</CTAButton>

// 로딩 상태
<CTAButton loading>
  처리 중...
</CTAButton>

// 비활성화
<CTAButton disabled>
  비활성화
</CTAButton>
```

## Props

### BottomCTA.Single

| Prop                 | Type                                                                       | Default     | Description        |
| -------------------- | -------------------------------------------------------------------------- | ----------- | ------------------ |
| `children`           | `ReactNode`                                                                | -           | 버튼 텍스트        |
| `onClick`            | `(e: MouseEvent) => void`                                                  | -           | 클릭 핸들러        |
| `fixed`              | `boolean`                                                                  | `false`     | 하단 고정 여부     |
| `loading`            | `boolean`                                                                  | `false`     | 로딩 상태          |
| `disabled`           | `boolean`                                                                  | `false`     | 비활성화 상태      |
| `variant`            | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'blue' \| 'unstyled'` | `'primary'` | 버튼 variant       |
| `color`              | `'primary' \| 'grey' \| ...`                                               | `'primary'` | 버튼 color         |
| `transparent`        | `boolean`                                                                  | `false`     | 배경 투명 여부     |
| `animated`           | `boolean`                                                                  | `false`     | 등장 애니메이션    |
| `hideOnScroll`       | `boolean`                                                                  | `false`     | 스크롤 시 숨김     |
| `fixedAboveKeyboard` | `boolean`                                                                  | `true`      | 키보드 위에 고정   |
| `type`               | `'button' \| 'submit' \| 'reset'`                                          | `'button'`  | 버튼 타입          |
| `className`          | `string`                                                                   | -           | 컨테이너 클래스    |
| `buttonClassName`    | `string`                                                                   | -           | 버튼 클래스        |
| `asChild`            | `boolean`                                                                  | `false`     | Radix asChild 패턴 |

### BottomCTA.Double

| Prop                   | Type        | Default | Description             |
| ---------------------- | ----------- | ------- | ----------------------- |
| `leftButton`           | `ReactNode` | -       | 왼쪽 버튼 (보통 취소)   |
| `rightButton`          | `ReactNode` | -       | 오른쪽 버튼 (보통 확인) |
| `fixed`                | `boolean`   | `false` | 하단 고정 여부          |
| `transparent`          | `boolean`   | `false` | 배경 투명 여부          |
| `animated`             | `boolean`   | `false` | 등장 애니메이션         |
| `hideOnScroll`         | `boolean`   | `false` | 스크롤 시 숨김          |
| `fixedAboveKeyboard`   | `boolean`   | `true`  | 키보드 위에 고정        |
| `className`            | `string`    | -       | 컨테이너 클래스         |
| `buttonGroupClassName` | `string`    | -       | 버튼 그룹 클래스        |

### CTAButton

| Prop       | Type                                                                       | Default     | Description        |
| ---------- | -------------------------------------------------------------------------- | ----------- | ------------------ |
| `children` | `ReactNode`                                                                | -           | 버튼 텍스트        |
| `variant`  | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'blue' \| 'unstyled'` | `'primary'` | 버튼 variant       |
| `color`    | `'primary' \| 'grey' \| ...`                                               | `'primary'` | 버튼 color         |
| `loading`  | `boolean`                                                                  | `false`     | 로딩 상태          |
| `disabled` | `boolean`                                                                  | `false`     | 비활성화 상태      |
| `onClick`  | `(e: MouseEvent) => void`                                                  | -           | 클릭 핸들러        |
| `type`     | `'button' \| 'submit' \| 'reset'`                                          | `'button'`  | 버튼 타입          |
| `asChild`  | `boolean`                                                                  | `false`     | Radix asChild 패턴 |

**참고**: CTAButton은 항상 `size="lg"`, `fullWidth`로 렌더링됩니다.

## 실전 예시

### 폼 제출

```tsx
<form onSubmit={handleSubmit}>
  {/* 폼 필드들 */}

  <FixedBottomCTA type="submit" loading={isSubmitting}>
    저장하기
  </FixedBottomCTA>
</form>
```

### 확인/취소 다이얼로그

```tsx
<Dialog>
  <Dialog.Content>
    <Dialog.Header title="정말 삭제하시겠습니까?" />
    <Dialog.Body>
      <p>이 작업은 되돌릴 수 없습니다.</p>
    </Dialog.Body>

    <BottomCTA.Double
      leftButton={
        <CTAButton variant="secondary" color="grey" onClick={onCancel}>
          취소
        </CTAButton>
      }
      rightButton={
        <CTAButton color="red" onClick={onConfirm}>
          삭제
        </CTAButton>
      }
    />
  </Dialog.Content>
</Dialog>
```

### 긴 스크롤 페이지

```tsx
<div className={s.longPage}>
  {/* 긴 콘텐츠 */}

  {/* 스크롤 시 자동으로 숨김/표시 */}
  <FixedBottomCTA hideOnScroll onClick={handleNext}>
    다음 단계
  </FixedBottomCTA>
</div>
```

## TDS와의 차이점

### 유사점

- `FixedBottomCTA` = `BottomCTA` with `fixed={true}` 구조
- Single/Double 서브컴포넌트 패턴
- CTAButton 별도 컴포넌트
- hideOnScroll 기능

### 차이점

- **Variant 이름**: TDS는 'fill', 'weak' 등 사용, 우리는 'primary', 'secondary' 등 사용
- **Props 구조**: TDS는 `leftButton`, `rightButton`에 직접 CTAButton 전달, 우리도 동일하게 구현
- **추가 기능**: `fixedAboveKeyboard` (키보드 대응), `animated` (등장 애니메이션) 추가

## 마이그레이션 가이드

### 기존 코드

```tsx
// 이전
<BottomCTA.Single
  fixed={false}
  buttonVariant="blue" // ❌ 잘못된 prop
>
  확인
</BottomCTA.Single>
```

### 새로운 코드

```tsx
// 이후
<BottomCTA.Single
  fixed={false}
  variant="blue"  // ✅ 올바른 prop
>
  확인
</BottomCTA.Single>

// 또는 CTAButton 직접 사용
<CTAButton variant="blue">
  확인
</CTAButton>
```
