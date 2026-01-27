"use client";

import React from "react";
import DesignSystemPage from "../../DesignSystemPage";
import { SwitchField } from "@/components/ui/SwitchField";
import { usePropControls } from "../../hooks/usePropControls";

export default function SwitchFieldPage() {
    const { values, setValue, getPropItems } = usePropControls({
        label: {
            type: 'text',
            defaultValue: '설정 항목',
            description: "라벨 텍스트",
            componentType: 'ReactNode'
        },
        description: {
            type: 'text',
            defaultValue: '설정에 대한 상세 설명입니다.',
            description: "보조 설명 텍스트",
            componentType: 'ReactNode'
        },
        checked: {
            type: 'boolean',
            defaultValue: false,
            description: "활성화 상태",
            componentType: 'boolean'
        },
        disabled: {
            type: 'boolean',
            defaultValue: false,
            description: "비활성화 여부",
            componentType: 'boolean'
        }
    });

    const usage = `import { SwitchField } from "@/components/ui/SwitchField";

<SwitchField
  label="${values.label}"
  description="${values.description}"
  checked={${values.checked}}
  onCheckedChange={setIsChecked}
  disabled={${values.disabled}}
/>`;

    return (
        <DesignSystemPage
            title="SwitchField"
            description="라벨, 설명, 스위치를 포함하는 설정용 행(Row) 컴포넌트입니다."
            playground={{
                title: "Playground",
                description: "SwitchField의 다양한 옵션을 테스트해보세요.",
                canvasStyle: {
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px',
                    backgroundColor: '#f4f4f5'
                },
                content: (
                    <div style={{ width: '100%', maxWidth: '400px' }}>
                        <SwitchField
                            label={values.label as string}
                            description={values.description as string}
                            checked={values.checked as boolean}
                            onCheckedChange={(val) => setValue('checked', val)}
                            disabled={values.disabled as boolean}
                        />
                    </div>
                ),
                usage: usage,
                props: getPropItems()
            }}
            combinations={{
                title: "Usage Examples",
                description: "설정 화면 등에서 자주 사용되는 패턴입니다.",
                content: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '400px' }}>
                        <SwitchField
                            label="알림 설정"
                            description="푸시 알림을 받습니다."
                            checked={true}
                        />
                        <SwitchField
                            label="다크 모드"
                            description="어두운 테마를 사용합니다."
                            checked={false}
                        />
                    </div>
                )
            }}
        />
    );
}
