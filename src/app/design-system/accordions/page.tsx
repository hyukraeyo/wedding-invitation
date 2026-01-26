"use client";

import styles from "../DesignSystem.module.scss";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/Collapsible";
import { Button } from "@/components/ui/Button";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";

export default function AccordionsPage() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Accordions</h1>
                <p>콘텐츠를 접고 펼 수 있는 아코디언 및 콜랩서블 컴포넌트입니다.</p>
            </header>

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

            {/* Collapsible */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Collapsible</h2>
                    <p>간단한 토글형 콘텐츠 노출 컴포넌트입니다.</p>
                </div>
                <div className={styles.card}>
                    <Collapsible
                        open={isOpen}
                        onOpenChange={setIsOpen}
                        style={{ width: "100%", maxWidth: 350 }}
                    >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4px" }}>
                            <h4 style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                                @banana-wedding/core
                            </h4>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" style={{ width: 36, padding: 0 }}>
                                    <ChevronsUpDown size={16} />
                                    <span className="sr-only">Toggle</span>
                                </Button>
                            </CollapsibleTrigger>
                        </div>
                        <div style={{ marginTop: 8, padding: "8px 12px", border: "1px solid #e4e4e7", borderRadius: 8, fontSize: "0.875rem", fontFamily: "monospace" }}>
                            @radix-ui/react-collapsible
                        </div>
                        <CollapsibleContent style={{ marginTop: 8 }}>
                            <div style={{ padding: "8px 12px", border: "1px solid #e4e4e7", borderRadius: 8, fontSize: "0.875rem", fontFamily: "monospace", marginBottom: 8 }}>
                                @radix-ui/react-accordion
                            </div>
                            <div style={{ padding: "8px 12px", border: "1px solid #e4e4e7", borderRadius: 8, fontSize: "0.875rem", fontFamily: "monospace" }}>
                                lucide-react
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            </section>

            {/* Usage */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>사용법</h2>
                </div>
                <div className={styles.card}>
                    <pre className={styles.codeBlock}>
                        {`// Accordion
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion";

<Accordion type="single" collapsible>
  <AccordionItem value="item1">
    <AccordionTrigger>제목</AccordionTrigger>
    <AccordionContent>내용</AccordionContent>
  </AccordionItem>
</Accordion>

// Collapsible
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/Collapsible";

<Collapsible open={isOpen} onOpenChange={setIsOpen}>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Content</CollapsibleContent>
</Collapsible>`}
                    </pre>
                </div>
            </section>
        </>
    );
}
