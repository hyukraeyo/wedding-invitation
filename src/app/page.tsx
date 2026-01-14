import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import styles from "./Home.module.scss";

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>

        {/* Typographic Hero */}
        <div className={styles.hero}>
          <div className={styles.logo}>
            <Image
              src="/logo.png"
              alt="Banana Wedding"
              width={80}
              height={80}
              priority
            />
          </div>
          <h1 className={styles.title}>
            달콤한 시작,<br />바나나웨딩
          </h1>
          <p className={styles.description}>
            유통기한 없는 우리만의 달콤한 이야기,<br />
            바나나웨딩에서 특별하게 전하세요.
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
          © 2026 banana wedding
        </p>
      </footer>
    </div>
  );
}
