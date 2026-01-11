import React from 'react';
import { MapPin, Search } from 'lucide-react';
import DaumPostcodeEmbed from 'react-daum-postcode';

import { clsx } from 'clsx';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { TextField } from '../TextField';
import { SegmentedControl } from '../SegmentedControl';
import { Switch } from '../Switch';
import { Field } from '../Field';
import { Row } from '../Layout';
import { BuilderModal } from '@/components/common/BuilderModal';
import { ImageUploader } from '../ImageUploader';
import { Section, Divider, Card, Stack } from '../Layout';
import styles from './LocationSection.module.scss';

// Simple Icon Components for Map Types
const NaverIcon = ({ size = 24, className }: { size?: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="24" height="24" rx="4" fill="#03C75A" />
        <path d="M16.2 18V6H13.6L7.8 14.5V6H5.2V18H7.8L13.6 9.5V18H16.2Z" fill="white" />
    </svg>
);

const KakaoIcon = ({ size = 24, className, showBackground = true }: { size?: number, className?: string, showBackground?: boolean }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {showBackground && <rect width="24" height="24" rx="4" fill="#FFE812" />}
        <path d="M12 5C8.13401 5 5 7.46231 5 10.5C5 12.3023 6.13605 13.9059 7.91501 14.9077L7.30796 17.587C7.22894 17.9351 7.62594 18.1969 7.92095 17.9899L11.3739 15.5678C11.581 15.5869 11.7891 15.5969 12 15.6C15.866 15.6 19 13.1377 19 10.1C19 7.06231 15.866 5 12 5Z" fill="#3C1E1E" />
    </svg>
);

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
                <Field label="주소">
                    <div
                        onClick={handleAddressSearch}
                        className={styles.addressButton}
                    >
                        <span className={clsx(styles.addressText, !address && styles.placeholder)}>
                            {address || "주소를 검색해주세요"}
                        </span>
                        <Search size={18} className={styles.searchIcon} />
                    </div>
                </Field>

                {/* 예식장명 */}
                <Field label="예식장명">
                    <TextField
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="예식장 이름 입력"
                    />
                </Field>

                {/* 층과 홀 */}
                <Field label="층과 홀">
                    <TextField
                        type="text"
                        value={detailAddress}
                        onChange={(e) => setDetailAddress(e.target.value)}
                        placeholder="층과 웨딩홀 이름 입력"
                    />
                </Field>

                {/* 연락처 */}
                <Field label="연락처">
                    <TextField
                        type="text"
                        value={locationContact}
                        onChange={handleContactChange}
                        placeholder="예식장 연락처, 02-000-0000"
                        maxLength={13}
                    />
                </Field>

                <Divider />

                {/* 지도 종류 */}
                <Field label="지도 종류">
                    <SegmentedControl
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
                </Field>

                {/* 지도 설정 */}
                <Field label="지도 설정">
                    <Row wrap>
                        <Switch checked={showMap} onChange={setShowMap} label="지도 표시" />
                        <Switch checked={lockMap} onChange={setLockMap} label="지도 잠금" />
                        <Switch checked={showNavigation} onChange={setShowNavigation} label="내비게이션" />
                    </Row>
                </Field>

                {/* 지도 높이 */}
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

                {/* 줌 레벨 */}
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

                {/* 약도 이미지 */}
                <Field label="약도 이미지">
                    <Stack gap="md">
                        <ImageUploader
                            value={sketchUrl}
                            onChange={setSketchUrl}
                            placeholder="약도 이미지 추가"
                            ratio={sketchRatio}
                            onRatioChange={(val) => setSketchRatio(val)}
                            aspectRatio="4/3"
                        />
                    </Stack>
                </Field>
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
