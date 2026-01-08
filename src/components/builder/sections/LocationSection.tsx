import React from 'react';
import { MapPin, ImagePlus, Trash2, Search } from 'lucide-react';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { BuilderInput } from '../BuilderInput';
import Image from 'next/image';
import { NaverIcon, KakaoIcon } from '../../common/MapIcons';
import { BuilderButton } from '../BuilderButton';
import { BuilderButtonGroup } from '../BuilderButtonGroup';
import { BuilderToggle } from '../BuilderToggle';
import { BuilderLabel } from '../BuilderLabel';

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

    const openPostcode = useDaumPostcodePopup();

    const handleComplete = (data: { address: string; addressType: string; bname: string; buildingName: string }) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') extraAddress += data.bname;
            if (data.buildingName !== '') extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }

        setAddress(fullAddress);
    };

    const handleAddressSearch = () => {
        openPostcode({ onComplete: handleComplete });
    };

    const handleSketchUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setSketchUrl(url);
        }
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
                <div className="flex items-center">
                    <label className="w-20 text-[13px] font-bold text-gray-800 shrink-0">제목</label>
                    <BuilderInput
                        type="text"
                        value={locationTitle}
                        onChange={(e) => setLocationTitle(e.target.value)}
                        placeholder="오시는 길"
                    />
                </div>

                {/* 2. 주소 (Address) */}
                <div className="flex items-start">
                    <label className="w-20 text-[13px] font-bold text-gray-800 shrink-0 mt-3.5">주소</label>
                    <div className="w-full space-y-2">
                        <div className="flex gap-2">
                            <div
                                onClick={handleAddressSearch}
                                className={`flex-1 min-w-0 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[14px] truncate cursor-pointer hover:bg-white hover:border-forest-green hover:ring-4 hover:ring-forest-green/5 transition-all
                                ${address ? 'text-gray-900 border-gray-200' : 'text-gray-300'}`}
                            >
                                {address || "주소를 검색해주세요"}
                            </div>

                            <BuilderButton
                                variant="outline"
                                onClick={handleAddressSearch}
                                className="shrink-0 h-[48px] w-[48px] p-0"
                                title="주소 검색"
                            >
                                <Search size={18} />
                            </BuilderButton>
                        </div>
                    </div>
                </div>

                {/* 3. 예식장명 (Wedding Hall Name) */}
                <div className="flex items-center">
                    <label className="w-20 text-[13px] font-bold text-gray-800 shrink-0">예식장명</label>
                    <BuilderInput
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="예식장 이름 입력"
                    />
                </div>

                {/* 4. 층과 홀 (Floor & Hall) */}
                <div className="flex items-center">
                    <label className="w-20 text-[13px] font-bold text-gray-800 shrink-0">층과 홀</label>
                    <BuilderInput
                        type="text"
                        value={detailAddress}
                        onChange={(e) => setDetailAddress(e.target.value)}
                        placeholder="층과 웨딩홀 이름 입력"
                    />
                </div>

                {/* 5. 연락처 (Contact) */}
                <div className="flex items-center">
                    <label className="w-20 text-[13px] font-bold text-gray-800 shrink-0">연락처</label>
                    <BuilderInput
                        type="text"
                        value={locationContact}
                        onChange={(e) => setLocationContact(e.target.value)}
                        placeholder="예식장 연락처, 02-000-0000"
                    />
                </div>

                <hr className="border-gray-100 my-6" />

                <div className="flex items-center">
                    <label className="w-20 text-[13px] font-bold text-gray-800 shrink-0">지도 종류</label>
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
                </div>

                <div className="flex flex-wrap gap-2 px-1 pt-2">
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

                <div className="space-y-6 pt-4">
                    {/* 9. 지도 높이 (Map Height) */}
                    <div className="flex items-center">
                        <BuilderLabel className="w-20 shrink-0 !mb-0">지도 높이</BuilderLabel>
                        <BuilderButtonGroup
                            className="flex-1"
                            value={mapHeight}
                            options={[
                                { label: '기본', value: 'default' },
                                { label: '축소', value: 'small' },
                            ]}
                            onChange={(val: 'default' | 'small') => setMapHeight(val)}
                        />
                    </div>

                    {/* 10. 줌 레벨 (Zoom Level) */}
                    <div className="flex items-center">
                        <BuilderLabel className="w-20 shrink-0 !mb-0">줌 레벨</BuilderLabel>
                        <BuilderButtonGroup
                            className="flex-1"
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
                    </div>
                </div>

                {showSketch && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <BuilderLabel>약도 이미지</BuilderLabel>
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
                            <label className="flex flex-col items-center justify-center w-full max-w-sm aspect-[4/3] border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-forest-green/40 hover:bg-gray-50 transition-all group">
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleSketchUpload}
                                />
                                <div className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <ImagePlus className="text-gray-400 group-hover:text-forest-green" size={24} />
                                </div>
                                <span className="text-sm font-bold text-gray-700">약도 이미지 업로드</span>
                                <span className="text-xs text-gray-400 mt-1 text-center">직접 그린 약도나 이미지를 업로드하세요</span>
                            </label>
                        )}
                    </div>
                )}

            </div>
        </AccordionItem>
    );
});

export default LocationSection;

// Helper for Daum Postcode is same as before

