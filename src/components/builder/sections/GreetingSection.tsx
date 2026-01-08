import React, { ChangeEvent, useState } from 'react';
import Image from 'next/image';
import { MessageSquare, Image as ImageIcon, X, Sparkles } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { BuilderLabel } from '../BuilderLabel';
import { BuilderInput } from '../BuilderInput';
import { BuilderTextarea } from '../BuilderTextarea';
import { BuilderModal } from '@/components/common/BuilderModal';
import RichTextEditor from '@/components/common/RichTextEditor';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

const GREETING_SAMPLES = [
    {
        subtitle: 'INVITATION',
        title: '소중한 분들을 초대합니다',
        message: '<p>저희 두 사람의 작은 만남이<br>사랑의 결실을 이루어<br>소중한 결혼식을 올리게 되었습니다.</p><p>평생 서로 귀하게 여기며<br>첫 마음 그대로 존중하고 배려하며 살겠습니다.</p><p>오로지 믿음과 사랑을 약속하는 날<br>오셔서 축복해 주시면 더 없는 기쁨으로<br>간직하겠습니다.</p>'
    },
    {
        subtitle: 'Our Wedding',
        title: '함께 걸어가는 길',
        message: '<p>서로의 빛이 되어<br>평생을 함께 걸어가겠습니다.</p><p>저희 두 사람의 시작을<br>축복해 주시면 감사하겠습니다.</p><p>바쁘시더라도 부디 오셔서<br>저희의 앞날을 지켜봐 주시면<br>더할 나위 없는 영광이겠습니다.</p>'
    },
    {
        subtitle: 'Hello & Welcome',
        title: '초대합니다',
        message: '<p>곁에 있을 때 가장 나다운 모습이 되게 하는 사람<br>꿈을 꾸게 하고 그 꿈을 함께 나누는 사람<br>그런 사람을 만나 이제 하나가 되려 합니다.</p><p>저희의 뜻깊은 시작을 함께 나누어 주시고<br>따뜻한 마음으로 축복해 주시면 감사하겠습니다.</p>'
    },
    {
        subtitle: 'The Marriage',
        title: '저희의 시작을 함께해주세요',
        message: '<p>오랜 시간 서로를 지켜온<br>두 사람이 이제 부부의 연을 맺습니다.</p><p>언제나 지금 이 마음 잊지 않고<br>서로를 아끼고 보듬으며 예쁘게 살겠습니다.</p><p>저희의 행복한 시작을 축복해 주시면<br>더 없는 기쁨으로 간직하겠습니다.</p>'
    },
    {
        subtitle: 'Love Story',
        title: '두 사람이 하나가 됩니다',
        message: '<p>각자 다른 공간에서 지내온 저희 두 사람이<br>이제는 한 곳을 바라보며 나아가려 합니다.</p><p>서로를 깊이 신뢰하고 사랑하는 마음으로<br>이 자리에 섰습니다.</p><p>저희의 복된 앞날을 함께 지켜봐 주시고<br>따뜻한 격려 부탁드립니다.</p>'
    },
    {
        subtitle: 'Save the Date',
        title: '약속합니다',
        message: '<p>기쁠 때나 슬플 때나 언제나 함께하며<br>서로의 버팀목이 되겠습니다.</p><p>서로가 서로에게 선물이 되는<br>그런 인연으로 살아가겠습니다.</p><p>귀한 걸음 하시어 저희의 앞날을<br>축복해 주시면 감사하겠습니다.</p>'
    }
];

