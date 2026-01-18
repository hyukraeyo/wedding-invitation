"use client";

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Search } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { TextField } from '@/components/common/TextField';
import { SegmentedControl } from '@/components/common/SegmentedControl';
import { SwitchField } from '@/components/common/SwitchField';
import { PhoneField } from '@/components/common/PhoneField';
import { Field, SectionContainer } from '@/components/common/FormPrimitives';
import styles from './LocationSection.module.scss';
import { cn } from '@/lib/utils';
import { NaverIcon, KakaoIcon } from '@/components/common/Icons';
import { useShallow } from 'zustand/react/shallow';

const DaumPostcodeEmbed = dynamic(() => import('react-daum-postcode'), { ssr: false });
const KakaoSdkLoader = dynamic(() => import('./KakaoSdkLoader'), { ssr: false });
const ResponsiveModal = dynamic(
    () => import('@/components/common/ResponsiveModal').then(mod => mod.ResponsiveModal),
    { ssr: false }
);

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
    } = useInvitationStore(useShallow((state) => ({
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
    })));

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

    return (
        <>
            <KakaoSdkLoader onReady={() => setIsKakaoReady(true)} />
            <SectionContainer>
                <TextField
                    label="소제목"
                    placeholder="예: LOCATION"
                    value={locationSubtitle}
                    onChange={(e) => setLocationSubtitle(e.target.value)}
                />
                <TextField
                    label="제목"
                    placeholder="예: 오시는 길"
                    value={locationTitle}
                    onChange={(e) => setLocationTitle(e.target.value)}
                />

                <Field label="주소">
                    <div
                        onClick={handleAddressSearch}
                        className={styles.addressButton}
                    >
                        <span className={cn(
                            styles.addressText,
                            address ? styles.addressTextFilled : styles.addressTextPlaceholder
                        )}>
                            {address || "주소를 검색해주세요"}
                        </span>
                        <Search size={18} className={styles.searchIcon} />
                    </div>
                </Field>

                <TextField
                    label="예식장명"
                    type="text"
                    placeholder="예: 더 컨벤션 신사"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />

                <TextField
                    label="층과 홀"
                    type="text"
                    placeholder="예: 3층 그랜드홀"
                    value={detailAddress}
                    onChange={(e) => setDetailAddress(e.target.value)}
                />

                <PhoneField
                    label="연락처"
                    placeholder="예: 02-000-0000"
                    value={locationContact}
                    onChange={(e) => setLocationContact(e.target.value)}
                />

                <Field label="지도 종류">
                    <SegmentedControl
                        value={mapType}
                        options={[
                            {
                                label: '네이버',
                                value: 'naver',
                                icon: <NaverIcon size={18} className={styles.mapIcon || ''} />
                            },
                            {
                                label: '카카오',
                                value: 'kakao',
                                icon: <KakaoIcon size={18} className={styles.mapIcon || ''} />
                            },
                        ]}
                        onChange={(val: 'naver' | 'kakao') => setMapType(val)}
                    />
                </Field>

                <Field label="지도 설정">
                    <div className={styles.mapOptions}>
                        <SwitchField checked={showMap} onChange={setShowMap} label="지도 표시" />
                        <SwitchField checked={lockMap} onChange={setLockMap} label="지도 잠금" />
                        <SwitchField checked={showNavigation} onChange={setShowNavigation} label="내비게이션" />
                    </div>
                </Field>

                <Field label="지도 높이">
                    <SegmentedControl
                        value={mapHeight}
                        options={[
                            { label: '기본', value: 'default' },
                            { label: '축소', value: 'small' },
                        ]}
                        onChange={(val: 'default' | 'small') => setMapHeight(val)}
                    />
                </Field>

                <Field label="줌 레벨">
                    <SegmentedControl
                        value={mapZoom}
                        options={[
                            { label: '15', value: 15 },
                            { label: '16', value: 16 },
                            { label: '17', value: 17 },
                            { label: '18', value: 18 },
                            { label: '19', value: 19 },
                        ]}
                        onChange={(val: number) => setMapZoom(val)}
                    />
                </Field>
            </SectionContainer>

            <ResponsiveModal
                open={isSearchOpen}
                onOpenChange={setIsSearchOpen}
                title="주소 검색"
                description="도로명 주소 또는 지번 주소를 입력해주세요."
                contentClassName={styles.postcodeModalContent}
            >
                <div className={styles.postcodeWrapper}>
                    {isSearchOpen && (
                        <DaumPostcodeEmbed
                            onComplete={handleComplete}
                            style={{ height: '100%' }}
                            autoClose={true}
                        />
                    )}
                </div>
            </ResponsiveModal>
        </>
    );
}
