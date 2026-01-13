"use client";

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Search } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { useKakaoLoader } from 'react-kakao-maps-sdk';
import { AccordionItem } from '../AccordionItem';
import { TextField } from '../TextField';
import { SegmentedControl } from '../SegmentedControl';
import { SwitchField } from '../SwitchField';
import { Field } from '../FormPrimitives';
import { Modal } from '@/components/ui/Modal';
import styles from './LocationSection.module.scss';

const DaumPostcodeEmbed = dynamic(() => import('react-daum-postcode'), { ssr: false });
import { cn } from '@/lib/utils';

import { NaverIcon, KakaoIcon } from '@/components/common/Icons';

interface SectionProps {
    value: string;
    isOpen: boolean;
}

const LocationSection = React.memo<SectionProps>(function LocationSection({ value, isOpen }) {
    const location = useInvitationStore(state => state.location);
    const setLocation = useInvitationStore(state => state.setLocation);
    const locationTitle = useInvitationStore(state => state.locationTitle);
    const setLocationTitle = useInvitationStore(state => state.setLocationTitle);
    const locationSubtitle = useInvitationStore(state => state.locationSubtitle);
    const setLocationSubtitle = useInvitationStore(state => state.setLocationSubtitle);
    const address = useInvitationStore(state => state.address);
    const setAddress = useInvitationStore(state => state.setAddress);
    const detailAddress = useInvitationStore(state => state.detailAddress);
    const setDetailAddress = useInvitationStore(state => state.setDetailAddress);
    const locationContact = useInvitationStore(state => state.locationContact);
    const setLocationContact = useInvitationStore(state => state.setLocationContact);
    const showMap = useInvitationStore(state => state.showMap);
    const setShowMap = useInvitationStore(state => state.setShowMap);
    const lockMap = useInvitationStore(state => state.lockMap);
    const setLockMap = useInvitationStore(state => state.setLockMap);
    const showNavigation = useInvitationStore(state => state.showNavigation);
    const setShowNavigation = useInvitationStore(state => state.setShowNavigation);
    const mapHeight = useInvitationStore(state => state.mapHeight);
    const setMapHeight = useInvitationStore(state => state.setMapHeight);
    const mapZoom = useInvitationStore(state => state.mapZoom);
    const setMapZoom = useInvitationStore(state => state.setMapZoom);
    const mapType = useInvitationStore(state => state.mapType);
    const setMapType = useInvitationStore(state => state.setMapType);
    const coordinates = useInvitationStore(state => state.coordinates);
    const setCoordinates = useInvitationStore(state => state.setCoordinates);

    // Load Kakao Maps SDK for Geocoding services
    useKakaoLoader({
        appkey: process.env.NEXT_PUBLIC_KAKAO_APP_KEY || '',
        libraries: ['services', 'clusterer'],
    });

    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Geocoding Fallback: If address exists but coordinates are default or missing, try to geocode
    React.useEffect(() => {
        if (address && typeof window !== 'undefined' && window.kakao?.maps?.services) {
            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.addressSearch(address, (result, status) => {
                if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
                    const firstResult = result[0];
                    if (!firstResult) return;

                    const lat = parseFloat(firstResult.y);
                    const lng = parseFloat(firstResult.x);
                    // Only update if different to avoid infinite loop
                    if (Math.abs((coordinates?.lat || 0) - lat) > 0.0001 || Math.abs((coordinates?.lng || 0) - lng) > 0.0001) {
                        setCoordinates(lat, lng);
                    }
                }
            });
        }
    }, [address, setCoordinates, coordinates]);

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

    const formatPhoneNumber = (value: string) => {
        const clean = value.replace(/[^0-9]/g, '');
        if (!clean) return '';

        if (clean.startsWith('02')) {
            if (clean.length <= 2) return clean;
            if (clean.length <= 5) return clean.replace(/(\d{2})(\d+)/, '$1-$2');
            if (clean.length <= 9) return clean.replace(/(\d{2})(\d{3})(\d+)/, '$1-$2-$3');
            return clean.replace(/(\d{2})(\d{4})(\d+)/, '$1-$2-$3').substring(0, 12);
        }

        if (clean.startsWith('1')) {
            if (clean.length <= 4) return clean;
            return clean.replace(/(\d{4})(\d+)/, '$1-$2').substring(0, 9);
        }

        if (clean.length <= 3) return clean;
        if (clean.length <= 6) return clean.replace(/(\d{3})(\d+)/, '$1-$2');
        if (clean.length <= 10) return clean.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3');
        return clean.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3').substring(0, 13);
    };

    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        setLocationContact(formatted);
    };

    return (
        <AccordionItem
            value={value}
            title="예식 장소"
            icon={MapPin}
            isOpen={isOpen}
            isCompleted={!!address}
        >
            <div className={styles.container}>
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
                        className={cn(
                            "builder-input-unified justify-between cursor-pointer hover:border-gray-400",
                            !address && "text-muted-foreground"
                        )}
                    >
                        <span className={cn(
                            "truncate",
                            address ? "text-foreground font-medium" : "text-muted-foreground"
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

                <TextField
                    label="연락처"
                    type="text"
                    placeholder="예: 02-000-0000"
                    value={locationContact}
                    onChange={handleContactChange}
                    maxLength={13}
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


            </div>

            <Modal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                title="주소 검색"
            >
                <div className={styles.postcodeWrapper}>
                    {isSearchOpen && (
                        <DaumPostcodeEmbed
                            onComplete={handleComplete}
                            style={{ height: '100%' }}
                            autoClose={false}
                        />
                    )}
                </div>
            </Modal>
        </AccordionItem>
    );
});

export default LocationSection;
