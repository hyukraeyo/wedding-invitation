import React from 'react';
import { Check } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useInvitationStore } from '@/store/useInvitationStore';
import { SectionAccordion } from '@/components/ui/Accordion';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { MenuSelect } from '@/components/ui/MenuSelect';
import { Switch } from '@/components/ui/Switch';
import { Button } from '@/components/ui/Button';
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
    const theme = useInvitationStore(useShallow(state => state.theme));
    const setTheme = useInvitationStore(state => state.setTheme);

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
                                    variant="weak"
                                    className={cn(
                                        styles.colorItem,
                                        styles.colorItemInteractive,
                                        theme.accentColor === color && styles.active
                                    )}
                                    style={{ backgroundColor: color, padding: 0, minWidth: 0, height: '32px', width: '32px' }}
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
                    <div className={styles.rowTitle}>글꼴</div>
                    <MenuSelect
                        value={theme.font}
                        options={[
                            { label: '고운돋움 (기본)', value: 'gowun-dodum' as ThemeFont },
                            { label: 'Pretendard', value: 'pretendard' as ThemeFont },
                            { label: 'Nanum Myeongjo', value: 'nanum-myeongjo' as ThemeFont },
                            { label: '고운바탕', value: 'gowun-batang' as ThemeFont },
                            { label: '송명', value: 'song-myung' as ThemeFont },
                            { label: '연성', value: 'yeon-sung' as ThemeFont },
                            { label: '도현', value: 'do-hyeon' as ThemeFont },
                            { label: '지마켓 산스', value: 'gmarket' as ThemeFont },
                            { label: '세리프', value: 'serif' as ThemeFont },
                            { label: '산세리프', value: 'sans' as ThemeFont },
                        ]}
                        onValueChange={(val: string) => setTheme({ font: val as ThemeFont })}
                    />
                </div>

                <div className={styles.optionItem}>
                    <div className={styles.rowTitle}>글자 크기</div>
                    <SegmentedControl
                        alignment="fluid"
                        value={String(theme.fontScale || '1')}
                        onChange={(val: string) => setTheme({ fontScale: Number(val) })}
                    >
                        <SegmentedControl.Item value="1">
                            기본
                        </SegmentedControl.Item>
                        <SegmentedControl.Item value="1.1">
                            중간
                        </SegmentedControl.Item>
                        <SegmentedControl.Item value="1.2">
                            크게
                        </SegmentedControl.Item>
                    </SegmentedControl>
                </div>

                <div className={styles.optionItem}>
                    <div className={styles.rowTitle}>방문자 글자 크기 조절 허용</div>
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
                        onChange={(val: string) => setTheme({ pattern: val as 'none' | 'flower-sm' | 'flower-lg' })}
                    >
                        <SegmentedControl.Item value="none">
                            없음
                        </SegmentedControl.Item>
                        <SegmentedControl.Item value="flower-sm">
                            작은 플라워
                        </SegmentedControl.Item>
                        <SegmentedControl.Item value="flower-lg">
                            큰 플라워
                        </SegmentedControl.Item>
                    </SegmentedControl>
                </div>

                <div className={styles.optionItem}>
                    <div className={styles.rowTitle}>배경색</div>
                    <div className={styles.optionWrapper}>
                        <div className={styles.colorPicker}>
                            {['#FFFFFF', '#FFECEF', '#F4F1EA', '#F2EBFA'].map((color) => (
                                <Button
                                    key={color}
                                    variant="weak"
                                    className={cn(
                                        styles.colorItem,
                                        styles.lightColorItem,
                                        styles.colorItemInteractive,
                                        theme.backgroundColor === color && styles.active
                                    )}
                                    style={{ backgroundColor: color, padding: 0, minWidth: 0, height: '32px', width: '32px' }}
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
