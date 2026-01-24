"use client";

import React, { useState, useEffect } from "react";
import styles from "./DesignSystem.module.scss";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Checkbox } from "@/components/ui/Checkbox";
import { Switch } from "@/components/ui/Switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import {
    Select,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectItem,
} from "@/components/ui/Select";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/DropdownMenu";
import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from "@/components/ui/Drawer";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/Accordion";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/Dialog";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/Popover";
import { Skeleton } from "@/components/ui/Skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/Alert";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel,
} from "@/components/ui/AlertDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { InfoMessage } from "@/components/ui/InfoMessage";
import { IconButton } from "@/components/ui/IconButton";
import { Textarea } from "@/components/ui/Textarea";
import { Calendar } from "@/components/ui/Calendar";
import { Separator } from "@/components/ui/Separator";
import { Toggle } from "@/components/ui/Toggle";
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from "@/components/ui/Sheet";
import { AspectRatio } from "@/components/ui/AspectRatio";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/Collapsible";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { InvitationCard } from "@/components/ui/InvitationCard";
import { SampleList } from "@/components/ui/SampleList";

// Common Components
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { ProgressBar } from "@/components/common/ProgressBar/ProgressBar";
import { ResponsiveModal } from "@/components/common/ResponsiveModal/ResponsiveModal";
import { TextField } from "@/components/common/TextField";
import { PhoneField } from "@/components/common/PhoneField";
import { SwitchField } from "@/components/common/SwitchField";
import { DatePicker } from "@/components/common/DatePicker";
import { TimePicker } from "@/components/common/TimePicker";
import RichTextEditor from "@/components/common/RichTextEditor/RichTextEditor";

import { toast } from "sonner";
import {
    Image as ImageIcon,
    Settings,
    User,
    LogOut,
    Info,
    TriangleAlert,
    MoreVertical,
    Bold,
    Italic,
    Underline,
    Layers,
    Layout,
    MessageSquare,
    Banana,
    LucideIcon,
    Box,
    Bell,
    CheckCircle2,
    CalendarDays,
    Edit2,
    Share2,
    Trash2,
    Monitor,
    Smartphone,
    MousePointer2,
    ChevronDown,
    Loader2
} from "lucide-react";
import Image from "next/image";

type Category = "Atoms" | "Forms" | "Containers" | "Overlays" | "Complex" | "Feedback";

const DUMMY_INVITATION = {
    id: "inv-1",
    slug: "demo-wedding",
    userId: "user-1",
    title: "혁래 & 유나의 결혼식",
    invitation_data: {
        imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
        isApproved: true,
        mainScreen: { title: "저희 결혼합니다" },
        date: "2024.12.24",
        location: "바나나 호텔 옐로우홀",
        updated_at: new Date().toISOString()
    },
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString()
};

const DUMMY_PHRASES = [
    { title: "정중한 스타일", content: "서로 다른 두 사람이 만나 하나의 길을 걷고자 합니다.<br/>축복의 자리에 함께해주시면 감사하겠습니다.", badge: "추천" },
    { title: "캐주얼 스타일", content: "드디어 저희 결혼합니다!<br/>맛있는 음식과 즐거운 만남이 가득한 자리에 초대합니다.", badge: "인기" }
];

