'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { LayoutTemplate, Check, Info, Sparkles } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { BuilderInput } from '../BuilderInput';
import { BuilderModal } from '@/components/common/BuilderModal';

import { BuilderButtonGroup } from '../BuilderButtonGroup';
import { BuilderToggle } from '../BuilderToggle';
import { BuilderField } from '../BuilderField';
import RichTextEditor from '@/components/common/RichTextEditor';
import { ImageUploader } from '../ImageUploader';
import { SubAccordion } from '../SubAccordion';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import styles from './MainScreenSection.module.scss';
import common from '../Builder.module.scss';
import { clsx } from 'clsx';


interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

const AmpersandSVG = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg
        viewBox="0 0 36 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ width: '1.5em', height: '1em', display: 'inline-block', verticalAlign: 'middle', ...style }}
    >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="24" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    </svg>
);

const HeartSVG = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ width: '1em', height: '1em', display: 'inline-block', verticalAlign: 'middle', ...style }}
    >
        <path d="M12 8C14.21 5.5 17.5 5.5 19.5 7.5C21.5 9.5 21.5 12.8 19.5 14.8L12 21L4.5 14.8C2.5 12.8 2.5 9.5 4.5 7.5C6.5 5.5 9.79 5.5 12 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);



export default function MainScreenSection({ isOpen, onToggle }: SectionProps) {
    const {
        mainScreen, setMainScreen,
        imageUrl, setImageUrl,
        groom, bride, setGroom, setBride,
        theme: { accentColor }
    } = useInvitationStore();

    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);
    const [isTextSectionOpen, setIsTextSectionOpen] = useState(false);
    const [isExampleModalOpen, setIsExampleModalOpen] = useState(false);

    return (
        <AccordionItem
            title="메인 화면"
            icon={LayoutTemplate}
            isOpen={isOpen}
            onToggle={onToggle}
            isCompleted={!!mainScreen.title}
        >
            <div className={styles.container}>
                {/* Layout Templates */}
                <BuilderField label="레이아웃">
                    <div className={clsx(styles.swiperWrapper, isAtStart && styles.atStart, isAtEnd && styles.atEnd)}>
                        <Swiper
                            slidesPerView="auto"
                            spaceBetween={12}
                            slidesOffsetBefore={20}
                            slidesOffsetAfter={40}
                            className={styles.layoutSwiper}
                            onInit={(swiper) => {
                                setIsAtStart(swiper.isBeginning);
                                setIsAtEnd(swiper.isEnd);
                            }}
                            onSlideChange={(swiper) => {
                                setIsAtStart(swiper.isBeginning);
                                setIsAtEnd(swiper.isEnd);
                            }}
                            onReachBeginning={() => setIsAtStart(true)}
                            onReachEnd={() => setIsAtEnd(true)}
                            onFromEdge={() => {
                                setIsAtStart(false);
                                setIsAtEnd(false);
                            }}
                        >
                            {['basic', 'fill', 'arch', 'oval', 'frame'].map((l) => (
                                <SwiperSlide key={l} style={{ width: 'auto' }}>
                                    <button
                                        onClick={() => setMainScreen({ layout: l as 'basic' | 'fill' | 'arch' | 'oval' | 'frame' })}
                                        className={styles.layoutButton}
                                    >
                                        <div
                                            className={clsx(styles.preview, mainScreen.layout === l && styles.active)}
                                            style={mainScreen.layout === l ? { borderColor: accentColor } : {}}
                                        >
                                            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: l === 'fill' ? 0 : (l === 'frame' ? '1.5rem' : '0.75rem'), transform: l === 'fill' ? 'none' : 'scale(0.55)', transformOrigin: 'top', justifyContent: l === 'fill' ? 'flex-end' : 'flex-start' }}>
                                                {l === 'basic' && (
                                                    <>
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                                                            <div style={{ width: 40, height: 2.5, backgroundColor: '#FF8A8A', opacity: 0.5 }} />
                                                            <div style={{ width: 64, height: 7, backgroundColor: '#d1d5db', borderRadius: 1 }} />
                                                            <div style={{ width: 56, height: 2.5, backgroundColor: '#e5e7eb' }} />
                                                        </div>
                                                        <div style={{ width: 80, aspectRatio: '4/5', backgroundColor: '#f3f4f6', borderRadius: 8, marginBottom: 16 }} />
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                                            <div style={{ width: 48, height: 2, backgroundColor: '#e5e7eb' }} />
                                                            <div style={{ width: 64, height: 2.5, backgroundColor: '#f3f4f6' }} />
                                                        </div>
                                                    </>
                                                )}
                                                {l === 'fill' && (
                                                    <div style={{ width: '100%', height: '100%', backgroundColor: '#f3f4f6', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 24 }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 16, zIndex: 10 }}>
                                                            <div style={{ width: 40, height: 2, backgroundColor: 'rgba(255,255,255,0.4)' }} />
                                                            <div style={{ width: 56, height: 5, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 1 }} />
                                                            <div style={{ width: 64, height: 2, backgroundColor: 'rgba(255,255,255,0.5)' }} />
                                                        </div>
                                                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to top, rgba(0,0,0,0.2), transparent)' }} />
                                                    </div>
                                                )}
                                                {(l === 'arch' || l === 'oval') && (
                                                    <>
                                                        <div style={{
                                                            width: l === 'oval' ? 88 : 80,
                                                            aspectRatio: l === 'oval' ? '2/3' : '4/5',
                                                            backgroundColor: '#f3f4f6',
                                                            borderRadius: l === 'oval' ? '999px' : '40px 40px 0 0',
                                                            marginBottom: 24,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}>
                                                            <div style={{ width: 24, height: 1.5, backgroundColor: 'rgba(255,255,255,0.6)' }} />
                                                        </div>
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                                            <div style={{ width: 48, height: 5, backgroundColor: '#d1d5db', borderRadius: 1 }} />
                                                            <div style={{ width: 64, height: 2, backgroundColor: '#e5e7eb' }} />
                                                            <div style={{ width: 56, height: 2, backgroundColor: '#f3f4f6' }} />
                                                        </div>
                                                    </>
                                                )}
                                                {l === 'frame' && (
                                                    <>
                                                        <div style={{ width: 80, aspectRatio: '1/1', border: '2px solid #f3f4f6', backgroundColor: '#f9fafb', marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8 }}>
                                                            <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(243,244,246,0.5)', border: '1px solid rgba(229,231,235,0.3)' }} />
                                                        </div>
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                                            <div style={{ width: 48, height: 5, backgroundColor: '#d1d5db', borderRadius: 1 }} />
                                                            <div style={{ width: 64, height: 2, backgroundColor: '#e5e7eb' }} />
                                                            <div style={{ width: 56, height: 2, backgroundColor: '#f3f4f6' }} />
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {mainScreen.layout === l && (
                                                <div className={styles.checkBadge} style={{ backgroundColor: accentColor }}>
                                                    <Check size={10} strokeWidth={3} />
                                                </div>
                                            )}
                                        </div>
                                        <span
                                            className={clsx(styles.label, mainScreen.layout === l && styles.active)}
                                            style={mainScreen.layout === l ? { color: accentColor } : {}}
                                        >
                                            {l === 'basic' ? '기본' : l === 'fill' ? '채우기' : l === 'arch' ? '아치' : l === 'oval' ? '타원' : '액자'}
                                        </span>
                                    </button>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </BuilderField>

                {/* Photo Upload */}
                <BuilderField label="사진">
                    <ImageUploader
                        value={imageUrl}
                        onChange={setImageUrl}
                        placeholder="메인 사진 추가"
                    />
                </BuilderField>

                {/* Design Options */}
                <BuilderField label="디자인 변형">
                    <div className={styles.designOptions}>
                        <BuilderToggle
                            checked={mainScreen.showBorder}
                            onChange={(checked) => setMainScreen({ showBorder: checked })}
                            label="테두리 선"
                        />
                        <BuilderToggle
                            checked={mainScreen.expandPhoto}
                            onChange={(checked) => setMainScreen({ expandPhoto: checked })}
                            label="사진 확장"
                        />
                    </div>
                </BuilderField>

                {/* Effects */}
                <BuilderField label="이펙트">
                    <BuilderButtonGroup
                        value={mainScreen.effect}
                        options={[
                            { label: '없음', value: 'none' },
                            { label: '안개', value: 'mist' },
                            { label: '물결', value: 'ripple' },
                            { label: '페이퍼', value: 'paper' },
                        ]}
                        onChange={(val: 'none' | 'mist' | 'ripple' | 'paper') => setMainScreen({ effect: val })}
                    />
                </BuilderField>

                {/* Custom Text (Collapsible) */}
                <div className={styles.customTextSection}>

                    <SubAccordion
                        label="문구 커스텀"
                        isOpen={isTextSectionOpen}
                        onClick={() => setIsTextSectionOpen(!isTextSectionOpen)}
                    >
                        {/* Example Phrases Button at Top */}
                        <div className={styles.phrasesHeader}>
                            <button
                                onClick={() => setIsExampleModalOpen(true)}
                                className={styles.exampleButton}
                            >
                                <Sparkles size={14} className={styles.sparkle} />
                                <span>예시 문구</span>
                            </button>
                        </div>

                        <div className={styles.inputGrid}>
                            {/* Title */}
                            <BuilderField label="메인 제목">
                                <BuilderInput
                                    type="text"
                                    value={mainScreen.title}
                                    onChange={(e) => setMainScreen({ title: e.target.value })}
                                    placeholder="THE MARRIAGE"
                                />
                            </BuilderField>

                            {/* Groom & Bride Name */}
                            <BuilderField label="신랑 · 신부 성함">
                                <div className={clsx(styles.container, styles.smallGap)}>
                                    <div className={styles.nameInputs}>
                                        <div className={styles.lastName}>
                                            <BuilderInput
                                                type="text"
                                                value={`${groom.lastName || ''}${groom.firstName || ''}`}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val.length >= 2) {
                                                        setGroom({ lastName: val.substring(0, 1), firstName: val.substring(1) });
                                                    } else {
                                                        setGroom({ lastName: '', firstName: val });
                                                    }
                                                }}
                                                placeholder="신랑 성함"
                                            />
                                        </div>
                                        <div className={styles.andText}>
                                            <BuilderInput
                                                type="text"
                                                value={mainScreen.andText || ''}
                                                onChange={(e) => setMainScreen({ andText: e.target.value })}
                                                placeholder="&"
                                            />
                                        </div>
                                        <div className={styles.firstName}>
                                            <BuilderInput
                                                type="text"
                                                value={`${bride.lastName || ''}${bride.firstName || ''}`}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val.length >= 2) {
                                                        setBride({ lastName: val.substring(0, 1), firstName: val.substring(1) });
                                                    } else {
                                                        setBride({ lastName: '', firstName: val });
                                                    }
                                                }}
                                                placeholder="신부 성함"
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.fullWidth}>
                                        <BuilderInput
                                            type="text"
                                            value={mainScreen.suffixText || ''}
                                            onChange={(e) => setMainScreen({ suffixText: e.target.value })}
                                            placeholder="종결 어미 (예: 결혼합니다)"
                                        />
                                    </div>
                                </div>
                            </BuilderField>

                            {/* Subtitle */}
                            <BuilderField label="서브 제목">
                                <BuilderInput
                                    type="text"
                                    value={mainScreen.subtitle}
                                    onChange={(e) => setMainScreen({ subtitle: e.target.value })}
                                    placeholder="We are getting married"
                                />
                            </BuilderField>

                            {/* Custom Date & Place */}
                            <BuilderField label="날짜 및 장소">
                                <RichTextEditor
                                    content={mainScreen.customDatePlace}
                                    onChange={(val) => setMainScreen({ customDatePlace: val })}
                                    placeholder="0000.00.00 ..."
                                    minHeight="min-h-[140px]"
                                />
                            </BuilderField>
                        </div>

                        {/* Info Text */}
                        <div className={common.notice}>
                            <Info size={14} className={common.icon} />
                            <span>내용을 입력하지 않으면 프리뷰에 노출되지 않습니다.</span>
                        </div>
                    </SubAccordion>

                    {/* Example Modal */}
                    <BuilderModal
                        isOpen={isExampleModalOpen}
                        onClose={() => setIsExampleModalOpen(false)}
                        title="샘플 문구"
                    >
                        <div className={styles.modalGrid}>
                            {(() => {
                                const clean = (s: string) => s.replace(/신랑|신부/g, '').trim();
                                const gName = clean((groom.lastName || '') + (groom.firstName || ''));
                                const bName = clean((bride.lastName || '') + (bride.firstName || ''));

                                return [
                                    {
                                        title: 'THE MARRIAGE',
                                        g: gName,
                                        a: '·',
                                        b: bName,
                                        s: '결혼합니다',
                                        sub: 'We are getting married',
                                        dt: '2026.04.18. Saturday 12:00 PM\n서울 강남구 어느 예식장 1F, 그랜드홀'
                                    },
                                    {
                                        title: 'INVITATION',
                                        g: gName,
                                        a: 'ring',
                                        b: bName,
                                        s: '',
                                        sub: 'SAVE THE DATE',
                                        dt: '2026.04.18. PM 12:00\n더 컨벤션 웨딩홀'
                                    },
                                    {
                                        title: 'OUR WEDDING',
                                        g: gName,
                                        a: '&',
                                        b: bName,
                                        s: '',
                                        sub: 'Special Day',
                                        dt: '2026.04.18. 토요일 오후 12시\n송파구 올림픽로 319'
                                    },
                                    {
                                        title: 'WELCOME',
                                        g: gName,
                                        a: '♥',
                                        b: bName,
                                        s: '',
                                        sub: 'Together Forever',
                                        dt: '2026.04.18. 12:00'
                                    },
                                ].map((ex, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            const cleanG = clean(ex.g);
                                            const cleanB = clean(ex.b);

                                            if (cleanG.length >= 2) {
                                                setGroom({ lastName: cleanG.substring(0, 1), firstName: cleanG.substring(1) });
                                            } else {
                                                setGroom({ lastName: '', firstName: cleanG });
                                            }

                                            if (cleanB.length >= 2) {
                                                setBride({ lastName: cleanB.substring(0, 1), firstName: cleanB.substring(1) });
                                            } else {
                                                setBride({ lastName: '', firstName: cleanB });
                                            }

                                            setMainScreen({
                                                title: ex.title,
                                                andText: ex.a,
                                                suffixText: ex.s,
                                                subtitle: ex.sub,
                                                customDatePlace: ex.dt
                                            });
                                            setIsExampleModalOpen(false);
                                        }}
                                        className={styles.exampleCard}
                                    >
                                        <div className={styles.exampleContent}>
                                            <div className={styles.exTitle}>{ex.title}</div>
                                            <div className={styles.exNames}>
                                                {ex.g} <span style={{ color: accentColor }}>
                                                    {ex.a === '&' ? (
                                                        <AmpersandSVG className="scale-125 translate-y-[-10%]" />
                                                    ) : ex.a === '♥' ? (
                                                        <HeartSVG className="scale-125 translate-y-[-10%]" />
                                                    ) : ex.a === 'ring' ? (
                                                        <Image src="/images/wedding-ring.png" alt="ring" width={20} height={20} className="inline-block object-contain translate-y-[-10%]" />
                                                    ) : (
                                                        ex.a
                                                    )}
                                                </span> {ex.b} {ex.s}
                                            </div>
                                            <div className={styles.exSubtitle}>{ex.sub}</div>
                                            <div className={styles.exDivider}></div>
                                            <div className={styles.exDate}>{ex.dt}</div>
                                        </div>
                                    </button>
                                ));
                            })()}
                        </div>
                        <p className={styles.infoTextModal}>
                            <Info size={12} />
                            원하는 스타일을 선택하면 화면 전체 문구가 자동으로 구성됩니다.
                        </p>
                    </BuilderModal>
                </div>

            </div>
        </AccordionItem>
    );
}
