'use client';

import * as React from 'react';

interface SpacingProps {
    size: number;
    direction?: 'vertical' | 'horizontal';
}

export const Spacing = ({ size, direction = 'vertical' }: SpacingProps) => {
    return (
        <div
            style={{
                width: direction === 'horizontal' ? `${size}px` : undefined,
                height: direction === 'vertical' ? `${size}px` : undefined,
                flexShrink: 0
            }}
        />
    );
};

Spacing.displayName = 'Spacing';
