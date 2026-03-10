'use client';

import * as React from 'react';
import { Map as KakaoMap, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';
import { Banana } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { KAKAO_LOADER_OPTIONS } from '@/lib/kakaoLoader';
import styles from './KakaoMapContainer.module.scss';

interface KakaoMapContainerProps {
  lat: number;
  lng: number;
  mapZoom: number;
  lockMap: boolean;
  onAuthError?: () => void;
}

export default function KakaoMapContainer({
  lat,
  lng,
  mapZoom,
  lockMap,
  onAuthError,
}: KakaoMapContainerProps) {
  const [loading, error] = useKakaoLoader(KAKAO_LOADER_OPTIONS);
  const hasNotifiedRef = React.useRef(false);

  const kakaoMapLevel = Math.max(1, Math.min(14, 20 - mapZoom));

  React.useEffect(() => {
    if (!error || hasNotifiedRef.current) {
      return;
    }

    hasNotifiedRef.current = true;
    onAuthError?.();
  }, [error, onAuthError]);

  if (loading) {
    return (
      <div className={styles.container}>
        <Skeleton className={styles.skeleton ?? ''} />
        <div className={styles.loadingOverlay}>
          <Banana className={styles.spinnerIcon} />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className={styles.errorState}>카카오 지도를 불러올 수 없어요. (인증 오류)</div>;
  }

  return (
    <KakaoMap
      center={{ lat, lng }}
      style={{ width: '100%', height: '100%' }}
      level={kakaoMapLevel}
      draggable={!lockMap}
      zoomable={!lockMap}
    >
      <MapMarker position={{ lat, lng }} />
    </KakaoMap>
  );
}
