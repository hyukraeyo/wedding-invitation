'use client';

import * as React from 'react';
import { Switch } from '@/components/ui/Switch';
import { cn } from '@/lib/utils';
import styles from './SwitchRow.module.scss';

interface SwitchRowProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Switch>, 'checked' | 'onCheckedChange'> {
  label: React.ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
  labelClassName?: string;
}

export default function SwitchRow({
  label,
  checked,
  onCheckedChange,
  className,
  labelClassName,
  id,
  ...props
}: SwitchRowProps) {
  const generatedId = React.useId();
  const switchId = id ?? generatedId;

  return (
    <div className={cn(styles.row, className)}>
      <label htmlFor={switchId} className={cn(styles.label, labelClassName)}>
        {label}
      </label>
      <Switch id={switchId} checked={checked} onCheckedChange={onCheckedChange} {...props} />
    </div>
  );
}
