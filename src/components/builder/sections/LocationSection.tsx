import React from 'react';
import { MapPin, ImagePlus, Trash2, Search } from 'lucide-react';
import DaumPostcodeEmbed from 'react-daum-postcode';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { BuilderInput } from '../BuilderInput';
import Image from 'next/image';
import { NaverIcon, KakaoIcon } from '../../common/MapIcons';
import { BuilderButton } from '../BuilderButton';
import { BuilderButtonGroup } from '../BuilderButtonGroup';
import { BuilderToggle } from '../BuilderToggle';
import { BuilderLabel } from '../BuilderLabel';
import { BuilderField } from '../BuilderField';
import { BuilderModal } from '../../common/BuilderModal';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

const LocationSection = React.memo<SectionProps>(function LocationSection({ isOpen, onToggle }) {
    const {
        location, setLocation, // 예식장명
        address, setAddress,
        detailAddress, setDetailAddress, // 층과 홀 (기존 detailAddress 재활용 but UI 상 "층과 홀")
        locationTitle, setLocationTitle,
        locationContact, setLocationContact,
        showMap, setShowMap,
        lockMap, setLockMap,
        showNavigation, setShowNavigation,
        mapHeight, setMapHeight,
        mapZoom, setMapZoom,
        mapType, setMapType,
        showSketch, setShowSketch,
        sketchUrl, setSketchUrl
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

    const handleSketchUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setSketchUrl(url);
        }
    };

    const formatPhoneNumber = (value: string) => {
        const clean = value.replace(/[^0-9]/g, '');
        if (!clean) return '';

        // 02 (Seoul)
        if (clean.startsWith('02')) {
            if (clean.length <= 2) return clean;
            if (clean.length <= 5) return clean.replace(/(\d{2})(\d+)/, '$1-$2');
            if (clean.length <= 9) return clean.replace(/(\d{2})(\d{3})(\d+)/, '$1-$2-$3');
            return clean.replace(/(\d{2})(\d{4})(\d+)/, '$1-$2-$3').substring(0, 12);
        }

        // 1xxx (Hotline)
        if (clean.startsWith('1')) {
            if (clean.length <= 4) return clean;
            return clean.replace(/(\d{4})(\d+)/, '$1-$2').substring(0, 9);
        }

        // 010/031/070 etc.
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
            <div className="space-y-6 py-2">

                {/* 1. 제목 (Title) */}
                <BuilderField label="제목">
                    <BuilderInput
                        type="text"
                        value={locationTitle}
                        onChange={(e) => setLocationTitle(e.target.value)}
                        placeholder="오시는 길"
                    />
                </BuilderField>

                {/* 2. 주소 (Address) */}
                <BuilderField label="주소">
                    <div className="w-full space-y-2">
                        <div
                            onClick={handleAddressSearch}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[14px] cursor-pointer transition-all hover:border-gray-400 flex items-center justify-between gap-2 group"
                        >
                            <span className={`flex-1 truncate ${!address ? 'text-gray-300' : 'text-gray-900'}`}>
                                {address || "주소를 검색해주세요"}
                            </span>
                            <Search size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors shrink-0" />
                        </div>
                    </div>
                </BuilderField>

                {/* 3. 예식장명 (Wedding Hall Name) */}
                <BuilderField label="예식장명">
                    <BuilderInput
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="예식장 이름 입력"
                    />
                </BuilderField>

                {/* 4. 층과 홀 (Floor & Hall) */}
                <BuilderField label="층과 홀">
                    <BuilderInput
                        type="text"
                        value={detailAddress}
                        onChange={(e) => setDetailAddress(e.target.value)}
                        placeholder="층과 웨딩홀 이름 입력"
                    />
                </BuilderField>

                {/* 5. 연락처 (Contact) */}
                <BuilderField label="연락처">
                    <BuilderInput
                        type="text"
                        value={locationContact}
                        onChange={handleContactChange}
                        placeholder="예식장 연락처, 02-000-0000"
                        maxLength={13}
                    />
                </BuilderField>

                <hr className="border-gray-100 my-6" />

                {/* Map Type */}
                <BuilderField label="지도 종류">
                    <BuilderButtonGroup
                        className="flex-1"
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

                {/* Map Options */}
                <BuilderField label="지도 설정">
                    <div className="flex flex-wrap gap-2 px-1">
                        <BuilderToggle
                            checked={showMap}
                            onChange={setShowMap}
                            label="지도 표시"
                        />
                        <BuilderToggle
                            checked={lockMap}
                            onChange={setLockMap}
                            label="지도 잠금"
                        />
                        <BuilderToggle
                            checked={showNavigation}
                            onChange={setShowNavigation}
                            label="내비게이션"
                        />
                        <BuilderToggle
                            checked={showSketch}
                            onChange={setShowSketch}
                            label="약도 사진"
                        />
                    </div>
                </BuilderField>

                {/* Map Detail Settings */}
                {/* Map Detail Settings */}
                <BuilderField label="지도 높이">
                    <BuilderButtonGroup
                        className="w-full"
                        value={mapHeight}
                        options={[
                            { label: '기본', value: 'default' },
                            { label: '축소', value: 'small' },
                        ]}
                        onChange={(val: 'default' | 'small') => setMapHeight(val)}
                    />
                </BuilderField>

                <BuilderField label="줌 레벨">
                    <BuilderButtonGroup
                        className="w-full"
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

                {showSketch && (
                    <BuilderField label="약도 이미지">
                        {sketchUrl ? (
                            <div className="relative w-full max-w-sm aspect-[4/3] rounded-2xl overflow-hidden border border-gray-100 group bg-gray-50">
                                <Image src={sketchUrl} alt="약도" fill className="object-contain" />
                                <button
                                    onClick={() => setSketchUrl(null)}
                                    className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                >
                                    <Trash2 size={24} />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full max-w-sm aspect-[4/3] border-2 border-dashed border-gray-100 rounded-3xl cursor-pointer hover:bg-gray-50 transition-all group bg-gray-50/50">
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleSketchUpload}
                                />
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <ImagePlus className="text-gray-400 group-hover:text-gray-600 transition-colors" size={24} />
                                </div>
                                <span className="text-[13px] font-bold text-gray-700">약도 이미지 업로드</span>
                                <span className="text-[11px] text-gray-400 mt-1 text-center font-medium opacity-70 px-6 leading-relaxed">직접 그린 약도나 이미지를 업로드하세요</span>
                            </label>
                        )}
                    </BuilderField>
                )}

            </div>

            <BuilderModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                title="주소 검색"
            >
                <div className="h-[400px] w-full border border-gray-100 rounded-xl overflow-hidden">
                    <DaumPostcodeEmbed
                        onComplete={handleComplete}
                        style={{ height: '100%' }}
                        autoClose={false}
                    />
                </div>
            </BuilderModal>
        </AccordionItem>
    );
});

export default LocationSection;

// Helper for Daum Postcode is same as before

