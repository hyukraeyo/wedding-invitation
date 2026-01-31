"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useInvitationStore } from '@/store/useInvitationStore';
import { useHeaderStore } from '@/store/useHeaderStore';
import { TextField, Heading, Flex, Box, Form, FormField, FormLabel, FormControl, Card } from '@/components/ui';
import { DatePicker } from '@/components/common/DatePicker';
import { TimePicker } from '@/components/common/TimePicker';
import { Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { parseKoreanName, cn } from '@/lib/utils';
import { BottomCTA } from '@/components/ui/BottomCTA';
import styles from './SetupForm.module.scss';

const STEPS = [
    { title: "신랑님의 성함을\n알려주세요", field: "groom" },
    { title: "신부님의 성함을\n알려주세요", field: "bride" },
    { title: "예식일은\n언제인가요?", field: "date" },
    { title: "예식 시간은\n언제인가요?", field: "time" }
];

const SetupForm = () => {
    const router = useRouter();
    const { toast } = useToast();
    const { groom, bride, date, time, setGroom, setBride, setDate, setTime, setSlug } = useInvitationStore();
    const { setHeader, resetHeader } = useHeaderStore();

    const [currentStep, setCurrentStep] = useState(0);
    const [highestStepReached, setHighestStepReached] = useState(0);

    const [groomFullName, setGroomFullName] = useState(groom.firstName ? `${groom.lastName}${groom.firstName}` : '');
    const [brideFullName, setBrideFullName] = useState(bride.firstName ? `${bride.lastName}${bride.firstName}` : '');

    const groomNameRef = useRef<HTMLInputElement>(null);
    const brideNameRef = useRef<HTMLInputElement>(null);
    const dateRef = useRef<HTMLButtonElement>(null);
    const timeRef = useRef<HTMLButtonElement>(null);

    const isStepValid = useCallback(() => {
        switch (currentStep) {
            case 0: return groomFullName.trim().length > 0;
            case 1: return brideFullName.trim().length > 0;
            case 2: return !!date;
            case 3: return !!time;
            default: return false;
        }
    }, [currentStep, groomFullName, brideFullName, date, time]);

    const progress = Math.round(((currentStep + 1) / STEPS.length) * 100);

    const handleBack = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
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
        if (currentStep === 0) groomNameRef.current?.focus();
        else if (currentStep === 1) brideNameRef.current?.focus();
    }, [currentStep]);

    const handleNext = (isAuto = false) => {
        if (!isStepValid()) {
            if (!isAuto) toast({ variant: 'destructive', description: "정보를 입력해주세요." });
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
        } else {
            const slug = `${groomFullName.trim()}-${Math.random().toString(36).substring(2, 6)}`;
            setSlug(slug);
            router.push(`/builder?onboarding=true`);
        }
    };

    const handleFieldClick = (step: number) => {
        if (step <= highestStepReached) {
            setCurrentStep(step);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleNext();
    };

    const headerTitle = STEPS[currentStep]?.title;

    return (
        <Box className={styles.container}>
            <Card variant="ghost" className={styles.whiteBox}>
                {headerTitle && (
                    <Box key={currentStep} className={cn(styles.headerContent, styles.titleUpdate)}>
                        <Heading as="h1" size="8" weight="bold" className={styles.stepHeading}>
                            {headerTitle.split('\n').map((line, i) => (
                                <React.Fragment key={i}>
                                    {line}
                                    {i !== headerTitle.split('\n').length - 1 && <br />}
                                </React.Fragment>
                            ))}
                        </Heading>
                    </Box>
                )}

                <Form onSubmit={handleSubmit} className={styles.form}>
                    {highestStepReached >= 3 && (
                        <Box
                            className={cn(styles.fieldWrapper, currentStep !== 3 && styles.inactive)}
                            onClick={() => handleFieldClick(3)}
                        >
                            <FormField name="wedding-time">
                                <FormLabel className={styles.label}>예식 시간</FormLabel>
                                <FormControl asChild>
                                    <TimePicker
                                        id="wedding-time"
                                        ref={timeRef}
                                        value={time}
                                        variant="surface"
                                        radius="large"
                                        onChange={setTime}
                                        disabled={false}
                                    />
                                </FormControl>
                            </FormField>
                        </Box>
                    )}

                    {highestStepReached >= 2 && (
                        <Box
                            className={cn(styles.fieldWrapper, currentStep !== 2 && styles.inactive)}
                            onClick={() => handleFieldClick(2)}
                        >
                            <FormField name="wedding-date">
                                <FormLabel className={styles.label}>예식 날짜</FormLabel>
                                <FormControl asChild>
                                    <DatePicker
                                        id="wedding-date"
                                        ref={dateRef}
                                        value={date}
                                        variant="surface"
                                        radius="large"
                                        onChange={(val) => {
                                            setDate(val);
                                            if (val) setTimeout(() => handleNext(true), 300);
                                        }}
                                        disabled={false}
                                    />
                                </FormControl>
                            </FormField>
                        </Box>
                    )}

                    {highestStepReached >= 1 && (
                        <Box
                            className={cn(styles.fieldWrapper, currentStep !== 1 && styles.inactive)}
                            onClick={() => handleFieldClick(1)}
                        >
                            <FormField name="bride-name">
                                <FormLabel className={styles.label}>신부 이름</FormLabel>
                                <FormControl asChild>
                                    <TextField
                                        id="bride-name"
                                        ref={brideNameRef}
                                        value={brideFullName}
                                        readOnly={currentStep !== 1}
                                        variant="surface"
                                        radius="large"
                                        placeholder="신부 성함을 입력해주세요"
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
                                </FormControl>
                            </FormField>
                        </Box>
                    )}

                    <Box
                        className={cn(styles.fieldWrapper, currentStep !== 0 && styles.inactive)}
                        onClick={() => handleFieldClick(0)}
                    >
                        <FormField name="groom-name">
                            <FormLabel className={styles.label}>신랑 이름</FormLabel>
                            <FormControl asChild>
                                <TextField
                                    id="groom-name"
                                    ref={groomNameRef}
                                    value={groomFullName}
                                    readOnly={currentStep !== 0}
                                    variant="surface"
                                    radius="large"
                                    placeholder="신랑 성함을 입력해주세요"
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
                            </FormControl>
                        </FormField>
                    </Box>
                </Form>
            </Card>

            {(currentStep === 3 || isStepValid()) && (
                <Box className={styles.ctaWrapper}>
                    <BottomCTA.Single
                        fixed={true}
                        transparent
                        wrapperClassName={styles.bottomCta}
                        onClick={() => handleNext()}
                        animated={true}
                    >
                        {highestStepReached < 3 ? (
                            <span>다음</span>
                        ) : (
                            <Flex align="center" gap="1">
                                <Sparkles size={16} />
                                <span>시작하기</span>
                            </Flex>
                        )}
                    </BottomCTA.Single>
                </Box>
            )}
        </Box>
    );
};

SetupForm.displayName = "SetupForm";

export { SetupForm };
