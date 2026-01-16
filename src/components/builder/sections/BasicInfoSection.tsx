
import React from 'react';
import { User2 } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { TextField } from '../TextField';
import { Toggle } from '../Toggle';
import { Field } from '../FormPrimitives';
import styles from './BasicInfoSection.module.scss';
import { cn } from '@/lib/utils';

interface SectionProps {
    value: string;
    isOpen: boolean;
}

const BasicInfoSection = React.memo<SectionProps>(function BasicInfoSection({ isOpen, value }) {
    const groom = useInvitationStore(state => state.groom);
    const setGroom = useInvitationStore(state => state.setGroom);
    const bride = useInvitationStore(state => state.bride);
    const setBride = useInvitationStore(state => state.setBride);
    const setGroomParents = useInvitationStore(state => state.setGroomParents);
    const setBrideParents = useInvitationStore(state => state.setBrideParents);

    return (
        <AccordionItem
            value={value}
            title="기본 정보"
            icon={User2}
            isOpen={isOpen}
            isCompleted={!!groom.firstName && !!bride.firstName}
        >
            <div className={styles.container}>
                {/* Groom Section */}
                <Field label="🤵 신랑">
                    <div className={styles.formGroup}>
                        <div className={cn(styles.row, styles.full)}>
                            <TextField
                                type="text"
                                placeholder="신랑 이름"
                                value={groom.lastName + groom.firstName}
                                onChange={(e) => setGroom({ firstName: e.target.value, lastName: '' })}
                            />
                        </div>

                        {/* Groom Parents */}
                        <div className={cn(styles.row, styles.compact)}>
                            <TextField
                                type="text"
                                placeholder="아버지 성함"
                                value={groom.parents.father.name}
                                onChange={(e) => setGroomParents('father', { name: e.target.value })}
                            />
                            <Toggle
                                pressed={groom.parents.father.isDeceased}
                                onPressedChange={(pressed) => setGroomParents('father', { isDeceased: pressed })}
                            >
                                故
                            </Toggle>
                        </div>
                        <div className={cn(styles.row, styles.compact)}>
                            <TextField
                                type="text"
                                placeholder="어머니 성함"
                                value={groom.parents.mother.name}
                                onChange={(e) => setGroomParents('mother', { name: e.target.value })}
                            />
                            <Toggle
                                pressed={groom.parents.mother.isDeceased}
                                onPressedChange={(pressed) => setGroomParents('mother', { isDeceased: pressed })}
                            >
                                故
                            </Toggle>
                        </div>
                    </div>
                </Field>

                <div className={styles.divider} />

                <Field label="👰‍♀️ 신부">
                    <div className={styles.formGroup}>
                        <div className={cn(styles.row, styles.full)}>
                            <TextField
                                type="text"
                                placeholder="신부 이름"
                                value={bride.lastName + bride.firstName}
                                onChange={(e) => setBride({ firstName: e.target.value, lastName: '' })}
                            />
                        </div>

                        {/* Bride Parents */}
                        <div className={cn(styles.row, styles.compact)}>
                            <TextField
                                type="text"
                                placeholder="아버지 성함"
                                value={bride.parents.father.name}
                                onChange={(e) => setBrideParents('father', { name: e.target.value })}
                            />
                            <Toggle
                                pressed={bride.parents.father.isDeceased}
                                onPressedChange={(pressed) => setBrideParents('father', { isDeceased: pressed })}
                            >
                                故
                            </Toggle>
                        </div>
                        <div className={cn(styles.row, styles.compact)}>
                            <TextField
                                type="text"
                                placeholder="어머니 성함"
                                value={bride.parents.mother.name}
                                onChange={(e) => setBrideParents('mother', { name: e.target.value })}
                            />
                            <Toggle
                                pressed={bride.parents.mother.isDeceased}
                                onPressedChange={(pressed) => setBrideParents('mother', { isDeceased: pressed })}
                            >
                                故
                            </Toggle>
                        </div>
                    </div>
                </Field>
            </div>
        </AccordionItem>
    );
});

export default BasicInfoSection;
