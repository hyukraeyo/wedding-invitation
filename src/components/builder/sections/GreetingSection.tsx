import React, { ChangeEvent } from 'react';
import Image from 'next/image';
import { MessageSquare, Image as ImageIcon } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { BuilderLabel } from '../BuilderLabel';
import { BuilderInput } from '../BuilderInput';
import { BuilderTextarea } from '../BuilderTextarea';
import { BuilderToggle } from '../BuilderToggle';
interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function GreetingSection({ isOpen, onToggle }: SectionProps) {
    const {
        greetingTitle, setGreetingTitle,
        message, setMessage,
        imageUrl, setImageUrl,
        showNamesAtBottom, setShowNamesAtBottom,
        sortNames, setSortNames,
        enableFreeformNames, setEnableFreeformNames,
        groomNameCustom, setGroomNameCustom,
        brideNameCustom, setBrideNameCustom
    } = useInvitationStore();

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImageUrl(url);
        }
    };

    return (
        <AccordionItem
            title="인사말"
            icon={MessageSquare}
            isOpen={isOpen}
            onToggle={onToggle}
            isCompleted={message.length > 0}
        >
            <div className="space-y-6">
                {/* Title */}
                <div>
                    <BuilderLabel>제목</BuilderLabel>
                    <BuilderInput
                        type="text"
                        value={greetingTitle}
                        onChange={(e) => setGreetingTitle(e.target.value)}
                        placeholder="예: 소중한 분들을 초대합니다"
                    />
                </div>

                {/* Content with Toolbar */}
                <div>
                    <div className="flex items-center justify-between">
                        <BuilderLabel>내용</BuilderLabel>
                        <button className="text-xs text-red-500 underline hover:text-red-600 font-medium">샘플 문구 보기</button>
                    </div>

                    <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-black/5">
                        {/* Toolbar */}
                        <div className="flex items-center gap-1 p-2 border-b border-gray-50 bg-gray-50/30">
                            <button className="w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-lg text-gray-600 transition-all font-bold">B</button>
                            <button className="w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-lg text-gray-600 transition-all italic font-serif">I</button>
                            <button className="w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-lg text-gray-600 transition-all underline">U</button>
                            <div className="w-[1px] h-4 bg-gray-200 mx-1"></div>
                            <button className="w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-lg text-gray-600 transition-all text-sm">A</button>
                            <button className="w-8 h-8 flex items-center justify-center bg-gray-900 text-white shadow-md shadow-black/10 rounded-lg text-sm">A</button>
                            <div className="w-[1px] h-4 bg-gray-200 mx-1"></div>
                            <button className="w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-lg text-gray-500 transition-all">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="21" x2="3" y1="6" y2="6" /><line x1="21" x2="9" y1="12" y2="12" /><line x1="21" x2="7" y1="18" y2="18" /></svg>
                            </button>
                        </div>

                        <BuilderTextarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="bg-white px-5 py-5 min-h-[220px] text-[15px] leading-[1.8] border-none focus:ring-0"
                            placeholder="축하해주시는 분들께 전할 소중한 메시지를 입력하세요."
                        />
                    </div>
                </div>

                {/* Photo Upload */}
                <div>
                    <BuilderLabel>사진</BuilderLabel>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl w-32 h-32 hover:border-forest-green/40 transition-colors bg-gray-50 group cursor-pointer relative overflow-hidden">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />

                        {imageUrl ? (
                            <div className="absolute inset-0">
                                <Image src={imageUrl} alt="Greeting" fill className="object-cover" />
                                <button
                                    onClick={(e) => { e.preventDefault(); setImageUrl(null); }}
                                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 z-20"
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center h-full space-y-1">
                                <ImageIcon size={20} className="text-gray-400 group-hover:text-forest-green" />
                                <span className="text-[10px] text-gray-400">사진 추가</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Name Options */}
                <div className="pt-2">
                    <BuilderLabel>성함 표기</BuilderLabel>

                    <div className="flex flex-wrap gap-2 px-1">
                        <BuilderToggle
                            checked={showNamesAtBottom}
                            onChange={setShowNamesAtBottom}
                            label="성함 표시"
                        />
                        <BuilderToggle
                            checked={sortNames}
                            onChange={setSortNames}
                            label="항목 정렬"
                        />
                        <BuilderToggle
                            checked={enableFreeformNames}
                            onChange={setEnableFreeformNames}
                            label="성함 자유 입력"
                        />
                    </div>

                    {enableFreeformNames && (
                        <div className="space-y-3 pl-6 animate-fadeIn">
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500">신랑측 표기</label>
                                <BuilderTextarea
                                    value={groomNameCustom}
                                    onChange={(e) => setGroomNameCustom(e.target.value)}
                                    className="h-16 text-xs"
                                    placeholder="예: 아버님 성함 · 어머님 성함 의 장남 OOO"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500">신부측 표기</label>
                                <BuilderTextarea
                                    value={brideNameCustom}
                                    onChange={(e) => setBrideNameCustom(e.target.value)}
                                    className="h-16 text-xs"
                                    placeholder="예: 아버님 성함 · 어머님 성함 의 장녀 OOO"
                                />
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </AccordionItem>
    );
}
