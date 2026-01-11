import React from 'react';
import { Palette, Check, Plus } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { SegmentedControl } from '../SegmentedControl';
import { Field } from '../Field';
import styles from './ThemeSection.module.scss';
import { cn } from '@/lib/utils';

interface SectionProps {
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

export default function ThemeSection({ isOpen, onToggle }: SectionProps) {
    const {
        theme, setTheme
    } = useInvitationStore();

    return (
        <AccordionItem
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
                    <SegmentedControl
                        value={theme.font}
                        options={[
                            { label: '고딕', value: 'sans' },
                            { label: '명조', value: 'serif' },
                            { label: 'Pretendard', value: 'pretendard' },
                        ]}
                        onChange={(val) => setTheme({ font: val as 'sans' | 'serif' | 'pretendard' })}
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
