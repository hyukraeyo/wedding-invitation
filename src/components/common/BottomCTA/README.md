# BottomCTA ì»´í¬?ŒíŠ¸

TDS(Toss Design System) ?¨í„´???°ë¥´???˜ë‹¨ CTA(Call-to-Action) ë²„íŠ¼ ì»´í¬?ŒíŠ¸?…ë‹ˆ??

## ì£¼ìš” ?¹ì§•

- **TDS ?¨í„´ ì¤€??*: Toss Design System??BottomCTA êµ¬ì¡°ë¥??°ë¦…?ˆë‹¤
- **CTAButton ?µí•©**: ë³„ë„??CTAButton ì»´í¬?ŒíŠ¸ë¥??œìš©?˜ì—¬ ?¼ê???ë²„íŠ¼ ?¤í????œê³µ
- **hideOnScroll ì§€??*: ?¤í¬ë¡????ë™?¼ë¡œ ?¨ê?/?œì‹œ ? ë‹ˆë©”ì´??
- **ëª¨ë°”??ìµœì ??*: Safe area, ?¤ë³´???€????ëª¨ë°”???˜ê²½ ìµœì ??
- **? ì—°??API**: Single/Double ?¨í„´, Fixed ?˜í¼ ?œê³µ

## ì»´í¬?ŒíŠ¸ êµ¬ì¡°

```
BottomCTA
?œâ??€ BottomCTA.Single    # ?¨ì¼ ë²„íŠ¼
?œâ??€ BottomCTA.Double    # ??ê°?ë²„íŠ¼
FixedBottomCTA          # ??ƒ ê³ ì • (BottomCTA.Single??fixed={true} ?˜í¼)
?”â??€ FixedBottomCTA.Double  # ??ƒ ê³ ì • Double
CTAButton               # CTA ?„ìš© ë²„íŠ¼ ì»´í¬?ŒíŠ¸
```

## ?¬ìš© ?ˆì‹œ

### 1. ê¸°ë³¸ ?¬ìš© (Single)

```tsx
import { BottomCTA } from '@/components/common/BottomCTA';

// ?¼ë°˜ ë²„íŠ¼ (ê³ ì • ????
<BottomCTA.Single>
  ?•ì¸
</BottomCTA.Single>

// ?˜ë‹¨ ê³ ì •
<BottomCTA.Single fixed>
  ?•ì¸
</BottomCTA.Single>

// variant ì»¤ìŠ¤?°ë§ˆ?´ì§•
<BottomCTA.Single variant="secondary" color="grey">
  ì·¨ì†Œ
</BottomCTA.Single>
```

### 2. Double ë²„íŠ¼

```tsx
import { BottomCTA, CTAButton } from '@/components/ui';

<BottomCTA.Double
  fixed
  leftButton={
    <CTAButton variant="secondary" color="grey">
      ì·¨ì†Œ
    </CTAButton>
  }
  rightButton={<CTAButton>?•ì¸</CTAButton>}
/>;
```

### 3. FixedBottomCTA (??ƒ ê³ ì •)

```tsx
import { FixedBottomCTA, CTAButton } from '@/components/ui';

// Single (ê¸°ë³¸)
<FixedBottomCTA>
  ?•ì¸
</FixedBottomCTA>

// Double
<FixedBottomCTA.Double
  leftButton={<CTAButton variant="secondary" color="grey">ì·¨ì†Œ</CTAButton>}
  rightButton={<CTAButton>?•ì¸</CTAButton>}
/>
```

### 4. hideOnScroll (?¤í¬ë¡?? ë‹ˆë©”ì´??

```tsx
// ?¤í¬ë¡????ë™ ?¨ê?/?œì‹œ
<BottomCTA.Single fixed hideOnScroll>
  ?•ì¸
</BottomCTA.Single>

<FixedBottomCTA hideOnScroll>
  ?•ì¸
</FixedBottomCTA>
```

### 5. CTAButton ?¨ë… ?¬ìš©

