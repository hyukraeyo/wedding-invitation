import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';
import { Copy } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { NaverIcon, KakaoIcon } from '../../common/MapIcons';

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
                src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
                onLoad={() => setIsNaverLoaded(true)}
            />

            {/* Header */}
            <div className="text-center space-y-4 mb-2">
                <div className="flex flex-col items-center space-y-2">
                    <span
                        className="tracking-[0.4em] text-forest-green/40 font-medium uppercase"
                        style={{ fontSize: 'calc(10px * var(--font-scale))' }}
                    >{locationTitle || 'LOCATION'}</span>
                    <div className="w-8 h-[1px] bg-forest-green opacity-10"></div>
                </div>
                <h3
                    className="font-serif text-gray-800 font-medium"
                    style={{ fontSize: 'calc(20px * var(--font-scale))' }}
                >{location}</h3>
                <div className="space-y-1">
                    <p
                        className="text-gray-500 font-light leading-relaxed tracking-tight"
                        style={{ fontSize: 'calc(13px * var(--font-scale))' }}
                    >
                        {address} {detailAddress}
                    </p>
                    {locationContact && (
                        <p
                            className="text-gray-400 font-light italic"
                            style={{ fontSize: 'calc(11px * var(--font-scale))' }}
                        >Tel. {locationContact}</p>
                    )}
                </div>
            </div>

            {/* Map Area */}
            {showMap && (
                <div className={`w-full ${heightClass} rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative bg-gray-50`}>
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
                            <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-2">
                                <div className="w-8 h-8 rounded-full border-2 border-gray-100 border-t-forest-green animate-spin"></div>
                                <span
                                    className="tracking-widest uppercase"
                                    style={{ fontSize: 'calc(10px * var(--font-scale))' }}
                                >Loading Map...</span>
                            </div>
                        )
                    ) : (
                        <div className="w-full h-full relative">
                            <div ref={naverMapRef} className="w-full h-full" />
                            {!isNaverLoaded && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 gap-2 bg-gray-50">
                                    <div className="w-8 h-8 rounded-full border-2 border-gray-100 border-t-forest-green animate-spin"></div>
                                    <span
                                        className="tracking-widest uppercase"
                                        style={{ fontSize: 'calc(10px * var(--font-scale))' }}
                                    >Loading Map...</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Sketch Map Area */}
            {showSketch && sketchUrl && (
                <div className="w-full rounded-2xl overflow-hidden border border-gray-100 shadow-xs bg-white p-2">
                    <Image
                        src={sketchUrl}
                        alt="약도"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-full h-auto object-contain rounded-xl"
                    />
                </div>
            )}

            {/* Navigation Buttons */}
            {showNavigation && (
                <div className="flex gap-3 mt-4">
                    <button
                        onClick={handleCopyAddress}
                        className="flex-1 py-3 bg-white border border-gray-100 rounded-xl text-gray-500 font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                        style={{ fontSize: 'calc(11px * var(--font-scale))' }}
                    >
                        <Copy size={12} className="opacity-40" />
                        주소 복사
                    </button>
                    <a
                        href={`https://map.kakao.com/link/search/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3 bg-white border border-gray-100 rounded-xl text-gray-500 font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                        style={{ fontSize: 'calc(11px * var(--font-scale))' }}
                    >
                        <KakaoIcon size={12} showBackground={false} />
                        카카오맵
                    </a>
                    <a
                        href={`https://map.naver.com/v5/search/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3 bg-white border border-gray-100 rounded-xl text-gray-500 font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                        style={{ fontSize: 'calc(11px * var(--font-scale))' }}
                    >
                        <NaverIcon size={12} />
                        네이버 지도
                    </a>
                </div>
            )}
        </div>
    );
}
