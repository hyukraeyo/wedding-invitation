import React, { useState } from 'react';
import { LayoutTemplate, Check, Type, ChevronDown, ChevronUp, Info, Sparkles } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { BuilderInput } from '../BuilderInput';
import { BuilderCheckbox } from '../BuilderCheckbox';
import { BuilderModal } from '@/components/common/BuilderModal';

import { BuilderButtonGroup } from '../BuilderButtonGroup';
import { BuilderToggle } from '../BuilderToggle';
import { BuilderField } from '../BuilderField';
import RichTextEditor from '@/components/common/RichTextEditor';
import { ImageUploader } from '../ImageUploader';

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



    return (
        <AccordionItem
            title="메인 화면"
            icon={LayoutTemplate}
            isOpen={isOpen}
            onToggle={onToggle}
            isCompleted={!!mainScreen.title}
        >
            <div className="space-y-6">
                {/* Layout Templates */}
                <BuilderField label="레이아웃">
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {['basic', 'fill', 'arch', 'oval', 'frame'].map((l) => (
                            <button
                                key={l}
                                onClick={() => setMainScreen({ layout: l as 'basic' | 'fill' | 'arch' | 'oval' | 'frame' })}
                                className={`flex-shrink-0 w-20 flex flex-col items-center gap-2 group`}
                            >
                                <div className={`w-20 h-32 rounded-lg border-2 transition-all relative overflow-hidden bg-white ${mainScreen.layout === l ? 'shadow-md' : 'border-gray-100 hover:bg-gray-50'}`} style={mainScreen.layout === l ? { borderColor: accentColor } : {}}>
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
                                        <div className="absolute top-1.5 right-1.5 text-white rounded-full p-0.5 shadow-sm z-10" style={{ backgroundColor: accentColor }}>
                                            <Check size={10} strokeWidth={3} />
                                        </div>
                                    )}
                                </div>
                                <span className={`text-[11px] font-bold mt-1 ${mainScreen.layout === l ? '' : 'text-gray-400'}`} style={mainScreen.layout === l ? { color: accentColor } : {}}>
                                    {l === 'basic' ? '기본' : l === 'fill' ? '채우기' : l === 'arch' ? '아치' : l === 'oval' ? '타원' : '액자'}
                                </span>
                            </button>
                        ))}
                    </div>
                </BuilderField>

                {/* Photo Upload */}
                <BuilderField label="사진">
                    <ImageUploader
                        value={imageUrl}
                        onChange={setImageUrl}
                        placeholder="메인 사진 추가"
                    />
                </BuilderField>

                {/* Design Options */}
                <BuilderField label="디자인 변형">
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
                </BuilderField>

                {/* Effects */}
                <BuilderField label="이펙트">
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
                </BuilderField>

                {/* Custom Text (Collapsible) */}
                <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Type size={16} className="text-gray-500" />
                            <span className="text-sm font-bold text-gray-800">문구</span>
                        </div>

                        <button
                            onClick={() => setIsTextSectionOpen(!isTextSectionOpen)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all border shadow-sm group ${isTextSectionOpen ? 'bg-gray-900 border-gray-900 text-white' : 'bg-gray-100 border-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            <span className="text-xs font-bold">메인화면 문구 커스텀</span>
                            {isTextSectionOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                    </div>

                    {isTextSectionOpen && (
                        <div className="space-y-6 animate-in slide-in-from-top-2 fade-in duration-200">
                            {/* Example Phrases Button at Top */}
                            <div className="flex justify-end pt-1">
                                <button
                                    onClick={() => setIsExampleModalOpen(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF9EB] text-[#A65E1A] rounded-full border border-[#FFE0A3] hover:bg-[#FFF2D1] transition-all shadow-sm group"
                                >
                                    <Sparkles size={14} className="group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-bold">예시 문구</span>
                                </button>
                            </div>
                            <div className="space-y-3">
                                {/* Title Row */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-3.5">
                                        <BuilderCheckbox
                                            checked={mainScreen.showTitle}
                                            onChange={(checked) => setMainScreen({ showTitle: checked })}
                                        />
                                    </div>
                                    <div className={`flex-1 transition-all duration-300 ${mainScreen.showTitle ? '' : 'opacity-60'}`}>
                                        <BuilderInput
                                            type="text"
                                            value={mainScreen.title}
                                            onChange={(e) => setMainScreen({ title: e.target.value })}
                                            placeholder="THE MARRIAGE"
                                            disabled={!mainScreen.showTitle}
                                        />
                                    </div>
                                </div>

                                {/* Groom & Bride Name Row */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-3.5">
                                        <BuilderCheckbox
                                            checked={mainScreen.showGroomBride}
                                            onChange={(checked) => setMainScreen({ showGroomBride: checked })}
                                        />
                                    </div>
                                    <div className={`flex-1 flex flex-col gap-2 transition-all duration-300 ${mainScreen.showGroomBride ? '' : 'opacity-60'}`}>
                                        <div className="flex gap-2">
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
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="flex-[1] min-w-[60px]">
                                                <BuilderInput
                                                    type="text"
                                                    value={mainScreen.andText || ''}
                                                    onChange={(e) => setMainScreen({ andText: e.target.value })}
                                                    disabled={!mainScreen.showGroomBride}
                                                    placeholder="&"
                                                    className="w-full text-center px-1"
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
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <BuilderInput
                                                type="text"
                                                value={mainScreen.suffixText || ''}
                                                onChange={(e) => setMainScreen({ suffixText: e.target.value })}
                                                disabled={!mainScreen.showGroomBride}
                                                placeholder="종결 어미 (예: 결혼합니다)"
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Example Modal */}
                                <BuilderModal
                                    isOpen={isExampleModalOpen}
                                    onClose={() => setIsExampleModalOpen(false)}
                                    title="메인 화면 예시 문구"
                                >
                                    <div className="grid grid-cols-1 gap-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide py-1">
                                        {[
                                            {
                                                title: 'THE MARRIAGE',
                                                g: (groom.lastName || '') + (groom.firstName || ''),
                                                a: '·',
                                                b: (bride.lastName || '') + (bride.firstName || ''),
                                                s: '결혼합니다',
                                                sub: 'We are getting married',
                                                dt: '2026.04.18. Saturday 12:00 PM\n서울 강남구 어느 예식장 1F, 그랜드홀'
                                            },
                                            {
                                                title: 'INVITATION',
                                                g: groom.firstName,
                                                a: '&',
                                                b: bride.firstName,
                                                s: '',
                                                sub: 'SAVE THE DATE',
                                                dt: '2026.04.18. PM 12:00\n더 컨벤션 웨딩홀'
                                            },
                                            {
                                                title: 'OUR WEDDING',
                                                g: `신랑 ${(groom.lastName || '') + (groom.firstName || '')}`,
                                                a: ',',
                                                b: `신부 ${(bride.lastName || '') + (bride.firstName || '')}`,
                                                s: '',
                                                sub: 'Special Day',
                                                dt: '2026.04.18. 토요일 오후 12시\n송파구 올림픽로 319'
                                            },
                                            {
                                                title: 'WELCOME',
                                                g: groom.firstName,
                                                a: '♥',
                                                b: bride.firstName,
                                                s: '',
                                                sub: 'Together Forever',
                                                dt: '2026.04.18. 12:00'
                                            },
                                        ].map((ex, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    const gVal = ex.g;
                                                    if (gVal.length >= 2 && !gVal.startsWith('신랑 ')) {
                                                        setGroom({ lastName: gVal.substring(0, 1), firstName: gVal.substring(1) });
                                                    } else {
                                                        setGroom({ lastName: '', firstName: gVal });
                                                    }
                                                    const bVal = ex.b;
                                                    if (bVal.length >= 2 && !bVal.startsWith('신부 ')) {
                                                        setBride({ lastName: bVal.substring(0, 1), firstName: bVal.substring(1) });
                                                    } else {
                                                        setBride({ lastName: '', firstName: bVal });
                                                    }
                                                    setMainScreen({
                                                        title: ex.title,
                                                        andText: ex.a,
                                                        suffixText: ex.s,
                                                        subtitle: ex.sub,
                                                        customDatePlace: ex.dt,
                                                        showTitle: true,
                                                        showGroomBride: true,
                                                        showSubtitle: true,
                                                        showDatePlace: true
                                                    });
                                                    setIsExampleModalOpen(false);
                                                }}
                                                className="w-full p-6 bg-gray-50 hover:bg-white hover:shadow-xl hover:border-amber-200 border border-gray-100 rounded-[2rem] text-center transition-all group duration-300"
                                            >
                                                <div className="space-y-3">
                                                    <div className="text-[10px] tracking-[0.3em] font-bold text-gray-400 uppercase">{ex.title}</div>
                                                    <div className="text-xl font-serif text-gray-800 group-hover:text-amber-700 transition-colors">
                                                        {ex.g} <span style={{ color: accentColor }} className="opacity-70 mx-1">{ex.a}</span> {ex.b} {ex.s}
                                                    </div>
                                                    <div className="text-[14px] font-script text-gray-400 italic">{ex.sub}</div>
                                                    <div className="w-8 h-[1px] bg-gray-200 mx-auto"></div>
                                                    <div className="text-xs text-gray-500 whitespace-pre-wrap leading-relaxed">{ex.dt}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    <p className="mt-6 text-[11px] text-gray-400 text-center flex items-center justify-center gap-1.5">
                                        <Info size={12} />
                                        원하는 스타일을 선택하면 화면 전체 문구가 자동으로 구성됩니다.
                                    </p>
                                </BuilderModal>

                                {/* Subtitle Row */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-3.5">
                                        <BuilderCheckbox
                                            checked={mainScreen.showSubtitle}
                                            onChange={(checked) => setMainScreen({ showSubtitle: checked })}
                                        />
                                    </div>
                                    <div className={`flex-1 transition-all duration-300 ${mainScreen.showSubtitle ? '' : 'opacity-60'}`}>
                                        <BuilderInput
                                            type="text"
                                            value={mainScreen.subtitle}
                                            onChange={(e) => setMainScreen({ subtitle: e.target.value })}
                                            placeholder="We are getting married"
                                            disabled={!mainScreen.showSubtitle}
                                        />
                                    </div>
                                </div>

                                {/* Custom Date & Place Row */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-4">
                                        <BuilderCheckbox
                                            checked={mainScreen.showDatePlace}
                                            onChange={(checked) => setMainScreen({ showDatePlace: checked })}
                                        />
                                    </div>
                                    <div className={`flex-1 transition-all duration-300 ${mainScreen.showDatePlace ? '' : 'opacity-60 pointer-events-none'}`}>
                                        <RichTextEditor
                                            content={mainScreen.customDatePlace}
                                            onChange={(val) => setMainScreen({ customDatePlace: val })}
                                            placeholder="0000.00.00 ..."
                                            className="text-[13px]"
                                            minHeight="min-h-[86px]"
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
