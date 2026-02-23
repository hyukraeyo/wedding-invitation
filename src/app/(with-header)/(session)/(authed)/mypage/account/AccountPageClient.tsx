'use client';

import React, { useState } from 'react';
import { MyPageContent } from '@/components/mypage/MyPageContent';
import { TextField } from '@/components/ui/TextField';
import { Button } from '@/components/ui/Button';
import styles from './AccountPage.module.scss';
import { User, Mail, Phone } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { clsx } from 'clsx';
import { profileService } from '@/services/profileService';
import { useToast } from '@/hooks/use-toast';
import { usePhoneInput } from '@/hooks/useFormInput';
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

  const handlePhoneChange = usePhoneInput((phone) => {
    setFormData((prev) => ({ ...prev, phone }));
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
          <Avatar className={styles.avatar}>
            <Avatar.Fallback>{profile.full_name?.[0]}</Avatar.Fallback>
          </Avatar>
        </div>
        <div className={styles.headerInfo}>
          <h2 className={styles.headerName}>{profile.full_name || '이름이 없어요'}</h2>
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
              <div className={styles.phoneInput}>
                <TextField
                  value={formData.phone || ''}
                  onChange={handlePhoneChange}
                  placeholder="010-0000-0000"
                />
              </div>
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
                <Button size="sm" onClick={handleSavePhone}>
                  저장
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.itemValue}>{formData.phone || '설정되지 않았어요'}</div>
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
