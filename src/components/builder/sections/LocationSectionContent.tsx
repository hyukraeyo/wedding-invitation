'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useShallow } from 'zustand/react/shallow';
import { AddressPicker } from '@/components/common/AddressPicker';
import { KakaoIcon, NaverIcon } from '@/components/common/Icons';
import { BottomCTA } from '@/components/common/BottomCTA';
import { FormControl, FormField, FormHeader, FormLabel, FormMessage } from '@/components/ui/Form';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { SwitchRow } from '@/components/common/SwitchRow';
import { TextField } from '@/components/ui/TextField';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import { isRequiredField } from '@/constants/requiredFields';
import { formatPhoneNumber } from '@/lib/utils';
import { useInvitationStore } from '@/store/useInvitationStore';
import styles from './LocationSection.module.scss';

const KakaoSdkLoader = dynamic(() => import('./KakaoSdkLoader'), { ssr: false });

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

  const [isKakaoReady, setIsKakaoReady] = useState(false);
  const coordinateLat = coordinates?.lat ?? 0;
  const coordinateLng = coordinates?.lng ?? 0;

  React.useEffect(() => {
    if (!isKakaoReady) return;
    if (!address || typeof window === 'undefined' || !window.kakao?.maps?.services) return;

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(address, (result, status) => {
      if (status !== window.kakao.maps.services.Status.OK || result.length === 0) return;
      const firstResult = result[0];
      if (!firstResult) return;

      const lat = parseFloat(firstResult.y);
      const lng = parseFloat(firstResult.x);
      if (Math.abs(coordinateLat - lat) > 0.0001 || Math.abs(coordinateLng - lng) > 0.0001) {
        setCoordinates(lat, lng);
      }
    });
  }, [address, coordinateLat, coordinateLng, isKakaoReady, setCoordinates]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationContact(formatPhoneNumber(e.target.value));
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocationSubtitle(e.target.value)}
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
                placeholder="예: 오시는 길"
                value={locationTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocationTitle(e.target.value)}
              />
            </FormControl>
          </FormField>
        </div>

        <div className={styles.optionItem}>
          <FormField name="location-address">
            <FormHeader>
              <FormLabel htmlFor="location-address">주소</FormLabel>
              <FormMessage match="valueMissing">필수 항목이에요.</FormMessage>
            </FormHeader>
            <AddressPicker
              id="location-address"
              placeholder="주소를 검색해 주세요"
              value={address}
              onChange={setAddress}
            />
            <FormControl asChild>
              <VisuallyHidden asChild>
                <input
                  id="location-address-required"
                  aria-label="예식 주소"
                  required={isRequiredField('locationAddress')}
                  readOnly
                  value={address || ''}
                />
              </VisuallyHidden>
            </FormControl>
          </FormField>
        </div>

        <div className={styles.optionItem}>
          <FormField name="location-venue">
            <FormHeader>
              <FormLabel htmlFor="location-venue">예식 장소명</FormLabel>
              <FormMessage match="valueMissing">필수 항목이에요.</FormMessage>
            </FormHeader>
            <FormControl asChild>
              <TextField
                id="location-venue"
                type="text"
                placeholder="예: 바나나웨딩홀"
                required={isRequiredField('locationVenue')}
                value={location}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
              />
            </FormControl>
          </FormField>
        </div>

        <div className={styles.optionItem}>
          <FormField name="location-floor">
            <FormLabel htmlFor="location-floor">층/홀 정보</FormLabel>
            <FormControl asChild>
              <TextField
                id="location-floor"
                type="text"
                placeholder="예: 3층 그랜드홀"
                value={detailAddress}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDetailAddress(e.target.value)}
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
            onChange={(value: string) => setMapType(value as 'naver' | 'kakao')}
          >
            <SegmentedControl.Item value="naver">
              <span className={styles.itemContent} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <NaverIcon size={18} />
                <span>네이버</span>
              </span>
            </SegmentedControl.Item>
            <SegmentedControl.Item value="kakao">
              <span className={styles.itemContent} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <KakaoIcon size={18} />
                <span>카카오</span>
              </span>
            </SegmentedControl.Item>
          </SegmentedControl>
        </div>

        <div className={styles.optionItem}>
          <SwitchRow label="지도 표시" checked={showMap} onCheckedChange={setShowMap} />
        </div>

        <div className={styles.optionItem}>
          <SwitchRow label="지도 고정" checked={lockMap} onCheckedChange={setLockMap} />
        </div>

        <div className={styles.optionItem}>
          <SwitchRow label="내비게이션 표시" checked={showNavigation} onCheckedChange={setShowNavigation} />
        </div>

        <div className={styles.optionItem}>
          <div className={styles.rowTitle}>지도 높이</div>
          <SegmentedControl
            alignment="fluid"
            value={mapHeight}
            onChange={(value: string) => setMapHeight(value as 'default' | 'expanded')}
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
            onChange={(value: string) => setMapZoom(Number(value))}
          >
            <SegmentedControl.Item value="15">15</SegmentedControl.Item>
            <SegmentedControl.Item value="16">16</SegmentedControl.Item>
            <SegmentedControl.Item value="17">17</SegmentedControl.Item>
            <SegmentedControl.Item value="18">18</SegmentedControl.Item>
            <SegmentedControl.Item value="19">19</SegmentedControl.Item>
          </SegmentedControl>
        </div>

        <div style={{ marginTop: '12px' }}>
          <BottomCTA.Single fixed={false} onClick={onComplete}>
            확인
          </BottomCTA.Single>
        </div>
      </div>
    </>
  );
}
