import { Palette } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { SegmentedControl } from '../SegmentedControl';
import { Select } from '../Select';
import { Switch } from '../Switch';
import { Field } from '../Field';
import { ColorPicker } from '../ColorPicker';
import { Slider } from '../Slider';
import { Section, Stack, Row } from '../Layout';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function ThemeSection({ isOpen, onToggle }: SectionProps) {
    const { theme, setTheme } = useInvitationStore();

    const fontOptions = [
        { label: '프리텐다드 (Pretendard)', value: 'pretendard' },
        { label: 'Gmarket Sans', value: 'gmarket' },
        { label: '고운 바탕', value: 'gowun-batang' },
        { label: '고운 돋움', value: 'gowun-dodum' },
        { label: '나눔 명조', value: 'nanum-myeongjo' },
        { label: '연성체', value: 'yeon-sung' },
        { label: '도현체', value: 'do-hyeon' },
        { label: '송명체', value: 'song-myung' },
        { label: '기본 명조 (Serif)', value: 'serif' },
        { label: '기본 고딕 (Sans)', value: 'sans' },
    ] as const;

    return (
        <AccordionItem
            title="테마 설정"
            icon={Palette}
            isOpen={isOpen}
            onToggle={onToggle}
            isCompleted={true}
        >
            <Section>
                {/* Font */}
                <Field label="글꼴">
                    <Select
                        value={theme.font}
                        options={fontOptions}
                        onChange={(val: 'pretendard' | 'gmarket' | 'gowun-batang' | 'gowun-dodum' | 'nanum-myeongjo' | 'yeon-sung' | 'do-hyeon' | 'song-myung' | 'serif' | 'sans') => setTheme({ font: val })}
                    />
                </Field>

                {/* Font Scale */}
                <Field label={`폰트 크기 (${theme.fontScale.toFixed(1)}x)`}>
                    <Slider
                        min={1}
                        max={1.5}
                        step={0.1}
                        value={theme.fontScale}
                        onChange={(val) => setTheme({ fontScale: val })}
                    />
                </Field>

                {/* Background Color */}
                <Field label="배경 색상">
                    <ColorPicker
                        value={theme.backgroundColor}
                        colors={['#FFFFFF', '#F9F8E6', '#FFEFF4', '#F4F1EA', '#EDF2F7']}
                        onChange={(color) => setTheme({ backgroundColor: color })}
                    />
                </Field>

                {/* Accent Color */}
                <Field label="강조 색상">
                    <ColorPicker
                        value={theme.accentColor}
                        colors={['#D4AF37', '#9A8C98', '#2C3E50', '#C0392B']}
                        onChange={(color) => setTheme({ accentColor: color })}
                    />
                </Field>

                {/* Pattern */}
                <Field label="배경 패턴">
                    <SegmentedControl
                        value={theme.pattern}
                        options={[
                            { label: '없음', value: 'none' },
                            { label: '작은 꽃', value: 'flower-sm' },
                            { label: '큰 꽃', value: 'flower-lg' },
                        ]}
                        onChange={(val: 'none' | 'flower-sm' | 'flower-lg') => setTheme({ pattern: val })}
                    />
                </Field>

                {/* Effect */}
                <Field label="배경 이펙트">
                    <Stack gap="md">
                        <SegmentedControl
                            value={theme.effect}
                            options={[
                                { label: '없음', value: 'none' },
                                { label: '벚꽃', value: 'cherry-blossom' },
                                { label: '눈', value: 'snow' },
                            ]}
                            onChange={(val: 'none' | 'cherry-blossom' | 'snow') => setTheme({ effect: val })}
                        />

                        {theme.effect !== 'none' && (
                            <Switch
                                checked={theme.effectOnlyOnMain}
                                onChange={(checked) => setTheme({ effectOnlyOnMain: checked })}
                                label="메인 화면에만 이펙트 노출"
                            />
                        )}
                    </Stack>
                </Field>

                {/* Additional Options */}
                <Field label="추가 설정">
                    <Row wrap>
                        <Switch
                            checked={theme.animateEntrance}
                            onChange={(checked) => setTheme({ animateEntrance: checked })}
                            label="스크롤 등장 효과"
                        />
                    </Row>
                </Field>
            </Section>
        </AccordionItem>
    );
}
