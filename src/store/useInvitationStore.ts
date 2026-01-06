import { create } from 'zustand';

interface InvitationState {
    // Basic Info
    groom: {
        firstName: string;
        lastName: string;
        relation: string;
        parents: {
            father: { name: string; isDeceased: boolean };
            mother: { name: string; isDeceased: boolean };
        };
    };
    bride: {
        firstName: string;
        lastName: string;
        relation: string;
        parents: {
            father: { name: string; isDeceased: boolean };
            mother: { name: string; isDeceased: boolean };
        };
    };
    useFlowerIcon: boolean;
    order: 'groom-first' | 'bride-first';

    // Event Info
    date: string;
    time: string;
    location: string; // Wedding Hall Name e.g. "The Convention"
    address: string; // Basic Address e.g. "Seoul ..."
    detailAddress: string; // e.g. "2nd Floor"
    coordinates: { lat: number; lng: number } | null; // For Map
    message: string;
    greetingTitle: string;
    imageUrl: string | null;
    showNamesAtBottom: boolean;
    sortNames: boolean;
    enableFreeformNames: boolean;

    // Main Screen State
    mainScreen: {
        layout: 'basic' | 'fill' | 'arch' | 'oval' | 'frame';
        showBorder: boolean;
        expandPhoto: boolean;
        effect: 'none' | 'mist' | 'ripple' | 'paper';
        title: string;
        subtitle: string;
        customDatePlace: string;
    };

    // Date & Time Display Options
    showCalendar: boolean;
    showDday: boolean;
    ddayMessage: string;

    // Theme State
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

    setGroom: (data: Partial<InvitationState['groom']>) => void;
    setBride: (data: Partial<InvitationState['bride']>) => void;
    setGroomParents: (type: 'father' | 'mother', data: { name?: string; isDeceased?: boolean }) => void;
    setBrideParents: (type: 'father' | 'mother', data: { name?: string; isDeceased?: boolean }) => void;
    setUseFlowerIcon: (use: boolean) => void;
    setOrder: (order: 'groom-first' | 'bride-first') => void;
    setDate: (date: string) => void;
    setTime: (time: string) => void;
    setLocation: (location: string) => void;
    setAddress: (address: string) => void;
    setDetailAddress: (detail: string) => void;
    setCoordinates: (lat: number, lng: number) => void;

    setMessage: (message: string) => void;
    setGreetingTitle: (title: string) => void;
    setShowNamesAtBottom: (show: boolean) => void;
    setSortNames: (sort: boolean) => void;
    setEnableFreeformNames: (enable: boolean) => void;
    setImageUrl: (url: string | null) => void;
    setTheme: (theme: Partial<InvitationState['theme']>) => void;
    setGallery: (images: string[]) => void;
    setAccounts: (accounts: InvitationState['accounts']) => void;
    setMainScreen: (data: Partial<InvitationState['mainScreen']>) => void;
    setShowCalendar: (show: boolean) => void;
    setShowDday: (show: boolean) => void;
    setDdayMessage: (message: string) => void;
}

export const useInvitationStore = create<InvitationState>((set) => ({
    groom: {
        firstName: '도현',
        lastName: '이',
        relation: '아들',
        parents: {
            father: { name: '이철수', isDeceased: false },
            mother: { name: '박영희', isDeceased: false },
        },
    },
    bride: {
        firstName: '지수',
        lastName: '김',
        relation: '딸',
        parents: {
            father: { name: '김민수', isDeceased: false },
            mother: { name: '최지우', isDeceased: false },
        },
    },
    useFlowerIcon: true,
    order: 'groom-first',
    date: '2024-10-25',
    time: '14:00',
    location: '더 컨벤션 웨딩홀',
    address: '서울 송파구 올림픽로 319',
    detailAddress: '교통회관 1층 그랜드볼룸',
    coordinates: { lat: 37.515, lng: 127.102 }, // Default: Jamsil
    message: '서로의 빛이 되어\n평생을 함께 걸어가겠습니다.\n저희 두 사람의 시작을\n축복해 주시면 감사하겠습니다.',
    greetingTitle: '소중한 분들을 초대합니다',
    showNamesAtBottom: true,
    sortNames: true,
    enableFreeformNames: false,

    imageUrl: null,

    mainScreen: {
        layout: 'basic',
        showBorder: false,
        expandPhoto: true,
        effect: 'paper',
        title: 'THE NEW BEGINNING',
        subtitle: 'We are getting married',
        customDatePlace: '0000.00.00. Sunday 00:00 PM\nOOO예식장 1F, OOO홀',
    },

    showCalendar: true,
    showDday: true,
    ddayMessage: '(신랑), (신부)의 결혼식이 (D-Day)일 남았습니다.',

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

    setGroom: (data) => set((state) => ({ groom: { ...state.groom, ...data } })),
    setBride: (data) => set((state) => ({ bride: { ...state.bride, ...data } })),
    setGroomParents: (type, data) => set((state) => ({
        groom: {
            ...state.groom,
            parents: {
                ...state.groom.parents,
                [type]: { ...state.groom.parents[type], ...data }
            }
        }
    })),
    setBrideParents: (type, data) => set((state) => ({
        bride: {
            ...state.bride,
            parents: {
                ...state.bride.parents,
                [type]: { ...state.bride.parents[type], ...data }
            }
        }
    })),
    setUseFlowerIcon: (use) => set({ useFlowerIcon: use }),
    setOrder: (order) => set({ order }),
    setDate: (date) => set({ date }),
    setTime: (time) => set({ time }),
    setLocation: (location) => set({ location }),
    setAddress: (address) => set({ address }),
    setDetailAddress: (detailAddress) => set({ detailAddress }),
    setCoordinates: (lat, lng) => set({ coordinates: { lat, lng } }),
    setMessage: (message) => set({ message }),
    setGreetingTitle: (title) => set({ greetingTitle: title }),
    setShowNamesAtBottom: (show) => set({ showNamesAtBottom: show }),
    setSortNames: (sort) => set({ sortNames: sort }),
    setEnableFreeformNames: (enable) => set({ enableFreeformNames: enable }),

    setImageUrl: (url) => set({ imageUrl: url }),
    setTheme: (newTheme) => set((state) => ({ theme: { ...state.theme, ...newTheme } })),
    setGallery: (images) => set({ gallery: images }),
    setAccounts: (accounts) => set({ accounts }),
    setMainScreen: (data) => set((state) => ({ mainScreen: { ...state.mainScreen, ...data } })),
    setShowCalendar: (show) => set({ showCalendar: show }),
    setShowDday: (show) => set({ showDday: show }),
    setDdayMessage: (ddayMessage) => set({ ddayMessage }),
}));
