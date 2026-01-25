import styles from "../DesignSystem.module.scss";

const colors = [
    { name: "Primary", value: "#FBC02D", desc: "메인 브랜드 컬러" },
    { name: "Primary Dark", value: "#F9A825", desc: "프라이머리 다크" },
    { name: "Primary Hover", value: "#E6B02A", desc: "호버 상태" },
    { name: "Ivory", value: "#FFFBEA", desc: "밝은 배경" },
    { name: "Success", value: "#22C55E", desc: "성공 상태" },
    { name: "Warning", value: "#F59E0B", desc: "경고 상태" },
    { name: "Error", value: "#EF4444", desc: "에러 상태" },
    { name: "Info", value: "#3B82F6", desc: "정보 상태" },
    { name: "Zinc 50", value: "#FAFAFA", desc: "가장 밝은 그레이" },
    { name: "Zinc 100", value: "#F4F4F5", desc: "밝은 그레이" },
    { name: "Zinc 200", value: "#E4E4E7", desc: "보더 컬러" },
    { name: "Zinc 300", value: "#D4D4D8", desc: "비활성 보더" },
    { name: "Zinc 400", value: "#A1A1AA", desc: "플레이스홀더" },
    { name: "Zinc 500", value: "#71717A", desc: "보조 텍스트" },
    { name: "Zinc 600", value: "#52525B", desc: "중간 텍스트" },
    { name: "Zinc 700", value: "#3F3F46", desc: "진한 텍스트" },
    { name: "Zinc 800", value: "#27272A", desc: "강조 텍스트" },
    { name: "Zinc 900", value: "#18181B", desc: "가장 진한 텍스트" },
];

export default function ColorsPage() {
    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Colors</h1>
                <p>바나나웨딩의 컬러 팔레트입니다. 프라이머리 옐로우를 중심으로 일관된 색상 시스템을 제공합니다.</p>
            </header>

            <section className={styles.section}>
                <div className={styles.card}>
                    <div className={styles.colorGrid}>
                        {colors.map((color) => (
                            <div key={color.name} className={styles.colorCard}>
                                <div
                                    className={styles.colorCardPreview}
                                    style={{ backgroundColor: color.value }}
                                />
                                <div className={styles.colorCardInfo}>
                                    <span className={styles.name}>{color.name}</span>
                                    <span className={styles.value}>{color.value}</span>
                                    <span className={styles.desc}>{color.desc}</span>
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

.myComponent {
  background-color: v.$color-primary;
  color: v.$zinc-900;
  border: 1px solid v.$zinc-200;
}`}
                    </pre>
                </div>
            </section>
        </>
    );
}
