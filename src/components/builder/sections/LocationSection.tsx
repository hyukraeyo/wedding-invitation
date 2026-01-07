import React, { ChangeEvent } from 'react';
import { MapPin, ImagePlus, Trash2 } from 'lucide-react';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import Image from 'next/image';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function LocationSection({ isOpen, onToggle }: SectionProps) {
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

    // 임시: Kakao Map Level (UI 15~19) -> Actual Level (Example mapping, assuming 15 is detail, 19 is more detailed? or standard zoom. 
    // Standard Kakao: 1(close) ~ 14(far). 
    // If the UI shows 15, 16, 17, 18, 19, let's treat them as discrete levels for the UI.
    // We will save them as number. 
    // It's possible the user thinks of Google maps where 15-19 are street level.
    // For now, let's just make the UI buttons work.

    const handleSketchUpload = (e: ChangeEvent<HTMLInputElement>) => {
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
                    <label className="w-20 text-sm font-bold text-gray-800 shrink-0">제목</label>
                    <input
                        type="text"
                        value={locationTitle}
                        onChange={(e) => setLocationTitle(e.target.value)}
                        placeholder="오시는 길"
                        className="w-full bg-gray-100 border-none rounded-md px-4 py-3 text-sm text-gray-900 focus:ring-1 focus:ring-gray-300 outline-none"
                    />
                </div>

                {/* 2. 주소 (Address) */}
                <div className="flex items-start">
                    <label className="w-20 text-sm font-bold text-gray-800 shrink-0 mt-3">주소</label>
                    <div className="w-full space-y-2">
                        <div className="flex gap-2">
                            <div className={`flex-1 min-w-0 bg-gray-100 rounded-md px-3 py-3 text-sm truncate cursor-not-allowed ${address ? 'text-gray-900' : 'text-gray-400'}`}>
                                {address || "주소를 검색해주세요"}
                            </div>

                            <button
                                type="button"
                                onClick={handleAddressSearch}
                                className="px-3 py-3 bg-white border border-gray-200 rounded-md text-sm font-bold hover:bg-gray-50 transition-colors whitespace-nowrap text-gray-800"
                            >
                                검색
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3. 예식장명 (Wedding Hall Name) */}
                <div className="flex items-center">
                    <label className="w-20 text-sm font-bold text-gray-800 shrink-0">예식장명</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="예식장 이름 입력"
                        className="w-full bg-gray-100 border-none rounded-md px-4 py-3 text-sm text-gray-900 focus:ring-1 focus:ring-gray-300 outline-none"
                    />
                </div>

                {/* 4. 층과 홀 (Floor & Hall) */}
                <div className="flex items-center">
                    <label className="w-20 text-sm font-bold text-gray-800 shrink-0">층과 홀</label>
                    <input
                        type="text"
                        value={detailAddress}
                        onChange={(e) => setDetailAddress(e.target.value)}
                        placeholder="층과 웨딩홀 이름 입력"
                        className="w-full bg-gray-100 border-none rounded-md px-4 py-3 text-sm text-gray-900 focus:ring-1 focus:ring-gray-300 outline-none"
                    />
                </div>

                {/* 5. 연락처 (Contact) */}
                <div className="flex items-center">
                    <label className="w-20 text-sm font-bold text-gray-800 shrink-0">연락처</label>
                    <input
                        type="text"
                        value={locationContact}
                        onChange={(e) => setLocationContact(e.target.value)}
                        placeholder="예식장 연락처, 02-000-0000"
                        className="w-full bg-gray-100 border-none rounded-md px-4 py-3 text-sm text-gray-900 focus:ring-1 focus:ring-gray-300 outline-none"
                    />
                </div>

                <hr className="border-gray-100 my-6" />

                {/* 5.5 지도 종류 (Map Type) */}
                <div className="flex items-center">
                    <label className="w-20 text-sm font-medium text-gray-700 shrink-0">지도 종류</label>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setMapType('kakao')}
                            className={`px-4 py-2 text-sm border rounded hover:bg-gray-50 transition-colors ${mapType === 'kakao' ? 'border-gray-800 font-bold text-gray-900 bg-white' : 'border-gray-200 text-gray-400 bg-white'}`}
                        >
                            카카오맵
                        </button>
                        <button
                            onClick={() => setMapType('naver')}
                            className={`px-4 py-2 text-sm border rounded hover:bg-gray-50 transition-colors ${mapType === 'naver' ? 'border-gray-800 font-bold text-gray-900 bg-white' : 'border-gray-200 text-gray-400 bg-white'}`}
                        >
                            네이버지도
                        </button>
                    </div>
                </div>

                {/* 6. 지도 표시 (Show Map) */}
                <div className="flex items-center">
                    <label className="w-20 text-sm font-medium text-gray-700 shrink-0">지도 표시</label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showMap}
                            onChange={(e) => setShowMap(e.target.checked)}
                            className="w-5 h-5 rounded border-gray-300 text-gray-800 focus:ring-gray-800"
                        />
                        <span className="text-sm text-gray-500">지도를 표시합니다.</span>
                    </label>
                </div>

                {/* 7. 지도 잠금 (Lock Map) */}
                <div className="flex items-center">
                    <label className="w-20 text-sm font-medium text-gray-700 shrink-0">지도 잠금</label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={lockMap}
                            onChange={(e) => setLockMap(e.target.checked)}
                            className="w-5 h-5 rounded border-gray-300 accent-forest-green focus:ring-forest-green"
                            // Custom checkbox style/color requires Tailwind form plugin or custom CSS, using standard for now but accent black
                            style={{ accentColor: 'black' }}
                        />
                        <span className="text-sm text-gray-500">지도 터치 및 줌 조정이 안되도록 막습니다.</span>
                    </label>
                </div>

                {/* 8. 내비게이션 (Navigation) */}
                <div className="flex items-center">
                    <label className="w-20 text-sm font-medium text-gray-700 shrink-0">내비게이션</label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showNavigation}
                            onChange={(e) => setShowNavigation(e.target.checked)}
                            className="w-5 h-5 rounded border-gray-300 accent-forest-green focus:ring-forest-green"
                            style={{ accentColor: 'black' }}
                        />
                        <span className="text-sm text-gray-500">내비 앱 바로가기 버튼 표시 (카카오,티맵,네이버)</span>
                    </label>
                </div>

                {/* 9. 지도 높이 (Map Height) */}
                <div className="flex items-center">
                    <label className="w-20 text-sm font-medium text-gray-700 shrink-0">지도 높이</label>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setMapHeight('default')}
                            className={`px-4 py-2 text-sm border rounded hover:bg-gray-50 transition-colors ${mapHeight === 'default' ? 'border-gray-800 font-bold text-gray-900 bg-white' : 'border-gray-200 text-gray-400 bg-white'}`}
                        >
                            기본
                        </button>
                        <button
                            onClick={() => setMapHeight('small')}
                            className={`px-4 py-2 text-sm border rounded hover:bg-gray-50 transition-colors ${mapHeight === 'small' ? 'border-gray-800 font-bold text-gray-900 bg-white' : 'border-gray-200 text-gray-400 bg-white'}`}
                        >
                            축소
                        </button>
                    </div>
                </div>

                {/* 10. 줌 레벨 (Zoom Level) */}
                <div className="flex items-center">
                    <label className="w-20 text-sm font-medium text-gray-700 shrink-0">줌 레벨</label>
                    <div className="flex gap-2">
                        {[15, 16, 17, 18, 19].map((level) => (
                            <button
                                key={level}
                                onClick={() => setMapZoom(level)} // Store existing numbers for now
                                className={`
                                    w-10 h-10 flex items-center justify-center text-sm border rounded hover:bg-gray-50 transition-colors
                                     ${mapZoom === level ? 'border-gray-800 font-bold text-gray-900 bg-white' : 'border-gray-200 text-gray-400 bg-white'}
                                `}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>

                <hr className="border-gray-100 my-6" />

                {/* 11. 약도 (Sketch Map) */}
                <div className="flex items-start">
                    <label className="w-20 text-sm font-medium text-gray-700 shrink-0 mt-0.5">약도</label>
                    <div className="w-full space-y-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showSketch}
                                onChange={(e) => setShowSketch(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 accent-forest-green focus:ring-forest-green"
                                style={{ accentColor: 'black' }}
                            />
                            <span className="text-sm text-gray-800">약도 사진 표시</span>
                        </label>

                        {showSketch && (
                            <div className="mt-2">
                                {sketchUrl ? (
                                    <div className="relative w-full max-w-[200px] aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 group">
                                        <Image src={sketchUrl} alt="약도" fill className="object-cover" />
                                        <button
                                            onClick={() => setSketchUrl(null)}
                                            className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full max-w-[200px] aspect-[4/3] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors">
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleSketchUpload}
                                        />
                                        <ImagePlus className="text-gray-400 mb-2" size={24} />
                                        <span className="text-xs text-gray-500">약도 이미지 업로드</span>
                                    </label>
                                )}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </AccordionItem>
    );
}

// Helper for Daum Postcode is same as before

