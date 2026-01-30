'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import { Button } from '../Button';
import s from './BottomCTA.module.scss';

export interface FixedBottomCTAProps {
    children: React.ReactNode;
    fixed?: boolean;
    className?: string;
}

export const FixedBottomCTA = ({ children, fixed = true, className }: FixedBottomCTAProps) => {
    return (
        <div className={clsx(s.fixedBottom, fixed && s.fixed, className)}>
            {children}
        </div>
    );
};

export interface BottomCTASingleProps {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    fixed?: boolean;
    loading?: boolean;
    disabled?: boolean;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

const Single = ({ children, onClick, fixed = true, loading, disabled, className, type = 'button' }: BottomCTASingleProps) => {
    const button = (
        <Button
            size="4"
            fullWidth
            color="primary"
            variant="fill"
            onClick={onClick}
            loading={loading as any}
            disabled={disabled as any}
            className={className}
            type={type}
        >
            {children}
        </Button>
    );

    if (fixed) {
        return <FixedBottomCTA>{button}</FixedBottomCTA>;
    }

    return button;
};

export interface BottomCTADoubleProps {
    leftChildren: React.ReactNode;
    rightChildren: React.ReactNode;
    onLeftClick?: () => void;
    onRightClick?: () => void;
    fixed?: boolean;
    leftLoading?: boolean;
    rightLoading?: boolean;
    leftDisabled?: boolean;
    rightDisabled?: boolean;
    className?: string;
}

const Double = ({
    leftChildren,
    rightChildren,
    onLeftClick,
    onRightClick,
    fixed = true,
    leftLoading,
    rightLoading,
    leftDisabled,
    rightDisabled,
    className
}: BottomCTADoubleProps) => {
    const content = (
        <div className={s.buttonGroup}>
            <Button
                size="4"
                fullWidth
                color="grey"
                variant="soft"
                onClick={onLeftClick}
                loading={leftLoading as any}
                disabled={leftDisabled as any}
            >
                {leftChildren}
            </Button>
            <Button
                size="4"
                fullWidth
                color="primary"
                variant="fill"
                onClick={onRightClick}
                loading={rightLoading as any}
                disabled={rightDisabled as any}
            >
                {rightChildren}
            </Button>
        </div>
    );

    if (fixed) {
        return <FixedBottomCTA className={className as any}>{content}</FixedBottomCTA>;
    }

    return <div className={clsx(s.buttonGroup, className)}>{content}</div>;
};

export const BottomCTA = {
    Single,
    Double,
};
