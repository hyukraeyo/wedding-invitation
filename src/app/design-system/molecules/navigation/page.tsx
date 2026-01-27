"use client";

import React from "react";
import DesignSystemPage from "../../DesignSystemPage";
import styles from "../../DesignSystem.module.scss";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Info, Settings, Share2 } from "lucide-react";
import { usePropControls } from "../../hooks/usePropControls";

export default function NavigationPage() {
    const { values, getPropItems } = usePropControls({
        fluid: {
            type: 'boolean',
            defaultValue: false,
            description: "TabsList가 부모 너비를 가득 채울지 여부 (justify-content: stretch)",
            componentType: 'boolean'
        },
        defaultValue: {
            type: 'segmented',
            defaultValue: 'info',
            options: ['info', 'design', 'share'],
            description: "초기 선택된 탭 값",
            componentType: 'string'
        }
    });

    const tabsUsage = `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";

<Tabs defaultValue="${values.defaultValue}">
  <TabsList${values.fluid ? " fluid" : ""}>
    <TabsTrigger value="info">Info</TabsTrigger>
    <TabsTrigger value="design">Design</TabsTrigger>
    <TabsTrigger value="share">Share</TabsTrigger>
  </TabsList>
  <TabsContent value="info">Information Content</TabsContent>
  <TabsContent value="design">Design Settings</TabsContent>
  <TabsContent value="share">Sharing Options</TabsContent>
</Tabs>`;

    return (
        <DesignSystemPage
            title="Tabs & Navigation"
            description="사용자가 정보 계층을 탐색하고 다양한 뷰 사이를 효과적으로 전환할 수 있도록 돕는 컴포넌트입니다."
            playground={{
                title: "Playground",
                description: "Fluid 옵션과 초기값을 변경하며 탭의 동작을 테스트해보세요.",
                content: (
                    <div className={styles.widthFull} style={{ maxWidth: '480px', margin: '0 auto' }}>
                        <Tabs defaultValue={values.defaultValue as string} className={styles.widthFull}>
                            <TabsList fluid={values.fluid as boolean}>
                                <TabsTrigger value="info"><Info size={14} style={{ marginRight: 6 }} /> Information</TabsTrigger>
                                <TabsTrigger value="design"><Settings size={14} style={{ marginRight: 6 }} /> Theme Style</TabsTrigger>
                                <TabsTrigger value="share"><Share2 size={14} style={{ marginRight: 6 }} /> Distribution</TabsTrigger>
                            </TabsList>
                            <div className={styles.tabsPanel} style={{ marginTop: '-1px', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                                <TabsContent value="info">
                                    <div className={styles.verticalStackSmall}>
                                        <h4 className={styles.textBoldSmall}>Wedding Metadata</h4>
                                        <p className={styles.textSmall}>Manage names, event timing, and location coordinates.</p>
                                    </div>
                                </TabsContent>
                                <TabsContent value="design">
                                    <div className={styles.verticalStackSmall}>
                                        <h4 className={styles.textBoldSmall}>Visual Aesthetics</h4>
                                        <p className={styles.textSmall}>Choose font families, brand colors, and grid densities.</p>
                                    </div>
                                </TabsContent>
                                <TabsContent value="share">
                                    <div className={styles.verticalStackSmall}>
                                        <h4 className={styles.textBoldSmall}>Public Access</h4>
                                        <p className={styles.textSmall}>Manage slugs, custom domains, and KakaoTalk API integration.</p>
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                ),
                usage: tabsUsage,
                props: getPropItems()
            }}
            combinations={{
                title: "레이아웃 패턴",
                description: "다양한 너비와 컨텍스트에서의 활용 예시입니다.",
                content: (
                    <div className={styles.gridTwoCols}>
                        <div className={styles.verticalStackSmall}>
                            <h4 className={styles.textBoldSmall}>Full Width (Fluid)</h4>
                            <div className={styles.canvas} style={{ padding: '24px' }}>
                                <Tabs defaultValue="tab1">
                                    <TabsList fluid>
                                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                                        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        </div>
                        <div className={styles.verticalStackSmall}>
                            <h4 className={styles.textBoldSmall}>Compact (Auto Width)</h4>
                            <div className={styles.canvas} style={{ padding: '24px' }}>
                                <Tabs defaultValue="tab1">
                                    <TabsList>
                                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                                        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                )
            }}
        />
    );
}
