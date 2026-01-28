"use client";

import React from "react";
import DesignSystemPage from "../../DesignSystemPage";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { usePropControls } from "../../hooks/usePropControls";

export function LabelPageClient() {
    const { values, getPropItems } = usePropControls({
        children: {
            type: 'text',
            defaultValue: "성함",
            description: "라벨의 텍스트 내용",
            componentType: 'string'
        }
    });

    return (
        <DesignSystemPage
            title="Label"
            description="폼 요소와 연결되어 접근성과 가독성을 높여주는 라벨 컴포넌트입니다. Radix UI Label을 기반으로 하며, 클릭 시 연결된 입력 필드로 포커스를 이동시킵니다."
            playground={{
                title: "Playground",
                description: "라벨의 내용을 변경하고 입력 필드와 연결된 모습을 확인해보세요.",
                canvasStyle: { alignItems: 'center', justifyContent: 'center', minHeight: '200px' },
                content: (
                    <div style={{ width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <Label htmlFor="playground-input">{values.children as string}</Label>
                        <Input id="playground-input" placeholder="이름을 입력하세요" />
                    </div>
                ),
                usage: `import { Label } from "@/components/ui/Label";\nimport { Input } from "@/components/ui/Input";\n\n<div className="flex flex-col gap-2">\n  <Label htmlFor="name">${values.children}</Label>\n  <Input id="name" placeholder="내용 입력..." />\n</div>`,
                props: getPropItems()
            }}
            combinations={{
                title: "다양한 활용 예시",
                description: "필수 입력 항목이나 다른 입력 요소와의 조합 예시입니다.",
                content: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '300px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <Label htmlFor="required-field">
                                이메일
                                <span style={{ color: 'var(--red-500)', marginLeft: '4px' }}>*</span>
                            </Label>
                            <Input id="required-field" type="email" placeholder="example@email.com" />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <Label
                                htmlFor="disabled-field"
                                style={{ opacity: 0.5, cursor: 'not-allowed' }}
                            >
                                비활성된 필드
                            </Label>
                            <Input id="disabled-field" disabled placeholder="입력할 수 없습니다" />
                        </div>
                    </div>
                )
            }}
        />
    );
}
