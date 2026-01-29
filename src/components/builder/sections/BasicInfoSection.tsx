
import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useInvitationStore } from '@/store/useInvitationStore';
import { BoardRow } from '@/components/ui/BoardRow';
import { TextField } from '@/components/ui/TextField';
import { Button } from '@/components/ui/Button';
import { List, ListRow } from '@/components/ui/List';
import styles from './BasicInfoSection.module.scss';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import { parseKoreanName } from '@/lib/utils';
import type { SectionProps } from '@/types/builder';

const BasicInfoSection = React.memo<SectionProps>(function BasicInfoSection(props) {
    const groom = useInvitationStore(useShallow(state => state.groom));
    const setGroom = useInvitationStore(state => state.setGroom);
    const bride = useInvitationStore(useShallow(state => state.bride));
    const setBride = useInvitationStore(state => state.setBride);
    const setGroomParents = useInvitationStore(state => state.setGroomParents);
    const setBrideParents = useInvitationStore(state => state.setBrideParents);

    return (
        <BoardRow
            title="기본 정보"
            isOpened={props.isOpen}
            onOpen={() => props.onToggle?.(true)}
            onClose={() => props.onToggle?.(false)}
            icon={<BoardRow.ArrowIcon />}
        >
            <List>
                {/* Groom Section */}
                <ListRow
                    contents={
                        <div className={styles.formGroup}>
                            <div className={cn(styles.row, styles.full)}>
                                <TextField
                                    variant="line"
                                    label="신랑"
                                    type="text"
                                    placeholder="신랑 이름"
                                    value={`${groom.lastName}${groom.firstName}`}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGroom(parseKoreanName(e.target.value))}
                                />
                            </div>

                            {/* Groom Parents */}
                            <div className={cn(styles.row, styles.compact)}>
                                <TextField
                                    variant="line"
                                    type="text"
                                    placeholder="아버지 이름"
                                    value={groom.parents.father.name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGroomParents('father', { name: e.target.value })}
                                    className={styles.parentInput}
                                />
                                <div className={styles.actionGroup}>
                                    <Button
                                        type="button"
                                        variant="weak"
                                        onClick={() => setGroomParents('father', { isHidden: !groom.parents.father.isHidden })}
                                        className={cn(styles.visibilityButton, !groom.parents.father.isHidden && styles.active)}
                                        title={groom.parents.father.isHidden ? '숨김 상태 (클릭하여 노출)' : '노출 상태 (클릭하여 숨김)'}
                                    >
                                        {groom.parents.father.isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={groom.parents.father.isDeceased ? 'fill' : 'weak'}
                                        onClick={() => setGroomParents('father', { isDeceased: !groom.parents.father.isDeceased })}
                                        className={cn(styles.deceasedButton, !groom.parents.father.isDeceased && styles.deceasedButtonInactive)}
                                    >
                                        故
                                    </Button>
                                </div>
                            </div>
                            <div className={cn(styles.row, styles.compact)}>
                                <TextField
                                    variant="line"
                                    type="text"
                                    placeholder="어머니 이름"
                                    value={groom.parents.mother.name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGroomParents('mother', { name: e.target.value })}
                                    className={styles.parentInput}
                                />
                                <div className={styles.actionGroup}>
                                    <Button
                                        type="button"
                                        variant="weak"
                                        onClick={() => setGroomParents('mother', { isHidden: !groom.parents.mother.isHidden })}
                                        className={cn(styles.visibilityButton, !groom.parents.mother.isHidden && styles.active)}
                                        title={groom.parents.mother.isHidden ? '숨김 상태 (클릭하여 노출)' : '노출 상태 (클릭하여 숨김)'}
                                    >
                                        {groom.parents.mother.isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={groom.parents.mother.isDeceased ? 'fill' : 'weak'}
                                        onClick={() => setGroomParents('mother', { isDeceased: !groom.parents.mother.isDeceased })}
                                        className={cn(styles.deceasedButton, !groom.parents.mother.isDeceased && styles.deceasedButtonInactive)}
                                    >
                                        故
                                    </Button>
                                </div>
                            </div>
                        </div>
                    }
                />

                <ListRow
                    contents={
                        <div className={styles.formGroup}>
                            <div className={cn(styles.row, styles.full)}>
                                <TextField
                                    variant="line"
                                    label="신부"
                                    type="text"
                                    placeholder="신부 이름"
                                    value={`${bride.lastName}${bride.firstName}`}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBride(parseKoreanName(e.target.value))}
                                />
                            </div>

                            {/* Bride Parents */}
                            <div className={cn(styles.row, styles.compact)}>
                                <TextField
                                    variant="line"
                                    type="text"
                                    placeholder="아버지 이름"
                                    value={bride.parents.father.name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBrideParents('father', { name: e.target.value })}
                                    className={styles.parentInput}
                                />
                                <div className={styles.actionGroup}>
                                    <Button
                                        type="button"
                                        variant="weak"
                                        onClick={() => setBrideParents('father', { isHidden: !bride.parents.father.isHidden })}
                                        className={cn(styles.visibilityButton, !bride.parents.father.isHidden && styles.active)}
                                        title={bride.parents.father.isHidden ? '숨김 상태 (클릭하여 노출)' : '노출 상태 (클릭하여 숨김)'}
                                    >
                                        {bride.parents.father.isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={bride.parents.father.isDeceased ? 'fill' : 'weak'}
                                        onClick={() => setBrideParents('father', { isDeceased: !bride.parents.father.isDeceased })}
                                        className={cn(styles.deceasedButton, !bride.parents.father.isDeceased && styles.deceasedButtonInactive)}
                                    >
                                        故
                                    </Button>
                                </div>
                            </div>
                            <div className={cn(styles.row, styles.compact)}>
                                <TextField
                                    variant="line"
                                    type="text"
                                    placeholder="어머니 이름"
                                    value={bride.parents.mother.name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBrideParents('mother', { name: e.target.value })}
                                    className={styles.parentInput}
                                />
                                <div className={styles.actionGroup}>
                                    <Button
                                        type="button"
                                        variant="weak"
                                        onClick={() => setBrideParents('mother', { isHidden: !bride.parents.mother.isHidden })}
                                        className={cn(styles.visibilityButton, !bride.parents.mother.isHidden && styles.active)}
                                        title={bride.parents.mother.isHidden ? '숨김 상태 (클릭하여 노출)' : '노출 상태 (클릭하여 숨김)'}
                                    >
                                        {bride.parents.mother.isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={bride.parents.mother.isDeceased ? 'fill' : 'weak'}
                                        onClick={() => setBrideParents('mother', { isDeceased: !bride.parents.mother.isDeceased })}
                                        className={cn(styles.deceasedButton, !bride.parents.mother.isDeceased && styles.deceasedButtonInactive)}
                                    >
                                        故
                                    </Button>
                                </div>
                            </div>
                        </div>
                    }
                />
            </List>
        </BoardRow>
    );
});

export default BasicInfoSection;
