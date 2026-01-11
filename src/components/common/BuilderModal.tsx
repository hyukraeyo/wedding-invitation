import React, { useEffect, useSyncExternalStore, useId } from 'react';
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
    const titleId = useId();

    useEffect(() => {
        if (!isOpen) return;

        document.body.style.overflow = 'hidden';
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);


    if (!isOpen || !isMounted) return null;

    const portalRoot = document.getElementById('sidebar-portal-root') || document.body;

    return createPortal(
        <div
            className={styles.backdrop}
            onClick={(e) => e.target === e.currentTarget && onClose()}
            role="presentation"
        >
            <div
                className={clsx(styles.modal, className)}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
            >
                <div className={styles.header}>
                    <h3 id={titleId}>{title}</h3>
                    <button
                        onClick={onClose}
                        className={styles.closeButton}
                        aria-label="닫기"
                    >
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

