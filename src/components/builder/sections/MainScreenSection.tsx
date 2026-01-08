import React, { ChangeEvent, useState } from 'react';
import Image from 'next/image';
import { LayoutTemplate, Check, Image as ImageIcon, Type, ChevronDown, ChevronUp, Info, Sparkles } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { BuilderLabel } from '../BuilderLabel';
import { BuilderInput } from '../BuilderInput';
import { BuilderTextarea } from '../BuilderTextarea';
import { BuilderCheckbox } from '../BuilderCheckbox';
import { BuilderModal } from '@/components/common/BuilderModal';

import { BuilderButtonGroup } from '../BuilderButtonGroup';
import { BuilderToggle } from '../BuilderToggle';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function MainScreenSection({ isOpen, onToggle }: SectionProps) {
    const {
        mainScreen, setMainScreen,
        imageUrl, setImageUrl,
        groom, bride, setGroom, setBride,
        theme: { accentColor }
    } = useInvitationStore();

    const [isTextSectionOpen, setIsTextSectionOpen] = useState(false);
    const [isExampleModalOpen, setIsExampleModalOpen] = useState(false);

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
                            <div className={`w-20 h-32 rounded-lg border-2 transition-all relative overflow-hidden bg-white ${mainScreen.layout === l ? 'border-forest-green shadow-md' : 'border-gray-100 group-hover:border-forest-green/50 hover:bg-gray-50'}`}>
                                {/* Skeleton Wireframe Previews */}
                                {l === 'basic' && (
                                    <div className="absolute inset-0 flex flex-col items-center pt-3 scale-[0.55] origin-top">
                                        {/* Top Text Group */}
                                        <div className="flex flex-col items-center gap-1.5 mb-4">
                                            <div className="w-10 h-[2.5px] bg-coral-pink/50" />
                                            <div className="w-16 h-[7px] bg-gray-300 rounded-[1px]" />
                                            <div className="w-14 h-[2.5px] bg-gray-200" />
                                        </div>
                                        {/* Image Group */}
                                        <div className="w-20 aspect-[4/5] bg-gray-100 rounded-lg shadow-sm mb-4"></div>
                                        {/* Bottom Text Group */}
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="w-12 h-[2px] bg-gray-200" />
                                            <div className="w-16 h-[2.5px] bg-gray-100" />
                                        </div>
                                    </div>
                                )}
                                {l === 'fill' && (
                                    <div className="absolute inset-0 bg-gray-100 flex flex-col justify-end items-center pb-6">
                                        {/* Overlay Text indicators at the bottom */}
                                        <div className="flex flex-col items-center gap-2 mb-4">
                                            <div className="w-10 h-[2px] bg-white/40" />
                                            <div className="w-14 h-[5px] bg-white/70 rounded-[1px]" />
                                            <div className="w-16 h-[2px] bg-white/50" />
                                        </div>
                                        {/* Gradient-like overlay at the bottom */}
                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                                    </div>
                                )}
                                {l === 'arch' && (
                                    <div className="absolute inset-0 flex flex-col items-center pt-4 scale-[0.55] origin-top">
                                        {/* Arched Image */}
                                        <div className="w-20 aspect-[4/5] bg-gray-100 rounded-t-[40px] mb-6 flex items-center justify-center">
                                            <div className="w-6 h-[1.5px] bg-white/60" />
                                        </div>
                                        {/* Text below shape */}
                                        <div className="flex flex-col items-center gap-1.5">
                                            <div className="w-12 h-[5px] bg-gray-300 rounded-[1px]" />
                                            <div className="w-16 h-[2px] bg-gray-200" />
                                            <div className="w-14 h-[2px] bg-gray-100" />
                                        </div>
                                    </div>
                                )}
                                {l === 'oval' && (
                                    <div className="absolute inset-0 flex flex-col items-center pt-4 scale-[0.55] origin-top">
                                        {/* Oval Image */}
                                        <div className="w-22 aspect-[2/3] bg-gray-100 rounded-full mb-6 flex items-center justify-center">
                                            <div className="w-6 h-[1.5px] bg-white/60" />
                                        </div>
                                        {/* Text below shape */}
                                        <div className="flex flex-col items-center gap-1.5">
                                            <div className="w-12 h-[5px] bg-gray-300 rounded-[1px]" />
                                            <div className="w-16 h-[2px] bg-gray-200" />
                                            <div className="w-14 h-[2px] bg-gray-100" />
                                        </div>
                                    </div>
                                )}
                                {l === 'frame' && (
                                    <div className="absolute inset-0 flex flex-col items-center pt-6 scale-[0.55] origin-top">
                                        {/* Inner Frame Image */}
                                        <div className="w-20 aspect-square border-2 border-gray-100 bg-gray-50 mb-7 flex items-center justify-center p-2">
                                            <div className="w-full h-full bg-gray-100/50 border border-gray-200/30" />
                                        </div>
                                        {/* Text below shape */}
                                        <div className="flex flex-col items-center gap-1.5">
                                            <div className="w-12 h-[5px] bg-gray-300 rounded-[1px]" />
                                            <div className="w-16 h-[2px] bg-gray-200" />
                                            <div className="w-14 h-[2px] bg-gray-100" />
                                        </div>
                                    </div>
                                )}

                                {mainScreen.layout === l && (
                                    <div className="absolute top-1.5 right-1.5 bg-forest-green text-white rounded-full p-0.5 shadow-sm z-10">
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
                <div>
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
                <div>
                    <BuilderLabel>디자인 변형</BuilderLabel>
                    <div className="flex flex-wrap gap-2 px-1">
                        <BuilderToggle
                            checked={mainScreen.showBorder}
                            onChange={(checked) => setMainScreen({ showBorder: checked })}
                            label="테두리 선"
                        />
                        <BuilderToggle
                            checked={mainScreen.expandPhoto}
                            onChange={(checked) => setMainScreen({ expandPhoto: checked })}
                            label="사진 확장"
                        />
                    </div>
                </div>

                {/* Effects */}
                <div>
                    <BuilderLabel>이펙트</BuilderLabel>
                    <BuilderButtonGroup
                        value={mainScreen.effect}
                        options={[
                            { label: '없음', value: 'none' },
                            { label: '안개', value: 'mist' },
                            { label: '물결', value: 'ripple' },
                            { label: '페이퍼', value: 'paper' },
                        ]}
                        onChange={(val: 'none' | 'mist' | 'ripple' | 'paper') => setMainScreen({ effect: val })}
                    />
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
                                    <BuilderCheckbox
                                        checked={mainScreen.showTitle}
                                        onChange={(checked) => setMainScreen({ showTitle: checked })}
                                    />
                                    <div className="flex-1">
                                        <BuilderInput
                                            type="text"
                                            value={mainScreen.title}
                                            onChange={(e) => setMainScreen({ title: e.target.value })}
                                            className="uppercase"
                                            placeholder="THE MARRIAGE"
                                            disabled={!mainScreen.showTitle}
                                        />
                                    </div>
                                </div>

                                {/* Groom & Bride Name */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between px-1">
                                        <div className="flex items-center gap-2">
                                            <BuilderCheckbox
                                                checked={mainScreen.showGroomBride}
                                                onChange={(checked) => setMainScreen({ showGroomBride: checked })}
                                                className="shrink-0"
                                            />
                                            <span className="text-xs font-bold text-gray-500">신랑 & 신부 이름</span>
                                        </div>
                                        <button
                                            onClick={() => setIsExampleModalOpen(true)}
                                            className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-[11px] font-bold transition-colors border border-amber-100/50"
                                        >
                                            <Sparkles size={12} />
                                            예시 문구
                                        </button>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-[3]">
                                                <BuilderInput
                                                    type="text"
                                                    value={`${groom.lastName || ''}${groom.firstName || ''}`}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (val.length >= 2) {
                                                            setGroom({ lastName: val.substring(0, 1), firstName: val.substring(1) });
                                                        } else {
                                                            setGroom({ lastName: '', firstName: val });
                                                        }
                                                    }}
                                                    disabled={!mainScreen.showGroomBride}
                                                    placeholder="신랑 성함"
                                                    className="text-center"
                                                />
                                            </div>
                                            <div className="flex-[3] min-w-[50px]">
                                                <BuilderInput
                                                    type="text"
                                                    value={mainScreen.andText || ''}
                                                    onChange={(e) => setMainScreen({ andText: e.target.value })}
                                                    disabled={!mainScreen.showGroomBride}
                                                    placeholder="공백"
                                                    className="text-center text-gray-400 placeholder:text-gray-200"
                                                />
                                            </div>
                                            <div className="flex-[3]">
                                                <BuilderInput
                                                    type="text"
                                                    value={`${bride.lastName || ''}${bride.firstName || ''}`}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (val.length >= 2) {
                                                            setBride({ lastName: val.substring(0, 1), firstName: val.substring(1) });
                                                        } else {
                                                            setBride({ lastName: '', firstName: val });
                                                        }
                                                    }}
                                                    disabled={!mainScreen.showGroomBride}
                                                    placeholder="신부 성함"
                                                    className="text-center"
                                                />
                                            </div>
                                            <div className="flex-[4.5]">
                                                <BuilderInput
                                                    type="text"
                                                    value={mainScreen.suffixText || ''}
                                                    onChange={(e) => setMainScreen({ suffixText: e.target.value })}
                                                    disabled={!mainScreen.showGroomBride}
                                                    placeholder="없음"
                                                    className="text-center text-gray-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="text-[10px] text-gray-400 mt-2 flex px-2 border-t border-gray-50 pt-2">
                                            <span className="flex-[3] text-center">신랑 성함</span>
                                            <span className="flex-[3] text-center">연결어</span>
                                            <span className="flex-[3] text-center">신부 성함</span>
                                            <span className="flex-[4.5] text-center">종결 어미</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Example Modal */}
                                <BuilderModal
                                    isOpen={isExampleModalOpen}
                                    onClose={() => setIsExampleModalOpen(false)}
                                    title="메인 화면 예시 문구"
                                >
                                    <div className="grid grid-cols-1 gap-3">
                                        {[
                                            { g: (groom.lastName || '') + (groom.firstName || ''), a: '그리고', b: (bride.lastName || '') + (bride.firstName || ''), s: '' },
                                            { g: (groom.lastName || '') + (groom.firstName || ''), a: '&', b: (bride.lastName || '') + (bride.firstName || ''), s: '' },
                                            { g: (groom.lastName || '') + (groom.firstName || ''), a: '♥', b: (bride.lastName || '') + (bride.firstName || ''), s: '' },
                                            { g: (groom.lastName || '') + (groom.firstName || ''), a: '·', b: (bride.lastName || '') + (bride.firstName || ''), s: '' },
                                            { g: (groom.lastName || '') + (groom.firstName || ''), a: 'with', b: (bride.lastName || '') + (bride.firstName || ''), s: '' },
                                            { g: `신랑 ${(groom.lastName || '') + (groom.firstName || '')}`, a: ',', b: `신부 ${(bride.lastName || '') + (bride.firstName || '')}`, s: '' },
                                            { g: (groom.lastName || '') + (groom.firstName || ''), a: '그리고', b: (bride.lastName || '') + (bride.firstName || ''), s: '결혼합니다' },
                                        ].map((ex, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    // Split name for ex.g
                                                    const gVal = ex.g;
                                                    if (gVal.length >= 2 && !gVal.startsWith('신랑 ')) {
                                                        setGroom({ lastName: gVal.substring(0, 1), firstName: gVal.substring(1) });
                                                    } else {
                                                        setGroom({ lastName: '', firstName: gVal });
                                                    }

                                                    // Split name for ex.b
                                                    const bVal = ex.b;
                                                    if (bVal.length >= 2 && !bVal.startsWith('신부 ')) {
                                                        setBride({ lastName: bVal.substring(0, 1), firstName: bVal.substring(1) });
                                                    } else {
                                                        setBride({ lastName: '', firstName: bVal });
                                                    }

                                                    setMainScreen({
                                                        andText: ex.a,
                                                        suffixText: ex.s
                                                    });
                                                    setIsExampleModalOpen(false);
                                                }}
                                                className="p-4 bg-gray-50 hover:bg-white hover:border-amber-200 border border-gray-100 rounded-2xl text-center transition-all group"
                                            >
                                                <div className="text-lg font-serif text-gray-800 group-hover:text-amber-700 transition-colors">
                                                    {ex.g} <span style={{ color: accentColor }} className="opacity-70 mx-1">{ex.a}</span> {ex.b} {ex.s}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    <p className="mt-6 text-xs text-gray-400 text-center">
                                        원하는 스타일을 선택하면 입력창에 자동으로 반영됩니다.
                                    </p>
                                </BuilderModal>

                                {/* Subtitle */}
                                <div className="flex items-center gap-3">
                                    <BuilderCheckbox
                                        checked={mainScreen.showSubtitle}
                                        onChange={(checked) => setMainScreen({ showSubtitle: checked })}
                                    />
                                    <div className="flex-1">
                                        <BuilderInput
                                            type="text"
                                            value={mainScreen.subtitle}
                                            onChange={(e) => setMainScreen({ subtitle: e.target.value })}
                                            placeholder="We are getting married"
                                            disabled={!mainScreen.showSubtitle}
                                        />
                                    </div>
                                </div>

                                {/* Custom Date & Place */}
                                <div className="flex items-start gap-3">
                                    <BuilderCheckbox
                                        checked={mainScreen.showDatePlace}
                                        onChange={(checked) => setMainScreen({ showDatePlace: checked })}
                                        className="mt-2"
                                    />
                                    <div className="flex-1">
                                        <BuilderTextarea
                                            value={mainScreen.customDatePlace}
                                            onChange={(e) => setMainScreen({ customDatePlace: e.target.value })}
                                            className="min-h-[80px] leading-relaxed"
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