```tsx
import { CTAButton } from '@/components/common/CTAButton';

// ê¸°ë³¸ (primary)
<CTAButton>?•ì¸</CTAButton>

// variant ì»¤ìŠ¤?°ë§ˆ?´ì§•
<CTAButton variant="secondary" color="grey">
  ì·¨ì†Œ
</CTAButton>

// ë¡œë”© ?íƒœ
<CTAButton loading>
  ì²˜ë¦¬ ì¤?..
</CTAButton>

// ë¹„í™œ?±í™”
<CTAButton disabled>
  ë¹„í™œ?±í™”
</CTAButton>
```

## Props

### BottomCTA.Single

| Prop                 | Type                                                                       | Default     | Description        |
| -------------------- | -------------------------------------------------------------------------- | ----------- | ------------------ |
| `children`           | `ReactNode`                                                                | -           | ë²„íŠ¼ ?ìŠ¤??       |
| `onClick`            | `(e: MouseEvent) => void`                                                  | -           | ?´ë¦­ ?¸ë“¤??       |
| `fixed`              | `boolean`                                                                  | `false`     | ?˜ë‹¨ ê³ ì • ?¬ë?     |
| `loading`            | `boolean`                                                                  | `false`     | ë¡œë”© ?íƒœ          |
| `disabled`           | `boolean`                                                                  | `false`     | ë¹„í™œ?±í™” ?íƒœ      |
| `variant`            | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'blue' \| 'unstyled'` | `'primary'` | ë²„íŠ¼ variant       |
| `color`              | `'primary' \| 'grey' \| ...`                                               | `'primary'` | ë²„íŠ¼ color         |
| `transparent`        | `boolean`                                                                  | `false`     | ë°°ê²½ ?¬ëª… ?¬ë?     |
| `animated`           | `boolean`                                                                  | `false`     | ?±ì¥ ? ë‹ˆë©”ì´??   |
| `hideOnScroll`       | `boolean`                                                                  | `false`     | ?¤í¬ë¡????¨ê?     |
| `fixedAboveKeyboard` | `boolean`                                                                  | `true`      | ?¤ë³´???„ì— ê³ ì •   |
| `type`               | `'button' \| 'submit' \| 'reset'`                                          | `'button'`  | ë²„íŠ¼ ?€??         |
| `className`          | `string`                                                                   | -           | ì»¨í…Œ?´ë„ˆ ?´ë˜??   |
| `buttonClassName`    | `string`                                                                   | -           | ë²„íŠ¼ ?´ë˜??       |
| `asChild`            | `boolean`                                                                  | `false`     | Radix asChild ?¨í„´ |

### BottomCTA.Double

| Prop                   | Type        | Default | Description             |
| ---------------------- | ----------- | ------- | ----------------------- |
| `leftButton`           | `ReactNode` | -       | ?¼ìª½ ë²„íŠ¼ (ë³´í†µ ì·¨ì†Œ)   |
| `rightButton`          | `ReactNode` | -       | ?¤ë¥¸ìª?ë²„íŠ¼ (ë³´í†µ ?•ì¸) |
| `fixed`                | `boolean`   | `false` | ?˜ë‹¨ ê³ ì • ?¬ë?          |
| `transparent`          | `boolean`   | `false` | ë°°ê²½ ?¬ëª… ?¬ë?          |
| `animated`             | `boolean`   | `false` | ?±ì¥ ? ë‹ˆë©”ì´??        |
| `hideOnScroll`         | `boolean`   | `false` | ?¤í¬ë¡????¨ê?          |
| `fixedAboveKeyboard`   | `boolean`   | `true`  | ?¤ë³´???„ì— ê³ ì •        |
| `className`            | `string`    | -       | ì»¨í…Œ?´ë„ˆ ?´ë˜??        |
| `buttonGroupClassName` | `string`    | -       | ë²„íŠ¼ ê·¸ë£¹ ?´ë˜??       |

### CTAButton

| Prop       | Type                                                                       | Default     | Description        |
| ---------- | -------------------------------------------------------------------------- | ----------- | ------------------ |
| `children` | `ReactNode`                                                                | -           | ë²„íŠ¼ ?ìŠ¤??       |
| `variant`  | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'blue' \| 'unstyled'` | `'primary'` | ë²„íŠ¼ variant       |
| `color`    | `'primary' \| 'grey' \| ...`                                               | `'primary'` | ë²„íŠ¼ color         |
| `loading`  | `boolean`                                                                  | `false`     | ë¡œë”© ?íƒœ          |
| `disabled` | `boolean`                                                                  | `false`     | ë¹„í™œ?±í™” ?íƒœ      |
| `onClick`  | `(e: MouseEvent) => void`                                                  | -           | ?´ë¦­ ?¸ë“¤??       |
| `type`     | `'button' \| 'submit' \| 'reset'`                                          | `'button'`  | ë²„íŠ¼ ?€??         |
| `asChild`  | `boolean`                                                                  | `false`     | Radix asChild ?¨í„´ |

