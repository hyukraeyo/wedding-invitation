"use client";

import React from "react";
import DesignSystemPage from "../../DesignSystemPage";
import { Switch } from "@/components/ui/Switch";
import { usePropControls } from "../../hooks/usePropControls";

export default function SwitchPage() {
    const { values, setValue, getPropItems } = usePropControls({
        checked: {
            type: 'boolean',
            defaultValue: false,
            description: "활성화 상태 (Controlled)",
            componentType: 'boolean'
        },
        disabled: {
            type: 'boolean',
            defaultValue: false,
            description: "비활성화 상태 여부",
            componentType: 'boolean'
        },
        onCheckedChange: {
            description: "상태 변경 콜백",
            componentType: "(checked: boolean) => void"
        }
    });

    const usage = `import { Switch } from "@/components/ui/Switch";

<Switch
  checked={${values.checked}}
  onCheckedChange={setIsChecked}
  disabled={${values.disabled}}
/>`;

    return (
        <DesignSystemPage
            title="Switch"
            description="상태를 켜고 끄는 기본적인 토글 스위치입니다."
            playground={{
                title: "Playground",
                description: "기본적인 스위치 동작을 테스트해보세요.",
                canvasStyle: {
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '200px',
                },
                content: (
                    <Switch
                        checked={values.checked as boolean}
                        onCheckedChange={(val) => setValue('checked', val)}
                        disabled={values.disabled as boolean}
                    />
                ),
                usage: usage,
                props: getPropItems()
            }}
        />
    );
}
