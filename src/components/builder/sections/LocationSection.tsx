import React from 'react';
import { MapPin, Search } from 'lucide-react';
import DaumPostcodeEmbed from 'react-daum-postcode';

import { clsx } from 'clsx';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { BuilderInput } from '../BuilderInput';
import { NaverIcon, KakaoIcon } from '../../common/MapIcons';
import { BuilderButtonGroup } from '../BuilderButtonGroup';
import { BuilderToggle } from '../BuilderToggle';
import { BuilderField } from '../BuilderField';
import { BuilderModal } from '../../common/BuilderModal';
import { ImageUploader } from '../ImageUploader';
import { Section, Row, Divider, Card, Stack } from '../BuilderLayout';
import styles from './LocationSection.module.scss';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

const LocationSection = React.memo<SectionProps>(function LocationSection({ isOpen, onToggle }) {
    const {
        location, setLocation,
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

    const [isSearchOpen, setIsSearchOpen] = React.useState(false);

    const handleComplete = (data: { address: string; addressType: string; bname: string; buildingName: string }) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') extraAddress += data.bname;
            if (data.buildingName !== '') extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }

        setAddress(fullAddress);
        setIsSearchOpen(false);
    };

    const handleAddressSearch = () => {
        setIsSearchOpen(true);
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
            title="예식 장소"
            icon={MapPin}
            isOpen={isOpen}
            onToggle={onToggle}
            isCompleted={!!location && !!address}
        >
            <Section>
                {/* 주소 검색 */}
                <BuilderField label="주소">
                    <div
                        onClick={handleAddressSearch}
                        className={styles.addressButton}
                    >
                        <span className={clsx(styles.addressText, !address && styles.placeholder)}>
                            {address || "주소를 검색해주세요"}
                        </span>
                        <Search size={18} className={styles.searchIcon} />
                    </div>
                </BuilderField>

                {/* 예식장명 */}
                <BuilderField label="예식장명">
                    <BuilderInput
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="예식장 이름 입력"
                    />
                </BuilderField>

                {/* 층과 홀 */}
                <BuilderField label="층과 홀">
                    <BuilderInput
                        type="text"
                        value={detailAddress}
                        onChange={(e) => setDetailAddress(e.target.value)}
                        placeholder="층과 웨딩홀 이름 입력"
                    />
                </BuilderField>

                {/* 연락처 */}
                <BuilderField label="연락처">
                    <BuilderInput
                        type="text"
                        value={locationContact}
                        onChange={handleContactChange}
                        placeholder="예식장 연락처, 02-000-0000"
                        maxLength={13}
                    />
                </BuilderField>

                <Divider />

                {/* 지도 종류 */}
                <BuilderField label="지도 종류">
                    <BuilderButtonGroup
                        value={mapType}
                        options={[
                            {
                                label: '네이버',
                                value: 'naver',
                                icon: <NaverIcon size={18} className="shrink-0" />
                            },
                            {
                                label: '카카오',
                                value: 'kakao',
                                icon: <KakaoIcon size={18} showBackground={false} className="shrink-0" />
                            },
                        ]}
                        onChange={(val: 'naver' | 'kakao') => setMapType(val)}
                    />
                </BuilderField>

                {/* 지도 설정 */}
                <BuilderField label="지도 설정">
                    <Row wrap>
                        <BuilderToggle checked={showMap} onChange={setShowMap} label="지도 표시" />
                        <BuilderToggle checked={lockMap} onChange={setLockMap} label="지도 잠금" />
                        <BuilderToggle checked={showNavigation} onChange={setShowNavigation} label="내비게이션" />
                    </Row>
                </BuilderField>

                {/* 지도 높이 */}
                <BuilderField label="지도 높이">
                    <BuilderButtonGroup
                        value={mapHeight}
                        options={[
                            { label: '기본', value: 'default' },
                            { label: '축소', value: 'small' },
                        ]}
                        onChange={(val: 'default' | 'small') => setMapHeight(val)}
                    />
                </BuilderField>

                {/* 줌 레벨 */}
                <BuilderField label="줌 레벨">
                    <BuilderButtonGroup
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
                </BuilderField>

                {/* 약도 이미지 */}
                <BuilderField label="약도 이미지">
                    <Stack gap="md">
                        <ImageUploader
                            value={sketchUrl}
                            onChange={setSketchUrl}
                            placeholder="약도 이미지 추가"
                            ratio={sketchRatio}
                            onRatioChange={(val) => setSketchRatio(val)}
                        />
                    </Stack>
                </BuilderField>
            </Section>

            <BuilderModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                title="주소 검색"
            >
                <Card className={styles.postcodeWrapper ?? ''}>
                    <DaumPostcodeEmbed
                        onComplete={handleComplete}
                        style={{ height: '100%' }}
                        autoClose={false}
                    />
                </Card>
            </BuilderModal>
        </AccordionItem>
    );
});

export default LocationSection;