**ì°¸ê³ **: CTAButton?€ ??ƒ `size="lg"`, `fullWidth`ë¡??Œë”ë§ë©?ˆë‹¤.

## ?¤ì „ ?ˆì‹œ

### ???œì¶œ

```tsx
<form onSubmit={handleSubmit}>
  {/* ???„ë“œ??*/}

  <FixedBottomCTA type="submit" loading={isSubmitting}>
    ?€?¥í•˜ê¸?
  </FixedBottomCTA>
</form>
```

### ?•ì¸/ì·¨ì†Œ ?¤ì´?¼ë¡œê·?

```tsx
<Dialog>
  <Dialog.Content>
    <Dialog.Header title="?•ë§ ?? œ?˜ì‹œê² ìŠµ?ˆê¹Œ?" />
    <Dialog.Body>
      <p>???‘ì—…?€ ?˜ëŒë¦????†ìŠµ?ˆë‹¤.</p>
    </Dialog.Body>

    <BottomCTA.Double
      leftButton={
        <CTAButton variant="secondary" color="grey" onClick={onCancel}>
          ì·¨ì†Œ
        </CTAButton>
      }
      rightButton={
        <CTAButton color="red" onClick={onConfirm}>
          ?? œ
        </CTAButton>
      }
    />
  </Dialog.Content>
</Dialog>
```

### ê¸??¤í¬ë¡??˜ì´ì§€

```tsx
<div className={s.longPage}>
  {/* ê¸?ì½˜í…ì¸?*/}

  {/* ?¤í¬ë¡????ë™?¼ë¡œ ?¨ê?/?œì‹œ */}
  <FixedBottomCTA hideOnScroll onClick={handleNext}>
    ?¤ìŒ ?¨ê³„
  </FixedBottomCTA>
</div>
```

## TDS?€??ì°¨ì´??

### ? ì‚¬??

- `FixedBottomCTA` = `BottomCTA` with `fixed={true}` êµ¬ì¡°
- Single/Double ?œë¸Œì»´í¬?ŒíŠ¸ ?¨í„´
- CTAButton ë³„ë„ ì»´í¬?ŒíŠ¸
- hideOnScroll ê¸°ëŠ¥

### ì°¨ì´??

- **Variant ?´ë¦„**: TDS??'fill', 'weak' ???¬ìš©, ?°ë¦¬??'primary', 'secondary' ???¬ìš©
- **Props êµ¬ì¡°**: TDS??`leftButton`, `rightButton`??ì§ì ‘ CTAButton ?„ë‹¬, ?°ë¦¬???™ì¼?˜ê²Œ êµ¬í˜„
- **ì¶”ê? ê¸°ëŠ¥**: `fixedAboveKeyboard` (?¤ë³´???€??, `animated` (?±ì¥ ? ë‹ˆë©”ì´?? ì¶”ê?

## ë§ˆì´ê·¸ë ˆ?´ì…˜ ê°€?´ë“œ

### ê¸°ì¡´ ì½”ë“œ

```tsx
// ?´ì „
<BottomCTA.Single
  fixed={false}
  buttonVariant="blue" // ???˜ëª»??prop
>
  ?•ì¸
</BottomCTA.Single>
```

### ?ˆë¡œ??ì½”ë“œ

```tsx
// ?´í›„
<BottomCTA.Single
  fixed={false}
  variant="blue"  // ???¬ë°”ë¥?prop
>
  ?•ì¸
</BottomCTA.Single>

// ?ëŠ” CTAButton ì§ì ‘ ?¬ìš©
<CTAButton variant="blue">
  ?•ì¸
</CTAButton>
```

