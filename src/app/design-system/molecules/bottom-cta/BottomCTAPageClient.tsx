"use client"

import React, { useState } from "react"
import DesignSystemPage from "../../DesignSystemPage"
import { BottomCTA } from "@/components/ui/BottomCTA"
import { usePropControls } from "../../hooks/usePropControls"
import { Separator } from "@/components/ui/Separator"
import Story from "../../Story"

export function BottomCTAPageClient() {
    const [checked, setChecked] = useState(false);

    const { values, getPropItems } = usePropControls({
        type: {
            type: 'segmented',
            defaultValue: 'single',
            options: ['single', 'double', 'checkFirst'],
            description: 'CTA 버튼의 구성 타입',
            componentType: '"single" | "double" | "checkFirst"'
        },
        primaryText: {
            type: 'text',
            defaultValue: '동의하고 계속하기',
            description: '주요 버튼 텍스트',
            componentType: 'string'
        },
        secondaryText: {
            type: 'text',
            defaultValue: '취소',
            description: '보조 버튼 텍스트 (Double 전용)',
            componentType: 'string'
        },
        isFixed: {
            type: 'boolean',
            defaultValue: false,
            description: '화면 하단 고정 여부 (Playground에서는 false 권장)',
            componentType: 'boolean'
        },
        inModal: {
            type: 'boolean',
            defaultValue: true,
            description: '모달 내부 통합형 스타일 적용 여부',
            componentType: 'boolean'
        }
    });

    const renderCTA = () => {
        const commonProps = {
            isFixed: values.isFixed as boolean,
            inModal: values.inModal as boolean,
        };

        if (values.type === 'single') {
            return (
                <BottomCTA.Single
                    {...commonProps}
                    buttonProps={{ children: values.primaryText as string }}
                />
            );
        }

        if (values.type === 'double') {
            return (
                <BottomCTA.Double
                    {...commonProps}
                    primaryButtonProps={{ children: values.primaryText as string }}
                    secondaryButtonProps={{ children: values.secondaryText as string }}
                />
            );
        }

        if (values.type === 'checkFirst') {
            return (
                <BottomCTA.CheckFirst
                    {...commonProps}
                    checkboxId="playground-check"
                    label="개인정보 수집 및 이용에 동의합니다"
                    checked={checked}
                    onCheckedChange={setChecked}
                    buttonProps={{
                        children: values.primaryText as string,
                        disabled: !checked
                    }}
                />
            );
        }

        return null;
    };

    const getUsageCode = () => {
        if (values.type === 'single') {
            return `<BottomCTA.Single\n  buttonProps={{ children: '${values.primaryText}' }}\n/>`;
        }
        if (values.type === 'double') {
            return `<BottomCTA.Double\n  primaryButtonProps={{ children: '${values.primaryText}' }}\n  secondaryButtonProps={{ children: '${values.secondaryText}' }}\n/>`;
        }
        return `<BottomCTA.CheckFirst\n  label="동의 문구"\n  buttonProps={{ children: '${values.primaryText}' }}\n/>`;
    };

    return (
        <DesignSystemPage
            title="Bottom CTA"
            description="화면 하단에 고정되는 주요 액션 버튼 컴포넌트입니다. Toss Mini TDS를 참고하여 고풍스럽고 세련된 애니메이션과 유리 질감(Glassmorphism)이 적용되었습니다."
            playground={{
                title: "Playground",
                description: "CTA 타입과 속성을 실시간으로 확인해보세요.",
                canvasStyle: {
                    flexDirection: 'column',
                    padding: '60px 20px',
                    backgroundColor: '#FFFBEA',
                    borderRadius: '24px',
                    position: 'relative',
                    overflow: 'hidden'
                },
                content: (
                    <div style={{
                        width: '100%',
                        maxWidth: '400px',
                        margin: '0 auto',
                        backgroundColor: '#fff',
                        borderRadius: values.inModal ? '0 0 24px 24px' : '24px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ padding: '24px' }}>
                            <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B7355', border: '2px dashed #EEDDAA', borderRadius: '16px', backgroundColor: 'rgba(251, 192, 45, 0.05)', fontSize: '0.875rem' }}>
                                콘텐츠 영역
                            </div>
                        </div>
                        {renderCTA()}
                    </div>
                ),
                usage: getUsageCode(),
                props: getPropItems()
            }}
            combinations={{
                title: "Use Cases",
                description: "모달 내부 또는 서비스의 다양한 맥락에서 활용되는 예시입니다.",
                content: (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
                        {/* Modal Use Case */}
                        <div style={{ padding: '0', border: '1px solid #f0f0f0', borderRadius: '24px', overflow: 'hidden', backgroundColor: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.04)' }}>
                            <div style={{ padding: '24px' }}>
                                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>모달 내부 (Double)</h4>
                                <p style={{ fontSize: '0.875rem', color: '#666', lineHeight: 1.6 }}>
                                    <code>inModal</code> 프롭을 사용하면 고정 위치가 해제되고 모달 레이아웃에 맞춰집니다.
                                </p>
                            </div>
                            <BottomCTA.Double
                                inModal
                                primaryButtonProps={{ children: '삭제하기', variant: 'destructive' }}
                                secondaryButtonProps={{ children: '돌아가기' }}
                            />
                        </div>

                        {/* Secondary Style Use Case */}
                        <div style={{ padding: '0', border: '1px solid #f0f0f0', borderRadius: '24px', overflow: 'hidden', backgroundColor: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.04)' }}>
                            <div style={{ padding: '24px' }}>
                                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>보조 버튼 스타일</h4>
                                <p style={{ fontSize: '0.875rem', color: '#666', lineHeight: 1.6 }}>
                                    <code>secondary</code> 변형을 활용하여 덜 강조된 액션을 표현할 수 있습니다.
                                </p>
                            </div>
                            <BottomCTA.Single
                                inModal
                                buttonProps={{ children: '나중에 하기', variant: 'secondary' }}
                            />
                        </div>
                    </div>
                )
            }}
        >
            <Story
                title="Premium Style"
                description="바나나웨딩만의 독보적인 프리미엄 스타일이 적용되었습니다."
            >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    <div style={{ padding: '20px', borderRadius: '16px', backgroundColor: '#fff', border: '1px solid #f0f0f0' }}>
                        <h5 style={{ fontWeight: 600, marginBottom: '8px' }}>Glassmorphism</h5>
                        <p style={{ fontSize: '0.8125rem', color: '#71717a' }}>배경이 투명하게 비치는 블러 효과가 적용되어 고급스러운 느낌을 줍니다.</p>
                    </div>
                    <div style={{ padding: '20px', borderRadius: '16px', backgroundColor: '#fff', border: '1px solid #f0f0f0' }}>
                        <h5 style={{ fontWeight: 600, marginBottom: '8px' }}>iOS Animation</h5>
                        <p style={{ fontSize: '0.8125rem', color: '#71717a' }}>iOS 스타일의 부드러운 반응형 애니메이션이 터치감을 극대화합니다.</p>
                    </div>
                </div>
            </Story>
        </DesignSystemPage>
    )
}
