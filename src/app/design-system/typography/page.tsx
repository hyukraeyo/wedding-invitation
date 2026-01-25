import styles from "../DesignSystem.module.scss";

const typographyItems = [
    { label: "Heading 1", size: "2.5rem (40px)", weight: "800", example: "결혼식에 초대합니다" },
    { label: "Heading 2", size: "1.875rem (30px)", weight: "700", example: "신랑 & 신부" },
    { label: "Heading 3", size: "1.5rem (24px)", weight: "600", example: "오시는 길" },
    { label: "Heading 4", size: "1.25rem (20px)", weight: "600", example: "마음 전하실 곳" },
    { label: "Body Large", size: "1.125rem (18px)", weight: "400", example: "소중한 분들을 초대합니다." },
    { label: "Body Base", size: "1rem (16px)", weight: "400", example: "두 사람이 사랑으로 만나 하나의 가정을 이루게 되었습니다." },
    { label: "Body Small", size: "0.875rem (14px)", weight: "400", example: "자세한 일정과 장소를 확인해 주세요." },
    { label: "Caption", size: "0.75rem (12px)", weight: "500", example: "2026년 3월 21일 토요일 오후 2시" },
];

export default function TypographyPage() {
    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Typography</h1>
                <p>일관된 타이포그래피 시스템으로 가독성과 계층 구조를 제공합니다.</p>
            </header>

            <section className={styles.section}>
                <div className={styles.card}>
                    {typographyItems.map((item, index) => (
                        <div key={item.label} className={styles.typographyRow}>
                            <div className={styles.typographyMeta}>
                                <span className={styles.label}>{item.label}</span>
                                <span className={styles.typographySpec}>{item.size} • {item.weight}</span>
                            </div>
                            <p
                                style={{
                                    fontSize: item.size.split(" ")[0],
                                    fontWeight: parseInt(item.weight),
                                    color: index < 4 ? "#18181b" : "#3f3f46"
                                }}
                            >
                                {item.example}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>폰트 패밀리</h2>
                </div>
                <div className={styles.card}>
                    <div className={styles.fontShowcase}>
                        <div className={styles.fontItem}>
                            <span className={styles.fontLabel}>Sans (기본)</span>
                            <p style={{ fontFamily: "var(--font-pretendard), sans-serif" }}>
                                Pretendard - 가나다라마바사 ABCDabcd 1234
                            </p>
                        </div>
                        <div className={styles.fontItem}>
                            <span className={styles.fontLabel}>Serif (명조)</span>
                            <p style={{ fontFamily: "var(--font-nanum-myeongjo), serif" }}>
                                나눔명조 - 가나다라마바사 ABCDabcd 1234
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
