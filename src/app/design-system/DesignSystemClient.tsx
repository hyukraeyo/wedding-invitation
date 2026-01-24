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
import { ColorPicker } from "@/components/ui/ColorPicker";
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
    Palette,
    Layers,
    Navigation,
    Layout,
    MessageSquare,
    Banana,
    LucideIcon
} from "lucide-react";

type Category = "Atoms" | "Molecules" | "Navigation" | "Overlays" | "Feedback";

export default function DesignSystemClient() {
    const [activeTab, setActiveTab] = useState<Category>("Atoms");
    const [radius, setRadius] = useState(16);
    const [shadowIntensity, setShadowIntensity] = useState(8);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [color, setColor] = useState("#FBC02D");

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
        { id: "Atoms", icon: Palette, label: "Atoms (Basic)" },
        { id: "Molecules", icon: Layers, label: "Molecules (Forms)" },
        { id: "Navigation", icon: Navigation, label: "Navigation" },
        { id: "Overlays", icon: Layout, label: "Overlays" },
        { id: "Feedback", icon: MessageSquare, label: "Feedback" },
    ];

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <div className={styles.logo}>
                        <Banana size={20} />
                    </div>
                    <h1>Banana Storybook</h1>
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
                    <h2>Style Playground</h2>
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
                            <span>Shadow Alpha</span>
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
                            <Button variant="outline" size="xs" onClick={() => { setRadius(4); setShadowIntensity(2); }}>Sharp</Button>
                            <Button variant="outline" size="xs" onClick={() => { setRadius(16); setShadowIntensity(8); }}>Soft</Button>
                            <Button variant="outline" size="xs" onClick={() => { setRadius(24); setShadowIntensity(15); }}>Bold</Button>
                        </div>
                    </div>
                </div>
            </aside>

            <main className={styles.viewport}>
                <header className={styles.pageHeader}>
                    <h2>{categories.find(c => c.id === activeTab)?.label}</h2>
                    <p>Banana Wedding의 {activeTab} 단계 컴포넌트들을 확인합니다.</p>
                </header>

                {activeTab === "Atoms" && (
                    <div className={styles.storySection}>
                        <Story title="Buttons" description="다양한 변이와 상태의 버튼들">
                            <Button>Default Primary</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="destructive">Destructive</Button>
                            <Button loading>Loading State</Button>
                            <Button disabled>Disabled</Button>
                        </Story>

                        <Story title="Icon Buttons" description="아이콘 중심의 액션 버튼">
                            <IconButton icon={Settings} variant="solid" aria-label="Settings" />
                            <IconButton icon={User} variant="outline" aria-label="User" />
                            <IconButton icon={LogOut} variant="ghost" aria-label="Logout" />
                            <IconButton icon={Palette} variant="secondary" size="lg" aria-label="Palette" />
                        </Story>

                        <Story title="Toggles" description="독립적인 온/오프 상태 전환">
                            <Toggle aria-label="Toggle bold"><Bold size={16} /></Toggle>
                            <Toggle aria-label="Toggle italic"><Italic size={16} /></Toggle>
                            <Toggle aria-label="Toggle underline"><Underline size={16} /></Toggle>
                        </Story>

                        <Story title="Typography & Labels" description="기본 텍스트 스타일">
                            <div className="flex flex-col gap-2">
                                <Label>Standard Label</Label>
                                <p className="text-sm text-muted-foreground">This is how helper text looks under a label.</p>
                            </div>
                        </Story>
                    </div>
                )}

                {activeTab === "Molecules" && (
                    <div className={styles.storySection}>
                        <div className={styles.grid}>
                            <Story title="Inputs" description="텍스트 입력 컨트롤">
                                <div className="flex flex-col gap-4 w-full">
                                    <Input placeholder="Standard Input..." />
                                    <Textarea placeholder="Multi-line Textarea..." rows={3} />
                                </div>
                            </Story>

                            <Story title="Selection Controls" description="사용자 선택 유도">
                                <div className="flex flex-col gap-6 w-full">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2"><Checkbox id="c1" /><Label htmlFor="c1">Checkbox</Label></div>
                                        <div className="flex items-center gap-2"><Switch id="s1" /><Label htmlFor="s1">Switch</Label></div>
                                    </div>
                                    <RadioGroup defaultValue="1">
                                        <div className="flex items-center gap-2"><RadioGroupItem value="1" id="r1" /><Label htmlFor="r1">Option A</Label></div>
                                        <div className="flex items-center gap-2"><RadioGroupItem value="2" id="r2" /><Label htmlFor="r2">Option B</Label></div>
                                    </RadioGroup>
                                </div>
                            </Story>

                            <Story title="Selects" description="드롭다운 메뉴형 선택">
                                <Select>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Pick a Banana" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ripe">Ripe Banana</SelectItem>
                                        <SelectItem value="green">Green Banana</SelectItem>
                                        <SelectItem value="overripe">Sweet Spot Banana</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Story>

                            <Story title="Complex Controls" description="색상 및 날짜 선택">
                                <div className="flex flex-col gap-4">
                                    <ColorPicker
                                        value={color}
                                        onChange={setColor}
                                        colors={["#FBC02D", "#E53935", "#D81B60", "#8E24AA", "#5E35B1", "#3949AB", "#1E88E5", "#039BE5"]}
                                    />
                                    <Separator />
                                    <SegmentedControl defaultValue="small">
                                        <SegmentedControl.Item value="small">Small</SegmentedControl.Item>
                                        <SegmentedControl.Item value="large">Large</SegmentedControl.Item>
                                    </SegmentedControl>
                                </div>
                            </Story>
                        </div>

                        <Story title="Calendar" description="고급 날짜 선택 인터페이스">
                            <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border bg-white" />
                        </Story>
                    </div>
                )}

                {activeTab === "Navigation" && (
                    <div className={styles.storySection}>
                        <Story title="Tabs" description="콘텐츠 분할 및 전환">
                            <Tabs defaultValue="1" className="w-[400px]">
                                <TabsList>
                                    <TabsTrigger value="1">Account</TabsTrigger>
                                    <TabsTrigger value="2">Security</TabsTrigger>
                                    <TabsTrigger value="3">API</TabsTrigger>
                                </TabsList>
                                <TabsContent value="1" className="p-4 border rounded-b-md bg-white">Manage account details.</TabsContent>
                            </Tabs>
                        </Story>

                        <Story title="Accordion" description="수직 아코디언 메뉴">
                            <Accordion type="single" collapsible className="w-[400px]">
                                <AccordionItem value="1">
                                    <AccordionTrigger>Why Banana?</AccordionTrigger>
                                    <AccordionContent>Because it is sweet and long-lasting.</AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="2">
                                    <AccordionTrigger>Is it free?</AccordionTrigger>
                                    <AccordionContent>Yes, most core features are free.</AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </Story>
                    </div>
                )}

                {activeTab === "Overlays" && (
                    <div className={styles.storySection}>
                        <Story title="Modals & Dialogs" description="집중 인터랙션을 위한 레이어">
                            <div className="flex gap-4">
                                <Dialog>
                                    <DialogTrigger asChild><Button variant="outline">Modal Dialog</Button></DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader><DialogTitle>Edit Profile</DialogTitle><DialogDescription>Update your information.</DialogDescription></DialogHeader>
                                        <div className="py-4">Form fields would go here...</div>
                                    </DialogContent>
                                </Dialog>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild><Button variant="destructive">Alert Dialog</Button></AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action is non-reversible.</AlertDialogDescription></AlertDialogHeader>
                                        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction>Confirm</AlertDialogAction></AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </Story>

                        <Story title="Side Surfaces" description="화면 측면에서 나타나는 서피스">
                            <div className="flex gap-4">
                                <Drawer>
                                    <DrawerTrigger asChild><Button variant="outline">Bottom Drawer</Button></DrawerTrigger>
                                    <DrawerContent>
                                        <DrawerHeader><DrawerTitle>Mobile Menu</DrawerTitle><DrawerDescription>Swipe down to close.</DrawerDescription></DrawerHeader>
                                        <div className="p-8">Drawer content area</div>
                                    </DrawerContent>
                                </Drawer>

                                <Sheet>
                                    <SheetTrigger asChild><Button variant="outline">Side Sheet</Button></SheetTrigger>
                                    <SheetContent side="right">
                                        <SheetHeader><SheetTitle>Settings</SheetTitle><SheetDescription>Configuration panel.</SheetDescription></SheetHeader>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </Story>

                        <Story title="Floating Elements" description="앵커 포인트를 가진 플로팅 박스">
                            <div className="flex gap-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild><Button variant="outline">Actions <MoreVertical size={16} className="ml-2" /></Button></DropdownMenuTrigger>
                                    <DropdownMenuContent><DropdownMenuLabel>Options</DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuItem>Edit</DropdownMenuItem><DropdownMenuItem>Duplicate</DropdownMenuItem><DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem></DropdownMenuContent>
                                </DropdownMenu>

                                <Popover>
                                    <PopoverTrigger asChild><Button variant="outline">Hint</Button></PopoverTrigger>
                                    <PopoverContent className="w-64 p-4 text-sm">You can customize the radius from the sidebar!</PopoverContent>
                                </Popover>
                            </div>
                        </Story>
                    </div>
                )}

                {activeTab === "Feedback" && (
                    <div className={styles.storySection}>
                        <Story title="Alerts" description="사용자 주의 사항 전달">
                            <div className="flex flex-col gap-4 w-full">
                                <Alert><Info className="h-4 w-4" /><AlertTitle>Success</AlertTitle><AlertDescription>Everything looks great.</AlertDescription></Alert>
                                <Alert variant="destructive"><TriangleAlert className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>Failed to sync data.</AlertDescription></Alert>
                            </div>
                        </Story>

                        <Story title="Loading States" description="데이터 처리 중 상태 표시">
                            <div className="flex flex-col gap-4 w-full">
                                <Skeleton className="h-4 w-[250px]" />
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2"><Skeleton className="h-4 w-[120px]" /><Skeleton className="h-4 w-[100px]" /></div>
                                </div>
                            </div>
                        </Story>

                        <Story title="Empty States" description="콘텐츠가 비어있는 화면">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                <EmptyState icon={<ImageIcon size={32} />} title="No Media" description="Upload photos to get started." />
                                <EmptyState variant="banana" icon={<Banana size={32} />} title="No Invitations" description="Create your first invitation." />
                            </div>
                        </Story>

                        <Story title="Subtle Feedback" description="가볍게 전달되는 메시지">
                            <InfoMessage>Your changes have been autosaved.</InfoMessage>
                        </Story>
                    </div>
                )}
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
