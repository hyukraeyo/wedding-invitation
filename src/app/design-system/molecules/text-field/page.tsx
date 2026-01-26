"use client";

import React, { useState } from "react";
import styles from "../../DesignSystem.module.scss";
import { TextField } from "@/components/common/TextField";
import Story from "../../Story";
import DocSection from "../../DocSection";

export default function TextFieldPage() {
    const [label, setLabel] = useState("레이블");
    const [placeholder, setPlaceholder] = useState("내용을 입력해주세요");
    const [helpText, setHelpText] = useState("도움말 텍스트입니다.");
    const [disabled, setDisabled] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [multiline, setMultiline] = useState(false);
    const [inputType, setInputType] = useState<"text" | "password" | "email">("text");
    const [inputValue, setInputValue] = useState("");
    const [size, setSize] = useState<"sm" | "md" | "lg">("md");

    const textFieldUsage = `import { TextField } from "@/components/common/TextField";

<TextField
  label="${label}"
  placeholder="${placeholder}"
  ${hasError ? 'hasError' : ''}
  ${disabled ? 'disabled' : ''}
  ${multiline ? 'multiline rows={4}' : `type="${inputType}"`}
  helpText="${helpText}"
  size="${size}"
/>`;

    return (
        <>
            <header className={styles.pageHeader}>
                <h1>TextField</h1>
                <p className={styles.textMuted}>
                    라벨, 도움말, 에러 메시지가 포함된 완전한 입력 필드 컴포넌트입니다.
                </p>
            </header>

            <div className={styles.storySection}>
                <Story id="playground" title="미리보기">
                    <div className={styles.canvas} style={{ alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                        <div style={{ width: '100%', maxWidth: '400px' }}>
                            {multiline ? (
                                <TextField
                                    label={label}
                                    placeholder={placeholder}
                                    helpText={helpText}
                                    hasError={hasError}
                                    disabled={disabled}
                                    multiline={true}
                                    size={size}
                                    rows={4}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                />
                            ) : (
                                <TextField
                                    label={label}
                                    placeholder={placeholder}
                                    helpText={helpText}
                                    hasError={hasError}
                                    disabled={disabled}
                                    multiline={false}
                                    size={size}
                                    type={inputType}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                />
                            )}
                        </div>
                    </div>
                </Story>

                <DocSection
                    usage={textFieldUsage}
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
                            name: "size",
                            type: '"sm" | "md" | "lg"',
                            defaultValue: '"md"',
                            description: "입력 필드 크기",
                            control: {
                                type: 'radio',
                                value: size,
                                onChange: (val) => setSize(val as "sm" | "md" | "lg"),
                                options: ["sm", "md", "lg"]
                            }
                        },
                        {
                            name: "type",
                            type: '"text" | "password" | "email"',
                            defaultValue: '"text"',
                            description: "HTML input 타입",
                            ...(!multiline ? {
                                control: {
                                    type: 'select',
                                    value: inputType,
                                    onChange: (val) => setInputType(val as "text" | "password" | "email"),
                                    options: ["text", "password", "email"]
                                }
                            } : {})
                        },
                        {
                            name: "multiline",
                            type: "boolean",
                            defaultValue: "false",
                            description: "여러 줄 입력(textarea) 활성화",
                            control: { type: 'boolean', value: multiline, onChange: (val) => setMultiline(val as boolean) }
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
