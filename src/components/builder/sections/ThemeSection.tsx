import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useInvitationStore } from '@/store/useInvitationStore';
import { SectionAccordion } from '@/components/ui/Accordion';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Dialog } from '@/components/ui/Dialog';
import { TextField } from '@/components/ui/TextField';
import { Switch } from '@/components/ui/Switch';
import { Button } from '@/components/ui/Button';
import { OptionList } from '@/components/ui/OptionList';
import styles from './ThemeSection.module.scss';
import { cn } from '@/lib/utils';
import type { ThemeFont } from '@/lib/utils/font';
import type { SectionProps } from '@/types/builder';

const PRESET_COLORS = [
  '#C19A6D', // Soft Brown
  '#545454', // Dark Gray
  '#FFB7B2', // Soft Pink
  '#D7A7BE', // Soft Mauve
];

const ThemeSection = React.memo<SectionProps>(function ThemeSection(props) {
  const theme = useInvitationStore(useShallow((state) => state.theme));
  const setTheme = useInvitationStore((state) => state.setTheme);
  const [isFontOpen, setIsFontOpen] = useState(false);

  return (
    <SectionAccordion
      title="테마 및 색상"
      value="theme"
      isOpen={props.isOpen}
      onToggle={props.onToggle}
    >
      <div className={styles.container}>
        <div className={styles.optionItem}>
          <div className={styles.rowTitle}>강조색</div>
          <div className={styles.optionWrapper}>
            <div className={styles.colorPicker}>
              {PRESET_COLORS.map((color) => (
                <Button
                  key={color}
                  variant="ghost"
                  className={cn(
                    styles.colorItem,
                    styles.colorItemInteractive,
                    theme.accentColor === color && styles.active
                  )}
                  style={{
                    backgroundColor: color,
                    padding: 0,
                    minWidth: 0,
                    height: '32px',
                    width: '32px',
                  }}
                  type="button"
                  onClick={() => setTheme({ accentColor: color })}
                >
                  {theme.accentColor === color ? (
                    <Check size={16} className={styles.checkIcon} />
                  ) : null}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.optionItem}>
          <div className={styles.cursorPointer} onClick={() => setIsFontOpen(true)}>
            <div className={styles.rowTitle}>글꼴</div>
            <TextField.Button
              value={
                [
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
                ].find((opt) => opt.value === theme.font)?.label || theme.font
              }
              placeholder="글꼴 선택"
            />
          </div>
          <Dialog open={isFontOpen} onOpenChange={setIsFontOpen} mobileBottomSheet>
            <Dialog.Header title="글꼴 선택" visuallyHidden />
            <Dialog.Body>
              <OptionList
                value={theme.font}
                onSelect={(val) => {
                  setTheme({ font: val as ThemeFont });
                  setIsFontOpen(false);
                }}
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
            </Dialog.Body>
          </Dialog>
        </div>

        <div className={styles.optionItem}>
          <div className={styles.rowTitle}>글자 크기</div>
          <SegmentedControl
            alignment="fluid"
            value={String(theme.fontScale || '1')}
            onChange={(val: string) => setTheme({ fontScale: Number(val) })}
          >
            <SegmentedControl.Item value="1">기본</SegmentedControl.Item>
            <SegmentedControl.Item value="1.1">중간</SegmentedControl.Item>
            <SegmentedControl.Item value="1.2">크게</SegmentedControl.Item>
          </SegmentedControl>
        </div>

        <div className={styles.optionItem}>
          <div className={styles.rowTitle}>글자 크기 조절 허용</div>
          <div className={styles.rowRight}>
            <Switch
              checked={theme.allowFontScale}
              onCheckedChange={(checked) => setTheme({ allowFontScale: checked })}
            />
          </div>
        </div>

        <div className={styles.optionItem}>
          <div className={styles.rowTitle}>배경 패턴</div>
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
        </div>

        <div className={styles.optionItem}>
          <div className={styles.rowTitle}>배경색</div>
          <div className={styles.optionWrapper}>
            <div className={styles.colorPicker}>
              {['#FFFFFF', '#FFECEF', '#F4F1EA', '#F2EBFA'].map((color) => (
                <Button
                  key={color}
                  variant="ghost"
                  className={cn(
                    styles.colorItem,
                    styles.lightColorItem,
                    styles.colorItemInteractive,
                    theme.backgroundColor === color && styles.active
                  )}
                  style={{
                    backgroundColor: color,
                    padding: 0,
                    minWidth: 0,
                    height: '32px',
                    width: '32px',
                  }}
                  type="button"
                  onClick={() => setTheme({ backgroundColor: color })}
                >
                  {theme.backgroundColor === color ? (
                    <Check size={16} className={styles.checkIcon} />
                  ) : null}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionAccordion>
  );
});

export default ThemeSection;
