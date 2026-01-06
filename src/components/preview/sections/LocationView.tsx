import React, { useEffect, useState } from 'react';
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';
import { MapPin, Navigation, Copy } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';

export default function LocationView() {
    const { location, address, detailAddress } = useInvitationStore();
    const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 37.5665, lng: 126.9780 }); // Default: Seoul City Hall

    const [loading, error] = useKakaoLoader({
        appkey: process.env.NEXT_PUBLIC_KAKAO_APP_KEY!,
        libraries: ["services", "clusterer"],
    });

    useEffect(() => {
        if (!loading && window.kakao && window.kakao.maps && window.kakao.maps.services && address) {
            // Geocoding
            const geocoder = new window.kakao.maps.services.Geocoder();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            geocoder.addressSearch(address, (result: any, status: any) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    const newCoords = { lat: parseFloat(result[0].y), lng: parseFloat(result[0].x) };
                    setCoords(newCoords);
                }
            });
        }
    }, [address, loading]);

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(`${address} ${detailAddress}`);
        alert('주소가 복사되었습니다.');
    };

    if (error) return <div>Error loading map</div>;

    return (
        <div className="w-full">
            <div className="text-center mb-6">
                <h3 className="font-serif text-xl mb-2 text-gray-800">{location}</h3>
                <p className="text-sm text-gray-600">{address} {detailAddress}</p>
            </div>

            <div className="w-full h-[300px] rounded-lg overflow-hidden border border-gray-100 shadow-sm relative bg-gray-50">
                {!loading ? (
                    <Map
                        center={coords}
                        style={{ width: '100%', height: '100%' }}
                        level={4}
                    >
                        <MapMarker position={coords}>
                            <div style={{ padding: "5px", color: "#000" }}>
                                {location} <br />
                                <a
                                    href={`https://map.kakao.com/link/map/${location},${coords.lat},${coords.lng}`}
                                    style={{ color: "blue" }}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    큰지도보기
                                </a>{" "}
                                <a
                                    href={`https://map.kakao.com/link/to/${location},${coords.lat},${coords.lng}`}
                                    style={{ color: "blue" }}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    길찾기
                                </a>
                            </div>
                        </MapMarker>
                    </Map>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                        <MapPin size={32} />
                        <span className="text-xs">지도를 불러오는 중...</span>
                    </div>
                )}
            </div>

            <div className="flex gap-2 mt-4">
                <button
                    onClick={handleCopyAddress}
                    className="flex-1 py-3 bg-gray-100 rounded-lg text-xs text-gray-700 font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                >
                    <Copy size={14} />
                    주소 복사
                </button>
                <a
                    href={`https://map.kakao.com/link/search/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 bg-[#FAE100] rounded-lg text-xs text-[#3C1E1E] font-medium flex items-center justify-center gap-2 hover:bg-[#FCE620] transition-colors"
                >
                    <MapPin size={14} />
                    카카오맵
                </a>
                <a
                    href={`https://map.naver.com/v5/search/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 bg-[#03C75A] rounded-lg text-xs text-white font-medium flex items-center justify-center gap-2 hover:bg-[#02b351] transition-colors"
                >
                    <Navigation size={14} />
                    네이버지도
                </a>
            </div>
        </div>
    );
}
