'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useShallow } from 'zustand/react/shallow';
import { AddressPicker } from '@/components/common/AddressPicker';
import { KakaoIcon, NaverIcon } from '@/components/common/Icons';
import { SectionHeadingFields } from '@/components/common/SectionHeadingFields';

import { FormControl, FormField, FormHeader, FormLabel, FormMessage } from '@/components/ui/Form';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { SwitchRow } from '@/components/common/SwitchRow';
import { TextField } from '@/components/ui/TextField';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import { isRequiredField } from '@/constants/requiredFields';
import { formatPhoneNumber, isBlank } from '@/lib/utils';
import { useInvitationStore } from '@/store/useInvitationStore';
import styles from './LocationSection.module.scss';

const KakaoSdkLoader = dynamic(() => import('./KakaoSdkLoader'), { ssr: false });

export default function LocationSectionContent() {
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
    validationErrors,
    removeValidationError,
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
      validationErrors: state.validationErrors,
      removeValidationError: state.removeValidationError,
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
      <SectionHeadingFields
        prefix="location"
        subtitle={{ value: locationSubtitle, onValueChange: setLocationSubtitle }}
        title={{ value: locationTitle, onValueChange: setLocationTitle }}
      />

      <FormField name="location-address">
        <FormHeader>
          <FormLabel htmlFor="location-address">주소</FormLabel>
          <FormMessage
            forceMatch={validationErrors.includes('location-address') && isBlank(address)}
          >
            필수 항목이에요.
          </FormMessage>
        </FormHeader>
        <AddressPicker
          id="location-address"
          placeholder="주소를 검색해 주세요"
          value={address}
          onChange={(val) => {
            setAddress(val);
            removeValidationError('location-address');
          }}
          error={validationErrors.includes('location-address')}
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

      <FormField name="location-venue">
        <FormHeader>
          <FormLabel htmlFor="location-venue">예식 장소명</FormLabel>
          <FormMessage
            forceMatch={validationErrors.includes('location-venue') && isBlank(location)}
          >
            필수 항목이에요.
          </FormMessage>
        </FormHeader>
        <FormControl asChild>
          <TextField
            id="location-venue"
            type="text"
            placeholder="예: 바나나웨딩홀"
            required={isRequiredField('locationVenue')}
            value={location}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setLocation(e.target.value);
              removeValidationError('location-venue');
            }}
            invalid={validationErrors.includes('location-venue')}
          />
        </FormControl>
      </FormField>

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

      <FormField name="location-contact">
        <FormLabel htmlFor="location-contact">연락처</FormLabel>
        <FormControl asChild>
          <TextField
            id="location-contact"
            type="tel"
            inputMode="numeric"
            placeholder="예: 02-000-0000"
            value={locationContact}
            onChange={handlePhoneChange}
          />
        </FormControl>
      </FormField>

      <FormField name="map-type">
        <FormLabel>지도 종류</FormLabel>
        <SegmentedControl
          alignment="fluid"
          value={mapType}
          onChange={(value: string) => setMapType(value as 'naver' | 'kakao')}
        >
          <SegmentedControl.Item value="naver">
            <span className={styles.itemContent}>
              <NaverIcon size={18} />
              <span>네이버</span>
            </span>
          </SegmentedControl.Item>
          <SegmentedControl.Item value="kakao">
            <span className={styles.itemContent}>
              <KakaoIcon size={18} />
              <span>카카오</span>
            </span>
          </SegmentedControl.Item>
        </SegmentedControl>
      </FormField>

      <FormField name="location-show-map">
        <SwitchRow label="지도 표시" checked={showMap} onCheckedChange={setShowMap} />
      </FormField>

      <FormField name="location-lock-map">
        <SwitchRow label="지도 고정" checked={lockMap} onCheckedChange={setLockMap} />
      </FormField>

      <FormField name="location-show-nav">
        <SwitchRow
          label="내비게이션 표시"
          checked={showNavigation}
          onCheckedChange={setShowNavigation}
        />
      </FormField>

      <FormField name="map-height">
        <FormLabel>지도 높이</FormLabel>
        <SegmentedControl
          alignment="fluid"
          value={mapHeight}
          onChange={(value: string) => setMapHeight(value as 'default' | 'expanded')}
        >
          <SegmentedControl.Item value="default">기본</SegmentedControl.Item>
          <SegmentedControl.Item value="expanded">확장</SegmentedControl.Item>
        </SegmentedControl>
      </FormField>

      <FormField name="map-zoom">
        <FormLabel>줌 레벨</FormLabel>
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
      </FormField>
    </>
  );
}
