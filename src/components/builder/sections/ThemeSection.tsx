import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { ColorPicker, type ColorOption } from '@/components/common/ColorPicker';
import { FontPicker } from '@/components/common/FontPicker';
import { SectionAccordion } from '@/components/ui/Accordion';
import { FormControl, FormField, FormHeader, FormLabel } from '@/components/ui/Form';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { SwitchRow } from '@/components/common/SwitchRow';
import { useInvitationStore } from '@/store/useInvitationStore';
import { getFontVar, type ThemeFont } from '@/lib/utils/font';
import { PALETTE } from '@/constants/palette';
import type { SectionProps } from '@/types/builder';
import styles from './ThemeSection.module.scss';

const PRESET_ACCENT_COLORS: ColorOption[] = [
  { value: PALETTE.PRIMARY_600, label: 'Banana' },
  { value: PALETTE.STONE_700, label: 'Warm Dark' },
  { value: PALETTE.ROSE_400, label: 'Soft Rose' },
  { value: PALETTE.ACCENT_700, label: 'Forest Green' },
];

const PRESET_BG_COLORS: ColorOption[] = [
  { value: PALETTE.WHITE, label: 'Pure White' },
  { value: PALETTE.PRIMARY_50, label: 'Cream' },
  { value: PALETTE.STONE_100, label: 'Warm Stone' },
  { value: PALETTE.ROSE_50, label: 'Soft Rose' },
];

const PRESET_FONT_OPTIONS = [
  { label: '고운돋움 (기본)', value: 'gowun-dodum' },
  { label: 'Pretendard', value: 'pretendard' },
  { label: 'Nanum Myeongjo', value: 'nanum-myeongjo' },
  { label: '고운바탕', value: 'gowun-batang' },
  { label: '송명', value: 'song-myung' },
  { label: '연성', value: 'yeon-sung' },
  { label: '도현', value: 'do-hyeon' },
  { label: '지마켓 산스', value: 'gmarket' },
  { label: '세리프', value: 'serif' },
  { label: '산세리프', value: 'sans' },
].map((option) => ({
  ...option,
  style: { fontFamily: `var(${getFontVar(option.value as ThemeFont)})` },
}));

const ThemeSection = React.memo<SectionProps>(function ThemeSection(props) {
  const theme = useInvitationStore(useShallow((state) => state.theme));
  const setTheme = useInvitationStore((state) => state.setTheme);
  const validationErrors = useInvitationStore((state) => state.validationErrors);
  const isInvalid = validationErrors.includes(props.value);

  return (
    <SectionAccordion
      title="테마 및 색상"
      value={props.value}
      isOpen={props.isOpen}
      onToggle={props.onToggle}
      isInvalid={isInvalid}
    >
      <div className={styles.container}>
        <FormField name="accentColor">
          <FormHeader>
            <FormLabel>강조색</FormLabel>
          </FormHeader>
          <FormControl asChild>
            <ColorPicker
              value={theme.accentColor}
              onChange={(color: string) => setTheme({ accentColor: color })}
              colors={PRESET_ACCENT_COLORS}
            />
          </FormControl>
        </FormField>

        <FormField name="font">
          <FormHeader>
            <FormLabel>글꼴</FormLabel>
          </FormHeader>
          <FormControl asChild>
            <FontPicker
              value={theme.font}
              onChange={(value) => setTheme({ font: value as ThemeFont })}
              options={PRESET_FONT_OPTIONS}
            />
          </FormControl>
        </FormField>

        <FormField name="fontScale">
          <FormHeader>
            <FormLabel>글자 크기</FormLabel>
          </FormHeader>
          <FormControl asChild>
            <SegmentedControl
              alignment="fluid"
              value={String(theme.fontScale || '1')}
              onChange={(value: string) => setTheme({ fontScale: Number(value) })}
            >
              <SegmentedControl.Item value="1">기본</SegmentedControl.Item>
              <SegmentedControl.Item value="1.1">중간</SegmentedControl.Item>
              <SegmentedControl.Item value="1.2">크게</SegmentedControl.Item>
            </SegmentedControl>
          </FormControl>
        </FormField>

        <FormField name="allowFontScale">
          <SwitchRow
            label="글자 크기 조절 허용"
            checked={theme.allowFontScale}
            onCheckedChange={(checked) => setTheme({ allowFontScale: checked })}
          />
        </FormField>

        <FormField name="pattern">
          <FormHeader>
            <FormLabel>배경 패턴</FormLabel>
          </FormHeader>
          <FormControl asChild>
            <SegmentedControl
              alignment="fluid"
              value={theme.pattern || 'none'}
              onChange={(value: string) =>
                setTheme({ pattern: value as 'none' | 'flower-sm' | 'flower-lg' })
              }
            >
              <SegmentedControl.Item value="none">없음</SegmentedControl.Item>
              <SegmentedControl.Item value="flower-sm">작은 플라워</SegmentedControl.Item>
              <SegmentedControl.Item value="flower-lg">큰 플라워</SegmentedControl.Item>
            </SegmentedControl>
          </FormControl>
        </FormField>

        <FormField name="backgroundColor">
          <FormHeader>
            <FormLabel>배경색</FormLabel>
          </FormHeader>
          <FormControl asChild>
            <ColorPicker
              value={theme.backgroundColor}
              onChange={(color: string) => setTheme({ backgroundColor: color })}
              colors={PRESET_BG_COLORS}
            />
          </FormControl>
        </FormField>
      </div>
    </SectionAccordion>
  );
});

ThemeSection.displayName = 'ThemeSection';

export default ThemeSection;
