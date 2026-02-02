"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DatePicker } from '@/components/common/DatePicker';
import { TimePicker } from '@/components/common/TimePicker';
import { BottomCTA } from '@/components/ui/BottomCTA';
import { Heading, Form, FormField, FormLabel, FormControl, FormMessage, Card, Skeleton, VisuallyHidden } from '@/components/ui';
import { NameField } from '@/components/common/NameField';
import { useToast } from '@/hooks/use-toast';
import { parseKoreanName, cn, isValidKoreanNameValue } from '@/lib/utils';
import { useHeaderStore } from '@/store/useHeaderStore';
import { useInvitationStore } from '@/store/useInvitationStore';
import styles from './SetupForm.module.scss';

const STEPS = [
    { title: "신랑님의 성함을 알려주세요", field: "groom" },
    { title: "신부님의 성함을 알려주세요", field: "bride" },
    { title: "예식일은 언제인가요?", field: "date" },
    { title: "예식 시간은 언제인가요?", field: "time" }
];

const SetupForm = () => {
    const router = useRouter();
    const { toast } = useToast();
    const { groom, bride, date, time, setGroom, setBride, setDate, setTime, setSlug, reset } = useInvitationStore();
    const { setHeader, resetHeader } = useHeaderStore();

    const [currentStep, setCurrentStep] = useState(0);
    const [highestStepReached, setHighestStepReached] = useState(0);

    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

    const [groomFullName, setGroomFullName] = useState(groom.firstName ? `${groom.lastName}${groom.firstName}` : '');
    const [brideFullName, setBrideFullName] = useState(bride.firstName ? `${bride.lastName}${bride.firstName}` : '');

    const [isHydrated, setIsHydrated] = useState(false);

    const groomNameRef = useRef<HTMLInputElement>(null);
    const brideNameRef = useRef<HTMLInputElement>(null);
    const dateRef = useRef<HTMLButtonElement>(null);
    const timeRef = useRef<HTMLButtonElement>(null);

    // 🍌 초기 진입 시 데이터 초기화 및 로컬 상태 동기화
    useEffect(() => {
        reset();
        // reset 후 로컬 상태도 초기화
        setGroomFullName('');
        setBrideFullName('');
        setDate('');
        setTime('');
        setIsHydrated(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isStepValid = useCallback(() => {
        switch (currentStep) {
            case 0: return isValidKoreanNameValue(groomFullName);
            case 1: return isValidKoreanNameValue(brideFullName);
            case 2: return !!date;
            case 3: return !!time;
            default: return false;
        }
    }, [currentStep, groomFullName, brideFullName, date, time]);


    const isInvalidNameMessage = useCallback((value: string) => {
        const trimmed = value.trim();
        if (!trimmed) return false;
        return !isValidKoreanNameValue(trimmed);
    }, []);

    const isAllStepsValid = useCallback(() => {
        return isValidKoreanNameValue(groomFullName) &&
            isValidKoreanNameValue(brideFullName) &&
            !!date &&
            !!time;
    }, [groomFullName, brideFullName, date, time]);

    const isComplete = isHydrated && isAllStepsValid();
    const progress = isComplete ? 100 : Math.round((currentStep / STEPS.length) * 100);

    const handleBack = useCallback(() => {
        if (currentStep > 0) {
            const prevStep = currentStep - 1;
            setCurrentStep(prevStep);
            setHighestStepReached(prevStep); // Back button should also pull back the title
        } else {
            router.back();
        }
    }, [currentStep, router]);

    useEffect(() => {
        setHeader({
            title: "청첩장 시작하기",
            showBack: true,
            onBack: handleBack,
            progress: progress
        });
        return () => resetHeader();
    }, [progress, handleBack, setHeader, resetHeader]);

    useEffect(() => {
        if (!isHydrated) return;

        // 🍌 IME 입력을 마무리하고 포커스를 이동하기 위해 미세한 지연 시간 추가
        const timer = setTimeout(() => {
            if (currentStep === 0) groomNameRef.current?.focus();
            else if (currentStep === 1) brideNameRef.current?.focus();
        }, 30);

        return () => clearTimeout(timer);
    }, [currentStep, isHydrated]);

    // 초기화 완료 전에는 스켈레톤 표시
    if (!isHydrated) {
        return (
            <div className={styles.container}>
                <Card variant="ghost" className={styles.whiteBox}>
                    <div className={styles.headerContent}>
                        <Skeleton className={styles.skeletonTitle} />
                    </div>
                    <div className={`${styles.formWindow} ${styles.skeletonWindow}`}>
                        <div className={`${styles.fieldContainer} ${styles.skeletonField}`}>
                            <Skeleton className={styles.skeletonLabel} />
                            <Skeleton className={styles.skeletonInput} />
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    const handleNext = (isAuto = false) => {
        if (!isStepValid()) {
            if (!isAuto) {
                const description = (currentStep === 0 || currentStep === 1)
                    ? "이름을 정확히 입력해주세요."
                    : "정보를 입력해주세요.";
                toast({ variant: 'destructive', description });
            }
            return;
        }

        if (currentStep === 0) {
            const { lastName, firstName } = parseKoreanName(groomFullName);
            setGroom({ lastName, firstName });
        } else if (currentStep === 1) {
            const { lastName, firstName } = parseKoreanName(brideFullName);
            setBride({ lastName, firstName });
        }

        if (currentStep < STEPS.length - 1) {
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
            setHighestStepReached(prev => Math.max(prev, nextStep));

            // 🍌 자동 모달 열기
            if (nextStep === 2) {
                setTimeout(() => setIsDatePickerOpen(true), 100);
            } else if (nextStep === 3) {
                setTimeout(() => setIsTimePickerOpen(true), 100);
            }
        } else {
            const slug = `${groomFullName.trim()}-${Math.random().toString(36).substring(2, 6)}`;
            setSlug(slug);
            router.push(`/builder?onboarding=true`);
        }
    };

    const handleFieldClick = (step: number) => {
        if (step <= highestStepReached) {
            setCurrentStep(step);
            if (step === 2) setIsDatePickerOpen(true);
            if (step === 3) setIsTimePickerOpen(true);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleNext();
    };


    return (
        <div className={styles.container}>
            <Card variant="ghost" className={styles.whiteBox}>
                <div className={styles.headerContent}>
                    {[...STEPS, { title: "모든 정보를 입력했어요!" }].map((step, index) => {
                        const isThisStepActive = index === STEPS.length ? isComplete : !isComplete && highestStepReached === index;

                        return (
                            <div
                                key={index}
                                className={cn(
                                    styles.titleWrapper,
                                    isThisStepActive ? styles.active : styles.inactive
                                )}
                                aria-hidden={!isThisStepActive}
                            >
                                <Heading as="h1" size="6" weight="bold" className={styles.stepHeading}>
                                    {step.title}
                                </Heading>
                            </div>
                        );
                    })}
                </div>

                <div
                    className={styles.formWindow}
                    style={{ height: `${(highestStepReached + 1) * 112}px` }}
                >
                    <Form
                        onSubmit={handleSubmit}
                        className={styles.form}
                        style={{
                            gap: 0,
                            transform: `translateY(${(3 - highestStepReached) * -112}px)`
                        }}
                    >
                        {/* 4. 예식 시간 */}
                        <div className={cn(styles.fieldContainer, highestStepReached >= 3 && styles.visible)}>
                            <FormField name="wedding-time">
                                <FormLabel className={styles.label} htmlFor="wedding-time">예식 시간</FormLabel>
                                <FormMessage className={styles.formMessage} match="valueMissing">
                                    예식 시간을 선택해주세요.
                                </FormMessage>
                                <FormControl asChild>
                                    <TimePicker
                                        id="wedding-time"
                                        ref={timeRef}
                                        value={time}
                                        open={isTimePickerOpen}
                                        onOpenChange={setIsTimePickerOpen}
                                        variant="toss"
                                        radius="large"
                                        placeholder="예식 시간을 선택해주세요"
                                        onChange={setTime}
                                        disabled={false}
                                        onComplete={() => {
                                            setIsTimePickerOpen(false);
                                        }}
                                    />
                                </FormControl>
                                <FormControl asChild>
                                    <VisuallyHidden asChild>
                                        <input
                                            required
                                            readOnly
                                            aria-label="예식 시간"
                                            value={time || ''}
                                        />
                                    </VisuallyHidden>
                                </FormControl>
                            </FormField>
                        </div>

                        {/* 3. 예식 날짜 */}
                        <div className={cn(styles.fieldContainer, highestStepReached >= 2 && styles.visible)}>
                            <FormField name="wedding-date">
                                <FormLabel className={styles.label} htmlFor="wedding-date">예식 날짜</FormLabel>
                                <FormMessage className={styles.formMessage} match="valueMissing">
                                    예식 날짜를 선택해주세요.
                                </FormMessage>
                                <FormControl asChild>
                                    <DatePicker
                                        id="wedding-date"
                                        ref={dateRef}
                                        value={date}
                                        open={isDatePickerOpen}
                                        onOpenChange={setIsDatePickerOpen}
                                        variant="toss"
                                        radius="large"
                                        placeholder="예식 날짜를 선택해주세요"
                                        onChange={(val) => {
                                            setDate(val);
                                            if (val) {
                                                setIsDatePickerOpen(false);
                                                setTimeout(() => {
                                                    setCurrentStep(3);
                                                    setHighestStepReached(prev => Math.max(prev, 3));
                                                    setIsTimePickerOpen(true);
                                                }, 300);
                                            }
                                        }}
                                        disabled={false}
                                    />
                                </FormControl>
                                <FormControl asChild>
                                    <VisuallyHidden asChild>
                                        <input
                                            required
                                            readOnly
                                            aria-label="예식 날짜"
                                            value={date || ''}
                                        />
                                    </VisuallyHidden>
                                </FormControl>
                            </FormField>
                        </div>

                        {/* 2. 신부 이름 */}
                        <div className={cn(styles.fieldContainer, highestStepReached >= 1 && styles.visible)}>
                            <FormField name="bride-name">
                                <FormLabel className={styles.label} htmlFor="bride-name">신부 이름</FormLabel>
                                <FormControl asChild>
                                    <NameField
                                        id="bride-name"
                                        ref={brideNameRef}
                                        readOnly={currentStep !== 1}
                                        variant="toss"
                                        radius="large"
                                        placeholder="신부 성함을 입력해주세요"
                                        value={brideFullName}
                                        onValueChange={setBrideFullName}
                                        allowSpace
                                        allowMiddleDot
                                        allowLatin
                                        invalid={brideFullName.trim().length > 0 && !isValidKoreanNameValue(brideFullName)}
                                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                            if (e.key === 'Enter' && currentStep === 1 && isValidKoreanNameValue(brideFullName)) {
                                                e.preventDefault();
                                                handleNext();
                                            }
                                        }}
                                        onClick={() => handleFieldClick(1)}
                                        required
                                    />
                                </FormControl>
                                <FormMessage className={styles.formMessage} match="valueMissing">
                                    신부 성함을 입력해주세요.
                                </FormMessage>
                                <FormMessage className={styles.formMessage} match={isInvalidNameMessage}>
                                    이름을 정확히 입력해주세요.
                                </FormMessage>
                            </FormField>
                        </div>

                        {/* 1. 신랑 이름 */}
                        <div className={cn(styles.fieldContainer, styles.visible)}>
                            <FormField name="groom-name">
                                <FormLabel className={styles.label} htmlFor="groom-name">신랑 이름</FormLabel>
                                <FormControl asChild>
                                    <NameField
                                        id="groom-name"
                                        ref={groomNameRef}
                                        readOnly={currentStep !== 0}
                                        variant="toss"
                                        radius="large"
                                        placeholder="신랑 이름"
                                        value={groomFullName}
                                        onValueChange={setGroomFullName}
                                        allowSpace
                                        allowMiddleDot
                                        allowLatin
                                        invalid={groomFullName.trim().length > 0 && !isValidKoreanNameValue(groomFullName)}
                                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                            if (e.key === 'Enter' && currentStep === 0 && isValidKoreanNameValue(groomFullName)) {
                                                e.preventDefault();
                                                handleNext();
                                            }
                                        }}
                                        onClick={() => handleFieldClick(0)}
                                        required
                                    />
                                </FormControl>
                                <FormMessage className={styles.formMessage} match="valueMissing">
                                    신랑 성함을 입력해주세요.
                                </FormMessage>
                                <FormMessage className={styles.formMessage} match={isInvalidNameMessage}>
                                    이름을 정확히 입력해주세요.
                                </FormMessage>
                            </FormField>
                        </div>
                    </Form>
                </div>

            </Card>

            {
                (currentStep === 3 || isStepValid()) && (
                    <div className={styles.ctaWrapper}>
                        <BottomCTA.Single
                            fixed={true}
                            transparent
                            wrapperClassName={styles.bottomCta}
                            onClick={() => handleNext()}
                            animated={true}
                            buttonVariant="toss"
                        >
                            {highestStepReached < 3 ? (
                                <span>다음</span>
                            ) : (
                                <div className={styles.ctaLabel}>
                                    <Sparkles size={16} />
                                    <span>시작하기</span>
                                </div>
                            )}
                        </BottomCTA.Single>
                    </div>
                )
            }
        </div>
    );
};

SetupForm.displayName = "SetupForm";

export { SetupForm };
