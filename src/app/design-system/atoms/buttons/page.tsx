"use client";

import React from "react";
import styles from "../../DesignSystem.module.scss";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { Label } from "@/components/ui/Label";
import { Banana, Check, ArrowRight, Download, Heart, Settings } from "lucide-react";
import Story from "../../Story";
import DocSection from "../../DocSection";

export default function ButtonsPage() {
    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Buttons</h1>
                <p>사용자 인터랙션을 위한 버튼 컴포넌트입니다. 다양한 변형과 상태를 제공합니다.</p>
            </header>

            <div className={styles.storySection}>
                <Story title="Variants" description="Primary actions, secondary options, and specialized UI roles">
                    <div className={styles.componentGrid}>
                        <div className={styles.verticalStackSmall}>
                            <Button>Default (Primary)</Button>
                            <span className={styles.labelXs}>Primary action</span>
                        </div>
                        <div className={styles.verticalStackSmall}>
                            <Button variant="secondary">Secondary</Button>
                            <span className={styles.labelXs}>Alternative path</span>
                        </div>
                        <div className={styles.verticalStackSmall}>
                            <Button variant="outline">Outline</Button>
                            <span className={styles.labelXs}>Subtle secondary</span>
                        </div>
                        <div className={styles.verticalStackSmall}>
                            <Button variant="ghost">Ghost</Button>
                            <span className={styles.labelXs}>Contextual menu / Low emphasis</span>
                        </div>
                        <div className={styles.verticalStackSmall}>
                            <Button variant="destructive">Destructive</Button>
                            <span className={styles.labelXs}>Risk / Delete actions</span>
                        </div>
                        <div className={styles.verticalStackSmall}>
                            <Button variant="link">Link</Button>
                            <span className={styles.labelXs}>Navigation style</span>
                        </div>
                    </div>
                </Story>

                <Story title="Sizes" description="Adaptive sizing for different layout densities">
                    <div className={styles.buttonRow}>
                        <Button size="sm">Small (36px)</Button>
                        <Button size="default">Default (48px)</Button>
                        <Button size="lg">Large (56px)</Button>
                        <Button size="icon"><Settings size={18} /></Button>
                    </div>
                </Story>

                <Story title="Component States" description="Interactive states including loading, disabled, and active">
                    <div className={styles.buttonRow}>
                        <Button>Normal</Button>
                        <Button disabled>Disabled</Button>
                        <Button loading>Loading State</Button>
                    </div>
                </Story>

                <Story title="Icon Enrichment" description="Leading and trailing icons for better visual cues">
                    <div className={styles.buttonRow}>
                        <Button><Check size={16} style={{ marginRight: 8 }} /> Approve</Button>
                        <Button variant="secondary">Next Step <ArrowRight size={16} style={{ marginLeft: 8 }} /></Button>
                        <Button variant="outline"><Download size={16} style={{ marginRight: 8 }} /> Download PDF</Button>
                        <Button variant="ghost" size="icon"><Heart size={18} /></Button>
                    </div>
                </Story>

                <Story title="Layout Control" description="Responsive layout options like full-width expansion">
                    <div className={styles.widthFull}>
                        <Button fullWidth>Exapnded Action Button (100% Width)</Button>
                    </div>
                </Story>

                <DocSection
                    usage={`import { Button } from "@/components/ui/Button";\n\n<Button variant="default" size="default">\n  Click Me\n</Button>`}
                    props={[
                        { name: "variant", type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "solid" | "line" | "glass"', defaultValue: '"default"', description: "버튼의 시각적 스타일 변형" },
                        { name: "size", type: '"default" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"', defaultValue: '"default"', description: "버튼의 크기" },
                        { name: "loading", type: "boolean", defaultValue: "false", description: "로딩 상태 표시 (클릭 비활성화)" },
                        { name: "fullWidth", type: "boolean", defaultValue: "false", description: "부모 너비에 맞게 확장 여부" },
                        { name: "asChild", type: "boolean", defaultValue: "false", description: "Radix UI Slot 사용 여부 (Link 등으로 렌더링할 때 사용)" },
                        { name: "color", type: "string", description: "커스텀 배경색" },
                        { name: "textColor", type: "string", description: "커스텀 텍스트 색상" },
                        { name: "radius", type: "number | string", description: "커스텀 보더 반경" },
                    ]}
                />

                <Story title="Segmented & Toggle Controls" description="TDS-style toggle switches and chip selectors">
                    <div className={styles.showcaseStack}>
                        <div className={styles.verticalStackSmall}>
                            <Label className={styles.labelUppercaseBlack}>Toggle Chips</Label>
                            <div className={styles.buttonRow}>
                                <Toggle size="sm">Option A</Toggle>
                                <Toggle size="md" pressed>Option B (Active)</Toggle>
                                <Toggle size="lg">Option C</Toggle>
                            </div>
                        </div>

                        <div className={styles.verticalStackSmall}>
                            <Label className={styles.labelUppercaseBlack}>Square Controls</Label>
                            <div className={styles.buttonRow}>
                                <Toggle size="square" className="sm"><Banana size={14} /></Toggle>
                                <Toggle size="square" pressed><Settings size={18} /></Toggle>
                                <Toggle size="square" className="lg"><Heart size={20} /></Toggle>
                            </div>
                        </div>
                    </div>
                </Story>
            </div>
        </>
    );
}
