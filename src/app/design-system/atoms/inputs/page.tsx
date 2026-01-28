"use client";

import React from "react";
import DesignSystemPage from "../../DesignSystemPage";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { FormField } from "@/components/common/FormField";
import { usePropControls } from "../../hooks/usePropControls";

export default function InputsPage() {
    const { values, getPropItems } = usePropControls({
        label: {
            type: 'text',
            defaultValue: "레이블",
            description: "입력 필드 레이블 (Floating 변이에서 사용)",
            componentType: 'string'
        },
        placeholder: {
            type: 'text',
            defaultValue: "내용을 입력해주세요",
            description: "입력 필드 힌트 텍스트",
            componentType: 'string'
        },
        type: {
            type: 'segmented',
            defaultValue: 'text',
            options: ['text', 'password', 'email', 'tel', 'url', 'date', 'number'],
            description: "HTML Input 타입",
            componentType: '"text" | "password" | "email" | "tel" | "url" | "date" | "number"'
        },
        variant: {
            type: 'segmented',
            defaultValue: 'default',
            options: ['default', 'floating'],
            description: "입력 필드 스타일 변이",
            componentType: '"default" | "floating"'
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

    const isFloating = values.variant === 'floating';

    const inputUsage = isFloating
        ? `import { FormField } from "@/components/common/FormField";
import { Input } from "@/components/ui/Input";

<FormField 
  label="${values.label}" 
  variant="floating"
>
  <Input
    placeholder="${values.placeholder}"
    ${values.error ? 'error' : ''}
    ${values.disabled ? 'disabled' : ''}
    type="${values.type}"
  />
</FormField>`
        : `import { Input } from "@/components/ui/Input";

<Input
  placeholder="${values.placeholder}"
  ${values.error ? 'error' : ''}
  ${values.disabled ? 'disabled' : ''}
  type="${values.type}"
  size="${values.size}"
/>`;

    return (
        <DesignSystemPage
            title="Text Inputs"
            description="스타일만 적용된 기본 Input 및 Textarea 컴포넌트입니다. Floating 레이블 등 고도화된 기능은 FormField와 함께 사용하세요."
            playground={{
                title: "Playground",
                description: "Input 컴포넌트의 다양한 속성을 테스트해보세요.",
                canvasStyle: { alignItems: 'center', justifyContent: 'center', minHeight: '200px' },
                content: (
                    <div style={{ width: '100%', maxWidth: '400px' }}>
                        {isFloating ? (
                            <div style={{ padding: '20px 0' }}>
                                <FormField
                                    label={values.label as string}
                                    variant="floating"
                                    error={values.error ? "에러 메시지" : undefined}
                                >
                                    <Input
                                        placeholder={values.placeholder as string}
                                        disabled={values.disabled as boolean}
                                        type={values.type as "text" | "password" | "email" | "tel" | "url" | "date" | "number"}
                                        size={values.size as "sm" | "md" | "lg"}
                                    />
                                </FormField>
                            </div>
                        ) : (
                            <Input
                                placeholder={values.placeholder as string}
                                error={values.error as boolean}
                                disabled={values.disabled as boolean}
                                type={values.type as "text" | "password" | "email" | "tel" | "url" | "date" | "number"}
                                size={values.size as "sm" | "md" | "lg"}
                            />
                        )}
                    </div>
                ),
                usage: inputUsage,
                props: getPropItems()
            }}
            combinations={{
                title: "Textarea",
                description: "긴 텍스트 입력을 위한 컴포넌트입니다.",
                content: (
                    <div style={{ width: '100%', maxWidth: '400px' }}>
                        <Textarea
                            placeholder="긴 내용을 입력해주세요"
                            error={values.error as boolean}
                            disabled={values.disabled as boolean}
                            size={values.size as "sm" | "md" | "lg"}
                        />
                    </div>
                )
            }}
        />
    );
}
