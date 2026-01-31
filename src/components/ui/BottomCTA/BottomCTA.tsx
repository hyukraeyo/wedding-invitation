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
    animated?: boolean | undefined;
}

export const FixedBottomCTA = ({ children, fixed = true, className, transparent, animated }: FixedBottomCTAProps) => {
    return (
        <div
            className={clsx(
                s.fixedBottom,
                !!fixed && s.fixed,
                !!transparent && s.transparent,
                !!animated && s.animated,
                className
            )}
        >
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
    wrapperClassName?: string | undefined;
    type?: 'button' | 'submit' | 'reset' | undefined;
    transparent?: boolean | undefined;
    animated?: boolean | undefined;
}

const Single = ({
    children,
    onClick,
    fixed = true,
    loading,
    disabled,
    className,
    wrapperClassName,
    type = 'button',
    transparent,
    animated
}: BottomCTASingleProps) => {
    const button = (
        <Button
            size="3"
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

    if (!fixed && !transparent) {
        return button;
    }

    return (
        <FixedBottomCTA
            fixed={fixed}
            transparent={!!transparent}
            className={wrapperClassName}
            animated={animated}
        >
            {button}
        </FixedBottomCTA>
    );
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
    wrapperClassName?: string | undefined;
    transparent?: boolean | undefined;
    animated?: boolean | undefined;
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
    wrapperClassName,
    transparent,
    animated
}: BottomCTADoubleProps) => {
    const content = (
        <div className={s.buttonGroup}>
            <Button
                size="3"
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
                size="3"
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

    if (!fixed && !transparent) {
        return <div className={clsx(s.buttonGroup, className)}>{content}</div>;
    }

    return (
        <FixedBottomCTA
            fixed={fixed}
            className={clsx(wrapperClassName, className)}
            transparent={!!transparent}
            animated={animated}
        >
            {content}
        </FixedBottomCTA>
    );
};

export const BottomCTA = {
    Single,
    Double,
};
