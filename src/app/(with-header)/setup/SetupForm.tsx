'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { Heart, User, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DatePicker } from '@/components/common/DatePicker';
import { TimePicker } from '@/components/common/TimePicker';
import { TextField, Button, Skeleton } from '@/components/ui';
import {
  Form,
  FormField,
  FormHeader,
  FormLabel,
  FormControl,
  FormMessage,
  FormSubmit,
} from '@/components/ui/Form';
import { useToast } from '@/hooks/use-toast';
import { useNameInput, usePhoneInput } from '@/hooks/useFormInput';
import {
  parseKoreanName,
  cn,
  isValidKoreanNameValue,
  // isValidPhone,
  isInvalidKoreanName,
  isInvalidPhone,
} from '@/lib/utils';
import { useHeaderStore } from '@/store/useHeaderStore';
import { useInvitationStore } from '@/store/useInvitationStore';
import { Stepper } from '@/components/ui/Stepper';
import styles from './SetupForm.module.scss';

const STEPS = [{ label: 'Info' }, { label: 'Date' }, { label: 'Done' }];

/**
 * 커스텀 유효성 검사 함수 (Radix Form match용)
 * 완성되지 않은 자음/모음만 있는 경우 invalid 처리
 */

const SetupForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { date, time, setGroom, setBride, setDate, setTime, setSlug, reset } = useInvitationStore();
  const { resetHeader } = useHeaderStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  // Form State - controlled inputs
  const [groomFullName, setGroomFullName] = useState('');
  const [groomPhone, setGroomPhone] = useState('');
  const [brideFullName, setBrideFullName] = useState('');
  const [bridePhone, setBridePhone] = useState('');

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  const groomNameRef = useRef<HTMLInputElement>(null);

  // 커스텀 훅으로 핸들러 생성
  const handleGroomNameChange = useNameInput(setGroomFullName);
  const handleBrideNameChange = useNameInput(setBrideFullName);
  const handleGroomPhoneChange = usePhoneInput(setGroomPhone);
  const handleBridePhoneChange = usePhoneInput(setBridePhone);

  useEffect(() => {
    reset();
    const timer = setTimeout(() => setIsHydrated(true), 0);
    return () => {
      clearTimeout(timer);
      resetHeader();
    };
  }, [reset, resetHeader]);

  const isStepValid = useCallback(() => {
    if (currentStep === 0) {
      return isValidKoreanNameValue(groomFullName) && isValidKoreanNameValue(brideFullName);
    }
    if (currentStep === 1) {
      return !!date && !!time;
    }
    return false;
  }, [currentStep, groomFullName, brideFullName, date, time]);

  const handleNext = () => {
    if (!isStepValid()) {
      toast({
        variant: 'destructive',
        description: '정보를 모두 정확하게 입력해주세요.',
      });
      return;
    }

    if (currentStep === 0) {
      const groomNames = parseKoreanName(groomFullName);
      const brideNames = parseKoreanName(brideFullName);

      setGroom({
        lastName: groomNames.lastName,
        firstName: groomNames.firstName,
        relation: '아들',
      });
      setBride({
        lastName: brideNames.lastName,
        firstName: brideNames.firstName,
        relation: '딸',
      });

      setCurrentStep(1);
    } else if (currentStep === 1) {
      const slug = `${groomFullName.trim()}-${Math.random().toString(36).substring(2, 6)}`;
      setSlug(slug);
      router.push(`/builder?onboarding=true`);
    }
  };

  if (!isHydrated) {
    return (
      <div className={styles.container}>
        <Skeleton className={styles.mainCard} style={{ height: '400px' }} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.stepperContainer}>
        <Stepper steps={STEPS} currentStep={currentStep} />
      </div>

      <div className={styles.mainCard}>
        {currentStep === 0 ? (
          <>
            <div className={styles.titleSection}>
              <h1>누구의 결혼식인가요?</h1>
              <p>신랑, 신부님의 정보를 입력해주세요.</p>
            </div>

            <Form
              className={styles.formSection}
              onSubmit={(e) => {
                e.preventDefault();
                handleNext();
              }}
            >
              {/* Groom Section */}
              <div className={styles.personSection}>
                <div className={styles.sectionHeader}>
                  <div className={cn(styles.iconWrapper, styles.groom)}>
                    <User size={20} fill="currentColor" />
                  </div>
                  <div className={styles.label}>신랑</div>
                </div>

                <FormField name="groomName">
                  <FormHeader>
                    <FormLabel>성함</FormLabel>
                    <FormMessage match="valueMissing">이름을 입력해주세요</FormMessage>
                    <FormMessage match={isInvalidKoreanName}>
                      올바른 이름을 입력해주세요
                    </FormMessage>
                  </FormHeader>
                  <FormControl asChild>
                    <TextField
                      ref={groomNameRef}
                      type="text"
                      variant="outline"
                      radius="lg"
                      size="lg"
                      placeholder="Ex. 김토스"
                      value={groomFullName}
                      onChange={handleGroomNameChange}
                      required
                      autoComplete="name"
                      autoCorrect="off"
                      spellCheck={false}
                    />
                  </FormControl>
                </FormField>

                <FormField name="groomPhone">
                  <FormHeader>
                    <FormLabel>연락처</FormLabel>
                    <FormMessage match={isInvalidPhone}>올바른 전화번호를 입력해주세요</FormMessage>
                  </FormHeader>
                  <FormControl asChild>
                    <TextField
                      type="tel"
                      inputMode="numeric"
                      variant="outline"
                      radius="lg"
                      size="lg"
                      placeholder="010-1234-5678"
                      value={groomPhone}
                      onChange={handleGroomPhoneChange}
                    />
                  </FormControl>
                </FormField>
              </div>

              {/* Bride Section */}
              <div className={styles.personSection}>
                <div className={styles.sectionHeader}>
                  <div className={cn(styles.iconWrapper, styles.bride)}>
                    <User size={20} fill="currentColor" />
                  </div>
                  <div className={styles.label}>신부</div>
                </div>

                <FormField name="brideName">
                  <FormHeader>
                    <FormLabel>성함</FormLabel>
                    <FormMessage match="valueMissing">이름을 입력해주세요</FormMessage>
                    <FormMessage match={isInvalidKoreanName}>
                      올바른 이름을 입력해주세요
                    </FormMessage>
                  </FormHeader>
                  <FormControl asChild>
                    <TextField
                      type="text"
                      variant="outline"
                      radius="lg"
                      size="lg"
                      placeholder="Ex. 이토스"
                      value={brideFullName}
                      onChange={handleBrideNameChange}
                      required
                      autoComplete="name"
                      autoCorrect="off"
                      spellCheck={false}
                    />
                  </FormControl>
                </FormField>

                <FormField name="bridePhone">
                  <FormHeader>
                    <FormLabel>연락처</FormLabel>
                    <FormMessage match={isInvalidPhone}>올바른 전화번호를 입력해주세요</FormMessage>
                  </FormHeader>
                  <FormControl asChild>
                    <TextField
                      type="tel"
                      inputMode="numeric"
                      variant="outline"
                      radius="lg"
                      size="lg"
                      placeholder="010-9876-5432"
                      value={bridePhone}
                      onChange={handleBridePhoneChange}
                    />
                  </FormControl>
                </FormField>
              </div>

              <FormSubmit asChild>
                <Button className={styles.nextButton} disabled={!isStepValid()} radius="lg">
                  다음
                </Button>
              </FormSubmit>
            </Form>
          </>
        ) : (
          <>
            <div className={styles.titleSection}>
              <h1>언제 결혼식을 하나요?</h1>
              <p>예식 날짜와 시간을 선택해주세요.</p>
            </div>

            <Form
              className={styles.formSection}
              onSubmit={(e) => {
                e.preventDefault();
                handleNext();
              }}
            >
              <FormField name="weddingDate">
                <FormHeader>
                  <FormLabel>결혼식 날짜</FormLabel>
                  <FormMessage match="valueMissing">날짜를 선택해주세요</FormMessage>
                </FormHeader>
                <DatePicker
                  value={date}
                  onChange={setDate}
                  open={isDatePickerOpen}
                  onOpenChange={setIsDatePickerOpen}
                  variant="outline"
                  radius="lg"
                  placeholder="Select Date"
                />
              </FormField>

              <FormField name="weddingTime">
                <FormHeader>
                  <FormLabel>예식 시간</FormLabel>
                  <FormMessage match="valueMissing">시간을 선택해주세요</FormMessage>
                </FormHeader>
                <TimePicker
                  value={time}
                  onChange={setTime}
                  open={isTimePickerOpen}
                  onOpenChange={setIsTimePickerOpen}
                  variant="outline"
                  radius="lg"
                  placeholder="Select Time"
                />
              </FormField>

              <FormSubmit asChild>
                <Button className={styles.nextButton} disabled={!isStepValid()}>
                  <span>Let&apos;s Start</span>
                  <Heart size={20} fill="currentColor" />
                </Button>
              </FormSubmit>

              <Button
                variant="ghost"
                type="button"
                onClick={() => setCurrentStep(0)}
                style={{ color: '#94a3b8' }}
              >
                Back to Information
              </Button>
            </Form>
          </>
        )}
      </div>

      <Button unstyled className={styles.parentsButton} type="button">
        <div className={styles.parentsLeft}>
          <div className={styles.iconWrapper}>
            <User size={20} />
          </div>
          <div className={styles.info}>
            <div className={styles.title}>Add Parents Information</div>
            <div className={styles.subtitle}>Optional details for parents</div>
          </div>
        </div>
        <Plus size={20} className={styles.plusIcon} />
      </Button>
    </div>
  );
};

SetupForm.displayName = 'SetupForm';

export { SetupForm };
