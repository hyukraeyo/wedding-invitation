"use client";

import React from "react";
import DesignSystemPage from "../../DesignSystemPage";
import { Toggle } from "@/components/ui/Toggle";
import { usePropControls } from "../../hooks/usePropControls";

export default function TogglesPage() {
    const { values, setValue, getPropItems } = usePropControls({
        pressed: {
            type: 'boolean',
            defaultValue: true,
            description: "활성화 여부",
            componentType: 'boolean'
        },
        size: {
            type: 'segmented',
            defaultValue: 'md',
            options: ['sm', 'md', 'lg', 'square'],
            description: "토글 크기",
            componentType: '"sm" | "md" | "lg" | "square"'
        },
        onPressedChange: {
            description: "상태 변경 콜백",
            componentType: '(pressed: boolean) => void'
        }
    });

    const usage = `import { Toggle } from "@/components/ui/Toggle";\n\n<Toggle\n  pressed={${values.pressed}}\n  onPressedChange={setPressed}\n  size="${values.size}"\n>\n  Toggle\n</Toggle>`;

    return (
        <DesignSystemPage
            title="Toggles"
            description="단일 선택이나 상태 전환을 위한 세그먼트 형태의 컨트롤입니다."
            playground={{
                title: "인터랙티브 플레이그라운드",
                description: "옵션을 조절하며 토글 스타일을 테스트해보세요.",
                canvasStyle: {
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '200px',
                },
                content: (
                    <Toggle
                        size={values.size as "sm" | "md" | "lg" | "square"}
                        pressed={values.pressed as boolean}
                        onPressedChange={(pressed) => setValue('pressed', pressed)}
                    >
                        Toggle Button
                    </Toggle>
                ),
                usage: usage,
                props: getPropItems()
            }}
            combinations={{
                title: "다양한 크기",
                description: "시스템에서 제공하는 기본 크기들입니다.",
                content: (
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <Toggle size="sm">Small</Toggle>
                        <Toggle size="md">Medium</Toggle>
                        <Toggle size="lg">Large</Toggle>
                        <Toggle size="square">SQ</Toggle>
                    </div>
                )
            }}
        />
    );
}
