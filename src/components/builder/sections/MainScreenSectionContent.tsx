import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/free-mode';
import { useShallow } from 'zustand/react/shallow';
import { useInvitationStore } from '@/store/useInvitationStore';
import { TextField } from '@/components/common/TextField';
import { SwitchField } from '@/components/common/SwitchField';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Field, SectionContainer } from '@/components/common/FormPrimitives';
import { ImageUploader } from '@/components/common/ImageUploader';
import styles from './MainScreenSection.module.scss';
import { cn } from '@/lib/utils';



interface StylePreset {
    id: string;
    layout: 'classic' | 'minimal' | 'english' | 'heart' | 'korean' | 'arch' | 'oval' | 'frame' | 'fill' | 'basic';
    label: string;
    isComingSoon?: boolean;
}

const STYLE_PRESETS: StylePreset[] = [
    {
        id: 'classic',
        layout: 'classic',
        label: '기본',
    },
    {
        id: 'coming-soon-1',
        layout: 'basic',
        label: '추가 예정',
        isComingSoon: true,
    },
    {
        id: 'coming-soon-2',
        layout: 'basic',
        label: '추가 예정',
        isComingSoon: true,
    },
    {
        id: 'coming-soon-3',
        layout: 'basic',
        label: '추가 예정',
        isComingSoon: true,
    },
];

