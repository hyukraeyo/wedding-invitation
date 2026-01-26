"use client";

import React from "react";
import styles from "../DesignSystem.module.scss";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/Collapsible";
import { Button } from "@/components/ui/Button";
import { ChevronDown } from "lucide-react";
import Story from "../Story";

export default function AccordionsPage() {
    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Accordions & Disclosure</h1>
                <p className={styles.textMuted}>계층적 정보를 효과적으로 보여주기 위한 접이식 컴포넌트들입니다.</p>
            </header>

            <div className={styles.storySection}>
                <Story title="Dynamic Accordion" description="Compact, stackable disclosure panels with single/multi modes">
                    <div className={styles.showcaseStack}>
                        <div className={styles.verticalStackSmall}>
                            <Label className={styles.labelMuted}>Single Mode (Collapsible)</Label>
                            <Accordion type="single" collapsible className={styles.widthFull}>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>Why choose Banana Wedding?</AccordionTrigger>
                                    <AccordionContent>Because it provides the most premium mobile experience for your guests.</AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>Is it free?</AccordionTrigger>
                                    <AccordionContent>We offer both free basic plans and premium design plans.</AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>

                        <div className={styles.verticalStackSmall}>
                            <Label className={styles.labelMuted}>Multiple Mode</Label>
                            <Accordion type="multiple" className={styles.widthFull}>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>Design Features</AccordionTrigger>
                                    <AccordionContent>Custom fonts, colors, and layout options.</AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>Guest Management</AccordionTrigger>
                                    <AccordionContent>RSVP tracking and guest list export.</AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </Story>

                <Story title="Collapsible Sections" description="Minimalist toggle for auxiliary information or advanced settings">
                    <div className={styles.showcaseStack}>
                        <Collapsible className={styles.widthFull}>
                            <div className={styles.flexRowBetween}>
                                <h4 className={styles.textBoldSmall}>Developer Configuration</h4>
                                <CollapsibleTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <ChevronDown size={16} />
                                    </Button>
                                </CollapsibleTrigger>
                            </div>
                            <div className={styles.verticalStackSmall} style={{ marginTop: 8 }}>
                                <div className={styles.codePanel}>
                                    Environment: Production
                                </div>
                                <CollapsibleContent className={styles.verticalStackSmall}>
                                    <div className={styles.codePanel}>
                                        API_ENDPOINT: https://api.banana.wedding
                                    </div>
                                    <div className={styles.codePanel}>
                                        CDN_HOST: assets.banana.wedding
                                    </div>
                                </CollapsibleContent>
                            </div>
                        </Collapsible>
                    </div>
                </Story>
            </div>
        </>
    );
}

// Minimalist Label component just for this page to avoid breaking imports
function Label({ children, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
    return <label className={className} {...props}>{children}</label>;
}
