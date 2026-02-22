'use client';

import React from 'react';
import {
  NavermapsProvider,
  Container as NaverMapDiv,
  NaverMap,
  Marker as NaverMarker,
} from 'react-naver-maps';

interface NaverMapContainerProps {
  lat: number;
  lng: number;
  mapZoom: number;
  lockMap: boolean;
}

export default function NaverMapContainer({ lat, lng, mapZoom, lockMap }: NaverMapContainerProps) {
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
