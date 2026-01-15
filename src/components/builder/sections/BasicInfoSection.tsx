
import React from 'react';
import { User2 } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { TextField } from '../TextField';
import { Toggle } from '../toggle';
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
                            <span className={styles.subLabel}>신랑</span>
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
                        </div>

                        {/* Groom Parents */}
                        <div className={cn(styles.row, styles.compact)}>
                            <span className={styles.subLabel}>아버지</span>
                            <TextField
                                type="text"
                                placeholder="성함"
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
                            <span className={styles.subLabel}>어머니</span>
                            <TextField
                                type="text"
                                placeholder="성함"
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

                {/* Bride Section */}
                <Field label="👰‍♀️ 신부">
                    <div className={styles.formGroup}>
                        <div className={cn(styles.row, styles.full)}>
                            <span className={styles.subLabel}>신부</span>
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
                        </div>

                        {/* Bride Parents */}
                        <div className={cn(styles.row, styles.compact)}>
                            <span className={styles.subLabel}>아버지</span>
                            <TextField
                                type="text"
                                placeholder="성함"
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
                            <span className={styles.subLabel}>어머니</span>
                            <TextField
                                type="text"
                                placeholder="성함"
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
