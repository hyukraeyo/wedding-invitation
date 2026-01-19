'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function MapRedirectContent() {
    const searchParams = useSearchParams();
    const q = searchParams.get('q');

    useEffect(() => {
        if (q) {
            const encodedQuery = encodeURIComponent(q);
            window.location.href = `https://map.kakao.com/link/search/${encodedQuery}`;
        } else {
            window.location.href = '/';
        }
    }, [q]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif',
            color: '#333'
        }}>
            <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #FBC02D',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '1rem'
            }} />
            <p style={{ fontSize: '1rem', fontWeight: 500 }}>지도로 이동 중입니다...</p>
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

export default function MapRedirectPage() {
    return (
        <Suspense fallback={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <p>잠시만 기다려주세요...</p>
            </div>
        }>
            <MapRedirectContent />
        </Suspense>
    );
}
