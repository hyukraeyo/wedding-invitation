"use client";

import * as React from 'react';

import { clsx } from 'clsx';

import { ViewTransitionLink } from '@/components/common/ViewTransitionLink';
import { Button } from '@/components/ui/Button';
import styles from './EmptyState.module.scss';

interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    description: string | React.ReactNode;
    action?: {
        label: string;
        onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
        href?: string;
        icon?: React.ReactNode;
    };
    variant?: 'default' | 'banana';
    className?: string;
}

export function EmptyState({
    icon,
    title,
    description,
    action,
    variant = 'default',
    className
}: EmptyStateProps) {
    const renderAction = () => {
        if (!action) return null;

        if (action.href) {
            return (
                <ViewTransitionLink
                    href={action.href}
                    className={styles.actionButton}
                    onClick={action.onClick as React.MouseEventHandler<HTMLAnchorElement>}
                >
                    {action.icon}
                    {action.label}
                </ViewTransitionLink>
            );
        }

        return (
            <Button
                type="button"
                variant="weak"
                className={styles.actionButton}
                onClick={action.onClick as React.MouseEventHandler<HTMLButtonElement>}
                style={{ width: 'auto' }}
            >
                {action.icon}
                {action.label}
            </Button>
        );
    };

    return (
        <div className={clsx(styles.emptyState, className)}>
            <div className={clsx(styles.iconWrapper, variant === 'banana' && styles.banana)}>
                {icon}
            </div>
            <h3 className={styles.title}>{title}</h3>
            <div className={styles.description}>
                {description}
            </div>
            {renderAction()}
        </div>
    );
}

EmptyState.displayName = 'EmptyState';
