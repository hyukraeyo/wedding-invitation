'use client';

import React from 'react';
import { Map as KakaoMap, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';
import { Banana } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';

interface KakaoMapContainerProps {
    lat: number;
    lng: number;
    mapZoom: number;
    lockMap: boolean;
}

export default function KakaoMapContainer({ lat, lng, mapZoom, lockMap }: KakaoMapContainerProps) {
    const [loading, error] = useKakaoLoader({
        appkey: process.env.NEXT_PUBLIC_KAKAO_APP_KEY || '',
        libraries: ['services', 'clusterer'],
    });

    const kakaoMapLevel = Math.max(1, Math.min(14, 20 - mapZoom));

    if (loading) {
        return (
            <div className="relative w-full h-full">
                <Skeleton className="absolute inset-0 z-10" />
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
                    <Banana className="h-10 w-10 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative w-full h-full bg-muted/5 flex items-center justify-center text-sm text-muted-foreground">
                카카오 지도를 불러올 수 없습니다. (인증 오류)
            </div>
        );
    }

    return (
        <KakaoMap
            center={{ lat, lng }}
            style={{ width: "100%", height: "100%" }}
            level={kakaoMapLevel}
            draggable={!lockMap}
            zoomable={!lockMap}
        >
            <MapMarker position={{ lat, lng }} />
        </KakaoMap>
    );
}