export default function DesignSystemClient() {
    const [activeTab, setActiveTab] = useState<Category>("Atoms");
    const [radius, setRadius] = useState(16);
    const [shadowIntensity, setShadowIntensity] = useState(8);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [color, setColor] = useState("#FBC02D");
    const [toggleState, setToggleState] = useState({ bold: false, italic: false, underline: false });
    const [isRespModalOpen, setIsRespModalOpen] = useState(false);
    const [richText, setRichText] = useState("<p>Hello <strong>Banana</strong> Wedding!</p>");
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
    const [dateString, setDateString] = useState("2024-12-24");
    const [timeString, setTimeString] = useState("12:30");

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty("--radius-sm", `${radius * 0.5}px`);
        root.style.setProperty("--radius-md", `${radius}px`);
        root.style.setProperty("--radius-lg", `${radius}px`);
        root.style.setProperty("--radius-xl", `${radius * 1.25}px`);
        root.style.setProperty("--radius-2xl", `${radius * 1.5}px`);
        root.style.setProperty("--radius-3xl", `${radius * 2.5}px`);

        const alpha = (shadowIntensity / 100).toFixed(2);
        root.style.setProperty("--shadow-card", `0 4px 12px rgba(0, 0, 0, ${alpha})`);
        root.style.setProperty("--shadow-hover-card", `0 12px 24px rgba(0, 0, 0, ${(shadowIntensity * 2) / 100})`);
        root.style.setProperty("--shadow-hover-sm", `0 2px 6px rgba(0, 0, 0, ${alpha})`);
        root.style.setProperty("--shadow-hover-md", `0 6px 14px rgba(0, 0, 0, ${alpha})`);
    }, [radius, shadowIntensity]);

    const categories: { id: Category; icon: LucideIcon; label: string }[] = [
        { id: "Atoms", icon: MousePointer2, label: "Atoms (Basic)" },
        { id: "Forms", icon: Layers, label: "Form Fields" },
        { id: "Containers", icon: Box, label: "Containers" },
        { id: "Overlays", icon: Layout, label: "Overlays" },
        { id: "Complex", icon: Settings, label: "Complex UI" },
        { id: "Feedback", icon: MessageSquare, label: "Feedback" },
    ];

    const showToast = (variant: 'success' | 'error' | 'info') => {
        if (variant === 'success') toast.success("성공적으로 저장되었습니다.");
        if (variant === 'error') toast.error("오류가 발생했습니다. 다시 시도해 주세요.");
        if (variant === 'info') toast.info("새로운 공지사항이 있습니다.");
    };

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <div className={styles.logo}>
                        <Banana size={20} />
                    </div>
                    <h1>Banana System</h1>
                </div>

                <nav className={styles.nav}>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            className={cn(styles.navItem, activeTab === cat.id && styles.active)}
                            onClick={() => setActiveTab(cat.id)}
                        >
                            <cat.icon size={18} />
                            {cat.label}
                        </button>
                    ))}
                </nav>

                <div className={styles.controls}>
                    <h2>Global Theme</h2>
                    <div className={styles.controlItem}>
                        <label>
                            <span>Border Radius</span>
                            <span>{radius}px</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="40"
                            value={radius}
                            onChange={(e) => setRadius(parseInt(e.target.value))}
                        />
                    </div>

                    <div className={styles.controlItem}>
                        <label>
                            <span>Shadow Depth</span>
                            <span>{shadowIntensity}%</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="40"
                            value={shadowIntensity}
                            onChange={(e) => setShadowIntensity(parseInt(e.target.value))}
                        />
                    </div>

                    <div className={styles.controlItem}>
                        <div className={styles.presetGrid}>
                            <Button variant="outline" size="sm" onClick={() => { setRadius(4); setShadowIntensity(4); }}>Edge</Button>
                            <Button variant="outline" size="sm" onClick={() => { setRadius(16); setShadowIntensity(8); }}>Soft</Button>
                            <Button variant="outline" size="sm" onClick={() => { setRadius(32); setShadowIntensity(12); }}>Round</Button>
                        </div>
                    </div>
                </div>
            </aside>

            <main className={styles.viewport}>
                <header className={styles.pageHeader}>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 bg-yellow-400 text-white text-[10px] font-black rounded uppercase">v1.2.0</span>
                        <div className="flex gap-2 text-zinc-300">
                            <Monitor size={14} />
                            <Smartphone size={14} />
                        </div>
                    </div>
                    <h2>{categories.find(c => c.id === activeTab)?.label}</h2>
                    <p>바나나웨딩의 고품격 UI 컴포넌트 라이브러리입니다. 프로젝트 전체에서 일관된 사용자 경험을 실현합니다.</p>
                </header>

                <div className={styles.contentArea}>
                    {activeTab === "Atoms" && (
                        <div className={styles.storySection}>
                            <Story title="Universal Button System" description="바나나웨딩의 디자인 시스템을 구성하는 전용 버튼 컴포넌트">
                                <div className={styles.specTable}>
                                    {/* Brand Identity */}
                                    <div className={styles.specRow}>
                                        <h4>1. Brand Actions (Primary)</h4>
                                        <div className={styles.specGrid}>
                                            <div className="flex flex-col gap-2">
                                                <span className={styles.labelChip}>Default</span>
                                                <Button variant="default">Primary Action</Button>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className={styles.labelChip}>With Icon</span>
                                                <Button variant="default">
                                                    <Banana size={18} />
                                                    Start Building
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Neutral Actions */}
                                    <div className={styles.specRow}>
                                        <h4>2. Neutral & Secondary Actions</h4>
                                        <div className={styles.buttonGrid}>
                                            <div className="flex flex-col gap-2">
                                                <span className={styles.labelChip}>Secondary</span>
                                                <Button variant="secondary">Secondary</Button>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className={styles.labelChip}>Outline</span>
                                                <Button variant="outline">Outline</Button>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className={styles.labelChip}>Ghost</span>
                                                <Button variant="ghost">Ghost Button</Button>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className={styles.labelChip}>Link</span>
                                                <Button variant="link">Link Interaction</Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* System Actions */}
                                    <div className={styles.specRow}>
                                        <h4>3. System / Dangerous Actions</h4>
                                        <div className={styles.specGrid}>
                                            <div className="flex flex-col gap-2">
                                                <span className={styles.labelChip}>Destructive</span>
                                                <Button variant="destructive">Remove Forever</Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Premium Glass */}
                                    <div className={styles.specRow}>
                                        <h4>4. Premium Interface (Glass)</h4>
                                        <div className={styles.glassCanvas}>
                                            <div className="flex flex-col gap-2">
                                                <span className="text-[10px] font-bold text-white/50 mb-1">STANDARD</span>
                                                <Button variant="glass">Glass Action</Button>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className="text-[10px] font-bold text-white/50 mb-1">BRAND ICON</span>
                                                <Button variant="glass">
                                                    <Banana size={16} className="text-yellow-400" />
                                                    Banana Vision
                                                </Button>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className="text-[10px] font-bold text-white/50 mb-1">STATE: LOADING</span>
                                                <Button variant="glass" loading>Saving...</Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sizes */}
                                    <div className={styles.specRow}>
                                        <h4>5. Sizing & Responsive Scales</h4>
                                        <div className={styles.specGrid}>
                                            <div className="flex flex-col gap-2">
                                                <span className={styles.labelChip}>Small (36px)</span>
                                                <Button size="sm">Small Action</Button>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className={styles.labelChip}>Base (48px)</span>
                                                <Button size="default">Default Button</Button>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className={styles.labelChip}>Large (56px)</span>
                                                <Button size="lg">Hero Call-to-Action</Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Interaction States */}
                                    <div className={styles.specRow}>
                                        <h4>6. Layout & Functional States</h4>
                                        <div className={styles.specGrid}>
                                            <div className="flex flex-col gap-2">
                                                <span className={styles.labelChip}>State: Loading</span>
                                                <Button loading>Syncing data...</Button>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className={styles.labelChip}>State: Disabled</span>
                                                <Button disabled>Action Locked</Button>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className={styles.labelChip}>Prop: fullWidth</span>
                                                <div className="w-[300px]">
                                                    <Button fullWidth variant="secondary">Full Width Action</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dynamic Options Test */}
                                    <div className={styles.specRow}>
                                        <h4>7. Interactive Dynamic Props (NEW)</h4>
                                        <div className={styles.specGrid}>
                                            <div className="flex flex-col gap-2">
                                                <span className={styles.labelChip}>Custom Hex Color</span>
                                                <Button color={color}>Dynamic Bg</Button>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className={styles.labelChip}>Custom Radius</span>
                                                <Button radius={radius}>Radius: {radius}px</Button>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className={styles.labelChip}>Text Color Override</span>
                                                <Button color="#18181b" textColor="#FBC02D">Custom Combo</Button>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className={styles.labelChip}>Rounded Full</span>
                                                <Button radius={99} variant="outline">Capsule Button</Button>
                                            </div>
                                        </div>
                                        <p className="text-xs text-zinc-400 mt-2">좌측 하단의 Global Theme 컨트롤을 조작하여 실시간 변화를 확인하세요.</p>
                                    </div>
                                </div>
                            </Story>

                            <Story title="Icon Controls" description="시각적 명확성을 위한 아이콘 중심의 액션">
                                <div className={styles.specTable}>
                                    <div className={styles.specRow}>
                                        <h4>Icon Button Variants</h4>
                                        <div className={styles.specGrid}>
                                            <div className="flex flex-col gap-2">
                                                <span className={styles.labelChip}>Solid</span>
                                                <IconButton icon={Settings} variant="solid" aria-label="Settings" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className={styles.labelChip}>Outline</span>
                                                <IconButton icon={User} variant="outline" aria-label="User" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className={styles.labelChip}>Ghost</span>
                                                <IconButton icon={LogOut} variant="ghost" aria-label="Logout" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className={styles.labelChip}>Secondary</span>
                                                <IconButton icon={Bell} variant="secondary" aria-label="Notifications" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className={styles.labelChip}>Glass</span>
                                                <div className="bg-zinc-800 p-2 rounded-lg">
                                                    <IconButton icon={CheckCircle2} variant="glass" aria-label="Success" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.specRow}>
                                        <h4>Icon Button Sizes</h4>
                                        <div className={styles.specGrid}>
                                            <div className="flex flex-col gap-2">
                                                <span className={styles.labelChip}>XS (28px)</span>
                                                <IconButton icon={Settings} size="xs" variant="outline" aria-label="Settings" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className={styles.labelChip}>SM (40px)</span>
                                                <IconButton icon={Settings} size="sm" variant="outline" aria-label="Settings" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className={styles.labelChip}>MD (48px)</span>
                                                <IconButton icon={Settings} size="md" variant="outline" aria-label="Settings" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className={styles.labelChip}>LG (56px)</span>
                                                <IconButton icon={Settings} size="lg" variant="outline" aria-label="Settings" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Story>

                            <Story title="Selection & Toggles" description="독립적인 속성 제어를 위한 스위치 및 인터랙티브 칩">
                                <div className={styles.specTable}>
                                    <div className={styles.specRow}>
                                        <h4>Toggle Components</h4>
                                        <div className={styles.specGrid}>
                                            <div className="flex flex-col gap-2">
                                                <span className={styles.labelChip}>Switch</span>
                                                <div className="flex items-center gap-3">
                                                    <Switch id="sw-ds-1" />
                                                    <Label htmlFor="sw-ds-1" className="text-sm">Enable notifications</Label>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className={styles.labelChip}>Checkbox</span>
                                                <div className="flex items-center gap-3">
                                                    <Checkbox id="cb-ds-1" />
                                                    <Label htmlFor="cb-ds-1" className="text-sm">Accept terms of use</Label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.specRow}>
                                        <h4>Toggle Group (Rich Text Example)</h4>
                                        <div className={styles.specGrid}>
                                            <div className="flex gap-2 bg-white p-1 rounded-lg border shadow-sm">
                                                <Toggle
                                                    aria-label="Bold"
                                                    pressed={toggleState.bold}
                                                    onPressedChange={(v) => setToggleState(s => ({ ...s, bold: v }))}
                                                >
                                                    <Bold size={16} />
                                                </Toggle>
                                                <Toggle
                                                    aria-label="Italic"
                                                    pressed={toggleState.italic}
                                                    onPressedChange={(v) => setToggleState(s => ({ ...s, italic: v }))}
                                                >
                                                    <Italic size={16} />
                                                </Toggle>
                                                <Toggle
                                                    aria-label="Underline"
                                                    pressed={toggleState.underline}
                                                    onPressedChange={(v) => setToggleState(s => ({ ...s, underline: v }))}
                                                >
                                                    <Underline size={16} />
                                                </Toggle>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Story>

                            <Story title="Separators" description="콘텐츠 영역 구분을 위한 시각적 라인">
                                <div className={styles.specTable}>
                                    <div className={styles.specRow}>
                                        <h4>Horizontal</h4>
                                        <div className="w-full max-w-md p-4 rounded-xl border bg-zinc-50/50">
                                            <div className="text-sm font-bold mb-2">Section Alpha</div>
                                            <Separator className="my-4" />
                                            <div className="text-sm font-bold mt-2">Section Beta</div>
                                        </div>
                                    </div>
                                    <div className={styles.specRow}>
                                        <h4>Vertical</h4>
                                        <div className="flex h-5 items-center space-x-4 text-sm font-medium">
                                            <div>Home</div>
                                            <Separator orientation="vertical" />
                                            <div>Dashboard</div>
                                            <Separator orientation="vertical" />
                                            <div>Settings</div>
                                        </div>
                                    </div>
                                </div>
                            </Story>
                        </div>
                    )}

                    {activeTab === "Forms" && (
                        <div className={styles.storySection}>
                            <div className={styles.grid}>
                                <Story title="Text Inputs" description="정보 입력을 위한 표준 필드">
                                    <div className="flex flex-col gap-4 w-full">
                                        <TextField label="Display Name" placeholder="홍길동" />
                                        <TextField label="Multiline Field" placeholder="Tell us your story..." helpText="Auto-expanding textarea" multiline rows={4} />
                                        <div className="space-y-1.5">
                                            <Label>Raw Textarea</Label>
                                            <Textarea placeholder="Directly using the ui/Textarea component" />
                                        </div>
                                    </div>
                                </Story>

                                <Story title="Special Fields" description="전용 데이터 입력을 위한 필드">
                                    <div className="flex flex-col gap-4 w-full">
                                        <PhoneField label="연락처" placeholder="010-0000-0000" />
                                        <div className="space-y-3">
                                            <Label>Selection Group</Label>
                                            <RadioGroup defaultValue="1" className="flex flex-col gap-2">
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="1" id="r1" />
                                                    <Label htmlFor="r1">Option One</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="2" id="r2" />
                                                    <Label htmlFor="r2">Option Two</Label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                        <SwitchField
                                            label="알림 설정"
                                            checked={isNotificationsEnabled}
                                            onChange={setIsNotificationsEnabled}
                                        />
                                    </div>
                                </Story>

                                <Story title="Common Selectors" description="압축된 선택 및 색상 프리셋">
                                    <div className="space-y-4 w-full">
                                        <Label>Theme Selection</Label>
                                        <Select>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="카테고리를 선택하세요" />
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
                            </div>

                            <Story title="Date & Time Controls" description="정밀한 일정 관리를 위한 픽커">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                                    <div className="space-y-4">
                                        <Label>Standard Calendar</Label>
                                        <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-2xl border bg-white p-4 shadow-sm" />
                                    </div>
                                    <div className="space-y-6">
                                        <DatePicker value={dateString} onChange={setDateString} />
                                        <div className="space-y-1.5">
                                            <Label>Event Time</Label>
                                            <TimePicker value={timeString} onChange={setTimeString} />
                                        </div>
                                        <SegmentedControl defaultValue="s">
                                            <SegmentedControl.Item value="s">Small</SegmentedControl.Item>
                                            <SegmentedControl.Item value="m">Medium</SegmentedControl.Item>
                                            <SegmentedControl.Item value="l">Large</SegmentedControl.Item>
                                        </SegmentedControl>
                                    </div>
                                </div>
                            </Story>

                            <Story title="Rich Text Editor" description="Tiptap 기반의 고성능 에디터">
                                <div className="w-full">
                                    <RichTextEditor
                                        content={richText}
                                        onChange={setRichText}
                                        placeholder="초대 문구를 작성해 보세요..."
                                        minHeight={200}
                                    />
                                    <div className="mt-4 p-4 bg-zinc-50 rounded-xl border border-dashed">
                                        <Label className="mb-2 block text-xs text-zinc-400">Preview HTML</Label>
                                        <div className="text-sm font-mono text-zinc-600 truncate">{richText}</div>
                                    </div>
                                </div>
                            </Story>
                        </div>
                    )}

                    {activeTab === "Containers" && (
                        <div className={styles.storySection}>
                            <div className={styles.grid}>
                                <Story title="Tabs Mechanics" description="콘텐츠 분할 및 전환">
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

                                <Story title="Dynamic Accordion" description="나누어진 정보를 계층적으로 탐색">
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
                                <Story title="Collapsible Section" description="접고 펼칠 수 있는 인터페이스">
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

                                <Story title="Aspect Ratio" description="고정된 비율 유지">
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
                        </div>
                    )}

                    {activeTab === "Overlays" && (
                        <div className={styles.storySection}>
                            <Story title="Global Modals" description="집중 인터랙션을 위한 레이어">
                                <div className="flex flex-wrap gap-4 items-center">
                                    <Dialog>
                                        <DialogTrigger asChild><Button variant="outline">Modal Interface</Button></DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Quick Profile</DialogTitle>
                                                <DialogDescription>Update your wedding details below.</DialogDescription>
                                            </DialogHeader>
                                            <div className="py-6 space-y-4">
                                                <Input placeholder="Registry ID" />
                                                <div className="h-24 bg-zinc-50 rounded-xl border border-dashed flex items-center justify-center text-zinc-400">Content Area</div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    <Button onClick={() => setIsRespModalOpen(true)} variant="solid">Responsive Modal</Button>
                                    <ResponsiveModal
                                        open={isRespModalOpen}
                                        onOpenChange={setIsRespModalOpen}
                                        title="Responsive Modal Wrapper"
                                        description="This component renders as a Dialog on Desktop and a Drawer on Mobile."
                                        onConfirm={() => setIsRespModalOpen(false)}
                                        showCancel
                                    >
                                        <div className="py-6 space-y-4">
                                            <InfoMessage>This is the standard modal for the project.</InfoMessage>
                                            <div className="h-[200px] bg-zinc-50 rounded-2xl border border-dashed flex items-center justify-center text-zinc-300">
                                                Adaptive Content Area
                                            </div>
                                        </div>
                                    </ResponsiveModal>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild><Button variant="destructive">Critical Action</Button></AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>This action will permanently delete your wedding data.</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Keep it</AlertDialogCancel>
                                                <AlertDialogAction>Delete all</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </Story>

                            <Story title="Side Surfaces" description="모바일 최적화 사이드/바텀 패널">
                                <div className="flex gap-4">
                                    <Drawer>
                                        <DrawerTrigger asChild><Button variant="secondary">Bottom Drawer</Button></DrawerTrigger>
                                        <DrawerContent>
                                            <DrawerHeader className="text-left">
                                                <DrawerTitle>Quick Navigation</DrawerTitle>
                                                <DrawerDescription>Access settings and links.</DrawerDescription>
                                            </DrawerHeader>
                                            <div className="p-6 h-60 bg-zinc-50 rounded-t-3xl border-t border-dashed">
                                                Swipeable sheet content...
                                            </div>
                                        </DrawerContent>
                                    </Drawer>

                                    <Sheet>
                                        <SheetTrigger asChild><Button variant="outline">Right Panel</Button></SheetTrigger>
                                        <SheetContent side="right">
                                            <SheetHeader>
                                                <SheetTitle>Admin Studio</SheetTitle>
                                                <SheetDescription>Advanced system tools.</SheetDescription>
                                            </SheetHeader>
                                            <div className="mt-10 space-y-6">
                                                <Skeleton className="h-40 w-full" />
                                                <Skeleton className="h-20 w-full" />
                                                <Skeleton className="h-20 w-full" />
                                            </div>
                                        </SheetContent>
                                    </Sheet>
                                </div>
                            </Story>

                            <Story title="Menu & Floating" description="컨텍스트 메뉴 및 도움말 팝업">
                                <div className="flex gap-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm">Manage <MoreVertical size={16} className="ml-1" /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56">
                                            <DropdownMenuLabel>Invitation Tools</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem><Edit2 size={14} className="mr-2" /> Quick Edit</DropdownMenuItem>
                                            <DropdownMenuItem><Share2 size={14} className="mr-2" /> Share Link</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600"><Trash2 size={14} className="mr-2" /> Remove Permanent</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    <Popover>
                                        <PopoverTrigger asChild><Button variant="ghost" size="sm">Hover Tip</Button></PopoverTrigger>
                                        <PopoverContent className="w-80 p-5 shadow-2xl">
                                            <div className="flex gap-4">
                                                <div className="p-2 bg-yellow-100 rounded-full h-fit"><Info size={20} className="text-yellow-700" /></div>
                                                <div className="space-y-1">
                                                    <p className="font-bold text-sm">Did you know?</p>
                                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                                        The design system adapts in real-time to your sidebar adjustments!
                                                    </p>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </Story>
                        </div>
                    )}

                    {activeTab === "Complex" && (
                        <div className={styles.storySection}>
                            <Story title="Wedding Card Display" description="사용자의 청첩장 목록에서 제공되는 실제 카드">
                                <div className="max-w-[400px] w-full">
                                    <InvitationCard
                                        invitation={DUMMY_INVITATION as any} // eslint-disable-line @typescript-eslint/no-explicit-any
                                        onEdit={() => { }}
                                        onDelete={() => { }}
                                        onRequestApproval={() => { }}
                                        onCancelRequest={() => { }}
                                        onRevokeApproval={() => { }}
                                        layout="grid"
                                    />
                                </div>
                            </Story>

                            <Story title="Content Choice List" description="문구 등 프리셋 선택용 리스트">
                                <div className="w-full">
                                    <SampleList
                                        items={DUMMY_PHRASES}
                                        onSelect={(item) => toast.info(`${item.title} selected`)}
                                    />
                                </div>
                            </Story>

                            <Story title="Visual Overlays" description="공통 배너 및 메시지">
                                <div className="space-y-6 w-full">
                                    <InfoMessage>
                                        <div className="flex items-center gap-2">
                                            <CalendarDays size={16} />
                                            <span>모든 청첩장은 신청 후 24시간 이내에 관리자 승인이 완료됩니다.</span>
                                        </div>
                                    </InfoMessage>
                                    <div className="h-[200px] w-full bg-zinc-50 rounded-2xl border border-dashed flex flex-col items-center justify-center gap-4 text-zinc-300">
                                        <ImageIcon size={48} />
                                        <p className="text-sm font-medium">Image Upload Area Placeholder</p>
                                    </div>
                                </div>
                            </Story>

                            <Story title="Empty States" description="데이터가 없을 때의 친절한 안내">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                    <EmptyState
                                        icon={<ImageIcon size={48} className="text-zinc-200" />}
                                        title="사진을 업로드하세요"
                                        description="첫 번째 웨딩 갤러리를 채워보세요."
                                    />
                                    <EmptyState
                                        variant="banana"
                                        icon={<Banana size={48} />}
                                        title="청첩장이 없네요"
                                        description="지금 바로 시작해볼까요?"
                                    />
                                </div>
                            </Story>
                        </div>
                    )}

                    {activeTab === "Feedback" && (
                        <div className={styles.storySection}>
                            <Story title="Toasts (Sonner)" description="비침습적인 실시간 알림 시스템">
                                <div className="flex gap-3">
                                    <Button onClick={() => showToast('success')} className="bg-green-600 hover:bg-green-700">Test Success</Button>
                                    <Button onClick={() => showToast('error')} variant="destructive">Test Error</Button>
                                    <Button onClick={() => showToast('info')} variant="secondary">Test Info</Button>
                                </div>
                            </Story>

                            <Story title="Alert Banners" description="중요 상태 변화를 알리는 인라인 배너">
                                <div className="flex flex-col gap-4 w-full">
                                    <Alert variant="default">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        <AlertTitle>Cloud Sync Active</AlertTitle>
                                        <AlertDescription>Your changes are safely backed up to the Banana server.</AlertDescription>
                                    </Alert>
                                    <Alert variant="destructive">
                                        <TriangleAlert className="h-4 w-4" />
                                        <AlertTitle>Billing Required</AlertTitle>
                                        <AlertDescription>Please upgrade to keep your premium features.</AlertDescription>
                                    </Alert>
                                </div>
                            </Story>

                            <Story title="Loading States" description="데이터 처리 중 사용자 인지 유지">
                                <div className="flex flex-wrap gap-12 w-full">
                                    <div className="flex flex-col gap-2 items-center">
                                        <Label className="text-xs">Standard Spinner</Label>
                                        <LoadingSpinner variant="full" className="static h-16 w-16" />
                                    </div>
                                    <div className="flex flex-col gap-2 items-center">
                                        <Label className="text-xs">Linear Glow</Label>
                                        <div className="w-60">
                                            <ProgressBar />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 items-center">
                                        <Label className="text-xs">Lucide Motion</Label>
                                        <Loader2 className="animate-spin text-zinc-300" size={32} />
                                    </div>
                                </div>
                            </Story>

                            <Story title="Skeleton Previews" description="데이터 로딩 중 레이아웃 유지">
                                <div className="flex flex-col gap-8 w-full max-sm:max-w-xs">
                                    <div className="flex items-center space-x-4">
                                        <Skeleton className="h-14 w-14 rounded-full" />
                                        <div className="space-y-3">
                                            <Skeleton className="h-4 w-[220px]" />
                                            <Skeleton className="h-4 w-[140px]" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <Skeleton className="h-[180px] w-full rounded-2xl" />
                                        <div className="flex gap-3">
                                            <Skeleton className="h-10 flex-1" />
                                            <Skeleton className="h-10 flex-1" />
                                        </div>
                                    </div>
                                </div>
                            </Story>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

function Story({ title, description, children, className, containerClassName }: {
    title: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
    containerClassName?: string;
}) {
    return (
        <article className={cn(styles.story, className)}>
            <div className={styles.storyHeader}>
                <h3>{title}</h3>
                {description && <p>{description}</p>}
            </div>
            <div className={cn(styles.canvas, containerClassName)}>
                {children}
            </div>
        </article>
    );
}
