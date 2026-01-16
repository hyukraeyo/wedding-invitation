"use client";

import React, { useState, useCallback } from 'react';
import { ResponsiveModal } from '@/components/common/ResponsiveModal';
import { TextField } from '../builder/TextField';
import { PhoneField } from '../builder/PhoneField';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { profileService } from '@/services/profileService';
import { User, Phone } from 'lucide-react';
import { isValidPhone } from '@/lib/utils';

interface ProfileCompletionModalProps {
    isOpen: boolean;
    userId: string;
    defaultName?: string;
    onComplete: () => void;
    onLogout?: () => void;
}

export default function ProfileCompletionModal({
    isOpen,
    userId,
    defaultName = '',
    onComplete,
    onLogout,
}: ProfileCompletionModalProps) {
    const [name, setName] = useState(defaultName);
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = useCallback(async () => {
        if (!name.trim()) {
            toast({ variant: 'destructive', description: '이름을 입력해주세요.' });
            return;
        }

        const sanitizedPhone = phone.replace(/[^0-9+]/g, '');
        if (!isValidPhone(sanitizedPhone)) {
            toast({ variant: 'destructive', description: '전화번호 형식이 올바르지 않습니다.' });
            return;
        }

        setLoading(true);
        try {
            await profileService.updateProfile(userId, {
                full_name: name.trim(),
                phone: sanitizedPhone,
            });

            toast({ description: '프로필이 저장되었습니다.' });
            onComplete();
        } catch {
            toast({
                variant: 'destructive',
                description: '프로필 저장 중 오류가 발생했습니다.',
            });
        } finally {
            setLoading(false);
        }
    }, [name, phone, userId, toast, onComplete]);

    // 디자인 시스템 준수를 위한 커스텀 푸터
    const modalFooter = (
        <div className="w-full flex flex-col gap-4">
            <Button
                onClick={handleSubmit}
                disabled={loading || !name.trim() || !phone.trim()}
                className="w-full h-12 text-base font-bold"
            >
                시작하기
            </Button>

            {onLogout ? (
                <button
                    type="button"
                    onClick={onLogout}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors self-center py-2 underline underline-offset-4"
                >
                    로그아웃
                </button>
            ) : null}
        </div>
    );

    return (
        <ResponsiveModal
            open={isOpen}
            onOpenChange={() => { }} // 필수 입력이므로 닫기 비활성화
            dismissible={false}
            title="프로필 완성"
            description="청첩장 서비스 이용을 위해 이름과 연락처를 입력해주세요."
            footer={modalFooter}
        >
            <div className="flex flex-col gap-6 py-4">
                <div className="space-y-4">
                    <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                            <User size={18} />
                        </div>
                        <TextField
                            placeholder="성함 (실명)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="pl-10 h-12 bg-zinc-50/50 border-zinc-200 focus:bg-white transition-all shadow-sm"
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                            <Phone size={18} />
                        </div>
                        <PhoneField
                            placeholder="연락처 (- 없이 입력)"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="pl-10 h-12 bg-zinc-50/50 border-zinc-200 focus:bg-white transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 italic">
                    <p className="text-xs text-muted-foreground leading-relaxed text-center">
                        입력하신 정보는 청첩장 승인 신청 시 본인 확인용으로만 사용되며,
                        <br />
                        타인에게 공개되거나 광고 목적으로 사용되지 않습니다.
                    </p>
                </div>
            </div>
        </ResponsiveModal>
    );
}
