"use client";

import React from "react";
import DesignSystemPage from "../../DesignSystemPage";
import { Chip, type ChipProps } from "@/components/ui/Chip";
import { User, Tag, Calendar, MapPin } from "lucide-react";
import { usePropControls } from "../../hooks/usePropControls";

export default function ChipsPage() {
    const { values, getPropItems } = usePropControls({
        children: {
            type: 'text',
            defaultValue: "Chip Label",
            description: "칩 내부 텍스트",
            componentType: 'ReactNode'
        },
        variant: {
            type: 'segmented',
            defaultValue: 'default',
            options: ["default", "primary", "outline", "glass"],
            description: "칩의 시각적 스타일",
            componentType: '"default" | "primary" | "outline" | "glass"'
        },
        clickable: {
            type: 'boolean',
            defaultValue: true,
            description: "클릭 가능 여부",
            componentType: 'boolean'
        },
        disabled: {
            type: 'boolean',
            defaultValue: false,
            description: "비활성화 여부",
            componentType: 'boolean'
        }
    });

    return (
        <DesignSystemPage
            title="Chips"
            description="속성, 태그 또는 간단한 정보를 컴팩트하게 표시하는 컴포넌트입니다. 삭제나 클릭 액션을 포함할 수 있습니다."
            playground={{
                title: "Playground",
                description: "Chip 컴포넌트의 다양한 속성을 실시간으로 테스트해보세요.",
                canvasStyle: { alignItems: 'center', justifyContent: 'center', minHeight: '200px' },
                content: (
                    <Chip
                        variant={values.variant as NonNullable<ChipProps["variant"]>}
                        clickable={values.clickable as boolean}
                        disabled={values.disabled as boolean}
                    >
                        {values.children as string}
                    </Chip>
                ),
                usage: `import { Chip } from "@/components/ui/Chip";\n\n<Chip variant="${values.variant}" ${values.clickable ? 'clickable' : ''}>${values.children}</Chip>`,
                props: getPropItems()
            }}
            combinations={{
                title: "다양한 활용 예시",
                description: "아이콘과 액션을 조합하여 실무에서 활용할 수 있습니다.",
                content: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <div>
                            <h4 style={{ fontSize: '0.8125rem', color: '#71717a', marginBottom: '12px' }}>Icons & Actions</h4>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <Chip leftIcon={<User size={14} />} variant="outline">신랑측</Chip>
                                <Chip leftIcon={<User size={14} />} variant="outline">신부측</Chip>
                                <Chip leftIcon={<MapPin size={14} />} variant="default">강남구</Chip>
                                <Chip
                                    leftIcon={<Tag size={14} />}
                                    variant="primary"
                                    onRemove={() => alert("Removed!")}
                                >
                                    결혼기념일
                                </Chip>
                            </div>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '0.8125rem', color: '#71717a', marginBottom: '12px' }}>Use Cases (Glass 스타일)</h4>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <Chip variant="glass" leftIcon={<MapPin size={14} />}>서울웨딩타워</Chip>
                                <Chip variant="glass" leftIcon={<Calendar size={14} />}>2025.10.25</Chip>
                            </div>
                        </div>
                    </div>
                )
            }}
        />
    );
}
