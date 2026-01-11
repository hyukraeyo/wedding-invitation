import React, { useState } from 'react';
import { CreditCard, Plus, Trash2, Sparkles } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { BuilderCollapse } from '../BuilderCollapse';
import { BuilderInput } from '../BuilderInput';
import RichTextEditor from '@/components/common/RichTextEditor';
import { BuilderButtonGroup } from '../BuilderButtonGroup';
import { BuilderButton } from '../BuilderButton';
import { BuilderField } from '../BuilderField';
import { BuilderLabel } from '../BuilderLabel';
import { BuilderModal } from '@/components/common/BuilderModal';
import { Section, Stack, Row, Divider, Grid, Card } from '../BuilderLayout';
import styles from './AccountsSection.module.scss';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

const ACCOUNTS_SAMPLES = [
    {
        title: '정중한 마음',
        message: '<p>참석이 어려우신 분들을 위해<br>계좌번호를 기재하였습니다.<br>너그러운 양해 부탁드립니다.</p>'
    },
    {
        title: '감사의 마음',
        message: '<p>축하의 마음을 담아 축의금을 전달하고자 하시는 분들을 위해 계좌번호를 안내해 드립니다.<br>넓은 마음으로 양해 부탁드립니다.</p>'
    },
    {
        title: '따뜻한 마음',
        message: '<p>화환은 정중히 사양합니다.<br>보내주시는 마음만 감사히 받겠습니다.<br>참석이 어려우신 분들을 위해 계좌번호를 안내해 드립니다.</p>'
    },
    {
        title: '심플한 안내',
        message: '<p>마음 전하실 곳을 안내해 드립니다.</p>'
    }
];

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
    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

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
                    <BuilderCollapse
                        label="섹션 문구 및 스타일 설정"
                        isOpen={isConfigOpen}
                        onToggle={() => setIsConfigOpen(!isConfigOpen)}
                    >
                        <BuilderField label="메인 타이틀">
                            <BuilderInput
                                value={accountsTitle}
                                onChange={(e) => setAccountsTitle(e.target.value)}
                                placeholder="축하의 마음 전하실 곳"
                            />
                        </BuilderField>

                        <BuilderField
                            label={
                                <Row align="between">
                                    <BuilderLabel className={styles.noMarginLabel ?? ''}>안내 문구</BuilderLabel>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsSampleModalOpen(true);
                                        }}
                                        className={styles.exampleButton ?? ''}
                                    >
                                        <Sparkles size={14} className={styles.sparkle ?? ''} />
                                        <span>예시 문구</span>
                                    </button>
                                </Row>
                            }
                        >
                            <RichTextEditor
                                content={accountsDescription}
                                onChange={setAccountsDescription}
                                placeholder="축하의 마음을 담아..."
                                minHeight="160px"
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
                    </BuilderCollapse>
                </Stack>

                <BuilderModal
                    isOpen={isSampleModalOpen}
                    onClose={() => setIsSampleModalOpen(false)}
                    title="추천 문구"
                >
                    <div className={styles.modalGrid ?? ''}>
                        {ACCOUNTS_SAMPLES.map((sample, idx) => (
                            <Card
                                key={idx}
                                hoverable
                                className={styles.sampleCard ?? ''}
                            >
                                <button
                                    onClick={() => {
                                        setAccountsDescription(sample.message);
                                        setIsSampleModalOpen(false);
                                    }}
                                    className={styles.sampleButton ?? ''}
                                >
                                    <div className={styles.sampleTitle ?? ''}>{sample.title}</div>
                                    <div
                                        className={styles.sampleMessage ?? ''}
                                        dangerouslySetInnerHTML={{ __html: sample.message }}
                                    />
                                </button>
                            </Card>
                        ))}
                    </div>
                </BuilderModal>

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
