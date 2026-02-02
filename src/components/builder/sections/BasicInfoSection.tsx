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
    const groom = useInvitationStore(useShallow(state => state.groom));
    const setGroom = useInvitationStore(state => state.setGroom);
    const bride = useInvitationStore(useShallow(state => state.bride));
    const setBride = useInvitationStore(state => state.setBride);
    const setGroomParents = useInvitationStore(state => state.setGroomParents);
    const setBrideParents = useInvitationStore(state => state.setBrideParents);


    const groomFullName = `${groom.lastName}${groom.firstName}`;
    const brideFullName = `${bride.lastName}${bride.firstName}`;

    const isInvalidName = (value: string) => value.trim().length > 0 && !isValidKoreanNameValue(value);

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
                            <FormLabel className={styles.label} htmlFor="groom-name">
                                신랑
                            </FormLabel>
                            <FormMessage className={styles.message} match="valueMissing">
                                필수 항목입니다.
                            </FormMessage>
                            <FormControl asChild>
                                <NameField
                                    id="groom-name"
                                    type="text"
                                    placeholder="신랑 이름"
                                    required={isRequiredField('groomName')}
                                    value={groomFullName}
                                    onValueChange={(val) => setGroom(parseKoreanName(val))}
                                    allowSpace
                                    allowMiddleDot
                                    allowLatin
                                    invalid={isInvalidName(groomFullName)}
                                />
                            </FormControl>
                        </FormField>
                    </div>

                    {/* Groom Parents */}
                    <div className={cn(styles.row, styles.compact)}>
                        <FormField name="groom-father-name">
                            <FormControl asChild>
                                <NameField
                                    id="groom-father-name"
                                    type="text"
                                    placeholder="아버지 이름"
                                    value={groom.parents.father.name}
                                    onValueChange={(val) => setGroomParents('father', { name: val })}
                                    allowSpace
                                    allowMiddleDot
                                    allowLatin
                                    className={styles.parentInput}
                                    invalid={isInvalidName(groom.parents.father.name)}
                                    aria-label="신랑 아버지 이름"
                                />
                            </FormControl>
                        </FormField>
                        <div className={styles.actionGroup}>
                            <Toggle
                                pressed={groom.parents.father.isDeceased}
                                onPressedChange={(pressed) => setGroomParents('father', { isDeceased: pressed })}
                                className={styles.deceasedButton}
                            >
                                故
                            </Toggle>
                        </div>
                    </div>
                    <div className={cn(styles.row, styles.compact)}>
                        <FormField name="groom-mother-name">
                            <FormControl asChild>
                                <NameField
                                    id="groom-mother-name"
                                    type="text"
                                    placeholder="어머니 이름"
                                    value={groom.parents.mother.name}
                                    onValueChange={(val) => setGroomParents('mother', { name: val })}
                                    allowSpace
                                    allowMiddleDot
                                    allowLatin
                                    className={styles.parentInput}
                                    invalid={isInvalidName(groom.parents.mother.name)}
                                    aria-label="신랑 어머니 이름"
                                />
                            </FormControl>
                        </FormField>
                        <div className={styles.actionGroup}>
                            <Toggle
                                pressed={groom.parents.mother.isDeceased}
                                onPressedChange={(pressed) => setGroomParents('mother', { isDeceased: pressed })}
                                className={styles.deceasedButton}
                            >
                                故
                            </Toggle>
                        </div>
                    </div>
                </div>

                <div className={styles.divider} />

                <div className={styles.formGroup}>
                    <div className={cn(styles.row, styles.full)}>
                        <FormField name="bride-name">
                            <FormLabel className={styles.label} htmlFor="bride-name">
                                신부
                            </FormLabel>
                            <FormMessage className={styles.message} match="valueMissing">
                                필수 항목입니다.
                            </FormMessage>
                            <FormControl asChild>
                                <NameField
                                    id="bride-name"
                                    type="text"
                                    placeholder="신부 이름"
                                    required={isRequiredField('brideName')}
                                    value={brideFullName}
                                    onValueChange={(val) => setBride(parseKoreanName(val))}
                                    allowSpace
                                    allowMiddleDot
                                    allowLatin
                                    invalid={isInvalidName(brideFullName)}
                                />
                            </FormControl>
                        </FormField>
                    </div>

                    {/* Bride Parents */}
                    <div className={cn(styles.row, styles.compact)}>
                        <FormField name="bride-father-name">
                            <FormControl asChild>
                                <NameField
                                    id="bride-father-name"
                                    type="text"
                                    placeholder="아버지 이름"
                                    value={bride.parents.father.name}
                                    onValueChange={(val) => setBrideParents('father', { name: val })}
                                    allowSpace
                                    allowMiddleDot
                                    allowLatin
                                    className={styles.parentInput}
                                    invalid={isInvalidName(bride.parents.father.name)}
                                    aria-label="신부 아버지 이름"
                                />
                            </FormControl>
                        </FormField>
                        <div className={styles.actionGroup}>
                            <Toggle
                                pressed={bride.parents.father.isDeceased}
                                onPressedChange={(pressed) => setBrideParents('father', { isDeceased: pressed })}
                                className={styles.deceasedButton}
                            >
                                故
                            </Toggle>
                        </div>
                    </div>
                    <div className={cn(styles.row, styles.compact)}>
                        <FormField name="bride-mother-name">
                            <FormControl asChild>
                                <NameField
                                    id="bride-mother-name"
                                    type="text"
                                    placeholder="어머니 이름"
                                    value={bride.parents.mother.name}
                                    onValueChange={(val) => setBrideParents('mother', { name: val })}
                                    allowSpace
                                    allowMiddleDot
                                    allowLatin
                                    className={styles.parentInput}
                                    invalid={isInvalidName(bride.parents.mother.name)}
                                    aria-label="신부 어머니 이름"
                                />
                            </FormControl>
                        </FormField>
                        <div className={styles.actionGroup}>
                            <Toggle
                                pressed={bride.parents.mother.isDeceased}
                                onPressedChange={(pressed) => setBrideParents('mother', { isDeceased: pressed })}
                                className={styles.deceasedButton}
                            >
                                故
                            </Toggle>
                        </div>
                    </div>
                </div>
            </div>
        </SectionAccordion>
    );
});

export default BasicInfoSection;
