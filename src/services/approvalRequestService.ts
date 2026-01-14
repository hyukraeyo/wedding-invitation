interface ApprovalRequestPayload {
  invitationId: string;
  invitationSlug: string;
  requesterName: string;
  requesterPhone: string;
}


export interface ApprovalRequestRecord {
  id: string;
  invitation_id: string;
  invitation_slug: string;
  requester_name: string;
  requester_phone: string;
  user_id: string;
  created_at: string;
}

export const approvalRequestService = {
  async createRequest(payload: ApprovalRequestPayload) {
    const response = await fetch('/api/approval-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Approval request failed');
    }

    const result = await response.json();
    return result.data as ApprovalRequestRecord;
  },


  async cancelRequest(invitationId: string) {
    const response = await fetch(`/api/approval-requests?invitationId=${invitationId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to cancel request');
    }

    return true;
  },

  async getAllRequests() {
    const response = await fetch('/api/approval-requests');

    if (!response.ok) {
      throw new Error('Approval request fetch failed');
    }

    const result = await response.json();
    return result.data as ApprovalRequestRecord[];
  },
};
