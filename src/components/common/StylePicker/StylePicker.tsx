import React from 'react';
import { Plus } from 'lucide-react';
import s from './StylePicker.module.scss';
import { cn } from '@/lib/utils';

export interface StylePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const styles = [
  { id: 'classic1', label: '클래식 1', type: 'classic1' },
  { id: 'classic2', label: '클래식 2', type: 'classic2' },
  { id: 'classic3', label: '클래식 3', type: 'classic3' },
];

export const StylePicker = ({ value, onChange, className }: StylePickerProps) => {
  return (
    <div className={cn(s.styleGrid, className)}>
      {styles.map((style) => (
        <div key={style.id} className={s.styleItem} onClick={() => onChange(style.id)}>
          <div className={cn(s.styleCard, value === style.id && s.selected)}>
            {/* Abstract UI Mockups */}
            {style.type === 'classic1' && (
              <div className={cn(s.mockupContainer, s.mockupClassic1)}>
                <div className={cn(s.box, s.boxPrimary, s.titleBox)} />
                <div className={cn(s.box, s.nameBox)} />
                <div className={s.separatorBox} />
                <div className={cn(s.box, s.dateBox)} />
              </div>
            )}

            {style.type === 'classic2' && (
              <div className={cn(s.mockupContainer, s.mockupClassic2)}>
                <div className={s.heroBox} />
                <div className={cn(s.box, s.lineBox)} />
                <div className={cn(s.box, s.shortBox)} />
              </div>
            )}

            {style.type === 'classic3' && (
              <div className={cn(s.mockupContainer, s.mockupClassic3)}>
                <div className={s.topGroup}>
                  <div className={s.logoBox} />
                  <div className={s.textBox} />
                </div>
                <div className={s.bottomGroup}>
                  <div className={s.textBox} style={{ width: '80%' }} />
                  <div className={s.textBox} style={{ width: '50%' }} />
                </div>
              </div>
            )}
          </div>
          <span className={s.styleName}>{style.label}</span>
        </div>
      ))}

      {/* Placeholders */}
      <div className={cn(s.styleItem, s.placeholder)}>
        <div className={s.styleCard}>
          <Plus size={24} />
        </div>
        <span className={s.styleName}>추가 예정</span>
      </div>

      <div className={cn(s.styleItem, s.placeholder)}>
        <div className={s.styleCard}>
          <Plus size={24} />
        </div>
        <span className={s.styleName}>추가 예정</span>
      </div>
    </div>
  );
};
