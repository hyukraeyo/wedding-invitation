'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import { Map as KakaoMap, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';
import { NavermapsProvider, Container as NaverMapDiv, NaverMap, Marker as NaverMarker } from 'react-naver-maps';
import { Copy, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SectionContainer from '../SectionContainer';
import SectionHeader from '../SectionHeader';
import { NaverIcon, KakaoIcon } from '../../common/MapIcons';
import { clsx } from 'clsx';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import styles from './LocationView.module.scss';

interface LocationViewProps {
    id?: string | undefined;
    title: string;
    subtitle: string;
    location: string;
    lat: number;
    lng: number;
    address: string;
    detailAddress?: string | null | undefined;
    accentColor: string;
    mapZoom?: number;
    showMap?: boolean;
    showNavigation?: boolean;
    sketchUrl?: string | null | undefined;
    sketchRatio?: 'fixed' | 'auto';
    lockMap?: boolean;
    mapType?: 'naver' | 'kakao';
    locationContact?: string;
}

/**
 * Presentational Component for the Location section.
 * Integrates Kakao Maps and provides navigation shortcuts.
 */
const KakaoMapContainer = ({ lat, lng, mapZoom, lockMap }: { lat: number; lng: number; mapZoom: number; lockMap: boolean }) => {
    const [loading, error] = useKakaoLoader({
        appkey: process.env.NEXT_PUBLIC_KAKAO_APP_KEY || '',
        libraries: ['services', 'clusterer'],
    });

    const kakaoMapLevel = Math.max(1, Math.min(14, 20 - mapZoom));

    if (loading) return <div className={styles.mapPlaceholder}>지도를 불러오고 있습니다...</div>;
    if (error) return <div className={styles.mapPlaceholder}>지도를 불러올 수 없습니다.</div>;

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
};

const NaverMapContainer = ({ lat, lng, mapZoom, lockMap }: { lat: number; lng: number; mapZoom: number; lockMap: boolean }) => {
    return (
        <NavermapsProvider ncpKeyId={process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID || 'dh0fr7vx5q'}>
            <NaverMapDiv style={{ width: '100%', height: '100%' }}>
                <NaverMap
                    defaultCenter={{ lat, lng }}
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
};

const LocationView = memo(({
    id,
    title,
    subtitle,
    location,
    lat,
    lng,
    address,
    detailAddress,
    accentColor,
    mapZoom = 17,
    showMap = true,
    showNavigation = true,
    sketchUrl = null,
    sketchRatio = 'fixed',
    lockMap = true,
    mapType = 'naver',
    locationContact
}: LocationViewProps) => {
    const { toast } = useToast();

    const handleNavClick = (type: 'kakao' | 'naver') => {
        const query = encodeURIComponent(address);
        const url = type === 'kakao'
            ? `https://map.kakao.com/link/search/${query}`
            : `https://map.naver.com/v5/search/${query}`;
        window.open(url, '_blank');
    };

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(address).then(() => {
            toast({
                description: '주소가 복사되었습니다.',
            });
        });
    };

    return (
        <SectionContainer id={id}>
            <SectionHeader
                title={title}
                subtitle={subtitle}
                accentColor={accentColor}
            />

            <div className={styles.locationInfo}>
                <div className={styles.placeName}>{location}</div>
                <div className={styles.address}>
                    {address}
                    {detailAddress && <div className={styles.detailAddress}>{detailAddress}</div>}
                </div>
                {locationContact && (
                    <a href={`tel:${locationContact.replace(/[^0-9]/g, '')}`} className={styles.contact}>
                        <Phone size={14} />
                        {locationContact}
                    </a>
                )}
            </div>

            {showMap && (
                <div className={styles.mapContainer}>
                    <AspectRatio ratio={16 / 10}>
                        {mapType === 'naver' ? (
                            <NaverMapContainer lat={lat} lng={lng} mapZoom={mapZoom} lockMap={lockMap} />
                        ) : (
                            <KakaoMapContainer lat={lat} lng={lng} mapZoom={mapZoom} lockMap={lockMap} />
                        )}
                    </AspectRatio>
                </div>
            )}

            {showNavigation && (
                <div className={styles.navLinks}>
                    <button onClick={() => handleNavClick('kakao')} className={styles.navButton}>
                        <div className={styles.navIconWrapper}>
                            <KakaoIcon size={24} />
                        </div>
                        <span className={styles.navLabel}>카카오맵</span>
                    </button>
                    <button onClick={() => handleNavClick('naver')} className={styles.navButton}>
                        <div className={styles.navIconWrapper}>
                            <NaverIcon size={24} />
                        </div>
                        <span className={styles.navLabel}>네이버지도</span>
                    </button>
                    <button onClick={handleCopyAddress} className={styles.navButton}>
                        <div className={styles.navIconWrapper}>
                            <Copy size={20} className={styles.copyIcon} />
                        </div>
                        <span className={styles.navLabel}>주소 복사</span>
                    </button>
                </div>
            )}

            {sketchUrl && (
                <div className={clsx(styles.sketchContainer, styles[sketchRatio])}>
                    {sketchRatio === 'fixed' ? (
                        <AspectRatio ratio={4 / 3}>
                            <Image
                                src={sketchUrl}
                                alt="약도"
                                fill
                                className={styles.sketchImage}
                                style={{
                                    objectFit: 'cover'
                                }}
                                unoptimized={sketchUrl?.startsWith('blob:')}
                            />
                        </AspectRatio>
                    ) : (
                        <Image
                            src={sketchUrl}
                            alt="약도"
                            width={800}
                            height={600}
                            className={styles.sketchImage}
                            style={{
                                width: '100%',
                                height: 'auto',
                                objectFit: 'contain'
                            }}
                            unoptimized={sketchUrl?.startsWith('blob:')}
                        />
                    )}
                </div>
            )}
        </SectionContainer>
    );
});

LocationView.displayName = 'LocationView';

export default LocationView;
