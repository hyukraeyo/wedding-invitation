import { useRef, useMemo, useEffect, useCallback } from 'react';
import type { Swiper as SwiperClass } from 'swiper';

interface WheelOption {
  value: string;
}

interface UseWheelSwiperProps<T extends WheelOption> {
  options: T[];
  value: string;
  onChange: (value: string) => void;
}

export function useWheelSwiper<T extends WheelOption>({
  options,
  value,
  onChange,
}: UseWheelSwiperProps<T>) {
  const swiperRef = useRef<SwiperClass | null>(null);
  const isInternalUpdateRef = useRef(false);

  // 초기 인덱스 계산
  const initialIndex = useMemo(() => {
    const index = options.findIndex((opt) => opt.value === value);
    return index !== -1 ? index : 0;
  }, [options, value]);

  // 외부 값 변경 시 Swiper 동기화
  useEffect(() => {
    if (swiperRef.current && !isInternalUpdateRef.current) {
      const index = options.findIndex((opt) => opt.value === value);
      if (index !== -1 && index !== swiperRef.current.activeIndex) {
        swiperRef.current.slideTo(index);
      }
    }
    // 프레임 이후 또는 동기화 후 플래그 초기화
    isInternalUpdateRef.current = false;
  }, [value, options]);

  // Swiper 인스턴스 저장
  const onSwiper = useCallback((swiper: SwiperClass) => {
    swiperRef.current = swiper;
  }, []);

  // 슬라이드 변경 시 핸들러
  const onSlideChange = useCallback(
    (swiper: SwiperClass) => {
      const index = swiper.activeIndex;
      if (options[index] && options[index].value !== value) {
        isInternalUpdateRef.current = true;
        onChange(options[index].value);
      }
    },
    [options, value, onChange]
  );

  return {
    initialIndex,
    onSwiper,
    onSlideChange,
    swiperRef, // 필요한 경우 직접 접근을 위해 노출
  };
}
