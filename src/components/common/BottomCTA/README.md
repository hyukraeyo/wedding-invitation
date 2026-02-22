# BottomCTA 컴포?�트

TDS(Toss Design System) ?�턴???�르???�단 CTA(Call-to-Action) 버튼 컴포?�트?�니??

## 주요 ?�징

- \*_TDS ?�턴 준??_: Toss Design System??BottomCTA 구조�??�릅?�다
- **CTAButton ?�합**: 별도??CTAButton 컴포?�트�??�용?�여 ?��???버튼 ?��????�공
- \*_hideOnScroll 지??_: ?�크�????�동?�로 ?��?/?�시 ?�니메이??
- \*_모바??최적??_: Safe area, ?�보???�????모바???�경 최적??
- **?�연??API**: Single/Double ?�턴, Fixed ?�퍼 ?�공

## 컴포?�트 구조

```
BottomCTA
?��??� BottomCTA.Single    # ?�일 버튼
?��??� BottomCTA.Double    # ??�?버튼
FixedBottomCTA          # ??�� 고정 (BottomCTA.Single??fixed={true} ?�퍼)
?��??� FixedBottomCTA.Double  # ??�� 고정 Double
CTAButton               # CTA ?�용 버튼 컴포?�트
```

## ?�용 ?�시

### 1. 기본 ?�용 (Single)

```tsx
import { BottomCTA } from '@/components/common/BottomCTA';

// ?�반 버튼 (고정 ????
<BottomCTA.Single>
  ?�인
</BottomCTA.Single>

// ?�단 고정
<BottomCTA.Single fixed>
  ?�인
</BottomCTA.Single>

// variant 커스?�마?�징
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
  rightButton={<CTAButton>?�인</CTAButton>}
/>;
```

### 3. FixedBottomCTA (??�� 고정)

```tsx
import { FixedBottomCTA, CTAButton } from '@/components/ui';

// Single (기본)
<FixedBottomCTA>
  ?�인
</FixedBottomCTA>

// Double
<FixedBottomCTA.Double
  leftButton={<CTAButton variant="secondary" color="grey">취소</CTAButton>}
  rightButton={<CTAButton>?�인</CTAButton>}
/>
```

### 4. hideOnScroll (?�크�??�니메이??

```tsx
// ?�크�????�동 ?��?/?�시
<BottomCTA.Single fixed hideOnScroll>
  ?�인
</BottomCTA.Single>

<FixedBottomCTA hideOnScroll>
  ?�인
</FixedBottomCTA>
```

### 5. CTAButton ?�독 ?�용

```tsx
import { CTAButton } from '@/components/common/CTAButton';

// 기본 (primary)
<CTAButton>?�인</CTAButton>

// variant 커스?�마?�징
<CTAButton variant="secondary" color="grey">
  취소
</CTAButton>

// 로딩 ?�태
<CTAButton loading>
  처리 �?..
</CTAButton>

// 비활?�화
<CTAButton disabled>
  비활?�화
</CTAButton>
```

## Props

### BottomCTA.Single

