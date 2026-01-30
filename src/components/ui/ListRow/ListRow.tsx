'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import s from './ListRow.module.scss';

export interface ListRowProps extends React.HTMLAttributes<HTMLDivElement> {
    contents?: React.ReactNode;
    left?: React.ReactNode;
    right?: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

const ListRow = React.forwardRef<HTMLDivElement, ListRowProps>(
    ({ contents, left, right, onClick, className, children, ...props }, ref) => {
        const Comp = onClick ? 'button' : 'div';

        return (
            <Comp
                ref={ref as any}
                className={clsx(s.listRow, onClick && s.isClickable, className)}
                onClick={onClick}
                type={onClick ? 'button' : undefined}
                {...(props as any)}
            >
                {left && <div className={s.left}>{left}</div>}
                <div className={s.contents}>{contents || children}</div>
                {right && <div className={s.right}>{right}</div>}
            </Comp>
        );
    }
);

ListRow.displayName = 'ListRow';

export { ListRow };
