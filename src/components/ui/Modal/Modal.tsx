'use client';

import React from 'react';
import { Modal as TDSModal, ModalProps as TDSModalProps } from '@toss/tds-mobile';
import styles from './Modal.module.scss';

interface ModalHeaderProps {
    title?: string;
    children?: React.ReactNode;
    className?: string | undefined;
}

const ModalHeader = ({ title, children, className }: ModalHeaderProps) => (
    <div className={`${styles.header} ${className || ''}`}>
        {title && <h2 className={styles.title}>{title}</h2>}
        {children}
    </div>
);

interface ModalContentProps {
    children: React.ReactNode;
    className?: string | undefined;
}

const ModalContent = ({ children, className }: ModalContentProps) => (
    <div className={`${styles.content} ${className || ''}`}>
        {children}
    </div>
);

interface ModalFooterProps {
    children: React.ReactNode;
    className?: string | undefined;
}

const ModalFooter = ({ children, className }: ModalFooterProps) => (
    <div className={`${styles.footer} ${className || ''}`}>
        {children}
    </div>
);

const ModalMain = ({ children, ...props }: TDSModalProps) => {
    return <TDSModal {...props}>{children}</TDSModal>;
};

ModalMain.displayName = 'Modal';

export const Modal = Object.assign(
    ModalMain,
    {
        Overlay: TDSModal.Overlay,
        Content: TDSModal.Content,
        Header: ModalHeader,
        Body: ModalContent,
        Footer: ModalFooter,
    }
);

ModalHeader.displayName = 'Modal.Header';
ModalContent.displayName = 'Modal.Body';
ModalFooter.displayName = 'Modal.Footer';
