"use client";

import React, { useState } from 'react';
import { MyPageHeader } from '@/components/mypage/MyPageHeader';
import { PhoneField } from '@/components/common/PhoneField';
import { Button } from '@/components/ui/Button';
import styles from './AccountPage.module.scss';
import { Banana } from 'lucide-react';
import { clsx } from 'clsx';
import { profileService } from '@/services/profileService';
import { useToast } from '@/hooks/use-toast';
import { MENU_TITLES } from '@/constants/navigation';
import { useRouter } from 'next/navigation';

interface ProfileData {
    id: string;
    full_name: string | null;
    phone: string | null;
    email?: string | null;
    is_profile_complete: boolean;
}

interface AccountPageClientProps {
    profile: ProfileData;
    isAdmin: boolean;
    userEmail: string | null;
    invitationCount: number;
    requestCount: number;
}

export default function AccountPageClient({
    profile,
    userEmail,
}: AccountPageClientProps) {
    const { toast } = useToast();
    const router = useRouter();

    const [isEditingPhone, setIsEditingPhone] = useState(false);

    const [formData, setFormData] = useState({
        phone: profile.phone || '',
    });

    const handleSavePhone = async () => {
        try {
            await profileService.updateProfile(profile.id, {
                phone: formData.phone,
            });
            toast({ description: '휴대폰 번호가 변경되었습니다.' });
            setIsEditingPhone(false);
            router.refresh();
        } catch {
            toast({ variant: 'destructive', description: '저장에 실패했습니다.' });
        }
    };



    return (
        <>
            <MyPageHeader title={MENU_TITLES.ACCOUNT} />

            <div className={styles.contentCard}>
                <div className={styles.profileHeader}>
                    <div className={styles.avatarWrapper}>
                        <div className={styles.avatar}>
                            <Banana size={36} strokeWidth={1.5} />
                        </div>
                    </div>
                    <h2 className={styles.headerName}>{profile.full_name || '이름 없음'}</h2>
                    <p className={styles.headerEmail}>{userEmail}</p>
                </div>

                <div className={styles.formSection}>
                    {/* Name Row (Read-Only) */}
                    <div className={styles.infoRow}>
                        <div className={styles.labelWrapper}>
                            <span className={styles.label}>이름</span>
                        </div>
                        <div className={styles.value}>
                            {profile.full_name}
                        </div>
                        <div className={styles.actionPlaceholder} />
                    </div>

                    {/* Email Row (Read-Only) */}
                    <div className={styles.infoRow}>
                        <div className={styles.labelWrapper}>
                            <span className={styles.label}>이메일</span>
                        </div>
                        <div className={styles.value}>
                            {userEmail}
                        </div>
                        <div className={styles.actionPlaceholder} />
                    </div>

                    {/* Phone Row (Editable) */}
                    <div className={clsx(styles.infoRow, isEditingPhone && styles.editingRow)}>
                        <div className={styles.labelWrapper}>
                            <span className={styles.label}>휴대폰 번호</span>
                        </div>
                        <div className={styles.value}>
                            {isEditingPhone ? (
                                <div className={styles.editWrapper}>
                                    <PhoneField
                                        className={styles.phoneInput}
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="010-0000-0000"
                                    />
                                    <div className={styles.editActions}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setIsEditingPhone(false);
                                                setFormData({ phone: profile.phone || '' });
                                            }}
                                        >
                                            취소
                                        </Button>
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={handleSavePhone}
                                        >
                                            저장
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                formData.phone || '설정되지 않음'
                            )}
                        </div>
                        {!isEditingPhone && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsEditingPhone(true)}
                                className={styles.changeButton}
                            >
                                변경
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
