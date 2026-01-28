"use client";

import React, { useState, useRef, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useInvitationStore } from '@/store/useInvitationStore';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { DatePicker } from '@/components/common/DatePicker';
import { TimePicker } from '@/components/common/TimePicker';
import { Progress } from '@/components/ui/Progress';
import { ArrowRight, Sparkles, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { parseKoreanName } from '@/lib/utils';
import { BottomCTA } from '@/components/ui/BottomCTA';
import styles from './SetupForm.module.scss';

const subscribe = () => () => { };

const SetupForm = () => {
    const router = useRouter();
    const store = useInvitationStore();

    // Portal mounted state (using useSyncExternalStore to avoid effect lints)
    const mounted = useSyncExternalStore(
        subscribe,
        () => true,
        () => false
    );

    const [groomFullName, setGroomFullName] = useState(`${store.groom.lastName}${store.groom.firstName}`);
    const [brideFullName, setBrideFullName] = useState(`${store.bride.lastName}${store.bride.firstName}`);
    const [date, setDate] = useState(store.date);
    const [time, setTime] = useState(store.time);
    const [slug, setSlug] = useState(store.slug);

    // Refs for auto-focus
    const groomNameRef = useRef<HTMLInputElement>(null);
    const brideNameRef = useRef<HTMLInputElement>(null);
    const dateRef = useRef<HTMLButtonElement>(null);
    const timeRef = useRef<HTMLDivElement>(null);
    const slugRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // 🍌 Auto-generate slug from names
    const updateSlugFromNames = (fullName: string) => {
        if (!slug && fullName) {
            // Get first name part (everything after the first char for Korean names)
            const firstName = fullName.length > 1 ? fullName.substring(1) : fullName;
            const randomStr = Math.random().toString(36).substring(2, 6);
            const generatedSlug = `${firstName.trim().toLowerCase()}-${randomStr}`;
            setSlug(generatedSlug);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!groomFullName || !brideFullName || !date || !time || !slug) {
            toast.error('모든 필수 정보를 입력해주세요.');
            return;
        }

        const parsedGroom = parseKoreanName(groomFullName);
        const parsedBride = parseKoreanName(brideFullName);

        // Update Store
        store.setGroom(parsedGroom);
        store.setBride(parsedBride);
        store.setDate(date);
        store.setTime(time);
        store.setSlug(slug);

        // Update mainScreen defaults if they are empty
        if (!store.mainScreen.groomName) {
            store.setMainScreen({
                groomName: parsedGroom.firstName,
                brideName: parsedBride.firstName
            });
        }

        toast.success('기본 정보가 설정되었습니다. 빌더로 이동합니다!');
        router.push('/builder?onboarding=true');
    };

    const isNamesValid = !!(groomFullName && brideFullName);
    const isDateTimeValid = !!(date && time);
    const isFormValid = !!(isNamesValid && isDateTimeValid && slug);

    // Progress Calculation
    const fields = [groomFullName, brideFullName, date, time, slug];
    const completedFields = fields.filter(f => !!f).length;
    const progress = (completedFields / fields.length) * 100;

    // Focus Handlers
    const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLElement | null>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            nextRef.current?.focus();
            if (nextRef === dateRef) {
                nextRef.current?.click();
            } else if (nextRef === timeRef) {
                nextRef.current?.querySelector('button')?.focus();
                nextRef.current?.querySelector('button')?.click();
            }
        }
    };

    // Auto-scroll to bottom when new fields appear
    useEffect(() => {
        if (isNamesValid || isDateTimeValid) {
            const timer = setTimeout(() => {
                bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 300);
            return () => clearTimeout(timer);
        }
        return undefined;
    }, [isNamesValid, isDateTimeValid]);

    // Dynamic Header Text
    const getHeaderText = () => {
        if (!isNamesValid) return { title: "성함을 입력해주세요", subtitle: "신랑, 신부님의 전체 성함을 입력해주세요." };
        if (!isDateTimeValid) return { title: "예식 일시를 알려주세요", subtitle: "결혼식 날짜와 시간을 선택해주세요." };
        return { title: "나만의 주소를 만드세요", subtitle: "청첩장 접속에 사용될 URL 경로입니다." };
    };

    const { title: headerTitle, subtitle: headerSubtitle } = getHeaderText();

    return (
        <div className={styles.stepperContainer}>
            {/* Progress Bar: Rendered via Portal to escape parent transforms */}
            {mounted && typeof document !== 'undefined' && createPortal(
                <Progress value={progress} className={styles.progressBar} />,
                document.body
            )}

            <div className={styles.headerArea}>
                <div className={styles.stepTitleArea}>
                    <h2 className={styles.stepTitle}>{headerTitle}</h2>
                    <p className={styles.stepSubtitle}>{headerSubtitle}</p>
                </div>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
                {/* Names Section */}
                <div className={styles.section}>
                    <div className={styles.inputGroup}>
                        <Label htmlFor="groom-name">신랑 성함</Label>
                        <Input
                            id="groom-name"
                            ref={groomNameRef}
                            placeholder="신랑 성함 (예: 김철수)"
                            value={groomFullName}
                            onChange={(e) => {
                                const val = e.target.value;
                                setGroomFullName(val);
                                updateSlugFromNames(val);
                            }}
                            onKeyDown={(e) => handleKeyDown(e, brideNameRef)}
                            required
                        />
                    </div>

                    {groomFullName && (
                        <div className={`${styles.inputGroup} ${styles.sequentialFadeIn}`}>
                            <Label htmlFor="bride-name">신부 성함</Label>
                            <Input
                                id="bride-name"
                                ref={brideNameRef}
                                placeholder="신부 성함 (예: 이영희)"
                                value={brideFullName}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setBrideFullName(val);
                                    updateSlugFromNames(val);
                                }}
                                required
                            />
                        </div>
                    )}
                </div>

                {/* Date & Time Section - Visible after Names */}
                {isNamesValid && (
                    <div className={`${styles.section} ${styles.sequentialFadeIn}`}>
                        <div className={styles.inputGroup}>
                            <Label htmlFor="wedding-date">날짜</Label>
                            <DatePicker
                                id="wedding-date"
                                ref={dateRef}
                                value={date}
                                onChange={setDate}
                                onComplete={() => { }}
                            />
                        </div>

                        {date && (
                            <div className={`${styles.inputGroup} ${styles.sequentialFadeIn}`}>
                                <Label htmlFor="wedding-time">시간</Label>
                                <TimePicker
                                    id="wedding-time"
                                    ref={timeRef}
                                    value={time}
                                    onChange={setTime}
                                    onComplete={() => { }}
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* Slug Section - Visible after Date & Time */}
                {isNamesValid && isDateTimeValid && (
                    <div className={`${styles.section} ${styles.sequentialFadeIn}`}>
                        <div className={styles.inputGroup}>
                            <Label htmlFor="url-slug">나만의 URL</Label>
                            <Input
                                id="url-slug"
                                ref={slugRef}
                                placeholder="url-slug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
                                required
                            />
                            <div className={styles.slugPreview}>
                                <LinkIcon size={14} />
                                <span>banana-wedding.com/v/{slug || '...'}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Formatting spacer for bottom scroll */}
                <div ref={bottomRef} style={{ height: '20px' }} />

                {/* Final Submit Button */}
                {isFormValid && (
                    <BottomCTA.Single
                        className={styles.ctaContainer}
                        buttonProps={{
                            children: (
                                <>
                                    <Sparkles size={18} />
                                    <span>청첩장 만들기 시작</span>
                                    <ArrowRight size={20} />
                                </>
                            ),
                            onClick: undefined,
                            type: 'submit'
                        }}
                    />
                )}
            </form>
        </div>
    );
};

SetupForm.displayName = "SetupForm";

export { SetupForm };
