"use client";

import React from "react";
import styles from "../../DesignSystem.module.scss";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import Story from "../../Story";
import DocSection from "../../DocSection";
import { usePropControls } from "../../hooks/usePropControls";

export default function InputsPage() {
    const { values, getPropItems } = usePropControls({
        placeholder: {
            type: 'text',
            defaultValue: "내용을 입력해주세요",
            description: "입력 필드 힌트 텍스트",
            componentType: 'string'
        },
        type: {
            type: 'segmented',
            defaultValue: 'text',
            options: ['text', 'password', 'email'],
            description: "HTML Input 타입",
            componentType: '"text" | "password" | "email"'
        },
        size: {
            type: 'segmented',
            defaultValue: 'md',
            options: ['sm', 'md', 'lg'],
            description: "입력 필드 크기",
            componentType: '"sm" | "md" | "lg"'
        },
        error: {
            type: 'boolean',
            defaultValue: false,
            description: "에러 상태 여부",
            componentType: 'boolean'
        },
        disabled: {
            type: 'boolean',
            defaultValue: false,
            description: "비활성화 여부",
            componentType: 'boolean'
        }
    });

    const inputUsage = `import { Input } from "@/components/ui/Input";

<Input
  placeholder="${values.placeholder}"
  ${values.error ? 'error' : ''}
  ${values.disabled ? 'disabled' : ''}
  type="${values.type}"
  size="${values.size}"
/>`;

    const textareaUsage = `import { Textarea } from "@/components/ui/Textarea";

<Textarea
  placeholder="긴 내용을 입력해주세요"
  ${values.error ? 'error' : ''}
  ${values.disabled ? 'disabled' : ''}
  size="${values.size}"
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
                                placeholder={values.placeholder as string}
                                error={values.error as boolean}
                                disabled={values.disabled as boolean}
                                type={values.type as "text" | "password" | "email"}
                                size={values.size as "sm" | "md" | "lg"}
                            />
                        </div>
                    </div>
                </Story>

                <DocSection
                    usage={inputUsage}
                    props={getPropItems()}
                />

                <Story id="textarea" title="Textarea">
                    <div className={styles.canvas} style={{ alignItems: 'center', justifyContent: 'center', minHeight: '150px' }}>
                        <div style={{ width: '100%', maxWidth: '400px' }}>
                            <Textarea
                                placeholder="긴 내용을 입력해주세요"
                                error={values.error as boolean}
                                disabled={values.disabled as boolean}
                                size={values.size as "sm" | "md" | "lg"}
                            />
                        </div>
                    </div>
                </Story>
                <DocSection usage={textareaUsage} />
            </div>
        </>
    );
}
