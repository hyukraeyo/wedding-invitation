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
import { parseKoreanName, cn, isValidKoreanNameValue, focusMobileInput } from '@/lib/utils';
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
            title: isComplete ? "정보 입력 완료" : STEPS[currentStep]?.title || "정보 입력",
            showBack: true,
            onBack: handleBack,
            progress: progress
        });
        return () => resetHeader();
    }, [progress, handleBack, setHeader, resetHeader, currentStep, isComplete]);

    // 🍌 모바일 키패드 대응을 위한 포커스 헬퍼
    const focusField = (ref: React.RefObject<HTMLInputElement | null>) => {
        focusMobileInput(ref.current, true);
    };

    // 🍌 단계 변경 시 포커스 관리 로직
    // 기본적으로 handleNext와 handleFieldClick에서 동기적으로 처리하지만,
    // 초기 진입이나 예기치 못한 상태 변경을 위해 useEffect 보완
    useEffect(() => {
        if (!isHydrated) return;

        // 🍌 초기 진입 시에만 동작하거나, 현재 포커스가 없을 때만 보조적으로 동작
        const activeElement = document.activeElement;
        const isInputFocused = activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA';

        let timer: NodeJS.Timeout | null = null;

        if (!isInputFocused) {
            timer = setTimeout(() => {
                if (currentStep === 0) focusField(groomNameRef);
                else if (currentStep === 1) focusField(brideNameRef);
            }, 100);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [currentStep, isHydrated]);

    // 초기화 완료 전에는 스켈레톤 표시
    if (!isHydrated) {
        return (
            <div className={styles.container}>
                <Card variant="ghost" className={styles.whiteBox}>

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

            // 🍌 다음 필드로 즉시 포커스 이동 (모바일 키패드 유지)
            if (nextStep === 0) focusField(groomNameRef);
            else if (nextStep === 1) focusField(brideNameRef);
            else if (nextStep === 2) {
                // 🍌 날짜/시간 선택기는 모달이므로 약간의 지연 후 열기
                setTimeout(() => setIsDatePickerOpen(true), 150);
            } else if (nextStep === 3) {
                setTimeout(() => setIsTimePickerOpen(true), 150);
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
            // 🍌 클릭 시 즉시 포커스 (동기적 호출이 모바일에서 키패드를 깨움)
            if (step === 0) {
                focusField(groomNameRef);
            } else if (step === 1) {
                focusField(brideNameRef);
            } else if (step === 2) {
                setIsDatePickerOpen(true);
            } else if (step === 3) {
                setIsTimePickerOpen(true);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleNext();
    };


    return (
        <div className={styles.container}>
            <Card variant="ghost" className={styles.whiteBox}>


                <div
                    className={styles.formWindow}
                    style={{ height: `${(highestStepReached + 1) * 112}px` }}
                >
                    <Form
                        onSubmit={handleSubmit}
                        className={styles.form}
                        style={{
                            transform: `translateY(${(3 - highestStepReached) * -112}px)`
                        }}
                    >
                        {/* 4. 예식 시간 */}
                        <div className={cn(styles.fieldContainer, highestStepReached >= 3 && styles.visible)}>
                            <FormField name="wedding-time" floatingLabel>
                                <FormLabel htmlFor="wedding-time">예식 시간</FormLabel>
                                <FormControl asChild>
                                    <TimePicker
                                        id="wedding-time"
                                        ref={timeRef}
                                        value={time}
                                        open={isTimePickerOpen}
                                        onOpenChange={setIsTimePickerOpen}
                                        variant="classic"
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
                                <FormMessage match="valueMissing">
                                    예식 시간을 선택해주세요.
                                </FormMessage>
                            </FormField>
                        </div>

                        {/* 3. 예식 날짜 */}
                        <div className={cn(styles.fieldContainer, highestStepReached >= 2 && styles.visible)}>
                            <FormField name="wedding-date" floatingLabel>
                                <FormLabel htmlFor="wedding-date">예식 날짜</FormLabel>
                                <FormControl asChild>
                                    <DatePicker
                                        id="wedding-date"
                                        ref={dateRef}
                                        value={date}
                                        open={isDatePickerOpen}
                                        onOpenChange={setIsDatePickerOpen}
                                        variant="classic"
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
                                <FormMessage match="valueMissing">
                                    예식 날짜를 선택해주세요.
                                </FormMessage>
                            </FormField>
                        </div>

                        {/* 2. 신부 이름 */}
                        <div className={cn(styles.fieldContainer, highestStepReached >= 1 && styles.visible)}>
                            <FormField name="bride-name" floatingLabel>
                                <FormLabel htmlFor="bride-name">신부 이름</FormLabel>
                                <FormControl asChild>
                                    <NameField
                                        id="bride-name"
                                        ref={brideNameRef}
                                        readOnly={currentStep !== 1}
                                        variant="classic"
                                        size="lg"
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
                                        enterKeyHint="next"
                                        onClick={() => handleFieldClick(1)}
                                        required
                                    />
                                </FormControl>
                                <FormMessage match="valueMissing">
                                    신부 성함을 입력해주세요.
                                </FormMessage>
                                <FormMessage className={styles.formMessage} match={isInvalidNameMessage}>
                                    이름을 정확히 입력해주세요.
                                </FormMessage>
                            </FormField>
                        </div>

                        {/* 1. 신랑 이름 */}
                        <div className={cn(styles.fieldContainer, styles.visible)}>
                            <FormField name="groom-name" floatingLabel>
                                <FormLabel htmlFor="groom-name">신랑 이름</FormLabel>
                                <FormControl asChild>
                                    <NameField
                                        id="groom-name"
                                        ref={groomNameRef}
                                        readOnly={currentStep !== 0}
                                        variant="classic"
                                        size="lg"
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
                                        enterKeyHint="next"
                                        onClick={() => handleFieldClick(0)}
                                        required
                                    />
                                </FormControl>
                                <FormMessage match="valueMissing">
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

            <div className={styles.ctaWrapper}>
                <BottomCTA.Single
                    fixed={true}
                    transparent
                    wrapperClassName={styles.bottomCta}
                    onClick={() => handleNext()}
                    animated={true}
                    disabled={!isStepValid()}
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
        </div>
    );
};

SetupForm.displayName = "SetupForm";

export { SetupForm };
