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
    List
} from "lucide-react";

const sections = [
    {
        title: "Foundation",
        description: "기본 디자인 토큰과 시각적 기초",
        items: [
            { label: "Colors", href: "/design-system/foundation/colors", icon: Palette, desc: "컬러 팔레트" },
            { label: "Typography", href: "/design-system/foundation/typography", icon: Type, desc: "타이포그래피" },
            { label: "Spacing", href: "/design-system/foundation/spacing", icon: Ruler, desc: "간격 토큰" },
            { label: "Border Radius", href: "/design-system/foundation/radius", icon: Circle, desc: "테두리 반경" },
        ],
    },
    {
        title: "Atoms",
        description: "더 이상 분해할 수 없는 최소 단위의 UI 요소",
        items: [
            { label: "Buttons", href: "/design-system/atoms/buttons", icon: MousePointer2, desc: "버튼" },
            { label: "Badges", href: "/design-system/atoms/badges", icon: BadgeCheck, desc: "배지" },
            { label: "Inputs", href: "/design-system/atoms/inputs", icon: FormInput, desc: "입력 필드" },
            { label: "Skeleton", href: "/design-system/atoms/skeleton", icon: Loader, desc: "스켈레톤" },
        ],
    },
    {
        title: "Molecules",
        description: "두 개 이상의 Atom이 결합되어 기능을 수행하는 컴포넌트",
        items: [
            { label: "Choices", href: "/design-system/molecules/choices", icon: Circle, desc: "라디오, 스위치" },
            { label: "Select", href: "/design-system/molecules/select", icon: FormInput, desc: "선택 및 드롭다운" },
            { label: "Pickers", href: "/design-system/molecules/pickers", icon: Palette, desc: "날짜, 컬러 선택" },
            { label: "Toggles", href: "/design-system/molecules/toggles", icon: FormInput, desc: "토글 칩" },
            { label: "Feedback", href: "/design-system/molecules/feedback", icon: MessageSquare, desc: "알림 및 토스트" },
            { label: "Navigation", href: "/design-system/molecules/navigation", icon: Navigation, desc: "탭 및 네비게이션" },
            { label: "Accordions", href: "/design-system/molecules/accordions", icon: ArrowRight, desc: "아코디언" },
        ],
    },
    {
        title: "Organisms",
        description: "복잡한 서비스 로직을 포함하거나 독립적인 영역",
        items: [
            { label: "Menu", href: "/design-system/organisms/menu", icon: List, desc: "TDS 스타일 메뉴" },
            { label: "Overlays", href: "/design-system/organisms/overlays", icon: Layers, desc: "모달 및 바텀시트" },
            { label: "Cards", href: "/design-system/organisms/cards", icon: LayoutGrid, desc: "카드 컴포넌트" },
            { label: "Editor", href: "/design-system/organisms/editor", icon: FormInput, desc: "리치 텍스트 에디터" },
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
