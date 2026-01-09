import React, { ChangeEvent } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, Camera } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { BuilderLabel } from '../BuilderLabel';
import { BuilderTextarea } from '../BuilderTextarea';

import { BuilderButtonGroup } from '../BuilderButtonGroup';
import { BuilderField } from '../BuilderField';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

const RECOMMENDED_TEXT = `장담하건대, 세상이 다 겨울이어도
우리 사랑은 늘 봄처럼 따뜻하고
간혹, 여름처럼 뜨거울 겁니다.
이수동, 사랑가`;

export default function ClosingSection({ isOpen, onToggle }: SectionProps) {
    const { closing, setClosing } = useInvitationStore();

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setClosing({ imageUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <AccordionItem
            title="엔딩 사진, 문구"
            icon={Camera}
            isOpen={isOpen}
            onToggle={onToggle}
            isCompleted={!!closing.imageUrl || !!closing.content}
            badge="강력추천😎"
        >
            <div className="space-y-6">
                {/* Photo Upload */}
                <BuilderField label="사진">
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors bg-gray-50 group cursor-pointer relative overflow-hidden min-h-[200px] flex items-center justify-center">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />

                        {closing.imageUrl ? (
                            <div className="absolute inset-0 bg-gray-900 group-hover:bg-gray-900/90 transition-colors flex items-center justify-center">
                                <div className="relative w-full h-full max-w-[200px] max-h-[200px]">
                                    <Image src={closing.imageUrl} alt="Closing" fill className="object-contain" />
                                </div>
                                <button
                                    onClick={(e) => { e.preventDefault(); setClosing({ imageUrl: null }); }}
                                    className="absolute top-2 right-2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-sm z-20 transition-all"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center space-y-3">
                                <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <ImageIcon size={24} className="text-gray-400 group-hover:text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">사진 업로드</p>
                                    <p className="text-xs text-gray-400 mt-1">클릭하여 이미지를 선택하세요</p>
                                </div>
                            </div>
                        )}
                    </div>
                </BuilderField>

                {/* Effect Selection */}
                <BuilderField label="이펙트">
                    <BuilderButtonGroup
                        value={closing.effect}
                        options={[
                            { label: '없음', value: 'none' },
                            { label: '안개', value: 'mist' },
                            { label: '물결', value: 'ripple' },
                            { label: '페이퍼', value: 'paper' },
                        ]}
                        onChange={(val: 'none' | 'mist' | 'ripple' | 'paper') => setClosing({ effect: val })}
                    />
                </BuilderField>

                {/* Ratio Selection */}
                <BuilderField label="사진 비율">
                    <BuilderButtonGroup
                        value={closing.ratio}
                        options={[
                            { label: '고정 (기본)', value: 'fixed' },
                            { label: '자동 (원본 비율)', value: 'auto' },
                        ]}
                        onChange={(val: 'fixed' | 'auto') => setClosing({ ratio: val })}
                    />
                </BuilderField>

                {/* Content Editor */}
                <BuilderField
                    label={
                        <div className="flex justify-between items-end mb-2">
                            <BuilderLabel className="!mb-0">문구 내용</BuilderLabel>
                            <button
                                onClick={() => setClosing({ content: RECOMMENDED_TEXT })}
                                className="text-xs text-gray-500 hover:text-gray-800 hover:underline transition-colors flex items-center gap-1"
                            >
                                <span>✨ 추천 문구 넣기</span>
                            </button>
                        </div>
                    }
                >
                    <div className="relative">
                        <BuilderTextarea
                            value={closing.content}
                            onChange={(e) => setClosing({ content: e.target.value })}
                            className="h-40"
                            placeholder="마무리 문구를 입력하세요..."
                        />
                    </div>
                </BuilderField>
            </div>
        </AccordionItem>
    );
}
