"use client";

import React from "react";
import DesignSystemPage from "../../DesignSystemPage";
import { Switch } from "@/components/ui/Switch";
import { usePropControls } from "../../hooks/usePropControls";

export default function SwitchPage() {
    const { values, setValue, getPropItems } = usePropControls({
        variant: {
            type: 'segmented',
            defaultValue: 'block',
            options: ['block', 'basic'],
            description: "'block'은 인터랙티브 로우 스타일(Style 2), 'basic'은 기본 알약 스타일입니다.",
            componentType: '"block" | "basic"'
        },
        label: {
            type: 'text',
            defaultValue: '확대 보기 (팝업)',
            description: "'block' 변형에서 사용되는 메인 텍스트",
            componentType: 'ReactNode'
        },
        description: {
            type: 'text',
            defaultValue: '이미지를 클릭했을 때 크게 보여줍니다.',
            description: "'block' 변형에서 사용되는 보조 설명",
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

    // variant가 block이 아닐 때 label/description 숨김 처리
    const propItems = getPropItems((key, currentValues) => {
        if (currentValues.variant !== 'block') {
            if (key === 'label' || key === 'description') return false;
        }
        return true;
    });

    const usage = `import { Switch } from "@/components/ui/Switch";

<Switch
  variant="${values.variant}"${values.variant === 'block' ? `\n  label="${values.label}"\n  description="${values.description}"` : ''}
  checked={${values.checked}}
  onCheckedChange={setIsChecked}
  disabled={${values.disabled}}
/>`;

    return (
        <DesignSystemPage
            title="Switches"
            description="설정 상태를 켜고 끄는 토글 스위치입니다. 'block'은 박스 영역 전체 클릭이 가능한 Style 2 버전이며, 'basic'은 심플한 알약 모양 스타일입니다."
            playground={{
                title: "Playground",
                description: "옵션을 조절하며 스위치 스타일을 테스트해보세요.",
                canvasStyle: {
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '270px',
                    padding: '40px'
                },
                content: (
                    <div style={{ width: '100%', maxWidth: values.variant === 'block' ? '400px' : 'auto', display: 'flex', justifyContent: 'center' }}>
                        <Switch
                            variant={values.variant as "block" | "basic"}
                            label={values.variant === 'block' ? (values.label as string) : undefined}
                            description={values.variant === 'block' ? (values.description as string) : undefined}
                            checked={values.checked as boolean}
                            onCheckedChange={(val) => setValue('checked', val)}
                            disabled={values.disabled as boolean}
                        />
                    </div>
                ),
                usage: usage,
                props: propItems
            }}
            combinations={{
                title: "FormField 조합 (추천)",
                description: "폼 내부에서 다른 입력 항목들과 함께 쓰일 때는 FormField와 'basic' 변형을 사용합니다.",
                content: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '400px' }}>
                        {/* 1. 수직 레이아웃 (기본) */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>1. 표준 폼 레이아웃 (Vertical)</p>
                            <div style={{ padding: '4px' }}>
                                <div style={{ marginBottom: '8px', fontSize: '13px', fontWeight: 500 }}>서비스 이용 약관</div>
                                <Switch variant="basic" checked={true} />
                                <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>FormField를 통한 라벨링 시 basic 변형을 사용합니다.</p>
                            </div>
                        </div>

                        {/* 2. 수평 레이아웃 (설정 스타일) */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid #eee', paddingTop: '24px' }}>
                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>2. 설정 스타일 (Horizontal)</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#f9f9f9', borderRadius: '12px' }}>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: 500 }}>푸시 알림</div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>중요 공지사항을 받습니다.</div>
                                </div>
                                <Switch variant="basic" checked={false} />
                            </div>
                        </div>
                    </div>
                )
            }}
        />
    );
}
