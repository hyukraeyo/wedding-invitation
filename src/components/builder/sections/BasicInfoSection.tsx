import React, { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { RequiredSectionTitle } from '@/components/common/RequiredSectionTitle';
import { SectionAccordion } from '@/components/ui/Accordion';
import { FormControl, FormField, FormHeader, FormLabel, FormMessage } from '@/components/ui/Form';
import { TextField } from '@/components/ui/TextField';
import { useInvitationStore } from '@/store/useInvitationStore';
import { isRequiredField } from '@/constants/requiredFields';
import { parseKoreanName, isBlank, isInvalidKoreanName, isValidName } from '@/lib/utils';
import { sanitizeNameInput } from '@/hooks/useFormInput';
import { useBuilderSection, useBuilderField } from '@/hooks/useBuilder';
import type { SectionProps } from '@/types/builder';

const BasicInfoSection = React.memo<SectionProps>(function BasicInfoSection(props) {
  const { groom, bride, setGroom, setBride, setGroomParents, setBrideParents } = useInvitationStore(
    useShallow((state) => ({
      groom: state.groom,
      bride: state.bride,
      setGroom: state.setGroom,
      setBride: state.setBride,
      setGroomParents: state.setGroomParents,
      setBrideParents: state.setBrideParents,
    }))
  );

  const groomFullName = `${groom.lastName}${groom.firstName}`;
  const brideFullName = `${bride.lastName}${bride.firstName}`;
  const isComplete = Boolean(groomFullName.trim() && brideFullName.trim());

  const { isInvalid: isSectionInvalid, clearError: clearSectionError } = useBuilderSection(
    props.value
  );

  useEffect(() => {
    if (isSectionInvalid) {
      const isGroomValid = isValidName(groomFullName);
      const isBrideValid = isValidName(brideFullName);

      if (isGroomValid && isBrideValid) {
        clearSectionError();
      }
    }
  }, [isSectionInvalid, groomFullName, brideFullName, clearSectionError]);

  // 신랑 이름 필드
  const { onChange: handleGroomNameChange, isInvalid: isGroomNameInvalid } = useBuilderField({
    value: groom, // 값은 실제로 사용되지 않음 (groomFullName 사용)
    onChange: setGroom,
    fieldName: 'groom-name',
    transform: (val) => parseKoreanName(sanitizeNameInput(val)),
  });

  // 신부 이름 필드
  const { onChange: handleBrideNameChange, isInvalid: isBrideNameInvalid } = useBuilderField({
    value: bride,
    onChange: setBride,
    fieldName: 'bride-name',
    transform: (val) => parseKoreanName(sanitizeNameInput(val)),
  });

  // 부모님 이름 핸들러 (Validation 불필요로 훅 미사용)
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
      isInvalid={isSectionInvalid}
    >
      <FormField name="groom-name">
        <FormHeader>
          <FormLabel htmlFor="groom-name">신랑</FormLabel>
          {(isGroomNameInvalid || isInvalidKoreanName(groomFullName)) && (
            <FormMessage forceMatch>
              {isBlank(groomFullName) ? '필수 항목이에요.' : '올바른 형식으로 입력해주세요.'}
            </FormMessage>
          )}
        </FormHeader>
        <FormControl asChild>
          <TextField
            id="groom-name"
            placeholder="이름"
            required={isRequiredField('groomName')}
            value={groomFullName}
            onChange={handleGroomNameChange}
            invalid={isGroomNameInvalid || isInvalidKoreanName(groomFullName)}
          />
        </FormControl>
      </FormField>

      <FormField name="bride-name">
        <FormHeader>
          <FormLabel htmlFor="bride-name">신부</FormLabel>
          {(isBrideNameInvalid || isInvalidKoreanName(brideFullName)) && (
            <FormMessage forceMatch>
              {isBlank(brideFullName) ? '필수 항목이에요.' : '올바른 형식으로 입력해주세요.'}
            </FormMessage>
          )}
        </FormHeader>
        <FormControl asChild>
          <TextField
            id="bride-name"
            placeholder="이름"
            required={isRequiredField('brideName')}
            value={brideFullName}
            onChange={handleBrideNameChange}
            invalid={isBrideNameInvalid || isInvalidKoreanName(brideFullName)}
          />
        </FormControl>
      </FormField>

      <FormField name="groom-parents">
        <FormHeader>
          <FormLabel>신랑 혼주</FormLabel>
        </FormHeader>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <FormControl asChild>
            <TextField
              placeholder="아버지 이름"
              value={groom.parents.father.name}
              onChange={handleGroomFatherNameChange}
            />
          </FormControl>
          <FormControl asChild>
            <TextField
              placeholder="어머니 이름"
              value={groom.parents.mother.name}
              onChange={handleGroomMotherNameChange}
            />
          </FormControl>
        </div>
      </FormField>

      <FormField name="bride-parents">
        <FormHeader>
          <FormLabel>신부 혼주</FormLabel>
        </FormHeader>
        <div style={{ display: 'flex', gap: '8px' }}>
          <FormControl asChild>
            <TextField
              placeholder="아버지 이름"
              value={bride.parents.father.name}
              onChange={handleBrideFatherNameChange}
            />
          </FormControl>
          <FormControl asChild>
            <TextField
              placeholder="어머니 이름"
              value={bride.parents.mother.name}
              onChange={handleBrideMotherNameChange}
            />
          </FormControl>
        </div>
      </FormField>
    </SectionAccordion>
  );
});

BasicInfoSection.displayName = 'BasicInfoSection';

export default BasicInfoSection;
