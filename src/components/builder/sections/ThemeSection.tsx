import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useInvitationStore } from '@/store/useInvitationStore';
import { SectionAccordion } from '@/components/ui/Accordion';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Switch } from '@/components/ui/Switch';
import { FormControl, FormField, FormHeader, FormLabel } from '@/components/ui/Form';
import { ColorPicker, type ColorOption } from '@/components/common/ColorPicker';
import { FontPicker } from '@/components/common/FontPicker';
import styles from './ThemeSection.module.scss';
import type { ThemeFont } from '@/lib/utils/font';
import type { SectionProps } from '@/types/builder';

const PRESET_ACCENT_COLORS: ColorOption[] = [
  { value: '#C19A6D', label: 'Soft Brown' },
  { value: '#545454', label: 'Dark Gray' },
  { value: '#FFB7B2', label: 'Soft Pink' },
  { value: '#D7A7BE', label: 'Soft Mauve' },
];

const PRESET_BG_COLORS: ColorOption[] = [
  { value: '#FFFFFF', label: 'Basic White' },
  { value: '#FFECEF', label: 'Soft Pink' },
  { value: '#F4F1EA', label: 'Soft Beige' },
  { value: '#F2EBFA', label: 'Soft Purple' },
];

const ThemeSection = React.memo<SectionProps>(function ThemeSection(props) {
  const theme = useInvitationStore(useShallow((state) => state.theme));
  const setTheme = useInvitationStore((state) => state.setTheme);

  return (
    <SectionAccordion
      title="테마 및 색상"
      value="theme"
      isOpen={props.isOpen}
      onToggle={props.onToggle}
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
          <FontPicker
            value={theme.font}
            onChange={(val) => setTheme({ font: val as ThemeFont })}
            options={[
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
            ]}
          />
        </FormField>

        <FormField name="fontScale">
          <FormHeader>
            <FormLabel>글자 크기</FormLabel>
          </FormHeader>
          <FormControl asChild>
            <SegmentedControl
              alignment="fluid"
              value={String(theme.fontScale || '1')}
              onChange={(val: string) => setTheme({ fontScale: Number(val) })}
            >
              <SegmentedControl.Item value="1">기본</SegmentedControl.Item>
              <SegmentedControl.Item value="1.1">중간</SegmentedControl.Item>
              <SegmentedControl.Item value="1.2">크게</SegmentedControl.Item>
            </SegmentedControl>
          </FormControl>
        </FormField>

        <FormField name="allowFontScale">
          <div className={styles.rowBetween}>
            <FormLabel>글자 크기 조절 허용</FormLabel>
            <FormControl asChild>
              <Switch
                checked={theme.allowFontScale}
                onCheckedChange={(checked) => setTheme({ allowFontScale: checked })}
              />
            </FormControl>
          </div>
        </FormField>

        <FormField name="pattern">
          <FormHeader>
            <FormLabel>배경 패턴</FormLabel>
          </FormHeader>
          <FormControl asChild>
            <SegmentedControl
              alignment="fluid"
              value={theme.pattern || 'none'}
              onChange={(val: string) =>
                setTheme({ pattern: val as 'none' | 'flower-sm' | 'flower-lg' })
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
