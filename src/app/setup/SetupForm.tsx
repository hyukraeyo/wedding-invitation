"use client";

import React, { useState, useRef, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useInvitationStore } from '@/store/useInvitationStore';
import { TextField } from '@/components/ui/TextField';
import { IconButton } from '@/components/ui/IconButton';
import { DatePicker } from '@/components/common/DatePicker';
import { TimePicker } from '@/components/common/TimePicker';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Sparkles, ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { parseKoreanName } from '@/lib/utils';
import { FixedBottomCTA } from '@/components/ui/BottomCTA';
import styles from './SetupForm.module.scss';

const subscribe = () => () => { };

const SetupForm = () => {
    const router = useRouter();
    const store = useInvitationStore();
    const { toast } = useToast();

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
    const bottomRef = useRef<HTMLDivElement>(null);

    const [currentStep, setCurrentStep] = useState(0);

    // 🍌 Auto-generate slug helper
    const generateSlug = (name: string) => {
        const firstName = name.length > 1 ? name.substring(1) : name;
        const randomStr = Math.random().toString(36).substring(2, 6);
        return `${firstName.trim().toLowerCase()}-${randomStr}`;
    };

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        // Ensure slug exists or generate it
        let finalSlug = slug;
        if (!finalSlug) {
            const baseName = brideFullName || groomFullName || 'wedding';
            finalSlug = generateSlug(baseName);
            setSlug(finalSlug);
        }

        if (!groomFullName || !brideFullName || !date || !time || !finalSlug) {
            toast({ variant: 'destructive', text: '모든 필수 정보를 입력해주세요.' });
            return;
        }

        const parsedGroom = parseKoreanName(groomFullName);
        const parsedBride = parseKoreanName(brideFullName);

        // Update Store
        store.setGroom(parsedGroom);
        store.setBride(parsedBride);
        store.setDate(date);
        store.setTime(time);
        store.setSlug(finalSlug);

        // Update mainScreen defaults if they are empty
        if (!store.mainScreen.groomName) {
            store.setMainScreen({
                groomName: parsedGroom.firstName,
                brideName: parsedBride.firstName
            });
        }

        toast({ text: '기본 정보가 설정되었습니다. 빌더로 이동합니다!' });
        router.push('/builder?onboarding=true');
    };

    const handleNext = (force = false) => {
        if (!force && !isStepValid()) return;

        if (currentStep < 3) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        } else {
            router.back();
        }
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 0: return !!groomFullName.trim();
            case 1: return !!brideFullName.trim();
            case 2: return !!date;
            case 3: return !!time;
            default: return false;
        }
    };



    // Progress Calculation
    const fields = [groomFullName, brideFullName, date, time];
    const completedFields = fields.filter(f => !!f).length;
    const progress = (completedFields / fields.length) * 100;



    // Auto-scroll to top when new fields appear (Reverse Stacking)
    useEffect(() => {
        const timer = setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
        return () => clearTimeout(timer);
    }, [currentStep]);

    // Focus current input when step changes
    useEffect(() => {
        const focusInput = () => {
            switch (currentStep) {
                case 0:
                    groomNameRef.current?.focus();
                    break;
                case 1:
                    brideNameRef.current?.focus();
                    break;
                case 2:
                    dateRef.current?.focus();
                    dateRef.current?.click();
                    break;
                case 3:
                    const timeBtn = timeRef.current?.querySelector('button');
                    timeBtn?.focus();
                    timeBtn?.click();
                    break;
            }
        };
        const timer = setTimeout(focusInput, 500); // Wait for animation
        return () => clearTimeout(timer);
    }, [currentStep]);

    // Dynamic Header Text
    const getHeaderText = () => {
        switch (currentStep) {
            case 0: return { title: "신랑님의 이름을\n알려주세요", subtitle: "" };
            case 1: return { title: "신부님의 이름을\n알려주세요", subtitle: "" };
            case 2: return { title: "예식 날짜를\n알려주세요", subtitle: "" };
            case 3: return { title: "예식 시간을\n알려주세요", subtitle: "" };
            default: return { title: "정보를 입력해주세요", subtitle: "" };
        }
    };

    const { title: headerTitle, subtitle: headerSubtitle } = getHeaderText();

    return (
        <div className={styles.stepperContainer}>
            {/* Progress Bar: Rendered via Portal to escape parent transforms */}
            {mounted && typeof document !== 'undefined' && createPortal(
                <>
                    <div className={styles.mobileHeader}>
                        <IconButton
                            className={styles.mobileHeaderAction}
                            onClick={handleBack}
                            variant="clear"
                            aria-label="뒤로가기"
                            name=""
                            iconSize={24}
                        >
                            <ChevronLeft size={24} />
                        </IconButton>
                        <span className={styles.mobileHeaderTitle}>기본 정보</span>
                        <div className={styles.mobileHeaderAction} /> {/* Spacer for centering */}
                    </div>
                    <ProgressBar progress={progress / 100} size="normal" className={styles.progressBar || ""} />
                </>,
                document.body
            )}

            <div className={cn(styles.headerArea, "mb-6")}>
                <div className={styles.stepTitleArea}>
                    <h2 key={`title-${currentStep}`} className={cn(styles.stepTitle, styles.titleAnimated)}>{headerTitle}</h2>
                    {headerSubtitle && (
                        <p key={`subtitle-${currentStep}`} className={cn(styles.stepSubtitle, styles.titleAnimated)} style={{ animationDelay: '0.1s' }}>
                            {headerSubtitle}
                        </p>
                    )}
                </div>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
                {/* Step 3: Time */}
                {currentStep >= 3 && (
                    <div
                        className={cn(styles.section, styles.stackIn, currentStep > 3 && styles.clickable)}
                        onClick={() => currentStep > 3 && setCurrentStep(3)}
                    >
                        <div className={styles.fieldWrapper}>
                            <label className={styles.fieldLabel} htmlFor="wedding-time">예식 시간</label>
                            <TimePicker
                                id="wedding-time"
                                ref={timeRef}
                                part="all"
                                value={time}
                                onChange={setTime}
                                onComplete={() => {
                                    setTimeout(() => handleNext(true), 400);
                                }}
                                disabled={currentStep > 3}
                                className="border-none bg-transparent text-lg font-bold p-0 shadow-none h-auto h-12 justify-start"
                            />
                        </div>
                    </div>
                )}

                {/* Step 2: Date */}
                {currentStep >= 2 && (
                    <div
                        className={cn(styles.section, styles.stackIn, currentStep > 2 && styles.clickable)}
                        onClick={() => currentStep > 2 && setCurrentStep(2)}
                    >
                        <div className={styles.fieldWrapper}>
                            <label className={styles.fieldLabel} htmlFor="wedding-date">예식 날짜</label>
                            <DatePicker
                                id="wedding-date"
                                ref={dateRef}
                                value={date}
                                onChange={(val) => {
                                    setDate(val);
                                    if (val) setTimeout(() => handleNext(true), 300);
                                }}
                                onComplete={() => { }}
                                disabled={currentStep > 2}
                                className="border-none bg-transparent text-lg font-bold p-0 shadow-none h-auto h-12 justify-start"
                            />
                        </div>
                    </div>
                )}

                {/* Step 1: Bride Name */}
                {currentStep >= 1 && (
                    <div
                        className={cn(styles.section, styles.stackIn, currentStep > 1 && styles.clickable)}
                        onClick={() => currentStep > 1 && setCurrentStep(1)}
                    >
                        <TextField
                            label="신부 이름"
                            id="bride-name"
                            ref={brideNameRef}
                            value={brideFullName}
                            readOnly={currentStep > 1}
                            variant="line"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const val = e.target.value;
                                setBrideFullName(val);
                            }}
                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                if (e.key === 'Enter' && currentStep === 1 && brideFullName.trim()) {
                                    e.preventDefault();
                                    handleNext();
                                }
                            }}
                            required
                        />
                    </div>
                )}

                {/* Step 0: Groom Name */}
                <div
                    className={cn(styles.section, styles.stackIn, currentStep > 0 && styles.clickable)}
                    onClick={() => currentStep > 0 && setCurrentStep(0)}
                >
                    <TextField
                        label="신랑 이름"
                        id="groom-name"
                        ref={groomNameRef}
                        value={groomFullName}
                        readOnly={currentStep > 0}
                        variant="line"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const val = e.target.value;
                            setGroomFullName(val);
                        }}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            if (e.key === 'Enter' && currentStep === 0 && groomFullName.trim()) {
                                e.preventDefault();
                                handleNext();
                            }
                        }}
                        required
                    />
                </div>

                {/* Formatting spacer */}
                <div ref={bottomRef} style={{ height: '40px' }} />

                {/* Dynamic Bottom Button */}
                {isStepValid() && (
                    <FixedBottomCTA
                        // @ts-expect-error - TDS might have restricted these props in types
                        onClick={() => handleNext()}
                        type={currentStep === 3 ? 'submit' : 'button'}
                    >
                        {currentStep < 3 ? (
                            <>
                                <span>다음</span>
                            </>
                        ) : (
                            <>
                                <Sparkles size={16} />
                                <span>시작하기</span>
                            </>
                        )}
                    </FixedBottomCTA>
                )}
            </form>
        </div>
    );
};

SetupForm.displayName = "SetupForm";

export { SetupForm };
