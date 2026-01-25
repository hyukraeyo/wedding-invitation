import styles from "../DesignSystem.module.scss";

const radiusTokens = [
    { label: "radius-sm", value: "8px", usage: "Input, Small buttons" },
    { label: "radius-md", value: "16px", usage: "Cards, Buttons" },
    { label: "radius-lg", value: "16px", usage: "Modals, Large cards" },
    { label: "radius-xl", value: "20px", usage: "Feature cards" },
    { label: "radius-2xl", value: "24px", usage: "Hero sections" },
    { label: "radius-full", value: "9999px", usage: "Avatar, Pills" },
];

export default function RadiusPage() {
    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Border Radius</h1>
                <p>모서리 반경 토큰입니다. 부드러운 UI를 위해 일관된 값을 사용합니다.</p>
            </header>

            <section className={styles.section}>
                <div className={styles.card}>
                    <div className={styles.radiusGrid}>
                        {radiusTokens.map((token) => (
                            <div key={token.label} className={styles.radiusDemo}>
                                <div
                                    className={styles.radiusBox}
                                    style={{
                                        borderRadius: token.value === "9999px" ? "50%" : token.value
                                    }}
                                >
                                    {token.value}
                                </div>
                                <div className={styles.radiusInfo}>
                                    <span className={styles.radiusLabel}>{token.label}</span>
                                    <span className={styles.radiusUsage}>{token.usage}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>사용법</h2>
                </div>
                <div className={styles.card}>
                    <pre className={styles.codeBlock}>
                        {`// SCSS에서 사용
@use "@/styles/variables" as v;

.card {
  border-radius: v.$radius-xl; // 20px
}

.button {
  border-radius: v.$radius-md; // 16px
}

.avatar {
  border-radius: v.$radius-full; // 9999px (원형)
}`}
                    </pre>
                </div>
            </section>
        </>
    );
}
