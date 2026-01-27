"use client";

import React from "react";
import DesignSystemPage from "../../DesignSystemPage";
import { Badge, type BadgeProps } from "@/components/ui/Badge";
import { usePropControls } from "../../hooks/usePropControls";

export default function BadgesPage() {
    const { values, getPropItems } = usePropControls({
        children: {
            type: 'text',
            defaultValue: "Approved",
            description: "배지 텍스트",
            componentType: 'ReactNode'
        },
        variant: {
            type: 'segmented',
            defaultValue: 'default',
            options: ["default", "secondary", "destructive", "outline", "success"],
            description: "배지의 시각적 스타일 변형",
            componentType: '"default" | "secondary" | "destructive" | "outline" | "success"'
        }
    });

    return (
        <DesignSystemPage
            title="Badges"
            description="상태나 카테고리를 표시하는 작은 시각적 라벨 컴포넌트입니다. 배지는 주로 읽기 전용 정보를 표시하는 데 사용됩니다."
            playground={{
                title: "Playground",
                description: "배지 컴포넌트의 스타일을 실시간으로 조절해보세요.",
                canvasStyle: { alignItems: 'center', justifyContent: 'center', minHeight: '200px' },
                content: (
                    <Badge variant={values.variant as NonNullable<BadgeProps["variant"]>}>
                        {values.children as string}
                    </Badge>
                ),
                usage: `import { Badge } from "@/components/ui/Badge";\n\n<Badge variant="${values.variant}">${values.children}</Badge>`,
                props: getPropItems()
            }}
            combinations={{
                title: "Semantic Variants",
                description: "의미에 따른 배지 스타일 가이드입니다.",
                content: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <Badge variant="default">Default</Badge>
                            <Badge variant="secondary">Secondary</Badge>
                            <Badge variant="outline">Outline</Badge>
                            <Badge variant="destructive">Destructive</Badge>
                            <Badge variant="success">Success</Badge>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid #eee', paddingTop: '24px' }}>
                            <h4 style={{ fontSize: '0.875rem', fontWeight: 600 }}>실무 활용 사례</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Badge variant="success">APPROVED</Badge>
                                    <span style={{ fontSize: '0.75rem', color: '#71717a' }}>공개 완료</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Badge>PENDING</Badge>
                                    <span style={{ fontSize: '0.75rem', color: '#71717a' }}>승인 대기 중</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Badge variant="destructive">REJECTED</Badge>
                                    <span style={{ fontSize: '0.75rem', color: '#71717a' }}>수정 요청</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Badge variant="secondary">DRAFT</Badge>
                                    <span style={{ fontSize: '0.75rem', color: '#71717a' }}>임시 저장</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }}
        />
    );
}
