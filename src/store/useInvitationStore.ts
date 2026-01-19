import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface InvitationState {
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

    mapType: 'kakao' | 'naver';

    // New Location Fields
    locationTitle: string; // e.g. "오시는 길"
    locationContact: string;
    showMap: boolean;
    lockMap: boolean;
    showNavigation: boolean;
    mapHeight: 'default' | 'small';
    mapZoom: number;
    locationSubtitle: string;
    showSketch: boolean;
    sketchUrl: string | null;
    sketchRatio: 'fixed' | 'auto';

    coordinates: { lat: number; lng: number } | null; // For Map
    message: string;
    greetingTitle: string;
    greetingSubtitle: string;
    imageUrl: string | null;
    imageRatio: 'fixed' | 'auto';
    greetingImage: string | null;
    greetingRatio: 'fixed' | 'auto';
    showNamesAtBottom: boolean;
    enableFreeformNames: boolean;
    groomNameCustom: string; // Freeform text for groom side
    brideNameCustom: string; // Freeform text for bride side

    // Main Screen State
    mainScreen: {
        layout: 'classic' | 'minimal' | 'english' | 'heart' | 'korean' | 'arch' | 'oval' | 'frame' | 'fill' | 'basic';
        showBorder: boolean;
        expandPhoto: boolean;
        effect: 'none' | 'mist' | 'ripple';
        imageShape: 'rect' | 'arch' | 'oval';
        title: string;
        subtitle: string;
        customDatePlace: string;
        groomName: string;
        brideName: string;
        andText: string;
        suffixText: string;
        // Visibility Flags
        showTitle: boolean;
        showGroomBride: boolean;
        showSubtitle: boolean;
        showDatePlace: boolean;
    };

    // Date & Time Display Options
    showCalendar: boolean;
    showDday: boolean;
    ddayMessage: string;

    // Theme State
    theme: {
        font: 'pretendard' | 'gmarket' | 'gowun-batang' | 'gowun-dodum' | 'nanum-myeongjo' | 'yeon-sung' | 'do-hyeon' | 'song-myung' | 'serif' | 'sans';
        backgroundColor: string;
        accentColor: string;
        fontScale: number;
        pattern: 'none' | 'flower-sm' | 'flower-lg';
        effect: 'none' | 'cherry-blossom' | 'snow';
        effectOnlyOnMain: boolean;
        preventZoom: boolean;
        animateEntrance: boolean;
        showSubtitleEng: boolean;
        privacy: 'public' | 'lock-after' | 'lock-now';
    };

    // Gallery State
    galleryTitle: string;
    gallerySubtitle: string;
    galleryType: 'swiper' | 'thumbnail' | 'grid';
    galleryPopup: boolean;
    galleryPreview: boolean; // 다음 슬라이드 미리보기
    galleryFade: boolean; // 페이드 효과 사용
    galleryAutoplay: boolean; // 자동 재생 사용
    gallery: { id: string; url: string }[];

    // Account State
    accountsTitle: string;
    accountsSubtitle: string;
    accountsDescription: string;
    accountsGroomTitle: string;
    accountsBrideTitle: string;
    accountsColorMode: 'accent' | 'subtle' | 'white';
    accounts: {
        id: string;
        type: 'groom' | 'bride';
        relation: '본인' | '아버지' | '어머니';
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

    // New Location Setters
    setLocationTitle: (title: string) => void;
    setLocationSubtitle: (subtitle: string) => void;
    setLocationContact: (contact: string) => void;
    setShowMap: (show: boolean) => void;
    setLockMap: (lock: boolean) => void;
    setShowNavigation: (show: boolean) => void;
    setMapHeight: (height: 'default' | 'small') => void;
    setMapZoom: (zoom: number) => void;
    setMapType: (type: 'kakao' | 'naver') => void;
    setShowSketch: (show: boolean) => void;
    setSketchUrl: (url: string | null) => void;
    setSketchRatio: (ratio: 'fixed' | 'auto') => void;

    setMessage: (message: string) => void;
    setGreetingTitle: (title: string) => void;
    setGreetingSubtitle: (subtitle: string) => void;
    setShowNamesAtBottom: (show: boolean) => void;
    setEnableFreeformNames: (enable: boolean) => void;
    setGroomNameCustom: (name: string) => void;
    setBrideNameCustom: (name: string) => void;

    setImageUrl: (url: string | null) => void;
    setImageRatio: (ratio: 'fixed' | 'auto') => void;
    setGreetingImage: (url: string | null) => void;
    setGreetingRatio: (ratio: 'fixed' | 'auto') => void;
    setTheme: (theme: Partial<InvitationState['theme']>) => void;
    setGallery: (images: { id: string; url: string }[] | ((prev: { id: string; url: string }[]) => { id: string; url: string }[])) => void;
    setGalleryTitle: (title: string) => void;
    setGallerySubtitle: (subtitle: string) => void;
    setGalleryType: (type: 'swiper' | 'thumbnail' | 'grid') => void;
    setGalleryPopup: (use: boolean) => void;
    setGalleryPreview: (preview: boolean) => void;
    setGalleryFade: (fade: boolean) => void;
    setGalleryAutoplay: (autoplay: boolean) => void;
    setAccountsTitle: (title: string) => void;
    setAccountsSubtitle: (subtitle: string) => void;
    setAccountsDescription: (description: string) => void;
    setAccountsGroomTitle: (title: string) => void;
    setAccountsBrideTitle: (title: string) => void;
    setAccountsColorMode: (mode: 'accent' | 'subtle' | 'white') => void;
    setAccounts: (accounts: InvitationState['accounts'] | ((prev: InvitationState['accounts']) => InvitationState['accounts'])) => void;
    setMainScreen: (data: Partial<InvitationState['mainScreen']>) => void;
    setShowCalendar: (show: boolean) => void;
    setShowDday: (show: boolean) => void;
    setDdayMessage: (message: string) => void;

    // UI State
    editingSection: string | null;
    setEditingSection: (section: string | null) => void;

    // Kakao Share State
    kakaoShare: {
        title: string;
        description: string;
        imageUrl: string | null;
        imageRatio: 'portrait' | 'landscape';
        buttonType: 'none' | 'location' | 'rsvp';
        showShareButton: boolean;
    };
    setKakao: (data: Partial<InvitationState['kakaoShare']>) => void;

    // Closing Section State (New)
    closing: {
        title: string;
        subtitle: string;
        imageUrl: string | null;
        ratio: 'fixed' | 'auto';
        content: string;
    };
    setClosing: (data: Partial<InvitationState['closing']>) => void;

    // URL / Slug State
    slug: string;
    setSlug: (slug: string) => void;

    // License Approval State
    isApproved: boolean;
    setIsApproved: (approved: boolean) => void;
    isRequestingApproval: boolean;
    setIsRequestingApproval: (requesting: boolean) => void;

    // Global Loading State (e.g. Image Uploading)
    isUploading: boolean;
    setIsUploading: (uploading: boolean) => void;

    // Actions
    reset: () => void;
}

export type InvitationData = {
    [K in keyof InvitationState as InvitationState[K] extends (...args: unknown[]) => unknown ? never : K]: InvitationState[K];
};

export type InvitationStateType = InvitationState;

const getDefaultDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 100);
    return d.toISOString().split('T')[0] || '';
};

