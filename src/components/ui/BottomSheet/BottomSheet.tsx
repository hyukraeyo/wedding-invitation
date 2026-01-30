'use client';

import React from 'react';
import { BottomSheet as TDSBottomSheet, BottomSheetProps as TDSBottomSheetProps } from '@toss/tds-mobile';
import styles from './BottomSheet.module.scss';

interface BottomSheetBodyProps {
    children: React.ReactNode;
    className?: string | undefined;
}

const BottomSheetBody = ({ children, className }: BottomSheetBodyProps) => (
    <div className={`${styles.body} ${className || ''}`}>
        {children}
    </div>
);

const BottomSheetMain = (props: TDSBottomSheetProps) => {
    return <TDSBottomSheet {...props} />;
};

BottomSheetMain.displayName = 'BottomSheet';

export const BottomSheet = Object.assign(
    BottomSheetMain,
    {
        Body: BottomSheetBody,
    }
);

BottomSheetBody.displayName = 'BottomSheet.Body';
