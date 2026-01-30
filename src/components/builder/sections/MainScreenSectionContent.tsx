import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/free-mode';
import { useShallow } from 'zustand/react/shallow';
import { useInvitationStore } from '@/store/useInvitationStore';
import { TextField } from '@/components/ui/TextField';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Button } from '@/components/ui/Button';
import { ImageUploader } from '@/components/common/ImageUploader';
import { Switch } from '@/components/ui/Switch';
import { cn } from '@/lib/utils';
import styles from './MainScreenSection.module.scss';
import { STYLE_PRESETS } from '@/constants/samples';

export default function MainScreenSectionContent() {
    const swiperRef = useRef<SwiperType | null>(null);
    const [swiperProgress, setSwiperProgress] = React.useState<'start' | 'middle' | 'end'>('start');

    const {
        mainScreen,
        setMainScreen,
        theme,
        setTheme,
        groom,
        bride,
    } = useInvitationStore(useShallow((state) => ({
        mainScreen: state.mainScreen,
        setMainScreen: state.setMainScreen,
        theme: state.theme,
        setTheme: state.setTheme,
        groom: state.groom,
        bride: state.bride,
    })));

    const imageUrl = mainScreen.imageUrl;
    const setImageUrl = (url: string) => setMainScreen({ imageUrl: url });
    const imageRatio = mainScreen.imageRatio;
    const setImageRatio = (ratio: '4/5' | '1/1' | 'auto') => setMainScreen({ imageRatio: ratio });

    const updateMain = (data: Partial<typeof mainScreen>) => setMainScreen(data);

    const handleSelectPreset = (preset: typeof STYLE_PRESETS[0], index: number) => {
        setMainScreen({
            layout: preset.layout,
            imageShape: preset.imageShape,
        });
        if (swiperRef.current) {
            swiperRef.current.slideTo(index);
        }
    };

    const selectedPresetIndex = STYLE_PRESETS.findIndex(p => p.layout === mainScreen.layout);

    return (
        <div className={styles.container}>
            <div className={styles.optionItem}>
                <div className={styles.rowTitle}>메인 사진</div>
                <div className={styles.optionWrapper}>
                    <ImageUploader
                        value={imageUrl}
                        onChange={setImageUrl}
                        placeholder="메인 이미지 추가"
                        ratio={imageRatio}
                        onRatioChange={setImageRatio}
                        aspectRatio="4/5"
                    />
                </div>
            </div>

            <div className={styles.optionItem}>
                <div className={styles.rowTitle}>사진 꽉 차게</div>
                <div className={styles.rowRight}>
                    <Switch
                        checked={mainScreen.expandPhoto}
                        onCheckedChange={(checked) => updateMain({ expandPhoto: checked })}
                    />
                </div>
            </div>

            <div className={styles.optionItem}>
                <div className={styles.rowTitle}>스타일</div>
                <div className={styles.swiperWrapper}>
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
                                <Button
                                    type="button"
                                    variant="weak"
                                    className={cn(
                                        styles.stylePresetCard,
                                        mainScreen.layout === preset.layout ? styles.selected : '',
                                        preset.isComingSoon && styles.comingSoon
                                    )}
                                    onClick={() => !preset.isComingSoon && handleSelectPreset(preset, index)}
                                    disabled={preset.isComingSoon || false}
                                    style={{ height: 'auto', padding: 0 }}
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
                                    <span className={preset.isComingSoon ? styles.comingSoonLabel : styles.presetLabel}>{preset.label}</span>
                                </Button>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            <div className={styles.optionItem}>
                <div className={styles.rowTitle}>흩날림 효과</div>
                <SegmentedControl
                    alignment="fluid"
                    value={theme.effect}
                    onChange={(val: string) => setTheme({ effect: val as 'none' | 'cherry-blossom' | 'snow' })}
                >
                    <SegmentedControl.Item value="none">
                        없음
                    </SegmentedControl.Item>
                    <SegmentedControl.Item value="cherry-blossom">
                        벚꽃
                    </SegmentedControl.Item>
                    <SegmentedControl.Item value="snow">
                        눈내림
                    </SegmentedControl.Item>
                </SegmentedControl>
            </div>

            {mainScreen.layout === 'classic' && (
                <div className={styles.optionItem}>
                    <div className={styles.rowTitle}>사진 형태</div>
                    <SegmentedControl
                        alignment="fluid"
                        value={mainScreen.imageShape || 'rect'}
                        onChange={(val: string) => updateMain({ imageShape: val as 'rect' | 'arch' | 'oval' })}
                    >
                        <SegmentedControl.Item value="rect">
                            기본
                        </SegmentedControl.Item>
                        <SegmentedControl.Item value="arch">
                            아치
                        </SegmentedControl.Item>
                        <SegmentedControl.Item value="oval">
                            타원
                        </SegmentedControl.Item>
                    </SegmentedControl>
                </div>
            )}

            <div className={styles.optionItem}>
                <div className={styles.rowTitle}>사진 효과</div>
                <SegmentedControl
                    alignment="fluid"
                    value={mainScreen.effect}
                    onChange={(val: string) => updateMain({ effect: val as 'none' | 'mist' | 'ripple' })}
                >
                    <SegmentedControl.Item value="none">
                        없음
                    </SegmentedControl.Item>
                    <SegmentedControl.Item value="mist">
                        안개
                    </SegmentedControl.Item>
                    <SegmentedControl.Item value="ripple">
                        물결
                    </SegmentedControl.Item>
                </SegmentedControl>
            </div>

            {mainScreen.layout === 'classic' ? (
                <>
                    <div className={styles.optionItem}>
                        <div className={styles.optionWrapper}>
                            <TextField
                                label="제목"
                                variant="line"
                                placeholder="예: THE MARRIAGE"
                                value={mainScreen.title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateMain({ title: e.target.value })}
                            />
                            <TextField
                                label="소제목"
                                variant="line"
                                placeholder="예: 소중한 날에 초대합니다"
                                value={mainScreen.subtitle}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateMain({ subtitle: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className={styles.optionItem}>
                        <div className={styles.sentenceWrapper}>
                            <div className={styles.sentenceItem}>
                                <TextField
                                    variant="line"
                                    placeholder={groom.lastName || groom.firstName ? `${groom.lastName}${groom.firstName}` : '신랑'}
                                    value={mainScreen.groomName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateMain({ groomName: e.target.value })}
                                />
                            </div>
                            <div className={styles.sentenceItem}>
                                <TextField
                                    variant="line"
                                    placeholder="그리고"
                                    value={mainScreen.andText}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateMain({ andText: e.target.value })}
                                />
                            </div>
                            <div className={styles.sentenceItem}>
                                <TextField
                                    variant="line"
                                    placeholder={bride.lastName || bride.firstName ? `${bride.lastName}${bride.firstName}` : '신부'}
                                    value={mainScreen.brideName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateMain({ brideName: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
}
