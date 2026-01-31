"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useInvitationStore } from '@/store/useInvitationStore';
import { TextField, IconButton, ProgressBar, Heading, Flex, Box, Form, FormField, FormLabel, FormControl } from '@/components/ui';
import { DatePicker } from '@/components/common/DatePicker';
import { TimePicker } from '@/components/common/TimePicker';
import { Sparkles, ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { parseKoreanName, cn } from '@/lib/utils';
import { BottomCTA } from '@/components/ui/BottomCTA';
import styles from './SetupForm.module.scss';

const SetupForm = () => {
    const router = useRouter();
    const store = useInvitationStore();
    const { toast } = useToast();

    const [groomFullName, setGroomFullName] = useState(`${store.groom.lastName}${store.groom.firstName}`);
    const [brideFullName, setBrideFullName] = useState(`${store.bride.lastName}${store.bride.firstName}`);
    const [date, setDate] = useState(store.date);
    const [time, setTime] = useState(store.time);
    const [slug, setSlug] = useState(store.slug);

    // Refs for auto-focus
    const groomNameRef = useRef<HTMLInputElement>(null);
    const brideNameRef = useRef<HTMLInputElement>(null);
    const dateRef = useRef<HTMLButtonElement>(null);
    const timeRef = useRef<HTMLButtonElement>(null);


    const [currentStep, setCurrentStep] = useState(0);
    const [highestStepReached, setHighestStepReached] = useState(() => {
        const hasGroom = !!(store.groom.firstName || store.groom.lastName);
        const hasBride = !!(store.bride.firstName || store.bride.lastName);
        const hasDate = !!store.date;

        if (hasDate) return 3;
        if (hasBride) return 2;
        if (hasGroom) return 1;
        return 0;
    });

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

        toast({
            variant: 'success',
            text: '기본 정보가 설정되었습니다. 빌더로 이동합니다!'
        });
        router.push('/builder?onboarding=true');
    };

    const handleNext = (force = false) => {
        // 마지막 단계인 경우 유효성 검사 및 제출을 handleSubmit에서 처리하도록 함
        if (currentStep === 3) {
            handleSubmit();
            return;
        }

        if (!force && !isStepValid()) return;

        if (currentStep < 3) {
            setCurrentStep(prev => prev + 1);
            setHighestStepReached(prev => Math.max(prev, currentStep + 1));
        }
    };

    const handleBack = () => {
        router.back();
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
                    timeRef.current?.focus();
                    timeRef.current?.click();
                    break;
            }
        };
        const timer = setTimeout(focusInput, 300);
        return () => clearTimeout(timer);
    }, [currentStep]);

    // Dynamic Header Text
    const getHeaderText = () => {
        switch (currentStep) {
            case 0: return { title: "신랑님의 이름을 알려주세요", subtitle: "" };
            case 1: return { title: "신부님의 이름을 알려주세요", subtitle: "" };
            case 2: return { title: "예식 날짜를 알려주세요", subtitle: "" };
            case 3: return { title: "예식 시간을 알려주세요", subtitle: "" };
            default: return { title: "정보를 입력해주세요", subtitle: "" };
        }
    };

    const { title: headerTitle } = getHeaderText();

    const handleFieldClick = (stepIndex: number) => {
        if (currentStep !== stepIndex) {
            setCurrentStep(stepIndex);
        } else {
            // Already active step - boost interaction
            switch (stepIndex) {
                case 0: groomNameRef.current?.focus(); break;
                case 1: brideNameRef.current?.focus(); break;
                case 2: dateRef.current?.click(); break;
                case 3: timeRef.current?.click(); break;
            }
        }
    };

    return (
        <Box className={styles.container}>
            <Box className={styles.whiteBox}>
                <Box as="header" className={styles.formHeader}>
                    <Flex align="center" className={styles.headerTop}>
                        <IconButton
                            onClick={handleBack}
                            variant="clear"
                            aria-label="뒤로가기"
                            name=""
                            iconSize={24}
                            className={styles.backButton}
                        >
                            <ChevronLeft size={24} />
                        </IconButton>
                        <span className={styles.mainTitle}>청첩장 시작하기</span>
                        <Box className={styles.headerSpacer} />
                    </Flex>

                    <Box className={styles.progressBarWrapper}>
                        <ProgressBar value={progress} />
                    </Box>

                    <Box key={currentStep} className={cn(styles.headerContent, styles.titleUpdate)}>
                        <Heading as="h1" size="8" weight="bold" className={styles.stepHeading}>
                            {headerTitle}
                        </Heading>
                    </Box>
                </Box>

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

            </Box>

            {(currentStep === 3 || isStepValid()) && (
                <Box className={styles.ctaWrapper}>
                    <BottomCTA.Single
                        fixed={false}
                        transparent
                        onClick={() => handleNext()}
                    >
                        {currentStep < 3 ? (
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
        </Box >
    );
};

SetupForm.displayName = "SetupForm";

export { SetupForm };
