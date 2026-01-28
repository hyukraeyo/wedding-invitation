"use client";

import React, { useState, useRef } from 'react';
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

const SetupForm = () => {
    const router = useRouter();
    const store = useInvitationStore();

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

    const isFormValid = !!(groomFullName && brideFullName && date && time && slug);

    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;

    // Progress Calculation
    const fields = [groomFullName, brideFullName, date, time, slug];
    const completedFields = fields.filter(f => !!f).length;
    const progress = (completedFields / fields.length) * 100;

    // Focus Handlers
    const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLElement | null>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            nextRef.current?.focus();
            // If it's a date/time picker, we might need to click it to open
            if (nextRef === dateRef) {
                nextRef.current?.click();
            } else if (nextRef === timeRef) {
                // Focus first button in TimePicker
                nextRef.current?.querySelector('button')?.focus();
                nextRef.current?.querySelector('button')?.click();
            }
        }
    };

    const nextStep = () => {
        if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const isStep1Valid = !!(groomFullName && brideFullName);
    const isStep2Valid = !!(date && time);

    return (
        <div className={styles.stepperContainer}>
            <div className={styles.headerArea}>
                <div className={styles.progressHeader}>
                    <div className={styles.progressInfo}>
                        <span className={styles.stepIndicator}>Step {currentStep} / {totalSteps}</span>
                        <span className={styles.percent}>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className={styles.progressBar} />
                </div>
                <div className={styles.stepTitleArea}>
                    <h2 className={styles.stepTitle}>
                        {currentStep === 1 && "성함을 입력해주세요"}
                        {currentStep === 2 && "예식 일시를 알려주세요"}
                        {currentStep === 3 && "나만의 주소를 만드세요"}
                    </h2>
                    <p className={styles.stepSubtitle}>
                        {currentStep === 1 && "신랑, 신부님의 전체 성함을 입력해주세요."}
                        {currentStep === 2 && "결혼식 날짜와 시간을 선택해주세요."}
                        {currentStep === 3 && "청첩장 접속에 사용될 URL 경로입니다."}
                    </p>
                </div>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.viewport}>
                    <div className={styles.stepsWrapper} style={{ transform: `translateX(-${(currentStep - 1) * 100}%)` }}>
                        {/* Step 1: Names */}
                        <div className={styles.step}>
                            <section className={styles.section}>
                                <div className={styles.grid}>
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
                                    <div className={styles.inputGroup}>
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
                                            onKeyDown={(e) => handleKeyDown(e, dateRef)}
                                            required
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Step 2: Date & Time */}
                        <div className={styles.step}>
                            <section className={styles.section}>
                                <div className={styles.grid}>
                                    <div className={styles.inputGroup}>
                                        <Label htmlFor="wedding-date">날짜</Label>
                                        <DatePicker
                                            id="wedding-date"
                                            ref={dateRef}
                                            value={date}
                                            onChange={setDate}
                                            onComplete={() => {
                                                timeRef.current?.querySelector('button')?.focus();
                                                timeRef.current?.querySelector('button')?.click();
                                            }}
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <Label htmlFor="wedding-time">시간</Label>
                                        <TimePicker
                                            id="wedding-time"
                                            ref={timeRef}
                                            value={time}
                                            onChange={setTime}
                                            onComplete={() => { }}
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Step 3: Slug */}
                        <div className={styles.step}>
                            <section className={styles.section}>
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
                            </section>
                        </div>
                    </div>
                </div>

                {/* 🍌 Toss-style Bottom CTA */}
                {currentStep === 1 ? (
                    <BottomCTA.Single
                        buttonProps={{
                            children: (
                                <>
                                    다음 항목으로 <ArrowRight size={18} />
                                </>
                            ),
                            onClick: nextStep,
                            disabled: !isStep1Valid,
                            type: 'button'
                        }}
                    />
                ) : (
                    <BottomCTA.Double
                        secondaryButtonProps={{
                            children: '이전',
                            onClick: prevStep,
                            type: 'button'
                        }}
                        primaryButtonProps={{
                            children: currentStep < totalSteps ? (
                                <>
                                    다음 항목으로 <ArrowRight size={18} />
                                </>
                            ) : (
                                <>
                                    <Sparkles size={18} />
                                    <span>청첩장 만들기 시작</span>
                                    <ArrowRight size={20} />
                                </>
                            ),
                            onClick: currentStep < totalSteps ? nextStep : undefined,
                            disabled: currentStep < totalSteps ? !isStep2Valid : !isFormValid,
                            type: currentStep < totalSteps ? 'button' : 'submit'
                        }}
                    />
                )}
            </form>
        </div>
    );
};

SetupForm.displayName = "SetupForm";

export { SetupForm };
