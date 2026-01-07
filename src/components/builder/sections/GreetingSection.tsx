import React, { ChangeEvent } from 'react';
import Image from 'next/image';
import { MessageSquare, Image as ImageIcon } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';

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
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">제목</label>
                    <input
                        type="text"
                        value={greetingTitle}
                        onChange={(e) => setGreetingTitle(e.target.value)}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:border-forest-green focus:ring-1 focus:ring-forest-green outline-none"
                        placeholder="예: 소중한 분들을 초대합니다"
                    />
                </div>

                {/* Content with Toolbar */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">내용</label>
                        <button className="text-xs text-red-500 underline hover:text-red-600 font-medium">샘플 문구 보기</button>
                    </div>

                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                        {/* Toolbar */}
                        <div className="flex items-center gap-1 p-2 border-b border-gray-100 bg-white">
                            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><strong className="font-serif font-bold">B</strong></button>
                            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><em className="font-serif italic">I</em></button>
                            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><span className="underline">U</span></button>
                            <div className="w-[1px] h-4 bg-gray-200 mx-1"></div>
                            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 text-sm">A</button>
                            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 bg-gray-800 text-white text-sm">A</button>
                            <div className="w-[1px] h-4 bg-gray-200 mx-1"></div>
                            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" x2="3" y1="6" y2="6" /><line x1="21" x2="9" y1="12" y2="12" /><line x1="21" x2="7" y1="18" y2="18" /></svg>
                            </button>
                        </div>

                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full px-4 py-4 bg-gray-50 focus:outline-none min-h-[200px] resize-y text-sm leading-relaxed text-gray-900 border-none"
                            placeholder="내용을 입력하세요."
                        />
                    </div>
                </div>

                {/* Photo Upload */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">사진</label>
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
                <div className="space-y-3 pt-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">성함 표기</label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showNamesAtBottom}
                            onChange={(e) => setShowNamesAtBottom(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 accent-forest-green focus:ring-forest-green"
                        />
                        <span className="text-sm text-gray-800">인사말 하단에 신랑신부&혼주 성함 표시</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={sortNames}
                            onChange={(e) => setSortNames(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 accent-forest-green focus:ring-forest-green"
                        />
                        <span className="text-sm text-gray-800">각 항목 정렬</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={enableFreeformNames}
                            onChange={(e) => setEnableFreeformNames(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 accent-forest-green focus:ring-forest-green"
                        />
                        <span className="text-sm text-gray-800">성함 자유 입력</span>
                    </label>

                    {enableFreeformNames && (
                        <div className="space-y-3 pl-6 animate-fadeIn">
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500">신랑측 표기</label>
                                <textarea
                                    value={groomNameCustom}
                                    onChange={(e) => setGroomNameCustom(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-xs leading-relaxed text-gray-900 focus:border-forest-green focus:ring-1 focus:ring-forest-green outline-none resize-none h-16"
                                    placeholder="예: 아버님 성함 · 어머님 성함 의 장남 OOO"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500">신부측 표기</label>
                                <textarea
                                    value={brideNameCustom}
                                    onChange={(e) => setBrideNameCustom(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-xs leading-relaxed text-gray-900 focus:border-forest-green focus:ring-1 focus:ring-forest-green outline-none resize-none h-16"
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
