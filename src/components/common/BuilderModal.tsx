import React, { useEffect, useState } from 'react';
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

export const BuilderModal = ({ isOpen, onClose, title, children, className = "" }: BuilderModalProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    const portalRoot = document.getElementById('sidebar-portal-root') || document.body;

    return createPortal(
        <div
            className={styles.backdrop}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            {/* Modal Content */}
            <div className={clsx(styles.modal, className)}>
                {/* Header */}
                <div className={styles.header}>
                    <h3>{title}</h3>
                    <button
                        onClick={onClose}
                        className={styles.closeButton}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className={styles.body}>
                    {children}
                </div>
            </div>
        </div>,
        portalRoot
    );
};
