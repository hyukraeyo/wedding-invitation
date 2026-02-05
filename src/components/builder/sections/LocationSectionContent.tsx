'use client';

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Search } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { TextField } from '@/components/ui/TextField';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Switch } from '@/components/ui/Switch';
import { FormControl, FormField, FormLabel } from '@/components/ui/Form';
import { formatPhoneNumber } from '@/lib/utils';
import styles from './LocationSection.module.scss';
import { cn } from '@/lib/utils';
import { NaverIcon, KakaoIcon } from '@/components/common/Icons';
import { useShallow } from 'zustand/react/shallow';
import { BottomCTA } from '@/components/ui/BottomCTA';

const DaumPostcodeEmbed = dynamic(() => import('react-daum-postcode'), { ssr: false });
const KakaoSdkLoader = dynamic(() => import('./KakaoSdkLoader'), { ssr: false });
import { Dialog } from '@/components/ui/Dialog';

interface LocationSectionContentProps {
  onComplete?: () => void;
}

export default function LocationSectionContent({ onComplete }: LocationSectionContentProps) {
  const {
    location,
    setLocation,
    locationTitle,
    setLocationTitle,
    locationSubtitle,
    setLocationSubtitle,
    address,
    setAddress,
    detailAddress,
    setDetailAddress,
    locationContact,
    setLocationContact,
    showMap,
    setShowMap,
    lockMap,
    setLockMap,
    showNavigation,
    setShowNavigation,
    mapHeight,
    setMapHeight,
    mapZoom,
    setMapZoom,
    mapType,
    setMapType,
    coordinates,
    setCoordinates,
  } = useInvitationStore(
    useShallow((state) => ({
      location: state.location,
      setLocation: state.setLocation,
      locationTitle: state.locationTitle,
      setLocationTitle: state.setLocationTitle,
      locationSubtitle: state.locationSubtitle,
      setLocationSubtitle: state.setLocationSubtitle,
      address: state.address,
      setAddress: state.setAddress,
      detailAddress: state.detailAddress,
      setDetailAddress: state.setDetailAddress,
      locationContact: state.locationContact,
      setLocationContact: state.setLocationContact,
      showMap: state.showMap,
      setShowMap: state.setShowMap,
      lockMap: state.lockMap,
      setLockMap: state.setLockMap,
      showNavigation: state.showNavigation,
      setShowNavigation: state.setShowNavigation,
      mapHeight: state.mapHeight,
      setMapHeight: state.setMapHeight,
      mapZoom: state.mapZoom,
      setMapZoom: state.setMapZoom,
      mapType: state.mapType,
      setMapType: state.setMapType,
      coordinates: state.coordinates,
      setCoordinates: state.setCoordinates,
    }))
  );

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isKakaoReady, setIsKakaoReady] = useState(false);
  const coordinateLat = coordinates?.lat ?? 0;
  const coordinateLng = coordinates?.lng ?? 0;

  React.useEffect(() => {
    if (!isKakaoReady) return;
    if (address && typeof window !== 'undefined' && window.kakao?.maps?.services) {
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
          const firstResult = result[0];
          if (!firstResult) return;

          const lat = parseFloat(firstResult.y);
          const lng = parseFloat(firstResult.x);
          if (Math.abs(coordinateLat - lat) > 0.0001 || Math.abs(coordinateLng - lng) > 0.0001) {
            setCoordinates(lat, lng);
          }
        }
      });
    }
  }, [address, coordinateLat, coordinateLng, isKakaoReady, setCoordinates]);

  const handleAddressSearch = useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  const handleComplete = (data: {
    address: string;
    addressType: 'R' | 'J';
    bname: string;
    buildingName: string;
  }) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    setAddress(fullAddress);
    setIsSearchOpen(false);
  };

  // 전화번호 입력 핸들러
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setLocationContact(formatted);
  };

  return (
    <>
      <KakaoSdkLoader onReady={() => setIsKakaoReady(true)} />
      <div className={styles.container}>
        <div className={styles.optionItem}>
          <FormField name="location-subtitle">
            <FormLabel htmlFor="location-subtitle">부제목</FormLabel>
            <FormControl asChild>
              <TextField
                id="location-subtitle"
                placeholder="예: LOCATION"
                value={locationSubtitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setLocationSubtitle(e.target.value)
                }
              />
            </FormControl>
          </FormField>
        </div>
        <div className={styles.optionItem}>
          <FormField name="location-title">
            <FormLabel htmlFor="location-title">제목</FormLabel>
            <FormControl asChild>
              <TextField
                id="location-title"
                placeholder="예: 바나나홀"
                value={locationTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setLocationTitle(e.target.value)
                }
              />
            </FormControl>
          </FormField>
        </div>

        <div className={styles.optionItem}>
          <div className={styles.rowTitle}>주소</div>
          <div onClick={handleAddressSearch} className={styles.addressButton}>
            <span
              className={cn(
                styles.addressText,
                address ? styles.addressTextFilled : styles.addressTextPlaceholder
              )}
            >
              {address || '주소를 검색해 주세요'}
            </span>
            <Search size={18} className={styles.searchIcon} />
          </div>
        </div>

        <div className={styles.optionItem}>
          <FormField name="location-venue">
            <FormLabel htmlFor="location-venue">예식 장소명</FormLabel>
            <FormControl asChild>
              <TextField
                id="location-venue"
                type="text"
                placeholder="예: 바나나 웨딩홀"
                value={location}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
              />
            </FormControl>
          </FormField>
        </div>

        <div className={styles.optionItem}>
          <FormField name="location-floor">
            <FormLabel htmlFor="location-floor">층/호수</FormLabel>
            <FormControl asChild>
              <TextField
                id="location-floor"
                type="text"
                placeholder="예: 3층 그랜드홀"
                value={detailAddress}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDetailAddress(e.target.value)
                }
              />
            </FormControl>
          </FormField>
        </div>

        <div className={styles.optionItem}>
          <div className={styles.rowTitle}>연락처</div>
          <TextField
            type="tel"
            inputMode="numeric"
            placeholder="예: 02-000-0000"
            value={locationContact}
            onChange={handlePhoneChange}
          />
        </div>

        <div className={styles.optionItem}>
          <div className={styles.rowTitle}>지도 종류</div>
          <SegmentedControl
            alignment="fluid"
            value={mapType}
            onChange={(val: string) => setMapType(val as 'naver' | 'kakao')}
          >
            <SegmentedControl.Item value="naver">
              <span
                className={styles.itemContent}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <NaverIcon size={18} />
                <span>네이버</span>
              </span>
            </SegmentedControl.Item>
            <SegmentedControl.Item value="kakao">
              <span
                className={styles.itemContent}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <KakaoIcon size={18} />
                <span>카카오</span>
              </span>
            </SegmentedControl.Item>
          </SegmentedControl>
        </div>

        <div className={styles.optionItem}>
          <div className={styles.rowTitle}>지도 표시</div>
          <div className={styles.rowRight}>
            <Switch checked={showMap} onCheckedChange={(checked) => setShowMap(checked)} />
          </div>
        </div>

        <div className={styles.optionItem}>
          <div className={styles.rowTitle}>지도 고정</div>
          <div className={styles.rowRight}>
            <Switch checked={lockMap} onCheckedChange={(checked) => setLockMap(checked)} />
          </div>
        </div>

        <div className={styles.optionItem}>
          <div className={styles.rowTitle}>네비게이션 표시</div>
          <div className={styles.rowRight}>
            <Switch
              checked={showNavigation}
              onCheckedChange={(checked) => setShowNavigation(checked)}
            />
          </div>
        </div>

        <div className={styles.optionItem}>
          <div className={styles.rowTitle}>지도 높이</div>
          <SegmentedControl
            alignment="fluid"
            value={mapHeight}
            onChange={(val: string) => setMapHeight(val as 'default' | 'expanded')}
          >
            <SegmentedControl.Item value="default">기본</SegmentedControl.Item>
            <SegmentedControl.Item value="expanded">확장</SegmentedControl.Item>
          </SegmentedControl>
        </div>

        <div className={styles.optionItem}>
          <div className={styles.rowTitle}>줌 레벨</div>
          <SegmentedControl
            alignment="fluid"
            value={String(mapZoom)}
            onChange={(val: string) => setMapZoom(Number(val))}
          >
            <SegmentedControl.Item value="15">15</SegmentedControl.Item>
            <SegmentedControl.Item value="16">16</SegmentedControl.Item>
            <SegmentedControl.Item value="17">17</SegmentedControl.Item>
            <SegmentedControl.Item value="18">18</SegmentedControl.Item>
            <SegmentedControl.Item value="19">19</SegmentedControl.Item>
          </SegmentedControl>
        </div>

        <div style={{ marginTop: '12px' }}>
          <BottomCTA.Single fixed={false} onClick={onComplete} variant="primary">
            확인
          </BottomCTA.Single>
        </div>
      </div>

      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Header title="주소 검색" />
          <Dialog.Body className={styles.postcodeBody}>
            <div className={styles.postcodeWrapper}>
              {isSearchOpen && (
                <DaumPostcodeEmbed
                  onComplete={handleComplete}
                  style={{ height: '100%' }}
                  autoClose={true}
                />
              )}
            </div>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog>
    </>
  );
}
