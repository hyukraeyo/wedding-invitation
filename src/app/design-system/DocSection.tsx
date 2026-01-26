"use client";

import React from "react";
import styles from "./DesignSystem.module.scss";
import { Switch } from "@/components/ui/Switch";
import { Input } from "@/components/ui/Input";
import { RadioGroup } from "@/components/ui/RadioGroup";

interface PropControl {
    type: 'boolean' | 'select' | 'text' | 'radio';
    value: boolean | string;
    onChange: (value: boolean | string) => void;
    options?: (string | { label: string; value: string; icon?: React.ReactNode })[]; // For select or radio type
}

interface PropItem {
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
                                style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                                {isExpanded ? "코드 접기" : "코드 펼치기"}
                            </button>
                        </div>

                        {isExpanded && (
                            <pre className={styles.codeBlock}>
                                <code>{usage}</code>
                            </pre>
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
                                            <td style={{ verticalAlign: 'top' }}><code>{prop.name}</code></td>
                                            <td style={{ verticalAlign: 'top' }}>
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
                                                            {prop.control.type === 'select' && prop.control.options && (
                                                                <RadioGroup
                                                                    variant="segmented"
                                                                    size="md"
                                                                    value={prop.control.value as string}
                                                                    onValueChange={prop.control.onChange as (val: string) => void}
                                                                    aria-label={`Select ${prop.name}`}
                                                                    options={prop.control.options.map((opt): { label: string; value: string } => {
                                                                        if (typeof opt === 'string') return { label: opt, value: opt };
                                                                        return { label: opt.label, value: opt.value };
                                                                    })}
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
                                                            {prop.control.type === 'radio' && prop.control.options && (
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
                                                        </div>
                                                    ) : (
                                                        prop.defaultValue ? <code>{prop.defaultValue}</code> : <span className={styles.textMuted}>-</span>
                                                    )}
                                                    <code className={styles.codeType} style={{ fontSize: '11px', width: 'fit-content' }}>
                                                        {prop.type}
                                                    </code>
                                                </div>
                                            </td>
                                            <td style={{ verticalAlign: 'top' }}>{prop.description}</td>
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
