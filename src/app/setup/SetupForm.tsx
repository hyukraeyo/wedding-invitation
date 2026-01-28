"use client";

import React, { useState, useRef, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useInvitationStore } from '@/store/useInvitationStore';
import { Input } from '@/components/ui/Input';
import { DatePicker } from '@/components/common/DatePicker';
import { TimePicker } from '@/components/common/TimePicker';
import { Progress } from '@/components/ui/Progress';
import { Sparkles, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { parseKoreanName } from '@/lib/utils';
import { BottomCTA } from '@/components/ui/BottomCTA';
import { FormField } from '@/components/common/FormField';
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

    const [currentStep, setCurrentStep] = useState(0);

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

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

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

    const handleNext = () => {
        if (currentStep < 4) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 0: return !!groomFullName;
            case 1: return !!brideFullName;
            case 2: return !!date;
            case 3: return !!time;
            case 4: return !!slug;
            default: return false;
        }
    };



    // Progress Calculation
    const fields = [groomFullName, brideFullName, date, time, slug];
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
                case 0: groomNameRef.current?.focus(); break;
                case 1: brideNameRef.current?.focus(); break;
                case 2: dateRef.current?.focus(); break;
                case 3: timeRef.current?.querySelector('button')?.focus(); break;
                case 4: slugRef.current?.focus(); break;
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
            case 4: return { title: "나만의 주소를\n만드세요", subtitle: "청첩장에 사용될 고유한 주소입니다." };
            default: return { title: "정보를 입력해주세요", subtitle: "" };
        }
    };

    const { title: headerTitle, subtitle: headerSubtitle } = getHeaderText();

    return (
        <div className={styles.stepperContainer}>
            {/* Progress Bar: Rendered via Portal to escape parent transforms */}
            {mounted && typeof document !== 'undefined' && createPortal(
                <Progress value={progress} className={styles.progressBar} />,
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
                {/* Step 4: Slug */}
                {currentStep >= 4 && (
                    <div className={cn(styles.section, styles.stackIn)}>
                        <FormField
                            label="청첩장 주소"
                            id="url-slug"
                            variant="floating"
                        >
                            <Input
                                id="url-slug"
                                ref={slugRef}
                                value={slug}
                                onChange={(e) => setSlug(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
                                className="bg-transparent text-lg font-bold p-0 h-auto h-12"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && slug) {
                                        e.preventDefault();
                                        handleSubmit();
                                    }
                                }}
                                required
                            />
                            <div className={styles.slugPreview}>
                                <LinkIcon size={14} />
                                <span>banana-wedding.com/v/{slug || '...'}</span>
                            </div>
                        </FormField>
                    </div>
                )}

                {/* Step 3: Time */}
                {currentStep >= 3 && (
                    <div className={cn(styles.section, styles.stackIn)}>
                        <FormField
                            label="예식 시간"
                            id="wedding-time"
                            variant="floating"
                        >
                            <TimePicker
                                id="wedding-time"
                                ref={timeRef}
                                part="all"
                                value={time}
                                onChange={setTime}
                                onComplete={() => {
                                    setTimeout(handleNext, 400);
                                }}
                                disabled={currentStep > 3}
                                className="border-none bg-transparent text-lg font-bold p-0 shadow-none h-auto h-12 justify-start"
                            />
                        </FormField>
                    </div>
                )}

                {/* Step 2: Date */}
                {currentStep >= 2 && (
                    <div className={cn(styles.section, styles.stackIn)}>
                        <FormField
                            label="예식 날짜"
                            id="wedding-date"
                            variant="floating"
                        >
                            <DatePicker
                                id="wedding-date"
                                ref={dateRef}
                                value={date}
                                onChange={(val) => {
                                    setDate(val);
                                    if (val) setTimeout(handleNext, 300);
                                }}
                                onComplete={() => { }}
                                disabled={currentStep > 2}
                                className="border-none bg-transparent text-lg font-bold p-0 shadow-none h-auto h-12 justify-start"
                            />
                        </FormField>
                    </div>
                )}

                {/* Step 1: Bride Name */}
                {currentStep >= 1 && (
                    <div className={cn(styles.section, styles.stackIn)}>
                        <FormField
                            label="신부 이름"
                            id="bride-name"
                            variant="floating"
                        >
                            <Input
                                id="bride-name"
                                ref={brideNameRef}
                                value={brideFullName}
                                readOnly={currentStep > 1}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setBrideFullName(val);
                                    updateSlugFromNames(val);
                                }}
                                className="bg-transparent text-lg font-bold p-0 h-auto h-12"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && brideFullName) {
                                        e.preventDefault();
                                        handleNext();
                                    }
                                }}
                                required
                            />
                        </FormField>
                    </div>
                )}

                {/* Step 0: Groom Name */}
                <div className={cn(styles.section, styles.stackIn)}>
                    <FormField
                        label="신랑 이름"
                        id="groom-name"
                        variant="floating"
                    >
                        <Input
                            id="groom-name"
                            ref={groomNameRef}
                            value={groomFullName}
                            readOnly={currentStep > 0}
                            onChange={(e) => {
                                const val = e.target.value;
                                setGroomFullName(val);
                                updateSlugFromNames(val);
                            }}
                            className="bg-transparent text-lg font-bold p-0 h-auto h-12"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && groomFullName) {
                                    e.preventDefault();
                                    handleNext();
                                }
                            }}
                            required
                        />
                    </FormField>
                </div>

                {/* Formatting spacer */}
                <div ref={bottomRef} style={{ height: '40px' }} />

                {/* Dynamic Bottom Button */}
                {isStepValid() && ![2, 3].includes(currentStep) && (
                    <BottomCTA.Single
                        className={styles.ctaContainer}
                        buttonProps={{
                            children: (
                                <>
                                    {currentStep < 4 ? (
                                        <>
                                            <span>다음</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={16} />
                                            <span>시작하기</span>
                                        </>
                                    )}
                                </>
                            ),
                            onClick: handleNext,
                            type: currentStep === 4 ? 'submit' : 'button'
                        }}
                    />
                )}
            </form>
        </div>
    );
};

SetupForm.displayName = "SetupForm";

export { SetupForm };
