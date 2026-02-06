import React from 'react';
import { Check } from 'lucide-react';
import s from './ColorPicker.module.scss';
import { cn } from '@/lib/utils';

export interface ColorOption {
  value: string;
  label: string;
}

export const DEFAULT_COLORS: ColorOption[] = [
  { value: '#C69C6D', label: 'Beige' },
  { value: '#4B4B4B', label: 'Dark' },
  { value: '#FFB7B2', label: 'Pink' },
  { value: '#D4A5D4', label: 'Purple' },
];

export interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  colors?: ColorOption[];
  className?: string;
}

export const ColorPicker = ({
  value,
  onChange,
  colors = DEFAULT_COLORS,
  className,
}: ColorPickerProps) => {
  return (
    <div className={cn(s.container, className)}>
      {colors.map((color) => (
        <div
          key={color.value}
          className={s.swatch}
          style={{ backgroundColor: color.value }}
          onClick={() => onChange(color.value)}
          role="button"
          aria-label={`${color.label} 색상 선택`}
        >
          {value === color.value && <Check size={20} />}
        </div>
      ))}
    </div>
  );
};
