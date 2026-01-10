import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { BuilderLabel } from '../BuilderLabel';
import { BuilderInput } from '../BuilderInput';
import { BuilderButton } from '../BuilderButton';
import { BuilderButtonGroup } from '../BuilderButtonGroup';
import { BuilderToggle } from '../BuilderToggle';
import { BuilderField } from '../BuilderField';
import { ImageUploader } from '../ImageUploader';
import { Row, Stack } from '../BuilderLayout';
import Image from 'next/image';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function KakaoShareSection({ isOpen, onToggle }: SectionProps) {
    const { kakaoShare: kakao, setKakao } = useInvitationStore();
    const [previewOpen, setPreviewOpen] = useState(false);

    if (!kakao) return null;


    return (
        <AccordionItem
            title="카카오 초대장 썸네일"
            icon={MessageCircle}
            isOpen={isOpen}
            onToggle={onToggle}
            isCompleted={!!kakao.title}
        >
            <Stack gap="lg">
                {/* Photo Upload with Header Preview Button */}
                <BuilderField
                    label={
                        <Row justify="space-between" align="center" className="mb-2">
                            <BuilderLabel className="!mb-0">사진</BuilderLabel>
                            <BuilderButton
                                variant="ghost"
                                size="sm"
                                onClick={() => setPreviewOpen(true)}
                                className="h-6 text-[11px] text-gray-500 border border-gray-100 bg-white"
                            >
                                미리보기
                            </BuilderButton>
                        </Row>
                    }
                >
                    <div className="max-w-[160px]">
                        <ImageUploader
                            value={kakao.imageUrl}
                            onChange={(url) => setKakao({ imageUrl: url })}
                            aspectRatio={kakao.imageRatio === 'portrait' ? '3/4' : '16/9'}
                            placeholder="썸네일 추가"
                        />
                    </div>
                </BuilderField>

                {/* Title */}
                <BuilderField label="제목">
                    <BuilderInput
                        type="text"
                        value={kakao.title}
                        onChange={(e) => setKakao({ title: e.target.value })}
                        placeholder="카카오톡 제목"
                    />
                </BuilderField>

                {/* Description */}
                <BuilderField label="내용">
                    <BuilderInput
                        type="text"
                        value={kakao.description}
                        onChange={(e) => setKakao({ description: e.target.value })}
                        placeholder="카카오톡 내용"
                    />
                </BuilderField>

                {/* Image Ratio */}
                <BuilderField label="사진 비율">
                    <BuilderButtonGroup
                        value={kakao.imageRatio}
                        options={[
                            { label: '세로', value: 'portrait' },
                            { label: '가로', value: 'landscape' },
                        ]}
                        onChange={(val: 'portrait' | 'landscape') => setKakao({ imageRatio: val })}
                    />
                </BuilderField>

                {/* Button Type */}
                <BuilderField label="버튼 추가">
                    <BuilderButtonGroup
                        value={kakao.buttonType}
                        options={[
                            { label: '설정안함', value: 'none' },
                            { label: '위치보기', value: 'location' },
                            { label: '참석의사', value: 'rsvp' },
                        ]}
                        onChange={(val: 'none' | 'location' | 'rsvp') => setKakao({ buttonType: val })}
                    />
                </BuilderField>

                {/* Share Exposure */}
                <BuilderField label="설정">
                    <BuilderToggle
                        checked={kakao.showShareButton}
                        onChange={(checked) => setKakao({ showShareButton: checked })}
                        label="공유 버튼 노출"
                    />
                </BuilderField>

                {/* Footer Note */}
                <div className="flex items-start gap-1.5 pt-4 border-t border-gray-100">
                    <div className="w-3.5 h-3.5 rounded-full border border-gray-400 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[9px] text-gray-500 font-serif italic">!</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                        미입력해도 자동 설정되며, 변경이 필요한 경우에만 입력
                    </p>
                </div>
            </Stack>

            {/* Simple Preview Modal (Optional, if needed for "미리보기") */}
            {previewOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={() => setPreviewOpen(false)}>
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
