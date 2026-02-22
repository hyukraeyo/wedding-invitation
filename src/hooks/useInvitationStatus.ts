import { InvitationSummaryRecord } from '@/lib/invitation-summary';

export interface UseInvitationStatusProps {
  invitation: InvitationSummaryRecord;
  rejectionData: { rejection_reason?: string } | null | undefined;
}

export const useInvitationStatus = ({ invitation, rejectionData }: UseInvitationStatusProps) => {
  const data = invitation.invitation_data;
  const isApproved = !!data?.isApproved;
  const isRequesting = !!data?.isRequestingApproval && !isApproved;
  const isRejected = !!rejectionData && !isApproved && !isRequesting;

  return {
    data,
    isApproved,
    isRequesting,
    isRejected,
    imageUrl: data?.imageUrl,
    title: data?.mainScreen?.title || '제목없음',
    slug: invitation.slug,
  };
};
