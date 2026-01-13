import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: '바나나웨딩 (Banana Wedding)',
        short_name: '바나나웨딩',
        description: '유통기한 없는 달콤한 시작, 바나나웨딩',
        start_url: '/',
        display: 'standalone',
        background_color: '#F9F8E6',
        theme_color: '#F9F8E6',
        icons: [
            {
                src: '/logo.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/logo.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
