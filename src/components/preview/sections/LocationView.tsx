'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import { Map as KakaoMap, MapMarker } from 'react-kakao-maps-sdk';
import SectionContainer from '../SectionContainer';
import styles from './LocationView.module.css';

interface LocationViewProps {
    id?: string | undefined;
    location: string;
    lat: number;
    lng: number;
    address: string;
    detailAddress?: string;
    accentColor: string;
}

/**
 * Presentational Component for the Location section.
 * Integrates Kakao Maps and provides navigation shortcuts.
 */
const LocationView = memo(({
    id,
    location,
    lat,
    lng,
    address,
    detailAddress,
    accentColor
}: LocationViewProps) => {

    const handleNavClick = (type: 'kakao' | 'naver' | 'tmap') => {
        const url = type === 'kakao'
            ? `https://map.kakao.com/link/to/${location},${lat},${lng}`
            : type === 'naver'
                ? `https://map.naver.com/v5/directions/-/,,${lat},${lng},${location},,,ADDRESS_POI`
                : `https://apis.openapi.sk.com/tmap/app/routes?appKey=yourkey&name=${location}&lon=${lng}&lat=${lat}`;
        window.open(url, '_blank');
    };

    return (
        <SectionContainer id={id}>
            <div className={styles.header}>
                <span className={styles.subtitle} style={{ color: accentColor }}>LOCATION</span>
                <h2 className={styles.title}>오시는 길</h2>
                <div className={styles.decorationLine} style={{ backgroundColor: accentColor }} />
            </div>

            <div className={styles.locationInfo}>
                <div className={styles.placeName}>{location}</div>
                <div className={styles.address}>
                    {address}
                    {detailAddress && <div className="mt-0.5">{detailAddress}</div>}
                </div>
            </div>

            <div className={styles.mapContainer}>
                <KakaoMap
                    center={{ lat, lng }}
                    style={{ width: "100%", height: "100%" }}
                    level={3}
                >
                    <MapMarker position={{ lat, lng }} />
                </KakaoMap>
            </div>

            <div className={styles.navLinks}>
                <button onClick={() => handleNavClick('kakao')} className={styles.navButton}>
                    <Image src="/images/kakaomap_logo.png" alt="카카오맵" width={24} height={24} className={styles.navIcon} />
                    <span className={styles.navLabel}>카카오맵</span>
                </button>
                <button onClick={() => handleNavClick('naver')} className={styles.navButton}>
                    <Image src="/images/navermap_logo.png" alt="네이버지도" width={24} height={24} className={styles.navIcon} />
                    <span className={styles.navLabel}>네이버지도</span>
                </button>
                <button onClick={() => handleNavClick('tmap')} className={styles.navButton}>
                    <Image src="/images/tmap_logo.png" alt="티맵" width={24} height={24} className={styles.navIcon} />
                    <span className={styles.navLabel}>티맵</span>
                </button>
            </div>
        </SectionContainer>
    );
});

LocationView.displayName = 'LocationView';

export default LocationView;
