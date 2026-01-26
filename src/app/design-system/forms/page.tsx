"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import styles from "../DesignSystem.module.scss";
import { Calendar } from "@/components/ui/Calendar";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Textarea } from "@/components/ui/Textarea";
import { DatePicker } from "@/components/common/DatePicker";
import { PhoneField } from "@/components/common/PhoneField";
import { SwitchField } from "@/components/common/SwitchField";
import { TextField } from "@/components/common/TextField";
import { TimePicker } from "@/components/common/TimePicker";
import { RadioGroupField } from "@/components/common/RadioGroupField";
import { Toggle } from "@/components/ui/Toggle";
import Story from "../Story";

const RichTextEditor = dynamic(() => import("@/components/ui/RichTextEditor/RichTextEditor").then(mod => mod.RichTextEditor), {
    ssr: false,
    loading: () => (
        <div className={styles.loadingBox}>Loading editor...</div>
    ),
});

export default function FormsPage() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [color, setColor] = useState("#FBC02D");
    const [richText, setRichText] = useState("<p>Hello <strong>Banana</strong> Wedding!</p>");
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
    const [dateString, setDateString] = useState("2026-05-24");
    const [timeString, setTimeString] = useState("13:00");
    const [selectedRole, setSelectedRole] = useState("guest");
    const [isPined, setIsPined] = useState(false);
    const [isActive, setIsActive] = useState(true);

    const roleOptions = [
        { label: "Guest (하객)", value: "guest" },
        { label: "Family (혼주)", value: "family" },
        { label: "Staff (스태프)", value: "staff" },
    ];

    return (
        <>
            <header className={styles.pageHeader}>
                <div className={styles.headerMetaRow}>
                    <span className={styles.versionBadge}>v1.2.0</span>
                </div>
                <h1>Forms & Inputs</h1>
                <p className={styles.textMuted}>데이터 입력을 위한 다양한 폼 요소와 커스텀 필드들입니다.</p>
            </header>

            <div className={styles.storySection}>
                <Story title="Text Fields" description="Basic text inputs and textarea variants">
                    <div className={styles.showcaseStack}>
                        <TextField label="Display Name" placeholder="Your name" />
                        <TextField label="Multiline Field" placeholder="Tell us your story..." helpText="Auto-expanding textarea" multiline rows={4} />
                        <div className={styles.verticalStackExtraSmall}>
                            <Label>Raw Textarea</Label>
                            <Textarea placeholder="Directly using the ui/Textarea component" />
                        </div>
                    </div>
                </Story>

                <Story title="Special Fields" description="Phone, radio, and switch controls with labels and help text">
                    <div className={styles.showcaseStack}>
                        <PhoneField label="Phone" placeholder="010-0000-0000" />
                        <RadioGroupField
                            label="Selection Group"
                            description="Select your role for the event coordinator"
                            defaultValue="guest"
                            options={[
                                { label: "Guest (하객)", value: "guest", description: "Standard access to view invitation" },
                                { label: "Family (혼주)", value: "family", description: "Extended access to manage guest list" },
                            ]}
                        />
                        <SwitchField
                            label="Notifications"
                            description="Receive alerts when new RSVP comes in"
                            checked={isNotificationsEnabled}
                            onChange={setIsNotificationsEnabled}
                        />
                    </div>
                </Story>

                <Story title="Toggle Buttons" description="TDS-style toggle switches and chips">
                    <div className={styles.showcaseStack}>
                        <div className={styles.verticalStackSmall}>
                            <Label className={styles.labelUppercaseBlack}>Toggle Sizes (Chips)</Label>
                            <div className={styles.rowGap2}>
                                <Toggle size="sm">Small Chip</Toggle>
                                <Toggle size="md" pressed={isActive} onPressedChange={setIsActive}>Medium Chip</Toggle>
                                <Toggle size="lg">Large Chip</Toggle>
                            </div>
                        </div>

                        <div className={styles.verticalStackSmall}>
                            <Label className={styles.labelUppercaseBlack}>Square Toggle (Icons/Text)</Label>
                            <div className={styles.rowGap2}>
                                <Toggle size="square" className="sm" pressed={isPined} onPressedChange={setIsPined}>故</Toggle>
                                <Toggle size="square" pressed={isPined} onPressedChange={setIsPined}>故</Toggle>
                                <Toggle size="square" className="lg" pressed={isPined} onPressedChange={setIsPined}>故</Toggle>
                            </div>
                        </div>
                    </div>
                </Story>

                <Story title="Rich Text Editor" description="Tiptap rich text editor for complex content">
                    <div className={styles.widthFull}>
                        <RichTextEditor
                            content={richText}
                            onChange={setRichText}
                            placeholder="Write a short message..."
                            minHeight={200}
                        />
                        <div className={styles.previewBox}>
                            <Label className={styles.labelMuted}>Preview HTML</Label>
                            <div className={styles.monoText}>{richText}</div>
                        </div>
                    </div>
                </Story>

                <Story title="Date & Time Controls" description="Calendar, date, and time inputs">
                    <div className={styles.gridTwoColsLarge}>
                        <div className={styles.verticalStackSmall}>
                            <Label className={styles.labelUppercase}>Calendar Component</Label>
                            <div className={styles.calendarWrapper}>
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    className={styles.paddingZero ?? ""}
                                />
                            </div>
                        </div>

                        <div className={styles.showcaseStack}>
                            <div className={styles.verticalStackSmall} style={{ maxWidth: 300 }}>
                                <Label className={styles.labelUppercase}>Responsive Select (Unified)</Label>
                                <Select
                                    value={selectedRole}
                                    onValueChange={setSelectedRole}
                                    options={roleOptions}
                                    placeholder="Select role"
                                />
                            </div>

                            <div className={styles.verticalStackSmall} style={{ maxWidth: 300 }}>
                                <Label className={styles.labelUppercase}>Date Picker</Label>
                                <DatePicker value={dateString} onChange={setDateString} />
                            </div>

                            <div className={styles.verticalStackSmall} style={{ maxWidth: 200 }}>
                                <Label className={styles.labelUppercase}>Time Picker</Label>
                                <TimePicker value={timeString} onChange={setTimeString} />
                            </div>

                            <div className={styles.verticalStackSmall} style={{ maxWidth: 300 }}>
                                <Label className={styles.labelUppercase}>Tabs (Segmented Control)</Label>
                                <Tabs defaultValue="m">
                                    <TabsList fluid>
                                        <TabsTrigger value="s">Small</TabsTrigger>
                                        <TabsTrigger value="m">Medium</TabsTrigger>
                                        <TabsTrigger value="l">Large</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </Story>

                <Story title="Color Selectors" description="Custom color pickers for theme customization">
                    <div className={styles.showcaseStack}>
                        <div className={styles.paddingTopSmall}>
                            <Label className={styles.labelMuted} style={{ color: 'inherit', fontSize: 'inherit', marginBottom: 8 }}>Brand Colors</Label>
                            <ColorPicker
                                value={color}
                                onChange={setColor}
                                colors={["#FBC02D", "#E53935", "#D81B60", "#8E24AA", "#5E35B1", "#3949AB", "#1E88E5", "#039BE5"]}
                            />
                        </div>
                    </div>
                </Story>
            </div>
        </>
    );
}
