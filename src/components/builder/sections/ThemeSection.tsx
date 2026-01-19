
import React from 'react';
import { Palette, Check } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '@/components/common/AccordionItem';
import { SegmentedControl } from '@/components/common/SegmentedControl';
import { ResponsiveSelect as Select } from '@/components/common/ResponsiveSelect';
import { Field, SectionContainer } from '@/components/common/FormPrimitives';
import { SwitchField } from '@/components/common/SwitchField';
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

const ThemeSection = React.memo<SectionProps>(function ThemeSection({ isOpen, value }) {
    const theme = useInvitationStore(useShallow(state => state.theme));
    const setTheme = useInvitationStore(state => state.setTheme);

    return (
        <AccordionItem
            value={value}
            title="테마 및 색상"
            icon={Palette}
            isOpen={isOpen}
            isCompleted={true}
        >
            <SectionContainer>
                {/* Point Color */}
                <Field label="포인트 색상">
                    <div className={styles.optionWrapper}>
                        <div className={styles.colorPicker}>
                            {PRESET_COLORS.map((color) => (
                                <button
                                    key={color}
                                    className={cn(
                                        styles.colorItem,
                                        "transition-transform duration-200 active:scale-90",
                                        theme.accentColor === color && styles.active
                                    )}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setTheme({ accentColor: color })}
                                >
                                    {theme.accentColor === color ? (
                                        <Check size={16} className={styles.checkIcon} />
                                    ) : null}
                                </button>
                            ))}

                        </div>
                    </div>
                </Field>

                {/* Font Style */}
                <Field label="글꼴">
                    <Select
                        value={theme.font}
                        options={[
                            { label: '고운돋움 (기본)', value: 'gowun-dodum' as ThemeFont },
                            { label: 'Pretendard', value: 'pretendard' as ThemeFont },
                            { label: '나눔명조', value: 'nanum-myeongjo' as ThemeFont },
                            { label: '고운바탕', value: 'gowun-batang' as ThemeFont },
                            { label: '송명체', value: 'song-myung' as ThemeFont },
                            { label: '연성체', value: 'yeon-sung' as ThemeFont },
                            { label: '도현체', value: 'do-hyeon' as ThemeFont },
                            { label: 'G마켓 산스', value: 'gmarket' as ThemeFont },
                            { label: '기본 명조', value: 'serif' as ThemeFont },
                            { label: '기본 고딕', value: 'sans' as ThemeFont },
                        ]}
                        onChange={(val) => setTheme({ font: val as ThemeFont })}
                    />
                </Field>

                {/* Font Size */}
                <Field label="글자 크기">
                    <SegmentedControl
                        value={theme.fontScale || 1}
                        options={[
                            { label: '기본', value: 1 },
                            { label: '크게', value: 1.1 },
                            { label: '더 크게', value: 1.2 },
                        ]}
                        onChange={(val) => setTheme({ fontScale: val as number })}
                    />
                    <SwitchField
                        label="하객의 글자 크기 변경 허용"
                        checked={theme.allowFontScale}
                        onChange={(checked) => setTheme({ allowFontScale: checked })}
                        className="mt-3"
                    />
                </Field>

                {/* Background Pattern */}
                <Field label="배경 무늬">
                    <SegmentedControl
                        value={theme.pattern}
                        options={[
                            { label: '안함', value: 'none' },
                            { label: '작은꽃', value: 'flower-sm' },
                            { label: '큰꽃', value: 'flower-lg' },
                        ]}
                        onChange={(val) => setTheme({ pattern: val as 'none' | 'flower-sm' | 'flower-lg' })}
                    />
                </Field>

                {/* Background Color */}
                <Field label="배경 색상">
                    <div className={styles.optionWrapper}>
                        <div className={styles.colorPicker}>
                            {['#FFFFFF', '#FFECEF', '#F4F1EA', '#F2EBFA'].map((color) => (
                                <button
                                    key={color}
                                    className={cn(
                                        styles.colorItem,
                                        styles.lightColorItem,
                                        "transition-transform duration-200 active:scale-90",
                                        theme.backgroundColor === color && styles.active
                                    )}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setTheme({ backgroundColor: color })}
                                >
                                    {theme.backgroundColor === color ? (
                                        <Check size={16} className={styles.checkIcon} />
                                    ) : null}
                                </button>
                            ))}
                        </div>
                    </div>
                </Field>
            </SectionContainer>
        </AccordionItem>
    );
});

export default ThemeSection;
