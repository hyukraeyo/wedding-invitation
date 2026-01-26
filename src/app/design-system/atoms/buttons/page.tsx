"use client";

import React from "react";
import styles from "../../DesignSystem.module.scss";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import Story from "../../Story";
import DocSection from "../../DocSection";

export default function ButtonsPage() {
    const [variant, setVariant] = React.useState<"default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "solid" | "glass">("default");
    const [size, setSize] = React.useState<"sm" | "md" | "lg">("md");
    const [disabled, setDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [fullWidth, setFullWidth] = React.useState(false);
    const [children, setChildren] = React.useState("Button Text");

    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Button</h1>
                <p>사용자 인터랙션을 위한 버튼 컴포넌트입니다. 텍스트와 아이콘을 함께 사용할 수 있습니다.</p>
            </header>

            <div className={styles.storySection}>
                <Story id="playground" title="미리보기">
                    <div className={styles.canvas} style={{ alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                        <div style={{ width: fullWidth ? '100%' : 'auto', maxWidth: '400px', display: 'flex', justifyContent: 'center' }}>
                            <Button
                                variant={variant}
                                size={size}
                                disabled={disabled}
                                loading={loading}
                                fullWidth={fullWidth}
                            >
                                {children}
                            </Button>
                        </div>
                    </div >
                </Story >

                <DocSection
                    usage={`import { Button } from "@/components/ui/Button";\n\n<Button\n  variant="${variant}"\n  size="${size}"\n  \${disabled ? 'disabled' : ''}\n  \${loading ? 'loading' : ''}\n  \${fullWidth ? 'fullWidth' : ''}\n>\n  \${children}\n</Button>`}
                    props={[
                        {
                            name: "children",
                            type: "ReactNode",
                            description: "버튼 내부 텍스트 또는 요소",
                            control: {
                                type: 'text',
                                value: children,
                                onChange: (val: string | boolean) => setChildren(val as string)
                            }
                        },
                        {
                            name: "variant",
                            type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "solid" | "glass"',
                            defaultValue: '"default"',
                            description: "버튼의 시각적 스타일 변형",
                            control: {
                                type: 'select',
                                value: variant,
                                onChange: (val: string | boolean) => setVariant(val as "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "solid" | "glass"),
                                options: ["default", "destructive", "outline", "secondary", "ghost", "link", "solid", "glass"]
                            }
                        },
                        {
                            name: "size",
                            type: '"sm" | "md" | "lg"',
                            defaultValue: '"md"',
                            description: "버튼의 크기",
                            control: {
                                type: 'radio',
                                value: size,
                                onChange: (val: string | boolean) => setSize(val as "sm" | "md" | "lg"),
                                options: ["sm", "md", "lg"]
                            }
                        },
                        {
                            name: "disabled",
                            type: "boolean",
                            defaultValue: "false",
                            description: "비활성화 상태",
                            control: {
                                type: 'boolean',
                                value: disabled,
                                onChange: (val: string | boolean) => setDisabled(val as boolean)
                            }
                        },
                        {
                            name: "loading",
                            type: "boolean",
                            defaultValue: "false",
                            description: "로딩 상태 표시",
                            control: {
                                type: 'boolean',
                                value: loading,
                                onChange: (val: string | boolean) => setLoading(val as boolean)
                            }
                        },
                        {
                            name: "fullWidth",
                            type: "boolean",
                            defaultValue: "false",
                            description: "부모 너비에 맞게 확장 여부",
                            control: {
                                type: 'boolean',
                                value: fullWidth,
                                onChange: (val: string | boolean) => setFullWidth(val as boolean)
                            }
                        },
                    ]}
                />

                <Story title="Sizing" description="다양한 크기의 버튼입니다.">
                    <div className={styles.buttonRow} style={{ alignItems: 'center' }}>
                        <Button size="sm" leftIcon={Plus}>Small</Button>
                        <Button size="md" leftIcon={Plus}>Medium</Button>
                        <Button size="lg" leftIcon={Plus}>Large</Button>
                    </div>
                </Story>
            </div >
        </>
    );
}
