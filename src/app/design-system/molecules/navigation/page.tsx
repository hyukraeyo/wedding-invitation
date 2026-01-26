"use client";

import React from "react";
import styles from "../../DesignSystem.module.scss";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Info, Settings, Share2 } from "lucide-react";
import Story from "../../Story";
import DocSection from "../../DocSection";

export default function NavigationPage() {

    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Navigation</h1>
                <p>사용자가 정보 계층을 탐색하고 다양한 뷰 사이를 효과적으로 전환할 수 있도록 돕는 컴포넌트입니다.</p>
            </header>

            <div className={styles.storySection}>
                <Story id="tabs" title="Selection Tabs" description="Deep linking and conditional content rendering using standardized tab patterns">
                    <div className={styles.widthFull}>
                        <Tabs defaultValue="info" className={styles.widthFull}>
                            <TabsList>
                                <TabsTrigger value="info"><Info size={14} style={{ marginRight: 6 }} /> Information</TabsTrigger>
                                <TabsTrigger value="design"><Settings size={14} style={{ marginRight: 6 }} /> Theme Style</TabsTrigger>
                                <TabsTrigger value="share"><Share2 size={14} style={{ marginRight: 6 }} /> Distribution</TabsTrigger>
                            </TabsList>
                            <div className={styles.tabsPanel}>
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
                </Story>

                <DocSection
                    
                    usage={`// Tabs Usage\nimport { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";\n\n<Tabs defaultValue="tab1">\n  <TabsList>\n    <TabsTrigger value="tab1">Tab 1</TabsTrigger>\n    <TabsTrigger value="tab2">Tab 2</TabsTrigger>\n  </TabsList>\n  <TabsContent value="tab1">Content 1</TabsContent>\n</Tabs>`}
                    props={[
                        { name: "Tabs: fluid", type: "boolean", defaultValue: "false", description: "TabsList가 부모 너비를 가득 채울지 여부" },
                    ]}
                />
            </div>
        </>
    );
}