export const INITIAL_STATE = {
    kakaoShare: {
        title: '',
        description: '',
        imageUrl: null,
        imageRatio: 'portrait' as const,
        buttonType: 'location' as const,
        showShareButton: true,
    },
    groom: {
        firstName: '',
        lastName: '',
        relation: '아들',
        parents: {
            father: { name: '', isDeceased: false },
            mother: { name: '', isDeceased: false },
        },
    },
    bride: {
        firstName: '',
        lastName: '',
        relation: '딸',
        parents: {
            father: { name: '', isDeceased: false },
            mother: { name: '', isDeceased: false },
        },
    },

    useFlowerIcon: true,
    order: 'groom-first' as const,
    date: getDefaultDate(),
    time: '13:00',
    location: '',
    address: '',
    detailAddress: '',
    mapType: 'naver' as const,

    locationTitle: '오시는 길',
    locationSubtitle: 'LOCATION',
    locationContact: '',
    showMap: true,
    lockMap: true,
    showNavigation: true,
    mapHeight: 'default' as const,
    mapZoom: 17, // Zoom Level (higher is closer)
    showSketch: false,
    sketchUrl: null,
    sketchRatio: 'fixed' as const,

    coordinates: { lat: 37.5665, lng: 126.9780 }, // Default: Seoul City Hall
    greetingTitle: '저희 두 사람 결혼합니다',
    greetingSubtitle: 'INVITATION',
    message: '<p style="text-align: center">곁에 있을 때 가장 나다운 모습이 되게 하는 사람<br>꿈을 꾸게 하고 그 꿈을 함께 나누는 사람<br>그런 사람을 만나 이제 하나가 되려 합니다.<br><br>저희의 뜻깊은 시작을 함께 나누어 주시고<br>따뜻한 마음으로 축복해 주시면 감사하겠습니다.</p>',
    showNamesAtBottom: true,
    enableFreeformNames: false,
    groomNameCustom: '',
    brideNameCustom: '',

    imageUrl: null,
    imageRatio: 'fixed' as const,
    greetingImage: null,
    greetingRatio: 'fixed' as const,

    mainScreen: {
        layout: 'classic' as const,
        showBorder: false,
        expandPhoto: false,
        effect: 'none' as const,
        imageShape: 'rect' as const,
        title: 'THE MARRIAGE',
        subtitle: '소중한 날에 초대합니다',
        customDatePlace: '',
        groomName: '',
        brideName: '',
        andText: '그리고',
        suffixText: '결혼합니다.',
        showTitle: true,
        showGroomBride: true,
        showSubtitle: true,
        showDatePlace: true,
    },

    showCalendar: true,
    showDday: true,
    ddayMessage: '(신랑), (신부)의 결혼식이 (D-Day) 남았습니다',

    theme: {
        font: 'gowun-dodum' as const,
        backgroundColor: '#FFFFFF', // White
        accentColor: '#C19A6D', // Soft Brown
        fontScale: 1,
        pattern: 'none' as const,
        effect: 'none' as const,
        effectOnlyOnMain: false,
        preventZoom: true,
        animateEntrance: true,
        showSubtitleEng: true,
        privacy: 'public' as const,
    },

    gallery: [],
    galleryTitle: '웨딩 갤러리',
    gallerySubtitle: 'GALLERY',
    galleryType: 'swiper' as const,
    galleryPopup: true,
    galleryPreview: false,
    galleryFade: false,
    galleryAutoplay: true,
    accountsTitle: '축하의 마음 전하실 곳',
    accountsSubtitle: 'GIFT',
    accountsDescription: '축하의 마음을 담아 축의금을 전달하고자 하시는 분들을 위해\n계좌번호를 안내해 드립니다.',
    accountsGroomTitle: '신랑 측 마음 전하실 곳',
    accountsBrideTitle: '신부 측 마음 전하실 곳',
    accountsColorMode: 'subtle' as const,
    accounts: [],
    slug: '',
    editingSection: null,
    closing: {
        title: '',
        subtitle: 'CLOSING',
        imageUrl: null,
        ratio: 'fixed' as const,
        content: '<p style="text-align: center">서로가 마주보며 다져온 사랑을<br>이제 함께 한 곳을 바라보며 걸어가려 합니다.<br>저희의 새 출발을 축복해 주세요.</p>',
    },
    isApproved: false,
    isRequestingApproval: false,
    isUploading: false,
};

