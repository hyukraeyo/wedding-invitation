"use client";

import React, { useState, useEffect } from 'react';
import { MyPageHeader } from '@/components/mypage/MyPageHeader';
import { AlertCircle, Bell, CheckCircle2, ChevronRight, Mail, XCircle } from 'lucide-react';
import styles from './NotificationsPage.module.scss';
import { parseRejection } from '@/lib/rejection-helpers';
import type { ApprovalRequestSummary } from '@/lib/approval-request-summary';
import { invitationService } from '@/services/invitationService';
import { useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MENU_TITLES } from '@/constants/navigation';
import { EmptyState } from '@/components/ui/EmptyState';

interface ProfileData {
    full_name: string | null;
    phone: string | null;
    is_admin?: boolean;
}

interface NotificationsClientProps {
    userId: string | null;
    profile: ProfileData | null;
    isAdmin: boolean;
    notifications: ApprovalRequestSummary[];
}

export default function NotificationsClient({ userId, notifications }: NotificationsClientProps) {
    const router = useRouter();
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // UX: 알림 페이지 진입 시 배지(hasNewRejection) 모두 제거
    useEffect(() => {
        const clearNotifications = async () => {
            if (!userId || notifications.length === 0) return;

            try {
                // Find all invitation IDs that have notifications shown here
                const invitationIds = Array.from(new Set(notifications.map(n => n.invitation_id)));

                // Mark each as read in parallel
                await Promise.all(invitationIds.map(id => invitationService.markNotificationAsRead(id)));

                // Sync sidebar counts
                router.refresh();
            } catch (error) {
                console.error('Failed to clear notifications:', error);
            }
        };

        clearNotifications();
    }, [userId, notifications, router]);

    const handleToggle = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className={styles.container}>
            <MyPageHeader title={MENU_TITLES.NOTIFICATIONS} />

            <div className={styles.content}>
                {notifications.length > 0 ? (
                    <div className={styles.notificationList}>
                        {notifications.map((notif) => {
                            const { badge, title, displayReason, isRevoked, isRejected, isApproved } = parseRejection(notif);
                            const date = new Date(notif.created_at);
                            const formattedDate = format(date, 'yyyy. MM. dd. HH:mm', { locale: ko });
                            const isExpanded = expandedId === notif.id;

                            // Dynamic icon based on status
                            const StatusIcon = isApproved ? CheckCircle2 :
                                isRevoked ? XCircle : AlertCircle;

                            return (
                                <div
                                    key={notif.id}
                                    className={clsx(
                                        styles.notificationItem,
                                        isExpanded && styles.expanded,
                                        isApproved && styles.approvedItem,
                                        isRejected && styles.rejectedItem,
                                        isRevoked && styles.revokedItem
                                    )}
                                    onClick={() => handleToggle(notif.id)}
                                >
                                    <div className={styles.itemHeader}>
                                        <div className={clsx(
                                            styles.iconWrapper,
                                            isApproved && styles.iconApproved,
                                            isRejected && styles.iconRejected,
                                            isRevoked && styles.iconRevoked
                                        )}>
                                            <StatusIcon size={20} />
                                        </div>
                                        <div className={styles.itemInfo}>
                                            <div className={styles.itemTitle}>
                                                <strong>{badge}</strong> 소식이 도착했습니다.
                                            </div>
                                            <div className={styles.itemDate}>
                                                {formattedDate}
                                            </div>
                                        </div>
                                        <div className={clsx(styles.chevronWrapper, isExpanded && styles.expandedChevron)}>
                                            <ChevronRight size={18} />
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className={styles.itemBody}>
                                            <div className={styles.invitationInfo}>
                                                <Mail size={14} className="mr-1 inline-block" />
                                                청첩장: <strong>{notif.invitation_slug}</strong>
                                            </div>
                                            <div className={styles.reasonBox}>
                                                <div className={styles.reasonTitle}>{title}</div>
                                                <div
                                                    className={styles.reasonContent}
                                                    dangerouslySetInnerHTML={{ __html: displayReason || '상세 사유가 없습니다.' }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <EmptyState
                        icon={<Bell size={40} />}
                        title="새로운 알림이 없어요"
                        description={<>중요한 업데이트나 신청 결과가 있을 때<br />이곳에서 가장 먼저 알려드릴게요.</>}
                    />
                )}
            </div>
        </div>
    );
}
