"use client";

import React from "react";
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
} from "lucide-react";

// Sidebar Navigation Items
const navSections = [
    {
        title: "Foundation",
        items: [
            { id: "colors", label: "Colors", icon: Palette, href: "/design-system/colors" },
            { id: "typography", label: "Typography", icon: Type, href: "/design-system/typography" },
            { id: "spacing", label: "Spacing", icon: Ruler, href: "/design-system/spacing" },
            { id: "radius", label: "Border Radius", icon: Circle, href: "/design-system/radius" },
        ],
    },
    {
        title: "Components",
        items: [
            { id: "buttons", label: "Buttons", icon: MousePointer2, href: "/design-system/buttons" },
            { id: "badges", label: "Badges", icon: BadgeCheck, href: "/design-system/badges" },
            { id: "forms", label: "Forms & Inputs", icon: FormInput, href: "/design-system/forms" },
            { id: "feedback", label: "Feedback", icon: MessageSquare, href: "/design-system/feedback" },
            { id: "accordions", label: "Accordions", icon: ChevronDown, href: "/design-system/accordions" },
            { id: "navigation", label: "Navigation", icon: Navigation, href: "/design-system/navigation" },
            { id: "overlays", label: "Modals & Overlays", icon: Layers, href: "/design-system/overlays" },
            { id: "cards", label: "Cards", icon: LayoutGrid, href: "/design-system/cards" },
            { id: "skeleton", label: "Skeleton", icon: Loader, href: "/design-system/skeleton" },
        ],
    },
];

export default function DesignSystemLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();


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
                            {section.items.map((item) => (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={clsx(
                                        styles.sidebarLink,
                                        pathname === item.href && styles["sidebarLink--active"]
                                    )}
                                >
                                    <item.icon />
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    ))}
                </nav>
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

