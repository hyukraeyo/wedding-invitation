import React, { useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import styles from './BuilderModal.module.scss';
import { clsx } from 'clsx';

interface BuilderModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;
}

const subscribe = () => () => { };
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export const BuilderModal = ({ isOpen, onClose, title, children, className = "" }: BuilderModalProps) => {
    const isMounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen || !isMounted) return null;

    const portalRoot = document.getElementById('sidebar-portal-root') || document.body;

    return createPortal(
        <div
            className={styles.backdrop}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className={clsx(styles.modal, className)}>
                <div className={styles.header}>
                    <h3>{title}</h3>
                    <button onClick={onClose} className={styles.closeButton}>
                        <X size={20} />
                    </button>
                </div>
                <div className={styles.body}>
                    {children}
                </div>
            </div>
        </div>,
        portalRoot
    );
};
