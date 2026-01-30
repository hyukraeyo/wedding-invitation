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

interface ModalProps extends React.ComponentProps<typeof TDSModal> {
    onOpenChange?: (open: boolean) => void;
}

const ModalContext = React.createContext<{ onClose?: () => void }>({});

const ModalOverlay = ({ onClick, ...props }: any) => {
    const { onClose } = React.useContext(ModalContext);

    return (
        <TDSModal.Overlay
            {...props}
            onClick={(e) => {
                e.stopPropagation();
                onClose?.(); // 딤드 클릭 시 명시적으로 닫기 호출
                onClick?.(e);
            }}
        />
    );
};

const ModalContentWrapper = ({ children, ...props }: any) => {
    return (
        <TDSModal.Content
            {...props}
            onClick={(e) => {
                e.stopPropagation();
                props.onClick?.(e);
            }}
        >
            {children}
        </TDSModal.Content>
    );
};

const ModalMain = ({ children, open, onOpenChange, onClose, ...props }: ModalProps) => {
    const handleClose = React.useCallback(() => {
        onClose?.();
        onOpenChange?.(false);
    }, [onClose, onOpenChange]);

    return (
        <ModalContext.Provider value={{ onClose: handleClose }}>
            <TDSModal
                {...props}
                open={open}
                onClose={handleClose}
            >
                {children}
            </TDSModal>
        </ModalContext.Provider>
    );
};

ModalMain.displayName = 'Modal';

export const Modal = Object.assign(
    ModalMain,
    {
        Overlay: ModalOverlay,
        Content: ModalContentWrapper,
        Header: ModalHeader,
        Body: ModalContent,
        Footer: ModalFooter,
    }
);

ModalHeader.displayName = 'Modal.Header';
ModalContent.displayName = 'Modal.Body';
ModalFooter.displayName = 'Modal.Footer';
ModalOverlay.displayName = 'Modal.Overlay';
ModalContentWrapper.displayName = 'Modal.Content';
