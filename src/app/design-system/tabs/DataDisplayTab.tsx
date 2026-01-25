"use client";

import React from "react";
import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";
import { AspectRatio } from "@/components/ui/AspectRatio";
import { Button } from "@/components/ui/Button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/Collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { ChevronDown } from "lucide-react";
import styles from "../DesignSystem.module.scss";
import Story from "../Story";

export default function DataDisplayTab() {
    return (
        <div className={styles.storySection}>
            <Story title="Layout Modules" description="Cards, accordions, and layout primitives">
                <div className={styles.grid}>
                    <Story title="Tabs Mechanics" description="Segmented content and transitions">
                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="settings">Settings</TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview" className="p-6 border rounded-b-xl bg-white">
                                Manage your invitation overview here.
                            </TabsContent>
                            <TabsContent value="settings" className="p-6 border rounded-b-xl bg-white">
                                Change your security preferences.
                            </TabsContent>
                        </Tabs>
                    </Story>

                    <Story title="Dynamic Accordion" description="Compact, stackable disclosure panels">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>What is Banana Wedding?</AccordionTrigger>
                                <AccordionContent>A premium mobile invitation builder.</AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>Is it responsive?</AccordionTrigger>
                                <AccordionContent>Yes, it supports all modern mobile devices.</AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </Story>
                </div>

                <div className={styles.grid}>
                    <Story title="Collapsible Section" description="Expandable details and settings">
                        <Collapsible className="w-full space-y-2">
                            <div className="flex items-center justify-between space-x-4 px-4">
                                <h4 className="text-sm font-bold">Advanced Settings</h4>
                                <CollapsibleTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <ChevronDown size={16} />
                                    </Button>
                                </CollapsibleTrigger>
                            </div>
                            <div className="rounded-md border px-4 py-3 font-mono text-sm shadow-sm bg-white">
                                Base Configuration
                            </div>
                            <CollapsibleContent className="space-y-2">
                                <div className="rounded-md border px-4 py-3 font-mono text-sm shadow-sm bg-white">
                                    Meta Title Tags
                                </div>
                                <div className="rounded-md border px-4 py-3 font-mono text-sm shadow-sm bg-white">
                                    OG Image URL
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </Story>

                    <Story title="Aspect Ratio" description="Cropped media within fixed ratios">
                        <div className="w-[300px]">
                            <AspectRatio ratio={16 / 9} className="bg-muted rounded-xl overflow-hidden shadow-sm group">
                                <Image
                                    src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600"
                                    alt="Wedding Photo"
                                    fill
                                    className="object-cover transition-transform group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                    16:9 Aspect
                                </div>
                            </AspectRatio>
                        </div>
                    </Story>
                </div>
            </Story>

            <Story title="Accordion" description="Foldable content panels (FAQs, Details)">
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What is Banana Wedding?</AccordionTrigger>
                        <AccordionContent>A premium mobile invitation builder.</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Is it responsive?</AccordionTrigger>
                        <AccordionContent>Yes, it supports all modern mobile devices.</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Can I customize colors?</AccordionTrigger>
                        <AccordionContent>Absolutely! We provide a full palette of premium colors.</AccordionContent>
                    </AccordionItem>
                </Accordion>
            </Story>
        </div>
    );
}
