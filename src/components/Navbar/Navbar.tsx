import React, { useEffect, useState, useRef } from 'react';
import styles from './Navbar.module.scss';

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;

      // 아래로 스크롤 시 숨김, 위로 스크롤 시 보임
      if (delta > 6 && y > 60) {
        setHidden(true);
      } else if (delta < -6 || y <= 60) {
        setHidden(false);
      }

      lastY.current = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`${styles.navbar} ${hidden ? styles['navbar--hidden'] : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className={styles.brand}>
        <span className={styles.brandLogo}>N</span>
      </div>
      <nav aria-label="주 메뉴">
        <ul className={styles.menu}>
          <li>홈</li>
          <li>서비스</li>
          <li>문의</li>
        </ul>
      </nav>
    </header>
  );
}
