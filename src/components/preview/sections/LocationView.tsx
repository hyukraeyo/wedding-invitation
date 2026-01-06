import React, { useEffect, useState, useRef } from 'react';
import Script from 'next/script';
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';
import { MapPin, Navigation, Copy } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';

export default function LocationView() {
    const {
        location, address, detailAddress,
        locationTitle, locationContact,
        mapType, mapHeight, mapZoom, showMap, showNavigation,
        showSketch, sketchUrl, lockMap
    } = useInvitationStore();
    const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 37.5665, lng: 126.9780 }); // Default: Seoul City Hall

    // Map Height Logic
    const heightClass = mapHeight === 'small' ? 'h-[200px]' : 'h-[300px]';
    // Zoom Logic
    const kakaoLevel = 22 - (mapZoom || 17);
    const naverZoom = mapZoom || 16;

    const [loading, error] = useKakaoLoader({
        appkey: process.env.NEXT_PUBLIC_KAKAO_APP_KEY!,
        libraries: ["services", "clusterer"],
    });

    const naverMapRef = useRef<HTMLDivElement>(null);
    const [isNaverLoaded, setIsNaverLoaded] = useState(false);

    useEffect(() => {
        if (showMap && mapType === 'naver' && isNaverLoaded && naverMapRef.current && coords && window.naver?.maps) {
            const mapOptions = {
                center: new window.naver.maps.LatLng(coords.lat, coords.lng),
                zoom: naverZoom,
                draggable: !lockMap,
                scrollWheel: !lockMap,
            };
            const map = new window.naver.maps.Map(naverMapRef.current, mapOptions);

            new window.naver.maps.Marker({
                position: new window.naver.maps.LatLng(coords.lat, coords.lng),
                map: map,
            });
        }
    }, [mapType, isNaverLoaded, coords, naverZoom, showMap, lockMap]);

    useEffect(() => {
        if (!loading && window.kakao && window.kakao.maps && window.kakao.maps.services && address) {
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
        <div className="w-full space-y-8">
            {/* Load Naver Map Script */}
            <Script
                src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
                onLoad={() => setIsNaverLoaded(true)}
            />

            {/* Header */}
            <div className="text-center">
                <span className="text-[10px] tracking-[0.3em] text-gray-400 uppercase block mb-2">{locationTitle || 'LOCATION'}</span>
                <h3 className="font-serif text-xl mb-2 text-gray-800">{location}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                    {address}<br />
                    {detailAddress}
                </p>
                {locationContact && (
                    <p className="text-xs text-gray-400 mt-2">Tel. {locationContact}</p>
                )}
            </div>

            {/* Map Area */}
            {showMap && (
                <div className={`w-full ${heightClass} rounded-lg overflow-hidden border border-gray-100 shadow-sm relative bg-gray-50`}>
                    {mapType === 'kakao' ? (
                        !loading ? (
                            <Map
                                center={coords}
                                style={{ width: '100%', height: '100%' }}
                                level={kakaoLevel}
                                draggable={!lockMap}
                                zoomable={!lockMap}
                            >
                                <MapMarker position={coords} />
                            </Map>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                                <MapPin size={32} />
                                <span className="text-xs">카카오 지도를 불러오는 중...</span>
                            </div>
                        )
                    ) : (
                        <div className="w-full h-full relative">
                            <div ref={naverMapRef} className="w-full h-full" />
                            {!isNaverLoaded && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-2 bg-gray-50">
                                    <MapPin size={32} />
                                    <span className="text-xs">네이버지도를 불러오는 중...</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Sketch Map Area */}
            {showSketch && sketchUrl && (
                <div className="w-full rounded-lg overflow-hidden border border-gray-100 shadow-xs">
                    <img src={sketchUrl} alt="약도" className="w-full h-auto object-contain" />
                </div>
            )}

            {/* Navigation Buttons */}
            {showNavigation && (
                <div className="flex gap-2">
                    <button
                        onClick={handleCopyAddress}
                        className="flex-1 py-3 bg-gray-50 rounded-lg text-[11px] text-gray-600 font-medium flex flex-col items-center justify-center gap-1 hover:bg-gray-100 transition-colors"
                    >
                        <Copy size={14} className="opacity-60" />
                        주소 복사
                    </button>
                    <a
                        href={`https://map.kakao.com/link/search/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3 bg-[#FAE100] rounded-lg text-[11px] text-[#3C1E1E] font-medium flex flex-col items-center justify-center gap-1 hover:bg-[#FCE620] transition-colors"
                    >
                        <MapPin size={14} />
                        카카오맵
                    </a>
                    <a
                        href={`https://map.naver.com/v5/search/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3 bg-[#03C75A] rounded-lg text-[11px] text-white font-medium flex flex-col items-center justify-center gap-1 hover:bg-[#02b351] transition-colors"
                    >
                        <Navigation size={14} />
                        네이버지도
                    </a>
                </div>
            )}
        </div>
    );
}
