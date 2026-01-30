"use client";

import React, { useState, useCallback } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
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
        <Button
            type="button"
            variant="weak"
            onClick={onLogout}
            className={styles.logoutButton}
        >
            로그아웃
        </Button>
    ) : undefined;

    return (
        <Modal open={isOpen} onOpenChange={() => { }}>
            <Modal.Overlay />
            <Modal.Content>
                <Modal.Header title="프로필 완성" />
                <Modal.Body>
                    <div className={styles.introText}>
                        청첩장 서비스 이용을 위해 이름과 연락처를 입력해 주세요.
                    </div>
                    <div className={styles.inputList}>
                        <TextField.Root variant="classic" className={styles.inputField}>
                            <TextField.Slot side="left">
                                <User size={18} />
                            </TextField.Slot>
                            <TextField.Input
                                placeholder="이름 (실명)"
                                value={name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            />
                        </TextField.Root>

                        <TextField.Root variant="classic" className={styles.inputField}>
                            <TextField.Slot side="left">
                                <Phone size={18} />
                            </TextField.Slot>
                            <TextField.Input
                                placeholder="연락처 (- 없이 입력)"
                                value={phone}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                            />
                        </TextField.Root>
                    </div>

                    <div className={styles.infoBox}>
                        <p>
                            입력하신 정보는 청첩장 승인 요청 시 본인 확인용으로만 사용되며,
                            <br />
                            타인에게 공개되거나 광고 목적 등으로 사용되지 않습니다.
                        </p>
                    </div>
                </Modal.Body>

                <Modal.Footer className={styles.footer}>
                    <Button
                        className={styles.fullWidth}
                        variant="fill"
                        size="lg"
                        loading={loading}
                        disabled={loading || !name.trim() || !phone.trim()}
                        onClick={handleSubmit}
                    >
                        시작하기
                    </Button>
                    {logoutButton && (
                        <div className={styles.outerFooter}>
                            {logoutButton}
                        </div>
                    )}
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
}

ProfileCompletionModal.displayName = "ProfileCompletionModal";
