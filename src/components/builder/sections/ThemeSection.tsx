import React from 'react';
import { Palette, Check, Plus } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { SegmentedControl } from '../segmented-control';
import { Select } from '../select';
import { Field } from '../FormPrimitives';
import styles from './ThemeSection.module.scss';
import { cn } from '@/lib/utils';
import type { ThemeFont } from '@/lib/utils/font';

interface SectionProps {
    value: string;
    isOpen: boolean;
}

const PRESET_COLORS = [
    '#3182F6', // Toss Blue
    '#F04452', // Toss Red
    '#19C9AD', // Toss Teal
    '#FF681B', // Toss Orange
    '#9154F3', // Toss Purple
    '#222222', // Deep Dark
    '#6B7280', // Grey
    '#BEAD9E', // Beige
];

const ThemeSection = React.memo<SectionProps>(function ThemeSection({ isOpen, value }) {
    const theme = useInvitationStore(state => state.theme);
    const setTheme = useInvitationStore(state => state.setTheme);

    return (
        <AccordionItem
            value={value}
            title="테마 및 색상"
            icon={Palette}
            isOpen={isOpen}
            isCompleted={true}
        >
            <div className={styles.container}>
                {/* Point Color */}
                <Field label="포인트 색상">
                    <div className={styles.optionWrapper}>
                        <div className={styles.colorPicker}>
                            {PRESET_COLORS.map((color) => (
                                <button
                                    key={color}
                                    className={cn(
                                        styles.colorItem,
                                        theme.accentColor === color && styles.active
                                    )}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setTheme({ accentColor: color })}
                                >
                                    {theme.accentColor === color && (
                                        <Check size={16} className={styles.checkIcon} />
                                    )}
                                </button>
                            ))}
                            <button className={styles.customColorBtn}>
                                <Plus size={16} />
                            </button>
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
                            {['#FFFFFF', '#F9F8E6', '#F4F1EA'].map((color) => (
                                <button
                                    key={color}
                                    className={cn(
                                        styles.colorItem,
                                        theme.backgroundColor === color && styles.active
                                    )}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setTheme({ backgroundColor: color })}
                                >
                                    {theme.backgroundColor === color && (
                                        <Check size={16} className={styles.checkIcon} />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </Field>
            </div>
        </AccordionItem>
    );
});

export default ThemeSection;
