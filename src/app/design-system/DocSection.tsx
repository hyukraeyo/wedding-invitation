"use client";

import React from "react";
import styles from "./DesignSystem.module.scss";
import { Switch } from "@/components/ui/Switch";
import { Input } from "@/components/ui/Input";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { Select } from "@/components/ui/Select";

export interface PropControl {
    type: 'boolean' | 'select' | 'text' | 'radio' | 'segmented';
    value: boolean | string;
    onChange: (value: boolean | string) => void;
    options?: (string | { label: string; value: string; icon?: React.ReactNode })[] | undefined;
}

export interface PropItem {
    name: string;
    type: string;
    defaultValue?: string;
    description: string;
    control?: PropControl;
}

interface DocSectionProps {
    usage?: string;
    props?: PropItem[];
}

export default function DocSection({ usage, props }: DocSectionProps) {
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
        <section className={styles.section}>
            <div className={styles.showcaseStack}>
                {usage && (
                    <div className={styles.verticalStackSmall}>
                        <div className={styles.flexBetween} style={{ alignItems: 'center', marginBottom: '8px' }}>
                            <span className={styles.labelUppercaseBlack}>사용법</span>
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className={styles.textButton}
                                style={{ fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', color: '#18181b' }}
                            >
                                {isExpanded ? "코드 접기" : "코드 펼치기"}
                            </button>
                        </div>

                        {isExpanded && (
                            <div className={styles.codeBlockWrapper}>
                                <div className={styles.codeBlockHeader}>
                                    <div className={styles.dots}>
                                        <span></span><span></span><span></span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span className={styles.lang}>TSX</span>
                                        <button
                                            className={styles.copyButton}
                                            onClick={() => {
                                                navigator.clipboard.writeText(usage);
                                                alert("코드가 복사되었습니다!");
                                            }}
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>
                                <pre className={styles.codeBlock}>
                                    <code>{usage}</code>
                                </pre>
                            </div>
                        )}
                    </div>
                )}

                {props && props.length > 0 && (
                    <div className={styles.verticalStackSmall}>
                        <span className={styles.labelUppercaseBlack}>옵션 (Props)</span>
                        <div className={styles.tableWrapper}>
                            <table className={styles.propsTable}>
                                <thead>
                                    <tr>
                                        <th style={{ width: '25%' }}>이름</th>
                                        <th style={{ width: '35%' }}>설정 (Type)</th>
                                        <th style={{ width: '40%' }}>설명</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.map((prop) => (
                                        <tr key={prop.name}>
                                            <td className={styles.nameCell}>
                                                <span className={styles.propTag}>{prop.name}</span>
                                            </td>
                                            <td>
                                                <div className={styles.verticalStackExtraSmall}>
                                                    {prop.control ? (
                                                        <div style={{ width: '100%', minWidth: '120px' }}>
                                                            {prop.control.type === 'boolean' && (
                                                                <Switch
                                                                    checked={prop.control.value as boolean}
                                                                    onCheckedChange={prop.control.onChange as (val: boolean) => void}
                                                                    aria-label={`Toggle ${prop.name}`}
                                                                />
                                                            )}
                                                            {prop.control.type === 'text' && (
                                                                <Input
                                                                    value={prop.control.value as string}
                                                                    onChange={(e) => prop.control!.onChange(e.target.value)}
                                                                    size="md"
                                                                    aria-label={`Edit ${prop.name}`}
                                                                />
                                                            )}
                                                            {prop.control.type === 'segmented' && prop.control.options && (
                                                                <>
                                                                    {prop.control.options.length >= 4 ? (
                                                                        <Select
                                                                            value={prop.control.value as string}
                                                                            onValueChange={prop.control.onChange as (val: string) => void}
                                                                            options={prop.control.options.map(opt =>
                                                                                typeof opt === 'string'
                                                                                    ? { label: opt, value: opt }
                                                                                    : { label: opt.label, value: opt.value }
                                                                            )}
                                                                        />
                                                                    ) : (
                                                                        <RadioGroup
                                                                            variant="segmented"
                                                                            size="md"
                                                                            value={prop.control.value as string}
                                                                            onValueChange={prop.control.onChange as (val: string) => void}
                                                                            aria-label={`Choose ${prop.name}`}
                                                                            options={prop.control.options.map(opt =>
                                                                                typeof opt === 'string'
                                                                                    ? { label: opt, value: opt }
                                                                                    : opt
                                                                            )}
                                                                        />
                                                                    )}
                                                                </>
                                                            )}
                                                            {prop.control.type === 'radio' && prop.control.options && (
                                                                <RadioGroup
                                                                    variant="basic"
                                                                    value={prop.control.value as string}
                                                                    onValueChange={prop.control.onChange as (val: string) => void}
                                                                    aria-label={`Choose ${prop.name}`}
                                                                    options={prop.control.options.map(opt =>
                                                                        typeof opt === 'string'
                                                                            ? { label: opt, value: opt }
                                                                            : opt
                                                                    )}
                                                                />
                                                            )}
                                                            {prop.control.type === 'select' && prop.control.options && (
                                                                <Select
                                                                    value={prop.control.value as string}
                                                                    onValueChange={prop.control.onChange as (val: string) => void}
                                                                    options={prop.control.options.map(opt =>
                                                                        typeof opt === 'string'
                                                                            ? { label: opt, value: opt }
                                                                            : { label: opt.label, value: opt.value }
                                                                    )}
                                                                />
                                                            )}
                                                        </div>
                                                    ) : (
                                                        prop.defaultValue ? <code>{prop.defaultValue}</code> : <span className={styles.textMuted}>-</span>
                                                    )}
                                                    <span className={styles.codeType}>
                                                        {prop.type}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className={styles.description}>
                                                    {prop.description}
                                                    {prop.defaultValue && (
                                                        <div style={{ marginTop: '4px', fontSize: '11px', color: '#a1a1aa' }}>
                                                            Default: <code>{prop.defaultValue}</code>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
