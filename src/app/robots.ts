import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

const DISALLOW_PATHS = [
  '/api',
  '/builder',
  '/mypage',
  '/private',
  '/v',
  '/preview',
  '/design',
  '/cal-ui-test',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOW_PATHS,
      },
      {
        userAgent: 'Yeti',
        allow: '/',
        disallow: DISALLOW_PATHS,
      },
    ],
    host: SITE_URL,
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