export default function MainScreenSectionContent() {
    const mainScreen = useInvitationStore(useShallow(state => state.mainScreen));
    const setMainScreen = useInvitationStore(state => state.setMainScreen);
    const imageUrl = useInvitationStore(state => state.imageUrl);
    const setImageUrl = useInvitationStore(state => state.setImageUrl);
    const imageRatio = useInvitationStore(state => state.imageRatio);
    const setImageRatio = useInvitationStore(state => state.setImageRatio);
    const groom = useInvitationStore(useShallow(state => state.groom));
    const bride = useInvitationStore(useShallow(state => state.bride));
    const theme = useInvitationStore(useShallow(state => state.theme));
    const setTheme = useInvitationStore(state => state.setTheme);



    const swiperRef = useRef<SwiperType | null>(null);
    const [swiperProgress, setSwiperProgress] = React.useState<'start' | 'middle' | 'end'>('start');
    const updateMain = (data: Partial<typeof mainScreen>) => setMainScreen(data);
    const selectedPresetIndex = STYLE_PRESETS.findIndex(p => p.layout === mainScreen.layout);
    const resolveThemeEffect = (val: string) =>
        val === 'cherry-blossom' ? 'cherry-blossom' : val === 'snow' ? 'snow' : 'none';
    const resolveImageShape = (val: string) =>
        val === 'arch' ? 'arch' : val === 'oval' ? 'oval' : 'rect';
    const resolveMainEffect = (val: string) =>
        val === 'mist' ? 'mist' : val === 'ripple' ? 'ripple' : 'none';

    const handleSelectPreset = (preset: StylePreset, index: number) => {
        updateMain({
            layout: preset.layout,
        });
        if (swiperRef.current) {
            const swiper = swiperRef.current;
            const slidesPerView = Math.floor(swiper.width / (90 + 12));
            const maxIndex = STYLE_PRESETS.length - slidesPerView;

            let targetIndex = index;
            if (index <= 0) {
                targetIndex = 0;
            } else if (index >= STYLE_PRESETS.length - 1) {
                targetIndex = maxIndex > 0 ? maxIndex : 0;
            } else {
                targetIndex = Math.max(0, Math.min(index - 1, maxIndex));
            }
            swiper.slideTo(targetIndex);
        }
    };

    return (
        <SectionContainer>
            <Field label="메인 사진">
                <div className={styles.optionWrapper}>
                    <ImageUploader
                        value={imageUrl}
                        onChange={setImageUrl}
                        placeholder="메인 이미지 추가"
                        ratio={imageRatio}
                        onRatioChange={setImageRatio}
                        aspectRatio="4/5"

                    />
                    <SwitchField
                        checked={mainScreen.expandPhoto}
                        onChange={(show) => updateMain({ expandPhoto: show })}
                        label="사진 꽉 차게"
                    />
                </div>
            </Field>

            <Field label="스타일">
                <Swiper
                    modules={[FreeMode]}
                    freeMode={{
                        enabled: true,
                        momentum: true,
                        momentumRatio: 1,
                        momentumBounce: true,
                        momentumBounceRatio: 1,
                        momentumVelocityRatio: 1,
                    }}
                    slidesPerView="auto"
                    spaceBetween={12}
                    grabCursor={true}
                    initialSlide={selectedPresetIndex >= 0 ? selectedPresetIndex : 0}
                    centeredSlides={false}
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                        setSwiperProgress(swiper.isBeginning ? 'start' : swiper.isEnd ? 'end' : 'middle');
                    }}
                    onSlideChange={(swiper) => {
                        setSwiperProgress(swiper.isBeginning ? 'start' : swiper.isEnd ? 'end' : 'middle');
                    }}
                    className={cn(styles.stylePresetSwiper, styles[swiperProgress])}
                    onReachBeginning={() => setSwiperProgress('start')}
                    onReachEnd={() => setSwiperProgress('end')}
                    onFromEdge={() => setSwiperProgress('middle')}
                    onTransitionEnd={(swiper) => {
                        setSwiperProgress(swiper.isBeginning ? 'start' : swiper.isEnd ? 'end' : 'middle');
                    }}
                >
                    {STYLE_PRESETS.map((preset, index) => (
                        <SwiperSlide key={preset.id} className={styles.stylePresetSlide}>
                            <button
                                type="button"
                                className={cn(
                                    styles.stylePresetCard,
                                    mainScreen.layout === preset.layout ? styles.selected : '',
                                    preset.isComingSoon && styles.comingSoon
                                )}
                                onClick={() => !preset.isComingSoon && handleSelectPreset(preset, index)}
                                disabled={preset.isComingSoon}
                            >
                                <div className={cn(
                                    styles.presetThumbnail,
                                    !preset.isComingSoon && preset.layout === 'classic' && styles.classicLayout
                                )}>
                                    {preset.isComingSoon ? (
                                        <div className={styles.thumbnailPlaceholder}>
                                            <div className={styles.placeholderIcon} />
                                        </div>
                                    ) : (
                                        <>
                                            <div className={styles.thumbnailContent}>
                                                <span className={styles.thumbTitle}>THE MARRIAGE</span>
                                                <span className={styles.thumbMarriage}>신랑, 신부 결혼합니다.</span>
                                            </div>
                                            <div className={styles.thumbnailImage} />
                                            <div className={styles.thumbnailFooter}>
                                                <span>초대합니다</span>
                                                <span>2026년 4월 29일 수요일 오후 12시 </span>
                                                <span>더 컨벤션 신사 3층 그랜드홀</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <span className={styles.presetLabel}>{preset.label}</span>
                            </button>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Field>

            <Field label="흩날림 효과">
                <Tabs
                    value={theme.effect}
                    onValueChange={(val) => setTheme({ effect: resolveThemeEffect(val) })}
                >
                    <TabsList fluid>
                        <TabsTrigger value="none">없음</TabsTrigger>
                        <TabsTrigger value="cherry-blossom">벚꽃</TabsTrigger>
                        <TabsTrigger value="snow">눈내림</TabsTrigger>
                    </TabsList>
                </Tabs>
            </Field>

            {mainScreen.layout === 'classic' && (
                <Field label="사진 형태">
                    <Tabs
                        value={mainScreen.imageShape || 'rect'}
                        onValueChange={(val) => updateMain({ imageShape: resolveImageShape(val) })}
                    >
                        <TabsList fluid>
                            <TabsTrigger value="rect">기본</TabsTrigger>
                            <TabsTrigger value="arch">아치</TabsTrigger>
                            <TabsTrigger value="oval">타원</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </Field>
            )}

            <Field label="사진 효과">
                <Tabs
                    value={mainScreen.effect}
                    onValueChange={(val) => updateMain({ effect: resolveMainEffect(val) })}
                >
                    <TabsList fluid>
                        <TabsTrigger value="none">없음</TabsTrigger>
                        <TabsTrigger value="mist">안개</TabsTrigger>
                        <TabsTrigger value="ripple">물결</TabsTrigger>
                    </TabsList>
                </Tabs>
            </Field>

            {mainScreen.layout === 'classic' ? (
                <>
                    <div className={styles.optionWrapper}>
                        <TextField
                            label="제목"
                            type="text"
                            placeholder="예: THE MARRIAGE"
                            value={mainScreen.title}
                            onChange={(e) => updateMain({ title: e.target.value })}
                        />
                        <TextField
                            label="소제목"
                            type="text"
                            placeholder="예: 소중한 날에 초대합니다"
                            value={mainScreen.subtitle}
                            onChange={(e) => updateMain({ subtitle: e.target.value })}
                        />
                    </div>

                    <div className={styles.sentenceWrapper}>
                        <div className={styles.sentenceItem}>
                            <div className={styles.sentenceInput}>
                                <TextField
                                    type="text"
                                    placeholder={groom.lastName || groom.firstName ? `${groom.lastName}${groom.firstName}` : '신랑'}
                                    value={mainScreen.groomName}
                                    onChange={(e) => updateMain({ groomName: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className={styles.sentenceItem}>
                            <div className={styles.sentenceConnectorInput}>
                                <TextField
                                    type="text"
                                    placeholder="그리고"
                                    value={mainScreen.andText}
                                    onChange={(e) => updateMain({ andText: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className={styles.sentenceItem}>
                            <div className={styles.sentenceInput}>
                                <TextField
                                    type="text"
                                    placeholder={bride.lastName || bride.firstName ? `${bride.lastName}${bride.firstName}` : '신부'}
                                    value={mainScreen.brideName}
                                    onChange={(e) => updateMain({ brideName: e.target.value })}
                                />
                            </div>
                        </div>

                    </div>
                </>
            ) : null}







        </SectionContainer>
    );
}
