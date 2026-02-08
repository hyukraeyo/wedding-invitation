import type { InvitationData, InvitationStateType } from '@/store/useInvitationStore';

export const generateBuilderSlug = (name: string): string => {
  const cleanName = (name || 'banana').trim().normalize('NFC').replace(/\s+/g, '-');
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${cleanName}-${randomStr}`;
};

export const toInvitationData = (state: InvitationStateType): InvitationData => {
  const entries = Object.entries(state).filter(([, value]) => typeof value !== 'function');
  return Object.fromEntries(entries) as InvitationData;
};

export const ensureBuilderSlug = (state: InvitationStateType): string => {
  if (state.slug) {
    return state.slug;
  }

  const newSlug = generateBuilderSlug(state.groom.firstName);
  state.setSlug(newSlug);
  return newSlug;
};
