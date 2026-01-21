'use client';

import React from 'react';
import { Map as KakaoMap, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';
import { Banana } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import styles from './KakaoMapContainer.module.scss';

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
            <div className={styles.container}>
                <Skeleton className={styles.skeleton} />
                <div className={styles.loadingOverlay}>
                    <Banana className={styles.spinnerIcon} />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorState}>
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
