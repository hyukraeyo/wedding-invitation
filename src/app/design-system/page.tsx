"use client";

import React, { useState } from "react";
import styles from "./DesignSystem.module.scss";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";
import { Checkbox } from "@/components/ui/Checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Separator } from "@/components/ui/Separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/Accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { InfoMessage } from "@/components/ui/InfoMessage";
import { Banana, Check, Bell, Loader2, Badge as BadgeIcon } from "lucide-react";
import { Textarea } from "@/components/ui/Textarea";
import { Skeleton } from "@/components/ui/Skeleton";

export default function DesignSystemPage() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Banana Design System</h1>
                <p>A comprehensive guide to the UI components and tokens used in Wedding Invitation.</p>
            </header>

            {/* Colors Section */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Colors</h2>
                    <p>The core color palette that defines the designated brand identity.</p>
                </div>

                <div className={`${styles.grid} ${styles.gridColors}`}>
                    <ColorCard name="Primary" value="#FBC02D" className="bg-[#FBC02D]" />
                    <ColorCard name="Primary Dark" value="#F9A825" className="bg-[#F9A825]" />
                    <ColorCard name="Primary Hover" value="#E6B02A" className="bg-[#E6B02A]" />
                    <ColorCard name="Ivory" value="#FFFBEA" className="bg-[#FFFBEA]" />
                    <ColorCard name="Success" value="#22C55E" className="bg-[#22C55E]" />
                    <ColorCard name="Error" value="#EF4444" className="bg-[#EF4444]" />
                    <ColorCard name="Muted" value="#F5F5F5" className="bg-[#F5F5F5]" />
                    <ColorCard name="Muted Foreground" value="#737373" className="bg-[#737373]" />
                </div>
            </section>

            {/* Typography Section */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Typography</h2>
                    <p>Headings, body text, and other typographic elements.</p>
                </div>

                <div className={styles.typographyRow}>
                    <span className={styles.label}>Heading 1</span>
                    <h1 className="text-4xl font-extrabold">The quick brown fox jumps over the lazy dog</h1>
                </div>
                <div className={styles.typographyRow}>
                    <span className={styles.label}>Heading 2</span>
                    <h2 className="text-3xl font-bold">The quick brown fox jumps over the lazy dog</h2>
                </div>
                <div className={styles.typographyRow}>
                    <span className={styles.label}>Heading 3</span>
                    <h3 className="text-2xl font-bold">The quick brown fox jumps over the lazy dog</h3>
                </div>
                <div className={styles.typographyRow}>
                    <span className={styles.label}>Body Large</span>
                    <p className="text-lg text-zinc-700">The quick brown fox jumps over the lazy dog. It was a sunny morning in the late autumn.</p>
                </div>
                <div className={styles.typographyRow}>
                    <span className={styles.label}>Body Base</span>
                    <p className="text-base text-zinc-700">The quick brown fox jumps over the lazy dog. It was a sunny morning in the late autumn when the fox decided to take a leap.</p>
                </div>
                <div className={styles.typographyRow}>
                    <span className={styles.label}>Small</span>
                    <p className="text-sm text-zinc-500">The quick brown fox jumps over the lazy dog. Small text for captions or secondary information.</p>
                </div>
            </section>

            {/* Buttons Section */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Buttons</h2>
                    <p>Interactive elements for actions and navigation.</p>
                </div>

                <div className={styles.grid} style={{ gridTemplateColumns: "1fr 1fr" }}>
                    <div className={styles.componentSet}>
                        <span className={styles.componentSetTitle}>Variants</span>
                        <div className={styles.componentSetContent}>
                            <Button>Default</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="destructive">Destructive</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="link">Link</Button>
                        </div>
                    </div>

                    <div className={styles.componentSet}>
                        <span className={styles.componentSetTitle}>Sizes</span>
                        <div className={styles.componentSetContent}>
                            <Button size="sm">Small</Button>
                            <Button size="default">Default</Button>
                            <Button size="lg">Large</Button>
                            <Button size="icon"><Banana size={18} /></Button>
                        </div>
                    </div>

                    <div className={styles.componentSet}>
                        <span className={styles.componentSetTitle}>States</span>
                        <div className={styles.componentSetContent}>
                            <Button disabled>Disabled</Button>
                            <Button loading>Loading</Button>
                        </div>
                    </div>

                    <div className={styles.componentSet}>
                        <span className={styles.componentSetTitle}>With Icons</span>
                        <div className={styles.componentSetContent}>
                            <Button><Check className="mr-2 h-4 w-4" /> Approve</Button>
                            <Button variant="secondary">Next Step <Banana className="ml-2 h-4 w-4" /></Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Badges Section */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Badges</h2>
                    <p>Small status descriptors for UI elements.</p>
                </div>

                <div className={styles.componentSetContent}>
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge variant="success">Success</Badge>
                </div>
            </section>

            {/* Inputs & Forms Section */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Forms & Inputs</h2>
                    <p>Components for data collection and user input.</p>
                </div>

                <div className={styles.grid} style={{ gridTemplateColumns: "1fr 1fr" }}>
                    <div className={styles.componentSet}>
                        <span className={styles.componentSetTitle}>Text Input</span>
                        <div className="grid w-full gap-4">
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input type="email" id="email" placeholder="Email" />
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="name">Name (Error State)</Label>
                                <Input type="text" id="name" placeholder="Name" error />
                                <p className="text-xs text-rose-500">Name is required.</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.componentSet}>
                        <span className={styles.componentSetTitle}>Textarea</span>
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="message">Message</Label>
                            <Textarea placeholder="Type your message here." id="message" />
                        </div>
                    </div>

                    <div className={styles.componentSet}>
                        <span className={styles.componentSetTitle}>Select</span>
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="banana">Banana</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className={styles.componentSet}>
                        <span className={styles.componentSetTitle}>Switch & Checkbox</span>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center space-x-2">
                                <Switch id="airplane-mode" />
                                <Label htmlFor="airplane-mode">Airplane Mode</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="terms" />
                                <Label htmlFor="terms">Accept terms and conditions</Label>
                            </div>
                        </div>
                    </div>

                    <div className={styles.componentSet}>
                        <span className={styles.componentSetTitle}>Radio Group</span>
                        <RadioGroup defaultValue="option-one">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="option-one" id="option-one" />
                                <Label htmlFor="option-one">Option One</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="option-two" id="option-two" />
                                <Label htmlFor="option-two">Option Two</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
            </section>

            {/* Feedback Section */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Feedback</h2>
                    <p>Alerts, messages, and status indicators.</p>
                </div>

                <div className="flex flex-col gap-4">
                    <Alert>
                        <Banana className="h-4 w-4" />
                        <AlertTitle>Heads up!</AlertTitle>
                        <AlertDescription>
                            You can add components to your app using the cli.
                        </AlertDescription>
                    </Alert>

                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            Your session has expired. Please log in again.
                        </AlertDescription>
                    </Alert>

                    <InfoMessage>
                        This is an info message used for helpful tips.
                    </InfoMessage>
                </div>
            </section>

            {/* Navigation Component */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Navigation</h2>
                    <p>Tabs, accordions and other navigational elements.</p>
                </div>

                <Tabs defaultValue="account" className="w-[400px]">
                    <TabsList>
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="password">Password</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account">Make changes to your account here.</TabsContent>
                    <TabsContent value="password">Change your password here.</TabsContent>
                </Tabs>

                <div className="h-8"></div>

                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Is it accessible?</AccordionTrigger>
                        <AccordionContent>
                            Yes. It adheres to the WAI-ARIA design pattern.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Is it styled?</AccordionTrigger>
                        <AccordionContent>
                            Yes. It comes with default styles that matches the other components' aesthetic.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>

            {/* Cards Section */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Cards</h2>
                    <p>Container components for grouping related content.</p>
                </div>

                <div className={styles.cardGrid}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Card Title</CardTitle>
                            <CardDescription>Card description goes here. Use this for any supporting text.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Card content area. Place your main content here.</p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" size="sm">Cancel</Button>
                            <Button size="sm">Save</Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Subscription Plan</CardTitle>
                            <CardDescription>Choose your preferred plan.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                <span style={{ fontSize: '2rem', fontWeight: 700 }}>₩9,900</span>
                                <span style={{ color: '#71717a' }}>/month</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button fullWidth>Subscribe</Button>
                        </CardFooter>
                    </Card>
                </div>
            </section>

            {/* Skeleton Section */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Skeleton</h2>
                    <p>Loading state placeholders for content.</p>
                </div>

                <div className={styles.skeletonRow}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Skeleton style={{ width: 48, height: 48, borderRadius: '50%' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <Skeleton style={{ width: 200, height: 16 }} />
                            <Skeleton style={{ width: 140, height: 12 }} />
                        </div>
                    </div>
                    <Skeleton style={{ width: '100%', height: 120, borderRadius: 12 }} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Skeleton style={{ width: 80, height: 32 }} />
                        <Skeleton style={{ width: 100, height: 32 }} />
                    </div>
                </div>
            </section>

            {/* Radius Tokens Section */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Border Radius</h2>
                    <p>Standard radius values used across the design system.</p>
                </div>

                <div className={styles.radiusGrid}>
                    <RadiusDemo label="radius-sm" value="8px" />
                    <RadiusDemo label="radius-md" value="16px" />
                    <RadiusDemo label="radius-lg" value="16px" />
                    <RadiusDemo label="radius-xl" value="20px" />
                    <RadiusDemo label="radius-2xl" value="24px" />
                    <RadiusDemo label="radius-full" value="9999px" />
                </div>
            </section>

            {/* Spacing Tokens Section */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Spacing</h2>
                    <p>Consistent spacing tokens for layout and components.</p>
                </div>

                <div>
                    <SpacingDemo label="4px" width={16} />
                    <SpacingDemo label="8px" width={32} />
                    <SpacingDemo label="12px" width={48} />
                    <SpacingDemo label="16px" width={64} />
                    <SpacingDemo label="24px" width={96} />
                    <SpacingDemo label="32px" width={128} />
                    <SpacingDemo label="48px" width={192} />
                    <SpacingDemo label="64px" width={256} />
                </div>
            </section>

        </div>
    );
}

function ColorCard({ name, value, className }: { name: string, value: string, className?: string }) {
    return (
        <div className={styles.colorCard}>
            <div className={`${styles.colorCardPreview} ${className}`} style={{ backgroundColor: value }}></div>
            <div className={styles.colorCardInfo}>
                <span className={styles.name}>{name}</span>
                <span className={styles.value}>{value}</span>
            </div>
        </div>
    );
}

function RadiusDemo({ label, value }: { label: string, value: string }) {
    const radiusValue = value === '9999px' ? '50%' : value;
    return (
        <div className={styles.radiusDemo}>
            <div className={styles.radiusBox} style={{ borderRadius: radiusValue }}>
                {value}
            </div>
            <span className={styles.radiusLabel}>{label}</span>
        </div>
    );
}

function SpacingDemo({ label, width }: { label: string, width: number }) {
    return (
        <div className={styles.spacingRow}>
            <span className={styles.spacingLabel}>{label}</span>
            <div className={styles.spacingDemo} style={{ width: `${width}px` }}></div>
        </div>
    );
}

