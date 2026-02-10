"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AlertCircle, Bell, CheckCircle2, ChevronRight, Mail, XCircle } from 'lucide-react';
import styles from './NotificationsPage.module.scss';
import { parseRejection } from '@/lib/rejection-helpers';
import type { ApprovalRequestSummary } from '@/lib/approval-request-summary';
import { invitationService } from '@/services/invitationService';
import { useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { EmptyState } from '@/components/common/EmptyState';
import { NotificationToggleButton } from '@/components/common/NotificationToggleButton';

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
    const clearedRef = useRef<string | null>(null);

    // 알림 리스트 메모이제이션 (파싱 및 포맷팅 비용 절감)
    const processedNotifications = useMemo(() => {
        return notifications.map(notif => {
            const parsed = parseRejection(notif);
            const date = new Date(notif.created_at);
            const formattedDate = format(date, 'yyyy. MM. dd. HH:mm', { locale: ko });
            const StatusIcon = parsed.isApproved ? CheckCircle2 :
                parsed.isRevoked ? XCircle : AlertCircle;

            return {
                ...notif,
                ...parsed,
                formattedDate,
                StatusIcon
            };
        });
    }, [notifications]);

    // UX: 알림 페이지 진입 시 배지(hasNewRejection) 모두 제거
    useEffect(() => {
        const clearNotifications = async () => {
            if (!userId || notifications.length === 0) return;

            // 이미 현재 알림들에 대해 클리어 작업을 수행했다면 중단 (무한 루프 방지)
            const currentIdsHash = notifications.map(n => n.id).sort().join(',');
            if (clearedRef.current === currentIdsHash) return;

            try {
                clearedRef.current = currentIdsHash;

                // Find all invitation IDs that have notifications shown here
                const invitationIds = Array.from(new Set(notifications.map(n => n.invitation_id)));

                // Mark each as read in parallel
                await Promise.all(invitationIds.map(id => invitationService.markNotificationAsRead(id)));

                // Sync sidebar counts
                router.refresh();
            } catch (error) {
                console.error('Failed to clear notifications:', error);
                // 에러 발생 시 다음에 다시 시도할 수 있도록 초기화
                clearedRef.current = null;
            }
        };

        clearNotifications();
    }, [userId, notifications, router]);

    const handleToggle = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                {processedNotifications.length > 0 ? (
                    <div className={styles.notificationList}>
                        {processedNotifications.map((notif) => {
                            const isExpanded = expandedId === notif.id;
                            const { StatusIcon } = notif;

                            return (
                                <div
                                    key={notif.id}
                                    className={clsx(
                                        styles.notificationItem,
                                        isExpanded && styles.expanded,
                                        notif.isApproved && styles.approvedItem,
                                        notif.isRejected && styles.rejectedItem,
                                        notif.isRevoked && styles.revokedItem
                                    )}
                                >
                                    <NotificationToggleButton
                                        className={styles.itemButton}
                                        onClick={() => handleToggle(notif.id)}
                                        aria-expanded={isExpanded}
                                        aria-controls={`notification-body-${notif.id}`}
                                        aria-label={`${notif.badge} 알림 상세 보기`}
                                    >
                                        <div className={styles.itemHeader}>
                                            <div className={clsx(
                                                styles.iconWrapper,
                                                notif.isApproved && styles.iconApproved,
                                                notif.isRejected && styles.iconRejected,
                                                notif.isRevoked && styles.iconRevoked
                                            )}>
                                                <StatusIcon size={20} />
                                            </div>
                                            <div className={styles.itemInfo}>
                                                <div className={styles.itemTitle}>
                                                    <strong>{notif.badge}</strong> 소식이 도착했어요.
                                                </div>
                                                <div className={styles.itemDate}>
                                                    {notif.formattedDate}
                                                </div>
                                            </div>
                                            <div className={clsx(styles.chevronWrapper, isExpanded && styles.expandedChevron)}>
                                                <ChevronRight size={18} />
                                            </div>
                                        </div>
                                    </NotificationToggleButton>

                                    {isExpanded && (
                                        <div id={`notification-body-${notif.id}`} className={styles.itemBody}>
                                            <div className={styles.invitationInfo}>
                                                <Mail size={14} className={styles.invitationIcon} />
                                                청첩장: <strong>{notif.invitation_slug}</strong>
                                            </div>
                                            <div className={styles.reasonBox}>
                                                <div className={styles.reasonTitle}>{notif.title}</div>
                                                <div
                                                    className={styles.reasonContent}
                                                    dangerouslySetInnerHTML={{ __html: notif.displayReason || '상세 사유가 없어요.' }}
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
