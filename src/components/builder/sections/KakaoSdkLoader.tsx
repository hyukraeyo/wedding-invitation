'use client';

import { useEffect, useRef } from 'react';
import { useKakaoLoader } from 'react-kakao-maps-sdk';
import { KAKAO_LOADER_OPTIONS } from '@/lib/kakaoLoader';

interface KakaoSdkLoaderProps {
  onReady?: () => void;
  onError?: () => void;
}

export default function KakaoSdkLoader({ onReady, onError }: KakaoSdkLoaderProps) {
  const hasNotifiedRef = useRef(false);
  const [loading, error] = useKakaoLoader(KAKAO_LOADER_OPTIONS);

  useEffect(() => {
    if (hasNotifiedRef.current) return;
    if (error) {
      hasNotifiedRef.current = true;
      onError?.();
      return;
    }
    if (!loading) {
      hasNotifiedRef.current = true;
      onReady?.();
    }
  }, [error, loading, onError, onReady]);

  return null;
}
