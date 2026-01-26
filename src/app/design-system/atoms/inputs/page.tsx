"use client";

import React, { useState } from "react";
import styles from "../../DesignSystem.module.scss";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import Story from "../../Story";
import DocSection from "../../DocSection";

export default function InputsPage() {
    const [placeholder, setPlaceholder] = useState("내용을 입력해주세요");
    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState(false);
    const [inputType, setInputType] = useState<"text" | "password" | "email">("text");
    const [size, setSize] = useState<"sm" | "md" | "lg">("md");

    const inputUsage = `import { Input } from "@/components/ui/Input";

<Input
  placeholder="${placeholder}"
  ${error ? 'error' : ''}
  ${disabled ? 'disabled' : ''}
  type="${inputType}"
  size="${size}"
/>`;

    const textareaUsage = `import { Textarea } from "@/components/ui/Textarea";

<Textarea
  placeholder="긴 내용을 입력해주세요"
  ${error ? 'error' : ''}
  ${disabled ? 'disabled' : ''}
  size="${size}"
/>`;

    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Input</h1>
                <p className={styles.textMuted}>
                    스타일만 적용된 기본 Input 및 Textarea 컴포넌트입니다. <br />
                    실제 폼에서는 <strong>FormField</strong> 컴포넌트와 함께 사용하는 것을 권장합니다.
                </p>
            </header>

            <div className={styles.storySection}>
                <Story id="input" title="Input">
                    <div className={styles.canvas} style={{ alignItems: 'center', justifyContent: 'center', minHeight: '150px' }}>
                        <div style={{ width: '100%', maxWidth: '400px' }}>
                            <Input
                                placeholder={placeholder}
                                error={error}
                                disabled={disabled}
                                type={inputType}
                                size={size}
                            />
                        </div>
                    </div>
                </Story>

                <DocSection
                    usage={inputUsage}
                    props={[
                        {
                            name: "placeholder",
                            type: "string",
                            description: "입력 필드 힌트 텍스트",
                            control: { type: 'text', value: placeholder, onChange: (val) => setPlaceholder(val as string) }
                        },
                        {
                            name: "type",
                            type: '"text" | "password" | "email"',
                            description: "HTML Input 타입",
                            control: {
                                type: 'select',
                                value: inputType,
                                onChange: (val) => setInputType(val as "text" | "password" | "email"),
                                options: ["text", "password", "email"]
                            }
                        },
                        {
                            name: "size",
                            type: '"sm" | "md" | "lg"',
                            defaultValue: '"md"',
                            description: "입력 필드 크기",
                            control: {
                                type: 'segmented',
                                value: size,
                                onChange: (val) => setSize(val as "sm" | "md" | "lg"),
                                options: ["sm", "md", "lg"]
                            }
                        },
                        {
                            name: "error",
                            type: "boolean",
                            description: "에러 상태 여부",
                            control: { type: 'boolean', value: error, onChange: (val) => setError(val as boolean) }
                        },
                        {
                            name: "disabled",
                            type: "boolean",
                            description: "비활성화 여부",
                            control: { type: 'boolean', value: disabled, onChange: (val) => setDisabled(val as boolean) }
                        },
                    ]}
                />

                <Story id="textarea" title="Textarea">
                    <div className={styles.canvas} style={{ alignItems: 'center', justifyContent: 'center', minHeight: '150px' }}>
                        <div style={{ width: '100%', maxWidth: '400px' }}>
                            <Textarea
                                placeholder="긴 내용을 입력해주세요"
                                error={error}
                                disabled={disabled}
                                size={size}
                            />
                        </div>
                    </div>
                </Story>
                <DocSection usage={textareaUsage} />
            </div>
        </>
    );
}
