import type { ApprovalRequestSummary } from '@/lib/approval-request-summary';

export type { ApprovalRequestSummary };

interface ApprovalRequestPayload {
  invitationId: string;
  invitationSlug: string;
  requesterName: string;
  requesterPhone: string;
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
    return result.data as ApprovalRequestSummary;
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

  async rejectRequest(invitationId: string, rejectionReason: string) {
    const response = await fetch('/api/approval-requests', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invitationId, rejectionReason }),
    });

    if (!response.ok) {
      throw new Error('Failed to reject request');
    }

    return true;
  },

  async getAllRequests() {
    const response = await fetch('/api/approval-requests');

    if (!response.ok) {
      throw new Error('Approval request fetch failed');
    }

    const result = await response.json();
    return result.data as ApprovalRequestSummary[];
  },

  async getUserRejectedRequests() {
    const response = await fetch('/api/approval-requests?userOnly=true');

    if (!response.ok) {
      throw new Error('Failed to fetch rejected requests');
    }

    const result = await response.json();
    return result.data as ApprovalRequestSummary[];
  },
};
