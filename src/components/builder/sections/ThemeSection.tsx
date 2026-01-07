import React from 'react';
import { Palette } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { BuilderLabel } from '../BuilderLabel';
import { BuilderCheckbox } from '../BuilderCheckbox';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function ThemeSection({ isOpen, onToggle }: SectionProps) {
    const { theme, setTheme } = useInvitationStore();

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
                    <div className="flex gap-3">
                        <select
                            value={theme.font}
                            onChange={(e) => setTheme({ font: e.target.value as 'serif' | 'sans' })}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-forest-green text-gray-900"
                        >
                            <option value="serif">명조체 (Serif)</option>
                            <option value="sans">고딕체 (Sans)</option>
                        </select>
                    </div>
                </div>

                {/* Font Scale */}
                <div>
                    <BuilderLabel>폰트 크기 ({theme.fontScale}x)</BuilderLabel>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={theme.fontScale}
                            onChange={(e) => setTheme({ fontScale: parseFloat(e.target.value) })}
                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={() => setTheme({ fontScale: Math.max(0.5, theme.fontScale - 0.1) })}
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition-colors"
                            >
                                -
                            </button>
                            <button
                                onClick={() => setTheme({ fontScale: Math.min(2, theme.fontScale + 0.1) })}
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition-colors"
                            >
                                +
                            </button>
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        0.5x ~ 2x 범위에서 조절 가능합니다
                    </div>
                </div>

                {/* Background Color */}
                <div>
                    <BuilderLabel>배경 색상</BuilderLabel>
                    <div className="flex gap-3">
                        {['#F9F8E6', '#FFEFF4', '#F4F1EA', '#EDF2F7', '#FFFFFF'].map((color) => (
                            <button
                                key={color}
                                onClick={() => setTheme({ backgroundColor: color })}
                                className={`w-8 h-8 rounded-full border shadow-sm transition-transform hover:scale-110 flex items-center justify-center ${theme.backgroundColor === color ? 'ring-2 ring-forest-green ring-offset-2' : 'border-gray-200'}`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                </div>

                {/* Accent Color */}
                <div>
                    <BuilderLabel>강조 색상</BuilderLabel>
                    <div className="flex gap-3">
                        {['#4A5D45', '#D4AF37', '#9A8C98', '#2C3E50', '#C0392B'].map((color) => (
                            <button
                                key={color}
                                onClick={() => setTheme({ accentColor: color })}
                                className={`w-8 h-8 rounded-full border shadow-sm transition-transform hover:scale-110 flex items-center justify-center ${theme.accentColor === color ? 'ring-2 ring-forest-green ring-offset-2' : 'border-gray-200'}`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                </div>

                {/* Pattern */}
                <div>
                    <BuilderLabel>배경 패턴</BuilderLabel>
                    <div className="flex gap-3">
                        {['none', 'flower-sm', 'flower-lg'].map((opt) => (
                            <button
                                key={opt}
                                onClick={() => setTheme({ pattern: opt as 'none' | 'flower-sm' | 'flower-lg' })}
                                className={`flex-1 py-2 text-xs rounded-lg border transition-all ${theme.pattern === opt
                                    ? 'bg-forest-green text-white border-forest-green'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {opt === 'none' ? '없음' : opt === 'flower-sm' ? '작은 꽃' : '큰 꽃'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Effect */}
                <div>
                    <BuilderLabel>배경 이펙트</BuilderLabel>
                    <div className="flex flex-wrap gap-2">
                        {['none', 'cherry-blossom', 'snow', 'leaves', 'forsythia', 'babys-breath'].map((opt) => (
                            <button
                                key={opt}
                                onClick={() => setTheme({ effect: opt as 'none' | 'cherry-blossom' | 'snow' | 'leaves' | 'forsythia' | 'babys-breath' })}
                                className={`flex-1 min-w-[60px] py-2 text-xs rounded-lg border transition-all ${theme.effect === opt
                                    ? 'bg-forest-green text-white border-forest-green'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {opt === 'none' ? '없음' :
                                    opt === 'cherry-blossom' ? '벚꽃' :
                                        opt === 'snow' ? '눈' :
                                            opt === 'leaves' ? '낙엽' :
                                                opt === 'forsythia' ? '개나리' : '안개꽃'}
                            </button>
                        ))}
                    </div>

                    {theme.effect !== 'none' && (
                        <div className="mt-4 pl-1 animate-in fade-in slide-in-from-top-1">
                            <BuilderCheckbox
                                checked={theme.effectOnlyOnMain}
                                onChange={(checked) => setTheme({ effectOnlyOnMain: checked })}
                                className="!items-start"
                            >
                                <span className="text-xs text-gray-400 group-hover:text-forest-green transition-colors">메인 화면에만 이펙트 보이게 설정</span>
                            </BuilderCheckbox>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-3 pt-2 border-t border-gray-100">
                    <BuilderCheckbox
                        checked={theme.animateEntrance}
                        onChange={(checked) => setTheme({ animateEntrance: checked })}
                    >
                        스크롤 샤르륵 등장 효과
                    </BuilderCheckbox>

                    <BuilderCheckbox
                        checked={theme.showSubtitleEng}
                        onChange={(checked) => setTheme({ showSubtitleEng: checked })}
                    >
                        영문 소제목 표시
                    </BuilderCheckbox>
                </div>

            </div>
        </AccordionItem>
    );
}
