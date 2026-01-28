"use client";

import React, { useState, useCallback } from 'react';
import { ResponsiveModal } from '@/components/common/ResponsiveModal';
import { FormField } from '@/components/common/FormField';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/hooks/use-toast';
import { profileService } from '@/services/profileService';
import { User, Phone } from 'lucide-react';
import { isValidPhone } from '@/lib/utils';
import styles from './ProfileCompletionModal.module.scss';

interface ProfileCompletionModalProps {
    isOpen: boolean;
    userId: string;
    defaultName?: string;
    onComplete: () => void;
    onLogout?: () => void;
}

export function ProfileCompletionModal({
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
            toast({ variant: 'destructive', description: '이름을 입력해 주세요.' });
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

            toast({ description: '프로필이 업데이트되었습니다.' });
            onComplete();
        } catch {
            toast({
                variant: 'destructive',
                description: '프로필 업데이트 중 오류가 발생했습니다.',
            });
        } finally {
            setLoading(false);
        }
    }, [name, phone, userId, toast, onComplete]);

    const logoutButton = onLogout ? (
        <button
            type="button"
            onClick={onLogout}
            className={styles.logoutButton}
        >
            로그아웃
        </button>
    ) : undefined;

    return (
        <ResponsiveModal
            open={isOpen}
            onOpenChange={() => { }} // 필수 입력용으로 닫기 비활성화
            dismissible={false}
            title="프로필 완성"
            description={null}

            // Native Footer Props for "Sticky Bottom" style
            onConfirm={handleSubmit}
            confirmText="시작하기"
            showCancel={false}
            confirmDisabled={loading || !name.trim() || !phone.trim()}
            confirmLoading={loading}

            // Outer Footer for Logout
            outerFooter={logoutButton}
        >
            <div className={styles.container}>
                <div style={{ textAlign: 'center', color: '#4E5968', marginBottom: '1.5rem', wordBreak: 'keep-all', fontSize: '1.0625rem' }}>
                    청첩장 서비스 이용을 위해 이름과 연락처를 입력해 주세요.
                </div>
                <div className={styles.inputList}>
                    <div className={styles.inputGroup}>
                        <div className={styles.inputIcon}>
                            <User size={18} />
                        </div>
                        <FormField className={styles.inputField || ''}>
                            <Input
                                placeholder="이름 (실명)"
                                value={name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            />
                        </FormField>
                    </div>

                    <div className={styles.inputGroup}>
                        <div className={styles.inputIcon}>
                            <Phone size={18} />
                        </div>
                        <FormField className={styles.inputField || ''}>
                            <Input
                                placeholder="연락처 (- 없이 입력)"
                                value={phone}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                            />
                        </FormField>
                    </div>
                </div>

                <div className={styles.infoBox}>
                    <p>
                        입력하신 정보는 청첩장 승인 요청 시 본인 확인용으로만 사용되며,
                        <br />
                        타인에게 공개되거나 광고 목적 등으로 사용되지 않습니다.
                    </p>
                </div>
            </div>
        </ResponsiveModal>
    );
}

ProfileCompletionModal.displayName = "ProfileCompletionModal";
