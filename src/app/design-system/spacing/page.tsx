import styles from "../DesignSystem.module.scss";

const spacingTokens = [
    { label: "0.25rem", value: "4px", width: 16 },
    { label: "0.5rem", value: "8px", width: 32 },
    { label: "0.75rem", value: "12px", width: 48 },
    { label: "1rem", value: "16px", width: 64 },
    { label: "1.5rem", value: "24px", width: 96 },
    { label: "2rem", value: "32px", width: 128 },
    { label: "2.5rem", value: "40px", width: 160 },
    { label: "3rem", value: "48px", width: 192 },
    { label: "4rem", value: "64px", width: 256 },
];

export default function SpacingPage() {
    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Spacing</h1>
                <p>일관된 간격 시스템으로 레이아웃의 조화를 유지합니다. 4px 그리드 기반입니다.</p>
            </header>

            <section className={styles.section}>
                <div className={styles.card}>
                    {spacingTokens.map((token) => (
                        <div key={token.value} className={styles.spacingRow}>
                            <span className={styles.spacingLabel}>{token.value}</span>
                            <span className={styles.spacingRem}>{token.label}</span>
                            <div
                                className={styles.spacingDemo}
                                style={{ width: `${token.width}px` }}
                            />
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>사용 가이드</h2>
                </div>
                <div className={styles.card}>
                    <div className={styles.usageGuide}>
                        <div className={styles.usageItem}>
                            <strong>4px</strong>
                            <span>아이콘과 텍스트 사이, 작은 요소 간격</span>
                        </div>
                        <div className={styles.usageItem}>
                            <strong>8px</strong>
                            <span>관련 요소 그룹 내부 간격</span>
                        </div>
                        <div className={styles.usageItem}>
                            <strong>16px</strong>
                            <span>섹션 내부 기본 간격, 카드 패딩</span>
                        </div>
                        <div className={styles.usageItem}>
                            <strong>24px</strong>
                            <span>섹션 간 간격, 큰 컴포넌트 내부</span>
                        </div>
                        <div className={styles.usageItem}>
                            <strong>32px+</strong>
                            <span>페이지 섹션 구분, 대형 레이아웃</span>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
