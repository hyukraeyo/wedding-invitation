"use client";

import React from "react";
import styles from "../../DesignSystem.module.scss";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/Collapsible";
import { Button } from "@/components/ui/Button";
import { ChevronDown } from "lucide-react";
import Story from "../../Story";
import DocSection from "../../DocSection";
import { usePropControls } from "../../hooks/usePropControls";

export default function AccordionsPage() {
    const { values, getPropItems } = usePropControls({
        type: {
            type: 'segmented',
            defaultValue: 'single',
            options: ['single', 'multiple'],
            description: "아코디언 동작 모드",
            componentType: '"single" | "multiple"'
        },
        collapsible: {
            type: 'boolean',
            defaultValue: true,
            description: "type이 single일 때 모든 아이템을 닫을 수 있는지 여부",
            componentType: 'boolean'
        },
        defaultValue: {
            type: 'text',
            defaultValue: 'item-1',
            description: "초기에 열려 있을 아이템의 value (multiple은 쉼표로 구분)",
            componentType: 'string | string[]'
        },
        asChild: {
            defaultValue: false,
            description: "Radix UI Slot 사용 여부",
            componentType: 'boolean'
        }
    });

    const parsedDefaultValue = (() => {
        const rawValue = values.defaultValue as string | undefined;
        if (!rawValue) return undefined;
        if (values.type === 'multiple') {
            const parsed = rawValue
                .split(",")
                .map((value) => value.trim())
                .filter(Boolean);
            return parsed.length > 0 ? parsed : undefined;
        }
        return rawValue;
    })();

    const usageLines = [
        `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion";`,
        ``,
        `<Accordion`,
        `  type="${values.type}"`,
        values.type === "single" ? `  collapsible={${values.collapsible}}` : null,
        parsedDefaultValue
            ? values.type === "multiple"
                ? `  defaultValue={[${(parsedDefaultValue as string[]).map((value) => `"${value}"`).join(", ")}]}`
                : `  defaultValue="${parsedDefaultValue as string}"`
            : null,
        `>`,
        `  <AccordionItem value="item-1">`,
        `    <AccordionTrigger>Title</AccordionTrigger>`,
        `    <AccordionContent>Content here</AccordionContent>`,
        `  </AccordionItem>`,
        `</Accordion>`
    ].filter(Boolean).join("\n");

    const propItems = getPropItems((key, currentValues) => {
        if (key === 'collapsible' && currentValues.type !== 'single') return false;
        return true;
    });

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
                            <Label className={styles.labelMuted}>
                                {values.type === "single" ? "Single Mode (Collapsible)" : "Multiple Mode"}
                            </Label>
                            {values.type === "single" ? (
                                <Accordion
                                    type="single"
                                    collapsible={values.collapsible as boolean}
                                    {...(parsedDefaultValue ? { defaultValue: parsedDefaultValue as string } : {})}
                                    className={styles.widthFull}
                                >
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>Why choose Banana Wedding?</AccordionTrigger>
                                        <AccordionContent>Because it provides the most premium mobile experience for your guests.</AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger>Is it free?</AccordionTrigger>
                                        <AccordionContent>We offer both free basic plans and premium design plans.</AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            ) : (
                                <Accordion
                                    type="multiple"
                                    {...(parsedDefaultValue ? { defaultValue: parsedDefaultValue as string[] } : {})}
                                    className={styles.widthFull}
                                >
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>Why choose Banana Wedding?</AccordionTrigger>
                                        <AccordionContent>Because it provides the most premium mobile experience for your guests.</AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger>Is it free?</AccordionTrigger>
                                        <AccordionContent>We offer both free basic plans and premium design plans.</AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            )}
                        </div>
                    </div>
                </Story>

                <DocSection
                    usage={usageLines}
                    props={propItems}
                />

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