export const useInvitationStore = create<InvitationState>()(persist((set) => ({
    ...INITIAL_STATE,

    setIsUploading: (uploading) => set({ isUploading: uploading }),

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

    setLocationTitle: (title) => set({ locationTitle: title }),
    setLocationSubtitle: (subtitle) => set({ locationSubtitle: subtitle }),
    setLocationContact: (contact) => set({ locationContact: contact }),
    setShowMap: (show) => set({ showMap: show }),
    setLockMap: (lock) => set({ lockMap: lock }),
    setShowNavigation: (show) => set({ showNavigation: show }),
    setMapHeight: (height) => set({ mapHeight: height }),
    setMapZoom: (zoom) => set({ mapZoom: zoom }),
    setMapType: (type) => set({ mapType: type }),
    setShowSketch: (show) => set({ showSketch: show }),
    setSketchUrl: (url) => set({ sketchUrl: url }),
    setSketchRatio: (sketchRatio) => set({ sketchRatio }),

    setCoordinates: (lat, lng) => set({ coordinates: { lat, lng } }),
    setMessage: (message) => set({ message }),
    setGreetingTitle: (title) => set({ greetingTitle: title }),
    setGreetingSubtitle: (subtitle) => set({ greetingSubtitle: subtitle }),
    setShowNamesAtBottom: (show) => set({ showNamesAtBottom: show }),
    setEnableFreeformNames: (enable) => set({ enableFreeformNames: enable }),
    setGroomNameCustom: (name) => set({ groomNameCustom: name }),
    setBrideNameCustom: (name) => set({ brideNameCustom: name }),

    setImageUrl: (url) => set({ imageUrl: url }),
    setImageRatio: (imageRatio) => set({ imageRatio }),
    setGreetingImage: (url) => set({ greetingImage: url }),
    setGreetingRatio: (greetingRatio) => set({ greetingRatio }),
    setTheme: (newTheme) => set((state) => ({ theme: { ...state.theme, ...newTheme } })),
    setGallery: (images) => set((state) => ({ gallery: typeof images === 'function' ? images(state.gallery) : images })),
    setGalleryTitle: (title) => set({ galleryTitle: title }),
    setGallerySubtitle: (subtitle) => set({ gallerySubtitle: subtitle }),
    setGalleryType: (type) => set({ galleryType: type }),
    setGalleryPopup: (popup) => set({ galleryPopup: popup }),
    setGalleryPreview: (preview) => set({ galleryPreview: preview }),
    setGalleryFade: (fade) => set({ galleryFade: fade }),
    setGalleryAutoplay: (autoplay) => set({ galleryAutoplay: autoplay }),
    setAccountsTitle: (title) => set({ accountsTitle: title }),
    setAccountsSubtitle: (subtitle) => set({ accountsSubtitle: subtitle }),
    setAccountsDescription: (description) => set({ accountsDescription: description }),
    setAccountsGroomTitle: (title) => set({ accountsGroomTitle: title }),
    setAccountsBrideTitle: (title) => set({ accountsBrideTitle: title }),
    setAccountsColorMode: (mode) => set({ accountsColorMode: mode }),
    setAccounts: (accounts) => set((state) => ({ accounts: typeof accounts === 'function' ? accounts(state.accounts) : accounts })),
    setMainScreen: (data) => set((state) => ({ mainScreen: { ...state.mainScreen, ...data } })),
    setShowCalendar: (show) => set({ showCalendar: show }),
    setShowDday: (show) => set({ showDday: show }),
    setDdayMessage: (ddayMessage) => set({ ddayMessage }),

    // UI State
    setEditingSection: (section) => set({ editingSection: section }),

    setKakao: (data) => set((state) => ({
        kakaoShare: {
            ...(state.kakaoShare || {
                title: '',
                description: '',
                imageUrl: null,
                imageRatio: 'portrait',
                buttonType: 'location',
                showShareButton: true,
            }), ...data
        }
    })),

    setClosing: (data) => set((state) => ({ closing: { ...state.closing, ...data } })),
    setSlug: (slug) => set({ slug }),
    setIsApproved: (approved) => set({ isApproved: approved }),
    setIsRequestingApproval: (requesting) => set({ isRequestingApproval: requesting }),
    reset: () => set(INITIAL_STATE),
}), {
    name: 'wedding-invitation-storage',
    storage: createJSONStorage(() => ({
        getItem: async (name: string): Promise<string | null> => {
            const { get } = await import('idb-keyval');
            return (await get(name)) || null;
        },
        setItem: async (name: string, value: string): Promise<void> => {
            const { set } = await import('idb-keyval');
            await set(name, value);
        },
        removeItem: async (name: string): Promise<void> => {
            const { del } = await import('idb-keyval');
            await del(name);
        },
    })),
    // Merge function to handle new fields added to the store
    merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<InvitationState>;
        return {
            ...currentState,
            ...persisted,
            // Deep merge nested objects
            mainScreen: {
                ...currentState.mainScreen,
                ...(persisted.mainScreen || {}),
            },
            theme: {
                ...currentState.theme,
                ...(persisted.theme || {}),
            },
            closing: {
                ...currentState.closing,
                ...(persisted.closing || {}),
            },
            kakaoShare: {
                ...currentState.kakaoShare,
                ...(persisted.kakaoShare || {}),
            },
            groom: {
                ...currentState.groom,
                ...(persisted.groom || {}),
                parents: {
                    ...currentState.groom.parents,
                    ...(persisted.groom?.parents || {}),
                },
            },
            bride: {
                ...currentState.bride,
                ...(persisted.bride || {}),
                parents: {
                    ...currentState.bride.parents,
                    ...(persisted.bride?.parents || {}),
                },
            },
        };
    },
    // Removed partialize to allow gallery and images to be saved in IndexedDB
    // IndexedDB has much higher limits than localStorage
}));
