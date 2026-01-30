'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import { Button } from '../Button';
import s from './BottomCTA.module.scss';

export interface FixedBottomCTAProps {
    children: React.ReactNode;
    fixed?: boolean | undefined;
    className?: string | undefined;
    transparent?: boolean | undefined;
}

export const FixedBottomCTA = ({ children, fixed = true, className, transparent }: FixedBottomCTAProps) => {
    return (
        <div className={clsx(s.fixedBottom, !!fixed && s.fixed, !!transparent && s.transparent, className)}>
            {children}
        </div>
    );
};

export interface BottomCTASingleProps {
    children: React.ReactNode;
    onClick?: ((e: React.MouseEvent<HTMLButtonElement>) => void) | undefined;
    fixed?: boolean | undefined;
    loading?: boolean | undefined;
    disabled?: boolean | undefined;
    className?: string | undefined;
    type?: 'button' | 'submit' | 'reset' | undefined;
    transparent?: boolean | undefined;
}

const Single = ({ children, onClick, fixed = true, loading, disabled, className, type = 'button', transparent }: BottomCTASingleProps) => {
    const button = (
        <Button
            size="4"
            fullWidth
            color="primary"
            variant="fill"
            onClick={onClick}
            loading={!!loading}
            disabled={!!disabled}
            className={className}
            type={type}
        >
            {children}
        </Button>
    );

    if (fixed) {
        return <FixedBottomCTA transparent={!!transparent}>{button}</FixedBottomCTA>;
    }

    return button;
};

export interface BottomCTADoubleProps {
    leftChildren: React.ReactNode;
    rightChildren: React.ReactNode;
    onLeftClick?: (() => void) | undefined;
    onRightClick?: (() => void) | undefined;
    fixed?: boolean | undefined;
    leftLoading?: boolean | undefined;
    rightLoading?: boolean | undefined;
    leftDisabled?: boolean | undefined;
    rightDisabled?: boolean | undefined;
    className?: string | undefined;
    transparent?: boolean | undefined;
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
    className,
    transparent
}: BottomCTADoubleProps) => {
    const content = (
        <div className={s.buttonGroup}>
            <Button
                size="4"
                fullWidth
                color="grey"
                variant="soft"
                onClick={onLeftClick}
                loading={!!leftLoading}
                disabled={!!leftDisabled}
            >
                {leftChildren}
            </Button>
            <Button
                size="4"
                fullWidth
                color="primary"
                variant="fill"
                onClick={onRightClick}
                loading={!!rightLoading}
                disabled={!!rightDisabled}
            >
                {rightChildren}
            </Button>
        </div>
    );

    if (fixed) {
        return <FixedBottomCTA className={className} transparent={!!transparent}>{content}</FixedBottomCTA>;
    }

    return <div className={clsx(s.buttonGroup, className)}>{content}</div>;
};

export const BottomCTA = {
    Single,
    Double,
};
