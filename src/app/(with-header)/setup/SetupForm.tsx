'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Heart, User, ChevronRight, Plus, Check, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DatePicker } from '@/components/common/DatePicker';
import { TimePicker } from '@/components/common/TimePicker';
import { TextField, Button as UIButton, Dialog, Skeleton } from '@/components/ui';
import { NameField } from '@/components/common/NameField';
import { useToast } from '@/hooks/use-toast';
import { parseKoreanName, cn, isValidKoreanNameValue, focusMobileInput } from '@/lib/utils';
import { useHeaderStore } from '@/store/useHeaderStore';
import { useInvitationStore } from '@/store/useInvitationStore';
import { Stepper } from '@/components/ui/Stepper';
import styles from './SetupForm.module.scss';

const STEPS = [{ label: 'Info' }, { label: 'Date' }, { label: 'Done' }];

const RELATION_OPTIONS = [
  { label: '아들', value: '아들' },
  { label: '장남', value: '장남' },
  { label: '차남', value: '차남' },
  { label: '삼남', value: '삼남' },
  { label: '막내 아들', value: '막내 아들' },
  { label: '딸', value: '딸' },
  { label: '장녀', value: '장녀' },
  { label: '차녀', value: '차녀' },
  { label: '삼녀', value: '삼녀' },
  { label: '막내 딸', value: '막내 딸' },
  { label: '직접 입력', value: 'custom' },
];

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
              <h1>Who is getting married?</h1>
              <p>Please enter the groom and bride's details.</p>
            </div>

            <div className={styles.formSection}>
              {/* Groom Section */}
              <div className={styles.personSection}>
                <div className={styles.sectionHeader}>
                  <div className={cn(styles.iconWrapper, styles.groom)}>
                    <User size={20} fill="currentColor" />
                  </div>
                  <div className={styles.label}>
                    Groom <span>(신랑)</span>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <div>
                    <div className={styles.fieldLabel}>Full Name</div>
                    <NameField
                      ref={groomNameRef}
                      variant="secondary"
                      radius="full"
                      size="lg"
                      placeholder="Ex. Kim Toss"
                      value={groomFullName}
                      onValueChange={setGroomFullName}
                    />
                  </div>
                  <div className={styles.fieldRow}>
                    <div>
                      <div className={styles.fieldLabel}>Phone Number</div>
                      <TextField
                        variant="secondary"
                        radius="full"
                        size="lg"
                        placeholder="010-1234-5678"
                        value={groomPhone}
                        onChange={(e) => setGroomPhone(e.target.value)}
                      />
                    </div>
                    <div>
                      <div className={styles.fieldLabel}>Relation</div>
                      <Dialog mobileBottomSheet>
                        <Dialog.Trigger asChild>
                          <div style={{ cursor: 'pointer' }}>
                            <TextField.Button
                              variant="secondary"
                              radius="full"
                              size="lg"
                              placeholder="관계 선택"
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  width: '100%',
                                }}
                              >
                                <span>
                                  {groomRelation === 'custom'
                                    ? groomCustomRelation || '직접 입력'
                                    : groomRelation}
                                </span>
                                <ChevronDown size={18} />
                              </div>
                            </TextField.Button>
                          </div>
                        </Dialog.Trigger>
                        <Dialog.Content>
                          <Dialog.Header title="관계 선택" />
                          <Dialog.Body>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {RELATION_OPTIONS.filter(
                                (opt) =>
                                  !['딸', '장녀', '차녀', '삼녀', '막내 딸'].includes(opt.label)
                              ).map((opt) => (
                                <Dialog.Close key={opt.value} asChild>
                                  <UIButton
                                    variant="ghost"
                                    style={{ justifyContent: 'space-between', padding: '16px' }}
                                    onClick={() => setGroomRelation(opt.value)}
                                  >
                                    <span>{opt.label}</span>
                                    {groomRelation === opt.value && (
                                      <Check size={20} color="#3b82f6" />
                                    )}
                                  </UIButton>
                                </Dialog.Close>
                              ))}
                            </div>
                            {groomRelation === 'custom' && (
                              <div style={{ padding: '16px' }}>
                                <TextField
                                  placeholder="직접 입력 (예: 조카)"
                                  value={groomCustomRelation}
                                  onChange={(e) => setGroomCustomRelation(e.target.value)}
                                  autoFocus
                                />
                              </div>
                            )}
                          </Dialog.Body>
                        </Dialog.Content>
                      </Dialog>
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
                  <div className={styles.label}>
                    Bride <span>(신부)</span>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <div>
                    <div className={styles.fieldLabel}>Full Name</div>
                    <NameField
                      variant="secondary"
                      radius="full"
                      size="lg"
                      placeholder="Ex. Lee Apple"
                      value={brideFullName}
                      onValueChange={setBrideFullName}
                    />
                  </div>
                  <div className={styles.fieldRow}>
                    <div>
                      <div className={styles.fieldLabel}>Phone Number</div>
                      <TextField
                        variant="secondary"
                        radius="full"
                        size="lg"
                        placeholder="010-9876-5432"
                        value={bridePhone}
                        onChange={(e) => setBridePhone(e.target.value)}
                      />
                    </div>
                    <div>
                      <div className={styles.fieldLabel}>Relation</div>
                      <Dialog mobileBottomSheet>
                        <Dialog.Trigger asChild>
                          <div style={{ cursor: 'pointer' }}>
                            <TextField.Button
                              variant="secondary"
                              radius="full"
                              size="lg"
                              placeholder="관계 선택"
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  width: '100%',
                                }}
                              >
                                <span>
                                  {brideRelation === 'custom'
                                    ? brideCustomRelation || '직접 입력'
                                    : brideRelation}
                                </span>
                                <ChevronDown size={18} />
                              </div>
                            </TextField.Button>
                          </div>
                        </Dialog.Trigger>
                        <Dialog.Content>
                          <Dialog.Header title="관계 선택" />
                          <Dialog.Body>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {RELATION_OPTIONS.filter(
                                (opt) =>
                                  !['아들', '장남', '차남', '삼남', '막내 아들'].includes(opt.label)
                              ).map((opt) => (
                                <Dialog.Close key={opt.value} asChild>
                                  <UIButton
                                    variant="ghost"
                                    style={{ justifyContent: 'space-between', padding: '16px' }}
                                    onClick={() => setBrideRelation(opt.value)}
                                  >
                                    <span>{opt.label}</span>
                                    {brideRelation === opt.value && (
                                      <Check size={20} color="#f43f5e" />
                                    )}
                                  </UIButton>
                                </Dialog.Close>
                              ))}
                            </div>
                            {brideRelation === 'custom' && (
                              <div style={{ padding: '16px' }}>
                                <TextField
                                  placeholder="직접 입력 (예: 조카)"
                                  value={brideCustomRelation}
                                  onChange={(e) => setBrideCustomRelation(e.target.value)}
                                  autoFocus
                                />
                              </div>
                            )}
                          </Dialog.Body>
                        </Dialog.Content>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </div>

              <UIButton
                className={styles.nextButton}
                onClick={handleNext}
                disabled={!isStepValid()}
              >
                <span>Next</span>
                <ChevronRight size={20} />
              </UIButton>
            </div>
          </>
        ) : (
          <>
            <div className={styles.titleSection}>
              <h1>When is the wedding?</h1>
              <p>Please select the date and time of your ceremony.</p>
            </div>

            <div className={styles.formSection}>
              <div className={styles.datePickerWrapper}>
                <div className={styles.fieldLabel}>Wedding Date</div>
                <DatePicker
                  value={date}
                  onChange={setDate}
                  open={isDatePickerOpen}
                  onOpenChange={setIsDatePickerOpen}
                  variant="secondary"
                  radius="full"
                  placeholder="Select Date"
                />
              </div>

              <div className={styles.timePickerWrapper}>
                <div className={styles.fieldLabel}>Wedding Time</div>
                <TimePicker
                  value={time}
                  onChange={setTime}
                  open={isTimePickerOpen}
                  onOpenChange={setIsTimePickerOpen}
                  variant="secondary"
                  radius="full"
                  placeholder="Select Time"
                />
              </div>

              <UIButton
                className={styles.nextButton}
                onClick={handleNext}
                disabled={!isStepValid()}
              >
                <span>Let's Start</span>
                <Heart size={20} fill="currentColor" />
              </UIButton>

              <UIButton
                variant="ghost"
                onClick={() => setCurrentStep(0)}
                style={{ color: '#94a3b8' }}
              >
                Back to Information
              </UIButton>
            </div>
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
