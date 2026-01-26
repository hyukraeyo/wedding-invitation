"use client";

import React, { useState } from "react";
import styles from "../DesignSystem.module.scss";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { LayoutGrid, List, Layers, Info, Settings, Share2, MousePointer2 } from "lucide-react";
import Story from "../Story";

export default function NavigationPage() {
    const [viewMode, setViewMode] = useState<string>("swiper");

    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Navigation</h1>
                <p>사용자가 정보 계층을 탐색하고 다양한 뷰 사이를 효과적으로 전환할 수 있도록 돕는 컴포넌트입니다.</p>
            </header>

            <div className={styles.storySection}>
                <Story title="Content Tabs" description="Deep linking and conditional content rendering using standardized tab patterns">
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

                <Story title="Segmented Controls" description="Value selection without depth, often used as view toggles or mode switchers">
                    <div className={styles.gridTwoCols}>
                        <div className={styles.verticalStackSmall}>
                            <span className={styles.labelMuted}>Layout Selection</span>
                            <Tabs value={viewMode} onValueChange={setViewMode}>
                                <TabsList fluid>
                                    <TabsTrigger value="swiper"><Layers size={14} /> Swiper</TabsTrigger>
                                    <TabsTrigger value="grid"><LayoutGrid size={14} /> Grid</TabsTrigger>
                                    <TabsTrigger value="list"><List size={14} /> List</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        <div className={styles.verticalStackSmall}>
                            <span className={styles.labelMuted}>Interactive Status</span>
                            <div className={styles.codePanel}>
                                <div className={styles.rowGap2}>
                                    <MousePointer2 size={16} color="#FBC02D" />
                                    <span className={styles.textSmall}>Active State: <strong>{viewMode}</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Story>

                <Story title="Code reference" description="How to implement tabs with or without content panels">
                    <div className={styles.codePanel}>
                        <pre className={styles.monoText}>
                            {`// With Panels
<Tabs defaultValue="1">
  <TabsList>
    <TabsTrigger value="1">A</TabsTrigger>
  </TabsList>
  <TabsContent value="1">Content A</TabsContent>
</Tabs>

// Without Panels (Segmented)
<Tabs value={v} onValueChange={setV}>
  <TabsList fluid>
    <TabsTrigger value="x">X</TabsTrigger>
  </TabsList>
</Tabs>`}
                        </pre>
                    </div>
                </Story>
            </div>
        </>
    );
}
