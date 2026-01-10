import React from 'react';
import { User2 } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { BuilderInput } from '../BuilderInput';
import { BuilderCheckbox } from '../BuilderCheckbox';
import { BuilderField } from '../BuilderField';
import { Section, Stack, FormRow, Divider, SubLabel } from '../BuilderLayout';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

const BasicInfoSection = React.memo<SectionProps>(function BasicInfoSection({ isOpen, onToggle }) {
    const {
        groom, setGroom,
        bride, setBride,
        setGroomParents,
        setBrideParents
    } = useInvitationStore();

    return (
        <AccordionItem
            title="기본 정보"
            icon={User2}
            isOpen={isOpen}
            onToggle={onToggle}
            isCompleted={!!groom.firstName && !!bride.firstName}
        >
            <Section>
                {/* Groom Section */}
                <BuilderField label="🤵 신랑">
                    <Stack gap="sm">
                        <FormRow>
                            <SubLabel>신랑</SubLabel>
                            <BuilderInput
                                type="text"
                                placeholder="성"
                                value={groom.lastName}
                                onChange={(e) => setGroom({ lastName: e.target.value })}
                            />
                            <BuilderInput
                                type="text"
                                placeholder="이름"
                                value={groom.firstName}
                                onChange={(e) => setGroom({ firstName: e.target.value })}
                            />
                            <BuilderInput
                                type="text"
                                placeholder="관계"
                                value={groom.relation}
                                onChange={(e) => setGroom({ relation: e.target.value })}
                            />
                        </FormRow>

                        {/* Groom Parents */}
                        <FormRow cols={3}>
                            <SubLabel>아버지</SubLabel>
                            <BuilderInput
                                type="text"
                                placeholder="성함"
                                value={groom.parents.father.name}
                                onChange={(e) => setGroomParents('father', { name: e.target.value })}
                            />
                            <BuilderCheckbox
                                id="groom-father-deceased"
                                checked={groom.parents.father.isDeceased}
                                onChange={(checked) => setGroomParents('father', { isDeceased: checked })}
                            >
                                故
                            </BuilderCheckbox>
                        </FormRow>
                        <FormRow cols={3}>
                            <SubLabel>어머니</SubLabel>
                            <BuilderInput
                                type="text"
                                placeholder="성함"
                                value={groom.parents.mother.name}
                                onChange={(e) => setGroomParents('mother', { name: e.target.value })}
                            />
                            <BuilderCheckbox
                                id="groom-mother-deceased"
                                checked={groom.parents.mother.isDeceased}
                                onChange={(checked) => setGroomParents('mother', { isDeceased: checked })}
                            >
                                故
                            </BuilderCheckbox>
                        </FormRow>
                    </Stack>
                </BuilderField>

                <Divider />

                {/* Bride Section */}
                <BuilderField label="👰‍♀️ 신부">
                    <Stack gap="sm">
                        <FormRow>
                            <SubLabel>신부</SubLabel>
                            <BuilderInput
                                type="text"
                                placeholder="성"
                                value={bride.lastName}
                                onChange={(e) => setBride({ lastName: e.target.value })}
                            />
                            <BuilderInput
                                type="text"
                                placeholder="이름"
                                value={bride.firstName}
                                onChange={(e) => setBride({ firstName: e.target.value })}
                            />
                            <BuilderInput
                                type="text"
                                placeholder="관계"
                                value={bride.relation}
                                onChange={(e) => setBride({ relation: e.target.value })}
                            />
                        </FormRow>

                        {/* Bride Parents */}
                        <FormRow cols={3}>
                            <SubLabel>아버지</SubLabel>
                            <BuilderInput
                                type="text"
                                placeholder="성함"
                                value={bride.parents.father.name}
                                onChange={(e) => setBrideParents('father', { name: e.target.value })}
                            />
                            <BuilderCheckbox
                                id="bride-father-deceased"
                                checked={bride.parents.father.isDeceased}
                                onChange={(checked) => setBrideParents('father', { isDeceased: checked })}
                            >
                                故
                            </BuilderCheckbox>
                        </FormRow>
                        <FormRow cols={3}>
                            <SubLabel>어머니</SubLabel>
                            <BuilderInput
                                type="text"
                                placeholder="성함"
                                value={bride.parents.mother.name}
                                onChange={(e) => setBrideParents('mother', { name: e.target.value })}
                            />
                            <BuilderCheckbox
                                id="bride-mother-deceased"
                                checked={bride.parents.mother.isDeceased}
                                onChange={(checked) => setBrideParents('mother', { isDeceased: checked })}
                            >
                                故
                            </BuilderCheckbox>
                        </FormRow>
                    </Stack>
                </BuilderField>
            </Section>
        </AccordionItem>
    );
});

export default BasicInfoSection;
