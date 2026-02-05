import * as React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { SectionAccordion } from '@/components/ui/Accordion';
import { FormControl, FormField, FormLabel, FormMessage } from '@/components/ui/Form';
import { TextField } from '@/components/ui';
import { Toggle } from '@/components/ui/Toggle';
import { isRequiredField } from '@/constants/requiredFields';
import { cn, parseKoreanName, isValidKoreanNameValue } from '@/lib/utils';
import { useInvitationStore } from '@/store/useInvitationStore';
import styles from './BasicInfoSection.module.scss';
import type { SectionProps } from '@/types/builder';

/**
 * 한글 이름 입력 정제 함수
 * 한글(완성형+자모), 영문, 공백, 가운뎃점 허용
 */
const sanitizeNameInput = (value: string): string => {
  return value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z\s·]/g, '');
};

/**
 * 커스텀 유효성 검사 함수 (Radix Form match용)
 */
const validateKoreanName = (value: string): boolean => {
  if (!value.trim()) return false; // 빈 값은 valueMissing으로 처리
  return !isValidKoreanNameValue(value); // true면 에러 표시
};

const BasicInfoSection = React.memo<SectionProps>(function BasicInfoSection(props) {
  const groom = useInvitationStore(useShallow((state) => state.groom));
  const setGroom = useInvitationStore((state) => state.setGroom);
  const bride = useInvitationStore(useShallow((state) => state.bride));
  const setBride = useInvitationStore((state) => state.setBride);
  const setGroomParents = useInvitationStore((state) => state.setGroomParents);
  const setBrideParents = useInvitationStore((state) => state.setBrideParents);

  const groomFullName = `${groom.lastName}${groom.firstName}`;
  const brideFullName = `${bride.lastName}${bride.firstName}`;

  // 이름 입력 핸들러
  const handleGroomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeNameInput(e.target.value);
    setGroom(parseKoreanName(sanitized));
  };

  const handleBrideNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeNameInput(e.target.value);
    setBride(parseKoreanName(sanitized));
  };

  const handleGroomFatherNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeNameInput(e.target.value);
    setGroomParents('father', { name: sanitized });
  };

  const handleGroomMotherNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeNameInput(e.target.value);
    setGroomParents('mother', { name: sanitized });
  };

  const handleBrideFatherNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeNameInput(e.target.value);
    setBrideParents('father', { name: sanitized });
  };

  const handleBrideMotherNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeNameInput(e.target.value);
    setBrideParents('mother', { name: sanitized });
  };

  return (
    <SectionAccordion
      title="기본 정보"
      value="basic-info"
      isOpen={props.isOpen}
      onToggle={props.onToggle}
    >
      <div className={styles.container}>
        {/* Groom Section */}
        <div className={styles.formGroup}>
          <div className={cn(styles.row, styles.full)}>
            <FormField name="groom-name">
              <FormLabel htmlFor="groom-name">신랑</FormLabel>
              <FormControl asChild>
                <TextField
                  id="groom-name"
                  type="text"
                  placeholder=""
                  required={isRequiredField('groomName')}
                  value={groomFullName}
                  onChange={handleGroomNameChange}
                  autoComplete="name"
                  autoCorrect="off"
                  spellCheck={false}
                />
              </FormControl>
              <FormMessage match="valueMissing">필수 항목이에요.</FormMessage>
              <FormMessage match={validateKoreanName}>올바른 이름을 입력해주세요</FormMessage>
            </FormField>
          </div>

          {/* Groom Parents */}
          <div className={cn(styles.row, styles.compact)}>
            <FormField name="groom-father-name">
              <FormLabel htmlFor="groom-father-name">아버지</FormLabel>
              <div className={styles.fieldWrapper}>
                <FormControl asChild>
                  <TextField
                    id="groom-father-name"
                    type="text"
                    placeholder=""
                    value={groom.parents.father.name}
                    onChange={handleGroomFatherNameChange}
                    autoComplete="name"
                    autoCorrect="off"
                    spellCheck={false}
                    aria-label="신랑 아버지 이름"
                  />
                </FormControl>
                <div className={styles.actionGroup}>
                  <Toggle
                    pressed={groom.parents.father.isDeceased}
                    onPressedChange={(pressed) =>
                      setGroomParents('father', { isDeceased: pressed })
                    }
                    className={styles.deceasedButton}
                  >
                    故
                  </Toggle>
                </div>
              </div>
              <FormMessage match={validateKoreanName}>올바른 이름을 입력해주세요</FormMessage>
            </FormField>
          </div>
          <div className={cn(styles.row, styles.compact)}>
            <FormField name="groom-mother-name">
              <FormLabel htmlFor="groom-mother-name">어머니</FormLabel>
              <div className={styles.fieldWrapper}>
                <FormControl asChild>
                  <TextField
                    id="groom-mother-name"
                    type="text"
                    placeholder=""
                    value={groom.parents.mother.name}
                    onChange={handleGroomMotherNameChange}
                    autoComplete="name"
                    autoCorrect="off"
                    spellCheck={false}
                    aria-label="신랑 어머니 이름"
                  />
                </FormControl>
                <div className={styles.actionGroup}>
                  <Toggle
                    pressed={groom.parents.mother.isDeceased}
                    onPressedChange={(pressed) =>
                      setGroomParents('mother', { isDeceased: pressed })
                    }
                    className={styles.deceasedButton}
                  >
                    故
                  </Toggle>
                </div>
              </div>
              <FormMessage match={validateKoreanName}>올바른 이름을 입력해주세요</FormMessage>
            </FormField>
          </div>
        </div>
        <div className={styles.formGroup}>
          <div className={cn(styles.row, styles.full)}>
            <FormField name="bride-name">
              <FormLabel htmlFor="bride-name">신부</FormLabel>
              <FormControl asChild>
                <TextField
                  id="bride-name"
                  type="text"
                  placeholder=""
                  required={isRequiredField('brideName')}
                  value={brideFullName}
                  onChange={handleBrideNameChange}
                  autoComplete="name"
                  autoCorrect="off"
                  spellCheck={false}
                />
              </FormControl>
              <FormMessage match="valueMissing">필수 항목이에요.</FormMessage>
              <FormMessage match={validateKoreanName}>올바른 이름을 입력해주세요</FormMessage>
            </FormField>
          </div>

          {/* Bride Parents */}
          <div className={cn(styles.row, styles.compact)}>
            <FormField name="bride-father-name">
              <FormLabel htmlFor="bride-father-name">아버지</FormLabel>
              <div className={styles.fieldWrapper}>
                <FormControl asChild>
                  <TextField
                    id="bride-father-name"
                    type="text"
                    placeholder=""
                    value={bride.parents.father.name}
                    onChange={handleBrideFatherNameChange}
                    autoComplete="name"
                    autoCorrect="off"
                    spellCheck={false}
                    aria-label="신부 아버지 이름"
                  />
                </FormControl>
                <div className={styles.actionGroup}>
                  <Toggle
                    pressed={bride.parents.father.isDeceased}
                    onPressedChange={(pressed) =>
                      setBrideParents('father', { isDeceased: pressed })
                    }
                    className={styles.deceasedButton}
                  >
                    故
                  </Toggle>
                </div>
              </div>
              <FormMessage match={validateKoreanName}>올바른 이름을 입력해주세요</FormMessage>
            </FormField>
          </div>
          <div className={cn(styles.row, styles.compact)}>
            <FormField name="bride-mother-name">
              <FormLabel htmlFor="bride-mother-name">어머니</FormLabel>
              <div className={styles.fieldWrapper}>
                <FormControl asChild>
                  <TextField
                    id="bride-mother-name"
                    type="text"
                    placeholder=""
                    value={bride.parents.mother.name}
                    onChange={handleBrideMotherNameChange}
                    autoComplete="name"
                    autoCorrect="off"
                    spellCheck={false}
                    aria-label="신부 어머니 이름"
                  />
                </FormControl>
                <div className={styles.actionGroup}>
                  <Toggle
                    pressed={bride.parents.mother.isDeceased}
                    onPressedChange={(pressed) =>
                      setBrideParents('mother', { isDeceased: pressed })
                    }
                    className={styles.deceasedButton}
                  >
                    故
                  </Toggle>
                </div>
              </div>
              <FormMessage match={validateKoreanName}>올바른 이름을 입력해주세요</FormMessage>
            </FormField>
          </div>
        </div>
      </div>
    </SectionAccordion>
  );
});

export default BasicInfoSection;
