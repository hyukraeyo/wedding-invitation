import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Home, Sparkles } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/free-mode';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { TextField } from '../TextField';
import { SwitchField } from '../SwitchField';
import { SegmentedControl } from '../SegmentedControl';
import { HeaderAction } from '../HeaderAction';
import { ExampleSelectorModal } from '../ExampleSelectorModal';
import { Field } from '../FormPrimitives';
import { ImageUploader } from '../ImageUploader';
import styles from './MainScreenSection.module.scss';
import { cn } from '@/lib/utils';

const RichTextEditor = dynamic(() => import('@/components/common/RichTextEditor'), { ssr: false });

interface StylePreset {
    id: string;
    layout: 'classic' | 'minimal' | 'english' | 'heart' | 'korean' | 'arch' | 'oval' | 'frame' | 'fill' | 'basic';
    label: string;
}

// Combined style presets (layout + textStyle)
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

interface SectionProps {
    value: string;
    isOpen: boolean;
}

export default function MainScreenSection({ isOpen, value }: SectionProps) {
    const mainScreen = useInvitationStore(state => state.mainScreen);
    const setMainScreen = useInvitationStore(state => state.setMainScreen);
    const imageUrl = useInvitationStore(state => state.imageUrl);
    const setImageUrl = useInvitationStore(state => state.setImageUrl);
    const imageRatio = useInvitationStore(state => state.imageRatio);
    const setImageRatio = useInvitationStore(state => state.setImageRatio);
    const groom = useInvitationStore(state => state.groom);
    const bride = useInvitationStore(state => state.bride);
    const theme = useInvitationStore(state => state.theme);
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

    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
    const swiperRef = useRef<SwiperType | null>(null);

    const updateMain = (data: Partial<typeof mainScreen>) => setMainScreen(data);

    // Find selected preset index for initial slide
    const selectedPresetIndex = STYLE_PRESETS.findIndex(p => p.layout === mainScreen.layout);

    // Handle preset selection with smart scroll (Netflix-style: edge-aligned at boundaries)
    const handleSelectPreset = (preset: StylePreset, index: number) => {
        updateMain({
            layout: preset.layout,
        });
        // Smart scroll: ensure selected slide is visible
        if (swiperRef.current) {
            const swiper = swiperRef.current;
            const slidesPerView = Math.floor(swiper.width / (90 + 12)); // card width + gap
            const maxIndex = STYLE_PRESETS.length - slidesPerView;

            // Calculate target position: keep edges aligned, scroll middle items
            let targetIndex = index;
            if (index <= 0) {
                targetIndex = 0; // First slide: stay at start
            } else if (index >= STYLE_PRESETS.length - 1) {
                targetIndex = maxIndex > 0 ? maxIndex : 0; // Last slide: align to end
            } else {
                // Middle slides: center them if possible
                targetIndex = Math.max(0, Math.min(index - 1, maxIndex));
            }
            swiper.slideTo(targetIndex);
        }
    };

    const SAMPLE_TITLES = [
        { title: 'THE MARRIAGE', subtitle: '영문 타이틀' },
        { title: 'WEDDING INVITATION', subtitle: '영문 초대장' },
        { title: 'OUR WEDDING DAY', subtitle: '우리의 결혼식' },
        { title: 'WE ARE GETTING MARRIED', subtitle: '우리 결혼합니다 (영문)' },
        { title: 'SAVE THE DATE', subtitle: '날짜를 비워두세요' },
        { title: '결혼합니다', subtitle: '국문 심플' },
        { title: '우리 결혼해요', subtitle: '국문 데이트' },
        { title: '소중한 분들을 초대합니다', subtitle: '국문 정중' },
    ];

    const handleSelectSample = (sample: typeof SAMPLE_TITLES[0]) => {
        updateMain({ title: sample.title });
        setIsSampleModalOpen(false);
    };

    return (
        <>
            <AccordionItem
                value={value}
                title="메인 화면"
                icon={Home}
                isOpen={isOpen}
                isCompleted={!!imageUrl}
                action={
                    <HeaderAction
                        icon={Sparkles}
                        label="추천 문구"
                        onClick={() => setIsSampleModalOpen(true)}
                    />
                }
            >
                <div className={styles.container}>
                    {/* Main Photo */}
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

                    {/* Style Preset Selection (Combined Layout + Text Style) */}
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
                                        className={`${styles.stylePresetCard} ${mainScreen.layout === preset.layout ? styles.selected : ''}`}
                                        onClick={() => handleSelectPreset(preset, index)}
                                    >
                                        <div className={cn(styles.presetThumbnail, preset.layout === 'classic' && styles.classicLayout)}>
                                            {preset.layout !== 'classic' && <div className={styles.thumbnailImage} />}
                                            <div className={styles.thumbnailContent}>
                                                {preset.layout === 'classic' && (
                                                    <>
                                                        <span className={styles.thumbTitle}>THE MARRIAGE</span>
                                                        <span className={styles.thumbMarriage}>신랑, 신부 결혼합니다.</span>
                                                    </>
                                                )}
                                                {preset.layout === 'minimal' && (
                                                    <>
                                                        <span className={styles.thumbDateMinimal}>2024 / 05 / 25</span>
                                                        <span className={styles.thumbWeekday}>SATURDAY</span>
                                                        <span className={styles.thumbNames}>신랑 · 신부</span>
                                                    </>
                                                )}
                                                {preset.layout === 'english' && (
                                                    <>
                                                        <span className={styles.thumbTitle}>THE NEW BEGINNING</span>
                                                        <span className={styles.thumbNames}>신랑 그리고 신부</span>
                                                        <span className={styles.thumbSubtext}>We are getting married</span>
                                                    </>
                                                )}
                                                {preset.layout === 'heart' && (
                                                    <>
                                                        <span className={styles.thumbHeart}>신랑 ♥ 신부</span>
                                                    </>
                                                )}
                                                {preset.layout === 'korean' && (
                                                    <>
                                                        <span className={styles.thumbKoreanTop}>저희 둘,</span>
                                                        <span className={styles.thumbKoreanBottom}>결혼합니다.</span>
                                                        <span className={styles.thumbNames}>신랑 · 신부</span>
                                                    </>
                                                )}
                                            </div>
                                            {preset.layout === 'classic' && <div className={styles.thumbnailImage} />}
                                            <div className={styles.thumbnailFooter}>
                                                {preset.layout === 'classic' && <span>초대합니다</span>}
                                                <span>2024. 05. 25</span>
                                                <span>예식장</span>
                                            </div>
                                        </div>
                                        <span className={styles.presetLabel}>{preset.label}</span>
                                    </button>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </Field>

                    {/* Falling Effects */}
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

                    {/* Photo Effects */}
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

                    {mainScreen.layout === 'classic' && (
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
                    )}

                    {mainScreen.layout === 'minimal' && (
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
                    )}

                    {mainScreen.layout === 'english' && (
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
                    )}

                    {mainScreen.layout === 'heart' && (
                        <>
                            <p className={styles.helpText}>♥ 아이콘이 자동으로 표시됩니다</p>
                        </>
                    )}

                    {mainScreen.layout === 'korean' && (
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
                    )}
                    {/* Date & Place Info - Common for all styles */}
                    {isOpen && (
                        <>
                            {!mainScreen.customDatePlace && (
                                <div className={cn(styles.helpText, "flex items-center justify-between gap-2")} style={{ marginBottom: '8px' }}>
                                    <p>
                                        <span style={{ fontWeight: 600 }}>자동 노출 중:</span> {getFormattedAutoText().replace(/<br\/>/g, ' ')}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => updateMain({ customDatePlace: `<p style="text-align: center">${getFormattedAutoText()}</p>` })}
                                        className="text-[11px] font-semibold text-banana hover:text-banana/80 underline shrink-0"
                                    >
                                        문구 적용
                                    </button>
                                </div>
                            )}
                            <RichTextEditor
                                content={mainScreen.customDatePlace}
                                onChange={(val: string) => updateMain({ customDatePlace: val })}
                                placeholder="직접 입력 시 자동 노출 문구 대신 표시됩니다"
                            />
                        </>
                    )}

                    {/* Visibility Toggles */}
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
                </div>

            </AccordionItem>

            {/* Sample Titles Modal */}
            <ExampleSelectorModal
                isOpen={isSampleModalOpen}
                onClose={() => setIsSampleModalOpen(false)}
                title="추천 제목 문구"
                items={SAMPLE_TITLES.map(s => ({
                    ...s,
                    content: s.subtitle,
                    badge: '추천'
                }))}
                onSelect={(item) => handleSelectSample(item)}
            />
        </>
    );
}
