"use client";

import React from "react";
import DesignSystemPage from "../../DesignSystemPage";
import { Button, type ButtonProps } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { usePropControls } from "../../hooks/usePropControls";

export default function ButtonsPage() {
    const { values, getPropItems } = usePropControls({
        children: {
            type: 'text',
            defaultValue: "Button Text",
            description: "버튼 내부 텍스트 또는 요소",
            componentType: 'ReactNode'
        },
        variant: {
            type: 'segmented',
            defaultValue: 'default',
            options: ["default", "destructive", "outline", "secondary", "ghost", "link", "solid", "glass"],
            description: "버튼의 시각적 스타일 변형",
            componentType: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "solid" | "glass"'
        },
        size: {
            type: 'segmented',
            defaultValue: 'md',
            options: ["sm", "md", "lg"],
            description: "버튼의 크기",
            componentType: '"sm" | "md" | "lg"'
        },
        disabled: {
            type: 'boolean',
            defaultValue: false,
            description: "비활성화 상태",
            componentType: 'boolean'
        },
        loading: {
            type: 'boolean',
            defaultValue: false,
            description: "로딩 상태 표시",
            componentType: 'boolean'
        },
        fullWidth: {
            type: 'boolean',
            defaultValue: false,
            description: "부모 너비에 맞게 확장 여부",
            componentType: 'boolean'
        }
    });

    return (
        <DesignSystemPage
            title="Buttons"
            description="사용자 인터랙션을 위한 버튼 컴포넌트입니다. 텍스트와 아이콘을 함께 사용할 수 있습니다."
            playground={{
                title: "Playground",
                description: "버튼의 다양한 속성을 테스트해보세요.",
                canvasStyle: { alignItems: 'center', justifyContent: 'center', minHeight: '300px' },
                content: (
                    <div style={{ width: (values.fullWidth as boolean) ? '100%' : 'auto', maxWidth: '400px', display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant={values.variant as NonNullable<ButtonProps["variant"]>}
                            size={values.size as NonNullable<ButtonProps["size"]>}
                            disabled={values.disabled as boolean}
                            loading={values.loading as boolean}
                            fullWidth={values.fullWidth as boolean}
                        >
                            {values.children as string}
                        </Button>
                    </div>
                ),
                usage: `import { Button } from "@/components/ui/Button";\n\n<Button\n  variant="${values.variant}"\n  size="${values.size}"\n  ${values.disabled ? 'disabled' : ''}\n  ${values.loading ? 'loading' : ''}\n  ${values.fullWidth ? 'fullWidth' : ''}\n>\n  ${values.children}\n</Button>`,
                props: getPropItems()
            }}
            combinations={{
                title: "다양한 크기",
                description: "아이콘과 함께 사용하는 크기 예시입니다.",
                content: (
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <Button size="sm" leftIcon={Plus}>Small</Button>
                        <Button size="md" leftIcon={Plus}>Medium</Button>
                        <Button size="lg" leftIcon={Plus}>Large</Button>
                    </div>
                )
            }}
        />
    );
}
