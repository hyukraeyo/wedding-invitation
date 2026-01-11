import React from 'react';
import { User2 } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { TextField } from '../TextField';
import { Checkbox } from '../Checkbox';
import { Field } from '../Field';
import { Section, Stack, Divider } from '../Layout';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

const SubLabel = ({ children }: { children: React.ReactNode }) => (
    <span style={{ fontSize: '14px', color: '#666', fontWeight: 500 }}>
        {children}
    </span>
);

const FormRow = ({ children, cols = 1 }: { children: React.ReactNode; cols?: number }) => {
    // Determine grid columns: label + inputs
    // If cols=3 (father/mother), likely label + name + checkbox
    // If cols=1 (groom/bride), likely label + 3 inputs

    // Adjusting based on usage in component:
    // Groom/Bride: SubLabel + 3 TextFields
    // Parents: SubLabel + TextField + Checkbox

    const gridTemplateColumns = cols === 3
        ? '50px 1fr auto' // Label Name Checkbox
        : '50px 1fr 1fr 1fr'; // Label Field Field Field

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns,
            gap: '8px',
            alignItems: 'center'
        }}>
            {children}
        </div>
    );
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
                <Field label="🤵 신랑">
                    <Stack gap="sm">
                        <FormRow>
                            <SubLabel>신랑</SubLabel>
                            <TextField
                                type="text"
                                placeholder="성"
                                value={groom.lastName}
                                onChange={(e) => setGroom({ lastName: e.target.value })}
                            />
                            <TextField
                                type="text"
                                placeholder="이름"
                                value={groom.firstName}
                                onChange={(e) => setGroom({ firstName: e.target.value })}
                            />
                            <TextField
                                type="text"
                                placeholder="관계"
                                value={groom.relation}
                                onChange={(e) => setGroom({ relation: e.target.value })}
                            />
                        </FormRow>

                        {/* Groom Parents */}
                        <FormRow cols={3}>
                            <SubLabel>아버지</SubLabel>
                            <TextField
                                type="text"
                                placeholder="성함"
                                value={groom.parents.father.name}
                                onChange={(e) => setGroomParents('father', { name: e.target.value })}
                            />
                            <Checkbox
                                id="groom-father-deceased"
                                checked={groom.parents.father.isDeceased}
                                onChange={(checked) => setGroomParents('father', { isDeceased: checked })}
                            >
                                故
                            </Checkbox>
                        </FormRow>
                        <FormRow cols={3}>
                            <SubLabel>어머니</SubLabel>
                            <TextField
                                type="text"
                                placeholder="성함"
                                value={groom.parents.mother.name}
                                onChange={(e) => setGroomParents('mother', { name: e.target.value })}
                            />
                            <Checkbox
                                id="groom-mother-deceased"
                                checked={groom.parents.mother.isDeceased}
                                onChange={(checked) => setGroomParents('mother', { isDeceased: checked })}
                            >
                                故
                            </Checkbox>
                        </FormRow>
                    </Stack>
                </Field>

                <Divider />

                {/* Bride Section */}
                <Field label="👰‍♀️ 신부">
                    <Stack gap="sm">
                        <FormRow>
                            <SubLabel>신부</SubLabel>
                            <TextField
                                type="text"
                                placeholder="성"
                                value={bride.lastName}
                                onChange={(e) => setBride({ lastName: e.target.value })}
                            />
                            <TextField
                                type="text"
                                placeholder="이름"
                                value={bride.firstName}
                                onChange={(e) => setBride({ firstName: e.target.value })}
                            />
                            <TextField
                                type="text"
                                placeholder="관계"
                                value={bride.relation}
                                onChange={(e) => setBride({ relation: e.target.value })}
                            />
                        </FormRow>

                        {/* Bride Parents */}
                        <FormRow cols={3}>
                            <SubLabel>아버지</SubLabel>
                            <TextField
                                type="text"
                                placeholder="성함"
                                value={bride.parents.father.name}
                                onChange={(e) => setBrideParents('father', { name: e.target.value })}
                            />
                            <Checkbox
                                id="bride-father-deceased"
                                checked={bride.parents.father.isDeceased}
                                onChange={(checked) => setBrideParents('father', { isDeceased: checked })}
                            >
                                故
                            </Checkbox>
                        </FormRow>
                        <FormRow cols={3}>
                            <SubLabel>어머니</SubLabel>
                            <TextField
                                type="text"
                                placeholder="성함"
                                value={bride.parents.mother.name}
                                onChange={(e) => setBrideParents('mother', { name: e.target.value })}
                            />
                            <Checkbox
                                id="bride-mother-deceased"
                                checked={bride.parents.mother.isDeceased}
                                onChange={(checked) => setBrideParents('mother', { isDeceased: checked })}
                            >
                                故
                            </Checkbox>
                        </FormRow>
                    </Stack>
                </Field>
            </Section>
        </AccordionItem>
    );
});

export default BasicInfoSection;
