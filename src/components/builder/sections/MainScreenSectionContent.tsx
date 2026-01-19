import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/free-mode';
import { useShallow } from 'zustand/react/shallow';
import { useInvitationStore } from '@/store/useInvitationStore';
import { TextField } from '@/components/common/TextField';
import { SwitchField } from '@/components/common/SwitchField';
import { SegmentedControl } from '@/components/common/SegmentedControl';
import { Field, SectionContainer } from '@/components/common/FormPrimitives';
import { ImageUploader } from '@/components/common/ImageUploader';
import styles from './MainScreenSection.module.scss';
import { cn } from '@/lib/utils';

const RichTextEditor = dynamic(() => import('@/components/common/RichTextEditor'), { ssr: false });

interface StylePreset {
    id: string;
    layout: 'classic' | 'minimal' | 'english' | 'heart' | 'korean' | 'arch' | 'oval' | 'frame' | 'fill' | 'basic';
    label: string;
}

const STYLE_PRESETS: StylePreset[] = [
    {
        id: 'classic',
        layout: 'classic',
        label: '클래식',
    },
    {
        id: 'minimal',
        layout: 'minimal',
        label: '미니멀',
    },
    {
        id: 'english',
        layout: 'english',
        label: '영문',
    },
    {
        id: 'heart',
        layout: 'heart',
        label: '하트',
    },
    {
        id: 'korean',
        layout: 'korean',
        label: '한글',
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
    const date = useInvitationStore(state => state.date);
    const time = useInvitationStore(state => state.time);
    const location = useInvitationStore(state => state.location);
    const detailAddress = useInvitationStore(state => state.detailAddress);

    const getFormattedAutoText = () => {
        if (!date || !time) return '';
        try {
            const d = new Date(date);
            const week = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'][d.getDay()];
            const [h = '12', m = '00'] = time.split(':');
            const hour = parseInt(h, 10);
            const ampm = hour < 12 ? '오전' : '오후';
            const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);

            const dateStr = `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${week}`;
            const timeStr = `${ampm} ${displayHour}시 ${m === '00' ? '' : `${m}분`}`.trim();
            const locStr = [location, detailAddress].filter(Boolean).join(' ');

            return `${dateStr} ${timeStr}${locStr ? `<br/>${locStr}` : ''}`;
        } catch {
            return '';
        }
    };

    const swiperRef = useRef<SwiperType | null>(null);
    const updateMain = (data: Partial<typeof mainScreen>) => setMainScreen(data);
    const selectedPresetIndex = STYLE_PRESETS.findIndex(p => p.layout === mainScreen.layout);

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
                    onSwiper={(swiper) => { swiperRef.current = swiper; }}
                    className={styles.stylePresetSwiper}
                >
                    {STYLE_PRESETS.map((preset, index) => (
                        <SwiperSlide key={preset.id} className={styles.stylePresetSlide}>
                            <button
                                type="button"
                                className={cn(
                                    styles.stylePresetCard,
                                    mainScreen.layout === preset.layout ? styles.selected : ''
                                )}
                                onClick={() => handleSelectPreset(preset, index)}
                            >
                                <div className={cn(styles.presetThumbnail, preset.layout === 'classic' && styles.classicLayout)}>
                                    {preset.layout !== 'classic' ? <div className={styles.thumbnailImage} /> : null}
                                    <div className={styles.thumbnailContent}>
                                        {preset.layout === 'classic' ? (
                                            <>
                                                <span className={styles.thumbTitle}>THE MARRIAGE</span>
                                                <span className={styles.thumbMarriage}>신랑, 신부 결혼합니다.</span>
                                            </>
                                        ) : null}
                                        {preset.layout === 'minimal' ? (
                                            <>
                                                <span className={styles.thumbDateMinimal}>2024 / 05 / 25</span>
                                                <span className={styles.thumbWeekday}>SATURDAY</span>
                                                <span className={styles.thumbNames}>신랑 · 신부</span>
                                            </>
                                        ) : null}
                                        {preset.layout === 'english' ? (
                                            <>
                                                <span className={styles.thumbTitle}>THE NEW BEGINNING</span>
                                                <span className={styles.thumbNames}>신랑 그리고 신부</span>
                                                <span className={styles.thumbSubtext}>We are getting married</span>
                                            </>
                                        ) : null}
                                        {preset.layout === 'heart' ? (
                                            <>
                                                <span className={styles.thumbHeart}>신랑 ♥ 신부</span>
                                            </>
                                        ) : null}
                                        {preset.layout === 'korean' ? (
                                            <>
                                                <span className={styles.thumbKoreanTop}>저희 둘,</span>
                                                <span className={styles.thumbKoreanBottom}>결혼합니다.</span>
                                                <span className={styles.thumbNames}>신랑 · 신부</span>
                                            </>
                                        ) : null}
                                    </div>
                                    {preset.layout === 'classic' ? <div className={styles.thumbnailImage} /> : null}
                                    <div className={styles.thumbnailFooter}>
                                        {preset.layout === 'classic' ? <span>초대합니다</span> : null}
                                        <span>2026년 4월 29일 수요일 오후 12시 </span>
                                        <span>더 컨벤션 신사 3층 그랜드홀</span>
                                    </div>
                                </div>
                                <span className={styles.presetLabel}>{preset.label}</span>
                            </button>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Field>

            <Field label="흩날림 효과">
                <SegmentedControl
                    value={theme.effect}
                    onChange={(val) => setTheme({ effect: val as 'none' | 'cherry-blossom' | 'snow' })}
                    options={[
                        { label: '없음', value: 'none' },
                        { label: '벚꽃', value: 'cherry-blossom' },
                        { label: '눈내림', value: 'snow' },
                    ]}
                />
            </Field>

            <Field label="사진 효과">
                <SegmentedControl
                    value={mainScreen.effect}
                    onChange={(val) => updateMain({ effect: val as 'none' | 'mist' | 'ripple' | 'paper' })}
                    options={[
                        { label: '없음', value: 'none' },
                        { label: '안개', value: 'mist' },
                        { label: '물결', value: 'ripple' },
                        { label: '종이', value: 'paper' },
                    ]}
                />
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
                        <div className={styles.sentenceItem}>
                            <div className={styles.sentenceSuffixInput}>
                                <TextField
                                    type="text"
                                    placeholder="결혼합니다."
                                    value={mainScreen.suffixText}
                                    onChange={(e) => updateMain({ suffixText: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </>
            ) : null}

            {mainScreen.layout === 'minimal' ? (
                <>
                    <p className={styles.helpText}>예식일시에서 자동으로 표시됩니다</p>
                    <div className={styles.andTextWrapper}>
                        <div className={styles.andTextItem}>
                            <span className={styles.andTextLabel}>연결 문구</span>
                            <TextField
                                type="text"
                                placeholder="·"
                                value={mainScreen.andText}
                                onChange={(e) => updateMain({ andText: e.target.value })}
                            />
                        </div>
                    </div>
                </>
            ) : null}

            {mainScreen.layout === 'english' ? (
                <>
                    <div className={styles.optionWrapper}>
                        <TextField
                            label="제목"
                            type="text"
                            placeholder="예: THE NEW BEGINNING"
                            value={mainScreen.title}
                            onChange={(e) => updateMain({ title: e.target.value })}
                        />
                        <TextField
                            label="서브텍스트"
                            type="text"
                            placeholder="예: We are getting married"
                            value={mainScreen.subtitle}
                            onChange={(e) => updateMain({ subtitle: e.target.value })}
                        />
                    </div>
                    <div className={styles.andTextWrapper}>
                        <div className={styles.andTextItem}>
                            <span className={styles.andTextLabel}>연결 문구</span>
                            <TextField
                                type="text"
                                placeholder="그리고"
                                value={mainScreen.andText}
                                onChange={(e) => updateMain({ andText: e.target.value })}
                            />
                        </div>
                    </div>
                </>
            ) : null}

            {mainScreen.layout === 'heart' ? (
                <>
                    <p className={styles.helpText}>♥ 아이콘이 자동으로 표시됩니다</p>
                </>
            ) : null}

            {mainScreen.layout === 'korean' ? (
                <>
                    <div className={styles.optionWrapper}>
                        <TextField
                            label="상단 문구"
                            type="text"
                            placeholder="예: 저희 둘,"
                            value={mainScreen.title}
                            onChange={(e) => updateMain({ title: e.target.value })}
                        />
                        <TextField
                            label="하단 문구"
                            type="text"
                            placeholder="예: 결혼합니다."
                            value={mainScreen.subtitle}
                            onChange={(e) => updateMain({ subtitle: e.target.value })}
                        />
                    </div>
                </>
            ) : null}

            {!mainScreen.customDatePlace ? (
                <div className={styles.autoTextContainer}>
                    <p className={styles.helpText} style={{ flex: 1, padding: '0.5rem 0.75rem' }}>
                        <span style={{ fontWeight: 600 }}>자동 노출 중:</span> {getFormattedAutoText().replace(/<br\/>/g, ' ')}
                    </p>
                    <button
                        type="button"
                        onClick={() => updateMain({ customDatePlace: `<p style="text-align: center">${getFormattedAutoText()}</p>` })}
                        className={styles.applyTextBtn}
                    >
                        문구 적용
                    </button>
                </div>
            ) : null}
            <RichTextEditor
                content={mainScreen.customDatePlace}
                onChange={(val: string) => updateMain({ customDatePlace: val })}
                placeholder="직접 입력 시 자동 노출 문구 대신 표시됩니다"
            />

            <div className={styles.switchGroup}>
                <SwitchField
                    checked={mainScreen.showBorder}
                    onChange={(show) => updateMain({ showBorder: show })}
                    label="테두리 노출"
                />
                <SwitchField
                    checked={mainScreen.expandPhoto}
                    onChange={(show) => updateMain({ expandPhoto: show })}
                    label="사진 꽉 차게"
                />
            </div>
        </SectionContainer>
    );
}
