"use client";

import React, { useState } from 'react';
import Header from '@/components/common/Header';
import { MyPageSidebar } from '@/components/mypage/MyPageSidebar';
import styles from './AccountPage.module.scss';
import { Banana, Settings, User } from 'lucide-react';
import { profileService } from '@/services/profileService';
import { useToast } from '@/hooks/use-toast';
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
}

export default function AccountPageClient({ profile, isAdmin, userEmail }: AccountPageClientProps) {
    const { toast } = useToast();
    const router = useRouter();

    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingPhone, setIsEditingPhone] = useState(false);

    const [formData, setFormData] = useState({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        isAgreed: false,
    });

    const handleSave = async () => {
        try {
            await profileService.updateProfile(profile.id, {
                full_name: formData.full_name,
                phone: formData.phone,
            });
            toast({ description: '프로필이 변경되었습니다.' });
            setIsEditingName(false);
            setIsEditingPhone(false);
            router.refresh();
        } catch (error) {
            toast({ variant: 'destructive', description: '프로필 저장에 실패했습니다.' });
        }
    };

    const handleWithdrawal = () => {
        if (confirm('정말로 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.')) {
            toast({ description: '탈퇴 기능은 아직 구현되지 않았습니다.' });
        }
    };

    return (
        <div className={styles.pageContainer}>
            <Header />
            <div className={styles.layout}>
                <MyPageSidebar
                    profile={profile}
                    isAdmin={isAdmin}
                    userEmail={userEmail}
                />

                <main className={styles.mainContent}>
                    <div className={styles.sectionHeader}>
                        <h1 className={styles.sectionTitle}>내 계정관리</h1>
                    </div>

                    <div className={styles.contentCard}>
                        <div className={styles.profileHeader}>
                            <div className={styles.avatarWrapper}>
                                <div className={styles.avatar}>
                                    <Banana size={40} strokeWidth={1.5} />
                                </div>
                                <div className={styles.settingsIcon}>
                                    <Settings size={14} />
                                </div>
                            </div>
                            <h2 className={styles.headerName}>{formData.full_name || '닉네임없음'}</h2>
                            <p className={styles.headerEmail}>{userEmail}</p>
                        </div>

                        <div className={styles.formSection}>
                            {/* Nickname Row */}
                            <div className={styles.formRow}>
                                <div className={styles.label}>닉네임</div>
                                <div className={styles.value}>
                                    {isEditingName ? (
                                        <input
                                            type="text"
                                            className={styles.input}
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            placeholder="닉네임을 입력하세요"
                                        />
                                    ) : (
                                        formData.full_name || '설정되지 않음'
                                    )}
                                </div>
                                {!isEditingName && (
                                    <button className={styles.changeButton} onClick={() => setIsEditingName(true)}>
                                        변경
                                    </button>
                                )}
                            </div>

                            {/* Phone Row */}
                            <div className={styles.formRow}>
                                <div className={styles.label}>휴대폰 번호</div>
                                <div className={styles.value}>
                                    {isEditingPhone ? (
                                        <input
                                            type="tel"
                                            className={styles.input}
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="010-0000-0000"
                                        />
                                    ) : (
                                        formData.phone || '설정되지 않음'
                                    )}
                                </div>
                                <button className={styles.changeButton} onClick={() => setIsEditingPhone(!isEditingPhone)}>
                                    {isEditingPhone ? '취소' : '변경'}
                                </button>
                            </div>

                            {/* Email Row (ReadOnly) */}
                            <div className={styles.formRow}>
                                <div className={styles.label}>아이디 (이메일)</div>
                                <div className={styles.value} style={{ color: '#888' }}>
                                    {userEmail}
                                </div>
                            </div>
                        </div>

                        <label className={styles.agreementSection}>
                            <input
                                type="checkbox"
                                checked={formData.isAgreed}
                                onChange={(e) => setFormData({ ...formData, isAgreed: e.target.checked })}
                            />
                            이벤트 혜택 정보 및 광고 알림 수신 동의
                        </label>

                        {(isEditingName || isEditingPhone) && (
                            <div className={styles.actionButtons}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => {
                                        setIsEditingName(false);
                                        setIsEditingPhone(false);
                                        setFormData({
                                            ...formData,
                                            full_name: profile.full_name || '',
                                            phone: profile.phone || ''
                                        });
                                    }}
                                >
                                    취소
                                </button>
                                <button className={styles.saveButton} onClick={handleSave}>
                                    변경 저장
                                </button>
                            </div>
                        )}

                        <button className={styles.withdrawalButton} onClick={handleWithdrawal}>
                            회원 탈퇴
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}
