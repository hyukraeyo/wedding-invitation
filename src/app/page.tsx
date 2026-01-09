import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./Home.module.scss";

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>

        {/* Typographic Hero */}
        <div className={styles.hero}>
          <p className={styles.subtitle}>
            Digital Wedding Invitation
          </p>
          <h1 className={styles.title}>
            미니멀<br />모바일 청첩장
          </h1>
          <p className={styles.description}>
            복잡한 절차 없이, 감각적인 디자인으로<br />
            소중한 분들에게 마음을 전하세요.
          </p>
        </div>

        {/* Action */}
        <div className={styles.action}>
          <Link
            href="/builder"
            className={styles.link}
          >
            <span className={styles.text}>청첩장 만들기</span>
            <ArrowRight className={styles.icon} />
          </Link>
        </div>

      </main>

      {/* Footer / Copyright */}
      <footer className={styles.footer}>
        <p>
          © 2026 nano banana
        </p>
      </footer>
    </div>
  );
}
