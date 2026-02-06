'use client';

import * as React from 'react';
import type { Swiper as SwiperInstance } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';
import { Plus } from 'lucide-react';
import s from './StylePicker.module.scss';
import { cn } from '@/lib/utils';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';

export interface StyleOption {
  id: string;
  label: string;
  type: string;
  isComingSoon?: boolean;
}

export interface StylePickerProps {
  value: string;
  onChange: (value: string) => void;
  options?: StyleOption[];
  className?: string;
}

const DEFAULT_OPTIONS: StyleOption[] = [
  { id: 'classic1', label: '클래식 1', type: 'classic1' },
  { id: 'classic2', label: '클래식 2', type: 'classic2' },
  { id: 'classic3', label: '클래식 3', type: 'classic3' },
  { id: 'classic4', label: '클래식 4', type: 'classic4' },
  { id: 'classic5', label: '클래식 5', type: 'classic5' },
  { id: 'placeholder1', label: '추가 예정', type: 'placeholder', isComingSoon: true },
];

export const StylePicker = ({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
  className,
}: StylePickerProps) => {
  const [showLeftFade, setShowLeftFade] = React.useState(false);
  const [showRightFade, setShowRightFade] = React.useState(false);

  const updateEdgeFade = React.useCallback((swiper: SwiperInstance) => {
    const hasOverflow = Math.abs(swiper.maxTranslate() - swiper.minTranslate()) > 1;

    if (!hasOverflow) {
      setShowLeftFade(false);
      setShowRightFade(false);
      return;
    }

    setShowLeftFade(!swiper.isBeginning);
    setShowRightFade(!swiper.isEnd);
  }, []);

  const handleItemClick = React.useCallback(
    (option: StyleOption) => {
      if (!option.isComingSoon) {
        onChange(option.id);
      }
    },
    [onChange]
  );

  return (
    <div className={cn(s.root, showLeftFade && s.showLeftFade, showRightFade && s.showRightFade, className)}>
      <Swiper
        modules={[FreeMode, Mousewheel]}
        slidesPerView="auto"
        spaceBetween={16}
        freeMode
        grabCursor
        mousewheel={{
          enabled: true,
          forceToAxis: true,
          releaseOnEdges: true,
          sensitivity: 0.8,
        }}
        watchOverflow={false}
        touchRatio={1}
        threshold={4}
        observer
        observeParents
        resizeObserver
        onSwiper={updateEdgeFade}
        onResize={updateEdgeFade}
        onProgress={updateEdgeFade}
        onFromEdge={updateEdgeFade}
        onReachBeginning={updateEdgeFade}
        onReachEnd={updateEdgeFade}
        className={s.swiper}
      >
        {options.map((option) => (
          <SwiperSlide key={option.id} className={s.slide}>
            <div
              className={cn(
                s.styleItem,
                option.isComingSoon && s.placeholder,
                value === option.id && s.selected
              )}
              onClick={() => handleItemClick(option)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  handleItemClick(option);
                }
              }}
              role="button"
              tabIndex={option.isComingSoon ? -1 : 0}
              aria-pressed={value === option.id}
              aria-disabled={option.isComingSoon}
            >
              <div className={s.styleCard}>
                {option.isComingSoon ? (
                  <Plus size={24} />
                ) : (
                  <div className={cn(s.mockupContainer, s[`mockup${option.type}`])}>
                    {option.type === 'classic1' && (
                      <>
                        <div className={cn(s.box, s.boxPrimary, s.titleBox)} />
                        <div className={cn(s.box, s.nameBox)} />
                        <div className={s.separatorBox} />
                        <div className={cn(s.box, s.dateBox)} />
                      </>
                    )}
                    {option.type === 'classic2' && (
                      <>
                        <div className={s.heroBox} />
                        <div className={cn(s.box, s.lineBox)} />
                        <div className={cn(s.box, s.shortBox)} />
                      </>
                    )}
                    {option.type === 'classic3' && (
                      <div className={s.classic3Inner}>
                        <div className={s.topGroup}>
                          <div className={s.logoBox} />
                          <div className={s.textBox} />
                        </div>
                        <div className={s.bottomGroup}>
                          <div className={cn(s.textBox, s.textWide)} />
                          <div className={cn(s.textBox, s.textNarrow)} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <span className={s.styleName}>{option.label}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

StylePicker.displayName = 'StylePicker';
