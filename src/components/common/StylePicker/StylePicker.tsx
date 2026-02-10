'use client';

import * as React from 'react';
import type { Swiper as SwiperInstance } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';
import { Sparkles } from 'lucide-react';
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
  { id: 'classic6', label: '클래식 6', type: 'classic6' },
  { id: 'classic7', label: '클래식 7', type: 'classic7' },
  { id: 'classic8', label: '클래식 8', type: 'classic8' },
  { id: 'placeholder1', label: '추가 예정', type: 'placeholder', isComingSoon: true },
];

export const StylePicker = ({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
  className,
}: StylePickerProps) => {
  const [edgeFade, setEdgeFade] = React.useState({ left: false, right: false });
  const edgeFadeRef = React.useRef(edgeFade);

  const updateEdgeFade = React.useCallback((swiper: SwiperInstance) => {
    const hasOverflow = Math.abs(swiper.maxTranslate() - swiper.minTranslate()) > 1;
    const nextFade = hasOverflow
      ? { left: !swiper.isBeginning, right: !swiper.isEnd }
      : { left: false, right: false };

    const prevFade = edgeFadeRef.current;
    if (prevFade.left === nextFade.left && prevFade.right === nextFade.right) {
      return;
    }

    edgeFadeRef.current = nextFade;
    setEdgeFade(nextFade);
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
    <div
      className={cn(
        s.root,
        edgeFade.left && s.showLeftFade,
        edgeFade.right && s.showRightFade,
        className
      )}
    >
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
        watchOverflow
        touchRatio={1}
        threshold={4}
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
                  <Sparkles size={24} strokeWidth={1.5} />
                ) : (
                  <div className={cn(s.mockupContainer, s[`mockup${option.type}`])}>
                    {option.type === 'classic1' && (
                      <>
                        <div className={s.topGroup}>
                          <div className={s.badge} />
                          <div className={s.names} />
                        </div>
                        <div className={s.imageBox} />
                        <div className={s.titleBottom} />
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
