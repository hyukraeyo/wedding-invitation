'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import { Drawer } from 'vaul';
import styles from './DrawerDirectionTest.module.scss';

type DrawerDirection = 'bottom' | 'left' | 'right' | 'top';

const DRAWER_DIRECTIONS: DrawerDirection[] = ['bottom', 'left', 'right', 'top'];

const getDirectionClassName = (direction: DrawerDirection) => {
  if (direction === 'bottom') return styles.bottom;
  if (direction === 'left') return styles.left;
  if (direction === 'right') return styles.right;
  return styles.top;
};

function DrawerDirectionCase({ direction }: { direction: DrawerDirection }) {
  const [open, setOpen] = React.useState(false);

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{direction.toUpperCase()} Drawer</h2>
      <p className={styles.sectionDescription}>vaul 기본 동작 + 방향/스크롤 점검</p>

      <Drawer.Root open={open} onOpenChange={setOpen} direction={direction}>
        <Drawer.Trigger asChild>
          <button type="button" className={styles.trigger}>
            {direction} 열기
          </button>
        </Drawer.Trigger>

        <Drawer.Portal>
          <Drawer.Overlay className={styles.overlay} />
          <Drawer.Content
            className={clsx(styles.content, getDirectionClassName(direction))}
            aria-label={`${direction} drawer test`}
          >
            <div className={styles.header}>
              <Drawer.Title className={styles.drawerTitle}>{direction} Drawer Test</Drawer.Title>
              <Drawer.Description className={styles.drawerDescription}>
                스크롤이 가능한지 확인하세요.
              </Drawer.Description>
            </div>

            <div data-vaul-no-drag="true" className={styles.scrollArea}>
              {Array.from({ length: 80 }, (_, index) => (
                <p key={index} className={styles.line}>
                  [{direction}] line {index + 1}
                </p>
              ))}
            </div>

            <div className={styles.footer}>
              <Drawer.Close asChild>
                <button type="button" className={styles.closeButton}>
                  닫기
                </button>
              </Drawer.Close>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </section>
  );
}

export default function DrawerDirectionTest() {
  return (
    <div className={styles.root}>
      <header className={styles.heading}>
        <h1 className={styles.title}>Vaul Drawer Direction Test</h1>
        <p className={styles.description}>경로: /drawer-test</p>
      </header>

      {DRAWER_DIRECTIONS.map((direction) => (
        <DrawerDirectionCase key={direction} direction={direction} />
      ))}
    </div>
  );
}
