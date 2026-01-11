import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Wedding Invitation Studio',
        short_name: 'Wedding Studio',
        description: '심플하고 아름다운 모바일 청첩장 제작 플랫폼',
        start_url: '/',
        display: 'standalone',
        background_color: '#F9F8E6',
        theme_color: '#F9F8E6',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
            {
                src: '/icon.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
