import React, { ChangeEvent, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import Image from 'next/image';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function KakaoShareSection({ isOpen, onToggle }: SectionProps) {
    const { kakaoShare: kakao, setKakao } = useInvitationStore();
    const [previewOpen, setPreviewOpen] = useState(false);

    if (!kakao) return null;

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setKakao({ imageUrl: url });
        }
    };

    return (
        <AccordionItem
            title="카카오 초대장 썸네일"
            icon={MessageCircle}
            isOpen={isOpen}
            onToggle={onToggle}
            isCompleted={!!kakao.title}
        >
            <div className="space-y-6">
                {/* Header Preview Button */}
                <div className="flex justify-end -mt-2 mb-2">
                    <button
                        onClick={() => setPreviewOpen(true)}
                        className="flex items-center gap-1 text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
                    >
                        미리보기
                    </button>
                </div>

                {/* Photo Upload */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">사진</label>
                    <div className="border border-dashed border-gray-300 rounded-lg w-32 h-32 hover:border-forest-green hover:bg-gray-50 transition-all cursor-pointer relative overflow-hidden flex flex-col items-center justify-center gap-2 group bg-white">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />

                        {kakao.imageUrl ? (
                            <div className="absolute inset-0">
                                <Image src={kakao.imageUrl} alt="Kakao Thumbnail" fill className="object-cover" />
                                <button
                                    onClick={(e) => { e.preventDefault(); setKakao({ imageUrl: null }); }}
                                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 z-20"
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="w-8 h-8 flex items-center justify-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400 group-hover:text-forest-green"><path d="M12 5v14M5 12h14" /></svg>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">제목</label>
                    <input
                        type="text"
                        value={kakao.title}
                        onChange={(e) => setKakao({ title: e.target.value })}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:border-forest-green focus:ring-1 focus:ring-forest-green outline-none placeholder:text-gray-300"
                        placeholder="카카오톡 제목"
                    />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">내용</label>
                    <input
                        type="text"
                        value={kakao.description}
                        onChange={(e) => setKakao({ description: e.target.value })}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:border-forest-green focus:ring-1 focus:ring-forest-green outline-none placeholder:text-gray-300"
                        placeholder="카카오톡 내용"
                    />
                </div>

                {/* Image Ratio */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">사진 비율</label>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setKakao({ imageRatio: 'portrait' })}
                            className={`px-4 py-2 border rounded-md text-sm transition-colors ${kakao.imageRatio === 'portrait' ? 'border-gray-800 text-gray-900 font-medium' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}
                        >
                            세로
                        </button>
                        <button
                            onClick={() => setKakao({ imageRatio: 'landscape' })}
                            className={`px-4 py-2 border rounded-md text-sm transition-colors ${kakao.imageRatio === 'landscape' ? 'border-gray-800 text-gray-900 font-medium' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}
                        >
                            가로
                        </button>
                    </div>
                </div>

                {/* Button Type */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">버튼 추가</label>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setKakao({ buttonType: 'none' })}
                            className={`px-3 py-2 border rounded-md text-xs transition-colors ${kakao.buttonType === 'none' ? 'border-gray-800 text-gray-900 font-medium' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}
                        >
                            설정안함
                        </button>
                        <button
                            onClick={() => setKakao({ buttonType: 'location' })}
                            className={`px-3 py-2 border rounded-md text-xs transition-colors ${kakao.buttonType === 'location' ? 'border-gray-800 text-gray-900 font-medium' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}
                        >
                            위치보기 버튼
                        </button>
                        <button
                            onClick={() => setKakao({ buttonType: 'rsvp' })}
                            className={`px-3 py-2 border rounded-md text-xs transition-colors ${kakao.buttonType === 'rsvp' ? 'border-gray-800 text-gray-900 font-medium' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}
                        >
                            참석의사 전달 버튼
                        </button>
                    </div>
                </div>

                {/* Share Exposure */}
                <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={kakao.showShareButton}
                            onChange={(e) => setKakao({ showShareButton: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-300 accent-forest-green focus:ring-forest-green"
                        />
                        <span className="text-sm text-gray-800">청첩장 하단에 카카오톡 공유하기 버튼 노출</span>
                    </label>
                </div>

                {/* Footer Note */}
                <div className="flex items-start gap-1.5 pt-4 border-t border-gray-100">
                    <div className="w-3.5 h-3.5 rounded-full border border-gray-400 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[9px] text-gray-500 font-serif italic">!</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                        미입력해도 자동 설정되며, 변경이 필요한 경우에만 입력
                    </p>
                </div>
            </div>

            {/* Simple Preview Modal (Optional, if needed for "미리보기") */}
            {previewOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setPreviewOpen(false)}>
                    <div className="bg-white rounded-xl max-w-sm w-full p-4 space-y-4" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center border-b pb-2 mb-2">
                            <h3 className="font-bold text-gray-900">카카오톡 공유 미리보기</h3>
                            <button onClick={() => setPreviewOpen(false)} className="text-gray-500 hover:text-gray-800">✕</button>
                        </div>
                        <div className="bg-[#FAE100] p-4 rounded-lg text-black">
                            <div className="max-w-[240px] mx-auto bg-white rounded overflow-hidden shadow-sm">
                                {kakao.imageUrl ? (
                                    <div className={`relative w-full ${kakao.imageRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-video'}`}>
                                        <Image src={kakao.imageUrl} alt="Kakao Preview" fill className="object-cover" />
                                    </div>
                                ) : (
                                    <div className={`w-full ${kakao.imageRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-video'} bg-gray-200 flex items-center justify-center text-gray-400 text-xs`}>
                                        이미지 없음
                                    </div>
                                )}
                                <div className="p-3 bg-white">
                                    <div className="font-bold text-sm mb-1 line-clamp-2">{kakao.title || "제목을 입력해주세요"}</div>
                                    <div className="text-xs text-gray-500 line-clamp-2">{kakao.description || "내용을 입력해주세요"}</div>
                                </div>
                                <div className="border-t border-gray-100 p-2 text-center text-xs text-gray-600 font-medium bg-gray-50">
                                    {kakao.buttonType === 'location' ? '위치보기' : kakao.buttonType === 'rsvp' ? '참석의사 전달' : '자세히 보기'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AccordionItem>
    );
}
