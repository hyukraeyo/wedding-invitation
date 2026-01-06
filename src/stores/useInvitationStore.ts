import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface InvitationData {
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime: string;
  venue: string;
  address: string;
  message: string;
  imageUrl?: string;
  bankAccount?: string;
  bankName?: string;
  accountHolder?: string;
}

interface InvitationStore {
  invitationData: InvitationData;
  updateInvitationData: (data: Partial<InvitationData>) => void;
  resetInvitationData: () => void;
}

const defaultInvitationData: InvitationData = {
  groomName: '김철수',
  brideName: '이영희',
  weddingDate: '2024년 12월 25일',
  weddingTime: '오후 4시',
  venue: '더 파크뷰 서울',
  address: '서울특별시 강남구 테헤란로 123',
  message: '새로운 시작을 함께 축하해 주세요.\n평생 잊지 못할 아름다운 날이 되길 바랍니다.',
  imageUrl: '',
  bankAccount: '123-456-789012',
  bankName: '국민은행',
  accountHolder: '김철수',
};

export const useInvitationStore = create<InvitationStore>()(
  persist(
    (set) => ({
      invitationData: defaultInvitationData,

      updateInvitationData: (data) =>
        set((state) => ({
          invitationData: { ...state.invitationData, ...data },
        })),

      resetInvitationData: () =>
        set({ invitationData: defaultInvitationData }),
    }),
    {
      name: 'wedding-invitation-store',
    }
  )
);