'use client';

import * as React from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { clsx } from 'clsx';
import { Copy, Phone } from 'lucide-react';
import { AspectRatio } from '@/components/ui/AspectRatio';
import { Button } from '@/components/ui/Button';
import { SectionLoader } from '@/components/ui/SectionLoader';
import { useToast } from '@/hooks/use-toast';
import { useTossEnvironment } from '@/hooks/useTossEnvironment';
import { IMAGE_SIZES } from '@/constants/image';
import { isBlobUrl } from '@/lib/image';
import { loadTossWebFramework } from '@/lib/toss';
import { NaverIcon, KakaoIcon } from '../../common/Icons';
import SectionContainer from '../SectionContainer';
import SectionHeader from '../SectionHeader';
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
  animateEntrance?: boolean;
  mapHeight?: 'default' | 'expanded';
}

const KakaoMapContainer = dynamic(() => import('./maps/KakaoMapContainer'), {
  ssr: false,
  loading: () => <SectionLoader height={320} message="지도를 불러오고 있어요" />,
});

const NaverMapContainer = dynamic(() => import('./maps/NaverMapContainer'), {
  ssr: false,
  loading: () => <SectionLoader height={320} message="지도를 불러오고 있어요" />,
});

type MapProvider = 'naver' | 'kakao';

const MAP_PROVIDER_FALLBACK: Record<MapProvider, MapProvider> = {
  naver: 'kakao',
  kakao: 'naver',
};

const LocationView = React.memo(
  ({
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
    mapHeight = 'default',
  }: LocationViewProps) => {
    const { toast } = useToast();
    const isToss = useTossEnvironment();
    const [activeMapProvider, setActiveMapProvider] = React.useState<MapProvider>(mapType);
    const [failedMapProviders, setFailedMapProviders] = React.useState<MapProvider[]>([]);

    React.useEffect(() => {
      setActiveMapProvider(mapType);
      setFailedMapProviders([]);
    }, [lat, lng, mapType]);

    React.useEffect(() => {
      if (!failedMapProviders.includes(activeMapProvider)) {
        return;
      }

      const fallbackProvider = MAP_PROVIDER_FALLBACK[activeMapProvider];
      if (failedMapProviders.includes(fallbackProvider)) {
        return;
      }

      setActiveMapProvider(fallbackProvider);
    }, [activeMapProvider, failedMapProviders]);

    const handleMapAuthError = React.useCallback((provider: MapProvider) => {
      setFailedMapProviders((previousProviders) => {
        if (previousProviders.includes(provider)) {
          return previousProviders;
        }

        return [...previousProviders, provider];
      });
    }, []);

    const isMapUnavailable = failedMapProviders.length === 2;

    const handleNavClick = async (type: 'kakao' | 'naver') => {
      const query = encodeURIComponent(address);
      const url =
        type === 'kakao'
          ? `https://map.kakao.com/link/search/${query}`
          : `https://map.naver.com/v5/search/${query}`;

      if (isToss) {
        try {
          const { openURL } = await loadTossWebFramework();
          await openURL(url);
          return;
        } catch (error) {
          console.error('[LOCATION_NAV_OPEN_ERROR]', error);
        }
      }

      window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleCopyAddress = () => {
      navigator.clipboard.writeText(address).then(() => {
        toast({
          description: '주소가 복사되었어요.',
        });
      });
    };

    return (
      <SectionContainer id={id} animateEntrance={animateEntrance}>
        <SectionHeader title={title} subtitle={subtitle} accentColor={accentColor} />

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
            <AspectRatio ratio={mapHeight === 'expanded' ? 1.25 : 16 / 10}>
              {isMapUnavailable ? (
                <div className={styles.mapPlaceholder}>
                  지도를 불러오지 못했어요. 아래 버튼으로 지도를 열어 주세요.
                </div>
              ) : activeMapProvider === 'naver' ? (
                <NaverMapContainer
                  key={`naver-${lat}-${lng}`}
                  lat={lat}
                  lng={lng}
                  mapZoom={mapZoom}
                  lockMap={lockMap}
                  onAuthError={() => handleMapAuthError('naver')}
                />
              ) : (
                <KakaoMapContainer
                  key={`kakao-${lat}-${lng}`}
                  lat={lat}
                  lng={lng}
                  mapZoom={mapZoom}
                  lockMap={lockMap}
                  onAuthError={() => handleMapAuthError('kakao')}
                />
              )}
            </AspectRatio>
          </div>
        ) : null}

        {showNavigation ? (
          <div className={styles.navLinks}>
            <Button
              variant="ghost"
              onClick={() => void handleNavClick('kakao')}
              className={styles.navButton}
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: 'auto',
                padding: '12px 0',
                flex: 1,
                gap: '8px',
              }}
            >
              <div className={styles.navIconWrapper}>
                <KakaoIcon size={24} />
              </div>
              <span className={styles.navLabel}>카카오맵</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => void handleNavClick('naver')}
              className={styles.navButton}
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: 'auto',
                padding: '12px 0',
                flex: 1,
                gap: '8px',
              }}
            >
              <div className={styles.navIconWrapper}>
                <NaverIcon size={24} />
              </div>
              <span className={styles.navLabel}>네이버지도</span>
            </Button>
            <Button
              variant="ghost"
              onClick={handleCopyAddress}
              className={styles.navButton}
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: 'auto',
                padding: '12px 0',
                flex: 1,
                gap: '8px',
              }}
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
              <AspectRatio ratio={4 / 3}>
                <Image
                  src={sketchUrl}
                  alt="약도"
                  fill
                  sizes={IMAGE_SIZES.section}
                  className={styles.sketchImage}
                  style={{
                    objectFit: 'cover',
                  }}
                  unoptimized={isBlobUrl(sketchUrl)}
                />
              </AspectRatio>
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
                  objectFit: 'contain',
                }}
                unoptimized={isBlobUrl(sketchUrl)}
              />
            )}
          </div>
        ) : null}
      </SectionContainer>
    );
  }
);

LocationView.displayName = 'LocationView';

export default LocationView;
