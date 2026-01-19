export const APPROVAL_REQUEST_SUMMARY_SELECT = [
  'id',
  'invitation_id',
  'invitation_slug',
  'requester_name',
  'requester_phone',
  'created_at',
  'status',
  'rejection_reason',
].join(', ');

export interface ApprovalRequestSummary {
  id: string;
  invitation_id: string;
  invitation_slug: string;
  requester_name: string;
  requester_phone: string;
  created_at: string;
  status?: string;
  rejection_reason?: string;
}
