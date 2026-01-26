"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./DesignSystem.module.scss";
import { clsx } from "clsx";
import {
    Palette,
    Type,
    MousePointer2,
    BadgeCheck,
    FormInput,
    MessageSquare,
    Navigation,
    LayoutGrid,
    Loader,
    Layers,
    Circle,
    Ruler,
    ChevronDown,
    Settings,
    List
} from "lucide-react";
import { Button } from "@/components/ui/Button";

// Sidebar Navigation Items
// Sidebar Navigation Items
const navSections = [
    {
        title: "Foundation",
        items: [
            { id: "colors", label: "Colors", icon: Palette, href: "/design-system/foundation/colors" },
            { id: "typography", label: "Typography", icon: Type, href: "/design-system/foundation/typography" },
            { id: "spacing", label: "Spacing", icon: Ruler, href: "/design-system/foundation/spacing" },
            { id: "radius", label: "Border Radius", icon: Circle, href: "/design-system/foundation/radius" },
        ],
    },
    {
        title: "Atoms",
        items: [
            { id: "buttons", label: "Buttons", icon: MousePointer2, href: "/design-system/atoms/buttons" },
            { id: "badges", label: "Badges", icon: BadgeCheck, href: "/design-system/atoms/badges" },
            { id: "inputs", label: "Text Inputs", icon: FormInput, href: "/design-system/atoms/inputs" },
            { id: "skeleton", label: "Skeleton / Loader", icon: Loader, href: "/design-system/atoms/skeleton" },
        ],
    },
    {
        title: "Molecules",
        items: [
            {
                id: "choices",
                label: "Choices",
                icon: Circle,
                href: "/design-system/molecules/choices",
                subNav: [
                    { id: "radio", label: "Radio Groups", href: "/design-system/molecules/choices/radio" },
                    { id: "switch", label: "Switches", href: "/design-system/molecules/choices/switch" },
                ]
            },
            {
                id: "select",
                label: "Select",
                icon: FormInput,
                href: "/design-system/molecules/select",
            },
            {
                id: "pickers",
                label: "Pickers",
                icon: Palette,
                href: "/design-system/molecules/pickers",
                subNav: [
                    { id: "color-picker", label: "Color Picker", href: "/design-system/molecules/pickers/color-picker" },
                    { id: "date-picker", label: "Date Picker", href: "/design-system/molecules/pickers/date-picker" },
                ]
            },
            { id: "toggles", label: "Toggle Chips", icon: FormInput, href: "/design-system/molecules/toggles" },
            { id: "accordions", label: "Accordions", icon: ChevronDown, href: "/design-system/molecules/accordions" },
            { id: "tabs", label: "Tabs & Navigation", icon: Navigation, href: "/design-system/molecules/navigation#tabs" },
            {
                id: "feedback",
                label: "Alerts & Feedback",
                icon: MessageSquare,
                href: "/design-system/molecules/feedback",
                subNav: [
                    { id: "alerts", label: "Alert Banners", href: "/design-system/molecules/feedback/alerts" },
                    { id: "toasts", label: "Toasts (Sonner)", href: "/design-system/molecules/feedback/toasts" },
                ]
            },
        ],
    },
    {
        title: "Organisms",
        items: [
            { id: "menu", label: "Menu (TDS)", icon: List, href: "/design-system/organisms/menu" },
            {
                id: "overlays",
                label: "Modals & Overlays",
                icon: Layers,
                href: "/design-system/organisms/overlays",
                subNav: [
                    { id: "modal-dialog", label: "Modals & Dialogs", href: "/design-system/organisms/overlays/modals" },
                    { id: "bottom-sheets", label: "Bottom Sheets", href: "/design-system/organisms/overlays/drawers" },
                ]
            },
            { id: "cards", label: "UI Cards", icon: LayoutGrid, href: "/design-system/organisms/cards" },
            { id: "editor", label: "Rich Content Editor", icon: FormInput, href: "/design-system/organisms/editor" },
        ],
    },
];

export default function DesignSystemLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [radius, setRadius] = useState(16);
    const [shadowIntensity, setShadowIntensity] = useState(8);

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty("--radius-sm", `${radius * 0.5}px`);
        root.style.setProperty("--radius-md", `${radius}px`);
        root.style.setProperty("--radius-lg", `${radius}px`);
        root.style.setProperty("--radius-xl", `${radius * 1.25}px`);
        root.style.setProperty("--radius-2xl", `${radius * 1.5}px`);
        root.style.setProperty("--radius-3xl", `${radius * 2.5}px`);

        const alpha = (shadowIntensity / 100).toFixed(2);
        root.style.setProperty("--shadow-card", `none`);
        root.style.setProperty("--shadow-hover-card", `none`);
        root.style.setProperty("--shadow-hover-sm", `none`);
        root.style.setProperty("--shadow-hover-md", `none`);
    }, [radius, shadowIntensity]);

    return (
        <div className={styles.layout}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <Link href="/design-system" className={styles.sidebarHeader}>
                    <h1>🍌 Design System</h1>
                    <p>Banana Wedding UI Kit</p>
                </Link>

                <nav className={styles.sidebarNav}>
                    {navSections.map((section) => (
                        <div key={section.title} className={styles.sidebarSection}>
                            <div className={styles.sidebarSectionTitle}>{section.title}</div>
                            {section.items.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                                const hasSubNav = item.subNav && item.subNav.length > 0;

                                return (
                                    <React.Fragment key={item.id}>
                                        <Link
                                            href={item.href}
                                            className={clsx(
                                                styles.sidebarLink,
                                                isActive && styles["sidebarLink--active"]
                                            )}
                                        >
                                            <item.icon size={18} />
                                            <span style={{ flex: 1 }}>{item.label}</span>
                                            {hasSubNav && (
                                                <ChevronDown
                                                    size={14}
                                                    style={{
                                                        opacity: 0.5,
                                                        transform: isActive ? 'rotate(0deg)' : 'rotate(-90deg)',
                                                        transition: 'transform 0.2s ease'
                                                    }}
                                                />
                                            )}
                                        </Link>

                                        {hasSubNav && isActive && (
                                            <div className={styles.sidebarSubNav}>
                                                {item.subNav.map((subItem) => (
                                                    <Link
                                                        key={subItem.id}
                                                        href={subItem.href}
                                                        className={clsx(
                                                            styles.sidebarSubLink,
                                                            pathname === subItem.href && styles["sidebarSubLink--active"]
                                                        )}
                                                    >
                                                        {subItem.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                <div className={styles.sidebarControls}>
                    <div className={styles.sidebarSectionTitle}>
                        <Settings size={14} style={{ marginRight: 6 }} />
                        Theme Playground
                    </div>
                    <div className={styles.sidebarControlItem}>
                        <label>
                            <span>Radius</span>
                            <span>{radius}px</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="32"
                            value={radius}
                            onChange={(e) => setRadius(parseInt(e.target.value))}
                        />
                    </div>
                    <div className={styles.sidebarControlItem}>
                        <label>
                            <span>Shadow</span>
                            <span>{shadowIntensity}%</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="30"
                            value={shadowIntensity}
                            onChange={(e) => setShadowIntensity(parseInt(e.target.value))}
                        />
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={styles.sidebarControlReset}
                        onClick={() => { setRadius(16); }}
                    >
                        Reset Radius
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                <div className={styles.container}>
                    {children}
                </div>
            </main>
        </div>
    );
}
