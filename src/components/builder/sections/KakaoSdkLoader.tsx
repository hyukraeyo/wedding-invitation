'use client';

import { useEffect, useRef } from 'react';
import { useKakaoLoader } from 'react-kakao-maps-sdk';

interface KakaoSdkLoaderProps {
  onReady?: () => void;
  onError?: () => void;
}

export default function KakaoSdkLoader({ onReady, onError }: KakaoSdkLoaderProps) {
  const hasNotifiedRef = useRef(false);
  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_APP_KEY || '',
    libraries: ['services', 'clusterer'],
  });

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
