import React from 'react';
import { Palette } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { BuilderLabel } from '../BuilderLabel';

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
                <div className="space-y-3">
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

                {/* Background Color */}
                <div className="space-y-3">
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
                <div className="space-y-3">
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
                <div className="space-y-3">
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
                <div className="space-y-3">
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

                    {/* Effect Option */}
                    {theme.effect !== 'none' && (
                        <label className="flex items-center gap-2 cursor-pointer mt-2 pl-1 animate-in fade-in slide-in-from-top-1">
                            <input
                                type="checkbox"
                                checked={theme.effectOnlyOnMain}
                                onChange={(e) => setTheme({ effectOnlyOnMain: e.target.checked })}
                                className="w-3.5 h-3.5 rounded border-2 border-gray-300 bg-white checked:bg-forest-green checked:border-forest-green focus:ring-forest-green cursor-pointer"
                            />
                            <span className="text-xs text-gray-500 hover:text-forest-green transition-colors">메인 화면에만 이펙트 보이게 설정</span>
                        </label>
                    )}
                </div>

                {/* Options */}
                <div className="space-y-3 pt-2 border-t border-gray-100">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={theme.animateEntrance}
                            onChange={(e) => setTheme({ animateEntrance: e.target.checked })}
                            className="w-4 h-4 rounded border-2 border-gray-300 bg-white checked:bg-forest-green checked:border-forest-green focus:ring-forest-green cursor-pointer"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-forest-green transition-colors">스크롤 샤르륵 등장 효과</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={theme.showSubtitleEng}
                            onChange={(e) => setTheme({ showSubtitleEng: e.target.checked })}
                            className="w-4 h-4 rounded border-2 border-gray-300 bg-white checked:bg-forest-green checked:border-forest-green focus:ring-forest-green cursor-pointer"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-forest-green transition-colors">영문 소제목 표시</span>
                    </label>
                </div>

            </div>
        </AccordionItem>
    );
}
