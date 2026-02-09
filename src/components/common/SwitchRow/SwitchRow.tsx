'use client';

import * as React from 'react';
import { Switch } from '@/components/ui/Switch';
import { FormLabel } from '@/components/ui/Form';
import { clsx } from 'clsx';
import styles from './SwitchRow.module.scss';

interface SwitchRowProps extends Omit<
  React.ComponentPropsWithoutRef<typeof Switch>,
  'checked' | 'onCheckedChange'
> {
  label: React.ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

const SwitchRow = React.forwardRef<React.ElementRef<typeof Switch>, SwitchRowProps>(
  ({ label, checked, onCheckedChange, className, id, ...props }, ref) => {
    const generatedId = React.useId();
    const switchId = id ?? generatedId;

    return (
      <div className={clsx(styles.container, className)}>
        <FormLabel htmlFor={switchId}>{label}</FormLabel>
        <Switch
          id={switchId}
          ref={ref}
          checked={checked}
          onCheckedChange={onCheckedChange}
          {...props}
        />
      </div>
    );
  }
);
SwitchRow.displayName = 'SwitchRow';

export { SwitchRow };
export default SwitchRow;
