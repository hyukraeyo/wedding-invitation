import * as React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { SectionAccordion } from '@/components/ui/Accordion';
import { RequiredSectionTitle } from '@/components/common/RequiredSectionTitle';
import { FormControl, FormField, FormHeader, FormLabel, FormMessage } from '@/components/ui/Form';
import { TextField } from '@/components/ui/TextField';
import { Toggle } from '@/components/ui/Toggle';
import { ChrysanthemumSVG } from '@/components/common/Icons';
import { isRequiredField } from '@/constants/requiredFields';
import { parseKoreanName, isInvalidKoreanName } from '@/lib/utils';
import { useInvitationStore } from '@/store/useInvitationStore';
import { sanitizeNameInput } from '@/hooks/useFormInput';
import type { SectionProps } from '@/types/builder';

const BasicInfoSection = React.memo<SectionProps>(function BasicInfoSection(props) {
  const groom = useInvitationStore((state) => state.groom);
  const bride = useInvitationStore((state) => state.bride);
  const validationErrors = useInvitationStore((state) => state.validationErrors);
  const setGroom = useInvitationStore((state) => state.setGroom);
  const setBride = useInvitationStore((state) => state.setBride);
  const setGroomParents = useInvitationStore((state) => state.setGroomParents);
  const setBrideParents = useInvitationStore((state) => state.setBrideParents);

  const groomFullName = `${groom.lastName}${groom.firstName}`;
  const brideFullName = `${bride.lastName}${bride.firstName}`;
  const isComplete = Boolean(groomFullName.trim() && brideFullName.trim());
  const isInvalid = validationErrors.includes(props.value);

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
      title={<RequiredSectionTitle title="기본 정보" isComplete={isComplete} />}
      value={props.value}
      isOpen={props.isOpen}
      onToggle={props.onToggle}
      isInvalid={isInvalid}
    >
      <FormField name="groom-name">
        <FormHeader>
          <FormLabel htmlFor="groom-name">신랑</FormLabel>
          <FormMessage match="valueMissing">필수 항목이에요.</FormMessage>
          <FormMessage match={isInvalidKoreanName}>올바른 이름을 입력해주세요</FormMessage>
        </FormHeader>
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
      </FormField>
      <FormField name="groom-father-name">
        <FormHeader>
          <FormLabel htmlFor="groom-father-name">아버지</FormLabel>
          <FormMessage match={isInvalidKoreanName}>올바른 이름을 입력해주세요</FormMessage>
        </FormHeader>
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
            rightSlot={
              <Toggle
                size="sm"
                variant="unstyled"
                accentColorOnly
                pressed={groom.parents.father.isDeceased}
                onPressedChange={(pressed) => setGroomParents('father', { isDeceased: pressed })}
                aria-label="고인 여부 토글"
              >
                <ChrysanthemumSVG size={18} />
              </Toggle>
            }
          />
        </FormControl>
      </FormField>
      <FormField name="groom-mother-name">
        <FormHeader>
          <FormLabel htmlFor="groom-mother-name">어머니</FormLabel>
          <FormMessage match={isInvalidKoreanName}>올바른 이름을 입력해주세요</FormMessage>
        </FormHeader>

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
            rightSlot={
              <Toggle
                size="sm"
                variant="unstyled"
                accentColorOnly
                pressed={groom.parents.mother.isDeceased}
                onPressedChange={(pressed) => setGroomParents('mother', { isDeceased: pressed })}
                aria-label="고인 여부 토글"
              >
                <ChrysanthemumSVG size={18} />
              </Toggle>
            }
          />
        </FormControl>
      </FormField>
      <FormField name="bride-name">
        <FormHeader>
          <FormLabel htmlFor="bride-name">신부</FormLabel>
          <FormMessage match="valueMissing">필수 항목이에요.</FormMessage>
          <FormMessage match={isInvalidKoreanName}>올바른 이름을 입력해주세요</FormMessage>
        </FormHeader>
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
      </FormField>
      <FormField name="bride-father-name">
        <FormHeader>
          <FormLabel htmlFor="bride-father-name">아버지</FormLabel>
          <FormMessage match={isInvalidKoreanName}>올바른 이름을 입력해주세요</FormMessage>
        </FormHeader>
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
            rightSlot={
              <Toggle
                size="sm"
                variant="unstyled"
                accentColorOnly
                pressed={bride.parents.father.isDeceased}
                onPressedChange={(pressed) => setBrideParents('father', { isDeceased: pressed })}
                aria-label="고인 여부 토글"
              >
                <ChrysanthemumSVG size={18} />
              </Toggle>
            }
          />
        </FormControl>
      </FormField>
      <FormField name="bride-mother-name">
        <FormHeader>
          <FormLabel htmlFor="bride-mother-name">어머니</FormLabel>
          <FormMessage match={isInvalidKoreanName}>올바른 이름을 입력해주세요</FormMessage>
        </FormHeader>
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
            rightSlot={
              <Toggle
                size="sm"
                variant="unstyled"
                accentColorOnly
                pressed={bride.parents.mother.isDeceased}
                onPressedChange={(pressed) => setBrideParents('mother', { isDeceased: pressed })}
                aria-label="고인 여부 토글"
              >
                <ChrysanthemumSVG size={18} />
              </Toggle>
            }
          />
        </FormControl>
      </FormField>
    </SectionAccordion>
  );
});

export default BasicInfoSection;
