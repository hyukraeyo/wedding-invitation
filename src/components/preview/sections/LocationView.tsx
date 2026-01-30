'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Copy, Phone, Banana } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SectionContainer from '../SectionContainer';
import SectionHeader from '../SectionHeader';
import { NaverIcon, KakaoIcon } from '../../common/Icons';
import { clsx } from 'clsx';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import styles from './LocationView.module.scss';
import { IMAGE_SIZES } from '@/constants/image';
import { isBlobUrl } from '@/lib/image';

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
    animateEntrance?: boolean;
    mapHeight?: 'default' | 'expanded';
}

const MapLoading = () => (
    <div className={styles.mapLoading}>
        <Skeleton className={styles.mapLoadingSkeleton ?? ''} />
        <div className={styles.loadingOverlay}>
            <Banana className={styles.spinner} />
        </div>
    </div>
);

const KakaoMapContainer = dynamic(() => import('./maps/KakaoMapContainer'), {
    ssr: false,
    loading: MapLoading,
});

const NaverMapContainer = dynamic(() => import('./maps/NaverMapContainer'), {
    ssr: false,
    loading: MapLoading,
});

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
    locationContact,
    animateEntrance,
    mapHeight = 'default'
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
        <SectionContainer id={id} animateEntrance={animateEntrance}>
            <SectionHeader
                title={title}
                subtitle={subtitle}
                accentColor={accentColor}
            />

            <div className={styles.locationInfo}>
                <div className={styles.placeName}>{location}</div>
                <div className={styles.address}>
                    {address}
                    {detailAddress ? <div className={styles.detailAddress}>{detailAddress}</div> : null}
                </div>
                {locationContact ? (
                    <a href={`tel:${locationContact.replace(/[^0-9]/g, '')}`} className={styles.contact}>
                        <Phone size={14} />
                        {locationContact}
                    </a>
                ) : null}
            </div>

            {showMap ? (
                <div className={clsx(styles.mapContainer, mapHeight === 'expanded' && styles.expanded)}>
                    <div style={{ position: 'relative', width: '100%', aspectRatio: mapHeight === 'expanded' ? 1.25 : 16 / 10 }}>
                        {mapType === 'naver' ? (
                            <NaverMapContainer
                                key={`naver-${lat}-${lng}`}
                                lat={lat}
                                lng={lng}
                                mapZoom={mapZoom}
                                lockMap={lockMap}
                            />
                        ) : (
                            <KakaoMapContainer
                                key={`kakao-${lat}-${lng}`}
                                lat={lat}
                                lng={lng}
                                mapZoom={mapZoom}
                                lockMap={lockMap}
                            />
                        )}
                    </div>
                </div>
            ) : null}

            {showNavigation ? (
                <div className={styles.navLinks}>
                    <Button
                        variant="weak"
                        onClick={() => handleNavClick('kakao')}
                        className={styles.navButton}
                        style={{ display: 'flex', flexDirection: 'column', height: 'auto', padding: '12px 0', flex: 1, gap: '8px' }}
                    >
                        <div className={styles.navIconWrapper}>
                            <KakaoIcon size={24} />
                        </div>
                        <span className={styles.navLabel}>카카오맵</span>
                    </Button>
                    <Button
                        variant="weak"
                        onClick={() => handleNavClick('naver')}
                        className={styles.navButton}
                        style={{ display: 'flex', flexDirection: 'column', height: 'auto', padding: '12px 0', flex: 1, gap: '8px' }}
                    >
                        <div className={styles.navIconWrapper}>
                            <NaverIcon size={24} />
                        </div>
                        <span className={styles.navLabel}>네이버지도</span>
                    </Button>
                    <Button
                        variant="weak"
                        onClick={handleCopyAddress}
                        className={styles.navButton}
                        style={{ display: 'flex', flexDirection: 'column', height: 'auto', padding: '12px 0', flex: 1, gap: '8px' }}
                    >
                        <div className={styles.navIconWrapper}>
                            <Copy size={20} className={styles.copyIcon} />
                        </div>
                        <span className={styles.navLabel}>주소 복사</span>
                    </Button>
                </div>
            ) : null}

            {sketchUrl ? (
                <div className={clsx(styles.sketchContainer, styles[sketchRatio])}>
                    {sketchRatio === 'fixed' ? (
                        <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3' }}>
                            <Image
                                src={sketchUrl}
                                alt="약도"
                                fill
                                sizes={IMAGE_SIZES.section}
                                className={styles.sketchImage}
                                style={{
                                    objectFit: 'cover'
                                }}
                                unoptimized={isBlobUrl(sketchUrl)}
                            />
                        </div>
                    ) : (
                        <Image
                            src={sketchUrl}
                            alt="약도"
                            width={800}
                            height={600}
                            sizes={IMAGE_SIZES.section}
                            className={styles.sketchImage}
                            style={{
                                width: '100%',
                                height: 'auto',
                                objectFit: 'contain'
                            }}
                            unoptimized={isBlobUrl(sketchUrl)}
                        />
                    )}
                </div>
            ) : null}
        </SectionContainer>
    );
});

LocationView.displayName = 'LocationView';

export default LocationView;
