import React, { useState } from 'react';
import { CreditCard, Plus, Trash2 } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { SubAccordion } from '../SubAccordion';
import { BuilderInput } from '../BuilderInput';
import RichTextEditor from '@/components/common/RichTextEditor';
import { BuilderButtonGroup } from '../BuilderButtonGroup';
import { BuilderButton } from '../BuilderButton';
import { BuilderField } from '../BuilderField';
import { Section, Stack, Row, Divider, Grid, Card } from '../BuilderLayout';
import styles from './AccountsSection.module.scss';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function AccountsSection({ isOpen, onToggle }: SectionProps) {
    const {
        accounts, setAccounts,
        accountsTitle, setAccountsTitle,
        accountsDescription, setAccountsDescription,
        accountsGroomTitle, setAccountsGroomTitle,
        accountsBrideTitle, setAccountsBrideTitle,
        accountsColorMode, setAccountsColorMode,
        groom, bride
    } = useInvitationStore();

    const [isConfigOpen, setIsConfigOpen] = useState(false);

    const addAccount = (type: 'groom' | 'bride') => {
        const id = `${type}-${Date.now()}`;
        const defaultName = type === 'groom' ? `${groom.lastName}${groom.firstName}` : `${bride.lastName}${bride.firstName}`;
        setAccounts([...accounts, { id, type, relation: '본인', bank: '', accountNumber: '', holder: defaultName }]);
    };

    const removeAccount = (id: string) => {
        setAccounts(accounts.filter(a => a.id !== id));
    };

    const updateAccount = (id: string, data: Partial<Account>) => {
        setAccounts(accounts.map(a => a.id === id ? { ...a, ...data } : a));
    };

    const groomAccs = accounts.filter(a => a.type === 'groom');
    const brideAccs = accounts.filter(a => a.type === 'bride');

    return (
        <AccordionItem
            title="마음 전하실 곳"
            icon={CreditCard}
            isOpen={isOpen}
            onToggle={onToggle}
            isCompleted={accounts.length > 0 && accounts.every(a => a.bank && a.accountNumber)}
        >
            <Section>
                <Stack gap="md">
                    <SubAccordion
                        label="섹션 문구 및 스타일 설정"
                        isOpen={isConfigOpen}
                        onClick={() => setIsConfigOpen(!isConfigOpen)}
                    >
                        <BuilderField label="메인 타이틀">
                            <BuilderInput
                                value={accountsTitle}
                                onChange={(e) => setAccountsTitle(e.target.value)}
                                placeholder="축하의 마음 전하실 곳"
                            />
                        </BuilderField>

                        <BuilderField label="안내 문구">
                            <RichTextEditor
                                content={accountsDescription}
                                onChange={setAccountsDescription}
                                placeholder="축하의 마음을 담아..."
                            />
                        </BuilderField>

                        <BuilderField label="신랑측 그룹 타이틀">
                            <BuilderInput
                                value={accountsGroomTitle}
                                onChange={(e) => setAccountsGroomTitle(e.target.value)}
                                placeholder="신랑 측 마음 전하실 곳"
                            />
                        </BuilderField>
                        <BuilderField label="신부측 그룹 타이틀">
                            <BuilderInput
                                value={accountsBrideTitle}
                                onChange={(e) => setAccountsBrideTitle(e.target.value)}
                                placeholder="신부 측 마음 전하실 곳"
                            />
                        </BuilderField>

                        <BuilderField label="계좌 아코디언 색상">
                            <BuilderButtonGroup
                                value={accountsColorMode}
                                onChange={(val) => setAccountsColorMode(val as 'accent' | 'subtle' | 'white')}
                                options={[
                                    { label: '테마색', value: 'accent' },
                                    { label: '연한 회색', value: 'subtle' },
                                    { label: '흰색', value: 'white' }
                                ]}
                            />
                        </BuilderField>
                    </SubAccordion>
                </Stack>

                <Divider />

                {/* Groom Side */}
                <Stack gap="md">
                    <Row align="between">
                        <Row gap="sm">
                            <span className={styles.indicatorGroom ?? ''} />
                            <span className={styles.sideLabel ?? ''}>신랑측 계좌</span>
                        </Row>
                        <BuilderButton
                            variant="ghost"
                            size="sm"
                            onClick={() => addAccount('groom')}
                            className={styles.addButton ?? ''}
                        >
                            <Plus size={12} /> 추가
                        </BuilderButton>
                    </Row>
                    <Stack gap="md">
                        {groomAccs.map((acc) => (
                            <AccountEntry
                                key={acc.id}
                                acc={acc}
                                groom={groom}
                                bride={bride}
                                onUpdate={(data) => updateAccount(acc.id, data)}
                                onRemove={() => removeAccount(acc.id)}
                            />
                        ))}
                    </Stack>
                </Stack>

                <Divider />

                {/* Bride Side */}
                <Stack gap="md">
                    <Row align="between">
                        <Row gap="sm">
                            <span className={styles.indicatorBride ?? ''} />
                            <span className={styles.sideLabel ?? ''}>신부측 계좌</span>
                        </Row>
                        <BuilderButton
                            variant="ghost"
                            size="sm"
                            onClick={() => addAccount('bride')}
                            className={styles.addButton ?? ''}
                        >
                            <Plus size={12} /> 추가
                        </BuilderButton>
                    </Row>
                    <Stack gap="md">
                        {brideAccs.map((acc) => (
                            <AccountEntry
                                key={acc.id}
                                acc={acc}
                                groom={groom}
                                bride={bride}
                                onUpdate={(data) => updateAccount(acc.id, data)}
                                onRemove={() => removeAccount(acc.id)}
                            />
                        ))}
                    </Stack>
                </Stack>
            </Section>
        </AccordionItem>
    );
}

