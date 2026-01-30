'use client';

import * as React from 'react';
import { Button, ButtonProps } from '../Button';

export interface CTAButtonProps extends ButtonProps { }

const CTAButton = React.forwardRef<HTMLButtonElement, CTAButtonProps>(
    (props, ref) => {
        return (
            <Button
                size="4"
                fullWidth
                color="primary"
                variant="fill"
                {...props}
                ref={ref}
            />
        );
    }
);

CTAButton.displayName = 'CTAButton';

export { CTAButton };
