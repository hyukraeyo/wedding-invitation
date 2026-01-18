
import React from 'react';
import { User2 } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '@/components/common/AccordionItem';
import { TextField } from '@/components/common/TextField';

import { Button } from '@/components/ui/Button';
import { Field, SectionContainer } from '@/components/common/FormPrimitives';
import styles from './BasicInfoSection.module.scss';
import { cn } from '@/lib/utils';
import type { SectionProps } from '@/types/builder';

const BasicInfoSection = React.memo<SectionProps>(function BasicInfoSection({ isOpen, value }) {
    const groom = useInvitationStore(useShallow(state => state.groom));
    const setGroom = useInvitationStore(state => state.setGroom);
    const bride = useInvitationStore(useShallow(state => state.bride));
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
            <SectionContainer>
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
                            <Button
                                type="button"
                                variant={groom.parents.father.isDeceased ? 'default' : 'outline'}
                                onClick={() => setGroomParents('father', { isDeceased: !groom.parents.father.isDeceased })}
                                className={cn("w-[50px] p-0", !groom.parents.father.isDeceased && "text-zinc-400")}
                            >
                                故
                            </Button>
                        </div>
                        <div className={cn(styles.row, styles.compact)}>
                            <TextField
                                type="text"
                                placeholder="어머니 성함"
                                value={groom.parents.mother.name}
                                onChange={(e) => setGroomParents('mother', { name: e.target.value })}
                            />
                            <Button
                                type="button"
                                variant={groom.parents.mother.isDeceased ? 'default' : 'outline'}
                                onClick={() => setGroomParents('mother', { isDeceased: !groom.parents.mother.isDeceased })}
                                className={cn("w-[50px] p-0", !groom.parents.mother.isDeceased && "text-zinc-400")}
                            >
                                故
                            </Button>
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
                            <Button
                                type="button"
                                variant={bride.parents.father.isDeceased ? 'default' : 'outline'}
                                onClick={() => setBrideParents('father', { isDeceased: !bride.parents.father.isDeceased })}
                                className={cn("w-[50px] p-0", !bride.parents.father.isDeceased && "text-zinc-400")}
                            >
                                故
                            </Button>
                        </div>
                        <div className={cn(styles.row, styles.compact)}>
                            <TextField
                                type="text"
                                placeholder="어머니 성함"
                                value={bride.parents.mother.name}
                                onChange={(e) => setBrideParents('mother', { name: e.target.value })}
                            />
                            <Button
                                type="button"
                                variant={bride.parents.mother.isDeceased ? 'default' : 'outline'}
                                onClick={() => setBrideParents('mother', { isDeceased: !bride.parents.mother.isDeceased })}
                                className={cn("w-[50px] p-0", !bride.parents.mother.isDeceased && "text-zinc-400")}
                            >
                                故
                            </Button>
                        </div>
                    </div>
                </Field>
            </SectionContainer>
        </AccordionItem>
    );
});

export default BasicInfoSection;