interface Account {
    id: string;
    type: 'groom' | 'bride';
    relation: '본인' | '아버지' | '어머니';
    bank: string;
    accountNumber: string;
    holder: string;
}

interface Person {
    firstName: string;
    lastName: string;
    parents: {
        father: { name: string };
        mother: { name: string };
    };
}

function AccountEntry({
    acc, groom, bride, onUpdate, onRemove
}: {
    acc: Account;
    groom: Person;
    bride: Person;
    onUpdate: (data: Partial<Account>) => void;
    onRemove: () => void
}) {
    const getName = (rel: '본인' | '아버지' | '어머니') => {
        if (acc.type === 'groom') {
            if (rel === '본인') return `${groom.lastName}${groom.firstName}`;
            if (rel === '아버지') return groom.parents.father.name;
            if (rel === '어머니') return groom.parents.mother.name;
        } else {
            if (rel === '본인') return `${bride.lastName}${bride.firstName}`;
            if (rel === '아버지') return bride.parents.father.name;
            if (rel === '어머니') return bride.parents.mother.name;
        }
        return '';
    };

    return (
        <Card className={styles.accountCard ?? ''}>
            <Stack gap="md">
                <Row align="between">
                    <div className={styles.buttonGroupWrapper ?? ''}>
                        <BuilderButtonGroup
                            size="sm"
                            value={acc.relation}
                            options={(['본인', '아버지', '어머니'] as const).map((rel) => ({
                                label: rel === '본인' ? (acc.type === 'groom' ? '신랑' : '신부') : rel,
                                value: rel
                            }))}
                            onChange={(val) => {
                                const rel = val as '본인' | '아버지' | '어머니';
                                onUpdate({ relation: rel, holder: getName(rel) || acc.holder });
                            }}
                        />
                    </div>
                    <button
                        onClick={onRemove}
                        className={styles.removeButton ?? ''}
                        title="삭제"
                    >
                        <Trash2 size={16} />
                    </button>
                </Row>
                <Grid cols={2}>
                    <BuilderField label="은행명">
                        <BuilderInput
                            placeholder="은행 입력"
                            value={acc.bank}
                            onChange={(e) => onUpdate({ bank: e.target.value })}
                        />
                    </BuilderField>
                    <BuilderField label="예금주">
                        <BuilderInput
                            placeholder="이름 입력"
                            value={acc.holder}
                            onChange={(e) => onUpdate({ holder: e.target.value })}
                        />
                    </BuilderField>
                </Grid>
                <BuilderField label="계좌번호">
                    <BuilderInput
                        placeholder="하이픈(-) 포함하여 입력"
                        value={acc.accountNumber}
                        onChange={(e) => onUpdate({ accountNumber: e.target.value })}
                    />
                </BuilderField>
            </Stack>
        </Card>
    );
}
