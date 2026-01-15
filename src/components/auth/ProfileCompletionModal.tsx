"use client";

import React, { useState, useCallback } from 'react';
import { ResponsiveModal } from '@/components/common/ResponsiveModal';
import { TextField } from '../builder/TextField';
import { PhoneField } from '../builder/PhoneField';
import { Button } from '../ui/Button';
import { useToast } from '@/hooks/use-toast';
import { profileService } from '@/services/profileService';
import { Loader2, User, Phone } from 'lucide-react';
import { isValidPhone } from '@/lib/utils';
import styles from './ProfileCompletionModal.module.scss';

interface ProfileCompletionModalProps {
    isOpen: boolean;
    userId: string;
    defaultName?: string;
    onComplete: () => void;
}

export default function ProfileCompletionModal({
    isOpen,
    userId,
    defaultName = '',
    onComplete,
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

    return (
        <ResponsiveModal
            open={isOpen}
            onOpenChange={() => { }} // 닫기 비활성화 - 필수 입력
            title="프로필 완성"
            description="청첩장 서비스 이용을 위해 이름과 연락처를 입력해주세요."
        >
            <div className={styles.container}>
                <div className={styles.form}>
                    <div className={styles.inputGroup}>
                        <div className={styles.iconWrapper}>
                            <User size={18} />
                        </div>
                        <TextField
                            placeholder="이름"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <div className={styles.iconWrapper}>
                            <Phone size={18} />
                        </div>
                        <PhoneField
                            placeholder="전화번호"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                </div>

                <p className={styles.notice}>
                    입력하신 정보는 청첩장 승인 신청 시 사용되며,
                    <br />
                    광고성 목적으로 사용되지 않습니다.
                </p>

                <Button
                    onClick={handleSubmit}
                    disabled={loading || !name.trim() || !phone.trim()}
                    className={styles.submitButton}
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            저장 중...
                        </>
                    ) : (
                        '시작하기'
                    )}
                </Button>
            </div>
        </ResponsiveModal>
    );
}
