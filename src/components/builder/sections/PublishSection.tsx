import React, { useState } from 'react';
import { Share2, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { useInvitationStore, InvitationData } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { BuilderField } from '../BuilderField';
import { BuilderInput } from '../BuilderInput';
import { invitationService } from '@/services/invitationService';
import { useAuth } from '@/hooks/useAuth';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
    onRequireLogin: (() => void) | undefined;
}

export default function PublishSection({ isOpen, onToggle, onRequireLogin }: SectionProps) {
    const { slug, setSlug } = useInvitationStore();
    const state = useInvitationStore();
    const { user } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSave = async () => {
        if (!user) {
            if (onRequireLogin) {
                onRequireLogin();
            } else {
                alert('저장하려면 로그인이 필요합니다.');
            }
            return;
        }

        if (!slug) {
            alert('초대장 주소(URL)를 입력해주세요.');
            return;
        }

        setIsSaving(true);
        setSaveStatus('idle');

        try {
            // Filter out functions from the state to get only data
            const cleanData = Object.fromEntries(
                Object.entries(state).filter(([, value]) => typeof value !== 'function')
            ) as unknown as InvitationData;

            await invitationService.saveInvitation(slug, cleanData, user.id);
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch (error) {
            console.error('Save error:', error);
            setSaveStatus('error');
            alert('저장 도중 오류가 발생했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    const previewUrl = slug ? `${window.location.origin}/v/${slug}` : '';

    return (
        <AccordionItem
            title="초대장 주소 및 저장"
            icon={Share2}
            isOpen={isOpen}
            onToggle={onToggle}
            isCompleted={!!slug}
        >
            <div className="space-y-6">
                <BuilderField label="초대장 주소 (Slug)">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="bg-gray-100 px-3 py-2 rounded-lg text-gray-500 text-sm font-mono">
                                /v/
                            </div>
                            <BuilderInput
                                value={slug}
                                onChange={(e) => setSlug(e.target.value.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase())}
                                placeholder="예: jo-wedding-2026"
                                className="flex-1"
                            />
                        </div>
                        <p className="text-[11px] text-gray-400 px-1">
                            영문, 숫자, 하이픈(-)만 사용 가능합니다.
                        </p>
                    </div>
                </BuilderField>

                {slug && (
                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50 space-y-3">
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                            <LinkIcon size={16} />
                            <span>미리보기 주소</span>
                        </div>
                        <div className="text-sm font-mono text-gray-600 break-all bg-white p-2 rounded-lg border border-blue-100">
                            {previewUrl}
                        </div>
                    </div>
                )}

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`
                        w-full py-4 rounded-2xl font-bold text-white transition-all
                        flex items-center justify-center gap-2
                        ${saveStatus === 'success'
                            ? 'bg-green-500'
                            : 'bg-black hover:bg-gray-800 active:scale-95'
                        }
                        ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}
                    `}
                >
                    {isSaving ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            저장 중...
                        </>
                    ) : saveStatus === 'success' ? (
                        <>
                            <CheckCircle2 size={20} />
                            저장 완료! (마이페이지에서 확인 가능)
                        </>
                    ) : (
                        '서버에 저장하기'
                    )}
                </button>
                {saveStatus === 'success' && slug && (
                    <a
                        href={`/v/${slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 rounded-2xl font-bold border-2 border-black text-black hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 mt-3 animate-modal-content-in"
                    >
                        <span>실제 페이지 확인하기</span>
                        <Share2 size={18} />
                    </a>
                )}
            </div>
        </AccordionItem>
    );
}
