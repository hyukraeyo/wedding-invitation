'use client';

import * as React from 'react';
import { Button, ButtonProps } from '../Button';

export type CTAButtonProps = ButtonProps;

const CTAButton = React.forwardRef<HTMLButtonElement, CTAButtonProps>((props, ref) => {
  return <Button size="lg" fullWidth color="primary" variant="fill" {...props} ref={ref} />;
});

CTAButton.displayName = 'CTAButton';

export { CTAButton };
