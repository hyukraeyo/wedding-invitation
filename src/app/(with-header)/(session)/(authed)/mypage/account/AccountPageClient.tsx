'use client';

import React, { useState } from 'react';
import { MyPageContent } from '@/components/mypage/MyPageContent';
import { TextField } from '@/components/ui/TextField';
import { Button } from '@/components/ui/Button';
import styles from './AccountPage.module.scss';
import { Banana, User, Mail, Phone } from 'lucide-react';
import { clsx } from 'clsx';
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
  invitationCount: number;
  requestCount: number;
}

export default function AccountPageClient({ profile, userEmail }: AccountPageClientProps) {
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
      toast({ description: '휴대폰 번호가 변경되었어요.' });
      setIsEditingPhone(false);
      router.refresh();
    } catch {
      toast({ variant: 'destructive', description: '저장에 실패했어요.' });
    }
  };

  return (
    <MyPageContent className={styles.accountList}>
      <div className={styles.profileHeader}>
        <div className={styles.avatarWrapper}>
          <div className={styles.avatar}>
            <Banana size={40} strokeWidth={1.5} />
          </div>
        </div>
        <div className={styles.headerInfo}>
          <h2 className={styles.headerName}>{profile.full_name || '이름 없음'}</h2>
          <p className={styles.headerEmail}>{userEmail}</p>
        </div>
      </div>

      {/* Name Row */}
      <div className={styles.accountItem}>
        <div className={styles.itemHeader}>
          <User size={16} strokeWidth={2} className={styles.icon} />
          <span className={styles.itemLabel}>이름</span>
        </div>
        <div className={styles.itemContent}>
          <div className={styles.itemValue}>{profile.full_name}</div>
        </div>
      </div>

      {/* Email Row */}
      <div className={styles.accountItem}>
        <div className={styles.itemHeader}>
          <Mail size={16} strokeWidth={2} className={styles.icon} />
          <span className={styles.itemLabel}>이메일</span>
        </div>
        <div className={styles.itemContent}>
          <div className={styles.itemValue}>{userEmail}</div>
        </div>
      </div>

      {/* Phone Row */}
      <div className={clsx(styles.accountItem, isEditingPhone && styles.editing)}>
        <div className={styles.itemHeader}>
          <Phone size={16} strokeWidth={2} className={styles.icon} />
          <span className={styles.itemLabel}>휴대폰 번호</span>
        </div>

        <div className={styles.itemContent}>
          {isEditingPhone ? (
            <div className={styles.editWrapper}>
              <TextField
                value={formData.phone || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="010-0000-0000"
                className={styles.phoneInput || ''}
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
                <Button variant="primary" size="sm" onClick={handleSavePhone}>
                  저장
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.itemValue}>{formData.phone || '설정되지 않음'}</div>
              <button onClick={() => setIsEditingPhone(true)} className={styles.changeButton}>
                변경
              </button>
            </>
          )}
        </div>
      </div>
    </MyPageContent>
  );
}
