import { ApprovalRequestSummary } from '@/services/approvalRequestService';

export const REVOKED_MARKER = '[REVOKED]';

/**
 * 거절/취소 사유와 상태를 분석하여 UI에 표시할 정보를 반환합니다.
 */
export function parseRejection(request: ApprovalRequestSummary | null | undefined) {
  if (!request) {
    return {
      isRevoked: false,
      isRejected: false,
      isApproved: false,
      displayReason: '',
      rawReason: '',
      label: '',
      badge: '',
      title: '',
      description: '',
    };
  }

  const status = request.status;
  const rawReason = request.rejection_reason || '';

  // 마커가 있거나 상태가 취소 관련이면 취소로 간주
  const hasMarker = rawReason.startsWith(REVOKED_MARKER);
  const isRevoked = status === 'revoked' || status === 'canceled' || hasMarker;
  const isRejected = status === 'rejected' && !isRevoked; // 순수 거절
  const isApproved = status === 'approved';

  // 마커 제거된 사유
  const displayReason = hasMarker ? rawReason.replace(REVOKED_MARKER, '') : rawReason;

  return {
    isRevoked,
    isRejected, // 순수 거절 상태 (취소 아님)
    isApproved, // 승인 완료 상태
    displayReason, // UI 표시용 사유
    rawReason, // 원본 사유

    // UI 텍스트 상수를 여기서 통합 관리
    label: isApproved ? '승인 메시지' : isRevoked ? '취소 사유' : '거절 사유',
    badge: isApproved ? '승인 완료' : isRevoked ? '승인 취소' : '승인 거절',
    title: isApproved ? '승인이 완료되었어요' : isRevoked ? '승인 취소 사유' : '승인 거절 사유',
    description: '',
  };
}

/**
 * DB 저장용 사유 생성 (승인 취소인 경우 마커 부착)
 */
export function createRejectionReason(reason: string, isRevocation: boolean): string {
  return isRevocation ? `${REVOKED_MARKER}${reason}` : reason;
}
