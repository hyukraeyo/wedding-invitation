import * as React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { SectionAccordion } from '@/components/ui/Accordion';
import { FormControl, FormField, FormLabel, FormMessage } from '@/components/ui/Form';
import { NameField } from '@/components/common/NameField';
import { Toggle } from '@/components/ui/Toggle';
import { isRequiredField } from '@/constants/requiredFields';
import { cn, parseKoreanName, isValidKoreanNameValue } from '@/lib/utils';
import { useInvitationStore } from '@/store/useInvitationStore';
import styles from './BasicInfoSection.module.scss';
import type { SectionProps } from '@/types/builder';

const BasicInfoSection = React.memo<SectionProps>(function BasicInfoSection(props) {
  const groom = useInvitationStore(useShallow((state) => state.groom));
  const setGroom = useInvitationStore((state) => state.setGroom);
  const bride = useInvitationStore(useShallow((state) => state.bride));
  const setBride = useInvitationStore((state) => state.setBride);
  const setGroomParents = useInvitationStore((state) => state.setGroomParents);
  const setBrideParents = useInvitationStore((state) => state.setBrideParents);

  const groomFullName = `${groom.lastName}${groom.firstName}`;
  const brideFullName = `${bride.lastName}${bride.firstName}`;

  const isInvalidName = (value: string) =>
    value.trim().length > 0 && !isValidKoreanNameValue(value);

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
                <NameField
                  id="groom-name"
                  type="text"
                  placeholder=""
                  required={isRequiredField('groomName')}
                  value={groomFullName}
                  onValueChange={(val) => setGroom(parseKoreanName(val))}
                  allowSpace
                  allowMiddleDot
                  allowLatin
                  invalid={isInvalidName(groomFullName)}
                />
              </FormControl>
              <FormMessage match="valueMissing">필수 항목이에요.</FormMessage>
            </FormField>
          </div>

          {/* Groom Parents */}
          <div className={cn(styles.row, styles.compact)}>
            <FormField name="groom-father-name">
              <FormLabel htmlFor="groom-father-name">아버지</FormLabel>
              <div className={styles.fieldWrapper}>
                <FormControl asChild>
                  <NameField
                    id="groom-father-name"
                    type="text"
                    placeholder=""
                    value={groom.parents.father.name}
                    onValueChange={(val) => setGroomParents('father', { name: val })}
                    allowSpace
                    allowMiddleDot
                    allowLatin
                    invalid={isInvalidName(groom.parents.father.name)}
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
            </FormField>
          </div>
          <div className={cn(styles.row, styles.compact)}>
            <FormField name="groom-mother-name">
              <FormLabel htmlFor="groom-mother-name">어머니</FormLabel>
              <div className={styles.fieldWrapper}>
                <FormControl asChild>
                  <NameField
                    id="groom-mother-name"
                    type="text"
                    placeholder=""
                    value={groom.parents.mother.name}
                    onValueChange={(val) => setGroomParents('mother', { name: val })}
                    allowSpace
                    allowMiddleDot
                    allowLatin
                    invalid={isInvalidName(groom.parents.mother.name)}
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
            </FormField>
          </div>
        </div>
        <div className={styles.formGroup}>
          <div className={cn(styles.row, styles.full)}>
            <FormField name="bride-name">
              <FormLabel htmlFor="bride-name">신부</FormLabel>
              <FormControl asChild>
                <NameField
                  id="bride-name"
                  type="text"
                  placeholder=""
                  required={isRequiredField('brideName')}
                  value={brideFullName}
                  onValueChange={(val) => setBride(parseKoreanName(val))}
                  allowSpace
                  allowMiddleDot
                  allowLatin
                  invalid={isInvalidName(brideFullName)}
                />
              </FormControl>
              <FormMessage match="valueMissing">필수 항목이에요.</FormMessage>
            </FormField>
          </div>

          {/* Bride Parents */}
          <div className={cn(styles.row, styles.compact)}>
            <FormField name="bride-father-name">
              <FormLabel htmlFor="bride-father-name">아버지</FormLabel>
              <div className={styles.fieldWrapper}>
                <FormControl asChild>
                  <NameField
                    id="bride-father-name"
                    type="text"
                    placeholder=""
                    value={bride.parents.father.name}
                    onValueChange={(val) => setBrideParents('father', { name: val })}
                    allowSpace
                    allowMiddleDot
                    allowLatin
                    invalid={isInvalidName(bride.parents.father.name)}
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
            </FormField>
          </div>
          <div className={cn(styles.row, styles.compact)}>
            <FormField name="bride-mother-name">
              <FormLabel htmlFor="bride-mother-name">어머니</FormLabel>
              <div className={styles.fieldWrapper}>
                <FormControl asChild>
                  <NameField
                    id="bride-mother-name"
                    type="text"
                    placeholder=""
                    value={bride.parents.mother.name}
                    onValueChange={(val) => setBrideParents('mother', { name: val })}
                    allowSpace
                    allowMiddleDot
                    allowLatin
                    invalid={isInvalidName(bride.parents.mother.name)}
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
            </FormField>
          </div>
        </div>
      </div>
    </SectionAccordion>
  );
});

export default BasicInfoSection;
