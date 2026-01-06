import React from 'react';
import { MapPin, Search } from 'lucide-react';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function LocationSection({ isOpen, onToggle }: SectionProps) {
    const {
        location, setLocation,
        address, setAddress,
        detailAddress, setDetailAddress
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

    return (
        <AccordionItem
            title="예식 장소"
            icon={MapPin}
            isOpen={isOpen}
            onToggle={onToggle}
            isCompleted={!!location && !!address}
        >
            <div className="space-y-4">
                {/* Wedding Hall Name */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">장소명 (웨딩홀)</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-forest-green"
                        placeholder="예: 더 컨벤션 웨딩홀"
                    />
                </div>

                {/* Address Search */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">주소</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={address}
                            readOnly
                            className="flex-1 px-4 py-3 bg-gray-50 border-none rounded-lg text-sm text-gray-500 cursor-not-allowed"
                            placeholder="주소를 검색해주세요"
                        />
                        <button
                            type="button"
                            onClick={handleAddressSearch}
                            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-black transition-colors flex items-center gap-2 whitespace-nowrap"
                        >
                            <Search size={16} />
                            주소 검색
                        </button>
                    </div>
                </div>

                {/* Detail Address */}
                <div className="space-y-2">
                    <input
                        type="text"
                        value={detailAddress}
                        onChange={(e) => setDetailAddress(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-forest-green"
                        placeholder="상세 주소 (예: 2층 그랜드볼룸)"
                    />
                </div>

                {/* Info */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-3">
                    <div className="p-2 bg-white rounded-full border border-blue-100 mt-1">
                        <MapPin size={16} className="text-blue-500" />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-blue-900 mb-1">카카오맵 연동 안내</h4>
                        <p className="text-xs text-blue-800 leading-relaxed">
                            입력하신 주소를 기반으로 청첩장에 카카오맵이 표시됩니다.<br />
                            <span className="opacity-70">※ 정확한 지도 표시를 위해 상세 주소까지 꼼꼼히 확인해주세요.</span>
                        </p>
                    </div>
                </div>
            </div>
        </AccordionItem>
    );
}
