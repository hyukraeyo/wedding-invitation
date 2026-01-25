import Link from "next/link";
import styles from "./DesignSystem.module.scss";
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
    ArrowRight,
} from "lucide-react";

const sections = [
    {
        title: "Foundation",
        description: "기본 디자인 토큰과 시각적 기초",
        items: [
            { label: "Colors", href: "/design-system/colors", icon: Palette, desc: "컬러 팔레트" },
            { label: "Typography", href: "/design-system/typography", icon: Type, desc: "타이포그래피" },
            { label: "Spacing", href: "/design-system/spacing", icon: Ruler, desc: "간격 토큰" },
            { label: "Border Radius", href: "/design-system/radius", icon: Circle, desc: "테두리 반경" },
        ],
    },
    {
        title: "Components",
        description: "재사용 가능한 UI 컴포넌트",
        items: [
            { label: "Buttons", href: "/design-system/buttons", icon: MousePointer2, desc: "버튼" },
            { label: "Badges", href: "/design-system/badges", icon: BadgeCheck, desc: "배지" },
            { label: "Forms", href: "/design-system/forms", icon: FormInput, desc: "폼 요소" },
            { label: "Feedback", href: "/design-system/feedback", icon: MessageSquare, desc: "피드백" },
            { label: "Navigation", href: "/design-system/navigation", icon: Navigation, desc: "네비게이션" },
            { label: "Overlays", href: "/design-system/overlays", icon: Layers, desc: "모달 및 오버레이" },
            { label: "Cards", href: "/design-system/cards", icon: LayoutGrid, desc: "카드" },
            { label: "Skeleton", href: "/design-system/skeleton", icon: Loader, desc: "스켈레톤" },
        ],
    },
];

export default function DesignSystemHomePage() {
    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Design System</h1>
                <p>
                    바나나웨딩의 모든 UI 컴포넌트와 디자인 토큰을 한눈에 확인하세요.
                    <br />
                    일관된 사용자 경험을 위한 디자인 시스템입니다.
                </p>
            </header>

            {sections.map((section) => (
                <section key={section.title} className={styles.homeSection}>
                    <div className={styles.homeSectionHeader}>
                        <h2>{section.title}</h2>
                        <p>{section.description}</p>
                    </div>
                    <div className={styles.homeGrid}>
                        {section.items.map((item) => (
                            <Link key={item.href} href={item.href} className={styles.homeCard}>
                                <div className={styles.homeCardIcon}>
                                    <item.icon size={24} />
                                </div>
                                <div className={styles.homeCardContent}>
                                    <h3>{item.label}</h3>
                                    <p>{item.desc}</p>
                                </div>
                                <ArrowRight size={18} className={styles.homeCardArrow} />
                            </Link>
                        ))}
                    </div>
                </section>
            ))}
        </>
    );
}
