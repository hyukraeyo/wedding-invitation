'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Heart, User, ChevronRight, Plus, Check, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DatePicker } from '@/components/common/DatePicker';
import { TimePicker } from '@/components/common/TimePicker';
import { TextField, Button, Dialog, Skeleton } from '@/components/ui';
import { NameField } from '@/components/common/NameField';
import { PhoneField } from '@/components/common/PhoneField/PhoneField';
import { useToast } from '@/hooks/use-toast';
import {
  parseKoreanName,
  cn,
  isValidKoreanNameValue,
  focusMobileInput,
  formatPhoneNumber,
} from '@/lib/utils';
import { useHeaderStore } from '@/store/useHeaderStore';
import { useInvitationStore } from '@/store/useInvitationStore';
import { Stepper } from '@/components/ui/Stepper';
import styles from './SetupForm.module.scss';

const STEPS = [{ label: 'Info' }, { label: 'Date' }, { label: 'Done' }];

const SetupForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { groom, bride, date, time, setGroom, setBride, setDate, setTime, setSlug, reset } =
    useInvitationStore();
  const { resetHeader } = useHeaderStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  // Form State
  const [groomFullName, setGroomFullName] = useState('');
  const [groomRelation, setGroomRelation] = useState('아들');
  const [groomCustomRelation, setGroomCustomRelation] = useState('');
  const [groomPhone, setGroomPhone] = useState('');

  const [brideFullName, setBrideFullName] = useState('');
  const [brideRelation, setBrideRelation] = useState('딸');
  const [brideCustomRelation, setBrideCustomRelation] = useState('');
  const [bridePhone, setBridePhone] = useState('');

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  const groomNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    reset();
    setIsHydrated(true);
    return () => resetHeader();
  }, [reset, resetHeader]);

  const isStepValid = useCallback(() => {
    if (currentStep === 0) {
      return (
        isValidKoreanNameValue(groomFullName) &&
        isValidKoreanNameValue(brideFullName) &&
        !!groomRelation &&
        !!brideRelation
      );
    }
    if (currentStep === 1) {
      return !!date && !!time;
    }
    return false;
  }, [currentStep, groomFullName, brideFullName, groomRelation, brideRelation, date, time]);

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
        relation: groomRelation === 'custom' ? groomCustomRelation : groomRelation,
      });
      setBride({
        lastName: brideNames.lastName,
        firstName: brideNames.firstName,
        relation: brideRelation === 'custom' ? brideCustomRelation : brideRelation,
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

            <form
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

                <div className={styles.fieldGroup}>
                  <div>
                    <div className={styles.fieldLabel}>성함</div>
                    <NameField
                      ref={groomNameRef}
                      variant="outline"
                      radius="full"
                      size="lg"
                      placeholder="Ex. 김토스"
                      value={groomFullName}
                      onValueChange={setGroomFullName}
                    />
                  </div>
                  <div className={styles.fieldRow}>
                    <div>
                      <div className={styles.fieldLabel}>연락처</div>
                      <PhoneField
                        variant="outline"
                        radius="full"
                        size="lg"
                        placeholder="010-1234-5678"
                        value={groomPhone}
                        onChange={(e) => setGroomPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bride Section */}
              <div className={styles.personSection}>
                <div className={styles.sectionHeader}>
                  <div className={cn(styles.iconWrapper, styles.bride)}>
                    <User size={20} fill="currentColor" />
                  </div>
                  <div className={styles.label}>신부</div>
                </div>

                <div className={styles.fieldGroup}>
                  <div>
                    <div className={styles.fieldLabel}>성함</div>
                    <NameField
                      variant="outline"
                      radius="full"
                      size="lg"
                      placeholder="Ex. 이토스"
                      value={brideFullName}
                      onValueChange={setBrideFullName}
                    />
                  </div>
                  <div className={styles.fieldRow}>
                    <div>
                      <div className={styles.fieldLabel}>연락처</div>
                      <PhoneField
                        variant="outline"
                        radius="full"
                        size="lg"
                        placeholder="010-9876-5432"
                        value={bridePhone}
                        onChange={(e) => setBridePhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button className={styles.nextButton} type="submit" disabled={!isStepValid()}>
                <span>Next</span>
                <ChevronRight size={20} />
              </Button>
            </form>
          </>
        ) : (
          <>
            <div className={styles.titleSection}>
              <h1>언제 결혼식을 하나요?</h1>
              <p>예식 날짜와 시간을 선택해주세요.</p>
            </div>

            <form
              className={styles.formSection}
              onSubmit={(e) => {
                e.preventDefault();
                handleNext();
              }}
            >
              <div className={styles.datePickerWrapper}>
                <div className={styles.fieldLabel}>결혼식 날짜</div>
                <DatePicker
                  value={date}
                  onChange={setDate}
                  open={isDatePickerOpen}
                  onOpenChange={setIsDatePickerOpen}
                  variant="outline"
                  radius="full"
                  placeholder="Select Date"
                />
              </div>

              <div className={styles.timePickerWrapper}>
                <div className={styles.fieldLabel}>예식 시간</div>
                <TimePicker
                  value={time}
                  onChange={setTime}
                  open={isTimePickerOpen}
                  onOpenChange={setIsTimePickerOpen}
                  variant="outline"
                  radius="full"
                  placeholder="Select Time"
                />
              </div>

              <Button className={styles.nextButton} type="submit" disabled={!isStepValid()}>
                <span>Let's Start</span>
                <Heart size={20} fill="currentColor" />
              </Button>

              <Button
                variant="ghost"
                type="button"
                onClick={() => setCurrentStep(0)}
                style={{ color: '#94a3b8' }}
              >
                Back to Information
              </Button>
            </form>
          </>
        )}
      </div>

      <button className={styles.parentsButton} type="button">
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
      </button>
    </div>
  );
};

SetupForm.displayName = 'SetupForm';

export { SetupForm };
