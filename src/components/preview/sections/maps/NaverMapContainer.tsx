'use client';

import * as React from 'react';
import {
  NavermapsProvider,
  Container as NaverMapDiv,
  NaverMap,
  Marker as NaverMarker,
} from 'react-naver-maps';
import { useTossEnvironment } from '@/hooks/useTossEnvironment';
import KakaoMapContainer from './KakaoMapContainer';

interface NaverMapContainerProps {
  lat: number;
  lng: number;
  mapZoom: number;
  lockMap: boolean;
}

export default function NaverMapContainer({ lat, lng, mapZoom, lockMap }: NaverMapContainerProps) {
  const isToss = useTossEnvironment();
  const [hasAuthFailure, setHasAuthFailure] = React.useState(false);

  React.useLayoutEffect(() => {
    const previousAuthFailureHandler = window.navermap_authFailure;

    window.navermap_authFailure = () => {
      setHasAuthFailure(true);
      previousAuthFailureHandler?.();
    };

    return () => {
      if (previousAuthFailureHandler) {
        window.navermap_authFailure = previousAuthFailureHandler;
        return;
      }

      delete window.navermap_authFailure;
    };
  }, []);

  if (isToss && hasAuthFailure) {
    return <KakaoMapContainer lat={lat} lng={lng} mapZoom={mapZoom} lockMap={lockMap} />;
  }

  return (
    <NavermapsProvider ncpKeyId={process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID || 'dh0fr7vx5q'}>
      <NaverMapDiv style={{ width: '100%', height: '100%' }}>
        <NaverMap
          center={{ lat, lng }}
          zoom={mapZoom}
          draggable={!lockMap}
          scrollWheel={!lockMap}
          pinchZoom={!lockMap}
          keyboardShortcuts={!lockMap}
          disableDoubleTapZoom={lockMap}
          disableDoubleClickZoom={lockMap}
          disableTwoFingerTapZoom={lockMap}
        >
          <NaverMarker position={{ lat, lng }} />
        </NaverMap>
      </NaverMapDiv>
    </NavermapsProvider>
  );
}