| Prop                 | Type                                                                       | Default     | Description        |
| -------------------- | -------------------------------------------------------------------------- | ----------- | ------------------ |
| `children`           | `ReactNode`                                                                | -           | 버튼 ?�스??        |
| `onClick`            | `(e: MouseEvent) => void`                                                  | -           | ?�릭 ?�들??        |
| `fixed`              | `boolean`                                                                  | `false`     | ?�단 고정 ?��?     |
| `loading`            | `boolean`                                                                  | `false`     | 로딩 ?�태          |
| `disabled`           | `boolean`                                                                  | `false`     | 비활?�화 ?�태      |
| `variant`            | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'blue' \| 'unstyled'` | `'primary'` | 버튼 variant       |
| `color`              | `'primary' \| 'grey' \| ...`                                               | `'primary'` | 버튼 color         |
| `transparent`        | `boolean`                                                                  | `false`     | 배경 ?�명 ?��?     |
| `animated`           | `boolean`                                                                  | `false`     | ?�장 ?�니메이??    |
| `hideOnScroll`       | `boolean`                                                                  | `false`     | ?�크�????��?       |
| `fixedAboveKeyboard` | `boolean`                                                                  | `true`      | ?�보???�에 고정    |
| `type`               | `'button' \| 'submit' \| 'reset'`                                          | `'button'`  | 버튼 ?�??          |
| `className`          | `string`                                                                   | -           | 컨테?�너 ?�래??    |
| `buttonClassName`    | `string`                                                                   | -           | 버튼 ?�래??        |
| `asChild`            | `boolean`                                                                  | `false`     | Radix asChild ?�턴 |

### BottomCTA.Double

| Prop                   | Type        | Default | Description            |
| ---------------------- | ----------- | ------- | ---------------------- |
| `leftButton`           | `ReactNode` | -       | ?�쪽 버튼 (보통 취소)  |
| `rightButton`          | `ReactNode` | -       | ?�른�?버튼 (보통 ?�인) |
| `fixed`                | `boolean`   | `false` | ?�단 고정 ?��?         |
| `transparent`          | `boolean`   | `false` | 배경 ?�명 ?��?         |
| `animated`             | `boolean`   | `false` | ?�장 ?�니메이??        |
| `hideOnScroll`         | `boolean`   | `false` | ?�크�????��?           |
| `fixedAboveKeyboard`   | `boolean`   | `true`  | ?�보???�에 고정        |
| `className`            | `string`    | -       | 컨테?�너 ?�래??        |
| `buttonGroupClassName` | `string`    | -       | 버튼 그룹 ?�래??       |

### CTAButton

| Prop       | Type                                                                       | Default     | Description        |
| ---------- | -------------------------------------------------------------------------- | ----------- | ------------------ |
| `children` | `ReactNode`                                                                | -           | 버튼 ?�스??        |
| `variant`  | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'blue' \| 'unstyled'` | `'primary'` | 버튼 variant       |
| `color`    | `'primary' \| 'grey' \| ...`                                               | `'primary'` | 버튼 color         |
| `loading`  | `boolean`                                                                  | `false`     | 로딩 ?�태          |
| `disabled` | `boolean`                                                                  | `false`     | 비활?�화 ?�태      |
| `onClick`  | `(e: MouseEvent) => void`                                                  | -           | ?�릭 ?�들??        |
| `type`     | `'button' \| 'submit' \| 'reset'`                                          | `'button'`  | 버튼 ?�??          |
| `asChild`  | `boolean`                                                                  | `false`     | Radix asChild ?�턴 |

**참고**: CTAButton?� ??�� `size="lg"`, `fullWidth`�??�더링됩?�다.

## ?�전 ?�시

### ???�출

```tsx
<form onSubmit={handleSubmit}>
  {/* ???�드??*/}

  <FixedBottomCTA type="submit" loading={isSubmitting}>
    ?�?�하�?
  </FixedBottomCTA>
</form>
```

### ?�인/취소 ?�이?�로�?

```tsx
<Dialog>
  <Dialog.Content>
    <Dialog.Header title="?�말 ??��?�시겠습?�까?" />
    <Dialog.Body>
      <p>???�업?� ?�돌�????�습?�다.</p>
    </Dialog.Body>

    <BottomCTA.Double
      leftButton={
        <CTAButton variant="secondary" color="grey" onClick={onCancel}>
          취소
        </CTAButton>
      }
      rightButton={
        <CTAButton color="red" onClick={onConfirm}>
          ??��
        </CTAButton>
      }
    />
  </Dialog.Content>
</Dialog>
```

### �??�크�??�이지

```tsx
<div className={s.longPage}>
  {/* �?콘텐�?*/}

  {/* ?�크�????�동?�로 ?��?/?�시 */}
  <FixedBottomCTA hideOnScroll onClick={handleNext}>
    ?�음 ?�계
  </FixedBottomCTA>
</div>
```

## TDS?�??차이??

### ?�사??

- `FixedBottomCTA` = `BottomCTA` with `fixed={true}` 구조
- Single/Double ?�브컴포?�트 ?�턴
- CTAButton 별도 컴포?�트
- hideOnScroll 기능

### 차이??

- **Variant ?�름**: TDS??'fill', 'weak' ???�용, ?�리??'primary', 'secondary' ???�용
- **Props 구조**: TDS??`leftButton`, `rightButton`??직접 CTAButton ?�달, ?�리???�일?�게 구현
- **추�? 기능**: `fixedAboveKeyboard` (?�보???�??, `animated` (?�장 ?�니메이?? 추�?

## 마이그레?�션 가?�드

### 기존 코드

```tsx
// ?�전
<BottomCTA.Single
  fixed={false}
  buttonVariant="blue" // ???�못??prop
>
  ?�인
</BottomCTA.Single>
```

### ?�로??코드

```tsx
// ?�후
<BottomCTA.Single
  fixed={false}
  variant="blue"  // ???�바�?prop
>
  ?�인
</BottomCTA.Single>

// ?�는 CTAButton 직접 ?�용
<CTAButton variant="blue">
  ?�인
</CTAButton>
```
