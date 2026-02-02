'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import styles from './OptionList.module.scss';

export interface OptionItem<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

interface OptionListProps<T = string> {
  options: OptionItem<T>[];
  value?: T;
  onSelect: (value: T) => void;
  className?: string;
}

export function OptionList<T = string>({
  options,
  value,
  onSelect,
  className,
}: OptionListProps<T>) {
  return (
    <div className={cn(styles.list, className)}>
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <Button
            key={String(option.value)}
            variant="ghost" // Using ghost as base, but styling overrides for custom list look
            className={cn(styles.item, isSelected && styles.selected)}
            onClick={() => !option.disabled && onSelect(option.value)}
            disabled={option.disabled}
            radius="large"
            fullWidth
            rightIcon={isSelected ? <Check size={20} className={styles.checkIcon} /> : undefined}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}
