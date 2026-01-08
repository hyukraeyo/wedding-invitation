import { Palette } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { BuilderLabel } from '../BuilderLabel';
import { BuilderButtonGroup } from '../BuilderButtonGroup';
import { BuilderButton } from '../BuilderButton';
import { BuilderSelect } from '../BuilderSelect';
import { BuilderToggle } from '../BuilderToggle';

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
            <div className="space-y-6">

                {/* Font */}
                <div>
                    <BuilderLabel>글꼴</BuilderLabel>
                    <BuilderSelect
                        value={theme.font}
                        options={fontOptions}
                        onChange={(val: 'pretendard' | 'gmarket' | 'gowun-batang' | 'gowun-dodum' | 'nanum-myeongjo' | 'yeon-sung' | 'do-hyeon' | 'song-myung' | 'serif' | 'sans') => setTheme({ font: val })}
                    />
                </div>

                {/* Font Scale */}
                <div>
                    <BuilderLabel>폰트 크기 ({theme.fontScale.toFixed(1)}x)</BuilderLabel>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min="1"
                            max="1.5"
                            step="0.1"
                            value={theme.fontScale}
                            onChange={(e) => setTheme({ fontScale: parseFloat(e.target.value) })}
                            className="flex-1 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                            style={{ accentColor: theme.accentColor }}
                        />
                        <div className="flex gap-2">
                            <BuilderButton
                                variant="outline"
                                size="sm"
                                onClick={() => setTheme({ fontScale: Math.max(1, theme.fontScale - 0.1) })}
                                className="w-8 h-8 p-0"
                            >
                                -
                            </BuilderButton>
                            <BuilderButton
                                variant="outline"
                                size="sm"
                                onClick={() => setTheme({ fontScale: Math.min(1.5, theme.fontScale + 0.1) })}
                                className="w-8 h-8 p-0"
                            >
                                +
                            </BuilderButton>
                        </div>
                    </div>
                </div>

                {/* Background Color */}
                <div>
                    <BuilderLabel>배경 색상</BuilderLabel>
                    <div className="flex gap-3 px-1">
                        {['#FFFFFF', '#F9F8E6', '#FFEFF4', '#F4F1EA', '#EDF2F7'].map((color) => (
                            <button
                                key={color}
                                onClick={() => setTheme({ backgroundColor: color })}
                                className={`w-8 h-8 rounded-full border shadow-sm transition-transform hover:scale-110 flex items-center justify-center ${theme.backgroundColor === color ? 'ring-2 ring-offset-2' : 'border-gray-100'}`}
                                style={{
                                    backgroundColor: color,
                                    borderColor: theme.backgroundColor === color ? theme.accentColor : '#F3F4F6',
                                    boxShadow: theme.backgroundColor === color ? `0 0 0 2px white, 0 0 0 4px ${theme.accentColor}` : 'none'
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Accent Color */}
                <div>
                    <BuilderLabel>강조 색상</BuilderLabel>
                    <div className="flex gap-3 px-1">
                        {['#D4AF37', '#9A8C98', '#2C3E50', '#C0392B'].map((color) => (
                            <button
                                key={color}
                                onClick={() => setTheme({ accentColor: color })}
                                className={`w-8 h-8 rounded-full border shadow-sm transition-transform hover:scale-110 flex items-center justify-center ${theme.accentColor === color ? 'ring-2 ring-offset-2' : 'border-gray-100'}`}
                                style={{
                                    backgroundColor: color,
                                    borderColor: theme.accentColor === color ? theme.accentColor : '#F3F4F6',
                                    boxShadow: theme.accentColor === color ? `0 0 0 2px white, 0 0 0 4px ${theme.accentColor}` : 'none'
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Pattern */}
                <div>
                    <BuilderLabel>배경 패턴</BuilderLabel>
                    <BuilderButtonGroup
                        value={theme.pattern}
                        options={[
                            { label: '없음', value: 'none' },
                            { label: '작은 꽃', value: 'flower-sm' },
                            { label: '큰 꽃', value: 'flower-lg' },
                        ]}
                        onChange={(val: 'none' | 'flower-sm' | 'flower-lg') => setTheme({ pattern: val })}
                    />
                </div>

                {/* Effect */}
                <div>
                    <BuilderLabel>배경 이펙트</BuilderLabel>
                    <BuilderButtonGroup
                        value={theme.effect}
                        options={[
                            { label: '없음', value: 'none' },
                            { label: '벚꽃', value: 'cherry-blossom' },
                            { label: '눈', value: 'snow' },
                        ]}
                        onChange={(val: 'none' | 'cherry-blossom' | 'snow') => setTheme({ effect: val })}
                    />

                    {theme.effect !== 'none' && (
                        <div className="mt-4 px-1">
                            <BuilderToggle
                                checked={theme.effectOnlyOnMain}
                                onChange={(checked) => setTheme({ effectOnlyOnMain: checked })}
                                label="메인 화면에만 이펙트 노출"
                            />
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 px-1">
                    <BuilderToggle
                        checked={theme.animateEntrance}
                        onChange={(checked) => setTheme({ animateEntrance: checked })}
                        label="스크롤 등장 효과"
                    />

                    <BuilderToggle
                        checked={theme.showSubtitleEng}
                        onChange={(checked) => setTheme({ showSubtitleEng: checked })}
                        label="영문 소제목 표시"
                    />
                </div>

            </div>
        </AccordionItem>
    );
}
