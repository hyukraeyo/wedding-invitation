"use client";

import React, { useState, useCallback } from 'react';
import { MapPin, Search } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { TextField } from '../TextField';
import { SegmentedControl } from '../SegmentedControl';
import { SwitchField } from '../SwitchField';
import { Field } from '../Field';
import { Modal } from '@/components/common/Modal';
import { ImageUploader } from '../ImageUploader';
import DaumPostcodeEmbed from 'react-daum-postcode';
import styles from './LocationSection.module.scss';
import { cn } from '@/lib/utils';

import { NaverIcon, KakaoIcon } from '@/components/common/MapIcons';

interface SectionProps {
    value: string;
    isOpen: boolean;
    onToggle: () => void;
}

const LocationSection = React.memo<SectionProps>(function LocationSection({ value, isOpen, onToggle }) {
    const {
        location, setLocation,
        locationTitle, setLocationTitle,
        locationSubtitle, setLocationSubtitle,
        address, setAddress,
        detailAddress, setDetailAddress,
        locationContact, setLocationContact,
        showMap, setShowMap,
        lockMap, setLockMap,
        showNavigation, setShowNavigation,
        mapHeight, setMapHeight,
        mapZoom, setMapZoom,
        mapType, setMapType,
        sketchUrl, setSketchUrl,
        sketchRatio, setSketchRatio
    } = useInvitationStore();

    const [isSearchOpen, setIsSearchOpen] = useState(false);

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
            onToggle={onToggle}
            isCompleted={!!address}
        >
            <div className={styles.container}>
                <TextField
                    label="소제목"
                    placeholder="예: LOCATION"
                    value={locationSubtitle}
                    onChange={(e) => setLocationSubtitle(e.target.value)}
                    containerClassName="mb-4"
                />
                <TextField
                    label="제목"
                    placeholder="예: 오시는 길"
                    value={locationTitle}
                    onChange={(e) => setLocationTitle(e.target.value)}
                    containerClassName="mb-4"
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

                <Field label="약도 이미지">
                    <div className={styles.sketchWrapper}>
                        <ImageUploader
                            value={sketchUrl}
                            onChange={setSketchUrl}
                            placeholder="약도 이미지 추가"
                            ratio={sketchRatio}
                            onRatioChange={(val) => setSketchRatio(val)}
                            aspectRatio="4/3"
                        />
                    </div>
                </Field>
            </div>

            <Modal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                title="주소 검색"
            >
                <div className={styles.postcodeWrapper}>
                    <DaumPostcodeEmbed
                        onComplete={handleComplete}
                        style={{ height: '100%' }}
                        autoClose={false}
                    />
                </div>
            </Modal>
        </AccordionItem>
    );
});

export default LocationSection;
