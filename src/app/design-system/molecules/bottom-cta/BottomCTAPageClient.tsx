"use client"

import React, { useState } from "react"
import { BottomCTA } from "@/components/ui/BottomCTA"

import { Card } from "@/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Separator } from "@/components/ui/Separator"
import { Check, Info, Layers } from "lucide-react"

export function BottomCTAPageClient() {
    const [checked, setChecked] = useState(false);

    return (
        <div style={{ paddingBottom: '200px' }}>
            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px' }}>Bottom CTA</h1>
                <p style={{ fontSize: '1.125rem', color: '#666', lineHeight: 1.6 }}>
                    화면 하단에 고정되는 주요 액션 버튼 컴포넌트입니다. Toss Mini TDS를 참고하여 구현되었습니다.
                </p>
            </header>

            <Tabs defaultValue="single" style={{ marginBottom: '60px' }}>
                <TabsList>
                    <TabsTrigger value="single">Single</TabsTrigger>
                    <TabsTrigger value="double">Double</TabsTrigger>
                    <TabsTrigger value="check">Check First</TabsTrigger>
                    <TabsTrigger value="modal">In Modal</TabsTrigger>
                </TabsList>

                <TabsContent value="single" style={{ marginTop: '24px' }}>
                    <Card style={{ padding: '40px', backgroundColor: '#f9f9fb', borderRadius: '16px', overflow: 'hidden' }}>
                        <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', border: '2px dashed #eee', borderRadius: '12px', marginBottom: '20px' }}>
                            페이지 콘텐츠 영역 (스크롤 시 하단 CTA 고정)
                        </div>
                        <BottomCTA.Single
                            buttonProps={{ children: '동의하고 계속하기' }}
                        />
                    </Card>
                    <div style={{ marginTop: '20px' }}>
                        <h3>Usage</h3>
                        <pre style={{ padding: '16px', backgroundColor: '#f4f4f5', borderRadius: '8px', overflowX: 'auto' }}>
                            <code>{`<BottomCTA.Single 
    buttonProps={{ children: '동의하고 계속하기' }} 
/>`}</code>
                        </pre>
                    </div>
                </TabsContent>

                <TabsContent value="double" style={{ marginTop: '24px' }}>
                    <Card style={{ padding: '40px', backgroundColor: '#f9f9fb', borderRadius: '16px', overflow: 'hidden' }}>
                        <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', border: '2px dashed #eee', borderRadius: '12px', marginBottom: '20px' }}>
                            페이지 콘텐츠 영역
                        </div>
                        <BottomCTA.Double
                            primaryButtonProps={{ children: '확인' }}
                            secondaryButtonProps={{ children: '취소' }}
                        />
                    </Card>
                </TabsContent>

                <TabsContent value="check" style={{ marginTop: '24px' }}>
                    <Card style={{ padding: '40px', backgroundColor: '#f9f9fb', borderRadius: '16px', overflow: 'hidden' }}>
                        <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', border: '2px dashed #eee', borderRadius: '12px', marginBottom: '20px' }}>
                            페이지 콘텐츠 영역
                        </div>
                        <BottomCTA.CheckFirst
                            checkboxId="agree-terms"
                            label="개인정보 수집 및 이용에 동의합니다"
                            checked={checked}
                            onCheckedChange={(val) => setChecked(!!val)}
                            buttonProps={{
                                children: '다음으로',
                                disabled: !checked
                            }}
                        />
                    </Card>
                </TabsContent>

                <TabsContent value="modal" style={{ marginTop: '24px' }}>
                    <Card style={{ padding: '0', maxWidth: '400px', margin: '0 auto', border: '1px solid #eee', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                        <div style={{ padding: '24px' }}>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>모달 내부 사용 예시</h2>
                            <p style={{ color: '#666', fontSize: '0.9375rem', lineHeight: 1.5 }}>
                                모달이나 바텀시트 내부에서는 <code>inModal</code> prop을 전달하여
                                하단 고정 위치를 해제하고 일반적인 패딩과 간격을 적용할 수 있습니다.
                            </p>
                            <Separator style={{ margin: '20px 0' }} />
                            <div style={{ minHeight: '100px' }}>콘텐츠 내용...</div>
                        </div>
                        <BottomCTA.Double
                            inModal
                            primaryButtonProps={{ children: '삭제하기', variant: 'destructive' }}
                            secondaryButtonProps={{ children: '돌아가기' }}
                        />
                    </Card>
                </TabsContent>
            </Tabs>

            <section style={{ marginTop: '60px' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '20px' }}>Features</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                    <FeatureItem
                        icon={<Check size={20} />}
                        title="Safe Area Support"
                        description="iOS 하단 홈 바 영역을 자동으로 계산하여 여백을 제공합니다."
                    />
                    <FeatureItem
                        icon={<Layers size={20} />}
                        title="Glassmorphism"
                        description="배경에 블러 처리가 적용되어 콘텐츠와 자연스럽게 어우러집니다."
                    />
                    <FeatureItem
                        icon={<Info size={20} />}
                        title="Conditional Gradient"
                        description="콘텐츠 상단에 그라데이션을 추가하여 시인성을 높일 수 있습니다."
                    />
                </div>
            </section>
        </div>
    )
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <Card style={{ padding: '20px', borderRadius: '12px' }}>
            <div style={{ color: '#FBC02D', marginBottom: '12px' }}>{icon}</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '8px' }}>{title}</h3>
            <p style={{ fontSize: '0.875rem', color: '#666', lineHeight: 1.5 }}>{description}</p>
        </Card>
    )
}
