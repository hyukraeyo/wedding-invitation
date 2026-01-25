"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Calendar } from "@/components/ui/Calendar";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { Label } from "@/components/ui/Label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Textarea } from "@/components/ui/Textarea";
import { DatePicker } from "@/components/common/DatePicker";
import { PhoneField } from "@/components/common/PhoneField";
import { SwitchField } from "@/components/common/SwitchField";
import { TextField } from "@/components/common/TextField";
import { TimePicker } from "@/components/common/TimePicker";
import { RadioGroupField } from "@/components/common/RadioGroupField";

import styles from "../DesignSystem.module.scss";
import Story from "../Story";

const RichTextEditor = dynamic(() => import("@/components/common/RichTextEditor/RichTextEditor"), {
    ssr: false,
    loading: () => (
        <div className="h-[200px] flex items-center justify-center border rounded-xl bg-zinc-50 text-zinc-400">Loading editor...</div>
    ),
});

export default function InputsTab() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [color, setColor] = useState("#FBC02D");
    const [richText, setRichText] = useState("<p>Hello <strong>Banana</strong> Wedding!</p>");
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
    const [dateString, setDateString] = useState("2026-05-24");
    const [timeString, setTimeString] = useState("13:00");
    const [selectedRole, setSelectedRole] = useState("guest");

    const roleOptions = [
        { label: "Guest (하객)", value: "guest" },
        { label: "Family (혼주)", value: "family" },
        { label: "Staff (스태프)", value: "staff" },
    ];

    return (
        <div className={styles.storySection}>
            <Story title="Text Fields" description="Basic text inputs and textarea variants">
                <div className="flex flex-col gap-4 w-full">
                    <TextField label="Display Name" placeholder="Your name" />
                    <TextField label="Multiline Field" placeholder="Tell us your story..." helpText="Auto-expanding textarea" multiline rows={4} />
                    <div className="space-y-1.5">
                        <Label>Raw Textarea</Label>
                        <Textarea placeholder="Directly using the ui/Textarea component" />
                    </div>
                </div>
            </Story>

            <Story title="Special Fields" description="Phone, radio, and switch controls">
                <div className="flex flex-col gap-6 w-full">
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

            <Story title="Common Selectors" description="Selects and color pickers">
                <div className="space-y-4 w-full">
                    <Label>Theme Selection (Low-level)</Label>
                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose a theme" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="minimal">Minimal White</SelectItem>
                            <SelectItem value="floral">Sweet Floral</SelectItem>
                            <SelectItem value="modern">Modern Dark</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="pt-2">
                        <Label className="mb-2 block">Brand Colors</Label>
                        <ColorPicker
                            value={color}
                            onChange={setColor}
                            colors={["#FBC02D", "#E53935", "#D81B60", "#8E24AA", "#5E35B1", "#3949AB", "#1E88E5", "#039BE5"]}
                        />
                    </div>
                </div>
            </Story>

            <Story title="Date & Time Controls" description="Calendar, date, and time inputs">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full items-start">
                    {/* Item 1: Calendar */}
                    <div className="space-y-3">
                        <Label className="text-muted-foreground font-normal text-xs uppercase tracking-wider">Calendar Component</Label>
                        <div className="border bg-white rounded-2xl shadow-sm p-4 w-fit">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="p-0"
                            />
                        </div>
                    </div>

                    {/* Item 2: Pickers & Controls */}
                    <div className="space-y-8">
                        <div className="space-y-3 max-w-[300px]">
                            <Label className="text-muted-foreground font-normal text-xs uppercase tracking-wider">Responsive Select (Unified)</Label>
                            <Select
                                value={selectedRole}
                                onValueChange={setSelectedRole}
                                options={roleOptions}
                                placeholder="Select role"
                            />
                        </div>

                        <div className="space-y-3 max-w-[300px]">
                            <Label className="text-muted-foreground font-normal text-xs uppercase tracking-wider">Drawer (Forced Mobile Mode)</Label>
                            <Select
                                value={selectedRole}
                                onValueChange={setSelectedRole}
                                options={roleOptions}
                                placeholder="Select role"
                                mobileOnly
                            />
                        </div>

                        <div className="space-y-3 max-w-[300px]">
                            <Label className="text-muted-foreground font-normal text-xs uppercase tracking-wider">Date Picker</Label>
                            <DatePicker value={dateString} onChange={setDateString} />
                        </div>

                        <div className="space-y-3 max-w-[200px]">
                            <Label className="text-muted-foreground font-normal text-xs uppercase tracking-wider">Time Picker</Label>
                            <TimePicker value={timeString} onChange={setTimeString} />
                        </div>

                        <div className="space-y-3 max-w-[300px]">
                            <Label className="text-muted-foreground font-normal text-xs uppercase tracking-wider">Tabs (Segmented Control)</Label>
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

            <Story title="Rich Text Editor" description="Tiptap rich text editor">
                <div className="w-full">
                    <RichTextEditor
                        content={richText}
                        onChange={setRichText}
                        placeholder="Write a short message..."
                        minHeight={200}
                    />
                    <div className="mt-4 p-4 bg-zinc-50 rounded-xl border border-dashed">
                        <Label className="mb-2 block text-xs text-zinc-400">Preview HTML</Label>
                        <div className="text-sm font-mono text-zinc-600 truncate">{richText}</div>
                    </div>
                </div>
            </Story>
        </div>
    );
}
