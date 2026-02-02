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
    fixedAboveKeyboard?: boolean | undefined;
}

export const FixedBottomCTA = ({ children, fixed = true, className, transparent, animated, fixedAboveKeyboard }: FixedBottomCTAProps) => {
    return (
        <div
            className={clsx(
                s.fixedBottom,
                !!fixed && s.fixed,
                !!transparent && s.transparent,
                !!animated && s.animated,
                !!fixedAboveKeyboard && s.fixedAboveKeyboard,
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
    buttonVariant?: 'solid' | 'soft' | 'outline' | 'ghost' | 'surface' | 'filled' | 'fill' | 'weak' | 'clear' | 'apple' | 'toss' | undefined;
    fixedAboveKeyboard?: boolean | undefined;
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
    animated,
    buttonVariant = 'fill',
    fixedAboveKeyboard = true
}: BottomCTASingleProps) => {
    const button = (
        <Button
            size="lg"
            fullWidth
            color="primary"
            variant={buttonVariant}
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
            fixedAboveKeyboard={fixedAboveKeyboard}
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
    leftButtonVariant?: 'solid' | 'soft' | 'outline' | 'ghost' | 'surface' | 'filled' | 'fill' | 'weak' | 'clear' | 'apple' | 'toss' | undefined;
    rightButtonVariant?: 'solid' | 'soft' | 'outline' | 'ghost' | 'surface' | 'filled' | 'fill' | 'weak' | 'clear' | 'apple' | 'toss' | undefined;
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
    animated,
    leftButtonVariant = 'soft',
    rightButtonVariant = 'fill'
}: BottomCTADoubleProps) => {
    const content = (
        <div className={s.buttonGroup}>
            <Button
                size="lg"
                fullWidth
                color="grey"
                variant={leftButtonVariant}
                onClick={onLeftClick}
                loading={!!leftLoading}
                disabled={!!leftDisabled}
            >
                {leftChildren}
            </Button>
            <Button
                size="lg"
                fullWidth
                color="primary"
                variant={rightButtonVariant}
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
