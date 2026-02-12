import React from 'react';
import { Check } from 'lucide-react';
import s from './ColorPicker.module.scss';

import { cn } from '@/lib/utils';
import { IconButton } from '@/components/ui/IconButton';

export interface ColorOption {
  value: string;
  label: string;
  textColor?: string;
}

export interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  colors: ColorOption[];
  className?: string;
}

export const ColorPicker = ({ value, onChange, colors, className }: ColorPickerProps) => {
  return (
    <div className={cn(s.container, className)}>
      {colors.map((color) => (
        <IconButton
          key={color.value}
          unstyled
          className={cn(s.swatch, value === color.value && s.active)}
          style={{ backgroundColor: color.value } as React.CSSProperties}
          onClick={() => onChange(color.value)}
          aria-label={`${color.label} 색상 선택`}
          aria-pressed={value === color.value}
        >
          {value === color.value && (
            <Check size={20} className={s.checkIcon} style={{ color: color.textColor }} />
          )}
        </IconButton>
      ))}
    </div>
  );
};

ColorPicker.displayName = 'ColorPicker';
