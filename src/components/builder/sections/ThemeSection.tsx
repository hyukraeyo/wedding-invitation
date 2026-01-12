import React from 'react';
import { Palette, Check, Plus } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { SegmentedControl } from '../SegmentedControl';
import { Select } from '../Select';
import { Field } from '../Field';
import styles from './ThemeSection.module.scss';
import { cn } from '@/lib/utils';

interface SectionProps {
    value: string;
    isOpen: boolean;
    onToggle: () => void;
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

export default function ThemeSection({ isOpen, onToggle, value }: SectionProps) {
    const {
        theme, setTheme
    } = useInvitationStore();

    return (
        <AccordionItem
            value={value}
            title="테마 및 색상"
            icon={Palette}
            isOpen={isOpen}
            onToggle={onToggle}
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
                            { label: 'Pretendard (기본)', value: 'pretendard' },
                            { label: '나눔명조', value: 'nanum-myeongjo' },
                            { label: '고운바탕', value: 'gowun-batang' },
                            { label: '고운돋움', value: 'gowun-dodum' },
                            { label: '송명체', value: 'song-myung' },
                            { label: '연성체', value: 'yeon-sung' },
                            { label: '도현체', value: 'do-hyeon' },
                            { label: 'G마켓 산스', value: 'gmarket' },
                            { label: '기본 명조', value: 'serif' },
                            { label: '기본 고딕', value: 'sans' },
                        ]}
                        onChange={(val) => setTheme({ font: val as 'pretendard' | 'nanum-myeongjo' | 'gowun-batang' | 'gowun-dodum' | 'song-myung' | 'yeon-sung' | 'do-hyeon' | 'gmarket' | 'serif' | 'sans' })}
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
}
