"use client";

import React, { useState } from "react";
import styles from "../../DesignSystem.module.scss";
import { PhoneField } from "@/components/common/PhoneField";
import Story from "../../Story";
import DocSection from "../../DocSection";

export default function PhoneFieldPage() {
    const [label, setLabel] = useState("휴대폰 번호");
    const [placeholder, setPlaceholder] = useState("010-0000-0000");
    const [helpText, setHelpText] = useState("숫자만 입력하면 자동으로 포맷팅됩니다.");
    const [disabled, setDisabled] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const phoneFieldUsage = `import { PhoneField } from "@/components/common/PhoneField";

<PhoneField
  label="${label}"
  placeholder="${placeholder}"
  ${hasError ? 'hasError' : ''}
  ${disabled ? 'disabled' : ''}
  helpText="${helpText}"
/>`;

    return (
        <>
            <header className={styles.pageHeader}>
                <h1>PhoneField</h1>
                <p className={styles.textMuted}>
                    자동 포맷팅 기능이 포함된 전화번호 입력 필드입니다.
                </p>
            </header>

            <div className={styles.storySection}>
                <Story id="playground" title="미리보기">
                    <div className={styles.canvas} style={{ alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                        <div style={{ width: '100%', maxWidth: '400px' }}>
                            <PhoneField
                                label={label}
                                placeholder={placeholder}
                                helpText={helpText}
                                hasError={hasError}
                                disabled={disabled}
                                value={inputValue}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                            />
                        </div>
                    </div>
                </Story>

                <DocSection
                    usage={phoneFieldUsage}
                    props={[
                        {
                            name: "label",
                            type: "string",
                            description: "입력 필드 상단 레이블",
                            control: { type: 'text', value: label, onChange: (val) => setLabel(val as string) }
                        },
                        {
                            name: "placeholder",
                            type: "string",
                            description: "입력 필드 임시 텍스트",
                            control: { type: 'text', value: placeholder, onChange: (val) => setPlaceholder(val as string) }
                        },
                        {
                            name: "helpText",
                            type: "ReactNode",
                            description: "하단 도움말 또는 에러 메시지",
                            control: { type: 'text', value: helpText, onChange: (val) => setHelpText(val as string) }
                        },
                        {
                            name: "hasError",
                            type: "boolean",
                            defaultValue: "false",
                            description: "에러 상태 표시",
                            control: { type: 'boolean', value: hasError, onChange: (val) => setHasError(val as boolean) }
                        },
                        {
                            name: "disabled",
                            type: "boolean",
                            defaultValue: "false",
                            description: "비활성화 상태",
                            control: { type: 'boolean', value: disabled, onChange: (val) => setDisabled(val as boolean) }
                        },
                    ]}
                />
            </div>
        </>
    );
}
