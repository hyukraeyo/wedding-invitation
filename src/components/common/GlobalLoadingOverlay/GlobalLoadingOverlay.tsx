'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { useGlobalLoadingStore } from '@/store/useGlobalLoadingStore';
import { Banana } from 'lucide-react';
import styles from './GlobalLoadingOverlay.module.scss';
import { AnimatePresence, motion } from 'framer-motion';

export const GlobalLoadingOverlay = () => {
  const { isLoading, message } = useGlobalLoadingStore();

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className={styles.spinnerWrapper}>
            <Banana className={styles.spinner} size={40} />
            {message && <p className={styles.message}>{message}</p>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
