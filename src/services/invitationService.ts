import type { SupabaseClient } from '@supabase/supabase-js';
import { InvitationData } from '@/store/useInvitationStore';
import { serverInvitationService } from './serverInvitationService';
import { clientInvitationService } from './clientInvitationService';

type OptionalClient = SupabaseClient | null | undefined;

/**
 * Unified invitation service API with clear runtime boundaries
 *
 * SERVER COMPONENTS: Use serverInvitationService (requires server client)
 * CLIENT COMPONENTS: Use clientInvitationService (auto-creates browser client)
 */
export const invitationService = {
  ...serverInvitationService,
  ...clientInvitationService,

  /**
   * Save invitation data
   * Runtime boundary handled by specific service implementation
   */
  async saveInvitation(
    slug: string,
    data: InvitationData,
    userId?: string,
    client?: OptionalClient
  ) {
    if (client) {
      // When client is provided, use it (works for both server and browser clients)
      return clientInvitationService.saveInvitation(slug, data, userId, client);
    } else {
      // No client: Must be browser environment
      return clientInvitationService.saveInvitation(slug, data, userId);
    }
  },

  /**
   * Get all invitations (server only)
   */
  async getAllInvitations(client?: OptionalClient) {
    if (!client) {
      throw new Error('getAllInvitations requires server client');
    }
    return serverInvitationService.getAllInvitations(client);
  },

  /**
   * Get user invitations
   * Runtime boundary handled by specific service implementation
   */
  async getUserInvitations(userId: string, client?: OptionalClient) {
    if (client) {
      return clientInvitationService.getUserInvitations(userId, client);
    } else {
      return clientInvitationService.getUserInvitations(userId);
    }
  },

  /**
   * Get invitation by slug
   * Runtime boundary handled by specific service implementation
   */
  async getInvitation(slug: string, client?: OptionalClient) {
    if (client) {
      return clientInvitationService.getInvitation(slug, client);
    } else {
      return clientInvitationService.getInvitation(slug);
    }
  },

  /**
   * Get invitations by slugs
   * Runtime boundary handled by specific service implementation
   */
  async getInvitationsBySlugs(slugs: string[], client?: OptionalClient) {
    if (client) {
      return clientInvitationService.getInvitationsBySlugs(slugs, client);
    } else {
      return clientInvitationService.getInvitationsBySlugs(slugs);
    }
  },

  /**
   * Get invitations by IDs
   * Runtime boundary handled by specific service implementation
   */
  async getInvitationsByIds(ids: string[], client?: OptionalClient) {
    if (client) {
      return clientInvitationService.getInvitationsByIds(ids, client);
    } else {
      return clientInvitationService.getInvitationsByIds(ids);
    }
  },

  /**
   * Delete invitation
   * Runtime boundary handled by specific service implementation
   */
  async deleteInvitation(id: string, client?: OptionalClient) {
    if (client) {
      return clientInvitationService.deleteInvitation(id, client);
    } else {
      return clientInvitationService.deleteInvitation(id);
    }
  },

  /**
   * Mark notification as read
   * Runtime boundary handled by specific service implementation
   */
  async markNotificationAsRead(id: string, client?: OptionalClient) {
    if (client) {
      return clientInvitationService.markNotificationAsRead(id, client);
    } else {
      return clientInvitationService.markNotificationAsRead(id);
    }
  },
};
