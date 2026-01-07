import React, { ChangeEvent, useState } from 'react';
import Image from 'next/image';
import { LayoutTemplate, Check, Image as ImageIcon, Type, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { BuilderLabel } from '../BuilderLabel';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function MainScreenSection({ isOpen, onToggle }: SectionProps) {
    const {
        mainScreen, setMainScreen,
        imageUrl, setImageUrl,
        groom, bride
    } = useInvitationStore();

    const [isTextSectionOpen, setIsTextSectionOpen] = useState(false);

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImageUrl(url);
        }
    };

    return (
        <AccordionItem
            title="메인 화면"
            icon={LayoutTemplate}
            isOpen={isOpen}
            onToggle={onToggle}
            isCompleted={!!mainScreen.title}
        >
            <div className="space-y-8">
                {/* Layout Templates */}
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {['basic', 'fill', 'arch', 'oval', 'frame'].map((l) => (
                        <button
                            key={l}
                            onClick={() => setMainScreen({ layout: l as 'basic' | 'fill' | 'arch' | 'oval' | 'frame' })}
                            className={`flex-shrink-0 w-20 flex flex-col items-center gap-2 group`}
                        >
                            <div className={`w-20 h-32 rounded-lg border-2 transition-all relative overflow-hidden bg-gray-50 ${mainScreen.layout === l ? 'border-forest-green ring-2 ring-forest-green ring-offset-2' : 'border-gray-200 group-hover:border-forest-green/50'}`}>
                                {/* Visual hints for layouts */}
                                <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 uppercase">{l}</div>
                                {l === 'fill' && <div className="absolute inset-0 bg-gray-200"></div>}
                                {l === 'arch' && <div className="absolute inset-x-2 top-2 bottom-0 bg-gray-200 rounded-t-[40px]"></div>}
                                {l === 'oval' && <div className="absolute inset-2 bg-gray-200 rounded-full"></div>}
                                {l === 'frame' && <div className="absolute inset-2 border-2 border-gray-300"></div>}

                                {mainScreen.layout === l && (
                                    <div className="absolute top-1 right-1 bg-forest-green text-white rounded-full p-0.5">
                                        <Check size={10} strokeWidth={3} />
                                    </div>
                                )}
                            </div>
                            <span className={`text-xs font-medium ${mainScreen.layout === l ? 'text-forest-green' : 'text-gray-500'}`}>
                                {l === 'basic' ? '기본' : l === 'fill' ? '채우기' : l === 'arch' ? '아치' : l === 'oval' ? '타원' : '액자'}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Photo Upload */}
                <div className="space-y-3">
                    <BuilderLabel>사진</BuilderLabel>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-forest-green/40 transition-colors bg-gray-50 group cursor-pointer relative overflow-hidden min-h-[200px] flex items-center justify-center">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />

                        {imageUrl ? (
                            <div className="absolute inset-0 bg-gray-900 group-hover:bg-gray-900/90 transition-colors flex items-center justify-center">
                                <Image src={imageUrl} alt="Main" fill className="object-contain" />
                                <button
                                    onClick={(e) => { e.preventDefault(); setImageUrl(null); }}
                                    className="absolute top-2 right-2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-sm z-20 transition-all"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center space-y-3">
                                <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <ImageIcon size={24} className="text-gray-400 group-hover:text-forest-green" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">사진 업로드</p>
                                    <p className="text-xs text-gray-400 mt-1">클릭하여 이미지를 선택하세요</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Design Options */}
                <div className="space-y-3">
                    <BuilderLabel>디자인 변형</BuilderLabel>
                    <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={mainScreen.showBorder}
                                onChange={(e) => setMainScreen({ showBorder: e.target.checked })}
                                className="w-5 h-5 rounded border-2 border-gray-300 bg-white checked:bg-forest-green checked:border-forest-green focus:ring-forest-green cursor-pointer"
                            />
                            <span className="text-sm text-gray-700">테두리 선</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={mainScreen.expandPhoto}
                                onChange={(e) => setMainScreen({ expandPhoto: e.target.checked })}
                                className="w-5 h-5 rounded border-2 border-gray-300 bg-white checked:bg-forest-green checked:border-forest-green focus:ring-forest-green cursor-pointer"
                            />
                            <span className="text-sm text-gray-700">사진 확장</span>
                        </label>
                    </div>
                </div>

                {/* Effects */}
                <div className="space-y-3">
                    <BuilderLabel>이펙트</BuilderLabel>
                    <div className="flex gap-2">
                        {['none', 'mist', 'ripple', 'paper'].map((eff) => (
                            <button
                                key={eff}
                                onClick={() => setMainScreen({ effect: eff as 'none' | 'mist' | 'ripple' | 'paper' })}
                                className={`px-4 py-2 text-xs rounded-lg border transition-all ${mainScreen.effect === eff
                                    ? 'bg-black text-white border-black font-medium'
                                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                    }`}
                            >
                                {eff === 'none' ? '없음' : eff === 'mist' ? '안개' : eff === 'ripple' ? '물결' : '페이퍼'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Custom Text (Collapsible) */}
                <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Type size={16} className="text-gray-500" />
                            <span className="text-sm font-bold text-gray-800">문구</span>
                        </div>

                        <button
                            onClick={() => setIsTextSectionOpen(!isTextSectionOpen)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <span className="text-xs font-medium text-gray-600">메인화면 문구 커스텀</span>
                            {isTextSectionOpen ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
                        </button>
                    </div>

                    {isTextSectionOpen && (
                        <div className="space-y-6 animate-in slide-in-from-top-2 fade-in duration-200">
                            <div className="space-y-3">
                                {/* Title */}
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={mainScreen.showTitle}
                                        onChange={(e) => setMainScreen({ showTitle: e.target.checked })}
                                        className="w-5 h-5 rounded border-gray-300 text-gray-800 focus:ring-gray-800"
                                    />
                                    <div className="grid grid-cols-[40px_1fr] gap-2 items-center flex-1">
                                        <span className="text-xs text-gray-400 text-center border p-1 rounded">기본</span>
                                        <input
                                            type="text"
                                            value={mainScreen.title}
                                            onChange={(e) => setMainScreen({ title: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded text-sm text-gray-900 focus:border-forest-green outline-none uppercase"
                                            placeholder="THE NEW BEGINNING"
                                            disabled={!mainScreen.showTitle}
                                        />
                                    </div>
                                </div>

                                {/* Groom & Bride Name */}
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={mainScreen.showGroomBride}
                                        onChange={(e) => setMainScreen({ showGroomBride: e.target.checked })}
                                        className="w-5 h-5 rounded border-gray-300 text-gray-800 focus:ring-gray-800 shrink-0"
                                    />
                                    <div className="grid grid-cols-[40px_1fr_60px_1fr] gap-2 items-center flex-1">
                                        <span className="text-xs text-gray-400 text-center border p-1 rounded">기본</span>
                                        <input
                                            type="text"
                                            value={groom.firstName || '신랑'}
                                            readOnly
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-500"
                                            disabled={!mainScreen.showGroomBride}
                                        />
                                        <input
                                            type="text"
                                            value="그리고"
                                            readOnly
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-500 text-center"
                                            disabled={!mainScreen.showGroomBride}
                                        />
                                        <input
                                            type="text"
                                            value={bride.firstName || '신부'}
                                            readOnly
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-500"
                                            disabled={!mainScreen.showGroomBride}
                                        />
                                    </div>
                                </div>

                                {/* Subtitle */}
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={mainScreen.showSubtitle}
                                        onChange={(e) => setMainScreen({ showSubtitle: e.target.checked })}
                                        className="w-5 h-5 rounded border-gray-300 text-gray-800 focus:ring-gray-800"
                                    />
                                    <div className="grid grid-cols-[40px_1fr] gap-2 items-center flex-1">
                                        <span className="text-xs text-gray-400 text-center border p-1 rounded">기본</span>
                                        <input
                                            type="text"
                                            value={mainScreen.subtitle}
                                            onChange={(e) => setMainScreen({ subtitle: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded text-sm text-gray-900 focus:border-forest-green outline-none"
                                            placeholder="We are getting married"
                                            disabled={!mainScreen.showSubtitle}
                                        />
                                    </div>
                                </div>

                                {/* Custom Date & Place */}
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        checked={mainScreen.showDatePlace}
                                        onChange={(e) => setMainScreen({ showDatePlace: e.target.checked })}
                                        className="w-5 h-5 rounded border-gray-300 text-gray-800 focus:ring-gray-800 mt-2"
                                    />
                                    <div className="grid grid-cols-[40px_1fr] gap-2 items-start flex-1">
                                        <span className="text-xs text-gray-400 text-center border p-1 rounded mt-1">기본</span>
                                        <textarea
                                            value={mainScreen.customDatePlace}
                                            onChange={(e) => setMainScreen({ customDatePlace: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded text-sm text-gray-900 focus:border-forest-green outline-none min-h-[60px] resize-none leading-snug"
                                            placeholder="0000.00.00 ..."
                                            disabled={!mainScreen.showDatePlace}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Info Text */}
                            <div className="space-y-1 text-xs text-gray-400">
                                <div className="flex items-center gap-1">
                                    <Info size={12} />
                                    <span>내용을 입력하지 않아도 됩니다.</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Info size={12} />
                                    <span>문구 체크박스를 해제하면 해당 영역이 완전 사라집니다.</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </AccordionItem>
    );
}
