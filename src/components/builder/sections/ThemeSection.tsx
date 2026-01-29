import React from 'react';
import { Check } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useInvitationStore } from '@/store/useInvitationStore';
import { BoardRow } from '@/components/ui/BoardRow';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Select } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { List, ListRow } from '@/components/ui/List';
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
    const resolvePattern = (val: string) =>
        val === 'flower-sm' ? 'flower-sm' : val === 'flower-lg' ? 'flower-lg' : 'none';

    return (
        <BoardRow
            title="Theme & Color"
            isOpened={props.isOpen}
            onOpen={() => props.onToggle?.(true)}
            onClose={() => props.onToggle?.(false)}
            icon={<BoardRow.ArrowIcon />}
        >
            <List>
                <ListRow
                    title="Accent color"
                    contents={
                        <div className={styles.optionWrapper}>
                            <div className={styles.colorPicker}>
                                {PRESET_COLORS.map((color) => (
                                    <button
                                        key={color}
                                        className={cn(
                                            styles.colorItem,
                                            styles.colorItemInteractive,
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
                    }
                />

                <ListRow
                    title="Font"
                    contents={
                        <Select
                            value={theme.font}
                            options={[
                                { label: 'Gowun Dodum (Default)', value: 'gowun-dodum' as ThemeFont },
                                { label: 'Pretendard', value: 'pretendard' as ThemeFont },
                                { label: 'Nanum Myeongjo', value: 'nanum-myeongjo' as ThemeFont },
                                { label: 'Gowun Batang', value: 'gowun-batang' as ThemeFont },
                                { label: 'Song Myung', value: 'song-myung' as ThemeFont },
                                { label: 'Yeon Sung', value: 'yeon-sung' as ThemeFont },
                                { label: 'Do Hyeon', value: 'do-hyeon' as ThemeFont },
                                { label: 'Gmarket Sans', value: 'gmarket' as ThemeFont },
                                { label: 'Serif', value: 'serif' as ThemeFont },
                                { label: 'Sans', value: 'sans' as ThemeFont },
                            ]}
                            onValueChange={(val) => setTheme({ font: val as ThemeFont })}
                        />
                    }
                />

                <ListRow
                    title="Font scale"
                    contents={
                        <Tabs
                            value={String(theme.fontScale || 1)}
                            onValueChange={(val) => setTheme({ fontScale: Number(val) })}
                        >
                            <TabsList fluid>
                                <TabsTrigger value="1">Default</TabsTrigger>
                                <TabsTrigger value="1.1">Medium</TabsTrigger>
                                <TabsTrigger value="1.2">Large</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    }
                />

                <ListRow
                    title="Allow guest font scaling"
                    right={
                        <Switch
                            checked={theme.allowFontScale}
                            onChange={(_: unknown, checked: boolean) => setTheme({ allowFontScale: checked })}
                        />
                    }
                />

                <ListRow
                    title="Background pattern"
                    contents={
                        <Tabs
                            value={theme.pattern || 'none'}
                            onValueChange={(val) => setTheme({ pattern: resolvePattern(val) })}
                        >
                            <TabsList fluid>
                                <TabsTrigger value="none">None</TabsTrigger>
                                <TabsTrigger value="flower-sm">Small floral</TabsTrigger>
                                <TabsTrigger value="flower-lg">Large floral</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    }
                />

                <ListRow
                    title="Background color"
                    contents={
                        <div className={styles.optionWrapper}>
                            <div className={styles.colorPicker}>
                                {['#FFFFFF', '#FFECEF', '#F4F1EA', '#F2EBFA'].map((color) => (
                                    <button
                                        key={color}
                                        className={cn(
                                            styles.colorItem,
                                            styles.lightColorItem,
                                            styles.colorItemInteractive,
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
                    }
                />
            </List>
        </BoardRow>
    );
});

export default ThemeSection;
