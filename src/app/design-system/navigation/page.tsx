"use client";

import { useState } from "react";
import styles from "../DesignSystem.module.scss";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";
import { LayoutGrid, List, Layers } from "lucide-react";

export default function NavigationPage() {
    const [viewMode, setViewMode] = useState<string>("swiper");

    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Navigation</h1>
                <p>콘텐츠 탐색을 위한 네비게이션 컴포넌트입니다.</p>
            </header>

            {/* Tabs - With Content */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Tabs (콘텐츠 전환)</h2>
                    <p>탭 선택에 따라 해당 콘텐츠가 표시됩니다.</p>
                </div>
                <div className={styles.card}>
                    <Tabs defaultValue="info" style={{ width: "100%" }}>
                        <TabsList>
                            <TabsTrigger value="info">기본 정보</TabsTrigger>
                            <TabsTrigger value="design">디자인</TabsTrigger>
                            <TabsTrigger value="share">공유 설정</TabsTrigger>
                        </TabsList>
                        <TabsContent value="info">
                            <div className={styles.tabContent}>
                                신랑 신부 정보, 예식 일시 및 장소를 설정합니다.
                            </div>
                        </TabsContent>
                        <TabsContent value="design">
                            <div className={styles.tabContent}>
                                청첩장 테마와 레이아웃을 선택합니다.
                            </div>
                        </TabsContent>
                        <TabsContent value="share">
                            <div className={styles.tabContent}>
                                카카오톡 공유 설정 및 링크를 관리합니다.
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>

            {/* Tabs - Value Selection Only */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Tabs (값 선택)</h2>
                    <p>TabsContent 없이 값 선택으로만 사용할 수 있습니다.</p>
                </div>
                <div className={styles.card}>
                    <div style={{ marginBottom: 16 }}>
                        <p style={{ fontSize: "0.75rem", color: "#71717a", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            뷰 타입
                        </p>
                        <Tabs value={viewMode} onValueChange={setViewMode}>
                            <TabsList fluid>
                                <TabsTrigger value="swiper">스와이퍼</TabsTrigger>
                                <TabsTrigger value="grid">그리드</TabsTrigger>
                                <TabsTrigger value="list">리스트</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <p style={{ fontSize: "0.8125rem", color: "#52525b", marginTop: 12 }}>
                            선택된 값 <code style={{ background: "#f4f4f5", padding: "2px 6px", borderRadius: 4 }}>{viewMode}</code>
                        </p>
                    </div>

                    <div>
                        <p style={{ fontSize: "0.75rem", color: "#71717a", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            아이콘 탭
                        </p>
                        <Tabs value={viewMode} onValueChange={setViewMode}>
                            <TabsList fluid>
                                <TabsTrigger value="swiper">
                                    <Layers size={16} style={{ marginRight: 6 }} /> 스와이퍼
                                </TabsTrigger>
                                <TabsTrigger value="grid">
                                    <LayoutGrid size={16} style={{ marginRight: 6 }} /> 그리드
                                </TabsTrigger>
                                <TabsTrigger value="list">
                                    <List size={16} style={{ marginRight: 6 }} /> 리스트
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>
            </section>

            {/* Accordion */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Accordion</h2>
                    <p>접었다 펼 수 있는 콘텐츠 영역입니다. (type=&quot;single&quot; | &quot;multiple&quot;)</p>
                </div>
                <div className={styles.card}>
                    <Accordion type="single" collapsible style={{ width: "100%" }}>
                        <AccordionItem value="faq1">
                            <AccordionTrigger>청첩장은 어떻게 만들 수 있나요?</AccordionTrigger>
                            <AccordionContent>
                                회원가입 후 &quot;새 청첩장 만들기&quot; 버튼을 클릭하면 쉽게 시작할 수 있습니다.
                                템플릿을 선택하고 정보를 입력하면 됩니다.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="faq2">
                            <AccordionTrigger>승인은 얼마나 걸리나요?</AccordionTrigger>
                            <AccordionContent>
                                일반적으로 24시간 이내에 승인 결과를 알려드립니다.
                                주말과 공휴일에는 시간이 더 걸릴 수 있습니다.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="faq3">
                            <AccordionTrigger>공유는 어떻게 하나요?</AccordionTrigger>
                            <AccordionContent>
                                청첩장을 카카오톡으로 공유하거나 링크를 복사해
                                원하는 곳에 공유할 수 있습니다.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </section>

            {/* Usage */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>사용법</h2>
                </div>
                <div className={styles.card}>
                    <pre className={styles.codeBlock}>
                        {`// Tabs (콘텐츠 전환)
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">탭 1</TabsTrigger>
    <TabsTrigger value="tab2">탭 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">내용 1</TabsContent>
  <TabsContent value="tab2">내용 2</TabsContent>
</Tabs>

// Tabs (값 선택 - TabsContent 없이)
const [value, setValue] = useState("option1");

<Tabs value={value} onValueChange={setValue}>
  <TabsList>
    <TabsTrigger value="option1">옵션 1</TabsTrigger>
    <TabsTrigger value="option2">옵션 2</TabsTrigger>
  </TabsList>
</Tabs>

// Accordion (싱글 모드 - 하나만 열림)
<Accordion type="single" collapsible>
  <AccordionItem value="item1">
    <AccordionTrigger>제목</AccordionTrigger>
    <AccordionContent>내용</AccordionContent>
  </AccordionItem>
</Accordion>

// Accordion (멀티 모드 - 여러 개 열림)
<Accordion type="multiple">
  <AccordionItem value="item1">...</AccordionItem>
  <AccordionItem value="item2">...</AccordionItem>
</Accordion>`}
                    </pre>
                </div>
            </section>
        </>
    );
}

