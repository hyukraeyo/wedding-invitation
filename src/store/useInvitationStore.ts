import { create } from 'zustand';

interface InvitationState {
    groomName: string;
    brideName: string;
    date: string;
    time: string;
    location: string;
    message: string;
    imageUrl: string | null;

    // Theme State
    theme: {
        font: string;
        backgroundColor: string;
        accentColor: string;
        pattern: 'none' | 'flower-sm' | 'flower-lg';
        effect: 'none' | 'cherry-blossom' | 'snow' | 'leaves' | 'forsythia' | 'babys-breath';
        effectOnlyOnMain: boolean;
        preventZoom: boolean;
        animateEntrance: boolean;
        showSubtitleEng: boolean;
        privacy: 'public' | 'lock-after' | 'lock-now';
    };

    // Gallery State
    gallery: string[];

    // Account State
    accounts: {
        type: 'groom' | 'bride';
        bank: string;
        accountNumber: string;
        holder: string;
    }[];

    setGroomName: (name: string) => void;
    setBrideName: (name: string) => void;
    setDate: (date: string) => void;
    setTime: (time: string) => void;
    setLocation: (location: string) => void;
    setMessage: (message: string) => void;
    setImageUrl: (url: string | null) => void;
    setTheme: (theme: Partial<InvitationState['theme']>) => void;
    setGallery: (images: string[]) => void;
    setAccounts: (accounts: InvitationState['accounts']) => void;
}

export const useInvitationStore = create<InvitationState>((set) => ({
    groomName: '이도현',
    brideName: '김지수',
    date: '2024-10-25',
    time: '14:00',
    location: '서울신라호텔 영빈관',
    message: '서로의 빛이 되어\n평생을 함께 걸어가겠습니다.\n저희 두 사람의 시작을\n축복해 주시면 감사하겠습니다.',
    imageUrl: null,

    theme: {
        font: 'serif',
        backgroundColor: '#F9F8E6', // Warm Ivory
        accentColor: '#4A5D45', // Deep Forest Green
        pattern: 'none',
        effect: 'none',
        effectOnlyOnMain: false,
        preventZoom: true,
        animateEntrance: true,
        showSubtitleEng: true,
        privacy: 'public',
    },

    gallery: [],
    accounts: [
        { type: 'groom', bank: '카카오뱅크', accountNumber: '3333-01-2345678', holder: '이도현' },
        { type: 'bride', bank: '신한은행', accountNumber: '110-123-456789', holder: '김지수' },
    ],

    setGroomName: (name) => set({ groomName: name }),
    setBrideName: (name) => set({ brideName: name }),
    setDate: (date) => set({ date }),
    setTime: (time) => set({ time }),
    setLocation: (location) => set({ location }),
    setMessage: (message) => set({ message }),
    setImageUrl: (url) => set({ imageUrl: url }),
    setTheme: (newTheme) => set((state) => ({ theme: { ...state.theme, ...newTheme } })),
    setGallery: (images) => set({ gallery: images }),
    setAccounts: (accounts) => set({ accounts }),
}));