export default function GreetingSection({ isOpen, onToggle }: SectionProps) {
    const {
        greetingTitle, setGreetingTitle,
        greetingSubtitle, setGreetingSubtitle,
        message, setMessage,
        imageUrl, setImageUrl,
        showNamesAtBottom, setShowNamesAtBottom,
        sortNames, setSortNames,
        enableFreeformNames, setEnableFreeformNames,
        groomNameCustom, setGroomNameCustom
    } = useInvitationStore();

    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

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
            <div className="space-y-8">
                {/* Titles Section with Header */}
                <div className="space-y-4">
                    <div className="flex items-center justify-end">
                        <button
                            onClick={() => setIsSampleModalOpen(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF9EB] text-[#A65E1A] rounded-full border border-[#FFE0A3] hover:bg-[#FFF2D1] transition-all shadow-sm group"
                        >
                            <Sparkles size={14} className="group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold">예시 문구</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <BuilderLabel>상단 소제목</BuilderLabel>
                            <BuilderInput
                                type="text"
                                value={greetingSubtitle}
                                onChange={(e) => setGreetingSubtitle(e.target.value)}
                                placeholder="예: INVITATION"
                            />
                        </div>
                        <div>
                            <BuilderLabel>제목</BuilderLabel>
                            <BuilderInput
                                type="text"
                                value={greetingTitle}
                                onChange={(e) => setGreetingTitle(e.target.value)}
                                placeholder="예: 소중한 분들을 초대합니다"
                            />
                        </div>
                    </div>
                </div>

                {/* Content with Rich Text Editor */}
                <div className="space-y-2">
                    <BuilderLabel className="mb-0">내용</BuilderLabel>
                    <RichTextEditor
                        content={message}
                        onChange={setMessage}
                        placeholder="축하해주시는 분들께 전할 소중한 메시지를 입력하세요."
                    />
                </div>

                {/* Photo Upload */}
                <div>
                    <BuilderLabel>사진</BuilderLabel>
                    <div className="relative group w-32 h-32">
                        <div
                            className={`
                            border-2 border-dashed border-gray-200 rounded-2xl w-full h-full 
                            transition-all duration-300 bg-gray-50 group-hover:bg-white
                            relative overflow-hidden flex items-center justify-center
                            ${imageUrl ? 'border-none shadow-lg transform group-hover:scale-[1.02]' : ''}
                        `}
                            style={!imageUrl ? { borderColor: 'transparent' } : {}} // We'll handle hover via style or just class if we can't easily inject hover color.
                        // Actually, tailwind arbitrary values with CSS variables or just inline styles for specific interactions are tricky without state.
                        // Let's use a class that doesn't reference forest-green, or just gray-300.
                        // Better: use the group-hover style helper technique or just leave it gray-300 on hover to be safe/neutral, 
                        // OR, since this is "UI Unification", let's make it standard gray.
                        >
                            {/* We will apply the border color on the parent 'group' hover if possible, or just inline style the div directly if we can track hover? No.
                                Let's just use `hover:border-gray-400` so it doesn't clash with custom colors.
                             */}
                            {imageUrl ? (
                                <>
                                    <Image src={imageUrl} alt="Greeting" fill className="object-cover" />
                                    <button
                                        onClick={(e) => { e.preventDefault(); setImageUrl(null); }}
                                        className="absolute top-2 right-2 bg-black/40 backdrop-blur-md text-white rounded-full p-1.5 hover:bg-black/60 transition-all shadow-lg z-20 group-hover:opacity-100"
                                    >
                                        <X size={14} />
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center space-y-2 pointer-events-none">
                                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 transition-colors" style={{ color: undefined }} /* We can use a group-hover class that sets text color if we had a css var, but here inline style for hover is hard. Let's make it simple gray or black on hover */ >
                                        <ImageIcon size={20} className="group-hover:text-gray-600" />
                                    </div>
                                    <span className="text-[11px] font-medium text-gray-400 group-hover:text-gray-600">사진 추가</span>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                        </div>
                    </div>
                </div>

                {/* Name Options */}
                <div className="pt-2">
                    <BuilderLabel>성함 표기</BuilderLabel>

                    {/* Segmented Control Style Toggles */}
                    <div className="grid grid-cols-3 gap-1 bg-gray-50/50 p-1 rounded-xl border border-gray-100 ring-1 ring-black/5">
                        <button
                            onClick={() => setShowNamesAtBottom(!showNamesAtBottom)}
                            className={`
                                py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 text-center
                                ${showNamesAtBottom
                                    ? 'bg-white shadow-sm ring-1 ring-black/5 text-gray-900 text-yellow-600'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'}
                            `}
                        >
                            성함 표시
                        </button>
                        <button
                            onClick={() => setSortNames(!sortNames)}
                            className={`
                                py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 text-center
                                ${sortNames
                                    ? 'bg-white shadow-sm ring-1 ring-black/5 text-gray-900 text-yellow-600'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'}
                            `}
                        >
                            항목 정렬
                        </button>
                        <button
                            onClick={() => setEnableFreeformNames(!enableFreeformNames)}
                            className={`
                                py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 text-center
                                ${enableFreeformNames
                                    ? 'bg-white shadow-sm ring-1 ring-black/5 text-gray-900 text-yellow-600'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'}
                            `}
                        >
                            성함 자유 입력
                        </button>
                    </div>

                    {enableFreeformNames && (
                        <div className="mt-4 pt-4 border-t border-gray-50 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-black/5">
                                <div className="flex items-center gap-1 p-2 border-b border-gray-50 bg-gray-50/30">
                                    <button className="w-7 h-7 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-lg text-gray-600 transition-all font-bold text-[10px]">B</button>
                                    <button className="w-7 h-7 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-lg text-gray-600 transition-all italic font-serif text-[10px]">I</button>
                                    <button className="w-7 h-7 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-lg text-gray-600 transition-all underline text-[10px]">U</button>
                                    <div className="w-[1px] h-3 bg-gray-200 mx-1"></div>
                                    <button className="w-7 h-7 flex items-center justify-center bg-gray-900 text-white shadow-md shadow-black/10 rounded-lg text-[10px]">A</button>
                                    <div className="w-[1px] h-3 bg-gray-200 mx-1"></div>
                                    <button className="w-7 h-7 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-lg text-gray-500 transition-all">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="21" x2="3" y1="6" y2="6" /><line x1="21" x2="9" y1="12" y2="12" /><line x1="21" x2="7" y1="18" y2="18" /></svg>
                                    </button>
                                </div>
                                <BuilderTextarea
                                    value={groomNameCustom}
                                    onChange={(e) => setGroomNameCustom(e.target.value)}
                                    className="bg-white px-4 py-4 min-h-[140px] text-[13px] leading-[1.7] border-none focus:ring-0 resize-none"
                                    placeholder="인사말 하단 성함부분을 자유롭게 입력할 수 있습니다."
                                />
                            </div>
                            <p className="flex items-start gap-2 text-[11px] text-gray-400 pl-1">
                                <span className="mt-0.5 opacity-70">ⓘ</span>
                                <span>인사말 하단 성함부분을 자유롭게 입력할 수 있습니다.</span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Sample Phrases Modal */}
                <BuilderModal
                    isOpen={isSampleModalOpen}
                    onClose={() => setIsSampleModalOpen(false)}
                    title="샘플 문구"
                >
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1 pr-2 scrollbar-hide pt-2">
                        {GREETING_SAMPLES.map((sample, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setGreetingSubtitle(sample.subtitle);
                                    setGreetingTitle(sample.title);
                                    setMessage(sample.message);
                                    setIsSampleModalOpen(false);
                                }}
                                className="w-full text-left p-5 rounded-3xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-black/5 hover:border-yellow-200 transition-all group duration-300"
                            >
                                <div className="font-script text-gray-400 opacity-60 text-sm mb-1">{sample.subtitle}</div>
                                <div className="font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">{sample.title}</div>
                                <div
                                    className="text-xs text-gray-500 leading-[1.8] rich-text-sample-preview"
                                    dangerouslySetInnerHTML={{ __html: sample.message }}
                                />
                            </button>
                        ))}
                    </div>
                </BuilderModal>

            </div>
        </AccordionItem>
    );
}
