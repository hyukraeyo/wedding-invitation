"use client";

import React, { useState } from "react";
import DesignSystemPage from "../../DesignSystemPage";
import { Switch } from "@/components/ui/Switch";
import { FormField } from "@/components/common/FormField";

export default function SwitchPage() {
    const [isChecked, setIsChecked] = useState(false);
    const [variant, setVariant] = useState<"default" | "basic">("default");
    const [label, setLabel] = useState("확대 보기 (팝업)");
    const [description, setDescription] = useState("이미지를 클릭했을 때 크게 보여줍니다.");
    const [disabled, setDisabled] = useState(false);

    const usage = `import { Switch } from "@/components/ui/Switch";

<Switch
  variant="${variant}"
  ${variant === 'default' ? `label="${label}"\n  description="${description}"` : ''}
  checked={isChecked}
  onCheckedChange={setIsChecked}
  disabled={${disabled}}
/>`;

    return (
        <DesignSystemPage
            title="Switch (스위치)"
            description="설정 상태를 켜고 끄는 토글 스위치입니다. 'default'는 박스 영역 전체 클릭이 가능한 Style 2 버전이며, 'basic'은 심플한 알약 모양 스타일입니다."
            playground={{
                title: "인터랙티브 플레이그라운드",
                description: "옵션을 조절하며 스위치 스타일을 테스트해보세요.",
                canvasStyle: {
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '240px',
                    backgroundColor: variant === 'default' ? '#f8f9fa' : 'transparent',
                    padding: '40px'
                },
                content: (
                    <div style={{ width: '100%', maxWidth: variant === 'default' ? '400px' : 'auto', display: 'flex', justifyContent: 'center' }}>
                        <Switch
                            variant={variant}
                            label={variant === 'default' ? label : undefined}
                            description={variant === 'default' ? description : undefined}
                            checked={isChecked}
                            onCheckedChange={setIsChecked}
                            disabled={disabled}
                        />
                    </div>
                ),
                usage: usage,
                props: [
                    {
                        name: "variant",
                        type: '"default" | "basic"',
                        description: "'default'는 인터랙티브 로우 스타일, 'basic'은 기본 알약 스타일입니다.",
                        control: {
                            type: 'segmented',
                            value: variant,
                            onChange: (val) => setVariant(val as "default" | "basic"),
                            options: ["default", "basic"]
                        }
                    },
                    {
                        name: "label",
                        type: "ReactNode",
                        description: "'default' 변형에서 사용되는 메인 텍스트",
                        control: { type: 'text', value: label, onChange: (val) => setLabel(val as string) }
                    },
                    {
                        name: "description",
                        type: "ReactNode",
                        description: "'default' 변형에서 사용되는 보조 설명",
                        control: { type: 'text', value: description, onChange: (val) => setDescription(val as string) }
                    },
                    {
                        name: "disabled",
                        type: "boolean",
                        description: "비활성화 상태 여부",
                        control: { type: 'boolean', value: disabled, onChange: (val) => setDisabled(val as boolean) }
                    },
                    {
                        name: "checked",
                        type: "boolean",
                        description: "활성화 상태 (Controlled)",
                        control: { type: 'boolean', value: isChecked, onChange: (val) => setIsChecked(val as boolean) }
                    }
                ]
            }}
            combinations={{
                title: "FormField 조합 (추천)",
                description: "라벨과 설명이 필요한 경우 FormField와 함께 배치하여 일관된 레이아웃을 구성합니다.",
                content: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '400px', backgroundColor: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #eee' }}>
                        <FormField label="확대 보기 (팝업)" layout="horizontal" align="center">
                            <Switch checked={isChecked} onCheckedChange={setIsChecked} />
                        </FormField>
                        <FormField label="자동 재생" description="다음 섹션으로 넘어갈 때 미디어를 자동으로 재생합니다." layout="horizontal">
                            <Switch checked={isChecked} onCheckedChange={setIsChecked} />
                        </FormField>
                        <FormField label="비활성 옵션" layout="horizontal" align="center">
                            <Switch checked={false} disabled />
                        </FormField>
                    </div>
                )
            }}
        />
    );
}
