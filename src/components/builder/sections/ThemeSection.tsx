import React from 'react';
import { Check } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useInvitationStore } from '@/store/useInvitationStore';
import { BoardRow } from '@/components/ui/BoardRow';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { MenuSelect } from '@/components/ui/MenuSelect';
import { Switch } from '@/components/ui/Switch';
import { List, ListRow } from '@/components/ui/List';
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
                    }
                />

                <ListRow
                    title="Font"
                    contents={
                        <MenuSelect
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
                            onValueChange={(val: string) => setTheme({ font: val as ThemeFont })}
                        />
                    }
                />

                <ListRow
                    title="Font scale"
                    contents={
                        <SegmentedControl
                            alignment="fluid"
                            value={String(theme.fontScale || '1')}
                            onChange={(val: string) => setTheme({ fontScale: Number(val) })}
                        >
                            <SegmentedControl.Item value="1">
                                Default
                            </SegmentedControl.Item>
                            <SegmentedControl.Item value="1.1">
                                Medium
                            </SegmentedControl.Item>
                            <SegmentedControl.Item value="1.2">
                                Large
                            </SegmentedControl.Item>
                        </SegmentedControl>
                    }
                />

                <ListRow
                    title="Allow guest font scaling"
                    right={
                        <Switch
                            checked={theme.allowFontScale}
                            onCheckedChange={(checked) => setTheme({ allowFontScale: checked })}
                        />
                    }
                />

                <ListRow
                    title="Background pattern"
                    contents={
                        <SegmentedControl
                            alignment="fluid"
                            value={theme.pattern || 'none'}
                            onChange={(val: string) => setTheme({ pattern: val as 'none' | 'flower-sm' | 'flower-lg' })}
                        >
                            <SegmentedControl.Item value="none">
                                None
                            </SegmentedControl.Item>
                            <SegmentedControl.Item value="flower-sm">
                                Small floral
                            </SegmentedControl.Item>
                            <SegmentedControl.Item value="flower-lg">
                                Large floral
                            </SegmentedControl.Item>
                        </SegmentedControl>
                    }
                />

                <ListRow
                    title="Background color"
                    contents={
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
                    }
                />
            </List>
        </BoardRow>
    );
});

export default ThemeSection;
