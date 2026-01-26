"use client";

import React from "react";
import DesignSystemPage from "../../DesignSystemPage";
import { Switch } from "@/components/ui/Switch";
import { usePropControls } from "../../hooks/usePropControls";

export default function SwitchPage() {
    const { values, setValue, getPropItems } = usePropControls({
        variant: {
            type: 'segmented',
            defaultValue: 'default',
            options: ['default', 'basic'],
            description: "'default'는 인터랙티브 로우 스타일(Style 2), 'basic'은 기본 알약 스타일입니다.",
            componentType: '"default" | "basic"'
        },
        label: {
            type: 'text',
            defaultValue: '확대 보기 (팝업)',
            description: "'default' 변형에서 사용되는 메인 텍스트",
            componentType: 'ReactNode'
        },
        description: {
            type: 'text',
            defaultValue: '이미지를 클릭했을 때 크게 보여줍니다.',
            description: "'default' 변형에서 사용되는 보조 설명",
            componentType: 'ReactNode'
        },
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

    // variant가 default가 아닐 때 label/description 숨김 처리
    const propItems = getPropItems((key, currentValues) => {
        if (currentValues.variant !== 'default') {
            if (key === 'label' || key === 'description') return false;
        }
        return true;
    });

    const usage = `import { Switch } from "@/components/ui/Switch";

<Switch
  variant="${values.variant}"${values.variant === 'default' ? `\n  label="${values.label}"\n  description="${values.description}"` : ''}
  checked={${values.checked}}
  onCheckedChange={setIsChecked}
  disabled={${values.disabled}}
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
                    minHeight: '270px',
                    backgroundColor: values.variant === 'default' ? '#f8f9fa' : 'transparent',
                    padding: '40px'
                },
                content: (
                    <div style={{ width: '100%', maxWidth: values.variant === 'default' ? '400px' : 'auto', display: 'flex', justifyContent: 'center' }}>
                        <Switch
                            variant={values.variant}
                            label={values.variant === 'default' ? values.label : undefined}
                            description={values.variant === 'default' ? values.description : undefined}
                            checked={values.checked}
                            onCheckedChange={(val) => setValue('checked', val)}
                            disabled={values.disabled}
                        />
                    </div>
                ),
                usage: usage,
                props: propItems
            }}
            combinations={{
                title: "FormField 조합 (추천)",
                description: "라벨과 설명이 필요한 경우 FormField와 함께 배치하여 일관된 레이아웃을 구성합니다.",
                content: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '400px', backgroundColor: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #eee' }}>
                        <div style={{ padding: '0 0 16px' }}>
                            <Switch checked={true} variant="default" label="기본 사용 (Style 2)" description="가장 권장되는 형태입니다." />
                        </div>
                        <div style={{ padding: '0 0 16px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
                            <Switch checked={false} variant="basic" aria-label="Basic switch" />
                            <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>Basic Style</p>
                        </div>
                    </div>
                )
            }}
        />
    );
}
