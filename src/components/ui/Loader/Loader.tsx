'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { Banana } from 'lucide-react';
import { clsx } from 'clsx';
import s from './Loader.module.scss';

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: 'sm' | 'md' | 'lg' | 'xl' | undefined;
}

const LoaderBase = React.forwardRef<HTMLDivElement, LoaderProps>(
    ({ className, size = 'md', ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={clsx(s.loader, s[`size_${size}`], className)}
                {...props}
            >
                <div className={s.spinner} />
            </div>
        );
    }
);

LoaderBase.displayName = 'Loader';

export interface BananaLoaderProps {
    variant?: 'fixed' | 'full' | undefined;
    className?: string | undefined;
}

const BananaLoader = ({ variant = 'fixed', className }: BananaLoaderProps) => {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const content = (
        <div className={clsx(s.bananaLoader, s[variant], className)}>
            <div className={s.iconWrapper}>
                <Banana className={s.bananaIcon} />
            </div>
            <div className={clsx(s.decoration, s.dec1)} />
            <div className={clsx(s.decoration, s.dec2)} />
        </div>
    );

    if (variant === 'fixed') {
        if (!mounted) return null;
        return createPortal(content, document.body);
    }

    return content;
};

BananaLoader.displayName = 'Loader.Banana';

const Loader = Object.assign(LoaderBase, {
    Banana: BananaLoader,
});

export { Loader, BananaLoader };
