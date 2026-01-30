'use client';

import React, { useState } from 'react';
import { Menu } from '@/components/ui/Menu';
import {
    Share2,
    Edit3,
    Trash2,
    XCircle,
    AlertCircle,
    MoreVertical,
    Calendar
} from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import { ResponsiveModal } from '../ResponsiveModal';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { InvitationSummaryRecord } from '@/lib/invitation-summary';
import { ApprovalRequestSummary } from '@/services/approvalRequestService';

import { ShareModal } from '../ShareModal';

interface InvitationActionMenuProps {
    invitation: InvitationSummaryRecord;
    isAdmin?: boolean;
    rejectionData?: ApprovalRequestSummary | null | undefined;
    onEdit: (inv: InvitationSummaryRecord) => void;
    onDelete: (inv: InvitationSummaryRecord) => void;
    onRequestApproval: (inv: InvitationSummaryRecord) => void;
    onCancelRequest: (inv: InvitationSummaryRecord) => void;
    onRevertToDraft?: (inv: InvitationSummaryRecord) => void;
    onRevokeApproval?: (inv: InvitationSummaryRecord) => void;
    className?: string;
}

export const InvitationActionMenu: React.FC<InvitationActionMenuProps> = ({
    invitation,
    isAdmin = false,
    rejectionData = null,
    onEdit,
    onDelete,
    onRequestApproval,
    onCancelRequest,
    onRevertToDraft,
    onRevokeApproval,
    className
}) => {
    const data = invitation.invitation_data;
    const isApproved = !!data?.isApproved;
    const isRequesting = !!data?.isRequestingApproval && !isApproved;
    const isRejected = !!rejectionData && !isApproved && !isRequesting;
    const formattedDate = format(new Date(invitation.updated_at), 'yyyy.MM.dd', { locale: ko });

    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showEditConfirmModal, setShowEditConfirmModal] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // TDS Menu items have strict internal types; using typed wrappers for standard prop access
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const DropdownItem = Menu.DropdownItem as React.FC<any>;

    const REJECTION_LABEL = data?.kakaoShare?.buttonType === 'rsvp' ? '답장 거절 사유' : '청첩장 거절 사유';

    const handleRejectionModalOpen = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        setShowRejectionModal(true);
    };

    const handleEditClick = () => {
        if (isApproved && onRevertToDraft) {
            setShowEditConfirmModal(true);
        } else {
            onEdit(invitation);
        }
    };

    const handleConfirmEdit = () => {
        setShowEditConfirmModal(false);
        if (onRevertToDraft) {
            onRevertToDraft(invitation);
        }
    };

    const imageUrl = data?.imageUrl;
    const title = data?.mainScreen?.title || '제목없음';
    const slug = invitation.slug;

    return (
        <>
            <Menu.Trigger
                open={isMenuOpen}
                onOpen={() => setIsMenuOpen(true)}
                onClose={() => setIsMenuOpen(false)}
                placement="bottom-end"
                dropdown={
                    <Menu.Dropdown>
                        {!isApproved && !isRequesting && (
                            <>
                                <DropdownItem
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        handleEditClick();
                                    }}
                                    left={<Edit3 size={16} />}
                                >
                                    수정하기
                                </DropdownItem>

                                <DropdownItem
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        onRequestApproval(invitation);
                                    }}
                                    left={<Share2 size={16} style={{ color: 'var(--color-primary)' }} />}
                                >
                                    승인 신청
                                </DropdownItem>
                            </>
                        )}

                        {(isApproved || isRequesting) && (
                            <>
                                {!isRequesting && (
                                    <DropdownItem
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            setShowShareModal(true);
                                        }}
                                        left={<Share2 size={16} style={{ color: 'var(--color-primary)' }} />}
                                    >
                                        공유하기
                                    </DropdownItem>
                                )}
                                {isRequesting && (
                                    <DropdownItem
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            onCancelRequest(invitation);
                                        }}
                                        left={<XCircle size={16} />}
                                    >
                                        신청 취소
                                    </DropdownItem>
                                )}
                            </>
                        )}

                        {isAdmin && isApproved && (
                            <DropdownItem
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    onRevokeApproval?.(invitation);
                                }}
                                left={<XCircle size={16} />}
                            >
                                승인 철회
                            </DropdownItem>
                        )}

                        {isRejected && (
                            <DropdownItem
                                onClick={(e: React.MouseEvent) => {
                                    setIsMenuOpen(false);
                                    handleRejectionModalOpen(e.nativeEvent);
                                }}
                                left={<AlertCircle size={16} />}
                            >
                                {REJECTION_LABEL} 확인
                            </DropdownItem>
                        )}
                        {!isRequesting && (
                            <DropdownItem
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    setTimeout(() => onDelete(invitation), 0);
                                }}
                                style={{ color: '#EF4444' }}
                                left={<Trash2 size={16} />}
                            >
                                삭제하기
                            </DropdownItem>
                        )}
                        <DropdownItem
                            disabled
                            left={<Calendar size={14} />}
                        >
                            <span style={{ fontSize: '12px', color: '#999' }}>생성일 {formattedDate}</span>
                        </DropdownItem>
                    </Menu.Dropdown>
                }
            >
                <IconButton
                    variant="clear"
                    iconSize={20}
                    className={className}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    aria-label="메뉴 열기"
                    name=""
                >
                    <MoreVertical size={20} />
                </IconButton>
            </Menu.Trigger>

            {/* 공유 모달 */}
            <ShareModal
                open={showShareModal}
                onOpenChange={setShowShareModal}
                invitationUrl={`${window.location.origin}/v/${slug}`}
                invitationTitle={title || ''}
                invitationDescription={`${data?.date || ''} ${data?.location || ''}`.trim() || ''}
                invitationImageUrl={imageUrl || ''}
                slug={slug}
            />

            {/* 거절 사유 모달 */}
            <ResponsiveModal
                open={showRejectionModal}
                onOpenChange={setShowRejectionModal}
                title={REJECTION_LABEL}
                description="관리자가 작성한 거절 사유입니다"
                showCancel={false}
            >
                <div style={{
                    backgroundColor: '#FEF3F2',
                    borderRadius: '8px',
                    padding: '16px',
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.6'
                }}>
                    {rejectionData?.rejection_reason || '거절 사유가 없습니다.'}
                </div>
            </ResponsiveModal>

            {/* 수정 확인 모달 */}
            <ResponsiveModal
                open={showEditConfirmModal}
                onOpenChange={setShowEditConfirmModal}
                title="수정 확인"
                description="이미 승인이 완료된 청첩장입니다"
                cancelText="취소"
                confirmText="수정하기"
                onConfirm={handleConfirmEdit}
            >
                <div style={{ textAlign: 'center', lineHeight: '1.6', wordBreak: 'keep-all' }}>
                    이미 승인이 완료된 청첩장입니다.<br />
                    수정 모드로 전환 시 <strong>다시 승인 신청</strong>을 해야 공유가 가능합니다. 수정하시겠습니까?
                </div>
            </ResponsiveModal>
        </>
    );
};